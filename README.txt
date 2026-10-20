CARRIACOU KIDS LAB - prototype v1 (20 Oct 2026)
==============================================

What it is
  An offline learning web app (PWA) for Samsung Galaxy Tab A9+ tablets.
  Plain HTML, CSS and JavaScript. No frameworks, no build step, no network
  calls, no ads, no analytics. All data stays on the tablet (localStorage).

Files
  index.html          Page shell; loads the CSS and three scripts.
  manifest.json       Install-to-home-screen settings and icons.
  sw.js               Service worker: caches every file for offline use.
  css/style.css       All styling (large touch targets, landscape+portrait).
  js/audio.js         Generated sound effects (Web Audio) and read-aloud
                      (built-in speechSynthesis; no recorded voices).
  js/lessons.js       ALL lesson content (Grade 3 wings and toddler list).
  js/app.js           Screens: PIN, home, parent dashboard, Music Lab quiz
                      engine, Dino Truck Town games, daily time limit.
  icons/              App icons (SVG + PNG).
  screens/            Test screenshots (not needed by the app).

Running it
  On a computer: open a terminal in this folder and run
      python3 -m http.server 8000
  then visit http://localhost:8000/ . The service worker needs http(s),
  not file://. Later it can be hosted on GitHub Pages; all paths are relative.

First launch
  You are asked to set a 4-digit parent/teacher PIN. In the Parent area add
  players (name + world), set the daily limit (60-120 min, default 90),
  see progress, reset today's time, remove players, or reset the PIN.
  When a player's daily minutes run out, a friendly "time to rest" screen shows.
  Time counts only while that player's world is open and the screen is visible.

How to add a Grade 3 question
  Open js/lessons.js. Find the wing (clues, water, weather, crops, shapes) and
  add a line to its questions list:
      {q:'Question text', c:['choice A','choice B','choice C'], a:0, why:'Short explanation.'},
  a is the position of the correct choice, counting from 0. Choices are
  shuffled on screen. Words inside <b>...</b> are highlighted.
  For the shapes wing you may add art:'cube' (also cuboid, sphere, cylinder,
  cone, pyramid) to show a drawing.

How to add a new Grade 3 wing (topic)
  Copy a whole {id:...} block in G3_WINGS, give it a new unique id, title,
  subject, topic, icon (emoji), source (the OECS outcome it follows), intro
  and questions. It appears automatically on the lab map and in the dashboard.

How to add a toddler activity
  Add an entry to TODDLER in js/lessons.js, write a game function in js/app.js
  (copy countGame / colourGame / shapeGame), and add it to the lookup in
  dinoHome(). Rules for toddler games: every prompt spoken, no reading, huge
  buttons, never a failure sound or "wrong" message, only gentle hints.

After changing any file
  Edit VERSION in sw.js (e.g. ckl-v2) and add any new file to ASSETS, so the
  tablets download the update.

Privacy
  Nothing is sent anywhere. Clearing the browser's site data for this app
  erases all players and progress.
