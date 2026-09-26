// fidelity.mjs: every number that can appear on screen must be one of the V2's numbers.
// Scans the string literals of the scene files (src/ch/*.js) for digit groups and flags anything else.
//   node tools/fidelity.mjs
import fs from 'node:fs';
const ALLOWED = new Set(['7668', '3147', '1852', '332', '147', '5478', '2190', '2690', '4978', '750', '4228', '686', '241', '445', '139',
  '0,899', '0,897', '1249', '149', '24', '16', '5', '9', '260', '33', '2010', '2026', '1', '2', '3', '4', '6', '7',   // RQ1–RQ4, Q1–Q6, 7 blocs, 6 équations
  '2025', '2023', '2016', '2021', '2024', '2019', '2018', '2020', '0002', '5.5']);                                // citation years, PRISMA 2020, ANR-24-PEAE-0002
let bad = 0;
for (const f of fs.readdirSync('src/ch').filter(f => f.endsWith('.js')).sort()) {
  const src = fs.readFileSync('src/ch/' + f, 'utf8');
  const strs = [...src.matchAll(/(['"`])((?:\\.|(?!\1).)*?)\1/g)].map(m => m[2]).filter(s => /\d/.test(s) && /[a-zA-Zéè→·κ]/.test(s) && !/^#[0-9A-Fa-f]{3,8}$/.test(s) && !/^[\w.]+$/.test(s));
  for (const s of strs) {
    const nums = [...s.replace(/(\d)[\s  ](\d{3})/g, '$1$2').matchAll(/\d+(?:,\d+)?/g)].map(m => m[0]);
    const off = nums.filter(n => !ALLOWED.has(n));
    if (off.length) { bad++; console.log(`${f}: « ${s.slice(0, 90)} » → ${off.join(', ')}`); }
  }
}
console.log(bad ? `${bad} chaîne(s) à vérifier` : 'aucun chiffre hors V2 dans les textes des scènes');
