#!/bin/bash

echo "🚀 Love Villa Game - Vercel Deployment Script"
echo "============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "Please install Node.js first:"
    echo "1. Visit: https://nodejs.org/"
    echo "2. Download and install the LTS version"
    echo "3. Run this script again"
    echo ""
    echo "Or install via Homebrew:"
    echo "brew install node"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Vercel CLI"
        echo "Try running: sudo npm install -g vercel"
        exit 1
    fi
fi

echo "✅ Vercel CLI found"
echo ""
echo "📝 Project Configuration:"
echo "  Name: love-villa-game"
echo "  Type: Static website"
echo "  Root: Current directory"
echo ""
echo "🔐 Next steps:"
echo "1. You'll be asked to log in to Vercel (create account if needed)"
echo "2. Choose your account scope"
echo "3. Confirm project settings"
echo ""
echo "Starting deployment..."
echo "====================="
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "✨ Deployment complete!"
echo ""
echo "Your game should now be live at:"
echo "👉 https://love-villa-game.vercel.app"
echo ""
echo "Or check your deployment URL above ☝️"
