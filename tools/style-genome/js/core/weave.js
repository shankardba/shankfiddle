'use strict';
/* Weave: two surface grammars that need more than one motif at a time.

   1. INTERLACE — closed paths drawn as cords that pass alternately over and under each
      other (Celtic knotwork, the ölzii knot, braided borders). Each loop is cut where it
      goes under, and every piece becomes a band REGION, so the cord can be filled, hatched,
      knocked out or brushed by any tradition's genes. Pieces of one loop share a `tone`,
      so a strand keeps one colour all the way round.

      Over/under always alternates along a cord, and there is always a consistent way to do
      it for a planar drawing (colour the regions like a chessboard; for a single closed
      curve this is Gauss's observation that the two visits to any crossing are separated
      by an even number of other crossings).

   2. TILES — all-over repeats that cover a whole field edge to edge (Japanese wagara,
      sashiko stitch grids, the Chinese thunder pattern). A tile is geometry only, in canvas
      coordinates, and is clipped to the area it fills. */

// ---------- clipping ----------
function clipPolyRect(pts,r){ // Sutherland–Hodgman against an axis-aligned rectangle
  const edges=[[p=>p[0]>=r.x0,(a,b)=>{const t=(r.x0-a[0])/(b[0]-a[0]);return[r.x0,a[1]+t*(b[1]-a[1])];}],
    [p=>p[0]<=r.x1,(a,b)=>{const t=(r.x1-a[0])/(b[0]-a[0]);return[r.x1,a[1]+t*(b[1]-a[1])];}],
    [p=>p[1]>=r.y0,(a,b)=>{const t=(r.y0-a[1])/(b[1]-a[1]);return[a[0]+t*(b[0]-a[0]),r.y0];}],
    [p=>p[1]<=r.y1,(a,b)=>{const t=(r.y1-a[1])/(b[1]-a[1]);return[a[0]+t*(b[0]-a[0]),r.y1];}]];
  let out=pts;
  for(const [ins,cut] of edges){
    const inp=out;out=[];if(!inp.length)break;
    for(let i=0;i<inp.length;i++){const a=inp[(i-1+inp.length)%inp.length],b=inp[i];
      if(ins(b)){if(!ins(a))out.push(cut(a,b));out.push(b);}else if(ins(a))out.push(cut(a,b));}
  }
  return out;
}
function clipLineRect(pts,closed,r){ // split a polyline into the runs that lie inside the rectangle
  const P=closed?pts.concat([pts[0]]):pts;const runs=[];let cur=null;
  for(let i=0;i<P.length-1;i++){
    const s=clipSeg([P[i],P[i+1]],r);
    if(!s||Math.hypot(s[1][0]-s[0][0],s[1][1]-s[0][1])<1e-6){if(cur){runs.push(cur);cur=null;}continue;}
    if(cur&&Math.hypot(cur[cur.length-1][0]-s[0][0],cur[cur.length-1][1]-s[0][1])<1e-6)cur.push(s[1]);
    else{if(cur)runs.push(cur);cur=[s[0],s[1]];}
  }
  if(cur)runs.push(cur);
  return runs;
}
function clipPartsRect(parts,r){
  const out=[];
  for(const p of parts){
    if(p.kind==='dot'){if(p.x>=r.x0&&p.x<=r.x1&&p.y>=r.y0&&p.y<=r.y1)out.push(p);continue;}
    if(p.kind==='region'){const b=G.bbox(p.pts);if(b.x0>=r.x0&&b.x1<=r.x1&&b.y0>=r.y0&&b.y1<=r.y1){out.push(p);continue;}
      const c=clipPolyRect(p.pts,r);if(c.length>=3&&Math.abs(G.area(c))>1)out.push(Object.assign({},p,{pts:c}));continue;}
    if(p.closed&&p.pts.every(([x,y])=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1)){out.push(p);continue;}
    for(const run of clipLineRect(p.pts,p.closed,r))if(run.length>1&&G.length(run,false)>0.5)out.push(Object.assign({},p,{pts:run,closed:false}));
  }
  return out;
}

// ---------- interlace ----------
// cut a closed loop at arc-length positions (sorted) and return the trimmed pieces as bands
function bandPieces(pts,cuts,cord,gap,tone,role='outer'){
  const L=G.length(pts,true);const out=[];
  if(!cuts.length){ // a loop that crosses nothing: one closed cord, drawn as its two edges
    out.push({kind:'line',closed:true,role,plain:true,pts:G.offset(pts,cord/2,true)},{kind:'line',closed:true,role,plain:true,pts:G.offset(pts,-cord/2,true)});
    return out;
  }
  for(let i=0;i<cuts.length;i++){
    let a=cuts[i]+gap,b=(i<cuts.length-1?cuts[i+1]:cuts[0]+L)-gap;if(b-a<cord*0.6)continue;if(a>=L){a-=L;b-=L;}
    let piece=G.sub(pts,true,a/L,b/L);if(piece.length<2)continue;
    piece=G.resample(piece,false,Math.max(1.2,cord*0.22));if(piece.length<2)continue;
    out.push({kind:'region',closed:true,role,tone,plain:true,pts:G.band(piece,cord)});
  }
  return out;
}
// Interlace on a mirror-curve grid (the kolam / Celtic-plait construction in structures.js).
// Vertices are midpoints between dots; a vertex where the path keeps its direction is a
// crossing. Along any path x-parity flips every step and each reflection flips the sign of
// dx·dy, so "over ⇔ (x even) = (dx·dy > 0)" alternates along every cord and gives the two
// cords at a crossing opposite answers.
function weaveGrid(loops,X,Y,{cord,gap,smooth=3,toneBase=0,role='outer'}){
  /* Each cord is smoothed once, as a whole closed curve, and then cut: smoothing the pieces
     separately left a kink wherever two of them met. Ends are trimmed to the edge of the cord
     that passes over (weaveCurves), so cords keep one width and meet edge to edge; a solid
     style with no outline gets a clear gap there instead. */
  const S=loops.map(l=>({pts:G.chaikin(l.map(v=>[X(v[0]),Y(v[1])]),true,smooth),closed:true}));
  return weaveCurves(S,cord,SG.knock?cord*0.3:0).map(p=>p.kind==='region'?Object.assign(p,{tone:toneBase+p.tone,role}):Object.assign(p,{role}));
}
// Interlace for free-drawn closed loops (triquetra, rings): crossings found numerically.
function weaveLoops(loops,{cord,gap,toneBase=0,role='outer'}){
  const segs=[];
  loops.forEach((pts,li)=>{let acc=0;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],l=Math.hypot(b[0]-a[0],b[1]-a[1]);segs.push({li,i,a,b,s0:acc,l});acc+=l;}});
  const visits=loops.map(()=>[]);let xid=0;
  for(let i=0;i<segs.length;i++)for(let j=i+1;j<segs.length;j++){
    const A=segs[i],B=segs[j];
    if(A.li===B.li){const n=loops[A.li].length;const d=Math.abs(A.i-B.i);if(d<=1||d===n-1)continue;}
    const rx=A.b[0]-A.a[0],ry=A.b[1]-A.a[1],sx=B.b[0]-B.a[0],sy=B.b[1]-B.a[1];const den=rx*sy-ry*sx;if(Math.abs(den)<1e-9)continue;
    const qx=B.a[0]-A.a[0],qy=B.a[1]-A.a[1];const t=(qx*sy-qy*sx)/den,u=(qx*ry-qy*rx)/den;
    if(t<0||t>=1||u<0||u>=1)continue;
    visits[A.li].push({s:A.s0+t*A.l,x:xid,lab:0});visits[B.li].push({s:B.s0+u*B.l,x:xid,lab:0});xid++;
  }
  // alternate along each loop, then flip whole loops (BFS) so each crossing has one over, one under
  visits.forEach(v=>{v.sort((a,b)=>a.s-b.s);v.forEach((e,k)=>e.lab=k%2);});
  const byX={};visits.forEach((v,li)=>v.forEach(e=>(byX[e.x]=byX[e.x]||[]).push([li,e])));
  const flip=loops.map(()=>null);
  for(let s=0;s<loops.length;s++){if(flip[s]!=null)continue;flip[s]=0;const Q=[s];
    while(Q.length){const li=Q.shift();for(const e of visits[li]){const other=byX[e.x].find(([l2,e2])=>e2!==e);if(!other)continue;const [l2,e2]=other;
      const want=1-((e.lab^flip[li])&1);if(flip[l2]==null){flip[l2]=(e2.lab^want)&1;Q.push(l2);}}}}
  const parts=[];
  loops.forEach((pts,li)=>{const cuts=visits[li].filter(e=>((e.lab^flip[li])&1)===1).map(e=>e.s);parts.push(...bandPieces(pts,cuts,cord,gap,toneBase+li,role));});
  return parts;
}
// D2 (mirror both ways) orbit key for a rectangular mirror-curve grid
function d2Orbit(x,y,N,M){return[[x,y],[N-x,y],[x,M-y],[N-x,M-y]].map(p=>p.join(',')).sort()[0];}
/* A rectangular knot field: dots on a cols×rows grid (optionally with a hole), breaks
   placed with mirror symmetry, traced as mirror curves and woven. Layouts whose loops
   miss every crossing are rejected; fewer loops and more crossings win. */
function knotField(x0,y0,x1,y1,rng,{cell=60,breaks=0.25,hole=null,cordK=0.62,sym='d2',tries=60,toneBase=0}={}){
  const cols=Math.max(1,Math.round((x1-x0)/cell)),rows=Math.max(1,Math.round((y1-y0)/cell));
  const ux=(x1-x0)/(2*cols),uy=(y1-y0)/(2*rows),u=Math.min(ux,uy);
  const X=v=>x0+v*ux,Y=v=>y0+v*uy;
  const present=(i,j)=>i<cols&&j<rows&&(!hole||!hole(X(2*i+1),Y(2*j+1)));
  const n=Math.max(cols,rows);const N=2*cols,M=2*rows;
  let best=null;
  for(let a=0;a<tries;a++){
    const orbit={};const pb=breaks*rng.range(0.6,1.3);
    const state=(x,y)=>{const k=sym==='c4'&&cols===rows?c4Orbit(x,y,N):d2Orbit(x,y,N,M);if(!(k in orbit))orbit[k]=rng.next()<pb?(rng.chance(.5)?'join':'sep'):'cross';return orbit[k];};
    const loops=kolamTrace(n,present,state);
    let bare=0,cross=0;for(const L of loops){let c=0;for(let i=0;i<L.length;i++){const p=L[(i-1+L.length)%L.length],q=L[i],r=L[(i+1)%L.length];if(q[0]-p[0]===r[0]-q[0]&&q[1]-p[1]===r[1]-q[1])c++;}if(!c)bare++;cross+=c;}
    const score=bare*50+loops.length*4-cross*0.05;
    if(!best||score<best.score)best={loops,score};
    if(bare===0&&loops.length===1)break;
  }
  const cord=u*cordK;
  return weaveGrid(best.loops,X,Y,{cord,gap:cord*0.5+u*0.16,toneBase});
}

// ---------- tiles (all-over repeats) ----------
SG.tiles={};
function defTile(key,o){SG.tiles[key]=Object.assign({key},o);}
// fill rectangle r with tile `key` at unit u (all parts clipped to r)
function tileParts(key,r,u,rng,g){const T=SG.tiles[key]||SG.tiles.seigaiha;const W=r.x1-r.x0,H=r.y1-r.y0;
  const P=T.fn(W,H,u,rng,g).map(p=>p.kind==='dot'?Object.assign({},p,{x:p.x+r.x0,y:p.y+r.y0}):Object.assign({},p,{plain:true,pts:p.pts.map(([x,y])=>[x+r.x0,y+r.y0])}));
  return clipPartsRect(P,r);}

defTile('seigaiha',{name:'Blue-sea waves',term:'seigaiha 青海波',meaning:'Overlapping fans of concentric arcs: calm waves without end, a wish for peace and good fortune that never stops.',
fn(W,H,u){const R=u,P=[];const rows=Math.ceil(H/(R*0.5))+3;
  for(let j=-2;j<rows;j++)for(let i=-1;i<=Math.ceil(W/(2*R))+1;i++){
    const cx=i*2*R+(j%2?R:0),cy=j*R*0.5;
    P.push({kind:'region',closed:true,role:'inner',tone:0,pts:G.arc(cx,cy,R,180,360,22)});
    for(const k of [0.76,0.52,0.28])P.push({kind:'line',role:'detail',pts:G.arc(cx,cy,R*k,180,360,Math.max(6,Math.round(16*k)))});
  }
  return P;}});
defTile('asanoha',{name:'Hemp leaf',term:'asanoha 麻の葉',meaning:'Six-pointed stars from a triangle grid. Hemp grows straight and fast, so the pattern was dyed into babies\' clothes for healthy growth.',
fn(W,H,u){const P=[];const s=u*1.6,h=s*Math.sqrt(3)/2;
  for(let j=-1;j<=Math.ceil(H/h)+1;j++)for(let i=-1;i<=Math.ceil(W/s)+1;i++){
    const ox=i*s+(j%2?s/2:0),oy=j*h;
    for(const up of [true,false]){
      const tri=up?[[ox,oy+h],[ox+s/2,oy],[ox+s,oy+h]]:[[ox+s/2,oy],[ox+s,oy+h],[ox+s*1.5,oy]];
      const c=[(tri[0][0]+tri[1][0]+tri[2][0])/3,(tri[0][1]+tri[1][1]+tri[2][1])/3];
      for(const v of tri)P.push({kind:'line',role:'inner',pts:[v,c]});
      if(up)P.push({kind:'line',role:'inner',closed:true,pts:tri});
    }
  }
  return P;}});
defTile('shippo',{name:'Seven treasures',term:'shippō 七宝',meaning:'Endlessly linked circles; each overlap is a four-pointed petal. Read as harmony and ever-continuing good relations.',
fn(W,H,u){const s=u*1.4,r=s/Math.SQRT2,P=[];
  for(let j=-1;j<=Math.ceil(H/s)+1;j++)for(let i=-1;i<=Math.ceil(W/s)+1;i++){
    const x=i*s,y=j*s;
    P.push({kind:'region',closed:true,role:'inner',tone:0,pts:G.arc(x,y,r,-45,45,10).concat(G.arc(x+s,y,r,135,225,10))});
    P.push({kind:'region',closed:true,role:'inner',tone:1,pts:G.arc(x,y,r,45,135,10).concat(G.arc(x,y+s,r,225,315,10))});
  }
  return P;}});
defTile('kikko',{name:'Tortoiseshell',term:'kikkō 亀甲',meaning:'Hexagons like a tortoise\'s shell: the tortoise lives ten thousand years, so the pattern wishes long life.',
fn(W,H,u){const R=u*0.9,P=[];const dx=R*1.5,dy=R*Math.sqrt(3);
  for(let i=-1;i<=Math.ceil(W/dx)+1;i++)for(let j=-1;j<=Math.ceil(H/dy)+1;j++){
    const cx=i*dx,cy=j*dy+(i%2?dy/2:0);const hex=k=>Array.from({length:6},(_,a)=>[cx+Math.cos(a*Math.PI/3)*R*k,cy+Math.sin(a*Math.PI/3)*R*k]);
    P.push({kind:'region',closed:true,role:'inner',tone:(i%2+2)%2,pts:hex(0.93)});P.push({kind:'line',closed:true,role:'detail',pts:hex(0.62)});
  }
  return P;}});
defTile('uroko',{name:'Fish scales',term:'uroko 鱗',meaning:'Alternating triangles read as scales of a snake, fish or dragon: protection against evil, worn on festival and theatre costume.',
fn(W,H,u){const s=u*1.5,h=s*Math.sqrt(3)/2,P=[];
  for(let j=-1;j<=Math.ceil(H/h)+1;j++)for(let i=-1;i<=Math.ceil(W/s)+1;i++){const ox=i*s+(j%2?s/2:0),oy=j*h;
    P.push({kind:'region',closed:true,role:'inner',tone:0,pts:[[ox,oy+h],[ox+s/2,oy],[ox+s,oy+h]]});}
  return P;}});
defTile('ichimatsu',{name:'Checkerboard',term:'ichimatsu 市松',meaning:'Alternating squares, named after the Edo kabuki actor Sanogawa Ichimatsu, whose hakama carried it; the unbroken repeat reads as prosperity continuing.',
fn(W,H,u){const s=u*1.2,P=[];for(let j=0;j<=Math.ceil(H/s);j++)for(let i=0;i<=Math.ceil(W/s);i++)if((i+j)%2===0)P.push({kind:'region',closed:true,role:'inner',tone:0,pts:[[i*s,j*s],[i*s+s,j*s],[i*s+s,j*s+s],[i*s,j*s+s]]});return P;}});
/* Hitomezashi ("one-stitch") sashiko: every grid line is stitched on/off/on…, and each line
   only chooses whether it starts on or off. Those single bits make the closed shapes. */
defTile('hitomezashi',{name:'One-stitch grid',term:'hitomezashi 一目刺し',meaning:'Running stitches on a grid where each row and column only chooses whether to start "on" or "off" — closed crosses, steps and stars emerge from those single choices.',
fn(W,H,u,rng){const s=u*0.75,P=[];const nx=Math.ceil(W/s)+1,ny=Math.ceil(H/s)+1;const R=rng||makeRng(5);
  const rb=Array.from({length:ny+1},()=>R.chance(.5)?1:0),cb=Array.from({length:nx+1},()=>R.chance(.5)?1:0);
  for(let j=0;j<=ny;j++)for(let i=0;i<nx;i++)if((i+rb[j])%2===0)P.push({kind:'line',role:'inner',pts:[[i*s,j*s],[i*s+s,j*s]]});
  for(let i=0;i<=nx;i++)for(let j=0;j<ny;j++)if((j+cb[i])%2===0)P.push({kind:'line',role:'inner',pts:[[i*s,j*s],[i*s,j*s+s]]});
  return P;}});
/* Leiwen: square spirals packed edge to edge, alternating in direction — the "thunder"
   ground of Shang and Zhou bronzes (the rounded form is yunwen, "cloud"). */
function squareSpiral(cx,cy,s,turns,cw){ // from the bottom corner, winding inward
  const g=s/(2*turns+1),D=[[0,-1],[1,0],[0,1],[-1,0]];let x=-s/2,y=s/2;const pts=[[x,y]];
  for(let k=0;;k++){const len=k<2?s:s-g*Math.floor((k)/2);if(len<g*0.99)break;const [dx,dy]=D[k%4];x+=dx*len;y+=dy*len;pts.push([x,y]);}
  return pts.map(([px,py])=>[cx+(cw?px:-px),cy+py]);}
defTile('leiwen',{name:'Thunder pattern',term:'léiwén 雷纹',meaning:'Square spirals packed edge to edge: the "thunder" ground behind the masks of Shang and Zhou ritual bronzes. Its rounded twin is yúnwén, the cloud pattern.',
fn(W,H,u){const s=u*1.1,P=[];for(let j=0;j<=Math.ceil(H/s);j++)for(let i=0;i<=Math.ceil(W/s);i++)P.push({kind:'line',role:'detail',pts:squareSpiral(i*s+s/2,j*s+s/2,s*0.84,2,(i+j)%2===0)});return P;}});
