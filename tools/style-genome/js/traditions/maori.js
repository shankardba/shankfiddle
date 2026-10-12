'use strict';
/* Māori — eighth culture family. Two traditions are ANALYZED from eight
   reference images (stock "Māori tattoo" art in a line register and a solid one); five
   are CURATED from the art forms those images borrow from: painted rafters, wood carving,
   lattice panels, cloak borders and greenstone pendants.
   Koru geometry, rafter scrolls, band patterns, lattice rules and layouts live in
   js/core/koru.js.

   What is left out on purpose: tā moko. No face is marked, and the one reference that
   was a stylised facial moko was measured for line and mass only. */

defFamily({id:'maori',name:'Māori',native:'Toi Māori — Aotearoa New Zealand',
  blurb:'The art of the tangata whenua of Aotearoa: one curve, the unfurling fern frond, repeated, mirrored and interlocked. Painted on rafters in red, black and white; cut into wood as spirals and notched grooves; stitched into lattice panels and twined into cloak borders in strict geometry; ground from greenstone into pendants.'});

const MA_CARE='Tā moko is not ornament. A moko sets out its wearer\'s descent (whakapapa), tribe and standing; it is made for one person, and the head it is worn on is tapu. This app does not generate moko and draws no markings on a face. Māori artists use the word kirituhi — "drawn skin" — for designs in the Māori manner that make no such claim, and that is the most a generated image here can be compared to. Carved figures are ancestors, and named patterns belong to the houses and iwi that hold them: the hei-tiki, manaia and rafter scrolls drawn here are generic forms built from the shared grammar, not copies of any taonga or of any house. To wear or use a Māori design, commission a Māori artist.';
const MA_STOCK=' Most of the images behind this entry are stock art sold as "Māori tattoo". They mix Māori forms (koru, mangōpare, notched grooves) with Samoan, Marquesan and Hawaiian tattoo vocabulary — turtle-shell hexagons, spearhead rows, the swimming turtle — and two are machine-generated, one with a Celtic knot and Japanese waves in it. That mixture is a commercial "Polynesian" look, not Māori art; the five curated entries in this family are the sources.';
const MA_CONV=[
  ['Koru','The unfurling fern frond: a stem that swells, curls once and ends in a bulb. The unit of every curved Māori pattern.'],
  ['The scroll is the gap','On a rafter the koru is the unpainted ground showing white between fields of red and black. The eye can read either the scroll or the fields; a good pattern works both ways.'],
  ['Three colours','Black for Te Pō, the dark from which things come; red for Te Whei Ao, coming into being; white for Te Ao Mārama, the world of light. Red ochre is kōkōwai.'],
  ['Heart line','Manawa: the unbroken stem a rafter\'s koru grow from, running its whole length.'],
  ['Grooves and notches','Carved surfaces are covered with parallel grooves (haehae) separated by rows of notches (pākati); together, rauponga. They follow the form like a second skin.'],
  ['Full face and profile','A carved figure seen from the front is a tiki; seen from the side, with a beak and one eye, a manaia. The two often share a panel.'],
  ['Eyes','Rings of pāua (abalone) shell set into the wood: they catch the light in a dark house.'],
  ['Hands','Carved hands usually have three fingers and rest on the body. Explanations differ between regions and are not settled.'],
  ['The house as a body','A meeting house is an ancestor: ridge-pole the spine, rafters the ribs, bargeboards the outstretched arms. Carved posts along the walls are descendants; lattice panels stand between them.'],
  ['Lattice patterns','Tukutuku and tāniko use only straight lines, by the nature of stitch and weave: steps, diamonds, chevrons, triangles. Each has a name and a reading.']
];
const MA_GLOSS=[['Toi Māori','Māori art.'],['Whakairo','Carving, in wood, bone or stone; whakairo rākau is wood carving.'],['Kōwhaiwhai','Painted scroll patterns, chiefly on the rafters and ridge-pole of a meeting house.'],['Tukutuku','Lattice panels of reeds and slats bound with cross-stitches in flax, kiekie and pīngao.'],['Tāniko','Finger-twined weaving in coloured geometric bands, used for the borders of fine cloaks.'],['Tā moko','The Māori practice of marking the skin, and the mark itself, which carries the wearer\'s descent and standing.'],['Kirituhi','"Drawn skin": a design in the Māori manner made without the genealogical content of moko.'],['Pounamu','New Zealand greenstone (nephrite and bowenite), the most valued material; found only in the South Island, Te Wai Pounamu.'],['Taonga','A treasure: something handed down that carries the standing of those who held it.'],['Wharenui','Meeting house.'],['Poupou','The carved posts along the walls of a meeting house.'],['Heke','A rafter.'],['Whakapapa','Genealogy: the layering of descent that ties a person to ancestors and land.'],['Iwi','A tribe; a people.']];

defTradition({
  id:'kirituhi-line',family:'maori',provenance:'analyzed',
  name:'Kirituhi band design, line',sub:'Curved bands of small repeats, drawn in outline',native:'kirituhi',
  region:'Aotearoa New Zealand and the tattoo trade worldwide',medium:'Ink drawing for skin; vector flash',period:'1990s to the present',
  summary:'Two or three great curls sweep across the sheet, each built from long tapering bands laid side by side. Every band is closed by a firm contour and filled with one small repeat — a row of teeth, parallel grooves with notches between, scale crescents, chevrons — and the repeats shrink as the band narrows to its tail. Koru curl off the heads of the bands; thin whisker lines trail outside. All line, no fill.',
  axes:{density:.57,weight:.06,uniformity:.64,geometry:.1,symmetry:.55,fill:.3,chroma:.04,ornament:.6,abstraction:.85,narrative:.3},
  genes:{
    structure:{kinds:['puhoro'],folds:8,density:.35,symmetry:'free',borderBands:0},
    motifs:{hero:['mangopare','takarangi','koru','heiMatau','fernFrond'],ring:['koru','mangopare'],filler:['koru'],border:['nihoTaniwha','rauponga','unaunahi','aramoana','koruChain','chevron','hatchBand','rauponga'],petal:'pointed',tile:['kaokao','patikitiki']},
    line:{weight:2.7,contrast:.6,double:false,wobble:.03,taper:.35,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:.07,hatchGap:5},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#fbfaf6',ink:'#0e0e0e',fills:['#0e0e0e'],gap:'#fbfaf6'},
    ground:{kind:'paper',amount:.15}
  },
  rules:[
    'Lay out two or three large koru first: where they curl decides everything else.',
    'Build each stem from long bands side by side, widest near the head, running out to a point at the tail.',
    'Close every band with a firm contour, about twice the weight of what goes inside it.',
    'Fill each band with one repeat only, and let the repeat shrink with the band.',
    'Leave a clear channel between neighbouring bands; never let two patterns touch.'
  ],
  maths:'Each band is a straight strip bent along a spiral. The strip\'s length runs along the stem and its width is squeezed to the band\'s width at that point, so a row of equal triangles becomes a row that tapers — which is how the hand-drawn designs behave. The stems are equiangular (logarithmic) spirals: the curve keeps its shape as it grows, the same spiral as the fern frond.',
  symbolism:'In kirituhi the forms keep their general readings — koru for new life, mangōpare for tenacity, teeth for guardianship — without the personal record that makes a moko. A real design is composed for its wearer by the artist; a generated one says nothing about anyone.',
  care:MA_CARE+MA_STOCK,conventions:MA_CONV,glossary:MA_GLOSS,
  analysis:{
    source:'Three reference images, analysed locally and not stored: a mirrored shield-shaped design carrying the mark of a design studio with a Māori name; a stock vector sold as "Maori style tattoo design"; and a machine-generated sheet titled as a calf tattoo, with garbled lettering.',
    observations:[
      'The studio design is the most consistently Māori: split down the centre and mirrored, built from koru, mangōpare, grooves (haehae) and rows of notches (pākati).',
      'In all three, large forms are divided into curved bands, each with its own small repeat.',
      'Repeats seen: triangle rows with hatched faces, chevrons and spearheads, scale crescents, grooves with notches, plaits, hexagon shell plates.',
      'Band contours are about twice the weight of the infill; in the studio design a second fine line shadows each contour.',
      'Bands taper to points; koru curl off their heads; loose whisker strokes trail outside the main mass.',
      'The machine-generated sheet adds a Celtic knot band, Japanese-style wave crests, stipple shading and a canoe — none of them part of this grammar.'
    ],
    measured:{
      note:'Black line on white measures cleanly. The studio design was photographed on textured paper, which the Lab reads partly as fill; its fill value is too high for that reason.',
      findings:[
        'Marks cover 11–22% of the sheet; the designs occupy 32–48% of it.',
        'Line weight 0.4–1.1% of the image width, in two clear levels.',
        'Curves dominate: edges on the horizontal and vertical only 1.3–1.4 times chance.',
        'Mirror symmetry 0.38 for the free sweep, 0.61 for the split shield, 0.81 for the calf sheet.',
        'One ink, no colour (chroma 0–0.13).'
      ],
      axes:{density:.57,weight:.06,uniformity:.64,geometry:.1,symmetry:.55,fill:.3,chroma:.04,ornament:.6},
      samples:[
        {label:'Studio design, mirrored',strokeRel:.011,strokeCV:.33,coverage:.215,solidFrac:0,bilateral:.61,rotational:.4,folds:16,dots:2},
        {label:'Stock sweep, line',strokeRel:.0052,strokeCV:.29,coverage:.114,solidFrac:.02,bilateral:.38,rotational:.23,folds:16,dots:8},
        {label:'Generated calf sheet',strokeRel:.0038,strokeCV:.28,coverage:.127,solidFrac:.07,bilateral:.81,rotational:.59,folds:16,dots:63}
      ]
    }
  },
  reading:['Ngahuia Te Awekotuku with Linda Waimarie Nikora, Mau Moko: The World of Māori Tattoo (Penguin Viking, 2007)','Hirini Moko Mead, Te Toi Whakairo: The Art of Maori Carving (Reed, 1986)']
});

defTradition({
  id:'kirituhi-solid',family:'maori',provenance:'analyzed',
  name:'Kirituhi band design, solid',sub:'Black mass with the pattern left white',native:'kirituhi',
  region:'Aotearoa New Zealand and the tattoo trade worldwide',medium:'Solid black on skin or paper; cut vinyl; vector flash',period:'1990s to the present',
  summary:'The same bands and curls, reversed: each form is a solid black shape, and the drawing — teeth, scales, grooves, the channels between bands — is the white left showing through. Heavy, high-contrast, readable from across a room. The one drawing can be issued either way, as outline or as mass.',
  axes:{density:.52,weight:.2,uniformity:.38,geometry:.15,symmetry:.73,fill:.15,chroma:0,ornament:.52,abstraction:.85,narrative:.3},
  genes:{
    structure:{kinds:['puhoro','puhoro','panel'],folds:8,density:.3,symmetry:'free',borderBands:0,fillerGrow:.6},
    motifs:{hero:['heiTiki','seaTurtle','manaia','takarangi','mangopare','heiMatau'],ring:['koru','mangopare','takarangi'],filler:['koru'],border:['nihoTaniwha','rauponga','unaunahi','aramoana','zigzag','scallop','hatchBand'],petal:'pointed',tile:['nihoTile','kaokao']},
    line:{weight:3,contrast:.35,double:false,wobble:.03,taper:.3,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:.2,hatchGap:5,knockout:.82},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#fcfbf7',ink:'#0b0b0c',fills:['#0b0b0c'],gap:'#fcfbf7'},
    ground:{kind:'paper',amount:.1}
  },
  rules:[
    'Draw the design in line first, then decide form by form which become solid.',
    'In a solid form, everything that was a line becomes a white channel of even width.',
    'Keep the channels open: they are the drawing.',
    'Balance mass against open ground — roughly a quarter of the sheet black.',
    'Let a few bands stay in outline so the mass has somewhere to breathe.'
  ],
  maths:'Solid and line are the same geometry with the roles of ink and ground exchanged inside each form — the "knockout" gene. The reference sheet that shows one figure both ways makes the point: nothing moves, only what is painted.',
  symbolism:'Figure and ground trading places is old in Māori art — on a rafter the scroll is the unpainted part. The solid register borrows that habit for skin and for print.',
  care:MA_CARE+MA_STOCK+' One reference was a stylised face with moko; it was measured for line weight and mass only, and no face is generated.',
  conventions:MA_CONV,glossary:MA_GLOSS,
  analysis:{
    source:'Five reference images, analysed locally and not stored: a hei-tiki drawn twice, in outline and in solid black; a turtle and a curling arm-piece, both stock vectors sold as "Maori style"; a stylised face (not used as a subject); and a machine-generated roundel of a carved post among spears and waves.',
    observations:[
      'The hei-tiki sheet shows one drawing in two registers: every outline in the left figure is a white channel in the right.',
      'White channels keep an even width, a little narrower than the black forms between them.',
      'Infill is cut out of the black: scale rows, tooth rows, parallel grooves.',
      'The turtle is a Pacific-wide tattoo subject; its shell is filled with koru-like curls rather than plates.',
      'The tiki has the tilted head, ringed eyes and three-fingered hands of the pendant form.',
      'The generated roundel piles up weapons, masks and waves without the band discipline of the others.'
    ],
    measured:{
      note:'Black on white measures cleanly. The Lab\'s "filled" axis is low because white channels cut the black into pieces narrower than its solid-area test.',
      findings:[
        'Black covers 18–36% of the sheet.',
        'Weight is the heaviest in the family: up to 2.8% of the image width for the face, 1.1–1.3% for the tiki and turtle.',
        'Line is uneven (variation 0.37–0.53): masses and channels are measured together.',
        'Mirror symmetry 0.52–0.97 depending on subject; the tiki sheet 0.74.',
        'No colour at all.'
      ],
      axes:{density:.52,weight:.2,uniformity:.38,geometry:.15,symmetry:.73,fill:.15,chroma:0,ornament:.52},
      samples:[
        {label:'Hei-tiki, both registers',strokeRel:.0114,strokeCV:.26,coverage:.231,solidFrac:.15,bilateral:.74,rotational:.43,folds:16,dots:1},
        {label:'Turtle, solid',strokeRel:.0126,strokeCV:.39,coverage:.181,solidFrac:.01,bilateral:.52,rotational:.36,folds:16,dots:35},
        {label:'Arm-piece, solid',strokeRel:.0107,strokeCV:.53,coverage:.269,solidFrac:.18,bilateral:.53,rotational:.59,folds:16,dots:4},
        {label:'Generated roundel',strokeRel:.0087,strokeCV:.43,coverage:.357,solidFrac:.04,bilateral:.97,rotational:.66,folds:16,dots:53}
      ]
    }
  },
  reading:['Ngahuia Te Awekotuku with Linda Waimarie Nikora, Mau Moko: The World of Māori Tattoo (Penguin Viking, 2007)','Damian Skinner, The Carver and the Artist: Māori Art in the Twentieth Century (Auckland University Press, 2008)']
});

defTradition({
  id:'kowhaiwhai',family:'maori',provenance:'curated',
  name:'Kōwhaiwhai rafter painting',sub:'White scrolls between fields of red and black',native:'kōwhaiwhai',
  region:'Aotearoa New Zealand — meeting houses, canoe paddles and prows',medium:'Red ochre in shark oil, soot black and white clay on wood; later house paint',period:'Before European contact to the present',
  summary:'Long narrow boards painted from end to end with one repeating scroll. The koru and the stem it grows from are left white; red and black fill the fields on either side. Each rafter carries a single pattern — paired curls, a wave of beaks, a chain of pointed ovals — repeated by sliding, flipping or turning it, with no outline anywhere.',
  axes:{density:.9,weight:.3,uniformity:.5,geometry:.2,symmetry:.75,fill:1,chroma:.6,ornament:.5,abstraction:.9,narrative:.3},
  genes:{
    structure:{kinds:['frieze'],folds:8,density:.6,symmetry:'free',borderBands:0},
    motifs:{hero:['mangopare','koru','takarangi'],ring:['koru','mangopare'],filler:['koru'],border:['kwMangopare','kwNgutuKaka','kwPatiki','kwPuhoro'],petal:'round',tile:['poutama','patikitiki']},
    line:{weight:1.7,contrast:.3,double:false,wobble:.05,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#f2ecdd',ink:'#1a1311',fills:['#a8271c','#1a1311'],gap:'#f2ecdd',stone:'#a8271c',paua:'#f2ecdd'},
    ground:{kind:'wood',amount:.3}
  },
  rules:[
    'Run one unbroken stem — the heart line — the length of the board.',
    'Bud koru off it, each curling back toward the stem and ending in a bulb.',
    'Leave the stem and the koru unpainted; fill the field on one side red and on the other black.',
    'Repeat the unit by one operation only: slide it, mirror it, turn it half round, or slide-and-flip.',
    'Paint a dark eye inside each curl so the bulb stands clear.'
  ],
  maths:'A rafter pattern is a frieze: a design that repeats along one direction. There are exactly seven ways such a strip can be symmetric, and surveys of rafters have found all seven in use. Each strip here is one koru unit plus one operation — the paired-curl scroll mirrors and glides, the beak scroll is a pure glide, the pointed-oval and wave scrolls are half-turns. Swapping red for black under the same operation gives the two-colour versions.',
  symbolism:'Rafters are the ribs of the ancestor the house embodies, and the scroll along each is a line of descent growing from one stem. Named patterns carry readings — the hammerhead shark for tenacity, the flounder for hospitality, the kākā\'s beak, the running wave — and belong to the houses that use them.',
  care:MA_CARE+' The four scrolls generated here are built from the koru and the strip symmetries and named for the families of rafter patterns they resemble; they are not copies of the rafters of any house.',
  conventions:MA_CONV,glossary:MA_GLOSS,
  reading:['Roger Neich, Painted Histories: Early Maori Figurative Painting (Auckland University Press, 1993)','Augustus Hamilton, Maori Art (New Zealand Institute, 1896–1901)','Gordon Knight, "The geometry of Maori art — rafter patterns", New Zealand Mathematics Magazine 21(2), 1984']
});

defTradition({
  id:'whakairo',family:'maori',provenance:'curated',
  name:'Whakairo wood carving',sub:'Spirals, notched grooves and shell eyes in red-ochred wood',native:'whakairo rākau',
  region:'Aotearoa New Zealand — meeting houses, storehouses, canoes',medium:'Tōtara and kauri, cut with stone and later steel chisels, rubbed with red ochre; eyes of pāua shell',period:'From about 1500 to the present',
  summary:'Figures in deep relief, every surface worked: bodies covered in parallel grooves with rows of notches between them, double spirals at shoulder and hip, eyes of iridescent shell. Full-faced tiki with tilted heads and three-fingered hands stand one above another on the wall posts; beaked manaia in profile fill the spaces beside them. The whole is rubbed one deep red.',
  axes:{density:.9,weight:.35,uniformity:.5,geometry:.25,symmetry:.7,fill:.9,chroma:.3,ornament:.95,abstraction:.8,narrative:.8},
  genes:{
    structure:{kinds:['wharenui','wharenui','panel'],folds:8,density:.4,symmetry:'bilateral',borderBands:1,fillerGrow:.5},
    motifs:{hero:['heiTiki','manaia','heiTiki'],ring:['manaia','takarangi','mangopare','heiTiki'],filler:['koru','takarangi'],border:['rauponga','unaunahi','nihoTaniwha','kwMangopare','kwNgutuKaka'],petal:'pointed',tile:['poutama','patikitiki','kaokao','roimataToroa','purapuraWhetu']},
    line:{weight:2.4,contrast:.4,double:false,wobble:.05,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:.55,hatch:.45},coverage:1,hatchGap:4.4},
    ornament:{dotRows:0,echo:.35,echoCount:2,echoStyle:'solid',scallops:0,halo:0,gems:['#4fb3a6','#8ad6c8','#5d8fc6'],groundStitch:false,relief:.55},
    palette:{ground:'#6f2418',ink:'#260d09',fills:['#a2361f','#b0442b','#8f2f1c'],ciFills:['#a2361f','#1f0d0a','#efe6cf','#d9a233'],gap:'#6f2418',stone:'#a2361f',paua:'#5fc1b2',mouth:'#7a2616'},
    ground:{kind:'wood',amount:.6}
  },
  rules:[
    'Block the figure out in deep relief: big head, squat body, hands on the chest or thighs.',
    'Set a double spiral on each shoulder and hip.',
    'Cover every remaining surface with parallel grooves, and cut a row of notches between each pair.',
    'Inlay the eyes with rings of pāua shell.',
    'Rub the whole carving with red ochre.'
  ],
  maths:'The double spiral is two arms wound into each other half a turn apart, so a channel of constant width runs between them from the rim to the centre; the notches cross that channel at even steps. Grooves follow the figure as offset curves, each a fixed distance inside the last.',
  symbolism:'A carved post is an ancestor, present in the house; the spirals mark the joints where the body moves, and the open channel of the double spiral is read as light entering between sky and earth. Carving was the work of trained experts under tapu.',
  care:MA_CARE+' The lattice panels beside the posts use red, white, black and yellow stitches from the same palette.',
  conventions:MA_CONV,glossary:MA_GLOSS,
  reading:['Hirini Moko Mead, Te Toi Whakairo: The Art of Maori Carving (Reed, 1986)','Roger Neich, Carved Histories: Rotorua Ngati Tarawhai Woodcarving (Auckland University Press, 2001)']
});

defTradition({
  id:'tukutuku',family:'maori',provenance:'curated',
  name:'Tukutuku lattice panels',sub:'Cross-stitched patterns on a grid of reeds and slats',native:'tukutuku',
  region:'Aotearoa New Zealand — the walls of meeting houses, between the carved posts',medium:'Upright reed stalks and horizontal wooden slats, bound with strips of kiekie and flax and yellow pīngao',period:'Before European contact to the present',
  summary:'A wall panel built like a screen: dark horizontal slats over upright reeds, lashed together with thousands of small cross-stitches in white, yellow and black. Because every mark is one stitch on a grid, every pattern is made of steps: stairways, nested diamonds, chevrons, rows of teeth, a field of single stars.',
  axes:{density:.9,weight:.2,uniformity:.95,geometry:1,symmetry:.9,fill:.3,chroma:.4,ornament:.8,abstraction:1,narrative:.4},
  genes:{
    structure:{kinds:['wagara'],folds:8,density:.6,symmetry:'bilateral',borderBands:0,bare:1},
    motifs:{hero:['mangopare'],ring:['koru'],filler:['koru'],border:['aramoana','nihoTaniwha','tanikoBand','zigzag'],petal:'pointed',tile:['poutama','patikitiki','kaokao','nihoTile','purapuraWhetu','roimataToroa']},
    line:{weight:3.1,contrast:.2,double:false,wobble:.04,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#2a1712',ink:'#6a2a1c',fills:['#b53a26','#efe6cf','#efe6cf','#d9a233'],gap:'#2a1712'},
    ground:{kind:'cloth',amount:.35}
  },
  rules:[
    'Set upright reeds behind and horizontal slats in front, so the panel is a grid.',
    'Bind each crossing with one stitch — a cross, or a single upright bar.',
    'Build the pattern by counting: so many stitches along, then one row up.',
    'Use white for the figure, yellow to answer it, and let the dark slats be the ground.',
    'Keep each panel to one pattern; change pattern from panel to panel along the wall.'
  ],
  maths:'Every tukutuku pattern is a rule from a grid cell to a stitch: steps come from adding the row number to the column number before dividing, diamonds from adding the distances to a centre, chevrons from folding the column number back on itself. Curves are impossible, so the same handful of operations — slide, mirror, half-turn — do all the work.',
  symbolism:'Panels are made by a pair working from front and back, traditionally women\'s work beside the men\'s carving. Each pattern has a name and a teaching: the stairway of learning, the flounder of plenty, the tears of the albatross.',
  care:MA_CARE,conventions:MA_CONV,glossary:MA_GLOSS,
  reading:['Te Rangi Hīroa (Peter Buck), The Coming of the Maori (Maori Purposes Fund Board, 1949)','Gordon Knight, "The geometry of Maori art — weaving patterns", New Zealand Mathematics Magazine 21(3), 1984']
});

defTradition({
  id:'taniko',family:'maori',provenance:'curated',
  name:'Tāniko cloak borders',sub:'Twined bands of triangles and diamonds',native:'tāniko',
  region:'Aotearoa New Zealand — the borders of fine cloaks, belts and bands',medium:'Dressed flax fibre (muka), dyed black with bark and mud and red-brown with bark, finger-twined without a loom',period:'Before European contact to the present',
  summary:'A dense woven band a hand wide, worked in black, red-brown, white and sometimes yellow: triangles stacked point to base, diamonds within diamonds, zigzags running side by side. Edges are stepped by the weave and colours never blend. It runs along the hem of a cloak whose body is left plain.',
  axes:{density:.95,weight:.3,uniformity:.9,geometry:1,symmetry:.95,fill:1,chroma:.55,ornament:.6,abstraction:1,narrative:.2},
  genes:{
    structure:{kinds:['frieze','wagara'],folds:8,density:.6,symmetry:'bilateral',borderBands:0,bare:1},
    motifs:{hero:['mangopare'],ring:['koru'],filler:['koru'],border:['tanikoBand','zigzag','diamond','aramoana','stepDiamond'],petal:'pointed',tile:['aronui','aramoanaTile','patikitiki']},
    line:{weight:1.6,contrast:.2,double:false,wobble:.03,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#ece2c8',ink:'#1a1311',fills:['#1a1311','#8f2318','#d9a233','#1a1311'],gap:'#ece2c8'},
    ground:{kind:'cloth',amount:.5}
  },
  rules:[
    'Work in horizontal bands; give each band one figure, repeated.',
    'Build everything from triangles: point up, point down, two base to base for a diamond.',
    'Use black and red-brown against the pale fibre; add yellow sparingly.',
    'Let edges step with the weave; never round a corner.',
    'Mirror each band about its centre line.'
  ],
  symbolism:'Tāniko patterns are named — the teeth of the taniwha, the flounder, the sea path — and a fine border marks the standing of the cloak and its wearer.',
  care:MA_CARE,conventions:MA_CONV,glossary:MA_GLOSS,
  reading:['Sidney M. Mead, The Art of Taaniko Weaving (Reed, 1968)','Mick Pendergrast, Te Aho Tapu: The Sacred Thread (Reed Methuen, 1987)']
});

defTradition({
  id:'pounamu',family:'maori',provenance:'curated',
  name:'Pounamu pendants',sub:'Greenstone hooks, twists, koru and tiki',native:'pounamu',
  region:'Te Wai Pounamu (the South Island) — worn throughout Aotearoa',medium:'Nephrite and bowenite, sawn and ground with sandstone, drilled, polished',period:'From about 1500 to the present',
  summary:'Small forms ground from translucent green stone, each a single smooth shape with no applied ornament: the fish hook, the twist, the single koru, the adze blade, the hei-tiki with its tilted head. Edges are rounded by grinding; the only inner lines are a groove or two and the shell rings of a tiki\'s eyes.',
  axes:{density:.3,weight:.3,uniformity:.8,geometry:.15,symmetry:.6,fill:1,chroma:.5,ornament:.2,abstraction:.8,narrative:.4},
  genes:{
    structure:{kinds:['sheet'],folds:8,density:.25,symmetry:'free',borderBands:0},
    motifs:{hero:['heiTiki','heiMatau','pikorua','koru','toki','manaia','mangopare','takarangi','fernFrond'],ring:['heiMatau','koru','pikorua'],filler:['koru'],border:['koruChain','lines'],petal:'round',tile:['patikitiki']},
    line:{weight:2,contrast:.4,double:false,wobble:.03,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:['#8ad6c8','#5fc1b2'],groundStitch:false,relief:.4},
    palette:{ground:'#e9e4d6',ink:'#123024',fills:['#2f7d5b','#3f9a72','#27694b','#5aa686'],gap:'#e9e4d6',stone:'#2f8660',paua:'#8ad6c8',mouth:'#1f5c41'},
    ground:{kind:'stone',amount:.3}
  },
  rules:[
    'Find one closed, flowing outline; the stone allows no thin projections.',
    'Round every edge.',
    'Add at most one or two grooves inside the form.',
    'Leave the stone its own colour; let the polish do the rest.',
    'Drill or notch the top for the cord.'
  ],
  symbolism:'Pounamu is the most prized of all materials and a pendant gathers mana from each person who wears it; it is properly given, not bought for oneself. Hook for safe travel over water, twist for a bond between people, koru for new life, adze for authority.',
  care:MA_CARE,conventions:MA_CONV,glossary:MA_GLOSS,
  reading:['Russell Beck with Maika Mason, Mana Pounamu: New Zealand Jade (Reed, 2002)','Hirini Moko Mead, Te Toi Whakairo: The Art of Maori Carving (Reed, 1986)']
});
