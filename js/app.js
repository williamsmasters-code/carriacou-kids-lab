// Carriacou Kids Lab - app logic. All data in localStorage key "ckl". No network.
(function(){
const KEY='ckl', $=s=>document.querySelector(s), app=()=>$('#app');
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}; // device-local date
let S=load(), cur=null, tick=null;
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(){localStorage.setItem(KEY,JSON.stringify(S));}
S.profiles=S.profiles||[]; S.limit=S.limit||90; save();
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function h(html){xsStop();app().innerHTML=html;window.scrollTo(0,0);}
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
 <div class="grid profiles">${S.profiles.map((p,i)=>`<button class="card prof ${p.world}" data-i="${i}"><div class="ava-card">${miniAva(p)}</div><div class="pname">${esc(p.name)}</div><div class="small">🪙 ${p.coins||0}</div><div class="small">${p.world==='dino'?'Dino Truck Town':'Mad Scientist Music Lab · Grade '+gradeOf(p)}</div></button>`).join('')}</div></div>`);
 on('#par',askPin);on('.prof',el=>openProfile(S.profiles[+el.dataset.i]));}
function welcome(){h(`<div class="screen center"><div class="big-emoji">🧪🦕</div><h1>Welcome to Carriacou Kids Lab</h1><p>Everything stays on this tablet. No accounts, no ads, no internet needed.</p><button class="btn" id="go">Parent / teacher: set up a PIN</button></div>`);on('#go',setPin);}
function openProfile(p){cur=p;if(used(p)>=S.limit)return rest(p);startClock(p);p.world==='dino'?dinoHome(p):labHome(p);}
// ---- Dashboard ----
function dash(){stopClock();const av={lab:['🧑‍🔬','🎧','🎹','🥁','🎻','💃'],dino:['🦕','🦖','🚚','🚒','🚜','🚌']};
 h(`<div class="screen"><header class="top"><h1>🔒 Parent / Teacher</h1><button class="btn ghost" id="out">Done</button></header>
 <section class="panel"><h2>Daily time limit per player</h2><input type="range" id="lim" min="60" max="120" step="5" value="${S.limit}"> <b id="limv">${S.limit} min</b></section>
 <section class="panel"><h2>Add a player</h2><input id="nm" maxlength="16" placeholder="Name or nickname"> <select id="wd"><option value="lab">Mad Scientist Music Lab (Grades 1 to 6)</option><option value="dino">Dino Truck Town (toddler)</option></select> <select id="gr" aria-label="grade">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${n===3?'selected':''}>Grade ${n}${BUILT[n]?'':' (coming soon)'}</option>`).join('')}</select> <button class="btn" id="add">Add</button></section>
 <section class="panel"><h2>Players and progress</h2>${S.profiles.length?S.profiles.map((p,i)=>`<div class="prow"><div><span class="big">${p.avatar}</span> <b>${esc(p.name)}</b> <span class="small">(${p.world==='dino'?'Dino Truck Town':'Music Lab'})${p.world==='dino'?'':` <select data-gr="${i}" aria-label="grade">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${n===gradeOf(p)?'selected':''}>Grade ${n}${BUILT[n]?'':' (coming soon)'}</option>`).join('')}</select>`} · today ${Math.round(used(p))} of ${S.limit} min · ⭐ ${p.stars||0}</span>
 <div class="small">${progressText(p)}</div>${dashXS(p,i)}</div><div><button class="btn sm" data-av="${i}">Avatar</button> <button class="btn sm" data-rt="${i}">Reset today's time</button> <button class="btn sm warn" data-del="${i}">Remove</button></div></div>`).join(''):'<p class="small">No players yet.</p>'}</section>
 <section class="panel"><h2>Security</h2><button class="btn sm" id="rp">Reset PIN</button> <span class="small">All data is stored only on this device (localStorage).</span></section></div>`);
 $('#lim').oninput=e=>{S.limit=+e.target.value;$('#limv').textContent=S.limit+' min';save();};
 on('#out',home);$('#wd').onchange=e=>{$('#gr').style.display=e.target.value==='dino'?'none':'';};document.querySelectorAll('[data-gr]').forEach(el=>el.addEventListener('change',()=>{S.profiles[+el.dataset.gr].grade=+el.value;save();dash();}));on('#rp',setPin);dashXSWire();
 on('#add',()=>{const n=$('#nm').value.trim();if(!n)return;const w=$('#wd').value;const np={name:n,world:w,grade:w==='dino'?undefined:+$('#gr').value,avatar:av[w][0],stars:0,prog:{},badges:[],time:{}};xsInit(np);S.profiles.push(np);save();dash();});
 on('[data-del]',el=>{const p=S.profiles[+el.dataset.del];if(confirm('Remove '+p.name+' and all progress?')){S.profiles.splice(+el.dataset.del,1);save();dash();}});
 on('[data-rt]',el=>{const p=S.profiles[+el.dataset.rt];if(p.time)p.time[today()]=0;save();dash();});
 on('[data-av]',el=>{const p=S.profiles[+el.dataset.av],l=av[p.world];p.avatar=l[(l.indexOf(p.avatar)+1)%l.length];save();dash();});}
function progressText(p){const pr=p.prog||{};const list=p.world==='dino'?TODDLER:ALLW().filter(w=>(w.grade||3)===gradeOf(p)||(p.prog||{})[w.id]);return list.map(w=>{const r=pr[w.id];return `${w.icon} ${w.title}: ${r?(p.world==='dino'?(r.plays||0)+(r.plays===1?' round':' rounds')+' of 10'+(r.views?`, ${r.views} cards`:'')+(r.seen?`, letters heard ${r.seen.length}/26`:'')+(r.found?`, letters found ${r.found.length}/26 (${r.found.slice().sort().join(' ')})`:''):`last round ${r.rounds&&r.rounds.length?r.rounds[r.rounds.length-1].s+'/'+r.rounds[r.rounds.length-1].of:'-'}, best ${r.best}/10, ${r.plays} round${r.plays===1?'':'s'}`):'not started'}`}).join(' · ')+(p.badges&&p.badges.length?' · Badges: '+p.badges.join(', '):'');}
// ---- Grade 3 lab ----
function labHome(p,fb){const g=gradeOf(p),own=wingsFor(g),W=fb?wingsFor(fb):own;if(!own.length&&!fb)return comingSoon(p,g);h(`<div class="screen lab"><header class="top"><button class="btn ghost" id="bk">🏠</button><h1>${miniAva(p,'hdr')} ${esc(p.name)}'s Mad Scientist Music Lab <span class="gtag">Grade ${g}</span></h1><span class="stars">⭐ ${p.stars||0} ${coinBadge(p)}</span></header>
 <button class="btn xsbtn" id="xs">🎨 Extracurricular Activities: Style Studio and Prize Store</button>
 ${fb?`<p class="lead">Practice games from Grade ${fb} while Grade ${g} is being built.</p>`:'<p class="lead">Pick a lab wing. Each one is a topic from class. Tap 🔊 to hear anything read aloud.</p>'}
 <div class="grid wings ${(fb||g)<=2?'g1':''}">${W.map((w,i)=>{const r=(p.prog||{})[w.id];return `<button class="card wing" data-i="${i}"><div class="big-emoji">${w.icon}</div><div class="pname">${w.title}</div><div class="small">${w.subject}: ${w.topic}</div><div class="small">${r?'Best '+r.best+'/10'+(r.best>=8?' 🏅':''):'New!'}</div></button>`}).join('')}</div>
 ${p.badges&&p.badges.length?`<p class="badges">🏅 ${p.badges.join(' · ')}</p>`:''}</div>`);
 on('#bk',home);on('#xs',()=>xsOpen(p));on('.wing',el=>quiz(p,W[+el.dataset.i],fb));if((fb||g)<=2)Say.speak('Hello '+p.name+'! Pick a game.');}
function comingSoon(p,g){const f=fallbackGrade(g);h(`<div class="screen center lab"><div class="big-emoji">🧪🚧</div><h1>Grade ${g} games are coming soon!</h1><p class="lead">The lab is still mixing the Grade ${g} experiments. You can practise with Grade ${f} games for now.</p><button class="btn" id="fb">Play Grade ${f} games</button> <button class="btn" id="xs">🎨 Extracurricular</button> <button class="btn ghost" id="bk">🏠 Home</button></div>`);Say.speak(`Grade ${g} games are coming soon! You can practise with Grade ${f} games for now.`);on('#fb',()=>labHome(p,f));on('#xs',()=>xsOpen(p));on('#bk',home);}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const ROUND=10;
// ---- Grades: each big-kid profile has a grade (1-6). Built grades list their wings here. ----
const BUILT={1:()=>window.G1_WINGS||[],2:()=>window.G2_WINGS||[],3:()=>window.G3_WINGS||[],4:()=>window.G4_WINGS||[]};
const gradeOf=p=>p.grade||3;
const wingsFor=g=>BUILT[g]?BUILT[g]():[];
function fallbackGrade(g){const b=Object.keys(BUILT).map(Number);return b.filter(x=>x<g).pop()||b[0];}
const ALLW=()=>[].concat(...Object.keys(BUILT).map(k=>wingsFor(+k)));
function quiz(p,w,fb){const g1=w.grade&&w.grade<=2;const spk=t=>String(t).replace(/×/g,' times ').replace(/−/g,' minus ').replace(/÷/g,' divided by ').replace(/(\d+)c\b/g,'$1 cents');let qs=shuffle(w.gen?w.gen():w.questions).filter((x,k,arr)=>arr.findIndex(y=>y.q===x.q&&(y.svg||'')===(x.svg||'')&&y.c[y.a]===x.c[x.a])===k).slice(0,ROUND),i=0,score=0,firstTry=true;const readQ=q=>spk((q.say||q.q)+' '+(g1?'Is it ':'')+(q.sc||q.c).join(', or ')+'?');
 const show=()=>{const q=qs[i];const order=shuffle(q.c.map((c,k)=>k));
 h(`<div class="screen lab${g1?' g1':''}"><header class="top"><button class="btn ghost" id="bk">⬅</button><h1>${w.icon} ${w.title}</h1><span class="stars">Question ${i+1} of ${qs.length} · ⭐ ${score}</span></header>
 ${i===0?`<p class="intro">${w.intro} <button class="btn sm" id="si">🔊</button></p>`:''}
 ${w.map?mapSVG():''}${q.art?shapeSVG(q.art):''}${q.svg||''}
 <div class="qbox"><p class="q">${q.q}</p><button class="btn sm" id="sq">🔊 Read to me</button>${q.beat?' <button class="btn sm" id="bt">🥁 Play the beat</button>':''}</div>
 <div class="choices">${order.map(k=>`<button class="btn choice" data-k="${k}">${esc(q.c[k])}</button>`).join('')}</div><p class="fb" id="fb"></p><p class="src small">Source: ${w.source}${q.std?' · Code '+q.std:''}</p></div>`);
 on('#bk',()=>labHome(p,fb));if(g1)setTimeout(()=>Say.speak((i===0?w.intro+' ':'')+readQ(q),0.9),250);on('#sq',()=>{if(g1||q.say||q.sc)return Say.speak(readQ(q),0.9);const g=[...document.querySelectorAll('svg.money,svg.blocks')].find(e=>e.getAttribute('aria-label')!=='money');Say.speak(q.q+(g?(g.classList.contains('blocks')?' Look at the blocks and count the hundreds, tens and ones.':' The picture shows '+g.getAttribute('aria-label').replace(/^money: /,'')+'.'):'')+' '+q.c.join(', or '));});if($('#si'))on('#si',()=>Say.speak(w.intro));if($('#bt'))on('#bt',()=>{q.beat.forEach((n,k)=>{Snd.tone(k%2?330:220,0.12,'triangle',k*0.5,0.3);Snd.tone(110,0.15,'sine',k*0.5,0.4);});Say.speak(q.beat.join(', ')+', what comes next?',0.8);});
 on('.choice',el=>{const k=+el.dataset.k;if(k===q.a){el.classList.add('ok');if(firstTry)score++;Snd.good();$('#fb').innerHTML='✅ '+q.why;Say.speak('Great thinking! '+q.why);document.querySelectorAll('.choice').forEach(b=>b.disabled=true);setTimeout(()=>{i++;firstTry=true;i<qs.length?show():finish();},2600);}
  else{firstTry=false;el.disabled=true;el.classList.add('no');Snd.soft();$('#fb').textContent=g1?'Not quite. That is OK! Try another one.':'Not quite. Look for the clue and try another one!';if(g1)Say.speak('Not quite. That is OK! Try another one.');}});};
 const finish=()=>{p.prog=p.prog||{};const r=p.prog[w.id]||{best:0,plays:0};r.plays++;r.best=Math.max(r.best,score);r.rounds=(r.rounds||[]).concat([{d:today(),s:score,of:qs.length}]).slice(-30);p.prog[w.id]=r;p.stars=(p.stars||0)+score;p.badges=p.badges||[];let nb='';const bn=w.badge||w.title.split(' ')[0]+' Master';if(score>=Math.ceil(qs.length*0.8)&&!p.badges.includes(bn)){p.badges.push(bn);nb=bn;}earn(p,score,!!nb);save();
  h(`<div class="screen center lab"><div class="big-emoji">🧪✨🎶</div><h1>Round complete!</h1><p class="score">${score} / ${qs.length}</p><p class="lead">${'⭐'.repeat(score)}${'☆'.repeat(qs.length-score)}</p><p class="lead">${score>=8?'Brilliant experimenting!':score>=5?'Great work, scientist!':'Good effort! Every round makes your brain stronger.'}</p>${nb?`<p class="badge">🏅 New badge: ${nb}</p>`:''}<p class="coins">🪙 +${score} coins · You have ${p.coins} coins</p><button class="btn" id="ag">Play again</button> <button class="btn ghost" id="lb">Back to the lab</button></div>`);
  Snd.good();Say.speak(`Round complete! You got ${score} out of ${qs.length} and earned ${score} stars and ${score} coins.`+(nb?' New badge: '+nb:''));on('#ag',()=>quiz(p,w,fb));on('#lb',()=>labHome(p,fb));};
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
function dinoHome(p){h(`<div class="screen dino"><header class="top"><button class="btn ghost" id="bk">🏠</button><h1>${miniAva(p,'hdr')} Dino Truck Town</h1><span class="stars">⭐ ${p.stars||0} ${coinBadge(p)}</span></header>
 <div class="grid tod">${TODDLER.map((a,i)=>`<button class="card huge" data-i="${i}" aria-label="${a.title}"><div class="mega">${a.icon}</div></button>`).join('')}<button class="card huge xscard" id="xs" aria-label="dress up"><div class="ava-card">${miniAva(p)}</div><div class="mega sm">🎨</div></button></div></div>`);
 Say.speak('Hello '+p.name+'! Tap a picture to play.');on('#bk',home);on('#xs',()=>xsOpen(p));on('.huge:not(#xs)',el=>{const a=TODDLER[+el.dataset.i];RND={id:a.id,done:0};({count:countGame,colour:colourGame,shape:shapeGame,abc:abcExplore,findabc:abcFind})[a.id](p,0);});}
let RND={id:null,done:0};
// Progress strip of 10 dino footprints; filled = done this round.
function strip(){return `<div class="strip" aria-hidden="true">${Array.from({length:10},(_,i)=>`<span class="${i<RND.done?'on':''}">🐾</span>`).join('')}</div>`;}
// Records one finished round of 10 (no scores: toddlers never fail).
function dinoDone(p,id){p.prog=p.prog||{};const r=p.prog[id]||{plays:0};r.plays=(r.plays||0)+1;r.last=today();p.prog[id]=r;p.stars=(p.stars||0)+1;earn(p,DINO_ROUND_COINS);save();}
// Call after each success: short praise, then next item; big party after 10.
function itemDone(p,id,next){RND.done++;if(RND.done>=10){dinoDone(p,id);party(p,()=>{RND.done=0;next();});return;}
 const o=document.createElement('div');o.className='praise';o.innerHTML=`<div class="mega pop">${['🦕','🦖','⭐','🚚','🎉'][RND.done%5]}</div>${strip()}`;document.body.appendChild(o);setTimeout(()=>{o.remove();next();},1100);}
function party(p,next){h(`<div class="screen center dino"><div class="mega dance">🦖🎉🦕</div>${strip()}<div class="score">10!</div><div class="coins big">🪙 +${DINO_ROUND_COINS}</div><button class="btn huge-btn" id="nx" aria-label="again">▶️</button> <button class="btn huge-btn ghost" id="hm" aria-label="home">🏠</button></div>`);Snd.good();Snd.stomp();Say.speak('Ten! You did ten! '+cheer()+' You are a superstar!');on('#nx',next);on('#hm',()=>dinoHome(p));}
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
// ---- Extracurricular Activities: coins, Style Studio (avatar customizer), Prize Store, seasonal events, access control ----
const DINO_ROUND_COINS=5; // a finished toddler round of 10 = 5 coins; Music Lab: 1 star = 1 coin
const FREE=id=>AVA.ITEMS[id]&&AVA.ITEMS[id].price===0&&!AVA.ITEMS[id].ev;
function xsInit(p){ // migrate older profiles: coins for past progress, starter look, access defaults
 if(!p.coinsMigrated){p.coins=(p.coins||0)+(p.world==='dino'?(p.stars||0)*DINO_ROUND_COINS:(p.stars||0));p.coinsMigrated=1;
  p.rt=p.rt||{};if(p.world!=='dino'){let n=0;for(const k in (p.prog||{}))(p.prog[k].rounds||[]).forEach(r=>{if(r.d===today())n++;});if(n)p.rt[today()]=n;}}
 if(p.world!=='dino'&&!p.grade)p.grade=3;p.owned=p.owned||[];p.rt=p.rt||{};p.bt=p.bt||{};p.xsUsed=p.xsUsed||{};
 p.look=p.look||{skin:AVA.SKINS[3][1],body:'medium',hair:p.world==='dino'?'r_curly':'r_crop',chest:p.world==='dino'?'c_yellow':'c_white',legs:'l_blue',feet:'s_white',head:'',face:''};
 p.xs=Object.assign({parent:true,mile:true,rounds:2,badge:true,mins:15},p.xs||{});}
S.profiles.forEach(xsInit);save();
const owns=(p,id)=>FREE(id)||(p.owned||[]).includes(id);
function earn(p,c,badge){xsInit(p);p.coins=(p.coins||0)+c;p.rt[today()]=(p.rt[today()]||0)+1;if(badge)p.bt[today()]=(p.bt[today()]||0)+1;}
function coinBadge(p){return `<span class="coinbal" aria-label="coins">🪙 ${p.coins||0}</span>`;}
function miniAva(p,cls){return p.look?AVA.svg(p.look,{view:'head',cls:'mini '+(cls||'')}):`<span class="big-emoji">${p.avatar}</span>`;}
function activeEvents(){return (window.EVENTS||[]).filter(e=>eventActive(e,new Date()));}
let xsTimer=null;function xsStop(){if(xsTimer)clearInterval(xsTimer);xsTimer=null;}
function milestoneInfo(p){const x=p.xs,r=p.rt[today()]||0,b=x.badge?(p.bt[today()]||0):0,earned=Math.floor(r/x.rounds)+b,used=p.xsUsed[today()]||0;return {earned,used,left:earned>used?0:x.rounds-(r%x.rounds)};}
function xsUnlock(p){p.xsUntil=Date.now()+p.xs.mins*60000;save();}
function xsOpen(p){xsInit(p);const tod=p.world==='dino';
 if((p.xsUntil||0)>Date.now())return studio(p);
 if(p.xs.mile){const m=milestoneInfo(p);if(m.earned>m.used){p.xsUsed[today()]=m.used+1;xsUnlock(p);Snd.good();Say.speak(tod?`Hooray! Dress up time! ${p.xs.mins} minutes.`:`You unlocked Extracurricular time for ${p.xs.mins} minutes. Have fun!`);return studio(p);}}
 const m=milestoneInfo(p),back=()=>tod?dinoHome(p):labHome(p);
 h(`<div class="screen center ${tod?'dino':'lab'}"><div class="xs-lock">${miniAva(p,'big')}</div><h1>${tod?'🎨 🔒':'🎨 Extracurricular Activities'}</h1>
 ${p.xs.mile?`<p class="lead">${tod?`${'🐾'.repeat(Math.max(1,m.left))}`:`Finish ${m.left} more round${m.left===1?'':'s'} today${p.xs.badge?' or earn a new badge':''} to unlock ${p.xs.mins} minutes of dress-up time.`}</p>`:''}
 ${!p.xs.mile&&!p.xs.parent?'<p class="lead">Ask a grown-up to turn this on in the Parent area.</p>':''}
 <div>${p.xs.parent?'<button class="btn" id="pu">🔒 Grown-up unlock</button> ':''}<button class="btn ghost huge-btn" id="bk" aria-label="back">⬅</button></div></div>`);
 Say.speak(p.xs.mile?(tod?`Play ${m.left} more ${m.left===1?'game':'games'} to unlock dress up!`:`Finish ${m.left} more round${m.left===1?'':'s'} today to unlock dress-up time.`):'Ask a grown-up to unlock dress up time.');
 on('#bk',back);if(p.xs.parent)on('#pu',()=>pinPad('Grown-up: type the PIN to unlock '+p.xs.mins+' minutes',(v,d,bad)=>{if(v===S.pin){xsUnlock(p);startClock(p);studio(p);}else bad();}));}
let ST={slot:'head',mode:'mine',try:null};
function studio(p){xsInit(p);if((p.xsUntil||0)<=Date.now())return timeUp(p);const tod=p.world==='dino',evs=activeEvents();
 const look=Object.assign({},p.look);if(ST.try)look[AVA.ITEMS[ST.try].slot]=ST.try;
 const tabs=AVA.SLOTS.map(([s,n,i])=>`<button class="tab ${ST.slot===s?'on':''}" data-s="${s}" aria-label="${n}"><span>${i}</span>${tod?'':n}</button>`).join('')+`<button class="tab ${ST.slot==='body'?'on':''}" data-s="body" aria-label="skin and body"><span>🎨</span>${tod?'':'Skin & body'}</button>`;
 let tiles='';
 if(ST.slot==='body'){tiles=AVA.SKINS.map(([n,c])=>`<button class="tile skin ${p.look.skin===c?'eq':''}" data-skin="${c}" aria-label="${n}"><span class="dot" style="background:${c}"></span>${tod?'':`<span class="tn">${n}</span>`}</button>`).join('')+AVA.BODIES.map(([b,n])=>`<button class="tile ${p.look.body===b?'eq':''}" data-body="${b}" aria-label="${n}">${AVA.svg(Object.assign({},p.look,{body:b}),{view:'chest'})}${tod?'':`<span class="tn">${n}</span>`}</button>`).join('');}
 else{let list=Object.values(AVA.ITEMS).filter(it=>it.slot===ST.slot);
  if(ST.mode==='mine')list=list.filter(it=>owns(p,it.id));else list=list.filter(it=>!it.ev||evs.some(e=>e.id===it.ev)).sort((a,b)=>(b.ev?1:0)-(a.ev?1:0)||a.price-b.price);
  tiles=list.map(it=>{const own=owns(p,it.id),eq=p.look[it.slot]===it.id;return `<button class="tile ${eq?'eq':''} ${ST.try===it.id?'sel':''} ${it.ev?'ev':''}" data-id="${it.id}" aria-label="${esc(it.name)}">${AVA.svg(Object.assign({},p.look,{[it.slot]:it.id}),{view:it.slot})}<span class="tn">${tod?'':esc(it.name)}</span><span class="tp">${eq?'✅':own?'✔️':'🪙 '+it.price}</span>${it.ev?'<span class="evr">'+(it.ev==='halloween'?'🎃':it.ev==='christmas'?'🎄':'⭐')+'</span>':''}</button>`;}).join('')||`<p class="lead">${ST.mode==='mine'?(tod?'🛍️ ➡️':'Nothing here yet. Visit the Prize Store!'):'All gone!'}</p>`;}
 const it=ST.try&&AVA.ITEMS[ST.try],can=it&&(p.coins||0)>=it.price;
 h(`<div class="screen studio ${tod?'dino tod':'lab'}"><header class="top"><button class="btn ghost" id="bk" aria-label="back">⬅</button><h1>🎨 ${tod?'':'Extracurricular: '}${esc(p.name)}'s Style Studio</h1><span class="stars">${coinBadge(p)} <span class="timer" id="tm">⏳</span></span></header>
 <div class="st-wrap"><div class="st-prev">${AVA.svg(look,{label:'my avatar'})}</div>
 <div class="st-side"><div class="modes"><button class="btn ${ST.mode==='mine'?'':'ghost'}" id="mm" aria-label="my things">👕 ${tod?'':'My things'}</button><button class="btn ${ST.mode==='store'?'':'ghost'}" id="ms" aria-label="prize store">🛍️ ${tod?'':'Prize Store'}</button></div>
 ${ST.mode==='store'&&ST.slot!=='body'?evs.map(e=>`<div class="evbanner" style="background:${e.colour}">${e.banner}</div>`).join(''):''}
 <div class="tabs">${tabs}</div><div class="tiles">${tiles}</div></div></div>
 ${it&&!owns(p,it.id)?`<div class="buybar"><div class="bb-name">${esc(it.name)}</div>${can?`<button class="btn buy" id="buy" aria-label="get it">🪙 ${it.price} ${tod?'✅':'Get it!'}</button>`:`<span class="lead">${tod?'🪙 ➕':`You need ${it.price-(p.coins||0)} more coins. Keep playing to earn more!`}</span>`}<button class="btn ghost" id="nt" aria-label="no thanks">${tod?'✖':'No thanks'}</button></div>`:''}
 <p class="small">Coins are earned by playing. No real money is used.</p></div>`);
 const tick=()=>{const s=Math.max(0,Math.round(((p.xsUntil||0)-Date.now())/1000));const el=$('#tm');if(el)el.textContent=`⏳ ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;if(s<=0){xsStop();timeUp(p);}};
 tick();xsTimer=setInterval(tick,1000);
 on('#bk',()=>{ST.try=null;tod?dinoHome(p):labHome(p);});
 on('#mm',()=>{ST.mode='mine';ST.try=null;Say.speak('My things');studio(p);});on('#ms',()=>{ST.mode='store';ST.try=null;Say.speak(evs.length?'Prize store. '+evs.map(e=>e.name).join(' and ')+' things are here!':'Prize store');studio(p);});
 on('.tab',el=>{ST.slot=el.dataset.s;ST.try=null;const t=AVA.SLOTS.find(x=>x[0]===ST.slot);Say.speak(t?t[1]:'Skin and body');studio(p);});
 on('[data-skin]',el=>{p.look.skin=el.dataset.skin;save();Say.speak(el.getAttribute('aria-label'));studio(p);});
 on('[data-body]',el=>{p.look.body=el.dataset.body;save();Say.speak(el.getAttribute('aria-label'));studio(p);});
 on('.tile[data-id]',el=>{const i=AVA.ITEMS[el.dataset.id];
  if(owns(p,i.id)){ST.try=null;if(p.look[i.slot]===i.id){p.look[i.slot]='';Say.speak('Took off the '+i.name);}else{p.look[i.slot]=i.id;Say.speak(i.name);}save();return studio(p);}
  ST.try=i.id;Say.speak(`${i.name}. ${i.price} coins.`+((p.coins||0)>=i.price?(tod?'':' Tap the big green button to get it.'):(tod?'':' Keep playing to earn more coins.')));studio(p);});
 on('#nt',()=>{ST.try=null;studio(p);});
 on('#buy',()=>{const i=AVA.ITEMS[ST.try];if(!i||(p.coins||0)<i.price)return;p.coins-=i.price;p.owned.push(i.id);p.look[i.slot]=i.id;ST.try=null;save();Snd.good();Say.speak(`You got the ${i.name}!`);studio(p);});}
function timeUp(p){xsStop();ST.try=null;const tod=p.world==='dino';
 h(`<div class="screen center ${tod?'dino':'lab'}"><div class="xs-lock">${miniAva(p,'big')}</div><h1>${tod?'⏳ 👋':'Dress-up time is finished for now'}</h1><p class="lead">${tod?'':'Your look is saved. Great styling! Let’s go back and play.'}</p><button class="btn huge-btn" id="bk" aria-label="back to games">${tod?'🦕':'⬅ Back to the lab'}</button></div>`);
 Say.speak('Dress up time is finished for now. Your look is saved. Great styling!');on('#bk',()=>tod?dinoHome(p):labHome(p));}
function dashXS(p,i){xsInit(p);const x=p.xs,owned=(p.owned||[]).length;
 return `<div class="xsrow small">🎨 Extracurricular: <b>🪙 ${p.coins||0}</b> coins · ${owned} item${owned===1?'':'s'} bought · <button class="btn sm" data-cp="${i}">+10 🪙</button> <button class="btn sm" data-cm="${i}">−10 🪙</button>
 <br>Access: <label><input type="checkbox" data-xp="${i}" ${x.parent?'checked':''}> Parent unlock (PIN)</label> · <label><input type="checkbox" data-xm="${i}" ${x.mile?'checked':''}> Milestone unlock: every</label> <select data-xr="${i}">${[1,2,3,4,5].map(n=>`<option ${n===x.rounds?'selected':''}>${n}</option>`).join('')}</select> rounds today <label><input type="checkbox" data-xb="${i}" ${x.badge?'checked':''}> or a new badge</label> · unlocks <select data-xt="${i}">${[5,10,15,20,30].map(n=>`<option ${n===x.mins?'selected':''}>${n}</option>`).join('')}</select> min
 ${(p.xsUntil||0)>Date.now()?` · <b>Open now</b> <button class="btn sm" data-xl="${i}">Lock now</button>`:''}</div>`;}
function dashXSWire(){const P=el=>S.profiles[+Object.values(el.dataset)[0]];
 on('[data-cp]',el=>{const p=P(el);p.coins=(p.coins||0)+10;save();dash();});on('[data-cm]',el=>{const p=P(el);p.coins=Math.max(0,(p.coins||0)-10);save();dash();});
 on('[data-xl]',el=>{P(el).xsUntil=0;save();dash();});
 document.querySelectorAll('[data-xp],[data-xm],[data-xb],[data-xr],[data-xt]').forEach(el=>el.addEventListener('change',()=>{const p=P(el),x=p.xs,d=el.dataset;
  if('xp' in d)x.parent=el.checked;if('xm' in d)x.mile=el.checked;if('xb' in d)x.badge=el.checked;if('xr' in d)x.rounds=+el.value;if('xt' in d)x.mins=+el.value;save();}));}
window.CKL={S,home,xsOpen,studio,timeUp};home();
})();
