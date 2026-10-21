// Single place for personal links and numbers used across the site.
const profile = {
  name: "Hendrik Ortega",
  email: "hendrik_marine@berkeley.edu",
  github: "https://github.com/HendrikMarine",
  strava: {
    name: "Hendrik Ortega",
    // Replace with your athlete URL from Strava (Profile → copy link), e.g. https://www.strava.com/athletes/12345678
    url: "https://www.strava.com/athletes/search?query=Hendrik%20Ortega",
  },
  portfolio: {
    // SAMPLE VALUES. Replace with your real annualized figures.
    label: "My market portfolio",
    expectedReturn: 0.12, // E(r), annualized, as a decimal
    volatility: 0.18,     // σ, annualized, as a decimal
    riskFree: 0.045,      // r_f (e.g. 3-month T-bill)
    riskAversion: 3,      // your A
    benchmark: { label: "S&P 500 (long-run)", expectedReturn: 0.10, volatility: 0.16 },
  },
};

export default profile;
