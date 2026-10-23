// Block Park (ckl-v19): a blocky 3D obstacle course the child plays as their own avatar.
// Offline: three.js is vendored at js/vendor/three.min.js and loaded only when the park opens. Textures are drawn in code.
// Nothing leaves the device. Saved per profile in p.park: best time, finishes, chest/finish coin days.
(function(){
const PARK={};let G=null;
function loadThree(cb){if(window.THREE)return cb();const s=document.createElement('script');s.src='js/vendor/three.min.js';s.onload=()=>cb();s.onerror=()=>cb('fail');document.head.appendChild(s);}
// ---------- pixel textures ----------
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hex(c){c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return[parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)];}
function sh(c,f){const[r,g,b]=hex(c);const k=x=>Math.max(0,Math.min(255,Math.round(x*f)));return`rgb(${k(r)},${k(g)},${k(b)})`;}
function canvasTex(fn,n=16,seed=7){const c=document.createElement('canvas');c.width=c.height=n;const g=c.getContext('2d');fn(g,rng(seed),n);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.encoding=THREE.sRGBEncoding;return t;}
const px=(g,x,y,c)=>{g.fillStyle=c;g.fillRect(x,y,1,1);};
const noise=(base,v)=>(g,r,n)=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++)px(g,x,y,sh(base,1+(r()-.5)*v));};
const T={
 grassTop:noise('#5fae3a',.35),dirt:noise('#8b5a2b',.35),stone:noise('#8d8d8d',.3),sand:noise('#e9d58f',.18),gold:noise('#f2c230',.25),
 grassSide:(g,r,n)=>{noise('#8b5a2b',.35)(g,r,n);for(let x=0;x<n;x++){const d=3+Math.floor(r()*3);for(let y=0;y<d;y++)px(g,x,y,sh('#5fae3a',1+(r()-.5)*.35));}},
 plank:(g,r,n)=>{noise('#b8894f',.18)(g,r,n);g.fillStyle='#7a5530';for(let y=3;y<n;y+=4)g.fillRect(0,y,n,1);for(let y=0;y<n;y+=4){g.fillRect((y*5)%n,y,1,3);}},
 log:(g,r,n)=>{for(let x=0;x<n;x++){const s=x%4===0?.7:1;for(let y=0;y<n;y++)px(g,x,y,sh('#6b4a2b',s*(1+(r()-.5)*.25)));}},
 leaves:noise('#2f7d32',.5),cobble:(g,r,n)=>{noise('#7a7a7a',.5)(g,r,n);g.fillStyle='#555';for(let i=0;i<10;i++)g.fillRect(Math.floor(r()*n),Math.floor(r()*n),3,1);},
 brick:(g,r,n)=>{noise('#c0504d',.2)(g,r,n);g.fillStyle='#e8d8c8';for(let y=0;y<n;y+=4){g.fillRect(0,y,n,1);for(let x=(y/4)%2*4;x<n;x+=8)g.fillRect(x,y,1,4);}},
 iron:(g,r,n)=>{noise('#c9ccd1',.15)(g,r,n);g.fillStyle='#6f747c';for(let x=2;x<n;x+=5)g.fillRect(x,0,2,n);g.fillRect(0,0,n,2);g.fillRect(0,n-2,n,2);},
 wool:noise('#f4f4f4',.12),woolG:noise('#3fbf5f',.15),red:noise('#d93a3a',.15),green:noise('#3fbf5f',.15),
 chest:(g,r,n)=>{noise('#a8722f',.2)(g,r,n);g.fillStyle='#5b3a17';g.fillRect(0,0,n,1);g.fillRect(0,n-1,n,1);g.fillRect(0,6,n,1);g.fillStyle='#d9d9d9';g.fillRect(7,5,2,3);},
 water:(g,r,n)=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++)px(g,x,y,sh('#2b8fd6',1+(r()-.5)*.25+(((x+y)%7===0)?.25:0)));},
 checker:(g,r,n)=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++)px(g,x,y,((x>>2)+(y>>2))%2?'#111':'#fff');},
 sign:(g,r,n)=>{T.plank(g,r,n);g.fillStyle='#3b2a1a';for(let y=4;y<12;y+=3)g.fillRect(3,y,n-6,1);}};
// ---------- avatar colours from the saved look ----------
const PAT={rainbow:['#e63946','#f4a261','#ffd23f','#2a9d4a','#1d7fd6','#6a4cdf'],grenada:['#ce1126','#fcd116','#007a5e'],candy:['#e63946','#fff'],bones:['#111','#eee'],madras:['#e63946','#ffd23f','#1d7fd6','#2a9d4a']};
function patCols(c){if(!c)return null;if(!c.startsWith('pat:'))return[c.slice(0,7)];const s=c.split(':');return PAT[s[1]]||[s[2]||'#ff4fa3',s[3]||'#ffffff'];}
function partTex(c,seed){const cols=patCols(c)||['#888'];return canvasTex((g,r,n)=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++){const k=cols.length>1?cols[Math.floor(y/2)%cols.length]:cols[0];px(g,x,y,sh(k,1+(r()-.5)*.14));}},8,seed);}
function lookCols(look){const A=window.AVA||{ITEMS:{}};const it=s=>A.ITEMS[look[s]]||null;const skin=look.skin||'#9a6440';
 const ch=it('chest'),lg=it('legs'),ft=it('feet'),hr=it('hair'),hd=it('head'),fc=it('face');
 return{skin,shirt:ch?ch.c1:'#ffffff',trim:ch&&ch.c2&&!ch.c2.startsWith('pat')?ch.c2:null,cape:ch&&ch.tpl==='cape',coat:ch&&/labcoat|robe/.test(ch.tpl),
  pants:lg?lg.c1:'#1d7fd6',skirt:lg&&/skirt|tutu/.test(lg.tpl),shoes:ft?ft.c1:'#ffffff',hair:hr&&hr.c1?hr.c1:null,hairTpl:hr?hr.tpl:'',
  hat:hd?{tpl:hd.tpl,c1:hd.c1||'#e63946',c2:(hd.c2&&!hd.c2.startsWith('pat'))?hd.c2:(hd.c3||'#ffffff')}:null,face:fc?{tpl:fc.tpl,c1:(fc.c1||'#222')}:null,
  w:({slim:.9,medium:1,sturdy:1.15})[look.body]||1};}
function M(t){return new THREE.MeshLambertMaterial({map:t});}
function solidMat(c,s){return M(partTex(c,s||3));}
function headMats(C){const n=8,skin=C.skin,hair=C.hair;const f=(draw)=>M(canvasTex((g,r)=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++)px(g,x,y,sh(skin,1+(r()-.5)*.08));draw(g,r);},n,11));
 const hrow=(g,rows,r)=>{if(!hair)return;const cols=patCols(hair);for(let y=0;y<rows;y++)for(let x=0;x<n;x++)px(g,x,y,sh(cols[(x+y)%cols.length],1+(r()-.5)*.25));};
 const long=/long|locs|braids|ponytail|bob|afro|puffs|curly/.test(C.hairTpl);
 const front=f((g,r)=>{hrow(g,2,r);px(g,2,4,'#fff');px(g,3,4,'#1b1b1b');px(g,5,4,'#fff');px(g,4,4,'#1b1b1b');g.fillStyle=sh(skin,.6);g.fillRect(3,6,2,1);
  if(C.face){const c=patCols(C.face.c1)[0];if(/round|square|goggles|shades|mask|visor|scuba|monocle|carnival|threed/.test(C.face.tpl)){g.fillStyle=c;g.fillRect(1,3,6,1);g.fillRect(1,4,2,1);g.fillRect(5,4,2,1);}else{g.fillStyle=c;g.fillRect(1,5,1,1);g.fillRect(6,5,1,1);}}});
 const side=f((g,r)=>{hrow(g,long?6:3,r);}),back=f((g,r)=>{hrow(g,long?8:5,r);}),top=f((g,r)=>{hrow(g,8,r);}),bot=f(()=>{});
 return[side,side,top,bot,front,back];}
function box(w,h,d,mat){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);}
function figure(C){const root=new THREE.Group(),body=new THREE.Group();root.add(body);const W=C.w;
 const sk=solidMat(C.skin,5),sh_=solidMat(C.shirt,6),pa=solidMat(C.pants,7),so=solidMat(C.shoes,8);
 const mk=(w,h,d,mat,x,y,z,piv)=>{const g=new THREE.Group();g.position.set(x,y,z);const m=box(w,h,d,mat);m.position.y=-h/2+(piv||0);g.add(m);body.add(g);return g;};
 const legL=mk(.24*W,.72,.26,pa,-.13*W,.74,0),legR=mk(.24*W,.72,.26,pa,.13*W,.74,0);
 [legL,legR].forEach(l=>{const s=box(.26*W,.16,.3,so);s.position.set(0,-.66,.02);l.add(s);});
 const torso=box(.52*W,.72,.3,sh_);torso.position.y=1.1;body.add(torso);
 if(C.trim){const b=box(.53*W,.08,.31,solidMat(C.trim,9));b.position.y=.8;body.add(b);}
 if(C.skirt){const s=box(.62*W,.3,.4,pa);s.position.y=.66;body.add(s);}
 if(C.cape||C.coat){const c=box(.5*W,C.cape?1:.8,.05,sh_);c.position.set(0,C.cape?.95:.9,-.18);body.add(c);}
 const armL=mk(.18,.68,.22,sh_,-(.26*W+.09),1.44,0),armR=mk(.18,.68,.22,sh_,(.26*W+.09),1.44,0);
 [armL,armR].forEach(a=>{const h=box(.18,.16,.22,sk);h.position.y=-.6;a.add(h);});
 const head=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.5),headMats(C));head.position.y=1.72;body.add(head);
 if(C.hair&&/afro|puffs|hightop|mohawk|spiky|bun/.test(C.hairTpl)){const m=solidMat(C.hair,12);const t=box(C.hairTpl==='mohawk'?.12:.56,.18,C.hairTpl==='mohawk'?.5:.56,m);t.position.y=2.04;body.add(t);}
 if(C.hat){const h=C.hat,m1=solidMat(h.c1,13),m2=solidMat(h.c2,14),add=(w,y,d,mm,z=0,hh=.12,x=0)=>{const b=box(w,hh,d,mm);b.position.set(x,y,z);body.add(b);};
  switch(h.tpl){case'cap':add(.54,2.02,.54,m1);add(.5,1.98,.26,m2,.36);break;
   case'sunhat':case'captain':case'bucket':case'tricorn':case'flowers':add(.86,1.99,.86,m2,0,.05);add(.54,2.06,.54,m1,0,.16);break;
   case'crown':for(const[x,z]of[[-.22,-.22],[.22,-.22],[-.22,.22],[.22,.22],[0,.22],[0,-.22]])add(.1,2.07,.1,m1,z,.16,x);add(.54,1.98,.54,m1,0,.06);break;
   case'headphones':add(.1,1.72,.24,m1,0,.26,-.3);add(.1,1.72,.24,m1,0,.26,.3);add(.6,2.0,.1,m1,0,.06);break;
   case'antenna':case'antlers':add(.06,2.13,.06,m1,0,.3,-.15);add(.06,2.13,.06,m1,0,.3,.15);add(.12,2.3,.12,m2,0,.12,-.15);add(.12,2.3,.12,m2,0,.12,.15);break;
   case'astro':{const g=new THREE.Mesh(new THREE.BoxGeometry(.64,.64,.64),new THREE.MeshLambertMaterial({color:0xbfe6ff,transparent:true,opacity:.35}));g.position.y=1.74;body.add(g);break;}
   case'wizard':case'santa':add(.54,2.03,.54,m1,0,.14);add(.38,2.17,.38,m1,0,.14);add(.2,2.31,.2,m1,0,.14);add(.14,2.42,.14,m2,0,.1);if(h.tpl==='santa')add(.56,1.98,.56,m2,0,.06);break;
   case'pumpkin':add(.56,2.05,.56,m1,0,.22);add(.08,2.2,.08,solidMat('#2a9d4a',15),0,.1);break;
   case'beanie':add(.54,2.03,.54,m1,0,.16);add(.14,2.17,.14,m2,0,.12);break;
   case'tophat':add(.66,1.99,.66,m1,0,.05);add(.42,2.2,.42,m1,0,.4);break;
   case'bow':add(.3,2.02,.12,m1,0,.14);break;
   default:add(.56,2.03,.56,m1,0,.16);}}
 return{root,body,legL,legR,armL,armR};}
// ---------- the course ----------
function build(scene,opt){
 const mats={grass:[M(canvasTex(T.grassSide,16,2)),M(canvasTex(T.grassSide,16,2)),M(canvasTex(T.grassTop,16,1)),M(canvasTex(T.dirt,16,3)),M(canvasTex(T.grassSide,16,2)),M(canvasTex(T.grassSide,16,2))]};
 for(const k of['dirt','stone','sand','gold','plank','log','leaves','cobble','brick','iron','wool','woolG','red','green','chest','checker','sign'])mats[k]=M(canvasTex(T[k],16,k.length*7));
 const vox={},cols=[];const V=(x,y,z,t,half)=>{const k=t+(half?'|h':'');(vox[k]=vox[k]||[]).push([x+.5,half?y+.25:y+.5,z+.5]);};
 const C=(x0,y0,z0,x1,y1,z1,tag)=>{const b={min:[x0,y0,z0],max:[x1,y1,z1],tag:tag||''};cols.push(b);return b;};
 // P: blocks x0..x1, z0..z1 (inclusive), top surface at height top, depth layers below
 const P=(x0,x1,z0,z1,top,t,depth=1,under='dirt',tag)=>{for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)for(let d=0;d<depth;d++)V(x,top-1-d,z,d===0?t:under);C(x0,top-depth,z0,x1+1,top,z1+1,tag);};
 const tree=(x,z,y=0)=>{for(let i=0;i<3;i++)V(x,y+i,z,'log');C(x,y,z,x+1,y+3,z+1);for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)for(let dy=3;dy<5;dy++)if(!(dy===4&&Math.abs(dx)+Math.abs(dz)===2))V(x+dx,y+dy,z+dz,'leaves');C(x-1,y+3,z-1,x+2,y+5,z+2);};
 // start island (in the sea)
 P(-5,5,-6,5,0,'grass',3);tree(-4,-5);tree(4,-5);tree(-4,4);
 // 1 steps up
 P(-1,1,6,6,1,'stone',2);P(-1,1,7,7,2,'stone',3);P(-1,1,8,8,3,'stone',4);P(-1,1,9,9,4,'cobble',2);
 P(-2,2,10,12,4,'plank');
 // 2 gaps to jump
 P(-1,1,14,16,4,'stone');P(1,3,19,21,4,'stone');P(-1,1,24,26,5,'brick');
 P(-2,2,29,33,5,'grass',2);
 // 3 moving platform crosses z 34..45
 P(-2,2,46,51,5,'plank');
 // 4 balance beam
 P(0,0,52,63,5,'log');
 P(-2,2,64,68,5,'grass',2);
 // 5 drawbridge z 69..76 (collider added when lowered)
 P(-2,2,77,80,5,'stone');
 // 6 slide down to the beach: half-block steps, slippery
 for(let i=0;i<10;i++){const top=5-.5*(i+1),z=81+i;for(let x=-1;x<=1;x++){for(let y=-1;y<(top%1?Math.floor(top):top-1);y++)V(x,y,z,'stone');if(top%1)V(x,Math.floor(top),z,'gold',1);else V(x,top-1,z,'gold');}C(-1,-1,z,2,top,z+1,'slide');V(-2,Math.floor(top),z,'red');V(2,Math.floor(top),z,'red');C(-2,-1,z,-1,Math.floor(top)+1,z+1);C(2,-1,z,3,Math.floor(top)+1,z+1);}
 // 7 beach and stepping stones
 P(-6,6,91,95,0,'sand',2,'sand');P(-3,-2,97,98,0,'stone',2);P(0,1,100,101,0,'stone',2);P(-2,-1,103,104,0,'stone',2);P(1,2,106,107,0,'stone',2);
 P(-6,6,109,121,0,'grass',2);tree(-5,120);tree(5,110);
 // 8 lift up to the flag tower
 P(-2,2,116,120,6,'cobble',6,'cobble');
 // instanced voxels
 const g1=new THREE.BoxGeometry(1,1,1),gh=new THREE.BoxGeometry(1,.5,1),mtx=new THREE.Matrix4();
 for(const k in vox){const[t,h]=k.split('|');const L=vox[k];const im=new THREE.InstancedMesh(h?gh:g1,mats[t],L.length);L.forEach((p,i)=>{mtx.makeTranslation(p[0],p[1],p[2]);im.setMatrixAt(i,mtx);});scene.add(im);}
 const cube=(t,x,y,z,parent,s)=>{const m=new THREE.Mesh(g1,mats[t]);m.position.set(x,y,z);if(s)m.scale.set(s[0],s[1],s[2]);(parent||scene).add(m);return m;};
 // movers
 const movers=[];
 const mover=(x0,w,d,top,fn,t)=>{const g=new THREE.Group();for(let x=0;x<w;x++)for(let z=0;z<d;z++)cube(t,x+.5,-.5,z+.5,g);scene.add(g);const b=C(0,0,0,0,0,0,'mover');const m={g,b,w,d,fn,dx:0,dy:0,dz:0};m.set=(time)=>{const p=fn(time);const ox=b.min[0],oy=b.max[1],oz=b.min[2];b.min=[p[0],p[1]-1,p[2]];b.max=[p[0]+w,p[1],p[2]+d];g.position.set(p[0],p[1],p[2]);m.dx=p[0]-ox;m.dy=p[1]-oy;m.dz=p[2]-oz;};m.set(0);m.dx=m.dy=m.dz=0;movers.push(m);return m;};
 const ease=s=>(1-Math.cos(s))/2;
 mover(-1,3,3,5,t=>[-1,5,34+9*ease(t*2*Math.PI/8)],'woolG');
 mover(-1,3,3,0,t=>[-1,.01+6*ease(t*2*Math.PI/7),113],'gold');
 // gate (z=51 row is part of the landing; the gate stands on it)
 const gate=new THREE.Group();for(let x=-2;x<=2;x++)for(let y=0;y<3;y++)cube('iron',x+.5,y+.5,0,gate,[1,1,.4]);gate.position.set(0,5,51.5);scene.add(gate);
 const gateC=C(-2,5,51.3,3,8,51.7);
 // drawbridge, hinged at z=77, standing up until the lever is pulled
 const bridge=new THREE.Group();for(let x=-1;x<=1;x++)for(let z=0;z<8;z++)cube('plank',x+.5,-.5,-z-.5,bridge);bridge.position.set(0,5,77);bridge.rotation.x=Math.PI/2*0.98;scene.add(bridge);
 // sea
 const wt=canvasTex(T.water,16,5);wt.wrapS=wt.wrapT=THREE.RepeatWrapping;wt.repeat.set(120,160);
 const sea=new THREE.Mesh(new THREE.PlaneGeometry(240,320),new THREE.MeshLambertMaterial({map:wt,transparent:true,opacity:.9}));sea.rotation.x=-Math.PI/2;sea.position.set(0,-.6,60);scene.add(sea);
 // clouds
 const clouds=[];for(let i=0;i<14;i++){const c=cube('wool',(i*37%60)-30,18+(i%3)*2,i*11-20,null,[6+(i%4)*2,1,4+(i%3)*2]);clouds.push(c);}
 // things to use
 const its=[],cps=[];
 const signM=(x,y,z)=>{cube('log',x,y+.5,z,null,[.15,1,.15]);cube('sign',x,y+1.1,z,null,[.9,.6,.12]);};
 const sign=(x,y,z,text,label)=>{signM(x,y,z);its.push({k:'sign',x,y,z,label:label||'Read',act:()=>opt.say(text),text});};
 const npc=(x,y,z,text)=>{const f=figure({skin:'#83522f',shirt:'#2ec4b6',pants:'#3a2a7a',shoes:'#ffd23f',hair:'#1b1b1b',hairTpl:'puffs',w:1,hat:{tpl:'sunhat',c1:'#e8c872',c2:'#e63946'}});f.root.position.set(x,y,z);f.root.rotation.y=Math.PI;scene.add(f.root);its.push({k:'npc',x,y,z,label:'Talk',fig:f,act:()=>opt.say(text),text});};
 const chest=(id,x,y,z)=>{const base=cube('chest',x,y+.3,z,null,[.8,.6,.8]);const lid=new THREE.Group();lid.position.set(x,y+.6,z-.4);const l=cube('chest',0,.1,.4,lid,[.8,.2,.8]);scene.add(lid);its.push({k:'chest',id,x,y,z,label:'Open',lid,act:it=>opt.chest(it)});};
 const cp=(i,x,y,z)=>{cube('log',x,y+.8,z,null,[.12,1.6,.12]);const f=cube('wool',x+.3,y+1.4,z,null,[.5,.35,.06]);cps.push({i,x,y,z,flag:f,on:i===0});if(i===0)f.material=mats.woolG;};
 cp(0,-1.5,0,-3);cp(1,0,5,31);cp(2,-1.5,5,47.5);cp(3,0,5,66);cp(4,0,0,93);cp(5,1.2,0,111);
 sign(-2.5,0,-1.5,'Welcome to Block Park! Push the joystick to walk. Tap Jump to hop. Tap the hand to use things. Get to the flag at the end!');
 npc(2.5,0,-1.5,'Hi, I am Coach Kiki! If you fall in the sea, you go back to the last flag you touched. Touch the white flags to save your place.');
 sign(2.5,4,11.5,'Jump across the gaps. Run, then jump near the edge.');
 chest('a',-1.5,5,32.5);sign(1.5,5,33.3,'Wait for the green platform to come close, then step on. Stand still while it moves.');
 its.push({k:'button',x:1.8,y:5,z:50.3,label:'Press',act:it=>opt.gate(it)});const bp=cube('stone',1.8,5.45,50.3,null,[.45,.9,.45]),bb=cube('red',1.8,5.95,50.3,null,[.3,.18,.3]);its[its.length-1].mesh=bb;
 npc(1.5,5,64.5,'Pull the lever to lower the bridge, then walk across.');
 its.push({k:'lever',x:-1.5,y:5,z:67.8,label:'Pull',act:it=>opt.lever(it)});cube('cobble',-1.5,5.1,67.8,null,[.5,.2,.5]);const lv=new THREE.Group();lv.position.set(-1.5,5.2,67.8);cube('log',0,.3,0,lv,[.1,.6,.1]);lv.rotation.x=.6;scene.add(lv);its[its.length-1].mesh=lv;
 chest('b',1.5,5,67.8);
 sign(1.8,5,79.5,'Wheee! Slide down to the beach.');
 sign(-4,0,94,'Hop across the stepping stones. Take your time.');
 chest('c',-4.5,0,112);npc(3.5,0,112.5,'Ride the yellow lift up to the flag tower!');
 its.push({k:'bell',x:1.6,y:6,z:119.6,label:'Ring',act:it=>opt.bell(it)});cube('log',1.6,7.4,119.6,null,[1,.15,.15]);const bell=cube('gold',1.6,6.95,119.6,null,[.45,.5,.45]);its[its.length-1].mesh=bell;cube('log',1.15,6.7,119.6,null,[.12,1.4,.12]);cube('log',2.05,6.7,119.6,null,[.12,1.4,.12]);
 // finish flag
 cube('log',0,6+1.5,118,null,[.15,3,.15]);const flag=new THREE.Mesh(new THREE.BoxGeometry(1.2,.8,.05),mats.checker);flag.position.set(.65,6+2.6,118);scene.add(flag);
 return{mats,cols,movers,gate,gateC,bridge,its,cps,clouds,wt,flag,finish:{x:0,y:6,z:118}};}
// ---------- game ----------
PARK.start=function(host,opt){PARK.stop();loadThree(err=>{if(err||!window.THREE){host.innerHTML='<p class="lead">The park could not load on this device.</p>';return;}run(host,opt);});};
function run(host,opt){
 const cv=document.createElement('canvas');cv.className='pk-cv';host.appendChild(cv);
 const ren=new THREE.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'high-performance'});ren.outputEncoding=THREE.sRGBEncoding;ren.setPixelRatio(Math.min(window.devicePixelRatio||1,1.25));
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x8fd3ff);scene.fog=new THREE.Fog(0x8fd3ff,28,70);
 const cam=new THREE.PerspectiveCamera(60,1,.1,90);
 scene.add(new THREE.HemisphereLight(0xffffff,0x6b8f4a,.75));const sun=new THREE.DirectionalLight(0xffffff,.65);sun.position.set(-4,10,-6);scene.add(sun);
 const st=opt.state;const W=build(scene,{say:opt.say,
  chest:it=>{if(it.open)return opt.say('This chest is empty now.');it.open=1;it.lid.rotation.x=-1.1;opt.chest(it.id);},
  gate:it=>{if(W.gateOpen)return opt.say('The gate is already open.');W.gateOpen=1;it.mesh.material=W.mats_green;it.mesh.position.y-=.08;opt.sfx('good');opt.say('Click! The gate is opening.');},
  lever:it=>{if(W.bridgeDown)return opt.say('The bridge is already down.');W.bridgeDown=1;it.mesh.rotation.x=-.6;opt.sfx('good');opt.say('The bridge is coming down!');},
  bell:it=>{W.bellT=1.2;opt.sfx('bell');opt.say('Ding dong!');}});
 W.mats_green=new THREE.MeshLambertMaterial({color:0x3fbf5f});
 const F=figure(lookCols(opt.look||{}));F.root.scale.setScalar(.85);scene.add(F.root);
 const blob=new THREE.Mesh(new THREE.CircleGeometry(.35,12),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.25}));blob.rotation.x=-Math.PI/2;scene.add(blob);
 // HUD
 const hud=document.createElement('div');hud.className='pk-hud';hud.innerHTML=`<div class="pk-top"><button class="btn ghost pk-back" aria-label="back">⬅</button><span class="pk-chip" id="pkT">⏱ 0:00</span><span class="pk-chip" id="pkB">🏆 ${opt.best?fmt(opt.best):'--:--'}</span><span class="pk-chip" id="pkC">🪙 ${opt.coins()}</span><span class="pk-chip" id="pkX">⏳</span></div>
 <div class="pk-toast" id="pkMsg"></div><div class="pk-fade" id="pkFade"></div>
 <div class="pk-joy" id="pkJoy" aria-label="move"><div class="pk-knob" id="pkKnob"></div></div>
 <button class="pk-btn pk-int" id="pkI" aria-label="use">✋<span id="pkIL">Use</span></button><button class="pk-btn pk-jump" id="pkJ" aria-label="jump">⬆<span>Jump</span></button>`;host.appendChild(hud);
 const $=s=>hud.querySelector(s);
 // input: joystick, jump and use are separate pointers, so all three work at the same time
 const inp={x:0,y:0,jump:0,jumpHeld:0,use:0,keys:{}};let joyId=null;const joy=$('#pkJoy'),knob=$('#pkKnob');
 const joyMove=e=>{const r=joy.getBoundingClientRect(),R=r.width/2;let dx=e.clientX-(r.left+R),dy=e.clientY-(r.top+R);const d=Math.hypot(dx,dy),m=R*.8;if(d>m){dx*=m/d;dy*=m/d;}knob.style.transform=`translate(${dx}px,${dy}px)`;inp.x=dx/m;inp.y=-dy/m;};
 joy.addEventListener('pointerdown',e=>{joyId=e.pointerId;try{joy.setPointerCapture(e.pointerId);}catch(_){}joyMove(e);e.preventDefault();});
 joy.addEventListener('pointermove',e=>{if(e.pointerId===joyId)joyMove(e);});
 const joyEnd=e=>{if(e.pointerId!==joyId)return;joyId=null;inp.x=inp.y=0;knob.style.transform='';};joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);
 const jb=$('#pkJ'),ib=$('#pkI');
 jb.addEventListener('pointerdown',e=>{inp.jump=1;inp.jumpHeld=1;jb.classList.add('on');e.preventDefault();});['pointerup','pointercancel','pointerleave'].forEach(t=>jb.addEventListener(t,()=>{inp.jumpHeld=0;jb.classList.remove('on');}));
 ib.addEventListener('pointerdown',e=>{inp.use=1;ib.classList.add('on');e.preventDefault();});['pointerup','pointercancel','pointerleave'].forEach(t=>ib.addEventListener(t,()=>ib.classList.remove('on')));
 hud.addEventListener('contextmenu',e=>e.preventDefault());
 const kd=e=>{const k=e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();if(e.type==='keydown'&&!inp.keys[k]){if(k===' ')inp.jump=1;if(k==='e'||k==='enter')inp.use=1;}inp.keys[k]=e.type==='keydown';};
 window.addEventListener('keydown',kd);window.addEventListener('keyup',kd);
 $('.pk-back').addEventListener('click',()=>{PARK.stop();opt.exit();});
 // player
 const pl={p:new THREE.Vector3(),v:new THREE.Vector3(),ground:null,coyote:0,buf:0,yaw:0,walk:0,cp:0,started:0,t0:0,time:0,done:0,falls:0,frozen:0};
 const spawn=()=>{const c=W.cps[pl.cp];pl.p.set(c.x+(c.i===0?1.5:0),c.y+.01,c.z+(c.i===0?0:1.2));pl.v.set(0,0,0);pl.ground=null;};spawn();
 const camPos=new THREE.Vector3(pl.p.x,pl.p.y+4,pl.p.z-7);
 const HW=.3,HH=1.6;
 const hit=(b,p)=>p.x+HW>b.min[0]+1e-4&&p.x-HW<b.max[0]-1e-4&&p.z+HW>b.min[2]+1e-4&&p.z-HW<b.max[2]-1e-4&&p.y+HH>b.min[1]+1e-4&&p.y<b.max[1]-1e-4;
 const solid=()=>W.cols.filter(b=>!(b===W.gateC&&W.gateOpen));
 function moveAxis(a,d,list){if(!d)return;const p=pl.p;p[a]+=d;for(const b of list){if(!hit(b,p))continue;const top=b.max[1];
   if(pl.ground&&top-p.y<=.55&&top-p.y>0){const oy=p.y;p.y=top;if(!list.some(c=>hit(c,p)))continue;p.y=oy;}
   const i=a==='x'?0:2;p[a]=d>0?b.min[i]-HW-1e-3:b.max[i]+HW+1e-3;pl.v[a]=0;}}
 function physics(dt){const list=solid();
  if(W.bridgeDown&&!W.bridgeC&&W.bridgeT>=1)W.bridgeC=W.cols.push({min:[-1,4,69],max:[2,5,77],tag:''});
  // ride a moving platform
  let ix=inp.x,iy=inp.y;const K=inp.keys;if(K.a||K.arrowleft)ix=-1;if(K.d||K.arrowright)ix=1;if(K.w||K.arrowup)iy=1;if(K.s||K.arrowdown)iy=-1;const il=Math.hypot(ix,iy);if(il>1){ix/=il;iy/=il;}
  if(pl.frozen){ix=iy=0;}
  const sp=4.6,slide=pl.ground&&pl.ground.tag==='slide';const tx=-ix*sp,tz=iy*sp+(slide?3:0);const acc=(pl.ground?12:5)*dt;
  pl.v.x+=(tx-pl.v.x)*Math.min(1,acc);pl.v.z+=(tz-pl.v.z)*Math.min(1,acc);
  if((ix||iy)&&!pl.started&&!pl.done){pl.started=1;pl.t0=performance.now();}
  if(ix||iy)pl.yaw=Math.atan2(-ix,iy);
  pl.coyote=pl.ground?.12:Math.max(0,pl.coyote-dt);if(inp.jump){pl.buf=.15;inp.jump=0;}else pl.buf=Math.max(0,pl.buf-dt);
  if(pl.buf>0&&pl.coyote>0&&!pl.frozen){pl.v.y=8.2;pl.buf=0;pl.coyote=0;pl.ground=null;opt.sfx('jump');}
  pl.v.y-=22*dt;if(pl.v.y<-18)pl.v.y=-18;
  moveAxis('x',pl.v.x*dt,list);moveAxis('z',pl.v.z*dt,list);
  pl.p.y+=pl.v.y*dt;pl.ground=null;for(const b of list){if(!hit(b,pl.p))continue;if(pl.v.y<=0){pl.p.y=b.max[1];pl.v.y=0;pl.ground=b;}else{pl.p.y=b.min[1]-HH-1e-3;pl.v.y=0;}}
  if(!pl.ground){const q=pl.p.clone();q.y-=.03;for(const b of list)if(pl.v.y<=0&&hit(b,q)){pl.ground=b;break;}}}
 let fading=0;
 function checks(){const p=pl.p;
  if(p.y<-1.4&&!fading){fading=1;pl.falls++;pl.frozen=1;$('#pkFade').classList.add('on');opt.sfx('soft');opt.say(pl.falls<3?'Splash! Back to your flag.':'Back to your flag. You can do it!');setTimeout(()=>{spawn();$('#pkFade').classList.remove('on');pl.frozen=0;fading=0;},650);}
  for(const c of W.cps)if(!c.on&&Math.hypot(p.x-c.x,p.z-c.z)<1.6&&Math.abs(p.y-c.y)<1.5){c.on=1;c.flag.material=W.mats_green;if(c.i>pl.cp)pl.cp=c.i;opt.sfx('good');toast('Checkpoint!');opt.say('Checkpoint saved!');}
  const f=W.finish;if(!pl.done&&Math.hypot(p.x-f.x,p.z-f.z)<1.4&&Math.abs(p.y-f.y)<1.5){pl.done=1;pl.time=pl.started?performance.now()-pl.t0:0;pl.frozen=1;$("#pkT").textContent="⏱ "+fmt(pl.time);opt.finish(pl.time,pl.falls);}}
 let near=null;
 function interact(){near=null;let bd=2.3;const c=pl.p.clone();c.y+=.8;for(const it of W.its){const d=Math.hypot(c.x-it.x,(c.y-(it.y+.6))*.7,c.z-it.z);if(d<bd){bd=d;near=it;}}
  ib.classList.toggle('ready',!!near);$('#pkIL').textContent=near?near.label:'Use';
  if(inp.use){inp.use=0;if(near){opt.sfx('tap');near.act(near);if(near.text)toast(near.text);}else toast('Walk up to a sign, chest, button, lever, bell or friend.');}}
 let toastT=0;function toast(t){const m=$('#pkMsg');m.textContent=t;m.classList.add('on');toastT=Math.max(2.5,t.length/14);}
 // loop
 let last=performance.now(),acc=0,tAll=0,frames=0,raf=0,fpsT=0,fps=60;
 function resize(){const w=host.clientWidth||innerWidth,h=host.clientHeight||innerHeight;ren.setSize(w,h,false);cv.style.width=w+'px';cv.style.height=h+'px';cam.aspect=w/h;cam.updateProjectionMatrix();}
 resize();window.addEventListener('resize',resize);
 function logic(dt){tAll+=dt;
  for(const m of W.movers)m.set(tAll);
  if(W.gateOpen&&W.gate.position.y>2.1)W.gate.position.y-=dt*2;
  if(W.bridgeDown){W.bridgeT=Math.min(1,(W.bridgeT||0)+dt/1.4);W.bridge.rotation.x=(Math.PI/2*.98)*(1-W.bridgeT);}
  if(W.bellT>0){W.bellT-=dt;W.its.find(i=>i.k==='bell').mesh.rotation.z=Math.sin(W.bellT*18)*.4*W.bellT;}
  W.wt.offset.x=(tAll*.02)%1;W.flag.rotation.y=Math.sin(tAll*2)*.15;W.clouds.forEach((c,i)=>{c.position.x+=dt*(.3+i%3*.1);if(c.position.x>40)c.position.x=-40;});
  for(const it of W.its)if(it.k==='npc'){const dx=pl.p.x-it.x,dz=pl.p.z-it.z;if(Math.hypot(dx,dz)<6)it.fig.root.rotation.y=Math.atan2(dx,dz);}
  if(pl.ground&&pl.ground.tag==='mover'){const m=W.movers.find(m=>m.b===pl.ground);if(m){pl.p.x+=m.dx;pl.p.z+=m.dz;if(m.dy>0)pl.p.y+=m.dy;}}
  const sub=Math.max(2,Math.ceil(dt/.02));for(let i=0;i<sub;i++)physics(dt/sub);checks();interact();}
 function frame(now){raf=requestAnimationFrame(frame);if(!document.body.contains(host)){PARK.stop();return;}
  const real=(now-last)/1000;let dt=Math.min(.1,real);last=now;frames++;fpsT+=real;if(fpsT>1){fps=frames/fpsT;frames=0;fpsT=0;}
  logic(dt);
  // avatar
  F.root.position.copy(pl.p);let dy=pl.yaw-F.root.rotation.y;dy=Math.atan2(Math.sin(dy),Math.cos(dy));F.root.rotation.y+=dy*Math.min(1,dt*12);
  const hs=Math.hypot(pl.v.x,pl.v.z);pl.walk+=hs*dt*2.4;const sw=pl.ground?Math.sin(pl.walk)*Math.min(1,hs/3)*.7:.35;F.legL.rotation.x=sw;F.legR.rotation.x=-sw;F.armL.rotation.x=-sw;F.armR.rotation.x=sw;
  let gy=-99;for(const b of solid())if(pl.p.x>b.min[0]&&pl.p.x<b.max[0]&&pl.p.z>b.min[2]&&pl.p.z<b.max[2]&&b.max[1]<=pl.p.y+.05&&b.max[1]>gy)gy=b.max[1];blob.visible=gy>-50;blob.position.set(pl.p.x,gy+.02,pl.p.z);
  // camera follows from behind
  const want=new THREE.Vector3(pl.p.x*.85,pl.p.y+3.6,pl.p.z-6.5);camPos.lerp(want,Math.min(1,dt*4));cam.position.copy(camPos);cam.lookAt(pl.p.x,pl.p.y+1.1,pl.p.z+3);
  if(toastT>0){toastT-=dt;if(toastT<=0)$('#pkMsg').classList.remove('on');}
  if(pl.started&&!pl.done)$('#pkT').textContent='⏱ '+fmt(performance.now()-pl.t0);
  ren.render(scene,cam);}
 raf=requestAnimationFrame(frame);
 G={stop(){cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',kd);window.removeEventListener('resize',resize);try{ren.dispose();ren.forceContextLoss();}catch(e){}},
  hud:$,pl,W,inp,get fps(){return fps;},near:()=>near&&near.k,
  sim(sec){for(let t=0;t<sec;t+=1/60)logic(1/60);},teleport(x,y,z){pl.p.set(x,y,z);pl.v.set(0,0,0);},setCoins(n){$('#pkC').textContent='🪙 '+n;},setX(t){$('#pkX').textContent=t;},setBest(ms){$('#pkB').textContent='🏆 '+fmt(ms);},
  restart(){pl.cp=0;W.cps.forEach(c=>{c.on=c.i===0;c.flag.material=c.i===0?W.mats_green:W.mats.wool;});pl.done=0;pl.started=0;pl.frozen=0;pl.falls=0;$('#pkT').textContent='⏱ 0:00';spawn();}};
 PARK.dbg=G;if(opt.ready)opt.ready(G);}
function fmt(ms){const s=Math.round(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
PARK.fmt=fmt;PARK.stop=function(){if(G){G.stop();G=null;PARK.dbg=null;}};
window.PARK=PARK;})();
