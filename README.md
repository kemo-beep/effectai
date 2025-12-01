# ⚡ MotionForge - AI-Powered Motion Graphics Studio

Create stunning motion graphics by typing a prompt. No After Effects needed.

![MotionForge](https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue)
![Remotion](https://img.shields.io/badge/Rendered%20with-Remotion-purple)

## ✨ Features

- **AI-Powered Generation**: Describe your video idea, get professional motion graphics
- **8 Animation Types**: Text reveals, kinetic typography, logo intros, shape morphs, and more
- **8 Style Presets**: Neon futuristic, corporate minimal, hand-drawn, and more
- **Real-time Preview**: See your animations instantly with the Remotion player
- **Scene Editor**: Edit text, colors, timing, and animation types
- **Cloud Rendering**: Export high-quality MP4 videos via Remotion Lambda

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your API keys:

- **GEMINI_API_KEY**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **AWS credentials**: Required for video export (see Remotion Lambda setup below)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Preview in Remotion Studio (Optional)

```bash
npm run remotion
```

## 🎬 How to Use

### Option 1: Use Templates (Fastest)
1. Click **"📚 Templates"** button in header
2. Browse by category (YouTube, Social Media, Explainer, etc.)
3. Click a template to load it
4. Customize text, colors, and timing
5. Export your video

### Option 2: AI Generation
1. **Enter a Prompt**: Describe your motion graphic idea
   - "Create a 15-second promo for a fitness app with neon style"
   - "Like and subscribe animation for YouTube"
   - "Product showcase for new smartphone"
   - "Infographic showing 75% growth statistics"

2. **Choose Style & Duration**: Select from 8 style presets and set video length

3. **Click Generate**: AI creates scenes with appropriate animations

4. **Edit Scenes**: Click timeline scenes to customize text, colors, and timing

5. **Export**: Render your video to MP4 (requires AWS Lambda setup)

### Example Prompts for Content Creators
- "Subscribe and hit the bell icon animation"
- "Lower third name tag for interview"
- "Viral shorts opener with wait for it text"
- "Product launch announcement with 3D effects"
- "Statistics infographic showing user growth"
- "Meme-style boom text effect"
- "10 million downloads counter animation"
- "VHS retro glitch intro"
- "Step by step tutorial checklist"
- "Timeline showing company history"
- "App showcase with phone mockup"
- "Typewriter code demo animation"

## 🎨 Available Styles

| Style | Description |
|-------|-------------|
| Bold Modern | Clean, impactful with indigo/pink gradients |
| Neon Futuristic | Glowing effects, dark backgrounds |
| Corporate Minimal | Professional, clean aesthetics |
| Kinetic 3D | Dynamic purple/magenta with glow |
| Gradient Flow | Flowing cyan/purple gradients |
| Lo-Fi Anime | Soft pastels, dreamy vibes |
| Elegant Classic | Warm, sophisticated tones |
| Hand Drawn | Playful, organic feel |

## 🎭 Animation Types (25 Total)

### Core Animations
- **Text Reveal**: Words fade in with smooth transitions
- **Logo Intro**: Animated rings with logo reveal
- **Kinetic Typography**: Characters animate individually with wave effects
- **Bounce In**: Playful bouncing character animations
- **Fade Sequence**: Elegant staggered fades

### Visual Effects
- **Shape Morph**: Morphing geometric shapes
- **Parallax**: Multi-layer depth effect
- **Slide Transition**: Panel-based transitions
- **Transition Effect**: Wipe and glitch transitions
- **Gradient Wave**: Animated flowing gradients

### Content Creator Essentials
- **Lower Third**: Name tags and title overlays
- **Social Callout**: Like, subscribe, follow animations
- **Infographic Chart**: Animated bar charts
- **Number Counter**: Animated counting statistics
- **Animated Icon**: Icon + text with particle effects
- **Checklist**: Animated checkmark items
- **Timeline**: Step-by-step process visualization

### Product & Tech
- **Product Showcase**: 3D product reveals
- **Device Mockup**: Phone/app mockup animations
- **Typewriter**: Terminal-style typing effect

### Fun & Memes
- **Meme Effect**: Comic-style burst animations
- **Reaction Popup**: Emoji reactions with highlights
- **Speech Bubble**: Comment bubble animations
- **Glitch Text**: RGB split glitch effect
- **VHS Overlay**: Retro VHS aesthetic

## 📚 Template Library (16 Templates)

Pre-built templates across 8 categories:

### YouTube Intros
- Bold YouTube Intro
- Wave Background Intro

### Social Media
- Social Media Callout
- Comment Reaction

### Explainers
- Simple Explainer
- Tutorial Steps

### Product Demos
- Product Showcase
- App Showcase

### Educational
- Animated Statistics
- Big Number Stats
- Timeline Journey
- Code Demo

### Promotional
- Sale Promotion

### Shorts/Reels
- Viral Shorts Opener
- VHS Retro Style

### Vlogs
- Minimal Lower Third

## ☁️ Remotion Lambda Setup (For Export)

To enable video export, set up Remotion Lambda:

1. **Install AWS CLI** and configure credentials

2. **Deploy Remotion Lambda**:
   ```bash
   npm run deploy
   ```

3. **Add AWS credentials** to `.env.local`:
   ```
   REMOTION_AWS_ACCESS_KEY_ID=your_key
   REMOTION_AWS_SECRET_ACCESS_KEY=your_secret
   ```

See [Remotion Lambda docs](https://www.remotion.dev/docs/lambda) for detailed setup.

## 🛠 Tech Stack

- **Next.js 16** - React framework
- **Remotion 4** - Programmatic video creation
- **Gemini AI** - Scene generation
- **TypeScript** - Type safety
- **Zod** - Schema validation

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/     # AI generation endpoint
│   │   └── lambda/       # Remotion Lambda endpoints
│   ├── layout.tsx
│   └── page.tsx          # Main app page
├── components/
│   ├── PromptInput.tsx   # AI prompt interface
│   ├── SceneEditor.tsx   # Timeline & scene editing
│   └── ExportPanel.tsx   # Export controls
├── remotion/
│   ├── compositions/     # Animation components
│   ├── MotionForge.tsx   # Main composition
│   └── Root.tsx          # Remotion entry
└── types/
    └── constants.ts      # Types & configs
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run remotion` | Open Remotion Studio |
| `npm run render` | Render video locally |
| `npm run deploy` | Deploy Remotion Lambda |

## 🤝 Contributing

Contributions welcome! Feel free to submit issues and PRs.

## 📄 License

MIT
