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
    // Seeded from the Monte Carlo validation of Voyant's convergence thesis (not my personal account).
    // σ is implied from the simulation's 10th/90th percentiles: (39.8% − (−5.4%)) / 2.56 ≈ 17.7%.
    label: "Voyant convergence thesis (Monte Carlo base case)",
    expectedReturn: 0.164,
    volatility: 0.177,
    riskFree: 0.045,
    riskAversion: 3,
    benchmark: { label: "S&P 500 (long-run)", expectedReturn: 0.10, volatility: 0.16 },
    monteCarlo: [
      { label: "Mean return", value: "16.4%" },
      { label: "Median return", value: "15.1%" },
      { label: "P(return > 15%)", value: "50.1%" },
      { label: "P(loss)", value: "18.4%" },
      { label: "5th percentile", value: "-10.3%" },
      { label: "90th percentile", value: "+39.8%" },
      { label: "Convergence prob.", value: "59.5%" },
      { label: "Per-trade cap", value: "5% of capital" },
    ],
  },
};

export default profile;
