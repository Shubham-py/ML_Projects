import type { Algorithm } from '../../types'

export const classificationAlgorithms: Algorithm[] = [
  {
    slug: 'knn',
    name: 'K-Nearest Neighbors (KNN)',
    category: 'Supervised · Classification & Regression',
    difficulty: 'Beginner',
    tags: ['classification', 'regression', 'instance-based', 'non-parametric'],
    summary: 'Classify (or predict) a point by majority vote (or average) of its K closest neighbors in feature space — no training phase at all.',
    companyRelevance: 'Common in recommendation cold-start, anomaly/similarity search, and as a warm-up coding round question (implement KNN from scratch) at almost every startup DS interview.',
    content: `
## Intuition

"You are the average of the 5 people you spend the most time with" — that's KNN. To predict a new point, find the $K$ training points closest to it (by some distance metric) and let them vote (classification, majority class) or average (regression). There is no explicit training step — KNN just memorizes the data, which is why it's called a **lazy learner** / **instance-based method**, as opposed to **eager learners** like logistic regression that build an explicit model upfront.

## The Math

**Distance metrics:**

- Euclidean: $d(x,z) = \\sqrt{\\sum_i (x_i - z_i)^2}$ — most common, sensitive to scale.
- Manhattan: $d(x,z) = \\sum_i |x_i - z_i|$ — more robust to outliers, better in high dimensions in some cases.
- Minkowski: generalizes both, $d(x,z) = \\left(\\sum_i |x_i - z_i|^p\\right)^{1/p}$.
- Cosine distance: for high-dimensional sparse data like text/embeddings, where direction matters more than magnitude.

**Prediction:**

Classification: $\\hat{y} = \\text{mode}\\{y_i : x_i \\in N_K(x)\\}$, optionally distance-weighted (closer neighbors get more vote weight, $w_i = 1/d(x,x_i)$).

Regression: $\\hat{y} = \\frac{1}{K}\\sum_{x_i \\in N_K(x)} y_i$.

## Choosing K — the real bias-variance lever

- **Small K (e.g. K=1):** decision boundary is very flexible/jagged — low bias, high variance. Extremely sensitive to noise (a single mislabeled neighbor flips the prediction).
- **Large K:** smoother boundary, more stable, but can wash out local structure and increases bias — at the extreme, K=n always predicts the global majority/average, ignoring $x$ entirely.
- Always pick $K$ via cross-validation, plotting validation error vs. K (a "U-shaped" curve). Rule of thumb starting point: $K \\approx \\sqrt{n}$, then tune. Prefer **odd K** for binary classification to avoid ties.

## Feature Scaling Is Mandatory

Since KNN relies purely on distance, a feature measured in lakhs of rupees will dominate the distance calculation over a feature that's a 0-1 ratio, regardless of true importance. **Always standardize or min-max scale features before KNN.**

## The Curse of Dimensionality

As dimensionality $p$ grows, all points become roughly equidistant from each other — the ratio of the distance to the nearest vs. farthest neighbor approaches 1. This makes "nearest" nearly meaningless in very high-dimensional spaces (raw pixel data, high-cardinality one-hot encodings). Mitigate with dimensionality reduction (PCA), feature selection, or switching to a learned embedding + approximate nearest neighbor search (FAISS, HNSW) for production similarity search.

## Making KNN Practical at Scale

Naive KNN prediction is $O(n \\cdot p)$ per query (brute-force distance to every training point) — too slow for large $n$ or low-latency serving. Production systems use:

- **KD-Trees** — good for low-dimensional data (roughly $p<20$), $O(\\log n)$ average query time.
- **Ball Trees** — better than KD-Trees in moderate dimensions.
- **Approximate Nearest Neighbor (ANN)** libraries — FAISS, Annoy, HNSW — trade a small amount of accuracy for massive speedups, standard in real-world recommendation/retrieval systems (and now in RAG pipelines for LLMs).

## Pros & Cons

**Pros:** Extremely simple, no training time, naturally handles multi-class problems, non-parametric (makes no assumption about the decision boundary's shape), can be very accurate with good feature engineering and enough data.

**Cons:** Slow / memory-heavy at prediction time (must store all training data), suffers badly in high dimensions, sensitive to irrelevant features and feature scale, sensitive to class imbalance (majority class dominates votes unless weighted), no interpretability of "why" beyond "these were the closest points."

## Complexity

Training: $O(1)$ (just store the data) or $O(n\\log n)$ if building a KD-tree upfront. Prediction (brute force): $O(np)$ per query; with a KD-tree: roughly $O(p \\log n)$ average case in low dimensions.
`,
    interviewQA: [
      {
        q: 'Why must you scale features before running KNN, but not before running a decision tree?',
        a: 'KNN\'s notion of "nearest" is entirely defined by a distance metric computed across all features jointly, so a feature with a larger numeric range will dominate the distance regardless of its actual predictive relevance — scaling puts all features on comparable footing. Decision trees instead split on one feature at a time using threshold comparisons or information gain; the split point adapts to whatever scale the feature is in, so monotonic transformations (including scaling) don\'t change which splits are chosen or the resulting tree structure.',
      },
      {
        q: 'What is the effect of K=1 vs a very large K on the bias-variance tradeoff?',
        a: 'K=1 fits the training data almost perfectly (each training point is its own nearest neighbor), giving a highly flexible, jagged decision boundary — low bias but high variance, very sensitive to noise and mislabeled points, prone to overfitting. As K grows, predictions average over more neighbors, smoothing the boundary — bias increases (boundary tracks the true pattern less precisely) but variance decreases. At the extreme K=n, the model ignores x entirely and always predicts the global majority class or mean — maximum bias, zero variance.',
      },
      {
        q: 'Explain the curse of dimensionality as it relates to KNN specifically.',
        a: 'As the number of dimensions grows, the volume of the space grows exponentially, so data becomes increasingly sparse and the contrast between "near" and "far" points shrinks — mathematically, the ratio of the distance to the closest vs. farthest neighbor tends to 1 as dimensionality increases, for many data distributions. This means the concept of a meaningful "neighborhood" breaks down, so KNN predictions in very high-dimensional raw feature spaces become unreliable unless you reduce dimensionality first (PCA, feature selection) or use a learned lower-dimensional embedding.',
      },
      {
        q: 'How would you make KNN fast enough to serve real-time recommendations over 50 million items?',
        a: 'Brute-force KNN is O(n·p) per query, infeasible at 50M scale with low latency requirements. In practice you\'d use Approximate Nearest Neighbor search — index embeddings with something like FAISS (IVF+PQ) or HNSW graphs, which trade a small, tunable amount of recall for orders-of-magnitude faster lookups (sub-linear, often near-constant with good index parameters). You would also typically reduce embedding dimensionality first and pre-compute/cache the index offline, updating it incrementally as new items arrive.',
      },
      {
        q: 'Is KNN a parametric or non-parametric model, and why does that matter?',
        a: 'Non-parametric — it makes no fixed assumption about the functional form of the decision boundary, and its "model complexity" (effectively, the number of neighbors considered) can grow with the amount of data. This gives it flexibility to model arbitrarily shaped boundaries, at the cost of needing to store and search the entire training set at inference time (unlike a parametric model like logistic regression, which compresses everything into a small, fixed set of weights and predicts in constant time regardless of training set size).',
      },
    ],
  },
  {
    slug: 'naive-bayes',
    name: 'Naive Bayes',
    category: 'Supervised · Classification',
    difficulty: 'Beginner',
    tags: ['classification', 'probabilistic', 'nlp', 'text'],
    summary: 'A fast probabilistic classifier built on Bayes\' theorem, assuming features are conditionally independent given the class.',
    companyRelevance: 'Classic for spam/toxic-content filtering, sentiment analysis, and as a lightning-fast baseline for text classification at content-moderation and ed-tech startups.',
    content: `
## Intuition

Naive Bayes flips the classification problem around using **Bayes' theorem**: instead of directly learning $P(y \\mid x)$, it learns how features look *given* each class, $P(x \\mid y)$, plus how common each class is, $P(y)$, then uses Bayes' rule to invert this at prediction time.

$$ P(y \\mid x) = \\frac{P(x \\mid y)\\,P(y)}{P(x)} $$

Since $P(x)$ is the same for every class, we only need to compare the numerator across classes:

$$ \\hat{y} = \\arg\\max_{y} P(y)\\prod_{i=1}^{p} P(x_i \\mid y) $$

The "**naive**" part: it assumes every feature is conditionally independent given the class — i.e. $P(x_1, x_2, \\dots, x_p \\mid y) = \\prod_i P(x_i \\mid y)$. This is almost never literally true (in a spam email, the words "free" and "prize" are correlated, not independent), yet the classifier is famously effective in practice anyway, especially for text.

**Why it still works despite the false assumption:** classification only needs the *argmax* across classes to be correct, not the exact probability values. Even if the independence assumption skews the absolute probabilities, it very often skews them similarly across all classes, leaving the ranking (and hence the decision) intact.

## Variants

- **Gaussian Naive Bayes:** for continuous features, assumes $P(x_i \\mid y) \\sim \\mathcal{N}(\\mu_{y,i}, \\sigma_{y,i}^2)$, estimated per class per feature from training data.
- **Multinomial Naive Bayes:** for count data (word frequency vectors) — the classic text classification workhorse. $P(x_i \\mid y)$ is estimated as the frequency of word $i$ among all words in documents of class $y$.
- **Bernoulli Naive Bayes:** for binary features (word present/absent rather than count) — penalizes the absence of a word too, not just presence.

## Laplace (Additive) Smoothing

If a word never appears in the training data for a class, its estimated $P(x_i \\mid y) = 0$, which zeroes out the *entire* product regardless of other evidence — a single unseen word would make the model refuse to predict that class at all. Fix with Laplace smoothing:

$$ P(x_i \\mid y) = \\frac{\\text{count}(x_i, y) + \\alpha}{\\text{count}(y) + \\alpha \\cdot |V|} $$

where $\\alpha$ (typically 1) is the smoothing parameter and $|V|$ is vocabulary size. This guarantees every probability is non-zero.

## Log-Space Computation

Multiplying many small probabilities ($p_1 \\times p_2 \\times \\dots \\times p_{10000}$ for a long document) underflows to zero in floating point. In practice we always compute in log-space:

$$ \\hat{y} = \\arg\\max_y \\left[\\ln P(y) + \\sum_i \\ln P(x_i \\mid y)\\right] $$

turning the product into a numerically stable sum.

## Pros & Cons

**Pros:** Extremely fast to train (just counting/averaging — a single pass over the data, embarrassingly parallelizable) and fast to predict, works surprisingly well with small training sets, naturally handles high-dimensional sparse data (bag-of-words), gives probabilistic output, strong baseline for text classification.

**Cons:** The independence assumption means it can't model feature interactions, probability estimates are often poorly calibrated (though the ranking/classification is usually still fine), Gaussian NB assumes each feature is normally distributed per class which is often false for real data, struggles when features are highly correlated.

## Complexity

Training: $O(np)$ — one pass to count/average. Prediction: $O(p \\cdot K)$ for $K$ classes — extremely fast, a reason it's still deployed for real-time spam/content filters even when transformer-based models exist for higher accuracy.
`,
    interviewQA: [
      {
        q: 'Naive Bayes assumes feature independence, which is almost always false. Why does it still work well in practice?',
        a: 'Classification only requires that the correct class gets the highest posterior score among the classes being compared — it doesn\'t require the absolute probability values to be well-calibrated. Violations of the independence assumption tend to bias the estimated probabilities for all classes in a correlated way (e.g., correlated words inflate the likelihood similarly regardless of which class you\'re scoring), so the relative ranking between classes — which is all that argmax cares about — is often preserved even when the raw probabilities are distorted.',
      },
      {
        q: 'Why is Laplace smoothing necessary, and what would happen without it?',
        a: 'Without smoothing, if a word in a test document never appeared in the training set for some class, its estimated conditional probability is exactly zero. Because Naive Bayes multiplies conditional probabilities across all features, a single zero factor forces the entire product for that class to zero, regardless of how strongly every other word supports that class — effectively letting one unseen word veto the whole classification. Laplace (add-alpha) smoothing adds a small pseudo-count to every word/class combination so no probability is ever exactly zero.',
      },
      {
        q: 'Why do we compute Naive Bayes scores in log-space instead of directly multiplying probabilities?',
        a: 'For a document with thousands of words, multiplying thousands of probabilities each less than 1 causes the product to underflow to 0.0 in standard floating-point representation, losing all information needed to compare classes. Taking the log of each probability converts the product into a sum (since log(ab) = log a + log b), which is numerically stable and monotonic — the class with the highest log-probability sum is still the class with the highest raw probability product.',
      },
      {
        q: 'Multinomial vs Gaussian vs Bernoulli Naive Bayes — when would you use each?',
        a: 'Multinomial NB models feature counts (e.g., word frequency in a document) and is the standard choice for text classification with bag-of-words/TF features. Bernoulli NB models binary presence/absence of each feature and additionally penalizes the *absence* of informative words, which can help on short texts where word counts are less meaningful than mere presence. Gaussian NB assumes each continuous feature is normally distributed within each class and is used for continuous, roughly bell-shaped tabular features rather than text.',
      },
      {
        q: 'How does Naive Bayes handle correlated/redundant features, and is that a real problem?',
        a: 'Because it assumes conditional independence, duplicating a feature (or having two highly correlated features) effectively double-counts that piece of evidence in the product, over-weighting it relative to its true information content and potentially skewing predictions toward whatever class that redundant feature favors. In practice this is a real but often minor issue for text data where redundancy is diffuse across thousands of features; it becomes a bigger problem with a small number of strongly correlated engineered features, where feature selection or combining correlated features first is advisable.',
      },
    ],
  },
  {
    slug: 'decision-trees',
    name: 'Decision Trees',
    category: 'Supervised · Classification & Regression',
    difficulty: 'Intermediate',
    tags: ['classification', 'regression', 'tree', 'interpretable'],
    summary: 'Recursively split the feature space into regions using simple if/else rules chosen to maximize class purity (or minimize variance).',
    companyRelevance: 'Foundation for Random Forest/GBM/XGBoost, which power the majority of tabular-data production models in Indian fintech, insurance, and e-commerce risk/recommendation systems.',
    content: `
## Intuition

A decision tree asks a sequence of yes/no questions about the features ("Is income > ₹8L?", "Is credit_util > 0.6?") to progressively split the data into purer and purer subgroups, ending in leaves that predict a class (classification) or a value (regression, typically the mean of training points in that leaf).

## Splitting Criteria — how a node picks its question

**Classification — Gini Impurity:**

$$ Gini(t) = 1 - \\sum_{k=1}^{K} p_k^2 $$

where $p_k$ is the fraction of class $k$ samples at node $t$. Gini = 0 means the node is perfectly pure (one class only); Gini is maximized (for $K$ classes) when classes are perfectly balanced.

**Classification — Entropy / Information Gain:**

$$ Entropy(t) = -\\sum_{k=1}^{K} p_k \\log_2 p_k, \\qquad IG = Entropy(\\text{parent}) - \\sum_{j} \\frac{n_j}{n}Entropy(\\text{child}_j) $$

The tree picks, at every node, the feature and threshold that maximizes information gain (equivalently, minimizes weighted child impurity). Gini and entropy usually pick very similar splits in practice; Gini is slightly faster to compute (no logs) and is sklearn's default (CART).

**Regression — Variance Reduction:** minimize the weighted sum of variance in the child nodes (equivalently, minimize sum of squared errors from each leaf's mean prediction).

## Why Trees Overfit — and How We Stop Them

A fully grown tree can keep splitting until every leaf has a single training example — perfect training accuracy, terrible generalization (maximum variance, essentially memorization). We control this with:

- **max_depth** — hard cap on tree depth.
- **min_samples_split / min_samples_leaf** — refuse to split a node (or create a leaf) below a sample-count threshold.
- **max_features** — only consider a random subset of features per split (this specific idea, pushed further, is what makes Random Forest work).
- **Pruning** — grow a full tree, then cut back branches that don't improve validation performance (cost-complexity / "weakest link" pruning: minimize $\\sum \\text{leaf impurity} + \\alpha \\cdot |\\text{leaves}|$, tuning $\\alpha$ via cross-validation).

## Feature Importance

Trees give a natural, free feature-importance score: sum up the impurity decrease each feature causes, weighted by the number of samples it affects, across every split where that feature is used. Careful: this is biased toward high-cardinality features (a feature with many unique values has more possible split points, so it's more likely to find a spuriously good split by chance) — permutation importance is a more reliable alternative.

## Pros & Cons

**Pros:** Highly interpretable (can literally draw the decision path), requires zero feature scaling, naturally handles both numerical and categorical features, captures non-linear relationships and feature interactions automatically, handles missing values gracefully in many implementations, no distributional assumptions.

**Cons:** High variance — small changes in data can produce a very different tree (this is exactly why ensembles like Random Forest/GBM exist), prone to overfitting if not pruned/constrained, biased toward features with more levels/split points, can't extrapolate beyond the range of training data (predictions are always a training-set value/average), greedy splitting is not guaranteed globally optimal (finding the truly optimal tree is NP-hard).

## Complexity

Building the tree: roughly $O(n \\cdot p \\cdot \\log n)$ for a balanced tree (sorting features at each level). Prediction: $O(\\log n)$ for a balanced tree — traverse root to leaf.

## Real-World Use

Rarely deployed alone in industry today — almost always as the base learner inside Random Forest or Gradient Boosting. But it's essential to understand deeply because (a) it's a very common "explain a decision tree to me, then explain Random Forest" interview flow, and (b) single trees are still used where extreme interpretability/auditability is legally required (credit decisions in regulated lending, "right to explanation" scenarios).
`,
    interviewQA: [
      {
        q: 'Compare Gini impurity and entropy as splitting criteria. Does the choice matter much in practice?',
        a: 'Both measure node impurity and both are maximized at a uniform class distribution and zero at perfect purity. Entropy is information-theoretic (bits needed to describe the class label) and involves a log, making it slightly more computationally expensive; Gini has a probabilistic interpretation (expected error rate if you randomly label a sample according to the node\'s class distribution) and is marginally faster. In practice, the two produce very similar trees — differences show up mainly when there are many classes with skewed distributions, where entropy can sometimes favor more balanced splits. The choice rarely changes final model performance meaningfully; sklearn defaults to Gini for speed.',
      },
      {
        q: 'Why do single decision trees have high variance, and how do ensembles fix this?',
        a: 'Trees are built with a greedy, deterministic algorithm that is very sensitive to the exact training sample — a few different data points near the top of the tree can lead to a completely different split there, which cascades into a completely different tree structure below it. Bagging (Random Forest) reduces variance by training many trees on bootstrap resamples of the data (and random feature subsets) and averaging their predictions — since each tree\'s errors are relatively uncorrelated with the others, averaging cancels out much of the variance while (roughly) preserving the low bias. Boosting instead reduces bias by having trees sequentially correct each other\'s errors, though it can be more sensitive to overfitting if not regularized.',
      },
      {
        q: 'How does a decision tree handle a categorical feature with 500 unique values, and what is the risk?',
        a: 'CART-style trees typically look for the best binary split (grouping categories into two subsets) or, for ordinal-encoded categories, a threshold. With very high cardinality, the tree has an enormous number of candidate splits to try, which greatly increases the chance of finding a split that looks good on the training data purely by chance (overfitting) — this is also why raw impurity-based feature importance is biased toward high-cardinality features. Mitigations: target encoding with proper cross-validation/regularization, grouping rare categories, capping max_features, or using algorithms specifically designed for categorical splits like CatBoost.',
      },
      {
        q: 'Is greedy top-down tree induction (CART/ID3) guaranteed to find the globally optimal tree?',
        a: 'No. Finding the provably optimal decision tree (minimizing error for a given size) is NP-hard, so all standard algorithms use a greedy heuristic: at each node, pick the locally best split without considering how it affects splits further down the tree. This can lead to suboptimal overall trees — a slightly worse split now might have enabled much better splits later — but it makes tree construction tractable (polynomial time) and works well enough in practice, especially once trees are used inside ensembles rather than alone.',
      },
      {
        q: 'Why don\'t decision trees need feature scaling, unlike KNN or logistic regression with gradient descent?',
        a: 'Trees split on a single feature at a time using a threshold comparison (x_i > t), and the impurity reduction from a split depends only on how the split partitions the samples, not on the absolute scale of the feature values. Since any monotonic transformation (like standardization) preserves the relative ordering of a feature\'s values, it cannot change which split point is optimal or how the data gets partitioned — the tree structure is invariant to feature scaling.',
      },
    ],
  },
  {
    slug: 'svm',
    name: 'Support Vector Machines (SVM)',
    category: 'Supervised · Classification',
    difficulty: 'Advanced',
    tags: ['classification', 'margin', 'kernel-methods'],
    summary: 'Find the hyperplane that separates classes with the maximum possible margin, using the kernel trick to handle non-linear boundaries.',
    companyRelevance: 'Less common in day-to-day production tabular work now (gradient boosting usually wins), but still a frequent theoretical deep-dive in big-tech and quant-style DS interviews to test understanding of margins, duality, and kernels.',
    content: `
## Intuition

Among all the hyperplanes that could separate two classes, SVM picks the one that maximizes the **margin** — the distance between the hyperplane and the nearest points of each class. Those nearest points are called **support vectors**; they alone determine the boundary — every other point could be deleted without changing the solution.

Maximizing the margin is a form of built-in regularization: intuitively, a decision boundary that stays as far as possible from every training point is less likely to be a fluke of the particular sample you happened to observe, and tends to generalize better.

## The Math — Hard Margin

For linearly separable data with labels $y_i \\in \\{-1, +1\\}$, the hyperplane is $w^Tx + b = 0$. We want every point correctly classified with margin at least 1: $y_i(w^Tx_i + b) \\ge 1$ for all $i$. The margin width is $\\frac{2}{\\|w\\|}$, so maximizing margin = minimizing $\\|w\\|$:

$$ \\min_{w,b} \\frac{1}{2}\\|w\\|^2 \\quad \\text{s.t. } y_i(w^Tx_i+b) \\ge 1 \\;\\; \\forall i $$

## Soft Margin (real-world data isn't perfectly separable)

Introduce slack variables $\\xi_i \\ge 0$ that allow some points to violate the margin, penalized by hyperparameter $C$:

$$ \\min_{w,b,\\xi} \\frac{1}{2}\\|w\\|^2 + C\\sum_i \\xi_i \\quad \\text{s.t. } y_i(w^Tx_i+b) \\ge 1-\\xi_i,\\ \\xi_i \\ge 0 $$

**$C$ is the key hyperparameter:** large $C$ = heavily penalize margin violations = narrow margin, fits training data closely (risk of overfitting, low bias/high variance). Small $C$ = tolerate more violations = wide margin, smoother boundary (more bias, less variance, more robust to outliers).

## The Kernel Trick

Real data is often not linearly separable in its original space. Instead of explicitly transforming $x$ into a high-dimensional space $\\phi(x)$ where it might become separable (expensive or even infinite-dimensional), SVM exploits the fact that its **dual formulation** only ever needs *dot products* between data points, $x_i^Tx_j$. A **kernel function** $K(x_i,x_j) = \\phi(x_i)^T\\phi(x_j)$ computes that dot product directly, without ever materializing $\\phi(x)$ — this is the "kernel trick."

Common kernels:

- **Linear:** $K(x_i,x_j) = x_i^Tx_j$ — use when you already expect a linear boundary (e.g. text with huge sparse feature spaces).
- **Polynomial:** $K(x_i,x_j) = (\\gamma x_i^Tx_j + r)^d$.
- **RBF (Gaussian), the default choice:** $K(x_i,x_j) = \\exp(-\\gamma\\|x_i-x_j\\|^2)$ — corresponds to an infinite-dimensional feature space; $\\gamma$ controls how far the influence of a single training example reaches (large $\\gamma$ = tight, wiggly boundary/overfitting risk; small $\\gamma$ = smoother, more bias).

## Dual Formulation (why interviewers love asking about it)

Via Lagrangian duality, the SVM problem becomes:

$$ \\max_{\\alpha} \\sum_i \\alpha_i - \\frac{1}{2}\\sum_{i,j}\\alpha_i\\alpha_j y_iy_j K(x_i,x_j) \\quad \\text{s.t. } 0\\le \\alpha_i \\le C,\\ \\sum_i \\alpha_iy_i=0 $$

Points with $\\alpha_i > 0$ are the support vectors — everything else has $\\alpha_i=0$ and drops out entirely, which is why SVM predictions only depend on a (often small) subset of the training data.

## Pros & Cons

**Pros:** Effective in high-dimensional spaces (even when $p>n$, e.g. text/genomics), memory-efficient at prediction time (only stores support vectors), the kernel trick gives flexible non-linear boundaries, strong theoretical grounding (margin maximization relates directly to generalization bounds).

**Cons:** Doesn't scale well to very large $n$ (training is roughly $O(n^2)$ to $O(n^3)$ for kernel SVMs), requires careful tuning of $C$ and kernel parameters, doesn't naturally output calibrated probabilities (Platt scaling is bolted on afterward), sensitive to feature scaling, less interpretable than trees/linear models, has largely been superseded by gradient boosting for tabular data and by deep learning for images/text in production.

## Complexity

Training: roughly $O(n^2 p)$ to $O(n^3)$ depending on the solver (SMO algorithm is standard) — this quadratic-to-cubic scaling in $n$ is the main reason SVMs are impractical on datasets with millions of rows. Prediction: $O(s \\cdot p)$ where $s$ is the number of support vectors.
`,
    interviewQA: [
      {
        q: 'What are support vectors, and why does the SVM solution depend only on them?',
        a: 'Support vectors are the training points that lie exactly on the margin boundary (or, in the soft-margin case, violate it) — in the dual formulation, they are exactly the points with a non-zero Lagrange multiplier α_i. Every other point has α_i = 0 and contributes nothing to the decision function w = Σ α_i y_i x_i (or its kernelized equivalent), so removing any non-support-vector point from the training set and refitting would yield the identical decision boundary.',
      },
      {
        q: 'Explain the effect of hyperparameter C in soft-margin SVM.',
        a: 'C controls the tradeoff between maximizing the margin and minimizing training misclassifications/margin violations. A large C imposes a heavy penalty on violations, forcing the model to fit the training data tightly with a narrow margin — lower bias but higher variance, more sensitive to outliers and noise. A small C tolerates more violations in exchange for a wider, smoother margin — higher bias but lower variance, more robust to noisy or overlapping classes. It is tuned via cross-validation, typically on a log scale.',
      },
      {
        q: 'What is the kernel trick, and why is it computationally important?',
        a: 'Many datasets aren\'t linearly separable in their original feature space but might become separable after a non-linear transformation φ(x) into a higher- (even infinite-) dimensional space. Explicitly computing φ(x) for high/infinite dimensions is expensive or impossible, but the SVM dual problem only ever needs the dot product φ(x_i)ᵀφ(x_j), not φ(x) itself. A kernel function K(x_i,x_j) computes that dot product directly using the original low-dimensional x_i, x_j, giving you the effect of the non-linear transform at the computational cost of working in the original space.',
      },
      {
        q: 'How would you choose between a linear kernel and an RBF kernel?',
        a: 'Use a linear kernel when the number of features is very large relative to the number of samples (e.g., bag-of-words text data, p in the tens of thousands, n in the thousands) — the data is often already close to linearly separable in such high dimensions, and a linear kernel trains much faster and avoids overfitting from unnecessary extra flexibility. Use RBF when you have a moderate number of features, suspect a genuinely non-linear boundary, and have enough data to tune both C and γ via cross-validation without overfitting; RBF is the more flexible, general-purpose default when you\'re unsure.',
      },
      {
        q: 'Why is SVM rarely the first choice for large tabular datasets in industry today?',
        a: 'Standard kernel SVM training scales roughly quadratically to cubically with the number of training examples (solving a dense quadratic program via SMO), which becomes impractical well before you reach millions of rows — gradient boosting libraries like XGBoost/LightGBM scale roughly linearly with data size via histogram-based, parallelized tree building and typically match or beat SVM accuracy on tabular data with far less tuning. SVM also needs careful feature scaling and kernel/hyperparameter tuning, and doesn\'t give native feature importances or calibrated probabilities, all of which make gradient boosting the more practical default for production tabular ML.',
      },
    ],
  },
]
