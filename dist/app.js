const main = document.querySelector('main');
document.querySelector('.skip').addEventListener('click', event => {
  event.preventDefault(); main.focus(); main.scrollIntoView();
});
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let completed = new Set();
let lastLesson = 'basics';
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem('python-everyday-progress') || '[]');
  if (Array.isArray(saved)) completed = new Set(saved.filter(id => COURSE.some(module => module.id === id)));
  const last = localStorage.getItem('python-everyday-last');
  if (COURSE.some(module => module.id === last)) lastLesson = last;
} catch { storageAvailable = false; }
const notify = message => {
  const el = document.getElementById('toast');
  el.textContent = message; el.classList.add('visible');
  clearTimeout(notify.timer); notify.timer = setTimeout(() => el.classList.remove('visible'), 3500);
};
function saveProgress() {
  try { localStorage.setItem('python-everyday-progress', JSON.stringify([...completed])); }
  catch { storageAvailable = false; notify('Browser storage is unavailable. Progress lasts for this visit.'); }
  updateProgress();
}
function updateProgress() {
  document.getElementById('rail-count').textContent = `${completed.size} / 14`;
  document.getElementById('rail-bar').value = completed.size;
}
const lessonLink = module => `#lesson/${module.id}`;
const moduleNumber = index => String(index + 1).padStart(2, '0');
const coverDescriptions = {
  basics: 'A café cup and receipt show how a Python program calculates a bill.',
  strings: 'Letter tiles and a greeting card show how strings turn characters into messages.',
  dictionaries: 'A contact book connects names to phone numbers using key and value pairs.',
  lists: 'A shopping basket and numbered grocery list show an ordered collection.',
  functions: 'Ingredients pass through a reusable recipe to create a finished cup of tea.',
  tuples: 'A map pin and a fixed pair of coordinates represent a location tuple.',
  objects: 'One bicycle blueprint creates two bicycles with their own colors.',
  exceptions: 'Invalid input takes a recovery path while valid input continues safely.',
  libraries: 'A toolbox, magnifying glass, and log notebook represent libraries and debugging.',
  data: 'Raw values become an organized table ready for NumPy and Pandas analysis.',
  visualization: 'Bar, line, and pie charts show different ways to see patterns in data.',
  databases: 'A database stores structured records that can be added, read, updated, or deleted.',
  web: 'A browser sends a request to a Python web service and receives a response.',
  'web-data': 'Web pages become a structured dataset through careful data collection.'
};
function card(module, index) {
  const done = completed.has(module.id);
  return `<a class="module-card" href="${lessonLink(module)}"><div class="card-top"><span class="card-symbol card-number" aria-hidden="true">${moduleNumber(index)}</span><small>MODULE ${moduleNumber(index)}</small></div><img class="module-cover" src="assets/module-${module.id}.svg" alt="${escapeHTML(coverDescriptions[module.id])}" width="480" height="280" loading="lazy" decoding="async"><h3>${module.title}</h3><p>${module.summary}</p><div class="card-bottom"><span>${done ? '✓ Completed' : module.stage + ' · Theory + lab'}</span><span class="arrow" aria-hidden="true">↗</span></div></a>`;
}
function stats() { return `<div class="stats" aria-label="Course duration"><div><span class="stat-number">90</span><span class="stat-label">Hours of<br>learning</span></div><div><span class="stat-number">44</span><span class="stat-label">Hours of<br>theory</span></div><div><span class="stat-number">40</span><span class="stat-label">Hours of<br>hands-on labs</span></div><div><span class="stat-number">6</span><span class="stat-label">Hours of<br>self-learning</span></div></div>`; }
function curriculum() {
  main.innerHTML = `<div class="page-intro"><div class="eyebrow">A LITTLE PROGRESS, EVERY DAY</div><h1>14 modules</h1><p>14 modules covering your full syllabus. Start at the beginning or revisit the topic you need. Every lesson includes theory, explained examples, topic questions and answers, a lab, and a quick check.</p></div>${stats()}<div class="tools"><input class="search" type="search" id="search" placeholder="Search lessons, e.g. loops, SQL, Pandas…" aria-label="Search lessons"><div class="filter-group" aria-label="Filter by course stage">${['All modules','Foundations','Build & debug','Data & AI'].map((stage,i)=>`<button class="filter ${i===0?'active':''}" data-stage="${stage}" aria-pressed="${i===0}">${stage}</button>`).join('')}</div></div><p class="catalog-note" id="result-count" role="status">14 modules · ${completed.size} completed</p><div class="module-grid" id="catalog"></div><p class="continue-note">${storageAvailable?'Your progress stays on this browser. You can mark any module complete after practicing.':'Browser storage is unavailable; progress is kept for this visit.'}</p>`;
  let stage = 'All modules';
  const input = document.getElementById('search');
  function filter() {
    const term = input.value.trim().toLowerCase();
    const found = COURSE.filter(module => (stage === 'All modules' || module.stage === stage) && JSON.stringify(module).toLowerCase().includes(term));
    document.getElementById('catalog').innerHTML = found.map(module => card(module,COURSE.indexOf(module))).join('') || '<div class="empty"><h3>No matching lessons yet</h3><p>Try another word such as “strings”, “logging”, or “database”, or choose All modules.</p></div>';
    document.getElementById('result-count').textContent = `${found.length} ${found.length === 1?'module':'modules'} found · ${completed.size} completed overall`;
  }
  input.addEventListener('input',filter);
  document.querySelectorAll('[data-stage]').forEach(button => button.addEventListener('click',()=>{
    stage = button.dataset.stage;
    document.querySelectorAll('[data-stage]').forEach(b=>{ b.classList.toggle('active',b===button); b.setAttribute('aria-pressed',String(b===button)); }); filter();
  }));
  filter();
}
function example(ex, index) {
  return `<h3 class="example-title"><small>EXAMPLE ${index+1}</small> ${escapeHTML(ex.title)}</h3><div class="code-card"><div class="code-label"><span>PYTHON 3 ${index===0?'· READ → PREDICT → TRY':''}</span><button class="copy" data-copy="${index}" aria-label="Copy ${escapeHTML(ex.title)} code">Copy code</button></div><pre><code>${escapeHTML(ex.code)}</code></pre><button class="output-toggle" data-output="${index}" aria-expanded="false" aria-controls="output-${index}">Reveal expected result ↓</button></div><div class="output" id="output-${index}" hidden>${escapeHTML(ex.output)}</div><p class="explain">${escapeHTML(ex.explain)}</p>`;
}
function qaSection(module) {
  const count = module.qa.reduce((total, group) => total + group.items.length, 0);
  return `<section class="lesson-section qa-section" id="qa"><div class="qa-heading"><h2>Questions & answers</h2><span class="pill">${count} questions</span></div><p class="qa-intro">Open a topic, try answering in your own words, then reveal the answer.</p><button class="button secondary qa-expand" type="button" id="qa-expand">Show all answers</button><div class="qa-groups">${module.qa.map(group => `<details class="qa-topic"><summary><span>${escapeHTML(group.topic)}</span><small>${group.items.length} ${group.items.length === 1 ? 'question' : 'questions'}</small></summary><div class="qa-questions">${group.items.map(item => `<details class="qa-item"><summary>${escapeHTML(item.question)}</summary><div class="qa-answer"><p>${escapeHTML(item.answer)}</p>${item.code ? `<pre><code>${escapeHTML(item.code)}</code></pre>` : ''}</div></details>`).join('')}</div></details>`).join('')}</div></section>`;
}
function lesson(id) {
  const module = COURSE.find(m=>m.id===id);
  if (!module) { main.innerHTML='<div class="empty"><h1>Lesson not found</h1><p>Choose a module from the learning path.</p><a class="button" href="#curriculum">Open learning path</a></div>';return; }
  const i=COURSE.indexOf(module);
  lastLesson=id;
  try { localStorage.setItem('python-everyday-last',id); } catch { storageAvailable=false; }
  main.innerHTML = `<div class="breadcrumbs"><a href="#curriculum">Learning path</a><span aria-hidden="true">/</span>${module.stage}<span aria-hidden="true">/</span>Module ${String(i+1).padStart(2,'0')}</div><div class="page-intro"><div class="eyebrow">MODULE ${String(i+1).padStart(2,'0')} · ${module.stage.toUpperCase()}</div><h1>${module.title}</h1><p>${module.summary}</p><a class="qa-jump" href="#qa" data-anchor="qa">Review topic questions & answers</a></div><div class="lesson-layout"><article><div class="analogy"><div><div class="eyebrow">FIRST, PICTURE THIS</div><p>${escapeHTML(module.analogy)}</p></div><img src="assets/${module.image}.svg" width="240" height="200" alt="${({flow:'Input values travel through instructions to produce an output',collection:'Labeled containers group values in an ordered collection',object:'A class blueprint creates separate objects with their own attributes',data:'Raw data is arranged into a labeled table for analysis',chart:'A bar chart compares illustrative product sales',web:'A client sends a request to a Python service and receives a response'})[module.image]}"></div><section class="lesson-section" id="concepts"><h2>The ideas, made simple</h2><div class="concepts">${module.concepts.map((c,j)=>`<details ${j===0?'open':''}><summary>${escapeHTML(c[0])}</summary><p>${escapeHTML(c[1])}</p></details>`).join('')}</div></section><section class="lesson-section" id="examples"><h2>Python in the real world</h2><p class="legend-note">These are teaching examples. Reveal shows a prepared expected result; this website does not execute Python. Copy the code into your Python environment to run or change it.</p>${module.examples.map(example).join('')}</section><section class="lesson-section" id="lab"><h2>Your turn to build</h2><div class="lab"><div class="eyebrow">HANDS-ON LAB · USE YOUR PYTHON EDITOR</div><h3>${module.lab.title}</h3><ol>${module.lab.steps.map(step=>`<li>${escapeHTML(step)}</li>`).join('')}</ol><details class="hint"><summary>Need a starting hint?</summary><p>${escapeHTML(module.lab.hint)}</p></details></div></section>${module.self?`<section class="lesson-section self-study" id="self-study"><div class="eyebrow">SELF-LEARNING · PART OF THE 6-HOUR COURSE ALLOCATION</div><h2>Explore a little further</h2><ul>${module.self.map(step=>`<li>${escapeHTML(step)}</li>`).join('')}</ul><p>Save a short note with your code: what you tried, what changed, and what you concluded.</p></section>`:''}<section class="lesson-section" id="check"><h2>A quick understanding check</h2><form class="quiz" id="quiz"><fieldset><legend>${escapeHTML(module.quiz.q)}</legend>${module.quiz.options.map((option,j)=>`<label class="quiz-option"><input type="radio" name="answer" value="${j}" required><span>${escapeHTML(option)}</span></label>`).join('')}</fieldset><button class="button" type="submit">Check my answer</button><div id="feedback" aria-live="polite"></div></form></section>${qaSection(module)}<p class="legend-note">Go deeper: <a href="${module.source}" target="_blank" rel="noopener">Official documentation ↗</a></p><div class="lesson-end"><button class="button" id="complete">${completed.has(id)?'✓ Completed · undo':'Mark module complete ✓'}</button>${i<COURSE.length-1?`<a class="button secondary" href="${lessonLink(COURSE[i+1])}">Next module →</a>`:'<a class="button secondary" href="#curriculum">Back to learning path →</a>'}</div>${i>0?`<p class="continue-note"><a href="${lessonLink(COURSE[i-1])}">← Previous: ${COURSE[i-1].title}</a></p>`:''}</article><aside class="lesson-aside"><strong>In this lesson</strong><a href="#concepts" data-anchor="concepts">01 · The ideas</a><a href="#examples" data-anchor="examples">02 · Real-world examples</a><a href="#lab" data-anchor="lab">03 · Practice lab</a>${module.self?'<a href="#self-study" data-anchor="self-study">04 · Self-learning</a>':''}<a href="#check" data-anchor="check">${module.self?'05':'04'} · Quick check</a><a href="#qa" data-anchor="qa">${module.self?"06":"05"} · Questions & answers</a><p>Read. Predict. Practice.<br>It’s okay to try more than once.</p></aside></div>`;
  document.querySelectorAll('[data-anchor]').forEach(a=>a.addEventListener('click',event=>{event.preventDefault();document.getElementById(a.dataset.anchor).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
  document.getElementById('qa-expand').addEventListener('click', event => {
    const open = event.currentTarget.textContent === 'Show all answers';
    document.querySelectorAll('#qa details').forEach(detail => { detail.open = open; });
    event.currentTarget.textContent = open ? 'Hide all answers' : 'Show all answers';
  });
  document.querySelectorAll('[data-output]').forEach(button=>button.addEventListener('click',()=>{
    const output=document.getElementById('output-'+button.dataset.output); output.hidden=!output.hidden;
    button.setAttribute('aria-expanded',String(!output.hidden));button.textContent=output.hidden?'Reveal expected result ↓':'Hide expected result ↑';
  }));
  document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
    try { await navigator.clipboard.writeText(module.examples[Number(button.dataset.copy)].code); notify('Code copied. Paste it into your Python editor.'); }
    catch { notify('Copy unavailable here. Select the code and copy it manually.'); }
  }));
  document.getElementById('quiz').addEventListener('submit',event=>{
    event.preventDefault(); const choice=new FormData(event.currentTarget).get('answer'); if(choice===null)return;
    const correct=Number(choice)===module.quiz.answer;
    const feedback=document.getElementById('feedback');feedback.className='feedback'+(correct?'':' wrong');
    feedback.textContent=(correct?'That’s right. ':'Try again. ')+module.quiz.why;
  });
  document.getElementById('complete').addEventListener('click',event=>{
    if(completed.has(id)){completed.delete(id);notify('Module marked as still in progress.');}else{completed.add(id);notify('Another small win! Module marked complete.');}
    saveProgress();event.currentTarget.textContent=completed.has(id)?'✓ Completed · undo':'Mark module complete ✓';
  });
}
function playground() {
  main.innerHTML=`<div class="page-intro"><div class="eyebrow">MAKE THE IDEA CLICK</div><h1>A little code. A real receipt.</h1><p>Change the price and quantity to see variables, arithmetic, and an if condition in action. A ₹20 discount applies when the subtotal reaches ₹200.</p></div><div class="play-layout"><section class="bill-controls"><h3>You’re running a tiny café</h3><label for="price">Price per cup (₹)</label><input id="price" type="number" min="0" max="100000" step="0.01" value="80" inputmode="decimal"><label for="quantity">Number of cups</label><input id="quantity" type="number" min="0" max="1000" step="1" value="3" inputmode="numeric"><p class="legend-note" style="margin-top:18px">Try 1 cup, then 3 cups. Watch the condition change. Use a whole number of cups and a nonnegative price.</p><div id="bill-error" role="status"></div></section><section class="receipt" aria-live="polite"><div class="eyebrow">YOUR CAFÉ RECEIPT</div><h2>Something good is brewing.</h2><div class="receipt-row"><span>Subtotal</span><strong id="subtotal">₹240.00</strong></div><div class="receipt-row"><span>Discount</span><strong id="discount">− ₹20.00</strong></div><div class="receipt-row total"><span>Total</span><span id="total">₹220.00</span></div><p id="condition">240 >= 200 → True. The discount applies.</p></section></div><section class="section"><h2>Here’s the Python behind it</h2><div class="code-card"><div class="code-label">PYTHON 3 · GENERATED FROM YOUR INPUTS</div><pre><code id="bill-code"></code></pre></div><p class="explain">The receipt is an interactive JavaScript demonstration of the same calculation. The Python above is for you to copy and run in your own editor.</p><a class="button secondary" href="#lesson/basics">Learn variables & conditions →</a></section>`;
  const price=document.getElementById('price'),quantity=document.getElementById('quantity');
  const money=value=>'₹'+value.toFixed(2);
  function calculate(){
    const p=Number(price.value),q=Number(quantity.value),valid=price.value!==''&&quantity.value!==''&&price.validity.valid&&quantity.validity.valid&&Number.isFinite(p)&&Number.isInteger(q);
    document.getElementById('bill-error').textContent=valid?'':'Enter a price from 0 to 100,000 and a whole quantity from 0 to 1,000.';
    if(!valid){['subtotal','discount','total'].forEach(id=>document.getElementById(id).textContent='—');document.getElementById('condition').textContent='Waiting for valid values.';document.getElementById('bill-code').textContent='# Enter valid price and quantity values above.';return;}
    const subtotal=p*q,discount=subtotal>=200?20:0;
    document.getElementById('subtotal').textContent=money(subtotal);document.getElementById('discount').textContent='− '+money(discount);document.getElementById('total').textContent=money(subtotal-discount);
    document.getElementById('condition').textContent=`${subtotal.toFixed(2)} >= 200 → ${discount?'True. The discount applies.':'False. No discount this time.'}`;
    document.getElementById('bill-code').textContent=`price = ${p}\ncups = ${q}\nsubtotal = price * cups\ndiscount = 0\n\nif subtotal >= 200:\n    discount = 20\n\ntotal = subtotal - discount\nprint(f"Pay ₹{total:.2f}")`;
  }price.addEventListener('input',calculate);quantity.addEventListener('input',calculate);calculate();
}
function resources(){
  const books=[['Data Wrangling with Python','Jacqueline Kazil & Katharine Jarmul'],['Introduction to Computer Science Using Python','Charles · Wiley (as listed in the syllabus)'],['Learn Python the Hard Way','Zed A. Shaw · Pearson · 2018'],['Python Crash Course','A Hands-On, Project-Based Introduction to Programming'],['Python Cookbook','David Beazley & Brian K. Jones · O’Reilly / Shroff'],['Head First Python','Paul Barry · O’Reilly / Shroff'],['Beginning Programming with Python For Dummies','John Paul Mueller · Wiley']];
  main.innerHTML=`<div class="page-intro"><div class="eyebrow">A GOOD BOOK. A USEFUL REFERENCE.</div><h1>Keep a little help nearby.</h1><p>Your supplied course reading list, plus official documentation for going deeper. The website’s notes and examples are original learning aids; they do not reproduce these books.</p></div><div class="resource-grid"><section class="resource"><div class="eyebrow">PRIMARY COURSEWARE</div><h2>Python for Everybody</h2><p><strong>Exploring Data in Python 3</strong><br>Charles R. Severance<br>Shroff Publishers & Distributors</p><a class="button secondary" href="https://www.py4e.com/book" target="_blank" rel="noopener">Author’s book page ↗</a><p class="legend-note" style="margin-top:18px">Read a little, type the examples, then change one thing. Understanding grows through experiments.</p></section><section class="resource"><div class="eyebrow">OFFICIAL DOCUMENTATION</div><h3>Go to the source</h3><div class="resource-links"><a href="https://www.python.org/downloads/" target="_blank" rel="noopener">Install Python ↗</a><a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener">Python tutorial ↗</a><a href="https://numpy.org/doc/stable/user/absolute_beginners.html" target="_blank" rel="noopener">NumPy beginner’s guide ↗</a><a href="https://pandas.pydata.org/docs/getting_started/" target="_blank" rel="noopener">Pandas getting started ↗</a><a href="https://docs.scipy.org/doc/scipy/tutorial/" target="_blank" rel="noopener">SciPy tutorials ↗</a><a href="https://matplotlib.org/stable/tutorials/index.html" target="_blank" rel="noopener">Matplotlib tutorials ↗</a><a href="https://seaborn.pydata.org/tutorial.html" target="_blank" rel="noopener">Seaborn tutorial ↗</a><a href="https://plotly.com/python/" target="_blank" rel="noopener">Plotly for Python ↗</a><a href="https://plotnine.org/" target="_blank" rel="noopener">plotnine: ggplot-style graphics ↗</a><a href="https://flask.palletsprojects.com/en/stable/quickstart/" target="_blank" rel="noopener">Flask quickstart ↗</a><a href="https://docs.djangoproject.com/en/stable/intro/" target="_blank" rel="noopener">Django introduction ↗</a><a href="https://requests.readthedocs.io/en/latest/user/quickstart/" target="_blank" rel="noopener">Requests quickstart ↗</a><a href="https://docs.scrapy.org/en/latest/intro/tutorial.html" target="_blank" rel="noopener">Scrapy tutorial ↗</a></div></section><section class="resource" style="grid-column:1/-1"><div class="eyebrow">REFERENCE BOOKS · FROM YOUR SYLLABUS</div><ul class="book-list">${books.map(book=>`<li><strong>${book[0]}</strong><span>${book[1]}</span></li>`).join('')}</ul></section></div><section class="course-info"><p><strong>A manageable practice routine</strong></p><p>Read one concept. Predict an example’s result before revealing it. Type the code yourself, change the inputs, and explain what happened. Save each lab in a clearly named folder.</p><p>For the six self-learning hours, use the prompts in modules 10–14. Keep notes on data sources, experiment timing, chart choices, database integrity, web services, and responsible collection.</p></section>`;
}
const mcqAnswers = new Map();
let mcqStorageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem('python-everyday-mcq-v1') || '{}');
  if(saved && typeof saved === 'object' && !Array.isArray(saved)) {
    for(const [id,answer] of Object.entries(saved)) {
      const question=MCQ_BANK.find(q=>q.id===id);
      if(question && Number.isInteger(answer) && answer>=0 && answer<question.options.length) mcqAnswers.set(id,answer);
    }
  }
} catch { mcqStorageAvailable=false; }
const mcqView={group:'syllabus',topic:'All topics',position:0};
function mcqPractice(){
  const groups=[['syllabus','Full syllabus · 50'],['specialist','NumPy, Pandas & Matplotlib · 50'],['all','All questions · 100']];
  main.innerHTML=`<div class="page-intro"><div class="eyebrow">THINK IT THROUGH. THEN CHECK.</div><h1>100 unique MCQs</h1><p>50 questions across all 14 course modules, plus 50 focused on NumPy, Pandas and Matplotlib. Choose an answer, check the explanation, and build your confidence one question at a time.</p></div><div class="mcq-sets" role="group" aria-label="Choose a question set">${groups.map(([value,label])=>`<button class="filter ${value===mcqView.group?'active':''}" data-mcq-group="${value}" aria-pressed="${value===mcqView.group}">${label}</button>`).join('')}</div><div class="mcq-tools"><label>Topic<select id="mcq-topic"></select></label><label>Jump to question<select id="mcq-jump"></select></label></div><div id="mcq-score" class="mcq-score" role="status"></div><div id="mcq-question"></div><p class="continue-note" id="mcq-storage"></p><details class="mcq-references"><summary>Go deeper with official documentation</summary><p><a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener">Python tutorial ↗</a> · <a href="https://numpy.org/doc/stable/user/absolute_beginners.html" target="_blank" rel="noopener">NumPy ↗</a> · <a href="https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html" target="_blank" rel="noopener">Pandas ↗</a> · <a href="https://matplotlib.org/stable/users/explain/quick_start.html" target="_blank" rel="noopener">Matplotlib ↗</a></p></details>`;
  let filtered=[];
  const topicSelect=document.getElementById('mcq-topic');
  const jumpSelect=document.getElementById('mcq-jump');
  const panel=document.getElementById('mcq-question');
  function persist(){
    try{localStorage.setItem('python-everyday-mcq-v1',JSON.stringify(Object.fromEntries(mcqAnswers)));}
    catch{mcqStorageAvailable=false;}
  }
  function updateSet(){
    const pool=MCQ_BANK.filter(q=>mcqView.group==='all'||q.group===mcqView.group);
    const topics=['All topics',...new Set(pool.map(q=>q.topic))];
    if(!topics.includes(mcqView.topic))mcqView.topic='All topics';
    topicSelect.innerHTML=topics.map(topic=>`<option ${topic===mcqView.topic?'selected':''}>${escapeHTML(topic)}</option>`).join('');
    filtered=pool.filter(q=>mcqView.topic==='All topics'||q.topic===mcqView.topic);
    mcqView.position=Math.min(mcqView.position,filtered.length-1);
    jumpSelect.innerHTML=filtered.map((q,index)=>`<option value="${index}">${index+1} · ${escapeHTML(q.topic)}</option>`).join('');
    renderQuestion();
  }
  function renderQuestion(focus=false){
    const q=filtered[mcqView.position];
    const answered=mcqAnswers.has(q.id);
    const chosen=mcqAnswers.get(q.id);
    const correct=answered&&chosen===q.answer;
    const attempted=filtered.filter(item=>mcqAnswers.has(item.id)).length;
    const points=filtered.filter(item=>mcqAnswers.has(item.id)&&mcqAnswers.get(item.id)===item.answer).length;
    jumpSelect.value=String(mcqView.position);
    document.getElementById('mcq-score').innerHTML=`<span><strong>${attempted} / ${filtered.length}</strong> answered in this selection</span><span><strong>${points} / ${attempted}</strong> correct</span><progress max="${filtered.length}" value="${attempted}" aria-label="Questions answered in this selection"></progress>${attempted===filtered.length?'<span class="mcq-finished">Selection complete. Revisit any answer or choose another set.</span>':''}`;
    document.getElementById('mcq-storage').textContent=mcqStorageAvailable?'Checked answers are saved on this browser. Each question counts once; Try again replaces its previous result.':'Browser storage is unavailable. Checked answers last for this visit.';
    panel.innerHTML=`<section class="mcq-card"><div class="mcq-meta"><span class="eyebrow">QUESTION ${mcqView.position+1} OF ${filtered.length}</span><span class="pill">${escapeHTML(q.topic)}</span></div><form id="mcq-form"><fieldset><legend id="mcq-heading" tabindex="-1">${escapeHTML(q.question)}</legend><div class="mcq-options">${q.options.map((option,index)=>`<label class="quiz-option mcq-option ${answered&&index===q.answer?'mcq-correct':''} ${answered&&index===chosen&&index!==q.answer?'mcq-wrong':''}"><input type="radio" name="mcq-answer" value="${index}" ${answered?'disabled':''} ${chosen===index?'checked':''} required><span><b>${String.fromCharCode(65+index)}.</b> ${escapeHTML(option)}${answered&&index===q.answer?'<small>Correct answer</small>':''}${answered&&index===chosen&&index!==q.answer?'<small>Your answer</small>':''}</span></label>`).join('')}</div></fieldset>${answered?'<button class="button secondary" type="button" id="mcq-retry">Try again</button>':'<button class="button" type="submit">Check answer</button>'}<div id="mcq-feedback" aria-live="polite" tabindex="-1">${answered?`<div class="feedback ${correct?'':'wrong'}"><strong>${correct?'Correct!':'Not quite.'}</strong> ${correct?'':`The correct answer is ${String.fromCharCode(65+q.answer)}: ${escapeHTML(q.options[q.answer])}. `}<p>${escapeHTML(q.explanation)}</p></div>`:''}</div></form><div class="mcq-navigation"><button class="button secondary" id="mcq-prev" ${mcqView.position===0?'disabled':''}>← Previous</button><span>${mcqView.position+1} / ${filtered.length}</span><button class="button secondary" id="mcq-next" ${mcqView.position===filtered.length-1?'disabled':''}>Next →</button></div></section>`;
    document.getElementById('mcq-form').addEventListener('submit',event=>{
      event.preventDefault();
      const selection=new FormData(event.currentTarget).get('mcq-answer');
      if(selection===null)return;
      mcqAnswers.set(q.id,Number(selection));persist();renderQuestion();
      document.getElementById('mcq-feedback').focus({preventScroll:true});
    });
    document.getElementById('mcq-retry')?.addEventListener('click',()=>{
      mcqAnswers.delete(q.id);persist();renderQuestion(true);
    });
    document.getElementById('mcq-prev').addEventListener('click',()=>{mcqView.position--;renderQuestion(true);});
    document.getElementById('mcq-next').addEventListener('click',()=>{mcqView.position++;renderQuestion(true);});
    if(focus)document.getElementById('mcq-heading').focus({preventScroll:true});
  }
  document.querySelectorAll('[data-mcq-group]').forEach(button=>button.addEventListener('click',()=>{
    mcqView.group=button.dataset.mcqGroup;mcqView.topic='All topics';mcqView.position=0;
    document.querySelectorAll('[data-mcq-group]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    updateSet();
  }));
  topicSelect.addEventListener('change',()=>{mcqView.topic=topicSelect.value;mcqView.position=0;updateSet();});
  jumpSelect.addEventListener('change',()=>{mcqView.position=Number(jumpSelect.value);renderQuestion(true);});
  updateSet();
}
let codingStorageAvailable=true;
const codingCompleted=new Set();
try{
  const saved=JSON.parse(localStorage.getItem('python-everyday-coding-v1')||'[]');
  if(Array.isArray(saved))saved.filter(id=>CODING_BANK.some(q=>q.id===id)).forEach(id=>codingCompleted.add(id));
}catch{codingStorageAvailable=false;}
const codingView={topic:'All topics',level:'All levels',term:''};
function codingPractice(){
  const topics=['All topics',...new Set(CODING_BANK.map(q=>q.topic))];
  main.innerHTML=`<div class="page-intro"><div class="eyebrow">SMALL PROBLEMS. REAL PYTHON.</div><h1>21 coding challenges</h1><p>5 each for NumPy, Pandas and Matplotlib, plus 3 NumPy + Pandas and 3 using all three libraries. Start easy, work up to medium, and turn familiar data into useful results.</p></div><details class="coding-setup"><summary>How to practice in your Python editor</summary><ol><li>Use Python 3 and install the libraries once: <code>python -m pip install numpy pandas matplotlib</code>.</li><li>Copy the starter code into a new file, add your solution, and run it in your Python editor or notebook.</li><li>Compare your result with the expected output. For plotting exercises, open the saved SVG file.</li><li>Use a hint if needed, then reveal the solution after your attempt.</li></ol><p>These exercises run in your Python environment. Marking one practiced is your own checklist, not an automatic code grade.</p></details><div class="coding-filters" role="group" aria-label="Filter coding topics">${topics.map(topic=>`<button class="filter ${topic===codingView.topic?'active':''}" data-coding-topic="${escapeHTML(topic)}" aria-pressed="${topic===codingView.topic}">${escapeHTML(topic)}</button>`).join('')}</div><div class="coding-tools"><label for="coding-level">Difficulty</label><select id="coding-level">${['All levels','Easy','Medium'].map(level=>`<option ${level===codingView.level?'selected':''}>${level}</option>`).join('')}</select><input class="search" id="coding-search" type="search" aria-label="Search coding challenges" placeholder="Search, e.g. missing values, sales, charts…" value="${escapeHTML(codingView.term)}"></div><p class="catalog-note" id="coding-count" role="status"></p><div class="coding-list" id="coding-list"></div><p class="continue-note" id="coding-storage"></p><p class="coding-docs">Keep the official guides nearby: <a href="https://numpy.org/doc/stable/user/absolute_beginners.html" target="_blank" rel="noopener">NumPy ↗</a> · <a href="https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html" target="_blank" rel="noopener">Pandas ↗</a> · <a href="https://matplotlib.org/stable/users/explain/quick_start.html" target="_blank" rel="noopener">Matplotlib ↗</a></p>`;
  function updateCount(found){
    document.getElementById('coding-count').textContent=`${found.length} ${found.length===1?'challenge':'challenges'} found · ${codingCompleted.size} / ${CODING_BANK.length} practiced overall`;
    document.getElementById('coding-storage').textContent=codingStorageAvailable?'Your practice checklist stays on this browser. You can unmark any exercise to revisit it.':'Browser storage is unavailable. Your checklist lasts for this visit.';
  }
  function codeBlock(q,part,label){
    return `<div class="code-card coding-code"><div class="code-label"><span>${label}</span><button class="copy" data-coding-copy="${q.id}" data-part="${part}" aria-label="Copy ${part} for ${escapeHTML(q.title)}">Copy code</button></div><pre><code>${escapeHTML(q[part])}</code></pre></div>`;
  }
  function filter(){
    const term=codingView.term.trim().toLowerCase();
    const found=CODING_BANK.filter(q=>(codingView.topic==='All topics'||q.topic===codingView.topic)&&(codingView.level==='All levels'||q.level===codingView.level)&&[q.title,q.prompt,q.topic,q.hint].join(' ').toLowerCase().includes(term));
    updateCount(found);
    document.getElementById('coding-list').innerHTML=found.map(q=>`<details class="coding-exercise"><summary><span class="coding-number" aria-hidden="true">${moduleNumber(CODING_BANK.indexOf(q))}</span><span class="coding-summary"><strong>${escapeHTML(q.title)}</strong><small>${escapeHTML(q.topic)} · ${q.level}</small></span><span class="coding-status" data-coding-status="${q.id}">${codingCompleted.has(q.id)?'✓ Practiced':'Open challenge'}</span></summary><div class="coding-body"><h2>Your task</h2><p>${escapeHTML(q.prompt)}</p><h3>Sample data & starter code</h3>${codeBlock(q,'starter','PYTHON 3 · START HERE')}<h3>Expected result</h3><pre class="coding-output">${escapeHTML(q.output)}</pre>${q.chart?`<p class="legend-note">${escapeHTML(q.chart.description)}</p><img class="coding-chart" src="assets/coding-${q.id}.svg" alt="${escapeHTML(q.chart.description)}" width="600" height="350" loading="lazy" decoding="async">`:''}<details class="hint coding-hint"><summary>Show a hint</summary><p>${escapeHTML(q.hint)}</p></details><details class="coding-solution"><summary>Reveal solution after your attempt</summary>${codeBlock(q,'solution','PYTHON 3 · ONE POSSIBLE SOLUTION')}</details><button class="button secondary coding-complete" data-coding-complete="${q.id}" aria-pressed="${codingCompleted.has(q.id)}">${codingCompleted.has(q.id)?'✓ Practiced · undo':'Mark as practiced ✓'}</button></div></details>`).join('')||'<div class="empty"><h3>No matching challenges</h3><p>Choose All topics and All levels, or try a different search word.</p></div>';
    document.querySelectorAll('[data-coding-copy]').forEach(button=>button.addEventListener('click',async()=>{
      const q=CODING_BANK.find(item=>item.id===button.dataset.codingCopy);
      try{await navigator.clipboard.writeText(q[button.dataset.part]);notify('Code copied. Paste it into your Python editor.');}
      catch{notify('Copy unavailable here. Select the code and copy it manually.');}
    }));
    document.querySelectorAll('[data-coding-complete]').forEach(button=>button.addEventListener('click',()=>{
      const id=button.dataset.codingComplete;
      if(codingCompleted.has(id))codingCompleted.delete(id);else codingCompleted.add(id);
      try{localStorage.setItem('python-everyday-coding-v1',JSON.stringify([...codingCompleted]));}
      catch{codingStorageAvailable=false;}
      const done=codingCompleted.has(id);
      button.textContent=done?'✓ Practiced · undo':'Mark as practiced ✓';
      button.setAttribute('aria-pressed',String(done));
      document.querySelector(`[data-coding-status="${id}"]`).textContent=done?'✓ Practiced':'Open challenge';
      updateCount(found);
    }));
  }
  document.querySelectorAll('[data-coding-topic]').forEach(button=>button.addEventListener('click',()=>{
    codingView.topic=button.dataset.codingTopic;
    document.querySelectorAll('[data-coding-topic]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    filter();
  }));
  document.getElementById('coding-level').addEventListener('change',event=>{codingView.level=event.target.value;filter();});
  document.getElementById('coding-search').addEventListener('input',event=>{codingView.term=event.target.value;filter();});
  filter();
}
function route(){
  const requested=location.hash.slice(1);
  const hash=requested.startsWith('lesson/')||['curriculum','mcq','coding','playground','resources'].includes(requested)?requested:'curriculum';
  document.querySelectorAll('[data-nav]').forEach(a=>{const active=hash===a.dataset.nav||(hash.startsWith('lesson/')&&a.dataset.nav==='curriculum');a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  if(hash.startsWith('lesson/'))lesson(hash.split('/')[1]);else if(hash==='mcq')mcqPractice();else if(hash==='coding')codingPractice();else if(hash==='playground')playground();else if(hash==='resources')resources();else curriculum();
  const title=hash.startsWith('lesson/')?COURSE.find(m=>m.id===hash.split('/')[1])?.title:({curriculum:'Learning path',mcq:'MCQ Practice',coding:'Coding Practice',playground:'Try an example',resources:'Books & resources'})[hash];
  document.title=(title||'Learn by doing')+' · Python Everyday';
  updateProgress();window.scrollTo(0,0);
}
window.addEventListener('hashchange',()=>{route();main.focus({preventScroll:true});});
route();
