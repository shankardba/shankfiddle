'use strict';
/* Polynesia beyond Aotearoa — barkcloth, quilts and carving. (Māori art has its own
   family and its own file, koru.js.)

   BARKCLOTH. Beaten paper-mulberry bark, patterned three ways.
   Samoan SIAPO MAMANU is painted freehand: the cloth is ruled into squares and each
   square takes one of a small stock of designs, in brown, black and red earth.
   Tongan NGATU is rubbed over a pattern board (kupesi) laid under the cloth, so one
   design repeats along a row; rows run the width of the cloth, each with its own kupesi.
   Hawaiian KAPA was printed with carved bamboo stamps a finger wide ('ohe kāpala), so
   its patterns are narrow bands of very small, very exact repeats.
   Here a siapo is a rule from square (i, j) to a panel, a ngatu a rule from row to a
   kupesi, a kapa a stack of stamped bands.

   HAWAIIAN QUILTS. A square of cloth is folded in eighths and cut like a paper
   snowflake, opened, and sewn to a ground of another colour; then lines of quilting
   follow its outline outward like ripples. The appliqué here is built with the eight
   symmetries of the square. The echo lines are true contours: the design is sampled on a
   grid, the distance from it computed, and lines drawn where that distance is 1, 2, 3 …
   steps.

   MARQUESAN CARVING fills a surface with compartments, each holding one sign: the
   wide-eyed face, the human figure, the turtle.

   Tatau, the tattooing of Samoa, the Marquesas and Hawaiʻi, uses this same vocabulary
   and is not generated: it is earned and given, and belongs on the body.
   All constructions are original; none traces a reference image. */

const MO={};
const [moBR,moBK,moRD,moTN,moOR,moYL]=[0,1,2,3,4,5];
const moN=(pts,ci,z=0)=>({kind:'region',closed:true,role:'detail',ci,plain:true,ns:SG.cov!==false,z,pts});
const moR=(pts,ci,z=0,role='inner')=>({kind:'region',closed:true,role,ci,plain:true,z,pts});
const moB=(pts,z=1)=>({kind:'region',closed:true,role:'inner',bg:true,ns:true,plain:true,z,pts});
const moL=(pts,z=6,role='detail',closed=false)=>({kind:'line',role,closed,pts,z});
const moFit=(P,s=94)=>fitParts(FL.done(P),s);
const moRect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const moAt=(parts,x,y,s)=>parts.map(p=>Object.assign({},p,{pts:p.pts.map(([a,b])=>[x+a*s,y+b*s])}));
const moLens=(a,b,w)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*w,ny=dx/l*w,m=[(a[0]+b[0])/2,(a[1]+b[1])/2];return G.chain(G.quad(a,[m[0]+nx,m[1]+ny],b,8),G.quad(b,[m[0]-nx,m[1]-ny],a,8)).slice(0,-1);};

/* ================= siapo: panels in the unit square ================= */
MO.PANEL={
  aveau(){const P=[],c=[.5,.5];for(let i=0;i<8;i++){const a=i*45*DEG,r=i%2?0.56:0.44,e=[.5+Math.cos(a)*r,.5+Math.sin(a)*r];P.push(moN(moLens(c,e,i%2?0.07:0.1),i%2?moRD:moBR));}
    P.push(moN(G.circle(.5,.5,.07,12),moBK));for(const [x,y] of [[.5,.07],[.93,.5],[.5,.93],[.07,.5]])P.push(moN(G.circle(x,y,.03,8),moBK));return P;},
  aliao(){const P=[],n=4,s=1/n;for(let j=0;j<n;j++)for(let i=0;i<n;i++){const x=i*s,y=j*s+s*0.1;P.push(moN([[x+s*0.06,y+s*0.8],[x+s*0.94,y+s*0.8],[x+s/2,y]],j%2?moBK:moBR));}return P;},
  paogo(){const P=[moL([[0,1],[1,0]],1,'inner')];for(let k=1;k<=4;k++){const d=k*0.19;for(const s of [-1,1]){const a=[0.06+(s>0?d:0),0.94-(s>0?0:d)],b=[0.94-(s>0?0:d),0.06+(s>0?d:0)];
      const A=s>0?[d+0.04,0.96]:[0.04,0.96-d],B=s>0?[0.96,d+0.04]:[0.96-d,0.04];P.push(moN(moLens(A,B,0.05),k%2?moBR:moRD));}}return P;},
  upega(){const P=[];for(let k=-4;k<=4;k++){const d=k*0.2;for(const pts of [[[0,d],[1,1+d]],[[0,1-d],[1,-d]]]){const c=clipSeg(pts,{x0:0.03,y0:0.03,x1:0.97,y1:0.97});if(c)P.push(moL(c,0,'inner'));}}
    for(let j=0;j<=5;j++)for(let i=0;i<=5;i++)if((i+j)%2===0){const x=i*0.2,y=j*0.2;if(x>0.05&&x<0.95&&y>0.05&&y<0.95)P.push(moN(G.circle(x,y,0.028,6),moBK));}return P;},
  masina(){const P=[moN(G.circle(.5,.5,.36,40),moBR),moB(G.circle(.5,.5,.27,32)),moN(G.circle(.5,.5,.16,24),moRD)];for(const [x,y,a,b] of [[0,0,1,1],[1,0,-1,1],[1,1,-1,-1],[0,1,1,-1]])P.push(moN([[x,y],[x+a*.3,y],[x,y+b*.3]],moBK));return P;},
  sigano(){const P=[];for(let i=0;i<4;i++){const a=(i*90+45)*DEG,m=[.5+Math.cos(a)*.24,.5+Math.sin(a)*.24],t=[Math.cos(a),Math.sin(a)],n=[-t[1],t[0]];P.push(moN([[.5,.5],[m[0]+n[0]*.13,m[1]+n[1]*.13],[.5+t[0]*.5,.5+t[1]*.5],[m[0]-n[0]*.13,m[1]-n[1]*.13]],i%2?moRD:moBR));}
    for(const [x,y,a0] of [[.5,0,0],[1,.5,90],[.5,1,180],[0,.5,270]])P.push(moN(G.arc(x,y,.17,a0,a0+180,10),moBK));P.push(moN(G.circle(.5,.5,.05,10),moBK));return P;}
};
MO.PANELS=Object.keys(MO.PANEL);
MO.panel=(k,x,y,s)=>moAt(MO.PANEL[k](),x,y,s).concat([moL(moRect(x,y,x+s,y+s),0,'outer',true)]);
defTile('siapoMamanu',{name:'Siapo squares',term:'siapo mamanu',meaning:'Samoan barkcloth ruled into squares and painted freehand, each square with one design from a small stock: the starfish, the trochus shell, pandanus leaves, the net, the moon, the pandanus bloom. The maker chooses how they fall; no two cloths agree.',
fn(W,H,u){const s=u*1.9,T=[[0,1,2,1],[1,3,4,3],[2,4,5,4],[1,3,4,3]],P=[];for(let j=0;j*s<H;j++)for(let i=0;i*s<W;i++)P.push(...MO.panel(MO.PANELS[T[j%4][i%4]],i*s,j*s,s));return P;}});
for(const [k,name,term,meaning] of [['aveau','Starfish','faʻa ʻaveau','Eight arms about a centre. One of the named designs of Samoan barkcloth, all of them taken from the shore and the garden.'],['aliao','Trochus shell','faʻa ʻaliʻao','Small triangles in ranks: the spire of the trochus shell. The same triangles run through Samoan tattooing, mats and carving.'],['paogo','Pandanus leaves','faʻa lau paogo','Long blades laid side by side on a slant: the leaves of the pandanus, from which mats are plaited.'],['masina','Moon','faʻa masina','A ring with a heart: the moon.'],['sigano','Pandanus bloom','faʻa sigano','Four petals about a centre: the scented male flower of the pandanus, worn and given.']])
  defMotif('sp'+k[0].toUpperCase()+k.slice(1),{name,term,meaning,fn(){return fitParts(MO.panel(k,-45,-45,90),92);}});

/* ================= ngatu: kupesi along a row ================= */
MO.KUPESI={
  manulua(){const P=[],c=[.5,.5];for(const [a,b] of [[[0,0],[.5,0]],[[1,0],[1,.5]],[[1,1],[.5,1]],[[0,1],[0,.5]]])P.push(moN([c,a,b],moBR));P.push(moL([[0,0],[1,1]],0),moL([[1,0],[0,1]],0));return P;},
  paini(){const P=[moN(moRect(.45,.62,.55,.94),moBK)];for(const [y,w] of [[.62,.34],[.44,.27],[.27,.2]])P.push(moN([[.5-w,y],[.5+w,y],[.5,y-.22]],moBK));P.push(moN(G.circle(.06,.86,.035,6),moRD),moN(G.circle(.94,.86,.035,6),moRD));return P;},
  tokelau(){const P=[];for(const x of [0,.5]){P.push(moN([[x,.06],[x+.5,.06],[x+.25,.46]],moRD),moN([[x,.94],[x+.5,.94],[x+.25,.54]],moRD),moN([[x+.25,.5-.1],[x+.33,.5],[x+.25,.5+.1],[x+.17,.5]],moBK));}return P;},
  fata(){const P=[moN(G.band([[.04,.1],[.96,.9]],.11),moBR),moN(G.band([[.04,.9],[.96,.1]],.11),moBR),moN([[.5,.33],[.66,.5],[.5,.67],[.34,.5]],moBK)];for(const y of [.06,.94])P.push(moN(moRect(0,y-.035,1,y+.035),moBR));return P;}
};
defTile('ngatuKupesi',{name:'Ngatu rows',term:'ngatu · kupesi',meaning:'Tongan barkcloth, patterned by rubbing dye over a raised design board laid underneath, a row at a time. Each row carries one design: the pair of birds, the road of pines, the triangles named for Tokelau, the lashings of the royal house. Lines and dots between the rows are added by hand.',
fn(W,H,u){const h=u*1.7,ord=['manulua','paini','tokelau','fata'],P=[];for(let j=0;j*h<H;j++){const k=ord[j%4],y=j*h+h*0.12,s=h*0.76,w=k==='paini'?s*0.8:s;for(let i=0;i*w<W+w;i++)P.push(...moAt(MO.KUPESI[k](),i*w,y,k==='paini'?s*0.8:s).map(p=>k==='paini'?Object.assign(p,{pts:p.pts.map(([a,b])=>[a,y+(b-y)*1.25])}):p));
    P.push(moL([[0,j*h+h*0.04],[W,j*h+h*0.04]],0,'outer'),moL([[0,j*h+h*0.09],[W,j*h+h*0.09]],0,'inner'));for(let x=h*0.1;x<W;x+=h*0.16)P.push(moN(G.circle(x,j*h+h*0.065,h*0.012,5),moBK));}return P;}});
for(const [k,name,term,meaning] of [['manulua','Two birds','manulua','Four triangles turning about a point, read as two birds flying beak to beak: a chiefly design, said to mark descent from two noble lines.'],['paini','Road of pines','hala paini','A row of Norfolk pines: the avenue leading to the royal palace at Nukuʻalofa. A design of the nineteenth century that became one of the best known.'],['tokelau','Tokelau feletoa','tokelau feletoa','Triangles set point to point with a lozenge between, named for a fortress in Vavaʻu. Among the oldest designs on Tongan cloth.'],['fata','Royal lashing','fata ʻo Tuʻi Tonga','Crossed bands with a lozenge at the meeting: the sennit lashing of the central beam of the Tuʻi Tonga’s house.']])
  defMotif('ng'+k[0].toUpperCase()+k.slice(1),{name,term,meaning,fn(){return fitParts(moAt(MO.KUPESI[k](),-45,-45,90).concat([moL(moRect(-45,-45,45,45),0,'outer',true)]),92);}});

/* ================= kapa: bamboo-stamp bands ================= */
const moStamp=(L,t,w,f)=>{const n=Math.max(1,Math.round(L/w)),u=L/n,P=[];for(let i=0;i<n;i++)P.push(...f(i*u,u));return P.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));};
defBorder('okNiho',{name:'Shark teeth',fn(L,t){return moStamp(L,t,t*0.34,(x,u)=>[moN([[x,t*0.08],[x+u,t*0.08],[x+u/2,t*0.47]],moBK),moN([[x+u/2,t*0.53],[x+u*1.5,t*0.53],[x+u,t*0.92]].map(([a,b])=>[Math.min(L,a),b]),moBK)]);}});
defBorder('okChevron',{name:'Stamped chevrons',fn(L,t){return moStamp(L,t,t*0.5,(x,u)=>[0.1,0.3,0.5].map(o=>moN(G.band([[x,t*(o+0.38)],[x+u/2,t*o],[x+u,t*(o+0.38)]],t*0.07),moBK)));}});
defBorder('okNet',{name:'Net eyes',fn(L,t){return moStamp(L,t,t*0.62,(x,u)=>[moN(G.band([[x,t/2],[x+u/2,t*0.1],[x+u,t/2],[x+u/2,t*0.9],[x,t/2]],t*0.07),moBK),moN([[x+u/2,t*0.34],[x+u*0.7,t/2],[x+u/2,t*0.66],[x+u*0.3,t/2]],moBK)]);}});
defBorder('okLines',{name:'Ruled lines',fn(L,t){const P=[];for(const y of [0.14,0.3,0.7,0.86])P.push(moN(moRect(0,t*(y-0.03),L,t*(y+0.03)),moBK));return P.concat(moStamp(L,t,t*0.3,(x,u)=>[moN(moRect(x+u*0.2,t*0.44,x+u*0.8,t*0.56),moBK)]));}});
defBorder('okZigzag',{name:'Stamped zigzag',fn(L,t){return moStamp(L,t,t*0.44,(x,u)=>[moN(G.band([[x,t*0.78],[x+u/2,t*0.22],[x+u,t*0.78]],t*0.09),moBK),moN(G.circle(x+u/2,t*0.74,t*0.05,6),moBK),moN(G.circle(x+u,t*0.26,t*0.05,6).map(([a,b])=>[Math.min(L,a),b]),moBK)]);}});

/* ================= Hawaiian quilts ================= */
// a lobed leaf (breadfruit): base at the origin, tip `len` up, `n` lobes a side
MO.ulu=(len,W,n=4)=>{const L=[],R=[];for(let i=0;i<=26;i++){const t=i/26,hw=W*Math.pow(Math.sin(Math.PI*clamp(0.03+0.95*t)),0.7)*(0.5+0.5*Math.pow(Math.abs(Math.sin(Math.PI*t*n)),0.6))+len*0.016;L.push([-hw,-len*t]);R.push([hw,-len*t]);}return L.concat(R.reverse());};
// lines at 1, 2, 3 … steps from a set of filled shapes: sampled on a grid, distance by two chamfer passes, contours by marching squares
MO.echo=(parts,n=7,gap=4.6,ext=86,N=172)=>{const c=2*ext/N,M=N+1,D=new Array(M*M).fill(1e6),R=parts.filter(p=>p.kind==='region'&&!p.bg).map(p=>({pts:p.pts,b:G.bbox(p.pts)}));
  for(let j=0;j<M;j++)for(let i=0;i<M;i++){const x=-ext+i*c,y=-ext+j*c;for(const r of R)if(x>=r.b.x0&&x<=r.b.x1&&y>=r.b.y0&&y<=r.b.y1&&G.inside(x,y,r.pts)){D[j*M+i]=0;break;}}
  const rel=(j,i,dj,di,w)=>{const jj=j+dj,ii=i+di;if(jj<0||ii<0||jj>=M||ii>=M)return;const v=D[jj*M+ii]+w;if(v<D[j*M+i])D[j*M+i]=v;};
  for(let j=0;j<M;j++)for(let i=0;i<M;i++){rel(j,i,0,-1,1);rel(j,i,-1,0,1);rel(j,i,-1,-1,1.414);rel(j,i,-1,1,1.414);}
  for(let j=M-1;j>=0;j--)for(let i=M-1;i>=0;i--){rel(j,i,0,1,1);rel(j,i,1,0,1);rel(j,i,1,1,1.414);rel(j,i,1,-1,1.414);}
  const out=[];for(let k=1;k<=n;k++){const lv=k*gap/c,seg=[],E=(a,b,pa,pb)=>{const t=(lv-a)/(b-a);return[pa[0]+(pb[0]-pa[0])*t,pa[1]+(pb[1]-pa[1])*t];};
    for(let j=0;j<N;j++)for(let i=0;i<N;i++){const v=[D[j*M+i],D[j*M+i+1],D[(j+1)*M+i+1],D[(j+1)*M+i]],q=[[i,j],[i+1,j],[i+1,j+1],[i,j+1]],pts=[];
      for(let e=0;e<4;e++){const a=v[e],b=v[(e+1)%4];if((a<lv)!==(b<lv))pts.push(E(a,b,q[e],q[(e+1)%4]));}
      if(pts.length===2)seg.push(pts);else if(pts.length===4)seg.push([pts[0],pts[1]],[pts[2],pts[3]]);}
    // chain the segments into polylines
    const key=p=>Math.round(p[0]*8)+','+Math.round(p[1]*8),at={};seg.forEach((s,ix)=>{for(const p of s)(at[key(p)]=at[key(p)]||[]).push(ix);});const used=new Array(seg.length).fill(0);
    for(let s0=0;s0<seg.length;s0++){if(used[s0])continue;used[s0]=1;const line=[seg[s0][0],seg[s0][1]];
      for(const fwd of [true,false]){for(;;){const tip=fwd?line[line.length-1]:line[0],nx=(at[key(tip)]||[]).find(ix=>!used[ix]);if(nx==null)break;used[nx]=1;const s=seg[nx],o=key(s[0])===key(tip)?s[1]:s[0];if(fwd)line.push(o);else line.unshift(o);}}
      if(line.length>12)out.push(G.chaikin(line.filter((q,ix)=>ix%7===0||ix===line.length-1).map(([x,y])=>[-ext+x*c,-ext+y*c]),false,1));}}
  return out;};
MO.cache={};
MO.quilt=(key,build)=>{if(!MO.cache[key]){const A=FL.done(build()),b=G.bbox(A.flatMap(p=>p.pts)),k=96/Math.max(b.w,b.h),f=([x,y])=>[(x-b.cx)*k,(y-b.cy)*k];MO.cache[key]={A:A.map(p=>Object.assign({},p,{pts:p.pts.map(f)})),E:MO.echo(A).map(l=>l.map(f))};}
  const {A,E}=MO.cache[key];return E.map(l=>Object.assign(moL(l,-5),{noSeed:true})).concat(A.map(p=>Object.assign({},p,{ns:SG.cov!==false})));};
const mo8=f=>{const P=[];for(let i=0;i<4;i++)P.push(...f(i*90));return P;};
defMotif('hqUlu',{name:'Breadfruit quilt',term:'kapa kuiki · ʻulu',meaning:'The breadfruit pattern, by custom the first quilt a Hawaiian quilter makes: whoever makes it will never go hungry, and will go on to make many more. Lobed leaves and round fruit on eight branches, cut in one piece from cloth folded in eighths.',
fn(){return (MO.quilt('ulu',()=>{const P=[moN(G.circle(0,0,7.4,24),moBR,0)];
  P.push(...mo8(a=>{const Q=[moN(G.xform(moRect(-1.7,-31,1.7,-4),{rot:a+45}),moBR),moN(G.xform(MO.ulu(26,9.6,4),{rot:a+45}).map(([x,y])=>{const d=slDir(a+45);return[x+d[0]*27,y+d[1]*27];}),moBR)];
    for(const s of [-1,1]){const d=slDir(a+45);Q.push(moN(G.xform(MO.ulu(15,6,3),{x:d[0]*15,y:d[1]*15,rot:a+45+s*62}),moBR));}
    const e=slDir(a);Q.push(moN(G.xform(moRect(-1.4,-24,1.4,-4),{rot:a}),moBR),moN(G.circle(e[0]*28.6,e[1]*28.6,6.4,22),moBR));for(const s of [-1,1])Q.push(moN(G.xform(MO.ulu(10.4,4.2,2),{x:e[0]*13,y:e[1]*13,rot:a+s*52}),moBR));
    for(const [dx,dy] of [[0,0],[2.4,1.4],[-2.4,1.4],[0,-2.6]]){const r=G.xform([[dx,-28.6+dy]],{rot:a})[0];Q.push(moB(G.circle(r[0],r[1],0.8,6),2));}return Q;}));
  P.push(moB(G.circle(0,0,3,14),2));return P;}));}});
defMotif('hqHala',{name:'Pineapple quilt',term:'kapa kuiki · hala kahiki',meaning:'Pineapples on four branches with their crowns outward, and a fan of leaves between. Quilters took their patterns from what grew at the door, and a pattern, once made, belonged to its maker: to copy it without being given it was theft.',
fn(){return (MO.quilt('hala',()=>{const P=[moN(G.circle(0,0,8.4,24),moBR,0),moB(G.circle(0,0,3.6,14),2)];
  P.push(...mo8(a=>{const Q=[],T=pts=>G.xform(pts,{rot:a+45}),e=slDir(a);
    Q.push(moN(T(moRect(-1.6,-18,1.6,-5)),moBR),moN(T(G.ellipse(0,-27,7.6,11,30)),moBR));
    for(const r of [-56,-28,0,28,56])Q.push(moN(T(G.xform(G.petal(13,2.6,'pointed'),{y:-36,rot:r})),moBR));for(const r of [-118,118])Q.push(moN(T(G.xform(G.petal(9,2.4,'pointed'),{y:-17,rot:r})),moBR));
    for(const k of [-1,0,1]){Q.push(moB(T(G.band([[-6.6,-27+k*5.4-4],[6.6,-27+k*5.4+4]],0.9)),2),moB(T(G.band([[-6.6,-27+k*5.4+4],[6.6,-27+k*5.4-4]],0.9)),2));}
    Q.push(moN(G.xform(moRect(-1.3,-16,1.3,-5),{rot:a}),moBR));for(const r of [-40,-20,0,20,40])Q.push(moN(G.xform(G.petal(15,2.8,'pointed'),{x:e[0]*14,y:e[1]*14,rot:a+r}),moBR));return Q;}));return P;}));}});
defBorder('hqLei',{name:'Lei border',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.5))),w=L/n,s=[],P=[];for(let i=0;i<=n*16;i++){const x=i/(n*16)*L;s.push([x,t/2+t*0.14*Math.sin(x/w*Math.PI*2)]);}P.push(moN(G.band(s,t*0.08),moBR));
  for(let i=0;i<n;i++){P.push(moN(G.xform(MO.ulu(t*0.4,t*0.15,2),{x:(i+0.25)*w,y:t*0.6,rot:20}),moBR),moN(G.xform(MO.ulu(t*0.4,t*0.15,2),{x:(i+0.75)*w,y:t*0.4,rot:200}),moBR));}
  return P.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));}});

/* ================= Marquesan carving ================= */
const mqArc=(cx,cy,rx,ry,a0,a1,n=18)=>{const p=[];for(let i=0;i<=n;i++){const a=(a0+(a1-a0)*i/n)*DEG;p.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)]);}return p;};
const mqSp=(x,y,r,a0,dir=1,t=1.4)=>{const s=[];for(let i=0;i<=22;i++){const u=i/22,a=(a0+dir*u*t*360)*DEG,rr=r*(1-0.8*u);s.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}return s;};
defMotif('mqTiki',{name:'Tiki face',term:'tiki · mata',meaning:'The face that looks out of all Marquesan carving: enormous ringed eyes under arched brows, a flat nose with spiral nostrils, a mouth as wide as the head with the tongue lying in it. Tiki was the first man; a tiki figure stands for a deified ancestor, and the wide eyes see what the living cannot.',
fn(){const P=[moR(G.roundRect(-40,-44,40,44,14,5),moTN,0,'outer')];
  for(const s of [-1,1]){P.push(moR(G.ellipse(s*19,-13,16.6,14,36),moBR,1),moB(G.ellipse(s*19,-13,12.4,10,30),2),moR(G.ellipse(s*19,-13,8,5.6,24),moBR,3),moB(G.ellipse(s*19,-13,3.4,1.5,12),4));
    P.push(moL(mqArc(s*19,-13,20.6,18,s>0?200:-20,s>0?350:-170,18),5,'outer'),moL(mqSp(s*39,3,5.4,s>0?180:0,s),5,'inner'),moL(mqSp(s*6,9,4.4,s>0?0:180,-s),5,'inner'));}
  P.push(moL([[-3.4,-26],[-3.4,4],[-11,10]],5,'inner'),moL([[3.4,-26],[3.4,4],[11,10]],5,'inner'));
  P.push(moR(G.roundRect(-31,19,31,37,9,5),moBR,1),moB(G.roundRect(-26.4,23,26.4,33,5,4),2),moR(G.roundRect(-18,26,18,30,2,3),moBR,3));for(let i=-4;i<=4;i++)P.push(moL([[i*5.6,19.6],[i*5.6,23]],5));return moFit(P,94);}});
defMotif('mqMata',{name:'Brilliant eye',term:'mata hoata',meaning:'An eye within rings, with the brow curling away from it: the face reduced to what matters in it. Mata hoata, clear or shining eyes, is among the commonest signs in Marquesan design and is read as protection, the ancestors watching.',
fn(){const P=[moR(G.ellipse(-4,4,31,24,48),moBR,0,'outer'),moB(G.ellipse(-4,4,25,18.4,40),1),moR(G.ellipse(-4,4,18,12,32),moBR,2),moB(G.ellipse(-4,4,11,6.4,24),3),moR(G.ellipse(-4,4,5.4,3,16),moBR,4)];
  P.push(moR(G.ribbon(G.resample(G.chain(mqArc(-4,4,38,31,205,330,20),mqSp(36,-4,9,200,1,1.2)),false,2),t=>3.4*(1-0.6*t)+0.5),moBR,0));for(let i=0;i<7;i++){const a=(200+i*20)*DEG;P.push(moL([[-4+Math.cos(a)*33,4+Math.sin(a)*26],[-4+Math.cos(a)*38,4+Math.sin(a)*31]],5));}return moFit(P,94);}});
defMotif('mqEnata',{name:'Human figure',term:'ʻenata',upright:true,meaning:'A person, arms raised and knees bent. ʻEnata is also what the Marquesans call themselves: Te Henua ʻEnata, the land of people. In rows, hand to hand, the sign is a family or a line of descent; upside down, an enemy overcome.',
fn(){const P=[moR(G.roundRect(-8,-44,8,-28,6,4),moBR,0,'outer'),moB(G.circle(-3.2,-37,1.5,8),1),moB(G.circle(3.2,-37,1.5,8),1),moR(moRect(-9,-25,9,8),moBR,0,'outer')];
  for(const s of [-1,1])P.push(moR(G.band([[s*9,-20],[s*24,-20],[s*24,-40]],6),moBR,0,'outer'),moR(moRect(s*20,-46,s*28,-40),moBR,0),moR(G.band([[s*6,8],[s*22,14],[s*22,36]],6.4),moBR,0,'outer'),moR(moRect(s*18,36,s*30,42),moBR,0));
  P.push(moB(moRect(-4,-19,4,-13),1),moB(moRect(-4,-7,4,-1),1));return moFit(P,94);}});
defMotif('mqHonu',{name:'Turtle',term:'honu',meaning:'The sea turtle seen from above. It crosses between the land and the deep and so between the living and the dead; it is long life, and the food of chiefs.',
fn(){const P=[];for(const [x,y,r] of [[-26,-22,-50],[26,-22,50],[-22,24,-130],[22,24,130]])P.push(moR(G.xform(G.chaikin([[-5,0],[-8,-16],[0,-25],[7,-15],[5,0]],true,2),{x,y,rot:r}),moBR,0,'outer'));
  P.push(moR(G.chaikin([[-6,-34],[0,-48],[6,-34],[4,-28],[-4,-28]],true,2),moBR,0,'outer'),moR([[-3,36],[3,36],[0,47]],moBR,0),moR(G.ellipse(0,2,26,34,44),moBR,1,'outer'),moB(G.ellipse(0,2,21,29,40),2));
  P.push(moR([[0,-18],[13,2],[0,22],[-13,2]],moBR,3),moB([[0,-9],[6.4,2],[0,13],[-6.4,2]],4));for(const [a,b] of [[[0,-27],[0,-18]],[[0,22],[0,31]],[[-21,2],[-13,2]],[[13,2],[21,2]],[[-15,-18],[-7,-9]],[[15,-18],[7,-9]],[[-15,22],[-7,13]],[[15,22],[7,13]]])P.push(moL([a,b],5,'inner'));return moFit(P,94);}});
defBorder('mqNiho',{name:'Teeth and hatching',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.5))),w=L/n,P=[];for(let i=0;i<n;i++){P.push(moN([[i*w,t*0.5],[(i+1)*w,t*0.5],[(i+.5)*w,t*0.08]],moBR));for(let k=1;k<4;k++)P.push(moL([[i*w+k*w/4,t*0.58],[i*w+k*w/4,t*0.92]],0));}
  P.push(moL([[0,t*0.54],[L,t*0.54]],0,'outer'),moL([[0,t*0.96],[L,t*0.96]],0,'outer'));return P;}});
defBorder('mqKohau',{name:'Hooked band',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.1))),w=L/n,P=[];for(let i=0;i<n;i++){const up=i%2===0;P.push(moN(G.ribbon(G.resample(mqSp((i+.5)*w,t/2,t*0.36,up?90:270,up?1:-1,1.15),false,2),u=>t*0.07*(1-0.5*u)),moBR));}
  P.push(moL([[0,t*0.06],[L,t*0.06]],0,'outer'),moL([[0,t*0.94],[L,t*0.94]],0,'outer'));return P.map(p=>Object.assign({},p,{pts:p.pts.map(([x,y])=>[clamp(x,0,L),clamp(y,0,t)])}));}});

/* ================= layouts ================= */
const moTile=(g,want)=>{const p=poolAll(g.motifs.tile).filter(k=>SG.tiles[k]);return p.includes(want)?want:(p[0]||want);};
const moRag=(x0,y0,x1,y1,rng,k=5)=>{const p=[],e=(a,b,n)=>{for(let i=0;i<n;i++){const t=i/n;p.push([lerp(a[0],b[0],t)+rng.range(-k,k)*(i?1:0.3),lerp(a[1],b[1],t)+rng.range(-k,k)*(i?1:0.3)]);}};e([x0,y0],[x1,y0],14);e([x1,y0],[x1,y1],14);e([x1,y1],[x0,y1],14);e([x0,y1],[x0,y0],14);return G.chaikin(p,true,2);};
/* Barkcloth: a sheet with a beaten, uneven edge, patterned from side to side. */
defStructure('tapa',{name:'Barkcloth',blurb:'A sheet of beaten bark with an uneven edge, patterned all over: in squares, each with its own design, or in rows, each with one design repeated, inside a plain painted margin.',
fn(ctx){
  const {W,H,g,rng}=ctx,S=g.structure,x0=44,y0=44,x1=W-44,y1=H-44,m=26,key=moTile(g,'siapoMamanu'),r={x0:x0+m,y0:y0+m,x1:x1-m,y1:y1-m},n=clamp(S.density)>0.65?6:5;
  ctx.parts([{kind:'region',closed:true,role:'outer',bg:true,plain:true,pts:moRag(x0-8,y0-8,x1+8,y1+8,rng)},moN(moRect(x0,y0,x1,y1),moBR)],'frame');
  ctx.items.push({type:'parts',parts:[moB(moRect(r.x0,r.y0,r.x1,r.y1),0)].concat(tileParts(key,r,(r.x1-r.x0)/n/(key==='siapoMamanu'?1.9:1.7)+0.01,rng.fork('t'),g)),role:'frame',variant:'cloth'});
  ctx.parts([moL(moRect(r.x0,r.y0,r.x1,r.y1),0,'outer',true)],'frame');
}});
/* Kapa: bands of bamboo-stamp printing across a pale sheet. */
defStructure('kapa',{name:'Stamped kapa',blurb:'A pale sheet printed in bands with small bamboo stamps: each band one tiny figure repeated edge to edge, the bands by turns black and red, with clear cloth between.',
fn(ctx){
  const {W,H,g,rng}=ctx,x0=50,x1=W-50,y0=50,y1=H-50,keys=rng.shuffle([...new Set(poolAll(g.motifs.border))].filter(k=>SG.borders[k])),K=keys.length?keys:['lines'];
  ctx.parts([{kind:'region',closed:true,role:'outer',bg:true,plain:true,pts:moRag(x0-10,y0-10,x1+10,y1+10,rng,4)}],'frame');
  let y=y0+10,i=0;while(y<y1-40){const big=i%3===1,t=big?rng.range(52,66):rng.range(24,34),key=K[i%K.length];if(y+t>y1-8)break;
    const P=SG.borders[key].fn(x1-x0-20,t).map(p=>p.kind==='dot'?Object.assign({},p,{x:p.x+x0+10,y:p.y+y}):Object.assign({},p,{pts:p.pts.map(([a,b])=>[a+x0+10,b+y])}));
    ctx.items.push({type:'parts',parts:P,role:'border',variant:'band'+i,ciShift:i%2});
    ctx.parts([moL([[x0+10,y-4],[x1-10,y-4]],0,'inner'),moL([[x0+10,y+t+4],[x1-10,y+t+4]],0,'inner')],'frame');y+=t+rng.range(16,30);i++;}
}});
/* Hawaiian quilt: one appliqué opened out over the middle, a lei round the edge. */
defStructure('kapaKuiki',{name:'Hawaiian quilt',blurb:'A square quilt: one eight-fold design cut from folded cloth and laid on a ground of another colour, a border round the edge, and quilting that follows the outline outward in ripples.',
fn(ctx){
  const {W,H,g,rng}=ctx,S=g.structure,s=Math.min(W,H)-70,x0=(W-s)/2,y0=(H-s)/2,r=frameBands(ctx,{x0,y0,x1:x0+s,y1:y0+s},1,s*0.085),cx=W/2,cy=H/2,iw=r.x1-r.x0,P=[];
  for(let k=1;k<=3;k++)P.push(Object.assign(moL(moRect(r.x0+k*9,r.y0+k*9,r.x1-k*9,r.y1-k*9),0,'detail',true),{noSeed:true}));ctx.parts(P,'frame');
  const hk=ctx.pick('hero');ctx.motif(hk,cx,cy,iw*(/^hq/.test(hk)?0.56:0.8),{role:'hero',variant:'hero'});
}});
/* Marquesan panel: a carved board cut into compartments, one sign in each. */
defStructure('mqPanel',{name:'Carved compartments',blurb:'A carved board divided into compartments by raised bands: the wide-eyed face largest in the middle, figures, turtles and eyes around it, every edge toothed or hatched.',
fn(ctx){
  const {W,H,g,rng}=ctx,r=frameBands(ctx,{x0:36,y0:36,x1:W-36,y1:H-36},1,40),w=r.x1-r.x0,h=r.y1-r.y0,X=u=>r.x0+u*w,Y=v=>r.y0+v*h,P=[],gp=7;
  const cells=[[0.27,0.24,0.73,0.76,'h'],[0,0,0.27,0.34],[0,0.34,0.27,0.66],[0,0.66,0.27,1],[0.73,0,1,0.34],[0.73,0.34,1,0.66],[0.73,0.66,1,1],[0.27,0,0.5,0.24],[0.5,0,0.73,0.24],[0.27,0.76,0.5,1],[0.5,0.76,0.73,1]];
  const hero=ctx.pick('hero'),rk=[...new Set(poolAll(g.motifs.ring))].filter(k=>SG.motifs[k]&&k!=='dot'),pk=rk.length?rk:['floret'];
  cells.forEach(([a,b,c,d,k],i)=>{const q=moRect(X(a)+gp,Y(b)+gp,X(c)-gp,Y(d)-gp);P.push(moL(q,0,'outer',true),moL(GH.inset(q,5)||q,0,'detail',true));});
  ctx.parts(P,'frame');
  cells.forEach(([a,b,c,d,k],i)=>{const cw=(c-a)*w-2*gp,ch=(d-b)*h-2*gp,key=k?hero:pk[(i+Math.floor(i/3))%pk.length],M=SG.motifs[key]||{};ctx.motif(key,X((a+c)/2),Y((b+d)/2),Math.min(cw,ch)*0.84,{role:k?'hero':'ring',variant:k?'hero':'c'+(i%pk.length),flip:a>0.5&&!!M.mirrorOk});});
}});
