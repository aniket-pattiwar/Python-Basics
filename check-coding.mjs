import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
const bank=runInNewContext(readFileSync('dist/coding-bank.js','utf8')+'; CODING_BANK');
assert.equal(bank.length,21);
assert.equal(new Set(bank.map(q=>q.id)).size,21);
assert.equal(new Set(bank.map(q=>q.title)).size,21);
for(const [topic,count] of [['NumPy',5],['Pandas',5],['Matplotlib',5],['NumPy + Pandas',3],['NumPy + Pandas + Matplotlib',3]]){
  assert.equal(bank.filter(q=>q.topic===topic).length,count,topic);
  assert.ok(bank.some(q=>q.topic===topic&&q.level==='Easy'),`${topic} needs an easy exercise`);
  assert.ok(bank.some(q=>q.topic===topic&&q.level==='Medium'),`${topic} needs a medium exercise`);
}
for(const q of bank){
  for(const field of ['prompt','input','starter','solution','output','hint','checks'])assert.ok(q[field].trim(),`${q.id} is missing ${field}`);
  assert.ok(['Easy','Medium'].includes(q.level));
}
writeFileSync('coding-verification.json',JSON.stringify(bank));
console.log('21 unique coding challenges verified: 5 each library and 3 each mixed group.');
