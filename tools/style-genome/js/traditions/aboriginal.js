'use strict';
/* Aboriginal Australia — ninth culture family. Five traditions are ANALYZED from the eight reference images (three desert canvases and five paintings in the
   contemporary and commercial registers); one is CURATED (Arnhem Land bark painting).
   The dotting engine, the iconography and the animals live in js/core/dots.js.

   Two rules of this file. No artist is named and no artist's manner is offered as a
   preset: the genes describe technique shared across a region. And nothing here is a
   story: the generator arranges public signs at random. */

defFamily({id:'aboriginal-australia',name:'Aboriginal Australia',native:'more than 250 language groups, each with its own Country and its own art',
  blurb:'The oldest continuing art traditions on earth, and not one style but many. In the Central and Western Desert, maps of Country seen from above — sites, tracks, people — closed over with rows of dots. In Arnhem Land, animals painted with their insides showing and filled with fine cross-hatching. Here as studies of technique only.'});

const AB_CARE='Aboriginal art is not one style, and its designs are not free decoration. Dot painting on board and canvas began at Papunya in 1971 and belongs to Central and Western Desert communities; cross-hatching (rarrk) and x-ray figures belong to Arnhem Land; other regions have their own ways. A painting sets down part of a Dreaming — Jukurrpa in Warlpiri, Tjukurpa in Pitjantjatjara — that belongs to particular people and particular Country, and only those with the right may paint it. What this app generates is a study of technique: dotting, concentric sites, tracks, laid out at random. It tells no story, it is not Aboriginal art, and it should not be sold, labelled or shown as such. Restricted and owned imagery — Wandjina figures, clan designs, ceremonial objects, named ancestral beings — is left out. To own the real thing, buy from an Aboriginal-owned art centre or a dealer signed to the Indigenous Art Code.';
const AB_CONV=[
  ['Seen from above','Desert painting is a plan, not a view: the ground as it would be drawn in sand, with no horizon and no single right way up.'],
  ['Concentric circles','A place: camp, fire, waterhole, rock hole, or where an ancestor entered the ground. The commonest sign, and the one whose meaning most depends on the story.'],
  ['Lines between circles','The path travelled between two places. Straight for a journey, wavy for water, rain or a snake.'],
  ['U-shape','A person sitting, from the mark left in the sand. The things beside it say who: digging stick and dish for a woman, spears and boomerang for a man.'],
  ['Tracks','Footprints read as a hunter reads them: paired long marks for kangaroo, three-toed arrows for emu, a furrow with small prints for goanna.'],
  ['Layers of meaning','The same sign can be read at several levels. What is told to outsiders is the open level; deeper readings are kept for those entitled to them. The readings given in this app are the open, published ones.'],
  ['Dotting','Rows of dots close the ground around every form. In the early Papunya years dotting was also used to veil designs that should not be shown plainly.'],
  ['X-ray','In western Arnhem Land an animal is painted with backbone, gut and organs inside its outline: what the painter knows is there, not only what is seen.'],
  ['Rarrk','Fine parallel and crossed lines filling a figure in bands. In Arnhem Land the patterns are owned by clans; the shimmer they give is the visible sign of ancestral power.']
];
const AB_GLOSS=[['Country','The land a person belongs to and is responsible for — with its sites, stories, plants and animals. Paintings are of Country.'],['Jukurrpa / Tjukurpa','The Dreaming: the ancestral creation of the land and its law, still present in it. Warlpiri and Pitjantjatjara words; each language has its own.'],['Papunya Tula','The artists\' company founded in 1972 at Papunya, west of Alice Springs, where painting on board began in 1971. Aboriginal-owned.'],['Art centre','A community-owned studio and co-operative. Most desert and Arnhem Land painters work through one; it is the surest source of authentic work.'],['Ochre','Earth pigment: red and yellow iron oxides, with white pipeclay and charcoal black — the four colours used on body, ground, rock and bark before acrylics.'],['Rarrk','Kunwinjku word for the fine cross-hatched infill of western Arnhem Land painting.'],['Coolamon','A shallow wooden carrying dish.'],['Songline','A track across Country followed by an ancestral being, remembered in song; a painting may show one stretch of it.']];

defTradition({
  id:'desert-ochre',family:'aboriginal-australia',provenance:'analyzed',
  name:'Desert painting, ochre palette',sub:'Winding tracks and sites in four earth colours',native:'',
  region:'Western Desert — Papunya and the communities west of Alice Springs',medium:'Synthetic polymer paint on board or canvas, in the four ochre colours',period:'1971 to the present',
  summary:'The founding manner of desert painting on canvas: black bands winding across a red-brown field, each with a row of ochre dots down its spine and white dots along its edges, a set of concentric circles where a track begins, short bars in the ground between — and then the whole surface closed with large, even dots. Only four colours: black, white, red ochre, yellow ochre.',
  axes:{density:.87,weight:.16,uniformity:.17,geometry:.02,symmetry:.99,fill:1,chroma:.45,ornament:.65,abstraction:.95,narrative:.9},
  genes:{
    structure:{kinds:['sinuous','sinuous','country'],folds:8,density:.4,symmetry:'free',borderBands:0,fillerGrow:.5},
    motifs:{hero:['roundel'],ring:['barSet','barSet','uShape'],filler:['barSet','humanTrack','kangarooTrack','emuTrack'],border:['lines','dotRow'],petal:'round'},
    line:{weight:3.4,contrast:.2,double:false,wobble:.2,taper:0,breaks:0,dash:null,misreg:0,dotted:.92},
    fill:{modes:{flat:1},coverage:.85,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:['#ddd6cd','#ddd6cd','#eccb8c'],groundStitch:false,dotField:1,dotSize:9.2,dotPitch:1.36,dotBand:3,dotScheme:'mono'},
    palette:{ground:'#a25a36',ink:'#2a2422',fills:['#d9a85f','#ddd6cd','#2a2422','#8e4c33'],gap:'#a25a36',animal:'#2a2422'},
    ground:{kind:'canvas',amount:.5}
  },
  rules:[
    'Paint the forms first, in flat black: long winding bands, a set of concentric rings, short bars.',
    'Run one row of ochre dots down the middle of each band and a row of white dots along each edge.',
    'Close the ground with large dots of one colour, set in rows that follow the bands.',
    'Keep to four colours: black, white, red ochre, yellow ochre.',
    'Leave no single way up: the painting is a plan of ground, made flat and walked around.'
  ],
  maths:'Dotting the ground is a distance problem solved by hand. Each row of dots keeps one step further from the nearest painted form than the row before, so the rows are lines of equal distance — level sets of the distance field — and where rows spreading from two forms meet, they trace the line equally far from both. The generator computes the same thing exactly: nearest-form distance for every cell of a grid, then dots along each level.',
  symbolism:'A winding band may be a snake, a creek, or a line of travel, and usually more than one at once; rings are a named place on it. The four colours are the old body and ground-painting pigments. What a given canvas means belongs to its painter.',
  care:AB_CARE,conventions:AB_CONV,glossary:AB_GLOSS,
  analysis:{
    source:'One reference photograph, analysed locally and not stored: a desert canvas in the four ochre colours, from a gallery of Western Desert art. The painter is not named here and the painting is not reproduced; only the technique was measured.',
    observations:[
      'Three black bands wind across the full width; none stops at the edge.',
      'Each band carries a single row of ochre dots down its centre and a row of white dots just outside each edge.',
      'One band begins in a set of concentric rings, with dotted arcs wrapped behind it.',
      'Four sets of three short bars lie in the ground between the bands, each bar edged in white dots.',
      'The ground is two reds — lighter at the top and bottom margins, darker between the bands — closed with large ochre dots.',
      'The field dots sit in loose rows that follow the bands, with no outlines and no blank ground.'
    ],
    measured:{
      note:'The Lab separates ink from ground by brightness, which a dotted canvas defeats: it reads the dots as ornament and the dark bands as ink. The axes are the Lab\'s numbers as measured, so a similar photograph matches this tradition. Dot size and spacing were measured separately, from connected blobs of each pigment.',
      findings:[
        'Field dots: 0.94% of the canvas width across, set 1.33 diameters apart centre to centre — nearly touching.',
        'Edge and spine dots are smaller: 0.3–0.36% of the width.',
        'Four pigments: black #2a2422, white #d8d2cc, yellow ochre #ba7d3c to #d19d5f, red ochre #964933 to #9b5434.',
        'Dots cover 6% of the surface by area in the field colour alone; marks of all kinds cover 44%.',
        'Edges show no preferred direction (1.32 against 1.0 for chance, 1.35 for free curves).'
      ],
      axes:{density:.87,weight:.16,uniformity:.17,geometry:.02,symmetry:.99,fill:1,chroma:.45,ornament:.65},
      samples:[{label:'Ochre canvas',strokeRel:.0127,strokeCV:.53,coverage:.436,solidFrac:.03,bilateral:.84,rotational:.7,folds:16,dots:35}]
    }
  },
  reading:['Geoffrey Bardon and James Bardon, Papunya: A Place Made After the Story (Miegunyah Press, 2004)','Vivien Johnson, Lives of the Papunya Tula Artists (IAD Press, 2008)']
});

defTradition({
  id:'desert-sites-tracks',family:'aboriginal-australia',provenance:'analyzed',
  name:'Desert painting, sites and tracks',sub:'Roundels joined by travelling lines, every gap dotted',native:'',
  region:'Central Desert — Warlpiri and neighbouring communities north-west of Alice Springs',medium:'Acrylic on canvas over a dark ground',period:'1980s to the present',
  summary:'A map in red, orange, yellow and white on black: large concentric sites joined by broad bands of parallel dotted lines, smaller rings strung along the paths, U-shapes of seated people inside and around them, and every remaining patch of ground filled with its own colour of close-set dots. Nothing is outlined; the dots are the drawing.',
  axes:{density:.94,weight:.04,uniformity:.65,geometry:.04,symmetry:.79,fill:1,chroma:.43,ornament:1,abstraction:.95,narrative:.9},
  genes:{
    structure:{kinds:['country'],folds:8,density:.7,symmetry:'free',borderBands:0,fillerGrow:.3},
    motifs:{hero:['roundel','roundel','campSite'],ring:['uShape','uShape','campSite'],filler:['roundel','roundel','uShape','coolamon','waterLines','emuTrack'],border:['lines','dotRow'],petal:'round'},
    line:{weight:3.3,contrast:.15,double:false,wobble:.18,taper:0,breaks:0,dash:null,misreg:0,dotted:.94},
    fill:{modes:{flat:1},coverage:.8,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:['#e6e4e8','#db632c','#e2a53a','#b3402f'],groundStitch:false,dotField:1,dotSize:6.2,dotPitch:1.36,dotBand:3,dotScheme:'bands'},
    palette:{ground:'#211a1d',ink:'#6a2a26',fills:['#b3402f','#db632c','#e2a53a','#e6e4e8','#7a2622'],gap:'#211a1d',animal:'#150f11'},
    ground:{kind:'canvas',amount:.4}
  },
  rules:[
    'Start on a black ground. Set down the sites as concentric rings and join them with bands of parallel lines.',
    'Seat people — U-shapes — at the sites, and lay tracks and tools in the open ground.',
    'Dot every line: the ring, the path and the edge are rows of dots, not strokes.',
    'Fill each remaining patch with close rows in one colour, changing colour from patch to patch.',
    'Let rows follow the nearest form until they meet the rows coming from the next.'
  ],
  maths:'Sites are joined by the shortest set of lines that connects them all — a minimum spanning tree — with a few lines running off the edge, because Country does not stop at the canvas. The dot rows are level sets of the distance to the nearest drawn form; colour changes every few rows and starts at a different colour around each form, which is what makes neighbouring fields read as separate patches.',
  symbolism:'A painting of this kind sets down a stretch of a Dreaming track: the places an ancestor stopped, and the way between them. The reading belongs to those who hold that Dreaming.',
  care:AB_CARE,conventions:AB_CONV,glossary:AB_GLOSS,
  analysis:{
    source:'One reference photograph, analysed locally and not stored: a Central Desert canvas in reds, oranges and white on black, from a gallery of desert art. The painter is not named here and the painting is not reproduced.',
    observations:[
      'Two large sites, each a white-dotted ring three to five rows deep around rings of red and white dots and a black centre.',
      'Bands of five to eight parallel dotted rows run between the sites and off every edge.',
      'Smaller rings sit along the bands in rows of three, like beads on a string.',
      'U-shapes appear inside two of the rings, drawn as raised ridges of paint.',
      'No outline is drawn anywhere: forms are dark gaps and rows of dots.',
      'Ground patches alternate between even rows and loose curled clusters of dots.'
    ],
    measured:{
      note:'Dot size and spacing come from connected blobs of each pigment, not from the Lab\'s ink mask, which cannot tell dots from ground on a canvas like this.',
      findings:[
        'White dots: 0.6% of the canvas width across, 1.32 diameters apart. Orange: 0.49%, 1.75 apart. Red: 0.4%, 2.1 apart.',
        'The eye reads black as the ground: it is 31% of the surface.',
        'Pigments: black #21191e, dark red #542324, red #ac4030, orange #ce692d, white #dfe1e9.',
        'More than 2,200 separate dots counted in a 640-pixel copy.',
        'Mirror symmetry 0.73: balanced, not mirrored.'
      ],
      axes:{density:.94,weight:.04,uniformity:.65,geometry:.04,symmetry:.79,fill:1,chroma:.43,ornament:1},
      samples:[{label:'Sites and tracks canvas',strokeRel:.0055,strokeCV:.3,coverage:.272,solidFrac:0,bilateral:.73,rotational:.34,folds:16,dots:2243}]
    }
  },
  reading:['Peter Sutton (ed.), Dreamings: The Art of Aboriginal Australia (Viking, 1988)','Howard Morphy, Aboriginal Art (Phaidon, 1998)']
});

defTradition({
  id:'desert-colour-fields',family:'aboriginal-australia',provenance:'analyzed',
  name:'Desert painting, bush foods and colour fields',sub:'Branching plants and seed sites on drifting patches of dotted colour',native:'',
  region:'Central Desert communities north and north-east of Alice Springs',medium:'Acrylic on canvas',period:'1980s to the present',
  summary:'Branching stems with a round fruit at every tip, and oval sites ringed again and again, laid in firm red-brown line over a ground of soft patches — salmon, cream, grey-white, yellow — each patch stippled with fine dots a shade lighter or darker. Painting of plant foods and the places they grow.',
  axes:{density:1,weight:.01,uniformity:1,geometry:.04,symmetry:1,fill:.89,chroma:.48,ornament:1,abstraction:.85,narrative:.8},
  genes:{
    structure:{kinds:['country'],folds:8,density:.6,symmetry:'free',borderBands:0,tracks:0},
    motifs:{hero:['roundel'],ring:['bushPlant'],filler:['bushPlant','bushPlant','roundel','coolamon'],border:['lines','dotRow'],petal:'round'},
    line:{weight:4.4,contrast:.25,double:false,wobble:.3,taper:0,breaks:0,dash:null,misreg:0,dotted:.3},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:.9,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:['#f3eddd','#f3eddd','#e4d679'],groundStitch:false,dotField:1,dotSize:4.4,dotPitch:1.8,dotBand:2,dotScheme:'patches',dotWash:.85},
    palette:{ground:'#b98a72',ink:'#7b3a26',fills:['#f3eddd','#e4d679','#e9b9a2','#dccfbc','#a04a34','#f3eddd'],gap:'#b98a72',animal:'#7b3a26'},
    ground:{kind:'canvas',amount:.45}
  },
  rules:[
    'Draw the plants in a firm red-brown line: a curved stem, side branches, a round fruit at each tip.',
    'Ring the sites two or three times, pressing the rings into ovals where they crowd.',
    'Edge every stem and ring with a row of fine white dots.',
    'Fill the ground in drifting patches of colour, each stippled all over with fine dots of a lighter tone.',
    'Keep the palette soft and earthen; let the red-brown line do the drawing.'
  ],
  symbolism:'Paintings of bush foods hold practical knowledge — which plant, where it grows, when it fruits — inside the Dreaming that the plant belongs to. The shifting ground is Country in season.',
  care:AB_CARE,conventions:AB_CONV,glossary:AB_GLOSS,
  analysis:{
    source:'One reference photograph, analysed locally and not stored: a desert canvas of branching plants and ringed ovals over patches of soft colour. Its painter and community were not stated and have not been identified.',
    observations:[
      'Four branching plants, each a curved main stem with six to nine side branches ending in a white disc ringed in salmon.',
      'About twenty ringed ovals, most with two or three rings of fine dots around a flat centre.',
      'Stems and rings are a firm red-brown line of even width, edged with a single row of tiny white dots.',
      'The ground is a dozen irregular patches — salmon, brick, cream, grey-white, yellow — with soft boundaries.',
      'Field dots are very fine and loosely set, in short wandering chains rather than rows.'
    ],
    measured:{
      note:'Dot size and spacing come from connected blobs of each pigment. The Lab\'s own axes read the whole surface as ornament.',
      findings:[
        'Field dots are the finest in the set: 0.25% of the canvas width across, 1.9 diameters apart.',
        'More than 3,400 white dots in a 1,400-pixel copy; they cover 6% of the surface.',
        'Pigments: red-brown line #7b402b, white #f3eddd, salmon #b1583e, cream #c4aa96, yellow #eddf75, grey #97928b.',
        'Occupied area 100%: no bare ground at all.'
      ],
      axes:{density:1,weight:.01,uniformity:1,geometry:.04,symmetry:1,fill:.89,chroma:.48,ornament:1},
      samples:[{label:'Bush-food canvas',strokeRel:.0035,strokeCV:.06,coverage:.473,solidFrac:.2,bilateral:.97,rotational:.76,folds:16,dots:1517}]
    }
  },
  reading:['Jennifer Isaacs, Bush Food: Aboriginal Food and Herbal Medicine (Weldons, 1987)','Wally Caruana, Aboriginal Art (Thames & Hudson, 1993; third edition 2012)']
});

defTradition({
  id:'dot-halo-animal',family:'aboriginal-australia',provenance:'analyzed',
  name:'Animal on a dotted ground',sub:'One animal, haloed in rings of dots — the commercial and urban register',native:'',
  region:'Australia-wide: urban and regional painters, print and souvenir trade',medium:'Acrylic on canvas or board; printed cloth; kits',period:'1980s to the present',
  summary:'A single animal — kangaroo, goanna, turtle — as a dark silhouette with bright flat bands inside it, outlined in white, set on a ground of concentric dotted rings that echo its outline outward in bands of red, orange and white until they meet the rings spreading from roundels in the corners. The best-known image of "Aboriginal art" abroad, and the register most often imitated.',
  axes:{density:.95,weight:.13,uniformity:.52,geometry:.1,symmetry:.87,fill:1,chroma:.51,ornament:1,abstraction:.6,narrative:.5},
  genes:{
    structure:{kinds:['panel'],folds:8,density:.3,symmetry:'free',borderBands:0,fillerGrow:1.7},
    motifs:{hero:['kangaroo','goanna','seaTurtle','emu'],ring:['roundel'],filler:['roundel','roundel','roundel','campSite'],border:['lines','dotRow'],petal:'round'},
    line:{weight:3,contrast:.3,double:false,wobble:.12,taper:0,breaks:0,dash:null,misreg:0,dotted:.5},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:['#f7f0ee','#f3941b','#cd2a22','#ecc77a'],groundStitch:false,dotField:1,dotSize:8.2,dotPitch:1.46,dotBand:3,dotScheme:'bands'},
    palette:{ground:'#33141a',ink:'#f7f0ee',fills:['#cd2a22','#f3941b','#f7f0ee','#ecc77a','#8a1f2c'],gap:'#33141a',animal:'#170c0e',eyeWhite:'#f7f0ee'},
    ground:{kind:'canvas',amount:.35}
  },
  rules:[
    'Paint the animal as a flat dark silhouette, then lay two or three bright bands inside it and outline it in white.',
    'Put a roundel in each open corner.',
    'Echo the outline outward in rows of dots, three rows to a colour, until the rows from each form meet.',
    'Use a hot palette — red, orange, yellow, white on black or maroon — or a single cool one.',
    'Keep dots large and even: about one hundredth of the picture wide.'
  ],
  maths:'The halo is the purest case of the distance field: every row is the outline of the animal pushed one step further out. Corners round off as the rows travel, and where two sets of rows collide they meet along the line equally far from both forms.',
  symbolism:'In the hands of Aboriginal painters this register carries totems and Country like any other. As a commercial look it is often produced without either — which is why provenance matters more here than anywhere.',
  care:AB_CARE+' Of the five references behind this entry, at least two are trade products (a painting kit and a printed cloth panel), and the makers of the others could not be confirmed. Treat this register as what the market calls "Aboriginal style", not as a tradition with a community behind it.',
  conventions:AB_CONV,glossary:AB_GLOSS,
  analysis:{
    source:'Four reference images, analysed locally and not stored: a kangaroo on rings of red and orange dots (sold as a painting kit); a goanna on a maroon ground with dotted contour lines; a kangaroo with tracks on a blue printed cloth panel; and a pictorial sunrise with kangaroos. Makers were not stated for most and have not been identified.',
    observations:[
      'One animal fills the picture, as a black silhouette crossed by two or three flat bands of colour and edged with a white line.',
      'Rows of dots follow the outline outward, changing colour every two to four rows.',
      'Roundels sit in the corners, each spreading its own rings, so the ground becomes a set of colliding ripples.',
      'Dots are larger and more even than on the desert canvases, and are set on a dark ground that shows between them.',
      'The cloth panel replaces the hot palette with blues and adds paired kangaroo tracks and wavy lines.',
      'The pictorial example keeps a horizon and a sun — a landscape view the desert canvases never use.'
    ],
    measured:{
      note:'Dot size and spacing come from connected blobs of each pigment.',
      findings:[
        'Dots 0.45–0.96% of the picture width on the two paintings, 1.5 diameters apart; the printed cloth is coarser at 1.8%.',
        'Black or maroon ground 28–31% of the surface.',
        'Kit painting: black #1f0f13, red #b20c10, orange #f3941b, white #f7f0ee. Goanna: maroon #65303c, black #12101a, cream #e5cca5, grey #a59d99. Cloth: blue #1085d8, navy #143f8f, red-brown #c74524, yellow #f8b90d.',
        'Mirror symmetry 0.74–0.84: one centred subject, not a mirrored design.'
      ],
      axes:{density:.95,weight:.13,uniformity:.52,geometry:.1,symmetry:.87,fill:1,chroma:.51,ornament:1},
      samples:[
        {label:'Kangaroo, hot palette',strokeRel:.0095,strokeCV:.42,coverage:.275,solidFrac:.11,bilateral:.74,rotational:.34,folds:16,dots:943},
        {label:'Goanna, maroon',strokeRel:.0079,strokeCV:.23,coverage:.243,solidFrac:0,bilateral:.75,rotational:.33,folds:2,dots:1845},
        {label:'Kangaroo, blue cloth',strokeRel:.0156,strokeCV:.44,coverage:.505,solidFrac:.22,bilateral:.84,rotational:.52,folds:16,dots:193},
        {label:'Pictorial sunrise',strokeRel:.0045,strokeCV:.48,coverage:.229,solidFrac:.13,bilateral:.69,rotational:.33,folds:16,dots:1314}
      ]
    }
  },
  reading:['Terri Janke, Our Culture: Our Future — Report on Australian Indigenous Cultural and Intellectual Property Rights (AIATSIS, 1998)','Vivien Johnson, Copyrites: Aboriginal Art in the Age of Reproductive Technologies (NIAAA and Macquarie University, 1996)']
});

defTradition({
  id:'saltwater-contemporary',family:'aboriginal-australia',provenance:'analyzed',
  name:'Contemporary saltwater painting',sub:'Sea creatures and dot rosettes on blue',native:'',
  region:'Northern and eastern coasts',medium:'Acrylic and ink on canvas or paper',period:'2000s to the present',
  summary:'A reef scene in blues and teals: a turtle with a plated shell, fish, a sea snake, weed and small shoals, drawn in fine white line with net and scale patterns inside each body, and around them big rosettes built from rings of pale dots that grow from a pinpoint to a pearl. Dots here make ornaments, not a ground.',
  axes:{density:.99,weight:0,uniformity:.41,geometry:.07,symmetry:1,fill:.55,chroma:.44,ornament:1,abstraction:.5,narrative:.5},
  genes:{
    structure:{kinds:['panel'],folds:8,density:.4,symmetry:'free',borderBands:0,fillerGrow:.8},
    motifs:{hero:['seaTurtle','barramundi','seaTurtle'],ring:['roundel','fish','carpetSnake'],filler:['roundel','fish','leaf','waterLines','fish','burst'],border:['wave','lines'],petal:'round'},
    line:{weight:2,contrast:.45,double:false,wobble:.12,taper:.1,breaks:0,dash:null,misreg:0,dotted:.55},
    fill:{modes:{flat:.8,none:.2},coverage:.9,hatchGap:5},
    ornament:{dotRows:.5,echo:.3,echoCount:2,echoStyle:'solid',scallops:0,halo:0,gems:['#eef5f3','#bfe3e0','#f0c9d5','#9fd0d8'],groundStitch:false,dotField:.36,dotSize:7.4,dotPitch:1.5,dotBand:2,dotScheme:'bands'},
    palette:{ground:'#1c5d86',ink:'#eaf3f2',fills:['#d9a26a','#c1dadb','#a52a32','#93c048','#e2a53a','#133652','#b9a7d6'],gap:'#1c5d86',animal:'#3d8fae',eyeWhite:'#eef5f3'},
    ground:{kind:'paper',amount:.35}
  },
  rules:[
    'Wash the ground in deep blue, darker toward one corner.',
    'Draw each creature in a fine pale line and fill its body with a pattern of its own: plates, net, scales, bands.',
    'Build rosettes from rings of dots, each ring a little larger than the one inside it.',
    'Scatter weed and small fish through the gaps, all swimming one way.',
    'Keep dots to the rosettes and the outlines; let the blue ground stay open.'
  ],
  symbolism:'For saltwater peoples the sea is Country as much as the land: turtle, dugong and reef fish are food, totem and kin. Contemporary coastal painters combine that with techniques from across the continent.',
  care:AB_CARE,conventions:AB_CONV,glossary:AB_GLOSS,
  analysis:{
    source:'One reference image, analysed locally and not stored: an underwater scene with a turtle, fish, seahorse, sea snake and jellyfish among large dot rosettes. Its maker was not stated and has not been identified.',
    observations:[
      'A turtle at the centre with a shell of five middle plates, an orange hatched rim and net-patterned flippers.',
      'Three rosettes of concentric dot rings, the dots growing from the centre outward.',
      'Fine white line throughout: fish scales, jellyfish trails, hatched rock.',
      'Small fish in red, green and teal all point the same way.',
      'The blue ground is left open between forms — the only reference where it is.'
    ],
    measured:{
      note:'Dot size and spacing come from connected blobs of each pigment.',
      findings:[
        'Dots vary more than anywhere else in the set: 0.36–1.65% of the width (10th to 90th percentile).',
        'Blue covers 52% of the surface: #1e6f95, with dark #133652 and pale #c1dadb.',
        'Accents under 2% each: red #93212a, green #93c048.',
        'Line is the finest measured: 0.3% of the width.'
      ],
      axes:{density:.99,weight:0,uniformity:.41,geometry:.07,symmetry:1,fill:.55,chroma:.44,ornament:1},
      samples:[{label:'Reef scene',strokeRel:.0029,strokeCV:.41,coverage:.489,solidFrac:.25,bilateral:.96,rotational:.63,folds:16,dots:344}]
    }
  },
  reading:['Nonie Sharp, Saltwater People: The Waves of Memory (Allen & Unwin, 2002)']
});

defTradition({
  id:'arnhem-bark',family:'aboriginal-australia',provenance:'curated',
  name:'Arnhem Land bark painting',sub:'X-ray animals filled with rarrk',native:'rarrk (Kunwinjku, "cross-hatching")',
  region:'Western Arnhem Land, Northern Territory',medium:'Red and yellow ochre, white pipeclay and charcoal on flattened stringybark',period:'On rock for thousands of years; collected on bark since the 1910s',
  summary:'One or two animals — barramundi, kangaroo, long-necked turtle — on a plain red-ochre ground. Each is laid in as a white silhouette, divided into bands, and filled with fine parallel lines in red, yellow and black that change direction from band to band; the backbone, gut and other organs are drawn inside the body. No dots, no background pattern.',
  axes:{density:.35,weight:.2,uniformity:.5,geometry:.25,symmetry:.3,fill:.8,chroma:.3,ornament:.8,abstraction:.6,narrative:.85},
  genes:{
    structure:{kinds:['panel'],folds:8,density:.06,symmetry:'free',borderBands:0,bare:1,heroScale:.32},
    motifs:{hero:['barramundi','kangaroo','seaTurtle','emu','goanna'],ring:['barramundi','carpetSnake'],filler:['dot'],border:['lines','hatchBand'],petal:'pointed'},
    line:{weight:2.3,contrast:.5,double:false,wobble:.22,taper:0,breaks:0,dash:null,misreg:0,dotted:0},
    fill:{modes:{rarrk:1},coverage:1,hatchGap:5.4},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false,dotField:0},
    palette:{ground:'#7d3320',ink:'#efe6d2',fills:['#efe6d2','#d39a33','#1f1612','#bb4a2b'],gap:'#7d3320',eyeWhite:'#efe6d2'},
    ground:{kind:'wood',amount:.6}
  },
  rules:[
    'Rub the bark with red ochre and leave it plain.',
    'Lay the animal in as a flat white shape, large, usually alone.',
    'Divide the body with lines into bands and compartments; draw the backbone, gut and organs inside it.',
    'Fill each compartment with fine parallel lines — a few hairs of sedge make the brush — changing colour and direction from one to the next.',
    'Outline last, in white or black. Add nothing to the ground.'
  ],
  maths:'Rarrk is hatching with a rule: lines within a band are parallel and evenly spaced, neighbouring bands turn the lines the other way, and two colours laid across each other make a third by mixing in the eye. The generator uses a repeating tile of two mirrored bands, turned to run along each compartment.',
  symbolism:'An x-ray figure shows the animal as it is known — as food and as kin — not only as it looks. The shimmer of fine hatching is prized in itself: in Arnhem Land brilliance is the sign of ancestral power in a painted surface.',
  care:AB_CARE+' Rarrk patterns on real barks are clan property and identify the painter\'s group. The hatching here is a generic tile that reproduces no clan\'s design. Spirit figures and ancestral beings — Mimi, the Rainbow Serpent, Wandjina — are not generated.',
  conventions:AB_CONV,glossary:AB_GLOSS,
  reading:['Luke Taylor, Seeing the Inside: Bark Painting in Western Arnhem Land (Clarendon Press, 1996)','Howard Morphy, Ancestral Connections: Art and an Aboriginal System of Knowledge (University of Chicago Press, 1991)']
});
