'use strict';
/* Ancient Egypt — seventh culture family. Five traditions are ANALYZED from
   seven reference images (three carved-wall registers, a funerary papyrus, and the modern
   souvenir papyrus); two are CURATED (Theban tomb painting, inlaid jewellery).
   Signs, words and figure types live in js/core/hiero.js. */

defFamily({id:'egypt',name:'Ancient Egypt',native:'Kmt, "the Black Land"',
  blurb:'Three thousand years of one visual system: writing that is drawing and drawing that is writing. Signs packed into squares, figures built on a grid from their most recognisable views, flat mineral colour inside a firm contour — on carved walls, papyrus rolls and inlaid gold.'});

const EG_CARE='The inscriptions here are real: every word is a standard spelling and every column runs through stock formulas ("words spoken by…", "given life for ever"), though columns may break off mid-phrase as wall fragments do. They are formulas, not a text copied from any monument. The royal names are real throne names. Gods are drawn as their general type; in Egyptian art the caption, not the face, says who a figure is.';
const EG_SIGNS=['hieroWord','hgG17','hgG1','hgG43','hgG5','hgG39','hgS34','hgR11','hgS40','hgL1','hgD10','hgN5','hgH6','hgM17','hgI9','hgF35','royalName'];
const EG_CONV=[
  ['Composite view','Each part of the body is shown from its clearest side: head, hips, legs and feet in profile; the eye and the shoulders from the front. Both feet show the inner side, with the arch and the big toe.'],
  ['The grid','Figures were laid out on a ruled grid: 18 squares from the soles to the hairline for a standing figure (knee at 6, waist at 11, shoulders at 16), 14 for a seated one. The grid is why figures from different centuries share proportions.'],
  ['Skin colour','Men are painted red-brown and women pale yellow — a convention, not a portrait. Gods may be green (Osiris), blue (Amun) or gold.'],
  ['Scale and register','Size shows rank, not distance. Scenes stand on ground lines stacked in registers; there is no single viewpoint.'],
  ['Facing','Figures and signs face the same way, toward the start of the line. On a doorway or stela the two halves face each other across the axis.'],
  ['Ra-Horakhty','A falcon-headed man crowned with the sun disc encircled by a cobra, holding the was sceptre and the ankh.'],
  ['Isis and Hathor','A woman in a sheath dress crowned with the sun disc between cow\'s horns, holding the papyrus sceptre. The two share this crown from the New Kingdom; Isis\' own sign is the throne.'],
  ['Ma\'at','A woman with an ostrich plume tied to her head — often kneeling with winged arms spread in protection.'],
  ['Colour of signs','Painted signs follow nature loosely: water blue or black, the sun red, plants green, birds in their own colours. The generator gives each sign one or two palette colours rather than these fixed assignments.']
];

defTradition({
  id:'egypt-painted-relief',family:'egypt',provenance:'analyzed',
  name:'Painted relief inscription',sub:'Raised signs in colour on a carved wall',native:'mdw nṯr',
  region:'Egypt — royal tombs and temples',medium:'Carved limestone or plaster, painted in mineral colour',period:'New Kingdom, c. 1550–1070 BCE',
  summary:'Columns of hieroglyphs carved in low raised relief and painted: red-ochre, blue-green and dark grey-blue signs on a warm yellow or white ground, the columns ruled off by dark double lines. Each sign is a small finished drawing — a bird with its wing and eye, a basket with its weave — and every group of signs is fitted into an invisible square.',
  axes:{density:.92,weight:.07,uniformity:.16,geometry:.41,symmetry:.56,fill:.93,chroma:.32,ornament:.96,abstraction:.55,narrative:.9},
  genes:{
    structure:{kinds:['inscription'],folds:8,density:.5,symmetry:'free',borderBands:0},
    motifs:{hero:['wingedDisc','hgG5','hgS34','royalName','hgG17','lotusEg'],ring:EG_SIGNS,filler:['hgX1','hgZ1','hgN5','hgN35'],border:['egBlock','lines','kheker'],petal:'pointed'},
    line:{weight:2.1,contrast:.35,double:false,wobble:.14,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false,relief:.55},
    palette:{ground:'#d0ad78',ink:'#3b2d1c',fills:['#b9603f','#5f8474','#3f5560','#b9603f','#e9dcc0'],gap:'#d0ad78',skin:'#a9512f',skinPale:'#dcc188',hair:'#2f3b40',sun:'#b9603f'},
    ground:{kind:'plaster',amount:.6}
  },
  rules:[
    'Rule the wall into vertical columns with a dark double line; read each column top to bottom.',
    'Pack every word into square groups: tall signs stand alone or side by side, low signs stack two or three deep, small signs tuck into the gaps.',
    'Face all signs toward the start of the line — birds, snakes and people look the way the reader comes from.',
    'Raise the sign a few millimetres from the ground, then paint it flat: one or two colours per sign, a fine dark outline, inner detail in line.',
    'Keep the palette mineral: red and yellow ochre, Egyptian blue, green, black, white.'
  ],
  maths:'The square group ("quadrat") is a layout rule: signs are classed as tall, low-broad or small, and each word is arranged so its signs fill a square with even gaps — which is why the same word can be spelled in different orders. The generator packs each group the same way, from the signs\' real proportions.',
  symbolism:'Writing was mdw nṯr, "the god\'s words": a sign is an image with power, so snakes are sometimes drawn cut in two and birds without legs inside burial chambers, to keep them harmless. A carved, painted formula was meant to work for ever.',
  care:EG_CARE,
  conventions:EG_CONV,
  analysis:{
    source:'Three reference photographs, analysed locally and not stored: a painted relief fragment on white plaster; a wall of raised, painted signs on a yellow ground between dark column lines; and the same idiom in a second close-up. Where they are from was not stated, and the monuments have not been identified.',
    observations:[
      'Columns separated by a dark double line with a pale core (yellow wall) or a solid green band (white fragment); the divider is about 6–7% of the column pitch.',
      'Signs stand in low raised relief: a lit edge upper left, a shadow lower right.',
      'Each sign carries one or two colours — red-ochre with blue-green on the yellow wall; red, green and yellow on the white fragment — inside a fine dark contour.',
      'Low broad signs (water ripple, mouth, basket) stack two or three deep; tall signs (reed, cloth, staff) share a square side by side; birds fill a square alone.',
      'All creatures in a column face the same way.',
      'Inner detail is line only: a wing edge, an eye, basket weave, the zigzag of water.'
    ],
    measured:{
      note:'The Lab separates "ink" from "ground" by brightness, so on photographs of carved, painted stone it reads cast shadow as ink and stone grain as dots: density and ornament come out near the top of the scale and line evenness near the bottom. The axes are the Lab\'s numbers as measured (so a similar photograph matches this tradition), not a judgement of the style; palette and layout are sound. Pigment colours are medians of hue-binned pixels.',
      findings:[
        'Dense but not packed: marks cover 26% of the yellow wall and 36% of the white fragment; occupied area 83–85%.',
        'Edges sit on the vertical and horizontal 1.5–1.8× more than chance — the columns and stacked low signs — against about 1.35 for free curved ornament.',
        'Yellow wall: ground #cdaa7c, red-ochre #9d5c32, darks #212106. White fragment: plaster #e6ded6, red #965546, green #435332, yellow ochre #ba9561.',
        'Not mirror-symmetric (0.60–0.61): running text, all facing one way.',
        'Line is uneven (CV 0.52–0.56) because carved edges and painted fills are measured together.'
      ],
      axes:{density:.92,weight:.07,uniformity:.16,geometry:.41,symmetry:.56,fill:.93,chroma:.32,ornament:.96},
      samples:[
        {label:'White fragment',strokeRel:.009,strokeCV:.56,coverage:.363,solidFrac:.17,bilateral:.61,rotational:.37,folds:16,dots:105},
        {label:'Yellow wall (whole)',strokeRel:.005,strokeCV:.52,coverage:.259,solidFrac:.13,bilateral:.60,rotational:.21,folds:16,dots:163},
        {label:'Yellow wall (one column)',strokeRel:.028,strokeCV:.82,coverage:.766,solidFrac:.37,bilateral:.95,rotational:.89,folds:16,dots:32}
      ]
    }
  },
  reading:['Richard H. Wilkinson, Reading Egyptian Art (Thames & Hudson, 1992)','Mark Collier and Bill Manley, How to Read Egyptian Hieroglyphs (British Museum Press, 1998)']
});

defTradition({
  id:'egypt-sunk-relief',family:'egypt',provenance:'analyzed',
  name:'Deep sunk relief',sub:'Signs cut into the wall, colour inside the cut',native:'',
  region:'Egypt — temple walls, especially exteriors',medium:'Signs cut several centimetres into sandstone or limestone, painted',period:'New Kingdom, especially Ramesside, c. 1290–1070 BCE',
  summary:'The sign is cut down into the stone instead of the ground being cut away around it. The edge throws a hard shadow, so the writing stays legible in raking sunlight and cannot easily be recut by a later king. Large, bold signs in pale stone, with blue column bands and red, yellow and blue-green paint surviving inside the cuts.',
  axes:{density:.84,weight:.18,uniformity:.09,geometry:.38,symmetry:.53,fill:1,chroma:.15,ornament:.95,abstraction:.6,narrative:.9},
  genes:{
    structure:{kinds:['inscription'],folds:8,density:.25,symmetry:'free',borderBands:0},
    motifs:{hero:['wingedDisc','hgG17','hgG43','royalName','hgS34'],ring:EG_SIGNS,filler:['hgX1','hgZ1','hgN35'],border:['egBlock','lines'],petal:'pointed'},
    line:{weight:2.6,contrast:.3,double:false,wobble:.2,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:.92,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false,relief:-.95},
    palette:{ground:'#c6bfad',ink:'#5a4630',fills:['#a2493a','#5b93a0','#c79a4e','#e0dacb','#c79a4e'],gap:'#c6bfad',skin:'#a2493a',skinPale:'#d9c08a',hair:'#3c3019',sun:'#a2493a'},
    ground:{kind:'stone',amount:.7}
  },
  rules:[
    'Cut the sign into the wall; leave the wall surface as the ground.',
    'Make the signs large — three or four to a column — and keep inner detail to a few cut lines.',
    'Shadow on the upper-left inner edge, light on the lower right: the reverse of raised relief.',
    'Paint inside the cut: yellow-ochre birds, red and blue alternating on the low signs.',
    'Mark the columns with a painted blue band.'
  ],
  symbolism:'Ramesses III\'s temple at Medinet Habu has some of the deepest-cut signs in Egypt — deep enough, it is often said, to shelter a nesting bird.',
  care:EG_CARE,
  conventions:EG_CONV,
  analysis:{
    source:'One reference photograph (analysed locally, not stored): three columns of large signs cut deep into pale stone, with blue column bands — in the manner of Ramesside temple walls such as Medinet Habu. The location was not stated.',
    observations:[
      'Signs are sunk well below the wall surface; their upper and left inner edges are in shadow.',
      'Very large signs: an owl or quail chick fills the column width.',
      'Blue painted bands divide the columns, about 7% of the column pitch.',
      'Colour survives inside the cuts: yellow-ochre birds, red and blue on the low signs, blue-green discs.',
      'Detail is cut, not painted: the owl\'s face, the seated man\'s limbs, the teeth of the water sign.'
    ],
    measured:{
      note:'Same caution as for raised relief: shadow reads as ink.',
      findings:[
        'Sparser than the painted walls: marks cover 23–24% and only 60–75% of the area is occupied.',
        'Low chroma overall (mean 0.03): pale stone #c3bdad with small areas of red #824837 and blue-green #437785.',
        'Strokes 2% of the column width — about three times the weight of the painted walls at the same scale.',
        'Not symmetric (0.49–0.69).'
      ],
      axes:{density:.84,weight:.18,uniformity:.09,geometry:.38,symmetry:.53,fill:1,chroma:.15,ornament:.95},
      samples:[
        {label:'Whole photograph',strokeRel:.007,strokeCV:.57,coverage:.236,solidFrac:.03,bilateral:.69,rotational:.25,folds:2,dots:206},
        {label:'Centre column',strokeRel:.02,strokeCV:.58,coverage:.228,solidFrac:.02,bilateral:.49,rotational:.21,folds:8,dots:79}
      ]
    }
  },
  reading:['Gay Robins, The Art of Ancient Egypt (British Museum Press, rev. ed. 2008)']
});

defTradition({
  id:'egypt-gilded-relief',family:'egypt',provenance:'analyzed',
  name:'Gilded relief',sub:'One metal, all light and shadow',native:'',
  region:'Egypt — shrines, coffins and furniture',medium:'Raised relief in gesso over wood, covered in gold leaf',period:'New Kingdom, c. 1550–1070 BCE (and modern replicas)',
  summary:'The same inscription with the colour taken away: signs, cartouches and spread-winged birds raised from a gold surface, readable only by highlight and shadow. Feathers become rows of ridges, baskets rows of grooves.',
  axes:{density:.97,weight:.12,uniformity:.26,geometry:.62,symmetry:1,fill:.81,chroma:.47,ornament:.96,abstraction:.6,narrative:.9},
  genes:{
    structure:{kinds:['inscription'],folds:8,density:.6,symmetry:'bilateral',borderBands:0},
    motifs:{hero:['wingedDisc','wingedScarab'],ring:EG_SIGNS.concat(['royalName','hgS34','hgR11']),filler:['hgX1','hgZ1','hgN35'],border:['egBlock','lines'],petal:'pointed'},
    line:{weight:1.6,contrast:.3,double:false,wobble:.08,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:.25,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false,relief:.95},
    palette:{ground:'#a48746',ink:'#4b3710',fills:['#b99d58','#c4a963','#b39551'],gap:'#a48746'},
    ground:{kind:'metal',amount:.5}
  },
  rules:[
    'One material: no colour, only relief. Raise every sign from the ground.',
    'Let light do the drawing — a bright edge upper left, a dark edge lower right.',
    'Turn inner detail into texture: ridges for feathers, grooves for basketwork and wigs.',
    'Crown the panel with spread wings; hang ankhs and shen rings from the claws.',
    'Set royal names in cartouches down the columns.'
  ],
  symbolism:'Gold was the flesh of the gods and does not tarnish; a gilded shrine or coffin gave its owner a divine, incorruptible body.',
  care:EG_CARE+' The reference photograph may show a modern replica; the idiom is that of the gilded shrines and coffins of the New Kingdom.',
  conventions:EG_CONV,
  analysis:{
    source:'One reference photograph (analysed locally, not stored): a gold-toned relief panel with two spread-winged birds over columns of signs and cartouches. Provenance not stated.',
    observations:[
      'A single golden hue throughout; all contrast is light and shadow.',
      'Two birds with long ridged wings at the top, each holding an ankh; columns of signs and cartouches below.',
      'Cartouches enclose stacked signs; raised ridges divide the columns.',
      'Feathers, wigs and baskets are textured with parallel ridges.'
    ],
    measured:{
      note:'A monochrome relief: the Lab reads lit planes as ink and shadow as fill.',
      findings:[
        'One hue (hue count 1): highlight #e5d193, mid #b99d58, ground #6e5925, shadow #291605.',
        'Very dense: density axis 0.97, 94% of the area occupied.',
        'Mirror score 0.86 across the panel — the paired wings.',
        'Edges on the vertical and horizontal 1.8–1.9× chance.'
      ],
      axes:{density:.97,weight:.12,uniformity:.26,geometry:.62,symmetry:1,fill:.81,chroma:.47,ornament:.96},
      samples:[
        {label:'Whole panel',strokeRel:.008,strokeCV:.41,coverage:.492,solidFrac:.16,bilateral:.86,rotational:.69,folds:16,dots:130},
        {label:'Columns only',strokeRel:.012,strokeCV:.58,coverage:.5,solidFrac:.11,bilateral:.89,rotational:.44,folds:16,dots:115}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'egypt-papyrus',family:'egypt',provenance:'analyzed',
  name:'Funerary papyrus',sub:'Vignette and text of the Book of the Dead',native:'prt m hrw, "Coming Forth by Day"',
  region:'Egypt — Thebes above all',medium:'Reed pen and brush, carbon black and mineral colour on papyrus',period:'New Kingdom to Ptolemaic, c. 1550–50 BCE',
  summary:'A painted scene and the spells that go with it: a god enthroned before a heaped offering table, drawn in a fine even black line and filled flat with red-brown, blue-green and white, beside a ruled grid of narrow columns of small pen-written signs. Headings are picked out in red.',
  axes:{density:.98,weight:.01,uniformity:1,geometry:.5,symmetry:.94,fill:1,chroma:.43,ornament:1,abstraction:.5,narrative:1},
  genes:{
    structure:{kinds:['vignette'],folds:8,density:.7,symmetry:'free',borderBands:0},
    motifs:{hero:['egSeatedGod','egEnthronedGoddess','egWingedGoddess'],ring:['offeringTable'].concat(EG_SIGNS),filler:['hgX1','hgZ1','lotusBud'],border:['lines','egBlock'],petal:'pointed'},
    line:{weight:1.5,contrast:.2,double:false,wobble:.1,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6,penScript:1},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#e4d9b8',ink:'#2c2a1e',fills:['#9f5333','#3f6f63','#f2ecd6','#c7a25c','#345340'],gap:'#e4d9b8',accent:'#a8402a',skin:'#9f5333',skinPale:'#dcc188',hair:'#3f6f63',sun:'#9f5333'},
    ground:{kind:'papyrus',amount:.8}
  },
  rules:[
    'Draw the outline first in a fine, even black line; then fill flat. No shading.',
    'Stand every figure on a ground line. Seat the god on a block throne on a low dais.',
    'Set an offering table in front of him: loaves on a tall stand, lotus flowers laid over the top.',
    'Rule the text area into narrow columns and write small, quick signs — a column is about a twentieth of the sheet wide.',
    'Three colours do most of the work: red-brown, blue-green, white. Write headings in red.'
  ],
  maths:'The seated figure is 14 grid squares from sole to hairline, against 18 for a standing one: the same body with the thigh turned level. The generator builds both from one set of proportions.',
  symbolism:'The spells of "Coming Forth by Day" equipped the dead to pass the gates of the underworld and join the sun. The vignette was not illustration but provision: the offering painted is the offering given.',
  care:EG_CARE,
  conventions:EG_CONV,
  analysis:{
    source:'One reference photograph (analysed locally, not stored): a funerary papyrus with a falcon-headed god enthroned before an offering table, a caption block above and about twenty-five ruled columns of cursive hieroglyphs to the right.',
    observations:[
      'A fine even black outline; flat red-brown skin, blue-green wig, collar and throne panels, white kilt patterned with scales.',
      'A large red sun disc ringed by a cobra on the god\'s head; was sceptre in the forward hand, ankh held on the lap.',
      'Block throne with a low back, an inset square in its lower corner, standing on a low dais.',
      'Offering table: two tall flared stands, round and oval loaves, a bundle of lotus flowers and buds laid across.',
      'Text in a ruled grid: narrow columns of small signs written with a pen, a few groups in red.',
      'No shading anywhere; every form sits on a ground line.'
    ],
    measured:{
      note:'Measured on the sheet, the text block and the figure separately.',
      findings:[
        'The finest, most even line in the family: strokes 0.2–0.4% of the sheet, CV 0–0.21.',
        'Text block: no fills at all (solid ink 0%), 3,887 separate marks, density axis 0.75.',
        'Figure: over half the inked area is solid colour (52%).',
        'Papyrus #e4d9b8; red-brown #9f5333 is 11% of the figure crop; blue-green #345340; ink a soft green-black #44513d.',
        'Edges on the vertical and horizontal 1.7–1.8× chance — the column grid.'
      ],
      axes:{density:.98,weight:.01,uniformity:1,geometry:.5,symmetry:.94,fill:1,chroma:.43,ornament:1},
      samples:[
        {label:'Whole sheet',strokeRel:.004,strokeCV:0,coverage:.293,solidFrac:.24,bilateral:.82,rotational:.45,folds:16,dots:593},
        {label:'Text columns',strokeRel:.003,strokeCV:0,coverage:.246,solidFrac:0,bilateral:1,rotational:.44,folds:16,dots:522},
        {label:'God and offering table',strokeRel:.002,strokeCV:.21,coverage:.344,solidFrac:.53,bilateral:.66,rotational:.36,folds:16,dots:149}
      ]
    }
  },
  reading:['Raymond O. Faulkner (trans.), The Ancient Egyptian Book of the Dead (British Museum Press, 1985)','Gay Robins, Proportion and Style in Ancient Egyptian Art (University of Texas Press, 1994)']
});

defTradition({
  id:'egypt-souvenir-papyrus',family:'egypt',provenance:'analyzed',
  name:'Souvenir papyrus',sub:'Modern painted papyrus after tomb scenes',native:'',
  region:'Egypt — workshops in Cairo, Luxor and the Delta',medium:'Gouache and metallic paint on modern papyrus',period:'Since the 1960s revival of papyrus-making',
  summary:'The painted papyrus sold to visitors: tomb scenes — a winged goddess kneeling, a goddess enthroned, a queen led by a god — redrawn in heavy black outline with bright red, turquoise and green or with black and gold glitter, under a band of decorative hieroglyphs. A living workshop tradition built on copying.',
  axes:{density:.93,weight:.05,uniformity:.31,geometry:.5,symmetry:.86,fill:.77,chroma:.44,ornament:.94,abstraction:.5,narrative:.8},
  genes:{
    structure:{kinds:['vignette','registers'],folds:8,density:.6,symmetry:'free',borderBands:1},
    motifs:{hero:['egWingedGoddess','egEnthronedGoddess','egSeatedGod','egLady'],ring:['offeringTable','royalName','lotusEg'].concat(EG_SIGNS),filler:['hgS34','hgX1','hgN5','lotusBud'],border:['egBlock','egLotusBand'],petal:'pointed'},
    line:{weight:2.6,contrast:.3,double:false,wobble:.1,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:.85,gold:.15},coverage:1,hatchGap:6},
    ornament:{dotRows:.1,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#dccf9e',ink:'#0f0d0c',fills:['#a42a13','#1a8ca0','#1c5a27','#ece4c8','#c98a1e','#1a8ca0'],gap:'#dccf9e',metal:'#c9a24a',skin:'#b0562c',skinPale:'#d9a45c',hair:'#0f0d0c',sun:'#a42a13'},
    ground:{kind:'papyrus',amount:.85}
  },
  rules:[
    'Copy a famous scene; simplify it; outline everything in heavy black.',
    'Fill with bright, opaque colour — red, turquoise, green, white — or with black and gold alone.',
    'Run a band of hieroglyphs and cartouches across the top as decoration.',
    'Pattern the dresses and wings: scales, stripes, dotted nets.',
    'Let the papyrus show: its crossed strips are part of the look.'
  ],
  symbolism:'The scenes most copied come from the tomb of Queen Nefertari in the Valley of the Queens: Ma\'at kneeling with spread wings, Isis enthroned, the queen led by the hand.',
  care:EG_CARE+' On souvenir papyri the text band is usually decorative — copied sign shapes rather than readable text. This generator writes real formulas instead.',
  conventions:EG_CONV,
  analysis:{
    source:'Two reference photographs of modern painted papyri (analysed locally, not stored): one in black and gold, one in bright colour, both after scenes in the tomb of Nefertari.',
    observations:[
      'Heavy black outline; large areas of solid black (wigs, dress, text panels) or bright flat colour.',
      'A kneeling goddess with wings spread forward in three tiers of feathers, facing an enthroned goddess in a horned sun-disc crown.',
      'Dresses and wings carry pattern: scale nets, dotted grids, stripes.',
      'A band of hieroglyphs and cartouches across the top, on black panels in the gold version.',
      'The crossed strips of the papyrus are clearly visible behind the paint.',
      'Gold glitter stands in for gold leaf.'
    ],
    measured:{
      note:'Measured on both sheets.',
      findings:[
        'The most saturated palette in the family: red #a42a13, turquoise #1a8ca0, green #1c5a27, black #07070a on papyrus #dccf9e.',
        'Black-and-gold sheet: one hue — papyrus #ebdabb, black #3d352a, gold #ab9645.',
        'Colour sheet: 70% of the inked area is flat fill; density axis 0.94.',
        'Bold, uneven line: 0.8% of the sheet, CV 0.51.'
      ],
      axes:{density:.93,weight:.05,uniformity:.31,geometry:.5,symmetry:.86,fill:.77,chroma:.44,ornament:.94},
      samples:[
        {label:'Colour sheet',strokeRel:.008,strokeCV:.51,coverage:.429,solidFrac:.23,bilateral:.79,rotational:.62,folds:16,dots:122},
        {label:'Black-and-gold sheet',strokeRel:.004,strokeCV:.42,coverage:.399,solidFrac:.24,bilateral:.76,rotational:.48,folds:16,dots:98},
        {label:'Black-and-gold figures',strokeRel:.007,strokeCV:.42,coverage:.446,solidFrac:.27,bilateral:.76,rotational:.62,folds:16,dots:55}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'egypt-tomb-painting',family:'egypt',provenance:'curated',
  name:'Theban tomb painting',sub:'Registers of daily life and offering',native:'',
  region:'Thebes (Luxor), the nobles\' tomb chapels',medium:'Mineral colour in gum or glue on mud plaster',period:'New Kingdom, 18th Dynasty, c. 1550–1295 BCE',
  summary:'The walls of a tomb chapel divided into registers: rows of offering bearers, musicians, farm work and marsh hunts, each standing on its own ground line, under a frieze of kheker knots and inside a ladder of colour blocks. Red-brown outline, flat ochres, Egyptian blue and green on a pale ground.',
  axes:{density:.75,weight:.3,uniformity:.75,geometry:.5,symmetry:.4,fill:.95,chroma:.7,ornament:.5,abstraction:.5,narrative:1},
  genes:{
    structure:{kinds:['registers','vignette'],folds:8,density:.55,symmetry:'free',borderBands:1},
    motifs:{hero:['egOfferingBearer','egLady','egSeatedGod','egEnthronedGoddess'],ring:['lotusEg','papyrusUmbel','offeringTable','lotusBud','hieroWord','hgG39','hgG5','hgS34'],filler:['lotusBud','hgX1','hgN5'],border:['egBlock','kheker','egLotusBand'],petal:'pointed'},
    line:{weight:2,contrast:.25,double:false,wobble:.12,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#e6dfcb',ink:'#5a2a1c',fills:['#a8452c','#d9a441','#3d7f7a','#2f5d8c','#f5efdf','#1d1a17'],gap:'#e6dfcb',skin:'#a8452c',skinPale:'#e0b96a',hair:'#1d1a17',sun:'#a8452c'},
    ground:{kind:'plaster',amount:.55}
  },
  rules:[
    'Divide the wall into horizontal registers; give each its own ground line.',
    'Repeat figures along a register with small changes — a row of bearers, each with a different offering.',
    'Outline in red-brown, fill flat, then add detail in line: pleats, wig curls, feathers.',
    'Men red-brown and striding; women pale yellow with feet together.',
    'Close the top with a kheker frieze and frame the wall with a ladder of colour blocks.'
  ],
  symbolism:'What is painted is provided: bearers bring food for ever, and the marsh scene promises rebirth. The kheker frieze copies the knotted tops of reed-mat walls.',
  care:EG_CARE,
  conventions:EG_CONV,
  reading:['Richard Parkinson, The Painted Tomb-Chapel of Nebamun (British Museum Press, 2008)','Heinrich Schäfer, Principles of Egyptian Art, trans. John Baines (Griffith Institute, 1974)']
});

defTradition({
  id:'egypt-inlay-jewellery',family:'egypt',provenance:'curated',
  name:'Inlaid gold jewellery',sub:'Broad collars and pectorals',native:'wsḫ, "the broad one"',
  region:'Egypt — royal and court workshops',medium:'Gold cells inlaid with carnelian, turquoise, lapis lazuli, feldspar, faience and glass',period:'Middle and New Kingdom, c. 2000–1070 BCE',
  summary:'The broad collar is rows of tube beads, petals and drop pendants hanging in concentric arcs between two terminals; the pectoral beneath it holds a winged scarab or a wedjat eye. Every shape is a gold-walled cell filled with one of three stones — red carnelian, green-blue turquoise, dark blue lapis.',
  axes:{density:.85,weight:.35,uniformity:.9,geometry:.6,symmetry:.95,fill:1,chroma:.9,ornament:.9,abstraction:.7,narrative:.3},
  genes:{
    structure:{kinds:['collar','medallion'],folds:16,density:.75,symmetry:'bilateral',borderBands:0},
    motifs:{hero:['wingedScarab','hgD10','wingedDisc','shenRing','hgL1'],ring:['lotusEg','papyrusUmbel','hgS34','hgR11','lotusBud','uraeus','hgD10'],filler:['lotusBud','hgN5','dot'],border:['egLotusBand','egBlock','petalRow'],petal:'drop'},
    line:{weight:2.6,contrast:.2,double:false,wobble:.02,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:.85,gold:.15},coverage:1,hatchGap:6},
    ornament:{dotRows:.15,echo:.1,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:['#b5391f','#3aa6a0','#1f3f8f'],groundStitch:false},
    palette:{ground:'#f3ecdb',ink:'#a87a1e',fills:['#b5391f','#3aa6a0','#1f3f8f','#3aa6a0','#b5391f','#4f8f5a'],gap:'#f3ecdb',metal:'#d2a53c',sun:'#b5391f'},
    ground:{kind:'paper',amount:.25}
  },
  rules:[
    'Build every form as a cell: a gold wall, one stone colour inside.',
    'Rotate three colours — carnelian red, turquoise, lapis blue — so no two neighbours match.',
    'Hang the rows in concentric arcs: tube beads, then petals, then an outer fringe of drops.',
    'Close the collar on two terminals; counterweight it at the back.',
    'Mirror everything on the centre line.'
  ],
  maths:'A broad collar is a set of concentric arcs; because the arc length grows with the radius, each row needs more beads than the last. The generator recounts every row to keep bead width steady.',
  symbolism:'Colour is meaning: red carnelian for blood and life, turquoise for joy and new growth, lapis for the night sky and the hair of the gods, gold for their flesh. The winged scarab is the sun at dawn.',
  care:EG_CARE,
  reading:['Carol Andrews, Ancient Egyptian Jewellery (British Museum Press, 1990)']
});

// what the generated columns actually say, for the profile pages
for(const T of SG.traditions)if(T.family==='egypt'&&T.id!=='egypt-inlay-jewellery')
  T.texts=HG.formulas.map(f=>[f.t,f.m]).concat(HG.carts.map(c=>[c.t+' (in a cartouche)',c.m]),['ankh','nefer','kheper','djet','neheh','nbtawy','nswbity','sara','mhetep'].map(k=>[HG.words[k].t,HG.words[k].m]));
