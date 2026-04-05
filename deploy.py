#!/usr/bin/env python3
"""
deploy.py — Fix 4 issues and push to git.

Issues fixed:
  1. 404 on product click  → staticProducts gets slug + stock; detail page checks static fallback
  2. Homepage no products  → getFeatured/getLatest/getKitchen fall back to static products
  3. "Sample catalogue"    → badge removed from ProductList
  4. Admin image upload    → SKU is now auto-generated when left blank

Run from the root of your smartech-kenya repo:
    python deploy.py
"""

import os
import shutil
import subprocess
import sys

REPO = os.path.dirname(os.path.abspath(__file__))
FIXES = os.path.join(REPO, 'fixes')   # the folder this script ships with

FILES = [
    # (source relative to fixes/, destination relative to repo root)
    ('constants/staticProducts.ts',                      'constants/staticProducts.ts'),
    ('app/page.tsx',                                     'app/page.tsx'),
    ('app/(shop)/products/[slug]/page.tsx',              'app/(shop)/products/[slug]/page.tsx'),
    ('components/features/products/ProductList.tsx',     'components/features/products/ProductList.tsx'),
    ('app/api/admin/products/route.ts',                  'app/api/admin/products/route.ts'),
]

COMMIT_MSG = (
    'fix: product 404, homepage empty, sample-catalogue label, admin SKU auto-gen\n\n'
    '- staticProducts: add slug + stock fields (fixes 404 on click + homepage render)\n'
    '- app/page.tsx: getFeatured/getLatest/getKitchen fall back to STATIC_PRODUCTS\n'
    '- [slug]/page.tsx: check STATIC_PRODUCTS when DB product not found\n'
    '- ProductList: remove "Sample catalogue" badge\n'
    '- api/admin/products: auto-generate SKU when not supplied'
)

def run(cmd):
    print(f'  $ {cmd}')
    r = subprocess.run(cmd, shell=True, cwd=REPO)
    if r.returncode != 0:
        print(f'  ✗ failed (exit {r.returncode})')
        sys.exit(r.returncode)


def main():
    print('─' * 62)
    print('  Smartech Kenya — 4-issue fix deploy')
    print('─' * 62)

    if not os.path.isdir(FIXES):
        print(f'\n✗ "fixes/" folder not found next to deploy.py\n'
              f'  Expected: {FIXES}')
        sys.exit(1)

    staged = []
    for src_rel, dst_rel in FILES:
        src = os.path.join(FIXES, src_rel)
        dst = os.path.join(REPO, dst_rel)

        if not os.path.exists(src):
            print(f'\n✗ Source file missing: {src}')
            sys.exit(1)

        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        print(f'  ✔ copied → {dst_rel}')
        staged.append(dst_rel)

    print('\n── Git ─────────────────────────────────────────────────')
    for f in staged:
        # git requires forward slashes even on Windows
        run(f'git add "{f}"')

    run(f'git commit -m "{COMMIT_MSG}"')
    run('git push origin main')

    print('\n✔ Done — Vercel will rebuild automatically.')
    print('─' * 62)


if __name__ == '__main__':
    main()
