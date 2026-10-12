'use strict';
/* Tibet and the Himalaya — sixteenth culture family. All five traditions are CURATED: no
   reference images were supplied, so nothing here is measured. The symbols, the Buddha
   and the layouts live in js/core/himalaya.js. Palettes were set by eye from published
   photographs.

   The text band is asemic: it is built like dbu-can script and spells nothing. No mantra
   is written or imitated, and the syllable Oṃ is not generated anywhere in the app. */

defFamily({id:'himalaya',name:'Tibet and the Himalaya',native:'Bod · Himālaya',
  blurb:'The arts of Tibetan Buddhism and its neighbours along the mountains, from Ladakh through Tibet and Nepal to Bhutan. Paintings drawn on a ruled grid and coloured by rule; palaces of the mind laid out with compass and cord and poured in coloured sand; flags printed from woodblocks and left for the wind; wool rugs knotted with clouds and tiger stripes; and in Bhutan, silk brocade picked out thread by thread.'});

const TB_CARE='These are the working objects of a living religion. A thangka or a mandala is not a decoration: it is consecrated, used as a support for meditation, and treated with the respect given to what it shows — hung high, never set on the floor or stepped over, and not thrown away. A sand mandala is made over days and then swept up and poured into running water. A Buddha image is drawn to written proportions so that it is the Buddha and not a likeness of a man; the figure here follows those rules loosely and should be read as a study, not as an image fit for a shrine. Prayer-flag text is mantra; the bands of text in this app are asemic, shaped like Tibetan letters and spelling nothing, and no mantra is written or imitated. Many deities of the tradition are fierce, and their images belong to practices given only with initiation; none is drawn here. Tibetan culture has been under pressure in Tibet itself since the 1950s and much of what survives was carried out by refugees; makers in Nepal, India, Bhutan and Tibet still paint, print and weave for a living.';
const TB_CONV=[
  ['The grid first','A painter rules a grid of small units before drawing a figure; each class of being — a Buddha, a peaceful deity, a fierce one — has its own measures.'],
  ['Colour by rule','The body colour of each figure, the colours of the four directions and of the five elements are fixed by the texts. Colour identifies; it does not describe light.'],
  ['Outline last','Flat colour goes on first, then shading in thin washes, then the final outline in ink or in red, and last of all the eyes.'],
  ['East is below','A mandala is drawn with east at the bottom, south at the left, west at the top and north at the right.'],
  ['Five colours','Blue, white, red, green and yellow: sky, cloud or water, fire, and earth in one common reading; the five Buddha families in another.'],
  ['Lotus, nimbus, halo','A figure sits on a lotus, on a moon or sun disc, with a nimbus of light behind the body and a halo behind the head.'],
  ['Clouds and hills','Landscape came from China: clouds with trailing tails, rocks in blue and green, small flowers at the foot.'],
  ['Clockwise','Things are walked round, turned and read with the right shoulder inward: stupas, prayer wheels, the rings of a mandala.']
];
const TB_GLOSS=[['Thangka','A painting on sized cotton, mounted in silk so that it can be rolled.'],['Mandala','Tibetan dkyil ’khor, centre and surround: the palace of a deity seen in plan.'],['Vajra','Tibetan rdo rje: the thunderbolt or diamond sceptre.'],['Stupa','Tibetan mchod rten (chorten): a reliquary monument.'],['Lungta','Wind horse: the horse on a prayer flag, and the flag itself.'],['Tashi tagye','The eight auspicious symbols: parasol, fishes, vase, lotus, conch, knot, banner, wheel.'],['Dbu-can','“With a head”: the formal Tibetan script, every letter hung from a top line.'],['Menri','The main school of Tibetan painting since the fifteenth century, founded by Menla Döndrub.'],['Khaden','A rug the size of a bed, for sitting and sleeping on.'],['Kushüthara','Bhutanese silk brocade on a white ground, worn as a woman’s wrapped dress, the kira.']];

const tbT=o=>defTradition(Object.assign({family:'himalaya',provenance:'curated',care:TB_CARE,conventions:TB_CONV,glossary:TB_GLOSS},o));
const TB_ORN=x=>Object.assign({dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},x);
const TB_LINE=(weight,x)=>Object.assign({weight,contrast:.5,double:false,wobble:.01,taper:0,breaks:0,dash:null,misreg:0},x);
const TB_CI=['#24509a','#c5341f','#2f8f63','#e6b030','#fbf7ea','#e9812c'];

tbT({
  id:'menri-thangka',name:'Tibetan thangka',sub:'A figure on a lotus, sky and hills, a brocade mount',native:'thang ka · sman ris',
  region:'Central Tibet; now also Nepal, northern India and Bhutan',medium:'Mineral colours and gold in glue on sized cotton, mounted in silk brocade',period:'Menri school from the 1400s; the form from the 1000s to the present',
  summary:'A tall painting in a frame of patterned silk, with a thin red and yellow line where cloth meets picture. In the middle a Buddha sits on a lotus, a dark blue nimbus rayed with gold behind his body and a green halo behind his head. The sky is deep blue with curled clouds in the corners; below are rounded hills in green and blue, and at his feet a row of offerings. Every edge is outlined and every colour is flat and strong.',
  axes:{density:.7,weight:.3,uniformity:.6,geometry:.3,symmetry:.9,fill:1,chroma:.9,ornament:.8,abstraction:.4,narrative:.7},
  genes:{
    structure:{kinds:['thangka'],folds:8,density:.6,symmetry:'bilateral',borderBands:1,bare:.2},
    motifs:{hero:['shakyamuni','shakyamuni','stupa','tsWheel'],ring:['tsVase','norbu','tsConch','tsLotus','tsWheel','tsParasol','tsBanner','tsFishes'],filler:['cloud'],border:['tbRainbow','tbPearl','tbLotusBand'],tile:['tbBrocade'],petal:'round'},
    line:TB_LINE(1.1),
    fill:{modes:{flat:.9,gold:.1},coverage:1,hatchGap:5},
    ornament:TB_ORN(),
    palette:{ground:'#dcc594',ink:'#2a1b12',fills:['#24509a','#c5341f','#2f8f63','#e6b030','#fbf7ea','#e9812c'],ciFills:TB_CI,metal:'#d9a52b',strap:'metal',skin:'#e7b64c',gap:'#dcc594'},
    ground:{kind:'canvas',amount:.35}
  },
  rules:[
    'Stretch the cotton, size it with glue and chalk, and polish it smooth.',
    'Find the centre with two diagonals and rule the grid for the main figure.',
    'Draw the figure on the grid, then the lotus, the nimbus and the landscape round it.',
    'Lay flat colour from the sky downward; shade with thin washes; outline; gild.',
    'Paint the eyes last, on a chosen day. Then sew the painting into its silk mount.'
  ],
  maths:'The figure is laid out on a grid whose unit is a twelfth of the face. A seated Buddha is as wide across the knees as he is tall from seat to hairline, so the body fits a square, and the nimbus and halo are circles struck from points on its centre line. The app assembles the figure from parts placed in those units and scales the whole to the picture.',
  symbolism:'Earth-touching is the moment of awakening: challenged to say by what right he sat there, the Buddha reached down and the earth answered for him. The bowl is the monk’s life. A thangka is commissioned for a purpose — a death, an illness, a teaching — and merit comes to whoever pays for it and whoever paints it.'
});

tbT({
  id:'sand-mandala',name:'Sand mandala',sub:'A palace in plan inside rings of fire, vajras and lotus',native:'rdul tshon dkyil ’khor',
  region:'Tibet and the Tibetan Buddhist world',medium:'Coloured sand, or crushed stone, poured through metal funnels on a flat board; the same designs painted on cloth and ceilings',period:'Recorded from the 700s; made today',
  summary:'A disc of colour as wide as a table. Its rim is a ring of flames in five colours; inside that a dark ring set with gold vajras, then a ring of lotus petals. Within stands a square with a T-shaped gate in the middle of each side, its walls five thin bands of colour, an arch of bars over each gate. The floor is cut along the diagonals into four triangles, white, yellow, red and green, and at the centre is a lotus of eight petals with a single emblem on its heart.',
  axes:{density:.9,weight:.2,uniformity:.9,geometry:1,symmetry:1,fill:1,chroma:.9,ornament:.9,abstraction:.9,narrative:.3},
  genes:{
    structure:{kinds:['mandala'],folds:8,density:.8,symmetry:'radial',borderBands:0,bare:.3},
    motifs:{hero:['crossedVajra','tsWheel','vajra','tsLotus','norbu'],ring:['vajra','tsVase','norbu','tsKnot'],filler:['tsVase','norbu','tsConch','tsWheel'],border:['tbFlameBand','tbVajraFence','tbLotusBand','tbRainbow'],petal:'round'},
    line:TB_LINE(0.9,{wobble:0}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:TB_ORN(),
    palette:{ground:'#e6d7b6',ink:'#2a1b12',fills:['#24509a','#c5341f','#2f8f63','#e6b030','#ffffff','#e9812c'],ciFills:['#24509a','#c5341f','#2f8f63','#e6b030','#ffffff','#e9812c'],metal:'#d9a52b',strap:'#e6b030',gap:'#e6d7b6'},
    ground:{kind:'powder',amount:.5}
  },
  rules:[
    'Snap two chalked cords across the board to find the centre; strike every circle and square from it.',
    'Rule the palace: a square, a gate in each wall, the diagonals.',
    'Begin at the centre and work outward, each monk keeping to his quarter.',
    'Pour the walls, then the gates and their arches, then the three rings.',
    'When the rite is done, cut the mandala through with a vajra, sweep it up and give the sand to a river.'
  ],
  maths:'Everything is measured from one point. The palace is a square whose outline steps out into a T at the middle of each side: one polygon of thirty-six corners with four-fold rotational symmetry. Its five walls are that polygon moved inward five times by the same distance. The floor is the innermost polygon cut by its two diagonals. The rings are bands bent round circles, each holding a whole number of flames, vajras or petals.',
  symbolism:'The mandala is a palace seen from above with its walls laid flat, and the meditator walks in through the eastern gate at the bottom. Fire keeps out what is unready, the vajra ring is unbreakable, the lotus is purity; the four colours of the floor are four kinds of wisdom and the centre is the fifth. It is made with great care in order to be destroyed: nothing put together lasts.'
});

tbT({
  id:'lungta-print',name:'Prayer-flag print',sub:'The wind horse block-printed on a square of cloth',native:'rlung rta · dar lcog',
  region:'Tibet, Nepal, Bhutan, Ladakh, Sikkim and Mongolia',medium:'Woodblock print in black ink on thin cotton in five colours, strung on a cord',period:'Printed since at least the 1400s; older as painted flags',
  summary:'Squares of thin cloth on a cord across a pass, blue, white, red, green, yellow and round again. Each is printed in black from a carved block: a horse in the middle with a flaming jewel on its back, an animal or emblem in each corner, and the rest of the square filled with lines of script. The printing is a little uneven and the cloth frays; that is the point.',
  axes:{density:.8,weight:.5,uniformity:.5,geometry:.4,symmetry:.7,fill:.1,chroma:.2,ornament:.5,abstraction:.6,narrative:.7},
  genes:{
    structure:{kinds:['lungta'],folds:4,density:.7,symmetry:'bilateral',borderBands:1,bare:.2},
    motifs:{hero:['windHorse'],ring:['snowLion','tiger','norbu','tsKnot'],filler:['dot'],border:['pechaBand','lines'],petal:'pointed'},
    line:TB_LINE(1.7,{wobble:.035,breaks:.05,contrast:.35}),
    fill:{modes:{flat:1},coverage:0,hatchGap:5},
    ornament:TB_ORN(),
    palette:{ground:'#f0ebde',ink:'#1b1814',fills:['#2b5aa5','#c23a2a','#2f8a52','#e2b12f'],ciFills:['#2b5aa5','#c23a2a','#2f8a52','#e2b12f'],gap:'#f0ebde'},
    ground:{kind:'cloth',amount:.6}
  },
  rules:[
    'Carve the whole flag in reverse on one block: horse, corners, text.',
    'Ink the block, lay the cloth on it and rub the back.',
    'Print five colours of cloth in the fixed order and sew them to a cord.',
    'Hang the string high, on a good day, where the wind is steady.',
    'Leave it. When it has faded, hang a new string beside the old.'
  ],
  maths:'The flag is a square divided as a three-by-three grid of unequal cells: four corner squares, a large centre, and strips of text between. The order of colours along the cord is a cycle of five, so the flag at position k has colour k mod 5.',
  symbolism:'The horse carries the jewel that grants wishes; the corners belong to the tiger, the snow lion, the garuda and the dragon, of which the first two are drawn here. The wind reads the text and spreads it; the fading of the cloth is the prayer being used up. Flags go up at the new year, at a birth, for the sick, and at the top of every pass.'
});

tbT({
  id:'tibetan-rug',name:'Tibetan knotted rug',sub:'Medallions and clouds, or a tiger pelt, in wool',native:'grum tse · gdan',
  region:'Central and southern Tibet; since 1959 above all the Kathmandu valley',medium:'Highland sheep’s wool knotted round a gauge rod on a cotton or wool warp',period:'Surviving pieces from the 1700s; the craft is older',
  summary:'A thick wool rug the size of a bed. A row of white pearls and a border of interlocking T shapes surround an indigo field; on it three round medallions, the middle one largest, with curled clouds in the corners. Or there is no field at all: orange wool from edge to edge, striped black either side of a spine like a flayed tiger.',
  axes:{density:.6,weight:.5,uniformity:.7,geometry:.5,symmetry:.9,fill:1,chroma:.7,ornament:.6,abstraction:.6,narrative:.2},
  genes:{
    structure:{kinds:['khaden'],folds:4,density:.5,symmetry:'bilateral',borderBands:2,bare:.4},
    motifs:{hero:['tsKnot','tsLotus','crossedVajra','tsWheel','norbu'],ring:['tsLotus','tsKnot','norbu','tsFishes'],filler:['cloud'],border:['tbTFret','tbPearl','tbRainbow'],tile:['tigerPelt'],petal:'round'},
    line:TB_LINE(1.3,{wobble:.02}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:TB_ORN(),
    palette:{ground:'#22335c',ink:'#10162b',fills:['#b5382a','#d9a53a','#ece2c8','#5d86b8','#d8762f','#5d8a5a'],ciFills:['#5d86b8','#b5382a','#5d8a5a','#d9a53a','#ece2c8','#d8762f'],strap:'#d9a53a',gap:'#22335c'},
    ground:{kind:'cloth',amount:.5}
  },
  rules:[
    'Warp an upright loom. Loop the wool round a rod laid across the warps, a row at a time.',
    'Cut along the rod to open the loops into pile.',
    'Work from a drawing on squared paper, or from memory.',
    'Set the border first: pearls, then the fret, then the field.',
    'Shear the pile and carve a line round each motif so it stands up from the ground.'
  ],
  maths:'A rug is a grid of knots, about fifty to the square inch, so every curve is a staircase at close range. The T-fret is a tiling: upright and inverted T shapes of three cells by three fit together with no gap, and the border is one row of that tiling. The tiger pelt is a mirror image about the centre line.',
  symbolism:'Rugs are for sitting and sleeping, for saddles and for the pillars of temples. The tiger pelt is the seat of a yogin and of a judge. The medallions, clouds, bats and frets came from China and were made Tibetan by colour: undyed white, indigo, madder red and a yellow from rhubarb.'
});

tbT({
  id:'bhutan-kushuthara',name:'Bhutanese brocade',sub:'Silk diamonds picked out on a white ground',native:'kushüthara',
  region:'Bhutan, above all Lhuentse in the north-east',medium:'Silk or cotton brocade woven on a backstrap loom with extra pattern wefts',period:'Recorded from the 1800s; woven today',
  summary:'A length of white cloth crowded with small bright figures: stepped diamonds in red, blue, green and orange, each with another diamond and a cross inside, row over row with thin bands of smaller signs between. The pattern stands a little proud of the ground, like embroidery. At each end the white gives way to stripes.',
  axes:{density:.9,weight:.2,uniformity:.9,geometry:1,symmetry:.8,fill:1,chroma:.9,ornament:.9,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['kira'],folds:4,density:.6,symmetry:'grid',borderBands:0,bare:1},
    motifs:{hero:['tsKnot','vajra'],ring:['tsKnot','norbu'],filler:['dot'],border:['stepDiamond','tbRainbow','zigzag'],tile:['kushu'],petal:'step'},
    line:TB_LINE(0.9,{wobble:0}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:TB_ORN(),
    palette:{ground:'#f2ecdd',ink:'#3a2a1e',fills:['#27458f','#b3262b','#2e7d57','#d99a2b','#d8642a'],ciFills:['#27458f','#b3262b','#2e7d57','#d99a2b','#c9578a','#d8642a'],gap:'#f2ecdd'},
    ground:{kind:'cloth',amount:.5}
  },
  rules:[
    'Tie the loom to a post and to your own back; lean to keep the warp tight.',
    'Weave the white ground plain.',
    'Between ground wefts, lift warps with a pointed pick and wrap them in coloured silk, one small figure at a time.',
    'Keep each row of figures level; change the colours figure by figure.',
    'Weave three lengths and sew them side by side into one dress.'
  ],
  maths:'Each figure is a stepped diamond: a square lattice shape whose edge climbs one thread for every thread across. Rows are offset by half a figure, so centres fall on a triangular lattice, and four colourways are dealt along the rows so that no two neighbours match.',
  symbolism:'Cloth was tax, wage and gift in Bhutan, and a kushüthara dress is still what a woman wears to a festival. The figures have names — the thunderbolt, the knot of luck, the tree of life — but they are chosen for richness; the dress shows the skill of whoever wove it.'
});
