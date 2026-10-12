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
defMotif('pcFeline',{name:'Cat',term:'—',figure:true,mirrorOk:true,meaning:'A spotted cat in profile, tail curled over its back, whiskers out: the pampas cat or the jaguar, the most constant animal in Andean art from Chavín onward.',
fn(){const P=[];
  // tail, curled forward over the back in a square hook
  P.push(...anNest([[0.2,0.44],[0.08,0.44],[0.08,0.1],[0.36,0.1],[0.36,0.3],[0.26,0.3],[0.26,0.19],[0.17,0.19],[0.17,0.36],[0.2,0.36]],[1,3],0.02));
  // body, legs with stepped paws, head with ears
  P.push(...anNest([[0.14,0.36],[0.66,0.36],[0.66,0.24],[0.7,0.24],[0.74,0.12],[0.8,0.24],[0.86,0.24],[0.92,0.12],[0.96,0.24],[0.96,0.52],[0.9,0.52],[0.9,0.6],[0.72,0.6],[0.72,0.84],[0.78,0.84],[0.78,0.92],[0.6,0.92],[0.6,0.66],[0.34,0.66],[0.34,0.84],[0.4,0.84],[0.4,0.92],[0.22,0.92],[0.22,0.64],[0.14,0.64]],[0,3,0],0.02));
  for(const [x,y] of [[0.22,0.44],[0.34,0.5],[0.46,0.43],[0.56,0.51]])P.push(anR(x,y,x+0.055,y+0.055,2));
  P.push(anR(0.76,0.32,0.83,0.39,2),anR(0.785,0.345,0.805,0.365,3),anR(0.88,0.32,0.93,0.39,2),anR(0.84,0.44,0.9,0.47,1),anP(G.band([[0.74,0.52],[0.84,0.52]],0.02),2));
  for(const y of [0.42,0.47])P.push(anP(G.band([[0.96,y],[1.02,y-0.02]],0.012),1));
  return anFit(P,96);}});
defMotif('pcBird',{name:'Bird, wings spread',term:'—',figure:true,meaning:'A bird of prey seen from below with wings and tail spread, each feather a step: the condor or the falcon, embroidered by the hundred along the borders of mantles.',
fn(){const P=[];
  for(const s of [-1,1]){const X=x=>0.5+s*x;
    // wing: five feathers stepping shorter toward the body, each banded
    for(let i=0;i<5;i++){const a=0.06,b=0.47-i*0.07,y=0.28+i*0.075,q=[[X(a),y],[X(b),y],[X(b),y+0.06],[X(a),y+0.06]];P.push(...anNest(s>0?q:q.slice().reverse(),[i%2?1:0,3],0.014));P.push(anR(Math.min(X(b-0.05),X(b-0.02)),y+0.02,Math.max(X(b-0.05),X(b-0.02)),y+0.04,2));}
    // tail feathers
    P.push(...anNest(s>0?[[X(0.01),0.68],[X(0.13),0.68],[X(0.2),0.97],[X(0.08),0.97]]:[[X(0.08),0.97],[X(0.2),0.97],[X(0.13),0.68],[X(0.01),0.68]],[1,3],0.016));
    // legs and claws
    P.push(anP(G.band([[X(0.07),0.62],[X(0.2),0.68]],0.02),2));for(const d of [-0.03,0,0.03])P.push(anP(G.band([[X(0.2),0.68],[X(0.25),0.68+d]],0.012),2));}
  P.push(...anNest([[0.44,0.22],[0.56,0.22],[0.56,0.72],[0.5,0.97],[0.44,0.72]],[0,3,0],0.018));
  P.push(...anNest([[0.41,0.07],[0.59,0.07],[0.59,0.24],[0.41,0.24]],[0,3],0.018),anP([[0.465,0.24],[0.535,0.24],[0.5,0.33]],2),anR(0.44,0.12,0.48,0.16,2),anR(0.52,0.12,0.56,0.16,2));
  for(const x of [0.43,0.5,0.57])P.push(anP([[x-0.02,0.07],[x+0.02,0.07],[x,0.01]],1));
  return anFit(P,96);}});
defMotif('pcSerpent',{name:'Two-headed serpent',term:'—',figure:true,meaning:'A zigzag body with a head at each end, tongues out. Double-headed serpents frame and trail from the larger figures on Paracas cloth, and stand for the sky’s arc, the rainbow and running water.',
fn(){const z=[[0.1,0.5],[0.22,0.5],[0.22,0.28],[0.42,0.28],[0.42,0.72],[0.62,0.72],[0.62,0.28],[0.8,0.28],[0.8,0.5],[0.9,0.5]],P=[anP(G.band(z,0.13),3),anP(G.band(z,0.085),0),anP(G.band(z,0.028),1)];
  for(const [x,d] of [[0.1,-1],[0.9,1]]){const h=d>0?[[x,0.36],[x+0.13,0.44],[x+0.13,0.56],[x,0.64]]:[[x,0.64],[x-0.13,0.56],[x-0.13,0.44],[x,0.36]];P.push(...anNest(h,[1,3,1],0.018),anR(Math.min(x+d*0.04,x+d*0.075),0.46,Math.max(x+d*0.04,x+d*0.075),0.495,2));
    P.push(anP(G.band([[x+d*0.13,0.5],[x+d*0.18,0.5]],0.016),2),anP(G.band([[x+d*0.18,0.5],[x+d*0.21,0.47]],0.012),2),anP(G.band([[x+d*0.18,0.5],[x+d*0.21,0.53]],0.012),2));}
  for(const [x,y] of [[0.32,0.28],[0.52,0.72],[0.71,0.28],[0.22,0.4],[0.42,0.5],[0.62,0.5]])P.push(anR(x-0.022,y-0.022,x+0.022,y+0.022,2));return anFit(P,96);}});
defMotif('chBird',{name:'Seabird',term:'—',figure:true,mirrorOk:true,meaning:'A crested seabird in profile, squared off by the weave: pelican, cormorant or booby. On the desert coast the birds’ guano fed the fields.',
fn(){return anFit(AN.bird([0,1,2]),90);}});
// geoglyphs: single paths
const nzLn=(pts,closed=false)=>anL(G.chaikin(pts,closed,1),'outer',closed);
defMotif('nzHummingbird',{name:'Hummingbird',term:'colibrí',figure:true,meaning:'A hummingbird nearly a hundred metres long, its beak a ruled straight line. Like every Nazca figure it is one unbroken path, made by lifting the dark stones from the pale ground beneath.',
fn(){ // one path: up the beak and back, round one wing feather by feather, the tail, the other wing
  const wing=s=>[[s*4.5,-17],[s*46,-2],[s*44,5],[s*12,-6],[s*38,9],[s*36,15],[s*10,1],[s*29,17],[s*27,23],[s*8,8],[s*19,24],[s*17,29],[s*5.5,14]];
  const tail=[[-5.5,22],[-17,47],[-11,49],[-3,27],[-4,50],[4,50],[3,27],[11,49],[17,47],[5.5,22]];
  const path=[[-1.3,-24],[-0.4,-52],[0.4,-52],[1.3,-24],[3.4,-22]].concat(wing(1),[[5.5,22]],tail.slice().reverse().slice(1),wing(-1).reverse(),[[-3.4,-22],[-1.3,-24]]);
  return fitParts([anL(path,'outer',true),anL(G.circle(0,-20.5,0.9,10),'detail',true)],98);}});
defMotif('nzSpider',{name:'Spider',term:'araña',figure:true,meaning:'A spider forty-six metres long, drawn with one line. One of its legs runs out beyond the body, which some read as the path by which the figure was entered and walked.',
fn(){const P=[anL(G.ellipse(0,14,13,18,40),'outer',true),anL(G.ellipse(0,-12,8,9,32),'outer',true),nzLn([[-3,-20],[-5,-27],[-2,-24]]),nzLn([[3,-20],[5,-27],[2,-24]])];
  for(const s of [-1,1])for(const [y0,ex,ey,kx,ky] of [[-16,34,-40,22,-34],[-12,42,-12,26,-20],[-8,42,14,28,0],[-4,34,40,22,22]])P.push(nzLn([[s*7,y0],[s*kx,ky],[s*ex,ey]]));
  return fitParts(P,94);}});
defMotif('nzMonkey',{name:'Monkey',term:'mono',figure:true,mirrorOk:true,meaning:'A monkey with a great spiral tail and, between its two hands, nine fingers. Monkeys live far away over the mountains in the forest: the figure belongs to the desert’s concern with water.',
fn(){const sp=[];for(let i=0;i<=72;i++){const t=i/72,a=(150-t*1150)*DEG,r=lerp(3,22,t);sp.push([26+Math.cos(a)*r,-22+Math.sin(a)*r]);}
  const hand=(x,y,n,a0)=>{const o=[];for(let k=0;k<n;k++){const a=(a0+(k-(n-1)/2)*24)*DEG;o.push(anL([[x,y],[x+Math.cos(a)*7,y+Math.sin(a)*7]],'outer'));}return o;};
  const P=[anL(sp,'outer')],e=sp[sp.length-1];
  // back and belly from the tail to the shoulders
  P.push(nzLn([e,[8,-6],[-8,-14],[-20,-12]]),nzLn([[10,8],[0,6],[-12,2],[-20,-2]]));
  // head with ear and muzzle
  P.push(anL(G.ellipse(-28,-12,8.5,7.5,30),'outer',true),nzLn([[-30,-19],[-33,-25],[-26,-21]]),nzLn([[-36,-10],[-41,-8],[-36,-6]]));
  // two arms reaching forward and down
  P.push(nzLn([[-20,-4],[-30,6],[-42,10]]),...hand(-42,10,4,170),nzLn([[-16,0],[-24,14],[-36,22]]),...hand(-36,22,5,160));
  // two legs
  P.push(nzLn([[4,7],[-2,22],[2,36],[-6,40]]),...hand(-6,40,3,175),nzLn([[10,8],[14,24],[12,38],[20,42]]),...hand(20,42,3,10));
  return fitParts(P,96);}});

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
