'use strict';
/* Norse and Viking — fifteenth culture family. All four traditions are CURATED: no
   reference images were supplied, so nothing here is measured. Ribbon animals, runes
   and layouts live in js/core/norse.js. Palettes were set by eye from published
   photographs and reconstructions.

   The rune band carries the rune row itself (the futhark), not a composed text. No
   symbol is included for its modern political use. */

defFamily({id:'norse',name:'Norse and Viking',native:'Norðrlǫnd',
  blurb:'The animal ornament of Scandinavia between about 800 and 1150. Its subject is always a creature and its method is always the band: bodies drawn as ribbons that swell and thin, loop through one another and bite. Rings linked into chains on gilt mounts; a great beast and its snakes on the door of a wooden church; a serpent carrying an inscription round the edge of a standing stone; and on the island of Gotland, tall slabs carved with ships.'});

const NS_CARE='The Viking Age left almost no explanation of its own art: what the great beast or the gripping animals meant is inferred, not recorded. Runestones are memorials — most say who raised the stone and for whom, and most eleventh-century ones are Christian — and thousands still stand where they were set; they are protected monuments. The band here carries only the rune row, not an invented text. Runes are an alphabet, used across the Germanic world for ordinary writing. Since the twentieth century some runes and Norse emblems have been taken up by Nazi and white-supremacist movements; that use is modern, has nothing to do with the people who carved the stones, and no emblem is included here on its account. The carved stones and metalwork were painted and gilded: grey stone and bare wood are what time has left.';
const NS_CONV=[
  ['The animal is a band','A body is drawn as a ribbon between two contour lines. It swells at the hip and shoulder and thins at the waist, neck and tail.'],
  ['Over and under','Where bands cross, one passes over and the other under, and the order alternates along every band.'],
  ['Spiral joints','The hip and shoulder are marked with a spiral: the one place where the ribbon admits it is a limb.'],
  ['Heads and feet','A head is small and seen in profile, with a pointed oval eye and a lip that curls; a foot is two or three toes.'],
  ['Styles in sequence','Scholars name the styles for find-places: Oseberg, Borre, Jelling, Mammen, Ringerike, Urnes. Each overlaps the next; together they run from about 800 to 1150.'],
  ['Urnes line','The last style: few animals, wide open loops, a strong contrast between one broad band and several hair-thin ones.'],
  ['Rune serpent','On a Swedish stone the inscription is cut inside the body of a snake that follows the stone’s edge; its head and tail cross and are tied at the foot.'],
  ['Colour','Traces show stones painted red, black and white, with the runes picked out; wood carving was painted too.']
];
const NS_GLOSS=[['Urnes style','The last Viking style, named for the stave church at Urnes, Norway.'],['Borre style','A ninth- and tenth-century style of ring-chains and gripping beasts, named for a mound cemetery in Norway.'],['Ringerike style','An eleventh-century style of a great beast among lobed tendrils.'],['Futhark','The rune row, named for its first six letters. The Viking Age form has sixteen runes.'],['Runestone','A raised stone with a runic inscription, usually a memorial.'],['Ormslinga','Swedish: the snake coil that carries a runestone’s text.'],['Picture stone','Bildsten: the carved limestone slabs of Gotland, fifth to twelfth centuries.'],['Stave church','A medieval Scandinavian timber church built on upright posts.'],['Gripping beast','A small animal whose paws clutch its own body, its neighbours or the frame.'],['Ring-chain','A row of interlinked rings, the signature band of the Borre style.']];

const nsT=o=>defTradition(Object.assign({family:'norse',provenance:'curated',care:NS_CARE,conventions:NS_CONV,glossary:NS_GLOSS},o));
const NS_ORN=x=>Object.assign({dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},x);
const NS_LINE=(weight,x)=>Object.assign({weight,contrast:.45,double:false,wobble:.015,taper:0,breaks:0,dash:null,misreg:0},x);

nsT({
  id:'urnes-carving',name:'Urnes wood carving',sub:'One great beast and its snakes, in open loops',native:'Urnesstil',
  region:'Norway, Sweden, Denmark, and Norse Ireland and Britain',medium:'Deep relief in pine and oak on church portals and furniture; the same designs in bronze brooches',period:'About 1050–1125',
  summary:'A tall panel of dark wood filled by a single slender animal. Its body is a band that thickens at the haunch and shoulder and thins to a thread at the tail; its neck sweeps up and over in a wide curve and comes back down to bite. Through its loops run two or three snakes no thicker than a cord, each tied in a figure-eight. Nothing is symmetrical and nothing is crowded.',
  axes:{density:.55,weight:.5,uniformity:.15,geometry:.05,symmetry:.15,fill:.7,chroma:.1,ornament:.5,abstraction:.8,narrative:.4},
  genes:{
    structure:{kinds:['panel'],folds:2,density:.15,symmetry:'free',borderBands:1,bare:.9,heroScale:.4},
    motifs:{hero:['urnesBeast'],ring:['urnesSnake'],filler:['urnesSnake'],border:['snakeBand','ringChain','plait'],petal:'pointed'},
    line:NS_LINE(1.3),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:NS_ORN({relief:.55}),
    palette:{ground:'#6d4a2c',ink:'#2a1a0f',fills:['#a8783f','#8c5f30'],ciFills:['#a8783f','#8c5f30','#2a1a0f','#6d4a2c'],gap:'#6d4a2c'},
    ground:{kind:'wood',amount:.6}
  },
  rules:[
    'Begin with the great beast: one long S for body and neck, the head returning toward the body.',
    'Swell the band at haunch and shoulder; let it run out to a hair at the tail.',
    'Hang a thin leg from each swelling and mark the joint with a spiral.',
    'Thread two or three snakes through the loops in figure-eights.',
    'Alternate over and under without exception, and leave the ground open between the loops.'
  ],
  maths:'Each animal is a curve with a width that changes along its length. Crossings between curves are found numerically and labelled over or under alternately along each curve, which is always possible for a drawing in which bands cross two at a time. Where a band goes under, it is cut back by the half-width of the band above at that point, so thick bodies make wide gaps and thin snakes make narrow ones.',
  symbolism:'On the north portal at Urnes the beast is bitten by snakes and bites back. Readings offered include the lion of Judah overcoming evil, and the struggle that ends the world in Norse poetry. No source from the time explains it.'
});

nsT({
  id:'runestone',name:'Swedish runestone',sub:'A rune serpent round the edge, a cross or beast within',native:'runsten',
  region:'Sweden, above all Uppland and Södermanland; Denmark and Norway in smaller numbers',medium:'Granite and sandstone, the lines pecked and cut, then painted',period:'About 980–1100',
  summary:'A standing boulder, taller than a person, its face dressed flat. A snake’s body runs round just inside the edge, and the inscription is cut between its two contour lines; at the foot of the stone its head and tail cross. In the middle stands a cross, or a four-legged beast. The lines were filled with red.',
  axes:{density:.5,weight:.5,uniformity:.5,geometry:.2,symmetry:.5,fill:.3,chroma:.25,ornament:.5,abstraction:.8,narrative:.8},
  genes:{
    structure:{kinds:['runestone'],folds:2,density:.3,symmetry:'free',borderBands:0,bare:.8},
    motifs:{hero:['ringCross','urnesBeast','urnesSnake'],ring:['urnesSnake','ringCross'],filler:['dot'],border:['runeBand','snakeBand'],petal:'pointed'},
    line:NS_LINE(2.2,{wobble:.05}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:NS_ORN({relief:-.3}),
    palette:{ground:'#d9d4c8',ink:'#8a2a1e',fills:['#8a2a1e','#2b2622'],ciFills:['#2b2622','#8a2a1e','#f0ebe0','#a9a49a'],gap:'#a9a49a'},
    ground:{kind:'stone',amount:.75}
  },
  rules:[
    'Choose a stone with one good face and stand it by a road or a bridge.',
    'Draw the serpent first: round the edge, head and tail meeting at the foot.',
    'Cut the runes inside its body, reading from the head.',
    'Put a cross or a beast in the space that is left.',
    'Paint the cut lines so the stone can be read from the road.'
  ],
  maths:'The band is a strip bent along a curve: the same construction that carries any border along any spine. The curve is the stone’s own outline moved inward, opened at the foot, and its two ends turned across each other. Sixteen runes, each one upright stave with one or two branches, are laid along it at even spacing.',
  symbolism:'A runestone is a memorial and a claim. The usual text names those who raised it, the dead person and their relationship, and often adds a prayer; it records inheritance as much as grief. Carvers signed their work.'
});

nsT({
  id:'borre-metalwork',name:'Borre gilt metalwork',sub:'Ring-chains and knots on gilded bronze',native:'Borrestil',
  region:'Scandinavia and the Norse settlements from Russia to Ireland',medium:'Cast and gilded bronze and silver: harness mounts, brooches, pendants',period:'About 850–975',
  summary:'Small bright objects packed with ornament: a band of linked rings along a strap mount, a knot tied through a ring on a pendant, every surface nicked so that it glitters. The interlace is tight and symmetrical, quite unlike the open loops that came later.',
  axes:{density:.9,weight:.5,uniformity:.8,geometry:.5,symmetry:.9,fill:.7,chroma:.3,ornament:.9,abstraction:.9,narrative:.1},
  genes:{
    structure:{kinds:['medallion','knotwork'],folds:6,density:.75,symmetry:'radial',borderBands:1,bare:.4},
    motifs:{hero:['norseKnot','whirlDisc'],ring:['norseKnot','urnesSnake'],filler:['dot','norseKnot'],border:['ringChain','plait','knotChain'],petal:'round'},
    line:NS_LINE(1.4,{wobble:0}),
    fill:{modes:{gold:.7,flat:.3},coverage:.85,hatchGap:5},
    ornament:NS_ORN({relief:.4,dotRows:.3}),
    palette:{ground:'#2b2118',ink:'#1a120b',fills:['#c2912e','#8e6a24','#d9b85a'],ciFills:['#c2912e','#8e6a24'],metal:'#c2912e',strap:'metal',gap:'#2b2118'},
    ground:{kind:'metal',amount:.5}
  },
  rules:[
    'Fill the whole field; a Borre mount has no empty ground.',
    'Build bands of rings linked one through the next.',
    'Tie closed knots through a ring to fill round and three-lobed fields.',
    'Keep everything symmetrical about the axis of the object.',
    'Nick the bands crosswise so the gilding catches the light.'
  ],
  maths:'A ring-chain is a row of circles each overlapping the next, with a wavy band threaded through; drawn as interlace, every circle passes over one neighbour and under the other. The closed knot is a three-lobed loop (radius varying as the cosine of three times the angle) laced through a circle.',
  symbolism:'These were fittings for harness, belts and dress: the display of people who could afford gilded bronze. The style is named for the burial mounds at Borre in Vestfold.'
});

nsT({
  id:'gotland-picture-stone',name:'Gotland picture stone',sub:'A keyhole slab in registers, a ship below',native:'bildsten',
  region:'The island of Gotland in the Baltic',medium:'Limestone slabs carved in very low relief and painted',period:'About 400–1100; the tall keyhole stones about 700–1000',
  summary:'A tall slab shaped like a keyhole or a mushroom, edged with a plaited band and divided across into registers. In the rounded head, a disc of turning spokes or a scene; below, always, a ship with a high prow, a row of shields and a great square sail in a diamond pattern, riding on curled waves.',
  axes:{density:.7,weight:.5,uniformity:.6,geometry:.4,symmetry:.7,fill:.6,chroma:.2,ornament:.6,abstraction:.7,narrative:.9},
  genes:{
    structure:{kinds:['pictureStone'],folds:2,density:.5,symmetry:'bilateral',borderBands:0,bare:.6},
    motifs:{hero:['longship','whirlDisc','urnesBeast'],ring:['whirlDisc','urnesSnake','norseKnot'],filler:['dot'],border:['plait','ringChain','snakeBand'],petal:'pointed'},
    line:NS_LINE(1.5,{wobble:.03}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:NS_ORN(),
    palette:{ground:'#d6ccb4',ink:'#2f2219',fills:['#8a3324','#6a4a30'],ciFills:['#8a3324','#6a4a30'],gap:'#d6ccb4'},
    ground:{kind:'stone',amount:.7}
  },
  rules:[
    'Cut the slab to a keyhole: a round head on a narrower neck, widening to the foot.',
    'Run a plaited band round the edge.',
    'Rule the face into registers.',
    'Give the lowest and largest register to the ship.',
    'Cut the ground back a finger’s depth and paint figures and ground in different colours.'
  ],
  maths:'The outline is a circle for the head joined by a smooth curve to a splayed base. The edge plait is an ordinary straight border bent along that outline. The sail is a rectangle cross-hatched on two diagonals, each line clipped to the sail’s edges.',
  symbolism:'The stones stood by roads and at farm boundaries as memorials. The ship is read as the voyage to the next world; the scenes above it — a rider welcomed with a horn, battles, processions — match episodes known later from Norse poetry, though none is labelled.'
});
