# Refine: Product, UI & Motion Analysis

*Sources: `apps/PRD.md` (read in full), `apps/api` controllers/entities/gateway, `apps/web`. No files in the repo were modified.*

## 1. What the app is

Refine (the PRD calls it **"InWords"**) is an AI-powered matchmaking app for adults, launching in Lagos, Nigeria. It targets intentional daters: young professionals, marriage-minded users, and the diaspora. Users describe **who they are** and **who they want** in free text. AI turns that text into structured, editable preferences, sorted into non-negotiables, strong preferences and nice-to-haves. A deterministic engine then ranks mutually compatible candidates. The differentiator is **"Describe. Discover. Connect."**: AI-written partner briefs, evidence-based match explanations ("why you match / potential differences"), and no false-precision scores. The PRD says Refine must never become "a swipe-based app with an AI chatbot attached" (Appendix B).

## 2. What must be built (frontend) vs. what exists

**Web today:** the Next.js 15 / React 19 PWA is essentially empty. It has `page.tsx` ("Frontend is running."), a bare `layout.tsx`, a manifest and a service worker. It has no styling system, no state or data layer, no socket client, no auth and no icons (the manifest references missing PNGs).

| # | Screen / flow (PRD §10.2, §6) | Backend in `apps/api` | Web |
|---|---|---|---|
| 1 | Welcome / landing ("Find My Match") | n/a | stub |
| 2 | Sign up (age gate, ToS), login, verify email, forgot/reset password, logout, delete account | ✅ `auth/*` (email verify, reset, refresh), `DELETE users/me`. ⚠️ No phone/OTP, no ToS flag | ❌ |
| 3 | Profile setup wizard (name, DOB, gender, location, education, faith, intent, relocation, interests, bio) | ✅ `PATCH users/:id`, `PUT users/:id/interests`, expanded profile migration | ❌ |
| 4 | Photos: upload, reorder, delete, avatar | ✅ `upload/*` (reorder is supported) | ❌ |
| 5 | Preferences / privacy controls | ✅ `GET/PUT users/me/preferences`. ❓ Per-field visibility is unclear | ❌ |
| 6 | **Describe your ideal partner**, plus the AI preference review (attribute, original wording, category, priority, confidence), clarification Qs, prioritisation | ✅ `briefs` CRUD + `activate`. `structured_preferences` has attribute, normalized value, original wording, category, priority and confidence. ✅ `ai` + `embedding` modules. ⚠️ No obvious clarification-question endpoint | ❌ |
| 7 | Self-description with AI extraction and confirm | ⚠️ `ai.service` exists. Confirm flow unclear | ❌ |
| 8 | Discover / results: ranked candidates | ✅ `matching/discover`, `similar`, `nearby`, `users/discover` | ❌ |
| 9 | Candidate profile + **match explanation** (why / differences) | ✅ `matching/explanation/:candidateId` (score breakdown + two text arrays) | ❌ |
| 10 | Express interest / pass (with a message and a source) | ✅ `POST swipes` (like/pass), `GET swipes/matches`, unmatch | ❌ |
| 11 | **Mutual match** moment | ✅ via swipes + notifications | ❌ |
| 12 | Chat: conversations, history, send, realtime (typing/read/online) | ✅ REST `messages/*` + Socket.IO `/chat` (`sendMessage`, `markRead`, `newMessage`, `messageSent`, `messagesRead`, `userOnline/Offline`, `notification`). ⚠️ No typing event | ❌ |
| 13 | Notifications center, unread badge | ✅ `notifications/*` (list, unread-count, read, read-all). ⚠️ No web-push endpoint | ❌ (service worker only) |
| 14 | Safety: block, unblock, report | ✅ `blocks` (`POST/DELETE users/:id/block`, `POST users/:id/report`) | ❌ |
| 15 | Search refinement via chat / AI assistant (§7.13, Screen 10) | ❌ Nothing visible | ❌ |
| 16 | Subscriptions / payments (Screen 11) | ❌ | ❌ |
| 17 | Verification (selfie/ID) | ❌ Email verify only | ❌ |
| 18 | Admin: reports queue, review, suspend/unsuspend, users, dashboard | ✅ `admin/*` | ❌ |
| 19 | Settings and safety hub, notification prefs, account deletion | ⚠️ Partial | ❌ |

PRD nav: **Home · Discover · My Briefs · Messages · Profile**.

## 3. Gaps and open questions in the PRD

- **Name and tone conflict:** the PRD says InWords, the repo says Refine. The PRD says "not swipe-first," yet the API is a swipes model (`like/pass`). Decide: use swipe physics as *tactile* UI inside a **ranked, explained shortlist**, not an endless deck.
- **Platform:** the PRD targets React Native/Expo and treats web as "future"; the repo is a Next.js PWA. The backend is NestJS, not FastAPI. Appendix A leaves "mobile vs web" open.
- **Missing endpoints:** AI clarification Q&A, conversational refinement (MATCH-006), "save profile", withdraw interest, typing indicator, push subscription, billing, verification, appeals, and the analytics/AI-monitoring admin views.
- **Auth:** the PRD wants phone + OTP and passwordless; the code has email + password only.
- **Undefined UX:** how scores are shown ("prefer explanations over false precision" yet `overall_score` exists); the rule for "too few results" (suggest broadening, but never silently change non-negotiables); confidence/unknown rendering; visibility toggles per field.
- **Gender/orientation options** and **ToS/consent copy** are unresolved (Appendix A). Voice input is P1 but unspecified. The target age range, and whether brief edits trigger a search refresh and notify the user, aren't specified.
- **Accessibility:** only a single line (§16.5). It needs reduced-motion variants for every moment below.
- **Moderation display:** no spec for blurred or pending photos.

## 4. Signature moments (one per key screen)

| Screen | Moment | Motion spec |
|---|---|---|
| Welcome | **Words become a profile.** The hero sentence types itself, and key phrases ("God-fearing", "Lagos", "wants marriage") highlight and lift into chips. | Staggered text reveal, spring-in chips, with a soft gradient or shader backdrop. |
| Sign up / age gate | Calm, progress-stepper form. | Shared-layout step transitions, inline validation shake-free, DOB wheel. |
| Profile wizard | Progress ring fills and sections slide like a conversation. | `AnimatePresence` slide/fade, a confirmation tick on each step. |
| **Partner brief input** (hero feature) | A large, editorial text canvas. As you type, **interpretation chips stream in beside your words** with a faint link to the source phrase. | Debounced AI stream, chips pop with spring stagger, source phrase underlines on hover. |
| **AI review / prioritisation** | Drag chips between **Non-negotiable / Strong / Nice-to-have** lanes. Low-confidence chips pulse softly and ask a clarifying question. | Drag with layout animation (`Reorder`/dnd-kit), magnetic snap, haptic on drop, accordion clarification. |
| Discover results | Ranked **stack of cards** with real drag physics: rotate with velocity, "Interested" / "Pass" stamps fade in, next card scales up. **Tap to flip or expand** the explanation. Include a non-swipe list/grid fallback. | `useMotionValue` + `useTransform`, spring release, velocity-based fling, a button path plus keyboard (←/→) for a11y. |
| **Match explanation** | **Evidence reveal.** "Why you match" lines tick in one by one, each linked to the brief phrase it satisfies. "Potential differences" appear in a muted amber, with no score ring (or a soft qualitative arc). | Sequential check-draw (SVG path), height-animated sheet (Vaul-style drawer), highlight-link to the brief. |
| **Mutual match** | Two photos slide together and a ripple or light-burst fires. The one-line reason for the match is shown ("You both want marriage and live in Lagos"). The CTA morphs into a message composer. | Shared-element transition, Rive or Lottie burst (once), confetti-light particles, `prefers-reduced-motion` → simple fade. |
| Chat | Messages spring in from the sender's side. Typing dots, read ticks and an online dot update live. Optimistic send with a subtle "sending→sent" state. | Layout animation on list, socket-driven presence, scroll-anchoring. |
| Notifications | Bell badge with a number roll, and swipe-to-dismiss rows. | Spring badge pop, list exit animation. |
| Safety | Block/report in a bottom sheet with a calm, clear tone and an undo toast. | Drawer + toast (Sonner), no playful animation. |
| Empty / "too few matches" | Suggest broadening *with consent*: a before/after preview of what would change. | Diff-style chip animation, explicit accept control. |
| Admin | Dense, dashboard-style tables and charts. | Minimal motion. |

**Global motion principles:** springs rather than easings; 150–300 ms for UI state changes; one "wow" moment per flow (hero text→chips, the match); everything gated by `prefers-reduced-motion`; and no gamified or playful tone (PRD §10.3).

## 5. Resource sites: where each fits

*Fetched headers/meta. Page content was not reviewed in depth.*

| Site | What it is (from the site) | Best fit in Refine |
|---|---|---|
| [Astryx](https://astryx.atmeta.com/) | "Open source design system that is fully customizable and agent ready" (React, themeable via `data-astryx-theme`) | **Foundation candidate:** tokens, typography, forms, buttons, sheets for onboarding, settings and chat. Evaluate customisability against our premium tone before committing. |
| [Transitions.dev](https://transitions.dev/) | Copy-paste essential UI transitions, with a coding-agent skill | Step-to-step onboarding, bottom-sheet and modal enter/exit, route transitions, list add/remove. Matches the match-explanation reveal and tab switches. |
| [HorizonX](https://horizonx.so/) | Animated shader backgrounds, textures, mockups, Figma UI kits, React components | **Welcome hero** and the **mutual-match** backdrop, and marketing/landing assets. Also app-store mockups and the PWA splash. Don't use shaders on dense screens. |
| [Bencho](https://bencho.dev/) | Live, tweakable interactive React blocks and micro-interactions | Micro-interactions: buttons, toggles, chip pop, badge counters, input focus, send button, like/pass stamps. |
| [BoardUI](https://www.boardui.com/) | React/Tailwind **dashboard** design system (104 components, 19 chart cards, Pro templates) | **Admin dashboard** only (reports queue, users table, matching/AI analytics charts). It isn't aimed at consumer screens. |

**More sources (all URLs returned HTTP 200):**

1. [Motion (formerly Framer Motion)](https://motion.dev): drag, springs, `layoutId`, `AnimatePresence`. Core engine for swipe stack, chip lanes, match transition.
2. [shadcn/ui](https://ui.shadcn.com): accessible, ownable primitives (forms, tabs, dialogs, tables) on Radix + Tailwind.
3. [Radix UI](https://www.radix-ui.com): headless accessible primitives (slider, switch, popover) if not using shadcn.
4. [Vaul](https://vaul.emilkowal.ski): gesture-driven drawer for explanation sheets, filters and block/report.
5. [Sonner](https://sonner.emilkowal.ski): polished toasts (undo on pass/block, send errors).
6. [Magic UI](https://magicui.design): animated text, blur-fade, shimmer and number tickers. Use on welcome copy and the unread badge.
7. [Aceternity UI](https://ui.aceternity.com): flashy hero and card effects (spotlight, 3D card). Use sparingly, mostly on landing.
8. [React Bits](https://reactbits.dev): text animations, backgrounds and cursor effects (split text, aurora). Good for the brief-input hero.
9. [Rive](https://rive.app): state-machine animations for the match celebration and a reactive "listening" AI orb. Small and interactive.
10. [LottieFiles](https://lottiefiles.com): ready-made lightweight celebration, tick and loading animations.
11. [Animata](https://animata.design): additional copy-paste animated components, as an alternative or supplement.

**Suggested stack:** Next.js + Tailwind + shadcn/Radix (or Astryx) → Motion for physics → Vaul + Sonner → Rive for the match moment → Transitions.dev and Bencho as reference for polish → BoardUI for `/admin`.
