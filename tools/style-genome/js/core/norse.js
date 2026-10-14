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
NO.weave=function(bands,{gap=1.1}={}){
  /* Each band is cut at its under-crossings, and each cut end is trimmed along the band's own two
     edges to the edge of the band above (its half-width there, plus the gap), so ends follow the
     curve of what they pass under instead of being sawn off square. */
  const S=bands.map(b=>({pts:b.pts,closed:false}));GH.weave(S);
  const byX={};S.forEach((s,si)=>s.cross.forEach(c=>(byX[c.x]=byX[c.x]||[]).push([si,c])));
  const M=S.map((s,si)=>{const P=s.pts,n=P.length,cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));const L=cum[n-1]||1,b=bands[si],eL=[],eR=[];
    for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],c=P[Math.min(n-1,i+1)],l=Math.hypot(c[0]-a[0],c[1]-a[1])||1,nx=-(c[1]-a[1])/l,ny=(c[0]-a[0])/l,w=Math.max(0.2,b.w(cum[i]/L));eL.push([P[i][0]+nx*w,P[i][1]+ny*w]);eR.push([P[i][0]-nx*w,P[i][1]-ny*w]);}
    return{P,n,cum,L,eL,eR};});
  const dist=(q,W)=>{let m=1e18;for(let i=0;i<W.length-1;i++){const a=W[i],b=W[i+1],dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy||1e-9;let t=((q[0]-a[0])*dx+(q[1]-a[1])*dy)/l;t=t<0?0:t>1?1:t;const x=a[0]+dx*t-q[0],y=a[1]+dy*t-q[1],d=x*x+y*y;if(d<m)m=d;}return Math.sqrt(m);};
  const over=c=>{const o=byX[c.x].find(e=>e[1]!==c),m=M[o[0]],hc=bands[o[0]].w(clamp(o[1].s/m.L))+gap,W=[];for(let i=0;i<m.n;i++)if(Math.abs(m.cum[i]-o[1].s)<hc*3+3)W.push(m.P[i]);return{W,hc};};
  const trim=(E,O)=>{if(!O||O.W.length<2)return E;let i=0;while(i<E.length&&dist(E[i],O.W)<O.hc)i++;if(i===0||i>=E.length)return i>=E.length?[]:E;let a=E[i-1],b=E[i];for(let k=0;k<11;k++){const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];if(dist(m,O.W)<O.hc)a=m;else b=m;}return[b].concat(E.slice(i));};
  const out=[];
  S.forEach((s,si)=>{const m=M[si],b=bands[si],U=s.cross.filter(c=>c.under).sort((p,q)=>p.s-q.s),B=[{s:0,c:null}].concat(U.map(c=>({s:c.s,c})),[{s:m.L,c:null}]);
    for(let k=0;k<B.length-1;k++){const s0=B[k].s,s1=B[k+1].s;if(s1-s0<0.8)continue;const idx=[];for(let i=0;i<m.n;i++)if(m.cum[i]>=s0-1e-6&&m.cum[i]<=s1+1e-6)idx.push(i);if(idx.length<2)continue;
      const O0=B[k].c?over(B[k].c):null,O1=B[k+1].c?over(B[k+1].c):null;
      const Lf=trim(trim(idx.map(i=>m.eL[i]),O0).reverse(),O1).reverse(),Rt=trim(trim(idx.map(i=>m.eR[i]),O0).reverse(),O1).reverse();
      if(Lf.length<2||Rt.length<2)continue;const poly=Lf.concat(Rt.reverse());out.push(Object.assign(b.sec?flS(poly,b.z||0):flP(poly,b.z||0),{band:si}));}});
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
/* The great beast, redrawn 2026-10-13 against three reference drawings supplied by the user.
   What makes an Urnes line look right is that it is never a freehand wobble: every band is a
   chain of circular ARCS, each leaving the last on its tangent, so loops are round, curves are
   taut, and a band can only swell, thin or end in a curl. NO.arcs builds a spine that way, like
   a compass walked along the band: [radius, sweep] turns right for a positive radius and left
   for a negative one; [0, length] goes straight. */
NO.arcs=(start,heading,segs,step=1.1)=>{let [x,y]=start,h=heading;const P=[[x,y]];
  for(const [r,sw] of segs){if(!r){const n=Math.max(1,Math.round(sw/step));for(let i=1;i<=n;i++)P.push([x+Math.cos(h*DEG)*sw*i/n,y+Math.sin(h*DEG)*sw*i/n]);x+=Math.cos(h*DEG)*sw;y+=Math.sin(h*DEG)*sw;continue;}
    const R=Math.abs(r),s=r>0?1:-1,cx=x-s*R*Math.sin(h*DEG),cy=y+s*R*Math.cos(h*DEG),n=Math.max(2,Math.round(R*Math.abs(sw)*DEG/step));
    for(let i=1;i<=n;i++){const a=(h+s*sw*i/n)*DEG;P.push([cx+s*R*Math.sin(a),cy-s*R*Math.cos(a)]);}h+=s*sw;x=P[P.length-1][0];y=P[P.length-1][1];}
  return{pts:P,end:[x,y],heading:h};};
// a band on an arc spine, its half-width set at even stations along the length
NO.arcBand=(start,heading,segs,ws,o={})=>{const A=NO.arcs(start,heading,segs),n=ws.length-1;return Object.assign({pts:A.pts,end:A.end,heading:A.heading,w:t=>{const k=clamp(t)*n,i=Math.min(n-1,Math.floor(k));return lerp(ws[i],ws[i+1],k-i);}},o);};
NO.at=(b,t)=>{const i=Math.round(clamp(t)*(b.pts.length-1)),a=b.pts[Math.max(0,i-1)],c=b.pts[Math.min(b.pts.length-1,i+1)];return{p:b.pts[i],h:Math.atan2(c[1]-a[1],c[0]-a[0])/DEG};};
NO.beast=function(rng){const P=[];
  /* Second composition, 2026-10-13, after looking again at the three references. The carved beasts
     share a plan that the first attempt missed: the body is an S laid so that it crosses the field
     three times, nearly level each time (neck and back, belly, hind leg), swelling at the two turns,
     which are the shoulder and the hip; and the thin snake does not circle it but runs UP AND DOWN
     through those three passes in tall narrow loops, so the crossings are square and the open spaces
     are a lattice. The beast is five or six times as wide as the snake. */
  const body=NO.arcBand([34,-42],100,[[16,65],[80,16],[-13,190],[90,20],[14,170],[-100,20]],[1.7,2.7,4.4,6.2,6,5.2,5.6,6.6,5.2,3.2,1.9]);
  const sh=NO.at(body,0.315),hp=NO.at(body,0.69);
  // foreleg: leaves the shoulder on its tangent and hangs to the ground, bowed a little
  const fore=NO.arcBand(sh.p,sh.h,[[0,8],[60,16],[-46,34]],[3.4,2.6,2.1,1.8,1.5]);
  // tail: a tendril off the back of the hip, wound into a curl outside the loop
  const tail=NO.arcBand(hp.p,hp.h+180,[[0,15],[6.4,200],[2.8,230]],[2.2,1.7,1.4,1.2,1,0.8,0.5]);
  // the snake: down, up and down again through all three passes, then a curl
  const sn=NO.arcBand([-1,-44.6],8,[[5.5,92],[-230,20],[-5.5,160],[-230,19.5],[4.5,180],[230,19.5],[-5,200],[-2.4,230]],[1.6,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.2,1.1,0.9,0.5],{sec:true});
  // crest: a lappet from the back of the head, curling over the neck
  const lap=NO.arcBand([33,-45],-120,[[0,3],[-12,50],[5,200],[2.3,220]],[1.5,1.3,1.1,0.9,0.7,0.5]);
  P.push(...NO.weave([body,fore,tail,lap,sn],{gap:1.25}));
  // feet: a heel and two long toes, the upper one hooked
  for(const b of [fore,body]){const e=b.end,a=b.heading;for(const [d,l,k] of [[-24,9,1],[14,8,0.8]]){const t=NO.arcs(e,a+d,[[0,2],[k>0.9?-9:8,l*5]]).pts;P.push(flP(G.ribbon(t,u=>1.5*(1-0.85*u)),1));}
    P.push(flP(G.xform(G.petal(4,1.3,'pointed'),{x:e[0],y:e[1],rot:a-90+180}),1));}
  // spiral joints, cut into shoulder and hip
  for(const [q,r,dir] of [[sh.p,4.8,1],[hp.p,5.2,-1]]){const sp=[];for(let i=0;i<=34;i++){const t=i/34,a=(dir*t*640+40)*DEG,rr=lerp(r,0.5,t);sp.push([q[0]+Math.cos(a)*rr,q[1]+Math.sin(a)*rr]);}P.push(heKn(sp,0.8));}
  // head: long and narrow, set level on the neck. One contour: crown, the upper lip curled up,
  // the mouth a little open, the lower lip curled down, the jaw. The eye is a long drop that fills it.
  const H=pts=>G.xform(pts,{x:33.4,y:-42,rot:-12,s:1.18});
  P.push(flP(H(G.chain(G.bez([-1,-3],[4,-6.4],[13,-7],[20,-4.6],12),G.bez([20,-4.6],[23,-3.6],[25,-4.4],[27,-7.4],8),G.bez([27,-7.4],[28.6,-4],[27,-1.4],[23,-0.8],8),[[19,-0.2],[23,0.9]],G.bez([23,0.9],[26,1.6],[27.4,3.6],[26.4,6.4],8),G.bez([26.4,6.4],[24,4.4],[21,3.8],[17,3.8],8),G.bez([17,3.8],[10,4.2],[4,4.6],[-1,3],10))),3));
  P.push(flC(H(G.chain(G.bez([3,-1.2],[4.4,-5],[11,-5.4],[18.6,-2.6],10),G.bez([18.6,-2.6],[11,0.8],[5,1.6],[3,-1.2],10)).slice(0,-1)),4),flP(H(G.ellipse(8,-1.9,1.5,1.2,10)),5));
  P.push(heKn(H([[12,2.2],[18.4,1.4]]),0.7));
  // ear: a small leaf behind the eye
  P.push(flP(H(G.chain(G.bez([1,-4.4],[-3,-8.6],[-8,-9.6],[-11,-7],8),G.bez([-11,-7],[-7,-6],[-3,-4],[0,-2],8))),3));
  // snake head: a small pointed lobe with an eye, biting
  {const a=NO.at(sn,0);P.push(flP(G.xform(G.chaikin([[0,-1.7],[4,-2.9],[9,-1.2],[10.4,0.4],[7.6,1.3],[4,2.6],[0,1.7]],true,2),{x:a.p[0],y:a.p[1],rot:a.h+180}),5),flC(G.xform(G.circle(4.8,-0.5,0.8,8),{x:a.p[0],y:a.p[1],rot:a.h+180}),6));}
  return P;};
defMotif('urnesBeast',{name:'Great beast',term:'Urnes animal',figure:true,mirrorOk:true,meaning:'A slender four-legged animal whose neck and body sweep round in open loops, bitten by and biting the thin snakes that weave through it. Carved on the portal of the stave church at Urnes in Norway about 1070 and on hundreds of Swedish runestones. It has been read as a lion, as Christ contending with evil, or as the struggle at the world’s end; nothing written at the time says which.',
fn(rng){return noFit(NO.beast(rng),96);}});
defMotif('urnesSnake',{name:'Snake knot',term:'ormslinga',mirrorOk:true,meaning:'One thin snake tied in a figure-eight, its head passing under its own body: the smallest unit of the late Viking styles, used to fill any space a larger animal leaves.',
fn(){const b=NO.arcBand([8,-10],-150,[[19,262],[0,14],[-19,262],[0,6],[5,300]],[2.2,3,3.2,3.2,3.2,3.2,3.1,2.8,2.2,1.5,0.8]);
  const a=NO.at(b,0),P=NO.weave([b],{gap:1.5});
  P.push(flP(G.xform(G.chaikin([[0,-3],[6,-4.6],[13,-2],[15,0.6],[11,2.2],[6,4],[0,3]],true,2),{x:a.p[0],y:a.p[1],rot:a.h+180}),5),flC(G.xform(G.circle(7,-0.6,1.2,10),{x:a.p[0],y:a.p[1],rot:a.h+180}),6));
  return noFit(P,90);}});
// closed knots as woven straps of even width
defMotif('norseKnot',{name:'Ring knot',term:'—',meaning:'A looped band tied through a ring. Closed knots like this fill the lobes of trefoil brooches and the fields of Borre-style mounts.',
fn(rng,g){const loop=[];for(let i=0;i<121;i++){const a=i/121*Math.PI*2,r=27+15*Math.cos(3*a);loop.push([Math.cos(a)*r,Math.sin(a)*r]);}
  return fitParts(weaveCurves([{closed:true,pts:loop},{closed:true,pts:G.circle(0,0,23,90)}],6.4,SG.knock?2:0).map(p=>Object.assign(p,{strap:true,role:'inner'})),88);}});
const noC=(pts,z=0)=>({kind:'region',closed:true,role:'outer',ci:0,plain:true,ns:true,z,pts});
defMotif('whirlDisc',{name:'Whirl disc',term:'—',meaning:'A roundel of curved spokes turning about a centre: the sun or the turning sky, on the earliest painted stones of Gotland, four centuries before the Viking Age.',
fn(){const P=[noC(G.circle(0,0,44,96),0),flC(G.circle(0,0,39.5,88),1),noC(G.circle(0,0,6,24),2)];
  for(let i=0;i<8;i++){const sp=[];for(let k=0;k<=22;k++){const t=k/22,a=(i*45+t*118)*DEG,r=lerp(6,38.6,t);sp.push([Math.cos(a)*r,Math.sin(a)*r]);}P.push(noC(G.ribbon(sp,t=>0.8+3.4*Math.sin(Math.PI*clamp(t,0.02,0.98))),2));}
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
  const bw=sw*0.085,kI=1-(bw*0.5+sw*0.035)/(sw*0.47),inset=G.resample(stone.map(([x,y])=>[cx+(x-cx)*kI,cy+(y-cy)*(1-(1-kI)*sw/sh)]),true,3),n=inset.length; // scaled toward the centre, not offset: an offset folds over itself in a hollow of the outline
  // start at the bottom, a little left of centre, and run clockwise round to a little right of centre
  let ib=0;for(let i=0;i<n;i++)if(inset[i][1]>inset[ib][1])ib=i;
  const dir=inset[(ib+3)%n][0]<inset[ib][0]?1:-1,loop=[];for(let k=Math.round(n*0.045);k<n-Math.round(n*0.045);k++)loop.push(inset[((ib+dir*k)%n+n)%n]);
  const a=loop[0],b=loop[loop.length-1];
  // the two ends turn inward and cross each other
  const sA=a[0]<cx?-1:1;
  // each end crosses the other at the foot, rises, and hooks back toward the middle
  const spine=G.resample(G.chaikin([[cx-sA*bw*0.7,a[1]-bw*2.9],[cx-sA*bw*1.9,a[1]-bw*2.7],[cx-sA*bw*2.1,a[1]-bw*1.9],[cx-sA*bw*0.8,a[1]-bw*1.2]].concat(loop,[[cx+sA*bw*0.8,b[1]-bw*1.2],[cx+sA*bw*2.2,b[1]-bw*2.0],[cx+sA*bw*2.1,b[1]-bw*3.0],[cx+sA*bw*1.2,b[1]-bw*3.4],[cx+sA*bw*0.8,b[1]-bw*2.9]]),false,3),false,2.5);
  const L=G.length(spine,false),tw=u=>u<0.05?lerp(0.6,1,u/0.05):u>0.87?lerp(1,0.1,(u-0.87)/0.13):1;
  const band=KO.bandParts('runeBand',G.sub(spine,false,0.12,0.86),()=>-bw/2,()=>bw,bw).parts;
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
  const yA=hr+hw*0.46,yB=yA+(y1-y0)*0.115,P=[];
  for(const y of [yA,yB]){const x=xAt(y);P.push({kind:'line',role:'outer',pts:[[cx-x,y],[cx+x,y]]},{kind:'line',role:'inner',pts:[[cx-x,y+7],[cx+x,y+7]]});}
  ctx.parts(P,'frame');
  const hero=ctx.pick('hero'),ring=ctx.pick('ring'),M=SG.motifs[hero]||{};
  const ship=poolAll(g.motifs.hero).includes('longship')?'longship':hero,top=hero==='longship'?ring:hero;
  ctx.motif(top,cx,(y0+bw*2+yA)/2,Math.min(hw*1.25,(yA-y0)*0.74),{role:'hero',variant:'top'});
  for(const k of [-1,0,1])ctx.motif(ring,cx+k*xAt((yA+yB)/2)*0.6,(yA+yB)/2+4,Math.min((yB-yA)*0.8,xAt((yA+yB)/2)*0.56),{role:'ring',flip:k>0,variant:'mid'});
  ctx.motif(ship,cx,(yB+y1)/2-4,Math.min((y1-yB)*0.86,xAt((yB+y1)/2)*1.8),{role:'hero',variant:'ship'});
}});
