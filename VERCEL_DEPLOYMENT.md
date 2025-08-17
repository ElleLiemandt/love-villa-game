# 🚀 Deploying Love Villa Game to Vercel

## Prerequisites

### 1. Install Node.js (if not already installed)

**Option A: Using Homebrew (recommended for Mac)**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

**Option B: Download from nodejs.org**
- Visit: https://nodejs.org/
- Download the LTS version
- Run the installer

### 2. Verify Installation
```bash
node --version
npm --version
```

## Setup Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Create a Vercel Account
1. Go to https://vercel.com/signup
2. Sign up with GitHub, GitLab, Bitbucket, or email
3. Verify your email

## Deploy Your Game

### Option 1: Quick Deploy (Recommended)
```bash
# Navigate to your project
cd "/Users/ellebelle/Library/Mobile Documents/com~apple~CloudDocs/love island/love island/love-villa-game"

# Deploy to Vercel
vercel
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your Vercel account
- **Link to existing project?** → No (for first time)
- **Project name?** → `love-villa-game` (or press Enter for default)
- **In which directory is your code?** → `.` (press Enter)
- **Override settings?** → No

### Option 2: Deploy with npm scripts
```bash
# Preview deployment (staging)
npm run deploy:preview

# Production deployment
npm run deploy
```

## Your Deployment URLs

After deployment, you'll get:
- **Preview URL**: `https://love-villa-game-[hash].vercel.app`
- **Production URL**: `https://love-villa-game.vercel.app`

## Project Configuration

### Already Set Up for You:

✅ **vercel.json** - Configures static hosting and caching
```json
{
  "version": 2,
  "name": "love-villa-game",
  "builds": [
    {
      "src": "/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

✅ **.vercelignore** - Excludes unnecessary files from deployment
- Test files
- Source TypeScript files
- Development files
- Documentation

✅ **package.json** - Includes deployment scripts
```json
"scripts": {
  "deploy": "vercel --prod",
  "deploy:preview": "vercel"
}
```

## Managing Your Deployment

### View Dashboard
```bash
vercel dashboard
```

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs [deployment-url]
```

### Environment Variables (if needed)
```bash
vercel env add
```

## Custom Domain (Optional)

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Follow DNS configuration instructions

## Troubleshooting

### Issue: "Command not found: vercel"
**Solution**: Make sure Node.js and npm are installed, then run:
```bash
npm install -g vercel
```

### Issue: Assets not loading
**Solution**: Check that all asset paths start with `/public/` in your code

### Issue: 404 errors
**Solution**: The vercel.json routing is already configured to handle this

## Alternative: Deploy via GitHub

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin [your-github-repo-url]
git push -u origin main
```

2. Connect GitHub to Vercel:
- Go to https://vercel.com/new
- Import your GitHub repository
- Deploy automatically

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

---

## Quick Start Summary

```bash
# 1. Install Node.js (if needed)
brew install node

# 2. Install Vercel CLI
npm install -g vercel

# 3. Deploy
vercel

# Done! Your game is live! 🎉
```

Your Love Villa game is now ready to deploy to Vercel!
