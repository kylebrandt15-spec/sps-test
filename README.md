# Find the Hidden Cost — SPS Commerce Lead Gen Game

Interactive top-of-funnel game targeting CIO / VP IT / Director of IT personas at mid-market and enterprise retailers. Players reveal 12 hidden cost problems, see their annual total, and submit their email to receive a personalized benchmark report.

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → /dist
```

## Tech Stack

- React 18 (Vite)
- Tailwind CSS (v4, Vite plugin)
- Framer Motion (lazy-loaded)
- React Hook Form + Zod

## How to Update the 12 Problems

Edit `/src/data/problems.js`. Each problem has:

```js
{
  id: 1,
  label: "Display name on the card",
  description: "Short subtitle (11px, muted)",
  tooltip: "Why this costs money — shown in the popover on click",
  baseCost: 18600,      // annual cost at 100 suppliers
  category: "labor",   // labor | operations | compliance | data | inventory | risk
}
```

The `baseCost` is automatically scaled by `supplierCount / 100` at render time.

## How to Update the Cost Formulas

Edit `/src/data/costs.js`. The `costLines` array drives the breakdown table:

```js
{ id: "receiving", label: "Display label", base: 18600 }
```

`computeCost(base, supplierCount)` and `computeTotal(supplierCount)` are exported helpers used throughout the app — no other files need changing when you edit base costs here.

## Connecting the Marketo Webhook

In production, form submissions POST to `/api/leads`. Wire your reverse proxy or serverless function to forward that path to your Marketo webhook URL.

The payload shape:

```json
{
  "email": "user@company.com",
  "company": "Acme Co",
  "supplierCount": 100,
  "totalHiddenCost": 235000,
  "timestamp": "2026-05-05T00:00:00.000Z",
  "source": "find-hidden-cost-game",
  "campaign": "Campaign03-BestDataBestAI"
}
```

During local development, if `/api/leads` is unreachable the app logs the full payload to the browser console and advances to the confirmation screen — so you can verify the data shape without a live endpoint.

## Updating the Post-Submit CTA Link

In `/src/components/ConfirmationView.jsx`, update the `href` on the anchor tag near the bottom:

```jsx
<a href="https://www.spscommerce.com" ...>
  Read the full FSMA 204 Traceability Readiness Report →
</a>
```

## Analytics Events

Events fire via `src/utils/analytics.js` — console in dev, `window.dataLayer.push()` for GTM in production:

| Event | When |
|---|---|
| `game_started` | First card click |
| `problem_found` | Each card click |
| `game_completed` | All 12 found |
| `email_submitted` | Form submit |
| `email_confirmed` | Successful POST |

## File Structure

```
/src
  /components
    Hero.jsx              — full-width blue header
    GameBoard.jsx         — grid + progress bar + context bar
    ProblemCard.jsx       — individual card with tooltip
    ProgressBar.jsx       — animated progress bar
    SupplierSlider.jsx    — range input + source note
    CostBreakdown.jsx     — 10-line cost table + stat chips (lazy)
    EmailGate.jsx         — lead capture form (lazy)
    ConfirmationView.jsx  — post-submit state (lazy)
  /data
    problems.js           — 12 problem definitions
    costs.js              — cost lines, formulas, helpers
  /hooks
    useGameState.js       — central game state
  /utils
    analytics.js          — GTM / console analytics helper
  App.jsx
  main.jsx
  index.css
```
