# Implementation Notes

This document summarizes the key design decisions, trade-offs, and future considerations for the Angular coding assessment submission. It is intended as a quick walkthrough for reviewers who want context beyond the code diff.

---

## Scope & Focus

The challenge asked for filtering, UI improvements, and async data handling on a product listing page. I kept the implementation **focused on those requirements** rather than building out a full production application.

Given the time-boxed nature of the exercise, I prioritized:

- A clear, working user flow (search, filter, sort, infinite scroll, detail view)
- Readable, maintainable code structure
- Unit tests on the most critical paths (service, utilities, and key components)

Features that were out of scope for this round — authentication, cart/checkout, admin tooling, i18n, and so on — were intentionally left out.

---

## Project Structure

I reorganized the codebase into a **feature-based folder structure**, even though this is a small project. For an assessment this may feel like extra ceremony, but it reflects how I would structure a real Angular application as it grows.

```
src/
├── core/           # App-wide singletons (loading service, HTTP interceptors)
├── shared/         # Reusable UI components, directives, and icons
├── features/
│   ├── home/
│   └── items/      # Models, data, utils, services, pages, and feature components
└── styles/         # Global SCSS (variables, mixins, theme)
```

Path aliases (`@core/*`, `@shared/*`, `@features/*`) keep imports clean and make it straightforward to add new features (e.g. `features/cart`, `features/checkout`) without refactoring existing code.

### Why feature-based?

| Benefit               | How it applies here                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Colocation**        | Everything related to items — models, service, filter bar, cards, list/detail pages — lives under `features/items/` |
| **Scalability**       | New domains can be added as sibling features without touching unrelated code                                        |
| **Clear boundaries**  | `core/` and `shared/` stay free of feature-specific logic                                                           |
| **Easier onboarding** | A reviewer or new teammate can navigate by domain, not by file type                                                 |

---

## Service Layer & API Abstraction

All data access goes through `ItemService` in `features/items/services/`. Components do not read from `assets/items.json` directly.

### Why centralize API calls in a service?

1. **Single source of truth** — Filtering, sorting, pagination, and detail lookup all share the same catalog. Keeping that logic in one place avoids duplication and drift.
2. **Easy to swap the backend** — Today the service loads from a local JSON file via `HttpClient`. In production, only the service internals would change; components would keep calling `getItemsPage()` and `getItemById()`.
3. **Testability** — Components and page logic can be tested with a mocked `ItemService` without standing up HTTP or touching static assets.
4. **Consistent async contract** — Every consumer receives `Observable<T>`, which mirrors how a real REST API would behave and keeps the component layer reactive.

The service also separates **pure business logic** (filter, sort, paginate) into small utility functions under `features/items/utils/`, which are independently unit-tested.

---

## Mock Data & Simulated Loading

There is no real backend in this exercise, so I used a combination of techniques to make the app behave like one:

| Technique                               | Purpose                                                                                             |
| --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **`assets/items.json` + `HttpClient`**  | Exercises the same data-loading path a real API would use                                           |
| **`generateItems()`**                   | Expands a small template set into a larger catalog so pagination and infinite scroll are meaningful |
| **`timer(400)` in `getItemsPage()`**    | Simulates network latency so loading states are visible during development and demo                 |
| **`LoadingService` + HTTP interceptor** | Shows a global loader for the initial catalog fetch (e.g. on the detail page)                       |
| **Component-level `isLoadingMore`**     | Shows a separate inline spinner/skeleton while additional pages load via infinite scroll            |

This approach lets reviewers see **real loading UX** — skeleton on first load, spinner on "load more" — without requiring a live API. Removing the artificial delay (`timer`) and pointing `ItemService` at a real endpoint would be a small, isolated change.

---

## Infinite Scroll

Pagination is implemented with an `InfiniteScrollDirective` (`shared/directives/`) that uses `IntersectionObserver` to detect when the user nears the bottom of the list.

- **Page size:** 8 items per request (`ITEMS_PAGE_SIZE`)
- **Filter changes** reset pagination and reload from offset `0`
- **Stale request handling** via a `loadRequestId` counter prevents race conditions when filters change while a page is still loading
- **Search debounce:** 300 ms before re-fetching after typing in the name filter

The list page manages scroll/pagination state; the service remains unaware of UI concerns and only returns `{ items, hasMore, totalCount }`.

---

## UI & Component Breakdown

| Area                     | Approach                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| **Filter bar**           | Dedicated `ItemFilterBarComponent` with name search, in-stock toggle, and sort dropdown  |
| **Product cards**        | Reusable `ItemCardComponent` with stock badge                                            |
| **Empty / error states** | Shared `EmptyStateComponent` with contextual messaging and a "Clear filters" action      |
| **Loading**              | Shared `LoaderComponent` with skeleton (initial) and spinner (load more) variants        |
| **Detail page**          | Route param-driven `ItemDetailComponent` with quantity selector and enriched detail data |

`ChangeDetectionStrategy.OnPush` is used on list and detail pages to align with Angular best practices for signal-driven components.

---

## Testing

Unit tests are in place for:

- `ItemService` (pagination, filtering, error handling)
- Pure utilities (`filterItems`, `sortItems`, `generateItems`)
- Key components (items list, filter bar, item card, item detail)
- Shared pieces (`LoadingService`, `InfiniteScrollDirective`, loader, empty state)

**More unit tests can be added** — for example, deeper integration-style tests on the items list page, edge cases around concurrent filter changes, and accessibility assertions. I focused coverage on the logic that carries the most risk rather than aiming for 100% coverage within the assessment window.

---

## Linting & Code Quality

The project uses **ESLint**, **Prettier**, **Husky**, and **lint-staged** for formatting and pre-commit checks.

**Additional linting rules** (e.g. stricter import ordering, custom Angular rules, SonarQube integration) can be layered on as team standards require. The current setup provides a sensible baseline without slowing down the exercise.

---

## Intentional Trade-offs

These were conscious decisions given the assessment scope:

- **Client-side filtering/sorting** — All data is loaded once and paginated in memory. A real API would push filter/sort/page params to the server.
- **No state management library** — Angular signals and RxJS are sufficient for this size; NgRx or similar would be warranted at larger scale.
- **Simulated latency** — The 400 ms delay is for demo purposes only and should be removed in production.
- **Limited E2E tests** — No Playwright/Cypress suite; unit tests cover the critical paths.

---

## Future Improvements

If this were to grow into a production feature set, these would be natural next steps:

| Area                | Possible enhancement                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| **API integration** | Replace JSON + `timer` with real paginated REST/GraphQL endpoints; add retry and caching strategies             |
| **Performance**     | Virtual scrolling for very large lists, `trackBy` optimizations, lazy-loaded feature routes, image lazy-loading |
| **Testing**         | E2E tests, visual regression, higher coverage on edge cases and a11y                                            |
| **Linting**         | Stricter ESLint config, commit hooks for test coverage thresholds                                               |
| **Features**        | Cart, wishlist, category navigation, price range filter, user preferences persistence                           |
| **Accessibility**   | Full keyboard navigation audit, ARIA live regions for dynamic result counts                                     |
| **Error handling**  | Toast notifications, offline support, structured error types from the API                                       |
| **i18n**            | Translatable strings and locale-aware sorting/formatting                                                        |

---

## Summary

This submission delivers the requested filtering and UI improvements on top of a structure that would scale if requirements expanded. The service layer abstracts data access, mock loading makes async behavior visible, and the feature-based layout keeps concerns separated — all while staying focused on what the assessment asked for.

Happy to walk through any part of this in more detail.
