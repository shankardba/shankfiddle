'use strict';
/* Andes — fourteenth culture family. All four traditions are CURATED: no reference images
   were supplied, so nothing here is measured. Grids, creatures and layouts live in
   js/core/andes.js. Palettes were set by eye from published photographs.

   The tocapu drawn here are built on the same grid as Inca ones but are not copies of
   known tocapu, and no reading is offered for them: none is known. The Nazca figures are
   drawn from memory of the published plans and are simplified. */

defFamily({id:'andes',name:'Andes',native:'Tawantinsuyu · Paracas · Nasca · Chimor',
  blurb:'Cloth was the highest art of the Andes, valued above gold, and its grid shaped everything else. On the south coast two thousand years ago, mantles were embroidered with one figure repeated in turning colours. The Chimú wove waves and seabirds that lock together. The Inca reduced design to small square signs worn at the waist. And on the desert at Nazca, figures were drawn too large to see, each with a single line.'});

const AD_CARE='Most Andean textiles that survive were made for the dead: the Paracas mantles wrapped mummy bundles, and nearly all were taken from their cemeteries in the twentieth century, many by looters, and scattered. Inca tunics marked rank and were given by the state; under Spanish rule their wearing was at times forbidden. Tocapu cannot be read today, and anything said about their meaning is conjecture — the designs here are new ones on the same grid, not copies, and no reading is claimed for them. The Nazca figures are a protected World Heritage site that has been damaged by vehicles and trespass; they are not fully understood, and the idea that they were made for or by anyone other than the Nasca people is fantasy. Quechua- and Aymara-speaking weavers continue these traditions today; a generated picture is a study of method and is not their work.';
const AD_CONV=[
  ['The grid rules','Every design is counted in threads. Curves become steps, a circle becomes a diamond, an animal is squared off.'],
  ['Tocapu','A small square sign inside a frame, set in rows. On most Inca tunics they form one band at the waist; on a very few they cover the whole garment.'],
  ['Counterchange','Light and dark exchange places from one unit to the next, so the cloth reads as a chequerboard of one design.'],
  ['Interlock','A figure is drawn so that the space between two copies of it is another copy in the second colour: nothing is background.'],
  ['Colourways','One embroidered figure is repeated with its colours rotated — the red parts green, the green parts gold — and the colourways are laid out along diagonals.'],
  ['Turning','Alternate figures or alternate rows are turned head to foot, so a cloth has no top.'],
  ['One line','A Nazca figure is a single path with an entrance and an exit. It can be walked without crossing itself.'],
  ['Step and wave','The stepped triangle and the wave that curls over it are the two oldest shapes in Andean art, and are usually found together.']
];
const AD_GLOSS=[['Tocapu','Quechua t’oqapu: a square woven sign, and cloth decorated with them.'],['Unku','A man’s tunic: a rectangle folded at the shoulders, with a slit for the head.'],['Qompi','Inca tapestry cloth of the finest grade, woven by specialists.'],['Qollqapata','The black-and-white chequerboard tunic of Inca soldiers.'],['Chakana','The stepped cross.'],['Mantle','A large rectangular cloth worn over the shoulders; the Paracas ones wrapped the dead.'],['Colourway','One assignment of colours to the parts of a repeated figure.'],['Geoglyph','A design made on the ground, here by clearing dark stones from pale soil.'],['Tawantinsuyu','“The four parts together”: the Inca state.'],['Chimor','The Chimú kingdom of the north coast, conquered by the Inca about 1470.']];

const anT=o=>defTradition(Object.assign({family:'andes',provenance:'curated',care:AD_CARE,conventions:AD_CONV,glossary:AD_GLOSS},o));
const AD_ORN=x=>Object.assign({dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},x);
const AD_LINE=(weight,x)=>Object.assign({weight,contrast:.4,double:false,wobble:0,taper:0,breaks:0,dash:null,misreg:0},x);

anT({
  id:'inca-tocapu',name:'Inca tapestry tunic',sub:'Square signs, the diagonal key, the chequerboard',native:'unku · t’oqapu',
  region:'The Inca state — Cusco and the highlands of Peru, Bolivia, Ecuador, Chile, Argentina',medium:'Interlocked tapestry of alpaca and vicuña on cotton warp',period:'About 1400–1532, continuing in changed forms under Spanish rule',
  summary:'A tunic laid flat: a tall rectangle with a slit for the head. Its body carries one design over and over — the diagonal key in red and yellow, exchanged square by square, or a plain chequerboard under a red stepped yoke — and across the waist runs a band of small square signs, no two alike. Everything is straight-edged and exact.',
  axes:{density:.9,weight:.4,uniformity:.95,geometry:1,symmetry:.85,fill:1,chroma:.8,ornament:.5,abstraction:1,narrative:.2},
  genes:{
    structure:{kinds:['tunic'],folds:4,density:.6,symmetry:'bilateral',borderBands:0,bare:1},
    motifs:{hero:['tocapuUnit','chakana'],ring:['tocapuUnit','chakana'],filler:['dot'],border:['tocapuBand','stepFretBand','waveBand'],petal:'step',tile:['incaKey','tocapu','incaChecker']},
    line:AD_LINE(1.2),
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:AD_ORN(),
    palette:{ground:'#efe5cb',ink:'#1a1511',fills:['#b3261e','#e2b12c','#1a1511'],ciFills:['#b3261e','#e2b12c','#1a1511','#5c2c40','#3f6b4f'],gap:'#efe5cb'},
    ground:{kind:'cloth',amount:.5}
  },
  rules:[
    'Weave the tunic as one tall rectangle and fold it at the shoulders.',
    'Choose one design for the body and repeat it without variation, exchanging its two colours square by square.',
    'Let a stepped yoke fall from the neck, in red.',
    'Set a band of tocapu at the waist: each square a different sign in its own frame.',
    'Finish every edge; leave no loose thread on either face.'
  ],
  maths:'The body of a key tunic is a counterchange pattern: each square is the mirror image of its neighbour with the colours exchanged, so the whole has a two-colour symmetry that neither colour has alone. A tocapu is drawn on a square grid a few units across, which is why its designs are made of bars, steps and nested squares and nothing curved.',
  symbolism:'Cloth of this grade was made in state workshops and given by the ruler; to wear it was to show where one stood. The chequerboard tunic belonged to the army. What individual tocapu meant — a rank, a people, a place — is not known.'
});

anT({
  id:'paracas-embroidery',name:'Paracas embroidered mantle',sub:'One figure in turning colours on a dark cloth',native:'—',
  region:'The Paracas peninsula and Ica valley, south coast of Peru',medium:'Camelid-wool stem-stitch embroidery on plain-weave cloth',period:'About 400 BC – AD 100',
  summary:'A great dark cloth sown with small bright figures in rows — a cat, a bird with spread wings, a two-headed serpent — every one the same outline, every one in a different arrangement of the same few colours. The colourways march along the diagonals, alternate rows are turned about, and a broad border repeats the figure all round.',
  axes:{density:.75,weight:.4,uniformity:.8,geometry:.8,symmetry:.7,fill:.9,chroma:.9,ornament:.6,abstraction:.8,narrative:.5},
  genes:{
    structure:{kinds:['mantle'],folds:4,density:.5,symmetry:'free',borderBands:0,bare:1},
    motifs:{hero:['pcFeline','pcBird','pcSerpent'],ring:['pcSerpent','pcBird'],filler:['dot'],border:['stepFretBand','waveBand','zigzag'],petal:'step'},
    line:AD_LINE(1.1),
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:AD_ORN(),
    palette:{ground:'#1c1a24',ink:'#ead9b0',fills:['#b02e26','#d7a33a','#4e7a4a','#3f5f95'],ciFills:['#b02e26','#d7a33a','#4e7a4a','#3f5f95','#cf7f86','#ead9b0'],gap:'#1c1a24'},
    ground:{kind:'cloth',amount:.55}
  },
  rules:[
    'Embroider one figure, then the same figure again with every colour moved one place round.',
    'Lay the figures in rows with even spaces of bare cloth between.',
    'Arrange the colourways so each runs in a diagonal across the mantle.',
    'Turn alternate rows head to foot.',
    'Close the cloth with a broad border of the same figure, smaller and closer.'
  ],
  maths:'With four colourways laid along diagonals, the figure at row j, column i takes colourway (i + j) mod 4. The design is one outline plus a rotation of its palette: the app draws the figure once and shifts the positions of its colours for each copy.',
  symbolism:'The mantles wrapped the bundled dead of a few great cemeteries, many layers to a body. Their figures — animals, and beings part human and part animal that are not drawn here — belong to a religion known only from the cloth itself.'
});

anT({
  id:'nazca-lines',name:'Nazca geoglyphs',sub:'Single-line figures cleared from the desert',native:'—',
  region:'The Nazca and Palpa plains, south coast of Peru',medium:'Dark surface stones cleared to show pale ground',period:'About 200 BC – AD 600',
  summary:'A plain of red-brown stones marked with pale lines. A hummingbird, a spider, a monkey with a spiral tail: each is drawn with one unbroken path as wide as a footpath, and each is crossed without regard by ruled straight lines and long cleared wedges that run for kilometres.',
  axes:{density:.2,weight:.3,uniformity:.95,geometry:.6,symmetry:.5,fill:0,chroma:.1,ornament:.1,abstraction:.8,narrative:.4},
  genes:{
    structure:{kinds:['geoglyph'],folds:4,density:.15,symmetry:'free',borderBands:0,bare:.5},
    motifs:{hero:['nzHummingbird','nzSpider','nzMonkey','nzDog','nzHeron','nzHands'],ring:['spiral','chakana'],filler:['dot'],border:['lines','zigzag'],petal:'pointed'},
    line:AD_LINE(2.6,{wobble:.05,contrast:.5}),
    fill:{modes:{flat:1},coverage:0,hatchGap:6},
    ornament:AD_ORN(),
    palette:{ground:'#a9775a',ink:'#ecdcbd',fills:['#ecdcbd','#c79f7c'],gap:'#a9775a'},
    ground:{kind:'stone',amount:.7}
  },
  rules:[
    'Scale the figure up from a small drawing with stakes and cords.',
    'Draw it as one path that begins and ends beside itself and never crosses.',
    'Keep the path one width throughout.',
    'Rule the straight lines with three stakes sighted in a row.',
    'Clear the stones to the edge of the path and leave them there in a low border.'
  ],
  maths:'Each figure is a unicursal curve: a single line with two free ends. Enlarging it from a sketch needs only a centre, cords and proportional measurement, and trial reconstructions have shown that a small team can lay one out in days. The straight lines hold their bearing over kilometres because three ranging poles in a row can be extended indefinitely.',
  symbolism:'Why they were made is still argued. The lines point toward water sources and the mountains that feed them; the figures share their subjects with Nasca pottery; and a path with an entrance and an exit suggests a figure meant to be walked. The app claims none of these as settled.'
});

anT({
  id:'chimu-textile',name:'Chimú coastal weaving',sub:'Interlocking waves and rows of seabirds',native:'—',
  region:'The north and central coast of Peru — Chan Chan, the Chancay valley',medium:'Cotton and camelid wool: tapestry, brocade and painted cloth; the same designs in adobe friezes',period:'About AD 900–1470',
  summary:'Cotton cloth in browns, ochre and red, covered in repeats that leave no ground: a stepped wave whose hollow is another wave in the second colour; rows of small crested seabirds, each row facing back the way the last one came. The same bands run round the mud walls of Chan Chan.',
  axes:{density:.95,weight:.4,uniformity:.9,geometry:.95,symmetry:.8,fill:1,chroma:.5,ornament:.6,abstraction:.9,narrative:.3},
  genes:{
    structure:{kinds:['wagara','mantle','frieze'],folds:4,density:.6,symmetry:'free',borderBands:0,bare:1},
    motifs:{hero:['chBird','chFeline','pcSerpent'],ring:['chBird','chHook','chakana'],filler:['dot'],border:['waveBand','stepFretBand','tocapuBand'],petal:'step',tile:['stepWave','birdRows']},
    line:AD_LINE(1.2),
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:AD_ORN(),
    palette:{ground:'#e7d7b1',ink:'#2a1c14',fills:['#7a4a2a','#c98b2f','#a3362a'],ciFills:['#7a4a2a','#c98b2f','#a3362a','#2a1c14'],gap:'#e7d7b1'},
    ground:{kind:'cloth',amount:.55}
  },
  rules:[
    'Choose a unit that fits against its own copy.',
    'Weave it in two colours so that neither is the background.',
    'Run it in diagonal or horizontal bands across the whole cloth.',
    'Reverse the direction of alternate rows.',
    'Keep to the colours of undyed cotton and a few dyes.'
  ],
  maths:'The stepped wave is a tile that interlocks with its own half-turn copy, so two colours of one shape fill the plane with no gaps: a tessellation the weaver arrives at by counting threads. Offsetting alternate rows by half a unit is what makes the crests nest.',
  symbolism:'The sea fed the coastal kingdoms, and its waves, fish and birds are their whole decorative world. The step-and-wave pairs mountain with water, the two things on which irrigated desert farming depends.'
});
