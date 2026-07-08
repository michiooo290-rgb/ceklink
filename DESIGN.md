---
name: Urlveil
description: Indonesian link security checker — dark cosmic indigo with signal amber accents
colors:
  cosmic-indigo: "oklch(14% 0.042 278)"
  cosmic-indigo-raised: "oklch(17.5% 0.05 278)"
  cosmic-indigo-card: "oklch(21% 0.055 279)"
  cosmic-indigo-strong: "oklch(26% 0.06 280)"
  signal-amber: "oklch(75% 0.17 75)"
  signal-amber-dim: "oklch(65% 0.14 75)"
  teal-safe: "oklch(62% 0.14 185)"
  teal-safe-dim: "oklch(52% 0.12 185)"
  coral-danger: "oklch(58% 0.22 25)"
  coral-danger-dim: "oklch(48% 0.18 25)"
  text-primary: "oklch(92% 0.006 285)"
  text-secondary: "oklch(76% 0.012 285)"
  text-muted: "oklch(67% 0.014 285)"
  text-dim: "oklch(56% 0.016 285)"
  border: "oklch(28% 0.05 280)"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.7
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.signal-amber}"
    textColor: "{colors.cosmic-indigo}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.signal-amber}"
    textColor: "{colors.cosmic-indigo}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  input:
    backgroundColor: "oklch(14% 0.008 250 / 80%)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "11px 16px"
  card-glass:
    backgroundColor: "oklch(16% 0.008 250 / 70%)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "24px"
  badge-safe:
    backgroundColor: "oklch(62% 0.14 185 / 10%)"
    textColor: "{colors.teal-safe}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  badge-danger:
    backgroundColor: "oklch(58% 0.22 25 / 10%)"
    textColor: "{colors.coral-danger}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: Urlveil

## 1. Overview

**Creative North Star: "The Calibrated Instrument"**

Urlveil's design system is built around the metaphor of a precision instrument — a well-calibrated device that delivers clear, trustworthy readings. Every element serves a function; nothing is decorative noise. The interface communicates technical credibility through clean geometry, purposeful motion, and a restrained but distinctive color palette.

The system rejects the cold corporate aesthetic of enterprise security tools (Norton, Kaspersky) and the templated warmth of generic SaaS landing pages. Instead, it occupies a distinct space: technically precise but approachable, dark but not cold, serious but not intimidating. The cosmic indigo base evokes the vastness of the digital landscape, while signal amber provides the clarity of a status light — always purposeful, never decorative.

**Key Characteristics:**
- **Functional precision.** Every visual choice maps to a purpose — color indicates status, spacing creates hierarchy, motion confirms action.
- **Warm darkness.** The deep blue-violet base is dark without being oppressive; amber accents add warmth without sacrificing seriousness.
- **Economy of means.** Three font weights, four surface levels, three semantic colors. Constraint breeds clarity.
- **Status-driven color.** Amber = action/attention, teal = safe/positive, coral = danger/alert. Never decorative.

## 2. Colors: The Cosmic Palette

The palette is a Full strategy: three named color roles (amber, teal, coral) plus a neutral surface ramp, each used deliberately. The cosmic indigo base is the brand's own — not a default dark theme, but a specific blue-violet that reads as "digital night sky."

### Primary
- **Signal Amber** (`oklch(75% 0.17 75)` / ~#F5A400): The action color. Used for primary CTAs, active states, accent highlights, and scan-in-progress indicators. Its warmth cuts through the dark base without feeling harsh. Reserved for interactive and attention-demanding elements — never for passive decoration.

### Secondary
- **Teal Safe** (`oklch(62% 0.14 185)` / ~#06C582): The positive/safe indicator. Used for "safe" verdicts, success states, live data indicators, and positive feedback. Its coolness balances the warm amber and signals "all clear" without ambiguity.

### Tertiary
- **Coral Danger** (`oklch(58% 0.22 25)` / ~#E55C30): The danger/alert indicator. Used for "danger" verdicts, error states, critical warnings, and destructive actions. High saturation ensures it's immediately recognizable as a warning signal.

### Neutral
- **Cosmic Indigo** (`oklch(14% 0.042 278)` / ~#16112B): The base surface. Deep blue-violet, not pure black — the chroma gives it life and brand identity.
- **Cosmic Indigo Raised** (`oklch(17.5% 0.05 278)`): Elevated surfaces — cards, modals, dropdowns.
- **Cosmic Indigo Card** (`oklch(21% 0.055 279)`): Interactive surfaces — hover states, active cards.
- **Cosmic Indigo Strong** (`oklch(26% 0.06 280)`): Highest surface level — pressed states, strong emphasis.
- **Text Primary** (`oklch(92% 0.006 285)`): Body text, headings. Tinted slightly toward the base hue for cohesion.
- **Text Secondary** (`oklch(76% 0.012 285)`): Subheadings, descriptions, secondary information.
- **Text Muted** (`oklch(67% 0.014 285)`): Captions, timestamps, supplementary text.
- **Text Dim** (`oklch(56% 0.016 285)`): Placeholder text, disabled labels, lowest-emphasis text.
- **Border** (`oklch(28% 0.05 280)`): Subtle dividers and outlines. Tinted toward the base hue.

### Named Rules

**The Status Trinity Rule.** Color communicates status, never decoration. Amber = attention/action, Teal = safe/positive, Coral = danger/alert. If a colored element doesn't map to one of these three statuses, it shouldn't be colored.

**The Tinted Neutral Rule.** All neutrals carry 0.04–0.06 chroma toward hue 278–280 (the base blue-violet). No pure grays. This is what makes the dark theme feel like "Urlveil" rather than "generic dark mode."

## 3. Typography

**Display Font:** Outfit (with system-ui fallback)
**Body Font:** IBM Plex Sans (with system-ui fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace fallback)

**Character:** Outfit's geometric forms provide clean, confident headings that read as technically precise. IBM Plex Sans adds warmth and excellent readability at body sizes. JetBrains Mono signals code/data contexts without feeling clinical. The pairing creates hierarchy through contrast: geometric display vs. humanist body.

### Hierarchy
- **Display** (700, `clamp(2.6rem, 5vw + 0.5rem, 4.25rem)`, line-height 1.1): Hero headlines. Large but contained — the ceiling is 4.25rem, not 6rem. Used sparingly, one per viewport.
- **Headline** (700, `clamp(1.75rem, 3vw + 0.5rem, 2.5rem)`, line-height 1.15): Section headings. Clear hierarchy below the hero.
- **Title** (600, 0.95–1.25rem, line-height 1.3): Card titles, feature names, subheadings.
- **Body** (400, 1rem, line-height 1.7): Paragraph text. Max line length: 65–75ch. The high line-height compensates for light-on-dark readability.
- **Label** (400–600, 0.64–0.8rem, letter-spacing 0.06–0.12em, uppercase): Mono-spaced labels, tags, status indicators. Always short — never for sentences.

### Named Rules

**The Line-Length Rule.** Body text never exceeds 75ch. On wide viewports, content is constrained by `max-width`, not by font size. Readability beats full-width elegance.

**The Mono Restraint Rule.** JetBrains Mono is reserved for data, code, labels, and status indicators. Never for body copy, headings, or navigation. Mono signals "this is technical data" — overuse dilutes that signal.

## 4. Elevation

The system uses tonal layering rather than drop shadows. Depth is conveyed through the four-level surface ramp (base → raised → card → strong), not through shadow depth. This keeps the dark theme clean and avoids the muddiness that shadows create on dark backgrounds.

### Shadow Vocabulary
- **Glow Ambient** (`box-shadow: 0 0 30px oklch(75% 0.17 75 / 25%)`): Used on primary CTAs at hover. The amber glow signals "this is interactive" and draws the eye.
- **Glow Status** (`box-shadow: 0 0 30px oklch(62% 0.14 185 / 20%)` or `oklch(58% 0.22 25 / 20%)`): Status-colored glows on verdict cards and badges. Reinforces the Status Trinity.
- **Inset Highlight** (`box-shadow: inset 0 1px 1px oklch(100% 0 0 / 6%)`): Subtle top-edge highlight on glass cards. Creates a "lit from above" feel without ambient shadow.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows and glows appear only as responses to state (hover, focus, active) or to communicate status. A glowing card is saying something; a static shadow is saying nothing.

**The No-Drop-Shadow Rule.** No ambient drop shadows on cards or containers. The dark theme doesn't need them — tonal layering provides depth. Drop shadows on dark backgrounds read as muddy, not elevated.

## 5. Components

### Buttons
- **Shape:** Gently rounded (12px radius). Not pill-shaped — buttons are rectangular with softened corners, not capsules.
- **Primary:** Signal Amber background, Cosmic Indigo text, 12px 24px padding. The amber-to-indigo contrast is the highest in the system — reserved for the most important action on any screen.
- **Hover:** Amber glow (0 0 24px accent-glow), subtle Y-translate (-1px). The glow draws attention; the translate provides tactile feedback.
- **Ghost:** Transparent background, Text Secondary color. Used for secondary actions. Hover shifts to Text Primary.

### Inputs / Fields
- **Style:** Dark semi-transparent background (`oklch(14% 0.008 250 / 80%)`), 1px border (Border color), 12px radius.
- **Focus:** Border shifts to Signal Amber. No glow, no background change — just the border color transition. Clean and fast.
- **Placeholder:** Text Dim color. Must maintain 4.5:1 contrast against the input background.

### Cards / Containers
- **Glass Card:** Semi-transparent background (`oklch(16% 0.008 250 / 70%)`), backdrop-filter blur (12px), 16px radius, 1px border. The glass effect is purposeful — used for overlays and floating elements, not as default card treatment.
- **Data Card:** Solid Cosmic Indigo Raised background, 10px radius, 1px border. Used for data displays, feature descriptions, content blocks.
- **Status Glow:** Cards with verdicts (safe/warn/danger) get status-colored border and subtle inner glow. The glow communicates status before the user reads the text.

### Chips / Badges
- **Style:** Pill-shaped (full radius), small mono text (0.6rem), 1px border. Background is the status color at 10% opacity; text is the full status color.
- **Status variants:** Safe (Teal), Warn (Amber), Danger (Coral). Each uses the same opacity/background pattern for consistency.

### Navigation
- **Floating Header:** Glass effect, fixed to top, backdrop-filter blur. Compact — logo + primary links + CTA. The floating treatment keeps it present without dominating the viewport.
- **Active state:** Signal Amber text or underline indicator. The amber draws the eye to the current location.

### URL Demo Widget
- **Shape:** Rounded (16px radius), solid Cosmic Indigo Raised background, 1px border. A browser-chrome simulation — dots, URL bar, result area.
- **Scan animation:** Linear amber gradient sweeping left-to-right. Duration: 1.5s. The animation communicates "we're checking this right now."
- **Result state:** Verdict color fills the result area. Safe = Teal glow, Danger = Coral glow. The color arrives before the text — instant visual confirmation.

## 6. Do's and Don'ts

### Do:
- **Do** use the Status Trinity (Amber/Teal/Coral) for all semantic color. Every colored element must map to action, safety, or danger.
- **Do** maintain the tinted neutral ramp. All grays carry chroma toward hue 278–280. No pure `#808080` or `oklch(X% 0 0)`.
- **Do** keep body text at ≥4.5:1 contrast against its background. The Text Primary on Cosmic Indigo base achieves this; lighter text colors on lighter surfaces may not.
- **Do** use `text-wrap: balance` on h1–h3 for even line lengths.
- **Do** provide `@media (prefers-reduced-motion: reduce)` alternatives for all animations.
- **Do** use the glass effect sparingly — only for overlays, floating headers, and modal backdrops. Not for default cards.
- **Do** keep display headings at or below 4.25rem. The page should command attention, not shout.

### Don't:
- **Don't** use glassmorphism as default card treatment. The `.glass-card` class is for overlays and floating elements only. Regular content cards use solid surfaces.
- **Don't** pair `border: 1px solid X` with `box-shadow: 0 Npx Mpx ...` (M ≥ 16px) on the same element. Pick one: a solid border OR a defined shadow, never both as decoration.
- **Don't** use `border-radius: 32px+` on cards or sections. Cards top out at 16px; full-pill is reserved for chips and tags only.
- **Don't** repeat tiny uppercase tracked eyebrows above every section heading. One named kicker as a deliberate brand system is voice; an eyebrow on every section is AI grammar.
- **Don't** use gradient text (`background-clip: text` with gradient backgrounds). Emphasis via weight or size, not decorative text effects.
- **Don't** use side-stripe borders (`border-left` or `border-right` > 1px as colored accent). Use full borders, background tints, or leading icons instead.
- **Don't** animate CSS layout properties. Use transform and opacity for motion.
- **Don't** use the enterprise security aesthetic (Norton, Kaspersky) — cold, corporate, fear-based. Urlveil is a helpful tool, not a security product.
- **Don't** use the generic SaaS landing page aesthetic (cream backgrounds, gradient text, identical card grids, hero-metric templates). Urlveil is distinctly Indonesian and technically credible.
- **Don't** use numbered section markers (01 / 02 / 03) as default scaffolding. Numbers earn their place only when the section IS a sequence.
- **Don't** use `repeating-linear-gradient(...)` stripe backgrounds. Diagonal stripes are pure decoration.
