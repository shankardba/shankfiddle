'use strict';
/* Style Genome — shared helpers: seeded RNG, polyline geometry, colour (OKLab), SVG strings.
   Geometry is plain polylines ([[x,y],...]) rather than SVG path strings so every
   treatment (wobble, broken lines, echo lines, dot rows, ribbons) can work on real points. */

// ---------- RNG ----------
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function makeRng(seed){
  const r=mulberry32(typeof seed==='string'?hashStr(seed):seed>>>0);
  const R={
    next:r,
    range:(a,b)=>a+(b-a)*r(),
    int:(a,b)=>Math.floor(a+(b-a+1)*r()),
    pick:arr=>arr[Math.floor(r()*arr.length)],
    chance:p=>r()<p,
    weighted(obj){ // {key:weight}
      const ks=Object.keys(obj).filter(k=>obj[k]>0);let tot=0;ks.forEach(k=>tot+=obj[k]);
      if(!ks.length)return null;let x=r()*tot;for(const k of ks){x-=obj[k];if(x<=0)return k;}return ks[ks.length-1];
    },
    shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;},
    fork(tag){return makeRng((Math.floor(r()*4294967296)^hashStr(String(tag)))>>>0);}
  };
  return R;
}
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const DEG=Math.PI/180;

// ---------- geometry ----------
const G={
  circle(cx,cy,r,n=48){const p=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2;p.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return p;},
  ellipse(cx,cy,rx,ry,n=48,rot=0){const p=[],c=Math.cos(rot*DEG),s=Math.sin(rot*DEG);for(let i=0;i<n;i++){const a=i/n*Math.PI*2,x=rx*Math.cos(a),y=ry*Math.sin(a);p.push([cx+x*c-y*s,cy+x*s+y*c]);}return p;},
  arc(cx,cy,r,a0,a1,n=24){const p=[];for(let i=0;i<=n;i++){const a=(a0+(a1-a0)*i/n)*DEG;p.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return p;},
  bez(p0,p1,p2,p3,n=16){const p=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;p.push([u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]]);}return p;},
  quad(p0,p1,p2,n=14){const p=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;p.push([u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0],u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1]]);}return p;},
  // join point lists, dropping duplicated joints
  chain(...segs){const out=[];for(const s of segs){for(let i=0;i<s.length;i++){const q=s[i];const l=out[out.length-1];if(l&&Math.abs(l[0]-q[0])<1e-6&&Math.abs(l[1]-q[1])<1e-6)continue;out.push(q);}}return out;},
  // bezier chain: start point then [c1,c2,end] triples
  path(start,...triples){let cur=start;const segs=[];for(const [c1,c2,e] of triples){segs.push(G.bez(cur,c1,c2,e,14));cur=e;}return G.chain(...segs);},
  // petal from base (0,0) to tip (0,-len); shape: 'pointed' | 'round' | 'drop' | 'step'
  petal(len,w,shape='pointed'){
    let L,R;
    if(shape==='round'){L=G.bez([0,0],[-w*1.15,-len*0.2],[-w*1.0,-len*1.02],[0,-len],16);}
    else if(shape==='drop'){L=G.bez([0,0],[-w*1.35,-len*0.35],[-w*0.35,-len*0.8],[0,-len],16);}
    else if(shape==='step'){L=[[0,0],[-w,0],[-w,-len*0.34],[-w*0.64,-len*0.34],[-w*0.64,-len*0.67],[-w*0.3,-len*0.67],[-w*0.3,-len],[0,-len]];} // stepped merlon / feather
    else{L=G.bez([0,0],[-w*0.95,-len*0.28],[-w*0.62,-len*0.78],[0,-len],16);}
    R=L.slice(0,-1).reverse().map(([x,y])=>[-x,y]);
    return L.concat(R);
  },
  // teardrop: round bottom centre (0,0) radius r, tip at (0,-len)
  teardrop(r,len,n=16){
    const L=G.bez([0,-len],[-r*0.3,-len*0.62],[-r,-r*0.95],[-r,0],n);
    const B=G.arc(0,0,r,180,0,16);
    const R=L.slice().reverse().map(([x,y])=>[-x,y]);
    return G.chain(L,B,R).slice(0,-1);
  },
  xform(pts,{x=0,y=0,s=1,rot=0,flip=false,sy}={}){
    const c=Math.cos(rot*DEG),sn=Math.sin(rot*DEG),ky=sy==null?s:sy;
    return pts.map(([px,py])=>{if(flip)px=-px;px*=s;py*=ky;return[x+px*c-py*sn,y+px*sn+py*c];});
  },
  mirrorX(pts,ax=0){return pts.map(([x,y])=>[2*ax-x,y]);},
  bbox(pts){let a=1e9,b=1e9,c=-1e9,d=-1e9;for(const[x,y]of pts){if(x<a)a=x;if(y<b)b=y;if(x>c)c=x;if(y>d)d=y;}return{x0:a,y0:b,x1:c,y1:d,w:c-a,h:d-b,cx:(a+c)/2,cy:(b+d)/2};},
  area(pts){let s=0;for(let i=0;i<pts.length;i++){const[a,b]=pts[i],[c,d]=pts[(i+1)%pts.length];s+=a*d-c*b;}return s/2;},
  centroid(pts){const A=G.area(pts);if(Math.abs(A)<1e-6){const b=G.bbox(pts);return[b.cx,b.cy];}let cx=0,cy=0;for(let i=0;i<pts.length;i++){const[a,b]=pts[i],[c,d]=pts[(i+1)%pts.length],f=a*d-c*b;cx+=(a+c)*f;cy+=(b+d)*f;}return[cx/(6*A),cy/(6*A)];},
  length(pts,closed){let L=0;const n=pts.length;for(let i=0;i<(closed?n:n-1);i++){const a=pts[i],b=pts[(i+1)%n];L+=Math.hypot(b[0]-a[0],b[1]-a[1]);}return L;},
  // point+tangent at arc-length positions
  samples(pts,closed,spacing,offset=0){
    const n=pts.length,segs=[];let L=0;
    for(let i=0;i<(closed?n:n-1);i++){const a=pts[i],b=pts[(i+1)%n],l=Math.hypot(b[0]-a[0],b[1]-a[1]);segs.push([a,b,l,L]);L+=l;}
    const out=[];if(L<1e-6)return out;
    const count=Math.max(1,Math.round(L/spacing));const step=L/count;
    let si=0;
    for(let k=0;k<(closed?count:count+1);k++){
      const d=Math.min(L-1e-6,offset*step+k*step);
      while(si<segs.length-1&&segs[si][3]+segs[si][2]<d)si++;
      const[a,b,l,s0]=segs[si];const t=l?(d-s0)/l:0;
      out.push({x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t,tx:l?(b[0]-a[0])/l:1,ty:l?(b[1]-a[1])/l:0,d});
    }
    return out;
  },
  resample(pts,closed,spacing){return G.samples(pts,closed,spacing).map(s=>[s.x,s.y]);},
  scaleAbout(pts,c,k){return pts.map(([x,y])=>[c[0]+(x-c[0])*k,c[1]+(y-c[1])*k]);},
  // contour offset along averaged normals (+d = outward for counter-clockwise screen polygons is handled by sign check)
  offset(pts,d,closed=true){
    const n=pts.length,out=[];const sgn=closed&&G.area(pts)<0?-1:1;
    for(let i=0;i<n;i++){
      const p=pts[(i-1+n)%n],q=pts[i],r=pts[(i+1)%n];
      let ax=q[0]-p[0],ay=q[1]-p[1],bx=r[0]-q[0],by=r[1]-q[1];
      if(!closed){if(i===0){ax=bx;ay=by;}if(i===n-1){bx=ax;by=ay;}}
      const la=Math.hypot(ax,ay)||1,lb=Math.hypot(bx,by)||1;
      let nx=ay/la+by/lb,ny=-ax/la-bx/lb;const ln=Math.hypot(nx,ny)||1;nx/=ln;ny/=ln;
      // mitre: keep the true offset distance at corners (capped so spikes stay short)
      const m=1/Math.max(0.4,nx*ay/la-ny*ax/la);
      out.push([q[0]+nx*d*sgn*m,q[1]+ny*d*sgn*m]);
    }
    return out;
  },
  inside(x,y,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/((yj-yi)||1e-9)+xi)c=!c;}return c;},
  // closed band of width w around an open polyline (mitred corners) — step-frets, ribs
  band(pts,w){const L=G.offset(pts,w/2,false),R=G.offset(pts,-w/2,false);return L.concat(R.reverse());},
  roundRect(x0,y0,x1,y1,r,seg=5){r=Math.min(r,(x1-x0)/2,(y1-y0)/2);const c=[[x1-r,y0+r,-90],[x1-r,y1-r,0],[x0+r,y1-r,90],[x0+r,y0+r,180]],out=[];
    for(const [cx,cy,a0] of c)for(let i=0;i<=seg;i++){const a=(a0+90*i/seg)*DEG;out.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return out;},
  // smooth closed/open polyline by Chaikin corner cutting
  chaikin(pts,closed,iter=2){
    let p=pts;
    for(let k=0;k<iter;k++){
      const o=[];const n=p.length;
      if(!closed)o.push(p[0]);
      for(let i=0;i<(closed?n:n-1);i++){const a=p[i],b=p[(i+1)%n];o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75]);}
      if(!closed)o.push(p[n-1]);
      p=o;
    }
    return p;
  },
  // hand-drawn wobble: smooth value noise along arc length, displaced along the normal
  wobble(pts,closed,amp,rng,wave=38){
    if(amp<=0.01||pts.length<3)return pts;
    const L=G.length(pts,closed);const knots=Math.max(3,Math.ceil(L/wave)+1);
    const kv=[];for(let i=0;i<knots;i++)kv.push(rng.range(-1,1));
    if(closed)kv[knots-1]=kv[0];
    const n=pts.length;let acc=0;const out=[];
    for(let i=0;i<n;i++){
      if(i>0)acc+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
      const u=(acc/L)*(knots-1),k=Math.floor(u),f=u-k,f2=f*f*(3-2*f);
      const v=lerp(kv[Math.min(k,knots-1)],kv[Math.min(k+1,knots-1)],f2)*amp;
      const p=pts[(i-1+n)%n],r=pts[(i+1)%n];let tx=r[0]-p[0],ty=r[1]-p[1];const l=Math.hypot(tx,ty)||1;
      out.push([pts[i][0]-ty/l*v,pts[i][1]+tx/l*v]);
    }
    return out;
  },
  // portion of a polyline between arc-length fractions (handles wrap for closed)
  sub(pts,closed,f0,f1){
    const n=pts.length,cum=[0];
    const m=closed?n+1:n;const P=closed?pts.concat([pts[0]]):pts;
    for(let i=1;i<m;i++)cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
    const L=cum[m-1];
    const at=d=>{let i=1;while(i<m-1&&cum[i]<d)i++;const t=(d-cum[i-1])/((cum[i]-cum[i-1])||1);return[P[i-1][0]+(P[i][0]-P[i-1][0])*t,P[i-1][1]+(P[i][1]-P[i-1][1])*t];};
    const range=(a,b)=>{const o=[at(a)];for(let i=0;i<m;i++)if(cum[i]>a&&cum[i]<b)o.push(P[i]);o.push(at(b));return o;};
    const a=f0*L,b=f1*L;
    if(b<=L)return range(a,b);
    return range(a,L).concat(range(0,b-L).slice(1));
  },
  // variable-width stroke as a filled polygon (widths: fn(t)->halfwidth)
  ribbon(pts,hw){
    const n=pts.length;if(n<2)return pts;const L=[],R=[];let acc=0;const tot=G.length(pts,false)||1;
    for(let i=0;i<n;i++){
      if(i>0)acc+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
      const p=pts[Math.max(0,i-1)],r=pts[Math.min(n-1,i+1)];let tx=r[0]-p[0],ty=r[1]-p[1];const l=Math.hypot(tx,ty)||1;tx/=l;ty/=l;
      const w=hw(acc/tot);L.push([pts[i][0]-ty*w,pts[i][1]+tx*w]);R.push([pts[i][0]+ty*w,pts[i][1]-tx*w]);
    }
    return L.concat(R.reverse());
  }
};
function dPath(pts,closed){
  if(!pts.length)return'';let s='M'+pts[0][0].toFixed(1)+' '+pts[0][1].toFixed(1);
  for(let i=1;i<pts.length;i++)s+='L'+pts[i][0].toFixed(1)+' '+pts[i][1].toFixed(1);
  return closed?s+'Z':s;
}

// ---------- colour ----------
const C={
  hexToRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255];},
  rgbToHex(r,g,b){return'#'+[r,g,b].map(v=>Math.round(clamp(v,0,255)).toString(16).padStart(2,'0')).join('');},
  toLin(c){c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);},
  fromLin(c){return 255*(c<=0.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-0.055);},
  rgbToLab(r,g,b){
    r=C.toLin(r);g=C.toLin(g);b=C.toLin(b);
    const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b),m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b),s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
    return[0.2104542553*l+0.7936177850*m-0.0040720468*s,1.9779984951*l-2.4285922050*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.8086757660*s];
  },
  labToRgb(L,a,b){
    const l=Math.pow(L+0.3963377774*a+0.2158037573*b,3),m=Math.pow(L-0.1055613458*a-0.0638541728*b,3),s=Math.pow(L-0.0894841775*a-1.2914855480*b,3);
    return[C.fromLin(4.0767416621*l-3.3077115913*m+0.2309699292*s),C.fromLin(-1.2684380046*l+2.6097574011*m-0.3413193965*s),C.fromLin(-0.0041960863*l-0.7034186147*m+1.7076147010*s)];
  },
  lab(hex){return C.rgbToLab(...C.hexToRgb(hex));},
  hex(lab){return C.rgbToHex(...C.labToRgb(...lab));},
  mix(h1,h2,t){if(t<=0)return h1;if(t>=1)return h2;const a=C.lab(h1),b=C.lab(h2);return C.hex([lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)]);},
  L(hex){return C.lab(hex)[0];},
  chroma(hex){const l=C.lab(hex);return Math.hypot(l[1],l[2]);},
  dist(h1,h2){const a=C.lab(h1),b=C.lab(h2);return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);},
  shade(hex,dL){const l=C.lab(hex);l[0]=clamp(l[0]+dL,0,1);return C.hex(l);}
};

// ---------- misc ----------
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let __svgUid=0;const svgUid=()=>'sg'+(++__svgUid).toString(36);
