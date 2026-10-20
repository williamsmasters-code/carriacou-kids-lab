// Lesson data. Each Grade 3 wing: {id,title,topic,subject,icon,source,questions:[{q,c:[choices],a:index,why}]}
// Questions are spoken with the read-aloud button. Keep wording neutral and accurate to the OECS source noted.
window.G3_WINGS = [
{id:'clues',title:'Clue Detective Studio',subject:'English',topic:'Context Clues',icon:'🔎',
 source:'OECS Grade 3 Language Arts, Reading and Viewing SCO 3.21 (use background knowledge and context clues)',
 intro:'Detectives use the other words in a sentence to work out a new word. Read the sentence, then pick the best meaning.',
 questions:[
 {q:'The drummer was so <b>exhausted</b> after the long parade that the drummer fell asleep on the bus. What does exhausted mean?',c:['very tired','very hungry','very happy'],a:0,why:'Falling asleep is the clue: exhausted means very tired.'},
 {q:'The lab was <b>chilly</b>, so we put on our jackets. What does chilly mean?',c:['noisy','a little cold','bright'],a:1,why:'Putting on jackets is the clue: chilly means a little cold.'},
 {q:'The steel pan sounded <b>melodious</b>; everyone smiled at the sweet tune. What does melodious mean?',c:['broken','pleasant to hear','very quiet'],a:1,why:'"Sweet tune" and smiling are clues: melodious means pleasant to hear.'},
 {q:'The boat was <b>tiny</b>, not big like the ferry to Grenada. What does tiny mean?',c:['very small','very fast','very old'],a:0,why:'"Not big" is an opposite clue: tiny means very small.'},
 {q:'Grandma was <b>delighted</b> with the gift and gave everyone a big hug. What does delighted mean?',c:['angry','very pleased','sleepy'],a:1,why:'The big hug is the clue: delighted means very pleased.'},
 {q:'After the storm the yard was a <b>mess</b>: leaves, branches and buckets everywhere. What does mess mean?',c:['untidy state','party','garden'],a:0,why:'The list of things everywhere is an example clue: a mess is an untidy state.'},
 {q:'The scientist was <b>cautious</b> and wore goggles before mixing anything. What does cautious mean?',c:['careless','careful','late'],a:1,why:'Wearing goggles first is the clue: cautious means careful.'},
 {q:'We had to <b>conserve</b> water during the dry season, so we took short showers. What does conserve mean?',c:['waste','save','heat'],a:1,why:'Taking short showers is the clue: conserve means save.'}]},
{id:'water',title:'Sea Sound Deck',subject:'Social Studies',topic:'Water bodies around the Caribbean',icon:'🌊',
 source:'OECS Grade 3 Social Studies, Spatial Thinking: Water Bodies, 3-ST-K-2 and 3-ST-S-2',
 intro:'Our islands sit between two big water bodies. The Caribbean Sea is to the west, and the Atlantic Ocean is to the east.',
 map:true,
 questions:[
 {q:'Which large water body is to the <b>west</b> of the chain of Caribbean islands?',c:['Atlantic Ocean','Caribbean Sea','Pacific Ocean'],a:1,why:'The Caribbean Sea lies to the west of the island chain.'},
 {q:'Which large water body is to the <b>east</b> of the Caribbean islands?',c:['Atlantic Ocean','Caribbean Sea','Indian Ocean'],a:0,why:'The Atlantic Ocean lies to the east of the region.'},
 {q:'On the map, which colour zone is the Atlantic Ocean? (Look at the map labels.)',c:['the right side (east)','the left side (west)','the middle of the island'],a:0,why:'East is to the right on a map, so the Atlantic is on the right.'},
 {q:'Which of these is a water body that flows over land, often found in our hills?',c:['river','mountain','beach'],a:0,why:'Rivers and streams are water bodies that flow over land.'},
 {q:'Which is bigger: an ocean or a stream?',c:['a stream','an ocean','they are the same'],a:1,why:'Oceans are the largest water bodies.'},
 {q:'How do the seas around us keep Caribbean people connected?',c:['People travel and trade by boat','The sea stops all travel','The sea is only for fish'],a:0,why:'Boats, ferries and ships carry people and goods between islands.'},
 {q:'Carriacou is an island. What surrounds an island?',c:['water','desert','snow'],a:0,why:'An island is land with water all around it.'}]},
{id:'weather',title:'Weather Station',subject:'Science',topic:'Weather elements, measuring and method',icon:'🌦️',
 source:'OECS Grade 3 Science, Weather and Climate ELO-1; K1.6 and K1.7 (thermometer, anemometer, rain gauge); science process skills',
 intro:'Weather elements include temperature, wind, rainfall and clouds. Scientists measure them with instruments and test ideas step by step.',
 questions:[
 {q:'Which instrument measures how hot or cold it is (temperature)?',c:['rain gauge','thermometer','anemometer'],a:1,why:'A thermometer measures temperature.'},
 {q:'Which instrument measures wind speed?',c:['anemometer','thermometer','ruler'],a:0,why:'An anemometer has cups that spin faster in stronger wind.'},
 {q:'Which instrument measures the amount of rainfall?',c:['wind vane','rain gauge','thermometer'],a:1,why:'A rain gauge collects rain so we can measure how much fell.'},
 {q:'Which of these is an element of weather?',c:['temperature','homework','music'],a:0,why:'Temperature, wind, rainfall and cloud cover are elements of weather.'},
 {q:'A scientist thinks: "It will rain more on Monday than Tuesday." What is this step called?',c:['prediction','conclusion','measurement'],a:0,why:'Saying what you think will happen before testing is a prediction.'},
 {q:'What should a scientist do right after making a prediction?',c:['test it and observe','give up','change the answer'],a:0,why:'Next you test, observe and record what really happens.'},
 {q:'Our rain gauge showed 5 mm Monday, 12 mm Tuesday, 3 mm Wednesday. Which day had the most rain?',c:['Monday','Tuesday','Wednesday'],a:1,why:'12 mm is the greatest amount, so Tuesday.'},
 {q:'Who depends a lot on good weather forecasts?',c:['fishers and farmers','nobody','only pilots on holiday'],a:0,why:'Fishers, farmers, drivers and pilots all depend on weather forecasts.'}]},
{id:'crops',title:'Crop Garden Greenhouse',subject:'Agriculture (via Science outcomes)',topic:'Crops',icon:'🌱',
 source:'Agriculture is not an OECS Hub subject: grounded in Grade 3 Science, Interdependent Relationships in Ecosystems (plant needs, habitats). Assumption labelled.',
 intro:'Crops are plants that farmers grow for food or to sell. Grenada is famous for nutmeg and cocoa.',
 questions:[
 {q:'What do crop plants need to grow?',c:['sunlight, water, air and soil','only sweets','darkness and no water'],a:0,why:'Plants need sunlight, water, air and nutrients from soil.'},
 {q:'Which spice crop is Grenada famous for?',c:['nutmeg','apples','wheat'],a:0,why:'Grenada is called the Spice Isle, famous for nutmeg.'},
 {q:'Chocolate is made from the beans of which crop?',c:['cocoa','corn','cabbage'],a:0,why:'Cocoa beans are dried and made into chocolate.'},
 {q:'Which part of the plant takes in water from the soil?',c:['roots','flowers','leaves only'],a:0,why:'Roots take in water and nutrients from the soil.'},
 {q:'Which of these is a root crop we eat?',c:['sweet potato','mango','banana'],a:0,why:'We eat the root of the sweet potato plant.'},
 {q:'Bees visit crop flowers. How do they help?',c:['they carry pollen so fruits can form','they eat the roots','they bring rain'],a:0,why:'Bees pollinate flowers, helping fruits and seeds form.'},
 {q:'A long dry season with no rain will most likely make crops…',c:['wilt and grow poorly','grow faster','turn blue'],a:0,why:'Without water, plants wilt and grow poorly.'}]},
{id:'shapes',title:'Shape Synth Lab',subject:'Mathematics',topic:'3D shapes',icon:'🧊',
 source:'OECS Grade 3 Mathematics, Geometry GT ELO 1.1 (SCO 1-3): name and describe solids by faces, edges and vertices',
 intro:'3D shapes are solids. A face is a flat surface, an edge is where two faces meet, and a vertex is a corner.',
 questions:[
 {q:'How many faces does a cube have?',c:['4','6','8'],a:1,why:'A cube has 6 square faces (like a dice).',art:'cube'},
 {q:'How many vertices (corners) does a cube have?',c:['6','8','12'],a:1,why:'A cube has 8 vertices.',art:'cube'},
 {q:'Which 3D shape is like a ball?',c:['sphere','cone','cube'],a:0,why:'A sphere is round all over, like a ball.',art:'sphere'},
 {q:'A tin of milk is shaped like a…',c:['cylinder','pyramid','cube'],a:0,why:'A tin has 2 flat circle faces and a curved surface: a cylinder.',art:'cylinder'},
 {q:'Which 3D shape has 1 flat circle face and 1 vertex (point)?',c:['cone','sphere','cylinder'],a:0,why:'A cone has one circle face and comes to a point.',art:'cone'},
 {q:'A shoebox is shaped like a…',c:['rectangular prism (cuboid)','sphere','cone'],a:0,why:'A shoebox has 6 rectangle faces: a rectangular prism.',art:'cuboid'},
 {q:'How many edges does a cube have?',c:['8','10','12'],a:2,why:'A cube has 12 edges.',art:'cube'},
 {q:'A square-based pyramid has how many faces?',c:['4','5','6'],a:1,why:'1 square base + 4 triangle faces = 5 faces.',art:'pyramid'},
 {q:'Which 3D shape has no edges and no vertices?',c:['sphere','cube','pyramid'],a:0,why:'A sphere has one curved surface, no edges and no vertices.',art:'sphere'}]}
];
// Dino Truck Town toddler activities (OECS Kindergarten Maths 1.1.8/1.2.2 counting; 5.1.1 classify by colour/shape)
window.TODDLER = [
 {id:'count',title:'Count the Trucks',icon:'🚚',source:'OECS Kindergarten Maths 1.1.8 count with meaning; 1.2.2 how many in a set (entry level 1-5)'},
 {id:'colour',title:'Dino Colours',icon:'🦕',source:'OECS Kindergarten Maths 5.1.1 classify objects by colour'},
 {id:'shape',title:'Dino Shapes',icon:'🦖',source:'OECS Kindergarten Maths 4.2.1 identify shapes; 5.1.1 classify by shape'}
];
