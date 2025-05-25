# Deployment Guide

## 🚀 Vercel Deployment (Recommended)

### Step 1: Prepare Repository

1. **Push to GitHub:**
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

### Step 2: Deploy to Vercel

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select "monad-puzzle-farcaster"

2. **Configure Environment Variables:**
   - Add `NEXT_PUBLIC_BASE_URL` in Vercel dashboard
   - Set value to your Vercel app URL (e.g., `https://monad-puzzle.vercel.app`)

3. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Step 3: Configure Custom Domain (Optional)

1. **Add Domain in Vercel:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variable:**
   - Change `NEXT_PUBLIC_BASE_URL` to your custom domain

## 🔗 Farcaster Integration

### Step 1: Test Frame

1. **Frame Validator:**
   - Go to [Frame Validator](https://warpcast.com/~/developers/frames)
   - Enter your app URL: `https://your-app.vercel.app/api/frame`
   - Verify frame renders correctly

### Step 2: Submit to Farcaster

1. **Create Cast:**
   - Share your app URL in a Warpcast cast
   - Frame should appear automatically
   - Test all buttons work correctly

### Step 3: Farcade Integration

1. **Register with Farcade:**
   - Contact Farcade team if needed
   - Ensure SDK integration works
   - Test score submission

## 🌐 Alternative Deployments

### Netlify

1. **Build Settings:**
\`\`\`bash
Build command: npm run build
Publish directory: .next
\`\`\`

2. **Environment Variables:**
\`\`\`
NEXT_PUBLIC_BASE_URL=https://your-app.netlify.app
\`\`\`

### Railway

1. **Deploy:**
\`\`\`bash
railway login
railway init
railway up
\`\`\`

2. **Environment Variables:**
\`\`\`bash
railway variables set NEXT_PUBLIC_BASE_URL=https://your-app.railway.app
\`\`\`

## 🔧 Post-Deployment Checklist

- [ ] App loads correctly
- [ ] All 3 levels work
- [ ] Tiles move without shuffling
- [ ] Timer counts down
- [ ] Scoring system works
- [ ] Farcaster Frame displays
- [ ] Frame buttons work
- [ ] Mobile responsive
- [ ] Images load properly
- [ ] Farcade SDK integration works

## 🐛 Troubleshooting

### Build Errors

1. **TypeScript Errors:**
\`\`\`bash
npm run type-check
\`\`\`

2. **Dependency Issues:**
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Runtime Errors

1. **Check Environment Variables:**
   - Verify `NEXT_PUBLIC_BASE_URL` is set
   - Ensure URL doesn't have trailing slash

2. **Image Loading Issues:**
   - Check image URLs are accessible
   - Verify CORS settings

3. **Frame Not Working:**
   - Test with Frame Validator
   - Check meta tags in source
   - Verify API routes work

### Performance Issues

1. **Optimize Images:**
   - Use WebP format if possible
   - Implement proper caching headers

2. **Bundle Size:**
\`\`\`bash
npm run build
# Check .next/static/ sizes
\`\`\`

## 📊 Monitoring

### Analytics

1. **Vercel Analytics:**
   - Enable in Vercel dashboard
   - Monitor page views and performance

2. **Custom Analytics:**
   - Add Google Analytics if needed
   - Track game completions

### Error Tracking

1. **Sentry Integration:**
\`\`\`bash
npm install @sentry/nextjs
\`\`\`

2. **Console Monitoring:**
   - Check Vercel function logs
   - Monitor for JavaScript errors

## 🔄 Updates

### Continuous Deployment

1. **Auto-deploy:**
   - Push to main branch
   - Vercel auto-deploys

2. **Preview Deployments:**
   - Create PR for preview
   - Test before merging

### Version Management

1. **Semantic Versioning:**
\`\`\`bash
npm version patch  # Bug fixes
npm version minor  # New features
npm version major  # Breaking changes
\`\`\`

2. **Release Notes:**
   - Document changes in README
   - Tag releases in GitHub

---

Need help? Check the [main README](README.md) or open an issue!
