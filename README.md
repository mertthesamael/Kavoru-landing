# Kavoru Landing

Marketing site for **[Kavoru](https://github.com/mertthesamael/Kavoru)** — the Elysia.js starter for humans (GitHub template repository).

Layout inspired by the [ElysiaJS](https://elysiajs.com) website. Visual identity uses **coral → rose → periwinkle** on warm charcoal.

## Run locally

```bash
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
bun run build
bun run preview
```

Static output is written to `dist/`. Set your production URL before building:

```bash
cp .env.example .env
# Edit SITE_URL=https://your-domain.com
bun run build
```

This injects canonical, Open Graph, Twitter, and JSON-LD URLs. `robots.txt` and `sitemap.xml` are generated into `dist/` on build.

## SEO & social previews

| Asset | Path | Purpose |
|---|---|---|
| OG PNG | `public/og.png` | Facebook, LinkedIn, Discord, Twitter (1200×630) |
| OG SVG | `public/og.svg` | Source / editable social card |
| Apple icon | `public/apple-touch-icon.svg` | iOS home screen |
| Manifest | `public/site.webmanifest` | PWA metadata |

Included in every build:

- Meta description, keywords, robots, canonical
- Open Graph + Twitter Card (`summary_large_image`)
- JSON-LD `SoftwareApplication` schema
- Auto-generated `robots.txt` + `sitemap.xml`

Update `SITE_URL` in `.env` to match your deployed domain (default: `https://www.kavoru.com`).

## Palette

| Token | Color | Use |
|---|---|---|
| Coral | `#f06449` | Primary accent, glows |
| Peach | `#ffb38a` | Eyebrows, active tabs |
| Periwinkle | `#8fa6ff` | Links, labels |
| Mint | `#6ee7c7` | Code strings |
| Lavender | `#c4b5fd` | Code keywords |

Code blocks use a flat dark surface — no background on tokens or inline `<code>` inside `<pre>`.

**OG preview broken?** Set `SITE_URL` to your live domain (e.g. `https://www.kavoru.com`) before `bun run build`. If `og:image` points at the wrong host, Discord/Twitter show a grey empty card. After redeploying, re-share the link to refresh their cache.

## Brand

| | |
|---|---|
| **Name** | Kavoru |
| **Tagline** | Elysia starter for humans |
| **Repo** | [Kavoru](https://github.com/mertthesamael/Kavoru) |

## Customize

- **Colors** — CSS variables in `src/style.css` (`:root`)
- **Copy & links** — `index.html`
- **Code tabs** — panels in `index.html`, logic in `src/main.ts`
