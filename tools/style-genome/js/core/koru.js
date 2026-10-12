'use strict';
/* Koru — the Māori drawing grammar: the unfurling frond, and what is built from it.

   KORU. A stem that swells and curls round into a bulb. Everything curved in Māori art
   grows from it: two back to back make the mangōpare, two interlocked make the double
   spiral of carving, a wave of them budding off one stem makes a rafter scroll.

   KŌWHAIWHAI (painted rafters) are frieze patterns in three colours: the scroll itself is
   left in the ground colour (white), and red and black fill what remains. Each pattern
   here is a koru unit repeated by one of the strip symmetries — translation, mirror,
   half-turn, glide. They are constructions from that grammar, named for the family of
   rafter patterns they belong to, not copies of any house's rafters.

   BANDS. Kirituhi and carving fill curved bands with small repeats — notches between
   grooves, scales, teeth. `KO.bandParts` bends any border strip along a curved spine, so
   the same layout can carry any culture's borders.

   LATTICE. Tukutuku panels are cross-stitches on a grid; a pattern is a rule from cell
   (i,j) to a colour. Tāniko is the same idea in solid triangles.

   Part flags used here: `ci` (palette colour by position, honoured wherever the tradition
   fills at all), `bg` (always filled with the ground colour), `ns` (no outline). */

const KO={};
// closed outline of a koru: base at (0,0), stem rising toward −y, curling to the right
KO.koru=({len=40,R=12,turns=0.8,w=4,bulb=1.28,taper=0.4,lean=0}={})=>{
  w=Math.min(w,R/3.95); // keeps a clear channel between the bulb and the stem
  const c=[R,-len],pts=[];
  for(let i=0;i<=10;i++){const t=i/10;pts.push([lean*len*0.5*Math.sin(Math.PI*t)*(1-t),-len*t]);}
  const n=Math.round(28*turns)+8;
  for(let i=1;i<=n;i++){const s=i/n,a=Math.PI+s*turns*2*Math.PI,r=R*(1-0.58*s);pts.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}
  const L=G.length(pts,false),sf=len/L;
  return FK.tube(pts,t=>t<sf?w*(taper+(1-taper)*t/sf):t>0.88?lerp(w*0.82,w*bulb,(t-0.88)/0.12):lerp(w,w*0.82,(t-sf)/(0.88-sf)));
};
KO.place=(pts,x,y,rot=0,flip=false,s=1)=>G.xform(pts,{x,y,rot,flip,s});
// a tapered tube with enough points for a long sweeping stem (FK.tube stops at 60)
KO.tube=(path,hw,n=240)=>{const p=G.resample(path,false,Math.max(0.5,G.length(path,false)/n)),m=p.length,L=[],R=[];if(m<2)return p;let acc=0;const tot=G.length(p,false)||1;
  for(let i=0;i<m;i++){if(i)acc+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);const a=p[Math.max(0,i-1)],b=p[Math.min(m-1,i+1)];let tx=b[0]-a[0],ty=b[1]-a[1];const l=Math.hypot(tx,ty)||1;tx/=l;ty/=l;const w=hw(acc/tot);L.push([p[i][0]-ty*w,p[i][1]+tx*w]);R.push([p[i][0]+ty*w,p[i][1]-tx*w]);}
  const cap=(c,from,to)=>{const a0=Math.atan2(from[1]-c[1],from[0]-c[0]),a1=Math.atan2(to[1]-c[1],to[0]-c[0]);let d=a1-a0;if(d>0)d-=Math.PI*2;const r=Math.hypot(from[0]-c[0],from[1]-c[1]),o=[];for(let k=1;k<14;k++){const a=a0+d*k/14;o.push([c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r]);}return o;};
  return L.concat(cap(p[m-1],L[m-1],R[m-1]),R.slice().reverse(),cap(p[0],R[0],L[0]));};
// centre of the curl of a placed koru (for the dark eye painted inside it)
KO.eye=(x,y,rot,flip,o)=>G.xform([[o.R,-o.len]],{x,y,rot,flip})[0];
const kBg=(pts,role='inner')=>reg(pts,role,{bg:true});
const kCi=(pts,ci,role='outer')=>reg(pts,role,{ci,ns:true,plain:true});

// ---------- motifs ----------
defMotif('koru',{name:'Koru',term:'koru',meaning:'The unfurling frond of the silver fern: new life, growth, and a return to the point of origin. The stem swells, curls once round and ends in a bulb.',
fn(){return fitParts([reg(KO.place(KO.koru({len:44,R:22,turns:0.95,w:5.4,lean:0.55}),-12,34),'outer')],96);}});
defMotif('mangopare',{name:'Mangōpare',term:'mangōpare',meaning:'"Hammerhead shark": two koru curling away from each other at the head of one stem. The shark that does not give up when caught — strength and tenacity. One of the best-known rafter and tattoo forms.',
upright:true,fn(){const o={len:52,R:17,turns:0.92,w:4.3,lean:0.3};const P=[];
  for(const f of [false,true])P.push(reg(KO.place(KO.koru(o),f?-4.9:4.9,36,0,f),'outer'));
  return fitParts(P,96);}});
defMotif('takarangi',{name:'Double spiral',term:'takarangi / rauru',meaning:'Two spirals wound into each other with a notched channel between them: the form at the centre of canoe prows and door lintels. Read as the separation of sky and earth, with light entering between the two arms.',
fn(){const P=[],b=3.1,turns=2.35,arm=k=>{const pts=[];for(let i=0;i<=120;i++){const th=i/120*turns*2*Math.PI,r=3.2+b*th;pts.push([r*Math.cos(th+k*Math.PI),r*Math.sin(th+k*Math.PI)]);}return pts;};
  for(const k of [0,1]){const a=arm(k);P.push(reg(DS.tube([[0,0]].concat(a),t=>t>0.93?lerp(2.5,0.5,(t-0.93)/0.07):2.5),'outer',{tone:k}));}
  // notches (pākati) across the channel
  for(const k of [0,1])for(let i=6;i<118;i+=3){const th=i/120*turns*2*Math.PI,r=3.2+b*th+b*Math.PI/2,a=th+k*Math.PI;if(r>3.2+b*(turns*2*Math.PI-Math.PI)-1)continue;
    P.push(ln([[(r-1.5)*Math.cos(a),(r-1.5)*Math.sin(a)],[(r+1.5)*Math.cos(a),(r+1.5)*Math.sin(a)]],'detail'));}
  return fitParts(P,98);}});
defMotif('heiMatau',{name:'Fish hook',term:'hei matau',meaning:'The fish-hook pendant: safe passage over water, provision, and the hook with which Māui hauled up the North Island. Worn in bone and greenstone.',
upright:true,figure:true,mirrorOk:true,fn(){const P=[];const c=[];for(let i=0;i<=70;i++){const a=(-78+i/70*286)*DEG,r=27-2.5*Math.sin(i/70*Math.PI)-(i>52?(i-52)*0.32:0);c.push([r*Math.cos(a)*0.9,r*Math.sin(a)+(i<12?-(12-i)*1.1:0)]);}
  const hw=DS.prof([[0,5.2],[0.06,6.4],[0.3,8.6],[0.55,9.6],[0.8,6.4],[0.95,2.6],[1,0.7]]);
  P.push(mA(reg(DS.tube(c,hw),'outer'),'stone'));
  // barb, lashing head, incised line
  const tip=DS.at(c,0.9);P.push(mA(reg([[tip.x+tip.ty*1.5,tip.y-tip.tx*1.5],[tip.x+tip.ty*10.5-tip.tx*3,tip.y-tip.tx*10.5-tip.ty*3],[tip.x-tip.tx*7.5+tip.ty*2,tip.y-tip.ty*7.5-tip.tx*2]],'outer'),'stone'));
  const h0=c[0];P.push(mA(reg(G.xform(G.roundRect(-6.6,-9.5,6.6,1,2.4),{x:h0[0],y:h0[1],rot:18}),'outer'),'stone'));
  for(const dy of [-6.4,-3])P.push(ln(G.xform([[-6.6,dy],[6.6,dy]],{x:h0[0],y:h0[1],rot:18}),'detail'));
  const inn=[];for(let i=5;i<=58;i++){const s=DS.at(c,i/70),h=hw(i/70)*0.42;inn.push([s.x+s.ty*h,s.y-s.tx*h]);}P.push(ln(inn,'inner'));
  const e=inn[inn.length-1];P.push(reg(KO.place(KO.koru({len:6,R:3.4,turns:0.8,w:1.25}),e[0],e[1],-150,true),'detail'));
  for(let i=22;i<46;i+=4){const s=DS.at(c,i/70),h=hw(i/70);P.push(ln([[s.x-s.ty*h*0.95,s.y+s.tx*h*0.95],[s.x-s.ty*h*0.5,s.y+s.tx*h*0.5]],'detail'));}
  return fitParts(P,96);}});
defMotif('pikorua',{name:'Twist',term:'pikorua',meaning:'Two strands crossing and returning: the joining of two people or two peoples, and paths that part and meet again. A carving form of recent centuries, named for the pikopiko fern.',
upright:true,fn(){const loop=[];for(let i=0;i<120;i++){const t=i/120*2*Math.PI;loop.push([15*Math.sin(2*t),-34*Math.cos(t)]);}
  return fitParts(weaveLoops([loop],{cord:10.5,gap:2.8}),96);}});
defMotif('fernFrond',{name:'Fern frond',term:'rau ponga',meaning:'The silver fern: a frond laid pale side up marks a path at night. The national emblem, and the grown form of the koru.',
fn(){const P=[];const sp=FK.spline([[-30,42],[-16,18],[-2,-6],[14,-28],[25,-40]],false,12);P.push(reg(DS.tube(sp,t=>1.9-1.4*t),'outer'));
  const n=13;for(let i=1;i<=n;i++){const f=0.08+i/n*0.8,s=DS.at(sp,f),l=24*Math.pow(1-f,0.7)+3.5;for(const sd of [-1,1]){const a=Math.atan2(s.ty,s.tx)/DEG+sd*(62-f*14);
    P.push(reg(G.xform(G.petal(l,l*0.16,'pointed'),{x:s.x,y:s.y,rot:a+90}),'outer'));}}
  const e=sp[sp.length-1];P.push(reg(KO.place(KO.koru({len:5,R:4.6,turns:0.95,w:1.5}),e[0],e[1],34),'outer'));return fitParts(P,98);}});
defMotif('toki',{name:'Adze blade',term:'toki',meaning:'The adze: the carver\'s tool, and as a pendant the mark of strength, authority and a job well made.',
upright:true,figure:true,fn(){const P=[];P.push(mA(reg(FK.spline([[-7.5,-40],[7.5,-40],[9.5,-10],[13,30],[11,40],[0,43.5],[-11,40],[-13,30],[-9.5,-10]],true,6),'outer'),'stone'));
  P.push(ln(FK.spline([[-12.2,31],[0,35.5],[12.2,31]],false,8),'inner'));for(const y of [-34,-30,-26])P.push(ln([[-8,y],[8,y]],'detail'));P.push(ln(FK.spline([[0,-22],[1,4],[0,30]],false,8),'detail'));return fitParts(P,96);}});
// a small carved spiral, as a line
KO.curl=(x,y,r,turns=1.6,dir=1,a0=0)=>{const p=[];for(let i=0;i<=44;i++){const t=i/44,a=a0+dir*t*turns*2*Math.PI,q=r*(1-0.86*t);p.push([x+q*Math.cos(a),y+q*Math.sin(a)]);}return p;};
// the two grooves that run along a carved limb, with notches between
KO.grooves=(P,path,hw,k=0.42,step=0)=>{const n=24,a=[],b=[];for(let i=1;i<n;i++){const s=DS.at(path,i/n),h=hw(i/n)*k;a.push([s.x-s.ty*h,s.y+s.tx*h]);b.push([s.x+s.ty*h,s.y-s.tx*h]);
    if(step&&i%step===0)P.push(ln([[s.x-s.ty*h*0.7,s.y+s.tx*h*0.7],[s.x+s.ty*h*0.7,s.y-s.tx*h*0.7]],'detail'));}P.push(ln(a,'detail'),ln(b,'detail'));};
defMotif('heiTiki',{name:'Hei-tiki',term:'hei-tiki',meaning:'The best-known Māori pendant: a small figure with head tilted to one shoulder and hands on its thighs, worn at the throat and handed down the generations, gathering the standing of each wearer. A generic form is drawn here, not any heirloom.',
upright:true,figure:true,mirrorOk:true,fn(){const P=[];const T=pts=>G.xform(pts.map(([x,y])=>[x,y+14]),{x:1.5,y:-14,rot:13});const Td=(x,y)=>T([[x,y]])[0];
  for(const sx of [-1,1]){
    // legs folded under, feet meeting
    const leg=FK.spline([[sx*8,19],[sx*23.5,19.5],[sx*32,29],[sx*24,41],[sx*6.5,44.5]],false,10),lw=t=>6.9-1.9*t;
    P.push(mA(reg(DS.tube(leg,lw),'outer'),'stone'));KO.grooves(P,G.sub(leg,false,0.12,0.86),t=>lw(0.12+0.74*t),0.45,3);
    for(const dx of [0,3.3,6.6])P.push(ln([[sx*(2.6+dx),41.2],[sx*(1.8+dx),47]],'detail'));
    P.push(ln(KO.curl(sx*19.5,25.5,4.4,1.5,sx,sx>0?Math.PI:0),'inner'));
    // arms akimbo, three-fingered hands on the thighs
    const arm=FK.spline([[sx*18.5,-9],[sx*31,1],[sx*28.5,12.5],[sx*17,15.5]],false,10),aw=t=>5.4-0.8*t;
    P.push(mA(reg(DS.tube(arm,aw),'outer'),'stone'));KO.grooves(P,G.sub(arm,false,0.14,0.86),t=>aw(0.14+0.72*t),0.42,4);
    for(const k of [-1,0,1])P.push(mA(reg(DS.tube([[sx*17.5,15.6+k*3.3],[sx*7.6,17.6+k*4.2]],t=>1.95-0.45*t),'outer'),'stone'));
  }
  P.push(mA(reg(FK.spline([[-18,-12.5],[-23,-3],[-21,9.5],[-13,18.5],[0,21.5],[13,18.5],[21,9.5],[23,-3],[18,-12.5],[0,-16]],true,8),'outer'),'stone'));
  for(const sx of [-1,1])P.push(ln(KO.curl(sx*14.5,-5.5,5.2,1.6,sx,sx>0?Math.PI:0),'inner'));
  for(const y of [-1,5.5,12])P.push(ln([[-8.5,y],[0,y+5],[8.5,y]],'detail'));P.push(ln(G.circle(0,-6.5,1.7,14),'detail',true));
  // head, tilted onto the shoulder: brow ridges, shell eyes, flared nose, wide mouth with the tongue out
  P.push(mA(reg(T(FK.spline([[0,-50.5],[12,-51.5],[23.5,-46],[28.5,-36],[26.5,-25],[18.5,-17],[8,-13.4],[0,-12.6],[-8,-13.4],[-18.5,-17],[-26.5,-25],[-28.5,-36],[-23.5,-46],[-12,-51.5]],true,8)),'outer'),'stone'));
  for(const sx of [-1,1]){
    P.push(mA(reg(T(G.circle(sx*12.2,-33.2,8.5,40)),'inner'),'paua'));P.push(ln(T(G.circle(sx*12.2,-33.2,5.6,30)),'detail',true));P.push(reg(T(G.circle(sx*12.2,-33.2,2.5,18)),'detail',{solid:true}));
    P.push(reg(T(DS.tube(FK.spline([[sx*1.4,-29.5],[sx*4.5,-41],[sx*13.5,-45.6],[sx*24.5,-40]],false,8),t=>2.5-1.2*t)),'inner'));
    P.push(ln(T(FK.spline([[sx*15.6,-19.6],[sx*18.4,-17.6],[sx*16.2,-15.4]],false,5)),'detail'));
  }
  P.push(reg(T(FK.spline([[0,-30.5],[2.9,-25.6],[5.2,-23],[2.4,-21.4],[0,-22.4],[-2.4,-21.4],[-5.2,-23],[-2.9,-25.6]],true,6)),'inner'));
  P.push(mA(reg(T(FK.spline([[-15,-19.6],[-8,-22],[0,-20.4],[8,-22],[15,-19.6],[12.5,-15.2],[6,-13.8],[0,-15],[-6,-13.8],[-12.5,-15.2]],true,8)),'inner'),'mouth'));
  P.push(reg(T(FK.spline([[-3.2,-19.4],[3.2,-19.4],[3.5,-14.6],[0,-10.6],[-3.5,-14.6]],true,5)),'detail'));
  return fitParts(P,98);}});
defMotif('manaia',{name:'Manaia',term:'manaia',meaning:'A figure seen in profile, with a beaked head, one eye and often a hand at its mouth: a guardian that moves between the world of the living and the world of spirits. It flanks the main figures on lintels and bargeboards.',
upright:true,figure:true,mirrorOk:true,fn(){const P=[];
  const sp=FK.spline([[-2,-23],[-9.5,-12.5],[-11,1],[-4,13],[7,21],[11.5,32],[5,41.5],[-6.5,42.5],[-13.5,35],[-10,27.5],[-3.6,28.6]],false,12),bw=DS.prof([[0,8],[0.18,9.2],[0.42,9],[0.62,6.6],[0.84,4.2],[0.95,4.6],[1,4.6]]);
  // leg behind the body
  const leg=FK.spline([[1,13],[16.5,8],[24.5,13.5],[24,23]],false,8),lw=t=>5-1.4*t;P.push(mA(reg(DS.tube(leg,lw),'outer'),'stone'));KO.grooves(P,G.sub(leg,false,0.2,0.85),t=>lw(0.2+0.65*t),0.42,0);
  for(const a of [-30,0,30])P.push(mA(reg(DS.tube(G.xform([[0,0],[0,7]],{x:24,y:23,rot:a-6}),t=>1.5-0.45*t),'outer'),'stone'));
  P.push(mA(reg(DS.tube(sp,bw),'outer'),'stone'));
  KO.grooves(P,G.sub(sp,false,0.07,0.8),t=>bw(0.07+0.73*t),0.42,2);
  P.push(ln(KO.curl(-5.5,-12.5,4.8,1.6,1,0),'inner'));P.push(ln(KO.curl(2.5,14.5,4.2,1.5,-1,0),'inner'));
  // the beak: upper lip curling down, lower lip curling up, tongue between
  P.push(mA(reg(DS.tube(FK.spline([[12,-40],[23.5,-42],[31.5,-37],[32,-29],[28,-25.6]],false,10),t=>4.8-3.1*t),'outer'),'stone'));
  P.push(mA(reg(DS.tube(FK.spline([[8.5,-28],[16.5,-23],[25,-23.6],[29.5,-29.5]],false,10),t=>4.2-2.8*t),'outer'),'stone'));
  P.push(reg([[14.5,-35.2],[25.5,-33],[14.5,-30.4]],'detail'));
  // head
  P.push(mA(reg(FK.spline([[-12,-30],[-13.5,-40],[-7,-48],[4.5,-50],[14,-45.6],[17.5,-38],[14,-30],[5,-25],[-5,-25.2]],true,8),'outer'),'stone'));
  P.push(reg(DS.tube(FK.spline([[-10.5,-41.5],[-1,-47.6],[10.5,-44.6],[16,-39]],false,8),t=>2.1-0.8*t),'inner'));
  P.push(mA(reg(G.circle(2,-37.4,7.2,36),'inner'),'paua'));P.push(ln(G.circle(2,-37.4,4.6,26),'detail',true));P.push(reg(G.circle(2,-37.4,2.1,16),'detail',{solid:true}));
  P.push(mA(reg(KO.place(KO.koru({len:7,R:5,turns:0.9,w:1.25}),-10,-46,-52,true),'outer'),'stone'));
  // arm over the body, hand to the jaw
  const arm=FK.spline([[-5,-14],[9.5,-8.5],[18.5,-13],[19.5,-21]],false,8),aw=t=>4.4-1*t;P.push(mA(reg(DS.tube(arm,aw),'outer'),'stone'));KO.grooves(P,G.sub(arm,false,0.15,0.85),t=>aw(0.15+0.7*t),0.42,0);
  for(const a of [-30,0,30])P.push(mA(reg(DS.tube(G.xform([[0,0],[0,-6.6]],{x:19.5,y:-21,rot:a+8}),t=>1.45-0.45*t),'outer'),'stone'));
  return fitParts(P,98);}});

// ---------- kōwhaiwhai: rafter scrolls ----------
const kwEdges=(L,t)=>[kBg([[0,0],[L,0],[L,t*0.055],[0,t*0.055]]),kBg([[0,t*0.945],[L,t*0.945],[L,t],[0,t]])];
defBorder('kwMangopare',{name:'Mangōpare scroll',fn(L,t){
  const u=t*1.42,n=Math.max(1,Math.round(L/u)),w=L/n,o={len:t*0.5,R:Math.min(w,t)*0.17,turns:0.92,w:t*0.043,lean:0.25},P=[kCi([[0,0],[L,0],[L,t],[0,t]],0)];
  const unit=(x,up)=>{const y=up?t*0.97:t*0.03,rot=up?0:180;
    for(const f of [false,true]){const e=KO.eye(x+(f?-1:1)*o.w*0.9*(up?1:-1),y,rot,f,o);P.push(kCi(G.circle(e[0],e[1],o.R*0.98,28),1,'inner'));}
    for(const f of [false,true])P.push(kBg(KO.place(KO.koru(o),x+(f?-1:1)*o.w*0.9*(up?1:-1),y,rot,f)));};
  // dark bays behind the units that hang from the top edge
  for(let i=1;i<n;i++)P.push(kCi(G.arc(i*w,0,w*0.4,0,180,28).map(([x,y])=>[x,Math.min(t,y*1.5)]),1,'inner'));
  for(let i=0;i<n;i++)P.push(kCi(G.arc((i+0.5)*w,t,w*0.2,180,360,20).map(([x,y])=>[x,t-(t-y)*1.3]),1,'inner'));
  for(let i=0;i<n;i++)unit((i+0.5)*w,true);
  for(let i=1;i<n;i++)unit(i*w,false);
  return P.concat(kwEdges(L,t));}});
defBorder('kwNgutuKaka',{name:'Ngutu kākā scroll',fn(L,t){
  const lam=t*2.7,n=Math.max(1,Math.round(L/lam)),l=L/n,A=t*0.2,s=[];for(let i=0;i<=n*40;i++){const x=i/(n*40)*L;s.push([x,t/2-A*Math.sin(x/l*2*Math.PI)]);}
  const P=[kCi(s.concat([[L,0],[0,0]]),0),kCi(s.concat([[L,t],[0,t]]),1)];
  const o={len:t*0.3,R:t*0.175,turns:0.94,w:t*0.044,lean:0.6};
  for(let k=0;k<2*n;k++){const x=(k+0.5)*l/2,up=k%2===0,y=t/2-A*Math.sin(x/l*2*Math.PI);
    // a beak of a koru from each crest into the bay opposite, all leaning along the rafter
    const e=KO.eye(x,y,up?180:0,up,o);P.push(kCi(G.circle(e[0],e[1],o.R*0.98,24),up?0:1,'inner'));
    P.push(kBg(KO.place(KO.koru(o),x,y,up?180:0,up)));
    const o2={len:t*0.16,R:t*0.095,turns:0.9,w:t*0.024,lean:0.4},x2=x+l*0.25,y2=t/2-A*Math.sin(x2/l*2*Math.PI);if(x2<L-t*0.3)P.push(kBg(KO.place(KO.koru(o2),x2,y2,up?0:180,!up)));}
  P.push(kBg(G.band(s,t*0.07)));return P.concat(kwEdges(L,t));}});
defBorder('kwPatiki',{name:'Pātiki scroll',fn(L,t){
  const u=t*1.5,n=Math.max(1,Math.round(L/u)),w=L/n,P=[kCi([[0,0],[L,0],[L,t],[0,t]],0)];
  for(let i=0;i<n;i++){const x0=i*w,x1=x0+w,ym=t/2;
    const top=G.quad([x0,ym],[x0+w/2,-t*0.36],[x1,ym],24),bot=G.quad([x1,ym],[x0+w/2,t*1.36],[x0,ym],24),al=top.concat(bot.slice(1,-1));
    P.push(kCi(al,1,'inner'));
    const o={len:w*0.28,R:t*0.15,turns:0.92,w:t*0.038,lean:0.5};
    for(const [bx,rot,f] of [[x0+w*0.06,90,false],[x1-w*0.06,-90,false]]){const e=KO.eye(bx,ym,rot,f,o);P.push(kCi(G.circle(e[0],e[1],o.R*0.98,24),0,'inner'));P.push(kBg(KO.place(KO.koru(o),bx,ym,rot,f)));}
    P.push(kBg(G.band(al.concat([al[0]]),t*0.06)));
    // small koru in the spandrels between the almonds
    const o2={len:t*0.12,R:t*0.078,turns:0.88,w:t*0.02};if(i>0)for(const [yy,rot] of [[t*0.07,180],[t*0.93,0]])for(const f of [false,true])P.push(kBg(KO.place(KO.koru(o2),x0+(f?1:-1)*o2.w*1.2,yy,rot,rot===0?!f:f)));}
  return P.concat(kwEdges(L,t));}});
defBorder('kwPuhoro',{name:'Pūhoro scroll',fn(L,t){
  const u=t*1.45,n=Math.max(1,Math.round(L/u)),w=L/n,P=[kCi([[0,0],[L,0],[L,t],[0,t]],0)];
  for(let i=0;i<n;i++)if(i%2)P.push(kCi([[Math.max(0,i*w),0],[(i+1)*w,0],[(i+1)*w-t*0.36,t],[Math.max(0,i*w-t*0.36),t]],1,'inner'));
  const o={len:t*0.3,R:t*0.19,turns:0.94,w:t*0.048,lean:0.45};
  for(let i=0;i<n;i++){const x=(i+0.5)*w-t*0.18,y=t/2;
    for(const rot of [38,218]){const e=KO.eye(x,y,rot,false,o);P.push(kCi(G.circle(e[0],e[1],o.R*0.98,24),i%2?0:1,'inner'));}
    for(const rot of [38,218])P.push(kBg(KO.place(KO.koru(o),x,y,rot,false)));}
  for(let i=1;i<n;i++)P.push(kBg(G.band([[i*w,0],[i*w-t*0.36,t]],t*0.05)));
  return P.concat(kwEdges(L,t));}});

// ---------- carving and kirituhi bands ----------
defBorder('rauponga',{name:'Rauponga',fn(L,t){const P=[];for(const y of [0.08,0.19,0.3,0.7,0.81,0.92])P.push(ln([[0,t*y],[L,t*y]],'inner'));
  const n=Math.max(3,Math.round(L/(t*0.22))),w=L/n;for(let i=0;i<n;i++)P.push(reg([[i*w+w*0.12,t*0.4],[i*w+w*0.88,t*0.4],[i*w+w*0.5,t*0.61]],'outer'));return P;}});
defBorder('nihoTaniwha',{name:'Niho taniwha',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.66))),w=L/n,P=[ln([[0,t*0.06],[L,t*0.06]],'inner'),ln([[0,t*0.94],[L,t*0.94]],'inner')];
  for(let i=0;i<n;i++){const x=i*w,a=[x,t*0.9],b=[x+w,t*0.9],c=[x+w/2,t*0.1];P.push(reg([a,b,c],'outer'));
    for(const k of [0.3,0.52,0.74])P.push(ln([[lerp(a[0],b[0],k),t*0.9],[lerp(c[0],b[0],k),lerp(c[1],b[1],k)]],'detail'));}
  return P;}});
defBorder('unaunahi',{name:'Unaunahi',fn(L,t){const u=t*0.98,n=Math.max(2,Math.round(L/u)),w=L/n,P=[ln([[0,t*0.06],[L,t*0.06]],'inner'),ln([[0,t*0.94],[L,t*0.94]],'inner')];
  for(let i=0;i<n;i++){const cx=i*w+w*0.16,cy=t/2;for(let k=0;k<4;k++){const r=t*(0.16+k*0.085);P.push(ln(G.arc(cx,cy,r,-64,64,14).map(([x,y])=>[cx+(x-cx)*1.25,y]),k===3?'inner':'detail'));}}
  return P;}});
defBorder('aramoana',{name:'Aramoana',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.7))),w=L/n,P=[];
  for(const [y0,role] of [[0.16,'outer'],[0.36,'inner'],[0.56,'outer']]){const z=[];for(let i=0;i<=2*n;i++)z.push([i*w/2,t*(y0+(i%2?0.28:0))]);P.push(ln(z,role));}return P;}});
defBorder('koruChain',{name:'Koru chain',fn(L,t){const lam=t*1.9,n=Math.max(1,Math.round(L/lam)),l=L/n,A=t*0.17,s=[];for(let i=0;i<=n*36;i++){const x=i/(n*36)*L;s.push([x,t/2-A*Math.sin(x/l*2*Math.PI)]);}
  const P=[reg(G.band(s,t*0.07),'outer',{plain:true})],o={len:t*0.26,R:t*0.115,turns:0.9,w:t*0.048,lean:0.6};
  for(let k=0;k<2*n;k++){const x=(k+0.5)*l/2,up=k%2===0,y=t/2-A*Math.sin(x/l*2*Math.PI);P.push(reg(KO.place(KO.koru(o),x,y,up?180:0,up),'outer',{plain:true}));}return P;}});
defBorder('tanikoBand',{name:'Tāniko triangles',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.9))),w=L/n,P=[kCi([[0,0],[L,0],[L,t],[0,t]],0)];
  for(let i=0;i<n;i++){const x=i*w;P.push(kCi([[x,t],[x+w,t],[x+w/2,t*0.08]],1,'inner'));P.push(kBg([[x+w/2,t*0.42],[x+w*0.68,t*0.68],[x+w/2,t*0.94],[x+w*0.32,t*0.68]]));P.push(kBg([[x,t*0.06],[x+w*0.16,t*0.3],[x,t*0.54]].map(([a,b])=>[a,b]),'inner'));P.push(kBg([[x+w,t*0.06],[x+w*0.84,t*0.3],[x+w,t*0.54]]));}
  return P;}});

// bend a border strip along a curved spine: x runs along it, y across from offset o0 by width wd(u)
KO.bandParts=(key,spine,o0,wd,tMax,roleMap=true)=>{
  const S=G.samples(spine,false,Math.max(2,G.length(spine,false)/160)),N=S.length-1,L=G.length(spine,false);
  const at=(x,y)=>{const u=clamp(x/L),f=u*N,i=Math.min(N-1,Math.floor(f)),k=f-i,a=S[i],b=S[i+1],px=a.x+(b.x-a.x)*k,py=a.y+(b.y-a.y)*k,tx=a.tx+(b.tx-a.tx)*k,ty=a.ty+(b.ty-a.ty)*k,l=Math.hypot(tx,ty)||1,off=o0(u)+y/tMax*wd(u);return[px-ty/l*off,py+tx/l*off];};
  const dense=(pts,closed)=>{const out=[],P=closed?pts.concat([pts[0]]):pts;for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],m=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/5));for(let q=0;q<m;q++)out.push([a[0]+(b[0]-a[0])*q/m,a[1]+(b[1]-a[1])*q/m]);}if(!closed)out.push(P[P.length-1]);return out;};
  const fn=SG.borders[key]?SG.borders[key].fn:SG.borders.lines.fn,out=[];
  for(const p of fn(L,tMax)){
    if(p.kind==='dot'){const q=at(p.x,p.y),u=clamp(p.x/L);out.push(Object.assign({},p,{x:q[0],y:q[1],r:p.r*Math.max(0.3,wd(u)/tMax),role:'detail'}));continue;}
    out.push(Object.assign({},p,{pts:dense(p.pts,p.closed).map(([x,y])=>at(x,y)),role:roleMap?(p.role==='outer'?'inner':'detail'):p.role,plain:true}));
  }
  return{parts:out,at,L};
};

// ---------- lattice: tukutuku stitches and tāniko triangles ----------
/* A tukutuku panel is a grid of slats lashed with cross-stitches; the pattern is a rule
   from a cell (i,j) to a stitch colour (or none). Colours are palette positions (`ci`). */
function tukuTile(rule,bar){return function(W,H,u){
  const c=Math.max(u*0.22,Math.sqrt(W*H)/54,6),nx=Math.ceil(W/c),ny=Math.ceil(H/c),P=[];
  for(let j=0;j<=ny;j++)P.push({kind:'line',role:'detail',pts:[[0,j*c],[W,j*c]],closed:false,noSeed:true});
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const k=rule(i,j);if(k==null||k<0)continue;const x=i*c,y=j*c,m=c*0.16;
    P.push(bar?{kind:'line',role:'inner',ci:k+2,pts:[[x+c/2,y+m*0.4],[x+c/2,y+c-m*0.4]],closed:false,noSeed:true}
              :{kind:'line',role:'inner',ci:k+2,pts:[[x+m,y+m],[x+c-m,y+c-m],[x+c/2,y+c/2],[x+c-m,y+m],[x+m,y+c-m]],closed:false,noSeed:true});}
  return P;};}
const md=(a,n)=>((a%n)+n)%n;
defTile('poutama',{name:'Stairway',term:'poutama',meaning:'Steps climbing across the panel: the stairway Tāne climbed to the highest heaven to bring back the baskets of knowledge. Learning, and striving upward.',
fn:tukuTile((i,j)=>{const q=md(Math.floor((i+2*Math.floor(j/2))/4),4);return q===0?0:q===2?1:-1;})});
defTile('patikitiki',{name:'Flounder',term:'pātikitiki',meaning:'Nested diamonds, the shape of the flounder: plenty of food, and the hospitality a house owes its guests.',
fn:tukuTile((i,j)=>{const d=Math.abs(md(i,12)-6)+Math.abs(md(j,12)-6);return d%4<2?(d<6?0:1):-1;})});
defTile('kaokao',{name:'Ribs',term:'kaokao',meaning:'Chevrons across the panel: the sides and arms of warriors in the haka, or the ribs of the house. Strength, and shelter.',
fn:tukuTile((i,j)=>{const v=md(j+Math.abs(md(i,10)-5),8);return v<3?0:v===4||v===5?1:-1;})});
defTile('nihoTile',{name:'Dragon\'s teeth',term:'niho taniwha',meaning:'Rows of triangles: the teeth of the taniwha, the guardian of a river or coast. The mark of a chief\'s line, and of a storyteller.',
fn:tukuTile((i,j)=>{const b=Math.floor(j/6),r=md(j,6),x=md(i+(b%2?6:0),12);return Math.abs(x-6)<=r?b%2:-1;})});
defTile('purapuraWhetu',{name:'Star seeds',term:'purapura whetū',meaning:'A cross-stitch in every other cell, like stars sown across the sky: the many people of a tribe, and the need for many hands.',
fn:tukuTile((i,j)=>(i+j)%2?-1:(md(i*7+j*3,5)===0?1:0))});
defTile('roimataToroa',{name:'Albatross tears',term:'roimata toroa',meaning:'Blocks of upright stitches falling in alternate columns: the tears of the albatross. Misfortune, and loss remembered.',
fn:tukuTile((i,j)=>{const b=Math.floor(j/5);return md(i,2)===md(b,2)?b%2:-1;},true)});
defTile('aronui',{name:'Tāniko triangles',term:'aronui',meaning:'Triangles stacked point to base in the woven border of a cloak: the pursuit of knowledge of the natural world.',
fn(W,H,u){const s=Math.max(u*0.8,Math.sqrt(W*H)/22),h=s*0.92,P=[];
  for(let j=0;j*h<H+h;j++)for(let i=-1;i*s<W+s;i++){const x=i*s+(j%2?s/2:0),y=j*h;P.push({kind:'region',closed:true,role:'inner',ci:j%2,ns:true,pts:[[x,y+h],[x+s,y+h],[x+s/2,y]]});
    P.push({kind:'region',closed:true,role:'detail',bg:true,pts:[[x+s/2,y+h*0.42],[x+s*0.66,y+h*0.7],[x+s/2,y+h*0.96],[x+s*0.34,y+h*0.7]]});}
  return P;}});
defTile('aramoanaTile',{name:'Sea path',term:'aramoana',meaning:'Zigzag bands running side by side: the pathways of the ocean, and the way to a destination.',
fn(W,H,u){const s=Math.max(u*0.7,Math.sqrt(W*H)/26),h=s*0.62,P=[];
  for(let j=-2;j*h<H+2*h;j++){const top=[],bot=[];for(let i=0;i*s/2<=W+s;i++){const x=i*s/2,dy=i%2?h*0.9:0;top.push([x,j*h+dy]);bot.push([x,(j+1)*h+dy]);}
    if(md(j,3)<2)P.push({kind:'region',closed:true,role:'inner',ci:md(j,3),ns:true,pts:top.concat(bot.reverse())});}
  return P;}});

// ---------- structures ----------
/* Unfurling bands (pūhoro, kirituhi). The main form is one S-shaped stem: it starts as a
   bulb, winds out through a spiral of a turn and a quarter (the koru), leaves it at a
   tangent, sweeps the other way and closes in a small curl. Bands are stacked on the
   outer side of the spiral's last turn and on the outer side of the tail; every band is
   a border pattern bent along the curve, so it narrows and its teeth shrink toward the
   ends. Smaller koru with a band or two go wherever they fit. */
KO.sStem=(rng,m)=>{
  const dir=rng.chance(.5)?1:-1,g=rng.range(2.4,2.9),turns=rng.range(1.2,1.36),R1=m*rng.range(0.19,0.23),th1=turns*2*Math.PI,k1=Math.log(g)/(2*Math.PI),r0=R1/Math.exp(k1*th1),a0=rng.range(0,6.283);
  const head=[];for(let i=0;i<=170;i++){const th=th1*i/170,r=r0*Math.exp(k1*th),a=a0+dir*th;head.push([r*Math.cos(a),r*Math.sin(a)]);}
  // tail: a spiral turning the other way, its radius shrinking, joined at the head's end with the tangent matched
  const R2=m*rng.range(0.34,0.44),th2=2*Math.PI*rng.range(0.62,0.8),k2=Math.log(rng.range(5,7))/th2,loc=[];
  for(let i=0;i<=150;i++){const ph=th2*i/150,r=R2*Math.exp(-k2*ph),a=-dir*ph;loc.push([r*Math.cos(a),r*Math.sin(a)]);}
  const n=head.length,T=Math.atan2(head[n-1][1]-head[n-2][1],head[n-1][0]-head[n-2][0]),t0=Math.atan2(loc[1][1]-loc[0][1],loc[1][0]-loc[0][0]),rot=T-t0,c=Math.cos(rot),sn=Math.sin(rot),P=head[n-1];
  const tail=loc.map(([x,y])=>{x-=loc[0][0];y-=loc[0][1];return[P[0]+x*c-y*sn,P[1]+x*sn+y*c];});
  // where the last turn of the head begins, as a fraction of the head's length
  const cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+Math.hypot(head[i][0]-head[i-1][0],head[i][1]-head[i-1][1]));
  const iB=Math.round(170*(1-0.8/turns)),fB=cum[iB]/cum[n-1];
  return{head,tail,dir,r0,fB};
};
defStructure('puhoro',{name:'Unfurling bands',blurb:'One great koru whose stem sweeps on into an S, with tapering bands stacked along its outer curves — each band filled with a different small repeat that shrinks toward its tail. The layout of kirituhi and of painted pūhoro.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,d=clamp(S.density),m=Math.min(W,H);
  const keys=rng.shuffle([...new Set(poolAll(g.motifs.border))].filter(k=>SG.borders[k]&&k!=='lines'&&!/^kw|^eg|taotie|ruyiBand|tanikoBand|seigaihaBand/.test(k)));let ki=0;const nextKey=()=>keys.length?keys[ki++%keys.length]:'zigzag';
  // a stack of bands on one side of a spine; widths are fractions of the scale k
  const stack=(sp,sgn,inner,nb,k,tag,test)=>{
    let prev=inner;const own=[];
    for(let j=0;j<nb;j++){const a=0.02+0.06*j+rng.range(0,0.03),b=1-0.03-0.05*j-rng.range(0,0.04),Wj=k*rng.range(0.05,0.074)*(1-0.07*j),head=rng.range(0.1,0.2);
      const wf=u=>{const v=(u-a)/(b-a);if(v<=0||v>=1)return 0;return Wj*(v<head?Math.pow(v/head,0.55):Math.pow(1-(v-head)/(1-head),0.7));};
      const base=prev,gap=k*0.0075,sub=G.sub(sp,false,a,b),uu=v=>a+v*(b-a);
      const R=KO.bandParts(nextKey(),sub,v=>sgn*base(uu(v)),v=>sgn*wf(uu(v)),Wj);
      const lo=[],hi=[],circ=[];for(let i=0;i<=96;i++){const x=R.L*i/96;lo.push(R.at(x,0));hi.push(R.at(x,Wj));if(i%4===0){const mid=R.at(x,Wj/2);circ.push([mid[0],mid[1],wf(uu(i/96))*0.5+k*0.004]);}}
      if(test&&!circ.every(([x,y,r])=>r<k*0.008||ctx.free(x,y,r,k*0.006)))break;
      ctx.items.push({type:'parts',parts:[{kind:'region',closed:true,role:'outer',plain:true,pts:lo.concat(hi.reverse())}].concat(R.parts),role:'ring',variant:tag+j,knockOk:true});
      own.push(...circ);prev=u=>base(u)+wf(u)+(wf(u)>0?gap:0);
    }
    // a whisker stroke beyond the last band
    const a=rng.range(0.15,0.4),b=Math.min(0.96,a+rng.range(0.25,0.4)),ws=G.samples(G.sub(sp,false,a,b),false,6),n=ws.length-1;
    ctx.parts([{kind:'line',role:'inner',closed:false,pts:ws.map((q,i)=>{const o=sgn*(prev(a+(b-a)*i/n)+k*0.014);return[q.x-q.ty*o,q.y+q.tx*o];})}],'ring');
    return own;
  };
  // ----- the main stem, fitted to the canvas -----
  let F=null;for(let t=0;t<14;t++){const c=KO.sStem(rng.fork('s'+t),m),bb=G.bbox(c.head.concat(c.tail)),ar=Math.min(bb.w,bb.h)/Math.max(bb.w,bb.h);if(!F||ar>F.ar)F=Object.assign(c,{bb,ar});}
  const pad=m*0.2,sc=Math.min((W-2*pad)/F.bb.w,(H-2*pad)/F.bb.h,1.35),X=p=>[W/2+(p[0]-F.bb.cx)*sc,H/2+(p[1]-F.bb.cy)*sc];
  const head=F.head.map(X),tail=F.tail.map(X),k=m*sc,r0=F.r0*sc,spine=head.concat(tail.slice(1));
  const Lh=G.length(head,false),Lt=G.length(tail,false),fj=Lh/(Lh+Lt),wc=k*0.024;
  // the stem: bulb, neck, swelling through the head, thinning along the tail to a small bulb
  const core=u=>{if(u<fj){const v=u/fj;return v<0.05?lerp(r0*0.66,r0*0.3,v/0.05):lerp(r0*0.3,wc,Math.pow((v-0.05)/0.95,0.6));}const v=(u-fj)/(1-fj);return v>0.94?lerp(wc*0.42,wc*0.95,(v-0.94)/0.06):lerp(wc,wc*0.42,v/0.94);};
  ctx.items.push({type:'parts',parts:[{kind:'region',closed:true,role:'outer',plain:true,pts:KO.tube(spine,core,320)}],role:'ring',variant:'stem',knockOk:true});
  const stemC=[];G.samples(spine,false,k*0.02).forEach((q,i,a)=>stemC.push([q.x,q.y,core(i/(a.length-1))+k*0.004]));
  // bands round the outside of the head's last turn
  const hs=G.sub(head,false,F.fB,0.985),hOff=u=>core((F.fB+u*(0.985-F.fB))*fj)+k*0.008;
  const c1=stack(hs,-F.dir,hOff,3+Math.round(d*2),k,'hb',false);
  const nH=Math.round(stemC.length*fj);for(const c of stemC.slice(0,nH))ctx.occ.push(c);for(const c of c1)ctx.occ.push(c);
  // bands along the outside of the tail, kept clear of the head
  const ta=0.1,tb=0.74,ts=G.sub(tail,false,ta,tb),tOff=u=>core(fj+(ta+u*(tb-ta))*(1-fj))+k*0.008;
  const c2=stack(ts,F.dir,tOff,3+Math.round(d*2),k,'tb',true);for(const c of c2)ctx.occ.push(c);for(const c of stemC.slice(nH))ctx.occ.push(c);
  // ----- smaller koru with a band or two, wherever they fit -----
  let placed=0;
  for(let t=0;t<400&&placed<2+Math.round(d*2);t++){
    const R=m*(placed?rng.range(0.07,0.11):rng.range(0.1,0.15)),dir=rng.chance(.5)?1:-1,gq=2.5,turns=rng.range(1.05,1.25),th1=turns*2*Math.PI,k1=Math.log(gq)/(2*Math.PI),q0=R/Math.exp(k1*th1),a0=rng.range(0,6.283),cx=rng.range(R,W-R),cy=rng.range(R,H-R);
    const sp=[];for(let i=0;i<=110;i++){const th=th1*i/110,r=q0*Math.exp(k1*th),a=a0+dir*th;sp.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}
    const kk=R/0.21,wq=kk*0.02,cr=u=>u<0.06?lerp(q0*0.66,q0*0.3,u/0.06):u>0.9?lerp(wq,wq*0.3,(u-0.9)/0.1):lerp(q0*0.3,wq,Math.pow((u-0.06)/0.84,0.6));
    if(!ctx.free(cx,cy,R*1.5,m*0.01)||cx<R*1.5||cy<R*1.5||cx>W-R*1.5||cy>H-R*1.5)continue;
    ctx.items.push({type:'parts',parts:[{kind:'region',closed:true,role:'outer',plain:true,pts:KO.tube(sp,cr,150)}],role:'ring',variant:'k'+placed,knockOk:true});
    const fB=1-0.78/turns,cs=stack(G.sub(sp,false,fB+0.1,0.97),-dir,u=>cr(fB+0.1+u*(0.87-fB))+kk*0.008,placed?1:2,kk,'k'+placed+'b',false);
    ctx.occ.push([cx,cy,R*1.18]);for(const c of cs)ctx.occ.push(c);placed++;
  }
  // the subject goes in the largest open bay
  let best=null;for(let t=0;t<600;t++){const x=rng.range(m*0.08,W-m*0.08),y=rng.range(m*0.08,H-m*0.08);let r=Math.min(x,y,W-x,H-y)-m*0.02;for(const [ox,oy,or] of ctx.occ){r=Math.min(r,Math.hypot(x-ox,y-oy)-or);if(r<m*0.05)break;}if(r>=m*0.05&&(!best||r>best[2]))best=[x,y,r];}
  if(best&&best[2]>m*0.07){const hk=ctx.pick('hero');ctx.motif(hk,best[0],best[1],Math.min(m*0.3,best[2]*1.84),{role:'hero',variant:'hero'});}
  scatter(ctx,{inside:(x,y,r)=>x-r>12&&x+r<W-12&&y-r>12&&y+r<H-12,box:{x0:0,y0:0,x1:W,y1:H},count:Math.round(1+d*7),smin:m*0.05,smax:m*0.085});
}});

/* Meeting-house wall: carved posts (poupou) alternate with lattice panels (tukutuku);
   a painted rafter (heke) runs above, a skirting board below. */
defStructure('wharenui',{name:'Meeting-house wall',blurb:'Carved posts alternating with lattice panels, under a painted rafter and over a skirting band — the inside wall of a wharenui.',
fn(ctx){
  const {W,H,g,rng}=ctx;const x0=28,x1=W-28,y0=28,y1=H-28;
  const bk=[...new Set(poolAll(g.motifs.border))].filter(k=>SG.borders[k]&&k!=='lines'),kw=bk.filter(k=>/^kw/.test(k)),rest=bk.filter(k=>!/^kw/.test(k));
  const rect=(a,b,c,e)=>[[a,b],[c,b],[c,e],[a,e]];
  const strip=(key,sx,sy,sw,sh)=>{const P=[];for(const p of SG.borders[key].fn(sw,sh)){if(p.kind==='dot')P.push(Object.assign({},p,{x:p.x+sx,y:p.y+sy}));else P.push(Object.assign({},p,{pts:p.pts.map(([a,b])=>[a+sx,b+sy])}));}
    P.push({kind:'line',closed:true,role:'outer',pts:rect(sx,sy,sx+sw,sy+sh)});ctx.items.push({type:'parts',parts:P,role:'border',variant:'st'+sy.toFixed(0)});};
  const hTop=(y1-y0)*0.17,hBot=(y1-y0)*0.075,gap=12;
  strip(rng.pick(kw.length?kw:bk.length?bk:['zigzag']),x0,y0,x1-x0,hTop);
  strip(rng.pick(rest.length?rest:bk.length?bk:['zigzag']),x0,y1-hBot,x1-x0,hBot);
  const py0=y0+hTop+gap,py1=y1-hBot-gap,nP=rng.pick([2,2,3]),nT=nP+1,tot=x1-x0-(nP+nT-1)*gap,pw=tot*(nP===3?0.19:0.24),tw=(tot-nP*pw)/nT;
  const tiles=rng.shuffle(poolAll(g.motifs.tile).filter(k=>SG.tiles[k]));let x=x0;
  for(let i=0;i<nP+nT;i++){
    if(i%2===0){const r={x0:x,y0:py0,x1:x+tw,y1:py1};
      ctx.items.push({type:'parts',parts:tileParts(tiles.length?tiles[(i/2)%tiles.length]:'ichimatsu',r,tw*0.5,rng.fork('t'+i)).concat([{kind:'line',closed:true,role:'outer',pts:rect(r.x0,r.y0,r.x1,r.y1)}]),role:'frame',variant:'tk'+(i/2)%Math.max(1,tiles.length)});x+=tw+gap;}
    else{ // a post: a board with a stack of figures
      ctx.parts([{kind:'region',closed:true,role:'outer',plain:true,ci:0,pts:rect(x,py0,x+pw,py1)},{kind:'line',closed:false,role:'inner',pts:[[x+pw*0.08,py0],[x+pw*0.08,py1]]},{kind:'line',closed:false,role:'inner',pts:[[x+pw*0.92,py0],[x+pw*0.92,py1]]}],'ring');
      const k=Math.max(2,Math.round((py1-py0)/(pw*1.12))),ch=(py1-py0)/k,hk=ctx.pick('hero'),rk=ctx.pick('ring');
      for(let q=0;q<k;q++)ctx.motif(q%2===0?hk:rk,x+pw/2,py0+(q+0.5)*ch,Math.min(pw*0.82,ch*0.94),{role:q===0?'hero':'ring',variant:'pou'+(q%2),noOcc:true});
      x+=pw+gap;}
  }
}});
