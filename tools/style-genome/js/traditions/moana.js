'use strict';
/* Polynesia — nineteenth culture family: the islands of the Polynesian triangle other
   than Aotearoa. (Māori art is its own family.) All five traditions are CURATED: no
   reference images were supplied, so nothing here is measured. Panels, kupesi, stamps,
   quilts and carving signs live in js/core/moana.js. Palettes were set by eye from
   published photographs.

   Tatau (tattooing) is not generated for any island group. */

defFamily({id:'polynesia',name:'Polynesia',native:'Moana · Te Moana-nui-a-Kiwa',
  blurb:'The arts of the islands settled by one seafaring people across a third of the Pacific: Samoa and Tonga in the west, the Marquesas in the east, Hawaiʻi in the north. Cloth beaten from bark and painted in squares, or rubbed in rows, or printed with bamboo stamps a finger wide; quilts cut like paper snowflakes and stitched in ripples; wood carved into compartments, each with a wide-eyed face. Aotearoa, the southern corner of the triangle, has its own family here under Māori.'});

const MO_CARE='These belong to living peoples, and each island group has its own names, makers and rules. Barkcloth is wealth: Samoan siapo and Tongan ngatu are made by groups of women, given at weddings, funerals and the installation of chiefs, and the designs on a ngatu can mark rank. Hawaiian kapa-making stopped in the nineteenth century and was brought back from museum pieces by Hawaiian makers from the 1970s. A Hawaiian quilt pattern belonged to the woman who designed it, and copying it without being given it was a wrong; the two patterns here are generic versions of well-known subjects, not any named quilt. Marquesan design was banned along with tattooing under French rule and survived in carving and in drawings made by a visitor in the 1890s; it has been revived by Marquesans since the 1980s. Tatau — Samoan peʻa and malu, Marquesan patutiki, Hawaiian kākau — uses the same signs as the cloth and the carving, but it is given by a master, earned by the wearer and specific to a family; no tattoo is generated here. Meanings given for individual designs are the names their makers use; older meanings are mostly lost.';
const MO_CONV=[
  ['Bark, beaten','The inner bark of the paper mulberry is soaked and beaten out to many times its width, and sheets are felted or pasted together into cloths that can be fifty metres long.'],
  ['Earth colours','Brown from the bark of the candlenut or mangrove, black from candlenut soot, red from ochre: the same three everywhere, on the pale ground of the bark.'],
  ['Named designs','A design has a name and a source in the shore or the garden — trochus shell, pandanus bloom, starfish, net — and is recognisably that design however it is varied.'],
  ['Rule, then fill','A cloth is divided first, into squares or rows, and the divisions are filled one by one.'],
  ['Repeat by tool','How a pattern repeats shows how it was made: a painted square, a rubbed board the length of an arm, a stamp the width of a finger.'],
  ['Fold and cut','A Hawaiian quilt design is cut through eight layers at once, so it has the eight symmetries of a square.'],
  ['Echo','Quilting lines follow the outline of the appliqué outward, a finger’s width apart, like ripples from a stone.'],
  ['Compartments','Marquesan carving leaves no surface plain: it is divided into fields by raised bands and every field takes a sign.']
];
const MO_GLOSS=[['Siapo','Samoan barkcloth. Siapo mamanu is painted freehand; siapo ʻelei is rubbed over a board.'],['Ngatu','Tongan barkcloth.'],['Kupesi','The Tongan pattern board, and the design on it.'],['Kapa','Hawaiian barkcloth.'],['ʻOhe kāpala','Bamboo stamps for printing kapa.'],['Kapa kuiki','A Hawaiian quilt.'],['ʻUlu','Breadfruit.'],['Tiki','A carved human figure; in the Marquesas, a deified ancestor.'],['ʻEnata','Person; Te Henua ʻEnata, “the land of people”, is the Marquesans’ name for their islands.'],['Tatau','Tattoo; the English word comes from it.']];

const moT=o=>defTradition(Object.assign({family:'polynesia',provenance:'curated',care:MO_CARE,conventions:MO_CONV,glossary:MO_GLOSS},o));
const MO_ORN=x=>Object.assign({dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},x);
const MO_LINE=(weight,x)=>Object.assign({weight,contrast:.4,double:false,wobble:.03,taper:0,breaks:0,dash:null,misreg:0},x);

moT({
  id:'samoan-siapo',name:'Samoan siapo',sub:'Barkcloth in painted squares',native:'siapo mamanu',
  region:'Samoa and American Samoa',medium:'Beaten paper-mulberry bark painted freehand with a pandanus-key brush in bark dye, soot and red earth',period:'Old; the freehand manner flourished from the late 1800s and is made today',
  summary:'A square of pale, slightly rough cloth ruled into a grid, with a broad brown margin. In each square a different design, drawn boldly in dark brown with touches of black and red earth: an eight-armed starfish, ranks of small triangles, long leaves on a slant, a net of crossed lines with dots, a ringed moon, a four-petalled bloom. The squares are arranged so the cloth balances, but no two cloths are alike.',
  axes:{density:.8,weight:.6,uniformity:.5,geometry:.8,symmetry:.7,fill:.8,chroma:.3,ornament:.7,abstraction:.9,narrative:0},
  genes:{
    structure:{kinds:['tapa'],folds:4,density:.5,symmetry:'grid',borderBands:0,bare:1},
    motifs:{hero:['spAveau','spSigano','spMasina'],ring:['spAliao','spPaogo','spMasina'],filler:['dot'],border:['zigzag','lines'],tile:['siapoMamanu'],petal:'pointed'},
    line:MO_LINE(2),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:MO_ORN(),
    palette:{ground:'#e6d6b0',ink:'#3a2212',fills:['#6b3d1f','#a8452a','#b98a52'],ciFills:['#6b3d1f','#1f1712','#a8452a','#b98a52','#c96f2c','#d9a83a'],gap:'#e6d6b0'},
    ground:{kind:'paper',amount:.6}
  },
  rules:[
    'Strip, soak and scrape the bark; beat it out on a wooden anvil; dry it in the sun.',
    'Rule the cloth into squares with a straight edge and brown dye.',
    'Fill each square with one design, drawing with the dry end of a pandanus key.',
    'Balance the cloth: repeat a design across the middle or at the corners.',
    'Touch in black and red last.'
  ],
  maths:'The cloth is a grid, and a design is assigned to each cell. In the app the assignment is a small table repeated with mirror symmetry, so the same design returns at mirrored positions. Each design has the symmetry of the square or of its diagonal: the starfish all eight, the leaves only the reflection in one diagonal.',
  symbolism:'Siapo is given: at a wedding, a funeral, the conferring of a title. It was clothing, bedding and the wrapping of the dead. The designs name ordinary things of the shore and garden, and the skill lies in the hand and the arrangement.'
});

moT({
  id:'tongan-ngatu',name:'Tongan ngatu',sub:'Barkcloth in rubbed rows',native:'ngatu',
  region:'Tonga',medium:'Beaten bark pasted in two layers and rubbed with dye over pattern boards, then overpainted by hand',period:'Old; made today in great quantity',
  summary:'A long cloth the colour of tea, crossed by rows. Each row repeats one design from edge to edge: four triangles turning about a point, a line of small pines, triangles meeting point to point, crossed bands with a lozenge. Between the rows run ruled lines and a line of dots. The printed browns are soft, from rubbing; the black and the dark outlines, added by brush, are sharp.',
  axes:{density:.9,weight:.6,uniformity:.9,geometry:.9,symmetry:.8,fill:.8,chroma:.3,ornament:.7,abstraction:.9,narrative:.1},
  genes:{
    structure:{kinds:['tapa'],folds:4,density:.7,symmetry:'grid',borderBands:0,bare:1},
    motifs:{hero:['ngManulua','ngFata'],ring:['ngPaini','ngTokelau','ngManulua'],filler:['dot'],border:['zigzag','lines'],tile:['ngatuKupesi'],petal:'pointed'},
    line:MO_LINE(1.8),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:MO_ORN(),
    palette:{ground:'#dcc59a',ink:'#2a1a10',fills:['#7a3b22','#4a2a18','#a9743f'],ciFills:['#7a3b22','#1c1410','#9c4a2a','#a9743f','#b5652c','#caa24a'],gap:'#dcc59a'},
    ground:{kind:'paper',amount:.65}
  },
  rules:[
    'Lash the pattern boards along a long curved bench.',
    'Lay a strip of bark over them, paste a second across it, and rub with a dye-soaked pad so the design comes up.',
    'Move the cloth on by one row; change the boards for the next design.',
    'Number the rows along the white edge.',
    'Spread the cloth in the sun and paint over the rubbed design in dark brown and black.'
  ],
  maths:'A ngatu is a stack of friezes. Each row is one board repeated by translation, so its symmetry is that of the board: the two-birds design has a four-fold turn, the pines only an upright mirror. Length is counted in rows, and a cloth is named for its count.',
  symbolism:'Ngatu is koloa, women’s wealth: presented by the length at royal weddings and funerals, and cut up and shared afterwards. Some designs belong to the royal house. The road of pines is the avenue to the palace; the crossed lashing is the beam of the Tuʻi Tonga’s house.'
});

moT({
  id:'hawaiian-kapa',name:'Hawaiian kapa',sub:'Fine bands printed with bamboo stamps',native:'kapa · ʻohe kāpala',
  region:'Hawaiʻi',medium:'Twice-beaten bark, often watermarked by the beater, printed with carved bamboo stamps and ruled with bamboo liners',period:'Finest in the late 1700s and early 1800s; revived since the 1970s',
  summary:'A sheet as fine as paper, almost white. Across it run narrow bands of pattern in black and a strong red, with clear cloth between: rows of minute triangles, nested chevrons, lozenges within lozenges, ruled lines. Each band is the print of one small stamp set down again and again, and close to, the joins show.',
  axes:{density:.6,weight:.3,uniformity:.95,geometry:1,symmetry:.8,fill:.7,chroma:.5,ornament:.6,abstraction:1,narrative:0},
  genes:{
    structure:{kinds:['kapa'],folds:4,density:.6,symmetry:'grid',borderBands:0,bare:1},
    motifs:{hero:['spAveau'],ring:['spAliao'],filler:['dot'],border:['okNiho','okChevron','okNet','okLines','okZigzag'],petal:'pointed'},
    line:MO_LINE(0.8,{wobble:.01}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:MO_ORN(),
    palette:{ground:'#efe6cf',ink:'#3a3028',fills:['#1c1917','#a3312a','#d2a52f'],ciFills:['#5a4632','#1c1917','#a3312a','#d2a52f','#7a5a3c','#c9b68a'],gap:'#efe6cf'},
    ground:{kind:'paper',amount:.5}
  },
  rules:[
    'Beat the bark twice, the second time after it has fermented, with a beater carved in a pattern that shows when the cloth is held to the light.',
    'Carve a design in the end of a strip of bamboo a finger wide.',
    'Dip the stamp and print it end to end along a ruled line.',
    'Change stamp and colour for the next band.',
    'Leave clear cloth between the bands.'
  ],
  maths:'Each band is a frieze: one small motif translated along a line. Because the stamp is short, the period of the pattern is the length of the stamp, a few centimetres, however long the band. The motifs are the simplest that tile a strip: triangles, chevrons, lozenges.',
  symbolism:'Kapa was clothing, bedding and the wrapping of gods and the dead; the finest was made for chiefs. The stamp patterns have names, many from fishing: shark teeth, the eyes of the net. The craft was lost within a lifetime of contact and has been rebuilt by Hawaiian makers from old cloths and old tools.'
});

moT({
  id:'hawaiian-quilt',name:'Hawaiian quilt',sub:'One eight-fold appliqué, echo quilting',native:'kapa kuiki',
  region:'Hawaiʻi; sister traditions are the tīfaifai of Tahiti and the tivaevae of the Cook Islands',medium:'Cotton appliqué in one colour on a ground of another, quilted by hand',period:'From the 1820s, when missionaries’ wives taught sewing; the form was fixed by the 1870s',
  summary:'A square of white cloth, and on it one great red figure with the symmetry of a snowflake: eight branches from the centre, lobed breadfruit leaves and round fruit. A border of the same red runs round the edge. The whole surface is quilted in lines that follow the outline of the red figure outward, line after line, until they meet the border.',
  axes:{density:.6,weight:.4,uniformity:.8,geometry:.5,symmetry:1,fill:1,chroma:.8,ornament:.6,abstraction:.6,narrative:.1},
  genes:{
    structure:{kinds:['kapaKuiki'],folds:8,density:.5,symmetry:'radial',borderBands:1,bare:1},
    motifs:{hero:['hqUlu','hqHala'],ring:['hqUlu'],filler:['dot'],border:['hqLei'],petal:'round'},
    line:MO_LINE(1,{wobble:0,dash:'stitch'}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:MO_ORN(),
    palette:{ground:'#f5f1e6',ink:'#ad9f80',fills:['#b3202a'],ciFills:['#b3202a','#1f5f3a','#d9a52b','#27458f','#c9578a','#e07a2a'],gap:'#f5f1e6'},
    ground:{kind:'cloth',amount:.35}
  },
  rules:[
    'Fold a square of cloth in half, in half again, and once on the diagonal.',
    'Draw one eighth of the design on the folded cloth and cut through all eight layers.',
    'Open it out on the ground cloth, baste it flat from the centre, and turn the edge under with a needle as you sew.',
    'Quilt in the appliqué first, then follow its outline outward, a finger’s width at a time.',
    'Sleep under it for one night before giving it away.'
  ],
  maths:'Folding in eighths gives the design the eight symmetries of the square: four mirror lines and quarter turns. Only one eighth is ever drawn. The quilting lines are level curves of distance: every point on the first line is the same distance from the appliqué, every point on the second twice that. The app computes them that way, by measuring distance from the design across a grid and tracing the contours.',
  symbolism:'A quilt holds the mana of its maker and was burned or buried with her rather than fall to strangers. The breadfruit is the first pattern, for plenty; other patterns record a garden, a visit, a queen. In 1893, when the kingdom was overthrown, women quilted its flag.'
});

moT({
  id:'marquesan-carving',name:'Marquesan carving',sub:'Compartments, each with a wide-eyed sign',native:'haʻatiki',
  region:'Te Henua ʻEnata, the Marquesas Islands',medium:'Hardwood, bone and stone carved in low relief: bowls, paddles, clubs, house posts',period:'Classic pieces from the 1700s and 1800s; revived since the 1980s',
  summary:'A dark board with no plain surface left. Raised bands divide it into compartments. In the largest is a face: two great ringed eyes filling its upper half, a flat nose with spiral nostrils, a mouth as wide as the face with the tongue lying in it. Around it, in smaller fields, are a squat figure with raised arms, a turtle seen from above, a single eye under a curling brow. Edges are cut into teeth and fine hatching.',
  axes:{density:1,weight:.7,uniformity:.7,geometry:.7,symmetry:.9,fill:.6,chroma:.1,ornament:.9,abstraction:.9,narrative:.3},
  genes:{
    structure:{kinds:['mqPanel'],folds:4,density:.9,symmetry:'bilateral',borderBands:1,bare:.9},
    motifs:{hero:['mqTiki'],ring:['mqEnata','mqHonu','mqMata'],filler:['dot'],border:['mqNiho','mqKohau'],petal:'round'},
    line:MO_LINE(2,{wobble:.01}),
    fill:{modes:{flat:1},coverage:1,hatchGap:4},
    ornament:MO_ORN({relief:.5}),
    palette:{ground:'#7a5636',ink:'#22140b',fills:['#3a2415','#a3774a'],ciFills:['#3a2415','#22140b','#8a4a2a','#a3774a','#5a3a22','#c29a62'],gap:'#7a5636'},
    ground:{kind:'wood',amount:.6}
  },
  rules:[
    'Divide the surface into fields with bands left standing.',
    'Give the largest field to the face.',
    'Cut each sign by lowering the ground round it, so it stands at the level of the bands.',
    'Make the eyes first and largest.',
    'Fill every remaining edge with teeth or fine parallel cuts.'
  ],
  maths:'The layout is a dissection of a rectangle into smaller rectangles, mirrored left to right. The face is built almost entirely of concentric ovals and two-way spirals, and is itself mirror-symmetric. Nothing is left as ground: the pattern and its background have about equal area, which is what makes Marquesan design read as a texture from a distance.',
  symbolism:'Tiki is the first ancestor and every carved figure is one; the eyes are the seat of power and the mouth of speech. The turtle passes between worlds. The human sign is a person and a people. The same signs were worn on the skin, where they recorded who someone was; those are not drawn here.'
});
