# Refine: UI inspiration gap fill (chat; AI input / brief-to-chips / preference review)

Target feel: premium, calm, editorial, dark-mode dating app with AI matchmaking.

## How these were gathered (and the limits)

- Every shot URL below was opened in a real browser session (Playwright) and returned **HTTP 200** with the shot's own title and designer in the page title. Plain `curl` and WebFetch cannot be used for verification: Dribbble sits behind an AWS WAF that answers curl with an empty `202` challenge, and Behance returned `403` to curl. So "200" here means the browser load, not curl.
- `https://dribbble.com/search/dating-app-chat` loaded and supplied the chat shots. The searches for `ai-input`, `ai-chat-app-dark` and `preference-chips` hit Dribbble's "Let's confirm you are human" check after a burst of requests. I did **not** click through or try to defeat it. The AI-input shots came instead from Dribbble collection and profile pages, a Dribbble tag page, and the `ai-filter-chips` search page, all of which loaded normally.
- Preview images are each shot's `og:image` (1600x1200 resize from `cdn.dribbble.com`), downloaded with curl and checked by magic bytes and by eye. They are saved in `/workspace/pins/`.
- Behance was not usable (403), so there are no Behance pins.
- **Honest caveat:** Dribbble's dating-chat shots skew neon/pink/purple and glossy. Only chat_2 and chat_3 are near-neutral black. Treat the rest as *structure* references and re-skin them with a desaturated editorial palette. And I did not find a Dribbble shot that shows a literal "brief text becomes editable preference chips" flow. The brief_N pins cover the input surface, the chip-row pattern and the AI-chat structure. For the brief-to-chips pattern itself, see "Non-Dribbble references" at the end.

---

## Gap 1: chat screens

| Pin | Shot | Designer | URL |
|---|---|---|---|
| `chat_2.png` | Modern Dating App — Chat, Match & Credits | Mohammad Ali | https://dribbble.com/shots/27003869-Modern-Dating-App-Chat-Match-Credits |
| `chat_3.png` | Dating App Chat UI – Modern Dark Messaging Experience | Abu Hasan Emon | https://dribbble.com/shots/27323886-Dating-App-Chat-UI-Modern-Dark-Messaging-Experience |
| `chat_4.png` | Dating App Chat UI — Modern Messaging Screen Design \| UI/UX | Abu Hasan Emon | https://dribbble.com/shots/27817404-Dating-App-Chat-UI-Modern-Messaging-Screen-Design-UI-UX |
| `chat_5.png` | Anonymous Chat & Dating App | Sahariar Hossain | https://dribbble.com/shots/26940963-Anonymous-Chat-Dating-App |
| `chat_6.png` | Dating Mobile App – Chat Screen Mobile UI | NextGen IT Agency | https://dribbble.com/shots/27069588-Dating-Mobile-App-Chat-Screen-Mobile-UI |

Notes:

- **chat_2.** Closest to the target mood: near-black canvas, soft vertical gradient wash behind the header, quiet bubbles with low contrast against the background, a pinned/all-messages split, and verified ticks. Take the three-screen structure (inbox, thread, upgrade). Swap the hot-pink accent for one muted accent. The neon pink send button and voice-note waveform are the loudest parts to tone down.
- **chat_3.** Same family and the cleanest dark conversation list plus thread. It has an "Online" dot in the thread header, a search field with a filter button, and a story-style avatar row. Good for the inbox. Remove the story row (it pushes a social-feed feel) and use that space for a "from your brief" context line.
- **chat_4.** Only useful as a *layout* reference, because it is a light pink theme. Worth stealing: "Pinned" vs "All" grouping labels in small caps, and the floating pill nav with a central action. Don't use the palette or the tilted mockup.
- **chat_5.** Useful for the in-chat-adjacent "choose partner's gender / interests" bottom sheet and the Messages list with typing state ("Typing…") and unread counts. The saturated purple is the opposite of calm, so take the bottom-sheet pattern only.
- **chat_6.** Glassmorphism chat with date separators ("Today"), timestamps on each bubble and an inline photo message. The blur-heavy purple background is wrong for editorial. Keep the date-chip separators and per-bubble timestamps, which suit a calm, readable thread.

Chat design takeaways for Refine: put a persistent "why you matched" strip at the top of each thread (none of these have it, so it is a differentiator); keep bubbles low-contrast and typographic; use one accent colour for send and unread; drop reactions, stories and call buttons from the MVP header.

---

## Gap 2: AI text input, brief-to-chips, preference review

| Pin | Shot | Designer | URL |
|---|---|---|---|
| `brief_3.png` | AI Chat Interface - Dark mode | Dmitry Sergushkin | https://dribbble.com/shots/27305192-AI-Chat-Interface-Dark-mode |
| `brief_4.png` | Dark Mode AI Prompt Input | Dmitry Sergushkin | https://dribbble.com/shots/27140962-Dark-Mode-AI-Prompt-Input |
| `brief_5.jpg` | AI Prompt Configuration UI | Robert Grazioli (for Bread) | https://dribbble.com/shots/24492443-AI-Prompt-Configuration-UI |
| `brief_6.png` | AI Input | Tran Mau Tri Tam (for UI8) | https://dribbble.com/shots/26355110-AI-Input |
| `brief_7.jpg` | AI Travel Booking & Trip Assistant Mobile App Design | Farhan ahmed Jibon | https://dribbble.com/shots/27727943-AI-Travel-Booking-Trip-Assistant-Mobile-App-Design |
| `brief_8.png` | Command Palette: Dark Mode | Dmitry Sergushkin | https://dribbble.com/shots/26716139-Command-Palette-Dark-Mode |

Notes:

- **brief_3.** A dark chat with a rounded composer that has a ghost-text suggestion inline ("Best Practices for Design *System Adoption*"), a magic-wand "refine" affordance at the top right, and a discreet "AI tool can make mistakes. Check important info." line. Strong model for the "Describe the person you want to meet" box. The footer disclaimer maps directly to the PRD's uncertainty and correction principles. It also shows small keyword tags inline in the AI response, a hint for chip styling.
- **brief_4.** The composer in isolation, in a near-black field with a thin gradient outline, attachment thumbnails with remove "x" badges and a white circular send button. Good source for the focus and typing state. For the brief screen, replace the model and agent pills with a "Brief 1 of 3" selector. The attachment thumbnails suggest how removable items sit inside the input, which is the same shape as removable preference chips.
- **brief_5.** A dark, calm, tool-like review surface: a conversation on the left and a detail pane on the right with `Save` and `Save and Re-Run`. This is the best structural fit for an **AI preference review** screen: raw brief on one side, the structured interpretation on the other, with explicit confirm and re-run actions. It is desktop-oriented and developer-flavoured, so adapt it to a stacked mobile layout.
- **brief_6.** A **light** theme, so palette is out. Keep only the three-state input pattern (idle, attachments menu open, typing with ghost completion and a stop/clear control) and the quiet single-row toolbar. Useful as the state spec for the brief box.
- **brief_7.** A **light** theme, also palette-out. It shows a guided, one-question-per-screen flow with a segmented progress bar, **pill answer chips** ("Weekend / 3 Nights / 1 Week / 2 Weeks") and a chat view with an "AI is planning your trip…" indicator. This is the closest Dribbble match to the **clarification step** ("When you say tall, what minimum?") and to the AI's working state. Reskin dark.
- **brief_8.** A dark, dense list with a **filter-chip row** (People, Task, Pages, Files, Docs, Messages) with outlined icons and a clear active tab underline. It is a good reference for chip anatomy: outlined, small, icon plus label, and horizontally scrollable with a fade at the edge. Use it for the priority groupings (Non-negotiable, Strong, Nice-to-have) rather than as a whole screen.

Key takeaways for Refine: the input is the hero, so give it the most space and the calmest treatment; show interpretation as removable chips *next to* the raw text so the user can see what the AI understood (PRD App. B, steps 2–3); make priority a visible, tappable property of each chip; and include an always-visible "AI can be wrong, edit anything" line.

---

## Brief-to-chips pattern (no pinned shot)

I did not find a Dribbble shot that shows free text becoming editable preference chips, and I am not listing any URL I did not open. Search excerpts (not fetched pages) described the pattern consistently, so treat these as design rules rather than sourced references:

- one chip per extracted preference, each individually removable and editable;
- text the parser could not read stays visible and flagged, never silently dropped;
- exclusions are worded "not X" rather than relying on a minus sign;
- ambiguous items get a clarifying chip or a choice of interpretations before they act as hard filters.
