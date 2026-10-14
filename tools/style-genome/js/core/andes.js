'use strict';
/* Andes — four ways of working on the grid of the loom, and one drawn on the desert.

   TOCAPU (Inca). Small square designs, each a compact abstract sign, set edge to edge in
   rows on the finest tunics. Their meaning is not known. A design is built on a grid of
   a few threads each way: bars, steps, nested squares, the diagonal "key".

   EMBROIDERED MANTLES (Paracas). One figure repeated across a dark cloth in rows, turned
   and recoloured as it goes: the same outline in four or five colourways, arranged so
   that each colourway runs in a diagonal.

   INTERLOCKING REPEATS (Chimú, Chancay). Stepped waves, birds and fish drawn so that the
   gap between two figures is itself a figure in the other colour.

   GEOGLYPHS (Nazca). Figures hundreds of metres long made by clearing dark stones from
   pale ground: each is a single path that never crosses itself, and can be walked from
   one end to the other.

   Woven parts are solid colour by position (`ci`, `ns`). An item may carry `ciShift`,
   which rotates those positions and gives a colourway. */

const AN={};
const anR=(x0,y0,x1,y1,ci)=>({kind:'region',closed:true,role:'detail',plain:true,ns:true,ci,pts:[[x0,y0],[x1,y0],[x1,y1],[x0,y1]]});
const anP=(pts,ci)=>({kind:'region',closed:true,role:'detail',plain:true,ns:true,ci,pts});
const anL=(pts,role='outer',closed=false)=>({kind:'line',role,closed,pts});
const anSteps=(n)=>{const p=[[0,1]];for(let i=0;i<n;i++)p.push([i/n,1-(i+1)/n],[(i+1)/n,1-(i+1)/n]);p.push([1,1]);return p;}; // stepped triangle, unit square

/* ---------- tocapu units: each returns parts in the unit square; c = [field, figure, accent] ---------- */
AN.UNITS={
  key(c){return[anR(0,0,1,1,c[0]),anP([[0,0.72],[0.72,0],[1,0],[1,0.28],[0.28,1],[0,1]],c[1]),anR(0.08,0.08,0.3,0.3,c[2]),anR(0.7,0.7,0.92,0.92,c[2])];},
  nested(c){return[anR(0,0,1,1,c[0]),anR(0.14,0.14,0.86,0.86,c[1]),anR(0.28,0.28,0.72,0.72,c[0]),anR(0.41,0.41,0.59,0.59,c[2])];},
  cross(c){
    return[anR(0,0,1,1,c[0]),anR(0.1,0.38,0.9,0.62,c[1]),anR(0.38,0.1,0.62,0.9,c[1]),anR(0.24,0.24,0.76,0.76,c[1]),anR(0.4,0.4,0.6,0.6,c[2])];},
  quarters(c){return[anR(0,0,1,1,c[0]),anR(0,0,0.5,0.5,c[1]),anR(0.5,0.5,1,1,c[1]),anR(0.16,0.16,0.34,0.34,c[2]),anR(0.66,0.66,0.84,0.84,c[2]),anR(0.66,0.16,0.84,0.34,c[1]),anR(0.16,0.66,0.34,0.84,c[1])];},
  stair(c){return[anR(0,0,1,1,c[0]),anP(anSteps(4),c[1]),anR(0.1,0.1,0.32,0.32,c[2])];},
  bars(c){const P=[anR(0,0,1,1,c[0])];for(let i=0;i<3;i++)P.push(anR(0.1,0.12+i*0.29,0.9,0.3+i*0.29,i===1?c[2]:c[1]));return P;},
  diamond(c){return[anR(0,0,1,1,c[0]),anP([[0.5,0.06],[0.94,0.5],[0.5,0.94],[0.06,0.5]],c[1]),anP([[0.5,0.3],[0.7,0.5],[0.5,0.7],[0.3,0.5]],c[2])];},
  zed(c){return[anR(0,0,1,1,c[0]),anP([[0.1,0.1],[0.9,0.1],[0.9,0.32],[0.46,0.32],[0.46,0.68],[0.9,0.68],[0.9,0.9],[0.1,0.9],[0.1,0.68],[0.24,0.68],[0.24,0.32],[0.1,0.32]],c[1]),anR(0.6,0.44,0.76,0.56,c[2])];},
  four(c){const P=[anR(0,0,1,1,c[0])];for(const [x,y] of [[0.1,0.1],[0.56,0.1],[0.1,0.56],[0.56,0.56]])P.push(anR(x,y,x+0.34,y+0.34,c[1]),anR(x+0.11,y+0.11,x+0.23,y+0.23,c[2]));return P;},
  wave(c){return[anR(0,0,1,1,c[0]),anP([[0,1],[0,0.62],[0.2,0.62],[0.2,0.42],[0.4,0.42],[0.4,0.2],[0.82,0.2],[0.82,0.58],[0.6,0.58],[0.6,0.42],[0.6,0.8],[1,0.8],[1,1]],c[1])];}
};
AN.UKEYS=Object.keys(AN.UNITS);
AN.SCHEMES=[[0,1,2],[2,0,1],[1,2,0],[3,1,0],[0,2,3],[2,1,3],[1,0,2],[4,1,0]];
AN.place=(parts,x,y,s,m=0.035)=>parts.map(p=>Object.assign({},p,{pts:p.pts.map(([a,b])=>[x+s*(m+a*(1-2*m)),y+s*(m+b*(1-2*m))])}));
defTile('tocapu',{name:'Tocapu squares',term:'tocapu · t’oqapu',meaning:'A field of small square signs, each different from its neighbours, as on the finest Inca tunics. They may have named rank, lineage, places or offices; no one today can read them. The designs here are built from the same grid but are not copies of known tocapu.',
fn(W,H,u,rng){const R=rng||makeRng(5),s=u*1.05,P=[],keys=R.shuffle(AN.UKEYS),o=R.int(0,7);
  for(let j=0;j*s<H;j++)for(let i=0;i*s<W;i++){const k=keys[(i*3+j*5+((i*j)%3))%keys.length];P.push(...AN.place(AN.UNITS[k](AN.SCHEMES[(i+j*3+o)%AN.SCHEMES.length]),i*s,j*s,s));}return P;}});
defTile('incaKey',{name:'Inca key',term:'—',meaning:'One tocapu repeated over a whole tunic, its colours exchanged from square to square: a diagonal bar between two small squares. The best known of all Inca designs.',
fn(W,H,u){const s=u*1.05,P=[];for(let j=0;j*s<H;j++)for(let i=0;i*s<W;i++){const pr=AN.UNITS.key((i+j)%2?[0,1,0]:[1,0,1]);P.push(...AN.place((i+j)%2?pr:pr.map(p=>Object.assign({},p,{pts:p.pts.map(([a,b])=>[1-a,b])})),i*s,j*s,s,0.02));}return P;}});
defTile('incaChecker',{name:'Chequerboard',term:'qollqapata',meaning:'Plain black and white squares: the body of the tunic worn by Inca soldiers, under a red stepped yoke.',
fn(W,H,u){const s=u*0.95,P=[];for(let j=0;j*s<H;j++)for(let i=0;i*s<W;i++)if((i+j)%2===0)P.push(anR(i*s,j*s,i*s+s,j*s+s,2));return P;}});
// interlocking stepped wave: the space between two crests is a crest in the other colour
defTile('stepWave',{name:'Stepped wave',term:'—',meaning:'A stair that turns over into a hook, repeated so that light and dark interlock exactly: mountain and water, or wave and shore. One of the oldest and most widespread designs of the Andes.',
fn(W,H,u){const s=u*1.5,g=s/6,P=[];const unit=[[0,6],[0,4],[1,4],[1,3],[2,3],[2,2],[3,2],[3,0],[6,0],[6,3],[5,3],[5,1],[4,1],[4,2],[4,6]];
  for(let j=-1;j*s<H+s;j++)for(let i=-1;i*s<W+s;i++)P.push(anP(unit.map(([x,y])=>[i*s+(j%2?s/2:0)+x*g,j*s+y*g]),(j%2+2)%2?1:0));return P;}});
defTile('birdRows',{name:'Rows of birds',term:'—',meaning:'Small seabirds in profile, row on row, each row facing the other way and taking the next colour: the pattern of coastal cloth, where the guano birds were wealth.',
fn(W,H,u){const s=u*1.25,P=[];for(let j=0;j*s*0.8<H+s;j++)for(let i=-1;i*s<W+s;i++){const x=i*s+(j%2?s/2:0),y=j*s*0.8;P.push(...AN.place(AN.bird([(i+j)%4,(i+j+1)%4,2]).map(p=>j%2?Object.assign({},p,{pts:p.pts.map(([a,b])=>[1-a,b])}):p),x,y,s*0.92,0));}return P;}});
AN.bird=c=>[anP([[0.1,0.62],[0.3,0.62],[0.3,0.42],[0.5,0.42],[0.5,0.2],[0.74,0.2],[0.74,0.3],[0.95,0.3],[0.95,0.38],[0.74,0.38],[0.74,0.5],[0.62,0.5],[0.62,0.72],[0.5,0.72],[0.5,0.9],[0.42,0.9],[0.42,0.72],[0.34,0.72],[0.34,0.9],[0.26,0.9],[0.26,0.72],[0.1,0.72]],c[0]),anR(0.58,0.26,0.66,0.34,c[2]),anR(0.5,0.08,0.58,0.2,c[1]),anR(0.62,0.08,0.7,0.2,c[1])];

/* ---------- motifs ---------- */
const anFit=(P,s=92)=>fitParts(P.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[(x-0.5)*100,(y-0.5)*100])})),s);
defMotif('chakana',{name:'Stepped cross',term:'chakana',meaning:'A cross with stepped arms and a hole at the centre: three steps for the three worlds, the hole for Cusco, the navel. Its form is ancient — it is cut into the stones of Tiwanaku — though the name and much of the reading are modern.',
fn(){const P=[];for(const [h,w] of [[0.5,0.17],[0.34,0.34],[0.17,0.5]])P.push(anR(0.5-w,0.5-h,0.5+w,0.5+h,0));P.push({kind:'region',closed:true,role:'inner',bg:true,ns:true,plain:true,pts:G.circle(0.5,0.5,0.1,32)});
  return anFit(P.concat([anL(G.circle(0.5,0.5,0.1,32),'inner',true)]),90);}});
defMotif('tocapuUnit',{name:'Tocapu',term:'tocapu',meaning:'One woven sign in its square frame. Rows of them ring the waist of an Inca noble’s tunic, and a few tunics are covered in them entirely.',
fn(rng){const k=rng.pick(AN.UKEYS);return anFit(AN.UNITS[k](rng.pick(AN.SCHEMES)).concat([anL([[0,0],[1,0],[1,1],[0,1]],'outer',true)]),84);}});
// embroidered creatures, built on the thread grid. Each main shape is stitched as nested
// bands of colour following its outline, the way the "linear" Paracas embroideries are.
const anNest=(pts,cis,d=0.022)=>{const P=[anP(pts,cis[0])];let q=pts;for(let k=1;k<cis.length;k++){q=GH.inset(q,d);if(!q)break;P.push(anP(q,cis[k]));}return P;};
/* Cat and condor, redrawn 2026-10-13 against references supplied by the user: a Paracas
   embroidered flying cat with its line drawing, a painted coastal cloth with a feline among hooked
   scrolls, and a sheet of condor silhouettes for the bird's form. What they show, and what the code
   keeps: these figures are CURVED, not squared. The cat has a round face inside a ring, round eyes,
   whiskers and two pointed ears; its body is a rounded bar filled with rows of diamonds, a cape with
   a zigzag lies over its back, its tail opens as a striped fan, and it holds a fringed streamer. The
   condor has a ruff, a bare head with a hooked beak, long wings whose ends break into separate
   fingers, and a fanned tail. Every shape is a field of one colour inside an edge of another, as
   the embroidery is stitched. */
const pcQ=(pts,ci,z)=>({kind:'region',closed:true,role:'detail',plain:true,ns:SG.cov!==false,ci,z,pts});
const pcS=(pts,edge,fill,z,d=1.1)=>[pcQ(pts,edge,z),pcQ(ruyiInner(pts,d),fill,z+0.01)];
const pcZig=(x0,y0,x1,y1,n,amp,ci,z,w=1.1)=>{const q=[],dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy)||1;for(let i=0;i<=n;i++)q.push([x0+dx*i/n-dy/l*amp*(i%2?1:-1),y0+dy*i/n+dx/l*amp*(i%2?1:-1)]);return pcQ(G.band(q,w),ci,z);};
const pcDone=(P,size)=>fitParts(P.map((p,i)=>[p,i]).sort((a,b)=>(a[0].z||0)-(b[0].z||0)||a[1]-b[1]).map(a=>a[0]),size);
defMotif('pcFeline',{name:'Flying cat',term:'—',figure:true,mirrorOk:true,meaning:'A cat in flight: a round whiskered face in a ring, pointed ears, a body sown with diamonds, a zigzag cape over the back, a tail spread like a fan, and a fringed streamer in its paws. The pampas cat or the jaguar is the most constant animal in Andean art from Chavín onward; on Paracas mantles it flies, half animal and half spirit.',
fn(){const P=[];
  // tail: a fan with a zigzag and two bars
  P.push(...pcS(G.chaikin([[33,3],[46,-3],[60,-9],[62,10],[61,31],[46,25],[33,20]],true,2),3,4,0),pcZig(41,3,41,21,6,2.2,0,0.1),pcQ(G.band([[48,-1],[48,24]],1.3),3,0.1),pcZig(55,-3,55,27,8,2.2,1,0.1));
  // cape over the back, three feathers trailing from it
  for(const [x0,y0,x1,y1] of [[34,-13],[37,-9],[38,-5]].map((q,i)=>[q[0],q[1],[52,54,54][i],[-22,-15,-8][i]]))P.push(...pcS(nzCap([[x0,y0],[x1,y1]],3.4,0),1,2,0.2,0.9));
  P.push(...pcS(G.chaikin([[-17,-9],[-7,-20],[11,-24],[29,-19],[40,-8],[36,-1],[20,-7],[4,-9],[-10,-5]],true,3),1,2,0.4),pcZig(-6,-13,32,-11,9,2.4,5,0.5));
  // body: one rounded bar, with two rows of diamonds
  P.push(...pcS(G.chaikin([[-19,-3],[-6,-8],[10,-7],[26,-4],[37,2],[38,14],[32,22],[14,24],[-4,20],[-15,12]],true,3),3,0,1));
  for(const [x,y] of [[-3,2],[8,3],[19,4],[30,6],[2,13],[13,14],[24,15]]){P.push(pcQ([[x-4,y],[x,y-3.6],[x+4,y],[x,y+3.6]],1,1.1),pcQ([[x-1.7,y],[x,y-1.5],[x+1.7,y],[x,y+1.5]],2,1.2));}
  // hind legs, bent under; fore legs reaching forward; claws
  const leg=(pts,a0,a1,z)=>{P.push(...pcS(nzCap(pts,4.8,2),1,3,z,1));const e=pts[pts.length-1];for(let k=0;k<3;k++){const a=(a0+(a1-a0)*k/2)*DEG;P.push(pcQ(nzCap([e,[e[0]+Math.cos(a)*4.6,e[1]+Math.sin(a)*4.6]],1.5,0),5,z+0.05));}};
  leg([[25,19],[21,29],[11,33]],150,215,0.8);leg([[33,19],[38,29],[47,32]],-30,35,0.8);
  // the streamer in the fore paws: a band with a fringed end
  P.push(...pcS(nzCap([[-36,13],[-45,19],[-54,28]],5.4,1),0,1,1.3,1),pcZig(-38,14.6,-52,26.4,5,1.5,3,1.4,0.9));for(const d of [-2.4,0,2.4])P.push(pcQ(nzCap([[-54+d*0.6,28+d*0.5],[-59+d*0.9,33+d*0.2]],1.4,0),0,1.3));
  leg([[-9,12],[-23,16],[-37,13]],150,215,1.5);leg([[-5,17],[-17,24],[-30,25]],140,205,1.5);
  // head: ears, face in its ring, eyes, nose, whiskers
  for(const e of [[[-38,-17],[-41,-32],[-29,-21]],[[-27,-21],[-18,-33],[-16,-17]]])P.push(...pcS(e,3,0,2,1.2));
  P.push(pcQ(G.circle(-28,-8,13.4,40),3,2.2),pcQ(G.circle(-28,-8,11.2,36),1,2.3));
  for(const x of [-32.8,-23.2])P.push(pcQ(G.circle(x,-10.6,3.5,20),5,2.4),pcQ(G.circle(x,-10.6,1.6,12),3,2.5));
  P.push(pcQ([[-30,-5.6],[-26,-5.6],[-28,-3]],0,2.4),pcQ(G.band([[-28,-3],[-28,-0.6]],0.9),3,2.4),pcQ(G.band(G.quad([-32.6,0.4],[-28,2.6],[-23.4,0.4],8),1),3,2.4));
  for(const s of [-1,1])for(const dy of [-2,0.2,2.4])P.push(pcQ(G.band([[-28+s*3.2,-2.2+dy*0.3],[-28+s*10,-3.4+dy]],0.7),3,2.4));
  return pcDone(P,98);}});
defMotif('pcBird',{name:'Condor, wings spread',term:'kuntur',figure:true,meaning:'The condor seen from the front with wings and tail spread: a ruff at the neck, a bare head with a hooked beak, and wings whose ends break into separate fingers. The great bird of the high Andes, messenger between the earth and the upper world, embroidered by the hundred along the borders of mantles.',
fn(){const P=[],fe=(x,y,ang,len,w,edge,fill,z,bend=0)=>{const a=ang*DEG,e=[x+Math.cos(a)*len,y+Math.sin(a)*len],m=[(x+e[0])/2-Math.sin(a)*bend,(y+e[1])/2+Math.cos(a)*bend];P.push(...pcS(nzCap([[x,y],m,e],t=>w*(0.5-0.26*t),2),edge,fill,z,0.8));};
  // tail: five feathers fanned
  [62,76,90,104,118].forEach((a,i)=>fe(0,16,a,i===2?24:22-Math.abs(i-2)*1.5,7,1,i%2?0:3,0+i*0.01));
  for(const s of [-1,1]){const A=a=>s>0?a:180-a;
    // flight feathers hanging from the arm, lapped toward the body
    for(let i=0;i<6;i++)fe(s*(37-i*5.6),-11+i*0.4,A(72+i*3),15+i*1.5,7.4,1,i%2?3:0,0.3+i*0.02,s*1.2);
    // the fingers at the wing end, each separate, lapped from the top down
    [-38,-17,3,23,43,62].forEach((a,i)=>fe(s*39,-13,A(a),19+2.6*Math.sin(Math.PI*i/5),5.8,1,i%2?0:3,0.5+i*0.02,s*(i<3?-1.6:1.6)));
    // the arm
    P.push(...pcS(nzCap([[s*3,-9],[s*20,-13.4],[s*41,-13]],t=>4.2-1.2*t,2),1,2,1,0.9),pcZig(s*7,-10.4,s*37,-13.2,8,1.1,5,1.1,0.8));
    // legs and talons
    P.push(...pcS(nzCap([[s*4,15],[s*8,24]],3.6,0),0,1,0.2,0.8));for(const a of [40,85,130])P.push(pcQ(nzCap([[s*8,24],[s*8+Math.cos(A(a)*DEG)*4.6,24+Math.sin(A(a)*DEG)*4.6]],1.4,0),5,0.25));}
  // body with chevrons, ruff, neck, bare head with crest and hooked beak
  P.push(...pcS(G.chaikin([[0,-15],[7,-11],[8.6,2],[6,14],[0,20],[-6,14],[-8.6,2],[-7,-11]],true,3),1,3,1.5));
  for(const y of [-2,4,10])P.push(pcQ(G.band([[-4.6,y-2],[0,y+1.4],[4.6,y-2]],1),5,1.6));
  P.push(...pcS(nzCap([[0,-13],[1.6,-23]],6.4,0),0,4,1.7,0.9),...pcS(G.ellipse(0,-13.6,9.4,4.4,30),3,5,1.8,0.9));
  P.push(...pcS(G.circle(2.6,-26,5.4,26),0,4,2,0.9),pcQ(G.chaikin([[-1,-30],[1,-33.6],[4.6,-34],[6,-30.6]],true,2),0,1.9));
  P.push(pcQ(G.chain(G.bez([6,-29.6],[10,-30.6],[15,-29],[15.6,-24.6],8),G.bez([15.6,-24.6],[15.4,-22.6],[14,-21],[13,-20.4],5),G.bez([13,-20.4],[13,-23],[10,-24],[6.6,-23.4],6)),1,2.1),pcQ(G.circle(3.6,-27,1.5,12),5,2.2),pcQ(G.circle(3.8,-27,0.7,8),3,2.3));
  return pcDone(P,98);}});
defMotif('pcSerpent',{name:'Two-headed serpent',term:'—',figure:true,meaning:'A looping body with a head at each end, tongues out. Double-headed serpents frame and trail from the larger figures on Paracas cloth, and stand for the sky’s arc, the rainbow and running water. The body is one even band folded into loops, stitched in stripes of colour that run its whole length.',
fn(){const P=[],sp=coilSpine(7.5,20),n=sp.length,B=coilBand(sp,5.2);
  // the body: an edge, a field, and a stripe down the middle with spots along it
  P.push(pcQ(B.poly,3,0),pcQ(coilBand(sp,4).poly,0,0.01),pcQ(coilBand(sp,1.3).poly,1,0.02));
  for(let i=14;i<n-10;i+=13)for(const f of [0.2,0.8])P.push(pcQ(G.circle(lerp(B.L[i][0],B.R[i][0],f),lerp(B.L[i][1],B.R[i][1],f),0.95,8),5,0.03));
  // heads: a blunt wedge with a round eye, whiskers, and a forked tongue
  for(const s of [-1,1]){const f=([x,y])=>[s*(-50+x),-19.5+y],M=q=>q.map(f);
    P.push(...pcS(M(G.chaikin([[2,-5.4],[-6,-8.6],[-15,-7],[-19,-1.6],[-19,1.6],[-15,7],[-6,8.6],[2,5.4]],true,3)),3,1,1,1.1));
    P.push(pcQ(M(G.circle(-7.6,-2.6,2.7,18)),5,1.1),pcQ(M(G.circle(-7.6,-2.6,1.2,10)),3,1.2),pcQ(M(G.band([[-18.6,2.6],[-8,2.6]],0.9)),3,1.1));
    for(const [y0,y1] of [[-6.4,-11],[5.6,10.6]])for(const dx of [-12,-8.6])P.push(pcQ(M(nzCap([[dx,y0],[dx-2.6,y1]],1.3,0)),4,0.9));
    P.push(pcQ(M(nzCap([[-18.6,0],[-25,0]],1.5,0)),4,0.9),pcQ(M(nzCap([[-25,0],[-29,-2.8]],1.2,0)),4,0.9),pcQ(M(nzCap([[-25,0],[-29,2.8]],1.2,0)),4,0.9));}
  return pcDone(P,98);}});
defMotif('chBird',{name:'Seabird',term:'—',figure:true,mirrorOk:true,meaning:'A crested seabird in profile, squared off by the weave: pelican, cormorant or booby. On the desert coast the birds’ guano fed the fields.',
fn(){return anFit(AN.bird([0,1,2]),90);}});
/* Geoglyphs, redrawn 2026-10-13 against a sheet of nine Nazca figures supplied by the user.
   What the sheet shows, and what the code keeps: a figure is not a stick drawing. It is a narrow
   BAND of even width that the line walks all the way round, so every limb, feather and finger has
   two sides and a rounded end; turns are rounded; hands and feet have separate fingers that can be
   counted; the tail of the monkey is the same band wound into a spiral. Each figure is assembled
   from bands, drawn once with their outline and once more without it, so that the joins disappear
   and one outline is left. */
const nzCap=(pts,w,sm=2)=>{const sp=G.resample(sm?G.chaikin(pts,false,sm):pts,false,1),n=sp.length,L=[],R=[],hw=typeof w==='function'?w:()=>w/2,tan=i=>{const a=sp[Math.max(0,i-1)],b=sp[Math.min(n-1,i+1)],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return[(b[0]-a[0])/l,(b[1]-a[1])/l];};
  for(let i=0;i<n;i++){const t=tan(i),h=hw(i/(n-1));L.push([sp[i][0]-t[1]*h,sp[i][1]+t[0]*h]);R.push([sp[i][0]+t[1]*h,sp[i][1]-t[0]*h]);}
  const cap=(i,dir)=>{const t=tan(i),h=hw(i?1:0),o=[],a0=Math.atan2(t[0]*dir,-t[1]*dir);for(let k=1;k<6;k++){const a=a0-dir*0+(-Math.PI*k/6);o.push([sp[i][0]+Math.cos(a+Math.PI/2*0)*0,0]);}return o;};
  const arc=(c,from,to)=>{const a0=Math.atan2(from[1]-c[1],from[0]-c[0]),r=Math.hypot(from[0]-c[0],from[1]-c[1]),o=[];let a1=Math.atan2(to[1]-c[1],to[0]-c[0]);while(a1>a0)a1-=Math.PI*2;if(a0-a1<0.2)a1-=Math.PI*2;for(let k=1;k<6;k++){const a=a0+(a1-a0)*k/6;o.push([c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r]);}return o;};
  return L.concat(arc(sp[n-1],L[n-1],R[n-1]),R.slice().reverse(),arc(sp[0],R[0],L[0]));};
const nzFig=(bands,extra=[],size=96)=>{const P=[];for(const b of bands)P.push({kind:'region',closed:true,role:'outer',tone:1,pts:b});for(const b of bands)P.push({kind:'region',closed:true,role:'outer',tone:1,ns:true,pts:G.offset(b,-0.28,true)});return fitParts(P.concat(extra),size);};
const nzFan=(B,x,y,a0,a1,n,len,w=1.9)=>{for(let k=0;k<n;k++){const a=(a0+(a1-a0)*(n>1?k/(n-1):0.5))*DEG,l=len*(1-0.16*Math.abs(k-(n-1)/2)/Math.max(1,(n-1)/2));B.push(nzCap([[x,y],[x+Math.cos(a)*l,y+Math.sin(a)*l]],w,0));}};
defMotif('nzHummingbird',{name:'Hummingbird',term:'colibrí',upright:true,meaning:'A hummingbird nearly a hundred metres long, its beak a ruled straight band. Like every Nazca figure it is one unbroken outline, made by lifting the dark stones from the pale ground beneath: the wing feathers are long parallel bars hung from the wing like the teeth of a comb.',
fn(){const B=[];
  B.push(nzCap([[0,-18],[0,-60]],1.7,0),G.circle(0,-15,4.6,24),nzCap([[0,-12],[0,4],[0,18]],t=>4.6-1.2*t,0));
  for(const s of [-1,1]){B.push(nzCap([[s*2,-8],[s*20,-12],[s*46,-13]],3,2));
    [[11,24],[19,27],[27,25],[35,20],[43,14]].forEach(([x,l])=>B.push(nzCap([[s*x,-12],[s*(x+3),-12+l]],3.9,0)));
    nzFan(B,s*4,13,s>0?20:160,s>0?75:105,3,6.6,1.6);}
  [[-4.2,46],[0,56],[4.2,46]].forEach(([x,l])=>B.push(nzCap([[x*0.6,16],[x*1.5,l]],3.7,0)));
  return nzFig(B,[{kind:'dot',x:1.2,y:-15.6,r:0.8,role:'detail'}],98);}});
defMotif('nzSpider',{name:'Spider',term:'araña',upright:true,meaning:'A spider forty-six metres long. Each leg is a band with two bends, and one hind leg runs on far beyond the body, which some read as the path by which the figure was entered and walked.',
fn(){const B=[G.ellipse(0,17,12.6,16.6,40),G.ellipse(0,-7,7.6,9.6,32)];
  for(const s of [-1,1]){B.push(nzCap([[s*3,-15],[s*6.4,-23],[s*5,-29],[s*1.8,-27]],1.9,2));
    B.push(nzCap([[s*5,-12],[s*14,-24],[s*13,-44]],2.6,1),nzCap([[s*7,-8],[s*23,-15],[s*26,-31],[s*37,-33]],2.6,1),nzCap([[s*7,-4],[s*25,-2],[s*28,15],[s*39,17]],2.6,1));
    B.push(nzCap(s>0?[[6,0],[19,6],[23,35],[28,44],[60,39]]:[[-6,0],[-19,6],[-23,35],[-32,43]],2.6,1));}
  return nzFig(B,[],96);}});
defMotif('nzMonkey',{name:'Monkey',term:'mono',upright:true,mirrorOk:true,meaning:'A monkey with a great spiral tail and, between its two hands, nine fingers. Monkeys live far away over the mountains in the forest: the figure belongs to the desert’s concern with water.',
fn(){const B=[],sp=[];for(let i=0;i<=110;i++){const t=i/110,a=(180+(1-t)*3.3*360)*DEG,r=2.4+18.6*t;sp.push([-22+Math.cos(a)*r,-28+Math.sin(a)*r]);}
  // the tail: wound four times, then down in one sweep to the hip
  B.push(nzCap(sp.concat(G.bez([-43,-28],[-43,-12],[-30,2],[-10,6],16).slice(1)),3.2,0));
  // the back, arched up to the shoulders
  B.push(nzCap([[-11,6],[0,3],[12,-4],[23,-9]],t=>2.7+0.8*Math.sin(Math.PI*t),2));
  // head, ear and muzzle
  B.push(G.circle(31,-12,8.4,32),G.circle(27,-20.4,3.1,16),G.ellipse(39.4,-9,3.6,3,16));
  // two long arms hanging in a loop, the hands meeting
  B.push(nzCap([[25,-5],[38,0],[47,13],[45,25],[39,31]],3,2));nzFan(B,39,31,115,190,4,7);
  B.push(nzCap([[20,-3],[13,9],[13,22],[18,28],[22,29]],3,2));nzFan(B,22,29,-10,75,5,6.6);
  // two legs with three toes each
  B.push(nzCap([[-9,7],[-12,22],[-13,36]],3,2));nzFan(B,-13,36,10,80,3,6.6);
  B.push(nzCap([[-2,4],[1,19],[3,33]],3,2));nzFan(B,3,33,5,75,3,6.6);
  return nzFig(B,[{kind:'dot',x:33,y:-13.6,r:0.9,role:'detail'}],98);}});

/* ---------- borders ---------- */
defBorder('tocapuBand',{name:'Tocapu band',fn(L,t){const n=Math.max(2,Math.round(L/t)),s=L/n,P=[];
  for(let i=0;i<n;i++)P.push(...AN.place(AN.UNITS[AN.UKEYS[(i*3+1)%AN.UKEYS.length]](AN.SCHEMES[(i*2)%AN.SCHEMES.length]),i*s,(t-Math.min(s,t))/2,Math.min(s,t)));
  return P.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));}});
defBorder('stepFretBand',{name:'Stepped triangles',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.0))),w=L/n,P=[];
  for(let i=0;i<n;i++){const st=anSteps(4).map(([x,y])=>[i*w+x*w,(i%2?1-y:y)*t]);P.push(anP(st,i%2));}return P;}});
defBorder('waveBand',{name:'Wave crests',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.1))),w=L/n,g=1/6,P=[];const u=[[0,6],[0,4],[1,4],[1,3],[2,3],[2,2],[3,2],[3,0],[6,0],[6,3],[5,3],[5,1],[4,1],[4,6]];
  for(let i=0;i<n;i++)P.push(anP(u.map(([x,y])=>[i*w+x*g*w,y*g*t]),0));return P;}});

/* ---------- layouts ---------- */
const anRect=(a,b,c,e)=>[[a,b],[c,b],[c,e],[a,e]];
const anTiles=(g,rng,fb)=>{const p=poolAll(g.motifs.tile).filter(k=>SG.tiles[k]);return p.length?rng.shuffle(p):fb;};
/* Tunic (unku): a rectangle of cloth folded at the shoulders with a slit for the head.
   The body carries one all-over design; a stepped yoke falls from the neck; a band of
   tocapu crosses the waist. */
defStructure('tunic',{name:'Tunic',blurb:'A woven tunic laid flat: one design over the body, a stepped yoke falling from the neck slit, a band of square signs at the waist.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,tw=W*0.74,x0=(W-tw)/2,x1=x0+tw,y0=46,y1=H-46,cx=W/2;
  const tiles=anTiles(g,rng,['incaKey','tocapu']),key=tiles[0],u=tw/(clamp(S.density)>0.6?9:7)/1.05,r={x0,y0,x1,y1};
  ctx.items.push({type:'parts',parts:tileParts(key,r,key==='incaChecker'?u*1.105:u,rng.fork('t'),g),role:'frame',variant:'body'});
  const P=[],hero=ctx.pick('hero'),M=SG.motifs[hero],fig=M&&M.figure,mode=fig?'chest':rng.pick(['yoke','waist','yoke','plain']);
  if(mode==='yoke'){const n=5,sw=tw*0.3/n,sh=(y1-y0)*0.3/n,st=[[cx,y0]];for(let i=0;i<n;i++)st.push([cx+(i+1)*sw,y0+0],[cx+(i+1)*sw,y0]);
    const pts=[[cx-n*sw,y0]];for(let i=n;i>0;i--)pts.push([cx-i*sw,y0+(n-i+1)*sh],[cx-(i-1)*sw,y0+(n-i+1)*sh]);for(let i=1;i<=n;i++)pts.push([cx+(i-1)*sw,y0+(n-i+1)*sh],[cx+i*sw,y0+(n-i+1)*sh]);pts.push([cx+n*sw,y0]);
    P.push(anP(pts,0),anL(pts,'inner'));}
  if(key!=='tocapu'&&(mode==='waist'||mode==='yoke'&&rng.chance(.4))){const bh=tw/9,by=y0+(y1-y0)*0.56;ctx.items.push({type:'parts',parts:SG.borders.tocapuBand.fn(tw,bh).map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[x+x0,y+by])})),role:'border',variant:'waist'});
    P.push(anL([[x0,by],[x1,by]],'outer'),anL([[x0,by+bh],[x1,by+bh]],'outer'));}
  if(mode==='chest'){const s=tw*0.5,cy=y0+(y1-y0)*0.44;P.push({kind:'region',closed:true,role:'outer',plain:true,bg:true,pts:anRect(cx-s/2,cy-s/2,cx+s/2,cy+s/2)},anL(anRect(cx-s/2,cy-s/2,cx+s/2,cy+s/2),'outer',true));}
  P.push(anL(anRect(x0,y0,x1,y1),'outer',true),anL([[cx,y0],[cx,y0+(y1-y0)*0.13]],'outer'),anL([[x0,y1-14],[x1,y1-14]],'inner'));
  ctx.parts(P,'frame');
  if(mode==='chest')ctx.motif(hero,cx,y0+(y1-y0)*0.44,tw*0.44,{role:'hero',variant:'hero'});
}});
/* Mantle: one figure repeated in rows over a dark cloth, alternate rows turned about,
   its colours rotating so that each colourway runs along a diagonal; a broad border of
   the same figure, smaller, all round. */
defStructure('mantle',{name:'Embroidered mantle',blurb:'One figure repeated in rows across a dark cloth, turned in alternate rows, its colours rotating along the diagonals, inside a border of the same figure.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,m=38,bw=W*0.1,x0=m+bw,x1=W-m-bw,y0=m+bw,y1=H-m-bw,d=clamp(S.density);
  const pool=[...new Set(poolAll(g.motifs.hero))].filter(k=>SG.motifs[k]&&!SG.motifs[k].script),key=rng.pick(pool.length?pool:['floret']),M=SG.motifs[key];
  // a figure with a great many parts is repeated fewer times, and not round the border
  let heavy=false;try{heavy=M.fn(makeRng(1),g).length>90;}catch(e){}
  const n=M.fine?2:heavy?3:(d>0.6?5:4),c=(x1-x0)/n,rows=Math.round((y1-y0)/c),ch=(y1-y0)/rows,nc=4;
  for(let j=0;j<rows;j++)for(let i=0;i<n;i++)ctx.motif(key,x0+(i+0.5)*c,y0+(j+0.5)*ch,Math.min(c,ch)*0.8,{role:'hero',flip:j%2===1&&M.mirrorOk!==false&&!M.fine,variant:'mt'+((i+j)%nc),ciShift:(i+j)%nc,noOcc:true});
  // border: the figure again, smaller, marching round
  const bk=rng.pick(pool.length?pool:[key]),P=[anL(anRect(m,m,W-m,H-m),'outer',true),anL(anRect(x0-6,y0-6,x1+6,y1+6),'outer',true)],bn=Math.round((W-2*m)/bw);
  const bs=(W-2*m)/bn;
  if(!heavy&&!SG.motifs[bk].fine)for(let i=0;i<bn;i++){for(const yy of [m+bw/2,H-m-bw/2])ctx.motif(bk,m+(i+0.5)*bs,yy,bw*0.72,{role:'ring',variant:'mb'+(i%nc),ciShift:i%nc,noOcc:true});
    if(i>0&&i<bn-1)for(const xx of [m+bw/2,W-m-bw/2])ctx.motif(bk,xx,m+(i+0.5)*bs,bw*0.72,{role:'ring',variant:'mb'+((i+2)%nc),ciShift:(i+2)%nc,noOcc:true});}
  ctx.parts(P,'frame');
}});
/* Geoglyph: one great single-line figure on the desert, crossed by ruled lines and long
   cleared trapezoids that pay it no attention. */
defStructure('geoglyph',{name:'Desert figure',blurb:'One great figure drawn as a single path, with ruled lines and long cleared wedges running across the plain around it.',
fn(ctx){
  const {W,H,g,rng}=ctx;const P=[];
  for(let i=0;i<rng.int(3,5);i++){const a=rng.range(0,Math.PI),cx=rng.range(0.2,0.8)*W,cy=rng.range(0.2,0.8)*H,L=W*1.6;P.push({kind:'line',role:'detail',pts:[[cx-Math.cos(a)*L,cy-Math.sin(a)*L],[cx+Math.cos(a)*L,cy+Math.sin(a)*L]]});}
  for(let i=0;i<2;i++){const a=rng.range(0,Math.PI*2),ox=rng.range(0.1,0.9)*W,oy=rng.range(0.1,0.9)*H,L=W*rng.range(0.5,0.8),w0=rng.range(6,12),w1=rng.range(34,64),c=Math.cos(a),s=Math.sin(a);
    P.push({kind:'line',role:'inner',closed:true,pts:[[ox-s*w0,oy+c*w0],[ox+c*L-s*w1,oy+s*L+c*w1],[ox+c*L+s*w1,oy+s*L-c*w1],[ox+s*w0,oy-c*w0]]});}
  ctx.items.push({type:'parts',parts:clipPartsRect(P,{x0:0,y0:0,x1:W,y1:H}),role:'frame',variant:'lines'});
  const hero=ctx.pick('hero');ctx.motif(hero,W/2+rng.range(-40,40),H/2+rng.range(-30,30),W*0.62,{role:'hero',rot:SG.motifs[hero]&&SG.motifs[hero].fine?0:rng.range(-18,18),variant:'hero'});
  if(clamp(g.structure.bare||0)<0.7){const k=ctx.pick('ring');ctx.motif(k,W*rng.range(0.12,0.2),H*rng.range(0.78,0.86),W*0.16,{role:'ring',variant:'small'});}
}});
