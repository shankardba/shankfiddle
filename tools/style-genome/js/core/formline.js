'use strict';
/* Formline — the two-dimensional design system of the northern Northwest Coast, as set
   out by Bill Holm (1965) from the work of Haida, Tlingit, Tsimshian and Heiltsuk artists.

   FORMLINE. Not an outline but a band that swells and narrows as it runs, turning corners
   without ever breaking, so that the primary (black) forms join into one continuous net.
   Secondary forms (red) sit inside it; what is left over is the tertiary space.

   OVOID. A rounded rectangle that is heavier on top: the upper edge bulges, the lower
   corners are tight and the underside lifts toward the middle. Its formline is thick
   above and thin below, so the space inside is never concentric with the outside.
   Ovoids are eyes, joints, and the bases of wings, fins and tails.

   U-FORM. A band bent round like a thumbnail: thick at the closed end, the legs tapering
   to points. Rows of them are feathers, fins, fingers and ribs. A split U carries a
   pointed tongue inside it.

   RELIEF. Where formlines meet, a small slit in the ground colour — a crescent or a
   three-pointed trigon — keeps the junction from clotting.

   Everything here is built from those constructions. Shapes are drawn as solid forms
   with the ground cut back out of them, in layers (`z`): primary, cut, inner primary,
   secondary, cut. Part flags: `solid` (primary, always inked), `bg` (ground), `ci`
   (0 = secondary, 1 = tertiary), `ns` (no outline), `hatchOk` (may be hatched instead
   of flat, as on engraved silver).

   The creatures are generic: a bird, a fish, a whale, a frontal face. None is a crest. */

const FL={cov:true,ter:false};
// fill.tertiary ≥ 0.5 paints the space inside eye ovoids in the tertiary colour (blue-green, or yellow in weaving)
FL.use=g=>{FL.cov=!!(g&&g.fill&&g.fill.coverage>0.02);FL.ter=FL.cov&&((g.fill.tertiary||0)>=0.5);};
const flP=(pts,z=0)=>({kind:'region',closed:true,role:'outer',solid:true,ns:true,plain:true,z,pts});
const flC=(pts,z=1)=>({kind:'region',closed:true,role:'inner',bg:true,ns:true,plain:true,z,pts});
const flS=(pts,z=3)=>({kind:'region',closed:true,role:'inner',ci:0,ns:FL.cov,plain:true,hatchOk:true,z,pts});
const flT=(pts,z=3)=>({kind:'region',closed:true,role:'detail',ci:1,ns:FL.cov,plain:true,hatchOk:true,z,pts});
FL.put=(parts,{x=0,y=0,rot=0,s=1,flip=false,dz=0}={})=>parts.map(p=>Object.assign({},p,{z:(p.z||0)+dz,pts:G.xform(p.pts,{x,y,rot,s,flip})}));
FL.done=parts=>parts.map((p,i)=>[p,i]).sort((a,b)=>(a[0].z||0)-(b[0].z||0)||a[1]-b[1]).map(a=>a[0]);

// outline of an ovoid, centre (0,0): bulging top, tight lower corners, underside lifting to the middle
FL.ovoid=(w,h,lift=0.085)=>{const a=w/2,b=h/2;
  const R=G.chain(
    G.bez([0,b*(1-2*lift)],[a*0.46,b*(1-2*lift)],[a*0.74,b*1.06],[a*0.91,b*0.83],10),
    G.bez([a*0.91,b*0.83],[a*1.04,b*0.66],[a*1.04,b*0.2],[a*0.985,-b*0.2],10),
    G.bez([a*0.985,-b*0.2],[a*0.92,-b*0.76],[a*0.5,-b],[0,-b],14));
  return R.concat(R.slice(1,-1).reverse().map(([x,y])=>[-x,y]));};
// inward offset that is heavier where the outline faces up (the formline's top weight)
FL.inset=(P,d,top=1.85,bot=0.7)=>{const n=P.length,mk=sg=>P.map((q,i)=>{const p=P[(i-1+n)%n],r=P[(i+1)%n];let tx=r[0]-p[0],ty=r[1]-p[1];const l=Math.hypot(tx,ty)||1;tx/=l;ty/=l;
    const nx=-ty*sg,ny=tx*sg,k=lerp(bot,top,clamp((ny+1)/2));return[q[0]+nx*d*k,q[1]+ny*d*k];});
  const a=mk(1),b=mk(-1);return Math.abs(G.area(a))<Math.abs(G.area(b))?a:b;};
// a closed outline drawn as a formline: solid, with its inner space cut back out
FL.form=(outline,d,z=0,top,bot)=>[flP(outline,z),flC(FL.inset(outline,d,top,bot),z+1)];
// pointed lens (eyelid): tips at ±w/2
FL.lens=(w,hu,hd)=>G.chain(G.bez([-w/2,0],[-w*0.22,-hu*1.25],[w*0.22,-hu*1.25],[w/2,0],14),G.bez([w/2,0],[w*0.22,hd*1.25],[-w*0.22,hd*1.25],[-w/2,0],14)).slice(0,-1);
/* A formline ovoid and what floats in it.
   kind: 'eye' (eyelid line and round iris), 'joint' (a solid inner ovoid set high),
   'red' (the same in the secondary colour), 'face' (inner ovoid with its own eye), 'open'. */
FL.ovo=(w,h,kind='joint',t=0.2)=>{
  const tt=h*t,tb=tt*0.42,ts=tt*0.6,iw=w-2*ts,ih=h-tt-tb,cy=(tt-tb)/2;const P=[flP(FL.ovoid(w,h),0),flC(G.xform(FL.ovoid(iw,ih),{y:cy}),1)];
  if(kind==='eye'&&FL.ter)P.push(Object.assign(flT(G.xform(FL.ovoid(iw,ih),{y:cy}),1),{ns:true}));
  if(kind==='eye'){const lw=iw*0.9,lu=ih*0.34,ld=ih*0.26,ey=cy-ih*0.02;
    P.push(flP(G.xform(FL.lens(lw,lu,ld),{y:ey}),2),flC(G.xform(FL.lens(lw*0.88,lu*0.68,ld*0.74),{y:ey+ih*0.02}),3),flP(G.circle(0,ey-ih*0.01,Math.min(ih*0.23,lw*0.17),40),4));}
  else if(kind==='joint'||kind==='red'){const o=G.xform(FL.ovoid(iw*0.6,ih*0.6),{y:cy-ih*0.1});P.push(kind==='red'?flS(o,2):flP(o,2));}
  else if(kind==='face'){const fw=iw*0.7,fh=ih*0.72,fy=cy-ih*0.06;P.push(flP(G.xform(FL.ovoid(fw,fh),{y:fy}),2),flC(G.circle(fw*0.14,fy-fh*0.12,fh*0.2,28),3),flP(G.circle(fw*0.14,fy-fh*0.12,fh*0.085,20),4),
    flC(G.xform(FL.lens(fw*0.5,fh*0.05,fh*0.07),{x:-fw*0.02,y:fy+fh*0.24}),3));}
  return P;};
// U-form: open end at y=0, closed end at y=−len; legs taper to points
FL.uShape=(len,w,t=0.3)=>{const a=w/2,e=w*0.025,ti=len*(1-t);
  const oL=G.bez([-a,0],[-a*1.1,-len*0.5],[-a*1.02,-len],[0,-len],14),iL=G.bez([-a+e,0],[-a*0.66,-len*0.45],[-a*0.66,-ti],[0,-ti],12);
  const mir=p=>p.slice(0,-1).reverse().map(([x,y])=>[-x,y]);
  return oL.concat(mir(oL),iL.concat(mir(iL)).reverse());};
FL.u=(len,w,{t=0.3,split=false,sec=false,fill=false,z=0}={})=>{const P=[(sec?flS:flP)(FL.uShape(len,w,t),sec?3:z)];
  // split U: a pointed tongue rising from the open end
  if(split){const h=len*(1-t)*0.8,y0=-len*0.24,tw=w*0.15;P.push((sec?flP:flS)(G.chain(G.bez([0,y0],[-tw*1.5,y0-(h+y0)*0.25],[-tw*0.9,-h*0.8],[0,-h],9),G.bez([0,-h],[tw*0.9,-h*0.8],[tw*1.5,y0-(h+y0)*0.25],[0,y0],9)).slice(0,-1),3));}
  if(fill){const h=len*(1-t)*0.86,fw=w*0.3;P.push(flT(G.chain(G.bez([-fw,0],[-fw*1.15,-h*0.6],[-fw*0.7,-h],[0,-h],8),G.bez([0,-h],[fw*0.7,-h],[fw*1.15,-h*0.6],[fw,0],8)),3));}
  return P;};
// a swelling formline stroke along a spine
FL.stroke=(pts,w,z=0,sec=false)=>{const p=G.resample(pts,false,Math.max(0.8,G.length(pts,false)/70));return (sec?flS:flP)(G.ribbon(p,t=>w*0.5*(0.16+0.84*Math.pow(Math.sin(Math.PI*clamp(t,0.02,0.98)),0.7))),z);};
// relief slits
FL.crescent=(r,k=0.55)=>G.arc(0,0,r,200,340,16).concat(G.arc(0,-r*k,r*0.86,330,210,12));
FL.trigon=(r)=>{const p=[];for(let i=0;i<3;i++){const a0=(-90+i*120)*DEG,a1=(-90+(i+1)*120)*DEG,m=(a0+a1)/2;p.push(...G.quad([r*Math.cos(a0),r*Math.sin(a0)],[r*0.16*Math.cos(m),r*0.16*Math.sin(m)],[r*Math.cos(a1),r*Math.sin(a1)],6).slice(0,-1));}return p;};
// a fan of U-forms from one point: feathers, fins, fingers
FL.fan=(n,x,y,a0,a1,len,w,o={})=>{const P=[];for(let i=0;i<n;i++){const f=n>1?i/(n-1):0.5,a=lerp(a0,a1,f),L=len*(o.grade?lerp(1,o.grade,f):1);
    P.push(...FL.put(FL.u(L,w,Object.assign({split:i%2===0||!!o.allSplit},o)),{x,y,rot:a}));}return P;};

// a row of U-forms whose bases run from (x0,y0) to (x1,y1): feathers along a wing, fingers on a palm
FL.row=(n,x0,y0,x1,y1,a0,a1,len,w,o={})=>{const P=[];for(let i=0;i<n;i++){const f=n>1?i/(n-1):0.5,L=len*(o.grade?lerp(1,o.grade,f):1);
    P.push(...FL.put(FL.u(L,w,Object.assign({split:true},o)),{x:lerp(x0,x1,f),y:lerp(y0,y1,f),rot:lerp(a0,a1,f),dz:o.dz||0}));}return P;};

/* ---------- element motifs ---------- */
const flFit=(P,size=96)=>fitParts(FL.done(P),size);
defMotif('flOvoid',{name:'Ovoid',term:'ovoid',meaning:'The building block of the formline system: a rounded rectangle heavier above than below, with a second ovoid floating high inside it. It serves as an eye, a joint, the root of a wing or tail. The name is the analyst’s; artists’ own terms differ from nation to nation.',
fn(rng,g){FL.use(g);return flFit(FL.ovo(84,62,'joint'),92);}});
defMotif('flEye',{name:'Eye ovoid',term:'ovoid with eyelid line',meaning:'An ovoid holding a pointed eyelid line and a round iris. It is the eye of a creature, and also marks shoulders, hips and the base of the tail, so that a body seems to look out from every joint.',
fn(rng,g){FL.use(g);return flFit(FL.ovo(84,62,'eye'),92);}});
defMotif('flHead',{name:'Salmon-trout’s head',term:'salmon-trout’s-head',meaning:'An ovoid whose inner ovoid has been given an eye and a mouth, so that a small face sits inside the joint. The usual English name for it, though it need not be a fish.',
fn(rng,g){FL.use(g);return flFit(FL.ovo(84,62,'face'),92);}});
defMotif('flU',{name:'U-form',term:'U-form',meaning:'A band bent round like a thumbnail, thick at the closed end with legs that taper to points. Laid in rows, U-forms become feathers, fins, fingers, ribs and ears.',
fn(rng,g){FL.use(g);return flFit(FL.u(80,58,{t:0.3}),92);}});
defMotif('flSplitU',{name:'Split U',term:'split U',meaning:'A U-form with a pointed tongue rising inside it in the secondary colour: the commonest way to fill the space within a feather or a fin.',
fn(rng,g){FL.use(g);return flFit(FL.u(80,58,{t:0.28,split:true}),92);}});
defMotif('flS',{name:'S-form',term:'S-form',meaning:'A swelling band that curves one way and then the other: two U-forms joined end to end. It fills awkward spaces and carries the eye from one part to the next.',
fn(rng,g){FL.use(g);const sp=G.path([-34,30],[[-40,-6],[-8,-14],[0,0]],[[8,14],[40,6],[34,-30]]),p=G.resample(sp,false,1.2);
  const band=G.ribbon(p,t=>15*Math.pow(Math.sin(Math.PI*clamp(t,0.005,0.995)),0.55)),slit=G.ribbon(G.sub(p,false,0.16,0.84),t=>3.4*Math.sin(Math.PI*clamp(t,0.01,0.99)));
  return flFit([flP(band,0),flS(slit,3)],92);}});
defMotif('flHand',{name:'Hand',term:'—',meaning:'An ovoid palm with U-form fingers: a hand, a paw, a flipper or a clawed foot, depending on the creature it belongs to.',upright:true,
fn(rng,g){FL.use(g);return flFit(FL.put(FL.ovo(50,36,'red'),{y:26}).concat(FL.row(4,-17,12,17,12,-10,10,44,12.5,{t:0.26}),FL.put(FL.u(26,11,{t:0.3}),{x:-27,y:22,rot:-62})),92);}});
defMotif('flWing',{name:'Wing',term:'—',meaning:'A joint ovoid with long U-form feathers running from it, each feather split. The same construction, shortened, is a tail or a fin.',mirrorOk:true,
fn(rng,g){FL.use(g);return flFit(FL.put(FL.ovo(40,31,'eye'),{x:-24,y:-16}).concat(FL.row(4,-37,-4,-9,-4,-178,-164,50,12.5,{t:0.22,grade:1.22})),94);}});

/* ---------- creatures (generic, not crests) ---------- */
// bird in profile, facing right
defMotif('flBird',{name:'Bird in profile',term:'—',figure:true,mirrorOk:true,meaning:'A bird built from the formline parts: an eye ovoid for the head, a beak, a body that is one large joint, and wing and tail made of U-form feathers. Which bird it is depends on the beak — straight for a raven, hooked for an eagle — and in the tradition it would be someone’s crest. This one is nobody’s.',
fn(rng,g){FL.use(g);const P=[],hook=rng.chance(.5);
  // head
  P.push(...FL.put(FL.ovo(36,30,'eye',0.19),{x:10,y:-26}));
  // beak: upper mandible swelling from the brow, lower jaw beneath, a slit of ground between
  const up=hook?G.chain(G.bez([22,-37],[34,-42],[47,-36],[49,-24],12),G.bez([49,-24],[50,-17],[47,-12],[44,-10],8),G.bez([44,-10],[44,-17],[38,-21],[26,-22],10))
               :G.chain(G.bez([22,-37],[34,-41],[46,-34],[52,-23],12),G.bez([52,-23],[42,-23],[34,-22],[26,-22],10));
  P.push(flP(up,0),flC(G.circle(34,-29,2.1,16),1));
  P.push(flP(G.chain(G.bez([25,-19.5],[33,-19.5],[40,-18],[hook?43:47,-15],10),G.bez([hook?43:47,-15],[38,-11],[30,-11],[24,-13],10)),0));
  // body: one large ovoid, turned, with a red inner ovoid; breast feathers below
  P.push(...FL.put(FL.ovo(46,36,'red',0.18),{x:0,y:6,rot:-24}));
  // wing: shoulder joint and long split feathers sweeping back
  P.push(...FL.put(FL.ovo(22,17,'joint',0.2),{x:-8,y:-8,rot:-30,dz:5}));
  P.push(...FL.row(3,-18,-11,-13,7,-114,-98,31,10,{t:0.22,grade:1.16}));
  // tail
  P.push(...FL.put(FL.ovo(17,13,'joint',0.22),{x:-22,y:21,rot:-40}));
  P.push(...FL.row(2,-29,18,-25,28,-122,-106,25,9.5,{t:0.24}));
  // leg and claws
  P.push(...FL.put(FL.ovo(15,12,'red',0.22),{x:12,y:27}));
  P.push(...FL.row(3,7,32,17,32,196,164,15,5.4,{t:0.3,split:false}));
  // relief where neck meets body
  P.push(flC(G.xform(FL.crescent(7),{x:8,y:-10,rot:150}),6));
  return flFit(P,96);}});
// fish in profile, facing right
defMotif('flFish',{name:'Fish in profile',term:'—',figure:true,mirrorOk:true,meaning:'A fish in formline: eye-ovoid head with a down-turned jaw, a body ribbed with split U-forms, fins as single U-forms and a tail of two. Salmon are the wealth of the coast, and in the tradition a salmon design belongs to those with the right to it. This is the construction only.',
fn(rng,g){FL.use(g);const P=[];
  const body=G.chain(G.bez([28,-13],[8,-25],[-22,-21],[-36,-5],16),G.bez([-36,-5],[-38,0],[-38,3],[-36,7],5),G.bez([-36,7],[-20,21],[10,22],[30,12],16),G.bez([30,12],[34,4],[34,-6],[28,-13],8));
  P.push(...FL.form(body,2.5,0,2.1,0.8));
  P.push(...FL.put(FL.ovo(27,23,'eye',0.2),{x:27,y:-2,dz:4}));
  // jaw
  P.push(flP(G.chain(G.bez([36,3],[44,3],[50,6],[51,12],8),G.bez([51,12],[45,10],[40,11],[33,10],8)),4),flP(G.chain(G.bez([33,12],[39,13],[44,14],[47,17],6),G.bez([47,17],[40,19],[34,18],[30,15],6)),4));
  // ribs: split U-forms inside the body, pointing to the tail
  for(const [x,y,l,w] of [[11,0,19,21],[-6,0,17,19],[-21,0.5,13,15]])P.push(...FL.put(FL.u(l,w,{t:0.26,split:true,sec:true}),{x,y,rot:-90}));
  // fins
  P.push(...FL.put(FL.u(17,12,{t:0.28,split:true}),{x:0,y:-19,rot:-62}),...FL.put(FL.u(11,9,{t:0.3}),{x:-22,y:-15,rot:-58}),...FL.put(FL.u(13,10,{t:0.3,split:true}),{x:8,y:19,rot:-128}),...FL.put(FL.u(11,9,{t:0.3}),{x:-15,y:17,rot:-126}));
  // tail
  P.push(...FL.put(FL.ovo(13,11,'joint',0.24),{x:-37,y:1}),...FL.put(FL.u(19,12,{t:0.26,split:true}),{x:-40,y:-2,rot:-62}),...FL.put(FL.u(19,12,{t:0.26,split:true}),{x:-40,y:4,rot:-118}));
  return flFit(P,96);}});
// whale, facing right
defMotif('flWhale',{name:'Whale',term:'—',figure:true,mirrorOk:true,meaning:'A whale in formline: a great head with teeth, a blowhole, a tall back fin, a flipper and flukes — the features by which a killer whale is told from every other creature in this art. A crest of many houses; this drawing is none of them.',
fn(rng,g){FL.use(g);const P=[];
  const body=G.chain(G.bez([34,-8],[14,-26],[-20,-22],[-34,-2],16),G.bez([-34,-2],[-36,3],[-35,7],[-32,10],5),G.bez([-32,10],[-14,24],[18,26],[38,14],16),G.bez([38,14],[42,6],[40,-2],[34,-8],8));
  P.push(...FL.form(body,2.7,0,2.1,0.8));
  P.push(...FL.put(FL.ovo(30,25,'eye',0.2),{x:22,y:-3,dz:4}));
  // mouth with teeth
  const mouth=G.chain(G.bez([24,13],[32,12],[40,11],[46,7],8),G.bez([46,7],[47,13],[44,19],[36,21],8),G.bez([36,21],[30,22],[26,19],[24,13],6));
  P.push(flP(mouth,4),flC(G.chain(G.bez([27,14.5],[33,14],[39,13],[43.5,10.5],6),G.bez([43.5,10.5],[43.5,14],[40,17.5],[35,18.5],5),G.bez([35,18.5],[31,19],[28,17.5],[27,14.5],4)),5));
  for(let i=0;i<4;i++){const x=29.5+i*3.7,y=14.4-i*0.75;P.push(flP([[x,y],[x+2.2,y-0.35],[x+1.4,y+3.2]],6));}
  // blowhole
  P.push(flC(G.circle(10,-15.5,2.2,16),2),flP(G.circle(10,-15.5,1,12),3));
  // dorsal fin with its round hole
  P.push(...FL.put(FL.u(34,17,{t:0.2}),{x:-4,y:-17,rot:-14}),flS(G.circle(-8.2,-33,3.4,20),3));
  // ribs
  for(const [x,y,l,w] of [[4,1,18,20],[-13,1.5,15,17]])P.push(...FL.put(FL.u(l,w,{t:0.26,split:true,sec:true}),{x,y,rot:-90}));
  // flipper
  P.push(...FL.put(FL.ovo(13,11,'red',0.24),{x:10,y:20,dz:4}),...FL.put(FL.u(22,12,{t:0.24,split:true}),{x:8,y:23,rot:-142}));
  // flukes
  P.push(...FL.put(FL.ovo(14,12,'joint',0.24),{x:-34,y:4}),...FL.put(FL.u(22,13,{t:0.24,split:true}),{x:-37,y:0,rot:-52}),...FL.put(FL.u(22,13,{t:0.24,split:true}),{x:-37,y:8,rot:-128}));
  return flFit(P,96);}});
// frontal face, as on the upper half of a chest front
FL.face=function(o={}){const P=[];
  for(const s of [-1,1]){
    P.push(...FL.put(FL.ovo(39,31,'eye',0.2),{x:s*23.5,y:-11,flip:s<0}));
    // brow: a heavy band resting on the eye, thinning toward the temple
    P.push(flP(G.chain(G.bez([s*2,-22],[s*8,-39],[s*36,-42],[s*49,-24],16),G.bez([s*49,-24],[s*40,-30],[s*18,-30],[s*4,-21],14)),0));
    // ear
    P.push(...FL.put(FL.u(19,16,{t:0.3,split:true}),{x:s*39,y:-30,rot:s*20}));
    // cheek: a U hanging from the outer corner of the eye, red tongue inside
    P.push(...FL.put(FL.u(23,13,{t:0.3,split:true}),{x:s*44,y:4,rot:s*172}));
    // nostril wing
    P.push(...FL.put(FL.u(12,10,{t:0.3}),{x:s*6.5,y:10,rot:s*150}));
  }
  // nose bridge, joining the two eyes
  P.push(flP(G.chain(G.bez([-5.5,-24],[-4.5,-8],[-7,2],[-11,10],8),[[11,10]],G.bez([11,10],[7,2],[4.5,-8],[5.5,-24],8)),0),flC(G.circle(-5,7,1.7,10),1),flC(G.circle(5,7,1.7,10),1));
  // mouth: a broad formline band with teeth, reaching the cheeks
  P.push(flP(G.roundRect(-40,15,40,37,10,6),0),flC(G.roundRect(-36,19.5,36,33.6,6.5,5),1));
  if(o.teeth!==false){const n=11,w=72/n;for(let i=0;i<n;i++)P.push(flP(G.roundRect(-36+i*w+0.6,20.1,-36+(i+1)*w-0.6,o.tongue?25.4:33,1.2,2),2));
    if(o.tongue)P.push(flS(G.chain(G.bez([-11,27.5],[-11,34.5],[11,34.5],[11,27.5],8)),3));}
  // relief at the corners of the mouth
  for(const s of [-1,1])P.push(flC(G.xform(FL.crescent(4.2,0.5),{x:s*38.5,y:14.2,rot:s*-35}),4));
  return P;};
defMotif('flFace',{name:'Frontal face',term:'—',figure:true,meaning:'A face seen from the front: two eye ovoids under heavy brows, a broad nose, a wide mouth set with teeth, ears as U-forms at the upper corners. On a chest front such a face fills the upper half and the body is folded out below it. It is a construction, not a named being.',
fn(rng,g){FL.use(g);return flFit(FL.face({tongue:rng.chance(.4)}),96);}});

/* ---------- borders ---------- */
const flStrip=(P,L,t)=>FL.done(P).map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));
defBorder('flOvoidU',{name:'Ovoid and U band',fn(L,t){FL.cov=true;const u=t*2.5,n=Math.max(1,Math.round(L/u)),w=L/n,P=[];
  for(let i=0;i<n;i++){const x=i*w;P.push(...FL.put(FL.ovo(t*1.08,t*0.84,i%2?'red':'joint',0.2),{x:x+t*0.62,y:t*0.52}));
    P.push(...FL.put(FL.u(w-t*1.32,t*0.8,{t:0.24,split:true}),{x:x+t*1.2,y:t*0.52,rot:90}));}
  return flStrip(P,L,t);}});
defBorder('flURow',{name:'Split-U row',fn(L,t){FL.cov=true;const n=Math.max(2,Math.round(L/(t*0.78))),w=L/n,P=[];
  for(let i=0;i<n;i++)P.push(...FL.put(FL.u(t*0.86,w*0.9,{t:0.26,split:true,sec:i%2===1}),{x:(i+.5)*w,y:t*0.96}));
  return flStrip(P,L,t);}});
defBorder('flBars',{name:'Blanket bars',fn(L,t){return[{kind:'region',closed:true,role:'outer',solid:true,ns:true,plain:true,pts:[[0,0],[L,0],[L,t*0.42],[0,t*0.42]]},{kind:'region',closed:true,role:'inner',ci:2,plain:true,ns:true,pts:[[0,t*0.5],[L,t*0.5],[L,t*0.92],[0,t*0.92]]}];}});

/* ---------- layouts ---------- */
const flRect=(a,b,c,e)=>[[a,b],[c,b],[c,e],[a,e]];
/* The distributive design of a chest front, laid into a rectangle (x0..x1, y0..y1) and
   mirrored on its centre line: a face across the upper half; below it a body at the
   centre and a hand in each lower corner; every gap closed with U-forms. */
FL.distributive=function(x0,y0,x1,y1,rng,{hole=false}={}){
  const W=x1-x0,H=y1-y0,cx=(x0+x1)/2,P=[];
  const fs=Math.min(W/100,H*0.6/82),fy=y0+43*fs,fb=fy+38.5*fs;
  P.push(...FL.put(FL.face({tongue:rng.chance(.4)}),{x:cx,y:fy,s:fs}));
  // side columns when the field is wider than the face: stacked joints, locked edge to edge
  const side=(W-100*fs)/2;
  if(side>W*0.07)for(const s of [-1,1]){const n=Math.max(2,Math.round((fb-y0)/(side*0.95))),hh=(fb-y0)/n;
    for(let i=0;i<n;i++)P.push(...FL.put(FL.ovo(side*1.04,hh*1.03,['joint','red','eye'][i%3],0.2),{x:cx+s*(W/2-side/2),y:y0+(i+0.5)*hh,flip:s<0}));}
  const bar=Math.max(5,H*0.014),ly0=fb+bar,lh=y1-ly0;
  if(lh<H*0.14)return P;
  // a formline bar under the mouth ties the upper and lower registers together
  P.push(flP(flRect(x0-2,fb-1,x1+2,ly0),0));
  const bw=W*0.24,pw=(W-bw)/2*0.56,jw=(W-bw)/2-pw;
  for(const s of [-1,1]){
    // hand in the corner: palm on the base line, fingers rising to the bar
    const hx=cx+s*(W/2-pw/2),ph=lh*0.46;
    P.push(...FL.put(FL.ovo(pw*1.03,ph,'red',0.2),{x:hx,y:y1-ph/2+2,flip:s<0}));
    P.push(...FL.row(3,hx-pw*0.33,y1-ph+3,hx+pw*0.33,y1-ph+3,-5,5,lh-ph+4,pw*0.31,{t:0.24}));
    // hip: an eye ovoid under the bar, a split U standing below it
    const jx=cx+s*(bw/2+jw/2),jh=lh*0.44;
    P.push(...FL.put(FL.ovo(jw*1.05,jh,'eye',0.2),{x:jx,y:ly0+jh/2-2,flip:s<0}));
    P.push(...FL.put(FL.u(lh-jh+5,jw*0.98,{t:0.24,split:true,sec:true}),{x:jx,y:y1+1}));
    P.push(...FL.put(FL.u(lh-jh+5,jw*0.98,{t:0.2}),{x:jx,y:y1+1,dz:-3}).filter(()=>false));
  }
  // body on the centre line: a tall ovoid holding a small face
  if(!hole)P.push(...FL.put(FL.ovo(bw*1.04,lh+4,'face',0.15),{x:cx,y:ly0+lh/2}));
  return P;
};
defStructure('chestFront',{name:'Chest front',blurb:'One creature opened out to fill a rectangle: a face across the top, body at the centre, a hand in each lower corner, the two halves mirrored.',
fn(ctx){
  const {W,H,g,rng}=ctx;FL.use(g);const S=g.structure;
  const inner=frameBands(ctx,{x0:30,y0:30,x1:W-30,y1:H-30},Math.min(1,Math.round(S.borderBands||0)),40);
  const m=14,x0=inner.x0+m,y0=inner.y0+m,x1=inner.x1-m,y1=inner.y1-m;
  const hero=ctx.pick('hero'),M=SG.motifs[hero],other=M&&!/^fl/.test(hero);
  // the board: a heavy formline frame
  const fr=flRect(inner.x0,inner.y0,inner.x1,inner.y1);
  ctx.items.push({type:'parts',parts:[flP(G.roundRect(inner.x0,inner.y0,inner.x1,inner.y1,12,4),0),flC(G.roundRect(x0-3,y0-3,x1+3,y1+3,14,5),1)],role:'frame',variant:'board'});
  ctx.items.push({type:'parts',parts:FL.done(FL.distributive(x0,y0,x1,y1,rng,{hole:other})),role:'hero',variant:'chest',knockOk:true});
  // a subject from another vocabulary takes the place of the body
  if(other){const fs=Math.min((x1-x0)/100,(y1-y0)*0.6/82),ly0=y0+81.5*fs+Math.max(5,(y1-y0)*0.014),lh=y1-ly0;if(lh>60)ctx.motif(hero,(x0+x1)/2,ly0+lh*0.5,Math.min(lh*0.92,(x1-x0)*0.24),{role:'hero',variant:'hero'});}
}});
/* Round field: a drum head, a painted hat seen from above, a print. A formline rim with
   relief slits, one creature at the centre, U-forms closing the space above and below. */
defStructure('roundel',{name:'Round design',blurb:'One creature in a round field with a heavy rim — a drum head, a hat seen from above, a print.',
fn(ctx){
  const {W,H,g,rng}=ctx;FL.use(g);const cx=W/2,cy=H/2,R=Math.min(W,H)/2-44,P=[];
  P.push(flP(G.circle(cx,cy,R,160),0),flC(G.circle(cx,cy+R*0.012,R*0.925,160),1));
  const n=rng.pick([12,16]);for(let i=0;i<n;i++){const a=(i+0.5)/n*360;P.push(flC(G.xform(FL.crescent(R*0.06,0.5),{x:cx+Math.cos(a*DEG)*R*0.963,y:cy+Math.sin(a*DEG)*R*0.963,rot:a+90}),2));}
  ctx.items.push({type:'parts',parts:FL.done(P),role:'frame',variant:'rim'});
  const hero=ctx.pick('hero');ctx.motif(hero,cx,cy,R*1.42,{role:'hero',variant:'hero'});
  if(clamp(g.structure.bare||0)<0.6){const k=ctx.pick('ring');for(const [a,s] of [[-90,1],[90,1]])ctx.motif(k,cx+Math.cos(a*DEG)*R*0.7,cy+Math.sin(a*DEG)*R*0.7,R*0.3,{role:'ring',rot:a+90,variant:'cap'+a});}
}});
/* Chilkat robe: a five-sided blanket — straight top and sides, a shallow V below — with
   broad black and yellow borders, a design field split into a wide centre panel and two
   side panels, and a long fringe. */
defStructure('robe',{name:'Dancing robe',blurb:'A five-sided blanket: black and yellow borders, a centre panel and two side panels of formline design, a long fringe.',
fn(ctx){
  const {W,H,g,rng}=ctx;FL.use(g);const x0=70,x1=W-70,y0=70,ys=H*0.6,yv=H*0.78,cx=W/2;
  const pent=k=>[[x0+k,y0+k],[x1-k,y0+k],[x1-k,ys-k*0.35],[cx,yv-k*1.08],[x0+k,ys-k*0.35]];
  // fringe
  const F=[];for(let x=x0+4;x<=x1-4;x+=7.5){const yt=ys+(yv-ys)*(1-Math.abs(x-cx)/(cx-x0));F.push({kind:'line',role:'detail',noSeed:true,pts:[[x,yt-2],[x+rng.range(-3,3),yt+H*0.15+rng.range(-8,8)]]});}
  ctx.parts(F,'frame');
  ctx.parts([flP(pent(0),0),{kind:'region',closed:true,role:'inner',ci:2,ns:true,plain:true,z:1,pts:pent(20)},flP(pent(38),2),flC(pent(46),3)],'border');
  const k=54,fx0=x0+k,fx1=x1-k,fy0=y0+k,sw=(fx1-fx0)*0.2,clip=pent(46);
  const mk=(a,b,c,e,r)=>GH.clipConvex(FL.done(FL.distributive(a,b,c,e,r)),clip);
  ctx.items.push({type:'parts',parts:mk(fx0+sw+8,fy0,fx1-sw-8,yv-k*1.5,rng.fork('c')),role:'hero',variant:'robeC',knockOk:true});
  const sr=rng.fork('s'),sp=[];for(const s of [0,1]){const a=s?fx1-sw:fx0,n=3,hh=(ys-k*0.6-fy0)/n;
    for(let i=0;i<n;i++){const yy=fy0+(i+0.5)*hh;sp.push(...FL.put(i===1?FL.ovo(sw*0.9,hh*0.8,'eye'):FL.ovo(sw*0.9,hh*0.8,i?'red':'face'),{x:a+sw/2,y:yy,flip:!!s}));}
    sp.push(flP(flRect(s?fx1-sw-6:fx0+sw+2,fy0-4,s?fx1-sw-2:fx0+sw+6,ys),0));}
  ctx.items.push({type:'parts',parts:GH.clipConvex(FL.done(sp),clip),role:'ring',variant:'robeS'});
}});
/* Spindle whorl (Coast Salish): a disc with a hole for the spindle. The design is not
   formline. The surface is left standing and the pattern is cut out of it with three
   shapes only — crescents, wedges (trigons) and circles — arranged to turn about the hole. */
defStructure('whorl',{name:'Spindle whorl',blurb:'A disc round a spindle hole, its design cut out with crescents, wedges and circles that turn about the centre.',
fn(ctx){
  const {W,H,g,rng}=ctx;const cx=W/2,cy=H/2,R=Math.min(W,H)/2-46,n=rng.pick([2,3,4]),P=[];
  P.push({kind:'region',closed:true,role:'outer',ci:0,plain:true,z:0,pts:G.circle(cx,cy,R,160)});
  const cut=(pts)=>P.push(flC(pts,1));
  const at=(pts,r,a,rot,s=1)=>G.xform(pts,{x:cx+Math.cos(a*DEG)*r,y:cy+Math.sin(a*DEG)*r,rot,s});
  // outer ring: close-set crescents all leaning one way, a wedge between each pair
  const m1=n*6;for(let i=0;i<m1;i++){const a=i/m1*360;cut(at(FL.crescent(R*0.115,0.42),R*0.8,a,a+62));cut(at(FL.trigon(R*0.05),R*0.9,a+180/m1,a+90));}
  // middle ring: n eyes (a circle held between two crescents) with long sweeping crescents between them
  for(let i=0;i<n;i++){const a=i/n*360+15;
    cut(at(G.circle(0,0,R*0.055,24),R*0.5,a,0));cut(at(FL.crescent(R*0.13,0.36),R*0.5,a,a+90));cut(at(FL.crescent(R*0.13,0.36),R*0.5,a,a-90));
    const pts=[];for(let k=0;k<=20;k++){const t=k/20,aa=(a+26/n*3+t*200/n)*DEG,r=R*lerp(0.36,0.62,Math.sin(Math.PI*t)*0.5+t*0.5);pts.push([cx+Math.cos(aa)*r,cy+Math.sin(aa)*r]);}
    cut(G.ribbon(pts,t=>R*0.045*Math.pow(Math.sin(Math.PI*clamp(t,0.02,0.98)),0.8)));
    cut(at(FL.trigon(R*0.06),R*0.66,a+180/n,a+90));}
  // inner ring: wedges pointing at the hole
  const m3=n*4;for(let i=0;i<m3;i++){const a=(i+0.5)/m3*360;cut(at(FL.trigon(R*0.05),R*0.2,a,a+90));cut(at(FL.crescent(R*0.06,0.45),R*0.29,a+180/m3,a+90));}
  cut(G.circle(cx,cy,R*0.085,48));
  P.push({kind:'line',closed:true,role:'outer',z:2,pts:G.circle(cx,cy,R,160)},{kind:'line',closed:true,role:'inner',z:2,pts:G.circle(cx,cy,R*0.955,160)},{kind:'line',closed:true,role:'detail',z:2,pts:G.circle(cx,cy,R*0.66,120)},{kind:'line',closed:true,role:'detail',z:2,pts:G.circle(cx,cy,R*0.34,90)},{kind:'line',closed:true,role:'inner',z:2,pts:G.circle(cx,cy,R*0.085,48)});
  ctx.items.push({type:'parts',parts:FL.done(P),role:'hero',variant:'whorl'});
}});
defMotif('slCrescent',{name:'Crescent',term:'—',meaning:'One of the three cut shapes of Coast Salish design, with the wedge and the circle. The carver removes it from the surface; the design is what is left standing between the cuts.',
fn(rng,g){return fitParts([{kind:'region',closed:true,role:'outer',pts:FL.crescent(40,0.5)}],70);}});
defMotif('slTrigon',{name:'Wedge',term:'trigon',meaning:'A three-pointed wedge with curved sides, cut where three forms would otherwise meet. In formline it relieves heavy junctions; in Coast Salish work it is one of the three shapes the whole design is cut with.',
fn(rng,g){return fitParts([{kind:'region',closed:true,role:'outer',pts:FL.trigon(40)}],70);}});
