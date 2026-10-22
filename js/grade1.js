// Grade 1 wings (OECS Grade 1 Learning Standards). Questions are generated fresh each round.
// Every question carries the OECS code it practises (std). Simple words; TTS reads question and answers.
(function(){
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const mix=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
// Build 3 answer options: the right one plus two different wrong ones.
function opts(right,wrongs){const w=[...new Set(wrongs.map(String))].filter(x=>x!==String(right));const c=[String(right)].concat(mix(w).slice(0,2));return {c,a:0};}
const W=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
const pics=(e,n,cls)=>`<div class="g1pics ${cls||''}" role="img" aria-label="${n} pictures">${Array.from({length:n},(_,i)=>`<span>${e}</span>`).join('')}</div>`;
const THINGS=[['🥭','mangoes'],['🐟','fish'],['🐢','turtles'],['🐚','shells'],['⭐','stars'],['🍌','bananas'],['🌺','flowers'],['🐐','goats'],['🥁','drums'],['⛵','boats']];
const ten=(arr,make)=>{const out=[];let i=0;while(out.length<12){out.push(make(arr[i%arr.length],i));i++;}return out;};
// ---------- 1. Number Notes Count-Along ----------
function genNumbers(){const kinds=mix(['count','count','more','less','compare','word','skip10','skip2','skip5','back','order','ordinal']);
 return kinds.map(k=>{
  if(k==='count'){const n=R(6,20),t=pick(THINGS);return Object.assign(opts(n,[n-1,n+1,n+2]),{q:`How many ${t[1]}?`,svg:pics(t[0],n),why:`Count them one by one: there are ${n} ${t[1]}.`,std:'MT.1.NS.UN.3'});}
  if(k==='more'){const n=R(2,19),t=pick(THINGS);return Object.assign(opts(n+1,[n,n-1,n+2]),{q:`Here are ${n} ${t[1]}. What is one more than ${n}?`,svg:pics(t[0],n),why:`One more than ${n} is ${n+1}.`,std:'MT.1.NS.UN.4'});}
  if(k==='less'){const n=R(3,20),t=pick(THINGS);return Object.assign(opts(n-1,[n,n+1,n-2]),{q:`Here are ${n} ${t[1]}. What is one less than ${n}?`,svg:pics(t[0],n),why:`One less than ${n} is ${n-1}.`,std:'MT.1.NS.UN.4'});}
  if(k==='compare'){let a=R(1,20),b;do{b=R(1,20)}while(b===a);const big=Math.random()<.5;const r=big?Math.max(a,b):Math.min(a,b);return {q:`Which number is ${big?'greater than':'less than'} the other: ${a} or ${b}?`,c:[String(r),String(r===a?b:a)],a:0,why:`${r} is ${big?'greater than':'less than'} ${r===a?b:a}.`,std:'MT.1.NS.UN.5'};}
  if(k==='word'){const n=R(11,20);return Object.assign(opts(W[n],[W[n-10],W[Math.min(20,n+1)],W[n-1]]),{q:`Which word says the number <b class="g1num">${n}</b>?`,say:`Which word says this number? It is ${n}.`,why:`${n} is written ${W[n]}.`,std:'MT.1.NS.UN.6'});}
  if(k==='skip10'){const s=R(1,6)*10;return Object.assign(opts(s+30,[s+40,s+21,s+25]),{q:`Count by tens: ${s}, ${s+10}, ${s+20}, ... What comes next?`,why:`Counting by tens: ${s+20}, then ${s+30}.`,std:'MT.1.NS.UN.1'});}
  if(k==='skip2'){const s=R(1,20)*2;return Object.assign(opts(s+6,[s+5,s+7,s+8]),{q:`Count by twos: ${s}, ${s+2}, ${s+4}, ... What comes next?`,why:`Counting by twos: ${s+4}, then ${s+6}.`,std:'MT.1.NS.UN.1'});}
  if(k==='skip5'){const s=R(1,7)*5;return Object.assign(opts(s+15,[s+11,s+20,s+14]),{q:`Count by fives: ${s}, ${s+5}, ${s+10}, ... What comes next?`,why:`Counting by fives: ${s+10}, then ${s+15}.`,std:'MT.1.NS.UN.1'});}
  if(k==='back'){const s=R(5,10);return Object.assign(opts(s-3,[s-4,s-2,s+1]),{q:`Count backwards: ${s}, ${s-1}, ${s-2}, ... What comes next?`,why:`Going back one each time: ${s-2}, then ${s-3}.`,std:'MT.1.NS.UN.1'});}
  if(k==='order'){const s=R(20,95);return Object.assign(opts(s+1,[s+2,s-1,s+10]),{q:`Count on from ${s}: ${s-1}, ${s}, ... What number comes next?`,why:`After ${s} comes ${s+1}.`,std:'MT.1.NS.UN.1'});}
  const row=mix(['🐢','🐟','🐐','🦀','🐔','🐶','🐱','🐸']).slice(0,R(5,8)),names={'🐢':'turtle','🐟':'fish','🐐':'goat','🦀':'crab','🐔':'chicken','🐶':'dog','🐱':'cat','🐸':'frog'},ORD=['first','second','third','fourth','fifth'];const p=R(0,4);
  return Object.assign(opts(names[row[p]],row.filter((_,i)=>i!==p).map(e=>names[e])),{q:`The animals are in a line. Start at the arrow. Which animal is ${ORD[p]}?`,svg:`<div class="g1pics line" role="img" aria-label="a line of animals">➡️ ${row.map(e=>`<span>${e}</span>`).join('')}</div>`,say:`The animals are in a line. Start at the arrow and count. Which animal is ${ORD[p]}?`,why:`Count from the arrow: the ${ORD[p]} animal is the ${names[row[p]]}.`,std:'MT.1.NS.UN.7'});});}
// ---------- 2. Add-and-Take Beaker Lab ----------
function genAdd(){const kinds=mix(['add3','add3','add2','add2','mental','mental','take','take','take','groups','groups','sentence']);
 return kinds.map(k=>{
  if(k==='add3'||k==='add2'){let a,b,c;do{a=R(1,9);b=R(1,9);c=k==='add3'?R(1,9):0;}while(a+b+c>20);const t=pick(THINGS),s=a+b+c;
   return Object.assign(opts(s,[s-1,s+1,s+2]),{q:k==='add3'?`${a} + ${b} + ${c} = ?`:`${a} + ${b} = ?`,say:k==='add3'?`${a} plus ${b} plus ${c}. How many altogether?`:`${a} plus ${b}. How many altogether?`,svg:`<div class="g1groups">${pics(t[0],a)}<b>+</b>${pics(t[0],b)}${c?'<b>+</b>'+pics(t[0],c):''}</div>`,why:`${[a,b,c].filter(Boolean).join(' + ')} = ${s}.`,std:'MT.1.NS.OS.4'});}
  if(k==='mental'){let a,b;do{a=R(2,9);b=R(2,9)}while(a+b>18);return Object.assign(opts(a+b,[a+b-1,a+b+1,a+b+2]),{q:`Think in your head: ${a} + ${b} = ?`,say:`Think in your head. ${a} plus ${b}?`,why:`${a} + ${b} = ${a+b}.`,std:'MT.1.NS.OS.5'});}
  if(k==='take'){const n=R(5,20),m=R(1,Math.min(9,n-1)),t=pick(THINGS);return Object.assign(opts(n-m,[n-m+1,n-m-1,n+m]),{q:`${n} ${t[1]}. Take away ${m}. How many are left?`,say:`There are ${n} ${t[1]}. Take away ${m}. How many are left?`,svg:`<div class="g1pics" role="img" aria-label="${n} pictures, ${m} crossed out">${Array.from({length:n},(_,i)=>`<span class="${i>=n-m?'gone':''}">${t[0]}</span>`).join('')}</div>`,why:`${n} take away ${m} leaves ${n-m}.`,std:'MT.1.NS.OS.6'});}
  if(k==='groups'){let g,e;do{g=R(2,4);e=R(2,4)}while(g*e>12);const t=pick(THINGS);return Object.assign(opts(g*e,[g*e-1,g*e+1,g+e]),{q:`${g} groups of ${e} ${t[1]}. How many altogether?`,svg:`<div class="g1groups">${Array.from({length:g},()=>`<div class="grp">${pics(t[0],e)}</div>`).join('')}</div>`,why:`${Array(g).fill(e).join(' + ')} = ${g*e}. ${g} groups of ${e} make ${g*e}.`,std:'MT.1.NS.OS.8'});}
  const a=R(3,9),b=R(1,a-1),t=pick(THINGS);return Object.assign(opts(`${a} − ${b} = ${a-b}`,[`${a} + ${b} = ${a+b}`,`${b} − ${a} = ${a-b}`,`${a} − ${b} = ${a+b}`]),{q:`Kemi had ${a} ${t[1]}. Kemi gave away ${b}. Which number sentence tells the story?`,say:`Kemi had ${a} ${t[1]}. Kemi gave away ${b}. Which number sentence tells the story?`,svg:pics(t[0],a),why:`Gave away means take away: ${a} − ${b} = ${a-b}.`,std:'MT.1.NS.OS.7'});});}
// ---------- 3. Little EC Money Shop ----------
const M=(items,o)=>window.ART.money(items,o);
const VAL={'5c':5,'10c':10,'$1':100,'$5':500,'$10':1000};
const NAME={'5c':'5 cents','10c':'10 cents','$1':'1 dollar','$5':'5 dollars','$10':'10 dollars'};
const fmt=c=>c<100?c+'c':'$'+(c/100);
function genMoney(){const out=[];
 mix(['5c','10c','$1','$5','$10']).forEach(v=>out.push(Object.assign(opts(v,Object.keys(VAL).filter(x=>x!==v)),{q:'Which coin or note is this?',svg:M([v],{hide:true}),say:'Look at the picture. Which coin or note is this?',why:`This is the ${NAME[v]} ${v.includes('c')||v==='$1'?'coin':'note'}.`,std:'MT.1.UM.MW.1'})));
 const sets=[[['10c','10c'],'20c'],[['10c','5c','5c'],'20c'],[['$5','$5'],'$10'],[['$10','$1'],'$11'],[['$5','$5','$1'],'$11'],[['$10','$10'],'$20'],[['$10','$5','$5'],'$20'],[['10c','5c'],'15c'],[['$5','$1'],'$6'],[['$10','$5'],'$15']];
 mix(sets).slice(0,4).forEach(([it,v])=>{const c=VAL[it[0]]<100?['5c','10c','15c','20c','25c','30c']:['$6','$10','$11','$12','$15','$16','$20'];out.push(Object.assign(opts(v,c),{q:'How much money is this?',svg:M(it),say:'How much money is this? The picture shows '+it.map(x=>NAME[x]).join(', and ')+'.',why:`${it.join(' + ')} = ${v}.`,std:'MT.1.UM.MW.2'}));});
 const pairs=mix([['5c','10c'],['10c','$1'],['$1','$5'],['$5','$10'],['5c','$1'],['$10','$1'],['10c','10c'],['$5','$5']]).slice(0,3);
 pairs.forEach(([a,b])=>{const r=VAL[a]>VAL[b]?'more than':VAL[a]<VAL[b]?'less than':'the same value as';out.push({q:`Is ${a} more than, less than, or the same value as ${b}?`,say:`Is ${NAME[a]} more than, less than, or the same value as ${NAME[b]}?`,svg:M([a,b]),c:['more than','less than','the same value as'],a:['more than','less than','the same value as'].indexOf(r),why:`${a} is ${r} ${b}.`,std:'MT.1.UM.MW.3'});});
 out.push(Object.assign(opts('5c',['1c','10c','$1']),{q:'There is no 1-cent coin in EC money. What is our smallest coin?',say:'There is no 1 cent coin in E C money. What is our smallest coin?',why:'The 5-cent coin is the smallest. It is worth five 1-cent pieces.',std:'MT.1.UM.MW.4'}));
 out.push(Object.assign(opts('10',['5','1','20']),{q:'A 10c coin is worth how many 1-cent pieces?',say:'A 10 cent coin is worth how many 1 cent pieces?',svg:M(['10c']),why:'10 cents is worth ten 1-cent pieces.',std:'MT.1.UM.MW.4'}));
 out.push(Object.assign(opts('5',['10','1','2']),{q:'A 5c coin is worth how many 1-cent pieces?',say:'A 5 cent coin is worth how many 1 cent pieces?',svg:M(['5c']),why:'5 cents is worth five 1-cent pieces.',std:'MT.1.UM.MW.4'}));
 return out.map(q=>{q.c=q.c.map(x=>x);return q;});}
// ---------- 4. Days, Months and O'Clock Disco ----------
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
function genTime(){const out=[];const d=new Date();
 for(let i=0;i<2;i++){const k=R(0,6);out.push(Object.assign(opts(DAYS[(k+1)%7],[DAYS[(k+6)%7],DAYS[(k+2)%7],DAYS[(k+3)%7]]),{q:`What day comes after ${DAYS[k]}?`,why:`After ${DAYS[k]} comes ${DAYS[(k+1)%7]}.`,std:'MT.1.UM.UT.1'}));}
 const k2=R(0,6);out.push(Object.assign(opts(DAYS[(k2+6)%7],[DAYS[(k2+1)%7],DAYS[(k2+2)%7],DAYS[(k2+4)%7]]),{q:`What day comes before ${DAYS[k2]}?`,why:`Before ${DAYS[k2]} comes ${DAYS[(k2+6)%7]}.`,std:'MT.1.UM.UT.1'}));
 out.push(Object.assign(opts('7',['5','10','12']),{q:'How many days are in one week?',why:'A week has 7 days: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday and Saturday.',std:'MT.1.UM.UT.1'}));
 for(let i=0;i<2;i++){const m=R(0,10);out.push(Object.assign(opts(MON[m+1],[MON[(m+11)%12],MON[(m+2)%12],MON[(m+5)%12]]),{q:`What month comes after ${MON[m]}?`,why:`After ${MON[m]} comes ${MON[m+1]}.`,std:'MT.1.UM.UT.2'}));}
 out.push(Object.assign(opts('January',['December','March','June']),{q:'What is the first month of the year?',why:'January is the first month. December is the last.',std:'MT.1.UM.UT.2'}));
 out.push(Object.assign(opts(DAYS[d.getDay()],[DAYS[(d.getDay()+1)%7],DAYS[(d.getDay()+6)%7],DAYS[(d.getDay()+3)%7]]),{q:'What day is it today?',why:`Today is ${DAYS[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}.`,std:'MT.1.UM.UT.3'}));
 out.push(Object.assign(opts(MON[d.getMonth()],[MON[(d.getMonth()+1)%12],MON[(d.getMonth()+11)%12],MON[(d.getMonth()+6)%12]]),{q:'What month is it now?',why:`It is ${MON[d.getMonth()]}. Today is ${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}.`,std:'MT.1.UM.UT.3'}));
 for(let i=0;i<4;i++){const h=R(1,12);out.push(Object.assign(opts(`${h} o'clock`,[`${h%12+1} o'clock`,`${(h+10)%12+1} o'clock`,`12 o'clock`]),{q:'What time does the clock show?',svg:window.ART.clock(h,0),say:'Look at the clock. The long hand points to 12. What time is it?',why:`The short hand points to ${h} and the long hand points to 12: it is ${h} o'clock.`,std:'MT.1.UM.UT.6'}));}
 for(let i=0;i<2;i++){const h=R(1,12);out.push(Object.assign(opts(`${h}:00`,[`12:${String(h).padStart(2,'0')}`,`${h%12+1}:00`,`${h}:30`]),{q:`Another way to write ${h} o'clock is...`,say:`Another way to write ${h} o'clock is which one?`,why:`${h} o'clock is written ${h}:00.`,std:'MT.1.UM.UT.7'}));}
 const h3=R(1,11);out.push(Object.assign(opts(`${h3}`,['12',`${h3+1}`,`${(h3+5)%12+1}`]),{q:`To show ${h3} o'clock, the long hand points to 12. Where does the short hand point?`,why:`At ${h3} o'clock the short hand points to ${h3}.`,std:'MT.1.UM.UT.8'}));
 return out;}
// ---------- 5. Sound Lab Phonics ----------
const RHY=[['cat','🐱',['hat','mat','bat'],['dog','sun','cup']],['dog','🐶',['log','frog'],['cat','bed','pin']],['sun','☀️',['bun','run','fun'],['hat','pig','box']],['bee','🐝',['tree','see'],['cow','map','bus']],['goat','🐐',['boat','coat'],['fish','drum','pen']],['fish','🐟',['dish','wish'],['ball','tap','sock']],['king','👑',['ring','sing'],['cake','dot','hen']],['bed','🛏️',['red','fed'],['pig','cup','sun']]];
const START=[['ball','⚽',['bat','bus','bell'],['cat','sun','fish','dog']],['mango','🥭',['moon','map','milk'],['tree','cat','goat']],['sun','☀️',['sea','sand','sock'],['dog','pig','map']],['fish','🐟',['fan','fox','five'],['bus','hat','ten']],['turtle','🐢',['ten','top','tap'],['dog','sun','fan']],['goat','🐐',['gate','girl','gum'],['map','bed','cup']]];
const CVC=[['cat','🐱'],['dog','🐶'],['pig','🐷'],['sun','☀️'],['hen','🐔'],['bus','🚌'],['fox','🦊'],['bed','🛏️'],['map','🗺️'],['cup','🥤'],['pin','📌'],['net','🥅']];
const SYL=[['drum','🥁',1],['crab','🦀',1],['mango','🥭',2],['turtle','🐢',2],['monkey','🐒',2],['banana','🍌',3],['butterfly','🦋',3],['coconut','🥥',3],['dinosaur','🦕',3],['goat','🐐',1]];
function genSounds(){const out=[];
 mix(RHY).slice(0,3).forEach(([w,e,r,n])=>{const a=pick(r);out.push(Object.assign(opts(a,n),{q:`Which word rhymes with <b>${w}</b> ${e}?`,say:`Which word rhymes with ${w}?`,why:`${w[0].toUpperCase()+w.slice(1)} and ${a} rhyme. They both end with "${w.slice(w.search(/[aeiou]/))}".`,std:'LA.1.R.KB.4'}));});
 mix(START).slice(0,2).forEach(([w,e,s,n])=>{const a=pick(s);out.push(Object.assign(opts(a,n),{q:`Which word starts with the same sound as <b>${w}</b> ${e}?`,say:`Which word starts with the same sound as ${w}?`,why:`${w[0].toUpperCase()+w.slice(1)} and ${a} both start with the letter ${w[0]}.`,std:'LA.1.R.PA.3'}));});
 mix(CVC).slice(0,6).forEach(([w,e],i)=>{const pos=i%3,P=['first','middle','last'][pos],L=w[pos],others='abcdefghijklmnopqrstuvwxyz'.split('').filter(x=>!w.includes(x));
  out.push(Object.assign(opts(L,[w[(pos+1)%3],w[(pos+2)%3],pick(others)]),{q:`Say <b>${w}</b> ${e} slowly. Which letter makes the ${P} sound?`,say:`Say ${w} slowly. ${w.split('').join(', ')}. Which letter makes the ${P} sound?`,why:`${w}: ${w.split('').join(' - ')}. The ${P} sound is ${L}.`,std:pos===1?'LA.1.R.PA.2':'LA.1.R.KB.1'}));});
 mix(SYL).slice(0,3).forEach(([w,e,n])=>out.push(Object.assign(opts(String(n),['1','2','3','4']),{q:`Clap the beats in <b>${w}</b> ${e}. How many claps?`,say:`Clap the beats in ${w}. How many claps?`,why:`${w} has ${n} beat${n>1?'s':''} (syllable${n>1?'s':''}).`,std:'LA.1.R.PA.1'})));
 const b=pick(CVC);out.push(Object.assign(opts(b[0],mix(CVC.filter(x=>x!==b)).slice(0,3).map(x=>x[0])),{q:`Put the sounds together: ${b[0].split('').join(' - ')}. What word is it?`,say:`Put the sounds together. ${b[0].split('').join(', ')}. What word is it?`,why:`${b[0].split('').join(' - ')} makes ${b[0]} ${b[1]}.`,std:'LA.1.R.PA.4'}));
 return out;}
// ---------- 6. Living or Not? Senses and Weather ----------
const LIV=[['🐐','goat',1],['🌳','tree',1],['🐟','fish',1],['🦜','parrot',1],['🌺','flower',1],['🐢','turtle',1],['🪨','rock',0],['🚗','car',0],['🥁','drum',0],['⚽','ball',0],['🪑','chair',0],['🐚','empty shell',0]];
const SENSE=[['eyes','👀','see'],['ears','👂','hear'],['nose','👃','smell'],['tongue','👅','taste'],['skin','✋','feel']];
const WX=[['sunny','☀️'],['rainy','🌧️'],['windy','🌬️'],['cloudy','☁️'],['stormy','⛈️']];
function genScience(){const out=[];
 const l=mix(LIV.filter(x=>x[2])),n=mix(LIV.filter(x=>!x[2]));
 for(let i=0;i<2;i++){const r=l[i];out.push({q:'Which one is living?',svg:`<div class="g1pics big">${[r,n[i],n[i+2]].map(x=>`<span>${x[0]}</span>`).join('')}</div>`,c:[r[1],n[i][1],n[i+2][1]],a:0,why:`A ${r[1]} is living. It grows, needs food and water, and makes young.`,std:'ST.1.LS.DC.1'});}
 out.push({q:'Which one is non-living?',svg:'',c:[n[4][1],l[3][1],l[4][1]],a:0,why:`A ${n[4][1]} is non-living. It does not grow, eat or breathe.`,std:'ST.1.LS.DC.1'});
 out.push(Object.assign(opts('They grow',['They are hard','They are shiny','They are blue']),{q:'What do all living things do?',why:'All living things grow. They also need food and water, breathe, and make young.',std:'ST.1.LS.DC.2'}));
 out.push(Object.assign(opts('Food and water',['Paint','Batteries','Toys']),{q:'What do all living things need?',why:'Living things need food and water to stay alive.',std:'ST.1.LS.DC.2'}));
 mix(SENSE).slice(0,3).forEach(([o,e,v])=>out.push(Object.assign(opts(o,SENSE.map(x=>x[0])),{q:`Which body part do we use to ${v}?`,svg:'',why:`We ${v} with our ${o} ${e}.`,std:'ST.1.LS.ECS.10'})));
 out.push(Object.assign(opts('5',['3','4','6']),{q:'How many sense organs do we have?',why:'We have 5 sense organs: eyes, ears, nose, tongue and skin.',std:'ST.1.LS.ECS.10'}));
 mix(WX).slice(0,2).forEach(([w,e])=>out.push(Object.assign(opts(w,WX.map(x=>x[0])),{q:'What is the weather like?',svg:`<div class="g1pics big"><span>${e}</span></div>`,say:'Look at the picture. What is the weather like?',why:`The picture shows ${w} weather.`,std:'ST.1.ESS.EW.1'})));
 out.push(Object.assign(opts('to drink',['to paint a wall red','to fly a kite','to read a book']),{q:'What is one way we use water?',why:'We use water to drink, to cook, to wash and to water plants.',std:'ST.1.ESS.ER.5'}));
 out.push(Object.assign(opts('the sea',['a rock','the sky at night','a book']),{q:'Where can we find water around Carriacou?',why:'Water is found in the sea, in rain, in ponds and in tanks and cisterns.',std:'ST.1.ESS.ER.5'}));
 // Grenada national symbols (SS.1.NI.1-3). Facts: flag red, yellow, green with 7 stars and a nutmeg; national bird the Grenada Dove; national dish oil down; national flower bougainvillea.
 const NI=[{q:'Our flag of Grenada has a picture of which spice?',c:['nutmeg','pepper','ginger'],a:0,why:'The Grenada flag has a nutmeg on it. Grenada is the Spice Isle.',std:'SS.1.NI.2'},
  {q:'What colours are on the flag of Grenada?',c:['red, yellow and green','blue and white','black and orange'],a:0,why:'The flag of Grenada is red, yellow and green, with seven stars.',std:'SS.1.NI.3'},
  {q:'What is the national bird of Grenada?',c:['the Grenada Dove','the parrot','the pelican'],a:0,why:'The Grenada Dove is our national bird.',std:'SS.1.NI.2'},
  {q:'What is the national dish of Grenada?',c:['oil down','pizza','hot dog'],a:0,why:'Oil down is the national dish of Grenada.',std:'SS.1.NI.2'}];
 mix(NI).slice(0,2).forEach(x=>out.push(x));
 return out;}
window.G1_WINGS=[
{id:'g1num',grade:1,badge:'Number Notes Star',title:'Number Notes Count-Along',subject:'Mathematics',topic:'Counting to 20, count by 2s, 5s, 10s',icon:'🔢',gen:genNumbers,
 source:'OECS Grade 1 Mathematics Learning Standards, Number Sense MT.1.NS.UN.1, UN.3 to UN.7',
 intro:'Let’s count! Count things, find one more and one less, and count by twos, fives and tens.'},
{id:'g1add',grade:1,badge:'Beaker Builder',title:'Add-and-Take Beaker Lab',subject:'Mathematics',topic:'Add and take away to 20, groups of',icon:'🧪',gen:genAdd,
 source:'OECS Grade 1 Mathematics Learning Standards, Operations MT.1.NS.OS.4 to OS.8',
 intro:'Mix numbers in the beaker! Add them together or take some away.'},
{id:'g1money',grade:1,badge:'Money Shop Helper',title:'Little EC Money Shop',subject:'Mathematics',topic:'5c, 10c, $1, $5, $10',icon:'🪙',gen:genMoney,
 source:'OECS Grade 1 Mathematics Learning Standards, Money MT.1.UM.MW.1 to MW.4 (Eastern Caribbean currency)',
 intro:'Welcome to the little shop! Our coins are 5 cents, 10 cents and 1 dollar. Our notes are 5 dollars and 10 dollars. The pictures show real EC money, for learning only.'},
{id:'g1time',grade:1,badge:'Clock Disco Dancer',title:'Days, Months and O’Clock Disco',subject:'Mathematics',topic:'Days, months, today’s date, o’clock',icon:'🕒',gen:genTime,
 source:'OECS Grade 1 Mathematics Learning Standards, Time MT.1.UM.UT.1 to UT.3, UT.6 to UT.8',
 intro:'Dance through the days of the week, the months of the year, and the clock!'},
{id:'g1sound',grade:1,badge:'Sound Lab Star',title:'Sound Lab Phonics',subject:'English',topic:'Rhymes, first, middle and last sounds, syllables',icon:'🎤',gen:genSounds,
 source:'OECS Grade 1 Language Arts Learning Standards, Reading LA.1.R.PA.1 to PA.4, LA.1.R.KB.1, KB.4',
 intro:'Listen carefully! Find words that rhyme, hear the first, middle and last sounds, and clap the beats.'},
{id:'g1life',grade:1,badge:'Nature Scientist',title:'Living or Not? Senses and Weather',subject:'Science and Social Studies',topic:'Living things, senses, weather, water, Grenada symbols',icon:'🌱',gen:genScience,
 source:'OECS Grade 1 Science and Technology ST.1.LS.DC.1-2, ST.1.LS.ECS.10, ST.1.ESS.EW.1, ST.1.ESS.ER.5; Social Studies SS.1.NI.2-3',
 intro:'Be a nature scientist! Is it living or not? Which sense do we use? What is the weather? Plus our Grenada symbols.'}];
})();
