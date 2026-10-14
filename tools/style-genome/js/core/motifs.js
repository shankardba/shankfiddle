'use strict';
/* Motif geometry. Every motif returns PARTS in a ~100×100 box centred on 0,0 (−y is up):
     {kind:'region', pts, role}  closed shape — gets a fill treatment + outline
     {kind:'line',   pts, closed, role}  stroke only
     {kind:'dot',    x, y, r, role}
   role: 'outer' (silhouette), 'inner' (secondary contour), 'detail' (fine marks).
   Geometry carries no style — line weight, fill, colour and ornament all come from the
   genes at render time, which is what lets one motif be drawn in any tradition's hand.
   All constructions are original and generic; none reproduce a reference image. */

const reg=(pts,role='outer',extra)=>Object.assign({kind:'region',pts,closed:true,role},extra);
const ln=(pts,role='detail',closed=false)=>({kind:'line',pts,closed,role});
const dt=(x,y,r,role='detail')=>({kind:'dot',x,y,r,role});
const mirParts=parts=>parts.map(p=>p.kind==='dot'?Object.assign({},p,{x:-p.x}):Object.assign({},p,{pts:p.pts.map(([x,y])=>[-x,y]).reverse()}));

// fit all parts into a size×size box centred on the origin
function fitParts(parts,size=100){
  const all=[];for(const p of parts){if(p.kind==='dot'){all.push([p.x-p.r,p.y-p.r],[p.x+p.r,p.y+p.r]);}else all.push(...p.pts);}
  const b=G.bbox(all);const k=size/Math.max(b.w,b.h);
  return parts.map(p=>p.kind==='dot'?Object.assign({},p,{x:(p.x-b.cx)*k,y:(p.y-b.cy)*k,r:p.r*k}):Object.assign({},p,{pts:p.pts.map(([x,y])=>[(x-b.cx)*k,(y-b.cy)*k])}));
}
// a petal whose base sits at radius rb on angle ang (deg, 0 = up)
function polarPetal(rb,len,w,ang,shape){return G.xform(G.petal(len,w,shape).map(([x,y])=>[x,y-rb]),{rot:ang});}
function floretParts(cx,cy,r,n,shape='round',role='detail'){
  const out=[];const core=r*0.34;
  for(let i=0;i<n;i++)out.push(reg(G.xform(polarPetal(core*0.7,r-core*0.7,Math.PI*r/n*0.62,i*360/n,shape),{x:cx,y:cy}),role));
  out.push(reg(G.circle(cx,cy,core,20),role));
  return out;
}

defMotif('lotusTop',{name:'Lotus rosette',term:'padma',meaning:'Purity rising from mud; seat of the divine; the unfolding of consciousness. The most pervasive single motif in Indian art.',
fn(rng,g){
  const shape=(g.motifs&&g.motifs.petal)||'pointed';const n=rng.pick([8,8,12,16]);const P=[];
  const layers=[{rb:15,rt:50,off:0.5},{rb:12,rt:37,off:0},{rb:9,rt:25,off:0.5}];
  for(const L of layers){
    const mid=(L.rb+L.rt)/2,w=Math.PI*mid/n*0.92;
    for(let i=0;i<n;i++){
      const a=(i+L.off)/n*360;
      P.push(reg(polarPetal(L.rb,L.rt-L.rb,w,a,shape),L===layers[0]?'outer':'inner'));
      if(L===layers[0])P.push(ln(G.xform([[0,-L.rb-4],[0,-L.rt+9]],{rot:a}),'detail'));
    }
  }
  P.push(reg(G.circle(0,0,10.5,28),'inner'));
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;P.push(dt(Math.cos(a)*6,Math.sin(a)*6,1.3));}
  P.push(dt(0,0,1.8));
  return P;
}});

defMotif('lotusSide',{name:'Lotus in profile',term:'padma',meaning:'The open flower seen from the side — pedestal (padmapīṭha) for figures and lamps, and a stand-alone emblem of auspiciousness.',
fn(rng,g){
  const shape=(g.motifs&&g.motifs.petal)||'pointed';const P=[];const bx=0,by=24;
  const petals=[{r:-70,l:38,w:12},{r:70,l:38,w:12},{r:-37,l:50,w:14},{r:37,l:50,w:14},{r:0,l:62,w:16}];
  for(const p of petals){
    P.push(reg(G.xform(G.petal(p.l,p.w,shape),{x:bx,y:by,rot:p.r})));
    P.push(ln(G.xform([[0,-5],[0,-p.l*0.64]],{x:bx,y:by,rot:p.r}),'detail'));
  }
  P.push(reg(G.chain(G.bez([-36,21],[-26,37],[26,37],[36,21]),G.bez([36,21],[18,27],[-18,27],[-36,21])).slice(0,-1),'outer'));
  P.push(ln(G.bez([0,32],[3,40],[-3,46],[0,54]),'inner'));
  return fitParts(P);
}});

defMotif('paisley',{name:'Paisley',term:'būṭā / kairī (mango)',meaning:'The mango or flame-bud: fertility and abundance. Travelled from Persia into Mughal shawls, then everywhere — mehndi, block print, Kalamkari.',
fn(rng,g){
  const bend=pts=>pts.map(([x,y])=>{if(y<18){const u=(18-y)/76;x+=36*Math.pow(u,2.1);y+=7*Math.pow(u,3);}return[x,y];});
  const outer=bend(G.xform(G.teardrop(27,76,22),{y:18}));
  const inner=bend(G.xform(G.teardrop(15,46,18),{y:20}));
  const P=[reg(outer,'outer'),reg(inner,'inner')];
  P.push(...floretParts(0,24,9,6,'round','detail'));
  // a vine of small leaves running up the inner contour into the curl
  const vine=bend(G.bez([-10,30],[-22,6],[-10,-22],[6,-40],20));P.push(ln(vine,'detail'));
  for(let k=4;k<vine.length-2;k+=4){const p=vine[k],q=vine[k+1],a=Math.atan2(q[1]-p[1],q[0]-p[0])/DEG;P.push(reg(G.xform(G.petal(8,3.2,'pointed'),{x:p[0],y:p[1],rot:a+(k%8?60:120)}),'detail'));}
  const rim=G.scaleAbout(outer,[0,18],0.86).filter((p,k)=>k%3===0);rim.forEach(([x,y])=>P.push(dt(x,y,1.1)));
  return fitParts(P);
}});

defMotif('fish',{name:'Fish',term:'matsya',meaning:'Fertility, plenty and good fortune; drawn in pairs in Mithila marriage paintings (kohbar). Also the first avatar of Viṣṇu.',
fn(rng,g){
  const P=[];
  P.push(reg(G.chain(G.quad([28,-3],[38,-14],[50,-23]),G.quad([50,-23],[42,-8],[44,0]),G.quad([44,0],[42,8],[50,23]),G.quad([50,23],[38,14],[28,3])).slice(0,-1),'outer'));
  P.push(reg(G.chain(G.quad([-12,-17],[-6,-34],[6,-31]),G.quad([6,-31],[12,-25],[16,-15])),'outer'));
  P.push(reg(G.chain(G.quad([-6,17],[0,29],[10,27]),G.quad([10,27],[12,22],[12,14])),'outer'));
  const body=G.chain(G.bez([-46,2],[-38,-23],[4,-27],[31,-4]),G.bez([31,4],[4,27],[-38,23],[-46,2])).slice(0,-1);
  P.push(reg(body,'outer'));
  P.push(ln(G.quad([-24,-17],[-15,0],[-24,17]),'inner'));
  P.push(reg(G.circle(-34,-4,5,18),'inner'));P.push(dt(-34,-4,2));
  for(let cx=-12;cx<=22;cx+=8){
    const hh=19*(1-Math.pow((cx+6)/40,2));
    for(let cy=-hh+6;cy<=hh-5;cy+=8){const oy=((cx+12)/8)%2?4:0;if(Math.abs(cy+oy)<hh-4)P.push(ln(G.arc(cx,cy+oy,4.6,-75,75,8),'detail'));}
  }
  for(let i=-1;i<=1;i++)P.push(ln([[34,i*2.5],[44,i*10]],'detail'));
  return fitParts(P);
}});

/* Peacock, second redraw 2026-10-13, by the method that worked for the snow lion: head, neck and
   body are ONE contour; plumage is texture laid on it (rows of scale arcs, shingled wing coverts);
   every train feather has its shaft, its barbs and its eye. Drawn on a 100-unit study grid against
   three reference paintings supplied by the user. Parts of one kind share a tone. */
const pkU=p=>p.map(([x,y])=>[x-50,y-50]),pkZ=(p,z)=>Object.assign(p,{z});
function pkScales(P,poly,pitch,z,skip){const b=G.bbox(poly);let row=0;for(let y=b.y0+pitch*0.4;y<b.y1;y+=pitch*0.78,row++)for(let x=b.x0+(row%2?pitch/2:0);x<b.x1;x+=pitch){
    if(!G.inside(x,y,poly)||!G.inside(x-pitch*0.45,y,poly)||!G.inside(x+pitch*0.45,y,poly)||!G.inside(x,y+pitch*0.5,poly)||(skip&&skip(x,y)))continue;P.push(pkZ(ln(G.arc(x,y,pitch*0.5,8,172,6),'detail'),z));}}
function pkFeather(P,bx,by,ang,len,z){const d=[Math.sin(ang*DEG),-Math.cos(ang*DEG)],n=[d[1],-d[0]],k=0.32,at=t=>[bx+d[0]*len*t,by+d[1]*len*t];
  P.push(reg(G.xform(G.teardrop(len*k,len*(1-k),12),{x:bx+d[0]*len*(1-k),y:by+d[1]*len*(1-k),rot:ang+180}),'inner',{tone:2,z}));
  // barbs raked off the shaft toward the tip, longer where the vane is broad
  for(let i=0;i<9;i++){const t=0.14+i*0.06,q=at(t),w=len*0.3*Math.pow(t/0.68,1.2);for(const s of [-1,1])P.push(pkZ(ln([q,[q[0]+s*n[0]*w+d[0]*w*0.7,q[1]+s*n[1]*w+d[1]*w*0.7]],'detail'),z+0.05));}
  P.push(pkZ(ln([[bx,by],at(0.6)],'detail'),z+0.05));
  const e=at(0.7);P.push(reg(G.ellipse(e[0],e[1],len*0.23,len*0.27,18,ang),'inner',{tone:3,z:z+0.1}),reg(G.ellipse(e[0]+d[0]*len*0.02,e[1]+d[1]*len*0.02,len*0.15,len*0.19,14,ang),'inner',{tone:0,z:z+0.2}));
  P.push(reg(G.xform(G.teardrop(len*0.07,len*0.13,8),{x:e[0]+d[0]*len*0.03,y:e[1]+d[1]*len*0.03,rot:ang+180}),'detail',{tone:2,z:z+0.3}));}
defMotif('bird',{name:'Peacock',term:'mayūra',mirrorOk:true,meaning:'Beauty, monsoon rains and courtship; vehicle of Kārttikeya. India\'s national bird and a constant in textiles, mehndi and folk painting.',
fn(rng,g){const P=[],R=[57,59.4];
  // the train: six ranks hanging down and back from the rump, farthest first
  [[62,7,112,184],[51,6,115,181],[40,5,119,177],[29,4,124,172],[17.6,3,132,164]].forEach(([dist,n,a0,a1],r)=>{for(let i=0;i<n;i++){const a=lerp(a0,a1,i/(n-1)),len=18-r*0.4,d=[Math.sin(a*DEG),-Math.cos(a*DEG)];
    pkFeather(P,R[0]-50+d[0]*(dist-len),R[1]-50+d[1]*(dist-len),a,len,r);}});
  // legs behind the body: a feathered thigh, the shank bent at the heel, three toes forward and one back
  for(const x of [39.6,46.4]){P.push(reg(pkU(G.chaikin([[x-2.6,62],[x+2.6,62],[x+1.2,71],[x-1,71]],true,2)),'outer',{tone:0,z:6}));
    P.push(reg(G.ribbon(G.resample(G.chaikin(pkU([[x,70],[x-0.8,75],[x+1.6,79],[x,84.6]]),false,2),false,1),()=>0.75),'outer',{tone:3,z:6}));
    for(const [dx,dy] of [[-6.4,2.2],[-3.6,3.6],[0.2,4],[3.4,1.2]])P.push(reg(G.ribbon([[x-50,84.4-50],[x-50+dx*0.55,84.4-50+dy*0.7],[x-50+dx,84.4-50+dy]],t=>0.62-0.4*t),'outer',{tone:3,z:6}));}
  // one contour: crown, nape, the S of the neck, back, rump, belly, breast, throat
  const B=G.chaikin(pkU([[22,16],[26,12],[31,14],[32.6,20],[30,28],[28.6,36],[32,43],[42,47],[52,52],[59.4,58.4],[55,63.6],[45,66],[34,63],[25.6,55.6],[21,46],[20,38],[21.4,30],[19.4,24],[18,21],[19.6,18.4]]),true,3);
  P.push(reg(B,'outer',{tone:0,z:7}));
  const W=G.chaikin(pkU([[30.6,45],[40,45.4],[52,51.4],[59.6,58.6],[49,60.8],[37,57.4]]),true,2);
  // plumage: small scales down the neck and breast, larger coverts on the wing, quills behind them
  pkScales(P,B,2.5,7.1,(x,y)=>y<-29||G.inside(x,y,W)||G.inside(x,y+1.4,W)||G.inside(x,y-1.4,W));
  P.push(reg(W,'inner',{tone:1,z:7.2}));pkScales(P,W,4.2,7.3,(x,y)=>x>1+y*0.2&&x>3);
  for(const k of [0,1,2,3])P.push(pkZ(ln(pkU([[45-k*0.6,50.4+k*2],[59-k*1.4,58.2+k*0.6]]),'detail'),7.3));
  // head: beak, eye in its pale patch, a fan of crest stalks tipped with spots
  P.push(reg(pkU([[20.8,15.4],[11.4,18.8],[20,19.8]]),'outer',{tone:3,z:7.4}),pkZ(ln(pkU([[12.6,18.6],[20,17.8]]),'detail'),7.5));
  P.push(reg(pkU(G.chaikin([[21.4,15.4],[24.6,13.6],[28.4,15],[28,18.4],[24,19.4],[21.4,18]],true,2)),'inner',{bg:true,z:7.4}),pkZ(ln(pkU(G.chaikin([[21.4,15.4],[24.6,13.6],[28.4,15],[28,18.4],[24,19.4],[21.4,18]],true,2)),'detail',true),7.5));
  P.push(reg(pkU(G.chain(G.quad([22.2,16.8],[25,14.4],[27.6,16.8],8),G.quad([27.6,16.8],[25,18.6],[22.2,16.8],8)).slice(0,-1)),'detail',{tone:3,z:7.6}),pkZ(dt(25-50,16.7-50,0.95),7.7));
  for(const a of [-36,-22,-8,6,20,34,48]){const e=[27-50+Math.sin(a*DEG)*10.5,12.6-50-Math.cos(a*DEG)*10.5];P.push(pkZ(ln([[27-50,12.6-50],e],'detail'),7.4),reg(G.xform(G.teardrop(1.25,3,8),{x:e[0],y:e[1],rot:a+180}),'inner',{tone:3,z:7.4}),pkZ(dt(e[0],e[1],0.45),7.5));}
  return fitParts(P.map((p,i)=>[p,i]).sort((a,b)=>(a[0].z||0)-(b[0].z||0)||a[1]-b[1]).map(a=>a[0]));
}});

defMotif('diya',{name:'Oil lamp',term:'dīpa / diyā',meaning:'Light over darkness, knowledge over ignorance — the central image of Dīpāvalī, lit at thresholds and shrines.',
fn(rng,g){
  const P=[];
  P.push(reg([[-14,19],[14,19],[18,30],[-18,30]],'outer'));
  const bowl=G.chain(G.quad([-46,-6],[-4,1],[37,-7]),G.bez([37,-7],[35,14],[10,22],[-6,22]),G.bez([-6,22],[-27,22],[-38,9],[-46,-6])).slice(0,-1);
  P.push(reg(bowl,'outer'));
  P.push(reg(G.ellipse(-3,-5,36,5.5,40),'inner'));
  P.push(ln(G.bez([30,4],[20,13],[-20,14],[-36,4]),'detail'));
  for(let i=0;i<5;i++)P.push(dt(-22+i*10,13.5-Math.abs(i-2)*0.6,1.4));
  P.push(reg(G.xform(G.teardrop(7,32),{x:-38,y:-14}),'outer'));
  P.push(reg(G.xform(G.teardrop(3.2,16),{x:-38,y:-13}),'inner'));
  return fitParts(P);
}});

defMotif('flame',{name:'Flame',term:'jyoti',meaning:'The lamp flame alone — used as a ray on halos (prabhāvalī) and as the tip of temple arches.',
fn(rng,g){return[reg(G.xform(G.teardrop(16,70),{y:25}),'outer'),reg(G.xform(G.teardrop(8,38),{y:27}),'inner'),dt(0,30,2.2)];}});

defMotif('leaf',{name:'Pipal leaf',term:'aśvattha',meaning:'The sacred fig, tree of enlightenment; its heart shape with a long drip-tip frames figures and fills borders.',
fn(rng,g){
  const L=G.path([0,-50],[[-5,-38],[-31,-34],[-32,-10]],[[-33,12],[-17,30],[0,23]]);
  const out=G.chain(L,L.slice(0,-1).reverse().map(([x,y])=>[-x,y]));
  const P=[reg(out.slice(0,-1),'outer'),ln([[0,-44],[0,40]],'inner')];
  for(const y of [-24,-10,4,16]){P.push(ln(G.quad([0,y],[-11,y-3],[-21,y-12]),'detail'));P.push(ln(G.quad([0,y],[11,y-3],[21,y-12]),'detail'));}
  return fitParts(P);
}});

defMotif('tree',{name:'Tree of life',term:'kalpavṛkṣa',meaning:'The wish-fulfilling tree joining earth and sky; a central panel subject in Kalamkari, Madhubani and Gond painting.',
fn(rng,g){
  const H=[];
  H.push(reg(G.arc(0,50,34,180,360,24),'outer'));
  const trunk=G.chain(G.bez([-8,48],[-4,24],[-6,2],[-2,-22]),[[2,-22]],G.bez([2,-22],[6,2],[4,24],[8,48])).slice(0,-1);
  const side=[];
  const br=[{y:20,ex:38,ey:-2},{y:2,ex:40,ey:-22},{y:-14,ex:28,ey:-40}];
  for(const b of br){
    const c=G.bez([3,b.y],[14,b.y+2],[b.ex*0.7,b.ey+10],[b.ex,b.ey],14);
    side.push(ln(c,'inner'));
    for(let k=3;k<c.length-2;k+=4){const p=c[k];const up=k%8===3;side.push(reg(G.xform(G.petal(11,4.5,'pointed'),{x:p[0],y:p[1],rot:up?-30:150}),'detail'));}
    side.push(...floretParts(b.ex,b.ey,7.5,6,'round','inner'));
  }
  const P=[...H,reg(trunk,'outer'),...side,...mirParts(side)];
  P.push(...floretParts(0,-32,11,8,'round','inner'));
  for(const a of [-60,-30,30,60])P.push(reg(G.xform(G.petal(13,5,'pointed'),{x:0,y:-32,rot:a}),'detail'));
  return fitParts(P);
}});

defMotif('floret',{name:'Floret',term:'puṣpa',meaning:'Small open flower — the universal filler that closes negative space in dense traditions.',
fn(rng,g){const n=rng.pick([5,6,8]);return floretParts(0,0,50,n,(g.motifs&&g.motifs.petal)==='pointed'&&rng.chance(.5)?'pointed':'round','outer').concat([dt(0,0,5)]);}});

defMotif('bud',{name:'Bud on stem',term:'kalikā',meaning:'Promise and growth; the bud-and-tendril is the basic unit of floral borders.',
fn(rng,g){
  const P=[ln(G.bez([0,6],[4,22],[-8,34],[-6,50]),'outer')];
  P.push(reg(G.xform(G.petal(16,6,'pointed'),{x:-1,y:30,rot:-60}),'outer'));
  P.push(reg(G.xform(G.petal(14,5.5,'pointed'),{x:-4,y:40,rot:70}),'outer'));
  P.push(reg(G.xform(G.teardrop(12,40),{y:0}),'outer'));
  P.push(ln(G.quad([-10,4],[0,-8],[10,4]),'inner'));
  P.push(ln([[0,-6],[0,-28]],'detail'));
  return fitParts(P);
}});

defMotif('sun',{name:'Sun',term:'sūrya',meaning:'Life-giver and witness; in Mithila marriage painting the sun and moon attend the couple. Rays read as petals at small scale.',
fn(rng,g){
  const n=rng.pick([12,16]);const wavy=rng.chance(.45);const P=[];
  for(let i=0;i<n;i++){
    const a=i/n*360,long=i%2===0;
    if(wavy)P.push(reg(G.xform(G.teardrop(5.5,long?24:16).map(([x,y])=>[x,y-(long?26:24)]),{rot:a}),'outer'));
    else{const r0=26,r1=long?50:39,hw=Math.PI*r0/n*0.9;P.push(reg(G.xform([[-hw,-r0],[0,-r1],[hw,-r0]],{rot:a}),'outer'));}
  }
  P.push(reg(G.circle(0,0,25,40),'outer'));P.push(ln(G.circle(0,0,17.5,36),'inner',true));
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2;P.push(dt(Math.cos(a)*21.3,Math.sin(a)*21.3,1.3));}
  P.push(...floretParts(0,0,11,8,'round','inner'));
  return P;
}});

defMotif('burst',{name:'Firework burst',term:'phuljhaṛī / anār',meaning:'Sparklers and flower-pots of the festival night: lines radiating from a point, tipped with dots.',
fn(rng,g){
  const n=rng.pick([12,16]);const P=[reg(G.circle(0,0,6,18),'outer')];
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2,c=Math.cos(a),s=Math.sin(a);P.push(ln([[c*12,s*12],[c*42,s*42]],'outer'));P.push(dt(c*48,s*48,2.6,'outer'));
    const b=a+Math.PI/n;P.push(ln([[Math.cos(b)*16,Math.sin(b)*16],[Math.cos(b)*28,Math.sin(b)*28]],'detail'));}
  return P;
}});

defMotif('warliFigure',{name:'Warli figure',term:'—',meaning:'Two triangles joined at the waist: the human body as earth below and sky above, balanced. Drawn in chains for the tārpā dance.',
fn(rng,g){
  const P=[];const pose=rng.pick(['linked','linked','up']);
  P.push(reg(G.circle(0,-34,6.5,18),'outer'));
  P.push(reg([[-12,-26],[12,-26],[0,-8]],'outer'));
  P.push(reg([[0,-8],[-11,10],[11,10]],'outer'));
  if(pose==='up'){P.push(ln([[-12,-26],[-20,-16],[-26,-28]],'outer'),ln([[12,-26],[20,-16],[26,-28]],'outer'));}
  else{P.push(ln([[-12,-26],[-24,-20],[-36,-24]],'outer'),ln([[12,-26],[24,-20],[36,-24]],'outer'));}
  P.push(ln([[-7,10],[-13,25],[-9,40],[-14,40]],'outer'),ln([[7,10],[13,25],[9,40],[14,40]],'outer'));
  return fitParts(P);
}});

defMotif('star8',{name:'Eight-point star',term:'—',meaning:'Two interlaced squares; the generator of Indo-Islamic lattice (jālī) and the medallion unit of Ajrakh block print.',
fn(rng,g){
  const R=48,ri=R*0.7654,P=[];const star=[];
  for(let i=0;i<16;i++){const a=(-90+i*22.5)*DEG,r=i%2?ri:R;star.push([Math.cos(a)*r,Math.sin(a)*r]);}
  P.push(reg(star,'outer'));
  const oct=[];for(let i=0;i<8;i++){const a=(-90+22.5+i*45)*DEG;oct.push([Math.cos(a)*ri*0.78,Math.sin(a)*ri*0.78]);}
  P.push(reg(oct,'inner'));
  P.push(...floretParts(0,0,19,8,'pointed','detail'));
  for(let i=0;i<8;i++){const a=(-90+i*45)*DEG;P.push(dt(Math.cos(a)*R*0.82,Math.sin(a)*R*0.82,1.8));}
  return P;
}});

defMotif('kalasha',{name:'Full pot',term:'pūrṇa-kalaśa',meaning:'Pot of plenty crowned with mango leaves and a coconut — set at doorways and in ritual; abundance and welcome.',
fn(rng,g){
  const P=[];
  for(const a of [-62,-31,0,31,62])P.push(reg(G.xform(G.petal(30,8,'pointed'),{x:0,y:-12,rot:a}),'outer'));
  P.push(reg(G.ellipse(0,-30,11,14,30),'outer'));
  P.push(ln([[-4,-43],[-7,-50]],'detail'),ln([[0,-44],[0,-51]],'detail'),ln([[4,-43],[7,-50]],'detail'));
  P.push(reg(G.ellipse(0,43,12,4,24),'outer'));
  P.push(reg(G.circle(0,16,27,48),'outer'));
  P.push(reg([[-9,-14],[9,-14],[10,-5],[-10,-5]],'outer'));
  P.push(reg(G.ellipse(0,-14,15,4,28),'outer'));
  P.push(ln(G.bez([-25,6],[-10,11],[10,11],[25,6]),'inner'));
  P.push(ln(G.bez([-25,24],[-10,29],[10,29],[25,24]),'inner'));
  for(let i=-2;i<=2;i++)P.push(dt(i*8,16+Math.abs(i)*-0.4,1.6));
  return fitParts(P);
}});

defMotif('spiral',{name:'Spiral',term:'—',meaning:'Growth and continuity; tendril ends, Gond filler marks, Warli dance chains seen from above.',
fn(rng,g){const p=[];for(let i=0;i<=90;i++){const th=i/90*Math.PI*5.2,r=2+th*2.6;p.push([Math.cos(th)*r,Math.sin(th)*r]);}return fitParts([ln(p,'outer'),dt(0,0,3)]);}});

defMotif('dot',{name:'Dot',term:'bindu',meaning:'The point of origin; dots are both filler and the grid of kolam.',
fn(){return[dt(0,0,9,'outer')];}});

/* ---------- border strips ----------
   Generated in strip coordinates: x runs 0..L along the strip, y=0 is the outer edge and
   y=t the inner edge. The structure maps each strip onto the four sides of a frame. */
defBorder('zigzag',{name:'Triangle row',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.9))),w=L/n,P=[];for(let i=0;i<n;i++)P.push(reg([[i*w,0],[(i+1)*w,0],[(i+.5)*w,t]],'outer'));return P;}});
defBorder('scallop',{name:'Scallops',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.95))),w=L/n,P=[];for(let i=0;i<n;i++){const cx=(i+.5)*w;P.push(reg(G.chain(G.arc(cx,0,w*0.48,0,180,14)),'outer'));P.push(dt(cx,w*0.18,t*0.06));}return P;}});
defBorder('leafVine',{name:'Leaf vine',fn(L,t){const lam=t*2.2,n=Math.max(1,Math.round(L/lam)),l=L/n,P=[];const s=[];for(let i=0;i<=n*20;i++){const x=i/(n*20)*L;s.push([x,t/2+t*0.18*Math.sin(x/l*Math.PI*2)]);}P.push(ln(s,'inner'));
  for(let i=0;i<n;i++){const x0=i*l;P.push(reg(G.xform(G.petal(t*0.4,t*0.13,'pointed'),{x:x0+l*0.25,y:t/2+t*0.18,rot:-35}),'outer'));P.push(reg(G.xform(G.petal(t*0.4,t*0.13,'pointed'),{x:x0+l*0.75,y:t/2-t*0.18,rot:145}),'outer'));P.push(dt(x0+l*0.5,t/2,t*0.07));}return P;}});
defBorder('petalRow',{name:'Petal row',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.6))),w=L/n,P=[];for(let i=0;i<n;i++)P.push(reg(G.xform(G.petal(t*0.82,w*0.42,'pointed'),{x:(i+.5)*w,y:t*0.08,rot:180}),'outer'));return P;}});
defBorder('dotRow',{name:'Bead row',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.55))),w=L/n,P=[ln([[0,t*0.2],[L,t*0.2]],'inner'),ln([[0,t*0.8],[L,t*0.8]],'inner')];for(let i=0;i<n;i++)P.push(dt((i+.5)*w,t/2,t*0.15,'outer'));return P;}});
defBorder('diamond',{name:'Lozenge chain',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.1))),w=L/n,P=[];for(let i=0;i<n;i++){const cx=(i+.5)*w;P.push(reg([[cx,t*0.1],[cx+w*0.48,t/2],[cx,t*0.9],[cx-w*0.48,t/2]],'outer'));P.push(dt(cx,t/2,t*0.08));}return P;}});
defBorder('chevron',{name:'Chevrons',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.5))),w=L/n,P=[];for(let i=0;i<n;i++){const x=i*w;P.push(ln([[x,t*0.2],[x+w*0.5,t*0.8],[x+w,t*0.2]],'outer'));}return P;}});
defBorder('wave',{name:'Wave',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.2))),l=L/n,s=[];for(let i=0;i<=n*24;i++){const x=i/(n*24)*L;s.push([x,t/2+t*0.25*Math.sin(x/l*Math.PI*2)]);}const P=[ln(s,'outer')];for(let i=0;i<n;i++){P.push(dt(i*l+l*0.25,t*0.78,t*0.07),dt(i*l+l*0.75,t*0.22,t*0.07));}return P;}});
defBorder('hatchBand',{name:'Hatched band',fn(L,t){return[reg([[0,t*0.12],[L,t*0.12],[L,t*0.88],[0,t*0.88]],'outer',{forceFill:'hatch'})];}});
defBorder('lines',{name:'Plain rules',fn(L,t){return[ln([[0,t/3],[L,t/3]],'outer'),ln([[0,2*t/3],[L,2*t/3]],'outer')];}});

/* ---------- Mongolian vocabulary ----------
   Script parts: brush 'line' parts carry `profile` (pressure curve: even | tail | wedge |
   rise | swell) and `wmul` (width multiplier) for the brush renderer. The words are
   ASEMIC — assembled from the script's stroke elements (crown, spine, teeth, loops,
   tail) — and spell nothing. */
const bl=(pts,profile,wmul=1,role='outer')=>({kind:'line',pts,closed:false,role,profile,wmul});
defMotif('scriptWord',{name:'Script stroke-word',term:'titem · nuruu · shüd · gedes · süül',script:true,
meaning:'A vertical word built the way Mongol bichig is: a crown (titem) at the top, the spine (nuruu) the letters hang from, teeth (shüd) to the left, loops or "bellies" (gedes) to the right, and a closing tail (süül). Generated words are asemic — they read as script but spell nothing.',
fn(rng,g){
  const P=[];let y=-46;const els=[];
  while(y<30){
    const e=rng.weighted({tooth:3,loop:2,zig:1.6,gap:0.9,dot:0.5});
    if(e==='tooth'){els.push(bl(G.bez([0,y],[-5,y+0.5],[-10,y+2],[-15,y+6],10),'tail',1.15));y+=8.5;}
    else if(e==='loop'){els.push(bl(G.bez([0,y-1],[15,y-3],[17,y+11],[1,y+12],16),'swell',1));y+=14;}
    else if(e==='zig'){els.push(bl(G.chain(G.quad([0,y],[14,y+1],[3,y+6]),G.quad([3,y+6],[-4,y+9],[12,y+11]),G.quad([12,y+11],[16,y+13],[1,y+15])),'swell',1.05));y+=16;}
    else if(e==='dot'){els.push(dt(-11,y+3,2.8,'outer'));y+=5;}
    else y+=6;
  }
  const yEnd=y;const bend=rng.range(-3,3);
  P.push(bl(G.bez([0,-52],[bend,-20],[-bend,10],[0,yEnd],24),'even',0.95));
  P.push(...els);
  const crown=rng.pick(['flag','flag','hook','fork']);
  if(crown==='flag')P.push(bl(G.bez([-13,-63],[-8,-60],[-3,-56],[1,-51],8),'wedge',1.75));
  else if(crown==='hook')P.push(bl(G.bez([10,-66],[6,-62],[1,-58],[0,-51],8),'wedge',1.6));
  else{P.push(bl(G.bez([-12,-66],[-7,-61],[-3,-56],[0,-52],8),'wedge',1.5));P.push(bl(G.bez([11,-66],[7,-61],[3,-56],[0,-52],8),'wedge',1.3));}
  const tail=rng.pick(['hookL','hookL','sweepR','drop']);
  if(tail==='hookL')P.push(bl(G.bez([0,yEnd],[0,yEnd+10],[-8,yEnd+16],[-21,yEnd+13],14),'tail',1.25));
  else if(tail==='sweepR')P.push(bl(G.bez([0,yEnd],[2,yEnd+13],[14,yEnd+16],[25,yEnd+5],14),'tail',1.2));
  else P.push(bl(G.bez([0,yEnd],[1,yEnd+5],[-1,yEnd+10],[2,yEnd+15],8),'tail',1.1));
  return fitParts(P);
}});
// seals: always stamped in the accent colour, with carved (knock-out) marks
const ac=(pts)=>({kind:'region',pts,closed:true,role:'outer',paint:'accent'});
const ko=(pts,closed=false,kw=3)=>({kind:'line',pts,closed,role:'detail',paint:'knock',kw});
defMotif('seal',{name:'Square seal',term:'tamga · yìnzhāng · hanko',meaning:'The artist\'s red seal, pressed in cinnabar paste: a signature and the one note of colour in an ink composition. Marks here are abstract, not a real name.',
fn(rng){
  const P=[ac([[-40,-40],[40,-40],[40,40],[-40,40]]),ko([[-33,-33],[33,-33],[33,33],[-33,33]],true,2.6)];
  for(const cx of [-15,15])for(const cy of [-15,15]){
    const k=rng.int(2,4);for(let i=0;i<k;i++){const v=rng.chance(.5);const o=rng.range(-9,9);P.push(ko(v?[[cx+o,cy-11],[cx+o,cy+rng.range(2,11)]]:[[cx-11,cy+o],[cx+rng.range(2,11),cy+o]],false,3.4));}
  }
  return P;
}});
defMotif('sealRound',{name:'Round seal',term:'tamga · yìnzhāng · hanko',meaning:'A small round seal, often set at the start of an inscription.',
fn(rng){const P=[ac(G.circle(0,0,40,40)),ko(G.circle(0,0,32,40),true,2.4)];const s=[];for(let i=0;i<=40;i++){const th=i/40*Math.PI*3.4,r=4+th*3;s.push([Math.cos(th)*r,Math.sin(th)*r]);}P.push(ko(s,false,3.4));return P;}});

defMotif('ugalz',{name:'Ram\'s-horn scroll',term:'ugalz',meaning:'The signature Mongolian ornament: a stem that splits into two horns curling outward and down — the ram\'s horn, a herder\'s sign of strength and plenty. Repeated, it fills felt, doors, saddles and silver.',
fn(rng,g){
  const P=[];const turns=rng.range(1.25,1.6);
  const horn=s=>{const c=[s*21,-6],st=[0,-21];const R0=Math.hypot(st[0]-c[0],st[1]-c[1]),a0=Math.atan2(st[1]-c[1],st[0]-c[0]);const pts=[];
    for(let i=0;i<=70;i++){const u=i/70,a=a0+s*u*turns*2*Math.PI,r=R0*(1-0.84*u);pts.push([c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r]);}return pts;};
  for(const s of [-1,1])P.push(reg(G.ribbon(horn(s),t=>5.6*(1-0.66*t)),'outer'));
  const stem=G.bez([0,46],[1.5,24],[-1.5,0],[0,-22],16);
  for(const s of [-1,1])P.push(reg(G.ribbon(G.bez([0,40],[s*8,30],[s*20,34],[s*24,44],12),t=>3.8*(1-0.7*t)),'outer'));
  P.push(reg(G.ribbon(stem,t=>4.6),'outer'));
  P.push(reg(G.xform(G.teardrop(6,26),{y:-28}),'inner'));
  return fitParts(P);
}});
let ULZII_LOOP=null;
defMotif('ulzii',{name:'Endless knot',term:'ölzii',meaning:'The knot without beginning or end — happiness and endless continuity. One of the eight auspicious signs of Buddhism, and in Mongolia an everyday ornament on gers, furniture and clothing.',
fn(rng,g){
  // one closed line on a 3×3 grid with 4-fold rotational symmetry and the most crossings
  if(!ULZII_LOOP){const r2=makeRng(23),n=3;let best=-1;
    for(let a=0;a<3000;a++){const orbit={};const st=(x,y)=>{const k=c4Orbit(x,y,2*n);if(!(k in orbit))orbit[k]=r2.weighted({cross:.65,join:.15,sep:.2});return orbit[k];};
      const L=kolamTrace(n,()=>true,st);if(L.length!==1)continue;
      const seen={};let cr=0;for(const [x,y] of L[0]){const k=x+','+y;seen[k]=(seen[k]||0)+1;if(seen[k]===2)cr++;}
      if(cr>best){best=cr;ULZII_LOOP=L[0];}}
  }
  const loop=G.chaikin(G.xform((ULZII_LOOP||[[0,0],[2,2],[4,0],[2,-2]]).map(([x,y])=>[x-3,y-3]),{rot:45,s:15}),true,3);
  return fitParts(weaveCurves([{pts:loop,closed:true}],8,SG.knock?2.4:0));
}});
defBorder('alkhan',{name:'Hammer fret (alkhan)',fn(L,t){
  // the meander as a solid band of one width between two rails: each unit turns in on itself and hands on to the next along the foot
  const k=t*0.7/5,n=Math.max(1,Math.round(L/(6*k))),kx=L/(6*n),y0=t*0.15,bw=Math.min(k,kx)*0.46,pts=[];
  for(let i=0;i<n;i++)for(const [x,y] of KEY_UNIT)pts.push([i*6*kx+x*kx+kx*0.5,y0+y*k]);pts.push([L,y0+5*k]);pts.unshift([0,y0+5*k]);
  return[pathBand(pts,bw),ln([[0,t*0.04],[L,t*0.04]],'outer'),ln([[0,t*0.96],[L,t*0.96]],'outer')].map(p=>Object.assign(p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));}});
defBorder('scrollBand',{name:'Running scroll',fn(L,t){
  // a wave that curls over: each unit rises from the foot line and winds in one and a quarter turns, tapering as it goes
  const n=Math.max(2,Math.round(L/(t*1.25))),w=L/n,P=[reg(G.band([[0,t*0.86],[L,t*0.86]],t*0.07),'outer')];
  for(let i=0;i<n;i++){const cx=(i+0.56)*w,cy=t*0.47,r0=t*0.31,sp=G.bez([i*w,t*0.86],[i*w+w*0.22,t*0.86],[cx-r0*1.25,cy+r0*0.9],[cx-r0,cy],8);
    for(let k=1;k<=34;k++){const u=k/34,a=(180+u*450)*DEG,r=r0*(1-0.74*u);sp.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}
    P.push(reg(G.ribbon(G.resample(sp,false,Math.max(1,t*0.03)),u=>Math.max(0.4,t*0.06*(1-0.72*u))),'outer'));P.push(dt(cx,cy,Math.max(0.8,t*0.03)));}
  return P.map(p=>p.kind==='dot'?p:Object.assign(p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));}});

/* ---------- Mesoamerican vocabulary ----------
   Rectilinear and banded: the step-fret is built as a mitred band around an orthogonal
   centreline. The mask is a generic geometric face (frame, brow studs, eyes, nose bar,
   toothed mouth, ear spools) — deliberately not any named deity's iconography. */
const pathBand=(pts,w,role='outer')=>reg(G.band(pts,w),role);
function polarCell(cx,cy,r0,r1,a0,a1,n=8){const o=G.arc(cx,cy,r1,a0,a1,n),i=G.arc(cx,cy,r0,a1,a0,n);return o.concat(i);}
function steppedDiamond(cx,cy,a,b,n){const q=[];for(let i=0;i<n;i++){q.push([i*a/n,-b+i*b/n],[(i+1)*a/n,-b+i*b/n]);}
  const Q1=q,Q2=q.slice().reverse().map(([x,y])=>[x,-y]),Q3=q.map(([x,y])=>[-x,-y]),Q4=q.slice().reverse().map(([x,y])=>[-x,y]);
  return Q1.concat(Q2,Q3,Q4).map(([x,y])=>[cx+x,cy+y]);}
const FRET=[[-45,40],[-45,25],[-25,25],[-25,5],[-5,5],[-5,-40],[40,-40],[40,10],[15,10],[15,-18],[26,-18]];

defMotif('stepFret',{name:'Step-fret',term:'xicalcoliuhqui',meaning:'"Twisted gourd" in Nahuatl: stairs that turn into a square spiral, cousin of the Greek key. Found on jewellery, masks, pottery, featherwork, codices and buildings, and still in use. No single meaning is agreed — readings include water, clouds, lightning, wind, the serpent\'s body and the cycle between sun and earth. The single most repeated unit of Mesoamerican ornament (greca in Spanish).',
fn(rng,g){const P=[pathBand(FRET,10,'outer')];if(rng.chance(.5))P.push(dt(29,-8,3,'detail'));return fitParts(P);}});

/* Aztec day signs, redrawn 2026-10-13 against four reference sheets supplied by the user (two
   modern charts of the twenty signs, a set of black silhouettes, and a redrawn codex page).
   A day sign is a compact emblem: heads in profile with a ringed eye, bodies as bands of one
   width, everything outlined, colour flat. Parts of one kind share a tone. */
const azTube=(cp,w,step=1.4)=>G.ribbon(G.resample(G.chaikin(cp,false,3),false,step),w);
const azEye=(P,x,y,r)=>{P.push(reg(G.circle(x,y,r,18),'inner',{bg:true}),dt(x,y,r*0.42));};
defMotif('ollin',{name:'Movement sign',term:'ollin',meaning:'The day sign of motion and earthquake: two bands crossed about a central eye, a dart above. The present world, the Fifth Sun, is named 4 Ollin and was expected to end in earthquakes.',
fn(rng,g){const P=[],arm=[[-6,-10],[6,-10],[15,-32],[15,-44],[10,-49],[-10,-49],[-15,-44],[-15,-32]];
  P.push(reg([[-5,-12],[0,-50],[5,-12]],'outer',{tone:2}));P.push(reg(G.circle(0,47,3,12),'inner',{tone:2}));
  for(let i=0;i<4;i++){const r=45+i*90;P.push(reg(G.xform(arm,{rot:r}),'outer',{tone:i%2}));P.push(ln(G.xform([[-3.4,-15],[3.4,-15],[10.6,-33],[10.6,-42.4],[8,-45],[-8,-45],[-10.6,-42.4],[-10.6,-33]],{rot:r}),'detail',true));
    P.push(reg(G.xform(G.circle(0,-37,3.6,14),{rot:r}),'inner',{bg:true}),ln(G.xform(G.circle(0,-37,3.6,14),{rot:r}),'detail',true));}
  P.push(reg(G.circle(0,0,15,36),'outer',{tone:2}),reg(G.circle(0,0,11.4,30),'inner',{bg:true}));
  P.push(reg(G.chain(G.quad([-9,0],[0,-8],[9,0],8),G.quad([9,0],[0,6],[-9,0],8)).slice(0,-1),'inner',{tone:0}),dt(0,-0.6,2.6),ln(G.quad([-9,0],[0,-8],[9,0],8),'outer'));
  return fitParts(P);}});
defMotif('sunStone',{name:'Calendar disc',term:'—',meaning:'After the Piedra del Sol: concentric rings — eight great rays, a band of twenty day-sign cells, and the movement sign at the centre — time drawn as a target.',
fn(rng,g){const P=[reg(G.circle(0,0,50,72),'outer')];
  for(let i=0;i<8;i++){const a=i*45;P.push(reg(G.xform([[-8,-29],[0,-49],[8,-29]],{rot:a}),'outer'));P.push(reg(G.xform([[-4.5,-29],[0,-40],[4.5,-29]],{rot:a+22.5}),'inner'));}
  P.push(ln(G.circle(0,0,29,64),'inner',true));P.push(ln(G.circle(0,0,21,56),'inner',true));
  for(let i=0;i<20;i++){const a=i*18*DEG;P.push(ln([[Math.cos(a)*21,Math.sin(a)*21],[Math.cos(a)*29,Math.sin(a)*29]],'detail'));const b=a+9*DEG;P.push(dt(Math.cos(b)*25,Math.sin(b)*25,1.3));}
  for(const a of [-40,40])P.push(reg(G.xform(G.roundRect(-17,-4,17,4,3),{rot:a}),'inner'));
  P.push(reg(G.circle(0,0,6,20),'inner'));P.push(dt(0,0,2));
  return P;}});

defMotif('glyphMask',{name:'Geometric mask',term:'—',meaning:'A frontal face built from rectangles and circles: brow band with studs, round or square eyes, nose bar, a mouth of teeth, ear spools. A generic mask — specific gods\' features (Tlaloc\'s goggles and fangs, the Sun Stone\'s face) are documented, not generated.',
fn(rng,g){const P=[];const roundEyes=rng.chance(.6),tongue=rng.chance(.45);
  for(const s of [-1,1]){P.push(reg(G.circle(s*41,4,9,24),'outer'));P.push(reg(G.circle(s*41,4,4,16),'inner'));P.push(reg(G.roundRect(s*41-3,13,s*41+3,26,2),'outer'));}
  P.push(reg(G.roundRect(-34,-36,34,42,10),'outer'));
  P.push(reg(G.roundRect(-34,-36,34,-22,4),'inner'));for(let i=-2;i<=2;i++)P.push(reg(G.roundRect(i*12-3.5,-33,i*12+3.5,-25,1.5),'detail'));
  for(const s of [-1,1]){if(roundEyes){P.push(reg(G.circle(s*15,-8,8.5,24),'inner'));P.push(dt(s*15,-8,3.2));}else{P.push(reg(G.roundRect(s*15-10,-14,s*15+10,-3,3),'inner'));P.push(dt(s*15,-8.5,3));}}
  P.push(reg([[-4,-12],[4,-12],[7,10],[-7,10]],'inner'));
  P.push(reg(G.roundRect(-19,15,19,33,5),'inner'));for(let i=-3;i<=3;i++)P.push(ln([[i*5,16],[i*5,24]],'detail'));
  if(tongue)P.push(reg(G.roundRect(-6,26,6,46,5),'inner'));
  for(const s of [-1,1])P.push(ln([[s*30,-14],[s*24,-18],[s*30,-22]],'detail'));
  return fitParts(P);}});

defMotif('eagle',{name:'Eagle',term:'cuauhtli',mirrorOk:true,meaning:'Day sign of the eagle, drawn as a head in profile: a heavy hooked beak, a fierce eye under a jutting brow, and feathers lying over one another down the neck, each tipped dark. Emblem of the sun and of the eagle warriors; the eagle on a cactus marks where the Mexica founded Tenochtitlan.',
fn(rng,g){const P=[],Z=(p,z)=>Object.assign(p,{z});
  /* Second redraw: the plumage is shingled, not a sunburst. Feathers lie in rows that sweep back
     and down from the face; each row is drawn over the roots of the row behind it. */
  const fe=(x,y,len,w,rot,z)=>{const T=q=>G.xform(q,{x,y,rot});P.push(reg(T(G.chain(G.bez([0,0],[-w*1.5,-len*0.3],[-w*0.9,-len*0.78],[0,-len],10),G.bez([0,-len],[w*0.9,-len*0.78],[w*1.5,-len*0.3],[0,0],10)).slice(0,-1)),'outer',{tone:0,z}));
    P.push(reg(T([[0,-len],[-w*0.56,-len*0.74],[0,-len*0.62],[w*0.56,-len*0.74]]),'inner',{tone:1,z:z+0.01}),Z(ln(T([[0,-len*0.08],[0,-len*0.6]]),'detail'),z+0.02));};
  // rows from the back of the neck forward: [distance from the eye, feathers, first and last direction]
  [[44,9,188,304],[34,8,192,306],[24,7,198,308],[14,5,208,300]].forEach(([dist,n,a0,a1],r)=>{for(let i=0;i<n;i++){const a=lerp(a0,a1,i/(n-1)),d=[Math.sin(a*DEG),-Math.cos(a*DEG)],len=22-r*1.6;fe(4+d[0]*(dist-len),-6+d[1]*(dist-len),len,4.4-r*0.3,a,r);}});
  // crown feathers lying back over the skull
  for(const [x,y,a] of [[3,-20,284],[9,-23,290],[-4,-15,278]])fe(x,y,17,3.6,a,3.5);
  // skull and face: one contour from the crown round the cheek to the throat
  P.push(reg(G.chaikin([[3,-21],[11,-24],[18,-21],[21,-13],[19,-3],[14,4],[6,7],[-2,4],[-5,-4],[-4,-14]],true,3),'outer',{tone:0,z:4}));
  for(const [x,y,a] of [[0,0,238],[-2,-9,250],[4,6,222],[9,0,230]])P.push(Z(ln(G.xform(G.quad([-2.6,0],[0,-4.4],[2.6,0],6),{x,y,rot:a}),'detail'),4.1));
  // beak: the upper mandible hooks over the lower; cere, nostril, gape, tongue
  P.push(reg(G.chaikin([[13,-1],[24,-1],[32,2.4],[31,5.6],[22,6.4],[13,4.4]],true,2),'outer',{tone:2,z:4.5}),reg(G.chaikin([[17,-2.6],[27,-2],[33,1.4],[24,0.6]],true,2),'inner',{tone:3,z:4.6}));
  P.push(reg(G.chaikin([[15,-18],[26,-19],[36,-14.6],[41.6,-7],[42,1],[39.6,7.6],[37.6,2],[34,-2.6],[27,-4.6],[15,-4.6]],true,2),'outer',{tone:2,z:5}));
  P.push(Z(ln(G.bez([21,-18.4],[19.4,-14],[19.4,-9],[21,-4.8],8),'inner'),5.1),Z(dt(26.6,-13,1.1),5.2));
  // the eye under its brow
  P.push(reg(G.chaikin([[2,-16],[10,-19.6],[19,-16],[20,-12.6],[11,-14],[3,-12.6]],true,2),'inner',{tone:1,z:5.5}));
  P.push(reg(G.ellipse(11.4,-10,4.6,3.4,18,8),'inner',{tone:2,z:5.4}),reg(G.ellipse(11.8,-10,3,2.5,14,8),'inner',{bg:true,z:5.5}),Z(dt(12.2,-10.2,1.25),5.6));
  return fitParts(P.map((p,i)=>[p,i]).sort((a,b)=>(a[0].z||0)-(b[0].z||0)||a[1]-b[1]).map(a=>a[0]));}});
defMotif('serpent',{name:'Serpent',term:'coatl',mirrorOk:true,meaning:'The serpent, day sign coatl: coiled, covered in scales, the mouth open on its fangs and forked tongue, rattles at the tail. Plumed, it is Quetzalcoatl, lord of wind, learning and the morning star; its banded body becomes step-frets and its coils frame temples.',
fn(rng,g){const P=[],cp=[[20,-21],[2,-31],[-22,-30],[-40,-14],[-41,9],[-26,25],[-2,28],[18,20],[30,24]],sp=G.resample(G.chaikin(cp,false,3),false,1.2),n=sp.length,W=t=>t>0.84?Math.max(2,11.6*(1-(t-0.84)/0.16*0.72)):t<0.1?8+t/0.1*3.6:11.6;
  const fr=k=>{const a=sp[Math.max(0,k-1)],b=sp[Math.min(n-1,k+1)],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return{q:sp[k],t:[(b[0]-a[0])/l,(b[1]-a[1])/l],n:[-(b[1]-a[1])/l,(b[0]-a[0])/l],w:W(k/(n-1))};};
  // rattles: tapering segments, each lapped by the one before
  for(let i=4;i>=0;i--)P.push(reg(G.ellipse(33+i*4.4,25+i*1.5,4.2-i*0.55,5.2-i*0.7,14,16),'outer',{tone:2}));
  P.push(reg(G.ribbon(sp,W),'outer',{tone:0}));
  // belly: a band down the inside of the coil, cut into plates
  const side=1,bel=[];for(let k=3;k<n-4;k++){const f=fr(k);bel.push([f.q[0]+f.n[0]*f.w*0.5*side,f.q[1]+f.n[1]*f.w*0.5*side]);}
  P.push(reg(G.ribbon(sp.slice(3,n-4),t=>W(0.05+0.9*t)).filter((q,i,A)=>true).slice(0,0).concat(bel,sp.slice(3,n-4).map((q,i)=>{const f=fr(i+3);return[f.q[0]+f.n[0]*f.w*side,f.q[1]+f.n[1]*f.w*side];}).reverse()),'inner',{tone:2}));
  for(let k=5;k<n-5;k+=3){const f=fr(k);P.push(ln([[f.q[0]+f.n[0]*f.w*0.5,f.q[1]+f.n[1]*f.w*0.5],[f.q[0]+f.n[0]*f.w,f.q[1]+f.n[1]*f.w]],'detail'));}
  // scales: three lapped rows of crescents along the back and flank
  for(let k=5;k<n-6;k+=3){const f=fr(k);[-0.8,-0.36,0.08].forEach((o,j)=>{const c=[f.q[0]+f.n[0]*f.w*(o+ (k%2?0.11:0))+f.t[0]*(j%2?1.4:0),f.q[1]+f.n[1]*f.w*(o+(k%2?0.11:0))+f.t[1]*(j%2?1.4:0)],h=f.w*0.21;
      P.push(ln(G.quad([c[0]-f.n[0]*h,c[1]-f.n[1]*h],[c[0]+f.t[0]*h*1.9,c[1]+f.t[1]*h*1.9],[c[0]+f.n[0]*h,c[1]+f.n[1]*h],6),'detail'));});}
  // head: one contour for skull and both jaws, the mouth a notch in it; drawn, then enlarged about the neck
  const H0=P.length;
  P.push(reg(G.chaikin([[36,-20],[46,-21],[52,-17.6],[51,-12.6],[37,-12]],true,2),'inner',{tone:3}));
  P.push(reg(G.chaikin([[13,-27],[20,-35],[32,-39],[44,-37],[52,-31],[55,-24.6],[51,-22],[42,-21.6],[31,-19],[42,-14.6],[49,-13],[50,-9],[40,-7],[27,-8.6],[17,-14],[12,-20]],true,2),'outer',{tone:0}));
  for(const x of [41,46.4])P.push(reg([[x-1.2,-21.4],[x+1.2,-21.4],[x+0.4,-16.6]],'inner',{bg:true}),ln([[x-1.2,-21.4],[x+0.4,-16.6],[x+1.2,-21.4]],'detail'));
  P.push(reg(azTube([[39,-16.6],[50,-17.6],[58,-15],[63,-9]],t=>1.5-0.8*t),'inner',{tone:3}),reg(azTube([[55,-16.6],[61,-18.6],[65,-23]],t=>1-0.6*t),'inner',{tone:3}));
  P.push(reg(G.chaikin([[24,-33.6],[32,-36.6],[40,-33],[39,-30],[31,-31.6],[25,-30]],true,2),'inner',{tone:2}),reg(G.circle(32.4,-28,3.6,16),'inner',{bg:true}),dt(32.8,-28,1.5),dt(50.6,-29.6,0.9));
  P.push(ln(G.bez([16,-17],[22,-13],[30,-11.6],[38,-11],8),'detail'));
  for(let i=H0;i<P.length;i++){if(P[i].kind==='dot'){P[i]=Object.assign({},P[i],{x:20+(P[i].x-20)*1.3,y:-22+(P[i].y+22)*1.3,r:P[i].r*1.3});}else P[i]=Object.assign({},P[i],{pts:P[i].pts.map(([x,y])=>[20+(x-20)*1.3,-22+(y+22)*1.3])});}
  return fitParts(P);}});
defMotif('lizard',{name:'Lizard',term:'cuetzpalin',mirrorOk:true,meaning:'Day sign of the lizard: seen from above and a little to the side, four legs splayed with long toes, a crest down the back, the tail sweeping round. It stands for abundance and quick life; spotted lizards are common on clay stamps.',
fn(rng,g){const P=[],leg=(cp,ws)=>{const sp=G.resample(G.chaikin(cp,false,2),false,1.2);P.push(reg(G.ribbon(sp,t=>{const k=t*(ws.length-1),i=Math.min(ws.length-2,Math.floor(k));return lerp(ws[i],ws[i+1],k-i);}),'outer',{tone:0}));
    const e=cp[cp.length-1],q=cp[cp.length-2],a=Math.atan2(e[1]-q[1],e[0]-q[0]);for(const d of [-0.9,-0.45,0,0.45,0.9])P.push(reg(G.ribbon([e,[e[0]+Math.cos(a+d)*4.6,e[1]+Math.sin(a+d)*4.6],[e[0]+Math.cos(a+d*1.25)*9,e[1]+Math.sin(a+d*1.25)*9]],t=>0.8-0.6*t),'outer',{tone:0}));};
  // limbs first, so the body covers their roots: thigh, a bend, a thin shank, five long toes
  leg([[-13,-8],[-20,-17],[-19,-27],[-27,-32]],[5,4.2,2.6,2]);leg([[-11,-3],[-20,4],[-19,12],[-28,16]],[5,4.2,2.6,2]);
  leg([[13,-6],[21,-14],[20,-24],[28,-29]],[5.4,4.6,2.8,2.1]);leg([[15,2],[23,8],[21,17],[29,23]],[5.4,4.6,2.8,2.1]);
  const sp=G.resample(G.chaikin([[-47,-10],[-38,-11.4],[-24,-9],[-6,-7.6],[12,-4],[27,6],[39,20],[43,33],[36,43],[25,41],[22,34]],false,3),false,1.2),n=sp.length,W=t=>t<0.07?2.4+t/0.07*4.6:t<0.19?7-(t-0.07)/0.12*1.8:t<0.5?5.2+5*Math.sin(Math.PI*(t-0.19)/0.31):Math.max(0.6,5.2*(1-(t-0.5)/0.5*0.92));
  const fr=k=>{const a=sp[Math.max(0,k-1)],b=sp[Math.min(n-1,k+1)],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return{q:sp[k],t:[(b[0]-a[0])/l,(b[1]-a[1])/l],n:[-(b[1]-a[1])/l,(b[0]-a[0])/l],w:W(k/(n-1))};};
  // crest: a row of small teeth along the spine side, under the body's edge
  for(let k=Math.round(n*0.2);k<n*0.74;k+=3){const f=fr(k),o=-1;P.push(reg([[f.q[0]+f.n[0]*f.w*o-f.t[0]*1.5,f.q[1]+f.n[1]*f.w*o-f.t[1]*1.5],[f.q[0]+f.n[0]*(f.w+2.6)*o,f.q[1]+f.n[1]*(f.w+2.6)*o],[f.q[0]+f.n[0]*f.w*o+f.t[0]*1.5,f.q[1]+f.n[1]*f.w*o+f.t[1]*1.5]],'outer',{tone:2}));}
  P.push(reg(G.ribbon(sp,W),'outer',{tone:0}));
  // scales: lapped crescents over the back, bands across the tail, a line for the belly
  for(let k=Math.round(n*0.17);k<n*0.52;k+=3){const f=fr(k);[-0.56,-0.12,0.32].forEach((o,j)=>{const c=[f.q[0]+f.n[0]*f.w*o+f.t[0]*(j%2?1.4:0),f.q[1]+f.n[1]*f.w*o+f.t[1]*(j%2?1.4:0)],h=f.w*0.2;P.push(ln(G.quad([c[0]-f.n[0]*h,c[1]-f.n[1]*h],[c[0]+f.t[0]*h*2,c[1]+f.t[1]*h*2],[c[0]+f.n[0]*h,c[1]+f.n[1]*h],6),'detail'));});}
  for(let k=Math.round(n*0.55);k<n-6;k+=4){const f=fr(k);P.push(ln([[f.q[0]-f.n[0]*f.w*0.9,f.q[1]-f.n[1]*f.w*0.9],[f.q[0]+f.n[0]*f.w*0.9,f.q[1]+f.n[1]*f.w*0.9]],'detail'));}
  // head: eye, the line of the jaw, nostril, forked tongue
  P.push(reg(G.circle(-37.4,-12.6,2.5,14),'inner',{tone:2}),reg(G.circle(-37.4,-12.6,1.6,10),'inner',{bg:true}),dt(-37.4,-12.6,0.75),ln(G.bez([-47,-9],[-42,-7.6],[-37,-7.6],[-32,-9],8),'detail'),dt(-44.6,-11.6,0.5));
  P.push(reg(azTube([[-47,-9.6],[-53,-8.6],[-57,-11.6]],t=>0.9-0.5*t),'inner',{tone:3}),reg(azTube([[-52,-8.8],[-56,-6.6],[-59,-6.4]],t=>0.7-0.4*t),'inner',{tone:3}));
  return fitParts(P);}});
defMotif('turtle',{name:'Turtle',term:'ayotl',meaning:'The turtle carries the earth on its back in Mesoamerican cosmology; its plated shell is a ready-made pattern field.',
fn(rng,g){const P=[];
  for(const [x,y,r] of [[-27,-24,-48],[27,-24,48],[-25,24,-132],[25,24,132]])P.push(reg(G.xform(G.chaikin([[-5,2],[-8,-13],[-2,-24],[5,-22],[7,-10],[5,2]],true,2),{x,y,rot:r}),'outer',{tone:1}));
  P.push(reg([[-4,34],[4,34],[0,47]],'outer',{tone:1}),reg(G.chaikin([[-7,-33],[-6,-44],[0,-49],[6,-44],[7,-33]],true,2),'outer',{tone:1}));azEye(P,-3.2,-42,1.5);azEye(P,3.2,-42,1.5);
  P.push(reg(G.ellipse(0,0,29,36,48),'outer',{tone:0}),ln(G.ellipse(0,0,24.6,31.4,44),'inner',true));
  const hex=(cx,cy,w,h)=>[[cx-w,cy],[cx-w/2,cy-h],[cx+w/2,cy-h],[cx+w,cy],[cx+w/2,cy+h],[cx-w/2,cy+h]];
  for(const cy of [-19,0,19])P.push(reg(hex(0,cy,10,9),'inner',{tone:2}));
  for(const s of [-1,1])for(const cy of [-9.5,9.5]){P.push(ln([[s*10,cy-9.5],[s*17,cy],[s*10,cy+9.5]],'detail'),ln([[s*17,cy],[s*23.6,cy]],'detail'));}
  for(const s of [-1,1]){P.push(ln([[s*5,-28],[s*9,-30.6]],'detail'),ln([[s*5,28],[s*9,30.6]],'detail'));}
  return fitParts(P);}});
defMotif('calli',{name:'House',term:'calli',upright:true,meaning:'Day sign of the house: a wall with a T-shaped doorway on a platform, under a roof with stepped battlements. It is the temple as much as the dwelling, and stands for rest, the west and the enclosed dark.',
fn(){const R=(a,b,c,d)=>[[a,b],[c,b],[c,d],[a,d]],P=[reg(R(-38,30,38,42),'outer',{tone:2}),reg(R(-28,-14,28,30),'outer',{bg:true}),reg(R(-16,-6,16,3),'inner',{tone:1}),reg(R(-6,3,6,30),'inner',{tone:1}),reg(R(-34,-23,34,-14),'outer',{tone:0})];
  for(const x of [-22,0,22])P.push(reg([[x-9,-23],[x-9,-31],[x-4.6,-31],[x-4.6,-38],[x+4.6,-38],[x+4.6,-31],[x+9,-31],[x+9,-23]],'outer',{tone:0}));
  P.push(ln(R(-28,-14,28,30),'outer',true),ln([[-38,36],[38,36]],'detail'),ln([[-34,-18.5],[34,-18.5]],'detail'));return fitParts(P);}});
defMotif('xochitl',{name:'Flower',term:'xochitl',upright:true,meaning:'Day sign of the flower, the twentieth and last: a blossom in section, petals curling out either side of a tall centre, stamens above. Flowers are beauty, pleasure and song; “flower and song” is the Nahuatl phrase for poetry.',
fn(){const P=[];for(const s of [-1,1]){P.push(reg(azTube([[s*7,30],[s*34,27],[s*45,6],[s*38,-12],[s*27,-9],[s*30,2]],t=>6.4-3.4*t),'outer',{tone:0}));P.push(reg(azTube([[s*5,22],[s*21,13],[s*24,-10],[s*15,-25],[s*8,-21],[s*10,-13]],t=>5.6-3*t),'outer',{tone:1}));}
  P.push(reg(G.chaikin([[-5.6,24],[-6.6,-24],[-4,-33],[4,-33],[6.6,-24],[5.6,24]],true,2),'outer',{tone:0}),ln([[0,18],[0,-27]],'detail'));
  for(const [x,y] of [[-10,-42],[0,-46],[10,-42]]){P.push(ln([[x*0.3,-33],[x,y+3]],'detail'),reg(G.circle(x,y,3.2,12),'inner',{tone:2}));}
  P.push(reg(G.circle(0,27,8.6,22),'outer',{tone:2}),reg(G.circle(0,27,4,14),'inner',{bg:true}),reg([[-20,36],[20,36],[16,44],[-16,44]],'outer',{tone:1}),ln([[-18,40],[18,40]],'detail'));return fitParts(P);}});
defMotif('tecpatl',{name:'Flint knife',term:'tecpatl',upright:true,meaning:'Day sign of the flint: a leaf-shaped blade, half red and half white, with an eye and a row of teeth where the two colours meet, because the knife is alive and hungry. It is the sacrificial knife and the north.',
fn(){const L=G.bez([0,-48],[-26,-22],[-26,22],[0,48],22),Rr=G.bez([0,48],[26,22],[26,-22],[0,-48],22),P=[reg(L.concat([[0,-48]]),'outer',{bg:true}),reg(Rr.concat([[0,48]]),'outer',{tone:1}),ln(L.concat(Rr.slice(1,-1)),'outer',true),ln([[0,-48],[0,48]],'inner')];
  P.push(reg(G.circle(-8,-12,6,18),'inner',{tone:2}));azEye(P,-8,-12,3.8);P.push(reg([[-17,6],[17,6],[15,15],[-15,15]],'inner',{bg:true}));for(let i=-2;i<=2;i++)P.push(ln([[i*6,6],[i*5.6,15]],'detail'));P.push(ln([[-16,10.5],[16,10.5]],'detail'));return fitParts(P);}});
defMotif('pyramid',{name:'Stepped pyramid',term:'teocalli',meaning:'The temple platform: stacked tiers, one great stair, a shrine on top. A mountain made by people, and a common shorthand for all of Mesoamerica.',
fn(rng,g){const P=[];const n=5;
  for(let i=0;i<n;i++){const y1=44-i*12,y0=y1-12,w1=48-i*7.5,w0=w1-3.5;P.push(reg([[-w1,y1],[w1,y1],[w0,y0],[-w0,y0]],'outer'));}
  P.push(reg([[-7,44],[7,44],[5,-16],[-5,-16]],'inner'));for(let y=38;y>-14;y-=6)P.push(ln([[-6+(44-y)*0.03,y],[6-(44-y)*0.03,y]],'detail'));
  P.push(reg(G.roundRect(-14,-38,14,-16,2),'outer'));P.push(reg([[-5,-16],[5,-16],[5,-28],[-5,-28]],'inner'));
  P.push(reg([[-17,-38],[17,-38],[17,-44],[-17,-44]],'outer'));for(let i=-2;i<=2;i++)P.push(reg([[i*7-2,-44],[i*7+2,-44],[i*7+2,-49],[i*7-2,-49]],'detail'));
  return fitParts(P);}});

defMotif('featherFan',{name:'Feather crown',term:'quetzalli',meaning:'A fan of long plumes — quetzal feathers were the most precious material in the Mexica world, worth more than gold.',
fn(rng,g){const n=rng.pick([9,11,13]);const P=[];
  for(let i=0;i<n;i++){const a=-78+i*156/(n-1);P.push(reg(G.xform(G.petal(48,6,'round'),{x:0,y:30,rot:a}),'outer'));const tip=G.xform([[0,-40]],{x:0,y:30,rot:a})[0];P.push(dt(tip[0],tip[1],2.2));P.push(ln(G.xform([[0,-6],[0,-34]],{x:0,y:30,rot:a}),'detail'));}
  P.push(reg(G.roundRect(-30,24,30,38,5),'outer'));for(let i=-2;i<=2;i++)P.push(dt(i*11,31,2));
  return fitParts(P);}});

defMotif('cartouche',{name:'Glyph block',term:'—',meaning:'A rounded-square block holding marks — the unit of Maya hieroglyphic writing, here filled with abstract elements and bar-and-dot numerals (a bar is five, a dot is one). Not readable text.',
fn(rng,g){const P=[reg(G.roundRect(-42,-34,42,34,12),'outer')];
  const half=(y0,y1)=>{const k=rng.pick(['eyes','bars','dots','scroll','step','u']);const cy=(y0+y1)/2;
    if(k==='eyes')for(const x of [-14,14]){P.push(reg(G.circle(x,cy,7,20),'inner'));P.push(dt(x,cy,2.4));}
    else if(k==='bars'){const m=rng.int(1,2);for(let i=0;i<m;i++){const y=cy+(i-(m-1)/2)*8;P.push(reg(G.roundRect(-26,y-2.8,26,y+2.8,2.8),'inner'));}}
    else if(k==='dots'){const m=rng.int(1,4);for(let i=0;i<m;i++)P.push(dt((i-(m-1)/2)*12,cy,3.4));}
    else if(k==='scroll'){const s=[];for(let i=0;i<=30;i++){const th=i/30*Math.PI*3,r=2+th*2.2;s.push([Math.cos(th)*r,cy+Math.sin(th)*r*0.8]);}P.push(ln(s,'detail'));}
    else if(k==='step')P.push(ln([[-24,cy+6],[-12,cy+6],[-12,cy-4],[0,cy-4],[0,cy+6],[12,cy+6],[12,cy-4],[24,cy-4]],'detail'));
    else P.push(ln([[-14,cy-7],[-14,cy+5],[14,cy+5],[14,cy-7]],'detail'));};
  half(-28,-2);half(2,28);P.push(ln([[-36,0],[36,0]],'detail'));
  return fitParts(P);}});

defBorder('greca',{name:'Running step-fret',fn(L,t){
  // xicalcoliuhqui: a solid stepped triangle climbing to a squared hook that turns back on itself
  const n=Math.max(1,Math.round(L/(t*1.5))),w=L/n,bw=Math.max(2,t*0.1),P=[pathBand([[0,t*0.9],[L,t*0.9]],bw)];
  for(let i=0;i<n;i++){const X=a=>i*w+a*w,Y=b=>b*t;
    P.push(reg([[0.04,0.9],[0.04,0.72],[0.14,0.72],[0.14,0.56],[0.24,0.56],[0.24,0.4],[0.34,0.4],[0.34,0.9]].map(([a,b])=>[X(a),Y(b)]),'outer'));
    P.push(pathBand([[0.34,0.45],[0.34,0.12],[0.92,0.12],[0.92,0.66],[0.58,0.66],[0.58,0.38],[0.76,0.38]].map(([a,b])=>[X(a),Y(b)]),bw));}
  return P;}});
defBorder('stepDiamond',{name:'Stepped lozenges',fn(L,t){const n=Math.max(1,Math.round(L/(t*1.2))),w=L/n,P=[ln([[0,t*0.08],[L,t*0.08]],'inner'),ln([[0,t*0.92],[L,t*0.92]],'inner')];
  for(let i=0;i<n;i++){const cx=(i+.5)*w;P.push(reg(steppedDiamond(cx,t/2,w*0.44,t*0.38,3),'outer'));P.push(reg(steppedDiamond(cx,t/2,w*0.18,t*0.16,2),'inner'));}return P;}});

/* ---------- Devotional attribute emblems ----------
   The objects that identify a deity — Kṛṣṇa's flute and peacock feather, Hanumān's mace,
   Gaṇeśa's modaka and mouse — drawn on their own, the way devotional design uses them as
   stand-alone emblems. The deities themselves are documented, not generated. */
defMotif('peacockFeather',{name:'Peacock feather',term:'mor paṅkh',meaning:'Kṛṣṇa wears it in his crown; on its own the feather stands for him — beauty, playfulness, the monsoon.',
fn(rng,g){const P=[];
  P.push(ln(G.bez([0,-30],[0.5,0],[-0.5,36],[2,62],18),'outer'));
  // barbs: a feathery fringe, widest around the eye, thinning toward the quill's base
  for(let y=-56;y<=46;y+=3.6){const u=(y+56)/102;const w=y<-14?22*Math.sqrt(Math.max(0,1-Math.pow((y+30)/27,2)))+4:Math.max(3,24*(1-u)*1.15);
    for(const s of [-1,1])P.push(ln(G.quad([0,Math.max(y,-30)],[s*w*0.55,y-2],[s*w,y-7-u*4]),'inner'));}
  P.push(reg(G.ellipse(0,-30,15,18,36),'outer'));P.push(reg(G.ellipse(0,-29,10,12.5,32),'inner'));
  P.push(reg(G.xform(G.teardrop(5.5,15),{y:-23}),'detail'));
  return fitParts(P);}});
defMotif('bansuri',{name:'Bamboo flute',term:'bāṁsurī / muralī',meaning:'Kṛṣṇa\'s flute, whose music draws the cowherds and the whole of Vṛndāvana; the most direct emblem of him.',
fn(rng,g){const P=[];
  P.push(ln(G.bez([-42,3],[-46,14],[-38,18],[-41,28],12),'detail'),ln(G.bez([-40,3],[-37,12],[-44,20],[-36,27],12),'detail'));P.push(dt(-41,29,2.2,'outer'),dt(-36,28,2,'outer'));
  P.push(reg(G.roundRect(-50,-3.8,50,3.8,3.6),'outer'));
  for(const x of [-44,-38,40,45])P.push(reg(G.roundRect(x-1.5,-4.6,x+1.5,4.6,1),'inner'));
  P.push(dt(-27,0,1.7));for(let i=0;i<6;i++)P.push(dt(-6+i*6,0,1.5));
  return fitParts(P);}});
defMotif('gada',{name:'Mace',term:'gadā',meaning:'Hanumān\'s mace — strength placed in the service of devotion. Also carried by Viṣṇu and Bhīma.',
fn(rng,g){const P=[];
  P.push(reg(G.roundRect(-3,-4,3,52,2.5),'outer'));for(const y of [38,43,48])P.push(reg(G.roundRect(-4,y-1.3,4,y+1.3,1),'inner'));
  P.push(reg(G.roundRect(-7,-6,7,1,2),'outer'));
  P.push(reg(G.circle(0,-24,20,48),'outer'));
  for(const rx of [7,14])P.push(ln(G.ellipse(0,-24,rx,20,36),'detail',true));P.push(ln(G.ellipse(0,-24,20,4.5,36),'detail',true));
  P.push(reg(G.xform(G.teardrop(4,13),{y:-44}),'outer'));P.push(dt(0,-58,2.2,'outer'));
  return fitParts(P);}});
defMotif('modak',{name:'Sweet dumpling',term:'modaka',meaning:'Gaṇeśa\'s favourite sweet, held in his hand or bowl; read as the sweetness of realisation.',
fn(rng,g){const P=[reg(G.xform(G.teardrop(22,56),{y:12}),'outer')];
  for(const k of [-2,-1,0,1,2])P.push(ln(G.bez([k*1.2,-40],[k*6,-20],[k*11,0],[k*9.5,24],14),'detail'));
  P.push(reg(G.ellipse(0,36,25,5,30),'outer'));
  return fitParts(P);}});
defMotif('mushika',{name:'Mouse',term:'mūṣaka',meaning:'Gaṇeśa\'s vehicle: the smallest creature carrying the largest god — desire mastered, or obstacles gnawed through.',
fn(rng,g){const P=[];
  P.push(ln(G.bez([-24,12],[-44,18],[-52,-6],[-38,-16],16),'outer'));
  for(const x of [-14,14])P.push(reg(G.xform(G.petal(9,3.5,'round'),{x,y:20,rot:180}),'outer'));
  P.push(reg(G.ellipse(-2,6,26,15,40),'outer'));
  P.push(reg(G.xform(G.teardrop(11,24),{x:21,y:2,rot:90}),'outer'));
  P.push(reg(G.circle(19,-9,7,20),'outer'));P.push(reg(G.circle(19,-9,3.6,16),'inner'));
  P.push(dt(30,-1,1.6),dt(45,3,1.8,'outer'));
  for(const dy of [-2,2])P.push(ln([[42,3+dy*0.5],[52,1+dy*2]],'detail'));
  return fitParts(P);}});
defMotif('dhol',{name:'Barrel drum',term:'ḍhol',meaning:'The festival drum of processions — Gaṇeśa Caturthī, weddings, Holī — laced with a zigzag of cord.',
fn(rng,g){const P=[];
  P.push(ln([[2,-30],[34,-50]],'outer'),ln([[-4,-30],[-36,-48]],'outer'));P.push(dt(35,-51,2.4,'outer'),dt(-37,-49,2.4,'outer'));
  P.push(reg(G.chain(G.bez([-34,-22],[-10,-28],[10,-28],[34,-22],14),G.bez([34,22],[10,28],[-10,28],[-34,22],14)),'outer'));
  P.push(reg(G.ellipse(-34,0,8,22,32),'inner'));P.push(reg(G.ellipse(34,0,8,22,32),'inner'));
  const z=[];for(let i=0;i<=8;i++){const x=-27+i*6.75;z.push([x,i%2?20:-21]);}P.push(ln(z,'detail'));
  return fitParts(P);}});
defMotif('trishul',{name:'Trident',term:'triśūla',meaning:'Śiva\'s trident — the three guṇas, or past, present and future — often with a small drum tied below the blades.',
fn(rng,g){const P=[];
  P.push(reg(G.roundRect(-2.4,-18,2.4,54,2),'outer'));
  P.push(reg(G.xform(G.teardrop(5,34),{y:-16}),'outer'));
  const blade=G.chain(G.bez([-3,-16],[-16,-14],[-24,-24],[-20,-46],14),G.bez([-20,-46],[-15,-34],[-9,-26],[-3,-24],12));
  P.push(reg(blade,'outer'),reg(mirParts([reg(blade)])[0].pts,'outer'));
  P.push(reg(G.roundRect(-14,-17,14,-12,2),'inner'));
  P.push(ln(G.bez([2,-10],[14,-6],[8,6],[18,10],12),'detail'),ln(G.bez([2,-8],[10,2],[16,0],[14,16],12),'detail'));
  return fitParts(P);}});

/* ---------- Deity figures (Indian devotional registers only) ----------
   Original, simplified constructions in the minimal devotional idiom — not traced.
   figure:true keeps them upright and out of rotating rings; sacred:true strips them from
   any blend between different culture families. Regions carry the silhouette (so knockout
   and fills work); lines carry the gestures (so brush and taper registers work). */
defMotif('ganesha',{name:'Gaṇeśa',term:'Gaṇapati / Vināyaka',figure:true,sacred:true,
meaning:'Remover of obstacles, invoked first. Drawn here in the minimal devotional idiom: tall crown, fan ears, eyes, forehead tilak, the single tusk, and the trunk curling to his left.',
fn(rng,g){const P=[];const curl=rng.chance(.75)?1:-1;
  // ears: broad fans with a wavy outer edge
  const ear=G.chain(G.bez([-15,-22],[-30,-36],[-48,-30],[-49,-12],16),G.bez([-49,-12],[-50,4],[-40,14],[-30,12],14),G.bez([-30,12],[-24,11],[-19,6],[-16,-2],10));
  P.push(Object.assign(reg(ear,'outer'),{mat:'skin'}),Object.assign(reg(ear.slice().reverse().map(([x,y])=>[-x,y]),'outer'),{mat:'skin'}));
  for(const s of [-1,1])P.push(ln(G.bez([s*20,-17],[s*34,-24],[s*41,-10],[s*31,2],14),'inner'));
  // crown (mukuṭa)
  const cr=G.chain(G.bez([-15,-23],[-17,-36],[-7,-44],[0,-56],16),G.bez([0,-56],[7,-44],[17,-36],[15,-23],16));
  P.push(Object.assign(reg(cr,'outer'),{mat:'metal'}));P.push(ln(G.quad([-15,-27],[0,-31],[15,-27]),'detail'));P.push(ln(G.quad([-11,-36],[0,-39],[11,-36]),'detail'));P.push(dt(0,-59,2.2,'outer'));
  // face, eyes, tilak
  P.push(Object.assign(reg(G.chain(G.bez([-15,-23],[-17,-12],[-15,-4],[-9,0],10),[[9,0]],G.bez([9,0],[15,-4],[17,-12],[15,-23],10)),'outer'),{mat:'skin'}));
  for(const s of [-1,1])P.push(ln(G.quad([s*11,-12],[s*7,-15],[s*4,-12]),'inner'),dt(s*7.5,-11,1.3));
  P.push(ln([[-3,-24],[-3,-19],[0,-17],[3,-19],[3,-24]],'detail'));
  // single tusk and the trunk
  P.push(reg(G.ribbon(G.bez([-6*curl,-2],[-9*curl,2],[-12*curl,6],[-15*curl,12],10),t=>3.2*(1-t)+0.3),'outer'));
  let tr=G.chain(G.bez([0,-10],[2,2],[-5,12],[0,24],16),G.bez([0,24],[4,34],[17,35],[18,26],14),G.bez([18,26],[18,19],[10,18],[10,24],10));
  if(curl<0)tr=tr.map(([x,y])=>[-x,y]);
  P.push(Object.assign(reg(G.ribbon(tr,t=>Math.max(0.8,7.2*(1-t*0.82))),'outer'),{mat:'skin'}));
  P.push(ln(G.quad([5*curl,3],[10*curl,5],[9*curl,9]),'detail'));
  return fitParts(P);}});

/* ---------- Celtic vocabulary ----------
   Interlace is woven (weave.js): each cord is cut where it passes under, so it reads as
   over-under in any hand. Spirals follow La Tène and Insular practice — compass-built,
   several arms sharing one centre, swelling like trumpets. */
const gcd=(a,b)=>b?gcd(b,a%b):a;
defMotif('knot',{name:'Knot panel',term:'interlace',
meaning:'Cords that braid over and under in strict alternation with no loose ends. Built the way Insular artists did: lay out a plait on a grid of dots, then add breaks that turn the strands back on themselves.',
fn(rng,g){const n=rng.pick([2,3,3,4]);return fitParts(knotField(-50,-50,50,50,rng,{cell:100/n,breaks:rng.range(0.12,0.32),sym:'c4',tries:120}));}});
/* Weave curved bands of one width. Each strand is cut at its under-crossings; each end is
   trimmed back to the edge of the band that passes over it there (or `gap` short of it), so
   pieces meet edge to edge with no overlap, and corners in a strand stay mitred. */
function weaveCurves(strands,w,gap=0){
  GH.weave(strands);const h=w/2,hc=h+gap,out=[],byX={};
  strands.forEach((S,si)=>S.cross.forEach(c=>(byX[c.x]=byX[c.x]||[]).push([si,c])));
  // the stretch of a strand between two arc lengths, found by bisection on its cumulative lengths
  strands.forEach(S=>{const p=S.pts,n=p.length,c=[0];for(let i=1;i<=(S.closed?n:n-1);i++){const a=p[i-1],b=p[i%n];c.push(c[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1]));}S.cum=c;S.len=c[c.length-1];});
  const sub=(S,a,b)=>{const p=S.pts,n=p.length,c=S.cum,L=S.len,m=c.length-1;if(S.closed){while(a<0){a+=L;b+=L;}while(a>=L){a-=L;b-=L;}}else{a=Math.max(0,a);b=Math.min(L,b);}
    const at=d=>{let lo=0,hi=m;while(hi-lo>1){const md=(lo+hi)>>1;if(c[md]<=d)lo=md;else hi=md;}const t=(d-c[lo])/((c[hi]-c[lo])||1),q=p[lo%n],r=p[hi%n];return{i:lo,pt:[q[0]+(r[0]-q[0])*t,q[1]+(r[1]-q[1])*t]};};
    const A=at(a),o=[A.pt];let i=A.i+1,base=0;for(;;){if(i>m-(S.closed?0:0)){if(!S.closed)break;i=1;base+=L;}const d=base+c[i];if(d>=b-1e-9)break;if(d>a+1e-9)o.push(p[i%n]);i++;if(o.length>4*n)break;}
    o.push(at(b>L&&S.closed?b-L:b).pt);return o;};
  const dist=(q,W)=>{let m=1e18;for(let i=0;i<W.length-1;i++){const a=W[i],b=W[i+1],dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy||1e-9;let t=((q[0]-a[0])*dx+(q[1]-a[1])*dy)/l;t=t<0?0:t>1?1:t;const x=a[0]+dx*t-q[0],y=a[1]+dy*t-q[1],d=x*x+y*y;if(d<m)m=d;}return Math.sqrt(m);};
  const over=c=>{const o=byX[c.x].find(e=>e[1]!==c);return sub(strands[o[0]],o[1].s-1.7*w-gap,o[1].s+1.7*w+gap);};
  // drop the run of points at the start of an edge that lies under the band W, and put a point exactly on its edge
  const trim=(E,W)=>{let i=0;while(i<E.length&&dist(E[i],W)<hc)i++;if(i===0||i>=E.length)return E;let a=E[i-1],b=E[i];for(let k=0;k<11;k++){const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];if(dist(m,W)<hc)a=m;else b=m;}return[b].concat(E.slice(i));};
  strands.forEach((S,si)=>{const U=S.cross.filter(c=>c.under);
    if(!U.length){out.push({kind:'line',closed:!!S.closed,role:'outer',plain:true,pts:G.offset(S.pts,h,!!S.closed)},{kind:'line',closed:!!S.closed,role:'outer',plain:true,pts:G.offset(S.pts,-h,!!S.closed)});return;}
    for(let k=0;k<U.length;k++){const c0=U[k],c1=U[(k+1)%U.length];let s0=c0.s,s1=c1.s;if(s1<=s0+1e-9)s1+=S.len;
      const C=sub(S,s0,s1);if(C.length<2)continue;const W0=over(c0),W1=over(c1);
      const L=trim(trim(G.offset(C,h,false),W0).reverse(),W1).reverse(),R=trim(trim(G.offset(C,-h,false),W0).reverse(),W1).reverse();
      if(L.length<2||R.length<2)continue;out.push({kind:'region',closed:true,role:'outer',tone:si,plain:true,pts:L.concat(R.reverse())});}});
  return out;
}
defMotif('triquetra',{name:'Triquetra',term:'triquetra',
meaning:'Three pointed lobes drawn as one unbroken line that weaves through itself, often with a ring woven through it. Read as the Trinity in Christian Insular art, though the form is older than that reading.',
fn(rng,g){
  /* Three semicircles. Their centres stand on an equilateral triangle whose side is the radius, so
     each pair of circles makes a vesica; each arc runs from one tip to the next, round the side
     that faces the middle. The band keeps one width, comes to a mitred point at every tip, and
     where it passes under it is cut to the edge of the band above. */
  const r=40,d=r/Math.sqrt(3),c=a=>[d*Math.cos(a*DEG),d*Math.sin(a*DEG)],A=c(-30),B=c(90),Cc=c(210),n=61; // an odd count keeps the crossings off the vertices
  const loop=G.arc(A[0],A[1],r,240,60,n).slice(0,-1).concat(G.arc(B[0],B[1],r,0,-180,n).slice(0,-1),G.arc(Cc[0],Cc[1],r,120,-60,n).slice(0,-1));
  const ring=rng.chance(.55),w=ring?5.4:7.4,S=[{pts:GH.tidy(loop,true),closed:true}];if(ring)S.push({pts:G.circle(0,0,r*0.8,120),closed:true});
  // where the bands are solid with no outline, a clear gap is what shows which one passes under
  return fitParts(weaveCurves(S,w,SG.knock?w*0.3:0));}});
defMotif('triskele',{name:'Triple spiral',term:'triskele',
meaning:'Three spirals turning the same way from one centre, their arms swelling like trumpets. A La Tène form that carried on into Insular metalwork and gospel books.',
fn(rng,g){const P=[];const turns=rng.range(1.15,1.45);
  for(let k=0;k<3;k++){const th=(-90+k*120)*DEG,S=[Math.cos(th)*24,Math.sin(th)*24],phi0=Math.atan2(-S[1],-S[0]);const pts=[];
    for(let i=0;i<=90;i++){const u=i/90,a=phi0+u*turns*2*Math.PI,r=24*(1-0.84*u);pts.push([S[0]+Math.cos(a)*r,S[1]+Math.sin(a)*r]);}
    P.push(reg(G.ribbon(pts,t=>t<0.22?1.6+t*20:6*(1-(t-0.22)/0.78)+0.8),'outer'));
    P.push(dt(S[0]+Math.cos(phi0+turns*2*Math.PI)*24*0.16*0.4,S[1]+Math.sin(phi0+turns*2*Math.PI)*24*0.16*0.4,1.8));}
  P.push(reg(G.circle(0,0,5,20),'inner'));
  if(rng.chance(.6))P.push(ln(G.circle(0,0,52,110),'outer',true));
  return fitParts(P);}});
defMotif('sScroll',{name:'Trumpet scroll',term:'La Tène S-scroll',
meaning:'Two spirals joined by a swelling curve, one winding in each direction — the restless, asymmetric line of Iron Age Celtic bronzes, laid out with compasses.',
fn(rng,g){const R=20,ri=4,turns=rng.range(1,1.35);const s1=[],s2=[];
  for(let i=0;i<=40;i++){const u=i/40;const a=(90+(1-u)*turns*360)*DEG,r=ri+(R-ri)*u;s1.push([-24+Math.cos(a)*r,Math.sin(a)*r]);}
  for(let i=0;i<=40;i++){const u=i/40;const a=(-90+u*turns*360)*DEG,r=R-(R-ri)*u;s2.push([24+Math.cos(a)*r,Math.sin(a)*r]);}
  const path=G.chain(s1,G.bez([-24,R],[0,R],[0,-R],[24,-R],16),s2);
  const P=[reg(G.ribbon(path,t=>0.9+5.4*Math.pow(Math.sin(Math.PI*t),1.6)),'outer')];
  P.push(dt(-24,0,2.6),dt(24,0,2.6));
  if(rng.chance(.5))for(const s of [-1,1])P.push(reg(G.xform(G.petal(10,4,'drop'),{x:s*6,y:s*-12,rot:s>0?200:20}),'inner'));
  return fitParts(P);}});
// Pictish symbols: incised on undressed stone; their meaning is unknown, so none is given
const floriate=(x,y,ang,s=1)=>[-34,0,34].map(d=>reg(G.xform(G.petal(10*s,3.3*s,'drop'),{x,y,rot:ang+d}),'outer'));
const arrowHead=(x,y,ang,s=1)=>reg(G.xform([[0,-12*s],[-6*s,1],[6*s,1]],{x,y,rot:ang}),'outer');
defMotif('crescentVrod',{name:'Crescent and V-rod',term:'Pictish symbol',upright:true,
meaning:'A lune crossed by a broken rod with an arrowhead and a flowered end — the most common Pictish symbol. What it stood for (a name, a rank, a lineage) is not known.',
fn(rng,g){const P=[];
  P.push(reg(G.chain(G.arc(0,10,44,195,345,48),G.arc(0,64,78,-57,-123,30)).slice(0,-1),'outer'));
  P.push(ln(G.arc(0,10,35,203,337,36),'inner'));
  for(const s of [-1,1]){const sp=[];for(let i=0;i<=26;i++){const u=i/26,a=(s>0?-90:270)*DEG-s*u*Math.PI*2.4,r=7*(1-0.8*u);sp.push([s*30+Math.cos(a)*r,-6+Math.sin(a)*r]);}P.push(ln(sp,'detail'));}
  P.push(reg(G.circle(0,-21,4.5,16),'inner'));
  P.push(pathBand([[-34,-46],[0,30],[34,-46]],4.6,'outer'));
  const ang=Math.atan2(-76,-34)/DEG+90;P.push(arrowHead(-34,-46,ang));P.push(...floriate(34,-46,-ang));
  return fitParts(P);}});
defMotif('doubleDisc',{name:'Double disc and Z-rod',term:'Pictish symbol',upright:true,
meaning:'Two discs joined by a waisted bar, crossed by a Z-shaped rod with flowered ends. Found on stones across eastern and northern Scotland; its meaning is unknown.',
fn(rng,g){const P=[];
  P.push(reg(G.chain(G.bez([-14,-8],[-5,-3],[5,-3],[14,-8],12),[[14,8]],G.bez([14,8],[5,3],[-5,3],[-14,8],12)).slice(0,-1),'outer'));
  for(const s of [-1,1]){P.push(reg(G.circle(s*28,0,17,44),'outer'));P.push(ln(G.circle(s*28,0,10,36),'inner',true));P.push(dt(s*28,0,2.6));}
  P.push(pathBand([[-48,-30],[-15,-30],[15,30],[48,30]],4.4,'outer'));
  P.push(...floriate(-50,-30,-90),...floriate(50,30,90));
  return fitParts(P);}});
defMotif('mirrorComb',{name:'Mirror and comb',term:'Pictish symbol',upright:true,
meaning:'A hand mirror and a double-sided comb, often added beneath another pair of symbols. Sometimes read as marking a woman, though that is a guess.',
fn(rng,g){const P=[];
  P.push(reg(G.roundRect(-22,14,-16,40,2),'outer'),reg(G.circle(-19,44,4,14),'outer'));
  P.push(reg(G.circle(-19,-4,19,44),'outer'));P.push(ln(G.circle(-19,-4,13,36),'inner',true));
  P.push(reg(G.roundRect(10,-14,46,-4,2),'outer'));for(let i=0;i<=8;i++){const x=12+i*4;P.push(ln([[x,-14],[x,-24]],'detail'),ln([[x,-4],[x,6]],'detail'));}
  P.push(ln([[10,-24],[46,-24]],'inner'),ln([[10,6],[46,6]],'inner'));
  return fitParts(P);}});

/* ---------- Japanese vocabulary ---------- */
// ribbon with a round cap at its start — the heads of tomoe commas
function capRibbon(pts,hw){const rib=G.ribbon(pts,hw);const p0=pts[0],p1=pts[1];const ang=Math.atan2(p1[1]-p0[1],p1[0]-p0[0])/DEG;return rib.concat(G.arc(p0[0],p0[1],hw(0),ang-90,ang-270,14).slice(1,-1));}
defMotif('sakura',{name:'Cherry blossom',term:'sakura 桜',
meaning:'Five petals, each with a notch at its tip. Blossom that falls at its peak — beauty and the shortness of life; a spring motif on kimono, crests and lacquer.',
fn(rng,g){const P=[];const L=G.chain(G.bez([0,-7],[-12,-14],[-19,-34],[-10,-46],14),G.quad([-10,-46],[-5,-50],[0,-41],8));
  const petal=L.concat(L.slice(0,-1).reverse().map(([x,y])=>[-x,y])).slice(0,-1);
  const rot=rng.range(0,72);for(let i=0;i<5;i++)P.push(reg(G.xform(petal,{rot:rot+i*72}),'outer',{tone:0}));
  for(let i=0;i<5;i++){const a=(rot+i*72+36)*DEG;P.push(ln([[Math.cos(a-Math.PI/2)*6,Math.sin(a-Math.PI/2)*6],[Math.cos(a-Math.PI/2)*16,Math.sin(a-Math.PI/2)*16]],'detail'));P.push(dt(Math.cos(a-Math.PI/2)*17.5,Math.sin(a-Math.PI/2)*17.5,1.8));}
  P.push(reg(G.circle(0,0,6.5,20),'inner'));
  return P;}});
defMotif('kikuMon',{name:'Chrysanthemum crest',term:'kiku-mon 菊紋',
meaning:'Round-tipped petals radiating from a disc. The chrysanthemum stands for long life; a sixteen-petal, double-rowed form is the imperial seal, so the crests generated here use other petal counts.',
fn(rng,g){const n=rng.pick([12,12,14]);const P=[];const w=Math.PI*34/n*0.9;
  if(rng.chance(.45))for(let i=0;i<n;i++)P.push(reg(polarPetal(9,39,w*0.95,(i+0.5)/n*360,'round'),'inner',{tone:1}));
  for(let i=0;i<n;i++)P.push(reg(polarPetal(9,41,w,i/n*360,'round'),'outer',{tone:0}));
  P.push(reg(G.circle(0,0,11,32),'outer'));
  if(rng.chance(.5))P.push(ln(G.circle(0,0,56,110),'outer',true));
  return fitParts(P);}});
defMotif('tomoe',{name:'Swirling commas',term:'mitsudomoe 三つ巴',
meaning:'Two or three comma shapes chasing each other round a circle: water swirling, or thunder. A crest of shrines (Hachiman) and of many families, and painted on taiko drums.',
fn(rng,g){const P=[];const R=46,n=rng.pick([3,3,3,2]),h=n===3?0.42*R:0.5*R,sweep=n===3?118:176,pw=n===3?1.2:1.05;
  /* each comma is a band whose outer edge stays on the circle: its centre line sits half a width
     inside the rim, the width falling from the round head to nothing at the tail */
  for(let k=0;k<n;k++){const th0=k*360/n-90;const pts=[];
    for(let i=0;i<=60;i++){const u=i/60,ang=(th0+u*sweep)*DEG,w=h*Math.pow(1-u,pw),rr=R-w;pts.push([Math.cos(ang)*rr,Math.sin(ang)*rr]);}
    P.push(reg(capRibbon(pts,t=>h*Math.pow(1-t,pw)+0.05),'outer',{tone:0}));}
  if(rng.chance(.55))P.push(ln(G.circle(0,0,R+8,110),'outer',true));
  return fitParts(P);}});
defMotif('sensu',{name:'Folding fan',term:'sensu / ōgi 扇',upright:true,
meaning:'The folding fan opens outward like good fortune spreading (suehirogari). Fans carry paintings and are themselves a favourite kimono and crest motif.',
fn(rng,g){const P=[];const a0=-158,a1=-22,R=52,r0=R*0.42,pv=[0,24];
  P.push(reg(G.arc(pv[0],pv[1],R,a0,a1,44).concat(G.arc(pv[0],pv[1],r0,a1,a0,20)),'outer'));
  const n=rng.pick([8,10,12]);for(let i=1;i<n;i++){const a=(a0+(a1-a0)*i/n)*DEG;P.push(ln([[pv[0]+Math.cos(a)*r0,pv[1]+Math.sin(a)*r0],[pv[0]+Math.cos(a)*R,pv[1]+Math.sin(a)*R]],'detail'));}
  if(rng.chance(.5))for(const k of [0.62,0.8])P.push(ln(G.arc(pv[0],pv[1],R*k,a0+6,a1-6,30),'inner'));
  for(const a of [a0,a0+(a1-a0)*0.33,a0+(a1-a0)*0.66,a1])P.push(ln([[pv[0],pv[1]],[pv[0]+Math.cos(a*DEG)*r0,pv[1]+Math.sin(a*DEG)*r0]],a===a0||a===a1?'outer':'inner'));
  P.push(reg(G.circle(pv[0],pv[1],3.6,14),'outer'));
  return fitParts(P);}});
defMotif('asanohaMon',{name:'Hemp-leaf star',term:'asanoha 麻の葉',
meaning:'A hexagon split into six kites around a star — one cell of the hemp-leaf pattern on its own, as a crest.',
fn(rng,g){const P=[];const R=48;const V=k=>[Math.cos((k*60-90)*DEG)*R,Math.sin((k*60-90)*DEG)*R];
  P.push(reg(Array.from({length:6},(_,k)=>V(k)),'outer'));
  for(let k=0;k<6;k++){const a=V(k),b=V(k+1),c=[(a[0]+b[0])/3,(a[1]+b[1])/3];P.push(ln([[0,0],a],'inner'),ln([a,c],'detail'),ln([b,c],'detail'),ln([[0,0],c],'detail'));}
  return P;}});
defMotif('enso',{name:'Ensō',term:'ensō 円相',
meaning:'A circle made in one breath with one stroke of the brush, often left open. In Zen it stands for emptiness and completeness at once; the stroke shows the state of mind of the person who made it.',
fn(rng,g){const a0=rng.range(95,150),sweep=rng.range(300,342);const ph=rng.range(0,6);const pts=[];
  for(let i=0;i<=72;i++){const u=i/72,a=(a0+u*sweep)*DEG,r=42+2.2*Math.sin(u*5+ph)-(u>0.8?(u-0.8)*14:0);pts.push([Math.cos(a)*r,Math.sin(a)*r*rng.range(0.995,1.005)]);}
  return fitParts([bl(pts,'tail',3.4)]);}});
defMotif('bamboo',{name:'Bamboo',term:'take 竹 / zhú',upright:true,
meaning:'Hollow, straight and bending without breaking — the upright scholar. One of the Four Gentlemen of ink painting, practised as a discipline of single, unretouched strokes.',
fn(rng,g){const P=[];const segs=rng.int(3,4),lean=rng.range(-6,6),h=100/segs;
  for(let k=0;k<segs;k++){const y0=50-k*h,y1=y0-h+3,x0=lean*k/segs,x1=lean*(k+1)/segs,w=5.2-k*0.5;
    P.push(reg([[x0-w,y0],[x0+w,y0],[x1+w*0.92,y1],[x1-w*0.92,y1]],'outer'));P.push(ln(G.quad([x1-w*1.2,y1+1],[x1,y1-1.5],[x1+w*1.2,y1+1]),'inner'));}
  const nodes=[1,2].map(k=>[lean*k/segs,50-k*h]);
  nodes.forEach(([x,y],j)=>{const s=j?1:-1;P.push(ln(G.quad([x,y],[x+s*10,y-10],[x+s*24,y-12]),'inner'));
    const n=rng.int(3,4);for(let i=0;i<n;i++)P.push(reg(G.xform(G.petal(rng.range(24,32),3.6,'pointed'),{x:x+s*(14+i*3),y:y-11+i*1.5,rot:s*(rng.range(100,150)+i*12)}),'outer'));});
  return fitParts(P);}});

/* ---------- Chinese vocabulary ---------- */
/* Ruyi head, redrawn 2026-10-13 against a sheet of thirty line-drawn heads supplied by the user.
   What the sheet shows, and what the code keeps: the outline is an even STRAP (two parallel lines)
   with a small ogee point at the crown, two full side lobes that hang lower than the middle, and a
   shallow foot between them; inside, a strap of the same weight arches across and rolls down into
   each lobe as a scroll; a waisted stem stands at the foot and a pearl sits under the crown. Curves
   are separate arcs joined at points, so the crown and the meeting of lobe and foot stay crisp. */
function ruyiOutline(){const half=G.chain(G.bez([0,-38],[1.6,-35],[3.6,-33.4],[6.6,-32],8),G.bez([6.6,-32],[12.6,-29.6],[17.6,-26.6],[19.6,-21.6],12),G.bez([19.6,-21.6],[25,-27.6],[43,-22],[44,-3],18),G.bez([44,-3],[45,12],[37,24],[24,24],16),G.bez([24,24],[17,24],[12,20],[6.6,18.4],10),G.bez([6.6,18.4],[4.4,17.8],[2.2,17.6],[0,17.6],5));
  return half.concat(half.slice(1,-1).reverse().map(([x,y])=>[-x,y]));}
// the inner line of a strap: the outline moved in by d, with the loops an offset makes at tight corners cut away
function ruyiInner(o,d){const far=q=>{let m=1e9;for(const p of o){const k=Math.hypot(p[0]-q[0],p[1]-q[1]);if(k<m)m=k;}return m;};return G.offset(G.resample(o,true,0.9),-d,true).filter(q=>far(q)>=d*0.9);}
defMotif('ruyi',{name:'Ruyi head',term:'rúyì 如意',upright:true,
meaning:'The lobed cloud-and-fungus head of the ruyi scepter, whose name means "as you wish". It is drawn as an even strap: a pointed crown, two full lobes with a scroll rolled into each, a waisted stem at the foot and a pearl under the crown. It tops collars, lappets and borders; as a cloud (yún) it also puns on yùn, luck.',
fn(rng,g){const o=ruyiOutline(),Z=(p,z)=>Object.assign(p,{z}),P=[reg(o,'outer',{tone:1,z:0}),reg(ruyiInner(o,4.2),'inner',{tone:2,z:1})];
  // the inner strap: a low arch from the middle that rolls down into each lobe
  {const h=cnArcs([0,-12.6],9,[[-60,18],[13.6,182],[8.6,150],[4.6,190]],0.7),sp=h.slice(1).reverse().map(([x,y])=>[-x,y]).concat(h),n=sp.length;
    P.push(reg(G.ribbon(sp,t=>{const u=Math.abs(2*t-1);return u<0.62?1.9:Math.max(0.5,1.9-2.6*(u-0.62));}),'inner',{tone:1,z:2}));for(const q of [sp[0],sp[n-1]])P.push(Z(dt(q[0],q[1],1.4,'inner'),2.1));}
  // waisted stem at the foot, pearl under the crown
  const st=G.chain(G.bez([-5.4,2.6],[-2.4,6],[-2.4,10],[-6.4,13.2],10),[[6.4,13.2]],G.bez([6.4,13.2],[2.4,10],[2.4,6],[5.4,2.6],10));
  P.push(reg(st,'inner',{tone:1,z:2.2}),reg(G.circle(0,-21.6,3,24),'inner',{tone:1,z:2.2}));
  return fitParts(cnSort(P));}});
/* Lion-dance head, drawn 2026-10-14 against three references supplied by the user (two detailed
   line drawings and a sheet of simplified frontal masks). The frontal mask gives the structure;
   the two drawings give the manner: big rounded forms bounded by taut curves, every edge of the
   mask trimmed with fur drawn hair by hair, eyes as nested rings, spiral curls on nose and cheek,
   a beard of long wavy locks. Built as a right half and mirrored, with the centre-line parts
   drawn once. Parts of one kind share a tone. */
function cnFur(P,cp,w,tone,z,rake=1,step=0.9){const sp=G.resample(G.chaikin(cp,false,3),false,step),n=sp.length,prof=t=>0.5*Math.pow(Math.sin(Math.PI*clamp(0.04+0.92*t)),0.4);
  P.push(reg(G.ribbon(sp,t=>w*prof(t)),'inner',{tone,z}));
  for(let i=1;i<n-1;i++){const a=sp[i-1],b=sp[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1,t=[(b[0]-a[0])/l,(b[1]-a[1])/l],nn=[-t[1]*rake,t[0]*rake],q=sp[i],k=prof(i/n);
    P.push(Object.assign(ln([[q[0]-nn[0]*w*k*0.5,q[1]-nn[1]*w*k*0.5],[q[0]+nn[0]*w*k*0.5+t[0]*w*0.14,q[1]+nn[1]*w*k*0.5+t[1]*w*0.14],[q[0]+nn[0]*w*k*1.3+t[0]*w*0.4,q[1]+nn[1]*w*k*1.3+t[1]*w*0.4]],'detail'),{z:z+0.05}));}}
function cnLock(P,cp,w,tone,z){const sp=G.resample(G.chaikin(cp,false,3),false,1),n=sp.length,hw=t=>Math.max(0.12,w*0.5*Math.pow(Math.sin(Math.PI*clamp(0.2+0.8*t)),0.8));
  P.push(reg(G.ribbon(sp,hw),'inner',{tone,z}));for(const o of [-0.45,0.1,0.55])P.push(Object.assign(ln(sp.slice(1,Math.round(n*0.9)).map((q,i)=>{const k=i+1,a=sp[k-1],b=sp[Math.min(n-1,k+1)],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return[q[0]-(b[1]-a[1])/l*hw(k/n)*o,q[1]+(b[0]-a[0])/l*hw(k/n)*o];}),'detail'),{z:z+0.05}));}
function cnSpiral(x,y,r,a0,turns,dir,z){const s=[];for(let i=0;i<=30;i++){const t=i/30,a=(a0+dir*t*turns*360)*DEG,rr=r*(1-0.86*t);s.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}return Object.assign(ln(s,'inner'),{z});}
function cnPom(P,x,y,r,z){P.push(reg(G.circle(x,y,r,20),'inner',{tone:2,z}));for(let i=0;i<14;i++){const a=i/14*Math.PI*2;P.push(Object.assign(ln([[x+Math.cos(a)*r*0.5,y+Math.sin(a)*r*0.5],[x+Math.cos(a+0.25)*r*1.22,y+Math.sin(a+0.25)*r*1.22]],'detail'),{z:z+0.05}));}}
defMotif('xingShi',{name:'Lion-dance head',term:'xǐngshī 醒獅',upright:true,meaning:'The head of the southern dancing lion: a horn on the crown, a mirror on the brow to turn evil back on itself, great ringed eyes under shaggy brows, a broad fur-trimmed lip over the open mouth, and a long beard. Two dancers carry it through the streets at the new year, to drums and firecrackers, and it “eats” the greens hung over a doorway and spits them out as luck.',
fn(rng,g){const H=[],C=[],Z=(p,z)=>Object.assign(p,{z});
  // ---- right half ----
  // ear: a leaf standing out behind the brow, fur along its outer edge
  H.push(reg(G.chaikin([[28,-25],[34,-37],[44,-47],[51,-37],[48,-25],[40,-17],[31,-18]],true,2),'outer',{tone:1,z:0}),Z(ln(G.chaikin([[33,-23],[38,-33],[44,-39],[45,-30],[42,-23]],false,3),'detail'),0.1));
  cnFur(H,[[33,-35],[43,-47],[51,-38],[49,-25]],4.4,2,0.2,-1);
  // pom-pom on its spring, beside the cheek
  H.push(Z(ln(G.bez([37,-2],[43,-6],[46,-10],[47,-14],8),'inner'),0));cnPom(H,47.6,-17,3.6,0.2);
  // brow: a thick arch of fur over the eye
  cnFur(H,[[3,-10],[10,-19],[22,-24],[35,-22],[43,-14]],8.4,2,3,-1);
  for(const cp of [[[38,-19],[44,-22],[47,-28],[45,-33]],[[40,-16],[47,-17],[51,-22],[51,-27]],[[41,-13],[47,-12],[52,-15],[54,-19]]])cnLock(H,cp,3.4,2,2.9);
  // eye: nested rings, the pupil large, a light in it; the lid a taut line above
  for(const [r,tone] of [[11.6,2],[9,1],[6.4,2],[4,3]])H.push(reg(G.circle(20.6,-7,r,34),'inner',tone===2?{bg:true,z:2}:{tone,z:2}));
  for(const r of [11.6,9,6.4,4])H.push(Z(ln(G.circle(20.6,-7,r,34),r>10?'outer':'inner',true),2.1));
  H.push(Z(dt(20.6,-7,2.5),2.2),reg(G.circle(21.8,-8.2,0.85,8),'detail',{bg:true,z:2.3}));
  // cheek: a spiral curl and two flame strokes
  H.push(cnSpiral(34.6,6,4.6,200,1.5,1,2),cnSpiral(9,-25,3.2,90,1.3,1,2),cnSpiral(17,-28.6,2.6,60,1.2,-1,2),Z(ln(G.bez([37,-2],[40,2],[39,6],[41,9],8),'detail'),2));
  // nostril curl and the fold beside the nose
  H.push(cnSpiral(5.4,-1.6,3.4,180,1.4,-1,5),Z(ln(G.bez([10,-6],[13,-1],[11,3],[7,5],8),'detail'),5));
  // beard: long locks hanging from the jaw, waving outward
  [[3,40,1,78,7.4],[9,40,9,76,7.4],[15,39,18,72,7],[21,37,27,66,6.4],[26,34,35,58,5.6],[30,30,41,49,4.6]].forEach(([x0,y0,x1,y1,w],i)=>cnLock(H,[[x0,y0],[x0+3.4,y0+(y1-y0)*0.3],[x1-4,y0+(y1-y0)*0.62],[x1+1,y0+(y1-y0)*0.86],[x1,y1]],w,2,-2-i*0.01));
  [[6,40,5,62,6],[12,40,14,60,5.6],[18,38,23,56,5.2],[24,36,31,50,4.6]].forEach(([x0,y0,x1,y1,w],i)=>cnLock(H,[[x0,y0],[x0-2.6,y0+(y1-y0)*0.34],[x1+2.6,y0+(y1-y0)*0.68],[x1,y1]],w,2,-1-i*0.01));
  // ---- centre line ----
  // the mask: one contour, broad at the cheeks and drawn in to the jaw
  const half=[[0,-32],[12,-34.6],[25,-32.6],[36,-25],[42,-13],[42.6,0],[39,11],[32,18],[28,27],[24,35],[14,40],[0,42]];
  C.push(reg(G.chaikin(half.concat(half.slice(1,-1).reverse().map(([x,y])=>[-x,y])),true,3),'outer',{tone:0,z:1}));
  // horn on its boss, and the mirror on the brow
  C.push(reg(G.ribbon(G.resample(G.chaikin([[0,-36],[1,-42],[4,-47],[9,-49]],false,3),false,1),t=>4.4*(1-0.82*t)+0.4),'outer',{tone:3,z:0.5}),reg(G.chaikin([[-7,-31],[-6,-37],[0,-40],[6,-37],[7,-31]],true,2),'outer',{tone:1,z:0.6}));
  for(const y of [-36,-33.6])C.push(Z(ln(G.quad([-5.4,y],[0,y-1.8],[5.4,y],6),'detail'),0.7));
  C.push(reg(G.circle(0,-22.6,5.6,24),'inner',{tone:3,z:4}),reg(G.circle(0,-22.6,3.6,18),'inner',{bg:true,z:4.1}),Z(ln(G.circle(0,-22.6,3.6,18),'detail',true),4.2),Z(dt(0,-22.6,1.2),4.3));
  // nose: a rounded boss with a pom-pom above it
  C.push(reg(G.chaikin([[-10,-1],[-8,-9],[0,-12.6],[8,-9],[10,-1],[6,4.4],[-6,4.4]],true,3),'outer',{tone:1,z:4.5}));cnPom(C,0,-14.6,3.3,5.5);
  // mouth: the dark opening, tongue, the lower jaw with its row of teeth
  C.push(reg(G.chaikin([[-33,16],[0,14],[33,16],[29,31],[0,36],[-29,31]],true,2),'outer',{paint:'ink',z:5}),reg(G.chaikin([[-10,25],[0,22],[10,25],[9,31],[0,33.6],[-9,31]],true,2),'inner',{tone:3,z:5.2}),Z(ln([[0,23.6],[0,31]],'detail'),5.3));
  C.push(reg(G.chaikin([[-29,27],[-14,32],[0,33.6],[14,32],[29,27],[26,36.6],[13,40.6],[0,42],[-13,40.6],[-26,36.6]],true,2),'outer',{tone:0,z:5.5}));
  for(let i=-5;i<=5;i++){const x=i*4.6,y=32.6-Math.abs(i)*0.55-Math.pow(Math.abs(i)/5,2)*2.2;C.push(reg(G.roundRect(x-1.9,y-0.4,x+1.9,y+3.6,0.8,2),'inner',{bg:true,z:5.6}),Z(ln(G.roundRect(x-1.9,y-0.4,x+1.9,y+3.6,0.8,2),'detail',true),5.7));}
  // upper lip: one broad band across the face, its lower edge trimmed with fur
  C.push(reg(G.chaikin([[-41,10],[-31,3],[-17,1.4],[-7,6],[0,8.6],[7,6],[17,1.4],[31,3],[41,10],[46.6,18],[42,25],[31,20.6],[14,17.6],[0,19.6],[-14,17.6],[-31,20.6],[-42,25],[-46.6,18]],true,3),'outer',{tone:2,z:6}));
  cnFur(C,[[-44,22.6],[-31,19.6],[-14,16.6],[0,18.6],[14,16.6],[31,19.6],[44,22.6]],5.4,2,6.1,1,1);
  for(const s of [-1,1])C.push(cnSpiral(s*36,13.6,4,s>0?180:0,1.4,s,6.2),cnSpiral(s*14,8.6,2.8,s>0?0:180,1.2,-s,6.2),Z(ln(G.bez([s*19,7],[s*24,9.6],[s*28,9],[s*31,11.6],8),'detail'),6.2));
  const P=H.concat(H.map(p=>p.kind==='dot'?Object.assign({},p,{x:-p.x}):Object.assign({},p,{pts:p.pts.map(([x,y])=>[-x,y])})),C);
  return fitParts(P.map((p,i)=>[p,i]).sort((a,b)=>(a[0].z||0)-(b[0].z||0)||a[1]-b[1]).map(a=>a[0]),96);}});
/* Cloud and bat, redrawn 2026-10-13 against six references supplied by the user (a shaded line
   cloud, a sheet of small clouds, a gold line cloud; a papercut bat, a sheet of three line bats,
   a cloud-and-flame study). What they share, and what the code keeps:
   - a cloud is a cluster of SCROLLS, not of circles. Each lobe is a volute: its outline runs once
     round and then dives inside its own start and winds on to the centre, so the radius falls all
     the way and no lobe is round. Lobes lap one another, and where two meet the line makes a cusp.
   - the tails are long tapering S curves that end in a point.
   - the shading the user asked to keep: fine lines that follow each scroll just inside its outline,
     each one shorter than the last, and long lines combed down the tails.
   - a bat is drawn head down. Its lines are long taut curves that meet in SHARP points: the finger
     tips of the wing, the ears, the brows. The wing arm ends in a rolled tip. The body is a stack
     of lapped arches under a ruyi cap, and the head sits in a scalloped collar with a ring in the
     mouth. */
function cnArcs(start,heading,segs,step=0.8){let [x,y]=start,h=heading;const P=[[x,y]];
  for(const [r,sw] of segs){if(!r){x+=Math.cos(h*DEG)*sw;y+=Math.sin(h*DEG)*sw;P.push([x,y]);continue;}
    const R=Math.abs(r),s=r>0?1:-1,cx=x-s*R*Math.sin(h*DEG),cy=y+s*R*Math.cos(h*DEG),n=Math.max(3,Math.round(R*Math.abs(sw)*DEG/step));
    for(let i=1;i<=n;i++){const a=(h+s*sw*i/n)*DEG;P.push([cx+s*R*Math.sin(a),cy-s*R*Math.cos(a)]);}h+=s*sw;x=P[P.length-1][0];y=P[P.length-1][1];}
  return P;}
// one scroll: filled disc of the first turn, the volute line over it, and shading lines inside the outline
function cnVolute(P,cx,cy,r,a0,dir,z,o={}){const turns=o.turns||2.1,T=turns*360,N=Math.round(turns*46),n1=Math.round(N/turns),rad=u=>r*(1-0.84*u),
    pt=(u,off=0)=>{const a=(a0+dir*u*T)*DEG,rr=Math.max(0,rad(u)-off);return[cx+Math.cos(a)*rr,cy+Math.sin(a)*rr];},Z=(q,zz)=>Object.assign(q,{z:zz});
  const sp=[];for(let i=0;i<=N;i++)sp.push(pt(i/N));
  P.push(reg(sp.slice(0,n1+1),'outer',{ns:true,tone:o.tone||1,z}),Z(ln(sp.slice(0,n1+2),'outer'),z+0.01),Z(ln(sp.slice(n1+1),'inner'),z+0.01));
  if(o.shade){const [h0,h1]=o.shade,gap=r*0.84/turns,k=o.lines||5;
    for(let i=0;i<k;i++){const off=gap*(0.1+0.6*i/k),u0=(h0+i*i*2.2+((i*37)%11))/T,u1=(h1-i*17-((i*53)%13))/T,m=Math.max(4,Math.round((u1-u0)*T/8)),q=[];if(u1<=u0)continue;
      for(let j=0;j<=m;j++)q.push(pt(u0+(u1-u0)*j/m,off));P.push(Z(ln(q,'detail'),z+0.02));}
    for(let i=0;i<Math.min(3,k-2);i++){const off=gap*(0.2+0.2*i),u0=1/turns+(h0+20+i*14)/T,u1=1/turns+(h1-40-i*30)/T,m=Math.max(4,Math.round((u1-u0)*T/10)),q=[];if(u1<=u0)continue;
      for(let j=0;j<=m;j++)q.push(pt(u0+(u1-u0)*j/m,off));P.push(Z(ln(q,'detail'),z+0.02));}}}
// a tapering tail on an arc spine, combed with long lines
function cnTail(P,start,heading,segs,w,z,o={}){const sp=cnArcs(start,heading,segs),n=sp.length,hw=t=>w*0.5*Math.pow(1-t,o.pow||0.8)+0.04,Z=(q,zz)=>Object.assign(q,{z:zz});
  P.push(reg(G.ribbon(sp,hw),'outer',{tone:o.tone||1,z}));
  (o.comb||[[-0.5,0.04,0.62],[-0.08,0.1,0.8],[0.38,0.02,0.5]]).forEach(([f,t0,t1])=>{const q=[];for(let i=Math.round(t0*n);i<Math.round(t1*n);i++){const a=sp[Math.max(0,i-1)],b=sp[Math.min(n-1,i+1)],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1,k=hw(i/n)*f;q.push([sp[i][0]-(b[1]-a[1])/l*k,sp[i][1]+(b[0]-a[0])/l*k]);}
    if(q.length>2)P.push(Z(ln(q,'detail'),z+0.02));});
  return sp;}
const cnSort=P=>P.map((p,i)=>[p,i]).sort((a,b)=>(a[0].z||0)-(b[0].z||0)||a[1]-b[1]).map(a=>a[0]);
defMotif('cloud',{name:'Auspicious cloud',term:'xiángyún 祥云',upright:true,
meaning:'Clouds drawn as a cluster of scrolls with long trailing tails — the vapour on which immortals travel, and, by sound, good fortune (yún / yùn). Each lobe is a scroll that winds in on itself, and fine lines following the scrolls give them roundness.',
fn(rng,g){const P=[];
  cnTail(P,[-12,6.5],176,[[-30,36],[24,76],[-22,40]],13,0,{comb:[[-0.62,0.1,0.6],[-0.3,0.06,0.74],[0.04,0.1,0.84],[0.36,0.05,0.66],[0.66,0.12,0.5]]});
  cnTail(P,[22,8.5],4,[[22,34],[-18,74],[16,38]],10.5,0.1,{comb:[[-0.55,0.1,0.55],[-0.12,0.06,0.8],[0.3,0.1,0.66],[0.62,0.14,0.5]]});
  // the mass behind the scrolls, so no ground shows between them where the cloud is cut or painted solid
  P.push(reg(G.chaikin([[-30,8],[-17,-9],[6,-15],[30,-6],[40,8],[28,13],[16,10],[-6,10],[-22,12]],true,2),'outer',{ns:true,tone:1,z:0.5}));
  cnVolute(P,29,-5,10.5,125,-1,1,{shade:[50,225],lines:5});
  cnVolute(P,-15,-8,13,70,1,2,{shade:[55,235],lines:6});
  cnVolute(P,7,-14,16.5,105,-1,3,{shade:[45,240],lines:7});
  cnVolute(P,-27,5,8.5,20,1,4,{shade:[40,210],lines:4});
  cnVolute(P,37.5,6,7,160,-1,4.5,{shade:[40,200],lines:4});
  cnVolute(P,-6,7,12.5,5,1,5,{shade:[30,230],lines:6});
  cnVolute(P,16,8,11.5,175,-1,6,{shade:[30,230],lines:6});
  return fitParts(cnSort(P));}});
defMotif('bat',{name:'Bat',term:'fú 蝠',upright:true,
meaning:'The bat is fú, sounding like fú 福, good fortune; five bats are the Five Blessings. It is drawn flying head down, so that fortune "arrives", with wings that sweep out in long curves to rolled tips and sharp finger points, a body of lapped arches under a ruyi cap, and often a ring or a coin in its mouth: fortune before your eyes.',
fn(rng,g){const H=[],C=[],HH=[],HC=[],Z=(p,z)=>Object.assign(p,{z}),sliver=(cp,w,pw=1)=>{const sp=G.bez(cp[0],cp[1],cp[2],cp[3],22);return G.ribbon(sp,t=>w*Math.pow(1-t,pw)+0.05);};
  // ---- right wing ----
  const arm=cnArcs([4,-3],24,[[-44,70],[-14,62],[-6.5,150],[-3.2,170]]),na=arm.length,ka=Math.round(na*0.6);
  const T1=[48,19],T2=[32,24],T3=[18,22];
  // membrane: the top edge runs under the arm; the outer edge and the scallops between the fingers meet in points
  H.push(reg(G.chain([[4,12],[4,-3]],arm.slice(0,ka),G.bez(arm[ka-1],[62,-4],[57,10],T1,16),G.bez(T1,[46,9],[36,9],T2,14),G.bez(T2,[31,12],[22,10],T3,14),G.bez(T3,[17,12],[11,9],[4,12],12)),'outer',{tone:1,z:0}));
  for(const [tip,c1,c2] of [[T1,[27,4],[44,5]],[T2,[19,6],[31,11]],[T3,[11,7],[18,13]]])H.push(reg(sliver([[8,0],c1,c2,tip],0.95,0.7),'inner',{tone:2,z:0.2}));
  // arm: a band that thins to a rolled tip, with the line of the bone down its middle
  H.push(reg(G.ribbon(arm,t=>t<0.62?3.3-1.5*t:Math.max(0.3,2.37*(1-(t-0.62)/0.38*0.9))),'outer',{tone:2,z:1}),Z(ln(arm.slice(3,Math.round(na*0.66)),'detail'),1.05));
  // a wisp of cloud trailing from the shoulder, over the arm
  cnTail(H,[19,-10],-30,[[-12,36],[9,60]],5.6,1.4,{tone:3,comb:[[-0.3,0.1,0.6],[0.3,0.1,0.7]]});cnVolute(H,22.4,-11.4,3.5,150,-1,1.45,{tone:3,turns:1.7});cnVolute(H,15.4,-9.4,5,60,1,1.5,{tone:3,turns:1.9,shade:[40,200],lines:3});
  // ---- right half of the head (drawn at natural size, enlarged below) ----
  const head=G.chain(G.bez([0,26.4],[6.6,25.6],[11.2,22],[11.6,16.6],12),G.bez([11.6,16.6],[13.6,12.6],[17,7.6],[19.6,1.6],10),G.bez([19.6,1.6],[14.6,4.6],[10.2,6.4],[7.4,10.2],10),G.bez([7.4,10.2],[5,7.8],[2.2,7.2],[0,7.6],8));
  HH.push(reg(sliver([[11.4,11.6],[13,9.4],[15.2,6.8],[17.6,3.8]],0.7,0.6),'detail',{tone:3,z:5}));
  // brow: a flame of three points over the eye
  HH.push(reg(G.chain(G.bez([1.6,14.6],[3.6,12],[7,11],[11.4,9.4],10),G.bez([11.4,9.4],[9.6,11.4],[8.6,12],[10.6,12.4],6),G.bez([10.6,12.4],[8.6,13],[7.6,13.4],[8.8,14.6],6),G.bez([8.8,14.6],[6,13.2],[3.6,13.6],[1.6,14.6],8)),'inner',{tone:2,z:5}));
  const eye=G.chain(G.bez([1.8,17.2],[3.4,14.4],[7,14.4],[9.2,16],8),G.bez([9.2,16],[7.2,18.6],[3.8,18.8],[1.8,17.2],8));
  HH.push(reg(eye,'inner',{bg:true,z:5}),Z(ln(eye,'inner',true),5.02),Z(dt(5.4,16.5,1.3,'inner'),5.05));
  HH.push(cnSpiral(5.4,21,1.5,180,1.2,-1,5.2),Z(ln(G.bez([6.2,23.2],[4.2,24.4],[1.8,24.4],[0,22.6],8),'inner'),5.2),Z(ln(G.bez([8,19.4],[9.6,20.4],[10,21.8],[9.2,23.2],6),'detail'),5.2));
  // collar: a scalloped ruff behind the head
  {const cx=0,cy=14,R=12.6,rr=4.9,as=[168,201,235,270,305,339,372],cs=as.map(a=>[cx+Math.cos(a*DEG)*R,cy+Math.sin(a*DEG)*R]),ring=[];
   cs.forEach((c,i)=>{for(let k=0;k<=40;k++){const a=k/40*Math.PI*2,q=[c[0]+Math.cos(a)*rr,c[1]+Math.sin(a)*rr];if(cs.every((d,j)=>j===i||Math.hypot(q[0]-d[0],q[1]-d[1])>=rr-1e-6)&&Math.hypot(q[0]-cx,q[1]-cy)>R)ring.push(q);}});
   ring.sort((p,q)=>((Math.atan2(p[1]-cy,p[0]-cx)/DEG+270)%360)-((Math.atan2(q[1]-cy,q[0]-cx)/DEG+270)%360));
   HC.push(reg(ring.concat([[0,cy+4]]),'outer',{tone:2,z:3}));}
  HC.push(reg(head.concat(head.slice(1,-1).reverse().map(([x,y])=>[-x,y])),'outer',{tone:1,z:4}));
  HC.push(reg([[0,9.4],[1.7,11.6],[0,13.8],[-1.7,11.6]],'inner',{tone:3,z:5}));
  HC.push(reg(G.chain(G.bez([0,18],[1.6,18.6],[3,19.6],[3.2,20.8],8),G.bez([3.2,20.8],[2.2,21.2],[0.8,21.4],[0,22.4],6),G.bez([0,22.4],[-0.8,21.4],[-2.2,21.2],[-3.2,20.8],6),G.bez([-3.2,20.8],[-3,19.6],[-1.6,18.6],[0,18],8)),'inner',{tone:2,z:5.1}));
  // the ring in the mouth
  HC.push(reg(G.circle(0,29.6,4.4,28),'outer',{tone:3,z:3.5}),reg(G.circle(0,29.6,2.7,22),'inner',{bg:true,z:3.6}),Z(ln(G.circle(0,29.6,2.7,22),'inner',true),3.62));
  // body: a ruyi cap, then arches lapping toward the head
  for(const s of [-1,1])C.push(reg(G.circle(s*4.3,-24.6,3.1,20),'outer',{tone:3,z:1.8}));
  C.push(reg(G.circle(0,-27.6,3.7,22),'outer',{tone:3,z:1.9}),Z(dt(0,-27.6,1,'detail'),1.95));
  [[-18.6,6.2,5.4],[-11.4,8.4,6.8],[-2.6,10.6,9]].forEach(([cy,hw,h],i)=>{C.push(reg(G.chaikin([[-hw,cy+h*0.7],[-hw*0.97,cy-h*0.3],[-hw*0.56,cy-h*0.94],[0,cy-h*1.14],[hw*0.56,cy-h*0.94],[hw*0.97,cy-h*0.3],[hw,cy+h*0.7],[hw*0.5,cy+h],[-hw*0.5,cy+h]],true,3),'outer',{tone:2,z:2+i*0.1}));
    for(const f of [0.62,0.36])C.push(Z(ln(G.bez([-hw*f,cy-h*(1.14-0.62*f-0.2)],[-hw*f*0.5,cy-h*(1.02-0.3*f)],[hw*f*0.5,cy-h*(1.02-0.3*f)],[hw*f,cy-h*(1.14-0.62*f-0.2)],10),'detail'),2.05+i*0.1));});
  const mir=A=>A.concat(A.map(p=>p.kind==='dot'?Object.assign({},p,{x:-p.x}):Object.assign({},p,{pts:p.pts.map(([x,y])=>[-x,y])})));
  const K=1.22,ox=0,oy=9,big=mir(HH).concat(HC).map(p=>p.kind==='dot'?Object.assign({},p,{x:p.x*K,y:oy+(p.y-oy)*K+1,r:p.r*K}):Object.assign({},p,{pts:p.pts.map(([x,y])=>[x*K,oy+(y-oy)*K+1])}));
  return fitParts(cnSort(mir(H).concat(C,big)));}});
defMotif('plum',{name:'Plum blossom',term:'méihuā 梅花',
meaning:'Five round petals: the plum flowers on bare branches in late winter, so it stands for endurance and renewal. Scattered on cracked ice it is the "ice and plum" pattern.',
fn(rng,g){const P=[];const rot=rng.range(0,72);
  for(let i=0;i<5;i++){const a=(rot+i*72-90)*DEG;P.push(reg(G.circle(Math.cos(a)*23.6,Math.sin(a)*23.6,13.7,36),'outer',{tone:0}));}
  P.push(reg(G.circle(0,0,6.4,24),'inner'));
  for(let i=0;i<8;i++){const a=(rot+i*45)*DEG;P.push(ln([[Math.cos(a)*6.4,Math.sin(a)*6.4],[Math.cos(a)*14,Math.sin(a)*14]],'detail'),dt(Math.cos(a)*15.4,Math.sin(a)*15.4,1.4));}
  return fitParts(P);}});
defMotif('taotie',{name:'Bronze mask',term:'tāotiè 饕餮',upright:true,
meaning:'A frontal mask resolved from two profile creatures meeting on a central ridge: staring eyes, curled horns, jaws, bodies running out to the sides. It dominates Shang and early Zhou ritual bronzes; what it meant is still argued. A generic mask, not a copy of any vessel.',
fn(rng,g){const side=[];const out=rng.chance(.5);
  side.push(reg(G.ribbon(G.chain(G.bez([-24,-2],[-34,-3],[-42,-4],[-48,-8],10),G.bez([-48,-8],[-53,-14],[-47,-21],[-41,-16],8)),t=>3.8*(1-0.6*t)+0.5),'outer'));
  side.push(reg(G.ribbon(G.bez([-35,0],[-36,8],[-39,14],[-43,20],8),t=>3.4-1.6*t),'outer'));side.push(reg([[-41,17],[-50,24],[-40,23]],'outer'));
  const horn=out?G.chain(G.bez([-6,-17],[-10,-30],[-22,-38],[-34,-36],12),G.bez([-34,-36],[-44,-34],[-44,-22],[-36,-22],10)):G.chain(G.bez([-6,-17],[-14,-24],[-30,-26],[-34,-36],12),G.bez([-34,-36],[-36,-45],[-24,-47],[-20,-38],10));
  side.push(reg(G.ribbon(horn,t=>5.4*(1-0.55*t)+0.8),'outer'));
  side.push(reg(G.ribbon(G.bez([-5,-13],[-12,-17.5],[-22,-17.5],[-30,-11],10),t=>2.6),'outer'));
  side.push(reg(G.chain(G.bez([-5,-4],[-9,-11],[-21,-12],[-27,-4],10),G.bez([-27,-4],[-21,3],[-9,3],[-5,-4],10)).slice(0,-1),'outer'));
  side.push(reg(G.circle(-16,-4,4.4,18),'inner'),dt(-16,-4,1.6));
  side.push(reg(G.chain(G.bez([-5,6],[-12,6],[-22,8],[-26,14],10),G.bez([-26,14],[-24,22],[-18,26],[-14,31],10),G.bez([-14,31],[-14,22],[-10,16],[-5,16],10)).slice(0,-1),'outer'));
  side.push(reg([[-19,17],[-14.5,27],[-12,17]],'inner'));
  for(const [x,y,s,cw] of [[-41,-31,9,false],[-29,28,9,true],[-50,8,7,true]])side.push(ln(squareSpiral(x,y,s,1,cw),'detail'));
  const P=[...side,...mirParts(side)];
  P.push(reg(G.roundRect(-3,-47,3,41,1.4),'outer'));for(const y of [-38,-26,24,34])P.push(reg([[-3,y],[-7,y+2.5],[-3,y+5]],'inner'),reg([[3,y],[7,y+2.5],[3,y+5]],'inner'));
  P.push(reg(G.chain(G.bez([-6,-10],[-8.5,0],[-8,8],[-4,12],8),[[4,12]],G.bez([4,12],[8,8],[8.5,0],[6,-10],8)),'outer'));
  return fitParts(P);}});
/* Asemic characters from the eight strokes of 永 (yǒng zì bā fǎ). Each component fills a
   box; characters are one box, left-right, top-bottom or enclosed. Brush parts carry a
   pressure profile, so in a brush hand they read as calligraphy and in a monoline hand
   as something closer to seal or clerical script. They spell nothing. */
defMotif('hanzi',{name:'Brush character',term:'yǒng zì bā fǎ 永字八法',script:true,upright:true,
meaning:'A square character built from the eight basic strokes taught with the character 永: dot, horizontal, vertical, hook, rising stroke, long and short left-falling, and right-falling. Generated characters are asemic — they look like writing and spell nothing.',
fn(rng,g){const P=[],K=2.3;
  const H=(x0,x1,y)=>bl(G.bez([x0,y+1.2],[x0+(x1-x0)*0.3,y-0.4],[x0+(x1-x0)*0.7,y-0.9],[x1,y-2],10),'even',1);
  const V=(x,y0,y1,hook)=>{const o=[bl(G.bez([x,y0],[x+0.6,y0+(y1-y0)*0.3],[x-0.6,y0+(y1-y0)*0.7],[x,y1],10),hook?'even':rng.pick(['even','tail']),1.05*K)];if(hook)o.push(bl(G.bez([x,y1],[x-2,y1-1],[x-5,y1-3],[x-8,y1-7],6),'tail',1.1*K));return o;};
  const PIE=(x,y0,y1,w)=>bl(G.bez([x,y0],[x,y0+(y1-y0)*0.45],[x-w*0.3,y1-(y1-y0)*0.12],[x-w,y1],12),'tail',1.1*K);
  const NA=(x,y0,y1,w)=>bl(G.bez([x,y0],[x+w*0.25,y0+(y1-y0)*0.45],[x+w*0.6,y1-(y1-y0)*0.1],[x+w,y1],12),'rise',1.3*K);
  const DOT=(x,y)=>bl(G.bez([x-2.2,y-3],[x-0.6,y-1.5],[x+1,y],[x+2.6,y+2.2],5),'wedge',1.5*K);
  const TI=(x,y)=>bl(G.bez([x-4,y+3],[x-1,y+1],[x+2,y-1],[x+6,y-4],5),'tail',K);
  const comp=(x0,y0,x1,y1)=>{const w=x1-x0,h=y1-y0,o=[];const k=rng.weighted({grid:3,fall:1.6,water:1});
    if(k==='grid'){const nh=rng.int(1,3),ys=[];for(let i=0;i<nh;i++)ys.push(y0+h*(nh===1?rng.range(0.3,0.6):0.12+0.76*i/(nh-1)));
      ys.forEach((y,i)=>{const inset=i===ys.length-1?0.02:rng.range(0.08,0.22);o.push(H(x0+w*inset,x1-w*inset,y));});
      const nv=rng.int(1,2);for(let i=0;i<nv;i++){const x=x0+w*(nv===1?rng.range(0.42,0.58):0.25+0.5*i);o.push(...V(x,y0+h*rng.range(0,0.12),y1-h*rng.range(0,0.1),rng.chance(.3)));}
      if(rng.chance(.4))o.push(DOT(x0+w*0.5,y0-h*0.06));}
    else if(k==='fall'){if(rng.chance(.6))o.push(H(x0+w*0.1,x1-w*0.1,y0+h*0.28));const cx=x0+w*0.5;o.push(PIE(cx,y0+h*0.05,y1,w*0.42),NA(cx,y0+h*0.32,y1,w*0.44));if(rng.chance(.5))o.push(DOT(cx,y0-h*0.04));}
    else{for(let i=0;i<rng.int(2,3);i++)o.push(DOT(x0+w*0.12,y0+h*(0.14+i*0.3)));o.push(TI(x0+w*0.16,y1-h*0.08));o.push(H(x0+w*0.4,x1,y0+h*0.35),...V(x0+w*0.68,y0+h*0.05,y1,rng.chance(.4)));}
    return o;};
  const layout=rng.weighted({one:1,lr:2,tb:1.4,box:0.6});
  if(layout==='one')P.push(...comp(-36,-38,36,38));
  else if(layout==='lr'){const s=rng.range(-12,4);P.push(...comp(-38,-36,s-5,38),...comp(s+4,-40,38,40));}
  else if(layout==='tb'){const s=rng.range(-10,6);P.push(...comp(-34,-40,34,s-5),...comp(-38,s+4,38,40));}
  else{P.push(H(-30,32,-34),...V(-32,-36,40,false),...V(32,-36,40,true));P.push(...comp(-20,-22,20,28));}
  return fitParts(P);}});
defMotif('leiwenSq',{name:'Thunder spiral',term:'léiwén 雷纹',upright:true,
meaning:'A single square spiral of the thunder pattern — used alone as a filler between larger forms on bronzes.',
fn(rng,g){return fitParts([ln(squareSpiral(0,0,90,2,rng.chance(.5)),'outer')]);}});

/* ---------- borders: interlace, key-fret, ruyi, waves ---------- */
defBorder('plait',{name:'Plait',fn(L,t){const rows=2,m=t*0.08,uy=(t-2*m)/(2*rows);let cols=Math.max(3,Math.round(L/(2*uy)));if(gcd(cols,rows)!==1)cols++;
  const ux=L/(2*cols),u=Math.min(ux,uy),cord=u*0.62;
  return weaveGrid(kolamTrace(cols,(i,j)=>i<cols&&j<rows,()=>'cross'),v=>v*ux,v=>m+v*uy,{cord,gap:cord*0.5+u*0.16});}});
defBorder('knotChain',{name:'Knot chain',fn(L,t){const rows=2,m=t*0.08,uy=(t-2*m)/(2*rows);const per=3;const cols=per*Math.max(1,Math.round(L/(2*uy*per)));
  const ux=L/(2*cols),u=Math.min(ux,uy),cord=u*0.62;
  return weaveGrid(kolamTrace(cols,(i,j)=>i<cols&&j<rows,(x,y)=>x%(2*per)===0?'sep':'cross'),v=>v*ux,v=>m+v*uy,{cord,gap:cord*0.5+u*0.16});}});
// key-fret (huíwén 回纹 / Greek key): one continuous line that runs into a square spiral and out along the next track
const KEY_UNIT=[[0,5],[0,0],[5,0],[5,4],[2,4],[2,2],[3,2],[3,3],[4,3],[4,1],[1,1],[1,5]];
defBorder('huiwen',{name:'Key fret',fn(L,t){const k=t*0.82/5,n=Math.max(1,Math.round(L/(6*k))),kx=L/(6*n),y0=t*0.09;const pts=[];
  for(let i=0;i<n;i++)for(const [x,y] of KEY_UNIT)pts.push([i*6*kx+x*kx,y0+y*k]);pts.push([L,y0+5*k]);
  return[{kind:'line',closed:false,role:'outer',pts}];}});
defBorder('ruyiBand',{name:'Ruyi collar',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.95))),w=L/n,o=ruyiOutline(),P=[ln([[0,t*0.06],[L,t*0.06]],'inner')];
  const s=Math.min(w*0.95/88,t*0.86/56);for(let i=0;i<n;i++){const q=o.map(([x,y])=>[(i+.5)*w+x*s,t*0.5-(y+9.8)*s]);P.push(reg(q,'outer'),ln(ruyiInner(q,4.2*s),'inner',true));P.push(dt((i+.5)*w,t*0.5,t*0.05));}return P;}});
defBorder('seigaihaBand',{name:'Wave scales',fn(L,t){return tileParts('seigaiha',{x0:0,y0:0,x1:L,y1:t},t*0.36).concat([ln([[0,0.5],[L,0.5]],'inner'),ln([[0,t-0.5],[L,t-0.5]],'inner')]);}});
defBorder('taotieBand',{name:'Mask band',fn(L,t){const n=Math.max(1,Math.round(L/(t*1.9))),w=L/n,P=[ln([[0,t*0.04],[L,t*0.04]],'inner'),ln([[0,t*0.96],[L,t*0.96]],'inner')];
  const mask=SG.motifs.taotie.fn(makeRng(7),{});for(let i=0;i<n;i++){const k=Math.min(w*0.96,t*0.9*1.25)/100;
    for(const p of mask)P.push(p.kind==='dot'?Object.assign({},p,{x:(i+.5)*w+p.x*k,y:t/2+p.y*k,r:p.r*k}):Object.assign({},p,{pts:G.xform(p.pts,{x:(i+.5)*w,y:t/2,s:k})}));}
  return P;}});

/* ---------- Attributes and companions for the deity figures ----------
   The figures themselves (Sarasvatī, Durgā, Gaṇeśa seated, Kṛṣṇa, Hanumān) and the tiger,
   peacock and lotus seat are drawn with the spline figure kit in figures.js. These helpers
   place the attributes their hands hold; the motifs below are their companions. */
function subParts(P,key,x,y,size,rot,rng,g,role){const M=SG.motifs[key];if(!M)return;
  for(const p of fitParts(M.fn(rng,g),size)){const q=Object.assign({},p,role?{role:p.role==='outer'?role:p.role}:{});
    if(p.kind==='dot'){const [c]=G.xform([[p.x,p.y]],{x,y,rot});q.x=c[0];q.y=c[1];}else q.pts=G.xform(p.pts,{x,y,rot});P.push(q);}}
const ATTR={
  conch:(x,y,s,r)=>[reg(G.xform(G.teardrop(4.2*s,11*s),{x,y,rot:r}),'outer'),ln(G.xform((()=>{const p=[];for(let i=0;i<=14;i++){const t=i/14*Math.PI*3,rr=0.4*s+t*0.38*s;p.push([Math.cos(t)*rr,Math.sin(t)*rr-1.5*s]);}return p;})(),{x,y,rot:r}),'detail')],
  chakra:(x,y,s)=>{const P=[reg(G.circle(x,y,6*s,24),'outer'),ln(G.circle(x,y,3.6*s,18),'inner',true)];for(let i=0;i<8;i++){const a=i*Math.PI/4;P.push(ln([[x+Math.cos(a)*1.2*s,y+Math.sin(a)*1.2*s],[x+Math.cos(a)*3.6*s,y+Math.sin(a)*3.6*s]],'detail'));}return P;},
  sword:(x,y,s,r)=>[reg(G.xform([[-1*s,0],[1*s,0],[0.8*s,-17*s],[0,-20*s],[-0.8*s,-17*s]],{x,y,rot:r}),'outer'),reg(G.xform(G.roundRect(-3.2*s,-0.6*s,3.2*s,1.2*s,0.5*s),{x,y,rot:r}),'outer')],
  bow:(x,y,s,r)=>[ln(G.xform(G.arc(0,0,11*s,-150,-30,18).map(([a,b])=>[a,b+6*s]),{x,y,rot:r}),'outer'),ln(G.xform([[-9.5*s,0.5*s],[9.5*s,0.5*s]],{x,y,rot:r}),'detail')],
  bell:(x,y,s)=>[reg(G.chain(G.bez([x-4*s,y+3*s],[x-4*s,y-3*s],[x-2*s,y-5*s],[x,y-5*s],8),G.bez([x,y-5*s],[x+2*s,y-5*s],[x+4*s,y-3*s],[x+4*s,y+3*s],8)),'outer'),dt(x,y+4.4*s,1.2*s,'outer'),ln([[x,y-5*s],[x,y-8*s]],'detail')],
  mala:(x,y,s)=>{const P=[];for(let i=0;i<14;i++){const a=i/14*Math.PI*2;P.push(dt(x+Math.cos(a)*4.5*s,y+5*s+Math.sin(a)*6*s,0.9*s,'outer'));}return P;},
  book:(x,y,s,r)=>[reg(G.xform(G.roundRect(-6*s,-3*s,6*s,3*s,0.8*s),{x,y,rot:r}),'outer'),ln(G.xform([[-5*s,-1*s],[5*s,-1*s]],{x,y,rot:r}),'detail'),ln(G.xform([[-5*s,1*s],[5*s,1*s]],{x,y,rot:r}),'detail')],
  goad:(x,y,s,r)=>[ln(G.xform([[0,4*s],[0,-12*s]],{x,y,rot:r}),'outer'),ln(G.xform(G.bez([0,-8*s],[4*s,-9*s],[5*s,-5*s],[2.5*s,-3.5*s],8),{x,y,rot:r}),'outer'),reg(G.xform(G.teardrop(1.2*s,5*s).map(([a,b])=>[a,b-12*s]),{x,y,rot:r}),'outer')],
  noose:(x,y,s,r)=>[ln(G.xform(G.ellipse(0,-6*s,4*s,5*s,20).concat([[0,-1*s],[1*s,6*s]]),{x,y,rot:r}),'outer')],
  lotus:(x,y,s,r,rng,g,P)=>{subParts(P,'lotusSide',x,y-4*s,12*s,r,rng,g);return[];},
  trishul:(x,y,s,r,rng,g,P)=>{subParts(P,'trishul',x,y-8*s,22*s,r,rng,g);return[];},
  gada:(x,y,s,r,rng,g,P)=>{subParts(P,'gada',x,y-7*s,20*s,r,rng,g);return[];},
  modak:(x,y,s,r,rng,g,P)=>{subParts(P,'modak',x,y-2*s,9*s,0,rng,g);return[];}
};
function attr(P,kind,x,y,s,r,rng,g){const f=ATTR[kind];if(!f)return;const out=f(x,y,s,r||0,rng,g,P);if(out)P.push(...out);}
// an arm as a tapered ribbon through shoulder → elbow → hand, with bangles and a hand
defMotif('tiger',{name:'Tiger',term:'vyāghra',meaning:'Durgā\'s mount and a royal emblem; drawn striped and side-on, head turned to the viewer.',
fn(rng,g){const P=[];FK.tiger(P,0,0,1);return fitParts(P);}});
defMotif('kuthuvilakku',{name:'Standing lamp',term:'kuthuvilakku / samai',meaning:'The tall brass oil lamp of south Indian homes and temples: a domed foot, a knotted stem, a bowl ringed with wicks, a bird or finial on top.',
fn(rng,g){const P=[];
  P.push(reg(G.chain(G.bez([-16,50],[-15,40],[-6,36],[-3,34],10),[[3,34]],G.bez([3,34],[6,36],[15,40],[16,50],10)),'outer'));
  P.push(reg(G.roundRect(-1.8,-18,1.8,34,1.5),'outer'));for(const y of [24,8,-6])P.push(reg(G.ellipse(0,y,4.2,2.2,16),'outer'));
  P.push(reg(G.chain(G.bez([-17,-20],[-14,-14],[14,-14],[17,-20],12)),'outer'));P.push(ln(G.quad([-17,-20],[0,-23],[17,-20]),'inner'));
  for(const x of [-14,-7,0,7,14]){P.push(reg(G.xform(G.teardrop(2.2,9),{x,y:-22}),'outer'));P.push(reg(G.xform(G.teardrop(1,4.6),{x,y:-22}),'inner'));}
  P.push(reg(G.roundRect(-1.4,-40,1.4,-24,1),'outer'));P.push(reg(G.xform(G.teardrop(3.2,10),{y:-40}),'outer'));P.push(dt(0,-52,1.6,'outer'));
  return fitParts(P);}});
defMotif('chattra',{name:'Parasol',term:'chattra',meaning:'The royal parasol held over a deity: sovereignty and protection.',
fn(rng,g){const P=[];P.push(reg(G.roundRect(-1.2,-6,1.2,10,1),'outer'));
  P.push(reg(G.chain(G.arc(0,-2,40,180,360,40)),'outer'));for(let k=-3;k<=3;k++)P.push(ln([[0,-38],[k*11,-2]],'detail'));
  const sc=[];for(let i=0;i<=16;i++){const x=-40+i*5;sc.push([x,i%2?3.5:-2]);}P.push(ln(sc,'inner'));for(let i=0;i<8;i++)P.push(dt(-35+i*10,6,1.3,'outer'));
  P.push(reg(G.xform(G.teardrop(3,10),{y:-42}),'outer'));return fitParts(P);}});
defMotif('foliageScroll',{name:'Foliage scroll',term:'—',meaning:'The lush curling leaf-and-flame scroll that fills corners and borders of Kerala murals — a stem winding inward, sprouting pointed, curling leaves at every turn.',
fn(rng,g){const P=[];const c=[];for(let i=0;i<=80;i++){const u=i/80,th=u*Math.PI*2.6,r=46*(1-0.78*u);c.push([Math.cos(th+Math.PI)*r+8,Math.sin(th+Math.PI)*r*0.86]);}
  P.push(reg(G.ribbon(c,t=>3.6*(1-0.75*t)+0.4),'outer'));
  for(let i=4;i<c.length-6;i+=5){const a=c[i],b=c[i+1];const ang=Math.atan2(b[1]-a[1],b[0]-a[0])/DEG;const len=22*(1-i/c.length)+7;
    P.push(reg(G.xform(G.petal(len,len*0.3,'drop'),{x:a[0],y:a[1],rot:ang+(i%10<5?-70:-110)}),'outer'));
    P.push(ln(G.xform([[0,-2],[0,-len*0.7]],{x:a[0],y:a[1],rot:ang+(i%10<5?-70:-110)}),'detail'));}
  return fitParts(P);}});
