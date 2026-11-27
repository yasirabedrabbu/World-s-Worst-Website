# 🏆 Guinness Hall of Atrocities — World's Worst Website

A satirical React + TypeScript web app that intentionally recreates the **worst UX patterns** on the internet — dark patterns, hostile design, dodging buttons, guilt-trip unsubscribe flows, and more — all wrapped in a chaotic, retro, comic-styled "Guinness World Records" theme. Built purely for comedy and UX education: it shows *exactly what not to do* by doing it as badly (and hilariously) as possible.

> ⚠️ This is satire. Every "feature" here is deliberately terrible.

## ✨ Features

- **🏆 Hall of Atrocities** — 10 official "world records" for worst digital product design, plus a mini-game to catch an escaping fly and a reverse-text guestbook.
- **🎧 Customer Disservice Center** — Chat with "Karen-9000," an AI agent trained exclusively on dismissive responses, an automated phone tree that leads nowhere, and a queue counter that goes *up*.
- **💔 The 12-Stage Guilt Unsubscribe Maze** — A guilt-trip mascot (Barnaby the Office Puppy), a hostile reason picker, a double-negative logic trap checkbox, and a "cancel" button that flees your cursor.
- **🛒 Worst Store** — Predatory e-commerce patterns: hidden fees, fake urgency, and confusing checkout flows.
- **📌 Worst Pinterest** — A cursed pinboard experience.
- **🍪 Cookie Nightmare Modal**, **Fake CAPTCHA**, **Low Battery Panic**, **Inactivity Alerts**, **Pop-up Ad Swarm** — classic hostile web patterns, reimagined.
- **🧪 Polyglot Tools Wing** — A modern, filterable arcade of nine live toys: 60/30/10 **Palette Forge**, **Museum Settings** (live CSS-variable customisation), **Regex Surgery**, **JSON Forge**, a real **Python Text Autopsy** bridge, **Sort Race**, a canvas **Snake** game, **Strict Typing** quiz, and a **Polyglot Codex** with runnable Java, Python, Rust, C, C# and JavaScript specimens.
- **🎮 Gamification System** — XP, achievements, and a floating HUD that rewards you for surviving the chaos.
- **🌀 Chaos Mode** — A random 30% chance to invert your actions, just to keep you on your toes.
- **🇧🇩 Bilingual (Bangla/English)** hostile warning modal and viral news section.
- **📜 Guinness Certificate** — Claim your official diploma for surviving the site.
- Sound effects, scrambled headers, retro comic-book styling (`Press Start 2P`, `Comic Neue`), and heavy use of Tailwind + `motion/react` for maximum chaotic energy.

## 🛠️ Tech Stack

- **React** + **TypeScript**, lazy-loaded routes and manual vendor chunks
- **Tailwind CSS v4** + a strict 60 / 30 / 10 colour system
- **motion/react**, GSAP, CSS keyframes and canvas animation
- **lucide-react** (icons)
- **Python** server bridge (`tools/py_analyze.py`) with a JavaScript fallback
- **Runnable specimens**: Java (`tools/ByteForge.java`), Rust (`tools/entropy.rs`), C (`tools/hexdump.c`), C# (`tools/Badge.cs`), JS (`tools/palette.mjs`)

## 🧰 Polyglot toolbelt

| Tool | Runtime | What it does |
| --- | --- | --- |
| Palette Forge | JavaScript | Generates and applies a 60/30/10 palette |
| Museum Settings | CSS vars | Radius, font size, animation energy, grain — persisted |
| Regex Surgery | RegExp | Live match highlighting and presets |
| JSON Forge | JavaScript | Validate, beautify, minify, copy |
| Text Autopsy | Python + JS | Entropy, vocabulary and reading time |
| Sort Race | JavaScript | Animated bubble vs insertion race |
| Snake | Canvas | Keyboard + touch game with best score |
| Strict Typing | JavaScript | Language quiz with streaks and XP |
| Polyglot Codex | Java/Rust/C/C#/Py/JS | Source specimens and simulated output |

Every new module in `src/components/polyglot/`, `src/data/`, `src/styles/` and `tools/` is **≤ 200 lines**.

## 📂 Project Structure

```
src/
├── App.tsx                    # Main app shell, navigation, and global state
├── components/
│   ├── polyglot/              # ToolShell, PaletteForge, RegexLab, JsonForge, games...
│   ├── museum/                # Exhibit, MuseumHero, MuseumFooter
│   └── ...                    # Shared UI: modals, nav, popups, gamification
├── pages/
│   ├── PolyglotTools.tsx      # Nine-tool polyglot arcade
│   ├── WorstStore.tsx
│   ├── WorstSupport.tsx
│   ├── WorstUnsubscribe.tsx
│   ├── WorstRecords.tsx
│   └── WorstPinterest.tsx
├── data/                      # Achievement + polyglot sample data
├── styles/                    # Polyglot tool/lab stylesheets
├── hooks/                     # useHeaderScramble, useGsapScrollTrigger, useMuseumMotion
├── utils/                     # audioSynth, presenceClient
└── types.ts                   # Shared types
tools/                         # Runnable Java, Python, Rust, C, C#, JS specimens
```

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# Install dependencies
npm install

# Run locally
npm run dev
```

Then open the app in your browser and brace yourself.

## 🎯 Why This Exists

This project is a tongue-in-cheek showcase of anti-patterns commonly seen in real-world hostile design: dark patterns, deceptive unsubscribe flows, fake urgency, unreadable legal text, evasive buttons, and more. It doubles as:

- A fun portfolio piece demonstrating advanced React/animation skills
- A conversation starter about ethical UX design
- A stress-relief playground for anyone who's ever fought with a "Cancel Subscription" button

## 🤝 Contributing

Got an idea for an even more diabolical dark pattern? PRs are welcome — as long as it's funny, satirical, and not something anyone should actually ship in production.

## 📄 License

MIT — do whatever you want with this, just don't actually deploy these patterns on a real product. 😅

---

*Certified by the Guinness Committee of Terrible Code.*
