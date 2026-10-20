# Wealth Tracker demo video

Recommended length: 2–3 minutes. Record at 1920×1080 if possible and use a fresh private browser window so the fictional demo dataset appears in its original state.

## Before recording

1. Run `npm install` if dependencies are not already installed.
2. Run `npm run dev`.
3. Open the Vite local URL in a private browser window.
4. Close unrelated tabs and notifications.
5. Set browser zoom so the full dashboard fits comfortably.
6. Start the screen recorder, wait two seconds, then begin speaking.

## Shot list and Norwegian narration

### 0:00–0:15 — Introduction

**Action:** Show the complete dashboard without moving the pointer quickly.

**Narration:**

> Dette er Wealth Tracker, en responsiv privatøkonomi-app utviklet med React, TypeScript, Vite og Tailwind CSS. Appen bruker kun fiktive demodata og lagrer alt lokalt i nettleseren.

### 0:15–0:40 — Dashboard

**Action:** Point to available balance, monthly income, monthly expenses, charts and recent transactions. Scroll slightly if needed.

**Narration:**

> Dashboardet beregner tilgjengelig saldo, månedlig inntekt, utgifter og sparerate fra de faktiske transaksjonene. Diagrammene er bygget med Recharts, og alle beløp vises i norske kroner.

### 0:40–1:20 — Transactions

**Action:**

1. Open Transactions.
2. Filter by Expense and Groceries.
3. Clear the filters.
4. Add an expense: `Course books`, `650`, `Lifestyle`, today's date.
5. Edit it to `700`.
6. Show the delete confirmation, then cancel so the entry remains visible.

**Narration:**

> På transaksjonssiden kan brukeren filtrere etter type og kategori, og søke i beskrivelsene. Nye inntekter og utgifter kan legges til, redigeres og slettes. Skjemaet validerer dataene før de lagres i localStorage.

### 1:20–1:55 — Savings goals

**Action:**

1. Open Savings goals.
2. Create `New laptop` with a target of `25 000`, starting amount `2 000` and a future deadline.
3. Add a contribution of `1 500`.
4. Open Withdraw, enter `500`, and complete the withdrawal.
5. Point to the updated progress bar and activity history.

**Narration:**

> Sparemål har målbeløp, frist og automatisk fremdrift. Brukeren kan legge til eller ta ut bidrag. Appen hindrer uttak som er større enn saldoen og bidrag som overstiger tilgjengelige midler.

### 1:55–2:20 — Analytics

**Action:** Open Analytics and switch between 3 months, 6 months and All time. Point to cash flow, expense categories, savings movement and insights.

**Narration:**

> Analysesiden bruker de samme lokale dataene til å vise kontantstrøm, utgiftskategorier, spareaktivitet og beregnede innsikter for ulike perioder. Ingen av tallene er hardkodet i visningen.

### 2:20–2:35 — Persistence and responsive design

**Action:** Refresh the page and return to the goal or transaction you created. Then briefly resize the browser to a narrow mobile width to show bottom navigation.

**Narration:**

> Etter en oppdatering ligger endringene fortsatt i nettleseren fordi dataene lagres i localStorage. Grensesnittet tilpasser seg også mobil med en egen bunnmeny og responsive kort.

### 2:35–2:45 — Closing

**Action:** Return to the dashboard and hold the final frame for two seconds.

**Narration:**

> Wealth Tracker løser oppgavens krav uten backend, innlogging, betalte API-er eller ekte bankintegrasjoner.

## Recording checklist

- Only fictional data is visible.
- No personal notifications, bookmarks or account details appear.
- Text is readable at the submitted video resolution.
- Mouse movement is slow and deliberate.
- Each save action is visibly reflected in totals or progress.
- The final video includes both desktop and mobile layouts.
- Audio is clear, with no copyrighted background music.
