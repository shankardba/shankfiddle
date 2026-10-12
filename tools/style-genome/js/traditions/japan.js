'use strict';
/* Japan — fifth culture family, carried over from culture-loom (whose Japanese preset was a
   seigaiha-patterned kimono, a red-banded hat and a folding fan) and rebuilt as drawing
   grammar. All four traditions are CURATED. Tessellations (wagara) live in weave.js as
   tiles, so any tradition can be blended onto a patterned ground. */

defFamily({id:'japan',name:'Japan',native:'日本',
  blurb:'Repeat patterns cut into paper stencils and stitched into indigo, family crests, and the single brush circle of Zen ink — Japan\'s flat, rhythmic design beside its most gestural line.'});

defTradition({
  id:'wagara',family:'japan',provenance:'curated',
  name:'Wagara stencil patterns',sub:'Katagami-dyed grounds and kimono',native:'和柄',
  region:'Japan; stencils famously from Ise (Suzuka)',medium:'Mulberry-paper stencils (katagami), rice-paste resist, indigo and other dyes on cotton and silk',period:'Motifs from the Heian period (794–1185); stencil dyeing flourished in the Edo period (1603–1868); living',
  summary:'Japanese repeat patterns cover cloth edge to edge: overlapping wave-fans (seigaiha), hemp-leaf stars (asanoha), linked circles (shippō), tortoiseshell hexagons (kikkō), scale triangles (uroko). Kimono lay larger motifs — blossoms, fans, crests in roundels — over these grounds, or set two patterns side by side in bands and blocks.',
  axes:{density:.85,weight:.35,uniformity:.95,geometry:.75,symmetry:.9,fill:.7,chroma:.55,ornament:.5,abstraction:.85,narrative:.05},
  genes:{
    structure:{kinds:['wagara','field'],folds:8,density:.5,symmetry:'bilateral',borderBands:0},
    motifs:{hero:['sakura','sensu','kikuMon','tomoe'],ring:['sakura','asanohaMon','sensu'],filler:['sakura','dot'],border:['seigaihaBand','lines'],tile:['seigaiha','asanoha','shippo','kikko','uroko','ichimatsu'],petal:'round'},
    line:{weight:2.1,contrast:.35,double:false,wobble:.04,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:.75,none:.25},coverage:.85,hatchGap:6},
    ornament:{dotRows:0,echo:.15,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false,groundTile:.9},
    palette:{ground:'#1f3a5f',ink:'#f5f0e6',fills:['#2c5282','#c0392b','#4f7fae','#7a8fa6'],gap:'#1f3a5f',metal:'#d4af37'},
    ground:{kind:'cloth',amount:.45}
  },
  rules:[
    'Choose one repeat and run it over the whole cloth, past every edge; it never stops around a motif.',
    'Build the repeats from compass and triangle grids: fans of concentric arcs, six-pointed stars, linked circles, hexagons.',
    'Float a few larger motifs over the ground — blossoms, fans, crests — some reserved in plain roundels.',
    'Alternatively split the cloth into bands or blocks and alternate two patterns.',
    'Keep colour flat and few: indigo and white from resist dyeing, with red, gold or a second blue.'
  ],
  glossary:[
    ['Wagara','The family of traditional Japanese repeat patterns.'],
    ['Seigaiha','"Blue sea waves": overlapping fans of concentric arcs. A wish for calm and lasting good fortune.'],
    ['Asanoha','Hemp leaf: six-pointed stars from a triangle grid; dyed into babies\' clothes for strong, straight growth.'],
    ['Shippō','"Seven treasures": endlessly linked circles — harmony and lasting relations.'],
    ['Kikkō','Tortoiseshell hexagons — long life.'],
    ['Uroko','Scales — protection; worn on festival and theatre costume.'],
    ['Katagami','The cut paper stencil through which rice-paste resist is applied before dyeing.']
  ],
  symbolism:'Seigaiha entered Japan from China around the 6th century as a map sign for water and became a textile pattern in the Heian court, named for the gagaku court-music piece in which dancers wore it; dyeing it well took advanced skill, so it first marked court dress. Each repeat carries a wish — growth, long life, protection, calm — so patterns are chosen for occasions and ages.',
  care:'The sixteen-petal double chrysanthemum is the imperial seal and is not generated; crests here use other petal counts.',
  reading:['Japanese Design Motifs: 4,260 Illustrations of Heraldic Crests, compiled by the Matsuya Piece-Goods Store, trans. Fumie Adachi (Dover, 1972)']
});

defTradition({
  id:'sashiko',family:'japan',provenance:'curated',
  name:'Sashiko',sub:'Running-stitch reinforcement',native:'刺し子',
  region:'Rural Japan, especially Tōhoku',medium:'White cotton thread in running stitch on indigo-dyed cotton',period:'Edo period onward; now a widely practised craft',
  summary:'"Little stabs": layers of worn indigo cloth quilted together with even running stitch in white thread, first to make work clothes warm and strong, then as ornament. Stitches follow the same geometric repeats as the stencils — hemp leaf, waves, linked circles — or the one-stitch grids of hitomezashi, where closed shapes emerge from rows that start on or off.',
  axes:{density:.8,weight:.4,uniformity:.95,geometry:.9,symmetry:.9,fill:0,chroma:.2,ornament:.5,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['wagara','field'],folds:8,density:.55,symmetry:'bilateral',borderBands:0},
    motifs:{hero:['asanohaMon','sakura'],ring:['asanohaMon'],filler:['dot'],border:['lines'],tile:['hitomezashi','asanoha','seigaiha','shippo','kikko'],petal:'round'},
    line:{weight:2.6,contrast:0,double:false,wobble:.1,taper:0,breaks:0,dash:'stitch',misreg:0},
    fill:{modes:{none:1},coverage:0,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'stitch',scallops:0,halo:0,gems:null,groundStitch:false,groundTile:1},
    palette:{ground:'#1b2b45',ink:'#efe9dc',fills:['#1b2b45'],gap:'#1b2b45'},
    ground:{kind:'cloth',amount:.7}
  },
  rules:[
    'Stitch, don\'t draw: every line is a run of even stitches with even gaps, white on indigo.',
    'Follow a geometric grid — hemp leaf, waves, linked circles, tortoiseshell — across the whole cloth.',
    'For hitomezashi, stitch every grid line on-off-on, choosing only whether each row and column starts on or off; the closed shapes appear by themselves.',
    'Keep stitches the same length; where lines meet, stitches should not cross on top of each other.'
  ],
  glossary:[
    ['Sashiko','"Little stabs": running-stitch quilting through layers of cloth.'],
    ['Moyōzashi','Sashiko that follows continuous lines of a pattern (asanoha, seigaiha).'],
    ['Hitomezashi','"One-stitch" sashiko on a grid, where each stitch covers one grid unit.']
  ],
  maths:'Hitomezashi is a binary construction: on a square grid, each horizontal line is stitched on/off/on… starting with a 0 or 1, and likewise each vertical line. Those two sequences of bits are the whole design: the stitch lines never cross, and every closed shape is a consequence of the bits rather than something drawn.',
  symbolism:'Born of thrift — patching and strengthening precious cloth through the winter — sashiko patterns also carried protective wishes, as their stencil cousins did.',
  reading:[]
});

defTradition({
  id:'kamon',family:'japan',provenance:'curated',
  name:'Kamon',sub:'Family crests',native:'家紋',
  region:'Japan',medium:'Resist-dyed on formal kimono; lacquer, roof tiles, banners, lanterns',period:'Court origins in the Heian period; samurai banners from the 12th c.; general use from the Edo period',
  summary:'Small, strictly symmetric emblems — a chrysanthemum, three swirling commas, a cherry blossom, a hemp-leaf star, a folding fan — often enclosed in a ring. In crest books they are solid black shapes cut through with fine white lines; on kimono they are reserved white on a dark ground.',
  axes:{density:.25,weight:.6,uniformity:.95,geometry:.6,symmetry:1,fill:.9,chroma:0,ornament:.15,abstraction:.95,narrative:0},
  genes:{
    structure:{kinds:['sheet','field'],folds:8,density:.25,symmetry:'radial',borderBands:0},
    motifs:{hero:['kikuMon','tomoe','sakura','asanohaMon','sensu'],ring:['kikuMon','tomoe','sakura','asanohaMon'],filler:['dot'],border:['lines'],petal:'round'},
    line:{weight:2.4,contrast:.2,double:false,wobble:0,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6,knockout:.95},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#f4efe4',ink:'#151313',fills:['#151313'],gap:'#f4efe4'},
    ground:{kind:'paper',amount:.25}
  },
  rules:[
    'Build every crest inside a circle with compass and ruler; radial or mirror symmetry is absolute.',
    'Draw it as a solid shape and cut the details back out as fine white lines.',
    'Enclose it in a ring (maru) or leave it free; never add a background.',
    'Reduce the subject — plant, animal, object — to the fewest shapes that still read at the size of a thumbnail.'
  ],
  glossary:[
    ['Mon','A crest; kamon is a family crest.'],
    ['Maru','The enclosing ring — "maru ni" plus a motif names a crest in a circle.'],
    ['Tomoe','Comma-shaped swirls, usually three (mitsudomoe).'],
    ['Kiku','Chrysanthemum; the sixteen-petal double form is reserved as the imperial seal.']
  ],
  symbolism:'Crests mark a family, worn on formal kimono (one, three or five of them), painted on lanterns and roof tiles, and carried on banners. The chrysanthemum stands for long life; tomoe for water and thunder (and the god Hachiman); the paulownia is used by the government.',
  care:'The imperial sixteen-petal chrysanthemum is not generated; the chrysanthemum crests here use twelve or fourteen petals.',
  reading:['Japanese Design Motifs: 4,260 Illustrations of Heraldic Crests, compiled by the Matsuya Piece-Goods Store, trans. Fumie Adachi (Dover, 1972)']
});

defTradition({
  id:'zen-ink',family:'japan',provenance:'curated',
  name:'Zen ink',sub:'Ensō, bamboo and inscription',native:'禅画',
  region:'Zen temples of Japan (from Chan Buddhism in China)',medium:'Sumi ink and brush on paper; red seals',period:'Zenga flourished in the Edo period (Hakuin, Sengai); living practice',
  summary:'A circle made in one breath, a stalk of bamboo, a few words in a column beside it. Zen ink painting (zenga) values the single unretouched stroke: the brush presses, swells and runs dry, and whatever it leaves — the open gap of an ensō, a streak of white in the black — stays.',
  axes:{density:.12,weight:.7,uniformity:.15,geometry:.2,symmetry:.25,fill:.45,chroma:.05,ornament:.1,abstraction:.8,narrative:.2},
  genes:{
    structure:{kinds:['scroll'],folds:8,density:.15,symmetry:'free',borderBands:0},
    motifs:{hero:['enso','enso','bamboo'],ring:['hanzi'],filler:['seal','sealRound'],border:['lines'],petal:'pointed'},
    line:{weight:8,contrast:.5,double:false,wobble:.15,taper:.3,breaks:0,dash:null,misreg:0,brush:1,dry:.75},
    fill:{modes:{flat:.85,none:.15},coverage:.7,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#f6f2e8',ink:'#121110',fills:['#121110','#3a3835'],gap:'#f6f2e8',accent:'#c0392b'},
    ground:{kind:'paper',amount:.4}
  },
  rules:[
    'One stroke, one breath: the ensō is made in a single movement and never corrected.',
    'Let the brush go from wet and pressed to dry and broken; the white streaks of "flying white" are part of the work.',
    'Leave most of the paper empty; place the subject off centre.',
    'Add a column or two of inscription beside the image, then a red seal.',
    'Bamboo leaves are single press-and-lift strokes; stalk segments are one stroke each, with a mark at every node.'
  ],
  glossary:[
    ['Ensō','The circle drawn in one stroke — emptiness, wholeness, the moment.'],
    ['Zenga','Painting and calligraphy made by Zen monks as teaching.'],
    ['Sumi','Ink made from soot and glue, ground on an inkstone.'],
    ['Hitsuzendō','The way of Zen through the brush.']
  ],
  symbolism:'An ensō can be closed (completeness) or left open (imperfection accepted, the circle still unfinished); its quality is read as a direct trace of the painter\'s state of mind at that moment.',
  care:'Generated inscriptions are asemic: built from the basic brush strokes, they spell nothing and must never be presented as Japanese or Chinese text. Seal marks are abstract.',
  reading:['Stephen Addiss, The Art of Zen: Paintings and Calligraphy by Japanese Monks, 1600–1925 (Abrams, 1989)']
});
