'use strict';
/* Style Genome — the shared schema every culture is described in.

   A tradition = metadata + AXES (0..1 comparison profile) + GENES (what the renderer
   actually uses). Genes are grouped so they can be blended or spliced independently:

     structure  how the surface is organised (panel, medallion, field, kolam grid ...)
     motifs     the vocabulary: hero / ring / filler / border motif pools
     line       weight, contrast, double outline, wobble, taper, broken lines, stitch dash
     fill       how closed regions are coloured (flat, hatch, dots, gold ...)
     ornament   secondary decoration: dot rows, echo lines, scallops, beads, glow arcs
     palette    ground, ink, fill colours
     ground     surface texture (paper, mud wall, cloth ...)

   A culture family is just a file in js/traditions/ that calls defFamily + defTradition. */

const SG={families:[],traditions:[],byId:{},motifs:{},structures:{},borders:{}};

function defFamily(f){SG.families.push(f);return f;}
function defTradition(t){
  const req=['id','family','name','axes','genes'];
  for(const k of req)if(t[k]==null)throw new Error('tradition '+(t.id||'?')+' missing '+k);
  for(const g of GENE_GROUPS)if(!t.genes[g.id])throw new Error(t.id+' missing gene group '+g.id);
  for(const p of ['hero','ring','filler','border'])for(const m of t.genes.motifs[p]||[]){
    const reg=p==='border'?SG.borders:SG.motifs;
    if(!reg[m])console.warn(t.id+': unknown '+p+' motif '+m);
  }
  SG.traditions.push(t);SG.byId[t.id]=t;return t;
}
function defMotif(key,o){SG.motifs[key]=Object.assign({key},o);}
function defStructure(key,o){SG.structures[key]=Object.assign({key},o);}
function defBorder(key,o){SG.borders[key]=Object.assign({key},o);}

/* Comparison axes. `measured` = the Lab can estimate it from pixels. */
const AXES=[
  {id:'density',   label:'Density',     lo:'open, negative space', hi:'every gap filled (horror vacui)', measured:true},
  {id:'weight',    label:'Line weight', lo:'hair-fine',            hi:'bold',                          measured:true},
  {id:'uniformity',label:'Monoline',    lo:'swelling, tapered',    hi:'one even pen width',            measured:true},
  {id:'geometry',  label:'Geometric',   lo:'curvilinear, organic', hi:'rectilinear, constructed',      measured:true},
  {id:'symmetry',  label:'Symmetry',    lo:'free, asymmetric',     hi:'strict mirror / radial',        measured:true},
  {id:'fill',      label:'Filled',      lo:'pure outline',         hi:'solid filled planes',           measured:true},
  {id:'chroma',    label:'Colour',      lo:'monochrome',           hi:'saturated polychrome',          measured:true},
  {id:'ornament',  label:'Ornament',    lo:'plain contour',        hi:'dense secondary ornament',      measured:true},
  {id:'abstraction',label:'Stylised',   lo:'naturalistic',         hi:'abstract, schematic',           measured:false},
  {id:'narrative', label:'Narrative',   lo:'pure decoration',      hi:'tells a story',                 measured:false}
];

const GENE_GROUPS=[
  {id:'structure',label:'Structure',blurb:'How the surface is organised'},
  {id:'motifs',   label:'Motifs',   blurb:'The vocabulary of shapes'},
  {id:'line',     label:'Line',     blurb:'Weight, contrast, outline technique'},
  {id:'fill',     label:'Fill',     blurb:'How regions are coloured'},
  {id:'ornament', label:'Ornament', blurb:'Secondary decoration'},
  {id:'palette',  label:'Palette',  blurb:'Ground, ink and fill colours'},
  {id:'ground',   label:'Surface',  blurb:'Paper, wall, cloth texture'}
];

const FILL_MODES={
  none:'Outline only',flat:'Flat colour',hatch:'Parallel hatching',crosshatch:'Cross-hatching',
  dots:'Colour + dot pattern',dashes:'Colour + dash pattern',stitch:'Running-stitch rows',gold:'Gold leaf + gesso',rarrk:'Fine cross-hatched bands (rarrk)'
};

/* ---------- blending ----------
   t=0 → all A, t=1 → all B. Numbers interpolate; discrete choices flip at a per-gene
   threshold (so genes cross over one at a time as t moves); colour pools merge
   with weights; motif vocabularies merge so a single artwork draws from both.
   pins[group] = 'A' | 'B' forces a whole group from one parent (gene splicing). */
function geneThreshold(name){return 0.22+0.56*(hashStr('thr:'+name)%1000)/1000;}

function blendGenes(A,B,t,pins={}){
  const out={},src={};
  for(const grp of GENE_GROUPS){
    const g=grp.id;const pin=pins[g];
    const tg=pin==='A'?0:pin==='B'?1:t;
    const a=A.genes[g],b=B.genes[g];
    out[g]=blendGroup(g,a,b,tg);
    src[g]=A.id===B.id?'A':tg<=0?'A':tg>=1?'B':'mix';
  }
  out._t=t;out._src=src;out._parents=[A.id,B.id];
  out._tg={};for(const grp of GENE_GROUPS){const p=pins[grp.id];out._tg[grp.id]=p==='A'?0:p==='B'?1:t;}
  return out;
}
function pickDisc(name,a,b,t){return t>=geneThreshold(name)?b:a;}
function blendGroup(g,a,b,t){
  if(t<=0)return JSON.parse(JSON.stringify(a));
  if(t>=1)return JSON.parse(JSON.stringify(b));
  const o={};
  const keys=new Set([...Object.keys(a),...Object.keys(b)]);
  for(const k of keys){
    const va=a[k],vb=b[k];const nm=g+'.'+k;
    // a gene only one parent has: numbers fade in from 0, anything else switches at t=0.5
    if(va==null){o[k]=typeof vb==='number'?vb*t:t>=0.5?vb:undefined;continue;}
    if(vb==null){o[k]=typeof va==='number'?va*(1-t):t<0.5?va:undefined;continue;}
    if(g==='palette'){
      if(k==='fills'){o[k]={pool:[va,vb],t};continue;} // resolved per region at render time
      if(typeof va==='string'&&va[0]==='#'&&typeof vb==='string'&&vb[0]==='#'){
        // similar lightness: interpolate. Light vs dark: averaging makes mud, so take one
        // parent's colour (flipping at the gene threshold) tinted 25% toward the other.
        if(Math.abs(C.L(va)-C.L(vb))<0.25)o[k]=C.mix(va,vb,t);
        else o[k]=t>=geneThreshold(nm)?C.mix(vb,va,(1-t)*0.25):C.mix(va,vb,t*0.25);
        continue;
      }
      o[k]=pickDisc(nm,va,vb,t);continue;
    }
    if(g==='motifs'&&Array.isArray(va)){o[k]={pool:[va,vb],t};continue;}
    if(g==='structure'&&k==='kinds'){o[k]=pickDisc(nm,va,vb,t);continue;}
    if(typeof va==='number'&&typeof vb==='number'){o[k]=lerp(va,vb,t);continue;}
    if(typeof va==='boolean'||typeof va==='string'){o[k]=pickDisc(nm,va,vb,t);continue;}
    if(typeof va==='object'&&!Array.isArray(va)){ // weighted dicts (fill.modes)
      const d={};for(const kk of new Set([...Object.keys(va),...Object.keys(vb)]))d[kk]=lerp(va[kk]||0,vb[kk]||0,t);
      o[k]=d;continue;
    }
    o[k]=pickDisc(nm,va,vb,t);
  }
  // keep ink legible against the blended ground
  if(g==='palette'&&Math.abs(C.L(o.ink)-C.L(o.ground))<0.32){
    const cands=[a.ink,b.ink,'#161210','#f7f1e6'];
    o.ink=cands.reduce((best,c)=>Math.abs(C.L(c)-C.L(o.ground))>Math.abs(C.L(best)-C.L(o.ground))?c:best,cands[0]);
  }
  if(g==='structure')o.symmetry=t>=geneThreshold('structure.kinds')?b.symmetry:a.symmetry;
  return o;
}
// resolve a {pool:[a,b],t} or a plain array to one item
function poolPick(v,rng){
  if(!v)return null;
  if(Array.isArray(v))return v.length?rng.pick(v):null;
  const side=rng.next()<v.t?1:0;const arr=v.pool[side]&&v.pool[side].length?v.pool[side]:v.pool[1-side];
  return rng.pick(arr);
}
function poolAll(v){if(!v)return[];if(Array.isArray(v))return v;return[...new Set([...v.pool[0],...v.pool[1]])];}

// genes of a single tradition, in the same shape blendGenes returns
function pureGenes(T){return blendGenes(T,T,0);}
