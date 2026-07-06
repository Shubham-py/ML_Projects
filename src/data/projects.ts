import type { ProjectSpec } from '../types'

export const projects: ProjectSpec[] = [
  {
    slug: 'churn-prediction',
    title: 'Customer Churn Prediction (Telecom / SaaS / Fintech)',
    difficulty: 'Beginner',
    domain: 'Classification · Tabular',
    companyTier: ['Startup', 'Mid-size', 'Big Tech'],
    tags: ['classification', 'imbalanced-data', 'business-metrics'],
    summary: 'Predict which customers are about to churn and quantify the revenue at risk — the single most commonly interviewed end-to-end tabular ML problem in India.',
    content: `
## Why This Project

Nearly every subscription/usage-based business (telecom, SaaS, D2C subscriptions, fintech lending) runs a churn model, which makes this the most likely "tell me about a project" opener in an interview — and interviewers will probe deep because they've heard the shallow version a hundred times. Do it properly and it becomes your strongest talking point.

## Dataset

Use the public **Telco Customer Churn** dataset (Kaggle/IBM sample dataset, ~7,000 rows) to start, then optionally swap in a bank-churn or SaaS-usage dataset to show domain range. Look for: customer demographics, tenure, contract type, monthly charges, service usage, and a binary churn label.

## Step-by-Step Approach

1. **EDA & leakage check first.** Look for any feature that could leak the future (e.g. "cancellation_date_flag" computed after churn happened). Check class balance — churn is almost always imbalanced (typically 15-30% positive).
2. **Feature engineering:** tenure buckets, ratio features (monthly_charges / tenure), recent usage trend (last-30-days vs. prior-30-days), interaction of contract type × payment method (month-to-month + electronic check is a classic high-risk combo in the Telco dataset — find and explain patterns like this, it shows business thinking, not just modeling).
3. **Baseline:** Logistic Regression with L2 + class_weight='balanced'. Always report this before anything fancier — it's your sanity check and often gets you 80% of the way.
4. **Main model:** Gradient Boosting (XGBoost/LightGBM) with proper cross-validation (stratified K-fold given imbalance), tuned via early stopping on a held-out validation fold, not a fixed n_estimators.
5. **Handle imbalance properly:** don't just apply SMOTE blindly — first try class weighting and threshold tuning; only add resampling if it demonstrably improves validation PR-AUC, and always resample *after* the train/val split (resampling before splitting is a classic leakage bug that inflates validation scores).
6. **Evaluate with the right metrics:** PR-AUC and recall-at-fixed-precision (not accuracy — a model predicting "no churn" for everyone can hit 80%+ accuracy and be useless). Plot a calibration curve if you'll use the raw probability for prioritization.
7. **Translate to business impact:** convert model output into "₹X of monthly recurring revenue at risk, retainable if we contact the top 500 highest-risk customers with Y% success rate of a retention offer" — this business-framing sentence is what separates a hire from a pass in interviews.
8. **Explainability:** SHAP values for the top churn drivers, and a couple of individual customer explanations ("this customer is flagged because of month-to-month contract + high monthly charges + no tech support add-on").

## Evaluation Metrics

Precision-Recall AUC (primary, given imbalance), Recall @ Precision=0.5 (or whatever threshold matches a realistic retention-team capacity), calibration (Brier score), and a business-value table (cost of false positive = wasted retention offer, cost of false negative = lost customer LTV).

## What to Put on Your Resume/Portfolio

"Built a churn prediction pipeline (XGBoost, SHAP) achieving 0.71 PR-AUC on held-out data, identifying ₹X in monthly at-risk revenue and the top 3 actionable churn drivers, with a threshold tuned to a realistic 500-customer/month retention capacity." Numbers matter far more than model names.

## Common Follow-Up Interview Questions on This Project

- "How would you validate this generalizes to next quarter's customers, given customer behavior drifts over time?" → time-based train/test split, not random split, plus periodic retraining/monitoring for feature drift.
- "The business wants explanations for individual customers, not just global feature importance — how would you do that?" → SHAP per-instance force plots.
- "How would you A/B test whether acting on this model actually reduces churn?" → randomize which flagged high-risk customers receive the retention treatment vs. a held-out control group, measure churn rate difference — this is the step most candidates forget, and senior interviewers specifically probe for it.
`,
  },
  {
    slug: 'fraud-detection',
    title: 'Real-Time Transaction Fraud Detection',
    difficulty: 'Advanced',
    domain: 'Classification · Extreme Imbalance · Streaming',
    companyTier: ['Mid-size', 'Big Tech'],
    tags: ['fraud', 'imbalanced-data', 'anomaly-detection', 'latency'],
    summary: 'Detect fraudulent transactions in near real-time under extreme class imbalance (often <0.5% positive rate) with strict latency constraints.',
    content: `
## Why This Project

Every Indian fintech (Razorpay, PhonePe, Paytm, CRED, banks' digital arms) has a fraud team, and this project demonstrates you understand extreme imbalance, latency-constrained serving, and adversarial/non-stationary data — three things that separate a "textbook classifier" candidate from a production-ready one.

## Dataset

Public **Credit Card Fraud Detection** dataset (Kaggle, European cardholders, ~285K transactions, ~0.17% fraud, PCA-anonymized features) is the standard starting point. For a more realistic project, simulate additional behavioral/velocity features (transactions in last 1hr/24hr, merchant category diversity, geographic distance from last transaction) on top of it.

## Step-by-Step Approach

1. **Understand the extreme imbalance problem concretely:** with 0.17% fraud, a model predicting "not fraud" always gets 99.83% accuracy — accuracy is meaningless here from step one.
2. **Feature engineering focused on behavior, not just the raw transaction:** velocity features (count/sum of transactions in trailing windows), deviation from the user's historical spending pattern (z-score of this transaction's amount vs. user's rolling mean/std), device/location change flags. This is where real signal lives — anonymized PCA features alone rarely beat well-engineered behavioral features in production.
3. **Model choice:** Gradient boosting (XGBoost/LightGBM) with \`scale_pos_weight\` tuned, or an **Isolation Forest**/autoencoder-based anomaly detection layer as a complementary unsupervised signal for genuinely novel fraud patterns not seen in labeled history — a strong project shows you understand supervised models only catch *known* fraud patterns.
4. **Validation must be time-based**, never random k-fold — fraud patterns evolve (adversarial actors adapt), so a random split leaks future patterns into training and wildly overstates real-world performance. Use a rolling time-window validation scheme (train on months 1-4, validate on month 5, etc.).
5. **Metric:** PR-AUC and recall at a fixed, business-realistic false-positive budget (e.g., "at most 1 in 200 legitimate transactions flagged, what fraud recall do we get?") — frame it exactly like the business/ops team would.
6. **Latency:** discuss the real production constraint — a fraud model typically must score a transaction in under 50-100ms. This means heavy feature engineering (rolling aggregates) must be precomputed/cached in a feature store, not computed on the fly from raw transaction logs at request time.
7. **Feedback loop & label delay problem:** fraud labels often arrive days/weeks late (chargebacks take time to confirm) — discuss how you'd handle training on partially-labeled, delayed-feedback data (a very senior-level nuance that will impress interviewers if you bring it up unprompted).

## Evaluation Metrics

PR-AUC (primary), recall @ fixed false-positive rate, cost-weighted metric (false negative cost = fraud amount lost; false positive cost = customer friction/support cost — build an actual expected-cost table and optimize the threshold against it, not F1).

## What to Put on Your Resume/Portfolio

"Built a fraud detection model (XGBoost + behavioral velocity features) achieving 85% recall at a 0.5% false-positive budget on a time-based validation split, with a discussion of production latency and delayed-label feedback loop design."

## Common Follow-Up Interview Questions on This Project

- "Your model must score a transaction in 50ms — what parts of your pipeline would break, and how would you fix them?" → precomputed feature store for rolling aggregates, cannot query full transaction history live.
- "Fraud patterns change monthly as fraudsters adapt — how do you keep the model from going stale?" → scheduled retraining cadence, drift monitoring on feature distributions and prediction distributions, shadow-mode testing of new model versions before full rollout.
- "How do you handle the fact that a 'not fraud' label might just mean 'not caught yet'?" → label noise from delayed/incomplete chargeback data; discuss using a longer observation window before finalizing labels, and being aware this creates a systematic lag in ground truth.
`,
  },
  {
    slug: 'recommendation-system',
    title: 'Product / Content Recommendation System',
    difficulty: 'Advanced',
    domain: 'Recommender Systems · Ranking',
    companyTier: ['Mid-size', 'Big Tech'],
    tags: ['recommenders', 'collaborative-filtering', 'ranking', 'embeddings'],
    summary: 'Build a recommendation pipeline covering collaborative filtering, content-based signals, and a two-stage retrieve-then-rank architecture used by every large-scale product/content platform.',
    content: `
## Why This Project

Recommendation is core infrastructure at every e-commerce (Flipkart, Myntra), content (Hotstar, JioCinema), and food-delivery (Swiggy, Zomato) company — and it's a project that lets you demonstrate breadth: collaborative filtering, embeddings, ranking metrics, and cold-start handling all in one place.

## Dataset

**MovieLens** (100K or 1M ratings) is the standard learning dataset; for a more industry-relevant flavor, use an e-commerce dataset with implicit feedback (views/purchases) like the Kaggle "Retailrocket" or "H&M Personalized Fashion" datasets — implicit feedback is what you'll actually deal with in most real jobs (people rarely leave explicit 1-5 star ratings, they just click or don't).

## Step-by-Step Approach

1. **Start simple — popularity baseline.** Always benchmark against "recommend the most popular items" — a surprisingly strong baseline that a fancier model must beat to justify its complexity.
2. **Collaborative Filtering via Matrix Factorization:** decompose the user-item interaction matrix $R \\approx U V^T$ (via ALS — Alternating Least Squares, which handles implicit feedback well, or SVD for explicit ratings). Explain the intuition: users and items are represented in a shared latent-factor space, and the model learns these factors purely from interaction patterns, without needing any content features.
3. **Content-Based Filtering:** for cold-start items/users (no interaction history yet), use item metadata (category, text description via TF-IDF or embeddings, price range) to recommend similar items — critical to discuss since pure collaborative filtering fails completely for new users/items (the "cold-start problem").
4. **Two-stage architecture (how it's actually done at scale):** a fast **retrieval** stage (e.g. ANN search over item embeddings, or simple collaborative filtering) narrows millions of items down to a few hundred candidates, followed by a more expensive, feature-rich **ranking** model (gradient boosting or a neural ranker) that reorders those candidates using richer features (recency, price, personalization signals) — explain why you can't just run a heavy ranking model over the entire catalog for every user request (latency/cost).
5. **Implicit feedback nuance:** with only positive signals (clicks/purchases, no explicit negatives), you must construct negative samples — commonly via **negative sampling** (randomly sampled un-interacted items) — and discuss the selection bias this introduces (a user not clicking an item doesn't necessarily mean they dislike it — they may never have seen it).
6. **Evaluate properly with ranking metrics**, not classification accuracy: Precision@K, Recall@K, NDCG@K (Normalized Discounted Cumulative Gain — rewards placing relevant items higher in the ranked list, not just anywhere in the top-K), and MAP (Mean Average Precision).
7. **Diversity & business constraints:** discuss why pure accuracy-maximizing recommendations can create filter bubbles/repetition, and how business rules (diversity injection, inventory/margin-aware re-ranking) get layered on top of the pure ML ranking in real systems.

## Evaluation Metrics

NDCG@10, Recall@10/20, coverage (% of catalog ever recommended — a proxy for filter-bubble risk), and an offline-to-online correlation discussion (why offline NDCG improvements don't always translate to online engagement lifts, and why A/B testing is the real ground truth).

## What to Put on Your Resume/Portfolio

"Built a two-stage recommendation pipeline (ALS-based retrieval + LightGBM ranker) achieving NDCG@10 of 0.34 vs. 0.19 for a popularity baseline, with a documented cold-start strategy using content-based fallback for new items."

## Common Follow-Up Interview Questions on This Project

- "How would you recommend items to a completely new user with zero interaction history?" → cold-start handling: onboarding preference surveys, popularity/trending fallback, content-based similarity to any single item they've viewed, contextual bandits to actively learn preferences quickly.
- "Your offline NDCG improved 15% but the online A/B test showed no engagement lift — why might that happen, and what would you check?" → offline metrics use historical logged data which reflects the *old* policy's exposure bias (you only have feedback on items the old system already showed), so an offline-superior ranking can genuinely fail to translate online; also check for implementation bugs, novelty/primacy effects in the A/B test, and whether the offline metric actually aligns with the true business objective (engagement vs. rating prediction accuracy).
- "How do you keep recommendations fresh as new items are added to the catalog constantly?" → incremental/online retraining cadence, and content-based scoring for brand-new items until enough interaction data accumulates for collaborative signals to kick in.
`,
  },
  {
    slug: 'demand-forecasting',
    title: 'Demand / Sales Forecasting',
    difficulty: 'Intermediate',
    domain: 'Time Series · Regression',
    companyTier: ['Startup', 'Mid-size', 'Big Tech'],
    tags: ['time-series', 'forecasting', 'regression'],
    summary: 'Forecast future demand/sales at the SKU-store-day level, handling seasonality, trend, holidays, and promotions — essential for inventory and supply chain decisions.',
    content: `
## Why This Project

Every retail, quick-commerce, D2C, and logistics company (Blinkit, BigBasket, Flipkart, Delhivery) runs demand forecasting to drive inventory, staffing, and supply-chain decisions — it's the most common time-series project asked about in interviews and tests a different skill set (handling temporal structure) than the classification-heavy projects above.

## Dataset

**Kaggle's Store Item Demand Forecasting** or **Rossmann Store Sales** datasets are standard starting points (daily sales across many stores/items, with promotions and holiday flags).

## Step-by-Step Approach

1. **Decompose the series first** (trend, seasonality, residual) via classical decomposition or STL — this exploratory step tells you what your model needs to capture before you pick one.
2. **Feature engineering for tabular-ML approach (the modern practical default):** lag features (sales 1/7/14/28 days ago), rolling window statistics (7/28-day rolling mean/std), calendar features (day-of-week, month, is_holiday, days_to_next_holiday), and promotion flags. This "ML-with-lag-features" approach using gradient boosting (LightGBM) is what wins most retail forecasting competitions today — it's often more practical and accurate than pure classical time series models when you have many related series and rich exogenous features.
3. **Classical baselines to compare against:** ARIMA/SARIMA (captures autocorrelation and seasonality explicitly, interpretable, good for a single well-behaved series) and **Prophet** (handles multiple seasonalities and holiday effects with minimal tuning, good for quick baselines across thousands of series). Always report at least one classical baseline alongside your ML model — interviewers want to know you understand *why* you picked the more complex approach, not just that you know XGBoost exists.
4. **Critical: time-based cross-validation.** Never use random K-fold for time series — it leaks future information into training. Use **rolling-origin / walk-forward validation**: train on data up to time T, validate on T+1..T+h, then roll the origin forward and repeat.
5. **Handle multiple related series (global model) vs. one model per series:** with thousands of SKU-store combinations, training one giant model across all series (with series ID as a categorical feature) usually generalizes better than thousands of tiny per-series models, especially for low-volume items — an important scaling insight to mention.
6. **Evaluate with forecasting-appropriate metrics**, not just RMSE: **MAPE/WMAPE** (business teams think in percentage terms), and pay attention to how you handle zero-demand periods (MAPE is undefined at zero actuals — use WMAPE or MASE instead).
7. **Uncertainty, not just a point forecast:** discuss quantile regression or prediction intervals — real inventory decisions need a demand *range* (to set safety stock), not just a single number.

## Evaluation Metrics

WMAPE (weighted MAPE, primary), MASE (Mean Absolute Scaled Error, compares against a naive seasonal baseline), and bias (systematic over/under-forecasting, which matters enormously for inventory cost asymmetry — overstocking perishables costs differently than stockouts).

## What to Put on Your Resume/Portfolio

"Built a SKU-store-day demand forecasting pipeline (LightGBM with lag/rolling features, global model across 5,000+ series) achieving 12% WMAPE vs. 19% for a seasonal-naive baseline, validated via rolling-origin backtesting."

## Common Follow-Up Interview Questions on This Project

- "How would you forecast demand for a brand-new product with zero sales history?" → cold-start forecasting: use similar/analogous product launches, category-level growth curves, or a hierarchical model that borrows strength from related series.
- "Inventory teams say stockouts are 5x more costly than overstocking — how does that change your model?" → asymmetric loss function (e.g. quantile loss at a high quantile like 0.7-0.8 to intentionally bias forecasts upward, or a custom weighted loss), not a symmetric metric like plain RMSE.
- "A big promotional campaign is happening next month with no historical precedent — how do you forecast around that?" → causal/scenario modeling using promotion elasticity from past similar-sized promotions, or a hybrid human-in-the-loop adjustment layered on top of the statistical forecast, since pure historical-pattern models can't extrapolate to unprecedented events well.
`,
  },
  {
    slug: 'credit-risk-scoring',
    title: 'Credit Risk / Loan Default Scoring',
    difficulty: 'Intermediate',
    domain: 'Classification · Regulated ML',
    companyTier: ['Mid-size', 'Big Tech'],
    tags: ['fintech', 'risk', 'interpretability', 'fairness'],
    summary: 'Predict probability of loan default while satisfying interpretability and fairness constraints that regulated lending decisions require.',
    content: `
## Why This Project

Credit scoring is the flagship DS use case at every Indian NBFC/fintech lender (Bajaj Finserv, KreditBee, Navi, CRED, and every bank\'s digital lending arm) and it's one of the few domains where interviewers specifically probe **interpretability and fairness constraints**, not just raw accuracy — a great differentiator project if you frame it correctly.

## Dataset

**Kaggle's "Give Me Some Credit"** or the **UCI/German Credit** dataset (or the "Lending Club" loan dataset for a richer, more realistic feature set) are standard starting points.

## Step-by-Step Approach

1. **Frame the target correctly:** probability of default (PD) within a fixed horizon (e.g., 90+ days past due within 12 months) — be precise about the definition, since "default" is ambiguous and this precision itself is an interview signal.
2. **Feature engineering around credit bureau logic:** debt-to-income ratio, credit utilization, length of credit history, number of recent inquiries, payment history features — mirror real bureau scorecards (like CIBIL in India) to show domain awareness.
3. **Model choice — deliberately compare interpretable vs. black-box:** start with **Logistic Regression using Weight-of-Evidence (WOE) encoded features** — this is the actual industry-standard approach in regulated credit scoring (not just a toy baseline), because regulators and credit committees require explainable score cards. Then build a Gradient Boosting model and quantify the accuracy gain you'd be trading away for a black-box model — this tradeoff discussion is the heart of the project.
4. **Build an actual scorecard:** convert the logistic regression's WOE-transformed coefficients into a points-based scorecard (like real bureau scores, e.g. 300-900 scale) — this is a concrete, portfolio-differentiating deliverable almost no other candidate will have built.
5. **Fairness audit:** check for disparate impact across protected/sensitive attributes proxies (e.g., does the model implicitly penalize certain pin codes/regions disproportionately, which can proxy for socioeconomic or religious/caste demographics in the Indian context) — compute metrics like demographic parity difference or equal opportunity difference across groups, and discuss what you'd do if you found a disparity (this is an extremely strong, differentiated talking point for senior/regulated-industry interviews).
6. **Evaluation:** discrimination power via **KS statistic** (Kolmogorov-Smirnov, the industry-standard credit risk metric measuring max separation between cumulative good/bad distributions) and **Gini coefficient** (2×AUC - 1) — learn these specific metrics, generic DS metrics like plain accuracy will read as inexperience to a credit risk interviewer.
7. **Reject inference discussion (advanced, senior-level nuance):** your training data only has outcomes for people who were *approved* for a loan — you never observe whether a rejected applicant would have defaulted, creating **selection bias** in your training data. Discussing how you'd handle this (reject inference techniques, or being upfront about the model's blind spot) signals real seniority.

## Evaluation Metrics

KS statistic, Gini coefficient / AUC, and a fairness metrics table across key demographic/geographic slices.

## What to Put on Your Resume/Portfolio

"Built a credit risk scorecard (WOE-logistic regression, KS=0.42, Gini=0.51) and compared it against an XGBoost model, quantifying a 6-point Gini improvement traded against interpretability, plus a fairness audit across regional segments flagging and correcting a disparate-impact issue in one feature."

## Common Follow-Up Interview Questions on This Project

- "Why would a regulated lender prefer a less accurate logistic regression scorecard over a more accurate XGBoost model?" → regulatory requirement for explainability/auditability of individual credit decisions, ease of monitoring score drift over time, and legal defensibility of adverse action reasons given to rejected applicants.
- "Your training data only includes approved loans — how does that bias your model, and what would you do?" → reject inference (this is the single most senior-signaling question in credit risk interviews); discuss techniques like assigning inferred outcomes to rejected applicants via extrapolation, or fuzzy augmentation, while being honest about the residual bias risk.
- "How would you detect if your model starts discriminating against a protected group after deployment?" → ongoing fairness monitoring dashboards tracking approval rate and default-rate-given-approval across demographic slices, with alerting thresholds and a defined escalation/retraining process.
`,
  },
  {
    slug: 'ab-testing-pricing',
    title: 'A/B Testing & Pricing Experimentation Platform',
    difficulty: 'Intermediate',
    domain: 'Causal Inference · Experimentation',
    companyTier: ['Mid-size', 'Big Tech'],
    tags: ['ab-testing', 'causal-inference', 'statistics', 'experimentation'],
    summary: 'Design, run, and correctly analyze an A/B test end-to-end, including power analysis, guardrail metrics, and common statistical pitfalls.',
    content: `
## Why This Project

Big tech and any data-mature Indian startup (Swiggy, Meesho, Cred) runs hundreds of A/B tests a year, and a huge fraction of "case study" interview rounds are literally "design an experiment for X" — this project, done rigorously, directly rehearses that exact interview format.

## Dataset / Setup

Either use a public **A/B testing dataset** (e.g., Kaggle's marketing/ad A/B test datasets) or simulate your own — simulating is actually preferable here since you can inject a known true effect and grade yourself on whether your analysis recovers it correctly.

## Step-by-Step Approach

1. **Define the hypothesis and metric precisely before touching data:** e.g., "Does a 10% discount banner increase 7-day conversion rate?" Define the **primary metric** (conversion rate), **guardrail metrics** (average order value, refund rate — to catch the test winning on the primary metric while quietly damaging something else), and the **randomization unit** (user, session, or device — and why that choice matters for interference/contamination).
2. **Power analysis before running anything:** given a baseline conversion rate and a minimum detectable effect (MDE) you care about, compute the required sample size per arm: $n \\approx \\frac{2(z_{\\alpha/2}+z_{\\beta})^2 p(1-p)}{\\delta^2}$. Explain why underpowered tests (too small a sample) are one of the most common real-world A/B testing failures — a "no significant difference" result from an underpowered test is uninformative, not evidence of no effect.
3. **Randomization & SRM (Sample Ratio Mismatch) check:** verify the actual observed split between control/treatment matches the intended allocation ratio (e.g., 50/50) using a chi-square test — a surprisingly common real bug (caused by faulty randomization/logging) that silently invalidates results if not checked.
4. **Analysis:** two-proportion z-test or t-test for the primary metric, with a clearly pre-registered significance threshold — and explicitly discuss the **multiple comparisons problem** if you're tracking many metrics (correcting via Bonferroni or Benjamini-Hochberg, or better, having one pre-registered primary metric and treating everything else as directional/exploratory).
5. **Variance reduction technique — CUPED (Controlled experiment Using Pre-Experiment Data):** use each user's pre-experiment behavior (e.g., historical conversion rate) as a covariate to reduce metric variance, which lets you detect the same effect size with meaningfully less data/time — a genuinely advanced, high-signal technique to implement and explain.
6. **Novelty and peeking effects:** discuss why continuously checking significance and stopping early the moment p<0.05 ("peeking") inflates the false-positive rate dramatically, and how sequential testing methods (or simply committing to a fixed sample size/duration upfront) fix this.
7. **Heterogeneous treatment effects:** does the discount work better for new users vs. returning users? Segment the analysis (pre-specified segments, not post-hoc data dredging) to extract more nuanced, actionable insight — and explicitly flag the risk of p-hacking if segments are chosen after seeing results.

## Evaluation Metrics

Statistical significance (p-value) and effect size with confidence interval on the primary metric, guardrail metric movement, SRM check p-value, and (if applicable) CUPED-adjusted variance reduction percentage achieved.

## What to Put on Your Resume/Portfolio

"Designed and analyzed a simulated pricing A/B test with proper power analysis (80% power, 5% MDE), implemented CUPED variance reduction (34% variance reduction vs. naive analysis), and built an SRM-check + guardrail-metric framework to catch experiment validity issues before trusting results."

## Common Follow-Up Interview Questions on This Project

- "Your test shows a statistically significant 2% lift, but the business isn't sure it's worth shipping — what else would you look at?" → practical significance vs. statistical significance (is 2% actually meaningful given implementation/maintenance cost?), guardrail metrics, and confidence interval width (a significant but very wide/uncertain interval is a weaker basis for a big rollout decision).
- "How would you test a feature where you can't randomize at the user level, e.g., a change to a shared recommendation algorithm serving all users in a region?" → cluster/geo-randomization, switchback experiments, or synthetic control / difference-in-differences methods when true randomization isn't feasible at the desired unit.
- "The test ran for 2 weeks and you're tempted to stop early because it's already significant — what's the risk?" → peeking inflates false-positive rate; explain the fix (fixed horizon commitment or a proper sequential testing correction like alpha-spending functions).
`,
  },
  {
    slug: 'sentiment-analysis-nlp',
    title: 'Customer Review Sentiment & Topic Analysis',
    difficulty: 'Intermediate',
    domain: 'NLP · Text Classification',
    companyTier: ['Startup', 'Mid-size', 'Big Tech'],
    tags: ['nlp', 'text-classification', 'transformers', 'topic-modeling'],
    summary: 'Classify customer review sentiment and extract themes at scale, comparing classical NLP, fine-tuned transformers, and LLM-based approaches.',
    content: `
## Why This Project

Every consumer-facing company (e-commerce, food delivery, ed-tech, travel) monitors reviews/support tickets/social mentions at scale, making this the most common NLP project in DS interviews — and it's a great vehicle to show you understand the full spectrum from classical NLP to modern LLM-based approaches, and can reason about the cost/accuracy/latency tradeoffs between them.

## Dataset

**Amazon Product Reviews**, **Flipkart product reviews** (available on Kaggle), or **IMDB Movie Reviews** for a clean binary-sentiment starting point; app-store reviews are another rich, realistic option.

## Step-by-Step Approach

1. **Classical baseline first:** TF-IDF features + Logistic Regression/Naive Bayes. Always establish this baseline — it trains in seconds, and if a transformer only marginally beats it, that's a real, defensible engineering tradeoff to discuss (simplicity/cost/latency vs. marginal accuracy).
2. **Fine-tuned transformer:** fine-tune a pretrained model (e.g. **DistilBERT** for a good accuracy/latency tradeoff, or a full BERT if accuracy is paramount) on your labeled sentiment data — walk through the practical fine-tuning workflow: tokenization, adding a classification head, small learning rate (2e-5 to 5e-5 is typical), few epochs (2-4) to avoid catastrophic forgetting/overfitting on a comparatively small fine-tuning set.
3. **Zero-shot/few-shot with an LLM (modern approach worth demonstrating):** use a general-purpose LLM via prompting for sentiment classification with no task-specific training data at all — discuss when this makes sense (low-volume, rapidly changing categories, no labeled data available) vs. when a fine-tuned smaller model wins (high volume, cost/latency-sensitive, stable well-defined task — fine-tuned DistilBERT is usually far cheaper and faster at inference scale than calling an LLM API per review).
4. **Topic extraction beyond sentiment:** apply **LDA (Latent Dirichlet Allocation)** or a more modern embedding-based clustering approach (embed reviews, then cluster, then use an LLM to label each cluster with a short topic name) to surface *why* customers are unhappy, not just *that* they're unhappy — "sentiment alone tells you there's a fire, topic modeling tells you where."
5. **Handle real-world messiness:** class imbalance (few 1-star vs. many 5-star reviews, or vice versa depending on the category), sarcasm/mixed sentiment within one review, multilingual reviews (very relevant for the Indian market — Hindi/Hinglish/regional language reviews mixed with English) — discuss a practical strategy (language detection + separate pipelines, or a multilingual model like XLM-R/IndicBERT).
6. **Evaluate properly:** macro-F1 (not accuracy, given class imbalance across 1-5 star ratings if doing multi-class), and a confusion matrix specifically checking whether the model confuses adjacent sentiment classes (3-star vs. 4-star) far more than distant ones (1-star vs. 5-star) — the former is a much more forgivable, expected error pattern.
7. **Productionize the insight, not just the model:** build a simple dashboard/aggregation showing sentiment trend over time and top complaint topics this week vs. last week — turning the model into a monitoring tool is what actually gets used by a product team, and mentioning this shows product sense.

## Evaluation Metrics

Macro-F1 (primary, given class imbalance), confusion matrix analysis for adjacent-vs-distant misclassification patterns, and (for topic modeling) topic coherence score plus a qualitative review of whether topics are actually interpretable/actionable.

## What to Put on Your Resume/Portfolio

"Built a review sentiment and topic-extraction pipeline comparing TF-IDF+LogReg (82% macro-F1), fine-tuned DistilBERT (89% macro-F1), and LLM zero-shot (86% macro-F1, no training data needed) — recommending the fine-tuned model for production given its 10x lower per-review inference cost at the required volume, with LDA-based topic extraction surfacing the top 5 recurring complaint themes."

## Common Follow-Up Interview Questions on This Project

- "When would you use a fine-tuned small model over just prompting a large LLM for this task?" → cost and latency at scale (fine-tuned DistilBERT inference is orders of magnitude cheaper per call than an LLM API at high review volume), plus more predictable/controllable behavior; LLM prompting wins when you have no labeled data, the task changes frequently, or volume is low enough that API cost is a non-issue.
- "How would you handle Hindi/Hinglish reviews mixed in with English ones?" → language detection as a preprocessing step, routing to language-specific models or a multilingual model (IndicBERT/XLM-R) trained/fine-tuned on code-mixed text, since a purely English-trained model will perform poorly on Hinglish.
- "Your topic model surfaces 15 topics but only 3 are actually interpretable — how do you fix that?" → tune the number of topics via coherence score, remove overly generic/stopword-heavy tokens, or switch to an embedding-cluster-then-LLM-label approach which tends to produce more human-interpretable topics than raw LDA on short, noisy review text.
`,
  },
  {
    slug: 'image-classification-defect',
    title: 'Visual Quality Inspection / Defect Detection',
    difficulty: 'Advanced',
    domain: 'Computer Vision · CNN',
    companyTier: ['Mid-size', 'Big Tech'],
    tags: ['computer-vision', 'cnn', 'transfer-learning', 'manufacturing'],
    summary: 'Classify product images as defective/non-defective using transfer learning, addressing the small-labeled-data and class-imbalance realities of real manufacturing/QC datasets.',
    content: `
## Why This Project

Manufacturing QC, e-commerce catalog quality, and agri-tech (crop disease detection) are major computer-vision use cases at Indian industrial/agri startups and manufacturing-adjacent big tech teams — and this project specifically forces you to deal with the classic real-world CV problem: very little labeled data and severe class imbalance (most units are non-defective).

## Dataset

Kaggle's **Casting Product Image Defect** dataset, **MVTec Anomaly Detection** dataset (industry-standard benchmark for this exact problem), or the **PlantVillage** crop disease dataset for an agri-tech spin.

## Step-by-Step Approach

1. **Never train a CNN from scratch on a small dataset** — this is the single most common CV project mistake. Use **transfer learning**: take a backbone pretrained on ImageNet (ResNet50, EfficientNet), freeze the early layers (which have already learned generic edge/texture detectors), and fine-tune only the later layers plus a new classification head on your specific defect dataset.
2. **Data augmentation** (rotation, flip, brightness/contrast jitter, slight zoom) to artificially expand a small labeled dataset and reduce overfitting — explain *why* each augmentation choice makes sense for the domain (e.g., rotation-invariance makes sense for a casting defect photographed from varying angles, but might not make sense if orientation itself is meaningful).
3. **Class imbalance handling:** most manufacturing datasets are heavily skewed toward "good" units. Use class-weighted loss, focal loss (down-weights easy, well-classified examples so the model focuses learning on the hard, rare defect examples), or oversampling of the defect class during training.
4. **Anomaly-detection framing as an alternative:** if defect types are highly varied/rare/unknown in advance, consider framing this as **one-class anomaly detection** (train only on "good" images, flag anything that looks sufficiently different) using an autoencoder (reconstruction error signals an anomaly) rather than supervised binary classification — discuss when each framing makes more sense (supervised classification when you have enough labeled examples of each known defect type; anomaly detection when defects are rare/novel/hard to enumerate in advance).
5. **Explainability via Grad-CAM:** generate class activation heatmaps showing *which pixels* the model used to make its defect/no-defect decision — critical for building trust with a QC team who need to verify the model is looking at the actual defect region, not some spurious background artifact (a real, common failure mode in CV projects with small datasets).
6. **Evaluate with the right lens for a QC context:** recall is usually prioritized heavily over precision (missing a real defect that ships to a customer is far worse than a false alarm that gets manually double-checked) — report recall at a fixed, operationally-acceptable false-positive rate, not just overall accuracy or F1.
7. **Deployment consideration:** discuss model size/latency tradeoffs for on-device/edge deployment on a factory floor camera system (model quantization, using a lighter backbone like MobileNet/EfficientNet-lite if inference needs to run on constrained hardware rather than a cloud GPU).

## Evaluation Metrics

Recall at a fixed false-positive-rate budget (primary, given the asymmetric cost of missed defects), ROC-AUC, and a qualitative Grad-CAM review confirming the model attends to the actually-defective regions, not spurious correlations.

## What to Put on Your Resume/Portfolio

"Built a defect classification pipeline (fine-tuned EfficientNet-B0 via transfer learning) achieving 96% recall at a 5% false-positive budget on a held-out test set, with Grad-CAM visualizations confirming the model attends to genuine defect regions, and a discussion of an anomaly-detection alternative framing for previously-unseen defect types."

## Common Follow-Up Interview Questions on This Project

- "You only have 300 labeled defect images — how do you avoid overfitting?" → transfer learning from an ImageNet-pretrained backbone, aggressive but domain-appropriate data augmentation, freezing most of the backbone and only fine-tuning the head/last few layers, and strong regularization (dropout, weight decay).
- "A new type of defect appears that wasn't in your training data at all — what happens, and how would you design around that?" → a supervised classifier will likely misclassify or fail silently on genuinely novel defect types; discuss an anomaly-detection/one-class framing as a complementary safety net, or a human-in-the-loop review queue for low-confidence predictions.
- "How would you verify the model isn't 'cheating' by picking up on some spurious correlation, like lighting differences between the 'good' and 'defect' photo batches?" → Grad-CAM/saliency map inspection to confirm the model attends to the actual object/defect region rather than background/lighting artifacts — a real, well-documented failure mode in small medical/manufacturing imaging datasets.
`,
  },
  {
    slug: 'delivery-eta-prediction',
    title: 'Delivery Time / ETA Prediction',
    difficulty: 'Intermediate',
    domain: 'Regression · Geospatial · Ensemble',
    companyTier: ['Startup', 'Mid-size'],
    tags: ['regression', 'geospatial', 'logistics', 'gradient-boosting'],
    summary: 'Predict accurate delivery/arrival times for food delivery, quick-commerce, or logistics — a hallmark project for Swiggy/Zomato/Ola/Blinkit-style DS interviews.',
    content: `
## Why This Project

ETA prediction is the signature DS project at every Indian logistics/quick-commerce/ride-hailing company (Swiggy, Zomato, Ola, Blinkit, Porter) — it directly touches customer experience and operational efficiency, and interviewers at these companies will specifically look for this kind of project on your resume.

## Dataset

Kaggle has several **food delivery time prediction** datasets (with distance, weather, traffic density, delivery person rating/experience, order preparation time). If unavailable, simulate a realistic dataset with pickup/drop lat-long, order time, weather, and traffic categorical features.

## Step-by-Step Approach

1. **Feature engineering is 80% of this project's value:** haversine distance between restaurant/warehouse and customer, time-of-day and day-of-week (rush hour effects), weather condition, historical average delivery time for that specific route/zone, delivery partner's historical average speed/rating, order complexity (number of items, whether multiple pickups are batched).
2. **Geospatial features done properly:** don't just use raw lat/long as features (a model can't meaningfully use raw coordinates); derive distance, bearing/direction, and zone/cluster identifiers (e.g., cluster delivery addresses into neighborhoods via K-Means or use existing pincode/zone boundaries) as categorical context.
3. **Model choice:** Gradient Boosting (LightGBM/XGBoost) is the practical industry default here — handles the mix of numeric (distance, time) and categorical (weather, zone) features natively and captures non-linear interactions (e.g., distance matters much more during rush hour than off-peak) without manual feature crosses.
4. **Quantile regression, not just a point estimate:** real ETA systems predict a range/percentile (e.g., "80% of deliveries in similar conditions arrive within this window") rather than a single number, because a single wrong point estimate erodes customer trust more than a slightly wide but honest range — train quantile loss models (e.g., predicting the 10th, 50th, 90th percentile) instead of just mean-squared-error regression.
5. **Evaluate with the right metric for the business:** MAE in minutes (directly interpretable — "off by 4 minutes on average") is more actionable to stakeholders than RMSE or R², plus specifically track the **late-delivery rate** (% of orders that arrive later than the promised ETA) since that's the actual customer-facing failure mode, not raw average error.
6. **Handle outliers/edge cases explicitly:** extreme weather events, festival-day traffic spikes, and delivery partner unavailability create genuine long-tail delays that a naive model will underpredict — discuss whether to model these as a separate "surge" flag/multiplier rather than expecting the base model to learn rare events well from limited examples.
7. **Real-time serving discussion:** delivery ETA needs to be predicted the instant an order is placed and potentially updated as the delivery progresses (e.g., partner picked up, in transit) — discuss a staged prediction approach (initial estimate at order time, refined estimate once a delivery partner is assigned, live-updated estimate using real-time GPS trace) rather than a single static prediction.

## Evaluation Metrics

MAE in minutes (primary, business-interpretable), late-delivery rate at the promised ETA, and pinball/quantile loss if using quantile regression for uncertainty-aware ETAs.

## What to Put on Your Resume/Portfolio

"Built an ETA prediction pipeline (LightGBM, quantile regression for P50/P90 estimates) achieving 3.2 minute MAE and reducing the late-delivery rate by an estimated 18% versus a distance-only heuristic baseline, with a staged real-time refinement design (order-time → assignment-time → in-transit estimate)."

## Common Follow-Up Interview Questions on This Project

- "Why would you predict a range instead of a single ETA number?" → communicates honest uncertainty, reduces customer frustration from a single missed point estimate, and quantile/pinball loss directly optimizes for calibrated percentile predictions rather than just the conditional mean.
- "How would you update the ETA in real-time once the delivery is already in progress?" → a staged model architecture using progressively more information (initial order-time features → delivery-partner-assigned features → live GPS-trace-based remaining-distance/speed features), essentially re-scoring with a model appropriate to each stage rather than trying to solve it with one static prediction.
- "A new city launch has almost no historical delivery data — how do you get a reasonable ETA model there on day one?" → transfer/borrow patterns from similar-profile existing cities/zones (population density, road network similarity) as a cold-start prior, falling back to simpler distance/speed heuristics until enough local data accumulates to train a city-specific model.
`,
  },
  {
    slug: 'resume-screening-nlp',
    title: 'Resume Screening & Candidate-Job Matching',
    difficulty: 'Intermediate',
    domain: 'NLP · Semantic Search · Embeddings',
    companyTier: ['Startup', 'Mid-size'],
    tags: ['nlp', 'embeddings', 'semantic-search', 'fairness'],
    summary: 'Match resumes to job descriptions using semantic embeddings rather than brittle keyword matching, with an explicit fairness/bias discussion.',
    content: `
## Why This Project

HR-tech and staffing startups in India (and internal recruiting-tech teams at larger companies) are a growing DS employer segment, and this project is a strong showcase of modern embedding-based semantic search plus a genuinely important fairness discussion, which is exactly the kind of nuance senior interviewers probe for in NLP/hiring-adjacent ML.

## Dataset

Kaggle's **Resume Dataset** combined with a set of scraped/synthetic job descriptions, or generate synthetic resume-job pairs with known ground-truth relevance for evaluation purposes.

## Step-by-Step Approach

1. **Why keyword matching (the naive baseline) fails:** a resume saying "led a team of engineers building customer analytics dashboards" should match a job description asking for "data visualization and team leadership experience" even with zero overlapping keywords — this is exactly the gap semantic embeddings close, and articulating this gap clearly is the crux of the project's pitch.
2. **Baseline: TF-IDF + cosine similarity.** Establish this first, and show concrete failure examples where it misses semantically-equivalent-but-lexically-different phrasing — a good baseline to build the case against.
3. **Embedding-based approach:** encode both resumes and job descriptions using a sentence-embedding model (e.g. Sentence-BERT), then rank candidates by cosine similarity between embeddings — walk through why sentence embeddings capture semantic meaning rather than surface word overlap (trained via a contrastive objective on sentence pairs).
4. **Structured + unstructured signal fusion:** pure semantic similarity on free text isn't enough — combine it with structured features (years of experience, specific required certifications/degrees, location match) in a final ranking/scoring model, since a real ATS (Applicant Tracking System) needs both.
5. **Build actual retrieval infrastructure:** use an approximate nearest neighbor index (FAISS) over resume embeddings so the system can rank thousands of resumes against a new job description in milliseconds — a good chance to demonstrate you understand production-scale semantic search, not just a notebook cosine-similarity calculation.
6. **Bias and fairness — the most important section of this project:** resume screening models are legally and ethically sensitive (proxy discrimination via college name, gaps in employment history that correlate with gender/caregiving, name-based inference of gender/community). Explicitly test whether your matching scores change when you swap demographic-signaling details (names associated with different genders/communities, women's colleges vs. co-ed colleges) while holding actual qualifications constant — a rigorous version of this project runs a counterfactual fairness audit and documents findings, which is a genuinely rare and impressive thing to bring to an interview.
7. **Evaluation:** since "relevance" is somewhat subjective, use human-labeled relevance judgments (even a small hand-labeled validation set of 50-100 resume-job pairs) to compute ranking metrics (NDCG, Precision@K) rather than relying purely on qualitative inspection.

## Evaluation Metrics

NDCG@10 / Precision@5 against a small human-labeled relevance set, plus a fairness audit report (score differences across counterfactual demographic-signal swaps, holding qualifications fixed).

## What to Put on Your Resume/Portfolio

"Built a semantic resume-job matching system (Sentence-BERT embeddings + FAISS retrieval) improving Precision@5 from 0.41 (TF-IDF baseline) to 0.68 against a human-labeled relevance set, including a counterfactual fairness audit that identified and mitigated a name-based scoring disparity."

## Common Follow-Up Interview Questions on This Project

- "How do you know your semantic matching model is actually better, given 'relevance' is subjective?" → human-labeled relevance judgments on a sample set, inter-annotator agreement check, and ranking metrics (NDCG/Precision@K) rather than purely qualitative anecdotes.
- "How would you test whether your model discriminates based on gender or caste-adjacent signals, given India doesn't always collect explicit demographic data?" → counterfactual testing: swap names/college names/other proxy signals while holding actual qualifications fixed, and measure whether the matching score changes — a practical fairness-testing method that doesn't require collecting sensitive demographic data directly.
- "The hiring manager says the model recommended someone the semantic score liked but who's clearly under-qualified on years of experience — what happened?" → pure semantic similarity can be fooled by well-written but under-qualified resumes; this is exactly why structured hard constraints (minimum years of experience, required certifications) need to be fused with or applied as filters alongside the semantic ranking score, not replaced by it.
`,
  },
]
