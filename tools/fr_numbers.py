# fr_numbers.py: French number words → integers ("sept mille six cent soixante-huit" → 7668), for the ASR check.
import re
U = {'zero':0,'zéro':0,'un':1,'une':1,'deux':2,'trois':3,'quatre':4,'cinq':5,'six':6,'sept':7,'huit':8,'neuf':9,'dix':10,'onze':11,'douze':12,
     'treize':13,'quatorze':14,'quinze':15,'seize':16,'vingt':20,'vingts':20,'trente':30,'quarante':40,'cinquante':50,'soixante':60}
def words_to_numbers(text):
    toks = re.findall(r"[a-zéèêàâîôûç]+|\d+", text.lower().replace('-', ' '))
    out, cur, total, active = [], 0, 0, False
    def flush():
        nonlocal cur, total, active
        if active: out.append(total + cur)
        cur, total, active = 0, 0, False
    for i, w in enumerate(toks):
        if w.isdigit(): flush(); out.append(int(w)); continue
        if w in U:
            v = U[w]
            if w in ('vingt', 'vingts') and cur and cur % 100 == 4: cur += 76    # quatre-vingt(s) = 80
            else: cur += v
            active = True
        elif w == 'et' and active and i + 1 < len(toks) and toks[i + 1] in ('un', 'une', 'onze'): continue
        elif w in ('cent', 'cents') and active: cur = (cur or 1) * 100
        elif w == 'cent': cur, active = 100, True
        elif w == 'mille': total += (cur or 1) * 1000; cur = 0; active = True
        elif w == 'virgule' and active: flush(); out.append('virgule')
        else: flush()
    flush()
    # "zéro virgule neuf" → 0.9
    res, i = [], 0
    while i < len(out):
        if i + 2 < len(out) and out[i + 1] == 'virgule': res.append(float(f"{out[i]}.{out[i + 2]}")); i += 3
        elif out[i] == 'virgule': i += 1
        else: res.append(out[i]); i += 1
    return res
if __name__ == '__main__':
    for s in ['sept mille six cent soixante-huit', 'deux mille cent quatre-vingt-dix de plus', 'deux cent quarante et un en entier', 'zéro virgule neuf, ou presque', 'de deux mille dix à deux mille vingt-six', 'cent trente-neuf études', 'trois cent trente-deux', 'deux cent soixante comportements au lieu de trente-trois', 'six cent quatre-vingt-six']:
        print(s, '→', words_to_numbers(s))
