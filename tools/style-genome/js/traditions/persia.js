'use strict';
/* Persia — eighteenth culture family: the floral half of Persian design. (Persian
   geometric work, girih and tile mosaic, is in the Islamic geometric family.) All four
   traditions are CURATED: no reference images were supplied, so nothing here is
   measured. Scrolls, blossoms and layouts live in js/core/persia.js. Palettes were set
   by eye from published photographs. */

defFamily({id:'persia',name:'Persia',native:'Īrān · honar-e īrānī',
  blurb:'The floral design of Iran from the sixteenth century on, worked out in the royal book workshops and carried from there into carpets, tiles, textiles and lacquer. Its grammar has two parts: the spiral scroll with its split leaves, and the blossoms that grow on it. A carpet with a medallion at its centre; a manuscript page lit by a gold sunburst; shawl cloth sown with bent-tipped boteh; a rose bush with a nightingale in it. The straight-line geometry that goes with all this is in the Islamic geometric family.'});

const PE_CARE='These are Iranian arts with a continuous history and living makers: carpets are still knotted in Tabriz, Kashan, Isfahan, Kerman and by Qashqai, Bakhtiari and Turkmen weavers, and illumination and miniature painting are taught in Iran today. The carpet-weaving skills of Kashan and of Fars, and the art of illumination, are inscribed by UNESCO as intangible heritage. A design is the property of a workshop and a city; a carpet is called by the place whose manner it follows. The designs here are generic and follow no one city or named carpet. Illumination was made for the Qurʾan and for poetry alike; no text is written or imitated in this app. The readings given for the cypress, the rose and the nightingale are those of Persian poetry, where they are explicit; the boteh has no agreed meaning and the ones listed are guesses of long standing. “Paisley” is the Scottish mill town that copied the shawls.';
const PE_CONV=[
  ['Two systems','Eslimi is the spiral stem with its split leaves; khatai is the blossoms, buds and leaves that grow on a second, finer stem. A design lays one over the other.'],
  ['The spiral','Every stem is part of a spiral that winds in to a blossom. Stems branch only from the outer side of a curve and never cross at a sharp angle.'],
  ['The split leaf','The leaf of eslimi is divided: a long lobe curving with the stem and a short one turning back. It can swell into a cartouche or thin to a hair.'],
  ['Profile and plan','Blossoms are drawn either in profile, as a fan of petals on a calyx, or from above as a rosette, and the two alternate along a stem.'],
  ['A quarter drawn','A carpet design is one quarter, mirrored across both axes. The cartoon is a painted sheet of squared paper, one square to a knot.'],
  ['Centre and corners','The medallion at the centre and the quarter medallions in the corners are the same figure: a carpet is a window on to an endless field of medallions.'],
  ['Border and guards','A wide main border between narrow guard stripes. The border pattern must turn the corner without breaking.'],
  ['Gold and lapis','Illumination is gold and ultramarine first, with touches of red, green, white and turquoise, and every form is outlined in black.']
];
const PE_GLOSS=[['Eslimi','The spiral scroll and split leaf: the arabesque.'],['Khatai','“From Cathay”: the blossom-and-leaf system, Chinese in origin.'],['Toranj','Citron: the central medallion of a carpet or book cover.'],['Lachak','The corner piece, a quarter medallion.'],['Shamseh','A sunburst medallion; from shams, the sun.'],['Tazhib','Illumination: literally gilding.'],['Boteh','Bush or shrub; the drop-shaped motif known in English as paisley.'],['Termeh','Fine woven shawl cloth of Yazd and Kerman.'],['Gol o bolbol','Rose and nightingale. Also gol o morgh, flower and bird.'],['Shah Abbasi','The composite profile blossom, named for Shah Abbas I (reigned 1588–1629).']];

const peT=o=>defTradition(Object.assign({family:'persia',provenance:'curated',care:PE_CARE,conventions:PE_CONV,glossary:PE_GLOSS},o));
const PE_ORN=x=>Object.assign({dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},x);
const PE_LINE=(weight,x)=>Object.assign({weight,contrast:.5,double:false,wobble:.005,taper:0,breaks:0,dash:null,misreg:0},x);

peT({
  id:'safavid-carpet',name:'Persian medallion carpet',sub:'Medallion, corners, a field of scrolls, a wide border',native:'farsh · lachak-toranj',
  region:'Iran: Tabriz, Kashan, Isfahan, Kerman, and the court workshops that set the style',medium:'Wool or silk pile knotted on a cotton or silk foundation from a painted cartoon',period:'The design from about 1500; woven without a break since',
  summary:'A red field covered with gold stems that wind into spirals, each ending in a blossom of red and ivory petals. At the centre a lobed medallion in dark blue and gold, with a cartouche and a finial above and below; in each corner a quarter of the same medallion. Round it a broad dark border where a vine carries blossoms turn about, between two narrow pale stripes.',
  axes:{density:.95,weight:.2,uniformity:.8,geometry:.4,symmetry:1,fill:1,chroma:.8,ornament:1,abstraction:.6,narrative:.1},
  genes:{
    structure:{kinds:['toranj'],folds:8,density:.8,symmetry:'bilateral',borderBands:3,bare:.1},
    motifs:{hero:['peToranj'],ring:['pePalmette','peRosette'],filler:['peRosette'],border:['peVine','peCartouche','peGuard','peMadakhil'],tile:['peIslimi'],petal:'pointed'},
    line:PE_LINE(0.7),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:PE_ORN(),
    palette:{ground:'#b9a88c',ink:'#231712',fills:['#1f2f5a','#a82a22','#d6a94a','#4c7a4a','#efe4c8','#3f9aa0'],ciFills:['#1f2f5a','#a82a22','#d6a94a','#4c7a4a','#efe4c8','#3f9aa0'],gap:'#a82a22'},
    ground:{kind:'cloth',amount:.45}
  },
  rules:[
    'Draw one quarter of the carpet on squared paper and paint it.',
    'Lay the main spirals first, then a second, finer system of stems over them.',
    'Set a blossom at the heart of every spiral and where stems cross.',
    'Fit the border so that its pattern arrives whole at every corner.',
    'Knot from the bottom, a row at a time, reading the cartoon square by square.'
  ],
  maths:'The field has two mirror lines, so one quarter determines the whole. A scroll is a spiral whose radius falls steadily as it turns; scrolls are set on a grid, each the mirror image of its neighbour, so that adjacent ones leave from a common point in opposite senses and form an S. The medallion and corner pieces are one lobed outline, r = 1 + k·|cos(nθ/2)|, drawn whole at the centre and clipped to a quarter at each corner.',
  symbolism:'A carpet is a garden carried indoors, and in Persian the garden is paradise. The medallion has been read as a pool, a dome seen from below, the sun; the designers took it from book covers. A great carpet was a gift between courts and the pride of a shrine.'
});

peT({
  id:'persian-tazhib',name:'Persian illumination',sub:'A gold sunburst, ruled margins, scrolls in the corners',native:'tazhīb',
  region:'Iran: Shiraz, Herat, Tabriz, Qazvin, Isfahan',medium:'Shell gold, ultramarine and other pigments on burnished paper',period:'The classical manner from the 1400s; practised today',
  summary:'A page of polished paper inside ruled lines of gold. In the middle a medallion of many points, gold and deep blue, its heart a rosette, with hair-fine rays running out from every point. Above and below hang smaller pendants. The corners are cut off by diagonal lines and filled with blue, and over the blue run gold spirals with small blossoms.',
  axes:{density:.8,weight:.1,uniformity:.9,geometry:.6,symmetry:1,fill:1,chroma:.8,ornament:1,abstraction:.8,narrative:0},
  genes:{
    structure:{kinds:['shamsa'],folds:16,density:.8,symmetry:'radial',borderBands:2,bare:.3},
    motifs:{hero:['peShamsa'],ring:['pePalmette','peBud'],filler:['peRosette'],border:['peCartouche','peVine','peGuard'],tile:['peIslimi'],petal:'pointed'},
    line:PE_LINE(0.6,{wobble:0}),
    fill:{modes:{flat:.7,gold:.3},coverage:1,hatchGap:5},
    ornament:PE_ORN(),
    palette:{ground:'#e4d3a8',ink:'#1c1410',fills:['#1d3f8a','#b5352a','#d9a52b','#3f7d4f','#fbf7ea','#3a9a9a'],ciFills:['#1d3f8a','#b5352a','#d9a52b','#3f7d4f','#fbf7ea','#3a9a9a'],metal:'#d9a52b',gap:'#1d3f8a'},
    ground:{kind:'paper',amount:.3}
  },
  rules:[
    'Burnish the paper. Rule the margins and find the centre.',
    'Draw the medallion with compasses; prick the drawing through to repeat each sector.',
    'Lay the gold first and burnish it.',
    'Fill the grounds with ultramarine, then the small colours.',
    'Outline everything in black with a brush of a few hairs, and draw the rays last.'
  ],
  maths:'The sunburst has the symmetry of a regular polygon: one sector of 360/n degrees is drawn and repeated by rotation and reflection, which is what pricking a folded sheet does. Its outline is a star polygon whose points alternate between two radii. The rays are radii continued, alternately long and short.',
  symbolism:'The sunburst opens the book: it may hold the owner’s name or nothing at all. Gold is light, and lapis the night sky that shows it. The same medallion sits at the crown of a dome, where the building does what the page does.'
});

peT({
  id:'termeh',name:'Termeh shawl cloth',sub:'Rows of boteh over a deep ground',native:'termeh',
  region:'Yazd and Kerman, Iran; a sister craft to the shawls of Kashmir',medium:'Fine wool and silk woven in twill tapestry on a drawloom',period:'From the Safavid period; hand weaving survives in Yazd',
  summary:'Cloth of deep red sown with small boteh, each a drop with its tip bent to one side, a flower in its belly and a fringe of gold round its edge. They stand in rows, each row set between the two below and leaning the other way, so that the cloth seems to ripple. A band of blossoms runs round the edge.',
  axes:{density:.9,weight:.2,uniformity:1,geometry:.5,symmetry:.6,fill:1,chroma:.7,ornament:.9,abstraction:.7,narrative:0},
  genes:{
    structure:{kinds:['termeh'],folds:4,density:.7,symmetry:'grid',borderBands:2,bare:.9},
    motifs:{hero:['peBoteh'],ring:['peBoteh','peRosette'],filler:['peRosette'],border:['peVine','peGuard','peMadakhil'],tile:['peBotehRows'],petal:'drop'},
    line:PE_LINE(0.6,{wobble:0}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:PE_ORN(),
    palette:{ground:'#3a2420',ink:'#1e1210',fills:['#7a1e22','#c8452a','#d6a53a','#4f7a4a','#efe2c4','#3f8f96'],ciFills:['#7a1e22','#c8452a','#d6a53a','#4f7a4a','#efe2c4','#3f8f96'],gap:'#7a1e22'},
    ground:{kind:'cloth',amount:.5}
  },
  rules:[
    'Set up the drawloom with one repeat of the pattern tied into its cords.',
    'Weave a row of boteh; a second weaver, the draw-boy, lifts the pattern threads.',
    'Offset the next row by half a repeat and reverse it.',
    'Keep every boteh the same; the richness is in their number.',
    'Finish with a border of blossoms on all four sides.'
  ],
  maths:'One figure, translated along a row; the next row is the same figure reflected and shifted half a step. That is a glide reflection, and the whole cloth has the symmetry mathematicians call pg: no mirror lines and no turning points, only the glide. It is why the pattern seems to move.',
  symbolism:'Termeh is the cloth of occasions: it wraps the wedding gifts, covers the table at the new year and lines the best coat. The boteh has been called a cypress bent by the wind, a flame, an almond and a tear; none of these is recorded as the weaver’s meaning.'
});

peT({
  id:'gol-o-morgh',name:'Rose and nightingale',sub:'A flowering bush with a bird in it',native:'gol o bolbol · gol o morgh',
  region:'Iran, above all Shiraz and Isfahan',medium:'Watercolour and gold on paper; the same subject under varnish on lacquered pen boxes, mirror cases and book covers',period:'From the late 1600s; at its height under the Zand and Qajar dynasties, 1750–1900',
  summary:'A buff page with a single rose bush growing across it from one lower corner. Three full roses, pink and white, each petal shaded; buds on thin stems; long saw-edged leaves turning as they go. Half-way up a small bird sits on a branch with its beak open toward the largest flower. Nothing else: no ground, no sky.',
  axes:{density:.5,weight:.2,uniformity:.3,geometry:.1,symmetry:.2,fill:.9,chroma:.6,ornament:.6,abstraction:.3,narrative:.6},
  genes:{
    structure:{kinds:['golomorgh'],folds:2,density:.5,symmetry:'free',borderBands:2,bare:.4},
    motifs:{hero:['peRose'],ring:['peNightingale','peBud'],filler:['peLeaf'],border:['peVine','peGuard'],petal:'round'},
    line:PE_LINE(0.7,{wobble:.01}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:PE_ORN(),
    palette:{ground:'#e6d3a6',ink:'#3a2418',fills:['#3a5a8a','#c2485a','#d6a53a','#55803f','#f9ece6','#4a9a98'],ciFills:['#3a5a8a','#c2485a','#d6a53a','#55803f','#f9ece6','#4a9a98'],metal:'#d6a53a',gap:'#e6d3a6'},
    ground:{kind:'paper',amount:.35}
  },
  rules:[
    'Let the bush enter from a lower corner and cross the page on a slant.',
    'Place the largest rose high and off-centre; turn each flower a different way.',
    'Draw buds and leaves on stems that bend back toward the middle.',
    'Set the bird where it can look at a rose.',
    'Shade each petal from its edge inward, and leave the paper for the lights.'
  ],
  maths:'The composition is asymmetric but balanced: the stems all leave one point and their ends are spread so that the centre of the blossoms falls near the middle of the page. A rose is petals in rings of five, each ring turned by a little over a third of a petal, round a small spiral.',
  symbolism:'The nightingale loves the rose and sings to it all night; the rose does not answer, and its thorns draw blood. For the poets this is every lover and beloved, and for the mystics the soul and God. Painted on a pen box, it is what the pen inside will write about.'
});
