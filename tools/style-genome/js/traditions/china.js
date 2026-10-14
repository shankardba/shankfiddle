'use strict';
/* China — sixth culture family, carried over from culture-loom (whose Chinese preset used
   the huiwen key-fret on the garment and a ruyi cloud-scroll finial and scepter) and
   rebuilt as drawing grammar. All five traditions are CURATED. */

defFamily({id:'china',name:'China',native:'中国',
  blurb:'Thunder-pattern bronzes, cobalt-painted porcelain, red paper-cuts, ice-ray window lattice and the brush — Chinese ornament from the Shang dynasty to a Suzhou garden window.'});

defTradition({
  id:'bronze-leiwen',family:'china',provenance:'curated',
  name:'Ritual bronze ornament',sub:'Masks on a thunder-pattern ground',native:'雷纹',
  region:'Yellow River valley: Shang and Zhou China',medium:'Cast bronze (piece-mould casting), now green with patina',period:'c. 1600–221 BCE',
  summary:'The decoration of Shang and Zhou ritual vessels: a frontal mask (taotie) of staring eyes, curled horns and jaws, divided by a central flange, set on a ground of tiny square spirals — the thunder pattern (leiwen). Bands of masks and key-frets run round the vessel between plain mouldings; every surface is in low relief.',
  axes:{density:.95,weight:.45,uniformity:.85,geometry:.8,symmetry:1,fill:.5,chroma:.2,ornament:.9,abstraction:.9,narrative:.05},
  genes:{
    structure:{kinds:['frieze','panel'],folds:8,density:.3,symmetry:'bilateral',borderBands:1},
    motifs:{hero:['taotie'],ring:['taotie','leiwenSq'],filler:['leiwenSq'],border:['taotieBand','huiwen','lines'],tile:['leiwen'],petal:'pointed'},
    line:{weight:2.6,contrast:.3,double:false,wobble:.05,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:.7,none:.3},coverage:.85,hatchGap:6},
    ornament:{dotRows:0,echo:.4,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false,groundTile:1},
    palette:{ground:'#55705f',ink:'#1e2a23',fills:['#7d9a86','#3e5648','#9fb39c'],gap:'#55705f',metal:'#b08d4a'},
    ground:{kind:'metal',amount:.7}
  },
  rules:[
    'Centre a frontal mask on a vertical flange: two staring eyes, horns curling up and out, jaws and fangs below. Mirror it exactly.',
    'Fill every remaining space with leiwen — tiny square spirals packed edge to edge — so the mask rises from a textured ground.',
    'Run ornament in horizontal bands round the vessel, divided by plain mouldings; frame bands with key-frets.',
    'Model in low relief and flat planes; let the patina be the colour.'
  ],
  glossary:[
    ['Taotie','The frontal mask of early bronzes; a later name, and its original meaning is debated.'],
    ['Léiwén','"Thunder pattern": square spirals used as a ground.'],
    ['Yúnwén','"Cloud pattern": the rounded twin of leiwen.'],
    ['Huíwén','The key-fret meander descended from these patterns ("回" pattern).']
  ],
  symbolism:'Bronzes held food and wine offerings to ancestors. The key-fret meander (huiwen) descends from this cloud-and-thunder ornament on Zhou bronzes (c. 1046–221 BCE); the taste for it lasted through the Han dynasty and into every later medium.',
  care:'The mask here is a generic construction of eyes, horns, flange and jaws, not a copy of any vessel; what the taotie represented is still debated, so no reading is imposed.',
  reading:['Jessica Rawson, Chinese Ornament: The Lotus and the Dragon (British Museum, 1984)']
});

defTradition({
  id:'blue-white',family:'china',provenance:'curated',
  name:'Blue-and-white porcelain',sub:'Cobalt painted under the glaze',native:'青花',
  region:'Jingdezhen, Jiangxi; exported across Asia, the Middle East and Europe',medium:'Cobalt oxide painted on porcelain body under a clear glaze',period:'Mature from the Yuan dynasty (14th c.); Ming and Qing imperial and export wares',
  summary:'A plate is a target of bands: a central medallion (a lotus, fish among weeds, a blossoming branch), a cavetto of scrolling lotus or peony, and a rim of waves, key-frets or ruyi lappets. The painter outlines in dark cobalt and floods the shapes with paler washes; Yuan wares show darker spots where the cobalt gathered.',
  axes:{density:.85,weight:.3,uniformity:.5,geometry:.3,symmetry:.85,fill:.7,chroma:.45,ornament:.8,abstraction:.5,narrative:.35},
  genes:{
    structure:{kinds:['medallion','panel'],folds:8,density:.8,symmetry:'radial',borderBands:2,vine:.45},
    motifs:{hero:['lotusTop','fish','plum','ruyi','xingShi'],ring:['ruyi','lotusSide','cloud','plum'],filler:['cloud','plum','dot'],border:['huiwen','wave','ruyiBand'],petal:'pointed'},
    line:{weight:1.9,contrast:.35,double:false,wobble:.12,taper:.4,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:.85,none:.15},coverage:.85,hatchGap:6},
    ornament:{dotRows:0,echo:.3,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#f5f6f2',ink:'#14306e',fills:['#1d3f8f','#2f5aa8','#5c7fc4','#9db2dc','#0f2a6b'],gap:'#f5f6f2'},
    ground:{kind:'porcelain',amount:.3}
  },
  rules:[
    'Organise in concentric bands: central medallion, a cavetto band, a rim band.',
    'Outline every form in dark cobalt with a fine brush, then fill it with paler cobalt washes; never use another colour.',
    'Make the cavetto a continuous scroll — lotus or peony blooms on a wavy stem with leaves branching off it.',
    'Close the rim with waves, key-frets or ruyi cloud-collar lappets.'
  ],
  glossary:[
    ['Qīnghuā','"Blue flowers": underglaze cobalt-blue decoration.'],
    ['Chánzhī lián','"Entwined lotus": the scrolling lotus band.'],
    ['Ruyi lappet','A pointed, lobed panel shaped like the ruyi head, set in a ring like a cloud collar.'],
    ['Cavetto','The curved well of a plate between centre and rim.']
  ],
  symbolism:'Lotus for purity, fish (yú) for abundance (yú, surplus), plum for endurance, ruyi for "as you wish". Early cobalt was imported from Persia, and Yuan blue-and-white was made largely for markets in the Islamic world.',
  care:'Imperial dragons with five claws were restricted to the emperor\'s wares; dragons are not generated here.',
  reading:['Jessica Rawson, Chinese Ornament: The Lotus and the Dragon (British Museum, 1984)','Terese Tse Bartholomew, Hidden Meanings in Chinese Art (Asian Art Museum of San Francisco, 2006)']
});

defTradition({
  id:'jianzhi',family:'china',provenance:'curated',
  name:'Paper-cut',sub:'Window flowers in red paper',native:'剪纸',
  region:'Across China, with strong northern traditions (Shaanxi, Hebei, Shandong)',medium:'Red paper cut with scissors or knife, often folded before cutting',period:'Paper-cutting from at least the 6th c.; a living folk art (UNESCO intangible heritage, 2009)',
  summary:'Red paper, folded and cut, pasted on windows and doors at the Spring Festival. The image must stay in one connected piece, so solid shapes are pierced rather than outlined: crescents ("moon-tooth" cuts) and fine sawtooth serrations carry the texture, and the fold makes everything symmetric.',
  axes:{density:.75,weight:.6,uniformity:.85,geometry:.4,symmetry:1,fill:.9,chroma:.6,ornament:.6,abstraction:.75,narrative:.3},
  genes:{
    structure:{kinds:['medallion','emblem','sheet'],folds:8,density:.6,symmetry:'radial',borderBands:0},
    motifs:{hero:['fish','bat','plum','lotusTop','xingShi','xingShi'],ring:['bat','plum','ruyi','fish'],filler:['plum','dot','cloud'],border:['zigzag','ruyiBand'],petal:'round'},
    line:{weight:2.2,contrast:.2,double:false,wobble:.1,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6,knockout:.85},
    ornament:{dotRows:.15,echo:.4,echoCount:1,echoStyle:'solid',scallops:.25,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#fbf6ee',ink:'#c21f2b',fills:['#c21f2b'],gap:'#fbf6ee'},
    ground:{kind:'paper',amount:.2}
  },
  rules:[
    'Fold the paper (in half, in four, in eight) and cut through all layers at once; symmetry comes from the fold.',
    'Keep everything connected: solid shapes are pierced with cuts rather than outlined.',
    'Texture with "moon-tooth" crescent cuts and fine sawtooth edges.',
    'One colour — red — on a light window or wall.'
  ],
  glossary:[
    ['Chuānghuā','"Window flowers": paper-cuts pasted on lattice windows at the New Year.'],
    ['Yuèyá wén','"Moon-tooth": the crescent-shaped cut.'],
    ['Jùchǐ wén','"Sawtooth": fine serrated cuts along an edge.']
  ],
  symbolism:'Puns do the work: fish (yú) for surplus every year, bat (fú) for good fortune, and blossoms for spring arriving. Paper-cuts mark weddings, births and the Spring Festival.',
  care:'Characters such as double happiness (囍) and fortune (福) are text and are not generated.',
  reading:['Terese Tse Bartholomew, Hidden Meanings in Chinese Art (Asian Art Museum of San Francisco, 2006)']
});

defTradition({
  id:'ice-ray',family:'china',provenance:'curated',
  name:'Ice-ray lattice',sub:'Cracked-ice window lattice',native:'冰裂纹',
  region:'Gardens and houses of the Jiangnan region (Suzhou, Yangzhou) and beyond',medium:'Wooden lattice (chuāng gé) with paper or glass panes',period:'Ming and Qing dynasties',
  summary:'Window lattice in the pattern of cracking ice: straight wooden bars meeting at random angles in T-junctions, never crossing, every pane a different polygon. It reads as ice breaking up in spring — the end of winter — and is often scattered with plum blossoms, the "ice and plum" design also painted on porcelain.',
  axes:{density:.6,weight:.6,uniformity:.95,geometry:.9,symmetry:.15,fill:.6,chroma:.2,ornament:.2,abstraction:.85,narrative:.1},
  genes:{
    structure:{kinds:['iceray'],folds:8,density:.55,symmetry:'free',borderBands:1},
    motifs:{hero:['plum'],ring:['plum'],filler:['plum'],border:['huiwen','lines'],petal:'round'},
    line:{weight:2,contrast:.2,double:false,wobble:0,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#5a3a22',ink:'#2a1a10',fills:['#efe6cf','#ebe0c4','#f3ecd9'],gap:'#5a3a22'},
    ground:{kind:'board',amount:.5}
  },
  rules:[
    'Split each pane with one straight bar running from edge to edge of that pane, so bars always end on other bars.',
    'Never let two bars cross; every junction is a T.',
    'Vary the angles and the pane sizes, avoiding slivers and right angles.',
    'Optionally scatter plum blossoms over the cracks.'
  ],
  glossary:[
    ['Bīngliè wén','"Cracked-ice pattern".'],
    ['Bīngméi','"Ice and plum": blossoms over cracked ice — winter ending, spring coming.']
  ],
  maths:'The lattice is a recursive subdivision: take a convex pane, cut it with one chord, and repeat on the pieces. A chord of a convex polygon always leaves two convex polygons, so every pane stays convex and every new bar ends on existing bars — which is exactly why the joints are T-junctions and nothing crosses. Daniel Sheets Dye\'s survey of Chinese lattice catalogues hundreds of such windows.',
  symbolism:'Ice cracking in the thaw announces spring; with plum blossoms it becomes a New Year design on ginger jars as well as windows.',
  reading:['Daniel Sheets Dye, A Grammar of Chinese Lattice (Harvard-Yenching Institute, 1937)']
});

defTradition({
  id:'shufa',family:'china',provenance:'curated',
  name:'Brush calligraphy',sub:'Shūfǎ: the eight strokes of yǒng',native:'书法',
  region:'China, and across East Asia',medium:'Ink and brush on xuan paper; red seals',period:'From the Han dynasty; a living art',
  summary:'Columns of characters read top to bottom and right to left, each one built from a handful of basic strokes — dot, horizontal, vertical, hook, rising, left- and right-falling — that a student learns from the single character 永. The brush presses and lifts within each stroke, so a horizontal starts with a pressed head and a right-falling stroke flares into a foot.',
  axes:{density:.45,weight:.45,uniformity:.35,geometry:.5,symmetry:.25,fill:.2,chroma:.05,ornament:.15,abstraction:.9,narrative:.4},
  genes:{
    structure:{kinds:['scroll'],folds:8,density:.4,symmetry:'free',borderBands:0},
    motifs:{hero:['hanzi'],ring:['hanzi'],filler:['seal','sealRound'],border:['lines'],petal:'pointed'},
    line:{weight:6.2,contrast:.4,double:false,wobble:.08,taper:.3,breaks:0,dash:null,misreg:0,brush:1,dry:.35},
    fill:{modes:{flat:.6,none:.4},coverage:.5,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#f3ecdc',ink:'#141210',fills:['#141210'],gap:'#f3ecdc',accent:'#b8322b'},
    ground:{kind:'paper',amount:.4}
  },
  rules:[
    'Write in columns from the top right; read down, then leftward.',
    'Give every character the same imaginary square, whatever its stroke count.',
    'Build characters from the eight basic strokes, each with its own pressure: pressed head on horizontals, a hanging point or a needle on verticals, a flared foot on the right-falling stroke.',
    'Sign in a smaller column at the end and add red seals: a name seal below the signature, a leisure seal at the start.'
  ],
  glossary:[
    ['Yǒng zì bā fǎ','"The eight principles of 永": the basic strokes, all present in that one character.'],
    ['Héng, shù, piě, nà','Horizontal, vertical, left-falling and right-falling strokes.'],
    ['Yìnzhāng','A seal, stamped in cinnabar paste.']
  ],
  symbolism:'Calligraphy is the senior art in China, the measure of the writer\'s cultivation; scripts range from formal regular script to running and wild cursive.',
  care:'Generated characters are asemic: built from the real basic strokes, they spell nothing and must never be presented as Chinese text. Seal marks are abstract, not names.',
  reading:['Chiang Yee, Chinese Calligraphy: An Introduction to Its Aesthetic and Technique (Methuen, 1938)']
});
