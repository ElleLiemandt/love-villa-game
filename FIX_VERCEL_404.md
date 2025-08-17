# 🔧 Fixing Vercel 404: NOT_FOUND Error

## What's Happening?

The error `404: NOT_FOUND - Code: DEPLOYMENT_NOT_FOUND` means one of:
1. The deployment hasn't been created yet
2. The deployment failed
3. You're trying to access an incorrect URL

## Quick Fix Options

### Option 1: Deploy via Vercel Website (Easiest)

1. **Create a GitHub Repository**
   ```bash
   # In your project folder
   git init
   git add .
   git commit -m "Initial commit - Love Villa Game"
   ```

2. **Push to GitHub**
   - Create a new repository at https://github.com/new
   - Name it: `love-villa-game`
   - Don't initialize with README (you already have files)
   - Follow GitHub's instructions to push your code

3. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `love-villa-game` repository
   - Click "Deploy"
   - ✅ Your game will be live in ~1 minute!

### Option 2: Use Our Deployment Script

1. **Install Node.js** (if not installed)
   ```bash
   # On Mac with Homebrew
   brew install node
   
   # Or download from https://nodejs.org/
   ```

2. **Run the deployment script**
   ```bash
   ./deploy-to-vercel.sh
   ```

3. **Follow the prompts**
   - Log in to Vercel (or create account)
   - Confirm settings
   - Done!

### Option 3: Deploy to GitHub Pages (Free Alternative)

1. **Create `.github/workflows/deploy.yml`**
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push
   ```

3. **Enable GitHub Pages**
   - Go to Settings → Pages in your repo
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Your game will be at: `https://[your-username].github.io/love-villa-game`

## Troubleshooting

### "Command not found: vercel"
```bash
npm install -g vercel
```

### "Command not found: npm"
Install Node.js first: https://nodejs.org/

### Assets not loading after deployment
Make sure all asset paths in your code use `/public/` not relative paths.

### Still getting 404?
The deployment URL should look like:
- ✅ `https://love-villa-game.vercel.app`
- ✅ `https://love-villa-game-[username].vercel.app`
- ❌ NOT: `cle1::svvt4-1755468239900-644bc5a94e05`

## Test Your Deployment

Once deployed, your game should:
1. Show the landing page with "Love Villa" title
2. Allow bombshell selection
3. Start Day 1 of the story
4. All images and backgrounds should load

## Need Help?

- Vercel Status: https://www.vercel-status.com/
- Vercel Support: https://vercel.com/support
- GitHub Pages Docs: https://pages.github.com/

---

## Quick Command Summary

```bash
# Option 1: Direct Vercel deployment
npm install -g vercel
vercel

# Option 2: Via our script
./deploy-to-vercel.sh

# Option 3: Check deployment status
vercel ls
```

Your game is ready to deploy - choose the method that works best for you!
