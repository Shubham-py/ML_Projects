import type { SqlExercise } from '../types'

export const sqlExercises: SqlExercise[] = [
  {
    slug: 'total-spend-above-threshold',
    title: 'Customers Who Spent More Than ₹5,000',
    difficulty: 'Easy',
    tags: ['join', 'group by', 'having'],
    prompt: 'Find every customer\'s name and total spend, but only include customers whose total spend exceeds 5000. Order by total spend descending.',
    setupSql: `
      CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
      CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount REAL);
      INSERT INTO customers VALUES (1,'Aarav'),(2,'Diya'),(3,'Kabir'),(4,'Meera');
      INSERT INTO orders VALUES
        (1,1,2000),(2,1,3500),(3,2,1000),(4,2,500),
        (5,3,6000),(6,4,7000),(7,4,1000);
    `,
    starterQuery: `SELECT c.name, SUM(o.amount) AS total_spend
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.name
-- add a HAVING clause and ORDER BY here
;`,
    solutionQuery: `SELECT c.name, SUM(o.amount) AS total_spend
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.name
HAVING SUM(o.amount) > 5000
ORDER BY total_spend DESC;`,
    explanation: 'HAVING filters on the aggregated SUM (which does not exist yet at the WHERE stage) — this is the classic reason WHERE cannot be used to filter on an aggregate.',
  },
  {
    slug: 'second-highest-salary',
    title: 'Second Highest Salary Per Department',
    difficulty: 'Easy',
    tags: ['window functions', 'dense_rank'],
    prompt: 'For each department, find the employee with the 2nd highest salary. Handle ties correctly (if two employees tie for highest, the next distinct salary is "2nd").',
    setupSql: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);
      INSERT INTO employees VALUES
        (1,'Rahul','Engineering',95000),
        (2,'Priya','Engineering',95000),
        (3,'Sanjay','Engineering',88000),
        (4,'Anita','Sales',70000),
        (5,'Vikram','Sales',65000),
        (6,'Neha','Sales',65000);
    `,
    starterQuery: `-- use DENSE_RANK() partitioned by department, ordered by salary desc
SELECT name, department, salary
FROM (
  SELECT name, department, salary,
         DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
  FROM employees
)
WHERE rnk = 2;`,
    solutionQuery: `SELECT name, department, salary
FROM (
  SELECT name, department, salary,
         DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
  FROM employees
)
WHERE rnk = 2;`,
    explanation: 'DENSE_RANK gives tied top salaries both rank 1, so the next distinct salary correctly gets rank 2 — RANK() would have skipped to 3 in this tie scenario, which is wrong for "2nd highest distinct salary."',
  },
  {
    slug: 'duplicate-emails',
    title: 'Find Duplicate Customer Emails',
    difficulty: 'Easy',
    tags: ['group by', 'having', 'data quality'],
    prompt: 'The customers table has data quality issues — some emails appear more than once. Return every email that appears more than once, along with the count.',
    setupSql: `
      CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT);
      INSERT INTO customers VALUES
        (1,'Aarav','aarav@mail.com'),
        (2,'Aarav K','aarav@mail.com'),
        (3,'Diya','diya@mail.com'),
        (4,'Kabir','kabir@mail.com'),
        (5,'Kabir S','kabir@mail.com'),
        (6,'Kabir T','kabir@mail.com');
    `,
    starterQuery: `SELECT email, COUNT(*) AS n
FROM customers
GROUP BY email
-- filter to only duplicates
;`,
    solutionQuery: `SELECT email, COUNT(*) AS n
FROM customers
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY n DESC;`,
    explanation: 'A GROUP BY + HAVING COUNT(*) > 1 is the standard pattern for finding any kind of duplicate in SQL — it generalizes to duplicate rows across any set of columns you group by.',
  },
  {
    slug: 'employees-no-manager',
    title: 'Employees With No Manager',
    difficulty: 'Easy',
    tags: ['null handling', 'self-join'],
    prompt: 'Find all employees who have no manager assigned (manager_id is NULL) — these are typically the most senior people in an org chart.',
    setupSql: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, manager_id INTEGER);
      INSERT INTO employees VALUES
        (1,'Ananya',NULL),
        (2,'Rohit',1),
        (3,'Simran',1),
        (4,'Dev',2),
        (5,'Ishaan',NULL);
    `,
    starterQuery: `SELECT name FROM employees WHERE manager_id -- what condition finds NULL?
;`,
    solutionQuery: `SELECT name FROM employees WHERE manager_id IS NULL;`,
    explanation: 'NULL can never be compared with = in SQL (x = NULL is always UNKNOWN, not TRUE) — you must use IS NULL / IS NOT NULL explicitly.',
  },
  {
    slug: 'top-products-by-revenue',
    title: 'Top 3 Products By Revenue',
    difficulty: 'Easy',
    tags: ['aggregation', 'order by', 'limit'],
    prompt: 'Find the top 3 products by total revenue (price × quantity, summed across all their order line items).',
    setupSql: `
      CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL);
      CREATE TABLE order_items (id INTEGER PRIMARY KEY, product_id INTEGER, quantity INTEGER);
      INSERT INTO products VALUES (1,'Keyboard',1500),(2,'Mouse',600),(3,'Monitor',9000),(4,'Webcam',2200);
      INSERT INTO order_items VALUES
        (1,1,3),(2,1,2),(3,2,10),(4,3,2),(5,3,1),(6,4,4),(7,2,5);
    `,
    starterQuery: `SELECT p.name, SUM(p.price * oi.quantity) AS revenue
FROM products p
JOIN order_items oi ON oi.product_id = p.id
GROUP BY p.name
ORDER BY revenue DESC
-- limit to top 3
;`,
    solutionQuery: `SELECT p.name, SUM(p.price * oi.quantity) AS revenue
FROM products p
JOIN order_items oi ON oi.product_id = p.id
GROUP BY p.name
ORDER BY revenue DESC
LIMIT 3;`,
    explanation: 'ORDER BY on the aggregated revenue, then LIMIT to the top N — a simple, extremely common pattern for "top N by X" questions.',
  },
  {
    slug: 'running-total-per-customer',
    title: 'Running Total of Spend Per Customer',
    difficulty: 'Medium',
    tags: ['window functions', 'running total'],
    prompt: 'For each customer, show every order along with a running (cumulative) total of their spend up to and including that order, ordered by order date.',
    setupSql: `
      CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, amount REAL);
      INSERT INTO orders VALUES
        (1,1,'2026-01-01',500),(2,1,'2026-01-05',700),(3,1,'2026-01-10',300),
        (4,2,'2026-01-02',1000),(5,2,'2026-01-08',250);
    `,
    starterQuery: `SELECT customer_id, order_date, amount,
       SUM(amount) OVER (-- partition and order here) AS running_total
FROM orders
ORDER BY customer_id, order_date;`,
    solutionQuery: `SELECT customer_id, order_date, amount,
       SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS running_total
FROM orders
ORDER BY customer_id, order_date;`,
    explanation: 'SUM() OVER (PARTITION BY ... ORDER BY ...) with no explicit frame defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which is exactly a running total within each partition.',
  },
  {
    slug: 'month-over-month-change',
    title: 'Month-over-Month Revenue Change',
    difficulty: 'Medium',
    tags: ['window functions', 'lag'],
    prompt: 'Given monthly revenue totals, compute the absolute change and percentage change versus the previous month.',
    setupSql: `
      CREATE TABLE monthly_revenue (month TEXT PRIMARY KEY, revenue REAL);
      INSERT INTO monthly_revenue VALUES
        ('2026-01',100000),('2026-02',115000),('2026-03',108000),('2026-04',130000);
    `,
    starterQuery: `SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change,
       -- add percentage change using LAG as well
       NULL AS pct_change
FROM monthly_revenue;`,
    solutionQuery: `SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month), 2) AS pct_change
FROM monthly_revenue;`,
    explanation: 'LAG(revenue) OVER (ORDER BY month) fetches the previous row\'s value without needing a self-join — the first row has no prior month, so LAG returns NULL there (correctly propagating to NULL change/pct_change).',
  },
  {
    slug: 'rank-products-within-category',
    title: 'Rank Products Within Category By Price',
    difficulty: 'Medium',
    tags: ['window functions', 'rank', 'partition by'],
    prompt: 'Rank each product by price within its own category (1 = most expensive in that category).',
    setupSql: `
      CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL);
      INSERT INTO products VALUES
        (1,'Laptop A','Electronics',60000),
        (2,'Laptop B','Electronics',75000),
        (3,'Phone A','Electronics',30000),
        (4,'Chair','Furniture',5000),
        (5,'Desk','Furniture',12000);
    `,
    starterQuery: `SELECT name, category, price,
       RANK() OVER (-- your window spec) AS price_rank
FROM products
ORDER BY category, price_rank;`,
    solutionQuery: `SELECT name, category, price,
       RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank
FROM products
ORDER BY category, price_rank;`,
    explanation: 'PARTITION BY category resets the ranking independently for each category, and ORDER BY price DESC ranks the most expensive item as #1 within each partition.',
  },
  {
    slug: 'employee-manager-pairs',
    title: 'Employee-Manager Name Pairs (Self-Join)',
    difficulty: 'Medium',
    tags: ['self-join', 'hierarchy'],
    prompt: 'List every employee\'s name alongside their manager\'s name (use a LEFT JOIN so employees with no manager still appear, with NULL manager name).',
    setupSql: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, manager_id INTEGER);
      INSERT INTO employees VALUES
        (1,'Ananya',NULL),(2,'Rohit',1),(3,'Simran',1),(4,'Dev',2);
    `,
    starterQuery: `SELECT e.name AS employee, m.name AS manager
FROM employees e
-- self join to employees again as m, matching manager_id
;`,
    solutionQuery: `SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;`,
    explanation: 'A self-join treats the same table as two logical tables (aliased e and m) — LEFT JOIN ensures Ananya (no manager) still appears in the results with manager = NULL, rather than being dropped as an INNER JOIN would do.',
  },
  {
    slug: 'customers-active-two-months',
    title: 'Customers Who Ordered in Both January and February',
    difficulty: 'Medium',
    tags: ['aggregation', 'having', 'set logic'],
    prompt: 'Find customers who placed at least one order in January 2026 AND at least one order in February 2026.',
    setupSql: `
      CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT);
      INSERT INTO orders VALUES
        (1,1,'2026-01-05'),(2,1,'2026-02-10'),
        (3,2,'2026-01-15'),
        (4,3,'2026-02-01'),(5,3,'2026-02-20'),
        (6,4,'2026-01-01'),(7,4,'2026-02-01');
    `,
    starterQuery: `SELECT customer_id
FROM orders
WHERE strftime('%Y-%m', order_date) IN ('2026-01','2026-02')
GROUP BY customer_id
-- HAVING clause counting distinct months
;`,
    solutionQuery: `SELECT customer_id
FROM orders
WHERE strftime('%Y-%m', order_date) IN ('2026-01','2026-02')
GROUP BY customer_id
HAVING COUNT(DISTINCT strftime('%Y-%m', order_date)) = 2;`,
    explanation: 'Grouping by customer and counting DISTINCT year-months present avoids needing two separate subqueries joined together — a customer only shows COUNT(DISTINCT ...) = 2 if they have orders in both target months.',
  },
  {
    slug: 'avg-order-value-per-month',
    title: 'Average Order Value Per Month',
    difficulty: 'Medium',
    tags: ['date functions', 'aggregation'],
    prompt: 'Compute the average order value for each calendar month, ordered chronologically.',
    setupSql: `
      CREATE TABLE orders (id INTEGER PRIMARY KEY, order_date TEXT, amount REAL);
      INSERT INTO orders VALUES
        (1,'2026-01-05',200),(2,'2026-01-20',400),
        (3,'2026-02-01',600),(4,'2026-02-15',300),(5,'2026-02-25',900);
    `,
    starterQuery: `SELECT strftime('%Y-%m', order_date) AS month, AVG(amount) AS avg_order_value
FROM orders
GROUP BY month
-- order chronologically
;`,
    solutionQuery: `SELECT strftime('%Y-%m', order_date) AS month, AVG(amount) AS avg_order_value
FROM orders
GROUP BY month
ORDER BY month;`,
    explanation: 'strftime(\'%Y-%m\', order_date) buckets dates into calendar months as a string that also happens to sort chronologically — a common, simple monthly bucketing trick.',
  },
  {
    slug: 'first-purchase-date',
    title: 'Each Customer\'s First Purchase Date',
    difficulty: 'Medium',
    tags: ['window functions', 'min'],
    prompt: 'For every order row, add a column showing that customer\'s very first purchase date (not just the current row\'s date) — useful for cohort analysis.',
    setupSql: `
      CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, amount REAL);
      INSERT INTO orders VALUES
        (1,1,'2026-01-10',200),(2,1,'2026-02-05',300),
        (3,2,'2026-01-20',150),(4,2,'2026-03-01',400);
    `,
    starterQuery: `SELECT customer_id, order_date, amount,
       MIN(order_date) OVER (-- window spec) AS first_purchase_date
FROM orders
ORDER BY customer_id, order_date;`,
    solutionQuery: `SELECT customer_id, order_date, amount,
       MIN(order_date) OVER (PARTITION BY customer_id) AS first_purchase_date
FROM orders
ORDER BY customer_id, order_date;`,
    explanation: 'A window function like MIN() OVER (PARTITION BY customer_id) — with no ORDER BY inside the window — aggregates over the *entire* partition for every row, giving each row the group\'s overall minimum rather than a running minimum.',
  },
  {
    slug: 'category-revenue-share',
    title: 'Each Category\'s % Share of Total Revenue',
    difficulty: 'Medium',
    tags: ['window functions', 'aggregation'],
    prompt: 'For each product category, compute its total revenue and what percentage of the grand total revenue it represents.',
    setupSql: `
      CREATE TABLE sales (id INTEGER PRIMARY KEY, category TEXT, revenue REAL);
      INSERT INTO sales VALUES
        (1,'Electronics',50000),(2,'Electronics',30000),
        (3,'Furniture',20000),(4,'Furniture',10000),
        (5,'Grocery',5000);
    `,
    starterQuery: `SELECT category, SUM(revenue) AS category_revenue,
       ROUND(100.0 * SUM(revenue) / (SELECT SUM(revenue) FROM sales), 2) AS pct_of_total
FROM sales
GROUP BY category
ORDER BY category_revenue DESC;`,
    solutionQuery: `SELECT category, SUM(revenue) AS category_revenue,
       ROUND(100.0 * SUM(revenue) / (SELECT SUM(revenue) FROM sales), 2) AS pct_of_total
FROM sales
GROUP BY category
ORDER BY category_revenue DESC;`,
    explanation: 'A scalar subquery `(SELECT SUM(revenue) FROM sales)` computes the grand total once, letting each group\'s share be expressed as a percentage of it. Equivalently, SUM(revenue) OVER () (an empty window = whole result set) would work too.',
  },
  {
    slug: 'login-streaks',
    title: 'Longest Consecutive Login Streak Per User (Gaps & Islands)',
    difficulty: 'Hard',
    tags: ['gaps and islands', 'window functions'],
    prompt: 'Given daily login records, find the length of the longest run of consecutive days each user logged in.',
    setupSql: `
      CREATE TABLE logins (user_id INTEGER, login_date TEXT);
      INSERT INTO logins VALUES
        (1,'2026-01-01'),(1,'2026-01-02'),(1,'2026-01-03'),(1,'2026-01-05'),(1,'2026-01-06'),
        (2,'2026-01-01'),(2,'2026-01-03'),(2,'2026-01-04'),(2,'2026-01-05');
    `,
    starterQuery: `-- Step 1: rank each user's login dates
-- Step 2: julianday(login_date) - rank is constant within a consecutive streak
-- Step 3: group by user + that constant, count rows per group, take the max
WITH ranked AS (
  SELECT user_id, login_date,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
  FROM logins
),
grouped AS (
  SELECT user_id,
         julianday(login_date) - rn AS grp
  FROM ranked
)
SELECT user_id, MAX(streak_length) AS longest_streak
FROM (
  SELECT user_id, grp, COUNT(*) AS streak_length
  FROM grouped
  GROUP BY user_id, grp
)
GROUP BY user_id;`,
    solutionQuery: `WITH ranked AS (
  SELECT user_id, login_date,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
  FROM logins
),
grouped AS (
  SELECT user_id,
         julianday(login_date) - rn AS grp
  FROM ranked
)
SELECT user_id, MAX(streak_length) AS longest_streak
FROM (
  SELECT user_id, grp, COUNT(*) AS streak_length
  FROM grouped
  GROUP BY user_id, grp
)
GROUP BY user_id;`,
    explanation: 'The classic gaps-and-islands trick: within an unbroken run of consecutive dates, (date_as_number - row_number) is constant, because both increase by exactly 1 each day. A gap breaks that lockstep, creating a new constant for the next island. Grouping by that constant and counting rows gives each streak\'s length.',
  },
  {
    slug: 'nth-highest-salary-generic',
    title: 'Nth Highest Salary (Parameterized Pattern)',
    difficulty: 'Hard',
    tags: ['window functions', 'dense_rank'],
    prompt: 'Find the 3rd highest DISTINCT salary company-wide (not per department). If fewer than 3 distinct salaries exist, return no rows.',
    setupSql: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER);
      INSERT INTO employees VALUES
        (1,'A',90000),(2,'B',90000),(3,'C',85000),(4,'D',80000),(5,'E',80000),(6,'F',70000);
    `,
    starterQuery: `SELECT DISTINCT salary
FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
)
WHERE rnk = 3;`,
    solutionQuery: `SELECT DISTINCT salary
FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
)
WHERE rnk = 3;`,
    explanation: 'Changing WHERE rnk = 3 to any N generalizes this pattern to "Nth highest distinct value" — this is why DENSE_RANK is preferred over ad hoc nested MAX/NOT-IN subqueries, which do not generalize cleanly past N=2.',
  },
  {
    slug: 'cohort-retention',
    title: 'Month-1 Retention Rate By Signup Cohort',
    difficulty: 'Hard',
    tags: ['cohort analysis', 'joins', 'aggregation'],
    prompt: 'For each signup month cohort, compute what percentage of users who signed up that month were still active (had an activity record) exactly one calendar month later.',
    setupSql: `
      CREATE TABLE users (id INTEGER PRIMARY KEY, signup_month TEXT);
      CREATE TABLE activity (user_id INTEGER, active_month TEXT);
      INSERT INTO users VALUES (1,'2026-01'),(2,'2026-01'),(3,'2026-01'),(4,'2026-02'),(5,'2026-02');
      INSERT INTO activity VALUES
        (1,'2026-01'),(1,'2026-02'),
        (2,'2026-01'),
        (3,'2026-01'),(3,'2026-02'),
        (4,'2026-02'),(4,'2026-03'),
        (5,'2026-02');
    `,
    starterQuery: `WITH cohort_size AS (
  SELECT signup_month, COUNT(*) AS cohort_users
  FROM users
  GROUP BY signup_month
),
month1_active AS (
  SELECT u.signup_month, COUNT(DISTINCT a.user_id) AS retained_users
  FROM users u
  JOIN activity a ON a.user_id = u.id
  WHERE a.active_month = strftime('%Y-%m', date(u.signup_month || '-01', '+1 month'))
  GROUP BY u.signup_month
)
SELECT c.signup_month, c.cohort_users, COALESCE(m.retained_users, 0) AS retained_users,
       ROUND(100.0 * COALESCE(m.retained_users, 0) / c.cohort_users, 1) AS retention_pct
FROM cohort_size c
LEFT JOIN month1_active m ON m.signup_month = c.signup_month;`,
    solutionQuery: `WITH cohort_size AS (
  SELECT signup_month, COUNT(*) AS cohort_users
  FROM users
  GROUP BY signup_month
),
month1_active AS (
  SELECT u.signup_month, COUNT(DISTINCT a.user_id) AS retained_users
  FROM users u
  JOIN activity a ON a.user_id = u.id
  WHERE a.active_month = strftime('%Y-%m', date(u.signup_month || '-01', '+1 month'))
  GROUP BY u.signup_month
)
SELECT c.signup_month, c.cohort_users, COALESCE(m.retained_users, 0) AS retained_users,
       ROUND(100.0 * COALESCE(m.retained_users, 0) / c.cohort_users, 1) AS retention_pct
FROM cohort_size c
LEFT JOIN month1_active m ON m.signup_month = c.signup_month;`,
    explanation: 'This is the core query pattern behind every cohort retention table: compute cohort size once, separately compute how many of that cohort show up exactly N periods later, then join and divide. The LEFT JOIN + COALESCE ensures a cohort with zero month-1 retainers still shows 0%, not a missing row.',
  },
  {
    slug: 'median-without-median-function',
    title: 'Compute the Median Without a MEDIAN() Function',
    difficulty: 'Hard',
    tags: ['percentiles', 'window functions'],
    prompt: 'SQLite (like many databases) has no built-in MEDIAN() function. Compute the median order amount using window functions.',
    setupSql: `
      CREATE TABLE orders (id INTEGER PRIMARY KEY, amount REAL);
      INSERT INTO orders VALUES (1,100),(2,200),(3,300),(4,400),(5,500),(6,600);
    `,
    starterQuery: `WITH ordered AS (
  SELECT amount,
         ROW_NUMBER() OVER (ORDER BY amount) AS rn,
         COUNT(*) OVER () AS n
  FROM orders
)
SELECT AVG(amount) AS median
FROM ordered
WHERE rn IN ((n + 1) / 2, (n + 2) / 2);`,
    solutionQuery: `WITH ordered AS (
  SELECT amount,
         ROW_NUMBER() OVER (ORDER BY amount) AS rn,
         COUNT(*) OVER () AS n
  FROM orders
)
SELECT AVG(amount) AS median
FROM ordered
WHERE rn IN ((n + 1) / 2, (n + 2) / 2);`,
    explanation: 'Using integer division, (n+1)/2 and (n+2)/2 pick the single middle row for odd n (both expressions equal the same middle rank) or the two middle rows for even n (averaged) — a general-purpose median formula that works for both cases without an IF/CASE branch.',
  },
  {
    slug: 'consecutive-months-purchases',
    title: 'Users With 3+ Consecutive Months of Purchases',
    difficulty: 'Hard',
    tags: ['gaps and islands', 'window functions'],
    prompt: 'Find users who made at least one purchase in 3 or more consecutive calendar months.',
    setupSql: `
      CREATE TABLE orders (user_id INTEGER, order_month TEXT);
      INSERT INTO orders VALUES
        (1,'2026-01'),(1,'2026-02'),(1,'2026-03'),
        (2,'2026-01'),(2,'2026-03'),
        (3,'2026-01'),(3,'2026-02'),(3,'2026-03'),(3,'2026-04');
    `,
    starterQuery: `WITH distinct_months AS (
  SELECT DISTINCT user_id, order_month FROM orders
),
ranked AS (
  SELECT user_id, order_month,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_month) AS rn
  FROM distinct_months
),
grouped AS (
  SELECT user_id,
         -- convert 'YYYY-MM' to a month-index number, subtract rn to find islands
         (CAST(substr(order_month,1,4) AS INTEGER) * 12 + CAST(substr(order_month,6,2) AS INTEGER)) - rn AS grp
  FROM ranked
)
SELECT user_id, COUNT(*) AS streak_length
FROM grouped
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;`,
    solutionQuery: `WITH distinct_months AS (
  SELECT DISTINCT user_id, order_month FROM orders
),
ranked AS (
  SELECT user_id, order_month,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_month) AS rn
  FROM distinct_months
),
grouped AS (
  SELECT user_id,
         (CAST(substr(order_month,1,4) AS INTEGER) * 12 + CAST(substr(order_month,6,2) AS INTEGER)) - rn AS grp
  FROM ranked
)
SELECT user_id, COUNT(*) AS streak_length
FROM grouped
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;`,
    explanation: 'Same gaps-and-islands idea as the login streak problem, but converting "YYYY-MM" into a single incrementing month-index integer (year*12 + month) first, since months don\'t have a native julianday-style numeric representation the way full dates do.',
  },
  {
    slug: 'anti-join-customers-no-orders',
    title: 'Customers With Zero Orders (Anti-Join, NULL-Safe)',
    difficulty: 'Hard',
    tags: ['anti-join', 'null handling'],
    prompt: 'Find every customer who has never placed an order. The orders table may contain rows with a NULL customer_id (guest checkouts) — make sure your query is not broken by this.',
    setupSql: `
      CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
      CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER);
      INSERT INTO customers VALUES (1,'Aarav'),(2,'Diya'),(3,'Kabir');
      INSERT INTO orders VALUES (1,1),(2,NULL),(3,NULL);
    `,
    starterQuery: `-- NOT IN would break here because of the NULL customer_id in orders.
-- Use NOT EXISTS instead.
SELECT c.name
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);`,
    solutionQuery: `SELECT c.name
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);`,
    explanation: 'NOT EXISTS uses a correlated existence check per row rather than comparing against a precomputed list, so a NULL value inside the subquery\'s result set has no effect on the outcome — unlike NOT IN, which returns zero rows for everything if the subquery contains any NULL.',
  },
  {
    slug: 'window-frame-explicit',
    title: '3-Order Rolling Average (Explicit Window Frame)',
    difficulty: 'Hard',
    tags: ['window functions', 'rolling average', 'frame clause'],
    prompt: 'Compute a rolling average of each customer\'s current order amount plus their previous 2 orders (3-order rolling window), ordered by date.',
    setupSql: `
      CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, amount REAL);
      INSERT INTO orders VALUES
        (1,1,'2026-01-01',100),(2,1,'2026-01-05',200),(3,1,'2026-01-10',300),
        (4,1,'2026-01-15',400),(5,1,'2026-01-20',500);
    `,
    starterQuery: `SELECT customer_id, order_date, amount,
       AVG(amount) OVER (
         PARTITION BY customer_id
         ORDER BY order_date
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS rolling_avg_3
FROM orders
ORDER BY order_date;`,
    solutionQuery: `SELECT customer_id, order_date, amount,
       AVG(amount) OVER (
         PARTITION BY customer_id
         ORDER BY order_date
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS rolling_avg_3
FROM orders
ORDER BY order_date;`,
    explanation: 'The explicit ROWS BETWEEN 2 PRECEDING AND CURRENT ROW frame defines a moving window of exactly 3 physical rows (current + 2 before), unlike the default RANGE-based frame which would include ALL prior rows (a running average, not a 3-row rolling one) — an important distinction interviewers specifically probe.',
  },
]
