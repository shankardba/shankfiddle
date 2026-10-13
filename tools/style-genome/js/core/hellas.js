'use strict';
/* Hellas — Greek vase painting and the ornament that frames it.

   A painted pot is a stack of horizontal zones. Narrow bands of repeating ornament —
   meander, palmettes and lotus, tongues, rays, ivy — fence off one broad zone that holds
   the figures. The potter's shape decides where the bands fall: lip, neck, shoulder,
   belly, foot.

   FIGURES ARE SILHOUETTES. In black-figure the figure is painted solid in gloss that
   fires black, and its detail is scratched through to the clay with a point. Red-figure
   is the same drawing with the colours exchanged: the figure is left in the clay and the
   background is painted. Here a figure is always a solid shape with fine lines cut back
   to the ground colour (`paint:'knock'`), so the exchange is made by the palette alone —
   dark ink on a clay ground for black-figure, clay ink on a black ground for red-figure.

   GEOMETRIC painting, three centuries earlier, covers the whole pot in bands and builds
   people and horses from triangles, tubes and sticks.

   The space outside the pot is painted in the ink colour, like a pot photographed against
   a dark wall; a thin line of ground colour then picks out its profile. */

const HE={};
const heKn=(pts,kw=1.5,closed=false)=>({kind:'line',pts,closed,role:'detail',paint:'knock',kw,noSeed:true});
const heLimb=(pts,ws,z=0)=>{const p=G.resample(G.chaikin(pts,false,2),false,1);return flP(G.ribbon(p,t=>{const k=t*(ws.length-1),i=Math.min(ws.length-2,Math.floor(k));return lerp(ws[i],ws[i+1],k-i)/2;}),z);};
const heFit=(P,s=94)=>fitParts(FL.done(P),s);
const heLn=(pts,role='inner',closed=false)=>({kind:'line',role,closed,pts});

/* ---------- ornament motifs ---------- */
// a palmette: a fan of petals over a heart, on two volutes
HE.palmette=function(n=9,R=40){const P=[];
  for(let i=0;i<n;i++){const a=lerp(-78,78,i/(n-1)),l=R*(1-0.22*Math.pow(Math.abs(a)/78,1.6));P.push(flP(G.xform(G.petal(l,R*0.105,'round'),{x:0,y:6,rot:a}),0));}
  P.push(flP(G.xform(G.petal(15,7,'round'),{x:0,y:16}),0));
  for(const s of [-1,1]){const sp=[];for(let k=0;k<=30;k++){const t=k/30,a=(s>0?180:0)+s*t*520,r=lerp(11,2.2,t);sp.push([s*13+Math.cos(a*DEG)*r,18+Math.sin(a*DEG)*r]);}P.push(flP(G.ribbon(sp,t=>1.6-0.7*t),0));}
  return P;};
HE.lotus=function(R=40){const P=[];for(const a of [-30,0,30])P.push(flP(G.xform(G.petal(R*(a?0.86:1),R*0.17,'pointed'),{x:0,y:14,rot:a}),0));
  for(const s of [-1,1])P.push(flP(G.xform(G.petal(R*0.62,R*0.1,'pointed'),{x:0,y:14,rot:s*62}),0));P.push(flP(G.circle(0,17,5,20),0));return P;};
defMotif('grPalmette',{name:'Palmette',term:'anthemion',upright:true,meaning:'A fan of leaves rising from a pair of spirals. It came to Greece from Egypt and the Near East in the seventh century BC and never left: on vases it closes the space under a handle, and in rows it crowns temples.',
fn(){return heFit(HE.palmette(),92);}});
defMotif('grLotus',{name:'Lotus bud',term:'lotos',upright:true,meaning:'Three pointed petals in a calyx. Alternated with the palmette along a chain of tendrils, it makes the commonest band in Greek ornament.',
fn(){return heFit(HE.lotus(),88);}});
defMotif('grRosette',{name:'Dot rosette',term:'—',meaning:'A ring of petals round a centre: the filler scattered between figures on Corinthian and early Attic pots.',
fn(){const P=[flP(G.circle(0,0,9,28),0)];for(let i=0;i<8;i++)P.push(flP(G.xform(G.petal(26,8,'round'),{x:0,y:0,rot:i*45}).map(([x,y])=>[x+Math.sin(i*45*DEG)*11,y-Math.cos(i*45*DEG)*11]),0));return heFit(P,80);}});
defMotif('grAmphora',{name:'Amphora',term:'amphoreus',upright:true,meaning:'The two-handled storage jar, for wine and oil. Filled with oil from Athena’s olive trees, it was the prize at the Panathenaic games.',
fn(){const prof=HE.profile('amphora',0,-46,92,60),P=[flP(prof.outline,0)];for(const t of [0.2,0.3,0.66,0.74])P.push(heKn([[-prof.r(t),prof.y(t)],[prof.r(t),prof.y(t)]],1.6));
  for(const s of [-1,1])P.push(heLimb([[s*prof.r(0.07),prof.y(0.07)],[s*prof.r(0.07)+s*17,prof.y(0.1)],[s*prof.r(0.26)+s*6,prof.y(0.24)],[s*prof.r(0.27),prof.y(0.27)]],[3.4,3.4,3.4,3.4],0));return heFit(P,94);}});

/* ---------- figures ---------- */
defMotif('grHorse',{name:'Horse, Geometric style',term:'hippos',figure:true,mirrorOk:true,meaning:'A horse as the painters of the eighth century BC built it: a tube for the body, a swelling neck, legs like reeds. Horses meant wealth and rank, and march round the great funeral vases.',
fn(){const P=[];
  P.push(flP(G.chaikin([[21,-11],[8,-5],[-9,-3.5],[-23,-10],[-32,-4],[-30,6],[-19,5.5],[-6,1.5],[8,2.5],[17,8],[25,2]],true,3),0));
  P.push(heLimb([[19,-3],[22,-20],[28,-37]],[17,11,6.5]),heLimb([[26,-38],[35,-35],[44,-27]],[7.6,5.6,3.2]),flP([[23,-39],[25.5,-50],[29.5,-38]],0));
  for(const pts of [[[16,5],[14.5,21],[17,30],[14,45]],[[22,4],[25,20],[27,30],[24,45]],[[-27,4],[-22,18],[-27.5,30],[-26,45]],[[-21,4],[-14,18],[-19,30],[-17,45]]]){P.push(heLimb(pts,[5.4,3.2,2.5,2.3]));const x=pts[3][0];P.push(flP([[x-1.6,44],[x+4.2,44],[x+4.8,47.5],[x-1.6,47.5]],0));}
  P.push(heLimb([[-31,-7],[-41,0],[-40,38]],[3.2,1.9,1.1]),flC(G.circle(35.5,-34.5,1.1,10),1));return heFit(P,96);}});
defMotif('grWarriorGeo',{name:'Warrior, Geometric style',term:'—',figure:true,mirrorOk:true,meaning:'A man reduced to signs: a triangle for the chest, a wasp waist, heavy thighs, a dot for the eye. Rows of them, armed or mourning, circle the Dipylon vases of Athens.',
fn(){const P=[flP(G.circle(0,-39,5.6,28),0),flP([[4,-41],[10,-38],[4,-36]],0),flC(G.circle(1.6,-40,1.1,10),1),flP([[-2,-34],[2,-34],[2,-29],[-2,-29]],0)];
  P.push(flP([[-14,-30],[14,-30],[2.2,-3],[-2.2,-3]],0));
  P.push(heLimb([[-1,-4],[-7,14],[-5,30],[-6,45]],[5,9,4.6,3]),heLimb([[2,-4],[8,14],[8,30],[9,45]],[5,9,4.6,3]),flP([[-8,44],[0,44],[1,47.5],[-8,47.5]],0),flP([[7,44],[15,44],[16,47.5],[7,47.5]],0));
  P.push(heLimb([[13,-29],[19,-22],[23,-17]],[2.8,2.4,2.2]),heLimb([[-13,-29],[-21,-17],[-9,-9]],[2.8,2.4,2.2]));
  P.push(flP(G.band([[23,-50],[23,47]],1.5),0),flP([[23,-56],[25.6,-48],[20.4,-48]],0),flP(G.band([[-10,-10],[10,-2]],1.6),0));return heFit(P,96);}});
defMotif('grHoplite',{name:'Hoplite',term:'hoplitēs',figure:true,mirrorOk:true,meaning:'The citizen foot-soldier: crested helmet, round shield with its blazon, greaves, a thrusting spear. Duels of heroes fought in this armour are the favourite subject of black-figure painters.',
fn(rng){const P=[];
  // spear, held overhand; then the arm that holds it
  P.push(flP(G.band([[-46,-33],[44,-28]],1.7),0),flP([[44,-30.6],[52,-27.6],[44,-25.4]],0),heLimb([[-9,-15],[-19,-25],[-13,-32]],[5,4.4,3.6]));
  // legs
  P.push(heLimb([[6,16],[14,32],[12,44]],[9,5.6,3.4]),flP([[10,43],[22,45],[23,48.5],[9.6,48.5]],0),heLimb([[-5,16],[-13,31],[-20,44]],[9,5.6,3.4]),flP([[-23,43],[-11,45],[-10,48.5],[-23.4,48.5]],0));
  P.push(heKn([[9,30],[17,29]],1.1),heKn([[-16,29],[-8,30]],1.1));
  // skirt of the tunic below the shield
  P.push(flP([[-13,10],[13,10],[15,23],[-15,23]],0));for(const x of [-8,-3,2,7])P.push(heKn([[x,14],[x+1,23]],0.9));
  // neck, helmet, crest
  P.push(flP([[-2,-22],[7,-22],[7,-14],[-2,-14]],0));
  P.push(flP(G.chain(G.bez([-9,-22],[-12,-38],[0,-46],[10,-42],12),G.bez([10,-42],[15,-38],[15,-30],[13.5,-24],8),[[11,-17],[7,-21],[4,-18],[-8,-19]]),0));
  P.push(flC(G.xform(FL.lens(6.2,1.5,1.5),{x:7.5,y:-32.5,rot:-8}),1),heKn([[10.5,-29],[7.5,-21.5]],0.9));
  P.push(flP(G.band([[1,-46],[1,-50]],2.2),0),flS(G.ribbon(G.resample(G.chaikin([[13,-46],[6,-55],[-6,-56],[-14,-47],[-17,-30]],false,3),false,1),t=>2+3.6*Math.sin(Math.PI*clamp(t,0.05,1))*0.9+1.2*t),2));
  // shield and its blazon
  P.push(flP(G.circle(0,-3,21.5,72),3),heKn(G.circle(0,-3,18.4,64),1.1,true));
  const dev=rng.pick(['whirl','star','bird']);
  if(dev==='whirl')for(let i=0;i<3;i++)P.push(flC(G.xform(FL.crescent(9.5,0.45),{x:Math.cos((i*120-90)*DEG)*6.5,y:-3+Math.sin((i*120-90)*DEG)*6.5,rot:i*120+40}),4));
  else if(dev==='star'){const s=[];for(let i=0;i<16;i++){const a=(-90+i*22.5)*DEG,r=i%2?5:14;s.push([Math.cos(a)*r,-3+Math.sin(a)*r]);}P.push(flC(s,4));}
  else P.push(flC(G.chain(G.bez([-12,-1],[-6,-12],[6,-10],[12,-6],10),G.bez([12,-6],[6,-5],[4,0],[8,6],8),G.bez([8,6],[0,2],[-6,2],[-12,-1],8)),4),flP(G.circle(8,-6.5,0.9,8),5));
  return heFit(P,96);}});
defMotif('grOwl',{name:'Owl',term:'glaux',figure:true,upright:true,meaning:'The little owl of Athena, body in profile and face turned full to the viewer, with a sprig of olive. It stood on Athenian silver coins for three centuries; “owls” was the common word for the coins themselves.',
fn(){const P=[];
  P.push(flP(G.chain(G.bez([-2,-14],[-24,-2],[-34,22],[-28,36],14),G.bez([-28,36],[-12,34],[8,34],[14,24],12),G.bez([14,24],[20,10],[20,-4],[16,-12],10)),0));
  P.push(flP(G.circle(8,-25,19.5,64),1));
  for(const x of [-1,17])P.push(flC(G.circle(x,-27,7.6,32),2),flP(G.circle(x,-27,3.3,20),3));
  P.push(flC([[5,-21],[11,-21],[8,-14]],2),flP([[6.4,-20.2],[9.6,-20.2],[8,-16]],3),heKn(G.arc(8,-27,16.5,200,340,20),0.9));
  for(let j=0;j<4;j++)for(let i=0;i<5-j;i++)P.push(flC(G.circle(-22+j*2.5+i*7.6,2+j*8,1.5,10),2));
  P.push(heKn(G.bez([-10,-8],[-22,4],[-27,20],[-24,33],14),1));
  for(const x of [-4,6])P.push(flP(G.band([[x,32],[x,42]],2.4),0),flP([[x-5,42],[x+5,42],[x+6,45.5],[x-6,45.5]],0));
  // olive sprig
  P.push(flP(G.band([[-36,-18],[-22,-42]],1.4),0));for(const [x,y,a] of [[-30,-28,-70],[-26,-35,20],[-23,-41,-40]])P.push(flP(G.xform(G.petal(13,3.4,'pointed'),{x,y,rot:a}),0));P.push(flP(G.circle(-37,-26,2.2,12),0));
  return heFit(P,94);}});
defMotif('grDolphin',{name:'Dolphin',term:'delphis',figure:true,mirrorOk:true,meaning:'A leaping dolphin. Sailors’ companion and sacred to Apollo and Dionysos; schools of them swim round the insides of wine cups and across coins of the island cities.',
fn(){const sp=G.resample(G.bez([-38,16],[-22,-26],[18,-30],[40,6],40),false,1),P=[];
  P.push(flP(G.ribbon(sp,t=>t<0.08?1.6+t*30:t>0.9?Math.max(0.9,8.6*(1-(t-0.9)/0.1*0.82)):1.2+8.4*Math.pow(Math.sin(Math.PI*clamp(t,0,1)),0.55)),0));
  P.push(flP(G.chain(G.bez([-2,-22],[-2,-34],[-12,-38],[-16,-36],8),G.bez([-16,-36],[-10,-30],[-12,-24],[-14,-18],8)),0));
  P.push(flP(G.xform(G.petal(17,5.5,'pointed'),{x:-37,y:15,rot:-150}),0),flP(G.xform(G.petal(17,5.5,'pointed'),{x:-37,y:15,rot:150}),0),flP(G.xform(G.petal(13,4.4,'pointed'),{x:14,y:-9,rot:150}),0));
  P.push(flC(G.circle(30,-6,1.7,12),1),heKn(G.bez([-28,6],[-10,-12],[14,-16],[34,0],20),1));return heFit(P,96);}});

/* ---------- borders ---------- */
const heClamp=(P,L,t)=>P.map(p=>p.kind==='dot'?p:Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));
const heKEY=[[0,5],[0,0],[5,0],[5,4],[2,4],[2,2],[3,2],[3,3],[4,3],[4,1],[1,1],[1,5]];
defBorder('grMeander',{name:'Meander',fn(L,t){const k=t*0.8/5,n=Math.max(1,Math.round(L/(6*k))),kx=L/(6*n),y0=t*0.1,pts=[];
  for(let i=0;i<n;i++)for(const [x,y] of heKEY)pts.push([i*6*kx+x*kx,y0+y*k]);pts.push([L,y0+5*k]);
  return heClamp([flP(G.band(pts,Math.min(k,kx)*0.46),0),heLn([[0,t*0.02],[L,t*0.02]],'inner'),heLn([[0,t*0.98],[L,t*0.98]],'inner')],L,t);}});
defBorder('grMeanderHatched',{name:'Hatched meander',fn(L,t){const k=t*0.72/4,n=Math.max(1,Math.round(L/(4*k))),kx=L/(4*n),y0=t*0.14,pts=[];
  for(let i=0;i<n;i++)for(const [x,y] of [[0,4],[0,0],[2,0],[2,4]])pts.push([i*4*kx+x*kx+kx,y0+y*k]);
  return[{kind:'region',closed:true,role:'outer',plain:true,forceFill:'hatch',pts:G.band(pts,Math.min(k,kx)*0.9)},heLn([[0,t*0.03],[L,t*0.03]],'outer'),heLn([[0,t*0.97],[L,t*0.97]],'outer')];}});
defBorder('grPalmetteLotus',{name:'Palmette and lotus chain',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.92))),w=L/n,s=t/56,P=[];
  for(let i=0;i<n;i++){const x=(i+0.5)*w;P.push(...FL.put(i%2?HE.lotus(40):HE.palmette(7,40),{x,y:t*0.58,s:s*0.98}));
    P.push(flP(G.ribbon(G.resample(G.bez([x+w*0.14,t*0.9],[x+w*0.35,t*1.02],[x+w*0.65,t*1.02],[x+w*0.86,t*0.9],12),false,1.2),()=>Math.max(0.7,t*0.02)),0));}
  return P.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));}});
defBorder('grTongues',{name:'Tongues',fn(L,t){const n=Math.max(3,Math.round(L/(t*0.42))),w=L/n,P=[heLn([[0,t*0.04],[L,t*0.04]],'outer')];
  for(let i=0;i<n;i++){const x=i*w,q=G.chain([[x+w*0.1,t*0.06]],G.bez([x+w*0.1,t*0.7],[x+w*0.1,t*0.98],[x+w*0.9,t*0.98],[x+w*0.9,t*0.7],10),[[x+w*0.9,t*0.06]]);
    P.push(i%2?heLn(q,'inner'):flP(q,0));if(i%2)P.push(flS(G.chain([[x+w*0.3,t*0.06]],G.bez([x+w*0.3,t*0.62],[x+w*0.3,t*0.8],[x+w*0.7,t*0.8],[x+w*0.7,t*0.62],8),[[x+w*0.7,t*0.06]]),1));}
  return P;}});
defBorder('grRays',{name:'Rays',fn(L,t){const n=Math.max(3,Math.round(L/(t*0.36))),w=L/n,P=[heLn([[0,t*0.98],[L,t*0.98]],'outer')];
  for(let i=0;i<n;i++)P.push(flP([[i*w+w*0.06,t*0.98],[(i+0.5)*w,t*0.04],[(i+1)*w-w*0.06,t*0.98]],0));return P;}});
defBorder('grEggDart',{name:'Egg and dart',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.72))),w=L/n,P=[heLn([[0,t*0.05],[L,t*0.05]],'outer'),heLn([[0,t*0.97],[L,t*0.97]],'inner')];
  for(let i=0;i<n;i++){const cx=(i+0.5)*w,egg=G.chain([[cx-w*0.3,t*0.08]],G.bez([cx-w*0.3,t*0.6],[cx-w*0.2,t*0.92],[cx+w*0.2,t*0.92],[cx+w*0.3,t*0.6],12),[[cx+w*0.3,t*0.08]]);
    P.push({kind:'region',closed:true,role:'outer',plain:true,ci:0,pts:egg},heLn(G.chain([[cx-w*0.42,t*0.08]],G.bez([cx-w*0.42,t*0.66],[cx-w*0.3,t*1.02],[cx+w*0.3,t*1.02],[cx+w*0.42,t*0.66],12),[[cx+w*0.42,t*0.08]]),'inner'));
    P.push(flP([[i*w-w*0.045,t*0.1],[i*w+w*0.045,t*0.1],[i*w,t*0.92]],0));}
  return heClamp(P,L,t);}});
defBorder('grWave',{name:'Running wave',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.95))),w=L/n,P=[flP([[0,t*0.78],[L,t*0.78]].concat([[L,t],[0,t]]),0)];
  for(let i=0;i<n;i++){const x=i*w,cr=G.chain(G.bez([x,t*0.8],[x+w*0.3,t*0.8],[x+w*0.5,t*0.5],[x+w*0.62,t*0.26],10),G.bez([x+w*0.62,t*0.26],[x+w*0.78,t*0.02],[x+w*1.0,t*0.3],[x+w*0.82,t*0.46],10),G.bez([x+w*0.82,t*0.46],[x+w*0.72,t*0.54],[x+w*0.64,t*0.44],[x+w*0.72,t*0.38],6));
    P.push(flP(G.ribbon(G.resample(cr,false,1.2),tt=>Math.max(0.8,t*0.085*(1-tt*0.75))),0));}
  return P.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));}});
defBorder('grIvy',{name:'Ivy',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.9))),w=L/n,st=[],P=[];for(let i=0;i<=n*16;i++){const x=i/(n*16)*L;st.push([x,t/2+t*0.1*Math.sin(x/w*Math.PI*2)]);}
  P.push(flP(G.ribbon(st,()=>Math.max(0.7,t*0.022)),0));
  const leaf=s=>G.chaikin([[0,-0.25],[-0.35,0.05],[-0.75,-0.15],[-0.82,-0.6],[-0.46,-1.05],[0,-1.5],[0.46,-1.05],[0.82,-0.6],[0.75,-0.15],[0.35,0.05]].map(([a,b])=>[a*s,b*s]),true,2);
  for(let i=0;i<n*2;i++){const x=(i+0.5)*w/2,up=i%2===0;P.push(flP(G.xform(leaf(t*0.27),{x,y:t/2+(up?-t*0.06:t*0.06),rot:up?(i%4?-16:16):180+(i%4?16:-16)}),0));
    P.push({kind:'dot',x:x+w*0.2,y:t/2+(up?t*0.26:-t*0.26),r:Math.max(1,t*0.035),role:'inner'});}
  return P;}});
defBorder('grCircles',{name:'Linked circles',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.92))),w=L/n,P=[heLn([[0,t*0.04],[L,t*0.04]],'outer'),heLn([[0,t*0.96],[L,t*0.96]],'outer')];
  for(let i=0;i<n;i++){const cx=(i+0.5)*w;for(const k of [0.34,0.22,0.1])P.push(heLn(G.circle(cx,t/2,t*k,36),k===0.34?'inner':'detail',true));P.push({kind:'dot',x:cx,y:t/2,r:Math.max(1.1,t*0.035),role:'inner'});
    if(i<n-1)P.push(heLn([[cx+t*0.1,t/2-t*0.325],[cx+w-t*0.1,t/2+t*0.325]],'detail'));}
  return P;}});
defBorder('grZigzag',{name:'Stacked zigzag',fn(L,t){const n=Math.max(3,Math.round(L/(t*0.5))),w=L/n,P=[heLn([[0,t*0.04],[L,t*0.04]],'outer'),heLn([[0,t*0.96],[L,t*0.96]],'outer')];
  for(const o of [0.14,0.34,0.54]){const z=[];for(let i=0;i<=n*2;i++)z.push([i*w/2,t*(o+(i%2?0.3:0))]);P.push(heLn(z,'inner'));}return P;}});

/* ---------- pot shapes ---------- */
HE.SHAPES={
  amphora:{name:'amphora',pts:[[0,.16],[.018,.172],[.034,.15],[.052,.112],[.17,.102],[.215,.15],[.3,.3],[.42,.372],[.54,.366],[.68,.29],[.83,.16],[.925,.102],[.945,.132],[1,.14]],
    zones:[[0,.045,'black'],[.052,.2,'band','neck'],[.205,.285,'band','shoulder'],[.3,.66,'figure'],[.672,.74,'band','belly'],[.78,.92,'band','foot'],[.93,1,'black']],handles:[.075,.27,.11]},
  krater:{name:'krater',pts:[[0,.335],[.03,.345],[.05,.305],[.1,.285],[.3,.292],[.5,.3],[.64,.27],[.76,.16],[.84,.09],[.9,.085],[.925,.15],[1,.168]],
    zones:[[0,.05,'black'],[.06,.135,'band','neck'],[.15,.6,'figure'],[.612,.68,'band','belly'],[.69,.86,'black'],[.87,.9,'plain'],[.91,1,'black']],handles:[.4,.52,.07]},
  lekythos:{name:'lekythos',pts:[[0,.092],[.02,.1],[.05,.05],[.135,.04],[.165,.118],[.2,.15],[.5,.152],[.74,.142],[.86,.062],[.925,.06],[.945,.1],[1,.106]],
    zones:[[0,.05,'black'],[.142,.195,'band','shoulder'],[.205,.255,'band','belly'],[.265,.72,'figure'],[.728,.76,'band','foot2'],[.775,.92,'black'],[.93,1,'black']],handles:[.06,.19,.09]}
};
// profile of a pot centred on cx: top at y0, height Hh, radii as fractions of Wd
HE.profile=function(shape,cx,y0,Hh,Wd){const S=HE.SHAPES[shape],raw=G.chaikin(S.pts.map(([t,r])=>[t,r]),false,3);
  const r=t=>{let i=1;while(i<raw.length-1&&raw[i][0]<t)i++;const a=raw[i-1],b=raw[i],f=(t-a[0])/((b[0]-a[0])||1);return (a[1]+(b[1]-a[1])*clamp(f))*Wd;};
  const y=t=>y0+t*Hh,left=raw.map(([t,rr])=>[cx-rr*Wd,y(t)]),right=raw.map(([t,rr])=>[cx+rr*Wd,y(t)]);
  return {S,r,y,left,right,outline:right.concat(left.slice().reverse())};};

/* Painted pot: horizontal zones on a thrown shape. Ornament bands fence off one broad
   zone for the figures; lip and foot are solid gloss. */
defStructure('vase',{name:'Painted pot',blurb:'Bands of ornament round a thrown shape — lip, neck, shoulder, foot — fencing off one broad zone that holds the figures.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure,d=clamp(S.density);
  const shape=rng.pick(clamp(S.heroScale||0)>0.5?['lekythos']:['amphora','amphora','krater']),y0=58,Hh=H-116,cx=W/2,pr=HE.profile(shape,cx,y0,Hh,Hh*(shape==='krater'?1.02:1));
  const bk=[...new Set(poolAll(g.motifs.border))].filter(k=>SG.borders[k]&&k!=='lines'),pickB=(prefer)=>{const p=bk.filter(k=>prefer.test(k));return rng.pick(p.length?p:bk.length?bk:['zigzag']);};
  const PREF={neck:/Palmette|Ivy|Circles|leafVine|scroll/i,shoulder:/Tongue|Zigzag|petal|scallop/i,belly:/Meander|Wave|Circles|huiwen|greca|plait/i,foot:/Rays|zigzag|petal/i,foot2:/Meander|Zigzag|dot/i};
  const P=[],rect=(a,b,c,e)=>[[a,b],[c,b],[c,e],[a,e]];
  let fig=null;
  for(const [t0,t1,kind,slot] of pr.S.zones){const ya=pr.y(t0),yb=pr.y(t1);let rm=0;for(let k=0;k<=8;k++)rm=Math.max(rm,pr.r(lerp(t0,t1,k/8)));const xa=cx-rm-4,xb=cx+rm+4;
    if(kind==='black'){P.push(flP(rect(xa,ya,xb,yb),0));continue;}
    P.push(heLn([[xa,ya],[xb,ya]],'outer'),heLn([[xa,yb],[xb,yb]],'outer'));
    if(kind==='band'){const key=pickB(PREF[slot]||/./),strip=SG.borders[key].fn(xb-xa,yb-ya-6);
      for(const p of strip)P.push(p.kind==='dot'?Object.assign({},p,{x:p.x+xa,y:p.y+ya+3}):Object.assign({},p,{pts:p.pts.map(([x,y])=>[x+xa,y+ya+3])}));}
    else if(kind==='figure')fig={ya,yb,rm:Math.min(pr.r(t0+0.03),pr.r(t1-0.03),pr.r((t0+t1)/2))};
  }
  ctx.items.push({type:'parts',parts:FL.done(P),role:'border',variant:'bands'});
  // the figure zone
  if(fig&&d>0.8){ // a crowded pot: the figure zone gives up a band above and below
    const h0=fig.yb-fig.ya,bh=h0*0.16,xa=cx-fig.rm*1.25,xb=cx+fig.rm*1.25,X=[];
    for(const ya of [fig.ya,fig.yb-bh]){const key=pickB(/Zigzag|Circles|Meander/);for(const p of SG.borders[key].fn(xb-xa,bh-4))X.push(p.kind==='dot'?Object.assign({},p,{x:p.x+xa,y:p.y+ya+2}):Object.assign({},p,{pts:p.pts.map(([x,y])=>[x+xa,y+ya+2])}));
      X.push(heLn([[xa,ya===fig.ya?ya+bh:ya],[xb,ya===fig.ya?ya+bh:ya]],'outer'));}
    ctx.items.push({type:'parts',parts:FL.done(X),role:'border',variant:'bands2'});fig.ya+=bh;fig.yb-=bh;}
  if(fig){const h=fig.yb-fig.ya,hero=ctx.pick('hero'),M=SG.motifs[hero]||{},cy=(fig.ya+fig.yb)/2+h*0.02,s=Math.min(h*0.9,fig.rm*1.5),wide=fig.rm*2>s*2.1;
    const row=d>0.8&&M.mirrorOk&&!M.fine?Math.floor(fig.rm*1.9/(s*0.74)):0;
    if(row>=3){for(let i=0;i<row;i++)ctx.motif(hero,cx+(i-(row-1)/2)*s*0.74,cy,s,{role:'hero',variant:'hero'});}else
    if(wide&&M.mirrorOk&&!M.fine){ctx.motif(hero,cx-s*0.52,cy,s,{role:'hero',flip:false,variant:'hero'});ctx.motif(hero,cx+s*0.52,cy,s,{role:'hero',flip:true,variant:'hero'});}
    else{ctx.motif(hero,cx,cy,M.fine?Math.min(h*0.98,fig.rm*1.7):s,{role:'hero',variant:'hero'});
      if(fig.rm*2>s*1.75){const k=ctx.pick('ring');for(const sd of [-1,1])ctx.motif(k,cx+sd*(s*0.5+fig.rm*0.3),cy+h*0.08,Math.min(h*0.5,fig.rm*0.5),{role:'ring',flip:sd>0,variant:'flank'});}}
    if(d>0.55&&!M.fine){const fk=ctx.pick('filler');for(const [fx,fy] of [[-0.7,-0.36],[0.7,-0.36],[0,-0.42]])ctx.motif(fk,cx+fx*fig.rm,cy+fy*h,h*0.09,{role:'filler',variant:'fill',noOcc:true});}}
  // everything outside the pot is painted out in the ink colour; then the profile is picked out
  const C=[flP(G.chain([[-20,-20],[cx,-20],[cx,y0]],pr.left,[[cx,y0+Hh],[cx,H+20],[-20,H+20]]),0),flP(G.chain([[W+20,-20],[cx,-20],[cx,y0]],pr.right,[[cx,y0+Hh],[cx,H+20],[W+20,H+20]]),0)];
  C.push(heKn(pr.left,2.2),heKn(pr.right,2.2),heKn([[pr.left[0][0],y0],[pr.right[0][0],y0]],2.2),heKn([[pr.left[pr.left.length-1][0],y0+Hh],[pr.right[pr.right.length-1][0],y0+Hh]],2.2));
  // handles: loops of ground-coloured line outside the body
  const [ha,hb,hw]=pr.S.handles;
  for(const sd of (shape==='lekythos'?[1]:[-1,1])){const xa=cx+sd*pr.r(ha),xb=cx+sd*pr.r(hb),out=sd*hw*Hh;
    const path=shape==='krater'?G.bez([xa,pr.y(ha)],[xa+out*1.5,pr.y(ha)-Hh*0.07],[xb+out*1.5,pr.y(hb)-Hh*0.06],[xb,pr.y(hb)],24):G.bez([xa,pr.y(ha)],[xa+out*1.7,pr.y(ha)-Hh*0.01],[xb+out*1.5,pr.y(hb)-Hh*0.1],[xb,pr.y(hb)],24);
    C.push(heKn(path,2.2),heKn(G.offset(path,-sd*Hh*0.022,false),2.2));}
  ctx.items.push({type:'parts',parts:C,role:'frame',variant:'wall'});
}});
