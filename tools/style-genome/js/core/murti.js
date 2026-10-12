'use strict';
/* Mūrti kit: deity figures drawn to the standard of devotional line art.

   Proportion follows tālamāna, the measure of the śilpa texts: the face from chin to
   hairline is one tāla of 12 aṅgula, and a principal figure stands 10 tāla (daśatāla).
   Everything here is drawn in aṅgula with y UP, so a face is 12 units, a hand about 11,
   the seated trunk 39 and a standing figure about 120.

   A figure is an ASSEMBLY of parts: aureole, seat, crown and whatever each hand holds are
   separate drawings that are also registered as motifs of their own. That is what makes
   them re-mixable: any tradition can use a cobra hood or a bow as a motif, and a blended
   genome can hand one deity another's regalia (see mkPick).

   Detail is graded. Every part may carry `lod` 1–3; the renderer drops finer parts when the
   figure is small for its pen (size ÷ line weight), so a brush-mark register gets the
   essential contours and a fine-line register gets every bead.
   All constructions are original; none traces a reference image. */

const MK={LOD:[0,42,90,140],slot:{aureole:{},seat:{},crown:{},held:{}}};
const mkPol=(r,a)=>[r*Math.cos(a*DEG),r*Math.sin(a*DEG)];
const mkLerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
function mkCtx(rng,g,par,xf){
  const K={rng,g,P:par?par.P:[],k:(par?par.k:1)*((xf&&xf.s)||1)};
  let loc=p=>p;
  if(xf){const c=Math.cos((xf.rot||0)*DEG),s=Math.sin((xf.rot||0)*DEG),k=xf.s||1,f=xf.flip?-1:1,x0=xf.x||0,y0=xf.y||0;loc=([x,y])=>{x*=f;return[x0+k*(x*c-y*s),y0+k*(x*s+y*c)];};}
  K.tp=par?p=>par.tp(loc(p)):loc;
  const out=pts=>pts.map(p=>{const q=K.tp(p);return[q[0],-q[1]];});
  const spl=(pts,o)=>pts.length>2&&!(o&&o.raw)?FK.spline(pts,false,(o&&o.seg)||6):pts;
  const push=(p,mat,o)=>{if(mat)p.mat=mat;if(o){if(o.lod)p.lod=o.lod;if(o.paint)p.paint=o.paint;if(o.wk)p.wk=o.wk;if(o.ns)p.ns=true;if(o.tone!=null)p.tone=o.tone;}K.P.push(p);return p;};
  K.R=(pts,mat,role='outer',o)=>push(reg(out(FK.spline(pts,true,(o&&o.seg)||6)),role),mat,o);      // closed curve through points
  K.Ro=(pts,mat,role='outer',o)=>push(reg(out(spl(pts,o)),role),mat,o);                              // open curve, closed by a straight edge
  K.Rp=(pts,mat,role='outer',o)=>push(reg(out(pts),role),mat,o);                                     // polygon exactly as given
  K.T=(path,w,mat,role='outer',o)=>push(reg(out(FK.tube(spl(path,o),typeof w==='function'?w:()=>w)),role),mat,o); // tapered tube
  K.L=(pts,role='detail',o)=>push(ln(out(spl(pts,o)),role,!!(o&&o.closed)),null,o);
  K.Lc=(pts,role='detail',o)=>push(ln(out(pts),role,true),null,o);
  K.D=(x,y,r,role='detail',o)=>{const q=K.tp([x,y]);return push(dt(q[0],-q[1],r*K.k,role),null,o);};
  K.C=(x,y,r,mat,role='inner',o)=>push(reg(out(G.circle(x,y,r,(o&&o.n)||18)),role),mat,o);
  K.ring=(x,y,r,role='inner',o)=>push(ln(out(G.circle(x,y,r,(o&&o.n)||24)),role,true),null,o);
  // beads are small open circles (pearls in colour), not solid dots
  K.beads=(path,gap,r,o)=>{const S=G.samples(spl(path),false,gap);for(const s of S)K.C(s.x,s.y,r,'pearl','detail',Object.assign({n:7},o));};
  K.sub=x=>mkCtx(rng,g,K,x);
  K.M=f=>{f(1);f(-1);};
  return K;
}
// a leaf or petal: base at (x,y), tip `len` away in direction rot (degrees, 0 = up), with optional inner contour and midrib
function mkPetal(K,x,y,len,hw,rot,mat,role='outer',o={}){
  const S=K.sub({x,y,rot});const sh=o.round?[[-hw*0.5,0],[-hw,len*0.42],[-hw*0.72,len*0.8],[0,len],[hw*0.72,len*0.8],[hw,len*0.42],[hw*0.5,0]]:[[-hw*0.5,0],[-hw,len*0.36],[-hw*0.6,len*0.74],[0,len],[hw*0.6,len*0.74],[hw,len*0.36],[hw*0.5,0]];
  S.Ro(sh,mat,role,o);
  if(o.inner)S.L(sh.map(([a,b])=>[a*0.62,len*0.12+b*0.74]),'detail',{lod:o.inner});
  if(o.rib)S.L([[0,len*0.08],[0,len*0.8]],'detail',{lod:o.rib,raw:true});
}
// a U-shaped hanging curve from (-a,y0) to (a,y0) dipping d
const mkU=(a,y0,d,cx=0)=>[[cx-a,y0],[cx-a*0.84,y0-d*0.5],[cx-a*0.5,y0-d*0.88],[cx,y0-d],[cx+a*0.5,y0-d*0.88],[cx+a*0.84,y0-d*0.5],[cx+a,y0]];
// arc band between radii, as a polygon
const mkArcBand=(cx,cy,r0,r1,a0,a1,n=18)=>{const o=[],i=[];for(let k=0;k<=n;k++){const a=a0+(a1-a0)*k/n;const p=mkPol(r1,a),q=mkPol(r0,a);o.push([cx+p[0],cy+p[1]]);i.push([cx+q[0],cy+q[1]]);}return o.concat(i.reverse());};

/* The drawing of each part (face, crown, hands, limbs, cloth, jewellery) is in murti-art.js. */
function mkNeck(K,sk,w=3.5,len=5.2){K.Rp([[-w,1.4],[w,1.4],[w*1.22,-len],[-w*1.22,-len]],sk,'outer',{ns:true});K.M(s=>K.L([[s*w,1.2],[s*w*1.04,-2.4],[s*w*1.24,-len+0.3]],'outer'));
  K.L([[-w*0.95,-1.7],[0,-2.25],[w*0.95,-1.7]],'detail',{lod:2});K.L([[-w*1.02,-3.2],[0,-3.8],[w*1.02,-3.2]],'detail',{lod:2});}
// hair falling behind the shoulders (drawn before the body). len = how far below the chin it reaches
function mkLongHair(K,o={}){const len=o.len||16,w=o.w||9.5,wild=o.wild;
  const side=s=>{const a=[[s*5.0,13.0],[s*6.6,10],[s*(w*0.86),4],[s*w,-2],[s*(w+(wild?3.5:0.8)),-len*0.55],[s*(w+(wild?6:0.2)),-len]];return a;};
  const R=side(1),Lf=side(-1).reverse();
  const hem=[];const n=wild?9:5;for(let i=0;i<=n;i++){const u=i/n,x=lerp(R[R.length-1][0],-R[R.length-1][0],u);hem.push([x,-len-(i%2?(wild?2.4:1.0):0)-(wild?1.5*Math.sin(u*Math.PI):0)]);}
  K.R([[0,14.6]].concat(R,hem.slice(1,-1),Lf),'hair','outer',o.solid?{paint:'ink'}:null);
  if(!o.solid){const m=wild?7:4;K.M(s=>{for(let i=1;i<=m;i++){const u=i/(m+1),x0=5.2+u*(w-5.2),ph=i*1.3;
    K.L([[s*(4.6+u*1.8),11.5-u*5],[s*(x0+1.2+0.7*Math.sin(ph)),0],[s*(x0+0.9*Math.sin(ph+1)+(wild?u*3:0)),-len*0.5],[s*(x0+(wild?u*5:0)+0.8*Math.sin(ph+2)),-len*0.94]],'detail',{lod:i%2?1:2});}});}
}

/* ================= crowns =================
   origin at the middle of the hairline; w = half-width of the brow band. Bands arch upward at the centre,
   as rings above eye level do. */

/* ================= haloes ================= (origin at the centre of the head) */

/* ================= body ================= */
// a two-segment limb as ONE outline: the outside of the bend is rounded, the inside meets on the bisector
function mkLimbPoly(a,b,c,W){
  const U=(p,q)=>{const d=[q[0]-p[0],q[1]-p[1]],l=Math.hypot(d[0],d[1])||1;return[d[0]/l,d[1]/l];};const u1=U(a,b),u2=U(b,c),n1=[-u1[1],u1[0]],n2=[-u2[1],u2[0]];
  const cross=u1[0]*u2[1]-u1[1]*u2[0],we=W(0,1);
  const side=sg=>{const pts=[];for(let i=0;i<4;i++){const q=mkLerp(a,b,i/4),w=W(0,i/4);pts.push([q[0]+sg*n1[0]*w,q[1]+sg*n1[1]*w]);}
    if(cross*sg>0){let d=[sg*(n1[0]+n2[0]),sg*(n1[1]+n2[1])];const l=Math.hypot(d[0],d[1])||1;d=[d[0]/l,d[1]/l];const cs=Math.max(0.45,sg*(n1[0]*d[0]+n1[1]*d[1]));pts.push([b[0]+d[0]*we/cs,b[1]+d[1]*we/cs]);}
    else for(let i=0;i<=4;i++){let d=[sg*lerp(n1[0],n2[0],i/4),sg*lerp(n1[1],n2[1],i/4)];const l=Math.hypot(d[0],d[1])||1;pts.push([b[0]+d[0]/l*we,b[1]+d[1]/l*we]);}
    for(let i=1;i<=4;i++){const q=mkLerp(b,c,i/4),w=W(1,i/4);pts.push([q[0]+sg*n2[0]*w,q[1]+sg*n2[1]*w]);}return pts;};
  const Lp=side(1),Rp=side(-1),w0=W(0,0),cap=[];for(let i=1;i<6;i++){const t=i/6*Math.PI;cap.push([a[0]-n1[0]*w0*Math.cos(t)-u1[0]*w0*Math.sin(t),a[1]-n1[1]*w0*Math.cos(t)-u1[1]*w0*Math.sin(t)]);}
  return G.chaikin(Lp.concat(Rp.reverse(),cap),true,2);
}
/* hands — local frame: wrist at the origin, fingers toward +y, about 11 long.
   The thumb is on +x; pass flip for the other hand. */
// a foot seen from above with the sole turned up: ankle at the origin, toes toward −x
function mkFootSole(K,sk){
  K.R([[0.8,1.5],[-2.5,2.2],[-6.4,2.45],[-9.0,2.2],[-9.9,0.6],[-9.6,-1.5],[-7,-2.2],[-3,-2.0],[0.6,-1.5],[1.4,0]],sk,'outer');
  for(const [x,y,r] of [[-10.5,1.8,1.0],[-10.95,0.5,0.78],[-10.9,-0.55,0.7],[-10.65,-1.45,0.62],[-10.15,-2.25,0.54]])K.C(x,y,r,sk,'outer',{n:12});
  K.L([[-8.6,1.7],[-9.05,0],[-8.4,-1.7]],'detail',{lod:2});K.L([[-1,-0.8],[-4.5,-0.2],[-7.5,-0.9]],'detail',{lod:3});
}
// a foot seen from the front: ankle at the origin, sole on y = −4
function mkFootFront(K,sk,o={}){
  K.R([[-1.9,0.6],[-2.3,-1.4],[-3.3,-3.2],[-3.2,-4.0],[2.9,-4.0],[3.0,-3.0],[2.2,-1.4],[1.9,0.6]],sk,'outer');
  for(const [x,r] of [[-2.4,0.82],[-1.0,0.66],[0.15,0.62],[1.2,0.56],[2.15,0.5]])K.C(x,-3.75,r,sk,'outer',{n:10});
  if(o.anklet!==false){K.Rp(mkArcBand(0,3.2,3.2,4.0,236,304,8),'metal','inner');K.beads([[-1.7,-0.9],[0,-1.25],[1.7,-0.9]],0.75,0.2,{lod:2});}
}
function mkAnklet(K,x,y,rot=0){const S=K.sub({x,y,rot});S.Rp([[-2.3,-0.45],[2.3,-0.45],[2.3,0.45],[-2.3,0.45]],'metal','inner');S.beads([[-2.0,-0.95],[0,-1.1],[2.0,-0.95]],0.8,0.22,{lod:2});}

/* legs and lower garment, seated cross-legged (origin at the seat). pose 'padma' | 'lalita' (one leg hanging) */
/* legs standing (origin on the ground, hips at y = 62). o.stance 'sama' | 'cross' */
// waist band with clasp, hanging swags and tassels, and knotted sash ends flying to the sides
function mkBelt(K,y,hw,o={}){
  const band=[],bandIn=[];for(let i=0;i<=12;i++){const u=i/6-1;band.push([u*hw,y+1.0-0.9*(1-u*u)]);bandIn.push([u*hw,y-0.8-0.9*(1-u*u)]);}
  if(o.sash!==false)K.M(s=>{const x=s*hw*0.98;
    for(const [dir,len,sp] of [[s>0?-28:208,12.5,30],[s>0?-62:242,9.5,26]]){const hem=[];for(let i=0;i<=6;i++){const a=dir+(i/6-0.5)*sp,p=mkPol(len*(i%2?0.88:1),a);hem.push([x+p[0],y+p[1]]);}
      K.Rp([[x,y+0.7]].concat(s>0?hem.slice().reverse():hem,[[x,y-0.7]]),'sash','outer');
      for(let i=1;i<6;i++)K.L([[x+(hem[i][0]-x)*0.12,y+(hem[i][1]-y)*0.12],hem[i]],'detail',{raw:true,lod:i%2?1:2});
      K.L(hem.map(([a,b])=>[x+(a-x)*0.84,y+(b-y)*0.84]),'detail',{raw:true,lod:2});}
    K.C(x,y+0.1,1.3,'sash','inner');K.L([[x-0.6,y+0.5],[x+0.2,y-0.1],[x-0.4,y-0.7]],'detail',{lod:3});});
  K.Rp(band.concat(bandIn.reverse()),'metal','outer');
  for(let j=0;j<9;j++){const u=(j-4)/4.6;if(j%2)K.D(u*hw,y+0.1-0.9*(1-u*u),0.26,'detail',{lod:1});else K.Rp(G.ellipse(u*hw,y+0.1-0.9*(1-u*u),0.6,0.42,10),'gem','detail',{lod:2});}
  K.C(0,y-0.9,1.7,'metal','inner');K.C(0,y-0.9,0.85,'gem','detail');for(let i=0;i<8;i++){const p=mkPol(1.28,i*45);K.D(p[0],y-0.9+p[1],0.17,'detail',{lod:3});}
  if(o.swags!==false){K.M(s=>{K.beads(mkU(hw*0.42,y-1.2,3.2,s*hw*0.5),0.8,0.22,{lod:2});K.beads(mkU(hw*0.3,y-1.4,5.2,s*hw*0.5),0.85,0.22,{lod:3});});
    for(const x of [-hw*0.5,0,hw*0.5]){K.beads([[x,y-2.8],[x,y-4.6]],0.8,0.22,{lod:2});mkPetal(K,x,y-4.7,1.4,0.5,180,'metal','detail',{round:true,lod:2});}}
}

/* ================= jewellery ================= (torso coordinates) */
function mkThread(K,o={}){const p=o.path||[[9.2,39.9],[3,31],[-5,21],[-8.8,13.2]];K.L(p,'inner');K.L(p.map(([x,y])=>[x+0.55,y+0.25]),'detail',{lod:2});}

/* ================= re-mixable parts =================
   mkDef registers a part in a slot AND as a motif of its own, so it can be a hero, a filler or
   a border unit in any tradition. Frames: aureole — origin at the centre of the head;
   seat — origin at the middle of the seat's top; crown — origin at the middle of the hairline;
   held — origin at the grip, the thing's own axis along +y. */
function mkDef(slot,key,meta,draw){
  MK.slot[slot][key]={key,draw};
  defMotif(key,Object.assign({upright:true,slot,part:true,fn(rng,g){const K=mkCtx(rng,g);draw(K,{solo:true});return fitParts(K.P.filter(p=>!p.lod||p.lod<3));}},meta));
}
// draw a slot part at a transform. Parts from other cultures (any motif tagged with the slot) are fitted to the same anchor.
function mkPlace(K,slot,key,xf,o={}){
  const d=MK.slot[slot][key];if(d){d.draw(K.sub(xf),o);return;}
  const M=SG.motifs[key];if(!M)return;const parts=M.fn(K.rng,K.g),b=hgBBox(parts);
  const fit=slot==='held'?(o.len||26)/b.h:slot==='crown'?(o.w||5.7)*2.9/b.w:slot==='seat'?(o.hw||31)*2/b.w:(o.r||15)*2.6/Math.max(b.w,b.h);
  const ax=b.cx,ay=slot==='held'?b.y1-b.h*(M.grip!=null?M.grip:0.3):slot==='crown'?b.y1:slot==='seat'?b.y0:b.cy;
  const S=K.sub(xf),mp=([x,y])=>[(x-ax)*fit,-(y-ay)*fit];
  for(const p of parts){if(p.kind==='dot'){const q=mp([p.x,p.y]);S.D(q[0],q[1],p.r*fit,p.role);}
    else if(p.kind==='region')S.Rp(p.pts.map(mp),slot==='held'?'held':slot,p.role);else S.Lc(p.pts.map(mp),p.role).closed=!!p.closed;}
}
// canonical part, or — in proportion to how blended the genome is — one drawn from the merged vocabularies
function mkPick(K,slot,canon){
  if(canon===false)return null;
  // the ring pool shows whether the genome is a blend, even when a subject is set by hand
  const g=K.g,v=g.motifs&&g.motifs.ring;const blend=v&&v.pool?4*v.t*(1-v.t)*0.6:0;const remix=g.motifs&&g.motifs.remix!=null?g.motifs.remix:blend;
  if(!(remix>0)||K.rng.next()>=remix)return canon;
  const pool=[...new Set([...poolAll(g.motifs.hero),...poolAll(g.motifs.ring),...poolAll(g.motifs.filler),...poolAll(g.motifs[slot])])].filter(k=>SG.motifs[k]&&SG.motifs[k].slot===slot);
  const all=pool.length>1?pool:Object.keys(SG.motifs).filter(k=>SG.motifs[k].slot===slot&&(g.motifs.remix!=null||SG.motifs[k].part));
  return all.length?K.rng.pick(all):canon;
}

/* ---------- seats ---------- */
mkDef('seat','padmaPitha',{name:'Lotus throne',term:'padmapīṭha',meaning:'The double lotus on which a deity sits or stands: a row of petals turned up, a row turned down, a beaded waist between. Whoever sits on it is untouched by the mud it grew from.'},
(K,o)=>{const hw=o.hw||31;
  K.Rp(G.ellipse(0,-0.8,hw,3.4,48),'seatTop','outer');
  const n2=10;for(let pass=0;pass<2;pass++)for(let i=0;i<n2+(pass?0:-1);i++){const x=-hw*0.9+(i+(pass?0.5:1))*hw*1.8/n2,u=x/hw;
    mkPetal(K,x,-6.2,pass?6.9:7.6,hw*1.8/n2*(pass?0.6:0.42),180+u*40,pass?'seat':'seat2',pass?'outer':'inner',pass?{inner:2,rib:2}:{lod:2});}
  K.Rp(G.roundRect(-hw*0.93,4.6,hw*0.93,6.2,0.8).map(([x,y])=>[x,-y]),'seat2','outer');K.beads([[-hw*0.9,-5.4],[hw*0.9,-5.4]],1.3,0.3,{lod:1});
  const n1=9;for(let pass=0;pass<2;pass++)for(let i=0;i<n1+(pass?0:-1);i++){const x=-hw*0.9+(i+(pass?0.5:1))*hw*1.8/n1,u=x/hw;
    mkPetal(K,x,-4.6,pass?7.4:8.4,hw*1.8/n1*(pass?0.56:0.4),-u*44,pass?'seat':'seat2',pass?'outer':'inner',pass?{inner:2,rib:2}:{lod:2});}
  K.Rp(G.roundRect(-hw*0.96,12.6,hw*0.96,14.0,0.7).map(([x,y])=>[x,-y]),'seat2','outer');});
mkDef('seat','bhadraPitha',{name:'Cushioned pedestal',term:'bhadrapīṭha',meaning:'A rectangular throne with scrolled ends, a cloth falling over its front and a moulded base — the seat of calendar-print gods.'},
(K,o)=>{const hw=o.hw||31;const rr=(a,b,c,d,r)=>G.roundRect(a,-d,c,-b,r).map(([x,y])=>[x,-y]);
  K.Rp(rr(-hw*0.86,-10.6,hw*0.86,-2.4,1),'seat','outer');
  K.M(s=>{K.C(s*hw*0.9,-6.4,3.9,'seat2','outer');K.L((()=>{const p=[];for(let i=0;i<=22;i++){const t=i/22*Math.PI*3.2,r=3.3*(1-i/26);p.push([s*(hw*0.9+Math.cos(t)*r),-6.4+Math.sin(t)*r]);}return p;})(),'detail',{raw:true,lod:1});
    for(let i=0;i<5;i++)K.L([[s*(hw*0.3+i*3.2),-3.4],[s*(hw*0.3+i*3.2),-9.6]],'detail',{raw:true,lod:2});});
  K.Rp(rr(-hw,-2.6,hw,0,1.3),'seat2','outer');K.beads([[-hw*0.95,-1.3],[hw*0.95,-1.3]],1.5,0.3,{lod:1});
  K.Rp([[-9,0],[9,0],[8,-9.6],[5.5,-8.2],[2.8,-10.3],[0,-8.6],[-2.8,-10.3],[-5.5,-8.2],[-8,-9.6]],'pleat','outer');
  for(const x of [-6,-3,0,3,6])K.L([[x*0.9,-0.6],[x,-8.6]],'detail',{raw:true,lod:1});K.L([[-8.6,-6.8],[-4,-6.0],[0,-6.6],[4,-6.0],[8.6,-6.8]],'detail',{lod:2});
  K.Rp(rr(-hw*1.04,-14,hw*1.04,-10.6,1),'seat2','outer');const n=14;for(let i=0;i<n;i++){const x=-hw+(i+0.5)*hw*2/n;mkPetal(K,x,-10.9,2.6,hw/n*0.72,180,'seat','detail',{round:true,lod:2});}});
mkDef('seat','sheshaCoils',{name:'Serpent coils',term:'Śeṣa / Ananta',meaning:'The coils of the endless serpent on which Viṣṇu rests between ages of the world; its hoods rise behind him as a canopy.'},
(K,o)=>{const hw=o.hw||31;const rr=(a,b,c,d,r)=>G.roundRect(a,-d,c,-b,r).map(([x,y])=>[x,-y]);
  K.T([[-hw*0.7,-17],[-hw*1.05,-19.5],[-hw*1.3,-17.5],[-hw*1.36,-13.5]],t=>2.6-2.1*t,'snake','outer');
  [[0.94,-21,-14],[1.05,-14,-7],[0.98,-7,0]].forEach(([k,y0,y1],j)=>{K.Rp(rr(-hw*k,y0,hw*k,y1,3.4),'snake','outer');
    K.L([[-hw*k+2.5,y0+2.6],[0,y0+2.2],[hw*k-2.5,y0+2.6]],'inner',{lod:1});const n=Math.round(hw*k*2/2.6);for(let i=1;i<n;i++){const x=-hw*k+i*hw*k*2/n;K.L([[x,y0+0.3],[x,y0+2.4]],'detail',{raw:true,lod:2});}
    for(let r=0;r<2;r++)for(let i=0;i<Math.round(hw*k*2/3.4)-1;i++){const x=-hw*k+2.6+i*3.4+(r%2)*1.7;K.L([[x,y0+4.9-r*1.5],[x+0.85,y0+3.9-r*1.5],[x+1.7,y0+4.9-r*1.5]],'detail',{lod:3});}});});
mkDef('seat','shilaPitha',{name:'Rock seat',term:'śilā',meaning:'A seat of piled rock — the mountain: Kailāsa for Śiva, the cremation ground for Kālī.'},
(K,o)=>{const hw=o.hw||31;const r=makeRng(11);
  for(let row=0;row<2;row++){let x=-hw*(row?1.02:0.9);while(x<hw*(row?0.98:0.82)){const w=r.range(9,15),h=r.range(5.5,8),y0=row?-14:-8.2;
      K.R([[x,y0],[x+w*0.08,y0+h*0.7],[x+w*0.35,y0+h],[x+w*0.72,y0+h*0.92],[x+w,y0+h*0.5],[x+w*0.98,y0],[x+w*0.5,y0-0.5]],'rock','outer');
      K.L([[x+w*0.3,y0+h*0.9],[x+w*0.45,y0+h*0.5],[x+w*0.32,y0+h*0.12]],'detail',{lod:2});K.L([[x+w*0.66,y0+h*0.84],[x+w*0.74,y0+h*0.4]],'detail',{lod:3});x+=w*0.86;}}
  K.R([[-hw*0.84,-3.4],[-hw*0.74,-0.6],[-hw*0.3,0.4],[hw*0.2,0.2],[hw*0.74,-0.4],[hw*0.86,-3.2],[hw*0.6,-5.2],[0,-5.8],[-hw*0.6,-5.4]],'rock','outer');K.L([[-hw*0.5,-2.0],[-hw*0.1,-3.0],[hw*0.4,-2.2]],'detail',{lod:2});});

/* ---------- aureoles ---------- */
mkDef('aureole','sirasChakra',{name:'Petalled halo',term:'śiraścakra',meaning:'The disc of light behind a deity\'s head, rimmed with beads and lotus petals.'},(K,o)=>mkHalo(K,{kind:'siras',r:o.r||13.6}));
mkDef('aureole','ratnaPrabha',{name:'Jewelled halo',term:'prabhāmaṇḍala',meaning:'A halo ring set with gems.'},(K,o)=>mkHalo(K,{kind:'gems',r:o.r||13.6}));
mkDef('aureole','kiranaPrabha',{name:'Halo of rays',term:'kiraṇa',meaning:'Light drawn as fine rays, long and short by turns, behind the head.'},(K,o)=>mkHalo(K,{kind:'rays',r:o.r||14.5}));
mkDef('aureole','nagaPhana',{name:'Cobra-hood canopy',term:'nāga-phaṇa',meaning:'Five or seven cobra hoods fanned over the head: Śeṣa sheltering Viṣṇu, a nāga king sheltering the Buddha or a Jina. Protection by the most dangerous of creatures.'},
(K,o)=>{const n=o.heads||7,pv=[0,-7];const idx=[];for(let i=0;i<n;i++)idx.push(i-(n-1)/2);idx.sort((a,b)=>Math.abs(b)-Math.abs(a));
  if(!o.solo)K.T([[0,-44],[0,-24],[0,-9]],t=>8-1.5*t,'snake','outer');
  for(const i of idx){const a=i*(n>5?25.5:31),sc=1.2-0.09*Math.abs(i),R=23+1.2*Math.abs(i);const base=[pv[0]+Math.sin(a*DEG)*R,pv[1]+Math.cos(a*DEG)*R];
    K.T([[i*1.7,-12],[base[0]*0.5,pv[1]+(base[1]-pv[1])*0.45],[base[0]*0.97,base[1]-0.6]],t=>3.6-0.9*t,'snake','outer');
    const S=K.sub({x:base[0],y:base[1],rot:-a*0.74,s:sc});
    S.Ro([[-1.8,-1.2],[-4.9,3.2],[-5.3,7.2],[-3.7,10.6],[-1.6,12.6],[0,13.3],[1.6,12.6],[3.7,10.6],[5.3,7.2],[4.9,3.2],[1.8,-1.2]],'snake','outer');
    S.Ro([[-1.5,-1.2],[-2.6,3.4],[-2.5,7.2],[-1.4,9.8],[0,10.5],[1.4,9.8],[2.5,7.2],[2.6,3.4],[1.5,-1.2]],'snakeBelly','inner');
    for(const y of [0.2,1.7,3.2,4.7,6.2,7.7])S.L([[-2.45,y+0.3],[0,y-0.2],[2.45,y+0.3]],'detail',{lod:2});
    S.M(s=>{S.D(s*1.25,11.3,0.34,'outer');S.L([[s*3.2,4.2],[s*4.0,6.4],[s*3.4,8.6]],'detail',{lod:3});});
    S.L([[-0.9,12.2],[0,11.9],[0.9,12.2]],'detail',{lod:2});S.L([[0,13.3],[0,14.7]],'inner',{raw:true,lod:1});S.M(s=>S.L([[0,14.7],[s*0.6,15.6]],'inner',{raw:true,lod:1}));}});
function mkFlame(K,x,y,s,rot){const S=K.sub({x,y,rot,s});S.R([[-1.7,0],[-2.5,1.8],[-1.5,3.3],[-2.2,5.2],[-0.7,4.3],[0,7.4],[0.9,4.5],[2.3,5.4],[1.6,3.1],[2.5,1.6],[1.7,0],[0,-0.5]],'flame','outer');S.L([[-0.5,0.6],[-0.2,2.6],[0,4.6]],'detail',{lod:2});}
mkDef('aureole','jvalaPrabha',{name:'Flame aureole',term:'prabhāvalī / jvālā-mālā',meaning:'An arch of fire around the whole figure, a ring of flame-tongues on a beaded band: the deity\'s radiance, and the burning away of ignorance.'},
(K,o)=>{const cy=o.cy!=null?o.cy:-24,rx=o.rx||36,ry=o.ry||53,a0=-26,a1=206;
  const E=(k,a)=>[k*rx*Math.cos(a*DEG),cy+k*ry*Math.sin(a*DEG)];const oA=[],iA=[];for(let i=0;i<=60;i++){const a=a0+(a1-a0)*i/60;oA.push(E(1,a));iA.push(E(0.925,a));}
  for(let i=0;i<=17;i++){const a=a0+6+(a1-a0-12)*i/17;const p=E(1.0,a);const tx=-rx*Math.sin(a*DEG),ty=ry*Math.cos(a*DEG);mkFlame(K,p[0],p[1],i%2?0.95:1.3,Math.atan2(-tx,ty)/DEG+180);}
  K.Rp(oA.concat(iA.slice().reverse()),'halo','outer');for(let i=0;i<46;i++){const p=E(0.962,a0+(a1-a0)*(i+0.5)/46);if(i%3===1)K.Rp(G.ellipse(p[0],p[1],1.0,0.75,10),'gem','detail',{lod:1});else K.D(p[0],p[1],0.36,'detail',{lod:2});}
  K.L(iA.map(([x,y])=>[x*0.98,cy+(y-cy)*0.98]),'detail',{raw:true,lod:2});});

/* ---------- crowns ---------- */
mkDef('crown','kiritaMukuta',{name:'Tall crown',term:'kirīṭa-mukuṭa',meaning:'The tall tiered crown of Viṣṇu and his avatars: a jewelled brow band, a drum with a sun medallion, a dome of petals rising to a bud, and leaf ornaments over the ears.'},(K,o)=>mkCrown(K,{kind:'kirita',medal:'sun',w:o.w,h:o.h||18.5}));
mkDef('crown','karandaMukuta',{name:'Tiered crown',term:'karaṇḍa-mukuṭa',meaning:'A cone of diminishing rounded tiers, like a stack of bowls: the crown of goddesses, of Gaṇeśa and of attendant gods.'},(K,o)=>mkCrown(K,{kind:'karanda',w:o.w,h:o.h||16.5}));
mkDef('crown','jataMukuta',{name:'Crown of matted locks',term:'jaṭā-mukuṭa',meaning:'The ascetic\'s hair piled and bound into a crown: Śiva\'s, with the crescent moon tucked into it and the river Gaṅgā springing from the top.'},(K,o)=>mkJata(K,o));

/* ---------- things held ---------- */
mkDef('held','sudarshana',{name:'Discus',term:'Sudarśana cakra',meaning:'Viṣṇu\'s whirling discus, balanced on a raised finger: the wheel of time and the mind\'s sharpness, edged with flame.'},
(K)=>{const cy=6.6,r=5.5;for(const a of [90,0,180,45,135]){const p=mkPol(r+0.2,a);mkFlame(K,p[0],cy+p[1],a===90?0.62:0.46,a-90);}
  K.C(0,cy,r,'metal','outer',{n:36});K.ring(0,cy,r-1.0,'inner',{n:30});K.C(0,cy,1.5,'gem','inner');K.D(0,cy,0.4);
  for(let i=0;i<8;i++){const a=i*45+22.5,p=mkPol(1.5,a);mkPetal(K,p[0],cy+p[1],2.9,0.85,a-90,'metal','detail',{lod:1});}
  for(let i=0;i<24;i++){const p=mkPol(r-0.5,i*15);K.D(p[0],cy+p[1],0.2,'detail',{lod:3});}});
mkDef('held','shankha',{name:'Conch',term:'Pāñcajanya śaṅkha',meaning:'Viṣṇu\'s conch, whose sound is the first sound, Om; blown at the start of worship and of battle.'},
(K)=>{K.R([[0,-0.6],[2.7,1.4],[4.0,4.6],[3.7,7.6],[2.3,9.6],[1.0,10.9],[0,12.6],[-1.0,10.9],[-2.5,9.4],[-3.7,7.2],[-3.9,4.4],[-2.5,1.2]],'conch','outer');
  K.L([[1.3,0.6],[2.9,4.2],[2.2,7.8],[0.6,9.6]],'inner');K.L([[-3.5,7.6],[-1.6,8.6],[1.6,8.6]],'detail',{lod:1});K.L([[-2.4,9.6],[-0.8,10.2],[1.0,10.1]],'detail',{lod:2});K.L([[-1.2,11.0],[0,11.4],[0.6,11.2]],'detail',{lod:2});
  K.L([[-3.0,3.0],[-1.2,5.6],[-0.4,8.2]],'detail',{lod:3});mkFlame(K,0,12.4,0.5,0);});
mkDef('held','gada',{name:'Mace',term:'Kaumodakī gadā',meaning:'The mace: strength under command. Viṣṇu\'s rests head-down beside him; Hanumān carries his on the shoulder.'},
(K)=>{K.T([[0,-7],[0,17.5]],t=>0.95-0.2*t,'metal','outer',{raw:true});K.C(0,-7.6,1.4,'metal','outer');for(const y of [-4,2,8,13])K.Rp([[-1.2,y-0.4],[1.2,y-0.4],[1.2,y+0.4],[-1.2,y+0.4]],'metal','inner',{lod:1});
  K.Rp(G.roundRect(-2.6,-18.6,2.6,-17.2,0.6).map(([x,y])=>[x,-y]),'metal','outer');K.Rp(G.ellipse(0,23.4,5.0,5.6,36),'metal','outer');
  for(const x of [-3.2,-1.6,0,1.6,3.2]){const h=5.4*Math.sqrt(1-Math.pow(x/5.2,2));K.L([[x*0.55,23.4+h],[x,23.4],[x*0.55,23.4-h]],'inner',{lod:1});}
  K.Rp(G.ellipse(0,23.4,5.0,1.0,24),'gem','detail',{lod:2});mkPetal(K,0,28.6,3.6,1.5,0,'metal','outer',{round:true,rib:3});K.D(0,32.6,0.42,'outer');});
mkDef('held','padmaKara',{name:'Lotus in hand',term:'līlā-kamala',meaning:'A lotus held lightly by its stem: beauty, detachment, the opening of the heart.'},
(K)=>{K.T([[0,-6],[-0.6,0],[0.6,5],[0.2,8.5]],0.34,'stem','outer');mkPetal(K,-0.4,-2,3.2,1.1,70,'stem','inner',{lod:1,rib:3});
  for(const a of [-64,64,-42,42])mkPetal(K,0.2,8.6,5.2,1.5,a,'lotus','inner',{lod:1});for(const a of [-22,22,0])mkPetal(K,0.2,8.6,6.4,1.9,a,'lotus','outer',{inner:3,rib:2});
  K.Ro([[-1.9,8.6],[-1.2,7.6],[0.2,7.2],[1.6,7.6],[2.3,8.6]],'stem','inner');});
mkDef('held','trishul',{name:'Trident',term:'triśūla',meaning:'Śiva\'s trident: the three qualities of nature, or waking, dream and sleep, held on one shaft. The hourglass drum tied to it beats the rhythm of creation.'},
(K)=>{K.T([[0,-34],[0,21]],t=>0.85,'metal','outer',{raw:true});K.C(0,-34.6,1.2,'metal','outer');
  K.M(s=>{K.T([[s*0.6,20.5],[s*5.2,21.5],[s*7.0,26],[s*5.6,31.5],[s*4.6,35.2]],t=>1.25-1.0*t,'metal','outer');});
  K.Ro([[-1.3,20.5],[-2.0,26],[-1.3,31],[0,37.5],[1.3,31],[2.0,26],[1.3,20.5]],'metal','outer');K.L([[0,22],[0,35.5]],'detail',{raw:true,lod:2});
  K.Rp(G.roundRect(-3.0,-21.2,3.0,-19.6,0.6).map(([x,y])=>[x,-y]),'metal','outer');
  // ḍamaru: hourglass drum on a cord, and a ribbon
  K.Rp([[-3.6,15.6],[3.6,15.6],[0.9,13.2],[3.6,10.8],[-3.6,10.8],[-0.9,13.2]],'wood','outer');K.L([[-3.6,15.6],[3.6,10.8]],'detail',{raw:true,lod:2});K.L([[3.6,15.6],[-3.6,10.8]],'detail',{raw:true,lod:2});
  K.T([[0.9,13.2],[4.6,11.6],[6.4,7.6],[5.2,4.0]],t=>0.9-0.6*t,'sash','inner',{lod:1});K.T([[-0.9,13.2],[-4.2,10.6],[-5.2,6.6]],t=>0.8-0.5*t,'sash','inner',{lod:1});});
mkDef('held','kodanda',{name:'Bow',term:'Kodaṇḍa dhanus',meaning:'Rāma\'s great bow, taller than its bearer, strung and at rest: power that is held, not loosed.'},
(K)=>{K.T([[3.0,-33],[-0.6,-28],[-4.4,-15],[-2.4,-5],[0,0],[-2.4,5],[-4.4,15],[-0.6,28],[3.0,33]],t=>0.42+0.72*Math.sin(Math.PI*t),'wood','outer');
  K.L([[3.0,-33],[3.0,33]],'inner',{raw:true});for(const y of [-1.6,0,1.6])K.L([[-1.1,y],[1.1,y]],'detail',{raw:true,lod:1});
  K.M(s=>{K.T([[3.0,s*33],[4.4,s*34.6],[3.6,s*36.4],[2.4,s*35.6]],t=>0.5-0.35*t,'wood','outer');for(const d of [10,20])K.Rp([[-4.6+d*0.02,s*d-0.5],[-2.6-d*0.04,s*d-0.5],[-2.6-d*0.04,s*d+0.5],[-4.6+d*0.02,s*d+0.5]],'metal','detail',{lod:2});});
  K.beads([[3.6,36],[5.0,32],[4.6,28]],1.0,0.26,{lod:1});mkPetal(K,4.6,27.6,3.4,1.0,180,'sash','inner',{lod:1});});
mkDef('held','bana',{name:'Arrow',term:'bāṇa',meaning:'The arrow that does not miss: resolve, and a word once given.'},
(K)=>{K.T([[0,-12],[0,12]],0.28,'wood','outer',{raw:true});mkPetal(K,0,11.6,4.2,1.25,0,'metal','outer',{rib:2});
  K.M(s=>{for(const y of [-11.5,-9.7,-7.9])K.Rp([[0,y],[s*1.9,y-1.5],[s*1.9,y+0.3],[0,y+1.7]],'feather','inner');});});

/* ================= assembly ================= */
// o: {pose:'seat'|'stand', legs:'padma'|'lalita', torso:'m'|'f'|'v'|'belly', skin, cloth, aureole, seat, crown, hair, face:{…}, head(K,Hd), arms:[…], extra(K,B), garland, thread, …}
function mkFigure(rng,g,o){
  const K=mkCtx(rng,g),sk=o.skin||'skin',stand=o.pose==='stand',by=stand?52:0,k=o.torso==='f'?0.84:o.torso==='v'?1.06:1;
  const B=K.sub({y:by}),hx=o.headX||0,hy=44+by+(o.headY||0),Hd=K.sub({x:hx,y:hy,rot:o.headTilt||0,s:o.headS||1});
  const au=mkPick(K,'aureole',o.aureole);if(au)mkPlace(K,'aureole',au,{x:hx,y:hy+7},{cy:stand?-46:-24,ry:stand?80:53,rx:stand?40:36,heads:o.heads,r:o.haloR});
  if(!stand){const st=mkPick(K,'seat',o.seat);if(st)mkPlace(K,'seat',st,{x:0,y:0},{});}else if(o.seat)mkPlace(K,'seat',mkPick(K,'seat',o.seat),{x:0,y:0},{});
  if(o.behind)o.behind(K,B);
  if(o.hair==='long'||o.hair==='wild')mkLongHair(Hd,{len:o.hairLen||(o.hair==='wild'?58:20),w:o.hair==='wild'?13:9.5,wild:o.hair==='wild'});
  const arm=a=>{const dir=mkArm(B,a.sh,a.el,a.wr,{skin:sk,k:k*(a.k||1),armlet:a.armlet,bangles:a.bangles});
    const hr=(a.handRot!=null?a.handRot:dir)-90,Hs=B.sub({x:a.wr[0],y:a.wr[1],rot:hr,s:(a.hs||1)*(o.torso==='f'?0.9:1),flip:!!a.flip});
    const key=a.hold?mkPick(K,'held',a.hold):null;const gp=a.hand==='kataka'?[1.75,6.6]:a.hand==='flat'?[0.6,6.8]:a.hand==='abhaya'?[0,8]:[0,2.9];
    const put=()=>{if(!key)return;const w=Hs.tp(gp),hrot=(a.holdRot!=null?a.holdRot:90),off=a.holdOff||0;mkPlace(K,'held',key,{x:w[0]+Math.cos(hrot*DEG)*off,y:w[1]+Math.sin(hrot*DEG)*off,rot:hrot-90,s:a.holdS||1},{len:a.holdLen||26});};
    if(a.hand!=='flat')put();if(a.hand)mkHand(Hs,a.hand,{skin:sk});if(a.hand==='flat')put();};
  for(const a of (o.arms||[]).filter(a=>a.back))arm(a);
  if(o.customLegs)o.customLegs(K);else if(stand)mkLegsStanding(K,{skin:sk,cloth:o.cloth,stance:o.stance,bare:o.bareLegs});else mkLegsSeated(K,{skin:sk,cloth:o.cloth,pose:o.legs,pleats:o.pleats});
  mkTorso(B,{kind:o.torso||'m',skin:sk});
  if(o.extra)o.extra(K,B);
  if(o.thread!==false&&o.torso!=='f')mkThread(B,{});
  if(o.necklaces!==false)mkNecklaces(B,{w:o.torso==='f'?8.2:9.4,long:o.longHara});
  if(o.garland)mkGarland(B,mkU(o.torso==='f'?10:11.6,40.4,o.garland===true?31:o.garland));
  if(o.belt!==false)mkBelt(B,o.beltY||(o.torso==='belly'?8.6:12.2),o.torso==='belly'?13.5:o.torso==='f'?10.4:9.8,{sash:o.sash,swags:o.swags});
  mkNeck(Hd,sk,o.torso==='f'?3.0:3.5);
  if(o.head)o.head(K,Hd);else{mkFace(Hd,Object.assign({skin:sk},o.face));if(o.hair!=='none')mkHairCap(Hd,{});if(o.hair==='curls')mkCurls(Hd);}
  const cr=mkPick(K,'crown',o.crown);if(cr)mkPlace(K,'crown',cr,{x:hx,y:hy+(o.crownY!=null?o.crownY:11.8)},{w:o.crownW||6.3});
  if(o.over)o.over(K,B,Hd);
  for(const a of (o.arms||[]).filter(a=>!a.back))arm(a);
  if(o.front)o.front(K,B,Hd);
  if(o.tilt){const c=Math.cos(o.tilt*DEG),sn=Math.sin(o.tilt*DEG);const rt=([x,y])=>[x*c-y*sn,x*sn+y*c];for(const p of K.P){if(p.kind==='dot'){const q=rt([p.x,p.y]);p.x=q[0];p.y=q[1];}else p.pts=p.pts.map(rt);}}
  return fitParts(K.P);
}
const MURTI=(key,name,term,meaning,o)=>defMotif(key,{name,term,meaning,figure:true,sacred:true,fine:true,upright:true,fn(rng,g){return mkFigure(rng,g,typeof o==='function'?o(rng,g):o);}});

MURTI('vishnu','Viṣṇu on Śeṣa','Viṣṇu / Nārāyaṇa','The preserver, seated at ease on the coils of the endless serpent under its seven hoods. Four hands hold the discus, the conch, the mace and the lotus; he is dark blue and wears yellow silk, the tall crown and a garland of forest flowers.',
{pose:'seat',legs:'lalita',torso:'m',skin:'skinBlue',cloth:'clothYellow',aureole:'nagaPhana',seat:'sheshaCoils',crown:'kiritaMukuta',hair:'curls',garland:true,face:{tilak:'urdhva',earring:'makara'},
 arms:[{back:true,sh:[-12.6,37.4],el:[-29.5,29.5],wr:[-31.5,45.8],hand:'kataka',handRot:90,hold:'sudarshana'},{back:true,sh:[12.6,37.4],el:[29.5,29.5],wr:[31.5,45.8],hand:'kataka',handRot:90,flip:true,hold:'shankha'},
  {sh:[-14.4,36.8],el:[-23,17.5],wr:[-20,3.2],hand:'fist',hold:'gada',holdRot:270,holdS:0.8},{sh:[14.4,36.8],el:[23,18],wr:[17.5,33.5],hand:'kataka',handRot:90,flip:true,hold:'padmaKara'}]});
MURTI('lakshmi','Lakṣmī on the lotus','Lakṣmī / Śrī','The goddess of fortune seated on an open lotus, a lotus raised in each upper hand; one lower hand grants fearlessness and the other pours out gifts.',
{pose:'seat',legs:'padma',torso:'f',skin:'skin',cloth:'clothRed',aureole:'sirasChakra',seat:'padmaPitha',crown:'karandaMukuta',hair:'long',face:{tilak:'bindu',earring:'jhumka'},
 arms:[{back:true,sh:[-11.0,37.4],el:[-26,29.5],wr:[-27.5,44.5],hand:'kataka',handRot:90,hold:'padmaKara'},{back:true,sh:[11.0,37.4],el:[26,29.5],wr:[27.5,44.5],hand:'kataka',handRot:90,flip:true,hold:'padmaKara'},
  {sh:[-12.4,36.8],el:[-19.5,19.5],wr:[-14.5,31.5],hand:'abhaya',handRot:90},{sh:[12.4,36.8],el:[19.5,20],wr:[15.5,9.2],hand:'abhaya',handRot:270}]});


/* ---------- the elephant head ---------- (origin where the chin would be; top of the head at y≈14.6) */
function mkElephantHead(K,o={}){
  const sk=o.skin||'skin';
  K.M(s=>{K.R([[s*4.2,11.2],[s*7.5,13.7],[s*11.6,13.5],[s*13.8,10.6],[s*14.2,6.6],[s*12.8,2.4],[s*10.3,-0.7],[s*8.2,0.5],[s*7.0,2.8],[s*5.4,3.6],[s*4.6,6.5]],sk,'outer');
    K.L([[s*5.7,10.5],[s*9.5,11.7],[s*11.9,9.3],[s*12.0,5.6],[s*10.5,2.3]],'inner');K.L([[s*6.2,8.6],[s*9.2,9.4],[s*10.4,7.2],[s*10.0,4.2]],'detail',{lod:2});
    for(const [a,b] of [[12.6,4.6],[11.4,2.0],[9.6,0.5]])K.L([[s*a,b],[s*(a-1.0),b+1.3]],'detail',{raw:true,lod:3});
    for(const [a,b,c,d] of [[6.4,9.6,12.6,11.6],[6.6,7.8,13.2,7.6],[6.6,6.0,12.2,3.6]])K.L([[s*a,b],[s*(a+c)/2,(b+d)/2+0.5],[s*c,d]],'detail',{lod:2});});
  K.R([[0,14.7],[2.8,14.4],[5.0,12.9],[6.0,10.2],[5.9,7.4],[4.9,5.0],[3.5,3.3],[2.7,1.6],[0,1.2],[-2.7,1.6],[-3.5,3.3],[-4.9,5.0],[-5.9,7.4],[-6.0,10.2],[-5.0,12.9],[-2.8,14.4]],sk,'outer');
  K.L([[0,14.2],[0.35,12.6],[0,11.4]],'detail',{lod:2});K.M(s=>K.L([[s*0.6,14.1],[s*3.0,13.6],[s*4.6,12.0]],'detail',{lod:3}));
  // tusks: his right is whole, his left broken (ekadanta)
  K.T([[-2.7,3.3],[-4.3,0.6],[-4.9,-2.8]],t=>1.0-0.74*t,'ivory','outer');K.Rp([[2.2,3.9],[3.3,3.5],[4.0,1.5],[3.0,1.2]],'ivory','outer');
  // trunk, curling to his left with the tip turned up
  const tr=[[0,5.4],[0,0],[0.5,-6],[2.5,-11.6],[6.2,-13.8],[8.8,-11.8],[8.5,-8.7],[6.6,-8.0]],tw=t=>2.95-1.5*t-0.55*t*t;
  K.T(tr,tw,sk,'outer');const S=G.samples(FK.spline(tr,false,7),false,1.25),tot=S.length;
  S.forEach((q,i)=>{if(i<3||i>tot-3)return;const w=tw(i/tot)*0.82;K.L([[q.x-q.ty*w,q.y+q.tx*w],[q.x-q.tx*0.25,q.y-q.ty*0.25],[q.x+q.ty*w,q.y-q.tx*w]],'detail',{lod:i%2?1:2});});
  K.M(s=>{K.L([[s*1.2,6.9],[s*2.4,5.6],[s*2.7,3.9]],'detail',{lod:1});
    const up=[[s*1.7,8.3],[s*2.5,8.95],[s*3.5,9.0],[s*4.4,8.55]],lo=[[s*4.4,8.55],[s*3.5,8.05],[s*2.5,7.9],[s*1.7,8.3]];
    K.Rp(G.chain(FK.spline(up,false,6),FK.spline(lo,false,6)).slice(0,-1),'eye','inner');K.C(s*3.05,8.5,0.42,null,'detail',{paint:'ink',n:10});
    K.T(up,t=>0.06+0.1*Math.sin(Math.PI*t),null,'outer',{paint:'ink'});K.L([[s*1.5,9.5],[s*2.9,10.2],[s*4.7,9.6]],'inner',{lod:1});});
  K.L([[-1.6,5.6],[0,4.7],[1.6,5.6]],'detail',{lod:2});K.L([[-1.3,6.6],[0,5.9],[1.3,6.6]],'detail',{lod:3});
  K.L([[0,9.4],[0,11.2]],'inner',{raw:true});K.L([[-0.9,11.1],[-0.7,10.2],[0,9.9],[0.7,10.2],[0.9,11.1]],'inner');K.R([[0,9.7],[0.32,9.3],[0,8.9],[-0.32,9.3]],null,'detail',{paint:'accent'});
}
mkDef('crown','mayuraMukuta',{name:'Peacock-feather crown',term:'mayūra-piccha mukuṭa',meaning:'Kṛṣṇa\'s crown: a jewelled band holding three peacock feathers — the cowherd\'s plume worn as a king\'s.'},
(K,o)=>{const w=o.w||6.3;for(const [x,a,l] of [[-2.4,17,13],[2.4,-17,13],[0,0,17.5]]){const S=K.sub({x,y:2,rot:a});S.T([[0,0],[0,l]],0.22,'feather','inner',{raw:true});
    for(let i=0;i<9;i++){const y=1.5+i*(l-5)/9;S.M(s=>S.L([[0,y],[s*(1.6+i*0.16),y+1.8]],'detail',{raw:true,lod:i%2?2:1}));}
    S.R([[0,l-5.4],[2.4,l-3.2],[2.5,l-0.6],[0,l+1.4],[-2.5,l-0.6],[-2.4,l-3.2]],'feather','outer');S.R([[0,l-4.2],[1.5,l-2.6],[1.4,l-1.0],[0,l-0.2],[-1.4,l-1.0],[-1.5,l-2.6]],'gem','inner');S.C(0,l-2.2,0.8,null,'detail',{paint:'ink',n:12});}
  K.Ro([[-w*0.95,0.4],[-w*0.74,3.6],[-w*0.3,5.3],[0,5.9],[w*0.3,5.3],[w*0.74,3.6],[w*0.95,0.4]],'metal','outer');for(let i=0;i<5;i++)mkPetal(K,(i-2)*w*0.3,0.9,3.8-Math.abs(i-2)*0.5,w*0.14,-(i-2)*9,'metal','detail',{lod:1,rib:3});
  K.M(s=>{for(const [a,l,h] of [[-80,4.0,1.3],[-52,4.8,1.5]])mkPetal(K,s*w*0.98,0.5,l,h,s*a,'metal','outer',{inner:3});});mkBrowBand(K,w,{});});

/* ---------- more things held ---------- */
mkDef('held','khadga',{name:'Sword',term:'khaḍga',meaning:'The sword that cuts through ignorance; Kālī and Durgā raise it.'},
(K)=>{K.Ro([[-1.0,2.4],[-1.3,10],[-1.6,18],[-0.6,25],[1.6,29.5],[1.7,24],[1.3,10],[1.0,2.4]],'steel','outer');K.L([[0,3],[0.1,14],[0.6,26]],'detail',{lod:1});
  K.Rp(G.roundRect(-3.6,-2.4,3.6,-1.2,0.5).map(([x,y])=>[x,-y]),'metal','outer');K.T([[0,-4.2],[0,1.2]],0.75,'metal','outer',{raw:true});K.C(0,-5.0,1.25,'metal','outer');K.M(s=>K.C(s*3.9,1.8,0.7,'metal','inner',{lod:1}));});
function mkSkull(K){K.R([[0,9.6],[3.0,9.0],[4.6,6.8],[4.7,4.4],[3.7,2.6],[3.1,1.2],[2.4,-0.6],[0,-1.2],[-2.4,-0.6],[-3.1,1.2],[-3.7,2.6],[-4.7,4.4],[-4.6,6.8],[-3.0,9.0]],'bone','outer');
  K.M(s=>{K.R([[s*0.9,4.8],[s*1.9,5.6],[s*3.3,5.2],[s*3.5,3.9],[s*2.6,3.0],[s*1.2,3.4]],null,'inner',{paint:'ink'});K.L([[s*1.6,7.6],[s*3.2,7.4],[s*4.0,6.0]],'detail',{lod:2});});
  K.R([[0,3.2],[0.7,2.0],[0.3,1.5],[0,1.9],[-0.3,1.5],[-0.7,2.0]],null,'inner',{paint:'ink'});K.L([[-2.3,0.7],[2.3,0.7]],'inner',{raw:true});for(const x of [-1.5,-0.5,0.5,1.5])K.L([[x,0.7],[x,-0.9]],'detail',{raw:true,lod:1});}
mkDef('held','munda',{name:'Skull',term:'muṇḍa / kapāla',meaning:'The skull Kālī carries and wears: the ego cut off, and time, which takes every form back.'},(K)=>{K.L([[0,0],[0,-1.5]],'inner',{raw:true});mkSkull(K.sub({y:-11.2,s:1.05}));});
mkDef('held','khatvanga',{name:'Skull staff',term:'khaṭvāṅga',meaning:'A staff topped with a skull, carried by Śiva\'s fierce forms and by Kālī.'},
(K)=>{K.T([[0,-30],[0,24]],0.8,'wood','outer',{raw:true});for(let y=-26;y<22;y+=5)K.L([[-0.8,y],[0.8,y+1.4]],'detail',{raw:true,lod:2});K.Rp(G.roundRect(-2.2,-25.6,2.2,-24.2,0.5).map(([x,y])=>[x,-y]),'metal','outer');
  mkSkull(K.sub({y:26.6,s:0.86}));K.M(s=>K.T([[s*3.4,31],[s*6.2,33.5],[s*6.0,37]],t=>0.9-0.7*t,'bone','outer'));});
mkDef('held','parashu',{name:'Axe',term:'paraśu',meaning:'Gaṇeśa\'s axe, which cuts the bonds of attachment.'},
(K)=>{K.T([[0,-6],[0,15]],0.6,'wood','outer',{raw:true});K.R([[0.4,8.4],[3.2,7.2],[6.4,8.4],[7.6,11.4],[6.4,14.4],[3.2,15.6],[0.4,14.4],[1.6,11.4]],'steel','outer');K.L([[5.6,9.2],[6.5,11.4],[5.6,13.6]],'detail',{lod:2});mkPetal(K,0,15,2.2,0.8,0,'metal','inner',{round:true});});
mkDef('held','ankusha',{name:'Elephant goad',term:'aṅkuśa',meaning:'The goad that steers an elephant: the nudge that moves the mind onward.'},
(K)=>{K.T([[0,-6],[0,13]],0.55,'wood','outer',{raw:true});K.T([[0,10.4],[3.4,11.2],[4.8,8.6],[3.2,6.4]],t=>0.75-0.5*t,'steel','outer');mkPetal(K,0,12.6,4.2,1.1,0,'steel','outer',{rib:3});K.Rp([[-1.1,9.6],[1.1,9.6],[1.1,10.6],[-1.1,10.6]],'metal','inner');});
mkDef('held','pasha',{name:'Noose',term:'pāśa',meaning:'The noose that catches and draws close: obstacles bound, the devotee pulled in.'},
(K)=>{K.T([[0,-3],[0.4,2],[-0.4,5]],0.36,'rope','outer');K.Rp(mkArcBand(0,0,3.6,4.4,0,360,30).map(([x,y])=>[x*0.9,9.6+y*1.15]),'rope','outer');K.C(0,5.2,0.9,'rope','inner');});
mkDef('held','modakaPatra',{name:'Bowl of sweets',term:'modaka-pātra',meaning:'A bowl heaped with modaka, the sweet dumpling Gaṇeśa loves: the sweetness of what is found within.'},
(K)=>{for(const [x,y,s] of [[-2.6,3.2,1],[2.6,3.2,1],[0,3.4,1.05],[-1.3,5.6,1],[1.3,5.6,1],[0,7.8,1]]){const S=K.sub({x,y,s});S.R([[0,3.1],[0.9,1.9],[1.9,0.6],[1.5,-0.9],[0,-1.3],[-1.5,-0.9],[-1.9,0.6],[-0.9,1.9]],'sweet','outer');for(const a of [-0.9,0,0.9])S.L([[a*0.2,2.5],[a,0.6],[a*0.9,-0.9]],'detail',{lod:2});}
  K.Ro([[-5.2,2.6],[-4.6,0.4],[-2.6,-1.3],[0,-1.7],[2.6,-1.3],[4.6,0.4],[5.2,2.6]],'metal','outer');K.L([[-4.4,1.2],[0,0.2],[4.4,1.2]],'detail',{lod:2});K.Rp([[-1.7,-1.6],[1.7,-1.6],[2.1,-2.6],[-2.1,-2.6]],'metal','outer');});
mkDef('held','akshamala',{name:'Rosary',term:'akṣamālā',meaning:'A string of beads for counting repetitions of a mantra: time and attention, held in the hand.'},
(K)=>{for(let i=0;i<22;i++){const a=i/22*360,p=mkPol(1,a);K.C(p[0]*3.4,-5.2+p[1]*5.4,0.62,'bead','outer',{n:10});}K.T([[0,-10.6],[0,-13.2]],t=>0.5-0.35*t,'sash','inner',{raw:true});});
mkDef('held','pustaka',{name:'Palm-leaf book',term:'pustaka',meaning:'A manuscript of palm leaves tied between boards: learning, the Veda, Sarasvatī\'s own.'},
(K)=>{const S=K.sub({rot:-20});S.Rp(G.roundRect(-6.5,-2.2,6.5,2.2,0.5),'wood','outer');for(const y of [-1.2,-0.4,0.4,1.2])S.L([[-6.2,y],[6.2,y]],'detail',{raw:true,lod:1});for(const x of [-3.2,3.2]){S.L([[x,-2.2],[x,2.2]],'inner',{raw:true});S.D(x,0,0.3,'detail',{lod:2});}});
mkDef('held','venu',{name:'Flute',term:'veṇu / muralī',meaning:'Kṛṣṇa\'s bamboo flute, whose sound calls every creature: the hollow reed through which the divine breath plays.'},
(K)=>{K.T([[0,-15],[0,15]],0.72,'wood','outer',{raw:true});for(const y of [-13.6,-9,9,13.6])K.Rp([[-0.85,y-0.35],[0.85,y-0.35],[0.85,y+0.35],[-0.85,y+0.35]],'metal','inner',{lod:1});
  for(let i=0;i<6;i++)K.D(0,-6+i*2.4,0.26,'detail',{lod:1});K.beads([[0.6,15],[2.6,13],[2.0,9.6]],0.9,0.24,{lod:2});mkPetal(K,2.0,9.4,2.6,0.7,180,'sash','inner',{lod:1});});
mkDef('held','parvata',{name:'Mountain of herbs',term:'Droṇagiri / Sañjīvanī',meaning:'The whole mountain Hanumān carried when he could not tell which herb would heal Lakṣmaṇa: devotion that does not stop to calculate.'},
(K)=>{K.R([[-10,0],[-11.4,3.6],[-8.6,7.2],[-9.2,10.6],[-5.4,12.4],[-3.6,15.6],[0.4,14.6],[3.2,17.0],[6.6,13.6],[9.8,12.0],[9.4,8.0],[11.6,4.4],[10,0],[0,-1.2]],'rock','outer');
  for(const [a,b,c,d] of [[-8.4,7.2,-4.6,4.0],[-5.2,12.2,-1.6,8.6],[3.2,16.6,1.8,11.4],[9.6,8.0,5.4,5.6],[-1.4,8.6,2.6,3.4]])K.L([[a,b],[(a+c)/2+0.6,(b+d)/2],[c,d]],'detail',{lod:1});
  for(const [x,y] of [[-6.6,11.6],[-2.4,15.0],[1.6,15.4],[5.4,14.6],[8.6,12.0],[-9.6,6.0],[10.4,5.6]]){K.L([[x,y],[x,y+2.6]],'inner',{raw:true,lod:1});for(const d of [-34,0,34])mkPetal(K,x,y+2.2,1.9,0.5,d,'leafGreen','detail',{lod:2});}});
mkDef('held','tunira',{name:'Quiver',term:'tūṇīra',meaning:'The quiver that is never empty, slung behind Rāma\'s shoulder.'},
(K)=>{for(const [x,a] of [[-1.5,-9],[0,0],[1.5,9]]){const S=K.sub({x,y:9,rot:a});S.T([[0,0],[0,8]],0.2,'wood','inner',{raw:true});S.M(s=>{for(const y of [4.6,6.0,7.4])S.Rp([[0,y],[s*1.4,y+1.2],[s*1.4,y+2.4],[0,y+1.2]],'feather','inner');});}
  K.Ro([[-3.0,10],[-3.3,2],[-2.2,-8],[0,-10.6],[2.2,-8],[3.3,2],[3.0,10]],'wood','outer');K.Rp(G.ellipse(0,10,3.0,0.9,20),'metal','outer');for(const y of [6,0,-5])K.Rp([[-3.2,y-0.6],[3.2,y-0.6],[3.1,y+0.6],[-3.1,y+0.6]],'metal','inner',{lod:1});
  for(const y of [3,-2.4])for(const x of [-1.6,0,1.6])K.Rp(G.ellipse(x,y,0.55,0.8,10),'gem','detail',{lod:2});});
mkDef('held','vina',{name:'Vīṇā',term:'vīṇā',meaning:'Sarasvatī\'s lute: a long fretted neck between two gourds. Knowledge is not only read; it is tuned and played.'},
(K)=>{K.C(0,-30,7.2,'wood','outer',{n:36});K.ring(0,-30,5.2,'detail',{lod:1,n:28});K.ring(0,-30,2.0,'detail',{lod:2,n:14});K.C(-2.2,6,3.8,'wood','outer',{n:24});K.ring(-2.2,6,2.3,'detail',{lod:2,n:14});
  K.Rp([[-1.15,-26],[1.15,-26],[0.85,13.4],[-0.85,13.4]],'wood','outer');for(let i=0;i<14;i++){const y=-21+i*2.3;K.L([[-1.0,y],[1.0,y]],'detail',{raw:true,lod:1});}
  for(const x of [-0.45,0,0.45])K.L([[x,-27],[x,13]],'detail',{raw:true,lod:2});K.T([[0,13.2],[1.2,15.6],[3.2,16.6],[4.4,15.2]],t=>0.9-0.5*t,'wood','outer');K.M(s=>{for(const y of [10.4,12.0])K.T([[s*0.8,y],[s*2.6,y+0.2]],0.34,'wood','inner',{raw:true,lod:1});});
  K.Rp([[-1.6,-25.6],[1.6,-25.6],[1.6,-24.6],[-1.6,-24.6]],'metal','inner');});

/* ================= the deities ================= */
// stock arm positions (torso coordinates); f = the slimmer female build
const mkA=f=>{const sx=f?12.4:14.4,bx=f?11.0:12.6,q=f?0.92:1;return{
  upR:(hold,hand='kataka',e)=>Object.assign({back:true,sh:[-bx,37.4],el:[-29.5*q,29.5],wr:[-31.5*q,45.8],hand,handRot:90,hold},e),
  upL:(hold,hand='kataka',e)=>Object.assign({back:true,sh:[bx,37.4],el:[29.5*q,29.5],wr:[31.5*q,45.8],hand,handRot:90,flip:true,hold},e),
  midR:(hold,hand='fist',e)=>Object.assign({back:true,sh:[-bx,36.6],el:[-31*q,22],wr:[-38*q,35.5],hand,handRot:100,hold},e),
  midL:(hold,hand='fist',e)=>Object.assign({back:true,sh:[bx,36.6],el:[31*q,22],wr:[38*q,35.5],hand,handRot:80,flip:true,hold},e),
  abhayaR:e=>Object.assign({sh:[-sx,36.8],el:[-22.5*q,18.5],wr:[-16.5*q,32.5],hand:'abhaya',handRot:90},e),
  abhayaL:e=>Object.assign({sh:[sx,36.8],el:[22.5*q,18.5],wr:[16.5*q,32.5],hand:'abhaya',handRot:90,flip:true},e),
  varadaR:e=>Object.assign({sh:[-sx,36.8],el:[-21.5*q,17.5],wr:[-17*q,8.6],hand:'abhaya',handRot:270,flip:true},e),
  varadaL:e=>Object.assign({sh:[sx,36.8],el:[21.5*q,17.5],wr:[17*q,8.6],hand:'abhaya',handRot:270},e),
  lowR:(hold,e)=>Object.assign({sh:[-sx,36.8],el:[-23*q,17.5],wr:[-20*q,3.2],hand:'fist',hold,holdRot:270},e),
  lowL:(hold,e)=>Object.assign({sh:[sx,36.8],el:[23*q,17.5],wr:[20*q,3.2],hand:'fist',flip:true,hold,holdRot:270},e)};};
const MKM=mkA(false),MKF=mkA(true);
// a tail: a long tapering curve ending in a tuft
function mkTail(K,path,sk){K.T(path,t=>2.3-1.2*t,sk,'outer');const S=G.samples(FK.spline(path,false,7),false,3.2);S.forEach((q,i)=>{if(i%2)K.L([[q.x-q.ty*1.5,q.y+q.tx*1.5],[q.x-q.tx*0.9-q.ty*0.5,q.y-q.ty*0.9+q.tx*0.5]],'detail',{raw:true,lod:2});});
  const e=path[path.length-1],p=path[path.length-2],a=Math.atan2(e[1]-p[1],e[0]-p[0])/DEG-90;for(const d of [-28,0,28])mkPetal(K,e[0],e[1],4.2,1.1,a+d,sk,'outer',{lod:d?1:0});}

// Viṣṇu is defined above with the assembler; Lakṣmī with him.
const MK_GANESHA=(seat)=>({pose:'seat',legs:'padma',torso:'belly',skin:'skin',cloth:'clothRed',aureole:'sirasChakra',haloR:20,seat,crown:'karandaMukuta',crownY:16.2,crownW:7.4,necklaces:true,longHara:false,thread:true,
  head:(K,Hd)=>mkElephantHead(Hd.sub({s:1.22}),{}),
  extra:(K,B)=>{B.T([[-13.6,17.4],[-9,12.2],[0,10.2],[9,12.2],[13.6,17.4]],0.8,'snake','inner');B.R([[-1.6,10.4],[0,12.4],[1.8,11.2],[1.2,9.2],[-0.8,8.8]],'snake','inner');B.D(0.4,11.0,0.26,'detail',{lod:1});},
  arms:[MKM.upR('ankusha','fist'),MKM.upL('pasha','fist'),MKM.abhayaR(),{sh:[14.4,36.8],el:[24,19.5],wr:[14.5,15],hand:'flat',handRot:180,hold:'modakaPatra',holdS:1.05}]});
MURTI('ganeshaSeated','Gaṇeśa enthroned','Gaṇapati / Vighneśvara','The remover of obstacles on a lotus throne: elephant head with one tusk, pot belly girdled by a serpent, the goad and the noose in his upper hands, one hand raised in blessing and the other holding a bowl of sweets his trunk reaches for.',MK_GANESHA('padmaPitha'));
MURTI('ganesha','Gaṇeśa','Gaṇapati / Vināyaka','Gaṇeśa without a throne, as he is drawn on doorways, wedding cards and the first page of account books: invoked before any beginning.',Object.assign(MK_GANESHA(false),{aureole:'kiranaPrabha'}));
MURTI('shiva','Śiva in meditation','Śiva / Dakṣiṇāmūrti / Yogeśvara','The great ascetic seated in meditation: matted locks piled up with the crescent moon and the river Gaṅgā, the third eye and three lines of ash on the brow, a serpent round the neck, a tiger skin for a garment, the trident and its drum beside him.',
{pose:'seat',legs:'padma',torso:'m',skin:'skinAsh',cloth:'tigerSkin',aureole:'kiranaPrabha',seat:'shilaPitha',crown:'jataMukuta',crownY:11.4,hair:'long',hairLen:15,face:{eyes:'closed',tilak:'tripundra',earring:'ring'},thread:true,longHara:true,sash:false,
 behind:(K)=>mkPlace(K,'held',mkPick(K,'held','trishul'),{x:-31,y:27},{}),
 extra:(K,B)=>{for(const [x,y,a] of [[6,9.4,20],[13,10,35],[19,8,60],[-6,9.4,-20],[-13,10,-35],[-19,8,-60],[10,4.4,10],[-10,4.4,-10]])B.T([[x-1.6*Math.cos(a*DEG),y-1.6*Math.sin(a*DEG)],[x,y+0.5],[x+1.6*Math.cos(a*DEG),y+1.6*Math.sin(a*DEG)]],t=>0.42*Math.sin(Math.PI*t)+0.05,null,'detail',{paint:'ink',lod:1});},
 over:(K,B)=>{B.T([[-4.6,38.4],[-2.2,36.3],[2.2,36.1],[5.6,38.2],[7.6,41.2],[7.4,44.4],[9.2,46.6]],t=>t>0.82?1.25:0.8,'snake','outer');B.D(9.0,46.9,0.24);B.L([[9.6,47.4],[10.4,48.6]],'detail',{raw:true,lod:1});},
 arms:[{sh:[-14.4,36.8],el:[-22,17.5],wr:[-6.5,8.6],hand:'back',handRot:0,flip:true},{sh:[14.4,36.8],el:[22,17.5],wr:[6.5,9.6],hand:'back',handRot:180}]});
MURTI('hanumanSeated','Hanumān enthroned','Hanumān / Āñjaneya / Māruti','Hanumān at rest on a cushioned throne: one hand raised in blessing, the mace leaning on his shoulder, his tail curling up behind. Strength that has nothing left to prove.',
{pose:'seat',legs:'padma',torso:'v',skin:'skinSaffron',cloth:'clothRed',aureole:'kiranaPrabha',seat:'bhadraPitha',crown:'kiritaMukuta',garland:true,face:{monkey:true,tilak:'urdhva',earring:'ring'},hair:'none',
 behind:(K)=>mkTail(K,[[-6,8],[-26,9],[-38,22],[-40,40],[-33,53],[-25,54],[-22,48]],'skinSaffron'),
 arms:[MKM.abhayaR(),{sh:[14.4,36.8],el:[23.5,18.5],wr:[15.5,28.5],hand:'fist',flip:true,hold:'gada',holdRot:76,holdS:0.86}]});
MURTI('saraswati','Sarasvatī','Sarasvatī / Vāgdevī / Vīṇāpāṇi','The goddess of speech, learning and music on a white lotus, playing the vīṇā; her upper hands hold a rosary and a palm-leaf book.',
{pose:'seat',legs:'padma',torso:'f',skin:'skin',cloth:'ivory',aureole:'sirasChakra',seat:'padmaPitha',crown:'karandaMukuta',hair:'long',face:{tilak:'bindu',earring:'jhumka'},
 arms:[MKF.upR('akshamala','kataka'),MKF.upL('pustaka','fist'),{sh:[12.4,36.8],el:[21,21.5],wr:[12.5,29],hand:'fist',flip:true,hold:'vina',holdRot:40},{sh:[-12.4,36.8],el:[-21,20],wr:[-7,16.5],hand:'back',handRot:-12,flip:true}]});
function mkTiger(K){
  K.T([[27.5,-4],[35,-2.4],[40,5],[37,12.6],[31.5,12.4]],t=>1.7-0.7*t,'animal','outer');for(const [x,y,a] of [[33.6,-2.6,70],[38.6,2,10],[39.4,8,-30],[35.6,12.4,-80]])K.T([[x-0.9*Math.cos(a*DEG),y-0.9*Math.sin(a*DEG)],[x+0.9*Math.cos(a*DEG),y+0.9*Math.sin(a*DEG)]],0.36,null,'detail',{paint:'ink',raw:true,lod:1});
  const leg=(pts,w0)=>{K.T(pts,t=>w0-(w0-2.1)*t,'animal','outer');const e=pts[pts.length-1];K.R([[e[0]-3.6,e[1]-0.2],[e[0]-3.9,e[1]-2.0],[e[0]-1.5,e[1]-2.7],[e[0]+2.2,e[1]-2.5],[e[0]+2.6,e[1]-0.6],[e[0]+0.6,e[1]+0.8]],'animal','outer');for(const d of [-2.2,-0.8,0.6])K.L([[e[0]+d,e[1]-2.5],[e[0]+d+0.2,e[1]-1.3]],'detail',{raw:true,lod:2});};
  leg([[-10.5,-11],[-11.5,-22],[-13,-31]],3.6);leg([[15,-11],[18.5,-20],[14.6,-25.6],[15.4,-31]],4.2);
  K.R([[-21,1.2],[-6,0.5],[10,0.2],[24,-0.7],[29.4,-4.2],[29.6,-11],[24.5,-15.2],[10,-13.6],[-4,-14.2],[-16,-16.6],[-24.4,-13.2],[-27,-6],[-24.6,-0.8]],'animal','outer');
  K.L([[-18,-15.6],[-4,-13.6],[10,-12.8],[24,-14.4]],'detail',{lod:2});
  for(const [x,h,l] of [[-13,1,7],[-7.5,0.6,8],[-2,0.4,7],[3.5,0.3,8.5],[9,0.2,7],[14.5,0,8.5],[20,-0.3,7],[25,-1.2,6]])K.T([[x,h-0.3],[x+0.9,h-l*0.5],[x-0.3,h-l]],t=>0.62*Math.sin(Math.PI*Math.min(1,t*1.2))+0.05,null,'detail',{paint:'ink',lod:1});
  leg([[-19.5,-12],[-20.4,-22],[-21.6,-31]],3.7);leg([[23,-11],[27,-20],[22.6,-26],[23.6,-31]],4.4);
  // head in profile, jaws open
  K.R([[-27.6,5.4],[-27.8,8.6],[-25.4,9.6],[-23.4,6.6]],'animal','outer');K.L([[-26.9,6.2],[-26.6,8.2],[-25.2,8.4]],'detail',{lod:2});
  K.R([[-36.4,-6.3],[-38.6,-8.4],[-37.4,-10.8],[-32.4,-11.8],[-27,-10.8],[-23.4,-8.6],[-28.6,-7.2],[-33.2,-6.5]],'animal','outer');
  K.R([[-37.4,-5.2],[-33.5,-5.6],[-29.2,-6.9],[-26.0,-7.6],[-28.8,-7.6],[-33.4,-6.9],[-36.6,-6.7]],null,'inner',{paint:'ink'});
  K.R([[-20.2,3.8],[-24.4,6.4],[-30,6.2],[-34.8,3.6],[-38.6,0.6],[-40.8,-2.4],[-40.2,-4.6],[-37.2,-5.3],[-33.5,-5.5],[-29,-6.8],[-24,-8.4],[-20.2,-6]],'animal','outer');
  for(const [x,y,d] of [[-36.6,-5.3,-1.9],[-34.6,-5.5,-1.5],[-36.2,-6.7,1.5],[-33.8,-6.9,1.2]])K.Rp([[x-0.45,y],[x+0.45,y],[x+0.1,y+d]],'ivory','inner',{lod:1});
  K.R([[-40.9,-2.2],[-39.6,-1.5],[-38.9,-2.6],[-39.8,-3.6]],null,'inner',{paint:'ink'});K.L([[-38.9,-2.6],[-37.6,-4.0],[-37.4,-5.2]],'detail',{lod:1});
  {const up=[[-36.2,1.0],[-34.8,2.5],[-33.0,2.9],[-31.4,2.0]],lo=[[-31.4,2.0],[-33.0,1.2],[-34.8,0.8],[-36.2,1.0]];K.Rp(G.chain(FK.spline(up,false,6),FK.spline(lo,false,6)).slice(0,-1),'eye','inner');
    K.C(-33.8,1.8,0.62,null,'detail',{paint:'ink',n:10});K.T(up,t=>0.08+0.14*Math.sin(Math.PI*t),null,'outer',{paint:'ink'});K.T([[-37.4,2.6],[-34.6,4.3],[-31.2,3.5]],t=>0.26-0.18*t,null,'outer',{paint:'ink'});}
  for(const [a,b,c,d] of [[-37.6,-3.2,-32.6,-1.8],[-37.8,-3.9,-32.4,-3.4],[-37.4,-4.5,-32.8,-4.8]])K.L([[a,b],[c,d]],'detail',{raw:true,lod:2});for(const [x,y] of [[-36.6,-2.6],[-35.6,-3.3],[-36.4,-3.9]])K.C(x,y,0.16,null,'detail',{paint:'ink',n:6,lod:2});
  for(const [a,b,c,d] of [[-30.6,6.0,-31.4,3.6],[-27.8,5.2,-28.8,2.4],[-24.6,5.6,-25.4,2.2],[-22.4,1.4,-25.4,-0.2],[-21.8,-1.8,-25.2,-2.6],[-22.4,-4.8,-26.0,-4.6],[-29.4,-1.4,-28.0,-4.2]])K.T([[a,b],[(a+c)/2+0.4,(b+d)/2],[c,d]],t=>0.34*Math.sin(Math.PI*t)+0.05,null,'detail',{paint:'ink',lod:1});
  for(const [x,y,a] of [[-21.4,-6.6,250],[-23.2,-8.6,238],[-20.6,-4.2,262]])mkPetal(K,x,y,2.4,0.7,a-90,'animal','inner',{lod:2});
}
mkDef('seat','vyaghra',{name:'Tiger mount',term:'vyāghra / siṁha-vāhana',meaning:'The great cat Durgā rides into battle: untamed power carrying the goddess, not the other way round.'},(K,o)=>mkTiger(K.sub({s:(o.hw||31)/30})));
SG.motifs.tiger.fn=(rng,g)=>{const K=mkCtx(rng,g);mkTiger(K);return fitParts(K.P.filter(p=>!p.lod||p.lod<3));};
MURTI('durga','Durgā','Durgā / Siṁhavāhinī / Mahiṣāsuramardinī','The goddess who is every god\'s weapon in one body, riding her tiger: trident, discus, sword and conch in her many hands, one hand raised to say "do not fear".',
{pose:'seat',legs:'lalita',torso:'f',skin:'skin',cloth:'clothRed',aureole:'sirasChakra',seat:'vyaghra',crown:'karandaMukuta',hair:'long',face:{tilak:'bindu',earring:'jhumka'},
 arms:[MKF.upR('trishul','fist',{holdS:0.5,holdOff:-4}),MKF.upL('sudarshana','kataka'),MKF.midR('khadga','fist',{holdRot:112,holdS:0.9}),MKF.midL('shankha','kataka'),MKF.abhayaR(),MKF.varadaL()]});
MURTI('rama','Rāma','Rāma / Kodaṇḍarāma / Rāghava','The king who kept his word, standing with the great bow at rest in his left hand and the right raised in assurance; quiver at the shoulder, tall crown, forest garland.',
{pose:'stand',torso:'m',skin:'skinBlue',cloth:'clothYellow',aureole:'sirasChakra',seat:false,crown:'kiritaMukuta',hair:'curls',garland:36,face:{tilak:'urdhva',earring:'makara'},
 behind:(K)=>mkPlace(K,'held',mkPick(K,'held','tunira'),{x:-15.5,y:97,rot:20,s:1.25},{}),
 arms:[MKM.abhayaR(),{sh:[14.4,36.8],el:[21.5,16.5],wr:[30,31.5],hand:'fist',flip:true,hold:'kodanda',holdRot:90,holdOff:-17}]});
MURTI('krishnaFlute','Kṛṣṇa with the flute','Veṇugopāla / Muralīdhara','The cowherd god playing his flute, standing with one ankle crossed over the other: dark as a rain cloud, in yellow silk, a peacock feather in his crown and a garland of forest flowers to his knees.',
{pose:'stand',stance:'cross',torso:'m',skin:'skinBlue',cloth:'clothYellow',aureole:'sirasChakra',seat:false,crown:'mayuraMukuta',hair:'curls',garland:38,headTilt:-5,face:{tilak:'urdhva',earring:'makara'},
 arms:[{sh:[-14.4,36.8],el:[-7,23.5],wr:[9.5,42.6],hand:'fist',handRot:84,hold:'venu',holdRot:3,holdOff:7.5},{sh:[14.4,36.8],el:[27,25],wr:[22.5,43.6],hand:'fist',handRot:98,flip:true}]});
MURTI('kali','Kālī','Kālī / Dakṣiṇakālī / Bhadrakālī','Time, who dissolves every form: dark, with unbound hair to her knees and a garland of skulls, the sword raised and a skull in hand — and with her other hands the same gestures of fearlessness and giving as any gentle goddess.',
{pose:'stand',torso:'f',skin:'skinDark',bareLegs:true,aureole:'ratnaPrabha',seat:'shilaPitha',crown:'karandaMukuta',hair:'wild',face:{mood:'fierce',tilak:'trinetra',earring:'ring'},sash:true,
 extra:(K,B)=>{for(let i=0;i<7;i++){const x=-9+i*3,u=x/9;mkPetal(B,x,12.6,15.5-Math.abs(u)*3.5+(i%2)*2.4,2.5,180+u*17,'skirt','outer',{inner:2,rib:2});}},
 over:(K,B)=>{const S=G.samples(FK.spline(mkU(10.4,40.2,36),false,8),false,6.6);S.forEach((q,i)=>{if(i===0||i===S.length-1)return;mkSkull(B.sub({x:q.x,y:q.y-1.4,s:0.34,rot:Math.atan2(q.ty,q.tx)/DEG*0.4}));});B.L(mkU(10.4,40.2,36),'detail',{lod:1});},
 arms:[MKF.upR('khadga','fist',{holdRot:100}),MKF.upL(null,'abhaya',{back:true}),{sh:[-12.4,36.8],el:[-21.5,18.5],wr:[-23,3.5],hand:'fist',hold:'munda',holdRot:270,holdS:0.9},MKF.varadaL({wr:[17,7.5]})]});
// Hanumān leaping with the mountain: the same body, legs flung out, the whole figure tilted into the jump
MURTI('hanumanFlying','Hanumān carrying the mountain','Sañjīvanī Hanumān','Hanumān in mid-leap, the mace on one shoulder and the mountain of healing herbs on his palm, tail streaming behind: devotion that brings the whole mountain rather than risk choosing wrong.',
{pose:'stand',torso:'v',skin:'skinSaffron',aureole:'kiranaPrabha',seat:false,crown:'kiritaMukuta',garland:28,tilt:-9,face:{monkey:true,tilak:'urdhva',earring:'ring'},hair:'none',
 behind:(K)=>mkTail(K,[[-3,61],[-22,58],[-40,70],[-45,91],[-37,108],[-28,108],[-26,100]],'skinSaffron'),
 customLegs:(K)=>{const W=(seg,u)=>seg?4.5-2.1*u+0.6*Math.sin(Math.PI*Math.min(1,u*1.4)):6.2-1.8*u;const sk='skinSaffron';
   K.Rp(mkLimbPoly([-5.5,61],[-16,44],[-29,31],W),sk,'outer');mkFootSole(K.sub({x:-29.5,y:30.4,rot:38,s:0.9}),sk);mkAnklet(K,-27.4,32.6,-52);
   K.Rp(mkLimbPoly([5.5,61],[20,47],[13.5,28],W),sk,'outer');mkFootSole(K.sub({x:13.2,y:27.2,rot:72,s:0.9}),sk);mkAnklet(K,14.2,30.2,-18);
   K.Rp([[-10.8,65],[10.8,65],[14.2,56],[10,50.5],[3,54.5],[-5,49.5],[-13,53.5]],'clothRed','outer');for(const [a,b,c,d] of [[-6,64,-9,53],[-1,64,-2,53],[4,64,7,53],[8.5,64,11.5,54]])K.L([[a,b],[c,d]],'detail',{raw:true,lod:1});},
 arms:[{sh:[-14.4,36.8],el:[-25,21],wr:[-17.5,32],hand:'fist',hold:'gada',holdRot:112,holdS:0.86},{sh:[14.4,36.8],el:[29.5,36],wr:[33.5,52],hand:'flat',handRot:8,flip:true,hold:'parvata',holdS:1.3}]});

/* ---------- parts from other cultures ----------
   Any motif can fill a slot once it is tagged with one; `grip` is how far up from its foot a held thing is gripped. */
for(const [k,slot,grip] of [['hgS34','held',0.72],['hgS40','held',0.42],['hgR11','held',0.3],['papyrusUmbel','held',0.25],['lotusEg','held',0.2],['lotusBud','held',0.2],['bansuri','held',0.5],['peacockFeather','held',0.2],
  ['ruyi','held',0.3],['sensu','held',0.15],['bamboo','held',0.3],['diya','held',0.1],['kalasha','held',0.1],['flame','held',0.1],['leaf','held',0.1],
  ['wingedDisc','aureole'],['sunStone','aureole'],['sun','aureole'],['burst','aureole'],['kikuMon','aureole'],['ulzii','aureole'],['triskele','aureole'],['enso','aureole'],['lotusTop','aureole'],['star8','aureole'],['shenRing','aureole'],['knot','aureole'],
  ['featherFan','crown'],['hgH6','crown'],['uraeus','crown'],['hgN5','crown'],['cloud','crown'],['lotusSide','crown'],
  ['turtle','seat'],['cloud','seat'],['lotusSide','seat'],['serpent','seat']])
  if(SG.motifs[k]&&!SG.motifs[k].slot){SG.motifs[k].slot=slot;if(grip!=null)SG.motifs[k].grip=grip;}
