# Ngọc Điệp — @discord portfolio

Interactive portfolio styled as a Discord server. Built with Vite + React 19 + TypeScript + Tailwind v4 + Motion.

## Stack

- **Vite 6** — bundler
- **React 19** + **TypeScript 5.7**
- **Tailwind CSS v4** — Discord theme tokens via `@theme`
- **Motion** (`motion/react`) — message / dropdown animations
- **Phosphor icons**

## Features

- **Discord-authentic layout** — server rail, channel list, chat area, member list, user bar
- **4 themes** — Discord Dark, Discord Light, Dracula, Nord (persisted in `localStorage`)
- **2 languages** — Vietnamese (default) + English (i18n via custom `useT()` hook + flat dictionary)
- **6 sections** — `#welcome`, `#about-me`, `#projects`, `#tech-stack`, `#experience`, `#contact-me`
- **Real user avatar** — Discord-style circular with role colors
- **Tech stack as Discord members** — online / idle / offline status dots, role colors

## Scripts

```bash
npm run dev         # dev server (port 5180)
npm run build       # production build → dist/
npm run typecheck   # tsc -b --noEmit
npm run preview     # preview production build
```

## Deploy

Optimized for **Vercel** (static). DNS managed by Cloudflare.

```bash
npm run build
# upload dist/ to Vercel, or connect GitHub repo for auto-deploy
```
