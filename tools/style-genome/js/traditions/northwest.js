'use strict';
/* Pacific Northwest Coast — eleventh culture family. All six traditions are CURATED:
   no reference images were supplied, so nothing here is measured. The formline grammar
   follows Bill Holm's analysis (1965) and lives in js/core/formline.js. Palettes were
   set by eye from published photographs.

   What is left out on purpose: crests. Every creature here is a generic construction.
   No named supernatural being is drawn, no house's or clan's design is copied, no pole
   is generated, and no artist is named. */

defFamily({id:'northwest-coast',name:'Pacific Northwest Coast',native:'Haida · Tlingit · Tsimshian · Heiltsuk · Kwakwa̱ka̱ʼwakw · Nuu-chah-nulth · Coast Salish',
  blurb:'The art of the peoples of the coast from Yakutat Bay to the Columbia River. In the north one design system governs everything painted, carved or woven: the formline, a swelling black band that joins ovoids and U-forms into creatures and bends them to fill any surface — a chest, a hat, a blanket, a bracelet. To the south the forms loosen and colour multiplies, and around the Salish Sea a different grammar is used altogether, cut from the surface with crescents and wedges.'});

const NW_CARE='These designs are not decoration in their own setting. A crest — a raven, a killer whale, a bear shown a particular way — is the property of a lineage, clan or house, displayed by right and validated in front of witnesses at a potlatch; so are the names, songs and stories that go with it. Canada outlawed the potlatch from 1885 to 1951, and much regalia was seized in those years. Today imitation “Northwest Coast style” goods made without the artists are a real harm to living carvers, weavers and printmakers. For those reasons everything this app draws is generic: creatures are built from the shared constructions and stand for no family, no named being is attempted, no totem pole is generated, and no artist is named. A generated picture must not be presented or sold as Indigenous art. To own a design, buy it from an artist of these nations.';
const NW_CONV=[
  ['Formline','The primary design is a continuous band, usually black, that swells and narrows and never ends abruptly. Its inner and outer edges are not parallel.'],
  ['Primary, secondary, tertiary','Black carries the main forms; red sits inside them; the spaces left over are the tertiary, sometimes painted blue-green, sometimes left as the wood. On some pieces black and red change places.'],
  ['Ovoid','A rounded rectangle heavier on top than below, used for eyes, joints and the roots of limbs. The ovoid floating inside it sits high, never centred.'],
  ['U-form','A band bent like a thumbnail with tapering legs: feather, fin, finger, ear, rib. A split U has a pointed tongue inside.'],
  ['Relief','Crescents and three-pointed wedges of ground colour are left where formlines meet, so that junctions stay crisp.'],
  ['Nothing left over','A design fills its field to the edges. Spaces between the main forms are closed with further U-forms and ovoids until only thin slits of ground remain.'],
  ['Split and spread','To cover a chest front or a blanket, a creature is opened along its back and laid out flat, the two halves mirrored about the centre: a face above, hands or feet in the corners, the body between.'],
  ['Told by its features','A creature is identified by a few conventional features — a beaver’s incisors and cross-hatched tail, a killer whale’s tall fin and blowhole, an eagle’s down-curved beak — not by likeness.']
];
const NW_GLOSS=[['Formline','The swelling band that carries a design; the term is Bill Holm’s, 1965.'],['Ovoid','Rounded-rectangle unit used for eyes and joints.'],['U-form','Thumbnail-shaped unit used for feathers, fins and fingers.'],['Trigon','A three-pointed relief slit with curved sides.'],['Crest','An emblem owned by a lineage, clan or house, shown by hereditary right.'],['Potlatch','A ceremonial gathering at which names, crests and rights are publicly claimed, witnessed and paid for with gifts.'],['Bentwood box','A chest whose four sides are one cedar plank, kerfed, steamed and bent, with painted or carved fronts.'],['Naaxein','The Tlingit name for the Chilkat robe, twined from mountain-goat wool and cedar bark.'],['Configurative','A design in which the creature keeps a recognisable outline.'],['Distributive','A design in which the creature’s parts are rearranged to fill the field completely.'],['Spindle whorl','The disc that weights a spindle; Coast Salish whorls are carved on the face the spinner watches.'],['Serigraph','A screen print: the main medium of Northwest Coast graphic art since the 1960s.']];

const nwT=o=>defTradition(Object.assign({family:'northwest-coast',provenance:'curated',care:NW_CARE,conventions:NW_CONV,glossary:NW_GLOSS},o));
const NW_ORN=x=>Object.assign({dotRows:0,echo:0,echoCount:1,echoStyle:'solid',scallops:0,halo:0,gems:null,groundStitch:false},x);
const NW_LINE=(weight,x)=>Object.assign({weight,contrast:.4,double:false,wobble:.012,taper:0,breaks:0,dash:null,misreg:0},x);
const NW_HERO=['flBird','flFish','flWhale','flFace'];

nwT({
  id:'northern-formline',name:'Northern formline painting',sub:'Black primary, red secondary, on cedar',native:'Haida · Tlingit · Tsimshian · Heiltsuk',
  region:'Haida Gwaii, southeast Alaska, the Nass and Skeena rivers, the central coast of British Columbia',medium:'Paint on red and yellow cedar: bentwood chests, house fronts, screens, canoes, hats',period:'Developed long before contact; classic period 18th–19th centuries; continuous to the present',
  summary:'A chest front painted edge to edge. A great face fills the upper half — two eye ovoids under heavy brows, a broad mouth of teeth — and the rest of the creature is folded out beneath it: a body on the centre line, a hand in each lower corner. Black formlines carry everything and never break; red sits inside them as inner ovoids, cheeks and the tongues of split U-forms; the wood shows through as thin slits and crescents.',
  axes:{density:.95,weight:.8,uniformity:.1,geometry:.3,symmetry:.95,fill:.85,chroma:.35,ornament:.5,abstraction:.9,narrative:.5},
  genes:{
    structure:{kinds:['chestFront','roundel'],folds:2,density:.85,symmetry:'bilateral',borderBands:0,bare:.3},
    motifs:{hero:NW_HERO,ring:['flSplitU','flEye','flHand'],filler:['flU','flSplitU','flOvoid'],border:['flOvoidU','flURow'],petal:'round'},
    line:NW_LINE(1.4),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:NW_ORN(),
    palette:{ground:'#d2ad77',ink:'#17130f',fills:['#a8271c','#3f8a82'],ciFills:['#a8271c','#3f8a82','#17130f'],gap:'#d2ad77'},
    ground:{kind:'wood',amount:.4}
  },
  rules:[
    'Rule the field in half and design one side; the other is its mirror.',
    'Place the largest ovoids first — the eyes — then the joints.',
    'Join them with one continuous black formline that swells on the upper side of every curve and thins as it turns under.',
    'Fill the forms with red: inner ovoids set high, cheeks, the tongues of split U-forms.',
    'Close every remaining gap with U-forms, and leave a crescent or wedge of wood wherever lines meet.'
  ],
  maths:'An ovoid is drawn here as three cubic curves a side: an underside that lifts toward the middle, a tight lower corner, and a long shoulder into a bulging top. Its formline is the difference between that outline and a smaller ovoid shifted downward, so the band is about two and a half times as thick on top as below. Larger forms get the same weighting by offsetting each point of the outline inward by a distance that depends on which way the edge faces. A chest design is bilaterally symmetric: one reflection, and nothing else.',
  symbolism:'On a real chest the creature is a crest of the house that owns it, and what is painted is a statement of who the owners are and what they have the right to show. The drawing here keeps the grammar and makes no such statement.'
});

nwT({
  id:'formline-print',name:'Formline graphic print',sub:'One creature, black and red on white paper',native:'serigraph',
  region:'British Columbia, Alaska and Washington',medium:'Screen print on paper; also painted drums and paddles',period:'1960s to the present',
  summary:'A single creature held in its own outline on a clean white sheet: head, body, wing and tail each built from an ovoid and its U-forms, all joined by the black formline, with red inside. Often set in a circle. The print brought the old design system to paper and to a wide public, and artists have used it to push the grammar in new directions.',
  axes:{density:.45,weight:.8,uniformity:.1,geometry:.3,symmetry:.4,fill:.8,chroma:.35,ornament:.3,abstraction:.85,narrative:.4},
  genes:{
    structure:{kinds:['roundel','panel','sheet'],folds:2,density:.15,symmetry:'free',borderBands:0,bare:.85,heroScale:.3},
    motifs:{hero:['flBird','flFish','flWhale'],ring:['flSplitU','flEye'],filler:['flU','flSplitU'],border:['flURow','flOvoidU'],petal:'round'},
    line:NW_LINE(1.2,{wobble:0}),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:NW_ORN(),
    palette:{ground:'#f6f2e8',ink:'#141210',fills:['#b3261c'],ciFills:['#b3261c','#b3261c','#141210'],gap:'#f6f2e8'},
    ground:{kind:'paper',amount:.12}
  },
  rules:[
    'Choose the creature and the few features that identify it.',
    'Keep its silhouette readable: head, body, limbs in their natural order.',
    'Build each part from an ovoid and the U-forms that grow from it.',
    'Run the black formline through all of them without a break.',
    'Use red sparingly, and leave the paper wide around the design.'
  ],
  maths:'A feather or fin is a fan of U-forms from one point, their lengths graded so the tips follow a curve. Each U is a single closed shape: an outer arch and a shorter inner arch that share their two end points, which is what makes the legs taper to nothing.',
  symbolism:'Prints are made for sale and for giving at potlatches; many show the artist’s own crests. A subject is read from its conventional features rather than its likeness.'
});

nwT({
  id:'chilkat-weaving',name:'Chilkat robe',sub:'Formline in twined wool: black, yellow, blue-green',native:'naaxein',
  region:'Tlingit, Haida and Tsimshian territory; named for the Chilkat Tlingit of Klukwan',medium:'Mountain-goat wool over a core of yellow-cedar bark, finger-twined on a hanging warp',period:'Early 19th century to the present',
  summary:'A five-sided dancing blanket with a deep fringe. Broad borders of black and yellow frame a field divided into a wide centre panel and two narrower sides, each packed with formline — the only weaving anywhere that makes true curves and circles. Men painted the design on a pattern board; women wove it, a year or more to a robe.',
  axes:{density:.95,weight:.75,uniformity:.15,geometry:.4,symmetry:.95,fill:.95,chroma:.6,ornament:.5,abstraction:.95,narrative:.4},
  genes:{
    structure:{kinds:['robe'],folds:2,density:.9,symmetry:'bilateral',borderBands:0,bare:.3},
    motifs:{hero:['flFace','flWhale','flBird'],ring:['flEye','flSplitU'],filler:['flU','flOvoid'],border:['flBars','flOvoidU'],petal:'round'},
    line:NW_LINE(1.2),
    fill:{modes:{flat:1},coverage:1,hatchGap:5,tertiary:1},
    ornament:NW_ORN(),
    palette:{ground:'#efe6cd',ink:'#1b1713',fills:['#d8b338','#4f9a93'],ciFills:['#d8b338','#4f9a93','#d8b338'],gap:'#efe6cd'},
    ground:{kind:'cloth',amount:.5}
  },
  rules:[
    'Weave the borders first in the mind: black outside, yellow within.',
    'Divide the field into a centre panel and two sides.',
    'Lay the creature out across the centre, face uppermost.',
    'Fill the side panels with its remaining parts, or with a second view of it.',
    'Leave no warp bare: every space takes an ovoid, a U or a circle in yellow or blue-green.'
  ],
  maths:'The robe is a pentagon: a rectangle whose lower edge drops to a shallow point, so the fringe hangs in a curve when worn. The design is clipped to that convex outline, and is mirror-symmetric about the line that falls down the wearer’s spine.',
  symbolism:'A robe is worn in dance, where its fringe sways; it is among the most valued things a family can own, and is given, inherited and sometimes cut into pieces as gifts. Its design shows the owner’s crest in a form so abstract that even weavers may disagree about which creature it is.'
});

nwT({
  id:'kwakwakawakw-painting',name:'Kwakwa̱ka̱ʼwakw painting',sub:'Bolder forms, more colours, freer line',native:'Kwakwa̱ka̱ʼwakw',
  region:'Northern Vancouver Island and the adjacent mainland',medium:'Commercial and mineral paints on cedar: house fronts, screens, drums, masks, canoes',period:'19th century to the present',
  summary:'The northern grammar taken south and loosened. The same ovoids and U-forms, but the forms are larger and more separate, white is painted rather than left, and green, yellow and orange join the black and red. Fine parallel dashes fill some spaces. The design reads from across a dance house by firelight.',
  axes:{density:.8,weight:.85,uniformity:.15,geometry:.3,symmetry:.9,fill:.95,chroma:.8,ornament:.6,abstraction:.85,narrative:.6},
  genes:{
    structure:{kinds:['chestFront','roundel','panel'],folds:2,density:.7,symmetry:'bilateral',borderBands:1,bare:.3,heroScale:.25},
    motifs:{hero:NW_HERO,ring:['flWing','flHand','flEye'],filler:['flSplitU','flU','flOvoid'],border:['flURow','flOvoidU'],petal:'round'},
    line:NW_LINE(1.6,{wobble:.02}),
    fill:{modes:{flat:.85,dashes:.15},coverage:1,hatchGap:5,tertiary:1},
    ornament:NW_ORN(),
    palette:{ground:'#f1ead8',ink:'#161310',fills:['#b02a1e','#2f7d55','#e0ad2b','#d5672a'],ciFills:['#b02a1e','#2f7d55','#e0ad2b','#d5672a'],gap:'#f1ead8'},
    ground:{kind:'wood',amount:.3}
  },
  rules:[
    'Draw big: fewer forms, each more boldly shaped.',
    'Keep black for the main formline, then give each kind of inner form its own colour.',
    'Paint the white; do not rely on bare wood.',
    'Let forms stand a little apart instead of locking every edge.',
    'Add short parallel dashes inside a form where it wants texture.'
  ],
  maths:'The constructions are the same as in the north; what changes is proportion. Forms are scaled up against the field and the secondary palette is indexed by position, so the first inner form takes red, the next green, the next yellow.',
  symbolism:'Painted screens, house fronts and regalia belong to the winter ceremonies, in which families show the dances and beings they hold the right to. None of those beings is drawn here.'
});

nwT({
  id:'engraved-silver',name:'Engraved silver and argillite',sub:'Formline in cut line and cross-hatching',native:'—',
  region:'Haida Gwaii and the northern coast',medium:'Bracelets hammered from silver or gold coin and engraved; carved black argillite slate',period:'Mid-19th century to the present',
  summary:'The formline design with no paint at all. The primary forms are left as polished metal; the secondary areas and the background are cut back and cross-hatched so they read darker; a fine engraved line edges everything. The design wraps a bracelet as a long band, the creature’s head at the centre and its body running out to the clasp on both sides.',
  axes:{density:.85,weight:.25,uniformity:.5,geometry:.3,symmetry:.9,fill:.4,chroma:.05,ornament:.6,abstraction:.9,narrative:.4},
  genes:{
    structure:{kinds:['roundel','chestFront','panel'],folds:2,density:.6,symmetry:'bilateral',borderBands:1,bare:.5,heroScale:.25},
    motifs:{hero:NW_HERO,ring:['flEye','flSplitU'],filler:['flU','flSplitU'],border:['flOvoidU','flURow'],petal:'round'},
    line:NW_LINE(1.0,{wobble:0}),
    fill:{modes:{crosshatch:1},coverage:1,hatchGap:3.4},
    ornament:NW_ORN({relief:-.25}),
    palette:{ground:'#d9dbdc',ink:'#2b2e33',fills:['#9ea3a8','#b9bdc1'],ciFills:['#c2c6ca','#c2c6ca','#c2c6ca'],gap:'#d9dbdc'},
    ground:{kind:'metal',amount:.5}
  },
  rules:[
    'Lay the design out as a band, head at the centre.',
    'Engrave the edge of every formline with one clean cut.',
    'Cross-hatch the secondary forms and the background, finely and evenly.',
    'Leave the primary forms as bright metal.',
    'Keep the hatching in one pair of directions over the whole piece.'
  ],
  maths:'With one material there is no colour to separate primary from secondary, so tone does it: hatching is a fill mode like any other, and the forms that would be red are hatched instead of painted.',
  symbolism:'Bracelets are given at potlatches and weddings and worn as a mark of crest and standing; argillite carving began as work for sale to visitors and became a major art in its own right.'
});

nwT({
  id:'coast-salish',name:'Coast Salish carved design',sub:'Crescents, wedges and circles cut from the surface',native:'Coast Salish',
  region:'The Salish Sea: the Fraser River and Strait of Georgia, Puget Sound, southern Vancouver Island',medium:'Carved wood and horn: spindle whorls, combs, rattles, house posts; today also prints and glass',period:'At least two thousand years, to the present',
  summary:'Not formline. The design is what is left when three shapes are cut away from a smooth surface: crescents, three-pointed wedges and circles. On a spindle whorl they turn around the central hole, so that the pattern blurs and seems to move as the whorl spins. Figures, where they appear, are outlined by the same cuts.',
  axes:{density:.6,weight:.5,uniformity:.4,geometry:.4,symmetry:.8,fill:.7,chroma:.15,ornament:.5,abstraction:.9,narrative:.3},
  genes:{
    structure:{kinds:['whorl'],folds:3,density:.5,symmetry:'radial',borderBands:0,bare:.8},
    motifs:{hero:['slCrescent','slTrigon'],ring:['slCrescent','slTrigon'],filler:['slCrescent','slTrigon','dot'],border:['wave','lines'],petal:'round'},
    line:NW_LINE(1.3),
    fill:{modes:{flat:1},coverage:1,hatchGap:5},
    ornament:NW_ORN({relief:-.45}),
    palette:{ground:'#ecdcbc',ink:'#3a2414',fills:['#9a6234','#7b4a26'],ciFills:['#9a6234','#7b4a26'],gap:'#ecdcbc'},
    ground:{kind:'wood',amount:.5}
  },
  rules:[
    'Start from the smooth surface: the design is the part you do not cut.',
    'Use only three cuts: the crescent, the wedge and the circle.',
    'Set the cuts in rings about the centre and repeat them two, three or four times round.',
    'Let wedges sit where three forms meet, crescents where a form curves.',
    'Give the whole a direction of turn.'
  ],
  maths:'A whorl design has rotational symmetry only: it is turned two, three or four times about the spindle hole, with no mirror line, which is why it appears to spin. A wedge is the gap left between three circles that touch; a crescent is the gap between two circles of different size.',
  symbolism:'The whorl is watched by the spinner as the wool is drawn; its carving belongs to the making of blankets that are themselves wealth. The meanings of particular designs are held closely and are not for a stranger to explain.'
});
