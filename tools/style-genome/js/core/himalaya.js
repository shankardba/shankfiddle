'use strict';
/* Tibet and the Himalaya — painted, printed, knotted and woven.

   COLOUR IS POSITIONAL. Tibetan painting assigns colour by rule, not by taste: the five
   directions of a mandala, the five flags of a string, the five flames of the fire ring
   each have a fixed colour. Every painted part here therefore carries a palette position
   (`ci`): 0 blue, 1 red, 2 green, 3 yellow or gold, 4 white, 5 orange.

   THE MANDALA is ruler-and-compass work, drawn from a centre point with a chalked cord:
   concentric rings of fire, vajras and lotus petals; inside them a square palace with a
   T-shaped gate in the middle of each wall; the walls five coloured bands thick; the
   floor quartered along the diagonals into the colours of the four directions. The gated
   square is one polygon and its walls are that polygon inset five times.

   THE EIGHT AUSPICIOUS SYMBOLS, the vajra, the flaming jewels and the stupa are objects
   with settled shapes; each is drawn here from its parts.

   THE BUDDHA is assembled from the figure kit in murti.js (the same proportions: Tibetan
   iconometry descends from the Indian manuals), with his own head, robe, bowl and nimbus.

   WRITING. Prayer-flag text is mantra. The text band here is asemic: strokes built the
   way dbu-can letters are built (a head line, stems hung from it, vowel hooks above and
   below, a dot after each syllable) that spell nothing. No mantra is imitated.
   All constructions are original; none traces a reference image. */

const TB={};
const [tbBL,tbRD,tbGR,tbYL,tbWH,tbOR]=[0,1,2,3,4,5];
const tbR=(pts,ci,z=0,role='outer')=>({kind:'region',closed:true,role,ci,plain:true,z,pts});          // painted and outlined
const tbN=(pts,ci,z=0)=>({kind:'region',closed:true,role:'detail',ci,plain:true,ns:true,z,pts});       // painted, no outline
const tbL=(pts,z=6,role='detail',closed=false)=>({kind:'line',role,closed,pts,z});
const tbFit=(P,s=94)=>fitParts(FL.done(P),s);
const tbSym=half=>half.concat(half.slice(1,-1).reverse().map(([x,y])=>[-x,y]));                        // right half, top → bottom, both ends on the axis
const tbRib=(cp,w,step=1.8)=>G.ribbon(G.resample(G.chaikin(cp,false,3),false,step),w);
const tbRect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const tbPut=(parts,o)=>parts.map(p=>p.kind==='dot'?p:Object.assign({},p,{z:(p.z||0)+(o.dz||0),pts:G.xform(p.pts,o)}));
// a pointed jewel, centre (x,y)
TB.gem=(x,y,w,h)=>G.xform(tbSym(G.chain(G.bez([0,-h/2],[w*0.16,-h*0.4],[w/2,-h*0.08],[w/2,h*0.12],8),G.bez([w/2,h*0.12],[w/2,h*0.38],[w*0.26,h/2],[0,h/2],8))),{x,y});
// one tongue of flame: base at (x,y), tip h away, an S that leans as it rises
TB.tongue=(x,y,h,rot=0,k=0.2)=>G.xform(G.ribbon(G.resample(G.bez([0,0],[-0.34*h,-0.3*h],[0.38*h,-0.62*h],[0.02*h,-h],16),false,Math.max(0.7,h/14)),t=>Math.max(0.12,h*k*Math.pow(1-t,0.8)*(0.55+0.45*Math.sin(Math.PI*Math.min(1,t*1.7))))),{x,y,rot});
// a lock of mane: a tapering band that ends in a curl
TB.lock=(x,y,len,rot,w,turn=1)=>{const sp=[];for(let i=0;i<=10;i++)sp.push([0,-len*0.55*i/10]);const r0=len*0.26;for(let i=1;i<=22;i++){const t=i/22,a=t*330,r=r0*(1-0.72*t);sp.push([turn*(r0-Math.cos(a*DEG)*r)-turn*(r0-r)*0.0,-len*0.55-Math.sin(a*DEG)*r]);}
  return G.xform(G.ribbon(G.resample(sp,false,Math.max(0.6,len/20)),t=>Math.max(0.2,w*(1-0.8*t))),{x,y,rot});};
// three commas turning about a centre
TB.gankyil=(R,cis,z=0,x=0,y=0)=>{const P=[],S=(c,rev)=>{const p=G.arc(x+Math.cos(c*DEG)*R/2,y+Math.sin(c*DEG)*R/2,R/2,c+180,c+360,12);return rev?p.reverse():p;};
  for(let i=0;i<3;i++){const a=i*120-90;P.push(tbR(G.chain(S(a),G.arc(x,y,R,a,a+120,12),S(a+120,true)),cis[i],z));}return P;};
// a pleated hanging: straight top edge, zigzag hem, fold lines
TB.valance=(y0,y1,w0,w1,n,ci,z=0)=>{const hem=[];for(let i=0;i<=2*n;i++)hem.push([lerp(w1,-w1,i/(2*n)),y1-(i%2?(y1-y0)*0.16:0)]);
  const P=[tbR([[-w0,y0],[w0,y0]].concat(hem),ci,z)];for(let i=1;i<2*n;i+=2)P.push(tbL([[lerp(w0,-w0,i/(2*n))*0.96,y0+(y1-y0)*0.08],hem[i]],z+0.5));return P;};

/* ---------- the eight auspicious symbols (bkra shis rtags brgyad) ---------- */
TB.parasol=()=>{const P=[];
  P.push(tbR(tbRect(-1.7,10,1.7,46),tbYL,-1),tbR(G.circle(0,46.5,3,16),tbYL,-1));
  for(const s of [-1,1]){P.push(tbR(tbRib([[s*36,-8],[s*45,4],[s*37,17],[s*45,30],[s*40,42]],t=>3*(1-0.55*t)),tbGR,-1),tbR(tbRib([[s*33,-8],[s*38,4],[s*31,14],[s*36,25]],t=>2.4*(1-0.5*t)),tbYL,-1));}
  P.push(...TB.valance(-8,14,37,35,11,tbRD,0));
  const sc=[[-38,-8],[38,-8]];for(let i=0;i<=40;i++){const u=i/40,k=u*8%1;sc.push([lerp(38,-38,u),-8+6+5*Math.sin(Math.PI*k)]);}P.push(tbR(sc,tbBL,1));
  P.push(tbR(tbRect(-39.5,-13,39.5,-8),tbYL,2));for(let i=0;i<13;i++)P.push(tbN(G.circle(-36+i*6,-10.5,1.1,8),tbRD,3));
  const dome=G.chain(G.bez([0,-40],[12,-39.5],[31,-31],[39,-15],18),[[39,-13],[0,-13]]);P.push(tbR(tbSym(dome),tbWH,1));
  for(const k of [-3,-2,-1,0,1,2,3])P.push(tbL(G.bez([0,-40],[k*4,-34],[k*10,-24],[k*11.6,-13.4],10),2));
  P.push(tbR(tbRect(-3,-42,3,-39.6),tbYL,3),tbR(TB.gem(0,-46,6.4,9),tbBL,3));return P;};
defMotif('tsParasol',{name:'Parasol',term:'gdugs · chattra',upright:true,meaning:'The first of the eight auspicious symbols: a silk canopy with a pleated valance and long ribbons, on a staff. It is held over those who are honoured; in the set it stands for shelter from the heat of suffering.',
fn(){return tbFit(TB.parasol(),96);}});

TB.fish=()=>{const P=[];
  const body=G.chaikin([[-3,-41],[-9,-37],[-15,-27],[-18,-12],[-17,2],[-13,14],[-9.5,22],[-17,30],[-23,41],[-13,35.5],[-5,43],[-5.5,31],[-5.5,23],[-2.5,12],[-1,0],[-1,-14],[-1,-28],[-1.2,-37]],true,3);
  P.push(tbR(G.chaikin([[-16.6,-22],[-21.6,-17],[-20.6,-12],[-23,-7],[-21.4,-2],[-22.4,3],[-16,7]],true,1),tbRD,-1),tbR(G.xform(G.petal(10,3.4,'pointed'),{x:-3,y:-18,rot:128}),tbRD,2));
  P.push(tbR(body,tbYL,0));
  for(let k=0;k<7;k++){const y=-22+k*5.6,xl=-16.6+0.011*(y+4)*(y+4),xr=-1.6,n=3,w=(xr-xl)/n;for(let i=0;i<n;i++){const x0=xl+i*w+(k%2?w/2:0);if(x0+w>xr+0.5)continue;P.push(tbL(G.quad([x0,y],[x0+w/2,y+4.6],[x0+w,y],6),1));}}
  P.push(tbL(G.bez([-14.6,-29],[-10,-25],[-5,-25],[-1.4,-29.5],8),1,'inner'),tbR(G.circle(-7.4,-33.6,1.9,12),tbWH,1),tbN(G.circle(-7.4,-33.6,0.8,8),tbBL,2));
  for(const [a,b] of [[[-10.6,24],[-19,36]],[[-8.6,25],[-14.5,33]],[[-7,25],[-7,37]]])P.push(tbL([a,b],1));
  P.push(tbL([[-4.4,-39.6],[-6,-38.2]],1));return P;};
defMotif('tsFishes',{name:'Golden fishes',term:'gser nya · suvarṇamatsya',upright:true,meaning:'Two golden carp set upright and facing, nose to nose. They began as the two great rivers of India; in the set of eight they stand for moving freely and without fear, as a fish does in water.',
fn(){const a=TB.fish(),b=a.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[-x,y])}));return tbFit(a.concat(b),94);}});

TB.vase=()=>{const P=[];
  const half=[[0,-22],[9.5,-22],[11.4,-20.4],[9.4,-18.2],[6.2,-15],[6.2,-10.4],[13,-7],[21,2],[22.4,11],[19.4,20],[13,26.6],[7,30],[6.4,32.4],[10.6,36.6],[12,40],[0,40]];
  for(const s of [-1,1]){P.push(tbR(tbRib([[s*5,-12.6],[s*17,-19],[s*27,-9],[s*35,-16],[s*45,-5]],t=>2.9*(1-0.62*t)),tbWH,-1),tbR(tbRib([[s*5,-12],[s*13,-4],[s*20,-8],[s*27,2]],t=>2.3*(1-0.6*t)),tbWH,-1));}
  for(let i=0;i<5;i++)P.push(tbR(G.xform(G.petal(7.5,3.6,'round'),{x:-10+i*5,y:40,rot:180+(i-2)*12}),tbRD,-1));
  P.push(tbR(G.chaikin(tbSym(half),true,2),tbYL,0));
  P.push(tbR(tbRect(-6.4,-14.4,6.4,-11),tbRD,1),tbL([[-7.4,29.6],[7.4,29.6]],1,'inner'),tbL([[-10.4,-20.6],[10.4,-20.6]],1));
  for(let i=0;i<5;i++){const x=-11.2+i*5.6;P.push(tbR(G.xform(G.petal(8.6,2.9,'pointed'),{x,y:-6.4+Math.abs(i-2)*1.5,rot:180+(i-2)*9}),tbBL,1));}
  P.push(tbR(G.circle(0,13,6.4,24),tbRD,1),tbR(TB.gem(0,13,6,8),tbGR,2));for(let i=0;i<10;i++){const a=i*36*DEG;P.push(tbN(G.circle(Math.cos(a)*9,13+Math.sin(a)*9,0.9,8),tbWH,2));}
  P.push(tbR(TB.tongue(0,-41,9,0,0.24),tbOR,1),tbR(TB.tongue(-3,-39,6,-24,0.24),tbOR,1),tbR(TB.tongue(3,-39,6,24,0.24),tbOR,1));
  P.push(tbR(TB.gem(-5,-27,8,10.5),tbBL,2),tbR(TB.gem(5,-27,8,10.5),tbRD,2),tbR(TB.gem(0,-35,8,11),tbGR,3));return P;};
defMotif('tsVase',{name:'Treasure vase',term:'gter bum · nidhighaṭa',upright:true,meaning:'A fat-bellied vase with a flared lip, a silk scarf tied round its neck and jewels flaming from its mouth: however much is taken out, it stays full. Sealed vases like it are buried at springs and passes and set inside stupas.',
fn(){return tbFit(TB.vase(),96);}});

TB.lotus=()=>{const P=[],pet=(len,w,rot,ci,z,x=0,y=6)=>{P.push(tbR(G.xform(G.petal(len,w,'pointed'),{x,y,rot}),ci,z),tbL(G.xform(G.petal(len*0.7,w*0.5,'pointed').slice(3,-3),{x,y:y,rot}).map(q=>q),z+0.2));};
  P.push(tbR(tbRib([[0,10],[2.5,22],[-2.5,34],[0,47]],()=>1.5),tbGR,-3));
  for(const s of [-1,1]){const lf=G.xform(G.petal(25,9.5,'pointed'),{x:s*1,y:32,rot:s*72});P.push(tbR(lf,tbGR,-2),tbL(G.xform([[0,-2],[0,-22]],{x:s*1,y:32,rot:s*72}),-1.8));
    P.push(tbR(tbRib([[s*1,40],[s*11,37],[s*15,45]],t=>1.2*(1-0.5*t)),tbGR,-3),tbR(G.xform(G.petal(9,3.4,'pointed'),{x:s*15,y:45,rot:s*150}),tbRD,-2));}
  for(const r of [-104,104,-80,80])pet(22,7.5,r,tbRD,-1,0,7);
  for(const r of [-52,52,-27,27,0])pet(35,9.6,r,tbRD,0);
  for(const r of [-66,66,-40,40,-14,14])pet(26,8.8,r,tbOR,1,0,8);
  for(const r of [-150,-180,150])P.push(tbR(G.xform(G.petal(8,3.6,'pointed'),{x:0,y:7,rot:r}),tbGR,2));
  P.push(tbR(G.ellipse(0,-13,5.4,2.6,20),tbYL,2));for(let i=0;i<5;i++)P.push(tbN(G.circle(-3.4+i*1.7,-13,0.5,6),tbRD,3));return P;};
defMotif('tsLotus',{name:'Lotus',term:'pad ma · padma',upright:true,meaning:'A full-blown lotus on its stem, with leaves and a bud. It roots in mud and opens clean above the water: the mind that is not stained by what it grows through. Every Buddha and deity sits or stands on one.',
fn(){return tbFit(TB.lotus(),96);}});

TB.conch=()=>{const P=[];
  for(const [s,ci] of [[-1,tbYL],[1,tbRD]]){P.push(tbR(tbRib([[s*3,35],[s*14,27],[s*23,36],[s*31,26],[s*43,31]],t=>0.3+2.9*Math.sin(Math.PI*clamp(0.1+0.82*t))*(1-0.3*t)),ci,-1),tbR(tbRib([[s*3,37],[s*11,41],[s*17,36],[s*25,44]],t=>0.3+2.2*Math.sin(Math.PI*clamp(0.1+0.82*t))),ci,-1));}
  P.push(tbR(G.ellipse(1.6,37,3.4,2.2,14),tbYL,3));
  P.push(tbR(G.chaikin([[-2,-45],[4,-41],[10,-35],[17,-28],[22,-18],[23.4,-6],[19.6,6],[13.6,18],[8.4,30],[4.4,40],[1,47.6],[-2,40],[-6,28],[-12,14],[-17,2],[-20,-10],[-19,-22],[-14,-32],[-8,-40]],true,3),tbWH,0));
  P.push(tbR(G.chaikin([[3.6,-13],[13,-8.6],[16.6,3],[11.6,17],[6,30],[2.6,41],[2,26],[3,10],[0.6,-3]],true,3),tbRD,1));
  P.push(tbL(G.bez([-10.6,-36.4],[-4,-32],[3,-32],[8.6,-36],10),2,'inner'),tbL(G.bez([-16.6,-28.6],[-6,-21.6],[8,-22],[18,-26.6],10),2,'inner'),tbL(G.bez([-20,-15],[-10,-8.6],[-2,-9],[3.6,-13],10),2,'inner'));
  for(const k of [0,1,2]){const d=3.6+k*3.4;P.push(tbL(G.chaikin([[-19.6+d,-10],[-16.6+d,2],[-11.6+d*0.9,14],[-5.8+d*0.7,27],[-1.6+d*0.36,38]],false,2),2));}
  const sp=[];for(let i=0;i<=20;i++){const t=i/20,a=(200-t*560)*DEG,r=lerp(4.6,0.6,t);sp.push([-1+Math.cos(a)*r,-40+Math.sin(a)*r*0.8]);}P.push(tbL(sp,2));return P;};
defMotif('tsConch',{name:'White conch',term:'dung dkar · śaṅkha',upright:true,meaning:'A white conch whose spiral turns to the right, the rare direction, hung with silk. Blown as a horn it calls the assembly; in the set of eight it is the sound of the teaching carrying in every direction.',
fn(){return tbFit(TB.conch(),96);}});

/* The endless knot is one closed band: three strands across and three down, their ends
   joined by four loops and two square corners, so that it crosses itself nine times. */
TB.knotPath=u=>{const P=[[1,0.5],[1,4],[0,4],[0,3],[3.5,3]];const arc=(cx,cy,a0,a1)=>{for(let i=1;i<=10;i++){const a=(a0+(a1-a0)*i/10)*DEG;P.push([cx+0.5*Math.cos(a),cy+0.5*Math.sin(a)]);}};
  arc(3.5,2.5,90,-90);P.push([0.5,2]);arc(0.5,1.5,90,270);P.push([4,1],[4,0],[3,0],[3,3.5]);arc(2.5,3.5,0,180);P.push([2,0.5]);arc(1.5,0.5,0,-180);P.pop();
  return P.map(([x,y])=>{const a=(x-2)*u,b=(y-2)*u;return[(a+b)*Math.SQRT1_2,(b-a)*Math.SQRT1_2];});};
defMotif('tsKnot',{name:'Endless knot',term:'dpal be\'u · śrīvatsa',meaning:'A single band folded through itself nine times with no beginning or end. It is read as cause and effect bound into one another, as wisdom joined to compassion, and simply as long life; it is the commonest good-luck sign in Tibet, on doors, cards and carpets.',
fn(){return fitParts(GH.compose([{closed:true,pts:TB.knotPath(17)}],6.6,true),92);}});

TB.banner=()=>{const P=[];
  P.push(tbR(tbRect(-1.6,30,1.6,46),tbYL,-2),tbR(G.circle(0,46.6,2.6,14),tbYL,-2));
  for(const [s,ci] of [[-1,tbWH],[1,tbWH]]){P.push(tbR(tbRib([[s*11,-30],[s*19,-18],[s*14,-4],[s*20,10],[s*15,25]],t=>2.7*(1-0.5*t)),ci,-1),tbR(tbRib([[s*10,-30],[s*24,-27],[s*27,-16],[s*33,-10]],t=>2.2*(1-0.6*t)),tbOR,-1));}
  P.push(...TB.valance(18,33,10,11.6,5,tbRD,0),tbR(tbRect(-10.4,14,10.4,18),tbYL,1),...TB.valance(0,15,10,11.6,5,tbGR,0),tbR(tbRect(-10.4,-4,10.4,0),tbYL,1),...TB.valance(-18,-3,10,11.6,5,tbBL,0),tbR(tbRect(-10.4,-22,10.4,-18),tbYL,1));
  const sc=[[-12.6,-31],[12.6,-31]];for(let i=0;i<=24;i++){const u=i/24;sc.push([lerp(12.6,-12.6,u),-25+3.6*Math.sin(Math.PI*(u*4%1))]);}P.push(tbR(sc,tbRD,2));
  P.push(tbR(tbSym([[0,-41],[6,-39.4],[11,-34.6],[12.6,-31],[0,-31]]),tbYL,3),tbR(TB.gem(0,-44.6,6,8.6),tbBL,4),tbL([[-9,-33.4],[9,-33.4]],4));
  for(const y of [-20,-2,16])for(let i=0;i<5;i++)P.push(tbN(G.circle(-8+i*4,y,0.8,8),tbRD,2));return P;};
defMotif('tsBanner',{name:'Victory banner',term:'rgyal mtshan · dhvaja',upright:true,meaning:'A cylinder of silk in tiers, each with its own pleated valance, on a staff with a jewel at the top. It was a military standard; in the set of eight it marks the victory of the teaching over ignorance and death, and gilded copper ones stand at the corners of monastery roofs.',
fn(){return tbFit(TB.banner(),96);}});

TB.wheel=(n=8)=>{const P=[tbR(G.circle(0,0,43.6,96),tbYL,0),tbL(G.circle(0,0,40.4,90),1,'detail',true),{kind:'region',closed:true,role:'inner',bg:true,plain:true,z:1,pts:G.circle(0,0,36.6,84)}];
  const spoke=G.chaikin([[0,-8],[2.5,-15],[1.3,-27],[3,-32.6],[0,-38],[-3,-32.6],[-1.3,-27],[-2.5,-15]],true,2);
  for(let i=0;i<n;i++){P.push(tbR(G.xform(spoke,{rot:i*360/n}),tbYL,2),tbR(G.xform(TB.gem(0,-47.4,5.4,7.6),{rot:i*360/n}),tbYL,0));
    const a=(i+0.5)*360/n*DEG;P.push(tbN(G.circle(Math.cos(a)*40.2,Math.sin(a)*40.2,1.3,8),tbRD,2));}
  P.push(tbR(G.circle(0,0,10.6,36),tbYL,3),...TB.gankyil(7.6,[tbBL,tbRD,tbGR],4));return P;};
defMotif('tsWheel',{name:'Wheel of the teaching',term:'chos \'khor · dharmacakra',meaning:'A wheel of eight spokes with jewelled tips and three swirling commas at the hub. The spokes are the eightfold path; turning it is the Buddha’s teaching. Flanked by two deer it crowns every monastery roof.',
fn(){return tbFit(TB.wheel(),94);}});

/* ---------- vajra, jewels, stupa ---------- */
// one end of a vajra, rising from the hub at the origin
TB.vajraHalf=(ci,z=0)=>{const P=[tbR(tbRect(-6.4,-7.6,6.4,-5),ci,z)];
  for(const [x,r] of [[-3.4,-34],[3.4,34],[0,0]])P.push(tbR(G.xform(G.petal(10,3.5,'pointed'),{x,y:-7.6,rot:r}),ci,z+(r?0:0.2)));
  P.push(tbR(tbRect(-5,-18.4,5,-16.4),ci,z+0.4));
  for(const s of [-1,1])P.push(tbR(tbRib([[s*4.4,-18],[s*13,-22.6],[s*13.6,-33],[s*5.6,-42],[s*1.3,-45.4]],t=>2.4*(1-0.5*t),1.6),ci,z));
  P.push(tbR(G.chaikin([[0,-18],[2.7,-27],[1.7,-40],[0,-48],[-1.7,-40],[-2.7,-27]],true,2),ci,z+0.3));return P;};
defMotif('vajra',{name:'Vajra',term:'rdo rje · vajra',upright:true,meaning:'The thunderbolt sceptre: a hub, a lotus collar at each end, and five prongs that curve in to meet at a point. Its Tibetan name means lord of stones, the diamond: what cuts and cannot be cut. Held in the right hand with a bell in the left, it is method paired with wisdom, and it gives Vajrayāna Buddhism its name.',
fn(){const a=TB.vajraHalf(tbYL),b=a.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[x,-y])}));return tbFit(a.concat(b,[tbR(G.circle(0,0,5.9,24),tbYL,2),tbL(G.circle(0,0,3.2,16),3,'detail',true)]),96);}});
defMotif('crossedVajra',{name:'Crossed vajra',term:'rdo rje rgya gram · viśvavajra',meaning:'Two vajras crossed at right angles, each arm in the colour of its direction. It is the immovable ground: drawn under the palace of every mandala, on the base of statues to seal what is inside, and on the cushion a teacher sits on.',
fn(){const P=[];[tbRD,tbGR,tbWH,tbYL].forEach((ci,i)=>P.push(...tbPut(TB.vajraHalf(ci),{rot:i*90})));P.push(tbR(G.circle(0,0,7.4,28),tbBL,2),...TB.gankyil(4.6,[tbYL,tbRD,tbWH],3));return tbFit(P,94);}});

TB.norbu=()=>{const P=[];
  const body=tbSym(G.chain(G.bez([0,-47],[7,-30],[28,-16],[30,6],14),G.bez([30,6],[31,24],[17,34],[0,34],12)));
  for(const s of [-1,1])for(const [x,y,h,r] of [[9,-27,15,22],[19,-14,16,34],[27,0,16,48],[29,14,14,66]])P.push(tbR(TB.tongue(s*x,y,h,s*r,0.26),tbOR,-1));
  P.push(tbR(body,tbOR,0),tbL(G.scaleAbout?G.scaleAbout(body,[0,8],0.8):body.map(([x,y])=>[x*0.8,8+(y-8)*0.8]),0.5,'detail',true),tbR(body.map(([x,y])=>[x*0.56,10+(y-10)*0.56]),tbYL,0.6));
  for(let i=0;i<7;i++)P.push(tbR(G.xform(G.petal(9,4.2,'round'),{x:-18+i*6,y:35,rot:180+(i-3)*10}),tbRD,1));
  P.push(tbR(tbRect(-19,32.6,19,35.6),tbYL,2));
  P.push(tbR(TB.gem(-9.6,20,17,22),tbBL,3),tbR(TB.gem(9.6,20,17,22),tbGR,3),tbR(TB.gem(0,5,17,24),tbRD,4));
  for(const [x,y,w,h] of [[-9.6,20,17,22],[9.6,20,17,22],[0,5,17,24]])P.push(tbL(TB.gem(x,y+1,w*0.56,h*0.6),5,'detail',true));return P;};
defMotif('norbu',{name:'Flaming jewels',term:'nor bu me \'bar · triratna',upright:true,meaning:'Three jewels on a lotus, wrapped in fire. They are the Buddha, his teaching and the community of those who follow it, the three things a Buddhist takes refuge in; the same jewel rides on the wind horse’s back and grants what is wished for.',
fn(){return tbFit(TB.norbu(),94);}});

/* A stupa is built to a grid: throne, four steps, the vase, the square harmika, thirteen
   rings, parasol, moon, sun and flame, each a fixed share of the height. */
TB.stupa=()=>{const P=[],bx=(hw,y0,y1,ci,z=0)=>P.push(tbR(tbRect(-hw,y0,hw,y1),ci,z));
  bx(31,43,48,tbWH);bx(28.6,40.6,43,tbYL);bx(26.4,29.6,40.6,tbWH);bx(28.6,27.4,29.6,tbYL);
  for(const x of [-17,0,17])P.push(tbR(tbRect(x-5.6,31.4,x+5.6,38.8),tbRD,1),tbR(TB.gem(x,35.1,5,6),tbYL,2));
  [24.4,21.8,19.2,16.6].forEach((hw,i)=>bx(hw,24.2-i*3.2,27.4-i*3.2,tbWH));
  bx(14.6,12.4,14.6,tbYL);for(let i=0;i<9;i++)P.push(tbL(G.xform(G.petal(2.2,1.3,'round'),{x:-12.8+i*3.2,y:14.6,rot:0}),1));
  P.push(tbR(tbSym(G.chain([[0,-10]],G.bez([8.6,-10],[14,-10],[17.4,-6],[17.4,-1],8),G.bez([17.4,-1],[17.4,5],[14,9],[12,12.4],8),[[0,12.4]])),tbWH,0));
  P.push(tbR(tbSym(G.chain(G.bez([0,-4.6],[2.4,-4.6],[4.4,-2.6],[4.4,2],8),[[4.4,8],[0,8]])),tbRD,1),tbL(tbSym(G.chain(G.bez([0,-6.4],[3.4,-6.4],[6.2,-3.4],[6.2,1.4],8),[[6.2,9.4],[0,9.4]])),1,'inner',true));
  bx(6.2,-15,-10,tbYL,1);bx(7.4,-16.6,-15,tbYL,1);P.push(tbN(G.ellipse(0,-12.6,1.8,1.1,10),tbBL,2));
  for(let i=0;i<13;i++){const y=-17.6-i*1.72,hw=lerp(5.6,2.3,i/12);P.push(tbR(G.roundRect(-hw,y-1.24,hw,y,0.6,2),i%2?tbRD:tbYL,1));}
  P.push(tbR(tbSym([[0,-42.6],[2,-42.2],[6.4,-40.6],[6.4,-39.6],[0,-39.6]]),tbYL,2));
  const mo=G.chain(G.arc(0,-45.4,4.2,20,160,14),G.arc(0,-47.4,3.9,150,30,14));P.push(tbR(mo,tbWH,3),tbR(G.circle(0,-47.2,2.1,16),tbRD,4),tbR(TB.tongue(0,-48.6,5,0,0.22),tbOR,3));return P;};
defMotif('stupa',{name:'Stupa',term:'mchod rten · stūpa',upright:true,meaning:'The reliquary monument, built to fixed proportions. From the ground: a lion throne, four steps, the vase-shaped dome with its niche, the square harmika, a spire of thirteen rings, a parasol, and the moon, sun and flame. The parts are read as the five elements stacked one on another, and as the body of a seated Buddha. A chorten is walked round clockwise.',
fn(){return tbFit(TB.stupa(),96);}});

/* ---------- animals ---------- */
TB.limb=(cp,ws,ci,z)=>{const p=G.resample(G.chaikin(cp,false,2),false,2);return tbR(G.ribbon(p,t=>{const k=clamp(t)*(ws.length-1),i=Math.min(ws.length-2,Math.floor(k));return lerp(ws[i],ws[i+1],k-i)/2;}),ci,z);};
TB.hoof=(cp)=>{const e=cp[cp.length-1],q=cp[cp.length-2],a=Math.atan2(e[1]-q[1],e[0]-q[0])/DEG-90;return Object.assign(tbR(G.xform([[-2.1,-1.4],[2,-1.4],[3,2.6],[-2.9,2.6]],{x:e[0],y:e[1],rot:a}),tbBL,-3),{solid:true});};
TB.horse=()=>{const P=[];
  // legs and tail lie under the body, so their roots are hidden by it
  for(const [cp,ws] of [[[[-12,5],[-12,14],[-12.6,22],[-12,30],[-12,37],[-13,42]],[9,6.4,5.2,3.3,3.9,3.3]],[[[21,3],[17,11],[19,19],[22.6,25],[17.6,32],[13.6,37],[10.4,40.4]],[12,9.4,6.2,4.8,3.3,3.8,3.2]],
    [[[-17,3],[-23,10],[-28.6,16],[-26.4,22],[-24,27],[-27.4,32]],[10,6.8,5.4,3.4,3.9,3.2]],[[[26,2],[23,11],[27,19],[31.4,25],[29.4,33],[27.6,39],[25.4,43.4]],[14,10.6,6.8,5.2,3.5,4,3.3]]])P.push(TB.limb(cp,ws,tbWH,-3),TB.hoof(cp));
  for(const [cp,w] of [[[[30,-15],[40,-24],[50,-14],[45,2],[52,14]],4.4],[[[30,-14],[41,-16],[46,-4],[41,10],[47,24]],4],[[[30,-13],[37,-9],[40,3],[36,15],[40,28]],3.4],[[[30,-12],[34,-4],[34,8],[31,18]],2.6]])
    P.push(tbR(tbRib(cp,t=>0.4+w*Math.pow(Math.sin(Math.PI*clamp(0.12+0.86*t)),0.8)*(1-0.45*t)),tbRD,-2));
  for(const [x,y,r,h] of [[-9,-19,74,15],[-13,-24.6,68,16],[-17.6,-30,62,16],[-21.6,-35.6,56,15],[-25.6,-40,48,13],[-29,-43,36,10]])P.push(tbR(TB.tongue(x,y,h,r,0.27),tbRD,-1));
  P.push(tbR(G.chaikin([[-31.4,-42.6],[-30.4,-52],[-27,-42]],true,1),tbWH,-0.5));
  const body=[[-44.4,-20],[-45.6,-23.4],[-41.6,-30],[-36,-38],[-30.6,-43.4],[-26,-41.6],[-20,-34.6],[-13,-25.6],[-7,-19.6],[2,-16.4],[12,-16.6],[22,-18],[30,-15],[34.4,-8],[34.4,0],[31.4,7],[24,9.6],[14,10.4],[2,11.6],[-8,10.4],[-14.4,8],[-21,3],[-24.4,-4],[-24.6,-12],[-27,-20],[-29.6,-25.6],[-33,-22],[-37,-18.4],[-41,-16.6]];
  P.push(tbR(G.chaikin(body,true,3),tbWH,0));
  P.push(tbR(G.chaikin([[-33.6,-44],[-33.4,-53.4],[-29.4,-44]],true,1),tbWH,0.5),tbR(TB.tongue(-31,-42,9,-150,0.3),tbRD,1));
  // eye, nostril, mouth and the line of the jaw
  P.push(tbR(FL.lens?G.xform(FL.lens(5,2.2,1.4),{x:-35.4,y:-31.4,rot:-28}):G.ellipse(-35.4,-31.4,2.4,1.2,14,-28),tbWH,2),tbN(G.circle(-35.6,-31.4,1,8),tbBL,3),tbN(G.ellipse(-43.4,-22.4,1,0.6,8,-30),tbBL,3));
  P.push(tbL(G.bez([-44,-19],[-42,-19.4],[-40.6,-19.6],[-39,-20.6],6),3),tbL(G.bez([-30.4,-28],[-30.6,-24],[-33,-22],[-36,-20.6],8),3),tbL(G.bez([-22,-10],[-18,-6],[-15,1],[-15.6,7],8),3),tbL(G.bez([27,-12],[22,-6],[22,2],[25.6,8],8),3));
  // trappings: breast band, crupper, saddle cloth, and the jewel it carries
  P.push(tbR(G.band(G.bez([-6,-12],[-12,-6],[-19,-3],[-24,-3.4],10),1.5),tbRD,2),tbR(G.band(G.bez([13,-12],[20,-11],[28,-12],[33,-9],10),1.5),tbRD,2),tbR(G.circle(-16.6,-3.4,1.9,10),tbYL,3));
  P.push(tbR(G.chaikin([[-7.6,-18.6],[12.6,-18.4],[14.6,-1.6],[-5.6,0.6]],true,2),tbBL,2),tbL(G.chaikin([[-5.4,-16],[10.6,-15.8],[12,-3.6],[-3.6,-1.8]],true,2),3,'detail',true),tbR(tbRect(-4,-20.4,9,-17.6),tbYL,3));
  for(let i=0;i<6;i++)P.push(tbN(G.circle(-3.6+i*3.2,-0.4-i*0.4,0.8,6),tbYL,3));
  P.push(...tbPut(TB.norbu(),{x:2.5,y:-36.6,s:0.4,dz:4}));return P;};
defMotif('windHorse',{name:'Wind horse',term:'rlung rta',figure:true,mirrorOk:true,meaning:'A horse in full stride with the flaming jewel on its saddle. It gives its name to the prayer flag it is printed on: lungta, wind horse, is a person’s fortune and vigour, which rises or sinks, and the wind carries the horse and the words around it across the country.',
fn(){return tbFit(TB.horse(),96);}});

/* Snow lion, second redraw 2026-10-13. The first attempts assembled the animal from tubes and
   read as a child's drawing. The references are built differently: ONE flowing contour for body
   and legs together; fur as bands of green laid on that contour and worked over with fine hair
   strokes; mane and tail as long locks each carrying its own hair lines; paws with separate toes
   and claws. Coordinates below are in a 108 × 81 study grid, mapped to the motif box by tbU. */
const tbU=p=>p.map(([x,y])=>[(x-54)*0.95,(y-40)*0.95]);
// a band of fur along a path: green, then hair strokes raked across it and past its outer edge
TB.fur=(cp,w,z,rake=1)=>{const sp=G.resample(G.chaikin(tbU(cp),false,3),false,0.9),n=sp.length,P=[tbN(G.ribbon(sp,t=>w*0.5*Math.pow(Math.sin(Math.PI*clamp(0.03+0.94*t)),0.45)),tbGR,z)];
  for(let i=1;i<n-1;i++){const a=sp[i-1],b=sp[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1,t=[(b[0]-a[0])/l,(b[1]-a[1])/l],nn=[-t[1],t[0]],q=sp[i],k=0.5*Math.pow(Math.sin(Math.PI*clamp(0.03+0.94*i/n)),0.45);
    P.push(tbL([[q[0]-nn[0]*w*k*0.9*rake,q[1]-nn[1]*w*k*0.9*rake],[q[0]+t[0]*w*0.18,q[1]+t[1]*w*0.18],[q[0]+nn[0]*w*k*1.25*rake+t[0]*w*0.5,q[1]+nn[1]*w*k*1.25*rake+t[1]*w*0.5]],z+0.05));}
  return P;};
// a long lock: a tapering leaf with three hair lines running its length
TB.flock=(cp,w,z)=>{const sp=G.resample(G.chaikin(tbU(cp),false,3),false,1),n=sp.length,hw=t=>Math.max(0.12,w*0.5*Math.pow(Math.sin(Math.PI*clamp(0.16+0.84*t)),0.8)),P=[tbR(G.ribbon(sp,hw),tbGR,z)];
  for(const o of [-0.5,0,0.5])P.push(tbL(sp.slice(1,Math.round(n*0.9)).map((q,i)=>{const k=i+1,a=sp[k-1],b=sp[Math.min(n-1,k+1)],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return[q[0]-(b[1]-a[1])/l*hw(k/n)*o,q[1]+(b[0]-a[0])/l*hw(k/n)*o];}),z+0.05));return P;};
// a curl seen end on: a disc with a spiral wound into it
TB.curl=(x,y,r,z,dir=1)=>{const [c]=tbU([[x,y]]),R=r*0.95,sp=[];for(let i=0;i<=40;i++){const t=i/40,a=(dir*t*900)*DEG,rr=R*(1-0.9*t);sp.push([c[0]+Math.cos(a)*rr,c[1]+Math.sin(a)*rr]);}
  return[tbR(G.circle(c[0],c[1],R,24),tbGR,z),tbL(sp,z+0.05),tbL(G.circle(c[0],c[1],R*0.72,18).slice(0,12),z+0.05)];};
// a paw: ankle at (x,y), toes toward `rot` (degrees, 0 = down)
TB.paw=(x,y,rot,s,z)=>{const [c]=tbU([[x,y]]),T=p=>G.xform(p,{x:c[0],y:c[1],rot,s:s*0.95}),P=[tbR(T(G.chaikin([[-5,-2.6],[5,-2.6],[6.6,1.4],[5,4.6],[-5,4.6],[-6.6,1.4]],true,2)),tbWH,z)];
  for(const [a,b,r] of [[-4.6,5,-14],[-1.6,6.2,-5],[1.6,6.2,5],[4.6,5,14]]){P.push(tbR(T(G.xform(G.chaikin([[-1.7,-2.4],[1.7,-2.4],[2.1,1],[0,3],[-2.1,1]],true,2),{x:a,y:b,rot:r})),tbWH,z+0.1));
    P.push(tbR(T(G.xform([[-0.7,2.4],[0.7,2.4],[0.5,5.4]],{x:a,y:b,rot:r})),tbWH,z+0.2));}return P;};
TB.lion=()=>{const P=[];
  // tail: long locks behind a knot of three curls
  for(const cp of [[[32,17],[36,10],[37,4],[35,0]],[[31,16],[31,8],[27,2],[22,-1]],[[30,16],[25,10],[19,7],[14,7]],[[30,17],[23,14],[16,13],[10,10]],[[30,18],[23,18],[17,19],[12,17]],[[31,19],[25,22],[20,22],[17,20]]])P.push(...TB.flock(cp.map(([x,y])=>[31+(x-31)*1.25,18+(y-18)*1.25]),7.6,-5));
  P.push(...TB.curl(29.6,17.6,5,-4),...TB.curl(36,16.6,4.4,-4,-1),...TB.curl(32.6,22,4,-3.9));
  // one contour for body and all four legs, as far as the ankles
  const S=[[34,25],[44,25],[54,28],[63,32],[71,33.5],[80,36],[87,41],[89.4,49],[87.4,56],[84.6,59],[89,58.6],[94.6,60.6],[94,66],[87,66.4],[80,64.6],[75.4,64.6],[76.4,69],[78.6,73],[75,76.4],[69.6,77.4],[63,73.6],[57.4,65],[53,58.4],[47.4,58.4],[43.6,52.6],[43.4,58.6],[39.6,59.6],[35.6,58.4],[33.4,52],[31,46.4],[26,42.6],[20,41.4],[14.4,44],[11,47.6],[7.6,48.4],[4.6,46],[4.8,38],[9,30],[16,26.4],[25,25.4]];
  P.push(tbR(G.chaikin(tbU(S),true,3),tbWH,0));
  // paws over the ankles
  P.push(...TB.paw(7.4,49,24,1.12,1),...TB.paw(39.6,60.6,-6,1.06,1),...TB.paw(75.4,77.6,-22,1.16,1),...TB.paw(96,64.6,-62,1.1,1));
  // fur: down the back of the hind leg, cuffs, the long fringe behind the foreleg
  P.push(...TB.fur([[21,26.4],[13.4,28.6],[8,34],[6,41],[7.6,46.4]],6.4,2,-1));
  P.push(...TB.fur([[32.6,49.6],[37,53],[43,54.6]],5.2,2));
  P.push(...TB.fur([[54.4,57],[57,65],[62.6,72.6],[69.6,76],[76.6,73]],7,2));
  P.push(...TB.fur([[79.6,65.4],[86,65.6],[93.6,62]],5.6,2,-1));
  // comma tufts on chest and haunch
  for(const [x,y,r,ro] of [[73,47.6,3.6,10],[72,54.4,3.3,0],[70,61,3,-10],[26.4,42,2.6,150],[37.4,44.4,2.6,170],[43.6,43.4,3,180]]){const [c]=tbU([[x,y]]),sp=[];for(let i=0;i<=16;i++){const a=(-80+i*10)*DEG;sp.push([Math.cos(a)*r*0.95,Math.sin(a)*r*0.95]);}
    P.push(tbR(G.xform(G.ribbon(sp,t=>Math.max(0.15,r*0.36*Math.sin(Math.PI*clamp(0.05+0.9*t)))),{x:c[0],y:c[1],rot:ro}),tbGR,2));}
  // muscle lines
  P.push(tbL(G.chaikin(tbU([[47,57],[50,50],[49,43]]),false,2),2),tbL(G.chaikin(tbU([[84,59],[80,60],[76,63]]),false,2),2),tbL(G.chaikin(tbU([[31,46],[30,40],[33,34]]),false,2),2));
  // the head and mane are drawn about the neck and enlarged: the head is big for the body
  const B=P.length;
  // mane: locks streaming back from the skull, then the collar under the jaw
  for(const cp of [[[80,20],[73,17],[68,18],[65,21]],[[79,23],[71,22],[65,25],[60,28]],[[79,27],[71,27],[65,31],[60,35.6]],[[80,31],[73,32],[68,36],[63.6,39.6]],[[81,34],[76,36],[72,40],[68.6,43]]])P.push(...TB.flock(cp,5.2,3));
  P.push(...TB.fur([[78,41.4],[83,40.6],[88,38.6],[92.6,39.6]],4.4,3),...TB.flock([[92,38.6],[95.6,39],[95,42.6],[92.6,44]],3.4,3));
  // curls at the back of the head
  for(const [x,y,r] of [[78.4,29.4,2.9],[77.6,24,2.9],[80.4,19.6,2.6]])P.push(tbR(G.circle(...tbU([[x,y]])[0],r*0.95,18),tbWH,3.5));
  // mouth, then the head over it
  P.push(tbR(G.chaikin(tbU([[88,31],[91.4,29.6],[96,27.6],[99,29],[100.4,34.6],[97,33.6],[92,33]]),true,1),tbRD,4));
  P.push(tbR(G.chaikin(tbU([[79.4,33],[77.6,27],[79.6,21],[84,17.6],[90,18],[95,17.4],[98,19.6],[98.6,24.6],[96.4,27.6],[91.6,29.6],[88,31],[92,33],[97,33.6],[100.6,35],[99.6,38],[94,37.6],[88,36.4],[83,35.4]]),true,2),tbWH,4.2));
  P.push(tbR(G.ribbon(G.resample(G.chaikin(tbU([[91,31.6],[95,31.6],[99,30],[101.6,28],[100,26.6]]),false,3),false,0.8),t=>1.5-0.9*t),tbRD,5));
  for(const [x,y,d] of [[93.4,29,1],[96,28,1],[94.6,33.4,-1],[98,33.8,-1]]){const [c]=tbU([[x,y]]);P.push(tbR([[c[0]-0.7,c[1]],[c[0]+0.7,c[1]],[c[0]+0.2,c[1]+d*2.3]],tbWH,5));}
  // nose, eyes under green brows, ear, and the lines of muzzle and cheek
  for(const [x,y,r] of [[93,18.6,1.5],[95,17.6,1.4],[94.6,19.8,1.3]])P.push(tbR(G.circle(...tbU([[x,y]])[0],r,10),tbRD,5));
  for(const [x,y,r] of [[89.4,24.4,2],[88.4,19.8,1.7]]){const [c]=tbU([[x,y]]);P.push(tbR(G.ellipse(c[0],c[1],r*1.25,r,16,-20),tbWH,5),tbR(G.circle(c[0]+0.2,c[1],r*0.74,14),tbOR,5.1),tbN(G.circle(c[0]+0.3,c[1],r*0.34,8),tbBL,5.2));}
  P.push(...TB.fur([[84.6,23.4],[86.4,21.6],[88.6,22]],2.4,5),...TB.fur([[84,19.6],[85.6,18],[87.4,17.8]],2,5),...TB.fur([[84.4,27],[85.6,31],[88.6,33.6]],2.6,5,-1));
  P.push(tbR(G.chaikin(tbU([[80,31],[77.4,35],[79.6,39.4],[82.6,35.6],[82.4,32]]),true,2),tbWH,5),tbL(G.chaikin(tbU([[80.6,32.6],[79.6,35.6],[80.4,37.6]]),false,2),5.1));
  P.push(tbL(G.chaikin(tbU([[91,21],[93.6,22],[96.6,21.6]]),false,2),5.1),tbL(G.chaikin(tbU([[92,26],[94.6,25.4],[97.6,24.6]]),false,2),5.1));
  const k=1.3,[pv]=tbU([[80,38]]);for(let i=B;i<P.length;i++)P[i]=Object.assign({},P[i],{pts:P[i].pts.map(([x,y])=>[pv[0]+(x-pv[0])*k,pv[1]+(y-pv[1])*k])});
  return P;};
defMotif('snowLion',{name:'Snow lion',term:'gangs seng ge',figure:true,mirrorOk:true,meaning:'The white lion of the snow mountains, bounding with its head thrown up: a mane and tail of green or turquoise flying behind, a fringe of the same down each leg. It leaps from peak to peak without tiring. It is fearless good cheer, the emblem of Tibet, and eight of them hold up a Buddha’s throne.',
fn(){return tbFit(TB.lion(),96);}});

/* ---------- the Buddha ---------- */
mkDef('held','patra',{name:'Alms bowl',term:'lhung bzed · pātra',meaning:'The iron bowl a monk eats from once a day, whatever is put in it. In the Buddha’s lap it holds nectar or a heap of rice; it is the mark of one who owns nothing.'},
(K)=>{K.Ro([[-5.6,3.3],[-6,1.4],[-4.6,-1.3],[-2.2,-2.6],[0,-2.9],[2.2,-2.6],[4.6,-1.3],[6,1.4],[5.6,3.3]],'skinDark','outer');K.Rp(G.ellipse(0,3.3,5.6,1.15,24),'seatTop','inner');K.L([[-5,0.2],[0,-0.9],[5,0.2]],'detail',{lod:2});});
mkDef('aureole','tbPrabha',{name:'Nimbus and halo',term:'\'od skor · prabhāmaṇḍala',meaning:'Two discs of light: a dark blue nimbus behind the body shot with gold rays, and a green halo behind the head, each rimmed with gold and a rainbow line.'},
(K,o)=>{const cy=o.solo?-26:-27,rx=o.solo?27:30,ry=o.solo?31:34;
  K.Rp(G.ellipse(0,cy,rx+2.6,ry+2.6,72),'clothRed','outer');K.Rp(G.ellipse(0,cy,rx+1.3,ry+1.3,72),'halo','inner');K.Rp(G.ellipse(0,cy,rx,ry,72),'skinDark','inner');
  for(let i=0;i<48;i++){const a=i*7.5*DEG,w=i%2?0.94:0.86,pts=[];for(let k=0;k<=6;k++){const t=lerp(0.56,w,k/6),b=a+Math.sin(k*1.6)*0.022;pts.push([Math.cos(b)*rx*t,cy+Math.sin(b)*ry*t]);}K.L(pts,'detail',{lod:i%2?2:1});}
  const r=o.r||12.6;K.C(0,0,r+1.3,'clothRed','outer',{n:48});K.C(0,0,r+0.6,'halo','inner',{n:48});K.C(0,0,r-0.4,'leafGreen','inner',{n:48});K.ring(0,0,r-1.6,'detail',{n:40,lod:2});});
TB.buddhaHead=(Hd)=>{const sk='skin';
  Hd.M(s=>Hd.R([[s*5.2,4.6],[s*6.5,4.9],[s*6.9,2.4],[s*6.5,-0.2],[s*5.9,-1],[s*5.5,0.4],[s*5.3,2.6]],sk,'outer'));
  mkFace(Hd,{skin:sk,earring:'none'});
  Hd.R([[-5.5,9.5],[-4.4,11.1],[-2.2,11.8],[0,11.5],[2.2,11.8],[4.4,11.1],[5.5,9.5],[6.3,12.3],[4.9,15.1],[2.5,16.4],[2.8,18.4],[1.7,19.9],[0,20.4],[-1.7,19.9],[-2.8,18.4],[-2.5,16.4],[-4.9,15.1],[-6.3,12.3]],'skinDark','outer');
  for(const [x,y] of [[-4.6,12.4],[-2.7,13.1],[-0.9,13.3],[0.9,13.3],[2.7,13.1],[4.6,12.4],[-3.7,14.5],[-1.8,15],[0,15.1],[1.8,15],[3.7,14.5],[-1.2,17.4],[1.2,17.4],[0,18.8]])Hd.ring(x,y,0.62,'detail',{n:8,lod:2});
  Hd.C(0,21,1,'halo','inner',{n:12});Hd.C(0,9.5,0.36,'pearl','detail',{n:8,lod:1});};
TB.robe=B=>{B.R([[3.4,40.5],[8,40.3],[13.9,37.1],[13.6,34],[12,31],[10.2,26],[9.3,20.5],[10.6,12.5],[10.4,6.9],[0,6.3],[-10.4,6.9],[-10.6,12.5],[-9.2,19.5],[-9.9,24.6],[-6.5,26.6],[-2.5,30.6],[1,35.6]],'clothRed','outer');
  B.T([[3.6,40.6],[1.1,35.7],[-2.4,30.7],[-6.4,26.7],[-10,24.6]],0.8,'halo','inner');
  [[[11.5,33],[5,29.4],[-3,25.6],[-8.6,21.6]],[[10.6,29],[4,25],[-3,21.4],[-9,18.4]],[[9.8,24.5],[4,21],[-2,17.4],[-9.6,15]],[[9.6,20],[4,17],[-2,13.6],[-10,11.6]],[[10.2,15],[5,12.4],[0,10.2],[-9,8.6]]].forEach((f,i)=>B.L(f,'detail',{lod:[1,2,1,3,2][i]}));};
MURTI('shakyamuni','Buddha Shakyamuni','Shākya thub pa · Śākyamuni','The Buddha of this age at the moment of awakening: seated cross-legged on a lotus, the left hand in his lap holding the alms bowl, the right reaching down to touch the earth and call it to witness. Patched monk’s robe over one shoulder, long earlobes, hair in tight curls rising to the crown-bump, a tuft between the brows. Painters build him on a grid of small units ruled before a line is drawn.',
{pose:'seat',legs:'padma',torso:'m',skin:'skin',cloth:'clothRed',aureole:'tbPrabha',haloR:12.6,seat:'padmaPitha',crown:false,hair:'none',thread:false,necklaces:false,belt:false,
 head:(K,Hd)=>TB.buddhaHead(Hd),over:(K,B)=>TB.robe(B),
 arms:[{sh:[-14.4,36.8],el:[-23.6,19],wr:[-21.6,8.8],hand:'back',handRot:270,armlet:false,bangles:false}],
 front:(K,B)=>{mkArm(B,[14.4,36.8],[22.6,19.5],[8.6,12.2],{skin:'clothRed',armlet:false,bangles:false});const Hs=B.sub({x:8.6,y:12.2,rot:90}),w=Hs.tp([0.6,6.8]);mkHand(Hs,'flat',{skin:'skin'});mkPlace(K,'held',mkPick(K,'held','patra'),{x:w[0],y:w[1],rot:0,s:1.15},{len:26});}});

/* ---------- borders ---------- (y = 0 is the outer edge of the band) */
const tbClamp=(P,L,t)=>P.map(p=>p.kind==='dot'?p:Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));
defBorder('tbPearl',{name:'Pearl border',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.62))),w=L/n,P=[tbN(tbRect(0,t*0.08,L,t*0.92),tbBL)];
  for(let i=0;i<n;i++)P.push(tbR(G.circle((i+.5)*w,t/2,Math.min(w,t)*0.33,14),tbWH,0,'inner'));
  P.push(tbL([[0,t*0.08],[L,t*0.08]],0,'outer'),tbL([[0,t*0.92],[L,t*0.92]],0,'outer'));return P;}});
defBorder('tbTFret',{name:'T-fret',fn(L,t){const h=t*0.8/3,y0=t*0.1,n=Math.max(1,Math.round(L/(4*h))),u=L/(4*n),d=Math.min(u,h)*0.13,P=[];
  for(let k=-1;k<n;k++){const X=k*4*u;
    for(const [pts,ci] of [[[[0,0],[3,0],[3,1],[2,1],[2,3],[1,3],[1,1],[0,1]],tbBL],[[[3,0],[4,0],[4,2],[5,2],[5,3],[2,3],[2,2],[3,2]],tbYL]]){
      const q=pts.map(([a,b])=>[X+a*u,y0+b*h]),I=GH.inset(q,d)||q;if(G.bbox(I).x1<0.5||G.bbox(I).x0>L-0.5)continue;P.push(tbR(I,ci,0,'inner'));}}
  return tbClamp(P,L,t).filter(p=>Math.abs(G.area(p.pts))>1).concat([tbL([[0,t*0.04],[L,t*0.04]],0,'outer'),tbL([[0,t*0.96],[L,t*0.96]],0,'outer')]);}});
defBorder('tbRainbow',{name:'Rainbow stripes',fn(L,t){const P=[],c=[tbRD,tbYL,tbGR,tbBL,tbWH];for(let i=0;i<5;i++)P.push(tbN(tbRect(0,t*(0.06+i*0.176),L,t*(0.06+(i+1)*0.176)),c[i]));
  P.push(tbL([[0,t*0.06],[L,t*0.06]],0,'outer'),tbL([[0,t*0.94],[L,t*0.94]],0,'outer'));return P;}});
defBorder('tbFlameBand',{name:'Ring of fire',fn(L,t){const n=Math.max(3,Math.round(L/(t*0.44))),w=L/n,P=[],c=[tbRD,tbOR,tbYL,tbGR,tbWH];
  for(let i=0;i<n;i++)P.push(tbR(TB.tongue((i+.5)*w,t*1.04,t*(i%2?0.82:1),i%2?-9:9,0.36),c[i%5],0,'inner'));return tbClamp(P,L,t);}});
defBorder('tbLotusBand',{name:'Lotus-petal ring',fn(L,t){const n=Math.max(3,Math.round(L/(t*0.66))),w=L/n,P=[],c=[tbRD,tbYL,tbGR,tbBL];
  for(let i=0;i<=n;i++)P.push(tbR(G.xform(G.petal(t*0.92,w*0.6,'round'),{x:i*w,y:t}),tbWH,0,'inner'));
  for(let i=0;i<n;i++){P.push(tbR(G.xform(G.petal(t*0.86,w*0.66,'round'),{x:(i+.5)*w,y:t}),c[i%4],0,'inner'));P.push(tbL(G.xform(G.petal(t*0.6,w*0.36,'round').slice(4,-4),{x:(i+.5)*w,y:t*0.94}),0));}
  return tbClamp(P,L,t);}});
defBorder('tbVajraFence',{name:'Vajra fence',fn(L,t){const n=Math.max(1,Math.round(L/(t*2.5))),w=L/n,s=Math.min(w*0.96/97,t*0.82/28),P=[tbN(tbRect(0,t*0.03,L,t*0.97),tbBL)];
  const a=TB.vajraHalf(tbYL),V=FL.done(a.concat(a.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[x,-y])})),[tbR(G.circle(0,0,5.9,16),tbYL,2)]));
  for(let i=0;i<n;i++)for(const p of V)P.push(Object.assign({},p,{role:'inner',pts:G.xform(p.pts,{x:(i+.5)*w,y:t/2,rot:90,s})}));return tbClamp(P,L,t);}});
/* Asemic dbu-can: a head line, stems hung from it, hooks above and below, a dot after each
   syllable and an upright stroke at each pause. It spells nothing. */
TB.GLY=[[[[0,0],[1,0]],[[.15,0],[.15,.6]],[[.55,0],[.55,1]],[[.15,.6],[.55,.45]]],[[[0,0],[1,0]],[[.8,0],[.8,1]],[[.8,.25],[.3,.3],[.2,.6],[.5,.75]]],[[[0,0],[1,0]],[[.5,0],[.5,.5],[.15,.9]],[[.5,.5],[.85,.9]]],
  [[[0,0],[1,0]],[[.2,0],[.2,.55],[.8,.55],[.8,0]],[[.8,.55],[.8,1]]],[[[0,0],[.9,0]],[[.7,0],[.7,.45],[.25,.5],[.25,.85],[.75,.95]]],[[[0,0],[1,0]],[[.15,0],[.3,.5],[.7,.5],[.85,0]],[[.5,.5],[.5,1]]],
  [[[0,0],[1,0]],[[.5,0],[.5,.35],[.15,.5],[.5,.7],[.85,.95]]],[[[.1,0],[1,0]],[[.85,0],[.85,1]],[[.85,.5],[.4,.5],[.4,.15]]]];
defBorder('pechaBand',{name:'Text band (asemic)',fn(L,t,seed=0){const P=[],h=t*0.42,w=h*0.76,y0=t*0.3,rnd=k=>{const v=Math.sin((k+seed*17.3)*127.1+311.7)*43758.5453;return v-Math.floor(v);};let x=t*0.2,i=0;
  const L2=(pts,role)=>P.push({kind:'line',role,pts:pts.map(([a,b])=>[x+a*w,y0+b*h])});
  while(x+w<L-t*0.2){const r=rnd(i),r2=rnd(i+0.5),r3=rnd(i+0.25);i++;
    if(r3<0.09&&i>2){L2([[.2,-.12],[.2,1.12]],'outer');x+=w*0.75;continue;}
    TB.GLY[Math.floor(r*TB.GLY.length*0.999)].forEach((st,k)=>L2(st,k?'inner':'outer'));
    if(r2<0.2)L2([[.2,-.2],[.5,-.46],[.82,-.2]],'inner');else if(r2<0.34)L2([[.28,-.42],[.72,-.16]],'inner');else if(r2<0.5)L2([[.3,1.1],[.5,1.3],[.76,1.1]],'inner');
    if(r3>0.42){P.push({kind:'dot',role:'outer',x:x+w*1.14,y:y0+h*0.04,r:Math.max(0.5,t*0.028)});x+=w*1.34;}else x+=w*1.06;}
  return P;}});

/* ---------- pattern grounds ---------- */
defTile('tigerPelt',{name:'Tiger pelt',term:'stag gdan',meaning:'The stripes of a tiger skin, flattened into a pattern either side of the spine. A tiger skin is the seat of a tantric yogin and of a ruler; knotted in wool it gave lamas and officials the seat without the animal. Tiger rugs are among the oldest Tibetan carpets to survive.',
fn(W,H,u){const cx=W/2,P=[tbN(tbRect(0,0,W,H),tbOR)],st=(cp,k)=>P.push(flP(G.ribbon(G.resample(G.bez(cp[0],cp[1],cp[2],cp[3],18),false,2),t=>0.5+u*k*Math.pow(Math.sin(Math.PI*clamp(t,0.03,0.97)),0.75)),0));
  P.push(flP(G.ribbon(G.resample([[cx,-4],[cx,H+4]],false,6),t=>u*0.045+u*0.02*Math.sin(t*H/u*5)),0));
  for(let j=-1,y=-u*0.4;y<H+u;j++,y+=u*0.56){const k=((j%2)+2)%2,len=W*(k?0.33:0.47);
    for(const s of [-1,1]){st([[cx+s*W*0.022,y],[cx+s*W*0.13,y-u*0.3],[cx+s*len*0.72,y-u*0.14],[cx+s*len,y+u*0.5]],k?0.1:0.13);
      if(!k)st([[cx+s*len*0.5,y-u*0.1],[cx+s*len*0.7,y+u*0.14],[cx+s*len*0.86,y+u*0.4],[cx+s*len*0.9,y+u*0.86]],0.07);
      else st([[cx+s*W*0.52,y+u*0.02],[cx+s*W*0.44,y-u*0.1],[cx+s*W*0.4,y+u*0.1],[cx+s*W*0.36,y+u*0.44]],0.1);}}
  return P;}});
defTile('tbBrocade',{name:'Roundel brocade',term:'gos chen',meaning:'Silk brocade woven with small gold roundels in staggered rows. Chinese and later Indian silks of this kind frame every thangka and line the robes of high lamas; the cloth was itself an offering.',
fn(W,H,u){const s=u,P=[tbN(tbRect(0,0,W,H),tbBL)];
  for(let j=-1;j*s*0.86<H+s;j++)for(let i=-1;i*s<W+s;i++){const x=i*s+(j%2?s/2:0),y=j*s*0.86;
    P.push(tbN(G.circle(x,y,s*0.33,20),tbYL),tbN(G.circle(x,y,s*0.27,18),tbBL));for(let k=0;k<4;k++)P.push(tbN(G.xform(G.petal(s*0.2,s*0.08,'round'),{x,y,rot:k*90+45}),tbYL));
    P.push(tbN(G.circle(x,y,s*0.045,8),tbRD),tbN(G.circle(x+s/2,y,s*0.05,8),tbYL));}return P;}});
defTile('kushu',{name:'Brocade diamonds',term:'kushüthara',meaning:'Rows of stepped diamonds picked out in coloured silk on a white ground, each with a smaller diamond and a cross inside, and narrow bands of small signs between. The patterns are worked thread by thread with a pick; a woman’s dress in this technique takes a year.',
fn(W,H,u){const P=[],sx=u*1.5,py=u*1.7,a=u*0.62,b=u*0.56,c1=[tbRD,tbBL,tbGR,tbOR],c2=[tbYL,tbYL,tbRD,tbBL];
  for(let j=-1;j*py<H+py;j++){const y=j*py+py*0.5;
    for(let i=-1;i*sx<W+sx;i++){const x=i*sx+(j%2?sx/2:0),k=(((i+2*j)%4)+4)%4;
      P.push(tbN(steppedDiamond(x,y,a,b,5),c1[k]),tbN(steppedDiamond(x,y,a*0.62,b*0.62,3),c2[k]),tbN(tbRect(x-a*0.3,y-b*0.07,x+a*0.3,y+b*0.07),c1[(k+1)%4]),tbN(tbRect(x-a*0.07,y-b*0.3,x+a*0.07,y+b*0.3),c1[(k+1)%4]));
      P.push(tbN(steppedDiamond(x+sx/2,y,a*0.26,b*0.26,2),c1[(k+2)%4]));}
    const yb=j*py+py;P.push({kind:'line',role:'inner',pts:[[0,yb-u*0.13],[W,yb-u*0.13]]},{kind:'line',role:'inner',pts:[[0,yb+u*0.13],[W,yb+u*0.13]]});
    for(let i=0;i*u*0.3<W+u;i++){const x=i*u*0.3;P.push(tbN([[x,yb-u*0.08],[x+u*0.09,yb],[x,yb+u*0.08],[x-u*0.09,yb]],c1[((i+j)%4+4)%4]));}}
  return P;}});

/* ---------- layouts ---------- */
const tbTiles=(g,want)=>{const p=poolAll(g.motifs.tile).filter(k=>SG.tiles[k]);return p.includes(want)?want:(p[0]||want);};
const tbBorder=(g,want,not=/^$/)=>{const p=[...new Set(poolAll(g.motifs.border))].filter(k=>SG.borders[k]&&!not.test(k));return p.includes(want)?want:(p[0]||want);};
/* Mandala: the ground plan of a palace seen from above, inside rings of fire, vajras and
   lotus petals. East is at the bottom. */
defStructure('mandala',{name:'Mandala',blurb:'A palace seen from above: rings of fire, vajras and lotus petals; a square with a T-shaped gate in each wall; the floor quartered into the colours of the four directions round a lotus.',
fn(ctx){
  const {W,H,g,rng}=ctx,cx=W/2,cy=H/2,R=Math.min(W,H)/2-24,P=[];
  const circ=r=>G.circle(cx,cy,r,144),ring=(key,r0,r1)=>{const sp=G.circle(cx,cy,(r0+r1)/2,200);sp.push(sp[0]);return KO.bandParts(key,sp,()=>-(r1-r0)/2,()=>r1-r0,r1-r0,false).parts;};
  const kF=tbBorder(g,'tbFlameBand'),kV=tbBorder(g,'tbVajraFence',/Flame/),kL=tbBorder(g,'tbLotusBand',/Flame|Vajra/);
  ctx.items.push({type:'parts',parts:[tbR(circ(R),tbBL)].concat(ring(kF,R*0.9,R)),role:'ring',variant:'fire'});
  ctx.items.push({type:'parts',parts:[tbR(circ(R*0.9),tbBL)].concat(ring(kV,R*0.815,R*0.895)),role:'ring',variant:'vajra'});
  ctx.items.push({type:'parts',parts:[tbR(circ(R*0.81),tbYL),tbR(circ(R*0.798),tbGR)].concat(ring(kL,R*0.705,R*0.795)),role:'ring',variant:'lotus'});
  const Ri=R*0.7,s=Ri*0.6,wt=s*0.11,a=s*0.21,b=s*0.41,d1=s*0.1,d2=s*0.27;
  P.push({kind:'region',closed:true,role:'outer',bg:true,plain:true,pts:circ(Ri)});
  const side=[[-s,-s],[-a,-s],[-a,-s-d1],[-b,-s-d1],[-b,-s-d1-d2],[b,-s-d1-d2],[b,-s-d1],[a,-s-d1],[a,-s]],rot=(p,k)=>{let [x,y]=p;for(let i=0;i<k;i++)[x,y]=[-y,x];return[cx+x,cy+y];};
  const pal=[];for(let k=0;k<4;k++)for(const p of side)pal.push(rot(p,k));
  // gate arches: three narrowing bars and a jewel over each gate
  for(let k=0;k<4;k++){[[0.86,tbYL],[0.64,tbBL],[0.4,tbRD]].forEach(([w,ci],i)=>{const y=-s-d1-d2-s*0.046*i;P.push(tbR([[-s*w/2,y],[s*w/2,y],[s*w/2,y-s*0.046],[-s*w/2,y-s*0.046]].map(p=>rot(p,k)),ci));});
    P.push(tbR(TB.gem(0,-s-d1-d2-s*0.19,s*0.09,s*0.11).map(p=>rot(p,k)),tbYL));}
  // five walls
  const wc=[tbWH,tbYL,tbRD,tbGR,tbBL];let floor=pal;
  for(let i=0;i<5;i++){const q=i?GH.inset(pal,wt*i/5):pal;if(!q)break;P.push(i?tbN(q,wc[i]):tbR(q,wc[i]));floor=GH.inset(pal,wt*(i+1)/5)||floor;}
  // the floor, quartered: east (bottom) white, south (left) yellow, west (top) red, north (right) green
  const far=R*2,quad=[[[-far,far],[far,far]],[[-far,-far],[-far,far]],[[far,-far],[-far,-far]],[[far,far],[far,-far]]],qc=[tbWH,tbYL,tbRD,tbGR];
  quad.forEach(([p,q],i)=>P.push(...GH.clipConvex([tbN(floor,qc[i])],[[cx,cy],[cx+p[0],cy+p[1]],[cx+q[0],cy+q[1]]])));
  P.push(tbL(floor,0,'outer',true));for(const [dx,dy] of [[1,1],[1,-1]])P.push(...GH.clipConvex([tbL([[cx-dx*s,cy-dy*s],[cx+dx*s,cy+dy*s]],0,'inner')],floor.length<5?floor:tbRect(cx-s+wt,cy-s+wt,cx+s-wt,cy+s-wt)));
  // the inner circle and its eight-petalled lotus
  const rc=(s-wt)*0.56,pc=[tbRD,tbOR,tbGR,tbOR,tbWH,tbOR,tbYL,tbOR];
  P.push(tbR(circ(rc),tbYL),tbR(circ(rc*0.94),tbBL));
  for(const off of [22.5,0])for(let i=0;i<8;i++){if(off&&i%1)continue;const pet=polarPetal(rc*0.4,rc*(off?0.46:0.52),rc*(off?0.2:0.26),i*45+off,'round').map(([x,y])=>[cx+x,cy+y]);P.push(tbR(pet,off?tbWH:pc[i],0,'inner'));}
  P.push(tbR(circ(rc*0.5),tbYL),tbR(circ(rc*0.46),tbBL));
  ctx.items.push({type:'parts',parts:P,role:'frame',variant:'palace'});
  const hero=ctx.pick('hero'),ringK=ctx.pick('ring'),fil=ctx.pick('filler'),M=SG.motifs[hero]||{};
  ctx.motif(hero,cx,cy,rc*(M.fine?0.98:0.8),{role:'hero',variant:'hero'});
  const dq=rc+(s-wt-rc)*0.5+s*0.04;[[0,1],[-1,0],[0,-1],[1,0]].forEach(([dx,dy],i)=>ctx.motif(ringK,cx+dx*dq,cy+dy*dq,(s-wt-rc)*0.78,{role:'ring',variant:'gate'}));
  const ck=fil==='dot'?ringK:fil,d=Math.min(W,H)/2*0.835;for(const [dx,dy] of [[-1,-1],[1,-1],[1,1],[-1,1]])ctx.motif(ck,cx+dx*d,cy+dy*d,R*0.22,{role:'filler',variant:'corner',flip:dx>0});
}});
/* Thangka: a painting on sized cotton sewn into a brocade mount, with a rod top and
   bottom so that it can be rolled. */
TB.throne=(cx,y,hw)=>{const P=[],n=9;for(let pass=0;pass<2;pass++)for(let i=0;i<n-(pass?0:1);i++){const x=cx-hw*0.9+(i+(pass?0.5:1))*hw*1.8/n,u=(x-cx)/hw;
    P.push(tbR(G.xform(G.petal(hw*0.26,hw*0.105,'round'),{x,y:y+hw*0.03,rot:180+u*-42}),pass?tbRD:tbOR));}
  P.push(tbR(G.ellipse(cx,y,hw,hw*0.1,40),tbWH));return P;};
defStructure('thangka',{name:'Thangka',blurb:'A scroll painting in its brocade mount: sky above, hills below, the central figure on a lotus with its nimbus, offerings at its feet, and a small door panel in the mount.',
fn(ctx){
  const {W,H,g,rng}=ctx,cx=W/2,mw=H*0.355,my0=24,my1=H-34,pw=H*0.25,py0=my0+H*0.08,py1=my1-H*0.2,ph=py1-py0,px0=cx-pw,px1=cx+pw;
  ctx.items.push({type:'parts',parts:tileParts(tbTiles(g,'tbBrocade'),{x0:cx-mw,y0:my0,x1:cx+mw,y1:my1},40,rng.fork('m'),g),role:'frame',variant:'mount',under:true});
  const F=[tbL(tbRect(cx-mw,my0,cx+mw,my1),0,'outer',true),tbN(tbRect(px0-15,py0-15,px1+15,py1+15),tbRD),tbN(tbRect(px0-8,py0-8,px1+8,py1+8),tbYL),{kind:'region',closed:true,role:'outer',bg:true,plain:true,pts:tbRect(px0,py0,px1,py1)}];
  F.push(tbN(tbRect(px0,py0,px1,py1),tbBL));
  // hills
  const hills=[];for(const [u,w,h,ci] of [[-0.78,0.5,0.3,tbBL],[0.8,0.52,0.32,tbBL],[-0.34,0.5,0.22,tbGR],[0.4,0.54,0.24,tbGR],[-0.86,0.4,0.15,tbGR],[0.02,0.6,0.13,tbGR],[0.9,0.42,0.16,tbGR]]){const x=cx+u*pw,ww=w*pw,hh=h*ph,yb=py1+4;
    const pk=G.chaikin([[x-ww,yb],[x-ww*0.72,yb-hh*0.42],[x-ww*0.3,yb-hh*0.86],[x-ww*0.06,yb-hh],[x+ww*0.24,yb-hh*0.8],[x+ww*0.6,yb-hh*0.5],[x+ww,yb]],false,3);hills.push(tbR(pk.concat([[x+ww,yb+6],[x-ww,yb+6]]),ci));
    for(const k of [0.78,0.56])hills.push(tbL(pk.map(([a,b])=>[x+(a-x)*k,yb+(b-yb)*k]),0));}
  F.push(...clipPartsRect(hills,{x0:px0,y0:py0,x1:px1,y1:py1}),tbL(tbRect(px0,py0,px1,py1),0,'outer',true));
  // rods
  F.push(tbR(tbRect(cx-mw-6,my0-9,cx+mw+6,my0+1),tbYL),tbR(G.roundRect(cx-mw-24,my1-3,cx+mw+24,my1+13,6),tbYL),tbR(tbRect(cx-mw-34,my1-6,cx-mw-22,my1+16),tbRD),tbR(tbRect(cx+mw+22,my1-6,cx+mw+34,my1+16),tbRD));
  // door panel in the lower mount
  const dw=H*0.07,dy0=py1+H*0.05,dy1=dy0+H*0.105;F.push(tbR(tbRect(cx-dw,dy0,cx+dw,dy1),tbRD),tbL(tbRect(cx-dw+6,dy0+6,cx+dw-6,dy1-6),0,'detail',true));
  ctx.parts(F,'frame');
  const hero=ctx.pick('hero'),M=SG.motifs[hero]||{},hs=Math.min(pw*1.62,ph*0.62),hy=py0+ph*0.455;
  if(!(M.figure&&M.sacred)){const A=[tbR(G.circle(cx,hy-hs*0.02,hs*0.6,90),tbRD),tbR(G.circle(cx,hy-hs*0.02,hs*0.575,90),tbYL),tbR(G.circle(cx,hy-hs*0.02,hs*0.55,90),tbBL)];
    for(let i=0;i<48;i++){const a=i*7.5*DEG;A.push(tbL([[cx+Math.cos(a)*hs*0.4,hy-hs*0.02+Math.sin(a)*hs*0.4],[cx+Math.cos(a)*hs*(i%2?0.53:0.48),hy-hs*0.02+Math.sin(a)*hs*(i%2?0.53:0.48)]],0));}
    ctx.parts(A.concat(TB.throne(cx,hy+hs*0.5,hs*0.5)),'frame');}
  ctx.motif(hero,cx,hy,hs*(M.figure&&M.sacred?1.16:0.8),{role:'hero',variant:'hero'});
  const fil=ctx.pick('filler'),ck=fil==='dot'?'cloud':fil;for(const s of [-1,1])ctx.motif(ck,cx+s*pw*0.66,py0+ph*0.09,pw*0.5,{role:'filler',variant:'cloud',flip:s>0});
  const rk=[...new Set(poolAll(g.motifs.ring))].filter(k=>SG.motifs[k]&&k!=='dot'),pk=rng.shuffle(rk.length?rk:['floret']);
  [[-0.66,0.905],[0,0.925],[0.66,0.905]].forEach(([u,v],i)=>ctx.motif(pk[i%pk.length],cx+u*pw,py0+ph*v,pw*0.36,{role:'ring',variant:'offer'+i}));
  ctx.motif(pk[3%pk.length],cx,(dy0+dy1)/2,H*0.082,{role:'ring',variant:'door',noOcc:true});
}});
/* Prayer flag: one block-printed square on a string of five. The horse in the middle, an
   animal in each corner, text between. */
defStructure('lungta',{name:'Prayer flag',blurb:'A block-printed flag on its cord: the wind horse in the middle, an emblem in each corner and lines of text between; the edges of the neighbouring flags show at either side.',
fn(ctx){
  const {W,H,g,rng}=ctx,cx=W/2,cy=H/2+12,fw=W*0.4,fh=H*0.43,x0=cx-fw,x1=cx+fw,y0=cy-fh,y1=cy+fh,P=[];
  P.push(Object.assign(tbN(tbRect(-10,y0,x0-12,y1-rng.range(0,14)),tbBL),{dye:true}),Object.assign(tbN(tbRect(x1+12,y0,W+10,y1-rng.range(0,14)),tbRD),{dye:true}));
  for(const [a,b] of [[-10,x0-12],[x1+12,W+10]])P.push(tbL([[a,y0+16],[b,y0+16]],0,'inner'),tbL([[a,y0],[b,y0]],0,'outer'));
  P.push(tbL(tbRect(x0,y0,x1,y1),0,'outer',true),tbL([[x0,y0+16],[x1,y0+16]],0,'inner'),tbL(tbRect(x0+22,y0+36,x1-22,y1-22),0,'outer',true),tbL(tbRect(x0+29,y0+43,x1-29,y1-29),0,'inner',true));
  P.push({kind:'line',role:'outer',pts:G.chaikin([[-10,y0-9],[W*0.25,y0-5],[cx,y0-9],[W*0.75,y0-5],[W+10,y0-9]],false,3)});
  ctx.parts(P,'frame');
  const ix0=x0+40,ix1=x1-40,iy0=y0+54,iy1=y1-40,c=(ix1-ix0)*0.21,th=c/3,key=tbBorder(g,'pechaBand'),T=[];let sd=1;
  const line=(xa,xb,y)=>{for(const p of SG.borders[key].fn(xb-xa,th,sd++))T.push(p.kind==='dot'?Object.assign({},p,{x:p.x+xa,y:p.y+y}):Object.assign({},p,{pts:p.pts.map(([a,b])=>[a+xa,b+y])}));};
  for(let i=0;i<3;i++){line(ix0+c+10,ix1-c-10,iy0+i*th);line(ix0+c+10,ix1-c-10,iy1-c+i*th);}
  ctx.items.push({type:'parts',parts:T,role:'ring',variant:'text'});
  const hero=ctx.pick('hero'),rk=[...new Set(poolAll(g.motifs.ring))].filter(k=>SG.motifs[k]&&k!=='dot'),pk=rk.length?rk:['floret'];
  ctx.motif(hero,cx,(iy0+iy1)/2,Math.min(ix1-ix0,iy1-iy0-2*c-20)*0.98,{role:'hero',variant:'hero'});
  [[ix0+c/2,iy0+c/2],[ix1-c/2,iy0+c/2],[ix0+c/2,iy1-c/2],[ix1-c/2,iy1-c/2]].forEach(([x,y],i)=>ctx.motif(pk[i%pk.length],x,y,c*0.92,{role:'ring',variant:'corner'+i,flip:i%2===1}));
}});
/* Khaden: the sleeping and sitting rug, about twice as long as wide. Borders of pearls
   and T-fret round a field with three medallions, or a tiger pelt and nothing else. */
defStructure('khaden',{name:'Rug',blurb:'A knotted rug twice as long as wide: fringed ends, borders of pearls and fret, and a field with three medallions and cloud corners, or else a tiger pelt from edge to edge.',
fn(ctx){
  const {W,H,g,rng}=ctx,S=g.structure,cx=W/2,rw=W*0.3,x0=cx-rw,x1=cx+rw,y0=40,y1=H-40,F=[];
  for(let x=x0+3;x<x1;x+=6)for(const [ya,d] of [[y0,-1],[y1,1]])F.push({kind:'line',role:'detail',pts:[[x,ya],[x+rng.range(-1.5,1.5),ya+d*rng.range(14,22)]]});
  ctx.parts(F,'frame');
  const r=frameBands(ctx,{x0,y0,x1,y1},clamp(Math.round(S.borderBands||2),1,3),36),iw=r.x1-r.x0,ih=r.y1-r.y0,cy=(r.y0+r.y1)/2;
  const tk=poolAll(g.motifs.tile).filter(k=>SG.tiles[k]);
  if(tk.includes('tigerPelt')&&rng.chance(0.34)){ctx.items.push({type:'parts',parts:tileParts('tigerPelt',r,iw*0.3,rng.fork('t'),g),role:'frame',variant:'pelt'});return;}
  const hero=ctx.pick('hero'),ringK=ctx.pick('ring'),fil=ctx.pick('filler'),ck=fil==='dot'?'cloud':fil,D=[];
  for(const [y,rr,ci] of [[cy,iw*0.4,tbRD],[cy-ih*0.34,iw*0.27,tbOR],[cy+ih*0.34,iw*0.27,tbOR]])D.push(tbR(G.circle(cx,y,rr,72),ci),tbL(G.circle(cx,y,rr*0.93,64),0,'detail',true));
  ctx.parts(D,'frame');
  ctx.motif(hero,cx,cy,iw*0.6,{role:'hero',variant:'hero'});for(const s of [-1,1])ctx.motif(ringK,cx,cy+s*ih*0.34,iw*0.4,{role:'ring',variant:'medal'});
  for(const [sx,sy] of [[-1,-1],[1,-1],[1,1],[-1,1]])ctx.motif(ck,cx+sx*iw*0.34,cy+sy*(ih/2-iw*0.13),iw*0.25,{role:'filler',variant:'corner',flip:sx>0,rot:sy>0?180:0});
  for(const s of [-1,1])for(const t of [-1,1])ctx.motif(ck,cx+s*iw*0.36,cy+t*ih*0.17,iw*0.2,{role:'filler',variant:'side',flip:s>0});
}});
/* Kira: a length of Bhutanese brocade, patterned field between striped ends. */
defStructure('kira',{name:'Brocade cloth',blurb:'A length of handwoven cloth: a field of brocade diamonds between ends striped in many colours.',
fn(ctx){
  const {W,H,g,rng}=ctx,S=g.structure,x0=40,x1=W-40,y0=70,y1=H-70,bw=(x1-x0)*0.11,P=[],c=[tbRD,tbYL,tbBL,tbGR,tbOR,tbRD,tbBL];
  ctx.items.push({type:'parts',parts:tileParts(tbTiles(g,'kushu'),{x0:x0+bw,y0,x1:x1-bw,y1},lerp(104,70,clamp(S.density)),rng.fork('k'),g),role:'frame',variant:'cloth'});
  for(const s of [0,1]){let x=0,i=0;const ws=[0.2,0.06,0.1,0.06,0.16,0.06,0.1,0.06,0.2];for(const w of ws){const xa=s?x1-bw+x*bw:x0+x*bw;P.push(tbN(tbRect(xa,y0,xa+w*bw,y1),i%2?tbYL:c[(i/2+s*2)%c.length|0]));x+=w;i++;}
    P.push({kind:'line',role:'outer',pts:[[s?x1-bw:x0+bw,y0],[s?x1-bw:x0+bw,y1]]});}
  P.push({kind:'line',role:'outer',closed:true,pts:tbRect(x0,y0,x1,y1)});
  for(let y=y0+4;y<y1;y+=7)for(const [xa,d] of [[x0,-1],[x1,1]])P.push({kind:'line',role:'detail',pts:[[xa,y],[xa+d*rng.range(10,18),y+rng.range(-1.5,1.5)]]});
  ctx.parts(P,'frame');
}});
