# Python Everyday

A lightweight learning companion.

## Open the website

Double-click `dist/index.html` to open it in your browser. Keep the files in `dist` together. For the ZIP version, extract the ZIP first and open `index.html` in the extracted folder.

No installation, internet connection, or build is needed to browse the lessons. External documentation links and the sample API require internet access. Browser storage and clipboard access depend on your browser; these features have fallbacks.

The site has 14 modules, 28 explained examples, 14 practice labs, quizzes, 117 questions and answers covering all 83 lesson topics and the self-learning areas, course resources, seven small SVG illustrations, and a café-bill demonstration. Each lesson has a Q&A shortcut. Open a topic to review its questions, reveal individual answers, or show all answers together. The site works on desktop and phone screens and supports keyboard navigation and reduced motion.

Prepared example results are labeled. The site does not run Python. Run the examples in a Python environment; third-party examples require the indicated packages. Progress is stored in the current browser only and does not sync between devices.

## Local development

With Node.js installed, run `node server.mjs` from this directory, then open http://127.0.0.1:4173. Stop with Ctrl+C. Static output is in `dist`. Content is in `dist/course.js`; interactions are in `dist/app.js`; styles are in `dist/style.css`.

## Verification

All 28 original snippets and all 8 additional Q&A snippets compile as Python. The 18 checked standard-library examples match their expected output. Q&A coverage was checked against every lesson topic and self-learning area. Browser checks confirm Q&A renders in all 14 modules, individual answers expand, show/hide-all works, lesson shortcuts work, new answer text is searchable, and the phone layout has no horizontal overflow. Earlier browser checks cover stage filters, no-result searches, lesson navigation, expected-result toggles, correct and incorrect quiz feedback, progress persistence, receipt calculation, and invalid input. Third-party, chart, framework, and network snippets were syntax checked but not executed end to end.

Publication was not completed because the requested permission to run the source-upload helper was declined. Site registration exists, but there is no verified live deployment.
