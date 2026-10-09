import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
const bank=runInNewContext(readFileSync('dist/coding-bank.js','utf8')+'; CODING_BANK');
assert.equal(bank.length,31);
assert.equal(new Set(bank.map(q=>q.id)).size,31);
assert.equal(new Set(bank.map(q=>q.title)).size,31);
for(const [topic,count] of [['NumPy',7],['Pandas',7],['Matplotlib',7],['NumPy + Pandas',5],['NumPy + Pandas + Matplotlib',5]]){
  assert.equal(bank.filter(q=>q.topic===topic).length,count,topic);
  assert.ok(bank.some(q=>q.topic===topic&&q.level==='Easy'),`${topic} needs an easy exercise`);
  assert.ok(bank.some(q=>q.topic===topic&&q.level==='Medium'),`${topic} needs a medium exercise`);
  assert.equal(bank.filter(q=>q.topic===topic&&q.level==='Hard').length,2,`${topic} needs two hard exercises`);
}
for(const q of bank){
  for(const field of ['prompt','input','starter','solution','output','hint','checks'])assert.ok(q[field].trim(),`${q.id} is missing ${field}`);
  assert.ok(['Easy','Medium','Hard'].includes(q.level));
}
writeFileSync('coding-verification.json',JSON.stringify(bank));
console.log('31 unique coding challenges verified, including 10 hard exercises across all five topic groups.');
