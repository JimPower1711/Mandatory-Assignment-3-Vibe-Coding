# Assignment requirements mapping

This document maps the Wealth Tracker brief to the implemented solution. It can be used as an acceptance checklist before submission.

## Technology

| Requirement | Implementation | Status |
| --- | --- | --- |
| React with TypeScript and Vite | React entry point, typed models and Vite build configuration | Complete |
| Tailwind CSS | Tailwind utility classes and shared theme styles | Complete |
| Recharts | Cash-flow, spending-category and savings visualisations | Complete |
| Lucide React | Navigation, status and action icons | Complete |
| localStorage | Central finance hook loads, migrates and persists application data | Complete |
| No backend or paid API | All calculations and persistence run in the browser | Complete |

## Design

| Requirement | Implementation | Status |
| --- | --- | --- |
| Premium original fintech interface | Midnight Black & Amethyst system with graphite cards, restrained purple accents and editorial typography | Complete |
| Dark mode by default | Dark colour scheme is the default and only required theme | Complete |
| Minimal and professional | Clear hierarchy, reusable cards and focused interactions | Complete |
| Desktop sidebar | Persistent sidebar at desktop breakpoints | Complete |
| Responsive mobile layout | Mobile header, bottom navigation and responsive cards/tables | Complete |
| Hover effects and animations | Subtle transitions with reduced-motion support | Complete |
| NOK currency | Norwegian locale and NOK formatting used throughout | Complete |

## Dashboard

| Requirement | Implementation | Status |
| --- | --- | --- |
| Total available balance | Transaction net balance minus allocated savings | Complete |
| Monthly income | Calculated from the latest transaction month | Complete |
| Monthly expenses | Calculated from the latest transaction month | Complete |
| Financial charts | Income/expense area chart and category chart | Complete |
| Recent transactions | Latest six transactions sorted by date | Complete |

## Transactions

| Requirement | Implementation | Status |
| --- | --- | --- |
| Add income and expenses | Validated transaction form | Complete |
| Edit and delete | Edit form and deletion confirmation | Complete |
| Required transaction fields | Amount, category, date and description | Complete |
| Category and type filters | Combined filters plus optional search | Complete |

## Savings goals

| Requirement | Implementation | Status |
| --- | --- | --- |
| Create personal goals | Validated goal form | Complete |
| Set target amounts | Target and optional initial balance | Complete |
| Progress bars | Live amount and percentage calculations | Complete |
| Contributions and withdrawals | Validated transfer flow with activity history | Complete |

## Data integrity and scope

- The initial data is fictional and realistic for a Norwegian user.
- Dashboard and analytics values are calculated from stored transactions and goals.
- Contributions cannot exceed available cash.
- Withdrawals cannot exceed the selected goal balance.
- Existing local data is migrated when new fields are introduced.
- The app does not claim or simulate a real bank connection.

## Verification

- `npm run build` performs TypeScript compilation and the Vite production build.
- The local preview is checked for a successful HTTP response.
- Core workflows should be demonstrated in the accompanying video using the provided script.
