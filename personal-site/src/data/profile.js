// Single place for personal links and numbers used across the site.
const profile = {
  name: "Hendrik Ortega",
  email: "hendrik_marine@berkeley.edu",
  github: "https://github.com/HendrikMarine",
  strava: {
    name: "Hendrik Ortega",
    url: "https://strava.app.link/dTjUhiKbp7b",
  },
  portfolio: {
    // ILLUSTRATIVE VALUES ONLY. Real book metrics are not published on the site.
    label: "Illustrative portfolio",
    expectedReturn: 0.12, // E(r), annualized, as a decimal
    volatility: 0.18,     // σ, annualized, as a decimal
    riskFree: 0.045,      // r_f (e.g. 3-month T-bill)
    riskAversion: 3,      // your A
    benchmark: { label: "S&P 500 (long-run)", expectedReturn: 0.10, volatility: 0.16 },
  },
};

export default profile;
