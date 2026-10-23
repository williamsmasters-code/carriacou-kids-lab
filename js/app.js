// Carriacou Kids Lab - app logic. All data in localStorage key "ckl". No network.
(function(){
const KEY='ckl', $=s=>document.querySelector(s), app=()=>$('#app');
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}; // device-local date
let S=load(), cur=null, tick=null;
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(){localStorage.setItem(KEY,JSON.stringify(S));}
S.profiles=S.profiles||[]; S.limit=S.limit||90; save();
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function h(html){xsStop();if(window.PARK)PARK.stop();LES=/class="screen [^"]*\bles\b/.test(html);app().innerHTML=html;window.scrollTo(0,0);}
function on(sel,fn){document.querySelectorAll(sel).forEach(el=>el.addEventListener('click',e=>{Snd.tap();fn(el,e)}));}
// ---- time tracking ----

// ---- Learn, then play (ckl-v20). Per child, per day: every `les` minutes of active lesson-game time earns `fun` minutes
// in the fun area (Extracurricular: Style Studio and Block Park). Unused fun minutes and part-done lesson minutes are kept
// until midnight; everything starts again the next day. A screen counts as lesson time only while the child is touching
// or typing (no input for more than 60 seconds pauses it). All time still counts toward the daily limit.
let lesTick=null,LES=false,lastAct=Date.now(),funT=0,funWarned=false;
const IDLE_MS=60000;
['pointerdown','keydown','touchstart'].forEach(t=>addEventListener(t,()=>{lastAct=Date.now();},{passive:true,capture:true}));
function funDay(p){const d=today();if(!p.fun||p.fun.d!==d)p.fun={d,les:0,used:0};return p.fun;}
function funCfg(p){const x=p.xs||{};return{les:x.lesMin||20,fun:x.funMin||10};}
function funInfo(p){const f=funDay(p),c=funCfg(p),L=c.les*60,F=c.fun*60,earned=Math.floor(f.les/L)*F;
 return{earned,used:Math.min(f.used,earned),left:Math.max(0,earned-f.used),prog:f.les%L,L,F,c,les:f.les};}
const overrideLeft=p=>Math.max(0,((p.xsUntil||0)-Date.now())/1000);
function funLeft(p){return Math.max(overrideLeft(p),funInfo(p).left);}
function lessonSecond(p){if(!LES||document.hidden||Date.now()-lastAct>IDLE_MS||cur!==p)return;const f=funDay(p),b=funInfo(p).earned;f.les++;
 if(funInfo(p).earned>b){funBanner(p);save();}else if(f.les%10===0)save();
 const m=document.getElementById('funmeter');if(m)m.outerHTML=funMeter(p);}
function funBanner(p){const tod=p.world==='dino',c=funCfg(p);const d=document.createElement('div');d.className='funpop';d.textContent=tod?'🎉 🎨 🧱':`🎉 You earned ${c.fun} minutes of fun!`;document.body.appendChild(d);setTimeout(()=>d.remove(),4500);Snd.tone(784,.2,'sine',0,.08);}
function mmss(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function funMeter(p){const i=funInfo(p),tod=p.world==='dino',pc=Math.round(100*i.prog/i.L),lm=Math.floor(i.prog/60),ov=overrideLeft(p);
 if(tod)return `<div class="funmeter tod" id="funmeter" aria-label="fun meter">${i.left>0||ov>0?'🎉':'📚'}<div class="fmbar"><i style="width:${i.left>0?100:pc}%"></i></div>${i.left>0||ov>0?'🎨🧱':'⭐'}</div>`;
 return `<div class="funmeter" id="funmeter">${i.left>0||ov>0?`🎉 <b>${mmss(Math.max(i.left,ov))}</b> of fun time ready! Tap Style Studio or Block Park.`:`📚 <b>${lm} of ${i.c.les}</b> lesson minutes, then ${i.c.fun} minutes of fun`}<div class="fmbar"><i style="width:${i.left>0||ov>0?100:pc}%"></i></div></div>`;}
// called every second (and on every re-render) while a fun screen is open: uses up earned fun time, warns at 1 minute
function funTick(p){const now=Date.now(),dt=funT&&now-funT<3000?(now-funT)/1000:0;funT=now;
 if(overrideLeft(p)<=0&&dt){const f=funDay(p);f.used=Math.min(f.used+dt,funInfo(p).earned);if(Math.floor(f.used)%10===0)save();}
 const s=funLeft(p);if(s<=60&&s>0&&!funWarned){funWarned=true;Say.speak(p.world==='dino'?'One more minute of fun!':'One more minute of fun time, then back to learning.');}
 return s;}
function funEnter(){funT=Date.now();funWarned=false;}
function used(p){return (p.time&&p.time[today()])||0;}
function startClock(p){stopClock();lesTick=setInterval(()=>lessonSecond(p),1000);tick=setInterval(()=>{if(document.hidden)return;p.time=p.time||{};p.time[today()]=(p.time[today()]||0)+0.25;save();if(used(p)>=S.limit){stopClock();rest(p);}},15000);}
function stopClock(){if(tick)clearInterval(tick);tick=null;if(lesTick)clearInterval(lesTick);lesTick=null;}
function rest(p){stopClock();h(`<div class="screen center rest"><div class="big-emoji">${p.world==='dino'?'🦕💤':'🧪🌙'}</div><h1>Time to rest, ${esc(p.name)}!</h1><p>You did great learning today. Your brain and body need a break. Come back tomorrow for more fun!</p><button class="btn" id="hm">🏠 Home</button></div>`);Say.speak(`Time to rest, ${p.name}. You did great today. Come back tomorrow for more fun!`);on('#hm',home);}
// ---- PIN ----
function pinPad(title,cb){let v='';const draw=()=>{h(`<div class="screen center"><h1>${title}</h1><div class="pin-dots">${[0,1,2,3].map(i=>`<span class="${i<v.length?'f':''}"></span>`).join('')}</div><div class="pad">${[1,2,3,4,5,6,7,8,9,'⌫',0,'✖'].map(k=>`<button class="key" data-k="${k}">${k}</button>`).join('')}</div><p class="small" id="msg"></p></div>`);
 on('.key',el=>{const k=el.dataset.k;if(k==='⌫')v=v.slice(0,-1);else if(k==='✖'){return home();}else if(v.length<4)v+=k;draw();if(v.length===4)setTimeout(()=>cb(v,draw,()=>{v='';draw();$('#msg').textContent='Wrong PIN, try again.'}),150);});};draw();}
function setPin(){pinPad('Parent / teacher: choose a 4-digit PIN',p1=>pinPad('Type the same PIN again',p2=>{if(p1===p2){S.pin=p1;save();dash();}else setPin();}));}
function askPin(){pinPad('Parent / teacher PIN',(v,d,bad)=>v===S.pin?dash():bad());}
// ---- Home ----
function home(){stopClock();cur=null;if(!S.pin)return welcome();
 h(`<div class="screen"><header class="top"><h1>🏝️ Carriacou Kids Lab</h1><button class="btn ghost" id="par">🔒 Parent</button></header>${instBtn()}
 ${S.profiles.length?'<p class="lead">Who is learning today?</p>':'<p class="lead">No players yet. A parent or teacher can add one in the 🔒 Parent area.</p>'}
 <div class="grid profiles">${S.profiles.map((p,i)=>`<button class="card prof ${p.world}" data-i="${i}"><div class="ava-card">${miniAva(p)}</div><div class="pname">${esc(p.name)}</div><div class="small">🪙 ${p.coins||0}</div><div class="small">${p.world==='dino'?'Dino Truck Town':'Mad Scientist Music Lab · Grade '+gradeOf(p)}</div></button>`).join('')}</div></div>`);
 on('#par',askPin);instWire();on('.prof',el=>openProfile(S.profiles[+el.dataset.i]));}

// ---- Add to Home Screen (ckl-v19). Uses the browser's own install prompt when it offers one; otherwise shows menu steps. ----
let instEvt=null;
const isInstalled=()=>(window.matchMedia&&(matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||matchMedia('(display-mode: minimal-ui)').matches))||navigator.standalone===true||localStorage.getItem('ckl_installed')==='1';
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();instEvt=e;localStorage.removeItem('ckl_installed');document.querySelectorAll('.inst').forEach(b=>b.dataset.ready='1');});
window.addEventListener('appinstalled',()=>{instEvt=null;localStorage.setItem('ckl_installed','1');document.querySelectorAll('.instwrap').forEach(b=>b.remove());});
function instBtn(){return isInstalled()?'':`<div class="instwrap"><button class="btn inst" id="inst" ${instEvt?'data-ready="1"':''}>📲 Add Kids Lab to the Home Screen</button><div class="insthelp" id="insthelp" hidden></div></div>`;}
function instWire(){const b=document.getElementById('inst');if(!b)return;b.onclick=async()=>{
 if(instEvt){const e=instEvt;instEvt=null;try{e.prompt();const r=await e.userChoice;if(r&&r.outcome==='accepted'){localStorage.setItem('ckl_installed','1');document.querySelectorAll('.instwrap').forEach(x=>x.remove());}}catch(_){}return;}
 const hp=document.getElementById('insthelp');hp.hidden=!hp.hidden;hp.innerHTML=`<b>Add it from the browser menu:</b><ul>
 <li><b>Chrome (Android):</b> tap the ⋮ menu at the top right, then <b>Add to Home screen</b> or <b>Install app</b>.</li>
 <li><b>Samsung Internet:</b> tap the ☰ menu at the bottom, then <b>Add page to</b> → <b>Home screen</b>.</li>
 <li><b>iPad or iPhone (Safari):</b> tap the Share button (square with an arrow), then <b>Add to Home Screen</b>.</li></ul>
 <p class="small">After that, open Kids Lab from its icon. It works with no internet.</p>`;};}
function welcome(){h(`<div class="screen center"><div class="big-emoji">🧪🦕</div><h1>Welcome to Carriacou Kids Lab</h1><p>Everything stays on this tablet. No accounts, no ads, no internet needed.</p><button class="btn" id="go">Parent / teacher: set up a PIN</button></div>`);on('#go',setPin);}
function openProfile(p){cur=p;if(used(p)>=S.limit)return rest(p);startClock(p);p.world==='dino'?dinoHome(p):labHome(p);}
// ---- Dashboard ----
function dash(){stopClock();const av={lab:['🧑‍🔬','🎧','🎹','🥁','🎻','💃'],dino:['🦕','🦖','🚚','🚒','🚜','🚌']};
 h(`<div class="screen"><header class="top"><h1>🔒 Parent / Teacher</h1><button class="btn ghost" id="out">Done</button></header>
 ${isInstalled()?'<section class="panel small">📲 Installed on this device as an app.</section>':`<section class="panel"><h2>Install on this tablet</h2><p class="small">Put Kids Lab on the home screen so it opens full screen and works offline.</p>${instBtn()}</section>`}
 <section class="panel"><h2>Daily time limit per player</h2><input type="range" id="lim" min="60" max="120" step="5" value="${S.limit}"> <b id="limv">${S.limit} min</b></section>
 <section class="panel"><h2>Add a player</h2><input id="nm" maxlength="16" placeholder="Name or nickname"> <select id="wd"><option value="lab">Mad Scientist Music Lab (Grades 1 to 6)</option><option value="dino">Dino Truck Town (toddler)</option></select> <select id="gr" aria-label="grade">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${n===3?'selected':''}>Grade ${n}${BUILT[n]?'':' (coming soon)'}</option>`).join('')}</select> <button class="btn" id="add">Add</button></section>
 <section class="panel"><h2>Players and progress</h2>${S.profiles.length>1?'<button class="btn sm" id="cls">🏫 Class overview</button>':''}${S.profiles.length?S.profiles.map((p,i)=>`<div class="prow"><div><span class="big">${p.avatar}</span> <b>${esc(p.name)}</b> <span class="small">(${p.world==='dino'?'Dino Truck Town':'Music Lab'})${p.world==='dino'?'':` <select data-gr="${i}" aria-label="grade">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${n===gradeOf(p)?'selected':''}>Grade ${n}${BUILT[n]?'':' (coming soon)'}</option>`).join('')}</select>`} · today ${Math.round(used(p))} of ${S.limit} min · ⭐ ${p.stars||0}</span>
 <div class="small">${progressText(p)}</div>${dashXS(p,i)}</div><div><button class="btn sm" data-an="${i}">📊 Analytics</button> <button class="btn sm" data-av="${i}">Avatar</button> <button class="btn sm" data-rt="${i}">Reset today's time</button> <button class="btn sm warn" data-del="${i}">Remove</button></div></div>`).join(''):'<p class="small">No players yet.</p>'}</section>
 <section class="panel"><h2>Security</h2><button class="btn sm" id="rp">Reset PIN</button> <span class="small">All data is stored only on this device (localStorage).</span></section></div>`);
 $('#lim').oninput=e=>{S.limit=+e.target.value;$('#limv').textContent=S.limit+' min';save();};
 instWire();on('#out',home);$('#wd').onchange=e=>{$('#gr').style.display=e.target.value==='dino'?'none':'';};document.querySelectorAll('[data-gr]').forEach(el=>el.addEventListener('change',()=>{S.profiles[+el.dataset.gr].grade=+el.value;save();dash();}));on('#rp',setPin);dashXSWire();on('[data-an]',el=>analytics(+el.dataset.an));if($('#cls'))on('#cls',classView);
 on('#add',()=>{const n=$('#nm').value.trim();if(!n)return;const w=$('#wd').value;const np={name:n,world:w,grade:w==='dino'?undefined:+$('#gr').value,avatar:av[w][0],stars:0,prog:{},badges:[],time:{}};xsInit(np);S.profiles.push(np);save();dash();});
 on('[data-del]',el=>{const p=S.profiles[+el.dataset.del];if(confirm('Remove '+p.name+' and all progress?')){S.profiles.splice(+el.dataset.del,1);save();dash();}});
 on('[data-rt]',el=>{const p=S.profiles[+el.dataset.rt];if(p.time)p.time[today()]=0;save();dash();});
 on('[data-av]',el=>{const p=S.profiles[+el.dataset.av],l=av[p.world];p.avatar=l[(l.indexOf(p.avatar)+1)%l.length];save();dash();});}
function progressText(p){const pr=p.prog||{};const list=p.world==='dino'?TODDLER:ALLW().filter(w=>(w.grade||3)===gradeOf(p)||(p.prog||{})[w.id]);return list.map(w=>{const r=pr[w.id];return `${w.icon} ${w.title}: ${r?(p.world==='dino'?(r.plays||0)+(r.plays===1?' round':' rounds')+' of 10'+(r.views?`, ${r.views} cards`:'')+(r.seen?`, letters heard ${r.seen.length}/26`:'')+(r.found?`, letters found ${r.found.length}/26 (${r.found.slice().sort().join(' ')})`:''):`last round ${r.rounds&&r.rounds.length?r.rounds[r.rounds.length-1].s+'/'+r.rounds[r.rounds.length-1].of:'-'}, best ${r.best}/${r.bestOf||10}, ${r.plays} round${r.plays===1?'':'s'}`):'not started'}${p.world!=='dino'&&bigGrade(w)?`, ${svCount(p,w)}/${svSize(p,w)} solved`:''}`}).join(' · ')+(p.badges&&p.badges.length?' · Badges: '+p.badges.join(', '):'')+(p.medals&&p.medals.length?' · Medals (all solved): '+p.medals.map(id=>(ALLW().find(w=>w.id===id)||{title:id}).title).join(', '):'');}
// ---- Grade 3 lab ----
function labHome(p,fb){const g=gradeOf(p),own=wingsFor(g),W=fb?wingsFor(fb):own;if(!own.length&&!fb)return comingSoon(p,g);h(`<div class="screen lab"><header class="top"><button class="btn ghost" id="bk">🏠</button><h1>${miniAva(p,'hdr')} ${esc(p.name)}'s Mad Scientist Music Lab <span class="gtag">Grade ${g}</span></h1><span class="stars">⭐ ${p.stars||0} ${coinBadge(p)}</span></header>
 ${funMeter(p)}<div class="xsrow2"><button class="btn xsbtn" id="xs">🎨 Extracurricular Activities: Style Studio and Prize Store</button><button class="btn xsbtn pkbtn" id="pk">🧱 Block Park</button></div>
 ${fb?`<p class="lead">Practice games from Grade ${fb} while Grade ${g} games are not available.</p>`:'<p class="lead">Pick a lab wing. Each one is a topic from class. Tap 🔊 to hear anything read aloud.</p>'}
 <div class="grid wings ${(fb||g)<=2?'g1':''}">${W.map((w,i)=>{const r=(p.prog||{})[w.id];return `<button class="card wing" data-i="${i}"><div class="big-emoji">${w.icon}</div><div class="pname">${w.title}</div><div class="small">${w.subject}: ${w.topic}</div><div class="small">${r?'Best '+r.best+'/'+(r.bestOf||10)+(bigGrade(w)?'':(r.best>=Math.ceil(0.8*(r.bestOf||10))?' 🏅':'')):'New!'}${bigGrade(w)?` · 📚 ${svCount(p,w)}/${svSize(p,w)} solved${(p.medals||[]).includes(w.id)?' 🏅':''}`:''}</div></button>`}).join('')}</div>
 ${p.badges&&p.badges.length?`<p class="badges">🏅 ${p.badges.join(' · ')}</p>`:''}</div>`);
 on('#bk',home);on('#xs',()=>xsOpen(p));on('#pk',()=>xsOpen(p,'park'));on('.wing',el=>quiz(p,W[+el.dataset.i],fb));if((fb||g)<=2)Say.speak('Hello '+p.name+'! Pick a game.');}
function comingSoon(p,g){const f=fallbackGrade(g);h(`<div class="screen center lab"><div class="big-emoji">🧪🚧</div><h1>Grade ${g} games are not ready on this device</h1><p class="lead">The Grade ${g} experiments did not load. You can practise with Grade ${f} games for now.</p><button class="btn" id="fb">Play Grade ${f} games</button> <button class="btn" id="xs">🎨 Extracurricular</button> <button class="btn ghost" id="bk">🏠 Home</button></div>`);Say.speak(`Grade ${g} games are not ready on this device. You can practise with Grade ${f} games for now.`);on('#fb',()=>labHome(p,f));on('#xs',()=>xsOpen(p));on('#bk',home);}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const ROUND=10; // Grades 1-2 (and Dino) rounds
// Grades 3-6: 20-question rounds drawn from a STABLE per-profile pool of up to 100 questions per wing.
// The pool is regenerated identically on every launch from p.seed (a random number stored once per profile), so each
// question has a fixed index 0..99. Solved questions are kept as a compact bitset per wing: p.sv[wingId]="<poolSize>:<base64 bits>".
const POOL_N=100,roundSize=w=>(w.grade||3)>=3?20:ROUND,bigGrade=w=>(w.grade||3)>=3;const POOLS={};
const qKey=q=>q.q+'|'+(q.svg||'')+'|'+q.c[q.a];
function seeded(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(t){let x=2166136261;for(let i=0;i<t.length;i++)x=Math.imul(x^t.charCodeAt(i),16777619);return x>>>0;}
// ckl-v17 pool builder (seeded). Still used for generator wings, and to rebuild a v17 pool when migrating solved flags.
function poolV17(w,p,gen,qs){const R0=Math.random;Math.random=seeded(p.seed^hashStr(w.id));const seen=new Set(),out=[];const add=q=>{const k=qKey(q);if(out.length<POOL_N&&!seen.has(k)){seen.add(k);out.push(Object.assign({},q));return 1;}return 0;};
 try{if(gen){let stale=0;for(let t=0;t<800&&stale<60&&out.length<POOL_N;t++){let n=0;for(const q of gen())n+=add(q);stale=n?0:stale+1;}}
  else{const L=(qs||[]).slice();for(let i=L.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[L[i],L[j]]=[L[j],L[i]];}L.forEach(add);}}
 finally{Math.random=R0;}out.forEach((q,i)=>q._pi=i);return out;}
// ckl-v18 fact-bank wings (w.bank): the pool is the bank itself; each question's index _pi is the permanent ordinal in its id
// (e.g. 'g5m-042' -> 42), so solved flags survive later bank versions as long as the id still exists.
const idOrd=id=>+String(id).split('-').pop();
function poolFor(w,p){if(!bigGrade(w)||!p){const k='_'+w.id;if(POOLS[k])return POOLS[k];const seen=new Set(),out=[];const add=q=>{const kk=qKey(q);if(!seen.has(kk)){seen.add(kk);out.push(q);}};if(w.gen){for(let t=0;t<60;t++)w.gen().forEach(add);}else(w.questions||[]).forEach(add);return POOLS[k]=out;}
 if(w.bank){const k='b|'+w.id;if(!POOLS[k])POOLS[k]=w.bank.filter(q=>!q.retired).map(q=>Object.assign({},q,{_pi:idOrd(q.id)}));if(p)migrateSV(p,w);return POOLS[k];}
 if(!p.seed){p.seed=(Math.random()*4294967295)>>>0||1;save();}const ck=p.seed+'|'+w.id;if(POOLS[ck])return POOLS[ck];
 return POOLS[ck]=poolV17(w,p,w.gen,w.questions);}
// One-time move of a ckl-v17 flag string ("n:bits", indexed by the old seeded pool) to the ckl-v18 id format ("b2:bits").
// A flag is kept when the old question (same text and answer) is still in the bank.
const qTA=q=>String(q.q).replace(/<[^>]+>/g,'')+'|'+q.c[q.a];
function migrateSV(p,w){const v=(p.sv||{})[w.id];if(!v||v.startsWith('b2:'))return;const old=v.split(':'),bits=old[1]?atob(old[1]):'';
 const b2=new Uint8Array(BITS);let kept=0,lost=0;
 if(bits&&p.seed){const op=poolV17(w,p,w.legacyGen,w.legacyQ),map={};w.bank.forEach(q=>map[qTA(q)]=idOrd(q.id));
  const tpl=q=>String(q.q).replace(/<[^>]+>/g,'').replace(/\d+(\.\d+)?/g,'#'),fam={};w.bank.forEach(q=>(fam[tpl(q)]=fam[tpl(q)]||[]).push(idOrd(q.id)));
  const set=o=>{b2[o>>3]|=1<<(o&7);},has=o=>b2[o>>3]&(1<<(o&7));
  op.forEach((q,i)=>{if(bits.charCodeAt(i>>3)&(1<<(i&7))){const o=map[qTA(q)];if(o!==undefined){set(o);kept++;}else{const f=(fam[tpl(q)]||[]).find(x=>!has(x));if(f!==undefined){set(f);kept++;}else lost++;}}});}
 // (a solved number-variant that was dropped as padding passes its credit to an unsolved bank item of the same kind)
 kept=0;for(const x of b2)for(let b=x;b;b&=b-1)kept++;p.sv[w.id]='b2:'+btoa(String.fromCharCode(...b2));p.svMig=p.svMig||{};p.svMig[w.id]={kept,lost};save();}
const BITS=32; // up to 256 question ordinals per wing
function svGet(p,w){const raw=(p.sv||{})[w.id]||'',b2=raw.startsWith('b2:'),v=b2?['',raw.slice(3)]:raw.split(':');const n=b2?0:(+v[0]||0),bits=new Uint8Array(BITS);if(v[1]){const b=atob(v[1]);for(let i=0;i<b.length&&i<bits.length;i++)bits[i]=b.charCodeAt(i);}return{n,bits,b2};}
function svHas(p,w,i){return!!(svGet(p,w).bits[i>>3]&(1<<(i&7)));}
function svCount(p,w){if(w.bank)return poolFor(w,p).filter(q=>svHas(p,w,q._pi)).length;const{bits}=svGet(p,w);let c=0;for(const x of bits)for(let b=x;b;b&=b-1)c++;return c;}
function svMark(p,w,i,n){const g=svGet(p,w);g.bits[i>>3]|=1<<(i&7);p.sv=p.sv||{};let L=g.bits.length;while(L>1&&!g.bits[L-1])L--;const enc=btoa(String.fromCharCode(...g.bits.slice(0,L)));p.sv[w.id]=w.bank?'b2:'+enc:n+':'+enc;}
const svSize=(p,w)=>w.bank?poolFor(w,p).length:(svGet(p,w).n||poolFor(w,p).length);
function drawRound(p,w){const pool=poolFor(w,p);if(!bigGrade(w))return shuffle(pool).slice(0,ROUND);const n=roundSize(w);
 const un=shuffle(pool.filter(q=>!svHas(p,w,q._pi))),so=shuffle(pool.filter(q=>svHas(p,w,q._pi)));return un.concat(so).slice(0,n);}
// Marks a pool question solved (first-try correct only). Returns true when this completes the whole pool.
function solve(p,w,q){if(!bigGrade(w))return false;const pool=poolFor(w,p);let i=q._pi;if(i===undefined){const k=w.bank?qTA(q):qKey(q);const f=pool.find(x=>(w.bank?qTA(x):qKey(x))===k);i=f?f._pi:-1;}if(i<0)return false;
 if(!svHas(p,w,i)){svMark(p,w,i,pool.length);save();}return svCount(p,w)>=pool.length;}
// ---- Grades: each big-kid profile has a grade (1-6). Built grades list their wings here. ----
const BUILT={1:()=>window.G1_WINGS||[],2:()=>window.G2_WINGS||[],3:()=>window.G3_WINGS||[],4:()=>window.G4_WINGS||[],5:()=>window.G5_WINGS||[],6:()=>window.G6_WINGS||[]};
const gradeOf=p=>p.grade||3;
const wingsFor=g=>BUILT[g]?BUILT[g]():[];
function fallbackGrade(g){const b=Object.keys(BUILT).map(Number);return b.filter(x=>x<g).pop()||b[0];}
const ALLW=()=>[].concat(...Object.keys(BUILT).map(k=>wingsFor(+k)));
function quiz(p,w,fb){const g1=w.grade&&w.grade<=2;const spk=t=>String(t).replace(/×/g,' times ').replace(/−/g,' minus ').replace(/÷/g,' divided by ').replace(/(\d+)c\b/g,'$1 cents');let qT0=0,qs=drawRound(p,w),i=0,score=0,firstTry=true;const readQ=q=>spk((q.say||q.q)+' '+(g1?'Is it ':'')+(q.sc||q.c).join(', or ')+'?');
 const show=()=>{const q=qs[i];qT0=Date.now();const order=shuffle(q.c.map((c,k)=>k));const sm=window.SHOWME?SHOWME.find(q,w):null,smOK=!!(sm&&!sm.bad);const openSM=()=>{firstTry=false;smPanel(sm,q);};
 h(`<div class="screen lab les${g1?' g1':''}"><header class="top"><button class="btn ghost" id="bk">⬅</button><h1>${w.icon} ${w.title}</h1><span class="stars">Question ${i+1} of ${qs.length} · ⭐ ${score}</span></header>
 ${i===0?`<p class="intro">${w.intro} <button class="btn sm" id="si">🔊</button></p>`:''}
 ${w.map?mapSVG():''}${q.art?shapeSVG(q.art):''}${q.svg||''}
 <div class="qbox"><p class="q">${q.q}</p><button class="btn sm" id="sq">🔊 Read to me</button>${q.beat?' <button class="btn sm" id="bt">🥁 Play the beat</button>':''}${smOK?' <button class="btn sm smb" id="smb">🪜 Show me how</button>':''}</div>
 <div class="choices">${order.map(k=>`<button class="btn choice" data-k="${k}">${esc(q.c[k])}</button>`).join('')}</div><p class="fb" id="fb"></p><div id="smp"></div><p class="src small">Source: ${w.source}${q.std?' · Code '+q.std:''}</p></div>`);
 if(smOK)on('#smb',()=>openSM());
 on('#bk',()=>labHome(p,fb));if(g1)setTimeout(()=>Say.speak((i===0?w.intro+' ':'')+readQ(q),0.9),250);on('#sq',()=>{if(g1||q.say||q.sc)return Say.speak(readQ(q),0.9);const g=[...document.querySelectorAll('svg.money,svg.blocks')].find(e=>e.getAttribute('aria-label')!=='money');Say.speak(q.q+(g?(g.classList.contains('blocks')?' Look at the blocks and count the hundreds, tens and ones.':' The picture shows '+g.getAttribute('aria-label').replace(/^money: /,'')+'.'):'')+' '+q.c.join(', or '));});if($('#si'))on('#si',()=>Say.speak(w.intro));if($('#bt'))on('#bt',()=>{q.beat.forEach((n,k)=>{Snd.tone(k%2?330:220,0.12,'triangle',k*0.5,0.3);Snd.tone(110,0.15,'sine',k*0.5,0.4);});Say.speak(q.beat.join(', ')+', what comes next?',0.8);});
 on('.choice',el=>{const k=+el.dataset.k;if(k===q.a){el.classList.add('ok');if(firstTry){score++;solve(p,w,q);}anRecord(p,w,q,firstTry,Date.now()-qT0);Snd.good();$('#fb').innerHTML='✅ '+q.why;Say.speak('Great thinking! '+q.why);document.querySelectorAll('.choice').forEach(b=>b.disabled=true);setTimeout(()=>{i++;firstTry=true;i<qs.length?show():finish();},2600);}
  else{firstTry=false;el.disabled=true;el.classList.add('no');Snd.soft();$('#fb').textContent=g1?'Not quite. That is OK! Try another one.':'Not quite. Look for the clue and try another one!';if(smOK&&!$('#smpanel')){$('#fb').insertAdjacentHTML('beforeend',' <button class="btn sm smb" id="smb2">🪜 Show me how</button>');on('#smb2',()=>openSM());}if(g1)Say.speak('Not quite. That is OK! Try another one.');}});};
 const smPanel=(sm,orig)=>{const host=$('#smp');let k=0;const speak=()=>Say.speak(SHOWME.say(sm.steps[k].t),0.9);
  const draw=()=>{const lastSvg=sm.steps.slice(0,k+1).map(x=>x.svg).filter(Boolean).pop()||'';const end=k===sm.steps.length-1;
   host.innerHTML=`<div class="smpanel" id="smpanel"><h3>🪜 Show me how <span class="small">· ${esc(sm.label)} · step ${k+1} of ${sm.steps.length}</span></h3><ol class="smsteps">${sm.steps.slice(0,k+1).map((x,j)=>`<li class="${j===k?'cur':''}${x.fin?' fin':''}">${esc(x.t)}</li>`).join('')}</ol>${lastSvg}<div class="smbtns">${end?'':'<button class="btn" id="smn">Next step ▶</button> '}<button class="btn ghost sm" id="sms">🔊 Read this step</button>${end&&orig?' <button class="btn" id="smy">✏️ Your turn</button>':''} <button class="btn ghost sm" id="smc">${orig?'Back to my question':'Close'}</button></div></div>`;
   if(!end)on('#smn',()=>{k++;draw();if(g1)speak();});on('#sms',speak);on('#smc',()=>{host.innerHTML='';Say.speak('');});if(end&&orig)on('#smy',()=>yourTurn(sm,orig));host.scrollIntoView({block:'nearest'});};
  draw();if(g1)speak();};
 const similar=(sm,orig)=>{const pool=[];if(bigGrade(w))pool.push(...shuffle(poolFor(w,p).filter(x=>!svHas(p,w,x._pi))));if(w.gen){for(let t=0;t<8;t++)pool.push(...w.gen());}else pool.push(...(w.questions||[]));const c=shuffle(pool.filter(x=>x.q!==orig.q&&x.std&&/^MT\./.test(x.std))).find(x=>{const f=SHOWME.find(x,w);return f&&!f.bad&&f.id===sm.id;});return c||SHOWME.twin(sm,w);};
 const yourTurn=(sm,orig)=>{const host=$('#smp'),t=similar(sm,orig);if(!t){host.innerHTML=`<div class="smpanel" id="smpanel"><p>No practice question of this kind right now. Try the question above!</p><button class="btn ghost sm" id="smc">Back to my question</button></div>`;on('#smc',()=>host.innerHTML='');return;}
  let ytFirst=true;const od=shuffle(t.c.map((c,k)=>k));host.innerHTML=`<div class="smpanel yt" id="smpanel"><h3>✏️ Your turn</h3>${t.svg||''}<p class="q">${t.q}</p><button class="btn sm" id="ytr">🔊 Read to me</button><div class="choices">${od.map(k=>`<button class="btn choice ytc" data-k="${k}">${esc(t.c[k])}</button>`).join('')}</div><p class="fb" id="ytf"></p><button class="btn ghost sm" id="smc">Back to my question</button></div>`;
  on('#ytr',()=>Say.speak(readQ(t),0.9));if(g1)Say.speak('Your turn! '+readQ(t),0.9);on('#smc',()=>{host.innerHTML='';});
  on('.ytc',el=>{const k=+el.dataset.k;if(k===t.a){el.classList.add('ok');Snd.good();document.querySelectorAll('.ytc').forEach(b=>b.disabled=true);const pq=bigGrade(w)&&ytFirst&&poolFor(w,p).some(x=>qKey(x)===qKey(t));if(pq)solve(p,w,t);$('#ytf').innerHTML='✅ You did it! '+(pq?'(This one counts towards your 100!) ':'')+esc(t.why||'');Say.speak('You did it! '+(t.why||''));}
   else{ytFirst=false;el.disabled=true;el.classList.add('no');Snd.soft();const f=SHOWME.find(t,w);$('#ytf').innerHTML='Not quite. Try another one.'+(f&&!f.bad?' <button class="btn sm" id="yts">🪜 Steps for this one</button>':'');if(g1)Say.speak('Not quite. Try another one.');if(f&&!f.bad)on('#yts',()=>smPanel(f,null));}});};
 const finish=()=>{p.prog=p.prog||{};const r=p.prog[w.id]||{best:0,plays:0};r.plays++;if(score/qs.length>=(r.best||0)/(r.bestOf||10)){r.best=score;r.bestOf=qs.length;}r.rounds=(r.rounds||[]).concat([{d:today(),s:score,of:qs.length}]).slice(-30);p.prog[w.id]=r;p.stars=(p.stars||0)+score;p.badges=p.badges||[];let nb='';const bn=w.badge||w.title.split(' ')[0]+' Master';if(bigGrade(w)){p.medals=p.medals||[];if(svCount(p,w)>=poolFor(w,p).length&&!p.medals.includes(w.id)){p.medals.push(w.id);nb=bn+' medal (all '+poolFor(w,p).length+' solved)';}}else if(score>=Math.ceil(qs.length*0.8)&&!p.badges.includes(bn)){p.badges.push(bn);nb=bn;}earn(p,score,!!nb);save();
  h(`<div class="screen center lab"><div class="big-emoji">🧪✨🎶</div><h1>Round complete!</h1><p class="score">${score} / ${qs.length}</p><p class="lead">${'⭐'.repeat(score)}${'☆'.repeat(qs.length-score)}</p><p class="lead">${score>=Math.ceil(qs.length*0.8)?'Brilliant experimenting!':score>=Math.ceil(qs.length/2)?'Great work, scientist!':'Good effort! Every round makes your brain stronger.'}</p>${nb?`<p class="badge">🏅 New ${bigGrade(w)?'medal':'badge'}: ${nb}</p>`:''}${bigGrade(w)?`<p class="lead">📚 ${svCount(p,w)}/${poolFor(w,p).length} solved${(p.medals||[]).includes(w.id)?' · 🏅 medal won':' · solve them all for the medal!'}</p>`:''}<p class="coins">🪙 +${score} coins · You have ${p.coins} coins</p><button class="btn" id="ag">Play again</button> <button class="btn ghost" id="lb">Back to the lab</button></div>`);
  Snd.good();Say.speak(`Round complete! You got ${score} out of ${qs.length} and earned ${score} stars and ${score} coins.`+(nb?(bigGrade(w)?' New medal: ':' New badge: ')+nb:''));on('#ag',()=>quiz(p,w,fb));on('#lb',()=>labHome(p,fb));};
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
 ${funMeter(p)}<div class="grid tod">${TODDLER.map((a,i)=>`<button class="card huge" data-i="${i}" aria-label="${a.title}"><div class="mega">${a.icon}</div></button>`).join('')}<button class="card huge xscard" id="xs" aria-label="dress up"><div class="ava-card">${miniAva(p)}</div><div class="mega sm">🎨</div></button><button class="card huge xscard" id="pk" aria-label="block park"><div class="mega">🧱</div><div class="mega sm">🏃</div></button></div></div>`);
 Say.speak('Hello '+p.name+'! Tap a picture to play.');on('#bk',home);on('#xs',()=>xsOpen(p));on('#pk',()=>xsOpen(p,'park'));on('.huge[data-i]',el=>{const a=TODDLER[+el.dataset.i];RND={id:a.id,done:0};({count:countGame,colour:colourGame,shape:shapeGame,abc:abcExplore,findabc:abcFind})[a.id](p,0);});}
let RND={id:null,done:0};
// Progress strip of 10 dino footprints; filled = done this round.
function strip(){return `<div class="strip" aria-hidden="true">${Array.from({length:10},(_,i)=>`<span class="${i<RND.done?'on':''}">🐾</span>`).join('')}</div>`;}
// Records one finished round of 10 (no scores: toddlers never fail).
function dinoDone(p,id){anPlay(p,id);p.prog=p.prog||{};const r=p.prog[id]||{plays:0};r.plays=(r.plays||0)+1;r.last=today();p.prog[id]=r;p.stars=(p.stars||0)+1;earn(p,DINO_ROUND_COINS);save();}
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
 h(`<div class="screen dino les"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp" aria-label="say again">🔊</button></header><div class="trucks${n>5?' many':''}">${Array.from({length:n},(_,i)=>`<button class="truck" data-i="${i}" aria-label="${v[1]}">${v[0]}</button>`).join('')}</div><div class="counter" id="ct"></div><div class="vlabel" id="vl"></div></div>`);
 const prompt=()=>Say.speak(n===1?`Let's count! Tap the ${v[1]}.`:`Let's count the ${v[2]}! Tap the ${v[2]}.`);prompt();on('#bk',()=>dinoHome(p));on('#rp',prompt);
 document.querySelectorAll('.truck').forEach(el=>el.addEventListener('click',()=>{if(el.classList.contains('done'))return Snd.honk();el.classList.add('done');c++;Snd.count(c);$('#ct').textContent=c;$('#vl').textContent=`${c} ${vname(v,c)}`;Say.speak(NUM[c]);if(c===n){setTimeout(()=>{Say.speak(`${NUM[n]} ${vname(v,n)}! ${cheer()}`);Snd.honk();},700);setTimeout(()=>itemDone(p,'count',()=>countGame(p,r+1)),2300);}}));}
const COLS=[['red','#e63946'],['blue','#1d7fd6'],['yellow','#ffd23f'],['green','#2a9d4a']];
function dinoSVG(col,size=150){return `<svg viewBox="0 0 120 100" width="${size}" height="${size*0.83}"><ellipse cx="55" cy="62" rx="38" ry="24" fill="${col}"/><rect x="78" y="22" width="14" height="40" rx="7" fill="${col}"/><ellipse cx="94" cy="22" rx="16" ry="11" fill="${col}"/><circle cx="99" cy="19" r="3" fill="#222"/><rect x="30" y="78" width="11" height="18" rx="4" fill="${col}"/><rect x="62" y="78" width="11" height="18" rx="4" fill="${col}"/><polygon points="17,58 0,70 20,68" fill="${col}"/></svg>`;}
function colourGame(p,r){const pick=shuffle(COLS).slice(0,2+Math.min(r,1)),t=pick[Math.floor(Math.random()*pick.length)];
 h(`<div class="screen dino les center"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp">🔊</button></header><div class="target">${dinoSVG(t[1],170)}</div><div class="opts">${pick.map(c=>`<button class="blob" data-c="${c[0]}" style="background:${c[1]}" aria-label="${c[0]}"></button>`).join('')}</div></div>`);
 const prompt=()=>Say.speak(`This dino is ${t[0]}. Can you find ${t[0]}?`);prompt();on('#bk',()=>dinoHome(p));on('#rp',prompt);
 document.querySelectorAll('.blob').forEach(el=>el.addEventListener('click',()=>{if(el.dataset.c===t[0]){Snd.good();Say.speak(`${t[0]}! ${cheer()}`);setTimeout(()=>itemDone(p,'colour',()=>colourGame(p,r+1)),1300);}else{Snd.count(1);el.classList.add('wiggle');Say.speak(`That is ${el.dataset.c}. Let's find ${t[0]}, like the dino!`);document.querySelector(`[data-c="${t[0]}"]`).classList.add('glow');}}));}
const SH={circle:'<circle cx="50" cy="50" r="40"/>',square:'<rect x="12" y="12" width="76" height="76"/>',triangle:'<polygon points="50,8 92,90 8,90"/>'};
function shp(n,col){return `<svg viewBox="0 0 100 100" width="120" height="120" fill="${col}" stroke="#333" stroke-width="4">${SH[n]}</svg>`;}
function shapeGame(p,r){const names=shuffle(Object.keys(SH)),t=names[0];
 h(`<div class="screen dino les center"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp">🔊</button></header><div class="target row"><span class="mega">🦖</span>${shp(t,'#ff9f1c')}</div><div class="opts">${shuffle(names).map(n=>`<button class="blob shapeb" data-s="${n}" aria-label="${n}">${shp(n,'#ffd166')}</button>`).join('')}</div></div>`);
 const prompt=()=>Say.speak(`Dino has a ${t}. Find the ${t}!`);prompt();on('#bk',()=>dinoHome(p));on('#rp',prompt);
 document.querySelectorAll('.shapeb').forEach(el=>el.addEventListener('click',()=>{if(el.dataset.s===t){Snd.good();Snd.stomp();Say.speak(`A ${t}! ${cheer()}`);setTimeout(()=>itemDone(p,'shape',()=>shapeGame(p,r+1)),1300);}else{Snd.count(2);el.classList.add('wiggle');Say.speak(`That is a ${el.dataset.s}. Let's find the ${t}!`);document.querySelector(`[data-s="${t}"]`).classList.add('glow');}}));}

// ---- ABC (toddler) ----
const art=L=>L[0]==='X'?`X is in ${L[3]}`:`${L[0]} is for ${L[3]}`;
const sayLetter=L=>L[0]==='X'?`${L[1]}. ${L[1]} says ${L[2]}, at the end of ${L[3]}.`:`${L[1]}. ${L[1]} says ${L[2]}, ${L[2]}, ${L[3]}. ${L[1]} is for ${L[3]}!`;
function abcExplore(p,r){h(`<div class="screen dino les"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp">🔊</button></header>
 <div class="abc-grid">${ABC.map((L,i)=>`<button class="abc-key" data-i="${i}" aria-label="${L[0]}"><span class="up">${L[0]}</span><span class="lo">${L[0].toLowerCase()}</span></button>`).join('')}</div></div>`);
 const prompt=()=>Say.speak('Tap a letter to hear it!');prompt();on('#bk',()=>dinoHome(p));on('#rp',prompt);
 document.querySelectorAll('.abc-key').forEach(el=>el.addEventListener('click',()=>RND.done>=10?(dinoDone(p,'abc'),party(p,()=>{RND.done=0;abcCard(p,+el.dataset.i);})):abcCard(p,+el.dataset.i)));}
function abcCard(p,i){const L=ABC[i];p.prog=p.prog||{};const r=p.prog.abc||{plays:0,seen:[]};if(!r.seen.includes(L[0]))r.seen.push(L[0]);r.views=(r.views||0)+1;p.prog.abc=r;RND.id='abc';RND.done=Math.min(10,RND.done+1);save();Snd.count(i%5+1);
 h(`<div class="screen dino les center"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp">🔊</button></header>
 <div class="abc-card"><div class="abc-big"><span>${L[0]}</span><span class="lo">${L[0].toLowerCase()}</span></div><div class="mega">${L[4]}</div><div class="vlabel">${art(L)}</div></div>
 <div class="opts"><button class="btn huge-btn ghost" id="pv" aria-label="previous">◀️</button><button class="btn huge-btn ghost" id="nx" aria-label="next">▶️</button></div></div>`);
 const say=()=>Say.speak(sayLetter(L),0.85);say();on('#bk',()=>abcExplore(p));on('#rp',say);on('.abc-big',say);
 const go=j=>RND.done>=10?(dinoDone(p,'abc'),party(p,()=>{RND.done=0;abcCard(p,j);})):abcCard(p,j);on('#pv',()=>go((i+25)%26));on('#nx',()=>go((i+1)%26));}
function abcFind(p,r){const k=r<4?2:3,ch=shuffle(ABC).slice(0,k),t=ch[Math.floor(Math.random()*k)];
 h(`<div class="screen dino les center"><header class="top"><button class="btn ghost" id="bk">⬅</button>${strip()}<button class="btn ghost" id="rp">🔊</button></header>
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
 p.xs=Object.assign({parent:true,mile:true,rounds:2,badge:true,mins:15},p.xs||{});p.xs.lesMin=p.xs.lesMin||20;p.xs.funMin=p.xs.funMin||10;funDay(p);}
S.profiles.forEach(xsInit);save();
const owns=(p,id)=>FREE(id)||(p.owned||[]).includes(id);
function earn(p,c,badge){xsInit(p);p.coins=(p.coins||0)+c;p.rt[today()]=(p.rt[today()]||0)+1;if(badge)p.bt[today()]=(p.bt[today()]||0)+1;}
function coinBadge(p){return `<span class="coinbal" aria-label="coins">🪙 ${p.coins||0}</span>`;}
function miniAva(p,cls){return p.look?AVA.svg(p.look,{view:'head',cls:'mini '+(cls||'')}):`<span class="big-emoji">${p.avatar}</span>`;}
function activeEvents(){return (window.EVENTS||[]).filter(e=>eventActive(e,new Date()));}
let xsTimer=null;function xsStop(){if(xsTimer)clearInterval(xsTimer);xsTimer=null;}
function milestoneInfo_v19_unused(p){const x=p.xs,r=p.rt[today()]||0,b=x.badge?(p.bt[today()]||0):0,earned=Math.floor(r/x.rounds)+b,used=p.xsUsed[today()]||0;return {earned,used,left:earned>used?0:x.rounds-(r%x.rounds)};}
function xsUnlock(p){p.xsUntil=Date.now()+funCfg(p).fun*60000;save();} // grown-up override: does not use earned fun time
function xsOpen(p,dest){xsInit(p);const tod=p.world==='dino',go=()=>{funEnter();dest==='park'?park(p):studio(p);};
 if(funLeft(p)>0){const s=funLeft(p);Say.speak(tod?'Fun time!':`You have ${Math.max(1,Math.round(s/60))} minute${Math.round(s/60)===1?'':'s'} of fun time. Have fun!`);return go();}
 const i=funInfo(p),back=()=>tod?dinoHome(p):labHome(p),need=Math.max(1,Math.ceil((i.L-i.prog)/60));
 h(`<div class="screen center ${tod?'dino':'lab'}"><div class="xs-lock">${miniAva(p,'big')}</div><h1>${tod?'🎨 🧱 🔒':'🎨 Fun time is locked for now'}</h1>
 ${funMeter(p)}<p class="lead">${tod?'📚 ➡️ 🎉':`Play lesson games for ${need} more minute${need===1?'':'s'} to unlock ${i.c.fun} minutes of Style Studio and Block Park.`}</p>
 <div>${p.xs.parent?'<button class="btn" id="pu">🔒 Grown-up unlock</button> ':''}<button class="btn ghost huge-btn" id="bk" aria-label="back">⬅</button></div></div>`);
 Say.speak(tod?'Play some learning games first, then it is fun time!':`Play lesson games for ${need} more minute${need===1?'':'s'} to unlock fun time.`);
 on('#bk',back);if(p.xs.parent)on('#pu',()=>pinPad('Grown-up: type the PIN to unlock '+i.c.fun+' minutes',(v,d,bad)=>{if(v===S.pin){xsUnlock(p);startClock(p);go();}else bad();}));}
let ST={slot:'head',mode:'mine',try:null};
function studio(p){xsInit(p);if(funLeft(p)<=0)return timeUp(p);if(!funT)funEnter();const tod=p.world==='dino',evs=activeEvents();
 const look=Object.assign({},p.look);if(ST.try)look[AVA.ITEMS[ST.try].slot]=ST.try;
 const tabs=AVA.SLOTS.map(([s,n,i])=>`<button class="tab ${ST.slot===s?'on':''}" data-s="${s}" aria-label="${n}"><span>${i}</span>${tod?'':n}</button>`).join('')+`<button class="tab ${ST.slot==='body'?'on':''}" data-s="body" aria-label="skin and body"><span>🎨</span>${tod?'':'Skin & body'}</button>`;
 let tiles='';
 if(ST.slot==='body'){tiles=AVA.SKINS.map(([n,c])=>`<button class="tile skin ${p.look.skin===c?'eq':''}" data-skin="${c}" aria-label="${n}"><span class="dot" style="background:${c}"></span>${tod?'':`<span class="tn">${n}</span>`}</button>`).join('')+AVA.BODIES.map(([b,n])=>`<button class="tile ${p.look.body===b?'eq':''}" data-body="${b}" aria-label="${n}">${AVA.svg(Object.assign({},p.look,{body:b}),{view:'chest'})}${tod?'':`<span class="tn">${n}</span>`}</button>`).join('');}
 else{let list=Object.values(AVA.ITEMS).filter(it=>it.slot===ST.slot);
  if(ST.mode==='mine')list=list.filter(it=>owns(p,it.id));else list=list.filter(it=>!it.ev||evs.some(e=>e.id===it.ev)).sort((a,b)=>(b.ev?1:0)-(a.ev?1:0)||a.price-b.price);
  tiles=list.map(it=>{const own=owns(p,it.id),eq=p.look[it.slot]===it.id;return `<button class="tile ${eq?'eq':''} ${ST.try===it.id?'sel':''} ${it.ev?'ev':''}" data-id="${it.id}" aria-label="${esc(it.name)}">${AVA.svg(Object.assign({},p.look,{[it.slot]:it.id}),{view:it.slot})}<span class="tn">${tod?'':esc(it.name)}</span><span class="tp">${eq?'✅':own?'✔️':'🪙 '+it.price}</span>${it.ev?'<span class="evr">'+(it.ev==='halloween'?'🎃':it.ev==='christmas'?'🎄':'⭐')+'</span>':''}</button>`;}).join('')||`<p class="lead">${ST.mode==='mine'?(tod?'🛍️ ➡️':'Nothing here yet. Visit the Prize Store!'):'All gone!'}</p>`;}
 const it=ST.try&&AVA.ITEMS[ST.try],can=it&&(p.coins||0)>=it.price;
 h(`<div class="screen studio ${tod?'dino tod':'lab'}"><header class="top"><button class="btn ghost" id="bk" aria-label="back">⬅</button><h1>🎨 ${tod?'':'Extracurricular: '}${esc(p.name)}'s Style Studio</h1><button class="btn pkbtn" id="pk" aria-label="block park">🧱 ${tod?'':'Block Park'}</button><span class="stars">${coinBadge(p)} <span class="timer" id="tm">⏳</span></span></header>
 <div class="st-wrap"><div class="st-prev">${AVA.svg(look,{label:'my avatar'})}</div>
 <div class="st-side"><div class="modes"><button class="btn ${ST.mode==='mine'?'':'ghost'}" id="mm" aria-label="my things">👕 ${tod?'':'My things'}</button><button class="btn ${ST.mode==='store'?'':'ghost'}" id="ms" aria-label="prize store">🛍️ ${tod?'':'Prize Store'}</button></div>
 ${ST.mode==='store'&&ST.slot!=='body'?evs.map(e=>`<div class="evbanner" style="background:${e.colour}">${e.banner}</div>`).join(''):''}
 <div class="tabs">${tabs}</div><div class="tiles">${tiles}</div></div></div>
 ${it&&!owns(p,it.id)?`<div class="buybar"><div class="bb-name">${esc(it.name)}</div>${can?`<button class="btn buy" id="buy" aria-label="get it">🪙 ${it.price} ${tod?'✅':'Get it!'}</button>`:`<span class="lead">${tod?'🪙 ➕':`You need ${it.price-(p.coins||0)} more coins. Keep playing to earn more!`}</span>`}<button class="btn ghost" id="nt" aria-label="no thanks">${tod?'✖':'No thanks'}</button></div>`:''}
 <p class="small">Coins are earned by playing. No real money is used.</p></div>`);
 const tick=()=>{const s=funTick(p);const el=$('#tm');if(el)el.textContent=`⏳ ${mmss(s)}`;if(s<=0){xsStop();timeUp(p);}};
 tick();xsTimer=setInterval(tick,1000);
 on('#bk',()=>{ST.try=null;tod?dinoHome(p):labHome(p);});on('#pk',()=>{ST.try=null;park(p);});
 on('#mm',()=>{ST.mode='mine';ST.try=null;Say.speak('My things');studio(p);});on('#ms',()=>{ST.mode='store';ST.try=null;Say.speak(evs.length?'Prize store. '+evs.map(e=>e.name).join(' and ')+' things are here!':'Prize store');studio(p);});
 on('.tab',el=>{ST.slot=el.dataset.s;ST.try=null;const t=AVA.SLOTS.find(x=>x[0]===ST.slot);Say.speak(t?t[1]:'Skin and body');studio(p);});
 on('[data-skin]',el=>{p.look.skin=el.dataset.skin;save();Say.speak(el.getAttribute('aria-label'));studio(p);});
 on('[data-body]',el=>{p.look.body=el.dataset.body;save();Say.speak(el.getAttribute('aria-label'));studio(p);});
 on('.tile[data-id]',el=>{const i=AVA.ITEMS[el.dataset.id];
  if(owns(p,i.id)){ST.try=null;if(p.look[i.slot]===i.id){p.look[i.slot]='';Say.speak('Took off the '+i.name);}else{p.look[i.slot]=i.id;Say.speak(i.name);}save();return studio(p);}
  ST.try=i.id;Say.speak(`${i.name}. ${i.price} coins.`+((p.coins||0)>=i.price?(tod?'':' Tap the big green button to get it.'):(tod?'':' Keep playing to earn more coins.')));studio(p);});
 on('#nt',()=>{ST.try=null;studio(p);});
 on('#buy',()=>{const i=AVA.ITEMS[ST.try];if(!i||(p.coins||0)<i.price)return;p.coins-=i.price;p.owned.push(i.id);p.look[i.slot]=i.id;ST.try=null;save();Snd.good();Say.speak(`You got the ${i.name}!`);studio(p);});}

// ---- Block Park (ckl-v19): obstacle course with the child's own avatar. Same unlock and countdown as the Style Studio. ----
function park(p){xsInit(p);if(funLeft(p)<=0)return timeUp(p);if(!funT)funEnter();if(used(p)>=S.limit)return rest(p);const tod=p.world==='dino';
 p.park=Object.assign({best:0,fin:0,runs:0,cd:{},fd:''},p.park||{});p.park.runs++;save();
 h(`<div class="screen park" id="pkHost"></div>`);const host=$('#pkHost');let G=null;
 const tick=()=>{const s=funTick(p);if(G)G.setX(`⏳ ${mmss(s)}`);if(s<=0){xsStop();timeUp(p);}};
 PARK.start(host,{look:p.look,best:p.park.best,coins:()=>p.coins||0,say:t=>Say.speak(t),
  sfx:k=>{if(k==='good')Snd.good();else if(k==='soft')Snd.soft();else if(k==='jump')Snd.tone(520,.08,'triangle',0,.06);else if(k==='tap')Snd.tap();else if(k==='bell')[784,659,523].forEach((f,i)=>Snd.tone(f,.7,'sine',i*.3,.18));},
  chest:id=>{const d=today();p.park.cd=p.park.cd||{};if(p.park.cd[id]===d){Say.speak('This chest is empty today. It fills up again tomorrow.');return;}p.park.cd[id]=d;p.coins=(p.coins||0)+PARK_CHEST;save();if(G)G.setCoins(p.coins);Snd.good();Say.speak(`You found ${PARK_CHEST} coins!`);},
  finish:(ms,falls)=>{const d=today(),first=p.park.fd!==d,nb=ms>0&&(!p.park.best||ms<p.park.best);p.park.fin++;if(nb)p.park.best=ms;if(first){p.park.fd=d;p.coins=(p.coins||0)+PARK_FINISH;}save();if(G){G.setCoins(p.coins);if(nb)G.setBest(ms);}
   Snd.good();const t=PARK.fmt(ms),mm=Math.floor(ms/60000),ss=Math.round(ms/1000)%60;
   Say.speak(`You finished! Your time was ${mm?mm+' minute'+(mm===1?'':'s')+' and ':''}${ss} seconds.${nb?' That is your best time!':''}`);
   const o=document.createElement('div');o.className='pk-win';o.innerHTML=`<div class="pk-card"><div class="big-emoji">🏁🎉</div><h2>${tod?'':'You finished the course!'}</h2><p class="lead">⏱ ${t}${nb?' · 🏆 New best!':' · 🏆 Best '+PARK.fmt(p.park.best)}</p>${first?`<p>🪙 +${PARK_FINISH} coins</p>`:''}<button class="btn" id="pkAgain">🔁 ${tod?'':'Play again'}</button> <button class="btn ghost" id="pkOut">⬅ ${tod?'':'Back'}</button></div>`;host.appendChild(o);
   o.querySelector('#pkAgain').onclick=()=>{o.remove();if(G)G.restart();};o.querySelector('#pkOut').onclick=()=>studio(p);},
  exit:()=>studio(p),ready:g=>{G=g;tick();}});
 xsTimer=setInterval(tick,1000);
 Say.speak(tod?'Block Park! Push the circle to walk.':'Welcome to Block Park! Use the joystick to walk, Jump to hop, and the hand to use things. Reach the flag!');}
const PARK_CHEST=2,PARK_FINISH=3;
function timeUp(p){xsStop();ST.try=null;funT=0;const tod=p.world==='dino';const i=funInfo(p),need=Math.max(1,Math.ceil((i.L-i.prog)/60));Snd.soft();
 h(`<div class="screen center ${tod?'dino':'lab'}"><div class="xs-lock">${miniAva(p,'big')}</div><h1>${tod?'⏳ 👋':'Fun time is finished for now'}</h1><p class="lead">${tod?'📚 ➡️ 🎉':`Your look and your Block Park best time are saved. Play lesson games for ${need} more minute${need===1?'':'s'} to earn ${i.c.fun} more minutes of fun.`}</p>${funMeter(p)}<button class="btn huge-btn" id="bk" aria-label="back to games">${tod?'🦕':'⬅ Back to the lab'}</button></div>`);
 Say.speak(tod?'Fun time is finished. Let us play a learning game!':'Fun time is finished for now. Everything is saved. Let us do some lesson games, then you can play again.');on('#bk',()=>tod?dinoHome(p):labHome(p));}
function dashXS(p,i){xsInit(p);const x=p.xs,owned=(p.owned||[]).length;
 return `<div class="xsrow small">🎨 Extracurricular: <b>🪙 ${p.coins||0}</b> coins · ${owned} item${owned===1?'':'s'} bought · 🧱 Block Park best ${p.park&&p.park.best?PARK.fmt(p.park.best):'none yet'} · <button class="btn sm" data-cp="${i}">+10 🪙</button> <button class="btn sm" data-cm="${i}">−10 🪙</button>
 <br>Learn, then play: every <select data-xr="${i}">${[10,15,20,25,30,40].map(n=>`<option ${n===x.lesMin?'selected':''}>${n}</option>`).join('')}</select> lesson minutes earn <select data-xt="${i}">${[5,10,15,20].map(n=>`<option ${n===x.funMin?'selected':''}>${n}</option>`).join('')}</select> fun minutes · <label><input type="checkbox" data-xp="${i}" ${x.parent?'checked':''}> Grown-up PIN unlock</label>
 <br>Today: ${(()=>{const f=funInfo(p);return `📚 lesson ${Math.floor(f.les/60)} min · 🎉 fun earned ${Math.round(f.earned/60)} min · used ${Math.round(f.used/60)} min · left ${mmss(f.left)} · next fun in ${Math.ceil((f.L-f.prog)/60)} lesson min`;})()}
 ${(p.xsUntil||0)>Date.now()?` · <b>Open now</b> <button class="btn sm" data-xl="${i}">Lock now</button>`:''}</div>`;}
function dashXSWire(){const P=el=>S.profiles[+Object.values(el.dataset)[0]];
 on('[data-cp]',el=>{const p=P(el);p.coins=(p.coins||0)+10;save();dash();});on('[data-cm]',el=>{const p=P(el);p.coins=Math.max(0,(p.coins||0)-10);save();dash();});
 on('[data-xl]',el=>{P(el).xsUntil=0;save();dash();});
 document.querySelectorAll('[data-xp],[data-xm],[data-xb],[data-xr],[data-xt]').forEach(el=>el.addEventListener('change',()=>{const p=P(el),x=p.xs,d=el.dataset;
  if('xp' in d)x.parent=el.checked;if('xr' in d)x.lesMin=+el.value;if('xt' in d)x.funMin=+el.value;save();dash();}));}
// Parent / teacher analytics (ckl-v17). Everything stays on this device in localStorage.
// Storage per profile (compact daily aggregates, never raw logs):
//   p.an={d:{'YYYY-MM-DD':{w:{wingId:[answered,firstTryRight,seconds]},c:{code:[answered,right,seconds]}}},t:{...lifetime totals, same shape}}
// Only the newest AN_DAYS days are kept; older days are folded into the lifetime totals p.an.t.
const AN_DAYS=30,AN_MIN=8;
const SUBJ={MT:'Maths',LA:'Language Arts',ST:'Science',SS:'Social Studies'};
function anCode(q,w){const s=String(q.std||'');const m=s.match(/\b(MT|LA|ST|SS)\.\d\.[A-Z]+(?:\.[A-Z]+)?\.?\d*/);if(m)return m[0].replace(/\.$/,'');const m2=s.match(/\b\d-(ST|SS|LA|MT)-[A-Z]+-\d+/);if(m2)return m2[0];
 const sub=/math/i.test(w.subject)?'MT':/science|agri/i.test(w.subject)?'ST':/social/i.test(w.subject)?'SS':/english|language/i.test(w.subject)?'LA':'MT';return sub+'.'+(w.grade||3)+'.'+w.id;}
const anSubj=code=>SUBJ[(code.match(/(MT|LA|ST|SS)/)||[])[1]]||'Maths';
const AREA=[[/NS\.OS/,'adding, subtracting, multiplying and dividing'],[/NS\.UN/,'understanding numbers (place value, fractions, decimals)'],[/NS\.NP/,'number patterns and skip counting'],[/NS\.PR/,'ratio, percent and proportion'],[/UM\.MW/,'money'],[/UM\.UT/,'telling and working out time'],[/UM\.LM|UM\.M/,'measuring length, mass and capacity'],[/GT\.PS/,'flat shapes, angles and perimeter'],[/GT\.SS/,'solid (3D) shapes'],[/GT/,'shapes and space'],[/DH|DA/,'data and graphs'],[/LA.*VB/,'word meaning and vocabulary'],[/LA.*GM/,'grammar'],[/LA.*R/,'reading'],[/LA.*WR/,'writing'],[/LA/,'language arts'],[/ESS/,'earth, weather and water'],[/LS/,'living things and the environment'],[/PS/,'forces, energy and materials'],[/TE|STSE/,'science and technology in daily life'],[/ST/,'science'],[/SS/,'social studies'],[/MT/,'maths']];
const anLabel=code=>(AREA.find(([r])=>r.test(code))||[0,code])[1];
function anAdd(o,k,c,s){const v=o[k]||(o[k]=[0,0,0]);v[0]++;v[1]+=c?1:0;v[2]+=s;}
function anPrune(p){const a=p.an;const days=Object.keys(a.d).sort();while(days.length>AN_DAYS){const d=days.shift(),x=a.d[d];for(const g of['w','c'])for(const k in x[g]||{}){const t=a.t[g]||(a.t[g]={}),v=t[k]||(t[k]=[0,0,0]);x[g][k].forEach((n,i)=>v[i]+=n);}delete a.d[d];}}
// Called once per question when it is finally answered: right = correct on the first try without help.
function anRecord(p,w,q,right,ms){p.an=p.an||{d:{},t:{}};const d=today(),x=p.an.d[d]||(p.an.d[d]={w:{},c:{}}),s=Math.min(120,Math.round(ms/1000));anAdd(x.w,w.id,right,s);anAdd(x.c,anCode(q,w),right,s);anPrune(p);}
function anPlay(p,id){p.an=p.an||{d:{},t:{}};const d=today(),x=p.an.d[d]||(p.an.d[d]={w:{},c:{}});x.w[id]=x.w[id]||[0,0,0];x.w[id][0]++;anPrune(p);}
function anSum(p,g,days){const out={};const D=(p.an||{}).d||{};Object.keys(D).sort().slice(-(days||AN_DAYS)).forEach(d=>{for(const k in D[d][g]||{}){const v=out[k]||(out[k]=[0,0,0]);D[d][g][k].forEach((n,i)=>v[i]+=n);}});return out;}
const pct=v=>v[0]?Math.round(100*v[1]/v[0]):0;
const fmtT=s=>s>=3600?Math.floor(s/3600)+' h '+Math.round(s%3600/60)+' min':s>=60?Math.round(s/60)+' min':s+' s';
function bar(label,val,max,txt,cls){const w=max?Math.max(2,Math.round(100*val/max)):0;return `<div class="anrow"><span class="anl">${esc(label)}</span><span class="anbar"><span class="anfill ${cls||''}" style="width:${w}%"></span></span><span class="anv">${txt}</span></div>`;}
const accCls=a=>a>=80?'good':a>=60?'mid':'low';
function anFocus(p){const c=anSum(p,'c');const L=Object.entries(c).filter(([k,v])=>v[0]>=AN_MIN).map(([k,v])=>({k,v,a:pct(v)})).sort((x,y)=>x.a-y.a);
 if(!L.length)return{msg:`Not enough data yet. Each skill needs at least ${AN_MIN} answers before we judge it.`,items:[]};
 const weak=L.filter(x=>x.a<85).slice(0,3);if(!weak.length)return{msg:'Every skill practised enough is at 85% or better. Keep going, and try a new wing!',items:[]};return{msg:'',items:weak};}
function anWingSubj(w){return /math/i.test(w.subject)?'Maths':/science|agri/i.test(w.subject)?'Science':/social/i.test(w.subject)?'Social Studies':'Language Arts';}
function analytics(i){const p=S.profiles[i];stopClock();const dino=p.world==='dino';const W=dino?TODDLER:ALLW().filter(w=>(w.grade||3)===gradeOf(p)||(p.prog||{})[w.id]);
 const ws=anSum(p,'w'),cs=anSum(p,'c');let html='';
 if(dino){const mx=Math.max(1,...W.map(w=>(p.prog[w.id]||{}).plays||0));
  html=`<section class="panel"><h2>Games played (all time)</h2>${W.map(w=>bar(w.icon+' '+w.title,(p.prog[w.id]||{}).plays||0,mx,((p.prog[w.id]||{}).plays||0)+' rounds')).join('')}<p class="small">Toddler games have no right or wrong scores, so we only show how often each game is enjoyed. Every finished round is a win!</p></section>
  <section class="panel"><h2>Last 30 days</h2>${(()=>{const L=W.map(w=>[w,(ws[w.id]||[0])[0]]);const m=Math.max(1,...L.map(x=>x[1]));return L.map(([w,n])=>bar(w.icon+' '+w.title,n,m,n+' rounds')).join('');})()}</section>`;}
 else{const sub={};for(const k in cs){const s=anSubj(k),v=sub[s]||(sub[s]=[0,0,0]);cs[k].forEach((n,j)=>v[j]+=n);}
  const subs=Object.keys(SUBJ).map(k=>SUBJ[k]).filter(s=>sub[s]);const tmax=Math.max(1,...subs.map(s=>sub[s][2]));
  const days=Object.keys((p.an||{}).d||{}).sort().slice(-14);
  const miss=Object.entries(cs).filter(([k,v])=>v[0]>=3&&v[0]>v[1]).sort((a,b)=>(b[1][0]-b[1][1])-(a[1][0]-a[1][1])||pct(a[1])-pct(b[1])).slice(0,5);
  const f=anFocus(p);
  html=`<section class="panel"><h2>🎯 Focus on next</h2>${f.msg?`<p>${f.msg}</p>`:`<ol class="anfocus">${f.items.map(x=>`<li><b>${esc(anSubj(x.k))}: ${esc(anLabel(x.k))}</b> <span class="small">(${x.k}) · ${x.a}% right first time over ${x.v[0]} answers</span></li>`).join('')}</ol>`}</section>
  <section class="panel"><h2>Accuracy by subject <span class="small">(right first time, last 30 days)</span></h2>${subs.length?subs.map(s=>bar(s,pct(sub[s]),100,pct(sub[s])+'% of '+sub[s][0],accCls(pct(sub[s])))).join(''):'<p class="small">No answers yet.</p>'}</section>
  <section class="panel"><h2>Time spent by subject <span class="small">(last 30 days)</span></h2>${subs.length?subs.map(s=>bar(s,sub[s][2],tmax,fmtT(sub[s][2]),'time')).join(''):'<p class="small">No time recorded yet.</p>'}</section>
  <section class="panel"><h2>By game</h2>${W.map(w=>{const v=ws[w.id]||[0,0,0],big=(w.grade||3)>=3;return bar(w.icon+' '+w.title,pct(v),100,(v[0]?pct(v)+'% of '+v[0]:'not played')+(big?` · 📚 ${svCount(p,w)}/${svSize(p,w)} solved`:''),v[0]?accCls(pct(v)):'');}).join('')}</section>
  <section class="panel"><h2>Trend <span class="small">(recent play days)</span></h2>${days.length?`<div class="antrend">${days.map(d=>{const x=p.an.d[d];let a=0,c=0;for(const k in x.w){a+=x.w[k][0];c+=x.w[k][1];}const pc=a?Math.round(100*c/a):0;return `<div class="ancol" title="${d}"><span class="anpct">${pc}%</span><span class="ancolbar"><span class="anfill ${accCls(pc)}" style="height:${Math.max(3,pc)}%"></span></span><span class="small">${d.slice(5)}</span><span class="small">${a} q</span></div>`;}).join('')}</div>`:'<p class="small">No play days yet.</p>'}</section>
  <section class="panel"><h2>Most-missed skills <span class="small">(last 30 days)</span></h2>${miss.length?`<table class="antab"><tr><th>Skill</th><th>Code</th><th>Missed</th><th>Right first time</th></tr>${miss.map(([k,v])=>`<tr><td>${esc(anSubj(k)+': '+anLabel(k))}</td><td>${k}</td><td>${v[0]-v[1]} of ${v[0]}</td><td>${pct(v)}%</td></tr>`).join('')}</table>`:'<p class="small">Nothing missed often yet (or not enough data).</p>'}</section>`;}
 h(`<div class="screen analytics"><header class="top"><button class="btn ghost" id="bk">⬅ Back</button><h1>📊 ${esc(p.avatar+' '+p.name)}</h1><span class="small">${dino?'Dino Truck Town':'Grade '+gradeOf(p)} · ⭐ ${p.stars||0} · 🪙 ${p.coins||0}</span></header>${html}<p class="small">All of this is worked out on this device only. Nothing is sent anywhere.</p></div>`);on('#bk',dash);}
function classView(){stopClock();const rows=S.profiles.map((p,i)=>{if(p.world==='dino'){const n=Object.values(anSum(p,'w')).reduce((s,v)=>s+v[0],0);return `<tr><td>${esc(p.avatar+' '+p.name)}</td><td>Dino</td><td>${n} rounds</td><td>-</td><td>-</td><td>-</td><td><button class="btn sm" data-an="${i}">Open</button></td></tr>`;}
 const cs=anSum(p,'c'),t=[0,0,0];for(const k in cs)cs[k].forEach((n,j)=>t[j]+=n);const W=ALLW().filter(w=>(w.grade||3)===gradeOf(p)&&(w.grade||3)>=3);const sv=W.reduce((s,w)=>s+svCount(p,w),0),tot=W.reduce((s,w)=>s+svSize(p,w),0);const f=anFocus(p);
 return `<tr><td>${esc(p.avatar+' '+p.name)}</td><td>Grade ${gradeOf(p)}</td><td>${t[0]} answers · ${fmtT(t[2])}</td><td>${t[0]?pct(t)+'%':'-'}</td><td>${W.length?sv+'/'+tot:'-'}</td><td>${f.items.length?f.items.map(x=>esc(anLabel(x.k))).join('; '):'<span class="small">'+(f.msg.startsWith('Not')?'not enough data yet':'all good')+'</span>'}</td><td><button class="btn sm" data-an="${i}">Open</button></td></tr>`;}).join('');
 h(`<div class="screen analytics"><header class="top"><button class="btn ghost" id="bk">⬅ Back</button><h1>🏫 Class overview</h1><span class="small">last 30 days</span></header><section class="panel"><table class="antab"><tr><th>Player</th><th>Level</th><th>Activity</th><th>Right first time</th><th>Solved</th><th>Focus on next</th><th></th></tr>${rows||'<tr><td colspan="7">No players yet.</td></tr>'}</table></section></div>`);
 on('#bk',dash);on('[data-an]',el=>analytics(+el.dataset.an));}

window.CKL={S,home,park,funInfo,funLeft,xsOpen_:(...a)=>xsOpen(...a),isInstalled,xsOpen,studio,timeUp,save,askPin,POOLS,poolFor,solve,svCount,svHas,anPrune,anSum}; // internals exposed for on-device tests only
home();
})();
