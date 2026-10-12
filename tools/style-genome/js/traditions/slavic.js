'use strict';
/* Slavic folk — seventeenth culture family. All five traditions are CURATED: no reference
   images were supplied, so nothing here is measured. Strokes, cut-outs, egg and stitch
   constructions live in js/core/slavic.js. Palettes were set by eye from published
   photographs.

   Each craft is named for the people and place it belongs to. No hooked cross is
   generated, although the sign occurs in old embroidery and on eggs. */

defFamily({id:'slavic',name:'Slavic folk',native:'narodne mystetstvo · sztuka ludowa · narodnoe iskusstvo',
  blurb:'The household arts of the Slavic countryside, made by farming families for their own walls, tables and feast days, and each tied to a place. In Ukraine, eggs written with wax and dye, flowers painted stroke by stroke on whitewashed walls, and towels stitched in red and black. In Poland, coloured paper cut with sheep shears. On the Volga, wooden dishes painted to look like gold. They share a vocabulary — the flower, the bird, the star, the tree — and almost nothing else.'});

const SL_CARE='Each of these crafts belongs to particular people and places, and the names matter. Petrykivka painting is from the village of Petrykivka in the Dnipro region of Ukraine; the pysanka is Ukrainian, with relatives across the Carpathians and the Balkans; wycinanki are Polish, and the styles drawn here are those of Łowicz and Kurpie; Khokhloma is Russian, from the villages north of Nizhny Novgorod. Petrykivka painting was inscribed by UNESCO as intangible heritage in 2013 and the pysanka tradition in 2024. All were pushed toward factory souvenir production in the twentieth century and have been reclaimed by named artists and families since. The meanings given for signs on eggs and towels are those collected from makers in the last century and a half; older meanings are reconstruction. Old embroidery and eggs also carry the hooked cross as a sun sign; it is not generated here, and modern emblems built on it are not part of these traditions.';
const SL_CONV=[
  ['One stroke, one petal','In brush painting the unit is a single stroke: set the loaded brush down and lift it to a point. Nothing is drawn first and nothing is outlined.'],
  ['Two colours on the brush','A Petrykivka brush is dipped in one colour and tipped in another, so each stroke shades from the one to the other.'],
  ['Light to dark','A pysanka is dyed in order — yellow, orange, red, black — and each line of wax keeps the colour that was on the egg when it was drawn.'],
  ['Divide first','The egg is divided by lines into belts and faces before anything is filled; the division is half the design.'],
  ['Fold and cut','A paper cut-out is folded once, or into eight, and cut freehand, so it is symmetric without being measured.'],
  ['Layer on layer','In Łowicz work each colour is a separate piece of paper pasted on the last, largest first.'],
  ['Count the threads','Cross-stitch has no curves. A design is a count of squares, and the same count gives the same figure on any cloth.'],
  ['Red, and black','Red is life and black is earth: the two threads of the central Ukrainian towel and shirt.']
];
const SL_GLOSS=[['Pysanka','From pysaty, to write: an egg decorated with wax and dyes.'],['Kistka','The stylus for wax: a small metal funnel on a stick.'],['Petrykivka','A village in Dnipropetrovsk region, Ukraine, and the painting named for it.'],['Zernyatko','“Little seed”: the basic drop-shaped stroke.'],['Khokhloma','A trading village on the Volga that gave its name to gold-painted woodenware.'],['Travka','“Grass”: the fine curled strokes that fill Khokhloma ware.'],['Wycinanki','Polish paper cut-outs. Pronounced vi-chee-NAN-kee.'],['Leluja','The Kurpie tree cut-out, one colour, folded once.'],['Rushnyk','A long embroidered or woven ritual towel, used at birth, marriage and burial.'],['Vyshyvanka','An embroidered shirt.']];

const slT=o=>defTradition(Object.assign({family:'slavic',provenance:'curated',care:SL_CARE,conventions:SL_CONV,glossary:SL_GLOSS},o));
const SL_ORN=x=>Object.assign({dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},x);
const SL_LINE=(weight,x)=>Object.assign({weight,contrast:.4,double:false,wobble:.015,taper:0,breaks:0,dash:null,misreg:0},x);

slT({
  id:'pysanka',name:'Ukrainian pysanka',sub:'An egg written in wax and dyed from light to dark',native:'pysanka',
  region:'Ukraine, most elaborately in the Hutsul highlands of the Carpathians; related traditions among neighbouring peoples',medium:'Beeswax drawn with a heated stylus on a raw egg, dyed in successive baths, the wax melted off at the end',period:'Ceramic eggs from the tenth century; the living tradition recorded from the nineteenth',
  summary:'A hen’s egg, black, covered with fine lines in white, yellow, orange and red. The lines divide it first: a belt round the middle, narrower belts above and below, a cap at each end. Inside the divisions are a star of eight lozenges, a rayed sun, a deer, ears of wheat, rows of triangles called wolves’ teeth, and a wavy line that runs round the egg and meets itself.',
  axes:{density:.85,weight:.4,uniformity:.8,geometry:.9,symmetry:.9,fill:.8,chroma:.8,ornament:.9,abstraction:.9,narrative:.3},
  genes:{
    structure:{kinds:['pysanka'],folds:8,density:.8,symmetry:'bilateral',borderBands:0,bare:.3},
    motifs:{hero:['pyStar','pySun','pyDeer'],ring:['pyPine','pyWheat','pySun','pyStar'],filler:['dot'],border:['pyTeeth','pyWave','pyLadder'],petal:'pointed'},
    line:SL_LINE(1.5,{wobble:.02}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:SL_ORN(),
    palette:{ground:'#cdbb90',ink:'#f7f2e4',fills:['#c3261c','#f0c22b','#e67a1f','#2f7d46'],ciFills:['#c3261c','#17120f','#f0c22b','#2f7d46','#e67a1f','#f7f2e4'],gap:'#17120f'},
    ground:{kind:'none',amount:.3}
  },
  rules:[
    'Take a clean white egg, raw and whole.',
    'Draw the dividing lines in wax: round the long way, round the middle, then the belts.',
    'Draw everything that is to stay white. Dye yellow. Draw what is to stay yellow. Dye orange, then red, drawing between each.',
    'Dye black last.',
    'Hold the egg beside a candle and wipe the wax away; all the colours appear at once.'
  ],
  maths:'An egg is a surface of revolution, so its natural divisions are meridians and parallels: the belts are parallels, the faces lie between meridians. A band that closes on itself must hold a whole number of repeats. The star is eight congruent lozenges with angles of 45 and 135 degrees meeting at a point. The app flattens the egg: belts are borders bent along shallow arcs and everything is clipped to the egg’s outline, which is convex.',
  symbolism:'An egg is given, not kept: to parents, godchildren, the priest, the dead. The star and the sun are the same wish for light; the deer and the wheat are health and harvest; the fir is youth; the line with no end keeps harm wandering along it for ever. An old saying holds that the world lasts as long as pysanky are written.'
});

slT({
  id:'petrykivka',name:'Petrykivka painting',sub:'Flowers built of single strokes, in a bouquet',native:'petrykivskyi rozpys',
  region:'Petrykivka, Dnipropetrovsk region, Ukraine',medium:'Egg tempera, later gouache, on whitewashed walls, then paper and wood; brushes of cat hair, reeds and fingertips',period:'Wall painting from the 1700s; on paper since the late 1800s; taught in the village school from 1936',
  summary:'A white ground and a bouquet that fills it. Three great round flowers, red shading to orange and yellow, each petal one stroke of the brush; buds on bent stems at the edges; bunches of red berries; feathered leaves in dark green with yellow hearts; sometimes a bird. No outline anywhere, and no flower that a botanist could name.',
  axes:{density:.7,weight:.5,uniformity:.3,geometry:.2,symmetry:.7,fill:1,chroma:.9,ornament:.8,abstraction:.5,narrative:.2},
  genes:{
    structure:{kinds:['bouquet'],folds:8,density:.6,symmetry:'bilateral',borderBands:1,bare:.2},
    motifs:{hero:['ptFlower'],ring:['ptBud','ptKalyna','ptBird','ptBud','ptKalyna'],filler:['ptLeaf'],border:['ptStrokes','lines'],petal:'drop'},
    line:SL_LINE(0.9),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:SL_ORN(),
    palette:{ground:'#f6f1e3',ink:'#3a2418',fills:['#c8261d','#f0b92b','#3d7f33','#e8731e'],ciFills:['#c8261d','#6e1220','#f0b92b','#3d7f33','#e8731e','#2c5f9e'],gap:'#f6f1e3'},
    ground:{kind:'plaster',amount:.3}
  },
  rules:[
    'Whitewash the wall, or take white paper.',
    'Place the largest flower first, a little above the middle.',
    'Dip the brush in red and touch its tip in yellow; lay each petal with one stroke, from the rim inward.',
    'Run the stems down to one point. Hang buds and berries at their ends.',
    'Fill what is left with leaves and fine comb strokes, and stop before it is crowded.'
  ],
  maths:'A stroke is a teardrop: a circle at one end drawn out to a point at the other. A flower is n such strokes rotated about a centre in steps of 360/n degrees, with a second ring of shorter strokes set in the gaps. A leaf is the same stroke repeated along a curve at a fixed angle to it, its length falling linearly toward the tip.',
  symbolism:'The paintings began as borders round the windows and stove of a whitewashed house, renewed every spring; a well-painted house had a hard-working daughter. The guelder rose is the plant of Ukrainian song. The flowers are deliberately of no species: they are abundance.'
});

slT({
  id:'khokhloma',name:'Khokhloma ware',sub:'Red and gold on black, a stem, berries and grass',native:'khokhloma',
  region:'The Volga villages north of Nizhny Novgorod, Russia; sold through the market at Khokhloma',medium:'Turned limewood primed with clay, rubbed with tin or aluminium powder, painted in oil colour, then varnished and baked so the metal turns gold',period:'From the late 1600s',
  summary:'A wooden dish that looks like gold. Round the black well runs a waving gold stem; in each bend hangs a bunch of red berries or sits a gold leaf veined in red; and from every part of the stem fine blades of grass curl away, red and gold by turns, each ending in a hair-thin hook.',
  axes:{density:.8,weight:.4,uniformity:.5,geometry:.2,symmetry:.7,fill:1,chroma:.7,ornament:.9,abstraction:.5,narrative:.1},
  genes:{
    structure:{kinds:['kudrina'],folds:6,density:.7,symmetry:'radial',borderBands:1,bare:.2},
    motifs:{hero:['khKudrina','khBerry'],ring:['khBerry','khRowan'],filler:['khLeaf'],border:['khTravka','lines'],petal:'drop'},
    line:SL_LINE(1.1),
    fill:{modes:{flat:.8,gold:.2},coverage:1,hatchGap:5},
    ornament:SL_ORN(),
    palette:{ground:'#3b2a1c',ink:'#d9a52b',fills:['#c3241b','#e3b233','#4f7f2e','#e0621c'],ciFills:['#c3241b','#141010','#e3b233','#4f7f2e','#e0621c','#f1d37a'],metal:'#d9a52b',gap:'#141010'},
    ground:{kind:'wood',amount:.4}
  },
  rules:[
    'Turn the dish, prime it with clay and oil, and rub it all over with metal powder so it shines like silver.',
    'Paint the stem round it in one movement.',
    'Hang berries and leaves in the bends, turn about.',
    'Pull grass from the stem with the tip of the brush, pressing and lifting.',
    'Varnish and bake. The varnish yellows in the oven and the silver becomes gold.'
  ],
  maths:'The stem is a sine wave wrapped on a circle: radius r₀ + a·sin(nθ), with n whole so that it closes. Berries sit at the troughs and leaves at the crests, alternately inside and outside the wave. A blade of grass is a stroke whose direction turns steadily along its length, so it is an arc that tightens into a hook.',
  symbolism:'The ware was made for the table and sold by the cartload down the Volga: gold dishes for people who would never own gold. In the reserved manner the gold is not painted at all; the black is painted round it.'
});

slT({
  id:'wycinanki',name:'Polish wycinanki',sub:'Cut paper: roosters, a star, layered colour',native:'wycinanki łowickie · kurpiowskie',
  region:'Poland: Łowicz for layered colour, Kurpie for single-colour trees and stars',medium:'Glazed coloured paper cut with sheep shears, pasted on white card or straight on the wall',period:'From the mid-1800s, when coloured paper reached the villages',
  summary:'White card, and on it paper cut so cleanly it looks printed. A round star: a scalloped black disc under ring after ring of petals in red, orange, yellow and green, each a separate layer. Below it two black roosters face each other, their tails fans of coloured strips. Or a single sheet folded and cut into a tall tree with birds at its foot, all in one green.',
  axes:{density:.6,weight:.6,uniformity:.8,geometry:.6,symmetry:1,fill:1,chroma:1,ornament:.8,abstraction:.6,narrative:.2},
  genes:{
    structure:{kinds:['wycinanka','medallion'],folds:8,density:.5,symmetry:'bilateral',borderBands:1,bare:.5},
    motifs:{hero:['wyGwiazda','wyLeluja','wyGwiazda'],ring:['wyRooster'],filler:['wyFlower'],border:['wyScallop','zigzag'],petal:'drop'},
    line:SL_LINE(1,{wobble:0}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:SL_ORN(),
    palette:{ground:'#f4f0e6',ink:'#1a1614',fills:['#d32a22','#f2c62e','#2f8f4a','#ee7a1c','#2a63b0'],ciFills:['#d32a22','#1a1614','#f2c62e','#2f8f4a','#ee7a1c','#2a63b0'],gap:'#f4f0e6'},
    ground:{kind:'paper',amount:.2}
  },
  rules:[
    'Fold the paper: once for a tree, into eight for a star.',
    'Cut freehand with the big shears, turning the paper and not the blades.',
    'Open it out.',
    'For Łowicz work, cut each colour as its own piece, a little smaller each time, and paste one on another.',
    'Paste the finished piece on the wall at Easter, in place of last year’s.'
  ],
  maths:'One fold gives one mirror line; three folds give a star with eight mirror lines, the symmetry of a regular octagon. Whatever is cut in the folded wedge appears sixteen times. Layering is a stack of shapes each contained in the one below, so only the rim of each colour shows.',
  symbolism:'They were made by women for the white walls of the main room and replaced each year. The rooster is the farmyard and the morning; the tree with its birds is the tree of life, older than paper. Sheep shears were the only scissors in the house.'
});

slT({
  id:'vyshyvka',name:'Ukrainian cross-stitch',sub:'Red and black on linen: the towel and the shirt',native:'vyshyvka · rushnyk',
  region:'Ukraine, in many regional styles; the red and black cross-stitch drawn here is that of the centre and the Dnipro',medium:'Cotton or wool thread on linen or hemp cloth, counted over the weave',period:'Cross-stitch from the 1800s; older techniques much earlier',
  summary:'A long white towel with deep red at each end. Narrow zigzag bands, then a broad band of eight-pointed stars and lozenges, then a tree: a straight stem in a pot, branches in pairs, a flower on each, and a bird facing it from either side. Every edge is a staircase, because every stitch is a square. The middle of the towel is bare.',
  axes:{density:.6,weight:.5,uniformity:1,geometry:1,symmetry:1,fill:1,chroma:.5,ornament:.8,abstraction:.9,narrative:.3},
  genes:{
    structure:{kinds:['rushnyk'],folds:4,density:.6,symmetry:'bilateral',borderBands:0,bare:.6},
    motifs:{hero:['vyTree'],ring:['vyBird'],filler:['vyStar','vyRhomb'],border:['vyBand','vyTeeth'],tile:['vyField'],petal:'step'},
    line:SL_LINE(1,{wobble:0}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:SL_ORN(),
    palette:{ground:'#f2ede0',ink:'#2a1d18',fills:['#b81f24','#1a1513'],ciFills:['#b81f24','#1a1513','#d99a2b','#2e7d57','#d8642a','#27458f'],gap:'#f2ede0'},
    ground:{kind:'cloth',amount:.6}
  },
  rules:[
    'Count the threads of the cloth: so many to a stitch, the same everywhere.',
    'Begin at the middle of the band and work outward so both ends match.',
    'Make every cross the same way round, the top stitch always leaning the same way.',
    'Work both ends of the towel alike.',
    'Leave the middle plain: it is where the bread rests, or the hands are bound.'
  ],
  maths:'Each figure is a set of cells on the square lattice, so it can be written as a rule from coordinates to colour. The star is the set of cells (x, y) with min(|x|,|y|) ≤ m and max ≤ min + m: eight lozenges, each m cells wide. The sown field is rings of constant |x| + |y|. Both have all eight symmetries of the square.',
  symbolism:'A rushnyk holds the bread and salt offered to a guest, binds the hands of a couple at their wedding, hangs over the icons, and lowers the coffin. Its tree is the family; the two birds are the pair. A shirt is embroidered where it opens — neck, cuff and hem — and worked for a child before it is born.'
});
