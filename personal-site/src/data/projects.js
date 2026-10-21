// Edit this file to update the Projects page and each project's detail route.
const projects = [
  {
    slug: "real-estate-acquisition-tool",
    name: "Real Estate Buy/Sell Acquisition Tool",
    status: "Building now",
    kind: "Startup",
    tags: ["Real estate", "Underwriting", "AI", "Product"],
    summary:
      "A tool that helps acquisition teams decide whether to buy or sell a property faster, by pulling the underwriting work into one place.",
    details: [
      "The problem: evaluating a deal means juggling rent rolls, comps, financing assumptions, and a spreadsheet that is different for every analyst. Most of the time goes into assembling inputs, not thinking about the deal.",
      "What I'm building: a workflow where a team drops in the raw documents, gets a standardized underwriting model back, and can stress-test the buy or sell decision against different assumptions.",
      "Where it's going: first pilots with real acquisition teams during the 2026-27 school year, then expanding from underwriting into the full buy/sell decision.",
    ],
    stack: ["React", "Node", "Python", "LLM APIs", "Financial modeling"],
  },
  {
    slug: "eurap-economics-ai",
    name: "E-URAP: Economics × AI",
    status: "Research · Fall 2026",
    kind: "Research",
    tags: ["Investment research", "Econometrics", "Economics", "AI", "Berkeley"],
    summary:
      "Undergraduate RA in the Berkeley Economics department's E-URAP program, on Applied Micro, Experiments, and Political Economy with AI.",
    details: [
      "Got in through a research exercise replicating Bai & Jia (2016, Econometrica), \"Elite Recruitment and Political Stability\": a plain-language summary, a literature review, and a Python (pyfixest) replication of the paper's main tables that matched to three decimals.",
      "The audit found something real: the published standard errors in one table were unclustered, and under prefecture clustering the instrument goes weak and the 2SLS estimates stop being significant at 5%.",
      "The RA work itself (~10 hrs/week): empirical analysis, data construction, literature research, experiment design, and building research tools with AI agents.",
    ],
    stack: ["Python", "pyfixest", "Econometrics", "2SLS / IV", "Literature review"],
  },
  {
    slug: "ssrp-irle",
    name: "SSRP at IRLE: Merit at Professional Service Firms",
    status: "Research · 2026-27",
    kind: "Research",
    tags: ["Investment research", "Labor", "Data", "Sociology", "Berkeley"],
    summary:
      "Social Sciences Research Pathways mentee at Berkeley's Institute for Research on Labor and Employment, supporting a dissertation on how merit gets defined and evaluated at professional service firms.",
    details: [
      "I applied with interests in poverty and income inequality, welfare economics, and why US infrastructure looks so different from Europe's, and was matched with a sociology PhD candidate working on political economy and organizations.",
      "The work is empirical: a Revelio Labs workforce-data analysis (through WRDS) plus weekly research check-ins for the full academic year.",
    ],
    stack: ["Python", "WRDS", "Revelio Labs data", "Research design"],
  },
  {
    slug: "voyant-capital",
    name: "Voyant Capital",
    status: "Ongoing",
    kind: "Research",
    tags: ["Investment research", "Markets", "Writing"],
    summary:
      "A student-run investment research operation I co-founded. We write institutional-style theses, build models, and argue about them.",
    details: [
      "I work as an analyst. Theses so far include a private credit stress thesis (with CLO tranche stress mapping and a three-factor stress model), a Japan normalization thesis, and a consumer auto credit thesis.",
      "On the quant side: a Monday Effect study that I designed and ran end to end, a congressional financial-disclosure surveillance pipeline in Python and SQLite, and a from-scratch options framework built around IV-HV z-score screening and Breeden-Litzenberger density extraction.",
      "I track the book's performance against a mean-variance utility target rather than raw return. The Portfolio page shows the framework; the actual metrics stay internal to Voyant.",
    ],
    stack: ["Python", "SQLite", "Excel", "Valuation", "Options", "Research writing"],
  },
  {
    slug: "startup-at-cal",
    name: "Startup at Cal",
    status: "Co-founder",
    kind: "Community",
    tags: ["Community", "Startups", "Berkeley"],
    summary:
      "A student startup club where people bring ideas and work on them together in weekly working sessions.",
    details: [
      "Co-founded it to give students a room where the default activity is building, not networking. 150 members on the roster across active and inactive.",
    ],
    stack: ["Community building", "Events"],
  },
  {
    slug: "central-valley-club",
    name: "Central Valley Club",
    status: "Founder",
    kind: "Community",
    tags: ["Community", "Berkeley", "Access"],
    summary:
      "A community for Berkeley students from California's Central Valley, focused on connecting low-income and underserved Valley students with each other and with campus resources.",
    details: [
      "Started it because students from the Valley often arrive at Berkeley without a built-in network. 25 members and growing.",
    ],
    stack: ["Organizing", "Mentorship"],
  },
  {
    slug: "this-website",
    name: "This Website",
    status: "Shipped",
    kind: "Code",
    tags: ["React", "Router", "Canvas", "Design"],
    summary:
      "The site you're on. React with React Router, a canvas particle field that follows your cursor, and interactive labs for running, math, data, and portfolio theory.",
    details: [
      "Built for the Full Stack DeCal at Berkeley. Every page has its own route, Projects and Writing have nested routes per entry, and every animation is plain CSS or canvas with no animation libraries.",
    ],
    stack: ["React", "React Router", "Canvas API", "CSS"],
  },
];

export default projects;
