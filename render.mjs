// render.mjs: renders studio.html in headless Chrome.
// Derived from ClaudeAnimationBase's render.mjs (MIT, John Heibel); plate pass, act/scene ranges and --gpu added.
//
//   Plates (painted once; every other mode runs this first for any plate that is missing or changed):
//     node render.mjs --plates [--only=key1,key2] [--force]
//   Look at it (open the images with the Read tool):
//     node render.mjs --sheet=0.5,1,1.5,2 [--cols=4] [--w=480] --out=out/check/a.jpg        contact sheet of chosen times
//     node render.mjs --scene=1.3 --sheet=0,2,4 --out=...                                    times relative to a scene start
//     node render.mjs --strip=2.0:2.5 [--cols=6] [--w=320] --out=out/check/strip.jpg        EVERY frame in a stretch
//     node render.mjs --sheet=2.1,2.2 --crop=760,300,400,400 --w=600 --out=out/check/face.jpg full-res crops
//     node render.mjs --stills=1.2,3.4 --out=out/stills                                     full-res PNGs
//     node render.mjs --loop=sheet_awa --stills=0.5 --out=out/sheets                        a standalone loop (model sheets)
//   Make the video:
//     node render.mjs --frames [--range=0:8 | --scene=1.3] [--workers=2]                    JPEG frames → out/frames (resumable)
//     node render.mjs --encode --out=out/video.mp4 [--audio=out/mix.wav]                    out/frames → MP4
//   GPU: software WebGL (SwiftShader) by default on Linux; --gpu uses the platform's GPU path, --gpu-angle=vulkan|gl-egl.
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, statSync, renameSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const CHROMES = [args.chrome, process.env.CHROME_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  'C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
const CHROME = CHROMES.find(p => p && existsSync(p));
if (!CHROME) { console.error('Chrome not found: pass --chrome=<path> or set CHROME_PATH'); process.exit(1); }
const fps = +(args.fps || 24), FRAMES_DIR = 'out/frames', PLATES_DIR = 'out/plates';
const run = (cmd, a) => new Promise((ok, bad) => { const p = spawn(cmd, a, { stdio: 'inherit' }); p.on('close', c => c ? bad(new Error(cmd + ' exited ' + c)) : ok()); });
const times = s => String(s).split(',').map(Number);
const span = s => String(s).split(':').map(Number);
const fields = s => { const out = []; let d = 0, cur = ''; for (const ch of String(s)) { if (ch === ',' && !d) { out.push(cur); cur = ''; continue; } d += ch === '(' ? 1 : ch === ')' ? -1 : 0; cur += ch; } out.push(cur); return out.map(v => isNaN(+v) ? v : +v); };

if (args.encode) {
  const out = args.out || 'out/video.mp4', n = readdirSync(FRAMES_DIR).filter(f => f.endsWith('.jpg')).length, audio = args.audio;
  console.log(`encoding ${n} frames → ${out}${audio ? ' with ' + audio : ''}`);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-stats', '-framerate', String(fps), '-i', `${FRAMES_DIR}/f%05d.jpg`,
    ...(audio ? ['-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000'] : []),
    '-frames:v', String(n), '-c:v', 'libx264', '-preset', 'slow', '-crf', String(args.crf || 20), '-pix_fmt', 'yuv420p', '-r', String(fps), '-movflags', '+faststart', out]);
  console.log('wrote ' + out);
  process.exit(0);
}

const ANGLE = { vulkan: ['--use-angle=vulkan', '--enable-features=Vulkan'], 'gl-egl': ['--use-angle=gl-egl'] };
const gpu = args['gpu-angle'] ? ANGLE[args['gpu-angle']]
  : args.gpu ? (process.platform === 'win32' ? ['--use-angle=d3d11'] : process.platform === 'darwin' ? ['--use-angle=metal'] : ['--use-gl=angle'])
  : process.platform === 'linux' ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : process.platform === 'win32' ? ['--use-angle=d3d11'] : ['--use-angle=metal'];
const sandbox = process.platform === 'linux' ? ['--no-sandbox'] : [];
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: [...sandbox, '--allow-file-access-from-files', '--ignore-gpu-blocklist', ...gpu, '--window-size=1920,1080', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--js-flags=--max-old-space-size=4096']
});
async function openPage(tag = '', query = '') {
  const page = await browser.newPage();
  page.on('console', m => { if (['error', 'warn'].includes(m.type()) && !/INVALID_OPERATION|ERR_CERT|favicon/.test(m.text())) console.log(`[page${tag}]`, m.text()); });
  page.on('pageerror', e => console.log(`[page error${tag}]`, e.message));
  await page.goto(pathToFileURL(resolve('studio.html')).href + '?render' + query, { waitUntil: 'load' });
  await page.waitForFunction('window.ready === true', { timeout: 180000 });
  if (args.loop) {
    const ok = await page.evaluate(name => { if (!LOOPS[name]) return false; window.LOOP = LOOPS[name]; return true; }, args.loop);
    if (!ok) { console.error(`no loop named "${args.loop}"`); process.exit(1); }
  }
  return page;
}

// ---------- plates ----------
async function plates() {
  mkdirSync(PLATES_DIR, { recursive: true });
  // one plate pass at a time (several scene authors may render at once): a directory lock
  const LOCK = `${PLATES_DIR}/.lock`;
  for (let i = 0; ; i++) { try { mkdirSync(LOCK); break; } catch { if (i === 0) console.log('waiting for another plate pass…'); if (i > 3600) { console.error('plate lock stuck: remove ' + LOCK); process.exit(1); } await new Promise(r => setTimeout(r, 1000)); } }
  const unlock = () => { try { rmSync(LOCK, { recursive: true }); } catch {} };
  process.on('exit', unlock); process.on('SIGINT', () => { unlock(); process.exit(1); });
  try { await platesLocked(); } finally { unlock(); }
}
async function platesLocked() {
  if (!existsSync(`${PLATES_DIR}/manifest.js`)) writeFileSync(`${PLATES_DIR}/manifest.js`, 'window.PLATE_FILES = {};\n');
  const probe = await openPage('', '&noplates');
  const defs = await probe.evaluate(() => Object.entries(PLATES).map(([k, d]) => ({ k, n: d.variants || 1, sig: [d.w, d.h, d.res, d.variants, !!d.c2a, d.paint.toString(), d.mask ? d.mask.toString() : '', d.maskBg || '', (d.deps || []).map(f => String(window[f])).join('')].join('|') })));
  await probe.close();
  const hashes = existsSync(`${PLATES_DIR}/hashes.json`) ? JSON.parse(readFileSync(`${PLATES_DIR}/hashes.json`, 'utf8')) : {};
  const only = args.only ? String(args.only).split(',') : null, todo = [];
  for (const d of defs) {
    const h = createHash('sha1').update(d.sig).digest('hex').slice(0, 12);
    for (let v = 0; v < d.n; v++) {
      const id = `${d.k}#${v}`, f = `${PLATES_DIR}/${d.k.replace(/[^\w.-]/g, '_')}_${v}.png`;
      if (only && !only.includes(d.k)) continue;
      if (!args.force && hashes[id] === h && existsSync(f)) continue;
      todo.push({ id, f, h });
    }
  }
  if (todo.length) console.log(`painting ${todo.length} plate(s)…`);
  for (const p of todo) {
    const t0 = Date.now(), page = await openPage(' plate', '&plate=' + encodeURIComponent(p.id));
    const url = await page.evaluate(id => window.paintPlate(id), p.id);
    writeFileSync(p.f, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64')); await page.close();
    hashes[p.id] = p.h; writeFileSync(`${PLATES_DIR}/hashes.json`, JSON.stringify(hashes, null, 1));
    console.log(`  ${p.id} → ${p.f}  ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  }
  const files = {};
  for (const d of defs) for (let v = 0; v < d.n; v++) { const f = `${PLATES_DIR}/${d.k.replace(/[^\w.-]/g, '_')}_${v}.png`; if (existsSync(f)) files[`${d.k}#${v}`] = f; }
  writeFileSync(`${PLATES_DIR}/manifest.js`, 'window.PLATE_FILES = ' + JSON.stringify(files, null, 1) + ';\n');
}
if (!args['no-plates']) await plates();
if (args.plates) { await browser.close(); process.exit(0); }

const frameOf = async (page, t, type, q) => {
  const url = await page.evaluate((t, type, q) => window.renderAt(t, type, q), t, type, q);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};
const lengthOf = page => page.evaluate(() => window.LOOP ? window.LOOP.len : DUR);
const sceneSpan = async (page, id) => page.evaluate(id => { const s = TIMING.scenes.find(x => x.id === id); return s ? [s.start, s.start + s.dur] : null; }, id);

if (args.sheet || args.strip) {
  const page = await openPage(), out = args.out || 'out/check/sheet.jpg'; mkdirSync(dirname(out), { recursive: true });
  const base = args.scene ? (await sceneSpan(page, String(args.scene)))[0] : 0;
  let ts;
  if (args.strip) { const [a, b] = span(args.strip); ts = []; for (let i = Math.round((base + a) * fps); i <= Math.round((base + b) * fps); i++) ts.push(i / fps); }
  else ts = times(args.sheet).map(v => base + v);
  const crop = args.crop ? times(args.crop) : null, at = args['crop-at'] ? fields(args['crop-at']) : null;
  const { url, ms } = await page.evaluate((ts, c, w, crop, at) => window.renderSheet(ts, c, w, crop, at), ts, +(args.cols || (args.strip ? 6 : 3)), +(args.w || (args.strip ? 320 : 640)), crop, at);
  writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(`${out}  (${ts.length} frames)  ms/frame: ${ms.join(' ')}`);
} else if (args.stills) {
  const page = await openPage(), out = args.out || 'out/stills'; mkdirSync(out, { recursive: true });
  const base = args.scene ? (await sceneSpan(page, String(args.scene)))[0] : 0;
  console.log('GPU:', await page.evaluate(() => window.gpuInfo()));
  for (const s of times(args.stills)) {
    const t0 = Date.now(), buf = await frameOf(page, base + s, args.jpg ? 'image/jpeg' : 'image/png', .93);
    const f = `${out}/${args.name || (args.loop ? args.loop : 't' + (base + s).toFixed(2).replace('.', '_'))}${times(args.stills).length > 1 ? '_' + s : ''}.${args.jpg ? 'jpg' : 'png'}`; writeFileSync(f, buf);
    console.log(`${f}  ${Date.now() - t0} ms`);
  }
} else if (args.frames) {
  const probe = await openPage(), len = await lengthOf(probe);
  let [a, b] = args.range ? span(args.range) : [0, len];
  if (args.scene) [a, b] = await sceneSpan(probe, String(args.scene));
  await probe.close();
  const workers = +(args.workers || 1);
  mkdirSync(FRAMES_DIR, { recursive: true });
  const first = Math.round(a * fps), last = Math.min(Math.round(len * fps) - 1, Math.round(b * fps) - 1);
  const todo = []; for (let i = first; i <= last; i++) { const f = `${FRAMES_DIR}/f${String(i).padStart(5, '0')}.jpg`; if (args.force || !existsSync(f) || statSync(f).size < 1000) todo.push(i); }
  console.log(`${todo.length} frames to render (${last - first + 1 - todo.length} already done), ${workers} worker(s)`);
  let next = 0, done = 0; const start = Date.now();
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const page = await openPage('#' + w);
    while (next < todo.length) {
      const i = todo[next++], f = `${FRAMES_DIR}/f${String(i).padStart(5, '0')}.jpg`;
      const buf = await frameOf(page, i / fps, 'image/jpeg', .94);
      writeFileSync(f + '.tmp', buf); renameSync(f + '.tmp', f);
      if (++done % 24 === 0 || done === todo.length) {
        const el = (Date.now() - start) / 1000;
        console.log(`frame ${done}/${todo.length}  ${(el / done * 1000).toFixed(0)} ms/frame effective  eta ${((todo.length - done) * el / done / 60).toFixed(1)} min`);
      }
    }
  }));
} else if (!args.plates) {
  console.log('nothing to do: see the usage notes at the top of render.mjs');
}
await browser.close();
