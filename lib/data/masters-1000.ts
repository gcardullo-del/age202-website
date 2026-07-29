export const MASTERS_1000_SLUGS = [
  "indian-wells",
  "miami",
  "monte-carlo",
  "madrid",
  "rome",
  "canada",
  "cincinnati",
  "shanghai",
  "paris",
] as const;

export type Masters1000Slug = (typeof MASTERS_1000_SLUGS)[number];

export type Masters1000Colors = {
  primary: string;
  secondary: string;
  glow: string;
};

export type Masters1000Fact = {
  label: string;
  value: string;
};

export type Masters1000TimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export type Masters1000Record = {
  label: string;
  value: string;
  description: string;
};

export type Masters1000IconicMoment = {
  year: string;
  title: string;
  description: string;
};

export type Masters1000TournamentReference = {
  slug: Masters1000Slug;
  name: string;
};

export type Masters1000Data = {
  slug: Masters1000Slug;
  code: string;
  visualCode: string;

  name: string;
  shortName: string;
  officialName: string;

  city: string;
  country: string;
  venue: string;

  surface: string;
  calendar: string;
  founded: string;

  eyebrow: string;
  headline: string;
  introduction: string;
  identity: string;
  motto: string;

  latitude: number;
  longitude: number;
  tourOrder: number;

  colors: Masters1000Colors;

  facts: Masters1000Fact[];
  history: string[];
  timeline: Masters1000TimelineEntry[];
  records: Masters1000Record[];
  iconicMoments: Masters1000IconicMoment[];

  previousTournament?: Masters1000TournamentReference;
  nextTournament?: Masters1000TournamentReference;
};

type Masters1000TournamentBase = Omit<
  Masters1000Data,
  "previousTournament" | "nextTournament"
>;

const masters1000BaseList: Masters1000TournamentBase[] = [
  {
    slug: "indian-wells",
    code: "IW",
    visualCode: "IW",

    name: "Indian Wells",
    shortName: "Indian Wells",
    officialName: "BNP Paribas Open",

    city: "Indian Wells",
    country: "United States",
    venue: "Indian Wells Tennis Garden",

    surface: "Outdoor hard",
    calendar: "March",
    founded: "1974",

    eyebrow: "The desert stage",
    headline: "Where the Masters 1000 season begins.",
    introduction:
      "Indian Wells opens the ATP Masters 1000 journey in the California desert, combining expansive facilities, major-event atmosphere and some of the most demanding outdoor hard-court conditions of the season.",
    identity: "The desert’s grand tennis stage",
    motto: "Where the road to greatness begins.",

    latitude: 33.7237,
    longitude: -116.3745,
    tourOrder: 1,

    colors: {
      primary: "#C69BFF",
      secondary: "#24143D",
      glow: "rgba(174, 111, 255, 0.42)",
    },

    facts: [
      {
        label: "Circuit position",
        value: "Masters 1000 opening event",
      },
      {
        label: "Environment",
        value: "California desert",
      },
      {
        label: "Surface",
        value: "Outdoor hard court",
      },
      {
        label: "Season chapter",
        value: "Sunshine Double",
      },
    ],

    history: [
      "The tournament developed through several locations and identities before establishing its permanent home in Indian Wells, California.",
      "Its expansion into a large combined ATP and WTA event transformed it into one of the most prestigious tournaments outside the four Grand Slams.",
      "Indian Wells Tennis Garden became central to the event’s identity, offering a spacious desert setting and one of the largest main stadiums in tennis.",
      "Today, Indian Wells represents the first major checkpoint of the Masters 1000 season and the opening half of the Sunshine Double.",
    ],

    timeline: [
      {
        year: "1974",
        title: "Tournament foundations",
        description:
          "The event begins the historical journey that eventually leads to Indian Wells.",
      },
      {
        year: "1987",
        title: "Indian Wells era",
        description:
          "The tournament establishes a lasting identity in California’s Coachella Valley.",
      },
      {
        year: "2000",
        title: "A new permanent home",
        description:
          "Indian Wells Tennis Garden becomes the tournament’s principal venue.",
      },
      {
        year: "2009",
        title: "A new chapter of growth",
        description:
          "Investment and expansion strengthen the event’s global profile and fan experience.",
      },
      {
        year: "Today",
        title: "The desert showcase",
        description:
          "Indian Wells stands among the largest and most prestigious combined events in world tennis.",
      },
    ],

    records: [
      {
        label: "Category",
        value: "ATP Masters 1000",
        description:
          "The champion earns one of the most valuable titles and ranking rewards available on the ATP Tour.",
      },
      {
        label: "Surface profile",
        value: "Slow outdoor hard",
        description:
          "Conditions often reward physical endurance, controlled aggression and patient point construction.",
      },
      {
        label: "Tournament scale",
        value: "Expanded event",
        description:
          "A large field and extended format create a tournament atmosphere comparable to a major championship.",
      },
      {
        label: "Historic role",
        value: "Sunshine Double I",
        description:
          "Indian Wells forms the opening half of the celebrated Indian Wells–Miami sequence.",
      },
    ],

    iconicMoments: [
      {
        year: "1990",
        title: "Masters era begins",
        description:
          "Indian Wells becomes part of the elite series that evolves into today’s ATP Masters 1000.",
      },
      {
        year: "2000",
        title: "The Tennis Garden opens",
        description:
          "The event moves into a purpose-built venue that defines its modern identity.",
      },
      {
        year: "2017",
        title: "A historic Sunshine Double",
        description:
          "Roger Federer completes the Indian Wells and Miami title double during a landmark season.",
      },
    ],
  },

  {
    slug: "miami",
    code: "MIA",
    visualCode: "MI",

    name: "Miami Open",
    shortName: "Miami",
    officialName: "Miami Open presented by Itaú",

    city: "Miami Gardens",
    country: "United States",
    venue: "Hard Rock Stadium",

    surface: "Outdoor hard",
    calendar: "March",
    founded: "1985",

    eyebrow: "The tropical Masters",
    headline: "Heat, energy and world-class hard-court tennis.",
    introduction:
      "The Miami Open completes the Sunshine Double with a vibrant international event shaped by tropical conditions, diverse crowds and a distinctive stadium setting in South Florida.",
    identity: "The global festival of tennis",
    motto: "Where tennis meets the energy of Miami.",

    latitude: 25.958,
    longitude: -80.2389,
    tourOrder: 2,

    colors: {
      primary: "#44D7FF",
      secondary: "#07324A",
      glow: "rgba(40, 200, 255, 0.4)",
    },

    facts: [
      {
        label: "Circuit position",
        value: "Second Masters of the season",
      },
      {
        label: "Environment",
        value: "South Florida",
      },
      {
        label: "Surface",
        value: "Outdoor hard court",
      },
      {
        label: "Season chapter",
        value: "Sunshine Double",
      },
    ],

    history: [
      "The Miami tournament was founded with the ambition of creating a major international tennis event with a broad field and global appeal.",
      "For many years, the event became closely associated with Key Biscayne and the tropical atmosphere of Crandon Park.",
      "The move to Hard Rock Stadium introduced a new architectural identity, combining professional tennis with the infrastructure of a major sports complex.",
      "Miami remains one of the central events of the early hard-court season and the decisive second chapter of the Sunshine Double.",
    ],

    timeline: [
      {
        year: "1985",
        title: "The first edition",
        description:
          "The tournament launches as an ambitious international event with a major-style format.",
      },
      {
        year: "1987",
        title: "Key Biscayne becomes home",
        description:
          "The event establishes its celebrated tropical identity at Crandon Park.",
      },
      {
        year: "1990",
        title: "Elite series status",
        description:
          "Miami joins the leading tournament category that becomes the Masters 1000 series.",
      },
      {
        year: "2019",
        title: "Hard Rock Stadium",
        description:
          "The tournament begins a new era at a multipurpose sports and entertainment complex.",
      },
      {
        year: "Today",
        title: "A global destination",
        description:
          "Miami combines elite competition, international culture and one of the Tour’s most distinctive settings.",
      },
    ],

    records: [
      {
        label: "Category",
        value: "ATP Masters 1000",
        description:
          "Miami is one of the nine elite Masters tournaments on the ATP calendar.",
      },
      {
        label: "Climate",
        value: "Hot and humid",
        description:
          "South Florida conditions test recovery, physical preparation and concentration.",
      },
      {
        label: "Tournament identity",
        value: "International",
        description:
          "The city and event attract a highly diverse audience and worldwide player field.",
      },
      {
        label: "Historic role",
        value: "Sunshine Double II",
        description:
          "Miami completes the prestigious back-to-back sequence that begins at Indian Wells.",
      },
    ],

    iconicMoments: [
      {
        year: "1985",
        title: "A new major-style event",
        description:
          "Miami enters professional tennis with an unusually ambitious concept and international scale.",
      },
      {
        year: "2005",
        title: "A defining rivalry chapter",
        description:
          "Roger Federer and Rafael Nadal contest a memorable five-set final in Miami.",
      },
      {
        year: "2019",
        title: "A new stadium era",
        description:
          "Hard Rock Stadium hosts the tournament for the first time and reshapes its visual identity.",
      },
    ],
  },

  {
    slug: "monte-carlo",
    code: "MCM",
    visualCode: "MC",

    name: "Monte-Carlo Masters",
    shortName: "Monte-Carlo",
    officialName: "Rolex Monte-Carlo Masters",

    city: "Roquebrune-Cap-Martin",
    country: "France",
    venue: "Monte-Carlo Country Club",

    surface: "Outdoor clay",
    calendar: "April",
    founded: "1897",

    eyebrow: "The Mediterranean classic",
    headline: "Tradition, clay and the edge of the sea.",
    introduction:
      "Monte-Carlo begins the European clay-court Masters season from one of tennis’s most recognisable locations, where historic red courts overlook the Mediterranean.",
    identity: "The jewel of the clay season",
    motto: "Where elegance meets the red clay.",

    latitude: 43.7517,
    longitude: 7.4404,
    tourOrder: 3,

    colors: {
      primary: "#FF9A62",
      secondary: "#3A1C13",
      glow: "rgba(255, 119, 68, 0.42)",
    },

    facts: [
      {
        label: "Circuit position",
        value: "First clay Masters",
      },
      {
        label: "Environment",
        value: "Mediterranean coast",
      },
      {
        label: "Surface",
        value: "Outdoor clay",
      },
      {
        label: "Historical identity",
        value: "Founded in 1897",
      },
    ],

    history: [
      "Monte-Carlo is one of the oldest and most visually distinctive tournaments in international tennis.",
      "Its courts are located at the Monte-Carlo Country Club in France, immediately beside Monaco and above the Mediterranean coastline.",
      "The event has become synonymous with the beginning of the elite European clay-court campaign.",
      "Generations of clay-court specialists have used Monte-Carlo to establish momentum ahead of Madrid, Rome and Roland Garros.",
    ],

    timeline: [
      {
        year: "1897",
        title: "Tournament founded",
        description:
          "Monte-Carlo begins a tennis tradition that extends across more than a century.",
      },
      {
        year: "1928",
        title: "Country Club era",
        description:
          "The event develops around the celebrated Monte-Carlo Country Club setting.",
      },
      {
        year: "1969",
        title: "Open Era chapter",
        description:
          "The championship enters the modern professional era of men’s tennis.",
      },
      {
        year: "1990",
        title: "Masters series status",
        description:
          "Monte-Carlo becomes part of the Tour’s premier regular-season tournament category.",
      },
      {
        year: "Today",
        title: "A clay-court landmark",
        description:
          "The event remains a defining stop on the road toward Roland Garros.",
      },
    ],

    records: [
      {
        label: "Category",
        value: "ATP Masters 1000",
        description:
          "Monte-Carlo holds a central position among the Tour’s most prestigious tournaments.",
      },
      {
        label: "Surface profile",
        value: "Traditional clay",
        description:
          "Long rallies, sliding movement and tactical construction define the championship.",
      },
      {
        label: "Visual identity",
        value: "Sea and red clay",
        description:
          "The Mediterranean setting creates one of the most iconic views in professional tennis.",
      },
      {
        label: "Historic champion",
        value: "Rafael Nadal",
        description:
          "Nadal’s extraordinary dominance forms one of the defining records of the tournament.",
      },
    ],

    iconicMoments: [
      {
        year: "1897",
        title: "The tradition begins",
        description:
          "Monte-Carlo stages the first chapter of what becomes one of tennis’s oldest tournaments.",
      },
      {
        year: "2005",
        title: "A reign begins",
        description:
          "Rafael Nadal wins the title and starts an unprecedented era of dominance at the event.",
      },
      {
        year: "2013",
        title: "The streak ends",
        description:
          "Novak Djokovic defeats Nadal in the final and ends his extraordinary run of consecutive titles.",
      },
    ],
  },

  {
    slug: "madrid",
    code: "MAD",
    visualCode: "MD",

    name: "Madrid Open",
    shortName: "Madrid",
    officialName: "Mutua Madrid Open",

    city: "Madrid",
    country: "Spain",
    venue: "Caja Mágica",

    surface: "Outdoor clay",
    calendar: "April and May",
    founded: "2002",

    eyebrow: "The high-altitude Masters",
    headline: "Modern clay-court tennis in the heart of Spain.",
    introduction:
      "Madrid combines red clay with the faster conditions created by the Spanish capital’s altitude, producing an aggressive and distinctive chapter of the European clay season.",
    identity: "The modern capital of clay",
    motto: "Where altitude changes the game.",

    latitude: 40.3688,
    longitude: -3.684,
    tourOrder: 4,

    colors: {
      primary: "#FFCC55",
      secondary: "#382A0C",
      glow: "rgba(255, 196, 54, 0.4)",
    },

    facts: [
      {
        label: "Circuit position",
        value: "Fourth Masters of the season",
      },
      {
        label: "Environment",
        value: "High-altitude capital",
      },
      {
        label: "Surface",
        value: "Outdoor clay",
      },
      {
        label: "Venue",
        value: "Caja Mágica",
      },
    ],

    history: [
      "Madrid joined the elite Masters calendar in the early 2000s and initially developed as an indoor hard-court tournament.",
      "The event later moved to Caja Mágica and adopted clay, establishing a new role within the European spring season.",
      "Madrid’s altitude gives the tournament a faster clay-court character than many traditional events on the surface.",
      "The expanded combined tournament has become a major destination for players and supporters ahead of Rome and Roland Garros.",
    ],

    timeline: [
      {
        year: "2002",
        title: "Madrid joins the Tour",
        description:
          "The tournament begins as an elite indoor hard-court event in the Spanish capital.",
      },
      {
        year: "2009",
        title: "Clay and Caja Mágica",
        description:
          "Madrid moves to its modern venue and becomes part of the European clay season.",
      },
      {
        year: "2012",
        title: "The blue-clay edition",
        description:
          "A unique experimental surface creates one of the tournament’s most debated chapters.",
      },
      {
        year: "2013",
        title: "Return to red clay",
        description:
          "Traditional red clay is restored as the permanent surface of the event.",
      },
      {
        year: "Today",
        title: "An expanded Masters",
        description:
          "Madrid operates as one of the Tour’s major extended-format events.",
      },
    ],

    records: [
      {
        label: "Category",
        value: "ATP Masters 1000",
        description:
          "Madrid forms a central part of the elite European clay-court sequence.",
      },
      {
        label: "Conditions",
        value: "Faster clay",
        description:
          "Altitude helps the ball travel more quickly and rewards assertive first-strike tennis.",
      },
      {
        label: "Architecture",
        value: "Caja Mágica",
        description:
          "The venue’s modern courts and retractable roofs create a distinctive tournament environment.",
      },
      {
        label: "Season role",
        value: "Road to Paris",
        description:
          "Madrid provides a major test before Rome and the season’s clay-court Grand Slam.",
      },
    ],

    iconicMoments: [
      {
        year: "2002",
        title: "The inaugural Madrid title",
        description:
          "The Spanish capital enters the Masters calendar with an indoor hard-court championship.",
      },
      {
        year: "2009",
        title: "A complete transformation",
        description:
          "The event begins its modern clay-court era at Caja Mágica.",
      },
      {
        year: "2012",
        title: "Blue clay",
        description:
          "Madrid stages one of the most visually recognisable and controversial experiments in Tour history.",
      },
    ],
  },

  {
    slug: "rome",
    code: "ROM",
    visualCode: "RM",

    name: "Italian Open",
    shortName: "Rome",
    officialName: "Internazionali BNL d’Italia",

    city: "Rome",
    country: "Italy",
    venue: "Foro Italico",

    surface: "Outdoor clay",
    calendar: "May",
    founded: "1930",

    eyebrow: "The Eternal City Masters",
    headline: "History, theatre and red clay at the Foro Italico.",
    introduction:
      "Rome brings elite tennis into one of the sport’s most atmospheric venues, where classical architecture, passionate crowds and demanding clay courts create a defining test before Roland Garros.",
    identity: "The theatre of Italian tennis",
    motto: "Where history surrounds every point.",

    latitude: 41.9288,
    longitude: 12.456,
    tourOrder: 5,

    colors: {
      primary: "#7EE7C4",
      secondary: "#10362F",
      glow: "rgba(74, 225, 179, 0.38)",
    },

    facts: [
      {
        label: "Circuit position",
        value: "Final clay Masters",
      },
      {
        label: "Environment",
        value: "The Eternal City",
      },
      {
        label: "Surface",
        value: "Outdoor clay",
      },
      {
        label: "Venue",
        value: "Foro Italico",
      },
    ],

    history: [
      "The Italian championship began in 1930 and developed into one of the central tournaments of European tennis.",
      "After early editions in Milan, the event established its lasting identity in Rome at the Foro Italico.",
      "The venue’s statues, terraces and historic architecture give the tournament an atmosphere unlike any other Masters event.",
      "As the final Masters 1000 tournament before Roland Garros, Rome provides one of the most important indicators of clay-court form.",
    ],

    timeline: [
      {
        year: "1930",
        title: "The first Italian championship",
        description:
          "The tournament begins in Milan and enters the European tennis calendar.",
      },
      {
        year: "1935",
        title: "Rome becomes home",
        description:
          "The championship moves to the Foro Italico and begins building its lasting identity.",
      },
      {
        year: "1969",
        title: "Open Era development",
        description:
          "Rome becomes a major stage for the leading professionals of modern tennis.",
      },
      {
        year: "1990",
        title: "Masters status",
        description:
          "The Italian Open joins the premier regular-season category of the ATP Tour.",
      },
      {
        year: "Today",
        title: "The final Paris rehearsal",
        description:
          "Rome remains the last Masters-level clay event before Roland Garros.",
      },
    ],

    records: [
      {
        label: "Category",
        value: "ATP Masters 1000",
        description:
          "Rome is one of the most historically significant events in the Masters series.",
      },
      {
        label: "Surface profile",
        value: "Classical clay",
        description:
          "The courts reward movement, consistency, spin and tactical variety.",
      },
      {
        label: "Atmosphere",
        value: "Italian passion",
        description:
          "Crowd energy and the intimate grounds contribute strongly to the tournament’s identity.",
      },
      {
        label: "Season role",
        value: "Final clay test",
        description:
          "The event is the final Masters 1000 checkpoint before Roland Garros.",
      },
    ],

    iconicMoments: [
      {
        year: "1930",
        title: "Italian tennis history begins",
        description:
          "The first edition establishes a championship that becomes one of the Tour’s great traditions.",
      },
      {
        year: "2006",
        title: "An unforgettable final",
        description:
          "Rafael Nadal and Roger Federer contest a dramatic five-set championship match.",
      },
      {
        year: "2022",
        title: "A sixth Rome crown",
        description:
          "Novak Djokovic completes a landmark week by securing another title at the Foro Italico.",
      },
    ],
  },

  {
    slug: "canada",
    code: "CAN",
    visualCode: "CA",

    name: "Canadian Open",
    shortName: "Canada",
    officialName: "National Bank Open",

    city: "Toronto and Montreal",
    country: "Canada",
    venue: "Sobeys Stadium and IGA Stadium",

    surface: "Outdoor hard",
    calendar: "August",
    founded: "1881",

    eyebrow: "The Canadian summer classic",
    headline: "Two cities, one historic championship.",
    introduction:
      "The Canadian Open begins the North American summer Masters sequence through a distinctive rotating identity shared by Toronto and Montreal.",
    identity: "Canada’s travelling tennis tradition",
    motto: "Two cities. One championship legacy.",

    latitude: 45.5019,
    longitude: -73.5674,
    tourOrder: 6,

    colors: {
      primary: "#FF6B72",
      secondary: "#40161B",
      glow: "rgba(255, 71, 86, 0.4)",
    },

    facts: [
      {
        label: "Circuit position",
        value: "First summer Masters",
      },
      {
        label: "Host identity",
        value: "Toronto and Montreal",
      },
      {
        label: "Surface",
        value: "Outdoor hard court",
      },
      {
        label: "Historical identity",
        value: "Founded in 1881",
      },
    ],

    history: [
      "The Canadian Open is among the oldest continuing tennis tournaments in the world.",
      "Its modern identity is shared between Toronto and Montreal, with the men’s and women’s events rotating between the two cities.",
      "The tournament marks the transition from the European summer into the major North American hard-court campaign.",
      "Canada has hosted generations of champions and frequently produces high-intensity competition after Wimbledon.",
    ],

    timeline: [
      {
        year: "1881",
        title: "A historic beginning",
        description:
          "The Canadian championship establishes one of the oldest traditions in international tennis.",
      },
      {
        year: "1968",
        title: "Open Era arrival",
        description:
          "The event enters the modern professional era and expands its international relevance.",
      },
      {
        year: "1980s",
        title: "Two-city identity",
        description:
          "Toronto and Montreal become the defining host cities of the Canadian tournament.",
      },
      {
        year: "1990",
        title: "Elite series membership",
        description:
          "Canada becomes part of the premier ATP tournament series.",
      },
      {
        year: "Today",
        title: "The summer Masters begins",
        description:
          "The event opens the decisive Masters sequence leading toward the US Open.",
      },
    ],

    records: [
      {
        label: "Category",
        value: "ATP Masters 1000",
        description:
          "Canada is one of the Tour’s nine premier regular-season championships.",
      },
      {
        label: "Hosting model",
        value: "Rotating cities",
        description:
          "The tournament’s identity alternates between Toronto and Montreal.",
      },
      {
        label: "Surface profile",
        value: "Outdoor hard",
        description:
          "Conditions begin the adjustment toward the North American hard-court climax.",
      },
      {
        label: "Historic status",
        value: "Since 1881",
        description:
          "The championship possesses one of the longest histories in the sport.",
      },
    ],

    iconicMoments: [
      {
        year: "1881",
        title: "The Canadian championship",
        description:
          "The tournament begins a sporting tradition that survives across multiple eras.",
      },
      {
        year: "2005",
        title: "A young champion emerges",
        description:
          "Rafael Nadal captures the Canadian title during his breakthrough season.",
      },
      {
        year: "2017",
        title: "A teenage breakthrough",
        description:
          "Alexander Zverev wins the title and confirms his arrival among the Tour’s leading players.",
      },
    ],
  },

  {
    slug: "cincinnati",
    code: "CIN",
    visualCode: "CI",

    name: "Cincinnati Open",
    shortName: "Cincinnati",
    officialName: "Cincinnati Open",

    city: "Mason",
    country: "United States",
    venue: "Lindner Family Tennis Center",

    surface: "Outdoor hard",
    calendar: "August",
    founded: "1899",

    eyebrow: "The American hard-court classic",
    headline: "Speed, history and a final major preparation.",
    introduction:
      "Cincinnati combines more than a century of tournament history with fast summer hard courts and a crucial position immediately before the US Open.",
    identity: "The final Masters before New York",
    motto: "Where the road to the US Open sharpens.",

    latitude: 39.3503,
    longitude: -84.2766,
    tourOrder: 7,

    colors: {
      primary: "#5DA9FF",
      secondary: "#102B49",
      glow: "rgba(61, 150, 255, 0.4)",
    },

    facts: [
      {
        label: "Circuit position",
        value: "Second summer Masters",
      },
      {
        label: "Environment",
        value: "American Midwest",
      },
      {
        label: "Surface",
        value: "Outdoor hard court",
      },
      {
        label: "Historical identity",
        value: "Founded in 1899",
      },
    ],

    history: [
      "Cincinnati possesses one of the longest histories of any major tennis tournament in the United States.",
      "The event developed through several venues before establishing its modern home in Mason, Ohio.",
      "Its outdoor hard courts traditionally provide quick conditions and direct preparation for the US Open.",
      "Cincinnati’s place in the calendar makes it one of the most significant late-summer tests for the leading players.",
    ],

    timeline: [
      {
        year: "1899",
        title: "Tournament founded",
        description:
          "Cincinnati begins a championship tradition extending across three centuries.",
      },
      {
        year: "1979",
        title: "Mason becomes home",
        description:
          "The tournament establishes its modern base at the Lindner Family Tennis Center.",
      },
      {
        year: "1990",
        title: "Masters series status",
        description:
          "Cincinnati joins the ATP’s elite regular-season tournament category.",
      },
      {
        year: "2011",
        title: "Combined-event era",
        description:
          "The tournament strengthens its position as a major destination for men’s and women’s tennis.",
      },
      {
        year: "Today",
        title: "The New York rehearsal",
        description:
          "Cincinnati remains the final Masters 1000 tournament before the US Open.",
      },
    ],

    records: [
      {
        label: "Category",
        value: "ATP Masters 1000",
        description:
          "Cincinnati forms a central part of the North American summer series.",
      },
      {
        label: "Surface profile",
        value: "Fast outdoor hard",
        description:
          "The courts often reward aggressive serving, early ball striking and controlled attacking tennis.",
      },
      {
        label: "Historical status",
        value: "Since 1899",
        description:
          "The event carries one of the deepest tournament histories in American tennis.",
      },
      {
        label: "Season role",
        value: "Final pre-US Open Masters",
        description:
          "It provides the last Masters-level examination before New York.",
      },
    ],

    iconicMoments: [
      {
        year: "1899",
        title: "A lasting American tradition",
        description:
          "The first edition begins more than a century of championship tennis in Ohio.",
      },
      {
        year: "2018",
        title: "The complete Masters collection",
        description:
          "Novak Djokovic wins Cincinnati and becomes the first man to complete the career set of all nine Masters titles.",
      },
      {
        year: "2020",
        title: "A unique New York edition",
        description:
          "The tournament is temporarily staged at the US Open site during an exceptional season.",
      },
    ],
  },

  {
    slug: "shanghai",
    code: "SHA",
    visualCode: "SH",

    name: "Shanghai Masters",
    shortName: "Shanghai",
    officialName: "Rolex Shanghai Masters",

    city: "Shanghai",
    country: "China",
    venue: "Qizhong Forest Sports City Arena",

    surface: "Outdoor hard",
    calendar: "October",
    founded: "2009",

    eyebrow: "The Asian Masters",
    headline: "Elite hard-court tennis on a global stage.",
    introduction:
      "Shanghai represents the Masters 1000 series in Asia through a modern venue, fast hard courts and a major position in the final phase of the ATP season.",
    identity: "The flagship Masters of Asia",
    motto: "Where the season enters its final turn.",

    latitude: 31.0426,
    longitude: 121.3557,
    tourOrder: 8,

    colors: {
      primary: "#D95CFF",
      secondary: "#351143",
      glow: "rgba(207, 62, 255, 0.4)",
    },

    facts: [
      {
        label: "Circuit position",
        value: "Asian Masters 1000",
      },
      {
        label: "Environment",
        value: "Shanghai metropolis",
      },
      {
        label: "Surface",
        value: "Outdoor hard court",
      },
      {
        label: "Venue",
        value: "Qizhong Arena",
      },
    ],

    history: [
      "Shanghai developed its world-class tennis infrastructure through major year-end championships before joining the permanent Masters calendar.",
      "The Masters tournament began in 2009 and immediately became the leading regular ATP Tour event in Asia.",
      "Qizhong Forest Sports City Arena provides the championship with a modern and visually distinctive home.",
      "Shanghai now occupies a major role in the final quarter of the season, when qualification pressure for the ATP Finals intensifies.",
    ],

    timeline: [
      {
        year: "2002",
        title: "Shanghai hosts the elite",
        description:
          "The city begins establishing itself as a destination for the highest level of men’s tennis.",
      },
      {
        year: "2005",
        title: "Year-end championship era",
        description:
          "Shanghai hosts the ATP season finale and expands its international tennis profile.",
      },
      {
        year: "2009",
        title: "Masters tournament launched",
        description:
          "The Rolex Shanghai Masters joins the permanent ATP Masters calendar.",
      },
      {
        year: "2023",
        title: "Return and expansion",
        description:
          "Shanghai returns to the Tour with an expanded format and renewed global presence.",
      },
      {
        year: "Today",
        title: "Asia’s premier Masters",
        description:
          "The tournament remains the only ATP Masters 1000 event staged in Asia.",
      },
    ],

    records: [
      {
        label: "Category",
        value: "ATP Masters 1000",
        description:
          "Shanghai represents the elite Masters category across the Asian swing.",
      },
      {
        label: "Surface profile",
        value: "Fast hard court",
        description:
          "Conditions favour assertive serving, precise returning and early control of rallies.",
      },
      {
        label: "Venue identity",
        value: "Magnolia roof",
        description:
          "The principal arena is recognised for its distinctive retractable roof design.",
      },
      {
        label: "Season role",
        value: "Final-quarter pressure",
        description:
          "The event is central to the race for qualification at the ATP Finals.",
      },
    ],

    iconicMoments: [
      {
        year: "2009",
        title: "The first Shanghai Masters",
        description:
          "The city begins its permanent chapter within the ATP Masters 1000 series.",
      },
      {
        year: "2012",
        title: "A dramatic championship",
        description:
          "Novak Djokovic saves multiple match points before defeating Andy Murray in the final.",
      },
      {
        year: "2017",
        title: "Federer defeats Nadal",
        description:
          "Roger Federer wins a major rivalry final during a celebrated season for both players.",
      },
    ],
  },

  {
    slug: "paris",
    code: "PAR",
    visualCode: "PA",

    name: "Paris Masters",
    shortName: "Paris",
    officialName: "Rolex Paris Masters",

    city: "Paris",
    country: "France",
    venue: "Paris La Défense Arena",

    surface: "Indoor hard",
    calendar: "November",
    founded: "1969",

    eyebrow: "The final Masters",
    headline: "The last great test before the ATP Finals.",
    introduction:
      "Paris closes the Masters 1000 season with indoor hard-court competition, intense qualification pressure and a decisive position at the end of the regular ATP calendar.",
    identity: "The final gate to the season finale",
    motto: "One last Masters. Everything still at stake.",

    latitude: 48.8918,
    longitude: 2.2344,
    tourOrder: 9,

    colors: {
      primary: "#FF7FC8",
      secondary: "#43152F",
      glow: "rgba(255, 73, 176, 0.4)",
    },

    facts: [
      {
        label: "Circuit position",
        value: "Final Masters of the season",
      },
      {
        label: "Environment",
        value: "Indoor Paris",
      },
      {
        label: "Surface",
        value: "Indoor hard court",
      },
      {
        label: "Season chapter",
        value: "Race to the ATP Finals",
      },
    ],

    history: [
      "The Paris indoor championship began during the early Open Era and developed into one of the principal late-season events in men’s tennis.",
      "For decades, the tournament became closely associated with the Palais Omnisports de Paris-Bercy and its intense indoor atmosphere.",
      "Its position as the final Masters event gives every edition major consequences for year-end qualification and ranking objectives.",
      "The tournament enters a new chapter at Paris La Défense Arena while preserving its role as the final elite event before the ATP Finals.",
    ],

    timeline: [
      {
        year: "1969",
        title: "The tournament begins",
        description:
          "Paris establishes an indoor championship during the formative years of the Open Era.",
      },
      {
        year: "1986",
        title: "The Bercy identity",
        description:
          "The tournament begins the venue era that defines its modern reputation.",
      },
      {
        year: "1990",
        title: "Masters series membership",
        description:
          "Paris becomes part of the ATP’s premier regular-season category.",
      },
      {
        year: "2000s",
        title: "The qualification battleground",
        description:
          "The event becomes increasingly decisive in the race to the season-ending finals.",
      },
      {
        year: "2026",
        title: "A new Paris arena",
        description:
          "The championship begins a new venue chapter at Paris La Défense Arena.",
      },
    ],

    records: [
      {
        label: "Category",
        value: "ATP Masters 1000",
        description:
          "Paris is the ninth and final Masters 1000 tournament of the season.",
      },
      {
        label: "Surface profile",
        value: "Indoor hard",
        description:
          "Controlled conditions reward clean serving, first-strike tennis and precise timing.",
      },
      {
        label: "Competitive role",
        value: "Final qualification race",
        description:
          "Remaining places at the ATP Finals can be decided during the Paris week.",
      },
      {
        label: "Season identity",
        value: "The last Masters",
        description:
          "Paris closes the Tour’s Masters 1000 journey before the year-end championship.",
      },
    ],

    iconicMoments: [
      {
        year: "1986",
        title: "The Bercy era begins",
        description:
          "The tournament establishes the indoor identity recognised by generations of tennis supporters.",
      },
      {
        year: "2018",
        title: "A breakthrough champion",
        description:
          "Karen Khachanov defeats Novak Djokovic to capture the biggest title of his career.",
      },
      {
        year: "2021",
        title: "A record-extending crown",
        description:
          "Novak Djokovic adds another Paris title during a landmark season.",
      },
    ],
  },
];

export const masters1000List: Masters1000Data[] =
  masters1000BaseList.map((tournament, index, tournaments) => {
    const previousTournament = tournaments[index - 1];
    const nextTournament = tournaments[index + 1];

    return {
      ...tournament,

      previousTournament: previousTournament
        ? {
            slug: previousTournament.slug,
            name: previousTournament.name,
          }
        : undefined,

      nextTournament: nextTournament
        ? {
            slug: nextTournament.slug,
            name: nextTournament.name,
          }
        : undefined,
    };
  });

export function getMasters1000BySlug(
  slug: string,
): Masters1000Data | undefined {
  return masters1000List.find(
    (tournament) => tournament.slug === slug,
  );
}

export function getMasters1000Href(
  slug: Masters1000Slug,
): string {
  return `/results/masters-1000/${slug}`;
}

export function isMasters1000Slug(
  slug: string,
): slug is Masters1000Slug {
  return MASTERS_1000_SLUGS.includes(slug as Masters1000Slug);
}