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

Money pictures (Money Market Beats): source and licence
Daniel's decision (Oct 2026): after being told about Article 18 of the ECCB Agreement Act
(Cap. 85) and copyright, Daniel chose to show REAL images of EC money for classroom learning.
They are shown small, with an "Educational use" label; there is no print or download feature
(right-click/long-press and dragging are switched off on the pictures). No ECCB permission
was found or obtained. Files are in img/money/ (WebP, cached by sw.js for offline use).
If an image fails to load, the app shows the older drawing instead.
On "Which note/coin is this?" questions the picture is cropped so the number does not show.

Notes: 2019 polymer series, BACK side (landmarks). Wikimedia Commons, uploader
User:Subash05102001, licence CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/).
Changed from the original: converted to WebP.
  note_5_back.webp  <- https://upload.wikimedia.org/wikipedia/commons/5/57/East_caribbean_states_eccb_5_dollars_2019.00.00_b240_pnl_ad_000000_r.jpg
  note_10_back.webp  <- https://upload.wikimedia.org/wikipedia/commons/0/07/East_caribbean_states_eccb_10_dollars_2019.00.00_b241_pnl_ad_000000_r.jpg
  note_20_back.webp  <- https://upload.wikimedia.org/wikipedia/commons/5/59/East_caribbean_states_eccb_20_dollars_2019.00.00_b242_pnl_ad_000000_r.jpg
  note_50_back.webp  <- https://upload.wikimedia.org/wikipedia/commons/c/c0/East_caribbean_states_eccb_50_dollars_2019.00.00_b243_pnl_ad_000000_r.jpg
  note_100_back.webp  <- https://upload.wikimedia.org/wikipedia/commons/f/f8/East_caribbean_states_eccb_100_dollars_2019.00.00_b244_pnl_ad_000000_r.jpg

Coins: Bibliotheque nationale de France (Gallica) scans on Wikimedia Commons, marked
public domain. Reverse (ship) side, cropped, resized to 240 px, converted to WebP.
  coin_10c.webp  <- https://upload.wikimedia.org/wikipedia/commons/8/89/Monnaie_-_Cara%C3%AFbes_orientales_anglaises%2C_Elisabeth_II%2C_10_cents%2C_1987_-_btv1b11337166m_%282_of_2%29.jpg
  coin_25c.webp  <- https://upload.wikimedia.org/wikipedia/commons/4/4b/Monnaie_-_Cara%C3%AFbes_orientales_anglaises%2C_Elisabeth_II%2C_25_cents%2C_1987_-_btv1b11337161c_%282_of_2%29.jpg
  coin_1.webp    <- https://upload.wikimedia.org/wikipedia/commons/1/1b/Monnaie_-_Cara%C3%AFbes_orientales_anglaises%2C_Elisabeth_II%2C_1_dollar%2C_2015_-_btv1b11337173p_%282_of_2%29.jpg
  (10c and 25c are 1987 coins; the ship design is the same today.)
5c coin: no free image of the current round 5c could be found (the only one is the old
scalloped 1989 coin), so the 5c stays a drawing.

Extracurricular Activities (Style Studio and Prize Store)
  Coins: Music Lab 1 star = 1 coin; Dino Truck Town 5 coins per round of 10. Old progress
  was converted once. Spending never lowers stars, badges or scores. No real money, no ads.
  Avatar and all 211 items are drawn in code: js/avatar.js (default store items, 162).
  Seasonal events: js/events.js. To add an event, copy a block, set start/end as 'MM-DD'
  (can cross New Year) and list items per slot. Event items show only in their window
  (tablet date); bought items stay owned.
  Parent dashboard: per player, Parent unlock (PIN) and/or Milestone unlock (every N rounds
  today, or a new badge), session minutes, coins +10/-10, Lock now. Studio time counts toward
  the daily limit.
