# Angular Upgrade Plan (v10 → v22)

> Status: planning draft · Prepared 2026-09-23 · Current latest Angular on npm: **22.1.7**

This document lists every change needed to move Musterbox from Angular 10 to the current Angular release, grouped into phases the team can schedule. All counts below were measured on the `local` branch; re-run the commands in [Appendix A](#appendix-a--how-the-numbers-were-measured) before starting, because they will drift.

---

## 1. Where we are today

| Item | Current | Target |
|---|---|---|
| Angular (core, CLI, compiler) | `~10.0.2` | `22.x` |
| TypeScript | `~3.9.6` | `5.x` (whatever v22 pins) |
| RxJS | `~6.6.0` | `7.8.x` |
| zone.js | `~0.10.3` | current (or zoneless later) |
| Build | Webpack 4 (`browser` builder) + `--openssl-legacy-provider` hack | esbuild `application` builder |
| Lint | TSLint + codelyzer (both dead) | ESLint (`angular-eslint`) |
| Unit tests | Karma + Jasmine 3.5 | Karma (deprecated) → Vitest/Jest later |
| E2E | Protractor (dead) | Remove; Playwright later if wanted |
| Node (local machine) | v22 (only works because of the OpenSSL flag) | Node version required by v22 |

**Codebase size (drives effort):**

| Metric | Count |
|---|---|
| Components | ~1,094 |
| NgModules (roughly one per component) | ~945 |
| Lazy routes (`loadChildren: () => import…`) | 30 files |
| `*.spec.ts` files | ~1,049 (1,013 use the removed `async()` helper) |
| TS lines (excluding specs) | ~347k |

Overall this is a **large** migration. Angular itself upgrades mostly on its own through `ng update` schematics. Most of the cost comes from **third-party libraries**, many of which are abandoned or stop working after Angular 13/16.

---

## 2. Upgrade path and the hard walls

Angular only supports upgrading **one major version at a time** (`ng update @angular/core@N @angular/cli@N`). Each step runs automatic migrations. Plan for 12 steps (10→11→…→22), grouped into phases.

The versions that actually break things for this project:

| Version | What breaks / changes | Impact here |
|---|---|---|
| **v11** | `ModuleWithProviders` must be generic; `async()` → `waitForAsync()` (schematic) | Automatic |
| **v12** | Webpack 5, Ivy-only apps, `node-sass` gone, strict Sass | Remove the `--openssl-legacy-provider` flag from `package.json` scripts |
| **v13** | View Engine removed from the runtime (ngcc still bridges old libraries), IE11 dropped, RxJS 7 supported, `ComponentFactoryResolver` deprecated | 24 files use `ComponentFactoryResolver` |
| **v14** | Typed Reactive Forms | Schematic rewrites `FormGroup` → `UntypedFormGroup` (only ~5 files use reactive forms) |
| **v15** | `polyfills.ts` replaced by an `angular.json` array; standalone APIs stable; `async()` testing helper deleted | Must have finished the spec migration by here |
| **v16** | **ngcc removed.** Any library still published in View Engine format **fails to compile** | **Biggest wall.** See the library table |
| **v17** | New `@if`/`@for` control flow; esbuild `application` builder | Optional control-flow migration; builder switch is blocked by the theme loader (§4.3) |
| **v18** | `HttpClientModule` deprecated → `provideHttpClient()` | 1 file (`app.module.ts`) |
| **v19** | `standalone: true` becomes the default | Schematic adds `standalone: false` to all ~1,094 components (mechanical) |
| **v20** | `*ngIf` / `*ngFor` / `*ngSwitch` deprecated (still work); Karma deprecated | 1,013 `*ngIf` and 782 `*ngFor` files. Run the control-flow schematic |
| **v21–22** | Zoneless and Vitest are the defaults for **new** apps; existing apps keep zone.js/Karma | No forced change. Check Node/TS minimums on [update.angular.dev](https://update.angular.dev) |

> Use the official interactive guide at **https://update.angular.dev** (From 10.0 → To 22.0, "Advanced" complexity) as the checklist for each step. It lists every manual step per version.

### Node.js per step

Old Angular CLIs don't support modern Node. Use `nvm` (the repo already ships `install_nvm.sh`) and switch Node per phase. Confirm exact ranges on the Angular [version compatibility page](https://angular.dev/reference/versions):

| Angular | Node to use (approx.) |
|---|---|
| 10–11 | 12 / 14 |
| 12–13 | 14 / 16 |
| 14–15 | 16 / 18 |
| 16–18 | 18 / 20 |
| 19–20 | 20 / 22 |
| 21–22 | 22 / 24 |

---

## 3. Third-party library plan

This is where most of the work sits. **Action** legend:

- **Remove**: installed but never imported. Delete in Phase 0.
- **Upgrade**: a maintained version exists for recent Angular.
- **Replace**: abandoned or View-Engine-only. Swap for a maintained alternative before v16.
- **Verify**: last release is old but might still compile. Test at v16. If it fails, replace it.

### 3.1 Remove (unused, zero imports in `src/`)

| Package | Notes |
|---|---|
| `@ng-plus/signature-pad`, `angular2-signaturepad` | App uses `@o.krucheniuk/ngx-signature-pad` instead |
| `@syncfusion/ej2-angular-kanban` | Unused; also a commercial licence |
| `angular-archwizard` | Also remove `archwizard.css` from `angular.json` styles |
| `ng2-nouislider`, `nouislider` | Also remove `nouislider.min.css` from `angular.json` |
| `video.js` | Also remove `video-js.min.css` from `angular.json` |
| `ngx-contextmenu`, `angular2-hotkeys`, `ngx-dropzone-wrapper`, `ngx-ellipsis` | Unused |
| `ngx-extended-pdf-viewer` | App uses `ng2-pdf-viewer` |
| `yamapng`, `dom-to-image`, `@types/dom-to-image`, `html-to-image` | Unused (app uses `html2canvas`) |
| `pdfmake`, `html-to-pdfmake`, `@types/pdfmake`, `pdf-lib` | Unused (app uses `jspdf`) |
| `@types/socket.io-client` | `socket.io-client` v4 ships its own types |
| `css-loader`, `style-loader` (devDeps) | Not used by the Angular CLI |
| `allowedCommonJsDependencies: ["lodash"]` in `angular.json` | lodash isn't used |

Also: move `sweetalert2` from `devDependencies` to `dependencies`, because it's used in 287 files. Keep only one lockfile: the repo has both `package-lock.json` and `yarn.lock`.

### 3.2 Core UI libraries (heavy usage, upgrade carefully)

| Package | Current → Target | Files using it | Notes |
|---|---|---|---|
| `ngx-bootstrap` | 5.6 → 22.x | ~461 (modal 273, pagination 358, tabs 45, datepicker 22…) | Upgrade in steps alongside Angular. The app ships a vendored **Bootstrap 4** CSS; confirm the chosen version still supports BS4 (`setTheme('bs4')`) or plan a BS5 CSS upgrade separately. Datepicker CSS path in `angular.json` may change |
| `@ng-select/ng-select` | 4 → 24.x | ~1,332 | Each ng-select major tracks one Angular major. Upgrade in lock-step |
| `@swimlane/ngx-datatable` | 17 → 25.x | ~1,333 | v25 supports Angular 20–22. Intermediate majors had breaking CSS/API changes, so plan for **heavy regression testing** of list screens |
| `angular2-notifications` | 9 → 16.0.1 (last release, 2023) | **~1,171** | High risk: effectively unmaintained. **Recommendation:** first add an in-house `AppNotificationService` wrapper and route all calls through it (mechanical find/replace), then swap the implementation to `ngx-toastr` or similar in one file |
| `@ngx-translate/core` | 13 → 18.x | ~391 | v16+ moved to `provideTranslateService()` config; check its migration notes |
| `ngx-ui-loader` | 11 → 19.x | ~2,299 references | Peer `>=19`, so it works at the end state. Intermediate versions track Angular |
| `sweetalert2` | 11.0.0 → latest | 287 | Framework-agnostic, low risk |
| `ngx-quill` + `quill` | 12 + quill 1.3 → 31 + **quill 2** | ~101 | Recent ngx-quill needs Quill 2, which changes HTML output and module config. Test rich-text screens and saved content |
| `@angular/cdk` | 10 → 22 | 2 | Lock-step with Angular |

### 3.3 Replace (abandoned / expected to break at v16)

| Package | Why | Replacement | Files |
|---|---|---|---|
| `@agm/core` + `agm-direction` + `travel-marker` | AGM is archived; peer deps stop at Angular 10 | **`@angular/google-maps`** (official). Directions via `MapDirectionsRenderer`. Rework or drop `travel-marker` | ~26 / 25 / 3 |
| `@techiediaries/ngx-qrcode` | Last release targets Angular ≤10 | `angularx-qrcode` (22.x) | ~25 |
| `ngx-perfect-scrollbar` | Archived (2022) | Native CSS `overflow: auto` + thin scrollbar styles, or `ngx-scrollbar` | 7 |
| `@nicky-lenaers/ngx-scroll-to` | Peer `^14` | Native `element.scrollIntoView({ behavior: 'smooth' })` | 1 |
| `ngx-csv` | Last release 2022 | Small util with `Blob` + `file-saver` (already a dependency), or `exceljs` (already a dependency) | 1 |
| `@dabeng/ng-orgchart` | Peer `^8` | Maintained org-chart library or a thin wrapper over `d3-org-chart` | 1 |
| `@o.krucheniuk/ngx-signature-pad` | Peer `^11` | Wrap `signature_pad` (vanilla JS) in a small in-house component | ~30 |
| `ng-image-fullscreen-view` | Peer `^11` | `ngx-lightbox` (already used) or a small CDK Overlay component | ~25 |
| `ngx-sortablejs` | Peer `^11` | `@angular/cdk/drag-drop` (CDK already installed) | 1 |
| `@angular/fire` + `firebase` | See §4.4. Looks like leftover Vien template code | Remove | ~9 |

### 3.4 Verify at v16 (old but may still compile)

If one of these fails to compile after ngcc removal, replace it.

| Package | Latest | Files | Fallback |
|---|---|---|---|
| `bn-ng-tree-lib` | 1.6.3 (2022) | ~23 | `@angular/cdk/tree` |
| `angular-dual-listbox` | 7.0.0 (2022, peer ≥14) | ~24 | Small in-house component |
| `ngx-datetime-picker` | 3.0.0 (2022) | ~21 | ngx-bootstrap datepicker + timepicker (already used) |
| `ngx-material-timepicker` | 13.1.1 (2023, needs `luxon`) | ~30 | ngx-bootstrap timepicker |
| `ng-circle-progress` | 1.7.1 (2023) | ~21 | `angular-svg-round-progressbar` (already used, maintained) |
| `ng-multiselect-dropdown` | 1.0.0 (2023) | ~24 | `ng-select` with `[multiple]="true"` (already used everywhere) |
| `ngx-lightbox` | 3.0.0 (2022) | ~9 | CDK Overlay component |
| `@ctrl/ngx-headroom` | 5.0.0 (2022) | 1 | Small scroll directive |
| `ngx-export-as` | 1.21.x (peer `^21`) | ~28 | May hold the final step at v21 until it supports v22 |

### 3.5 Upgrade (low risk)

`angular-svg-round-progressbar` (3 → 15), `ng2-pdf-viewer` (7 → 10.x; re-check the pdf.js worker config), `ngx-print` (1.2 → 22.x), `@fullcalendar/*` (5 → 6/7; v7 needs `temporal-polyfill`), `socket.io-client`, `exceljs`, `jspdf`, `jspdf-autotable`, `html2canvas`, `file-saver`, `jwt-decode`, `moment` (consider `date-fns`/`dayjs` later, not required).

`chart.js` 2.9 is used directly (no Angular wrapper), so it **doesn't block** the Angular upgrade. Upgrading to Chart.js 4 is optional and separate: there are ~42 v2-only API usages (`xAxes`/`yAxes`, `Chart.defaults…`) in `src/app/components/charts/`.

---

## 4. Code changes inside the app

### 4.1 Handled by `ng update` schematics (review the diff, don't hand-write)

- `async(` → `waitForAsync(` in ~1,013 spec files (v11)
- `ModuleWithProviders` generics (v11)
- Removal of `static: false` from `@ViewChild` (~60 files; harmless either way)
- `FormGroup`/`FormControl`/`FormBuilder` → `Untyped*` (v14)
- `polyfills.ts` → `"polyfills": ["zone.js"]` in `angular.json` (v15)
- `standalone: false` added to every component/directive/pipe (v19)
- Optional: `ng g @angular/core:control-flow` (converts `*ngIf`/`*ngFor` to `@if`/`@for`)
- Optional: `ng g @angular/core:standalone` (drop the ~945 NgModules). Do this later, as its own project

### 4.2 Manual code changes

| Change | Where | Count |
|---|---|---|
| `ComponentFactoryResolver` → `viewContainerRef.createComponent(MyComponent)` | e.g. `views/app/tasks/task-dashboard`, `income-tax/*/declaration` | 24 files |
| `.toPromise()` → `firstValueFrom()` / `lastValueFrom()` (RxJS 7; removed in RxJS 8) | services/components | 8 files |
| `throwError(err)` → `throwError(() => err)` | interceptors/services | 2 files |
| `HttpClientModule` → `provideHttpClient(withInterceptorsFromDi())` | `app.module.ts` | 1 |
| Class guards → functional guards (optional; class guards still work) | `shared/auth.guard.ts`, `shared/login.guard.ts` | 2 |
| Remove `--openssl-legacy-provider` and review `--max_old_space_size=8096` | `package.json` scripts | 4 scripts |
| TSLint → ESLint: `ng add @angular-eslint/schematics`, delete `tslint.json`, `codelyzer`, `tslint` | root | — |
| Remove Protractor: delete `e2e/`, `protractor`, `jasminewd2`, and the `e2e` target | root | — |
| Replace `karma-coverage-istanbul-reporter` with `karma-coverage` | `karma.conf.js` | 1 |
| `::ng-deep` still works (deprecated, not removed). **No action needed** now | styles | 317 files |

### 4.3 Theme loading blocks the esbuild builder ⚠️

`src/main.ts` loads the theme with a **webpack-only** dynamic import built from a string:

```ts
return import('./assets/css/sass/themes/vien.' + name + '.scss');
```

The new esbuild `application` builder (default from v17) can't resolve variable-path SCSS imports. Two options:

1. **Stay on the webpack `browser` builder** through the upgrade. It's still supported, so this is the least risk while other things change.
2. **Switch to esbuild** (much faster builds) by loading the already-built bundles. `angular.json` already emits each theme as a separate CSS bundle (`bundleName: "light.teal.slate"`, `inject: false`), so `loadTheme()` can inject `<link rel="stylesheet" href="light.teal.slate.css">` instead of `import()`.

**Recommendation:** option 1 during the version climb, then option 2 as a follow-up task.

### 4.4 Firebase is leftover template code ⚠️

`environment.firebase` points at `vien-angular-login.firebaseapp.com`, the Vien theme's demo project. `shared/auth.service.ts` wraps `AngularFireAuth` and is injected in 5 components, but no `authService.signIn/register/...` call sites were found. `@angular/fire` 6 → 20 is a full API rewrite, so removing it is much cheaper than upgrading it.

Before removing:
- Confirm with the backend team that login doesn't go through Firebase.
- **Careful:** `services/form-value-storage.service.ts` uses `environment.firebase.apiKey` **as an encryption key**. If you remove the `firebase` block, move that value to a new key such as `environment.storageEncryptionKey` with the **same value**. Otherwise data already stored in users' browsers can't be decrypted.
- `views/app/form16s/tds_slab/add-tds-slab` imports `analytics` from `'firebase'`. It's probably an accidental auto-import; delete it.

### 4.5 Unit tests

There are ~1,049 spec files. Most look like CLI-generated boilerplate. Before investing effort, run `ng test` once on the current version and record how many pass.
- If they already fail or are empty, delete the boilerplate and keep only meaningful specs. That removes the `async()` migration surface.
- Karma still works through v22 for existing apps. Moving to Vitest is a separate, later task.

---

## 5. Recommended phases

Each phase ends with: `npm run build:prod` passes, the app boots, and a smoke test of key flows (login, dashboard, an ngx-datatable list, a modal form, PDF export, maps, signature, translations).

| Phase | Scope | Rough effort* |
|---|---|---|
| **0. Prep** | Commit/merge current WIP; create `feat/angular-upgrade` branch; pick one lockfile; remove unused packages (§3.1); move `sweetalert2` to deps; remove Firebase (§4.4); add the notifications wrapper (§3.2); record baseline build size and test results | 1–1.5 weeks |
| **1. v10 → v12** | `ng update` ×2, Webpack 5, remove OpenSSL flag, fix Sass warnings, TSLint → ESLint, drop Protractor | 1 week |
| **2. v12 → v15** | `ng update` ×3, RxJS 7, typed forms schematic, `ComponentFactoryResolver` cleanup, `toPromise`, polyfills move. Upgrade ngx-bootstrap / ng-select / ngx-datatable / ngx-translate in lock-step | 2–3 weeks |
| **3. Library replacements** (before v16) | AGM → `@angular/google-maps`, QR code, perfect-scrollbar, signature pad, fullscreen viewer, sortable, org chart, scroll-to, csv (§3.3) | 2–3 weeks |
| **4. v15 → v16** (ngcc wall) | Fix or replace whatever from §3.4 fails to compile | 1 week |
| **5. v16 → v22** | `ng update` ×6, `provideHttpClient`, Quill 2, FullCalendar, `standalone: false` schematic, Node/TS bumps | 2 weeks |
| **6. Hardening** | Full regression QA across modules, performance check, staging deploy | 1–2 weeks |
| **Optional follow-ups** | esbuild builder + theme loader (§4.3), control-flow migration, standalone components, Chart.js 4, Vitest, zoneless | separate |

\* Estimates assume 1–2 developers already familiar with the codebase. They're a planning starting point, not a commitment. Refine after Phase 0, once the unknowns in §3.4 have been checked.

**Total (Phases 0–6): roughly 10–14 weeks.**

### Working rules during the upgrade

- One Angular major per PR/commit, so any step can be bisected or reverted.
- Freeze or minimise feature work on the touched modules, or rebase often. With ~1,000 components, merge conflicts are the main schedule risk.
- Run `ng update` with a clean git tree. It refuses otherwise, and a clean tree keeps schematic diffs reviewable.
- If a library blocks a step, pin that step and replace the library before continuing. Don't use `--force` / `--legacy-peer-deps` to push past it.
- Deploy to **staging** after Phases 2, 4 and 5, not just at the end.

---

## 6. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| A §3.4 library fails at v16 with no drop-in replacement | Medium | Check early: build a throwaway v16 branch in Phase 0 to find out |
| ngx-datatable / ng-select / ngx-bootstrap visual or behaviour changes across ~1,300 screens | High | Screenshot-compare key screens; QA checklist per module (see `06-module-catalogue.md`) |
| Quill 2 renders previously saved rich text differently | Medium | Test with real saved content from production |
| Removing Firebase breaks the encryption key | Low if §4.4 is followed | Keep the key value identical |
| Long-running branch diverges from `main` | High | Short phases, merge to `main` after each phase that passes QA |
| Build memory: the app already needs an 8 GB heap | Medium | esbuild builder (§4.3) greatly reduces this |

---

## Appendix A — how the numbers were measured

Run from the repo root (zsh: keep the `--include` globs quoted):

```bash
grep -rl '@Component'  src/app --include='*.ts' | wc -l      # components
grep -rl '@NgModule'   src/app --include='*.ts' | wc -l      # modules
grep -rlE "[^a-zA-Z]async\(\(" src/app --include='*.spec.ts' | wc -l
grep -rl 'ComponentFactoryResolver' src/app --include='*.ts' | wc -l
grep -rl 'toPromise()' src/app --include='*.ts' | wc -l
grep -rlF '<package-name>' src --include='*.ts' | wc -l    # per-library usage
npm view <package-name> version peerDependencies           # latest + supported Angular
```

## Appendix B — references

- Update guide: https://update.angular.dev
- Version compatibility (Node/TS/RxJS): https://angular.dev/reference/versions
- Angular Google Maps: https://github.com/angular/components/tree/main/src/google-maps
- angular-eslint: https://github.com/angular-eslint/angular-eslint
