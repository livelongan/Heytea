# Learning React

React, TypeScript, Vite, Tailwind CSS v4, Zustand, React Router, MSW, Vitest, Testing Library, and Playwright application.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run format
npm run format:check
npm run test
npm run test:coverage
npm run test:e2e
npm run build
```

VS Code formats supported files with Prettier on save and applies available ESLint fixes. Install the recommended Prettier and ESLint extensions when prompted.

Copy `.env.example` to `.env.local` to configure the API base URL. The default `/api` endpoints are handled by MSW in development.

## Project layout

- `src/api`: API wrappers
- `src/mocks`: MSW handlers and browser/node setup
- `src/pages`: route and page components
- `src/components`: reusable UI components
- `src/store`: Zustand application state
- `src/hooks`: reusable React hooks
- `src/utils`: shared utilities
- `src/__tests__`: Vitest and Testing Library tests
- `tests/e2e`: Playwright end-to-end tests
- `ai-logs`: requirement, design, implementation, and test records
- `deploy`: deployment configuration and instructions
- `coverage`: generated test coverage report

## Finding UI code

Important interface regions and controls use stable `data-ui` attributes. Reusable primitives expose `ui.button`, `ui.card`, `ui.card-header`, `ui.card-title`, `ui.card-description`, `ui.card-content`, `ui.input`, and `ui.label`; page-level markers use the `page.region.control` format, such as `dashboard.scenario-card.scenario-1`, `exam.primary-action`, and `exam-result.metric.score`. Repeated controls use a stable record ID or index, as in `exam.question-number.3` and `exam-history.result.<attemptId>`.

To locate an element's implementation, inspect it in browser developer tools, copy its `data-ui` value, then search that exact value across `src/` in VS Code. When adding or moving an important UI control, preserve its marker or update the associated marker assertions in `src/__tests__/app.test.tsx`.

For automated UI tests, use the stable `data-testid` selectors documented in [docs/ui-test-selectors.md](docs/ui-test-selectors.md). Prefer accessible role/name selectors for user-facing behavior; use test IDs for repeated or state-dependent actions.
