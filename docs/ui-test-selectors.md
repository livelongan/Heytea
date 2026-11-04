# UI Selector Guide

## Purpose

The app exposes two complementary attributes for locating interface code and testing behavior:

- `data-ui` is a human-facing implementation locator. Use it in browser developer tools to identify a page region, then search the exact value in `src/`.
- `data-testid` is a stable automation selector for actions and repeated/state-dependent controls. Use it when an accessible role/name is ambiguous or when a test needs an exact control independent of visible copy.

Neither attribute controls styling or application behavior. Do not select elements by Tailwind classes, generated DOM structure, or array position when a stable selector is available.

## Selector Rules

1. Prefer accessible queries first: role and accessible name, label, or visible text.
2. Use `data-testid` for action controls, dynamic records, and controls whose label changes with state.
3. Keep test IDs stable when copy or styling changes. Rename one only when the underlying control's purpose changes.
4. Name selectors by page, intent, and object, using lowercase kebab case: `exam-primary-action`.
5. Repeated controls must include a stable identifier, not their current array index when an entity ID exists: `dashboard-lesson-action-lesson-3`.
6. Responsive duplicates must have distinct IDs, such as `navigation-desktop-dashboard` and `navigation-mobile-dashboard`.
7. Use `data-ui` names in the `page.region.control` format. Repeated `data-ui` values may include a stable record ID or ordinal, such as `exam.question-number.3`.
8. Add or update selector assertions when adding, moving, or renaming important actions.

## Current Action Selectors

### Login and Theme

| Test ID | Element |
| --- | --- |
| `login-email` | Email input |
| `login-password` | Password input |
| `login-password-visibility` | Show/hide password action |
| `login-submit` | Sign-in action |
| `theme-toggle` | Light/dark mode action |

### App Navigation and Dashboard

| Test ID | Element |
| --- | --- |
| `navigation-desktop-dashboard` | Desktop dashboard navigation |
| `navigation-desktop-exam` | Desktop exam navigation |
| `navigation-desktop-exam-history` | Desktop history navigation |
| `navigation-mobile-dashboard` | Mobile dashboard navigation |
| `navigation-mobile-exam` | Mobile exam navigation |
| `navigation-mobile-exam-history` | Mobile history navigation |
| `logout-desktop` | Desktop logout action |
| `logout-mobile` | Mobile logout action |
| `dashboard-continue-exam` | Continue current exam |
| `dashboard-start-exam` | Start a new exam |
| `dashboard-exam-history` | Open exam history |
| `dashboard-scenario-<scenarioId>` | Open a scenario |
| `dashboard-lesson-action-<lessonId>` | Complete a lesson |

### Scenario and Exam

| Test ID | Element |
| --- | --- |
| `scenario-back` | Return to dashboard from a scenario |
| `scenario-lesson-action-<lessonId>` | Complete a scenario lesson |
| `exam-begin` | Start the timed attempt |
| `exam-load-retry` | Retry loading an unavailable exam |
| `exam-mark-review` | Toggle review flag for the current question |
| `exam-previous` | Go to the previous question |
| `exam-primary-action` | Next question, or Submit exam on the final question |
| `exam-question-<number>` | Navigate to a question |
| `exam-answer-<questionId>-<optionId>` | Select an objective answer |
| `exam-response-<questionId>` | Enter a written answer |
| `exam-submit-cancel` | Cancel submission confirmation |
| `exam-submit-confirm` | Confirm submission |

### History and Results

| Test ID | Element |
| --- | --- |
| `exam-history-new-exam` | Start a new exam from history |
| `exam-history-empty-start` | Start the first exam from an empty history |
| `exam-history-result-<attemptId>` | Open a completed result |
| `exam-result-history` | Return to exam history |
| `exam-result-dashboard` | Return to dashboard |
| `exam-result-error-history` | Open history after a result-load error |
| `exam-result-question-<questionId>` | Review a question result |
| `not-found-home` | Return to dashboard from the 404 page |
| `error-boundary-retry` | Retry after a render failure |
| `error-boundary-dashboard` | Return to dashboard after a render failure |

Generic UI primitives also expose `data-ui` values such as `ui.button`, `ui.card`, `ui.input`, and `ui.label`. Pages can override these with a more specific business marker. See the `data-ui` attributes in the source when you need to locate non-action regions such as headings, summaries, or status messages.

## Examples

Testing Library:

```tsx
await user.click(screen.getByTestId('exam-primary-action'))
expect(screen.getByTestId('exam-question-2')).toBeDisabled()
```

Playwright:

```ts
await page.getByTestId('login-password-visibility').click()
await page.getByTestId('exam-answer-react-001-a').check()
await page.getByTestId('exam-primary-action').click()
```

Prefer role/name assertions for user-visible outcomes, for example:

```ts
await expect(page.getByRole('heading', { name: /assessment results/i })).toBeVisible()
```
