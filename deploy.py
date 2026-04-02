#!/usr/bin/env python3
r""""""
╔══════════════════════════════════════════════════════════════╗
║  SMARTECH KENYA — PRODUCTS FIX + FOLDER UPLOAD DEPLOY       ║
║                                                              ║
║  Run from repo root:                                         ║
║  cd C:\Users\User\Downloads\smartech-kenya-main\             ║
║                       smartech-kenya-main                    ║
║  python fix\deploy.py                                        ║
╚══════════════════════════════════════════════════════════════╝
"""

import os, sys, shutil, subprocess
from pathlib import Path
from datetime import datetime

GREEN  = "\033[92m"; YELLOW = "\033[93m"
RED    = "\033[91m"; CYAN   = "\033[96m"
BOLD   = "\033[1m";  RESET  = "\033[0m"

def ok(m):   print(f"{GREEN}  ✓  {m}{RESET}")
def warn(m): print(f"{YELLOW}  ⚠  {m}{RESET}")
def err(m):  print(f"{RED}  ✗  {m}{RESET}")
def info(m): print(f"{CYAN}  →  {m}{RESET}")

REPO  = Path(__file__).parent.parent.resolve()
FIXES = Path(__file__).parent.resolve()

FILES = [
    ("components/features/products/ProductList.tsx",  "components/features/products/ProductList.tsx"),
    ("app/admin/page.tsx",                             "app/admin/page.tsx"),
]

def run(cmd):
    try:
        r = subprocess.run(cmd, cwd=str(REPO), capture_output=True, text=True)
        return r if r.returncode == 0 else None
    except FileNotFoundError:
        return None

def main():
    print(f"\n{BOLD}{'═'*58}")
    print(f"  SMARTECH KENYA — Products Fix + Folder Upload")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'═'*58}{RESET}")
    info(f"Repo: {REPO}")

    print()
    for src_rel, dst_rel in FILES:
        src = FIXES / src_rel
        dst = REPO  / dst_rel
        if not src.exists():
            err(f"MISSING: fix/{src_rel}"); sys.exit(1)
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        ok(f"→ {dst_rel}")

    # Git push
    r = run(["git", "status", "--short"])
    if r is None:
        err("git not available"); sys.exit(1)
    if not r.stdout.strip():
        ok("Nothing to commit"); return

    run(["git", "add", "-A"])
    msg = f"fix: products static fallback + folder/bulk image upload admin ({datetime.now().strftime('%H:%M')})"
    r2  = run(["git", "commit", "-m", msg])
    if r2 is None:
        err("git commit failed"); sys.exit(1)
    ok(f"Committed")

    info("Pushing to origin…")
    r3 = run(["git", "push"])
    if r3 is None:
        br = run(["git", "branch", "--show-current"])
        branch = br.stdout.strip() if br else "main"
        r4 = run(["git", "push", "--set-upstream", "origin", branch])
        if r4 is None:
            err("git push failed"); sys.exit(1)
    ok("Pushed ✓ — Vercel auto-deploys in ~60s")

    print(f"\n{BOLD}{GREEN}{'═'*58}")
    print("  DONE 🚀")
    print(f"  Products now show even without DATABASE_URL")
    print(f"  Admin → 📁 Folder Upload tab for bulk images")
    print(f"{'═'*58}{RESET}\n")

if __name__ == "__main__":
    main()
