#!/bin/bash

# Smartech Kenya - Automated Setup Script
# This script automates the initial setup process

set -e  # Exit on any error

echo "🚀 Smartech Kenya Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is too old ($NODE_VERSION). Please upgrade to Node.js 18+"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm detected: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "This may take 2-5 minutes..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    echo "Try: npm cache clean --force && npm install"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and add your actual credentials:"
    echo "   - DATABASE_URL (MongoDB connection string)"
    echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "   - M-Pesa credentials"
    echo "   - Cloudinary credentials"
    echo "   - Twilio credentials (optional)"
    echo "   - Email SMTP settings (optional)"
    echo ""
    read -p "Press Enter after you've updated .env file..." dummy
else
    echo "✅ .env file exists"
fi

echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"
echo ""

# Ask about database push
read -p "Do you want to push the database schema to MongoDB? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📊 Pushing database schema..."
    npx prisma db push
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to push database schema"
        echo "Please check your DATABASE_URL in .env"
        echo "Make sure MongoDB Atlas allows connections from your IP (0.0.0.0/0)"
        exit 1
    fi
    
    echo "✅ Database schema pushed successfully"
else
    echo "⏭️  Skipping database push"
fi

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Review and update .env file with your credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview"
echo "- STEP_BY_STEP_MANUAL.md - Detailed setup guide"
echo "- BUG_FIXES.md - Recent fixes applied"
echo ""
echo "For deployment instructions, see DEPLOYMENT_CHECKLIST.md"
echo ""
echo "Happy coding! 🎉"
