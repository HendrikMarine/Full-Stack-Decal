// Small, dependency-free econometrics toolkit: OLS with classical and
// heteroskedasticity-robust (HC1) standard errors, t-tests, CIs, and diagnostics.

// ---------- distributions ----------
function lnGamma(x) {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += c[j] / ++y;
  return -tmp + Math.log((2.5066282746310005 * ser) / x);
}
function betacf(a, b, x) {
  const MAXIT = 200, EPS = 3e-12, FPMIN = 1e-300;
  let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d; h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}
export function betaInc(a, b, x) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}
// two-sided p-value for a t statistic with df degrees of freedom
export function tPValue(t, df) {
  if (!isFinite(t) || df <= 0) return NaN;
  const x = df / (df + t * t);
  return betaInc(df / 2, 0.5, x);
}
// t critical value (two-sided alpha) by bisection
export function tCrit(df, alpha = 0.05) {
  let lo = 0, hi = 50;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (tPValue(mid, df) > alpha) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
export function chi2PValue(x, k) {
  if (x <= 0) return 1;
  // regularized upper incomplete gamma via series/continued fraction
  const a = k / 2, z = x / 2;
  const gln = lnGamma(a);
  if (z < a + 1) {
    let sum = 1 / a, del = sum, ap = a;
    for (let n = 1; n < 500; n++) { ap += 1; del *= z / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-12) break; }
    return 1 - sum * Math.exp(-z + a * Math.log(z) - gln);
  }
  let b = z + 1 - a, c = 1 / 1e-300, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-12) break;
  }
  return Math.exp(-z + a * Math.log(z) - gln) * h;
}

// ---------- linear algebra ----------
function transpose(A) { return A[0].map((_, j) => A.map((r) => r[j])); }
function matmul(A, B) {
  return A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
}
function inverse(M) {
  const n = M.length;
  const A = M.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
    if (Math.abs(A[p][i]) < 1e-12) return null;
    [A[i], A[p]] = [A[p], A[i]];
    const piv = A[i][i];
    for (let j = 0; j < 2 * n; j++) A[i][j] /= piv;
    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const f = A[r][i];
      for (let j = 0; j < 2 * n; j++) A[r][j] -= f * A[i][j];
    }
  }
  return A.map((r) => r.slice(n));
}

// ---------- OLS ----------
// X: array of rows (each row already includes the intercept 1), y: array
export function ols(X, y, names, shallow = false) {
  const n = X.length, k = X[0].length;
  if (n <= k) return null;
  const Xt = transpose(X);
  const XtX = matmul(Xt, X);
  const XtXi = inverse(XtX);
  if (!XtXi) return null;
  const Xty = Xt.map((r) => r.reduce((s, v, i) => s + v * y[i], 0));
  const beta = XtXi.map((r) => r.reduce((s, v, j) => s + v * Xty[j], 0));
  const yhat = X.map((r) => r.reduce((s, v, j) => s + v * beta[j], 0));
  const resid = y.map((v, i) => v - yhat[i]);
  const ybar = y.reduce((a, b) => a + b, 0) / n;
  const sst = y.reduce((s, v) => s + (v - ybar) ** 2, 0);
  const sse = resid.reduce((s, e) => s + e * e, 0);
  const df = n - k;
  const sigma2 = sse / df;
  const r2 = sst === 0 ? 1 : 1 - sse / sst;
  const adjR2 = 1 - (1 - r2) * ((n - 1) / df);
  const se = XtXi.map((r, i) => Math.sqrt(sigma2 * r[i]));
  // HC1 robust: (X'X)^-1 X' diag(e^2) X (X'X)^-1 * n/(n-k)
  const meat = matmul(matmul(Xt, X.map((r, i) => r.map((v) => v * resid[i] ** 2))), XtXi);
  const robustCov = matmul(XtXi, meat).map((r) => r.map((v) => (v * n) / df));
  const seRobust = robustCov.map((r, i) => Math.sqrt(Math.max(0, r[i])));
  const tc = tCrit(df, 0.05);
  const coefs = beta.map((b, i) => ({
    name: names[i], beta: b, se: se[i], seRobust: seRobust[i],
    t: b / se[i], p: tPValue(b / se[i], df),
    tRobust: b / seRobust[i], pRobust: tPValue(b / seRobust[i], df),
    ciLo: b - tc * se[i], ciHi: b + tc * se[i],
  }));
  // F-test of all slopes = 0
  const ssr = sst - sse;
  const F = k > 1 ? (ssr / (k - 1)) / sigma2 : NaN;
  // Durbin-Watson (order as given)
  let dw = 0; for (let i = 1; i < n; i++) dw += (resid[i] - resid[i - 1]) ** 2; dw /= sse || 1;
  // Jarque-Bera normality of residuals
  const m2 = sse / n;
  const m3 = resid.reduce((s, e) => s + e ** 3, 0) / n, m4 = resid.reduce((s, e) => s + e ** 4, 0) / n;
  const skew = m3 / Math.pow(m2, 1.5), kurt = m4 / (m2 * m2);
  const jb = (n / 6) * (skew ** 2 + ((kurt - 3) ** 2) / 4);
  // Breusch-Pagan: regress e^2 on X, LM = n * R^2
  let bp = NaN;
  if (!shallow) {
    const e2 = resid.map((e) => e * e);
    const aux = ols(X, e2, names, true);
    if (aux) bp = n * aux.r2;
  }
  return {
    n, k, df, beta, coefs, r2, adjR2, sigma: Math.sqrt(sigma2), sse, F, fP: isFinite(F) ? fPValueApprox(F, k - 1, df) : NaN,
    dw, jb, jbP: chi2PValue(jb, 2), bp, bpP: isFinite(bp) ? chi2PValue(bp, k - 1) : NaN,
    yhat, resid, skew, kurt,
  };
}
function fPValueApprox(F, d1, d2) {
  // F p-value via regularized incomplete beta
  const x = (d2) / (d2 + d1 * F);
  return betaInc(d2 / 2, d1 / 2, x);
}
