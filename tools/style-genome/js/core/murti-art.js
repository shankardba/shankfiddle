'use strict';
/* Mūrti kit, the drawing itself: how each part is drawn, to the standard of devotional line
   art (calendar-print line drawing and bronze-icon convention). This file holds the hand;
   murti.js holds the assembly and the registry of re-mixable parts.

   What the references taught, part by part:
   - faces are broad and soft; eyes are small, long and lidded, with the iris tucked under the
     upper lid; brows are thin and high; the nose is two light lines and the nostrils; the mouth is small
   - crowns are domes built of leaf plates and scallop rows, wider than the head, never a bare cone
   - a raised hand is ONE silhouette with the fingers together, parted by lines
   - beads are small open circles, not black dots; necklaces are bands with a fringe of drops
   - cloth is described by many parallel fold lines; no large surface is left blank */

/* ================= head ================= */
function mkEarring(K,x,y,kind,s){
  if(kind==='none')return;
  if(kind==='jhumka'){ // stud, bell and a fringe of beads
    K.C(x,y-0.1,0.62,'metal','inner');K.C(x,y-0.1,0.26,'gem','detail',{lod:2,n:8});
    K.Ro([[x-1.45,y-2.5],[x-1.2,y-1.4],[x-0.6,y-0.85],[x,y-0.7],[x+0.6,y-0.85],[x+1.2,y-1.4],[x+1.45,y-2.5]],'metal','inner');
    K.L([[x-1.1,y-1.6],[x,y-1.2],[x+1.1,y-1.6]],'detail',{lod:2});for(const dx of [-1.05,-0.35,0.35,1.05])K.C(x+dx,y-2.9,0.3,'pearl','detail',{lod:1,n:8});return;}
  if(kind==='makara'){ // curling fish-dragon ear pendant
    K.R([[x-0.4,y+0.2],[x+s*1.4,y-0.2],[x+s*2.3,y-1.4],[x+s*2.2,y-2.9],[x+s*1.2,y-3.8],[x-s*0.1,y-3.5],[x+s*0.5,y-2.6],[x+s*1.0,y-1.8],[x+s*0.3,y-1.2]],'metal','inner');
    K.L([[x+s*0.4,y-0.5],[x+s*1.5,y-1.2],[x+s*1.6,y-2.6]],'detail',{lod:2});K.C(x+s*0.9,y-4.5,0.36,'pearl','detail',{lod:1,n:8});return;}
  // ring with a flower stud and a drop
  K.ring(x,y-1.5,1.55,'inner',{n:22});K.ring(x,y-1.5,1.1,'detail',{lod:2,n:18});K.C(x,y-1.5,0.5,'gem','detail',{lod:1,n:10});
  mkPetal(K,x,y-3.1,1.5,0.5,180,'metal','detail',{round:true,lod:1});
}
// frontal face: origin at the chin, hairline at y = 12, widest at the cheeks
function mkFace(K,o={}){
  const sk=o.skin||'skin',fierce=o.mood==='fierce';
  K.M(s=>{K.R([[s*5.1,8.9],[s*6.1,9.2],[s*6.75,8.3],[s*6.7,6.8],[s*6.3,5.6],[s*6.2,4.3],[s*5.8,3.2],[s*5.25,3.3],[s*5.1,5.0]],sk,'outer');
    K.L([[s*5.6,8.4],[s*6.2,8.0],[s*6.2,6.9],[s*5.7,6.2]],'detail',{lod:2});mkEarring(K,s*5.75,3.2,o.earring||'ring',s);});
  if(o.monkey){const fr=[];for(let i=0;i<26;i++){const a=i*360/26+7,r=i%2?1.0:1.17;fr.push([Math.cos(a*DEG)*6.4*r,6.5+Math.sin(a*DEG)*7.8*r]);}K.R(fr,'hair','outer',{seg:4});}
  const half=[[0,-0.1],[1.7,0.1],[3.3,1.0],[4.5,2.7],[5.2,4.8],[5.45,7.0],[5.4,9.2],[5.0,11.2],[4.1,12.8],[2.4,13.8],[0,14.1]];
  K.R(half.concat(half.slice(1,-1).reverse().map(([x,y])=>[-x,y])),sk,'outer');
  // eyes: small, long, lidded; the iris sits under the upper lid
  K.M(s=>{
    const up=[[s*1.15,6.85],[s*1.7,7.42],[s*2.45,7.66],[s*3.2,7.5],[s*3.78,7.05]],lo=[[s*3.78,7.05],[s*3.15,6.64],[s*2.45,6.52],[s*1.75,6.58],[s*1.15,6.85]];
    if(o.eyes==='closed'){K.T([[s*1.1,7.2],[s*1.7,6.86],[s*2.45,6.74],[s*3.2,6.86],[s*3.85,7.22]],t=>0.05+0.1*Math.sin(Math.PI*t),null,'outer',{paint:'ink'});
      K.L([[s*1.25,7.72],[s*2.45,8.08],[s*3.7,7.76]],'detail',{lod:2});for(const a of [1.6,2.1,2.8,3.3])K.L([[s*a,6.72+0.1*Math.abs(a-2.45)],[s*(a+0.05),6.42+0.1*Math.abs(a-2.45)]],'detail',{raw:true,lod:3});return;}
    K.Rp(G.chain(FK.spline(up,false,6),FK.spline(lo,false,6)).slice(0,-1),'eye','detail');
    K.C(s*2.45,7.16,fierce?0.56:0.5,null,'detail',{paint:'ink',n:14});
    K.T(up.concat([[s*4.25,7.12]]),t=>0.035+0.115*Math.sin(Math.PI*Math.min(1,t*1.12)),null,'outer',{paint:'ink'});
    K.L([[s*1.3,7.72],[s*2.45,8.12],[s*3.65,7.86]],'detail',{lod:2});
  });
  K.M(s=>K.T(fierce?[[s*0.75,8.5],[s*1.6,9.1],[s*2.8,9.72],[s*3.8,9.84],[s*4.7,9.5]]:[[s*0.95,8.78],[s*1.7,9.24],[s*2.7,9.5],[s*3.7,9.36],[s*4.65,8.86]],t=>0.15-0.11*t,null,'outer',{paint:'ink'}));
  if(o.monkey){
    K.R([[-3.5,4.2],[-2.7,5.7],[0,6.2],[2.7,5.7],[3.5,4.2],[3.3,2.2],[1.9,0.9],[0,0.6],[-1.9,0.9],[-3.3,2.2]],'muzzle','inner');
    K.M(s=>{K.L([[s*0.5,8.4],[s*0.42,6.7],[s*0.9,5.7]],'detail',{lod:1});K.L([[s*0.2,4.8],[s*0.75,4.4],[s*1.15,4.95]],'inner');K.L([[s*3.6,5.3],[s*4.4,4.5],[s*4.3,3.1]],'detail',{lod:2});
      for(const [a,b] of [[1.6,1.4],[2.4,2.0],[2.9,2.9]])K.L([[s*a,b],[s*(a+0.35),b-0.5]],'detail',{raw:true,lod:3});});
    K.L([[0,4.55],[0,3.1]],'detail',{raw:true,lod:1});K.L([[-2.6,3.0],[-1.2,2.55],[0,2.75],[1.2,2.55],[2.6,3.0]],'inner');K.L([[-1.2,1.9],[0,1.65],[1.2,1.9]],'detail',{lod:2});
  }else{
    // nose: a longer line on one side, a shorter on the other, and the nostrils
    K.L([[-0.52,8.5],[-0.4,6.7],[-0.48,5.4],[-0.9,4.75],[-1.02,4.3],[-0.68,3.98]],'detail',{wk:1.25});
    K.L([[0.5,5.9],[0.52,5.3],[0.9,4.75],[1.02,4.3],[0.68,3.98]],'detail',{wk:1.25});
    K.L([[-0.68,3.98],[-0.3,4.12],[0,3.9],[0.3,4.12],[0.68,3.98]],'detail',{wk:1.25});
    // mouth: small; a bowed upper lip, the parting line, a fuller lower lip
    K.R([[-1.28,2.76],[-0.62,3.0],[-0.18,3.08],[0,2.97],[0.18,3.08],[0.62,3.0],[1.28,2.76],[0.5,2.66],[0,2.7],[-0.5,2.66]],'lip','detail',{wk:1.2});
    K.R([[-1.28,2.76],[-0.5,2.66],[0,2.7],[0.5,2.66],[1.28,2.76],[0.82,2.2],[0,2.0],[-0.82,2.2]],'lip','detail',{wk:1.2});
    K.M(s=>K.L([[s*1.36,2.92],[s*1.5,2.74],[s*1.42,2.6]],'detail',{lod:2}));K.L([[-0.7,1.2],[0,1.02],[0.7,1.2]],'detail',{lod:2});
  }
  if(o.tilak==='urdhva'){K.M(s=>K.T([[s*0.95,12.2],[s*0.78,10.6],[s*0.5,9.4],[0,8.75]],0.11,'tilak','inner'));K.R([[0,11.9],[0.24,10.6],[0,9.4],[-0.24,10.6]],null,'detail',{paint:'accent'});}
  else if(o.tilak==='tripundra'){for(const y of [9.95,10.6,11.25])K.L([[-3.2,y-0.2],[0,y],[3.2,y-0.2]],'inner');K.R([[0,11.45],[0.42,10.6],[0,9.75],[-0.42,10.6]],'eye','inner');K.C(0,10.6,0.22,null,'detail',{paint:'ink',n:8});}
  else if(o.tilak==='trinetra'){K.R([[0,11.6],[0.5,10.6],[0,9.6],[-0.5,10.6]],'eye','inner');K.C(0,10.6,0.3,null,'detail',{paint:'ink',n:10});}
  else if(o.tilak==='bindu'){K.C(0,9.7,0.42,null,'detail',{paint:'accent',n:12});K.R([[0,11.5],[0.2,10.7],[0,10.3],[-0.2,10.7]],null,'detail',{paint:'accent',lod:1});}
  else if(o.tilak==='trident'){K.L([[0,9.6],[0,11.4]],'inner',{raw:true});K.L([[-0.9,11.3],[-0.7,10.4],[0,10.1],[0.7,10.4],[0.9,11.3]],'inner');K.C(0,9.3,0.32,null,'detail',{paint:'accent',n:10});}
}
function mkHairCap(K,o={}){
  K.R([[-5.3,10.2],[-4.0,11.75],[-1.8,12.4],[0,12.1],[1.8,12.4],[4.0,11.75],[5.3,10.2],[5.75,12.2],[4.5,14.0],[0,14.8],[-4.5,14.0],[-5.75,12.2]],'hair','outer',o.solid?{paint:'ink'}:null);
  if(!o.solid)K.M(s=>{for(const [a,b,c,d] of [[0.4,12.3,2.4,14.2],[1.6,12.5,3.8,13.8],[3.0,12.2,5.0,12.9]])K.L([[s*a,b],[s*(a+c)/2,(b+d)/2+0.35],[s*c,d]],'detail',{lod:3});});
}
// waves of hair framing the face and resting on the shoulders (Rāma, Kṛṣṇa)
function mkCurls(K){K.M(s=>{
  K.R([[s*5.2,10.8],[s*6.6,9.6],[s*7.4,7.4],[s*7.0,5.0],[s*7.9,3.0],[s*7.4,0.6],[s*8.4,-1.6],[s*7.6,-4.0],[s*6.2,-4.6],[s*5.6,-2.6],[s*6.0,0.2],[s*5.4,2.6],[s*5.6,6.0]],'hair','outer');
  for(const [x0,y0] of [[6.3,8.4],[6.5,5.4],[6.9,2.4],[6.8,-0.6],[7.0,-3.0]])K.L([[s*(x0-0.7),y0+1.0],[s*(x0+0.5),y0+0.4],[s*(x0+0.3),y0-0.8],[s*(x0-0.5),y0-0.7]],'detail',{lod:1});
  K.L([[s*5.7,9.6],[s*6.2,7.0],[s*5.9,4.2]],'detail',{lod:2});});}

/* ================= crowns =================
   origin at the middle of the hairline; w = half-width of the head there. */
// a pointed-arch plate (the leaf plates that front a crown), base centre at (x,y)
function mkPlate(K,x,y,h,hw,rot,o={}){
  const S=K.sub({x,y,rot});const sh=[[-hw,0],[-hw*1.04,h*0.42],[-hw*0.7,h*0.72],[-hw*0.2,h*0.9],[0,h],[hw*0.2,h*0.9],[hw*0.7,h*0.72],[hw*1.04,h*0.42],[hw,0]];
  S.Ro(sh,'metal','inner',o);S.L(sh.map(([a,b])=>[a*0.7,h*0.08+b*0.76]),'detail',{lod:(o.lod||0)+1});
  if(o.gem!==false)S.Rp(G.ellipse(0,h*0.36,hw*0.3,h*0.2,12),'gem','detail',{lod:(o.lod||0)+1});
  if(o.sun){for(let i=0;i<12;i++){const a=i*30,p0=mkPol(hw*0.36,a-10),p1=mkPol(hw*0.62,a),p2=mkPol(hw*0.36,a+10);S.Rp([[p0[0],h*0.4+p0[1]],[p1[0],h*0.4+p1[1]],[p2[0],h*0.4+p2[1]]],'metal','detail',{lod:2});}S.C(0,h*0.4,hw*0.36,'gem','detail',{n:14});}
}
function mkBrowBand(K,w,o={}){
  const top=[],bot=[];for(let i=0;i<=14;i++){const u=i/7-1;top.push([u*w*1.16,0.95+0.55*(1-u*u)]);bot.push([u*w*1.14,-0.85+0.5*(1-u*u)]);}
  K.Rp(top.concat(bot.slice().reverse()),'metal','outer');K.L(top.map(([x,y])=>[x*0.98,y-0.36]),'detail',{raw:true,lod:1});K.L(bot.map(([x,y])=>[x*0.98,y+0.34]),'detail',{raw:true,lod:1});
  for(let j=0;j<9;j++){const u=(j-4)/4.5,x=u*w*1.14,y=0.05+0.52*(1-u*u);if(j%2)K.C(x,y,0.3,'pearl','detail',{lod:1,n:8});else K.Rp(G.ellipse(x,y,0.72,0.44,12),'gem','detail',{lod:1});}
  if(o.pendant!==false){K.L([[0,-0.4],[0,-1.2]],'detail',{raw:true,lod:1});mkPetal(K,0,-1.1,1.6,0.6,180,'gem','inner',{round:true,lod:1});K.M(s=>K.C(s*0.95,-1.25,0.26,'pearl','detail',{lod:2,n:8}));}
}
function mkCrown(K,o={}){
  const w=o.w||5.7,kar=o.kind==='karanda',W=w*1.2,H=o.h||(kar?14:12);
  // cords of beads hanging beside the ears, ending in a tassel
  if(o.tassel!==false)K.M(s=>{const cord=[[s*W*1.02,0.2],[s*W*1.12,-2.6],[s*W*1.06,-5.4]];K.L(cord,'detail');K.beads(cord,0.95,0.3,{lod:1});
    K.Ro([[s*W*1.06-0.75,-5.4],[s*W*1.06-0.95,-7.6],[s*W*1.06,-8.0],[s*W*1.06+0.95,-7.6],[s*W*1.06+0.75,-5.4]],'metal','inner',{lod:1});for(const d of [-0.45,0,0.45])K.L([[s*W*1.06+d,-5.9],[s*W*1.06+d*1.3,-7.6]],'detail',{raw:true,lod:2});});
  // ornaments over the ears: a rosette and a fan of three leaves
  K.M(s=>{for(const [a,l,h] of [[-86,3.6,1.15],[-60,4.6,1.3],[-36,4.2,1.15]])mkPetal(K,s*W*0.98,0.7,l,h,s*a,'metal','outer',{inner:3,rib:2});
    K.C(s*W*1.0,0.6,1.2,'metal','inner');K.C(s*W*1.0,0.6,0.5,'gem','detail',{lod:1,n:10});for(let i=0;i<8;i++){const p=mkPol(0.86,i*45);K.C(s*W*1.0+p[0],0.6+p[1],0.14,'pearl','detail',{lod:3,n:6});}});
  // the dome
  const prof=kar?[[0,1.0],[0.12,1.06],[0.3,0.98],[0.5,0.8],[0.68,0.6],[0.84,0.4],[1,0.2]]:[[0,1.0],[0.14,1.08],[0.32,1.06],[0.52,0.92],[0.7,0.7],[0.86,0.44],[1,0.24]];
  const Wd=t=>{for(let i=1;i<prof.length;i++)if(t<=prof[i][0]){const a=prof[i-1],b=prof[i];return W*lerp(a[1],b[1],(t-a[0])/(b[0]-a[0]));}return W*prof[prof.length-1][1];};
  const arch=y=>0.8*(1-y/H*0.45),arc=(t,k=1)=>{const hw=Wd(t)*k,y=0.8+t*H,a=arch(t*H),p=[];for(let i=0;i<=12;i++){const u=i/6-1;p.push([u*hw,y+a*(1-u*u)]);}return p;};
  const sil=[];for(let i=0;i<=16;i++)sil.push([Wd(i/16),0.8+i/16*H]);
  K.Rp(sil.map(([x,y])=>[-x,y]).concat(arc(1),sil.slice().reverse()),'metal','outer');
  // rows above the plates: beaded lines, a row of scallops, ribs to the top
  const rows=kar?[0.2,0.4,0.58,0.74,0.88]:[0.5,0.7,0.86];
  rows.forEach((t,ri)=>{const a=arc(t);K.L(a,'inner',{raw:true});K.L(a.map(([x,y])=>[x*0.985,y+0.42]),'detail',{raw:true,lod:1});
    const hw=Wd(t),n=Math.max(4,Math.round(hw*2/1.25));for(let j=0;j<n;j++){const u=((j+0.5)/n)*2-1;K.C(u*hw*0.96,0.8+t*H+arch(t*H)*(1-u*u)+0.21,0.16,'pearl','detail',{lod:2,n:6});}
    const t2=rows[ri+1]||1,th=(t2-t)*H,m=Math.max(3,Math.round(hw*2/2.0));
    for(let j=0;j<m;j++){const u=((j+0.5)/m)*2-1,x=u*hw*0.9,y=0.8+t*H+arch(t*H)*(1-u*u)+0.5;
      if((ri+(kar?0:1))%2)mkPetal(K,x,y,th*0.78,hw*0.86/m,-u*16,'metal','detail',{lod:1,round:true,rib:3});
      else{K.L([[x-hw*0.8/m,y],[x-hw*0.55/m,y+th*0.6],[x,y+th*0.72],[x+hw*0.55/m,y+th*0.6],[x+hw*0.8/m,y]],'detail',{lod:1});K.C(x,y+th*0.3,Math.min(0.34,th*0.16),'gem','detail',{lod:2,n:8});}}});
  // the leaf plates that front the crown
  if(kar){for(const [x,h,hw,r] of [[-W*0.62,H*0.2,W*0.2,10],[W*0.62,H*0.2,W*0.2,-10],[0,H*0.24,W*0.26,0]])mkPlate(K,x,1.0,h,hw,r,{});}
  else{for(const [x,h,hw,r] of [[-W*0.82,H*0.34,W*0.17,24],[W*0.82,H*0.34,W*0.17,-24],[-W*0.46,H*0.44,W*0.2,12],[W*0.46,H*0.44,W*0.2,-12]])mkPlate(K,x,1.0,h,hw,r,{});
    mkPlate(K,0,1.0,H*0.56,W*0.3,0,{sun:o.medal!=='gem',gem:o.medal==='gem'});}
  // finial: two discs, a pot, a point
  const ty=0.8+H+arch(H),tw=Wd(1);K.Rp(G.ellipse(0,ty+0.3,tw*1.25,0.55,20),'metal','outer');K.Rp(G.ellipse(0,ty+1.15,tw*0.95,0.48,18),'metal','outer');
  K.R([[0,ty+1.5],[tw*0.9,ty+2.0],[tw*0.95,ty+3.0],[tw*0.4,ty+3.8],[0,ty+5.4],[-tw*0.4,ty+3.8],[-tw*0.95,ty+3.0],[-tw*0.9,ty+2.0]],'metal','outer');K.L([[-tw*0.7,ty+2.7],[0,ty+2.5],[tw*0.7,ty+2.7]],'detail',{lod:2});
  mkBrowBand(K,w,o);return ty+5.6;
}
function mkJata(K,o={}){
  // locks drawn up from the brow and coiled into a knot, bound with beads
  K.R([[-5.9,-0.6],[-6.8,3.0],[-6.3,7.0],[-4.8,10.2],[-3.0,12.0],[0,12.8],[3.0,12.0],[4.8,10.2],[6.3,7.0],[6.8,3.0],[5.9,-0.6],[0,1.0]],'hair','outer');
  for(let i=0;i<9;i++){const x=-5.2+i*1.3,ph=i*0.9;K.L([[x,0.6+0.5*Math.cos(ph)],[x*1.1+0.5*Math.sin(ph),4.2],[x*0.92-0.45*Math.sin(ph),8.0],[x*0.52,11.4]],'detail',{lod:i%2?1:2});}
  const bd=[[-5.6,6.6],[-2.8,5.5],[0,5.2],[2.8,5.5],[5.6,6.6]];K.L(bd,'inner');K.L(bd.map(([x,y])=>[x*1.02,y+1.0]),'inner');K.beads(bd.map(([x,y])=>[x*1.01,y+0.5]),1.0,0.36,{});
  K.R([[-3.2,11.8],[-3.7,14.2],[-2.3,16.4],[0,17.1],[2.3,16.4],[3.7,14.2],[3.2,11.8],[0,11.2]],'hair','outer');
  for(let i=0;i<5;i++){const x=-2.4+i*1.2;K.L([[x,11.8],[x*1.25+0.3,14.0],[x*0.6,16.5]],'detail',{lod:i%2?2:1});}
  K.L([[-3.3,12.3],[0,11.7],[3.3,12.3]],'inner');K.beads([[-3.2,12.9],[0,12.3],[3.2,12.9]],0.95,0.32,{lod:1});
  const cx=5.9,cy=12.2,oA=[],iA=[];for(let i=0;i<=18;i++){const a=-75+i*210/18,p=mkPol(3.1,a),q=mkPol(2.55,a);oA.push([cx+p[0],cy+p[1]]);iA.push([cx+1.1+q[0]*0.9,cy+0.55+q[1]*0.9]);}
  K.Rp(oA.concat(iA.reverse()),'moon','outer');
  if(o.ganga!==false){K.T([[0.2,17.0],[0.5,18.8],[1.7,19.9],[2.9,19.2]],t=>0.34-0.2*t,'water','inner');K.L([[0.9,17.3],[1.4,18.5],[2.4,18.9]],'detail',{lod:2});}
  return 20.5;
}

/* ================= haloes ================= (origin at the centre of the head) */
function mkHalo(K,o={}){
  const r=o.r||13.5,kind=o.kind||'siras';
  if(kind==='rays'){for(let i=0;i<72;i++){const a=i*5,r1=r*(i%3===0?1.16:i%3===1?1.0:1.07);K.L([mkPol(r*0.6,a),mkPol(r1,a)],'detail',{raw:true,lod:i%3===0?0:i%3===1?1:2});}K.ring(0,0,r*0.58,'inner',{n:48});return;}
  K.C(0,0,r,'halo','outer',{n:72});K.ring(0,0,r-0.75,'detail',{n:64,lod:1});K.ring(0,0,r-2.1,'inner',{n:60});
  const m=Math.round(2*Math.PI*(r-1.42)/1.1);for(let i=0;i<m;i++){const p=mkPol(r-1.42,i*360/m);K.C(p[0],p[1],0.3,'pearl','detail',{lod:2,n:6});}
  if(kind==='siras'){const n=36;for(let i=0;i<n;i++){const a=i*360/n,p=mkPol(r-0.1,a);mkPetal(K,p[0],p[1],2.5,1.05,a-90,'halo','outer',{inner:3,lod:i%2?1:0});}}
  else if(kind==='gems'){const n=20;for(let i=0;i<n;i++){const a=i*360/n+9,p=mkPol(r-3.3,a);K.Rp(G.ellipse(p[0],p[1],0.95,0.6,12,a+90),'gem','detail',{lod:1});}K.ring(0,0,r-4.5,'detail',{n:48,lod:1});}
}

/* ================= hands =================
   local frame: wrist at the origin, fingers toward +y, about 10 long; the thumb is on +x (pass flip for the other hand).
   A raised palm is one silhouette with the fingers together, parted by lines. */
function mkHand(K,kind,o={}){
  const sk=o.skin||'skin';
  if(kind==='abhaya'||kind==='back'){
    K.R([[-2.0,-0.3],[-2.6,1.6],[-2.75,3.6],[-2.72,5.4],[-2.78,7.5],[-2.5,8.35],[-2.0,8.5],[-1.52,8.15],[-1.36,7.7],[-1.22,9.25],[-0.72,9.75],[-0.22,9.4],[-0.1,8.95],[0.1,9.9],[0.6,10.35],[1.1,9.95],[1.22,9.3],[1.36,9.5],[1.86,9.75],[2.3,9.3],[2.45,7.4],[2.52,5.3],[2.75,4.5],[3.3,5.1],[3.75,6.3],[4.0,7.3],[4.32,7.1],[4.25,5.6],[3.7,3.5],[2.95,1.6],[2.0,-0.3],[0,-0.6]],sk,'outer',{seg:4});
    K.L([[-1.36,7.7],[-1.42,6.2],[-1.36,4.9]],'inner');K.L([[-0.1,8.95],[-0.12,6.8],[-0.06,5.0]],'inner');K.L([[1.22,9.3],[1.25,7.0],[1.2,4.9]],'inner');
    if(kind==='abhaya'){
      for(const [x,a,b] of [[-2.07,6.3,7.5],[-0.73,6.6,8.2],[0.57,6.8,8.6],[1.83,6.6,8.2]])for(const y of [a,b])K.L([[x-0.5,y],[x,y-0.12],[x+0.5,y]],'detail',{lod:3});
      K.L([[-2.4,4.3],[-0.6,3.9],[1.0,4.2],[2.3,4.8]],'detail',{lod:2});K.L([[-2.5,3.1],[-0.8,2.8],[0.8,3.3]],'detail',{lod:2});K.L([[2.45,4.2],[1.3,3.4],[0.7,1.9],[1.0,0.2]],'detail',{lod:2});
      if(o.mark!==false){K.ring(-0.4,2.0,0.8,'detail',{lod:3,n:14});for(let i=0;i<8;i++){const p=mkPol(0.8,i*45),q=mkPol(1.15,i*45);K.L([[-0.4+p[0],2.0+p[1]],[-0.4+q[0],2.0+q[1]]],'detail',{raw:true,lod:3});}}
      K.L([[3.5,6.6],[3.9,6.9],[4.15,6.6]],'detail',{lod:3});
    }else for(const x of [-2.07,-0.73,0.57,1.83])K.L([[x-0.45,5.1],[x,5.45],[x+0.45,5.1]],'detail',{lod:2});
  }else if(kind==='fist'){
    K.R([[-2.0,-0.3],[-2.7,1.6],[-2.8,3.6],[-2.4,4.9],[-1.7,5.3],[-1.0,4.95],[-0.35,5.4],[0.35,5.0],[1.0,5.4],[1.7,4.95],[2.4,5.2],[2.8,4.2],[2.8,2.2],[2.5,0.8],[2.0,-0.3],[0,-0.6]],sk,'outer',{seg:4});
    for(const x of [-1.0,0.35,1.7])K.L([[x,4.95],[x-0.06,3.6],[x-0.02,2.5]],'inner');K.L([[-2.6,2.5],[-1.0,2.3],[0.6,2.4],[2.6,2.6]],'detail',{lod:1});
    for(const x of [-1.7,-0.35,1.0,2.2])K.L([[x-0.4,4.2],[x,4.42],[x+0.4,4.2]],'detail',{lod:3});
    K.R([[-2.7,1.0],[-1.6,2.0],[0.2,2.15],[1.7,1.75],[2.3,1.0],[1.0,0.65],[-0.8,0.85]],sk,'inner');K.L([[1.3,1.72],[1.9,1.36],[1.6,0.95]],'detail',{lod:3});
  }else if(kind==='kataka'){
    K.R([[-1.9,-0.3],[-2.6,1.8],[-2.5,3.8],[-1.9,4.9],[-1.0,5.2],[-0.2,4.9],[0.5,5.3],[1.2,4.8],[2.0,4.6],[2.5,3.4],[2.5,1.4],[1.9,-0.3],[0,-0.6]],sk,'outer',{seg:4});
    for(const x of [-0.2,1.2])K.L([[x,4.9],[x-0.1,3.6],[x+0.1,2.6]],'inner');K.L([[-2.3,2.6],[-0.8,2.4],[1.0,2.6]],'detail',{lod:2});
    K.T([[1.75,4.3],[2.3,6.2],[1.9,7.4],[1.2,7.7]],t=>0.56-0.12*t,sk,'outer');K.T([[2.4,2.4],[3.1,4.8],[2.5,6.8],[1.5,7.5]],t=>0.7-0.22*t,sk,'outer');
  }else if(kind==='flat'){
    K.R([[-1.0,-0.4],[-1.4,2.0],[-1.2,5.0],[-0.5,7.6],[0.6,10.2],[1.5,10.9],[2.1,10.2],[1.9,7.2],[2.0,3.4],[1.7,-0.4]],sk,'outer');
    K.T([[1.7,1.6],[3.0,2.8],[3.7,4.4]],t=>0.82-0.25*t,sk,'outer');for(const y of [6.2,7.6,9.0])K.L([[-0.3-0.02*y,y],[1.6+0.03*y,y+0.25]],'detail',{raw:true,lod:2});
  }
}

/* ================= arms ================= */
function mkArm(K,sh,el,wr,o={}){
  const k=o.k||1,sk=o.skin||'skin';
  const U=(a,b)=>{const d=[b[0]-a[0],b[1]-a[1]],l=Math.hypot(d[0],d[1])||1;return[d[0]/l,d[1]/l];};const u1=U(sh,el),u2=U(el,wr);
  const outN=(u,m)=>{const n=[-u[1],u[0]];return Math.abs(m[0]+n[0])>=Math.abs(m[0]-n[0])?n:[-n[0],-n[1]];}; // the side away from the body
  const n1=outN(u1,mkLerp(sh,el,0.5)),n2=outN(u2,mkLerp(el,wr,0.5));
  const wo=u=>k*(3.25-0.85*u+0.55*Math.exp(-Math.pow((u-0.2)/0.18,2))),wi=u=>k*(2.85-0.5*u+0.32*Math.sin(Math.PI*u));
  const O=[],I=[];for(let i=0;i<=10;i++){const u=i/10,q=mkLerp(sh,el,u);O.push([q[0]+n1[0]*wo(u),q[1]+n1[1]*wo(u)]);I.push([q[0]-n1[0]*wi(u),q[1]-n1[1]*wi(u)]);}
  const cap=(c,n,u,w,sg)=>{const a=[];for(let i=1;i<6;i++){const t=i/6*Math.PI;a.push([c[0]+n[0]*w*Math.cos(t)+sg*u[0]*w*Math.sin(t),c[1]+n[1]*w*Math.cos(t)+sg*u[1]*w*Math.sin(t)]);}return a;};
  K.Rp(O.concat(cap(el,n1,u1,(wo(1)+wi(1))/2,1),I.slice().reverse(),cap(sh,[-n1[0],-n1[1]],u1,(wo(0)+wi(0))/2,-1)),sk,'outer');
  const fo=u=>k*(2.5-0.9*u+0.42*Math.exp(-Math.pow((u-0.24)/0.2,2))),fi=u=>k*(2.4-0.78*u+0.14*Math.sin(Math.PI*u));
  const FO=[],FI=[];for(let i=0;i<=10;i++){const u=i/10,q=mkLerp(el,wr,u);FO.push([q[0]+n2[0]*fo(u),q[1]+n2[1]*fo(u)]);FI.push([q[0]-n2[0]*fi(u),q[1]-n2[1]*fi(u)]);}
  K.Rp(FO.concat(FI.slice().reverse()),sk,'outer',{ns:true});K.L(FO,'outer',{raw:true});K.L(FI,'outer',{raw:true});
  K.L([[el[0]-n2[0]*fi(0)*0.9+u2[0]*0.6,el[1]-n2[1]*fi(0)*0.9+u2[1]*0.6],[el[0]-n2[0]*0.6+u2[0]*1.5,el[1]-n2[1]*0.6+u2[1]*1.5]],'detail',{raw:true,lod:2});
  const band=(c,u,n,w0,w1,th,mat,o2)=>K.Rp([[c[0]+n[0]*w0-u[0]*th,c[1]+n[1]*w0-u[1]*th],[c[0]-n[0]*w1-u[0]*th,c[1]-n[1]*w1-u[1]*th],[c[0]-n[0]*w1+u[0]*th,c[1]-n[1]*w1+u[1]*th],[c[0]+n[0]*w0+u[0]*th,c[1]+n[1]*w0+u[1]*th]],mat,'inner',o2);
  if(o.armlet!==false){const c=mkLerp(sh,el,0.52),ang=Math.atan2(-u1[1],-u1[0])/DEG-90,mid=[c[0]+n1[0]*(wo(0.52)-wi(0.52))/2,c[1]+n1[1]*(wo(0.52)-wi(0.52))/2];
    mkPlate(K,mid[0]-u1[0]*0.4,mid[1]-u1[1]*0.4,3.7*k,1.3*k,ang,{lod:0});for(const d of [-40,40])mkPetal(K,mid[0]-u1[0]*0.4,mid[1]-u1[1]*0.4,2.5*k,0.8*k,ang+d,'metal','inner',{lod:1,inner:3});
    band(c,u1,n1,wo(0.52)+0.2,wi(0.52)+0.2,0.62,'metal');K.beads([[c[0]+n1[0]*(wo(0.52)-0.2),c[1]+n1[1]*(wo(0.52)-0.2)],[c[0]-n1[0]*(wi(0.52)-0.2),c[1]-n1[1]*(wi(0.52)-0.2)]],0.85,0.24,{lod:2});
    for(const d of [-0.6,0,0.6]){const b=[mid[0]+n1[0]*d*2.6*k+u1[0]*0.9,mid[1]+n1[1]*d*2.6*k+u1[1]*0.9];K.C(b[0],b[1],0.24,'pearl','detail',{lod:2,n:7});mkPetal(K,b[0]+u1[0]*0.2,b[1]+u1[1]*0.2,1.1,0.36,ang+180,'metal','detail',{round:true,lod:3});}}
  if(o.bangles!==false)[0.74,0.81,0.88,0.95].forEach((t,i)=>{const c=mkLerp(el,wr,t);band(c,u2,n2,fo(t)+0.28,fi(t)+0.28,i%2?0.34:0.2,'metal',i%2?null:{lod:1});
    if(i===1)K.beads([[c[0]+n2[0]*fo(t)*0.8,c[1]+n2[1]*fo(t)*0.8],[c[0]-n2[0]*fi(t)*0.8,c[1]-n2[1]*fi(t)*0.8]],0.7,0.16,{lod:3});});
  return Math.atan2(u2[1],u2[0])/DEG;
}

/* ================= trunk ================= */
function mkTorso(K,o={}){
  const sk=o.skin||'skin',kind=o.kind||'m';
  const H={m:[[9.7,7.5],[9.9,12.5],[8.5,20.5],[9.2,26],[11.2,31],[12.2,34.4],[13.6,36.4],[13.2,38.2],[10.6,39.5],[6.6,40.3],[4.2,40.6],[3.5,40.2]],
    v:[[8.9,7.5],[8.8,12.5],[7.8,20.5],[9.6,26],[12.4,31],[13.4,34.4],[14.6,36.6],[14.0,38.4],[11.0,39.7],[6.8,40.4],[4.3,40.7],[3.6,40.3]],
    f:[[10.6,7.5],[10.9,12.0],[8.3,16.6],[6.4,21.5],[7.2,26.2],[9.6,30.2],[10.8,33.8],[12.0,36.2],[11.6,38.0],[9.4,39.4],[6.0,40.2],[4.0,40.5],[3.2,40.1]],
    belly:[[14,6.5],[16.8,12.5],[17.2,19],[15.0,25.2],[12.4,30],[12.4,34.2],[13.8,36.4],[13.4,38.2],[10.8,39.5],[6.6,40.3],[4.2,40.6],[3.5,40.2]]}[kind];
  K.R(H.concat(H.slice().reverse().map(([x,y])=>[-x,y])),sk,'outer');
  K.M(s=>K.L([[s*1.2,39.4],[s*5,39.7],[s*9.4,39.1]],'detail',{lod:2}));K.L([[-1.0,39.0],[0,38.5],[1.0,39.0]],'detail',{lod:3});
  if(kind==='f'){
    K.R([[-10.5,33.6],[-6,35.2],[0,33.5],[6,35.2],[10.5,33.6],[10.2,29.6],[7.4,26.9],[3.6,27.3],[0,28.5],[-3.6,27.3],[-7.4,26.9],[-10.2,29.6]],'bodice','inner');
    K.M(s=>{K.L([[s*1.0,29.6],[s*4.2,27.7],[s*8.2,28.2],[s*10.0,30.9]],'inner');K.L([[s*10.3,33.0],[s*6,34.6],[s*0.6,32.9]],'detail',{lod:1});K.L([[s*10.0,32.4],[s*6,34.0],[s*0.8,32.3]],'detail',{lod:2});
      for(let i=0;i<4;i++)K.L([[s*(2.2+i*2.0),33.3+i*0.35],[s*(2.6+i*2.0),29.4-i*0.35]],'detail',{lod:3});});
    K.L([[-7.2,27.2],[-3.6,27.7],[0,28.9],[3.6,27.7],[7.2,27.2]],'detail',{lod:1});K.beads([[-7,26.4],[-3.5,26.9],[0,28.1],[3.5,26.9],[7,26.4]],0.85,0.22,{lod:2});
    K.Lc(FK.spline([[0,18.6],[0.4,17.9],[0,17.2],[-0.4,17.9]],true,4),'detail');K.M(s=>{K.L([[s*2.2,20.6],[s*4.4,20.0],[s*6.0,20.9]],'detail',{lod:3});K.L([[s*6.4,23.6],[s*5.6,21.4],[s*6.2,19.4]],'detail',{lod:3});});
  }else if(kind==='belly'){
    K.M(s=>K.L([[s*1.2,31.6],[s*5.6,30.2],[s*10.6,32.2]],'inner',{lod:1}));
    K.L([[-14.6,23],[-13,14.5],[-7,9.6],[0,8.6],[7,9.6],[13,14.5],[14.6,23]],'inner');K.Lc(FK.spline([[0,17.6],[0.75,16.6],[0,15.6],[-0.75,16.6]],true,4),'inner');
    K.M(s=>{K.L([[s*3.2,13.6],[s*6.5,12.6],[s*9.6,14.0]],'detail',{lod:3});K.L([[s*10.4,27.6],[s*12.6,25],[s*13.4,21.6]],'detail',{lod:3});});
  }else{
    K.M(s=>{K.L([[s*1.1,31.6],[s*5.4,30.2],[s*10.0,31.8],[s*11.4,33.6]],'inner',{lod:1});K.C(s*6.0,32.3,0.3,null,'detail',{lod:3,n:8});K.L([[s*2.2,21.7],[s*5.2,20.8],[s*7.8,21.5]],'detail',{lod:3});
      K.L([[s*8.9,24.6],[s*8.2,22.4],[s*8.6,20.4]],'detail',{lod:3});
      if(kind==='v'){K.L([[s*1.2,27.2],[s*4.4,26.6],[s*7.6,27.6]],'detail',{lod:2});K.L([[s*1.2,23.8],[s*4.0,23.3],[s*6.8,24.2]],'detail',{lod:2});}});
    K.L([[0,30.2],[0.2,25.2],[0,19.6]],'detail',{lod:3});K.Lc(FK.spline([[0,18.3],[0.45,17.5],[0,16.7],[-0.45,17.5]],true,4),'detail');
  }
}

/* ================= jewellery ================= */
// choker with a fringe of drops; a broad crescent collar set with stones; a long string of pearls with a lotus pendant
function mkNecklaces(K,o={}){
  const a=o.w||9.4;
  K.Rp(mkArcBand(0,43.2,5.2,6.5,231,309,12),'metal','inner');K.beads([[-3.3,38.3],[0,37.3],[3.3,38.3]],0.9,0.24,{lod:1});
  for(let i=0;i<7;i++){const u=(i-3)/3,x=u*3.4,y=36.6+0.9*u*u;mkPetal(K,x,y,i===3?1.5:1.05,0.36,180,'metal','detail',{round:true,lod:2});}
  // crescent collar
  const out=FK.spline(mkU(a*0.93,40.0,10.6),false,8),inn=FK.spline(mkU(a*0.72,40.1,7.6),false,8);
  K.Rp(out.concat(inn.slice().reverse()),'metal','inner');K.L(out.map(([x,y])=>[x*0.975,y+0.34]),'detail',{raw:true,lod:1});K.L(inn.map(([x,y])=>[x*1.03,y-0.3]),'detail',{raw:true,lod:1});
  const n=13;for(let i=0;i<n;i++){const t=(i+0.5)/n,po=out[Math.round(t*(out.length-1))],pi=inn[Math.round(t*(inn.length-1))],m=[(po[0]+pi[0])/2,(po[1]+pi[1])/2];
    if(i%2)K.C(m[0],m[1],0.3,'pearl','detail',{lod:2,n:7});else K.Rp(G.ellipse(m[0],m[1],0.62,0.46,10),'gem','detail',{lod:1});}
  const So=G.samples(out,false,1.5);So.forEach((s,i)=>{if(i<2||i>So.length-3)return;mkPetal(K,s.x,s.y-0.1,i%2?0.95:1.35,0.36,180,'metal','detail',{round:true,lod:i%2?3:2});});
  const py=28.4;K.C(0,py,1.7,'metal','inner');K.C(0,py,0.8,'gem','detail');for(let i=0;i<10;i++){const p=mkPol(1.26,i*36);K.C(p[0],py+p[1],0.17,'pearl','detail',{lod:3,n:6});}
  mkPetal(K,0,py-1.6,1.9,0.7,180,'metal','inner',{round:true,lod:1});K.M(s=>mkPetal(K,s*1.4,py-1.1,1.3,0.46,180+s*24,'metal','detail',{round:true,lod:2}));
  if(o.long!==false){const dip=o.longDip||19.5,lg=mkU(a*1.04,40.0,dip);K.L(lg,'detail',{lod:1});K.beads(lg,1.15,0.34,{});
    const y=40-dip-1.5;K.C(0,y,1.35,'metal','inner');for(let i=0;i<8;i++){const p=mkPol(1.35,i*45);mkPetal(K,p[0],y+p[1],0.9,0.4,i*45-90,'metal','detail',{round:true,lod:2});}K.C(0,y,0.6,'gem','detail',{n:10});mkPetal(K,0,y-2.2,1.5,0.5,180,'gem','detail',{round:true,lod:1});}
}
// forest garland: a rope of five-petalled blossoms with a full rose and a pair of leaves at intervals
function mkGarland(K,path,o={}){
  const sp=FK.spline(path,false,8),S=G.samples(sp,false,2.35);K.T(path,1.35,'garland','inner',{ns:true});
  S.forEach((s,i)=>{const a=Math.atan2(s.ty,s.tx)/DEG;
    if(i%5===2){for(const d of [-1,1])mkPetal(K,s.x,s.y,2.9,0.85,a-90+d*90,'leafGreen','inner',{rib:2,lod:1});
      K.C(s.x,s.y,1.85,'garland','inner',{n:20});K.L((()=>{const p=[];for(let k=0;k<=18;k++){const t=k/18*Math.PI*3.4,r=1.45*(1-k/24);p.push([s.x+Math.cos(t)*r,s.y+Math.sin(t)*r]);}return p;})(),'detail',{raw:true,lod:1});
      for(let k=0;k<6;k++){const p=mkPol(1.85,k*60+a);K.L([[s.x+p[0]*0.72,s.y+p[1]*0.72],[s.x+p[0],s.y+p[1]]],'detail',{raw:true,lod:3});}}
    else{for(let k=0;k<5;k++){const p=mkPol(0.74,k*72+a+i*20);K.C(s.x+p[0],s.y+p[1],0.6,'garland','inner',{n:8,lod:k%2?1:0});}K.C(s.x,s.y,0.3,'gem','detail',{n:6,lod:2});}});
}

/* ================= cloth and legs ================= */
// fold lines running along a form: path is the form's axis, wf its half-width, offs the positions across it (−1…1)
function mkFolds(K,path,wf,offs,lods){
  const sp=FK.spline(path,false,8),tot=G.length(sp,false),S=G.samples(sp,false,tot/16);
  offs.forEach((off,j)=>{const pts=S.map((q,i)=>{const t=i/(S.length-1),w=wf(t)*off;return[q.x-q.ty*w+q.tx*0.4*Math.sin(t*9+j),q.y+q.tx*w];});K.L(pts.slice(1,-1),'detail',{raw:true,lod:lods?lods[j%lods.length]:2});});
}
function mkLegsSeated(K,o={}){
  const sk=o.skin||'skin',cl=o.cloth||'dhoti',lal=o.pose==='lalita';
  if(o.pleats!==false){const y1=lal?-9.4:-7,n=9,hem=[];for(let i=0;i<=n*2;i++){const u=i/(n*2);hem.push([lerp(-7,7,u),y1+(i%2?0:1.5)+2.6*Math.pow(Math.abs(u-0.5)*2,2)]);}
    K.Rp([[-2.6,10],[2.6,10]].concat(hem.slice().reverse()),'pleat','outer');
    for(let i=1;i<n*2;i+=2){const h=hem[i];K.L([[h[0]*0.36,9],[h[0],h[1]]],'detail',{raw:true,lod:i%4===1?1:2});}
    K.L(hem.map(([x,y])=>[x*0.965,y+1.5]),'detail',{raw:true,lod:1});K.L(hem.map(([x,y])=>[x*0.93,y+2.5]),'detail',{raw:true,lod:2});
    hem.forEach(([x,y],i)=>{if(i%2===0&&i>0&&i<n*2)K.C(x*0.95,y+2.0,0.2,'pearl','detail',{lod:3,n:6});});}
  const thigh=s=>{K.R([[s*2.5,12.4],[s*10,12.7],[s*18,11.5],[s*24.2,8.7],[s*26.6,5.1],[s*24.8,1.7],[s*20,0.7],[s*10,0.3],[s*2,0.5],[s*0.6,6]],cl,'outer');
    for(let i=0;i<7;i++){const t=i/6;K.L([[s*(2.8+1.4*t),12.1-9.6*t],[s*(11+5*t),11.8-8.4*t-1.3*Math.sin(Math.PI*t)],[s*(23.4-2.6*t),10.0-8.0*t]],'detail',{lod:[1,3,2,3,1,3,2][i]});}
    K.L([[s*21.2,10.5],[s*25.0,6.6],[s*23.2,2.0]],'detail',{lod:1});K.L([[s*23.1,9.3],[s*25.9,5.8],[s*24.5,2.3]],'detail',{lod:3});};
  const shin=(pts,w)=>{K.T(pts,w,cl,'outer');mkFolds(K,pts,w,[-0.62,-0.28,0.08,0.44,0.74],[2,3,1,3,2]);
    const sp=FK.spline(pts,false,8),S=G.samples(sp,false,G.length(sp,false)/24);for(const k of [20,22]){const q=S[k],h=w(k/24)*0.96;K.L([[q.x-q.ty*h,q.y+q.tx*h],[q.x+q.ty*h,q.y-q.tx*h]],'inner',{raw:true,lod:1});}
    const q=S[21],h=w(21/24)*0.7;K.beads([[q.x-q.ty*h,q.y+q.tx*h],[q.x+q.ty*h,q.y-q.tx*h]],0.75,0.18,{lod:3});};
  if(lal){
    thigh(-1);
    K.R([[2.4,12.3],[9,12.8],[14.4,11.4],[16.0,7.6],[15.0,3.0],[10,0.6],[4,0.5],[1,5]],cl,'outer');
    shin([[-22,4.5],[-13,4.7],[-5.5,3.6]],t=>4.0-1.5*t);
    mkFootSole(K.sub({x:-5.8,y:3.2,rot:185,s:0.94}),sk);mkAnklet(K,-6.4,3.5,84);
    shin([[10.3,7.4],[10.8,-4],[10.6,-14.6]],t=>3.95-1.35*t);
    K.L([[6.9,7.6],[8.2,9.6],[10.4,10.2],[12.8,9.6],[14.0,7.6]],'inner',{lod:1});K.L([[7.6,6.4],[9.0,8.2],[10.4,8.7],[12.0,8.2],[13.2,6.6]],'detail',{lod:3});
    mkFootFront(K.sub({x:10.7,y:-17.2}),sk);
  }else{
    thigh(1);thigh(-1);
    shin([[-22,4.2],[-9,3.4],[5,2.5]],t=>3.9-1.5*t);
    for(const [x,y,r] of [[13.6,1.3,0.85],[14.9,1.0,0.7],[16.0,0.95,0.62]])K.C(x,y,r,sk,'outer',{n:10,lod:1});
    shin([[22,4.8],[9,5.2],[-5.6,3.7]],t=>4.0-1.6*t);
    mkFootSole(K.sub({x:-6.6,y:3.3,rot:6}),sk);mkAnklet(K,-5.6,3.5,-82);
  }
}
function mkLegsStanding(K,o={}){
  const sk=o.skin||'skin',cl=o.cloth||'dhoti',cross=o.stance==='cross';
  const legW=t=>t<0.42?lerp(6.2,4.3,t/0.42):t<0.56?lerp(4.3,4.0,(t-0.42)/0.14):t<0.74?lerp(4.0,4.2,(t-0.56)/0.18):lerp(4.2,2.3,(t-0.74)/0.26);
  const L=[[-6.2,62],[-6.8,48],[-6.2,33],[-6.5,18],[-6.0,5]],Rr=cross?[[6.2,62],[5.0,48],[0.5,33],[-5.5,18],[-9.5,6]]:[[6.2,62],[6.8,48],[6.2,33],[6.5,18],[6.0,5]];
  if(o.bare){K.T(L,legW,sk,'outer');mkFootFront(K.sub({x:-6.2,y:5.0,rot:6,s:1.25}),sk);K.T(Rr,legW,sk,'outer');mkFootFront(K.sub({x:cross?-9.8:6.2,y:5.0,rot:cross?-14:-6,s:1.25}),sk);
    K.M(s=>{K.L([[s*3.6,34.6],[s*5.0,32.0],[s*7.6,32.2],[s*8.8,34.6]],'detail',{lod:2});K.L([[s*4.6,29.8],[s*6.2,28.9],[s*7.8,29.8]],'detail',{lod:3});});return;}
  mkFootFront(K.sub({x:-6.6,y:5.0,rot:8,s:1.25}),sk);mkFootFront(K.sub({x:cross?-10.4:6.6,y:5.0,rot:cross?-16:-8,s:1.25}),sk);
  const wrap=(P0,s)=>{const w=t=>t<0.3?lerp(8.0,7.2,t/0.3):t<0.52?lerp(7.2,5.5,(t-0.3)/0.22):t<0.68?lerp(5.5,5.7,(t-0.52)/0.16):lerp(5.7,4.1,(t-0.68)/0.32);K.T(P0,w,cl,'outer');
    const a=P0[0],b=P0[P0.length-1];for(let i=0;i<11;i++){const t0=0.05+0.9*Math.pow(i/10.5,1.12),p=mkLerp(a,b,t0),bow=P0[2][0]-(a[0]+b[0])/2;const cx=p[0]+bow*Math.sin(Math.PI*t0),v=Math.sin(i*2.1);
      K.L([[cx-s*w(t0)*0.94,p[1]+3.6+v*0.6],[cx-s*w(t0)*0.25,p[1]+0.4],[cx+s*w(t0)*0.5,p[1]-1.8+v*0.4],[cx+s*w(t0)*0.93,p[1]-1.2]],'detail',{lod:[1,3,2,3][i%4]});}
    const e=P0[P0.length-1];K.Rp([[e[0]-4.5,e[1]+2.0],[e[0]+4.5,e[1]+2.0],[e[0]+4.4,e[1]+0.1],[e[0]-4.4,e[1]+0.1]],'hem','inner');K.L([[e[0]-4.4,e[1]+1.5],[e[0]+4.4,e[1]+1.5]],'detail',{raw:true,lod:1});K.L([[e[0]-4.4,e[1]+0.6],[e[0]+4.4,e[1]+0.6]],'detail',{raw:true,lod:1});K.beads([[e[0]-4.0,e[1]+1.05],[e[0]+4.0,e[1]+1.05]],0.9,0.2,{lod:2});};
  wrap([[-6.6,63],[-7.0,48],[-6.5,33],[-6.5,18],[-6.3,7.5]],1);wrap(cross?[[6.6,63],[5.4,48],[0.8,33],[-5.4,19],[-9.8,8.2]]:[[6.6,63],[7.0,48],[6.5,33],[6.5,18],[6.3,7.5]],-1);
  const n=7,y1=15.5,hem=[];for(let i=0;i<=n*2;i++){const u=i/(n*2);hem.push([lerp(-5.2,5.2,u),y1+(i%2?0:1.8)+3*Math.pow(Math.abs(u-0.5)*2,2)]);}
  K.Rp([[-2.8,62],[2.8,62]].concat(hem.slice().reverse()),'pleat','outer');
  for(let i=1;i<n*2;i+=2){const h=hem[i];K.L([[h[0]*0.5,60],[h[0],h[1]]],'detail',{raw:true,lod:i%4===1?1:2});}
  K.L(hem.map(([x,y])=>[x*0.96,y+1.8]),'detail',{raw:true,lod:1});K.L(hem.map(([x,y])=>[x*0.92,y+3.0]),'detail',{raw:true,lod:2});
}

/* ================= the lotus throne ================= */
function mkLotusPetal(K,x,y,len,hw,rot,mat,role,o={}){
  const S=K.sub({x,y,rot}),sh=[[-hw*0.42,0],[-hw*0.98,len*0.34],[-hw*0.86,len*0.66],[-hw*0.34,len*0.9],[hw*0.02,len],[hw*0.3,len*0.92],[hw*0.86,len*0.66],[hw*0.98,len*0.34],[hw*0.42,0]];
  S.Ro(sh,mat,role,o.lod?{lod:o.lod}:null);S.L(sh.slice(1,-1).map(([a,b])=>[a*0.7,len*0.1+b*0.78]),'detail',{lod:(o.lod||0)+1});
  S.L([[0,len*0.06],[0,len*0.86]],'detail',{raw:true,lod:(o.lod||0)+2});S.M(s=>S.L([[s*hw*0.12,len*0.08],[s*hw*0.44,len*0.4],[s*hw*0.4,len*0.7]],'detail',{lod:3}));
}
MK.slot.seat.padmaPitha.draw=(K,o)=>{const hw=o.hw||31;
  K.Rp(G.ellipse(0,-0.9,hw*0.98,3.3,48),'seatTop','outer');K.L(G.ellipse(0,-0.9,hw*0.9,2.5,40).slice(22,40),'detail',{raw:true,lod:2});
  const n2=10;for(let i=0;i<n2-1;i++){const x=-hw*0.86+(i+1)*hw*1.72/n2,u=x/hw;mkLotusPetal(K,x,-6.6,8.0,hw*1.72/n2*0.46,180+u*44,'seat2','inner',{lod:1});}
  for(let i=0;i<n2;i++){const x=-hw*0.86+(i+0.5)*hw*1.72/n2,u=x/hw;mkLotusPetal(K,x,-6.4,7.4,hw*1.72/n2*0.62,180+u*46,'seat','outer',{});}
  K.Rp(G.roundRect(-hw*0.9,4.9,hw*0.9,6.5,0.8).map(([x,y])=>[x,-y]),'seat2','outer');K.beads([[-hw*0.86,-5.7],[hw*0.86,-5.7]],1.2,0.3,{lod:1});
  const n1=9;for(let i=0;i<n1-1;i++){const x=-hw*0.86+(i+1)*hw*1.72/n1,u=x/hw;mkLotusPetal(K,x,-4.8,9.6,hw*1.72/n1*0.44,-u*50,'seat2','inner',{lod:1});}
  for(let i=0;i<n1;i++){const x=-hw*0.86+(i+0.5)*hw*1.72/n1,u=x/hw;mkLotusPetal(K,x,-4.9,8.8,hw*1.72/n1*0.62,-u*52,'seat','outer',{});}
  K.Rp(G.roundRect(-hw*0.94,13.4,hw*0.94,14.8,0.7).map(([x,y])=>[x,-y]),'seat2','outer');K.beads([[-hw*0.9,-14.1],[hw*0.9,-14.1]],1.6,0.26,{lod:2});};
