# AIPF Visual Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the AIPF website from a cliché AI color palette (cyan/violet/glassmorphism) to a premium "Black & Gold Editorial" aesthetic with warm tones, serif headlines, and luxury consulting identity.

**Architecture:** Pure visual/CSS transformation — no structural changes to components. Replace color system, fonts, and effects across 16 files. Foundation first (CSS variables + Tailwind config), then components top-down.

**Tech Stack:** React + Tailwind CSS + GSAP (existing). Adding Cormorant Garamond + DM Sans fonts.

**Design doc:** `docs/plans/2026-03-09-visual-redesign-design.md`

---

### Task 1: Foundation — index.css (fonts, variables, utilities)

**Files:**
- Modify: `app/src/index.css`

**Step 1: Replace the Google Fonts import**

Replace line 1:
```css
/* OLD */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* NEW */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
```

**Step 2: Replace all CSS variables in `:root`**

Replace the entire `:root` block with:
```css
:root {
    --background: 40 12% 3%;
    --foreground: 30 20% 93%;
    --card: 30 7% 8%;
    --card-foreground: 30 20% 93%;
    --popover: 30 7% 8%;
    --popover-foreground: 30 20% 93%;
    --primary: 40 50% 57%;
    --primary-foreground: 40 12% 3%;
    --secondary: 35 30% 45%;
    --secondary-foreground: 30 20% 93%;
    --muted: 30 7% 11%;
    --muted-foreground: 30 15% 50%;
    --accent: 40 50% 57%;
    --accent-foreground: 30 20% 93%;
    --destructive: 10 55% 53%;
    --destructive-foreground: 30 20% 93%;
    --border: 30 10% 15%;
    --input: 30 10% 15%;
    --ring: 40 50% 57%;
    --radius: 0.625rem;

    --black: #0A0A08;
    --black-warm: #0F0E0B;
    --surface: #151412;
    --surface-raised: #1C1A17;
    --surface-hover: #232019;
    --border-warm: #2A2621;
    --border-light: #3D382F;
    --gold: #C8A45E;
    --gold-light: #D4B87A;
    --gold-dark: #A8893E;
    --gold-muted: rgba(200, 164, 94, 0.12);
    --gold-glow: rgba(200, 164, 94, 0.06);
    --text-primary: #F2EDE6;
    --text-secondary: #A09888;
    --text-muted: #6B6156;
}
```

**Step 3: Update body font-family**

Replace:
```css
font-family: 'Inter', system-ui, sans-serif;
```
With:
```css
font-family: 'DM Sans', system-ui, sans-serif;
```

**Step 4: Replace utility classes**

Remove old utilities (`.text-gradient`, `.text-gradient-blue`, `.glass`, `.glass-card`, `.glow-cyan`, `.glow-violet`) and replace with:

```css
@layer utilities {
  .text-gold {
    color: var(--gold);
  }

  .card-warm {
    background: var(--surface);
    border: 1px solid var(--border-warm);
    transition: all 0.3s ease;
  }

  .card-warm:hover {
    border-color: var(--gold-dark);
    box-shadow: 0 0 20px var(--gold-glow);
  }

  .glow-gold {
    box-shadow: 0 0 20px rgba(200, 164, 94, 0.15), 0 0 40px rgba(200, 164, 94, 0.05);
  }

  .section-padding {
    @apply py-24 md:py-32;
  }

  .container-custom {
    @apply w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8;
  }
}
```

**Step 5: Update scrollbar colors**

```css
::-webkit-scrollbar-track {
  background: var(--black);
}

::-webkit-scrollbar-thumb {
  background: var(--border-warm);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--border-light);
}
```

**Step 6: Update form focus styles**

```css
input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(200, 164, 94, 0.2);
}
```

**Step 7: Run dev server and verify no build errors**

Run: `cd app && npm run dev`
Expected: Compiles without errors. Site loads (will look broken — colors from CSS vars changed but components still reference old Tailwind classes).

**Step 8: Commit**

```
feat: replace color system and fonts — Black & Gold Editorial foundation
```

---

### Task 2: Tailwind Config — colors, fonts, utilities

**Files:**
- Modify: `app/tailwind.config.js`

**Step 1: Add fontFamily and gold color extensions**

In `theme.extend`, add:
```js
fontFamily: {
  serif: ['Cormorant Garamond', 'Georgia', 'serif'],
  sans: ['DM Sans', 'system-ui', 'sans-serif'],
},
```

And in the `colors` section, add these alongside existing semantic colors:
```js
gold: {
  DEFAULT: '#C8A45E',
  light: '#D4B87A',
  dark: '#A8893E',
  muted: 'rgba(200, 164, 94, 0.12)',
  glow: 'rgba(200, 164, 94, 0.06)',
},
warm: {
  black: '#0A0A08',
  'black-light': '#0F0E0B',
  surface: '#151412',
  'surface-raised': '#1C1A17',
  'surface-hover': '#232019',
  border: '#2A2621',
  'border-light': '#3D382F',
},
text: {
  primary: '#F2EDE6',
  secondary: '#A09888',
  muted: '#6B6156',
},
```

**Step 2: Verify build**

Run: `cd app && npm run dev`
Expected: Compiles. New Tailwind classes like `text-gold`, `bg-warm-surface`, `font-serif` are now available.

**Step 3: Commit**

```
feat: extend Tailwind config with gold palette and serif/sans font families
```

---

### Task 3: Aurora Background — recolor shader

**Files:**
- Modify: `app/src/components/background/AuroraBackground.tsx`

**Step 1: Replace shader colors**

In the `fragmentShader` string, replace the color definitions and mix calls:

Replace:
```glsl
vec3 baseColor = vec3(0.059, 0.086, 0.165);
vec3 cyanColor = vec3(0.024, 0.714, 0.831);
vec3 violetColor = vec3(0.545, 0.361, 0.965);
vec3 blueColor = vec3(0.231, 0.510, 0.965);

vec3 color = baseColor;
color = mix(color, cyanColor, smoothstep(0.2, 0.6, combinedNoise) * 0.15);
color = mix(color, violetColor, smoothstep(0.3, 0.7, combinedNoise + 0.2) * 0.12);
color = mix(color, blueColor, smoothstep(0.1, 0.5, combinedNoise - 0.1) * 0.08);
```

With:
```glsl
vec3 baseColor = vec3(0.039, 0.039, 0.031);
vec3 goldColor = vec3(0.784, 0.643, 0.369);
vec3 amberColor = vec3(0.831, 0.722, 0.478);
vec3 warmColor = vec3(0.659, 0.537, 0.243);

vec3 color = baseColor;
color = mix(color, goldColor, smoothstep(0.2, 0.6, combinedNoise) * 0.08);
color = mix(color, amberColor, smoothstep(0.3, 0.7, combinedNoise + 0.2) * 0.06);
color = mix(color, warmColor, smoothstep(0.1, 0.5, combinedNoise - 0.1) * 0.04);
```

**Step 2: Verify in browser**

Expected: Background shows subtle warm golden aurora instead of blue/cyan/violet.

**Step 3: Commit**

```
feat: recolor aurora background to warm gold tones
```

---

### Task 4: App.tsx + RightRailNav — shell and navigation

**Files:**
- Modify: `app/src/App.tsx`
- Modify: `app/src/components/navigation/RightRailNav.tsx`

**Step 1: Update App.tsx**

Replace `bg-slate-900` with `bg-warm-black`:
```tsx
<div className="relative min-h-screen bg-warm-black">
```

Replace skip-to-content link colors:
```tsx
className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold focus:text-warm-black focus:rounded-lg focus:font-semibold focus:text-sm"
```

**Step 2: Update RightRailNav.tsx — desktop nav**

Replace the glass container:
```tsx
{/* OLD */}
<div className="glass rounded-full py-4 px-2 flex flex-col items-center gap-3">

{/* NEW */}
<div className="bg-warm-surface/80 backdrop-blur-sm border border-warm-border rounded-full py-4 px-2 flex flex-col items-center gap-3">
```

Replace active/inactive dot colors:
```tsx
{/* OLD */}
activeSection === item.id
  ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
  : 'bg-slate-600 hover:bg-slate-400'

{/* NEW */}
activeSection === item.id
  ? 'bg-gold scale-125 shadow-[0_0_10px_rgba(200,164,94,0.5)]'
  : 'bg-warm-border-light hover:bg-text-secondary'
```

Replace tooltip glass:
```tsx
{/* OLD */}
<span className="glass px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200">

{/* NEW */}
<span className="bg-warm-surface/90 backdrop-blur-sm border border-warm-border px-3 py-1.5 rounded-lg text-xs font-medium text-text-primary">
```

**Step 3: Update RightRailNav.tsx — mobile nav**

Replace mobile container:
```tsx
{/* OLD */}
<nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">

{/* NEW */}
<nav className="fixed bottom-0 left-0 right-0 z-50 bg-warm-surface/90 backdrop-blur-sm border-t border-warm-border">
```

Replace mobile active states:
```tsx
{/* OLD */}
activeSection === id ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
/* and */
activeSection === id ? 'bg-cyan-400 scale-125' : 'bg-slate-600'

{/* NEW */}
activeSection === id ? 'text-gold' : 'text-text-secondary hover:text-text-primary'
/* and */
activeSection === id ? 'bg-gold scale-125' : 'bg-warm-border'
```

**Step 4: Verify navigation visually**

Expected: Navigation dots are gold when active, warm gray when inactive. Glass effect replaced with warm semi-transparent surface.

**Step 5: Commit**

```
feat: restyle App shell and navigation to Black & Gold palette
```

---

### Task 5: Hero section

**Files:**
- Modify: `app/src/sections/Hero.tsx`

**Step 1: Replace all color classes and add typography**

Full replacement list — apply all at once:

1. Gradient overlay: `to-slate-900/50` → `to-[#0A0A08]/50`
2. Badge: `bg-cyan-500/10 border border-cyan-500/20` → `border border-warm-border`
3. Badge icon: `<Sparkles className="w-4 h-4 text-cyan-400" />` → change to gold dot: replace with `<span className="w-1.5 h-1.5 rounded-full bg-gold" />`
4. Badge text: `text-sm text-cyan-400 font-medium` → `text-xs text-text-secondary font-medium tracking-wider uppercase`
5. h1: add `font-serif font-light`, keep `text-white` (maps to foreground), replace `text-gradient` span with `text-gold italic`
6. h2: `text-slate-300` → `text-text-secondary`, add `font-sans`
7. Body: `text-slate-400` → `text-text-secondary`
8. Primary button: `bg-cyan-500 hover:bg-cyan-400 text-slate-900 ... glow-cyan` → `bg-gold hover:bg-gold-light text-warm-black font-semibold px-8 py-6 text-base glow-gold transition-all duration-300 hover:scale-105`
9. Secondary button: `border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white` → `border-warm-border-light text-text-primary hover:border-gold hover:text-gold`
10. Helper text: `text-slate-500` → `text-text-muted`
11. Framework card: `glass-card` → `card-warm`, `hover:border-cyan-500/40` → remove (card-warm handles hover)
12. Framework icon container: `bg-cyan-500/20` → `bg-gold-muted`
13. Framework icon: `text-cyan-400` → `text-gold`
14. Framework label: `text-cyan-400` → `text-gold`
15. Framework title hover: `group-hover:text-cyan-400` → `group-hover:text-gold`
16. Remove both floating blob divs at the bottom (lines ~147-148)

**Step 2: Verify Hero section in browser**

Expected: Dark warm background, gold accent on headline italic word, gold CTA button, no floating colored blobs, serif headline.

**Step 3: Commit**

```
feat: restyle Hero section — gold accent, serif headlines, warm palette
```

---

### Task 6: Problem section

**Files:**
- Modify: `app/src/sections/Problem.tsx`

**Step 1: Apply all color replacements**

1. Section label: `text-violet-400` → `text-gold`
2. h2: add `font-serif font-normal`, `text-white` stays (maps to foreground)
3. Body: `text-slate-400` → `text-text-secondary`
4. Cards: `glass-card rounded-2xl` → `card-warm rounded-2xl`
5. Card hover: remove `hover:border-red-500/30` (card-warm handles hover)
6. Icon container: `bg-gradient-to-br from-red-500/20 to-orange-500/10` → `bg-gold-muted`
7. Icons: `text-red-400` → `text-gold`
8. Card titles: `text-white` stays
9. Card body: `text-slate-400` → `text-text-secondary`
10. Stat border: `border-white/5` → `border-warm-border`
11. Stat text: `text-amber-400/80` → `text-gold-dark`

**Step 2: Verify Problem section**

Expected: Gold section label, warm cards with gold icons, no red/orange colors.

**Step 3: Commit**

```
feat: restyle Problem section to gold palette
```

---

### Task 7: Solution section

**Files:**
- Modify: `app/src/sections/Solution.tsx`

**Step 1: Replace the colorMap**

Replace the entire `colorMap` object with a single gold-based system:
```tsx
const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  cyan: {
    bg: 'bg-gold-muted',
    text: 'text-gold',
    border: 'border-gold-dark/20',
  },
  violet: {
    bg: 'bg-gold-muted',
    text: 'text-gold-light',
    border: 'border-gold-dark/20',
  },
  emerald: {
    bg: 'bg-gold-muted',
    text: 'text-gold',
    border: 'border-gold-dark/20',
  },
  blue: {
    bg: 'bg-gold-muted',
    text: 'text-gold-dark',
    border: 'border-gold-dark/20',
  },
  amber: {
    bg: 'bg-gold-muted',
    text: 'text-gold-light',
    border: 'border-gold-dark/20',
  },
};
```

**Step 2: Replace all section-level color classes**

1. Opening badge: `bg-cyan-500/10 text-cyan-400 border border-cyan-500/20` → `bg-gold-muted text-gold border border-gold-dark/20`
2. h2s: add `font-serif font-normal`
3. h3s: keep `font-semibold text-white` (but can add `font-serif` for sub-headings)
4. Body text: `text-slate-400` → `text-text-secondary`
5. All cards: `glass-card` → `card-warm`
6. Framework badge: `bg-violet-500/10 text-violet-400 border border-violet-500/20` → `bg-gold-muted text-gold border border-gold-dark/20`
7. FrontierOps badge: `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20` → `bg-gold-muted text-gold border border-gold-dark/20`

**Step 3: Verify Solution section**

Expected: All cards use warm gold tones. Three journey phases, framework pillars, FrontierOps concepts — all cohesive gold.

**Step 4: Commit**

```
feat: restyle Solution section — unified gold colorMap
```

---

### Task 8: UseCases section

**Files:**
- Modify: `app/src/sections/UseCases.tsx`

**Step 1: Replace the colorMap**

Replace with gold-only system (same pattern as Solution):
```tsx
const colorMap: Record<string, { border: string; text: string; bg: string }> = {
  cyan: { border: 'border-gold/20', text: 'text-gold', bg: 'bg-gold-muted' },
  violet: { border: 'border-gold/20', text: 'text-gold-light', bg: 'bg-gold-muted' },
  emerald: { border: 'border-gold/20', text: 'text-gold', bg: 'bg-gold-muted' },
  blue: { border: 'border-gold/20', text: 'text-gold-dark', bg: 'bg-gold-muted' },
  amber: { border: 'border-gold/20', text: 'text-gold-light', bg: 'bg-gold-muted' },
  rose: { border: 'border-gold/20', text: 'text-gold', bg: 'bg-gold-muted' },
};
```

**Step 2: Replace section-level colors**

1. Label: `text-emerald-400` → `text-gold`
2. h2: add `font-serif font-normal`
3. Body: `text-slate-400` → `text-text-secondary`
4. Cards: `glass-card` → `card-warm`
5. Metric label: `text-slate-500` → `text-text-muted`
6. Card body: `text-slate-400` → `text-text-secondary`
7. Card border on metric section: `border-white/5` → `border-warm-border`

**Step 3: Commit**

```
feat: restyle UseCases section to gold palette
```

---

### Task 9: Blog section

**Files:**
- Modify: `app/src/sections/Blog.tsx`

**Step 1: Replace the colorMap**

```tsx
const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  cyan: { bg: 'bg-gold-muted', text: 'text-gold', border: 'border-gold/20', dot: 'bg-gold' },
  violet: { bg: 'bg-gold-muted', text: 'text-gold-light', border: 'border-gold/20', dot: 'bg-gold-light' },
  emerald: { bg: 'bg-gold-muted', text: 'text-gold', border: 'border-gold/20', dot: 'bg-gold' },
  amber: { bg: 'bg-gold-muted', text: 'text-gold-dark', border: 'border-gold/20', dot: 'bg-gold-dark' },
};
```

**Step 2: Replace section-level colors**

1. Label: `text-cyan-400` → `text-gold`
2. h2: add `font-serif font-normal`
3. Body: `text-slate-400` → `text-text-secondary`
4. Cards: `glass-card` → `card-warm`
5. Expanded content: `border-white/5` → `border-warm-border`
6. Source note: `text-slate-600` → `text-text-muted`
7. Bottom CTA: `text-cyan-400 hover:text-cyan-300` → `text-gold hover:text-gold-light`
8. Card body: `text-slate-400` → `text-text-secondary`
9. Expanded "Visão AIPF" label and insight: `text-slate-300` → `text-text-primary`

**Step 3: Commit**

```
feat: restyle Blog/Insights section to gold palette
```

---

### Task 10: CTA section

**Files:**
- Modify: `app/src/sections/CTA.tsx`

**Step 1: Apply all replacements**

1. Background gradient: `via-cyan-500/5` → `via-[rgba(200,164,94,0.03)]`
2. Card container: `glass rounded-2xl` → `card-warm rounded-2xl`
3. Icon circle: `bg-gradient-to-br from-cyan-500/20 to-violet-500/20` → `bg-gold-muted`
4. Icon: `text-cyan-400` → `text-gold`
5. Label: `text-cyan-400` → `text-gold`
6. h2: add `font-serif font-normal`
7. Body: `text-slate-400` → `text-text-secondary`
8. Button: `bg-cyan-500 hover:bg-cyan-400 text-slate-900 ... glow-cyan` → `bg-gold hover:bg-gold-light text-warm-black font-semibold px-8 py-6 text-base glow-gold transition-all duration-300`
9. Helper text: `text-slate-500` → `text-text-muted`

**Step 2: Commit**

```
feat: restyle CTA section to gold palette
```

---

### Task 11: FAQ section

**Files:**
- Modify: `app/src/sections/FAQ.tsx`

**Step 1: Apply all replacements**

1. Label: `text-violet-400` → `text-gold`
2. h2: add `font-serif font-normal`
3. Accordion items: `glass-card` → `card-warm`
4. Open state border: `data-[state=open]:border-cyan-500/30` → `data-[state=open]:border-gold/30`
5. Trigger text: `text-white hover:text-cyan-400` → `text-text-primary hover:text-gold`
6. Answer text: `text-slate-400` → `text-text-secondary`

**Step 2: Commit**

```
feat: restyle FAQ section to gold palette
```

---

### Task 12: About section + remove LinkedIn

**Files:**
- Modify: `app/src/sections/About.tsx`

**Step 1: Apply color replacements**

1. Container: `glass rounded-3xl` → `card-warm rounded-3xl`
2. Label: `text-cyan-400` → `text-gold`
3. Avatar outer: `from-cyan-500/30 via-violet-500/30 to-blue-500/30` → `from-gold/30 via-gold-dark/30 to-gold-light/30`
4. Avatar inner: `bg-slate-800` → `bg-warm-surface`
5. Initials: `text-gradient` → `text-gold`
6. Subtitle: `text-slate-500` → `text-text-muted`
7. Body: `text-slate-400` → `text-text-secondary`
8. Service cards: `bg-slate-800/50` → `bg-warm-surface-raised`
9. Service icons: `text-cyan-400` / `text-violet-400` → both `text-gold`
10. Service labels: `text-xs text-slate-500` → `text-xs text-text-muted`
11. Link buttons: `bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white` → `bg-warm-surface-raised text-text-secondary hover:bg-warm-surface-hover hover:text-text-primary`
12. "Agendar" link: `bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30` → `bg-gold-muted text-gold hover:bg-gold/20`

**Step 2: Remove LinkedIn link**

Delete the entire `<a>` element for LinkedIn (the one with `href="https://linkedin.com/company/aipf"`). Remove the `Linkedin` import from lucide-react.

**Step 3: Commit**

```
feat: restyle About section, remove LinkedIn link
```

---

### Task 13: Footer + remove LinkedIn

**Files:**
- Modify: `app/src/sections/Footer.tsx`

**Step 1: Apply color replacements**

1. Outer border: `border-white/5` → `border-warm-border`
2. Brand text: `text-white font-bold` → `text-text-primary font-serif font-normal tracking-wider`
3. All link colors: `text-slate-400 hover:text-cyan-400` / `hover:text-violet-400` / `hover:text-white` → `text-text-secondary hover:text-gold`
4. Inner border: `border-white/5` → `border-warm-border`
5. Copyright: `text-slate-500` → `text-text-muted`
6. Copyright text: Update to "AIPF — Integração e Performance"

**Step 2: Remove LinkedIn link**

Delete the `<a>` element with `href="https://linkedin.com/company/aipf"`.

**Step 3: Commit**

```
feat: restyle Footer, remove LinkedIn, update brand name
```

---

### Task 14: ChatBubble — accent colors

**Files:**
- Modify: `app/src/components/chat/ChatBubble.tsx` (and any related chat components)

**Step 1: Replace all cyan/violet references**

Search for all instances of `cyan` and `violet` in the chat components and replace:
- `bg-cyan-500` → `bg-gold`
- `text-cyan-400` → `text-gold`
- `hover:bg-cyan-400` → `hover:bg-gold-light`
- `border-cyan-500` → `border-gold`
- Any `violet` references → gold equivalents
- `glow-cyan` → `glow-gold`
- `text-slate-*` → appropriate text-secondary/text-muted

**Step 2: Commit**

```
feat: restyle ChatBubble to gold palette
```

---

### Task 15: Button component — focus ring

**Files:**
- Modify: `app/src/components/ui/button.tsx`

**Step 1: Update focus ring color**

Find the focus ring class (likely `ring-ring` which already maps to CSS var). If there are any hardcoded cyan references, replace with gold. The CSS variable `--ring` was already updated in Task 1, so this may only need verification.

If there are explicit color overrides in button variants:
- `bg-cyan-*` → `bg-gold`
- `text-cyan-*` → `text-gold`

**Step 2: Commit**

```
feat: verify/update button focus ring to gold
```

---

### Task 16: Final verification and cleanup

**Files:**
- All modified files

**Step 1: Full grep for remaining old color references**

Run: `grep -rn "cyan\|violet\|slate-[3-9]00\|glow-cyan\|glow-violet\|glass-card\|glass " app/src/ --include="*.tsx" --include="*.css"`

Fix any remaining references found.

**Step 2: Run dev server and visual review**

Run: `cd app && npm run dev`

Check each section visually:
- Hero: Gold CTA, serif headline, warm background
- Problem: Gold icons and labels
- Solution: Unified gold cards
- UseCases: Gold metric pills
- Blog: Gold tags and links
- CTA: Gold button
- FAQ: Gold accordion highlights
- About: Gold avatar, no LinkedIn
- Footer: Gold hover links, no LinkedIn
- Navigation: Gold active dots
- Aurora background: Warm golden tones
- ChatBubble: Gold accent

**Step 3: Run build to ensure no errors**

Run: `cd app && npm run build`
Expected: Build succeeds with no errors.

**Step 4: Final commit**

```
feat: cleanup remaining old color references
```

**Step 5: Summary commit (optional squash)**

If desired, create a summary commit or tag:
```
chore: complete Black & Gold Editorial visual redesign
```
