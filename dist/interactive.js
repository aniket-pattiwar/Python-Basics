/* Small, offline-friendly learning activities. No external runtime is downloaded. */
const learningStore = {
  read(key, fallback) { try { return JSON.parse(localStorage.getItem('pe-'+key)) ?? fallback; } catch { return fallback; } },
  write(key, value) { try { localStorage.setItem('pe-'+key,JSON.stringify(value)); return true; } catch { return false; } }
};
const savedWins=learningStore.read('wins',[]);
const practiceWins = new Set(Array.isArray(savedWins)?savedWins.filter(id=>typeof id==='string'):[]);
function learningWin(id) {
  const fresh=!practiceWins.has(id); practiceWins.add(id);learningStore.write('wins',[...practiceWins]);
  if(fresh)notify('Nice work! Another learning win unlocked.');
}
function mixQuestions(items) {
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
function activityCard(title, text, link, label) {
  return `<div class="activity-card"><h3>${title}</h3><p>${text}</p><a class="button secondary" href="${link}">${label} →</a></div>`;
}
function enhanceLearning(hash) {
  if(!document.querySelector('[data-nav="datalab"]')) {
    document.querySelector('nav').insertAdjacentHTML('beforeend','<a href="#datalab" data-nav="datalab"><span aria-hidden="true">◫</span> Data Playground</a>');
  }
  if(hash==='curriculum') {
    const next=COURSE.find(m=>!completed.has(m.id))||COURSE[0];
    document.querySelector('.stats').insertAdjacentHTML('beforebegin',`<section class="learning-hub"><div><span class="eyebrow">YOUR NEXT SMALL WIN</span><h2>Ready to make something click?</h2><p>${completed.size} modules completed · ${practiceWins.size} activity wins · ${codingCompleted.size} coding challenges practiced</p><a class="button" href="#lesson/${lastLesson}">Continue learning →</a> <a class="button secondary" href="#lesson/${next.id}">Next unfinished module</a></div><div class="hub-badges"><span>${completed.size>=1?'✓':'○'} First step</span><span>${completed.size>=7?'✓':'○'} Halfway explorer</span><span>${completed.size===14?'✓':'○'} Course finisher</span></div></section><div class="activity-grid">${activityCard('Play with your data','Change values, switch axes, and discover how charts tell a story.','#datalab','Open playground')}${activityCard('Take a quick challenge','A fresh 20-question test with answers reviewed at the end.','#mcq','Try exam mode')}${activityCard('Build something real','Pick a coding task, save your attempt, then compare the solution.','#coding','Choose a challenge')}</div>`);
  }
  if(hash.startsWith('lesson/'))enhanceLesson(hash.split('/')[1]);
  if(hash==='mcq')enhanceExam();
  if(hash==='coding')enhanceCoding();
  if(hash==='playground')main.insertAdjacentHTML('beforeend',activityCard('Keep experimenting','Try array reductions, grouped sales, and different chart styles.','#datalab','Open Data Playground'));
  if(hash==='resources')main.insertAdjacentHTML('afterbegin',activityCard('Turn reading into practice','After a few pages, test your understanding with a short challenge.','#mcq','Practice now'));
}
function enhanceLesson(id) {
  const module=COURSE.find(m=>m.id===id);if(!module)return;
  document.getElementById('concepts').insertAdjacentHTML('beforebegin',`<section class="interactive-panel"><div class="eyebrow">LEARN → RECALL → EXPERIMENT</div><h2>Make this lesson yours.</h2><div class="activity-actions"><a class="button secondary" href="#datalab">Explore data visually</a><button class="button secondary" id="focus-lesson" aria-pressed="false">Focus reading</button></div><p>Predict an example, recall a flashcard, and write one thing you learned.</p></section>`);
  document.getElementById('focus-lesson').onclick=e=>{const on=main.classList.toggle('focus-reading');e.target.setAttribute('aria-pressed',String(on));e.target.textContent=on?'Show lesson guide':'Focus reading';};
  document.querySelectorAll('[data-output]').forEach((button,index)=>{
    const ex=module.examples[index];
    button.insertAdjacentHTML('beforebegin',`<form class="prediction" data-predict="${index}"><label for="prediction-${index}">Before revealing: what will it print?</label><textarea id="prediction-${index}" rows="2" placeholder="Type the output, one line at a time"></textarea><button class="button secondary" type="submit">Check prediction</button><p class="prediction-result" role="status"></p></form>`);
    button.previousElementSibling.onsubmit=e=>{e.preventDefault();const form=e.currentTarget;const value=form.querySelector('textarea').value;const normal=s=>s.trim().replace(/\r/g,'').split('\n').map(line=>line.trimEnd()).join('\n');const same=normal(value)===normal(ex.output);form.querySelector('p').textContent=same?'✓ You predicted it! Now explain why.':'Keep exploring. Trace the variables, or reveal the expected result below.';if(same)learningWin(`predict-${id}-${index}`);};
  });
  const cards=module.qa.flatMap(group=>group.items);
  document.getElementById('qa').insertAdjacentHTML('beforebegin',`<section class="interactive-panel"><span class="eyebrow">QUICK RECALL</span><h2>Flip a flashcard.</h2><div id="flashcard"></div><div class="activity-actions"><button class="button secondary" id="flash-prev">← Previous</button><button class="button" id="flash-flip">Reveal answer</button><button class="button secondary" id="flash-next">Next →</button></div></section><section class="interactive-panel"><h2>My learning notes</h2><label for="lesson-notes">What clicked? What do you want to try next?</label><textarea id="lesson-notes" rows="4" placeholder="Write in your own words…"></textarea><button class="button secondary" id="save-notes">Save notes</button><p id="notes-status" role="status">Saved on this browser only.</p></section>`);
  let pos=0,flipped=false;
  function draw(){document.getElementById('flashcard').innerHTML=`<div class="flashcard" aria-live="polite"><small>Card ${pos+1} / ${cards.length}</small><h3>${escapeHTML(cards[pos].question)}</h3>${flipped?`<p>${escapeHTML(cards[pos].answer)}</p>`:'<p>Say your answer out loud, then flip.</p>'}</div>`;document.getElementById('flash-flip').textContent=flipped?'Hide answer':'Reveal answer';}
  document.getElementById('flash-flip').onclick=()=>{flipped=!flipped;draw();};
  document.getElementById('flash-prev').onclick=()=>{pos=(pos-1+cards.length)%cards.length;flipped=false;draw();};
  document.getElementById('flash-next').onclick=()=>{pos=(pos+1)%cards.length;flipped=false;draw();};draw();
  const notes=document.getElementById('lesson-notes');notes.value=learningStore.read('notes-'+id,'');
  document.getElementById('save-notes').onclick=()=>{document.getElementById('notes-status').textContent=learningStore.write('notes-'+id,notes.value)?'✓ Notes saved on this browser.':'Storage unavailable. Copy your notes before leaving.';};
}
function enhanceCoding() {
  const list=document.getElementById('coding-list');
  function attach(){list.querySelectorAll('.coding-body').forEach(body=>{
    if(body.querySelector('.attempt-editor'))return;
    const id=body.querySelector('[data-coding-complete]').dataset.codingComplete;
    const question=CODING_BANK.find(q=>q.id===id);
    const section=document.createElement('section');section.className='attempt-editor';
    section.innerHTML=`<h3>Your own attempt</h3><label for="attempt-${id}">Write a solution or plan. Run Python in your editor, then compare the expected result above.</label><textarea id="attempt-${id}" rows="8" spellcheck="false" aria-label="Your attempt for ${escapeHTML(question.title)}"></textarea><div class="activity-actions"><button class="button secondary" data-save-attempt>Save attempt</button><button class="button secondary" data-download-attempt>Download .py</button></div><p role="status">This scratchpad saves code; it does not execute or grade Python.</p>`;
    body.querySelector('.coding-solution').before(section);
    const editor=section.querySelector('textarea');editor.value=learningStore.read('attempt-'+id,question.starter);
    section.querySelector('[data-save-attempt]').onclick=()=>{section.querySelector('[role="status"]').textContent=learningStore.write('attempt-'+id,editor.value)?'✓ Attempt saved on this browser.':'Storage unavailable. Download your code to keep it.';};
    section.querySelector('[data-download-attempt]').onclick=()=>{const url=URL.createObjectURL(new Blob([editor.value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=id+'.py';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  });}
  attach();const observer=new MutationObserver(attach);observer.observe(list,{childList:true});
}
function enhanceExam() {
  const exam=document.createElement('section');exam.className='interactive-panel';
  exam.innerHTML='<div class="eyebrow">A FRESH CHALLENGE</div><h2>Quick exam · up to 20 questions</h2><p>No spoilers until you finish. Questions are shuffled from your selected set and topic. Smaller topic selections use all available questions. Practice scores stay separate.</p><button class="button" id="start-exam">Start a new exam</button><div id="exam-body"></div>';
  document.querySelector('.mcq-tools').after(exam);
  function practiceVisible(show){document.querySelectorAll('.mcq-sets,.mcq-tools,#mcq-score,#mcq-question,#mcq-storage,.mcq-references').forEach(el=>el.hidden=!show);}
  document.getElementById('start-exam').onclick=()=>{
    practiceVisible(false);
    document.getElementById('start-exam').textContent='Restart with fresh questions';
    const pool=MCQ_BANK.filter(q=>(mcqView.group==='all'||q.group===mcqView.group)&&(mcqView.topic==='All topics'||q.topic===mcqView.topic));
    const questions=mixQuestions(pool).slice(0,20),answers=new Map();let index=0;const start=Date.now();
    const panel=document.getElementById('exam-body');
    if(!document.getElementById('exit-exam')){const exit=document.createElement('button');exit.id='exit-exam';exit.className='button secondary';exit.textContent='Return to practice';document.getElementById('start-exam').after(exit);exit.onclick=()=>{practiceVisible(true);panel.innerHTML='';exit.remove();document.getElementById('start-exam').textContent='Start a new exam';};}
    const focus=()=>panel.querySelector('h3')?.focus({preventScroll:true});
    function finish(){const score=questions.filter(q=>answers.get(q.id)===q.answer).length;learningWin('exam');panel.innerHTML=`<h3 tabindex="-1">${score} / ${questions.length} correct</h3><p>Finished in ${Math.max(1,Math.round((Date.now()-start)/60000))} minute(s). ${score===questions.length?'Perfect recall!':'Review the explanations and try a fresh round.'}</p>${questions.map((q,i)=>`<details class="exam-review"><summary>${answers.get(q.id)===q.answer?'✓':'↻'} ${i+1}. ${escapeHTML(q.question)}</summary><p>Your answer: ${escapeHTML(q.options[answers.get(q.id)])}</p><p>Correct: ${escapeHTML(q.options[q.answer])}</p><p>${escapeHTML(q.explanation)}</p></details>`).join('')}`;focus();}
    function draw(){const q=questions[index];panel.innerHTML=`<h3 tabindex="-1">Question ${index+1} / ${questions.length}</h3><progress max="${questions.length}" value="${answers.size}" aria-label="Exam answers recorded"></progress><form id="exam-question"><fieldset><legend>${escapeHTML(q.question)}</legend>${q.options.map((o,i)=>`<label class="quiz-option"><input type="radio" name="exam-choice" value="${i}" ${answers.get(q.id)===i?'checked':''} required><span>${escapeHTML(o)}</span></label>`).join('')}</fieldset><button class="button" type="submit">${index===questions.length-1?'Finish & review':'Save & next →'}</button><button class="button secondary" type="button" id="exam-back" ${index===0?'disabled':''}>← Back</button></form>`;document.getElementById('exam-question').onsubmit=e=>{e.preventDefault();answers.set(q.id,Number(new FormData(e.currentTarget).get('exam-choice')));if(index===questions.length-1)finish();else{index++;draw();focus();}};document.getElementById('exam-back').onclick=()=>{index--;draw();focus();};}
    draw();focus();
  };
}
function dataPlayground() {
  main.innerHTML=`<div class="page-intro"><div class="eyebrow">TOUCH THE DATA. SEE THE IDEA.</div><h1>Your data playground.</h1><p>Small experiments, instant feedback. These visual simulations show the same calculations you would write in Python.</p></div><div class="lab-tabs" role="group" aria-label="Choose an experiment"><button class="filter active" data-lab="array" aria-pressed="true">NumPy · arrays</button><button class="filter" data-lab="sales" aria-pressed="false">Pandas + charts</button><button class="filter" data-lab="slice" aria-pressed="false">Python · slicing</button></div><section class="interactive-panel" id="lab-panel"></section>`;
  const panel=document.getElementById('lab-panel');
  function arrayLab(){panel.innerHTML='<h2>Which direction is an axis?</h2><p>Edit a 2 × 3 matrix. Axis 0 sums down the rows; axis 1 sums across columns.</p><div class="matrix-inputs">'+[1,2,3,4,5,6].map((v,i)=>`<label>Row ${Math.floor(i/3)+1}, column ${i%3+1}<input type="number" min="-1000000" max="1000000" step="any" value="${v}" data-cell></label>`).join('')+'</div><label>Reduction<select id="axis"><option value="0">axis=0 · column totals</option><option value="1">axis=1 · row totals</option></select></label><div class="live-result" role="status" id="array-result"></div><pre class="lab-code" id="array-code"></pre><button class="button secondary" id="array-reset">Reset matrix</button>';function update(){const cells=[...panel.querySelectorAll('[data-cell]')];if(cells.some(c=>c.value===''||!c.validity.valid)){document.getElementById('array-result').textContent='Enter six valid numbers between −1,000,000 and 1,000,000.';document.getElementById('array-code').textContent='# Waiting for valid values';return;}const v=cells.map(c=>Number(c.value)),axis=Number(document.getElementById('axis').value);const sums=axis===0?[v[0]+v[3],v[1]+v[4],v[2]+v[5]]:[v[0]+v[1]+v[2],v[3]+v[4]+v[5]];document.getElementById('array-result').textContent=`${axis===0?'Column':'Row'} totals: [${sums.join(', ')}]`;document.getElementById('array-code').textContent=`import numpy as np\na = np.array([${JSON.stringify(v.slice(0,3))}, ${JSON.stringify(v.slice(3))}])\nprint(a.sum(axis=${axis}))`;cells.forEach((c,i)=>c.classList.toggle('matrix-alternate',axis===0?i%3===1:i>=3));}panel.oninput=update;panel.onchange=update;document.getElementById('array-reset').onclick=arrayLab;update();}
  function salesLab(){panel.innerHTML=`<h2>From shop sales to a chart.</h2><p>Edit each receipt, then choose a grouping and chart. Watch how Pandas aggregation changes the story.</p><div class="editable-sales">${['Tea','Coffee','Tea','Coffee'].map((name,i)=>`<label>${name} · receipt ${i+1} (₹)<input type="number" min="0" max="100000" step="1" value="${[80,120,160,90][i]}" data-sale></label>`).join('')}</div><div class="activity-actions"><label>Aggregation<select id="aggregation"><option value="sum">Total · sum</option><option value="mean">Average · mean</option></select></label><label>Chart style<select id="chart-kind"><option value="bar">Bar</option><option value="line">Line</option></select></label></div><div id="sales-chart"></div><div class="live-result" id="sales-insight" role="status"></div><pre class="lab-code" id="sales-code"></pre><button class="button secondary" id="sales-reset">Reset receipts</button>`;function update(){const inputs=[...panel.querySelectorAll('[data-sale]')];if(inputs.some(c=>c.value===''||!c.validity.valid)){document.getElementById('sales-chart').textContent='Enter whole rupee amounts from 0 to 100,000.';document.getElementById('sales-insight').textContent='';document.getElementById('sales-code').textContent='# Waiting for valid receipts';return;}const v=inputs.map(c=>Number(c.value)),agg=document.getElementById('aggregation').value,kind=document.getElementById('chart-kind').value;const values=[v[0]+v[2],v[1]+v[3]].map(x=>agg==='mean'?x/2:x),max=Math.max(...values,1);const y=values.map(x=>210-x/max*160);document.getElementById('sales-chart').innerHTML=`<svg viewBox="0 0 500 260" role="img" aria-label="${agg} sales: Tea ${values[0]}, Coffee ${values[1]}"><line x1="45" y1="210" x2="455" y2="210" stroke="#65706b"/>${kind==='bar'?values.map((x,i)=>`<rect x="${100+i*220}" y="${y[i]}" width="80" height="${210-y[i]}" rx="6" fill="${i?'#d98244':'#1b514b'}"/>`).join(''):`<path d="M140 ${y[0]} L360 ${y[1]}" stroke="#1b514b" stroke-width="4" fill="none"/>${y.map((p,i)=>`<circle cx="${140+i*220}" cy="${p}" r="7" fill="#d98244"/>`).join('')}`}${values.map((x,i)=>`<text x="${140+i*220}" y="${y[i]-12}" text-anchor="middle">₹${x.toFixed(2)}</text><text x="${140+i*220}" y="240" text-anchor="middle">${i?'Coffee':'Tea'}</text>`).join('')}</svg>`;document.getElementById('sales-insight').textContent=values[0]===values[1]?'Tea and Coffee are equal.':`${values[0]>values[1]?'Tea':'Coffee'} has the higher ${agg==='sum'?'total':'average'} by ₹${Math.abs(values[0]-values[1]).toFixed(2)}.`;document.getElementById('sales-code').textContent=`import pandas as pd\nimport matplotlib.pyplot as plt\ndf = pd.DataFrame({"product": ["Tea", "Coffee", "Tea", "Coffee"],\n                   "sales": ${JSON.stringify(v)}})\nsummary = df.groupby("product", sort=False)["sales"].${agg}()\nsummary.plot(kind="${kind}")\nplt.ylabel("Sales (₹)")\nplt.show()`;}panel.oninput=update;panel.onchange=update;document.getElementById('sales-reset').onclick=salesLab;update();}
  function sliceLab(){panel.innerHTML='<h2>Take a slice of Python.</h2><p>Move the handles. Start is included; stop is excluded.</p><label>Start index <input id="slice-start" type="range" min="0" max="6" value="1"></label><label>Stop index <input id="slice-stop" type="range" min="0" max="6" value="4"></label><div id="slice-tiles" class="slice-tiles"></div><div class="live-result" id="slice-result" role="status"></div><pre class="lab-code" id="slice-code"></pre>';function update(){const start=Number(document.getElementById('slice-start').value),stop=Number(document.getElementById('slice-stop').value);document.getElementById('slice-tiles').innerHTML=[...'Python'].map((char,i)=>`<span class="${i>=start&&i<stop?'selected':''}"><small>${i}</small>${char}</span>`).join('');document.getElementById('slice-result').textContent=`[${start}:${stop}] → ${JSON.stringify('Python'.slice(start,stop))}${start>=stop?' · An empty slice.':''}`;document.getElementById('slice-code').textContent=`text = "Python"\nprint(text[${start}:${stop}])`;}panel.oninput=update;panel.onchange=null;update();}
  const labs={array:arrayLab,sales:salesLab,slice:sliceLab};document.querySelectorAll('[data-lab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-lab]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});labs[b.dataset.lab]();});arrayLab();
}
// Keep the existing router and all of its saved progress intact.
const baseRoute=route;
route=function(){main.classList.remove('focus-reading');if(location.hash==='#datalab'){enhanceLearning('datalab');document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav==='datalab';a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});dataPlayground();document.title='Data Playground · Python Everyday';window.scrollTo(0,0);}else baseRoute();};
route();
