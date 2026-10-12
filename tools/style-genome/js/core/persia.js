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
PE.rose=(r=20)=>{const P=[];for(let i=0;i<7;i++)P.push(peR(SL.petal(0,0,i*360/7,r*1.16,0.4),peIV,-1));for(let i=0;i<5;i++)P.push(peR(SL.petal(0,0,i*72+10,r,0.42),peRD,0));for(let i=0;i<5;i++)P.push(peR(SL.petal(0,0,i*72+46,r*0.76,0.44),peIV,1),peL(SL.petal(0,0,i*72+46,r*0.5,0.36).slice(2,9),1.5));
  for(let i=0;i<3;i++)P.push(peR(SL.petal(0,0,i*120+20,r*0.46,0.46),peRD,2));const sp=[];for(let i=0;i<=22;i++){const t=i/22,a=t*640*DEG,rr=r*0.24*(1-0.8*t);sp.push([Math.cos(a)*rr,Math.sin(a)*rr]);}P.push(peL(sp,3));return P;};
defMotif('peRose',{name:'Rose',term:'gol',upright:true,meaning:'The hundred-petalled rose on its stem with a bud and leaves. Gol means both rose and flower. In the poetry the rose is the beloved, beautiful and indifferent, and blooms for a few days only.',
fn(){const P=[peR(G.band(G.bez([4,48],[-6,28],[8,6],[0,-14],14),2.2),peGR,-2),peR(SL.curl(1,22,26,-58,-40,1.5),peGR,-2)];
  for(const [x,y,a] of [[2,30,74],[0,18,-110],[5,38,118]])P.push(...pePut(PE.saz([[0,0],[4,-9],[3,-20]],4.6),{x,y,rot:a,dz:-1}));
  const e=SL.end(1,22,26,-58,-40);for(const [a,ci] of [[-20,peRD],[20,peRD],[0,peIV]])P.push(peR(G.xform(G.petal(13,3.4,'pointed'),{x:e[0],y:e[1],rot:e[2]+a}),ci,a?0:1));
  for(const a of [100,170,240])P.push(peR(SL.dab(0,-12,11,a,0.24),peGR,-0.5));P.push(...pePut(PE.rose(21),{y:-22}));return peFit(P,96);}});
defMotif('peNightingale',{name:'Nightingale',term:'bolbol',figure:true,mirrorOk:true,meaning:'The small brown bird that sings all night to the rose and is wounded by its thorns: the lover, the poet, the soul. Rose and nightingale together, gol o bolbol, is the commonest subject of Persian lacquer and of the painted pages of the eighteenth and nineteenth centuries.',
fn(){const P=[];
  P.push(peR(G.band(G.bez([-40,30],[-14,22],[14,26],[42,18],12),2.4),peGR,-2));for(const [x,y,a] of [[-26,26,-40],[20,23,30],[34,20,-150]])P.push(peR(SL.dab(x,y,10,a,0.28),peGR,-2));
  P.push(peR(G.chaikin([[4,2],[20,10],[40,26],[44,34],[36,33],[16,20]],true,2),peBL,-1));
  P.push(peR(G.chaikin([[-19,-10],[-9,-18],[6,-13],[17,-2],[19,9],[9,17],[-5,17],[-15,9],[-20,0]],true,3),peGD,0),peR(G.circle(-17,-15,8,24),peGD,0.2));
  P.push(peR(G.chaikin([[-22,-6],[-12,-3],[-8,6],[-13,13],[-20,6]],true,2),peRD,0.5),peR([[-24,-17.4],[-34,-18.6],[-24.4,-14.6]],peBL,0.4),peR([[-24.4,-14.4],[-32,-12],[-23.6,-12.4]],peBL,0.4));
  P.push(peR(G.chaikin([[-6,-9],[8,-7],[20,6],[24,16],[10,11],[-2,4]],true,2),peBL,1),peL(G.bez([-2,-4],[8,-1],[14,6],[19,12],8),2),peL(G.bez([-3,0],[4,3],[9,7],[13,11],8),2));
  P.push(peR(G.circle(-19.6,-16.6,1.9,12),peIV,1),peN(G.circle(-19.8,-16.6,0.9,8),peBL,2));
  for(const x of [-2,6]){P.push(peL([[x,16],[x-1,24]],1,'inner'));for(const d of [-3,0,3])P.push(peL([[x-1,24],[x-1+d,26.6]],1));}return peFit(P,94);}});

/* ---------- borders ---------- (y = 0 is the outer edge) */
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
defStructure('golomorgh',{name:'Rose and nightingale',blurb:'A single rose bush crossing the page from the foot: full blossoms, buds and saw-edged leaves on bending stems, and a nightingale perched among them.',
fn(ctx){
  const {W,H,g,rng}=ctx;let r={x0:60,y0:40,x1:W-60,y1:H-40};
  ctx.parts([{kind:'region',closed:true,role:'outer',bg:true,plain:true,pts:peRect(r.x0-20,r.y0-20,r.x1+20,r.y1+20)}],'frame');
  r=PE.frame(ctx,r,peKey(g,'peGuard',/Guard|Madakhil|lines|dotRow/),12,peGD);r=PE.frame(ctx,r,peKey(g,'peVine',/^(?!peGuard|peMadakhil)/),W*0.05);r=PE.frame(ctx,r,'lines',8,peGD);
  const w=r.x1-r.x0,h=r.y1-r.y0,X=u=>r.x0+u*w,Y=v=>r.y0+v*h,fl=rng.chance(0.5),U=u=>fl?1-u:u,base=[X(U(0.3)),Y(0.98)],P=[];
  const hero=ctx.pick('hero'),rk=[...new Set(poolAll(g.motifs.ring))].filter(k=>SG.motifs[k]&&k!=='dot'),bird=rk.find(k=>SG.motifs[k].figure)||rk[0]||'bird',bud=rk.find(k=>k!==bird)||hero,fil=ctx.pick('filler'),leaf=fil==='dot'?'leaf':fil;
  const T=[[0.56,0.2,0.4,hero],[0.26,0.42,0.34,hero],[0.74,0.52,0.32,hero],[0.82,0.2,0.15,bud],[0.2,0.16,0.15,bud],[0.86,0.76,0.14,bud],[0.14,0.66,0.13,bud]];
  for(const [u,v] of T){const e=[X(U(u)),Y(v)],m=[lerp(base[0],e[0],0.15)+(e[0]-base[0])*0.1,lerp(base[1],e[1],0.7)];P.push(peR(G.ribbon(G.resample(G.quad(base,m,e,18),false,6),t=>4.4*(1-0.62*t)),peGR,0));}
  const bp=[X(U(0.5)),Y(0.66)];P.push(peR(G.ribbon(G.resample(G.quad(base,[lerp(base[0],bp[0],0.2),lerp(base[1],bp[1],0.6)],[bp[0]+(fl?-1:1)*w*0.12,bp[1]+h*0.03],16),false,6),t=>4*(1-0.6*t)),peGR,0));
  ctx.items.push({type:'parts',parts:P,role:'ring',variant:'stems'});
  [[0.4,0.3,-20],[0.66,0.34,40],[0.4,0.54,-70],[0.62,0.7,70],[0.2,0.8,-96],[0.3,0.28,-50],[0.7,0.1,20],[0.5,0.84,100],[0.84,0.4,60]].forEach(([u,v,a],i)=>ctx.motif(leaf,X(U(u)),Y(v),w*0.2,{role:'filler',variant:'leaf'+(i%2),rot:fl?-a:a,flip:fl!==(a>0)}));
  for(const [u,v,s,k] of T)ctx.motif(k,X(U(u)),Y(v),w*s,{role:k===hero?'hero':'ring',variant:k===hero?'hero':'bud',flip:fl!==(u>0.5)});
  ctx.motif(bird,bp[0],bp[1]-w*0.075,w*0.27,{role:'ring',variant:'bird',flip:!fl});
}});
