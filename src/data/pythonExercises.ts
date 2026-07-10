import type { PythonExercise } from '../types'

export const pythonExercises: PythonExercise[] = [
  {
    slug: 'reverse-string',
    title: 'Reverse a String (No Built-in Reverse)',
    difficulty: 'Easy',
    tags: ['strings', 'two-pointer'],
    prompt: 'Reverse a string in place using a two-pointer technique, without using Python\'s built-in [::-1] slicing or reversed().',
    starterCode: `def reverse_string(s):
    chars = list(s)
    left, right = 0, len(chars) - 1
    # TODO: swap characters moving left and right pointers toward the center
    return "".join(chars)

print(reverse_string("interview"))  # expect "weivretni"
print(reverse_string(""))           # expect ""
print(reverse_string("a"))          # expect "a"
`,
    solutionCode: `def reverse_string(s):
    chars = list(s)
    left, right = 0, len(chars) - 1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    return "".join(chars)

print(reverse_string("interview"))
print(reverse_string(""))
print(reverse_string("a"))
`,
    explanation: 'Two pointers starting at opposite ends swap and move toward the center, giving O(n) time and O(n) space (for the list conversion, since Python strings are immutable) — always state this complexity out loud in an interview.',
  },
  {
    slug: 'is-palindrome',
    title: 'Check If a String Is a Palindrome',
    difficulty: 'Easy',
    tags: ['strings', 'two-pointer'],
    prompt: 'Check whether a string is a palindrome, ignoring case and non-alphanumeric characters (e.g. "A man, a plan, a canal: Panama" is a palindrome).',
    starterCode: `def is_palindrome(s):
    cleaned = [c.lower() for c in s if c.isalnum()]
    # TODO: compare cleaned list to its reverse
    return None

print(is_palindrome("A man, a plan, a canal: Panama"))  # True
print(is_palindrome("hello"))  # False
`,
    solutionCode: `def is_palindrome(s):
    cleaned = [c.lower() for c in s if c.isalnum()]
    left, right = 0, len(cleaned) - 1
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    return True

print(is_palindrome("A man, a plan, a canal: Panama"))
print(is_palindrome("hello"))
`,
    explanation: 'Filtering with isalnum() and lower() first handles the "ignore punctuation/case" requirement cleanly, then the same two-pointer comparison used for string reversal checks the palindrome property in O(n) time.',
  },
  {
    slug: 'two-sum',
    title: 'Two Sum (Hash Map, O(n))',
    difficulty: 'Easy',
    tags: ['hash-map', 'arrays'],
    prompt: 'Given a list of numbers and a target, return the indices of the two numbers that add up to the target. Do it in O(n) time, not O(n^2).',
    starterCode: `def two_sum(nums, target):
    seen = {}  # value -> index
    for i, n in enumerate(nums):
        complement = target - n
        # TODO: check if complement is in seen, else record n's index
        pass
    return None

print(two_sum([2, 7, 11, 15], 9))   # expect [0, 1]
print(two_sum([3, 2, 4], 6))        # expect [1, 2]
`,
    solutionCode: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return None

print(two_sum([2, 7, 11, 15], 9))
print(two_sum([3, 2, 4], 6))
`,
    explanation: 'The naive approach checks every pair (O(n²)). Trading space for time — storing each seen value\'s index in a hash map — lets you check for the complement in O(1) per element, giving O(n) overall. This exact "trade space for time via a hash map" pattern recurs constantly in interviews.',
  },
  {
    slug: 'word-frequency-counter',
    title: 'Top K Frequent Words',
    difficulty: 'Easy',
    tags: ['hash-map', 'heapq', 'text'],
    prompt: 'Given a list of words, return the K most frequent ones, most frequent first. Ties can be broken arbitrarily.',
    starterCode: `from collections import Counter
import heapq

def top_k_frequent(words, k):
    counts = Counter(words)
    # TODO: use heapq.nlargest to avoid sorting the entire list when k is small
    return None

words = ["the","quick","fox","the","lazy","fox","the","dog"]
print(top_k_frequent(words, 2))  # expect [('the', 3), ('fox', 2)]
`,
    solutionCode: `from collections import Counter
import heapq

def top_k_frequent(words, k):
    counts = Counter(words)
    return heapq.nlargest(k, counts.items(), key=lambda item: item[1])

words = ["the","quick","fox","the","lazy","fox","the","dog"]
print(top_k_frequent(words, 2))
`,
    explanation: 'heapq.nlargest(k, ...) runs in O(n log k) using a heap of size k, versus O(n log n) for sorting the entire frequency list — a meaningful difference when n is huge and k is small, and exactly the kind of complexity-aware choice interviewers look for.',
  },
  {
    slug: 'fizzbuzz-variant',
    title: 'FizzBuzz With a Twist',
    difficulty: 'Easy',
    tags: ['basics', 'control-flow'],
    prompt: 'Classic FizzBuzz from 1 to n, but replace multiples of 3 with "Fizz", multiples of 5 with "Buzz", multiples of both with "FizzBuzz", AND multiples of 7 with "Bang" appended too (e.g. 105 -> "FizzBuzzBang").',
    starterCode: `def fizzbuzz(n):
    result = []
    for i in range(1, n + 1):
        s = ""
        # TODO: build up s by checking divisibility by 3, 5, 7
        result.append(s if s else str(i))
    return result

print(fizzbuzz(15))
`,
    solutionCode: `def fizzbuzz(n):
    result = []
    for i in range(1, n + 1):
        s = ""
        if i % 3 == 0:
            s += "Fizz"
        if i % 5 == 0:
            s += "Buzz"
        if i % 7 == 0:
            s += "Bang"
        result.append(s if s else str(i))
    return result

print(fizzbuzz(15))
print(fizzbuzz(105)[-1])  # "FizzBuzzBang"
`,
    explanation: 'Building the string incrementally (rather than a chain of if/elif) generalizes cleanly to any number of divisibility rules without combinatorial explosion of branches — a small design choice that matters once requirements grow.',
  },
  {
    slug: 'vectorize-vs-apply',
    title: 'Vectorized Discount Calculation (pandas)',
    difficulty: 'Easy',
    tags: ['pandas', 'vectorization'],
    prompt: 'Given a DataFrame of orders with "price" and "discount_pct" columns, compute the final price WITHOUT using .apply() — use vectorized pandas operations instead.',
    starterCode: `import pandas as pd

df = pd.DataFrame({
    "price": [100, 250, 80, 500],
    "discount_pct": [10, 0, 25, 15],
})

# TODO: compute df["final_price"] using vectorized arithmetic, not .apply()
df["final_price"] = None
print(df)
`,
    solutionCode: `import pandas as pd

df = pd.DataFrame({
    "price": [100, 250, 80, 500],
    "discount_pct": [10, 0, 25, 15],
})

df["final_price"] = df["price"] * (1 - df["discount_pct"] / 100)
print(df)
`,
    explanation: 'Arithmetic directly on pandas Series is vectorized (runs in compiled C/NumPy across the whole column at once), avoiding the per-row Python interpreter overhead that .apply(axis=1) would incur — a 10-100x speedup on large data is common.',
  },
  {
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    tags: ['hash-map', 'strings', 'sorting'],
    prompt: 'Given a list of strings, group the ones that are anagrams of each other.',
    starterCode: `from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        key = None  # TODO: a canonical key that's identical for all anagrams of w
        groups[key].append(w)
    return list(groups.values())

print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))
`,
    solutionCode: `from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        key = "".join(sorted(w))
        groups[key].append(w)
    return list(groups.values())

print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))
`,
    explanation: 'Sorting each word\'s letters produces an identical key for all its anagrams (since anagrams are permutations of the same multiset of letters), letting a hash map group them in O(n * k log k) total time, where k is average word length.',
  },
  {
    slug: 'pandas-transform-feature',
    title: 'Customer Average Order Value as a New Column (transform)',
    difficulty: 'Medium',
    tags: ['pandas', 'groupby', 'feature-engineering'],
    prompt: 'Add a new column "customer_avg_order" to the orders DataFrame giving each customer\'s average order amount, broadcast onto every one of their rows (a classic feature-engineering pattern).',
    starterCode: `import pandas as pd

orders = pd.DataFrame({
    "customer_id": [1, 1, 1, 2, 2, 3],
    "amount": [100, 200, 300, 50, 150, 400],
})

# TODO: use groupby(...).transform(...) — NOT apply — to broadcast the mean back onto every row
orders["customer_avg_order"] = None
print(orders)
`,
    solutionCode: `import pandas as pd

orders = pd.DataFrame({
    "customer_id": [1, 1, 1, 2, 2, 3],
    "amount": [100, 200, 300, 50, 150, 400],
})

orders["customer_avg_order"] = orders.groupby("customer_id")["amount"].transform("mean")
print(orders)
`,
    explanation: '.transform() returns a result the same length as the input, aligned back to the original index — perfect for broadcasting a group-level statistic onto every row without a separate merge. .apply() with a function returning a scalar per group would instead collapse to one row per group.',
  },
  {
    slug: 'merge-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Medium',
    tags: ['two-pointer', 'arrays'],
    prompt: 'Merge two already-sorted lists into one sorted list in O(n+m) time, without just concatenating and calling sort().',
    starterCode: `def merge_sorted(a, b):
    result = []
    i = j = 0
    # TODO: walk both lists with two pointers, always taking the smaller front element
    while i < len(a) and j < len(b):
        pass
    result.extend(a[i:])
    result.extend(b[j:])
    return result

print(merge_sorted([1,3,5,7], [2,4,6]))  # expect [1,2,3,4,5,6,7]
`,
    solutionCode: `def merge_sorted(a, b):
    result = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            j += 1
    result.extend(a[i:])
    result.extend(b[j:])
    return result

print(merge_sorted([1,3,5,7], [2,4,6]))
`,
    explanation: 'This is the merge step of merge sort: since both inputs are already sorted, you never need to look back — always take whichever front element is smaller, advance that pointer, and append leftover elements once one list is exhausted. O(n+m) beats concatenate-then-sort\'s O((n+m) log(n+m)).',
  },
  {
    slug: 'pivot-table-report',
    title: 'Sales Pivot Table (Category × Month)',
    difficulty: 'Medium',
    tags: ['pandas', 'pivot_table'],
    prompt: 'Build a pivot table showing total sales for each product category (rows) by month (columns), filling missing combinations with 0.',
    starterCode: `import pandas as pd

sales = pd.DataFrame({
    "category": ["Electronics","Electronics","Furniture","Furniture","Grocery"],
    "month": ["Jan","Feb","Jan","Mar","Feb"],
    "amount": [1000, 1500, 500, 700, 200],
})

# TODO: pivot_table with index=category, columns=month, values=amount, aggfunc=sum, fill missing with 0
result = None
print(result)
`,
    solutionCode: `import pandas as pd

sales = pd.DataFrame({
    "category": ["Electronics","Electronics","Furniture","Furniture","Grocery"],
    "month": ["Jan","Feb","Jan","Mar","Feb"],
    "amount": [1000, 1500, 500, 700, 200],
})

result = sales.pivot_table(index="category", columns="month", values="amount", aggfunc="sum", fill_value=0)
print(result)
`,
    explanation: 'pivot_table reshapes long-format data into a wide category-by-month grid, aggregating with sum where multiple rows map to the same cell, and fill_value=0 handles category/month combinations that never occurred in the raw data (which would otherwise show as NaN).',
  },
  {
    slug: 'iqr-outlier-capping',
    title: 'Cap Outliers Using the IQR Method',
    difficulty: 'Medium',
    tags: ['pandas', 'outliers', 'data-cleaning'],
    prompt: 'Cap (winsorize) the "amount" column so any value beyond 1.5×IQR from Q1/Q3 is clipped to the nearest boundary, rather than removed.',
    starterCode: `import pandas as pd

df = pd.DataFrame({"amount": [10, 12, 11, 13, 12, 500, 9, 11, -200, 14]})

# TODO: compute Q1, Q3, IQR, then clip using df["amount"].clip(lower, upper)
q1 = q3 = iqr = lower = upper = None
df["amount_capped"] = None
print(df)
`,
    solutionCode: `import pandas as pd

df = pd.DataFrame({"amount": [10, 12, 11, 13, 12, 500, 9, 11, -200, 14]})

q1 = df["amount"].quantile(0.25)
q3 = df["amount"].quantile(0.75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
df["amount_capped"] = df["amount"].clip(lower, upper)
print(df)
`,
    explanation: 'The IQR method flags anything below Q1-1.5×IQR or above Q3+1.5×IQR as an outlier. .clip(lower, upper) caps rather than deletes those values, preserving the row (and its other column values) while limiting the outlier\'s influence — often preferable to deletion when the row has otherwise valid data.',
  },
  {
    slug: 'lru-cache',
    title: 'Implement an LRU Cache',
    difficulty: 'Medium',
    tags: ['oop', 'data-structures'],
    prompt: 'Implement a Least-Recently-Used cache with O(1) get and put, using an OrderedDict.',
    starterCode: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        # TODO: move this key to the end (most recently used) and return its value
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            del self.cache[key]
        self.cache[key] = value
        # TODO: if over capacity, evict the least recently used (oldest) item
        pass

cache = LRUCache(2)
cache.put(1, "a")
cache.put(2, "b")
print(cache.get(1))   # "a" -- and 1 becomes most recently used
cache.put(3, "c")      # evicts key 2 (least recently used)
print(cache.get(2))   # -1
print(cache.get(3))   # "c"
`,
    solutionCode: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            del self.cache[key]
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

cache = LRUCache(2)
cache.put(1, "a")
cache.put(2, "b")
print(cache.get(1))
cache.put(3, "c")
print(cache.get(2))
print(cache.get(3))
`,
    explanation: 'OrderedDict maintains insertion order and supports O(1) move_to_end (mark as recently used) and O(1) popitem(last=False) (evict the oldest/least-recently-used item) — exactly the two operations an LRU cache needs, avoiding a manual doubly-linked-list implementation.',
  },
  {
    slug: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence (O(n))',
    difficulty: 'Hard',
    tags: ['hash-set', 'arrays'],
    prompt: 'Given an unsorted array of integers, find the length of the longest run of consecutive integers (e.g. [100,4,200,1,3,2] -> 4, for the run 1,2,3,4). Do it in O(n), not O(n log n).',
    starterCode: `def longest_consecutive(nums):
    num_set = set(nums)
    longest = 0
    for n in num_set:
        # TODO: only start counting from the beginning of a sequence
        # (i.e., n-1 is not in num_set), then walk forward counting the run
        pass
    return longest

print(longest_consecutive([100,4,200,1,3,2]))  # expect 4
`,
    solutionCode: `def longest_consecutive(nums):
    num_set = set(nums)
    longest = 0
    for n in num_set:
        if n - 1 not in num_set:  # only start a count from a sequence's beginning
            length = 1
            current = n
            while current + 1 in num_set:
                current += 1
                length += 1
            longest = max(longest, length)
    return longest

print(longest_consecutive([100,4,200,1,3,2]))
`,
    explanation: 'Sorting first would cost O(n log n). Using a hash set gives O(1) membership checks, and the key trick — only starting a count when n-1 is absent — ensures each number is visited as the "start" of a sequence at most once across the whole loop, keeping total work O(n) despite the nested while loop.',
  },
  {
    slug: 'pandas-date-streaks',
    title: 'Longest Login Streak Per User (pandas gaps & islands)',
    difficulty: 'Hard',
    tags: ['pandas', 'gaps-and-islands', 'groupby'],
    prompt: 'Given a DataFrame of (user_id, login_date) rows, compute the longest run of consecutive-day logins for each user — the pandas equivalent of the classic SQL gaps-and-islands problem.',
    starterCode: `import pandas as pd

logins = pd.DataFrame({
    "user_id": [1,1,1,1,1,2,2,2],
    "login_date": pd.to_datetime([
        "2026-01-01","2026-01-02","2026-01-03","2026-01-05","2026-01-06",
        "2026-01-01","2026-01-03","2026-01-04",
    ]),
})
logins = logins.sort_values(["user_id","login_date"])

# TODO: within each user, compute (date - row_number_of_that_date_within_user)
# as a constant "island id" for consecutive runs, then find the largest island size
def longest_streak(group):
    return None

result = logins.groupby("user_id").apply(longest_streak)
print(result)
`,
    solutionCode: `import pandas as pd

logins = pd.DataFrame({
    "user_id": [1,1,1,1,1,2,2,2],
    "login_date": pd.to_datetime([
        "2026-01-01","2026-01-02","2026-01-03","2026-01-05","2026-01-06",
        "2026-01-01","2026-01-03","2026-01-04",
    ]),
})
logins = logins.sort_values(["user_id","login_date"])

def longest_streak(group):
    dates = group["login_date"].reset_index(drop=True)
    day_number = (dates - dates.iloc[0]).dt.days
    row_number = pd.Series(range(len(dates)))
    island_id = day_number - row_number  # constant within a consecutive run
    return island_id.value_counts().max()

result = logins.groupby("user_id").apply(longest_streak, include_groups=False)
print(result)
`,
    explanation: 'Exactly the SQL gaps-and-islands trick, translated to pandas: within a consecutive run of dates, (days_since_first_date - row_number) stays constant, since both increase by exactly 1 per day; a gap breaks the lockstep and starts a new constant. value_counts().max() then gives the largest run\'s length.',
  },
  {
    slug: 'binary-search-rotated',
    title: 'Search in a Rotated Sorted Array',
    difficulty: 'Hard',
    tags: ['binary-search', 'arrays'],
    prompt: 'A sorted array has been rotated at an unknown pivot (e.g. [4,5,6,7,0,1,2]). Find the index of a target value in O(log n) time.',
    starterCode: `def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        # TODO: determine which half (lo..mid or mid..hi) is properly sorted,
        # then check if target lies within that sorted half to decide which way to go
    return -1

print(search_rotated([4,5,6,7,0,1,2], 0))  # expect 4
print(search_rotated([4,5,6,7,0,1,2], 3))  # expect -1
`,
    solutionCode: `def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:  # left half is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:  # right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1

print(search_rotated([4,5,6,7,0,1,2], 0))
print(search_rotated([4,5,6,7,0,1,2], 3))
`,
    explanation: 'At every step, at least one half (lo..mid or mid..hi) must be properly sorted (a rotation can only break sortedness at one point). Checking which half is sorted, then checking whether the target falls within that sorted half\'s range, tells you which half to discard — preserving O(log n) despite the rotation.',
  },
  {
    slug: 'chunked-csv-processing',
    title: 'Memory-Efficient Aggregation Over a Large File (Generator Pattern)',
    difficulty: 'Hard',
    tags: ['generators', 'pandas', 'memory-efficiency'],
    prompt: 'Simulate processing a file too large to fit in memory: use a generator to yield chunks and compute a running total without ever holding the full dataset at once.',
    starterCode: `import pandas as pd
import numpy as np

def fake_chunk_source(n_chunks=5, rows_per_chunk=1000):
    """Simulates pd.read_csv(path, chunksize=...) yielding one chunk at a time."""
    rng = np.random.default_rng(0)
    for _ in range(n_chunks):
        yield pd.DataFrame({"amount": rng.normal(100, 20, rows_per_chunk)})

def total_and_count(chunks):
    total = 0.0
    count = 0
    # TODO: iterate the generator, updating total/count per chunk,
    # WITHOUT ever concatenating all chunks into one dataframe
    return total, count

total, count = total_and_count(fake_chunk_source())
print(f"total={total:.1f}, count={count}, mean={total/count:.2f}")
`,
    solutionCode: `import pandas as pd
import numpy as np

def fake_chunk_source(n_chunks=5, rows_per_chunk=1000):
    rng = np.random.default_rng(0)
    for _ in range(n_chunks):
        yield pd.DataFrame({"amount": rng.normal(100, 20, rows_per_chunk)})

def total_and_count(chunks):
    total = 0.0
    count = 0
    for chunk in chunks:
        total += chunk["amount"].sum()
        count += len(chunk)
    return total, count

total, count = total_and_count(fake_chunk_source())
print(f"total={total:.1f}, count={count}, mean={total/count:.2f}")
`,
    explanation: 'This mirrors real production practice for files too large for memory: pd.read_csv(path, chunksize=N) returns exactly this kind of generator/iterator, and an aggregation that only needs a running sum/count (rather than the full dataset simultaneously) can process arbitrarily large files in constant memory, one chunk at a time.',
  },
  {
    slug: 'custom-sklearn-transformer',
    title: 'Build a Custom Scikit-Learn-Compatible Transformer',
    difficulty: 'Hard',
    tags: ['sklearn', 'oop', 'pipelines'],
    prompt: 'Implement a custom transformer (following sklearn\'s fit/transform API) that clips numeric features to a learned [mean - 3*std, mean + 3*std] range, so it can be used inside an sklearn Pipeline.',
    starterCode: `import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin

class OutlierClipper(BaseEstimator, TransformerMixin):
    def __init__(self, n_std=3.0):
        self.n_std = n_std

    def fit(self, X, y=None):
        X = np.asarray(X)
        # TODO: learn per-column mean and std from X, store as self.mean_ / self.std_
        return self

    def transform(self, X):
        X = np.asarray(X)
        lower = self.mean_ - self.n_std * self.std_
        upper = self.mean_ + self.n_std * self.std_
        return np.clip(X, lower, upper)

rng = np.random.default_rng(1)
X = rng.normal(0, 1, (100, 2))
X[0, 0] = 50  # inject an outlier

clipper = OutlierClipper(n_std=3).fit(X)
X_clipped = clipper.transform(X)
print("max before:", X[:, 0].max(), "max after:", X_clipped[:, 0].max())
`,
    solutionCode: `import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin

class OutlierClipper(BaseEstimator, TransformerMixin):
    def __init__(self, n_std=3.0):
        self.n_std = n_std

    def fit(self, X, y=None):
        X = np.asarray(X)
        self.mean_ = X.mean(axis=0)
        self.std_ = X.std(axis=0)
        return self

    def transform(self, X):
        X = np.asarray(X)
        lower = self.mean_ - self.n_std * self.std_
        upper = self.mean_ + self.n_std * self.std_
        return np.clip(X, lower, upper)

rng = np.random.default_rng(1)
X = rng.normal(0, 1, (100, 2))
X[0, 0] = 50

clipper = OutlierClipper(n_std=3).fit(X)
X_clipped = clipper.transform(X)
print("max before:", X[:, 0].max(), "max after:", X_clipped[:, 0].max())
`,
    explanation: 'Inheriting from BaseEstimator and TransformerMixin gives you get_params/set_params (needed for GridSearchCV) and a free .fit_transform() method for the price of implementing fit and transform yourself — the standard way to build custom preprocessing steps that slot directly into an sklearn Pipeline alongside built-in transformers.',
  },
  {
    slug: 'cohort-retention-pandas',
    title: 'Cohort Retention Matrix (pandas)',
    difficulty: 'Hard',
    tags: ['pandas', 'cohort-analysis', 'pivot_table'],
    prompt: 'Build a cohort retention matrix: rows are signup month, columns are "months since signup" (0, 1, 2, ...), values are the count of distinct active users — the pandas equivalent of a classic product-analytics retention report.',
    starterCode: `import pandas as pd

activity = pd.DataFrame({
    "user_id":     [1,1,1, 2,2, 3,3,3,3, 4,4],
    "signup_month":["2026-01","2026-01","2026-01", "2026-01","2026-01", "2026-02","2026-02","2026-02","2026-02", "2026-02","2026-02"],
    "active_month":["2026-01","2026-02","2026-03", "2026-01","2026-03", "2026-02","2026-03","2026-04","2026-05", "2026-02","2026-04"],
})

def month_diff(a, b):
    ay, am = map(int, a.split("-"))
    by, bm = map(int, b.split("-"))
    return (by - ay) * 12 + (bm - am)

# TODO: add a "months_since_signup" column using month_diff,
# then pivot_table(index=signup_month, columns=months_since_signup, values=user_id, aggfunc=nunique)
activity["months_since_signup"] = None
cohort = None
print(cohort)
`,
    solutionCode: `import pandas as pd

activity = pd.DataFrame({
    "user_id":     [1,1,1, 2,2, 3,3,3,3, 4,4],
    "signup_month":["2026-01","2026-01","2026-01", "2026-01","2026-01", "2026-02","2026-02","2026-02","2026-02", "2026-02","2026-02"],
    "active_month":["2026-01","2026-02","2026-03", "2026-01","2026-03", "2026-02","2026-03","2026-04","2026-05", "2026-02","2026-04"],
})

def month_diff(a, b):
    ay, am = map(int, a.split("-"))
    by, bm = map(int, b.split("-"))
    return (by - ay) * 12 + (bm - am)

activity["months_since_signup"] = activity.apply(
    lambda row: month_diff(row["signup_month"], row["active_month"]), axis=1
)
cohort = activity.pivot_table(
    index="signup_month", columns="months_since_signup", values="user_id", aggfunc="nunique", fill_value=0
)
print(cohort)
`,
    explanation: 'This is the standard shape of a retention/cohort table used at every consumer product company: pivot_table with signup cohort as rows, "periods since signup" as columns, and a distinct-user count as the value — from here, dividing every row by its own column-0 value converts raw counts into retention percentages.',
  },
]
