export interface CodeExercise {
  algorithmSlug: string
  prompt: string
  starterCode: string
  solutionCode: string
}

export const codeExercises: CodeExercise[] = [
  {
    algorithmSlug: 'linear-regression',
    prompt: 'Implement Linear Regression from scratch using batch gradient descent. No sklearn allowed. Verify against sklearn.linear_model.LinearRegression on a synthetic dataset.',
    starterCode: `import numpy as np

class LinearRegressionGD:
    def __init__(self, lr=0.01, n_iters=1000):
        self.lr = lr
        self.n_iters = n_iters
        self.w = None
        self.b = None

    def fit(self, X, y):
        n_samples, n_features = X.shape
        # TODO: initialize self.w (zeros, shape n_features) and self.b (0)
        # TODO: run gradient descent for self.n_iters steps
        #   y_pred = X @ w + b
        #   dw = (1/n) * X.T @ (y_pred - y)
        #   db = (1/n) * sum(y_pred - y)
        #   w -= lr * dw ; b -= lr * db
        pass

    def predict(self, X):
        # TODO
        pass
`,
    solutionCode: `import numpy as np

class LinearRegressionGD:
    def __init__(self, lr=0.01, n_iters=1000):
        self.lr = lr
        self.n_iters = n_iters
        self.w = None
        self.b = None

    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.w = np.zeros(n_features)
        self.b = 0.0
        for _ in range(self.n_iters):
            y_pred = X @ self.w + self.b
            error = y_pred - y
            dw = (1 / n_samples) * X.T @ error
            db = (1 / n_samples) * np.sum(error)
            self.w -= self.lr * dw
            self.b -= self.lr * db
        return self

    def predict(self, X):
        return X @ self.w + self.b


if __name__ == "__main__":
    rng = np.random.default_rng(42)
    X = rng.normal(size=(200, 3))
    true_w, true_b = np.array([1.5, -2.0, 0.5]), 4.0
    y = X @ true_w + true_b + rng.normal(scale=0.1, size=200)

    model = LinearRegressionGD(lr=0.1, n_iters=2000).fit(X, y)
    print("learned w:", model.w, "learned b:", model.b)  # should be close to true_w, true_b

    from sklearn.linear_model import LinearRegression
    sk = LinearRegression().fit(X, y)
    print("sklearn w:", sk.coef_, "sklearn b:", sk.intercept_)
`,
  },
  {
    algorithmSlug: 'regularization',
    prompt: 'Implement Ridge Regression using the closed-form solution, and Lasso Regression using coordinate descent. Compare coefficients as lambda increases.',
    starterCode: `import numpy as np

def ridge_closed_form(X, y, lam):
    # TODO: add intercept column, compute w = (X^T X + lam*I)^-1 X^T y
    # (do not regularize the intercept term)
    pass

def lasso_coordinate_descent(X, y, lam, n_iters=1000):
    # TODO: implement coordinate descent.
    # For each feature j, compute the partial residual excluding feature j,
    # then apply the soft-thresholding operator:
    #   w_j = sign(rho_j) * max(|rho_j| - lam, 0) / (sum of X[:,j]**2)
    pass
`,
    solutionCode: `import numpy as np

def ridge_closed_form(X, y, lam):
    n, p = X.shape
    X_b = np.hstack([np.ones((n, 1)), X])
    I = np.eye(p + 1)
    I[0, 0] = 0  # don't regularize intercept
    w = np.linalg.inv(X_b.T @ X_b + lam * I) @ X_b.T @ y
    return w  # w[0] is intercept, w[1:] are coefficients

def soft_threshold(rho, lam):
    if rho < -lam:
        return rho + lam
    elif rho > lam:
        return rho - lam
    return 0.0

def lasso_coordinate_descent(X, y, lam, n_iters=1000):
    n, p = X.shape
    w = np.zeros(p)
    for _ in range(n_iters):
        for j in range(p):
            X_j = X[:, j]
            residual = y - (X @ w - X_j * w[j])  # residual excluding feature j
            rho_j = X_j @ residual
            z_j = X_j @ X_j
            w[j] = soft_threshold(rho_j, lam * n) / z_j if z_j > 0 else 0.0
    return w

if __name__ == "__main__":
    rng = np.random.default_rng(0)
    X = rng.normal(size=(300, 10))
    true_w = np.array([3, 0, 0, 2, 0, 0, 0, -1.5, 0, 0])
    y = X @ true_w + rng.normal(scale=0.3, size=300)

    for lam in [0.01, 0.1, 1.0, 5.0]:
        w = lasso_coordinate_descent(X, y, lam, n_iters=200)
        print(f"lambda={lam}: nonzero coeffs = {np.sum(np.abs(w) > 1e-4)} / {len(w)}")
`,
  },
  {
    algorithmSlug: 'logistic-regression',
    prompt: 'Implement binary Logistic Regression from scratch with sigmoid activation, cross-entropy loss, and gradient descent. Add L2 regularization.',
    starterCode: `import numpy as np

def sigmoid(z):
    # TODO: numerically stable sigmoid
    pass

class LogisticRegressionGD:
    def __init__(self, lr=0.1, n_iters=1000, l2=0.0):
        self.lr, self.n_iters, self.l2 = lr, n_iters, l2

    def fit(self, X, y):
        # TODO: gradient descent minimizing binary cross-entropy + l2 * ||w||^2
        pass

    def predict_proba(self, X):
        pass

    def predict(self, X, threshold=0.5):
        pass
`,
    solutionCode: `import numpy as np

def sigmoid(z):
    return np.where(z >= 0, 1 / (1 + np.exp(-z)), np.exp(z) / (1 + np.exp(z)))

class LogisticRegressionGD:
    def __init__(self, lr=0.1, n_iters=1000, l2=0.0):
        self.lr, self.n_iters, self.l2 = lr, n_iters, l2
        self.w, self.b = None, None

    def fit(self, X, y):
        n, p = X.shape
        self.w = np.zeros(p)
        self.b = 0.0
        for _ in range(self.n_iters):
            z = X @ self.w + self.b
            p_hat = sigmoid(z)
            error = p_hat - y
            dw = (X.T @ error) / n + self.l2 * self.w
            db = np.mean(error)
            self.w -= self.lr * dw
            self.b -= self.lr * db
        return self

    def predict_proba(self, X):
        return sigmoid(X @ self.w + self.b)

    def predict(self, X, threshold=0.5):
        return (self.predict_proba(X) >= threshold).astype(int)

if __name__ == "__main__":
    rng = np.random.default_rng(1)
    n = 500
    X = rng.normal(size=(n, 2))
    y = (X[:, 0] + 0.5 * X[:, 1] > 0).astype(int)

    model = LogisticRegressionGD(lr=0.5, n_iters=3000, l2=0.01).fit(X, y)
    preds = model.predict(X)
    print("train accuracy:", np.mean(preds == y))
`,
  },
  {
    algorithmSlug: 'knn',
    prompt: 'Implement K-Nearest Neighbors classification from scratch with vectorized Euclidean distance (no loops over training points).',
    starterCode: `import numpy as np
from collections import Counter

class KNNClassifier:
    def __init__(self, k=5):
        self.k = k

    def fit(self, X, y):
        self.X_train, self.y_train = X, y
        return self

    def predict(self, X):
        # TODO: for each row in X, compute distance to every X_train row (vectorized),
        # find k smallest, majority vote
        pass
`,
    solutionCode: `import numpy as np
from collections import Counter

class KNNClassifier:
    def __init__(self, k=5):
        self.k = k

    def fit(self, X, y):
        self.X_train, self.y_train = X, y
        return self

    def predict(self, X):
        # Vectorized squared euclidean distance: ||a-b||^2 = ||a||^2 + ||b||^2 - 2a.b
        train_sq = np.sum(self.X_train**2, axis=1)         # (n_train,)
        test_sq = np.sum(X**2, axis=1)[:, None]             # (n_test, 1)
        cross = X @ self.X_train.T                          # (n_test, n_train)
        dists = test_sq + train_sq[None, :] - 2 * cross      # (n_test, n_train)

        preds = []
        for row in dists:
            nearest_idx = np.argpartition(row, self.k)[: self.k]
            nearest_labels = self.y_train[nearest_idx]
            preds.append(Counter(nearest_labels).most_common(1)[0][0])
        return np.array(preds)

if __name__ == "__main__":
    rng = np.random.default_rng(2)
    X_train = np.vstack([rng.normal(0, 1, (50, 2)), rng.normal(4, 1, (50, 2))])
    y_train = np.array([0] * 50 + [1] * 50)
    X_test = np.array([[0, 0], [4, 4], [2, 2]])

    knn = KNNClassifier(k=5).fit(X_train, y_train)
    print(knn.predict(X_test))
`,
  },
  {
    algorithmSlug: 'naive-bayes',
    prompt: 'Implement Multinomial Naive Bayes from scratch (for text/count data) with Laplace smoothing and log-space scoring.',
    starterCode: `import numpy as np

class MultinomialNaiveBayes:
    def __init__(self, alpha=1.0):
        self.alpha = alpha

    def fit(self, X, y):
        # X: (n_samples, n_features) word counts. y: class labels (0..K-1)
        # TODO: compute self.class_log_prior_ (log P(y=k))
        # TODO: compute self.feature_log_prob_ (log P(x_i | y=k)) with Laplace smoothing
        pass

    def predict(self, X):
        # TODO: score = class_log_prior + X @ feature_log_prob_.T ; argmax per row
        pass
`,
    solutionCode: `import numpy as np

class MultinomialNaiveBayes:
    def __init__(self, alpha=1.0):
        self.alpha = alpha

    def fit(self, X, y):
        self.classes_ = np.unique(y)
        n_classes = len(self.classes_)
        n_features = X.shape[1]

        self.class_log_prior_ = np.zeros(n_classes)
        self.feature_log_prob_ = np.zeros((n_classes, n_features))

        for idx, c in enumerate(self.classes_):
            X_c = X[y == c]
            self.class_log_prior_[idx] = np.log(X_c.shape[0] / X.shape[0])
            word_counts = X_c.sum(axis=0) + self.alpha
            total = word_counts.sum()
            self.feature_log_prob_[idx] = np.log(word_counts / total)
        return self

    def predict(self, X):
        scores = X @ self.feature_log_prob_.T + self.class_log_prior_
        return self.classes_[np.argmax(scores, axis=1)]

if __name__ == "__main__":
    # toy "bag of words": [free, prize, meeting, report]
    X = np.array([
        [3, 2, 0, 0],   # spam
        [2, 3, 0, 0],   # spam
        [0, 0, 3, 2],   # ham
        [0, 0, 2, 3],   # ham
    ])
    y = np.array(["spam", "spam", "ham", "ham"])

    nb = MultinomialNaiveBayes(alpha=1.0).fit(X, y)
    test = np.array([[4, 3, 0, 0], [0, 1, 2, 4]])
    print(nb.predict(test))  # expect ['spam', 'ham']
`,
  },
  {
    algorithmSlug: 'decision-trees',
    prompt: 'Implement a CART-style Decision Tree classifier from scratch using Gini impurity, with a max_depth stopping rule.',
    starterCode: `import numpy as np

class Node:
    def __init__(self, feature=None, threshold=None, left=None, right=None, value=None):
        self.feature, self.threshold = feature, threshold
        self.left, self.right, self.value = left, right, value

def gini(y):
    # TODO: 1 - sum(p_k^2)
    pass

def best_split(X, y):
    # TODO: try every feature and every unique threshold, pick the one
    # minimizing weighted child Gini impurity. Return (feature, threshold).
    pass

class DecisionTreeClassifier:
    def __init__(self, max_depth=5, min_samples_split=2):
        self.max_depth, self.min_samples_split = max_depth, min_samples_split

    def fit(self, X, y):
        self.root = self._grow(X, y, depth=0)
        return self

    def _grow(self, X, y, depth):
        # TODO: recursive tree building with stopping conditions
        pass

    def predict(self, X):
        # TODO: traverse tree per row
        pass
`,
    solutionCode: `import numpy as np

class Node:
    def __init__(self, feature=None, threshold=None, left=None, right=None, value=None):
        self.feature, self.threshold = feature, threshold
        self.left, self.right, self.value = left, right, value

def gini(y):
    _, counts = np.unique(y, return_counts=True)
    p = counts / counts.sum()
    return 1 - np.sum(p ** 2)

def best_split(X, y):
    n_samples, n_features = X.shape
    best_gain, best_feat, best_thresh = -1, None, None
    parent_gini = gini(y)

    for feat in range(n_features):
        thresholds = np.unique(X[:, feat])
        for t in thresholds:
            left_mask = X[:, feat] <= t
            right_mask = ~left_mask
            if left_mask.sum() == 0 or right_mask.sum() == 0:
                continue
            n_left, n_right = left_mask.sum(), right_mask.sum()
            weighted_gini = (n_left / n_samples) * gini(y[left_mask]) + \\
                            (n_right / n_samples) * gini(y[right_mask])
            gain = parent_gini - weighted_gini
            if gain > best_gain:
                best_gain, best_feat, best_thresh = gain, feat, t
    return best_feat, best_thresh, best_gain

class DecisionTreeClassifier:
    def __init__(self, max_depth=5, min_samples_split=2):
        self.max_depth, self.min_samples_split = max_depth, min_samples_split

    def fit(self, X, y):
        self.root = self._grow(X, y, depth=0)
        return self

    def _grow(self, X, y, depth):
        if len(np.unique(y)) == 1 or depth >= self.max_depth or len(y) < self.min_samples_split:
            return Node(value=np.bincount(y).argmax())

        feat, thresh, gain = best_split(X, y)
        if feat is None or gain <= 0:
            return Node(value=np.bincount(y).argmax())

        left_mask = X[:, feat] <= thresh
        left = self._grow(X[left_mask], y[left_mask], depth + 1)
        right = self._grow(X[~left_mask], y[~left_mask], depth + 1)
        return Node(feature=feat, threshold=thresh, left=left, right=right)

    def _predict_row(self, row, node):
        if node.value is not None:
            return node.value
        branch = node.left if row[node.feature] <= node.threshold else node.right
        return self._predict_row(row, branch)

    def predict(self, X):
        return np.array([self._predict_row(row, self.root) for row in X])

if __name__ == "__main__":
    from sklearn.datasets import make_classification
    X, y = make_classification(n_samples=200, n_features=4, random_state=3)
    tree = DecisionTreeClassifier(max_depth=4).fit(X, y)
    print("train accuracy:", (tree.predict(X) == y).mean())
`,
  },
  {
    algorithmSlug: 'svm',
    prompt: 'Implement a linear SVM classifier from scratch using the hinge loss and subgradient descent (Pegasos-style).',
    starterCode: `import numpy as np

class LinearSVM:
    def __init__(self, lr=0.001, lam=0.01, n_iters=1000):
        self.lr, self.lam, self.n_iters = lr, lam, n_iters

    def fit(self, X, y):
        # y should be -1/+1 labels
        # TODO: for each sample, if y_i(w.x_i+b) >= 1: gradient is just regularization (lam*w)
        # else: gradient includes -y_i*x_i term (hinge loss subgradient)
        pass

    def predict(self, X):
        pass
`,
    solutionCode: `import numpy as np

class LinearSVM:
    def __init__(self, lr=0.001, lam=0.01, n_iters=1000):
        self.lr, self.lam, self.n_iters = lr, lam, n_iters
        self.w, self.b = None, None

    def fit(self, X, y):
        n_samples, n_features = X.shape
        y_ = np.where(y <= 0, -1, 1)
        self.w = np.zeros(n_features)
        self.b = 0.0

        for _ in range(self.n_iters):
            for i in range(n_samples):
                margin = y_[i] * (X[i] @ self.w + self.b)
                if margin >= 1:
                    # only regularization term, no hinge loss contribution
                    self.w -= self.lr * (2 * self.lam * self.w)
                else:
                    self.w -= self.lr * (2 * self.lam * self.w - y_[i] * X[i])
                    self.b -= self.lr * (-y_[i])
        return self

    def predict(self, X):
        return np.sign(X @ self.w + self.b)

if __name__ == "__main__":
    from sklearn.datasets import make_blobs
    X, y = make_blobs(n_samples=100, centers=2, random_state=4, cluster_std=1.2)
    y = np.where(y == 0, -1, 1)

    svm = LinearSVM(lr=0.001, lam=0.01, n_iters=200).fit(X, y)
    preds = svm.predict(X)
    print("train accuracy:", (preds == y).mean())
`,
  },
  {
    algorithmSlug: 'random-forest',
    prompt: 'Implement a Random Forest classifier from scratch by bootstrapping samples and averaging predictions from multiple (sklearn) decision trees with random feature subsets.',
    starterCode: `import numpy as np
from sklearn.tree import DecisionTreeClassifier

class RandomForestScratch:
    def __init__(self, n_estimators=10, max_features='sqrt', max_depth=None, random_state=0):
        self.n_estimators = n_estimators
        self.max_features = max_features
        self.max_depth = max_depth
        self.random_state = random_state

    def fit(self, X, y):
        # TODO: for each of n_estimators:
        #   1. bootstrap sample rows (sample n rows with replacement)
        #   2. train a DecisionTreeClassifier(max_features=self.max_features) on the bootstrap sample
        #   3. store the fitted tree
        pass

    def predict(self, X):
        # TODO: collect predictions from every tree, take majority vote per row
        pass
`,
    solutionCode: `import numpy as np
from sklearn.tree import DecisionTreeClassifier
from scipy import stats

class RandomForestScratch:
    def __init__(self, n_estimators=10, max_features='sqrt', max_depth=None, random_state=0):
        self.n_estimators = n_estimators
        self.max_features = max_features
        self.max_depth = max_depth
        self.random_state = random_state
        self.trees = []

    def fit(self, X, y):
        rng = np.random.default_rng(self.random_state)
        n_samples = X.shape[0]
        self.trees = []
        for i in range(self.n_estimators):
            idx = rng.integers(0, n_samples, size=n_samples)  # bootstrap with replacement
            X_boot, y_boot = X[idx], y[idx]
            tree = DecisionTreeClassifier(
                max_features=self.max_features,
                max_depth=self.max_depth,
                random_state=self.random_state + i,
            )
            tree.fit(X_boot, y_boot)
            self.trees.append(tree)
        return self

    def predict(self, X):
        all_preds = np.array([tree.predict(X) for tree in self.trees])  # (n_trees, n_samples)
        majority, _ = stats.mode(all_preds, axis=0, keepdims=False)
        return majority

if __name__ == "__main__":
    from sklearn.datasets import make_classification
    X, y = make_classification(n_samples=300, n_features=6, random_state=5)
    rf = RandomForestScratch(n_estimators=25, max_depth=5).fit(X, y)
    print("train accuracy:", (rf.predict(X) == y).mean())
`,
  },
  {
    algorithmSlug: 'gradient-boosting',
    prompt: 'Implement Gradient Boosting for regression from scratch: sequentially fit trees to residuals with a learning rate (shrinkage).',
    starterCode: `import numpy as np
from sklearn.tree import DecisionTreeRegressor

class GradientBoostingRegressorScratch:
    def __init__(self, n_estimators=100, learning_rate=0.1, max_depth=2):
        self.n_estimators = n_estimators
        self.learning_rate = learning_rate
        self.max_depth = max_depth

    def fit(self, X, y):
        # TODO: 1. initial prediction = mean(y)
        # TODO: 2. for each round: compute residuals = y - current_prediction
        #          fit a tree to residuals, update prediction += lr * tree.predict(X)
        #          store tree
        pass

    def predict(self, X):
        # TODO: sum initial prediction + lr * every tree's prediction
        pass
`,
    solutionCode: `import numpy as np
from sklearn.tree import DecisionTreeRegressor

class GradientBoostingRegressorScratch:
    def __init__(self, n_estimators=100, learning_rate=0.1, max_depth=2):
        self.n_estimators = n_estimators
        self.learning_rate = learning_rate
        self.max_depth = max_depth
        self.trees = []
        self.init_pred = None

    def fit(self, X, y):
        self.init_pred = np.mean(y)
        current_pred = np.full(y.shape, self.init_pred, dtype=float)
        self.trees = []

        for _ in range(self.n_estimators):
            residuals = y - current_pred  # pseudo-residuals for squared-error loss
            tree = DecisionTreeRegressor(max_depth=self.max_depth)
            tree.fit(X, residuals)
            current_pred += self.learning_rate * tree.predict(X)
            self.trees.append(tree)
        return self

    def predict(self, X):
        pred = np.full(X.shape[0], self.init_pred, dtype=float)
        for tree in self.trees:
            pred += self.learning_rate * tree.predict(X)
        return pred

if __name__ == "__main__":
    rng = np.random.default_rng(6)
    X = rng.normal(size=(300, 3))
    y = X[:, 0] ** 2 + 0.5 * X[:, 1] - X[:, 2] + rng.normal(scale=0.1, size=300)

    gbm = GradientBoostingRegressorScratch(n_estimators=100, learning_rate=0.1, max_depth=2).fit(X, y)
    preds = gbm.predict(X)
    print("train MSE:", np.mean((preds - y) ** 2))
`,
  },
  {
    algorithmSlug: 'kmeans',
    prompt: 'Implement K-Means clustering from scratch, including K-Means++ initialization.',
    starterCode: `import numpy as np

class KMeansScratch:
    def __init__(self, k=3, n_iters=100, random_state=0):
        self.k, self.n_iters, self.random_state = k, n_iters, random_state

    def _init_centroids_pp(self, X):
        # TODO: K-Means++ initialization
        pass

    def fit(self, X):
        # TODO: iterate assignment step + update step until convergence
        pass

    def predict(self, X):
        # TODO: assign each point to nearest centroid
        pass
`,
    solutionCode: `import numpy as np

class KMeansScratch:
    def __init__(self, k=3, n_iters=100, random_state=0):
        self.k, self.n_iters, self.random_state = k, n_iters, random_state
        self.centroids = None

    def _init_centroids_pp(self, X):
        rng = np.random.default_rng(self.random_state)
        n = X.shape[0]
        centroids = [X[rng.integers(n)]]
        for _ in range(1, self.k):
            dists = np.min(
                [np.sum((X - c) ** 2, axis=1) for c in centroids], axis=0
            )
            probs = dists / dists.sum()
            next_idx = rng.choice(n, p=probs)
            centroids.append(X[next_idx])
        return np.array(centroids)

    def fit(self, X):
        self.centroids = self._init_centroids_pp(X)
        for _ in range(self.n_iters):
            dists = np.array([np.sum((X - c) ** 2, axis=1) for c in self.centroids]).T
            labels = np.argmin(dists, axis=1)

            new_centroids = np.array([
                X[labels == k].mean(axis=0) if np.any(labels == k) else self.centroids[k]
                for k in range(self.k)
            ])
            if np.allclose(new_centroids, self.centroids):
                break
            self.centroids = new_centroids
        self.labels_ = labels
        return self

    def predict(self, X):
        dists = np.array([np.sum((X - c) ** 2, axis=1) for c in self.centroids]).T
        return np.argmin(dists, axis=1)

if __name__ == "__main__":
    rng = np.random.default_rng(7)
    X = np.vstack([
        rng.normal([0, 0], 0.5, (50, 2)),
        rng.normal([5, 5], 0.5, (50, 2)),
        rng.normal([0, 5], 0.5, (50, 2)),
    ])
    km = KMeansScratch(k=3, random_state=7).fit(X)
    print("centroids:\\n", km.centroids)
`,
  },
  {
    algorithmSlug: 'hierarchical-clustering',
    prompt: 'Implement agglomerative hierarchical clustering from scratch with single linkage, returning merge history for a dendrogram.',
    starterCode: `import numpy as np

def euclidean(a, b):
    return np.sqrt(np.sum((a - b) ** 2))

def agglomerative_single_linkage(X, n_clusters=1):
    # TODO: start with every point as its own cluster.
    # Repeatedly find the two clusters with minimum single-linkage distance
    # (min distance between any pair of points across the two clusters) and merge them.
    # Stop when only n_clusters remain. Return list of merges: (cluster_a, cluster_b, distance).
    pass
`,
    solutionCode: `import numpy as np

def euclidean(a, b):
    return np.sqrt(np.sum((a - b) ** 2))

def agglomerative_single_linkage(X, n_clusters=1):
    n = X.shape[0]
    clusters = {i: [i] for i in range(n)}
    merges = []
    next_id = n

    while len(clusters) > n_clusters:
        best_pair, best_dist = None, np.inf
        ids = list(clusters.keys())
        for i in range(len(ids)):
            for j in range(i + 1, len(ids)):
                ci, cj = clusters[ids[i]], clusters[ids[j]]
                # single linkage: min distance between any pair of points across clusters
                d = min(euclidean(X[a], X[b]) for a in ci for b in cj)
                if d < best_dist:
                    best_dist, best_pair = d, (ids[i], ids[j])

        a, b = best_pair
        merged = clusters.pop(a) + clusters.pop(b)
        clusters[next_id] = merged
        merges.append((a, b, best_dist, len(merged)))
        next_id += 1

    return merges, clusters

if __name__ == "__main__":
    rng = np.random.default_rng(8)
    X = np.vstack([rng.normal([0, 0], 0.3, (5, 2)), rng.normal([5, 5], 0.3, (5, 2))])
    merges, final_clusters = agglomerative_single_linkage(X, n_clusters=2)
    for m in merges:
        print(f"merged clusters {m[0]} and {m[1]} at distance {m[2]:.3f} (size {m[3]})")
`,
  },
  {
    algorithmSlug: 'pca',
    prompt: 'Implement PCA from scratch using SVD (not eigendecomposition of the covariance matrix) and compare explained variance ratio to sklearn.',
    starterCode: `import numpy as np

class PCAScratch:
    def __init__(self, n_components):
        self.n_components = n_components

    def fit(self, X):
        # TODO: 1. center X (subtract mean)
        # TODO: 2. compute SVD: U, S, Vt = np.linalg.svd(X_centered, full_matrices=False)
        # TODO: 3. self.components_ = Vt[:n_components]
        # TODO: 4. explained_variance = S**2 / (n_samples - 1); store explained_variance_ratio_
        pass

    def transform(self, X):
        # TODO: project centered X onto self.components_
        pass
`,
    solutionCode: `import numpy as np

class PCAScratch:
    def __init__(self, n_components):
        self.n_components = n_components

    def fit(self, X):
        self.mean_ = X.mean(axis=0)
        X_centered = X - self.mean_
        U, S, Vt = np.linalg.svd(X_centered, full_matrices=False)

        self.components_ = Vt[: self.n_components]
        explained_variance = (S ** 2) / (X.shape[0] - 1)
        self.explained_variance_ratio_ = explained_variance[: self.n_components] / explained_variance.sum()
        return self

    def transform(self, X):
        return (X - self.mean_) @ self.components_.T

if __name__ == "__main__":
    from sklearn.datasets import load_iris
    from sklearn.decomposition import PCA

    X = load_iris().data
    X_std = (X - X.mean(axis=0)) / X.std(axis=0)

    mine = PCAScratch(n_components=2).fit(X_std)
    print("scratch explained variance ratio:", mine.explained_variance_ratio_)

    sk = PCA(n_components=2).fit(X_std)
    print("sklearn explained variance ratio:", sk.explained_variance_ratio_)
`,
  },
  {
    algorithmSlug: 'neural-networks-backprop',
    prompt: 'Implement a 2-layer neural network (one hidden layer, ReLU, sigmoid output) from scratch with manual forward and backward passes for binary classification.',
    starterCode: `import numpy as np

def relu(z):
    pass

def relu_deriv(z):
    pass

def sigmoid(z):
    pass

class TwoLayerNet:
    def __init__(self, n_input, n_hidden, lr=0.1):
        rng = np.random.default_rng(0)
        # He initialization for ReLU hidden layer
        self.W1 = rng.normal(0, np.sqrt(2 / n_input), (n_input, n_hidden))
        self.b1 = np.zeros(n_hidden)
        self.W2 = rng.normal(0, np.sqrt(2 / n_hidden), (n_hidden, 1))
        self.b2 = np.zeros(1)
        self.lr = lr

    def forward(self, X):
        # TODO: z1 = X @ W1 + b1 ; a1 = relu(z1) ; z2 = a1 @ W2 + b2 ; a2 = sigmoid(z2)
        pass

    def backward(self, X, y, cache):
        # TODO: compute gradients via chain rule and update W1, b1, W2, b2
        pass

    def train(self, X, y, epochs=1000):
        pass
`,
    solutionCode: `import numpy as np

def relu(z):
    return np.maximum(0, z)

def relu_deriv(z):
    return (z > 0).astype(float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

class TwoLayerNet:
    def __init__(self, n_input, n_hidden, lr=0.1):
        rng = np.random.default_rng(0)
        self.W1 = rng.normal(0, np.sqrt(2 / n_input), (n_input, n_hidden))
        self.b1 = np.zeros(n_hidden)
        self.W2 = rng.normal(0, np.sqrt(2 / n_hidden), (n_hidden, 1))
        self.b2 = np.zeros(1)
        self.lr = lr

    def forward(self, X):
        z1 = X @ self.W1 + self.b1
        a1 = relu(z1)
        z2 = a1 @ self.W2 + self.b2
        a2 = sigmoid(z2)
        cache = (X, z1, a1, z2, a2)
        return a2, cache

    def backward(self, y, cache):
        X, z1, a1, z2, a2 = cache
        n = X.shape[0]
        y = y.reshape(-1, 1)

        dz2 = a2 - y                          # (n,1), from d(BCE)/dz2 for sigmoid output
        dW2 = a1.T @ dz2 / n
        db2 = np.mean(dz2, axis=0)

        da1 = dz2 @ self.W2.T                 # (n, n_hidden)
        dz1 = da1 * relu_deriv(z1)
        dW1 = X.T @ dz1 / n
        db1 = np.mean(dz1, axis=0)

        self.W2 -= self.lr * dW2
        self.b2 -= self.lr * db2
        self.W1 -= self.lr * dW1
        self.b1 -= self.lr * db1

    def train(self, X, y, epochs=1000):
        for _ in range(epochs):
            a2, cache = self.forward(X)
            self.backward(y, cache)
        return self

if __name__ == "__main__":
    rng = np.random.default_rng(9)
    X = rng.normal(size=(400, 2))
    y = ((X[:, 0] ** 2 + X[:, 1] ** 2) < 1).astype(float)  # non-linear circular boundary

    net = TwoLayerNet(n_input=2, n_hidden=16, lr=0.5).train(X, y, epochs=3000)
    preds, _ = net.forward(X)
    acc = np.mean((preds.ravel() > 0.5) == y)
    print("train accuracy on non-linear boundary:", acc)  # logistic regression alone could not solve this
`,
  },
  {
    algorithmSlug: 'cnn',
    prompt: 'Implement a 2D convolution operation (valid padding, arbitrary stride) from scratch using numpy, and verify it against a manual example.',
    starterCode: `import numpy as np

def conv2d(image, kernel, stride=1):
    # image: (H, W), kernel: (kH, kW)
    # TODO: compute output size, then slide the kernel and compute dot products
    pass
`,
    solutionCode: `import numpy as np

def conv2d(image, kernel, stride=1):
    H, W = image.shape
    kH, kW = kernel.shape
    out_h = (H - kH) // stride + 1
    out_w = (W - kW) // stride + 1
    output = np.zeros((out_h, out_w))

    for i in range(out_h):
        for j in range(out_w):
            row_start, col_start = i * stride, j * stride
            patch = image[row_start:row_start + kH, col_start:col_start + kW]
            output[i, j] = np.sum(patch * kernel)
    return output

if __name__ == "__main__":
    image = np.array([
        [1, 2, 3, 0],
        [4, 5, 6, 1],
        [7, 8, 9, 2],
        [1, 1, 1, 1],
    ], dtype=float)

    sobel_x = np.array([
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
    ], dtype=float)  # vertical edge detector

    print(conv2d(image, sobel_x, stride=1))

    # verify output size formula: out = floor((n - k)/s) + 1
    assert conv2d(image, sobel_x, stride=1).shape == (2, 2)
`,
  },
  {
    algorithmSlug: 'rnn-lstm',
    prompt: 'Implement the forward pass of a vanilla RNN cell and an LSTM cell from scratch for a single time step, then unroll across a sequence.',
    starterCode: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

class VanillaRNNCell:
    def __init__(self, n_input, n_hidden):
        rng = np.random.default_rng(0)
        self.Wxh = rng.normal(0, 0.1, (n_input, n_hidden))
        self.Whh = rng.normal(0, 0.1, (n_hidden, n_hidden))
        self.bh = np.zeros(n_hidden)

    def step(self, x_t, h_prev):
        # TODO: h_t = tanh(x_t @ Wxh + h_prev @ Whh + bh)
        pass

class LSTMCell:
    def __init__(self, n_input, n_hidden):
        # TODO: initialize weight matrices for forget, input, candidate, output gates
        pass

    def step(self, x_t, h_prev, c_prev):
        # TODO: implement the 4 gate equations and cell/hidden state update
        pass
`,
    solutionCode: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

class VanillaRNNCell:
    def __init__(self, n_input, n_hidden):
        rng = np.random.default_rng(0)
        self.Wxh = rng.normal(0, 0.1, (n_input, n_hidden))
        self.Whh = rng.normal(0, 0.1, (n_hidden, n_hidden))
        self.bh = np.zeros(n_hidden)

    def step(self, x_t, h_prev):
        return np.tanh(x_t @ self.Wxh + h_prev @ self.Whh + self.bh)

class LSTMCell:
    def __init__(self, n_input, n_hidden):
        rng = np.random.default_rng(1)
        concat_dim = n_input + n_hidden
        scale = 0.1
        self.Wf = rng.normal(0, scale, (concat_dim, n_hidden)); self.bf = np.zeros(n_hidden)
        self.Wi = rng.normal(0, scale, (concat_dim, n_hidden)); self.bi = np.zeros(n_hidden)
        self.Wc = rng.normal(0, scale, (concat_dim, n_hidden)); self.bc = np.zeros(n_hidden)
        self.Wo = rng.normal(0, scale, (concat_dim, n_hidden)); self.bo = np.zeros(n_hidden)

    def step(self, x_t, h_prev, c_prev):
        concat = np.concatenate([h_prev, x_t])
        f_t = sigmoid(concat @ self.Wf + self.bf)       # forget gate
        i_t = sigmoid(concat @ self.Wi + self.bi)       # input gate
        c_tilde = np.tanh(concat @ self.Wc + self.bc)   # candidate values
        c_t = f_t * c_prev + i_t * c_tilde              # additive cell state update
        o_t = sigmoid(concat @ self.Wo + self.bo)       # output gate
        h_t = o_t * np.tanh(c_t)
        return h_t, c_t

if __name__ == "__main__":
    n_input, n_hidden, T = 4, 8, 6
    rng = np.random.default_rng(2)
    sequence = [rng.normal(size=n_input) for _ in range(T)]

    lstm = LSTMCell(n_input, n_hidden)
    h, c = np.zeros(n_hidden), np.zeros(n_hidden)
    for t, x_t in enumerate(sequence):
        h, c = lstm.step(x_t, h, c)
        print(f"t={t}, ||h_t||={np.linalg.norm(h):.4f}, ||c_t||={np.linalg.norm(c):.4f}")
`,
  },
  {
    algorithmSlug: 'transformers-attention',
    prompt: 'Implement scaled dot-product self-attention and multi-head attention from scratch using numpy.',
    starterCode: `import numpy as np

def softmax(x, axis=-1):
    pass

def scaled_dot_product_attention(Q, K, V, mask=None):
    # Q, K, V: (seq_len, d_k)
    # TODO: scores = Q @ K.T / sqrt(d_k); apply mask (set masked positions to -inf) if given;
    # softmax(scores) @ V
    pass

def multi_head_attention(X, n_heads, d_model):
    # TODO: split d_model into n_heads pieces, run scaled_dot_product_attention on each,
    # concatenate results back to (seq_len, d_model)
    pass
`,
    solutionCode: `import numpy as np

def softmax(x, axis=-1):
    x = x - np.max(x, axis=axis, keepdims=True)  # numerical stability
    e = np.exp(x)
    return e / np.sum(e, axis=axis, keepdims=True)

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)         # (seq_len, seq_len)
    if mask is not None:
        scores = np.where(mask, scores, -np.inf)  # causal masking, e.g. for a decoder
    weights = softmax(scores, axis=-1)
    return weights @ V, weights

def multi_head_attention(X, n_heads, d_model, seed=0):
    seq_len, _ = X.shape
    d_k = d_model // n_heads
    rng = np.random.default_rng(seed)

    Wq = rng.normal(0, 0.1, (n_heads, d_model, d_k))
    Wk = rng.normal(0, 0.1, (n_heads, d_model, d_k))
    Wv = rng.normal(0, 0.1, (n_heads, d_model, d_k))
    Wo = rng.normal(0, 0.1, (d_model, d_model))

    head_outputs = []
    for h in range(n_heads):
        Q, K, V = X @ Wq[h], X @ Wk[h], X @ Wv[h]
        out, _ = scaled_dot_product_attention(Q, K, V)
        head_outputs.append(out)

    concat = np.concatenate(head_outputs, axis=-1)  # (seq_len, d_model)
    return concat @ Wo

if __name__ == "__main__":
    seq_len, d_model, n_heads = 5, 16, 4
    rng = np.random.default_rng(3)
    X = rng.normal(size=(seq_len, d_model))

    # causal mask for a decoder: position i can only attend to positions <= i
    causal_mask = np.tril(np.ones((seq_len, seq_len), dtype=bool))
    Q = K = V = X
    out, weights = scaled_dot_product_attention(Q, K, V, mask=causal_mask)
    print("attention weights (should be lower-triangular, rows sum to 1):")
    print(np.round(weights, 2))

    mha_out = multi_head_attention(X, n_heads=n_heads, d_model=d_model)
    print("multi-head output shape:", mha_out.shape)
`,
  },
]

export function getExerciseForAlgorithm(slug: string): CodeExercise | undefined {
  return codeExercises.find((e) => e.algorithmSlug === slug)
}
