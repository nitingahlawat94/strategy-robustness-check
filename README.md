# Strategy Robustness Check
Free in-browser tool that stress-tests a trading strategy's trade list: Monte Carlo drawdown and ruin odds, Deflated Sharpe, cost stress, time-window consistency, first-half vs second-half and in-sample vs out-of-sample checks. Runs entirely in the browser; no data is uploaded.

- `index.html` + `css/` + `js/` : the app (open index.html directly, or serve with GitHub Pages)
- `js/util|parse|stats|charts|ui.js` : load order matters (classic scripts, no bundler)
- `npm run build` : writes one self-contained `dist/robustness-check.html`
- `npm test` : scores synthetic strategies with known truth and checks the ordering

Analysis of past trades only. Not investment advice.
