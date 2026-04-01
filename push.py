import os, shutil, subprocess, sys

REPO = r"C:\Users\User\Downloads\smartech-kenya-907\smartech-kenya-9"
DL   = os.path.expanduser("~/Downloads")

FILES = [
    ("page.tsx",            r"app\page.tsx"),
    ("staticProducts.ts",   r"constants\staticProducts.ts"),
]

def run(cmd):
    print("$", " ".join(cmd))
    r = subprocess.run(cmd, cwd=REPO, shell=True)
    if r.returncode != 0: sys.exit(r.returncode)

if not os.path.isdir(REPO):
    print(f"Repo not found: {REPO}"); sys.exit(1)

for src, dst in FILES:
    s = os.path.join(DL, src)
    d = os.path.join(REPO, dst)
    if not os.path.isfile(s):
        print(f"[NOT FOUND] {src} — make sure it is in Downloads"); sys.exit(1)
    os.makedirs(os.path.dirname(d), exist_ok=True)
    shutil.copy2(s, d); print(f"  ✓  {dst}")

run(["git", "add", "."])
run(["git", "commit", "-m", "fix: static product fallback with embedded images — no DB needed"])
run(["git", "push"])
print("\n✅  Done — Vercel redeploys in ~1 min. Products will show even without DB.")
