// ckl-v18: turns the fact banks (bank_*.js) into fixed 100-question pools with stable ids.
// Each wing gets w.bank (all active items, each with a permanent id like 'g5m-042') and w.poolVer=2.
// The ckl-v17 pool source is kept as w.legacyGen / w.legacyQ so app.js can carry old solved flags across (see migrateSV).
(function(){
const ALL=[].concat(window.G3_WINGS||[],window.G4_WINGS||[],window.G5_WINGS||[],window.G6_WINGS||[]);
const G3P={clues:'c3',water:'w3',weather:'e3',crops:'k3'};
const A4=window.G4ART||{},A5=window.G5ART||{},A6=window.G6ART||{};
const art=a=>{const [k,x,y]=a;switch(k){
 case 'cloud':return A4.cloud(x);case 'compass':return A4.compass(x);case 'therm':return A4.therm(x);case 'sh2d':return A4.SH2D[x];
 case 'circ':return y&&A5.circ&&ART_G==='g5'?A5.circ(x,y):A4.circ(x,y);
 case 'reg':return A5.reg(x);case 'quad':return A5.QUAD[x];case 'tri':return A5.TRI[x];case 'circuit':return A5.circuit(x);case 'lever':return A5.lever;case 'chain':return A5.chainSV(A5.CHAINS[x]);
 case 'volc':return A6.volc;case 'flower':return A6.flower;}return '';};
let ART_G='';
for(const w of ALL){const B=(window.BANKS||{})[w.id];if(!B)continue;ART_G=(w.grade||3)===5?'g5':'';
 const legacy=G3P[w.id]?(w.questions||[]).map((q,i)=>Object.assign({},q,{id:G3P[w.id]+'-'+String(i+1).padStart(3,'0'),src:'L'})):[];
 const fin=(w.grade===5&&A5.fin)||(w.grade===6&&A6.fin6)||(x=>x);
 const items=legacy.concat(B.map(b=>{const q=Object.assign({},b);if(q.art){q.svg=art(q.art);delete q.art;}return (w.grade>=5)?fin(q):q;}));
 w.legacyGen=w.gen;w.legacyQ=w.questions;w.bank=items;w.questions=items;delete w.gen;w.poolVer=2;}
})();
