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
const nextModule = () => COURSE.find(module => module.id === lastLesson && !completed.has(module.id)) || COURSE.find(module => !completed.has(module.id)) || COURSE[0];
const lessonLink = module => `#lesson/${module.id}`;
function card(module, index) {
  const done = completed.has(module.id);
  return `<a class="module-card" href="${lessonLink(module)}"><div class="card-top"><span class="card-symbol" aria-hidden="true">${module.symbol}</span><small>MODULE ${String(index + 1).padStart(2,'0')}</small></div><h3>${module.title}</h3><p>${module.summary}</p><div class="card-bottom"><span>${done ? '✓ Completed' : module.stage + ' · Theory + lab'}</span><span class="arrow" aria-hidden="true">↗</span></div></a>`;
}
function stats() { return `<div class="stats" aria-label="Course duration"><div><span class="stat-number">90</span><span class="stat-label">Hours of<br>learning</span></div><div><span class="stat-number">44</span><span class="stat-label">Hours of<br>theory</span></div><div><span class="stat-number">40</span><span class="stat-label">Hours of<br>hands-on labs</span></div><div><span class="stat-number">6</span><span class="stat-label">Hours of<br>self-learning</span></div></div>`; }
function home() {
  const next = nextModule();
  main.innerHTML = `<section class="hero"><div><div class="eyebrow"><span class="dot"></span> PYTHON FOR REAL LIFE. AND WHAT’S NEXT.</div><h1>Big ideas start with<br><em>a little Python.</em></h1><p>From your first line of code to working with AI data. Learn one clear concept, one everyday example, and one small win at a time.</p><div class="actions"><a class="button" href="${lessonLink(completed.size ? next : COURSE[0])}">${completed.size ? 'Keep learning' : 'Start learning'} <span aria-hidden="true">→</span></a><a class="text-link" href="#curriculum">See the learning path ↗</a></div><div class="hero-small"><span>✓ Plain-language explanations</span><span>✓ Learn at your pace</span></div></div><img class="hero-art" src="assets/hero.svg" alt="An illustrated Python notebook turns everyday ideas into code, a chart, and a growing plant." width="520" height="390"></section>
  ${stats()}
  <section class="section"><div class="section-head"><div><h2>Your next small win</h2><p>No rush. Just pick up where you are.</p></div><span class="pill">${completed.size} of 14 modules complete</span></div>${completed.size === COURSE.length ? '<div class="success-banner"><h3>You’ve explored the whole path.</h3><p>Revisit a tricky lesson or combine your skills in a sales-analysis project.</p></div>' : ''}<div class="next-card"><div class="next-icon" aria-hidden="true">${next.symbol}</div><div><div class="eyebrow">${completed.size ? 'UP NEXT' : 'A GOOD PLACE TO BEGIN'} · MODULE ${String(COURSE.indexOf(next)+1).padStart(2,'0')}</div><h3>${next.title}</h3><p>${next.summary}</p></div><a class="button secondary" href="${lessonLink(next)}">Open lesson <span aria-hidden="true">→</span></a></div></section>
  <section class="section"><div class="section-head"><div><h2>A path from curious to capable</h2><p>Build the basics. Make things. Work with data.</p></div><span class="pill">14 practical modules</span></div><div class="module-grid">${[0,3,6,9,10,12].map(i=>card(COURSE[i],i)).join('')}</div><a class="all-link" href="#curriculum">Explore all 14 modules <span aria-hidden="true">→</span></a></section>
  <section class="section"><div class="approach"><div><span class="step-number">01</span><div><h3>See it in everyday life</h3><p>Start with a familiar problem and a simple visual.</p></div></div><div><span class="step-number">02</span><div><h3>Understand the code</h3><p>Read an example and predict what happens next.</p></div></div><div><span class="step-number">03</span><div><h3>Make it your own</h3><p>Practice in Python and check your understanding.</p></div></div></div></section>`
}
function curriculum() {
  main.innerHTML = `<div class="page-intro"><div class="eyebrow">A LITTLE PROGRESS, EVERY DAY</div><h1>Your Python learning path</h1><p>14 modules covering your full syllabus. Start at the beginning or revisit the topic you need. Every lesson includes theory, explained examples, topic questions and answers, a lab, and a quick check.</p></div>${stats()}<div class="tools"><input class="search" type="search" id="search" placeholder="Search lessons, e.g. loops, SQL, Pandas…" aria-label="Search lessons"><div class="filter-group" aria-label="Filter by course stage">${['All modules','Foundations','Build & debug','Data & AI'].map((stage,i)=>`<button class="filter ${i===0?'active':''}" data-stage="${stage}" aria-pressed="${i===0}">${stage}</button>`).join('')}</div></div><p class="catalog-note" id="result-count" role="status">14 modules · ${completed.size} completed</p><div class="module-grid" id="catalog"></div><p class="continue-note">${storageAvailable?'Your progress stays on this browser. You can mark any module complete after practicing.':'Browser storage is unavailable; progress is kept for this visit.'}</p>`;
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
function route(){
  const hash=location.hash.slice(1)||'home';
  document.querySelectorAll('[data-nav]').forEach(a=>{const active=hash===a.dataset.nav||(hash.startsWith('lesson/')&&a.dataset.nav==='curriculum');a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  if(hash.startsWith('lesson/'))lesson(hash.split('/')[1]);else if(hash==='curriculum')curriculum();else if(hash==='playground')playground();else if(hash==='resources')resources();else home();
  const title=hash.startsWith('lesson/')?COURSE.find(m=>m.id===hash.split('/')[1])?.title:({curriculum:'Learning path',playground:'Try an example',resources:'Books & resources',home:'Learn by doing'})[hash];
  document.title=(title||'Learn by doing')+' · Python Everyday';
  updateProgress();window.scrollTo(0,0);
}
window.addEventListener('hashchange',()=>{route();main.focus({preventScroll:true});});
route();
