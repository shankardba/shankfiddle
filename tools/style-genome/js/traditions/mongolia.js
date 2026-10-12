'use strict';
/* Mongolia — second culture family. Calligraphy and script-figure painting are ANALYZED
   from reference images (with Lab measurements); khee ornament and
   shirdeg felt are CURATED companions that bring the ornament vocabulary into the Mixer. */

defFamily({id:'mongolia',name:'Mongolia',native:'Монгол',
  blurb:'Brush calligraphy in the vertical Mongol script, and the ram\'s-horn ornament of the steppe — the most gestural and the most geometric registers in the atlas.'});

defTradition({
  id:'mongol-calligraphy',family:'mongolia',provenance:'analyzed',
  name:'Mongol calligraphy',sub:'Uran bichleg in Mongol bichig',native:'Уран бичлэг',
  region:'Mongolia and Inner Mongolia',medium:'Ink and brush on paper; red seal paste',period:'Script from the early 13th c.; calligraphy a living art',
  summary:'The traditional Mongolian script runs top to bottom in columns read left to right, every letter hanging from one vertical spine. Calligraphers turn that spine into pure gesture: a hard-pressed crown, flicked teeth, swelling loops, and a tail that may sweep across half the sheet. Black ink, a red seal, and a great deal of empty paper.',
  axes:{density:.18,weight:.34,uniformity:.46,geometry:.3,symmetry:.09,fill:.03,chroma:.05,ornament:.27,abstraction:.85,narrative:.3},
  genes:{
    structure:{kinds:['calligraphy'],folds:8,density:.2,symmetry:'free',borderBands:0},
    motifs:{hero:['scriptWord'],ring:['scriptWord'],filler:['seal','sealRound'],border:['lines'],petal:'drop'},
    line:{weight:7.5,contrast:.6,double:false,wobble:.12,taper:.25,breaks:0,dash:null,misreg:0,brush:1,dry:.6},
    fill:{modes:{none:.65,flat:.35},coverage:.5,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#fbf9f4',ink:'#111111',fills:['#111111'],gap:'#fbf9f4',accent:'#c8322b'},
    ground:{kind:'paper',amount:.35}
  },
  rules:[
    'Write top to bottom, columns left to right. Every letter hangs from one vertical spine (nuruu).',
    'Open each word with a crown (titem): the brush lands hard at an angle and lifts.',
    'Teeth (shüd) flick left off the spine and taper to a point; loops, the "bellies" (gedes), swell out to the right. The closing tail (süül) can be flung far beyond the word.',
    'One load of ink per word. Strokes run from wet black into dry-brush streaks, and a single movement can go from full brush width to a hairline (measured 5–6× range inside one word).',
    'One or two large words carry the sheet; a colophon in small columns (poem, dedication, signature) balances it. Red seals are the only colour, and well over 80% of the paper stays empty.'
  ],
  symbolism:'Mongol bichig was adapted from the Old Uyghur alphabet in the early 13th century. It remains in official use in Inner Mongolia; Mongolia, which moved to Cyrillic in the 1940s, has been bringing it back alongside Cyrillic. Writing a word beautifully is itself the subject — calligraphy pieces often take a single word of blessing, homeland or the sky as their theme.',
  care:'Generated words are asemic: assembled from the script\'s real stroke elements but spelling nothing, and they must never be presented as Mongolian text. The inscriptions in the reference images are the artists\' own writing and are not reproduced. Seal marks are abstract, not names.',
  analysis:{
    source:'A Mongolian calligraphy sheet: one large brush word with a long sweeping tail, a colophon of about six small columns, and two red seals (reference image; analysed locally, not stored).',
    observations:[
      'The large word is built from a few heavy strokes: two pressed crowns flaring outward like horns, thick loops on the right of the spine, sharp teeth on the left.',
      'Its final stroke is flung out of the word into a single hairline curve that swings down, left and back under the whole composition.',
      'Wet strokes are solid black; edges and ends show dry-brush texture where the ink ran out.',
      'The colophon is small, regular script in vertical columns — the same letter forms at a tenth of the scale and a far more even pen.',
      'Colour is limited to two cinnabar seals: a small round one at the start of the big word and a square one set into the colophon.',
      'The composition is strongly asymmetric, with most of the paper left empty.'
    ],
    measured:{
      note:'Lab measurements on the whole sheet and two crops (the large word; the colophon), upsampled up to 2×. Profile axes average the two crops; density comes from the whole sheet.',
      findings:[
        'Strong modulation: stroke-width CV 0.44 in the large word, against 0.04–0.05 for the Indian icon set and 0.33 for devotional line art.',
        'Width range inside the big word runs about 5× (10th to 90th percentile); across the whole sheet, hairline tail to heavy crown, about 6×.',
        'The emptiest sheet measured so far: ink covers 6.6% of the page.',
        'Least symmetric register measured: mirror IoU 0.30–0.40.',
        'Pure black ink (#000000) on white; the red seals are under 1% of the pixels, so measured colour is near zero.',
        'The colophon script is more even (CV 0.34) — small writing is controlled, large writing is gestural.'
      ],
      axes:{density:.18,weight:.34,uniformity:.46,geometry:.3,symmetry:.09,fill:.03,chroma:.05,ornament:.27},
      samples:[
        {label:'Whole sheet',strokeRel:.0091,strokeCV:.446,coverage:.066,solidFrac:.166,bilateral:.31,rotational:.25,folds:16,dots:16},
        {label:'Large word',strokeRel:.026,strokeCV:.442,coverage:.19,solidFrac:.025,bilateral:.3,rotational:.26,folds:16,dots:1},
        {label:'Colophon',strokeRel:.0201,strokeCV:.339,coverage:.124,solidFrac:0,bilateral:.4,rotational:.28,folds:16,dots:5}
      ]
    }
  },
  reading:['György Kara, Books of the Mongolian Nomads: More than Eight Centuries of Writing Mongolian (Indiana University, 2005)']
});

defTradition({
  id:'mongol-script-figures',family:'mongolia',provenance:'analyzed',
  name:'Script-figure painting',sub:'Calligraphy that becomes people',native:'',
  region:'Mongolia and Inner Mongolia, contemporary',medium:'Ink and brush on paper; red seals',period:'Contemporary',
  summary:'A contemporary genre in which the vertical script itself draws the people: a word stack becomes a body, a crown stroke a tall hat, a tail a sleeve or sash. Heavy wet brush masses — hats, fur collars, hair — stand against hairline robes that flare into rippling hems.',
  axes:{density:.36,weight:.29,uniformity:.09,geometry:.17,symmetry:.17,fill:.57,chroma:0,ornament:.38,abstraction:.75,narrative:.55},
  genes:{
    structure:{kinds:['procession'],folds:8,density:.35,symmetry:'free',borderBands:0},
    motifs:{hero:['scriptWord'],ring:['scriptWord'],filler:['seal','sealRound'],border:['lines'],petal:'drop'},
    line:{weight:6,contrast:.8,double:false,wobble:.18,taper:.3,breaks:0,dash:null,misreg:0,brush:1,dry:.5},
    fill:{modes:{none:1},coverage:0,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#fbfaf6',ink:'#0e0e0e',fills:['#0e0e0e'],gap:'#fbfaf6',accent:'#c8322b'},
    ground:{kind:'paper',amount:.3}
  },
  rules:[
    'Let the script make the figure: a vertical word stack is the body axis, a crown stroke rises into a tall hat peak, a tail becomes a sleeve or a sash.',
    'Keep two line registers: heavy wet brush for hats, collars and hair; hairline for robe edges and faces.',
    'Flare the robe (deel) to a rippling hem, and let ink pool in the hem\'s curled ends.',
    'Reduce faces to a hairline oval and two or three marks; a touch of red (lips, seals) is the only colour.',
    'Stand the figures in a loose frieze of different heights, and set inscriptions in the gaps above the shorter ones.'
  ],
  symbolism:'Family and community in steppe dress: deel robes, fur-trimmed and tall peaked hats, a child carried in a bundle drawn entirely from looping letters. The figures are literally made of the written language.',
  care:'Faces and figures are documented here, not generated: the generator builds faceless script columns (peak, word stack, flared hem) instead. Generated script is asemic, and the reference inscriptions are not reproduced.',
  analysis:{
    source:'A Mongolian calligraphic figure painting: five or six figures in deel robes and tall hats, two inscription blocks, several red seals (reference image; analysed locally, not stored).',
    observations:[
      'Each figure\'s body is a vertical word stack; zigzag "teeth" become arms and torso folds.',
      'Hats are single wet strokes: a tall hairline-to-heavy peak, or a broad swept brim that reads as fur.',
      'Robes are drawn in hairline with flared, rippling hems whose curled ends are heavy blots of ink.',
      'Faces are an oval and a few marks — small eyes, a brow; one has red lips, the only colour besides the seals.',
      'A child in a bundle is built entirely from stacked loops.',
      'The figures stand in a frieze of varied heights; two inscription blocks and a top-centre seal fill the space above the shorter ones; signature and seal at bottom right.'
    ],
    measured:{
      note:'Lab measurements on the whole painting and three single figures, upsampled up to 2×. Profile axes average the three figures; density comes from the whole painting.',
      findings:[
        'The most modulated line measured anywhere in the atlas: stroke CV 0.87 on the hatted man, 0.5–0.6 on the others.',
        'Width range inside one figure up to 19× (10th to 90th percentile) — hairline robe edges against the brim\'s brush mass.',
        'Solid brush masses carry half the ink in the heaviest figure (52% of ink in solid areas).',
        'Low ink coverage (13%) and low mirror symmetry (0.36–0.44): figures turn, lean and carry things.',
        'Black on white; colour under 1% of pixels.'
      ],
      axes:{density:.36,weight:.29,uniformity:.09,geometry:.17,symmetry:.17,fill:.57,chroma:0,ornament:.38},
      samples:[
        {label:'Whole painting',strokeRel:.004,strokeCV:.448,coverage:.129,solidFrac:.36,bilateral:.4,rotational:.23,folds:16,dots:19},
        {label:'Figure with tall hat (left)',strokeRel:.0234,strokeCV:.495,coverage:.141,solidFrac:.134,bilateral:.36,rotational:.31,folds:16,dots:8},
        {label:'Figure with broad brim',strokeRel:.0128,strokeCV:.866,coverage:.213,solidFrac:.521,bilateral:.44,rotational:.4,folds:16,dots:15},
        {label:'Tall figure (right)',strokeRel:.0256,strokeCV:.613,coverage:.214,solidFrac:.19,bilateral:.38,rotational:.34,folds:16,dots:8}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'mongol-khee',family:'mongolia',provenance:'curated',
  name:'Khee ornament',sub:'Painted ram\'s-horn ornament',native:'Монгол хээ',
  region:'Across Mongolia',medium:'Painted wood (ger doors, chests, furniture); also felt, leather, silver',period:'Centuries old; living',
  summary:'Mongolian ornament (khee) is built from a handful of units — the ugalz ram\'s-horn scroll, the alkhan hammer fret, the ölzii endless knot, cloud scrolls — repeated in strict symmetry and painted in strong flat colour on doors, chests and roof rings of the ger.',
  axes:{density:.75,weight:.45,uniformity:.7,geometry:.55,symmetry:.95,fill:.9,chroma:.85,ornament:.8,abstraction:.95,narrative:.05},
  genes:{
    structure:{kinds:['panel','medallion','field'],folds:8,density:.6,symmetry:'bilateral',borderBands:2},
    motifs:{hero:['ugalz','ulzii'],ring:['ugalz','ulzii'],filler:['ugalz','floret','dot'],border:['alkhan','scrollBand'],petal:'drop'},
    line:{weight:2.2,contrast:.3,double:false,wobble:.06,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:.1,echo:.55,echoCount:2,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#c9472a',ink:'#1a1410',fills:['#1f5fa8','#2e8b57','#f2c12e','#f5f1e6','#e58a2b'],gap:'#c9472a'},
    ground:{kind:'board',amount:.3}
  },
  rules:[
    'Build everything from a few units — ugalz scroll, alkhan hammer fret, ölzii knot, cloud scroll — repeated in strict mirror or radial symmetry.',
    'Draw bands, not lines: scrolls are wide outlined bands, often stepped inside from light to dark.',
    'Frame every panel with a hammer-fret or running-scroll border.',
    'Use strong flat colours with meaning: blue for the eternal sky, red for fire, white for milk and purity, yellow, green for grassland.'
  ],
  symbolism:'Ugalz (ram\'s horn) for strength and plenty; ölzii (endless knot) for happiness without end; the hammer fret (alkhan) for strength and protection; continuous frets for long life.',
  care:'The ölzii is one of the eight auspicious signs of Buddhism and is used everywhere in Mongolia as ornament. The svastika also appears in Mongolian pattern; as in the India family, it is not generated.',
  reading:[]
});

defTradition({
  id:'shirdeg',family:'mongolia',provenance:'curated',
  name:'Shirdeg',sub:'Quilted felt with cord appliqué',native:'Ширдэг',
  region:'Mongolian steppe',medium:'Layered felt quilted with dense running stitch; couched cord outlines',period:'Traditional; living',
  summary:'Felt mats and rugs for the ger floor, made by layering felt and quilting it with dense parallel rows of stitching. Decorative shirdeg add ugalz scrolls and fret borders outlined in couched cord — a raised double line — over cream, brown, red and blue felt.',
  axes:{density:.7,weight:.55,uniformity:.85,geometry:.5,symmetry:.95,fill:.6,chroma:.5,ornament:.7,abstraction:.95,narrative:0},
  genes:{
    structure:{kinds:['panel','medallion','field'],folds:8,density:.55,symmetry:'bilateral',borderBands:2},
    motifs:{hero:['ugalz','ulzii'],ring:['ugalz'],filler:['ugalz','dot'],border:['alkhan','scrollBand','lines'],petal:'drop'},
    line:{weight:2.6,contrast:.1,double:true,wobble:.3,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:.6,stitch:.4},coverage:.7,hatchGap:5},
    ornament:{dotRows:0,echo:.3,echoCount:1,echoStyle:'stitch',scallops:0,halo:0,gems:null,groundStitch:true},
    palette:{ground:'#ece2cc',ink:'#3a2a22',fills:['#a93226','#2c3e70','#6b4a32','#ece2cc'],gap:'#c8b48f'},
    ground:{kind:'cloth',amount:.6}
  },
  rules:[
    'Layer the felt and quilt it with dense parallel rows of running stitch; the stitching covers the whole ground.',
    'Outline scrolls and borders with twisted cord couched onto the felt — a raised double line.',
    'Lay out a central medallion or a field of ram\'s-horn scrolls, framed by hammer-fret or scroll borders.',
    'Felt colours: natural cream and brown, with dyed red and blue panels.'
  ],
  symbolism:'Felt is the material of the ger itself; the quilted floor mat is made communally and its ram\'s-horn scrolls carry wishes for flocks and plenty.',
  reading:[]
});
