# 🦝 The Trash Panda

**Decentralised food infrastructure for small towns.**

Built in Powell River, BC. Open source forever.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## What is this?

The Trash Panda makes the invisible local food economy visible. Every small town has people growing, baking, preserving, and selling food from their homes — but nobody knows about it unless they already know. We fix that.

It's not a marketplace. It's a living map of what your neighbours are growing, making, and selling right now.

**Start local. Stay local. Know your food. Know your neighbour.**

## Meet Bandit 🦝

Bandit is our mascot — a trash panda who finds treasure where others see waste. He grew up in the alleys behind Powell River's grocery stores, watched 1,400km supply trucks roll in while gardens overflowed three blocks over, and decided to do something about it.

He changes based on weather and time of day. Rainy morning? Rain boots. Midnight? Night prowl. Storm? Standing guard over the harvest. Because he actually lives here.

## Tech Stack

- **Framework**: Next.js 14 (App Router, PWA)
- **Database**: Supabase (PostgreSQL + PostGIS + Auth + Realtime)
- **Maps**: Mapbox GL JS
- **Hosting**: Vercel
- **Styling**: Tailwind CSS
- **Art**: Generated locally via ComfyUI + SDXL (ink splash punk style)

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

## Why Open Source?

Community food infrastructure shouldn't be locked down. The code is free. The network is yours. We believe every small town deserves to know what's growing next door.

**Revenue model**: Hosted platform for other communities, premium features for commercial producers, and community resilience grants. The code is free, the value is in the network.

## Run It For Your Town

The Trash Panda is designed to be forked. Swap out the coordinates, seed your own producers, and you've got a community food network. Supabase free tier, Vercel free tier, Mapbox free tier — $0 to launch.

## Philosophy

> Your grocery store gets 1,400 trucks a year from somewhere else. Your neighbour has 200 pounds of zucchini and nowhere to put it. This is a coordination problem, not a supply problem.

Decentralised food resilience infrastructure. Not anti-commerce — anti-fragility. When the ferry doesn't run, when the trucks don't come, when the supply chain hiccups... the local network is still there.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT — see [LICENSE](LICENSE)

---

*Built with ♜ and 🦝 in Powell River, BC*
*thetrashpanda.ca*
