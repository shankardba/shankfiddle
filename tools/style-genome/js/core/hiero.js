'use strict';
/* Ancient Egypt: hieroglyphic signs, the square-group ("quadrat") layout that packs them,
   emblems, composite-view figures, borders and the layouts that carry them.

   Signs are original spline drawings of standard forms, keyed by their Gardiner sign-list
   code. Each is drawn inside a 100×100 square at its conventional size (tall signs fill the
   height, low broad signs the width, small signs neither), facing RIGHT, so the layout can
   pack real words the way a scribe did. Parts carry a `tone` so one sign takes one or two
   colours, as painted signs do. Nothing here traces a reference image. */

const HG={sign:{},fit:{},words:{},carts:[],formulas:[]};
const hS=(pts,closed=true,seg=6)=>FK.spline(pts,closed,seg);
const hR=(pts,tone=0,role='outer')=>reg(pts,role,{tone});
const hT=(path,w,tone=0,role='outer')=>reg(FK.tube(path,typeof w==='function'?w:()=>w),role,{tone});
const hRing=(o,k,c,start=0)=>{const n=o.length,i0=Math.round(start*n)%n,r=o.slice(i0).concat(o.slice(0,i0));return r.concat([r[0]],G.scaleAbout(r.concat([r[0]]),c,k).reverse());};
const hLens=(x0,x1,y,h)=>G.chain(G.quad([x0,y],[(x0+x1)/2,y-2*h],[x1,y]),G.quad([x1,y],[(x0+x1)/2,y+2*h],[x0,y])).slice(0,-1);
function hgBBox(parts){const all=[];for(const p of parts){if(p.kind==='dot')all.push([p.x-p.r,p.y-p.r],[p.x+p.r,p.y+p.r]);else all.push(...p.pts);}return G.bbox(all);}
// move a centred, y-down part list to (x,y) at scale s, optionally rotated or mirrored
function hgPut(P,parts,x,y,s,o={}){
  for(const p of parts){const xf={x,y,s,rot:o.rot||0,flip:!!o.flip};
    if(p.kind==='dot'){const [q]=G.xform([[p.x,p.y]],xf);P.push(Object.assign({},p,{x:q[0],y:q[1],r:p.r*s},o.mat?{mat:o.mat}:{},o.tone!=null?{tone:o.tone+(p.tone||0)}:{}));}
    else P.push(Object.assign({},p,{pts:G.xform(p.pts,xf)},o.mat?{mat:o.mat}:{},o.tone!=null?{tone:o.tone+(p.tone||0)}:{},o.role?{role:o.role}:{}));}
}
function hgSign(code,name,val,meaning,fn,o={}){
  const raw=fn();const b=hgBBox(raw);const fitted=fitParts(raw);
  HG.sign[code]={code,key:'hg'+code,w:b.w/100,h:b.h/100,name,val};HG.fit[code]=fitted;
  defMotif('hg'+code,Object.assign({name,term:'Gardiner '+code+(val?' · '+val:''),meaning,upright:true,glyph:true,fn(){return fitted;}},o));
}
function hgLegs(P,legs,fy,tone=1){for(const [x0,y0,x1] of legs){P.push(hT([[x0,y0],[x1,fy-1]],1.5,tone));P.push(hT([[x1-5,fy],[x1+11,fy]],1.2,tone));}}

/* ---------- birds ---------- */
hgSign('G17','Owl','m','The barn owl, body in profile and face turned to the viewer — the only common bird sign that looks out of the wall. Writes the sound m: "in", "with", "from".',()=>{const P=[];
  P.push(hR(hS([[44,10],[58,6],[72,11],[78,24],[75,40],[71,56],[63,71],[50,80],[36,84],[20,92],[9,95],[13,84],[23,66],[31,45],[35,26]]),0));
  P.push(ln(hS([[41,34],[36,52],[28,70],[13,90]],false),'inner'));P.push(ln(hS([[47,40],[42,58],[33,76]],false),'detail'));P.push(ln(hS([[53,46],[49,62],[42,76]],false),'detail'));
  P.push(ln([[44,13],[59,21],[73,13]],'inner'));
  for(const x of [52,66]){P.push(hR(G.circle(x,23,4.2,14),2,'detail'));P.push(dt(x,23,1.6));}
  P.push(hR([[57,26],[61,26],[59,32]],1,'detail'));hgLegs(P,[[54,79,55],[62,74,64]],96);return P;});
hgSign('G1','Vulture','ꜣ','The Egyptian vulture: small hooked head, sloping back, wing-tips crossing the tail. Writes the weak consonant ꜣ (aleph).',()=>{const P=[];
  P.push(hR(hS([[64,12],[70,7],[78,8],[84,13],[92,17],[96,24],[91,23],[84,22],[79,25],[76,32],[75,42],[72,55],[64,67],[50,75],[30,82],[8,89],[17,75],[33,57],[47,37],[57,22]]),0));
  P.push(ln(hS([[57,32],[44,54],[30,70],[12,86]],false),'inner'));P.push(ln(hS([[62,44],[50,62],[36,76]],false),'detail'));P.push(ln([[62,14],[56,9]],'outer'),ln([[61,18],[54,15]],'outer'));P.push(dt(77,14,1.5));P.push(ln(hS([[70,10],[72,18],[78,24]],false),'detail'));
  hgLegs(P,[[56,73,58],[65,66,68]],95);return P;});
hgSign('G43','Quail chick','w','A downy chick: round body, no tail, oversized legs. Writes w, and the plural and "he/him" endings built on it.',()=>{const P=[];
  P.push(hR(hS([[60,14],[70,11],[79,16],[88,23],[79,26],[77,36],[75,50],[67,63],[53,70],[37,68],[25,60],[20,49],[26,42],[40,36],[52,27]]),0));
  P.push(ln(hS([[30,47],[40,53],[51,50]],false),'inner'));P.push(dt(72,18,1.5));hgLegs(P,[[48,69,49],[58,68,61]],95);return P;});
hgSign('G5','Falcon','Ḥr','The falcon of Horus: upright stance, flat head, hooked beak, the dark "moustache" stroke below the eye, tail reaching the ground. The king\'s oldest title is written with it.',()=>{const P=[];
  P.push(hR(hS([[56,10],[66,6],[77,8],[83,13],[90,17],[91,24],[86,21],[80,23],[78,34],[76,50],[69,65],[56,76],[46,86],[41,97],[31,97],[32,82],[34,62],[38,42],[46,24]]),0));
  P.push(ln(hS([[52,30],[46,52],[40,74],[36,94]],false),'inner'));P.push(ln(hS([[58,40],[52,60],[46,78]],false),'detail'));
  P.push(ln(hS([[71,15],[70,22],[66,27],[62,26]],false),'inner'));P.push(dt(72,13,1.6));hgLegs(P,[[60,73,62],[66,67,70]],95);return P;});
hgSign('G39','Pintail duck','sꜣ','A pintail duck. Writes sꜣ, "son" — with the sun disc, "son of Ra", the title before a king\'s birth name.',()=>{const P=[];
  P.push(hR(hS([[70,23],[78,19],[86,22],[97,27],[86,30],[80,34],[79,46],[73,59],[59,69],[39,70],[21,62],[4,47],[20,50],[36,45],[52,42],[62,36],[66,28]]),0));
  P.push(ln(hS([[30,52],[46,58],[62,52],[70,44]],false),'inner'));P.push(dt(79,24,1.4));hgLegs(P,[[50,69,51],[60,68,63]],92);return P;});
hgSign('L2','Bee','bit','The honey bee, emblem of Lower Egypt; paired with the sedge it writes "King of Upper and Lower Egypt".',()=>{const P=[];
  P.push(hR(G.ellipse(32,62,25,11,28,-18),0));for(const u of [-13,-3,7]){const cx=32+u*0.95,cy=62-u*0.31;P.push(ln([[cx-2.8,cy-9],[cx+2.8,cy+9]],'detail'));}
  P.push(hR(G.xform(G.petal(40,9,'round'),{x:56,y:42,rot:-40}),2));P.push(hR(G.xform(G.petal(34,8,'round'),{x:58,y:42,rot:-68}),2));
  P.push(hR(G.circle(60,50,11,20),1));P.push(hR(G.circle(76,46,7,16),0));
  P.push(ln([[80,41],[88,32]],'detail'),ln([[78,40],[83,30]],'detail'),ln([[56,60],[52,75]],'outer'),ln([[62,61],[64,75]],'outer'),ln([[68,57],[75,70]],'outer'),ln([[8,69],[2,72]],'detail'));return P;});
/* ---------- reptiles and the scarab ---------- */
hgSign('I9','Horned viper','f','The horned viper, body rippling along the ground, head lifted. Writes f, and "he / his".',()=>{const P=[];
  P.push(hT(hS([[4,64],[18,58],[34,64],[52,60],[68,64],[80,58],[88,50]],false),t=>1+5.4*Math.sin(Math.PI*Math.min(1,t*1.15)*0.9),0));
  P.push(hR(G.ellipse(91,47,7,4,16,-25),0));P.push(ln([[88,43],[85,34]],'outer'),ln([[92,43],[92,33]],'outer'));P.push(dt(92,46,1));return P;});
hgSign('I10','Cobra','ḏ','A cobra at rest, neck raised. Writes ḏ; with the staff it opens every speech: "words spoken".',()=>{const P=[];
  P.push(hT(hS([[5,90],[24,92],[44,88],[57,79],[61,63],[58,47],[61,33],[70,26],[83,27]],false),t=>t<0.55?1+7*t:t<0.85?4.8+4.6*Math.sin(Math.PI*(t-0.55)/0.3):4.8-8*(t-0.85),0));
  P.push(dt(78,25,1.2));for(const y of [44,52,60])P.push(ln([[55,y],[65,y+2]],'detail'));return P;});
hgSign('L1','Scarab','ḫpr','The dung beetle seen from above. Writes ḫpr, "to come into being"; as Khepri it is the sun reborn each dawn.',()=>{const P=[];
  for(const s of [-1,1]){P.push(hT(hS([[50+s*16,38],[50+s*28,28],[50+s*30,13]],false),1.8,0));P.push(hT(hS([[50+s*20,58],[50+s*36,58],[50+s*42,70]],false),1.8,0));P.push(hT(hS([[50+s*16,80],[50+s*28,90],[50+s*26,99]],false),1.8,0));}
  P.push(hR(G.ellipse(50,60,21,27,36),0));P.push(ln([[50,41],[50,87]],'inner'));for(const s of [-1,1])P.push(ln(hS([[50+s*8,46],[50+s*11,62],[50+s*8,82]],false),'detail'));
  P.push(hR(hS([[31,45],[36,32],[50,27],[64,32],[69,45],[50,40]]),1));P.push(hR(hS([[42,28],[44,18],[50,15],[56,18],[58,28],[50,30]]),0));return P;},{glyph:true});
/* ---------- parts of the body ---------- */
hgSign('D21','Mouth','r','A mouth. Writes r: "to", "toward", "mouth", "utterance".',()=>[hR(hLens(5,95,50,13),0),ln(hLens(20,80,50,5.5),'inner',true)]);
hgSign('D4','Eye','ir','An eye. Writes ir, "to do, to make" — and the name of Osiris.',()=>[hR(G.chain(G.quad([4,52],[50,22],[96,52]),G.quad([96,52],[50,70],[4,52])).slice(0,-1),0),hR(G.circle(50,48,10,20),1,'inner'),dt(50,48,3.5)]);
hgSign('D10','Wedjat eye','wḏꜣt','The "sound" eye of Horus, healed after his fight with Seth: a human eye and brow with the cheek markings of a falcon. The most worn amulet in Egypt, for protection and wholeness.',()=>{const P=[];
  P.push(hT(hS([[6,30],[28,20],[54,17],[78,22],[94,30]],false),t=>3.2-1.6*Math.abs(t-0.4),1));
  P.push(hR(G.chain(G.quad([10,46],[50,24],[90,46]),G.quad([90,46],[50,60],[10,46])).slice(0,-1),0));P.push(hR(G.circle(50,43,8.5,20),1,'inner'));P.push(dt(50,43,3));
  P.push(hT([[88,46],[99,45]],1.6,1));P.push(hR([[44,58],[52,58],[51,84],[45,86]],1));
  P.push(hT(hS([[54,58],[62,72],[76,82],[88,80],[91,72],[86,68]],false),t=>2.6-1.5*t,1));return P;});
hgSign('D36','Forearm','ꜥ','A forearm, palm up. Writes the throat sound ꜥ (ayin).',()=>[hT(hS([[9,38],[12,50],[24,55],[48,54],[72,52],[88,50]],false),t=>5.2-1.6*t,0),hT([[84,49],[89,41]],1.6,0)]);
hgSign('D46','Hand','d','A hand. Writes d.',()=>[hR(hS([[6,45],[28,41],[58,41],[90,45],[95,50],[90,55],[62,58],[30,59],[6,57]]),0),hR(hS([[44,42],[54,31],[60,33],[56,42]]),0),ln([[66,47],[92,48]],'detail'),ln([[66,52],[91,52]],'detail')]);
hgSign('D58','Foot','b','A lower leg and foot. Writes b.',()=>[hR(hS([[32,5],[46,5],[47,40],[48,62],[54,74],[72,82],[88,88],[89,95],[60,96],[30,95],[27,84],[31,64],[32,36]]),0)]);
hgSign('D28','Raised arms','kꜣ','Two arms raised: the ka, the life-force that offerings feed.',()=>{const P=[hT(hS([[14,24],[14,50],[18,62],[34,66],[50,60],[66,66],[82,62],[86,50],[86,24]],false),4,0)];for(const x of [14,86])P.push(hR(G.roundRect(x-5,9,x+5,25,3),0));return P;});
hgSign('A1','Seated man','(man)','A man seated on one heel. Follows men\'s names and words for people; also "I, me".',()=>{const P=[];
  P.push(hT(hS([[46,60],[38,74],[44,90],[66,93]],false),t=>4.6-1.8*t,0));P.push(hT(hS([[56,58],[74,46],[80,66],[80,90]],false),t=>4.6-1.6*t,0));P.push(hT([[78,92],[92,92]],2,0));
  P.push(hR(hS([[45,25],[66,25],[65,42],[60,60],[42,60],[44,42]]),1));P.push(hT(hS([[47,31],[38,44],[48,54]],false),t=>3-t,0));P.push(hT(hS([[60,31],[74,40],[86,34]],false),t=>3-t,0));
  P.push(hR(G.circle(56,15,9,20),0));P.push(hR(G.chain(G.arc(56,15,9.6,150,335,12),[[62,12],[50,13]]),2,'inner'));return P;});
/* ---------- plants ---------- */
hgSign('M17','Reed leaf','i','A flowering reed. Writes the weak consonant i/y.',()=>{const P=[hR(hS([[50,5],[59,18],[62,46],[57,72],[50,80],[45,72],[40,46],[43,18]]),0),hT([[50,80],[50,97]],1.8,0),hT([[50,97],[59,97]],1.5,0),ln([[50,10],[50,78]],'inner')];
  for(let y=20;y<=68;y+=8)P.push(ln([[50,y],[44,y-5]],'detail'),ln([[50,y],[56,y-5]],'detail'));return P;});
hgSign('M23','Sedge','sw','The sedge of Upper Egypt. Writes sw, and nsw, "king".',()=>{const P=[hT(hS([[50,98],[50,60],[50,32],[54,16],[66,6]],false),t=>2.2-1.2*t,0)];const tp=t=>2.1-1.4*t;
  for(const s of [-1,1]){P.push(hT(hS([[50,64],[50+s*18,52],[50+s*30,36]],false),tp,0));P.push(hT(hS([[50,86],[50+s*14,80],[50+s*24,70]],false),tp,0));}return P;});
hgSign('H6','Ostrich feather','šw / mꜣꜥt','The ostrich plume, curled at the tip. Emblem of Ma\'at — truth and right order — against which the heart is weighed.',()=>{const P=[hR(hS([[46,97],[44,62],[40,32],[42,13],[50,4],[60,6],[65,15],[59,23],[61,42],[59,70],[54,97]]),0),ln(hS([[50,96],[50,60],[49,30],[52,12]],false),'inner')];
  for(let y=30;y<=86;y+=8)P.push(ln([[50,y],[43,y-5]],'detail'),ln([[50,y],[58,y-5]],'detail'));return P;},{glyph:true});
/* ---------- sky, earth, water ---------- */
hgSign('N35','Water ripple','n','A ripple of water. Writes n: "to", "for", "of".',()=>{const z=[];for(let i=0;i<=14;i++)z.push([3+i*94/14,i%2?44:56]);return[hR(G.band(z,5.5),0)];});
hgSign('N5','Sun disc','rꜥ','The sun: Ra, and "day". In a royal name it is written first out of respect, though read last.',()=>[hR(G.circle(50,50,22,36),0),hR(G.circle(50,50,7,16),1,'detail')]);
hgSign('N14','Star','sbꜣ','A five-armed star. Rows of them cover tomb ceilings as the night sky.',()=>{const P=[];for(let i=0;i<5;i++)P.push(hR(G.xform(G.petal(46,5.5,'pointed'),{x:50,y:50,rot:i*72}),0));P.push(hR(G.circle(50,50,6,14),1,'detail'));return P;});
hgSign('N16','Land','tꜣ','A strip of land with grains of sand. Two of them write "the Two Lands", Egypt.',()=>{const P=[hR(G.roundRect(4,42,96,53,3),0)];for(const x of [30,50,70])P.push(hR(G.circle(x,60,2.6,10),1,'detail'));return P;});
hgSign('N1','Sky','pt','The sky as a flat ceiling with down-turned ends.',()=>[hR([[4,40],[96,40],[96,60],[88,50],[12,50],[4,60]],0)]);
hgSign('N29','Hill slope','q','A sandy slope. Writes q.',()=>[hR(hS([[14,70],[40,38],[52,31],[62,36],[70,52],[88,70]],false),0)]);
/* ---------- made things ---------- */
hgSign('X1','Bread loaf','t','A small round loaf. Writes t — the feminine ending, so it is everywhere.',()=>{const p=[];for(let i=0;i<=16;i++){const a=Math.PI+i/16*Math.PI;p.push([50+19*Math.cos(a),58+15*Math.sin(a)]);}return[hR(p,0)];});
hgSign('X8','Conical loaf','di','A tall loaf held out: di, "to give" — "given life".',()=>[hR([[50,26],[64,74],[36,74]],0),ln([[40,63],[60,63]],'detail')]);
hgSign('V30','Basket','nb','A wicker basket. Writes nb: "lord", "every", "all".',()=>{const p=[];for(let i=0;i<=24;i++){const a=i/24*Math.PI;p.push([50+46*Math.cos(a),36+30*Math.sin(a)]);}const P=[hR(p,0)];
  for(const y of [46,56]){const h=46*Math.sqrt(1-Math.pow((y-36)/30,2))-3;P.push(ln([[50-h,y],[50+h,y]],'detail'));}return P;});
hgSign('V31','Basket with handle','k','A basket with a loop handle. Writes k, and "you / your".',()=>{const p=[];for(let i=0;i<=24;i++){const a=i/24*Math.PI;p.push([52+42*Math.cos(a),40+26*Math.sin(a)]);}
  return[hR(p,0),hT(hS([[11,42],[2,45],[3,54],[13,52]],false),1.6,0),ln([[18,50],[86,50]],'detail')];});
hgSign('Q3','Stool','p','A reed-mat stool. Writes p.',()=>[hR(G.roundRect(34,32,66,68,1.5),0),ln([[34,44],[66,44]],'detail'),ln([[34,56],[66,56]],'detail'),ln([[45,32],[45,68]],'detail'),ln([[55,32],[55,68]],'detail')]);
hgSign('S29','Folded cloth','s','A length of cloth folded over. Writes s, and "she / her".',()=>[hT(hS([[42,97],[42,50],[42,14],[46,6],[54,6],[58,14],[58,42]],false),4,0)]);
hgSign('O34','Door bolt','z','A door bolt. Writes z (later the same sound as s).',()=>[hR(G.roundRect(4,44,96,56,2),0),ln([[42,38],[42,62]],'outer'),ln([[58,38],[58,62]],'outer')]);
hgSign('O1','House','pr','A house plan with its doorway. Writes pr, "house, estate".',()=>[hR(G.band([[36,68],[14,68],[14,36],[86,36],[86,68],[64,68]],6),0)]);
hgSign('Q1','Seat','st','A throne. Writes st, "place"; with the eye, the name of Osiris.',()=>[hR([[30,8],[42,8],[42,50],[72,50],[72,92],[30,92]],0),ln([[30,50],[42,50]],'detail'),ln([[36,70],[54,70],[54,92]],'inner')]);
hgSign('V28','Wick','ḥ','A wick of twisted flax. Writes the emphatic ḥ.',()=>{const A=[],B=[];for(let i=0;i<=40;i++){const t=i/40,y=6+t*76,dx=8*Math.sin(t*Math.PI*3);A.push([50+dx,y]);B.push([50-dx,y]);}
  return[hT(A,1.8,0),hT(B,1.8,0),hT([[50,82],[44,96]],1.6,0),hT([[50,82],[56,96]],1.6,0)];});
hgSign('Aa1','Placenta','ḫ','A disc ruled with lines. Writes ḫ (kh).',()=>{const P=[hR(G.circle(50,50,19,30),0)];for(const dy of [-8,0,8]){const h=Math.sqrt(19*19-dy*dy)-2;P.push(ln([[50-h,50+dy],[50+h,50+dy]],'detail'));}return P;});
hgSign('Y5','Game board','mn','A senet board with its pieces. Writes mn, "to last, endure" — and the name of Amun.',()=>{const P=[hR(G.roundRect(5,58,95,70,2),0)];for(let i=0;i<7;i++){const x=14+i*12;P.push(hR(G.roundRect(x-3,44,x+3,58,2.5),1));}return P;});
hgSign('R4','Offering mat','ḥtp','A loaf on a reed mat: ḥtp, "offering", "to be at peace".',()=>[hR(G.roundRect(4,58,96,70,3),0),hR(hS([[37,58],[40,46],[50,40],[60,46],[63,58]],false),1)]);
hgSign('R8','Cloth-wound pole','nṯr','A pole wound with cloth, its end flying like a pennant: nṯr, "god".',()=>[hT([[38,98],[38,6]],2.4,0),hR([[38,7],[86,11],[86,22],[38,27]],1),ln([[33,42],[43,42]],'detail'),ln([[33,54],[43,54]],'detail'),ln([[33,66],[43,66]],'detail')]);
hgSign('S43','Staff','mdw','A walking staff: mdw, "speech, words".',()=>[hT([[50,98],[50,10]],2.2,0),hT([[50,10],[57,4]],1.8,0)]);
hgSign('U28','Fire drill','ḏꜣ','A fire drill. In the wish "life, prosperity, health" it abbreviates wḏꜣ, "sound, prosperous".',()=>[hT([[50,6],[50,72]],2,0),hR(G.roundRect(45,2,55,9,2),0),hR(hRing(G.ellipse(50,84,13,10,24),0.55,[50,84],0.75),0)]);
hgSign('O29','Column','ꜥꜣ','A wooden column: ꜥꜣ, "great".',()=>[hR(hS([[45,96],[44,30],[40,16],[45,5],[55,5],[60,16],[56,30],[55,96]]),0),ln([[44,30],[56,30]],'detail')]);
hgSign('Z1','Stroke','(one)','A single stroke: "one", and the mark that a sign means the thing it shows.',()=>[hR(G.roundRect(46,32,54,68,2),0)]);
hgSign('Z2','Plural strokes','(plural)','Three strokes: the plural.',()=>[26,46,66].map(x=>hR(G.roundRect(x,40,x+8,60,2),0)));
/* ---------- the three great amulet signs ---------- */
hgSign('S34','Ankh','ꜥnḫ','"Life". A looped cross, perhaps a sandal strap or knotted band. Gods hold it by the loop and offer it to the king\'s nose: the breath of life.',()=>{
  const loop=hS([[50,41],[39,31],[33,18],[40,6],[50,3],[60,6],[67,18],[61,31]]);
  return[hR(hRing(loop,0.52,[50,19]),0),hR([[20,41],[50,46],[80,41],[80,55],[50,50],[20,55]],0),hR([[46,50],[54,50],[57,97],[43,97]],0)];},{glyph:true});
hgSign('R11','Djed pillar','ḏd','"Stability". A column with four bars — read as the backbone of Osiris, raised upright at his festival.',()=>{const P=[hR([[32,97],[68,97],[61,88],[39,88]],0),hR([[41,88],[59,88],[56,42],[44,42]],0)];
  for(const y of [5,15,25])P.push(hR([[45,y+6.5],[55,y+6.5],[55,y+10],[45,y+10]],0));
  for(const [y,hw] of [[35,21],[25,21],[15,21],[5,19]])P.push(hR(G.roundRect(50-hw,y,50+hw,y+6.5,2),1));
  P.push(ln([[42.5,62],[57.5,62]],'detail'),ln([[42,72],[58,72]],'detail'));return P;},{glyph:true});
hgSign('S40','Was sceptre','wꜣs','"Dominion". A staff with a forked foot and the slanted head of an animal; gods carry it.',()=>[hT([[45,90],[49,20]],2,0),hT([[45,90],[39,99]],1.5,0),hT([[45,90],[52,99]],1.5,0),
  hR(hS([[48,22],[47,10],[54,4],[66,7],[80,13],[84,17],[78,20],[66,17],[58,19],[53,23]]),0),hT([[50,8],[44,1]],1.5,0),dt(60,11,1)],{glyph:true});
hgSign('F35','Heart and windpipe','nfr','nfr: "good, beautiful, perfect".',()=>[hR(hS([[50,60],[61,63],[66,75],[60,89],[50,97],[40,89],[34,75],[39,63]]),0),hT([[50,60],[50,8]],2,0),ln([[38,22],[62,22]],'outer'),ln([[41,12],[59,12]],'outer')]);

/* ---------- words, royal names, stock formulas ----------
   Group notation after the Manuel de Codage: "-" starts a new square, ":" stacks,
   "*" sets side by side, brackets nest. Every spelling is a standard one. */
const HW=(k,t,m,s)=>{HG.words[k]={k,t,m,s};};
HW('ankh','ꜥnḫ','life; to live','S34-N35:Aa1');
HW('nefer','nfr','good, beautiful, perfect','F35-I9:D21');
HW('kheper','ḫpr','to come into being','L1-D21');
HW('ra','rꜥ','the sun; Ra','D21:D36-N5*Z1');
HW('djedmedu','ḏd mdw','words spoken (the opening of a speech)','I10*S43');
HW('in','in','by','M17:N35');
HW('diankh','di ꜥnḫ','given life','X8*S34');
HW('adw','ꜥnḫ ḏd wꜣs','life, stability, dominion','S34*R11*S40');
HW('aws','ꜥnḫ wḏꜣ snb','life, prosperity, health','S34*U28*S29');
HW('djet','ḏt','for ever','I10*(X1:N16)');
HW('neheh','nḥḥ','eternity','V28*N5*V28');
HW('nbtawy','nb tꜣwy','lord of the Two Lands','V30:N16:N16');
HW('nswbity','nsw-bity','King of Upper and Lower Egypt','M23*L2:X1*X1');
HW('sara','sꜣ rꜥ','son of Ra','G39*N5');
HW('netjernefer','nṯr nfr','the perfect god','R8*F35');
HW('netjeraa','nṯr ꜥꜣ','the great god','R8*O29');
HW('hetepdinesu','ḥtp di nsw','an offering which the king gives','M23*(X1:R4)*X8');
HW('nkan','n kꜣ n','for the spirit of…','N35:D28*Z1:N35');
HW('mhetep','m ḥtp','in peace','G17-R4:X1*Q3');
HW('nbpet','nb pt','lord of the sky','V30:Q3*X1:N1');
HW('seba','sbꜣ','star','S29*D58-G1*N14');
HW('bu','bw','place','D58*G43');
HW('ren','rn','name','D21:N35');
HW('hena','ḥnꜥ','together with','V28*(N35:D36)');
HW('per','pr','house','O1:Z1');
HW('m','m','in, with, from','G17');
HW('n','n','to, for, of','N35');
HW('nb','nb','all, every','V30');
HW('ka','kꜣ','spirit, life-force','D28:Z1');
HW('wsir','wsir','Osiris','Q1*D4');
HW('imn','imn','Amun','M17*(Y5:N35)');
HG.carts=[
  {t:'mn-ḫpr-rꜥ',m:'"Lasting is the manifestation of Ra" — throne name of Thutmose III',s:'N5-Y5-L1'},
  {t:'nb-ḫprw-rꜥ',m:'"Lord of the manifestations of Ra" — throne name of Tutankhamun',s:'N5-L1:Z2-V30'},
  {t:'ḫpr-kꜣ-rꜥ',m:'"The spirit of Ra comes into being" — throne name of Senusret I',s:'N5-L1-D28'}];
HG.formulas=[
  {t:'ḏd mdw in rꜥ nṯr ꜥꜣ nb pt',m:'Words spoken by Ra, the great god, lord of the sky',seq:['djedmedu','in','ra','netjeraa','nbpet']},
  {t:'nṯr nfr nb tꜣwy (…) di ꜥnḫ ḏt',m:'The perfect god, lord of the Two Lands, (royal name), given life for ever',seq:['netjernefer','nbtawy','#','diankh','djet']},
  {t:'nsw-bity (…) sꜣ rꜥ … ꜥnḫ ḏt',m:'The King of Upper and Lower Egypt (royal name), son of Ra, living for ever',seq:['nswbity','#','sara','ankh','djet']},
  {t:'ḥtp di nsw wsir nṯr ꜥꜣ … n kꜣ n',m:'An offering which the king gives to Osiris, the great god … for the spirit of…',seq:['hetepdinesu','wsir','netjeraa','nkan']},
  {t:'di ꜥnḫ ḏd wꜣs nb … nḥḥ ḥnꜥ ḏt',m:'Given all life, stability and dominion … for eternity and for ever',seq:['diankh','adw','nb','neheh','hena','djet']},
  {t:'ꜥnḫ wḏꜣ snb … m ḥtp',m:'Life, prosperity, health … in peace',seq:['aws','mhetep']}];

function hgParse(s){let i=0;
  const item=()=>{if(s[i]==='('){i++;const q=quad();i++;return q;}const j=i;while(i<s.length&&/[A-Za-z0-9]/.test(s[i]))i++;return s.slice(j,i);};
  const row=()=>{const it=[item()];while(s[i]==='*'){i++;it.push(item());}return it.length===1?it[0]:{row:it};};
  const quad=()=>{const rows=[row()];while(s[i]===':'){i++;rows.push(row());}return rows.length===1?rows[0]:{stack:rows};};
  return quad();}
const HGAP=0.07;
function hgNat(n){if(typeof n==='string'){const S=HG.sign[n];return{w:S.w,h:S.h};}
  const c=(n.row||n.stack).map(hgNat);
  return n.row?{w:c.reduce((a,b)=>a+b.w,0)+HGAP*(c.length-1),h:Math.max(...c.map(b=>b.h))}:{w:Math.max(...c.map(b=>b.w)),h:c.reduce((a,b)=>a+b.h,0)+HGAP*(c.length-1)};}
function hgPlace(n,x,y,w,h,out,kmax=1){
  const nat=hgNat(n);const k=Math.min(w/nat.w,h/nat.h,kmax);
  if(typeof n==='string'){out.push({code:n,x:x+w/2,y:y+h/2,k});return;}
  const c=n.row||n.stack,cn=c.map(hgNat);
  if(n.row){let cx=x+(w-nat.w*k)/2;c.forEach((ch,i)=>{hgPlace(ch,cx,y+(h-nat.h*k)/2,cn[i].w*k,nat.h*k,out,k);cx+=(cn[i].w+HGAP)*k;});}
  else{let cy=y+(h-nat.h*k)/2;c.forEach((ch,i)=>{hgPlace(ch,x+(w-nat.w*k)/2,cy,nat.w*k,cn[i].h*k,out,k);cy+=(cn[i].h+HGAP)*k;});}
}
// one square group laid out in a q-wide square: sign placements and the height used
function hgQuad(spec,q){const node=hgParse(spec),nat=hgNat(node);const out=[];const k=Math.min(1/nat.w,1/nat.h,1);const h=nat.h*k;hgPlace(node,0,0,1,h,out);
  return{h:h*q,signs:out.map(s=>{const S=HG.sign[s.code];return{code:s.code,key:S.key,x:(s.x-0.5)*q,y:s.y*q,size:s.k*q*Math.max(S.w,S.h)};})};}
// a whole word or name as one part list (squares stacked downward)
function hgCompose(spec,q=100){const P=[];let y=0,i=0;
  for(const sp of spec.split('-')){const Q=hgQuad(sp,q);for(const s of Q.signs){hgPut(P,HG.fit[s.code],s.x,y+s.y,s.size/100,{tone:(i++)*3});}y+=Q.h+q*0.08;}
  return{parts:P,h:y-q*0.08};}

defMotif('hieroWord',{name:'Hieroglyphic word',term:'mdw nṯr, "the god\'s words"',upright:true,script:true,glyph:true,
  meaning:'One real word or stock phrase — "life", "given life", "lord of the Two Lands", "for ever" — spelled in standard signs and packed into square groups, as a scribe would arrange it.',
fn(rng){const keys=Object.keys(HG.words);return fitParts(hgCompose(HG.words[rng.pick(keys)].s).parts);}});
defMotif('royalName',{name:'Cartouche',term:'šnw; rn "name"',upright:true,script:true,glyph:true,
  meaning:'A king\'s name inside an oval of knotted rope — the shen ring of "all that the sun encircles", stretched to hold the signs. The names drawn are real throne names: Menkheperre, Nebkheperure, Kheperkare.',
fn(rng){const c=rng.pick(HG.carts);const {parts,h}=hgCompose(c.s,70);const P=[];const top=-14,bot=h+12;
  P.push(reg(hRing(G.roundRect(-46,top,46,bot,40,8),0.9,[0,(top+bot)/2],0.375),'outer',{tone:40}));P.push(reg(G.roundRect(-52,bot+2,52,bot+9,3),'outer',{tone:40}));
  return fitParts(P.concat(parts));}});

/* ---------- feathered wings ----------
   Tiers of overlapping feathers hanging from an arm line: long flight feathers first, then
   two rows of shorter coverts over them. ang is measured from straight down, toward +x. */
function hgWing(P,arm,o){
  const tiers=o.tiers||[1,0.6,0.3];const tot=G.length(arm,false);
  tiers.forEach((k,ti)=>{const n=Math.round(o.n*(1+ti*0.3));const S=G.samples(arm,false,tot/n);const hw=tot/n*0.56;
    S.forEach((s,i)=>{const t=i/Math.max(1,S.length-1);let L=lerp(o.len[0],o.len[1],t)*k;const a=lerp(o.ang[0],o.ang[1],t)*DEG;const dx=Math.sin(a),dy=Math.cos(a);
      if(o.floor!=null&&dy>0)L=Math.min(L,(o.floor-s.y)/dy);if(L<=hw*0.6)return;
      const nx=dy,ny=-dx;const q=[[s.x-nx*hw,s.y-ny*hw],[s.x-nx*hw+dx*L*0.78,s.y-ny*hw+dy*L*0.78],[s.x-nx*hw*0.45+dx*L*0.96,s.y-ny*hw*0.45+dy*L*0.96],[s.x+dx*L,s.y+dy*L],[s.x+nx*hw*0.45+dx*L*0.96,s.y+ny*hw*0.45+dy*L*0.96],[s.x+nx*hw+dx*L*0.78,s.y+ny*hw+dy*L*0.78],[s.x+nx*hw,s.y+ny*hw]];
      const p=reg(q,ti===0?'outer':'inner',{tone:20+ti});if(o.mats)p.mat=o.mats[ti];P.push(p);
      if(ti===0)P.push(ln([[s.x+dx*L*0.12,s.y+dy*L*0.12],[s.x+dx*L*0.86,s.y+dy*L*0.86]],'detail'));});});
}
function egLotus(s=1){const P=[];const pet=(len,w,rot,role,tone)=>P.push(reg(G.xform(G.petal(len*s,w*s,'pointed'),{rot}),role,{tone}));
  for(const r of [-62,62,-31,31,-15,15])pet(Math.abs(r)>40?0.8:0.92,0.19,r,'inner',1);
  for(const r of [-46,46,0])pet(1,0.3,r,'outer',0);
  for(const r of [-46,46,0])P.push(ln(G.xform([[0,-0.14*s],[0,-0.8*s]],{rot:r}),'detail'));
  P.push(reg(G.arc(0,0,0.17*s,0,180,10),'outer',{tone:0}));return P;}
function egPapyrus(s=1){const top=G.quad([-0.5,-0.72],[0,-1.0],[0.5,-0.72],14).map(([x,y])=>[x*s,y*s]);const P=[reg([[-0.07*s,0],...top,[0.07*s,0]],'outer',{tone:0})];
  for(let i=1;i<top.length-1;i+=2)P.push(ln([[top[i][0]*0.12,-0.12*s],[top[i][0]*0.94,top[i][1]*0.95]],'detail'));
  for(const r of [-24,0,24])P.push(reg(G.xform(G.petal(0.34*s,0.12*s,'pointed'),{rot:r}),'inner',{tone:1}));return P;}

defMotif('lotusEg',{name:'Blue lotus',term:'sšn',upright:true,meaning:'The blue water lily, which closes at night and opens at dawn: rebirth, the sun rising, and the emblem of Upper Egypt. Drawn in profile as a fan of pointed petals between three dark sepals.',
fn(){const P=egLotus(60).map(p=>Object.assign(p,{pts:p.pts.map(([x,y])=>[x,y+10])}));P.unshift(reg(FK.tube(hS([[0,10],[3,30],[-4,50],[2,66]],false),t=>2.2-0.8*t),'outer',{tone:0}));return fitParts(P);}});
defMotif('lotusBud',{name:'Lotus bud',term:'sšn',upright:true,meaning:'The closed bud; alternates with the open flower in every lotus frieze.',
fn(){const P=[reg(FK.tube(hS([[0,6],[2,28],[-3,48],[1,64]],false),t=>2-0.7*t),'outer',{tone:0}),reg(G.xform(G.petal(46,13,'pointed'),{y:8}),'outer',{tone:1})];
  for(const r of [-1,1])P.push(reg(G.xform(G.petal(34,9,'pointed'),{x:r*3,y:8,rot:r*10}),'inner',{tone:0}));return fitParts(P);}});
defMotif('papyrusUmbel',{name:'Papyrus',term:'wꜣḏ, "green, fresh"',upright:true,meaning:'The papyrus head, a bell on a tall stem: freshness and flourishing, the marsh of creation, and the emblem of Lower Egypt. Goddesses carry it as a sceptre.',
fn(){const P=egPapyrus(46).map(p=>Object.assign(p,{pts:p.pts.map(([x,y])=>[x,y-8])}));P.unshift(reg(FK.tube([[0,-8],[0,58]],t=>2.4-0.6*t),'outer',{tone:0}));return fitParts(P);}});
defMotif('shenRing',{name:'Shen ring',term:'šn, "to encircle"',upright:true,meaning:'A loop of rope with its ends tied flat: everything the sun encircles, and so protection without end. Vultures and falcons hold it in their claws.',
fn(){return fitParts([reg(hRing(G.circle(0,-6,34,48),0.74,[0,-6],0.25),'outer',{tone:0}),reg(G.roundRect(-44,30,44,40,3),'outer',{tone:0})]);}});
defMotif('wingedDisc',{name:'Winged sun disc',term:'Bḥdty, "he of Behdet"',upright:true,wide:0.3,meaning:'The sun between two falcon wings with a cobra either side: Horus of Behdet, set over doorways and at the head of stelae as protection.',
fn(){const P=[];
  for(const s of [-1,1]){const arm=hS([[s*9,-3],[s*28,-7],[s*52,-6]],false);hgWing(P,arm,{n:14,len:[19,13],ang:[s*30,s*66],tiers:[1,0.62,0.3]});
    P.push(reg(FK.tube(arm,t=>2.4-1.4*t),'outer',{tone:23}));
    P.push(reg(FK.tube(hS([[s*8,5],[s*14,10],[s*13,3],[s*16,-1]],false),t=>t<0.6?0.8+2*t:2-2*(t-0.6)),'inner',{tone:24}));}
  P.push(reg(G.circle(0,0,10,40),'outer',{tone:25}));P.push(ln(G.circle(0,0,7.6,32),'detail',true));return fitParts(P);}});
defMotif('wingedScarab',{name:'Winged scarab',term:'Ḫpri',upright:true,wide:0.62,meaning:'Khepri, the sun at dawn, as a beetle pushing the disc up between spread wings — the centrepiece of royal pectorals.',
fn(){const P=[];
  for(const s of [-1,1]){const arm=hS([[s*9,2],[s*26,-6],[s*40,-20],[s*47,-36]],false);hgWing(P,arm,{n:12,len:[12,20],ang:[s*20,s*8],tiers:[1,0.6,0.3]});P.push(reg(FK.tube(arm,t=>2.2-1.2*t),'outer',{tone:23}));}
  hgPut(P,HG.fit.L1,0,6,0.36,{tone:30});P.push(reg(G.circle(0,-24,7.5,30),'outer',{tone:25}));P.push(reg(hRing(G.circle(0,31,5.5,24),0.6,[0,31],0.75),'outer',{tone:23}));return fitParts(P);}});
defMotif('uraeus',{name:'Uraeus',term:'iꜥrt, "she who rears up"',upright:true,meaning:'The rearing cobra with spread hood — Wadjet on the king\'s brow, spitting fire at his enemies. Rows of them crown shrine walls.',
fn(){const P=[];P.push(reg(FK.tube(hS([[-30,40],[-8,44],[14,40],[24,28],[20,10],[18,-8],[22,-22],[32,-28]],false),t=>t<0.45?1.2+9*t:t<0.85?5.2+8*Math.sin(Math.PI*(t-0.45)/0.4):5.2-9*(t-0.85)),'outer',{tone:0}));
  for(const y of [-2,6,14,22])P.push(ln([[11,y],[29,y+1]],'detail'));P.push(dt(27,-27,1.4));P.push(reg(G.circle(22,-42,9,30),'outer',{tone:1}));return fitParts(P);}});

/* ---------- composite-view figures ----------
   The Egyptian canon: head, hips and legs in profile, the eye and the shoulders from the
   front, both feet showing the inner side. Drawn on the 18-square grid (hairline at 18,
   shoulders 16, waist 11, knee 6; a seated figure is 14 squares) in grid units with y up.
   One builder serves the enthroned god and goddess, the kneeling winged goddess and the
   standing man and woman. */
function egFigure(o){
  const P=[];const Y=p=>p.map(([x,y])=>[x,-y]);const sp=(pts,closed)=>FK.spline(pts,closed,6);
  const R=(pts,mat,role='outer')=>{const p=FK.m(reg(Y(sp(pts,true)),role),mat);P.push(p);return p;};
  const Rp=(pts,mat,role='outer')=>{const p=FK.m(reg(Y(pts),role),mat);P.push(p);return p;};
  const T=(path,w,mat,role='outer')=>{const p=FK.m(reg(FK.tube(Y(path.length>2?FK.spline(path,false,7):path),typeof w==='function'?w:()=>w),role),mat);P.push(p);return p;};
  const Ln=(pts,role='detail')=>P.push(ln(Y(pts.length>2?FK.spline(pts,false,7):pts),role));
  const D=(x,y,r)=>P.push(dt(x,-y,r));
  const put=(parts,x,y,s,q={})=>hgPut(P,parts,x,-y,s,q);
  const sit=o.pose==='sit',kneel=o.pose==='kneel',fem=o.sex==='f';const skin=fem?'skinPale':'skin';
  const tx=sit?-1.3:kneel?-0.4:0,ty=sit?-4.0:kneel?-6.6:0;const A=(x,y)=>[x+tx,y+ty];const Am=pts=>pts.map(([x,y])=>A(x,y));
  const legW=t=>t<0.3?lerp(0.42,0.78,t/0.3):t<0.58?lerp(0.78,0.6,(t-0.3)/0.28):lerp(0.6,1.02,(t-0.58)/0.42);
  const foot=(h,role='outer')=>R([[h,0],[h+1.6,0],[h+3.2,0],[h+3.28,0.28],[h+2.3,0.5],[h+1.45,0.85],[h+1.25,1.3],[h+0.45,1.3],[h+0.28,0.7],[h-0.06,0.3]],skin,role);
  let staffX=null,staffTop=0;
  /* ----- lower body ----- */
  if(sit){
    Rp([[tx-3.3,0],[5.9,0],[5.9,-0.7],[tx-3.3,-0.7]],'plinth');
    Rp([[tx-2.5,5.0],[tx-2.5,7.0],[tx-2.3,7.5],[tx-1.95,7.5],[tx-1.75,7.0],[tx-1.75,5.0]],'throne');
    Rp([[tx-2.5,5.0],[1.5,5.0],[1.5,0],[tx-2.5,0]],'throne');
    Ln([[tx-2.2,4.7],[1.2,4.7]]);Ln([[1.2,4.7],[1.2,0.3]]);Ln([[tx-2.2,4.7],[tx-2.2,0.3]]);
    Rp([[tx-2.2,0.3],[tx-0.2,0.3],[tx-0.2,2.3],[tx-2.2,2.3]],'throneInset','inner');Rp([[tx-1.8,0.7],[tx-0.6,0.7],[tx-0.6,1.9],[tx-1.8,1.9]],'throne','inner');
    Rp([[tx-2.55,5.0],[1.55,5.0],[1.55,5.35],[tx-2.55,5.35]],'cushion','inner');
    for(let r=0;r<4;r++)for(let c=0;c<5-(r<2?3:0);c++){const x=(r<2?tx+0.1:tx-2.0)+c*0.62+(r%2)*0.31,y=4.4-r*0.55;if(x>0.95)continue;P.push(ln(Y(G.arc(x,y,0.3,180,360,8)),'detail'));}
    foot(2.15,'inner');T([[3.05,5.6],[3.0,3.3],[2.9,1.25]],t=>0.66-0.24*t,skin,'inner');
    foot(1.75);T([[tx-0.5,6.0],[1.2,5.95],[2.55,5.85]],t=>0.98-0.2*t,skin);T([[2.6,5.9],[2.62,3.3],[2.5,1.25]],t=>0.74-0.3*t,skin);
    if(o.dress==='sheath')Rp([[tx-1.5,10.4],[tx+1.45,10.4],[tx+1.4,7.1],[1.5,6.95],[3.2,6.75],[3.42,6.0],[3.3,1.35],[1.85,1.35],[1.92,4.95],[tx-1.9,4.95],[tx-2.05,6.3],[tx-1.5,7.2]],'dress');
    else{Rp([[tx-1.5,7.1],[tx+1.4,7.1],[1.4,6.95],[3.2,6.75],[3.42,6.0],[3.35,4.95],[tx-1.9,4.95],[tx-2.05,6.2]],'ivory');
      for(let i=0;i<6;i++){const x=tx-1.3+i*0.82;Ln([[x,6.95-(i>3?0.12*(i-3):0)],[x+0.25,5.0]]);}}
  }else if(kneel){
    R([[-3.3,0.1],[-2.0,0.1],[-2.2,1.2],[-3.0,1.5],[-3.6,0.9]],skin,'inner');
    Rp([[-1.9,4.5],[1.0,4.5],[1.5,4.0],[2.0,3.2],[3.3,2.1],[3.55,1.0],[3.3,0.1],[0,0.05],[-2.5,0.1],[-3.2,0.5],[-3.25,1.6],[-2.8,2.8],[-2.3,3.6]],'dress');
    Ln([[1.9,3.1],[0.6,1.9],[-2.7,1.35]]);Ln([[3.4,1.5],[2.0,0.85],[-2.5,0.6]]);Ln([[-1.9,4.2],[-0.4,4.0],[1.1,4.2]]);
  }else{
    const hr=fem?-1.9:-3.4,hf=fem?-1.1:0.5;
    if(fem){foot(hr,'inner');foot(hf);}
    else{foot(hr,'inner');T([[hr+0.85,1.25],[hr+0.75,3.4],[hr+1.3,6],[-0.5,9.4]],legW,skin,'inner');foot(hf);T([[hf+0.85,1.25],[hf+0.8,3.4],[hf+0.9,6],[0.4,9.4]],legW,skin);}
    if(fem)Rp([[-1.5,14.3],[1.45,14.3],[1.4,12.6],[1.35,11.1],[1.6,10.2],[1.8,9.3],[1.75,6],[1.8,1.35],[-1.3,1.35],[-1.85,6],[-2.2,8.2],[-2.3,9.3],[-1.9,10.4],[-1.5,11.2],[-1.55,12.8]],'dress');
    else{Rp([[-1.65,11.1],[1.45,11.1],[1.85,9.8],[2.75,6.5],[-2.7,6.5],[-2.35,9.2]],'ivory');for(const [a,b] of [[0.7,1.7],[-0.1,0.3],[-0.9,-1.2],[-1.4,-2.2]])Ln([[a,10.8],[b,6.5]]);}
  }
  /* ----- torso, collar, neck ----- */
  R(Am(kneel?[[-1.5,11.1],[1.4,11.1],[1.7,13],[2.5,14.9],[3.05,15.85],[1.1,16.35],[-1.2,16.35],[-2.2,15.9],[-2.05,14.6],[-1.7,13]]:[[-1.5,11.1],[1.4,11.1],[1.7,13],[2.5,14.9],[3.05,15.85],[1.1,16.35],[-1.2,16.35],[-3.15,15.85],[-2.5,14.6],[-1.7,13]]),skin);
  if(!sit&&!kneel&&!fem)Rp([[-1.7,11.35],[1.5,11.35],[1.5,10.8],[-1.7,10.8]],'belt','inner');
  if(sit&&o.dress!=='sheath')Rp(Am([[-1.55,11.35],[1.45,11.35],[1.45,10.85],[-1.55,10.85]]),'belt','inner');
  if(fem){Rp(Am([[-1.5,11.05],[1.4,11.05],[1.62,12.6],[1.7,13.4],[1.55,14.3],[-1.6,14.3],[-1.72,13.4],[-1.62,12.6]]),'dress');
    for(const s of [-1,1])Rp(Am([[s*0.5-0.05,14.3],[s*1.3-0.05,14.3],[s*(kneel&&s<0?1.75:2.3)-0.05,16.0],[s*(kneel&&s<0?1.1:1.5)-0.05,16.2]]),'dress','inner');
    Rp(Am([[-1.6,14.3],[1.55,14.3],[1.55,13.95],[-1.62,13.95]]),'hem','inner');
    for(const y of [12.9,12.2,11.5])Ln(Am([[-1.6,y],[0,y-0.12],[1.55,y]]));}
  Rp(Am([[-0.65,16.2],[0.6,16.2],[0.55,17.25],[-0.6,17.3]]),skin);
  R(Am([[-2.35,16.0],[-1.0,16.4],[1.0,16.4],[2.25,16.0],[1.65,15.0],[0,14.55],[-1.75,15.0]]),'collar');
  Ln(Am([[-2.0,15.75],[0,15.3],[1.9,15.75]]),'inner');Ln(Am([[-1.75,15.35],[0,14.92],[1.65,15.35]]),'inner');
  for(let i=0;i<9;i++){const u=-1.6+i*0.4;P.push(dt(u+tx,-(14.78+ty+0.09*u*u),0.09));}
  /* ----- head ----- */
  if(o.head==='falcon'){
    R(Am([[0.4,19.4],[1.0,19.1],[1.35,18.6],[1.6,18.25],[1.5,17.75],[1.1,17.4],[0.7,16.9],[0.2,16.7],[-0.5,16.9],[-1.2,17.6],[-1.3,18.5],[-0.8,19.2],[-0.2,19.45]]),'ivory');
    R(Am([[1.3,18.5],[1.75,18.2],[2.0,17.75],[1.98,17.4],[1.7,17.62],[1.35,17.75]]),'hair','inner');
    P.push(ln(Y(G.circle(0.62+tx,18.55+ty,0.3,14)),'inner',true));D(0.62+tx,18.55+ty,0.14);
    Ln(Am([[0.75,18.2],[0.82,17.75],[0.55,17.4],[0.2,17.45]]),'inner');Ln(Am([[1.0,18.75],[0.3,18.95],[-0.3,18.7]]),'detail');
  }else{
    R(Am([[0.3,19.3],[0.85,19.05],[1.02,18.55],[1.15,18.15],[1.5,17.75],[1.22,17.6],[1.27,17.38],[1.15,17.2],[0.95,16.85],[0.3,16.75],[-0.4,17.0],[-1.1,17.6],[-1.3,18.4],[-0.9,19.1],[-0.3,19.4]]),skin);
    P.push(FK.m(reg(Y(hLens(-0.02+tx,1.04+tx,18.32+ty,0.135)),'inner'),'eye'));D(0.56+tx,18.33+ty,0.15);
    Ln(Am([[0.0,18.32],[-0.7,18.28]]),'inner');Ln(Am([[1.02,18.66],[0.5,18.8],[-0.7,18.58]]),'inner');Ln(Am([[1.24,17.34],[0.92,17.32]]));
    Ln(Am([[-0.3,18.2],[-0.52,17.92],[-0.34,17.62],[-0.2,17.86]]),'inner');
  }
  if(o.wig==='short')R(Am([[0.85,19.2],[0.2,19.7],[-0.7,19.75],[-1.5,19.2],[-1.9,18.2],[-1.75,17.15],[-1.05,16.85],[-0.62,17.4],[-0.58,18.0],[-0.2,18.5],[0.4,18.9]]),'hair');
  else{
    R(Am([[0.85,19.2],[0.2,19.7],[-0.7,19.75],[-1.5,19.2],[-1.95,18.2],[-2.1,16.6],[-2.2,15.3],[-2.1,14.5],[-1.05,14.5],[-0.95,15.8],[-0.8,17.0],[-0.62,17.7],[-0.55,18.05],[-0.2,18.5],[0.4,18.9]]),'hair');
    R(Am([[-0.72,17.8],[-0.25,17.45],[-0.02,16.6],[0.1,15.6],[0.15,14.3],[-0.95,14.3],[-1.0,15.8],[-0.95,16.9]]),'hair');
    for(const y of [18.9,18.2,17.5,16.8,16.1,15.4])Ln(Am([[-1.95,y-0.25],[-1.4,y],[-0.85,y-0.2]]));for(const y of [16.9,16.2,15.5,14.8])Ln(Am([[-0.92,y],[0.08,y]]));
    if(o.head!=='falcon')Ln(Am([[0.9,19.02],[0.0,19.25],[-1.2,18.95],[-1.9,18.3]]),'inner');
  }
  /* ----- crown ----- */
  if(o.crown==='disc'){P.push(FK.m(reg(Y(G.circle(-0.3+tx,21.15+ty,1.5,40)),'outer'),'sun'));
    T(Am([[-1.75,20.75],[-0.3,19.6],[1.25,20.6],[1.75,21.4],[1.45,22.0],[1.85,22.5]]),t=>t>0.74?0.22:0.11,'uraeus','inner');}
  else if(o.crown==='hornDisc'){Rp(Am([[-0.95,19.72],[0.55,19.72],[0.68,20.25],[-1.08,20.25]]),'collar');
    for(const s of [-1,1])T(Am([[-0.2+s*0.55,20.25],[-0.2+s*1.75,21.2],[-0.2+s*1.45,22.95]]),t=>0.3-0.2*t,'hair');
    P.push(FK.m(reg(Y(G.circle(-0.2+tx,21.65+ty,1.08,36)),'outer'),'sun'));T(Am([[0.75,20.25],[1.15,20.7],[0.95,21.2],[1.25,21.55]]),t=>t>0.5?0.2:0.12,'uraeus','inner');}
  else if(o.crown==='feather'){T(Am([[0.92,19.0],[-0.4,19.32],[-1.92,18.6]]),0.13,'sun','inner');T(Am([[-1.92,18.6],[-2.5,18.1]]),0.1,'sun','inner');T(Am([[-1.92,18.6],[-2.45,18.75]]),0.1,'sun','inner');
    put(HG.fit.H6,-0.45+tx,21.3+ty,0.036,{mat:'feather',tone:0});}
  /* ----- arms and what they hold ----- */
  const armW=t=>0.5-0.2*t;const arm=(pts,role)=>T(pts,armW,skin,role);
  const fist=(x,y)=>P.push(FK.m(reg(Y(G.ellipse(x,y,0.36,0.3,14)),'outer'),skin));
  const band=(a,b,k)=>{const x=a[0]+(b[0]-a[0])*k,y=a[1]+(b[1]-a[1])*k;const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;const h=0.42;P.push(FK.m(reg(Y([[x-dy/l*h-dx/l*0.14,y+dx/l*h-dy/l*0.14],[x+dy/l*h-dx/l*0.14,y-dx/l*h-dy/l*0.14],[x+dy/l*h+dx/l*0.14,y-dx/l*h+dy/l*0.14],[x-dy/l*h+dx/l*0.14,y+dx/l*h+dy/l*0.14]]),'inner'),'collar'));};
  const shF=A(2.65,15.45),shR=A(-2.75,15.45);
  if(kneel){
    const up=[shF,[5.2,9.9],[8.9,10.7]],dn=[A(1.6,14.6),[4.6,5.7],[8.0,3.3]];
    hgWing(P,Y(sp(up,false)),{n:15,len:[3.0,6.2],ang:[6,30],tiers:[1,0.6,0.3],mats:['wing1','wing2','wing3'],floor:-0.15});
    hgWing(P,Y(sp(dn,false)),{n:13,len:[2.2,3.0],ang:[-24,-12],tiers:[1,0.6,0.3],mats:['wing1','wing2','wing3'],floor:-0.15});
    arm(up);arm(dn);band(up[1],up[2],0.8);band(dn[1],dn[2],0.8);
    T([up[2],[up[2][0]+0.8,up[2][1]+0.25]],0.2,skin);T([dn[2],[dn[2][0]+0.75,dn[2][1]-0.3]],0.2,skin);
  }else{
    // rear arm
    if(sit){const el=[tx-2.45,8.25],ha=[tx+1.2,7.5];arm([shR,el,ha]);band(el,ha,0.86);fist(ha[0]+0.25,ha[1]);put(HG.fit.S34,ha[0]+1.45,ha[1],0.024,{rot:-90,mat:'amulet'});}
    else{const el=A(-3.25,12.9),ha=A(-3.0,10.5);arm([shR,el,ha]);band(el,ha,0.84);fist(ha[0],ha[1]-0.25);
      if(o.rear==='ankh')put(HG.fit.S34,ha[0],ha[1]-1.55,0.024,{mat:'amulet'});}
    // front arm
    if(o.front==='staff'){const el=sit?[tx+3.2,8.9]:A(3.4,13.0),ha=sit?[4.0,9.4]:A(5.1,12.9);arm([shF,el,ha]);band(el,ha,0.82);staffX=ha[0]+0.1;staffTop=sit?12.7:17.0;
      T([[staffX,0.05],[staffX,staffTop]],0.13,'staff');
      if(o.staff==='wadj'){const s=1.9;hgPut(P,egPapyrus(s).map(p=>FK.m(p,'staff')),staffX,-staffTop,1);}
      else{R([[staffX-0.1,staffTop],[staffX-0.18,staffTop+0.75],[staffX+0.25,staffTop+1.05],[staffX+0.9,staffTop+0.8],[staffX+1.5,staffTop+0.42],[staffX+1.45,staffTop+0.2],[staffX+0.8,staffTop+0.35],[staffX+0.3,staffTop+0.1]],'staff');T([[staffX,staffTop+0.95],[staffX-0.4,staffTop+1.5]],0.1,'staff');
        T([[staffX,0.5],[staffX-0.35,0]],0.1,'staff');T([[staffX,0.5],[staffX+0.35,0]],0.1,'staff');}
      fist(ha[0]+0.1,ha[1]);}
    else if(o.front==='adore'){const el=A(4.2,14.2),ha=A(5.2,16.5);arm([shF,el,ha]);band(el,ha,0.8);T([ha,[ha[0]+0.25,ha[1]+0.95]],0.24,skin);}
    else{const el=A(3.7,13.5),ha=A(5.3,14.4);arm([shF,el,ha]);band(el,ha,0.82);fist(ha[0]+0.1,ha[1]);
      T([[ha[0]+0.1,ha[1]-1.6],[ha[0]+0.25,ha[1]+0.4],[ha[0]+0.6,ha[1]+1.7]],0.09,'staff','inner');hgPut(P,egLotus(1.5).map(p=>FK.m(p,'lotus')),ha[0]+0.62,-(ha[1]+1.7),1,{rot:12});}
  }
  return fitParts(P);
}
const EGFIG=(key,name,term,meaning,o)=>defMotif(key,{name,term,meaning,figure:true,mirrorOk:true,upright:true,fn(){return egFigure(o);}});
EGFIG('egSeatedGod','Enthroned falcon-headed god','Rꜥ-Ḥr-ꜣḫty, "Ra, Horus of the two horizons"','The sun god as a falcon-headed man on a block throne, the disc and its cobra on his head, the was sceptre of dominion in one hand and the ankh of life in the other.',{pose:'sit',sex:'m',head:'falcon',wig:'tri',crown:'disc',front:'staff',staff:'was'});
EGFIG('egEnthronedGoddess','Enthroned goddess','ꜣst (Isis) / Ḥwt-Ḥr (Hathor)','A goddess on a block throne in a sheath dress and long wig, crowned with the sun disc between cow\'s horns, holding the papyrus sceptre and the ankh. By the New Kingdom Isis and Hathor share this crown; only the caption tells them apart.',{pose:'sit',sex:'f',head:'human',wig:'tri',crown:'hornDisc',dress:'sheath',front:'staff',staff:'wadj'});
EGFIG('egWingedGoddess','Kneeling winged goddess','Mꜣꜥt (Ma\'at)','Ma\'at — truth, balance, the right order of the world — kneeling with feathered arms spread in protection, her ostrich plume tied to her head. The pose guards doorways and the ends of coffins.',{pose:'kneel',sex:'f',head:'human',wig:'tri',crown:'feather'});
EGFIG('egOfferingBearer','Striding man with lotus','(offering bearer)','A man in the striding pose — left foot forward, shoulders square to the viewer — in a short wig and linen kilt, bringing a lotus. Rows of such bearers fill the registers of tomb chapels.',{pose:'stand',sex:'m',head:'human',wig:'short',front:'offer'});
EGFIG('egLady','Standing woman in adoration','(dwꜣ, "to adore")','A woman standing with feet together in a long sheath dress and full wig, one hand raised in adoration. Women are painted pale yellow, men red-brown.',{pose:'stand',sex:'f',head:'human',wig:'tri',front:'adore'});

defMotif('offeringTable',{name:'Offering table',term:'ḥtp',upright:true,meaning:'A tall stand heaped with loaves, with lotus flowers laid across the top: what is drawn is provided for ever.',
fn(){const P=[];const Y=p=>p.map(([x,y])=>[x,-y]);
  P.push(reg(Y([[-1.25,0],[1.25,0],[0.5,0.8],[0.36,4.5],[1.0,5.2],[-1.0,5.2],[-0.36,4.5],[-0.5,0.8]]),'outer',{tone:0}));P.push(reg(Y([[-2.9,5.2],[2.9,5.2],[2.9,5.6],[-2.9,5.6]]),'outer',{tone:1}));
  for(const [x,rx,ry] of [[-1.9,0.8,0.72],[1.9,0.8,0.72]])P.push(reg(Y(G.ellipse(x,5.6+ry,rx,ry,24)),'outer',{tone:2}));
  P.push(reg(Y(G.circle(0,6.55,0.95,28)),'outer',{tone:2}));for(const [dx,dy] of [[-0.3,0],[0.3,0],[0,0.35]])P.push(dt(dx,-(6.5+dy),0.1));
  P.push(reg(Y([[-0.95,7.4],[0.95,7.4],[0.55,8.0],[-0.55,8.0]]),'outer',{tone:3}));
  P.push(reg(FK.tube(Y(FK.spline([[2.6,6.4],[1.2,8.3],[-0.8,8.7],[-2.3,8.2]],false,7)),()=>0.07),'inner',{tone:1}));hgPut(P,egLotus(1.5),-2.3,-8.2,1,{rot:-70,tone:4});
  P.push(reg(FK.tube(Y(FK.spline([[2.7,6.5],[1.8,8.9],[0.2,9.5],[-1.2,9.4]],false,7)),()=>0.07),'inner',{tone:1}));hgPut(P,egLotus(1.3),-1.2,-9.4,1,{rot:-62,tone:4});
  return fitParts(P);}});

/* ---------- borders ---------- */
defBorder('egBlock',{name:'Colour-block ladder',fn(L,t){const u=t*1.05,n=Math.max(3,Math.round(L/u)),w=L/n,P=[ln([[0,t*0.14],[L,t*0.14]],'outer'),ln([[0,t*0.86],[L,t*0.86]],'outer')];
  for(let i=0;i<n;i++){const x=i*w;P.push(reg([[x+w*0.06,t*0.2],[x+w*0.6,t*0.2],[x+w*0.6,t*0.8],[x+w*0.06,t*0.8]],'inner',{tone:i%4,plain:true}));
    P.push(reg([[x+w*0.68,t*0.2],[x+w*0.78,t*0.2],[x+w*0.78,t*0.8],[x+w*0.68,t*0.8]],'detail',{tone:9,plain:true}),reg([[x+w*0.86,t*0.2],[x+w*0.96,t*0.2],[x+w*0.96,t*0.8],[x+w*0.86,t*0.8]],'detail',{tone:9,plain:true}));}
  return P;}});
defBorder('egLotusBand',{name:'Lotus and bud frieze',fn(L,t){const n=Math.max(2,Math.round(L/(t*1.0))),w=L/n,P=[ln([[0,t*0.92],[L,t*0.92]],'outer')];
  for(let i=0;i<n;i++){const x=(i+0.5)*w;hgPut(P,egLotus(t*0.74),x,t*0.9,1);
    const bx=(i+1)*w;if(i<n-1){P.push(reg(G.xform(G.petal(t*0.5,t*0.13,'pointed'),{x:bx,y:t*0.72}),'inner',{tone:1,plain:true}));P.push(ln([[bx,t*0.92],[bx,t*0.72]],'detail'));}}
  return P;}});
defBorder('kheker',{name:'Kheker frieze',fn(L,t){const n=Math.max(2,Math.round(L/(t*0.5))),w=L/n,P=[ln([[0,t*0.96],[L,t*0.96]],'outer')];
  for(let i=0;i<n;i++){const x=(i+0.5)*w;P.push(reg(G.xform(G.petal(t*0.6,w*0.4,'pointed'),{x,y:t*0.68}),'outer',{tone:i%2,plain:true}));
    P.push(reg(G.circle(x,t*0.8,w*0.2,14),'inner',{tone:2,plain:true}));P.push(reg([[x-w*0.3,t*0.66],[x+w*0.3,t*0.66],[x+w*0.3,t*0.72],[x-w*0.3,t*0.72]],'detail',{tone:3,plain:true}));
    P.push(ln([[x,t*0.62],[x,t*0.2]],'detail'));}
  return P;}});

/* ---------- layouts ---------- */
// what share of the genome's sign vocabulary is Egyptian script (so blends mix the two)
function hgShare(g){const has=a=>a.some(k=>SG.motifs[k]&&SG.motifs[k].glyph)?1:0;const v=g.motifs.ring;if(!v)return 0;
  return Array.isArray(v)?has(v):has(v.pool[0])*(1-v.t)+has(v.pool[1])*v.t;}
// an endless supply of square groups: stock formulas in order, or the other parent's motifs
function hgStream(ctx){const {g,rng}=ctx;const share=hgShare(g);
  const other=[...new Set([...poolAll(g.motifs.ring),...poolAll(g.motifs.filler)])].filter(k=>SG.motifs[k]&&!SG.motifs[k].glyph&&!SG.motifs[k].figure&&k!=='dot');
  let queue=[],deck=[];
  return()=>{if(!(share>0)||(other.length&&rng.next()>share))return{motif:other.length?rng.pick(other):ctx.pick('ring')};
    if(!queue.length){if(!deck.length)deck=rng.shuffle(HG.formulas);queue=deck.pop().seq.slice();}const k=queue.shift();
    if(k==='#')return{cart:true,spec:rng.pick(HG.carts).s};return{spec:HG.words[k].s};};}
// fill one column top to bottom with square groups; a formula may be cut off, as on a wall fragment
function hgColumn(ctx,cx,y0,y1,Q,next,o={}){
  const flip=!!o.flip;const gap=Q*0.1;let y=y0,n=0,miss=0;
  for(let guard=0;guard<120&&miss<5;guard++){const it=next();
    if(it.motif){const s=Q*0.84;if(y+s>y1){miss++;continue;}const M=SG.motifs[it.motif];ctx.motif(it.motif,cx,y+s/2,s,{role:'ring',flip:flip&&!(M&&M.figure),variant:it.motif+'|q'+(n++%3),noOcc:true});y+=s+gap;continue;}
    const q=it.cart?Q*0.7:Q;const quads=it.spec.split('-').map(sp=>hgQuad(sp,q));const pad=it.cart?Q*0.16:0;
    const tot=quads.reduce((a,b)=>a+b.h,0)+gap*0.7*(quads.length-1)+2*pad+(it.cart?Q*0.1:0);
    if(y+tot>y1&&(it.cart||quads.length===1||y+quads[0].h>y1)){miss++;continue;}
    let yy=y+pad,cut=false;const rub=!!o.pen&&!it.cart&&ctx.rng.next()<0.07;
    for(const L of quads){if(yy+L.h>y1){cut=true;break;}
      for(const s of L.signs)ctx.motif(s.key,cx+(flip?-1:1)*s.x,yy+s.y,s.size,{role:'ring',flip,variant:s.key+'|'+(o.tag||'')+(n%3)+(rub?'r':''),noOcc:true,pen:!!o.pen,rubric:rub});
      n++;yy+=L.h+gap*0.7;}
    if(it.cart){const yEnd=yy-gap*0.7+pad;ctx.parts([{kind:'line',closed:true,role:'outer',pts:G.roundRect(cx-Q*0.44,y,cx+Q*0.44,yEnd,Q*0.38,8)},{kind:'line',closed:false,role:'outer',pts:[[cx-Q*0.48,yEnd+Q*0.06],[cx+Q*0.48,yEnd+Q*0.06]]}],'ring');y=yEnd+Q*0.06+gap;}
    else y=yy-gap*0.7+gap;
    if(cut)break;
  }
}
// bounding box of a motif after fitting, as fractions of its size
const HGBOX={};function hgBox(key,g){if(!HGBOX[key]){const M=SG.motifs[key];const b=M?hgBBox(M.fn(makeRng(7),g)):{w:100,h:100};HGBOX[key]={w:b.w/100,h:b.h/100};}return HGBOX[key];}
// stand a motif on a baseline at a given height; returns its width
function hgStand(ctx,key,x,base,height,o={}){const b=hgBox(key,ctx.g);const M=SG.motifs[key];const fig=M&&(M.figure||M.upright);const s=height/b.h;
  ctx.motif(key,x,base-height/2,s,Object.assign({role:'hero',noOcc:true},o,{flip:!!o.flip&&(!M||!M.figure||M.mirrorOk)}));return b.w*s;}

defStructure('inscription',{name:'Glyph columns',blurb:'Vertical columns of signs between ruled dividers, each word packed into square groups — a carved and painted wall inscription.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;const d=clamp(S.density);
  const inner=frameBands(ctx,{x0:26,y0:26,x1:W-26,y1:H-26},Math.min(1,Math.round(S.borderBands||0)),40);
  const iw=inner.x1-inner.x0;let top=inner.y0+10;
  const wides=poolAll(g.motifs.hero).filter(k=>SG.motifs[k]&&SG.motifs[k].wide);const hk=wides.length?rng.pick(wides):ctx.pick('hero'),HM=SG.motifs[hk];
  if(HM&&HM.wide&&rng.chance(.7)){const hs=iw*0.86;ctx.motif(hk,W/2,top+hs*HM.wide/2,hs,{role:'hero',variant:'head',noOcc:true});top+=hs*HM.wide+16;
    ctx.parts([{kind:'region',closed:true,role:'inner',plain:true,tone:31,pts:[[inner.x0+4,top-8],[inner.x1-4,top-8],[inner.x1-4,top-2],[inner.x0+4,top-2]]}],'frame');}
  const cols=Math.round(lerp(3,6,d));const pitch=iw/cols,dv=pitch*0.06,Q=pitch*0.8;const bot=inner.y1-10;
  const D=[];for(let i=0;i<=cols;i++){const x=inner.x0+i*pitch+(i===0?dv/2+2:i===cols?-dv/2-2:0);D.push({kind:'region',closed:true,role:'inner',plain:true,tone:30,pts:[[x-dv/2,top],[x+dv/2,top],[x+dv/2,bot],[x-dv/2,bot]]});}
  ctx.items.push({type:'parts',parts:D,role:'frame',variant:'divider'});
  const next=hgStream(ctx);const facing=S.symmetry!=='free';
  for(let c=0;c<cols;c++){const cx=inner.x0+(c+.5)*pitch;hgColumn(ctx,cx,top+pitch*0.08,bot-pitch*0.04,Q,next,{flip:facing&&cx>W/2+1,tag:'c'+(c%2)});}
}});

defStructure('vignette',{name:'Papyrus vignette',blurb:'A figure on a ground line facing an offering table, with ruled columns of text beside and above — a page of a funerary papyrus.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;const d=clamp(S.density);
  const inner=frameBands(ctx,{x0:30,y0:30,x1:W-30,y1:H-30},Math.min(1,Math.round(S.borderBands||0)),34);
  const x0=inner.x0+8,x1=inner.x1-8,y0=inner.y0+8,y1=inner.y1-8,iw=x1-x0,ih=y1-y0;const rect=(a,b,c,e)=>[[a,b],[c,b],[c,e],[a,e]];
  ctx.parts([{kind:'line',closed:true,role:'outer',pts:rect(x0,y0,x1,y1)}],'frame');
  const base=y1-ih*0.09;const next=hgStream(ctx);const script=hgShare(g)>0.5; // other cultures' motifs are heavier than signs: fewer, larger columns
  const heroes=rng.shuffle(poolAll(g.motifs.hero).filter(k=>SG.motifs[k]&&!SG.motifs[k].wide));const figs=heroes.filter(k=>SG.motifs[k].figure);
  const ring=poolAll(g.motifs.ring);const table=ring.includes('offeringTable')?'offeringTable':ctx.pick('ring');
  const grid=(gx0,gx1,gy0,gy1,n,tag)=>{const pw=(gx1-gx0)/n;const L=[];for(let i=0;i<=n;i++)L.push({kind:'line',role:'inner',pts:[[gx0+i*pw,gy0],[gx0+i*pw,gy1]]});L.push({kind:'line',role:'inner',pts:[[gx0,gy0],[gx1,gy0]]},{kind:'line',role:'inner',pts:[[gx0,gy1],[gx1,gy1]]});
    ctx.items.push({type:'parts',parts:L,role:'frame',variant:'grid'+tag});for(let i=0;i<n;i++)hgColumn(ctx,gx0+(i+.5)*pw,gy0+pw*0.12,gy1-pw*0.06,pw*0.78,next,{tag:tag+(i%2),pen:true});};
  if(figs.length>=2&&rng.chance(.5)){
    // two figures facing across a table, captions in a band above
    // wide figures (spread wings) leave no room for a table; the text then comes down to meet them
    const asp=k=>hgBox(k,g).w/hgBox(k,g).h;const pairW=asp(figs[0])+asp(figs[1]);const withTable=pairW<1.7;const need=pairW+(withTable?asp(table)*0.5+0.2:0.12);
    const fh=Math.min((base-y0)*0.7,iw*0.95/need);const wa=asp(figs[0])*fh,wb=asp(figs[1])*fh,wt=withTable?asp(table)*fh*0.5:0,sp=(iw-wa-wb-wt)/(withTable?4:3);
    ctx.parts([{kind:'region',closed:true,role:'inner',plain:true,tone:31,pts:rect(x0,base,x1,base+ih*0.022)}],'frame');
    hgStand(ctx,figs[0],x0+sp+wa/2,base,fh,{variant:'fa'});hgStand(ctx,figs[1],x1-sp-wb/2,base,fh,{variant:'fb',flip:true});
    if(withTable)hgStand(ctx,table,x0+sp*2+wa+wt/2,base,fh*0.5,{variant:'tb',role:'ring'});
    grid(x0+iw*0.04,x0+iw*0.96,y0+ih*0.02,base-fh*1.07,Math.round(script?lerp(7,11,d):lerp(5,7,d)),'cap');
  }else{
    const hero=figs[0]||heroes[0]||ctx.pick('hero');const fh=(base-y0)*0.7;const gx=x0+iw*0.62;
    ctx.parts([{kind:'region',closed:true,role:'inner',plain:true,tone:31,pts:rect(x0,base,gx-iw*0.02,base+ih*0.022)}],'frame');
    const fw=hgStand(ctx,hero,x0+iw*0.03+hgBox(hero,g).w/hgBox(hero,g).h*fh/2,base,fh,{variant:'fa'});
    const tx0=x0+iw*0.05+fw;hgStand(ctx,table,Math.min(gx-iw*0.11,tx0+iw*0.09),base,fh*0.5,{variant:'tb',role:'ring'});
    grid(Math.max(tx0-iw*0.04,x0+iw*0.34),gx-iw*0.03,y0+ih*0.03,base-fh*0.62,3,'cap');
    grid(gx,x1-iw*0.01,y0+ih*0.02,y1-ih*0.02,Math.round(script?lerp(4,8,d):lerp(3,4,d)),'txt');
  }
}});

defStructure('registers',{name:'Wall registers',blurb:'Horizontal bands stacked up the wall, each a row of figures and things standing on its own ground line.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;const d=clamp(S.density);
  const inner=frameBands(ctx,{x0:26,y0:26,x1:W-26,y1:H-26},Math.min(1,Math.round(S.borderBands||0)),40);
  const x0=inner.x0+10,x1=inner.x1-10,ih=inner.y1-inner.y0;const rows=Math.round(lerp(2,4,d)),rh=ih/rows;const next=hgStream(ctx);
  const heroes=poolAll(g.motifs.hero).filter(k=>SG.motifs[k]&&!SG.motifs[k].wide&&k!=='dot');
  const rings=poolAll(g.motifs.ring).filter(k=>SG.motifs[k]&&!SG.motifs[k].glyph&&!SG.motifs[k].wide&&k!=='dot');
  for(let r=0;r<rows;r++){const base=inner.y0+(r+1)*rh-rh*0.08;const fh=rh*0.74;
    ctx.items.push({type:'parts',parts:[{kind:'region',closed:true,role:'inner',plain:true,tone:31,pts:[[inner.x0+4,base],[inner.x1-4,base],[inner.x1-4,base+rh*0.035],[inner.x0+4,base+rh*0.035]]}],role:'frame',variant:'base'});
    const A=rng.pick(heroes.length?heroes:['floret']),B=rng.pick(rings.length?rings:heroes.length?heroes:['floret']);const flip=r%2===1;
    const wa=hgBox(A,g).w/hgBox(A,g).h*fh,hb=fh*0.56,wb=hgBox(B,g).w/hgBox(B,g).h*hb;const capW=fh*0.2;
    const unit=wa+wb+capW+fh*0.22;const n=Math.max(1,Math.floor((x1-x0)/unit));const sp=(x1-x0)/n;
    for(let i=0;i<n;i++){const u0=x0+i*sp;const xa=u0+sp*0.5-(wb+capW)/2*(flip?-1:1)*0.9,xb=u0+sp*0.5+(wa/2+capW*0.5)*(flip?-1:1)*0.9;
      hgStand(ctx,A,xa,base,fh,{variant:'ra'+(r%2),flip});hgStand(ctx,B,xb,base,hb,{variant:'rb'+(r%2),role:'ring',flip});
      hgColumn(ctx,xb,base-fh*1.02,base-hb-fh*0.06,capW,next,{flip,tag:'r'+r});}
  }
}});

/*COLLAR*/defStructure('collar',{name:'Broad collar',blurb:'Concentric hanging rows of beads, petals and drops closing on two terminals, with a pectoral below — the wesekh collar.',
fn(ctx){
  const {W,H,g,rng}=ctx;const S=g.structure;const d=clamp(S.density);const cx=W/2,cy=H*0.215,R0=W*0.15,R1=W*0.44;const a0=-4,a1=184;
  const shape=g.motifs.petal||'pointed';let r=R0,k=0;const kinds=['tubes','beads','petals','tubes','motifs','beads','petals'];
  const arcLine=rr=>({kind:'line',closed:false,role:'outer',pts:G.arc(cx,cy,rr,a0,a1,90)});
  ctx.parts([arcLine(R0)],'ring');
  while(r<R1-30){const kind=kinds[k++%kinds.length];const room=R1-30-r;
    if(kind==='beads'){const rr=r+8,m=Math.round((a1-a0)*DEG*rr/13),P=[];for(let i=0;i<=m;i++){const a=(a0+(a1-a0)*i/m)*DEG;P.push({kind:'dot',x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr,r:3.6,role:'outer'});}P.push(arcLine(r+16));ctx.parts(P,'ring');r+=16;}
    else if(kind==='tubes'){const b=Math.min(room,lerp(34,24,d)),m=Math.round((a1-a0)*DEG*(r+b/2)/lerp(20,13,d)),P=[];for(let i=0;i<m;i++){const s=(a1-a0)/m;P.push({kind:'region',closed:true,role:'inner',plain:true,tone:i%3,pts:polarCell(cx,cy,r+2,r+b-2,a0+i*s+s*0.1,a0+(i+1)*s-s*0.1,3)});}P.push(arcLine(r+b));ctx.items.push({type:'parts',parts:P,role:'ring',variant:'tb'+k});r+=b;}
    else if(kind==='petals'){const b=Math.min(room,rng.range(40,56)),m=Math.round((a1-a0)*DEG*(r+b/2)/(b*0.5)),P=[];for(let i=0;i<m;i++){const a=a0+(a1-a0)*(i+0.5)/m;P.push({kind:'region',closed:true,role:'outer',tone:i%2,plain:true,pts:G.xform(polarPetal(r+1,b-3,Math.PI*(r+b/2)*(a1-a0)/360/m*1.7,a+90,shape),{x:cx,y:cy})});}P.push(arcLine(r+b));ctx.items.push({type:'parts',parts:P,role:'ring',variant:'pt'+k});r+=b;}
    else{const b=Math.min(room,rng.range(46,62));if(b<30){r+=8;continue;}const m=Math.round((a1-a0)*DEG*(r+b/2)/(b*0.95));const key=ctx.pick('ring');for(let i=0;i<m;i++){const a=a0+(a1-a0)*(i+0.5)/m;ctx.motif(key,cx+Math.cos(a*DEG)*(r+b/2),cy+Math.sin(a*DEG)*(r+b/2),b*0.84,{role:'ring',rot:a-90,variant:'cm'+k,noOcc:true});}ctx.parts([arcLine(r+b)],'ring');r+=b;}
  }
  // outer row of drop pendants, and the two terminals
  const m=Math.round((a1-a0)*DEG*r/22),P=[];for(let i=0;i<m;i++){const a=a0+(a1-a0)*(i+0.5)/m;P.push({kind:'region',closed:true,role:'outer',tone:i%2,plain:true,pts:G.xform(polarPetal(r+1,26,9,a+90,'drop'),{x:cx,y:cy})});}
  ctx.items.push({type:'parts',parts:P,role:'ring',variant:'drops'});
  for(const [a,s] of [[a0,-1],[a1,1]]){const mx=cx+Math.cos(a*DEG)*(R0+r)/2,my=cy+Math.sin(a*DEG)*(R0+r)/2,rr=(r-R0)/2;const cap=G.arc(mx,my,rr,a+(s<0?180:0),a+(s<0?360:180),30);
    ctx.items.push({type:'parts',parts:[{kind:'region',closed:true,role:'outer',plain:true,tone:5,pts:cap},{kind:'line',role:'inner',pts:G.arc(mx,my,rr*0.84,a+(s<0?180:0),a+(s<0?360:180),30)},{kind:'line',role:'inner',pts:G.arc(mx,my,rr*0.5,a+(s<0?180:0),a+(s<0?360:180),24)}],role:'ring',variant:'terminal'});}
  const below=H-(cy+r+26);const hk=ctx.pick('hero');const HM=SG.motifs[hk];const hs=Math.min(W*0.42,below*(HM&&HM.wide?1/HM.wide:1)*0.8);
  if(below>70)ctx.motif(hk,cx,cy+r+26+below*0.48,hs,{role:'hero',variant:'pectoral'});
  ctx.occ.push([cx,cy,r+30]);
}});
