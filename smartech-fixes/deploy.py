#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════╗
║        SMARTECH KENYA — VERCEL DEPLOY SCRIPT                ║
║        Run from: C:\\Users\\User\\Downloads\\                  ║
║                  smartech-kenya-main\\smartech-kenya-main    ║
╚══════════════════════════════════════════════════════════════╝

Usage:
    python deploy.py              — full deploy (copy fixes + git push + vercel)
    python deploy.py --check      — check env vars only
    python deploy.py --git-only   — skip vercel CLI, just push to git
    python deploy.py --vercel-only — skip git, just trigger vercel deploy
"""

import os
import sys
import shutil
import subprocess
import argparse
from pathlib import Path
from datetime import datetime

# ── Colours ───────────────────────────────────────────────────────────────────
GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

def ok(msg):    print(f"{GREEN}  ✓  {msg}{RESET}")
def warn(msg):  print(f"{YELLOW}  ⚠  {msg}{RESET}")
def err(msg):   print(f"{RED}  ✗  {msg}{RESET}")
def info(msg):  print(f"{CYAN}  →  {msg}{RESET}")
def head(msg):  print(f"\n{BOLD}{msg}{RESET}")

# ── Paths ─────────────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.resolve()

# Where the fix files sit — subfolder created by this script OR pre-copied
FIXES_DIR = REPO_ROOT / "_fixes"

# Map: source (relative to FIXES_DIR) → destination (relative to REPO_ROOT)
FIX_FILES = {
    "components/features/products/ProductList.tsx":  "components/features/products/ProductList.tsx",
    "components/layout/Header.tsx":                  "components/layout/Header.tsx",
    "app/admin/page.tsx":                            "app/admin/page.tsx",
    "app/api/admin/products/route.ts":               "app/api/admin/products/route.ts",
    "next.config.js":                                "next.config.js",
}

# ── Required env vars on Vercel ───────────────────────────────────────────────
REQUIRED_ENV = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "ADMIN_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
]

# ─────────────────────────────────────────────────────────────────────────────
def run(cmd: list[str], cwd: Path | None = None, capture: bool = False):
    """Run a subprocess; exit on failure."""
    try:
        result = subprocess.run(
            cmd,
            cwd=str(cwd or REPO_ROOT),
            capture_output=capture,
            text=True,
        )
        if result.returncode != 0:
            if capture:
                err(f"Command failed: {' '.join(cmd)}")
                if result.stderr:
                    print(result.stderr.strip())
            return None
        return result
    except FileNotFoundError:
        err(f"Command not found: {cmd[0]} — make sure it is installed and on PATH")
        return None

# ─────────────────────────────────────────────────────────────────────────────
def check_tools():
    head("1 / 5  Checking required tools")
    tools = {
        "git":    ["git", "--version"],
        "node":   ["node", "--version"],
        "npm":    ["npm", "--version"],
        "vercel": ["vercel", "--version"],
    }
    missing = []
    for name, cmd in tools.items():
        r = run(cmd, capture=True)
        if r:
            ok(f"{name}  ({r.stdout.strip().split(chr(10))[0]})")
        else:
            if name == "vercel":
                warn("vercel CLI not found — will skip Vercel deploy step")
                warn("Install with:  npm i -g vercel")
            else:
                err(f"{name} not found — cannot continue")
                missing.append(name)
    if missing:
        sys.exit(1)
    return "vercel" not in [k for k, cmd in tools.items() if run(cmd, capture=True) is None]

# ─────────────────────────────────────────────────────────────────────────────
def check_env():
    head("2 / 5  Checking environment variables (.env.local)")
    env_file = REPO_ROOT / ".env.local"
    found: dict[str, str] = {}

    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                k, _, v = line.partition("=")
                found[k.strip()] = v.strip()

    missing = []
    for key in REQUIRED_ENV:
        val = found.get(key) or os.environ.get(key)
        if val:
            display = val[:6] + "…" if len(val) > 6 else val
            ok(f"{key}  ({display})")
        else:
            err(f"{key}  — NOT SET")
            missing.append(key)

    if missing:
        warn(
            f"\n  Missing {len(missing)} env var(s). "
            "Add them to .env.local for local dev and to Vercel dashboard for production."
        )
        warn("  Vercel → Project Settings → Environment Variables")
        print()
        for k in missing:
            print(f"    {YELLOW}{k}={RESET}your_value_here")
        print()
        # Don't hard-exit — Vercel has the vars even if .env.local doesn't
        warn("Continuing — assuming vars are set in Vercel dashboard…")
    else:
        ok("All required environment variables found")

# ─────────────────────────────────────────────────────────────────────────────
def apply_fixes():
    head("3 / 5  Applying bug fixes")

    if not FIXES_DIR.exists():
        warn(f"No _fixes/ folder found at {FIXES_DIR}")
        warn("Place the fix files into _fixes/ matching the paths listed below:")
        for src, dst in FIX_FILES.items():
            print(f"    _fixes/{src}  →  {dst}")
        warn("Skipping file copy — continuing with git as-is")
        return

    applied = 0
    for src_rel, dst_rel in FIX_FILES.items():
        src = FIXES_DIR / src_rel
        dst = REPO_ROOT / dst_rel
        if not src.exists():
            warn(f"Fix file not found, skipping: _fixes/{src_rel}")
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        ok(f"Applied:  {dst_rel}")
        applied += 1

    if applied == 0:
        warn("No fix files were applied")
    else:
        ok(f"{applied} file(s) updated")

# ─────────────────────────────────────────────────────────────────────────────
def git_push():
    head("4 / 5  Git commit & push")

    # Check we're in a git repo
    r = run(["git", "status", "--short"], capture=True)
    if r is None:
        err("Not a git repository or git failed")
        sys.exit(1)

    changed = r.stdout.strip()
    if not changed:
        ok("Nothing to commit — working tree clean")
        return

    info("Changed files:")
    for line in changed.splitlines():
        print(f"       {line}")

    # Stage all changes
    run(["git", "add", "-A"])

    # Commit
    ts    = datetime.now().strftime("%Y-%m-%d %H:%M")
    msg   = f"fix: products error handling, admin image upload, admin product creation ({ts})"
    r_cmt = run(["git", "commit", "-m", msg], capture=True)
    if r_cmt is None:
        err("git commit failed")
        sys.exit(1)
    ok(f"Committed: {msg}")

    # Push
    info("Pushing to origin…")
    r_push = run(["git", "push"], capture=True)
    if r_push is None:
        # Try setting upstream
        branch_r = run(["git", "branch", "--show-current"], capture=True)
        branch   = branch_r.stdout.strip() if branch_r else "main"
        r_push2  = run(["git", "push", "--set-upstream", "origin", branch], capture=True)
        if r_push2 is None:
            err("git push failed — check your remote and credentials")
            sys.exit(1)
    ok("Pushed to origin")

# ─────────────────────────────────────────────────────────────────────────────
def vercel_deploy(has_vercel_cli: bool):
    head("5 / 5  Vercel deploy")

    if not has_vercel_cli:
        warn("Vercel CLI not available — skipping CLI deploy")
        info("Vercel will auto-deploy from your git push if connected.")
        info("Or install CLI:  npm i -g vercel  then run:  vercel --prod")
        return

    info("Triggering production deploy…")
    r = run(["vercel", "--prod", "--yes"], capture=False)
    if r is None:
        warn("vercel CLI deploy returned non-zero — check output above")
        warn("Your git push should still trigger an auto-deploy on Vercel")
    else:
        ok("Vercel deploy triggered successfully")

# ─────────────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Smartech Kenya deploy script")
    parser.add_argument("--check",       action="store_true", help="Check env vars only")
    parser.add_argument("--git-only",    action="store_true", help="Apply fixes + git push, skip Vercel CLI")
    parser.add_argument("--vercel-only", action="store_true", help="Only run Vercel deploy, skip git")
    args = parser.parse_args()

    print(f"\n{BOLD}{'═' * 58}")
    print(f"  SMARTECH KENYA  —  Deploy  {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'═' * 58}{RESET}\n")
    info(f"Repo: {REPO_ROOT}")

    if args.check:
        check_env()
        print()
        return

    has_vercel = check_tools()
    check_env()

    if not args.vercel_only:
        apply_fixes()
        git_push()

    if not args.git_only:
        vercel_deploy(has_vercel)

    print(f"\n{BOLD}{GREEN}{'═' * 58}")
    print("  ALL DONE — site deploying 🚀")
    print(f"{'═' * 58}{RESET}\n")
    info("Vercel deployment usually takes 30–90 seconds")
    info("Check status at: https://vercel.com/dashboard")
    print()


if __name__ == "__main__":
    main()
