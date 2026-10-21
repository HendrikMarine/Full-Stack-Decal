// Edit this file to update the Projects page and each project's detail route.
const projects = [
  {
    slug: "real-estate-acquisition-tool",
    name: "Real Estate Buy/Sell Acquisition Tool",
    status: "Building now",
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
    slug: "voyant-capital",
    name: "Voyant Capital",
    status: "Ongoing",
    tags: ["Investment research", "Markets", "Writing"],
    summary:
      "A student-run investment research operation I co-founded. We write theses, build models, and argue about them.",
    details: [
      "I work as an analyst: building out research on companies and themes, keeping a portfolio of theses, and learning how to be wrong in public with good reasoning.",
      "It's where my interest in data and markets overlap most directly.",
    ],
    stack: ["Excel", "Python", "Valuation", "Research writing"],
  },
  {
    slug: "startup-at-cal",
    name: "Startup at Cal",
    status: "Co-founder",
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
    tags: ["React", "Router", "Canvas", "Design"],
    summary:
      "The site you're on. React with React Router, a canvas particle field that follows your cursor, and interactive widgets for running, math, and data.",
    details: [
      "Built for the Full Stack DeCal at Berkeley. Every page has its own route, the Projects section has nested routes per project, and every animation is plain CSS or canvas with no animation libraries.",
    ],
    stack: ["React", "React Router", "Canvas API", "CSS"],
  },
];

export default projects;
