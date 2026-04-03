#!/usr/bin/env python3
"""
deploy.py  —  Smartech Kenya: fix build errors + polish UI

WHAT THIS FIXES
───────────────
1. BUILD FAILS (CRITICAL)
   app/layout.tsx was missing <Providers> — Redux store was null,
   crashing /cart and /wishlist during static generation.

2. 404 on product click
   Static products had no 'slug' or 'stock' fields.
   [slug]/page.tsx now falls back to STATIC_PRODUCTS when DB is empty.

3. Homepage shows no products
   Homepage now falls back to STATIC_PRODUCTS when DB is empty.

4. "Sample catalogue" badge
   Removed from ProductList.

5. Admin photo upload
   - SKU is now auto-generated when left blank
   - New cleaner admin UI with direct click-or-drag local file upload
   - Photos upload to Cloudinary via the existing API

USAGE
─────
    python deploy.py          # from repo root

HOW IT WORKS
────────────
Copies the files from the 'fixes/' folder next to this script
into the right places in the repo, then does git add + commit + push.
"""

import os, shutil, subprocess, sys

REPO  = os.path.dirname(os.path.abspath(__file__))
FIXES = os.path.join(REPO, 'fixes')

# (source inside fixes/,  destination inside repo root)
FILES = [
    # ─── CRITICAL: missing Providers wrapper ───────────────────────────────
    ('app/layout.tsx',
     'app/layout.tsx'),

    # ─── Static products catalogue (slug + stock + isFeatured) ────────────
    ('constants/staticProducts.ts',
     'constants/staticProducts.ts'),

    # ─── Homepage with static fallback ────────────────────────────────────
    ('app/page.tsx',
     'app/page.tsx'),

    # ─── Product detail: static fallback (fixes 404) ──────────────────────
    ('app/(shop)/products/[slug]/page.tsx',
     'app/(shop)/products/[slug]/page.tsx'),

    # ─── Product list: remove "Sample catalogue" badge ────────────────────
    ('components/features/products/ProductList.tsx',
     'components/features/products/ProductList.tsx'),

    # ─── Admin API: auto-generate SKU when blank ──────────────────────────
    ('app/api/admin/products/route.ts',
     'app/api/admin/products/route.ts'),

    # ─── Admin page: polished UI with direct file upload ──────────────────
    ('app/admin/page.tsx',
     'app/admin/page.tsx'),
]

COMMIT = (
    "fix: build failure (Providers), 404, homepage, admin photo upload\n\n"
    "- app/layout.tsx: wrap children with <Providers> (fixes /cart + /wishlist crash)\n"
    "- constants/staticProducts.ts: add slug, stock, isFeatured fields\n"
    "- app/page.tsx: static product fallback when DB is empty\n"
    "- [slug]/page.tsx: static fallback to fix 404 on product click\n"
    "- ProductList.tsx: remove 'Sample catalogue' badge\n"
    "- api/admin/products: auto-generate SKU when not supplied\n"
    "- app/admin/page.tsx: polished UI with direct local file upload"
)

def run(cmd):
    print(f"  $ {cmd}")
    r = subprocess.run(cmd, shell=True, cwd=REPO)
    if r.returncode != 0:
        print(f"  ✗  Command failed (exit {r.returncode})")
        sys.exit(r.returncode)

def main():
    print("─" * 64)
    print("  Smartech Kenya — full fix deploy")
    print("─" * 64)

    if not os.path.isdir(FIXES):
        print(f"\n✗  'fixes/' folder not found — expected:\n   {FIXES}")
        sys.exit(1)

    staged = []
    for src_rel, dst_rel in FILES:
        src = os.path.join(FIXES, src_rel)
        dst = os.path.join(REPO, dst_rel)

        if not os.path.exists(src):
            print(f"\n✗  Source missing: {src}")
            sys.exit(1)

        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        print(f"  ✔  {dst_rel}")
        staged.append(dst_rel)

    print("\n── git ─────────────────────────────────────────────────────")
    for f in staged:
        run(f'git add "{f}"')
    run(f'git commit -m "{COMMIT}"')
    run("git push origin main")

    print("\n✔  Done — Vercel will rebuild automatically.")
    print("─" * 64)
    print("\n  NEXT STEPS after deploy:")
    print("  1. Go to /admin to add your products")
    print("  2. Click 'Add Product', fill the form, pick a photo, save")
    print("  3. Your photos upload directly to Cloudinary")
    print("─" * 64)

if __name__ == "__main__":
    main()
