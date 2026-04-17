# 🦝 HarvestLink

**Decentralised food infrastructure for small towns.**

Built in Powell River, BC. Open source forever.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## What is this?

HarvestLink makes the invisible local food economy visible. Every small town has people growing, baking, preserving, and selling food from their homes — but nobody knows about it unless they already know. HarvestLink fixes that.

It's not a marketplace. It's a living map of what your neighbours are growing, making, and selling right now.

**Start local. Stay local. Know your food. Know your neighbour.**

## Tech Stack

- **Framework**: Next.js 14 (App Router, PWA)
- **Database**: Supabase (PostgreSQL + PostGIS + Auth + Realtime)
- **Maps**: Mapbox GL JS
- **Hosting**: Vercel
- **Styling**: Tailwind CSS
- **Mascot**: Bandit 🦝 (generated locally via ComfyUI + SDXL)

## Getting Started

```bash
git clone https://github.com/beaux-riel/HarvestLink.git
cd HarvestLink
git checkout v2-nextjs
npm install
cp .env.example .env.local
# Fill in your Supabase + Mapbox credentials
npm run dev
```

## Bandit the Raccoon 🦝

Bandit is the River City Raccoon — our mascot who changes based on weather and time of day. Rainy morning? Bandit's in rain boots. Midnight? He's prowling the garden. Stormy? He's standing guard over the harvest.

The art is generated locally using ComfyUI with SDXL + custom LoRAs, in a hand-drawn ink splash punk style. No stock photography. No AI slop. Just a raccoon with attitude.

## Why Open Source?

Community food infrastructure shouldn't be locked down. The code is free. The network is yours. We believe every small town deserves to know what's growing next door.

**Revenue model**: Hosted platform for other communities, premium features for commercial producers, and community resilience grants. The code is free, the value is in the network.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. We welcome contributions from developers, designers, and anyone who thinks their town deserves better food visibility.

## Philosophy

> Your grocery store gets 1,400 trucks a year from somewhere else. Your neighbour has 200 pounds of zucchini and nowhere to put it. This is a coordination problem, not a supply problem.

HarvestLink is decentralised food resilience infrastructure. Not anti-commerce — anti-fragility. When the ferry doesn't run, when the trucks don't come, when the supply chain hiccups... the local network is still there.

## License

MIT — see [LICENSE](LICENSE)

---

*Built with ♜ and 🦝 in Powell River, BC*
