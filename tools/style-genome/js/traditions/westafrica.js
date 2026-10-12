'use strict';
/* West Africa — twelfth culture family. All four traditions are CURATED: no reference
   images were supplied, so nothing here is measured. Cloth grammars live in
   js/core/strip.js. Palettes were set by eye from published photographs.

   The adinkra symbols are drawn from published charts as remembered, not from stamps;
   they are simplified, and the best-known one (Gye Nyame) is left out until it can be
   drawn correctly. No named kente cloth is reproduced. */

defFamily({id:'west-africa',name:'West Africa',native:'Asante · Ewe · Bamana · Yoruba',
  blurb:'Four cloths, four ways of putting pattern on a surface. Kente is woven a hand’s width at a time and sewn into a chequerboard of stripe and motif. Adinkra is stamped: a ruled grid of squares, each printed with one symbol that is also a saying. Bogolanfini is painted in mud, the pattern left as bare cloth. Adire is indigo, with the design held back by starch or by tying.'});

const WA_CARE='These cloths carry meaning and standing. Kente was the dress of Asante kings, with some patterns once reserved to the Asantehene; adinkra was mourning cloth, and each stamp is a proverb; the marks on a Bamana mud cloth protect its wearer at dangerous passages of life, and their readings belong to the women who paint them; a Yoruba adire is named and signed by its pattern. In Ghana, kente and adinkra designs are protected by law as national folklore. Cheap printed “kente” and “mud cloth” made far from the weavers and dyers take their livelihood. What the app draws follows the methods only: no named cloth is copied, the adinkra stamps here are simplified from memory and may differ from a carver’s, and a generated picture should not be presented or sold as the cloth itself. To own one, buy from the weavers of Bonwire and Agbozume, the stampers of Ntonso, the dyers of San, Abeokuta and Osogbo.';
const WA_CONV=[
  ['Strip','West African narrow looms weave a band roughly a hand wide. A cloth is many bands cut to length and sewn selvedge to selvedge.'],
  ['Warp-faced and weft-faced','Where the lengthwise threads show, the strip is striped along its length; where the crosswise threads are packed to hide them, the weaver can build blocks of pattern. Kente alternates the two.'],
  ['Stagger','The blocks of one strip are set against the plain stretches of the next, so the sewn cloth reads as a chequerboard without ever being woven as one.'],
  ['Colour as meaning','In Asante kente, gold stands for wealth and rule, green for growth and harvest, red for blood and sacrifice, blue for peace, black for maturity and the ancestors, white for purification.'],
  ['One stamp, one saying','An adinkra symbol is a proverb in a shape. A cloth says something by the symbols chosen for it.'],
  ['Ruled with a comb','Adinkra cloth is first divided into squares with a wooden comb drawn across it, leaving several close lines at a stroke.'],
  ['Painted around','On mud cloth the dark is applied and the light is left. A zigzag is not drawn; the ground on both sides of it is.'],
  ['Resist','On adire the pattern is whatever the indigo could not reach: lines of starch, or cloth bound tight with raffia.']
];
const WA_GLOSS=[['Kente','Asante and Ewe strip-woven cloth of silk, rayon or cotton. Asante: nwentoma, “woven cloth”.'],['Adweneasa','“My skill is exhausted”: kente with weft pattern over its whole length.'],['Babadua','A weft block of plain bars, named for a segmented cane.'],['Adinkra','Asante stamped cloth, and the set of symbols stamped on it; the word is linked to farewell.'],['Adinkra aduru','The stamping dye, boiled from the bark of the badie tree.'],['Nwomu','The multicoloured whip-stitch that joins the widths of an adinkra cloth.'],['Bogolanfini','Bamana: “mud cloth”. Bogo, earth or mud; lan, with; fini, cloth.'],['N’gallama','The leaf tea that dyes the cloth yellow first and makes the mud bite.'],['Adire','Yoruba: “tied and dyed”. Indigo resist cloth.'],['Adire eleko','Adire with the pattern painted or stencilled in cassava starch.'],['Adire oniko','Adire with the pattern made by tying or binding with raffia.'],['Aladire','A woman who makes adire.']];

const waT=o=>defTradition(Object.assign({family:'west-africa',provenance:'curated',care:WA_CARE,conventions:WA_CONV,glossary:WA_GLOSS},o));
const WA_ORN=x=>Object.assign({dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},x);
const WA_LINE=(weight,x)=>Object.assign({weight,contrast:.4,double:false,wobble:0,taper:0,breaks:0,dash:null,misreg:0},x);

waT({
  id:'kente',name:'Kente strip weaving',sub:'Staggered blocks of stripe and pattern in gold, green, red and blue',native:'kente · nwentoma',
  region:'Ghana — Bonwire and the Asante region; Agbozume and the Volta region; Togo',medium:'Silk, rayon or cotton woven in narrow strips on a double-heddle loom and sewn together',period:'17th century to the present',
  summary:'A cloth built from strips a hand wide. Each strip runs through stretches of lengthwise stripes and then a tight block of pattern — zigzags, nested diamonds, bars, checks — and neighbouring strips are offset by half a step, so pattern always sits beside stripe. From across a room it is a chequerboard of gold; close up, every block is different.',
  axes:{density:1,weight:.5,uniformity:.9,geometry:1,symmetry:.7,fill:1,chroma:1,ornament:.6,abstraction:1,narrative:.2},
  genes:{
    structure:{kinds:['stripCloth'],folds:4,density:.6,symmetry:'free',borderBands:0,bare:1},
    motifs:{hero:['adAdinkrahene','adNsoromma'],ring:['adAdinkrahene'],filler:['dot'],border:['nwomu','zigzag','diamond'],petal:'pointed',tile:['kente','kenteAdwin']},
    line:WA_LINE(1.2),
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:WA_ORN(),
    palette:{ground:'#17140f',ink:'#17140f',fills:['#e8b422','#1f7a3d','#c0261f','#1d3f91'],ciFills:['#e8b422','#1f7a3d','#c0261f','#1d3f91','#7a1420','#f1e7cc'],gap:'#17140f'},
    ground:{kind:'cloth',amount:.5}
  },
  rules:[
    'Weave a strip a hand wide, as long as the cloth needs.',
    'Alternate stretches where the warp stripes show with blocks where the weft covers them.',
    'Give each block one pattern, closed top and bottom by a plain bar.',
    'Sew the strips side by side with each one shifted half a step against the last.',
    'Keep the warp stripes the same on every strip; let the blocks vary.'
  ],
  maths:'A kente cloth is a two-colour chequerboard made without a two-dimensional loom: each strip is a one-dimensional sequence with period p, and shifting alternate strips by p/2 produces the board. Within a block the patterns are symmetric about the strip’s centre line, because the weaver counts warp threads outward from the middle.',
  symbolism:'Named cloths and named blocks carry proverbs and histories, and the choice of colours says something about the occasion. A generated cloth has no name and makes no such statement.'
});

waT({
  id:'adinkra',name:'Adinkra stamped cloth',sub:'Symbols stamped in comb-ruled squares',native:'adinkra',
  region:'Ghana — Ntonso and the Asante region; Côte d’Ivoire (Gyaman)',medium:'Bark dye stamped on cotton with carved calabash stamps; lines ruled with a comb',period:'Early 19th century at the latest, to the present',
  summary:'A plain cloth divided into squares by sets of close parallel lines, each square filled with one symbol stamped again and again in glossy black. The symbols are compact and bold — circles within circles, horns, hearts, stars — and each stands for a saying. The cloth’s widths are joined by a seam of whip-stitching in bright bands of colour.',
  axes:{density:.8,weight:.8,uniformity:.8,geometry:.6,symmetry:.9,fill:.7,chroma:.25,ornament:.4,abstraction:.9,narrative:.7},
  genes:{
    structure:{kinds:['stampedCloth'],folds:4,density:.65,symmetry:'free',borderBands:0,bare:1},
    motifs:{hero:ST.ADINKRA,ring:ST.ADINKRA,filler:['dot'],border:['combRule','nwomu'],petal:'round'},
    line:WA_LINE(1.3,{wobble:.02}),
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:WA_ORN(),
    palette:{ground:'#efe7d2',ink:'#18130f',fills:['#18130f'],ciFills:['#e3ae22','#c2281f','#1f7a3d','#1d3f91','#18130f'],gap:'#efe7d2'},
    ground:{kind:'cloth',amount:.45}
  },
  rules:[
    'Peg the cloth flat and rule it into squares with the comb.',
    'Choose a symbol for each square; the choice is the message.',
    'Stamp it in rows until the square is full, re-inking every print.',
    'Keep the prints close but never touching.',
    'Join the widths with a seam of coloured whip-stitch.'
  ],
  maths:'Most stamps are symmetric: mirror symmetry on one or two axes, or a quarter-turn. Stamping a symbol on a square grid makes a wallpaper pattern whose symmetry is the stamp’s own combined with the grid’s translations, so one small carved block generates a whole field.',
  symbolism:'Adinkra was worn to funerals and its name is tied to saying goodbye; today it is worn on many occasions. Each symbol is a proverb or a quality — the ram’s horns for strength with humility, the heart for patience, the star for trust in God.'
});

waT({
  id:'bogolanfini',name:'Bogolanfini mud cloth',sub:'Pale reserved lines on mud-black strips',native:'bògòlanfini',
  region:'Mali — Bamana country around San, Ségou and the Bélédougou; also Burkina Faso',medium:'Hand-spun cotton strips, dyed with leaf tea and painted with fermented river mud',period:'At least several centuries, to the present',
  summary:'Brown-black cloth covered in pale geometric marks: zigzags, nested diamonds, crosses in boxes, rows of dots. The cloth is seven or so narrow strips, and each is divided into panels with one repeat apiece, separated by plain dark bars. Every pale line is cloth the painter left alone while she laid the mud around it.',
  axes:{density:.9,weight:.6,uniformity:.6,geometry:.9,symmetry:.6,fill:.2,chroma:.1,ornament:.7,abstraction:1,narrative:.5},
  genes:{
    structure:{kinds:['mudCloth'],folds:4,density:.6,symmetry:'free',borderBands:0,bare:1},
    motifs:{hero:['star8','sun'],ring:['dot'],filler:['dot'],border:['mudTicks','zigzag','lines'],petal:'pointed',tile:['bgZigzag','bgLozenge','bgCross','bgDots','bgFishbone','bgSteps']},
    line:WA_LINE(3.4,{wobble:.16,contrast:.25}),
    fill:{modes:{flat:1},coverage:0,hatchGap:6},
    ornament:WA_ORN(),
    palette:{ground:'#2a1d15',ink:'#ecdfc2',fills:['#ecdfc2','#b98a4e'],gap:'#2a1d15'},
    ground:{kind:'cloth',amount:.6}
  },
  rules:[
    'Soak the cloth in leaf tea and dry it yellow.',
    'Paint the mud around the pattern, not on it: outline each pale line, then fill the ground.',
    'Divide every strip into panels and give each panel one small repeat.',
    'Leave a plain dark bar between panels.',
    'Run a different pattern across the two ends of the cloth.'
  ],
  maths:'The mud reacts with tannin from the leaf dye to fix an iron black, so the image is a negative: figure and ground are exchanged. The app draws ordinary lines and lets the palette do the exchange — a pale ink on a dark ground.',
  symbolism:'Traditionally made by women for hunters’ tunics and for the wrappers worn by women at initiation and after childbirth, where the patterns are protective. Named motifs refer to animals, events and proverbs; their full readings are taught, not published.'
});

waT({
  id:'adire',name:'Adire indigo resist',sub:'Pale squares of pattern on deep blue',native:'àdìrẹ',
  region:'Nigeria — Abeokuta, Ibadan, Osogbo (Yoruba)',medium:'Cotton dyed in indigo; pattern reserved with cassava starch or by tying',period:'Early 20th century in its classic form, on older tie-dye practice; to the present',
  summary:'Deep indigo cloth carrying a grid of squares in pale blue line, each square different: a leaf, a comb, a row of pillars, a sun, a filling of combed lines or nested squares. The set of squares is repeated across the cloth. In the tied kind, rings of small pale dots float on the blue.',
  axes:{density:.85,weight:.35,uniformity:.6,geometry:.6,symmetry:.6,fill:.1,chroma:.3,ornament:.7,abstraction:.8,narrative:.5},
  genes:{
    structure:{kinds:['resistGrid'],folds:4,density:.5,symmetry:'free',borderBands:0,bare:1},
    motifs:{hero:['aeLeaf','aeComb','aePillars','aeSun'],ring:['aeLeaf','aeSun','aeComb','aePillars'],filler:['dot'],border:['combRule','lines'],petal:'pointed',tile:['adCircles','adSquares','adComb']},
    line:WA_LINE(2.0,{wobble:.1,contrast:.45}),
    fill:{modes:{flat:1},coverage:0,hatchGap:6},
    ornament:WA_ORN(),
    palette:{ground:'#16244f',ink:'#bcd0ea',fills:['#bcd0ea','#6f93c9'],gap:'#16244f'},
    ground:{kind:'cloth',amount:.5}
  },
  rules:[
    'Rule the cloth into squares.',
    'Paint each square with starch, using a feather, a palm rib or a comb.',
    'Make a block of squares and repeat it across the whole cloth.',
    'Dip in indigo many times, drying between dips, until the blue is nearly black.',
    'Wash out the starch: where it lay, the cloth is pale.'
  ],
  maths:'An adire eleko cloth is a small matrix of different squares repeated by translation: the unit is a block of two rows, not a single square. The tied kind places its rings on a staggered grid, each ring a circle of evenly spaced dots.',
  symbolism:'Cloths are known by the name of their pattern — “Ibadan is sweet”, “life is sweet”, “four friends” — and a square may show a tool, a plant, a building or a proverb. The dyers are women, and dyeing indigo is under the care of the deity Ìyá Màpó.'
});
