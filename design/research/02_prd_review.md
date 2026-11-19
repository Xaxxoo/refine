# InWords PRD: robustness review

Reviewed: `apps/PRD.md` (v1.0, 1,283 lines), cross-checked against `apps/api` (NestJS 11, TypeORM, Postgres with pgvector). No repo files were modified.

## Overall score: 6.5 / 10

**Verdict.** The PRD is a strong *concept* document. It has a clear differentiator (§22, App. B), a sound hybrid architecture principle (§8.3: the AI interprets and explains, deterministic code decides), unusually good AI-safety instincts (§7.5 "God-fearing ≠ Christian", §7.12 never invent attributes, §7.6 never silently alter non-negotiables), and a sensible north-star metric (§13.1). It is much weaker as a *buildable specification*. UX is specified at one line per screen (§10.2). There are no AI evaluation criteria or failure behaviours. Nigeria-specific legal, safety and payments risks are named but not turned into requirements. Pricing has no unit economics. The roadmap (§17) is optimistic for the scope in §14.1. The repo has also drifted from the PRD in two ways. The stack differs (§8.1). More importantly, the matching code violates the PRD's headline guarantees: non-negotiables are not gates, and there is no gender, age or mutual-eligibility filter. A PRD whose acceptance test (§20) says "does not bypass non-negotiable requirements" is currently contradicted by the first implementation of it.

Scores by dimension:

| Dimension | Score | Note |
|---|---|---|
| Vision and problem framing | 8 | Clear, differentiated |
| Scope and prioritisation | 6 | P0 is too large; P0/P1 contradictions |
| UX specification | 4.5 | Screens listed, not specified |
| AI behaviour and failure modes | 5.5 | Good principles, no tests or fallbacks |
| Data, privacy and safety (Nigeria) | 5.5 | Right headings, shallow, key local risks missing |
| Monetisation | 5 | Tiers listed, no economics, app-store conflict |
| Metrics | 6 | Good north star, vague targets, no guardrails |
| Tech alignment with repo | 5 | Stack drift plus guarantees not met |

---

## Strengths

1. **Sharp differentiation and a guardrail against drift.** App. B ("never become a swipe app with an AI chatbot attached") gives every future decision a test.
2. **Right architecture principle.** §8.3 separates interpretation (LLM), filtering (SQL), similarity (vectors), ranking (deterministic) and explanation (LLM). This is the correct split for cost, debuggability and fairness.
3. **Mutuality is first-class.** §5.3, §7.9 and the explicit ban on presenting one-sided alignment as mutual address the core marketplace failure mode of dating apps.
4. **Preference model is well thought out.** §7.5 lists the right fields: original wording, normalised value, confidence, clarification flag, and self-reported vs verified vs unknown. §7.6 gives a three-tier priority model. §9.1 keeps raw input separate from AI interpretation.
5. **Honest about scoring.** §7.10 says weights are provisional and configurable and forbids "scientifically validated probability" claims. §13.3 labels targets as hypotheses, not benchmarks.
6. **Safety is not an afterthought.** §12.7 makes safety controls free for all users. §12.5 forbids inferring sensitive attributes from photos, names or neighbourhoods. §12.2 requires verification badges to say exactly what was verified.
7. **Good non-goals and Won't-haves** (§3.1, §14.4) and a risks table (§19) that already names the right top risks.
8. **Decisions surfaced explicitly** in Appendix A rather than silently assumed.

---

## Weaknesses

### 1. Scope and prioritisation

- **P0 is not an MVP.** §14.1 has 18 P0 items including profile creation, AI interpretation, clarification, prioritisation, mutual matching, explanations, messaging, an admin moderation tool and privacy controls. §17 fits this into 16 weeks with 7 roles, "assuming an experienced team". Realistically this is a 6–9 month build. §14.1 says the MVP "should focus on proving that natural-language matchmaking works", and most of P0 is table stakes around it.
- **P0 and P1 conflict.** AI clarification is P0 (§14.1), but the "advanced search refinement" it depends on (§7.13) is P1. Messaging is P0, but push notifications are P1, so mutual-match and message alerts are not delivered in the P0 build. Multiple saved briefs are P1, yet the MVP free tier is defined as "one brief" and Plus as "three" (§11.1). Payments are P1 but scheduled in weeks 11–13 (§17), before the beta.
- **The launch audience is undecided** (App. A: "serious relationships and marriage or broader?") but §4, the personas and the prompts all assume marriage-intent. Decide this before building. It determines the onboarding fields, the weights in §7.10 and the supply-side acquisition plan.
- **Roadmap risk is hidden.** §17 has no allowance for the cold-start problem. An empty pool makes the whole product look broken. Seeding or supply strategy, per gender and city, is not a deliverable.
- **Scope creep in the monetisation and expansion sections.** §11.2 (events, brand partnerships, affiliates) and §21 (B2B licensing) dilute focus. They are fine as a future list but should be clearly out of the PRD's committed scope.

### 2. UX specs

- **§10.2 is a screen list, not a spec.** Twelve screens get one sentence each. There are no states (empty, loading, error, low-results, AI-unavailable), no interaction rules and no copy beyond the welcome screen.
- **The signature interactions are unspecified.** Nothing defines how preference chips are edited, merged or split, how priority is changed (drag? tap-to-cycle?), what the clarification UI looks like (inline? sequential? skippable?), how "potential differences" are shown, or what "refine search" looks like. These are the product. They deserve the most spec detail.
- **Time-to-first-value is long.** The journey (§6) puts 10 steps before any match, including identity checks, a long profile (§7.2 has 8 required fields) and two free-text inputs. No drop-off budget, no progressive-onboarding option, and no "show a sample result early" idea.
- **Text input constraints are missing.** §7.3 and §7.4 say "minimum and maximum character limits" without values. The API caps briefs at 5,000 characters (`create-brief.dto.ts`) with no minimum.
- **Accessibility is one bullet** (§16.5, no WCAG target). §10.3 is adjectives ("Intelligence, Trust…"), not design principles or tokens.
- **Voice input** (P1) has no language scope, and Nigerian-accent and Pidgin ASR quality is a real risk.
- **Platform undecided** (App. A) while §1 and §8.1 assume Expo plus Next.js.

### 3. AI behaviour and failure modes

- **No evaluation plan.** The PRD says the AI "must not invent" and must "preserve original user meaning" (§12.6) but never defines how to test that. Missing: a golden set of briefs, target extraction precision and recall, a hallucination-rate threshold, red-team cases, and a regression gate for model or prompt changes. §20's closing line ("beta should demonstrate it doesn't fabricate…") is not measurable as written.
- **Failure behaviour is absent.** What happens when the LLM times out, returns malformed JSON, returns zero preferences, or is down? §16.1 sets a 10 s target but not the UX when it is missed. §8.2 has no retry, fallback or degraded mode.
- **Confidence has no semantics.** §7.5 carries a confidence value, but there is no rule for what happens below a threshold. Should it force a clarification, hide the chip or lower the weight?
- **Prompt-injection and untrusted text are unaddressed.** Candidate bios and self-descriptions flow into the explanation prompt (§7.12, §8.2 stage 9). They are user-generated and can contain instructions.
- **Reproducibility.** The same brief can yield different chips on each run. The PRD does not say whether interpretations are versioned, frozen once confirmed, or re-run on model upgrades.
- **Discriminatory preferences are in tension.** §7.4 explicitly invites "physical preferences" and §12.6 says "avoid discriminatory ranking". Briefs in Nigeria will include tribe or ethnicity, skin tone, and religion exclusions. The PRD needs an explicit policy on what is allowed as a hard filter, what is allowed as a soft preference, and what is rejected or neutralised. "Bias testing" (§19) is not enough.
- **Language coverage.** Users will write Nigerian English and Pidgin. Evaluation must include it. Nothing in the PRD does.
- **Embeddings conflation.** §8.3 says vector search finds semantic similarity, but it does not say what is compared. Comparing a "who I want" brief to a "who I am" profile is a weak signal compared with attribute matching, and the PRD does not say how much weight it should have.

### 4. Data, privacy and safety for Nigeria

- **Legal framing is thin.** §12.4 cites the NDPA 2023 (correct, and it now supersedes the older NDPR 2019 as the main statute). It then lists generic bullets. Missing as requirements:
  - classification of religion, sexual orientation (implied by "preferred dating gender"), marital history and children as *sensitive personal data*, with an explicit lawful basis for each;
  - a Data Protection Impact Assessment before launch (App. A defers it);
  - an assessment of whether InWords is a data controller of major importance that must register with the regulator, and a named Data Protection Officer;
  - a breach-notification process and timeline;
  - a lawful transfer mechanism for sending brief text and profile data to a US LLM provider (§8.1, "appropriate safeguards" only);
  - retention periods (§12.4 says "defined", with no values);
  - what data processors (OpenAI, Supabase, PostHog, Resend) see.

  I have not verified exact thresholds or deadlines against the statute text. Get counsel to confirm them.
- **LGBTQ+ safety and legality.** Same-sex relations are criminalised under Nigerian law. App. A leaves "gender and orientation" as a decision to confirm, but the answer drives data model, encryption, leak impact and app-store posture. It needs a position, not a bullet. At minimum, preferred-gender data is highly sensitive, and the safest default is to treat it as such.
- **Romance fraud is the dominant local risk** and is under-prioritised. Verification (§12.2) is P1 (§14.2) and "optional or risk-triggered". For a launch market where advance-fee and romance scams are common, phone OTP plus at least one stronger check (NIN, BVN-linked, or liveness selfie) should be P0 for the ability to express interest or message. The PRD should also specify scam-pattern detection (money requests, off-platform pushes) in messaging, not just "basic spam and abuse detection" (§7.15).
- **Account deletion is under-specified** (§7.1, §9.1, §12.7). It should state what is hard-deleted vs anonymised vs retained for legal or safety reasons: briefs, preferences, embeddings, messages, photos, reports, and AI-provider copies.
- **Private-brief confidentiality** (§12.5) is stated. There is no requirement on who inside the company can read briefs (§15 says "restricted, justified and logged", but there is no audit-log requirement in the P0 list).
- **Minors.** §12.1 says "appropriate age assurance" without a method. Self-declared DOB is trivially bypassed.
- **Photo handling.** "Inappropriate image detection" (§12.3) has no provider, no human-review SLA, and no rule for private photos.
- **Connectivity and device reality** (data cost, low-end Android, flaky networks) are not mentioned anywhere in §16 non-functionals.

### 5. Monetisation

- **No unit economics.** Prices are ₦0 / ₦4,000 / ₦8,000 / ₦25,000+ (§11.1) with no estimate of LLM cost per brief, per explanation or per search against that revenue. §19 lists "high AI costs" as a risk, but with no budget. LLM and infrastructure costs are in USD while revenue is in NGN, so currency risk is not mentioned.
- **Tier differences are vague.** "More frequent searches", "additional search controls" and "expanded compatibility reports" cannot be implemented or priced. Premium's only concrete differentiator over Plus is unlimited briefs and "AI conversation assistance", a P1 feature (§14.2).
- **App-store billing conflict.** §8.1 and §11.3 propose Paystack or Flutterwave for in-app subscriptions. Both major app stores generally require their own billing for digital subscriptions on mobile. This needs a decision (store billing, web checkout, or both) and affects margin. I have not checked current store policy for Nigeria. Verify before committing.
- **Paywall placement versus the core promise.** "Limited curated recommendations" on Free and "30 recommendations per month" on Plus cap the core value. At low liquidity (§19, "low user density") a hard cap could remove most of the product's value. No hypothesis is stated for where the paywall sits relative to the first mutual match.
- **Select (human matchmaking)** is a priced tier (§11.1) but P2 (§14.3), with no ops model, staffing or SLA.
- **Recurring billing specifics** for Nigeria (card tokenisation, bank-transfer and USSD fallbacks, failed-card retry) are listed as bullets only (§11.3).

### 6. Metrics

- **WMMC (§13.1) is a good start but easy to game and shallow.** "Mutual interest + conversation initiated" says nothing about conversation quality. Add reply rate, two-way message threshold, and offline-meeting signal.
- **Targets lack denominators and time windows.** "80% find the AI interpretation acceptable after review" (§13.3) doesn't say measured per brief or per user, nor what counts as acceptable. "Five eligible recommendations within a defined search period" has no defined period. §13.2 AI quality ("accepted without significant correction") needs a definition of "significant".
- **No marketplace-liquidity metric.** The key early number is the supply per demand cell (gender × age band × city × intent). Without it, the funnel metrics will be misread.
- **No guardrail metrics for the AI promises.** Missing: non-negotiable violation rate (target 0), hallucinated-attribute rate in explanations, empty-result rate, interpretation-failure rate.
- **Safety metrics are listed (§13.2) but with no targets** and no response-time SLAs for reports.
- **PostHog is specified (§8.1), but there is no event taxonomy.**

### 7. Tech alignment with the repo

| PRD | Repo (`apps/api`) | Gap |
|---|---|---|
| Python / FastAPI backend (§8.1) | NestJS 11 + TypeORM | Stack differs. Either update the PRD or record the decision. |
| Supabase auth and storage (§8.1) | Own JWT auth (`auth/`), local-disk uploads served publicly at `/uploads/` (`main.ts`) | Auth and storage are self-built. Photos are publicly fetchable. |
| OpenAI API (§8.1) | `AI_PROVIDER` defaults to **Ollama** (`llama3.2`); OpenAI `gpt-4o-mini` is optional (`config/ai.config.ts`) | A small local model drives the core feature by default. There are two duplicate Ollama configs (`ollama.config.ts`, and `EmbeddingService`'s own embed call). |
| FCM/APNs push (§8.1, NOTIF-001) | In-app `notifications` table only | No push. |
| Paystack/Flutterwave, subscriptions, transactions (§9, §11) | None | No tables or modules. |
| PostHog analytics (§8.1, P0 "Basic analytics") | None | P0 item missing. |
| Phone and email, OTP, DOB check, ToS acceptance (§7.1) | `SignupDto`: email, username, password, displayName only | No phone, no OTP, no DOB, no 18+ check, no ToS or consent capture. DOB is an optional profile field. |
| `audit_logs`, `conversations`, `subscriptions`, `transactions` (§9) | Not among the 17 migrations | `messages` are sender/receiver rows with no conversation entity. |
| 10 preference categories (§8.2 stage 3) | 6 categories in the extraction prompt, hard-coded to the §7.10 weights | Taxonomies do not match. |
| Weights "configurable" (§7.10) | Constant in `matching.service.ts` | Not configurable. |
| Async search where needed (§16.1) | Brief create/update calls the LLM and embedding **inside the request** with no timeout | Sync only. |

**Where the code breaks PRD guarantees** (`matching/matching.service.ts`, `discoverCompatible`):

1. **Non-negotiables are not a gate** (§7.6, §7.8, §20). `non_negotiable` is only a 1.0 multiplier in `scoreCandidate`. A candidate failing every non-negotiable still appears, just lower ranked. This directly violates the §20 beta criterion.
2. **No gender, age or orientation filter** (§7.8 lists "not seeking the requesting user's gender" and age eligibility). The only SQL conditions are `is_active`, not blocked, not already swiped, and has an embedding. `preferred_dating_genders` exists on the user but is not used in this query. `users.service` `discover` does use age filters, but that is a different, non-brief path.
3. **Order is inverted.** §7.8 says filter first, then rank. The code takes the top 200 candidates by vector similarity and only then scores them, so eligible candidates can be dropped before any rule is applied.
4. **"Mutual" is not mutual** (§7.9). The score is the average of forward and reverse scores. If the candidate has no active preferences, the "mutual" score equals the forward score. There is no reverse-gate on the candidate's non-negotiables, which is exactly the "one-sided presented as mutual" case §7.9 forbids.
5. **Unknown is treated as mismatch or partial credit** (§7.5 wants "unknown" distinguished). `doesCandidateMatchPreference` gives 0.2 for any non-matching filled field and 0 for missing data. It also uses substring matching, so "unmarried" contains "married" and can score as a match. Lookup is through a fixed field map, so most attributes extracted by the LLM (e.g. "relocation", "intelligence") can only match via interests or self-description keyword search.
6. **Raw numeric score is returned** (`overallScore`, `scoreBreakdown`), against §7.10's "prioritise explanations rather than false precision". That is a client decision, but the API exposes it.
7. **N+1 queries:** `getActivePreferences` is called per candidate inside the loop (up to 200 × 2 queries).

**Where the code breaks AI and explanation guarantees** (`ai/ai.service.ts`, `briefs/briefs.service.ts`):

- `extractPreferences` calls `JSON.parse` on the raw model output with no JSON mode, no code-fence stripping and no schema validation. On parse failure it returns `[]`. `createBrief` then saves zero preferences and still marks the brief `completed`. The user gets a "successful" brief that silently matches on nothing but the embedding.
- There is no confirmation step (§6 step 8, §8.2 stage 6). Extracted preferences are persisted and immediately active. There is **no endpoint to edit or re-prioritise individual preferences** (§7.6 MATCH-002); `PATCH /briefs/:id` only accepts `rawText` or title and deletes and regenerates everything. There is no clarification endpoint (§7.7) and no conversational refinement (§7.13).
- The preference schema has no "clarification required" flag and no self-reported/verified/unknown attribute, both of which §7.5 requires.
- Priority is inferred purely from wording ("must", "ideally"), with no user override path. §7.6 wants the user to classify.
- `generateMatchExplanation` sends both profiles plus the preferences to the model and trusts the answer. There is no check that each claim maps to a real field (§7.12 "never invent"). If parsing fails it returns empty arrays, and `getOrGenerateExplanation` **saves and permanently caches** the empty result. Explanations are keyed by (user, candidate) and are never invalidated when either profile or the active brief changes.
- No timeout, retry or fallback on any `fetch` to Ollama or OpenAI.

**Privacy and safety gaps in the code:**

- `deleteAccount` anonymises the `users` row and nulls the profile embedding, but briefs (raw text, preferences and brief embeddings), messages, photos, swipes and match explanations are left. Only a hard delete would cascade. This conflicts with §7.1, §9.1 and §12.4.
- A one-sided "like" creates an `expression_of_interest` notification with the sender's display name (`swipes.service.ts`). §7.14 says private interest must not be revealed without consent or a mutual event. Decide whether this is an intended product feature and change the PRD, or fix the code.
- CORS is fully open in `main.ts` (`enableCors()`) and the chat gateway (`origin: "*"`).

**Credit where it is due:** the repo already has blocks and reports with an admin review and suspend flow, a global validation pipe with whitelisting, a per-route throttler, email verification and password reset with an anti-enumeration message, original wording stored separately from the normalised value, cached explanations, and a solid first pass at mutual messaging gating (`areMatched` plus `isBlocked`).

---

## Top 10 fixes, ranked by impact

1. **Make the matching guarantees true, then make them testable (§7.6, §7.8, §7.9, §20).** Apply hard gates *before* ranking: gender and orientation, age, blocks, deactivation, relationship-intent incompatibility, and both parties' non-negotiables. Remove the vector top-200 as a pre-filter, or apply it after the gates. Add automated tests asserting zero non-negotiable violations. This is the PRD's core promise and is currently unmet.
2. **Specify the AI quality bar and failure modes (§7.5, §8.2, §12.6, §16.1).** Add: a golden set of 100+ Nigerian-English and Pidgin briefs; target extraction precision and recall; a hallucination threshold for explanations (target 0 invented attributes); a confidence threshold that forces clarification; timeouts, retries and a degraded mode; and a rule that a brief with zero extracted preferences is *not* "completed". Enforce schema-validated JSON output.
3. **Add an explicit confirm-and-edit loop as an API and UX contract (§6 step 8, §7.5–7.7, §7.13).** Preferences should be `draft` until the user confirms. Add per-preference edit, delete and re-prioritise, clarification questions with a skip option, and a "needs your input" state. Without this, the product's central interaction does not exist.
4. **Write the Nigeria privacy and legal requirements (§12.4, §12.5, App. A).** Do the DPIA now. Classify sensitive fields and lawful basis. Define retention values. Define cross-border transfer for LLM calls (or choose a region or provider that avoids it). Decide data-controller registration and DPO ownership. Specify hard-delete scope across briefs, embeddings, messages, photos and processor copies. Fix the repo's partial deletion at the same time.
5. **Take a position on orientation, safety and anti-fraud, and promote verification to P0 (§12.2, §14.2, App. A).** Decide the stance on same-sex users and treat `preferred_dating_genders` as highly sensitive. Make phone OTP plus one stronger identity check a gate to messaging. Add scam-pattern detection to §7.15.
6. **Cut P0 and fix the contradictions (§14, §17).** Move admin tooling, multiple briefs and non-essential profile fields out of P0. Pull push notifications into P0, since messaging without alerts will not retain. Reschedule §17 to include a cold-start and seeding workstream. State a realistic timeline or a smaller beta scope. Decide the launch audience (marriage-intent only vs broader) first.
7. **Spec the three signature screens properly (§10.2: screens 4, 5, 6/7).** Provide states (empty, loading, partial, failed), chip editing and priority interaction, clarification flow, "why you match" and "potential differences" layouts, and low-results guidance. Use real copy. Set a time-to-first-value target and an early-preview option to shorten the §6 journey.
8. **Add monetisation economics and resolve billing (§11, §8.1).** Model cost per brief, per explanation and per search against each tier. Pin down concrete, measurable tier limits. Decide app-store billing vs Paystack or Flutterwave, and write the paywall hypothesis (where the cap sits relative to the first mutual match). Move Select, events and affiliates to a clearly marked later section.
9. **Define metrics precisely and add guardrails (§13).** Add denominators, time windows and definitions for each target. Add marketplace-liquidity (supply per gender × age × city × intent cell), conversation-quality metrics beyond WMMC, and AI guardrail metrics (non-negotiable violation rate, hallucination rate, empty-result rate). Add an analytics event taxonomy. Wire PostHog, since it is a P0 item that doesn't exist yet.
10. **Reconcile the PRD with the repo and close the P0 gaps (§7.1, §8.1, §9, §16).** Record the real stack (NestJS, Ollama default, self-built auth and storage) or migrate. Add DOB, phone and OTP and consent capture to signup. Replace the Ollama default with a model that is evaluated for this task. Make the weights configurable. Add the missing tables (`audit_logs`, `conversations`, `subscriptions`, `transactions`). Fix CORS, public uploads and the one-sided-interest notification leak, or change the PRD to say it is intended.

*Method note:* the code findings come from reading `ai.service.ts`, `matching.service.ts`, `briefs.service.ts`, `swipes.service.ts`, `messages.service.ts`, `users.service.ts` (delete and discover), `main.ts`, the signup DTO, config files, controllers' route lists and the migration list. I did not run the API or its tests. Statements about Nigerian law and app-store policy are from general knowledge and should be confirmed with counsel and current store terms.
