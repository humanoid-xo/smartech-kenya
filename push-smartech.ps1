# ═══════════════════════════════════════════════════════════════════
#  Smartech Kenya — Apply UI Polish + Image Upload Fixes & Push
# ═══════════════════════════════════════════════════════════════════

param(
    [string]$RepoPath = "C:\Users\User\Downloads\smartech-kenya-907\smartech-kenya-9",
    [string]$CommitMsg = "Polish: retheme admin panel + refine ProductCard hover states"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "`n🔧 Smartech Kenya — UI Polish + Image Upload" -ForegroundColor Cyan
Write-Host "   Repo: $RepoPath`n" -ForegroundColor Gray

# ── 1. Verify repo exists ──────────────────────────────────────────
if (-not (Test-Path $RepoPath)) {
    Write-Host "❌ Repo path not found: $RepoPath" -ForegroundColor Red
    Write-Host "   Update the -RepoPath parameter and re-run." -ForegroundColor Yellow
    exit 1
}

Set-Location $RepoPath
Write-Host "✓ Navigated to repo" -ForegroundColor Green

# ── 2. Verify it's a git repo ──────────────────────────────────────
if (-not (Test-Path ".git")) {
    Write-Host "❌ Not a git repository. Run: git init" -ForegroundColor Red
    exit 1
}

# ── 3. Show what's changed ────────────────────────────────────────
Write-Host "`n📋 Git status:" -ForegroundColor Yellow
git status --short

# ── 4. Stage all changes ──────────────────────────────────────────
Write-Host "`n📦 Staging changes..." -ForegroundColor Yellow
git add app/admin/page.tsx
git add components/features/products/ProductCard.tsx

# Also stage any other modified files
git add -u

Write-Host "✓ Files staged" -ForegroundColor Green

# ── 5. Commit ─────────────────────────────────────────────────────
Write-Host "`n💾 Committing..." -ForegroundColor Yellow
git commit -m $CommitMsg

if ($LASTEXITCODE -ne 0) {
    Write-Host "ℹ Nothing new to commit (already up to date)" -ForegroundColor Cyan
} else {
    Write-Host "✓ Committed: $CommitMsg" -ForegroundColor Green
}

# ── 6. Push ───────────────────────────────────────────────────────
Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Done! Changes pushed to GitHub." -ForegroundColor Green
} else {
    Write-Host "`n⚠ Push failed. Try:" -ForegroundColor Yellow
    Write-Host "   git push origin main --force-with-lease" -ForegroundColor Gray
}

# ── 7. Reminder: env vars needed for image upload ─────────────────
Write-Host "`n─────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "📌 Image upload requires these in your .env:" -ForegroundColor Cyan
Write-Host "   ADMIN_SECRET=your-password-here" -ForegroundColor Gray
Write-Host "   CLOUDINARY_CLOUD_NAME=your-cloud-name" -ForegroundColor Gray
Write-Host "   CLOUDINARY_API_KEY=your-api-key" -ForegroundColor Gray
Write-Host "   CLOUDINARY_API_SECRET=your-api-secret" -ForegroundColor Gray
Write-Host "`n   Then go to /admin → sign in → Image Manager tab" -ForegroundColor Gray
Write-Host "   Click any product card to upload its image ✓" -ForegroundColor Gray
Write-Host "─────────────────────────────────────────────────`n" -ForegroundColor DarkGray
