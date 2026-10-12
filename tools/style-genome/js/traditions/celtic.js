'use strict';
/* Celtic — fourth culture family, carried over from culture-loom (whose Celtic preset was
   interlace with a triquetra crown and a spiral-finial staff) and rebuilt here as drawing
   grammar. All four traditions are CURATED: no reference images yet. The interlace is
   woven by weave.js — every cord alternates over and under. */

defFamily({id:'celtic',name:'Celtic & Insular',native:'',
  blurb:'Interlace, spirals and key patterns — from Iron Age La Tène bronzes and Pictish symbol stones to the gospel books of Ireland and Britain, and the knotwork revival that followed.'});

const CELTIC_CARE='The "meanings" attached to Celtic knots today (eternal love, a different knot for each virtue) are modern. In the gospel books the ornament glorifies a sacred text, and the carpet pages are built around crosses; the generators draw the ornament grammar, not the crosses or evangelist portraits.';

defTradition({
  id:'insular-knotwork',family:'celtic',provenance:'curated',
  name:'Insular interlace',sub:'Gospel-book knotwork and carpet pages',native:'',
  region:'Ireland, Iona and Northumbria',medium:'Ink and mineral pigments on vellum',period:'c. 650–850 CE (Durrow, Lindisfarne, Kells)',
  summary:'The Insular gospel books fill whole pages with ornament: panels of interlaced cords that never begin or end, spirals and key patterns, framed by braided borders. Every cord passes over, then under, in strict alternation, and the colours run with the strands — orpiment yellow, red lead, verdigris green, purple — on the warm ground of the vellum.',
  axes:{density:.9,weight:.35,uniformity:.85,geometry:.55,symmetry:.9,fill:.8,chroma:.65,ornament:.75,abstraction:.95,narrative:.05},
  genes:{
    structure:{kinds:['knotwork','panel'],folds:8,density:.6,symmetry:'bilateral',borderBands:1},
    motifs:{hero:['knot','triskele','triquetra'],ring:['triskele','knot','triquetra'],filler:['triquetra','spiral','dot'],border:['plait','knotChain'],petal:'pointed'},
    line:{weight:2.2,contrast:.2,double:false,wobble:.05,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:.92,hatchGap:6},
    ornament:{dotRows:.35,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:['#b8402a'],groundStitch:false},
    palette:{ground:'#ecdfbf',ink:'#1d1a16',fills:['#d9a527','#b23a2a','#3f7a5a','#6b3f6e','#2c4f8a'],gap:'#ecdfbf'},
    ground:{kind:'paper',amount:.4}
  },
  rules:[
    'Lay out a plait on a grid of dots first; every cord runs on the diagonals between them.',
    'Break the plait to make knots: at chosen points between two dots the cord turns back instead of crossing. Place breaks symmetrically.',
    'Over, under, over, under — never two overs in a row, and no loose ends: every cord closes on itself.',
    'Give each strand its own colour all the way round, and keep the gaps between cords narrower than the cords.',
    'Divide the page into framed panels (interlace, spirals, key patterns) inside a braided border, and outline initials and frames with rows of red dots.'
  ],
  glossary:[
    ['Interlace','Woven-cord ornament that alternates over and under itself in a continuous loop.'],
    ['Plait','The unbroken braid of diagonal cords that knotwork is built from; a plait of m by n dots has as many separate strands as the greatest common divisor of m and n.'],
    ['Break','A point where the cord turns back instead of crossing — what turns a plait into a knot.'],
    ['Carpet page','A full page of ornament with no text, usually built around a cross, placed before each gospel.'],
    ['Insular','The shared art of Ireland and Britain c. 600–900, mixing Celtic spirals, Germanic animal interlace and Mediterranean book culture.']
  ],
  maths:'The knot generator is the plait-with-breaks construction (as taught by George Bain and analysed by Peter Cromwell), which is the same mirror-curve model the kolam generator uses: the cord runs diagonally between dots and reflects at breaks. Over and under can always alternate consistently, because the regions of such a drawing can be coloured like a chessboard; here the rule is local — a cord at crossing (x, y) moving in direction (dx, dy) goes over when "x is even" agrees with "dx·dy is positive".',
  symbolism:'Interlace reached the British Isles with late Roman mosaic and Mediterranean manuscripts; by the 8th century, merged with Anglo-Saxon animal ornament, it had become the signature of the Insular style. In the books it honours the sacred text — the density of the work is itself the offering.',
  care:CELTIC_CARE,
  reading:['George Bain, Celtic Art: The Methods of Construction (1951)','J. Romilly Allen, Celtic Art in Pagan and Christian Times (1904)','Michelle P. Brown, The Lindisfarne Gospels: Society, Spirituality and the Scribe (British Library, 2003)','Peter R. Cromwell, "Celtic knotwork: mathematical art", The Mathematical Intelligencer 15 (1993)']
});

defTradition({
  id:'la-tene',family:'celtic',provenance:'curated',
  name:'La Tène metalwork',sub:'Mirror style and trumpet spirals',native:'',
  region:'Central Europe to Britain and Ireland',medium:'Bronze — engraved, chased and repoussé; red enamel and coral',period:'c. 450 BCE – 1st c. CE',
  summary:'The Iron Age art of the Celts: curves laid out with compasses into triskeles, S-scrolls and swelling "trumpets" that never settle into strict symmetry. On British bronze mirrors the voids between the curves are filled with basketry hatching — tiny alternating blocks of parallel lines — that catch the light.',
  axes:{density:.6,weight:.4,uniformity:.55,geometry:.35,symmetry:.55,fill:.6,chroma:.25,ornament:.6,abstraction:.95,narrative:0},
  genes:{
    structure:{kinds:['mirror','panel','medallion'],folds:6,density:.4,symmetry:'radial',borderBands:1},
    motifs:{hero:['triskele','sScroll'],ring:['sScroll','spiral','triskele'],filler:['spiral','dot'],border:['scrollBand','lines'],petal:'drop'},
    line:{weight:2.4,contrast:.35,double:false,wobble:.06,taper:.35,breaks:0,dash:null,misreg:0},
    fill:{modes:{crosshatch:.55,hatch:.25,flat:.2},coverage:.75,hatchGap:4.2},
    ornament:{dotRows:.1,echo:.35,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:['#b3261e'],groundStitch:false},
    palette:{ground:'#b98a4a',ink:'#3a2612',fills:['#cfa463','#8a5a26','#b3261e'],gap:'#b98a4a',metal:'#d6a85a'},
    ground:{kind:'metal',amount:.6}
  },
  rules:[
    'Lay the design out with compasses: every curve is an arc, and arcs meet in sharp, lens-shaped "trumpet" voids.',
    'Prefer three-fold turning (the triskele) and S-curves to mirror symmetry; balance rather than repeat.',
    'Fill some voids with basketry hatching — small blocks of parallel lines turning 90° from block to block — and leave others polished.',
    'Let one or two red enamel or coral studs be the only colour against the bronze.'
  ],
  glossary:[
    ['Triskele','Three spirals or legs turning the same way from one centre.'],
    ['Trumpet','A curve that flares from a point into a wide mouth; joined trumpets make the lens-shaped voids typical of the style.'],
    ['Basketry hatching','Infill of tiny blocks of parallel lines, alternating direction like woven cane — the hallmark of British "mirror style".'],
    ['Repoussé','Relief hammered up from the back of the sheet.']
  ],
  symbolism:'Named after the site of La Tène on Lake Neuchâtel. The ornament is on prestige objects — mirrors, shields, torcs, helmets, scabbards — and its meanings are unrecorded; the curvilinear vocabulary itself carried on into Insular metalwork and the gospel books.',
  care:'Nothing written survives from the makers about what these forms meant; read them as ornament.',
  reading:['Ruth and Vincent Megaw, Celtic Art: From its Beginnings to the Book of Kells (Thames & Hudson, 1989)']
});

defTradition({
  id:'pictish-stones',family:'celtic',provenance:'curated',
  name:'Pictish symbol stones',sub:'Incised symbols on undressed stone',native:'',
  region:'Eastern and northern Scotland',medium:'Lines pecked and incised into boulders and slabs',period:'c. 5th–9th c. CE',
  summary:'The Picts cut a small, fixed set of abstract and animal symbols into standing stones: the crescent and V-rod, the double disc and Z-rod, the mirror and comb, and others — usually two together, sometimes with a mirror and comb below. A clean incised line on rough stone, no frame, no background.',
  axes:{density:.2,weight:.55,uniformity:.8,geometry:.45,symmetry:.75,fill:.05,chroma:.05,ornament:.3,abstraction:.9,narrative:.2},
  genes:{
    structure:{kinds:['stele','sheet'],folds:8,density:.2,symmetry:'bilateral',borderBands:0},
    motifs:{hero:['crescentVrod','doubleDisc','mirrorComb'],ring:['crescentVrod','doubleDisc','mirrorComb'],filler:['spiral','dot'],border:['lines'],petal:'drop'},
    line:{weight:3.4,contrast:.25,double:false,wobble:.35,taper:0,breaks:.1,dash:null,misreg:0},
    fill:{modes:{none:1},coverage:0,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#9a968a',ink:'#3a3833',fills:['#a9a598','#8c887c'],gap:'#9a968a'},
    ground:{kind:'stone',amount:.85}
  },
  rules:[
    'Use the stone as found — an undressed boulder or slab — and cut straight into its face.',
    'Pair two symbols, one above the other; add a mirror and comb beneath when the pair calls for it.',
    'Keep the line clean and even, pecked then smoothed into a groove; let the stone\'s surface do the rest.',
    'Decorate inside the symbols (scrolls, small circles) but leave the stone around them empty.'
  ],
  glossary:[
    ['Class I stone','An undressed stone carrying incised symbols only — no cross.'],
    ['V-rod and Z-rod','Broken rods, bent like a V or a Z, laid across the crescent and the double disc; their ends are often flowered or arrow-headed.']
  ],
  symbolism:'About thirty symbols recur across some two hundred stones. Their meaning is unknown: they have been read as personal or lineage names, ranks, marriage alliances or memorials. The generators reproduce the forms and offer no reading.',
  care:'Later (Class II) stones add a relief cross; those are documented, not generated. The symbols here are simplified constructions, not copies of particular stones.',
  reading:['Isabel Henderson, The Picts (Thames & Hudson, 1967)']
});

defTradition({
  id:'celtic-revival',family:'celtic',provenance:'curated',
  name:'Celtic revival knotwork',sub:'Jewellery, tattoo and print',native:'',
  region:'Ireland, Scotland and the diaspora',medium:'Engraved silver, tattoo, print and vector line',period:'Celtic Revival from the 1840s; Bain\'s method from 1951; today',
  summary:'The knotwork most people now picture: interlace and triquetras drawn as solid black bands with crisp white gaps where one cord passes under another, on rings, gravestones and tattoos. Revival artists rebuilt the ancient construction methods and turned single knots into stand-alone emblems.',
  axes:{density:.45,weight:.75,uniformity:.95,geometry:.55,symmetry:.95,fill:.85,chroma:0,ornament:.3,abstraction:.95,narrative:0},
  genes:{
    structure:{kinds:['sheet','knotwork','medallion'],folds:8,density:.4,symmetry:'radial',borderBands:1},
    motifs:{hero:['knot','triquetra','triskele'],ring:['knot','triquetra'],filler:['dot','triquetra'],border:['plait','knotChain'],petal:'pointed'},
    line:{weight:2,contrast:0,double:false,wobble:0,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6,knockout:.9},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#f8f6f1',ink:'#141414',fills:['#141414'],gap:'#f8f6f1'},
    ground:{kind:'none',amount:0}
  },
  rules:[
    'Draw each cord as a solid black band and cut a clean white gap wherever it passes under another.',
    'Close every knot on itself; a single strand is the ideal.',
    'Isolate knots as emblems — a triquetra, a square knot, a triskele in a ring — with plenty of white around them.',
    'Keep the edges machine-crisp: no wobble, no hatching, no colour.'
  ],
  glossary:[
    ['Celtic Revival','The 19th-century renewal of interest in early Irish and Scottish art, spread through replica brooches, book design and monuments.'],
    ['Triquetra','A three-lobed knot drawn with one unbroken line.']
  ],
  symbolism:'Revival knotwork is a sign of Irish and Scottish identity worldwide. It is still carved, engraved and printed today on jewellery, gravestones and folk-revival design; the "meaning of each knot" that comes with it is modern.',
  care:CELTIC_CARE,
  reading:['George Bain, Celtic Art: The Methods of Construction (1951)']
});
