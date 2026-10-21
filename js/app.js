// Carriacou Kids Lab - app logic. All data in localStorage key "ckl". No network.
(function(){
const KEY='ckl', $=s=>document.querySelector(s), app=()=>$('#app');
const today=()=>new Date().toISOString().slice(0,10);
let S=load(), cur=null, tick=null;
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(){localStorage.setItem(KEY,JSON.stringify(S));}
S.profiles=S.profiles||[]; S.limit=S.limit||90; save();
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function h(html){app().innerHTML=html;window.scrollTo(0,0);}
function on(sel,fn){document.querySelectorAll(sel).forEach(el=>el.addEventListener('click',e=>{Snd.tap();fn(el,e)}));}
// ---- time tracking ----
function used(p){return (p.time&&p.time[today()])||0;}
function startClock(p){stopClock();tick=setInterval(()=>{if(document.hidden)return;p.time=p.time||{};p.time[today()]=(p.time[today()]||0)+0.25;save();if(used(p)>=S.limit){stopClock();rest(p);}},15000);}
function stopClock(){if(tick)clearInterval(tick);tick=null;}
function rest(p){stopClock();h(`<div class="screen center rest"><div class="big-emoji">${p.world==='dino'?'🦕💤':'🧪🌙'}</div><h1>Time to rest, ${esc(p.name)}!</h1><p>You did great learning today. Your brain and body need a break. Come back tomorrow for more fun!</p><button class="btn" id="hm">🏠 Home</button></div>`);Say.speak(`Time to rest, ${p.name}. You did great today. Come back tomorrow for more fun!`);on('#hm',home);}
// ---- PIN ----
function pinPad(title,cb){let v='';const draw=()=>{h(`<div class="screen center"><h1>${title}</h1><div class="pin-dots">${[0,1,2,3].map(i=>`<span class="${i<v.length?'f':''}"></span>`).join('')}</div><div class="pad">${[1,2,3,4,5,6,7,8,9,'⌫',0,'✖'].map(k=>`<button class="key" data-k="${k}">${k}</button>`).join('')}</div><p class="small" id="msg"></p></div>`);
 on('.key',el=>{const k=el.dataset.k;if(k==='⌫')v=v.slice(0,-1);else if(k==='✖'){return home();}else if(v.length<4)v+=k;draw();if(v.length===4)setTimeout(()=>cb(v,draw,()=>{v='';draw();$('#msg').textContent='Wrong PIN, try again.'}),150);});};draw();}
function setPin(){pinPad('Parent / teacher: choose a 4-digit PIN',p1=>pinPad('Type the same PIN again',p2=>{if(p1===p2){S.pin=p1;save();dash();}else setPin();}));}
function askPin(){pinPad('Parent / teacher PIN',(v,d,bad)=>v===S.pin?dash():bad());}
// ---- Home ----
function home(){stopClock();cur=null;if(!S.pin)return welcome();
 h(`<div class="screen"><header class="top"><h1>🏝️ Carriacou Kids Lab</h1><button class="btn ghost" id="par">🔒 Parent</button></header>
 ${S.profiles.length?'<p class="lead">Who is learning today?</p>':'<p class="lead">No players yet. A parent or teacher can add one in the 🔒 Parent area.</p>'}
 <div class="grid profiles">${S.profiles.map((p,i)=>`<button class="card prof ${p.world}" data-i="${i}"><div class="big-emoji">${p.avatar}</div><div class="pname">${esc(p.name)}</div><div class="small">${p.world==='dino'?'Dino Truck Town':'Mad Scientist Music Lab'}</div></button>`).join('')}</div></div>`);
 on('#par',askPin);on('.prof',el=>openProfile(S.profiles[+el.dataset.i]));}
function welcome(){h(`<div class="screen center"><div class="big-emoji">🧪🦕</div><h1>Welcome to Carriacou Kids Lab</h1><p>Everything stays on this tablet. No accounts, no ads, no internet needed.</p><button class="btn" id="go">Parent / teacher: set up a PIN</button></div>`);on('#go',setPin);}
function openProfile(p){cur=p;if(used(p)>=S.limit)return rest(p);startClock(p);p.world==='dino'?dinoHome(p):labHome(p);}
// ---- Dashboard ----
function dash(){stopClock();const av={lab:['🧑‍🔬','🎧','🎹','🥁','🎻','💃'],dino:['🦕','🦖','🚚','🚒','🚜','🚌']};
 h(`<div class="screen"><header class="top"><h1>🔒 Parent / Teacher</h1><button class="btn ghost" id="out">Done</button></header>
 <section class="panel"><h2>Daily time limit per player</h2><input type="range" id="lim" min="60" max="120" step="5" value="${S.limit}"> <b id="limv">${S.limit} min</b></section>
 <section class="panel"><h2>Add a player</h2><input id="nm" maxlength="16" placeholder="Name or nickname"> <select id="wd"><option value="lab">Mad Scientist Music Lab (Grade 3)</option><option value="dino">Dino Truck Town (toddler)</option></select> <button class="btn" id="add">Add</button></section>
 <section class="panel"><h2>Players and progress</h2>${S.profiles.length?S.profiles.map((p,i)=>`<div class="prow"><div><span class="big">${p.avatar}</span> <b>${esc(p.name)}</b> <span class="small">(${p.world==='dino'?'Dino Truck Town':'Music Lab'}) · today ${Math.round(used(p))} of ${S.limit} min · ⭐ ${p.stars||0}</span>
 <div class="small">${progressText(p)}</div></div><div><button class="btn sm" data-av="${i}">Avatar</button> <button class="btn sm" data-rt="${i}">Reset today's time</button> <button class="btn sm warn" data-del="${i}">Remove</button></div></div>`).join(''):'<p class="small">No players yet.</p>'}</section>
 <section class="panel"><h2>Security</h2><button class="btn sm" id="rp">Reset PIN</button> <span class="small">All data is stored only on this device (localStorage).</span></section></div>`);
 $('#lim').oninput=e=>{S.limit=+e.target.value;$('#limv').textContent=S.limit+' min';save();};
 on('#out',home);on('#rp',setPin);
 on('#add',()=>{const n=$('#nm').value.trim();if(!n)return;const w=$('#wd').value;S.profiles.push({name:n,world:w,avatar:av[w][0],stars:0,prog:{},badges:[],time:{}});save();dash();});
 on('[data-del]',el=>{const p=S.profiles[+el.dataset.del];if(confirm('Remove '+p.name+' and all progress?')){S.profiles.splice(+el.dataset.del,1);save();dash();}});
 on('[data-rt]',el=>{const p=S.profiles[+el.dataset.rt];if(p.time)p.time[today()]=0;save();dash();});
 on('[data-av]',el=>{const p=S.profiles[+el.dataset.av],l=av[p.world];p.avatar=l[(l.indexOf(p.avatar)+1)%l.length];save();dash();});}
function progressText(p){const pr=p.prog||{};const list=p.world==='dino'?TODDLER:G3_WINGS;return list.map(w=>{const r=pr[w.id];return `${w.icon} ${w.title}: ${r?(p.world==='dino'?(r.plays||0)+(r.plays===1?' round':' rounds')+' of 10'+(r.views?`, ${r.views} cards`:'')+(r.seen?`, letters heard ${r.seen.length}/26`:'')+(r.found?`, letters found ${r.found.length}/26 (${r.found.slice().sort().join(' ')})`:''):`last round ${r.rounds&&r.rounds.length?r.rounds[r.rounds.length-1].s+'/'+r.rounds[r.rounds.length-1].of:'-'}, best ${r.best}/10, ${r.plays} round${r.plays===1?'':'s'}`):'not started'}`}).join(' · ')+(p.badges&&p.badges.length?' · Badges: '+p.badges.join(', '):'');}
// ---- Grade 3 lab ----
function labHome(p){h(`<div class="screen lab"><header class="top"><button class="btn ghost" id="bk">🏠</button><h1>${p.avatar} ${esc(p.name)}'s Mad Scientist Music Lab</h1><span class="stars">⭐ ${p.stars||0}</span></header>
 <p class="lead">Pick a lab wing. Each one is a topic from class. Tap 🔊 to hear anything read aloud.</p>
 <div class="grid wings">${G3_WINGS.map((w,i)=>{const r=(p.prog||{})[w.id];return `<button class="card wing" data-i="${i}"><div class="big-emoji">${w.icon}</div><div class="pname">${w.title}</div><div class="small">${w.subject}: ${w.topic}</div><div class="small">${r?'Best '+r.best+'/10'+(r.best>=8?' 🏅':''):'New!'}</div></button>`}).join('')}</div>
 ${p.badges&&p.badges.length?`<p class="badges">🏅 ${p.badges.join(' · ')}</p>`:''}</div>`);
 on('#bk',home);on('.wing',el=>quiz(p,G3_WINGS[+el.dataset.i]));}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const ROUND=10;
function quiz(p,w){let qs=shuffle(w.questions).slice(0,ROUND),i=0,score=0,firstTry=true;
 const show=()=>{const q=qs[i];const order=shuffle(q.c.map((c,k)=>k));
 h(`<div class="screen lab"><header class="top"><button class="btn ghost" id="bk">⬅</button><h1>${w.icon} ${w.title}</h1><span class="stars">Question ${i+1} of ${qs.length} · ⭐ ${score}</span></header>
 ${i===0?`<p class="intro">${w.intro} <button class="btn sm" id="si">🔊</button></p>`:''}
 ${w.map?mapSVG():''}${q.art?shapeSVG(q.art):''}${q.svg||''}
 <div class="qbox"><p class="q">${q.q}</p><button class="btn sm" id="sq">🔊 Read to me</button>${q.beat?' <button class="btn sm" id="bt">🥁 Play the beat</button>':''}</div>
 <div class="choices">${order.map(k=>`<button class="btn choice" data-k="${k}">${esc(q.c[k])}</button>`).join('')}</div><p class="fb" id="fb"></p><p class="src small">Source: ${w.source}${q.std?' · Code '+q.std:''}</p></div>`);
 on('#bk',()=>labHome(p));on('#sq',()=>{const g=[...document.querySelectorAll('svg.money,svg.blocks')].find(e=>e.getAttribute('aria-label')!=='money');Say.speak(q.q+(g?(g.classList.contains('blocks')?' Look at the blocks and count the hundreds, tens and ones.':' The picture shows '+g.getAttribute('aria-label').replace(/^money: /,'')+'.'):'')+' '+q.c.join(', or '));});if($('#si'))on('#si',()=>Say.speak(w.intro));if($('#bt'))on('#bt',()=>{q.beat.forEach((n,k)=>{Snd.tone(k%2?330:220,0.12,'triangle',k*0.5,0.3);Snd.tone(110,0.15,'sine',k*0.5,0.4);});Say.speak(q.beat.join(', ')+', what comes next?',0.8);});
 on('.choice',el=>{const k=+el.dataset.k;if(k===q.a){el.classList.add('ok');if(firstTry)score++;Snd.good();$('#fb').innerHTML='✅ '+q.why;Say.speak('Great thinking! '+q.why);document.querySelectorAll('.choice').forEach(b=>b.disabled=true);setTimeout(()=>{i++;firstTry=true;i<qs.length?show():finish();},2600);}
  else{firstTry=false;el.disabled=true;el.classList.add('no');Snd.soft();$('#fb').textContent='Not quite. Look for the clue and try another one!';}});};
 const finish=()=>{p.prog=p.prog||{};const r=p.prog[w.id]||{best:0,plays:0};r.plays++;r.best=Math.max(r.best,score);r.rounds=(r.rounds||[]).concat([{d:today(),s:score,of:qs.length}]).slice(-30);p.prog[w.id]=r;p.stars=(p.stars||0)+score;p.badges=p.badges||[];let nb='';const bn=w.title.split(' ')[0]+' Master';if(score>=Math.ceil(qs.length*0.8)&&!p.badges.includes(bn)){p.badges.push(bn);nb=bn;}save();
  h(`<div class="screen center lab"><div class="big-emoji">🧪✨🎶</div><h1>Round complete!</h1><p class="score">${score} / ${qs.length}</p><p class="lead">${'⭐'.repeat(score)}${'☆'.repeat(qs.length-score)}</p><p class="lead">${score>=8?'Brilliant experimenting!':score>=5?'Great work, scientist!':'Good effort! Every round makes your brain stronger.'}</p>${nb?`<p class="badge">🏅 New badge: ${nb}</p>`:''}<button class="btn" id="ag">Play again</button> <button class="btn ghost" id="lb">Back to the lab</button></div>`);
  Snd.good();Say.speak(`Round complete! You got ${score} out of ${qs.length} and earned ${score} stars.`+(nb?' New badge: '+nb:''));on('#ag',()=>quiz(p,w));on('#lb',()=>labHome(p));};
 show();}
function mapSVG(){return `<svg class="art map" viewBox="0 0 400 160" role="img" aria-label="Map: Caribbean Sea west, Atlantic Ocean east"><rect width="200" height="160" fill="#5fc4e8"/><rect x="200" width="200" height="160" fill="#2a6fb5"/>
 ${[[190,20],[198,45],[205,70],[210,92],[214,112],[212,128],[206,145]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="#6cbf4b" stroke="#3d7a2a"/>`).join('')}
 <text x="95" y="85" text-anchor="middle" font-size="16" fill="#033">Caribbean Sea</text><text x="95" y="105" text-anchor="middle" font-size="12" fill="#033">WEST ←</text><text x="305" y="85" text-anchor="middle" font-size="16" fill="#fff">Atlantic Ocean</text><text x="305" y="105" text-anchor="middle" font-size="12" fill="#fff">→ EAST</text><text x="230" y="150" font-size="10" fill="#fff">island chain</text></svg>`;}
function shapeSVG(t){const st='fill="#ffd166" stroke="#333" stroke-width="3"';const s={
 cube:`<polygon points="60,50 110,50 110,100 60,100" ${st}/><polygon points="60,50 80,30 130,30 110,50" ${st}/><polygon points="110,50 130,30 130,80 110,100" ${st}/>`,
 cuboid:`<polygon points="40,60 120,60 120,105 40,105" ${st}/><polygon points="40,60 60,40 140,40 120,60" ${st}/><polygon points="120,60 140,40 140,85 120,105" ${st}/>`,
 sphere:`<circle cx="90" cy="70" r="42" ${st}/><ellipse cx="90" cy="70" rx="42" ry="12" fill="none" stroke="#333" stroke-dasharray="4"/>`,
 cylinder:`<rect x="55" y="30" width="70" height="80" ${st}/><ellipse cx="90" cy="110" rx="35" ry="10" ${st}/><ellipse cx="90" cy="30" rx="35" ry="10" ${st}/>`,
 cone:`<polygon points="90,20 55,105 125,105" ${st}/><ellipse cx="90" cy="105" rx="35" ry="10" ${st}/>`,
 pyramid:`<polygon points="90,20 50,100 110,110" ${st}/><polygon points="90,20 110,110 135,95" ${st}/>`}[t]||'';
 return `<svg class="art shape" viewBox="0 0 180 130" role="img" aria-label="${t}">${s}</svg>`;}
// ---- Dino Truck Town (toddler): no reading, no failure ----
const CHEER=['Yay!','Great job!','You did it!','Wonderful!','Roar-some!','Beep beep, hooray!'];
const cheer=()=>CHEER[Math.floor(Math.random()*CHEER.length)];
function dinoHome(p){h(`<div class="screen dino"><header class="top"><button class="btn ghost" id="bk">🏠</button><h1>${p.avatar} Dino Truck Town</h1><span class="stars">⭐ ${p.stars||0}</span></header>
 <div class="grid tod">${TODDLER.map((a,i)=>`<button class="card huge" data-i="${i}" aria-label="${a.title}"><div class="mega">${a.icon}</div></button>`).join('')}</div></div>`);
 Say.speak('Hello '+p.name+'! Tap a picture to play.');on('#bk',home);on('.huge',el=>{const a=TODDLER[+el.dataset.i];RND={id:a.id,done:0};({count:countGame,colour:colourGame,shape:shapeGame,abc:abcExplore,findabc:abcFind})[a.id](p,0);});}
let RND={id:null,done:0};
// Progress strip of 10 dino footprints; filled = done this round.
function strip(){return `<div class="strip" aria-hidden="true">${Array.from({length:10},(_,i)=>`<span class="${i<RND.done?'on':''}">🐾</span>`).join('')}</div>`;}
// Records one finished round of 10 (no scores: toddlers never fail).
function dinoDone(p,id){p.prog=p.prog||{};const r=p.prog[id]||{plays:0};r.plays=(r.plays||0)+1;r.last=today();p.prog[id]=r;p.stars=(p.stars||0)+1;save();}
// Call after each success: short praise, then next item; big party after 10.
function itemDone(p,id,next){RND.done++;if(RND.done>=10){dinoDone(p,id);party(p,()=>{RND.done=0;next();});return;}
 const o=document.createElement('div');o.className='praise';o.innerHTML=`<div class="mega pop">${['🦕','🦖','⭐','🚚','🎉'][RND.done%5]}</div>${strip()}`;document.body.appendChild(o);setTimeout(()=>{o.remove();next();},1100);}
function party(p,next){h(`<div class="screen center dino"><div class="mega dance">🦖🎉🦕</div>${strip()}<div class="score">10!</div><button class="btn huge-btn" id="nx" aria-label="again">▶️</button> <button class="btn huge-btn ghost" id="hm" aria-label="home">🏠</button></div>`);Snd.good();Snd.stomp();Say.speak('Ten! You did ten! '+cheer()+' You are a superstar!');on('#nx',next);on('#hm',()=>dinoHome(p));}
const NUM=['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
// Each round uses ONE vehicle type; names match Android (Noto) emoji art. [emoji, singular, plural]
const VEHICLES=[['🚚','delivery truck','delivery trucks'],['🚛','big truck','big trucks'],['🚒','fire truck','fire trucks'],['🚌','bus','buses'],['🚗','car','cars'],['🚜','tractor','tractors'],['🚑','ambulance','ambulances'],['🚓','police car','police cars'],['🚕','taxi','taxis'],['🏎\uFE0F','race car','race cars']];
const vname=(v,n)=>n===1?v[1]:v[2];
let countBag=[];
function nextCount(r){ // 1-10 from a shuffled bag: each number once per 10 rounds, first round never 1, no repeat across bags
 if(!countBag.length){let b;do{b=shuffle([1,2,3,4,5,6,7,8,9,10]);}while((r===0&&b[0]===1)||b[0]===nextCount.last);countBag=b;}
 return nextCount.last=countBag.shift();}
function countGame(p,r){const n=nextCount(r),v=VEHICLES[(r+Math.floor(Math.random()*VEHICLES.length))%VEHICLES.length];let c=0;
 h(`<div class="screen dino"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp" aria-label="say again">🔊</button></header><div class="trucks${n>5?' many':''}">${Array.from({length:n},(_,i)=>`<button class="truck" data-i="${i}" aria-label="${v[1]}">${v[0]}</button>`).join('')}</div><div class="counter" id="ct"></div><div class="vlabel" id="vl"></div></div>`);
 const prompt=()=>Say.speak(n===1?`Let's count! Tap the ${v[1]}.`:`Let's count the ${v[2]}! Tap the ${v[2]}.`);prompt();on('#bk',()=>dinoHome(p));on('#rp',prompt);
 document.querySelectorAll('.truck').forEach(el=>el.addEventListener('click',()=>{if(el.classList.contains('done'))return Snd.honk();el.classList.add('done');c++;Snd.count(c);$('#ct').textContent=c;$('#vl').textContent=`${c} ${vname(v,c)}`;Say.speak(NUM[c]);if(c===n){setTimeout(()=>{Say.speak(`${NUM[n]} ${vname(v,n)}! ${cheer()}`);Snd.honk();},700);setTimeout(()=>itemDone(p,'count',()=>countGame(p,r+1)),2300);}}));}
const COLS=[['red','#e63946'],['blue','#1d7fd6'],['yellow','#ffd23f'],['green','#2a9d4a']];
function dinoSVG(col,size=150){return `<svg viewBox="0 0 120 100" width="${size}" height="${size*0.83}"><ellipse cx="55" cy="62" rx="38" ry="24" fill="${col}"/><rect x="78" y="22" width="14" height="40" rx="7" fill="${col}"/><ellipse cx="94" cy="22" rx="16" ry="11" fill="${col}"/><circle cx="99" cy="19" r="3" fill="#222"/><rect x="30" y="78" width="11" height="18" rx="4" fill="${col}"/><rect x="62" y="78" width="11" height="18" rx="4" fill="${col}"/><polygon points="17,58 0,70 20,68" fill="${col}"/></svg>`;}
function colourGame(p,r){const pick=shuffle(COLS).slice(0,2+Math.min(r,1)),t=pick[Math.floor(Math.random()*pick.length)];
 h(`<div class="screen dino center"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp">🔊</button></header><div class="target">${dinoSVG(t[1],170)}</div><div class="opts">${pick.map(c=>`<button class="blob" data-c="${c[0]}" style="background:${c[1]}" aria-label="${c[0]}"></button>`).join('')}</div></div>`);
 const prompt=()=>Say.speak(`This dino is ${t[0]}. Can you find ${t[0]}?`);prompt();on('#bk',()=>dinoHome(p));on('#rp',prompt);
 document.querySelectorAll('.blob').forEach(el=>el.addEventListener('click',()=>{if(el.dataset.c===t[0]){Snd.good();Say.speak(`${t[0]}! ${cheer()}`);setTimeout(()=>itemDone(p,'colour',()=>colourGame(p,r+1)),1300);}else{Snd.count(1);el.classList.add('wiggle');Say.speak(`That is ${el.dataset.c}. Let's find ${t[0]}, like the dino!`);document.querySelector(`[data-c="${t[0]}"]`).classList.add('glow');}}));}
const SH={circle:'<circle cx="50" cy="50" r="40"/>',square:'<rect x="12" y="12" width="76" height="76"/>',triangle:'<polygon points="50,8 92,90 8,90"/>'};
function shp(n,col){return `<svg viewBox="0 0 100 100" width="120" height="120" fill="${col}" stroke="#333" stroke-width="4">${SH[n]}</svg>`;}
function shapeGame(p,r){const names=shuffle(Object.keys(SH)),t=names[0];
 h(`<div class="screen dino center"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp">🔊</button></header><div class="target row"><span class="mega">🦖</span>${shp(t,'#ff9f1c')}</div><div class="opts">${shuffle(names).map(n=>`<button class="blob shapeb" data-s="${n}" aria-label="${n}">${shp(n,'#ffd166')}</button>`).join('')}</div></div>`);
 const prompt=()=>Say.speak(`Dino has a ${t}. Find the ${t}!`);prompt();on('#bk',()=>dinoHome(p));on('#rp',prompt);
 document.querySelectorAll('.shapeb').forEach(el=>el.addEventListener('click',()=>{if(el.dataset.s===t){Snd.good();Snd.stomp();Say.speak(`A ${t}! ${cheer()}`);setTimeout(()=>itemDone(p,'shape',()=>shapeGame(p,r+1)),1300);}else{Snd.count(2);el.classList.add('wiggle');Say.speak(`That is a ${el.dataset.s}. Let's find the ${t}!`);document.querySelector(`[data-s="${t}"]`).classList.add('glow');}}));}

// ---- ABC (toddler) ----
const art=L=>L[0]==='X'?`X is in ${L[3]}`:`${L[0]} is for ${L[3]}`;
const sayLetter=L=>L[0]==='X'?`${L[1]}. ${L[1]} says ${L[2]}, at the end of ${L[3]}.`:`${L[1]}. ${L[1]} says ${L[2]}, ${L[2]}, ${L[3]}. ${L[1]} is for ${L[3]}!`;
function abcExplore(p,r){h(`<div class="screen dino"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp">🔊</button></header>
 <div class="abc-grid">${ABC.map((L,i)=>`<button class="abc-key" data-i="${i}" aria-label="${L[0]}"><span class="up">${L[0]}</span><span class="lo">${L[0].toLowerCase()}</span></button>`).join('')}</div></div>`);
 const prompt=()=>Say.speak('Tap a letter to hear it!');prompt();on('#bk',()=>dinoHome(p));on('#rp',prompt);
 document.querySelectorAll('.abc-key').forEach(el=>el.addEventListener('click',()=>RND.done>=10?(dinoDone(p,'abc'),party(p,()=>{RND.done=0;abcCard(p,+el.dataset.i);})):abcCard(p,+el.dataset.i)));}
function abcCard(p,i){const L=ABC[i];p.prog=p.prog||{};const r=p.prog.abc||{plays:0,seen:[]};if(!r.seen.includes(L[0]))r.seen.push(L[0]);r.views=(r.views||0)+1;p.prog.abc=r;RND.id='abc';RND.done=Math.min(10,RND.done+1);save();Snd.count(i%5+1);
 h(`<div class="screen dino center"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp">🔊</button></header>
 <div class="abc-card"><div class="abc-big"><span>${L[0]}</span><span class="lo">${L[0].toLowerCase()}</span></div><div class="mega">${L[4]}</div><div class="vlabel">${art(L)}</div></div>
 <div class="opts"><button class="btn huge-btn ghost" id="pv" aria-label="previous">◀️</button><button class="btn huge-btn ghost" id="nx" aria-label="next">▶️</button></div></div>`);
 const say=()=>Say.speak(sayLetter(L),0.85);say();on('#bk',()=>abcExplore(p));on('#rp',say);on('.abc-big',say);
 const go=j=>RND.done>=10?(dinoDone(p,'abc'),party(p,()=>{RND.done=0;abcCard(p,j);})):abcCard(p,j);on('#pv',()=>go((i+25)%26));on('#nx',()=>go((i+1)%26));}
function abcFind(p,r){const k=r<4?2:3,ch=shuffle(ABC).slice(0,k),t=ch[Math.floor(Math.random()*k)];
 h(`<div class="screen dino center"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp">🔊</button></header>
 <div class="target row"><span class="mega">${t[4]}</span></div><div class="opts">${ch.map(L=>`<button class="abc-choice" data-l="${L[0]}" aria-label="${L[0]}"><span class="up">${L[0]}</span><span class="lo">${L[0].toLowerCase()}</span></button>`).join('')}</div></div>`);
 const prompt=()=>Say.speak(`Find the letter ${t[1]}. ${t[1]}, for ${t[3]}!`,0.85);prompt();on('#bk',()=>dinoHome(p));on('#rp',prompt);
 document.querySelectorAll('.abc-choice').forEach(el=>el.addEventListener('click',()=>{const L=ABC.find(x=>x[0]===el.dataset.l);
  if(L===t){el.classList.add('glow');Snd.good();Say.speak(`${t[1]}! ${cheer()} ${t[1]} is for ${t[3]}.`,0.9);p.prog=p.prog||{};const q=p.prog.findabc||{plays:0,found:[]};q.found=q.found||[];if(!q.found.includes(t[0]))q.found.push(t[0]);p.prog.findabc=q;
   document.querySelectorAll('.abc-choice').forEach(b=>b.disabled=true);setTimeout(()=>itemDone(p,'findabc',()=>abcFind(p,r+1)),2000);}
  else{Snd.count(2);el.classList.add('wiggle');Say.speak(`That is ${L[1]}. Let's find ${t[1]}, ${t[1]} for ${t[3]}!`,0.9);document.querySelector(`[data-l="${t[0]}"]`).classList.add('glow');}}));}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&'speechSynthesis' in window)speechSynthesis.cancel();});
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
window.CKL={S,home};home();
})();
