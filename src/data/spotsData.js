export const SPOT_CATEGORIES = ['Hills', 'Sea', 'Forest', 'Heritage'];

export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Khulna',
  'Rajshahi',
  'Barishal',
  'Rangpur',
  'Mymensingh',
];

export const spotsData = [
  {
    id: 'coxs-bazar',
    name: "Cox's Bazar",
    division: 'Chattogram',
    district: "Cox's Bazar",
    category: 'Sea',
    tagline: 'An endless golden shoreline stretching beside the Bay of Bengal.',
    description:
      "Stretching roughly 120 kilometers along Bangladesh's southeastern coast, Cox's Bazar is celebrated as the world's longest unbroken natural sandy sea beach. Framed by rolling green hills on one side and rhythmic Bay of Bengal surf on the other, its coastline shifts from bustling Laboni and Sugandha shores to the tranquil coral-strewn sands of Inani and the dramatic cliffs of Himchari along Marine Drive.",
    bestTime: 'November to March (cool coastal breeze, clear skies, calm sea)',
    howToGo:
      "Fly directly from Dhaka to Cox's Bazar Airport in under an hour, or take an overnight highway coach or Cox's Bazar Express intercity train from Dhaka and Chattogram.",
    highlights: [
      'Unbroken 120 km natural coastline crowned by fiery Bay of Bengal sunsets',
      'Scenic 80 km Marine Drive winding between hill ridges and turquoise waves toward Teknaf',
      'Coral-boulder shores of Inani Beach and cliffside panoramas at Himchari',
    ],
    coordinates: { lat: 21.4272, lng: 92.0058 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Sunset_Cox%27s_Bazar_Sea_Beach_255645.jpg/1280px-Sunset_Cox%27s_Bazar_Sea_Beach_255645.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Inani_Beach_Sunset_Cox%27s_Bazar_Bangladesh_2025.jpg/1280px-Inani_Beach_Sunset_Cox%27s_Bazar_Bangladesh_2025.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/Cox%27s_bazar_sea_beach_Bangladesh-7.jpg/1280px-Cox%27s_bazar_sea_beach_Bangladesh-7.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Cox%27s_Bazar_sea_Beach_%28evening_sunset%29.jpg/1280px-Cox%27s_Bazar_sea_Beach_%28evening_sunset%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'sajek-valley',
    name: 'Sajek Valley',
    division: 'Chattogram',
    district: 'Rangamati',
    category: 'Hills',
    tagline: 'The kingdom of clouds perched atop the Kasalong range.',
    description:
      'Known poetically as the Queen of Hills and the Roof of Rangamati, Sajek Valley sits nearly 1,800 feet above sea level along the lush eastern ridges bordering Mizoram. Mornings open above a drifting ocean of white clouds that weave through bamboo cottages, Ruilui and Konglak indigenous villages, and layered blue mountain horizons.',
    bestTime:
      'August to February (monsoon brings dramatic rolling clouds; winter offers crisp golden sunrises)',
    howToGo:
      'Travel by overnight bus from Dhaka or Chattogram to Khagrachhari town, then ride a Chander Gari (open-top hill jeep) via Dighinala and Baghaihat under scheduled highland escort timings.',
    highlights: [
      'Sea-of-clouds sunrises viewed from Ruilui Para and the summit of Konglak Hill',
      'Living Lusai, Pangkhua, and Tripura highland communities and wooden hillside paths',
      'Panoramic twilight skies and star-filled nights far from city light',
    ],
    coordinates: { lat: 23.3819, lng: 92.2938 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Sajek_Valley_00.jpg/1280px-Sajek_Valley_00.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Life_above_clouds.jpg/1280px-Life_above_clouds.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Sunrise_at_Sajek_Valley.jpg/1280px-Sunrise_at_Sajek_Valley.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Sajek_Valley_20161205.jpg/1280px-Sajek_Valley_20161205.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans',
    division: 'Khulna',
    district: 'Bagerhat',
    category: 'Forest',
    tagline: "The world's largest tidal mangrove wilderness and UNESCO sanctuary.",
    description:
      'Where the mighty Padma, Brahmaputra, and Meghna rivers dissolve into the Bay of Bengal, the Sundarbans forms a labyrinth of tidal creeks, mudflats, and towering sundari and keora mangroves. Home to the elusive Royal Bengal Tiger, spotted chital deer, estuarine crocodiles, and Irrawaddy dolphins, this UNESCO World Heritage Site pulses with ancient estuarine silence.',
    bestTime:
      'November to February (pleasant winter temperatures, calm tidal rivers, peak wildlife sightings)',
    howToGo:
      'Reach Khulna or Mongla from Dhaka via highway over the Padma Bridge, by intercity train to Khulna, or by flight to Jashore Airport, then board an authorized forest vessel into the reserve with Forest Department permits.',
    highlights: [
      'Silent dawn cruises along narrow mangrove creeks at Katka, Kachikhali, and Karamjal',
      'UNESCO World Heritage biodiversity including spotted deer, kingfishers, and the Royal Bengal Tiger',
      'Remote golden forest-meets-sea shoreline at Jamtola Beach inside the wildlife sanctuary',
    ],
    coordinates: { lat: 21.9497, lng: 89.1833 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/The_mighty_Mangrove_forest.jpg/1280px-The_mighty_Mangrove_forest.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Sunset_Mangrove_Forest_Kachikhali_Sundarban_National_Park_Bangladesh_-_panoramio.jpg/1280px-Sunset_Mangrove_Forest_Kachikhali_Sundarban_National_Park_Bangladesh_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Mangrove_Forest_Katka_Sundarban_National_Park_Bangladesh_-_panoramio.jpg/1280px-Mangrove_Forest_Katka_Sundarban_National_Park_Bangladesh_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Spotted_deer_grazing_in_Sundarbans_mangrove_forest.jpg/1280px-Spotted_deer_grazing_in_Sundarbans_mangrove_forest.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'ratargul-swamp-forest',
    name: 'Ratargul Swamp Forest',
    division: 'Sylhet',
    district: 'Sylhet',
    category: 'Forest',
    tagline: 'A submerged emerald cathedral of koroch and hijal trees.',
    description:
      'Tucked beside the Goain River in Gowainghat, Ratargul is Bangladesh’s iconic freshwater swamp forest. During the monsoon months, hill waters from Meghalaya flood the forest floor up to twenty feet deep, transforming the woodland into a mirror-like labyrinth where wooden country boats glide quietly beneath an unbroken green canopy.',
    bestTime:
      'June to October (peak monsoon submergence allows full exploration by wooden country boat)',
    howToGo:
      'Travel to Sylhet by train, bus, or flight from Dhaka, then drive about one hour north via Airport Road and Dhopagul to Motorghat or Chourangi Ghat to board a hand-rowed wooden dinghy.',
    highlights: [
      'Hand-paddled wooden boat journeys through flooded koroch and murta corridors',
      'Panoramic canopy views from the forest watchtower over the submerged treetops',
      'Rich wetland birdlife, monkeys, and dappled monsoon reflections across glassy water',
    ],
    coordinates: { lat: 25.0131, lng: 91.9234 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Tranquility_of_the_Ratargul_Swamp_Forest.jpg/1280px-Tranquility_of_the_Ratargul_Swamp_Forest.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Ratargul_0276.jpg/1280px-Ratargul_0276.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Ratargul_Swamp_Forest%2C_Sylhet.jpg/1280px-Ratargul_Swamp_Forest%2C_Sylhet.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Ratargul_Swamp_Forest_in_monsoon.jpg/1280px-Ratargul_Swamp_Forest_in_monsoon.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'saint-martins-island',
    name: "Saint Martin's Island",
    division: 'Chattogram',
    district: "Cox's Bazar",
    category: 'Sea',
    tagline: "Bangladesh's only coral island, affectionately called Narikel Jinjira.",
    description:
      "Lying at the southernmost tip of Bangladesh in the northeastern Bay of Bengal, Saint Martin's Island is a tiny palm-fringed coral sanctuary encircled by translucent turquoise shallows. Known locally as Narikel Jinjira (Coconut Island), its quiet cycling lanes, rocky tidal pools, and southern islet of Chera Dwip offer a rare coastal rhythm far from mainland bustle.",
    bestTime:
      'November to February (calm seas permit seasonal vessel crossings and crystal-clear water)',
    howToGo:
      "Travel from Dhaka or Chattogram to Cox's Bazar or Teknaf, then take an authorized seasonal tourist vessel across the Naf River estuary and open bay to the island jetty.",
    highlights: [
      'Crystal-clear turquoise shallows, fossilized coral reefs, and swaying coconut groves',
      'Low-tide shoreline walks and tidal pools along the southern tip near Chera Dwip',
      'Unpolluted starlit skies and tranquil bicycle loops around the entire island perimeter',
    ],
    coordinates: { lat: 20.6237, lng: 92.3234 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Coral_Sea_Beach_of_Chera_Dwip%2C_Saint_Martin%27s_Island_%2826629378198%29.jpg/1280px-Coral_Sea_Beach_of_Chera_Dwip%2C_Saint_Martin%27s_Island_%2826629378198%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Saint_Martin_%286%29.jpg/1280px-Saint_Martin_%286%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Scenic_view_of_Saint_Martin_Island%2C_Bangladesh_2.jpg/1280px-Scenic_view_of_Saint_Martin_Island%2C_Bangladesh_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Coral_Sea_Beach_at_Chera_Dwip%2C_Saint_Martin%27s_Island_%2839633896435%29.jpg/1280px-Coral_Sea_Beach_at_Chera_Dwip%2C_Saint_Martin%27s_Island_%2839633896435%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'nafakhum-waterfall',
    name: 'Nafakhum Waterfall',
    division: 'Chattogram',
    district: 'Bandarban',
    category: 'Hills',
    tagline: 'A thundering curtain of emerald water deep inside the Sangu valley.',
    description:
      'Carved along the wild Remakri Canal—a tributary of the Sangu River—Nafakhum is among the largest and most powerful waterfalls in Bangladesh by water volume. Reaching it is half the legend: a cinematic journey by longtail wooden boat through towering stone gorges at Raja Pathor followed by a barefoot stream trek across mossy boulders and Marma hill hamlets.',
    bestTime:
      'September to December (late monsoon and autumn bring strong cascades with safe, clear trekking trails)',
    howToGo:
      'Take an overnight bus from Dhaka to Bandarban town, continue via winding hill highway to Thanchi, register with a certified local guide, boat upriver along the Sangu to Remakri, and trek roughly two to three hours to Nafakhum.',
    highlights: [
      'Wide horseshoe cascade roaring into an emerald limestone plunge pool wrapped in mist',
      'Dramatic Sangu River boat voyage past the giant boulders of Tindu and Raja Pathor',
      'Scenic forest-and-stream trail connecting Remakri Bazar to the falls',
    ],
    coordinates: { lat: 21.7208, lng: 92.5335 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Thanchi_nafakhum.jpg/1280px-Thanchi_nafakhum.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Nafakhum_falls.jpg/1280px-Nafakhum_falls.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/NafaKhum%2CThanchi%2CBandarban.jpg/1280px-NafaKhum%2CThanchi%2CBandarban.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Nafakhum_Remakri_Trail_.jpg/1280px-Nafakhum_Remakri_Trail_.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'paharpur-buddhist-vihara',
    name: 'Paharpur Buddhist Vihara',
    division: 'Rajshahi',
    district: 'Naogaon',
    category: 'Heritage',
    tagline: 'An eighth-century Pala terracotta masterpiece rising from Varendra plains.',
    description:
      'Known historically as Somapura Mahavihara, this monumental UNESCO World Heritage monastery was built under the Pala Emperor Dharmapala in the late eighth century. Spanning 27 acres with 177 monastic cells framing a colossal cruciform central stupa adorned with thousands of sculpted terracotta plaques, it once served as one of Asia’s foremost centers of Buddhist scholarship.',
    bestTime:
      'October to March (dry, mild North Bengal weather ideal for walking the open archaeological grounds)',
    howToGo:
      'Take an intercity train from Dhaka to Jamalganj or Joypurhat station, or travel by road to Naogaon town, then continue by local transport to Paharpur village in Badalgachhi Upazila.',
    highlights: [
      'Monumental cruciform central shrine and vast monastic quadrangle of 177 scholar cells',
      'Intricate eighth-century Pala terracotta plaques depicting folklore, flora, and deities',
      'On-site archaeological museum preserving stone sculptures, inscriptions, and relics',
    ],
    coordinates: { lat: 25.0311, lng: 88.9767 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Sunset_at_Paharpur.jpg/1280px-Sunset_at_Paharpur.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Paharpur_-_DJI_0792.jpg/1280px-Paharpur_-_DJI_0792.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Paharpur_Buddhist_Bihar.jpg/1280px-Paharpur_Buddhist_Bihar.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Paharpur_Buddhist_Monastery.jpg/1280px-Paharpur_Buddhist_Monastery.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'lalbagh-fort',
    name: 'Lalbagh Fort',
    division: 'Dhaka',
    district: 'Dhaka',
    category: 'Heritage',
    tagline: 'An unfinished seventeenth-century Mughal citadel of red brick and marble.',
    description:
      'Standing peacefully amid the dense historic lanes of Old Dhaka near the Buriganga River, Lalbagh Fort was begun in 1678 by Prince Muhammad Azam and later overseen by Subahdar Shaista Khan. Though never completed after the tragic passing of Shaista Khan’s daughter Pari Bibi, its symmetrical Mughal gardens, marble-and-basalt mausoleum, Diwan-i-Am audience hall, and three-domed mosque preserve Dhaka’s imperial grace.',
    bestTime:
      'November to February (crisp winter mornings and late afternoons cast warm light across the sandstone arches)',
    howToGo:
      'Located in Old Dhaka (Lalbagh Road); easily reached from central Dhaka via rickshaw, CNG auto-rickshaw, car, or Dhaka Metro Rail to Dhaka University station followed by a short ride into Old Dhaka.',
    highlights: [
      'Octagonal Tomb of Pari Bibi inlaid with black basalt, white marble, and glazed tiles',
      'Diwan-i-Am (Governor’s Residence and Hammam) now housing a curated Mughal heritage museum',
      'Fortified southern gateway, landscaped charbagh gardens, and three-domed Lalbagh Mosque',
    ],
    coordinates: { lat: 23.7189, lng: 90.3881 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Diwan-i-Am_and_Tomb_of_Pari_Bibi_with_Garden_-_North-western_View_-_Lalbagh_Fort_Complex_-_Dhaka_2015-05-31_2715.JPG/1280px-Diwan-i-Am_and_Tomb_of_Pari_Bibi_with_Garden_-_North-western_View_-_Lalbagh_Fort_Complex_-_Dhaka_2015-05-31_2715.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Tomb_of_Pari_Bibi_Lalbagh_Fort.jpg/1280px-Tomb_of_Pari_Bibi_Lalbagh_Fort.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Lalbagh_Fort_MUSABBIR.jpg/1280px-Lalbagh_Fort_MUSABBIR.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Tomb_of_Pari_Bibi_of_Lalbagh_Fort.jpg/1280px-Tomb_of_Pari_Bibi_of_Lalbagh_Fort.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'bichanakandi',
    name: 'Bichanakandi',
    division: 'Sylhet',
    district: 'Sylhet',
    category: 'Hills',
    tagline: 'River-smoothed stones meeting cool Himalayan-fed Meghalaya streams.',
    description:
      'Set along the northern frontier of Gowainghat where several layers of the Khasi-Jaintia hills converge into a dramatic natural amphitheater, Bichanakandi is celebrated for its broad beds of rounded river pebbles washed by crystal-clear mountain water. Mist drapes the sheer green escarpments overhead while shallow streams ripple lazily toward the Piyain River.',
    bestTime:
      'June to October (monsoon swells the mountain streams and waterfalls; dry season reveals vast stone plains)',
    howToGo:
      'From Sylhet city (Ambarkhana), travel north by car or CNG auto-rickshaw to Hadarpar Ghat via Airport Road and Salutikor, then glide upstream by engine boat to the Bichanakandi stone beds.',
    highlights: [
      'Crystal-clear mountain streams flowing over smooth pebble beds beneath cloud-kissed ridges',
      'Scenic boat ride along the Piyain River framed by emerald hills and riverside villages',
      'Dramatic monsoon waterfalls cascading down the neighbouring Meghalaya cliffs',
    ],
    coordinates: { lat: 25.1714, lng: 91.8837 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Bichnakandi%2C_Sylhet_%282%29.jpg/1280px-Bichnakandi%2C_Sylhet_%282%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Bichanakandi_Sylhet_02.jpg/1280px-Bichanakandi_Sylhet_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Bichanakandi_in_Sylhet_03.jpg/1280px-Bichanakandi_in_Sylhet_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Bichnakandi%2C_Sylhet_%283%29.jpg/1280px-Bichnakandi%2C_Sylhet_%283%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'tanguar-haor',
    name: 'Tanguar Haor',
    division: 'Sylhet',
    district: 'Sunamganj',
    category: 'Forest',
    tagline: 'An inland monsoon sea reflecting the blue walls of Meghalaya.',
    description:
      'Recognized internationally as a Ramsar Wetland of Global Importance, Tanguar Haor spans nearly 100 square kilometers of interconnected beels, swamp forests, and floating villages beneath the Meghalaya foothills. In monsoon, it transforms into a serene inland sea drifted across by wooden houseboats; in winter, receding waters welcome hundreds of thousands of migratory birds.',
    bestTime:
      'July to September for monsoon houseboat voyages; December to February for migratory birdwatching',
    howToGo:
      'Travel from Dhaka to Sunamganj town by overnight bus (or via Sylhet), then cross the Surma River and proceed to Tahirpur Ghat to embark on a wooden haor houseboat.',
    highlights: [
      'Overnight wooden houseboat drifting beneath dramatic Meghalaya clouds and starlit reflections',
      'Submerged hijal and koroch swamp groves surrounding the iconic Watchtower area',
      'Side excursions to Niladri Lake (Shaheed Siraj Lake), Jadukata River, and Barikka Tila',
    ],
    coordinates: { lat: 25.1408, lng: 91.0731 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/%27Bharbaahi%27_-_Tangua_Haor%2C_Sunamganj%2C_Bangladesh.jpg/1280px-%27Bharbaahi%27_-_Tangua_Haor%2C_Sunamganj%2C_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Tanguar_haor%2C_Bangladesh_01.jpg/1280px-Tanguar_haor%2C_Bangladesh_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Riverine_transportation_in_Tanguar_Haor%2C_Sunamganj%2C_Bangladesh.jpg/1280px-Riverine_transportation_in_Tanguar_Haor%2C_Sunamganj%2C_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Tanguar_Haor%2C_Sunamganj_water_nature.jpg/1280px-Tanguar_Haor%2C_Sunamganj_water_nature.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'nilgiri-hills',
    name: 'Nilgiri Hills',
    division: 'Chattogram',
    district: 'Bandarban',
    category: 'Hills',
    tagline: 'Cloud-swept ridge viewpoints towering above the winding Sangu River.',
    description:
      'Rising roughly 2,200 feet above sea level along the scenic Bandarban–Thanchi ridge road, Nilgiri offers one of the most commanding high-altitude vistas in Bangladesh. As mist curls directly across the stone terraces, visitors watch the Sangu River snake far below through undisturbed Chittagong Hill Tracts ridges and Mro hill settlements.',
    bestTime:
      'July to February (monsoon brings dramatic clouds rolling across the peak; winter unveils crisp multi-layered horizons)',
    howToGo:
      'Take an overnight bus from Dhaka or Chattogram to Bandarban town, then hire a Chander Gari or 4WD jeep for the dramatic two-hour ridge climb via Chimbuk Hill and Shoilo Propat.',
    highlights: [
      '360-degree mountain ridge panorama overlooking the Sangu River valley and Chimbuk range',
      'Early-morning clouds drifting literally at shoulder height across the hilltop deck',
      'Scenic mountain drive linking Shoilo Propat waterfall, Mro villages, and Chimbuk viewpoint',
    ],
    coordinates: { lat: 21.9125, lng: 92.3247 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Touch_the_sky_%28Nilgiri%2C_Bandarban%29.jpg/1280px-Touch_the_sky_%28Nilgiri%2C_Bandarban%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Nilgiri%2C_Bandarban%2C_Bangladesh_4.jpg/1280px-Nilgiri%2C_Bandarban%2C_Bangladesh_4.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Neelgiri_Pahar%2C_tourist_place_of_Bandarban_District_01.jpg/1280px-Neelgiri_Pahar%2C_tourist_place_of_Bandarban_District_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Nilgiri%2C_Bandarban%2C_Bangladesh_2.jpg/1280px-Nilgiri%2C_Bandarban%2C_Bangladesh_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'sreemangal-tea-gardens',
    name: 'Sreemangal Tea Gardens',
    division: 'Sylhet',
    district: 'Moulvibazar',
    category: 'Forest',
    tagline: 'Rolling terraced tea carpets and rainforest trails in the Tea Capital.',
    description:
      'Known nationwide as the Tea Capital of Bangladesh, Sreemangal unfolds across undulating hills blanketed in meticulously manicured emerald tea bushes shaded by tall albizia trees. Beyond the century-old estates lie the semi-evergreen canopy of Lawachara National Park, tranquil Baikka Beel bird sanctuary, and the iconic seven-layer tea tradition.',
    bestTime:
      'October to March for crisp misty mornings; May to September for vibrant rain-washed greenery',
    howToGo:
      'Take an intercity train (Parabat, Jayantika, Upaban, or Kalni Express) directly from Dhaka to Sreemangal Railway Station, or travel via highway coach from Dhaka or Sylhet.',
    highlights: [
      'Sculpted terraced tea hills stretching across Finlay, Lakkatura-style valleys, and Madhabpur Lake',
      'Guided nature walks inside Lawachara National Park, home to endangered western hoolock gibbons',
      'Cultural stops at Manipuri handloom villages and authentic seven-layer tea tasting',
    ],
    coordinates: { lat: 24.3065, lng: 91.7296 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Tea_gardens_in_Sreemangal_06.jpg/1280px-Tea_gardens_in_Sreemangal_06.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Sreemangal_tea_garden_2017-08-20.jpg/1280px-Sreemangal_tea_garden_2017-08-20.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Tea_gardens_in_Sreemangal_01.jpg/1280px-Tea_gardens_in_Sreemangal_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Tea_gardens_in_Sreemangal_09.jpg/1280px-Tea_gardens_in_Sreemangal_09.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'kuakata-sea-beach',
    name: 'Kuakata Sea Beach',
    division: 'Barishal',
    district: 'Patuakhali',
    category: 'Sea',
    tagline: 'Sagar Kanya — the rare shore where both sunrise and sunset kiss the sea.',
    description:
      'Revered in Bengali poetry as Sagar Kanya (Daughter of the Sea), Kuakata is a serene 18-kilometer panoramic beach on Bangladesh’s southern deltaic coast. Its unique geographic curvature allows travelers standing on the very same shoreline to witness both the rising sun emerge from the Bay of Bengal and the evening sun melt back into its waves.',
    bestTime:
      'November to March (clear horizons for unobstructed sunrise and sunset photography)',
    howToGo:
      'Drive or take a direct highway bus from Dhaka across the Padma Bridge to Kuakata in roughly six to seven hours, or enjoy an overnight river launch to Barishal or Patuakhali followed by a scenic coastal drive.',
    highlights: [
      'Unobstructed ocean sunrise from Gangamati Reserved Forest and glowing sunsets from Zero Point',
      'Red-crab beaches, Fatrar Char mangrove island, and Lebur Char estuarine sandbanks',
      'Centuries-old Rakhine Buddhist heritage at Misripara Seema Buddhist Temple',
    ],
    coordinates: { lat: 21.8167, lng: 90.1194 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Kuakata_Sea_Beach.JPG/1280px-Kuakata_Sea_Beach.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Kuakata_sunset.jpg/1280px-Kuakata_sunset.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Kuakata_SeaBeach_View.jpg/1280px-Kuakata_SeaBeach_View.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Sunset_at_Kuakata_Sea_Beach-2018.jpg/1280px-Sunset_at_Kuakata_Sea_Beach-2018.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'mahasthangarh',
    name: 'Mahasthangarh',
    division: 'Rajshahi',
    district: 'Bogura',
    category: 'Heritage',
    tagline: 'The 2,300-year-old fortified citadel of ancient Pundranagara.',
    description:
      'Overlooking the western bank of the Karatoya River north of Bogura, Mahasthangarh is the earliest documented urban archaeological site in Bangladesh, dating back to at least the third century BCE. Its massive brick ramparts, sacred Govinda Bhita temple ruins, Behula’s Lakshindarer Medh (Gokul Medh), and museum artifacts chronicle Mauryan, Gupta, Pala, and Sultanate civilizations.',
    bestTime:
      'November to February (cool winter days ideal for exploring the citadel ramparts and surrounding mounds)',
    howToGo:
      'Travel from Dhaka to Bogura by highway bus or train (Rangpur / Lalmoni Express via Santahar or Bogura), then take a 20-minute ride north along the Bogura–Rangpur highway to Mahasthangarh.',
    highlights: [
      'Ancient brick citadel ramparts of Pundranagara overlooking the historic Karatoya River',
      'Excavated archaeological landmarks including Govinda Bhita, Vasu Vihara, and Gokul Medh',
      'Mahasthangarh Archaeological Museum showcasing Mauryan Brahmi inscriptions and terracotta art',
    ],
    coordinates: { lat: 24.9611, lng: 89.3428 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Mahasthangarh%2C_Bogra_Bangladesh.jpg/1280px-Mahasthangarh%2C_Bogra_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Mahasthangarh_2%2C_Bogra_Bangladesh.jpg/1280px-Mahasthangarh_2%2C_Bogra_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Mahasthangarh%2C_Bogra%2C_September_2016_02.jpg/1280px-Mahasthangarh%2C_Bogra%2C_September_2016_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Mahasthangarh%2C_Bogra%2C_September_2016_06.jpg/1280px-Mahasthangarh%2C_Bogra%2C_September_2016_06.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'amiakhum',
    name: 'Amiakhum',
    division: 'Chattogram',
    district: 'Bandarban',
    category: 'Hills',
    tagline: 'A remote jewel of tiered cascades hidden beyond Debota Pahar.',
    description:
      'Deep in the untamed frontier of Thanchi Upazila near the Myanmar border, Amiakhum is hailed by trekkers as one of the most breathtaking natural wonders in Bangladesh. Framed by sheer dark canyon walls and crystal-green pools, reaching it demands crossing bamboo-shaded hill villages, descending the legendary steep slope of Debota Pahar, and rafting by bamboo bhela into adjacent Velakhum and Satvai Khum.',
    bestTime:
      'October to January (post-monsoon water clarity turns the canyon pools a surreal jade green with safer descents)',
    howToGo:
      'Journey from Bandarban to Thanchi, register with an approved local mountain guide, boat upriver to Padmamukh or Remakri, and complete a multi-day ridge trek through Thuisapara and Debota Pahar.',
    highlights: [
      'Multi-tiered waterfall plunging into luminous jade pools flanked by towering rock faces',
      'Hand-poled bamboo raft expeditions through the tranquil canyons of Velakhum and Satvai Khum',
      'Authentic overnight homestays and warm hospitality in remote Tripura and Marma hill paras',
    ],
    coordinates: { lat: 21.6531, lng: 92.5484 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Amiakhum_falls%2C_bandarban_%2C_Bangladesh.jpg/1280px-Amiakhum_falls%2C_bandarban_%2C_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Amiakhum_falls%2C_bandarban_%2C_Bangladesh_5.jpg/1280px-Amiakhum_falls%2C_bandarban_%2C_Bangladesh_5.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Serenity_Amiakhum_Bandorban.jpg/1280px-Serenity_Amiakhum_Bandorban.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Amiakhum_Waterfall_1.jpg/1280px-Amiakhum_Waterfall_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'tajhat-palace',
    name: 'Tajhat Palace',
    division: 'Rangpur',
    district: 'Rangpur',
    category: 'Heritage',
    tagline: 'An ivory-hued early twentieth-century Zamindar palace of North Bengal.',
    description:
      'Built in the early twentieth century by Maharaja Kumar Gopal Lal Roy on the southern edge of Rangpur city, Tajhat Palace is one of North Bengal’s finest surviving Indo-Saracenic mansions. Its sweeping white Italian-marble grand staircase, Corinthian colonnades, central ribbed dome, and tranquil botanical lawns now house the Rangpur Regional Museum.',
    bestTime:
      'October to March (cool northern winters make strolling the palace gardens and museum halls especially pleasant)',
    howToGo:
      'Fly from Dhaka to Saidpur Airport and drive roughly one hour to Rangpur city, or take the Rangpur Express intercity train or highway coach directly to Rangpur, then ride 15 minutes southeast to Tajhat.',
    highlights: [
      'Grand white Italian-marble central staircase framed by classical fountains and colonnades',
      'Symmetrical 76-meter Indo-Saracenic facade crowned by a fluted central dome and minarets',
      'Rangpur Regional Museum preserving tenth-century black-stone sculptures, Sanskrit manuscripts, and Mughal relics',
    ],
    coordinates: { lat: 25.7209, lng: 89.2797 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Tajhat_Jamidar_Palace.jpg/1280px-Tajhat_Jamidar_Palace.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Tajhat_Jamidar_Bari_%2CA_Majestic_Glimpse_into_Bengal%E2%80%99s_Zamindari_Heritage_01.jpg/1280px-Tajhat_Jamidar_Bari_%2CA_Majestic_Glimpse_into_Bengal%E2%80%99s_Zamindari_Heritage_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Front_view_of_Tajhat_Landlord%27s_Palace_in_Rangpur%2C_Bangladesh.jpg/1280px-Front_view_of_Tajhat_Landlord%27s_Palace_in_Rangpur%2C_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Garden_in_Tajhat_Palace%2C_Rangpur_13.jpg/1280px-Garden_in_Tajhat_Palace%2C_Rangpur_13.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'birishiri-ceramic-hills',
    name: 'Birishiri Ceramic Hills',
    division: 'Mymensingh',
    district: 'Netrokona',
    category: 'Hills',
    tagline: 'Chalk-white kaolin cliffs cradling surreal turquoise lakes along the Garo border.',
    description:
      'Set beside the crystalline Someshwari River in Susang Durgapur, Birishiri’s Chinamatir Pahar (Ceramic Hills) presents one of Bangladesh’s most unexpected geological landscapes. Decades of natural white-clay excavation along the Bijoypur ridge carved pale mineral cliffs that rise dramatically above luminous turquoise and emerald pools beneath the Garo Hills horizon.',
    bestTime:
      'October to March (clear skies bring out the vivid turquoise mineral tint of the lakes and comfortable river crossings)',
    howToGo:
      'Take an overnight bus or Haor Express train from Dhaka to Mymensingh or Jaria Jhanjail, then continue by local transport to Durgapur and cross the Someshwari River to Bijoypur Ceramic Hills.',
    highlights: [
      'Striking pastel-white and ochre kaolin clay cliffs framing the sapphire-blue Nil Pani lake',
      'Wide sandy banks and quiet ferry crossings over the borderland Someshwari River',
      'Living Garo and Hajong cultural heritage showcased at the Birishiri Tribal Cultural Academy',
    ],
    coordinates: { lat: 25.1342, lng: 90.6788 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Blue_water_Birishiri.jpg/1280px-Blue_water_Birishiri.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Birishiri%2C_Netrokona.jpg/1280px-Birishiri%2C_Netrokona.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Birishiri_Durgapur_Netrakona_Bangladesh_%28159746505%29.jpeg/1280px-Birishiri_Durgapur_Netrakona_Bangladesh_%28159746505%29.jpeg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Birishiri_Durgapur_Netrokona.jpg/1280px-Birishiri_Durgapur_Netrokona.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'keokradong',
    name: 'Keokradong',
    division: 'Chattogram',
    district: 'Bandarban',
    category: 'Hills',
    tagline: 'A storied cloud-piercing summit above Boga Lake and Darjeeling Para.',
    description:
      'Standing roughly 986 meters above sea level in Ruma Upazila, Keokradong has long held a legendary place in Bangladesh’s mountaineering imagination. The ascent winds past the sapphire crater waters of Boga Lake, terraced bamboo hill slopes, and the spotless mountain hamlet of Darjeeling Para before opening onto sweeping 360-degree sunrise views above drifting valleys of mist.',
    bestTime:
      'November to February (dry ridge trails, crisp mountain air, and sweeping dawn views above the cloud deck)',
    howToGo:
      'Travel from Dhaka or Chattogram to Bandarban town, continue by local jeep to Ruma Bazar, complete mandatory tourist registration with a local guide, and climb via Boga Lake and Darjeeling Para.',
    highlights: [
      'Unforgettable golden sunrise above layered cloud seas from the Keokradong summit helipad',
      'High-altitude trail linking serene Boga Lake, Chingri Waterfall, and immaculate Darjeeling Para',
      'Panoramic vistas extending toward distant Tajingdong ridges and Jadipai valley below',
    ],
    coordinates: { lat: 21.9498, lng: 92.5145 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Above_The_Clouds_Close_To_Heaven.jpg/1280px-Above_The_Clouds_Close_To_Heaven.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Goodmorning_Keokaradang_%286830453822%29.jpg/1280px-Goodmorning_Keokaradang_%286830453822%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Keokradong%2C_Ruma%2C_Bandarban%2C_Bangladesh.jpg/1280px-Keokradong%2C_Ruma%2C_Bandarban%2C_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Jadipai_Para.JPG/1280px-Jadipai_Para.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'kaptai-lake-hanging-bridge',
    name: 'Kaptai Lake & Hanging Bridge',
    division: 'Chattogram',
    district: 'Rangamati',
    category: 'Hills',
    tagline: 'Emerald hill-rimmed waters linked by Rangamati’s iconic suspension bridge.',
    description:
      'As the largest man-made freshwater lake in Bangladesh, Kaptai Lake weaves like an emerald labyrinth around forested islands and steep Chittagong Hill Tracts ridges. At its heart stands Rangamati’s beloved 335-foot Jhulonto Bridge (Hanging Bridge), framing wooden Sampan boats gliding toward Shuvolong Waterfall, Rajban Vihara, and lakeside Chakma villages.',
    bestTime:
      'September to March (post-monsoon fills the lake around the bridge and feeds Shuvolong Waterfall; winter offers calm sunsets)',
    howToGo:
      'Take a direct overnight highway bus from Dhaka to Rangamati town, or travel two hours east from Chattogram along the scenic hilly Kaptai–Rangamati highway.',
    highlights: [
      'Signature 335-foot pedestrian suspension bridge spanning two wooded peninsulas of Kaptai Lake',
      'Tranquil wooden boat cruises past hidden island hamlets to the dramatic gorge of Shuvolong Waterfall',
      'Golden-hour mirror reflections across the lake and visits to Rajban Vihara Buddhist Monastery',
    ],
    coordinates: { lat: 22.6336, lng: 92.1945 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Hanging_Bridge%2C_Kaptai_Lake.jpg/1280px-Hanging_Bridge%2C_Kaptai_Lake.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Hanging_Bridge_at_Kaptai_Lake_%283%29.jpg/1280px-Hanging_Bridge_at_Kaptai_Lake_%283%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Rangamati_lake-kaptai.jpg/1280px-Rangamati_lake-kaptai.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Sunset_on_Rangamati_Lake01.jpg/1280px-Sunset_on_Rangamati_Lake01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'nijhum-dwip',
    name: 'Nijhum Dwip',
    division: 'Chattogram',
    district: 'Noakhali',
    category: 'Sea',
    tagline: 'A quiet deltaic sanctuary of keora mangroves, wild deer, and untamed shores.',
    description:
      'Rising gracefully from the Meghna estuary where river silt meets the open Bay of Bengal, Nijhum Dwip (Silent Island) is a protected national park of sweeping mudflats, coastal keora mangrove forests, and deserted beaches. True to its name, the island moves to the hushed rhythm of tides, herds of shy spotted deer slipping through forest clearings, and thousands of winter shorebirds.',
    bestTime:
      'November to March (calm estuarine crossings, mild sunshine, and vibrant migratory bird flocks)',
    howToGo:
      'Board an overnight river launch from Dhaka’s Sadarghat to Tamruddi Ghat on Hatiya Island (or travel via Noakhali to Chairman Ghat and cross by sea-truck to Hatiya), then ride south to Moktaria Ghat and take a short boat across to Nijhum Dwip.',
    highlights: [
      'Peaceful dawn walks along Namar Bazar Beach and remote coastal sandbars facing the Bay of Bengal',
      'Quiet wooden boat journeys along Chowdhury Khal winding deep inside keora mangrove groves',
      'Protected coastal wildlife sanctuary sheltering spotted deer herds and winter migratory waterbirds',
    ],
    coordinates: { lat: 22.0568, lng: 91.0021 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Nijhum_Dwip.jpg/1280px-Nijhum_Dwip.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/%E0%A6%A8%E0%A6%BF%E0%A6%9D%E0%A7%81%E0%A6%AE_%E0%A6%A6%E0%A7%8D%E0%A6%AC%E0%A7%80%E0%A6%AA%E0%A7%87_%E0%A6%B8%E0%A7%82%E0%A6%B0%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%A4.jpg/1280px-%E0%A6%A8%E0%A6%BF%E0%A6%9D%E0%A7%81%E0%A6%AE_%E0%A6%A6%E0%A7%8D%E0%A6%AC%E0%A7%80%E0%A6%AA%E0%A7%87_%E0%A6%B8%E0%A7%82%E0%A6%B0%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%A4.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/%E0%A6%A8%E0%A6%BF%E0%A6%9D%E0%A7%81%E0%A6%AE%E0%A7%87%E0%A6%B0_%E0%A6%A6%E0%A7%8D%E0%A6%AC%E0%A7%80%E0%A6%AA%E0%A7%87_%E0%A6%9A%E0%A7%8C%E0%A6%A7%E0%A7%81%E0%A6%B0%E0%A7%80_%E0%A6%96%E0%A6%BE%E0%A6%B2%E0%A7%87_%E0%A6%AF%E0%A6%BE%E0%A6%AC%E0%A6%BE%E0%A6%B0_%E0%A6%AA%E0%A6%A5%E0%A7%87.jpg/1280px-%E0%A6%A8%E0%A6%BF%E0%A6%9D%E0%A7%81%E0%A6%AE%E0%A7%87%E0%A6%B0_%E0%A6%A6%E0%A7%8D%E0%A6%AC%E0%A7%80%E0%A6%AA%E0%A7%87_%E0%A6%9A%E0%A7%8C%E0%A6%A7%E0%A7%81%E0%A6%B0%E0%A7%80_%E0%A6%96%E0%A6%BE%E0%A6%B2%E0%A7%87_%E0%A6%AF%E0%A6%BE%E0%A6%AC%E0%A6%BE%E0%A6%B0_%E0%A6%AA%E0%A6%A5%E0%A7%87.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Nijum_dip_-_HATIA_-_NOAKHALI.jpg/1280px-Nijum_dip_-_HATIA_-_NOAKHALI.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'inani-beach',
    name: 'Inani Beach',
    division: 'Chattogram',
    district: "Cox's Bazar",
    category: 'Sea',
    tagline: 'Moss-green coral boulders and glassy tides along serene Marine Drive.',
    description:
      'Located roughly 25 kilometers south of Cox’s Bazar town in Ukhia Upazila, Inani Beach trades urban energy for wide, whisper-quiet golden sand strewn with ancient dark coral stones. At low tide, the receding Bay of Bengal reveals sculpted tidal pools, emerald sea-moss boulders, and dramatic silhouettes of traditional wooden Sampan fishing boats lined along the shore.',
    bestTime:
      'November to March (calm crystal-clear waters and low tides exposing the signature coral boulder formations)',
    howToGo:
      "From Cox's Bazar town (Kolatoli Circle), enjoy a 45-minute coastal drive south along Marine Drive by open Chander Gari, CNG auto-rickshaw, or private car passing Himchari.",
    highlights: [
      'Sculpted fossilized coral boulders and reflective tide pools revealed during morning and afternoon low tide',
      'Hand-built traditional moon-shaped Sampan fishing boats silhouetted against amber sunsets',
      'Quieter, cleaner stretch of the Bay of Bengal bordered by lush coastal hills along Marine Drive',
    ],
    coordinates: { lat: 21.2279, lng: 92.0493 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Inani_Beach_Fishing_Boat_Silhouette_Bay_of_Bengal_Bangladesh.jpg/1280px-Inani_Beach_Fishing_Boat_Silhouette_Bay_of_Bengal_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Inani_Beach_%28Cox%27s_Bazar%29.jpg/1280px-Inani_Beach_%28Cox%27s_Bazar%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Sunrise_over_Inani_Beach%2C_Cox%27s_Bazar%2C_Bangladesh.jpg/1280px-Sunrise_over_Inani_Beach%2C_Cox%27s_Bazar%2C_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Beach_rocks_coral_rocks.jpg/1280px-Beach_rocks_coral_rocks.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'lawachara-national-park',
    name: 'Lawachara National Park',
    division: 'Sylhet',
    district: 'Moulvibazar',
    category: 'Forest',
    tagline: 'A living semi-evergreen rainforest echoing with hoolock gibbon calls.',
    description:
      'Spanning 1,250 hectares of West Bhanugach Reserve Forest just outside Sreemangal, Lawachara National Park is one of Bangladesh’s richest remaining pockets of tropical rainforest. Towering chapalish, teak, and bamboo groves filter shafts of morning sunlight onto shaded footpaths, a historic railway line cutting through the woods, and traditional Khasia betel-leaf punjis.',
    bestTime:
      'October to March for dry forest trails and birdwatching; June to September for lush monsoon canopy drama',
    howToGo:
      'Arrive at Sreemangal by intercity train or highway bus from Dhaka or Sylhet, then ride 15 minutes east along the Kamalganj road straight to the Lawachara National Park entrance.',
    highlights: [
      'Early-morning wildlife trails for spotting endangered western hoolock gibbons and Phayre’s leaf monkeys',
      'Photogenic narrow railway track threading directly through towering rainforest canopies',
      'Visits to neighboring Magurchara and Lawachara Khasia indigenous villages nestled amid betel groves',
    ],
    coordinates: { lat: 24.3267, lng: 91.7867 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Way_back_home_Lawachara_National_Park_Srimongol_Sylhet_Bangladesh.jpg/1280px-Way_back_home_Lawachara_National_Park_Srimongol_Sylhet_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Bamboo_in_Lawachara.JPG/1280px-Bamboo_in_Lawachara.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Forest_Interior.jpg/1280px-Forest_Interior.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Lawachara_National_Park_%2840992565742%29.jpg/1280px-Lawachara_National_Park_%2840992565742%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'sixty-dome-mosque',
    name: 'Sixty Dome Mosque (Shat Gombuj Masjid)',
    division: 'Khulna',
    district: 'Bagerhat',
    category: 'Heritage',
    tagline: 'A fifteenth-century Bengal Sultanate brick cathedral crowned by 81 domes.',
    description:
      'Built in the mid-fifteenth century by the revered saint-general Khan Jahan Ali as the centerpiece of ancient Khalifatabad, the Sixty Dome Mosque is the largest historic Sultanate mosque in Bangladesh and a jewel of the UNESCO World Heritage Mosque City of Bagerhat. Despite its famous name, 60 slender stone pillars support 77 low brick domes—plus four corner turrets—creating a solemn hypostyle hall rich in Bengali terracotta floral reliefs.',
    bestTime:
      'November to February (mild winter sunlight illuminates the warm red terracotta facade and surrounding Ghora Dighi lake)',
    howToGo:
      'Take a direct highway bus from Dhaka via the Padma Bridge to Bagerhat in roughly four to five hours, or travel 45 minutes east from Khulna city along the Khulna–Bagerhat highway.',
    highlights: [
      'UNESCO World Heritage hypostyle prayer hall uniting 60 stone columns with 77 curved brick domes and chauchala vaults',
      'Signature curved Bengali cornice and intricately carved fifteenth-century terracotta mihrabs',
      'Tranquil historic Ghora Dighi water tank and nearby Bagerhat Archaeological Museum',
    ],
    coordinates: { lat: 22.6746, lng: 89.7419 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Sixty_dome_mosque_bagerhat_Bangladesh.jpg/1280px-Sixty_dome_mosque_bagerhat_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/The_Shat_Gombuj_Masjid%2C_Bagherhat%2C_khulna%2C_February_2018.jpg/1280px-The_Shat_Gombuj_Masjid%2C_Bagherhat%2C_khulna%2C_February_2018.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Sixty_Dome_Mosque%2CBagerhat.jpg/1280px-Sixty_Dome_Mosque%2CBagerhat.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Sixty_Dome_Mosque%2C_Bagerhat%2C_Bangladesh_01.jpg/1280px-Sixty_Dome_Mosque%2C_Bagerhat%2C_Bangladesh_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'ahsan-manzil',
    name: 'Ahsan Manzil',
    division: 'Dhaka',
    district: 'Dhaka',
    category: 'Heritage',
    tagline: 'Old Dhaka’s legendary Pink Palace overlooking the lively Buriganga River.',
    description:
      'Constructed between 1859 and 1872 as the official residential palace and seat of the Nawabs of Dhaka, Ahsan Manzil stands in unmistakable rose-pink splendor along Kumartoli on the northern bank of the Buriganga River. Combining Indo-Saracenic grandeur with European classical symmetry, its grand double staircase, soaring octagonal dome, and 23 curated museum galleries tell the story of nineteenth-century Bengal’s aristocratic and political awakening.',
    bestTime:
      'November to February (pleasant mornings for exploring both the palace lawns and historic Old Dhaka lanes)',
    howToGo:
      'Located at Kumartoli beside Sadarghat in Old Dhaka; accessible by car, CNG auto-rickshaw, rickshaw, or Dhaka Metro Rail to Motijheel or Dhaka University station followed by a short ride south.',
    highlights: [
      'Iconic rose-pink Indo-Saracenic facade crowned by a high octagonal central dome facing the Buriganga River',
      'Sweeping ceremonial front staircase leading into the restored Rangmahal and Darbar Hall',
      'National Museum galleries preserving period portraits, silver filigree crafts, chandeliers, and Nawab-era archives',
    ],
    coordinates: { lat: 23.7086, lng: 90.406 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Historic_Ahsan_Manzil_Palace_Bangladesh.jpg/1280px-Historic_Ahsan_Manzil_Palace_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Ahsan_Manzil-Front_View.jpg/1280px-Ahsan_Manzil-Front_View.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Ahsan_Manjl_Pink_Palace_Old_Dhaka_Bangladesh_-_panoramio.jpg/1280px-Ahsan_Manjl_Pink_Palace_Old_Dhaka_Bangladesh_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Ahsan_Manzil_Museum%2C_Dhaka%2C_Bangladesh.jpg/1280px-Ahsan_Manzil_Museum%2C_Dhaka%2C_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
];

export default spotsData;
