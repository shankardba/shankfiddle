'use strict';
/* Islamic geometric art — tenth culture family. All seven traditions are CURATED: no
   reference images were supplied, so nothing here is measured. Geometry follows the
   polygons-in-contact method (Hankin; Bonner; Kaplan) and lives in js/core/girih.js.
   Palettes were set by eye from published photographs of the monuments named and should
   be replaced by measurements when reference images are available.

   What is left out on purpose: calligraphy. Most inscriptions on these buildings and
   pages are Qurʾānic; a machine-made approximation of that text, or a wrong letter in
   it, is not an ornament problem. Inscription bands are drawn as plain strap borders.
   Vegetal scrollwork (arabesque, islīmī) is a separate grammar and is not built yet. */

defFamily({id:'islamic-geometric',name:'Islamic geometric',native:'girih · zellīj · handasa',
  blurb:'Star patterns grown from hidden grids of polygons, from Córdoba to Samarkand over a thousand years: eight-, ten-, twelve- and sixteen-pointed rosettes locked together by kites and petals, drawn with compass and straightedge, and built as cut tile, carved stone, joined wood, brick and gilded page. The lines are widened into straps that pass over and under one another without end.'});

const IS_CARE='“Islamic art” names the arts of many peoples over fourteen centuries, made by and for Muslims, Christians, Jews and others living in those lands; no single meaning covers it. These patterns are a shared craft tradition, taught in workshops and pattern scrolls, and are not restricted designs — but the masterpieces are particular: a generated panel follows the method, and is not a copy of any wall, door or page. Calligraphy is left out deliberately. Most inscriptions on these works are verses of the Qurʾān, which must be written correctly and with care; the app writes none, and draws no pseudo-script. The star patterns are not “a ban on images made visible”: figures are common in palaces, books and metalwork, and geometry is the chosen language of mosques and Qurʾāns, not the only one the culture had. Medieval sources say almost nothing about what the patterns mean; readings such as unity, infinity or the order of creation are later interpretations, some of them recent.';
const IS_CONV=[
  ['The grid is hidden','Every pattern is grown from a tiling of polygons that is drawn first and then removed. Scratched construction lines survive under plaster, and the Topkapı scroll shows them in red dots and uninked grooves.'],
  ['Contact angle','Two pattern lines cross at the midpoint of every edge of the hidden tiling. The angle they make with the edge fixes the character of the whole design: sharp stars at a steep angle, broad ones at a shallow angle.'],
  ['Rosette','A star, a ring of petals (hexagons with two long sides), and darts or small stars between the petals. Its point count is the number of sides of the hidden polygon it grew in.'],
  ['Strapwork','The lines are drawn as bands of even width that pass over and under one another alternately. A band is never cut at a crossing where it is on top.'],
  ['Cut on the symmetry','A panel ends on lines of mirror symmetry, usually through star centres, so quarter- and half-stars sit on its corners and edges and the pattern is felt to continue beyond the frame.'],
  ['Counting','Fours and eights fit a square grid, sixes and twelves a triangular one; fives and tens fit neither, and need their own polygons — pentagons, barrel hexagons, bow-ties.'],
  ['Colour by shape','Each kind of piece keeps one colour, or pieces of one kind alternate between two, so the eye can read the stars at one distance and the network at another.'],
  ['Frame','A field sits inside borders: a twisted strap, a row of stars, a band for an inscription, a crest of stepped merlons.']
];
const IS_GLOSS=[['Girih','Persian “knot”: a geometric strapwork pattern, and the craft of designing one.'],['Zellīj','Maghribi mosaic of glazed tiles, each piece chipped to shape by hand and set face down.'],['Alicatado','The Spanish name for the same cut-tile mosaic, as in the Alhambra.'],['Lacería','Spanish for interlaced strapwork.'],['Khātam','“Seal”: the eight-pointed star of two squares; also Persian micro-mosaic inlay.'],['Shamsa','“Little sun”: a star or rosette medallion, as on the opening page of a book.'],['Muqarnas','Tiers of small niches corbelled out from a corner or up into a vault; drawn in plan as a field of squares and rhombs.'],['Muʿarraq','Persian tile mosaic: shapes cut from tiles each glazed one colour and fitted together.'],['Bannāʾī','“Builder’s technique”: patterns made in the brick bond itself with glazed and plain bricks.'],['Minbar','The stepped pulpit of a mosque; the great Mamluk ones are faced with star patterns in joined and inlaid wood.'],['Mihrab','The niche in the wall of a mosque that faces Mecca.'],['Alfiz','The rectangular frame round an arch.'],['Iwan','A vaulted hall open at one end through a great arch.'],['Polygons in contact','The construction used here: pattern lines grown from the edge midpoints of a hidden tiling.'],['Hasht-bihisht','“Eight paradises”: an eightfold plan.']];

const isT=(o)=>defTradition(Object.assign({family:'islamic-geometric',provenance:'curated',care:IS_CARE,conventions:IS_CONV,glossary:IS_GLOSS},o));
const IS_ORN=(strap,weave,x)=>Object.assign({dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false,strap,weave},x);
const IS_LINE=(weight,x)=>Object.assign({weight,contrast:.35,double:false,wobble:0,taper:0,breaks:0,dash:null,misreg:0},x);

isT({
  id:'zellij',name:'Zellīj tile mosaic',sub:'Hand-cut glazed pieces, high-count rosettes',native:'زليج zellīj',
  region:'Morocco — Fez, Meknes, Marrakesh; Tlemcen',medium:'Glazed earthenware tiles chipped to shape and set in plaster',period:'13th century (Marinid) to the present',
  summary:'A wall face covered edge to edge with small glazed pieces, each one colour, fitted with a hair of white between them. Great rosettes of twelve and sixteen points sit on a square grid; their petals, kites and darts are each a named shape, cut by the hundred. Colour goes by shape. A crest of stepped merlons closes the top of the dado.',
  axes:{density:1,weight:.1,uniformity:.95,geometry:1,symmetry:1,fill:1,chroma:.85,ornament:.7,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['girih','iwan','domePlan'],folds:16,density:.75,symmetry:'radial',borderBands:1,bare:1},
    motifs:{hero:['rosette16','rosette12','rosette8'],ring:['khatam','rosette8'],filler:['khatam'],border:['merlon','khatamBand','strapPlait'],petal:'pointed',tile:['sixteen','twelveFour','octRosette','twelveRosette','khatam']},
    line:IS_LINE(1.0),
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:IS_ORN(.42,0),
    palette:{ground:'#f1eadb',ink:'#3b3128',fills:['#1e3f8c','#1f6f4a','#d39a1e','#161514','#9a5a22','#2a8e99'],ciFills:['#1e3f8c','#1f6f4a','#d39a1e','#161514','#2a8e99','#1e3f8c','#9a5a22','#1f6f4a'],gap:'#f1eadb'},
    ground:{kind:'plaster',amount:.25}
  },
  rules:[
    'Choose the star count first; sixteen and twelve are the showpieces, eight the workhorse.',
    'Lay the rosettes on a square grid and let the hidden polygons decide every other shape.',
    'Give each shape one colour; keep the white joint the same width everywhere.',
    'Cut the panel through the centres of the corner rosettes.',
    'Close the top with a row of stepped merlons, light against dark.'
  ],
  maths:'The pieces are the faces of a line arrangement: lines leave the midpoints of a hidden tiling of sixteen- or twelve-sided polygons at one fixed angle and stop where they meet. The app finds the faces by walking a planar graph, sorts them into classes by side count and area, and colours by class — which is exactly how a zellīj master’s repertoire of named shapes (several hundred of them) works.',
  symbolism:'Craftsmen name the shapes, not the meanings: the sixteen-pointed star is simply “sixteen”. The wall is a display of patience and exactness, and of the patron’s means.'
});

isT({
  id:'nasrid-alicatado',name:'Nasrid tile dado',sub:'White interlace over black, green, honey and blue',native:'alicatado · lacería',
  region:'Granada — the Alhambra; Seville; Fez',medium:'Cut glazed tile; the same designs in carved and painted plaster above',period:'13th–15th centuries',
  summary:'The lower walls of the Nasrid palaces: white straps a finger wide run over and under each other across the whole dado, and the cells between them are filled with four colours — black, copper green, honey and blue — turning like a pinwheel round each star. The patterns are mostly fours and eights, cut on a square grid.',
  axes:{density:1,weight:.25,uniformity:.95,geometry:1,symmetry:1,fill:1,chroma:.75,ornament:.75,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['girih','iwan'],folds:8,density:.6,symmetry:'radial',borderBands:1,bare:1},
    motifs:{hero:['khatam','rosette8','rosette12'],ring:['khatam'],filler:['khatam'],border:['merlon','guilloche','khatamBand'],petal:'pointed',tile:['khatam','octRosette','hexWeave','twelveFour','hexStar']},
    line:IS_LINE(1.1),
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:IS_ORN(.7,1,{pinwheel:1}),
    palette:{ground:'#f0e9d6',ink:'#2c2620',fills:['#17181a','#2d6b4c','#c98a2a','#2a4a8a'],ciFills:['#2a4a8a','#17181a','#2d6b4c','#c98a2a','#17181a','#2a4a8a','#c98a2a','#2d6b4c'],gap:'#f0e9d6'},
    ground:{kind:'plaster',amount:.25}
  },
  rules:[
    'Make the strap wide enough to read as a white ribbon, not a joint.',
    'Weave it: over, under, over, without a single exception.',
    'Fill the cells with four colours only, and let no two neighbours of the same shape match.',
    'Keep to eight-pointed stars and their relatives; let the weave, not the star count, carry the richness.'
  ],
  maths:'A strap pattern is a set of lines that cross two at a time, so the regions between them can be coloured like a chessboard, and that is enough to guarantee the over-and-under can alternate everywhere. The app labels crossings alternately along each strap and flips whole straps until every crossing has one above and one below. Where a strap passes under, it is cut back to the exact edge of the one above.',
  symbolism:'The Alhambra’s walls carry their meaning in words — poems and the Nasrid motto run in the plaster above. The tile dado beneath is the craft of the lacería itself: a line with no beginning that never tangles.'
});

isT({
  id:'persian-girih',name:'Persian girih, brick and glaze',sub:'Fivefold strapwork in buff brick with turquoise',native:'گره girih',
  region:'Iran and Central Asia — Isfahan, Maragha, Kharraqan, Bukhara',medium:'Cut and moulded brick, carved stucco, turquoise-glazed inserts',period:'11th–14th centuries (Seljuk and Ilkhanid)',
  summary:'Tens and fives: decagons, five-pointed stars, kites and bow-ties in long straight straps that travel across a whole wall. The strap is raised brick the colour of the building; the cells are sunk, and a few are set with turquoise or cobalt glaze. The same hidden grid gives a sharp pattern, a middle one and a broad one.',
  axes:{density:.9,weight:.4,uniformity:.95,geometry:1,symmetry:.95,fill:.5,chroma:.35,ornament:.6,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['girih','iwan','domePlan'],folds:10,density:.55,symmetry:'radial',borderBands:1,bare:1},
    motifs:{hero:['rosette10','khatam'],ring:['khatam'],filler:['khatam'],border:['girihBand','strapPlait','hexStarBand'],petal:'pointed',tile:['tenMedian','tenObtuse','girihBow','tenAcute','hexStar']},
    line:IS_LINE(1.4),
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:IS_ORN(.62,1,{relief:.3}),
    palette:{ground:'#d8c19c',ink:'#5a4630',fills:['#1c9aa0','#1d3f93','#c4a377','#b08a5e'],ciFills:['#1c9aa0','#c4a377','#b79668','#1d3f93','#c9ab80','#1c9aa0','#b08a5e'],gap:'#d8c19c'},
    ground:{kind:'plaster',amount:.45}
  },
  rules:[
    'Set decagons on a rhombic grid of 72° and bridge them with pentagons.',
    'Pick one contact angle — 72°, 54° or 36° — and keep it on every edge.',
    'Let the straps run straight wherever they can; a long unbroken line is the mark of a good girih.',
    'Leave most cells the colour of the brick; set glaze only in the stars or the smallest pieces.'
  ],
  maths:'Fivefold symmetry cannot repeat on its own, so the designers found tilings that hold it locally: decagons at the corners of a 72° rhombus, each ringed by pentagons, with one barrel-shaped hexagon closing the gap. Changing only the contact angle on that one tiling produces the acute, median and obtuse families. At 54° the lines pass straight through every edge — the decoration of the five “girih tiles” identified by Lu and Steinhardt in 2007, whose largest use, at the Darb-i Imam in Isfahan, comes close to a quasi-periodic tiling.',
  symbolism:'Girih means “knot”. Builders’ scrolls give constructions, not explanations; the patterns were part of the mathematics of the workshop, discussed with geometers such as Abū’l-Wafāʾ, who wrote on “what the artisan needs of geometric constructions”.'
});

isT({
  id:'timurid-mosaic',name:'Timurid tile mosaic',sub:'Cobalt and turquoise faience, white straps',native:'معرق muʿarraq',
  region:'Samarkand, Herat, Mashhad, Isfahan, Yazd',medium:'Tile mosaic: pieces sawn from single-colour glazed slabs',period:'14th–17th centuries (Timurid and Safavid)',
  summary:'Whole portals sheathed in glazed mosaic. Thin white straps draw ten- and twelve-pointed rosettes across a deep cobalt field; turquoise, black, ochre and green fill the stars and petals. Arches rise in rectangular frames, their spandrels carrying one pattern and the niche another.',
  axes:{density:1,weight:.15,uniformity:.95,geometry:.95,symmetry:1,fill:1,chroma:.9,ornament:.8,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['iwan','girih','domePlan'],folds:10,density:.7,symmetry:'radial',borderBands:1,bare:1},
    motifs:{hero:['rosette10','rosette12','rosette16'],ring:['khatam','rosette8'],filler:['khatam'],border:['guilloche','hexStarBand','strapPlait','girihBand'],petal:'pointed',tile:['tenAcute','twelveSix','twelveRosette','sixteen','hexStar','tenMedian']},
    line:IS_LINE(.9),
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:IS_ORN(.4,1),
    palette:{ground:'#f2ecdc',ink:'#1b2244',fills:['#17307c','#1fa0a6','#15161a','#d2a23a','#2b7a56'],ciFills:['#1fa0a6','#17307c','#17307c','#d2a23a','#15161a','#2b7a56','#17307c','#1fa0a6'],gap:'#f2ecdc'},
    ground:{kind:'porcelain',amount:.3}
  },
  rules:[
    'Keep the strap thin and white, the field deep blue.',
    'Put turquoise in the stars, cobalt in the petals, and spend ochre and black sparingly.',
    'Frame every arch in a rectangle and give spandrel and niche different patterns.',
    'Use tens and twelves; mix two star families in one field when the wall is large.'
  ],
  maths:'A field with two star families — twelve-pointed rosettes with six-pointed stars between — comes from a hidden tiling of twelve-sided polygons, squares and hexagons: the big polygons sit on a triangular lattice, a square bridges each pair, and the hexagons are what is left. The pointed arch is struck from two centres set a fifth of the span inside each jamb.',
  symbolism:'Blue and turquoise against desert brick: the dome as sky is a reading the buildings themselves invite, in inscriptions that speak of the heavens. The geometry is not labelled.'
});

isT({
  id:'mamluk-illumination',name:'Mamluk Qurʾān illumination',sub:'Gold strapwork on lapis blue',native:'تذهيب tadhhīb',
  region:'Cairo and Damascus',medium:'Gold, lapis lazuli and opaque colours on paper',period:'14th–15th centuries',
  summary:'The opening pages of the great Mamluk Qurʾāns: a square field holding one star pattern radiating from a central rosette, drawn in gold straps edged with a fine dark line, the cells filled with lapis blue and touches of red, green and white. Around it, bands of twisted gold strap. The inscription panels above and below are left here as plain borders.',
  axes:{density:1,weight:.12,uniformity:.95,geometry:.95,symmetry:1,fill:1,chroma:.8,ornament:.9,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['girih','domePlan'],folds:12,density:.6,symmetry:'radial',borderBands:2,bare:.35},
    motifs:{hero:['rosette12','rosette16','rosette10'],ring:['khatam','rosette8'],filler:['khatam'],border:['guilloche','strapPlait','khatamBand'],petal:'pointed',tile:['twelveRosette','sixteen','tenAcute','octRosette','twelveSix']},
    line:IS_LINE(.9),
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:IS_ORN(.55,1),
    palette:{ground:'#efe6cf',ink:'#16130f',fills:['#1c2f73','#2a4596','#a7332a','#2f6e4f','#16130f'],ciFills:['#1c2f73','#2a4596','#1c2f73','#a7332a','#16130f','#2f6e4f','#2a4596'],strap:'metal',metal:'#c9a030',gap:'#efe6cf'},
    ground:{kind:'paper',amount:.3}
  },
  rules:[
    'Start from one rosette at the centre of a square and let the pattern run out to the frame.',
    'Draw every strap in gold and edge it with a fine dark line.',
    'Fill with blue first; red, green and white are accents in the smallest cells.',
    'Surround the field with at least two borders, one of them a twisted strap.'
  ],
  maths:'The twelve-pointed rosette field grows from twelve-sided polygons set edge to edge on a triangular lattice with a contact angle of 75°: each line passes its first partner and turns at the second, which is what makes petals with two long sides instead of a plain star.',
  symbolism:'These pages open the book; their inscriptions (not drawn here) usually quote the verses on the Qurʾān’s own sanctity. Gold and blue were the costliest materials an illuminator had.'
});

isT({
  id:'mamluk-woodwork',name:'Mamluk joined woodwork',sub:'Star panels in walnut, ebony and ivory',native:'minbar · taʿshīq',
  region:'Cairo, Damascus, Jerusalem, Aleppo',medium:'Small carved panels of wood, bone and ivory held in a grooved frame of ribs without glue',period:'12th–15th centuries (Ayyubid and Mamluk)',
  summary:'The sides and doors of a minbar: hundreds of small polygonal panels — stars, kites, hexagons — each carved or inlaid, held between raised ribs that are the straps of the pattern. Dark and pale woods and ivory alternate by shape. The whole is built to move with the seasons without splitting.',
  axes:{density:1,weight:.35,uniformity:.9,geometry:1,symmetry:1,fill:.9,chroma:.3,ornament:.8,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['girih','iwan'],folds:12,density:.6,symmetry:'radial',borderBands:1,bare:.6},
    motifs:{hero:['rosette12','rosette10','rosette16'],ring:['khatam','rosette8'],filler:['khatam'],border:['strapPlait','guilloche','hexStarBand'],petal:'pointed',tile:['twelveRosette','tenAcute','hexWeave','sixteen','octRosette','twelveFour']},
    line:IS_LINE(1.2),
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:IS_ORN(.6,1,{relief:.5}),
    palette:{ground:'#7b5231',ink:'#2a1a10',fills:['#eee2c6','#2b1c14','#b88c56','#5e3b22'],ciFills:['#eee2c6','#5e3b22','#2b1c14','#b88c56','#eee2c6','#5e3b22'],strap:'#946638',gap:'#7b5231'},
    ground:{kind:'wood',amount:.4}
  },
  rules:[
    'Make the straps the frame: raised ribs with a groove each side.',
    'Fit a separate small panel in every cell, loose enough to move.',
    'Alternate ivory, ebony and pale wood by shape.',
    'Centre a twelve- or sixteen-pointed rosette on each door leaf.'
  ],
  maths:'Because every cell is a separate panel, the joiner needs the exact outline of each piece after the strap has taken its width. The app offsets each face inward by half the strap, with true mitres at the corners, and rejects any piece the offset would consume — the same test a joiner applies to a sliver too thin to cut.',
  symbolism:'A minbar is where the Friday sermon is given; its doors are a threshold. The star panels are the highest work a carpenter’s guild could offer the building.'
});

isT({
  id:'seljuk-stone',name:'Anatolian Seljuk stone carving',sub:'Strapwork cut in relief, one stone colour',native:'Selçuklu taş işçiliği',
  region:'Anatolia — Konya, Sivas, Kayseri, Divriği, Erzurum',medium:'Carved limestone and marble on portals and caravanserais',period:'12th–13th centuries',
  summary:'Portal frames carved in band after band of interlace: straps with a groove down the middle standing proud of a sunk ground, in sixes, eights and twelves. No colour — the pattern is light and shadow. Each band of the frame carries a different design.',
  axes:{density:.9,weight:.45,uniformity:.9,geometry:1,symmetry:1,fill:.1,chroma:.08,ornament:.6,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['girih','iwan'],folds:6,density:.5,symmetry:'radial',borderBands:2,bare:1},
    motifs:{hero:['khatam','rosette12','rosette8'],ring:['khatam'],filler:['khatam'],border:['strapPlait','guilloche','hexStarBand','khatamBand','girihBand'],petal:'pointed',tile:['hexWeave','twelveSixOpen','khatam','hexStar','twelveSix','girihBow']},
    line:IS_LINE(1.8),
    fill:{modes:{flat:1},coverage:0,hatchGap:6},
    ornament:IS_ORN(.8,1,{relief:.75}),
    palette:{ground:'#d9cdb4',ink:'#3d342a',fills:['#b7aa90','#8f8470'],gap:'#d9cdb4'},
    ground:{kind:'stone',amount:.55}
  },
  rules:[
    'Carve the strap proud and the ground deep; let shadow do the drawing.',
    'Keep the strap broad — nearly as wide as the gaps between.',
    'Give each band of the portal frame its own pattern.',
    'Use sixes and twelves on a triangular lattice; eights where a square panel asks for them.'
  ],
  maths:'Six-pointed stars ringed by hexagons grow from hexagons spaced apart by squares, with triangles left between (the tiling 3.4.6.4), at a contact angle of 60°. On the same triangular lattice, twelve-sided polygons bridged by squares give the twelve-and-six family.',
  symbolism:'The portal is the one decorated face of a plain building: a caravanserai’s or a madrasa’s statement to the road.'
});
