// Grade 3 question generators (ckl-v17). Keeps every curated question from lessons.js and adds
// generated items in the same style so each Grade 3 maths wing has a pool of 100+ distinct questions.
// Scope kept to OECS Grade 3: numbers to 999, x2 to x6 (plus x10, x100), EC money to $50, time to the quarter hour.
(function(){
const A=window.ART,R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const uniq=(right,wrong)=>{const w=[];for(const x of wrong){const s=String(x);if(s!==String(right)&&!w.includes(s)&&w.length<2)w.push(s);}return w;};
const Q=(q,right,wrong,why,std,extra)=>Object.assign({q,c:[String(right)].concat(uniq(right,wrong)),a:0,why,std},extra||{});
const ONES=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const w2=n=>n<20?ONES[n]:TENS[Math.floor(n/10)]+(n%10?'-'+ONES[n%10]:'');
const words=n=>{const h=Math.floor(n/100),r=n%100;return h?ONES[h]+' hundred'+(r?' and '+w2(r):''):w2(r);};
const W=id=>(window.G3_WINGS||[]).find(w=>w.id===id);
const wrap=(id,fn)=>{const w=W(id);if(!w)return;const cur=w.questions.slice();w.gen=()=>cur.concat(fn());};

// ---- Rhythm: skip counting, x2 to x6, division, x10/x100, remainders
wrap('rhythm',()=>{const o=[];
 {const s=pick([2,3,4,5,10,20,25,100]),st=s*R(0,s>=100?6:s>=20?8:12),b=[st,st+s,st+2*s,st+3*s];o.push(Q(`Skip count by ${s}s: ${b.join(', ')}, … What comes next?`,st+4*s,[st+4*s+1,st+3*s+1,st+5*s],`Add ${s} each beat: ${st+3*s} + ${s} = ${st+4*s}.`,'MT.3.NS.NP.1',{beat:b}));}
 {const s=pick([2,5,10,100]),top=s*R(6,s===100?9:20),b=[top,top-s,top-2*s];o.push(Q(`Count back in ${s}s: ${b.join(', ')}, … What comes next?`,top-3*s,[top-3*s+1,top-s*2+1,top-4*s],`Take away ${s} each beat: ${top-2*s} − ${s} = ${top-3*s}.`,'MT.3.NS.NP.1',{beat:b}));}
 {const a=R(2,6),b=R(1,10);o.push(Q(`What is ${a} × ${b}?`,a*b,[a+b,a*b+a,a*(b-1)||a*b+1],`${a} groups of ${b} make ${a*b}.`,'MT.3.NS.OS.5'));}
 {const a=R(2,6),b=R(2,10),n=a*b;o.push(Q(`What is ${n} ÷ ${a}?`,b,[b+1,b-1,a],`${n} ÷ ${a} = ${b}, because ${a} × ${b} = ${n}.`,'MT.3.NS.OS.5'));}
 {const a=R(2,6),b=R(2,9),t=pick([['rows of chairs at the pageant','chairs'],['baskets of mangoes','mangoes'],['boats in the regatta, each with the same crew','sailors'],['packs of crayons','crayons']]);o.push(Q(`There are ${a} ${t[0]} with ${b} ${t[1]} in each. How many ${t[1]} altogether?`,a*b,[a+b,a*b+b,a*b-1],`${a} groups of ${b}: ${a} × ${b} = ${a*b}.`,'MT.3.NS.OS.5'));}
 {const a=R(2,6),b=R(2,9),n=a*b,t=pick(['sweets','shells','marbles','stickers','oranges']);o.push(Q(`${n} ${t} are shared equally among ${a} children. How many does each child get?`,b,[b+1,n-a,a],`${n} ÷ ${a} = ${b}, because ${a} × ${b} = ${n}.`,'MT.3.NS.OS.5'));}
 {const n=R(11,99),m=pick([10,100]);if(n*m<=9999)o.push(Q(`What is ${n} × ${m}?`,n*m,[n+m,n*(m===10?100:10),Number(String(n)+'1')],`Multiplying by ${m} moves each digit ${m===10?'one place':'two places'} left: ${n*m}.`,'MT.3.NS.OS.6'));}
 {const d=R(2,6),q=R(2,9),r=R(1,d-1),n=d*q+r;o.push(Q(`${n} mangoes are packed in bags of ${d}. How many full bags, and how many left over?`,`${q} bags, ${r} left over`,[`${q+1} bags, 0 left over`,`${q-1} bags, ${r+d} left over`,`${q} bags, ${r+1} left over`],`${q} × ${d} = ${q*d}, and ${n} − ${q*d} = ${r}. That is ${q} bags with ${r} left over.`,'MT.3.NS.OS.7'));}
 {const a=R(2,6),b=R(2,9);o.push(Q(`${Array(a).fill(b).join(' + ')} is the same as…`,`${a} × ${b}`,[`${b} + ${a}`,`${b} × ${b}`,`${a} × ${a}`],`${a} groups of ${b} is ${a} × ${b} = ${a*b}.`,'MT.3.NS.OS.7'));}
 return o;});

// ---- Place value: numbers to 999
wrap('placevalue',()=>{const o=[],N=()=>R(101,999),dg=n=>String(n).split('').map(Number);
 {const n=N(),[h,t,u]=dg(n);o.push(Q('Which number do these blocks show?',n,[u*100+t*10+h,h*100+u*10+t,t*100+h*10+u],`${h} hundreds, ${t} tens and ${u} ones make ${n}.`,'MT.3.NS.UN.1',{svg:A.blocks(h,t,u)}));}
 {const n=N();o.push(Q(`Write ${words(n)} in numbers.`,n,[Number(String(n).split('').reverse().join('')),n+10,Math.floor(n/100)*1000+n%100],`${words(n)} is ${n}.`,'MT.3.NS.UN.1'));}
 {const n=N();o.push(Q(`How do we write ${n} in words?`,words(n),[words(Number(String(n)[0]+String(n)[2]+String(n)[1])),words(n%100===0?n+1:n-1)],`${n} is ${words(n)}.`,'MT.3.NS.UN.1'));}
 {const n=N(),[h,t,u]=dg(n);o.push(Q(`What number is ${[h*100,t*10,u].filter(x=>x).join(' + ')}?`,n,[h*1000+t*10+u,h*100+u*10+t,n+100],`${h} hundreds, ${t} tens and ${u} ones make ${n}.`,'MT.3.NS.UN.1'));}
 {const n=N(),d=dg(n),pos=R(0,2);if(d[pos]){const v=d[pos]*[100,10,1][pos];o.push(Q(`In ${n}, what is the value of the digit ${d[pos]}?`,v,[d[pos],d[pos]*10,d[pos]*100,d[pos]*1000],`${d[pos]} is in the ${['hundreds','tens','ones'][pos]} place, so its value is ${v}.`,'MT.3.NS.UN.2'));}}
 {const n=N(),d=dg(n),pl=R(0,2);o.push(Q(`Which digit is in the ${['hundreds','tens','ones'][pl]} place of ${n}?`,d[pl],[d[(pl+1)%3],d[(pl+2)%3],(d[pl]+1)%10],`${n} = ${d[0]} hundreds, ${d[1]} tens, ${d[2]} ones.`,'MT.3.NS.UN.2'));}
 {const h=R(1,9),u=R(1,9),n=h*100+u;o.push(Q(`${h} hundreds, 0 tens and ${u} ones make…`,n,[h*10+u,h*100+u*10,h*1000+u],`Zero holds the tens place: ${n}.`,'MT.3.NS.UN.2'));}
 {let a=N(),b=N();if(a!==b)o.push(Q(`Which number is greater, ${a} or ${b}?`,Math.max(a,b),[Math.min(a,b),'they are equal'],`Compare the hundreds first, then the tens, then the ones: ${Math.max(a,b)} is greater.`,'MT.3.NS.UN.2'));}
 {const s=new Set();while(s.size<3)s.add(N());const L=[...s],up=L.slice().sort((x,y)=>x-y);o.push(Q(`Put these numbers in order from smallest to largest: ${L.join(', ')}.`,up.join(', '),[up.slice().reverse().join(', '),[up[1],up[0],up[2]].join(', '),[up[0],up[2],up[1]].join(', ')],`Compare hundreds first, then tens, then ones: ${up.join(', ')}.`,'MT.3.NS.UN.4'));}
 {const n=R(11,999);if(n%10){const r=Math.round(n/10)*10;o.push(Q(`Round ${n} to the nearest ten.`,r,[r===Math.floor(n/10)*10?r+10:r-10,n],`${n} is closer to ${r}${n%10===5?' (a 5 in the ones place rounds up)':''}.`,'MT.3.NS.UN.5'));}}
 {const n=R(101,949);if(n%100){const r=Math.round(n/100)*100;o.push(Q(`Round ${n} to the nearest hundred.`,r,[r===Math.floor(n/100)*100?r+100:r-100,Math.round(n/10)*10],`${n} is closer to ${r}${n%100===50?' (50 rounds up)':''}.`,'MT.3.NS.UN.5'));}}
 return o;});

// ---- Money: EC$ to $50
const fmt=c=>c<100?c+'c':'$'+(c%100?(c/100).toFixed(2):c/100);
wrap('money',()=>{const o=[];
 {const coins=[];let n=R(2,5);while(n--)coins.push(pick(['25c','10c','5c']));coins.sort((a,b)=>parseInt(b)-parseInt(a));const t=coins.reduce((s,x)=>s+parseInt(x),0);o.push(Q('How much money is this?',fmt(t),[fmt(t+5),fmt(t+10),fmt(Math.max(5,t-5))],`${coins.join(' + ')} = ${t}c.`,'MT.3.UM.MW.1',{svg:A.money(coins)}));}
 {const notes=[];let n=R(2,3);while(n--)notes.push(pick(['$20','$10','$5']));notes.sort((a,b)=>parseInt(b.slice(1))-parseInt(a.slice(1)));const extra=Math.random()<.5?pick(['25c','$1']):null,items=extra?notes.concat([extra]):notes,t=items.reduce((s,x)=>s+(x.endsWith('c')?parseInt(x):parseInt(x.slice(1))*100),0);if(t<=5000)o.push(Q('How much money is this?',fmt(t),[fmt(t+500),fmt(Math.max(500,t-500)),fmt(t+100)],`${items.join(' + ')} = ${fmt(t)}.`,'MT.3.UM.MW.2',{svg:A.money(items)}));}
 {const a=R(1,20),b=R(1,20),t=pick([['a mango','a coconut water'],['fresh fish','bread'],['a straw hat','a bag'],['a kite','a ball'],['a pineapple','a bunch of bananas']]);if(a+b<=50)o.push(Q(`${t[0][0].toUpperCase()+t[0].slice(1)} costs $${a} and ${t[1]} costs $${b}. What is the total?`,'$'+(a+b),['$'+Math.abs(a-b),'$'+(a+b+1),'$'+(a+b+10)],`$${a} + $${b} = $${a+b}.`,'MT.3.UM.MW.4'));}
 {const n=R(2,6),p=R(2,8);o.push(Q(`${['Two','Three','Four','Five','Six'][n-2]} bunches of bananas cost $${p} each. What is the total?`,'$'+n*p,['$'+(n+p),'$'+(n*p+p),'$'+(n*p-1)],`${n} × $${p} = $${n*p}.`,'MT.3.UM.MW.4'));}
 {const pay=pick([10,20,50]),c=R(1,pay-1);o.push(Q(`You pay with a $${pay} note for goods costing $${c}. How much change?`,'$'+(pay-c),['$'+(pay+c),'$'+(pay-c+1),'$'+(pay-c+10)],`Count up from $${c} to $${pay}: $${pay-c}.`,'MT.3.UM.MW.4'));}
 {const pay=pick([5,10,20]),c=R(pay*2-8,pay*4-2)*25;if(c<pay*100&&c>100&&c%100){const ch=pay*100-c;o.push(Q(`You pay $${pay} for a snack costing ${fmt(c)}. How much change?`,fmt(ch),[fmt(ch+100),fmt(Math.abs(ch-50)||75),fmt(ch+25)],`${fmt(c)} + ${fmt(ch)} = $${pay}.`,'MT.3.UM.MW.4'));}}
 {const h=R(10,50),c=R(1,h-1);o.push(Q(`You have $${h}. A toy costs $${c}. How much will be left?`,'$'+(h-c),['$'+(h+c),'$'+(h-c+1),'$'+Math.max(1,h-c-2)],`$${h} − $${c} = $${h-c}.`,'MT.3.UM.MW.5'));}
 {const d=R(1,5),coin=pick([5,10,25]);o.push(Q(`How many ${coin}-cent coins make $${d}?`,d*100/coin,[d*100/coin+d,d*coin,d*10],`$${d} = ${d*100} cents, and ${d*100} ÷ ${coin} = ${d*100/coin}.`,'MT.3.UM.MW.1'));}
 {const note=pick([5,10]),t=note*R(2,10);if(t<=50&&t!==note)o.push(Q(`How many $${note} notes make $${t}?`,t/note,[t/note+1,t/note-1||t/note+2,t],`${t/note} × $${note} = $${t}.`,'MT.3.UM.MW.2'));}
 {const a=R(100,4999),b=R(100,4999);if(a!==b){const ta=pick(['A jar of nutmeg jam','A bag of cocoa balls','A bottle of sorrel']),tb=pick(['a coconut tart','a pack of saltfish','a box of guava cheese']);o.push(Q(`${ta} costs ${fmt(a)} and ${tb} costs ${fmt(b)}. Which costs more?`,a>b?ta.replace(/^A /,'the '):tb.replace(/^a /,'the '),[a>b?tb.replace(/^a /,'the '):ta.replace(/^A /,'the '),'they cost the same'],`${fmt(Math.max(a,b))} is more than ${fmt(Math.min(a,b))}.`,'MT.3.UM.MW.3'));}}
 return o;});

// ---- Clock: quarter hours, past/to, digits, durations
const HW=['twelve','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
const say=(h,m)=>m===0?`${HW[h]} o'clock`:m===15?`quarter past ${HW[h]}`:m===30?`half past ${HW[h]}`:`quarter to ${HW[h%12+1]}`;
const dig=(h,m)=>`${h}:${String(m).padStart(2,'0')}`;
wrap('clock',()=>{const o=[],h=R(1,12),m=pick([0,15,30,45]);
 o.push(Q('What time is it?',say(h,m),[say(h%12+1,m),say(h,(m+30)%60),say(h,m===15?45:m===45?15:(m+15))],`The short hand shows the hour and the long hand shows the minutes: ${say(h,m)} (${dig(h,m)}).`,'MT.3.UM.UT.2',{svg:A.clock(h,m)}));
 {const h2=R(1,12),m2=pick([0,15,30,45]);o.push(Q('What time is it in digits?',dig(h2,m2),[dig(h2%12+1,m2),dig(h2,(m2+30)%60),`${m2/5||12}:${String(h2*5%60).padStart(2,'0')}`],`${say(h2,m2)[0].toUpperCase()+say(h2,m2).slice(1)} is written ${dig(h2,m2)}.`,'MT.3.UM.UT.2',{svg:A.clock(h2,m2)}));}
 {const h3=R(1,12),m3=pick([0,15,30,45]);o.push(Q(`How do we write ${say(h3,m3)} in digits?`,dig(h3,m3),[dig(h3%12+1,m3),dig(h3,(m3+30)%60),dig(h3,m3===15?45:m3===45?15:(m3+15)%60)],`${say(h3,m3)[0].toUpperCase()+say(h3,m3).slice(1)} is ${dig(h3,m3)}.`,'MT.3.UM.UT.2'));}
 {const sh=R(1,9),sm=pick([0,15,30,45]),d=pick([15,30,45,60,75,90,120]),e=sh*60+sm+d,eh=Math.floor(e/60),em=e%60,ds=d<60?`${d} minutes`:d%60?`1 hour ${d%60} minutes`:`${d/60} hour${d>60?'s':''}`,wd=[15,30,45,60,75,90,120].filter(x=>x!==d).map(x=>x<60?`${x} minutes`:x%60?`1 hour ${x%60} minutes`:`${x/60} hour${x>60?'s':''}`);
  if(eh<=12)o.push(Q(`Steel pan practice starts at ${dig(sh,sm)} and ends at ${dig(eh,em)}. How long is it?`,ds,[pick(wd),pick(wd),wd[0],wd[1]],`From ${dig(sh,sm)} to ${dig(eh,em)} is ${ds}.`,'MT.3.UM.UT.4'));}
 return o;});

// ---- Shapes: 3D solids (cube, cuboid, cylinder, cone, sphere)
const S={cube:{f:6,e:12,v:8,face:'squares',roll:'no',stack:'yes'},cuboid:{f:6,e:12,v:8,face:'rectangles',roll:'no',stack:'yes'},cylinder:{f:2,e:2,v:0,face:'circles',roll:'yes',stack:'yes'},cone:{f:1,e:1,v:1,face:'a circle',roll:'yes',stack:'no'},sphere:{f:0,e:0,v:0,face:'none (it has no flat faces)',roll:'yes',stack:'no'}};
const OBJ=[['a dice','cube'],['a sugar cube','cube'],['a building block with all sides equal','cube'],['a shoebox','cuboid'],['a brick','cuboid'],['a cereal box','cuboid'],['a book','cuboid'],['a juice box','cuboid'],['a fridge','cuboid'],['a tin of milk','cylinder'],['a candle','cylinder'],['a toilet roll','cylinder'],['a can of sardines (round)','cylinder'],['a glue stick','cylinder'],['a water tank (round)','cylinder'],['an ice cream cone','cone'],['a party hat','cone'],['a traffic cone','cone'],['a funnel top without the spout','cone'],['a football','sphere'],['a marble','sphere'],['a globe','sphere'],['a cricket ball','sphere'],['a bubble','sphere']].filter(x=>!/funnel/.test(x[0]));
const NM=Object.keys(S);
wrap('shapes',()=>{const o=[];
 for(const k of NM){const s=S[k];
  o.push(Q(`How many flat faces does a ${k} have?`,s.f,[s.f+1,s.f+2,Math.max(0,s.f-1)],`A ${k} has ${s.f} flat face${s.f===1?'':'s'}.`,'MT.3.GT.SS.1, SS.2',{art:k}));
  o.push(Q(`How many edges does a ${k} have?`,s.e,[s.e+1,s.e+2,s.e===12?8:s.e+4],`A ${k} has ${s.e} edge${s.e===1?'':'s'}.${k==='cylinder'||k==='cone'?' Its edges are curved, where the flat circle meets the curved surface.':''}`,'MT.3.GT.SS.1, SS.2',{art:k}));
  o.push(Q(`How many vertices (corners) does a ${k} have?`,s.v,[s.v+1,s.v+2,s.v===8?6:4],`A ${k} has ${s.v} ${s.v===1?'vertex':'vertices'}.`,'MT.3.GT.SS.1, SS.2',{art:k}));
  o.push(Q(`Does a ${k} have a curved surface?`,k==='cube'||k==='cuboid'?'no':'yes',['yes','no'],k==='cube'||k==='cuboid'?`A ${k} has only flat faces.`:`A ${k} has a curved surface.`,'MT.3.GT.SS.2 (type of faces: flat or curved)',{art:k}));
  o.push(Q(`Can a ${k} roll?`,s.roll,['yes','no'],s.roll==='yes'?`A ${k} has a curved surface, so it can roll.`:`A ${k} has only flat faces, so it slides but does not roll.`,'MT.3.GT.SS.2 (type of faces: flat or curved)',{art:k}));
  o.push(Q(`Can you stack a ${k} on top of another one the same, standing on a flat face?`,s.stack,['yes','no'],s.stack==='yes'?`A ${k} has flat faces it can stand on, so it stacks.`:k==='sphere'?'A sphere has no flat face, so it will not stack.':'A cone comes to a point, so another cone cannot stand on top of it.','MT.3.GT.SS.2 (type of faces: flat or curved)',{art:k}));
 }
 for(const [ob,sh] of OBJ){o.push(Q(`${ob[0].toUpperCase()+ob.slice(1)} is shaped like a…`,sh,NM.filter(x=>x!==sh).sort(()=>Math.random()-.5),`${ob[0].toUpperCase()+ob.slice(1)} is a ${sh}: ${S[sh].f} flat face${S[sh].f===1?'':'s'}, ${S[sh].e} edge${S[sh].e===1?'':'s'}, ${S[sh].v} ${S[sh].v===1?'vertex':'vertices'}.`,'MT.3.GT.SS.3',{art:sh}));
  o.push(Q(`Which 3D shape is NOT the same shape as ${ob}?`,pick(NM.filter(x=>x!==sh)),[sh,sh],`${ob[0].toUpperCase()+ob.slice(1)} is a ${sh}, so the other shape is different.`,'MT.3.GT.SS.3'));}
 const rev=[['Which 3D shape has 6 square faces?','cube'],['Which 3D shape has 6 faces that are rectangles?','cuboid'],['Which 3D shape has 2 flat circle faces and a curved surface?','cylinder'],['Which 3D shape has 1 flat circle face and comes to a point?','cone'],['Which 3D shape has only one curved surface and no flat faces?','sphere'],['Which 3D shape has 8 vertices and all its edges the same length?','cube'],['Which 3D shape has 1 vertex?','cone'],['Which 3D shape has exactly 2 curved edges?','cylinder'],['Which 3D shape can roll and can also stack?','cylinder']];
 for(const [q,a] of rev)o.push(Q(q,a,NM.filter(x=>x!==a).sort(()=>Math.random()-.5),`The ${a}: ${S[a].f} flat face${S[a].f===1?'':'s'} (${S[a].face}), ${S[a].e} edge${S[a].e===1?'':'s'}, ${S[a].v} ${S[a].v===1?'vertex':'vertices'}.`,'MT.3.GT.SS.2, SS.4',{art:a}));
 const pairs=[['cube','cuboid'],['cone','cylinder'],['cube','cylinder'],['cube','sphere'],['cone','sphere'],['cuboid','cylinder']];
 for(const [a,b] of pairs){const d=S[a].v-S[b].v;o.push(Q(`How many more vertices does a ${a} have than a ${b}?`,d,[d+1,d+2,S[a].v],`A ${a} has ${S[a].v} and a ${b} has ${S[b].v}: ${S[a].v} − ${S[b].v} = ${d}.`,'MT.3.GT.SS.4'));
  o.push(Q(`A ${a} and a ${b}: how many flat faces altogether?`,S[a].f+S[b].f,[S[a].f+S[b].f+1,S[a].f*S[b].f===S[a].f+S[b].f?S[a].f+S[b].f+2:S[a].f*S[b].f,Math.abs(S[a].f-S[b].f)],`${S[a].f} + ${S[b].f} = ${S[a].f+S[b].f}.`,'MT.3.GT.SS.4'));}
 return o;});
})();
