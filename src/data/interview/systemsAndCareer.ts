import type { InterviewTopic } from '../../types'

export const systemsAndCareerTopics: InterviewTopic[] = [
  {
    slug: 'ml-system-design',
    title: 'ML System Design Interviews',
    description: 'How to structure an answer to "design a recommendation/fraud/search system" — the format that decides mid-to-senior DS/MLE offers.',
    content: `
## Why This Round Exists

Beyond a certain seniority (roughly 2-3+ YOE, and essentially always for Applied/ML Engineer titles at big tech), interviewers stop asking "explain gradient boosting" and start asking "design a system that recommends products for our homepage." This round tests whether you can make good tradeoffs under ambiguity across the *entire* ML lifecycle, not just modeling — it is very different from algorithm-explanation rounds and needs dedicated practice.

## A Reusable Structure (use this every time, out loud)

1. **Clarify the problem and business objective first.** Never start modeling immediately. Ask: What's the business metric this ultimately serves (revenue, engagement, retention)? What's the scale (users, items, requests/sec)? What's the latency budget? Is this a new system or improving an existing one? A candidate who jumps straight to "I'd use XGBoost" without this step reads as junior regardless of technical depth.
2. **Translate business objective into an ML problem formulation.** E.g., "increase homepage engagement" → "rank items by predicted click-through probability" — explicitly state this translation, since it's a real decision with alternatives (predicted CTR vs. predicted revenue vs. predicted long-term retention) and interviewers want to hear you weigh them.
3. **Data.** What data do you have/need (interaction logs, content metadata, user profile)? Label definition and how you'd construct it from raw logs (e.g., "click within the session" as a positive label, "impressed but not clicked" as negative). Discuss label noise/delay, and the cold-start problem for new users/items.
4. **Feature engineering.** Group into user features, item features, context features (time of day, device), and cross/interaction features. Mention a **feature store** for serving consistency between training and inference (a very senior-signaling detail — the classic "training/serving skew" bug happens when a feature is computed differently offline vs. online).
5. **Model architecture.** For anything at real scale, default to the **two-stage retrieval + ranking** pattern (see the Recommendation System project for the full reasoning): a cheap, high-recall retrieval stage narrows millions of candidates to hundreds, then an expensive, high-precision ranking model reorders those. Justify model choice against latency/scale constraints, not just "pick the fanciest model."
6. **Evaluation — offline AND online.** Offline: ranking metrics (NDCG, AUC, logloss) on held-out historical data — but explicitly flag that offline metrics can diverge from real-world impact due to exposure/selection bias in logged data. Online: A/B test design, primary metric, guardrail metrics, and rollout plan (shadow mode → small % rollout → full rollout).
7. **Serving infrastructure.** Latency budget breakdown (e.g., 100ms total: 20ms feature fetch, 50ms model inference, 30ms buffer), caching strategy, and how you'd handle a service degrading gracefully (fallback to a simpler/cached model if the primary model times out) — this operational maturity is what separates senior answers from junior ones.
8. **Monitoring & maintenance.** Feature/prediction drift monitoring, retraining cadence, alerting on model quality degradation, and a plan for handling feedback loops (a recommender trained on its own past recommendations can reinforce narrow popularity bias — a great thing to flag proactively).

## Common ML System Design Prompts (practice each with the structure above)

- Design a fraud detection system for a payments platform.
- Design a search ranking system for an e-commerce app.
- Design a system to detect duplicate/spam listings on a marketplace.
- Design a feed ranking system (like a social media home feed).
- Design a system to estimate delivery ETA in real-time.
- Design a content moderation system for user-generated text/images.

## Specific Traps to Avoid

- **Over-indexing on the model, under-indexing on data/labels/serving.** In real system design interviews, the model architecture is often the least differentiating part of your answer — most strong candidates converge on similar model choices; what separates a strong answer is the data/labeling/serving/monitoring reasoning.
- **Ignoring the cold-start problem.** Always explicitly address it for whichever system you're designing (new users, new items, new geographies) — interviewers almost always probe for this if you don't volunteer it.
- **Not discussing tradeoffs explicitly.** Every design decision (model complexity vs. latency, precision vs. recall, offline batch vs. real-time serving) should be presented as "I chose X over Y because of Z constraint," not as a single unquestioned choice.
- **Forgetting feedback loops and bias amplification** — a system that learns from its own outputs (recommenders, ranking, moderation) can create self-reinforcing bias; flagging this unprompted is a strong senior signal.
`,
  },
  {
    slug: 'case-study-questions',
    title: 'Product & Case-Study Interview Questions',
    description: 'How to structure answers to "how would you measure success of X" and "diagnose why metric Y dropped" style questions.',
    content: `
## Why This Round Exists

Especially common at startups and mid-size product companies (and as the "analytics" portion of big tech loops), case-study questions test business judgment and structured thinking under ambiguity — they are not really about statistics knowledge (though you'll use it), they're about whether you can turn a vague prompt into a rigorous, defensible analysis plan.

## Category 1: "How would you measure the success of [feature/product]?"

**Structure:**
1. Clarify the goal of the feature first — a feature can be "successful" against multiple different objectives (engagement, revenue, retention), and picking the wrong one is the most common mistake.
2. Propose a primary metric tightly tied to that goal, plus 2-3 guardrail metrics to catch unintended side effects (e.g., a feature that boosts short-term engagement but increases churn).
3. Distinguish leading indicators (early, noisy signals you can observe within days) from lagging indicators (the true business outcome, observable only after weeks/months) — a mature answer proposes a leading indicator for fast iteration while being explicit that it's a proxy for the lagging outcome that actually matters.
4. Propose how you'd actually validate causally that the feature *caused* the metric movement — ideally an A/B test; if not feasible, discuss a quasi-experimental approach (diff-in-diff, pre/post with a comparable control cohort).

## Category 2: "Metric X dropped 20% last week — diagnose why."

**Structure (always work top-down from broad to specific):**
1. **Sanity-check the data first**, before assuming a real business problem — is this a logging/instrumentation bug, a data pipeline failure, a timezone/date-boundary issue, or a genuine change? (This step alone, stated first and explicitly, is what separates strong candidates — many jump straight to business hypotheses and miss that a huge fraction of real "metric dropped" incidents are actually data/tracking bugs.)
2. **Segment the drop.** Is it uniform across all platforms/geographies/user segments, or concentrated in one slice (e.g., only iOS, only new users, only one region)? A concentrated drop points strongly toward a specific proximate cause (an app release, a regional outage, a pricing change in one market); a uniform drop points toward something systemic (a global algorithm change, a seasonal effect, a broad market shift).
3. **Check the timeline against known changes** — recent deploys, marketing campaigns starting/ending, competitor actions, seasonality/holidays, external events.
4. **Form and prioritize hypotheses**, then state how you'd test each one with data (e.g., "if it's a funnel drop-off issue, I'd check step-by-step conversion rates in the funnel to localize exactly where users are dropping off").
5. **Propose the fix and how you'd confirm it worked** (a monitoring plan, not just a one-time diagnosis).

## Category 3: "Should we launch/ship X?" (a decision, not just an analysis)

Structure this as a cost-benefit tradeoff explicitly: what's the estimated upside (with a stated confidence level, not false precision), what's the risk/downside, what's the cost of being wrong in each direction, and what's the cheapest way to get more information before fully committing (a small pilot, an A/B test, a phased rollout) — showing you understand that "ship or don't ship" is rarely the only two options; "test cheaply first" is very often the strongest answer.

## Indian-Market-Specific Case Study Flavors to Practice

- "Our food delivery app's average order value dropped in Tier-2/3 cities but not Tier-1 — investigate." (tests segmentation instinct + awareness of India-specific market heterogeneity)
- "Design a metric to evaluate whether our UPI payment success rate is healthy." (tests domain awareness of Indian fintech infra realities — bank downtime, network reliability variance)
- "Our regional-language app version has lower Day-30 retention than the English version — why, and what would you test?" (localization/product-market-fit reasoning)

## What Separates a Strong Answer

Explicitly stating assumptions ("I'm assuming this metric is measured daily and the drop is week-over-week, let me know if that's wrong"), working from broad hypotheses to specific ones rather than guessing a specific cause immediately, distinguishing correlation from causation throughout, and always closing the loop with "here's how I'd know if my proposed fix actually worked" — a full diagnostic-to-validation loop, not just a diagnosis.
`,
  },
  {
    slug: 'behavioral-interviews-india',
    title: 'Behavioral / HR Round Prep (India Context)',
    description: 'STAR-format answers, salary negotiation norms, and the specific behavioral patterns Indian tech recruiters and hiring managers screen for.',
    content: `
## Why Candidates Underprepare for This Round — and Shouldn't

Strong technical candidates in India frequently lose offers at the behavioral/HR round, not because of weak answers but because of *unprepared, rambling* answers — this round is entirely prep-able and the leverage-per-hour-invested is very high. Big tech and well-run mid-size companies (and increasingly startups) weight this round as a hard gate, not a formality.

## The STAR Framework — Use It Every Time

**Situation** (brief context) → **Task** (what was specifically your responsibility) → **Action** (what *you* did, step by step — be careful to say "I," not just "we," recruiters are specifically listening for individual contribution vs. team credit-sharing) → **Result** (quantified outcome, plus what you'd do differently in hindsight if relevant).

**Common mistake:** spending 80% of the answer on Situation/Task and rushing the Action and Result — flip this ratio; Action and Result should be the bulk of your answer since that's what's actually being evaluated.

## Questions to Prepare STAR Stories For (have 6-8 stories ready, mapped to multiple possible questions)

- Tell me about a time you disagreed with a teammate/manager on a technical decision.
- Tell me about a project that failed or didn't go as planned — what did you learn?
- Tell me about a time you had to explain a technical/model result to a non-technical stakeholder.
- Tell me about a time you had to make a decision with incomplete data/information.
- Tell me about a time you received critical feedback — how did you respond?
- Tell me about a time you had to push back on a request you thought was wrong (e.g., a stakeholder wanting you to report a misleading metric).
- Describe a time you had to prioritize between competing deadlines.
- Tell me about your most technically challenging project (have your *deepest* project ready here — this is your chance to show depth, expect deep technical follow-ups even in an "HR" round at good companies).

## "Tell Me About Yourself" — Structure It as a Narrative, Not a Resume Read-Aloud

A strong structure: (1) a one-line current identity/focus, (2) the through-line of your experience (what problem space/skill you've been building toward), (3) 1-2 concrete highlight achievements with numbers, (4) why you're interested in *this specific role/company* — this last part is frequently skipped and is exactly what signals genuine interest vs. mass-applying.

## "Why This Company" — Do the Homework

Generic answers ("I want to work with big data" at literally any company) read as low-effort. Reference something specific: a particular product/team you'd want to work on, a specific technical blog post or engineering challenge the company has published about, or a specific reason their business problem excites you. For Indian startups especially, hiring managers notice when a candidate clearly hasn't looked at what the company actually does.

## Salary Negotiation — India-Specific Norms

- **Always let the company give the first number when possible**, but be ready with a well-researched range if pushed (Glassdoor, Levels.fyi India data, AmbitionBox, and network conversations are your best sources — ranges vary hugely by city and company stage).
- **Negotiate the full package, not just base:** in Indian tech comp, variable pay (bonus %), ESOPs/RSUs (and their vesting schedule — unvested startup equity is worth asking hard questions about), joining bonus (common to offset notice period loss of income), and relocation assistance are all real levers, not just base salary.
- **Notice period leverage:** in India, a shorter notice period is a genuinely valuable asset to employers needing to fill a role quickly — it's reasonable (and common) to mention you can potentially negotiate a shorter buyout with your current employer, which can strengthen your position.
- **Get competing offers before your final negotiation conversation if at all possible** — even a lower competing offer is genuine, usable leverage; most Indian tech companies do have some budget flexibility for a candidate with a documented competing offer, especially at mid-size/startup firms.
- **Always negotiate — but professionally and with reasons, not just "can you do better."** Frame asks around market data and your specific value ("Based on my research and the scope of this role, I was expecting a base closer to X — is there flexibility there?").

## Culture-Fit / "Any Questions For Us?" — Always Have 3-4 Ready

Never say "no, I think you covered everything." Good questions to ask: "What does success look like in this role at the 6-month mark?", "What's the biggest technical challenge the team is currently wrestling with?", "How does the team balance model experimentation speed vs. production stability?", and (for startups specifically) "What's the company's runway/path to the next funding milestone?" — a legitimate, increasingly expected question at Indian startups given funding-environment volatility.

## Red Flags Interviewers Watch For (avoid these)

Badmouthing a previous employer/manager (reframe any negative experience constructively, focused on what you learned), taking sole credit for team wins without acknowledging collaborators, being unable to name a single weakness/growth area genuinely, and vague, unquantified answers to every "tell me about a project" question — always have numbers ready (impact, scale, percentage improvement) even in a behavioral-round story.
`,
  },
  {
    slug: 'company-tier-expectations',
    title: 'Startup vs Mid-Size vs Big Tech: What Each Actually Expects',
    description: 'How interview bar, role scope, comp structure, and day-to-day work genuinely differ across company tiers in the Indian DS market — so you can target your prep correctly.',
    content: `
## Why This Matters for How You Prepare

"Data Scientist" means genuinely different jobs at a 20-person startup, a 500-person Series-C company, and a big tech India office — and interviewers at each tier calibrate their bar differently. Preparing generically wastes effort; understanding the tier you're targeting sharpens both your prep and your interview answers.

## Early-Stage Startups (Seed to Series B, roughly)

**What the role actually is:** you are often the 1st-5th DS/ML hire, wearing a "full-stack data scientist" hat — pulling your own data via SQL, building the model, and often personally deploying and monitoring it (there may be no dedicated ML platform/MLE team yet). Expect ambiguous problems with much less clean data/infrastructure than case studies imply.

**Interview bar and format:** typically fewer rounds (3-5 total), more emphasis on practical breadth (can you do EDA, modeling, SQL, and basic deployment yourself) and less on deep theoretical/system-design depth. Founders/hiring managers weight "can this person ship something useful in month one with minimal hand-holding" very heavily. Take-home assignments are common and often directly resemble real early-stage problems (build a churn/pricing/forecasting model on a provided dataset).

**What to emphasize in interviews:** end-to-end project ownership (not just modeling — mention the data pipeline, the deployment, the business-impact framing), comfort with ambiguity, and genuine enthusiasm for the specific business problem (founders are very sensitive to candidates who seem to be using the startup as a stepping stone rather than genuinely interested in the problem).

**Compensation reality:** base salary is often somewhat below big tech for equivalent experience, offset by meaningful (but risky/illiquid) ESOPs — always ask directly about strike price, vesting schedule (standard is 4-year vest with a 1-year cliff), and the company's last funding round/valuation to gauge equity realism. Negotiate joining bonus/notice-period buyout support if leaving a paying job for a risky stage.

## Mid-Size / Growth-Stage Companies (Series C+, well-funded unicorns, established profitable mid-size firms)

**What the role actually is:** more specialized than early-stage (you might be specifically the "recommendations DS" or "risk DS," not a generalist), with dedicated ML platform/data engineering support, but still close enough to the business that you'll regularly interact with product/business stakeholders directly, unlike deep-big-tech org layers.

**Interview bar and format:** typically 4-6 rounds including a dedicated ML system design or case-study round (much more common here than at early-stage startups), a live SQL/coding round, and behavioral rounds. Bar for both theoretical depth and applied/business judgment is meaningfully higher than early-stage.

**What to emphasize:** depth in your specific domain (if applying for a fraud/risk role, go deep on that domain's specific metrics/methods, not generic ML breadth), plus solid system-design instincts (this tier cares a lot about whether your model designs will actually scale and stay maintainable, since these companies are past the "just ship something" stage and into the "build durable infrastructure" stage).

**Compensation reality:** typically the strongest total comp tier relative to seniority in the Indian market right now — base competitive with or exceeding big tech at similar experience levels, plus real (though still less liquid than public-company RSUs) equity in companies with a credible path to IPO/acquisition. This tier is often where the best negotiating leverage exists, especially with a competing offer.

## Big Tech (India offices of Google, Amazon, Microsoft, Meta, and similarly-structured large Indian tech/product companies)

**What the role actually is:** highly specialized within a large, mature ML infrastructure — you'll likely own a narrow but deep slice of a much larger system, working alongside dedicated MLE/data engineering/platform teams. Process, code review rigor, and documentation standards are much heavier than earlier-stage companies.

**Interview bar and format:** the most standardized, multi-round loop (typically 4-6 rounds: coding/SQL, ML breadth/depth, ML system design, and multiple behavioral rounds explicitly scored against a leadership-principles-style rubric — e.g. Amazon's Leadership Principles are literally scored per-round). Expect deep algorithmic/statistical rigor questions and a heavily structured system-design round for anything beyond entry level. Bar-raiser/hiring-committee review processes (candidate is evaluated by people outside the immediate hiring team too) are common, adding an extra layer of consistency (and rigidity) to the bar.

**What to emphasize:** structured, textbook-rigorous answers (this is the tier where fully deriving backprop or explaining bias-variance precisely actually matters most), clean articulation using the STAR format for behavioral rounds (specifically prepare against whichever leadership-principles framework the company publishes, if any), and comfort with the standardized system-design rubric described in the ML System Design section.

**Compensation reality:** highest, most liquid comp structure (public-company RSUs vest predictably and are immediately tradeable, unlike private startup equity) with well-documented, fairly standardized bands (Levels.fyi India data is genuinely reliable here) — but often the slowest-moving, most process-heavy day-to-day work environment of the three tiers, a real tradeoff worth weighing against your own preferences, not just the comp number.

## A Practical Targeting Strategy

If you're earlier in your career and unsure which tier fits, note that big tech's standardized loop is the most "prep-able" via pure repetition of structured practice (which is exactly what a resource like this site is built for), while startup interviews reward genuine, specific enthusiasm and demonstrated end-to-end ownership more than loop-perfect answers — prepare the fundamentals universally (this entire Interview Prep section), but calibrate your behavioral-round narrative and question-asking to the tier and specific company you're actually interviewing with.
`,
  },
]
