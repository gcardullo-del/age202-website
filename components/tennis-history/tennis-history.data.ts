export type TennisHistoryGender =
  | "MEN"
  | "WOMEN";


export type TennisHistoryLegend = {
  type: "legend";

  year: number;

  name: string;

  slug: string;

  gender: TennisHistoryGender;

  country: string;

  countryCode: string;

  era:
    | "OPEN_ERA"
    | "GOLDEN_ERA"
    | "MODERN_ERA";

  eyebrow: string;

  title: string;

  description: string;

  quote: string;

  achievement: string;

  period: string;

  imageUrl: string | null;

  href: string | null;
};


export type TennisHistoryRivalry = {
  type: "rivalry";

  year: number;

  slug: string;

  eyebrow: string;

  title: string;

  playerOne: string;

  playerTwo: string;

  description: string;

  period: string;

  imageUrl: string | null;
};


export type TennisHistoryGeneration = {
  type: "generation";

  year: number;

  slug: string;

  eyebrow: string;

  title: string;

  players: string[];

  description: string;

  period: string;

  imageUrl: string | null;
};


export type TennisHistoryFeature =
  | TennisHistoryLegend
  | TennisHistoryRivalry
  | TennisHistoryGeneration;


export const tennisHistoryFeatures:
  TennisHistoryFeature[] = [
    {
      type: "legend",

      year: 1969,

      name: "Rod Laver",

      slug: "rod-laver",

      gender: "MEN",

      country: "Australia",

      countryCode: "AUS",

      era: "OPEN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "The Complete Champion",

      description:
        "Rod Laver stands at the threshold between two ages of tennis. His 1969 season became one of the defining monuments of the Open Era and cemented his place among the sport’s eternal figures.",

      quote:
        "The standard against which complete greatness is measured.",

      achievement:
        "Calendar Grand Slam",

      period:
        "1960s — 1970s",

      imageUrl:
        null,

      href:
        null,
    },

    {
      type: "legend",

      year: 1973,

      name: "Billie Jean King",

      slug: "billie-jean-king",

      gender: "WOMEN",

      country: "United States",

      countryCode: "USA",

      era: "OPEN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "The Game Changer",

      description:
        "Billie Jean King transformed tennis far beyond the baseline. Champion, pioneer and cultural force, she helped redefine the position of women in professional sport.",

      quote:
        "A champion whose influence reached far beyond trophies.",

      achievement:
        "Champion · Pioneer",

      period:
        "1960s — 1980s",

      imageUrl:
        null,

      href:
        null,
    },

    {
      type: "legend",

      year: 1974,

      name: "Chris Evert",

      slug: "chris-evert",

      gender: "WOMEN",

      country: "United States",

      countryCode: "USA",

      era: "OPEN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "Ice on the Baseline",

      description:
        "Chris Evert brought extraordinary precision, calm and consistency to the baseline. Her rivalry with Martina Navratilova became one of the defining stories of modern tennis.",

      quote:
        "Control, discipline and relentless consistency.",

      achievement:
        "18 Grand Slam titles",

      period:
        "1970s — 1980s",

      imageUrl:
        null,

      href:
        null,
    },

    {
      type: "legend",

      year: 1976,

      name: "Björn Borg",

      slug: "bjorn-borg",

      gender: "MEN",

      country: "Sweden",

      countryCode: "SWE",

      era: "OPEN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "Ice. Precision. Revolution.",

      description:
        "Björn Borg became the silent icon of a new tennis generation. His combination of physical endurance, heavy topspin and emotional control changed both the game and the image of the champion.",

      quote:
        "The coolest champion of tennis’s first global age.",

      achievement:
        "11 Grand Slam titles",

      period:
        "1970s — 1980s",

      imageUrl:
        null,

      href:
        null,
    },

    {
      type: "legend",

      year: 1978,

      name: "Martina Navratilova",

      slug: "martina-navratilova",

      gender: "WOMEN",

      country: "United States",

      countryCode: "USA",

      era: "OPEN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "The Complete Athlete",

      description:
        "Martina Navratilova pushed athletic preparation, serve-and-volley tennis and competitive longevity to extraordinary levels, becoming one of the defining champions of the sport.",

      quote:
        "Power, movement and ambition without limits.",

      achievement:
        "18 Grand Slam singles titles",

      period:
        "1970s — 1990s",

      imageUrl:
        null,

      href:
        null,
    },

    {
      type: "rivalry",

      year: 1980,

      slug:
        "borg-mcenroe",

      eyebrow:
        "Iconic Rivalry",

      title:
        "Fire Meets Ice",

      playerOne:
        "Björn Borg",

      playerTwo:
        "John McEnroe",

      description:
        "Two opposite personalities, two contrasting styles and a series of matches that transformed rivalry into theatre. Borg and McEnroe became symbols of an unforgettable tennis age.",

      period:
        "1980 — 1981",

      imageUrl:
        null,
    },

    {
      type: "legend",

      year: 1980,

      name: "John McEnroe",

      slug: "john-mcenroe",

      gender: "MEN",

      country: "United States",

      countryCode: "USA",

      era: "OPEN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "The Artist and the Rebel",

      description:
        "John McEnroe combined extraordinary touch, attacking instincts and unmistakable personality. Tennis became more expressive, unpredictable and theatrical whenever he entered the court.",

      quote:
        "Touch, instinct and rebellion.",

      achievement:
        "7 Grand Slam titles",

      period:
        "1970s — 1990s",

      imageUrl:
        null,

      href:
        null,
    },

    {
      type: "rivalry",

      year: 1985,

      slug:
        "evert-navratilova",

      eyebrow:
        "Iconic Rivalry",

      title:
        "Two Ways to Rule",

      playerOne:
        "Chris Evert",

      playerTwo:
        "Martina Navratilova",

      description:
        "Baseline precision against attacking athleticism. Evert and Navratilova built one of the richest rivalries tennis has ever seen and elevated each other across an entire generation.",

      period:
        "1970s — 1980s",

      imageUrl:
        null,
    },

    {
      type: "legend",

      year: 1988,

      name: "Steffi Graf",

      slug: "steffi-graf",

      gender: "WOMEN",

      country: "Germany",

      countryCode: "GER",

      era: "GOLDEN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "The Golden Standard",

      description:
        "Steffi Graf’s speed, forehand and all-surface excellence produced one of tennis history’s defining seasons and established a benchmark for complete dominance.",

      quote:
        "Speed, precision and total command.",

      achievement:
        "Golden Slam",

      period:
        "1980s — 1990s",

      imageUrl:
        null,

      href:
        null,
    },

    {
      type: "legend",

      year: 1990,

      name: "Pete Sampras",

      slug: "pete-sampras",

      gender: "MEN",

      country: "United States",

      countryCode: "USA",

      era: "GOLDEN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "The King of the 1990s",

      description:
        "Pete Sampras made serving, first-strike tennis and composure under pressure the defining language of an era. Wimbledon became the stage most closely associated with his greatness.",

      quote:
        "Efficiency turned into supremacy.",

      achievement:
        "14 Grand Slam titles",

      period:
        "1990s — 2000s",

      imageUrl:
        null,

      href:
        null,
    },

    {
      type: "legend",

      year: 1992,

      name: "Andre Agassi",

      slug: "andre-agassi",

      gender: "MEN",

      country: "United States",

      countryCode: "USA",

      era: "GOLDEN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "Image Is Everything",

      description:
        "Andre Agassi brought colour, charisma and devastating return tennis to the sport. His career eventually became a story not only of talent, but also reinvention and longevity.",

      quote:
        "From rebel icon to complete champion.",

      achievement:
        "Career Grand Slam",

      period:
        "1980s — 2000s",

      imageUrl:
        null,

      href:
        null,
    },

    {
      type: "rivalry",

      year: 1995,

      slug:
        "sampras-agassi",

      eyebrow:
        "Iconic Rivalry",

      title:
        "Two Visions of America",

      playerOne:
        "Pete Sampras",

      playerTwo:
        "Andre Agassi",

      description:
        "Sampras and Agassi represented opposite approaches to tennis and celebrity, creating the defining American rivalry of the 1990s.",

      period:
        "1990s — 2000s",

      imageUrl:
        null,
    },

    {
      type: "legend",

      year: 1999,

      name: "Serena Williams",

      slug: "serena-williams",

      gender: "WOMEN",

      country: "United States",

      countryCode: "USA",

      era: "MODERN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "Power Redefined",

      description:
        "Serena Williams reshaped the physical and competitive standards of women’s tennis and became one of the most influential athletes in the history of global sport.",

      quote:
        "Power became possibility.",

      achievement:
        "23 Grand Slam singles titles",

      period:
        "1990s — 2020s",

      imageUrl:
        null,

      href:
        null,
    },

    {
      type: "legend",

      year: 2003,

      name: "Roger Federer",

      slug: "roger-federer",

      gender: "MEN",

      country: "Switzerland",

      countryCode: "SUI",

      era: "MODERN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "The Art of Tennis",

      description:
        "Roger Federer combined attacking instinct, movement and extraordinary technical fluency to become the defining aesthetic figure of a new global tennis era.",

      quote:
        "Tennis transformed into movement, geometry and elegance.",

      achievement:
        "20 Grand Slam titles",

      period:
        "2000s — 2020s",

      imageUrl:
        null,

      href:
        "/archives/federer",
    },

    {
      type: "legend",

      year: 2005,

      name: "Rafael Nadal",

      slug: "rafael-nadal",

      gender: "MEN",

      country: "Spain",

      countryCode: "ESP",

      era: "MODERN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "The King of Clay",

      description:
        "Rafael Nadal turned intensity, topspin and competitive resilience into an historic relationship with Roland Garros while becoming a champion on every surface.",

      quote:
        "Every point played as if history depended on it.",

      achievement:
        "22 Grand Slam titles",

      period:
        "2000s — 2020s",

      imageUrl:
        null,

      href:
        "/archives/nadal",
    },

    {
      type: "rivalry",

      year: 2008,

      slug:
        "federer-nadal",

      eyebrow:
        "Iconic Rivalry",

      title:
        "The Rivalry That Defined an Era",

      playerOne:
        "Roger Federer",

      playerTwo:
        "Rafael Nadal",

      description:
        "Contrasting styles, surfaces and personalities created a rivalry that expanded tennis’s global audience and produced some of the sport’s most celebrated matches.",

      period:
        "2000s — 2010s",

      imageUrl:
        null,
    },

    {
      type: "legend",

      year: 2011,

      name: "Novak Djokovic",

      slug: "novak-djokovic",

      gender: "MEN",

      country: "Serbia",

      countryCode: "SRB",

      era: "MODERN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "The Competitive Standard",

      description:
        "Novak Djokovic elevated returning, movement and defensive transition to extraordinary levels and became a central figure in the most competitive era of men’s tennis.",

      quote:
        "Precision under pressure became a weapon.",

      achievement:
        "Record-setting major era",

      period:
        "2000s — Present",

      imageUrl:
        null,

      href:
        "/archives/djokovic",
    },

    {
      type: "generation",

      year: 2011,

      slug:
        "big-three-era",

      eyebrow:
        "Generation of History",

      title:
        "The Big Three Era",

      players: [
        "Roger Federer",
        "Rafael Nadal",
        "Novak Djokovic",
      ],

      description:
        "Three champions with different identities pushed one another across surfaces, continents and generations, creating an unprecedented period of sustained excellence.",

      period:
        "2000s — 2020s",

      imageUrl:
        null,
    },

    {
      type: "legend",

      year: 2012,

      name: "Andy Murray",

      slug: "andy-murray",

      gender: "MEN",

      country: "Great Britain",

      countryCode: "GBR",

      era: "MODERN_ERA",

      eyebrow:
        "Legend of History",

      title:
        "The Fourth Force",

      description:
        "Andy Murray competed inside one of the strongest eras in tennis history and built a career defined by tactical intelligence, defence, resilience and historic victories.",

      quote:
        "Greatness forged inside the hardest possible era.",

      achievement:
        "Grand Slam & Olympic champion",

      period:
        "2000s — 2020s",

      imageUrl:
        null,

      href:
        null,
    },

    {
      type: "legend",

      year: 2022,

      name: "Carlos Alcaraz",

      slug: "carlos-alcaraz",

      gender: "MEN",

      country: "Spain",

      countryCode: "ESP",

      era: "MODERN_ERA",

      eyebrow:
        "New Generation",

      title:
        "The New Electricity",

      description:
        "Carlos Alcaraz announced a new tennis generation through explosive movement, creativity and fearless attacking instincts.",

      quote:
        "The future arrived at full speed.",

      achievement:
        "Youngest ATP No. 1",

      period:
        "2020s",

      imageUrl:
        null,

      href:
        "/archives/alcaraz",
    },

    {
      type: "legend",

      year: 2024,

      name: "Jannik Sinner",

      slug: "jannik-sinner",

      gender: "MEN",

      country: "Italy",

      countryCode: "ITA",

      era: "MODERN_ERA",

      eyebrow:
        "New Generation",

      title:
        "The New Precision",

      description:
        "Jannik Sinner’s clean ball striking, controlled aggression and rapid rise to the top of the rankings marked another major generational shift in men’s tennis.",

      quote:
        "Modern tennis reduced to speed, timing and precision.",

      achievement:
        "World No. 1",

      period:
        "2020s",

      imageUrl:
        null,

      href:
        "/archives/sinner",
    },

    {
      type: "generation",

      year: 2024,

      slug:
        "sinner-alcaraz-generation",

      eyebrow:
        "Generation Shift",

      title:
        "The Next Chapter",

      players: [
        "Jannik Sinner",
        "Carlos Alcaraz",
      ],

      description:
        "As the era of the Big Three moves into history, Sinner and Alcaraz emerge as central figures in the next great chapter of men’s tennis.",

      period:
        "2020s —",

      imageUrl:
        null,
    },
  ];


export const tennisHistoryLegends =
  tennisHistoryFeatures.filter(
    (
      feature,
    ): feature is TennisHistoryLegend =>
      feature.type ===
      "legend",
  );


export const tennisHistoryRivalries =
  tennisHistoryFeatures.filter(
    (
      feature,
    ): feature is TennisHistoryRivalry =>
      feature.type ===
      "rivalry",
  );


export const tennisHistoryGenerations =
  tennisHistoryFeatures.filter(
    (
      feature,
    ): feature is TennisHistoryGeneration =>
      feature.type ===
      "generation",
  );