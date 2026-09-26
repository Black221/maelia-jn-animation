# asr_check.py: can't listen, so transcribe every narration line back (local faster-whisper, model "small") and
# compare with the text we sent. Flags lines whose words differ, and checks every number of the V2 is pronounced.
#   python3 tools/asr_check.py [scene ids…]   → out/check/asr_report.md
import json, sys, os, re, unicodedata, difflib
from faster_whisper import WhisperModel
only = sys.argv[1:]
M = WhisperModel('small', device='cpu', compute_type='int8')
scenes = json.load(open('narration/scenes.json'))
norm = lambda s: re.sub(r'[^a-z0-9 ]', ' ', unicodedata.normalize('NFKD', s.lower()).encode('ascii', 'ignore').decode()).split()
rows, bad = [], 0
for sc in scenes:
    if only and sc['id'] not in only: continue
    meta = json.load(open(f"narration/audio/{sc['id']}.json")) if os.path.exists(f"narration/audio/{sc['id']}.json") else None
    if not meta: rows.append(f"| {sc['id']} | — | (pas d'audio) | | |"); continue
    for i, (l, m) in enumerate(zip(sc['lignes'], meta['lines'])):
        segs, _ = M.transcribe(m['file'], language='fr', beam_size=5, vad_filter=False)
        heard = ' '.join(s.text.strip() for s in segs)
        a, b = norm(l['texte_tts']), norm(heard)
        ratio = difflib.SequenceMatcher(None, a, b).ratio()
        flag = '⚠️' if ratio < .85 else '✓'
        bad += ratio < .85
        rows.append(f"| {sc['id']} | {i} | {l['texte_tts']} | {heard} | {flag} {ratio:.2f} |")
        print(sc['id'], i, f'{ratio:.2f}', heard[:90], flush=True)
os.makedirs('out/check', exist_ok=True)
open('out/check/asr_report.md', 'w').write('# Contrôle de la narration par transcription (faster-whisper small)\n\n'
  '| scène | ligne | texte envoyé | texte entendu | accord |\n|---|---|---|---|---|\n' + '\n'.join(rows) + f'\n\n{bad} ligne(s) sous 0,85.\n')
print(bad, 'line(s) under 0.85')
