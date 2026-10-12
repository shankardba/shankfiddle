'use strict';
/* Ancient Greece — thirteenth culture family. All five traditions are CURATED: no
   reference images were supplied, so nothing here is measured. Vase shapes, ornament
   bands and figures live in js/core/hellas.js. Palettes were set by eye from published
   photographs.

   Figures are generic: a hoplite, a horse, an owl, a dolphin. No named painter's hand is
   imitated and no myth scene is reconstructed. */

defFamily({id:'greece',name:'Ancient Greece',native:'Ἑλλάς — Hellas',
  blurb:'Painted pottery from Athens and Corinth across four centuries, and the ornament that went with it onto temples. First a geometry of bands, meanders and stick figures; then black silhouettes scratched with a point; then the same drawing reversed, the figure left in the orange clay against a black ground. Around every scene run the same few bands — meander, palmette and lotus, tongues, rays — that Europe went on using for two thousand years.'});

const GR_CARE='Greek pots are archaeological objects, most of them found in graves, many far from Greece in Etruscan tombs, and a great number left the ground and their countries through looting; where a pot was found is part of what it is. They were also working things: wine was mixed, poured and drunk from them, oil carried, the dead honoured. The gods, heroes and scenes painted on them belong to a religion and a body of story; this app draws only generic figures and reconstructs no myth. The plain marble we associate with Greek buildings is an accident of time: temples and their mouldings were painted in strong blue, red and gold. A generated picture follows the method and is not a copy of any vase or the work of any painter.';
const GR_CONV=[
  ['Zones','A pot is decorated in horizontal bands that follow its build: lip, neck, shoulder, belly, foot. One zone is given to the figures; the rest carry ornament.'],
  ['Ground line','Figures stand on a ruled line. There is no landscape and no depth: overlapping is the only sign that one thing is in front of another.'],
  ['Profile and frontal','Heads and legs are in profile, a chest may be frontal, and in early work the eye is drawn frontal in a profile face. Full frontal faces are rare and mean something: a gorgon, a mask, a dying man.'],
  ['Black-figure','The figure is painted in gloss that fires black; inner detail is incised through it to the clay; women’s skin is added in white and some details in purple-red.'],
  ['Red-figure','From about 530 BC: the figure is reserved in the clay and the background painted black. Detail is now drawn with a brush, in a wiry raised line and in thinned gloss.'],
  ['Meander','The key pattern, named for the winding river Maeander: one unbroken line turning at right angles.'],
  ['Palmette and lotus','A chain of fan-shaped palmettes and three-petalled lotus buds linked by tendrils; borrowed from Egypt and the Near East in the seventh century BC.'],
  ['Rays and tongues','Slender triangles rise from the foot like the calyx of a flower; rounded tongues hang from the shoulder.']
];
const GR_GLOSS=[['Amphora','Two-handled jar for wine, oil and other stores.'],['Krater','Wide bowl for mixing wine with water.'],['Lekythos','Tall narrow oil flask; the white-ground kind was made for graves.'],['Kylix','Shallow two-handled drinking cup.'],['Gloss','The fine clay slip that fires black in a kiln starved of air; not a glaze in the modern sense.'],['Incision','Lines scratched through the black gloss to the clay beneath.'],['Reserve','An area left unpainted, in the colour of the clay.'],['Anthemion','A band of palmettes, or palmettes and lotus.'],['Meander','The Greek key pattern.'],['Hoplite','A heavily armed citizen foot-soldier.'],['Dipylon','The double gate of Athens, by whose cemetery the great Geometric funeral vases were found.'],['Polychromy','The painting of architecture and sculpture in many colours.']];

const grT=o=>defTradition(Object.assign({family:'greece',provenance:'curated',care:GR_CARE,conventions:GR_CONV,glossary:GR_GLOSS},o));
const GR_ORN=x=>Object.assign({dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},x);
const GR_LINE=(weight,x)=>Object.assign({weight,contrast:.45,double:false,wobble:.01,taper:0,breaks:0,dash:null,misreg:0},x);
const GR_B=['grMeander','grPalmetteLotus','grTongues','grRays','grIvy','grWave'];

grT({
  id:'greek-geometric',name:'Geometric vase painting',sub:'Bands of meander and zigzag, figures built from triangles',native:'Γεωμετρικός',
  region:'Athens (the Dipylon cemetery), Argos, Corinth, the islands',medium:'Dark gloss on pale clay; large grave-marker vases, jugs, bowls',period:'About 900–700 BC',
  summary:'The whole pot is ruled into bands from lip to foot and every band is filled: hatched meanders, stacked zigzags, rows of linked circles, chequers. In the widest band stand the figures — horses with reed legs and swelling necks, warriors with triangle chests and a dot for an eye — in rows, all alike, on a single ground line.',
  axes:{density:.95,weight:.45,uniformity:.8,geometry:.95,symmetry:.7,fill:.5,chroma:.1,ornament:.9,abstraction:.95,narrative:.5},
  genes:{
    structure:{kinds:['vase','frieze'],folds:4,density:.9,symmetry:'free',borderBands:0,bare:.2},
    motifs:{hero:['grHorse','grWarriorGeo'],ring:['grHorse','grRosette'],filler:['grRosette','dot'],border:['grMeanderHatched','grZigzag','grCircles','grMeander','zigzag','diamond'],petal:'pointed'},
    line:GR_LINE(1.7),
    fill:{modes:{hatch:1},coverage:.35,hatchGap:4.2},
    ornament:GR_ORN(),
    palette:{ground:'#e6cfa4',ink:'#2a1c14',fills:['#2a1c14'],ciFills:['#7a3b22','#2a1c14'],gap:'#e6cfa4'},
    ground:{kind:'plaster',amount:.4}
  },
  rules:[
    'Rule the pot into bands with the wheel turning under the brush.',
    'Fill every band; leave no open clay wider than a finger.',
    'Give the widest band, between the handles, to the figures.',
    'Build each figure from the same few shapes and repeat it along the ground line.',
    'Hatch the broad meanders instead of painting them solid, so the surface keeps one even grey.'
  ],
  maths:'The ornament is nearly all frieze symmetry: one unit slid along a band, sometimes mirrored. The hatched meander is a single band folded at right angles; drawn as one closed ribbon and hatched, it keeps the same tone as the zigzags above and below it, which is what makes a Geometric pot read as woven rather than drawn.',
  symbolism:'The largest of these vases stood on graves as markers and received offerings poured through a hole in the base. Their figure scenes show the dead laid out, mourners with hands to their heads, and processions of chariots.'
});

grT({
  id:'black-figure',name:'Attic black-figure',sub:'Black silhouettes with incised detail on orange clay',native:'μελανόμορφος',
  region:'Athens; earlier Corinth; exported across the Mediterranean, above all to Etruria',medium:'Black gloss, added white and purple-red, on wheel-thrown clay fired in three stages',period:'About 620–480 BC',
  summary:'An orange pot with glossy black figures. Each figure is a clean silhouette, and everything inside it — the rim of a shield, the folds of a tunic, an eye — is scratched through the black with a sharp point, so the lines show in the colour of the clay. A crest or a cloak is touched with purple-red. Meander, palmettes, tongues and rays ring the pot above and below.',
  axes:{density:.6,weight:.7,uniformity:.5,geometry:.5,symmetry:.6,fill:.8,chroma:.3,ornament:.6,abstraction:.6,narrative:.9},
  genes:{
    structure:{kinds:['vase'],folds:4,density:.5,symmetry:'free',borderBands:0,bare:.4},
    motifs:{hero:['grHoplite','grHorse','grDolphin','grOwl'],ring:['grPalmette','grLotus','grDolphin'],filler:['grRosette'],border:GR_B,petal:'pointed'},
    line:GR_LINE(1.3),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:GR_ORN(),
    palette:{ground:'#d98a48',ink:'#15110e',fills:['#15110e','#7b2a2e'],ciFills:['#7b2a2e','#efe6d2'],gap:'#d98a48'},
    ground:{kind:'plaster',amount:.3}
  },
  rules:[
    'Sketch the scene on the leather-hard pot, then paint each figure as a solid shape.',
    'Incise the detail with a point: one confident line, no going back.',
    'Add white for women’s skin and purple-red for crests, cloaks and blood.',
    'Stand every figure on the ground line and let heads reach the same height.',
    'Close the scene above and below with bands of ornament.'
  ],
  maths:'The black is chemistry, not pigment: the same iron-rich clay as the pot, levigated fine. Fired with air it is red; starved of air it turns black; let air back in and the coarse body returns to red while the dense slip stays black. The drawing here is likewise one material — a solid shape with lines cut back to the ground colour.',
  symbolism:'Scenes come from myth and from the lives of the men who drank from the pots: heroes arming and fighting, athletes, horsemen, Dionysos and his followers. Painters sometimes signed, and praised a favourite by name.'
});

grT({
  id:'red-figure',name:'Attic red-figure',sub:'Figures left in the clay against a black ground',native:'ἐρυθρόμορφος',
  region:'Athens; later the Greek cities of southern Italy',medium:'Black gloss background, relief line and dilute gloss on reserved clay',period:'About 530–320 BC',
  summary:'The black-figure scheme turned inside out. The pot is black and the figures are the orange of the clay, their inner lines drawn with a brush instead of scratched. The ornament reverses too: palmettes and meanders stand in clay colour on black. Bodies turn, overlap and foreshorten in a way the old silhouette could not.',
  axes:{density:.5,weight:.6,uniformity:.5,geometry:.4,symmetry:.5,fill:.85,chroma:.3,ornament:.5,abstraction:.5,narrative:.9},
  genes:{
    structure:{kinds:['vase'],folds:4,density:.4,symmetry:'free',borderBands:0,bare:.5},
    motifs:{hero:['grHoplite','grOwl','grDolphin','grHorse'],ring:['grPalmette','grLotus'],filler:['grRosette'],border:['grMeander','grPalmetteLotus','grTongues','grIvy','grEggDart','grWave'],petal:'pointed'},
    line:GR_LINE(1.2),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:GR_ORN(),
    palette:{ground:'#17120f',ink:'#dc8a4a',fills:['#dc8a4a','#efe2c8'],ciFills:['#efe2c8','#b9552f'],gap:'#17120f'},
    ground:{kind:'porcelain',amount:.3}
  },
  rules:[
    'Outline each figure with a broad band of gloss, then flood the background black.',
    'Leave the figure itself as bare clay.',
    'Draw the inner lines with the brush: strong relief lines for contours, thinned gloss for hair and muscle.',
    'Reserve the ornament bands in the same way, clay on black.',
    'Use fewer, larger figures than a black-figure painter would.'
  ],
  maths:'Red-figure is the exact complement of black-figure: exchange figure and ground and every line keeps its place. The app makes the exchange in the palette — a clay-coloured ink on a black ground — and the same shapes, bands and cut lines come out reversed.',
  symbolism:'The same myths and the same daily life, now with room for expression: a turned head, a foot seen from the front, a dancer caught off balance.'
});

grT({
  id:'white-ground',name:'White-ground lekythos',sub:'Dark drawing on a white slip',native:'λήκυθος',
  region:'Athens',medium:'White clay slip over the pot, drawing in gloss and matt paint, fugitive colours added after firing',period:'About 500–400 BC',
  summary:'A tall, narrow oil flask coated in chalk-white slip. A band of meander runs round the shoulder; below it one or two quiet figures stand on the white. Neck, lower body and foot are black. These were made to be left at graves, and their colours — never fired hard — have mostly worn away.',
  axes:{density:.3,weight:.4,uniformity:.6,geometry:.3,symmetry:.4,fill:.4,chroma:.2,ornament:.35,abstraction:.4,narrative:.8},
  genes:{
    structure:{kinds:['vase'],folds:4,density:.25,symmetry:'free',borderBands:0,bare:.8,heroScale:1},
    motifs:{hero:['grHoplite','grOwl','grAmphora'],ring:['grPalmette'],filler:['grRosette'],border:['grMeander','grPalmetteLotus','grTongues','grEggDart'],petal:'pointed'},
    line:GR_LINE(1.1),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:GR_ORN(),
    palette:{ground:'#efe8d8',ink:'#1b1613',fills:['#1b1613','#8c3b33','#3d5f86'],ciFills:['#8c3b33','#3d5f86'],gap:'#efe8d8'},
    ground:{kind:'plaster',amount:.5}
  },
  rules:[
    'Coat the body of the flask in white slip; leave neck and foot for the black.',
    'Rule a meander round the shoulder.',
    'Draw one or two figures, upright and still.',
    'Add a little colour: a red cloak, a blue ribbon.',
    'Leave most of the white empty.'
  ],
  maths:'The lekythos is nearly a cylinder, so its picture is the one Greek vase painting that unrolls to a flat rectangle without distortion. The profile here is a curve through twelve measured-by-eye points, smoothed by repeated corner cutting.',
  symbolism:'An offering of oil for the dead. The scenes are of parting and of visits to the tomb: a seated woman, a young soldier, a hand held out.'
});

grT({
  id:'temple-ornament',name:'Painted temple ornament',sub:'Mouldings in blue, red and gold',native:'κυμάτιον · ἀνθέμιον',
  region:'The Greek world — Athens, Olympia, Delphi, Sicily, Ionia',medium:'Paint and gilding on marble, limestone and terracotta revetments',period:'About 600–300 BC',
  summary:'Not white. The cornices and mouldings of Greek buildings were picked out in strong colour: an egg-and-dart in red and blue, a meander in gold on dark blue, a chain of palmettes along the gutter. Stacked one above another, the same few bands make up the whole decorated top of a temple.',
  axes:{density:.8,weight:.5,uniformity:.8,geometry:.7,symmetry:.9,fill:.9,chroma:.8,ornament:.9,abstraction:.8,narrative:.1},
  genes:{
    structure:{kinds:['frieze'],folds:4,density:.7,symmetry:'bilateral',borderBands:0,bare:1},
    motifs:{hero:['grPalmette','grLotus','grRosette'],ring:['grPalmette','grRosette'],filler:['grRosette'],border:['grEggDart','grMeander','grPalmetteLotus','grWave','grTongues','grRays'],petal:'pointed'},
    line:GR_LINE(1.5),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:GR_ORN({relief:.2}),
    palette:{ground:'#efe9dc',ink:'#1e3a6e',fills:['#b3322a','#c99a2e','#1e3a6e'],ciFills:['#b3322a','#c99a2e'],gap:'#efe9dc'},
    ground:{kind:'stone',amount:.45}
  },
  rules:[
    'Carve or mould the profile first; the paint follows the form.',
    'Give each moulding its own band: egg-and-dart on the rounded one, meander on the flat.',
    'Alternate red and blue from unit to unit.',
    'Keep the pattern small against the plain wall below it.',
    'Repeat without variation: the rhythm is the point.'
  ],
  maths:'Each band is a frieze: a unit repeated by translation, usually with a mirror line through every unit. Egg-and-dart is the oval section of a convex moulding drawn flat; the dart marks the valley between two eggs.',
  symbolism:'The ornament marks the junctions of a building — where wall meets roof, where the roof meets the sky — and descends from wooden construction and from older Egyptian and Near Eastern pattern.'
});
