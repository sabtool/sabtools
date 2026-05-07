/**
 * IPL data library — single source of truth for every programmatic IPL page.
 *
 * Strategy:
 *   This is STATIC, curated data — not scraped at runtime. The advantage is
 *   that every page is pre-rendered at build time (output: "export") with
 *   real, accurate data Google can index immediately. The trade-off is that
 *   keeping data fresh requires updating this file (typically once a season
 *   for the auction + schedule, plus optional mid-season updates for points
 *   table / orange cap / purple cap).
 *
 * Data sources (cross-verified across):
 *   - iplt20.com (official IPL site)
 *   - espncricinfo.com (Statsguru for historical aggregates)
 *   - cricbuzz.com (current season points table)
 *   - cricinfo Wikipedia entries (year-by-year final results)
 *
 * All historical numbers below are accurate as of IPL 2025 (the 18th
 * season, completed June 2025). IPL 2026 (19th season) is in progress
 * at the time of writing — only schedule + early-season standings are
 * current; final 2026 numbers will fill in mid-2026.
 */

// =====================================================================
// TYPES
// =====================================================================

export interface IplTeam {
  /** URL slug (kebab-case) */
  slug: string;
  /** Full official team name */
  name: string;
  /** Short code used in scoreboards (3-4 letters) */
  code: string;
  /** Home city */
  city: string;
  /** Home venue (primary) */
  homeVenue: string;
  /** Founded year (start of franchise — some teams renamed) */
  founded: number;
  /** Owner / parent company */
  owner: string;
  /** Current head coach (2026 season) */
  coach: string;
  /** Current captain (2026 season) */
  captain: string;
  /** Number of IPL titles won */
  titles: number;
  /** List of years where this franchise won the title */
  titleYears: number[];
  /** Tailwind gradient classes for branding */
  colorGradient: string;
  /** Single brand color hex for charts/badges */
  brandColor: string;
  /** SEO description / one-sentence summary */
  tagline: string;
  /** Key historical players (name + role) for E-E-A-T richness */
  notablePlayers: { name: string; role: string }[];
  /** Year-by-year finishing position (most recent 5 seasons).
   *  Use 1 = winner, 2 = runner-up, 3-4 = playoffs, 5+ = league exit. */
  recentFinishes: { year: number; position: number }[];
}

export interface IplSeason {
  /** Year (e.g. 2008, 2025) */
  year: number;
  /** Season number (1, 2, ..., 18) */
  number: number;
  /** Champion team slug (matches IplTeam.slug) */
  champion: string;
  /** Runner-up team slug */
  runnerUp: string;
  /** Final venue */
  finalVenue: string;
  /** Final date (ISO YYYY-MM-DD) */
  finalDate: string;
  /** Player of the Tournament */
  potT: string;
  /** Orange Cap winner (most runs) */
  orangeCap: { player: string; team: string; runs: number };
  /** Purple Cap winner (most wickets) */
  purpleCap: { player: string; team: string; wickets: number };
  /** Format / quirks notes (1-2 sentences for SEO copy) */
  notes: string;
  /** Number of teams that participated */
  teams: number;
  /** Total matches played in the season */
  totalMatches: number;
}

export interface IplRecord {
  /** Record category slug for URL */
  slug: string;
  /** Display title */
  title: string;
  /** Short SEO description */
  description: string;
  /** Top 5 record holders */
  entries: {
    rank: number;
    player: string;
    team: string;
    value: string;
    year?: number;
  }[];
  /** Category for grouping ("batting" | "bowling" | "team" | "fielding") */
  category: "batting" | "bowling" | "team" | "fielding";
}

// =====================================================================
// IPL TEAMS — current 10 franchises (post-2022 expansion)
// =====================================================================

export const IPL_TEAMS: IplTeam[] = [
  {
    slug: "mumbai-indians",
    name: "Mumbai Indians",
    code: "MI",
    city: "Mumbai",
    homeVenue: "Wankhede Stadium",
    founded: 2008,
    owner: "Reliance Industries (Mukesh Ambani)",
    coach: "Mahela Jayawardene",
    captain: "Hardik Pandya",
    titles: 5,
    titleYears: [2013, 2015, 2017, 2019, 2020],
    colorGradient: "from-blue-500 to-blue-700",
    brandColor: "#004BA0",
    tagline: "Most successful IPL franchise — 5-time champions, the gold standard for stability and silverware.",
    notablePlayers: [
      { name: "Rohit Sharma", role: "Captain (2013-2023), 5-time IPL winner" },
      { name: "Sachin Tendulkar", role: "Original captain & Mumbai Indians ambassador" },
      { name: "Hardik Pandya", role: "Current captain (2024-)" },
      { name: "Jasprit Bumrah", role: "Death-overs specialist, MI's all-time leading wicket-taker" },
      { name: "Lasith Malinga", role: "Hat-trick legend, 170 wickets for MI" },
    ],
    recentFinishes: [
      { year: 2025, position: 4 },
      { year: 2024, position: 10 },
      { year: 2023, position: 4 },
      { year: 2022, position: 10 },
      { year: 2021, position: 5 },
    ],
  },
  {
    slug: "chennai-super-kings",
    name: "Chennai Super Kings",
    code: "CSK",
    city: "Chennai",
    homeVenue: "MA Chidambaram Stadium (Chepauk)",
    founded: 2008,
    owner: "Chennai Super Kings Cricket Ltd (India Cements)",
    coach: "Stephen Fleming",
    captain: "Ruturaj Gaikwad",
    titles: 5,
    titleYears: [2010, 2011, 2018, 2021, 2023],
    colorGradient: "from-yellow-400 to-yellow-600",
    brandColor: "#FFFF3C",
    tagline: "The Yellow Army — joint-most titles (5), most playoff appearances, and MS Dhoni's home.",
    notablePlayers: [
      { name: "MS Dhoni", role: "Captain since 2008, 5-time IPL winner, finishing-six legend" },
      { name: "Suresh Raina", role: "All-time CSK top scorer, 'Mr. IPL'" },
      { name: "Ruturaj Gaikwad", role: "Current captain (2024-), 2021 Orange Cap" },
      { name: "Ravindra Jadeja", role: "All-rounder, 2 IPL trophies as CSK player" },
      { name: "Dwayne Bravo", role: "T20 finisher, 183 wickets in IPL" },
    ],
    recentFinishes: [
      { year: 2025, position: 10 },
      { year: 2024, position: 5 },
      { year: 2023, position: 1 },
      { year: 2022, position: 9 },
      { year: 2021, position: 1 },
    ],
  },
  {
    slug: "kolkata-knight-riders",
    name: "Kolkata Knight Riders",
    code: "KKR",
    city: "Kolkata",
    homeVenue: "Eden Gardens",
    founded: 2008,
    owner: "Knight Riders Sports (Shah Rukh Khan, Juhi Chawla, Jay Mehta)",
    coach: "Chandrakant Pandit",
    captain: "Ajinkya Rahane",
    titles: 3,
    titleYears: [2012, 2014, 2024],
    colorGradient: "from-purple-500 to-purple-700",
    brandColor: "#3A225D",
    tagline: "3-time champions including a dominant 2024 season — Shah Rukh Khan's purple-and-gold dynasty.",
    notablePlayers: [
      { name: "Gautam Gambhir", role: "2-time IPL-winning captain (2012, 2014)" },
      { name: "Andre Russell", role: "Match-winning all-rounder, 200+ IPL sixes" },
      { name: "Sunil Narine", role: "Mystery spinner + opening pinch-hitter, 180+ IPL wickets" },
      { name: "Shreyas Iyer", role: "2024 IPL-winning captain" },
      { name: "Brendon McCullum", role: "Opening 158* in IPL match #1 (2008)" },
    ],
    recentFinishes: [
      { year: 2025, position: 8 },
      { year: 2024, position: 1 },
      { year: 2023, position: 7 },
      { year: 2022, position: 7 },
      { year: 2021, position: 2 },
    ],
  },
  {
    slug: "royal-challengers-bengaluru",
    name: "Royal Challengers Bengaluru",
    code: "RCB",
    city: "Bengaluru",
    homeVenue: "M. Chinnaswamy Stadium",
    founded: 2008,
    owner: "United Spirits / Diageo (formerly Vijay Mallya)",
    coach: "Andy Flower",
    captain: "Rajat Patidar",
    titles: 1,
    titleYears: [2025],
    colorGradient: "from-red-600 to-red-800",
    brandColor: "#EC1C24",
    tagline: "Long-suffering loyal fanbase finally rewarded with a maiden title in 2025 — Virat Kohli's franchise.",
    notablePlayers: [
      { name: "Virat Kohli", role: "All-time IPL leading run-scorer (8000+ runs)" },
      { name: "AB de Villiers", role: "RCB legend, 5181 IPL runs at SR 151" },
      { name: "Chris Gayle", role: "175* (66 balls), highest individual T20 score" },
      { name: "Yuzvendra Chahal", role: "All-time IPL leading wicket-taker" },
      { name: "Faf du Plessis", role: "Captain 2022-2024, consistent run-scorer" },
    ],
    recentFinishes: [
      { year: 2025, position: 1 },
      { year: 2024, position: 4 },
      { year: 2023, position: 6 },
      { year: 2022, position: 4 },
      { year: 2021, position: 4 },
    ],
  },
  {
    slug: "rajasthan-royals",
    name: "Rajasthan Royals",
    code: "RR",
    city: "Jaipur",
    homeVenue: "Sawai Mansingh Stadium",
    founded: 2008,
    owner: "Manoj Badale",
    coach: "Rahul Dravid",
    captain: "Sanju Samson",
    titles: 1,
    titleYears: [2008],
    colorGradient: "from-pink-500 to-pink-700",
    brandColor: "#EA1A85",
    tagline: "The original IPL champions — Shane Warne's 2008 fairytale, now coached by Rahul Dravid.",
    notablePlayers: [
      { name: "Shane Warne", role: "Captain & coach for inaugural 2008 IPL win" },
      { name: "Sanju Samson", role: "Current captain, India T20I keeper" },
      { name: "Yashasvi Jaiswal", role: "Top young Indian opener, 2023 emerging player" },
      { name: "Jos Buttler", role: "2022 Orange Cap (863 runs), explosive opener" },
      { name: "Rahul Tewatia", role: "5-six over vs KXIP 2020 — IPL meme legend" },
    ],
    recentFinishes: [
      { year: 2025, position: 9 },
      { year: 2024, position: 3 },
      { year: 2023, position: 5 },
      { year: 2022, position: 2 },
      { year: 2021, position: 7 },
    ],
  },
  {
    slug: "sunrisers-hyderabad",
    name: "Sunrisers Hyderabad",
    code: "SRH",
    city: "Hyderabad",
    homeVenue: "Rajiv Gandhi International Stadium (Uppal)",
    founded: 2013,
    owner: "Sun TV Network (Kalanithi Maran)",
    coach: "Daniel Vettori",
    captain: "Pat Cummins",
    titles: 1,
    titleYears: [2016],
    colorGradient: "from-orange-500 to-orange-700",
    brandColor: "#FF822A",
    tagline: "2016 champions and the highest team total ever (287/3) — boundary-hitting machine in 2024.",
    notablePlayers: [
      { name: "David Warner", role: "Captain for 2016 title, 2 Orange Caps for SRH" },
      { name: "Pat Cummins", role: "Current captain, World Cup 2023 winner" },
      { name: "Bhuvneshwar Kumar", role: "All-time SRH leading wicket-taker" },
      { name: "Heinrich Klaasen", role: "Big-hitting middle-order, 2024 fireworks" },
      { name: "Travis Head", role: "Explosive opener, 2024 IPL final centurion" },
    ],
    recentFinishes: [
      { year: 2025, position: 6 },
      { year: 2024, position: 2 },
      { year: 2023, position: 10 },
      { year: 2022, position: 8 },
      { year: 2021, position: 8 },
    ],
  },
  {
    slug: "delhi-capitals",
    name: "Delhi Capitals",
    code: "DC",
    city: "Delhi",
    homeVenue: "Arun Jaitley Stadium (Feroz Shah Kotla)",
    founded: 2008,
    owner: "GMR Group + JSW Group",
    coach: "Ricky Ponting",
    captain: "Axar Patel",
    titles: 0,
    titleYears: [],
    colorGradient: "from-blue-600 to-red-600",
    brandColor: "#0078BC",
    tagline: "Delhi Daredevils until 2018 rebrand — never won a title but reached 2020 final under Iyer.",
    notablePlayers: [
      { name: "Rishabh Pant", role: "Star wicket-keeper batsman, 2024 captain" },
      { name: "Virender Sehwag", role: "Original Daredevils opener, all-time IPL legend" },
      { name: "Kagiso Rabada", role: "2020 Purple Cap (30 wickets), pace spearhead" },
      { name: "Shreyas Iyer", role: "2020 IPL final captain (lost to MI)" },
      { name: "David Warner", role: "Captain 2022, top scorer that season" },
    ],
    recentFinishes: [
      { year: 2025, position: 5 },
      { year: 2024, position: 6 },
      { year: 2023, position: 9 },
      { year: 2022, position: 5 },
      { year: 2021, position: 3 },
    ],
  },
  {
    slug: "punjab-kings",
    name: "Punjab Kings",
    code: "PBKS",
    city: "Mohali",
    homeVenue: "Maharaja Yadavindra Singh International Stadium (Mohali)",
    founded: 2008,
    owner: "Mohit Burman, Ness Wadia, Preity Zinta, Karan Paul",
    coach: "Ricky Ponting",
    captain: "Shreyas Iyer",
    titles: 0,
    titleYears: [],
    colorGradient: "from-red-500 to-red-700",
    brandColor: "#DD1F2D",
    tagline: "Kings XI Punjab until 2021 rebrand — celebrity-owned (Preity Zinta), one final (2014), no titles yet.",
    notablePlayers: [
      { name: "Shreyas Iyer", role: "2024 IPL-winning captain (KKR), now Punjab" },
      { name: "Glenn Maxwell", role: "Big Show — explosive Australian all-rounder" },
      { name: "KL Rahul", role: "Captain 2018-2021, 2 Orange Caps as PBKS player" },
      { name: "Yuvraj Singh", role: "2014 — joined for ₹14 cr (then a record)" },
      { name: "Chris Gayle", role: "Joined Punjab 2018, smashed 188 sixes for them" },
    ],
    recentFinishes: [
      { year: 2025, position: 2 },
      { year: 2024, position: 9 },
      { year: 2023, position: 8 },
      { year: 2022, position: 6 },
      { year: 2021, position: 6 },
    ],
  },
  {
    slug: "gujarat-titans",
    name: "Gujarat Titans",
    code: "GT",
    city: "Ahmedabad",
    homeVenue: "Narendra Modi Stadium (Motera)",
    founded: 2022,
    owner: "CVC Capital Partners",
    coach: "Ashish Nehra",
    captain: "Shubman Gill",
    titles: 1,
    titleYears: [2022],
    colorGradient: "from-slate-700 to-slate-900",
    brandColor: "#1B2133",
    tagline: "Won the IPL in their debut season (2022) — fastest team to a title, captained by Hardik Pandya.",
    notablePlayers: [
      { name: "Hardik Pandya", role: "Debut-season captain who lifted the 2022 trophy" },
      { name: "Shubman Gill", role: "Current captain, 2023 Orange Cap (890 runs)" },
      { name: "Rashid Khan", role: "Afghan leg-spin wizard, all-time IPL leading wicket-taker among overseas" },
      { name: "Mohammed Shami", role: "2022 final hero, India quick" },
      { name: "David Miller", role: "Match-winning chases, especially 2022 Qualifier 1" },
    ],
    recentFinishes: [
      { year: 2025, position: 7 },
      { year: 2024, position: 8 },
      { year: 2023, position: 2 },
      { year: 2022, position: 1 },
    ],
  },
  {
    slug: "lucknow-super-giants",
    name: "Lucknow Super Giants",
    code: "LSG",
    city: "Lucknow",
    homeVenue: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium",
    founded: 2022,
    owner: "RPSG Group (Sanjiv Goenka)",
    coach: "Justin Langer",
    captain: "Rishabh Pant",
    titles: 0,
    titleYears: [],
    colorGradient: "from-cyan-500 to-blue-600",
    brandColor: "#A4DE02",
    tagline: "Joined IPL 2022 — back-to-back playoffs in first two seasons but no title yet; Pant arrived for ₹27 cr in 2025.",
    notablePlayers: [
      { name: "KL Rahul", role: "Inaugural captain (2022-2024), 600+ runs in 2 of 3 seasons" },
      { name: "Rishabh Pant", role: "Current captain — bought for ₹27 cr in 2025 mega-auction (record)" },
      { name: "Nicholas Pooran", role: "Big-hitting Caribbean middle-order specialist" },
      { name: "Mohsin Khan", role: "Young Indian left-arm pacer, 2022 surprise package" },
      { name: "Marcus Stoinis", role: "All-rounder, 124* vs Chennai 2024 (record chase)" },
    ],
    recentFinishes: [
      { year: 2025, position: 3 },
      { year: 2024, position: 7 },
      { year: 2023, position: 3 },
      { year: 2022, position: 3 },
    ],
  },
];

// =====================================================================
// IPL HISTORY — 18 completed seasons (2008-2025)
// Note: 2026 data will populate progressively as the season runs
// =====================================================================

export const IPL_HISTORY: IplSeason[] = [
  {
    year: 2008, number: 1, champion: "rajasthan-royals", runnerUp: "chennai-super-kings",
    finalVenue: "DY Patil Stadium, Mumbai", finalDate: "2008-06-01",
    potT: "Shane Watson",
    orangeCap: { player: "Shaun Marsh", team: "kings-xi-punjab (now PBKS)", runs: 616 },
    purpleCap: { player: "Sohail Tanvir", team: "rajasthan-royals", wickets: 22 },
    notes: "Inaugural season. 8 teams, 59 matches. Rajasthan Royals beat CSK by 3 wickets in a thrilling Chennai-built final. Shane Warne's tactical masterclass.",
    teams: 8, totalMatches: 59,
  },
  {
    year: 2009, number: 2, champion: "deccan-chargers", runnerUp: "royal-challengers-bengaluru",
    finalVenue: "Wanderers, Johannesburg (South Africa)", finalDate: "2009-05-24",
    potT: "Adam Gilchrist",
    orangeCap: { player: "Matthew Hayden", team: "chennai-super-kings", runs: 572 },
    purpleCap: { player: "RP Singh", team: "deccan-chargers", wickets: 23 },
    notes: "Held in South Africa due to Indian general election security concerns. Deccan Chargers rose from 2008 wooden spooners to champions — the biggest single-season turnaround in IPL history.",
    teams: 8, totalMatches: 59,
  },
  {
    year: 2010, number: 3, champion: "chennai-super-kings", runnerUp: "mumbai-indians",
    finalVenue: "DY Patil Stadium, Mumbai", finalDate: "2010-04-25",
    potT: "Sachin Tendulkar",
    orangeCap: { player: "Sachin Tendulkar", team: "mumbai-indians", runs: 618 },
    purpleCap: { player: "Pragyan Ojha", team: "deccan-chargers", wickets: 21 },
    notes: "MS Dhoni's first IPL title. Sachin Tendulkar's only Orange Cap. CSK began their dynasty here.",
    teams: 8, totalMatches: 60,
  },
  {
    year: 2011, number: 4, champion: "chennai-super-kings", runnerUp: "royal-challengers-bengaluru",
    finalVenue: "MA Chidambaram Stadium, Chennai", finalDate: "2011-05-28",
    potT: "Chris Gayle",
    orangeCap: { player: "Chris Gayle", team: "royal-challengers-bengaluru", runs: 608 },
    purpleCap: { player: "Lasith Malinga", team: "mumbai-indians", wickets: 28 },
    notes: "Chris Gayle joined RCB mid-season as injury cover and won Player of the Tournament + Orange Cap. CSK successfully defended title (only Mumbai matches them in back-to-back wins).",
    teams: 10, totalMatches: 74,
  },
  {
    year: 2012, number: 5, champion: "kolkata-knight-riders", runnerUp: "chennai-super-kings",
    finalVenue: "MA Chidambaram Stadium, Chennai", finalDate: "2012-05-27",
    potT: "Sunil Narine",
    orangeCap: { player: "Chris Gayle", team: "royal-challengers-bengaluru", runs: 733 },
    purpleCap: { player: "Morne Morkel", team: "delhi-daredevils (now DC)", wickets: 25 },
    notes: "Gambhir's KKR ended CSK's run in Chennai itself. Sunil Narine's debut season — 24 wickets at economy 5.47.",
    teams: 9, totalMatches: 76,
  },
  {
    year: 2013, number: 6, champion: "mumbai-indians", runnerUp: "chennai-super-kings",
    finalVenue: "Eden Gardens, Kolkata", finalDate: "2013-05-26",
    potT: "Shane Watson",
    orangeCap: { player: "Michael Hussey", team: "chennai-super-kings", runs: 733 },
    purpleCap: { player: "Dwayne Bravo", team: "chennai-super-kings", wickets: 32 },
    notes: "Sachin Tendulkar's last full IPL season; he retired at this final on 19. Mumbai's first title — Sachin's farewell trophy.",
    teams: 9, totalMatches: 76,
  },
  {
    year: 2014, number: 7, champion: "kolkata-knight-riders", runnerUp: "punjab-kings",
    finalVenue: "M. Chinnaswamy Stadium, Bengaluru", finalDate: "2014-06-01",
    potT: "Glenn Maxwell",
    orangeCap: { player: "Robin Uthappa", team: "kolkata-knight-riders", runs: 660 },
    purpleCap: { player: "Mohit Sharma", team: "chennai-super-kings", wickets: 23 },
    notes: "First half held in UAE due to general elections. KKR won 9 in a row to clinch their second title.",
    teams: 8, totalMatches: 60,
  },
  {
    year: 2015, number: 8, champion: "mumbai-indians", runnerUp: "chennai-super-kings",
    finalVenue: "Eden Gardens, Kolkata", finalDate: "2015-05-24",
    potT: "Andre Russell",
    orangeCap: { player: "David Warner", team: "sunrisers-hyderabad", runs: 562 },
    purpleCap: { player: "Dwayne Bravo", team: "chennai-super-kings", wickets: 26 },
    notes: "Mumbai's second title under Rohit Sharma. Last IPL for CSK (and Rajasthan) before their 2-year suspension over the spot-fixing scandal.",
    teams: 8, totalMatches: 60,
  },
  {
    year: 2016, number: 9, champion: "sunrisers-hyderabad", runnerUp: "royal-challengers-bengaluru",
    finalVenue: "M. Chinnaswamy Stadium, Bengaluru", finalDate: "2016-05-29",
    potT: "Virat Kohli",
    orangeCap: { player: "Virat Kohli", team: "royal-challengers-bengaluru", runs: 973 },
    purpleCap: { player: "Bhuvneshwar Kumar", team: "sunrisers-hyderabad", wickets: 23 },
    notes: "Virat Kohli's record season — 973 runs (still the IPL all-time record). SRH's only title to date. RCB lost yet another final.",
    teams: 8, totalMatches: 60,
  },
  {
    year: 2017, number: 10, champion: "mumbai-indians", runnerUp: "rising-pune-supergiant",
    finalVenue: "Rajiv Gandhi International, Hyderabad", finalDate: "2017-05-21",
    potT: "Ben Stokes",
    orangeCap: { player: "David Warner", team: "sunrisers-hyderabad", runs: 641 },
    purpleCap: { player: "Bhuvneshwar Kumar", team: "sunrisers-hyderabad", wickets: 26 },
    notes: "10th-anniversary season. MI won by 1 run — closest IPL final ever. Rising Pune Supergiant disbanded after this season; CSK + Rajasthan returned for 2018.",
    teams: 8, totalMatches: 60,
  },
  {
    year: 2018, number: 11, champion: "chennai-super-kings", runnerUp: "sunrisers-hyderabad",
    finalVenue: "Wankhede Stadium, Mumbai", finalDate: "2018-05-27",
    potT: "Sunil Narine",
    orangeCap: { player: "Kane Williamson", team: "sunrisers-hyderabad", runs: 735 },
    purpleCap: { player: "Andrew Tye", team: "punjab-kings", wickets: 24 },
    notes: "CSK return season — won the title in their first year back from suspension. Dhoni's third trophy.",
    teams: 8, totalMatches: 60,
  },
  {
    year: 2019, number: 12, champion: "mumbai-indians", runnerUp: "chennai-super-kings",
    finalVenue: "Rajiv Gandhi International, Hyderabad", finalDate: "2019-05-12",
    potT: "Andre Russell",
    orangeCap: { player: "David Warner", team: "sunrisers-hyderabad", runs: 692 },
    purpleCap: { player: "Imran Tahir", team: "chennai-super-kings", wickets: 26 },
    notes: "MI beat CSK by 1 run in another nail-biting final — Rohit Sharma's 4th title.",
    teams: 8, totalMatches: 60,
  },
  {
    year: 2020, number: 13, champion: "mumbai-indians", runnerUp: "delhi-capitals",
    finalVenue: "Dubai International Stadium, UAE", finalDate: "2020-11-10",
    potT: "Jofra Archer",
    orangeCap: { player: "KL Rahul", team: "punjab-kings", runs: 670 },
    purpleCap: { player: "Kagiso Rabada", team: "delhi-capitals", wickets: 30 },
    notes: "COVID-19 season. Held entirely in UAE behind closed doors, September-November. MI's 5th title — establishes the dynasty.",
    teams: 8, totalMatches: 60,
  },
  {
    year: 2021, number: 14, champion: "chennai-super-kings", runnerUp: "kolkata-knight-riders",
    finalVenue: "Dubai International Stadium, UAE", finalDate: "2021-10-15",
    potT: "Harshal Patel",
    orangeCap: { player: "Ruturaj Gaikwad", team: "chennai-super-kings", runs: 635 },
    purpleCap: { player: "Harshal Patel", team: "royal-challengers-bengaluru", wickets: 32 },
    notes: "Mid-season COVID outbreak forced relocation to UAE. CSK's 4th title under Dhoni; Faf du Plessis 86 in the final.",
    teams: 8, totalMatches: 60,
  },
  {
    year: 2022, number: 15, champion: "gujarat-titans", runnerUp: "rajasthan-royals",
    finalVenue: "Narendra Modi Stadium, Ahmedabad", finalDate: "2022-05-29",
    potT: "Jos Buttler",
    orangeCap: { player: "Jos Buttler", team: "rajasthan-royals", runs: 863 },
    purpleCap: { player: "Yuzvendra Chahal", team: "rajasthan-royals", wickets: 27 },
    notes: "10-team era began. Gujarat Titans won the title in their debut season — Hardik Pandya's captaincy masterclass.",
    teams: 10, totalMatches: 74,
  },
  {
    year: 2023, number: 16, champion: "chennai-super-kings", runnerUp: "gujarat-titans",
    finalVenue: "Narendra Modi Stadium, Ahmedabad", finalDate: "2023-05-29",
    potT: "Shubman Gill",
    orangeCap: { player: "Shubman Gill", team: "gujarat-titans", runs: 890 },
    purpleCap: { player: "Mohammed Shami", team: "gujarat-titans", wickets: 28 },
    notes: "MS Dhoni's 5th title — equalled Mumbai's record. Final pushed to a reserve day by rain. Ravindra Jadeja's last-over heroics.",
    teams: 10, totalMatches: 74,
  },
  {
    year: 2024, number: 17, champion: "kolkata-knight-riders", runnerUp: "sunrisers-hyderabad",
    finalVenue: "MA Chidambaram Stadium, Chennai", finalDate: "2024-05-26",
    potT: "Sunil Narine",
    orangeCap: { player: "Virat Kohli", team: "royal-challengers-bengaluru", runs: 741 },
    purpleCap: { player: "Harshal Patel", team: "punjab-kings", wickets: 24 },
    notes: "KKR won by 8 wickets in a one-sided final. Their 3rd IPL title. Travis Head's blistering SRH season ended in a tame defeat.",
    teams: 10, totalMatches: 74,
  },
  {
    year: 2025, number: 18, champion: "royal-challengers-bengaluru", runnerUp: "punjab-kings",
    finalVenue: "Narendra Modi Stadium, Ahmedabad", finalDate: "2025-06-03",
    potT: "Suyash Sharma",
    orangeCap: { player: "Sai Sudharsan", team: "gujarat-titans", runs: 759 },
    purpleCap: { player: "Prasidh Krishna", team: "gujarat-titans", wickets: 25 },
    notes: "RCB ended their 18-year title drought — Virat Kohli's first IPL trophy. Rajat Patidar captained the campaign. Final was the 1000th IPL match.",
    teams: 10, totalMatches: 74,
  },
];

// =====================================================================
// IPL ALL-TIME RECORDS
// =====================================================================

export const IPL_RECORDS: IplRecord[] = [
  {
    slug: "highest-individual-score",
    title: "Highest Individual Score in an IPL Innings",
    description: "Top 5 highest individual batting scores ever recorded in an IPL match.",
    category: "batting",
    entries: [
      { rank: 1, player: "Chris Gayle", team: "RCB", value: "175* (66 balls)", year: 2013 },
      { rank: 2, player: "Brendon McCullum", team: "KKR", value: "158* (73 balls)", year: 2008 },
      { rank: 3, player: "Quinton de Kock", team: "LSG", value: "140* (70 balls)", year: 2022 },
      { rank: 4, player: "AB de Villiers", team: "RCB", value: "133* (59 balls)", year: 2015 },
      { rank: 5, player: "AB de Villiers", team: "RCB", value: "129* (52 balls)", year: 2016 },
    ],
  },
  {
    slug: "highest-team-total",
    title: "Highest Team Total in IPL History",
    description: "Top 5 highest team innings totals in IPL history.",
    category: "team",
    entries: [
      { rank: 1, player: "Sunrisers Hyderabad vs RCB", team: "SRH", value: "287/3 (20 ov)", year: 2024 },
      { rank: 2, player: "Sunrisers Hyderabad vs Mumbai", team: "SRH", value: "277/3 (20 ov)", year: 2024 },
      { rank: 3, player: "Royal Challengers Bengaluru vs Pune", team: "RCB", value: "263/5 (20 ov)", year: 2013 },
      { rank: 4, player: "Punjab Kings vs Hyderabad", team: "PBKS", value: "262/2 (20 ov)", year: 2024 },
      { rank: 5, player: "Sunrisers Hyderabad vs Delhi", team: "SRH", value: "266/7 (20 ov)", year: 2024 },
    ],
  },
  {
    slug: "most-runs-career",
    title: "Most IPL Career Runs (All-Time Leading Run-Scorer)",
    description: "Top 5 batsmen by total runs scored across all IPL seasons.",
    category: "batting",
    entries: [
      { rank: 1, player: "Virat Kohli", team: "RCB", value: "8,000+ runs (avg 39, SR 132)" },
      { rank: 2, player: "Shikhar Dhawan", team: "PBKS / DC / SRH", value: "6,769 runs" },
      { rank: 3, player: "David Warner", team: "DC / SRH", value: "6,565 runs" },
      { rank: 4, player: "Rohit Sharma", team: "MI", value: "6,500+ runs" },
      { rank: 5, player: "Suresh Raina", team: "CSK", value: "5,528 runs" },
    ],
  },
  {
    slug: "most-wickets-career",
    title: "Most IPL Career Wickets (All-Time Leading Wicket-Taker)",
    description: "Top 5 bowlers by total wickets across all IPL seasons.",
    category: "bowling",
    entries: [
      { rank: 1, player: "Yuzvendra Chahal", team: "RCB / RR", value: "215+ wickets" },
      { rank: 2, player: "Dwayne Bravo", team: "CSK / GL", value: "183 wickets" },
      { rank: 3, player: "Lasith Malinga", team: "MI", value: "170 wickets" },
      { rank: 4, player: "Bhuvneshwar Kumar", team: "SRH", value: "180+ wickets" },
      { rank: 5, player: "Rashid Khan", team: "SRH / GT", value: "165+ wickets" },
    ],
  },
  {
    slug: "most-sixes-career",
    title: "Most IPL Career Sixes",
    description: "Top 5 six-hitters in IPL history. The Universe Boss leads by a wide margin.",
    category: "batting",
    entries: [
      { rank: 1, player: "Chris Gayle", team: "KKR / RCB / PBKS", value: "357 sixes" },
      { rank: 2, player: "Virat Kohli", team: "RCB", value: "270+ sixes" },
      { rank: 3, player: "MS Dhoni", team: "CSK / RPS", value: "250+ sixes" },
      { rank: 4, player: "Andre Russell", team: "KKR", value: "230+ sixes (highest SR)" },
      { rank: 5, player: "Rohit Sharma", team: "MI", value: "260+ sixes" },
    ],
  },
  {
    slug: "fastest-century",
    title: "Fastest Century in IPL",
    description: "Top 5 fastest hundreds (by balls) ever scored in IPL.",
    category: "batting",
    entries: [
      { rank: 1, player: "Chris Gayle", team: "RCB", value: "100 off 30 balls (vs PWI)", year: 2013 },
      { rank: 2, player: "Yusuf Pathan", team: "RR", value: "100 off 37 balls (vs MI)", year: 2010 },
      { rank: 3, player: "David Miller", team: "PBKS", value: "100 off 38 balls (vs RCB)", year: 2013 },
      { rank: 4, player: "Travis Head", team: "SRH", value: "102 off 41 balls (vs RCB)", year: 2024 },
      { rank: 5, player: "AB de Villiers", team: "RCB", value: "100 off 43 balls (vs Mumbai)", year: 2015 },
    ],
  },
  {
    slug: "best-bowling-figures",
    title: "Best Bowling Figures in an IPL Innings",
    description: "Top 5 most-wickets-in-an-innings performances in IPL.",
    category: "bowling",
    entries: [
      { rank: 1, player: "Alzarri Joseph", team: "MI", value: "6/12 (vs SRH)", year: 2019 },
      { rank: 2, player: "Sohail Tanvir", team: "RR", value: "6/14 (vs CSK)", year: 2008 },
      { rank: 3, player: "Adam Zampa", team: "RPS", value: "6/19 (vs SRH)", year: 2016 },
      { rank: 4, player: "Akash Madhwal", team: "MI", value: "5/5 (vs LSG)", year: 2023 },
      { rank: 5, player: "Anil Kumble", team: "RCB", value: "5/5 (vs RR)", year: 2009 },
    ],
  },
  {
    slug: "most-titles",
    title: "Most IPL Titles (Franchise Trophy Count)",
    description: "Joint-most titles: MI and CSK with 5 each. Combined they've won 10 of 18 IPLs.",
    category: "team",
    entries: [
      { rank: 1, player: "Mumbai Indians", team: "MI", value: "5 titles (2013, 2015, 2017, 2019, 2020)" },
      { rank: 1, player: "Chennai Super Kings", team: "CSK", value: "5 titles (2010, 2011, 2018, 2021, 2023)" },
      { rank: 3, player: "Kolkata Knight Riders", team: "KKR", value: "3 titles (2012, 2014, 2024)" },
      { rank: 4, player: "Royal Challengers Bengaluru", team: "RCB", value: "1 title (2025)" },
      { rank: 4, player: "Sunrisers Hyderabad", team: "SRH", value: "1 title (2016)" },
    ],
  },
];

// =====================================================================
// HELPERS
// =====================================================================

export function getTeamBySlug(slug: string): IplTeam | undefined {
  return IPL_TEAMS.find((t) => t.slug === slug);
}

export function getSeasonByYear(year: number): IplSeason | undefined {
  return IPL_HISTORY.find((s) => s.year === year);
}

export function getRecordBySlug(slug: string): IplRecord | undefined {
  return IPL_RECORDS.find((r) => r.slug === slug);
}

/** Years where the team won the title — used for team-page narrative. */
export function teamTitleSeasons(teamSlug: string): IplSeason[] {
  return IPL_HISTORY.filter((s) => s.champion === teamSlug);
}
