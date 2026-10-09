"""Run standalone teaching solutions and validate numerical results and plot structure."""
import contextlib
import io
import json
import os
from pathlib import Path
import shutil
import sys
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parent
sys.path.insert(0, str(root / '.coding-test-deps'))
work = root / '.coding-verification'
work.mkdir(exist_ok=True)
os.environ['MPLCONFIGDIR'] = str(work / 'matplotlib-cache')
import matplotlib
matplotlib.use('Agg')
import numpy as np

bank = json.loads((root / 'coding-verification.json').read_text(encoding='utf-8'))
os.chdir(work)
for q in bank:
    compile(q['starter'], q['id'] + '-starter.py', 'exec')
    ns = {'np': np}
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        exec(compile(q['solution'], q['id'] + '.py', 'exec'), ns)
    assert output.getvalue().strip() == q['output'], (q['id'], output.getvalue(), q['output'])
    exec(q['checks'], ns)
    if q['chart']:
        source = work / q['chart']['file']
        assert source.is_file() and source.stat().st_size > 500
        ET.parse(source)
        target = root / 'dist' / 'assets' / ('coding-' + q['id'] + '.svg')
        if not target.exists() or '--refresh-charts' in sys.argv:
            shutil.copyfile(source, target)
    print('PASS', q['id'])

# Check the normalization boundary using a real constant feature column.
q = next(q for q in bank if q['id'] == 'mix-normalize')
ns = {'np': np}
with contextlib.redirect_stdout(io.StringIO()):
    exec(q['solution'].replace('[20, 30, 40]', '[20, 20, 20]'), ns)
np.testing.assert_array_equal(ns['scaled'][:, 0], [0, 0, 0])
np.testing.assert_allclose(ns['scaled'][:, 1], [0, .5, 1])
print('PASS constant-feature boundary')

# Hard exercises: validate failure cases rather than only the supplied data.
def load_solution(exercise_id):
    q = next(q for q in bank if q['id'] == exercise_id)
    namespace = {'np': np}
    with contextlib.redirect_stdout(io.StringIO()):
        exec(q['solution'], namespace)
    return namespace

def expects_value_error(call):
    try:
        call()
    except ValueError:
        return
    raise AssertionError('Expected ValueError')

rolling_ns = load_solution('hard-np-rolling')
expects_value_error(lambda: rolling_ns['rolling_means']([[1, 2]], window=3))
expects_value_error(lambda: rolling_ns['rolling_means']([[1, 2, 3]], min_valid=0))
expects_value_error(lambda: rolling_ns['rolling_means']([[1, 2, 3]], window=1.5))
neighbors_ns = load_solution('hard-np-neighbors')
expects_value_error(lambda: neighbors_ns['nearest_indices']([[0, 0], [1, 1]], 2))
expects_value_error(lambda: neighbors_ns['nearest_indices']([[0, 0], [np.nan, 1]], 1))
expects_value_error(lambda: neighbors_ns['nearest_indices']([[0, 0], [1, 1]], 1.5))
prices_ns = load_solution('hard-pd-asof')
pd = prices_ns['pd']
duplicates = pd.concat([prices_ns['prices'], prices_ns['prices'].iloc[[0]]])
expects_value_error(lambda: prices_ns['attach_prices'](prices_ns['orders'], duplicates))
corr_ns = load_solution('hard-all-correlation')
expects_value_error(lambda: corr_ns['feature_correlation'](pd.DataFrame({'a': [1, 1], 'b': [2, 2]})))
expects_value_error(lambda: corr_ns['feature_correlation'](pd.DataFrame({'a': [1], 'b': [2]})))
print('PASS hard-level invalid-window, neighbor, duplicate-price and constant-correlation boundaries')
charts = sum(bool(q['chart']) for q in bank)
print(f'All {len(bank)} solutions match expected output; {charts} charts validated.')
