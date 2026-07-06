import type { InterviewTopic } from '../../types'

export const quantTopics: InterviewTopic[] = [
  {
    slug: 'statistics-probability',
    title: 'Statistics & Probability for Data Science',
    description: 'The single highest-yield interview prep area — hypothesis testing, distributions, Bayes\' theorem, and the probability puzzles asked at every level.',
    content: `
## Why This Section Matters Most

Across hundreds of Indian DS interview loops — startup, mid-size, and big tech alike — statistics and probability questions appear more consistently than any specific ML algorithm. They test whether you actually understand uncertainty and inference, versus just knowing how to call \`.fit()\`. Treat this as non-negotiable prep.

## Core Probability

**Bayes' Theorem** — appears constantly, both directly and disguised inside "medical test" or "spam filter" word problems:

$$ P(A\\mid B) = \\frac{P(B\\mid A)P(A)}{P(B)} $$

**Classic worked example (memorize the reasoning, not just the answer):** A disease affects 1% of a population. A test is 99% sensitive (true positive rate) and 95% specific (true negative rate, so 5% false positive rate). Given a positive test, what's the probability of actually having the disease?

$$ P(D\\mid +) = \\frac{P(+\\mid D)P(D)}{P(+\\mid D)P(D) + P(+\\mid \\lnot D)P(\\lnot D)} = \\frac{0.99 \\times 0.01}{0.99\\times 0.01 + 0.05\\times 0.99} \\approx 0.167 $$

**The lesson interviewers want you to say out loud:** even with a seemingly great 99%-sensitive/95%-specific test, if the base rate (prior) is low, most positive results are still false positives. This "base rate fallacy" intuition is exactly why you always ask about prior/base rate before trusting any classifier's precision at face value — a direct bridge to precision/recall discussions in ML interviews.

**Conditional independence vs. independence:** $P(A,B)=P(A)P(B)$ is independence; $P(A,B\\mid C) = P(A\\mid C)P(B\\mid C)$ is conditional independence — these are different and one doesn't imply the other. Naive Bayes relies on conditional independence given the class, not full independence.

## Distributions You Must Know Cold

- **Bernoulli/Binomial** — number of successes in $n$ independent trials, $P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k}$. Mean $np$, variance $np(1-p)$.
- **Poisson** — count of events in a fixed interval given a constant rate $\\lambda$, $P(X=k)=\\frac{\\lambda^ke^{-\\lambda}}{k!}$. Mean = variance = $\\lambda$ (a distinctive property — if your count data's variance is much bigger than its mean, that's "overdispersion" and Poisson is the wrong model; use Negative Binomial instead — this specific follow-up is a common senior-level trap question).
- **Normal/Gaussian** — the Central Limit Theorem is why it shows up everywhere: the sum/average of many independent random variables (regardless of their own distribution) approaches Normal as $n$ grows. This is *why* so many statistical tests assume normality of sample means even when the underlying data isn't Gaussian.
- **Exponential** — time between events in a Poisson process; the unique **memoryless** continuous distribution ($P(X>s+t \\mid X>s) = P(X>t)$) — a favorite "prove this property" question.
- **Uniform, Geometric** — simpler but still fair game, especially in probability puzzle questions.

## Hypothesis Testing — Understand the Machinery, Not Just p<0.05

1. State $H_0$ (null, e.g. "no difference between groups") and $H_1$ (alternative).
2. Choose a significance level $\\alpha$ (typically 0.05) **before** looking at the data.
3. Compute a test statistic and its p-value: the probability of observing data this extreme (or more) *if $H_0$ were true*.
4. If $p < \\alpha$, reject $H_0$.

**The p-value misinterpretation trap (interviewers love probing this):** a p-value is NOT the probability that $H_0$ is true, and it is NOT the probability your result is due to chance. It is: "assuming $H_0$ is true, the probability of seeing data at least this extreme." Confusing these is the most common statistics mistake even among working data scientists — explicitly stating the correct definition unprompted is a strong signal.

**Type I vs Type II errors:** Type I ($\\alpha$) = false positive, rejecting a true $H_0$. Type II ($\\beta$) = false negative, failing to reject a false $H_0$. **Power** $=1-\\beta$ = probability of correctly detecting a real effect. Increasing sample size increases power (reduces Type II error) without changing $\\alpha$.

**t-test vs z-test:** use t-test when population variance is unknown and estimated from the sample (almost always true in practice) — the t-distribution has fatter tails to account for the extra uncertainty from estimating variance, converging to the normal distribution as $n$ grows.

**Chi-square test:** for categorical data — testing independence between two categorical variables (contingency table) or goodness-of-fit to an expected distribution. Used for the Sample Ratio Mismatch check in A/B testing.

## Confidence Intervals

A 95% CI means: if you repeated the sampling process many times and built a CI each time using the same method, 95% of those intervals would contain the true parameter — it does **not** mean "95% probability the true value lies in this specific interval" (the true value is fixed, not random; the interval is the random quantity across repeated sampling) — another classic interview trap.

## Correlation vs. Causation, and Confounders

Classic example: ice cream sales and drowning deaths are correlated (confounder: summer heat drives both). Always be ready to name the three requirements for causal claims: (1) correlation, (2) correct temporal ordering (cause precedes effect), (3) no plausible confounding — the third being where nearly all observational-data causal claims fail without a proper causal-inference design (randomized experiment, instrumental variables, difference-in-differences, regression discontinuity, or careful matching/adjustment for confounders).

## Common Probability Puzzle Questions (practice these out loud)

- **Monty Hall problem:** switching doors gives 2/3 win probability vs. 1/3 for staying — the host's knowledge (they always reveal a goat, never the prize) is what breaks the naive "50/50" intuition.
- **Two children problem variants:** "I have two children, at least one is a boy" vs "the elder child is a boy" give *different* answers (1/3 vs 1/2) — a great test of careful conditioning on the exact information given.
- **Expected number of trials until first success** (Geometric distribution): $E[X] = 1/p$.
- **Birthday paradox:** with just 23 people, there's a >50% chance two share a birthday — driven by the number of *pairs* growing quadratically ($\\binom{23}{2}=253$ pairs), not linearly with people.

## Statistical Concepts Specific to ML

- **Bias-variance tradeoff** (expected test error decomposes into $\\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Error}$) — the single most-referenced statistical framework across ML interviews; be able to place every regularization/model-complexity technique you know onto this tradeoff.
- **Maximum Likelihood Estimation (MLE)** — most loss functions in ML (squared error, cross-entropy) are derived from MLE under a specific noise/distribution assumption (Gaussian noise → squared error; Bernoulli labels → cross-entropy) — knowing this connects "loss function" to "distributional assumption," a favorite Advanced-level question.
- **Central Limit Theorem in practice** — justifies why bootstrap confidence intervals and z-tests on sample means work reasonably even when raw data isn't normal, provided sample size is large enough.
`,
  },
  {
    slug: 'sql-for-data-science',
    title: 'SQL for Data Science Interviews',
    description: 'Window functions, joins, and query optimization — the practical skill tested in nearly every DS interview via a live coding round.',
    content: `
## Why SQL Still Decides Interviews

Almost every Indian DS interview loop (startup through big tech) includes a live SQL round, often the very first technical filter — because it's the fastest way to separate candidates who can actually manipulate data from those who only know modeling theory. Weak SQL sinks otherwise strong ML candidates constantly; this is disproportionately high-leverage prep.

## Joins — Know Exactly What Each Returns

- **INNER JOIN:** only rows with matches in both tables.
- **LEFT JOIN:** all rows from the left table, matched rows from right (NULL where no match) — the most commonly needed join in real analytics ("all customers, and their orders if any").
- **RIGHT JOIN / FULL OUTER JOIN:** less common in practice; FULL OUTER is useful for reconciliation queries (find rows present in one table but not the other, or vice versa).
- **SELF JOIN:** joining a table to itself, common for hierarchical data (manager-employee) or sequential comparisons (this row vs. the previous row for the same entity, though window functions usually handle this better now).
- **The classic gotcha:** joining on a column with duplicate values on both sides silently creates a cartesian-product-like row explosion — always sanity check row counts after a join, especially before aggregating (a duplicated join can silently double-count a SUM).

## Window Functions — The Highest-Leverage SQL Topic to Master

Window functions compute a value across a set of rows related to the current row, **without collapsing rows** the way GROUP BY does — this distinction alone is worth understanding deeply, since it's the #1 thing that separates intermediate from advanced SQL candidates.

\`\`\`sql
SELECT
  customer_id,
  order_date,
  amount,
  ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS order_seq,
  SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS running_total,
  LAG(amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_order_amount,
  AVG(amount) OVER (PARTITION BY customer_id ORDER BY order_date
                     ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_3_avg
FROM orders;
\`\`\`

- **ROW_NUMBER() vs RANK() vs DENSE_RANK():** ROW_NUMBER always gives unique sequential numbers even for ties; RANK gives the same rank to ties but then skips numbers (1,1,3); DENSE_RANK gives the same rank to ties without skipping (1,1,2). A very common interview question: "find the 2nd highest salary per department" — get this wrong by not thinking through tie behavior and it's an instant red flag.
- **LAG/LEAD:** access a prior/following row's value without a self-join — essential for period-over-period comparisons (this month vs. last month).
- **Running totals / rolling windows:** the ROWS BETWEEN clause defines the exact window frame — a common follow-up is explaining the difference between ROWS (physical row count) and RANGE (logical value-based window, treats ties differently).

## Classic Interview Query Patterns (practice writing these from memory)

1. **Nth highest value per group:** use DENSE_RANK() in a subquery, filter WHERE rank = N — don't reach for a nested MAX/NOT IN subquery, it's fragile and interviewers will ask you to generalize to Nth which breaks that approach.
2. **Find duplicate rows:** GROUP BY the columns that define "duplicate," HAVING COUNT(*) > 1.
3. **Running/cumulative user retention or "users active in month M and M+1":** self-join on user_id with a date offset condition, or use LAG to compare consecutive activity periods.
4. **Gaps and islands (find consecutive date ranges):** a classic pattern — subtract a ROW_NUMBER() from the date to create a constant "group key" for consecutive dates, then GROUP BY that key to find island boundaries. This exact trick comes up in streak-detection questions ("find users with a 7-day login streak").
5. **Cohort analysis:** GROUP BY signup_month, then join against activity data to compute retention rate by (cohort_month, months_since_signup) — practice writing this end to end, it's an extremely common case-study-style SQL question at consumer startups.

## Query Optimization Basics (asked more at mid/senior levels)

- **Indexes:** speed up WHERE/JOIN/ORDER BY on indexed columns at the cost of slower writes and extra storage — know that a composite index's column order matters (an index on (a,b) helps queries filtering on a, or a+b, but not on b alone).
- **EXPLAIN / query plans:** understand at a conceptual level that the database chooses a join strategy (nested loop, hash join, merge join) and an index usage plan — be ready to explain why a query might be slow (e.g., a function applied to an indexed column in the WHERE clause, like \`WHERE YEAR(order_date)=2024\`, prevents index usage — rewrite as a range condition instead).
- **Avoid SELECT \\*** in production queries — pulls unnecessary columns, hurts performance and maintainability.
- **CTEs (WITH clauses)** vs. subqueries: mainly a readability/maintainability choice in most modern engines (query planners usually optimize both similarly today), but recursive CTEs are uniquely useful for hierarchical/graph traversal queries (e.g., organizational charts).

## What "SQL for Data Science" Means Beyond Basic Querying

Be ready to translate a business/product question into a query completely unprompted — "what's our week-over-week active user retention by acquisition channel" is a prompt, not a query; part of what's being tested is whether you can decompose an ambiguous business ask into the right joins/aggregations/window functions yourself, the same skill tested in case-study rounds.
`,
  },
  {
    slug: 'python-pandas-coding',
    title: 'Python & Pandas Coding Round Prep',
    description: 'The data manipulation, algorithmic thinking, and pandas idioms tested in take-home assignments and live coding rounds.',
    content: `
## What Gets Tested

DS coding rounds in India typically blend three things: (1) general Python/algorithmic questions (similar to easy-medium LeetCode, but usually more data-flavored), (2) pandas-specific data manipulation tasks, and (3) "implement this ML concept from scratch" questions (see each algorithm's Code Lab on this site for exactly that). Startups lean more heavily on (2) and (3); big tech often blends in more of (1).

## Pandas Fundamentals You Must Be Fluent In

\`\`\`python
import pandas as pd

# groupby + multiple aggregations
df.groupby('category').agg(
    total_sales=('amount', 'sum'),
    avg_order=('amount', 'mean'),
    n_orders=('order_id', 'count')
)

# pivot for wide-format reshaping
df.pivot_table(index='customer_id', columns='month', values='amount', aggfunc='sum', fill_value=0)

# melt for long-format reshaping (inverse of pivot)
df.melt(id_vars='customer_id', var_name='month', value_name='amount')

# merge (equivalent to SQL joins)
pd.merge(orders, customers, on='customer_id', how='left')

# vectorized operations instead of row-wise apply (much faster)
df['discounted_price'] = df['price'] * (1 - df['discount_pct'])

# window-function equivalents
df['running_total'] = df.groupby('customer_id')['amount'].cumsum()
df['prev_amount'] = df.groupby('customer_id')['amount'].shift(1)
df['rolling_avg_3'] = df.groupby('customer_id')['amount'].transform(lambda x: x.rolling(3).mean())
\`\`\`

**The single biggest performance mistake candidates make:** using \`df.apply(lambda row: ..., axis=1)\` for something that has a vectorized equivalent. Row-wise apply is implemented as a Python-level loop under the hood and can be 10-100x slower than a vectorized pandas/numpy operation on large data — always ask yourself "is there a vectorized way to do this" before reaching for apply, and be ready to explain *why* vectorization is faster (numpy operations are implemented in compiled C and operate on contiguous memory, avoiding per-element Python interpreter overhead).

## Handling Missing Data — Always Discuss the Mechanism, Not Just the Method

- \`df.isnull().sum()\` to audit; \`df.dropna()\` vs. \`df.fillna()\` — but the real interview signal is discussing **why** the data is missing: **MCAR** (Missing Completely At Random — safe to drop/impute simply), **MAR** (Missing At Random, conditional on other observed variables — e.g. income missing more often for self-employed people, but predictable from other features, so model-based imputation works well), **MNAR** (Missing Not At Random — the missingness itself depends on the unobserved value, e.g. people with very high income refusing to disclose it — this is the dangerous case where naive imputation introduces bias, since the very fact of being missing is informative).

## Common Python/Data-Structure Questions Asked in DS Rounds

- Reverse a string/list, check palindrome, find duplicates in a list (using a set for $O(n)$ vs. nested loops for $O(n^2)$) — always state the time/space complexity of your solution unprompted.
- Word frequency counter (Counter from collections, or a manual dict) — often extended into "find the top K most frequent words," testing whether you reach for \`heapq.nlargest\` (efficient) vs. sorting the entire list (works but less efficient for large data with small K).
- Two-sum style problems using a hash map for $O(n)$ instead of nested loops for $O(n^2)$ — the classic "trade space for time" pattern that comes up constantly in data-processing contexts too (e.g., deduplication, join-like lookups without a database).
- Generators/yield for memory-efficient processing of large files ("how would you process a 50GB CSV that doesn't fit in memory?" → chunked reading with \`pd.read_csv(..., chunksize=...)\`, or a generator-based line-by-line processor, rather than loading everything into memory at once).
- Basic OOP: be ready to write a simple class (e.g., implement a basic LRU cache using OrderedDict, or a simple custom transformer class with fit/transform methods mimicking sklearn's API) — tests whether you can write more than notebook-style throwaway scripts.

## Practical Data Cleaning Patterns

\`\`\`python
# detect and cap outliers using IQR
Q1, Q3 = df['amount'].quantile([0.25, 0.75])
IQR = Q3 - Q1
lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
df['amount_capped'] = df['amount'].clip(lower, upper)

# memory-efficient dtype downcasting for large datasets
df['category_col'] = df['category_col'].astype('category')
df['int_col'] = pd.to_numeric(df['int_col'], downcast='integer')
\`\`\`

## What Distinguishes a Strong Answer From a Passable One

Passable: code that produces the correct output. Strong: code that also (a) states time/space complexity unprompted, (b) handles the obvious edge cases (empty input, duplicate keys, NaNs) without being asked, (c) is vectorized/idiomatic rather than a literal loop translation from another language, and (d) briefly explains the tradeoff of the chosen approach versus an alternative ("I used a hash map for O(n) lookup, trading O(n) extra space").
`,
  },
]
