/* Original, standalone exercises at easy, medium and hard levels. */
const CODING_BANK = (()=>{
  const numpy='import numpy as np\n';
  const pandas='import pandas as pd\n';
  const matplotlib='import matplotlib.pyplot as plt\n';
  const finish=file=>`\nfig.tight_layout()\nfig.savefig("${file}")\nplt.close(fig)\nprint("Saved ${file}")`;
  const exercise=(id,topic,level,title,prompt,input,body,output,hint,checks,chart=null)=>({
    id,topic,level,title,prompt,input,starter:input+'\n\n# Write your solution below.\n',solution:input+'\n\n'+body,output,hint,checks,chart
  });
  return [
    exercise('np-discount','NumPy','Easy','Apply a store discount','Apply a 10% discount to every price without a Python loop. Round to two decimal places and print the resulting list.',
      numpy+'prices = np.array([100, 250, 80, 400], dtype=float)',
      'discounted = np.round(prices * 0.9, 2)\nprint(discounted.tolist())',
      '[90.0, 225.0, 72.0, 360.0]',
      'Multiply the whole array by 0.9. Use np.round() and .tolist() to display the result.',
      'np.testing.assert_allclose(discounted, [90, 225, 72, 360])'),
    exercise('np-temperature','NumPy','Easy','Find unusually warm days','Select temperatures strictly greater than 30°C using a Boolean mask. Print their values and the number of warm days.',
      numpy+'temperatures = np.array([28, 32, 30, 35, 29, 31])',
      'warm = temperatures[temperatures > 30]\nprint(warm.tolist())\nprint(len(warm))',
      '[32, 35, 31]\n3',
      'Build temperatures > 30, then use that Boolean array inside square brackets. A temperature of 30 is not included.',
      'np.testing.assert_array_equal(warm, [32, 35, 31])'),
    exercise('np-sales-grid','NumPy','Easy','Summarize a sales grid','Reshape the six values into two days × three products. Print the grid, the total for each product across both days, and the total for each day.',
      numpy+'sales = np.array([10, 20, 30, 15, 25, 35])',
      'grid = sales.reshape(2, 3)\nproduct_totals = grid.sum(axis=0)\nday_totals = grid.sum(axis=1)\nprint(grid.tolist())\nprint(product_totals.tolist())\nprint(day_totals.tolist())',
      '[[10, 20, 30], [15, 25, 35]]\n[25, 45, 65]\n[60, 75]',
      'The reshape keeps all six elements. axis=0 sums down the rows; axis=1 sums across the columns.',
      'assert grid.shape == (2, 3)\nnp.testing.assert_array_equal(product_totals, [25, 45, 65])\nnp.testing.assert_array_equal(day_totals, [60, 75])'),
    exercise('np-normalize','NumPy','Medium','Scale a feature safely','Min-max scale the values into the range 0 to 1. Put the calculation in a function. If all values are identical, return zeros instead of dividing by zero. Print the results for both supplied arrays.',
      numpy+'values = np.array([10, 20, 30, 40], dtype=float)\nconstant = np.array([7, 7, 7], dtype=float)',
      'def min_max_scale(a):\n    low = a.min()\n    span = a.max() - low\n    if span == 0:\n        return np.zeros_like(a, dtype=float)\n    return (a - low) / span\n\nscaled = min_max_scale(values)\nprint(np.round(scaled, 2).tolist())\nprint(min_max_scale(constant).tolist())',
      '[0.0, 0.33, 0.67, 1.0]\n[0.0, 0.0, 0.0]',
      'Use (a - a.min()) / (a.max() - a.min()), but check the denominator first. The examples contain nonempty arrays.',
      'np.testing.assert_allclose(scaled, [0, 1/3, 2/3, 1])\nnp.testing.assert_array_equal(min_max_scale(constant), [0, 0, 0])'),
    exercise('np-missing','NumPy','Medium','Repair missing sensor readings','Replace NaN readings with the mean of the available readings, without modifying the original array. Print the repaired values rounded to two decimal places.',
      numpy+'readings = np.array([20.0, np.nan, 24.0, 22.0, np.nan])',
      'average = np.nanmean(readings)\nrepaired = np.where(np.isnan(readings), average, readings)\nprint(np.round(repaired, 2).tolist())',
      '[20.0, 22.0, 24.0, 22.0, 22.0]',
      'np.nanmean() ignores NaN; np.isnan() gives a mask; np.where() chooses replacement values. These sample data have valid readings.',
      'np.testing.assert_allclose(repaired, [20, 22, 24, 22, 22])\nassert np.isnan(readings[1]) and np.isnan(readings[4])'),
    exercise('pd-revenue','Pandas','Easy','Calculate order revenue','Build a DataFrame from the order data. Add revenue = price × quantity. Print product names with revenues, then the total revenue.',
      pandas+'orders = {"product": ["Tea", "Coffee", "Juice"],\n          "price": [20, 40, 30], "quantity": [3, 2, 4]}',
      'df = pd.DataFrame(orders)\ndf["revenue"] = df["price"] * df["quantity"]\nprint(df[["product", "revenue"]].to_dict("records"))\nprint(int(df["revenue"].sum()))',
      "[{'product': 'Tea', 'revenue': 60}, {'product': 'Coffee', 'revenue': 80}, {'product': 'Juice', 'revenue': 120}]\n260",
      'Assign a new column using two existing columns. Sum the revenue column for the total.',
      'assert df["revenue"].tolist() == [60, 80, 120]\nassert df["revenue"].sum() == 260'),
    exercise('pd-filter','Pandas','Easy','Find top-performing students','Select students with scores of at least 70. Sort them by score from highest to lowest and print their names and scores.',
      pandas+'df = pd.DataFrame({"name": ["Asha", "Ravi", "Meera", "Kabir"],\n                   "score": [82, 65, 91, 70]})',
      'selected = df[df["score"] >= 70].sort_values("score", ascending=False)\nprint(selected.to_dict("records"))',
      "[{'name': 'Meera', 'score': 91}, {'name': 'Asha', 'score': 82}, {'name': 'Kabir', 'score': 70}]",
      'Filter with a Boolean condition, then call sort_values(). Include a score of exactly 70.',
      'assert selected["name"].tolist() == ["Meera", "Asha", "Kabir"]'),
    exercise('pd-clean','Pandas','Easy','Clean a small customer table','Remove duplicate customers by email, keeping the first record. Fill missing city values with "Unknown". Print the cleaned table and its row count.',
      pandas+'df = pd.DataFrame({"email": ["a@example.com", "b@example.com", "a@example.com"],\n                   "city": ["Pune", None, "Mumbai"]})',
      'clean = df.drop_duplicates(subset="email", keep="first").copy()\nclean["city"] = clean["city"].fillna("Unknown")\nprint(clean.to_dict("records"))\nprint(len(clean))',
      "[{'email': 'a@example.com', 'city': 'Pune'}, {'email': 'b@example.com', 'city': 'Unknown'}]\n2",
      'Use drop_duplicates(subset="email"). Assign the result of fillna() back to the city column.',
      'assert len(clean) == 2\nassert clean["city"].tolist() == ["Pune", "Unknown"]\nassert clean["email"].is_unique'),
    exercise('pd-group','Pandas','Medium','Summarize sales by category','Group the transactions by category. Calculate total sales and the number of orders for each category. Print the resulting records, ordered alphabetically by category.',
      pandas+'df = pd.DataFrame({"category": ["Books", "Food", "Books", "Food", "Books"],\n                   "sales": [100, 50, 150, 70, 80]})',
      'summary = df.groupby("category", as_index=False).agg(\n    total_sales=("sales", "sum"), orders=("sales", "size")\n)\nprint(summary.to_dict("records"))',
      "[{'category': 'Books', 'total_sales': 330, 'orders': 3}, {'category': 'Food', 'total_sales': 120, 'orders': 2}]",
      'Named aggregation can produce both total_sales and orders. size counts group rows. groupby sorts the keys by default.',
      'assert summary["total_sales"].tolist() == [330, 120]\nassert summary["orders"].tolist() == [3, 2]'),
    exercise('pd-join','Pandas','Medium','Join customers to their orders','Left-join orders to customers by customer_id. Keep an order even if its customer is absent from the customer table. Replace a missing customer name with "Unknown" and print the records.',
      pandas+'customers = pd.DataFrame({"customer_id": [1, 2], "name": ["Asha", "Ravi"]})\norders = pd.DataFrame({"order_id": [101, 102, 103],\n                       "customer_id": [2, 1, 3], "amount": [80, 60, 50]})',
      'joined = orders.merge(customers, on="customer_id", how="left", validate="many_to_one")\njoined["name"] = joined["name"].fillna("Unknown")\nprint(joined[["order_id", "name", "amount"]].to_dict("records"))',
      "[{'order_id': 101, 'name': 'Ravi', 'amount': 80}, {'order_id': 102, 'name': 'Asha', 'amount': 60}, {'order_id': 103, 'name': 'Unknown', 'amount': 50}]",
      'Keep orders on the left. A left join preserves them; validate="many_to_one" checks that customer keys are unique on the right.',
      'assert len(joined) == 3\nassert joined["name"].tolist() == ["Ravi", "Asha", "Unknown"]'),
    exercise('mpl-line','Matplotlib','Easy','Plot weekly café sales','Draw a line chart with circular markers. Label the axes Day and Sales (INR), add the title Weekly cafe sales, and save it as weekly-sales.svg.',
      matplotlib+'days = ["Mon", "Tue", "Wed", "Thu", "Fri"]\nsales = [200, 260, 220, 300, 350]',
      'fig, ax = plt.subplots(figsize=(6, 3.5))\nax.plot(days, sales, marker="o", color="#21534a")\nax.set(xlabel="Day", ylabel="Sales (INR)", title="Weekly cafe sales")'+finish('weekly-sales.svg'),
      'Saved weekly-sales.svg',
      'Create fig and ax with plt.subplots(). Use ax.plot(), axis labels, and fig.savefig(). Open the saved file to inspect the chart.',
      'assert ax.get_xlabel() == "Day"\nassert ax.get_ylabel() == "Sales (INR)"\nassert list(ax.lines[0].get_ydata()) == sales',
      {file:'weekly-sales.svg',description:'Five points from Monday to Friday: 200, 260, 220, 300, 350, connected by a line with circular markers.'}),
    exercise('mpl-bar','Matplotlib','Easy','Compare product revenue','Draw a bar chart comparing Tea, Coffee and Juice. Label the axes, add the title Product revenue, and save it as product-revenue.svg. Start the vertical axis at zero.',
      matplotlib+'products = ["Tea", "Coffee", "Juice"]\nrevenue = [180, 300, 240]',
      'fig, ax = plt.subplots(figsize=(6, 3.5))\nax.bar(products, revenue, color=["#21534a", "#86aa85", "#e6b676"])\nax.set(xlabel="Product", ylabel="Revenue (INR)", title="Product revenue", ylim=(0, 350))'+finish('product-revenue.svg'),
      'Saved product-revenue.svg',
      'Use ax.bar(products, revenue). The bar heights should match the revenue values; a zero baseline makes the comparison clear.',
      'assert [bar.get_height() for bar in ax.patches] == revenue\nassert ax.get_ylim()[0] == 0',
      {file:'product-revenue.svg',description:'Three bars with heights 180, 300 and 240. Coffee is the highest and Tea is the lowest.'}),
    exercise('mpl-scatter','Matplotlib','Easy','Compare study hours and scores','Draw a scatter plot of study hours versus exam scores. Label both axes, add the title Study time and scores, and save it as study-scores.svg.',
      matplotlib+'hours = [1, 2, 3, 4, 5]\nscores = [45, 55, 60, 72, 85]',
      'fig, ax = plt.subplots(figsize=(6, 3.5))\nax.scatter(hours, scores, color="#21534a", s=60)\nax.set(xlabel="Study hours", ylabel="Exam score", title="Study time and scores")'+finish('study-scores.svg'),
      'Saved study-scores.svg',
      'Use ax.scatter(x, y). Each pair of values becomes one point; do not connect the points for this exercise.',
      'np.testing.assert_array_equal(ax.collections[0].get_offsets(), list(zip(hours, scores)))',
      {file:'study-scores.svg',description:'Five separate points: (1,45), (2,55), (3,60), (4,72), (5,85). They show an upward pattern.'}),
    exercise('mpl-histogram','Matplotlib','Medium','Build a delivery-time histogram','Plot a histogram with bin edges [0, 10, 20, 30]. Label the axes Minutes and Deliveries. Print the number of deliveries in each bin, then save delivery-times.svg.',
      matplotlib+'minutes = [5, 7, 12, 14, 17, 22, 25, 29]\nedges = [0, 10, 20, 30]',
      'fig, ax = plt.subplots(figsize=(6, 3.5))\ncounts, bins, patches = ax.hist(minutes, bins=edges, color="#86aa85", edgecolor="white")\nax.set(xlabel="Minutes", ylabel="Deliveries", title="Delivery time distribution")\nprint(counts.astype(int).tolist())'+finish('delivery-times.svg'),
      '[2, 3, 3]\nSaved delivery-times.svg',
      'ax.hist() returns counts, bin edges and bar objects. Bins normally exclude their right edge, except the final bin.',
      'np.testing.assert_array_equal(counts, [2, 3, 3])\nnp.testing.assert_array_equal(bins, edges)',
      {file:'delivery-times.svg',description:'Three adjacent bins cover 0–10, 10–20 and 20–30 minutes, with counts 2, 3 and 3.'}),
    exercise('mpl-subplots','Matplotlib','Medium','Make a two-product dashboard','Create two charts side by side using one row and two columns. Plot Tea and Coffee sales over three months. Give each chart a title and labeled axes. Save two-products.svg.',
      matplotlib+'months = ["Jan", "Feb", "Mar"]\ntea = [100, 120, 140]\ncoffee = [150, 130, 170]',
      'fig, axes = plt.subplots(1, 2, figsize=(8, 3.5))\nfor ax, values, name in zip(axes, [tea, coffee], ["Tea", "Coffee"]):\n    ax.plot(months, values, marker="o", color="#21534a")\n    ax.set(title=name, xlabel="Month", ylabel="Sales (INR)")'+finish('two-products.svg'),
      'Saved two-products.svg',
      'plt.subplots(1, 2) returns two Axes. You can loop over the axes, product data and names using zip().',
      'assert len(fig.axes) == 2\nassert [a.get_title() for a in axes] == ["Tea", "Coffee"]\nassert list(axes[1].lines[0].get_ydata()) == coffee',
      {file:'two-products.svg',description:'Two side-by-side line charts: Tea rises 100 → 120 → 140; Coffee moves 150 → 130 → 170.'}),
    exercise('mix-grade','NumPy + Pandas','Easy','Assign student result labels','Create a NumPy condition from the score column and use np.where() to assign Pass for scores at least 50, otherwise Retry. Add the labels to the DataFrame and print its records.',
      numpy+pandas+'df = pd.DataFrame({"name": ["Asha", "Ravi", "Meera"], "score": [72, 45, 50]})',
      'scores = df["score"].to_numpy()\ndf["result"] = np.where(scores >= 50, "Pass", "Retry")\nprint(df.to_dict("records"))',
      "[{'name': 'Asha', 'score': 72, 'result': 'Pass'}, {'name': 'Ravi', 'score': 45, 'result': 'Retry'}, {'name': 'Meera', 'score': 50, 'result': 'Pass'}]",
      'Extract the score values with .to_numpy(). np.where(condition, "Pass", "Retry") creates labels in the original row order.',
      'assert df["result"].tolist() == ["Pass", "Retry", "Pass"]'),
    exercise('mix-impute','NumPy + Pandas','Medium','Clean a numerical feature','Parse the raw prices as numbers, treating invalid strings as missing. Convert them to a NumPy array, fill missing values with the median of valid prices, and add a clean_price column to the table.',
      numpy+pandas+'df = pd.DataFrame({"raw_price": ["10", "bad", "30", "50", None]})',
      'numeric = pd.to_numeric(df["raw_price"], errors="coerce")\nvalues = numeric.to_numpy(dtype=float)\nmedian = np.nanmedian(values)\ndf["clean_price"] = np.where(np.isnan(values), median, values)\nprint(df["clean_price"].tolist())',
      '[10.0, 30.0, 30.0, 50.0, 30.0]',
      'Use errors="coerce", np.nanmedian() and np.where(). The sample includes valid prices; an all-missing column would need a separate policy.',
      'assert df["clean_price"].tolist() == [10, 30, 30, 50, 30]\nassert not df["clean_price"].isna().any()'),
    exercise('mix-normalize','NumPy + Pandas','Medium','Scale multiple feature columns','Min-max scale the age and spend columns separately using a two-dimensional NumPy array. Add age_scaled and spend_scaled columns. Print their values rounded to two decimals. Protect against a constant column by using a denominator of 1 for that column.',
      numpy+pandas+'df = pd.DataFrame({"age": [20, 30, 40], "spend": [100, 300, 500]})',
      'values = df[["age", "spend"]].to_numpy(dtype=float)\nlow = values.min(axis=0)\nspan = values.max(axis=0) - low\nsafe_span = np.where(span == 0, 1, span)\nscaled = (values - low) / safe_span\ndf[["age_scaled", "spend_scaled"]] = scaled\nprint(df[["age_scaled", "spend_scaled"]].round(2).values.tolist())',
      '[[0.0, 0.0], [0.5, 0.5], [1.0, 1.0]]',
      'axis=0 computes per-column minima and maxima. Broadcasting applies each denominator to the corresponding feature column.',
      'np.testing.assert_allclose(scaled, [[0, 0], [.5, .5], [1, 1]])\nassert np.where(np.array([0, 2]) == 0, 1, np.array([0, 2])).tolist() == [1, 2]'),
    exercise('all-revenue','NumPy + Pandas + Matplotlib','Easy','Calculate and chart product totals','Convert price and quantity columns into NumPy arrays and multiply them to calculate revenue. Use Pandas to total revenue per product, then plot those totals as a bar chart. Print totals and save grouped-revenue.svg.',
      numpy+pandas+matplotlib+'df = pd.DataFrame({"product": ["Tea", "Coffee", "Tea", "Juice"],\n                   "price": [20, 40, 20, 30], "quantity": [3, 2, 4, 2]})',
      'df["revenue"] = df["price"].to_numpy() * df["quantity"].to_numpy()\ntotals = df.groupby("product")["revenue"].sum()\nprint(totals.to_dict())\nfig, ax = plt.subplots(figsize=(6, 3.5))\nax.bar(totals.index, totals.values, color="#86aa85")\nax.set(xlabel="Product", ylabel="Revenue (INR)", title="Revenue by product")'+finish('grouped-revenue.svg'),
      "{'Coffee': 80, 'Juice': 60, 'Tea': 140}\nSaved grouped-revenue.svg",
      'Use NumPy multiplication, groupby().sum(), and ax.bar(). The category order follows the grouped index.',
      'assert totals.to_dict() == {"Coffee": 80, "Juice": 60, "Tea": 140}\nassert [bar.get_height() for bar in ax.patches] == [80, 60, 140]',
      {file:'grouped-revenue.svg',description:'Alphabetical product bars: Coffee 80, Juice 60, Tea 140. Tea has the highest total revenue.'}),
    exercise('all-weather','NumPy + Pandas + Matplotlib','Medium','Repair and plot a weather series','Parse the dates with Pandas, use NumPy to replace missing temperatures with the mean of valid readings, and plot the cleaned daily series. Print repaired values and save cleaned-weather.svg.',
      numpy+pandas+matplotlib+'df = pd.DataFrame({"date": ["2026-08-01", "2026-08-02", "2026-08-03", "2026-08-04"],\n                   "temperature": [28.0, np.nan, 32.0, 30.0]})',
      'df["date"] = pd.to_datetime(df["date"])\nvalues = df["temperature"].to_numpy(dtype=float)\ndf["clean_temperature"] = np.where(np.isnan(values), np.nanmean(values), values)\nprint(df["clean_temperature"].tolist())\nfig, ax = plt.subplots(figsize=(6, 3.5))\nax.plot(df["date"], df["clean_temperature"], marker="o", color="#21534a")\nax.set(xlabel="Date", ylabel="Temperature (C)", title="Cleaned daily temperatures")\nfig.autofmt_xdate()'+finish('cleaned-weather.svg'),
      '[28.0, 30.0, 32.0, 30.0]\nSaved cleaned-weather.svg',
      'The valid readings average 30. Parse dates before plotting them. Imputation is an exercise policy, not a universal rule for weather analysis.',
      'assert df["clean_temperature"].tolist() == [28, 30, 32, 30]\nassert len(ax.lines[0].get_ydata()) == 4',
      {file:'cleaned-weather.svg',description:'A dated line chart for August 1–4, 2026, with temperatures 28, 30, 32 and 30°C.'}),
    exercise('all-targets','NumPy + Pandas + Matplotlib','Medium','Build a target-performance chart','Calculate each store’s achievement percentage with NumPy: sales / target × 100. Add it to the DataFrame. Color bars green for achievement at least 100%, otherwise amber. Add a dashed 100% target line, print percentages, and save store-targets.svg.',
      numpy+pandas+matplotlib+'df = pd.DataFrame({"store": ["North", "South", "West"],\n                   "sales": [120, 80, 150], "target": [100, 100, 120]})',
      'sales = df["sales"].to_numpy(dtype=float)\ntargets = df["target"].to_numpy(dtype=float)\nif np.any(targets <= 0):\n    raise ValueError("Targets must be positive")\ndf["achievement"] = np.round(sales / targets * 100, 2)\ncolors = np.where(df["achievement"] >= 100, "#21534a", "#e6b676")\nprint(df["achievement"].tolist())\nfig, ax = plt.subplots(figsize=(6, 3.5))\nax.bar(df["store"], df["achievement"], color=colors)\nax.axhline(100, color="#555555", linestyle="--", label="Target")\nax.set(xlabel="Store", ylabel="Achievement (%)", title="Store target achievement")\nax.legend()'+finish('store-targets.svg'),
      '[120.0, 80.0, 125.0]\nSaved store-targets.svg',
      'Validate positive targets before division. np.where() creates colors from the percentage condition. ax.axhline() adds the reference line.',
      'assert df["achievement"].tolist() == [120, 80, 125]\nassert len(ax.patches) == 3\nassert list(ax.lines[0].get_ydata()) == [100, 100]',
      {file:'store-targets.svg',description:'North 120% and West 125% appear green; South 80% appears amber. A dashed line marks the 100% target.'}),
    exercise('hard-np-rolling','NumPy','Hard','Calculate reliable rolling sensor means','Write a function that computes three-reading rolling means for each sensor using vectorized window reductions. Ignore NaN readings, but require at least two valid readings per window. Return NaN for insufficient data and display it as None. Validate the window and minimum-valid count; do not modify the input.',
      numpy+'readings = np.array([[10, np.nan, 14, 16, 18, 20],\n                     [np.nan, np.nan, 30, 36, 42, np.nan]])',
      `def rolling_means(data, window=3, min_valid=2):
    data = np.asarray(data, dtype=float)
    if not isinstance(window, (int, np.integer)) or not isinstance(min_valid, (int, np.integer)):
        raise ValueError("Window and min_valid must be integers")
    if data.ndim != 2 or not 1 <= window <= data.shape[1]:
        raise ValueError("Expected a 2-D array and a valid window")
    if not 1 <= min_valid <= window:
        raise ValueError("min_valid must be between 1 and window")
    windows = np.lib.stride_tricks.sliding_window_view(data, window, axis=1)
    counts = np.sum(~np.isnan(windows), axis=-1)
    totals = np.nansum(windows, axis=-1)
    return np.divide(totals, counts, out=np.full(totals.shape, np.nan),
                     where=counts >= min_valid)

averages = rolling_means(readings)
display = [[None if np.isnan(v) else round(float(v), 2) for v in row]
           for row in averages]
print(display)`,
      '[[12.0, 15.0, 16.0, 18.0], [None, 33.0, 36.0, 39.0]]',
      'sliding_window_view(..., axis=1) adds the window axis at the end. Reduce that last axis and use np.divide(out=..., where=...) to avoid invalid division. For these inputs, NaN is the only missing-value marker.',
      'np.testing.assert_allclose(averages, [[12, 15, 16, 18], [np.nan, 33, 36, 39]], equal_nan=True)\nassert np.isnan(rolling_means([[np.nan, np.nan, np.nan]])).all()\nassert np.isnan(readings[0, 1])'),
    exercise('hard-np-neighbors','NumPy','Hard','Find nearest neighbors with broadcasting','For each point, find the indices of its two nearest other points using squared Euclidean distance. Exclude only the same row, so distinct rows with identical coordinates remain valid neighbors. Break distance ties by the smaller row index. Validate finite coordinates and k between 1 and n−1, and print neighbor names.',
      numpy+'points = np.array([[0, 0], [1, 0], [0, 2], [3, 0]], dtype=float)\nnames = np.array(["A", "B", "C", "D"])',
      `def nearest_indices(points, k):
    points = np.asarray(points, dtype=float)
    if points.ndim != 2 or len(points) < 2 or points.shape[1] == 0:
        raise ValueError("Need at least two rows of coordinates")
    if not np.isfinite(points).all() or not isinstance(k, (int, np.integer)) or not 1 <= k < len(points):
        raise ValueError("Need finite coordinates and 1 <= k < n")
    differences = points[:, None, :] - points[None, :, :]
    distances = np.sum(differences ** 2, axis=-1)
    np.fill_diagonal(distances, np.inf)
    return np.argsort(distances, axis=1, kind="stable")[:, :k]

indices = nearest_indices(points, 2)
print(names[indices].tolist())`,
      "[['B', 'C'], ['A', 'D'], ['A', 'B'], ['B', 'A']]",
      'Broadcast an (n,1,d) array against a (1,n,d) array. Mask the diagonal with infinity and use stable sorting. This builds an n×n distance matrix, so it is a small-dataset teaching approach.',
      'np.testing.assert_array_equal(indices, [[1, 2], [0, 3], [0, 1], [1, 0]])\nassert nearest_indices([[0, 0], [0, 0], [1, 0]], 1).tolist() == [[1], [0], [0]]'),
    exercise('hard-pd-asof','Pandas','Hard','Match orders to historical prices','Attach the most recent price at or before each order time for the same product. Reject duplicate product/price-time records. Do not use prices older than three days, and keep orders with no eligible price. Calculate revenue, restore order_id order, and display missing price/revenue values as None.',
      pandas+'prices = pd.DataFrame({"product": ["A", "A", "B"],\n    "price_time": ["2026-08-01", "2026-08-03", "2026-08-02"], "price": [100, 120, 50]})\norders = pd.DataFrame({"order_id": [11, 12, 13, 14], "product": ["A", "A", "B", "C"],\n    "order_time": ["2026-08-02", "2026-08-04", "2026-08-04", "2026-08-04"],\n    "quantity": [2, 1, 3, 1]})',
      `def attach_prices(orders, prices):
    orders, prices = orders.copy(), prices.copy()
    orders["order_time"] = pd.to_datetime(orders["order_time"])
    prices["price_time"] = pd.to_datetime(prices["price_time"])
    if prices.duplicated(["product", "price_time"]).any():
        raise ValueError("Duplicate product/price-time records")
    matched = pd.merge_asof(
        orders.sort_values("order_time"), prices.sort_values("price_time"),
        left_on="order_time", right_on="price_time", by="product",
        direction="backward", tolerance=pd.Timedelta(days=3)
    )
    matched["revenue"] = matched["price"] * matched["quantity"]
    return matched.sort_values("order_id")

matched = attach_prices(orders, prices)
result = matched[["order_id", "price", "revenue"]].astype(object)
print(result.where(pd.notna(result), None).to_dict("records"))`,
      "[{'order_id': 11, 'price': 100.0, 'revenue': 200.0}, {'order_id': 12, 'price': 120.0, 'revenue': 120.0}, {'order_id': 13, 'price': 50.0, 'revenue': 150.0}, {'order_id': 14, 'price': None, 'revenue': None}]",
      'merge_asof requires both tables to be globally sorted by their time keys. Use by="product", direction="backward" and a Timedelta tolerance. A standard merge cannot implement this time-based rule.',
      'assert matched["order_id"].tolist() == [11, 12, 13, 14]\nassert matched["revenue"].iloc[:3].tolist() == [200, 120, 150]\nassert pd.isna(matched["price"].iloc[3])\nold_order = orders.iloc[[0]].copy()\nold_order["order_time"] = "2026-08-10"\nassert attach_prices(old_order, prices)["price"].isna().all()'),
    exercise('hard-pd-calendar','Pandas','Hard','Complete a calendar before rolling averages','Build every product/date combination from August 1–4, 2026. Aggregate same-day sales and fill absent combinations with zero. Calculate a three-day rolling mean independently per product, requiring a full window. Sort by product/date and print the sales and rounded mean lists; show incomplete windows as None.',
      pandas+'df = pd.DataFrame({"product": ["A", "A", "B", "B"],\n    "date": ["2026-08-01", "2026-08-03", "2026-08-02", "2026-08-04"],\n    "sales": [10, 30, 20, 40]})',
      `df["date"] = pd.to_datetime(df["date"])
calendar = pd.date_range("2026-08-01", "2026-08-04")
grid = pd.MultiIndex.from_product([sorted(df["product"].unique()), calendar],
                                  names=["product", "date"])
daily = df.groupby(["product", "date"])["sales"].sum().reindex(grid, fill_value=0)
daily = daily.rename("sales").reset_index()
daily["rolling_mean"] = daily.groupby("product")["sales"].transform(
    lambda values: values.rolling(3, min_periods=3).mean()
).round(2)
means = daily["rolling_mean"].astype(object)
print(daily["sales"].tolist())
print(means.where(pd.notna(means), None).tolist())`,
      '[10, 0, 30, 0, 0, 20, 0, 40]\n[None, None, 13.33, 10.0, None, None, 6.67, 20.0]',
      'Reindex onto a complete MultiIndex before rolling. Otherwise three observations can span more than three calendar days. groupby().transform() aligns each result to its original row.',
      'assert len(daily) == 8\nassert daily["sales"].sum() == 100\nassert daily.groupby("product")["rolling_mean"].apply(lambda x: x.isna().sum()).tolist() == [2, 2]'),
    exercise('hard-mpl-stacked','Matplotlib','Hard','Compare quarterly revenue shares','Build a 100% stacked bar chart for Tea and Coffee in three quarters. Convert revenue to percentages, reject zero or negative quarter totals, label both segments with one decimal place, use a 0–100% vertical axis and add a legend. Print both percentage lists and save quarterly-shares.svg.',
      matplotlib+'from matplotlib.ticker import PercentFormatter\nquarters = ["Q1", "Q2", "Q3"]\ntea = [120, 180, 150]\ncoffee = [180, 120, 250]',
      `totals = [a + b for a, b in zip(tea, coffee)]
if any(total <= 0 for total in totals):
    raise ValueError("Quarter totals must be positive")
tea_pct = [a / total * 100 for a, total in zip(tea, totals)]
coffee_pct = [b / total * 100 for b, total in zip(coffee, totals)]
print(tea_pct)
print(coffee_pct)
fig, ax = plt.subplots(figsize=(6, 3.5))
tea_bars = ax.bar(quarters, tea_pct, label="Tea", color="#21534a")
coffee_bars = ax.bar(quarters, coffee_pct, bottom=tea_pct,
                     label="Coffee", color="#d7e7ab")
ax.bar_label(tea_bars, labels=[f"{v:.1f}%" for v in tea_pct],
             label_type="center", color="white")
ax.bar_label(coffee_bars, labels=[f"{v:.1f}%" for v in coffee_pct], label_type="center")
ax.set(xlabel="Quarter", ylabel="Revenue share", title="Quarterly product mix", ylim=(0, 100))
ax.yaxis.set_major_formatter(PercentFormatter(100))
ax.legend(loc="upper left", bbox_to_anchor=(1, 1))`+finish('quarterly-shares.svg'),
      '[40.0, 60.0, 37.5]\n[60.0, 40.0, 62.5]\nSaved quarterly-shares.svg',
      'Each quarter is its own denominator. The second bar series needs bottom=tea_pct. bar_label(label_type="center") positions labels inside each segment.',
      'np.testing.assert_allclose(np.array(tea_pct) + coffee_pct, [100, 100, 100])\nassert len(ax.patches) == 6\nassert len(ax.texts) == 6\nassert ax.get_ylim() == (0, 100)',
      {file:'quarterly-shares.svg',description:'Three bars each total 100%. Tea shares are 40%, 60%, 37.5%; Coffee shares are 60%, 40%, 62.5%, with labels inside the segments.'}),
    exercise('hard-mpl-heatmaps','Matplotlib','Hard','Use a shared scale for two heatmaps','Plot Before and After team scores side by side. Annotate every cell, label rows and columns, and use the same 0–100 color scale with one shared colorbar. Use constrained layout so the colorbar does not overlap the charts. Save team-score-heatmaps.svg.',
      matplotlib+'teams = ["Support", "Sales", "Ops"]\nmetrics = ["Speed", "Quality", "Coverage"]\nbefore = [[70, 65, 80], [80, 75, 60], [60, 70, 75]]\nafter = [[80, 75, 90], [85, 80, 70], [70, 75, 85]]',
      `fig, axes = plt.subplots(1, 2, figsize=(9, 4), layout="constrained")
for ax, matrix, title in zip(axes, [before, after], ["Before", "After"]):
    image = ax.imshow(matrix, vmin=0, vmax=100, cmap="viridis")
    ax.set_xticks(range(len(metrics)), labels=metrics)
    ax.set_yticks(range(len(teams)), labels=teams)
    ax.set_title(title)
    for row in range(len(teams)):
        for col in range(len(metrics)):
            value = matrix[row][col]
            ax.text(col, row, str(value), ha="center", va="center",
                    color="white" if value < 60 else "black")
fig.colorbar(image, ax=axes.tolist(), label="Score (0–100)")
fig.savefig("team-score-heatmaps.svg")
plt.close(fig)
print("Saved team-score-heatmaps.svg")`,
      'Saved team-score-heatmaps.svg',
      'Set identical vmin and vmax on both images. Pass both Axes to fig.colorbar(). Annotate using column as x and row as y; do not call tight_layout() after choosing constrained layout.',
      'assert len(fig.axes) == 3\nassert all(ax.images[0].get_clim() == (0, 100) for ax in axes)\nassert all(len(ax.texts) == 9 for ax in axes)\nnp.testing.assert_array_equal(axes[1].images[0].get_array(), after)',
      {file:'team-score-heatmaps.svg',description:'Two annotated 3×3 heatmaps, Before and After, share one colorbar spanning 0–100 so the same score has the same color in both panels.'}),
    exercise('hard-mix-outliers','NumPy + Pandas','Hard','Detect outliers within each region','Calculate Q1, Q3 and IQR separately for each region with Pandas. Use NumPy to flag values outside Q1−1.5×IQR through Q3+1.5×IQR. For a zero-IQR group, flag any value different from its median. Print flagged row indices and outlier counts per region.',
      numpy+pandas+'df = pd.DataFrame({"region": ["East"] * 5 + ["West"] * 5,\n    "sales": [10, 11, 12, 13, 100, 20, 20, 20, 20, 50]})',
      `def flag_outliers(data):
    data = data.copy()
    groups = data.groupby("region")["sales"]
    q1 = groups.transform(lambda values: values.quantile(0.25)).to_numpy()
    q3 = groups.transform(lambda values: values.quantile(0.75)).to_numpy()
    medians = groups.transform("median").to_numpy()
    values = data["sales"].to_numpy()
    iqr = q3 - q1
    outside = (values < q1 - 1.5 * iqr) | (values > q3 + 1.5 * iqr)
    data["outlier"] = np.where(iqr == 0, values != medians, outside)
    return data

flagged = flag_outliers(df)
print(flagged.index[flagged["outlier"]].tolist())
print(flagged.groupby("region")["outlier"].sum().to_dict())`,
      "[4, 9]\n{'East': 1, 'West': 1}",
      'transform broadcasts group statistics back to rows. Use strict < and > comparisons; points exactly at a boundary are included. The finite sample values need no missing-value policy.',
      'assert flagged.index[flagged["outlier"]].tolist() == [4, 9]\nconstant = pd.DataFrame({"region": ["X"] * 3, "sales": [7, 7, 7]})\nassert not flag_outliers(constant)["outlier"].any()'),
    exercise('hard-mix-standardize','NumPy + Pandas','Hard','Standardize features without data leakage','Fit population means and standard deviations using training rows only. Apply them to validation rows using the specified feature order, even though validation columns arrive in a different order. Use scale 1 for a constant training feature and preserve the validation index. Print transformed values rounded to two decimals and their index.',
      numpy+pandas+'features = ["age", "spend", "constant"]\ntrain = pd.DataFrame({"age": [20, 30, 40], "spend": [100, 200, 300], "constant": [1, 1, 1]})\nvalidation = pd.DataFrame({"spend": [400, 100], "constant": [1, 2], "age": [50, 20]}, index=[101, 105])',
      `def standardize(train, validation, features):
    values = train.loc[:, features].to_numpy(dtype=float)
    test_values = validation.loc[:, features].to_numpy(dtype=float)
    if len(values) == 0 or not np.isfinite(values).all() or not np.isfinite(test_values).all():
        raise ValueError("Need nonempty finite training data and finite validation values")
    means = values.mean(axis=0)
    std = values.std(axis=0, ddof=0)
    scales = np.where(std == 0, 1, std)
    transformed = (test_values - means) / scales
    result = pd.DataFrame(transformed, columns=features, index=validation.index)
    return result, means, scales

result, means, scales = standardize(train, validation, features)
print(result.round(2).values.tolist())
print(result.index.tolist())`,
      '[[2.45, 2.45, 0.0], [-1.22, -1.22, 1.0]]\n[101, 105]',
      'Select both tables with .loc[:, features] before converting to arrays. Learn statistics only from train; validation data must not influence preprocessing parameters.',
      'np.testing.assert_allclose(means, [30, 200, 1])\nassert result.index.tolist() == [101, 105]\nassert result.columns.tolist() == features\nassert scales[2] == 1\n_, changed_means, changed_scales = standardize(train, validation * 10, features)\nnp.testing.assert_allclose(changed_means, means)\nnp.testing.assert_allclose(changed_scales, scales)'),
    exercise('hard-all-revenue','NumPy + Pandas + Matplotlib','Hard','Clean and chart a daily revenue pipeline','Parse dates and reject invalid dates. Convert sales to numbers and use NumPy to replace nonfinite or negative amounts with zero. Aggregate duplicate dates and create the full daily calendar. Calculate a full-window three-day moving mean. Print the audit counts and values, then plot daily bars with a rolling-mean line and save revenue-pipeline.svg.',
      numpy+pandas+matplotlib+'raw = pd.DataFrame({"date": ["2026-08-01", "2026-08-01", "2026-08-03",\n    "2026-08-04", "2026-08-06", "not-a-date"],\n    "sales": ["100", "50", "bad", "-20", "200", "999"]})',
      `raw["date"] = pd.to_datetime(raw["date"], errors="coerce")
rejected_dates = int(raw["date"].isna().sum())
clean = raw.dropna(subset=["date"]).copy()
values = pd.to_numeric(clean["sales"], errors="coerce").to_numpy(dtype=float)
invalid = ~np.isfinite(values) | (values < 0)
clean["sales"] = np.where(invalid, 0, values)
daily = clean.set_index("date")["sales"].resample("D").sum()
rolling = daily.rolling(3, min_periods=3).mean()
print(f"Rejected dates: {rejected_dates}")
print(f"Repaired sales: {int(invalid.sum())}")
print(daily.tolist())
display = [None if pd.isna(v) else round(float(v), 2) for v in rolling]
print(display)
fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(daily.index, daily.values, width=0.7, label="Daily revenue", color="#d7e7ab")
ax.plot(rolling.index, rolling.values, marker="o", label="3-day mean", color="#21534a")
ax.set(xlabel="Date", ylabel="Revenue (INR)", title="Cleaned daily revenue")
ax.legend()
fig.autofmt_xdate()`+finish('revenue-pipeline.svg'),
      'Rejected dates: 1\nRepaired sales: 2\n[150.0, 0.0, 0.0, 0.0, 0.0, 200.0]\n[None, None, 50.0, 0.0, 0.0, 66.67]\nSaved revenue-pipeline.svg',
      'Audit dropped dates separately from repaired sales. resample("D").sum() both combines repeated days and fills empty days with zero here. Compute rolling values after creating the calendar. These replacement rules are exercise choices, not a universal cleaning policy.',
      'assert rejected_dates == 1 and invalid.sum() == 2\nassert daily.sum() == 350 and len(daily) == 6\nnp.testing.assert_allclose(rolling.iloc[2:], [50, 0, 0, 200/3])\nassert len(ax.patches) == 6 and len(ax.lines) == 1',
      {file:'revenue-pipeline.svg',description:'Daily bars cover August 1–6: 150, 0, 0, 0, 0, 200. A three-day mean starts on August 3 at 50 and ends at approximately 66.67.'}),
    exercise('hard-all-correlation','NumPy + Pandas + Matplotlib','Hard','Build a correlation heatmap safely','Select numeric columns, treat nonfinite values as missing and drop incomplete rows. Remove constant columns, then validate that at least two rows and two variable columns remain. Compute Pearson correlation with NumPy, label it with Pandas, and plot an annotated heatmap with a fixed −1 to 1 scale. Report used rows and excluded constant columns; save feature-correlation.svg.',
      numpy+pandas+matplotlib+'df = pd.DataFrame({"store": ["A", "B", "C", "D", "E"],\n    "ad_spend": [10, 20, 30, 40, 50], "sales": [100, 200, 150, 300, np.nan],\n    "constant": [5, 5, 5, 5, 5]})',
      `def feature_correlation(data):
    numeric = data.select_dtypes(include="number").replace([np.inf, -np.inf], np.nan).dropna()
    if len(numeric) < 2:
        raise ValueError("Need at least two complete rows")
    values = numeric.to_numpy(dtype=float)
    variable = np.ptp(values, axis=0) > 0
    excluded = numeric.columns[~variable].tolist()
    labels = numeric.columns[variable]
    if len(labels) < 2:
        raise ValueError("Need at least two variable numeric columns")
    matrix = np.corrcoef(values[:, variable], rowvar=False)
    return pd.DataFrame(matrix, index=labels, columns=labels), len(numeric), excluded

corr, used_rows, excluded = feature_correlation(df)
print(f"Used rows: {used_rows}")
print(f"Excluded constants: {excluded}")
print(corr.round(3).values.tolist())
fig, ax = plt.subplots(figsize=(5.5, 4))
image = ax.imshow(corr.values, cmap="RdBu_r", vmin=-1, vmax=1)
ax.set_xticks(range(len(corr)), labels=corr.columns)
ax.set_yticks(range(len(corr)), labels=corr.index)
for row in range(len(corr)):
    for col in range(len(corr)):
        ax.text(col, row, f"{corr.iloc[row, col]:.2f}", ha="center", va="center", color="white")
ax.set_title("Feature correlation")
fig.colorbar(image, ax=ax, label="Pearson r")`+finish('feature-correlation.svg'),
      "Used rows: 4\nExcluded constants: ['constant']\n[[1.0, 0.832], [0.832, 1.0]]\nSaved feature-correlation.svg",
      'Keep labels when converting arrays back to a table. Use rowvar=False because rows are observations. Constant features have undefined correlation; remove them before computation. Correlation shows association, not causation.',
      'assert used_rows == 4 and excluded == ["constant"]\nassert corr.columns.tolist() == ["ad_spend", "sales"]\nnp.testing.assert_allclose(corr.values, corr.values.T)\nnp.testing.assert_allclose(np.diag(corr), [1, 1])\nassert image.get_clim() == (-1, 1)',
      {file:'feature-correlation.svg',description:'A labeled 2×2 heatmap with diagonal values 1.00 and ad_spend/sales correlation approximately 0.83. The constant column and incomplete fifth row are excluded.'})
  ];
})();
