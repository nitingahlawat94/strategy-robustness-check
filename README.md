# Strategy Robustness Check
Free in-browser tool that stress-tests a trading strategy's trade list: Monte Carlo drawdown and ruin odds, Deflated Sharpe, cost stress, time-window consistency, first-half vs second-half and in-sample vs out-of-sample checks. Runs entirely in the browser; no data is uploaded.

- `index.html` : landing page (css/site.css, js/site.js)
- `tool.html` + `css/style.css` + `js/` : the tool (open tool.html directly, or serve with GitHub Pages)
- `js/util|parse|brokers|trust|health|insight|stats|charts|walkforward|ui.js` : load order matters (classic scripts, no bundler)
- `npm run build` : writes one self-contained `dist/robustness-check.html`
- `npm test` : scores synthetic strategies with known truth and checks the ordering

Analysis of past trades only. Not investment advice.

## Certificates
1. `node tools/keygen.js` on your own computer. Keep `private-key.jwk` secret (it is git-ignored). Paste the printed public key into `js/cert.js` as `PUB` and delete the SAMPLE certificate from `data/registry.json`.
2. Reproduce the requester's file in the tool and confirm the Report ID and score match.
3. `node tools/issue.js --rid=RBLY-XXXX-XXXX-XXXX --score=78 --headline="..." --n=300 --holder="Name"`, then commit `data/registry.json`.
Reviews: copy approved reviews into `data/reviews.json` as `{"rating":5,"review":"...","name":"..."}`; set `REVIEW_ENDPOINT` in `js/site.js` to a Formspree URL to receive submissions.

## Contact details and email
All contact details live in `js/config.js`. Put your BUSINESS email in `email` (not a personal one). Until it is set, contact buttons send people to your LinkedIn, and the page says the business email is coming soon. Email buttons open a Gmail compose window, so they work without a mail app. The "Copy email address" button appears once an email is set.

## Pages
`index.html` (home), `tool.html`, `verify.html`, `about.html`, `methodology.html`, `privacy.html`, `disclaimer.html`, `terms.html`, `404.html`. The shared header and footer are built by `js/shell.js`.
