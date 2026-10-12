'use strict';
/* Glossaries and verified sources, applied after every family has loaded.
   Glossary entries are only added where a tradition has none of its own (families that
   define glossaries inline — Celtic, Japan, China — keep theirs; only gaps are filled).
   Every source URL below returned HTTP 200 when checked (the Egyptian, deity, Māori and Aboriginal
   Australian links on 2026-10-11, the rest on 2026-10-09); links that
   could not be verified (e.g. two culture-loom citations that now block or time out)
   were left out rather than shipped dead. Add new links only after checking them. */

const SOURCES_CHECKED='11 October 2026';
const WM=(label,slug)=>[label+' — Wikipedia','https://en.wikipedia.org/wiki/'+slug];
const AB_CODE=['Indigenous Art Code — buying ethically','https://indigenousartcode.org/'];
const W=a=>[a.replace(/_/g,' ').replace(/%C3%A8/g,'è').replace(/%C5%8D/g,'ō').replace(/%27/g,'’')+' — Wikipedia','https://en.wikipedia.org/wiki/'+a];

const GLOSSARY_ADD={
  'deepavali-icon':[['Dīpa / diyā','The clay oil lamp, lit in rows at doorways and windows.'],['Ākāś kandīl','The "sky lantern": a star-shaped paper lantern hung outside the house for Dīpāvalī.'],['Pūrṇa-kalaśa','The full pot crowned with mango leaves and a coconut — abundance and welcome.'],['Mithāī','Festival sweets exchanged between households — laḍḍū, barfi, the spiral jalebi.']],
  'devotional-line-art':[['Vīṇā','The long-necked plucked string instrument Sarasvatī plays.'],['Siṁhavāhinī','"Riding a lion (or tiger)": Durgā.'],['Mūrti','An embodied image of a deity — the object of worship in a shrine, made by the canons of the śilpa-śāstra.'],['Padma','The lotus: grows up through muddy water to bloom clean, so it stands for purity and unfolding awareness; used as pedestal, hand emblem and border.'],['Abhaya-mudrā','The raised open palm: "fear not".'],['Bhaṅga','The bends of a figure\'s body; tribhaṅga, "three bends", sets head, torso and hips at opposing angles.'],['Tāla','The unit of iconometry — roughly a face-length — in which figure proportions are prescribed.']],
  'madhubani':[['Kohbar','The painting on the wall of the marriage chamber: lotus pond, bamboo grove, paired fish.'],['Bharnī','"Filled" style: regions flooded with flat colour.'],['Kachnī','"Line" style: regions filled with fine black hatching.'],['Mithilā','The region in north Bihar and south Nepal where the tradition lives.']],
  'warli':[['Chauk','The square sacred enclosure at the centre of a marriage painting.'],['Tārpā','A gourd wind instrument; the dancers spiral around its player.'],['Geru','The red-ochre wash on the mud wall that the white paint is laid over.']],
  'gond':[['Pardhan','The Gond community of bards and musicians from whom the painting tradition emerged.'],['Digna','Geometric patterns painted on the floors and walls of Gond houses.'],['Jangarh kalam','"Jangarh\'s pen" — the name for the contemporary Gond school founded by Jangarh Singh Shyam.']],
  'kalamkari':[['Kalam','The bamboo pen that gives the craft its name ("pen-work").'],['Mordant','A metal salt (alum, iron) printed or painted on cloth so that a dye bath fixes colour only there.'],['Myrobalan','Fruit tannin (harad) used to prepare the cloth and as a base for yellows and blacks.'],['Chintz','The European name for the painted and printed Indian cottons, from Hindi chīṇṭ.']],
  'pattachitra':[['Paṭṭa','Cloth — the primed, burnished canvas; paṭṭachitra is "cloth picture".'],['Chitrakār','The hereditary painter community of Puri and Raghurajpur.']],
  'tanjore':[['Chattra','The royal parasol held over a deity.'],['Kuthuvilakku','The tall brass standing oil lamp of south Indian homes and temples.'],['Gesso relief','Chalk paste built up in raised layers under the gold foil on ornaments and arches.'],['Gold foil','Thin gold leaf laid over the gesso; with glass "gems" it gives the panels their glow.']],
  'kolam':[['Pulli','The dot grid laid first.'],['Sikku kolam','"Knot" kolam: lines looping around the dots, ideally one closed line.'],['Kāvi','The red-ochre border added on festival days.'],['Mārgaḻi','The Tamil month (mid-December to mid-January) when kolams are at their largest.']],
  'rangoli':[['Alpana','Bengal\'s floor painting in rice paste.'],['Muggu','The Andhra and Telangana threshold drawing.'],['Mandana','Rajasthan\'s floor and wall painting in white on red earth.']],
  'mehndi':[['Jāl','The net or lattice fill of cross-hatching.'],['Kairī','The mango — the paisley form.'],['Cone','The paper cone the paste is piped from; lifting it mid-stroke makes the tapering line.']],
  'mughal-illumination':[['Muraqqaʿ','An imperial album of paintings and calligraphy, each leaf framed by borders.'],['Hāshiya','The wide decorated margin around an album page.']],
  'kerala-mural':[['Pañcavarṇa','"Five colours": red ochre, yellow ochre, green, white and black — the prescribed palette.'],['Chuvarchitram','Malayalam for wall painting.']],
  'ajrakh':[['Resist','A paste printed onto cloth to keep the dye off; washed out later, it leaves the white lines and dots.'],['Khatri','The community of dyers and block printers who make ajrakh in Kutch and Sindh.'],['Maldhari','The pastoral herding communities who wear it.']],
  'jaali':[['Jālī','"Net": a stone screen pierced with a geometric or floral lattice.']],
  'kantha':[['Nakshi kantha','"Figured" kantha, embroidered with motifs and scenes rather than plain quilting.'],['Running stitch','The single stitch the whole tradition is built from.']],
  'mongol-calligraphy':[['Mongol bichig','The traditional vertical Mongolian script.'],['Uran bichleg','Calligraphy — "skilled writing".'],['Titem','The crown: the pressed, angled stroke that opens a word.'],['Nuruu','The spine every letter hangs from.'],['Shüd','Teeth: short strokes flicked to the left.'],['Gedes','Loops ("bellies") swelling to the right.'],['Süül','The closing tail of a word.'],['Tamga','A seal or stamp.']],
  'mongol-script-figures':[['Deel','The long robe of Mongolian dress, wrapped and belted.'],['Uran bichleg','Calligraphy.'],['Tamga','A seal or stamp.']],
  'mongol-khee':[['Khee','Ornament, pattern.'],['Ugalz','The ram\'s-horn scroll.'],['Alkhan khee','The hammer pattern: an interlocking fret.'],['Ölzii','The endless knot of happiness.'],['Tümen nasan','"Ten thousand years": a continuous fret wishing long life.']],
  'shirdeg':[['Shirdeg','A quilted felt mat for the ger floor.'],['Esgii','Felt.'],['Couched cord','Twisted cord laid on the surface and stitched down, giving a raised outline.']],
  'aztec-line-icons':[['Xicalcoliuhqui','The stepped fret (greca).'],['Teocalli','"God-house": the temple pyramid.']],
  'aztec-stamp':[['Sello','A fired-clay stamp, flat or cylindrical, pressed onto cloth, paper or skin.'],['Coatl, cuetzpalin, cuauhtli, ozomatli','Serpent, lizard, eagle, monkey — day signs of the 260-day count that recur on stamps.']],
  'aztec-revival-line':[['Quetzalli','A precious long plume, above all from the quetzal bird.'],['Eagle and jaguar warriors','The two elite Mexica military orders, whose helmets inspire the feline mask.']],
  'aztec-glyph-poster':[['Glyph block','The square unit of Maya hieroglyphic writing, combining a main sign with affixes.'],['Bar and dot','Maya numerals: a bar is five, a dot is one.']],
  'mexica-codex':[['Tlacuilo','The painter-scribe.'],['Tonalpohualli','The 260-day count: 13 numbers paired with 20 day signs.'],['Āmatl','Bark paper (Spanish amate).'],['Screenfold','A long strip folded like an accordion — the format of the painted books.']],
  'sun-stone':[['Piedra del Sol','The Sun Stone, the Mexica calendar disc found in 1790.'],['Ollin','Movement; the present era is 4 Ollin.'],['Xiuhcoatl','The fire serpent; two encircle the stone\'s outer rim.']],
  'mitla-fretwork':[['Lyobaa','The Zapotec name of Mitla: "place of rest".']],
  'bronze-leiwen':[['Huiwen','The Chinese key-fret meander, descended from the Zhou-era yunwen/leiwen cloud-and-thunder pattern.']]
};
const DEITY_GLOSSARY=[['Vīṇā','The long-necked plucked string instrument Sarasvatī plays.'],['Akṣamālā','A rosary of beads.'],['Pustaka','A palm-leaf book: learning.'],['Siṁhavāhinī','"Riding a lion (or tiger)": Durgā.'],['Tilak','The mark on the forehead: Gaṇeśa\'s red dot or line, Kṛṣṇa\'s U-shaped Vaiṣṇava mark.'],['Mukuṭa','A crown.'],['Ekadanta','"One-tusked": Gaṇeśa with his single tusk.'],['Modaka','Gaṇeśa\'s sweet dumpling.'],['Mūṣaka','Gaṇeśa\'s mouse.'],['Bāṁsurī','Kṛṣṇa\'s bamboo flute.'],['Mor paṅkh','The peacock feather in Kṛṣṇa\'s crown.'],['Tribhaṅga','The thrice-bent standing pose of Kṛṣṇa playing the flute.'],['Gadā','Hanumān\'s mace.'],['Droṇagiri','The mountain of healing herbs Hanumān carries.'],
  ['Tālamāna','The system of proportion in the śilpa texts: the face (chin to hairline) is one tāla of twelve aṅgula, and every other length is given in those units. A principal deity is ten tāla tall (daśatāla), a goddess often nine (navatāla).'],
  ['Kirīṭa-mukuṭa','The tall crown of Viṣṇu and his avatars: brow band, a front of leaf-shaped plates, a ribbed dome and a finial.'],
  ['Karaṇḍa-mukuṭa','A crown of diminishing rounded tiers, worn by goddesses and by Gaṇeśa.'],
  ['Jaṭā-mukuṭa','Matted hair piled and bound as a crown: Śiva\'s, and the ascetic\'s.'],
  ['Śiraścakra','The disc-shaped halo behind the head.'],
  ['Prabhāvalī','The arch of flames around a whole image.'],
  ['Nāga-phaṇa','A canopy of cobra hoods.'],
  ['Padmapīṭha','The double-lotus pedestal.'],
  ['Vanamālā','The long garland of forest flowers worn by Viṣṇu, Rāma and Kṛṣṇa.'],
  ['Kaṭaka','The hand pose with thumb and finger joined in a ring, made to hold a flower; icons were often cast with it empty so that a fresh flower could be placed there each day.'],
];
for(const id of ['deity-brush-mark','deity-tattoo-line','deity-silhouette','deity-woodburn','deity-stencil'])GLOSSARY_ADD[id]=DEITY_GLOSSARY;

const EGYPT_GLOSSARY=[
  ['Hieroglyph','Greek "sacred carving"; the Egyptians said mdw nṯr, "the god\'s words". About 700 signs were in common use: some stand for sounds, some for whole words, some only mark what kind of word precedes them.'],
  ['Gardiner code','The standard catalogue number of a sign, from Alan Gardiner\'s sign list (1927): a letter for the category and a number, e.g. G17 for the owl (birds), N35 for the water ripple (sky, earth, water).'],
  ['Quadrat','The invisible square into which each group of signs is fitted, so that a line of text keeps an even texture.'],
  ['Cartouche','The oval of knotted rope around a king\'s throne name and birth name. The Egyptian word is šnw; "cartouche" is French for a gun cartridge, which Napoleon\'s soldiers thought it resembled.'],
  ['Register','One of the horizontal bands a wall is divided into, each with its own ground line.'],
  ['Raised relief','The background is cut away so the figures stand out. Slow work; used mostly indoors, where soft light shows it.'],
  ['Sunk relief','The figures are cut into the surface and the background left standing. Faster, harder to erase, and legible in strong sun; used on exterior walls.'],
  ['Canon of proportion','The squared grid on which figures were laid out — 18 squares to the hairline for a standing figure until the 26th Dynasty, 21 thereafter.'],
  ['Composite view','Showing each part of the body from its most characteristic side in one figure: profile head and legs, frontal eye and shoulders.'],
  ['Ankh · djed · was','Life, stability, dominion: three signs written together as a blessing, and carried by gods as objects.'],
  ['Wedjat','The healed eye of Horus; an amulet of wholeness and protection.'],
  ['Kheker','A frieze of pointed knots along the top of a wall, copying the tied tops of reed matting.'],
  ['Wesekh','The broad collar of beads in concentric rows, worn by gods, kings and the dead.'],
  ['Egyptian blue','Calcium copper silicate, the first synthetic pigment, made by firing sand, copper and lime.'],
  ['Rubric','A heading or key phrase written in red ink (Latin ruber) among black text.'],
  ['Vignette','The picture that accompanies a spell in a funerary papyrus.'],
  ['Uraeus','The rearing cobra on the brow of kings and gods.']
];
for(const id of ['egypt-painted-relief','egypt-sunk-relief','egypt-gilded-relief','egypt-papyrus','egypt-souvenir-papyrus','egypt-tomb-painting','egypt-inlay-jewellery'])GLOSSARY_ADD[id]=EGYPT_GLOSSARY;

const SOURCES={
  'deepavali-icon':[W('Diwali')],
  'devotional-line-art':[W('Saraswati'),W('Durga'),W('Kiritamukuta'),['Exotic India Art — Prabhavali: Meaning & Symbolism','https://www.exoticindiaart.com/article/prabhavali/'],W('Halo_(religious_iconography)'),W('Murti'),W('Ganesha'),W('Vishnu'),W('Shiva'),W('Rama'),W('Kali'),W('Lakshmi'),W('Hanuman'),W('Sudarshana_Chakra'),W('Talamana'),W('Hindu_iconography')],
  'madhubani':[W('Madhubani_art')],'warli':[W('Warli_painting')],'gond':[W('Jangarh_Singh_Shyam'),W('Gond_people')],
  'kalamkari':[W('Kalamkari')],'pattachitra':[W('Pattachitra')],'tanjore':[W('Thanjavur_painting'),W('Durga'),W('Kuthuvilakku'),W('Vishnu'),W('Lakshmi'),W('Shesha')],'kolam':[W('Kolam')],
  'rangoli':[W('Rangoli')],'mehndi':[W('Mehndi')],'mughal-illumination':[W('Mughal_painting'),W('Muraqqa')],
  'kerala-mural':[W('Kerala_mural_painting'),W('Hindu_iconography'),W('Talamana')],'ajrakh':[W('Ajrak')],'jaali':[W('Jali')],'kantha':[W('Kantha')],
  'deity-brush-mark':[W('Ganesha'),W('Shiva')],'deity-tattoo-line':[W('Ganesha'),W('Kali'),W('Shiva')],'deity-silhouette':[W('Silhouette'),W('Krishna'),W('Hanuman'),W('Rama'),W('Kodanda')],
  'deity-woodburn':[W('Pyrography'),W('Hanuman')],'deity-stencil':[W('Stencil')],
  'mongol-calligraphy':[W('Mongolian_script'),W('Mongolian_calligraphy')],'mongol-script-figures':[W('Mongolian_calligraphy')],
  'mongol-khee':[W('Endless_knot')],'shirdeg':[['Shyrdak, the Kyrgyz cousin of shirdeg — Wikipedia','https://en.wikipedia.org/wiki/Shyrdak']],
  'aztec-line-icons':[W('Xicalcoliuhqui'),W('Aztec_art')],'aztec-stamp':[W('Aztec_art')],'aztec-revival-line':[W('Aztec_art')],
  'aztec-glyph-poster':[W('Maya_script')],'mexica-codex':[W('Aztec_codices'),W('Tonalpohualli')],'sun-stone':[W('Aztec_calendar_stone')],
  'mitla-fretwork':[W('Mitla'),W('Xicalcoliuhqui'),W('Meander_(art)')],
  'insular-knotwork':[W('Celtic_knot'),W('Insular_art'),['Walker Metalsmiths — Celtic Interlace and Knotwork Design','https://www.walkerscelticjewelry.com/blogs/celticjewelry/11496017-celtic-interlace-and-knotwork-design-part-1']],
  'la-tene':[W('La_T%C3%A8ne_culture'),W('Triskelion')],'pictish-stones':[W('Pictish_stone')],'celtic-revival':[W('Celtic_Revival'),W('Celtic_knot')],
  'wagara':[['Sukaizen — Seigaiha Wave Pattern: Meaning & History','https://sukaizen.com/blog/seigaiha-wave-pattern-guide']],'sashiko':[W('Sashiko')],
  'kamon':[W('Mon_(emblem)')],'zen-ink':[W('Ens%C5%8D')],'bronze-leiwen':[W('Taotie'),W('Meander_(art)')],
  'blue-white':[W('Blue_and_white_pottery'),W('Ruyi_(scepter)')],'jianzhi':[W('Chinese_paper_cutting')],'shufa':[W('Chinese_calligraphy')],
  'egypt-painted-relief':[W('Egyptian_hieroglyphs'),W('Gardiner%27s_sign_list'),W('Manuel_de_Codage'),W('Cartouche'),W('Ancient_Egyptian_offering_formula')],
  'egypt-sunk-relief':[W('Relief'),W('Medinet_Habu'),W('Egyptian_hieroglyphs')],
  'egypt-gilded-relief':[W('Winged_sun'),W('Shen_ring'),W('Cartouche')],
  'egypt-papyrus':[W('Book_of_the_Dead'),W('Papyrus'),W('Ra'),W('Art_of_ancient_Egypt')],
  'egypt-souvenir-papyrus':[W('QV66'),W('Maat'),W('Isis'),W('Papyrus')],
  'egypt-tomb-painting':[W('Tomb_of_Nebamun'),W('Register_(art)'),W('Art_of_ancient_Egypt'),W('Egyptian_blue')],
  'egypt-inlay-jewellery':[W('Usekh_collar'),W('Pectoral_(Ancient_Egypt)'),W('Scarab_(artifact)'),W('Eye_of_Horus'),W('Egyptian_faience')],
  // Māori and Aboriginal Australia (checked 2026-10-11). Te Ara and AIATSIS pages sit behind a
  // bot check that could not be passed, so they are not listed; search for them by name.
  'kirituhi-line':[WM('Tā moko','T%C4%81_moko'),WM('Māori art','M%C4%81ori_art'),W('Koru')],
  'kirituhi-solid':[WM('Tā moko','T%C4%81_moko'),W('Hei-tiki'),WM('Māori art','M%C4%81ori_art')],
  'kowhaiwhai':[W('Koru'),W('Wharenui'),W('Frieze_group'),WM('Māori art','M%C4%81ori_art')],
  'whakairo':[W('Whakairo'),W('Wharenui'),W('Manaia_(mythological_creature)'),W('Hei-tiki')],
  'tukutuku':[W('Tukutuku'),W('Wharenui'),W('Frieze_group')],
  'taniko':[WM('Tāniko','T%C4%81niko'),WM('Māori art','M%C4%81ori_art')],
  'pounamu':[W('Pounamu'),W('Hei-tiki'),W('Hei_matau'),W('Manaia_(mythological_creature)')],
  'desert-ochre':[W('Papunya_Tula'),W('Indigenous_Australian_art'),W('The_Dreaming'),AB_CODE],
  'desert-sites-tracks':[W('Warlukurlangu_Artists'),W('Indigenous_Australian_art'),W('Songline'),W('Distance_transform'),AB_CODE],
  'desert-colour-fields':[W('Bush_tucker'),W('Indigenous_Australian_art'),W('The_Dreaming'),AB_CODE],
  'dot-halo-animal':[AB_CODE,W('Milpurrurru_v_Indofurn_Pty_Ltd'),W('Indigenous_Australian_art'),W('Distance_transform')],
  'saltwater-contemporary':[W('Indigenous_Australian_art'),AB_CODE],
  'arnhem-bark':[W('Bark_painting'),W('Rarrk'),W('X-ray_style_art'),W('Arnhem_Land'),W('Wandjina'),AB_CODE]
};

for(const T of SG.traditions){
  const add=GLOSSARY_ADD[T.id];
  if(add){const have=new Set((T.glossary||[]).map(([a])=>a.toLowerCase()));T.glossary=(T.glossary||[]).concat(add.filter(([a])=>!have.has(a.toLowerCase())));}
  if(SOURCES[T.id])T.sources=SOURCES[T.id];
}
