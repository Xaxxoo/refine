# Refine — Design Direction: **Lamplight**

*A moodboard and design direction for Refine (the PRD calls it InWords): AI matchmaking for intentional daters in Lagos. Companion files: `moodboard.html` / `moodboard.png`. Inspiration pins are in `../pins/` and are cited by filename.*

---

## 1. Concept: "Lamplight"

**One line:** *Say it plainly. Be understood.*

Refine is a conversation held at the end of a long day, by one warm lamp, with someone who listens carefully. The interface is a dark, quiet room. Your words are the brightest thing in it. Everything the AI does is shown as *careful reading*, with your own phrases underlined, and never as magic.

The concept answers the product's central tension (PRD App. B: *never a swipe app with a chatbot attached*). The only motion that feels like "play" is a person's own words becoming structure. The shortlist is an ordered letter, not a deck. A match is two lights meeting, not a prize.

**Brand feel words:** *Attentive · Unhurried · Candid · Warm-dark · Editorial · Discreet.*
**Anti-words:** playful, flirty, neon, gamified, clinical, "AI-sparkly".

**Voice in the UI:** plain sentences, first person for the user's words, second person for the product. "You wrote…", "We read this as…", "Tell us if we got it wrong." No exclamation marks. No emoji in system copy. Numbers are used sparingly. The product says "strong alignment", never "92%" (PRD §7.10, "prefer explanations over false precision").

### The one-ember rule
The palette is warm black and bone. **Ember** (a burnt orange-red) is the single accent and appears **once per screen** as the "live thing" (unread dot, the active chip being edited, the match line). Its red-orange temperature comes straight from the pill buttons and status dot in `profile_1.png`, tamed to a quiet glow.

### Lagos nod, without cliché
No flags, patterns-as-wallpaper, or danfo-yellow. The nods are in temperature and material:
- **Ember** is evening light over the lagoon and charcoal-grill warmth, rather than a "tropical" orange.
- **Harmattan** (dusty gold) is the haze season light. It marks "potential differences", so differences read as warm and honest, never as red warnings.
- **Adire** (deep indigo) is the colour of the hand-dyed cloth. It marks "mutual" and information, used as a small ink-like colour and never as pattern.
- **Hibiscus** (a zobo-red, `#C9475A`) is reserved for destructive and safety actions.
- Photography (§5) is the strongest local signal: Lagos people, in Lagos light, shot as editorial portraits.

### Alternate direction (brief): **"Paper Letter"**
Light-first. Warm paper (`#F5F0E6`), ink text, Fraunces (soft-serif, variable "WONK" off) headings, hairline rules everywhere, and photos shown as small, bordered, slightly rotated "prints" pinned to a column. The shortlist reads as a **printed dossier** with margin notes for "why you match". Motion is almost zero (page-turn crossfades only). It is more trustworthy and more obviously "marriage-minded", but it loses the intimacy of `profile_1.png` and photos look flatter. **Recommendation:** ship Lamplight dark-first, and use the same tokens in the light theme (§3) so Paper Letter exists as the Light theme rather than a second brand.

---

## 2. Pin → decision map

| Pin | What we take | What we reject |
|---|---|---|
| `profile_1.png` (strongest) | Full-bleed moody photo with a warm dark scrim; **huge light type** for the name; **1px hairlines** dividing name / age / bio; tiny meta line at right; the ember round buttons and status dot | Uppercase wide-grotesk name (we use a serif); the "+/−" buttons (a swipe-ish mechanic); the "Queer" label (orientation is sensitive data, see §9) |
| `style_1.png` | Full-bleed portrait cards, name + age baseline-aligned, tiny chip row beneath, **vertical dark-gradient scrim**, three screens side by side as a *system* | Green map screen; pill dock of 4 icon buttons (too gamey) |
| `brief_1.png` | Frosted **inset panel with a hairline** floating on a dark gradient; a tiny "pointer" notch tying panel to source (our "why" panel ↔ brief phrase link); dismiss ✕ at the panel's top right | Neon-green gradient glow; the ring-score meters (false precision) |
| `chat_2.png`, `chat_3.png` | Near-black canvas with a faint **top gradient wash**; dark low-contrast bubbles; "Online" dot under the name; search + filter field; Pinned / All label grouping; hairline-separated conversation rows | Hot-pink send button and badges (we use bone/ember); story avatar row (social-feed feel); voice/video call buttons; thumbs-up/down on bubbles; tilted stacked photo message |
| `brief_3.png` | Rounded composer with **ghost-text** inline suggestion; magic-wand "refine" affordance; the footer line *"AI can make mistakes. Check important info."* (ours: *"We can misread. Edit anything."*); small keyword tags inline in AI output | Sidebar chat history; purple wand |
| `brief_4.png` | Composer anatomy: thin **gradient outline** for focus, removable thumbnails with ✕ badges (→ removable chips), white circular send | Model/agent pills (→ "Brief 1 of 3" selector); the rainbow outline (we use a single ember-to-bone sweep) |
| `brief_5.jpg` | **Two-pane review**: raw text on one side, structured detail on the other; `Save` + `Save and Re-Run` (→ "Confirm" + "Read again"); dim past messages, bright active one with a hairline outline | Developer tooling chrome; mint background |
| `brief_6.png` *(light)* | Three-state composer spec (idle / attach / typing with ghost completion + stop) | Palette |
| `brief_7.jpg` *(light)* | **Segmented progress bar**; one-question-per-screen; pill answers ("Weekend / 3 Nights…") → clarification chips; "AI is planning…" indicator → our "Reading…" state | Light palette; the colourful icon bubbles |
| `brief_8.png` | **Chip anatomy**: outlined, small, icon + label, horizontally scrollable with an edge fade; underline on the active tab; small-caps section labels with count badges (`RECENT 3`); dashed hairline section dividers; ⌘-style key hints | Dense admin density |
| `match_1.png` | Restraint of the match screen: two photos offset and overlapping, one centered line of copy ("You and Julia have 36 hours…"), one CTA. We keep the **structure** (two photos, one sentence, one action) and swap the pastel for Lamplight | Heart badge, pastel gradients, "Chats" story row |
| `match_2.png`, `onboarding_1.png`, `profile_2.png`, `onboarding_2.png`, `discover_*` | Cautionary anti-references: neon "It's a Match" lettering, emoji replies, illustration-heavy onboarding, hearts and stars | All of it. These are what "gamified" looks like. |

---

## 3. Colour system

Tokens are named by role. All hex values below were checked for WCAG contrast (ratios shown for key pairs).

### 3.1 Dark — "Night Room" (default)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0B0A09` | App canvas (warm black, never pure `#000`) |
| `--surface-1` | `#12100E` | Cards, composer |
| `--surface-2` | `#1A1714` | Raised: sheets, bubbles (received) |
| `--surface-3` | `#24201C` | Hover/pressed, input fill, chips (resting fill) |
| `--line` | `rgba(244,238,228,.10)` | Hairline (default) |
| `--line-strong` | `rgba(244,238,228,.20)` | Hairline on focus / selected / on photos |
| `--text` | `#F4EEE4` ("Bone") | Primary text (17.1:1 on bg) |
| `--text-2` | `#B9B0A2` | Secondary (9.2:1) |
| `--text-3` | `#8A8276` | Tertiary/meta, labels (5.2:1; never below 12px) |
| `--ember` | `#E0673C` | The one accent (5.8:1 on bg) |
| `--ember-hi` | `#F09470` | Ember text on surfaces (7.8:1 on surface-2) |
| `--ember-wash` | `rgba(224,103,60,.12)` | Ember tint fills |
| `--harmattan` | `#D1A85F` | "Potential differences", caution (8.9:1) |
| `--adire` | `#8FA2DC` | Mutual / information (7.9:1) |
| `--sage` | `#8FB59A` | Verified / success (8.7:1) |
| `--hibiscus` | `#E0697B` | Destructive / safety (6.1:1; fill `#C9475A`) |

Gradient wash for headers and photos ("lamp"): `radial-gradient(120% 80% at 50% -10%, rgba(224,103,60,.14), transparent 60%)` over `--bg`. This is the faint warm glow at the top of `chat_2/3`, tinted ember instead of grey. Photo scrim: `linear-gradient(180deg, rgba(11,10,9,0) 38%, rgba(11,10,9,.55) 62%, rgba(11,10,9,.92) 100%)`.

### 3.2 Light — "Paper" (the Paper Letter alternate lives here)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#F5F0E6` | Canvas |
| `--surface-1` | `#FBF8F2` | Cards |
| `--surface-2` | `#EEE7DA` | Sheets, received bubbles |
| `--surface-3` | `#E4DCCC` | Inputs, chip fill |
| `--line` | `rgba(26,22,19,.12)` / strong `.24` | Hairlines |
| `--text` | `#1A1613` | 15.8:1 |
| `--text-2` | `#5E574D` | 6.3:1 |
| `--text-3` | `#6F675C` | 4.8:1 |
| `--ember` | `#B8481F` | 4.6:1 (text-safe) |
| `--harmattan` | `#7A5C1A` | 5.5:1 |
| `--adire` | `#34457A` | 8.1:1 |
| `--sage` | `#3F6E52` | 5.2:1 |
| `--hibiscus` | `#A3283B` | 6.3:1 |

### 3.3 Colour rules
1. **Priority is never encoded by colour alone.** Tiers differ by *fill and border style*, plus a glyph (§4.4). This satisfies WCAG 1.4.1 and keeps the screen monochrome.
2. Ember is used for **one** live element per viewport. Primary buttons are **bone on ink** (like the white send button in `brief_4.png`), never ember.
3. No gradients on controls. Gradients exist only as lamp wash, photo scrim, and the focus-sweep outline on the brief composer.
4. Differences are harmattan, not red. Red (hibiscus) means *you are about to do something irreversible or unsafe*.

---

## 4. Typography

All fonts are free on Google Fonts (SIL OFL).

| Role | Font | Notes |
|---|---|---|
| **Display / editorial** | **Instrument Serif** (Regular + *Italic*) | Names, headlines, the user's own words set back to them, the match sentence. Italic is used for *emphasis inside your own phrase* and for the AI's "reading" voice. Only two styles exist, so use size for hierarchy. |
| **UI / text** | **Geist** (300–600) | Everything functional. Light (300) for large labels, Regular for body, Medium for buttons/labels. Slightly wide, calm, modern. |
| **Micro-labels / data** | **Geist Mono** (400/500) | Eyebrows, timestamps, counters, "NON-NEGOTIABLE" labels. UPPERCASE, `letter-spacing: .08em`. Gives the hairline-and-caption feel of `brief_8.png`. |

Fallback stacks: `'Instrument Serif', 'Iowan Old Style', Georgia, serif` · `'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif` · `'Geist Mono', ui-monospace, monospace`.

> Why not the wide caps grotesk in `profile_1.png`? In dark UI it is striking at one name, but poorly legible at paragraph size and flat in character. We keep its *scale and confidence* and give it a serif voice. Nigerian names with diacritics or long Yoruba/Igbo names also render better in a serif at large sizes.

### Type scale (mobile; ×1.0 on web up to 1.25 for display)

| Style | Font / weight | Size / line | Tracking | Use |
|---|---|---|---|---|
| `display-xl` | Instrument Serif 400 | 64 / 60 | −0.02em | Welcome hero, dossier name |
| `display-l` | Instrument Serif 400 | 44 / 44 | −0.015em | Screen titles ("Who are you hoping to meet?") |
| `display-m` | Instrument Serif 400 | 32 / 36 | −0.01em | Section titles, match sentence |
| `quote` | Instrument Serif *italic* | 22 / 30 | 0 | User's own words, "why" evidence |
| `title` | Geist 500 | 18 / 26 | −0.005em | Card titles, list rows |
| `body` | Geist 400 | 16 / 24 | 0 | Default |
| `body-s` | Geist 400 | 14 / 21 | 0 | Secondary text, chat meta |
| `button` | Geist 500 | 15 / 20 | 0.005em | Buttons, chips |
| `caption` | Geist 400 | 12 / 16 | 0.01em | Helper, disclaimer |
| `label` | Geist Mono 500 | 11 / 16 | +0.08em, UPPERCASE | Eyebrows, tiers, counts |

Rules: max measure 62ch for reading text, 38ch for the brief canvas on large screens. Use tabular figures (`font-variant-numeric: tabular-nums`) for timestamps and counts. Never set body text in the serif below 20px. Minimum UI text size is 12px, and 11px is reserved for mono uppercase labels. Support Dynamic Type up to 200% (layout reflows, no truncation of chip text).

---

## 5. Imagery and photo treatment

**Principle:** photos are *people in a room*, not product shots. Full-bleed, portrait, quiet.

- **Source:** commissioned or licensed editorial portraiture of Lagos adults (a range of ages, skin tones, hair, faith expressions, and professions). No stock "couple laughing" photos. No AI-generated faces anywhere in product, and AI imagery never stands in for a real user. The pins' faces are placeholders for mood only.
- **Grade:** warm, low-contrast, slightly desaturated (~−10% saturation, shadows lifted toward warm brown `#1C140F`). CSS fallback on user photos: `filter: saturate(.9) contrast(1.02) sepia(.06)`. Preserve skin tones; never lighten skin or apply beauty filters. Test the grade on deep skin tones first.
- **Scrim:** the vertical photo scrim from §3.1 on every full-bleed photo so type is always ≥4.5:1 (`profile_1.png`, `style_1.png`).
- **Layout:** the primary photo is full-bleed at 3:4 or taller. Additional photos are a horizontal pager with 1px segmented progress (not dots). Hairlines divide name / age / one-line bio (`profile_1.png`).
- **Corners:** photos on cards 28px radius; in thumbnails 14px; avatars are *rounded squares* (radius 30%) rather than circles, to separate us from social apps (circles are reserved for the status dot and the circular icon buttons).
- **States:** *Pending moderation* → heavily blurred (`blur(28px)`) with the label "Being reviewed"; never a broken image. *No photo yet* → a monogram in Instrument Serif on `--surface-3`.
- **Ornament:** one allowed texture, a **film grain** at 4% opacity over dark photos and the hero background (SVG noise, static), to stop gradients banding on low-end Android.
- **Brand imagery:** abstract lamp glow (soft radial warm light on dark) and cropped typographic fragments of user words. Never hearts, couples, or illustrations.

## 6. Iconography

- **Set:** [Lucide](https://lucide.dev) (ISC licence), **1.5px stroke**, 20px default / 24px nav, `stroke-linecap: round`. Icons sit in `--text-2`. Active nav icon is `--text` with a 1px underline, never filled.
- Icons are used sparingly. Chips carry a small *tier glyph* (a 6px mark), and text does the work. Prefer words to icons for actions ("Pass", "Express interest").
- Custom marks (drawn in the same 1.5px stroke): the **lamp dot** (Refine's mark: a small ember circle with a thin concentric hairline ring), the **tier glyphs** (solid bar, half bar, dashed bar), and the **evidence tick** (a hand-drawn-feel check, 18px path, used in "why you match").
- **No** hearts, flames, stars, or sparkles. The "AI" affordance is the lamp dot breathing, not a wand (a deliberate deviation from the wand in `brief_3.png`/`brief_4.png`).

---

## 7. Layout, spacing, radius, elevation, glass

**Spacing (4pt base):** `4 · 8 · 12 · 16 · 24 · 32 · 48 · 72`. Screen gutters 20px (mobile), 32px (tablet), content column max 520px on mobile web, 1120px for desktop with a 12-column grid. Vertical rhythm: sections 48, groups 24, siblings 12.

**Radius:** `chip 999 · input/composer 20 · card 28 · sheet 32 (top) · photo thumb 14 · button 999 · tooltip 10`. Hairline 1px always. Never mix more than three radii per screen.

**Elevation (dark mode = lightness, not shadow):**
| Level | Surface | Shadow | Use |
|---|---|---|---|
| 0 | `--bg` | none | Canvas |
| 1 | `--surface-1` | `inset 0 0 0 1px var(--line)` | Cards |
| 2 | `--surface-2` | `0 8px 24px rgba(0,0,0,.35)` + hairline | Sheets, popovers |
| 3 | `--surface-3` | `0 16px 48px rgba(0,0,0,.5)` + `--line-strong` | Drag-lifted chip, toasts |

Light mode uses the same levels with `rgba(60,40,20,.08–.18)` shadows.

**Glass (strictly limited):** glass appears only on **overlays over photos** (the info panel in `brief_1.png`, nav pill over a photo, the "why" strip on the dossier). Recipe: `background: rgba(11,10,9,.42); backdrop-filter: blur(24px) saturate(1.15); border: 1px solid rgba(244,238,228,.14)`. Rules: max **one** glass layer in view; never glass on glass; never glass over plain surfaces (use `--surface-2`); provide `@supports not (backdrop-filter)` fallback of `rgba(18,16,14,.88)`. Blur is the most expensive effect on low-end Android, so it is disabled when `prefers-reduced-transparency` or "data saver" is on.

---

## 8. Motion language

**Character:** *settled, not bouncy.* Springs with low bounce (≤0.12), long calm tails, and opacity+translate rather than scale pops. Motion explains *where things came from*. Nothing moves without a cause.

### 8.1 Tokens (Motion / framer-motion)

```ts
// motion.ts
export const spring = {
  settle: { type: "spring", stiffness: 260, damping: 30, mass: 1 },       // default UI, ≈ 420ms, no overshoot
  soft:   { type: "spring", stiffness: 170, damping: 26, mass: 1 },       // large surfaces: sheets, photo expand, ≈ 600ms
  snap:   { type: "spring", stiffness: 420, damping: 34, mass: 0.9 },     // chips, toggles, tiny things, ≈ 250ms
  drag:   { type: "spring", stiffness: 300, damping: 28, mass: 1 },       // release / return after drag
  bloom:  { type: "spring", duration: 0.9, bounce: 0 },                   // the single match light
} as const;

export const ease = {
  out:   [0.22, 1, 0.36, 1],   // enter
  inOut: [0.65, 0, 0.35, 1],   // crossfade, hairline draw
  in:    [0.4, 0, 1, 1],       // exit
} as const;

export const dur = { instant: 0.12, quick: 0.2, base: 0.32, slow: 0.52, scene: 0.9 } as const;
export const stagger = { chips: 0.06, rows: 0.08, evidence: 0.45 } as const;
```

| Motion | Spec |
|---|---|
| Press (any button/chip) | `scale 0.97`, `spring.snap`; release back to 1 |
| Enter (default) | `opacity 0→1`, `y 12→0`, `spring.settle` |
| Exit | `opacity 1→0`, `y 0→-6`, `dur.quick`, `ease.in` (exits are faster than enters) |
| Page / step change | shared-axis X: out `x 0→-24` + fade 160 ms, in `x 24→0` + fade, `spring.settle`; progress hairline slides via `layoutId` |
| Sheet (Vaul) | `spring.soft`; overlay fade `dur.base`; drag-to-dismiss velocity threshold 500 px/s |
| Hairline draw | `scaleX 0→1` (origin left), `dur.slow`, `ease.inOut` |
| Blur-in text | `filter blur(6px)→0`, `opacity 0→1`, `y 8→0`, `dur.slow` per line, stagger 80 ms |
| Skeleton/“Reading” | 1 ember dot breathing: `scale 1↔1.25`, `opacity .6↔1`, 2.4 s, `ease.inOut`, infinite. Never a spinner |
| Toast (Sonner) | y 16→0 + fade, 4 s hold, swipe to dismiss |

Performance rules: animate only `transform`, `opacity`, and (sparingly) `filter` on small elements; `layout` animations only on lists < 30 items; promote with `will-change` only during an animation; cap simultaneous animated elements to ~12; target 60 fps on a mid-range Android (Tecno/Infinix class).

### 8.2 The five signature moments

#### ① "Words become a profile" (Describe screen + Welcome hero)
*The product's thesis made visible.* The user's own text stays put and chips *grow out of* their phrases.
Choreography (user pauses typing for 700 ms → read begins):
1. **t=0** The composer's outline sweeps once (ember→bone conic gradient, 1.2 s, `ease.inOut`); the lamp dot starts breathing in the footer ("Reading…").
2. **t=250 ms** For each extracted phrase, a 1px underline **draws** under the source words in the user's text (`scaleX 0→1`, 360 ms, `ease.inOut`, stagger 90 ms). Underline colour matches the tier style, not hue.
3. **t=450 ms →** Chips appear *in the margin/under the composer* in reading order. Each chip: `opacity 0→1`, `y 14→0`, `scale .96→1`, `spring.snap`, stagger 60 ms (max 8 animated; the rest fade in as a group at t+500).
4. Each chip is **linked**: hover/tap a chip → its source phrase's underline brightens to `--text` and the others dim to 40% (200 ms). Tap a phrase → its chip pulses once (`boxShadow 0 0 0 3px ember-wash → 0`, 500 ms).
5. **Unreadable text** stays plain (no underline) with a tiny label "Not read — rephrase?" so nothing is silently dropped.
6. **Done** The dot stops breathing and settles into a static ember dot ("Read 7 things. Edit anything.").
- *Welcome variant* (auto-plays once, ≈ 5 s): the hero sentence types at 38 ms/char in Instrument Serif; "God-fearing", "Lagos", "wants marriage" get underlines and lift into chips that settle in a row beneath, in `spring.soft`. A second tap anywhere skips to the end state.
- *Reduced motion:* no typing, no sweep, no breathing. The text, underlines and chips all appear via a single 200 ms opacity fade; dot is static; linkage highlight remains (instant colour change).
- *Components:* Motion (`AnimatePresence`, `layout`), React Bits `SplitText` / Magic UI `BlurFade` for the welcome line only; conic outline via CSS `@property`.

#### ② "Move it up" (priority lanes)
Chips live in three lanes: **Non-negotiable / Strong / Nice-to-have**.
1. **Lift (on long-press 180 ms / drag start):** chip goes `scale 1.04`, elevation 3 (`shadow 0 16px 48px`), haptic *light impact*; other chips dim to 70% and the lane labels brighten (`--text-3→--text-2`, 150 ms).
2. **Over a lane:** lane hairline thickens to `--line-strong` and a **dashed drop slot** opens with `layout` height animation (`spring.settle`) where the chip would land; neighbours slide aside via `layout`.
3. **Drop:** chip springs into the slot (`spring.drag`), re-styles (fill/border/glyph crossfade 160 ms, never colour-only), haptic *medium impact*, a short 600 ms underline flash on its source phrase in the brief above.
4. **Promoting to Non-negotiable** adds one extra beat: a confirm microcopy slides under the chip, *"We'll only show people who match this."* with an Undo (Sonner), because it's a hard gate (PRD §7.6). Demoting needs none.
5. **Keyboard/AT path:** every chip has a "Priority" menu (Vaul sheet on mobile; Radix Popover on web) with the three options; arrow keys reorder; live-region announcement "Tall, moved to Strong".
- *Reduced motion:* no lift scale; drop is an instant re-style with a 160 ms fade, no layout travel (items simply reorder).
- *Components:* Motion `Reorder` or dnd-kit + Motion `layout`; Vaul; Sonner.

#### ③ "Evidence reveal" (why you match / potential differences)
Opens when a dossier's "Why you match" strip is tapped (Vaul sheet, `spring.soft`, 85% height, grabber).
1. **t=0** Sheet rises; the dossier photo behind scales `1→.96` and dims to 55% (`spring.soft`).
2. **t=120 ms** Title ("Why you match") blur-fades in; a hairline draws beneath (`dur.slow`).
3. **Each evidence line** (stagger **450 ms**, so it reads as someone reasoning): (a) an **evidence tick** *draws* via SVG `pathLength 0→1`, 320 ms `ease.out`; (b) the line fades up (`y 8→0`, `spring.settle`); (c) beneath it, the **source phrase** in italic serif — *"you wrote: 'someone who prays, but not performative'"* — fades in 150 ms later, `--text-3`.
4. Lines are tappable: tapping one scrolls the brief panel to its source and runs the chip↔phrase highlight from ①.
5. **"Potential differences"** arrives after a 600 ms pause, with a harmattan hairline and *no tick*: a small open circle glyph, lines fade in the same way but **faster** (stagger 250 ms) and not drawn. This is deliberate. Differences feel as factual as matches but never celebratory.
6. Footer: *"Based on what you both wrote. Not a score."* with a "Something wrong?" link.
- *Reduced motion:* sheet appears with a 200 ms fade, ticks render static, lines appear together; hairlines are static.
- *Components:* Vaul, Motion, Transitions.dev's list-reveal pattern as reference.

#### ④ "Your shortlist, in order" (arrival + dossier open)
This replaces the swipe stack. A ranked, *finite* list ("5 people this week") that opens into a full-bleed dossier.
1. **Arrival** (first view after the search completes): rows enter top-to-bottom, `y 24→0`, `opacity 0→1`, `spring.settle`, **stagger 80 ms** (max 5); each rank number ("01") ticks up with Magic UI-style `NumberTicker` from 0 in 400 ms. The ember dot sits only on the first unseen item.
2. **Row → dossier (shared element):** tapping a row expands its photo via `layoutId` from a 28px-radius card into full-bleed (radius → 0 at the end), `spring.soft` (≈ 600 ms). Name type moves from `display-m` to `display-xl` (crossfade, no scale to avoid blurry text). The scrim fades in at t+200 ms and hairlines **draw** (left→right, stagger 120 ms): name / age / bio, copying `profile_1.png`.
3. **Photo pager:** swipe horizontally; segmented 1px progress at top. Parallax: photo moves at 1.0, scrim and text at 1.06 (very subtle, 6%).
4. **Pull-up to explanation:** drag the "Why you match" strip upward; its position tracks the finger with `drag="y"` and snaps at 40% / 85% with `spring.drag`.
5. **Actions:** two quiet text buttons, *Pass* and *Express interest* (bone filled), not icons-with-stamps. A pass **slides the dossier left −24px + fade** and loads the next, with a Sonner toast "Passed · Undo". No rotation, no stamps, no fling physics.
- *Reduced motion:* rows fade (no stagger), the dossier opens by crossfade, no parallax, pager snaps; rank numbers are static.
- *Components:* Motion `layoutId`; Transitions.dev for the route transition pattern; Magic UI `NumberTicker` (rank only).

#### ⑤ "Two lamps" (mutual match)
The only celebratory moment in the app. It must feel like *quiet recognition*, not a jackpot (`match_1.png` structure; `match_2.png` is the anti-reference).
1. **t=0** Screen dims to `--bg`. Two portrait photos (rounded squares, 112 px) enter from opposite edges at the vertical centre: `x ±160→±36`, `spring.soft`, opacity 0→1 over 400 ms.
2. **t=500 ms** A 1px ember hairline **draws** between them (`scaleX 0→1`, 500 ms, `ease.inOut`).
3. **t=700 ms** The photos meet: `x ±36→±8` with a 4px overlap, `spring.bloom`. A single **warm bloom** (radial ember at 18% opacity, `scale .6→1.6`, `opacity .18→0`, 900 ms) expands *behind them*, once. One haptic *soft notification*. No particles, no confetti.
4. **t=1000 ms** Headline types in Instrument Serif `display-m`: **"You both."** then the reason, in italic, blur-fading by line: *"want marriage, live in Lagos, and keep Sundays for church."* (generated from the shared non-negotiables and verified against real fields; see PRD §7.12).
5. **t=1700 ms** The CTA **morphs**: a "Say hello" button (bone) expands via `layout` to a composer field (`spring.settle`), the keyboard opens with a suggestion drawn from the shared reason, *editable and never auto-sent*.
6. Dismiss: swipe down, or Esc. Photos shrink back to the match's row.
- *Reduced motion:* photos appear in final position via 200 ms fade, hairline static, no bloom, no haptic, text appears together; the CTA swaps instantly.
- *Components:* Motion for the choreography; **Rive** state machine (`two_lamps.riv`, ≈ 20 KB) *only* for the bloom if the CSS radial proves janky on low-end devices; HorizonX shader not used here.

### 8.3 Smaller moves (reference)
- **Chat:** a received message enters from the left, `x −12→0`, `spring.settle`; sent from the right, optimistic with a hairline-grey tick → bone tick on ack (crossfade 160 ms). Typing indicator = three 4px dots in `--text-3` fading in sequence (1.2 s loop), no bounce. Date separators as a small mono label with hairlines (`chat_6` idea).
- **Notification badge:** number roll 220 ms, `ease.out`; no pulse.
- **Safety (block/report):** Vaul sheet only; no decorative motion; Sonner toast with Undo (8 s).
- **Pull-to-refresh:** none (the shortlist is not a feed).

### 8.4 Reduced motion (global policy)
Respect `prefers-reduced-motion: reduce` **and** an in-app "Reduce motion" toggle. Implementation: `<MotionConfig reducedMotion="user">` plus a project hook `useCalm()` returning `{ spring, stagger, distance }` variants. Under reduce: springs → `{ duration: .2, ease: "linear" }` fades, `y/x/scale` transforms removed, parallax and blur-in disabled, looping animations stopped (the breathing dot becomes static), haptics preserved only for drag-drop (non-visual feedback is fine), and **no information is conveyed solely by motion** (the underline/chip link also changes colour and is announced via `aria-live`). Test: every signature moment has a Storybook story with reduce on.

---

## 9. Screen-by-screen direction

Order follows the PRD journey (§6) and nav: **Home · Discover · My Briefs · Messages · Profile**. Nav is a 5-item bottom bar with text labels, 1px top hairline, and no filled icons. It is *not* a floating pill (differs from `chat_4`).

1. **Welcome.** Full-bleed dark with lamp wash and grain. Eyebrow mono "REFINE · LAGOS". Hero `display-xl`: *"Say who you are. Say who you're looking for."* Signature ① plays once. One bone button "Begin", one text link "I have an account". Footer caption: "For people looking for something real." *Component: HorizonX subtle shader (or static gradient fallback); React Bits SplitText.*
2. **Sign-up / age gate.** One question per screen, `brief_7`'s segmented progress bar (hairline segments, ember on the current one). Phone + OTP first (PRD §7.1 and the fraud review). DOB with a wheel. ToS shown as plain-language bullets above the consent checkbox (bone check, not ember). Verification screen states exactly what was verified (PRD §12.2). *Shared-axis step transitions.*
3. **Profile wizard.** Conversational: one prompt at a time in `display-m`, with answers as pills (`brief_7`, reskinned dark). Photos step: a 3-up grid of rounded squares with the one upload tile outlined dashed; moderation status as caption text. Time-to-first-value: after step 3, offer "See how this works" with a sample brief preview (PRD review §2).
4. **Describe (brief input) — the hero.** The canvas takes ~60% of the screen: `display-l` prompt "Who are you hoping to meet?" over a composer (`brief_3/4`) with ghost-text examples that cycle ("someone who is ambitious but gentle…"), in Nigerian English and light Pidgin. Counter in mono (`0 / 5000`). Below: the **Reading** strip, then chips (signature ①). Footer: *"We can misread. Edit anything."* Switcher: "Brief 1 of 3" (replaces the model pill of `brief_4`). Same layout is reused for "Describe yourself". Wide screens: two columns (text left, interpretation right, `brief_5`).
5. **Review & prioritise.** Three lanes (signature ②), headers in mono with count badges (`brief_8`). Each chip shows original wording on tap (a small quote), a confidence cue (full / hollow dot) and *a clarification chip* when low-confidence: "When you say tall, how tall?" with pill answers (`brief_7`) and a "Skip" option. "Not X" is spelled out ("Not a smoker"), never a minus. CTA row: `Confirm` (bone) + `Read again` (text), the pair of `brief_5`. A sticky counter: "Estimated 12 people fit this" appears only once ≥1 non-negotiable is set. A "too few?" state offers *a before/after diff for broadening*, only with explicit accept (never silently touches non-negotiables).
6. **Home / Shortlist (Discover).** Header: date in mono, "Your shortlist" in `display-l`, "5 people this week" as caption. Rows: 3:4 photo card left (rounded square 28), right: name `display-m`, one line of *shared words* in italic quote, tier glyphs showing which non-negotiables match, then a mono "STRONG ALIGNMENT" label (qualitative, no numbers). Optional list/grid toggle. Finite end state: "That's everyone for now. We'll tell you when someone new fits." Signature ④.
7. **Candidate dossier.** Full-bleed photo, hairline-split name / age / one-line, exactly the anatomy of `profile_1.png`. A glass strip near the bottom: "Why you match · 4 · Differences · 2" opens signature ③. Beneath the fold: "In their words" (their self-description in italic serif), "What you asked for" mapped to chips, verified badges stating what was verified. Overflow menu "⋯": Block / Report (calm Vaul sheet). **Orientation / preferred gender is never displayed as a label** (deviation from `profile_1`'s "Queer" tag). It is highly sensitive data under Nigerian law and is used only for eligibility.
8. **Match explanation (sheet).** Per signature ③. "Why you match" in bone with evidence ticks; "Potential differences" in harmattan with open circles, each with a gentle framing ("You said 'quiet weekends'; they describe themselves as 'always out'. Worth a conversation."). Unknown ≠ mismatch: "They haven't said" in `--text-3`, with a dashed marker.
9. **Mutual match.** Signature ⑤. Composer morph, never an auto-sent message.
10. **Messages.** *Inbox:* `chat_3` structure without stories: search + filter, "Pinned / All" mono labels, hairline rows, ember dot for unread (the one ember), double-tick states in `--text-3`. *Thread:* header with name + "Online" sage dot; **a persistent "why you matched" strip** under the header (collapsible, one line, differentiator from every chat pin); bubbles low-contrast, radius 20 with a 6px tail corner; per-bubble time on tap, date separators; composer from `brief_4` anatomy with white circular send. No voice/video buttons in MVP, no reactions. Scam guard: a one-time gentle inline notice when money or off-platform contact is mentioned.
11. **Notifications.** Plain list with mono timestamps and swipe-to-dismiss; copy is factual ("Adaeze replied" / "New person on your shortlist").
12. **Safety & settings.** Block/report/undo in a sheet; plain-language privacy toggles; Delete account describes exactly what is erased (PRD review §4).
13. **Empty / error states.** Always a sentence in the serif, a reason, and one action: "We couldn't read that right now. Your words are saved. Try again." The AI-down state keeps the draft; never an apologetic illustration.
14. **Admin (internal).** Out of the brand layer: BoardUI-style dashboard on the same tokens, no motion.

---

## 10. Component sourcing

| Source | Used for | Notes |
|---|---|---|
| **shadcn/ui** (Radix + Tailwind) | **Foundation** for forms, inputs, tabs, popover, dropdown, switch, slider, checkbox, dialog, tooltip. Re-themed with our tokens as CSS variables. | Owned code; we replace radii and focus rings with ours. |
| **Astryx** | *Reference + selective tokens* for form, button and sheet density, and its agent-ready theming (`data-astryx-theme`). Use **one** foundation: if it passes a one-week spike on our dark tokens (fonts, hairline focus, chip), it can replace shadcn for primitives. Otherwise shadcn wins. | Spike first. We do not run both. |
| **Motion** (framer-motion) | All springs, `layout`/`layoutId`, `Reorder`, drag, `AnimatePresence`, `MotionConfig`. | The motion engine for the five moments. |
| **Vaul** | Why-you-match sheet, block/report, priority menu, filters. | `spring.soft` via custom transition; snap points 40/85%. |
| **Sonner** | Undo toasts (pass, block, promote to non-negotiable), send errors. | Styled: `--surface-3`, hairline, no icons. |
| **Transitions.dev** | Reference/copy for step-to-step onboarding, sheet enter/exit, route transitions, list add/remove. Matches signature ④'s shared-element opening. | Copy-paste, retuned to our spring tokens. |
| **Bencho** | Micro-interactions: button press, chip add/remove, input focus sweep, send button, unread counter. | Take mechanics and strip any playful bounce. |
| **Magic UI** | `BlurFade` (welcome and screen titles), `NumberTicker` (rank, badge), `AnimatedList` for the chat list. | Sparingly. No sparkles, particles, or borders-beam. |
| **React Bits** | `SplitText` / blur text for the Welcome hero and the "Reading…" phrases. | Only text effects. Skip aurora/cursor effects. |
| **HorizonX** | **Welcome-only** subtle shader (slow warm lamp glow), PWA splash, app-store mockups and marketing. | Never behind dense UI. Static gradient fallback + `prefers-reduced-motion`. |
| **Rive** | Two-lamps bloom (⑤) if CSS can't hold 60 fps, plus the small "Reading" lamp-dot state machine (idle / reading / done). | ≤ 30 KB each; fall back to CSS. |
| **BoardUI** | Admin dashboard only. | Same tokens, no brand motion. |
| Lottie / Aceternity / Animata | **Not used.** Their default aesthetic (confetti, spotlight, 3D cards) is the gamified look we're avoiding. | |

Stack: Next.js 15 + Tailwind + shadcn → Motion → Vaul + Sonner → Lucide → Geist / Instrument Serif via `next/font`.

---

## 11. Accessibility and resilience (design requirements)

- WCAG 2.2 AA minimum. Every text token pair above is ≥ 4.5:1. Focus ring: 2px `--text` offset 2px (never ember).
- Targets ≥ 44×44 pt. Chips ≥ 36 pt tall with 44 pt hit area.
- Everything draggable has a non-drag path (priority menu, buttons). Everything animated has a reduced-motion path (§8.4).
- Screen readers: chips are buttons with *"Tall, Strong priority, from 'someone tall'. Press to edit."*; evidence lines are a list; differences are announced as "Potential difference".
- Low-end and low-data: no video, WebP/AVIF photos at ≤ 120 KB for cards, skeletons are static outlines, glass and grain are optional. The Brief screen works offline-first (draft saved locally).
- Copy: understand Nigerian English and Pidgin; labels say "Non-negotiable", "Strong", "Nice to have" in plain English.

---

## 12. Do's and don'ts

**Do**
- Let the user's words be the largest, brightest element on the Describe screen.
- Show AI work as *reading with receipts*: underlines, source quotes, "we read this as".
- Use hairlines, whitespace and type scale for hierarchy instead of boxes and colour.
- Keep one ember per screen. Keep one wow moment per flow.
- Say "strong alignment", "worth a conversation". Be candid about differences.
- Give every drag a button path and every animation a calm fallback.
- Keep lists finite and ranked, and let them end.

**Don't**
- No swipe stamps, card rotation, confetti, hearts, "It's a Match!" lettering, emoji reactions, streaks, XP, or boosts-as-gamification (`match_2`, `onboarding_1`, `profile_2` are the anti-references).
- No percentage scores or progress rings for compatibility (`brief_1`'s rings are *not* adopted).
- No neon gradients or pink/purple (`chat_2/5/6` palettes). No stories row.
- No sparkle/wand icons for AI. No chatbot avatar. No "Hey! 👋" system copy.
- Don't show orientation, religion, or tribe as labels on cards; don't let the AI infer sensitive attributes from photos or names (PRD §12.5).
- Don't silently change a non-negotiable or drop text the AI couldn't read.
- Don't put glass on glass, or shaders behind dense UI.
- Don't use AI-generated faces or skin-lightening grades.

---

## 13. Open design questions (to resolve with the team)
1. Launch audience (marriage-intent only, or broader?). It sets the tone of the Welcome line and the "Sundays" example copy.
2. Native (Expo) vs PWA: Vaul/Sonner are web libraries. If native, Reanimated + `@gorhom/bottom-sheet` replicate the same spring tokens (stiffness/damping carry over 1:1).
3. Whether to show *any* numeric signal. Current stance: **no**. If product insists, use a 3-step qualitative scale ("Strong / Good / Possible"), never a percentage.
4. Photography commissioning and the Lagos grade LUT (build with 6+ skin tones on day one).
