'use strict';
/* India — first culture family. Two traditions are ANALYZED (built from reference images
   supplied for the purpose, with Lab measurements); the rest are CURATED from art-historical
   knowledge and await reference images to verify against. */

defFamily({id:'india',name:'India',native:'भारत',
  blurb:'Twenty-one visual traditions, from threshold drawings redrawn every dawn to court illumination: line-led folk painting, textile logic, temple ornament, the modern icon set, and five contemporary ways of drawing the gods.'});

const INK='#1b1714';

defTradition({
  id:'deepavali-icon',family:'india',provenance:'analyzed',
  name:'Festive line icons',sub:'Dīpāvalī icon set',native:'दीपावली',
  region:'Pan-Indian, digital',medium:'Vector outline icons',period:'Contemporary (2010s–)',
  summary:'The contemporary shorthand for Dīpāvalī: single-weight outline emblems — lamps, lotus, fireworks, sweets, the full pot — drawn for screens. It borrows its motifs from devotional and folk art but reduces them to a monoline grammar of rounded strokes, deliberate gaps and dotted accents.',
  axes:{density:.22,weight:.45,uniformity:.95,geometry:.45,symmetry:.85,fill:.03,chroma:.02,ornament:.45,abstraction:.8,narrative:.1},
  genes:{
    structure:{kinds:['sheet','sheet','medallion'],folds:12,density:.25,symmetry:'bilateral',borderBands:0},
    motifs:{hero:['diya','lotusSide','kalasha','burst','lotusTop','sun','flame','star8'],ring:['flame','burst','lotusSide','floret'],filler:['dot','burst'],border:['dotRow'],petal:'pointed'},
    line:{weight:5,contrast:0,double:false,wobble:0,taper:0,breaks:.6,dash:null,misreg:0},
    fill:{modes:{none:1},coverage:0,hatchGap:7},
    ornament:{dotRows:.35,echo:.3,echoCount:1,echoStyle:'solid',scallops:0,halo:.45,gems:null,groundStitch:false},
    palette:{ground:'#fdfdfc',ink:'#6e6e70',fills:['#e9e6e0'],gap:'#fdfdfc'},
    ground:{kind:'none',amount:0}
  },
  rules:[
    'One pen width everywhere (about 1.5% of the icon width), rounded caps and joins, mid-grey ink on white — grey, not black, keeps the set soft.',
    'Break closed contours with one small gap. The gap reads as a highlight and keeps the icon light.',
    'Carry ornament with rows of dots inside bands (lamp bowls, mandala tiers, a trunk) instead of fills.',
    'Glow becomes concentric broken arcs; sparkle becomes radiating lines tipped with dots.',
    'Flames are always a teardrop with an inner echo teardrop.',
    'Frontal, mostly mirror-symmetric emblems centred in a square cell with roughly 75–85% white space. People are faceless, identified only by bindi, earrings or turban.'
  ],
  symbolism:'Lamp — light over darkness. Lotus — Lakṣmī\'s seat, prosperity. Coin and gold bars — the Lakṣmī pūjā of wealth. Full pot — abundance. Sweets (laḍḍū, barfi, the jalebi spiral) — gifts exchanged between households. Star lantern (ākāś kandīl) hung outside the house. The calendar marks the new-moon night of Kārttika.',
  care:'The sheet sets Om and the svastika — sacred signs — beside commercial icons. They are documented here but excluded from every generator and from the Mixer. The svastika is a Hindu, Jain and Buddhist sign of well-being; it should not be flattened into a decorative unit.',
  analysis:{
    source:'Stock line-icon sheet, 25 Dīpāvalī emblems in a 5×5 grid (watermarked stock reference image; analysed locally, not stored).',
    observations:[
      'One stroke weight across all 25 icons; no tonal fills anywhere — only small solid dots.',
      'Contours are deliberately broken by short gaps on lamps, lotus, calendar frames and the mandala quarter.',
      'Dot rows act as the only "texture": inside lamp bowls, along mandala tiers, down the elephant trunk, around the crown, beside the coin.',
      'Glow is drawn as two or three broken concentric arcs behind a flame (hand-held candle, decorative lamp).',
      'Mirror symmetry dominates (lotus, lamps, tiered lamp-stand, star lantern); radial symmetry only for fireworks and the mandala.',
      'The two human figures are faceless; identity rests on bindi, earrings, hair parting, turban.',
      'Three registers share one line: devotional (elephant-headed deity, Om, svastika), festive (fireworks, balloons, gifts) and commercial (rupee coin, gold bars, sweet boxes, calendar).'
    ],
    measured:{
      note:'Lab measurements on crops of the reference sheet: three single icons (upsampled 2× so 4–6px strokes resolve) and the whole sheet with the watermark banner cropped off. Profile axes use the single-icon average; density comes from the whole sheet.',
      findings:[
        'True monoline: stroke-width variation (CV) 0.04–0.05 on single icons — the lowest of any sample measured.',
        'Heavy for an icon set: strokes are 3.7–5% of the icon\'s size.',
        'Ink is mid-grey (#6e6e70), not black — confirmed on every crop.',
        'Strict mirror symmetry on emblems (lotus 0.88, firework 0.97); the lamp drops to 0.59 because of its spout.',
        'Low complexity: about 8 icon-widths of line per icon, against 21–45 for the devotional drawings.'
      ],
      axes:{density:.54,weight:.67,uniformity:1,geometry:.2,symmetry:.84,fill:0,chroma:.01,ornament:.25},
      samples:[
        {label:'Whole sheet (25 icons)',strokeRel:.0071,strokeCV:.088,coverage:.2,solidFrac:0,bilateral:.71,rotational:.35,folds:4,dots:261},
        {label:'Lotus',strokeRel:.0499,strokeCV:.042,coverage:.291,solidFrac:0,bilateral:.88,rotational:.39,folds:16,dots:3},
        {label:'Decorated lamp',strokeRel:.042,strokeCV:.048,coverage:.296,solidFrac:0,bilateral:.59,rotational:.43,folds:16,dots:37},
        {label:'Firework burst',strokeRel:.0369,strokeCV:.053,coverage:.273,solidFrac:0,bilateral:.97,rotational:.37,folds:4,dots:19}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'devotional-line-art',family:'india',provenance:'analyzed',
  name:'Devotional line art',sub:'Mūrti iconography in outline',native:'मूर्ति',
  region:'Pan-Indian (temple image → print and clip-art)',medium:'Pen / vector outline drawing',period:'Iconographic canon from c. 5th c.; this outline register modern',
  summary:'Outline drawings of temple images (mūrti) — here a sheet of eleven Gaṇeśa forms. The line is an engraver\'s contour: clean, mostly even, with no shading. What makes it Indian is not the line but the iconographic grammar it carries: fixed attributes, hand-gestures, postures, crowns, pedestals and halos, as prescribed in the śilpa-śāstra texts.',
  axes:{density:.45,weight:.35,uniformity:.7,geometry:.2,symmetry:.7,fill:.03,chroma:0,ornament:.78,abstraction:.45,narrative:.35},
  genes:{
    structure:{kinds:['shrine'],folds:12,density:.45,symmetry:'bilateral',borderBands:0},
    motifs:{hero:['ganeshaSeated','vishnu','shiva','lakshmi','saraswati','rama','krishnaFlute','hanumanSeated','durga','kali','hanumanFlying'],ring:['padmaKara','sudarshana','shankha','trishul','gada','kodanda','flame','lotusSide','floret'],filler:['floret','bud','spiral','dot'],border:['petalRow','dotRow'],petal:'round'},
    line:{weight:2.6,contrast:.55,double:false,wobble:.08,taper:.35,breaks:0,dash:null,misreg:0},
    fill:{modes:{none:1},coverage:0,hatchGap:6},
    ornament:{dotRows:.5,echo:.55,echoCount:2,echoStyle:'solid',scallops:.45,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#ffffff',ink:'#161616',fills:['#f1f1f1'],gap:'#ffffff'},
    ground:{kind:'none',amount:0}
  },
  rules:[
    'Contour only, black on white; the outer silhouette a little heavier than interior lines.',
    'Concentrate ornament in fixed zones — crown (mukuṭa), necklaces, armlets, belt, pedestal — and leave body planes open. The contrast between dense jewellery and plain surfaces is the style.',
    'Build crowns as stacked tiers tapering to a finial; the tiered, pot-like karaṇḍa-mukuṭa is the crown typical of Gaṇeśa.',
    'Seat the figure on a lotus pedestal (padmapīṭha) or a draped plinth; back it with an arch or a flame-edged halo (prabhāvalī), or inscribe it in a pipal-leaf silhouette.',
    'Choose the pose from a small set: seated at ease with one leg pendant (lalitāsana), cross-legged (padmāsana), or dancing (nṛtya) with the body flexed in S-curves (bhaṅga).',
    'Each hand holds a prescribed attribute; one shows abhaya-mudrā, the raised palm meaning "fear not".'
  ],
  conventions:[
    ['Four arms','caturbhuja — more arms signal more powers, each with an attribute'],
    ['Goad and noose','aṅkuśa and pāśa — to steer and to bind obstacles'],
    ['Axe','paraśu'],['Lotus','padma, held aloft'],['Bowl of sweets','modaka-pātra; the trunk often reaches into it'],
    ['Single tusk','ekadanta — the other broken'],['Pot belly','lambodara, often girdled by a snake'],
    ['Raised palm','abhaya-mudrā'],['Tiered crown','karaṇḍa-mukuṭa'],['Tall conical crown','kirīṭa-mukuṭa — the tallest crown class, a tapering cap with jewelled bands and a pointed finial, marking royal or exalted status (Viṣṇu, kings); not deity-exclusive'],
    ['Lotus pedestal','padmapīṭha; draped plinths in seated forms'],['Halo','prabhāvalī with flame tips — a metal arch still cast for shrines today; prabhāmaṇḍala is the radiating disc of light behind the head, built from tiers of petals, rays and beads'],['Leaf frame','the figure inscribed in a pipal (aśvattha) leaf']
  ],
  symbolism:'Gaṇeśa is the remover of obstacles, invoked at the start of any undertaking; the sweet (modaka) is commonly read as the sweetness of realisation.',
  care:'Deity images are objects of worship. The generator places a simplified, original Gaṇeśa (or a lotus, full pot or lamp) in the shrine arch on the lotus pedestal — upright, unmirrored, never used as a repeating unit. Specific temple images and their exact iconometry are documented here, not reproduced.',
  analysis:{
    source:'Stock sketch sheet of eleven Gaṇeśa line drawings in varied poses (watermarked stock reference image; analysed locally, not stored).',
    observations:[
      'Pure contour, black on white, no hatching or tone; outer silhouettes visibly heavier than inner detail.',
      'Ornament density is zoned: crowns, necklaces, armlets, belts and pedestals are dense with beads, petals and scrolls, while bellies, faces and limbs stay open.',
      'Crowns are tall and tiered (karaṇḍa type), with side flares and a finial.',
      'Seats vary — lotus pedestal, draped stool, plain plinth — and one figure is framed by a pipal-leaf outline, another by a flame halo.',
      'Poses: standing, seated at ease, cross-legged, dancing; the dancing forms swing the torso and hips in opposing curves.',
      'Attributes repeat across figures: lotus, bowl of sweets, axe, goad, noose; one hand raised in abhaya.',
      'Drapery ends and sashes finish in curling flourishes — the only place the line swells.'
    ],
    measured:{
      note:'Lab measurements on three single figures (upsampled up to 2×) and the whole sheet. The faint diagonal watermark falls below the ink threshold. Profile axes use the single-figure average.',
      findings:[
        'Variable line: stroke CV ≈0.33 on every figure — the outer contour is measurably heavier than interior detail.',
        'Hair-fine: strokes are 0.5–1.2% of figure height, about a tenth of the icon set\'s relative weight.',
        'Near-black ink (#282727) on white; no fills or tone (solid ink under 1.5%).',
        'Frontal but not mirror-exact: mirror IoU ≈0.6, because limbs, attributes and trunk differ left to right.',
        'Very high line complexity: 21–45 figure-widths of line per figure, concentrated in crowns, jewellery and pedestals.',
        'Sarasvatī line art (a later reference) measures within 0.20, with a more even vector line (CV 0.14) and a near-perfectly mirrored face (0.96); a Kerala-mural Gaṇeśa drawing measures within 0.10.',
        'Validated on unseen images: later Kṛṣṇa (with flute) and Hanumān (with mace) fine-line drawings from different stock bundles measured within 0.08–0.10 of this profile — the closest match in the atlas.'
      ],
      axes:{density:.47,weight:.07,uniformity:.58,geometry:.25,symmetry:.46,fill:.02,chroma:.01,ornament:.58},
      samples:[
        {label:'Whole sheet (11 figures)',strokeRel:.0024,strokeCV:0,coverage:.153,solidFrac:0,bilateral:.61,rotational:.28,folds:16,dots:271},
        {label:'Standing, four-armed',strokeRel:.0047,strokeCV:.335,coverage:.175,solidFrac:.013,bilateral:.6,rotational:.25,folds:16,dots:45},
        {label:'Seated on draped plinth',strokeRel:.0046,strokeCV:.334,coverage:.14,solidFrac:.012,bilateral:.6,rotational:.16,folds:11,dots:21},
        {label:'Seated on lotus',strokeRel:.0117,strokeCV:.317,coverage:.181,solidFrac:.002,bilateral:.45,rotational:.33,folds:16,dots:16},
        {label:'Sarasvatī with vīṇā (later sheet)',strokeRel:.0031,strokeCV:.14,coverage:.128,solidFrac:0,bilateral:.76,dots:42},
        {label:'Sarasvatī — face and crown',strokeRel:.013,strokeCV:.12,coverage:.308,solidFrac:0,bilateral:.96,dots:4},
        {label:'Kerala-mural Gaṇeśa drawing',strokeRel:.009,strokeCV:.32,coverage:.285,solidFrac:.01,bilateral:.64,dots:21}
      ]
    }
  },
  reading:[
    'T. A. Gopinatha Rao, Elements of Hindu Iconography (1914–16)',
    'Alice Getty, Gaṇeśa: A Monograph on the Elephant-Faced God (1936)'
  ]
});

defTradition({
  id:'madhubani',family:'india',provenance:'curated',
  name:'Madhubani',sub:'Mithila painting',native:'मधुबनी',
  region:'Mithila, Bihar (and Janakpur, Nepal)',medium:'Wall and floor painting by women; on handmade paper since the late 1960s',period:'Living tradition',
  summary:'Painted by the women of Mithila on the walls of the marriage chamber (kohbar) and for festivals, and moved onto paper during the drought-relief years of the late 1960s. Its signatures are the double outline and the refusal to leave empty ground: every gap is closed with fish, flowers, leaves or hatching.',
  axes:{density:.95,weight:.45,uniformity:.75,geometry:.4,symmetry:.7,fill:.85,chroma:.85,ornament:.7,abstraction:.7,narrative:.7},
  genes:{
    structure:{kinds:['panel','panel','medallion'],folds:8,density:.95,symmetry:'bilateral',borderBands:2},
    motifs:{hero:['fish','tree','sun','lotusTop','bird'],ring:['fish','lotusTop','floret','leaf'],filler:['floret','leaf','bud','dot','fish'],border:['hatchBand','zigzag','leafVine','scallop'],petal:'pointed'},
    line:{weight:1.9,contrast:.25,double:true,wobble:.55,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:.55,hatch:.3,crosshatch:.15},coverage:.95,hatchGap:5.5},
    ornament:{dotRows:.2,echo:.25,echoCount:2,echoStyle:'solid',scallops:.15,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#f2e6c8',ink:INK,fills:['#c8312a','#efb12a','#2e7a3f','#1f4f92','#df6590','#ef8a26'],gap:'auto'},
    ground:{kind:'paper',amount:.55}
  },
  rules:[
    'Draw every contour as a double line; leave the gap blank or fill it with one colour.',
    'Fill each region with flat, unmixed colour (the bharnī style) or with fine black hatching (kachnī); alternate hatch direction between neighbouring regions.',
    'Frame the panel with borders of triangles, hatched bands or leaf vines.',
    'Close the remaining ground with small fillers — florets, leaves, fish, dots. Empty space reads as unfinished.',
    'Animals and people are flat and diagrammatic, with large eyes; fish come in pairs and bodies carry their own patterns.',
    'Natural, unshaded colour: lampblack, turmeric, vermilion, leaf green, indigo, pink.'
  ],
  symbolism:'Paired fish — fertility and good fortune, central to the kohbar marriage painting with the bamboo grove and lotus pond. Sun and moon attend as witnesses. Parrots stand for love, turtles for longevity.',
  reading:['Jyotindra Jain, Ganga Devi: Tradition and Expression in Mithila Painting (1997)']
});

defTradition({
  id:'warli',family:'india',provenance:'curated',
  name:'Warli',sub:'Adivasi wall painting',native:'वारली',
  region:'Thane and Palghar, Maharashtra',medium:'White rice paste on red-ochre or mud walls; now cloth and paper',period:'Living tradition; widely known since the 1970s',
  summary:'The Warli paint with white rice paste on the ochre-washed mud wall of the house, using a chewed bamboo stick. Everything is built from three marks — circle (sun, moon), triangle (mountains, trees) and square (the chauk, a sacred enclosure). The scenes show village life, harvest and the tārpā dance spiralling around its musician.',
  axes:{density:.4,weight:.35,uniformity:.9,geometry:.85,symmetry:.5,fill:.35,chroma:.05,ornament:.1,abstraction:.95,narrative:.85},
  genes:{
    structure:{kinds:['dance','dance','panel'],folds:16,density:.45,symmetry:'radial',borderBands:1},
    motifs:{hero:['sun','tree'],ring:['warliFigure'],filler:['warliFigure','tree','bird','dot'],border:['zigzag','dotRow'],petal:'pointed'},
    line:{weight:2.1,contrast:0,double:false,wobble:.45,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:.95,hatchGap:6},
    ornament:{dotRows:.1,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#7b3b22',ink:'#f3ece0',fills:['#f3ece0'],gap:'#7b3b22'},
    ground:{kind:'mud',amount:.75}
  },
  rules:[
    'Monochrome: white on red-brown earth, never shaded, with no outlines inside the white shapes.',
    'A body is two triangles meeting at the waist, a circle head and stick limbs; everyone is drawn at the same scale.',
    'Repeat figures in chains and spirals. Motion comes from repetition and small changes in limb angle.',
    'Lines are thin and slightly irregular — painted with a stick, not a pen.',
    'Scenes spread over the wall without one focal point; the square chauk holds the most sacred image.'
  ],
  symbolism:'Circle and triangle stand for sun and moon, mountain and tree. The tārpā dance spiral — dancers linked around the musician — is read as the circle of life. The marriage chauk holds the fertility goddess Pālaghāṭā.',
  reading:['Yashodhara Dalmia, The Painted World of the Warlis (1988)']
});

defTradition({
  id:'gond',family:'india',provenance:'curated',
  name:'Gond',sub:'Pardhan Gond painting',native:'गोंड',
  region:'Patangarh and Bhopal, Madhya Pradesh',medium:'Acrylic or ink on canvas and paper; earlier floor and wall painting',period:'Contemporary form from the early 1980s',
  summary:'Pardhan Gond artists turned the clan\'s bardic stories and wall-painting marks into a contemporary art, beginning with Jangarh Singh Shyam at Bharat Bhavan in the early 1980s. Animals, trees and spirits are drawn as bold flat silhouettes, then filled with a personal "signature" pattern of dots, dashes, scales or lines that makes the surface vibrate.',
  axes:{density:.8,weight:.4,uniformity:.8,geometry:.3,symmetry:.4,fill:.95,chroma:.95,ornament:.9,abstraction:.6,narrative:.6},
  genes:{
    structure:{kinds:['panel'],folds:8,density:.6,symmetry:'free',borderBands:0},
    motifs:{hero:['tree','bird','fish','leaf'],ring:['leaf','bird','fish'],filler:['dot','leaf','spiral','bud'],border:['dotRow'],petal:'drop'},
    line:{weight:2,contrast:.2,double:false,wobble:.25,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{dots:.4,dashes:.4,flat:.2},coverage:1,hatchGap:6},
    ornament:{dotRows:.25,echo:.65,echoCount:2,echoStyle:'dotted',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#fbf6ea',ink:'#141414',fills:['#e64a3b','#f5b331','#38a39d','#2a5ea8','#8cbf3f','#e66ca6','#7a4f9f'],gap:'#fbf6ea'},
    ground:{kind:'canvas',amount:.25}
  },
  rules:[
    'Draw a confident silhouette, then fill it completely with flat, bright colour.',
    'Overlay the colour with one repeated mark — dots, dashes, chevrons, seeds — in a contrasting colour. Each artist\'s mark is a signature.',
    'Run bands parallel to the contour (echo lines) before filling the centre.',
    'Leave the ground white and open around the creature; there is little or no background.',
    'Compose freely and asymmetrically; animals and trees can merge into one another.'
  ],
  symbolism:'Trees, animals and spirits of the forest carry clan stories (the Pardhan were the Gond\'s bards). The signature fill pattern identifies the painter as much as the subject.',
  reading:['Bhajju Shyam, Durga Bai and Ram Singh Urveti, The Night Life of Trees (Tara Books, 2006)','Bhajju Shyam, The London Jungle Book (Tara Books, 2004)']
});

defTradition({
  id:'kalamkari',family:'india',provenance:'curated',
  name:'Kalamkari',sub:'Pen-drawn and dyed cotton',native:'కలంకారీ',
  region:'Srikalahasti and Machilipatnam, Andhra Pradesh',medium:'Hand-drawn (kalam pen) or block-printed cotton, mordant dyes',period:'Centuries old; a major export textile in the 17th–18th c.',
  summary:'"Pen-work": cotton drawn with a bamboo kalam dipped in iron-black, then dyed through mordants into madder reds, indigo and myrobalan yellows. The Srikalahasti school draws temple narratives freehand in registers. The Machilipatnam school block-prints Persian-influenced florals, trees of life and paisleys — the chintz Europe once imported by the shipload.',
  axes:{density:.8,weight:.4,uniformity:.5,geometry:.2,symmetry:.7,fill:.8,chroma:.6,ornament:.7,abstraction:.45,narrative:.85},
  genes:{
    structure:{kinds:['panel','panel','field'],folds:8,density:.75,symmetry:'bilateral',borderBands:2},
    motifs:{hero:['tree','paisley','lotusTop','bird'],ring:['paisley','floret','leaf','bud'],filler:['floret','bud','leaf','dot'],border:['leafVine','diamond','scallop'],petal:'drop'},
    line:{weight:1.9,contrast:.35,double:false,wobble:.3,taper:.45,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:.85,hatch:.15},coverage:.9,hatchGap:5},
    ornament:{dotRows:.2,echo:.35,echoCount:1,echoStyle:'solid',scallops:.25,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#efe1c3',ink:'#1e1714',fills:['#a8322d','#2e3f6e','#c9962f','#4f6b3a','#6b3a2a'],gap:'#efe1c3'},
    ground:{kind:'cloth',amount:.5}
  },
  rules:[
    'Draw a fluid black outline first — the kalam swells and thins — then fill regions with dyed colour, never shaded.',
    'Keep to the dye palette: madder red, indigo, yellow, green (yellow over indigo) and iron black on unbleached cream.',
    'Narrative panels run in horizontal registers with captions (Srikalahasti); floral and tree-of-life fields run all over the cloth (Machilipatnam).',
    'Frame everything with borders of floral vines and lozenges.',
    'Add fine interior lines — veins, folds, jewellery — in black over the colour.'
  ],
  symbolism:'Tree of life, lotus, paisley and peacock for the export chintz; epics (Rāmāyaṇa, Mahābhārata) and temple legends for the Srikalahasti hangings.',
  reading:['John Irwin and Katharine B. Brett, Origins of Chintz (V&A, 1970)']
});

defTradition({
  id:'pattachitra',family:'india',provenance:'curated',
  name:'Pattachitra',sub:'Odisha cloth painting',native:'ପଟ୍ଟଚିତ୍ର',
  region:'Raghurajpur and Puri, Odisha',medium:'Mineral and organic colour on chalk- and gum-primed cloth',period:'Tied to the Jagannātha temple; centuries old',
  summary:'Cloth painting by the chitrakar families around Puri, bound to the Jagannātha temple. The cloth is primed with chalk and tamarind gum and burnished; colour is laid flat inside a firm black line, and every painting is wrapped in ornate floral borders. Red grounds, large-eyed profiles and dense decoration define it.',
  axes:{density:.85,weight:.45,uniformity:.55,geometry:.35,symmetry:.8,fill:.9,chroma:.8,ornament:.8,abstraction:.55,narrative:.85},
  genes:{
    structure:{kinds:['panel','shrine'],folds:8,density:.85,symmetry:'bilateral',borderBands:3},
    motifs:{hero:['krishnaFlute','vishnu','rama','lakshmi','lotusTop','bird','fish','tree','kalasha'],ring:['floret','lotusTop','lotusSide'],filler:['floret','bud','dot','leaf'],border:['petalRow','scallop','leafVine','zigzag'],petal:'pointed'},
    line:{weight:1.8,contrast:.45,double:false,wobble:.12,taper:.3,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:.95,hatchGap:6},
    ornament:{dotRows:.45,echo:.2,echoCount:1,echoStyle:'solid',scallops:.35,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#a8291f',ink:'#141414',fills:['#e9b730','#f4ecd8','#1b2f5e','#2f7d4a','#d6452f'],gap:'#a8291f'},
    ground:{kind:'cloth',amount:.35}
  },
  rules:[
    'Prime and burnish the ground; paint the borders first and the centre last.',
    'Use flat colour fields only — red, yellow, conch white, lamp-soot black, with indigo and green accents.',
    'Keep black contours firm and steady, with no shading.',
    'Wrap the image in several concentric borders of petals, scallops and vines; florets in the corners.',
    'Compose bilaterally, frontally and hieratically, with dense floral filling.'
  ],
  symbolism:'Jagannātha, Balabhadra and Subhadrā, the Kṛṣṇa līlā and the Daśāvatāra are core subjects; lotus and floral borders frame them.',
  care:'Many paṭas are temple icons. Generators here reuse only borders, florals and composition.',
  reading:[]
});

defTradition({
  id:'tanjore',family:'india',provenance:'analyzed',
  name:'Tanjore',sub:'Thanjavur gesso and gold',native:'தஞ்சாவூர் ஓவியம்',
  region:'Thanjavur, Tamil Nadu',medium:'Cloth on board, chalk gesso relief, gold foil, glass and stones',period:'Flourished at the Maratha court of Thanjavur, 18th–19th c.; living',
  summary:'Devotional panels on cloth-covered board. Arches, crowns, jewellery and weapons are built up in gesso relief, covered in gold foil and set with coloured glass, against a deep navy ground. A single frontal deity sits enthroned under a parasol inside a gold arch, with offerings and standing lamps at its feet.',
  axes:{density:.95,weight:.1,uniformity:.52,geometry:.17,symmetry:.96,fill:1,chroma:.59,ornament:1,abstraction:.35,narrative:.4},
  genes:{
    structure:{kinds:['shrine'],folds:12,density:.7,symmetry:'bilateral',borderBands:1,canopy:.85,offerings:.85},
    motifs:{hero:['vishnu','lakshmi','durga','krishnaFlute','ganeshaSeated','saraswati','rama','hanumanSeated','shiva'],ring:['flame','floret','lotusSide'],filler:['dot','floret'],border:['dotRow','scallop'],petal:'round'},
    line:{weight:2.2,contrast:.3,double:false,wobble:.04,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{gold:.6,flat:.4},coverage:.98,hatchGap:6},
    ornament:{dotRows:.75,echo:.25,echoCount:1,echoStyle:'solid',scallops:.3,halo:0,gems:['#cf3725','#1f7a4e','#f3ead2'],groundStitch:false},
    palette:{ground:'#2a2f45',ink:'#3b2812',fills:['#cf3725','#dfd0af','#47a7ce','#1f7a4e','#d24b35'],gap:'#2a2f45',metal:'#c9a24a',skin:'#e6c094',animal:'#e2a65c',seat:'#e8939a',hair:'#2b1d14'},
    ground:{kind:'board',amount:.2}
  },
  rules:[
    'One central deity, frontal and symmetric, enthroned inside a gold arch that is edged with relief scrolls and set with glass gems.',
    'Raise every ornament — crown, necklaces, weapons, arch, parasol — in chalk gesso, then lay gold foil over it; dot the edges with gesso pearls.',
    'Lay the ground in deep navy, with a red floor band beneath the throne.',
    'Paint the figure flat and bright: warm skin, a vermilion sari or dhoti, turquoise and green accents; outline in dark brown, never black.',
    'Shelter the deity with a gold parasol, and set offerings at the foot: full pots with mango leaves, fruit and coconut, a tall brass lamp at each side.'
  ],
  conventions:[
    ['Durgā','Rides a tiger; eight or ten arms with trident, discus, sword, conch, bow and arrow, mace, bell; one hand raised in abhaya; red sari; seated at ease with one leg pendant.'],
    ['Kṛṣṇa','Dark-blue skin, yellow garment, peacock feather, flute; as a child often crawling with a ball of butter.'],
    ['Gaṇeśa','Seated on a lotus or throne, four arms, modaka, mouse at his feet.'],
    ['Sarasvatī','Seated on a white lotus, playing the vīṇā, with book and rosary; peacock or swan beside her.'],
    ['Court','Parasol (chattra) above; pillared or arched gold frame; kalaśas, fruit, coconut and a standing lamp (kuthuvilakku) at the foot.']
  ],
  symbolism:'Gold signals divinity and wealth; the arch is the shrine, the parasol royalty, the full pots abundance and welcome. Durgā on her tiger is protection against every evil; Kṛṣṇa, Gaṇeśa and Sarasvatī are equally common subjects.',
  care:'These are devotional icons. The generator enthrones a simplified Durgā, Kṛṣṇa, Gaṇeśa or Sarasvatī in the gold arch — upright, unmirrored — and blends like everything else; specific temple images are not reproduced.',
  analysis:{
    source:'A Tanjore painting of Durgā on her tiger, framed (reference image; analysed locally, not stored).',
    observations:[
      'Deep navy ground with a red floor band; a gold relief arch with scrolling crests and green and red glass gems frames the deity.',
      'Durgā sits at ease on a striped tiger, one leg pendant, eight arms fanned with trident, discus, sword, mace, bow, conch and bell; one hand raised in abhaya.',
      'A gold parasol hangs above the crown; a sun-disc halo glows behind the head.',
      'Skin warm cream, sari vermilion with gold borders, turquoise and green accents; outlines dark brown.',
      'At the foot: three full pots with mango leaves, fruit, coconut and a tall standing lamp.',
      'Every gold edge is beaded with raised gesso pearls.'
    ],
    measured:{
      note:'Lab measurements on the whole painting, the figure, the arch and the tiger (upsampled up to 2×). Profile axes average the three crops; density and symmetry use the whole painting.',
      findings:[
        'Measured palette: navy #2a2f42 (24% of the painting), gold #c2a576 and #988152 (36%), dark brown #685238 (15%), vermilion #d24b35 (14%), cream #dfd0af (12%); the figure adds skin #e1bb8c and turquoise #47a7ce. The earlier curated profile had guessed a red ground — corrected.',
        'Strongly symmetric composition: mirror IoU 0.97 for the whole painting.',
        'Solid colour everywhere: over half the ink-dark pixels are filled areas; colour axis 0.47–0.71.',
        'Heavy gesso beading: 354 small round dots detected across the painting, 158 on the arch alone.',
        'Fine outlines (0.3–0.8% of the image) with mixed weight (CV 0.29–0.52).'
      ],
      axes:{density:.95,weight:.06,uniformity:.52,geometry:.17,symmetry:.96,fill:1,chroma:.59,ornament:1},
      samples:[
        {label:'Whole painting',strokeRel:.0032,strokeCV:.36,coverage:.527,solidFrac:.52,bilateral:.97,dots:354},
        {label:'Durgā',strokeRel:.0052,strokeCV:.43,coverage:.496,solidFrac:.55,bilateral:.78,dots:195},
        {label:'Gold arch',strokeRel:.0076,strokeCV:.29,coverage:.427,solidFrac:.54,bilateral:.9,dots:158},
        {label:'Tiger',strokeRel:.0072,strokeCV:.52,coverage:.42,solidFrac:.27,bilateral:.68,dots:136}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'kolam',family:'india',provenance:'curated',
  name:'Kolam',sub:'Threshold line drawing',native:'கோலம்',
  region:'Tamil Nadu and across South India',medium:'Rice flour or stone powder on the swept threshold, drawn daily',period:'Living daily practice',
  summary:'Drawn at dawn by women at the threshold, with rice flour let fall between the fingers. A grid of dots (pulli) comes first; lines then loop around the dots without lifting. The sikku ("knotted") kolam is ideally one continuous line that returns to its start. It is worn away by footsteps and remade the next day — and the rice feeds ants and birds.',
  axes:{density:.5,weight:.7,uniformity:.9,geometry:.7,symmetry:.95,fill:0,chroma:.05,ornament:.3,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['kolam'],folds:8,density:.6,symmetry:'radial',borderBands:0},
    motifs:{hero:['floret','lotusTop'],ring:['floret','lotusTop'],filler:['dot','floret'],border:['dotRow','lines'],petal:'round'},
    line:{weight:4.6,contrast:0,double:false,wobble:.35,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{none:1},coverage:0,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#3e322a',ink:'#f6f1e6',fills:['#f6f1e6','#d6453b','#f2b632'],gap:'#3e322a'},
    ground:{kind:'mud',amount:.6}
  },
  rules:[
    'Lay a symmetric grid of dots (square or diamond) first.',
    'Loop the line around the dots without touching them and without ending; between two dots it crosses straight through or turns back.',
    'Aim for a single closed line; the symmetry is usually four-fold.',
    'White on dark, swept earth; the line is as wide as a pinch of flour.',
    'Colour, and red kāvi borders, are added only for festivals.'
  ],
  maths:'Kolam loops can be generated as mirror curves (Paulus Gerdes): a ray travels diagonally between the dots and reflects off two-sided mirrors placed between neighbouring dots. The kolam generator here searches symmetric mirror layouts for one that yields a single line. Siromoney and colleagues also described kolam with array grammars in the 1970s.',
  symbolism:'An auspicious welcome at the threshold and a daily act of feeding other creatures; the unbroken line is read as the endless cycle of life.',
  reading:['Vijaya Nagarajan, Feeding a Thousand Souls: Women, Ritual and Ecology in India (Oxford UP, 2018)','Paulus Gerdes, Lunda Geometry: Mirror Curves, Designs, Knots, Polyominoes, Patterns, Symmetries','G. Siromoney, R. Siromoney and K. Krithivasan, "Array grammars and kolam", Computer Graphics and Image Processing (1974)']
});

defTradition({
  id:'rangoli',family:'india',provenance:'curated',
  name:'Rangoli',sub:'Festival floor colour',native:'रंगोली',
  region:'Across India (alpana in Bengal, muggu in Andhra, mandana in Rajasthan)',medium:'Coloured powders, rice and petals on the floor',period:'Living festival practice',
  summary:'The festival floor painting: radial designs outlined in white and filled with saturated powders — magenta, marigold, green, blue — made at Dīpāvalī and weddings to welcome guests and Lakṣmī. Where kolam is line, rangoli is colour: solid filled petals in concentric rings around a lamp or lotus.',
  axes:{density:.8,weight:.5,uniformity:.85,geometry:.5,symmetry:1,fill:1,chroma:1,ornament:.6,abstraction:.85,narrative:.05},
  genes:{
    structure:{kinds:['medallion'],folds:12,density:.85,symmetry:'radial',borderBands:0},
    motifs:{hero:['lotusTop','sun','diya'],ring:['lotusTop','paisley','floret','flame','leaf'],filler:['dot','floret','diya'],border:['dotRow'],petal:'pointed'},
    line:{weight:2.8,contrast:0,double:false,wobble:.18,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:.45,echo:.25,echoCount:1,echoStyle:'solid',scallops:.1,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#3b3534',ink:'#fbf7ef',fills:['#e6276f','#f7b500','#ff6f1a','#17a2a0','#6a3fb5','#2e9b4a','#2b65d9'],gap:'#3b3534'},
    ground:{kind:'powder',amount:.55}
  },
  rules:[
    'Build radially, 8- or 12-fold, ring by ring from the centre.',
    'Outline every shape in white, then fill it solid with pure, unmixed powder colour.',
    'Make adjacent rings contrast strongly in hue.',
    'Set lamps at the centre or around the rim.',
    'Finish the outer rim with fine dots and petal tips.'
  ],
  symbolism:'Welcome and auspiciousness at the threshold; lotus and lamp invite Lakṣmī into the house at Dīpāvalī.',
  reading:[]
});

defTradition({
  id:'mehndi',family:'india',provenance:'curated',
  name:'Mehndi',sub:'Bridal henna',native:'मेहंदी',
  region:'North and West India; across South Asia',medium:'Henna paste piped from a cone onto skin',period:'Ancient practice; bridal designs living',
  summary:'Henna paste piped from a cone leaves a reddish-brown stain in fine lines. Indian bridal mehndi is the densest form: a mandala on the palm, paisleys, peacocks, lotuses and nets of cross-hatching (jāl), each motif ringed by echo lines, scallops and dots.',
  axes:{density:.9,weight:.2,uniformity:.55,geometry:.3,symmetry:.85,fill:.35,chroma:.1,ornament:1,abstraction:.7,narrative:.15},
  genes:{
    structure:{kinds:['medallion','medallion','panel'],folds:12,density:.9,symmetry:'radial',borderBands:0,vine:.3},
    motifs:{hero:['lotusTop','paisley','sun'],ring:['paisley','lotusTop','leaf','floret','bird'],filler:['dot','bud','spiral','floret'],border:['scallop','dotRow','leafVine'],petal:'drop'},
    line:{weight:1.6,contrast:.45,double:false,wobble:.15,taper:.55,breaks:0,dash:null,misreg:0},
    fill:{modes:{none:.4,crosshatch:.3,hatch:.1,flat:.2},coverage:.65,hatchGap:5},
    ornament:{dotRows:.7,echo:.8,echoCount:2,echoStyle:'solid',scallops:.7,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#f6ead8',ink:'#7a2e14',fills:['#7a2e14','#93401c'],gap:'#f6ead8'},
    ground:{kind:'paper',amount:.15}
  },
  rules:[
    'Pipe fine lines that taper at both ends — the cone is lifted mid-stroke.',
    'Ring every motif with echo lines, then scallops, then a row of dots.',
    'Fill some areas with a net of cross-hatching (jāl) and others solid; balance open against dense.',
    'Put a mandala at the centre with petal rings, and radiate paisleys and leaves from it.',
    'Run some rings as a scrolling vine — a wavy stem with leaves branching off it at varied angles — rather than identical stamped petals; uniform stamped rings read as mechanical.',
    'Use one colour only: henna brown.'
  ],
  symbolism:'Mango (paisley) for fertility, peacock for love, lotus for grace; brides traditionally have the groom\'s name hidden in the design.',
  reading:[]
});

defTradition({
  id:'mughal-illumination',family:'india',provenance:'curated',
  name:'Mughal illumination',sub:'Album page and hashiya border',native:'',
  region:'Mughal court ateliers: Agra, Delhi, Lahore',medium:'Opaque watercolour and gold on burnished paper',period:'16th–18th c.',
  summary:'Mughal album pages (muraqqaʿ) frame a finely painted image — a flowering plant, a bird — inside gold-ruled margins (hashiya) filled with floral scrolls. The brush is a few squirrel hairs and the colours are mineral (lapis, malachite, vermilion) with gold. Persian design met Indian naturalism, especially in the flower and bird studies made for Jahāngīr.',
  axes:{density:.6,weight:.1,uniformity:.45,geometry:.25,symmetry:.75,fill:.9,chroma:.75,ornament:.7,abstraction:.25,narrative:.7},
  genes:{
    structure:{kinds:['panel'],folds:8,density:.55,symmetry:'bilateral',borderBands:3},
    motifs:{hero:['tree','lotusSide','bird','paisley'],ring:['bud','floret','leaf'],filler:['bud','floret','leaf'],border:['leafVine','scallop','diamond'],petal:'drop'},
    line:{weight:1.15,contrast:.3,double:false,wobble:.04,taper:.55,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:.85,gold:.15},coverage:.95,hatchGap:6},
    ornament:{dotRows:.12,echo:.1,echoCount:1,echoStyle:'solid',scallops:.1,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#efe3c2',ink:'#3a2a1a',fills:['#24438f','#b53a2b','#3f7a4b','#d9a441','#e7cfa4','#8a3a5a'],gap:'#efe3c2',metal:'#c9a24a'},
    ground:{kind:'paper',amount:.35}
  },
  rules:[
    'Use a hair-fine, slightly swelling brush line; lay colour flat with delicate modelling at the edges.',
    'Centre a single naturalistic subject — a flowering plant or a bird — with space around it.',
    'Build multiple borders: gold rules, a coloured inner band, then a wide outer margin of floral arabesque.',
    'Palette: lapis blue, vermilion, malachite green, gold, buff, lac crimson.'
  ],
  symbolism:'Paradise garden imagery — flowering plants, cypress, birds — framed as precious objects in imperial albums.',
  reading:['Milo Cleveland Beach, Mughal and Rajput Painting (Cambridge UP, 1992)']
});

defTradition({
  id:'kerala-mural',family:'india',provenance:'analyzed',
  name:'Kerala mural',sub:'Pañcavarṇa wall painting',native:'ചുവർചിത്രം',
  region:'Temples and palaces of Kerala',medium:'Natural pigments on lime plaster',period:'Major cycles c. 15th–19th c.',
  summary:'Temple and palace walls painted in pañcavarṇa — five colours from minerals and plants: red ochre, yellow ochre, green, white and black. Figures and ornament fill the panel to its edges with crowns, jewellery and garlands; warm ochres and a distinctive green dominate.',
  axes:{density:.9,weight:.45,uniformity:.5,geometry:.3,symmetry:.8,fill:.95,chroma:.7,ornament:.9,abstraction:.45,narrative:.8},
  genes:{
    structure:{kinds:['panel','shrine'],folds:8,density:.92,symmetry:'bilateral',borderBands:2,cornerScrolls:.85},
    motifs:{hero:['ganeshaSeated','vishnu','shiva','saraswati','krishnaFlute','durga','kali','lakshmi'],ring:['lotusTop','floret','leaf','lotusSide'],filler:['floret','leaf','bud','foliageScroll'],border:['petalRow','scallop','leafVine'],petal:'pointed'},
    line:{weight:2,contrast:.4,double:false,wobble:.1,taper:.35,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:.4,echo:.35,echoCount:1,echoStyle:'solid',scallops:.3,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#c9862a',ink:'#1a120d',fills:['#b5371f','#e0a731','#2f6b40','#f2ead6','#1a120d'],gap:'#c9862a',skin:'#e7b84a',skinBlue:'#2f6b40',skinDark:'#33503a',hair:'#1a120d',snake:'#f2ead6',snakeBelly:'#e0a731',clothYellow:'#e0a731',seat:'#b5371f'},
    ground:{kind:'plaster',amount:.45}
  },
  rules:[
    'Fill the panel edge to edge; figures and ornament leave little ground.',
    'Use only the five pigments, applied flat with tonal modelling at the contours.',
    'Draw strong outlines (red first, then black); build up elaborate crowns, jewellery and garlands.',
    'Run border friezes of petals, scallops and vines, and fill the corners with big curling foliage scrolls.',
    'Draw first in fine line: rounded full forms, almond eyes, a tall tiered crown, layer upon layer of jewellery — the colour comes after.'
  ],
  symbolism:'Epic and Purāṇic scenes on temple walls; the palette itself — pañcavarṇa — is prescribed.',
  care:'Temple murals depict deities; the generator enthrones a simplified seated Gaṇeśa or Sarasvatī at the centre, as murals often do at shrine entrances — upright, unmirrored — and blends like everything else.',
  analysis:{
    source:'A pen line drawing of a seated four-armed Gaṇeśa in the Kerala mural manner, signed and dated by the artist (reference image; analysed locally, not stored). It is the line stage of a mural; the colour profile stays curated.',
    observations:[
      'Rounded, full forms: a broad belly, heavy limbs, almond eyes and a gentle smile.',
      'A tall tiered crown (kirīṭa) with a pointed finial, side flares and banded ornament.',
      'Four arms holding goad, noose, a broken tusk and a sweet; armlets, bangles and anklets in layers.',
      'Seated at ease on a cushioned throne, the mouse beneath.',
      'A dense curling foliage scroll — pointed, flame-like leaves winding inward — fills the top-left corner, shaded heavily.'
    ],
    measured:{
      note:'Lab measurements on the figure, its crown and the corner scroll (upsampled 2×). Only the line axes override the curated profile: weight, evenness, geometry and ornament.',
      findings:[
        'The figure measures within 0.10 of Devotional line art — the third independent drawing to land on that profile.',
        'Fine line (0.9% of the figure) with mild variation (CV 0.32), grey ink on toned paper.',
        'The corner scroll is the densest part: 60% ink coverage, 55% of it solid shading.',
        'Crowns and jewellery carry the detail: 40 figure-widths of line in the figure.'
      ],
      axes:{weight:.1,uniformity:.59,geometry:.12,ornament:.76},
      samples:[
        {label:'Seated Gaṇeśa',strokeRel:.009,strokeCV:.32,coverage:.285,solidFrac:.01,bilateral:.64,dots:21},
        {label:'Corner foliage scroll',strokeRel:.0135,strokeCV:.4,coverage:.604,solidFrac:.55,bilateral:.85,dots:40},
        {label:'Crown',strokeRel:.025,strokeCV:.35,coverage:.386,solidFrac:.02,bilateral:.55,dots:6}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'ajrakh',family:'india',provenance:'curated',
  name:'Ajrakh',sub:'Resist block print',native:'અજરખ',
  region:'Kutch (Gujarat) and Sindh',medium:'Resist and mordant block printing on cotton; indigo and madder',period:'Centuries old, continuous',
  summary:'Block-printed through many stages of resist and mordant printing, washing and dyeing — indigo and madder red with black outlines and white resist dots. The designs are strictly geometric: star medallions and trefoils repeated on a grid, framed by borders, symmetric in every direction.',
  axes:{density:.85,weight:.3,uniformity:.85,geometry:.9,symmetry:.95,fill:.9,chroma:.55,ornament:.7,abstraction:.95,narrative:0},
  genes:{
    structure:{kinds:['field'],folds:8,density:.8,symmetry:'radial',borderBands:1},
    motifs:{hero:['star8'],ring:['floret','star8','lotusTop'],filler:['dot','floret'],border:['diamond','dotRow','zigzag'],petal:'pointed'},
    line:{weight:1.6,contrast:.2,double:false,wobble:.08,taper:0,breaks:0,dash:null,misreg:.55},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:.5,echo:.15,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:['#f2ead8'],groundStitch:false},
    palette:{ground:'#1e2b5c',ink:'#f2ead8',fills:['#a3202a','#141414','#1e2b5c','#a3202a'],gap:'#1e2b5c'},
    ground:{kind:'cloth',amount:.4}
  },
  rules:[
    'Repeat a medallion (often an eight-point star) on a grid and fill the gaps between with small florets.',
    'Indigo ground, madder red and black; white comes from resist — fine white outlines and dots.',
    'Keep every element symmetric, with borders of lozenges and dots on all four sides.',
    'Slight mis-registration between printing stages is part of the look.'
  ],
  symbolism:'Worn as shoulder cloth and turban by Maldhari herders and Sindhi men; the indigo-and-red night-sky palette is the identity.',
  reading:['Eiluned Edwards, Textiles and Dress of Gujarat (V&A / Mapin, 2011)']
});

defTradition({
  id:'jaali',family:'india',provenance:'curated',
  name:'Jaali',sub:'Pierced stone lattice',native:'जाली',
  region:'Indo-Islamic architecture — Gujarat, Agra, Delhi, Fatehpur Sikri',medium:'Pierced sandstone and marble screens',period:'15th–17th c. and after',
  summary:'Stone screens cut through, so that light and air pass and sight is softened. Geometric jālīs grow from eight-point stars and polygon grids; the most famous, at the Sidi Saiyyed mosque in Ahmedabad (1573), turns the lattice into an interlaced tree. The style is pure structure: one material, one colour, with light coming through the holes.',
  axes:{density:.6,weight:1,uniformity:.9,geometry:1,symmetry:1,fill:.5,chroma:0,ornament:.4,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['lattice'],folds:8,density:.7,symmetry:'radial',borderBands:1},
    motifs:{hero:['star8'],ring:['floret','star8'],filler:['floret','dot'],border:['diamond','lines'],petal:'pointed'},
    line:{weight:9,contrast:.35,double:false,wobble:0,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:.3,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#1c1714',ink:'#d9c4a0',fills:['#cdb38a','#d9c4a0','#c4a67a'],gap:'#1c1714'},
    ground:{kind:'stone',amount:.45}
  },
  rules:[
    'Build from a grid: stars at the nodes, diagonals crossing between them.',
    'Keep the ribs thick and of even width; the piercings, not the ribs, make the pattern.',
    'Use one material colour; dark and light behind are the only contrast.',
    'Hold strict symmetry in both axes, repeated out to the frame.'
  ],
  symbolism:'Privacy and filtered light in tombs, mosques and palaces; geometry as an image of infinite order.',
  reading:[]
});

defTradition({
  id:'kantha',family:'india',provenance:'curated',
  name:'Kantha',sub:'Running-stitch quilt',native:'কাঁথা',
  region:'Bengal (West Bengal and Bangladesh)',medium:'Running-stitch embroidery on layered old saris and dhotis',period:'Classic nakshi kantha 19th c.; living',
  summary:'Women layer worn saris and quilt them with running stitch. In nakshi ("figured") kantha a central lotus medallion is surrounded by fish, birds, trees and scenes, all outlined in coloured thread. The white ground between them ripples with rows of tiny stitches that follow the shapes.',
  axes:{density:.7,weight:.35,uniformity:.9,geometry:.3,symmetry:.6,fill:.3,chroma:.45,ornament:.8,abstraction:.6,narrative:.55},
  genes:{
    structure:{kinds:['medallion','panel'],folds:8,density:.7,symmetry:'radial',borderBands:2},
    motifs:{hero:['lotusTop','fish','tree','sun'],ring:['paisley','leaf','floret','fish','bird'],filler:['floret','bud','leaf'],border:['wave','chevron','zigzag'],petal:'round'},
    line:{weight:2.1,contrast:0,double:false,wobble:.25,taper:0,breaks:0,dash:'stitch',misreg:0},
    fill:{modes:{stitch:.75,none:.25},coverage:.9,hatchGap:5.5},
    ornament:{dotRows:0,echo:.6,echoCount:2,echoStyle:'stitch',scallops:0,halo:0,gems:null,groundStitch:true},
    palette:{ground:'#f1ece1',ink:'#2a3a6a',fills:['#b8322f','#2a3a6a','#d99a26','#2f6b4f'],gap:'#f1ece1'},
    ground:{kind:'cloth',amount:.5}
  },
  rules:[
    'Everything is running stitch: outlines are dashed lines and fills are rows of dashes.',
    'Place a central lotus medallion, trees or paisleys in the corners, and borders of waves and chevrons.',
    'Fill motifs with parallel stitch rows in thread colours, and ripple the ground with stitch rows too.',
    'Thread palette: red, indigo or black, yellow and green on faded white cloth.'
  ],
  symbolism:'Thrift and continuity — old cloth remade as a gift for a child or bride; the lotus centre and tree of life recur.',
  reading:['Niaz Zaman, The Art of Kantha Embroidery (1981)']
});

/* ---------- Devotional drawing registers ----------
   Five ways the same deities — Gaṇeśa, Kṛṣṇa, Hanumān — are drawn in contemporary
   devotional design, analysed from reference sheets. The deities'
   iconography is documented (DEITY_CONVENTIONS); the generators draw their ATTRIBUTES as
   emblems (flute, peacock feather, mace, modaka, mouse, drum, trident), never the figures. */
const DEITY_CONVENTIONS=[
  ['Gaṇeśa','Elephant head with a curling trunk, one broken tusk (ekadanta), wide fan ears, pot belly (lambodara); holds a modaka sweet, goad and noose; rides a mouse (mūṣaka). In minimal marks the trunk is often drawn as the curve of Om (ॐ), and the ears as two swirls.'],
  ['Kṛṣṇa','Peacock feather in the crown or turban, the flute held to the right, dark (blue-black) skin, yellow garment (pītāmbara), Vaiṣṇava U-shaped tilak; as the child Bāl Gopāl with a pot of butter; standing in the thrice-bent tribhaṅga pose while playing.'],
  ['Hanumān','Monkey face with a strong jaw, the mace (gadā), flying with the mountain of healing herbs (Droṇagiri), tail curling upward; kneeling with joined palms in devotion to Rāma, whose name is often written beside him; saffron-vermilion (sindūr) colour.'],
  ['Sarasvatī','Seated on a white lotus playing the vīṇā; her other hands hold a book (pustaka) and a rosary (akṣamālā); a peacock or swan beside her; white or pale garments.'],
  ['Durgā','Rides a tiger or lion; eight or ten arms bearing the gods\' weapons — trident, discus, sword, conch, bow, mace, bell — with one hand in abhaya; red sari.'],
  ['Viṣṇu','Dark blue, in yellow silk, wearing the tall crown (kirīṭa) and the forest garland. Four hands: discus (cakra) and conch (śaṅkha) above, mace (gadā) and lotus (padma) below. Seated on the coils of the serpent Śeṣa, whose hoods rise behind him. Vertical U-shaped mark on the brow.'],
  ['Śiva','Matted locks piled into a crown (jaṭā) holding the crescent moon and the river Gaṅgā; a third eye and three horizontal lines of ash on the brow; a serpent round the neck; rudrākṣa beads; tiger skin; the trident with its hourglass drum. Often seated in meditation with eyes closed.'],
  ['Rāma','Standing, the great bow (Kodaṇḍa) at rest in the left hand, an arrow or a raised palm on the right, a quiver at the shoulder; tall crown, Vaiṣṇava brow mark, blue or green skin, yellow silk.'],
  ['Lakṣmī','Seated or standing on a lotus, a lotus in each upper hand; lower hands in the gestures of fearlessness and giving (often with coins falling); red and gold.'],
  ['Kālī','Dark blue or black, hair unbound, a garland of skulls and a skirt of severed arms (here a plain leaf skirt); sword and severed head or skull on one side, the gestures of fearlessness and giving on the other.'],
  ['Proportion','The figures are set out by tālamāna: the face from chin to hairline is one tāla (12 aṅgula), the seated trunk a little over three, a standing principal figure ten (daśatāla). Head, hand and foot are all close to one tāla long.'],
  ['Regalia as parts','Crown, halo, seat and each attribute are separate drawings: each is also a motif of its own, and the Mixer can hand one deity another\'s — or another culture\'s.'],
  ['Shared','Crowns (mukuṭa), haloes and sunbursts, lotus seats; Devanagari text — the deity\'s name, a mantra or a verse such as the Hanumān Chālīsā — set beside the figure as part of the design.']
];
const DEITY_CARE='These are images of living objects of worship, so the generators follow a few drawing rules: figures always stand upright and are never mirrored (the direction of Gaṇeśa\'s trunk carries meaning), they are never used as repeating border or ring units, and they carry no secondary ornament. Like every other motif they blend freely with other cultures in the Mixer. The figures are original constructions set out by the traditional canon of proportion (tālamāna), not traced. In the Mixer a blended genome may give a figure another deity\'s or another culture\'s crown, halo, seat or attributes; set Regalia to "canonical" to keep each figure\'s own. Om and the svastika, present in the references, are not generated.';
const DEITY_MOTIFS=['peacockFeather','bansuri','gada','modak','mushika','trishul','dhol','lotusSide','diya','sudarshana','shankha','kodanda','nagaPhana','kiritaMukuta','padmaKara'];

defTradition({
  id:'deity-brush-mark',family:'india',provenance:'analyzed',
  name:'Brush-mark devotional logos',sub:'A deity in a few strokes',native:'',
  region:'Pan-Indian, contemporary',medium:'Vector brush strokes (logos, invitations, decals)',period:'Contemporary',
  summary:'The deity reduced to a handful of confident thick-and-thin strokes, most of the form left to the eye — Gaṇeśa as an Om-curve trunk, two ear swirls and a crown flick. Black ink, generous white, and often a single red tilak or eye as the only colour.',
  axes:{density:.45,weight:.56,uniformity:.89,geometry:.08,symmetry:.24,fill:0,chroma:.05,ornament:.21,abstraction:.95,narrative:.1},
  genes:{
    structure:{kinds:['sheet','emblem'],folds:8,density:.25,symmetry:'free',borderBands:0},
    motifs:{hero:['ganesha','shiva','hanumanSeated','ganesha',...DEITY_MOTIFS.slice(0,7)],ring:['flame','spiral','modak'],filler:['dot','spiral'],border:['lines'],petal:'drop'},
    line:{weight:6.5,contrast:.4,double:false,wobble:0,taper:.8,breaks:.7,dash:null,misreg:0,brush:.95,dry:0},
    fill:{modes:{none:.85,flat:.15},coverage:.6,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false,accentDots:.7},
    palette:{ground:'#fefefe',ink:'#0d0d0d',fills:['#0d0d0d'],gap:'#fefefe',accent:'#e0461f'},
    ground:{kind:'none',amount:0}
  },
  rules:[
    'Use as few strokes as possible: five to twelve gestures should carry the whole figure.',
    'Every stroke swells and tapers — a heavy belly, a pointed end — but the line stays clean, with no dry-brush texture.',
    'Let one curve do two jobs: Gaṇeśa\'s trunk is also the curve of Om; an ear swirl is also a crown.',
    'Leave the outline open; the eye closes it.',
    'Add one point of red or saffron — tilak, eye, a flame — and nothing else.'
  ],
  conventions:DEITY_CONVENTIONS,
  symbolism:'Minimal Gaṇeśa marks open wedding cards, shop signs and new ventures — he is invoked first, as remover of obstacles. Their brevity is part of the devotion: the god recognised in a single gesture.',
  care:DEITY_CARE,
  analysis:{
    source:'Sheet of about twenty minimalist Gaṇeśa brush-stroke logos (stock reference image; analysed locally, not stored).',
    observations:[
      'Each mark uses only a few strokes; trunk, ears, crown and belly are each one gesture.',
      'Strokes swell and taper cleanly, like a vector brush, with no dry-brush texture.',
      'Several marks fuse the trunk with the Om glyph; others form the body from a single S-curve.',
      'A red or orange tilak, eye or flame is the only colour, on a few marks.',
      'One mark is a pale ghosted version — the same sheet holds positive and faded variants.'
    ],
    measured:{
      note:'Lab measurements on three single marks (upsampled 2×) and the whole sheet.',
      findings:[
        'The simplest drawings measured in the atlas: about 6 mark-widths of line per mark, against 21–45 for the detailed devotional drawings.',
        'Bold for its size: strokes are 2.9–4.7% of the mark.',
        'Fairly even inside a stroke (CV 0.15–0.20); the thick-and-thin comes from stroke shape, not ink texture.',
        'Asymmetric gestures: mirror IoU 0.24–0.55.',
        'Black ink; the red accents are under 1% of pixels.'
      ],
      axes:{density:.45,weight:.56,uniformity:.89,geometry:.08,symmetry:.24,fill:0,chroma:.01,ornament:.21},
      samples:[
        {label:'Whole sheet',strokeRel:.0072,strokeCV:.38,coverage:.147,solidFrac:0,bilateral:.48,dots:115},
        {label:'Seated mark',strokeRel:.0338,strokeCV:.15,coverage:.129,solidFrac:0,bilateral:.45,dots:3},
        {label:'Bold seated mark',strokeRel:.0471,strokeCV:.2,coverage:.208,solidFrac:0,bilateral:.55,dots:16},
        {label:'Head in profile',strokeRel:.0287,strokeCV:.18,coverage:.116,solidFrac:0,bilateral:.24,dots:1}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'deity-tattoo-line',family:'india',provenance:'analyzed',
  name:'Tapered tattoo line',sub:'Tribal-tattoo devotional line art',native:'',
  region:'Pan-Indian, contemporary',medium:'Vector line art (tattoo flash, decals, festival graphics)',period:'Contemporary',
  summary:'Outline drawings in the tribal-tattoo manner: every line starts thin, swells, and ends in a sharp point, with flicks and curls added at the ends. Gaṇeśa is drawn alongside his mouse, Om, festival drums (dhol), the shehnai and a trident.',
  axes:{density:.38,weight:.45,uniformity:.56,geometry:.17,symmetry:.1,fill:.07,chroma:0,ornament:.2,abstraction:.75,narrative:.15},
  genes:{
    structure:{kinds:['sheet','panel'],folds:8,density:.35,symmetry:'free',borderBands:0},
    motifs:{hero:['ganesha','shiva','kali','vishnu','ganesha',...DEITY_MOTIFS],ring:['spiral','flame','leaf'],filler:['spiral','dot'],border:['scallop','wave'],petal:'drop'},
    line:{weight:3.6,contrast:.45,double:false,wobble:.04,taper:.95,breaks:.8,dash:null,misreg:0,brush:.85,dry:0},
    fill:{modes:{none:.8,flat:.2},coverage:.5,hatchGap:6},
    ornament:{dotRows:0,echo:.1,echoCount:1,echoStyle:'solid',scallops:.05,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#ffffff',ink:'#050505',fills:['#050505'],gap:'#ffffff'},
    ground:{kind:'none',amount:0}
  },
  rules:[
    'Start every line thin, swell it, and end it in a sharp point — no blunt ends anywhere.',
    'Break long contours into several overlapping tapered strokes rather than one closed line.',
    'Finish ends with flicks and small curls.',
    'Fill a few small wedges solid black for weight; leave the rest as line.',
    'Pair the deity with festival objects — drums, shehnai, trident, mouse — in the same hand.'
  ],
  conventions:DEITY_CONVENTIONS,
  symbolism:'The dhol and shehnai belong to processions and weddings — Gaṇeśa Caturthī immersions above all — so the drum sits naturally beside him.',
  care:DEITY_CARE,
  analysis:{
    source:'Sheet of Gaṇeśa line drawings with Om, svastika, dhol drums, shehnai, mouse and trident (watermarked stock reference image; analysed locally, not stored).',
    observations:[
      'Tapered strokes throughout: thin at both ends, swelling in the middle, often ending in a flick.',
      'Contours are open — built from several overlapping strokes rather than one closed outline.',
      'Small solid black wedges add weight at crowns, feet and the drum heads.',
      'Festival objects are drawn in the same hand as the deity: dhol with zigzag lacing, crossed shehnai, a trident with ribbons.',
      'Two Om signs and two svastikas sit among the objects.'
    ],
    measured:{
      note:'Lab measurements on three Gaṇeśa drawings and one pair of drums (upsampled up to 2×).',
      findings:[
        'Tapering shows up as stroke CV 0.25–0.35 on the figures, between the even icon sets (≈0.05) and the brush calligraphy (0.44+).',
        'The drums are heavier and more varied (CV 0.51, 13% solid ink): solid drum heads beside thin lacing.',
        'Still minimal: 6–8 motif-widths of line per figure.',
        'Low mirror symmetry (0–0.48): figures are drawn in turning, gestural poses.',
        'Before this profile existed, the Lab matched these drawings to Mongol calligraphy (distance 0.15–0.17) — a tapered line reads as brushwork.'
      ],
      axes:{density:.38,weight:.45,uniformity:.56,geometry:.17,symmetry:.1,fill:.07,chroma:0,ornament:.2},
      samples:[
        {label:'Seated Gaṇeśa (tall crown)',strokeRel:.0314,strokeCV:.35,coverage:.179,solidFrac:0,bilateral:.48,dots:7},
        {label:'Seated Gaṇeśa (round)',strokeRel:.0325,strokeCV:.25,coverage:.171,solidFrac:0,bilateral:.29,dots:4},
        {label:'Elephant head',strokeRel:.0425,strokeCV:.26,coverage:.183,solidFrac:0,bilateral:.33,dots:1},
        {label:'Pair of dhol drums',strokeRel:.0135,strokeCV:.51,coverage:.155,solidFrac:.13,bilateral:.31,dots:0}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'deity-silhouette',family:'india',provenance:'analyzed',
  name:'Silhouette clipart',sub:'Solid black figures with cut-in detail',native:'',
  region:'Pan-Indian, contemporary',medium:'Vector clipart (cutting and printing files)',period:'Contemporary',
  summary:'Figures as solid black shapes, with only a few white lines cut in for the eye, the folds of a dhoti, a necklace — Kṛṣṇa dancing with his flute, Hanumān flying with the mountain. Often set against a disc, a crescent or a sunburst of rays.',
  axes:{density:.55,weight:.8,uniformity:.14,geometry:.16,symmetry:.54,fill:.35,chroma:.05,ornament:.18,abstraction:.6,narrative:.55},
  genes:{
    structure:{kinds:['emblem','sheet'],folds:8,density:.4,symmetry:'free',borderBands:0},
    motifs:{hero:['krishnaFlute','hanumanFlying','rama','ganesha','durga','kali','hanumanSeated',...DEITY_MOTIFS.slice(0,7)],ring:['lotusSide','flame','peacockFeather'],filler:['dot','spiral'],border:['lines'],petal:'drop'},
    line:{weight:2.4,contrast:.2,double:false,wobble:0,taper:.3,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6,knockout:.88},
    ornament:{dotRows:.1,echo:.35,echoCount:1,echoStyle:'solid',scallops:0,halo:0,rays:.35,gems:null,groundStitch:false},
    palette:{ground:'#f6f3ee',ink:'#0a0a0a',fills:['#0a0a0a'],gap:'#f6f3ee'},
    ground:{kind:'none',amount:0}
  },
  rules:[
    'Make the figure one solid black shape; the silhouette alone must say who it is (feather, flute, mace, tail).',
    'Cut in only the details the silhouette cannot carry — eye, necklace, a few folds — as thin white lines.',
    'Set the figure against a disc, crescent moon or sunburst for contrast.',
    'Exaggerate the action: dancing, flying, leaping — silhouettes read gesture best.'
  ],
  conventions:DEITY_CONVENTIONS,
  symbolism:'The flying Hanumān with the mountain recalls his journey to fetch healing herbs for Lakṣmaṇa in the Rāmāyaṇa; the dancing Kṛṣṇa with flute is the cowherd of Vṛndāvana.',
  care:DEITY_CARE,
  analysis:{
    source:'Two clipart bundles of Kṛṣṇa and Hanumān figures sold as cutting and engraving files (stock reference images; analysed locally, not stored). The silhouette figures were measured here; the fine-line ones under Devotional line art; the shaded ones under Woodburn engraving.',
    observations:[
      'Solid black silhouettes carry the gesture: Kṛṣṇa dancing or leaning on one leg with the flute, Hanumān flying with the mountain overhead.',
      'Attributes are exaggerated so the shape alone identifies the figure: the peacock feather, the flute, the mace, the tail.',
      'A few white cut-in lines give eye, jewellery and dhoti folds.',
      'Several figures sit against a black disc, a crescent moon or a burst of rays.'
    ],
    measured:{
      note:'Lab measurements on three silhouettes (two Kṛṣṇa, one Hanumān), upsampled up to 2×; the wooden backdrop falls below the ink threshold.',
      findings:[
        'Heaviest ink in the atlas: ink covers 25–35% of each crop.',
        'Up to 25% of the ink is solid mass; stroke CV 0.50–0.87, as solid bodies meet thin flute and limb lines.',
        'Mirror IoU 0.39–0.73.',
        'Black on light ground; the warm backdrop adds only a trace of colour.'
      ],
      axes:{density:.55,weight:.8,uniformity:.14,geometry:.16,symmetry:.54,fill:.35,chroma:.05,ornament:.18},
      samples:[
        {label:'Kṛṣṇa dancing with flute',strokeRel:.0526,strokeCV:.5,coverage:.354,solidFrac:.02,bilateral:.47,dots:0},
        {label:'Kṛṣṇa standing with flute',strokeRel:.0762,strokeCV:.53,coverage:.349,solidFrac:.2,bilateral:.39,dots:0},
        {label:'Hanumān flying with the mountain',strokeRel:.0373,strokeCV:.87,coverage:.249,solidFrac:.25,bilateral:.41,dots:5}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'deity-woodburn',family:'india',provenance:'analyzed',
  name:'Woodburn engraving',sub:'Shaded line art for laser engraving',native:'',
  region:'Pan-Indian, contemporary',medium:'Laser-engraved or pyrographed wood; vector engraving files',period:'Contemporary',
  summary:'Detailed engraving-style drawings made to be burned into wood: dark brown line on pale grain, with muscles, folds and jewellery shaded by hatching and solid black masses. Hanumān in action — leaping with his mace, fist raised under a sunburst — is the classic subject.',
  axes:{density:.67,weight:.15,uniformity:.06,geometry:.11,symmetry:.4,fill:.67,chroma:.27,ornament:.53,abstraction:.35,narrative:.65},
  genes:{
    structure:{kinds:['shrine','emblem','sheet'],folds:8,density:.7,symmetry:'bilateral',borderBands:0},
    motifs:{hero:['hanumanFlying','hanumanSeated','ganesha','rama','gada','bansuri','peacockFeather','mushika','kalasha','lotusTop','trishul','kodanda'],ring:['flame','lotusSide','floret','peacockFeather'],filler:['dot','floret','spiral'],border:['dotRow','petalRow'],petal:'pointed'},
    line:{weight:2.2,contrast:.55,double:false,wobble:.04,taper:.4,breaks:0,dash:null,misreg:0},
    fill:{modes:{hatch:.35,crosshatch:.15,flat:.2,none:.3},coverage:.85,hatchGap:4.6},
    ornament:{dotRows:.35,echo:.35,echoCount:1,echoStyle:'solid',scallops:.15,halo:0,rays:.4,gems:null,groundStitch:false},
    palette:{ground:'#ecd6b0',ink:'#1a0d06',fills:['#1a0d06','#3a2212'],gap:'#ecd6b0'},
    ground:{kind:'wood',amount:.75}
  },
  rules:[
    'Draw in dark brown-black on pale wood; the grain shows through every open area.',
    'Model form with hatching (parallel, then crossed) and push the deepest shadows to solid black.',
    'Detail jewellery, crowns and maces heavily; keep skin areas open and light.',
    'Back heroic figures with a sunburst of rays.',
    'Keep lines a laser can burn: no greys, only line, hatch and solid.'
  ],
  conventions:DEITY_CONVENTIONS,
  symbolism:'Hanumān as the strongest of devotees: the mace, the raised fist, the leap across the sea to Laṅkā.',
  care:DEITY_CARE,
  analysis:{
    source:'Bundle of Hanumān engraving designs on a wood-grain mockup, with Devanagari lettering (stock reference image; analysed locally, not stored).',
    observations:[
      'Brown-black line burned into pale wood; the grain is part of the image.',
      'Muscles, folds and jewellery are shaded with hatching; the deepest shadows go solid.',
      'Maces, crowns and armlets carry the most detail.',
      'Action poses — leaping, flying, fist raised — some under a sunburst.',
      'Devanagari lettering is part of several designs: the name "Rām", "Jai Hanumān", a couplet from the Hanumān Chālīsā.'
    ],
    measured:{
      note:'Lab measurements on two shaded figures (upsampled up to 2×).',
      findings:[
        'Strongest light-to-dark contrast in a line style: stroke CV 0.56–0.63, with 15–24% of the ink in solid shadow masses.',
        'Fine lines (about 1% of figure size) packed densely: 24–32 figure-widths of line.',
        'The only warm palette among the devotional registers: ink #090302–#0d0402 on wood #eed9b7.',
        'The unshaded line drawings in the same bundle (Hanumān with the mace, Kṛṣṇa with the flute) measure within 0.08–0.10 of Devotional line art.'
      ],
      axes:{density:.67,weight:.15,uniformity:.06,geometry:.11,symmetry:.4,fill:.67,chroma:.27,ornament:.53},
      samples:[
        {label:'Hanumān leaping with mace',strokeRel:.0136,strokeCV:.63,coverage:.331,solidFrac:.24,bilateral:.61,dots:3},
        {label:'Hanumān under a sunburst',strokeRel:.0098,strokeCV:.56,coverage:.213,solidFrac:.15,bilateral:.43,dots:14}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'deity-stencil',family:'india',provenance:'analyzed',
  name:'Devotional stencil',sub:'Cut-out stencil cards',native:'',
  region:'Pan-Indian, contemporary',medium:'Laser-cut stencil card (for walls, rangoli, cakes, textiles)',period:'Contemporary',
  summary:'Stencil designs of Gaṇeśa, Kṛṣṇa and Hanumān: every line is a slot cut through card, broken by small bridges so the inner pieces do not fall out. Corner sunbursts and scroll flourishes frame the figure; solid cut areas become the darks.',
  axes:{density:.42,weight:.17,uniformity:.35,geometry:.33,symmetry:.57,fill:.07,chroma:0,ornament:.32,abstraction:.8,narrative:.2},
  genes:{
    structure:{kinds:['stencil'],folds:8,density:.4,symmetry:'bilateral',borderBands:0},
    motifs:{hero:['ganesha','krishnaFlute','shiva','ganeshaSeated',...DEITY_MOTIFS.slice(0,7)],ring:['spiral','flame','lotusSide'],filler:['spiral','dot'],border:['lines'],petal:'drop'},
    line:{weight:6,contrast:.1,double:false,wobble:0,taper:0,breaks:0,dash:null,misreg:0,bridges:.8},
    fill:{modes:{none:.75,flat:.25},coverage:.6,hatchGap:6},
    ornament:{dotRows:0,echo:.2,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#fcfcfc',ink:'#4e4e4e',fills:['#4e4e4e'],gap:'#fcfcfc'},
    ground:{kind:'none',amount:0}
  },
  rules:[
    'Every line is a slot cut through card: thick, even, round-ended.',
    'Break every closed shape with two or more small bridges so no island falls out.',
    'Use solid cut areas for the darks (a crescent, hair, a pupil).',
    'Frame the figure with corner sunbursts and side scroll flourishes.',
    'Simplify to what survives cutting: no hatching, no hairlines.'
  ],
  conventions:DEITY_CONVENTIONS,
  symbolism:'Stencils carry devotional images onto walls for festivals, onto rangoli and cakes — the same figure repeated by anyone, without drawing skill.',
  care:DEITY_CARE,
  analysis:{
    source:'Set of devotional stencil cards — several Gaṇeśa, Kṛṣṇa with flute, Hanumān — shown as white card with grey cut-outs (stock reference image; analysed locally, not stored).',
    observations:[
      'Lines are cut slots of even width with rounded ends.',
      'Closed shapes are broken by small bridges wherever an island would fall out.',
      'Solid cut-outs make the darks — a crescent behind Hanumān, hair, pupils.',
      'Corner sunbursts and side scrolls frame the larger cards.',
      'Most Gaṇeśa cards are minimal brush-mark designs translated into stencil.'
    ],
    measured:{
      note:'Lab measurements on two cards (the sun-framed Gaṇeśa and the large card with flourishes). Crops that included the grey surround inverted the ground detection and were discarded.',
      findings:[
        'Grey (#4e4e4e) cut-outs on white card.',
        'Slots are 1–1.5% of the card; variation depends on the design (CV 0.30–0.60).',
        'The framed card is strongly mirrored (IoU 0.85) by its flourishes; the figure itself is not.',
        'The flourished card matched Revival line art most closely (distance 0.11) — framed, mirrored line work.'
      ],
      axes:{density:.42,weight:.17,uniformity:.35,geometry:.33,symmetry:.57,fill:.07,chroma:0,ornament:.32},
      samples:[
        {label:'Gaṇeśa in a sun frame',strokeRel:.0104,strokeCV:.6,coverage:.123,solidFrac:.05,bilateral:.38,dots:3},
        {label:'Large card with flourishes',strokeRel:.0154,strokeCV:.3,coverage:.182,solidFrac:.01,bilateral:.85,dots:4}
      ]
    }
  },
  reading:[]
});
