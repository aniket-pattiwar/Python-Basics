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
        shutil.copyfile(source, root / 'dist' / 'assets' / ('coding-' + q['id'] + '.svg'))
    print('PASS', q['id'])

# Check the normalization boundary using a real constant feature column.
q = next(q for q in bank if q['id'] == 'mix-normalize')
ns = {'np': np}
with contextlib.redirect_stdout(io.StringIO()):
    exec(q['solution'].replace('[20, 30, 40]', '[20, 20, 20]'), ns)
np.testing.assert_array_equal(ns['scaled'][:, 0], [0, 0, 0])
np.testing.assert_allclose(ns['scaled'][:, 1], [0, .5, 1])
print('PASS constant-feature boundary')
print('All 21 solutions match expected output; 8 charts validated and copied to website assets.')
