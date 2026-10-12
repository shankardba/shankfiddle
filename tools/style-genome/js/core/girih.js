'use strict';
/* Girih — the geometric grammar of Islamic art: star patterns grown from polygons, and the
   straps that weave through them.

   POLYGONS IN CONTACT. Start from a tiling of polygons that the finished work never shows.
   At the midpoint of every edge two lines cross, each leaving the edge at the same
   "contact angle". Inside each polygon the lines run until they meet a partner and turn.
   Regular polygons grow stars; the odd shapes between them grow the kites, petals and
   darts that join one star to the next. One tiling gives a whole family of patterns as the
   contact angle changes — in fivefold work the acute (72°), median (54°) and obtuse (36°).
   The method was set out by E. H. Hankin in 1925 from plaster scratch-lines he found in
   Mughal buildings, and is the reading of the craft followed by Bonner and by Kaplan.

   THE HIDDEN TILINGS are built here the way a compass-and-straightedge designer builds
   them: regular polygons are set on a lattice, edge to edge or bridged by smaller ones,
   and whatever shapes are left between them are found, not drawn (GH.faces).

   STRAPS. A pattern line is widened into a band, and the bands pass over and under one
   another in turn all the way along. That is always possible for lines that cross two at
   a time. Where a band passes under, it is cut back exactly to the edge of the band above.

   CELLS. The shapes the lines enclose are the pieces a tile-cutter makes. Each kind of
   piece (star, kite, petal, hexagon…) is a class, and classes take palette colours by
   position, largest first.

   Part flags used here: `strap` (a woven band: ground-coloured or `palette.strap`, always
   outlined), `ci` (palette colour by position), `ns` (no outline).
   Genes: `ornament.strap` 0–1 is the band width (0 = plain lines); `ornament.weave` above
   0.5 interlaces the bands. Both mean nothing at 0. */

const GH={};
GH.key=(x,y)=>Math.round(x*4096+0.137)+','+Math.round(y*4096+0.291);
GH.rad=n=>0.5/Math.sin(Math.PI/n); // circumradius of a regular n-gon of edge 1
GH.apo=n=>0.5/Math.tan(Math.PI/n); // its apothem
GH.reg=(n,cx=0,cy=0,rot=0)=>{const R=GH.rad(n),p=[];for(let k=0;k<n;k++){const a=(rot+k*360/n)*DEG;p.push([cx+R*Math.cos(a),cy+R*Math.sin(a)]);}return p;};
GH.pol=(r,deg)=>[r*Math.cos(deg*DEG),r*Math.sin(deg*DEG)];
GH.isect=(p,d,q,e)=>{const den=d[0]*e[1]-d[1]*e[0];if(Math.abs(den)<1e-10)return null;const wx=q[0]-p[0],wy=q[1]-p[1];return[(wx*e[1]-wy*e[0])/den,(wx*d[1]-wy*d[0])/den];};

/* ---------- planar graph: split segments where they meet, then walk the faces ---------- */
GH.graph=function(segs){
  const cs=0.8,grid=new Map(),N=segs.length;
  segs.forEach((s,i)=>{const x0=Math.floor(Math.min(s[0],s[2])/cs),x1=Math.floor(Math.max(s[0],s[2])/cs),y0=Math.floor(Math.min(s[1],s[3])/cs),y1=Math.floor(Math.max(s[1],s[3])/cs);
    for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){const k=x+','+y;let c=grid.get(k);if(!c)grid.set(k,c=[]);c.push(i);}});
  const cuts=segs.map(()=>[0,1]),seen=new Set(),E=1e-7;
  for(const ids of grid.values())for(let a=0;a<ids.length;a++)for(let b=a+1;b<ids.length;b++){
    const i=ids[a],j=ids[b],pk=i*N+j;if(seen.has(pk))continue;seen.add(pk);
    const A=segs[i],B=segs[j],d=[A[2]-A[0],A[3]-A[1]],e=[B[2]-B[0],B[3]-B[1]];
    const r=GH.isect([A[0],A[1]],d,[B[0],B[1]],e);
    if(!r){ // parallel: where they lie on one line, each takes the other's ends as cuts
      const L2=d[0]*d[0]+d[1]*d[1],cr=(B[0]-A[0])*d[1]-(B[1]-A[1])*d[0];if(Math.abs(cr)/Math.sqrt(L2)>1e-6)continue;
      for(const [x,y] of [[B[0],B[1]],[B[2],B[3]]]){const t=((x-A[0])*d[0]+(y-A[1])*d[1])/L2;if(t>E&&t<1-E)cuts[i].push(t);}
      const M2=e[0]*e[0]+e[1]*e[1];
      for(const [x,y] of [[A[0],A[1]],[A[2],A[3]]]){const t=((x-B[0])*e[0]+(y-B[1])*e[1])/M2;if(t>E&&t<1-E)cuts[j].push(t);}
      continue;}
    const [t,u]=r;if(t<-E||t>1+E||u<-E||u>1+E)continue;
    cuts[i].push(clamp(t));cuts[j].push(clamp(u));
  }
  const id=new Map(),pts=[],adj=[],es=new Set();
  const node=(x,y)=>{const k=GH.key(x,y);let v=id.get(k);if(v==null){v=pts.length;id.set(k,v);pts.push([x,y]);adj.push([]);}return v;};
  segs.forEach((s,i)=>{const c=cuts[i].sort((a,b)=>a-b);let prev=null;
    for(const t of c){const v=node(s[0]+(s[2]-s[0])*t,s[1]+(s[3]-s[1])*t);
      if(prev!=null&&prev!==v){const k=prev<v?prev*1e6+v:v*1e6+prev;if(!es.has(k)){es.add(k);adj[prev].push(v);adj[v].push(prev);}}prev=v;}});
  return {pts,adj};
};
GH.faces=function({pts,adj}){
  adj=adj.map(a=>a.slice());
  const Q=[];adj.forEach((a,i)=>{if(a.length===1)Q.push(i);});
  while(Q.length){const v=Q.pop();if(adj[v].length!==1)continue;const u=adj[v][0];adj[v]=[];adj[u]=adj[u].filter(x=>x!==v);if(adj[u].length===1)Q.push(u);}
  const pos=adj.map((a,v)=>{a.sort((p,q)=>Math.atan2(pts[p][1]-pts[v][1],pts[p][0]-pts[v][0])-Math.atan2(pts[q][1]-pts[v][1],pts[q][0]-pts[v][0]));const m=new Map();a.forEach((u,k)=>m.set(u,k));return m;});
  const used=new Set(),out=[];
  for(let u0=0;u0<adj.length;u0++)for(const v0 of adj[u0]){
    if(used.has(u0*1e6+v0))continue;const f=[];let u=u0,v=v0,guard=0;
    while(!used.has(u*1e6+v)&&guard++<4000){used.add(u*1e6+v);f.push(pts[u]);const a=adj[v],k=pos[v].get(u),w=a[(k-1+a.length)%a.length];u=v;v=w;}
    if(f.length>=3)out.push(f);
  }
  const ar=out.map(f=>G.area(f));const posN=ar.filter(a=>a>0).length,sg=posN*2>=ar.length?1:-1;
  return out.filter((f,i)=>ar[i]*sg>1e-7);
};
// drop vertices that lie on a straight run
GH.tidy=function(P,closed=true){const n=P.length,o=[];
  for(let i=0;i<n;i++){if(!closed&&(i===0||i===n-1)){o.push(P[i]);continue;}const a=P[(i-1+n)%n],b=P[i],c=P[(i+1)%n];
    const cr=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]),l=Math.hypot(b[0]-a[0],b[1]-a[1])*Math.hypot(c[0]-b[0],c[1]-b[1]);
    if(l<1e-12||Math.abs(cr)/l<1e-5)continue;o.push(b);}
  return o;};
// exact inward offset of a simple polygon (mitred): null when the piece is too small to survive
GH.inset=function(P,d){P=GH.tidy(P);const n=P.length;if(n<3)return null;const A=G.area(P),sg=A>0?1:-1,o=[];
  for(let i=0;i<n;i++){const a=P[(i-1+n)%n],b=P[i],c=P[(i+1)%n];
    let t1=[b[0]-a[0],b[1]-a[1]],t2=[c[0]-b[0],c[1]-b[1]];const l1=Math.hypot(t1[0],t1[1]),l2=Math.hypot(t2[0],t2[1]);t1=[t1[0]/l1,t1[1]/l1];t2=[t2[0]/l2,t2[1]/l2];
    const n1=[-t1[1]*sg,t1[0]*sg],n2=[-t2[1]*sg,t2[0]*sg];let m=[n1[0]+n2[0],n1[1]+n2[1]];const ml=Math.hypot(m[0],m[1]);if(ml<1e-9)return null;m=[m[0]/ml,m[1]/ml];
    const k=d/(m[0]*n1[0]+m[1]*n1[1]);o.push([b[0]+m[0]*k,b[1]+m[1]*k]);}
  const B=G.area(o);if(B*sg<=Math.abs(A)*0.02)return null;
  // an offset that has turned an edge round has eaten the piece
  for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n],c=o[i],e=o[(i+1)%n];if((b[0]-a[0])*(e[0]-c[0])+(b[1]-a[1])*(e[1]-c[1])<=0)return null;}
  return o;};

/* ---------- polygons in contact ---------- */
GH.isRegular=function(P){const n=P.length;if(n<3)return false;const c=G.centroid(P);let l0=null,r0=null;
  for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n],l=Math.hypot(b[0]-a[0],b[1]-a[1]),r=Math.hypot(a[0]-c[0],a[1]-c[1]);if(l0==null){l0=l;r0=r;}else if(Math.abs(l-l0)>1e-4||Math.abs(r-r0)>1e-4)return false;}
  return true;};
// lines of one polygon: th = contact angle in degrees, s = how many partners a line in a regular polygon runs past before it turns
GH.rays=function(P,th){
  const n=P.length,c=Math.cos(th*DEG),sn=Math.sin(th*DEG),sg=G.area(P)>0?1:-1,R=[];
  for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n],l=Math.hypot(b[0]-a[0],b[1]-a[1]),e=[(b[0]-a[0])/l,(b[1]-a[1])/l],nn=[-e[1]*sg,e[0]*sg],M=[(a[0]+b[0])/2,(a[1]+b[1])/2];
    R.push([{o:M,d:[c*e[0]+sn*nn[0],c*e[1]+sn*nn[1]]},{o:M,d:[-c*e[0]+sn*nn[0],-c*e[1]+sn*nn[1]]}]);}
  return R;};
GH.picPoly=function(P,th,s=1){
  const n=P.length,R=GH.rays(P,th);
  const arcs=[];
  const join=(A,B)=>{const r=GH.isect(A.o,A.d,B.o,B.d);
    if(!r){const w=[B.o[0]-A.o[0],B.o[1]-A.o[1]];if(Math.abs(w[0]*A.d[1]-w[1]*A.d[0])<1e-6&&w[0]*A.d[0]+w[1]*A.d[1]>0&&A.d[0]*B.d[0]+A.d[1]*B.d[1]<0){const L=Math.hypot(w[0],w[1]);return{t:L/2,u:L/2,X:null};}return null;}
    if(r[0]<1e-7||r[1]<1e-7)return null;return{t:r[0],u:r[1],X:[A.o[0]+A.d[0]*r[0],A.o[1]+A.d[1]*r[0]]};};
  if(GH.isRegular(P)){
    for(let k=Math.min(s,Math.floor((n-1)/2));k>=1;k--){let ok=true;const out=[];
      for(let i=0;i<n&&ok;i++){const A=R[i][0],B=R[(i+k)%n][1],j=join(A,B);if(!j){ok=false;break;}out.push(j.X?[A.o,j.X,B.o]:[A.o,B.o]);}
      if(ok){arcs.push(...out);break;}}
    return arcs;
  }
  const cand=[];
  for(let i=0;i<n;i++)for(let a=0;a<2;a++)for(let j=i+1;j<n;j++)for(let b=0;b<2;b++){
    const A=R[i][a],B=R[j][b],J=join(A,B);if(!J)continue;
    const X=J.X||[(A.o[0]+B.o[0])/2,(A.o[1]+B.o[1])/2];
    const in1=[A.o[0]+(X[0]-A.o[0])*0.5,A.o[1]+(X[1]-A.o[1])*0.5],in2=[B.o[0]+(X[0]-B.o[0])*0.5,B.o[1]+(X[1]-B.o[1])*0.5],in3=[A.o[0]+(X[0]-A.o[0])*0.97,A.o[1]+(X[1]-A.o[1])*0.97];
    if(!G.inside(in1[0],in1[1],P)||!G.inside(in2[0],in2[1],P)||!G.inside(in3[0],in3[1],P))continue;
    cand.push({i,a,j,b,X:J.X,cost:J.t+J.u+Math.abs(J.t-J.u)*0.05,A,B});}
  cand.sort((p,q)=>p.cost-q.cost);const usedR=new Set();
  for(const k of cand){const ka=k.i*2+k.a,kb=k.j*2+k.b;if(usedR.has(ka)||usedR.has(kb))continue;usedR.add(ka);usedR.add(kb);arcs.push(k.X?[k.A.o,k.X,k.B.o]:[k.A.o,k.B.o]);}
  return arcs;
};

/* ---------- the hidden tilings ----------
   a1, a2: lattice vectors; seeds: [n, x, y, rotation of first vertex]; every polygon has edge 1.
   rect: a rectangular repeat [w, h] with a star at its corners (and at its centre when `cen`). */
const S2=Math.SQRT2,S3=Math.sqrt(3);
GH.TILINGS={
  // octagons edge to edge; squares are left between
  oct:{a1:[1+S2,0],a2:[0,1+S2],seeds:[[8,0,0,22.5]],rect:[1+S2,1+S2]},
  // hexagons edge to edge
  hex:{a1:[S3,0],a2:[S3/2,1.5],seeds:[[6,0,0,30]],rect:[S3,3],cen:true},
  // hexagons corner to corner; triangles between
  trihex:{a1:[2,0],a2:[1,S3],seeds:[[6,0,0,0]],rect:[2,2*S3],cen:true},
  // hexagons spaced by squares; triangles between
  rhombitri:{a1:[1+S3,0],a2:[(1+S3)/2,(1+S3)*S3/2],seeds:[[6,0,0,30]],bridge:4,rect:[1+S3,(1+S3)*S3],cen:true},
  // twelve-sided polygons edge to edge on a triangular lattice; triangles between
  dodecTri:{a1:[2+S3,0],a2:[(2+S3)/2,(2+S3)*S3/2],seeds:[[12,0,0,15]],rect:[2+S3,(2+S3)*S3],cen:true},
  // twelve-sided polygons spaced by squares; hexagons between
  dodecHex:{a1:[3+S3,0],a2:[(3+S3)/2,(3+S3)*S3/2],seeds:[[12,0,0,15]],bridge:4,bridgeOdd:true,rect:[3+S3,(3+S3)*S3],cen:true},
  // twelve-sided polygons edge to edge on a square lattice; four-pointed stars between
  dodecSq:{a1:[2+S3,0],a2:[0,2+S3],seeds:[[12,0,0,15]],rect:[2+S3,2+S3]},
  // sixteen-sided polygons edge to edge on a square lattice
  hexdecSq:{a1:[2*GH.apo(16),0],a2:[0,2*GH.apo(16)],seeds:[[16,0,0,11.25]],rect:[2*GH.apo(16),2*GH.apo(16)]},
  // decagons edge to edge on a 72° rhombic lattice; bow-ties between
  decBow:{a1:[2*GH.apo(10),0],a2:GH.pol(2*GH.apo(10),72),seeds:[[10,0,0,18]],rhomb:72},
  // decagons ringed by pentagons, neighbours sharing two pentagons
  decPent:{a1:[2*GH.rad(10)+1,0],a2:GH.pol(2*GH.rad(10)+1,72),seeds:[[10,0,0,0]],ring:5,ringSkip:[3,8],rhomb:72}
};
for(const k in GH.TILINGS){const T=GH.TILINGS[k];T.key=k;
  if(T.rhomb){const a=T.a1,b=T.a2;T.rect=[Math.hypot(a[0]+b[0],a[1]+b[1]),Math.hypot(b[0]-a[0],b[1]-a[1])];T.cen=true;T.rectRot=-Math.atan2(a[1]+b[1],a[0]+b[0])/DEG;}}
// every polygon of one lattice cell, the shapes left between the seeds included
GH.unitTiles=function(T){
  if(T._tiles)return T._tiles;const polys=[];
  for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){const ox=i*T.a1[0]+j*T.a2[0],oy=i*T.a1[1]+j*T.a2[1];
    for(const [n,x,y,rot] of T.seeds){const P=GH.reg(n,ox+x,oy+y,rot);polys.push(P);
      const m=T.ring||T.bridge;if(!m)continue;
      // a regular m-gon set on every edge of the seed
      for(let k=T.bridgeOdd?1:0;k<n;k+=T.bridgeOdd?2:1){if(T.ringSkip&&T.ringSkip.includes(k))continue;const a=P[k],b=P[(k+1)%n],mx=(a[0]+b[0])/2-(ox+x),my=(a[1]+b[1])/2-(oy+y),l=Math.hypot(mx,my),d=l+GH.apo(m);
        const ang=Math.atan2(my,mx)/DEG;polys.push(GH.reg(m,ox+x+mx/l*d,oy+y+my/l*d,ang+180+180/m));}}}
  const segs=[];for(const P of polys)for(let k=0;k<P.length;k++){const a=P[k],b=P[(k+1)%P.length];segs.push([a[0],a[1],b[0],b[1]]);}
  const F=GH.faces(GH.graph(segs)).map(f=>GH.tidy(f));
  const det=T.a1[0]*T.a2[1]-T.a1[1]*T.a2[0];
  T._tiles=F.filter(f=>{const c=G.centroid(f),u=(c[0]*T.a2[1]-c[1]*T.a2[0])/det,v=(T.a1[0]*c[1]-T.a1[1]*c[0])/det;return u>=-1e-6&&u<1-1e-6&&v>=-1e-6&&v<1-1e-6;});
  return T._tiles;
};

/* ---------- patterns: a tiling + a contact angle (+ how far lines run in the big polygons) ---------- */
GH.PATTERNS={};
GH.defPattern=(key,o)=>{GH.PATTERNS[key]=Object.assign({key,s:{}},o);};
GH.unit=function(pat){
  if(pat._unit)return pat._unit;const T=GH.TILINGS[pat.tiling],tiles=GH.unitTiles(T);
  const arcs=[];for(const P of tiles){const n=P.length,reg=GH.isRegular(P);const th=typeof pat.th==='function'?pat.th(n,reg,P):pat.th;if(th==null)continue;arcs.push(...GH.picPoly(P,th,reg?(pat.s[n]||1):1));}
  // cells of one lattice cell: faces of the line arrangement over a 7×7 block, kept where the centroid falls in the cell
  const segs=[];for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){const ox=i*T.a1[0]+j*T.a2[0],oy=i*T.a1[1]+j*T.a2[1];
    for(const a of arcs)for(let k=0;k<a.length-1;k++)segs.push([a[k][0]+ox,a[k][1]+oy,a[k+1][0]+ox,a[k+1][1]+oy]);}
  const det=T.a1[0]*T.a2[1]-T.a1[1]*T.a2[0];
  let cells=GH.faces(GH.graph(segs)).map(f=>GH.tidy(f)).filter(f=>{const c=G.centroid(f),u=(c[0]*T.a2[1]-c[1]*T.a2[0])/det,v=(T.a1[0]*c[1]-T.a1[1]*c[0])/det;return u>=-1e-6&&u<1-1e-6&&v>=-1e-6&&v<1-1e-6;});
  // classes of piece, largest first
  const sig=f=>f.length+'|'+Math.abs(G.area(f)).toFixed(3);const cls={};
  cells.forEach(f=>{const k=sig(f);(cls[k]=cls[k]||{k,n:f.length,area:Math.abs(G.area(f)),count:0}).count++;});
  const order=Object.values(cls).sort((a,b)=>b.area-a.area);order.forEach((c,i)=>c.ci=i);
  // which side of a star's spokes a piece lies on, so pieces of one kind can alternate round the star
  const N=T.seeds[0][0],alt=f=>{const c=G.centroid(f);let bd=1e9,bx=0,by=0;for(let i=-1;i<=2;i++)for(let j=-1;j<=2;j++){const x=i*T.a1[0]+j*T.a2[0],y=i*T.a1[1]+j*T.a2[1],d=Math.hypot(c[0]-x,c[1]-y);if(d<bd-1e-6){bd=d;bx=x;by=y;}}
    if(bd<1e-6)return 0;const a=Math.atan2(c[1]-by,c[0]-bx)/DEG-T.seeds[0][3];return ((Math.floor(a/(360/N)+1e-4)%2)+2)%2;};
  cells=cells.map(f=>({pts:f,ci:cls[sig(f)].ci,alt:alt(f)}));
  return pat._unit={T,arcs,cells,classes:order};
};

/* ---------- strands and the weave ---------- */
// chain arcs end to end where they run straight through an edge midpoint
GH.strands=function(arcs){
  const ends=new Map();
  arcs.forEach((a,ai)=>{for(const e of [0,1]){const p=e?a[a.length-1]:a[0],q=e?a[a.length-2]:a[1],l=Math.hypot(q[0]-p[0],q[1]-p[1]);const k=GH.key(p[0],p[1]);let L=ends.get(k);if(!L)ends.set(k,L=[]);L.push({ai,e,d:[(q[0]-p[0])/l,(q[1]-p[1])/l]});}});
  const link=arcs.map(()=>[null,null]);
  for(const L of ends.values())for(const x of L){if(link[x.ai][x.e])continue;let best=null,bd=-0.985;
    for(const y of L){if(y===x||link[y.ai][y.e])continue;const dt=x.d[0]*y.d[0]+x.d[1]*y.d[1];if(dt<bd){bd=dt;best=y;}}
    if(best){link[x.ai][x.e]=best;link[best.ai][best.e]=x;}}
  // two loose ends left at one point turn the corner together
  for(const L of ends.values()){const f=L.filter(x=>!link[x.ai][x.e]);if(f.length===2&&f[0].ai!==f[1].ai){link[f[0].ai][f[0].e]=f[1];link[f[1].ai][f[1].e]=f[0];}}
  const used=new Uint8Array(arcs.length),out=[];
  const walk=(ai,e)=>{ // leave arc ai through end e, collecting points
    const pts=[];let closed=false;
    for(;;){used[ai]=1;const a=arcs[ai],seq=e?a:a.slice().reverse();for(let k=pts.length?1:0;k<seq.length;k++)pts.push(seq[k]);
      const nx=link[ai][e];if(!nx)break;if(used[nx.ai]){closed=true;break;}ai=nx.ai;e=1-nx.e;}
    return {pts,closed};};
  // open strands first, from their free ends; whatever is left closes on itself
  for(let ai=0;ai<arcs.length;ai++){if(used[ai])continue;for(const e of [0,1]){if(used[ai]||link[ai][e])continue;const s=walk(ai,1-e);out.push({pts:GH.tidy(s.pts,false),closed:false});}}
  for(let ai=0;ai<arcs.length;ai++){if(used[ai])continue;const s=walk(ai,1);const p=s.pts.slice(0,-1);out.push({pts:GH.tidy(p,true),closed:true});}
  return out.filter(s=>s.pts.length>=2);
};
// crossings between strands, then over/under alternating along every strand
GH.weave=function(strands){
  const segs=[];
  strands.forEach((S,si)=>{const p=S.pts,n=p.length;let acc=0;S.cross=[];
    for(let i=0;i<(S.closed?n:n-1);i++){const a=p[i],b=p[(i+1)%n],l=Math.hypot(b[0]-a[0],b[1]-a[1]);segs.push({si,i,a,b,l,s0:acc});acc+=l;}S.len=acc;});
  const cs=0.8,grid=new Map(),N=segs.length;
  segs.forEach((s,i)=>{const x0=Math.floor(Math.min(s.a[0],s.b[0])/cs),x1=Math.floor(Math.max(s.a[0],s.b[0])/cs),y0=Math.floor(Math.min(s.a[1],s.b[1])/cs),y1=Math.floor(Math.max(s.a[1],s.b[1])/cs);
    for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){const k=x+','+y;let c=grid.get(k);if(!c)grid.set(k,c=[]);c.push(i);}});
  const seen=new Set();let xid=0;const X=[];
  for(const ids of grid.values())for(let a=0;a<ids.length;a++)for(let b=a+1;b<ids.length;b++){
    const i=ids[a],j=ids[b],pk=i<j?i*N+j:j*N+i;if(seen.has(pk))continue;seen.add(pk);const A=segs[i],B=segs[j];
    const d=[A.b[0]-A.a[0],A.b[1]-A.a[1]],e=[B.b[0]-B.a[0],B.b[1]-B.a[1]];const r=GH.isect(A.a,d,B.a,e);if(!r)continue;
    const [t,u]=r,ea=1e-6/A.l*1e2,eb=1e-6/B.l*1e2;if(t<=ea||t>=1-ea||u<=eb||u>=1-eb)continue;
    const p=[A.a[0]+d[0]*t,A.a[1]+d[1]*t];
    const ca={s:A.s0+t*A.l,x:xid,p,od:[e[0]/B.l,e[1]/B.l],lab:0},cb={s:B.s0+u*B.l,x:xid,p,od:[d[0]/A.l,d[1]/A.l],lab:0};
    strands[A.si].cross.push(ca);strands[B.si].cross.push(cb);X.push([[A.si,ca],[B.si,cb]]);xid++;}
  strands.forEach(S=>{S.cross.sort((a,b)=>a.s-b.s);S.cross.forEach((c,k)=>c.lab=k%2);});
  const flip=new Int8Array(strands.length).fill(-1);
  for(let s0=0;s0<strands.length;s0++){if(flip[s0]>=0)continue;flip[s0]=0;const Q=[s0];
    while(Q.length){const si=Q.pop();for(const c of strands[si].cross){const pr=X[c.x],o=pr[0][1]===c?pr[1]:pr[0];const want=1-((c.lab^flip[si])&1);if(flip[o[0]]<0){flip[o[0]]=(o[1].lab^want)&1;Q.push(o[0]);}}}}
  strands.forEach((S,si)=>S.cross.forEach(c=>c.under=((c.lab^flip[si])&1)===1));
  return strands;
};
// one strand cut at its under-crossings into bands of width w, each end trimmed to the edge of the band above
GH.pieces=function(S,w){
  const h=w/2,p=S.pts,n=p.length,out=[];
  const cum=[0];for(let i=1;i<=n;i++){const a=p[i-1],b=p[i%n];cum.push(cum[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1]));}
  const L=S.closed?cum[n]:cum[n-1];
  const at=s=>{s=S.closed?((s%L)+L)%L:clamp(s,0,L);let i=1;const m=S.closed?n:n-1;while(i<m&&cum[i]<s)i++;const a=p[i-1],b=p[i%n],l=cum[i]-cum[i-1]||1,t=(s-cum[i-1])/l;return{pt:[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],seg:i-1};};
  const U=S.cross.filter(c=>c.under);
  const spans=[];
  if(S.closed){if(!U.length)return null;for(let k=0;k<U.length;k++)spans.push([U[k],U[(k+1)%U.length]]);}
  else{let prev=null;for(const u of U){spans.push([prev,u]);prev=u;}spans.push([prev,null]);}
  for(const [c0,c1] of spans){
    const s0=c0?c0.s:0;let s1=c1?c1.s:L;if(S.closed&&s1<=s0+1e-9)s1+=L;if(s1-s0<1e-6)continue;
    // centre line: start, the vertices in between, end
    const C=[c0?c0.p:p[0]];
    if(S.closed){for(let k=0;k<2*n;k++){const sv=cum[k%n]+Math.floor(k/n)*L;if(sv>s0+1e-7&&sv<s1-1e-7)C.push(p[k%n]);}}
    else for(let k=1;k<n-1;k++)if(cum[k]>s0+1e-7&&cum[k]<s1-1e-7)C.push(p[k]);
    C.push(c1?c1.p:p[n-1]);const m=C.length;if(m<2)continue;
    const T=[];for(let i=0;i<m-1;i++){const l=Math.hypot(C[i+1][0]-C[i][0],C[i+1][1]-C[i][1])||1;T.push([(C[i+1][0]-C[i][0])/l,(C[i+1][1]-C[i][1])/l]);}
    const side=sgn=>{const o=[];
      for(let i=0;i<m;i++){
        if(i===0||i===m-1){const t=T[i===0?0:m-2],nn=[-t[1]*sgn,t[0]*sgn],c=i===0?c0:c1,base=[C[i][0]+nn[0]*h,C[i][1]+nn[1]*h];
          if(!c){o.push(base);continue;}
          const od=c.od,on=[-od[1],od[0]],dir=i===0?1:-1,sg2=(on[0]*t[0]+on[1]*t[1])*dir>0?1:-1;
          const r=GH.isect(base,t,[C[i][0]+on[0]*h*sg2,C[i][1]+on[1]*h*sg2],od);o.push(r?[base[0]+t[0]*r[0],base[1]+t[1]*r[0]]:base);continue;}
        const t1=T[i-1],t2=T[i],n1=[-t1[1]*sgn,t1[0]*sgn],n2=[-t2[1]*sgn,t2[0]*sgn];let mx=n1[0]+n2[0],my=n1[1]+n2[1];const ml=Math.hypot(mx,my)||1;mx/=ml;my/=ml;
        const k=h/Math.max(0.2,mx*n1[0]+my*n1[1]);o.push([C[i][0]+mx*k,C[i][1]+my*k]);}
      return o;};
    out.push(side(1).concat(side(-1).reverse()));
  }
  return out;
};

/* ---------- a pattern laid over a rectangle ----------
   box: {x0,y0,x1,y1} in pixels; k: pixels per polygon edge; origin (ox,oy): pixel position of a
   lattice point; rot: degrees. Returns comp-space parts (not yet clipped). */
GH.fill=function(pat,box,k,ox,oy,{w=0,weave=false,rot=0,margin=1.2,pin=false}={}){
  const U=GH.unit(pat),T=U.T,cr=Math.cos(rot*DEG),sr=Math.sin(rot*DEG);
  const toPx=([x,y])=>[ox+(x*cr-y*sr)*k,oy+(x*sr+y*cr)*k];
  const toU=([X,Y])=>{const x=(X-ox)/k,y=(Y-oy)/k;return[x*cr+y*sr,-x*sr+y*cr];};
  const det=T.a1[0]*T.a2[1]-T.a1[1]*T.a2[0];let i0=1e9,i1=-1e9,j0=1e9,j1=-1e9;
  const cornersU=[[box.x0,box.y0],[box.x1,box.y0],[box.x1,box.y1],[box.x0,box.y1]].map(toU);
  for(const c of cornersU){const u=(c[0]*T.a2[1]-c[1]*T.a2[0])/det,v=(T.a1[0]*c[1]-T.a1[1]*c[0])/det;i0=Math.min(i0,u);i1=Math.max(i1,u);j0=Math.min(j0,v);j1=Math.max(j1,v);}
  i0=Math.floor(i0)-2;i1=Math.ceil(i1)+1;j0=Math.floor(j0)-2;j1=Math.ceil(j1)+1;
  const bb=G.bbox(cornersU),mg=margin+w;const near=pts=>{for(const q of pts)if(q[0]>bb.x0-mg&&q[0]<bb.x1+mg&&q[1]>bb.y0-mg&&q[1]<bb.y1+mg)return true;return false;};
  const parts=[],arcs=[],h=w/2;
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const tx=i*T.a1[0]+j*T.a2[0],ty=i*T.a1[1]+j*T.a2[1];const sh=q=>[q[0]+tx,q[1]+ty];
    for(const a of U.arcs){const b=a.map(sh);if(near(b))arcs.push(b);}
    for(const c of U.cells){const P=c.pts.map(sh);if(!near(P))continue;const I=w>0?GH.inset(P,h):P;if(!I)continue;
      parts.push({kind:'region',closed:true,role:'detail',plain:true,ci:pin&&c.ci>0?c.ci+c.alt*2:c.ci,ns:!(w>0),cell:true,pts:I.map(toPx)});}}
  const strands=GH.strands(arcs);
  if(!(w>0)){for(const S of strands)parts.push({kind:'line',closed:S.closed,role:'outer',pts:S.pts.map(toPx)});return parts;}
  if(!weave)return parts;
  GH.weave(strands);const rings=[];
  for(const S of strands){const pc=GH.pieces(S,w);
    if(!pc){rings.push({kind:'region',closed:true,role:'inner',plain:true,strap:true,pts:G.offset(S.pts,h,true).map(toPx)});continue;}
    for(const q of pc)parts.push({kind:'region',closed:true,role:'inner',plain:true,strap:true,pts:q.map(toPx)});}
  return rings.concat(parts);
};

// free-drawn strands (borders, single stars): cells from the faces between them, bands woven the same way
GH.compose=function(lines,w,weave,toPx=q=>q,ciOf=null){
  const segs=[];for(const S of lines){const p=S.pts,n=p.length;for(let i=0;i<(S.closed?n:n-1);i++){const a=p[i],b=p[(i+1)%n];segs.push([a[0],a[1],b[0],b[1]]);}}
  const parts=[],h=w/2;let F=GH.faces(GH.graph(segs)).map(f=>GH.tidy(f));
  const order=[...new Set(F.map(f=>f.length+'|'+Math.abs(G.area(f)).toFixed(2)))].sort((a,b)=>+b.split('|')[1]-+a.split('|')[1]);
  for(const f of F){const I=w>0?GH.inset(f,h):f;if(!I)continue;const ci=ciOf?ciOf(f):order.indexOf(f.length+'|'+Math.abs(G.area(f)).toFixed(2));
    parts.push({kind:'region',closed:true,role:'detail',plain:true,ci,ns:!(w>0),cell:true,pts:I.map(toPx)});}
  const strands=lines.map(S=>({pts:GH.tidy(S.pts,S.closed),closed:!!S.closed}));
  if(!(w>0)){for(const S of strands)parts.push({kind:'line',closed:S.closed,role:'outer',pts:S.pts.map(toPx)});return parts;}
  if(!weave)return parts;
  GH.weave(strands);const rings=[];
  for(const S of strands){const pc=GH.pieces(S,w);
    if(!pc){rings.push({kind:'region',closed:true,role:'inner',plain:true,strap:true,pts:G.offset(S.pts,h,true).map(toPx)});continue;}
    for(const q of pc)parts.push({kind:'region',closed:true,role:'inner',plain:true,strap:true,pts:q.map(toPx)});}
  return rings.concat(parts);
};
// clip parts to a convex polygon (regions by Sutherland–Hodgman, lines piece by piece)
GH.clipConvex=function(parts,poly){
  const sg=G.area(poly)>0?1:-1,n=poly.length,out=[];
  const E=poly.map((a,i)=>{const b=poly[(i+1)%n];return{a,nx:-(b[1]-a[1])*sg,ny:(b[0]-a[0])*sg};});
  const dist=(e,q)=>(q[0]-e.a[0])*e.nx+(q[1]-e.a[1])*e.ny;
  for(const p of parts){
    if(p.kind==='dot'){if(E.every(e=>dist(e,[p.x,p.y])>=0))out.push(p);continue;}
    if(p.kind==='region'){let P=p.pts;
      for(const e of E){const I=P;P=[];if(!I.length)break;for(let i=0;i<I.length;i++){const a=I[(i-1+I.length)%I.length],b=I[i],da=dist(e,a),db=dist(e,b);
        if(db>=0){if(da<0)P.push([a[0]+(b[0]-a[0])*da/(da-db),a[1]+(b[1]-a[1])*da/(da-db)]);P.push(b);}else if(da>=0)P.push([a[0]+(b[0]-a[0])*da/(da-db),a[1]+(b[1]-a[1])*da/(da-db)]);}}
      if(P.length>=3&&Math.abs(G.area(P))>0.5)out.push(Object.assign({},p,{pts:P}));continue;}
    const Q=p.closed?p.pts.concat([p.pts[0]]):p.pts;let cur=null;
    for(let i=0;i<Q.length-1;i++){let t0=0,t1=1;const a=Q[i],b=Q[i+1];let ok=true;
      for(const e of E){const da=dist(e,a),db=dist(e,b);if(da<0&&db<0){ok=false;break;}if(da<0)t0=Math.max(t0,da/(da-db));else if(db<0)t1=Math.min(t1,da/(da-db));}
      if(!ok||t1-t0<1e-6){if(cur){out.push(Object.assign({},p,{pts:cur,closed:false}));cur=null;}continue;}
      const s=[a[0]+(b[0]-a[0])*t0,a[1]+(b[1]-a[1])*t0],e2=[a[0]+(b[0]-a[0])*t1,a[1]+(b[1]-a[1])*t1];
      if(cur&&t0<1e-9)cur.push(e2);else{if(cur)out.push(Object.assign({},p,{pts:cur,closed:false}));cur=[s,e2];}
      if(t1<1-1e-9){out.push(Object.assign({},p,{pts:cur,closed:false}));cur=null;}}
    if(cur)out.push(Object.assign({},p,{pts:cur,closed:false}));
  }
  return out;
};
// band width (in polygon edges) and weaving from the genome; too fine to cut at this scale → plain lines
GH.strapOf=function(g,k,min=2.6){const O=(g&&g.ornament)||{},lw=(g&&g.line&&g.line.weight)||1.5;let w=0.26*clamp(O.strap||0);if(w*k<Math.max(min,min>2?lw*1.5:0))w=0;return{w,weave:(O.weave||0)>=0.5,pin:(O.pinwheel||0)>=0.5};};

/* ---------- the patterns ---------- */
GH.defPattern('khatam',{tiling:'oct',th:n=>n===8?45:null,span:3.3,rho:1.31,
  name:'Star and cross',term:'khātam · “breath of the Compassionate”',meaning:'Eight-pointed stars, each two squares turned on one another, with crosses left between them. The oldest and most widespread of the star patterns; lustre tiles of exactly these two shapes covered the walls of Kashan and Takht-i Sulayman. Its modern name comes from Ibn ʿArabī’s image of creation as God’s breath going out and returning.'});
GH.defPattern('octRosette',{tiling:'oct',th:67.5,s:{8:2},span:3.7,rho:1.95,
  name:'Eightfold rosette',term:'muthamman',meaning:'An eight-pointed star ringed by eight petals, with small four-pointed stars where four rosettes meet. Grown from octagons and squares at a contact angle of 67½°.'});
GH.defPattern('hexStar',{tiling:'hex',th:60,span:3.1,rho:0.9,
  name:'Six-pointed stars',term:'musaddas',meaning:'Six-pointed stars set point to point with hexagons between: the first pattern a compass gives, from a circle stepped six times round itself. Found from the Great Mosque of Kairouan to Mughal screens.'});
GH.defPattern('hexWeave',{tiling:'rhombitri',th:60,span:3.3,rho:1.4,
  name:'Stars and hexagons',term:'musaddas',meaning:'Six-pointed stars ringed by six hexagons, grown from hexagons spaced apart by squares. Common in Mamluk woodwork and in Mughal inlay.'});
GH.defPattern('twelveRosette',{tiling:'dodecTri',th:75,s:{12:2},span:4.2,rho:2.62,
  name:'Twelvefold rosette',term:'ithnā ʿasharī',meaning:'Twelve-pointed stars with twelve petals, three rosettes meeting round a small three-armed star. The usual field of Mamluk doors and Qurʾān frontispieces.'});
GH.defPattern('twelveSix',{tiling:'dodecHex',th:75,s:{12:2},span:4.6,rho:2.3,
  name:'Twelve and six',term:'—',meaning:'Twelve-pointed rosettes with six-pointed stars between them: two star families in one field, the larger at the points of a triangular lattice and the smaller in its gaps.'});
GH.defPattern('twelveSixOpen',{tiling:'dodecHex',th:60,s:{12:2},span:4.6,rho:2.3,
  name:'Twelve and six, open',term:'—',meaning:'The same hidden tiling as “twelve and six” at a contact angle of 60°: the lines run straight on through the edges, and the stars open into wide hexagons.'});
GH.defPattern('twelveFour',{tiling:'dodecSq',th:75,s:{12:2},span:4.2,rho:2.05,
  name:'Twelve and four',term:'—',meaning:'Twelve-pointed rosettes on a square lattice, with a four-armed star in each gap. A layout for square panels and ceilings.'});
GH.defPattern('sixteen',{tiling:'hexdecSq',th:78.75,s:{16:2},span:5,rho:3.55,
  name:'Sixteenfold rosette',term:'sittat ʿashar',meaning:'Sixteen-pointed stars with sixteen narrow petals. The higher the count, the finer the cutting: sixteens belong to the Marinid and Nasrid tile-cutters and to Mamluk Cairo.'});
GH.defPattern('tenAcute',{tiling:'decPent',th:72,s:{10:2},span:4.7,rho:2.3,
  name:'Tenfold rosette, acute',term:'girih · tond',meaning:'The classic Persian fivefold pattern at its sharpest contact angle, 72°: a ten-pointed star, ten petals, and a ring of five-pointed stars. Grown from decagons, pentagons and a barrel hexagon.'});
GH.defPattern('tenMedian',{tiling:'decPent',th:54,s:{10:2},span:4.7,rho:2.3,
  name:'Tenfold, median',term:'girih',meaning:'The same hidden tiling at 54°: the lines cross each edge and run straight on, so long straps travel right across the field. The family on Seljuk and Ilkhanid brickwork.'});
GH.defPattern('tenObtuse',{tiling:'decPent',th:36,span:4.7,rho:2.3,
  name:'Tenfold, obtuse',term:'girih · kond',meaning:'The same hidden tiling at 36°: broad decagons, wide five-pointed stars and long straight straps that run the width of the wall.'});
GH.defPattern('girihBow',{tiling:'decBow',th:54,s:{10:2},span:4.1,rho:1.62,
  name:'Decagons and bow-ties',term:'girih',meaning:'Decagons edge to edge with bow-ties between: the pattern that can be laid with two of the five “girih tiles”, shapes whose printed lines join up across every edge however the tiles are turned.'});

for(const key in GH.PATTERNS){const pat=GH.PATTERNS[key];
  defTile(key,{name:pat.name,term:pat.term,meaning:pat.meaning,girih:key,
  fn(W,H,u,rng,g){const T=GH.TILINGS[pat.tiling],k=u*pat.span/Math.hypot(T.a1[0],T.a1[1]),st=GH.strapOf(g,k);
    return GH.fill(pat,{x0:0,y0:0,x1:W,y1:H},k,W/2,H/2,{w:st.w,weave:st.weave,pin:st.pin,rot:T.rectRot||0});}});}

/* ---------- motifs: one rosette cut out as a roundel ---------- */
// A rosette with its full symmetry: the star polygon plus a ring of four-sided cells built on its
// edges, so every petal closes inside an outer polygon of the same count.
GH.roundel=function(N,th,g,{R=44,rim=4.5,ell=1.05}={}){
  const P0=GH.reg(N,0,0,-90+180/N),Rn=GH.rad(N),ko=(Rn+ell)/Rn,polys=[P0],kf=(Rn+ell*0.74)/Rn,outer=P0.map(q=>[q[0]*kf,q[1]*kf]);
  for(let i=0;i<N;i++){const a=P0[i],b=P0[(i+1)%N];polys.push([a,b,[b[0]*ko,b[1]*ko],[a[0]*ko,a[1]*ko]]);}
  const arcs=GH.picPoly(P0,th,2);
  // ring cells: the star's lines turn once and reach the spokes; from the spokes they run out to the frame
  for(let i=1;i<polys.length;i++){const Ry=GH.rays(polys[i],th);
    for(const [A,B] of [[Ry[0][0],Ry[1][1]],[Ry[0][1],Ry[3][0]]]){const r=GH.isect(A.o,A.d,B.o,B.d);if(r&&r[0]>0&&r[1]>0)arcs.push([A.o,[A.o[0]+A.d[0]*r[0],A.o[1]+A.d[1]*r[0]],B.o]);}
  }
  const k=R/(Rn*kf),st=GH.strapOf(g,k,1.2),w=st.w,h=w/2,toPx=q=>[q[0]*k,q[1]*k];
  const segs=[];for(const a of arcs)for(let i=0;i<a.length-1;i++)segs.push([a[i][0],a[i][1],a[i+1][0],a[i+1][1]]);
  for(let i=0;i<N;i++){const a=outer[i],b=outer[(i+1)%N];segs.push([a[0],a[1],b[0],b[1]]);}
  const F=GH.faces(GH.graph(segs)).map(f=>GH.tidy(f)),sig=f=>f.length+'|'+Math.abs(G.area(f)).toFixed(2);
  const order=[...new Set(F.map(sig))].sort((x,y)=>+y.split('|')[1]-+x.split('|')[1]);
  const parts=[{kind:'region',closed:true,role:'outer',plain:true,strap:true,pts:G.circle(0,0,R+rim,96)},{kind:'region',closed:true,role:'detail',plain:true,ci:order.length+1,pts:outer.map(toPx)}];
  const rF=Rn*kf*Math.cos(Math.PI/N)-1e-3;
  for(const f of F){if(f.some(q=>Math.hypot(q[0],q[1])>rF))continue;const I=w>0?GH.inset(f,h):f;if(I)parts.push({kind:'region',closed:true,role:'detail',plain:true,ci:order.indexOf(sig(f)),ns:!(w>0),cell:true,pts:I.map(toPx)});}
  const strands=GH.strands(arcs);
  if(!(w>0))for(const S of strands)parts.push({kind:'line',closed:S.closed,role:'outer',pts:S.pts.map(toPx)});
  else if(st.weave){GH.weave(strands);for(const S of strands){const pc=GH.pieces(S,w);if(pc)for(const q of pc)parts.push({kind:'region',closed:true,role:'inner',plain:true,strap:true,pts:q.map(toPx)});}}
  const head=parts.splice(0,2),clipped=GH.clipConvex(parts,outer.map(toPx));
  return head.concat(clipped,[{kind:'line',closed:true,role:'inner',pts:outer.map(toPx)},{kind:'line',closed:true,role:'detail',pts:G.circle(0,0,R+rim*0.45,96)}]);
};
for(const [key,pk,name,term,meaning] of [
  ['rosette8',[8,67.5],'Eightfold rosette','shamsa','A star pattern cut out as a roundel: the “little sun” set at the centre of a ceiling, a door leaf or the opening page of a book.'],
  ['rosette10',[10,72],'Tenfold rosette','shamsa · girih','The Persian fivefold rosette as a roundel: ten-pointed star, ten petals, and the ring of five-pointed stars that locks it to its neighbours.'],
  ['rosette12',[12,75],'Twelvefold rosette','shamsa','The Mamluk twelve-pointed rosette as a roundel, as it sits at the centre of a minbar door or a Qurʾān frontispiece.'],
  ['rosette16',[16,78.75],'Sixteenfold rosette','shamsa','Sixteen points and sixteen petals: the showpiece of a tile-cutter or a joiner, set alone where it can be read.']])
  defMotif(key,{name,term,meaning,fn(rng,g){return GH.roundel(pk[0],pk[1],g);}});
// the eight-pointed star itself: two squares, one turned 45°, passing over and under each other
defMotif('khatam',{name:'Eight-pointed star',term:'khātam · najmat al-quds',meaning:'Two squares, one turned an eighth of a turn, woven through each other. Khātam means “seal”; the figure is the unit of the star-and-cross pattern and the plan of the Dome of the Rock.',
fn(rng,g){const R=44,sq=(r,rad)=>({closed:true,pts:[0,1,2,3].map(i=>GH.pol(rad,r+i*90))});const st=GH.strapOf(g,34);const w=Math.max(st.w*34,5.5),ri=R*0.46;
  return GH.compose([sq(0,R),sq(45,R),sq(22.5,ri),sq(67.5,ri)],w,true).concat([{kind:'dot',x:0,y:0,r:2.2,role:'detail'}]);}});

/* ---------- borders ---------- */
GH.strip=function(key,L,t,{rows=1,w=0.15}={}){const pat=GH.PATTERNS[key],T=GH.TILINGS[pat.tiling],rw=T.rect[0],rh=T.rect[1]*(T.cen?0.5:1);
  const n=Math.max(1,Math.round(L/(t/rows*rw/rh))),k=L/(n*rw);const y=t/2;
  const P=clipPartsRect(GH.fill(pat,{x0:0,y0:0,x1:L,y1:t},k,k*rw/2,y,{w:w*k>2.4?w:0,weave:true,rot:T.rectRot||0}),{x0:0,y0:0,x1:L,y1:t});
  return P;};
defBorder('khatamBand',{name:'Star-and-cross band',fn(L,t){return GH.strip('khatam',L,t,{w:0.17});}});
defBorder('hexStarBand',{name:'Six-star band',fn(L,t){return GH.strip('hexStar',L,t,{w:0.15});}});
defBorder('girihBand',{name:'Girih band',fn(L,t){return GH.strip('girihBow',L,t,{w:0.14});}});
// two straps twisting round a row of eyes
defBorder('guilloche',{name:'Twisted strap',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.05))),lam=L/n,A=t*0.27,w=t*0.2,N=n*24;
  const mk=ph=>{const p=[];for(let i=-12;i<=N+12;i++){const x=i/N*L;p.push([x,t/2+A*Math.sin(x/lam*Math.PI+ph)]);}return{closed:false,pts:p};};
  const P=clipPartsRect(GH.compose([mk(0),mk(Math.PI)],w,true,q=>q,f=>0),{x0:0,y0:0,x1:L,y1:t});
  for(let i=0;i<n;i++)P.push({kind:'dot',x:(i+0.5)*lam,y:t/2,r:Math.max(1,t*0.06),role:'detail'});return P;}});
// angular plait: two zigzag straps
defBorder('strapPlait',{name:'Angular plait',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.9))),lam=L/n,w=t*0.2,m=t*0.16;
  const mk=s=>{const p=[];for(let i=-1;i<=n+1;i++)p.push([i*lam,((i%2+2)%2===s)?m:t-m]);return{closed:false,pts:p};};
  return clipPartsRect(GH.compose([mk(0),mk(1)],w,true,q=>q,f=>0),{x0:0,y0:0,x1:L,y1:t});}});
// stepped battlements, light and dark interlocking — the crest of a tile dado
defBorder('merlon',{name:'Stepped merlons',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.0))),w=L/n,P=[],s=3;
  for(let i=0;i<n;i++){const x=i*w,q=[[x,t]];for(let j=0;j<s;j++){const a=w/2*(j/s),b=w/2*((j+1)/s),y=t-(j+1)*t*0.86/s;q.push([x+a,y],[x+b,y]);}
    for(let j=s-1;j>=0;j--){const a=w-w/2*((j+1)/s),b=w-w/2*(j/s),y=t-(j+1)*t*0.86/s;q.push([x+a,y],[x+b,y]);}q.push([x+w,t]);
    P.push({kind:'region',closed:true,role:'outer',plain:true,ci:1,pts:q});}
  P.push({kind:'line',role:'inner',pts:[[0,t*0.06],[L,t*0.06]]});return P;}});

/* ---------- layouts ---------- */
GH.tilePool=function(g,rng){const pool=poolAll(g.motifs.tile).filter(k=>GH.PATTERNS[k]);return pool.length?pool:['khatam','hexStar','octRosette','tenAcute','twelveRosette'];};
// fit a whole number of repeats into a rectangle, stars on its corners; returns the panel actually covered
GH.fit=function(pat,x0,y0,x1,y1,period){const T=GH.TILINGS[pat.tiling],rw=T.rect[0],rh=T.rect[1];const iw=x1-x0,ih=y1-y0;
  // whole or half repeats each way (both cut on mirror lines); take the count that wastes least of the field
  let best=null;const p0=Math.max(1,Math.round(iw/period*2)/2);
  for(const p of [p0-0.5,p0,p0+0.5]){if(p<1)continue;const k0=iw/(p*rw);for(const q of [Math.floor(ih/(rh*k0)*2)/2,Math.ceil(ih/(rh*k0)*2)/2]){if(q<1)continue;
    const k=Math.min(k0,ih/(q*rh)),fillR=(p*rw*k)*(q*rh*k)/(iw*ih)-Math.abs(p-p0)*0.06;if(!best||fillR>best.f)best={f:fillR,p,q,k};}}
  const {p,q,k}=best,pw=p*rw*k,ph=q*rh*k,cx=(x0+x1)/2,cy=(y0+y1)/2;return{k,box:{x0:cx-pw/2,y0:cy-ph/2,x1:cx+pw/2,y1:cy+ph/2},rot:T.rectRot||0};};
GH.panel=function(ctx,key,box,k,rot,role='frame',variant='girih'){const st=GH.strapOf(ctx.g,k);
  const P=clipPartsRect(GH.fill(GH.PATTERNS[key],box,k,box.x0,box.y0,{w:st.w,weave:st.weave,pin:st.pin,rot}),box);
  ctx.items.push({type:'parts',parts:P,role,variant,knockOk:true});};
const ghRect=(a,b,c,e)=>[[a,b],[c,b],[c,e],[a,e]];

/* Girih panel: one star pattern covering a framed field, cut on its lines of symmetry so
   that stars sit on the corners — a door leaf, a tile dado, the page of a pattern scroll. */
defStructure('girih',{name:'Star-pattern panel',blurb:'One star pattern over a framed field, cut on its symmetry lines so stars sit on the corners. A reserved roundel may hold a subject.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,d=clamp(S.density);
  const bands=Math.min(2,Math.round(S.borderBands||0)),th=40,tot=bands?th+(bands-1)*(th*0.8+7):0;
  const key=rng.pick(GH.tilePool(g,rng)),pat=GH.PATTERNS[key];
  const f=GH.fit(pat,30+tot,30+tot,W-30-tot,H-30-tot,lerp(330,190,d)*pat.span/4);
  const b=f.box;if(bands)frameBands(ctx,{x0:b.x0-tot,y0:b.y0-tot,x1:b.x1+tot,y1:b.y1+tot},bands,th);
  GH.panel(ctx,key,b,f.k,f.rot);
  ctx.parts([{kind:'line',closed:true,role:'outer',pts:ghRect(b.x0,b.y0,b.x1,b.y1)}],'frame');
  const hero=ctx.pick('hero'),M=SG.motifs[hero],fig=M&&M.figure;
  if(fig||rng.next()<0.5*(1-clamp(S.bare||0))){const cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2,R=Math.min(b.x1-b.x0,b.y1-b.y0)*(fig?0.34:0.24);
    ctx.parts([{kind:'region',closed:true,role:'outer',plain:true,strap:true,pts:G.circle(cx,cy,R+9,120)},{kind:'region',closed:true,role:'inner',plain:true,bg:true,pts:G.circle(cx,cy,R,120)},{kind:'line',closed:true,role:'inner',pts:G.circle(cx,cy,R,120)}],'ring');
    ctx.motif(hero,cx,cy,R*(fig?1.9:1.72),{role:'hero',variant:'hero'});}
}});

/* Arched panel: a rectangular frame (alfiz) round a pointed arch. One pattern fills the
   spandrels, another the field under the arch — or a subject stands there. */
defStructure('iwan',{name:'Arched panel',blurb:'A pointed arch in a rectangular frame: one pattern in the spandrels, another (or a subject) under the arch.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,d=clamp(S.density);
  const inner=frameBands(ctx,{x0:30,y0:30,x1:W-30,y1:H-30},Math.max(1,Math.min(2,Math.round(S.borderBands||1))),38);
  const pool=rng.shuffle(GH.tilePool(g,rng)),kA=pool[0],kB=pool[1]||pool[0];
  const fA=GH.fit(GH.PATTERNS[kA],inner.x0,inner.y0,inner.x1,inner.y1,lerp(250,150,d)*GH.PATTERNS[kA].span/4);
  // spandrel pattern over the whole field (anchored on the top corners), the arch laid over it
  const stA=GH.strapOf(g,fA.k);
  ctx.items.push({type:'parts',parts:clipPartsRect(GH.fill(GH.PATTERNS[kA],inner,fA.k,inner.x0,inner.y0,{w:stA.w,weave:stA.weave,pin:stA.pin,rot:fA.rot}),inner),role:'frame',variant:'spandrel',knockOk:true});
  const cx=(inner.x0+inner.x1)/2,iw=inner.x1-inner.x0,m=iw*0.085,ax0=inner.x0+m,ax1=inner.x1-m,span=ax1-ax0,spring=inner.y0+(inner.y1-inner.y0)*0.47,base=inner.y1;
  // a pointed arch struck from two centres set a fifth of the span inside each jamb
  const arch=(inset)=>{const x0=ax0+inset,x1=ax1-inset,sp=x1-x0,e=sp*0.2,r=sp-e,pts=[[x0,base],[x0,spring]];
    const apexA=Math.acos((sp/2-e)/r)/DEG;
    for(let i=1;i<=28;i++){const a=(180+i/28*apexA)*DEG;pts.push([x1-e+r*Math.cos(a),spring+r*Math.sin(a)]);}
    for(let i=27;i>=0;i--){const a=(-i/28*apexA)*DEG;pts.push([x0+e+r*Math.cos(a),spring+r*Math.sin(a)]);}
    pts.push([x1,base]);return pts;};
  const A0=arch(0),bandW=Math.max(12,span*0.035),A1=arch(bandW);
  ctx.parts([{kind:'region',closed:true,role:'outer',plain:true,strap:true,pts:A0},{kind:'region',closed:true,role:'inner',plain:true,bg:true,pts:A1},{kind:'line',closed:false,role:'inner',pts:A1}],'ring');
  const hero=ctx.pick('hero'),M=SG.motifs[hero],fig=M&&M.figure;
  const top=G.bbox(A1).y0,ih=base-top,iw2=span-2*bandW;
  if(fig||rng.next()<0.6*(1-clamp(S.bare||0))){const s=Math.min(iw2*0.9,ih*0.78);ctx.motif(hero,cx,base-ih*0.44,s,{role:'hero',variant:'hero'});}
  else{const fB=GH.fit(GH.PATTERNS[kB],ax0+bandW,top,ax1-bandW,base,lerp(210,130,d)*GH.PATTERNS[kB].span/4),stB=GH.strapOf(g,fB.k);
    const P=GH.clipConvex(GH.fill(GH.PATTERNS[kB],{x0:ax0,y0:top,x1:ax1,y1:base},fB.k,cx,base,{w:stB.w,weave:stB.weave,pin:stB.pin,rot:fB.rot}),A1);
    ctx.items.push({type:'parts',parts:P,role:'frame',variant:'archfield',knockOk:true});
    ctx.parts([{kind:'line',closed:false,role:'inner',pts:A1}],'ring');}
}});

/* Dome plan: a rosette of rhombs. Take 2n directions round a circle; every pair of
   directions spans one rhomb, and ring by ring the rhombs widen from slivers to squares and
   narrow again. Seen from below, the tiers of a muqarnas vault project to rings of squares
   and rhombs like these; this is that plan reduced to its bare lattice. */
GH.rhombRose=function(N,cx,cy,u,rot=0){const V=(r,k)=>{let x=0,y=0;for(let i=0;i<r;i++){const a=(rot+(k+i)*360/N)*DEG;x+=Math.cos(a);y+=Math.sin(a);}return[cx+x*u,cy+y*u];};
  const out=[];for(let r=1;r<N/2;r++)for(let k=0;k<N;k++)out.push({ring:r,pts:[V(r-1,k+1),V(r,k),V(r+1,k),V(r,k+1)]});return out;};
defStructure('domePlan',{name:'Dome plan',blurb:'A rosette of rhombs widening and narrowing ring by ring — a vault of muqarnas tiers seen from below, reduced to its lattice.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;
  const inner=frameBands(ctx,{x0:30,y0:30,x1:W-30,y1:H-30},Math.min(1,Math.round(S.borderBands||0)),40);
  const cx=(inner.x0+inner.x1)/2,cy=(inner.y0+inner.y1)/2,Rmax=Math.min(inner.x1-inner.x0,inner.y1-inner.y0)/2-14;
  const N=rng.pick([16,16,20,24,12]),u=Rmax/(1/Math.sin(Math.PI/N))*0.985,rot=-90+180/N;
  // corner fields: a star pattern, hidden under the disc
  const key=rng.pick(GH.tilePool(g,rng)),f=GH.fit(GH.PATTERNS[key],inner.x0,inner.y0,inner.x1,inner.y1,lerp(230,150,clamp(S.density))*GH.PATTERNS[key].span/4);
  const stc=GH.strapOf(g,f.k);
  ctx.items.push({type:'parts',parts:clipPartsRect(GH.fill(GH.PATTERNS[key],inner,f.k,inner.x0,inner.y0,{w:stc.w,weave:stc.weave,pin:stc.pin,rot:f.rot}),inner),role:'frame',variant:'corners',knockOk:true});
  ctx.parts([{kind:'region',closed:true,role:'outer',plain:true,strap:true,pts:G.circle(cx,cy,Rmax+10,160)},{kind:'region',closed:true,role:'inner',plain:true,bg:true,pts:G.circle(cx,cy,Rmax+1,160)}],'ring');
  const st=GH.strapOf(g,u*1.6),gap=st.w>0?Math.max(1.6,st.w*u*0.42):0,P=[];
  const hero=ctx.pick('hero'),M=SG.motifs[hero],fig=M&&M.figure,keep=fig?Math.ceil(N/2*0.55):rng.next()<0.5*(1-clamp(S.bare||0))?Math.ceil(N/2*0.42):0;
  for(const c of GH.rhombRose(N,cx,cy,u,rot)){if(c.ring<keep)continue;const I=gap?GH.inset(c.pts,gap):c.pts;if(!I)continue;
    P.push({kind:'region',closed:true,role:'inner',plain:true,ci:c.ring-1,pts:I});}
  ctx.items.push({type:'parts',parts:P,role:'ring',variant:'dome'});
  if(keep){const rr=u*Math.sin(Math.PI*(keep-0.5)/N)/Math.sin(Math.PI/N)*0.86;ctx.motif(hero,cx,cy,rr*1.9,{role:'hero',variant:'hero'});}
}});
