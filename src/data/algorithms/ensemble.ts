import type { Algorithm } from '../../types'

export const ensembleAlgorithms: Algorithm[] = [
  {
    slug: 'random-forest',
    name: 'Random Forest (Bagging)',
    category: 'Ensemble',
    difficulty: 'Intermediate',
    tags: ['ensemble', 'bagging', 'trees', 'variance-reduction'],
    summary: 'Train many decision trees on bootstrapped samples and random feature subsets, then average their predictions to cut variance.',
    companyRelevance: 'One of the most-deployed algorithms in Indian fintech/insurance for credit scoring and fraud, and a near-guaranteed "explain bagging vs boosting" interview question.',
    content: `
## Intuition

A single decision tree overfits easily (low bias, high variance). Random Forest's core idea: if you train many trees that each make somewhat different, roughly uncorrelated mistakes, and then average their predictions, the errors cancel out — variance drops dramatically while bias stays roughly the same as a single tree. This is the **Bagging** (Bootstrap Aggregating) principle, and Random Forest adds one more trick on top of plain bagging to make trees even more decorrelated.

## Two Sources of Randomness

1. **Bootstrap sampling (row randomness):** each tree is trained on a random sample of $n$ rows drawn *with replacement* from the training set. On average, about $1 - 1/e \\approx 63.2\\%$ of unique rows appear in any given bootstrap sample — the remaining ~36.8% are called **out-of-bag (OOB)** samples for that tree.
2. **Random feature subsets (column randomness):** at *every split* in every tree, only a random subset of \`max_features\` (commonly $\\sqrt{p}$ for classification, $p/3$ for regression) is considered, rather than all $p$ features. This is the key difference from plain bagged trees — it deliberately decorrelates the trees. Without it, if one feature is very strong, every tree would keep splitting on it near the root, making all trees highly correlated and reducing the variance-cancelling benefit of averaging.

## Why Averaging Reduces Variance — the math

If you average $B$ i.i.d. random variables each with variance $\\sigma^2$, the variance of the average is $\\sigma^2/B$. But trees aren't independent — they're trained on overlapping bootstrap samples of the same data, so they're correlated with pairwise correlation $\\rho$. The variance of the average of $B$ correlated predictors is:

$$ \\text{Var}(\\bar{f}) = \\rho\\sigma^2 + \\frac{1-\\rho}{B}\\sigma^2 $$

As $B \\to \\infty$, the second term vanishes but the first term, $\\rho\\sigma^2$, remains — this is exactly why decorrelating trees (via random feature subsets) matters: it's the lever that reduces $\\rho$, and lowering $\\rho$ directly lowers the irreducible floor of the ensemble's variance, whereas simply adding more trees ($B$) alone hits diminishing returns.

## Out-of-Bag (OOB) Error — free validation

Since each tree only sees ~63% of the rows, you can evaluate each training row using only the trees that *didn't* see it during training, giving an unbiased estimate of test error without needing a separate holdout set or cross-validation — essentially free validation that comes from the bagging procedure itself.

## Prediction

Classification: majority vote across all $B$ trees (or average predicted probabilities, then threshold). Regression: average of all $B$ trees' predictions.

## Feature Importance

Two common approaches: (1) **Mean Decrease in Impurity (MDI)** — average impurity reduction from splits on that feature across all trees (fast but biased toward high-cardinality features); (2) **Permutation Importance** — shuffle one feature's values in the OOB samples and measure how much performance drops; more reliable but more expensive to compute.

## Key Hyperparameters

- **n_estimators** — number of trees. More is (almost) always better or neutral for generalization (it doesn't overfit by adding trees, unlike boosting), just costs more compute — track OOB/validation error vs. n_estimators to find the point of diminishing returns.
- **max_depth / min_samples_leaf** — controls individual tree complexity; still matters since very deep trees increase per-tree variance even before averaging.
- **max_features** — controls decorrelation; lower values decorrelate trees more (potentially higher bias, lower ensemble variance).

## Pros & Cons

**Pros:** Strong out-of-the-box performance with minimal tuning, resistant to overfitting relative to a single tree, handles non-linearities and interactions natively, provides free OOB validation and feature importance, robust to outliers and missing data, parallelizable (trees are independent — train them all at once).

**Cons:** Less interpretable than a single tree (though still more than boosting/deep nets), can be memory-heavy (storing hundreds of trees), typically underperforms well-tuned gradient boosting on structured/tabular data, prediction is slower than a single tree or a linear model (must query every tree), doesn't extrapolate beyond training data range.

## Complexity

Training: $O(B \\cdot n\\log n \\cdot \\sqrt{p})$ roughly, but trivially parallelizable across the $B$ trees since they're independent. Prediction: $O(B \\log n)$ — query every tree.
`,
    interviewQA: [
      {
        q: 'Bagging vs Random Forest — what exactly is the difference?',
        a: 'Plain bagging trains each tree on a bootstrap sample of the rows but considers all p features at every split. Random Forest adds a second, independent source of randomness: at each split, only a random subset of features (typically √p for classification) is even considered as candidates. This extra feature-subsampling step deliberately decorrelates the trees — without it, a single dominant feature would cause most trees to make very similar top-level splits, keeping the trees highly correlated and limiting how much variance the ensemble can cancel out by averaging.',
      },
      {
        q: 'Derive why decorrelating trees helps, using the variance-of-average formula.',
        a: 'For B trees each with prediction variance σ² and average pairwise correlation ρ, the variance of their average is ρσ² + (1-ρ)σ²/B. As B grows large, the second term → 0, but the first term ρσ² remains as a floor — it does not shrink no matter how many trees you add. So the only way to push the ensemble\'s variance below that floor is to reduce ρ, i.e., make the trees less correlated with each other; that is precisely what random feature subsampling at each split accomplishes, which is why Random Forest usually generalizes better than plain bagging with an unlimited number of trees.',
      },
      {
        q: 'What is out-of-bag (OOB) error and why is it nearly free to compute?',
        a: 'Each tree is trained on a bootstrap sample that includes roughly 63.2% of the unique rows (sampling n times with replacement from n rows); the remaining ~36.8% of rows are "out-of-bag" for that tree. For any given training row, you can average predictions only from the subset of trees that did not see that row during training, giving an honest, unbiased estimate of test performance. It costs no extra computation beyond training the forest itself and needs no separate train/validation split, making it a convenient stand-in for cross-validation.',
      },
      {
        q: 'Does adding more trees to a Random Forest cause it to overfit?',
        a: 'No — each additional tree is trained independently on its own bootstrap sample and simply gets averaged into the ensemble, so more trees only reduce the variance term (1-ρ)σ²/B, converging toward the ρσ² floor; it does not add bias or start memorizing the training data further, unlike adding more boosting rounds, which directly fits residuals and can eventually overfit. In practice, past a certain n_estimators, validation error plateaus and adding more trees just costs compute/memory without meaningfully changing predictions.',
      },
      {
        q: 'When would you prefer Random Forest over Gradient Boosting, and vice versa?',
        a: 'Prefer Random Forest when you want a robust, low-maintenance baseline that resists overfitting with minimal hyperparameter tuning, when training needs to be parallelized/fast (trees are independent), or when you specifically want OOB error / permutation importance. Prefer Gradient Boosting when squeezing out maximum predictive accuracy matters most (it usually beats Random Forest on tabular data when properly tuned with early stopping and learning-rate/depth tuning), accepting that it is more sensitive to hyperparameters, more prone to overfitting if under-regularized, and trains sequentially so it is harder to parallelize across boosting rounds.',
      },
    ],
  },
  {
    slug: 'gradient-boosting',
    name: 'Gradient Boosting & XGBoost / LightGBM / CatBoost',
    category: 'Ensemble',
    difficulty: 'Advanced',
    tags: ['ensemble', 'boosting', 'trees', 'production-ml'],
    summary: 'Build trees sequentially, each one fitting the residual errors of the ensemble so far — the single most-used family of models on real-world tabular data.',
    companyRelevance: 'The default winning approach on almost every tabular Kaggle competition and the backbone of production risk, ranking, and pricing models across Indian fintech, e-commerce and ad-tech (Flipkart, Myntra, Paytm, Ola). Expect deep questions on this at every mid-to-senior DS interview.',
    content: `
## Intuition

Where Random Forest builds independent trees in parallel and averages them (variance reduction), Boosting builds trees **sequentially**, where each new tree specifically targets the mistakes the ensemble has made *so far* (bias reduction). Think of it as a team where each new member's entire job is to fix what the current team is still getting wrong.

## Gradient Boosting as Gradient Descent in Function Space

Formally, we're building an additive model $F_M(x) = \\sum_{m=1}^{M}\\gamma_m h_m(x)$ where each $h_m$ is a weak learner (typically a shallow tree). At each stage $m$, instead of computing an analytical gradient with respect to parameters, we compute the **negative gradient of the loss with respect to the current predictions** — the "**pseudo-residuals**":

$$ r_{im} = -\\left[\\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)}\\right]_{F=F_{m-1}} $$

For squared-error loss, this pseudo-residual is simply $y_i - F_{m-1}(x_i)$ — literally the residual, which is why the intuitive "fit a tree to the residuals, repeat" explanation is exactly right for regression. We then fit a new tree $h_m$ to predict these pseudo-residuals, and update:

$$ F_m(x) = F_{m-1}(x) + \\eta \\cdot h_m(x) $$

where $\\eta$ (the **learning rate / shrinkage**) is typically small (0.01–0.3) — each tree only nudges the prediction a little, which acts as regularization: many small, careful steps generalize better than a few large ones (directly analogous to why a small learning rate helps gradient descent avoid overshooting).

## Regularization in Modern GBMs

XGBoost's objective explicitly adds a regularization term penalizing tree complexity:

$$ Obj = \\sum_i L(y_i, \\hat{y}_i) + \\sum_m \\left(\\gamma T_m + \\frac{1}{2}\\lambda \\|w_m\\|^2\\right) $$

where $T_m$ is the number of leaves in tree $m$ and $w_m$ are the leaf weights — this directly penalizes both having too many leaves and having leaves with extreme values, which is a big part of why XGBoost tends to generalize better than naive gradient boosting.

## Key Hyperparameters (the ones interviewers actually probe)

- **learning_rate (η)** and **n_estimators** are tightly coupled: lower learning rate needs more trees to reach the same fit — always tune them together, and use **early stopping** on a validation set rather than guessing n_estimators.
- **max_depth** — GBM trees are usually shallow (3–8 levels) since boosting itself adds complexity across rounds; deep trees here overfit fast.
- **subsample / colsample_bytree** — stochastic gradient boosting: train each tree on a row/column subsample, adding a bagging-style regularization on top of boosting.
- **min_child_weight / min_samples_leaf, reg_alpha (L1), reg_lambda (L2)** — direct overfitting controls.

## XGBoost vs LightGBM vs CatBoost — the practical differences

- **XGBoost:** level-wise tree growth (grows all nodes at a given depth before going deeper), histogram-based split finding, strong regularization, the most battle-tested/production-proven of the three.
- **LightGBM:** leaf-wise growth (always splits the leaf with the highest loss reduction, regardless of depth) — faster and often more accurate on large datasets, but more prone to overfitting on small data if unconstrained (\`num_leaves\` needs care). Uses histogram binning + Gradient-based One-Side Sampling (GOSS) and Exclusive Feature Bundling (EFB) for speed on high-dimensional sparse data.
- **CatBoost:** built specifically to handle categorical features natively and well (via ordered target statistics that avoid target leakage), uses symmetric/oblivious trees, and tends to need less hyperparameter tuning out of the box — a strong choice when you have many high-cardinality categorical columns and limited time to tune.

## Handling Class Imbalance in GBMs

\`scale_pos_weight\` (XGBoost) or \`class_weight\` reweights the loss; also consider focal loss variants, or simply picking the right evaluation metric (PR-AUC, F1) and decision threshold rather than fighting the imbalance during training at all.

## Pros & Cons

**Pros:** State-of-the-art accuracy on tabular/structured data, handles mixed feature types and non-linear interactions natively, built-in regularization, native handling of missing values (learns the best default direction for missing values at each split), extensive tooling (SHAP feature attributions integrate cleanly).

**Cons:** More hyperparameters and more sensitive to them than Random Forest, sequential training is harder to parallelize (though modern implementations parallelize within-tree computation), can overfit if learning rate/depth/estimators aren't controlled with early stopping, less interpretable without extra tooling (SHAP/feature importance), can be slower to train than Random Forest on very large data without careful tuning of histogram/bin parameters.

## Complexity

Roughly $O(M \\cdot n \\cdot p \\cdot \\log n)$ for $M$ boosting rounds with histogram-based split finding (much faster in practice than the naive $O(n\\log n)$ per feature per split, since features are pre-binned once). Prediction: $O(M \\log(\\text{depth}))$ — sum predictions from all $M$ trees, sequential so latency scales with the number of trees.
`,
    interviewQA: [
      {
        q: 'Walk through exactly what happens in one iteration of gradient boosting for a regression problem with squared-error loss.',
        a: 'Given the current ensemble prediction F_{m-1}(x), compute the pseudo-residual for every training point as the negative gradient of the loss w.r.t. the current prediction — for squared error this is simply r_i = y_i - F_{m-1}(x_i), the ordinary residual. Fit a new regression tree h_m to predict these residuals from the features. Then update the ensemble as F_m(x) = F_{m-1}(x) + η·h_m(x), where η is the learning rate that shrinks the new tree\'s contribution. Repeat for M rounds; the final prediction is the sum of the initial guess plus all shrunk tree contributions.',
      },
      {
        q: 'Why is boosting described as reducing bias while bagging reduces variance?',
        a: 'Bagging trains independent, unconstrained (often deep) trees in parallel on resampled data and averages them — each tree individually has low bias/high variance, and averaging cancels variance while leaving bias roughly unchanged, since averaging many unbiased-ish estimators doesn\'t systematically shift their expected value. Boosting instead starts from a weak, high-bias model (a shallow tree or even a constant) and sequentially adds trees specifically fit to the current residual/error, directly and iteratively driving down the systematic error (bias) that remains; controlling variance in boosting is a separate, explicit concern handled via learning rate, tree depth limits, and subsampling.',
      },
      {
        q: 'Why does a smaller learning rate combined with more trees usually generalize better than a large learning rate with few trees?',
        a: 'A large learning rate lets each tree make a big correction based on the residuals of a specific batch of data, which risks overfitting to noise in that data and overshooting the true signal. A small learning rate makes many small, conservative corrections, so any single tree\'s idiosyncratic error has a much smaller effect on the final ensemble, and the model effectively averages out noise across many rounds — this is directly analogous to why small step sizes in gradient descent produce smoother, more stable convergence. The tradeoff is needing more boosting rounds (more compute) to reach the same level of fit, which is why learning rate and n_estimators/early stopping are always tuned jointly.',
      },
      {
        q: 'LightGBM grows trees leaf-wise while XGBoost (by default) grows level-wise — what is the practical tradeoff?',
        a: 'Level-wise growth expands every node at the current depth before going deeper, producing more balanced, symmetric trees that are naturally regularized by depth but can waste splits on leaves that don\'t need them. Leaf-wise growth always splits whichever single leaf currently offers the greatest loss reduction, regardless of the resulting tree shape, which converges to lower training loss faster and often better accuracy for a given number of leaves/splits, but can produce deep, unbalanced trees that overfit more easily on smaller datasets if num_leaves/max_depth aren\'t constrained — this is why LightGBM shines especially on larger datasets where its efficiency gains matter and there is enough data to keep leaf-wise growth from overfitting.',
      },
      {
        q: 'You are getting great training AUC but poor validation AUC with XGBoost. Walk through your debugging/fix process.',
        a: 'This is classic overfitting from an overly complex boosted ensemble. First check for data leakage (a feature that encodes the target, or improper time-based splits) since that can masquerade as this pattern too. If it is genuine overfitting: reduce max_depth, increase min_child_weight, add/increase reg_alpha and reg_lambda, use subsample and colsample_bytree < 1 to add stochastic regularization, lower the learning rate while using early_stopping_rounds against a validation set instead of a fixed n_estimators, and make sure the validation split reflects the real deployment distribution (e.g., time-based split rather than random for temporal data) so early stopping is actually measuring what you care about.',
      },
    ],
  },
]
