# Exploration: 2048-react-game (Full Codebase)

**Date**: 2026-10-22 | **Scope**: Medium | **Status**: ✅ Complete

---

## 1. Foundation (What exists)

**Tech stack**:
- React 19.3, ReactDOM 19.3 (latest)
- TypeScript ~6.0.3, target ES2023, `verbatimModuleSyntax`
- Vite 8.3 (bundler), `@vitejs/plugin-react`
- Vitest 4.1 + `@testing-library/react` 16 + jsdom 29 (test environment)
- oxlint 1.88 (linter — NOT ESLint + Prettier as CLAUDE.md says; see Constraints)

**Architecture**: Single-page React app. No routing, no state management library, no CSS-in-JS. Pure React hooks + vanilla CSS. Logic fully decoupled from UI via a pure-functions utility layer.

**Structure**:
```
src/
  main.tsx              — entry, StrictMode wrapper
  App.tsx               — root component; composes all features
  index.css             — all styles (single file, ~250 lines)
  App.css               — unused scaffold leftover ⚠️
  types/index.ts        — shared TypeScript interfaces
  utils/gameLogic.ts    — pure game logic (no React)
  hooks/useGame.ts      — game state + keyboard listener
  hooks/useLeaderboard.ts — localStorage read/write
  components/
    Board.tsx           — 4×4 grid renderer
    Tile.tsx            — single tile, color-coded by value
    ScoreBoard.tsx      — score + best score display + New Game
    GameOverlay.tsx     — win/lost overlay on top of board
    Leaderboard.tsx     — popup dialog + trigger button
    index.ts            — barrel re-exports all components
  test-setup.ts         — @testing-library/jest-dom import
assets/ hero.png, react.svg, vite.svg — all unused scaffold leftovers ⚠️
```

**CLAUDE.md requirements (mandatory)**:
| Requirement | Status |
|---|---|
| TypeScript strict mode | ⚠️ `strict: true` absent from tsconfig.app.json (has partial strict flags) |
| Airbnb style + Prettier | ⚠️ Linter is oxlint, no Prettier config present |
| Destructure imports | ✅ Consistent throughout |
| Arrow functions | ✅ Consistent throughout |
| Error handling in async functions | ✅ All localStorage I/O wrapped in try/catch |
| Typecheck after changes | ✅ `npm run typecheck` script present (`tsc -b`) |
| Unit tests for new components/utilities | ⚠️ Only `Leaderboard.tsx` has tests (see Gaps) |
| Dev server port 3000 | ✅ Configured in vite.config.ts |
| Allow `*.cloudfront.net` | ⚠️ `server.allowedHosts` not set in vite.config.ts |

---

## 2. Patterns (How it's built)

### Architectural patterns

**Pure logic / React separation**:
- All game rules live in `utils/gameLogic.ts` — zero React imports, fully unit-testable
- Pattern: `createEmptyGrid → addRandomTile → move → hasWon/hasLost`
- Direction normalisation via transpose/reverseRows so only one `slideRow` implementation needed

**Custom hooks encapsulate all state**:
- `useGame` (`src/hooks/useGame.ts:30`) — game loop, keyboard listener (useEffect cleanup), localStorage best-score persistence
- `useLeaderboard` (`src/hooks/useLeaderboard.ts:23`) — top-10 entries, sorted desc, localStorage-backed

**Presentational components receive only what they render** (no hooks internally except `Leaderboard`):
- `Board`, `Tile`, `ScoreBoard`, `GameOverlay` — pure props in, JSX out
- `Leaderboard` — exceptionaly holds `isOpen` state (dialog UI concern) + receives entries as prop

**Barrel export pattern**: `src/components/index.ts` re-exports all components

### Testing patterns

- Framework: **Vitest** (not Jest — see Constraints)
- Setup: `src/test-setup.ts` imports `@testing-library/jest-dom` for DOM matchers
- Config: `vite.config.ts` `test.environment: 'jsdom'`, `test.globals: true`
- Test co-location: tests live beside the component (`Leaderboard.test.tsx`)
- Interaction style: `@testing-library/user-event` for click/keyboard; `screen.getByRole` preferred over `getByTestId`
- Coverage: **1 test file, 8 tests** — only `Leaderboard.tsx` covered

### State persistence pattern

Two localStorage keys, both with try/catch guards:
- `'best-score-2048'` — single number (managed by `useGame`)
- `'leaderboard-2048'` — JSON array of `LeaderboardEntry[]` (managed by `useLeaderboard`)

### CSS pattern

Single flat `index.css` using BEM-ish class names (`.lb-dialog`, `.lb-header`, `.score-box`). No CSS modules, no Tailwind. All tile colors are hardcoded in `Tile.tsx` as a lookup table (`TILE_COLORS`).

---

## 3. Constraints (What limits decisions)

**TypeScript**:
- No explicit `strict: true` — only partial strict flags (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`). Adding `strict: true` would enable `strictNullChecks` and `strictFunctionTypes` which could require code changes.
- `verbatimModuleSyntax: true` — type-only imports must use `import type`
- `allowImportingTsExtensions: true` — `.tsx` imports don't need explicit extension

**Linting**: oxlint is configured (`npm run lint`), not ESLint/Prettier. CLAUDE.md references Airbnb + Prettier but those tools are absent. This is a drift from documented standards.

**No path aliases**: All imports are relative (`../types`, `./Board`). Any move/reorganization needs import path updates.

**No CSS modules or scoping**: All CSS is global. Class name collisions are possible as the project grows.

**`allowedHosts` missing**: CLAUDE.md requires `https://*.cloudfront.net/` be allowed for CloudFront testing, but this isn't in `vite.config.ts`.

**Known state-sync gap** (`useLeaderboard`): `App.tsx` and `Leaderboard.tsx` each call `useLeaderboard()` independently, each with their own `useState`. When App calls `addEntry`, Leaderboard's `entries` state does **not** update — the new score only appears after a page reload. This is a real bug: finish a game, immediately open the Leaderboard popup, the just-saved score is missing.

---

## 4. Reusability (What to leverage)

**Reusable as-is**:
- `useLeaderboard.ts` — generic top-N sorted score store; works for any numeric leaderboard
- `utils/gameLogic.ts` — all exports are pure functions, fully portable
- `Leaderboard.tsx` — generic modal pattern; backdrop click + Escape key close; adaptable for any popup dialog

**Patterns to follow when adding components**:
- Co-locate test file next to component (`ComponentName.test.tsx`)
- Accept data via props, don't call hooks internally (unless managing local UI state like `isOpen`)
- Export from `src/components/index.ts`
- JSDoc props interfaces (see `Leaderboard.tsx` for established pattern)

---

## 5. Handoff (What's next)

**Gaps requiring attention (for PLAN/CODE phases)**:

| # | Gap | Severity |
|---|---|---|
| 1 | **State sync bug**: `useLeaderboard` called in two components; new scores don't appear in popup until reload | High |
| 2 | **Missing tests**: `useGame`, `gameLogic`, `useLeaderboard`, `Board`, `Tile`, `ScoreBoard`, `GameOverlay` — none covered | High (CLAUDE.md mandates) |
| 3 | **`strict: true` absent** from tsconfig.app.json | Medium |
| 4 | **`server.allowedHosts`** missing from vite.config.ts | Medium |
| 5 | **Unused files**: `App.css`, `assets/hero.png`, `assets/react.svg`, `assets/vite.svg` | Low |
| 6 | **Linter drift**: oxlint present but CLAUDE.md specifies ESLint + Prettier | Low |

**For CODE phase**:
- Test runner: `npm test` (Vitest run) or `npm run test:watch`
- Typecheck: `npm run typecheck`
- Linter: `npm run lint` (oxlint)
- Dev server: `npm run dev` → `http://localhost:3000`

**For COMMIT phase quality gates**:
- `npm run typecheck` must pass clean
- `npm test` must pass (all 8 existing + any new tests)
