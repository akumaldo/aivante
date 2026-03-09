# AIPF Visual Redesign — "Black & Gold Editorial"

**Date:** 2026-03-09
**Status:** Approved
**Brand:** AIPF — Integração e Performance

## Context

The current site uses a cliché AI color palette (cyan #06b6d4 + violet #8b5cf6 on dark slate, Inter font, glassmorphism, aurora WebGL background). The goal is to establish a premium consulting identity that feels like high-end advisory (McKinsey/private equity), not a tech startup.

## Design Direction

**Tone:** Sofisticação executiva — authority, trust, luxury
**Theme:** Dark mode refinado with warm undertones
**Accent:** Gold/Amber palette
**Background:** Aurora WebGL recolored to warm gold/amber tones
**Logo:** Geometric "A" monogram in gold gradient + "AIPF" serif + "INTEGRAÇÃO E PERFORMANCE" small caps

## Color System

### CSS Variables (replacing current HSL system)

```
Core palette:
--black:          #0A0A08     (warm black, NOT blue-tinted slate)
--black-warm:     #0F0E0B     (slightly lighter warm black)
--surface:        #151412     (card backgrounds)
--surface-raised: #1C1A17     (elevated elements)
--surface-hover:  #232019     (hover states)

Borders:
--border:         #2A2621     (subtle borders)
--border-light:   #3D382F     (emphasized borders)

Gold accent system:
--gold:           #C8A45E     (primary accent — CTAs, active states, highlights)
--gold-light:     #D4B87A     (hover states, lighter accents)
--gold-dark:      #A8893E     (darker accents, borders, muted gold)
--gold-muted:     rgba(200, 164, 94, 0.12)  (backgrounds, badges)
--gold-glow:      rgba(200, 164, 94, 0.06)  (radial glows, ambient light)

Text:
--text-primary:   #F2EDE6     (warm off-white, main text)
--text-secondary: #A09888     (warm gray, secondary text)
--text-muted:     #6B6156     (muted labels, captions)

Semantic (for Problem section - errors/warnings):
--warm-red:       #C45B4A     (muted warm red for problem indicators)
--warm-red-bg:    rgba(196, 91, 74, 0.10)
```

### What gets replaced

| Current | New |
|---------|-----|
| `bg-slate-900` | `bg-[#0A0A08]` / `bg-background` |
| `bg-slate-800` | `bg-[#151412]` / `bg-surface` |
| `text-cyan-400` | `text-[#C8A45E]` / `text-gold` |
| `text-violet-400` | `text-[#D4B87A]` / `text-gold-light` |
| `text-slate-400` | `text-[#A09888]` / `text-secondary` |
| `text-slate-300` | `text-[#F2EDE6]` / `text-primary` |
| `text-white` | `text-[#F2EDE6]` / `text-primary` |
| `bg-cyan-500/10` | `bg-[rgba(200,164,94,0.12)]` / `bg-gold-muted` |
| `border-cyan-500/20` | `border-[#2A2621]` / `border-border` |
| `glow-cyan` | `glow-gold` (gold box-shadow) |
| `text-gradient` (cyan→violet) | `text-gold` (solid gold) or gold gradient |

### Multi-color system for cards (UseCases, Blog)

Replace the rainbow colorMap (cyan/violet/emerald/blue/amber/rose) with a monochromatic gold system using opacity variations:

```
All cards use the same gold accent at different opacities:
- Primary cards:   gold at 100% (#C8A45E)
- Secondary cards:  gold-light (#D4B87A)
- Tertiary cards:   gold-dark (#A8893E)
- Borders/bg:       gold-muted (12% opacity)
```

This creates visual hierarchy through intensity, not color variety — consistent with luxury design.

## Typography

### Font Replacement

| Current | New | Purpose |
|---------|-----|---------|
| Inter (all weights) | **Cormorant Garamond** 300, 400, 500, 600 | Headlines, display text, numbers |
| Inter (all weights) | **DM Sans** 300, 400, 500, 600, 700 | Body text, UI elements, buttons |

### Google Fonts import
```
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
```

### Usage rules
- **All h1, h2, h3** → Cormorant Garamond, weight 300-500
- **Body text, labels, buttons, nav** → DM Sans, weight 400-600
- **Section labels** (e.g., "O cenário que você reconhece") → DM Sans, uppercase, tracked, gold color
- **Stats/numbers** → Cormorant Garamond, weight 300 (elegant thin numerals)
- **Hero h1** → Cormorant Garamond weight 300, italic for emphasis word in gold

### Tailwind config additions
```js
fontFamily: {
  serif: ['Cormorant Garamond', 'Georgia', 'serif'],
  sans: ['DM Sans', 'system-ui', 'sans-serif'],
},
```

## Visual Effects — What Changes

### Remove
- `glass` / `glass-card` utilities (glassmorphism with backdrop-blur)
- `glow-cyan` / `glow-violet` box shadows
- `text-gradient` (cyan→violet gradient text)
- `text-gradient-blue`
- Floating colored blobs in Hero (cyan/violet pulsing circles)
- All `bg-cyan-500/10`, `bg-violet-500/10` etc. colored backgrounds
- Rounded pills/badges with colored backgrounds

### Replace with
- **Cards:** Solid `bg-surface` (#151412) with thin `border-border` (#2A2621). On hover: border goes gold, subtle gold glow
- **Glow:** `glow-gold` → `box-shadow: 0 0 20px rgba(200, 164, 94, 0.15), 0 0 40px rgba(200, 164, 94, 0.05)`
- **Text emphasis:** Solid gold color (#C8A45E) or italic Cormorant in gold
- **Badges/labels:** Thin border + gold text, no background fill (or very subtle gold-muted bg)
- **Section dividers:** `linear-gradient(to right, transparent, #2A2621, transparent)` — elegant fade-in/fade-out lines
- **Hero decorative:** Single radial gold glow (`radial-gradient(circle, rgba(200,164,94,0.06), transparent)`) centered behind headline
- **Noise texture:** Subtle SVG fractal noise overlay at 2-3% opacity (warm grain, like paper texture)
- **Hover on cards:** Top border animates in gold (width 0→100%), background subtly warms

### Aurora Background recolor

In `AuroraBackground.tsx` fragment shader, replace:
```glsl
// OLD
vec3 baseColor = vec3(0.059, 0.086, 0.165);     // blue-slate
vec3 cyanColor = vec3(0.024, 0.714, 0.831);      // cyan
vec3 violetColor = vec3(0.545, 0.361, 0.965);    // violet
vec3 blueColor = vec3(0.231, 0.510, 0.965);      // blue

// NEW
vec3 baseColor = vec3(0.039, 0.039, 0.031);      // warm black #0A0A08
vec3 goldColor = vec3(0.784, 0.643, 0.369);      // gold #C8A45E
vec3 amberColor = vec3(0.831, 0.722, 0.478);     // gold-light #D4B87A
vec3 warmColor = vec3(0.659, 0.537, 0.243);      // gold-dark #A8893E
```

Also reduce the mix intensities to make it more subtle:
```glsl
color = mix(color, goldColor, smoothstep(0.2, 0.6, combinedNoise) * 0.08);
color = mix(color, amberColor, smoothstep(0.3, 0.7, combinedNoise + 0.2) * 0.06);
color = mix(color, warmColor, smoothstep(0.1, 0.5, combinedNoise - 0.1) * 0.04);
```

## Component-by-Component Changes

### App.tsx
- Change `bg-slate-900` → `bg-[#0A0A08]`
- Skip-to-content: `bg-cyan-500` → `bg-[#C8A45E]`, `text-slate-900` → `text-[#0A0A08]`

### RightRailNav
- Desktop active dot: `bg-cyan-400` → `bg-[#C8A45E]`, shadow gold
- Desktop inactive: `bg-slate-600` → `bg-[#3D382F]`
- Mobile active: `text-cyan-400` → `text-[#C8A45E]`
- Glass container → `bg-[#151412]/80 backdrop-blur-sm border border-[#2A2621]`
- Tooltip: same warm surface treatment

### Hero
- Badge: remove cyan bg/border, use `border-[#2A2621]` + gold dot + `text-[#A09888]`
- h1: `text-white` → `text-[#F2EDE6]`, `font-serif font-light` (Cormorant 300)
- `text-gradient` span → `text-[#C8A45E] italic` (gold italic)
- h2: `text-slate-300` → `text-[#A09888]`, change to `font-sans`
- Body: `text-slate-400` → `text-[#A09888]`
- Primary button: `bg-cyan-500` → `bg-[#C8A45E] text-[#0A0A08]`, hover: `bg-[#D4B87A]`
- Secondary button: `border-slate-600` → `border-[#3D382F]`, hover: `border-[#C8A45E] text-[#C8A45E]`
- Framework card: `glass-card` → `bg-[#151412] border border-[#2A2621]`, hover: `border-[#A8893E]`
- Remove floating blobs (cyan/violet circles)
- Gradient overlay: `to-slate-900/50` → `to-[#0A0A08]/50`
- Icon colors: `text-cyan-400` → `text-[#C8A45E]`

### Problem
- Section label: `text-violet-400` → `text-[#C8A45E]` (gold)
- h2: `text-white` → `text-[#F2EDE6] font-serif font-normal` (Cormorant 400)
- Body: `text-slate-400` → `text-[#A09888]`
- Cards: `glass-card` → `bg-[#0F0E0B] border border-[#2A2621]`
- Card hover: `border-red-500/30` → `border-[#C8A45E]/30` + top gold line animation
- Icon container: `from-red-500/20 to-orange-500/10` → `bg-[rgba(200,164,94,0.12)]`
- Icons: `text-red-400` → `text-[#C8A45E]`
- Stats: `text-amber-400/80` → `text-[#A8893E]`

### Solution
- Opening badge: cyan → gold
- All `colorMap` references → single gold system
- Journey cards: same treatment as other cards (warm surface + gold borders)
- Phase labels: `text-cyan/violet/emerald-400` → all `text-[#C8A45E]`
- Framework badge: violet → gold
- FrontierOps badge: emerald → gold
- All card backgrounds: `glass-card` → warm surface

### UseCases
- Section label: `text-emerald-400` → `text-[#C8A45E]`
- All colorMap entries → single gold palette
- Metric pills: gold-muted bg + gold text

### Blog
- Section label: `text-cyan-400` → `text-[#C8A45E]`
- All colorMap → gold palette
- Tag badges: gold-muted bg
- "Ver mais" links: gold color
- Bottom CTA link: gold

### CTA
- Background gradient: `via-cyan-500/5` → `via-[rgba(200,164,94,0.03)]`
- Icon circle: `from-cyan-500/20 to-violet-500/20` → `bg-[rgba(200,164,94,0.12)]`
- Icon: `text-cyan-400` → `text-[#C8A45E]`
- Label: `text-cyan-400` → `text-[#C8A45E]`
- Card: `glass` → `bg-[#151412] border border-[#2A2621]`
- Button: gold primary

### FAQ
- Label: `text-violet-400` → `text-[#C8A45E]`
- Accordion items: `glass-card` → warm surface
- Open state: `border-cyan-500/30` → `border-[#C8A45E]/30`
- Trigger hover: `hover:text-cyan-400` → `hover:text-[#C8A45E]`

### About
- Label: `text-cyan-400` → `text-[#C8A45E]`
- Avatar gradient: `from-cyan-500/30 via-violet-500/30 to-blue-500/30` → gold gradient
- Inner: `bg-slate-800` → `bg-[#151412]`
- Initials: `text-gradient` → `text-[#C8A45E]`
- Service cards: `bg-slate-800/50` → `bg-[#1C1A17]`
- Service icons: cyan/violet → gold
- Links: warm surface treatment, "Agendar" → gold accent
- Container: `glass` → warm surface + border

### Footer
- Border: `border-white/5` → `border-[#2A2621]`
- Links hover: `hover:text-cyan-400` / `hover:text-violet-400` → `hover:text-[#C8A45E]`
- Copyright: `text-slate-500` → `text-[#6B6156]`
- Brand text: `font-bold` → `font-serif font-normal tracking-wider`

### ChatBubble
- Accent colors: cyan → gold

## index.css Changes Summary

1. Replace Inter import with Cormorant Garamond + DM Sans
2. Replace all CSS variable values with new warm palette
3. Remove: `.text-gradient`, `.text-gradient-blue`, `.glass`, `.glass-card`, `.glow-cyan`, `.glow-violet`
4. Add: `.glow-gold`, `.card` (warm surface card), `.text-gold`, noise texture overlay
5. Update scrollbar colors
6. Update form focus styles (gold ring)
7. Keep animation keyframes but update colors

## tailwind.config.js Changes

1. Add `fontFamily` (serif + sans)
2. Update extended colors to new palette
3. Add gold color utilities

## Files to Modify

| File | Changes |
|------|---------|
| `app/src/index.css` | Full palette replacement, utility classes |
| `app/tailwind.config.js` | Colors, fonts, new utilities |
| `app/src/App.tsx` | Background color, skip-to-content |
| `app/src/components/background/AuroraBackground.tsx` | Shader colors |
| `app/src/components/navigation/RightRailNav.tsx` | Nav colors, glass → warm surface |
| `app/src/sections/Hero.tsx` | Full restyling |
| `app/src/sections/Problem.tsx` | Colors, card styling |
| `app/src/sections/Solution.tsx` | Colors, colorMap, card styling |
| `app/src/sections/UseCases.tsx` | Colors, colorMap, card styling |
| `app/src/sections/Blog.tsx` | Colors, colorMap, card styling |
| `app/src/sections/CTA.tsx` | Colors, glass → warm surface |
| `app/src/sections/FAQ.tsx` | Colors, accordion styling |
| `app/src/sections/About.tsx` | Colors, avatar, links |
| `app/src/sections/Footer.tsx` | Colors, typography |
| `app/src/components/chat/ChatBubble.tsx` | Accent colors |
| `app/src/components/ui/button.tsx` | Focus ring color |

## Brand Updates

- All references to "AINOVA" → "AIPF"
- Logo image path stays `/og-image.png` (user will update the file)
- Footer copyright: "AIPF — Integração e Performance"
