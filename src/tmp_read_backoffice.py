from pathlib import Path
path = Path('src/pages/admin/Backoffice.jsx')
text = path.read_text(encoding='utf-8')
needle = 'console.log("[Backoffice] user ids missing createdAt"'
idx = text.find(needle)
print('idx', idx)
if idx != -1:
    snippet = text[idx-80:idx+220]
    print(repr(snippet))
else:
    print('NOTFOUND')
