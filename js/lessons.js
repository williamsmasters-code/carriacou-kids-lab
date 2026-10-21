// Lesson data. Each Grade 3 wing: {id,title,topic,subject,icon,source,questions:[{q,c:[choices],a:index,why}]}
// Questions are spoken with the read-aloud button. Keep wording neutral and accurate to the OECS source noted.
window.G3_WINGS = [
{id:'clues',title:'Clue Detective Studio',subject:'English',topic:'Context Clues',icon:'🔎',
 source:'OECS Grade 3 Language Arts Learning Standards, Reading: Vocabulary Building LA.3.R.VB.3 (use sentence and word context to find the meaning of unknown words) and VB.1 (antonyms, synonyms)',
 intro:'Detectives use the other words in a sentence to work out a new word. Read the sentence, then pick the best meaning.',
 questions:[
 {q:'The drummer was so <b>exhausted</b> after the long parade that the drummer fell asleep on the bus. What does exhausted mean?',c:['very tired','very hungry','very happy'],a:0,why:'Falling asleep is the clue: exhausted means very tired.',std:'LA.3.R.VB.3'},
 {q:'The lab was <b>chilly</b>, so we put on our jackets. What does chilly mean?',c:['noisy','a little cold','bright'],a:1,why:'Putting on jackets is the clue: chilly means a little cold.',std:'LA.3.R.VB.3'},
 {q:'The steel pan sounded <b>melodious</b>; everyone smiled at the sweet tune. What does melodious mean?',c:['broken','pleasant to hear','very quiet'],a:1,why:'"Sweet tune" and smiling are clues: melodious means pleasant to hear.',std:'LA.3.R.VB.3'},
 {q:'The boat was <b>tiny</b>, not big like the ferry to Grenada. What does tiny mean?',c:['very small','very fast','very old'],a:0,why:'"Not big" is an opposite clue: tiny means very small.',std:'LA.3.R.VB.3, VB.1 (opposite clue)'},
 {q:'Grandma was <b>delighted</b> with the gift and gave everyone a big hug. What does delighted mean?',c:['angry','very pleased','sleepy'],a:1,why:'The big hug is the clue: delighted means very pleased.',std:'LA.3.R.VB.3'},
 {q:'After the storm the yard was a <b>mess</b>: leaves, branches and buckets everywhere. What does mess mean?',c:['untidy state','party','garden'],a:0,why:'The list of things everywhere is an example clue: a mess is an untidy state.',std:'LA.3.R.VB.3'},
 {q:'The scientist was <b>cautious</b> and wore goggles before mixing anything. What does cautious mean?',c:['careless','careful','late'],a:1,why:'Wearing goggles first is the clue: cautious means careful.',std:'LA.3.R.VB.3'},
 {q:'We had to <b>conserve</b> water during the dry season, so we took short showers. What does conserve mean?',c:['waste','save','heat'],a:1,why:'Taking short showers is the clue: conserve means save.',std:'LA.3.R.VB.3'},
 {q:'The road was <b>slippery</b> after the rain, so the bus drove very slowly. What does slippery mean?',c:['dry and rough','wet and easy to slide on','very wide'],a:1,why:'Rain and driving slowly are clues: slippery means easy to slide on.',std:'LA.3.R.VB.3'},
 {q:'The baby was <b>frightened</b> by the loud thunder and started to cry. What does frightened mean?',c:['scared','sleepy','hungry'],a:0,why:'Loud thunder and crying are clues: frightened means scared.',std:'LA.3.R.VB.3'},
 {q:'Our class was <b>noisy</b>, not quiet like the library. What does noisy mean?',c:['silent','full of loud sounds','empty'],a:1,why:'"Not quiet" is an opposite clue: noisy means full of loud sounds.',std:'LA.3.R.VB.3, VB.1 (opposite clue)'},
 {q:'The mango was <b>ripe</b>: soft, sweet and ready to eat. What does ripe mean?',c:['ready to eat','too small','green and hard'],a:0,why:'"Ready to eat" explains the word: ripe means fully grown and ready to eat.',std:'LA.3.R.VB.3'},
 {q:'Fishers <b>depart</b> early in the morning and come back in the afternoon. What does depart mean?',c:['sleep','leave','swim'],a:1,why:'"Come back" later is the clue: depart means leave.',std:'LA.3.R.VB.3, VB.1 (opposite clue)'},
 {q:'The <b>enormous</b> cruise ship was bigger than every boat in the harbour. What does enormous mean?',c:['very large','very slow','very shiny'],a:0,why:'"Bigger than every boat" is the clue: enormous means very large.',std:'LA.3.R.VB.3'}]},
{id:'water',title:'Sea Sound Deck',subject:'Social Studies',topic:'Water bodies around the Caribbean',icon:'🌊',
 source:'Water bodies are in the OECS Grade 3 Social Studies curriculum guide (Spatial Thinking: Water Bodies, 3-ST-K-2, 3-ST-S-2, 3-ST-K-3), not in the Learning Standards list; linked standards SS.3.CI.6, SS.3.NI.5, SS.3.RPS.2, SS.3.SE.7',
 intro:'Our islands sit between two big water bodies. The Caribbean Sea is to the west, and the Atlantic Ocean is to the east.',
 map:true,
 questions:[
 {q:'Which large water body is to the <b>west</b> of the chain of Caribbean islands?',c:['Atlantic Ocean','Caribbean Sea','Pacific Ocean'],a:1,why:'The Caribbean Sea lies to the west of the island chain.',std:'3-ST-K-2 (curriculum guide ); SS.3.CI.6 cardinal points'},
 {q:'Which large water body is to the <b>east</b> of the Caribbean islands?',c:['Atlantic Ocean','Caribbean Sea','Indian Ocean'],a:0,why:'The Atlantic Ocean lies to the east of the region.',std:'3-ST-K-2 (curriculum guide ); SS.3.CI.6 cardinal points'},
 {q:'On the map, which colour zone is the Atlantic Ocean? (Look at the map labels.)',c:['the right side (east)','the left side (west)','the middle of the island'],a:0,why:'East is to the right on a map, so the Atlantic is on the right.',std:'3-ST-S-2 (curriculum guide ); SS.3.CI.6'},
 {q:'Which of these is a water body that flows over land, often found in our hills?',c:['river','mountain','beach'],a:0,why:'Rivers and streams are water bodies that flow over land.',std:'3-ST-K-2 (curriculum guide )'},
 {q:'Which is bigger: an ocean or a stream?',c:['a stream','an ocean','they are the same'],a:1,why:'Oceans are the largest water bodies.',std:'3-ST-K-2 (curriculum guide )'},
 {q:'How do the seas around us keep Caribbean people connected?',c:['People travel and trade by boat','The sea stops all travel','The sea is only for fish'],a:0,why:'Boats, ferries and ships carry people and goods between islands.',std:'3-ST-V-2 (curriculum guide )'},
 {q:'Carriacou is an island. What surrounds an island?',c:['water','desert','snow'],a:0,why:'An island is land with water all around it.',std:'SS.3.NI.5 (map and shape of country)'},
 {q:'A river that suddenly drops from a great height makes a…',c:['waterfall','lagoon','ocean'],a:0,why:'When river water falls from a height, it is called a waterfall.',std:'3-ST-K-2 (curriculum guide  water bodies table)'},
 {q:'Which of these is a waterfall in the Caribbean?',c:['Kaieteur Falls in Guyana','The Caribbean Sea','Grand Anse Beach'],a:0,why:'Kaieteur Falls in Guyana (a CARICOM country) is one of the region\'s most famous waterfalls; the curriculum guide also lists Dominica\'s Trafalgar Falls.',std:'3-ST-K-2 (curriculum guide  water bodies table)'},
 {q:'Which of these is a land-based water body?',c:['river','ocean','sea'],a:0,why:'Rivers, streams and waterfalls are on land. Seas and oceans are huge bodies of salt water.',std:'3-ST-K-2 (curriculum guide )'},
 {q:'Why are our water bodies important to our people?',c:['fishing, travel, tourism and water for farms','they are not important','only for looking at'],a:0,why:'Water bodies give us fish, transport, tourism and water for farming.',std:'3-ST-K-3 (curriculum guide ); SS.3.RPS.2 uses of a natural resource'},
 {q:'Which action helps to protect our seas and rivers?',c:['putting rubbish in the bin','throwing plastic in the river','pouring oil in the sea'],a:0,why:'Keeping rubbish out of water protects fish, people and beaches.',std:'3-ST-V-3 (curriculum guide ); SS.3.SE.7 caring for the environment'},
 {q:'Grenada, Carriacou and Petite Martinique are separated from one another by…',c:['sea water','a desert','a mountain range'],a:0,why:'Our islands are separated by the sea, so ferries and boats link them.',std:'SS.3.NI.5 (map and shape of country)'},
 {q:'Which type of water body is the largest?',c:['ocean','river','stream'],a:0,why:'Oceans are the largest water bodies on Earth.',std:'3-ST-K-2 (curriculum guide )'}]},
{id:'weather',title:'Weather Station',subject:'Science',topic:'Weather elements, measuring and method',icon:'🌦️',
 source:'OECS Grade 3 Science and Technology Learning Standards, Earth\'s Weather ST.3.ESS.EW.1 to EW.10; Technological Methods ST.3.TE.TM.1; rain gauge and process skills from the Science curriculum guide (K1.6, K1.7)',
 intro:'The elements of weather are wind, clouds, water vapour, precipitation (rain) and temperature. Scientists measure them with instruments and test ideas step by step.',
 questions:[
 {q:'Which instrument measures how hot or cold it is (temperature)?',c:['rain gauge','thermometer','anemometer'],a:1,why:'A thermometer measures temperature.',std:'ST.3.ESS.EW.9'},
 {q:'Which instrument measures wind speed?',c:['anemometer','thermometer','ruler'],a:0,why:'An anemometer has cups that spin faster in stronger wind.',std:'ST.3.ESS.EW.5'},
 {q:'Which instrument measures the amount of rainfall?',c:['wind vane','rain gauge','thermometer'],a:1,why:'A rain gauge collects rain so we can measure how much fell.',std:'ST.3.ESS.EW.2 (precipitation); rain gauge from curriculum guide K1.7'},
 {q:'Which of these is an element of weather?',c:['temperature','homework','music'],a:0,why:'The elements of weather are air/wind, clouds, water vapour, precipitation (rain) and temperature.',std:'ST.3.ESS.EW.2'},
 {q:'A scientist thinks: "It will rain more on Monday than Tuesday." What is this step called?',c:['prediction','conclusion','measurement'],a:0,why:'Saying what you think will happen before testing is a prediction.',std:'ST.3.TE.TM.1; science process skills (curriculum guide )'},
 {q:'What should a scientist do right after making a prediction?',c:['test it and observe','give up','change the answer'],a:0,why:'Next you test, observe and record what really happens.',std:'ST.3.TE.TM.1; science process skills (curriculum guide )'},
 {q:'Our rain gauge showed 5 mm Monday, 12 mm Tuesday, 3 mm Wednesday. Which day had the most rain?',c:['Monday','Tuesday','Wednesday'],a:1,why:'12 mm is the greatest amount, so Tuesday.',std:'ST.3.ESS.EW.10 (reading weather records)'},
 {q:'Who depends a lot on good weather forecasts?',c:['fishers and farmers','nobody','only pilots on holiday'],a:0,why:'Fishers, farmers, drivers and pilots all depend on weather forecasts.',std:'ST.3.ESS.EW.1, EW.4'},
 {q:'When we look up and see grey sky and no sunshine, which weather element are we observing?',c:['clouds','temperature','rainfall'],a:0,why:'Cloud cover is an element of weather we can observe.',std:'ST.3.ESS.EW.2'},
 {q:'A thermometer reads 31 °C on Monday and 27 °C on Tuesday. Which day was hotter?',c:['Monday','Tuesday','they were the same'],a:0,why:'31 is greater than 27, so Monday was hotter.',std:'ST.3.ESS.EW.9'},
 {q:'The cups of an anemometer are spinning very fast. What does this tell us?',c:['it is very windy','it is very hot','it is raining a lot'],a:0,why:'The faster the cups spin, the stronger the wind.',std:'ST.3.ESS.EW.5'},
 {q:'Telling people what the weather will probably be like tomorrow is called…',c:['weather forecasting','weather painting','weather cooking'],a:0,why:'A forecast tells us the weather that is expected.',std:'ST.3.ESS.EW.10'},
 {q:'In an experiment, after we test and observe, we decide what we found out. This step is the…',c:['conclusion','prediction','question'],a:0,why:'The conclusion says what the results show.',std:'ST.3.TE.TM.1; science process skills (curriculum guide )'},
 {q:'Why should we record our rain gauge reading at the same time every day?',c:['so the test is fair','so it rains more','so the gauge is heavier'],a:0,why:'Measuring the same way each time keeps a test fair.',std:'ST.3.TE.NT.2 (precision); science process skills (curriculum guide )'}]},
{id:'crops',title:'Crop Garden Greenhouse',subject:'Agriculture (via Science outcomes)',topic:'Crops',icon:'🌱',
 source:'Agriculture is not an OECS Hub subject: grounded in Grade 3 Science and Technology Learning Standards (ST.3.LS.DC, LS.SF.1, LS.ECS, STSE.1) and Social Studies resources standards (SS.3.RPS). Assumption labelled.',
 intro:'Crops are plants that farmers grow for food or to sell. Grenada is famous for nutmeg and cocoa.',
 questions:[
 {q:'What do crop plants need to grow?',c:['sunlight, water, air and soil','only sweets','darkness and no water'],a:0,why:'Plants need sunlight, water, air and nutrients from soil.',std:'ST.3.LS.DC.7, LS.SF.1'},
 {q:'Which spice crop is Grenada famous for?',c:['nutmeg','apples','wheat'],a:0,why:'Grenada is called the Spice Isle, famous for nutmeg.',std:'SS.3.RPS.1, RPS.3 (natural resources and agriculture)'},
 {q:'Chocolate is made from the beans of which crop?',c:['cocoa','corn','cabbage'],a:0,why:'Cocoa beans are dried and made into chocolate.',std:'SS.3.RPS.5 (goods from natural resources)'},
 {q:'Which part of the plant takes in water from the soil?',c:['roots','flowers','leaves only'],a:0,why:'Roots take in water and nutrients from the soil.',std:'ST.3.LS.SF.1'},
 {q:'Which of these is a root crop we eat?',c:['sweet potato','mango','banana'],a:0,why:'We eat the root of the sweet potato plant.',std:'ST.3.LS.SF.1'},
 {q:'Bees visit crop flowers. How do they help?',c:['they carry pollen so fruits can form','they eat the roots','they bring rain'],a:0,why:'Bees pollinate flowers, helping fruits and seeds form.',std:'ST.3.LS.DC.6 (seed reproduction)'},
 {q:'A long dry season with no rain will most likely make crops…',c:['wilt and grow poorly','grow faster','turn blue'],a:0,why:'Without water, plants wilt and grow poorly.',std:'ST.3.LS.DC.7, ST.3.ESS.EW.8'},
 {q:'Which part of a crop plant uses sunshine to make food for the plant?',c:['leaves','roots','seeds'],a:0,why:'Green leaves use sunlight to make food (photosynthesis).',std:'ST.3.LS.SF.1, PS.EN.7'},
 {q:'A new plant usually grows from a…',c:['seed','stone','shell'],a:0,why:'Seeds sprout and grow into new plants.',std:'ST.3.LS.DC.2'},
 {q:'Which of these is a crop grown in Grenada?',c:['cocoa','grapes','wheat'],a:0,why:'Cocoa, nutmeg, bananas and corn are grown in Grenada; grapes and wheat need cooler climates.',std:'SS.3.RPS.1'},
 {q:'Pulling out weeds helps crops because weeds…',c:['take water and food from the soil','make the crops taller','bring more sunshine'],a:0,why:'Weeds compete with crops for water, nutrients and light.',std:'ST.3.LS.ECS.2 (balance); curriculum guide '},
 {q:'Heavy rain washes soil away from a bare hillside farm. This is called…',c:['soil erosion','photosynthesis','pollination'],a:0,why:'When soil is washed or blown away, it is soil erosion.',std:'ST.3.LS.ECS.7 (conservation), ESS.ER.6'},
 {q:'Too much chemical fertiliser washing into the sea can…',c:['harm sea plants and animals','make the sea cleaner','help fish breathe'],a:0,why:'Farm chemicals that run off into water can harm living things in it.',std:'ST.3.STSE.1'},
 {q:'Why do farmers listen to the weather forecast?',c:['to plan planting and harvesting','to choose a song','to paint the barn'],a:0,why:'Farmers depend on weather to plant and harvest on time.',std:'ST.3.ESS.EW.1'},
 {q:'What does a seed need to start growing (germinate)?',c:['water, warmth and air','salt and darkness only','nothing at all'],a:0,why:'Seeds germinate when they get water, warmth and air.',std:'ST.3.LS.DC.7'},
 {q:'New sweet potato plants are often grown from pieces of vine, not seeds. This is called…',c:['vegetative propagation','pollination','evaporation'],a:0,why:'Growing new plants from stems, vines or roots is vegetative propagation.',std:'ST.3.LS.DC.5'}]},
{id:'shapes',title:'Shape Synth Lab',subject:'Mathematics',topic:'3D shapes',icon:'🧊',
 source:'OECS Grade 3 Mathematics Learning Standards, Geometry, solid shapes MT.3.GT.SS.1 to SS.4 (cube, cuboid, cylinder, cone, sphere)',
 intro:'3D shapes are solids. A face is a flat surface, an edge is where two surfaces meet, and a vertex is a corner or point.',
 questions:[
 {q:'How many faces does a cube have?',c:['4','6','8'],a:1,why:'A cube has 6 square faces, like a dice.',art:'cube',std:'MT.3.GT.SS.1, SS.2'},
 {q:'How many vertices (corners) does a cube have?',c:['6','8','12'],a:1,why:'A cube has 8 vertices.',art:'cube',std:'MT.3.GT.SS.1, SS.2'},
 {q:'How many edges does a cube have?',c:['8','10','12'],a:2,why:'A cube has 12 edges.',art:'cube',std:'MT.3.GT.SS.1, SS.2'},
 {q:'Which 2D shape is each face of a cube?',c:['square','triangle','circle'],a:0,why:'All 6 faces of a cube are squares.',art:'cube',std:'MT.3.GT.SS.2'},
 {q:'How many faces does a cuboid have?',c:['4','6','8'],a:1,why:'A cuboid has 6 faces. They are rectangles (some may be squares).',art:'cuboid',std:'MT.3.GT.SS.2'},
 {q:'A shoebox is shaped like a…',c:['cuboid','sphere','cone'],a:0,why:'A shoebox has 6 rectangle faces, 12 edges and 8 vertices: a cuboid.',art:'cuboid',std:'MT.3.GT.SS.3'},
 {q:'How are a cube and a cuboid the same?',c:['both have 6 faces, 12 edges and 8 vertices','both have curved surfaces','both have no vertices'],a:0,why:'Cubes and cuboids both have 6 faces, 12 edges and 8 vertices. A cube\'s faces are all equal squares; a cuboid\'s faces are rectangles.',art:'cuboid',std:'MT.3.GT.SS.4'},
 {q:'A tin of milk is shaped like a…',c:['cylinder','cuboid','cube'],a:0,why:'A tin has 2 flat circle faces and a curved surface: a cylinder.',art:'cylinder',std:'MT.3.GT.SS.3'},
 {q:'Which 2D shape are the flat faces of a cylinder?',c:['circles','triangles','squares'],a:0,why:'The two flat faces of a cylinder are circles.',art:'cylinder',std:'MT.3.GT.SS.2'},
 {q:'Which 3D shape has 1 flat circle face and 1 vertex (point)?',c:['cone','sphere','cylinder'],a:0,why:'A cone has one circle face, a curved surface, and comes to a point.',art:'cone',std:'MT.3.GT.SS.2'},
 {q:'What is one difference between a cylinder and a cone?',c:['a cylinder has 2 circle faces; a cone has 1 circle face and a point','a cone has more flat faces','a cylinder has a pointed top'],a:0,why:'Both have a curved surface, but a cylinder has 2 circle faces and a cone has 1 circle face and 1 vertex.',art:'cone',std:'MT.3.GT.SS.4'},
 {q:'Which 3D shape is like a ball?',c:['sphere','cone','cube'],a:0,why:'A sphere is round all over, like a ball.',art:'sphere',std:'MT.3.GT.SS.3'},
 {q:'Which 3D shape has no edges and no vertices?',c:['sphere','cube','cylinder'],a:0,why:'A sphere has one curved surface, no edges and no vertices.',art:'sphere',std:'MT.3.GT.SS.2'},
 {q:'Which 3D shape can roll but cannot stack?',c:['sphere','cube','cuboid'],a:0,why:'A sphere has only a curved surface, so it rolls but will not stack.',art:'sphere',std:'MT.3.GT.SS.2 (type of faces: flat or curved)'}]}
];
// Dino Truck Town toddler activities (OECS Kindergarten Maths 1.1.8/1.2.2 counting; 5.1.1 classify by colour/shape)
window.TODDLER = [
 {id:'count',title:'Count the Vehicles',icon:'🚚',source:'OECS Kindergarten Maths 1.1.8 count with meaning; 1.2.2 how many in a set (count to 10)'},
 {id:'colour',title:'Dino Colours',icon:'🦕',source:'OECS Kindergarten Maths 5.1.1 classify objects by colour'},
 {id:'abc',title:'ABC Explore',icon:'🔤',source:'OECS Kindergarten Language Arts 1.9 phonological awareness (letters of the alphabet); 2.14 identify an increasing number of letter names and letter sounds; 3.5 upper and lower case letters'},
 {id:'findabc',title:'Find the Letter',icon:'🔍',source:'OECS Kindergarten Language Arts 2.14 letter names and sounds'},
 {id:'shape',title:'Dino Shapes',icon:'🦖',source:'OECS Kindergarten Maths 4.2.1 identify shapes; 5.1.1 classify by shape'}
];

// ABC for Dino Truck Town. [letter, spoken name (en-GB, "zed"), spoken sound approximation, word, emoji]
// Sounds are spelled for the device TTS; an isolated phoneme is approximate. Emoji chosen for clear Android (Noto) art.
window.ABC=[
['A','ay','a','ambulance','🚑'],['B','bee','buh','bus','🚌'],['C','see','kuh','car','🚗'],['D','dee','duh','dinosaur','🦕'],
['E','ee','eh','elephant','🐘'],['F','eff','fff','fire truck','🚒'],['G','jee','guh','goat','🐐'],['H','aitch','huh','helicopter','🚁'],
['I','eye','ih','iguana','🦎'],['J','jay','juh','juice','🧃'],['K','kay','kuh','kite','🪁'],['L','ell','lll','lion','🦁'],
['M','em','mmm','motorbike','🏍\uFE0F'],['N','en','nnn','nose','👃'],['O','oh','o','octopus','🐙'],['P','pee','puh','police car','🚓'],
['Q','cue','kwuh','queen','👸'],['R','ar','rrr','rocket','🚀'],['S','ess','sss','snake','🐍'],['T','tee','tuh','tractor','🚜'],
['U','you','uh','umbrella','☂\uFE0F'],['V','vee','vvv','van','🚐'],['W','double you','wuh','whale','🐳'],['X','ex','ks','fox','🦊'],
['Y','why','yuh','yo-yo','🪀'],['Z','zed','zzz','zebra','🦓']];

// ---------- Maths wings added Oct 2026 (OECS Grade 3 Mathematics Learning Standards, MT.3.*) ----------
// Drawing helpers (SVG made in code). Money uses real EC note/coin images (img/money, see README) with drawn fallbacks.
window.ART={
 clock(h,m){const ma=m*6,ha=(h%12)*30+m*0.5;let t='';for(let i=1;i<=12;i++){const a=(i*30-90)*Math.PI/180;t+=`<text x="${80+58*Math.cos(a)}" y="${85+58*Math.sin(a)}" text-anchor="middle" font-size="15" font-weight="700">${i}</text>`;}
  for(let i=0;i<60;i++){const a=i*6*Math.PI/180,r1=i%5?70:66;t+=`<line x1="${80+r1*Math.sin(a)}" y1="${80-r1*Math.cos(a)}" x2="${80+74*Math.sin(a)}" y2="${80-74*Math.cos(a)}" stroke="#333" stroke-width="${i%5?1:2}"/>`;}
  return `<svg class="art clock" viewBox="0 0 160 160" role="img" aria-label="clock"><circle cx="80" cy="80" r="76" fill="#fff" stroke="#6a4cdf" stroke-width="5"/>${t}<line x1="80" y1="80" x2="${80+38*Math.sin(ha*Math.PI/180)}" y2="${80-38*Math.cos(ha*Math.PI/180)}" stroke="#222" stroke-width="7" stroke-linecap="round"/><line x1="80" y1="80" x2="${80+60*Math.sin(ma*Math.PI/180)}" y2="${80-60*Math.cos(ma*Math.PI/180)}" stroke="#e76f51" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="80" r="5" fill="#222"/></svg>`;},
 // Faithful ILLUSTRATIONS of the current ECCB series (not photographs or scans; see README for why).
 // Notes: 2019 polymer series, portrait format, colour and back-design landmark per denomination, tactile shape.
 // Coins: 2002 round family; sizes in proportion to real diameters (10c is the smallest!).
 note(v,o={}){const N={'$5':['#3f9b5a','#cfeedd','falls','circle'],'$10':['#3c6fa8','#d6e6f6','boat','x'],'$20':['#7d4fa0','#eadcf4','nutmeg','rect'],'$50':['#e07b2c','#fde3cc','fort','tri'],'$100':['#8a6a3a','#f0e3c8','pitons','square']}[v];
  const [c,l,pic,tac]=N;const P={falls:'<path d="M18 52 L30 30 L42 52 Z" fill="#6b8f5a"/><rect x="27" y="34" width="6" height="22" fill="#bfe6ff"/><path d="M14 58 Q30 52 46 58" stroke="#bfe6ff" stroke-width="3" fill="none"/>',
   boat:'<path d="M14 54 L46 54 L40 60 L20 60 Z" fill="#7a4b2a"/><path d="M30 26 L30 54 M30 28 L44 50 L30 50 Z" stroke="#333" fill="#fff"/><path d="M8 62 Q30 56 52 62" stroke="#5aa0d8" stroke-width="3" fill="none"/>',
   nutmeg:'<ellipse cx="30" cy="44" rx="13" ry="15" fill="#7a4b2a"/><path d="M22 34 Q30 30 38 36 M20 44 Q30 40 40 46 M22 52 Q30 50 37 55" stroke="#d63b3b" stroke-width="3" fill="none"/>',
   fort:'<path d="M10 58 L20 40 L40 40 L50 58 Z" fill="#6b8f5a"/><rect x="20" y="30" width="20" height="12" fill="#a99a80"/><path d="M20 30 v-4 h4 v4 h4 v-4 h4 v4 h4 v-4 h4 v4" fill="#a99a80"/>',
   pitons:'<path d="M8 60 L22 26 L32 60 Z M28 60 L40 32 L52 60 Z" fill="#4f7a45"/><path d="M6 62 Q30 58 54 62" stroke="#5aa0d8" stroke-width="3" fill="none"/>'}[pic];
  const T={circle:'<circle cx="7" cy="7" r="4" fill="none" stroke="#fff" stroke-width="2"/>',x:'<path d="M3 3 L11 11 M11 3 L3 11" stroke="#fff" stroke-width="2"/>',rect:'<rect x="2" y="4" width="10" height="6" fill="none" stroke="#fff" stroke-width="2"/>',tri:'<path d="M7 2 L12 12 L2 12 Z" fill="none" stroke="#fff" stroke-width="2"/>',square:'<rect x="3" y="3" width="8" height="8" fill="none" stroke="#fff" stroke-width="2"/>'}[tac];
  const lab=o.hide?'?':v;
  return `<g><rect width="60" height="110" rx="5" fill="${l}" stroke="${c}" stroke-width="3"/><rect x="3" y="3" width="54" height="16" fill="${c}"/><text x="30" y="15" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">${lab}</text><g transform="translate(46,4)">${T}</g>
  <g>${P}</g><text x="30" y="84" text-anchor="middle" font-size="${o.hide?22:18}" font-weight="900" fill="${c}">${lab}</text><rect x="3" y="92" width="54" height="15" fill="${c}"/><text x="30" y="102" text-anchor="middle" font-size="6.5" font-weight="700" fill="#fff">PLAY MONEY</text></g>`;},
 coin(v,o={}){const D={'5c':[23.11,'#e4e7ea','palm'],'10c':[18.06,'#c4c8cc','ship'],'25c':[23.98,'#c4c8cc','ship'],'$1':[26.5,'#c4c8cc','ship']}[v];const r=D[0]*1.15,lab=o.hide?'?':v;
  const art=D[2]==='palm'?`<path d="M${-r*.45} ${r*.5} Q0 0 ${r*.35} ${-r*.55} M${r*.45} ${r*.5} Q0 0 ${-r*.35} ${-r*.55}" stroke="#7f8a7a" stroke-width="2" fill="none"/>`:`<path d="M${-r*.4} ${r*.15} L${r*.4} ${r*.15} L${r*.28} ${r*.32} L${-r*.28} ${r*.32} Z" fill="#8a8f94"/><path d="M0 ${-r*.5} L0 ${r*.15} M0 ${-r*.45} L${r*.3} ${r*.05} L0 ${r*.05} Z" stroke="#6d7277" fill="#eef0f2"/>`;
  return `<g><circle r="${r}" fill="${D[1]}" stroke="#7b8187" stroke-width="${v==='$1'?3:2}" ${v==='$1'?'stroke-dasharray="4 3"':''}/><circle r="${r-3}" fill="none" stroke="#9aa0a6"/>${art}<text y="${r*0.62}" text-anchor="middle" font-size="${Math.max(9,r*0.42)}" font-weight="900" fill="#2b2f33">${lab}</text></g>`;},
 // Real images (Daniel's decision, educational use). Shown small; if an image fails, it is removed and the drawing underneath is revealed.
 IMG:{'$5':'note_5_back','$10':'note_10_back','$20':'note_20_back','$50':'note_50_back','$100':'note_100_back','10c':'coin_10c','25c':'coin_25c','$1':'coin_1'},
 _real(it,o,w,h,vb){const f=this.IMG[it];if(!f)return '';
  return `<svg x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" class="real"><image href="img/money/${f}.webp" width="${/c$|^\$1$/.test(it)?240:207}" height="${/c$|^\$1$/.test(it)?240:437}" draggable="false" onerror="var g=this.closest('.mitem');if(g)g.classList.add('fail');this.parentNode.remove();"/></svg>`;},
 money(items,o={}){let x=6,out='',k=0;for(const it of items){const isCoin=/c$|^\$1$/.test(it),has=!!this.IMG[it],lab=o.hide?'?':it;
   if(isCoin){const r=({'5c':23.11,'10c':18.06,'25c':23.98,'$1':26.5}[it])*1.15;
    const real=has?this._real(it,o,2*r*(o.hide?0.62:1),2*r*(o.hide?0.62:1),o.hide?'54 50 132 132':'0 0 240 240'):'';
    out+=`<g class="splash mitem${has?' hasimg':''}" style="animation-delay:${k*0.15}s" transform="translate(${x+r},60)"><g class="fb">${this.coin(it,o)}</g>${has&&o.hide?`<circle r="${r}" fill="#c4c8cc" stroke="#7b8187" stroke-width="2" class="ring"/>`:''}${real}${has?`<text class="vl" y="${r+18}" text-anchor="middle" font-size="14" font-weight="900" fill="#2b2f33">${lab}</text>`:''}</g>`;x+=2*r+10;}
   else{out+=`<g class="splash mitem hasimg" style="animation-delay:${k*0.15}s" transform="translate(${x},5)"><g class="fb">${this.note(it,o)}</g><g transform="translate(30,55)">${this._real(it,o,56,110,o.hide?'0 45 207 250':'0 0 207 437')}</g><text class="vl" x="30" y="127" text-anchor="middle" font-size="15" font-weight="900" fill="#2b2f33">${lab}</text></g>`;x+=70;}k++;}
  x=Math.max(x,90);
  out+=`<text x="${x-3}" y="146" text-anchor="end" font-size="7" fill="#777">Educational use</text>`;
  return `<svg class="art money" viewBox="0 0 ${x} 150" width="${Math.min(x*2.1,720)}" oncontextmenu="return false" role="img" aria-label="${o.hide?'money':'money: '+items.join(', ')}">${out}</svg>`;},
 blocks(h,t,o){let s='',x=6;for(let i=0;i<h;i++){s+=`<rect x="${x}" y="10" width="60" height="60" fill="#6a4cdf" stroke="#fff"/><text x="${x+30}" y="46" text-anchor="middle" fill="#fff" font-size="14">100</text>`;x+=66;}
  for(let i=0;i<t;i++){s+=`<rect x="${x}" y="10" width="12" height="60" fill="#ffb703" stroke="#333"/>`;x+=16;}x+=6;
  for(let i=0;i<o;i++){s+=`<rect x="${x}" y="58" width="12" height="12" fill="#2a9d4a" stroke="#333"/>`;x+=16;}
  return `<svg class="art blocks" viewBox="0 0 ${x+6} 80" width="${Math.min((x+6)*1.5,640)}" role="img" aria-label="${h} hundreds, ${t} tens, ${o} ones">${s}</svg>`;}
};
const _A=window.ART;
window.G3_WINGS.push(
{id:'rhythm',title:'Rhythm Times Tables',subject:'Mathematics',topic:'Skip counting, x2 to x6 and division',icon:'🥁',
 source:'OECS Grade 3 Mathematics Learning Standards, Number Sense MT.3.NS.NP.1, MT.3.NS.OS.5 to OS.7',
 intro:'Counting in steps is like keeping a beat. Tap 🥁 Play the beat to hear the pattern, then find what comes next or solve the problem.',
 questions:[
 {q:'Skip count by 5s: 5, 10, 15, 20, … What comes next?',c:['21','25','30'],a:1,why:'Add 5 each beat: 20 + 5 = 25.',beat:[5,10,15,20],std:'MT.3.NS.NP.1'},
 {q:'Skip count by 2s: 12, 14, 16, … What comes next?',c:['17','18','20'],a:1,why:'Add 2 each beat: 16 + 2 = 18.',beat:[12,14,16],std:'MT.3.NS.NP.1'},
 {q:'Skip count by 25s: 25, 50, 75, … What comes next?',c:['80','100','125'],a:1,why:'75 + 25 = 100.',beat:[25,50,75],std:'MT.3.NS.NP.1'},
 {q:'Skip count by 20s: 20, 40, 60, … What comes next?',c:['70','80','100'],a:1,why:'60 + 20 = 80.',beat:[20,40,60],std:'MT.3.NS.NP.1'},
 {q:'Skip count by 100s: 300, 400, 500, … What comes next?',c:['501','550','600'],a:2,why:'500 + 100 = 600.',beat:[300,400,500],std:'MT.3.NS.NP.1'},
 {q:'The steel pan band stands in 3 rows with 4 players in each row. How many players?',c:['7','12','16'],a:1,why:'3 groups of 4: 3 × 4 = 12.',beat:[4,8,12],std:'MT.3.NS.OS.5'},
 {q:'What is 6 × 5?',c:['11','25','30'],a:2,why:'6 groups of 5: 5, 10, 15, 20, 25, 30. So 6 × 5 = 30.',std:'MT.3.NS.OS.5'},
 {q:'What is 4 × 6?',c:['24','20','10'],a:0,why:'4 groups of 6: 6, 12, 18, 24.',std:'MT.3.NS.OS.5'},
 {q:'What is 2 × 8?',c:['10','16','18'],a:1,why:'Double 8 is 16.',std:'MT.3.NS.OS.5'},
 {q:'18 dancers make 3 equal lines. How many dancers in each line?',c:['6','5','15'],a:0,why:'18 ÷ 3 = 6, because 3 × 6 = 18.',std:'MT.3.NS.OS.5'},
 {q:'24 drumsticks are shared equally among 4 drummers. How many each?',c:['4','6','8'],a:1,why:'24 ÷ 4 = 6, because 4 × 6 = 24.',std:'MT.3.NS.OS.5'},
 {q:'5 × 6 = 30. So 30 ÷ 5 = ?',c:['5','6','25'],a:1,why:'Multiplication and division match: 30 ÷ 5 = 6.',std:'MT.3.NS.OS.5'},
 {q:'A song has 14 beats in each line. How many beats in 3 lines?',c:['17','42','34'],a:1,why:'14 × 3 = 42 (10 × 3 = 30, 4 × 3 = 12, 30 + 12 = 42).',std:'MT.3.NS.OS.6'},
 {q:'What is 23 × 10?',c:['33','203','230'],a:2,why:'Multiplying by 10 moves each digit one place left: 230.',std:'MT.3.NS.OS.6'},
 {q:'What is 4 × 100?',c:['40','400','104'],a:1,why:'4 groups of 100 make 400. Multiplying by 100 moves each digit two places left.',std:'MT.3.NS.OS.6'},
 {q:'17 mangoes are packed in bags of 5. How many full bags, and how many left over?',c:['3 bags, 2 left over','2 bags, 7 left over','4 bags, 0 left over'],a:0,why:'Take away 5s: 17, 12, 7, 2. That is 3 bags with 2 left over.',std:'MT.3.NS.OS.7'},
 {q:'6 + 6 + 6 + 6 is the same as…',c:['4 × 6','6 + 4','6 × 6'],a:0,why:'Four groups of 6 is 4 × 6 = 24.',std:'MT.3.NS.OS.7'}]},
{id:'placevalue',title:'Place Value Potion Lab',subject:'Mathematics',topic:'Numbers to 999: place value, ordering, rounding',icon:'⚗️',
 source:'OECS Grade 3 Mathematics Learning Standards, Number Sense MT.3.NS.UN.1 to UN.5',
 intro:'Every digit has a place: hundreds, tens and ones. Purple squares are hundreds, yellow rods are tens, green cubes are ones.',
 questions:[
 {q:'Which number do these blocks show?',c:['234','324','243'],a:0,why:'2 hundreds, 3 tens and 4 ones make 234.',svg:_A.blocks(2,3,4),std:'MT.3.NS.UN.1'},
 {q:'Which number do these blocks show?',c:['315','351','513'],a:1,why:'3 hundreds, 5 tens and 1 one make 351.',svg:_A.blocks(3,5,1),std:'MT.3.NS.UN.1'},
 {q:'Write four hundred and thirty-six in numbers.',c:['4036','436','463'],a:1,why:'4 hundreds, 3 tens, 6 ones: 436.',std:'MT.3.NS.UN.1'},
 {q:'How do we write 527 in words?',c:['five hundred and twenty-seven','fifty-two seven','five hundred and seventy-two'],a:0,why:'5 hundreds, 2 tens (twenty), 7 ones.',std:'MT.3.NS.UN.1'},
 {q:'What number is 600 + 40 + 2?',c:['6402','642','624'],a:1,why:'6 hundreds, 4 tens, 2 ones make 642.',std:'MT.3.NS.UN.1'},
 {q:'In 683, what is the value of the digit 8?',c:['8','80','800'],a:1,why:'8 is in the tens place, so its value is 80.',std:'MT.3.NS.UN.2'},
 {q:'In 472, what is the face value of the digit 4?',c:['4','40','400'],a:0,why:'Face value is the digit itself: 4. (Its place value is 400.)',std:'MT.3.NS.UN.2'},
 {q:'3 hundreds, 0 tens and 9 ones make…',c:['39','309','390'],a:1,why:'Zero holds the tens place: 309.',std:'MT.3.NS.UN.2'},
 {q:'Which digit is in the tens place of 951?',c:['9','5','1'],a:1,why:'951 = 9 hundreds, 5 tens, 1 one.',std:'MT.3.NS.UN.2'},
 {q:'Which number is greater, 709 or 790?',c:['709','790','they are equal'],a:1,why:'Both have 7 hundreds; 9 tens is more than 0 tens, so 790 is greater.',std:'MT.3.NS.UN.2'},
 {q:'Put these regatta boat numbers in order from smallest to largest: 318, 381, 183.',c:['183, 318, 381','318, 183, 381','381, 318, 183'],a:0,why:'Compare hundreds first: 1 hundred is smallest, then 318 before 381.',std:'MT.3.NS.UN.4'},
 {q:'Which is the largest number: 645, 654 or 564?',c:['645','654','564'],a:1,why:'645 and 654 both have 6 hundreds; 5 tens beats 4 tens, so 654.',std:'MT.3.NS.UN.4'},
 {q:'Round 47 to the nearest ten.',c:['40','50','45'],a:1,why:'47 is closer to 50 than to 40.',std:'MT.3.NS.UN.5'},
 {q:'Round 835 to the nearest ten.',c:['830','840','800'],a:1,why:'A 5 in the ones place rounds up: 840.',std:'MT.3.NS.UN.5'},
 {q:'Round 362 to the nearest hundred.',c:['300','400','360'],a:1,why:'362 is closer to 400 than to 300 (6 tens rounds up).',std:'MT.3.NS.UN.5'},
 {q:'Round 218 to the nearest hundred.',c:['200','300','220'],a:0,why:'218 is closer to 200 (1 ten rounds down).',std:'MT.3.NS.UN.5'}]},
{id:'money',title:'Money Market Beats',subject:'Mathematics',topic:'EC$ coins and notes, totals and change to $50',icon:'💰',
 source:'OECS Grade 3 Mathematics Learning Standards, Units of Measurement MT.3.UM.MW.1 to MW.5 (Eastern Caribbean currency)',
 intro:'Welcome to the Hillsborough market stall! Eastern Caribbean coins: 5c, 10c, 25c and $1. Notes: $5 green, $10 blue, $20 purple, $50 orange and $100 brown. The pictures show real EC money, for learning only.',
 questions:[
 {q:'How much money is this?',c:['55c','65c','75c'],a:1,why:'25c + 25c + 10c + 5c = 65c.',svg:_A.money(['25c','25c','10c','5c']),std:'MT.3.UM.MW.1'},
 {q:'How much money is this?',c:['$35','$30','$25'],a:0,why:'$20 + $10 + $5 = $35.',svg:_A.money(['$20','$10','$5']),std:'MT.3.UM.MW.2'},
 {q:'How much money is this?',c:['$12.25','$11.25','$12.50'],a:0,why:'$10 + $1 + $1 = $12, plus 25c = $12.25.',svg:_A.money(['$10','$1','$1','25c']),std:'MT.3.UM.MW.2'},
 {q:'How do we read $12.50?',c:['twelve dollars and fifty cents','one hundred and twenty-five dollars','twelve dollars and five cents'],a:0,why:'Dollars before the point, cents after: 12 dollars 50 cents.',std:'MT.3.UM.MW.1'},
 {q:'How many 10-cent coins make $1?',c:['5','10','100'],a:1,why:'$1 = 100 cents, and 10 × 10c = 100c.',std:'MT.3.UM.MW.1'},
 {q:'Which coins make exactly $1.00?',c:['four 25c coins','three 25c coins','four 10c coins'],a:0,why:'4 × 25c = 100c = $1.',std:'MT.3.UM.MW.2'},
 {q:'Which notes make $15 using the fewest notes?',c:['a $10 note and a $5 note','three $5 notes','a $20 note'],a:0,why:'$10 + $5 = $15 with just 2 notes.',std:'MT.3.UM.MW.2'},
 {q:'How many $10 notes make $50?',c:['4','5','10'],a:1,why:'5 × $10 = $50.',std:'MT.3.UM.MW.2'},
 {q:'A jar of nutmeg jam costs $8.75 and a bag of cocoa balls costs $6.50. Which costs more?',c:['the nutmeg jam','the cocoa balls','they cost the same'],a:0,why:'$8 is more than $6, so $8.75 is more.',std:'MT.3.UM.MW.3'},
 {q:'A mango costs $2 and a coconut water costs $3. What is the total?',c:['$5','$6','$1'],a:0,why:'$2 + $3 = $5.',std:'MT.3.UM.MW.4'},
 {q:'Fresh fish costs $18 and bread costs $4. What is the total?',c:['$14','$22','$24'],a:1,why:'$18 + $4 = $22.',std:'MT.3.UM.MW.4'},
 {q:'Three bunches of bananas cost $4 each. What is the total?',c:['$7','$12','$16'],a:1,why:'3 × $4 = $12.',std:'MT.3.UM.MW.4'},
 {q:'You pay with a $20 note for goods costing $13. How much change?',c:['$7','$33','$3'],a:0,why:'Count up from $13 to $20: $7.',std:'MT.3.UM.MW.4'},
 {q:'You pay $50 for a straw hat costing $36. How much change?',c:['$24','$14','$16'],a:1,why:'$50 − $36 = $14.',std:'MT.3.UM.MW.4'},
 {q:'You pay $10 for a snack costing $7.50. How much change?',c:['$2.50','$3.50','$2.00'],a:0,why:'$7.50 + $2.50 = $10.',std:'MT.3.UM.MW.4'},
 {q:'You have $25. A toy boat costs $19. How much will be left?',c:['$6','$4','$44'],a:0,why:'$25 − $19 = $6.',std:'MT.3.UM.MW.5'},
 {q:'Which note is this? It is green, and the back shows Trafalgar Falls in Dominica.',c:['$5','$10','$20'],a:0,why:'The $5 note is green, with Trafalgar Falls and Admiral\'s House on the back.',svg:_A.money(['$5'],{hide:true}),std:'MT.3.UM.MW.1'},
 {q:'Which note is this? It is blue, and the back shows a sailing boat in Admiralty Bay, Bequia.',c:['$10','$5','$100'],a:0,why:'The $10 note is blue, with Admiralty Bay and Anguilla\'s Warspite sailing boat.',svg:_A.money(['$10'],{hide:true}),std:'MT.3.UM.MW.1'},
 {q:'Which note is this? It is purple, and the back shows the nutmeg of Grenada.',c:['$20','$50','$10'],a:0,why:'The $20 note is purple and shows Grenada\'s nutmeg and Government House, Montserrat.',svg:_A.money(['$20'],{hide:true}),std:'MT.3.UM.MW.1'},
 {q:'Which note is this? It is orange, and the back shows Brimstone Hill fortress in St Kitts.',c:['$50','$20','$100'],a:0,why:'The $50 note is orange, with Sir Dwight Venner and Brimstone Hill.',svg:_A.money(['$50'],{hide:true}),std:'MT.3.UM.MW.1'},
 {q:'Which note is this? It is brown, and the back shows the Pitons of St Lucia.',c:['$100','$50','$5'],a:0,why:'The $100 note is brown, with Sir Arthur Lewis and the Pitons.',svg:_A.money(['$100'],{hide:true}),std:'MT.3.UM.MW.1'},
 {q:'Which coin is this? It is the smallest coin, with a ship on it.',c:['10c','5c','$1'],a:0,why:'The 10-cent coin is the smallest coin, even smaller than the 5-cent coin!',svg:_A.money(['10c'],{hide:true}),std:'MT.3.UM.MW.1'},
 {q:'Which coin is this? It is light, made of aluminium, with crossed palm branches.',c:['5c','25c','$1'],a:0,why:'The 5-cent coin is light aluminium with crossed palm branches. The others show a ship.',svg:_A.money(['5c'],{hide:true}),std:'MT.3.UM.MW.1'},
 {q:'Which coin is this? It is the biggest and heaviest coin, with a ship on it.',c:['$1','25c','10c'],a:0,why:'The $1 coin is the largest and heaviest EC coin.',svg:_A.money(['$1'],{hide:true}),std:'MT.3.UM.MW.1'},
 {q:'Blind and visually impaired people can feel a raised shape on each note. Which shape is on the $20 note?',c:['a rectangle','a circle','a triangle'],a:0,why:'$5 circle, $10 X, $20 rectangle, $50 triangle, $100 square.',svg:_A.money(['$20']),std:'MT.3.UM.MW.1'}]},
{id:'clock',title:'Clock Disco',subject:'Mathematics',topic:'Time to the quarter hour, past/to, durations',icon:'🕺',
 source:'OECS Grade 3 Mathematics Learning Standards, Units of Measurement MT.3.UM.UT.1 to UT.5',
 intro:'The short black hand shows the hour. The long orange hand shows the minutes. Let\'s dance around the clock!',
 questions:[
 {q:'What time is it?',c:["three o'clock","twelve o'clock","half past three"],a:0,why:"The long hand is on 12 and the short hand on 3: three o'clock (3:00).",svg:_A.clock(3,0),std:'MT.3.UM.UT.2'},
 {q:'What time is it?',c:['half past seven','half past six',"seven o'clock"],a:0,why:'The long hand is on 6 (30 minutes) and the short hand is between 7 and 8: half past seven (7:30).',svg:_A.clock(7,30),std:'MT.3.UM.UT.2'},
 {q:'What time is it?',c:['quarter past four','quarter to four','quarter past three'],a:0,why:'The long hand is on 3 (15 minutes past) and the short hand is just after 4: quarter past four (4:15).',svg:_A.clock(4,15),std:'MT.3.UM.UT.2'},
 {q:'What time is it?',c:['quarter to nine','quarter to eight','quarter past nine'],a:0,why:'The long hand is on 9 (15 minutes to the hour) and the short hand is nearly at 9: quarter to nine (8:45).',svg:_A.clock(8,45),std:'MT.3.UM.UT.2'},
 {q:'What time is it in digits?',c:['10:30','6:50','10:06'],a:0,why:'Half past ten is written 10:30.',svg:_A.clock(10,30),std:'MT.3.UM.UT.2'},
 {q:'How do we write quarter to six in digits?',c:['6:15','5:45','6:45'],a:1,why:'Quarter to six is 15 minutes before 6:00, which is 5:45.',std:'MT.3.UM.UT.2'},
 {q:'How do we write half past two in digits?',c:['2:30','2:50','3:30'],a:0,why:'Half past two is 30 minutes after 2:00: 2:30.',std:'MT.3.UM.UT.2'},
 {q:'At quarter past any hour, the long minute hand points to…',c:['3','6','9'],a:0,why:'15 minutes past is when the minute hand is on 3.',std:'MT.3.UM.UT.3'},
 {q:'At half past any hour, the long minute hand points to…',c:['3','6','12'],a:1,why:'30 minutes is halfway round, at 6.',std:'MT.3.UM.UT.3'},
 {q:'Big Drum practice starts at 4:00 and ends at 5:30. How long is it?',c:['1 hour 30 minutes','30 minutes','5 hours 30 minutes'],a:0,why:'4:00 to 5:00 is 1 hour, then 30 more minutes.',std:'MT.3.UM.UT.4'},
 {q:'A boat trip starts at 9:00 and ends at 10:30. How long is the trip?',c:['1 hour 30 minutes','1 hour','2 hours 30 minutes'],a:0,why:'9:00 to 10:00 is 1 hour, plus 30 minutes.',std:'MT.3.UM.UT.4'},
 {q:'A lesson starts at 10:00 and ends at 10:45. How long is it?',c:['45 minutes','15 minutes','1 hour'],a:0,why:'From 10:00 to 10:45 is 45 minutes.',std:'MT.3.UM.UT.4'},
 {q:'A dance class starts at quarter past three and lasts 30 minutes. When does it end?',c:['quarter to four','half past three','four o\'clock'],a:0,why:'3:15 + 30 minutes = 3:45, which is quarter to four.',std:'MT.3.UM.UT.4'},
 {q:'How many minutes are in one hour?',c:['24','60','100'],a:1,why:'1 hour = 60 minutes.',std:'MT.3.UM.UT.5'},
 {q:'How many days are in one week?',c:['5','7','12'],a:1,why:'1 week = 7 days.',std:'MT.3.UM.UT.5'},
 {q:'How many months are in one year?',c:['12','10','52'],a:0,why:'1 year = 12 months.',std:'MT.3.UM.UT.5'},
 {q:'Regatta fun day is on 1/8/2026 (day/month/year). What is the date?',c:['1 August 2026','8 January 2026','18 June 2026'],a:0,why:'Day first, then month: day 1 of month 8, which is August.',std:'MT.3.UM.UT.1'}]}
);
