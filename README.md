# Wealth Tracker

Wealth Tracker is a modern, local-first personal finance application created for a university Generative AI / Vibe Coding assignment. It helps users understand income, expenses and savings progress through a responsive fintech dashboard.

## Core requirements

- React, TypeScript and Vite
- Tailwind CSS for the complete interface
- Recharts for financial visualisations
- Lucide React icons
- Browser localStorage persistence
- NOK currency formatting
- No backend, authentication, paid APIs or bank integrations

The full requirement mapping is documented in [docs/assignment-requirements.md](docs/assignment-requirements.md).

## Visual system

The interface uses the restrained Midnight Black & Amethyst system: `#0B0B10` for the main background, `#0E0E15` for navigation, `#15151E` for cards and `#9B7AFF` for focused actions. Positive and negative financial values use `#4ADEA0` and `#FF766C`. Inter is bundled locally, and financial values use tabular numerals for stable alignment.

## Features

### Dashboard

- Available balance calculated from transactions and allocated savings
- Current monthly income and expenses
- Six-month income and expense chart
- Current spending-category breakdown
- Recent transactions and savings progress

### Transactions

- Add, edit and delete income or expenses
- Amount, category, date and description fields
- Search plus category and transaction-type filters
- Live totals and immediate dashboard updates

### Savings goals

- Create, edit and delete personal goals
- Target amounts, deadlines and progress bars
- Contributions and protected withdrawals
- Savings activity history

### Analytics

- Three-month, six-month and all-time periods
- Cash-flow, expense-category and savings charts
- Calculated insights and monthly summaries

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with:

```bash
npm run build
```

## Project structure

```text
src/
  components/   Reusable layout, dashboard, transaction, savings and chart UI
  data/         Fictional demo dataset
  hooks/        localStorage-backed finance state and mutations
  pages/        Dashboard, Transactions, Savings Goals and Analytics
  types/        Shared TypeScript finance models
  utils/        Financial calculations and formatting
```

## Development phases

1. Project foundation, navigation and dashboard
2. Transaction CRUD, search and filters
3. Savings-goal management, contributions and withdrawals
4. Data-driven analytics
5. Submission documentation and demo preparation

Each phase was implemented and verified separately before moving forward.

## Demo video

A complete recording plan, action sequence and Norwegian narration are available in [docs/demo-video-script.md](docs/demo-video-script.md). Use a fresh private browser window to start from the fictional demo dataset.

## Data and privacy

All included financial information is fictional. Application state is stored only in the current browser through localStorage. Reloading preserves changes, but clearing browser storage resets the app. Wealth Tracker never connects to a bank or external financial service.

## Generative AI usage

Generative AI assisted with planning, component scaffolding, visual iteration, refactoring and verification. The application was developed incrementally, and generated code was compiled and checked after each phase. The final design, feature scope and acceptance decisions remain part of the assignment work.

## Known limitations

- Data belongs to one local browser and is not synchronised between devices.
- Clearing browser storage removes locally entered data.
- There is no authentication or real banking integration by design.
- Analytics are descriptive and should not be treated as financial advice.
