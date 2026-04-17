# Contributing to HarvestLink

Thanks for wanting to help. Bandit appreciates it. 🦝

## Quick Start

```bash
git clone https://github.com/beaux-riel/HarvestLink.git
cd HarvestLink
git checkout v2-nextjs
npm install
cp .env.example .env.local
# Fill in credentials (see .env.example)
npm run dev
```

## What We Need Help With

### Right Now
- **Producer onboarding UX** — making it dead simple for non-technical people to list their stuff
- **Mobile PWA testing** — install prompts, offline behaviour, push notifications
- **Accessibility** — screen readers, keyboard navigation, colour contrast
- **Localisation** — right now it's English-only with Powell River references; we want it to work for any town

### Always Welcome
- Bug fixes with reproduction steps
- Performance improvements (bundle size, loading speed)
- Documentation improvements
- New Bandit art (follow the ink splash punk style — see brand guide)

### Not Looking For
- Payment processing (we're visibility-first, not a marketplace)
- Blockchain anything
- Generic "AI-powered" features that don't serve the community

## How to Contribute

1. **Fork the repo** and create a branch from `v2-nextjs`
2. **Make your changes** — keep commits focused and descriptive
3. **Test locally** — `npm run build` should pass clean
4. **Open a PR** against `v2-nextjs` with a clear description

## Code Style

- TypeScript strict mode
- Tailwind CSS for styling (follow existing design tokens in `globals.css`)
- Server components by default, `"use client"` only when needed
- Bandit copy: warm, irreverent, neighbourly. Never corporate.

## Bandit Art Style

If you want to contribute illustrations:
- **Style**: Ink splash punk — bold black outlines, watercolour splashes, paint drips
- **Palette**: Rust red (#d94f30), golden yellow (#daa520), forest green (#3a5a40), warm ink (#2d2a26)
- **No text in images** (spelling issues with generation)
- **No goofy cartoon faces** — Bandit is mischievous, not silly
- **Format**: 1024x1024 source, export as 800px WebP (quality 85)

## Running Your Own Instance

HarvestLink is designed to be forked for other communities. You'll need:
- A Supabase project (free tier works)
- A Mapbox token (free tier works)
- A Vercel account (free tier works)

Change the location coordinates, update the branding, seed your own producers, and you've got a food network.

## Questions?

Open an issue on GitHub. Bandit reads them all. Eventually.

---

*Built with ♜ and 🦝 in Powell River, BC*
