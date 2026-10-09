# Python Everyday

A lightweight learning companion.

## Open the website

Double-click `dist/index.html` to open it in your browser. Keep the files in `dist` together. For the ZIP version, extract the ZIP first and open `index.html` in the extracted folder.

No installation, internet connection, or build is needed to browse the lessons. External documentation links and the sample API require internet access. Browser storage and clipboard access depend on your browser; these features have fallbacks.

The site opens on its illustrated learning path with 14 modules, 28 explained examples, 14 practice labs, lesson quizzes, 117 questions and answers covering all 83 lesson topics and the self-learning areas, course resources, 21 small SVG illustrations, and a café-bill demonstration. Each lesson has a Q&A shortcut. Open a topic to review its questions, reveal individual answers, or show all answers together. The site works on desktop and phone screens and supports keyboard navigation and reduced motion.

The MCQ Practice tab (`#mcq`) contains 100 unique four-option questions: 50 across all 14 syllabus modules, and 50 specialist questions (18 NumPy, 18 Pandas, 14 Matplotlib). Switch question sets, filter by topic, or jump to a question. Checking an answer reveals the correct option and an explanation. Scores and checked answers stay in the current browser; Try again replaces that question's previous result. MCQ content is in `dist/mcq-bank.js`. Run `node check-mcq.mjs` to verify counts, uniqueness, topic coverage, and answer structure.

The Coding Practice tab (`#coding`) has 21 easy-to-medium exercises: 5 each for NumPy, Pandas and Matplotlib, 3 combining NumPy + Pandas, and 3 combining all three libraries. Each includes a task, sample data, copyable starter code, expected output, a hint and a standalone solution. Eight reference charts show the expected graphical results. Filter by topic or difficulty, search, and keep a browser-local practice checklist. Run your own code in a Python editor or notebook; the site does not execute or automatically grade it. Content is in `dist/coding-bank.js`.

All 21 coding solutions were executed with NumPy 2.3.5, Pandas 3.0.1 and Matplotlib 3.11.2. Their printed output, numerical results, plot data and a constant-feature scaling boundary were checked. To repeat verification, run `node check-coding.mjs`, then `python check-coding.py` in an environment with those libraries. The Python check regenerates the 8 reference SVG charts. Browser checks cover topic and difficulty filters, empty search results, expanding hints and solutions, copying code, checklist persistence and phone layout.

Prepared example results are labeled. The site does not run Python. Run the examples in a Python environment; third-party examples require the indicated packages. Progress is stored in the current browser only and does not sync between devices.

## Local development

With Node.js installed, run `node server.mjs` from this directory, then open http://127.0.0.1:4173. Stop with Ctrl+C. Static output is in `dist`. Content is in `dist/course.js`; interactions are in `dist/app.js`; styles are in `dist/style.css`.

## Verification

All 28 original snippets and all 8 additional Q&A snippets compile as Python. The 18 checked standard-library examples match their expected output. Q&A coverage was checked against every lesson topic and self-learning area. Browser checks confirm Q&A renders in all 14 modules, individual answers expand, show/hide-all works, lesson shortcuts work, new answer text is searchable, and the phone layout has no horizontal overflow. Earlier browser checks cover stage filters, no-result searches, lesson navigation, expected-result toggles, correct and incorrect quiz feedback, progress persistence, receipt calculation, and invalid input. Third-party, chart, framework, and network snippets were syntax checked but not executed end to end.

The website deploys to the existing Vercel project from the GitHub main branch, using `vercel.json` and the static `dist` directory. See `VERCEL-DEPLOY.md` for deployment setup.
