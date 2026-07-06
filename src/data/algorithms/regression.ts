import type { Algorithm } from '../../types'

export const regressionAlgorithms: Algorithm[] = [
  {
    slug: 'linear-regression',
    name: 'Linear Regression',
    category: 'Supervised · Regression',
    difficulty: 'Beginner',
    tags: ['regression', 'ols', 'foundational', 'statistics'],
    summary: 'Fit a straight-line (hyperplane) relationship between features and a continuous target by minimizing squared error.',
    companyRelevance: 'Asked in almost every entry-level DS interview in India — Flipkart, Swiggy, Amazon, and every analytics-heavy startup use it for pricing, demand and forecasting baselines.',
    content: `
## Intuition

Linear Regression assumes the target $y$ is a weighted sum of the input features plus noise:

$$ y = w_0 + w_1x_1 + w_2x_2 + \\dots + w_nx_n + \\epsilon $$

You are literally drawing the "best" straight line (or hyperplane in higher dimensions) through the data. "Best" means the line that minimizes the total squared vertical distance between the actual points and the line — the **residuals**.

Think of it as a lever-balancing problem: every data point pulls the line toward itself, and the line settles at the position that minimizes total squared pull.

## The Math

**Model:** $\\hat{y} = X w$ where $X$ is the $(n \\times p)$ design matrix (with a column of 1s for the intercept) and $w$ is the weight vector.

**Loss function — Mean Squared Error:**

$$ J(w) = \\frac{1}{2n}\\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2 = \\frac{1}{2n}\\|y - Xw\\|_2^2 $$

**Closed-form solution (Ordinary Least Squares / Normal Equation):**

Taking the gradient of $J(w)$ with respect to $w$ and setting it to zero:

$$ \\nabla_w J = -\\frac{1}{n}X^T(y - Xw) = 0 \\implies X^TXw = X^Ty $$

$$ w^* = (X^TX)^{-1}X^Ty $$

This is exact, but computing $(X^TX)^{-1}$ costs $O(p^3)$ — expensive when the number of features $p$ is large or when $X^TX$ is singular (multicollinearity). That's why in practice we often use **gradient descent** instead:

$$ w := w - \\alpha \\nabla_w J(w) = w - \\alpha \\left(-\\frac{1}{n}X^T(y - Xw)\\right) $$

**Why squared error and not absolute error?** Squared error is differentiable everywhere (absolute error isn't at 0), it penalizes large errors more (useful when big mistakes are worse), and under the assumption of Gaussian noise, minimizing squared error is equivalent to **Maximum Likelihood Estimation**. Absolute error corresponds to a Laplace-noise assumption and gives you the median instead of the mean — that's what Quantile/Robust regression exploits.

## Assumptions (classic OLS interview trap)

1. **Linearity** — the relationship between $X$ and $y$ is linear in parameters.
2. **Independence of errors** — residuals are not autocorrelated (important for time series; check with Durbin-Watson).
3. **Homoscedasticity** — constant variance of residuals across all fitted values (no funnel shape in residual plots).
4. **No multicollinearity** — features aren't highly correlated with each other (check Variance Inflation Factor, VIF > 5-10 is a red flag).
5. **Normality of residuals** — mainly needed for valid confidence intervals / hypothesis tests, not for the point prediction itself.
6. **No (or few) high-leverage outliers** — a single extreme point can massively shift the line since squared error punishes it heavily.

## Evaluating Fit

- **R² (coefficient of determination):** fraction of variance in $y$ explained by the model, $R^2 = 1 - \\frac{SS_{res}}{SS_{tot}}$. Careful: R² never decreases when you add more features, even useless ones.
- **Adjusted R²** penalizes adding features that don't help — always prefer this when comparing models with different numbers of features.
- **RMSE / MAE** for interpretable, same-unit-as-target error.
- Always check the **residual plot** (residuals vs fitted values) — a random cloud around zero is good; a curve means you're missing non-linearity; a funnel means heteroscedasticity.

## Pros & Cons

**Pros:** Extremely interpretable (coefficients = effect size), fast to train and predict, closed-form solution exists, great baseline, works well with limited data, well-understood statistical guarantees (confidence intervals, p-values).

**Cons:** Assumes linear relationship (fails on complex patterns), sensitive to outliers, sensitive to multicollinearity (unstable coefficients), can't capture feature interactions unless you engineer them manually, assumes additive effects.

## Complexity

- Normal equation: $O(np^2 + p^3)$ time, $O(p^2)$ space.
- Gradient descent: $O(np)$ per iteration — better when $p$ is very large or $X^TX$ doesn't fit in memory.

## Where it shows up in real DS work

Baseline model for any regression problem (always fit linear regression first before jumping to XGBoost — if a linear model gets you 90% of the way, you've saved weeks), demand forecasting, pricing elasticity, marketing mix modeling (attributing revenue to ad spend), A/B test analysis (regression adjustment / CUPED), and as the final layer of many deep learning models.

## Common Pitfalls Interviewers Probe

- Not checking multicollinearity before trusting coefficient signs/magnitudes.
- Using R² alone to claim a good model without checking residuals.
- Forgetting that OLS coefficients answer "what changes on average," not causal claims, unless you have a randomized experiment or a causal-inference design (IV, DiD, matching).
- Extrapolating far outside the training data range.
`,
    interviewQA: [
      {
        q: 'Derive the Normal Equation for linear regression from the loss function.',
        a: 'Start with J(w) = (1/2n)||y - Xw||^2. Expand: J(w) = (1/2n)(y^T y - 2w^T X^T y + w^T X^T X w). Take gradient w.r.t. w: ∇J = (1/n)(X^T X w - X^T y). Set to zero: X^T X w = X^T y, so w* = (X^T X)^{-1} X^T y, provided X^T X is invertible (i.e., features are linearly independent and n ≥ p).',
      },
      {
        q: 'What happens to OLS coefficients when two features are perfectly correlated?',
        a: 'X^T X becomes singular (non-invertible) because the columns of X are linearly dependent, so there is no unique solution — infinitely many (w1, w2) combinations give the same predictions. In practice with near (not perfect) collinearity, X^T X is ill-conditioned, coefficients become unstable with huge variance and can flip sign with tiny data changes. Fix with regularization (Ridge), dropping/combining correlated features, or PCA.',
      },
      {
        q: 'Why is R² not enough to judge a regression model?',
        a: 'R² only measures explained variance on the training data and mechanically increases (or stays the same) every time you add a feature, even random noise features — it never penalizes complexity. It also does not tell you if the relationship is actually linear (Anscombe\'s quartet), does not detect heteroscedasticity, and is a poor metric under distribution shift. Use adjusted R², residual diagnostics, out-of-sample RMSE/MAE, and cross-validation instead.',
      },
      {
        q: 'How would you handle heteroscedasticity in residuals?',
        a: 'Options: (1) transform the target, e.g. log(y), which often stabilizes variance for multiplicative processes; (2) use Weighted Least Squares, weighting points inversely proportional to their variance; (3) use heteroscedasticity-robust (White/Huber-White) standard errors if you only care about valid inference, not the point estimates; (4) switch to a model that does not assume constant variance, like quantile regression or a GLM with an appropriate variance function.',
      },
      {
        q: 'Linear regression vs Gradient Descent solution — when would you prefer one over the other?',
        a: 'Normal equation is exact and needs no learning rate or convergence checks, but costs O(p^3) to invert X^T X, which is infeasible for p in the tens of thousands, and it fails outright if X^T X is singular. Gradient descent (or SGD/mini-batch) scales to huge n and p, works with streaming data, and generalizes to problems with no closed form (like logistic regression or neural nets), at the cost of needing to tune the learning rate and check convergence.',
      },
    ],
  },
  {
    slug: 'regularization',
    name: 'Regularization: Ridge, Lasso & Elastic Net',
    category: 'Supervised · Regression',
    difficulty: 'Intermediate',
    tags: ['regression', 'regularization', 'feature-selection', 'bias-variance'],
    summary: 'Add a penalty on coefficient size to reduce overfitting, handle multicollinearity, and (for Lasso) perform automatic feature selection.',
    companyRelevance: 'Core building block for credit risk, pricing, and any model built on wide/correlated tabular data — a favorite whiteboard question at fintech and quant-adjacent DS roles (Razorpay, CRED, PhonePe, hedge funds).',
    content: `
## Why Regularize?

Plain OLS finds the weights that perfectly minimize training error, which means it will happily inflate coefficients to fit noise, especially when features are correlated or when $p$ is large relative to $n$. Regularization adds a penalty term that discourages large weights, trading a little bias for a large reduction in variance — the classic **bias-variance tradeoff**.

## Ridge Regression (L2)

$$ J(w) = \\frac{1}{2n}\\|y - Xw\\|_2^2 + \\lambda \\|w\\|_2^2 $$

Closed form: $w^* = (X^TX + \\lambda I)^{-1}X^Ty$. Adding $\\lambda I$ makes the matrix invertible even when $X^TX$ is singular — this is literally why it's also called **Tikhonov regularization**. Ridge shrinks all coefficients smoothly toward zero but (almost) never sets them exactly to zero.

## Lasso Regression (L1)

$$ J(w) = \\frac{1}{2n}\\|y - Xw\\|_2^2 + \\lambda \\|w\\|_1 $$

No closed form (the L1 term isn't differentiable at 0); solved with coordinate descent or subgradient methods. Because of the diamond-shaped constraint region (vs. Ridge's circular region), Lasso's solution often lands exactly on an axis — driving some coefficients to **exactly zero**. This makes Lasso a built-in feature selector, extremely valuable when you suspect only a handful of features actually matter.

**Geometric intuition:** picture the elliptical contours of the OLS loss and the constraint region ($\\|w\\|_1 \\le t$ for Lasso is a diamond, $\\|w\\|_2 \\le t$ for Ridge is a circle). The optimum is where the loss contour first touches the constraint region. The diamond has corners on the axes, so the loss contour is likely to touch at a corner — a coefficient of exactly zero. The circle has no corners, so it almost never happens.

## Elastic Net

$$ J(w) = \\frac{1}{2n}\\|y - Xw\\|_2^2 + \\lambda \\left(\\alpha \\|w\\|_1 + \\frac{1-\\alpha}{2}\\|w\\|_2^2\\right) $$

Combines both penalties. Solves a known Lasso weakness: when features are highly correlated, Lasso tends to arbitrarily pick just one of them and zero out the rest. Elastic Net's L2 component encourages a "grouping effect," keeping correlated features together (shrinking them similarly) while still allowing sparsity from the L1 term.

## Choosing $\\lambda$ (and $\\alpha$)

Never picked by eye — always via **cross-validation**, typically on a log-spaced grid ($10^{-4}$ to $10^{2}$), tracking validation RMSE/MAE, and picking the $\\lambda$ at the minimum (or the "1-standard-error rule": the simplest model within 1 SE of the best score, to favor a sparser/more regularized model when scores are close).

## Practical Notes

- **Always standardize features first** (zero mean, unit variance). Regularization penalizes raw coefficient magnitude, so a feature measured in lakhs vs. one measured in 0-1 fractions would be penalized wildly unequally otherwise.
- Ridge is preferred when you believe most features carry at least a little signal (dense true coefficient vector).
- Lasso is preferred when you believe the true model is sparse (few features actually matter) — and you want automatic feature selection for interpretability or deployment simplicity.
- Elastic Net is the safe default in high-dimensional, correlated tabular data (genomics-style problems, wide marketing/feature-store data).

## Pros & Cons

**Pros:** Directly fights overfitting, handles multicollinearity, Lasso gives free feature selection, generally improves out-of-sample performance over plain OLS whenever $p$ is not tiny.

**Cons:** Introduces bias (coefficients are shrunk, so they're no longer unbiased estimates — bad if you need causal-style interpretation), adds a hyperparameter to tune, requires feature scaling, Lasso is unstable in the choice of *which* correlated feature it keeps.

## Complexity

Ridge: closed form $O(p^3)$, same as OLS with a shift. Lasso: no closed form; coordinate descent is roughly $O(np)$ per full pass over all features, repeated until convergence.
`,
    interviewQA: [
      {
        q: 'Why does Lasso produce sparse solutions but Ridge does not?',
        a: 'Geometrically, the L1 constraint region is a diamond (cross-polytope) with vertices on the coordinate axes, while the L2 constraint region is a smooth sphere. The unconstrained loss\'s elliptical contours are much more likely to first intersect the diamond exactly at a vertex — where one or more coordinates are zero — than to intersect the smooth, cornerless sphere at an axis-aligned point. Algebraically, the L1 penalty\'s subgradient at zero is a whole interval [-λ, λ], so many coefficients get pushed to and held at exactly zero, whereas the L2 penalty\'s gradient is proportional to w and vanishes as w→0, so it shrinks but never fully zeroes out.',
      },
      {
        q: 'You have 200 features, many highly correlated, and only 500 rows. Which regularizer do you pick and why?',
        a: 'Elastic Net. With p close to n and strong correlation, plain Lasso will arbitrarily select one feature from each correlated group and zero the rest, which is unstable across resamples (bootstrap the data and you might get a totally different feature set). Ridge handles the correlation and multicollinearity well but keeps all 200 features, which hurts interpretability. Elastic Net\'s combination shrinks correlated features together (grouping effect) while still zeroing out the genuinely irrelevant ones.',
      },
      {
        q: 'Do you need to standardize features before regularization? Why?',
        a: 'Yes, always. The penalty term is a function of the raw coefficient values (||w||), so a feature on a larger numeric scale needs a smaller coefficient to have the same effect on predictions, and would therefore be penalized less than an equally important feature on a smaller scale — biasing which features get shrunk. Standardizing to zero mean and unit variance ensures the penalty treats all features fairly. (Note: don\'t regularize the intercept.)',
      },
      {
        q: 'How do you pick lambda properly, and what is the "1-SE rule"?',
        a: 'Use k-fold cross-validation over a log-spaced grid of lambda values, computing mean and standard error of validation error at each lambda. The naive choice is the lambda with minimum mean CV error. The "1-SE rule" instead picks the largest lambda (i.e., simplest/most regularized model) whose mean CV error is still within one standard error of the minimum — this favors parsimony and reduces overfitting to the specific CV folds, at a negligible cost in accuracy.',
      },
      {
        q: 'Is Ridge/Lasso regression a Bayesian method in disguise?',
        a: 'Yes — Ridge regression is exactly the MAP (maximum a posteriori) estimate of w under a Gaussian likelihood for y|X,w and a Gaussian prior N(0, τ²I) on w; the L2 penalty strength λ corresponds to σ²/τ². Lasso is the MAP estimate under a Laplace (double-exponential) prior on w instead of Gaussian, since the Laplace prior has a sharp peak at zero that induces sparsity in the MAP estimate.',
      },
    ],
  },
  {
    slug: 'logistic-regression',
    name: 'Logistic Regression',
    category: 'Supervised · Classification',
    difficulty: 'Beginner',
    tags: ['classification', 'glm', 'foundational', 'probability'],
    summary: 'Model the log-odds of a binary outcome as a linear function of the features, producing calibrated class probabilities.',
    companyRelevance: 'The default first model for churn, fraud, credit default, click-through-rate, and conversion prediction across every Indian fintech and e-commerce company — expect at least one deep question on this in every DS interview.',
    content: `
## Intuition

Linear regression can't be used directly for a 0/1 target — predictions could be negative or above 1, and squared error is the wrong loss for probabilities. Logistic Regression fixes this by modeling the **log-odds** (logit) of the positive class as a linear function of the features, then squashing it into $[0,1]$ with the **sigmoid** function.

$$ \\text{logit}(p) = \\ln\\left(\\frac{p}{1-p}\\right) = w_0 + w_1x_1 + \\dots + w_nx_n = z $$

$$ p = \\sigma(z) = \\frac{1}{1+e^{-z}} $$

This means logistic regression draws a **linear decision boundary** in feature space — the boundary is where $z=0$, i.e. $p=0.5$.

## Why not use squared error here?

If you plug the sigmoid into squared error, the loss surface becomes **non-convex** in $w$ — gradient descent can get stuck in local minima. Instead we use **Maximum Likelihood Estimation**, which for Bernoulli-distributed labels gives the **log-loss / binary cross-entropy**:

$$ J(w) = -\\frac{1}{n}\\sum_{i=1}^n \\Big[ y_i \\ln(\\hat{p}_i) + (1-y_i)\\ln(1-\\hat{p}_i) \\Big] $$

This loss is convex in $w$, guaranteeing gradient descent converges to the global optimum. It also heavily penalizes confident-and-wrong predictions ($y=1$, $\\hat{p}\\to 0$ sends loss $\\to \\infty$), which is exactly the calibrated-probability behavior you want.

**Gradient (elegant result):** $\\nabla_w J = \\frac{1}{n}X^T(\\hat{p} - y)$ — structurally identical to linear regression's gradient, just with $\\hat{p}=\\sigma(Xw)$ instead of $Xw$. No closed form exists (sigmoid is nonlinear), so it's solved with gradient descent, Newton's method / IRLS (Iteratively Reweighted Least Squares), or L-BFGS.

## Decision Threshold Is a Choice, Not a Given

The model outputs a probability; you choose the cutoff (default 0.5) based on business cost. In fraud detection where false negatives (missed fraud) are far costlier than false positives, you lower the threshold. Always tie the threshold decision to the **cost matrix**, and look at the full **precision-recall curve** and **ROC curve**, not just accuracy at 0.5.

## Multiclass: Softmax Regression

For $K>2$ classes, generalize to **softmax regression** (multinomial logistic regression):

$$ p(y=k \\mid x) = \\frac{e^{w_k^Tx}}{\\sum_{j=1}^{K} e^{w_j^Tx}} $$

with **categorical cross-entropy** loss. This is exactly the final layer used in almost every neural network classifier.

## Regularization

Just like linear regression, add L2 (default in sklearn, called Ridge-logistic) or L1 penalty to the log-loss to prevent overfitting and enable feature selection, especially important with many sparse features (e.g. one-hot encoded categorical data, text features).

## Assumptions

1. Linear relationship between the **log-odds** and the features (not between raw features and probability — a common misunderstanding).
2. Observations are independent.
3. Little/no multicollinearity among features.
4. Large enough sample size — rule of thumb, at least 10 events of the minority class per predictor.
5. No perfect separation (if a feature perfectly separates classes, coefficients diverge to infinity — sklearn's regularization saves you here).

## Pros & Cons

**Pros:** Outputs calibrated probabilities (unlike SVM/trees by default), highly interpretable via odds ratios ($e^{w_i}$ = multiplicative change in odds per unit increase in $x_i$), fast, low variance, works well even with modest data, natural baseline for any binary classification task.

**Cons:** Linear decision boundary only (can't capture interactions/non-linearities unless you engineer them), sensitive to outliers and multicollinearity, struggles with highly imbalanced classes without adjustment (class weights, resampling, threshold tuning).

## Complexity

Training with gradient-based solvers: roughly $O(np)$ per iteration, converges in a handful to a few hundred iterations depending on solver/conditioning. Prediction: $O(p)$ per sample — extremely fast, a reason it's still used in production for latency-critical services (real-time bidding, fraud scoring) even when a fancier model exists offline.
`,
    interviewQA: [
      {
        q: 'Why do we use log-loss instead of MSE for logistic regression?',
        a: 'Plugging the sigmoid function into MSE produces a non-convex loss surface in w with multiple local minima, so gradient descent isn\'t guaranteed to find the global optimum. Log-loss (binary cross-entropy) comes from the Bernoulli likelihood and is convex in w for logistic regression, guaranteeing convergence to a global minimum with gradient-based methods. It also has better gradient properties — it penalizes confident wrong predictions much more sharply, which is exactly what you want probability estimates to do.',
      },
      {
        q: 'Interpret a coefficient of 0.7 for a feature in logistic regression.',
        a: 'The coefficient is on the log-odds scale. e^0.7 ≈ 2.01, meaning a one-unit increase in that feature multiplies the odds of the positive class by about 2, holding other features constant — i.e., the odds roughly double. It is not a 0.7 increase in probability; the effect on raw probability depends on where you are on the sigmoid curve (biggest near p=0.5, smallest near the extremes).',
      },
      {
        q: 'How does logistic regression handle class imbalance, and what would you do about it?',
        a: 'By default it optimizes overall log-loss/accuracy, so with 99:1 imbalance it can get very low loss by mostly predicting the majority class, and the decision boundary threshold of 0.5 becomes meaningless. Fixes: class_weight="balanced" (reweights the loss so minority-class errors cost more), resampling (SMOTE/undersampling), or better — leave weighting alone and instead pick an appropriate operating threshold using the precision-recall curve, and evaluate with PR-AUC / F1 / recall-at-precision rather than accuracy.',
      },
      {
        q: 'What happens if two classes are perfectly linearly separable?',
        a: 'The maximum likelihood solution is unbounded — the optimizer can push ||w|| to infinity and still keep decreasing the loss, because pushing predicted probabilities to exactly 0 or 1 for the separating boundary always reduces log-loss further. In practice, without regularization, gradient descent won\'t converge (weights blow up) or will hit iteration limits with huge coefficients. L2 regularization fixes this by penalizing large weights, giving a finite, well-behaved solution.',
      },
      {
        q: 'Logistic regression vs. a single-layer neural network with sigmoid output — what is the actual difference?',
        a: 'They are mathematically identical when the neural network has zero hidden layers: a linear transform followed by a sigmoid, trained with cross-entropy loss. The real difference appears once you add hidden layers — neural nets can then learn non-linear feature interactions and representations automatically, while logistic regression needs those interactions to be manually engineered (e.g., polynomial/interaction terms) since it is restricted to a linear decision boundary in the original feature space.',
      },
    ],
  },
]
