# QA Automation — Playwright E2E suite

An end-to-end test automation suite that drives a real web application through
its core user journeys, built with **Playwright** and the **Page Object Model**.

The suite runs against a live deployment ([fishytype.duta1.com](https://fishytype.duta1.com)),
so it exercises the real production build — not a mock.

## Why this project

It demonstrates the skills a test-automation role asks for:

| Skill | Where it shows up |
| ----- | ----------------- |
| Test design (positive, negative, edge cases) | `tests/specs/*.spec.js` |
| Page Object Model | `tests/pages/TypingTestPage.js` |
| Web automation | Playwright across Chromium, Firefox, WebKit |
| Mobile automation | `mobile` project (iPhone 13 emulation) |
| Clean, maintainable code | one selector source, readable specs |
| CI/CD integration | `.github/workflows/e2e.yml` |
| Reporting & artefacts | HTML report, JSON, traces, video on failure |

## Coverage

| Suite | What it checks |
| ----- | -------------- |
| `smoke` | the app loads, word list renders, stats bar present |
| `typing` | correct typing raises WPM, accuracy stays high, wrong keys are flagged, backspace works, timer counts down |
| `features` | duration switching, restart resets state, theme picker, results modal |

## Run

```bash
npm install
npx playwright install          # download browsers
npm test                        # run everything

# target another environment
BASE_URL=http://localhost:5173 npm test
```

Useful variants:

```bash
npm run test:headed   # watch the browser
npm run test:ui       # interactive runner
npm run report        # open the last HTML report
```

## Layout

```
tests/
  pages/            Page Objects (selectors + actions)
  specs/            the actual tests
.github/workflows/  CI pipeline (4 browser projects, parallel)
playwright.config.js
```

## CI

Every push runs the suite on four projects in parallel — chromium, firefox,
webkit and a mobile viewport — and uploads the HTML report as a build artefact.
