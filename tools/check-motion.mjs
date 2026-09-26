// check-motion.mjs: lists frames where a tracked value jumps more than a limit between two frames (a "pop").
// After clawd-video's tool (aadil6971/clawd-video, used with permission and credit), adapted to this engine:
// each scene may register track(st, S) → { name: number } (see scene() in src/timeline.js).
//   node tools/check-motion.mjs [--scene=1.4 | --range=0:30]
// Limits: x/y-like names 60 px per frame, sq/s/scale 0.25, anything else 0.7 (angles in rad).
import puppeteer from 'puppeteer-core';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const b = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, args: ['--no-sandbox', '--allow-file-access-from-files', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const pg = await b.newPage();
pg.on('pageerror', e => console.error('pageerror', e.message));
await pg.goto(pathToFileURL(resolve('studio.html')).href + '?render&noplates');
await pg.waitForFunction('window.ready === true', { timeout: 120000 });
const rows = await pg.evaluate(a => {
  let [t0, t1] = [0, DUR];
  if (a.scene) { const s = TIMING.scenes.find(x => x.id === a.scene); [t0, t1] = [s.start, s.start + s.dur]; }
  if (a.range) [t0, t1] = a.range.split(':').map(Number);
  const out = []; for (let i = Math.round(t0 * 24); i < Math.round(t1 * 24); i++) out.push({ i, ...window.trackAt(i / 24) });
  return out;
}, args);
await b.close();
const lim = k => /(^|_)(x|y)$/i.test(k) || /^[xy]\d*$/i.test(k) ? 60 : /(^|_)(sq|s|scale)$/i.test(k) ? .25 : .7;
let n = 0;
for (let j = 1; j < rows.length; j++) {
  const a = rows[j - 1], c = rows[j]; if (!a.v || !c.v || a.scene !== c.scene) continue;
  const d = []; for (const k of Object.keys(c.v)) { const v = Math.abs(c.v[k] - (a.v[k] ?? c.v[k])); if (v > lim(k)) d.push(`${k}:${v.toFixed(2)}`); }
  if (d.length) { n++; console.log(`frame ${c.i} t=${(c.i / 24).toFixed(3)} (scène ${c.scene})`, d.join(' ')); }
}
console.log(n ? `${n} frame(s) over the limits` : 'no pops found');
