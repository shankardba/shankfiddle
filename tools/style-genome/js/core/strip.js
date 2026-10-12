'use strict';
/* Strip — four West African cloth grammars.

   KENTE (Asante and Ewe, Ghana and Togo). The loom makes a strip a hand wide. Along it,
   stretches where the warp shows as lengthwise stripes alternate with blocks where the
   weft hides the warp and carries a pattern. Strips are sewn edge to edge with the blocks
   staggered, so pattern sits beside stripe and the whole cloth becomes a chequerboard.

   ADINKRA (Asante, Ghana). A cloth ruled into squares with a comb dipped in dye, each
   square stamped over and over with one symbol cut from calabash. Every symbol is a
   saying. Panels may be joined by a seam of bright whip-stitching.

   BOGOLANFINI (Bamana, Mali). Mud cloth: the dark is painted on with fermented mud and
   the pattern is what is left unpainted, so every line is a reserve. Narrow strips, each
   a stack of panels with one small repeat, between plain bars.

   ADIRE (Yoruba, Nigeria). Indigo resist. Starch painted through a comb or with a feather
   keeps the dye out (adire eleko: a grid of squares, each with its own motif); cloth
   tied before dyeing leaves rings of dots (adire oniko).

   Woven and stamped parts are solid colour by position (`ci`, `ns`); painted and resist
   lines are ordinary lines, so the tradition's palette decides light on dark. */

const ST={};
const stR=(x0,y0,x1,y1,ci)=>({kind:'region',closed:true,role:'detail',plain:true,ns:true,ci,pts:[[x0,y0],[x1,y0],[x1,y1],[x0,y1]]});
const stP=(pts,ci)=>({kind:'region',closed:true,role:'detail',plain:true,ns:true,ci,pts});
const stL=(pts,role='inner',closed=false)=>({kind:'line',role,closed,pts,noSeed:true});

/* ---------- kente ---------- */
// one weft-faced block (x0..x1 across the strip, y0..y1 along it); c = [a,b,c] colour positions
ST.block=function(kind,x0,y0,x1,y1,c){
  const w=x1-x0,h=y1-y0,P=[stR(x0,y0,x1,y1,c[0])],e=h*0.085;
  P.push(stR(x0,y0,x1,y0+e,c[2]),stR(x0,y1-e,x1,y1,c[2]));const a=y0+e*1.6,b=y1-e*1.6,hh=b-a,cx=(x0+x1)/2,cy=(a+b)/2;
  if(kind==='bars'){const n=5;for(let i=0;i<n;i++)if(i%2===0)P.push(stR(x0,a+hh*i/n,x1,a+hh*(i+1)/n,c[1]));}
  else if(kind==='zigzag'){const n=3,t=hh/(n*2+1),z=4,zw=w/z;
    for(let k=0;k<n;k++){const yy=a+t*(2*k+0.5),up=[],dn=[];for(let i=0;i<=z*2;i++){const x=x0+i*zw/2,o=i%2?t:0;up.push([x,yy+o]);dn.push([x,yy+o+t]);}
      P.push(stP(up.concat(dn.reverse()),c[k%2?2:1]));}}
  else if(kind==='diamond'){const n=4;for(let k=0;k<n;k++){const f=1-k/n;P.push(stP([[cx,cy-hh/2*f],[cx+w/2*f,cy],[cx,cy+hh/2*f],[cx-w/2*f,cy]],c[k%2?0:(k%4===0?1:2)]));}}
  else if(kind==='checker'){const nx=4,ny=Math.max(2,Math.round(hh/(w/nx))),cw=w/nx,ch=hh/ny;for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)if((i+j)%2===0)P.push(stR(x0+i*cw,a+j*ch,x0+(i+1)*cw,a+(j+1)*ch,c[(i+j)%4?1:2]));}
  else if(kind==='steps'){const n=5,sw=w/n,sh=hh/n;for(let i=0;i<n;i++){P.push(stR(x0+i*sw,a+i*sh,x0+(i+1)*sw,b,c[1]));if(i<n-1)P.push(stR(x0+i*sw,a+i*sh,x0+(i+1)*sw,a+(i+0.45)*sh,c[2]));}}
  else if(kind==='cross'){const t=Math.min(w,hh)*0.2;P.push(stR(cx-t/2,a,cx+t/2,b,c[1]),stR(x0,cy-t/2,x1,cy+t/2,c[1]),stR(cx-t*0.9,cy-t*0.9,cx+t*0.9,cy+t*0.9,c[2]));
    for(const [sx,sy] of [[-1,-1],[1,-1],[1,1],[-1,1]])P.push(stR(cx+sx*w*0.32-t*0.35,cy+sy*hh*0.3-t*0.35,cx+sx*w*0.32+t*0.35,cy+sy*hh*0.3+t*0.35,c[2]));}
  return P;};
ST.KINDS=['zigzag','diamond','bars','checker','steps','cross'];
// warp-striped stretch: a symmetric run of lengthwise stripes, the same on every strip of a cloth
ST.warp=function(x0,y0,x1,y1,scheme){const P=[];let x=x0;const w=x1-x0;for(const [f,ci] of scheme){P.push(stR(x,y0,x+w*f,y1,ci));x+=w*f;}return P;};
ST.scheme=function(rng){const a=rng.pick([0,0,2]),b=a===0?rng.pick([1,3]):0,c=rng.pick([2,3,1].filter(k=>k!==a&&k!==b)),d=rng.pick([4,5]);
  const half=[[0.07,d],[0.1,b],[0.045,c],[0.2,a],[0.035,d]];const mid=[[0.1,b]];return half.concat(mid,half.slice().reverse());};
ST.kente=function(W,H,u,rng,{all=false}={}){
  const R=rng||makeRng(11),n=Math.max(3,Math.round(W/(u*0.92))),sw=W/n,hp=sw*(all?0:1.75),hq=sw*1.3,per=hp+hq,P=[],scheme=ST.scheme(R),gap=Math.max(0.8,sw*0.022);
  const kinds=R.shuffle(ST.KINDS).slice(0,all?5:3),off=R.range(0,per);
  for(let i=0;i<n;i++){const x0=i*sw+gap/2,x1=(i+1)*sw-gap/2,sh=(i%2?per/2:0)-off;
    for(let j=-2;j<=Math.ceil(H/per)+1;j++){const y=j*per+sh;
      if(hp>0)P.push(...ST.warp(x0,y+hq,x1,y+per,scheme));
      const k=kinds[(((j*2+i)%kinds.length)+kinds.length)%kinds.length],cs=[[4,0,2],[3,0,2],[1,0,4],[2,0,3],[4,1,0]][(((j+i*2)%5)+5)%5];
      P.push(...ST.block(k,x0,y,x1,y+hq,cs));}}
  return P;};
defTile('kente',{name:'Strip-woven cloth',term:'kente · nwentoma',meaning:'Narrow strips sewn edge to edge, each alternating stretches of lengthwise stripes with blocks of weft pattern, staggered so that the cloth reads as a chequerboard. Gold is for wealth and rule, green for growth, red for blood and sacrifice, blue for peace, black for age and the ancestors. Named cloths carry proverbs; this one has no name.',
fn(W,H,u,rng){return ST.kente(W,H,u,rng);}});
defTile('kenteAdwin',{name:'All-pattern cloth',term:'adweneasa',meaning:'“My skill is exhausted”: a cloth with no plain stretches at all, every block a different weft pattern. The most laborious kind of kente, once woven for the Asante court.',
fn(W,H,u,rng){return ST.kente(W,H,u,rng,{all:true});}});

/* ---------- mud cloth and indigo resist: line tiles ---------- */
const stTile=(key,name,term,meaning,fn)=>defTile(key,{name,term,meaning,fn});
stTile('bgZigzag','Zigzag bands','bogolanfini','Rows of zigzag between ruled lines. The line you see is bare cloth; the mud was painted around it.',
(W,H,u)=>{const s=u*0.62,P=[];for(let j=0;j*s<H+s;j++){const y=j*s;P.push(stL([[0,y],[W,y]],'detail'));const z=[];for(let i=0;i*s/2<=W+s;i++)z.push([i*s/2,y+(i%2?s*0.8:s*0.2)]);P.push(stL(z));}return P;});
stTile('bgLozenge','Nested lozenges','bogolanfini','Diamonds one inside another, filling a panel edge to edge.',
(W,H,u)=>{const s=u*1.25,P=[];for(let j=-1;j*s<H+s;j++)for(let i=-1;i*s<W+s;i++){const cx=i*s+s/2,cy=j*s+s/2;for(const k of [0.5,0.32,0.14])P.push(stL([[cx,cy-s*k],[cx+s*k,cy],[cx,cy+s*k],[cx-s*k,cy]],k===0.5?'inner':'detail',true));}return P;});
stTile('bgCross','Crosses in boxes','bogolanfini','A grid of squares, each holding a small cross.',
(W,H,u)=>{const s=u*0.95,P=[];for(let j=0;j*s<H+s;j++)P.push(stL([[0,j*s],[W,j*s]],'detail'));for(let i=0;i*s<W+s;i++)P.push(stL([[i*s,0],[i*s,H]],'detail'));
  for(let j=0;j*s<H;j++)for(let i=0;i*s<W;i++){const cx=i*s+s/2,cy=j*s+s/2,k=s*0.26;P.push(stL([[cx-k,cy],[cx+k,cy]]),stL([[cx,cy-k],[cx,cy+k]]));}return P;});
stTile('bgDots','Dotted rows','bogolanfini','Lines of dots between ruled bars: among the oldest fillings on mud cloth.',
(W,H,u)=>{const s=u*0.5,P=[];for(let j=0;j*s<H+s;j++){const y=j*s;if(j%2===0)P.push(stL([[0,y],[W,y]]));else for(let i=0;i*s<W+s;i++)P.push({kind:'dot',x:i*s+s/2,y,r:Math.max(1.4,s*0.15),role:'inner'});}return P;});
stTile('bgFishbone','Fishbone','bogolanfini','Short strokes slanting off a spine, the direction turning from column to column.',
(W,H,u)=>{const s=u*0.8,t=s*0.34,P=[];for(let i=0;i*s<W+s;i++){const x=i*s+s/2;P.push(stL([[x,0],[x,H]],'detail'));for(let j=0;j*t<H+t;j++){const y=j*t,d=i%2?-1:1;P.push(stL([[x-s*0.36,y+d*t*0.5],[x,y],[x+s*0.36,y+d*t*0.5]]));}}return P;});
stTile('bgSteps','Stepped line','bogolanfini','A line that climbs and falls in square steps across the panel, repeated one above another.',
(W,H,u)=>{const s=u*0.5,P=[];for(let j=-1;j*s*2.4<H+s*3;j++){const y=j*s*2.4,q=[[0,y+s]];for(let i=0;i*s<=W+s;i+=2){const up=(i/2)%2===0;q.push([i*s,y+(up?s:0)],[i*s,y+(up?0:s)],[(i+2)*s,y+(up?0:s)]);}P.push(stL(q));}return P;});
stTile('adCircles','Tied rings','adire oniko','Rings of small dots where the cloth was bound round a seed or pebble before dyeing: the tied form of Yoruba indigo resist.',
(W,H,u)=>{const s=u*1.5,P=[];for(let j=0;j*s<H+s;j++)for(let i=0;i*s<W+s;i++){const cx=i*s+(j%2?s/2:0),cy=j*s*0.87;for(const [r,n] of [[0.36,14],[0.2,8]])for(let k=0;k<n;k++){const a=k/n*Math.PI*2;P.push({kind:'dot',x:cx+Math.cos(a)*s*r,y:cy+Math.sin(a)*s*r,r:Math.max(1.3,s*0.035),role:'inner'});}
    P.push({kind:'dot',x:cx,y:cy,r:Math.max(1.5,s*0.045),role:'inner'});}return P;});
stTile('adSquares','Nested squares','adire eleko','Squares within squares, drawn in starch with the edge of a feather.',
(W,H,u)=>{const s=u*1.1,P=[];for(let j=0;j*s<H+s;j++)for(let i=0;i*s<W+s;i++){const x=i*s,y=j*s;for(const k of [0.08,0.24,0.4])P.push(stL([[x+s*k,y+s*k],[x+s*(1-k),y+s*k],[x+s*(1-k),y+s*(1-k)],[x+s*k,y+s*(1-k)]],k===0.08?'inner':'detail',true));}return P;});
stTile('adComb','Combed lines','adire eleko','Close parallel lines drawn with a comb, their direction changing square by square.',
(W,H,u)=>{const s=u*1.2,t=s/7,P=[];for(let j=0;j*s<H+s;j++)for(let i=0;i*s<W+s;i++){const x=i*s,y=j*s;P.push(stL([[x,y],[x+s,y],[x+s,y+s],[x,y+s]],'inner',true));
    for(let k=1;k<7;k++)P.push((i+j)%2?stL([[x+k*t,y+t*0.6],[x+k*t,y+s-t*0.6]],'detail'):stL([[x+t*0.6,y+k*t],[x+s-t*0.6,y+k*t]],'detail'));}return P;});

/* ---------- adinkra stamps ---------- */
const stRing=(r0,r1,z=0)=>[flP(G.circle(0,0,r0,64),z),flC(G.circle(0,0,r1,56),z+1)];
const stStamp=P=>fitParts(FL.done(P),92);
const stSpiral=(cx,cy,r0,r1,a0,turns,dir,n=40)=>{const p=[];for(let i=0;i<=n;i++){const t=i/n,a=(a0+dir*t*turns*360)*DEG,r=lerp(r0,r1,t);p.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}return p;};
const stBand=(pts,w)=>flP(G.ribbon(G.resample(pts,false,1.4),()=>w/2),0);
const AD=(key,name,term,meaning,fn)=>defMotif(key,{name,term,meaning,upright:true,fn(rng,g){return stStamp(fn());}});
AD('adAdinkrahene','Chief of the symbols','adinkrahene','Three circles, one inside another. “Chief of the adinkra symbols”: greatness, charisma and leadership, and said to be the form the others were made from.',
()=>stRing(46,37).concat(stRing(29,20,2),[flP(G.circle(0,0,11,40),4)]));
AD('adDwennimmen','Ram’s horns','dwennimmen','Four horns curling about a centre. The ram fights hard but submits humbly to slaughter: strength that goes with humility.',
()=>{const P=[flP([[-4.5,-30],[4.5,-30],[4.5,30],[-4.5,30]],0),flP([[0,-11],[11,0],[0,11],[-11,0]],0)];
  for(const sx of [-1,1])for(const sy of [-1,1]){const sp=stSpiral(sx*25,sy*25,19,4.5,sy>0?(sx>0?-90:-90):(sx>0?90:90),1.1,sx*sy>0?1:-1).map(q=>q);
    P.push(stBand([[sx*2,sy*30],[sx*10,sy*43],[sx*25,sy*44]].concat(stSpiral(sx*25,sy*25,19,4.5,sy*90,1.15,sx*sy)),8.5));}
  return P;});
AD('adSankofa','Go back and fetch it','sankofa','A heart whose lobes curl back on themselves. “Return and take it”: there is no shame in going back for what was forgotten; learn from the past.',
()=>{const P=[];for(const s of [-1,1]){const half=G.chain(G.bez([0,44],[s*20,26],[s*44,10],[s*42,-14],18),G.bez([s*42,-14],[s*40,-36],[s*14,-42],[s*8,-22],16),stSpiral(s*20,-18,12,4,s>0?200:-20,0.85,s,22));
    P.push(stBand(half,8.5));P.push(stBand(stSpiral(s*36,30,9,3.5,s>0?180:0,0.9,-s,18),6));}
  P.push(flP([[0,34],[5,44],[0,50],[-5,44]],0));return P;});
AD('adAkoma','The heart','akoma','A heart. Patience and tolerance: of someone who endures, the Akan say “he has a heart in his stomach”.',
()=>[flP(G.chain(G.bez([0,44],[-18,26],[-46,8],[-46,-16],18),G.bez([-46,-16],[-46,-40],[-12,-46],[0,-22],16),G.bez([0,-22],[12,-46],[46,-40],[46,-16],16),G.bez([46,-16],[46,8],[18,26],[0,44],18)).slice(0,-1),0)]);
AD('adNsoromma','Child of the heavens','nsoromma','An eight-rayed star. “Child of the sky”: guardianship, and a reminder that God watches over all.',
()=>{const s=[];for(let i=0;i<16;i++){const a=(-90+i*22.5)*DEG,r=i%2?19:46;s.push([Math.cos(a)*r,Math.sin(a)*r]);}return[flP(s,0),flC(G.circle(0,0,9.5,32),1)];});
AD('adMateMasie','What I hear, I keep','mate masie','Four linked eyes. “I have heard and kept it”: wisdom, knowledge and the prudence to hold on to what one is told.',
()=>{const P=[flP([[0,-14],[14,0],[0,14],[-14,0]],0)];for(const sx of [-1,1])for(const sy of [-1,1])P.push(flP(G.circle(sx*23,sy*23,21.5,48),0),flC(G.circle(sx*23,sy*23,10.5,32),1),flP(G.circle(sx*23,sy*23,4,20),2));return P;});
AD('adNkyinkyim','Twisting','nkyinkyim','A band that turns and turns again. Initiative, dynamism and versatility: life’s road is never straight.',
()=>[flP(G.band([[-42,40],[-42,12],[-14,12],[-14,-14],[-42,-14],[-42,-40],[14,-40],[14,-12],[42,-12],[42,40],[14,40],[14,14]],10.5),0)]);
AD('adOsram','Moon and star','ɔsram ne nsoromma','A star resting in the crescent moon. Love, faithfulness and harmony.',
()=>{const s=[];for(let i=0;i<16;i++){const a=(-90+i*22.5)*DEG,r=i%2?6:15;s.push([Math.cos(a)*r,-24+Math.sin(a)*r]);}
  return[flP(G.arc(0,-6,44,8,172,40).concat(G.arc(0,-24,39,154,26,32)),0),flP(s,0)];});
AD('adAya','Fern','aya','A fern frond. Endurance and resourcefulness: the fern grows where little else will.',
()=>{const P=[flP([[-3,46],[3,46],[2,-40],[-2,-40]],0)];for(let i=0;i<5;i++){const y=34-i*17,l=30-i*4.5;for(const s of [-1,1])P.push(flP(G.xform(G.petal(l,6.5-i*0.6,'pointed'),{x:0,y,rot:s*(58-i*4)}),0));}
  P.push(flP(G.xform(G.petal(16,5,'pointed'),{x:0,y:-36}),0));return P;});
AD('adMpuannum','Five tufts','mpuannum','Five tufts of hair, the style of priestesses. Loyalty, priestly office and skill.',
()=>{const P=[];for(const [x,y] of [[0,0],[-27,-27],[27,-27],[27,27],[-27,27]])P.push(flP(G.circle(x,y,17.5,40),0),flC(G.circle(x,y,6,24),1));return P;});
ST.ADINKRA=['adAdinkrahene','adDwennimmen','adSankofa','adAkoma','adNsoromma','adMateMasie','adNkyinkyim','adOsram','adAya','adMpuannum'];

/* ---------- adire motifs (resist lines) ---------- */
const AE=(key,name,term,meaning,fn)=>defMotif(key,{name,term,meaning,upright:true,fn(){return fitParts(fn(),90);}});
AE('aeLeaf','Cassava leaf','ewé ẹ̀gẹ́','A leaf of five or seven fingers. Cassava is the daily food, and its paste is the starch the pattern is painted with.',
()=>{const P=[stL([[0,46],[0,6]],'outer')];for(const a of [-66,-34,0,34,66]){const pt=G.xform(G.petal(42-Math.abs(a)*0.16,7.5,'pointed'),{x:0,y:8,rot:a});P.push(stL(pt,'outer',true),stL([G.xform([[0,-4]],{x:0,y:8,rot:a})[0],G.xform([[0,-(34-Math.abs(a)*0.16)]],{x:0,y:8,rot:a})[0]],'detail'));}return P;});
AE('aeComb','Comb','òòyà','A wooden comb, drawn the way it is used to draw: a bar and its teeth.',
()=>{const P=[stL(G.roundRect(-38,-40,38,-16,6,4),'outer',true),stL([[-30,-28],[30,-28]],'detail')];for(let i=0;i<9;i++){const x=-34+i*8.5;P.push(stL([[x,-16],[x,42]],'inner'));}return P;});
AE('aePillars','Pillars','ọ̀wọ́n','A row of columns with capitals: the pillars of Mapo Hall, which give the Ibadan cloth “Ibadan is sweet” its name.',
()=>{const P=[stL([[-44,-40],[44,-40]],'outer'),stL([[-44,42],[44,42]],'outer')];for(const x of [-30,0,30]){P.push(stL([[x-9,-40],[x+9,-40],[x+6,-30],[x-6,-30]],'inner',true),stL([[x-6,-30],[x-6,34],[x+6,34],[x+6,-30]],'inner'),stL([[x-10,34],[x+10,34],[x+10,42],[x-10,42]],'inner',true));
    for(let k=0;k<5;k++)P.push(stL([[x-6,-20+k*12],[x+6,-20+k*12]],'detail'));}return P;});
AE('aeSun','Sun','oòrùn','A ringed disc with rays: one of the commonest squares on a starch-resist cloth.',
()=>{const P=[stL(G.circle(0,0,18,40),'outer',true),stL(G.circle(0,0,9,28),'inner',true)];for(let i=0;i<16;i++){const a=i*22.5*DEG,r0=24,r1=i%2?36:44;P.push(stL([[Math.cos(a)*r0,Math.sin(a)*r0],[Math.cos(a)*r1,Math.sin(a)*r1]],'inner'));}return P;});

/* ---------- borders ---------- */
defBorder('nwomu',{name:'Whip-stitched seam',fn(L,t){const n=Math.max(4,Math.round(L/(t*0.42))),w=L/n,P=[];
  for(let i=0;i<n;i++)P.push(stP([[i*w,t*0.82],[i*w+w*0.62,t*0.82],[i*w+w,t*0.18],[i*w+w*0.38,t*0.18]],[0,2,1,3,4][Math.floor(i/3)%5]));
  P.push(stL([[0,t*0.1],[L,t*0.1]],'inner'),stL([[0,t*0.9],[L,t*0.9]],'inner'));return P;}});
defBorder('combRule',{name:'Comb-ruled lines',fn(L,t){const P=[];for(let k=0;k<4;k++){const y=t*(0.2+k*0.2);P.push(stL([[0,y],[L,y]],k===0||k===3?'outer':'inner'));}return P;}});
defBorder('mudTicks',{name:'Ticked bar',fn(L,t){const n=Math.max(4,Math.round(L/(t*0.5))),w=L/n,P=[stL([[0,t*0.15],[L,t*0.15]],'outer'),stL([[0,t*0.85],[L,t*0.85]],'outer')];
  for(let i=0;i<n;i++)P.push(stL([[(i+0.2)*w,t*0.72],[(i+0.8)*w,t*0.28]],'inner'));return P;}});

/* ---------- layouts ---------- */
const stRect=(a,b,c,e)=>[[a,b],[c,b],[c,e],[a,e]];
const stTiles=(g,rng,re,fb)=>{const p=poolAll(g.motifs.tile).filter(k=>SG.tiles[k]&&re.test(k));return p.length?rng.shuffle(p):(poolAll(g.motifs.tile).filter(k=>SG.tiles[k]).length?rng.shuffle(poolAll(g.motifs.tile).filter(k=>SG.tiles[k])):fb);};
const stReserve=(ctx,cx,cy,R)=>ctx.parts([{kind:'region',closed:true,role:'outer',plain:true,bg:true,pts:G.circle(cx,cy,R,96)},{kind:'line',closed:true,role:'outer',pts:G.circle(cx,cy,R,96)},{kind:'line',closed:true,role:'inner',pts:G.circle(cx,cy,R-9,96)}],'ring');
/* Strip cloth: one woven cloth edge to edge, hemmed, with a fringe of warp ends. */
defStructure('stripCloth',{name:'Strip cloth',blurb:'Narrow woven strips sewn edge to edge, pattern blocks staggered against striped stretches so the cloth reads as a chequerboard.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,x0=40,x1=W-40,y0=64,y1=H-64,r={x0,y0,x1,y1};
  const key=stTiles(g,rng,/^kente/,['kente'])[0],u=lerp(96,64,clamp(S.density));
  ctx.items.push({type:'parts',parts:tileParts(key,r,u,rng.fork('k'),g),role:'frame',variant:'cloth'});
  const F=[];for(let x=x0+3;x<x1;x+=6.5)for(const [ya,d] of [[y0,-1],[y1,1]])F.push(stL([[x,ya],[x+rng.range(-2,2),ya+d*rng.range(22,34)]],'detail'));
  ctx.parts(F.concat([stL(stRect(x0,y0,x1,y1),'outer',true)]),'frame');
  const hero=ctx.pick('hero'),M=SG.motifs[hero],fig=M&&M.figure;
  if(fig||rng.next()<0.5*(1-clamp(S.bare||0))){const R=(y1-y0)*(fig?0.32:0.22);stReserve(ctx,W/2,H/2,R);ctx.motif(hero,W/2,H/2,R*1.7,{role:'hero',variant:'hero'});}
}});
/* Stamped cloth: ruled into squares with a comb, each square stamped all over with one
   symbol; the cloth's two halves joined by a seam of coloured whip-stitching. */
defStructure('stampedCloth',{name:'Stamped cloth',blurb:'A cloth ruled into squares by comb lines, each square stamped over and over with one symbol, with a bright stitched seam across the middle.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,m=44,x0=m,x1=W-m,y0=m,y1=H-m,n=rng.pick([3,3,4]),seam=26,cw=(x1-x0)/n,ch=(y1-y0-seam)/n,rule=Math.min(cw,ch)*0.075,P=[];
  const yOf=j=>y0+j*ch+(j>=Math.ceil(n/2)?seam:0);
  // comb rules: four close lines round every square
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const a=x0+i*cw,b=yOf(j);for(let k=0;k<4;k++){const d=rule*(0.25+k*0.28);P.push(stL(stRect(a+d,b+d,a+cw-d,b+ch-d),k===0?'outer':'inner',true));}}
  ctx.parts(P,'frame');
  const ys=yOf(Math.ceil(n/2))-seam;
  ctx.items.push({type:'parts',parts:SG.borders.nwomu.fn(x1-x0,seam).map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[x+x0,y+ys])})),role:'border',variant:'seam'});
  const pool=[...new Set(poolAll(g.motifs.hero).concat(poolAll(g.motifs.ring)))].filter(k=>SG.motifs[k]&&!SG.motifs[k].script);const keys=rng.shuffle(pool.length?pool:['floret']);
  const d=clamp(S.density);let q=0;
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const key=keys[q++%keys.length],M=SG.motifs[key],k=M.figure?1:(d>0.6?3:2),a=x0+i*cw+rule*1.4,b=yOf(j)+rule*1.4,w=cw-rule*2.8,h=ch-rule*2.8,s=Math.min(w,h)/k;
    for(let v=0;v<k;v++)for(let c=0;c<k;c++)ctx.motif(key,a+(c+0.5)*w/k,b+(v+0.5)*h/k,s*0.78,{role:k===1?'hero':'ring',variant:'st'+key,noOcc:true});}
}});
/* Mud cloth: narrow strips, each a stack of panels with one small repeat, between plain
   bars; a different pattern across the two ends. */
defStructure('mudCloth',{name:'Mud cloth',blurb:'Narrow strips, each a stack of panels holding one small repeat, with plain bars between and a border pattern across both ends.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,x0=36,x1=W-36,y0=36,y1=H-36,d=clamp(S.density),tiles=stTiles(g,rng,/^bg/,['bgZigzag','bgLozenge','bgDots']);
  const end=(y1-y0)*0.085,u=lerp(64,40,d),P=[stL(stRect(x0,y0,x1,y1),'outer',true)];
  const put=(key,r,uu,tag)=>ctx.items.push({type:'parts',parts:tileParts(key,r,uu,rng.fork(tag),g),role:'frame',variant:'mud'+key});
  put(tiles[0],{x0,y0,x1,y1:y0+end},u*0.8,'e0');put(tiles[0],{x0,y0:y1-end,x1,y1},u*0.8,'e1');
  P.push(stL([[x0,y0+end],[x1,y0+end]],'outer'),stL([[x0,y1-end],[x1,y1-end]],'outer'));
  const n=rng.pick([4,5,5,6]),sw=(x1-x0)/n,bar=10,fy0=y0+end+bar,fy1=y1-end-bar;
  const hero=ctx.pick('hero'),M=SG.motifs[hero],fig=M&&M.figure,mid=Math.floor(n/2);let q=1;
  for(let i=0;i<n;i++){const a=x0+i*sw;if(i)P.push(stL([[a,y0+end],[a,y1-end]],'outer'));
    if(fig&&n%2&&i===mid){ctx.motif(hero,a+sw/2,(fy0+fy1)/2,Math.min(sw*0.9,(fy1-fy0)*0.6),{role:'hero',variant:'hero'});continue;}
    const m=rng.int(2,4),hs=Array.from({length:m},()=>rng.range(0.7,1.5)),tot=hs.reduce((s,v)=>s+v,0);let y=fy0;
    hs.forEach((h,k)=>{const hh=(fy1-fy0-(m-1)*bar)*h/tot;put(tiles[q++%tiles.length],{x0:a+bar*0.6,y0:y,x1:a+sw-bar*0.6,y1:y+hh},u,'p'+i+'_'+k);
      P.push(stL(stRect(a+bar*0.6,y,a+sw-bar*0.6,y+hh),'inner',true));y+=hh+bar;});}
  ctx.parts(P,'frame');
}});
/* Starch-resist cloth: a grid of squares, each with its own motif or filling, the whole
   set repeated across the cloth. */
defStructure('resistGrid',{name:'Resist-dyed squares',blurb:'A grid of squares, each holding a different motif or filling, drawn in starch so the lines stay pale when the cloth is dyed.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,m=40,x0=m,y0=m,n=clamp(S.density)>0.6?5:4,c=(W-2*m)/n,P=[];
  const tiles=stTiles(g,rng,/^ad/,['adCircles','adSquares','adComb']),pool=[...new Set(poolAll(g.motifs.hero).concat(poolAll(g.motifs.ring)))].filter(k=>SG.motifs[k]&&!SG.motifs[k].script),keys=rng.shuffle(pool.length?pool:['floret']);
  // the cloth repeats a block of two rows: lay the block out once, then repeat it down the cloth
  const block=[];for(let j=0;j<2;j++)for(let i=0;i<n;i++)block.push((i+j)%2===0?['m',keys[(j*n+i>>1)%keys.length]]:['t',tiles[(i+j*2)%tiles.length]]);
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const a=x0+i*c,b=y0+j*c,[kind,key]=block[(j%2)*n+i];
    P.push(stL(stRect(a,b,a+c,b+c),'outer',true),stL(stRect(a+5,b+5,a+c-5,b+c-5),'detail',true));
    if(kind==='m')ctx.motif(key,a+c/2,b+c/2,c*0.72,{role:SG.motifs[key].figure?'hero':'ring',variant:'rg'+key,noOcc:true});
    else ctx.items.push({type:'parts',parts:tileParts(key,{x0:a+8,y0:b+8,x1:a+c-8,y1:b+c-8},c*0.3,rng.fork('t'+key),g),role:'frame',variant:'rg'+key});}
  ctx.parts(P,'frame');
}});
