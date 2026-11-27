export const SPOT_CATEGORIES = ['Hills', 'Sea', 'Forest', 'Heritage'];

export const SEASON_TAGS = ['Winter', 'Monsoon', 'Year-Round'];

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
    seasons: ['Winter'],
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
    seasons: ['Monsoon', 'Winter'],
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
    seasons: ['Winter'],
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
    seasons: ['Monsoon'],
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
    seasons: ['Winter'],
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
    seasons: ['Monsoon'],
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
    seasons: ['Winter'],
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
    seasons: ['Year-Round'],
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
    seasons: ['Monsoon'],
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
    seasons: ['Monsoon', 'Winter'],
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
    seasons: ['Monsoon', 'Winter'],
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
    seasons: ['Year-Round'],
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
    seasons: ['Winter'],
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
    seasons: ['Winter'],
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
    seasons: ['Winter'],
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
    seasons: ['Year-Round'],
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
    seasons: ['Winter'],
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
    seasons: ['Winter'],
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
    seasons: ['Year-Round'],
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
    seasons: ['Winter'],
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
    seasons: ['Winter'],
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
    seasons: ['Year-Round'],
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
    seasons: ['Winter'],
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
    seasons: ['Year-Round'],
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
  {
    id: 'debotakhum',
    name: 'Debotakhum',
    division: 'Chattogram',
    district: 'Bandarban',
    category: 'Hills',
    tagline: 'Towering wet stone canyon walls above calm jade river waters.',
    description:
      'Hidden deep within Roangchhari Upazila in Bandarban, Debotakhum is a dramatic limestone and sandstone gorge flanked by seventy-foot moss-draped cliffs. Visitors pole narrow bamboo rafts silently between sheer canyon faces where shafts of tropical sunlight ignite deep emerald pools.',
    bestTime:
      'October to February (post-monsoon canyon water stays calm and emerald-clear for bamboo rafting)',
    seasons: ['Winter'],
    howToGo:
      'Travel from Dhaka or Chattogram to Bandarban town, take local transport to Roangchhari Bazar for tourist police registration and a local guide, then trek past Kachaptali to Ponchiram Para.',
    highlights: [
      'Silent bamboo-raft voyages slicing between sheer seventy-foot rocky canyon walls',
      'Sunlight beams illuminating tranquil emerald and jade natural water pools',
      'Forest hill trails passing welcoming Marma villages of Kachaptali and Shilbandha',
    ],
    coordinates: { lat: 22.1478, lng: 92.3452 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/%E0%A6%A6%E0%A7%87%E0%A6%AC%E0%A6%A4%E0%A6%BE%E0%A6%96%E0%A7%81%E0%A6%AE.jpg/1280px-%E0%A6%A6%E0%A7%87%E0%A6%AC%E0%A6%A4%E0%A6%BE%E0%A6%96%E0%A7%81%E0%A6%AE.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Debota_khum.jpg/1280px-Debota_khum.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/%E0%A6%A6%E0%A7%87%E0%A6%AC%E0%A6%A4%E0%A6%BE%E0%A6%96%E0%A7%81%E0%A6%AE%E0%A7%87%E0%A6%B0_%E0%A6%85%E0%A6%AD%E0%A7%8D%E0%A6%AF%E0%A6%A8%E0%A7%8D%E0%A6%A4%E0%A6%B0.jpg/1280px-%E0%A6%A6%E0%A7%87%E0%A6%AC%E0%A6%A4%E0%A6%BE%E0%A6%96%E0%A7%81%E0%A6%AE%E0%A7%87%E0%A6%B0_%E0%A6%85%E0%A6%AD%E0%A7%8D%E0%A6%AF%E0%A6%A8%E0%A7%8D%E0%A6%A4%E0%A6%B0.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/%E0%A6%A6%E0%A7%87%E0%A6%AC%E0%A6%A4%E0%A6%BE%E0%A6%96%E0%A7%81%E0%A6%AE%E0%A7%87%E0%A6%B0_%E0%A6%AA%E0%A6%BE%E0%A6%B9%E0%A6%BE%E0%A6%A1%E0%A6%BC.jpg/1280px-%E0%A6%A6%E0%A7%87%E0%A6%AC%E0%A6%A4%E0%A6%BE%E0%A6%96%E0%A7%81%E0%A6%AE%E0%A7%87%E0%A6%B0_%E0%A6%AA%E0%A6%BE%E0%A6%B9%E0%A6%BE%E0%A6%A1%E0%A6%BC.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'khoiyachora-waterfall',
    name: 'Khoiyachora Waterfall',
    division: 'Chattogram',
    district: 'Chattogram',
    category: 'Hills',
    tagline: 'Nine tiered mountain cascades tucked inside the lush Mirsharai ridges.',
    description:
      'Known affectionately as the Queen of Waterfalls in the Chattogram hill range, Khoiyachora tumbles down nine distinct limestone steps shrouded in wild bamboo and tropical ferns. Reached along terraced rice fields and bubbling hillside streams, each upper tier rewards climbers with misty plunge pools and forest stillness.',
    bestTime:
      'June to October (monsoon rains awaken all nine forested rock tiers into roaring cascades)',
    seasons: ['Monsoon'],
    howToGo:
      'Take an intercity highway coach or train from Dhaka or Chattogram to Boro Takia Bazar in Mirsharai, then ride a short CNG auto-rickshaw to the trailhead and trek roughly 45 minutes through paddy fields and streams.',
    highlights: [
      'Nine natural cascading rock steps carving through dense subtropical hill jungle',
      'Crystalline plunge pools framed by cool spray and overhanging mountain foliage',
      'Scenic stream-crossing trek skirting verdant Mirsharai hill terraces and rice paddies',
    ],
    coordinates: { lat: 22.7796, lng: 91.5924 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Khoiyachora_Waterfalls_03.jpg/1280px-Khoiyachora_Waterfalls_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Khoiyachora_Waterfalls_02.jpg/1280px-Khoiyachora_Waterfalls_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Khoiyachora_Waterfalls_04.jpg/1280px-Khoiyachora_Waterfalls_04.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Khoiyachora_Waterfalls_05.jpg/1280px-Khoiyachora_Waterfalls_05.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'bholaganj-sada-pathor',
    name: 'Bholaganj Sada Pathor',
    division: 'Sylhet',
    district: 'Sylhet',
    category: 'Hills',
    tagline: 'Luminous white boulders washed by icy emerald currents beneath Meghalaya.',
    description:
      'Where the Dholai River spills out of the steep Khasi–Jaintia escarpments in Companiganj, endless sweeps of sun-bleached quartz boulders form a dazzling natural delta. Blue-green mountain currents braid through smooth white stones under drifting cloud banks framed by sheer green cliffs along the northern frontier.',
    bestTime:
      'June to October (glacier-clear mountain currents rush over gleaming white boulders from Meghalaya)',
    seasons: ['Monsoon', 'Winter'],
    howToGo:
      'From Sylhet city, drive roughly one hour north along the Sylhet–Bholaganj highway to Bholaganj Zero Point boat station, then cross the Dholai River by traditional wooden country boat.',
    highlights: [
      'Expansive beds of gleaming white boulders polished by cool turquoise Himalayan streams',
      'Wooden country boat rides across shallow braided channels facing emerald border peaks',
      'Mist-wreathed Khasi hill waterfalls cascading across the frontier skyline',
    ],
    coordinates: { lat: 25.1745, lng: 91.7518 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Bholaganj_Sada_Pathor.jpg/1280px-Bholaganj_Sada_Pathor.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Shada_Pathor_02.jpg/1280px-Shada_Pathor_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Sada_Pathor_Boat_Station%2C_Bholaganj.jpg/1280px-Sada_Pathor_Boat_Station%2C_Bholaganj.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Sada_Pathor%2C_Bholaganj%2C_Companyganj%2C_Sylhet.jpg/1280px-Sada_Pathor%2C_Bholaganj%2C_Companyganj%2C_Sylhet.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'nilachal',
    name: 'Nilachal',
    division: 'Chattogram',
    district: 'Bandarban',
    category: 'Hills',
    tagline: 'Bandarban’s sunset sanctuary floating 2,000 feet above coastal mist.',
    description:
      'Crowning Tiger Hill just south of Bandarban town, Nilachal rises nearly 2,000 feet above sea level with sweeping, unobstructed views over layered Chittagong Hill Tracts valleys. Known as the Darjeeling of Bengal, its stone terraces welcome drifting monsoon cloud seas by morning and amber-violet horizon sunsets toward Cox’s Bazar on clear winter evenings.',
    bestTime:
      'August to February (drifting monsoon clouds and crisp winter sunsets over Bandarban ridges)',
    seasons: ['Monsoon', 'Winter', 'Year-Round'],
    howToGo:
      'Travel by overnight coach from Dhaka or Chattogram to Bandarban town, then climb just 5 kilometers uphill along the Tigerpara ridge road by Chander Gari, CNG auto-rickshaw, or jeep.',
    highlights: [
      'Sweeping hilltop terraces gazing across terraced valleys toward the Bay of Bengal horizon',
      'Clouds drifting directly over garden pavilions during monsoon dawns and post-rain twilight',
      'Scenic ridge-top viewpoints easily paired with nearby Meghla and Shoilo Propat',
    ],
    coordinates: { lat: 22.1645, lng: 92.2096 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Bandarban_Nilachal_Sunset.JPG/1280px-Bandarban_Nilachal_Sunset.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/View_of_Nilachal_hill_after_rain%2C_Bandarban_%282%29.jpg/1280px-View_of_Nilachal_hill_after_rain%2C_Bandarban_%282%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Nilachal%2C_Bandarban_%282Q7A0620%29.jpg/1280px-Nilachal%2C_Bandarban_%282Q7A0620%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Nilachal%2C_Bandarban_%282Q7A0671%29.jpg/1280px-Nilachal%2C_Bandarban_%282Q7A0671%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'guliakhali-sea-beach',
    name: 'Guliakhali Sea Beach',
    division: 'Chattogram',
    district: 'Chattogram',
    category: 'Sea',
    tagline: 'Velvet green sea-grass meadows carved by winding tidal mirrors.',
    description:
      'Set along the Sandwip Channel west of Sitakunda, Guliakhali breaks every mold of a conventional sandy shore. At ebb tide, sprawling green sea-grass meadows veined with curved water channels catch the amber sky like shattered mirrors beside tangled keora mangrove roots.',
    bestTime:
      'October to March (low tides expose lush emerald sea-grass carpets threaded by mirrored channels)',
    seasons: ['Winter', 'Year-Round'],
    howToGo:
      'Take an intercity bus or train from Dhaka or Chattogram to Sitakunda Bazar, then ride 5 kilometers west through lush coastal farmland by CNG auto-rickshaw straight to the embankment.',
    highlights: [
      'Natural green sea-grass dunes divided by calm, sky-reflecting tidal water veins',
      'Sculpted keora mangrove roots framing tranquil sunset horizons over the Sandwip Channel',
      'Quiet wooden fisherman skiffs resting beside coastal mudflats at golden hour',
    ],
    coordinates: { lat: 22.5966, lng: 91.6177 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Guliakhali_Sea_Beach%2C_Sitakundu.jpg/1280px-Guliakhali_Sea_Beach%2C_Sitakundu.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Guliakhali_mangrove_sea_beach.jpg/1280px-Guliakhali_mangrove_sea_beach.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Guliakhali_Sea_Beach%2C_Sitakundu_%282%29.jpg/1280px-Guliakhali_Sea_Beach%2C_Sitakundu_%282%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Guliakhali_Sea_Beach_Sitakunda.jpg/1280px-Guliakhali_Sea_Beach_Sitakunda.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'parki-beach',
    name: 'Parki Beach',
    division: 'Chattogram',
    district: 'Chattogram',
    category: 'Sea',
    tagline: 'A tranquil casuarina-shaded spit where the Karnaphuli meets the bay.',
    description:
      'Tucked quietly across the Karnaphuli River in Anwara Upazila, Parki Beach traces a sweeping 15-kilometer arc where river estuary meets the open Bay of Bengal. Whispering jhau-bon pine corridors shield the soft sand from city clamor, offering views of distant anchored ships gliding across amber evening swells.',
    bestTime:
      'November to March (calm estuary horizons framed by shaded casuarina groves and sunset silhouettes)',
    seasons: ['Winter', 'Year-Round'],
    howToGo:
      'From Chattogram city, travel south through the Bangabandhu Tunnel beneath the Karnaphuli River or cross the Karnaphuli Bridge into Anwara, then follow coastal signs directly to Parki Beach.',
    highlights: [
      'Shaded casuarina tree avenues opening onto wide, peaceful estuarine sands',
      'Panoramic twilight silhouettes of coastal vessels drifting past the Karnaphuli mouth',
      'Gentle surf and seasonal red-crab trails along the quieter southern headland',
    ],
    coordinates: { lat: 22.1997, lng: 91.8124 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Calm_Noon_at_Parki_Beach_on_a_Non-Weekend_04.jpg/1280px-Calm_Noon_at_Parki_Beach_on_a_Non-Weekend_04.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Calm_Noon_at_Parki_Beach_on_a_Non-Weekend_06.jpg/1280px-Calm_Noon_at_Parki_Beach_on_a_Non-Weekend_06.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Calm_Noon_at_Parki_Beach_on_a_Non-Weekend_09.jpg/1280px-Calm_Noon_at_Parki_Beach_on_a_Non-Weekend_09.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Crystal_Gold_Ship_at_Parki_Beach%2C_Chittagong.jpg/1280px-Crystal_Gold_Ship_at_Parki_Beach%2C_Chittagong.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'himchari',
    name: 'Himchari',
    division: 'Chattogram',
    district: "Cox's Bazar",
    category: 'Sea',
    tagline: 'Emerald cliffside waterfalls overlooking endless Bay of Bengal surf.',
    description:
      'Standing 12 kilometers south of Cox’s Bazar along Marine Drive, Himchari National Park unites forested coastal hill ridges directly with crashing ocean waves. Visitors climb wooden ridge steps through dense evergreen forest to gaze across the uninterrupted blue curvature of the Bay of Bengal while hill springs cascade cleanly onto the cliff trail below.',
    bestTime:
      'July to February (monsoon feeds the hillside waterfall; winter unveils endless Bay of Bengal cliff panoramas)',
    seasons: ['Monsoon', 'Winter'],
    howToGo:
      "From Kolatoli Circle in Cox's Bazar, take a 20-minute scenic coastal ride south along Marine Drive by open Chander Gari, CNG auto-rickshaw, or car right to the Himchari entrance.",
    highlights: [
      'Elevated hilltop viewpoints pairing lush evergreen ridges with sweeping Bay of Bengal surf',
      'Refreshing coastal hill waterfall flowing straight down toward the sandy shoreline',
      'Rich coastal woodland sheltering tropical birds along the scenic Marine Drive corridor',
    ],
    coordinates: { lat: 21.3536, lng: 92.0258 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Himchari%2C_Cox%27s_Bazar_%282Q7A1950%29.jpg/1280px-Himchari%2C_Cox%27s_Bazar_%282Q7A1950%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Himchari_Waterfall_%2803%29.jpg/1280px-Himchari_Waterfall_%2803%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Himchari_Waterfall_%2801%29.jpg/1280px-Himchari_Waterfall_%2801%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Himchari_Waterfall_%2802%29.jpg/1280px-Himchari_Waterfall_%2802%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'sonadia-island',
    name: 'Sonadia Island',
    division: 'Chattogram',
    district: "Cox's Bazar",
    category: 'Sea',
    tagline: 'Wild coastal dunes, crimson sand crabs, and tranquil mangrove lagoons.',
    description:
      'Separated from mainland Cox’s Bazar by winding tidal creeks west of Maheshkhali, Sonadia Island preserves one of Bangladesh’s last untamed barrier-beach ecosystems. Unspoiled white shell-strewn sands, natural mangrove mudflats, and scarlet carpets of fleeing sand crabs welcome flocks of critically endangered shorebirds and nesting sea turtles.',
    bestTime:
      'November to February (calm crossings reveal untouched barrier dunes, red crabs, and rare migratory shorebirds)',
    seasons: ['Winter'],
    howToGo:
      "From Cox's Bazar Kasturi Ghat (No. 6 Jetty), board a local speedboat or wooden trawler across the Moheshkhali Channel via Ghotibhanga to reach Sonadia's sandy western shore.",
    highlights: [
      'Miles of unblemished shell beaches shimmering with crimson ghost-crab colonies',
      'Quiet tidal mangrove creeks rich with winter migratory spoon-billed sandpipers and herons',
      'Timeless coastal fishing hamlets and golden mirror-flat low-tide lagoons',
    ],
    coordinates: { lat: 21.4833, lng: 91.9 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Sonadia_Beach%2C_%28photo-Zahirul_Islam-MLA%29.jpg/1280px-Sonadia_Beach%2C_%28photo-Zahirul_Islam-MLA%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Fishing_at_Sonadia_Island.jpg/1280px-Fishing_at_Sonadia_Island.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Mangrove_Forest_and_Tidal_Mudflats_on_Sonadia_Island%2C_Maheshkhali%2C_Cox%27s_Bazar%2C_Bangladesh.jpg/1280px-Mangrove_Forest_and_Tidal_Mudflats_on_Sonadia_Island%2C_Maheshkhali%2C_Cox%27s_Bazar%2C_Bangladesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/%E0%A6%B2%E0%A6%BE%E0%A6%B2_%E0%A6%97%E0%A6%BE%E0%A6%B2%E0%A6%BF%E0%A6%9A%E0%A6%BE%E0%A6%AF%E0%A6%BC_%E0%A6%89%E0%A6%AA%E0%A6%95%E0%A7%82%E0%A6%B2%E0%A7%87%E0%A6%B0_%E0%A6%9C%E0%A7%80%E0%A6%AC%E0%A6%A8.jpg/1280px-%E0%A6%B2%E0%A6%BE%E0%A6%B2_%E0%A6%97%E0%A6%BE%E0%A6%B2%E0%A6%BF%E0%A6%9A%E0%A6%BE%E0%A6%AF%E0%A6%BC_%E0%A6%89%E0%A6%AA%E0%A6%95%E0%A7%82%E0%A6%B2%E0%A7%87%E0%A6%B0_%E0%A6%9C%E0%A7%80%E0%A6%AC%E0%A6%A8.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'maheshkhali-island',
    name: 'Maheshkhali Island',
    division: 'Chattogram',
    district: "Cox's Bazar",
    category: 'Sea',
    tagline: 'Bangladesh’s only hilly island, crowned by ancient hilltop temples.',
    description:
      'Framed between the Moheshkhali Channel and the open Bay of Bengal, Maheshkhali stands apart as Bangladesh’s sole mountainous coastal island. Green betel-leaf gardens climb beside salt pans and coastal mangrove belts, leading up stone staircases to the historic Adinath Temple and golden Buddhist pagodas overlooking sunlit harbor waters.',
    bestTime:
      'October to March (smooth speedboat crossings across the channel to Bangladesh’s only hilly island)',
    seasons: ['Winter', 'Year-Round'],
    howToGo:
      "Take a 15-minute speedboat or scenic wooden ferry from Cox's Bazar No. 6 Jetty (Kasturi Ghat) across the Moheshkhali Channel straight to Gorakghata jetty.",
    highlights: [
      'Centuries-old Adinath Temple perched atop Moinak Hill overlooking coastal mangroves',
      'Tranquil Rakhine Buddhist monasteries, golden statues, and handwoven village stalls',
      'Glittering salt evaporation pans and lush hillside sweet-paan gardens beside the bay',
    ],
    coordinates: { lat: 21.55, lng: 91.95 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Maheshkhali_view_by_Tanweer.JPG/1280px-Maheshkhali_view_by_Tanweer.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Maheshkhali.JPG/1280px-Maheshkhali.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Falling_Guardians%3B_Mangroves_of_Maheshkhali_2.jpg/1280px-Falling_Guardians%3B_Mangroves_of_Maheshkhali_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Falling_Guardians%3B_Mangroves_of_Maheshkhali_3.jpg/1280px-Falling_Guardians%3B_Mangroves_of_Maheshkhali_3.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'char-kukri-mukri',
    name: 'Char Kukri Mukri',
    division: 'Barishal',
    district: 'Bhola',
    category: 'Sea',
    tagline: 'Deltaic mangrove barrier island and serene estuarine bird sanctuary.',
    description:
      'Nicknamed the Island of Beauty along the outer edge of Bhola district where the Meghna estuary embraces the Bay of Bengal, Char Kukri Mukri blends towering coastal mangrove woodlands with isolated sandy shores. Elevated timber watchtowers rise above winding tidal creeks frequented by spotted deer, fishing cats, and winter flocks of migratory pelicans and herons.',
    bestTime:
      'November to February (calm estuarine tides, coastal mangrove creeks, and winter waterfowl sanctuaries)',
    seasons: ['Winter'],
    howToGo:
      'Board an overnight river launch from Dhaka’s Sadarghat to Char Fasson (Betua Ghat) or travel by highway to Bhola, continue south to Kacchapia Ghat, and cross by wooden engine boat to the island.',
    highlights: [
      'Peaceful Narikel Bagan beach and deserted outer-delta sandbanks facing open sea',
      'Forest observation watchtowers soaring above mangrove canopies and winding creeks',
      'Protected coastal wildlife refuge sheltering spotted deer and winter shorebird colonies',
    ],
    coordinates: { lat: 21.9195, lng: 90.6486 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Watch_Tower_of_Char_Kukri_Mukri.jpg/1280px-Watch_Tower_of_Char_Kukri_Mukri.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Forests_of_Char_Kukri_Mukri.jpg/1280px-Forests_of_Char_Kukri_Mukri.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Chor.Kukri-Mukri.2.jpg/1280px-Chor.Kukri-Mukri.2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Chor.Kukri-Mukri.6.jpg/1280px-Chor.Kukri-Mukri.6.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'teknaf-marine-drive',
    name: 'Teknaf Marine Drive',
    division: 'Chattogram',
    district: "Cox's Bazar",
    category: 'Sea',
    tagline: 'An eighty-kilometer ribbon road between jungle peaks and open ocean.',
    description:
      'Unfolding all the way from Kolatoli in Cox’s Bazar down to the tip of the Teknaf Peninsula, this iconic 80-kilometer oceanfront highway is one of Asia’s longest coastal drives. Steep evergreen hills flank the eastern shoulder while rolling turquoise swells and Sampan-dotted golden shores stretch beside the road all the way to Shamlapur and Sabrang.',
    bestTime:
      'November to March (golden coastal sunshine along 80 km of unbroken cliff-and-surf highway)',
    seasons: ['Winter', 'Year-Round'],
    howToGo:
      "Begin at Kolatoli Circle in Cox's Bazar by open Chander Gari, convertible jeep, scooter, or car and follow the paved coastal corridor south past Himchari, Inani, and Shamlapur toward Teknaf.",
    highlights: [
      'Unbroken 80 km cliff-and-ocean highway hugging the rugged Bay of Bengal coast',
      'Hand-built wooden Sampan boats resting along tranquil stretches near Shamlapur and Patuartek',
      'Golden coastal sunsets descending directly over open ocean horizon turns',
    ],
    coordinates: { lat: 21.045, lng: 92.145 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Cox%27s_bazar_marine_drive.JPG/1280px-Cox%27s_bazar_marine_drive.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Cox_Bazar_Marine_Drive_1.JPG/1280px-Cox_Bazar_Marine_Drive_1.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Cox%27s_bazar_marine_drive-6.JPG/1280px-Cox%27s_bazar_marine_drive-6.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Marine_drive%2C_Cox%27s_Bazar_02.jpg/1280px-Marine_drive%2C_Cox%27s_Bazar_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'rema-kalenga-wildlife-sanctuary',
    name: 'Rema-Kalenga Wildlife Sanctuary',
    division: 'Sylhet',
    district: 'Habiganj',
    category: 'Forest',
    tagline: 'Old-growth semi-evergreen rainforest echoing with rare gibbons and hornbills.',
    description:
      'Spanning nearly 1,800 hectares along the eastern Tarap Hills bordering Tripura, Rema-Kalenga is Bangladesh’s largest pristine dry evergreen wildlife sanctuary after the Sundarbans. Towering garjan and chapalish trees shelter endangered western hoolock gibbons, capped langurs, barking deer, and over 160 forest bird species beside tranquil woodland lakes.',
    bestTime:
      'November to March (dry forest trails ideal for spotting hoolock gibbons, capped langurs, and hornbills)',
    seasons: ['Winter'],
    howToGo:
      'Travel from Dhaka to Shaistaganj or Chunarughat in Habiganj by highway coach or Sylhet intercity train, then continue by CNG auto-rickshaw along the Chanpur tea-garden road straight to the Rema-Kalenga beat office.',
    highlights: [
      'Guided dawn wildlife trails tracking endangered western hoolock gibbons and flying squirrels',
      'Watchtower panoramas rising above untouched century-old garjan and bamboo canopies',
      'Peaceful forest creeks, lotus ponds, and neighboring indigenous Tripura hamlets',
    ],
    coordinates: { lat: 24.1158, lng: 91.6305 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Rema-Kalenga_Wildlif_Sanctuary.jpg/1280px-Rema-Kalenga_Wildlif_Sanctuary.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Rema-Kalenga_Wildlif_Sanctuary_3.jpg/1280px-Rema-Kalenga_Wildlif_Sanctuary_3.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Rema-Kalenga_Wildlif_Sanctuary_6.jpg/1280px-Rema-Kalenga_Wildlif_Sanctuary_6.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Rema-Kalenga_Wildlif_Sanctuary_8.jpg/1280px-Rema-Kalenga_Wildlif_Sanctuary_8.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'satchari-national-park',
    name: 'Satchari National Park',
    division: 'Sylhet',
    district: 'Habiganj',
    category: 'Forest',
    tagline: 'Seven winding forest streams beneath emerald Raghunandan hills.',
    description:
      'Named after the seven clear mountain streams (chara) that thread through its undulating Raghunandan Reserve hills, Satchari National Park is an intimate tropical rainforest haven between Sreemangal and Habiganj. Shaded botanical trails weave past giant ficus trees, Tripura village orchards, and a forest watchtower alive with hornbills and thrushes.',
    bestTime:
      'October to March (misty rainforest trails and high birdwatching visibility across seven forest streams)',
    seasons: ['Winter', 'Year-Round'],
    howToGo:
      'Board a Sylhet-bound highway bus or intercity train from Dhaka to Madhabpur or Shaistaganj, then ride the scenic old Dhaka–Sylhet highway directly to the Satchari National Park gate.',
    highlights: [
      'Quiet morning canopy trails alive with chestnut-tailed starlings, trogons, and hoolock gibbons',
      'Walking beside crystalline hill-stream beds crisscrossing tall sal and agarwood stands',
      'Steel tree-canopy watchtower overlooking waves of mist-draped Raghunandan hills',
    ],
    coordinates: { lat: 24.1225, lng: 91.4519 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Satchari_National_Park%2C_Habiganj%2C_Sylhet.jpg/1280px-Satchari_National_Park%2C_Habiganj%2C_Sylhet.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Satchari_National_Park_%282%29.jpg/1280px-Satchari_National_Park_%282%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Chestnut-tailed_starling%2C_Satchari_National_Park_01.jpg/1280px-Chestnut-tailed_starling%2C_Satchari_National_Park_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Common_myna_at_Satchari_National_Park.jpg/1280px-Common_myna_at_Satchari_National_Park.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'madhabkunda-waterfall-eco-park',
    name: 'Madhabkunda Waterfall & Eco Park',
    division: 'Sylhet',
    district: 'Moulvibazar',
    category: 'Forest',
    tagline: 'A 200-foot cascade plunging through mossy Patharia reserve cliffs.',
    description:
      'Set deep inside the lush Patharia Hills Reserve Forest in Barlekha Upazila, Madhabkunda sends a mighty sheet of cool mountain water plunging nearly 200 feet over sculpted black sandstone cliffs. Encircled by towering forest groves, betel-nut palms, and tranquil eco-park trails, it remains one of Sylhet’s most celebrated woodland sanctuaries.',
    bestTime:
      'June to October (monsoon swells the 200-foot cascade surrounded by dense emerald eco-park woods)',
    seasons: ['Monsoon', 'Year-Round'],
    howToGo:
      'Travel from Dhaka or Sylhet by intercity train to Kulaura Junction or highway bus to Barlekha, then continue along the forest access road straight to the Madhabkunda Eco Park gate.',
    highlights: [
      '200-foot natural forest waterfall thundering into a misty boulder-lined gorge',
      'Shaded woodland footpaths meandering past rubber estates and Khasi betel groves',
      'Moss-covered stone terraces inside the Patharia Reserve hills',
    ],
    coordinates: { lat: 24.6396, lng: 92.2248 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Madhabkunda_waterfall_%2825%29.JPG/1280px-Madhabkunda_waterfall_%2825%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Madhabkunda%2C_Bangladesh_%288996866684%29.jpg/1280px-Madhabkunda%2C_Bangladesh_%288996866684%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Front_view_of_Madhabkunda_waterfall_on_13_August_2022.jpg/1280px-Front_view_of_Madhabkunda_waterfall_on_13_August_2022.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/%E0%A6%AE%E0%A6%BE%E0%A6%A7%E0%A6%AC%E0%A6%95%E0%A7%81%E0%A6%A3%E0%A7%8D%E0%A6%A1_%E0%A6%9D%E0%A6%B0%E0%A7%8D%E0%A6%A3%E0%A6%BE%E0%A6%A7%E0%A6%BE%E0%A6%B0%E0%A6%BE.jpg/1280px-%E0%A6%AE%E0%A6%BE%E0%A6%A7%E0%A6%AC%E0%A6%95%E0%A7%81%E0%A6%A3%E0%A7%8D%E0%A6%A1_%E0%A6%9D%E0%A6%B0%E0%A7%8D%E0%A6%A3%E0%A6%BE%E0%A6%A7%E0%A6%BE%E0%A6%B0%E0%A6%BE.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'hakaluki-haor',
    name: 'Hakaluki Haor',
    division: 'Sylhet',
    district: 'Moulvibazar',
    category: 'Forest',
    tagline: 'Bangladesh’s grandest freshwater haor basin and winter bird kingdom.',
    description:
      'Spanning over 18,000 hectares of interconnected beels, marsh grasslands, and flooded hijal groves between Moulvibazar and Sylhet, Hakaluki Haor is the largest wetland ecosystem in Bangladesh. During monsoon, sailing boats glide across a calm sky-reflecting inland sea; in winter, the receding marshes harbor hundreds of thousands of migratory waterfowl.',
    bestTime:
      'November to February for migratory waterfowl; July to September for vast monsoon boat horizons',
    seasons: ['Winter', 'Monsoon'],
    howToGo:
      'Reach Kulaura or Fenchuganj from Dhaka by intercity train (Parabat, Upaban, or Jayantika Express) or highway coach, then board a local country boat from Bhabanipur or Fenchuganj Ghat.',
    highlights: [
      'Unbroken monsoon boat horizons uniting sky, lotus beds, and distant Meghalaya ridges',
      'More than 230 interconnected beels forming Bangladesh’s premier winter waterfowl haven',
      'Submerged hijal and barun swamp groves glowing golden across calm evening water',
    ],
    coordinates: { lat: 24.6639, lng: 92.0444 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Hakaluki_Haor%2C_Sylhet.jpg/1280px-Hakaluki_Haor%2C_Sylhet.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Hakaluki_Haor_by_Fardous_Kabir_01.jpg/1280px-Hakaluki_Haor_by_Fardous_Kabir_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Hakaluki_Haor_by_Fardous_Kabir_03.jpg/1280px-Hakaluki_Haor_by_Fardous_Kabir_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Hakaluki_Haor_by_Fardous_Kabir_05.jpg/1280px-Hakaluki_Haor_by_Fardous_Kabir_05.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'baikka-beel-wetland-sanctuary',
    name: 'Baikka Beel Wetland Sanctuary',
    division: 'Sylhet',
    district: 'Moulvibazar',
    category: 'Forest',
    tagline: 'A mirrored lotus sanctuary alive with purple swamphens at sunrise.',
    description:
      'Nestled along the eastern fringe of Hail Haor just north of Sreemangal, Baikka Beel is a 100-hectare permanent wetland sanctuary conserved by local communities. Timber observation towers frame breathtaking dawns as flocks of migratory pintails, whistling ducks, ospreys, and crimson-legged purple swamphens glide across pink water lilies.',
    bestTime:
      'November to February (thousands of migratory purple swamphens, ducks, and egrets gather across lotus-filled water)',
    seasons: ['Winter'],
    howToGo:
      'Arrive at Sreemangal by train or bus from Dhaka, then drive 30 minutes north through Baroora tea estates and Hail Haor embankments directly to the Baikka Beel observation towers.',
    highlights: [
      'Timber birdwatching hides offering intimate dawn views of migratory waterfowl flocks',
      'Vibrant beds of wild pink lotus and water lilies mirroring sunrise hues',
      'Protected native wetland fish and reed-bed sanctuary thriving year-round',
    ],
    coordinates: { lat: 24.3514, lng: 91.7014 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Sunrise_at_Baikka_Bil%2C_Moulovibazar_%287174718272%29.jpg/1280px-Sunrise_at_Baikka_Bil%2C_Moulovibazar_%287174718272%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Sunset_at_Baikka_Beel_%288494903058%29.jpg/1280px-Sunset_at_Baikka_Beel_%288494903058%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Flock_of_Birds_%287175071318%29.jpg/1280px-Flock_of_Birds_%287175071318%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Baikka_Bil%2C_Sylhet.jpg/1280px-Baikka_Bil%2C_Sylhet.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'nikli-haor',
    name: 'Nikli Haor',
    division: 'Dhaka',
    district: 'Kishoreganj',
    category: 'Forest',
    tagline: 'A gleaming monsoon inland ocean speckled with island villages and hijal groves.',
    description:
      'Stretching effortlessly across the eastern plains of Kishoreganj, Nikli Haor awakens every monsoon into a luminous freshwater sea. Elevated brick-lined island villages appear suspended on the horizon while wooden country boats trace mirror-like waters past submerged koroch swamp woodlands toward nearby Chhatirchar.',
    bestTime:
      'July to October (monsoon waters transform the basin into an endless mirror sky lined with submerged hijal groves)',
    seasons: ['Monsoon'],
    howToGo:
      'Take the Egarosindhur or Kishoreganj Express train from Dhaka Kamalapur to Kishoreganj Station (or drive via Bhairab), then ride a short CNG auto-rickshaw to Nikli Beribadh Boat Ghat.',
    highlights: [
      'Tranquil wooden boat voyages past the submerged koroch tree forest of Chhatirchar',
      'Floating island hamlets linked by narrow earthen causeways against endless monsoon skies',
      'Fiery sunsets burning directly onto flat glass-calm haor water',
    ],
    coordinates: { lat: 24.3247, lng: 90.9295 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Nikli_Haor_Ayon_1.jpg/1280px-Nikli_Haor_Ayon_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Nikli_haor-_under_water_field.jpg/1280px-Nikli_haor-_under_water_field.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Nikli_haor_boatman_2.jpg/1280px-Nikli_haor_boatman_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Nikli_haor_transportation.jpg/1280px-Nikli_haor_transportation.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'madhupur-national-park',
    name: 'Madhupur National Park',
    division: 'Dhaka',
    district: 'Tangail',
    category: 'Forest',
    tagline: 'Sun-dappled primeval Sal woodland rising above central Bengal red terraces.',
    description:
      'Covering over 8,400 hectares across the ancient Pleistocene red laterite ridges of Tangail, Madhupur National Park preserves Bangladesh’s grandest remaining stretch of deciduous Sal forest. Broad rust-colored trails wind beneath soaring shorea canopies inhabited by rare capped langurs, rhesus macaques, peacocks, and welcoming Mandi indigenous communities.',
    bestTime:
      'November to March (golden sunlight filters through tall deciduous Sal forest canopies and quiet red-earth trails)',
    seasons: ['Winter', 'Year-Round'],
    howToGo:
      'Take a highway coach from Dhaka’s Mohakhali or Gabtoli toward Madhupur / Mymensingh along the Tangail highway and alight directly at the Rasulpur or Dokhola Forest Range entrance.',
    highlights: [
      'Towering cathedral avenues of golden-lit Sal trees over ancient rust-red earth trails',
      'Morning wildlife glimpses of endangered capped langurs, woodpeckers, and wild junglefowl',
      'Peaceful Dokhola woodland rest house, picnic clearings, and nearby Garo pineapple orchards',
    ],
    coordinates: { lat: 24.6928, lng: 90.1069 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Modhupur_forest.jpg/1280px-Modhupur_forest.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Madhupur_National_Park%2C_Tangail%2C_Dhaka.jpg/1280px-Madhupur_National_Park%2C_Tangail%2C_Dhaka.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Picher_2_Madhupur_National_Park.jpg/1280px-Picher_2_Madhupur_National_Park.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Picher_14_Madhupur_National_Park.jpg/1280px-Picher_14_Madhupur_National_Park.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'puthia-temple-complex',
    name: 'Puthia Temple Complex',
    division: 'Rajshahi',
    district: 'Rajshahi',
    category: 'Heritage',
    tagline: 'A lakeside constellation of terracotta-carved Pancharatna and Shiva temples.',
    description:
      'Clustered gracefully around lotus-fringed Shyama Sarobar lake east of Rajshahi, Puthia preserves Bangladesh’s finest concentration of historic Hindu temple architecture alongside its stately Rajbari palace. Built between the seventeenth and nineteenth centuries by the Puthia Raj estate, its gleaming white Pancharatna Shiva Temple and crimson-brick Govinda shrines shimmer with epic terracotta panels.',
    bestTime:
      'October to March (cool dry skies illuminate ornate terracotta shrines mirrored in Shyama Sarobar lake)',
    seasons: ['Winter', 'Year-Round'],
    howToGo:
      'Travel from Dhaka to Rajshahi by intercity train (Silk City, Padma, or Dhumketu Express) or flight, then ride 45 minutes east along the Rajshahi–Natore highway to Puthia Bazar.',
    highlights: [
      'Monumental five-spired white Pancharatna Shiva Temple rising above Shyama Sarobar water',
      'Hand-carved terracotta panels on the Govinda Temple depicting Krishna Lila scenes',
      'Symmetrical Indo-Saracenic Puthia Rajbari palace surrounded by tranquil moats and courtyards',
    ],
    coordinates: { lat: 24.3642, lng: 88.8364 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Shiva_temple_at_Puthia%2C_Rajshahi.JPG/1280px-Shiva_temple_at_Puthia%2C_Rajshahi.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Govinda_temple%2C_rajshahi.JPG/1280px-Govinda_temple%2C_rajshahi.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Pancharatna_Gobinda_Temple_in_Puthia%2C_detail_01.jpg/1280px-Pancharatna_Gobinda_Temple_in_Puthia%2C_detail_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Pancharatna_Gobinda_Temple_in_Puthia%2C_detail_03.jpg/1280px-Pancharatna_Gobinda_Temple_in_Puthia%2C_detail_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'baliati-palace',
    name: 'Baliati Palace',
    division: 'Dhaka',
    district: 'Manikganj',
    category: 'Heritage',
    tagline: 'A monumental nineteenth-century Corinthian estate in rural Manikganj.',
    description:
      'Constructed across more than five hectares during the late nineteenth century by wealthy salt-merchant landlords of Saturia, Baliati Palace stands among the grandest colonial Zamindar complexes in Bengal. Four lion-crowned entrance arches lead into seven alabaster-walled palaces framed by stately Corinthian pillars, high wooden shutters, and a deep stone-stepped lotus pond.',
    bestTime:
      'November to February (mild winter light across Corinthian colonnades, lion gateways, and lotus ponds)',
    seasons: ['Winter', 'Year-Round'],
    howToGo:
      'Drive or take a bus west from Dhaka’s Gabtoli terminal along the Aricha highway to Golra or Saturia in Manikganj (about two hours), then ride a short rickshaw north to Baliati Palace.',
    highlights: [
      'Four iconic stone-lion gateways opening onto an unbroken 400-foot neoclassical colonnade',
      'Expansive brick-walled Rangmahal and residential wings preserving period stucco and staircases',
      'Tranquil back courtyard overlooking a historic stepped water tank flanked by four ghats',
    ],
    coordinates: { lat: 23.9978, lng: 90.0439 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Baliati_Palace%2C_Saturia%2C_Manikganj_%2838%29.jpg/1280px-Baliati_Palace%2C_Saturia%2C_Manikganj_%2838%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Baliati_Palace_2.jpg/1280px-Baliati_Palace_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Baliati_Pond.jpg/1280px-Baliati_Pond.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Baliati_Zamindari_03.jpg/1280px-Baliati_Zamindari_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'mohera-zamindar-bari',
    name: 'Mohera Zamindar Bari',
    division: 'Dhaka',
    district: 'Tangail',
    category: 'Heritage',
    tagline: 'Pastel neoclassical lodges set inside botanical gardens and still ponds.',
    description:
      'Built in the 1890s along the tranquil Louhojang river basin in Mirzapur, Mohera Zamindar Bari is celebrated as the best-restored estate complex in central Bangladesh. Ornate arched entrances, pastel-white Chowdhuri, Maharaj, Ananda, and Kalicharan lodges, botanical flower gardens, and the serene Vishakha Sagar pond preserve nineteenth-century rural elegance.',
    bestTime:
      'October to March (pleasant temperatures for strolling the manicured gardens, arched lodges, and Vishakha Sagar pond)',
    seasons: ['Winter', 'Year-Round'],
    howToGo:
      'Travel roughly 65 km northwest from Dhaka along the Dhaka–Tangail highway to Natiapara Bus Stand in Mirzapur, then ride 4 kilometers east by local transport straight into Mohera.',
    highlights: [
      'Four distinct ornate colonial-era lodges: Maharaj, Ananda, Chowdhury, and Kalicharan',
      'Iconic triumphal entry arch and manicured central flower lawns overlooking Vishakha Sagar',
      'Immaculate stucco friezes, winding staircases, and shaded poolside pavilions',
    ],
    coordinates: { lat: 24.1226, lng: 90.0686 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Mohera_Jamidar_Bari.jpg/1280px-Mohera_Jamidar_Bari.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Mohera_Zamindar_Bari.jpg/1280px-Mohera_Zamindar_Bari.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Mohera_Zamindar_Bari_Museum.jpg/1280px-Mohera_Zamindar_Bari_Museum.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Mohera_Zamindar_Bari%2C_Tangail_02.jpg/1280px-Mohera_Zamindar_Bari%2C_Tangail_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'shilaidaha-kuthibari',
    name: 'Shilaidaha Kuthibari',
    division: 'Khulna',
    district: 'Kushtia',
    category: 'Heritage',
    tagline: 'Rabindranath Tagore’s serene terracotta-red manor beside the Padma.',
    description:
      'Surrounded by quiet mango orchards near the southern banks of the Padma River in Kumarkhali, Shilaidaha Kuthibari was the beloved rural estate where Nobel laureate Rabindranath Tagore penned timeless poems of Gitanjali and Sonar Tari. Its three-story stepped brick manor houses wooden river houseboat relics, writing desks, and manuscripts.',
    bestTime:
      'November to February (serene winter afternoons exploring Tagore’s riverfront estate, mango orchards, and archives)',
    seasons: ['Winter', 'Year-Round'],
    howToGo:
      'Cross the Padma Bridge from Dhaka by highway coach or board the Sundarban / Chitra Express train to Kushtia Court Station, then take a 25-minute ride east to Shilaidaha Kuthibari.',
    highlights: [
      'Distinguished tiered red-brick Tagore family manor crowned by peaceful rooftop verandas',
      'Historic museum rooms preserving Tagore’s houseboat, study furniture, and rare photographs',
      'Luminous winter light falling across surrounding bakul trees, lotus ponds, and orchards',
    ],
    coordinates: { lat: 23.9242, lng: 89.2225 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Tagore_Kuthibari.jpg/1280px-Tagore_Kuthibari.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Shilaidaha_Kuthibari_Bangladesh.JPG/1280px-Shilaidaha_Kuthibari_Bangladesh.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Shilaidaha_Kuthibari_Bangladesh_%2810%29.JPG/1280px-Shilaidaha_Kuthibari_Bangladesh_%2810%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Shilaidaha_Kuthibari_Bangladesh_%2811%29.JPG/1280px-Shilaidaha_Kuthibari_Bangladesh_%2811%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'curzon-hall',
    name: 'Curzon Hall',
    division: 'Dhaka',
    district: 'Dhaka',
    category: 'Heritage',
    tagline: 'A crimson Indo-Saracenic landmark at the heart of Dhaka University.',
    description:
      'Inaugurated in 1904 along Ramna’s leafy avenues and today home to the Faculty of Science at the University of Dhaka, Curzon Hall marries Mughal horseshoe cusped arches and chhatri domes with European Renaissance masonry. Its deep-red terracotta brickwork and broad botanical courtyard stand among Dhaka’s proudest architectural icons.',
    bestTime:
      'November to February (golden winter sun glows across crimson-brick horseshoe arches and botanical lawns)',
    seasons: ['Year-Round'],
    howToGo:
      'Located beside Doel Chattar and Shahidullah Hall in central Dhaka; steps away from Dhaka University Metro Rail Station or accessible via rickshaw and car across Ramna.',
    highlights: [
      'Deep crimson brickwork adorned with Mughal chhatri pavilions, domes, and horseshoe arches',
      'Tranquil botanical garden courtyard and historic University of Dhaka campus avenues',
      'Witness to historic moments in Bengal’s 1952 Language Movement and cultural awakening',
    ],
    coordinates: { lat: 23.7272, lng: 90.4017 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Curzon_Hall_-_Northern_Facade_-_University_of_Dhaka_-_Dhaka_2015-05-31_1992.JPG/1280px-Curzon_Hall_-_Northern_Facade_-_University_of_Dhaka_-_Dhaka_2015-05-31_1992.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Curzon_Hall%2C_Dhaka_University_14.jpg/1280px-Curzon_Hall%2C_Dhaka_University_14.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Curzon_Hall%2C_Dhaka_University_01.jpg/1280px-Curzon_Hall%2C_Dhaka_University_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Curzon_Hall%2C_Dhaka_University_03.jpg/1280px-Curzon_Hall%2C_Dhaka_University_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
  {
    id: 'bagha-mosque',
    name: 'Bagha Mosque',
    division: 'Rajshahi',
    district: 'Rajshahi',
    category: 'Heritage',
    tagline: 'A 1523 Bengal Sultanate jewel celebrated for terracotta mango carvings.',
    description:
      'Constructed in 1523 CE by Sultan Nasiruddin Nusrat Shah beside a grand fifty-two-bigha brick-stepped water tank southeast of Rajshahi, Bagha Shahi Mosque exemplifies classical Husain Shahi architecture. Its curved Bengali brick cornice, octagonal corner towers, and finely sculpted terracotta reliefs of Rajshahi mango clusters rank among South Asia’s most delicate brick artworks.',
    bestTime:
      'November to February (crisp northern skies highlight sixteenth-century Bengal Sultanate terracotta mango reliefs)',
    seasons: ['Winter', 'Year-Round'],
    howToGo:
      'Reach Rajshahi by intercity train or flight from Dhaka (or take the highway bus toward Charghat/Bagha), then drive roughly one hour southeast along the Padma basin road to Bagha Bazar.',
    highlights: [
      'Signature curved Husain Shahi cornice and ten-domed brick prayer hall dating to 1523 CE',
      'Delicate terracotta floral panels famously depicting traditional Rajshahi mango clusters',
      'Expansive historic brick-lined Bagha Dighi reservoir beside the mosque courtyard',
    ],
    coordinates: { lat: 24.1933, lng: 88.835 },
    images: {
      cover:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Bagha_Mosque_02.jpg/1280px-Bagha_Mosque_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      gallery: [
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Bagha_Mosque%2C_Rajshahi%2C_Bangladesh_03.jpg/1280px-Bagha_Mosque%2C_Rajshahi%2C_Bangladesh_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Bagha_Shahi_Mosque.jpg/1280px-Bagha_Shahi_Mosque.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Bagha_Mosque_long_view.jpg/1280px-Bagha_Mosque_long_view.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      ],
    },
  },
];

export default spotsData;
