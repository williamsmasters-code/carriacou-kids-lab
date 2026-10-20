// Generated sound (Web Audio) and speech (speechSynthesis). No files, no network.
const Snd={ctx:null,
 c(){if(!this.ctx){const A=window.AudioContext||window.webkitAudioContext;if(A)this.ctx=new A();}return this.ctx;},
 tone(f,d=0.15,t='sine',w=0,v=0.2){const c=this.c();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,c.currentTime+w);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+w+d);o.connect(g);g.connect(c.destination);o.start(c.currentTime+w);o.stop(c.currentTime+w+d+0.05);},
 tap(){this.tone(660,0.08,'triangle');},
 good(){[523,659,784,1046].forEach((f,i)=>this.tone(f,0.18,'triangle',i*0.09));},
 soft(){this.tone(440,0.2,'sine',0,0.1);}, // gentle "try again" (never harsh)
 honk(){this.tone(330,0.25,'square',0,0.08);this.tone(415,0.25,'square',0.02,0.06);},
 stomp(){this.tone(90,0.3,'sine',0,0.4);},
 count(n){this.tone(400+n*80,0.15,'triangle');}
};
const Say={on:true,
 speak(t,rate=0.95){if(!this.on||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.replace(/<[^>]+>/g,''));u.rate=rate;u.pitch=1.1;u.lang='en-GB';speechSynthesis.speak(u);}catch(e){}}
};
