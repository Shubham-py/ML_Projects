import type { Algorithm } from '../../types'

export const unsupervisedAlgorithms: Algorithm[] = [
  {
    slug: 'kmeans',
    name: 'K-Means Clustering',
    category: 'Unsupervised · Clustering',
    difficulty: 'Beginner',
    tags: ['clustering', 'unsupervised', 'centroid-based'],
    summary: 'Partition data into K clusters by iteratively assigning points to the nearest centroid and recomputing centroids.',
    companyRelevance: 'Used for customer segmentation, market basket grouping and anomaly clusters across every e-commerce/fintech DS team in India — a guaranteed unsupervised-learning interview topic.',
    content: `
## Intuition

K-Means tries to partition $n$ points into $K$ groups such that points within a group are as similar (close) as possible, and groups are as distinct as possible. It does this with a simple two-step loop that alternates between "who belongs to which centroid" and "where should each centroid be."

## The Algorithm (Lloyd's Algorithm)

1. **Initialize** $K$ centroids (randomly, or better, via **K-Means++** — pick the first centroid randomly, then pick each subsequent centroid with probability proportional to its squared distance from the nearest already-chosen centroid, spreading initial centroids out and dramatically improving convergence quality/speed vs. naive random init).
2. **Assignment step:** assign every point to its nearest centroid: $c_i = \\arg\\min_k \\|x_i - \\mu_k\\|^2$.
3. **Update step:** recompute each centroid as the mean of the points assigned to it: $\\mu_k = \\frac{1}{|C_k|}\\sum_{x_i \\in C_k} x_i$.
4. Repeat steps 2-3 until assignments stop changing (or centroids move less than a tolerance, or max iterations reached).

## The Objective Function

K-Means minimizes **within-cluster sum of squares (WCSS)**, also called **inertia**:

$$ J = \\sum_{k=1}^{K}\\sum_{x_i \\in C_k} \\|x_i - \\mu_k\\|^2 $$

Each step of Lloyd's algorithm is guaranteed to never increase $J$ (assignment step minimizes $J$ given fixed centroids; update step minimizes $J$ given fixed assignments — this is literally **coordinate descent**), so the algorithm always converges — but only to a **local** optimum, since $J$ is non-convex in the joint (centroids, assignments) space. This is exactly why initialization matters and why we run K-Means multiple times with different seeds (\`n_init\` in sklearn) and keep the run with lowest final inertia.

## Choosing K

- **Elbow method:** plot inertia vs. $K$, look for the point where the marginal decrease in inertia sharply flattens — a subjective but common heuristic.
- **Silhouette score:** for each point, $s_i = \\frac{b_i - a_i}{\\max(a_i,b_i)}$ where $a_i$ is mean distance to points in its own cluster and $b_i$ is mean distance to points in the nearest other cluster. Ranges from -1 to 1; higher is better. Pick $K$ that maximizes the mean silhouette score — more principled than the elbow method.
- **Gap statistic:** compares inertia against what you'd expect from randomly (uniformly) distributed reference data — more rigorous, more expensive to compute.
- Domain knowledge is often the most practical answer in industry: "we want 4 marketing personas because that's what the team can action on."

## Assumptions & Failure Modes

K-Means implicitly assumes clusters are **convex, roughly spherical, and similar in size/density**, because it measures similarity purely via Euclidean distance to a single centroid. It fails on:
- **Non-convex shapes** (e.g. two interleaved crescents) — use DBSCAN or spectral clustering instead.
- **Clusters of very different sizes or densities** — a large sparse cluster and a small dense cluster next to it can get their points misassigned.
- **High-dimensional data** — Euclidean distance becomes less meaningful (curse of dimensionality); consider PCA first.
- Also sensitive to **outliers** (a single far-away point can drag a centroid significantly, since it's an average) — K-Medoids (using actual data points as cluster centers, minimizing sum of distances rather than squared distances) is more robust.

## Practical Notes

- **Always standardize features first** — same reason as KNN, Euclidean distance is scale-sensitive.
- K-Means requires you to *specify* $K$ upfront, unlike hierarchical clustering or DBSCAN which can suggest a natural number of clusters.
- Converges fast in practice (usually well under 100 iterations) though worst-case is exponential; in practice treated as roughly linear per iteration.

## Pros & Cons

**Pros:** Simple, fast, scales well to large $n$ (linear per iteration), easy to interpret cluster centroids, works well when clusters are genuinely roughly spherical and separated.

**Cons:** Must choose $K$ in advance, sensitive to initialization (mitigated by K-Means++ and multiple restarts), sensitive to outliers and feature scale, assumes convex/spherical/similarly-sized clusters, only finds a local optimum (no guarantee of global optimum).

## Complexity

$O(n \\cdot K \\cdot p \\cdot i)$ where $i$ is the number of iterations to convergence — linear in $n$, which is why it scales to large datasets far better than hierarchical clustering.
`,
    interviewQA: [
      {
        q: 'Prove that Lloyd\'s algorithm (K-Means) always converges.',
        a: 'K-Means minimizes the within-cluster sum of squares J via coordinate descent on two blocks of variables: cluster assignments and centroid locations. The assignment step fixes centroids and reassigns each point to its nearest centroid, which can only decrease or keep J the same (moving a point to a strictly closer centroid strictly reduces its squared distance term). The update step fixes assignments and recomputes each centroid as the mean of its assigned points, which is exactly the minimizer of sum of squared distances for a fixed set of points, again only decreasing or maintaining J. Since J is bounded below by zero and non-increasing at every step, and there are only finitely many possible assignments of n points to K clusters, the algorithm must converge in a finite number of steps (to a local, not necessarily global, optimum).',
      },
      {
        q: 'Why does K-Means struggle with clusters of very different sizes or non-convex shapes, and what would you use instead?',
        a: 'K-Means represents each cluster by a single centroid and assigns points based purely on Euclidean distance to the nearest centroid, which implicitly assumes clusters are convex and roughly spherical/similar-sized — its decision boundaries between clusters are always linear (Voronoi cells). This fails for elongated, crescent-shaped, or nested clusters, and for clusters of very different density/size, where a large diffuse cluster can "absorb" points that actually belong to a nearby small dense cluster. DBSCAN (density-based, no need to specify K, handles arbitrary shapes and noise/outliers) or spectral clustering (uses eigenvectors of a similarity graph, can capture non-convex structure) are common alternatives.',
      },
      {
        q: 'Explain K-Means++ initialization and why it matters.',
        a: 'Naive K-Means picks K random points as initial centroids, which can easily place multiple centroids close together in the same true cluster, leading to poor local optima and slow convergence. K-Means++ instead picks the first centroid uniformly at random, then picks each subsequent centroid from the remaining points with probability proportional to its squared distance to the nearest already-chosen centroid — points far from existing centroids are more likely to be chosen next. This spreads initial centroids across the data\'s actual structure, provably gives an expected approximation ratio of O(log K) to the optimal clustering, and in practice converges faster and to better local optima than random initialization.',
      },
      {
        q: 'How do you choose K in practice, and what are the tradeoffs between the elbow method and silhouette score?',
        a: 'The elbow method plots inertia (WCSS) against K and looks for a "knee" where the rate of decrease sharply slows — it\'s fast to compute but the knee is often ambiguous/subjective to read off a chart. The silhouette score computes, for every point, how much closer it is to its own cluster versus the next-nearest cluster, averaged across all points, giving a single number per K to directly compare (higher is better, range -1 to 1) — more principled and often clearer than the elbow, but more expensive to compute (requires pairwise distances) and can still pick a K that doesn\'t match business needs. In practice, I would compute both, cross-check with domain constraints (e.g. how many customer segments the marketing team can realistically act on), and validate the resulting clusters make qualitative sense.',
      },
      {
        q: 'Why is it important to scale features before K-Means, and what happens if you don\'t?',
        a: 'K-Means assigns points based on squared Euclidean distance across all features combined, so a feature with a much larger numeric range will dominate the distance calculation and effectively determine the clustering by itself, regardless of whether it is the most meaningful feature for grouping. For example, clustering customers on "annual income in rupees" (range: lakhs) and "number of purchases" (range: 0-50) without scaling would produce clusters driven almost entirely by income. Standardizing (zero mean, unit variance) or min-max scaling every feature first ensures each feature contributes proportionally to its actual variation, not its raw units.',
      },
    ],
  },
  {
    slug: 'hierarchical-clustering',
    name: 'Hierarchical Clustering',
    category: 'Unsupervised · Clustering',
    difficulty: 'Intermediate',
    tags: ['clustering', 'unsupervised', 'dendrogram'],
    summary: 'Build a tree of nested clusters (a dendrogram) by iteratively merging or splitting groups, without needing to pre-specify K.',
    companyRelevance: 'Common for exploratory customer/product segmentation work and taxonomy building where you want to see cluster structure at every granularity, not just one fixed K.',
    content: `
## Intuition

Instead of committing to a single value of $K$ upfront like K-Means, hierarchical clustering builds an entire tree of clusters, from every point in its own cluster up to all points in one cluster (or vice versa), letting you inspect the clustering at *any* level of granularity by cutting the tree at different heights.

## Agglomerative (Bottom-Up) — the common approach

1. Start with every point as its own cluster ($n$ clusters).
2. Find the two closest clusters and merge them.
3. Repeat until only one cluster remains.
4. Record the merge distances to build a **dendrogram** — a tree diagram showing which clusters merged at what distance.

## Linkage Criteria — "closest" between *clusters*, not points

- **Single linkage:** distance between the closest pair of points across the two clusters, $\\min_{x\\in A, z\\in B} d(x,z)$. Can produce long, straggly "chained" clusters (chaining effect).
- **Complete linkage:** distance between the farthest pair, $\\max_{x\\in A,z\\in B}d(x,z)$. Tends to produce compact, evenly-sized clusters, sensitive to outliers.
- **Average linkage:** mean of all pairwise distances between the two clusters — a balance between single and complete.
- **Ward's linkage:** merges the pair of clusters that leads to the *minimum increase* in total within-cluster variance (analogous to K-Means' objective). Usually the best default for roughly spherical, evenly-sized clusters and is the most commonly used in practice.

## Reading a Dendrogram

The y-axis is the distance/dissimilarity at which two clusters were merged. To get $K$ flat clusters, draw a horizontal line and count how many vertical lines it crosses — cutting higher gives fewer, coarser clusters; cutting lower gives more, finer clusters. The height of the longest vertical line you can cut through (without crossing a merge) is often used as a heuristic for a "natural" number of clusters.

## Divisive (Top-Down) — the less common alternative

Starts with all points in one cluster and recursively splits the most heterogeneous cluster. Computationally more expensive than agglomerative (must consider all possible 2-way splits, roughly $2^{n-1}$ options at the top level) and rarely used in practice compared to agglomerative.

## Pros & Cons

**Pros:** No need to specify $K$ in advance — get the whole hierarchy and decide later, produces an interpretable dendrogram showing nested structure at every scale, deterministic (no random initialization sensitivity, unlike K-Means), works with any distance metric (not restricted to Euclidean) so it's flexible for mixed/categorical data with an appropriate distance function.

**Cons:** Computationally expensive — naive implementations are $O(n^3)$ time and $O(n^2)$ space (must store/update the full pairwise distance matrix), making it impractical beyond a few thousand to tens of thousands of points without optimized implementations; greedy merges are irreversible (a bad early merge can't be undone later, unlike K-Means which reassigns every iteration); choice of linkage criterion significantly changes results and isn't always obvious upfront.

## Complexity

Naive: $O(n^3)$ time, $O(n^2)$ space. Optimized implementations (e.g. using a priority queue / nearest-neighbor chain algorithm) bring this down to $O(n^2 \\log n)$ — still far worse scaling than K-Means' $O(nKi)$, which is the main practical reason K-Means is preferred for large $n$.
`,
    interviewQA: [
      {
        q: 'Compare single, complete, average, and Ward linkage. Which would you default to and why?',
        a: 'Single linkage merges based on the closest pair of points between clusters, which can create long "chained" clusters that string together via a sequence of nearby points even if the overall clusters are quite different — sensitive to noise bridging two otherwise distinct groups. Complete linkage uses the farthest pair, producing tighter, more compact, evenly-sized clusters but is sensitive to outliers (a single far point can prevent an otherwise sensible merge). Average linkage uses the mean pairwise distance, balancing the two. Ward\'s linkage merges clusters to minimize the resulting increase in total within-cluster variance, directly analogous to K-Means\' objective, and is my default choice for roughly spherical, evenly-sized clusters since it tends to produce the most stable, interpretable dendrograms in practice.',
      },
      {
        q: 'Why is hierarchical clustering rarely used on datasets with millions of rows?',
        a: 'Naive agglomerative clustering needs to compute and repeatedly update the full pairwise distance matrix between clusters, which is O(n²) in space and O(n³) in time for the naive algorithm (even optimized versions are O(n² log n)); at a million rows, the distance matrix alone would need on the order of 10^12 entries, infeasible in memory. K-Means, by contrast, scales roughly linearly in n per iteration since it only computes distances from each point to K centroids, not to every other point — which is why K-Means (or a scalable variant like Mini-Batch K-Means) is preferred at large scale, sometimes preceded by a sample-based hierarchical clustering just to help pick K.',
      },
      {
        q: 'How do you decide how many clusters to use from a dendrogram?',
        a: 'Visually, look for the longest vertical line in the dendrogram that you can cut with a single horizontal line without crossing any other merge — the number of vertical lines that horizontal cut crosses is a natural candidate for K, since it represents merges that required a big jump in dissimilarity, suggesting real separation. In practice, this is a heuristic; I would also compute the silhouette score for a few candidate cuts, and combine that with domain knowledge about how many segments/groups are actually useful downstream, similar to picking K in K-Means.',
      },
      {
        q: 'What is the "chaining effect" in single-linkage clustering and why is it a problem?',
        a: 'Single linkage merges two clusters based on their single closest pair of points, which means two clusters can be merged even if most of their points are far apart, as long as there exists some sequence of nearby points bridging them — over successive merges this can string together a long, thin, snake-like cluster that doesn\'t correspond to any real, compact grouping in the data. It\'s a problem when the true underlying clusters are relatively compact and well-separated but connected by sparse noise points, in which case single linkage will incorrectly merge them; complete or average or Ward linkage is more robust to this.',
      },
      {
        q: 'Can hierarchical clustering be used with non-Euclidean distances, and why might that matter?',
        a: 'Yes — agglomerative clustering only needs a valid pairwise distance/dissimilarity measure between points (and a linkage rule to extend that to clusters), so it works with Manhattan distance, cosine distance (common for text/embeddings where direction matters more than magnitude), Jaccard distance (for sets/binary attributes), or custom domain-specific distances (e.g., edit distance for strings, DTW for time series). This flexibility is a real advantage over K-Means, which is mathematically tied to Euclidean distance because its centroid-mean update step is only guaranteed to minimize squared Euclidean distance.',
      },
    ],
  },
  {
    slug: 'pca',
    name: 'Principal Component Analysis (PCA)',
    category: 'Unsupervised · Dimensionality Reduction',
    difficulty: 'Intermediate',
    tags: ['dimensionality-reduction', 'unsupervised', 'linear-algebra'],
    summary: 'Find the orthogonal directions of maximum variance in the data and project onto a smaller number of them, compressing features while preserving as much information as possible.',
    companyRelevance: 'Used for visualization, noise reduction, and speeding up downstream models on high-dimensional data (sensor/genomic/embedding features); a go-to whiteboard question to test linear algebra depth at big tech and quant-heavy DS roles.',
    content: `
## Intuition

If you have many correlated features, most of the actual "information" (variance) in the data can often be captured by a much smaller number of new, uncorrelated combined features. PCA finds those new axes — called **principal components** — as the directions along which the data varies the most, ranked in order of how much variance they explain.

Picture a cloud of points shaped like a tilted ellipse in 2D: PCA finds the long axis of the ellipse (direction of maximum spread — PC1) and the short axis perpendicular to it (PC2). If the ellipse is very thin, almost all the "information" lives along PC1, and you could reasonably describe each point using just its position along PC1, discarding PC2 with minimal information loss.

## The Math

**Step 1 — center the data** (subtract the mean of each feature; scale to unit variance too if features are on different scales — this is critical, PCA is not scale-invariant).

**Step 2 — compute the covariance matrix:**

$$ \\Sigma = \\frac{1}{n}X^TX \\quad (\\text{where } X \\text{ is already centered}) $$

**Step 3 — eigendecomposition:** find eigenvectors $v_1, v_2, \\dots, v_p$ and eigenvalues $\\lambda_1 \\ge \\lambda_2 \\ge \\dots \\ge \\lambda_p$ of $\\Sigma$:

$$ \\Sigma v_k = \\lambda_k v_k $$

The eigenvectors are the principal components (the new orthogonal axes); each eigenvalue $\\lambda_k$ equals the **variance of the data along that component**. In practice, PCA is computed via **Singular Value Decomposition (SVD)** of $X = U S V^T$ directly (more numerically stable than eigendecomposing the covariance matrix), where the columns of $V$ are the principal components and $S^2/n$ gives the eigenvalues.

**Step 4 — project:** to reduce to $k$ dimensions, keep only the top $k$ eigenvectors (by eigenvalue) as columns of matrix $V_k$, and compute $X_{reduced} = XV_k$.

**Why eigenvectors of the covariance matrix maximize variance:** PCA is formally the solution to $\\max_{\\|v\\|=1} \\text{Var}(Xv) = \\max_{\\|v\\|=1} v^T\\Sigma v$. By the Rayleigh quotient / spectral theorem, this is maximized by the eigenvector with the largest eigenvalue, and the general solution (subject to orthogonality with previously chosen components) is exactly the ordered sequence of eigenvectors of $\\Sigma$.

## Choosing How Many Components to Keep

Plot **cumulative explained variance ratio**, $\\frac{\\sum_{i=1}^{k}\\lambda_i}{\\sum_{i=1}^{p}\\lambda_i}$, against $k$, and pick the smallest $k$ that captures a target threshold (commonly 90-95%). A **scree plot** (eigenvalues vs. component index) showing an "elbow" is another common heuristic — components after the elbow contribute little additional variance.

## What PCA Is NOT

- **Not a feature selection method** — it creates *new* features (linear combinations of all original features), so you lose direct interpretability of "which original feature matters." (Compare to Lasso, which selects a subset of *original* features.)
- **Not supervised** — PCA has no idea what your target label is; it only looks at feature variance. This means PCA can (and sometimes does) discard a low-variance feature that happens to be extremely predictive of the target. If you specifically want a supervised dimensionality reduction that keeps predictive power, look at Linear Discriminant Analysis (LDA) or supervised feature selection instead.
- **Assumes linear structure** — captures only linear correlations between features. For genuinely non-linear manifold structure, consider Kernel PCA, t-SNE, or UMAP (mainly for visualization, not general-purpose preprocessing).

## Pros & Cons

**Pros:** Reduces dimensionality (speeds up downstream models, reduces overfitting risk from the curse of dimensionality), removes multicollinearity (principal components are orthogonal/uncorrelated by construction — useful before feeding into models sensitive to multicollinearity), useful for visualization (project to 2-3 dimensions), can act as a mild denoising step (discarding low-variance components often discards noise).

**Cons:** Components are linear combinations of all original features — hard to interpret ("what does PC3 mean?"), sensitive to feature scaling (must standardize first), assumes the "interesting" structure is the high-variance structure, which isn't always true for the target you actually care about, discards information (some variance is always lost unless you keep all $p$ components), purely linear method.

## Complexity

Via SVD: $O(np\\min(n,p))$ — the standard exact algorithm; **randomized SVD** solvers approximate the top $k$ components in roughly $O(np\\log k)$, which is what most libraries default to for large data when you only need a handful of components.
`,
    interviewQA: [
      {
        q: 'Derive why the first principal component is the eigenvector of the covariance matrix with the largest eigenvalue.',
        a: 'We want the unit direction v that maximizes the variance of the data projected onto it: max_{||v||=1} Var(Xv) = v^T Σ v, where Σ is the covariance matrix. Using a Lagrange multiplier for the constraint v^Tv=1: L(v,λ) = v^TΣv - λ(v^Tv - 1). Setting the gradient to zero: 2Σv - 2λv = 0, i.e., Σv = λv — so v must be an eigenvector of Σ with eigenvalue λ. Since v^TΣv = v^T(λv) = λ at any such stationary point, the variance captured equals the eigenvalue, so to maximize variance we pick the eigenvector with the largest eigenvalue — that is the first principal component.',
      },
      {
        q: 'Why must you standardize features before PCA, and what happens if you skip it?',
        a: 'PCA finds directions of maximum variance, and variance is measured in the original units of each feature — a feature measured in larger raw numbers (e.g., salary in rupees vs. an age in years) will have artificially larger variance purely due to scale, not because it is more informative, and PCA will be dominated by that feature\'s axis almost regardless of the true underlying correlation structure. Standardizing each feature to zero mean and unit variance ensures PCA is finding variance driven by actual relationships between features rather than arbitrary unit choices — equivalent to computing PCA on the correlation matrix instead of the raw covariance matrix.',
      },
      {
        q: 'Is PCA a feature selection technique? If not, what is it, and what would you use instead if you need actual feature selection?',
        a: 'No — PCA is a feature extraction / dimensionality reduction technique. Each principal component is a linear combination of all original features (weighted by the corresponding eigenvector\'s coefficients), so after PCA you no longer have any of your original, individually interpretable features — you have new synthetic axes. If you need to select a subset of the actual original features (for interpretability, deployment simplicity, or regulatory requirements), use Lasso regression, tree-based feature importance, recursive feature elimination, or mutual-information-based filter methods instead.',
      },
      {
        q: 'Can PCA discard information that is actually important for predicting your target label? Give an example.',
        a: 'Yes — PCA is entirely unsupervised and ranks components purely by how much variance they explain in the feature space, with no knowledge of the target variable, so it is entirely possible for a low-variance direction to be highly predictive of the target while a high-variance direction is pure noise or irrelevant. For example, in a fraud dataset, transaction amount might have huge variance (driving PC1) but be a weak fraud predictor, while a subtle, low-variance flag like "billing/shipping address mismatch" could be a near-perfect predictor of fraud yet get compressed away if you keep only the first few principal components. In such supervised settings, consider Linear Discriminant Analysis (which explicitly maximizes class separability) or supervised feature selection instead of, or alongside, PCA.',
      },
      {
        q: 'How would you decide how many principal components to keep for a downstream classification model?',
        a: 'Plot the cumulative explained variance ratio against the number of components and pick the smallest k that reaches a chosen threshold (e.g., 90-95%), or look at the scree plot for an elbow where additional components add little variance. But since the ultimate goal is downstream classification performance, not variance explained per se, I would treat k itself as a hyperparameter — run cross-validation with the downstream model (e.g., logistic regression or XGBoost) across a range of k values and pick the k that actually maximizes validation performance (e.g., AUC), since the "best" number of components for pure variance capture and for predictive performance don\'t always coincide.',
      },
    ],
  },
]
