from pathlib import Path
path = Path(r'c:\Users\BRAYAN\Documents\GitHub\smart-greenhouse-frontend\src\pages\admin\Backoffice.jsx')
text = path.read_text(encoding='utf-8')
old = '''					try {
						console.log("[Backoffice] user ids missing createdAt:", missing.map((u) => u.id));

						setUsers(prev => prev.map(p => {
'''
new = '''					try {
						console.log("[Backoffice] user ids missing createdAt:", missing.map((u) => u.id));
						const details = await Promise.all(
							missing.map(u => userService.getUser(u.id).catch(() => null))
						);
						console.log("[Backoffice] user details response:", details);

						setUsers(prev => prev.map(p => {
'''
if old not in text:
    print('OLD not found')
    start = text.find('try {')
    print('try idx', start)
else:
    path.write_text(text.replace(old, new, 1), encoding='utf-8')
    print('patched')
