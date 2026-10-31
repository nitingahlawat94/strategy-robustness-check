# Strategy Robustness Check
Free in-browser tool that stress-tests a trading strategy's trade list: Monte Carlo drawdown and ruin odds, Deflated Sharpe, cost stress, time-window consistency, first-half vs second-half and in-sample vs out-of-sample checks. Runs entirely in the browser; no data is uploaded.

- `index.html` : landing page (css/site.css, js/site.js)
- `tool.html` + `css/style.css` + `js/` : the tool (open tool.html directly, or serve with GitHub Pages)
- `js/util|parse|brokers|trust|health|stats|charts|walkforward|ui.js` : load order matters (classic scripts, no bundler)
- `npm run build` : writes one self-contained `dist/robustness-check.html`
- `npm test` : scores synthetic strategies with known truth and checks the ordering

Analysis of past trades only. Not investment advice.
