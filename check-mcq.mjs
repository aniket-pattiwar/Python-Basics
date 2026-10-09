import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';

const bank=runInNewContext(readFileSync('dist/mcq-bank.js','utf8')+'; MCQ_BANK');
assert.equal(bank.length,100,'Exactly 100 questions are required');
assert.equal(new Set(bank.map(q=>q.id)).size,100,'Question IDs must be unique');
assert.equal(new Set(bank.map(q=>q.question.trim().toLowerCase())).size,100,'Questions must be unique');
for(const q of bank){
  assert.equal(q.options.length,4,`${q.id}: four options required`);
  assert.equal(new Set(q.options).size,4,`${q.id}: duplicate options`);
  assert.ok(q.question.trim()&&q.explanation.trim()&&q.topic.trim(),`${q.id}: incomplete question`);
  assert.ok(q.options.every(option=>typeof option==='string'&&option.trim()),`${q.id}: empty option`);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,`${q.id}: invalid answer`);
  assert.ok(['syllabus','specialist'].includes(q.group),`${q.id}: invalid set`);
}
const syllabus=bank.filter(q=>q.group==='syllabus');
assert.equal(syllabus.length,50);
for(const topic of ['Python basics','Strings','Dictionaries','Lists','Functions & regex','Tuples','Objects & classes','Exceptions','Libraries & debugging','Data & AI','Visualization','Databases','Web frameworks','Web data']){
  assert.ok(syllabus.some(q=>q.topic===topic),`Missing syllabus topic: ${topic}`);
}
const specialist=bank.filter(q=>q.group==='specialist');
assert.equal(specialist.length,50);
for(const [topic,count] of [['NumPy',18],['Pandas',18],['Matplotlib',14]]){
  assert.equal(specialist.filter(q=>q.topic===topic).length,count,`${topic}: incorrect question count`);
}
const regex=bank.find(q=>q.question.includes('re.fullmatch()'));
assert.equal(regex.options[regex.answer],'r"\\d{4}"','Preserve the regex backslash in JavaScript strings');
console.log('Verified 100 unique MCQs: 50 across all 14 modules + 18 NumPy + 18 Pandas + 14 Matplotlib.');
