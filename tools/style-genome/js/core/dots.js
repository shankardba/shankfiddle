'use strict';
/* Dots — the dot-painting technique as genes, and the public iconography of desert painting.

   THE TECHNIQUE. A desert canvas is painted in two passes: the forms first (sites, tracks,
   animals), then the whole ground is closed with rows of dots that follow every outline
   outward until the rows from neighbouring forms meet. That is a distance field, so the
   renderer builds one: every drawn contour is a seed, the exact distance to the nearest
   seed is found for each cell of a grid (Felzenszwalb & Huttenlocher's linear-time
   transform), and dots are set along the lines of equal distance, one row per step.
   Because it works from whatever was drawn, the same gene dots the ground around a kolam,
   a hieroglyph column or a deity figure.

     ornament.dotField   0..1  how far the dotting spreads (1 = the whole ground)
     ornament.dotSize    dot diameter, in units of a 1000-wide canvas
     ornament.dotPitch   centre-to-centre spacing ÷ diameter (1.3 touching … 2 airy)
     ornament.dotBand    rows per colour band
     ornament.dotScheme  'bands' | 'patches' | 'mono'
     line.dotted         0..1  share of drawn lines set down as rows of dots

   THE ICONOGRAPHY here is the open, widely published layer only — site, person, track,
   tool, water — arranged at random. It tells no story. See the family's care note. */

// ---------- distance field ----------
function edtLine(f,n,d,src,v,z){
  let k=0;v[0]=0;z[0]=-1e30;z[1]=1e30;
  for(let q=1;q<n;q++){
    let s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);
    while(s<=z[k]){k--;s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);}
    k++;v[k]=q;z[k]=s;z[k+1]=1e30;
  }
  k=0;for(let q=0;q<n;q++){while(z[k+1]<q)k++;const p=v[k];d[q]=(q-p)*(q-p)+f[p];src[q]=p;}
}
// seed: Uint8Array, 1 where a contour passes. Returns the index of the nearest seed cell for every cell.
function nearestSeed(seed,gw,gh){
  const N=gw*gh,INF=1e12,g=new Float64Array(N),sy=new Int32Array(N),m=Math.max(gw,gh);
  const f=new Float64Array(m),d=new Float64Array(m),s=new Int32Array(m),v=new Int32Array(m),z=new Float64Array(m+1);
  for(let x=0;x<gw;x++){for(let y=0;y<gh;y++)f[y]=seed[y*gw+x]?0:INF;edtLine(f,gh,d,s,v,z);for(let y=0;y<gh;y++){g[y*gw+x]=d[y];sy[y*gw+x]=s[y];}}
  const src=new Int32Array(N);
  for(let y=0;y<gh;y++){const o=y*gw;for(let x=0;x<gw;x++)f[x]=g[o+x];edtLine(f,gw,d,s,v,z);for(let x=0;x<gw;x++)src[o+x]=sy[o+s[x]]*gw+s[x];}
  return src;
}
// even-odd scanline fill of a polygon into a cell mask
function rasterPoly(mask,gw,gh,cell,pts){
  let y0=1e9,y1=-1e9;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
  const r0=Math.max(0,Math.floor(y0/cell-0.5)),r1=Math.min(gh-1,Math.ceil(y1/cell-0.5)),xs=[];
  for(let r=r0;r<=r1;r++){const y=(r+0.5)*cell;xs.length=0;
    for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]>y)!==(b[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
    xs.sort((p,q)=>p-q);
    for(let k=0;k+1<xs.length;k+=2){const c0=Math.max(0,Math.ceil(xs[k]/cell-0.5)),c1=Math.min(gw-1,Math.floor(xs[k+1]/cell-0.5));for(let c=c0;c<=c1;c++)mask[r*gw+c]=1;}
  }
}
/* lines of equal distance by marching squares, chained into polylines.
   D is sampled at cell centres; returns levels[j] = [{pts,closed}] for distance d0 + j·step. */
function isoRows(D,gw,gh,cell,d0,step,jmax){
  const lv=[];const get=j=>lv[j]||(lv[j]={pt:new Map(),adj:new Map()});
  const link=(L,a,b)=>{let q=L.adj.get(a);if(!q)L.adj.set(a,q=[]);q.push(b);q=L.adj.get(b);if(!q)L.adj.set(b,q=[]);q.push(a);};
  for(let y=0;y<gh-1;y++)for(let x=0;x<gw-1;x++){
    const i=y*gw+x,a=D[i],b=D[i+1],c=D[i+gw+1],d=D[i+gw];
    const lo=Math.min(a,b,c,d),hi=Math.max(a,b,c,d);
    let j=Math.ceil((lo-d0)/step);if(j<0)j=0;const j1=Math.min(jmax,Math.floor((hi-d0)/step));
    for(;j<=j1;j++){
      const v=d0+j*step,m=(a>=v?8:0)|(b>=v?4:0)|(c>=v?2:0)|(d>=v?1:0);if(m===0||m===15)continue;
      const L=get(j);
      const T=()=>{const k=2*i;if(!L.pt.has(k))L.pt.set(k,[x+(v-a)/(b-a),y]);return k;};
      const B=()=>{const k=2*(i+gw);if(!L.pt.has(k))L.pt.set(k,[x+(v-d)/(c-d),y+1]);return k;};
      const Lf=()=>{const k=2*i+1;if(!L.pt.has(k))L.pt.set(k,[x,y+(v-a)/(d-a)]);return k;};
      const R=()=>{const k=2*(i+1)+1;if(!L.pt.has(k))L.pt.set(k,[x+1,y+(v-b)/(c-b)]);return k;};
      switch(m){
        case 1:case 14:link(L,Lf(),B());break;
        case 2:case 13:link(L,B(),R());break;
        case 3:case 12:link(L,Lf(),R());break;
        case 4:case 11:link(L,T(),R());break;
        case 6:case 9:link(L,T(),B());break;
        case 7:case 8:link(L,T(),Lf());break;
        case 5:if((a+b+c+d)/4>=v){link(L,T(),Lf());link(L,B(),R());}else{link(L,T(),R());link(L,Lf(),B());}break;
        case 10:if((a+b+c+d)/4>=v){link(L,T(),R());link(L,Lf(),B());}else{link(L,T(),Lf());link(L,B(),R());}break;
      }
    }
  }
  const W=p=>[(p[0]+0.5)*cell,(p[1]+0.5)*cell];
  return lv.map(L=>{
    if(!L)return[];const seen=new Set(),out=[];
    const walk=(k0,closed)=>{const pts=[];let k=k0,prev=-1;
      for(;;){seen.add(k);pts.push(W(L.pt.get(k)));const nb=L.adj.get(k);let nx=-1;for(const q of nb)if(q!==prev&&!seen.has(q)){nx=q;break;}if(nx<0)break;prev=k;k=nx;}
      out.push({pts,closed});};
    for(const [k,nb] of L.adj)if(nb.length===1&&!seen.has(k))walk(k,false);
    for(const k of L.adj.keys())if(!seen.has(k))walk(k,true);
    return out;
  });
}
// smooth value noise in 0..1 (period p), for patches of colour
function patchNoise(seed,p){const h=(i,j)=>(hashStr(seed+'|'+i+'|'+j)%10007)/10007;
  return(x,y)=>{const u=x/p,v=y/p,i=Math.floor(u),j=Math.floor(v),a=u-i,b=v-j,s=a*a*(3-2*a),t=b*b*(3-2*b);return lerp(lerp(h(i,j),h(i+1,j),s),lerp(h(i,j+1),h(i+1,j+1),s),t);};}
// irregular patches: each point belongs to the nearest of a jittered grid of centres, the borders pushed about by noise
function patchCells(seed,p,n){const wx=patchNoise(seed+'x',p*0.55),wy=patchNoise(seed+'y',p*0.55),c={};
  const cell=(i,j)=>c[i+','+j]||(c[i+','+j]=[(i+0.15+0.7*(hashStr(seed+'a'+i+'|'+j)%997)/997)*p,(j+0.15+0.7*(hashStr(seed+'b'+i+'|'+j)%997)/997)*p,hashStr(seed+'c'+i+'|'+j)%n]);
  return(x,y)=>{x+=(wx(x,y)-0.5)*p*0.7;y+=(wy(x,y)-0.5)*p*0.7;const i0=Math.floor(x/p),j0=Math.floor(y/p);let best=1e18,k=0;
    for(let j=j0-1;j<=j0+1;j++)for(let i=i0-1;i<=i0+1;i++){const q=cell(i,j),d=(q[0]-x)*(q[0]-x)+(q[1]-y)*(q[1]-y);if(d<best){best=d;k=q[2];}}return k;};}

// the dotted ground, as SVG: called by the renderer between the ground and the drawing
function dotFieldSvg(R,W,H){
  const O=R.O,k=clamp(O.dotField||0);if(k<=0.02||!R.seeds.length)return'';
  const sc=R.sc,diam=Math.max(1.6,(O.dotSize||5)*sc),pitch=diam*clamp(O.dotPitch||1.5,1.15,3),rowGap=pitch*0.97;
  const cell=clamp(pitch/5,1.1,3),gw=Math.ceil(W/cell)+1,gh=Math.ceil(H/cell)+1,N=gw*gh;
  const seed=new Uint8Array(N),px=new Float32Array(N),py=new Float32Array(N),gid=new Int32Array(N);
  const stamp=(x,y,g)=>{const c=Math.floor(x/cell),r=Math.floor(y/cell);if(c<0||r<0||c>=gw||r>=gh)return;const i=r*gw+c;
    // keep the sample nearest the cell centre, so distances stay exact to a fraction of a cell
    const dx=x-(c+0.5)*cell,dy=y-(r+0.5)*cell,q=dx*dx+dy*dy;if(seed[i]){const ex=px[i]-(c+0.5)*cell,ey=py[i]-(r+0.5)*cell;if(ex*ex+ey*ey<=q)return;}seed[i]=1;px[i]=x;py[i]=y;gid[i]=g;};
  let any=false;
  for(const s of R.seeds){const P=s.pts,n=P.length;if(n<2)continue;
    for(let i=0;i<(s.closed?n:n-1);i++){const a=P[i],b=P[(i+1)%n],l=Math.hypot(b[0]-a[0],b[1]-a[1]),m=Math.max(1,Math.ceil(l/(cell*0.45)));
      for(let q=0;q<=m;q++){stamp(a[0]+(b[0]-a[0])*q/m,a[1]+(b[1]-a[1])*q/m,s.gid);any=true;}}}
  if(!any)return'';
  const src=nearestSeed(seed,gw,gh),D=new Float32Array(N);
  for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){const i=y*gw+x,j=src[i];D[i]=seed[j]?Math.hypot((x+0.5)*cell-px[j],(y+0.5)*cell-py[j]):1e6;}
  const mask=new Uint8Array(N);for(const m of R.masks){const b=G.bbox(m);if(Math.min(b.w,b.h)>pitch*1.2)rasterPoly(mask,gw,gh,cell,m);}
  const d0=Math.max(rowGap*0.98,R.L.weight*0.5+diam*0.72);
  const jmax=k>=0.97?Math.ceil(Math.hypot(W,H)/rowGap):Math.max(0,Math.round(k*k*30)-1);
  const rows=isoRows(D,gw,gh,cell,d0,rowGap,jmax);
  // colours: every palette colour that shows against the ground
  let cols=poolAll(R.g.palette.fills).filter(c=>C.dist(c,R.ground)>0.1);
  if(O.gems&&O.gems.length&&(O.dotScheme||'bands')!=='mono')cols=[...new Set([...O.gems.filter(c=>C.dist(c,R.ground)>0.1),...cols])];
  if(!cols.length)cols=[R.inkBase];
  const scheme=O.dotScheme||'bands',band=Math.max(1,Math.round(O.dotBand||2)),nc=cols.length;
  const patch=patchCells('dots'+R.seed,W/4.6,nc),r=makeRng(hashStr('df'+R.seed));
  const offs={};const off=g=>offs[g]!=null?offs[g]:(offs[g]=hashStr('go'+R.seed+'|'+g)%nc);
  const colour=(j,x,y,cellI)=>{
    if(scheme==='mono')return cols[0];
    if(scheme==='patches'&&j>=band)return cols[patch(x,y)];
    return cols[(Math.floor(j/band)+off(gid[src[cellI]]))%nc];
  };
  const buckets=new Map(),sizes=[0.87,1,1.14],jit=pitch*0.075;
  const put=(x,y,j)=>{
    if(x<-diam||y<-diam||x>W+diam||y>H+diam)return;
    const c=clamp(Math.floor(x/cell),0,gw-1),rr=clamp(Math.floor(y/cell),0,gh-1),ci=rr*gw+c;if(mask[ci])return;
    const key=colour(j,x,y,ci)+'|'+Math.floor(r.next()*3);let b=buckets.get(key);if(!b)buckets.set(key,b=[]);
    b.push('M'+(x+r.range(-jit,jit)).toFixed(1)+' '+(y+r.range(-jit,jit)).toFixed(1)+'h.01');
  };
  rows.forEach((polys,j)=>{for(const pl of polys){
    let P=pl.pts;if(P.length<2)continue;
    const len=G.length(P,pl.closed);
    if(pl.closed&&len<pitch*2.4){if(len>pitch*0.9){const c=G.centroid(P);put(c[0],c[1],j);}continue;}
    if(len<pitch*0.6)continue;
    // one pass of smoothing takes the grid out of the line
    const n=P.length;P=P.map((p,i)=>{if(!pl.closed&&(i===0||i===n-1))return p;const a=P[(i-1+n)%n],b=P[(i+1)%n];return[(a[0]+2*p[0]+b[0])/4,(a[1]+2*p[1]+b[1])/4];});
    for(const s of G.samples(P,pl.closed,pitch,pl.closed?r.next():r.next()*0.5))put(s.x,s.y,j);
  }});
  let out='';
  // patches of colour washed in under the dots, their edges left soft
  if(scheme==='patches'&&(O.dotWash||0)>0.02){const u=W/34,fid=R.id+'dw';let w='';const tone={};
    for(let y=-u;y<H+u;y+=u)for(let x=-u;x<W+u;x+=u){const c=cols[patch(x+u/2,y+u/2)];const t=tone[c]||(tone[c]=C.mix(R.ground,c,0.5));w+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(u+0.6).toFixed(1)}" height="${(u+0.6).toFixed(1)}" fill="${t}"/>`;}
    R.defs.set('dotwash',{pid:fid,svg:`<filter id="${fid}" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${(u*0.42).toFixed(1)}"/></filter>`});
    out+=`<g filter="url(#${fid})" opacity="${clamp(O.dotWash).toFixed(2)}">${w}</g>`;}
  for(const [key,b] of buckets){const [col,si]=key.split('|');out+=`<path d="${b.join('')}" fill="none" stroke="${col}" stroke-width="${(diam*sizes[+si]).toFixed(2)}" stroke-linecap="round"/>`;}
  return `<g>${out}</g>`;
}

// ---------- desert iconography ----------
const DS={};
DS.tube=(pts,hw)=>FK.tube(pts,typeof hw==='function'?hw:()=>hw);
DS.arc=(cx,cy,r,a0,a1,n=20)=>G.arc(cx,cy,r,a0,a1,n);
// a sitting person seen from above: the mark left in the sand
DS.u=(x,y,s,rot,role='outer')=>reg(G.xform(DS.tube(DS.arc(0,0,8,20,160,18),2.7),{x,y,s,rot}),role);

defMotif('roundel',{name:'Concentric circles',term:'site',meaning:'Rings around a centre: a place — camp, waterhole, fire, rock hole — and often the place where an ancestral being went into or came out of the ground. The most used sign in desert painting; which place it is depends on the painter and the story.',
fn(rng){const P=[],n=rng.int(3,5);for(let i=0;i<n;i++)P.push(ln(G.circle(0,0,47-i*(38/n),72),i===0?'outer':'inner',true));P.push(reg(G.circle(0,0,n===3?10:7.5,32),'inner'));return P;}});
defMotif('uShape',{name:'Sitting person',term:'U-shape',meaning:'The mark a person leaves sitting cross-legged in the sand, seen from above. What lies beside it says who: a digging stick and dish for a woman, spears and a boomerang for a man.',
fn(){return fitParts([DS.u(0,0,1,0),ln([[14,-6],[14,9]],'inner'),reg(G.ellipse(-15,2,3.2,7.5,24),'inner')],92);}});
defMotif('campSite',{name:'People at a site',term:'camp',meaning:'A site with people seated around it — a meeting, a ceremony, a meal shared at a fire or soakage.',
fn(rng){const P=[];for(let i=0;i<3;i++)P.push(ln(G.circle(0,0,19-i*6,48),i===0?'outer':'inner',true));P.push(reg(G.circle(0,0,3.6,20),'inner'));
  const n=rng.pick([3,4,4,5]);for(let i=0;i<n;i++){const a=i/n*360+rng.range(-8,8);const x=Math.sin(a*DEG)*36,y=-Math.cos(a*DEG)*36;P.push(DS.u(x,y,1.25,a+180));
    const b=a+24;P.push(ln([[Math.sin(b*DEG)*33,-Math.cos(b*DEG)*33],[Math.sin(b*DEG)*45,-Math.cos(b*DEG)*45]],'inner'));}
  return P;}});
defMotif('kangarooTrack',{name:'Kangaroo tracks',term:'track',meaning:'Paired long hind-foot prints, sometimes with the drag of the tail between them. Tracks are read the way a hunter reads the ground: who passed, and which way.',
fn(){const P=[];for(const y of [-26,6]){for(const sx of [-1,1]){P.push(reg(G.xform(DS.tube([[0,-13],[1.2,0],[0,11]],t=>1.3+2.2*Math.sin(Math.PI*Math.min(1,t*1.15))),{x:sx*10,y:y+8,rot:sx*9}),'outer'));
    P.push(reg(G.xform(DS.tube([[0,0],[sx*6,3]],1.5),{x:sx*13,y:y+18}),'outer'));}}
  P.push(ln(FK.spline([[0,-40],[1.5,-20],[-1.5,2],[0,36]],false,8),'inner'));return P;}});
defMotif('emuTrack',{name:'Emu tracks',term:'track',meaning:'Three-toed arrows: the emu walking. The arrow points the way the bird came from, since the toes spread forward.',
fn(){const P=[];for(const [x,y] of [[-12,-22],[11,2],[-10,26]])for(const a of [-36,0,36])P.push(reg(G.xform(DS.tube([[0,2],[0,-17]],t=>2.4-1.1*t),{x,y,rot:a}),'outer'));return P;}});
defMotif('humanTrack',{name:'Footprints',term:'track',meaning:'A person walking: the journey of the people in the painting, or of an ancestor.',
fn(){const P=[];for(const [x,y,sx,rot] of [[-11,-20,-1,-6],[11,14,1,6]]){
  P.push(reg(G.xform(FK.spline([[0,17],[-5,13],[-5.5,2],[-7,-8],[-3,-15],[4,-14],[6.5,-7],[4.5,3],[5,13]],true,6),{x,y,rot,flip:sx<0}),'outer'));
  for(let i=0;i<5;i++){const q=G.xform([[-6+i*3.1,-19-Math.sin(i/4*Math.PI)*2.4+i*0.7]],{x,y,rot,flip:sx<0})[0];P.push(dt(q[0],q[1],1.9-i*0.2,'outer'));}}return P;}});
defMotif('goannaTrack',{name:'Goanna tracks',term:'track',meaning:'The furrow of a dragging tail with small footprints stepping out on either side: a goanna or lizard crossing the sand.',
fn(){const P=[ln(FK.spline([[0,-44],[4,-22],[-4,0],[4,22],[0,44]],false,10),'outer')];
  for(let i=0;i<5;i++){const y=-36+i*18,sx=i%2?1:-1;for(const a of [-28,0,28])P.push(ln(G.xform([[0,0],[0,-7]],{x:sx*13,y,rot:sx*62+a}),'inner'));}return P;}});
defMotif('waterLines',{name:'Running water',term:'water',meaning:'Parallel wavy lines: water running after rain, a creek, sometimes lightning, smoke or the track of a snake. Between two sites they are the water that joins them.',
fn(){const P=[];for(let k=-1;k<=1;k++)P.push(ln(Array.from({length:49},(_,i)=>[-46+i*92/48,k*13+Math.sin(i/48*Math.PI*3.2)*6.5]),k===0?'outer':'inner'));return P;}});
defMotif('barSet',{name:'Bars',term:'bars',meaning:'Short parallel bars beside a track or a site: in published readings, ceremonial objects, clapsticks, or people lying down. Their meaning belongs to the story they sit in.',
fn(){const P=[];for(let k=-1;k<=1;k++)P.push(reg(G.roundRect(k*11-3.6,-22,k*11+3.6,22,3.2),k===0?'inner':'outer',k===0?{forceFill:'flat'}:{solid:true}));return fitParts(P,70);}});
defMotif('coolamon',{name:'Carrying dish',term:'coolamon',meaning:'The long shallow wooden dish for carrying seed, water, fruit or a baby. Beside a U-shape it marks a woman; with a digging stick, a day of gathering.',
fn(){return[reg(G.ellipse(0,0,15,43,56),'outer'),ln(G.ellipse(0,0,9,35,48),'inner',true),ln(FK.spline([[0,-28],[2,0],[0,28]],false,8),'detail')];}});
defMotif('boomerang',{name:'Boomerang',term:'karli',meaning:'The curved throwing stick; paired, they are also clapped together for rhythm. Beside a U-shape it marks a man.',
fn(){const c=FK.spline([[-40,24],[-22,-6],[0,-20],[22,-6],[40,24]],false,10);const P=[reg(DS.tube(c,t=>5.6-2.2*Math.abs(t-0.5)*1.4),'outer')];
  for(const f of [0.2,0.32,0.5,0.68,0.8]){const s=G.samples(c,false,G.length(c,false)*f)[1];if(s)P.push(ln([[s.x-s.ty*4,s.y+s.tx*4],[s.x+s.ty*4,s.y-s.tx*4]],'detail'));}return P;}});
defMotif('spearSet',{name:'Spears',term:'kulata',meaning:'Long straight lines, sometimes barbed: hunting spears, with the spear-thrower laid beside them.',
fn(){const P=[];for(const x of [-9,4]){P.push(reg(DS.tube([[x,46],[x,-30]],1.5),'outer'));P.push(reg([[x,-47],[x-3.6,-30],[x+3.6,-30]],'outer'));for(const y of [-24,-18])P.push(ln([[x,y],[x+5,y+5]],'detail'));}
  P.push(reg(DS.tube([[18,30],[19,-4],[17,-22]],t=>2.6+2.4*Math.sin(Math.PI*t)),'outer'));return P;}});
defMotif('bushPlant',{name:'Bush fruit',term:'bush tucker',meaning:'A branching plant with its fruit or seed at the tips — bush tomato, plum, yam, seed grasses. Paintings of plant foods carry the knowledge of where and when to gather them.',
fn(rng){const P=[];const stem=FK.spline([[-34,40],[-14,18],[2,-4],[26,-40]],false,12);P.push(reg(DS.tube(stem,t=>2.6-1.3*t),'outer'));
  const S=G.samples(stem,false,G.length(stem,false)/6);
  S.slice(1).forEach((s,i)=>{const sd=i%2?1:-1,l=rng.range(17,25),nx=-s.ty*sd,ny=s.tx*sd;const e=[s.x+nx*l+s.tx*7,s.y+ny*l+s.ty*7];
    P.push(reg(DS.tube(FK.spline([[s.x,s.y],[s.x+nx*l*0.5+s.tx*1.5,s.y+ny*l*0.5+s.ty*1.5],e],false,8),t=>1.8-0.7*t),'outer'));
    P.push(reg(G.circle(e[0],e[1],6.6,28),'outer'));P.push(reg(G.circle(e[0],e[1],3.6,20),'inner'));});
  return fitParts(P,96);}});
defMotif('carpetSnake',{name:'Snake',term:'snake',meaning:'A winding body with its head at one end. Snakes travel between waterholes, so a snake on a canvas is often also the track of water. Ancestral serpents belong to particular peoples and are not what is drawn here.',
mirrorOk:true,fn(){const c=Array.from({length:60},(_,i)=>{const t=i/59;return[-44+t*84,Math.sin(t*Math.PI*2.4)*17*(1-0.25*t)];});
  const P=[reg(DS.tube(c,t=>t>0.93?4.6+(t-0.93)*22:1+5*Math.pow(Math.sin(Math.PI*Math.min(1,t*1.02)),0.45)),'outer')];
  const L=G.length(c,false);for(let k=1;k<15;k++){const s=G.samples(c,false,L*k/16)[1];if(!s)continue;const h=1+4.4*Math.pow(Math.sin(Math.PI*k/16),0.45);P.push(ln([[s.x-s.ty*h*0.8,s.y+s.tx*h*0.8],[s.x+s.ty*h*0.8,s.y-s.tx*h*0.8]],'detail'));}
  const e=c[c.length-1];P.push(dt(e[0]-1.5,e[1]-2.4,0.9,'detail'),dt(e[0]-1.5,e[1]+2.4,0.9,'detail'));return fitParts(P,96);}});

// ---------- structures ----------
/* Sites and tracks: a map seen from above. Sites are thrown down with room between them,
   joined by the shortest tree of travelling lines (plus a few that run off the edge —
   Country does not stop at the canvas), then people, tools and tracks are set around them. */
defStructure('country',{name:'Sites and tracks',blurb:'A map seen from above: concentric sites joined by bands of travelling lines, people seated around them, tracks and tools in the open ground.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,d=clamp(S.density),m=Math.min(W,H);
  const n=Math.round(lerp(3,6,d))+rng.int(0,1),sites=[];
  for(let t=0;sites.length<n&&t<600;t++){const r=m*rng.range(0.075,0.115)*(sites.length?1:1.3);const x=rng.range(r+m*0.05,W-r-m*0.05),y=rng.range(r+m*0.05,H-r-m*0.05);
    if(sites.every(s=>Math.hypot(x-s.x,y-s.y)>(r+s.r)*1.75+m*0.03))sites.push({x,y,r});}
  // minimum spanning tree over the sites
  const E=[],inT=[0];while(inT.length<sites.length){let best=null;for(const i of inT)for(let j=0;j<sites.length;j++){if(inT.includes(j))continue;const dd=Math.hypot(sites[i].x-sites[j].x,sites[i].y-sites[j].y);if(!best||dd<best[2])best=[i,j,dd];}E.push(best);inT.push(best[1]);}
  const lines=[];const bandOf=(a,b,ra,rb,wid)=>{
    const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,bow=rng.range(-0.12,0.12)*l;
    const p0=[a[0]+ux*ra,a[1]+uy*ra],p1=[b[0]-ux*rb,b[1]-uy*rb],mid=[(p0[0]+p1[0])/2-uy*bow,(p0[1]+p1[1])/2+ux*bow];
    const c=G.quad(p0,mid,p1,28),k=Math.max(3,Math.round(wid/(m*0.016)));
    for(let q=0;q<k;q++)lines.push({kind:'line',role:q===0||q===k-1?'outer':'inner',pts:G.offset(c,(q-(k-1)/2)*wid/(k-1),false),closed:false});
    return c;};
  const paths=[];
  const tr=S.tracks==null?1:S.tracks;
  for(const [i,j] of E){if(rng.next()>=tr)continue;const a=sites[i],b=sites[j];paths.push(bandOf([a.x,a.y],[b.x,b.y],a.r*1.04,b.r*1.04,Math.min(a.r,b.r)*rng.range(0.7,1.05)));}
  // lines that leave the canvas from the sites nearest an edge
  const used=new Set();
  for(let q=0;q<Math.min(sites.length,2+Math.round(d*2))&&tr>0.02;q++){
    let best=null;sites.forEach((s,i)=>{if(used.has(i))return;for(const [ex,ey] of [[-40,s.y+rng.range(-80,80)],[W+40,s.y+rng.range(-80,80)],[s.x+rng.range(-80,80),-40],[s.x+rng.range(-80,80),H+40]]){const dd=Math.hypot(ex-s.x,ey-s.y);
      // do not run an exit line across another site
      const blocked=sites.some((o,k)=>{if(k===i)return false;const t=clamp(((o.x-s.x)*(ex-s.x)+(o.y-s.y)*(ey-s.y))/(dd*dd));return Math.hypot(s.x+(ex-s.x)*t-o.x,s.y+(ey-s.y)*t-o.y)<o.r*1.5;});
      if(!blocked&&(!best||dd<best.dd))best={i,ex,ey,dd};}});
    if(!best)break;used.add(best.i);const s=sites[best.i];bandOf([s.x,s.y],[best.ex,best.ey],s.r*1.04,0,s.r*rng.range(0.6,0.9));
  }
  ctx.parts(lines,'ring');
  for(const c of paths)for(const s of G.samples(c,false,m*0.05))ctx.occ.push([s.x,s.y,m*0.05]);
  const hk=ctx.pick('hero');
  sites.forEach((s,i)=>{const key=i===0?hk:(rng.chance(.7)?hk:ctx.pick('hero'));ctx.motif(key,s.x,s.y,s.r*2,{role:'hero',variant:'site'+(key===hk?'':key)});});
  // with no tracks drawn, the open ground carries large things of its own (plants, animals)
  if(tr<0.5){const k=Math.round(lerp(3,5,d));for(let q=0,t=0;q<k&&t<300;t++){const s=m*rng.range(0.2,0.3),x=rng.range(s*0.5,W-s*0.5),y=rng.range(s*0.5,H-s*0.5);if(!ctx.free(x,y,s*0.42,4))continue;
    const key=ctx.pick('ring');ctx.motif(key,x,y,s,{role:'ring',rot:SG.motifs[key]&&SG.motifs[key].figure?0:rng.range(-70,70),flip:rng.chance(.5),variant:'big'+(q%2)});q++;}}
  // people and their things around some of the sites
  const rk=ctx.pick('ring');
  sites.forEach((s,i)=>{if(tr<0.5||(i&&!rng.chance(0.45+d*0.3)))return;const k=rng.int(2,4),a0=rng.range(0,360),sz=s.r*0.62;
    for(let q=0;q<k;q++){const a=a0+q*360/k+rng.range(-14,14),x=s.x+Math.sin(a*DEG)*(s.r+sz*0.75),y=s.y-Math.cos(a*DEG)*(s.r+sz*0.75);
      if(x<sz||y<sz||x>W-sz||y>H-sz||!ctx.free(x,y,sz*0.4,2))continue;ctx.motif(rk,x,y,sz,{role:'ring',rot:a+180,variant:'sit'});}});
  scatter(ctx,{inside:(x,y,r)=>x-r>10&&x+r<W-10&&y-r>10&&y+r<H-10,box:{x0:0,y0:0,x1:W,y1:H},count:Math.round(4+d*9),smin:m*0.085,smax:m*0.15});
}});

/* Winding tracks: long sinuous bands crossing the canvas — a snake, a creek, a line of
   travel — each a dark band with a dotted spine and dotted edges, one ending in a site. */
defStructure('sinuous',{name:'Winding tracks',blurb:'Long undulating bands crossing the whole canvas, edged and centred with rows of dots; one ends in a site, with short bar sets in the ground between.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,d=clamp(S.density);
  const n=rng.pick([2,3,3]),P=[],horiz=rng.chance(.7),Lg=horiz?W:H,Ws=horiz?H:W;
  const at=(u,v)=>horiz?[u,v]:[v,u];const headBand=rng.int(0,n-1);let site=null;
  for(let b=0;b<n;b++){
    const v0=Ws*(b+0.5)/n+rng.range(-0.05,0.05)*Ws,amp=Ws*rng.range(0.035,0.075),waves=rng.range(1.2,2.2),ph=rng.range(0,6.28),tilt=rng.range(-0.06,0.06)*Ws;
    const u0=b===headBand?Lg*rng.range(0.13,0.2):-30,pts=[];
    for(let i=0;i<=64;i++){const t=i/64,u=u0+(Lg+30-u0)*t;pts.push(at(u,v0+tilt*(t-0.5)+amp*Math.sin(t*waves*6.283+ph)));}
    const hw=Ws*rng.range(0.02,0.029);
    P.push({kind:'region',closed:true,role:'outer',pts:G.band(pts,hw*2),tone:0,solid:true});
    P.push({kind:'line',role:'inner',pts,closed:false,noSeed:true,onSolid:true,gi:2});
    for(const sd of [-1,1])P.push({kind:'line',role:'inner',pts:G.offset(pts,sd*(hw+Math.max(4,hw*0.42)),false),closed:false,gi:0});
    for(const s of G.samples(pts,false,Ws*0.06))ctx.occ.push([s.x,s.y,hw*2.2]);
    if(b===headBand)site={p:pts[0],r:Ws*rng.range(0.085,0.11),ang:Math.atan2(pts[1][1]-pts[0][1],pts[1][0]-pts[0][0])/DEG};
  }
  ctx.items.push({type:'parts',parts:P,role:'ring',variant:'band'});
  if(site){const cx=site.p[0]-Math.cos(site.ang*DEG)*site.r*0.2,cy=site.p[1]-Math.sin(site.ang*DEG)*site.r*0.2;
    ctx.motif(ctx.pick('hero'),cx,cy,site.r*2,{role:'hero',variant:'hero'});
    // arcs behind the site, like a windbreak
    const A=[];for(let q=1;q<=2;q++)A.push({kind:'line',role:'inner',closed:false,pts:G.arc(cx,cy,site.r*(1.02+q*0.17),site.ang+180-62,site.ang+180+62,30)});ctx.parts(A,'ring');ctx.occ.push([cx,cy,site.r*1.45]);}
  const rk=ctx.pick('ring'),m=Math.min(W,H),k=Math.round(3+d*5);
  for(let q=0,t=0;q<k&&t<200;t++){const s=m*rng.range(0.07,0.1),x=rng.range(s,W-s),y=rng.range(s,H-s);if(!ctx.free(x,y,s*0.55,6))continue;ctx.motif(rk,x,y,s,{role:'ring',rot:rng.range(-40,40),variant:'bar'});q++;}
  scatter(ctx,{inside:(x,y,r)=>x-r>10&&x+r<W-10&&y-r>10&&y+r<H-10,box:{x0:0,y0:0,x1:W,y1:H},count:Math.round(2+d*8),smin:m*0.05,smax:m*0.09});
}});

// ---------- animals ----------
/* Drawn as a silhouette plus the inner divisions painters give them: a band along the
   back, the haunch, the backbone and gut. In dot painting those divisions take flat
   colour; in Arnhem Land x-ray painting they are the animal's insides, hatched with rarrk.
   Parts carry `mat` so a coloured register keeps the body dark and the bands bright. */
const mA=(p,mat)=>Object.assign(p,{mat});
// half-width along a spine from knots [[t,hw],…], eased between them
DS.prof=K=>t=>{let i=1;while(i<K.length-1&&K[i][0]<t)i++;const [t0,a]=K[i-1],[t1,b]=K[i],u=clamp((t-t0)/((t1-t0)||1)),s=u*u*(3-2*u);return a+(b-a)*s;};
DS.at=(path,f)=>{const L=G.length(path,false),S=G.samples(path,false,Math.max(0.5,L/200)),s=S[Math.min(S.length-1,Math.round(f*(S.length-1)))];return s;};

defMotif('kangaroo',{name:'Kangaroo',term:'marlu (Warlpiri, red kangaroo)',meaning:'The most painted animal of the continent: food, a totem for many groups, and an ancestor in many stories. Shown side-on with the long hind foot, heavy tail and small forearms that identify it.',
figure:true,mirrorOk:true,fn(){const P=[];
  const body=FK.spline([[41.5,-29.6],[37,-33.8],[31,-37.4],[27,-40.6],[27.2,-46],[29.4,-54.4],[26.6,-55.6],[23.6,-48],[22.4,-45.4],[20.6,-51],[17.2,-56.6],[14.8,-54.6],[16,-47],[14.4,-41.6],[9,-34],[2,-27.4],[-7,-21.4],[-17,-14.6],[-25.4,-6],[-31,4],[-34.6,14.4],[-39.4,25],[-45.4,34.6],[-51.4,42.4],[-53.4,46],[-50.4,48],[-43.6,45],[-36,39.8],[-29.8,34],[-26.8,31.6],[-26.4,37.6],[-27.6,43.2],[-23.6,46.8],[-10,47.6],[2,47.8],[9,46.8],[11.8,45.2],[8,42.8],[-3,41.8],[-12,40.2],[-15.6,37],[-10.6,30.6],[-3.6,24.6],[3.4,19],[4.6,11.6],[6.6,4],[10.4,-3.6],[15,-10.4],[18.6,-17],[20.4,-23.4],[24,-27.4],[31,-27.2],[38,-26.8],[41.8,-27.6]],true,6);
  P.push(mA(reg(body,'outer'),'animal'));
  // band along the back and tail, haunch, gut
  P.push(mA(reg(DS.tube(FK.spline([[12.6,-33],[5,-24.6],[-4.6,-18.4],[-14.4,-11.6],[-22.4,-3.6],[-28,6],[-31.6,16],[-36.6,26.6],[-42.6,36],[-48.4,43.4]],false,10),t=>2.7*Math.pow(Math.sin(Math.PI*clamp(t,0.02,0.98)),0.4)),'inner'),'band1'));
  const thigh=FK.spline([[-25.4,3],[-18.6,-5.6],[-8.6,-7.4],[-0.6,0],[2,10],[-1.4,19],[-9,25.6],[-18.4,29.6],[-25.6,24],[-27.6,13]],true,8);P.push(mA(reg(thigh,'inner'),'band2'));
  P.push(mA(reg(FK.spline([[10.4,-13.6],[14.4,-7],[10.6,0.6],[6.4,-2],[6.6,-9.6]],true,8),'inner'),'band3'));
  for(const [x,y] of [[-19,5],[-11,1.4],[-14.6,13],[-6,10],[-11.6,21]])P.push(dt(x,y,1.9,'detail'));
  // ribs, tail rings, foot
  for(const [a,b,c] of [[[6,-21],[10.6,-17],[13.6,-12.4]],[[0.4,-16.4],[5,-12],[8,-6.6]],[[-5.6,-11.4],[-1.4,-7.4],[2.4,-2.4]]])P.push(ln(FK.spline([a,b,c],false,6),'detail'));
  for(const [x,y] of [[-33.6,21.6],[-39,31],[-44.6,38.6]])P.push(ln(G.xform([[-3.6,0],[3.6,0]],{x,y,rot:-34}),'detail'));
  P.push(ln(FK.spline([[-22.6,43.6],[-9,44.6],[6,45]],false,6),'detail'));
  // forearm and paw
  const arm=FK.spline([[15.4,-15],[16.4,-8],[19.6,-2.4],[25.6,1]],false,8);P.push(mA(reg(DS.tube(arm,t=>3.5-1.8*t),'outer'),'animal'));
  for(const a of [-24,0,24])P.push(ln(G.xform([[0,0],[3.6,0.6]],{x:25.8,y:1.2,rot:a+22}),'detail'));
  // head: eye, ear, mouth
  P.push(mA(reg(G.ellipse(32.4,-33.4,2.5,2.1,20),'detail'),'eye'));P.push(dt(32.8,-33.4,1.05,'detail'));P.push(dt(40.6,-29.4,0.85,'detail'));
  P.push(ln(FK.spline([[41.6,-28.2],[37.6,-28.4],[34.4,-27.6]],false,6),'detail'));
  P.push(ln(FK.spline([[27,-43.6],[27.8,-49],[27,-53.4]],false,6),'detail'));P.push(ln(FK.spline([[18.6,-46.4],[18.4,-51],[17,-54.4]],false,6),'detail'));
  return fitParts(P,100);}});

defMotif('goanna',{name:'Goanna',term:'goanna (monitor lizard)',meaning:'The big monitor lizard, hunted for food and a major ancestor in many desert and northern stories. Always shown from above, legs splayed, as it is seen on the ground.',
figure:true,mirrorOk:true,fn(){const P=[];
  const sp=FK.spline([[-12,-47],[-12.5,-40],[-13,-31],[-11,-21],[-6,-8],[1.5,6],[7,18],[9.5,30],[5,41],[-7,46],[-20,43.5],[-28.5,35],[-30.5,25]],false,12);
  const hw=DS.prof([[0,1.5],[0.018,3.5],[0.05,4.9],[0.09,4.3],[0.13,3.1],[0.2,5.7],[0.3,7.4],[0.4,6.1],[0.47,4.5],[0.6,3.1],[0.8,1.8],[1,0.55]]);
  // legs first, so the body overlaps their roots
  const leg=(f,sd,front)=>{const s=DS.at(sp,f),F=[-s.tx,-s.ty],N=[-s.ty*sd,s.tx*sd],b=[s.x+N[0]*hw(f)*0.6,s.y+N[1]*hw(f)*0.6];
    const k=front?[b[0]+N[0]*10.5-F[0]*1.5,b[1]+N[1]*10.5-F[1]*1.5]:[b[0]+N[0]*10.5+F[0]*3.5,b[1]+N[1]*10.5+F[1]*3.5];
    const e=front?[k[0]+N[0]*3.5+F[0]*9,k[1]+N[1]*3.5+F[1]*9]:[k[0]+N[0]*5-F[0]*8.5,k[1]+N[1]*5-F[1]*8.5];
    P.push(mA(reg(DS.tube(FK.spline([b,k,e],false,8),t=>3-1*t),'outer'),'animal'));
    const dir=Math.atan2(front?F[1]+N[1]*0.55:N[1]-F[1]*0.25,front?F[0]+N[0]*0.55:N[0]-F[0]*0.25)/DEG;
    for(let i=0;i<5;i++){const a=(dir+(i-2)*24)*DEG,l=5.6+1.6*Math.sin(i/4*Math.PI);P.push(mA(reg(DS.tube([[e[0]+Math.cos(a)*1.2,e[1]+Math.sin(a)*1.2],[e[0]+Math.cos(a)*l,e[1]+Math.sin(a)*l]],t=>1.05-0.5*t),'outer'),'animal'));}};
  for(const sd of [-1,1]){leg(0.205,sd,true);leg(0.435,sd,false);}
  const body=DS.tube(sp,hw);P.push(mA(reg(body,'outer'),'animal'));
  // an inner contour (dotted, where the tradition dots) and bands across the back and tail
  const L=G.length(sp,false);
  const inner=G.sub(sp,false,0.08,0.86);P.push(ln(G.offset(inner,1,false).map((q,i,a)=>{const f=0.08+0.78*i/(a.length-1),s=DS.at(sp,f),h=Math.max(0,hw(f)-2.1);return[s.x-s.ty*h,s.y+s.tx*h];}),'inner'));
  P.push(ln(inner.map((q,i,a)=>{const f=0.08+0.78*i/(a.length-1),s=DS.at(sp,f),h=Math.max(0,hw(f)-2.1);return[s.x+s.ty*h,s.y-s.tx*h];}),'inner'));
  for(let i=0;i<13;i++){const f=0.17+i*0.052,s=DS.at(sp,f),h=hw(f)*0.62;if(h<1.1)continue;P.push(ln([[s.x-s.ty*h,s.y+s.tx*h],[s.x+s.ty*h,s.y-s.tx*h]],'detail'));}
  const hd=DS.at(sp,0.05);for(const sd of [-1,1])P.push(dt(hd.x-hd.ty*sd*2.6,hd.y+hd.tx*sd*2.6,1,'detail'));
  return fitParts(P,100);}});

defMotif('seaTurtle',{name:'Sea turtle',term:'turtle',meaning:'The green turtle of the northern coasts: hunted, sung and painted by saltwater peoples, and the honu of the wider Pacific. Seen from above — shell plates, long front flippers, short hind ones.',
figure:true,mirrorOk:true,fn(){const P=[];const R=pts=>G.xform(pts,{rot:-24});const M=(pts)=>pts.map(([x,y])=>[-x,y]);
  const flF=FK.spline([[-13,-21],[-24,-30],[-36,-31.5],[-45.5,-25],[-49.5,-13],[-48,-1],[-44.5,3.5],[-41.5,-6.5],[-35,-13],[-25.5,-13.5],[-17,-9.5]],true,8),flR=FK.spline([[-10,20.5],[-18,26],[-25,34.5],[-26.5,42.5],[-21.5,45],[-13.5,38.5],[-6.5,27.5]],true,8);
  for(const f of [flF,M(flF),flR,M(flR)])P.push(mA(reg(R(f),'outer'),'animal'));
  for(const sx of [-1,1]){P.push(ln(R(FK.spline([[sx*17,-16.5],[sx*29,-22.5],[sx*40,-20],[sx*46,-9]],false,6)),'detail'));
    for(const [a,b] of [[[26,-27],[27.5,-16]],[[33,-29],[34.5,-15.5]],[[40,-26.5],[41,-11]],[[45.5,-19],[45.5,-6]]])P.push(ln(R([[sx*a[0],a[1]],[sx*b[0],b[1]]]),'detail'));
    P.push(ln(R(FK.spline([[sx*11,24],[sx*17,31],[sx*21.5,40.5]],false,6)),'detail'));for(const [a,b] of [[[15,26.5],[11,32]],[[20,32.5],[14.5,38]]])P.push(ln(R([[sx*a[0],a[1]],[sx*b[0],b[1]]]),'detail'));}
  P.push(mA(reg(R([[-3,27],[3,27],[0,36.5]]),'outer'),'animal'));
  P.push(mA(reg(R(FK.spline([[-5.2,-24],[-5.8,-33],[-4.8,-40],[0,-44.5],[4.8,-40],[5.8,-33],[5.2,-24]],true,8)),'outer'),'animal'));
  for(const sx of [-1,1])P.push(dt(...R([[sx*3.4,-38.5]])[0],0.95,'detail'));
  const shell=FK.spline([[0,-27.5],[12,-24.5],[20.5,-13],[22.5,0],[18.5,14],[10.5,24.5],[0,29.5],[-10.5,24.5],[-18.5,14],[-22.5,0],[-20.5,-13],[-12,-24.5]],true,10);
  P.push(mA(reg(R(shell),'outer'),'band1'));
  const c=[0,1],inner=G.scaleAbout(shell,c,0.8);P.push(ln(R(inner),'inner',true));
  // rim plates
  const So=G.samples(shell,true,G.length(shell,true)/22),Si=G.samples(inner,true,G.length(inner,true)/22);
  for(let i=0;i<Math.min(So.length,Si.length);i++)P.push(ln(R([[Si[i].x,Si[i].y],[So[i].x,So[i].y]]),'detail'));
  // five plates down the middle, four each side
  const ys=[-21.5,-12.5,-3,6.5,15.5,23],wd=[4.2,6.2,6.8,6.2,4.6,2.4];
  for(let i=0;i<5;i++){const y0=ys[i],y1=ys[i+1],w0=wd[i],w1=wd[i+1],ym=(y0+y1)/2,wm=Math.max(w0,w1)+1.5;
    P.push(mA(reg(R([[-w0,y0],[w0,y0],[wm,ym],[w1,y1],[-w1,y1],[-wm,ym]]),'inner'),'band2'));
    if(i<4)for(const sx of [-1,1]){const yy=y1,xx=sx*w1;const edge=inner.reduce((b,q)=>{const a=Math.abs(Math.atan2(q[1]-yy,(q[0]-xx)*sx)/DEG-(i<2?-14:i===2?6:22));return a<b[0]?[a,q]:b;},[1e9,null])[1];P.push(ln(R([[xx,yy],edge]),'detail'));}}
  return fitParts(P,100);}});

defMotif('emu',{name:'Emu',term:'emu',meaning:'The tall flightless bird of the inland: its tracks, its eggs and the dark shape of the emu in the Milky Way mark the season for collecting eggs. Shown side-on, with the shaggy body, long neck and three-toed feet.',
figure:true,mirrorOk:true,fn(){const P=[];
  const legs=[[[-5,13],[-2.5,29],[-5,45]],[[4.5,12],[10.5,27.5],[6,44.5]]];
  for(const lg of legs){P.push(mA(reg(DS.tube(FK.spline(lg,false,8),t=>2.4-1*t),'outer'),'animal'));const e=lg[2];for(const a of [-28,8,40])P.push(mA(reg(DS.tube([[e[0],e[1]],[e[0]+Math.cos(a*DEG)*9,e[1]+Math.sin(a*DEG)*4.6+1.6]],t=>1.2-0.5*t),'outer'),'animal'));
    P.push(ln([[lg[1][0]-2.4,lg[1][1]-1],[lg[1][0]+2.4,lg[1][1]+1]],'detail'));}
  const neck=FK.spline([[10.5,-4],[15.5,-18],[16.5,-31],[20.5,-41.5]],false,10);P.push(mA(reg(DS.tube(neck,t=>4.6-2.3*t),'outer'),'animal'));
  for(const f of [0.3,0.45,0.6,0.75])P.push(ln((()=>{const s=DS.at(neck,f),h=(4.6-2.3*f)*0.7;return[[s.x-s.ty*h,s.y+s.tx*h],[s.x+s.ty*h,s.y-s.tx*h]];})(),'detail'));
  P.push(mA(reg(FK.spline([[17.5,-41],[20,-46.4],[25.5,-46.6],[28.5,-44.2],[34.5,-42.6],[28.5,-41.2],[25,-39.4],[20,-38.8]],true,6),'outer'),'animal'));
  P.push(mA(reg(G.circle(24,-43.4,1.7,16),'detail'),'eye'));P.push(dt(24.2,-43.4,0.75,'detail'));P.push(ln([[28.6,-42.8],[33.6,-42.6]],'detail'));
  const body=FK.spline([[14,-9],[5,-15.5],[-9,-17.5],[-23,-13.6],[-33,-5.6],[-39,3.6],[-41.6,13],[-39.6,21.6],[-36,15.6],[-33.6,23.4],[-29.6,16.6],[-26,23],[-22.4,17.2],[-9,17.6],[5,13.6],[13.5,4]],true,10);P.push(mA(reg(body,'outer'),'band1'));
  // drooping plumage
  const inB=l=>{const q=l.filter(p=>G.inside(p[0],p[1],body));return q.length>3?q:null;};
  for(let i=0;i<9;i++){const x0=9.5-i*5,y0=-8.5-Math.sin(i/8*Math.PI)*5.5;const l=inB(FK.spline([[x0,y0],[x0-5.5,y0+9],[x0-12.5,y0+17.5+i*0.7]],false,6));if(l)P.push(ln(l,i%3===0?'inner':'detail'));}
  for(let i=0;i<5;i++){const x0=4-i*6.5;const l=inB(FK.spline([[x0,4],[x0-4,9.5],[x0-9,13.5]],false,5));if(l)P.push(ln(l,'detail'));}
  
  return fitParts(P,100);}});

defMotif('barramundi',{name:'Barramundi',term:'namarnkol (Kunwinjku)',meaning:'The great fish of the northern rivers and the best-known subject of x-ray painting: backbone, gut and swim bladder are drawn inside the body because a painter shows what he knows is there, not only what he sees.',
figure:true,mirrorOk:true,fn(){const P=[];
  const top=FK.spline([[44,-2.5],[38,-7.5],[30.5,-9.5],[22,-14.5],[12,-19.5],[0,-21],[-12,-18.2],[-24,-12.2],[-33,-6.2],[-37.5,-5]],false,10),bot=FK.spline([[44,1],[40,4.2],[32,8.4],[20,13.2],[6,17],[-8,17],[-22,12.2],[-33,6.2],[-37.5,5]],false,10);
  const yAt=(c,x)=>{for(let i=1;i<c.length;i++){const a=c[i-1],b=c[i];if((a[0]-x)*(b[0]-x)<=0&&a[0]!==b[0])return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}return c[c.length-1][1];};
  // fins behind the body
  const spines=[];for(let i=0;i<6;i++){const x=9-i*3.4;spines.push([x+1.2,yAt(top,x+1.2)+1],[x-0.4,yAt(top,x)-(11.5-Math.abs(i-1.6)*1.9)]);}spines.push([-11,yAt(top,-11)+1]);P.push(mA(reg(spines,'outer'),'fin'));
  P.push(mA(reg(FK.spline([[-11.5,-17],[-15,-24.5],[-21,-25.5],[-26.5,-19.5],[-27,-9.5]],false,8).concat([[-20,-12]]),'outer'),'fin'));
  P.push(mA(reg(FK.spline([[-12,15.5],[-15.5,22.5],[-21.5,24],[-26.5,18],[-27,8.5]],false,8).concat([[-20,11]]),'outer'),'fin'));
  P.push(mA(reg(FK.spline([[8.5,15.5],[6.5,22.5],[1.5,26.5],[-1.5,22.5],[1.5,16]],false,8),'outer'),'fin'));
  const tail=FK.spline([[-36,-5.4],[-41.5,-13.5],[-48.2,-13],[-50.5,0],[-48.2,13],[-41.5,13.5],[-36,5.4]],false,10);P.push(mA(reg(tail,'outer'),'fin'));
  for(const a of [-52,-26,0,26,52])P.push(ln([[-38.5+Math.abs(a)*0.03,Math.sin(a*DEG)*4.6],[-49+Math.abs(a)*0.045,Math.sin(a*DEG)*13.5]],'detail'));
  const body=top.concat(bot.slice().reverse());P.push(mA(reg(body,'outer'),'animal'));
  // body panels between the cross lines, so the hatching can turn from one to the next
  const xs=[26,14,2,-10,-22,-36.5];
  for(let i=0;i<xs.length-1;i++){const x0=xs[i],x1=xs[i+1],pt=[],pb=[];for(let k=0;k<=8;k++){const x=x0+(x1-x0)*k/8;pt.push([x,yAt(top,x)+1.5]);pb.push([x,yAt(bot,x)-1.5]);}P.push(mA(reg(pt.concat(pb.reverse()),'inner',{tone:i%2}),i%2?'band1':'band2'));}
  // backbone, ribs, gut, gill, eye
  const spine=FK.spline([[25,-3],[10,-3.6],[-10,-2.6],[-36,0]],false,12);P.push(ln(spine,'inner'));
  for(let i=1;i<26;i++){const s=DS.at(spine,i/26),up=1.5+2.2*Math.sin(i/26*Math.PI),dn=i<15?4.8+2.2*Math.sin(i/15*Math.PI):1.6;P.push(ln([[s.x+1.1,s.y-up],[s.x,s.y],[s.x-1.6,s.y+dn]],'detail'));}
  P.push(mA(reg(FK.spline([[21,6.5],[12,3.8],[0,4.2],[-9.5,7],[-1,11],[12,10.8]],true,8),'inner'),'organ'));
  P.push(ln(FK.spline([[27.5,-9.6],[24.6,-2],[27.8,8.6]],false,8),'inner'));P.push(ln(FK.spline([[30.5,-8.6],[28.4,-1.5],[31,6.6]],false,8),'detail'));
  P.push(mA(reg(G.circle(35.6,-3.4,2.6,20),'detail'),'eye'));P.push(dt(35.8,-3.4,1.15,'detail'));P.push(ln(FK.spline([[44.2,-0.6],[40,0.6],[37.4,2.6]],false,6),'detail'));
  P.push(mA(reg(FK.spline([[21.5,1.5],[16.5,-1],[12.5,2.6],[16.5,6.4]],true,6),'inner'),'fin'));
  return fitParts(P,100);}});
