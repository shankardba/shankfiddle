'use strict';
/* Structures (composition grammars). Each fills ctx.items with
     {type:'motif', key, x, y, size, rot, flip, sy, role, variant}
     {type:'parts', parts:[...comp-space parts], role}
   on a W×H canvas. Roles: hero | ring | filler | border | frame.
   `variant` makes identical copies share geometry + colour choices so rings stay symmetric. */

function structCtx(g,rng,W,H){
  const ctx={W,H,rng,g,items:[],occ:[]};
  ctx.pick=role=>poolPick(g.motifs[role],rng)||'floret';
  ctx.motif=(key,x,y,size,o={})=>{const it=Object.assign({type:'motif',key,x,y,size,rot:0,flip:false,role:'ring',variant:key+'|'+(o.role||'ring')},o);ctx.items.push(it);if(!o.noOcc)ctx.occ.push([x,y,size*0.47*(o.sy||1)]);return it;};
  ctx.parts=(parts,role='frame')=>ctx.items.push({type:'parts',parts,role});
  ctx.free=(x,y,r,gap=4)=>ctx.occ.every(([ox,oy,or])=>Math.hypot(x-ox,y-oy)>r+or+gap);
  return ctx;
}

// scatter filler motifs into empty space; mirror for bilateral symmetry
function scatter(ctx,{inside,box,count,smin,smax,mirror=null,role='filler'}){
  const {rng}=ctx;const sizes=[];
  // structure.bare leaves the ground empty; structure.fillerGrow trades many small fillers for a few large ones
  {const S=ctx.g.structure,k=Math.max(0,S.fillerGrow||0);if(k>0.02||(S.bare||0)>0.02){count=Math.round(count*(1-clamp(S.bare||0))/Math.pow(1+k,1.7));smin*=1+k;smax*=1+k;}}
  for(let i=0;i<count;i++)sizes.push(rng.range(smin,smax));sizes.sort((a,b)=>b-a);
  const variants={};
  for(const s of sizes){
    for(let tries=0;tries<14;tries++){
      const x=rng.range(box.x0+s/2,(mirror!=null?mirror:box.x1)-s/2),y=rng.range(box.y0+s/2,box.y1-s/2);
      const r=s*0.47;
      if(!inside(x,y,r)||!ctx.free(x,y,r))continue;
      if(mirror!=null&&Math.abs(x-mirror)<r+3)continue;
      const key=ctx.pick('filler');const rot=key==='dot'||key==='floret'||(SG.motifs[key]&&SG.motifs[key].upright)?0:rng.range(-40,40);
      const v=variants[key]=(variants[key]||0)+1;const variant=key+'|f'+(v%3);
      ctx.motif(key,x,y,s,{role,rot,variant});
      if(mirror!=null){const mx=2*mirror-x;if(ctx.free(mx,y,r))ctx.motif(key,mx,y,s,{role,rot:-rot,flip:true,variant});}
      break;
    }
  }
}

// rectangular border bands; returns the inner rectangle
function frameBands(ctx,rect,bands,thick=44){
  const {rng}=ctx;let {x0,y0,x1,y1}=rect;
  for(let b=0;b<bands;b++){
    const t=thick*(b===0?1:0.8);const key=poolPick(ctx.g.motifs.border,rng)||'lines';
    const strip=SG.borders[key].fn;
    const sides=[
      {L:x1-x0-2*t,map:([x,y])=>[x0+t+x,y0+y]},
      {L:y1-y0-2*t,map:([x,y])=>[x1-y,y0+t+x]},
      {L:x1-x0-2*t,map:([x,y])=>[x1-t-x,y1-y]},
      {L:y1-y0-2*t,map:([x,y])=>[x0+y,y1-t-x]}
    ];
    const P=[];
    for(const sd of sides){
      for(const p of strip(sd.L,t)){
        if(p.kind==='dot'){const [x,y]=sd.map([p.x,p.y]);P.push(Object.assign({},p,{x,y}));}
        else P.push(Object.assign({},p,{pts:p.pts.map(sd.map)}));
      }
    }
    const rectPts=(a,b,c,d)=>[[a,b],[c,b],[c,d],[a,d]];
    P.push({kind:'line',pts:rectPts(x0,y0,x1,y1),closed:true,role:'outer'});
    P.push({kind:'line',pts:rectPts(x0+t,y0+t,x1-t,y1-t),closed:true,role:'outer'});
    for(const [a,b2,c,d] of [[x0,y0,x0+t,y0+t],[x1-t,y0,x1,y0+t],[x1-t,y1-t,x1,y1],[x0,y1-t,x0+t,y1]])P.push({kind:'line',pts:rectPts(a,b2,c,d),closed:true,role:'outer'});
    ctx.parts(P,'border');
    const cornerKey=ctx.pick('filler');
    for(const [cx,cy] of [[x0+t/2,y0+t/2],[x1-t/2,y0+t/2],[x1-t/2,y1-t/2],[x0+t/2,y1-t/2]])ctx.motif(cornerKey==='dot'?'floret':cornerKey,cx,cy,t*0.74,{role:'border',variant:'corner'+b,noOcc:true});
    const gap=b<bands-1?7:0;x0+=t+gap;y0+=t+gap;x1-=t+gap;y1-=t+gap;
  }
  return {x0,y0,x1,y1};
}

defStructure('panel',{name:'Framed panel',blurb:'Bordered rectangle, central subject, every gap closed with fillers.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;
  const inner=frameBands(ctx,{x0:30,y0:30,x1:W-30,y1:H-30},Math.round(S.borderBands||0));
  const iw=inner.x1-inner.x0,ih=inner.y1-inner.y0,cx=(inner.x0+inner.x1)/2,cy=(inner.y0+inner.y1)/2;
  // Kerala-mural corner foliage: big curling leaf scrolls filling the upper corners
  if((S.cornerScrolls||0)>0.02&&rng.next()<S.cornerScrolls){const s=Math.min(iw,ih)*0.34;
    ctx.motif('foliageScroll',inner.x0+s*0.46,inner.y0+s*0.46,s,{role:'ring',rot:-10,variant:'cscroll'});ctx.motif('foliageScroll',inner.x1-s*0.46,inner.y0+s*0.46,s,{role:'ring',rot:10,flip:true,variant:'cscroll'});}
  // a deity stands alone: never mirrored into a pair (pools without figures draw exactly as before)
  const anyFig=poolAll(g.motifs.hero).some(k=>SG.motifs[k]&&SG.motifs[k].figure);const preHero=anyFig?ctx.pick('hero'):null;
  const layout=preHero&&SG.motifs[preHero].figure?'single':rng.pick(['triad','pair','single','triad']);
  if(layout==='pair'){
    const k=preHero||ctx.pick('hero');const s=Math.min(iw,ih)*0.42;
    ctx.motif(k,cx-s*0.56,cy,s,{role:'hero',flip:true,variant:'pair'});
    ctx.motif(k,cx+s*0.56,cy,s,{role:'hero',variant:'pair'});
    ctx.motif(ctx.pick('ring'),cx,cy-s*0.78,s*0.42,{role:'ring',variant:'crown'});
    ctx.motif(ctx.pick('ring'),cx,cy+s*0.78,s*0.42,{role:'ring',variant:'base'});
  }else{
    const hs=Math.min(iw,ih)*(layout==='single'?(preHero&&SG.motifs[preHero].fine?0.82:Math.min(0.9,0.66*(1+(S.heroScale||0)))):0.5);
    ctx.motif(preHero||ctx.pick('hero'),cx,cy,hs,{role:'hero',variant:'hero'});
    if(layout==='triad'){const k=ctx.pick('ring'),s=hs*0.5;
      ctx.motif(k,cx-hs*0.78,cy+hs*0.18,s,{role:'ring',variant:'flank'});
      ctx.motif(k,cx+hs*0.78,cy+hs*0.18,s,{role:'ring',flip:true,variant:'flank'});}
  }
  const d=clamp(S.density);const sym=S.symmetry!=='free';
  scatter(ctx,{inside:(x,y,r)=>x-r>inner.x0&&x+r<inner.x1&&y-r>inner.y0&&y+r<inner.y1,box:inner,
    count:Math.round(18+d*150),smin:Math.min(iw,ih)*0.035,smax:Math.min(iw,ih)*(0.07+0.07*(1-d)),mirror:sym?cx:null});
}});

defStructure('medallion',{name:'Medallion',blurb:'Concentric rings of petals, motifs and beads around a centre — radial symmetry.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;const cx=W/2,cy=H/2;
  let n=Math.round(S.folds||12);n=[6,8,10,12,16].reduce((a,b)=>Math.abs(b-n)<Math.abs(a-n)?b:a,12);
  const Rmax=Math.min(W,H)/2-34;let r=rng.range(88,118);
  ctx.motif(ctx.pick('hero'),cx,cy,r*2,{role:'hero',variant:'hero'});r+=6;
  const kinds=['petals','motifs','dots','petals','motifs','scallop','beads'];
  let last='';
  while(r<Rmax-26){
    let kind=rng.pick(kinds);if(kind===last)kind='motifs';
    if((S.vine||0)>0.02&&rng.next()<S.vine)kind='vine';
    last=kind;
    const room=Rmax-r;
    if(kind==='vine'){
      // Scrolling vine: a wavy spine with leaves branching off it, long outward, short inward,
      // their angles and lengths varied within each fold (so the ring keeps its n-fold
      // symmetry but no two neighbouring leaves are stamped alike) and blossoms in the troughs.
      const band=Math.min(room,rng.range(50,78));if(band<34){r+=10;continue;}
      const rr=r+band/2,per=Math.max(1,Math.round(2*Math.PI*rr/(n*band*1.15))),m=n*per,amp=band*0.15,P=[];
      const at=a=>rr+amp*Math.sin(a*m);
      P.push({kind:'line',closed:true,role:'inner',pts:Array.from({length:m*24},(_,k)=>{const a=k/(m*24)*2*Math.PI;return[cx+Math.cos(a)*at(a),cy+Math.sin(a)*at(a)];})});
      const shp=g.motifs.petal==='round'?'round':'pointed';
      for(let i=0;i<2*m;i++){
        const a=(Math.PI/2+Math.PI*i)/m,q=i%(2*per),jit=Math.sin(q*1.6)*12,lk=0.85+0.3*Math.abs(Math.sin(q*1.3));
        const x=cx+Math.cos(a)*at(a),y=cy+Math.sin(a)*at(a),out=i%2===0;
        if(out||q%4===1)P.push({kind:'region',closed:true,role:'outer',pts:G.xform(G.petal(band*(out?0.42:0.24)*lk,band*0.08,shp),{x,y,rot:a/DEG+(out?90:-90)+(out?28:-28)+jit})});
        else P.push(...floretParts(x,y,band*0.13,5,'round','inner'));
      }
      ctx.items.push({type:'parts',parts:P,role:'ring',variant:'vn'+r.toFixed(0)});r+=band+4;
    }else if(kind==='petals'){
      const len=Math.min(room,rng.range(42,70)),shape=g.motifs.petal||'pointed';const m=n*Math.max(1,Math.round(2*Math.PI*(r+len/2)/(n*len*(shape==='drop'?0.55:0.75))));
      const P=[];const off=rng.chance(.5)?0.5:0;
      for(let i=0;i<m;i++){const a=(i+off)/m*360,mid=r+len/2,w=Math.min(Math.PI*mid/m*0.95,len*(shape==='drop'?0.3:0.42));P.push({kind:'region',closed:true,role:'outer',pts:G.xform(polarPetal(r-len*0.1,len*1.05,w,a,shape),{x:cx,y:cy})});}
      ctx.items.push({type:'parts',parts:P,role:'ring',variant:'pr'+r.toFixed(0)});r+=len+4;
    }else if(kind==='motifs'){
      const s=Math.min(room,rng.range(46,84));if(s<24){r+=10;continue;}
      const m=n*Math.max(1,Math.round(2*Math.PI*(r+s/2)/(n*s*rng.range(1.0,1.25))));
      const key=ctx.pick('ring');const rr=r+s/2;
      for(let i=0;i<m;i++){const a=i/m*360;ctx.motif(key,cx+Math.sin(a*DEG)*rr,cy-Math.cos(a*DEG)*rr,s,{role:'ring',rot:a,variant:'ring'+r.toFixed(0),noOcc:true});}
      r+=s+4;
    }else if(kind==='dots'){
      const rr=r+9,m=Math.round(2*Math.PI*rr/16);const P=[{kind:'line',closed:true,role:'inner',pts:G.circle(cx,cy,r+1,120)}];
      for(let i=0;i<m;i++){const a=i/m*Math.PI*2;P.push({kind:'dot',x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr,r:3.4,role:'outer'});}
      P.push({kind:'line',closed:true,role:'inner',pts:G.circle(cx,cy,r+18,120)});
      ctx.parts(P,'ring');r+=22;
    }else if(kind==='scallop'){
      const m=2*n,depth=Math.min(room,22),P=[];const pts=[];
      for(let i=0;i<m;i++){const a0=i/m*360,a1=(i+1)/m*360;for(let k=0;k<=10;k++){const a=(a0+(a1-a0)*k/10)*DEG,bump=Math.sin(k/10*Math.PI)*depth;pts.push([cx+Math.sin(a)*(r+bump),cy-Math.cos(a)*(r+bump)]);}}
      P.push({kind:'region',closed:true,role:'outer',pts});ctx.items.push({type:'parts',parts:P,role:'ring',variant:'sc'+r.toFixed(0),under:true});r+=depth+5;
    }else{
      const P=[{kind:'line',closed:true,role:'outer',pts:G.circle(cx,cy,r+2,140)},{kind:'line',closed:true,role:'outer',pts:G.circle(cx,cy,r+14,140)}];
      const m=Math.round(2*Math.PI*(r+8)/11);for(let i=0;i<m;i++){const a=i/m*Math.PI*2;P.push({kind:'dot',x:cx+Math.cos(a)*(r+8),y:cy+Math.sin(a)*(r+8),r:2.4,role:'detail'});}
      ctx.parts(P,'ring');r+=18;
    }
  }
  ctx.occ.push([cx,cy,r]);
  // corners: quarter rosettes or fillers
  const radial=[...poolAll(g.motifs.hero),...poolAll(g.motifs.ring)].filter(k=>['lotusTop','sun','star8','floret','burst'].includes(k));
  if(clamp(S.density)>0.55&&radial.length&&rng.chance(.6)){const k=rng.pick(radial);for(const [x,y] of [[0,0],[W,0],[W,H],[0,H]])ctx.motif(k,x,y,250,{role:'ring',variant:'corner',noOcc:false});}
  scatter(ctx,{inside:(x,y,r2)=>x-r2>14&&x+r2<W-14&&y-r2>14&&y+r2<H-14,box:{x0:0,y0:0,x1:W,y1:H},count:Math.round(10+clamp(S.density)*60),smin:26,smax:70,mirror:cx});
}});

defStructure('field',{name:'Repeat field',blurb:'All-over repeat on a grid (optionally half-drop) — block print and textile logic.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;const d=clamp(S.density);
  const inner=frameBands(ctx,{x0:24,y0:24,x1:W-24,y1:H-24},Math.min(1,Math.round(S.borderBands||0)));
  const cols=Math.round(lerp(3,6,d));const cw=(inner.x1-inner.x0)/cols;const rows=Math.round((inner.y1-inner.y0)/cw);const ch=(inner.y1-inner.y0)/rows;
  const A=ctx.pick('hero'),B=ctx.pick('ring');const half=rng.chance(.45);const trellis=rng.chance(.4);
  if(trellis){const P=[];for(let i=-rows;i<=cols;i++){P.push({kind:'line',role:'inner',pts:[[inner.x0+i*cw,inner.y0],[inner.x0+(i+rows)*cw,inner.y1]].map(([x,y])=>[x,y])});P.push({kind:'line',role:'inner',pts:[[inner.x0+(i+rows)*cw,inner.y0],[inner.x0+i*cw,inner.y1]]});}
    ctx.items.push({type:'parts',parts:P.map(p=>Object.assign(p,{pts:clipSeg(p.pts,inner)})).filter(p=>p.pts),role:'frame'});}
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const x=inner.x0+(i+.5)*cw+(half&&j%2?cw/2:0),y=inner.y0+(j+.5)*ch;if(x>inner.x1-cw*0.3)continue;
    const alt=(i+j)%2===1&&!half;ctx.motif(alt?B:A,x,y,Math.min(cw,ch)*(alt?0.62:0.8),{role:alt?'ring':'hero',variant:alt?'fb':'fa',noOcc:true});
  }
  const f=ctx.pick('filler');
  for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){const x=inner.x0+i*cw+(half&&j%2?cw/2:0),y=inner.y0+j*ch;if(x>inner.x1+1||x<inner.x0-1)continue;
    if(i>0&&i<cols&&j>0&&j<rows)ctx.motif(f,x,y,Math.min(cw,ch)*0.2,{role:'filler',variant:'fx',noOcc:true});}
}});
// clip a 2-point segment to a rectangle (Liang–Barsky)
function clipSeg([[x0,y0],[x1,y1]],r){let t0=0,t1=1;const dx=x1-x0,dy=y1-y0;const p=[-dx,dx,-dy,dy],q=[x0-r.x0,r.x1-x0,y0-r.y0,r.y1-y0];
  for(let i=0;i<4;i++){if(p[i]===0){if(q[i]<0)return null;}else{const t=q[i]/p[i];if(p[i]<0){if(t>t1)return null;if(t>t0)t0=t;}else{if(t<t0)return null;if(t<t1)t1=t;}}}
  return[[x0+t0*dx,y0+t0*dy],[x0+t1*dx,y0+t1*dy]];}

defStructure('shrine',{name:'Shrine arch',blurb:'Arched frame edged with flames (prabhāvalī), lotus pedestal, a single central subject.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;
  const inner=frameBands(ctx,{x0:30,y0:30,x1:W-30,y1:H-30},Math.min(2,Math.round(S.borderBands||0)));
  const iw=inner.x1-inner.x0,cx=(inner.x0+inner.x1)/2;
  const ax0=inner.x0+iw*0.14,ax1=inner.x1-iw*0.14,ar=(ax1-ax0)/2,atop=inner.y0+iw*0.12,ay1=inner.y1-iw*0.2;
  const arch=G.chain([[ax0,ay1]],G.arc(cx,atop+ar,ar,180,360,60),[[ax1,ay1]]);
  const flames=G.samples(arch,false,ar*0.2);const flameKey=poolAll(g.motifs.ring).includes('flame')?'flame':ctx.pick('ring');
  for(const s of flames.slice(1,-1)){const ang=Math.atan2(s.ty,s.tx)/DEG;ctx.motif(flameKey,s.x+s.ty*16,s.y-s.tx*16,ar*0.2,{role:'ring',rot:ang,variant:'halo',noOcc:true});}
  ctx.parts([{kind:'region',closed:true,role:'outer',pts:arch}],'ring');
  ctx.parts([{kind:'line',closed:false,role:'inner',pts:G.offset(arch,-16,false).slice(2,-2)}],'ring');
  const fineHero=poolAll(g.motifs.hero).some(q=>SG.motifs[q]&&SG.motifs[q].fine)?ctx.pick('hero'):null;const ownSeat=!!(fineHero&&SG.motifs[fineHero].fine);
  // padmapīṭha: double lotus pedestal + plinth
  const py=ay1-iw*0.02+(ownSeat?iw*0.045:0),pw=ar*1.25,P=[];const m=11;
  P.push({kind:'region',closed:true,role:'outer',pts:[[cx-pw*0.62,py+40],[cx+pw*0.62,py+40],[cx+pw*0.7,py+66],[cx-pw*0.7,py+66]]});
  const shp=g.motifs.petal||'pointed';
  for(let i=0;i<m;i++){const x=cx-pw/2+(i+.5)*pw/m;P.push({kind:'region',closed:true,role:'outer',pts:G.xform(G.petal(24,pw/m*0.55,shp),{x,y:py+20,rot:180})});}
  for(let i=0;i<m;i++){const x=cx-pw/2+(i+.5)*pw/m;P.push({kind:'region',closed:true,role:'outer',pts:G.xform(G.petal(34,pw/m*0.55,shp),{x,y:py+20})});}
  if(!ownSeat)ctx.parts(P,'ring');
  ctx.occ.push([cx,py+30,pw*0.5]);
  const hs=ar*(ownSeat?1.7:1.15);const heroKey=fineHero||ctx.pick('hero');const isFig=!!(SG.motifs[heroKey]&&SG.motifs[heroKey].figure);
  ctx.motif(heroKey,cx,ownSeat?py+iw*0.03-hs*0.5:py-hs*0.55,hs,{role:'hero',variant:'hero'});
  // Tanjore-style court: a parasol over the image, offerings and standing lamps at its foot
  if((S.canopy||0)>0.02&&rng.next()<S.canopy&&!ownSeat)ctx.motif('chattra',cx,py-hs*1.12,hs*0.44,{role:'ring',variant:'canopy'});
  if((S.offerings||0)>0.02&&rng.next()<S.offerings){
    for(const dx of [-1,0,1])ctx.motif('kalasha',cx+dx*ar*0.34,py+96,ar*0.26,{role:'ring',variant:'offer',noOcc:true});
    for(const sx of [-1,1])ctx.motif('kuthuvilakku',cx+sx*(ar+ (inner.x1-inner.x0)*0.07),ay1-ar*0.2,ar*0.62,{role:'ring',variant:'lamp'});
  }
  const fk=ctx.pick('ring');if(!isFig&&(fk!==flameKey||rng.chance(.5))){const fs=ar*0.42;ctx.motif(fk,ax0+fs*0.62,py-fs*0.55,fs,{role:'ring',variant:'flank'});ctx.motif(fk,ax1-fs*0.62,py-fs*0.55,fs,{role:'ring',flip:true,variant:'flank'});}
  const archInside=(x,y,r)=>{if(y-r<atop+ar)return Math.hypot(x-cx,y-(atop+ar))<ar-26-r;return x-r>ax0+22&&x+r<ax1-22&&y+r<py-6;};
  scatter(ctx,{inside:archInside,box:{x0:ax0,y0:atop,x1:ax1,y1:py},count:Math.round(8+clamp(S.density)*50),smin:18,smax:42,mirror:cx});
  // outside the arch: corner roundels + fillers
  for(const y of flames)ctx.occ.push([y.x,y.y,ar*0.14]);
  ctx.occ.push([cx,atop+ar,ar+10]);ctx.occ.push([cx,(atop+ar+ay1)/2,ar*0.98]);
  const outside=(x,y,r)=>x-r>inner.x0+4&&x+r<inner.x1-4&&y-r>inner.y0+4&&y+r<inner.y1-4&&(y-r>ay1+70||x+r<ax0-8||x-r>ax1+8||(y+r<atop+ar&&Math.hypot(x-cx,y-(atop+ar))>ar+38+r));
  scatter(ctx,{inside:outside,box:inner,count:Math.round(6+clamp(S.density)*40),smin:20,smax:60,mirror:cx});
}});

/* Kolam: dots (pulli) on a grid; a curve travels diagonally between the midpoints of
   neighbouring dots and is reflected by "mirrors" at those midpoints — the mirror-curve
   model of Gerdes (Lunda designs), which also describes sikku kolam. Each midpoint is
   cross (pass straight through), join (wrap two dots together) or sep (keep them apart).
   We search 4-fold ROTATIONAL layouts for one that yields a single closed line: under full
   mirror (D4) symmetry a single line is essentially impossible on these grids (the curve
   always splits into ≥ n loops), while C4 layouts close into one line ~25–45% of the time.
   Real sikku kolam are rotationally symmetric too. */
function c4Orbit(x,y,N){return[[x,y],[N-y,x],[N-x,N-y],[y,N-x]].map(p=>p.join(',')).sort()[0];}
function kolamTrace(n,present,state){
  const isDot=(x,y)=>x>0&&y>0&&x<2*n&&y<2*n&&x%2===1&&y%2===1&&present((x-1)/2,(y-1)/2);
  const reflect=(x,y,dx,dy)=>{
    const horiz=x%2===0;const a=horiz?isDot(x-1,y):isDot(x,y-1),b=horiz?isDot(x+1,y):isDot(x,y+1);
    let s=a&&b?state(x,y):'sep';
    if(s==='cross')return[dx,dy];
    if(s==='sep')return horiz?[-dx,dy]:[dx,-dy];
    return horiz?[dx,-dy]:[-dx,dy];
  };
  const seen=new Set();const loops=[];const key=(x,y,x2,y2)=>x<x2||(x===x2&&y<y2)?x+','+y+'|'+x2+','+y2:x2+','+y2+'|'+x+','+y;
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){
    if(!present(i,j))continue;const X=2*i+1,Y=2*j+1;
    const diamond=[[X-1,Y,1,-1],[X,Y-1,1,1],[X+1,Y,-1,1],[X,Y+1,-1,-1]];
    for(const [sx,sy,dx0,dy0] of diamond){
      if(seen.has(key(sx,sy,sx+dx0,sy+dy0)))continue;
      const pts=[];let x=sx,y=sy,dx=dx0,dy=dy0,guard=0;
      do{pts.push([x,y]);seen.add(key(x,y,x+dx,y+dy));x+=dx;y+=dy;[dx,dy]=reflect(x,y,dx,dy);}while(!(x===sx&&y===sy&&dx===dx0&&dy===dy0)&&++guard<20000);
      loops.push(pts);
    }
  }
  return loops;
}
defStructure('kolam',{name:'Kolam dot-grid',blurb:'A grid of dots (pulli) looped by continuous lines that never end — threshold drawing.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;const d=clamp(S.density);
  const n=[5,7,7,9][Math.min(3,Math.floor(d*4))];const diamond=rng.chance(.5);const c=(n-1)/2;
  const present=(i,j)=>!diamond||Math.abs(i-c)+Math.abs(j-c)<=c+0.01;
  let best=null;
  for(let attempt=0;attempt<500;attempt++){
    const orbit={};const pr={cross:rng.range(.25,.6),join:rng.range(.1,.4),sep:.25};
    const state=(x,y)=>{const k=c4Orbit(x,y,2*n);if(!(k in orbit))orbit[k]=rng.weighted(pr);return orbit[k];};
    const loops=kolamTrace(n,present,state);
    const score=loops.length;
    if(!best||score<best.score)best={loops,score};
    if(score===1)break;
  }
  const m=70,sp=(Math.min(W,H)-2*m)/n;const X=v=>m+v*sp/2+(W-Math.min(W,H))/2,Y=v=>m+v*sp/2+(H-Math.min(W,H))/2;
  const P=[];
  for(const loop of best.loops){const pts=G.chaikin(loop.map(([x,y])=>[X(x),Y(y)]),true,4);P.push({kind:'line',closed:true,role:'outer',pts});}
  const dots=[];for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(present(i,j))dots.push({kind:'dot',x:X(2*i+1),y:Y(2*j+1),r:Math.max(3,sp*0.055),role:'outer'});
  ctx.parts(dots,'filler');ctx.parts(P,'hero');
  if(Math.round(S.borderBands||0)>0){const o=[[22,22],[W-22,22],[W-22,H-22],[22,H-22]],i2=[[34,34],[W-34,34],[W-34,H-34],[34,H-34]];ctx.parts([{kind:'line',closed:true,role:'outer',pts:o},{kind:'line',closed:true,role:'outer',pts:i2}],'border');}
  if(diamond){const k=ctx.pick('ring');const s=sp*1.3;for(const [x,y] of [[X(1.4),Y(1.4)],[X(2*n-1.4),Y(1.4)],[X(2*n-1.4),Y(2*n-1.4)],[X(1.4),Y(2*n-1.4)]])ctx.motif(k,x,y,s,{role:'ring',variant:'kc',noOcc:true});}
}});

defStructure('sheet',{name:'Icon sheet',blurb:'A grid of separate emblems with generous negative space — the modern icon set.',
fn(ctx){
  const {W,H,g,rng}=ctx;
  const pool=rng.shuffle([...new Set([...poolAll(g.motifs.hero),...poolAll(g.motifs.ring)])].filter(k=>k!=='dot'));
  const cols=pool.length>=14?4:3,rows=cols,cw=W/cols,ch=H/rows;
  let k=0;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const key=pool[k++%pool.length];ctx.motif(key,(i+.5)*cw,(j+.5)*ch,cw*0.6,{role:'hero',variant:'s'+key});}
}});

defStructure('dance',{name:'Dance ring',blurb:'Concentric chains of repeated figures circling a centre — Warli tārpā dance logic.',
fn(ctx){
  const {W,H,g,rng}=ctx;const cx=W/2,cy=H/2;
  ctx.motif(ctx.pick('hero'),cx,cy,170,{role:'hero',variant:'hero'});
  const key=ctx.pick('ring');const rings=[[150,10],[255,16],[360,22]];
  rings.forEach(([r,m],ri)=>{const s=Math.min(96,2*Math.PI*r/m*1.08);for(let i=0;i<m;i++){const a=(i+(ri%2)*0.5)/m*360;ctx.motif(key,cx+Math.sin(a*DEG)*r,cy-Math.cos(a*DEG)*r,s,{role:'ring',rot:a,variant:'dr'+ri,noOcc:true});}});
  ctx.occ.push([cx,cy,410]);
  scatter(ctx,{inside:(x,y,r)=>x-r>16&&x+r<W-16&&y-r>16&&y+r<H-16,box:{x0:0,y0:0,x1:W,y1:H},count:Math.round(10+clamp(g.structure.density)*40),smin:40,smax:90,mirror:cx});
}});

defStructure('lattice',{name:'Lattice screen',blurb:'Geometric star-and-grid lattice — the pierced stone jālī.',
fn(ctx){
  const {W,H,g,rng}=ctx;
  const inner=frameBands(ctx,{x0:26,y0:26,x1:W-26,y1:H-26},Math.min(1,Math.round(g.structure.borderBands||0)));
  const cols=rng.pick([4,5]);const cw=(inner.x1-inner.x0)/cols,rows=Math.round((inner.y1-inner.y0)/cw),ch=(inner.y1-inner.y0)/rows;
  const P=[];
  for(let i=0;i<=cols;i++)P.push({kind:'line',role:'outer',pts:[[inner.x0+i*cw,inner.y0],[inner.x0+i*cw,inner.y1]]});
  for(let j=0;j<=rows;j++)P.push({kind:'line',role:'outer',pts:[[inner.x0,inner.y0+j*ch],[inner.x1,inner.y0+j*ch]]});
  for(let i=-rows;i<=cols;i++){P.push({kind:'line',role:'inner',pts:clipSeg([[inner.x0+i*cw,inner.y0],[inner.x0+(i+rows)*cw,inner.y1]],inner)});P.push({kind:'line',role:'inner',pts:clipSeg([[inner.x0+(i+rows)*cw,inner.y0],[inner.x0+i*cw,inner.y1]],inner)});}
  ctx.parts(P.filter(p=>p.pts),'frame');
  const star=ctx.pick('hero'),mid=ctx.pick('ring');
  for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){const edge=i===0||j===0||i===cols||j===rows;if(edge)continue;ctx.motif(star,inner.x0+i*cw,inner.y0+j*ch,Math.min(cw,ch)*0.66,{role:'hero',variant:'node',noOcc:true});}
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)ctx.motif(mid,inner.x0+(i+.5)*cw,inner.y0+(j+.5)*ch,Math.min(cw,ch)*0.34,{role:'ring',variant:'cell',noOcc:true});
}});

/* Calligraphy sheet: one or two large script words left of centre, the last stroke flung
   into a long sweeping tail, a colophon block of small columns, red seals, open paper. */
function colophon(ctx,x0,y0,x1,y1,variantTag){
  const {rng}=ctx;const cols=Math.max(2,Math.round((x1-x0)/26));const cw=(x1-x0)/cols;
  for(let c=0;c<cols;c++){
    let y=y0+rng.range(0,24);const yEnd=y1-rng.range(0,(y1-y0)*0.45);let w=0;
    while(y<yEnd-30){const s=rng.range(38,64);ctx.motif(ctx.pick('ring'),x0+(c+.5)*cw,y+s/2,s,{role:'ring',variant:variantTag+c+'_'+(w++),noOcc:true});y+=s+rng.range(4,12);}
  }
}
defStructure('calligraphy',{name:'Calligraphy sheet',blurb:'One large brush word with a sweeping tail, a colophon of small columns, red seals, open paper.',
fn(ctx){
  const {W,H,rng,g}=ctx;const n=rng.pick([1,2,2]);const hh=H*rng.range(0.56,0.68);const x0=W*rng.range(0.27,0.36);const yc=H*0.43;
  for(let i=0;i<n;i++)ctx.motif(ctx.pick('hero'),x0+i*W*0.15,yc+i*rng.range(10,50),hh*(i?rng.range(0.82,0.95):1),{role:'hero',variant:'w'+i,noOcc:true});
  const yb=yc+hh*0.47,xs=x0-hh*0.08;
  const sweep=G.chain(G.bez([xs,yb],[xs-W*0.14,yb+H*0.07],[xs-W*0.1,H*0.9],[xs+W*0.12,H*0.89],24),G.bez([xs+W*0.12,H*0.89],[xs+W*0.3,H*0.88],[xs+W*0.44,H*0.82],[xs+W*0.5,H*0.73],20));
  ctx.parts([{kind:'line',closed:false,role:'outer',pts:sweep,profile:'tail',bw:hh*0.05}],'hero');
  const cx0=W*rng.range(0.64,0.7);colophon(ctx,cx0,H*0.16,W*0.92,H*0.78,'c');
  ctx.motif('seal',cx0+rng.range(30,90),H*rng.range(0.42,0.58),W*0.06,{role:'filler',variant:'s1',noOcc:true});
  ctx.motif('sealRound',x0+hh*0.22,yc-hh*0.42,W*0.03,{role:'filler',variant:'s2',noOcc:true});
}});

/* Procession: script columns standing in a row like figures — a brush peak, a word stack
   for the body, a hairline robe with a flared, rippling hem. Faceless by design. */
defStructure('procession',{name:'Script procession',blurb:'Tall script columns in a row, each with a peak, a word-stack body and a flared hairline hem.',
fn(ctx){
  const {W,H,rng}=ctx;const n=rng.int(3,5);const base=H*0.93;const slot=W/n;const tops=[];
  for(let i=0;i<n;i++){
    const x=slot*(i+.5)+rng.range(-slot*0.12,slot*0.12),h=H*rng.range(0.52,0.84),top=base-h;tops.push(top);
    const ys=top+h*0.3,ws=h*0.07,sh=h*rng.range(0.1,0.13),wh=Math.min(h*rng.range(0.34,0.46),slot*0.86),waves=rng.int(2,3),lean=rng.range(-0.05,0.05)*h;
    // deel silhouette: rounded shoulders, sides that pinch in then flare, rippling asymmetric hem
    const hem=[];for(let k=0;k<=48;k++){const u=k/48;hem.push([x+lean-wh/2+u*wh,base+Math.sin(u*Math.PI*2*waves+0.6)*h*0.018*(0.5+u)]);}
    const right=G.chain(G.bez([x+ws/2,ys],[x+sh,ys+h*0.01],[x+sh*1.15,ys+h*0.06],[x+sh*0.95,ys+h*0.16],10),G.bez([x+sh*0.95,ys+h*0.16],[x+sh*0.75,ys+h*0.35],[x+lean+wh*0.3,base-h*0.16],[x+lean+wh/2,base],16));
    const left=G.chain(G.bez([x-ws/2,ys],[x-sh,ys+h*0.01],[x-sh*1.15,ys+h*0.06],[x-sh*0.95,ys+h*0.16],10),G.bez([x-sh*0.95,ys+h*0.16],[x-sh*0.75,ys+h*0.35],[x+lean-wh*0.3,base-h*0.16],[x+lean-wh/2,base],16));
    const robe=G.chain(right,hem.slice().reverse(),left.slice().reverse());
    ctx.parts([{kind:'region',closed:true,role:'inner',pts:robe}],'ring');
    // heavy ink pooled in the hem's curled ends, and one hanging sleeve
    for(const sg of [-1,1]){const ex=x+lean+sg*wh/2;ctx.parts([{kind:'line',closed:false,role:'outer',profile:'swell',bw:h*0.035,pts:G.bez([ex-sg*h*0.05,base+h*0.01],[ex,base+h*0.03],[ex+sg*h*0.03,base-h*0.01],[ex+sg*h*0.01,base-h*0.04],10)}],'ring');}
    const sv=rng.chance(.5)?1:-1;ctx.parts([{kind:'line',closed:false,role:'outer',profile:'tail',bw:h*0.04,pts:G.bez([x+sv*sh*0.9,ys+h*0.08],[x+sv*sh*1.6,ys+h*0.2],[x+sv*sh*1.5,ys+h*0.34],[x+sv*sh*2.1,ys+h*0.4],14)}],'ring');
    ctx.motif(ctx.pick('hero'),x+rng.range(-h*0.02,h*0.02),top+h*0.4,h*0.5,{role:'hero',variant:'f'+i,noOcc:true});
    ctx.parts([{kind:'line',closed:false,role:'outer',pts:G.bez([x+rng.range(-6,6),top],[x+2,top+h*0.04],[x-2,top+h*0.08],[x,top+h*0.14],10),profile:'rise',bw:h*0.038}],'hero');
  }
  // colophon blocks over the gaps where neighbouring columns are short enough
  let placed=0;
  for(let i=0;i<n-1;i++){if(Math.max(tops[i],tops[i+1])<H*0.36)continue;const xm=slot*(i+1);if(placed>=2)break;colophon(ctx,xm-50,H*0.07,xm+50,H*0.3,'k'+i);ctx.motif('sealRound',xm+rng.range(-30,30),H*0.32,W*0.022,{role:'filler',variant:'r'+i,noOcc:true});placed++;}
  if(!placed)colophon(ctx,W*0.04,H*0.05,W*0.16,H*0.28,'k');
  ctx.motif('seal',W*0.5+rng.range(-60,60),H*0.06,W*0.032,{role:'filler',variant:'st',noOcc:true});
  ctx.motif('seal',W*0.95,H*0.86,W*0.03,{role:'filler',variant:'sb',noOcc:true});
}});

/* Calendar stone: a disc of rings — outer band of cells, eight great rays, a ring of
   twenty sign cells, and the central sign. After the Piedra del Sol. */
defStructure('calendar',{name:'Calendar stone',blurb:'Concentric rings: an outer band, eight great rays, twenty sign cells, a central sign.',
fn(ctx){
  const {W,H,g,rng}=ctx;const cx=W/2,cy=H/2,R=Math.min(W,H)/2-26;
  ctx.parts([{kind:'region',closed:true,role:'outer',pts:G.circle(cx,cy,R,160)}],'ring');
  const band=[];const m=48;for(let i=0;i<m;i++)band.push({kind:'region',closed:true,role:'inner',pts:polarCell(cx,cy,R*0.88,R*0.97,i*360/m+1,(i+1)*360/m-1,4)});
  ctx.items.push({type:'parts',parts:band,role:'ring',variant:'cb'});
  const rays=[];for(let i=0;i<8;i++){const a=i*45;rays.push({kind:'region',closed:true,role:'outer',pts:G.xform([[-R*0.11,-R*0.5],[0,-R*0.86],[R*0.11,-R*0.5]],{x:cx,y:cy,rot:a})});rays.push({kind:'region',closed:true,role:'inner',pts:G.xform([[-R*0.06,-R*0.5],[0,-R*0.68],[R*0.06,-R*0.5]],{x:cx,y:cy,rot:a+22.5})});}
  ctx.items.push({type:'parts',parts:rays,role:'ring',variant:'cr'});
  const dots=[{kind:'line',closed:true,role:'inner',pts:G.circle(cx,cy,R*0.5,140)}];for(let i=0;i<40;i++){const a=i*9*DEG;dots.push({kind:'dot',x:cx+Math.cos(a)*R*0.53,y:cy+Math.sin(a)*R*0.53,r:R*0.011,role:'detail'});}
  ctx.parts(dots,'ring');
  const cells=[];for(let i=0;i<20;i++)cells.push({kind:'region',closed:true,role:'inner',pts:polarCell(cx,cy,R*0.33,R*0.48,i*18+0.8,(i+1)*18-0.8,5)});
  ctx.items.push({type:'parts',parts:cells,role:'ring',variant:'cc'});
  const pool=poolAll(g.motifs.ring);const s=2*Math.PI*R*0.405/20*0.78;
  for(let i=0;i<20;i++){const a=(i+0.5)*18;const key=pool[i%pool.length]||'dot';ctx.motif(key,cx+Math.sin(a*DEG)*R*0.405,cy-Math.cos(a*DEG)*R*0.405,s,{role:'ring',rot:a,variant:'sign'+(i%pool.length),noOcc:true});}
  ctx.parts([{kind:'region',closed:true,role:'inner',pts:G.circle(cx,cy,R*0.32,100)}],'ring');
  ctx.motif(ctx.pick('hero'),cx,cy,R*0.5,{role:'hero',variant:'hero',noOcc:true});
  const ck=ctx.pick('filler');for(const [x,y,r] of [[60,60,0],[W-60,60,90],[W-60,H-60,180],[60,H-60,270]])ctx.motif(ck==='dot'?'stepFret':ck,x,y,78,{role:'filler',rot:r,variant:'corner',noOcc:true});
}});

/* Day-count register: cells pairing a sign with a dot numeral 1–13, as the 260-day count
   pairs them (signs here come from the motif set, so the run is illustrative). */
defStructure('daycount',{name:'Day-count register',blurb:'A codex grid: each cell pairs a sign with a numeral of 1–13 dots.',
fn(ctx){
  const {W,H,g,rng}=ctx;const inner=frameBands(ctx,{x0:28,y0:28,x1:W-28,y1:H-28},Math.min(1,Math.round(g.structure.borderBands||0)),36);
  const cols=4,rows=5,cw=(inner.x1-inner.x0)/cols,ch=(inner.y1-inner.y0)/rows;
  const pool=rng.shuffle([...new Set([...poolAll(g.motifs.hero),...poolAll(g.motifs.ring)])].filter(k=>k!=='dot'));
  const frames=[];let k=rng.int(0,12);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const x0=inner.x0+i*cw,y0=inner.y0+j*ch;frames.push({kind:'line',closed:true,role:'outer',pts:[[x0+6,y0+6],[x0+cw-6,y0+6],[x0+cw-6,y0+ch-6],[x0+6,y0+ch-6]]});
    const key=pool[(j*cols+i)%pool.length];ctx.motif(key,x0+cw/2,y0+ch*0.42,Math.min(cw,ch)*0.6,{role:'hero',variant:'d'+key,noOcc:true});
    const num=(k++%13)+1,dr=Math.min(cw,ch)*0.035,per=7;
    for(let d=0;d<num;d++){const row=Math.floor(d/per),cnt=Math.min(per,num-row*per),col=d%per;const x=x0+cw/2+(col-(cnt-1)/2)*dr*2.7,y=y0+ch*0.82+row*dr*2.6;frames.push({kind:'region',closed:true,role:'inner',pts:G.circle(x,y,dr,14)});}
  }
  ctx.parts(frames,'ring');
}});

/* Mask stack: feather crown and foliage behind a large frontal mask, a smaller mask
   below, step-frets at the foot — strict mirror symmetry, every gap filled. */
defStructure('totem',{name:'Mask stack',blurb:'Feather crown and foliage behind a frontal mask, a second mask below, frets at the base.',
fn(ctx){
  const {W,H,g,rng}=ctx;const inner=frameBands(ctx,{x0:24,y0:24,x1:W-24,y1:H-24},Math.min(1,Math.round(g.structure.borderBands||0)),34);
  const cx=W/2,iw=inner.x1-inner.x0;const ring=poolAll(g.motifs.ring);
  const leafKey=ring.includes('leaf')?'leaf':ctx.pick('filler');
  for(const a of [-72,-50,-28,28,50,72]){const r=iw*0.33;ctx.motif(leafKey,cx+Math.sin(a*DEG)*r,inner.y0+iw*0.42-Math.cos(a*DEG)*r,iw*0.26,{role:'ring',rot:a,variant:'leaf',flip:a<0,noOcc:true});}
  ctx.motif(ring.includes('featherFan')?'featherFan':ctx.pick('ring'),cx,inner.y0+iw*0.27,iw*0.72,{role:'ring',variant:'crown',noOcc:true});
  const hero=ctx.pick('hero');ctx.motif(hero,cx,inner.y0+iw*0.5,iw*0.46,{role:'hero',variant:'m1'});
  ctx.motif(hero,cx,inner.y0+iw*0.84,iw*0.25,{role:'hero',variant:'m2'});
  const fk=ring.includes('stepFret')?'stepFret':ctx.pick('filler');
  ctx.motif(fk,inner.x0+iw*0.14,inner.y1-iw*0.13,iw*0.22,{role:'ring',variant:'fret',flip:true});
  ctx.motif(fk,inner.x1-iw*0.14,inner.y1-iw*0.13,iw*0.22,{role:'ring',variant:'fret'});
  scatter(ctx,{inside:(x,y,r)=>x-r>inner.x0&&x+r<inner.x1&&y-r>inner.y0&&y+r<inner.y1,box:inner,count:Math.round(10+clamp(g.structure.density)*60),smin:iw*0.04,smax:iw*0.09,mirror:cx});
}});

/* Glyph wall: a mirrored maze — masks down the centre and flanks, every other cell a
   glyph block, fret or scroll, packed by recursive splitting of the left half. */
defStructure('glyphwall',{name:'Glyph wall',blurb:'Masks on the axis, the rest packed with glyph blocks and frets — mirrored, edge to edge.',
fn(ctx){
  const {W,H,g,rng}=ctx;const inner={x0:20,y0:20,x1:W-20,y1:H-20};const cx=W/2;const hero=ctx.pick('hero');
  ctx.motif(hero,cx,H*0.47,W*0.34,{role:'hero',variant:'c'});
  ctx.motif(hero,cx,H*0.15,W*0.17,{role:'hero',variant:'t'});
  ctx.motif(ctx.pick('ring'),cx,H*0.83,W*0.17,{role:'ring',variant:'b'});
  ctx.motif(hero,cx-W*0.28,H*0.42,W*0.2,{role:'hero',variant:'f',flip:true});ctx.motif(hero,cx+W*0.28,H*0.42,W*0.2,{role:'hero',variant:'f'});
  const cells=[];const split=(x0,y0,x1,y1,d)=>{const w=x1-x0,h=y1-y0;if(d>5||(w<120&&h<120)||(d>2&&rng.chance(.25))){cells.push([x0,y0,x1,y1]);return;}
    if(w>h){const s=x0+w*rng.range(0.35,0.65);split(x0,y0,s,y1,d+1);split(s,y0,x1,y1,d+1);}else{const s=y0+h*rng.range(0.35,0.65);split(x0,y0,x1,s,d+1);split(x0,s,x1,y1,d+1);}};
  split(inner.x0,inner.y0,cx-6,inner.y1,0);
  const pool=[...new Set([...poolAll(g.motifs.filler),...poolAll(g.motifs.ring)])].filter(k=>k!=='dot');let v=0;
  for(const [x0,y0,x1,y1] of cells){const w=x1-x0-8,h=y1-y0-8;if(w<26||h<26)continue;const x=(x0+x1)/2,y=(y0+y1)/2;const r=Math.min(w,h)*0.42;if(!ctx.free(x,y,r,2)||!ctx.free(2*cx-x,y,r,2))continue;
    const key=pool[v%pool.length];const asp=key==='cartouche';
    ctx.motif(key,x,y,asp?w:Math.min(w,h),{role:'filler',sy:asp?h/w:undefined,variant:'g'+(v%5),noOcc:true});
    ctx.motif(key,2*cx-x,y,asp?w:Math.min(w,h),{role:'filler',sy:asp?h/w:undefined,flip:true,variant:'g'+(v%5),noOcc:true});ctx.occ.push([x,y,r],[2*cx-x,y,r]);v++;}
  // close the remaining gaps with small marks, mirrored
  scatter(ctx,{inside:(x,y,r)=>x-r>inner.x0&&y-r>inner.y0&&y+r<inner.y1,box:inner,count:Math.round(40+clamp(g.structure.density)*160),smin:16,smax:46,mirror:cx});
}});

/* Frieze: stacked horizontal bands of fretwork separated by plain rules — the stone
   mosaic walls of Mitla. Any tradition's border vocabulary can fill the rows. */
defStructure('frieze',{name:'Fret frieze',blurb:'Stacked bands of repeating fretwork between plain rules, like a mosaic wall.',
fn(ctx){
  const {W,H,g,rng}=ctx;const x0=34,x1=W-34;let y=34;const P=[];const keys=rng.shuffle(poolAll(g.motifs.border).filter(k=>SG.borders[k]&&k!=='lines'));
  const rows=[];let ky=0;while(y<H-34-60){const t=Math.min(H-34-y-12,rng.range(80,150));if(t<56)break;rows.push([y,t,keys[ky++%Math.max(1,keys.length)]||'zigzag']);y+=t+rng.range(12,22);}
  const extra=(H-34-y)/rows.length;let yy=34;
  for(const [,t0,key] of rows){const t=t0+extra;
    P.push({kind:'line',closed:true,role:'outer',pts:[[x0,yy],[x1,yy],[x1,yy+t],[x0,yy+t]]});
    for(const p of SG.borders[key].fn(x1-x0-16,t-16)){if(p.kind==='dot')P.push(Object.assign({},p,{x:p.x+x0+8,y:p.y+yy+8}));else P.push(Object.assign({},p,{pts:p.pts.map(([a,b])=>[a+x0+8,b+yy+8])}));}
    yy+=t+(H-68-rows.reduce((a,r)=>a+r[1]+extra,0))/Math.max(1,rows.length-1);}
  ctx.parts(P,'border');
}});

/* Devotional emblem: two attributes crossed over a disc, sunburst or crescent, on a
   lotus — the way clipart and stickers stand in for the deity with his objects. */
defStructure('emblem',{name:'Devotional emblem',blurb:'Two attributes crossed over a disc, sunburst or crescent, resting on a lotus.',
fn(ctx){
  const {W,H,g,rng}=ctx;const cx=W/2,cy=H*0.45;const back=rng.pick(['disc','rays','crescent','rays']);
  if(back==='disc')ctx.parts([{kind:'region',closed:true,role:'outer',pts:G.circle(cx,cy,W*0.36,120).concat(G.circle(cx,cy,W*0.31,120).reverse())}],'ring');
  else if(back==='crescent'){const o=G.arc(cx,cy,W*0.36,-150,150,70),i=G.arc(cx+W*0.12,cy,W*0.3,145,-145,60);ctx.parts([{kind:'region',closed:true,role:'outer',pts:o.concat(i)}],'ring');}
  else{const P=[];const n=36;for(let k=0;k<n;k++){const a=k/n*Math.PI*2,r0=W*0.27,r1=W*(k%2?0.4:0.46);P.push({kind:'line',role:'inner',pts:[[cx+Math.cos(a)*r0,cy+Math.sin(a)*r0],[cx+Math.cos(a)*r1,cy+Math.sin(a)*r1]]});}ctx.parts(P,'ring');}
  const pool=rng.shuffle(poolAll(g.motifs.hero).filter(k=>k!=='dot'));const a=pool[0]||'lotusTop',b=pool[1]||a;
  if(SG.motifs[a]&&SG.motifs[a].figure){
    ctx.motif(a,cx,cy,W*0.64,{role:'hero',variant:'a'});
    const at=pool.find(k=>!(SG.motifs[k]&&SG.motifs[k].figure)&&k!=='dot');
    if(at){ctx.motif(at,cx-W*0.36,cy+W*0.22,W*0.18,{role:'ring',variant:'att'});ctx.motif(at,cx+W*0.36,cy+W*0.22,W*0.18,{role:'ring',variant:'att',flip:true});}
  }else{
    ctx.motif(a,cx,cy,W*0.6,{role:'hero',rot:-32,variant:'a'});
    if(b!==a&&!(SG.motifs[b]&&SG.motifs[b].figure))ctx.motif(b,cx,cy,W*0.54,{role:'hero',rot:32,variant:'b'});
  }
  const ring=poolAll(g.motifs.ring);ctx.motif(ring.includes('lotusSide')?'lotusSide':ctx.pick('ring'),cx,cy+W*0.33,W*0.3,{role:'ring',variant:'base'});
  ctx.occ.push([cx,cy,W*0.4]);
  scatter(ctx,{inside:(x,y,r)=>x-r>20&&x+r<W-20&&y-r>20&&y+r<H-20,box:{x0:0,y0:0,x1:W,y1:H},count:Math.round(6+clamp(g.structure.density)*40),smin:24,smax:60,mirror:cx});
}});

/* Stencil card: one emblem centred on a card, sunburst fans in the corners, scroll
   flourishes at the sides. Pair with the line.bridges gene so islands stay attached. */
defStructure('stencil',{name:'Stencil card',blurb:'A centred emblem, corner sunbursts and side flourishes — a cut-out stencil sheet.',
fn(ctx){
  const {W,H,g,rng}=ctx;const m=44;const cx=W/2,cy=H/2;
  ctx.parts([{kind:'line',closed:true,role:'outer',pts:G.roundRect(m-20,m-20,W-m+20,H-m+20,18)}],'frame');
  const corners=rng.chance(.5)?[[m,m,0],[W-m,H-m,180]]:[[m,m,0],[W-m,m,90],[W-m,H-m,180],[m,H-m,270]];
  const R=[];for(const [x,y,a0] of corners)for(let k=0;k<9;k++){const a=(a0+5+k*10)*DEG,r0=26,r1=k%2?120:150;R.push({kind:'line',role:'outer',pts:[[x+Math.cos(a)*r0,y+Math.sin(a)*r0],[x+Math.cos(a)*r1,y+Math.sin(a)*r1]]});}
  ctx.parts(R,'frame');
  const scroll=[];for(const s of [-1,1]){const sx=cx+s*W*0.37;const sp=[];for(let k=0;k<=48;k++){const u=k/48,th=u*Math.PI*2.8,r=95*(1-0.82*u);sp.push([sx+s*Math.cos(th)*r*0.75,cy-150+u*230+Math.sin(th)*r]);}
    scroll.push({kind:'line',role:'outer',pts:sp});for(const [dy,rot] of [[-40,-40],[60,40],[150,-30]])scroll.push({kind:'region',closed:true,role:'outer',pts:G.xform(G.petal(70,15,'drop'),{x:sx,y:cy+dy,rot:s*(90+rot)})});}
  ctx.parts(scroll,'ring');
  ctx.motif(ctx.pick('hero'),cx,cy,W*0.5,{role:'hero',rot:rng.pick([0,0,-20,20]),variant:'hero'});
  ctx.occ.push([cx-W*0.37,cy,110],[cx+W*0.37,cy,110]);
  scatter(ctx,{inside:(x,y,r)=>x-r>m&&x+r<W-m&&y-r>m&&y+r<H-m,box:{x0:m,y0:m,x1:W-m,y1:H-m},count:Math.round(4+clamp(g.structure.density)*24),smin:24,smax:50,mirror:cx});
}});

/* Knotwork: interlace panels inside plaited borders — a 3×3 grid of panels (corner
   roundels, woven side strips, a central knot) or one woven field with a roundel cut out
   of its centre. After the carpet pages of Insular gospel books, without their crosses. */
defStructure('knotwork',{name:'Knotwork panel',blurb:'Woven interlace panels inside plaited borders — the carpet-page grammar of Insular gospel books.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;const d=clamp(S.density);
  const inner=frameBands(ctx,{x0:30,y0:30,x1:W-30,y1:H-30},Math.min(2,Math.round(S.borderBands||0)));
  const iw=inner.x1-inner.x0,ih=inner.y1-inner.y0,cx=(inner.x0+inner.x1)/2,cy=(inner.y0+inner.y1)/2;
  const cell=lerp(92,52,d);const breaks=rng.range(0.08,0.26);const rect=(a,b,c,e)=>({kind:'line',closed:true,role:'outer',pts:[[a,b],[c,b],[c,e],[a,e]]});
  if(rng.chance(.35)){
    const R=Math.min(iw,ih)*rng.range(0.2,0.25);
    ctx.items.push({type:'parts',parts:knotField(inner.x0+6,inner.y0+6,inner.x1-6,inner.y1-6,rng,{cell,breaks,hole:(x,y)=>Math.hypot(x-cx,y-cy)<R+cell*0.35}),role:'ring',variant:'kf'});
    ctx.parts([{kind:'region',closed:true,role:'outer',pts:G.circle(cx,cy,R,120)},{kind:'line',closed:true,role:'inner',pts:G.circle(cx,cy,R-12,120)}],'ring');
    ctx.motif(ctx.pick('hero'),cx,cy,(R-16)*1.9,{role:'hero',variant:'hero'});
    return;
  }
  const a=Math.min(iw,ih)*rng.range(0.22,0.28),g2=10;
  const xs=[inner.x0,inner.x0+a,inner.x1-a,inner.x1],ys=[inner.y0,inner.y0+a,inner.y1-a,inner.y1];
  const frames=[];
  const cornerKey=ctx.pick('ring');
  for(const [i,j] of [[0,0],[2,0],[2,2],[0,2]]){frames.push(rect(xs[i],ys[j],xs[i+1],ys[j+1]));ctx.motif(cornerKey,(xs[i]+xs[i+1])/2,(ys[j]+ys[j+1])/2,a*0.8,{role:'ring',variant:'corner'});}
  const sides=[[1,0],[1,2],[0,1],[2,1]];
  sides.forEach(([i,j],k)=>{const x0=xs[i]+g2,y0=ys[j]+g2,x1=xs[i+1]-g2,y1=ys[j+1]-g2;frames.push(rect(xs[i],ys[j],xs[i+1],ys[j+1]));
    ctx.items.push({type:'parts',parts:knotField(x0,y0,x1,y1,rng.fork('s'+(k>>1)),{cell:Math.min(cell,(Math.min(x1-x0,y1-y0))/2),breaks}),role:'ring',variant:'side'+(k>>1)});});
  frames.push(rect(xs[1],ys[1],xs[2],ys[2]));
  const mx0=xs[1]+g2,my0=ys[1]+g2,mx1=xs[2]-g2,my1=ys[2]-g2;
  const hero=ctx.pick('hero');
  if(hero==='knot'||rng.chance(.3))ctx.items.push({type:'parts',parts:knotField(mx0,my0,mx1,my1,rng.fork('c'),{cell:cell*1.15,breaks:breaks*1.2,sym:'c4'}),role:'hero',variant:'core'});
  else ctx.motif(hero,(mx0+mx1)/2,(my0+my1)/2,Math.min(mx1-mx0,my1-my0)*0.9,{role:'hero',variant:'hero'});
  ctx.parts(frames,'frame');
}});

/* Pattern ground (wagara): an all-over repeat covers the cloth edge to edge — one
   pattern, horizontal bands, or blocks alternating two patterns — and a few motifs float
   over it, some in reserved roundels. Katagami-dyed kimono and furoshiki logic. */
defStructure('wagara',{name:'Pattern ground',blurb:'All-over repeats covering the cloth edge to edge, in bands or blocks, with motifs floating over them.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;const d=clamp(S.density);
  const pool=poolAll(g.motifs.tile).filter(k=>SG.tiles[k]);const tiles=pool.length?pool:['seigaiha'];
  const u=lerp(80,46,d);const two=rng.shuffle(tiles);const A=two[0],B=two[1]||two[0];
  const mode=rng.pick(['one','bands','blocks','one']);const seps=[];
  if(mode==='one')ctx.items.push({type:'parts',parts:tileParts(A,{x0:0,y0:0,x1:W,y1:H},u,rng.fork('t0'),g),role:'frame',variant:'tile0'});
  else if(mode==='bands'){const n=rng.int(2,4);const hs=Array.from({length:n},()=>rng.range(0.6,1.4));const tot=hs.reduce((a,b)=>a+b,0);let y=0;
    hs.forEach((h,i)=>{const y1=i===n-1?H:y+h/tot*H;ctx.items.push({type:'parts',parts:tileParts(i%2?B:A,{x0:0,y0:y,x1:W,y1},u*(i%2?0.9:1),rng.fork('t'+i),g),role:'frame',variant:'tile'+(i%2)});if(i)seps.push([[0,y],[W,y]]);y=y1;});}
  else{const n=rng.pick([2,3]);const c=W/n;for(let j=0;j<n;j++)for(let i=0;i<n;i++)ctx.items.push({type:'parts',parts:tileParts((i+j)%2?B:A,{x0:i*c,y0:j*c,x1:(i+1)*c,y1:(j+1)*c},u*((i+j)%2?0.9:1),rng.fork('t'+((i+j)%2)),g),role:'frame',variant:'tile'+((i+j)%2)});
    for(let k=1;k<n;k++)seps.push([[k*c,0],[k*c,H]],[[0,k*c],[W,k*c]]);}
  if(seps.length)ctx.parts(seps.map(pts=>({kind:'line',role:'outer',pts})),'frame');
  const pool2=[...new Set([...poolAll(g.motifs.hero),...poolAll(g.motifs.ring)])].filter(k=>k!=='dot'&&SG.motifs[k]&&!SG.motifs[k].script);
  const n=(S.bare||0)>0.9?0:Math.round(lerp(3,7,d))+rng.int(0,1);
  for(let k=0,tries=0;k<n&&tries<80;tries++){
    const s=W*rng.range(0.13,k<2?0.3:0.2),x=rng.range(s*0.55,W-s*0.55),y=rng.range(s*0.55,H-s*0.55);if(!ctx.free(x,y,s*0.5,10))continue;
    const key=rng.pick(pool2.length?pool2:['floret']);
    if(rng.chance(.45)){ctx.parts([{kind:'region',closed:true,role:'outer',pts:G.circle(x,y,s*0.6,72)}],'ring');ctx.motif(key,x,y,s*0.92,{role:'hero',rot:SG.motifs[key].figure||SG.motifs[key].upright?0:rng.range(-15,15),variant:'fl'+key});}
    else ctx.motif(key,x,y,s,{role:'hero',rot:SG.motifs[key].figure||SG.motifs[key].upright?0:rng.range(-25,25),variant:'fl'+key});
    k++;
  }
}});

/* Ice-ray lattice (bīngliè): each pane is split by one straight cut that runs from edge to
   edge of that pane, so bars meet in T-junctions and never cross — Daniel Sheets Dye's
   "cracked ice". Panes are drawn, the bars are the ground between them; blossoms may be
   scattered on the cracks (ice-and-plum). */
function splitPoly(p,rng){
  const n=p.length;const at=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  const minAng=q=>{let m=180;for(let i=0;i<q.length;i++){const a=q[(i-1+q.length)%q.length],b=q[i],c=q[(i+1)%q.length];const v1=[a[0]-b[0],a[1]-b[1]],v2=[c[0]-b[0],c[1]-b[1]];const ang=Math.acos(clamp((v1[0]*v2[0]+v1[1]*v2[1])/((Math.hypot(...v1)*Math.hypot(...v2))||1),-1,1))/DEG;if(ang<m)m=ang;}return m;};
  const compact=q=>4*Math.PI*Math.abs(G.area(q))/Math.pow(G.length(q,true),2);
  let best=null;
  for(let t=0;t<40;t++){
    const i=rng.int(0,n-1),j=rng.int(0,n-1);if(i===j)continue;
    const a=at(p[i],p[(i+1)%n],rng.range(0.22,0.78)),b=at(p[j],p[(j+1)%n],rng.range(0.22,0.78));
    const A=[a];for(let k=(i+1)%n;;k=(k+1)%n){A.push(p[k]);if(k===j)break;}A.push(b);
    const B=[b];for(let k=(j+1)%n;;k=(k+1)%n){B.push(p[k]);if(k===i)break;}B.push(a);
    const ra=Math.abs(G.area(A)),rb=Math.abs(G.area(B));if(Math.min(ra,rb)/(ra+rb)<0.22)continue;
    if(minAng(A)<28||minAng(B)<28)continue;
    // prefer cuts that leave compact panes (no slivers), with some chance in the choice
    const score=Math.min(compact(A),compact(B))+rng.range(0,0.12);
    if(!best||score>best.score)best={score,A,B};
  }
  return best&&[best.A,best.B];
}
defStructure('iceray',{name:'Ice-ray lattice',blurb:'Cracked-ice window lattice: each pane split by one straight cut that ends on existing bars.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;const d=clamp(S.density);
  const inner=frameBands(ctx,{x0:26,y0:26,x1:W-26,y1:H-26},Math.min(1,Math.round(S.borderBands||0)),40);
  const minA=lerp(30000,9000,d);const todo=[[[inner.x0,inner.y0],[inner.x1,inner.y0],[inner.x1,inner.y1],[inner.x0,inner.y1]]],done=[];
  while(todo.length){const p=todo.pop();if(Math.abs(G.area(p))<minA*rng.range(0.7,1.8)){done.push(p);continue;}const c=splitPoly(p,rng);if(!c)done.push(p);else todo.push(c[0],c[1]);}
  const bar=lerp(11,7,d);
  ctx.items.push({type:'parts',parts:done.map(p=>({kind:'region',closed:true,role:'outer',pts:G.offset(p,-bar/2,true)})),role:'ring',variant:'ice'});
  const verts=[];for(const p of done)for(const v of p)if(v[0]>inner.x0+30&&v[0]<inner.x1-30&&v[1]>inner.y0+30&&v[1]<inner.y1-30)verts.push(v);
  const m=Math.round(lerp(3,12,d));const key=ctx.pick('filler')==='dot'?ctx.pick('ring'):ctx.pick('filler');
  for(const v of rng.shuffle(verts).slice(0,m*3)){if(ctx.items.filter(it=>it.variant==='bloom').length>=m)break;const s=rng.range(44,90);if(!ctx.free(v[0],v[1],s*0.5,14))continue;ctx.motif(key,v[0],v[1],s,{role:'filler',rot:SG.motifs[key]&&SG.motifs[key].upright?0:rng.range(-30,30),variant:'bloom'});}
}});

/* Hanging scroll: a painted subject (ensō, bamboo, a blossom) with an inscription in one
   or two columns, or — when the vocabulary is all script — a block of columns read top to
   bottom and right to left, a smaller signature column, and red seals. */
defStructure('scroll',{name:'Hanging scroll',blurb:'Columns of brush characters read top to bottom, right to left — or a painted subject with an inscription — and red seals.',
fn(ctx){
  const {W,H,g,rng}=ctx;
  const heroes=poolAll(g.motifs.hero).filter(k=>SG.motifs[k]);
  const pict=heroes.filter(k=>!SG.motifs[k].script&&k!=='dot');
  const script=[...new Set([...heroes,...poolAll(g.motifs.ring)])].filter(k=>SG.motifs[k]&&SG.motifs[k].script);
  const ch=()=>script.length?rng.pick(script):ctx.pick('ring');
  const column=(x,y0,y1,s,tag)=>{let y=y0+s/2,k=0;while(y+s/2<=y1){ctx.motif(ch(),x+rng.range(-s,s)*0.03,y,s*rng.range(0.88,1.04),{role:'ring',variant:tag+'_'+(k++),noOcc:true});y+=s*rng.range(1.04,1.16);}return y;};
  if(pict.length&&(!script.length||rng.chance(.75))){
    const side=rng.chance(.5)?1:-1,key=rng.pick(pict);
    ctx.motif(key,W*0.5-side*W*0.07,H*0.53,W*rng.range(0.56,0.66),{role:'hero',variant:'hero',noOcc:true});
    const s=W*0.062,x1=side>0?W*0.89:W*0.11,cols=rng.int(1,2);let yEnd=0;
    for(let c=0;c<cols;c++)yEnd=Math.max(yEnd,column(x1-side*c*s*1.35,H*0.07+c*s*0.6,H*rng.range(c?0.4:0.55,c?0.6:0.82),s,'i'+c));
    ctx.motif('seal',x1-side*(cols-1)*s*0.68,Math.min(H*0.93,yEnd+s*0.5),s*0.9,{role:'filler',variant:'s1',noOcc:true});
    if(rng.chance(.6))ctx.motif('sealRound',x1,H*0.05,s*0.55,{role:'filler',variant:'s0',noOcc:true});
    return;
  }
  const cols=rng.int(3,5),s=Math.min(W*0.72/cols*0.8,H*0.12),gap=(W*0.72-cols*s)/(cols-1||1);
  for(let c=0;c<cols;c++){const x=W*0.86-s/2-c*(s+gap);column(x,H*0.08,c===cols-1?H*rng.range(0.45,0.75):H*0.92,s,'c'+c);}
  const sx=W*0.86-s/2-cols*(s+gap)+gap*0.4,ss=s*0.5;const yEnd=column(sx,H*0.48,H*0.78,ss,'sig');
  ctx.motif('seal',sx,Math.min(H*0.93,yEnd+ss*1.2),s*0.62,{role:'filler',variant:'s1',noOcc:true});
  ctx.motif('sealRound',W*0.86-s/2,H*0.035,s*0.42,{role:'filler',variant:'s0',noOcc:true});
}});

/* Symbol stone: an undressed standing slab, its outline wobbling like the boulder it is,
   with two or three symbols stacked on its face — the Pictish Class I arrangement. */
defStructure('stele',{name:'Symbol stone',blurb:'An undressed standing stone with two or three symbols stacked on its face.',
fn(ctx){
  const {W,H,g,rng}=ctx;const cx=W/2,cy=H*0.52,rx=W*rng.range(0.3,0.36),ry=H*0.45;const kv=Array.from({length:7},()=>rng.range(-1,1));
  const slab=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2,c=Math.cos(a),s=Math.sin(a);const k=1+0.05*(kv[i%7]*0.4+Math.sin(a*3+kv[0]*3)*0.6);
    const sq=Math.sign(c)*Math.pow(Math.abs(c),0.75),sy=Math.sign(s)*Math.pow(Math.abs(s),s>0?0.35:0.9);slab.push([cx+sq*rx*k,cy+sy*ry*k*(s<0?1:0.98)]);}
  ctx.parts([{kind:'region',closed:true,role:'outer',pts:G.chaikin(slab,true,2)}],'ring');
  const pool=rng.shuffle([...new Set([...poolAll(g.motifs.hero),...poolAll(g.motifs.ring)])].filter(k=>k!=='dot'&&SG.motifs[k]));
  const n=Math.min(pool.length,rng.pick([2,2,3]));const top=cy-ry*0.72,bot=cy+ry*0.74,step=(bot-top)/n;
  for(let i=0;i<n;i++)ctx.motif(pool[i],cx+rng.range(-0.04,0.04)*W,top+step*(i+.5),Math.min(rx*1.6,step*1.02),{role:'hero',variant:'st'+i});
}});

/* Bronze mirror: the back of a La Tène mirror laid out with compasses — a rim, a triskele
   at the centre, three roundels holding scrolls, and curved-triangle "trumpet" voids
   between them that take the basketry hatching. */
defStructure('mirror',{name:'Bronze mirror',blurb:'A compass-drawn plate: rim, central triskele, three roundels and hatched trumpet voids between them.',
fn(ctx){
  const {W,H,g,rng}=ctx;const cx=W/2,cy=H/2,R=Math.min(W,H)*0.43;const rot=rng.range(-100,-80);
  ctx.parts([{kind:'line',closed:true,role:'outer',pts:G.circle(cx,cy,R,180)},{kind:'line',closed:true,role:'inner',pts:G.circle(cx,cy,R-14,180)}],'frame');
  const pt=(rr,a)=>[cx+Math.cos(a*DEG)*rr*R,cy+Math.sin(a*DEG)*rr*R];
  const voids=[];const curved=(A,B,c)=>{const m=[(A[0]+B[0])/2,(A[1]+B[1])/2];return G.quad(A,[m[0]+(c[0]-m[0])*0.75,m[1]+(c[1]-m[1])*0.75],B,16);};
  for(let k=0;k<3;k++){const m=rot+k*120+60;const P0=pt(0.86,m),P1=pt(0.37,m-21),P2=pt(0.37,m+21);const c=[(P0[0]+P1[0]+P2[0])/3,(P0[1]+P1[1]+P2[1])/3];
    voids.push({kind:'region',closed:true,role:'outer',pts:G.chain(curved(P0,P1,c),curved(P1,P2,c),curved(P2,P0,c)).slice(0,-1)});
    for(const s of [-1,1]){const Q0=pt(0.9,m+s*44),Q1=pt(0.75,m+s*30),Q2=pt(0.9,m+s*20);const cc=[(Q0[0]+Q1[0]+Q2[0])/3,(Q0[1]+Q1[1]+Q2[1])/3];voids.push({kind:'region',closed:true,role:'inner',pts:G.chain(curved(Q0,Q1,cc),curved(Q1,Q2,cc),curved(Q2,Q0,cc)).slice(0,-1)});}}
  ctx.items.push({type:'parts',parts:voids,role:'ring',variant:'void'});
  const key=ctx.pick('ring');
  for(let k=0;k<3;k++){const a=rot+k*120;const [x,y]=pt(0.57,a);ctx.parts([{kind:'line',closed:true,role:'inner',pts:G.circle(x,y,R*0.27,80)}],'ring');ctx.motif(key,x,y,R*0.46,{role:'ring',rot:a+90,variant:'roundel'});}
  ctx.motif(ctx.pick('hero'),cx,cy,R*0.6,{role:'hero',variant:'hero'});
  const ck=ctx.pick('filler');for(const [x,y] of [[60,60],[W-60,60],[W-60,H-60],[60,H-60]])ctx.motif(ck==='dot'?'spiral':ck,x,y,70,{role:'filler',variant:'corner',noOcc:true});
}});
