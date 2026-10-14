'use strict';
/* Aztec & Mesoamerica — third culture family. Four traditions are ANALYZED from the reference images, all of them modern graphic idioms of "Aztec" style; three are
   CURATED from the historical sources those idioms draw on (codex painting, the Sun
   Stone, Mitla's fret mosaics). */

defFamily({id:'mesoamerica',name:'Aztec & Mesoamerica',native:'Mēxihcah',
  blurb:'The Mexica (Aztec) world and the Mesoamerican traditions around it — codex painting, carved calendar stone, Zapotec fret mosaic — beside the modern icon, stamp and poster idioms that now stand in for "Aztec" everywhere.'});

const MESO_CARE='Specific gods\' iconography (Tlaloc\'s goggle eyes and fangs, the Sun Stone\'s central face) is documented, not generated; the generators use a generic geometric mask. Nahua and other Indigenous peoples of Mexico are living communities, not only an ancient civilisation.';

defTradition({
  id:'aztec-line-icons',family:'mesoamerica',provenance:'analyzed',
  name:'"Aztec" line icons',sub:'Modern monoline icon set',native:'',
  region:'Global stock graphics',medium:'Vector outline icons',period:'Contemporary',
  summary:'A stock icon set: sixteen single-weight outline emblems — calendar disc, masks, feathered serpent, eagle, turtle, stepped pyramid, warriors in feather headdresses. The same icon idiom as the Dīpāvalī set, but the geometry turns rectilinear: step-frets, grids, stairs and square spirals fill every emblem.',
  axes:{density:.32,weight:.55,uniformity:.99,geometry:.65,symmetry:.92,fill:0,chroma:0,ornament:.24,abstraction:.8,narrative:.15},
  genes:{
    structure:{kinds:['sheet','calendar'],folds:8,density:.3,symmetry:'bilateral',borderBands:0},
    motifs:{hero:['sunStone','glyphMask','serpent','maquizcoatl','eagle','turtle','pyramid','lizard','ollin','featherFan','calli','xochitl','tecpatl'],ring:['stepFret','ollin','cartouche'],filler:['dot','stepFret'],border:['greca','stepDiamond'],petal:'round'},
    line:{weight:4.6,contrast:0,double:false,wobble:0,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{none:1},coverage:0,hatchGap:6},
    ornament:{dotRows:.08,echo:.35,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#fefefe',ink:'#494949',fills:['#e6e6e6'],gap:'#fefefe'},
    ground:{kind:'none',amount:0}
  },
  rules:[
    'One even grey line everywhere (about 3.5–4% of the icon\'s width), rounded joins, no fills.',
    'Fill interiors with rectilinear detail — step-frets, grids, stairs, square spirals — rather than dots or curves.',
    'Draw bands as two parallel lines (a serpent\'s body, a pyramid\'s tiers, a shield\'s rim).',
    'Frontal and mirror-symmetric for emblems; profile only for heads and warriors.',
    'Faces stay minimal: rectangular eyes, a mouth bar, ear spools.'
  ],
  symbolism:'The set mixes eras and regions freely: the calendar disc and eagle are Mexica; the temple-topped pyramid is Maya or Toltec; the ball-game ring is pan-Mesoamerican; the llama is Andean (Inca), from a different continent of cultures.',
  care:MESO_CARE+' Stock "Aztec" sets routinely merge Maya, Andean and later material; read them as a modern genre, not a source.',
  analysis:{
    source:'Stock line-icon sheet, 16 "Aztec" emblems in a 4×4 grid (reference image; analysed locally, not stored).',
    observations:[
      'Single-weight grey outline throughout, rounded joins, no fills or tone.',
      'Interiors are packed with rectilinear ornament: step-frets around the calendar disc, a grid on the turtle shell, stairs on the pyramid, segment bands on the serpent.',
      'Bands are drawn as double lines (serpent body, pyramid tiers, mask frames).',
      'Strict mirror symmetry on emblems (disc, eagle, turtle, pyramid); profile only for the serpent head and warriors.',
      'Faces are blank or minimal; identity comes from headdresses — feather fans, crests, topknots.',
      'Mixed provenance: a llama (Andean) and a Maya-style temple pyramid sit beside Mexica motifs.'
    ],
    measured:{
      note:'Lab measurements on five single icons (calendar disc, serpent, eagle, turtle, pyramid) upsampled 2×, and the whole sheet for density.',
      findings:[
        'Monoline: stroke CV 0.09–0.14 on single icons, 0.03 across the sheet.',
        'Strokes are 3.4–4.2% of icon size, grey ink #494949 — almost the same numbers as the Dīpāvalī icon set.',
        'The difference is geometry: edges sit on 0/45/90° 1.6–2.7× more than chance (pyramid 2.66, turtle 2.0), against about 1.35 for the Dīpāvalī lotus and lamp. The most rectilinear set measured.',
        'Mirror IoU 0.93–0.98 on the emblems.',
        'Before this family existed, the Lab\'s closest match for these icons was the Dīpāvalī set (distance 0.10–0.21) — same idiom, different vocabulary.'
      ],
      axes:{density:.32,weight:.55,uniformity:.99,geometry:.65,symmetry:.92,fill:0,chroma:0,ornament:.24},
      samples:[
        {label:'Whole sheet (16 icons)',strokeRel:.0066,strokeCV:.03,coverage:.117,solidFrac:0,bilateral:.68,rotational:.38,folds:2,dots:74},
        {label:'Calendar disc',strokeRel:.0335,strokeCV:.12,coverage:.255,solidFrac:0,bilateral:.98,rotational:.65,folds:2,dots:7},
        {label:'Feathered serpent',strokeRel:.0349,strokeCV:.11,coverage:.209,solidFrac:0,bilateral:.64,rotational:.48,folds:16,dots:1},
        {label:'Eagle',strokeRel:.0358,strokeCV:.09,coverage:.221,solidFrac:0,bilateral:.93,rotational:.47,folds:16,dots:2},
        {label:'Turtle',strokeRel:.0356,strokeCV:.11,coverage:.24,solidFrac:0,bilateral:.97,rotational:.47,folds:4,dots:8},
        {label:'Stepped pyramid',strokeRel:.0417,strokeCV:.14,coverage:.161,solidFrac:0,bilateral:.98,rotational:.5,folds:2,dots:0}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'aztec-stamp',family:'mesoamerica',provenance:'analyzed',
  name:'Clay-stamp glyphs',sub:'Sello-style animal emblems',native:'',
  region:'After pre-Hispanic clay stamps of central Mexico',medium:'Ink graphics (originally fired-clay stamps)',period:'Stamps: pre-Hispanic; this idiom: modern',
  summary:'Bold black animal emblems — serpent, eagle, fish, lizard, turtle, monkey, birds — whose bodies are cut through with white spirals, dots, triangles and bands. The look descends from pre-Hispanic clay stamps (sellos), pressed onto cloth, paper and skin, which became a modern design source in the mid-20th century.',
  axes:{density:.52,weight:.46,uniformity:.93,geometry:.27,symmetry:.61,fill:.05,chroma:0,ornament:.4,abstraction:.85,narrative:.1},
  genes:{
    structure:{kinds:['sheet','field'],folds:8,density:.45,symmetry:'free',borderBands:0},
    motifs:{hero:['eagle','serpent','maquizcoatl','lizard','turtle','fish','glyphMask','sunStone','xochitl','tecpatl'],ring:['spiral','stepFret','ollin'],filler:['dot','spiral'],border:['zigzag','stepDiamond'],petal:'round'},
    line:{weight:3.4,contrast:.1,double:false,wobble:.3,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6,knockout:1},
    ornament:{dotRows:.2,echo:.55,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#fdfdfb',ink:'#111111',fills:['#111111'],gap:'#fdfdfb'},
    ground:{kind:'paper',amount:.2}
  },
  rules:[
    'Make the creature a solid black silhouette with a thick, slightly irregular edge, as if carved and pressed.',
    'Cut the interior back out in white: spirals for bodies and wings, dot rows along the spine, triangles and bands for scales.',
    'Leave a white line just inside the silhouette (an echo of the edge) so the shape reads as a stamp.',
    'One creature per field, side or top view, with generous white around it.',
    'Spirals do double duty: wings, tails, bellies, curling tongues.'
  ],
  symbolism:'Many of the animals coincide with signs of the 260-day count — serpent (coatl), lizard (cuetzpalin), eagle (cuauhtli), monkey (ozomatli) — though stamp designs were also simply decorative.',
  care:MESO_CARE+' The reference set includes a horse, which arrived with the Spanish — a sign the set is a modern pastiche rather than a catalogue of real stamps.',
  analysis:{
    source:'Sheet of 16 black "Aztec" animal emblems (reference image; analysed locally, not stored).',
    observations:[
      'Thick black outlines thicken into silhouettes; interiors are cut through with white spirals, dot rows, triangles and bands.',
      'Edges are slightly irregular, like a carved stamp rather than a vector icon.',
      'Spirals are everywhere: eagle and bird bodies, a monkey\'s tail, a sun-bird\'s centre.',
      'Side views for fish, birds, horse and monkey; top views for lizard and turtle; frontal for the spread eagle and the mask.',
      'A horse appears in the set — post-contact, so a modern pastiche.'
    ],
    measured:{
      note:'Lab measurements on three single emblems (eagle, turtle, lizard) upsampled 2×, and the whole sheet for density.',
      findings:[
        'Near-black ink (#020202–#212121), strokes 2.7–3.3% of emblem size.',
        'Even line (CV 0.11–0.23), but solid ink is only 1–5% of the ink: the "silhouettes" are so perforated by white pattern that they measure as bands, not fills.',
        'Mirror IoU 0.88 on the frontal eagle; 0.48–0.51 on the turtle and lizard in their twisting poses.',
        'Dense dot ornament across the sheet (87 dots).'
      ],
      axes:{density:.52,weight:.46,uniformity:.93,geometry:.27,symmetry:.61,fill:.05,chroma:0,ornament:.4},
      samples:[
        {label:'Whole sheet (16 emblems)',strokeRel:.0059,strokeCV:.14,coverage:.216,solidFrac:.01,bilateral:.62,rotational:.38,folds:4,dots:87},
        {label:'Spread eagle',strokeRel:.0265,strokeCV:.23,coverage:.299,solidFrac:.01,bilateral:.88,rotational:.72,folds:5,dots:2},
        {label:'Turtle',strokeRel:.0324,strokeCV:.12,coverage:.193,solidFrac:.05,bilateral:.51,rotational:.54,folds:16,dots:17},
        {label:'Lizard',strokeRel:.033,strokeCV:.11,coverage:.209,solidFrac:.01,bilateral:.48,rotational:.51,folds:16,dots:7}
      ]
    }
  },
  reading:['Jorge Enciso, Design Motifs of Ancient Mexico (Dover, 1953)']
});

defTradition({
  id:'aztec-revival-line',family:'mesoamerica',provenance:'analyzed',
  name:'Revival line art',sub:'Coloring-page mask and headdress',native:'',
  region:'Global stock graphics',medium:'Vector outline illustration',period:'Contemporary',
  summary:'A dense black-outline illustration made to be coloured in: a frontal feline helmet-mask under a crown of plumes and leaves, a second mask with a protruding tongue below, step-frets and waves at the base. Every surface is subdivided into closed cells, and the whole is mirrored left to right.',
  axes:{density:.74,weight:.09,uniformity:.7,geometry:.36,symmetry:1,fill:.04,chroma:0,ornament:.54,abstraction:.6,narrative:.25},
  genes:{
    structure:{kinds:['totem'],folds:8,density:.9,symmetry:'bilateral',borderBands:1},
    motifs:{hero:['glyphMask'],ring:['featherFan','leaf','stepFret'],filler:['cartouche','stepFret','dot','floret'],border:['greca','dotRow'],petal:'round'},
    line:{weight:2.2,contrast:.3,double:false,wobble:.04,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{none:1},coverage:0,hatchGap:6},
    ornament:{dotRows:.25,echo:.45,echoCount:2,echoStyle:'solid',scallops:.1,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#ffffff',ink:'#111111',fills:['#eeeeee'],gap:'#ffffff'},
    ground:{kind:'none',amount:0}
  },
  rules:[
    'Mirror everything: the composition is one half drawn twice.',
    'Build a vertical stack — plume crown, large frontal mask, smaller mask below, frets at the base.',
    'Back the crown with large leaves fanned outward, then fill every remaining gap.',
    'Subdivide every surface into closed cells (bead rows, frets, rings) so it can be coloured.',
    'One even black line with slight thickening on outer contours; no fills, no tone.'
  ],
  symbolism:'The feline helmet echoes jaguar and eagle warrior regalia; the tongue-out mask borrows from the Sun Stone\'s face. Here they are a modern decorative composite.',
  care:MESO_CARE,
  analysis:{
    source:'Coloring-page illustration of a feline helmet-mask with plumes, leaves and frets (stock reference image; analysed locally, not stored).',
    observations:[
      'A vertical stack on one axis: plume crown, feline helmet with fangs and round eyes, face within, a smaller tongue-out mask below.',
      'Large leaves fan out behind the crown and fill the upper corners.',
      'Step-frets and wave scrolls close the bottom corners; a fret frame encloses the whole.',
      'Every surface is subdivided into closed cells — beads, rings, frets — with no fills.',
      'Left and right halves are mirror images of each other.'
    ],
    measured:{
      note:'Lab measurements on the whole page and the central mask (upsampled 2×).',
      findings:[
        'Mirror IoU 0.99 — effectively perfect, so the drawing was almost certainly mirrored digitally.',
        'Dense: density axis 0.74 for the page, 0.81 for the mask (horror vacui).',
        'Fine black line, 0.7–1% of the image, with mild variation (CV 0.25–0.29) where outer contours thicken.',
        'No fills: solid ink under 2%.'
      ],
      axes:{density:.74,weight:.09,uniformity:.7,geometry:.36,symmetry:1,fill:.04,chroma:0,ornament:.54},
      samples:[
        {label:'Whole page',strokeRel:.0067,strokeCV:.29,coverage:.278,solidFrac:.02,bilateral:.99,rotational:.37,folds:13,dots:14},
        {label:'Central mask',strokeRel:.01,strokeCV:.25,coverage:.323,solidFrac:.02,bilateral:.99,rotational:.33,folds:13,dots:4}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'aztec-glyph-poster',family:'mesoamerica',provenance:'analyzed',
  name:'Glyph-maze poster',sub:'White-on-black glyph wall',native:'',
  region:'Print-on-demand graphics',medium:'Digital print',period:'Contemporary',
  summary:'A modern poster in thick white line on black: a central mask with a huge toothed mouth, flanking masks, ear spools and eyes, and every remaining space packed with rounded glyph blocks, frets and scrolls — a pastiche of Maya and Aztec glyph walls, mirrored and edge to edge, with greys for depth.',
  axes:{density:.98,weight:.27,uniformity:.78,geometry:.46,symmetry:1,fill:.06,chroma:0,ornament:.76,abstraction:.8,narrative:.1},
  genes:{
    structure:{kinds:['glyphwall'],folds:8,density:.98,symmetry:'bilateral',borderBands:0},
    motifs:{hero:['glyphMask'],ring:['cartouche','ollin','sunStone'],filler:['cartouche','stepFret','spiral','cartouche'],border:['greca'],petal:'round'},
    line:{weight:5.5,contrast:.2,double:false,wobble:0,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{none:.6,flat:.4},coverage:.6,hatchGap:6},
    ornament:{dotRows:.08,echo:.5,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#1e1c1d',ink:'#f6f6f4',fills:['#bdbdbd','#8e8e8e','#d6d6d6'],gap:'#1e1c1d'},
    ground:{kind:'none',amount:0}
  },
  rules:[
    'Invert: thick white line on black ground, rounded corners everywhere.',
    'Put the biggest mask on the axis — angry brow, triangular nose, a mouth full of teeth — and flank it with smaller masks.',
    'Pack all remaining space with rounded glyph blocks, frets, scrolls and concentric circles until no black field is left.',
    'Mirror the whole composition.',
    'Use two or three greys behind the white for a second, recessed layer.'
  ],
  symbolism:'Visually closest to Maya glyph blocks and carved stucco masks, filtered through contemporary illustration; it represents no specific text or deity.',
  care:MESO_CARE+' The poster reads as a contemporary digital pastiche; its "glyphs" are not writing.',
  analysis:{
    source:'Poster image: white and grey linework on black, masks and glyph blocks (reference image; analysed locally, not stored).',
    observations:[
      'Thick white line on black, rounded corners and terminals throughout.',
      'A central mask with angry brows, triangular nose and a wide mouth of teeth; two flanking masks with toothed mouths.',
      'Every other space is filled with rounded-rectangle glyph blocks, spirals, step shapes, eyes and concentric circles.',
      'Greys sit behind the white as a second, recessed layer.',
      'Left and right halves mirror each other.'
    ],
    measured:{
      note:'Lab measurements on the art area (frame and wall excluded) and the central mask, upsampled up to 2×. Polarity is detected as light ink on dark ground.',
      findings:[
        'Light-on-dark: white ink (#fbfbfb) covers 48% of the art, on near-black (#1e1c1d).',
        'Densest image measured: density axis 0.98; ornament 1.0 at full-art scale, with 133 dots.',
        'Mirror IoU 0.98 — digitally mirrored.',
        'Thick, fairly even line: 1.5–2.3% of the image, CV 0.22–0.25.'
      ],
      axes:{density:.98,weight:.27,uniformity:.78,geometry:.46,symmetry:1,fill:.06,chroma:0,ornament:.76},
      samples:[
        {label:'Art area',strokeRel:.0154,strokeCV:.25,coverage:.484,solidFrac:0,bilateral:.98,rotational:.58,folds:16,dots:133},
        {label:'Central mask',strokeRel:.0226,strokeCV:.22,coverage:.505,solidFrac:.01,bilateral:.91,rotational:.44,folds:16,dots:2}
      ]
    }
  },
  reading:[]
});

defTradition({
  id:'mexica-codex',family:'mesoamerica',provenance:'curated',
  name:'Codex painting',sub:'Painted screenfold books',native:'tlacuilolli',
  region:'Central Mexico (Mexica) and the Mixteca-Puebla tradition',medium:'Mineral and plant colour on gessoed deerskin or amate bark paper',period:'Late Postclassic to early colonial, c. 1300–1600',
  summary:'The painter-scribe (tlacuilo) wrote by painting: flat colour inside an even black outline, figures in profile, signs in registers, numbers as dots. Divinatory books laid out the 260-day count as grids of day signs paired with numerals; histories and tribute lists followed the same visual grammar.',
  axes:{density:.65,weight:.5,uniformity:.9,geometry:.55,symmetry:.4,fill:.95,chroma:.85,ornament:.4,abstraction:.7,narrative:.95},
  genes:{
    structure:{kinds:['daycount','panel'],folds:8,density:.6,symmetry:'free',borderBands:1},
    motifs:{hero:['eagle','serpent','maquizcoatl','lizard','ollin','xochitl','calli','tecpatl','pyramid'],ring:['ollin','stepFret','floret'],filler:['dot','floret'],border:['dotRow','lines','greca'],petal:'round'},
    line:{weight:2.8,contrast:0,double:false,wobble:.15,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:.1,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#efe4c8',ink:'#1b1714',fills:['#b8322a','#2a8f8c','#e1a62b','#1f4e8c','#f3ecdc','#5e8a3a'],gap:'#efe4c8'},
    ground:{kind:'paper',amount:.45}
  },
  rules:[
    'One even black outline (the tlacuilo\'s line) around every shape; no shading, no perspective.',
    'Fill flat with a small palette: red, turquoise, yellow, blue, white, green.',
    'Lay signs out in a grid of framed cells; pair each sign with a numeral of 1–13 dots.',
    'Draw figures and animals in profile, signs frontally; scale shows importance, not distance.',
    'Frame the page with red rules.'
  ],
  maths:'The 260-day count (tonalpohualli) pairs 13 numbers with 20 signs: both advance by one each day, so a given pairing recurs only after lcm(13, 20) = 260 days. The day-count structure here runs numbers 1–13 across its twenty cells the same way; its signs come from this app\'s motif set, so the sequence is illustrative, not a real calendar.',
  symbolism:'Day signs carried destinies: a child\'s name and fortune came from the day of birth. Colours were symbolic too — turquoise for the precious and the solar, red for blood and the east.',
  care:MESO_CARE+' Most surviving Aztec-style codices are early colonial (made after 1521) or from neighbouring regions; very few pre-conquest books survive.',
  reading:['Elizabeth Hill Boone, Cycles of Time and Meaning in the Mexican Books of Fate (University of Texas Press, 2007)']
});

defTradition({
  id:'sun-stone',family:'mesoamerica',provenance:'curated',
  name:'Calendar stone relief',sub:'After the Piedra del Sol',native:'',
  region:'Tenochtitlan (Mexico City)',medium:'Carved basalt, originally painted',period:'Carved c. 1502–1521; rediscovered 1790',
  summary:'The Mexica Sun Stone, about 3.6 m across, is a cosmos in concentric rings: a central face framed by the movement sign, the four previous world-eras, a ring of the twenty day signs, eight great solar rays, and two fire serpents meeting at the base. Read here as a composition of rings, cells and rays in carved stone.',
  axes:{density:.9,weight:.55,uniformity:.8,geometry:.65,symmetry:.95,fill:.7,chroma:.05,ornament:.9,abstraction:.8,narrative:.6},
  genes:{
    structure:{kinds:['calendar'],folds:8,density:.85,symmetry:'radial',borderBands:0},
    motifs:{hero:['ollin'],ring:['ollin','eagle','serpent','lizard','xochitl','calli','tecpatl','stepFret'],filler:['stepFret','dot'],border:['greca','stepDiamond'],petal:'step'},
    line:{weight:3.2,contrast:.3,double:false,wobble:.1,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:.75,none:.25},coverage:.9,hatchGap:6},
    ornament:{dotRows:.3,echo:.45,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#8b867d',ink:'#2b2824',fills:['#b8b3a9','#a39e94','#c4bfb5'],gap:'#8b867d'},
    ground:{kind:'stone',amount:.75}
  },
  rules:[
    'Organise in concentric rings around one centre; every ring has its own unit and count.',
    'Use the canonical counts: twenty sign cells, eight great rays (with eight lesser between), the four eras grouped into the movement sign.',
    'Carve, don\'t draw: raised flat fields with recessed outlines, one stone colour, light and shadow as the only contrast.',
    'Fill corners outside the disc with step-frets or leave them as rough stone.'
  ],
  symbolism:'The four cartouches around the centre record the four previous suns (4 Jaguar, 4 Wind, 4 Rain, 4 Water), which together with the centre form the date 4 Ollin — the present, fifth era. The central face is usually identified as the sun god Tonatiuh, sometimes as the earth deity Tlaltecuhtli.',
  care:MESO_CARE+' The generator puts the movement sign, not a face, at the centre.',
  reading:['Khristaan D. Villela and Mary Ellen Miller (eds.), The Aztec Calendar Stone (Getty Research Institute, 2010)']
});

defTradition({
  id:'mitla-fretwork',family:'mesoamerica',provenance:'curated',
  name:'Mitla fret mosaic',sub:'Zapotec stone grecas',native:'Lyobaa',
  region:'Mitla, Oaxaca (Zapotec)',medium:'Thousands of cut stones set into walls as mosaic',period:'Postclassic, c. 1200–1521',
  summary:'At Mitla the palace walls are covered in friezes of step-frets built from thousands of small cut stones, panel after panel of different fret patterns between plain mouldings. Zapotec rather than Aztec, it is the source of the "greca" that most modern "Aztec" pattern quotes.',
  axes:{density:.9,weight:.6,uniformity:.95,geometry:1,symmetry:.9,fill:.8,chroma:.1,ornament:.7,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['frieze'],folds:8,density:.9,symmetry:'bilateral',borderBands:1},
    motifs:{hero:['stepFret'],ring:['stepFret','cartouche'],filler:['stepFret','dot'],border:['greca','stepDiamond','zigzag','lines'],petal:'step'},
    line:{weight:3.5,contrast:.2,double:false,wobble:.05,taper:0,breaks:0,dash:null,misreg:0},
    fill:{modes:{flat:1},coverage:1,hatchGap:6},
    ornament:{dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},
    palette:{ground:'#76664f',ink:'#3e3227',fills:['#d8c8ab','#cdbb9b','#d2c2a2'],gap:'#76664f'},
    ground:{kind:'stone',amount:.6}
  },
  rules:[
    'Work in horizontal panels, each one fret pattern repeated end to end.',
    'Separate panels with plain mouldings; vary the pattern from panel to panel.',
    'Build every line from right angles — stairs, hooks, square spirals, stepped lozenges.',
    'Raised fret against a recessed shadow: one stone colour, depth from light.'
  ],
  symbolism:'Commonly read as stylised serpents, water and wind; Mitla (Zapotec Lyobaa, "place of rest") was a centre of funerary ritual.',
  care:'Mitla is a Zapotec site in Oaxaca, not Aztec, though the Mexica knew and conquered the region. The "Aztec" label on fret patterns is a modern conflation.',
  glossary:[
    ['Xicalcoliuhqui','Nahuatl, "twisted gourd": the stepped fret — a run of right-angled steps ending in a hook or square spiral, close cousin of the Greek key meander.'],
    ['Greca','The common Spanish name for the same stepped meander.'],
    ['Almena','A stepped merlon on a temple roof; its silhouette is the stepped "petal" these traditions use where others draw round or pointed petals.']
  ],
  reading:[]
});
