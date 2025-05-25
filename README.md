# Monad Puzzle - Farcaster Mini App

A sliding tile puzzle game featuring the Monad logo, built as a Farcaster Mini App using the Farcade SDK.

## 🎮 Features

- **3 Difficulty Levels**: Easy (3x3), Medium (4x4), Expert (5x5)
- **Timer-based Gameplay**: Different time limits for each level
- **Scoring System**: Points for correct placements and completion bonuses
- **Farcaster Integration**: Full Farcade SDK integration with haptic feedback
- **Responsive Design**: Works on desktop and mobile devices
- **Progressive Difficulty**: Multiple images and increasing complexity

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository:**
\`\`\`bash
git clone https://github.com/mjfendin/monad-puzzle-farcaster.git
cd monad-puzzle-farcaster
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables:**
\`\`\`bash
cp .env.example .env.local
\`\`\`
Edit `.env.local` and set your deployment URL:
\`\`\`env
NEXT_PUBLIC_BASE_URL=https://monad-puzzle.vercel.app/
\`\`\`

4. **Run development server:**
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the game.

## 📦 Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
\`\`\`bash
npm i -g vercel
\`\`\`

2. **Deploy:**
\`\`\`bash
vercel --prod
\`\`\`

3. **Set environment variables in Vercel dashboard:**
- `NEXT_PUBLIC_BASE_URL`: Your deployed app URL

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 🔧 Configuration

### Game Settings

Edit `LEVEL_CONFIG` in `app/page.tsx` to modify:
- Grid sizes
- Time limits
- Background images
- Level names

### Farcaster Frame

Frame configuration is in `app/api/frame/route.ts`:
- Button labels
- Frame images
- Meta tags

## 🎯 Game Rules

1. **Objective**: Arrange tiles to form the complete image
2. **Movement**: Click adjacent tiles to move them into the empty space
3. **Scoring**: 
   - Base score based on completion time
   - +125 points for each correct tile placement
   - +50 completion bonus
4. **Levels**: Progress through Easy → Medium → Expert

## 🛠️ Development

### Project Structure

\`\`\`
├── app/
│   ├── api/frame/          # Farcaster Frame API
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main game component
├── components/ui/          # Shadcn UI components
├── public/                 # Static assets
└── ...config files
\`\`\`

### Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Shadcn/ui**: UI components
- **Farcade SDK**: Farcaster integration

### Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
\`\`\`

## 🔗 Farcaster Integration

### Frame Features

- **Preview Image**: Auto-generated puzzle preview
- **Interactive Buttons**: Play game, select difficulty
- **Deep Linking**: Direct links to specific levels
- **Social Sharing**: Optimized for Farcaster feeds

### Farcade SDK Features

- **Game State Management**: Ready, game over events
- **Haptic Feedback**: Touch feedback on tile moves
- **Score Tracking**: Automatic score submission
- **Play Again**: Restart functionality

## 📱 Mobile Optimization

- Responsive grid layout
- Touch-friendly controls
- Optimized for mobile browsers
- PWA-ready with manifest

## 🎨 Customization

### Adding New Levels

1. Add new level config in `LEVEL_CONFIG`
2. Upload new background image
3. Update level selector options

### Styling Changes

- Edit `app/globals.css` for global styles
- Modify Tailwind classes in components
- Update color scheme in `tailwind.config.js`

## 🐛 Troubleshooting

### Common Issues

1. **Tiles not moving**: Check browser console for errors
2. **Images not loading**: Verify image URLs are accessible
3. **Frame not working**: Check Farcaster Frame validator
4. **Build errors**: Run `npm run type-check`

### Debug Mode

Add console logs in development:
\`\`\`typescript
console.log('Tile moved:', { from: index, to: emptyIndex })
\`\`\`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/monad-puzzle-farcaster/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/monad-puzzle-farcaster/discussions)
- **Farcaster**: [@yourusername](https://warpcast.com/mjfendin)

## 🙏 Acknowledgments

- Monad team for the logo and inspiration
- Farcaster team for the Mini Apps platform
- Farcade team for the SDK
- Shadcn for the UI components

---

Built with ❤️ for the Farcaster ecosystem