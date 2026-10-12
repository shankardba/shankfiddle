'use strict';
/* Treatment renderer: geometry (from structures + motifs) × genes → SVG string.
   Everything stylistic lives here, applied uniformly to every part of the composition,
   so a blended genome produces one coherent artwork rather than a collage. */

function renderArtwork(g,{seed=1,structure=null,W=1000,H=1000}={}){
  const rng=makeRng(seed);const id=svgUid();
  const kinds=Array.isArray(g.structure.kinds)?g.structure.kinds:[g.structure.kinds];
  const skey=structure&&SG.structures[structure]?structure:(kinds.find(k=>SG.structures[k])&&rng.pick(kinds.filter(k=>SG.structures[k])))||'panel';
  const ctx=structCtx(g,rng.fork('struct'),W,H);
  SG.structures[skey].fn(ctx);
  // a tessellated ground (wagara, thunder pattern) laid under everything when the genome carries one
  if((g.ornament.groundTile||0)>0.02&&skey!=='wagara'){const tr=rng.fork('tile');const key=poolPick(g.motifs.tile,tr);
    if(key&&SG.tiles[key]&&tr.next()<g.ornament.groundTile)ctx.items.unshift({type:'parts',parts:tileParts(key,{x0:0,y0:0,x1:W,y1:H},lerp(64,40,clamp(g.structure.density)),tr),role:'frame',variant:'gtile',under:true});}
  const R=new Renderer(g,id,seed);
  const items=ctx.items.filter(i=>i.under).concat(ctx.items.filter(i=>!i.under));
  const geoCache={};
  for(const it of items){
    if(it.type==='parts'){R.emitItem(it.parts,it,1);continue;}
    const M=SG.motifs[it.key];if(!M)continue;if(M.figure){it.figure=true;it.rot=0;if(!M.mirrorOk)it.flip=false;if(M.fine)it.fine=true;}
    const ck=it.key+'|'+it.variant;
    if(!geoCache[ck])geoCache[ck]=M.fn(makeRng(hashStr(seed+'|'+ck)),g);
    // small written signs do not need every spline point
    if(M.glyph&&it.size<64&&!geoCache[ck+'~']){geoCache[ck+'~']=geoCache[ck].map(p=>p.pts&&p.pts.length>20?Object.assign({},p,{pts:p.pts.filter((q,i)=>i%(it.size<34?3:2)===0)}):p);}
    const geo=M.glyph&&it.size<64?geoCache[ck+'~']:geoCache[ck];
    const s=it.size/100;
    const parts=geo.map(p=>p.kind==='dot'
      ?(()=>{const [q]=G.xform([[p.x,p.y]],{x:it.x,y:it.y,s,rot:it.rot,flip:it.flip,sy:it.sy?s*it.sy:undefined});return Object.assign({},p,{x:q[0],y:q[1],r:p.r*s});})()
      :Object.assign({},p,{pts:G.xform(p.pts,{x:it.x,y:it.y,s,rot:it.rot,flip:it.flip,sy:it.sy?s*it.sy:undefined}),srcClosed:p.closed}));
    R.emitItem(parts,it,clamp(0.42+it.size/240,0.5,1));
  }
  return {svg:R.finish(W,H),structure:skey};
}

// figure materials: colours that carry identity are fixed; the rest take the nearest colour the palette has
const FIG_FIXED={pearl:'#f7f2e8',water:'#a9cfe0',skinBlue:'#3f6fb8',skinSaffron:'#e2853a',skinDark:'#44548a',skinAsh:'#d5dbe6',clothYellow:'#e8b62c',eye:'#f7f2e8',tilak:'#f4ecd6',ivory:'#f4ecd6',lip:'#b0362a',moon:'#f4ecd6',bone:'#efe6cf',conch:'#f3ead2'};
const FIG_NEAR={skin:'#e6c094',muzzle:'#f0d2a8',clothRed:'#b5371f',tigerSkin:'#e2a65c',animal:'#e2a65c',halo:'#f0d58a',aureole:'#f0d58a',crown:'#d9a52b',flame:'#e2632a',snake:'#3f7a4b',snakeBelly:'#e9dcae',seat:'#e8939a',seat2:'#c9a24a',seatTop:'#e9dcae',lotus:'#e8939a',stem:'#3f7a4b',leafGreen:'#3f7a4b',wood:'#8a5a2b',steel:'#c9ced6',rock:'#8f8a7d',feather:'#1f7a8c',rope:'#c9a24a',bead:'#7a4a2b',garland:'#e9b53a',sweet:'#f1d38a',held:'#c9a24a'};
const FIG_HATCH={dhoti:1,clothYellow:1,clothRed:1,sash:1,pleat:1,hair:1,seat:1,seat2:1,rock:1,snake:1,skirt:1,bodice:1,wood:1,animal:1,tigerSkin:1,halo:1};
class Renderer{
  constructor(g,id,seed){
    this.g=g;this.id=id;this.seed=seed;this.body=[];this.defs=new Map();
    this.rng=makeRng(hashStr('r'+seed));
    const P=g.palette;this.ink=P.ink;this.ground=P.ground;
    this.L=g.line;this.F=g.fill;this.O=g.ornament;
    this.inkBase=P.ink;this.sc=1;this.seeds=[];this.masks=[];this.dotOn=(g.ornament.dotField||0)>0.02;
  }
  // a palette colour by position, so alternating fields (rafter scrolls, lattice stitches) keep their order
  fillIdx(ci){
    const v=this.g.palette.ciFills||this.g.palette.fills;let arr;
    if(Array.isArray(v))arr=v;else{const side=(hashStr('ci'+ci)%1000)/1000<v.t?1:0;arr=v.pool[side]&&v.pool[side].length?v.pool[side]:v.pool[1-side];}
    arr=(arr||[]).filter(c=>C.dist(c,this.ground)>0.07);
    return arr.length?arr[ci%arr.length]:this.inkBase;
  }
  // colours a dotted row may take: the palette's accents where it has them, otherwise the ink
  dotCol(r,gi){const gm=this.O.gems;return gm&&gm.length&&this.ink===this.inkBase?gm[gi!=null?gi%gm.length:Math.floor(r.next()*gm.length)]:this.ink;}
  // a row of separate round dots laid along a path, the way a dotting stick sets them down
  dotRow(pts,closed,diam,col,r){
    const pitch=diam*(this.O.dotPitch||1.5),S=G.samples(pts,closed,pitch,closed?r.next():0);if(!S.length)return'';
    const d=[['',0.88],['',1],['',1.13]],j=pitch*0.07;
    for(const s of S){const k=d[Math.floor(r.next()*3)];k[0]+=`M${(s.x+r.range(-j,j)).toFixed(1)} ${(s.y+r.range(-j,j)).toFixed(1)}h.01`;}
    return d.filter(k=>k[0]).map(k=>`<path d="${k[0]}" fill="none" stroke="${col}" stroke-width="${(diam*k[1]).toFixed(2)}"/>`).join('');
  }
  // deterministic per (variant, part index) so symmetric copies match
  drng(it,i,tag){return makeRng(hashStr(this.seed+'|'+(it.variant||it.role)+'|'+i+'|'+tag));}
  fillColor(r,avoid,big){
    const v=this.g.palette.fills;let c;
    for(let k=0;k<8;k++){c=poolPick(v,r)||this.ground;if(C.dist(c,this.ground)>0.09&&(!avoid||C.dist(c,avoid)>0.06)&&(!big||C.dist(c,this.ink)>0.12))break;}
    return c;
  }
  nearFill(target){
    const v=poolAll(this.g.palette.fills).filter(c=>C.dist(c,this.ink)>0.12&&C.dist(c,this.ground)>0.05);if(!v.length)return target;
    return v.reduce((b,c)=>C.dist(c,target)<C.dist(b,target)?c:b,v[0]);
  }
  pattern(kind,color,ang,gap){
    const key=kind+color+ang+gap.toFixed(1);if(this.defs.has(key))return this.defs.get(key).pid;
    const pid=this.id+'p'+this.defs.size;const w=this.L.weight;let inner='',tw=gap,th=gap;
    const hw=Math.max(0.6,w*0.42);
    if(kind==='hatch')inner=`<path d="M${gap/2} 0V${gap}" stroke="${color}" stroke-width="${hw}"/>`;
    else if(kind==='crosshatch')inner=`<path d="M${gap/2} 0V${gap}M0 ${gap/2}H${gap}" stroke="${color}" stroke-width="${hw*0.85}"/>`;
    else if(kind==='dots'){const dr=Math.max(1.1,gap*0.19);inner=`<circle cx="${gap/4}" cy="${gap/4}" r="${dr.toFixed(2)}" fill="${color}"/><circle cx="${gap*0.75}" cy="${gap*0.75}" r="${dr.toFixed(2)}" fill="${color}"/>`;}
    else if(kind==='dashes'){tw=gap*1.6;inner=`<path d="M${gap*0.2} ${gap*0.3}h${gap*0.6}M${gap*1.0} ${gap*0.8}h${gap*0.6}" stroke="${color}" stroke-width="${Math.max(1.1,gap*0.16).toFixed(2)}" stroke-linecap="round"/>`;}
    else if(kind==='rarrk'){ // bands of fine cross-hatching, the direction turning from band to band
      const [cA,cB,cD]=color.split('|'),n=4,b=gap*n;tw=2*b;th=b;const lw=Math.max(0.6,gap*0.34).toFixed(2);const d=['',''];
      for(let k=-n;k<=n;k++){const o=k*gap;d[((k%2)+2)%2]+=`M0 ${o}L${b} ${o+b}L${2*b} ${o}`;}
      inner=`<path d="${d[0]}" fill="none" stroke="${cA}" stroke-width="${lw}" stroke-linejoin="miter"/><path d="${d[1]}" fill="none" stroke="${cB}" stroke-width="${lw}" stroke-linejoin="miter"/><path d="M0 0V${b}M${b} 0V${b}" stroke="${cD}" stroke-width="${(gap*0.3).toFixed(2)}"/>`;}
    else if(kind==='stitch'){tw=gap*1.8;inner=`<path d="M${gap*0.15} ${gap/2}h${gap*0.95}" stroke="${color}" stroke-width="${hw*1.1}" stroke-linecap="round"/>`;}
    this.defs.set(key,{pid,svg:`<pattern id="${pid}" patternUnits="userSpaceOnUse" width="${tw.toFixed(2)}" height="${th.toFixed(2)}" patternTransform="rotate(${ang})">${inner}</pattern>`});
    return pid;
  }
  gold(){
    const key='gold';if(this.defs.has(key))return this.defs.get(key).pid;
    const m=this.g.palette.metal||'#c99a2e';const pid=this.id+'gold';
    this.defs.set(key,{pid,svg:`<linearGradient id="${pid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.shade(m,0.14)}"/><stop offset=".45" stop-color="${m}"/><stop offset="1" stop-color="${C.shade(m,-0.16)}"/></linearGradient>`});
    return pid;
  }
  strokeAttrs(w,dash){
    let a=`fill="none" stroke="${this.ink}" stroke-width="${w.toFixed(2)}"`;
    if(dash==='stitch')a+=` stroke-dasharray="${(w*2.6).toFixed(1)} ${(w*1.9).toFixed(1)}"`;
    else if(dash==='dotted')a+=` stroke-dasharray="0.1 ${(w*2.4).toFixed(1)}"`;
    else if(dash==='dashed')a+=` stroke-dasharray="${(w*3).toFixed(1)} ${(w*2.2).toFixed(1)}"`;
    return a;
  }
  // carved relief: positive = raised (light from the upper left), negative = sunk
  reliefEdge(d,w,region){
    const rel=this.O.relief,a=Math.min(1,Math.abs(rel)*1.15),k=(Math.max(1.1,w*0.6)+(region?0.5:0))*(rel>0?1:-1);
    const lo=C.shade(this.ground,-0.34),hi=C.shade(this.ground,0.2),sw=(w*(region?1.5:1.25)).toFixed(2);
    return `<path d="${d}" fill="none" stroke="${lo}" stroke-width="${sw}" transform="translate(${k.toFixed(2)} ${k.toFixed(2)})" opacity="${a.toFixed(2)}"/><path d="${d}" fill="none" stroke="${hi}" stroke-width="${sw}" transform="translate(${(-k).toFixed(2)} ${(-k).toFixed(2)})" opacity="${a.toFixed(2)}"/>`;
  }
  // stroke a polyline honouring double-line, breaks, taper and stitch genes
  strokePath(pts,closed,w,r,gapColor,{allowTaper=false,gi=null}={}){
    const L=this.L;const out=[];
    if(allowTaper&&!closed&&L.taper>0.02&&r.next()<L.taper*1.15&&pts.length>3){
      const k=1+L.taper*0.9;const rib=G.ribbon(pts,t=>w*0.5*k*Math.pow(Math.sin(Math.PI*clamp(t,0.02,0.98)),0.55));
      out.push(`<path d="${dPath(rib,true)}" fill="${this.ink}"/>`);return out.join('');
    }
    if((L.dotted||0)>0.02&&r.next()<L.dotted)return this.dotRow(pts,closed,Math.max(w*1.7,(this.O.dotSize||0)*this.sc*0.92),this.dotCol(r,gi),r);
    let segs=[[pts,closed]];
    const plen=G.length(pts,closed);
    if((L.bridges||0)>0.02&&plen>w*14){
      const n=closed?2+Math.round(L.bridges*2):Math.floor(plen/150*L.bridges);const gap=Math.max(3,w*1.5)/plen;
      if(n>=1){const f0=r.next()/n;segs=[];const cuts=[];for(let k=0;k<n;k++)cuts.push(f0+k/n);
        if(closed){for(let k=0;k<n;k++){const a=cuts[k]+gap/2,b=(k<n-1?cuts[k+1]:cuts[0]+1)-gap/2;if(b>a)segs.push([G.sub(pts,true,a,b),false]);}}
        else{let a=0;for(const c of cuts){if(c-gap/2>a)segs.push([G.sub(pts,false,a,c-gap/2),false]);a=c+gap/2;}if(a<1)segs.push([G.sub(pts,false,a,1),false]);}}
    }
    else if(closed&&L.breaks>0.02&&r.next()<L.breaks&&G.length(pts,true)>60){const f0=r.next(),gap=r.range(0.05,0.09);segs=[[G.sub(pts,true,f0+gap,f0+1),false]];}
    else if(!closed&&L.breaks>0.02&&r.next()<L.breaks*0.6&&G.length(pts,false)>90){const f=r.range(0.3,0.7);segs=[[G.sub(pts,false,0,f-0.04),false],[G.sub(pts,false,f+0.04,1),false]];}
    for(const [p,c] of segs){
      const d=dPath(p,c);
      if(L.double){
        out.push(`<path d="${d}" fill="none" stroke="${this.ink}" stroke-width="${(w*2.9).toFixed(2)}"/>`);
        out.push(`<path d="${d}" fill="none" stroke="${gapColor||this.ground}" stroke-width="${(w*1.05).toFixed(2)}"/>`);
      }else out.push(`<path d="${d}" ${this.strokeAttrs(w,L.dash)}/>`);
    }
    return out.join('');
  }
  // pressure-modulated brush stroke as a filled ribbon, with dry-brush ("flying white") streaks
  brush(pts,closed,w,r,profile){
    let P=closed?pts.concat([pts[0]]):pts;
    P=G.resample(P,false,Math.max(1.4,w*0.3));if(P.length<3)return'';
    const ph1=r.range(0,6.28),ph2=r.range(0,6.28),f1=r.range(1.1,2.4),f2=r.range(3,6),ph3=r.range(0,1);
    const noise=t=>1+0.1*Math.sin(t*f1*6.283+ph1)+0.05*Math.sin(t*f2*6.283+ph2);
    const prof=profile||r.pick(['tail','swell','tail']);
    const F={
      even:t=>t<0.05?0.72+0.28*t/0.05:t>0.93?1-0.55*(t-0.93)/0.07:1,
      tail:t=>t<0.05?0.8+0.2*t/0.05:t<0.32?1:0.03+0.97*Math.pow(1-(t-0.32)/0.68,1.25),
      wedge:t=>Math.max(0.07,1.3-1.15*Math.pow(t,0.75)),
      rise:t=>Math.max(0.03,Math.pow(t,0.85)),
      swell:t=>0.28+0.72*Math.sin(Math.PI*t),
      loop:t=>(0.5-0.34*(this.L.taper||0))+(0.5+0.34*(this.L.taper||0))*Math.pow(Math.sin(Math.PI*(t*2+ph3)),2)
    }[prof]||(t=>1);
    const hw=t=>Math.max(0.25,w*0.5*F(t)*noise(t));
    let s=`<path d="${dPath(G.ribbon(P,hw),true)}" fill="${this.ink}"/>`;
    if(prof==='even'||prof==='tail')s+=`<circle cx="${P[0][0].toFixed(1)}" cy="${P[0][1].toFixed(1)}" r="${hw(0).toFixed(2)}" fill="${this.ink}"/>`;
    const dry=this.L.dry||0;const len=G.length(P,false);
    if(dry>0.02&&w>3.2&&len>40){
      const n=Math.round(dry*r.range(2,6.5));const cum=[0];for(let i=1;i<P.length;i++)cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
      for(let k=0;k<n;k++){
        const off=r.range(-0.78,0.78),t0=prof==='rise'?r.range(0,0.3):r.range(0.18,0.75),t1=Math.min(1,t0+r.range(0.2,0.6));const q=[];
        for(let i=1;i<P.length-1;i++){const t=cum[i]/len;if(t<t0||t>t1)continue;const a=P[i-1],b=P[i+1];let tx=b[0]-a[0],ty=b[1]-a[1];const l=Math.hypot(tx,ty)||1;q.push([P[i][0]-ty/l*off*hw(t),P[i][1]+tx/l*off*hw(t)]);}
        if(q.length>2)s+=`<path d="${dPath(q,false)}" fill="none" stroke="${this.ground}" stroke-width="${clamp(w*r.range(0.04,0.1),0.5,2.4).toFixed(2)}" stroke-dasharray="${r.range(6,28).toFixed(0)} ${r.range(2,7).toFixed(0)}" stroke-linecap="round"/>`;
      }
    }
    return s;
  }
  emitItem(parts,it,sizeK){
    const L=this.L,F=this.F,O=this.O,g=this.g;const out=[];
    // finely drawn figures: drop detail the pen is too broad for
    if(it.fine){const sc=(it.size||100)/Math.max(1,L.weight);parts=parts.filter(p=>!p.lod||sc>=MK.LOD[p.lod]);}
    const wob=L.wobble*3.2*Math.max(0.5,sizeK);
    const wr=makeRng(hashStr(this.seed+'w'+this.body.length));
    const misreg=(L.misreg||0)>0.02;const mx=(L.misreg||0)*3.2,my=(L.misreg||0)*2.4;
    // knockout (positive/negative): silhouettes solid ink, interior marks cut out in ground colour
    // pen-written script: small signs set down as solid ink, a few groups in the accent (rubric) colour
    const pen=!!it.pen&&(F.penScript||0)>0.02&&this.drng(it,-3,'pen').next()<F.penScript;const ink0=this.ink;if(pen&&it.rubric)this.ink=g.palette.accent||this.ink;
    const poly=poolAll(g.palette.fills).length>=3;
    let knock=pen||((F.knockout||0)>0.02&&(it.type==='motif'||it.knockOk)&&this.drng(it,-1,'k').next()<F.knockout);
    if(it.fine&&!knock&&!poly){const fm=this.drng(it,-2,'fm').next()<F.coverage?makeRng(hashStr(it.variant+'fm')).weighted(F.modes)||'none':'none';if(fm==='flat')knock=true;}
    const holes=knock?parts.filter(p=>p.kind==='region'&&p.role!=='outer').map(p=>p.pts):[];
    const inkSave=this.ink;
    const figMode=it.figure&&!knock?(this.drng(it,-2,'fm').next()<F.coverage?makeRng(hashStr(it.variant+'fm')).weighted(F.modes)||'none':'none'):null;
    parts.forEach((p,i)=>{this.ink=inkSave;
      let r=this.drng(it,i,'f');
      if(p.tone!=null)r=this.drng(it,'t'+p.tone,'f'); // parts of one strand or tile class share colour and treatment
      if(it.figure&&p.kind==='region'){const c=G.bbox(p.pts);r=this.drng(it,p.role+'|'+Math.round(Math.abs(c.cx-it.x)/4)+'|'+Math.round(c.cy/4),'f');}
      const roleK=p.role==='outer'?1:p.role==='inner'?1-0.42*L.contrast:(1-0.6*L.contrast)*0.86;
      const w=it.fine?Math.max(0.38,L.weight*sizeK*0.72*(p.role==='outer'?1:p.role==='inner'?0.7:0.48)*(p.wk||1)):Math.max(0.55,L.weight*roleK*sizeK);
      if(p.kind==='dot'&&knock){out.push(`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${Math.max(0.8,p.r).toFixed(2)}" fill="${holes.some(h=>G.inside(p.x,p.y,h))||p.role==='outer'?inkSave:this.ground}"/>`);return;}
      if(p.kind==='dot'){
        const gem=O.gems&&O.gems.length&&r.next()<0.5?O.gems[Math.floor(r.next()*O.gems.length)]:this.ink;
        out.push(`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${Math.max(0.8,p.r).toFixed(2)}" fill="${gem}"/>`);return;
      }
      let pts=p.pts;const closed=!!p.closed;
      // seals are stamped, not drawn: accent fill and carved knock-out marks, whatever the genes
      if(p.ci!=null&&!knock&&p.kind==='line')this.ink=this.fillIdx(p.ci);
      if(p.paint==='ink'){out.push(`<path d="${dPath(pts,true)}" fill="${knock?this.ground:inkSave}"/>`);return;}
      if(p.paint==='accent'){out.push(`<path d="${dPath(pts,true)}" fill="${g.palette.accent||'#c0392b'}" opacity=".93"/>`);return;}
      if(p.paint==='knock'){out.push(`<path d="${dPath(pts,closed)}" fill="none" stroke="${this.ground}" stroke-width="${((p.kw||3)*(it.size||100)/100).toFixed(2)}" stroke-linecap="square"/>`);return;}
      if(wob>0.05)pts=G.wobble(pts,closed,it.fine?wob*0.3:wob,wr);
      const brushOn=(L.brush||0)>0.02&&r.next()<L.brush;
      if(p.kind==='line'){
        if(this.dotOn&&!it.under&&!p.noSeed&&(p.role!=='detail'||it.type==='parts'))this.seeds.push({pts,closed,gid:this.body.length});
        if(knock&&p.role!=='outer')this.ink=this.ground;
        // a line drawn over a solid band shows in the ground colour, unless it is dotted in the palette's accents
        if(p.onSolid&&!knock&&!((L.dotted||0)>0.5&&O.gems&&O.gems.length))this.ink=this.ground;
        if(brushOn){const bw=p.bw||(it.fine?w*2.3:L.weight*roleK*(p.wmul||1)*clamp((it.size||320)/320,0.45,2.4)*1.6);out.push(this.brush(pts,closed,bw,r,p.profile));return;}
        const gapC=L.double?this.ground:null;
        if(Math.abs(O.relief||0)>0.02)out.push(this.reliefEdge(dPath(pts,closed),w,false));
        out.push(this.strokePath(pts,closed,w,r,gapC,{allowTaper:true,gi:p.gi}));return;
      }
      // ---- region ----
      let mode=knock?'knock':figMode?figMode:p.forceFill||(r.next()<F.coverage?(makeRng(r.next()*1e9).weighted(F.modes)||'none'):'none');
      if(p.role==='detail'&&mode!=='none'&&mode!=='flat'&&mode!=='gold')mode='flat';
      const ciOn=p.ci!=null&&!knock&&F.coverage>0.02; // positional colour, wherever the tradition fills at all
      if(ciOn)mode='flat';else if(p.ci!=null&&!knock)mode='none';
      const d=dPath(pts,true);const bb0=G.bbox(pts);const isBig=bb0.w*bb0.h>26000;
      let base=this.ground,ov=null;
      if(mode==='flat'||mode==='dots'||mode==='dashes')base=this.fillColor(r,null,isBig);
      if(mode==='hatch'||mode==='crosshatch'){base=r.next()<0.35?this.fillColor(r):this.ground;}
      if(ciOn)base=this.fillIdx(p.ci);
      if(p.bg&&!knock){mode='none';base=this.ground;}
      if(p.solid&&!knock){mode='flat';base=inkSave;}
      // rarrk: the palest pigment laid first, then fine hatching in two others over it
      let rk=null;if(mode==='rarrk'){const fs=poolAll(g.palette.fills).filter(c=>C.dist(c,this.ground)>0.06).sort((a,b)=>C.L(b)-C.L(a));
        if(fs.length<2){mode='crosshatch';}else{base=fs[0];const o=fs.slice(1);rk=[o[Math.floor(r.next()*o.length)],o[Math.floor(r.next()*o.length)],C.L(inkSave)<C.L(base)?inkSave:o[o.length-1]];if(rk[0]===rk[1]&&o.length>1)rk[1]=o[(o.indexOf(rk[0])+1)%o.length];}}
      if(mode==='stitch')base=this.ground;
      if(mode==='gold')base=`url(#${this.gold()})`;
      if(mode==='knock')base=p.role==='outer'?inkSave:this.ground;
      // figure materials: in coloured registers skin, cloth, metal and so on take their own colours
      // only in polychrome palettes: one-ink registers (silhouette, brush mark) keep their single ink
      if(it.fine&&p.mat&&!knock&&(mode==='hatch'||mode==='crosshatch'||mode==='stitch'||mode==='rarrk')&&!FIG_HATCH[p.mat]){mode='none';base=this.ground;rk=null;}
      if(it.fine&&p.mat&&poly&&(mode==='flat'||mode==='gold'||mode==='dots'||mode==='dashes')){
        const P2=g.palette,m=p.mat,mr=this.drng(it,'mat'+m,'c');
        if(m==='metal'||((m==='halo'||m==='crown'||m==='aureole')&&P2.metal)){if(P2.metal||mode==='gold'){mode='gold';base=`url(#${this.gold()})`;}else{mode='flat';base=this.nearFill('#d9a52b');}}
        else if(P2[m]){mode='flat';base=P2[m];}
        else if(FIG_FIXED[m]){mode='flat';base=FIG_FIXED[m];}
        else if(m==='hair'){mode='flat';base=P2.hair||inkSave;}
        else if(m==='gem'){mode='flat';base=O.gems&&O.gems.length?O.gems[Math.floor(r.next()*O.gems.length)]:this.fillColor(r,null,true);}
        else if(m==='skin'||m==='muzzle'){mode='flat';const c=this.nearFill(FIG_NEAR[m]);base=C.L(c)>0.62&&C.dist(c,FIG_NEAR[m])<0.2?c:FIG_NEAR[m];}
        else if(FIG_NEAR[m]){mode='flat';base=this.nearFill(FIG_NEAR[m]);}
        else{if(mode==='gold')mode='flat';base=this.fillColor(mr,P2.skin||FIG_NEAR.skin,true);}
      }else
      if(it.figure&&p.mat&&poly&&(mode==='flat'||mode==='gold'||mode==='dots'||mode==='dashes')){
        const P2=g.palette,mr=this.drng(it,'mat'+p.mat,'c');
        if(p.mat==='metal'&&(P2.metal||mode==='gold')){mode='gold';base=`url(#${this.gold()})`;}
        else if(p.mat==='skin'&&P2.skin){mode='flat';base=P2.skin;}
        else if(p.mat==='skinPale'&&(P2.skinPale||P2.skin)){mode='flat';base=P2.skinPale||C.mix(P2.skin,'#f3dfae',0.6);}
        else if(p.mat==='sun'){mode='flat';base=P2.sun||P2.accent||'#b8402a';}
        else if(p.mat==='skinBlue'){mode='flat';base=P2.skinBlue||'#3f6fb8';}
        else if(p.mat==='skinSaffron'){mode='flat';base=P2.skinSaffron||'#e2853a';}
        else if(p.mat==='clothYellow'){mode='flat';base=P2.clothYellow||'#e8b62c';}
        else if(p.mat==='hair'){mode='flat';base=P2.hair||inkSave;}
        else if(p.mat==='eye'){mode='flat';base=P2.eyeWhite||'#f7f2e8';}
        else if(p.mat==='ivory'){mode='flat';base='#f4ecd6';}
        else if(p.mat==='sweet'){mode='flat';base='#f1d38a';}
        else if(p.mat==='snake'){mode='flat';base=P2.snake||'#3f7a4b';}
        else if(p.mat==='muzzle'){mode='flat';base=P2.skin||'#efc79a';}
        else if(p.mat==='seat'&&P2.seat){mode='flat';base=P2.seat;}
        else if(p.mat==='animal'&&P2.animal){mode='flat';base=P2.animal;}
        else if(P2[p.mat]&&typeof P2[p.mat]==='string'&&P2[p.mat][0]==='#'){mode='flat';base=P2[p.mat];}
        else{if(mode==='gold')mode='flat';base=this.fillColor(mr,P2.skin,isBig);for(let k=0;k<6&&P2.skinPale&&C.dist(base,P2.skinPale)<0.09;k++)base=this.fillColor(mr,P2.skin,isBig);}
      }
      if(Math.abs(O.relief||0)>0.02)out.push(this.reliefEdge(d,w,true));
      if(this.dotOn&&!it.under&&!p.noSeed){const solid=base!==this.ground||it.figure;
        if(p.role==='outer'||(it.type==='parts'&&p.role!=='detail'))this.seeds.push({pts,closed:true,gid:this.body.length});
        if(solid&&(p.role==='outer'||it.type==='parts'))this.masks.push(pts);}
      out.push(`<path d="${d}" fill="${base}"/>`);
      const gapPx=Math.max(3.2,(F.hatchGap||6));
      if(mode==='hatch'||mode==='crosshatch'){const ang=[45,135,90,0][i%4];const c=base!==this.ground&&C.L(base)<0.45?this.ground:this.ink;ov=this.pattern(mode,c,ang,gapPx);}
      else if(mode==='dots'||mode==='dashes'){const c=C.L(base)<0.5?C.mix(this.ground,'#ffffff',0.4):this.ink;ov=this.pattern(mode,c,[0,30,60,90][i%4],gapPx*1.45);}
      else if(mode==='stitch'){const c=this.fillColor(r);ov=this.pattern('stitch',c,[0,90,45,135][i%4],gapPx);}
      else if(mode==='rarrk'&&rk){ov=this.pattern('rarrk',rk.join('|'),(bb0.w>=bb0.h?0:90)+[0,0,90,0][i%4],Math.max(3.4,gapPx));}
      if(ov)out.push(`<path d="${d}" fill="url(#${ov})"/>`);
      if(p.ns||(p.bg&&!knock&&F.coverage>0.02)){this.ink=inkSave;return;} // fill only: hides the joins between overlapping forms; a scroll left in the ground colour needs no outline where the fields around it are painted
      const bb=G.bbox(pts);const big=Math.min(bb.w,bb.h);
      if(mode==='gold'&&big>18&&!it.fine){const inner=G.offset(pts,-Math.max(4,w*1.6),true);for(const s of G.samples(inner,true,7.5))out.push(`<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${(1.25+w*0.18).toFixed(2)}" fill="${C.shade(g.palette.metal||'#c99a2e',0.2)}"/>`);}
      // echo lines: inner copies of the contour
      if(knock&&p.role==='outer')this.ink=this.ground;
      if(!it.figure&&!p.plain&&O.echo>0.02&&big>16&&p.role!=='detail'&&r.next()<O.echo){
        // round-ish shapes: concentric scaled copies; long or straight-sided shapes: true inward offset
        const n=Math.max(1,Math.min(4,Math.round(O.echoCount||2)));const c=G.centroid(pts);const gapE=4+L.weight*1.6;
        const longish=Math.max(bb.w,bb.h)/Math.max(1,big)>2.2||pts.length<=8;
        for(let k=1;k<=n;k++){
          let e;
          if(longish){if(k*gapE>big*0.32)break;e=G.offset(pts,-k*gapE,true);}
          else{const kk=1-k*gapE/(big/2);if(kk<0.25)break;e=G.scaleAbout(pts,c,kk);}
          out.push(`<path d="${dPath(e,true)}" ${this.strokeAttrs(w*0.7,O.echoStyle==='solid'?null:O.echoStyle)}/>`);
        }
      }
      this.ink=inkSave;
      // outline
      const gapC=L.double?(g.palette.gap==='auto'?this.fillColor(r,base):(g.palette.gap||this.ground)):null;
      // brush outlines: closed loops, or — with the breaks gene — open strokes that taper at the gap
      if(knock&&it.fine&&p.role==='outer')this.ink=this.ground;
      const openBrush=brushOn&&L.breaks>0.02&&r.next()<L.breaks;
      let strokeSvg=brushOn?(openBrush?(()=>{const f0=r.next(),gp=r.range(0.08,0.18);return this.brush(G.sub(pts,true,f0+gp,f0+1),false,w*1.3,r,'swell');})():this.brush(pts,true,w*1.15,r,'loop')):this.strokePath(pts,true,w,r,gapC);
      if(misreg)strokeSvg=`<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)})">${strokeSvg}</g>`;
      out.push(strokeSvg);this.ink=inkSave;
      // ornament on silhouettes of hero / ring motifs
      if(!it.figure&&!p.plain&&p.role==='outer'&&(it.role==='hero'||it.role==='ring')&&big>22){
        if(O.dotRows>0.02&&r.next()<O.dotRows){
          const ds=(O.dotSize||0)*this.sc;const rad=ds?ds*0.5:Math.max(1.1,0.9+L.weight*0.45);const off=G.offset(pts,ds?w*0.5+rad*1.7+1:w*1.5+4.5,true);
          for(const s of G.samples(off,true,ds?rad*2*(O.dotPitch||1.5):rad*4.2)){const col=O.gems&&O.gems.length?O.gems[Math.floor(r.next()*O.gems.length)]:this.ink;out.push(`<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${rad.toFixed(2)}" fill="${col}"/>`);}
        }
        if(O.scallops>0.02&&r.next()<O.scallops*0.7){
          const off=G.offset(pts,w+2,true);const S=G.samples(off,true,9);let dd='';
          for(let k=0;k<S.length;k++){const a=S[k],b=S[(k+1)%S.length];const mx2=(a.x+b.x)/2+a.ty*4.2,my2=(a.y+b.y)/2-a.tx*4.2;dd+=`M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${mx2.toFixed(1)} ${my2.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;}
          out.push(`<path d="${dd}" ${this.strokeAttrs(w*0.7)}/>`);
        }
      }
    });
    // radiating rays behind a hero (sunburst halos of devotional clipart)
    if(it.role==='hero'&&it.type==='motif'&&(O.rays||0)>0.02&&this.rng.next()<O.rays){
      const n=24,r0=it.size*0.6,r1=it.size*0.82;let d='';for(let k=0;k<n;k++){const a=(k+0.5)/n*Math.PI*2-Math.PI/2;if(Math.sin(a)>0.55)continue;const rr=k%2?r1*0.86:r1;d+=`M${(it.x+Math.cos(a)*r0).toFixed(1)} ${(it.y+Math.sin(a)*r0).toFixed(1)}L${(it.x+Math.cos(a)*rr).toFixed(1)} ${(it.y+Math.sin(a)*rr).toFixed(1)}`;}
      out.push(`<path d="${d}" ${this.strokeAttrs(Math.max(1,L.weight*0.6),null)}/>`);
    }
    // a small accent mark (tilak) — the one touch of colour in devotional brush marks
    if(it.role==='hero'&&it.type==='motif'&&(O.accentDots||0)>0.02&&this.rng.next()<O.accentDots){
      const tx=it.x+this.rng.range(-0.06,0.06)*it.size,ty=it.y-it.size*this.rng.range(0.1,0.3);
      out.push(`<path d="${dPath(G.xform(G.teardrop(it.size*0.022,it.size*0.075),{x:tx,y:ty}),true)}" fill="${g.palette.accent||'#d9431e'}"/>`);
    }
    // glow arcs around the hero (festive icon register)
    if(it.role==='hero'&&it.type==='motif'&&O.halo>0.02&&this.rng.next()<O.halo){
      const R0=it.size*0.5;let s='';
      for(let k=0;k<2;k++){const rr=R0+k*8,a0=-138+this.rng.range(-10,6),a1=-42+this.rng.range(-6,10);s+=`<path d="${dPath(G.arc(it.x,it.y,rr,a0,a1,30),false)}" ${this.strokeAttrs(L.weight*0.8,null)}/>`;}
      out.push(s);
    }
    this.ink=ink0;this.body.push(out.join(''));
  }
  groundLayer(W,H){
    const g=this.g,O=this.O;let s=`<rect width="${W}" height="${H}" fill="${this.ground}"/>`;
    if(O.groundStitch){
      const c=C.mix(this.ground,this.ink,0.22);let d='';
      for(let y=14;y<H;y+=11){let row=`M0 ${y}`;for(let x=0;x<=W;x+=25)row+=`L${x} ${(y+Math.sin(x/90+y/40)*2.2).toFixed(1)}`;d+=row;}
      s+=`<path d="${d}" fill="none" stroke="${c}" stroke-width="1.3" stroke-dasharray="6 5"/>`;
    }
    return s;
  }
  textureLayer(W,H){
    const t=this.g.ground;if(!t||t.kind==='none'||t.amount<0.03)return'';
    const presets={paper:[0.9,3,0.012],mud:[0.55,4,0.008],cloth:[1.4,2,0.02],powder:[1.8,2,0.004],plaster:[0.45,4,0.006],stone:[0.7,4,0.01],canvas:[1.2,2,0.015],board:[0.8,2,0.01],metal:[0.35,3,0.02],porcelain:[0.6,2,0.003],papyrus:[0.9,3,0.012]};
    let [bf,oct,blot]=presets[t.kind]||presets.paper;if(t.kind==='wood'){bf='0.004 0.13';oct=3;blot=0.01;}const fid=this.id+'tx';const seed=(this.seed%997)+1;
    this.defs.set('tex',{pid:fid,svg:`<filter id="${fid}a" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${bf}" numOctaves="${oct}" seed="${seed}"/><feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.07  0 0 0 0 0.04  2.4 0 0 0 -1.05"/></filter>`+
      `<filter id="${fid}b" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${blot}" numOctaves="3" seed="${seed+7}"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.97  0 0 0 0 0.9  0 2.6 0 0 -1.2"/></filter>`+
      (t.kind==='cloth'||t.kind==='canvas'?`<pattern id="${fid}w" patternUnits="userSpaceOnUse" width="4" height="4"><path d="M0 .5H4M.5 0V4" stroke="#000" stroke-opacity=".5" stroke-width=".6"/></pattern>`:'')+
      (t.kind==='papyrus'?`<pattern id="${fid}w" patternUnits="userSpaceOnUse" width="13" height="11"><path d="M0 2H13M0 7.5H13" stroke="#5a4a22" stroke-opacity=".55" stroke-width="1.1"/><path d="M3 0V11M9.5 0V11" stroke="#5a4a22" stroke-opacity=".4" stroke-width=".8"/></pattern>`:'')});
    const a=clamp(t.amount);
    return `<g pointer-events="none"><rect width="${W}" height="${H}" filter="url(#${fid}a)" opacity="${(0.32*a).toFixed(2)}"/><rect width="${W}" height="${H}" filter="url(#${fid}b)" opacity="${(0.22*a).toFixed(2)}"/>`+
      (t.kind==='cloth'||t.kind==='canvas'||t.kind==='papyrus'?`<rect width="${W}" height="${H}" fill="url(#${fid}w)" opacity="${((t.kind==='papyrus'?0.2:0.12)*a).toFixed(2)}"/>`:'')+`</g>`;
  }
  finish(W,H){
    const ground=this.groundLayer(W,H)+(this.dotOn?dotFieldSvg(this,W,H):'');const tex=this.textureLayer(W,H);
    const defs=[...this.defs.values()].map(d=>d.svg).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${ground}<g stroke-linecap="round" stroke-linejoin="round">${this.body.join('')}</g>${tex}</svg>`;
  }
}

// one motif drawn in a tradition's hand, centred on its ground
function renderMotifSpecimen(g,key,seed=3,size=220){
  const R=new Renderer(g,svgUid(),seed);const M=SG.motifs[key];R.sc=clamp(size/520,0.42,1);
  const k=size*0.0073;
  const parts=M.fn(makeRng(hashStr('m'+key+seed)),g).map(p=>p.kind==='dot'?Object.assign({},p,{x:p.x*k+size/2,y:p.y*k+size/2,r:p.r*k}):Object.assign({},p,{pts:G.xform(p.pts,{x:size/2,y:size/2,s:k})}));
  R.emitItem(parts,{role:'hero',variant:'spec'+key,type:'parts',size:100*k,figure:!!M.figure,fine:!!M.fine},0.95);
  return R.finish(size,size);
}

// one all-over repeat in a tradition's hand, filling its swatch
function renderTileSpecimen(g,key,seed=3,size=220){
  const R=new Renderer(g,svgUid(),seed);
  R.emitItem(tileParts(key,{x0:0,y0:0,x1:size,y1:size},size/5.2,makeRng(hashStr('t'+key+seed))),{role:'frame',variant:'spec'+key,type:'parts',size:100},0.8);
  return R.finish(size,size);
}
