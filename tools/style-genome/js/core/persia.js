'use strict';
/* Persia — the floral half of Persian design. (The geometric half, girih, is in girih.js.)

   Persian designers name two systems and combine them.
   ISLIMI is the spiral: a thin stem that winds in toward a centre and throws off other
   spirals, bearing the split leaf (a leaf divided into a long lobe and a short one).
   KHATAI is what grows on it: composite blossoms seen in profile, rosettes seen from
   above, buds and long serrated leaves.

   A scroll here is a spiral whose radius shrinks with angle. Scrolls are laid on a
   grid in mirrored pairs so that each pair of neighbours starts from one point and
   winds opposite ways: an S. The same generator fills a carpet field, a border bay, a
   corner piece.

   A CARPET is a plan: a medallion at the centre with a pendant above and below, a
   quarter of that medallion in each corner, the field between covered with scrolls, a
   wide border between two narrow guard stripes.

   Colour is positional: 0 dark blue, 1 red, 2 gold, 3 green, 4 ivory, 5 turquoise.
   All constructions are original; none traces a reference image. */

const PE={};
const [peBL,peRD,peGD,peGR,peIV,peTQ]=[0,1,2,3,4,5];
const peR=(pts,ci,z=0,role='inner')=>({kind:'region',closed:true,role,ci,plain:true,z,pts});
const peN=(pts,ci,z=0)=>({kind:'region',closed:true,role:'detail',ci,plain:true,ns:SG.cov!==false,z,pts});
const peL=(pts,z=6,role='detail',closed=false)=>({kind:'line',role,closed,pts,z});
const peFit=(P,s=94)=>fitParts(FL.done(P),s);
const pePut=(parts,o)=>parts.map(p=>Object.assign({},p,{z:(p.z||0)+(o.dz||0),pts:G.xform(p.pts,o)}));
const peRect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const peLobed=(a,b,n,k,m=160)=>{const p=[];for(let i=0;i<m;i++){const t=i/m*Math.PI*2,r=1+k*Math.abs(Math.cos(t*n/2))-k*0.5;p.push([a*r*Math.cos(t),b*r*Math.sin(t)]);}return p;};
const peScale=(pts,k,c=[0,0])=>pts.map(([x,y])=>[c[0]+(x-c[0])*k,c[1]+(y-c[1])*k]);

/* ---------- khatai: blossoms, buds, leaves ---------- */
// the composite blossom in profile, base at the origin, pointing up; h = its height
PE.palmette=(h=80,lite=false)=>{const P=[],k=h/80;
  for(const s of [-1,1])P.push(peR(SL.curl(s*3*k,2*k,26*k,s*118,s*-150,5.4*k),peGR,-1));
  [[-78,40],[78,40],[-54,54],[54,54],[-29,66],[29,66],[0,76]].forEach(([a,l])=>{P.push(peR(G.xform(G.petal(l*k,(a?8.6:9.6)*k,'pointed'),{y:-2*k,rot:a}),peRD,0));if(!lite)P.push(peL(G.xform(G.petal(l*k*0.74,4.6*k,'pointed').slice(3,-3),{y:-4*k,rot:a}),0.5));});
  [[-58,30],[58,30],[-30,42],[30,42],[0,50]].forEach(([a,l])=>P.push(peR(G.xform(G.petal(l*k,7*k,'pointed'),{y:-2*k,rot:a}),peIV,1)));
  P.push(peR(G.xform(G.petal(34*k,9.4*k,'drop'),{y:-2*k}),peBL,2),peR(G.xform(G.petal(22*k,5*k,'drop'),{y:-5*k}),peGD,3));
  if(!lite)for(const y of [-10,-15,-20])P.push(peN(G.circle(0,y*k,0.9*k,6),peRD,4));
  P.push(peR(G.chaikin([[-7*k,3*k],[0,-5*k],[7*k,3*k],[0,7*k]],true,2),peGD,3));return P;};
defMotif('pePalmette',{name:'Shah Abbasi blossom',term:'gol-e shāh ʿabbāsī',upright:true,meaning:'The great composite flower of Persian carpets, seen in profile: ranks of pointed petals round a pomegranate heart, on a calyx of two curled leaves. It descends from the lotus by way of China, and takes its name from the shah under whom Isfahan’s carpet workshops flourished.',
fn(){return peFit(pePut(PE.palmette(80),{y:34}),94);}});
PE.rosette=(r=40,lite=false)=>{const P=[];for(let i=0;i<8;i++)P.push(peR(SL.petal(0,0,i*45,r,0.3),peIV,0));
  for(let i=0;i<8;i++){P.push(peR(SL.petal(0,0,i*45+22.5,r*0.7,0.32),peRD,1));if(!lite)P.push(peN(SL.petal(0,0,i*45,r*0.52,0.12),peRD,0.5));}
  P.push(peR(G.circle(0,0,r*0.24,20),peGD,2));if(!lite)for(let i=0;i<8;i++){const d=slDir(i*45);P.push(peN(G.circle(d[0]*r*0.15,d[1]*r*0.15,r*0.03,6),peBL,3));}P.push(peN(G.circle(0,0,r*0.07,8),peBL,3));return P;};
defMotif('peRosette',{name:'Rosette',term:'gol-e panj par',meaning:'A blossom seen from above, its petals in two ranks about a gold centre. In a khatai scroll it alternates with the profile blossom, so that the same plant seems to be seen from every side.',
fn(){return peFit(PE.rosette(44),92);}});
// the split leaf: a long lobe curving one way and a short one turning back
PE.rumi=(x,y,len,rot,turn,ci=peGD)=>[peR(SL.curl(x,y,len,rot,turn*86,len*0.2),ci,0),peR(SL.curl(x,y,len*0.52,rot-turn*62,-turn*96,len*0.13),ci,0)];
// a long serrated leaf along a curve
PE.saz=(cp,w,ci=peGR)=>{const sp=G.resample(G.chaikin(cp,false,3),false,1.6),L=G.length(sp,false),hw=t=>Math.max(0.3,w*Math.pow(Math.sin(Math.PI*clamp(0.04+0.92*t)),0.8)),P=[peR(G.ribbon(sp,hw),ci,0),peL(sp.slice(2,-2),1)];
  G.samples(sp,false,L/9).slice(1,-1).forEach((q,i,A)=>{const t=(i+1)/(A.length+1),a=Math.atan2(q.tx,-q.ty)/DEG;for(const s of [-1,1])P.push(peR(SL.dab(q.x-s*q.ty*hw(t)*0.6,q.y+s*q.tx*hw(t)*0.6,w*0.9,a+s*42,0.26),ci,-0.5));});return P;};
defMotif('peLeaf',{name:'Saz leaf',term:'barg',meaning:'The long, curved, saw-edged leaf that sweeps through sixteenth-century Persian and Ottoman design, as large as the blossoms it lies among. It bends like a feather and often pierces a flower or another leaf.',
fn(){return peFit(PE.saz([[-28,40],[-22,12],[-2,-12],[26,-28],[34,-42]],7.4),94);}});
defMotif('peBud',{name:'Bud',term:'ghoncheh',upright:true,meaning:'A closed bud on a bending stem: the smallest member of the khatai family, set where a scroll ends or where a gap is too small for a flower.',
fn(){const P=[peR(SL.curl(0,14,34,172,40,2),peGR,-1)];for(const a of [-46,46])P.push(peR(SL.curl(0,14,15,a,a>0?60:-60,3),peGR,0));
  for(const [a,l,ci] of [[-22,34,peRD],[22,34,peRD],[0,40,peIV]])P.push(peR(G.xform(G.petal(l,7,'pointed'),{y:14,rot:a}),ci,a?1:2));P.push(peL([[0,8],[0,-16]],3),peR(G.chaikin([[-5,15],[0,8],[5,15],[0,19]],true,2),peGD,3));return peFit(P,92);}});

/* ---------- islimi: the spiral scroll ---------- */
// a spiral stem from its outer end (angle a0 on radius R about the centre) winding in; dir = ±1
PE.spiral=(cx,cy,R,a0,turns,dir,n=70)=>{const p=[];for(let i=0;i<=n;i++){const t=i/n,a=(a0+dir*t*turns*360)*DEG,r=R*(0.1+0.9*Math.pow(1-t,0.9));p.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}return p;};
/* one scroll: stem, split leaves on alternate sides, a blossom at the heart.
   o.blossom: 'p' profile, 'r' rosette, 'b' none */
PE.scroll=(cx,cy,R,a0,dir,o={})=>{const sp=PE.spiral(cx,cy,R,a0,o.turns||1.6,dir),P=[peR(G.band(sp,Math.max(1.1,R*0.05)),o.stem!=null?o.stem:peGD,0)],n=sp.length-1;
  [0.12,0.3,0.46,0.6,0.72].forEach((t,i)=>{const k=Math.round(t*n),q=sp[k],q2=sp[Math.min(n,k+2)],ang=Math.atan2(q2[0]-q[0],-(q2[1]-q[1]))/DEG,side=i%2?1:-1;P.push(...PE.rumi(q[0],q[1],R*lerp(0.5,0.26,t),ang+side*dir*-52,side*dir*-1,o.leaf!=null?o.leaf:peGD).map(p=>Object.assign(p,{z:1})));});
  const e=sp[n],e0=sp[n-5],ang=Math.atan2(e[0]-e0[0],-(e[1]-e0[1]))/DEG;
  if(o.blossom==='r')P.push(...pePut(PE.rosette(R*0.3,true),{x:cx,y:cy,dz:2}));
  else if(o.blossom!=='b')P.push(...pePut(PE.palmette(R*0.66,true),{x:e[0],y:e[1],rot:ang,dz:2}));
  return P;};
defMotif('peScroll',{name:'Spiral scroll',term:'eslīmī',meaning:'A stem that winds inward and ends in a blossom, with split leaves leaving it on alternate sides. This is the unit of the arabesque: Persian designers call the spiral and its leaves eslimi and the flowers khatai, and a design is the two laid over each other.',
fn(){return peFit(PE.scroll(0,0,44,180,1,{turns:1.7}).concat(PE.scroll(-88,0,44,0,-1,{turns:1.7,blossom:'r'})),96);}});

/* ---------- medallions ---------- */
PE.toranj=(pend=true)=>{const P=[],O=peLobed(27,33,16,0.1);
  if(pend)for(const s of [-1,1]){P.push(peR(pePut([{pts:peLobed(6.4,9,8,0.14,64)}],{y:s*40})[0].pts,peRD,0),peR(peScale(peLobed(6.4,9,8,0.14,64),0.62).map(([x,y])=>[x,y+s*40]),peGD,1),peR(G.xform(G.petal(8,3,'pointed'),{y:s*47.6,rot:s>0?180:0}),peGD,0),peL([[0,s*31],[0,s*33]],0));}
  P.push(peR(O,peGD,1),peR(peScale(O,0.9),peBL,2),peR(peScale(peLobed(27,33,8,0.16),0.6),peRD,3),peR(peScale(peLobed(27,33,8,0.16),0.52),peIV,3.2));
  for(let i=0;i<4;i++)P.push(...pePut(PE.palmette(11,true),{y:0,rot:i*90+45,dz:4}).map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>{const d=slDir(i*90+45);return[x+d[0]*17,y+d[1]*20];})})));
  for(let i=0;i<4;i++){const d=slDir(i*90);P.push(...pePut(PE.rosette(3.6,true),{x:d[0]*22.6,y:d[1]*27.6,dz:4}));}
  P.push(...pePut(PE.rosette(11,false),{dz:5}));return P;};
defMotif('peToranj',{name:'Carpet medallion',term:'toranj',upright:true,meaning:'The lobed medallion at the centre of a carpet, with a cartouche and a small finial hanging above and below. Its name is the word for a citron. Designers took it from the tooled leather covers of books, which have the same medallion and the same corner pieces.',
fn(){return peFit(PE.toranj(),96);}});
PE.shamsa=()=>{const P=[],star=[];for(let i=0;i<32;i++){const d=slDir(i*11.25),r=i%2?38:45;star.push([d[0]*r,d[1]*r]);}
  P.push(peR(star,peGD,0),peR(peScale(star,0.9),peBL,1),peR(G.circle(0,0,29,64),peGD,2),peR(G.circle(0,0,27.4,60),peIV,2.2));
  for(let i=0;i<16;i++){const d=slDir(i*22.5);P.push(...pePut(PE.rosette(2.5,true),{x:d[0]*35.4,y:d[1]*35.4,dz:2}));}
  for(let i=0;i<8;i++){P.push(peR(SL.petal(0,0,i*45,26,0.26),i%2?peRD:peBL,3),peR(SL.petal(0,0,i*45,17,0.2),peGD,3.5),...PE.rumi(slDir(i*45+22.5)[0]*14,slDir(i*45+22.5)[1]*14,9,i*45+22.5,1,peGR).map(p=>Object.assign(p,{z:3.2})));}
  P.push(peR(G.circle(0,0,9.4,28),peGD,4),peR(G.circle(0,0,7.6,24),peBL,4.2),...pePut(PE.rosette(6.4,true),{dz:5}));return P;};
defMotif('peShamsa',{name:'Sunburst',term:'shamseh',meaning:'A many-pointed medallion in gold and lapis, drawn at the opening of a manuscript and on the centre of a dome: the sun, and by long habit the light of the divine, from which everything else on the page radiates.',
fn(){return peFit(PE.shamsa(),94);}});

/* ---------- boteh, cypress, rose, nightingale ---------- */
PE.botehOutline=()=>G.chaikin([[0,45],[-17,39],[-26,20],[-23,-2],[-12,-21],[2,-35],[15,-44],[27,-43],[30,-34],[23,-28],[14,-29],[9,-21],[15,-3],[22,16],[18,36]],true,3);
PE.boteh=(lite=false)=>{const P=[],O=PE.botehOutline(),c=[-1,10];
  if(!lite)G.samples(O,true,G.length(O,true)/34).forEach(q=>P.push(peN(SL.dab(q.x,q.y,5,Math.atan2(q.tx,-q.ty)/DEG+90,0.3),peGD,-1)));
  P.push(peR(O,peRD,0),peR(peScale(O,0.84,c),peGD,1),peR(peScale(O,0.76,c),peIV,2));
  P.push(peL(G.bez([-1,34],[-4,20],[4,6],[2,-12],10),3),...pePut(PE.rosette(8.6,lite),{x:-2,y:16,dz:3}));
  if(!lite){P.push(...pePut(PE.rosette(4.6,true),{x:6,y:0,dz:3}),...pePut(PE.rosette(3.6,true),{x:2,y:-14,dz:3}));for(const [x,y,a] of [[-9,2,-50],[9,24,60],[-10,28,-70],[8,-10,40]])P.push(peR(SL.dab(x,y,7,a,0.3),peGR,3));}
  for(const s of [-1,1])P.push(peR(SL.curl(0,45,15,s*100,s*-70,3),peGR,-1));return P;};
defMotif('peBoteh',{name:'Boteh',term:'boteh jegheh',upright:true,meaning:'A bush shaped like a drop with its tip bent over, filled with small flowers and fringed all round. It has been read as a cypress bowed by the wind, a flame, an almond, the aigrette on a turban. Woven into the shawls of Kerman and Kashmir, it travelled to Scotland and came back as paisley.',
fn(){return peFit(PE.boteh(),96);}});
defMotif('peCypress',{name:'Cypress',term:'sarv',upright:true,meaning:'The tall evergreen of Persian gardens and poetry: the upright beloved, the free soul that bears no fruit and bends to no one. On carpets and tile panels it stands between flowering trees.',
fn(){const P=[],O=G.chaikin([[2,-48],[6,-36],[11,-16],[13.4,4],[11,22],[0,31],[-11,22],[-13.4,4],[-11,-16],[-5,-36]],true,3);
  P.push(peR(peRect(-2.4,30,2.4,46),peGD,-1),peR(O,peGR,0),peL(peScale(O,0.8,[0,0]),1,'detail',true));
  for(let i=0;i<7;i++){const y=22-i*9.6,w=10.4*Math.sin(Math.PI*clamp(0.1+0.8*(1-i/7)))+1.4;P.push(peL([[-w,y-4],[0,y],[w,y-4]],1));}
  for(const s of [-1,1]){P.push(peR(SL.curl(s*3,46,22,s*62,s*-58,1.5),peGR,-1),...pePut(PE.rosette(5,true),{x:s*19,y:33,dz:1}),...pePut(PE.rosette(3.4,true),{x:s*12,y:43,dz:1}));}
  P.push(peR(peRect(-24,46,24,48),peGD,-1));return peFit(P,96);}});
/* Rose, bud, leaf, nightingale and butterfly, redrawn 2026-10-13 against four gol-o-morgh
   references supplied by the user (a grisaille page of a flowering tree with birds, a watercolour
   page with a bird and butterfly on a knotted trunk, a lacquer book cover, and a blossom spray on
   green). Nothing is traced. What the paintings share, and what the code keeps:
   - a rose is a full CUP seen from the side and a little above: big guard petals splayed behind
     and below, and inside them petals that wrap round the heart, each lapping the next, each with
     a paler turned-over rim and dark depth showing between;
   - petals and leaves are shaded with fine lines running the way the form grows;
   - leaves are broad, saw-edged and veined, one half darker than the other, in sprays of three or five;
   - the bush is a small TREE: a knotted trunk on a tuft of ground, boughs leaving it at different
     heights, twigs ending in a flower or a bud;
   - the bird is slim and long-tailed, its head lifted to the flower, its wing in lapped ranks. */
const [pePK,peDG,peBR]=[6,7,8];
const peZ=(p,z)=>Object.assign(p,{z});
// a cupped petal: a crescent about c with a pale rolled rim and shading lines rising from its base
PE.cup=(c,r,a0,span,depth,ci,z,sq=0.86)=>{const n=22,out=[],inn=[],lip=[],P=[],at=(a,rr)=>[c[0]+Math.cos(a*DEG)*rr,c[1]+Math.sin(a*DEG)*rr*sq];
  for(let i=0;i<=n;i++){const t=i/n,a=a0+span*t,e=Math.pow(Math.sin(Math.PI*t),0.7),ro=r*(1+0.03*Math.sin(t*Math.PI*5+a0)*e);out.push(at(a,ro));inn.push(at(a,r*(1-depth*e)));lip.push(at(a,ro*(1-depth*0.17*e)));}
  P.push(peR(out.concat(inn.slice().reverse()),ci,z),peN(out.concat(lip.slice().reverse()),peIV,z+0.01),peL(lip.slice(2,-2),z+0.02));
  if(ci===pePK){const mid=[];for(let i=3;i<=n-3;i++){const t=i/n,a=a0+span*t,e=Math.pow(Math.sin(Math.PI*t),0.7);mid.push(at(a,r*(1-depth*e*0.76)));}P.push(peN(mid.concat(inn.slice(3,n-2).reverse()),peRD,z+0.005));}
  for(const t of [0.24,0.36,0.47,0.56,0.67,0.78]){const a=a0+span*t,e=Math.pow(Math.sin(Math.PI*t),0.7);P.push(peL([at(a,r*(1-depth*e*0.98)),at(a+span*0.012,r*(1-depth*e*(0.5+0.2*Math.abs(t-0.5))))],z+0.02));}
  return P;};
// a guard petal: a broad fan from the heart, its edge waved and rolled
PE.guard=(c,ang,hw,len,ci,z,sq=0.86)=>{const n=24,out=[],lip=[],P=[],at=(a,rr)=>[c[0]+Math.cos(a*DEG)*rr,c[1]+Math.sin(a*DEG)*rr*sq];
  for(let i=0;i<=n;i++){const t=i/n,a=ang-hw+2*hw*t,e=Math.pow(Math.sin(Math.PI*t),0.42),rr=len*(0.5+0.5*e)*(1+0.035*Math.sin(t*Math.PI*6+ang));out.push(at(a,rr));lip.push(at(a,rr*(1-0.085*e)));}
  P.push(peR([c].concat(out),ci,z),peN(out.concat(lip.slice().reverse()),peIV,z+0.01),peL(lip.slice(2,-2),z+0.02));
  if(ci===pePK){const q=[];for(let i=3;i<=n-3;i++){const t=i/n,a=ang-hw+2*hw*t;q.push(at(a,len*(0.3+0.26*Math.pow(Math.sin(Math.PI*t),0.5))));}P.push(peN([c].concat(q),peRD,z+0.005));}
  for(const t of [0.2,0.32,0.43,0.5,0.57,0.68,0.8]){const a=ang-hw+2*hw*t;P.push(peL([at(a,len*0.34),at(a,len*(0.5+0.5*Math.pow(Math.sin(Math.PI*t),0.42))*(0.6+0.14*Math.cos(t*20)))],z+0.02));}
  return P;};
PE.rose=(r=20,turn=0)=>{const P=[],c=[0,0];
  for(const a of [62,90,118])P.push(peR(G.xform(G.petal(r*1.5,r*0.3,'pointed'),{rot:a+90+turn*0.3}),peDG,-2));
  [[-100,40,1.2],[-38,38,1.24],[-160,36,1.22],[150,40,1.34],[26,40,1.36],[90,46,1.46]].forEach(([a,hw,l],i)=>P.push(...PE.guard(c,a+turn,hw,r*l,i<3?pePK:(i<5?peRD:pePK),-1+i*0.1)));
  const m=[];for(let i=0;i<36;i++){const a=i/36*Math.PI*2;m.push([Math.cos(a)*r*0.94,Math.sin(a)*r*0.94*0.86]);}P.push(peR(m,peRD,0.5));
  for(let k=0;k<8;k++)P.push(...PE.cup(c,r*(0.98-0.105*k),turn+70+k*137.5,188-9*k,0.3,k%2?pePK:peRD,1+k*0.1));
  const sp=[];for(let i=0;i<=20;i++){const t=i/20,a=(turn+t*520)*DEG,rr=r*0.16*(1-0.8*t);sp.push([Math.cos(a)*rr,Math.sin(a)*rr*0.86]);}P.push(peL(sp,3));return P;};
// a leaflet with a saw edge, base at 0,0 and tip up: two tones about the midrib, side veins running forward
PE.leaflet=(len,wid,bend=0.1)=>{const n=20,L=[],R=[],mid=[],P=[];
  for(let i=0;i<=n;i++){const t=i/n,odd=i%2&&i<n-1,y=-len*t,x=bend*len*Math.sin(Math.PI*t),w=wid*0.5*Math.pow(Math.sin(Math.PI*Math.pow(clamp(0.03+0.97*t),0.72)),0.8)+(odd?wid*0.085:0),dy=odd?-len*0.028:0;mid.push([x,y]);L.push([x-w,y+dy]);R.push([x+w,y+dy]);}
  P.push(peR(mid.concat(L.slice().reverse()),peGR,0),peR(mid.concat(R.slice().reverse()),peDG,0),peL(mid,0.1));
  for(let k=1;k<=5;k++){const i=Math.round(k*n/6.6),j=Math.min(n-1,i+3);for(const E of [L,R])P.push(peL([mid[i],[lerp(mid[i][0],E[j][0],0.55),lerp(mid[i][1],E[j][1],0.45)],[lerp(mid[j][0],E[j][0],0.88),E[j][1]]],0.1));}
  return P;};
// a spray of three or five leaflets on a stalk, base at 0,0, growing up
PE.spray=(len=40,five=false)=>{const st=G.bez([0,0],[len*0.06,-len*0.2],[-len*0.05,-len*0.36],[0,-len*0.52],10),P=[peR(G.ribbon(st,t=>len*0.016*(1-0.5*t)),peGR,-0.2)];
  const put=(t,a,l)=>{const q=st[Math.round(t*10)];P.push(...pePut(PE.leaflet(l,l*0.56,a<0?-0.1:0.1),{x:q[0],y:q[1],rot:a}));};
  if(five){put(0.34,-66,len*0.36);put(0.38,64,len*0.36);}put(0.72,-54,len*0.42);put(0.76,52,len*0.42);put(1,3,len*0.5);return P;};
// a bud: hip, folded petals, and long sepals that clasp it and run on past the tip; base at 0,0, tip up
PE.rosebud=(len=30)=>{const P=[],k=len/30;
  P.push(peR(G.chaikin([[-3.4,-1],[-4,-5],[0,-7.4],[4,-5],[3.4,-1],[0,0.6]],true,3).map(([x,y])=>[x*k,y*k]),peDG,0));
  P.push(peR(G.chain(G.bez([-4.6,-6],[-8,-14],[-4.6,-22],[0.6,-27],12),G.bez([0.6,-27],[5.4,-21],[7.6,-13],[4.6,-6],12)).map(([x,y])=>[x*k,y*k]),pePK,1));
  P.push(peR(G.chain(G.bez([-1.6,-6.4],[-4.6,-13],[-1.6,-21],[0.6,-27],10),G.bez([0.6,-27],[3.6,-20],[4.6,-12],[2.6,-6.4],10)).map(([x,y])=>[x*k,y*k]),peRD,1.1),peL(G.bez([0.4,-8],[-0.8,-14],[0.2,-20],[0.6,-25],8).map(([x,y])=>[x*k,y*k]),1.2));
  for(const [cp,w] of [[[[-3.6,-4],[-8.6,-12],[-7,-22],[-9.6,-31]],1.9],[[[3.6,-4],[8.4,-11],[6.4,-20],[9.4,-28]],1.8],[[[0,-5],[1.4,-9],[0.4,-13],[1,-17]],1.5]])P.push(peR(G.ribbon(G.bez(cp[0],cp[1],cp[2],cp[3],14).map(([x,y])=>[x*k,y*k]),t=>k*w*Math.pow(1-t,0.7)+0.05),peGR,1.5));
  return P;};
defMotif('peRose',{name:'Rose',term:'gol',upright:true,meaning:'The hundred-petalled rose, drawn as a full cup: broad guard petals splayed behind and below, and within them petals that wrap round the heart, each with a pale rolled rim. Gol means both rose and flower. In the poetry the rose is the beloved, beautiful and indifferent, and blooms for a few days only.',
fn(){const st=G.bez([3,50],[-3,36],[5,20],[0,2],16),P=[peR(G.ribbon(st,t=>1.5-0.5*t),peBR,-3)];
  for(const [i,s] of [[3,-1],[6,1],[9,-1]])P.push(peR([[st[i][0],st[i][1]-1.2],[st[i][0]+s*3.4,st[i][1]-2.4],[st[i][0],st[i][1]+1.2]],peBR,-3));
  P.push(...pePut(PE.spray(30,false),{x:st[4][0],y:st[4][1],rot:-64,dz:-2}),...pePut(PE.spray(27,false),{x:st[8][0],y:st[8][1],rot:60,dz:-2}));
  const tw=G.bez(st[6],[10,26],[17,22],[20,15],8);P.push(peR(G.ribbon(tw,t=>0.9-0.4*t),peGR,-3),...pePut(PE.rosebud(15),{x:20,y:15,rot:22,dz:-2}));
  P.push(...pePut(PE.rose(19,-8),{y:-20}));return peFit(P,96);}});
// an open blossom seen a little from the side: five notched petals, each with its rolled rim and its
// blush, round a boss with a ring of stamens
PE.blossom=(r=18,turn=0)=>{const P=[],c=[0,0];
  for(let i=0;i<5;i++)P.push(peR(G.xform(G.petal(r*1.25,r*0.22,'pointed'),{rot:turn+36+i*72}),peDG,-2));
  [2,3,1,4,0].forEach((i,k)=>P.push(...PE.guard(c,turn-90+i*72,41,r*(i===2||i===3?1.06:0.98),pePK,-1+k*0.1,0.82)));
  P.push(peN(G.ellipse(0,0,r*0.2,r*0.17,16),peGD,3));
  for(let i=0;i<11;i++){const a=(turn+i*360/11)*DEG,e=[Math.cos(a)*r*0.4,Math.sin(a)*r*0.4*0.82];P.push(peL([[Math.cos(a)*r*0.17,Math.sin(a)*r*0.14],e],3.1),peN(G.circle(e[0],e[1],r*0.045,6),peGD,3.2));}
  return P;};
defMotif('peBlossom',{name:'Blossom',term:'shokūfeh',upright:true,meaning:'A single open blossom of the wild rose, the almond or the peach: five notched petals round a ring of stamens, on a twig with a bud beside it. It is the first flower of spring, and in the painted pages it stands on the thinner twigs where the full rose would be too heavy.',
fn(){const st=G.bez([2,50],[-3,38],[4,26],[0,12],14),P=[peR(G.ribbon(st,t=>1.2-0.4*t),peBR,-3)];
  P.push(...pePut(PE.leaflet(17,9.6,0.1),{x:st[4][0],y:st[4][1],rot:62,dz:-2.5}),...pePut(PE.leaflet(15,8.4,-0.1),{x:st[8][0],y:st[8][1],rot:-58,dz:-2.5}));
  const tw=G.bez(st[6],[-8,30],[-15,26],[-19,20],8);P.push(peR(G.ribbon(tw,t=>0.8-0.3*t),peBR,-3),...pePut(PE.rosebud(13),{x:-19,y:20,rot:-28,dz:-2}));
  P.push(...pePut(PE.blossom(23,8),{y:-14}));return peFit(P,96);}});
defMotif('peRoseLeaf',{name:'Rose leaves',term:'barg-e gol',upright:true,meaning:'A spray of rose leaves: broad, saw-edged leaflets in threes or fives on one stalk, each with its midrib and side veins, and one half painted darker than the other so that the leaf seems to turn in the light.',
fn(rng){return peFit(PE.spray(80,rng.chance(0.4)),94);}});
defMotif('peRoseBud',{name:'Rosebud',term:'ghoncheh-ye gol',upright:true,meaning:'The closed rose: folded petals in the grip of long sepals that run on past the tip. The poets make the bud the tight-lipped beloved, and the opened flower her smile.',
fn(){const st=G.bez([-4,48],[2,36],[-3,26],[0,16],10),P=[peR(G.ribbon(st,t=>1.3-0.5*t),peGR,-1),...pePut(PE.leaflet(17,9,0.1),{x:st[3][0],y:st[3][1],rot:58,dz:-1}),...pePut(PE.leaflet(14,8,-0.1),{x:st[6][0],y:st[6][1],rot:-62,dz:-1}),...pePut(PE.rosebud(46),{y:16})];return peFit(P,94);}});
defMotif('peNightingale',{name:'Nightingale',term:'bolbol',bird:true,meaning:'The small plain bird that sings all night to the rose and is wounded by its thorns: the lover, the poet, the soul. Rose and nightingale together, gol o bolbol, is the commonest subject of Persian lacquer and of the painted pages of the eighteenth and nineteenth centuries. It is drawn slim and long-tailed, head lifted and beak open toward the flower.',
fn(){const P=[];
  // body: one contour from the brow over the back, along the tail, and home under the belly and throat
  const B=G.chaikin([[-27,-21.6],[-24.6,-25.6],[-19.6,-27.6],[-14,-26.4],[-9.6,-22],[-4,-16.6],[4,-11],[12,-4.4],[19,2.6],[24,8.6],[28,14],[25,17],[19,17.4],[12,18],[4,17.6],[-4,15.6],[-11,11.6],[-17,5],[-21,-3],[-23,-10.6],[-25.6,-15.6],[-27.4,-18.4]],true,3);
  // tail: three long feathers, lapped
  [[[20,9],[30,17],[41,27],[48,37]],[[19,11],[28,20],[37,31],[42,40]],[[17,13],[24,22],[31,32],[34,40]]].forEach((cp,i)=>P.push(peR(G.ribbon(G.bez(cp[0],cp[1],cp[2],cp[3],16),t=>2.5*Math.pow(Math.sin(Math.PI*clamp(0.16+0.8*t)),0.6)),peBR,-1+i*0.1),peL(G.bez(cp[0],cp[1],cp[2],cp[3],16).slice(3,-2),-0.9+i*0.1)));
  P.push(peR(B,peIV,0));
  // back and crown washed darker, breast blushed
  P.push(peN(G.chaikin([[-26,-21],[-23,-26],[-16,-27.4],[-9.6,-22],[-2,-15],[8,-7.6],[18,2],[24,9],[15,5],[4,-3],[-6,-11],[-14,-18],[-20,-21]],true,3),peGD,0.1));
  P.push(peN(G.chaikin([[-22,-8],[-16,-5],[-11,2],[-9,9],[-14,7],[-19,0]],true,3),pePK,0.1));
  for(let i=0;i<9;i++){const x=-20+i*2.5+((i*7)%3)*0.5,y=-6+i*2.1;P.push(peL([[x,y],[x+1.9,y+1.1]],0.2),peL([[x+3.4,y+2.6],[x+5.2,y+3.5]],0.2));}
  // wing: two ranks of small coverts, then five long flight feathers lapped toward the tail
  P.push(peR(G.chaikin([[-12,-12],[-4,-15],[6,-9],[15,-1],[23,8],[30,17],[22,14],[13,11],[4,8],[-5,3],[-11,-4]],true,3),peBR,1));
  [[[2,-2],[10,3],[19,9],[31,18]],[[0,0],[8,5],[16,10],[26,16.6]],[[-2,1],[5,6],[12,10],[21,15]],[[-4,1],[2,6],[8,9],[15,12.6]],[[-6,0],[-1,5],[4,7.6],[9,10]]].forEach((cp,i)=>P.push(peR(G.ribbon(G.bez(cp[0],cp[1],cp[2],cp[3],14),t=>1.9*Math.pow(Math.sin(Math.PI*clamp(0.12+0.84*t)),0.6)),i%2?peBR:peGD,1.1+i*0.05)));
  for(const [x0,y0,n,r] of [[-9.6,-10.6,7,1.5],[-8.6,-7.6,7,1.6],[-7.6,-4.4,6,1.7]])for(let i=n-1;i>=0;i--){const x=x0+i*2.6,y=y0+i*1.9;P.push(peR(G.chaikin([[x-r,y-r*0.6],[x+r*0.7,y-r],[x+r*1.5,y+r*0.5],[x+r*0.3,y+r*1.1],[x-r*0.8,y+r*0.5]],true,2),peBR,2),peL([[x-r*0.3,y-r*0.2],[x+r*0.9,y+r*0.5]],2.1));}
  // head: open beak, eye with its stripe
  P.push(peR(G.chain(G.bez([-26.2,-22.6],[-29,-23.6],[-32,-24.6],[-34.6,-25.4],6),G.bez([-34.6,-25.4],[-32,-23.4],[-29,-21.6],[-26.4,-20.4],6)),peBR,0.5,'inner'),peR(G.chain(G.bez([-26.6,-19.8],[-29,-20],[-31,-20],[-33,-19.6],6),G.bez([-33,-19.6],[-30.6,-18.6],[-28,-17.8],[-25.6,-17.4],6)),peBR,0.4,'inner'));
  P.push(peL(G.bez([-26,-21],[-22,-23.4],[-17,-23],[-13,-20.6],8),1),peR(G.circle(-21,-21.6,1.7,14),peIV,1.1),peN(G.circle(-21.2,-21.6,0.95,10),peBL,1.2));
  // legs: thin, the toes closed on the twig
  for(const [x,d] of [[2,0],[8,-0.6]]){P.push(peL([[x,16.6],[x-1.4,22],[x-1,26]],-0.5,'inner'));for(const [dx,dy] of [[-3.6,1.4],[-1.4,2.6],[2.4,1.6]])P.push(peL(G.quad([x-1,26],[x-1+dx*0.6,26+dy*0.2],[x-1+dx,26+dy+d],6),-0.4,'inner'));}
  P.push(peR(G.ribbon(G.bez([-22,30],[-8,25.6],[12,28.6],[30,24],16),t=>1.6-0.7*t),peBR,-2),...pePut(PE.leaflet(11,6,0.1),{x:-14,y:27.6,rot:-70,dz:-2}));
  return peFit(P,94);}});
defMotif('pePapillon',{name:'Butterfly',term:'parvāneh',mirrorOk:true,meaning:'A butterfly with its wings raised, hovering beside the bush. Parvāneh is also the moth that circles the candle until it burns: with the nightingale, the second of the poets\' two lovers.',
fn(){const P=[];
  // a wing: outline as separate curves so the apex stays a point and the margin scallops; a darker band inside the margin, veins from the root, a row of spots
  const wing=(root,segs,ci,band,z,spots,sc)=>{const O=G.chain(...segs.map(q=>G.bez(q[0],q[1],q[2],q[3],12))),inner=O.map(([x,y])=>[root[0]+(x-root[0])*0.8,root[1]+(y-root[1])*0.8]);
    P.push(peR(O,band,z),peR(inner,ci,z+0.01));const n=inner.length;for(const f of [0.3,0.42,0.54,0.66,0.78]){const e=inner[Math.round(f*(n-1))];P.push(peL(G.quad(root,[lerp(root[0],e[0],0.5)+(e[1]-root[1])*0.06,lerp(root[1],e[1],0.5)-(e[0]-root[0])*0.06],e,8),z+0.02));}
    for(const f of spots){const e=O[Math.round(f*(O.length-1))];P.push(peN(G.circle(root[0]+(e[0]-root[0])*0.9,root[1]+(e[1]-root[1])*0.9,1.25,10),sc,z+0.03));}};
  const r=[0,6];
  // far forewing, a little behind
  wing([4,5],[[[4,5],[10,-8],[22,-24],[37,-33]],[[37,-33],[39,-25],[37,-17],[35,-11]],[[35,-11],[30,-6],[24,-2],[18,2]],[[18,2],[13,4],[8,5],[4,5]]],peGD,peBL,-1,[0.36,0.44,0.52],peIV);
  // near forewing: a long front edge to a pointed apex, then a scalloped outer margin
  wing(r,[[[0,6],[-6,-8],[-4,-28],[10,-44]],[[10,-44],[15,-38],[16,-33],[20,-30]],[[20,-30],[19,-24],[21,-19],[24,-15]],[[24,-15],[21,-10],[21,-5],[22,-1]],[[22,-1],[14,3],[7,5],[0,6]]],peGD,peTQ,0,[0.3,0.4,0.5,0.6,0.7],peRD);
  // near hindwing: round, scalloped, with a short tail
  wing([1,8],[[[1,8],[9,5],[18,3],[26,5]],[[26,5],[27,10],[30,12],[30,17]],[[30,17],[27,20],[27,24],[24,27]],[[24,27],[21,27],[19,31],[15,33]],[[15,33],[10,26],[5,18],[1,8]]],peGD,peTQ,0.2,[0.28,0.4,0.52,0.64],peRD);
  P.push(peR(G.ribbon(G.bez([-10,18],[-5,12],[-1,7],[3,-2],12),t=>1.5*Math.pow(Math.sin(Math.PI*clamp(0.12+0.8*t)),0.7)),peBR,2));
  for(const cp of [[[-9.6,17],[-15,11],[-18,4],[-16,-4]],[[-10,17.6],[-17,14],[-23,9],[-24,1]]]){P.push(peL(G.bez(cp[0],cp[1],cp[2],cp[3],10),2));P.push(peN(G.circle(cp[3][0],cp[3][1],0.8,8),peBR,2));}
  return peFit(P,92);}});

const peClamp=(P,L,t)=>P.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));
defBorder('peVine',{name:'Blossom vine',fn(L,t){const n=Math.max(2,2*Math.round(L/(t*1.7)/2)),w=L/n,P=[peN(peRect(0,0,L,t),peBL)],s=[];
  for(let i=0;i<=n*20;i++){const x=i/(n*20)*L;s.push([x,t/2+t*0.24*Math.sin(x/w*Math.PI)]);}P.push(peN(G.band(s,Math.max(0.9,t*0.03)),peGD));
  for(let i=0;i<n;i++){const x=(i+.5)*w,up=i%2===0,y=t/2+(up?1:-1)*t*0.24;
    P.push(...PE.rumi(i*w,t/2,t*0.3,up?40:140,up?-1:1,peGD),...PE.rumi(i*w+w*0.5,y,t*0.24,up?-120:-60,up?1:-1,peGR));
    if(i%4===1||i%4===2)P.push(...pePut(PE.rosette(t*0.24,true),{x,y:y+(up?-1:1)*t*0.2}));else P.push(...pePut(PE.palmette(t*0.6,true),{x,y:y+(up?-1:1)*t*0.04,rot:up?0:180}));}
  P.push(peL([[0,t*0.02],[L,t*0.02]],0,'outer'),peL([[0,t*0.98],[L,t*0.98]],0,'outer'));return peClamp(FL.done(P),L,t);}});
defBorder('peCartouche',{name:'Cartouches',fn(L,t){const n=Math.max(1,Math.round(L/(t*3.6))),w=L/n,P=[peN(peRect(0,0,L,t),peRD)],car=(x,hw)=>{const p=[];for(let i=0;i<=12;i++){const a=(-90+i*15)*DEG;p.push([x+hw-t*0.3+Math.cos(a)*t*0.36*(1+0.14*Math.cos(a*4)),t/2+Math.sin(a)*t*0.36]);}return p.concat(p.map(([a,b])=>[2*x-a,t-b]));};
  for(let i=0;i<n;i++){const x=(i+.5)*w,hw=w*0.3,c=car(x,hw);P.push(peR(c,peGD),peR(peScale(c,0.88,[x,t/2]),peBL));
    P.push(...PE.scroll(x-hw*0.42,t/2,t*0.25,0,1,{turns:1.3,blossom:'b'}),...PE.scroll(x+hw*0.42,t/2,t*0.25,180,-1,{turns:1.3,blossom:'b'}),...pePut(PE.rosette(t*0.13,true),{x,y:t/2}));
    const m=peLobed(t*0.3,t*0.34,8,0.18,64).map(([a,b])=>[i*w+a,t/2+b]);P.push(peR(m,peGD),peR(peScale(m,0.84,[i*w,t/2]),peIV),...pePut(PE.rosette(t*0.15,true),{x:i*w,y:t/2}));}
  P.push(peL([[0,t*0.02],[L,t*0.02]],0,'outer'),peL([[0,t*0.98],[L,t*0.98]],0,'outer'));return peClamp(P,L,t);}});
defBorder('peGuard',{name:'Guard stripe',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.5))),w=L/n,P=[peN(peRect(0,0,L,t),peIV)];
  for(let i=0;i<n;i++){const x=(i+.5)*w;P.push(peN(G.circle(x,t/2,t*0.24,12),peRD),peN(G.circle(x,t/2,t*0.1,8),peGD),peN(SL.dab(i*w+w*0.06,t*0.5,w*0.3,90,0.2),peGR),peN(SL.dab(i*w+w*0.94,t*0.5,w*0.3,270,0.2),peGR));}
  P.push(peL([[0,0],[L,0]],0,'outer'),peL([[0,t],[L,t]],0,'outer'));return peClamp(P,L,t);}});
defBorder('peMadakhil',{name:'Reciprocal trefoil',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.9))),w=L/n,P=[peN(peRect(0,0,L,t),peIV)];
  for(let i=0;i<n;i++){const x=(i+.5)*w;P.push(peN(G.chaikin([[x-w*0.5,t],[x-w*0.5,t*0.7],[x-w*0.16,t*0.62],[x-w*0.34,t*0.42],[x-w*0.2,t*0.26],[x-w*0.06,t*0.3],[x,t*0.08],[x+w*0.06,t*0.3],[x+w*0.2,t*0.26],[x+w*0.34,t*0.42],[x+w*0.16,t*0.62],[x+w*0.5,t*0.7],[x+w*0.5,t]],false,2).concat([[x+w*0.5,t],[x-w*0.5,t]]),peBL));}
  P.push(peL([[0,0],[L,0]],0,'outer'),peL([[0,t],[L,t]],0,'outer'));return peClamp(P,L,t);}});

/* ---------- pattern grounds ---------- */
defTile('peIslimi',{name:'Scroll field',term:'eslīmī · khatāʾī',meaning:'The ground of a carpet or a tiled dome: spiral stems in mirrored pairs, each winding in to a blossom, with split leaves between. However large the field, it is one small arrangement repeated and reflected.',
fn(W,H,u){const s=u*2.3,P=[peN(peRect(0,0,W,H),peRD)];
  for(let j=-1;j*s<H+s;j++)for(let i=-1;i*s<W+s;i++){const mx=((i%2)+2)%2,my=((j%2)+2)%2,cx=(i+.5)*s,cy=(j+.5)*s;
    P.push(...PE.scroll(cx,cy,s*0.47,mx?0:180,(mx?-1:1)*(my?-1:1),{turns:1.55,blossom:(mx+my)%2?'r':'p'}));
    P.push(...pePut(PE.rosette(s*0.07,true),{x:i*s,y:j*s}));if(mx)P.push(peN(G.circle(i*s,cy,s*0.02,6),peIV));}return P;}});
defTile('peBotehRows',{name:'Rows of boteh',term:'boteh · termeh',meaning:'Small boteh in staggered rows, every row leaning the other way: the all-over ground of Kerman and Yazd shawl cloth.',
fn(W,H,u){const s=u*1.25,B=PE.boteh(true),P=[peN(peRect(0,0,W,H),peBL)];for(let j=-1;j*s*1.1<H+s;j++)for(let i=-1;i*s<W+s;i++){const fl=((j%2)+2)%2===1;
    P.push(...pePut(B,{x:i*s+(fl?s/2:0),y:j*s*1.1,s:s/118,flip:fl}));P.push(peN(G.circle(i*s+(fl?0:s/2),j*s*1.1+s*0.1,s*0.035,6),peGD));}return FL.done(P);}});

/* ---------- layouts ---------- */
const peKey=(g,want,re=/./)=>{const p=[...new Set(poolAll(g.motifs.border))].filter(k=>SG.borders[k]&&re.test(k));return p.includes(want)?want:(p[0]||want);};
const peTile=(g,want)=>{const p=poolAll(g.motifs.tile).filter(k=>SG.tiles[k]);return p.includes(want)?want:(p[0]||want);};
// one border band round a rectangle, a rosette in each corner block; returns the inner rectangle
PE.frame=(ctx,r,key,t,ci=peBL)=>{const {x0,y0,x1,y1}=r,fn=(SG.borders[key]||SG.borders.lines).fn,P=[];
  const sides=[{L:x1-x0-2*t,map:([x,y])=>[x0+t+x,y0+y]},{L:y1-y0-2*t,map:([x,y])=>[x1-y,y0+t+x]},{L:x1-x0-2*t,map:([x,y])=>[x1-t-x,y1-y]},{L:y1-y0-2*t,map:([x,y])=>[x0+y,y1-t-x]}];
  for(const sd of sides)for(const p of fn(sd.L,t))P.push(p.kind==='dot'?Object.assign({},p,{x:sd.map([p.x,p.y])[0],y:sd.map([p.x,p.y])[1]}):Object.assign({},p,{pts:p.pts.map(sd.map)}));
  for(const [a,b] of [[x0,y0],[x1-t,y0],[x1-t,y1-t],[x0,y1-t]]){P.push(peN(peRect(a,b,a+t,b+t),ci));if(t>24)P.push(...pePut(PE.rosette(t*0.34,true),{x:a+t/2,y:b+t/2}));}
  P.push(peL(peRect(x0,y0,x1,y1),0,'outer',true),peL(peRect(x0+t,y0+t,x1-t,y1-t),0,'outer',true));
  ctx.items.push({type:'parts',parts:P,role:'border',variant:'band'+key+Math.round(t)});return{x0:x0+t,y0:y0+t,x1:x1-t,y1:y1-t};};
/* Medallion carpet. */
defStructure('toranj',{name:'Medallion carpet',blurb:'A carpet in plan: a lobed medallion with pendants at the centre, a quarter medallion in each corner, scrolls and blossoms over the field between, a wide border inside two guard stripes.',
fn(ctx){
  const {W,H,g,rng}=ctx,S=g.structure,cx=W/2,rw=W*0.36,F=[];let r={x0:cx-rw,y0:26,x1:cx+rw,y1:H-26};
  for(let x=r.x0+3;x<r.x1;x+=6)for(const [ya,d] of [[r.y0,-1],[r.y1,1]])F.push(peL([[x,ya],[x+rng.range(-1.5,1.5),ya+d*rng.range(10,16)]],0));ctx.parts(F,'frame');
  const kG=peKey(g,'peGuard',/Guard|Madakhil|Pearl|dotRow|lines/),kM=peKey(g,rng.chance(0.5)?'peVine':'peCartouche',/^(?!peGuard|peMadakhil)/);
  r=PE.frame(ctx,r,kG,15,peIV);r=PE.frame(ctx,r,kM,W*0.075);r=PE.frame(ctx,r,kG,15,peIV);
  const iw=r.x1-r.x0,ih=r.y1-r.y0,cy=(r.y0+r.y1)/2;
  ctx.items.push({type:'parts',parts:tileParts(peTile(g,'peIslimi'),r,iw/4/2.3*1.0,rng.fork('f'),g),role:'frame',variant:'field'});
  // corner pieces: a quarter of a lobed medallion in each corner
  const C=[];for(const [x,y] of [[r.x0,r.y0],[r.x1,r.y0],[r.x1,r.y1],[r.x0,r.y1]]){const O=peLobed(iw*0.34,iw*0.4,16,0.1).map(([a,b])=>[x+a,y+b]);C.push(peR(O,peGD),peR(peScale(O,0.92,[x,y]),peBL),...pePut(PE.rosette(iw*0.09,true),{x:x+(x===r.x0?1:-1)*iw*0.1,y:y+(y===r.y0?1:-1)*iw*0.12}));
    for(const a of [0,1,2,3,4].map(i=>i*22.5)){const sx=x===r.x0?1:-1,sy=y===r.y0?1:-1,d=[Math.cos(a*DEG)*sx,Math.sin(a*DEG)*sy];C.push(...pePut(PE.rosette(iw*0.035,true),{x:x+d[0]*iw*0.23,y:y+d[1]*iw*0.27}));}}
  ctx.items.push({type:'parts',parts:clipPartsRect(C,r),role:'ring',variant:'corners'});
  const hero=ctx.pick('hero'),M=SG.motifs[hero]||{},ms=Math.min(iw*0.74,ih*0.46);
  if(hero!=='peToranj'&&hero!=='peShamsa'){const O=peLobed(ms*0.4,ms*0.47,16,0.1).map(([a,b])=>[cx+a,cy+b]);ctx.parts([peR(O,peGD),peR(peScale(O,0.92,[cx,cy]),peBL)],'frame');ctx.motif(hero,cx,cy,ms*0.62,{role:'hero',variant:'hero'});}
  else ctx.motif(hero,cx,cy,hero==='peToranj'?ms*1.3:ms*0.9,{role:'hero',variant:'hero'});
}});
/* Illuminated page: a sunburst with its rays, corner pieces, a ruled and gilded frame. */
defStructure('shamsa',{name:'Illuminated page',blurb:'The opening page of a manuscript: a sunburst medallion with fine rays at the centre, a pendant above and below, corner pieces filled with scrolls, inside ruled gold margins.',
fn(ctx){
  const {W,H,g,rng}=ctx,cx=W/2,pw=W*0.35;let r={x0:cx-pw,y0:40,x1:cx+pw,y1:H-40};
  ctx.parts([{kind:'region',closed:true,role:'outer',bg:true,plain:true,pts:peRect(r.x0-26,r.y0-22,r.x1+26,r.y1+22)},peL(peRect(r.x0-26,r.y0-22,r.x1+26,r.y1+22),0,'outer',true)],'frame');
  r=PE.frame(ctx,r,peKey(g,'peGuard',/Guard|Madakhil|lines|dotRow/),13,peGD);r=PE.frame(ctx,r,peKey(g,'peCartouche',/^(?!peGuard|peMadakhil)/),W*0.06);
  const iw=r.x1-r.x0,ih=r.y1-r.y0,cy=(r.y0+r.y1)/2,P=[];
  // corner pieces
  const t=iw*0.36;for(const [x,y,sx,sy] of [[r.x0,r.y0,1,1],[r.x1,r.y0,-1,1],[r.x1,r.y1,-1,-1],[r.x0,r.y1,1,-1]]){const tri=[[x,y],[x+sx*t,y],[x,y+sy*t]],box={x0:Math.min(x,x+sx*t),y0:Math.min(y,y+sy*t),x1:Math.max(x,x+sx*t),y1:Math.max(y,y+sy*t)};
    P.push(...GH.clipConvex([peN(peRect(box.x0,box.y0,box.x1,box.y1),peBL)].concat(tileParts(peTile(g,'peIslimi'),box,t/2/2.3,rng.fork('c'),g).slice(1)),tri),peL([[x+sx*t,y],[x,y+sy*t]],0,'outer'),peL([[x+sx*t*0.93,y],[x,y+sy*t*0.93]],0,'inner'));}
  // rays
  const R=iw*0.33;for(let i=0;i<64;i++){const d=slDir(i*5.625),l=i%4===0?1.42:i%2===0?1.3:1.2;P.push(peL([[cx+d[0]*R*1.02,cy+d[1]*R*1.02],[cx+d[0]*R*l,cy+d[1]*R*l]],0));if(i%4===0)P.push(peN(G.xform(G.petal(R*0.07,R*0.016,'pointed'),{x:cx+d[0]*R*l,y:cy+d[1]*R*l,rot:i*5.625}),peBL));}
  ctx.items.push({type:'parts',parts:P,role:'ring',variant:'page'});
  const hero=ctx.pick('hero'),ring=ctx.pick('ring');ctx.motif(hero,cx,cy,R*2,{role:'hero',variant:'hero'});
  for(const s of [-1,1])ctx.motif(ring,cx,cy+s*(R*1.42+ih*0.085),ih*0.11,{role:'ring',variant:'pend',rot:s>0?180:0});
}});
/* Shawl cloth: rows of boteh inside a border. */
defStructure('termeh',{name:'Shawl cloth',blurb:'A woven shawl: staggered rows of small boteh over the whole field, a blossom border round it, one large boteh in each corner.',
fn(ctx){
  const {W,H,g,rng}=ctx,S=g.structure;let r={x0:34,y0:34,x1:W-34,y1:H-34};
  r=PE.frame(ctx,r,peKey(g,'peGuard',/Guard|Madakhil|lines|dotRow/),14,peIV);r=PE.frame(ctx,r,peKey(g,'peVine',/^(?!peGuard|peMadakhil)/),W*0.07);
  ctx.items.push({type:'parts',parts:tileParts(peTile(g,'peBotehRows'),r,lerp(120,84,clamp(S.density)),rng.fork('b'),g),role:'frame',variant:'field'});
}});
/* Rose and nightingale: a flowering branch across the page, the bird upon it. */
defStructure('golomorgh',{name:'Rose and nightingale',blurb:'A rose bush growing across the page from one lower corner: a knotted trunk leaning as it rises, boughs of unequal length ending in full roses, open blossoms and buds, sprays of saw-edged leaves, a nightingale on a branch with its head lifted to the largest flower, a butterfly in the open space, and a tuft of ground at the foot.',
fn(ctx){
  const {W,H,g,rng}=ctx;let r={x0:60,y0:40,x1:W-60,y1:H-40};
  ctx.parts([{kind:'region',closed:true,role:'outer',bg:true,plain:true,pts:peRect(r.x0-20,r.y0-20,r.x1+20,r.y1+20)}],'frame');
  r=PE.frame(ctx,r,peKey(g,'peGuard',/Guard|Madakhil|lines|dotRow/),12,peGD);r=PE.frame(ctx,r,peKey(g,'peVine',/^(?!peGuard|peMadakhil)/),W*0.05);r=PE.frame(ctx,r,'lines',8,peGD);
  const w=r.x1-r.x0,h=r.y1-r.y0,fl=rng.chance(0.5),X=u=>r.x0+(fl?1-u:u)*w,Y=v=>r.y0+v*h,sg=fl?-1:1,P=[];
  const hero=ctx.pick('hero'),rk=[...new Set(poolAll(g.motifs.ring))].filter(k=>SG.motifs[k]&&k!=='dot'),bird=rk.find(k=>SG.motifs[k].bird||SG.motifs[k].figure)||rk[0]||'bird',fly=rk.find(k=>/apillon|utterfly/.test(k)),rest=rk.filter(k=>k!==bird&&k!==fly),bud=rest[0]||hero,blo=rest[1]||bud,fil=ctx.pick('filler'),leaf=fil==='dot'?'leaf':fil;
  const at=(sp,t)=>{const i=Math.round(clamp(t)*(sp.length-1)),a=sp[Math.max(0,i-1)],b=sp[Math.min(sp.length-1,i+1)],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return{p:sp[i],d:[(b[0]-a[0])/l,(b[1]-a[1])/l]};};
  /* The plan, from the four reference pages: the bush is not a tree with a round head. It enters at
     one lower corner and leans across the page; the largest flower is high and off centre; the
     boughs are of unequal length and leave the trunk at different heights; one side is left open,
     and the butterfly goes there; the bird sits near the middle, looking up at the great rose. */
  const tr=G.resample(G.chaikin([[0.3,0.94],[0.34,0.81],[0.27,0.68],[0.36,0.56],[0.46,0.46],[0.47,0.36],[0.42,0.28]].map(([u,v])=>[X(u),Y(v)]),false,3),false,5),nt=tr.length;
  // the trunk is knotted: it swells into a burl at three places and is thick only near the ground
  const burl=t=>0.42*Math.exp(-Math.pow((t-0.13)/0.05,2))+0.34*Math.exp(-Math.pow((t-0.33)/0.045,2))+0.26*Math.exp(-Math.pow((t-0.55)/0.04,2)),tw=t=>w*(0.02*Math.pow(1-t,1.15)*(1+burl(t))+0.0055);
  P.push(peR(G.ribbon(tr,tw),peBR,1));
  for(const f of [-0.55,0.05,0.5])P.push(peL(tr.slice(1,Math.round(nt*(0.46+0.2*f))).map((q,i)=>{const o=at(tr,(i+1)/nt),k=tw((i+1)/nt)*f;return[q[0]-o.d[1]*k,q[1]+o.d[0]*k];}),1.1));
  // a hollow in each burl, and the stub of a cut branch beside it
  for(const [t,s] of [[0.13,1],[0.33,-1],[0.55,1]]){const o=at(tr,t),k=tw(t),c=[o.p[0]-o.d[1]*k*0.3*s,o.p[1]+o.d[0]*k*0.3*s],a=Math.atan2(o.d[1],o.d[0])/DEG;
    P.push(peL(G.ellipse(c[0],c[1],k*0.3,k*0.5,14,a+90),1.2,'detail',true),peN(G.ellipse(c[0],c[1],k*0.14,k*0.27,10,a+90),peDG,1.15),peR(G.xform([[-k*0.42,0],[-k*0.1,-k*1.2],[k*0.34,-k*1.1],[k*0.42,0]],{x:o.p[0]-o.d[1]*k*0.86*s,y:o.p[1]+o.d[0]*k*0.86*s,rot:a+90+s*62}),peBR,0.9));}
  // boughs: [where it leaves the trunk, end, bulge, what it carries, size]
  const BR=[[0.5,[0.74,0.44],-0.24,hero,0.3],[0.3,[0.19,0.5],0.2,hero,0.26],[0.62,[0.72,0.69],0.22,blo,0.17],[0.82,[0.7,0.15],0.18,bud,0.14],[0.92,[0.15,0.2],-0.2,blo,0.16]],sp=[];
  BR.forEach(([t,e,bulge],i)=>{const o=at(tr,t),E=[X(e[0]),Y(e[1])],d=Math.hypot(E[0]-o.p[0],E[1]-o.p[1]),nx=-(E[1]-o.p[1])/d,ny=(E[0]-o.p[0])/d,c1=[o.p[0]+o.d[0]*d*0.3,o.p[1]+o.d[1]*d*0.3],c2=[lerp(o.p[0],E[0],0.68)+nx*bulge*d*sg,lerp(o.p[1],E[1],0.68)+ny*bulge*d*sg];
    sp[i]=G.bez(o.p,c1,c2,E,26);P.push(peR(G.ribbon(sp[i],u=>tw(t)*0.6*(1-0.72*u)+w*0.003),peBR,0.5));});
  // twigs off the boughs, and a second thin stem from the root
  const TW=[[0,0.5,[0.87,0.6],bud,0.13],[1,0.55,[0.11,0.34],bud,0.13],[2,0.5,[0.84,0.8],bud,0.11]];
  TW.forEach(([bi,t,e],i)=>{const o=at(sp[bi],t),E=[X(e[0]),Y(e[1])];sp[5+i]=G.bez(o.p,[o.p[0]+o.d[0]*w*0.06,o.p[1]+o.d[1]*w*0.06],[lerp(o.p[0],E[0],0.6),lerp(o.p[1],E[1],0.4)],E,16);P.push(peR(G.ribbon(sp[5+i],u=>w*(0.006-0.003*u)),peBR,0.4));});
  const st2=G.bez([X(0.31),Y(0.93)],[X(0.25),Y(0.86)],[X(0.2),Y(0.82)],[X(0.13),Y(0.74)],18);P.push(peR(G.ribbon(st2,u=>w*(0.008-0.004*u)),peBR,0.6));
  // short side twigs with a red tip, as on a bush coming into bud
  [[0,0.3,1],[0,0.78,-1],[1,0.4,-1],[2,0.3,1],[3,0.5,-1],[4,0.5,1],[2,0.8,-1]].forEach(([bi,t,sd])=>{const o=at(sp[bi],t),d=[o.d[0]*0.6-o.d[1]*sd*0.8,o.d[1]*0.6+o.d[0]*sd*0.8],l=w*0.045,e=[o.p[0]+d[0]*l,o.p[1]+d[1]*l];
    P.push(peR(G.ribbon([o.p,[o.p[0]+d[0]*l*0.5-d[1]*l*0.08,o.p[1]+d[1]*l*0.5+d[0]*l*0.08],e],u=>w*(0.0035-0.002*u)),peBR,0.3),peN(G.xform(G.teardrop(w*0.006,w*0.014,8),{x:e[0],y:e[1],rot:Math.atan2(d[0],-d[1])/DEG+180}),peRD,0.35));});
  // the tuft of ground, with grass
  const gx=X(0.34),gy=Y(0.945);P.push(peN(G.chaikin([[-0.3,0.02],[-0.2,-0.012],[-0.06,-0.026],[0.08,-0.02],[0.22,-0.01],[0.32,0.02],[0.1,0.034],[-0.12,0.034]].map(([a,b])=>[gx+a*w*sg,gy+b*h]),true,3),peGR,0));
  for(let i=0;i<22;i++){const x=gx+(i/21-0.5)*w*0.56,l=h*(0.022+0.02*((i*7)%5)/4),lean=((i*5)%7-3)*0.12;P.push(peR(G.ribbon(G.quad([x,gy+h*0.012],[x+lean*l*0.3,gy-l*0.6],[x+lean*l,gy-l],8),t=>w*0.004*(1-t)+0.2),i%2?peDG:peGR,0.2));}
  ctx.items.push({type:'parts',parts:FL.done(P),role:'ring',variant:'tree'});
  // place a motif whose own stalk is at the foot, so that the stalk continues the line it grows from
  const grow=(key,q,d,size,o)=>{const a=Math.atan2(d[0],-d[1])/DEG;ctx.motif(key,q[0]+d[0]*size*0.4,q[1]+d[1]*size*0.4,size,Object.assign({rot:a},o));};
  // leaf sprays along the boughs, alternately to either side, no two the same size
  let li=0;const sprays=(s,ts,size)=>ts.forEach(t=>{const o=at(s,t),sd=(li++%2?1:-1),d=[o.d[0]*0.5-o.d[1]*sd*0.86,o.d[1]*0.5+o.d[0]*sd*0.86];grow(leaf,o.p,d,size*rng.range(0.82,1.16),{role:'filler',variant:'leaf'+(li%2),noOcc:true});});
  sprays(tr,[0.42,0.7,0.88],w*0.19);sprays(sp[0],[0.34,0.62,0.9],w*0.19);sprays(sp[1],[0.4,0.7,0.93],w*0.18);sprays(sp[2],[0.36,0.84],w*0.15);sprays(sp[3],[0.55,0.86],w*0.14);sprays(sp[4],[0.5,0.84],w*0.14);sprays(sp[5],[0.6],w*0.12);sprays(sp[6],[0.6],w*0.12);sprays(st2,[0.55],w*0.13);
  // flowers on the ends: the great rose on the trunk, then each bough and twig
  const top=at(tr,1);grow(hero,top.p,top.d,w*0.38,{role:'hero',variant:'hero',noOcc:true});
  BR.forEach(([t,e,b,k,s],i)=>{const o=at(sp[i],1);grow(k,o.p,o.d,w*s,{role:k===hero?'hero':'ring',variant:k===hero?'hero':'bud',noOcc:true});});
  TW.forEach(([bi,t,e,k,s],i)=>{const o=at(sp[5+i],1);grow(k,o.p,o.d,w*s,{role:'ring',variant:'bud',noOcc:true});});
  {const o=at(st2,1);grow(blo,o.p,o.d,w*0.15,{role:'ring',variant:'bud',noOcc:true});}
  // the bird on the low bough, looking up at the great rose; a butterfly in the open corner; two herbs at the foot
  const bp=at(sp[2],0.52);ctx.motif(bird,bp.p[0],bp.p[1]-w*0.1,w*0.3,{role:'ring',variant:'bird',flip:fl,noOcc:true});
  if(fly)ctx.motif(fly,X(0.86),Y(0.27),w*0.14,{role:'ring',variant:'fly',flip:!fl,rot:sg*12,noOcc:true});
  for(const [u,s] of [[0.14,1],[0.56,-1]]){const x=X(u),y=gy,st=G.bez([x,y],[x+s*sg*w*0.02,y-h*0.03],[x-s*sg*w*0.03,y-h*0.06],[x+s*sg*w*0.01,y-h*0.085],10);
    ctx.items.push({type:'parts',parts:[peR(G.ribbon(st,t=>w*0.0035),peGR,0),...pePut(PE.leaflet(h*0.04,h*0.016,0.2*s),{x:st[3][0],y:st[3][1],rot:s*sg*50}),...pePut(PE.rosette(w*0.024,true),{x:st[10][0],y:st[10][1],dz:1})],role:'filler',variant:'herb'});}
}});
