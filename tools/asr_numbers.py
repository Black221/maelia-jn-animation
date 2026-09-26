# asr_numbers.py: reads out/check/asr_report.md and checks that every number of each line was heard as sent.
import re
from fr_numbers import words_to_numbers
rows = [l.split(' | ') for l in open('out/check/asr_report.md') if l.startswith('| ') and not l.startswith('| scène') and not l.startswith('|---')]
bad = 0
for r in rows:
    if len(r) < 5: continue
    sid, i, sent, heard = r[0][2:], r[1], r[2], r[3]
    h = re.sub(r'(\d)[\s  ](\d{3})\b', r'\1\2', heard)
    exp = [n for n in words_to_numbers(sent) if n not in (1,)]
    got = [n for n in words_to_numbers(h) if n not in (1,)]
    if not exp: continue
    ok = all(e in got for e in exp)
    bad += not ok
    print(('✓' if ok else '✗'), sid, i, 'attendu', exp, '| entendu', got, '' if ok else f'« {heard.strip()} »')
print(bad, 'ligne(s) avec un nombre non retrouvé')
