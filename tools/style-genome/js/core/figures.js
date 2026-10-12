'use strict';
/* Figure kit — the drawing vocabulary of Indian devotional figures, built from smooth
   splines rather than primitives: tapering limbs, mudrā hands, lotus-petal eyes, the
   three neck lines, tiered kirīṭa crowns, bead-string jewellery, garlands, pleated
   drapery and double-contoured lotus seats. Original constructions (not traced), drawn
   in a frame where a seated figure is ~120 units tall. Parts carry `mat` tags so coloured
   registers paint skin, cloth and gold separately; line registers ignore them. */

const FK={};
// centripetal-ish Catmull-Rom through hand-placed points
FK.spline=(pts,closed=false,seg=8)=>{
  const n=pts.length;if(n<3)return pts.slice();const P=closed?[pts[n-1],...pts,pts[0],pts[1]]:[pts[0],...pts,pts[n-1]];const out=[];
  for(let i=1;i<P.length-2;i++){const [p0,p1,p2,p3]=[P[i-1],P[i],P[i+1],P[i+2]];
    for(let k=0;k<seg;k++){const t=k/seg,t2=t*t,t3=t2*t;out.push([0,1].map(j=>0.5*(2*p1[j]+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)));}}
  if(!closed)out.push(pts[n-1]);return out;};
// tapered tube with round caps around a centreline: w(t) is the half-width
FK.tube=(path,w)=>{const p=G.resample(path,false,Math.max(0.35,G.length(path,false)/60));if(p.length<2)return p;
  const L=[],R=[],n=p.length;let acc=0;const tot=G.length(p,false)||1;
  for(let i=0;i<n;i++){if(i)acc+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);const a=p[Math.max(0,i-1)],b=p[Math.min(n-1,i+1)];let tx=b[0]-a[0],ty=b[1]-a[1];const l=Math.hypot(tx,ty)||1;tx/=l;ty/=l;const hw=w(acc/tot);
    L.push([p[i][0]-ty*hw,p[i][1]+tx*hw]);R.push([p[i][0]+ty*hw,p[i][1]-tx*hw]);}
  const cap=(c,from,to)=>{const a0=Math.atan2(from[1]-c[1],from[0]-c[0]),a1=Math.atan2(to[1]-c[1],to[0]-c[0]);let d=a1-a0;if(d>0)d-=Math.PI*2;const r=Math.hypot(from[0]-c[0],from[1]-c[1]),o=[];for(let k=1;k<8;k++){const a=a0+d*k/8;o.push([c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r]);}return o;};
  return L.concat(cap(p[n-1],L[n-1],R[n-1]),R.slice().reverse(),cap(p[0],R[0],L[0]));};
FK.m=(p,mat)=>Object.assign(p,{mat});
// bead string along a curve
FK.beads=(P,path,gap,r,role='detail')=>{for(const s of G.samples(path,false,gap))P.push(dt(s.x,s.y,r,role));};
FK.T=(pts,o)=>G.xform(pts,o);

/* hands — local frame: wrist at (0,0), fingers toward −y, ~8 units long */
FK.hand=(P,kind,x,y,rot,s=1)=>{const X=pts=>G.xform(pts,{x,y,rot,s});const M=p=>FK.m(p,'skin');
  if(kind==='abhaya'||kind==='varada'){
    const fx=[-1.9,-0.65,0.65,1.85],fl=[4.6,5.4,5.1,4],fa=[-7,-2,2,7];
    fx.forEach((f,i)=>{const base=[f,-3.2],tip=[f+Math.sin(fa[i]*DEG)*fl[i],-3.2-fl[i]];P.push(M(reg(X(FK.tube([base,[(base[0]+tip[0])/2,(base[1]+tip[1])/2-0.2],tip],t=>0.62-0.1*t)),'outer')));});
    P.push(M(reg(X(FK.tube([[-2.4,-1],[-3.8,-2.6],[-4.9,-4.6]],t=>0.72-0.12*t)),'outer')));
    P.push(M(reg(X(FK.spline([[-2.6,0.6],[-2.9,-1.8],[-1.6,-3.6],[1,-3.7],[2.6,-2.6],[2.6,-0.2],[1.6,1],[-1,1.2]],true,6)),'outer')));
    P.push(ln(X(FK.spline([[-1.6,-2.2],[0,-1.4],[1.8,-2]],false,6)),'detail'));P.push(dt(...X([[0.1,-0.6]])[0],0.42,'detail'));
  }else{ // closed hand holding an attribute
    P.push(M(reg(X(FK.spline([[-2.4,0.6],[-2.8,-1.6],[-2,-3.6],[0,-4.2],[2.3,-3.6],[2.8,-1.4],[2.2,0.6],[0,1.2]],true,6)),'outer')));
    for(const yy of [-3.3,-2.1,-0.9])P.push(ln(X(FK.spline([[2.3,yy],[0.6,yy-0.5],[-1.2,yy-0.2]],false,5)),'detail'));
    P.push(M(reg(X(FK.tube([[-2.2,-1.6],[-0.6,-2.9],[0.9,-2.6]],t=>0.62)),'outer')));
  }};

/* face — centre at (cx,cy), s ≈ half-height */
FK.face=(P,cx,cy,s)=>{const X=pts=>pts.map(([a,b])=>[cx+a*s,cy+b*s]);
  for(const sx of [-1,1]){P.push(FK.m(reg(X(FK.spline([[sx*0.78,-0.28],[sx*0.98,-0.12],[sx*1.0,0.18],[sx*0.92,0.42],[sx*0.8,0.3]],true,5)),'outer'),'skin'));
    P.push(dt(...X([[sx*0.93,0.52]])[0],0.11*s,'outer'));P.push(FK.m(reg(X(G.circle(sx*0.95,0.68,0.11,12)),'outer'),'metal'));}
  P.push(FK.m(reg(X(FK.spline([[0,-1.04],[0.56,-0.94],[0.84,-0.5],[0.86,0.08],[0.7,0.58],[0.36,0.92],[0,1.02],[-0.36,0.92],[-0.7,0.58],[-0.86,0.08],[-0.84,-0.5],[-0.56,-0.94]],true,7)),'outer'),'skin'));
  for(const sx of [-1,1]){
    P.push(reg(X(FK.tube(FK.spline([[sx*0.12,-0.36],[sx*0.36,-0.47],[sx*0.62,-0.43],[sx*0.74,-0.32]],false,6),t=>0.03*(1-0.6*t)+0.008)),'inner'));
    const up=FK.spline([[sx*0.1,-0.12],[sx*0.3,-0.27],[sx*0.56,-0.22],[sx*0.78,-0.2]],false,6),lo=FK.spline([[sx*0.78,-0.2],[sx*0.52,-0.07],[sx*0.28,-0.05],[sx*0.1,-0.12]],false,6);
    P.push(FK.m(reg(X(G.chain(up,lo)),'detail'),'eye'));P.push(dt(...X([[sx*0.36,-0.15]])[0],0.07*s,'detail'));
    P.push(reg(X(FK.tube(up,t=>0.028*Math.sin(Math.PI*Math.min(1,t*1.1))+0.006)),'detail'));
  }
  P.push(ln(X(FK.spline([[-0.06,-0.28],[-0.04,0.06],[-0.14,0.26],[-0.02,0.33],[0.12,0.27]],false,5)),'detail'));
  P.push(ln(X(FK.spline([[-0.3,0.52],[-0.12,0.47],[0,0.5],[0.12,0.47],[0.3,0.52]],false,5)),'inner'));P.push(ln(X(FK.spline([[-0.22,0.55],[0,0.66],[0.22,0.55]],false,5)),'detail'));
  P.push({kind:'region',closed:true,role:'detail',paint:'accent',pts:X(G.xform(G.teardrop(0.07,0.2),{y:-0.55}))});
  for(const sx of [-1,1])P.push(ln(X(FK.spline([[0,-0.98],[sx*0.36,-0.86],[sx*0.68,-0.6],[sx*0.82,-0.3]],false,6)),'detail'));
  for(const sx of [-1,1]){P.push(FK.m(reg(X(G.xform(G.teardrop(0.13,0.42),{x:sx*0.95,y:1.02,rot:180})),'inner'),'metal'));}};
FK.neck=(P,cx,top,bot,w)=>{P.push(FK.m(reg([[cx-w,top],[cx+w,top],[cx+w*1.15,bot],[cx-w*1.15,bot]],'outer'),'skin'));for(const k of [0.32,0.56,0.8]){const y=top+(bot-top)*k;P.push(ln(FK.spline([[cx-w*0.9,y],[cx,y+0.6],[cx+w*0.9,y]],false,5),'detail'));}};

/* kirīṭa-mukuṭa: banded base, petal tiers narrowing upward, dome, lotus-bud finial, side fans */
FK.crown=(P,cx,base,w,h)=>{const M=p=>FK.m(p,'metal');
  for(const sx of [-1,1]){const fan=FK.spline([[sx*w*0.82,0],[sx*w*1.38,-h*0.12],[sx*w*1.55,-h*0.36],[sx*w*1.28,-h*0.42],[sx*w*1.05,-h*0.2]],true,6).map(([a,b])=>[cx+a,base+b]);P.push(M(reg(fan,'outer')));
    for(let k=0;k<4;k++){const a=sx*w*(1.0+k*0.12),b=-h*(0.08+k*0.07);P.push(ln([[cx+a,base+b],[cx+sx*w*(1.3+k*0.05),base-h*(0.16+k*0.06)]],'detail'));}}
  const tiers=4;let y=base,ww=w;
  P.push(M(reg(FK.spline([[cx-w,base],[cx-w*1.02,base-h*0.13],[cx,base-h*0.17],[cx+w*1.02,base-h*0.13],[cx+w,base],[cx,base+h*0.04]],true,6),'outer')));
  FK.beads(P,FK.spline([[cx-w*0.92,base-h*0.06],[cx,base-h*0.1],[cx+w*0.92,base-h*0.06]],false,8),w*0.17,w*0.045);
  y=base-h*0.15;
  for(let t=0;t<tiers;t++){const nw=ww*0.8,th=h*0.15;const n=Math.max(3,7-t);
    P.push(M(reg([[cx-ww*0.96,y],[cx+ww*0.96,y],[cx+nw,y-th],[cx-nw,y-th]],'outer')));
    for(let i=0;i<n;i++){const px=cx-ww*0.85+(i+.5)*ww*1.7/n;P.push(M(reg(G.xform(G.petal(th*0.95,ww*1.7/n*0.42,'pointed'),{x:px,y:y-th*0.05}),'inner')));}
    P.push(ln([[cx-nw,y-th],[cx+nw,y-th]],'detail'));y-=th;ww=nw;}
  P.push(M(reg(FK.spline([[cx-ww,y],[cx-ww*0.8,y-h*0.12],[cx-ww*0.3,y-h*0.2],[cx,y-h*0.22],[cx+ww*0.3,y-h*0.2],[cx+ww*0.8,y-h*0.12],[cx+ww,y]],false,6).concat([[cx,y+0.5]]),'outer')));
  P.push(M(reg(G.xform(G.petal(h*0.16,ww*0.42,'pointed'),{x:cx,y:y-h*0.2}),'outer')));P.push(dt(cx,y-h*0.4,w*0.07,'outer'));
  P.push({kind:'region',closed:true,role:'detail',paint:'accent',pts:G.ellipse(cx,base-h*0.24,w*0.12,w*0.16,14)});};

/* jewellery & garments */
FK.necklaces=(P,cx,y,w)=>{for(const [k,dy] of [[0.55,0],[0.8,2.2],[1,4.6]])FK.beads(P,FK.spline([[cx-w*k,y],[cx-w*k*0.6,y+dy+2.4],[cx,y+dy+3.2],[cx+w*k*0.6,y+dy+2.4],[cx+w*k,y]],false,8),0.95,0.42);
  P.push(FK.m(reg(G.xform(G.teardrop(1.2,3.6),{x:cx,y:y+8.6,rot:180}),'outer'),'metal'));P.push({kind:'region',closed:true,role:'detail',paint:'accent',pts:G.circle(cx,y+9.2,0.55,10)});};
FK.garland=(P,path)=>{const S=G.samples(path,false,2.2);for(let i=0;i<S.length;i++){const s=S[i];const a=Math.atan2(s.ty,s.tx)/DEG;P.push(reg(G.xform(G.petal(2.6,1.1,'round'),{x:s.x,y:s.y,rot:a+(i%2?90:-90)}),'detail'));}};
FK.bangles=(P,x,y,rot,n=3)=>{for(let i=0;i<n;i++)P.push(FK.m(reg(G.xform(G.ellipse(0,i*0.9,2.1,0.42,14),{x,y,rot}),'inner'),'metal'));};
FK.armlet=(P,x,y,rot)=>{P.push(FK.m(reg(G.xform(G.roundRect(-2.4,-0.6,2.4,0.6,0.4),{x,y,rot}),'inner'),'metal'));P.push(FK.m(reg(G.xform(G.petal(2,1,'pointed').map(([a,b])=>[a,b-0.5]),{x,y,rot}),'inner'),'metal'));};

/* lotus seat with double-contoured petals and midribs */
FK.lotus=(P,cx,y,w,rows=2)=>{const M=p=>FK.m(p,'seat');
  P.push(M(reg(G.ellipse(cx,y+w*0.14,w*0.52,w*0.07,40),'outer')));
  for(let i=0;i<9;i++){const a=-72+i*18,x=cx+Math.sin(a*DEG)*w*0.3;const pts=G.xform(G.petal(w*0.3,w*0.07,'pointed'),{x,y:y+w*0.1,rot:a*0.8});P.push(M(reg(pts,'outer')));P.push(ln(G.xform(G.petal(w*0.22,w*0.045,'pointed'),{x,y:y+w*0.08,rot:a*0.8}),'detail',true));}
  for(let i=0;i<7;i++){const a=-60+i*20,x=cx+Math.sin(a*DEG)*w*0.42;const pts=G.xform(G.petal(w*0.26,w*0.085,'pointed'),{x,y:y+w*0.16,rot:a*0.9});P.push(M(reg(pts,'outer')));P.push(ln(G.xform([[0,-w*0.03],[0,-w*0.18]],{x,y:y+w*0.16,rot:a*0.9}),'detail'));}
  if(rows>1)for(let i=0;i<8;i++){const x=cx-w*0.44+(i+.5)*w*0.88/8;P.push(M(reg(G.xform(G.petal(w*0.12,w*0.06,'pointed'),{x,y:y+w*0.17,rot:180+(x-cx)/w*40}),'outer')));}};

/* seated body (female, sukhāsana or lalitāsana) — returns key joints */
FK.seatedBody=(P,o)=>{const cx=0;const M=FK.m;
  // hips, lap and crossed legs
  if(o.pose==='lalita'){
    P.push(M(reg(FK.tube(FK.spline([[-5,14],[-12,26],[-13,38]],false,8),t=>3.6-1.2*t),'outer'),'cloth'));
    P.push(M(reg(FK.spline([[-17,40.5],[-15,38],[-11,38.4],[-9,40.4],[-11,41.6],[-16,41.8]],true,5),'outer'),'skin'));
    for(const k of [0,1])P.push(FK.m(reg(G.ellipse(-13,36.6+k*0.9,3.2,0.45,12),'inner'),'metal'));
  }
  P.push(M(reg(FK.spline([[-25,11],[-27,17],[-21,22.5],[-8,23.4],[2,22],[14,23.5],[25,22],[28,16],[24,10],[12,6.2],[-10,6.4]],true,7),'outer'),'cloth'));
  for(const sx of [-1,1]){P.push(ln(FK.spline([[sx*4,9],[sx*12,13],[sx*21,16]],false,6),'detail'));P.push(ln(FK.spline([[sx*6,16],[sx*14,19],[sx*22,19]],false,6),'detail'));}
  P.push(M(reg(FK.spline([[5,17.6],[9,15.2],[14.5,15.4],[17,16.8],[14,18.6],[8,19]],true,5),'outer'),'skin'));for(const k of [0,1])P.push(ln([[15+k*0.9,15.6],[15.4+k*0.9,18.4]],'detail'));
  // pleats falling in front of the seat
  const ph=o.pleatY||34;P.push(M(reg(FK.spline([[-6,17],[6,17],[8.5,ph-2],[5,ph],[0,ph-1],[-5,ph],[-8.5,ph-2]],true,6),'inner'),'cloth2'));
  for(const x of [-4.5,-1.5,1.5,4.5])P.push(ln(FK.spline([[x*0.7,18],[x*0.95,25],[x*1.15,ph-1.5]],false,6),'detail'));
  FK.beads(P,FK.spline([[-8,ph-2.4],[-4,ph-1],[0,ph-1.8],[4,ph-1],[8,ph-2.4]],false,6),1.1,0.38);
  // torso: shoulders, waist, a fitted blouse and the sacred sash
  P.push(M(reg(FK.spline([[-2.6,-30],[-8,-28.6],[-12.6,-25.4],[-13.4,-19],[-11,-11],[-8.6,-3],[-9.6,4],[-6,7.2],[6,7.2],[9.6,4],[8.6,-3],[11,-11],[13.4,-19],[12.6,-25.4],[8,-28.6],[2.6,-30]],true,6),'outer'),'skin'));
  P.push(M(reg(FK.spline([[-11.8,-21],[-6,-17.6],[0,-17.2],[6,-17.6],[11.8,-21],[11.4,-14],[7,-11.4],[0,-12.2],[-7,-11.4],[-11.4,-14]],true,6),'inner'),'cloth2'));
  P.push(ln(FK.spline([[-8,-13],[-3,-12],[0,-13.4],[3,-12],[8,-13]],false,6),'detail'));
  P.push(M(reg(FK.tube(FK.spline([[-12,-24],[-4,-14],[6,-2],[10,6]],false,8),t=>0.9),'inner'),'cloth'));
  P.push(M(reg(FK.tube(FK.spline([[-9.4,3.6],[-4,6],[4,6],[9.4,3.6]],false,6),t=>1.3),'inner'),'metal'));
  for(const x of [-6,-2,2,6])P.push(FK.m(reg(G.xform(G.teardrop(0.7,2.6),{x,y:7.6,rot:180}),'detail'),'metal'));
  FK.neck(P,cx,-34,-29,2.5);FK.necklaces(P,cx,-28.4,8.6);};
// an arm from shoulder through elbow to wrist, with armlet and bangles
FK.limb=(P,sh,el,wr,w=2.6)=>{const path=FK.spline([sh,[(sh[0]+el[0])/2,(sh[1]+el[1])/2],el,[(el[0]+wr[0])/2,(el[1]+wr[1])/2],wr],false,7);
  P.push(FK.m(reg(FK.tube(path,t=>t<0.5?w*(1-0.18*t)+0.35*Math.sin(Math.PI*t*2):w*0.86-(w*0.86-w*0.6)*(t-0.5)*2),'outer'),'skin'));
  const au=Math.atan2(el[1]-sh[1],el[0]-sh[0])/DEG+90;FK.armlet(P,sh[0]+(el[0]-sh[0])*0.38,sh[1]+(el[1]-sh[1])*0.38,au);
  const af=Math.atan2(wr[1]-el[1],wr[0]-el[0])/DEG+90;FK.bangles(P,wr[0]-(wr[0]-el[0])*0.16,wr[1]-(wr[1]-el[1])*0.16,af,2);
  return Math.atan2(wr[1]-el[1],wr[0]-el[0])/DEG+90;};

/* the goddess: Sarasvatī / Durgā share one body */
FK.goddess=(rng,g,o)=>{const P=[];
  if(o.seat==='tiger')FK.tiger(P,0,30,1.08);
  if(o.companion==='peacock')FK.peacock(P,-40,14,0.92);
  // śiraścakra: a petalled halo disc behind the head
  if(o.halo!==false){P.push(FK.m(reg(G.circle(0,-44,15.5,64),'outer'),'metal'));for(let i=0;i<20;i++){const a=i*18;P.push(FK.m(reg(G.xform(G.petal(5,2.3,'pointed').map(([x,y])=>[x,y-15]),{x:0,y:-44,rot:a}),'outer'),'metal'));}
    P.push(ln(G.circle(0,-44,12.6,60),'detail',true));FK.beads(P,G.circle(0,-44,14,60).concat([G.circle(0,-44,14,60)[0]]),1.6,0.35);}
  // hair falling behind the shoulders
  for(const sx of [-1,1])P.push(FK.m(reg(FK.spline([[sx*5,-48],[sx*11,-44],[sx*14,-34],[sx*15.5,-22],[sx*13,-16],[sx*10.5,-24],[sx*9,-36]],true,6),'outer'),'hair'));
  // back arms holding attributes, fanned symmetrically
  const back=o.back||[];const nb=back.length/2;
  back.forEach((k,i)=>{const sx=i<nb?-1:1,j=i<nb?i:i-nb;const spread=nb>1?j/(nb-1):0.5;const a=(sx<0?-150+spread*62:-30-spread*62)*DEG;
    const sh=[sx*10.6,-24],r=o.armLen||24,wr=[sh[0]+Math.cos(a)*r,sh[1]+Math.sin(a)*r],el=[sh[0]+Math.cos(a+sx*0.62)*r*0.52,sh[1]+Math.sin(a+sx*0.62)*r*0.52];
    const ang=FK.limb(P,sh,el,wr,2.2);FK.hand(P,'hold',wr[0]+Math.sin(ang*DEG)*1.6,wr[1]-Math.cos(ang*DEG)*1.6,ang,0.8);attr(P,k,wr[0]+Math.sin(ang*DEG)*3.8,wr[1]-Math.cos(ang*DEG)*3.8-2,0.78,0,rng,g);});
  if(o.seat==='lotus')FK.lotus(P,0,26,74);
  FK.seatedBody(P,o);
  // front arms
  if(o.front==='veena'){
    FK.veena(P);
    FK.limb(P,[-11.6,-22],[-17,-9],[-15,7],2.5);FK.hand(P,'hold',-14.4,8.4,170,0.85);
    const a=FK.limb(P,[11.6,-22],[19.5,-12],[23,-21],2.5);FK.hand(P,'hold',23.6,-23.2,a,0.85);
  }else{
    const a1=FK.limb(P,[11.6,-22],[18.6,-9],[17.4,-19.6],2.5);FK.hand(P,'abhaya',17.4,-19.6,a1-180+180,0.85);
    const a2=FK.limb(P,[-11.6,-22],[-18,-8],[-15.6,4.4],2.5);
    if(o.frontLeft){FK.hand(P,'hold',-15.4,6,a2,0.85);attr(P,o.frontLeft,-15.6,7,0.8,0,rng,g);}else FK.hand(P,'varada',-15.6,4.4,a2,0.85);
  }
  FK.face(P,0,-41,7.4);FK.crown(P,0,-47.4,7.6,20);
  return fitParts(P);};

/* vīṇā: gourd resonators, a long fretted neck, a curled yāḷi head */
FK.veena=P=>{const W=p=>FK.m(p,'wood');
  P.push(W(reg(FK.spline([[-30,10],[-28,4],[-22,1],[-15,3.4],[-12,10],[-15,17],[-22,20],[-28,17]],true,7),'outer')));
  P.push(ln(FK.spline([[-27,6],[-21,4],[-16,7]],false,5),'detail'));
  P.push(W(reg(FK.tube([[-14,6],[33,-28]],t=>1.9),'outer')));
  for(let i=1;i<12;i++){const t=i/12,x=-14+47*t,y=6-34*t;P.push(ln([[x-1.2,y-1.7],[x+1.2,y+1.7]],'detail'));}
  P.push(W(reg(G.circle(27,-21.6,4.4,24),'outer')));P.push(ln(G.circle(27,-21.6,2.6,16),'detail',true));
  P.push(W(reg(FK.tube(FK.spline([[33,-28],[37,-31],[39,-35.4],[36,-37.6],[34,-35.2]],false,8),t=>1.7-0.9*t),'outer')));};

/* tiger, side-on, head turned to the viewer */
FK.tiger=(P,cx,cy,s)=>{const S=pts=>pts.map(([x,y])=>[cx+x*s,cy+y*s]);const A=p=>FK.m(p,'animal');
  P.push(A(reg(S(FK.tube(FK.spline([[38,-3],[46,-7],[52,-17],[50,-27],[45,-29]],false,8),t=>2.4*(1-0.55*t))),'outer')));
  for(const [x0,dx,front] of [[-22,-2,1],[-13,1.6,0],[20,-1.4,0],[29,2.2,1]]){
    P.push(A(reg(S(FK.tube(FK.spline([[x0,0],[x0+dx*0.4,9],[x0+dx,18],[x0+dx,22]],false,7),t=>4.4-1.4*t)),'outer')));
    P.push(A(reg(S(FK.spline([[x0+dx-5,24.4],[x0+dx-4.6,21.4],[x0+dx+2.8,21.2],[x0+dx+4.2,23.6],[x0+dx+1,24.8]],true,5)),'outer')));
    for(const k of [-1.6,0,1.6])P.push(ln(S([[x0+dx+k,23],[x0+dx+k,24.6]]),'detail'));}
  P.push(A(reg(S(FK.spline([[-30,-6],[-22,-15],[-4,-17.6],[16,-16.4],[33,-12],[40,-4],[37,6],[24,8.6],[4,10.4],[-16,10],[-28,5]],true,7)),'outer')));
  for(const x of [-20,-11,-2,7,16,25,33]){const h=x>30?8:12;P.push({kind:'region',closed:true,role:'detail',paint:'ink',pts:S(FK.tube(FK.spline([[x,-16+(x>30?3:0)],[x+1.4,-12],[x-0.6,-16+h]],false,6),t=>1.3*(1-t)+0.1))});
    P.push({kind:'region',closed:true,role:'detail',paint:'ink',pts:S(FK.tube(FK.spline([[x+3,9],[x+3.8,6],[x+2.4,3]],false,5),t=>1*(1-t)+0.1))});}
  // head: broad face, cheek ruff, ears, muzzle, whiskers
  P.push(A(reg(S(FK.spline([[-46,-4],[-48,-10],[-45,-17],[-37,-20],[-28,-17],[-25,-10],[-26,-2],[-30,4],[-38,6],[-44,3]],true,7)),'outer')));
  for(const sx of [-1,1]){P.push(A(reg(S(FK.spline([[-36+sx*6,-17.6],[-36+sx*9,-21.4],[-36+sx*10.4,-17.2]],true,5)),'outer')));
    P.push(reg(S(FK.spline([[-36+sx*2.2,-8.8],[-36+sx*4.4,-10.6],[-36+sx*6.2,-9.4],[-36+sx*4.6,-8.2]],true,5)),'inner'));P.push(dt(...S([[-36+sx*4.2,-9.4]])[0],0.85*s));
    P.push({kind:'region',closed:true,role:'detail',paint:'ink',pts:S(FK.tube(FK.spline([[-36+sx*7,-14],[-36+sx*9,-8],[-36+sx*8,-2]],false,5),t=>0.8*(1-t)+0.1))});
    for(const dy of [-0.8,0.8])P.push(ln(S([[-36+sx*3.6,-1+dy],[-36+sx*10,-2.6+dy*2.2]]),'detail'));}
  P.push(reg(S(FK.spline([[-40,-4.6],[-38.4,-6.4],[-33.6,-6.4],[-32,-4.6],[-33.4,-0.8],[-38.6,-0.8]],true,5)),'inner'));
  P.push({kind:'region',closed:true,role:'detail',paint:'ink',pts:S([[-37.6,-5.6],[-34.4,-5.6],[-36,-3.6]])});P.push(ln(S(FK.spline([[-38.4,-1.4],[-36,-0.2],[-33.6,-1.4]],false,5)),'detail'));
  for(const x of [-39,-33])P.push({kind:'region',closed:true,role:'detail',paint:'ink',pts:S(FK.tube([[x,-16.6],[x+1,-13]],t=>0.7*(1-t)+0.1))});};

/* peacock companion */
FK.peacock=(P,cx,cy,s)=>{const S=pts=>pts.map(([x,y])=>[cx+x*s,cy+y*s]);
  P.push(reg(S(FK.spline([[4,-2],[16,4],[24,14],[20,20],[8,18],[2,10]],true,7)),'outer'));
  for(let i=0;i<4;i++){const c=S([[10+i*3.6,7+i*2.6]])[0];P.push(reg(G.ellipse(c[0],c[1],1.8*s,2.4*s,14),'inner'));P.push(dt(c[0],c[1],0.7*s));}
  P.push(reg(S(FK.spline([[-4,4],[0,-3],[6,-2],[8,6],[4,12],[-2,11]],true,7)),'outer'));
  P.push(reg(S(FK.tube(FK.spline([[0,-1],[-2,-8],[-1,-14]],false,6),t=>1.6-0.5*t)),'outer'));P.push(reg(S(G.circle(-1,-15.6,2.4,16)),'outer'));
  P.push(reg(S([[-3.2,-16],[-6.4,-15],[-3.2,-14.4]]),'outer'));P.push(dt(...S([[-1.2,-16]])[0],0.5*s));
  for(const dx of [-1.6,0,1.6]){P.push(ln(S([[-1,-17.6],[-1+dx,-21]]),'detail'));P.push(dt(...S([[-1+dx,-21.4]])[0],0.55*s,'outer'));}
  for(let i=0;i<3;i++)P.push(ln(S(FK.spline([[-2+i*1.6,0],[0+i*1.6,3],[-1+i*1.6,6]],false,4)),'detail'));
  for(const dx of [0,3])P.push(ln(S([[1+dx,11],[1+dx,16],[3+dx,17]]),'outer'));};

/* ---------- figures built with the kit (replace the earlier primitive versions) ---------- */
defMotif('saraswati',{name:'Sarasvatī',term:'Sarasvatī / Vīṇāpāṇi',figure:true,sacred:true,
meaning:'Goddess of learning, music and speech: seated on a white lotus, playing the vīṇā, holding a rosary and a book, her peacock beside her.',
fn(rng,g){return FK.goddess(rng,g,{seat:'lotus',front:'veena',back:['mala','book'],companion:'peacock',pleatY:36});}});
defMotif('durga',{name:'Durgā',term:'Durgā / Siṁhavāhinī',figure:true,sacred:true,
meaning:'The warrior goddess riding her tiger, her many hands holding the weapons the gods gave her — trident, discus, sword, conch, bow, mace — while one hand stays raised in abhaya: protection.',
fn(rng,g){return FK.goddess(rng,g,{seat:'tiger',pose:'lalita',back:['trishul','chakra','sword','conch','bow','gada'],frontLeft:'lotus',armLen:23,pleatY:30});}});

/* elephant head: scalloped fan ears, forehead band and tilak, kind lidded eyes, the
   wrinkled trunk curling to his left, one tusk (the other broken), karaṇḍa crown */
FK.elephantHead=(P,cx,cy,s,curl=1)=>{const X=pts=>pts.map(([x,y])=>[cx+x*s,cy+y*s]);const Sk=p=>FK.m(p,'skin');
  for(const sx of [-1,1]){const outer=[];const ctrl=[[sx*10,-13],[sx*20,-19],[sx*30,-15],[sx*34,-4],[sx*32,8],[sx*25,17],[sx*16,15],[sx*11,6]];
    const sp=FK.spline(ctrl,true,8);const c=G.centroid(sp);for(let i=0;i<sp.length;i++){const [x,y]=sp[i];const d=Math.hypot(x-c[0],y-c[1])||1;const k=(x*sx>18)?0.55*Math.sin(i*0.9):0;outer.push([x+(x-c[0])/d*k,y+(y-c[1])/d*k]);}
    P.push(Sk(reg(X(outer),'outer')));
    P.push(ln(X(FK.spline([[sx*13,-10],[sx*22,-13],[sx*28,-6],[sx*27,5],[sx*20,11]],false,7)),'inner'));
    P.push(ln(X(FK.spline([[sx*15,-5],[sx*21,-6],[sx*23,1],[sx*18,7]],false,6)),'detail'));
    FK.beads(P,X(FK.spline([[sx*12,-11],[sx*13,-2],[sx*14,8]],false,5)),1.4*s,0.32*s);
    P.push(FK.m(reg(X(G.xform(G.teardrop(1.2,3.6),{x:sx*20,y:18,rot:180})),'inner'),'metal'));}
  P.push(Sk(reg(X(FK.spline([[0,-19],[8,-18],[12.4,-12],[12.6,-4],[10.4,3],[6.4,7.4],[0,8.6],[-6.4,7.4],[-10.4,3],[-12.6,-4],[-12.4,-12],[-8,-18]],true,7)),'outer')));
  P.push(FK.m(reg(X(FK.tube(FK.spline([[-11.6,-12.6],[0,-15.4],[11.6,-12.6]],false,7),t=>0.9)),'inner'),'metal'));FK.beads(P,X(FK.spline([[-10,-12.4],[0,-15],[10,-12.4]],false,7)),1.7*s,0.32*s);
  for(const dy of [-0.8,0.6,2])P.push(ln(X(FK.spline([[-4.2,-10+dy],[0,-10.6+dy],[4.2,-10+dy]],false,5)),'detail'));
  P.push({kind:'region',closed:true,role:'detail',paint:'accent',pts:X(G.ellipse(0,-7.4,0.75,1.1,12))});
  for(const sx of [-1,1]){const up=FK.spline([[sx*3,-3.6],[sx*5,-5],[sx*7.6,-4.2]],false,5),lo=FK.spline([[sx*7.6,-4.2],[sx*5.4,-3],[sx*3,-3.6]],false,5);
    P.push(FK.m(reg(X(G.chain(up,lo)),'detail'),'eye'));P.push(dt(...X([[sx*5.2,-3.9]])[0],0.42*s,'detail'));P.push(reg(X(FK.tube(up,t=>0.18*Math.sin(Math.PI*t)+0.04)),'detail'));
    P.push(ln(X(FK.spline([[sx*2.6,-6.2],[sx*5.2,-7.2],[sx*8,-6]],false,5)),'detail'));}
  // trunk
  const tr=FK.spline([[0,-4],[0.6,4],[-1.4,11],[0,18],[3.6,24],[8.4,26],[11,23.2],[9.6,20],[7.4,21.4]],false,8).map(([x,y])=>[x*curl,y]);
  P.push(Sk(reg(X(FK.tube(tr,t=>Math.max(0.55,4.4*(1-t*0.86)))),'outer')));
  const TS=G.samples(tr,false,2.2);for(let i=1;i<TS.length-3;i++){const q=TS[i];const w=Math.max(0.6,4.4*(1-(i/TS.length)*0.86))*0.85;P.push(ln(X(FK.spline([[q.x-q.ty*w,q.y+q.tx*w],[q.x+q.tx*0.6,q.y+q.ty*0.6],[q.x+q.ty*w,q.y-q.tx*w]],false,4)),'detail'));}
  P.push(FK.m(reg(X(FK.tube(FK.spline([[-4.6*curl,5],[-7*curl,9],[-9.4*curl,14.4]],false,6),t=>1.3*(1-t)+0.2)),'outer'),'ivory'));
  P.push(FK.m(reg(X(FK.tube([[4.4*curl,5.2],[5.4*curl,7.4]],t=>1.1)),'outer'),'ivory'));
  P.push(ln(X(FK.spline([[2.6*curl,8],[5*curl,10.2],[7.4*curl,9]],false,5)),'inner'));};

FK.ganeshaSeated=(rng,g)=>{const P=[];const Sk=p=>FK.m(p,'skin');
  FK.mouse(P,-30,46,1);
  // back arms: goad and noose
  for(const [sx,k] of [[-1,'goad'],[1,'noose']]){const sh=[sx*16,-2],el=[sx*25,-8],wr=[sx*27,-22];const a=FK.limb(P,sh,el,wr,2.8);FK.hand(P,'hold',wr[0],wr[1]-1.2,a,0.95);attr(P,k,wr[0],wr[1]-5,0.9,0,rng,g);}
  FK.lotus(P,0,44,84);
  // seated at ease: lap, pendant leg, belly
  P.push(FK.m(reg(FK.tube(FK.spline([[-6,34],[-13,44],[-14,52]],false,7),t=>4.6-1.2*t),'outer'),'skin'));
  P.push(Sk(reg(FK.spline([[-19,55],[-17,52],[-12,52.4],[-9.6,54.6],[-12,56],[-17.6,56.2]],true,5),'outer')));
  P.push(FK.m(reg(FK.spline([[-30,30],[-32,37],[-24,43],[-8,44.4],[4,42.6],[18,44.4],[30,42],[32,35],[27,28],[12,25],[-12,25.4]],true,7),'outer'),'cloth'));
  for(const sx of [-1,1])P.push(ln(FK.spline([[sx*6,29],[sx*16,33],[sx*27,35]],false,6),'detail'));
  P.push(Sk(reg(FK.spline([[6,37.4],[11,34.8],[17,35],[19.6,36.6],[16.4,38.6],[9,38.8]],true,5),'outer')));
  P.push(Sk(reg(FK.spline([[-6.6,-7],[-15,-4],[-17.6,6],[-21,17],[-19,27],[-10,31.4],[10,31.4],[19,27],[21,17],[17.6,6],[15,-4],[6.6,-7]],true,7),'outer')));
  P.push(Sk(reg(G.circle(0,17,13.2,56),'inner')));P.push(ln(FK.spline([[-1.2,17.4],[0,18.8],[1.2,17.4]],false,4),'detail'));
  // the snake as a belly band, hood raised at one end
  const sn=FK.spline([[-13,22],[-6,25.6],[4,25.6],[12,22.4],[14,19],[12.4,16.4]],false,8);P.push(FK.m(reg(FK.tube(sn,t=>1.1),'inner'),'snake'));
  P.push(FK.m(reg(FK.spline([[11.6,17],[10,13.8],[12.6,11.4],[15.2,13.8],[13.8,17]],true,5),'inner'),'snake'));P.push(dt(12.6,13.4,0.35,'detail'));
  P.push(FK.m(reg(FK.tube(FK.spline([[-14,-4],[-4,6],[8,18],[13,28]],false,7),t=>0.8),'inner'),'cloth2'));
  FK.necklaces(P,0,-6.4,11);
  // front arms: abhaya and the bowl of modakas
  const a1=FK.limb(P,[15.6,-3],[23,8],[21.6,-4.8],2.9);FK.hand(P,'abhaya',21.6,-4.8,a1,1.05);
  const a2=FK.limb(P,[-15.6,-3],[-24,8],[-20,22],2.9);FK.hand(P,'hold',-19.6,23.2,a2,1);
  P.push(FK.m(reg(FK.spline([[-27,24.6],[-26.6,28.4],[-20,30.4],[-13.6,28.4],[-13.2,24.6]],true,6),'inner'),'metal'));for(const dx of [-4.4,0,4.4])P.push(FK.m(reg(G.xform(G.teardrop(1.9,4.4),{x:-20+dx,y:24.4}),'inner'),'sweet'));
  FK.elephantHead(P,0,-28,1,rng.chance(.8)?1:-1);FK.crown(P,0,-45,9,24);
  return fitParts(P);};
FK.mouse=(P,cx,cy,s)=>{const S=pts=>pts.map(([x,y])=>[cx+x*s,cy+y*s]);const A=p=>FK.m(p,'animal');
  P.push(ln(S(FK.spline([[-8,2],[-14,3.4],[-17,0],[-15,-3.4]],false,7)),'outer'));
  P.push(A(reg(S(FK.spline([[-9,1.6],[-8,-3],[-2,-5],[4,-4],[8.4,-1.6],[11.4,0.4],[8,2.4],[0,3.4]],true,7)),'outer')));
  P.push(A(reg(S(G.circle(4.6,-4.8,1.8,14)),'outer')));P.push(dt(...S([[8.4,-1.2]])[0],0.35*s));P.push(dt(...S([[11.2,0.3]])[0],0.4*s,'outer'));
  for(const dx of [-5,3])P.push(ln(S([[dx,2.4],[dx+0.6,4.4]]),'outer'));};

/* Kṛṣṇa as Veṇugopāla: tribhaṅga stance, legs crossed at the ankle, flute to his right,
   peacock feather in the crown, long forest garland, dhoti and fluttering scarf */
FK.krishna=(rng,g)=>{const P=[];const B=p=>FK.m(p,'skinBlue');
  // scarf ends fluttering behind
  P.push(FK.m(reg(FK.tube(FK.spline([[-9,-26],[-17,-14],[-19,0],[-25,10]],false,8),t=>2.4*(1-t)+0.5),'outer'),'cloth2'));
  P.push(FK.m(reg(FK.tube(FK.spline([[10,-25],[17,-12],[19,2],[25,12]],false,8),t=>2.2*(1-t)+0.5),'outer'),'cloth2'));
  // legs crossed at the ankle
  P.push(B(reg(FK.tube(FK.spline([[5,10],[8,26],[2,40],[-4,52]],false,8),t=>4.4-2*t),'outer')));
  P.push(B(reg(FK.tube(FK.spline([[-4,10],[-3,26],[2,40],[7,52]],false,8),t=>4.6-2.1*t),'outer')));
  for(const [x,flip] of [[-5,-1],[8,1]]){P.push(B(reg(FK.spline([[x-3.2*flip,54.4],[x-1.6*flip,51.4],[x+2.8*flip,51.2],[x+5.2*flip,53.6],[x+2*flip,55]],true,5),'outer')));for(const k of [0,1])P.push(FK.m(reg(G.ellipse(x,50.2+k*0.9,2.6,0.42,12),'inner'),'metal'));}
  // dhoti with pleats and a sash
  P.push(FK.m(reg(FK.spline([[-7,2],[-11,12],[-12,24],[-7,30],[0,28],[8,31],[13,25],[13,12],[8,2]],true,7),'outer'),'clothYellow'));
  for(const x of [-6,-2,2,6])P.push(ln(FK.spline([[x*0.8,6],[x*1,16],[x*1.2,27]],false,6),'detail'));
  P.push(FK.m(reg(FK.spline([[-1.6,22],[2.4,22],[3.6,46],[0.4,48],[-2.6,46]],true,6),'inner'),'clothYellow'));
  P.push(FK.m(reg(FK.tube(FK.spline([[-8,4],[0,6.4],[8,4]],false,6),t=>1.4),'inner'),'metal'));
  // torso turned, hips shifted (tribhaṅga)
  P.push(B(reg(FK.spline([[-3,-31],[-9,-29],[-12.6,-25],[-12.4,-17],[-9.4,-8],[-7.4,2],[8,2],[9.6,-8],[11.6,-17],[12.2,-25],[8.6,-29],[3,-31]],true,6),'outer')));
  P.push(ln(FK.spline([[-8,-16],[-3,-14],[0,-15.6],[3,-14],[8,-16]],false,6),'detail'));P.push(dt(0,-6,0.6,'detail'));
  FK.neck(P,0,-35,-30,2.4);FK.necklaces(P,0,-29.4,8);
  FK.garland(P,FK.spline([[-10,-27],[-12,-6],[-9,14],[0,24],[9,14],[12,-6],[10,-27]],false,8));
  // arms raised to the flute, held to his right
  const a1=FK.limb(P,[-11.4,-26],[-20,-20],[-20.4,-33.4],2.4);
  const a2=FK.limb(P,[11,-26],[10,-17],[-4.6,-36],2.4);
  FK.face(P,1,-43,6.8);
  FK.crown(P,1,-49,6.4,15);subParts(P,'peacockFeather',8,-63,15,26,rng,g);
  P.push(FK.m(reg(FK.tube([[3.6,-38.4],[-38,-33.6]],t=>1.2),'outer'),'wood'));for(const x of [-29,-25,-12,-8.4])P.push(dt(x,-33.6-(x+38)/41.6*4.8,0.42,'detail'));
  for(const x of [-34,1])P.push(FK.m(reg(G.xform(G.roundRect(-0.8,-1.5,0.8,1.5,0.4),{x,y:-33.6-(x+38)/41.6*4.8,rot:-6}),'inner'),'metal'));
  FK.hand(P,'hold',-20.4,-32.4,a1-10,0.82);FK.hand(P,'hold',-4.8,-35.2,a2+20,0.82);
  return fitParts(P);};

/* Hanumān in flight: muscular torso leaning into the leap, mace raised, tail curling,
   monkey face in profile with a crown */
FK.hanuman=(rng,g)=>{const P=[];const H=p=>FK.m(p,'skinSaffron');
  // tail sweeping up behind, ending in a curl
  P.push(H(reg(FK.tube(FK.spline([[-8,0],[-20,-6],[-26,-20],[-20,-32],[-24,-42],[-31,-40],[-29,-35]],false,9),t=>2.2*(1-0.6*t)+0.3),'outer')));
  // legs trailing, knees bent
  P.push(H(reg(FK.tube(FK.spline([[-4,6],[-16,10],[-22,10],[-32,4],[-38,3]],false,8),t=>4.4-2.2*t),'outer')));
  P.push(H(reg(FK.tube(FK.spline([[0,8],[-8,18],[-12,22],[-24,26],[-29,28]],false,8),t=>4.2-2*t),'outer')));
  for(const [x,y,r] of [[-40,3,-6],[-31,28.4,-14]])P.push(H(reg(G.xform(FK.spline([[-3.4,-1.2],[0,-2.2],[3.6,-0.6],[2.6,1.6],[-2.6,1.4]],true,5),{x,y,rot:r}),'outer')));
  for(const [x,y,r] of [[-35,3.6,95],[-26,27,70]])for(let k=0;k<2;k++)P.push(FK.m(reg(G.xform(G.ellipse(0,k*0.9,2.4,0.42,12),{x,y,rot:r}),'inner'),'metal'));
  // loincloth and a sash streaming behind
  P.push(FK.m(reg(FK.tube(FK.spline([[-6,4],[-18,0],[-30,2],[-42,-4]],false,8),t=>2*(1-t)+0.4),'outer'),'cloth2'));
  P.push(FK.m(reg(FK.spline([[-9,2],[-2,0.4],[7,4],[6,11],[-3,13],[-10,9]],true,6),'outer'),'cloth'));
  // V-shaped torso, chest forward
  P.push(H(reg(FK.spline([[14,-20],[20,-17],[22,-9],[17,-2],[9,2.6],[2,3.4],[-6,2],[-8,-4],[-3,-12],[5,-19]],true,7),'outer')));
  P.push(ln(FK.spline([[9,-15],[15,-10],[18,-4]],false,6),'detail'));P.push(ln(FK.spline([[4,-9],[8,-4],[9,1]],false,5),'detail'));
  for(const t of [0.3,0.55,0.8])P.push(ln([[2+t*6,-6+t*6],[6+t*6,-8+t*6]],'detail'));
  P.push(FK.m(reg(FK.tube(FK.spline([[6,-18],[11,-8],[13,0]],false,6),t=>0.7),'inner'),'cloth2'));
  FK.beads(P,FK.spline([[11,-19.6],[15,-16],[19.4,-15]],false,6),1,0.4);
  // forward arm, raised arm with the mace
  const a1=FK.limb(P,[18,-15],[26,-11],[34,-14],3);FK.hand(P,'hold',34.8,-14.8,a1,0.95);
  const a2=FK.limb(P,[12,-19],[15,-31],[20,-43],3.1);subParts(P,'gada',24,-58,26,20,rng,g);FK.hand(P,'hold',20.6,-44,a2,1);
  // head in profile: cranium, heavy brow, protruding muzzle, jaw, ear, crown
  P.push(H(reg(FK.spline([[15,-21],[15.4,-29],[19,-34.4],[25,-35.6],[29.4,-33],[31,-31],[35,-30],[39.4,-27],[40.4,-23],[38,-20.4],[34,-19.6],[30,-17.6],[25,-17],[20,-18]],true,7),'outer')));
  P.push(FK.m(reg(FK.spline([[31,-29.4],[36.4,-28],[39.2,-24.4],[37,-21],[32.4,-21.2]],true,6),'inner'),'muzzle'));
  P.push(reg(FK.tube(FK.spline([[24.6,-31],[28,-32.4],[31.6,-31]],false,5),t=>0.55*Math.sin(Math.PI*t)+0.15),'detail'));
  P.push(FK.m(reg(FK.spline([[26.6,-29.4],[28.2,-30.4],[30,-29.4],[28.2,-28.6]],true,5),'detail'),'eye'));P.push(dt(28.4,-29.4,0.45,'detail'));
  P.push(ln(FK.spline([[34.4,-21.6],[37,-21.4],[39,-22.6]],false,5),'detail'));P.push(dt(38.6,-26.6,0.4,'detail'));
  P.push(H(reg(FK.spline([[19.4,-27.6],[21.6,-29],[23,-26.4],[21,-24.4]],true,5),'outer')));P.push(FK.m(reg(G.circle(21.2,-23,1.1,12),'inner'),'metal'));
  P.push(ln(FK.spline([[22,-19],[26,-22],[31,-21]],false,5),'detail'));
  FK.crown(P,22.4,-34.4,5.2,13);
  return fitParts(P);};

defMotif('ganeshaSeated',{name:'Gaṇeśa seated',term:'Gaṇapati',figure:true,sacred:true,
meaning:'Gaṇeśa enthroned on a lotus: four arms holding goad and noose behind, the front hands in abhaya and holding a bowl of modakas, a snake tied round his belly, his mouse at his feet.',
fn(rng,g){return FK.ganeshaSeated(rng,g);}});
defMotif('krishnaFlute',{name:'Kṛṣṇa with flute',term:'Veṇugopāla / Muralīdhara',figure:true,sacred:true,
meaning:'The cowherd god playing his flute in the thrice-bent (tribhaṅga) pose, legs crossed at the ankle, peacock feather in his crown and the long forest garland (vanamālā) to his knees.',
fn(rng,g){return FK.krishna(rng,g);}});
defMotif('hanumanFlying',{name:'Hanumān in flight',term:'Hanumān / Āñjaneya',figure:true,sacred:true,
meaning:'Hanumān leaping across the sky with his mace raised — the flight to Laṅkā or to fetch the healing mountain; strength wholly given to devotion.',
fn(rng,g){return FK.hanuman(rng,g);}});

/* ---------- richer shared motifs (same names: every tradition using them gains the detail) ---------- */
// peacock: scaled neck, crest of fanned plumes, layered wing feathers, a long train of eyed feathers
SG.motifs.bird.fn=(rng,g)=>{const P=[];
  // the train: one fan of plumes behind, then quills with fine barbs and an eye at each tip
  const tail=[[152,44],[142,52],[132,57],[122,58],[112,56],[102,50]];const base=[12,6];
  const tips=tail.map(([a,len])=>[base[0]+Math.sin(a*DEG)*len,base[1]-Math.cos(a*DEG)*len]);
  P.push(reg(FK.spline([base,[16,-2],...tips.slice().reverse().map(([x,y],i)=>[x+2,y-2]),[4,14]],true,6),'outer'));
  for(let k=0;k<tail.length;k++){const [a,len]=tail[k];const tip=tips[k];const quill=FK.spline([base,[(base[0]+tip[0])/2+Math.cos(a*DEG)*2,(base[1]+tip[1])/2+Math.sin(a*DEG)*2],tip],false,8);
    P.push(ln(quill,'inner'));
    for(const q of G.samples(quill,false,2.6).slice(2,-3)){for(const sd of [-1,1])P.push(ln([[q.x,q.y],[q.x+(q.tx*1.6-sd*q.ty*3.2),q.y+(q.ty*1.6+sd*q.tx*3.2)]],'detail'));}
    const e=[base[0]+Math.sin(a*DEG)*len*0.9,base[1]-Math.cos(a*DEG)*len*0.9];
    P.push(reg(G.xform(G.ellipse(0,0,3.8,5,22),{x:e[0],y:e[1],rot:a}),'inner'));P.push(reg(G.xform(G.ellipse(0,0,2.3,3,18),{x:e[0],y:e[1],rot:a}),'inner'));P.push(reg(G.xform(G.teardrop(1,2.4),{x:e[0],y:e[1]+0.6,rot:a}),'detail'));}
  P.push(ln(FK.spline([[-2,12],[-3,22],[-6,30]],false,5),'outer'),ln(FK.spline([[5,12],[5,22],[3,30]],false,5),'outer'));
  for(const [x,y] of [[-6,30],[3,30]])for(const d of [-1,0,1])P.push(ln([[x,y],[x-3+d*3,y+2.4-Math.abs(d)]],'outer'));
  P.push(reg(FK.spline([[-10,-2],[-8,8],[-1,13.6],[9,12],[16,6],[12,-2],[2,-6]],true,7),'outer'));
  P.push(reg(FK.spline([[-4,0],[2,-3],[11,-1],[15,5],[9,9.6],[0,8]],true,7),'inner'));
  for(let r=0;r<3;r++)for(let i=0;i<4-r;i++){const x=-1+i*3.6+r*1.8,y=2+r*2.4;P.push(ln(G.arc(x,y,1.8,20,160,6),'detail'));}
  P.push(reg(FK.tube(FK.spline([[-6,-3],[-11,-12],[-13,-21],[-11,-28]],false,7),t=>3.4-1.1*t),'outer'));
  for(let i=0;i<7;i++){const y=-6-i*3.1,x=-7.4-Math.sin(i*0.5)*3;P.push(ln(G.arc(x,y,1.2,20,160,5),'detail'));}
  P.push(reg(FK.spline([[-14.6,-30],[-12,-33],[-8.6,-31],[-8.4,-27.4],[-11.6,-26.4]],true,6),'outer'));
  P.push(reg([[-14.4,-30],[-19.4,-28.6],[-14.2,-28]],'outer'));P.push(reg(G.ellipse(-11.6,-30,1.6,1.1,12),'inner'));P.push(dt(-11.8,-30,0.5));
  for(const a of [-30,-12,6,22]){const t=G.xform([[0,-7]],{x:-11.6,y:-32.6,rot:a})[0];P.push(ln([[-11.6,-32.6],t],'detail'));P.push(reg(G.xform(G.teardrop(0.9,2.4),{x:t[0],y:t[1],rot:a}),'outer'));}
  return fitParts(P);};

// fish: curved body, rayed fins, staggered scale rows, lateral line, lidded eye
SG.motifs.fish.fn=(rng,g)=>{const P=[];
  const tail=FK.spline([[31,-4],[38,-12],[50,-22],[46,-6],[43,0],[46,6],[50,22],[38,12],[31,4]],true,6);P.push(reg(tail,'outer'));
  for(const k of [-16,-9,-3,3,9,16])P.push(ln(FK.spline([[34,k*0.12],[41,k*0.6],[47,k*1.15]],false,4),'detail'));
  const dor=FK.spline([[-14,-20],[-8,-33],[4,-34],[14,-26],[18,-15]],false,7);P.push(reg(dor.concat([[0,-18]]),'outer'));for(let i=1;i<6;i++){const q=dor[Math.round(i*(dor.length-1)/6)];P.push(ln([[q[0]*0.86,-18.5],q],'detail'));}
  P.push(reg(FK.spline([[16,13],[22,24],[28,20],[26,10]],true,6),'outer'));P.push(reg(FK.spline([[-8,17],[-4,28],[4,26],[4,16]],true,6),'outer'));
  const body=FK.spline([[-47,2],[-40,-12],[-24,-21],[-4,-23],[16,-16],[31,-5],[33,0],[31,5],[16,15],[-4,20],[-26,18],[-40,12]],true,8);P.push(reg(body,'outer'));
  for(let r=-2;r<=2;r++)for(let c=0;c<7;c++){const x=-14+c*6.4+(r%2?3.2:0),y=r*6.2+(c*0.3);if(G.inside(x,y,body)&&G.inside(x+4,y,body))P.push(ln(G.arc(x,y,3.6,-70,70,7),'detail'));}
  P.push(ln(FK.spline([[-22,-2],[0,-4],[18,-2],[30,0]],false,7),'detail'));
  P.push(ln(FK.spline([[-25,-15],[-20,-2],[-24,13]],false,6),'inner'));P.push(ln(FK.spline([[-29,-12],[-25,-1],[-28,10]],false,6),'detail'));
  P.push(reg(FK.spline([[-20,4],[-12,12],[-9,8],[-15,1]],true,6),'inner'));for(const k of [0,1,2])P.push(ln([[-18,4+k],[-11,10+k*0.4]],'detail'));
  P.push(reg(G.ellipse(-35,-5,4.6,4,20),'inner'));P.push(reg(G.circle(-35.6,-5,2.4,14),'detail'));P.push(dt(-36.4,-5.8,0.6,'outer'));
  P.push(ln(G.arc(-35,-5,5.8,200,330,10),'detail'));P.push(ln(FK.spline([[-47,2],[-43,3.6],[-40,2.4]],false,4),'inner'));
  return fitParts(P);};

// tree of life on a mound: tapering trunk with bark, curving branches, leaves with midribs, blossoms, two birds
SG.motifs.tree.fn=(rng,g)=>{const half=[];const P=[];
  P.push(reg(FK.spline([[-36,50],[-28,40],[-12,36],[0,38],[12,36],[28,40],[36,50]],false,7),'outer'));
  for(const k of [0,1])P.push(ln(FK.spline([[-30+k*6,48],[-14+k*4,42-k*1],[0,43-k],[14-k*4,42-k*1],[30-k*6,48]],false,6),'detail'));
  const trunk=FK.spline([[0,40],[1,26],[-1,12],[0,-2],[0,-16]],false,8);P.push(reg(FK.tube(trunk,t=>5.4-3*t),'outer'));
  for(const y of [34,28,22,16,10,4])P.push(ln(FK.spline([[-2,y],[0,y-1.4],[2,y]],false,4),'detail'));
  const br=[{y:22,ex:34,ey:4,c:8},{y:8,ex:36,ey:-14,c:6},{y:-6,ex:26,ey:-32,c:4}];
  for(const b of br){const path=FK.spline([[2,b.y],[12,b.y-2],[b.ex*0.7,b.ey+8],[b.ex,b.ey]],false,8);half.push(reg(FK.tube(path,t=>2.2-1.4*t),'outer'));
    const S=G.samples(path,false,5.2);S.forEach((q,i)=>{if(i<1||i>S.length-2)return;const a=Math.atan2(q.ty,q.tx)/DEG+(i%2?-58:-122);const lp=G.xform(G.petal(10,3.6,'pointed'),{x:q.x,y:q.y,rot:a});half.push(reg(lp,'detail'));half.push(ln(G.xform([[0,-1],[0,-8]],{x:q.x,y:q.y,rot:a}),'detail'));});
    const fl=fitParts(SG.motifs.lotusTop.fn(makeRng(hashStr('tl'+b.y)),g),12).map(p=>p.kind==='dot'?Object.assign({},p,{x:p.x+b.ex,y:p.y+b.ey}):Object.assign({},p,{pts:G.xform(p.pts,{x:b.ex,y:b.ey})}));half.push(...fl);}
  const bird=FK.spline([[16,-22],[20,-25],[26,-24],[29,-20],[24,-18],[18,-18]],true,6);half.push(reg(bird,'outer'),reg([[16,-22],[12,-21],[16,-20.6]],'outer'),dt(18.4,-22,0.5));
  P.push(...half,...mirParts(half));
  const top=fitParts(SG.motifs.lotusTop.fn(makeRng(7),g),20).map(p=>p.kind==='dot'?Object.assign({},p,{y:p.y-26}):Object.assign({},p,{pts:G.xform(p.pts,{y:-26})}));P.push(...top);
  return fitParts(P);};

// lotus in profile: double-contoured petals with midribs, sepal cup, short stem
SG.motifs.lotusSide.fn=(rng,g)=>{const P=[];const bx=0,by=22;
  const petals=[{r:-74,l:32,w:9},{r:74,l:32,w:9},{r:-50,l:42,w:11},{r:50,l:42,w:11},{r:-24,l:50,w:12.6},{r:24,l:50,w:12.6},{r:0,l:58,w:14}];
  for(const p of petals){const shape=G.xform(G.petal(p.l,p.w,'pointed'),{x:bx,y:by,rot:p.r});P.push(reg(shape,'outer'));
    P.push(ln(G.xform(G.petal(p.l*0.82,p.w*0.62,'pointed').map(([x,y])=>[x,y-p.l*0.06]),{x:bx,y:by,rot:p.r}),'detail',true));
    P.push(ln(G.xform([[0,-4],[0,-p.l*0.66]],{x:bx,y:by,rot:p.r}),'detail'));}
  P.push(reg(FK.spline([[-34,20],[-24,33],[0,36],[24,33],[34,20],[18,25],[0,26],[-18,25]],true,7),'outer'));
  for(const x of [-18,0,18])P.push(ln(FK.spline([[x*0.9,26],[x,30],[x*1.08,33]],false,4),'detail'));
  P.push(reg(FK.tube(FK.spline([[0,35],[1.6,42],[-1,48],[0,54]],false,6),t=>1.6),'outer'));
  return fitParts(P);};
