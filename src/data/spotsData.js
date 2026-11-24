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
];

export default spotsData;
