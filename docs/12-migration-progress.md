# Angular upgrade: progress log

> Companion to [10-angular-migration-plan.md](10-angular-migration-plan.md). Newest entries at the bottom of each section.
> Started 2026-09-24 on branch `local`. Nothing has been committed to git yet; the pre-upgrade state is in `../Musterbox-backup-2026-09-24.tgz`.

## Current state

| | Before | Now |
|---|---|---|
| Angular | 10.0 | **22.2** ✅ |
| TypeScript | 3.9 | 6.0 |
| RxJS | 6.6 | 7.8 |
| Node | 22 + OpenSSL hack | 22 (`.nvmrc`) |
| Build | Webpack 4, ~16 min | Webpack 5, ~1–2 min |
| Lint | TSLint | ESLint |

## How each step is verified

1. `npm run build:prod` with 0 errors.
2. Logged-out smoke test in headless Chrome: login, register and forgot-password pages render, theme CSS applies, a failed login shows an error toast.
3. Logged-in smoke test (company admin): dashboard, Branch list (ngx-datatable rows, sort, pager), ng-select dropdown, Add Branch form, Task list, Add Task with the Quill editor, an ngx-bootstrap modal (Skillsets → Import), and the dashboard tabs. Forms are opened, never submitted.
4. Screenshots of step 3 are pixel-compared with the previous version's run.

Known, expected console error: `Firebase: Error (auth/invalid-api-key)` from Firebase Auth (earlier versions reported it as `Your API key is invalid`). It appears because the Firebase credentials are placeholders; see [11-firebase-todo.md](11-firebase-todo.md).

## Phase 0: prep ✅

- Node 16 via nvm (`.nvmrc`); removed `--openssl-legacy-provider` from the npm scripts.
- Removed 23 unused packages and their CSS entries in `angular.json` (plan §3.1).
- `sweetalert2` moved to `dependencies`. `crypto-js` and `xlsx` are now declared directly (the app imports them; they used to arrive only as sub-dependencies). `yarn.lock` removed.
- `AppNotificationService` wrapper (`src/app/services/app-notification.service.ts`). The 823 components that called `angular2-notifications` directly now go through it. Swapping the library later is a one-file change, plus removing `SimpleNotificationsModule` from the module files.

## Phase 1: v10 → v12 ✅

- v11: `ng-select` 6, FullCalendar 5.11, `@angular/cdk` 11. The migration switched all 22 theme bundles to `inject: true`, which would load every theme at once; this was reverted to `false`.
- v12: `ng-select` 7, `ngx-quill` 14, `@angular/fire` 6.1.5 + `firebase` 8.10.1, `angular-svg-round-progressbar` 7. Four unused `import { analytics } from 'firebase'` lines were deleted.
- TSLint → ESLint (`angular-eslint`). Protractor and `e2e/` removed. `karma-coverage-istanbul-reporter` replaced with `karma-coverage`.
- **Runtime regression found by the smoke test:** `angular2-notifications` 12 imports `BrowserAnimationsModule` inside `SimpleNotificationsModule`, which breaks every lazy-loaded route ("BrowserModule has already been loaded"). Pinned back to **9.0.0**; 16.0.1 fixes this but needs Angular 14+.

## Phase 2: v12 → v15 ✅

- v13: `ngx-datatable` 17 → 20.1 (the in-between majors were Angular-version bumps only), `ng-select` 8, `ngx-quill` 15, `angular-svg-round-progressbar` 8, `angular-eslint` 13, `@angular/cdk` 13.
  - `skipLibCheck: true` added to `tsconfig.json`, because `@angular/fire` 6.1.5's type definitions don't compile with TypeScript 4.6. App code is still fully type-checked.
- RxJS 7.8: two `rxjs/internal/types` imports and two `throwError(err)` calls updated. `.toPromise()` (23 calls in 8 files) is left alone: it behaves the same in RxJS 7 and is only removed in RxJS 8.
- Found during the logged-in smoke test, **not caused by the upgrade:** the topnav search dropdown showed teal text on a teal background for the highlighted option. The new `_modern.scss` (`color … !important`) overrode `search-bar.component.scss`. Fixed by adding `!important` to the search bar's `color: #fff`.
- `@angular/fire` 6.1.5 → **7.6.1** with `firebase` 9.23 (compat API). Firebase is kept. Only the import paths changed: `@angular/fire/compat`, `@angular/fire/compat/auth` and `@angular/fire/compat/auth-guard`. fire 7.6 supports Angular 12–16, so it gets past the v16 ngcc wall. `skipLibCheck` was removed again.
- v14: `ngx-bootstrap` 5.6 → **9.0**, `ng-select` 9, `ngx-quill` 16 (still Quill 1.3), `@ngx-translate/core` 14, `ngx-ui-loader` 13, `angular-svg-round-progressbar` 9, `angular-eslint` 14, `@angular/cdk` 14.
  - The typed-forms migration changed 5 files to `UntypedFormGroup` and similar.
  - Migrations were re-run with CLI 14 (`--migrate-only`), because CLI 13 cannot run CLI 14's migrations.
  - `setTheme('bs4')` is now called in `AppComponent`, so ngx-bootstrap doesn't have to guess the Bootstrap version.
  - **FullCalendar 5 → 6.1.21:** v5 imports `.css` from JavaScript, which Angular CLI 14 rejects. v6 supports Angular 12–22. `CalendarOptions` and related types now come from `@fullcalendar/core`. `FullCalendarModule.registerPlugins()` was removed, and `calendar.component.ts` got an explicit `plugins` list.
  - Deleted unused accidental imports: `@angular/compiler/src/util` (2 files; the path no longer exists) and `ThirdPartyDraggable` (4 form16 files).
  - `angular2-notifications` stays on **9.0.0**. 16.0.1 is compiled for Angular 16 and doesn't type-check on 14. It will be revisited at v16.
  - Smoke-test screenshots are pixel-identical to the v13 run.
- v15: `ngx-bootstrap` 10.3, `ng-select` 10, `ngx-quill` 20 (still Quill 1.3), `angular-svg-round-progressbar` 10, `ngx-export-as` 1.15, `angular-eslint` 15, `@angular/cdk` 15. The TS target is ES2022 with `useDefineForClassFields: false`.
  - **Theme loading (plan §4.3):** `main.ts` imported `./assets/css/sass/themes/vien.<name>.scss` from TypeScript, which Angular CLI 15 no longer compiles. The theme bundles in `angular.json` are now named after the theme (for example `light.tealslate`), and `loadTheme()` adds `<link rel="stylesheet" href="<name>.css">`. Non-injected bundles aren't content-hashed, so the file name is stable. This also unblocks the esbuild builder later.
  - The migration removed `relativeLinkResolution: 'legacy'`. The only relative navigation (the Me page tabs, `router.navigate([...], { relativeTo })` from an empty-path route) was checked in the browser and still lands on `/app/me/<tab>`.
  - **Regression found and fixed:** breadcrumbs were empty on some pages, because the page's `NavigationEnd` can now fire before the lazily loaded `BreadcrumbComponent` exists. The breadcrumb now also builds once on creation (`startWith(null)`).
  - The fields below the Quill editor on Add Task sit a few px lower (ngx-quill 20 wrapper height). Cosmetic.

## Phase 3: replace View Engine–only libraries (before v16) ✅

Angular 16 removes `ngcc`, so every library that `ngcc` still had to convert must be upgraded or replaced. 21 were found (`node_modules/*/__ivy_ngcc__`).

| Library | Template usages | Done |
|---|---|---|
| `ngx-datetime-picker`, `ng-image-fullscreen-view`, `@dabeng/ng-orgchart`, `ngx-filesaver` | 0 (imported only) | ✅ Removed from 47 module files and `angular.json`, packages uninstalled |
| `ngx-sortablejs` | 1 | ✅ Local `[sortablejs]` directive over `sortablejs` (`src/app/components/sortablejs`). The drag handle is commented out in the redesign, so the row is currently not draggable, same as before |
| `bn-ng-tree-lib` | 1 (User Tracking) | ✅ Local port with the same markup and CSS (`src/app/components/bn-ng-tree`). The 23 imports now point there |
| `@techiediaries/ngx-qrcode` | 2 | ✅ `angularx-qrcode` 15 (`<qrcode [qrdata]>`, `'url'`/`'H'`). QR download still reads `.coolQRCode > img` |
| `ngx-perfect-scrollbar` | 20 (sidebar, dashboard cards, chats) | ✅ Local port over `perfect-scrollbar` 1.5.0, with the same CSS, events and `directiveRef` scroll methods (`src/app/components/perfect-scrollbar`) |
| `@o.krucheniuk/ngx-signature-pad` | 11 | ✅ Local port over `signature_pad` 3.0.0-beta.4 (`src/app/components/signature-pad`). Drawing verified in the browser |
| `@agm/core` + `agm-direction` | 40 tags in 5 files | ✅ Local AGM-compatible module over the Google Maps JS API (`src/app/components/agm`): same `<agm-*>` tags, inputs, `mapReady`/`onResponse` events and lazy script loading, so none of the 5 map templates or components changed. `@types/googlemaps` (it only arrived through AGM) was replaced by `@types/google.maps`, registered in `tsconfig.app.json`/`tsconfig.spec.json` |
| `ngx-headroom`, `ngx-scroll-to`, `angular-dual-listbox`, `ng-circle-progress`, `ng-multiselect-dropdown`, `ng2-pdf-viewer`, `ngx-lightbox`, `ngx-material-timepicker`, `ngx-print`, `angular2-notifications` | — | ✅ Upgraded to their Ivy releases at the v16 step (see Phase 4) |

- `tsconfig.json`: `allowSyntheticDefaultImports: true` (type-only), needed for `import Sortable from 'sortablejs'`.
- The map screens were verified with fake tracking points injected in the browser: markers with custom icons, the red polyline with arrow icons, a marker-click info window with Angular content, and Directions mode (one real Directions request, rendered and passed to `handleRouteResponse`). Note that `agm-direction` used to request each route twice on first render; the port requests it once.
- **Pre-existing, not caused by the upgrade:** the travel-marker animation uses `assets/track_car.png`, which doesn't exist (not in git history or the backup), so that icon 404s.
- QR and signature screens have no data for the demo company. They were verified by feeding the component fake data in the browser through Angular's dev-mode debug API; nothing was saved.

## Phase 4: v15 → v16 (the ngcc wall) ✅

- Angular 16.2, TypeScript 4.9 (within v16's range; moves to 5.x at v17), zone.js 0.13.
- Lock-step: `ngx-bootstrap` 11, `ng-select` 11, `ngx-quill` 22 (still Quill 1.3), `angularx-qrcode` 16, `angular-svg-round-progressbar` 11, `ngx-export-as` 1.16, `@ngx-translate/core` 15, `angular-eslint` 16, `@angular/cdk` 16.
- Former View Engine libraries, now on Ivy releases: `angular2-notifications` **16.0.1** (the lazy-module `BrowserModule` bug from v12 is fixed in this release; the toast still works), `@ctrl/ngx-headroom` 5, `@nicky-lenaers/ngx-scroll-to` 14, `angular-dual-listbox` 7, `ng-circle-progress` 1.7.1, `ng-multiselect-dropdown` 1.0, `ng2-pdf-viewer` 10.0 (`pdfjs-dist` 2.11 → 2.16), `ngx-lightbox` 3, `ngx-material-timepicker` 13.1 (+ `luxon`), `ngx-print` 1.5.1.
- Migrations had to be re-run with CLI 16 (`--migrate-only`). The guard migration only removed the deprecated `implements CanActivate` from `auth.guard.ts` / `login.guard.ts`.
- Build: 0 errors on the first try. The smoke suite passes and all 13 screenshots are pixel-identical to v15.

## Phase 5: v16 → v22 ✅

- **v17** (Node 20 from here; `.nvmrc` updated): Angular 17.3, TypeScript 5.4, zone.js 0.14. `ngx-bootstrap` 12, `ng-select` 12, `ngx-quill` 24 (still Quill 1.3), `angularx-qrcode` 17, `angular-svg-round-progressbar` 12, `ngx-export-as` 1.17, `angular-eslint` 17, `@angular/cdk` 17.
  - The control-flow migration escaped one literal `@` in `govtreports/form-a` (`&#64;`, renders the same). `browserTarget` was renamed to `buildTarget`. The build stays on the webpack `browser` builder.
  - **Behavior kept:** Angular 17 changed `REMOVE_STYLES_ON_COMPONENT_DESTROY` to `true`, so a component's styles are removed when it is destroyed. The smoke test showed pages looking different depending on which page was visited before (for example the Me page icons and tab spacing), because many screens relied on styles left loaded by earlier pages. `app.module.ts` now provides it as `false`, the pre-v17 behavior, and the screenshots are pixel-identical to v16 again. Switching it on is a worthwhile cleanup but needs a visual pass over every module.
  - The Quill 2 decision is deferred: `ngx-quill` 26+ (Angular 18+) requires Quill 2, which changes the HTML output (plan §6 risk). `ngx-quill` 24 is partial-compiled and keeps working on newer Angular, so Quill 1.3 stays for the version climb.
- **v18:** Angular 18.2. `ngx-bootstrap` 18.1, `ng-select` 13.9, `angularx-qrcode` 18, `angular-svg-round-progressbar` 13, `ngx-export-as` 1.18, `angular-eslint` 18, `@angular/cdk` 18, `@angular/fire` **18.0.1** with `firebase` **10.14** (the compat API is still there, so the imports are unchanged).
  - `HttpClientModule` was migrated to `provideHttpClient(withInterceptorsFromDi())` in `app.module.ts` (the app has no interceptors).
  - The optional "new build system" migration was not applied; the build stays on webpack.
  - Smoke suite and QR/signature/map checks pass. Screenshots are pixel-identical to v17.
- **v19:** Angular 19.2, TypeScript 5.8, zone.js 0.15. `ngx-bootstrap` 19, `ng-select` 14.9, `angularx-qrcode` 19, `angular-svg-round-progressbar` 14, `ngx-export-as` 1.19, `angular-eslint` 19, `@angular/cdk` 19, `@angular/fire` 19.2 + `firebase` 11.10 (compat still available). `@ngx-translate/core` stays on 15 (peer `>=16`).
  - The migration added `standalone: false` to 1,101 components, directives and pipes (mechanical).
  - `angularx-qrcode` 19 dropped `QRCodeModule`; the 22 modules now import the standalone `QRCodeComponent` directly.
  - `@types/node` 14 → 20: the old typings clash with TS 5.8's DOM `AbortSignal`. They are pulled in by accidental `import … from 'os' | 'console' | 'constants' | 'process'` lines in a few components (see "Cleanup candidates").
  - Angular 19 parses `<style>` blocks inside templates with PostCSS, which rejects the `<!--` / `-->` markers that Word exports put inside `<style>`. Those two marker lines were removed from 5 govt report templates (`form-a`, `form4`, `form7`, `form14`, `form18`); the CSS rules are unchanged. Form 7 is now part of the smoke test.
  - Smoke suite and QR/signature/map checks pass. Screenshots are pixel-identical to v18.
- **v20:** Angular 20.3. `ngx-bootstrap` 20, `ng-select` **20.7** (the package now numbers its versions after Angular), `angularx-qrcode` 20, `angular-svg-round-progressbar` 15 (its last release), `ngx-export-as` 1.20, `angular-eslint` 20, `@angular/cdk` 20, `@angular/fire` 20.1 (`firebase` 11.10). `moduleResolution` is now `bundler` (migration).
  - A CLI migration crashed (`require.resolve is not a function`); the remaining migrations were re-run with CLI 20 (`--migrate-only`). The optional block control-flow and new-build-system migrations were not applied.
  - **Regression found by the smoke test:** `ng-select` 15.2.0 threw `Cannot set properties of undefined (setting 'disabled')` on every page with `<ng-option>` lists, and shifted some dropdown rendering. It is fixed in `ng-select` 20.7.0 (it skips options it cannot find); after upgrading, the error is gone and screenshots are pixel-identical to v19.
- **v21:** Angular 21.2, TypeScript 5.9. `ngx-bootstrap` 21.2, `ng-select` 21.8, `angularx-qrcode` 21, `angular-eslint` 21, `@angular/cdk` 21. `@angular/fire` stays on 20.1 (no v21 release; partial-compiled, works).
  - `main.ts`: `provideZoneChangeDetection()` added by the migration, so the app keeps zone.js. Zoneless is only the default for new apps.
  - **The control-flow migration ran as part of `ng update`:** 1,008 templates were converted from `*ngIf`/`*ngFor`/`*ngSwitch` to `@if`/`@for`/`@switch`. `@for` uses `track <item>`, which is object identity, the same as `*ngFor` without `trackBy`. The only visible effect in the smoke screenshots is that "User Info" on User Tracking moved about 7px (a whitespace text node disappeared).
  - `ngx-bootstrap` 21 removed `XModule.forRoot()`; all services are now `providedIn: 'root'`/`'platform'`. 682 `.forRoot()` calls on ngx-bootstrap modules were removed (391 files).
  - `ngx-export-as` 1.21 removed `ExportAsModule`. The app only imported the module and never used `ExportAsService`, so the 28 imports were removed.
  - **Would have been a silent runtime bug:** `TabDirective.heading` is now a signal, so `event.heading == 'ADDRESS'` in `performance.component.ts` (Me page tab switching) would always be false. It now reads `event.heading()`. TypeScript caught it. No other code reads `.heading` off a tab.
- **v22 ✅:** Angular 22.2, TypeScript 6.0, Node 22 (`.nvmrc`; CLI 22 needs `^22.22.3`). `ngx-bootstrap` 22, `ng-select` **23.11** (the Angular 22 line; 24.x adds a CDK-overlay dependency and was not taken), `angularx-qrcode` 22, `angular-eslint` 22, `@angular/cdk` 22. `ngx-export-as` uninstalled (unused).
  - The migrations preserve behavior: `ChangeDetectionStrategy.Eager` was added to 1,098 components (keeps the pre-v22 default), `$safeNavigationMigration()` wraps optional chaining in 51 templates, `strictTemplates: false` is explicit, and `withXhr` was added to `provideHttpClient`. The optional Karma→Vitest and new-build-system migrations were not applied.
  - TypeScript 6 turns `strict` on by default, which produced ~13,000 errors in this code base. `"strict": false` is now explicit in `tsconfig.json`. `downlevelIteration` was removed (no effect with an ES2022 target). `baseUrl` is kept with `"ignoreDeprecations": "6.0"`, because the app's `src/app/...` imports depend on it; TypeScript 7 will need `paths` instead. `skipLibCheck: true` is set again.
  - The v22 migration's `extendedDiagnostics` block conflicted with `strictTemplates: false` (NG4003) and was removed.
  - `import * as moment` is not callable under TS 6. Changed to `import moment from 'moment'` in 3 files.
  - **`ComponentFactoryResolver` was removed in Angular 22 (plan §4.2):**
    - App code: 5 dynamic tab loaders now use `viewContainerRef.createComponent(Type)` (same injector, inputs still set before `ngOnInit`). 19 more components only injected it without using it; the injection was removed.
    - **Blocking:** `ngx-lightbox` 3.0.0 (image previews in 8 screens) and `ngx-material-timepicker` 13.1.1 (163 timepickers) still call it inside one service each (`Lightbox`, `DomService`). Both are on their final release. **Fixed with `patch-package`** (user decision): `patches/ngx-lightbox+3.0.0.patch` and `patches/ngx-material-timepicker+13.1.1.patch` swap the factory for `createComponent(type, { environmentInjector: appRef.injector, elementInjector: injector })`. `"postinstall": "patch-package"` re-applies them on every `npm install` (verified by deleting both packages and reinstalling).
  - If a build still reports `ComponentFactoryResolver … was not found` after pulling these changes, delete `.angular/cache`; the build cache can hold the unpatched files.
  - Verified: the production build has 0 errors. The full smoke suite passes, plus two new checks: the Add Task timepicker opens its clock face and writes a time (form not submitted), and a lightbox image preview opens and closes. QR, signature and map checks pass. Screenshots match v21 (only 0.05% on the Me page sidebar).

## UI review round after the upgrade (2026-09-24)

**Method:** the pre-upgrade Angular 10 app (built from the backup) and the Angular 22 app were run side by side. The same 27 screens and interactions were screenshotted at desktop (1440px) and phone (390px) width and pixel-compared. Most screens were identical or within 0.05%.

**Regressions found and fixed:**

| Issue | Cause | Fix |
|---|---|---|
| Page title missing on pages with `<app-heading>` and no `title` (e.g. Master) | Same `NavigationEnd` race as the breadcrumb at v15 | `heading.component.ts` also resolves once on creation (`startWith(null)`) |
| Rich-text editors narrower/shorter (width shrinks to content, `height: 100px` suddenly applies) | ngx-quill 20+ uses `:host { display: inline-block }`; up to v12 the host was inline, so the templates' `style="height: 100px"` was ignored | `:root quill-editor { display: inline; }` in `_modern.scss` §12. Measured identical to v10 (243px tall, 201px editing area) |
| Buttons touching (no gap), e.g. the Employee list action row | Angular 22 drops a bare `&nbsp;` text node next to a control-flow block (`@if`…) | 202 stand-alone `&nbsp;` spacers next to `@if`/`@for`/`}` in 135 templates wrapped as `<span> &nbsp; </span>` (renders exactly as before) |

**Bug found that also existed before the upgrade:**

- An invisible 360×524px area in the bottom-right of every page blocked clicks, for example on table action icons. The closed chat-bot card is hidden, but its fixed wrapper `.theme-colors2` still took pointer events. `chat-bot.component.scss` now makes the wrapper click-through; the launcher and the open card still take clicks. A grid scan of several pages found no other invisible click-blocking layer.

**Polish (CSS only, `_modern.scss` §12, uses the existing `--m-*` tokens, works in light and dark themes):**

- ngx-material-timepicker follows the theme instead of its default bright blue: teal dial and hand, app font, rounded card, themed backdrop.
- Empty datatables show a centred, muted "No data to display" instead of a flush-left line.
- Phones: extra space at the bottom of the page so the floating chat/help buttons don't cover the last rows and the pager.

**Data-entry testing (demo company, records named "UI Test …"):**

- Department and Designation: validation message, save ("added successfully"), record shown in the list, delete ("deleted successfully"), then gone from the list. All test records were deleted; the real records (Administration, Manager) are untouched.
- Add Task: every widget works (company, employee, priority, dates, the patched timepicker, Quill). **Saving isn't possible, in v10 as well:** the required Task Stage dropdown offers no options for the demo company, although the Task Stages page lists 2 stages. This is existing app behavior or data, not caused by the upgrade; worth checking how stages are filtered.
- Behavior difference, not a bug: the ng-select multi-select opens at the top with selected items highlighted; v10 scrolled to the last selected item.

## Open decisions

1. ~~How to fix `ngx-lightbox` / `ngx-material-timepicker` for Angular 22~~ → patched with `patch-package`. Both libraries are abandoned; replacing them remains a good follow-up (the lightbox with a small in-house viewer, the timepicker with a maintained one), because the patches must be re-created if either package version ever changes.
2. **Quill 1.3 → Quill 2** (`ngx-quill` 26+) as a separate task, tested against real saved content.
3. Whether to turn on `REMOVE_STYLES_ON_COMPONENT_DESTROY` after a visual pass.

## Cleanup candidates (not required for the upgrade)

- Accidental auto-imports that compile only because the imports are unused: `import … from 'console' | 'os' | 'constants' | 'process' | 'jquery'` in a few components. They pull `@types/node` into the browser build.
- `assets/track_car.png` is missing (travel-marker icon).
- `.toPromise()` (23 calls): deprecated in RxJS 7, removed in RxJS 8.
- `npm run build:stage` refers to a `staging` configuration that does not exist in `angular.json`.
