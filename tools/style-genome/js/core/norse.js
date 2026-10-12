'use strict';
/* Norse — the animal ornament of Viking Age Scandinavia.

   RIBBON ANIMALS. A beast is a band: it swells at the hip and shoulder, thins at the
   waist and neck, and runs out to a point at the tail. In the Urnes style (about
   1050–1125) one great four-legged animal sweeps round in wide loops while thin snakes
   thread figure-eights through it, biting and being bitten. Every band passes over and
   under the others in turn.

   A band here is a spine with a width that varies along it. Crossings are found and
   alternated exactly as for Islamic strapwork (GH.weave); where a band passes under, it
   is cut back by the half-width of the band above it at that point.

   RUNESTONES. An inscription runs inside the body of a serpent that follows the edge of
   the stone, head and tail tied together at the foot, with a cross or a beast in the
   middle. The band here carries the rune row itself, the futhark, which is what a good
   many real inscriptions consist of.

   RING-CHAIN (Borre style): rings linked in a row, drawn as interlaced circles.

   PICTURE STONES (Gotland): a keyhole-shaped slab in registers, a ship under sail below. */

const NO={};
const noFit=(P,s=94)=>fitParts(FL.done(P),s);
// smooth spine through control points
NO.spine=(cp,closed=false,step=1.6)=>G.resample(G.chaikin(cp,closed,4),closed,step);
/* Weave bands of varying width. bands: [{pts, closed, w:t=>halfWidth, z}] → solid parts.
   Uses GH.weave for the over/under, then cuts each band at its under-crossings. */
NO.weave=function(bands,{gap=1.1,sec=null}={}){
  const S=bands.map(b=>({pts:b.pts,closed:!!b.closed}));GH.weave(S);
  const byX={};S.forEach((s,si)=>s.cross.forEach(c=>(byX[c.x]=byX[c.x]||[]).push([si,c])));
  const out=[];
  S.forEach((s,si)=>{const b=bands[si],L=s.len,P=s.pts,n=P.length,cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
    const cuts=[];for(const c of s.cross){if(!c.under)continue;const o=byX[c.x].find(e=>e[1]!==c);if(!o)continue;const ob=bands[o[0]],ot=clamp(o[1].s/S[o[0]].len);
      const sn=Math.max(0.35,Math.abs(c.od[0]*0+1)),tx=at(c.s),cr=Math.abs(tx[0]*c.od[1]-tx[1]*c.od[0])||0.35;cuts.push([c.s-(ob.w(ot)+gap)/Math.max(0.35,cr),c.s+(ob.w(ot)+gap)/Math.max(0.35,cr)]);}
    function at(d){let i=1;while(i<n-1&&cum[i]<d)i++;const a=P[i-1],q=P[i],l=Math.hypot(q[0]-a[0],q[1]-a[1])||1;return[(q[0]-a[0])/l,(q[1]-a[1])/l];}
    cuts.sort((p,q)=>p[0]-q[0]);let a=0;const spans=[];for(const [c0,c1] of cuts){if(c0>a+0.6)spans.push([a,c0]);a=Math.max(a,c1);}if(a<L-0.6)spans.push([a,L]);
    for(const [d0,d1] of spans){const seg=[];for(let i=0;i<n;i++)if(cum[i]>=d0&&cum[i]<=d1)seg.push(P[i]);if(seg.length<2)continue;
      const rb=G.ribbon(seg,t=>Math.max(0.25,b.w(clamp((d0+t*(d1-d0))/L))));out.push(Object.assign(b.sec?flS(rb,b.z||0):flP(rb,b.z||0),{band:si}));}});
  return out;};
// width profiles
NO.taper=(w0,w1)=>t=>lerp(w0,w1,t);
NO.snakeW=w=>t=>t<0.06?w*(0.5+t/0.06*0.5):t>0.9?w*Math.max(0.12,1-(t-0.9)/0.1*0.88):w;
// a small snake head at the start of a spine: a drop pointing back along it, with an eye
NO.head=(pts,s,z=5)=>{const a=pts[0],b=pts[Math.min(pts.length-1,6)],ang=Math.atan2(a[1]-b[1],a[0]-b[0])/DEG+90;
  return[flP(G.xform(G.teardrop(s*0.62,s*1.9),{x:a[0],y:a[1],rot:ang+180}),z),flC(G.xform(G.circle(0,0,s*0.2,10),{x:a[0],y:a[1]}),z+1)];};

/* ---------- the great beast ---------- */
// a band from control points with a half-width given at each control point
NO.band=(cp,ws,o={})=>{const pts=NO.spine(cp),n=ws.length-1;return Object.assign({pts,w:t=>{const k=clamp(t)*n,i=Math.min(n-1,Math.floor(k));return lerp(ws[i],ws[i+1],k-i);}},o);};
NO.beast=function(rng){const P=[];
  // facing left: tail → haunch → waist → shoulder → neck arching back over the body → head
  const body=NO.band([[40,-12],[46,6],[36,24],[20,27],[6,17],[-6,7],[-20,-3],[-27,-20],[-16,-38],[6,-43],[24,-32],[25,-16],[13,-7]],[0.5,1.3,2.4,7.6,4.6,2.9,7,4.4,3.3,3,2.9,2.9,3.2]);
  const hind=NO.band([[17,28],[9,40],[-4,40],[-10,46],[-22,45]],[3,2.3,1.9,1.6,1.4]);
  const fore=NO.band([[-22,1],[-33,10],[-32,22],[-40,28],[-48,24]],[3,2.3,1.9,1.6,1.4]);
  // two snakes threading the loops
  const s1=NO.band([[-46,-34],[-34,-44],[-18,-30],[-6,-16],[10,-24],[36,-46],[46,-30],[34,-10],[14,2],[-2,22],[-18,30],[-36,20],[-40,4]],[1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.4,1.2,0.8,0.3],{sec:true});
  const s2=NO.band([[2,48],[20,44],[30,34],[26,14],[38,2],[48,-10],[40,-26],[26,-22]],[1.3,1.3,1.3,1.3,1.3,1.1,0.8,0.3],{sec:true});
  P.push(...NO.weave([body,hind,fore,s1,s2],{gap:1.3}));
  for(const b of [hind,fore]){const sp=b.pts,e=sp[sp.length-1],q=sp[sp.length-8],a=Math.atan2(e[1]-q[1],e[0]-q[0])/DEG;for(const d of [-30,0,30])P.push(flP(G.xform(G.petal(6.5,1.3,'pointed'),{x:e[0],y:e[1],rot:a+90+d}),1));}
  // spiral joints cut into haunch and shoulder
  for(const [x,y,r,a0] of [[19.5,26,5.6,30],[-20,-4,5,210]]){const sp=[];for(let i=0;i<=30;i++){const t=i/30,a=(a0+t*600)*DEG,rr=lerp(r,0.6,t);sp.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}P.push(heKn(sp,0.85));}
  // head: long jaw, pointed eye, curled lip, a lappet trailing behind
  const sp=body.pts,e=sp[sp.length-1],q=sp[sp.length-10],ang=Math.atan2(e[1]-q[1],e[0]-q[0])/DEG,H=pts=>G.xform(pts,{x:e[0],y:e[1],rot:ang});
  P.push(flP(H(G.chain(G.bez([-4,-3.4],[4,-8],[14,-7.4],[21,-3],12),G.bez([21,-3],[25,-1.4],[25.6,-6.4],[22,-7.4],6),G.bez([22,-7.4],[29,-8],[29,1.4],[21,2],8),G.bez([21,2],[13,3.4],[5,6.4],[-4,3.6],12))),3));
  P.push(flC(H(FL.lens(7.4,2,1.7).map(([x,y])=>[x+8.5,y-2])),4),flP(H(G.circle(8.5,-2,0.95,10)),5),heKn(H([[13,1.6],[20.4,-0.6]]),0.7));
  P.push(flP(H(G.chain(G.bez([0,-5.4],[-5,-13],[-14,-13],[-17,-7],10),G.bez([-17,-7],[-12,-9],[-6,-7.4],[-3,-3.6],8))),3));
  P.push(...NO.head(s1.pts,1.9),...NO.head(s2.pts,1.7));
  return P;};
defMotif('urnesBeast',{name:'Great beast',term:'Urnes animal',figure:true,mirrorOk:true,meaning:'A slender four-legged animal whose neck and body sweep round in open loops, bitten by and biting the thin snakes that weave through it. Carved on the portal of the stave church at Urnes in Norway about 1070 and on hundreds of Swedish runestones. It has been read as a lion, as Christ contending with evil, or as the struggle at the world’s end; nothing written at the time says which.',
fn(rng){return noFit(NO.beast(rng),96);}});
defMotif('urnesSnake',{name:'Snake knot',term:'ormslinga',mirrorOk:true,meaning:'One thin snake tied in a figure-eight, its head passing under its own body: the smallest unit of the late Viking styles, used to fill any space a larger animal leaves.',
fn(){const sp=NO.spine([[-8,-6],[-30,-34],[-44,-10],[-24,10],[0,0],[24,-10],[44,10],[30,34],[8,8],[-8,30],[-22,42]]);
  return noFit(NO.weave([{pts:sp,w:NO.snakeW(3),z:0}],{gap:1.6}).concat(NO.head(sp,3.4)),90);}});
// closed knots as woven straps of even width
defMotif('norseKnot',{name:'Ring knot',term:'—',meaning:'A looped band tied through a ring. Closed knots like this fill the lobes of trefoil brooches and the fields of Borre-style mounts.',
fn(rng,g){const loop=[];for(let i=0;i<120;i++){const a=i/120*Math.PI*2,r=27+15*Math.cos(3*a);loop.push([Math.cos(a)*r,Math.sin(a)*r]);}
  return fitParts(GH.compose([{closed:true,pts:loop},{closed:true,pts:G.circle(0,0,23,72)}],6.4,true),88);}});
defMotif('whirlDisc',{name:'Whirl disc',term:'—',meaning:'A roundel of curved spokes turning about a centre: the sun or the turning sky, on the earliest painted stones of Gotland, four centuries before the Viking Age.',
fn(){const P=[flP(G.circle(0,0,44,96),0),flC(G.circle(0,0,39.5,88),1),flP(G.circle(0,0,6,24),2)];
  for(let i=0;i<8;i++){const sp=[];for(let k=0;k<=22;k++){const t=k/22,a=(i*45+t*118)*DEG,r=lerp(6,38.6,t);sp.push([Math.cos(a)*r,Math.sin(a)*r]);}P.push(flP(G.ribbon(sp,t=>0.8+3.4*Math.sin(Math.PI*clamp(t,0.02,0.98))),2));}
  return noFit(P,92);}});
defMotif('ringCross',{name:'Ring cross',term:'—',upright:true,meaning:'An equal-armed cross with flaring arms inside a ring. Most eleventh-century runestones carry one: they were raised by Christian families, in the generations when Sweden converted.',
fn(){const arm=G.chain([[-4,-6]],G.bez([-4,-6],[-5,-22],[-9,-34],[-13,-42],8),[[13,-42]],G.bez([13,-42],[9,-34],[5,-22],[4,-6],8)),P=[];
  for(let i=0;i<4;i++)P.push(flP(G.xform(arm,{rot:i*90}),0));P.push(flP(G.circle(0,0,8,28),0),flP(G.circle(0,0,31,72),-2),flC(G.circle(0,0,26.5,64),-1));return noFit(P,90);}});
defMotif('longship',{name:'Ship under sail',term:'skeið · langskip',figure:true,mirrorOk:true,meaning:'A ship with a high curled prow and stern, a row of shields along the rail and a square sail woven in a diamond pattern. On the picture stones of Gotland it fills the lower half: the voyage of the dead, or simply the thing by which the island lived.',
fn(){const P=[];
  // hull: a long shallow curve rising to spiral stem and stern
  const keel=NO.spine([[-40,-6],[-44,6],[-38,22],[-22,30],[0,32],[22,30],[38,22],[44,6],[40,-6]],false,1);
  P.push(flP(G.ribbon(keel,t=>1.4+3.2*Math.pow(Math.sin(Math.PI*t),0.5)),0));
  for(const s of [-1,1]){const sp=[];for(let i=0;i<=26;i++){const t=i/26,a=(s>0?180:0)+s*(-t*470),r=lerp(6.5,1.2,t);sp.push([s*34+Math.cos(a*DEG)*r,-8+Math.sin(a*DEG)*r]);}P.push(flP(G.ribbon(sp,t=>1.5-0.8*t),0));}
  // shields along the rail
  for(let i=0;i<7;i++){const x=-27+i*9;P.push(flP(G.circle(x,22.5-Math.abs(x)*0.06,4.1,22),2),flC(G.circle(x,22.5-Math.abs(x)*0.06,1.2,10),3));}
  // mast, yard and a sail of diamonds
  P.push(flP(G.band([[0,26],[0,-46]],1.5),0),flP(G.band([[-27,-40],[27,-40]],1.6),0));
  const sail=[[-25,-38],[25,-38],[22,8],[-22,8]];P.push(flP(sail,0),flC(GH.inset(sail,1.4),1));
  for(let k=-6;k<=6;k++){const a=[k*8-30,-38],b=[k*8+16,8],c=[k*8+30,-38],d=[k*8-16,8];for(const [p,q] of [[a,b],[c,d]]){const r=clipSeg([p,q],{x0:-21.6,y0:-36.6,x1:21.6,y1:6.6});if(r)P.push(flP(G.band(r,0.75),2));}}
  // stays and steering oar
  P.push(flP(G.band([[0,-45],[-36,-4]],0.5),0),flP(G.band([[0,-45],[36,-4]],0.5),0),flP(G.band([[34,18],[41,38]],1.5),0),flP(G.xform(G.petal(9,2.6,'round'),{x:41,y:38,rot:162}),0));
  // waves
  for(let i=0;i<5;i++){const x=-40+i*20;P.push(flP(G.ribbon(G.resample(G.bez([x,40],[x+6,35],[x+12,35],[x+18,40],10),false,1),t=>0.4+0.9*Math.sin(Math.PI*t)),0));}
  return noFit(P,96);}});

/* ---------- runes ---------- */
// younger futhark, long-branch forms: strokes in a box 0..1 wide (stave at x = 0.3), 0..1 tall
NO.RUNES={f:[[[.3,1],[.3,0]],[[.3,.55],[.72,.22]],[[.3,.3],[.72,0]]],u:[[[.25,1],[.25,0],[.7,.42],[.7,1]]],th:[[[.3,1],[.3,0]],[[.3,.24],[.66,.5],[.3,.76]]],
  a2:[[[.3,1],[.3,0]],[[.06,.2],[.58,.46]],[[.06,.44],[.58,.7]]],r:[[[.3,1],[.3,0],[.68,.25],[.3,.5],[.7,1]]],k:[[[.3,1],[.3,0]],[[.3,.52],[.7,.1]]],
  h:[[[.3,1],[.3,0]],[[.06,.32],[.54,.68]],[[.54,.32],[.06,.68]]],n:[[[.3,1],[.3,0]],[[.08,.4],[.52,.6]]],i:[[[.3,1],[.3,0]]],a:[[[.3,1],[.3,0]],[[.08,.6],[.52,.4]]],
  s:[[[.6,0],[.6,.42],[.3,.58],[.3,1]]],t:[[[.3,1],[.3,0]],[[.04,.3],[.3,0],[.56,.3]]],b:[[[.3,1],[.3,0],[.62,.25],[.3,.5],[.62,.75],[.3,1]]],
  m:[[[.3,1],[.3,0]],[[.04,0],[.3,.36],[.56,0]]],l:[[[.3,1],[.3,0],[.62,.3]]],R:[[[.3,0],[.3,1]],[[.04,1],[.3,.64],[.56,1]]]};
NO.FUTHARK=['f','u','th','a2','r','k','h','n','i','a','s','t','b','m','l','R'];
defBorder('runeBand',{name:'Rune band',fn(L,t){const P=[{kind:'line',role:'outer',pts:[[0,t*0.04],[L,t*0.04]]},{kind:'line',role:'outer',pts:[[0,t*0.96],[L,t*0.96]]}],h=t*0.66,w=h*0.74,n=Math.max(1,Math.floor(L/w)),sw=L/n;
  for(let i=0;i<n;i++){const x=i*sw+sw*0.18,k=i%(NO.FUTHARK.length+1);
    if(k===NO.FUTHARK.length){for(const [a,b] of [[[.1,.36],[.5,.64]],[[.5,.36],[.1,.64]]])P.push({kind:'line',role:'inner',pts:[[x+a[0]*w,t*0.17+a[1]*h],[x+b[0]*w,t*0.17+b[1]*h]]});continue;}
    for(const st of NO.RUNES[NO.FUTHARK[k]])P.push({kind:'line',role:'inner',pts:st.map(([a,b])=>[x+a*w,t*0.17+b*h])});}
  return P;}});
defMotif('runeRow',{name:'Rune row',term:'fuþąrk',upright:true,meaning:'The sixteen runes of the Viking Age in their fixed order, named for the first six: f, u, þ, ą, r, k. Many inscriptions on stones, tools and church walls consist of the row and nothing else.',
fn(){const P=[];NO.FUTHARK.forEach((k,i)=>{const x=-46+(i%8)*11.6,y=i<8?-24:6;for(const st of NO.RUNES[k])P.push({kind:'line',role:'outer',pts:st.map(([a,b])=>[x+a*9,y+b*18])});});
  P.push({kind:'line',role:'inner',pts:[[-48,-30],[48,-30]]},{kind:'line',role:'inner',pts:[[-48,0],[48,0]]},{kind:'line',role:'inner',pts:[[-48,30],[48,30]]});return fitParts(P,94);}});
defBorder('ringChain',{name:'Ring-chain',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.62))),w=L/n,r=t*0.36,lines=[];
  for(let i=0;i<n;i++)lines.push({closed:true,pts:G.circle((i+0.5)*w,t/2,r,40)});
  const z=[];for(let i=-1;i<=n*8+1;i++){const x=i/(n*8)*L;z.push([x,t/2+t*0.2*Math.sin(x/w*Math.PI)]);}lines.push({closed:false,pts:z});
  return clipPartsRect(GH.compose(lines,t*0.12,true,q=>q,()=>0),{x0:0,y0:0,x1:L,y1:t});}});
defBorder('snakeBand',{name:'Snake band',fn(L,t){const n=Math.max(1,Math.round(L/(t*2.6))),w=L/n,P=[];
  for(let i=0;i<n;i++){const x=i*w,a=NO.spine([[x+w*0.04,t*0.5],[x+w*0.22,t*0.12],[x+w*0.5,t*0.5],[x+w*0.78,t*0.88],[x+w*0.96,t*0.5]]),b=NO.spine([[x+w*0.96,t*0.3],[x+w*0.78,t*0.14],[x+w*0.5,t*0.5],[x+w*0.22,t*0.86],[x+w*0.06,t*0.72]]);
    P.push(...NO.weave([{pts:a,w:NO.snakeW(t*0.085)},{pts:b,w:NO.snakeW(t*0.06),sec:true}],{gap:t*0.03}),...NO.head(a,t*0.1),...NO.head(b,t*0.08));}
  return FL.done(P).map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));}});

/* ---------- layouts ---------- */
const noStone=(cx,cy,w,h,rng,k=0.06)=>{const p=[];for(let i=0;i<40;i++){const a=i/40*Math.PI*2,sx=Math.pow(Math.abs(Math.cos(a)),0.72)*Math.sign(Math.cos(a)),sy=Math.pow(Math.abs(Math.sin(a)),0.8)*Math.sign(Math.sin(a));
    const top=Math.sin(a)<0?1-0.16*Math.pow(-Math.sin(a),2):1;p.push([cx+sx*w/2*top*(1+rng.range(-k,k)),cy+sy*h/2*(1+rng.range(-k*0.5,k*0.5))]);}return G.chaikin(p,true,3);};
/* Runestone: a standing boulder. A serpent's body runs just inside its edge and carries
   the inscription; head and tail cross at the foot; a cross or a beast stands in the middle. */
defStructure('runestone',{name:'Runestone',blurb:'A standing stone: a serpent band carrying runes runs round inside the edge, its head and tail crossing at the foot, with a cross or a beast in the middle.',
fn(ctx){
  const {W,H,g,rng}=ctx;FL.use(g);const cx=W/2,cy=H/2+6,sw=W*rng.range(0.66,0.76),sh=H*0.9,stone=noStone(cx,cy,sw,sh,rng);
  ctx.parts([{kind:'region',closed:true,role:'outer',plain:true,ci:3,pts:stone},{kind:'line',closed:true,role:'outer',pts:stone}],'frame');
  // the band: up the left side, over the top, down the right
  const bw=sw*0.085,inset=G.resample(G.offset(stone,-(bw*0.5+sw*0.035),true),true,3),n=inset.length;
  // start at the bottom, a little left of centre, and run clockwise round to a little right of centre
  let ib=0;for(let i=0;i<n;i++)if(inset[i][1]>inset[ib][1])ib=i;
  const dir=inset[(ib+3)%n][0]<inset[ib][0]?1:-1,loop=[];for(let k=Math.round(n*0.045);k<n-Math.round(n*0.045);k++)loop.push(inset[((ib+dir*k)%n+n)%n]);
  const a=loop[0],b=loop[loop.length-1];
  // the two ends turn inward and cross each other
  const sA=a[0]<cx?-1:1;
  const spine=G.resample(G.chaikin([[cx-sA*bw*2.6,a[1]-bw*4.6],[cx-sA*bw*0.9,a[1]-bw*2.2]].concat(loop,[[cx+sA*bw*0.9,b[1]-bw*2.2],[cx+sA*bw*2.8,b[1]-bw*5]]),false,2),false,2.5);
  const L=G.length(spine,false),tw=u=>u<0.035?lerp(0.45,1,u/0.035):u>0.9?lerp(1,0.12,(u-0.9)/0.1):1;
  const band=KO.bandParts('runeBand',G.sub(spine,false,0.07,0.9),()=>-bw/2,()=>bw,bw).parts;
  ctx.items.push({type:'parts',parts:FL.done(NO.weave([{pts:spine,w:u=>bw/2*tw(u)+1.2,z:0}],{gap:2.4}).map(p=>Object.assign(p,{ns:true}))),role:'ring',variant:'serpent'});
  ctx.items.push({type:'parts',parts:NO.weave([{pts:spine,w:u=>Math.max(0.5,bw/2*tw(u)-1.2),z:0}],{gap:4.8}).map(p=>({kind:'region',closed:true,role:'inner',bg:true,ns:true,plain:true,pts:p.pts})),role:'ring',variant:'serpentIn'});
  ctx.items.push({type:'parts',parts:band,role:'ring',variant:'runes'});
  // head: a drop with an eye, at the start of the spine
  const h0=spine[0],h1=spine[8],ha=Math.atan2(h0[1]-h1[1],h0[0]-h1[0])/DEG+90;
  ctx.parts([flP(G.xform(G.teardrop(bw*0.5,bw*1.5),{x:h0[0],y:h0[1],rot:ha+180}),0),flC(G.circle(h0[0],h0[1],bw*0.13,12),1)],'ring');
  const hero=ctx.pick('hero'),M=SG.motifs[hero]||{};
  ctx.motif(hero,cx,cy-sh*0.03,Math.min(sw*0.58,sh*0.5)*(M.fine?1.12:1),{role:'hero',variant:'hero'});
}});
/* Picture stone: a keyhole-shaped slab — a broad rounded head on a narrower neck — with
   a plaited edge, divided into registers: a scene or a disc above, a ship below. */
defStructure('pictureStone',{name:'Picture stone',blurb:'A keyhole-shaped slab with a plaited edge, in registers: a disc or a scene in the rounded head, a ship under sail below.',
fn(ctx){
  const {W,H,g,rng}=ctx;FL.use(g);const cx=W/2,y0=40,y1=H-36,hw=W*0.33,nw=W*0.27,bw2=W*0.36,hr=y0+hw;
  const half=G.chain(G.arc(cx,hr,hw,-90,58,30),G.bez([cx+hw*Math.cos(58*DEG),hr+hw*Math.sin(58*DEG)],[cx+nw,hr+hw*1.25],[cx+nw*0.96,y0+(y1-y0)*0.62],[cx+bw2,y1],22));
  const left=half.map(([x,y])=>[2*cx-x,y]),stone=half.concat(left.slice(1).reverse());
  // the wall behind the slab is painted out in the ink colour, as for a pot
  ctx.items.push({type:'parts',parts:[flP(G.chain([[W+20,-20],[cx,-20]],half,[[cx,y1],[cx,H+20],[W+20,H+20]]),0),flP(G.chain([[-20,-20],[cx,-20]],left,[[cx,y1],[cx,H+20],[-20,H+20]]),0),heKn(stone,2,true)],role:'frame',variant:'wall',under:true});
  // plaited edge, bent along the outline
  const bw=W*0.04,sp=G.resample(G.offset(stone,-bw*0.75,true),true,4),bk=[...new Set(poolAll(g.motifs.border))].filter(k=>SG.borders[k]&&!/rune|lines/.test(k)),key=bk.includes('plait')?'plait':(bk[0]||'plait');
  let i0=0;for(let i=0;i<sp.length;i++)if(sp[i][1]>sp[i0][1]-1&&sp[i][0]<sp[i0][0])i0=i;
  const open=sp.slice(i0).concat(sp.slice(0,i0)),edge=open.filter(q=>q[1]<y1-bw*1.6);
  ctx.items.push({type:'parts',parts:KO.bandParts(key,edge,()=>-bw/2,()=>bw,bw).parts,role:'border',variant:'edge'});
  const inner=G.offset(stone,-bw*1.7,true),xAt=y=>{let m=0;for(const q of inner)if(Math.abs(q[1]-y)<14)m=Math.max(m,Math.abs(q[0]-cx));return m||nw;};
  // registers
  const yA=hr+hw*0.5,yB=y0+(y1-y0)*0.58,P=[];
  for(const y of [yA,yB]){const x=xAt(y);P.push({kind:'line',role:'outer',pts:[[cx-x,y],[cx+x,y]]},{kind:'line',role:'inner',pts:[[cx-x,y+7],[cx+x,y+7]]});}
  ctx.parts(P,'frame');
  const hero=ctx.pick('hero'),ring=ctx.pick('ring'),M=SG.motifs[hero]||{};
  const ship=poolAll(g.motifs.hero).includes('longship')?'longship':hero,top=hero==='longship'?ring:hero;
  ctx.motif(top,cx,(y0+bw*2+yA)/2,Math.min(hw*1.25,(yA-y0)*0.74),{role:'hero',variant:'top'});
  ctx.motif(ring,cx-xAt((yA+yB)/2)*0.48,(yA+yB)/2+4,Math.min((yB-yA)*0.72,xAt((yA+yB)/2)*0.8),{role:'ring',variant:'mid'});
  ctx.motif(ring,cx+xAt((yA+yB)/2)*0.48,(yA+yB)/2+4,Math.min((yB-yA)*0.72,xAt((yA+yB)/2)*0.8),{role:'ring',flip:true,variant:'mid'});
  ctx.motif(ship,cx,(yB+y1)/2-4,Math.min((y1-yB)*0.86,xAt((yB+y1)/2)*1.8),{role:'hero',variant:'ship'});
}});
