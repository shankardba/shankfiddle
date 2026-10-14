'use strict';
/* Slavic folk — five crafts that share a vocabulary (flower, bird, star, tree) and
   differ entirely in how the mark is made.

   BRUSH (Petrykivka, Khokhloma). The unit is one stroke: the brush is set down full and
   lifted to a point, leaving a drop. A flower is a ring of drops, a leaf is drops paired
   along a rib, grass is a drop pulled into a curl. `SL.dab` is that stroke; nothing is
   outlined.

   WAX (pysanka). The design is drawn in wax line by line and the egg dyed from light to
   dark, so every line is the colour of the bath it was drawn before. The egg is divided
   first (belts, a face each side) and the divisions filled. Here the bands are ordinary
   borders bent along shallow arcs to suggest the curve, and everything is clipped to the
   egg's outline, which is convex.

   SCISSORS (wycinanki). Folded paper cut freehand, so the result is mirror-symmetric;
   in Łowicz, layers of coloured paper are glued one on another, each smaller than the
   last. Layering here is draw order.

   NEEDLE (cross-stitch). The design lives on a square grid. Motifs are functions from a
   cell to a colour, drawn as runs of cells.

   No hooked cross is generated, although it occurs in old embroidery and on eggs.
   All constructions are original; none traces a reference image. */

const SL={};
const [slRD,slBK,slYL,slGR,slOR,slWH]=[0,1,2,3,4,5];
// paper, paint and thread have no outline; where a tradition does not fill at all, the outline is all there is
const slN=(pts,ci,z=0)=>({kind:'region',closed:true,role:'detail',ci,plain:true,ns:SG.cov!==false,z,pts});
const slR=(pts,ci,z=0,role='outer')=>({kind:'region',closed:true,role,ci,plain:true,z,pts});
const slL=(pts,z=6,role='detail',closed=false)=>({kind:'line',role,closed,pts,z});
const slFit=(P,s=94)=>fitParts(FL.done(P),s);
const slMir=P=>P.concat(P.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[-x,y])})));
const slRect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const slPut=(parts,o)=>parts.map(p=>Object.assign({},p,{z:(p.z||0)+(o.dz||0),pts:G.xform(p.pts,o)}));
const slDir=a=>[Math.sin(a*DEG),-Math.cos(a*DEG)];                       // 0 = up, clockwise
// one brush stroke: the round end at (x,y), the point `len` away toward `rot`
SL.dab=(x,y,len,rot,k=0.3)=>G.xform(G.teardrop(len*k,len*(1-k),10),{x,y,rot});
// a petal: the point at (cx,cy), the round end `len` away toward `ang`
SL.petal=(cx,cy,ang,len,k=0.3)=>{const d=slDir(ang);return G.xform(G.teardrop(len*k,len*(1-k),10),{x:cx+d[0]*len*(1-k),y:cy+d[1]*len*(1-k),rot:ang+180});};
// a stroke pulled into a curve: starts at (x,y) heading `rot`, turns by `bend` degrees over its length
SL.curl=(x,y,len,rot,bend,w)=>{const sp=[[x,y]],n=16;let a=rot;for(let i=0;i<n;i++){const d=slDir(a);x+=d[0]*len/n;y+=d[1]*len/n;sp.push([x,y]);a+=bend/n;}
  return G.ribbon(sp,t=>Math.max(0.15,t<0.18?w*(0.35+0.65*t/0.18):w*Math.pow(Math.max(0,1-(t-0.18)/0.82),0.65)));};
SL.end=(x,y,len,rot,bend)=>{let a=rot;for(let i=0;i<16;i++){const d=slDir(a);x+=d[0]*len/16;y+=d[1]*len/16;a+=bend/16;}return[x,y,a];};
SL.spiral=(x,y,r,a0,turns,w,dir=1)=>{const sp=[];for(let i=0;i<=30;i++){const t=i/30,a=(a0+dir*t*turns*360)*DEG,rr=r*(1-0.86*t);sp.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}return G.ribbon(sp,t=>Math.max(0.2,w*(1-0.75*t)));};

/* ================= Petrykivka ================= */
SL.flower=(R=42)=>{const P=[];
  for(let i=0;i<12;i++)P.push(slN(SL.petal(0,0,i*30+15,R*1.04,0.09),slBK,-1));
  for(let i=0;i<12;i++){P.push(slN(SL.petal(0,0,i*30,R,0.2),slRD,0),slN(SL.petal(0,0,i*30,R*0.8,0.15),slOR,1),slN(SL.petal(0,0,i*30,R*0.5,0.1),slYL,1.2));}
  for(let i=0;i<8;i++)P.push(slN(SL.petal(0,0,i*45+22.5,R*0.5,0.25),slBK,2),slN(SL.petal(0,0,i*45+22.5,R*0.36,0.2),slRD,2.2));
  P.push(slN(G.circle(0,0,R*0.17,20),slYL,3));for(let i=0;i<6;i++){const d=slDir(i*60);P.push(slN(G.circle(d[0]*R*0.09,d[1]*R*0.09,R*0.028,6),slBK,4));}return P;};
defMotif('ptFlower',{name:'Onion flower',term:'tsybulka',meaning:'The big round flower of Petrykivka painting, named for its likeness to a cut onion: rings of drop-shaped strokes laid from the rim toward the middle, each stroke loaded with two colours so that it shades as it is pulled. No such flower grows; it is every garden flower at once.',
fn(rng,g){return slFit(SL.flower(),92);}});
SL.bud=()=>{const P=[slN(SL.curl(0,12,40,176,34,2.4),slGR,-2)];
  for(const a of [-58,58])P.push(slN(SL.dab(0,13,17,a,0.26),slGR,-1));
  for(const [a,l] of [[-24,36],[24,36],[0,42]])P.push(slN(SL.petal(0,12,a,l,0.3),slRD,a?0:1),slN(SL.petal(0,10,a,l*0.6,0.26),slOR,a?0.5:1.5));
  for(const a of [-40,-13,13,40])P.push(slN(SL.petal(0,-22,a,13,0.1),slBK,2));
  for(const a of [-32,32])P.push(slN(SL.petal(0,14,a,13,0.34),slGR,2));return P;};
defMotif('ptBud',{name:'Bud',term:'pupianok',upright:true,meaning:'A closed bud on a bent stem: three strokes for the petals, two for the sepals. Buds stand at the outer ends of a Petrykivka bouquet, where the eye leaves the picture.',
fn(){return slFit(SL.bud(),92);}});
SL.kalyna=()=>{const P=[slN(SL.curl(-2,-40,26,170,-30,2),slGR,-2)];
  for(const [a,l] of [[-112,24],[-82,30],[-52,24]])P.push(slN(SL.petal(-3,-38,a,l,0.34),slGR,-1),slN(SL.petal(-3,-38,a,l*0.5,0.2),slYL,-0.5));
  for(const [a,l] of [[70,22],[100,26]])P.push(slN(SL.petal(-1,-38,a,l,0.34),slGR,-1));
  const rows=[[0],[-9,9],[-17,0,17],[-9.5,9.5],[-18,0,18],[-9,9],[0]];rows.forEach((xs,j)=>xs.forEach(x=>{const y=-16+j*8.4+Math.abs(x)*0.12;
    P.push(slN(G.circle(x,y,5.5,16),slRD,j*0.1),slN(G.circle(x-1.5,y-1.7,1.5,8),slOR,j*0.1+0.02),slN(G.circle(x+0.6,y+3.6,0.9,6),slBK,j*0.1+0.03));}));return P;};
defMotif('ptKalyna',{name:'Guelder rose',term:'kalyna',upright:true,meaning:'A hanging bunch of red viburnum berries, each put on with a fingertip. Kalyna is the plant of Ukrainian song: the girl, the homeland, blood and kinship. It is in every bouquet and on every wedding towel.',
fn(){return slFit(SL.kalyna(),92);}});
SL.fern=()=>{const P=[],rib=G.resample(G.bez([3,46],[-9,20],[9,-14],[-2,-46],24),false,1.5);P.push(slN(G.ribbon(rib,t=>1.5*(1-0.7*t)),slGR,-1));
  const S=G.samples(rib,false,G.length(rib,false)/9);S.slice(1,-1).forEach((q,i)=>{const a=Math.atan2(q.tx,-q.ty)/DEG,l=lerp(24,9,i/7);for(const s of [-1,1]){P.push(slN(SL.petal(q.x,q.y,a+s*54,l,0.2),slGR,i*0.1),slN(SL.petal(q.x,q.y,a+s*54,l*0.6,0.13),slYL,i*0.1+0.05));}});
  P.push(slN(SL.petal(-2,-40,-6,9,0.3),slGR,1));return P;};
defMotif('ptLeaf',{name:'Fern leaf',term:'paporot',meaning:'A leaf built of paired strokes shrinking toward the tip, dark green with a yellow heart. The strokes are made with a brush of cat hair, or with a reed, a fingertip, a slice of cork.',
fn(){return slFit(SL.fern(),94);}});
SL.cock=()=>{const P=[];
  [[18,96,slGR],[30,88,slRD],[42,84,slYL],[54,78,slBK],[66,70,slOR],[80,58,slGR]].forEach(([r,b,ci],i)=>{P.push(slN(SL.curl(12,2,66-i*4,r-8,b*0.8,6.4),ci,-2+i*0.01),slN(SL.curl(12,2,(66-i*4)*0.6,r-8,b*0.5,2.2),ci===slYL?slOR:slYL,-1.9+i*0.01));});
  for(const [x,s] of [[-5,-1],[5,1]]){P.push(slN(G.band([[x,16],[x+s*1.5,35]],2),slYL,-1));for(const a of [-50,0,50])P.push(slN(SL.dab(x+s*1.5,35,8,180+a,0.2),slYL,-1));}
  P.push(slN(SL.dab(-7,5,38,97,0.38),slOR,0),slN(G.ribbon(G.resample(G.bez([-12,-4],[-17,-12],[-17,-22],[-13,-28],10),false,2),t=>7.4-2.4*t),slOR,0),slN(G.circle(-14,-29,7.4,20),slOR,0.2));
  for(const [a,l] of [[-30,10],[0,12],[30,10]])P.push(slN(SL.dab(-13+a*0.12,-35,l,a,0.36),slRD,0.1));
  P.push(slN(SL.dab(-17,-24,9,186,0.36),slRD,0.3),slN([[-20.4,-31.6],[-29,-28.4],[-20.4,-26]],slYL,0.3),slN(G.circle(-16,-30.4,1.9,10),slWH,1),slN(G.circle(-16.3,-30.4,0.9,8),slBK,1.2));
  [[112,26,slRD],[104,21,slBK],[96,16,slYL]].forEach(([a,l,ci],i)=>P.push(slN(SL.dab(-9,0+i*2.2,l,a,0.3),ci,1+i*0.1)));
  for(const y of [-12,-6,0])P.push(slN(SL.dab(-13.6,y+6,5.4,200,0.3),slYL,1));return P;};
defMotif('ptBird',{name:'Rooster',term:'pivnyk',figure:true,mirrorOk:true,meaning:'The cock that calls up the sun and drives off whatever walks at night, with a tail of long curved strokes in every colour on the palette. Petrykivka birds are painted like the flowers they sit among, stroke by stroke.',
fn(){return slFit(SL.cock(),94);}});

/* ================= Khokhloma ================= */
SL.grass=(x,y,s,rot,ci=slRD)=>[[-28,-70,1],[0,-46,1.25],[26,58,1.05],[52,84,0.8]].map(([a,b,k])=>slN(SL.curl(x,y,s*k,rot+a,b,s*0.055),ci,0));
SL.berry=(x,y,s,rot=0)=>{const P=[slN(G.xform(G.chaikin([[0,-9],[7,-10.4],[11.4,-3],[7,7.4],[0,13.4],[-7,7.4],[-11.4,-3],[-7,-10.4]],true,3),{x,y,s,rot}),slRD,1)];
  for(const [a,b] of [[-4.6,-3],[0,-4.6],[4.6,-3],[-2.4,2.4],[2.4,2.4],[0,7.4],[-6.4,1.4],[6.4,1.4]])P.push(slN(G.xform(G.circle(a,b,0.85,6),{x,y,s,rot}),slYL,2));
  for(const a of [-64,-32,0,32,64])P.push(slN(G.xform(SL.dab(0,-9.6,6.4,a,0.3),{x,y,s,rot}),slGR,2));return P;};
defMotif('khBerry',{name:'Strawberries',term:'zemlyanichka',meaning:'Wild strawberries hanging from thin stems under a leaf, red dotted with gold. Berries are the commonest subject of Khokhloma ware; a bowl painted with them is called by their name.',
fn(){const P=[];[[-18,24,-24,1],[2,30,6,1.1],[21,16,22,0.92]].forEach(([x,y,r,s])=>{P.push(slN(G.band(G.bez([0,-30],[x*0.3,-18],[x*0.9,y-34],[x,y-12*s],10),1.3),slYL,0),...SL.berry(x,y,s,r));});
  for(const a of [-74,-37,0,37,74])P.push(slN(SL.petal(0,-28,a,a?17:21,0.36),slYL,0.5),slN(G.band([[0,-28],[slDir(a)[0]*13,-28+slDir(a)[1]*13]],0.8),slRD,0.6));
  P.push(...SL.grass(-6,-30,20,-100,slRD),...SL.grass(6,-30,20,100,slRD).map(p=>Object.assign(p,{pts:p.pts})));return slFit(P,94);}});
defMotif('khRowan',{name:'Rowan',term:'ryabinka',upright:true,meaning:'A bunch of rowan berries, each one stamped with the end of a stick wrapped in cloth and touched with a yellow dot, under a feathered leaf.',
fn(){const P=[slN(G.band(G.bez([-4,-44],[2,-30],[-2,-18],[0,-8],10),1.5),slYL,-1)];
  const rib=G.resample(G.bez([-2,-40],[14,-44],[30,-36],[42,-20],16),false,2);P.push(slN(G.ribbon(rib,t=>1.1*(1-0.6*t)),slYL,-1));
  G.samples(rib,false,G.length(rib,false)/6).slice(1).forEach((q,i)=>{const a=Math.atan2(q.tx,-q.ty)/DEG;for(const s of [-1,1])P.push(slN(SL.petal(q.x,q.y,a+s*52,lerp(13,7,i/5),0.3),slGR,0));});
  const rows=[[-8,0,8],[-13,-4.4,4.4,13],[-17,-8.6,0,8.6,17],[-12.6,-4.2,4.2,12.6],[-8.4,0,8.4],[-4,4]];rows.forEach((xs,j)=>xs.forEach(x=>{const y=-4+j*7.8+Math.abs(x)*0.1;P.push(slN(G.circle(x,y,4.6,14),slRD,j*0.1+1),slN(G.circle(x,y+0.6,1.15,6),slYL,j*0.1+1.05));}));
  P.push(...SL.grass(-6,-30,18,-116,slRD));return slFit(P,94);}});
defMotif('khLeaf',{name:'Gold leaf',term:'listok',meaning:'A broad lobed leaf left in gold, its veins drawn in red and black, with grass curling from its stem. In background painting the leaf is not painted at all: black is brushed round it and the gold ground shows through.',
fn(){const P=[slN(G.band(G.bez([0,46],[2,34],[-2,22],[0,12],8),1.8),slYL,-1)];
  [[-96,25],[-56,34],[0,44],[56,34],[96,25]].forEach(([a,l])=>{P.push(slN(SL.petal(0,14,a,l,0.36),slYL,0));const d=slDir(a);P.push(slN(G.band([[0,14],[d[0]*l*0.74,14+d[1]*l*0.74]],1.1),slRD,1));
    for(const s of [-1,1]){const m=[d[0]*l*0.42,14+d[1]*l*0.42],e=slDir(a+s*38);P.push(slN(G.band([m,[m[0]+e[0]*l*0.2,m[1]+e[1]*l*0.2]],0.7),slRD,1));}});
  P.push(...SL.grass(0,40,22,-64,slRD),...SL.grass(0,40,22,64,slRD));return slFit(P,94);}});
defMotif('khKudrina',{name:'Curl flower',term:'kudrina',meaning:'A blossom made of nothing but gold curls turning about a red centre. Kudrina, from the word for curls, is the name of the whole manner in which large gold forms are reserved from a red or black ground.',
fn(){const P=[];for(let i=0;i<6;i++){const d=slDir(i*60);P.push(slN(SL.spiral(d[0]*26,d[1]*26,15,i*60+20,1.25,4.4),slYL,0),slN(SL.petal(0,0,i*60+30,27,0.3),slYL,0),slN(SL.petal(0,0,i*60+30,15,0.26),slRD,1));}
  P.push(slN(G.circle(0,0,7.4,18),slRD,2),slN(G.circle(0,0,3,12),slYL,3));for(let i=0;i<6;i++){const d=slDir(i*60);P.push(slN(G.circle(d[0]*43.6,d[1]*43.6,1.7,8),slRD,1));}return slFit(P,94);}});

/* ================= wycinanki ================= */
SL.rooster=()=>{const P=[];
  [[8,120,slBK,56],[22,112,slGR,52],[36,104,slRD,48],[50,96,slYL,44],[64,86,slWH,38]].forEach(([r,b,ci,l],i)=>P.push(slN(SL.curl(13,-5,l,r,b,5.2),ci,-3+i*0.1)));
  for(const [x,s] of [[-5,-1],[6,1]]){P.push(slN(G.band([[x,15],[x+s,34]],2.4),slBK,-1));for(const a of [-52,0,52])P.push(slN(G.band([[x+s,34],[x+s+slDir(180+a)[0]*8,34+slDir(180+a)[1]*5]],1.6),slBK,-1));}
  P.push(slN(G.chaikin([[-25,-25],[-21,-32],[-15,-34],[-10,-29],[-9,-21],[-5,-10],[4,-7],[14,-9],[18.6,0],[13,12],[2,19.4],[-10,18.4],[-19,10],[-21.4,-4],[-19.6,-15],[-22.4,-21]],true,3),slBK,0));
  for(const [x,a] of [[-19.6,-24],[-15.6,0],[-11.6,24]])P.push(slN(SL.dab(x,-32.4,9.4,a,0.4),slRD,-0.5));
  P.push(slN(SL.dab(-21,-21,10,184,0.4),slRD,0.5),slN([[-24.4,-28.4],[-33,-25.4],[-24.4,-23]],slYL,0.5),slN(G.circle(-18.4,-27.4,2.3,12),slYL,1),slN(G.circle(-18.6,-27.4,1,8),slBK,2));
  [[30,slGR],[22,slYL],[14,slRD]].forEach(([l,ci],i)=>P.push(slN(SL.dab(-9,2.4,l,104,0.34),ci,1+i*0.2)));
  for(const y of [-14,-8,-2])P.push(slN(SL.dab(-14.4,y+4,6,196,0.34),slYL,1));
  for(let i=0;i<4;i++)P.push(slN(G.circle(-6+i*4.6,12.4-i*0.6,1.25,8),slWH,1));return P;};
defMotif('wyRooster',{name:'Paper rooster',term:'kogut',figure:true,mirrorOk:true,meaning:'A cockerel cut from black glazed paper with a tail of sickle feathers, each a separate strip of colour glued on. Two of them, facing, are the centre of the Łowicz cut-out; they hung on the whitewashed wall between the windows and were changed every Easter.',
fn(){return slFit(SL.rooster(),94);}});
/* Leluja, redrawn 2026-10-13 against four Kurpie cut-outs supplied by the user (two with hens, one
   with horses and roosters, one round repeating pattern). What they share, and what the code keeps:
   the tree is a DOME. Two arched stems, one inside the other, spring from a bar at the top of the
   trunk and meet at the crown in a heart; the outer one is lined on both sides with small pointed
   leaves, the inner with leaves in pairs like hearts. A straight stem runs up the middle carrying
   drop-shaped leaves that grow as they rise and shrink again to a bud. Hens sit inside the dome and
   a larger pair stands at the foot, each one plump shape with a saw-cut tail and a cut eye and wing.
   The trunk flares to a ground strip with a tuft of grass at each end. It is one colour, cut on one
   fold, so the half is drawn and mirrored. */
const slHole=(pts,z)=>({kind:'region',closed:true,role:'detail',bg:true,plain:true,ns:true,z,pts});
SL.hen=(x,y,k,face=-1,ci=slBK)=>{const P=[],f=([a,b])=>[x-face*a*k,y+b*k],M=q=>q.map(f);
  P.push(slN(M(G.chaikin([[-8.6,-10.6],[-7,-13.2],[-4.6,-12.8],[-3.4,-9.6],[-1,-6.4],[3,-5.8],[7,-8.2],[9.4,-12],[10.6,-14],[11.4,-9],[10.2,-3.6],[7.6,-0.6],[2,0.4],[-3,0],[-6.8,-2.4],[-8.2,-6],[-7.8,-9]],true,3)),ci,1));
  P.push(slN(M([[-7.6,-12.2],[-11.2,-10.6],[-7.4,-9.4]]),ci,1));
  for(let i=0;i<5;i++){const yy=-12+i*1.9,xx=10.4+0.6*Math.sin(i*0.8);P.push(slN(M([[xx-0.8,yy-0.2],[xx+1.5,yy+1.3],[xx-0.8,yy+1.6]]),ci,1));}
  P.push(slHole(M(G.circle(-6.2,-10.8,0.75,8)),2),slHole(M(G.chain(G.bez([-2.6,-3.6],[0.6,-5.2],[4.6,-4.6],[7,-2.2],8),G.bez([7,-2.2],[4,-3],[0.6,-3],[-2.6,-3.6],8))),2));
  return P;};
defMotif('wyLeluja',{name:'Tree with birds',term:'leluja',upright:true,meaning:'The Kurpie cut-out: a sheet folded once and cut into a tree in one colour. Its crown is a dome of two arched stems lined with leaves, meeting in a heart; a stem of drop-shaped leaves runs up the middle; hens sit in the branches and a larger pair stands at the foot. It is the old tree of life, and every one is different because it is cut without a drawing.',
fn(){const H=[],ci=slBK,leaf=(x,y,ang,len,k=0.24)=>H.push(slN(SL.petal(x,y,ang,len,k),ci,0));
  // an arched stem: x = a·cos^p, y = y0 − b·sin, walked at even steps
  const arch=(a,b,p,y0)=>G.resample(Array.from({length:61},(_,i)=>{const t=i/60*Math.PI/2;return[a*Math.pow(Math.cos(t),p),y0-b*Math.sin(t)];}),false,1);
  const dirAt=(sp,i)=>{const u=sp[Math.max(0,i-1)],v=sp[Math.min(sp.length-1,i+1)];return Math.atan2(v[0]-u[0],-(v[1]-u[1]))/DEG;};
  const A=arch(38,68,0.78,21.6),Bi=arch(26.6,52,0.78,21.6);
  H.push(slN(G.band(A,1.15),ci,0),slN(G.band(Bi,1.15),ci,0));
  // outer arch: a pointed leaf to either side at every step, leaning toward the crown
  for(let i=3;i<A.length-3;i+=3.3){const j=Math.round(i),d=dirAt(A,j);leaf(A[j][0],A[j][1],d+62,5.2);leaf(A[j][0],A[j][1],d-62,4.6);}
  // inner arch: leaves in pairs on the outside, like hearts
  for(let i=4;i<Bi.length-4;i+=5.4){const j=Math.round(i),d=dirAt(Bi,j);leaf(Bi[j][0],Bi[j][1],d+44,4.4,0.27);leaf(Bi[j][0],Bi[j][1],d+104,4.4,0.27);}
  // the bar under the dome, with a row of small drops hanging from it
  H.push(slN(slRect(0,20.8,40.6,22.6),ci,0));for(let x=3.4;x<40;x+=3.9)H.push(slN(G.circle(x,23.6,1.15,8),ci,0));
  // middle stem: small round leaves below, great drops above, shrinking to the bud
  [[17,4.6,64,0.3],[12.4,5,64,0.3],[7.8,5.4,62,0.3],[-3,10.6,58,0.3],[-10.4,10.6,54,0.3],[-17.2,9,50,0.3],[-23,7,46,0.3],[-27.6,5,42,0.3]].forEach(([y,l,a,k])=>leaf(0.5,y,a,l,k));
  // a tendril that carries the upper hen, ending in a ball
  {const e=SL.end(0.4,3.6,20,112,-150);H.push(slN(SL.curl(0.4,3.6,20,112,-150,1.1),ci,0),slN(G.circle(e[0],e[1],1.5,10),ci,0));}
  // plumes above the hens
  const plume=(x,y,l,rot)=>{H.push(slN(SL.curl(x,y,l,rot,-34,0.9),ci,0));for(let k=1;k<=6;k++){const e=SL.end(x,y,l*k/6.4,rot,-34*k/6.4);leaf(e[0],e[1],e[2]+50,l*0.4*(1-k*0.07),0.12);leaf(e[0],e[1],e[2]-50,l*0.4*(1-k*0.07),0.12);}};
  plume(13.6,-13.4,13,14);plume(18.6,9.6,8,10);
  // hens: one on the tendril, one on the bar, a larger one on the ground, all facing the stem
  H.push(...SL.hen(14.6,-2.2,0.86),...SL.hen(15.6,20.9,1.02),...SL.hen(21,45.4,1.62));
  // trunk flaring to the ground strip, and a tuft of grass at its end
  H.push(slN(G.chain([[0,22],[1.2,22]],G.bez([1.2,22],[1.6,34],[4,42],[9.6,45.4],12),[[0,45.4]]),ci,0));
  H.push(slN([[0,45],[44.6,45],[46,46.6],[44.6,48.2],[46,49.8],[44.6,51.4],[0,51.4]],ci,0));
  for(let k=0;k<9;k++){const a=(-44+k*11)*DEG;H.push(slN([[39.4-0.5,45.2],[39.4+Math.sin(a)*8.6,45.2-Math.cos(a)*8.6],[39.4+0.5,45.2]],ci,0));}
  const P=slMir(H);
  P.push(slN(G.band([[0,22.6],[0,-30]],1.5),ci,0),slN(SL.petal(0,-29,0,6.4,0.36),ci,0));
  // hearts where the arches meet
  const heart=(cy,r)=>G.chaikin([[0,cy+r*1.1],[-r*0.9,cy+r*0.1],[-r,cy-r*0.6],[-r*0.5,cy-r],[0,cy-r*0.5],[r*0.5,cy-r],[r,cy-r*0.6],[r*0.9,cy+r*0.1]],true,3);
  P.push(slN(heart(-47.4,3.4),ci,0),slN(heart(-32,3),ci,0));
  return slFit(P,96);}});
defMotif('wyGwiazda',{name:'Paper star',term:'gwiozda',meaning:'The round Łowicz cut-out: a scalloped disc of black paper, and on it ring over ring of petals and flowers in red, orange, yellow and green, each layer cut smaller than the one below and pasted on.',
fn(){const P=[],sc=[];for(let i=0;i<240;i++){const a=i/240*Math.PI*2,r=44.6+2.2*Math.abs(Math.cos(a*12));sc.push([Math.cos(a)*r,Math.sin(a)*r]);}P.push(slN(sc,slBK,0));
  for(let i=0;i<16;i++){P.push(slN(SL.petal(0,0,i*22.5,41,0.19),slRD,1),slN(SL.petal(0,0,i*22.5,34,0.16),slOR,2),slN(SL.petal(0,0,i*22.5,26,0.14),slYL,3),slN(SL.petal(0,0,i*22.5+11.25,37,0.07),slGR,1.5));const d=slDir(i*22.5+11.25);P.push(slN(G.circle(d[0]*40,d[1]*40,1.5,8),slWH,2));}
  const s2=[];for(let i=0;i<120;i++){const a=i/120*Math.PI*2,r=19.4+1.5*Math.abs(Math.cos(a*8));s2.push([Math.cos(a)*r,Math.sin(a)*r]);}P.push(slN(s2,slGR,4));
  for(let i=0;i<8;i++)P.push(slN(SL.petal(0,0,i*45,17,0.34),slRD,5),slN(SL.petal(0,0,i*45,11,0.3),slYL,6),slN(SL.petal(0,0,i*45+22.5,13,0.16),slWH,5.5));
  P.push(slN(G.circle(0,0,4.6,14),slBK,7),slN(G.circle(0,0,2,10),slYL,8));return slFit(P,94);}});
defMotif('wyFlower',{name:'Paper flower',term:'kwiat',upright:true,meaning:'A layered flower on a stem with two leaves and a pair of buds, the unit of the Łowicz strip cut-outs that ran along the roof beam.',
fn(){const P=[slN(G.band([[0,48],[0,-8]],2.6),slBK,-1)];
  for(const s of [-1,1]){P.push(slN(SL.petal(0,34,s*62,27,0.3),slGR,0),slN(SL.petal(0,34,s*62,17,0.24),slYL,1),slN(SL.curl(0,18,24,s*52,s*-46,1.6),slBK,-1));const e=SL.end(0,18,24,s*52,s*-46);
    for(const a of [-26,0,26])P.push(slN(SL.petal(e[0],e[1],e[2]+a,10,0.34),a?slRD:slOR,a?0:1));}
  for(let i=0;i<8;i++)P.push(slN(SL.petal(0,-22,i*45,24,0.32),slRD,2),slN(SL.petal(0,-22,i*45,16,0.28),slOR,3),slN(SL.petal(0,-22,i*45+22.5,19,0.1),slGR,2.5));
  P.push(slN(G.circle(0,-22,6,16),slYL,4),slN(G.circle(0,-22,2.4,10),slBK,5));return slFit(P,96);}});

/* ================= pysanka ================= */
defMotif('pyStar',{name:'Eight-pointed star',term:'ruzha · zirka',meaning:'Eight lozenges about a centre: the rose, or the star, the commonest sign on a Ukrainian Easter egg and a sign of the sun. Written on the egg in wax over white, yellow and red in turn, it keeps each of those colours under the final black.',
fn(){const P=[],m=20;[[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx,sy])=>{P.push(slR([[0,0],[m,0],[2*m,m],[m,m]].map(([x,y])=>[x*sx,y*sy]),slRD,0),slR([[0,0],[0,m],[m,2*m],[m,m]].map(([x,y])=>[x*sx,y*sy]),slYL,0));
    P.push(slR([[m*1.14,m*0.28],[m*1.56,m*0.28],[m*1.56,m*0.5]].map(([x,y])=>[x*sx,y*sy]),slOR,0),slR([[m*0.28,m*1.14],[m*0.28,m*1.56],[m*0.5,m*1.56]].map(([x,y])=>[x*sx,y*sy]),slOR,0));});
  P.push(slL([[0,-47],[47,0],[0,47],[-47,0]],1,'outer',true),slR(G.circle(0,0,3.4,12),slWH,1));for(const [x,y] of [[0,-41],[41,0],[0,41],[-41,0]])P.push(slR(G.circle(x,y,1.9,8),slYL,1));return slFit(P,94);}});
defMotif('pySun',{name:'Sun',term:'sontse',meaning:'A disc with rays, the oldest and most frequent picture on the eggs: the egg was a gift for the returning sun before it was an Easter gift, and a yolk is a small sun in any case.',
fn(){const P=[slR(G.circle(0,0,15,36),slYL,1),slL(G.circle(0,0,20,40),1,'outer',true),slL(G.circle(0,0,9,24),2,'detail',true)];
  for(let i=0;i<12;i++){const a=i*30,d=slDir(a),e=slDir(a+90);P.push(slR([[d[0]*22+e[0]*5,d[1]*22+e[1]*5],[d[0]*(i%2?36:44),d[1]*(i%2?36:44)],[d[0]*22-e[0]*5,d[1]*22-e[1]*5]],i%2?slOR:slRD,0));
    const f=slDir(a+15);P.push(slR(G.circle(f[0]*31,f[1]*31,1.6,8),slWH,0));}
  for(let i=0;i<4;i++){const d=slDir(i*45);P.push(slL([[d[0]*-9,d[1]*-9],[d[0]*9,d[1]*9]],2));}return slFit(P,94);}});
defMotif('pyDeer',{name:'Deer',term:'olen',figure:true,mirrorOk:true,meaning:'A deer as Hutsul egg-writers draw it: a body of straight lines filled with a net, four stiff legs, antlers branching like a fir. It stands for health and wealth, and in the carols a deer carries the sun between its horns.',
fn(){const P=[];for(const [a,b] of [[[-12,8],[-16,36]],[[-6,8],[-4,36]],[[12,6],[9,36]],[[18,6],[22,36]]])P.push(slR(G.band([a,b],3.4),slRD,-1),slR([[b[0]-3.4,b[1]],[b[0]+2.4,b[1]],[b[0]+2.4,b[1]+3.4],[b[0]-4.6,b[1]+3.4]],slYL,-1));
  P.push(slR([[-18,-5],[16,-7],[21,7],[-14,9]],slRD,0),slR([[-18,-5],[-9,-3],[-17,-23],[-25,-20]],slRD,0),slR([[-25,-20],[-17,-24.4],[-21,-31],[-37,-22]],slRD,0),slR([[19,-7],[27,-13],[22,-1]],slYL,0));
  for(const k of [-9,0,9]){P.push(slL([[k-5,-5.6],[k+4,8]],1),slL([[k+5,-6.4],[k-4,8.4]],1));}
  P.push(slR(G.circle(-27,-24.4,1.3,8),slWH,1));
  for(const [bx,tx] of [[-22,-15],[-24,-31]]){const a=[bx,-30],b=[tx,-49];P.push(slL([a,b],1,'outer'));for(const t of [0.3,0.55,0.8]){const q=[lerp(a[0],b[0],t),lerp(a[1],b[1],t)],s=tx>-20?1:-1;P.push(slL([q,[q[0]+s*6.4*(1.1-t),q[1]-5.4]],1,'outer'),slL([q,[q[0]-s*4*(1.1-t),q[1]-5.4]],1,'outer'));}}
  return slFit(P,94);}});
defMotif('pyWheat',{name:'Ear of wheat',term:'kolos',upright:true,meaning:'An ear of grain on its stalk with the awns spread: the harvest asked for at the beginning of the year. Eggs with ears on them were buried in the first furrow.',
fn(){const P=[slL(G.bez([0,38],[3,22],[-3,6],[0,-8],10),0,'outer')];
  for(let i=0;i<6;i++){const y=-6-i*6.4;for(const s of [-1,1]){P.push(slR(SL.petal(0,y+3,s*36,16,0.3),slYL,1));const d=slDir(s*36);P.push(slL([[d[0]*16,y+3+d[1]*16],[d[0]*16+s*4,y+3+d[1]*16-11]],0));}}
  P.push(slR(SL.petal(0,-41,0,11,0.3),slYL,1),slL([[0,-52],[0,-62]],0));
  for(const s of [-1,1])P.push(slR(SL.curl(0,24,26,s*36,s*52,2.2),slGR,0));return slFit(P,96);}});
defMotif('pyPine',{name:'Fir branch',term:'sosonka',upright:true,meaning:'A stem with needles in pairs: fir, or the horsetail that comes up first in spring. Evergreen, so youth and long life; it is drawn in bands round the egg and up the faces between other signs.',
fn(){const P=[slR(G.band([[0,47],[0,-46]],2.4),slGR,0)];for(let i=0;i<10;i++){const y=38-i*8.6,l=lerp(22,8,i/9);for(const s of [-1,1])P.push(slR(G.band([[0,y],[s*l*0.74,y-l*0.74]],1.9),slGR,0));}
  P.push(slR([[-6,47],[6,47],[0,40]],slRD,1),slR(G.circle(0,-49,2.3,10),slYL,1));return slFit(P,96);}});

/* ================= cross-stitch ================= */
// cells: a function (x,y) → colour index or null over [-n,n]². Drawn as runs along each row.
SL.grid=(n,f)=>{const R=[];for(let y=-n;y<=n;y++){const row=[];for(let x=-n;x<=n;x++){const c=f(x,y);row.push(c==null?null:c);}R.push(row);}return R;};
SL.cells=(R,c,x0,y0,z=0)=>{const P=[];R.forEach((row,j)=>{let i=0;while(i<row.length){if(row[i]==null){i++;continue;}let k=i;while(k<row.length&&row[k]===row[i])k++;P.push(slN(slRect(x0+i*c,y0+j*c,x0+k*c,y0+(j+1)*c),row[i],z));i=k;}});return P;};
SL.fStar=m=>(x,y)=>{const a=Math.abs(x),b=Math.abs(y),hi=Math.max(a,b),lo=Math.min(a,b);if(!(lo<=m&&hi<=lo+m))return null;if(hi===0)return slBK;return (m>2&&(lo===0||hi===lo))?slBK:slRD;};
SL.fRhomb=n=>(x,y)=>{const a=Math.abs(x),b=Math.abs(y),d=a+b;if(d<=n){if(d>=n-1)return slRD;if(d===n-3)return slBK;if(d<=n-5)return (a%2===b%2)?slRD:null;return null;}
  if((b===n+1&&a===1)||(b===n+2&&a===2)||(a===n+1&&b===1)||(a===n+2&&b===2))return slBK;return null;};
SL.fTree=()=>{const C={},put=(x,y,c)=>{C[x+','+y]=c;C[-x+','+y]=c;},dia=(cx,cy,r)=>{for(let x=-r;x<=r;x++)for(let y=-r;y<=r;y++)if(Math.abs(x)+Math.abs(y)<=r)put(cx+x,cy+y,Math.abs(x)+Math.abs(y)===0?slBK:slRD);};
  for(let y=-9;y<=9;y++)put(0,y,slBK);dia(0,-11,2);
  [[-4,3],[1,4],[6,5]].forEach(([y,l])=>{for(let i=1;i<=l;i++){put(i,y-i,slBK);if(i%2===0)put(i+1,y-i+1,slRD);}dia(l+2,y-l-2,2);});
  for(const [y,w] of [[10,3],[11,4],[12,4],[13,3]])for(let x=0;x<=w;x++)put(x,y,y===10?slBK:slRD);put(0,12,slBK);put(2,12,slBK);
  return (x,y)=>{const c=C[x+','+y];return c==null?null:c;};};
SL.BIRD=["....kk.......","...krrk......",".kkrkrk......","...rrrr......","...rrrrr....r","..rrkrrrr..rr","..rrrkrrrrrrr","...rrrkkrrrr.","....rrrrrrr..",".....k..k....","....kk.kk...."];
const slPx=(R,size)=>{const n=Math.max(R.length,R[0].length),c=size/n;return SL.cells(R,c,-R[0].length*c/2,-R.length*c/2);};
defMotif('vyStar',{name:'Stitched star',term:'zirka · ruzha',meaning:'The eight-pointed star counted out in cross-stitch, red with black dividing lines. It is the same sign as on the eggs; on a shirt it sits on the shoulder and the cuff, where it guards the openings.',
fn(){return fitParts(slPx(SL.grid(10,SL.fStar(4)),96),94);}});
defMotif('vyRhomb',{name:'Sown field',term:'romb',meaning:'A lozenge with a chequered heart and a hook at each corner: the ploughed and sown field, and by the same thought a sign of fertility. One of the oldest figures in Slavic weaving and embroidery.',
fn(){return fitParts(slPx(SL.grid(10,SL.fRhomb(8)),96),94);}});
defMotif('vyTree',{name:'Tree of life',term:'derevo zhyttia',upright:true,meaning:'A straight stem rising from a pot, branches leaving it in pairs, a flower at every tip. It is the main figure of the ritual towel: the family, with its roots, its living branches and its flowering.',
fn(){return fitParts(slPx(SL.grid(14,SL.fTree()),96),96);}});
defMotif('vyBird',{name:'Stitched bird',term:'ptashka',figure:true,mirrorOk:true,meaning:'A small bird in profile. On a wedding towel two of them face one another across the tree, and are the couple.',
fn(){return fitParts(slPx(SL.BIRD.map(r=>[...r].map(ch=>ch==='r'?slRD:ch==='k'?slBK:null)),96),90);}});

/* ---------- borders ---------- (y = 0 is the outer edge) */
const slClamp=(P,L,t)=>P.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));
defBorder('pyTeeth',{name:'Wolves’ teeth',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.7))),w=L/n,P=[];for(let i=0;i<n;i++)P.push(slR([[i*w,t*0.06],[(i+1)*w,t*0.06],[(i+.5)*w,t*0.94]],i%2?slYL:slRD,0,'inner'));
  P.push(slL([[0,t*0.06],[L,t*0.06]],0,'outer'),slL([[0,t*0.94],[L,t*0.94]],0,'outer'));return P;}});
defBorder('pyWave',{name:'Endless line',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.5))),w=L/n,s=[],P=[];for(let i=0;i<=n*24;i++){const x=i/(n*24)*L;s.push([x,t/2+t*0.26*Math.sin(x/w*Math.PI*2)]);}
  P.push(slR(G.band(s,t*0.15),slYL,0,'inner'));for(let i=0;i<n;i++)P.push(slR(G.circle((i+0.25)*w,t*0.7,t*0.09,10),slRD,0,'inner'),slR(G.circle((i+0.75)*w,t*0.3,t*0.09,10),slRD,0,'inner'));
  P.push(slL([[0,t*0.04],[L,t*0.04]],0,'outer'),slL([[0,t*0.96],[L,t*0.96]],0,'outer'));return slClamp(P,L,t);}});
defBorder('pyLadder',{name:'Ladder',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.5))),w=L/n,P=[];for(let i=0;i<n;i++)if(i%2===0)P.push(slR(slRect(i*w,t*0.2,(i+1)*w,t*0.8),i%4?slOR:slRD,0,'inner'));else P.push(slL([[i*w,t*0.2],[(i+1)*w,t*0.8]],0),slL([[(i+1)*w,t*0.2],[i*w,t*0.8]],0));
  P.push(slL([[0,t*0.2],[L,t*0.2]],0,'outer'),slL([[0,t*0.8],[L,t*0.8]],0,'outer'));return P;}});
defBorder('ptStrokes',{name:'Stroke row',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.5))),w=L/n,P=[];for(let i=0;i<n;i++){const up=i%2===0;P.push(slN(SL.dab((i+.5)*w,up?t*0.72:t*0.28,t*0.62,up?0:180,0.3),up?slRD:slGR),slN(G.circle((i+1)*w,t/2,t*0.06,8),slYL));}return slClamp(P,L,t);}});
defBorder('khTravka',{name:'Grass',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.1))),w=L/n,P=[];for(let i=0;i<n;i++){P.push(...SL.grass((i+.5)*w,t*0.98,t*0.7,i%2?12:-12,i%2?slYL:slRD));P.push(slN(G.circle(i*w+w,t*0.8,t*0.07,8),slYL));}return slClamp(P,L,t);}});
defBorder('wyScallop',{name:'Scalloped edge',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.9))),w=L/n,P=[];for(let i=0;i<n;i++){const x=(i+.5)*w;P.push(slN(G.arc(x,t,w*0.5,180,360,14).map(([a,b])=>[a,t+(b-t)*Math.min(1,t*0.92/(w*0.5))]),slRD),slN(G.arc(x,t,w*0.32,180,360,12).map(([a,b])=>[a,t+(b-t)*Math.min(1,t*0.92/(w*0.5))]),slYL),slN(G.circle(x,t*0.86,t*0.07,8),slGR));}return slClamp(P,L,t);}});
defBorder('vyBand',{name:'Stitched band',fn(L,t){const c=t/11,n=Math.max(1,Math.round(L/(c*12))),w=L/n,P=[],A=SL.grid(4,SL.fStar(2)),B=SL.grid(4,(x,y)=>{const d=Math.abs(x)+Math.abs(y);return d===4?slBK:d===2?slRD:d===0?slBK:null;});
  for(let i=0;i<n;i++)P.push(...SL.cells(i%2?B:A,c,(i+.5)*w-4.5*c,c));for(let x=0;x+c<=L;x+=2*c)P.push(slN(slRect(x,0,x+c,c*0.9),slBK),slN(slRect(x,t-c*0.9,x+c,t),slBK));return slClamp(P,L,t);}});
defBorder('vyTeeth',{name:'Stitched zigzag',fn(L,t){const c=t/5,P=[];for(let i=0;i*c<L-c*0.5;i++){const k=i%6,h=k<3?k:5-k;P.push(slN(slRect(i*c,(3-h)*c,(i+1)*c,(4-h)*c),slRD));if(k===0)P.push(slN(slRect(i*c,0,(i+1)*c,c),slBK));}return slClamp(P,L,t);}});

/* ---------- pattern ground ---------- */
defTile('vyField',{name:'Stitched field',term:'vyshyvka',meaning:'Stars and sown fields set alternately on the counted threads of a linen ground, red with black: the sleeve of a festive shirt.',
fn(W,H,u){const c=u/8,p=24*c,P=[],A=SL.grid(10,SL.fStar(4)),B=SL.grid(10,SL.fRhomb(8));
  for(let j=-1;j*p<H+p;j++)for(let i=-1;i*p<W+p;i++){P.push(...SL.cells(((i+j)%2+2)%2?B:A,c,i*p+1.5*c,j*p+1.5*c));P.push(slN(slRect(i*p-c*0.5,j*p-c*0.5,i*p+c*0.5,j*p+c*0.5),slBK));}return P;}});

/* ---------- layouts ---------- */
const slKey=(g,want,pool='border',re=/./)=>{const p=[...new Set(poolAll(g.motifs[pool]))].filter(k=>(pool==='border'?SG.borders:SG.tiles)[k]&&re.test(k));return p.includes(want)?want:(p[0]||want);};
const slStrip=(key,x,y,L,t,flip=false)=>SG.borders[key].fn(L,t).map(p=>p.kind==='dot'?Object.assign({},p,{x:flip?x+L-p.x:x+p.x,y:flip?y+t-p.y:y+p.y}):Object.assign({},p,{pts:p.pts.map(([a,b])=>flip?[x+L-a,y+t-b]:[x+a,y+b])}));
/* Pysanka: the egg divided by belts into a face and two caps. */
defStructure('pysanka',{name:'Decorated egg',blurb:'An egg divided the way a pysanka is: a broad belt of pattern round the middle with a medallion on it, narrower belts above and below, and a sign in each cap.',
fn(ctx){
  const {W,H,g,rng}=ctx,cx=W/2,cy=H/2,a=H*0.345,b=H*0.455,egg=[];
  for(let i=0;i<140;i++){const th=i/140*Math.PI*2,s=Math.sin(th);egg.push([cx+a*Math.cos(th)*(1+0.13*s),cy+b*s]);}
  const P=[slR(egg,slBK)],keys=rng.shuffle([...new Set(poolAll(g.motifs.border))].filter(k=>SG.borders[k])),K=i=>keys.length?keys[i%keys.length]:'lines';
  const arc=(y,dip)=>{const s=[];for(let i=0;i<=40;i++){const u=i/40*2-1;s.push([cx+u*a*1.24,y+dip*(1-u*u)]);}return s;};
  const belt=(key,y,t,dip)=>{const sp=arc(y,dip),R=KO.bandParts(key,sp,()=>-t/2,()=>t,t,false).parts;P.push(...R,slL(arc(y-t/2,dip),0,'outer'),slL(arc(y+t/2,dip),0,'outer'));};
  const t0=b*0.15,t1=b*0.3;
  belt(K(0),cy-b*0.5,t0,-b*0.07);belt(K(0),cy+b*0.5+b*0.05,t0,b*0.07);belt(K(1),cy-t1*0.78,t0*0.8,-b*0.02);belt(K(1),cy+t1*0.78+b*0.05,t0*0.8,b*0.04);
  ctx.items.push({type:'parts',parts:GH.clipConvex(P,egg).concat([slL(egg,0,'outer',true)]),role:'frame',variant:'egg'});
  const hero=ctx.pick('hero'),ring=ctx.pick('ring'),rk=[...new Set(poolAll(g.motifs.ring))].filter(k=>SG.motifs[k]&&k!=='dot'),r2=rk.length>1?rk.find(k=>k!==ring)||ring:ring;
  ctx.parts([slR(G.circle(cx,cy+b*0.025,a*0.4,72),slRD),slL(G.circle(cx,cy+b*0.025,a*0.36,64),0,'detail',true)],'frame');
  ctx.motif(hero,cx,cy+b*0.025,a*0.62,{role:'hero',variant:'hero'});
  for(const s of [-1,1])ctx.motif(r2,cx+s*a*0.72,cy+b*0.03,a*0.34,{role:'ring',variant:'side',flip:s>0});
  ctx.motif(ring,cx,cy-b*0.76,a*0.36,{role:'ring',variant:'cap'});ctx.motif(ring,cx,cy+b*0.8,a*0.4,{role:'ring',variant:'cap'});
}});
/* Rushnyk: the ritual towel, embroidered at both ends and plain between. */
defStructure('rushnyk',{name:'Ritual towel',blurb:'A long linen towel worked at both ends: bands of counted pattern, then the tree of life with a bird either side, the middle left plain.',
fn(ctx){
  const {W,H,g,rng}=ctx,cx=W/2,hw=W*0.2,x0=cx-hw,x1=cx+hw,y0=34,y1=H-34,L=x1-x0,F=[{kind:'region',closed:true,role:'outer',bg:true,plain:true,pts:slRect(x0,y0,x1,y1)},slL(slRect(x0,y0,x1,y1),0,'outer',true)];
  for(let x=x0+4;x<x1;x+=7)for(const [ya,d] of [[y0,-1],[y1,1]])F.push(slL([[x,ya],[x+rng.range(-2,2),ya+d*rng.range(12,20)]],0));
  ctx.parts(F,'frame');
  const keys=[...new Set(poolAll(g.motifs.border))].filter(k=>SG.borders[k]),kA=keys.includes('vyTeeth')?'vyTeeth':(keys[0]||'lines'),kB=keys.includes('vyBand')?'vyBand':(keys[1]||keys[0]||'lines');
  const hero=ctx.pick('hero'),ring=ctx.pick('ring'),fil=ctx.pick('filler'),B=[],tA=L*0.05,tB=L*0.17,hz=L*0.6;
  for(const top of [true,false]){let y=top?y0+8:y1-8;const put=(key,t)=>{B.push(...slStrip(key,x0+6,top?y:y-t,L-12,t,top));y+=top?t+5:-t-5;};
    put(kA,tA);put(kB,tB);put(kA,tA);const yc=top?y+hz*0.5:y-hz*0.5;
    ctx.motif(hero,cx,yc,hz*0.94,{role:'hero',variant:'hero',rot:top?180:0});
    for(const s of [-1,1])ctx.motif(ring,cx+s*L*0.36,yc+(top?-1:1)*hz*0.3,L*0.19,{role:'ring',variant:'bird',flip:(s>0)!==top,rot:top?180:0});
    y+=top?hz:-hz;put(kA,tA);}
  ctx.items.push({type:'parts',parts:B,role:'border',variant:'bands'});
  if(fil!=='dot'&&SG.motifs[fil])for(const s of [-1,0,1])ctx.motif(fil,cx+s*L*0.3,H/2,L*0.16,{role:'filler',variant:'mid'});
}});
/* Bouquet: stems rising from one point, the largest flower on top, buds and berries outward. */
defStructure('bouquet',{name:'Bouquet',blurb:'A painted bouquet: stems fanning from one point at the foot, three large flowers, buds and berries at the ends of the side sprays, leaves filling the gaps, inside a border of strokes.',
fn(ctx){
  const {W,H,g,rng}=ctx,S=g.structure,r=frameBands(ctx,{x0:30,y0:30,x1:W-30,y1:H-30},clamp(Math.round(S.borderBands||1),1,2),30),w=r.x1-r.x0,h=r.y1-r.y0,cx=(r.x0+r.x1)/2,X=u=>cx+u*w,Y=v=>r.y0+v*h,base=[cx,Y(0.93)],P=[];
  const hero=ctx.pick('hero'),rk=[...new Set(poolAll(g.motifs.ring))].filter(k=>SG.motifs[k]&&k!=='dot'),pk=rng.shuffle(rk.length?rk:['floret']),fil=ctx.pick('filler'),leaf=fil==='dot'?'leaf':fil;
  const T=[[0,0.25,0.34,'h'],[-0.25,0.47,0.27,'h'],[0.25,0.47,0.27,'h'],[-0.37,0.2,0.15,0],[0.37,0.2,0.15,1],[-0.17,0.09,0.13,1],[0.17,0.09,0.13,0],[-0.4,0.7,0.15,2],[0.4,0.7,0.15,2]];
  for(const [u,v] of T){const e=[X(u),Y(v)],m=[lerp(base[0],e[0],0.08),lerp(base[1],e[1],0.8)];P.push(slN(G.ribbon(G.resample(G.quad(base,m,e,18),false,6),t=>3.2*(1-0.6*t)),slGR));}
  ctx.items.push({type:'parts',parts:P,role:'ring',variant:'stems',under:true});
  [[-0.11,0.66,-28],[0.11,0.66,28],[-0.3,0.33,-62],[0.3,0.33,62],[-0.24,0.83,-108],[0.24,0.83,108],[-0.09,0.4,-14],[0.09,0.4,14],[-0.38,0.52,-84],[0.38,0.52,84]].forEach(([u,v,a],i)=>ctx.motif(leaf,X(u),Y(v),w*(i<2?0.2:0.17),{role:'filler',variant:'leaf'+(i%2),rot:a,flip:a>0}));
  for(const [u,v,s,k] of T){if(k==='h')ctx.motif(hero,X(u),Y(v),w*s,{role:'hero',variant:'hero'});else{const key=pk[k%pk.length],M=SG.motifs[key]||{};ctx.motif(key,X(u),Y(v),w*s,{role:'ring',variant:'spray'+k,flip:u>0,rot:M.upright?0:u*60});}}
}});
/* Plate: a wavy stem round a dish, berries and leaves in its bends, grass everywhere. */
defStructure('kudrina',{name:'Painted dish',blurb:'A turned wooden dish: a gold stem waving round the well with berries in one bend and a leaf in the next, grass curling off it everywhere, and a single flower in the middle.',
fn(ctx){
  const {W,H,g,rng}=ctx,cx=W/2,cy=H/2,R=Math.min(W,H)/2-26,n=6,r0=R*0.6,amp=R*0.085,P=[slR(G.circle(cx,cy,R,120),slBK),slL(G.circle(cx,cy,R*0.965,110),0,'outer',true),slL(G.circle(cx,cy,R*0.84,100),0,'outer',true),slL(G.circle(cx,cy,R*0.32,60),0,'detail',true)];
  const key=slKey(g,'khTravka'),t=R*0.105,sp=G.circle(cx,cy,R*0.9,160);sp.push(sp[0]);P.push(...KO.bandParts(key,sp,()=>-t/2,()=>t,t,false).parts);
  const stem=[];for(let i=0;i<=240;i++){const a=i/240*Math.PI*2,rr=r0+amp*Math.sin(a*n);stem.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr]);}
  P.push(slN(G.band(stem,R*0.016).slice(0),slYL));
  for(let i=0;i<n*4;i++){const a=(i+0.5)/(n*4)*Math.PI*2,rr=r0+amp*Math.sin(a*n),x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr,out=i%2===0;P.push(...SL.grass(x,y,R*0.11,a/DEG+90+(out?0:180)+(i%4<2?-30:30),i%4<2?slRD:slYL));}
  ctx.items.push({type:'parts',parts:P,role:'frame',variant:'dish'});
  const hero=ctx.pick('hero'),ring=ctx.pick('ring'),fil=ctx.pick('filler'),lf=fil==='dot'?ring:fil;
  ctx.motif(hero,cx,cy,R*0.5,{role:'hero',variant:'hero'});
  for(let i=0;i<n;i++){const a1=(i+0.75)/n*Math.PI*2,a2=(i+0.25)/n*Math.PI*2;
    ctx.motif(ring,cx+Math.cos(a1)*R*0.665,cy+Math.sin(a1)*R*0.67,R*0.27,{role:'ring',variant:'berry',rot:a1/DEG-90});
    ctx.motif(lf,cx+Math.cos(a2)*R*0.5,cy+Math.sin(a2)*R*0.49,R*0.23,{role:'filler',variant:'leaf',rot:a2/DEG+90});}
}});
/* Wycinanka: a symmetric cut-out on white card: a star or tree above, two roosters below. */
defStructure('wycinanka',{name:'Paper cut-out',blurb:'A cut-out pasted on white card, the same left and right: a round star or a tree above, two roosters facing below, flowers in the corners, a scalloped edge.',
fn(ctx){
  const {W,H,g,rng}=ctx,r=frameBands(ctx,{x0:34,y0:34,x1:W-34,y1:H-34},1,34),w=r.x1-r.x0,h=r.y1-r.y0,cx=(r.x0+r.x1)/2;
  const hero=ctx.pick('hero'),ring=ctx.pick('ring'),fil=ctx.pick('filler'),fl=fil==='dot'?'floret':fil,M=SG.motifs[hero]||{};
  ctx.motif(hero,cx,r.y0+h*0.4,w*0.6,{role:'hero',variant:'hero'});
  for(const s of [-1,1])ctx.motif(ring,cx+s*w*0.27,r.y0+h*0.84,w*0.27,{role:'ring',variant:'pair',flip:s<0});
  ctx.motif(fl,cx,r.y0+h*0.86,w*0.2,{role:'filler',variant:'mid'});
  for(const s of [-1,1]){ctx.motif(fl,cx+s*w*0.4,r.y0+h*0.14,w*0.17,{role:'filler',variant:'corner',flip:s>0});ctx.motif(fl,cx+s*w*0.41,r.y0+h*0.5,w*0.15,{role:'filler',variant:'side',flip:s>0});}
}});
