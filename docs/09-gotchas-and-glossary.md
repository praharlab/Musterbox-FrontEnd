# 09 · Gotchas & Glossary

## Gotchas — read before your first change

### 1 · `views.routing.ts` builds three route tables at import time

```ts
let routes: Routes = [ /* A — with AuthGuard */ ];
if (localStorage.getItem('token'))      { routes = [ /* B */ ]; }
if (!environment.isAuthGuardActive)     { routes = [ /* C — NO AuthGuard */ ]; }
```

* Evaluated **once**, when the module is first imported. Logging in or out does
  not re-evaluate it — hence the `window.location.reload()` calls scattered around.
* `isAuthGuardActive` is **`false` in production**, so table **C** wins and
  `AuthGuard` is never attached in prod builds.
* The three tables also differ in their `**` wildcard: A and B → `/error`,
  C → `/user/login`.

### 2 · `AuthGuard` barely guards

`canActivateChild` only checks that a `token` string exists in `localStorage`.
The role check is commented out:

```ts
// if (route.data && route.data.roles) { … }
return true;
```

Real enforcement is the backend returning 403. Treat the frontend as
presentation-layer gating only — **never** as a security boundary.

### 3 · `npm run build:stage` is broken

`package.json` calls `ng build --configuration=staging`, but `angular.json` has no
`staging` configuration and there is no `src/environments/environment.staging.ts`.
The command fails. Either add both, or use `build:prod`.

### 4 · The `menu` key is a magic string

`IMenuItem.menu` must exactly match the backend's `formName`. No compile-time
check, no runtime warning — the item just disappears for permissioned users.
See [08-adding-a-screen](08-adding-a-screen.md).

### 5 · A permission-API failure looks like "full access"

`SidebarComponent`'s error handler deliberately keeps the **unfiltered** menu so
the user is not stranded. So "I can see everything" may mean the permission call
failed, not that the user is an admin.

### 6 · The body status, not the HTTP status

HTTP 200 with `{ "status": 403 }` is normal. Branch on `res.status`.
An RxJS `error` callback usually means a network/CORS problem, not a business error.

### 7 · Template leftovers that mislead

| Artefact | Reality |
|----------|---------|
| `shared/auth.roles.ts` — `enum UserRole { Editor, Admin }` | **Not** the real role model. The real one is the numeric `usertype` 0–4. Only referenced by dead `data.roles` route metadata and `environment.defaultRole`. |
| `shared/auth.service.ts` | Firebase/AngularFire auth from the Vien template. Real auth is the backend JWT. `getUser()` is still called by `AuthGuard.canActivate` and `SidebarComponent`. |
| `environment.firebase` | Points at the template author's demo project (`vien-angular-login`). |
| `data/api.service.ts`, `data/charts.ts` | Template demo data services, unrelated to `services/api.service.ts`. |
| `environment.buyUrl`, `SCARF_ANALYTICS`, `isMultiColorActive`, `themeRadiusStorageKey` | Template theming knobs. |
| `ApiService.callApi` **static** overload | A stub that throws `Method not implemented.` — it exists only to satisfy an old call site. Use the instance method. |
| `ChatService.getMsg()` / `selectConversation()` | Both throw `Method not implemented.` |

### 8 · Spelling that you must not "fix" casually

These are load-bearing. Grep before renaming.

| In the code | Correct spelling |
|-------------|------------------|
| route `reuqestInbox` | requestInbox |
| `UPDATEOMPANYDATA`, `DELETEOMPANYDATA` | UPDATECOMPANY… |
| `citymaster/v1/getbgetCityBystateIdyid/` | (backend URL, genuinely this) |
| `erpIngegration` | erpIntegration |
| `resigantionReason` | resignationReason |
| `Letter Tamplate Type` (UI label) | Template |
| `statuschange` vs `statuschanges` | both exist, per resource |
| `asignassettoemp` | assign |

### 9 · The working tree is not clean

At the time of writing, `git status` on branch `local` shows a large number of
modified files and some deletions — notably
`src/app/company-structure/*` is deleted while `AppModule` still declares
`CompanyStructureComponent` from `views/app/myteam/company-structure/`.
Check `git status` before assuming a file is missing.

### 10 · Build flags are mandatory

Without `--openssl-legacy-provider` the build dies with `ERR_OSSL_EVP_UNSUPPORTED`;
without `--max_old_space_size=8096` it runs out of heap. Both are already in the
npm scripts — don't call `ng` directly.

### 11 · Two lockfiles

`package-lock.json` and `yarn.lock` are both committed. Pick one package manager
per environment and be consistent, or you will get subtly different trees.

### 12 · `localStorage` is the whole session

`token`, `id`, `company_id`, `usertype`, `childcompany`, `user`. Clearing it
logs the user out; editing `usertype` changes the menu on reload. There is no
in-memory session store and no refresh-token flow.

---

## Glossary

### Access control

| Term | Meaning |
|------|---------|
| **usertype / admin** | Numeric persona 0–4. 0 employee, 1 company admin, 2 super admin, 3 sub admin, 4 dealer |
| **Form Master** | Catalogue of screens. A row's `formName` is the key permissions match on |
| **Operation** | A verb — Create, Edit, View, Delete |
| **Role Master** | A named, company-scoped bundle of form × operation grants |
| **Assign Role** | Attaching a role to a user |
| **Permission** | A single `{formName, operationName}` grant, returned by `auth/v1/finalcheckpermission` |
| **Authorization** | Approval routing — who signs off on whose requests. Unrelated to permissions |
| **Reports To** | The org hierarchy. Used for team views; not automatically the approver |

### Tenancy

| Term | Meaning |
|------|---------|
| **companyMasterID / company_id** | The tenant identifier. Sent with nearly every request |
| **Parent / child company** | A company can own sub-companies; `childcompany` controls whether their data is in scope |
| **Sub Admin** | Platform staff scoped to a subset of companies |
| **Dealer** | Reseller who onboards their own client companies |
| **Company Contact** | A user record inside a company; the *Is Admin* flag makes them a company admin |

### HR domain

| Term | Meaning |
|------|---------|
| **Pre-boarding** | Everything before day one: job posting, application, offer, document collection |
| **Off-boarding** | Resignation, exit tasks, F&F |
| **F&F** | Full and Final settlement on exit |
| **Muster roll** | Statutory attendance register |
| **Comp-off (C-Off)** | Compensatory leave earned for working a holiday/week-off |
| **Short leave** | A part-day leave |
| **Outdoor duty (OD)** | Work performed away from the usual location, counted as present |
| **Gate pass** | Authorised exit during work hours (employee) or visitor entry pass |
| **Punch in / out** | Attendance marking — biometric, mobile or web |
| **Shift roster** | Which shift each employee works on each date |
| **Week-off policy** | Which days are non-working for an employee |
| **Attendance policy** | Rules converting punches into present/absent/half-day |
| **Late/Early policy** | Penalties for late arrival or early departure |
| **Pay head** | A salary component — Basic, HRA, PF, PT, … |
| **Salary structure** | The per-employee assignment of pay heads |
| **CTC** | Cost to company |
| **Payslip** | Monthly salary statement |
| **PMS** | Performance Management System |
| **KRA / KPI** | Key Result Area / Key Performance Indicator |
| **NDA** | Non-disclosure agreement, tracked per employee |

### Indian statutory

| Term | Meaning |
|------|---------|
| **PF / EPF** | Provident Fund — retirement contribution |
| **ESIC** | Employees' State Insurance Corporation — medical insurance |
| **PT** | Professional Tax — state-level, slab-based |
| **LWF** | Labour Welfare Fund |
| **TDS** | Tax Deducted at Source |
| **Form 16** | Annual TDS certificate issued to an employee |
| **Form 11, 21, A–D, ER-01, …** | Statutory registers required under labour law |
| **Tax regime** | Old vs New income-tax regime; each employee elects one |
| **Declaration / Investment proof** | Employee-declared deductions used to compute TDS |
| **Standard deduction / Rebate** | Fixed allowances in the tax computation |

### Technical

| Term | Meaning |
|------|---------|
| **Vien** | The Angular admin template this project started from |
| **adminRoot** | `/app` — the prefix for all authenticated routes |
| **Response envelope** | `{ status, message, data }` — status lives in the body |
| **containerClassnames** | The CSS class string on `#app-container` encoding sidebar state |
| **CommonFilter** | The shared multi-dimension filter bar used by reports |
| **FormValueStorageService** | Keeps list filters alive across a drill-down |
| **ngx-datatable** | The grid used on nearly every list screen |
| **Session timeout modal** | Triggered by any `status: 403`; clears storage and redirects |

---

## Where to look when…

| Problem | Start here |
|---------|-----------|
| A menu item is missing | `constants/menu.ts` · `headerItems.ts` · Form Master · `finalcheckpermission` response |
| A button is missing | The screen's `checkpermission()` and the `*ngIf="permissionX.length"` in its template |
| Everyone gets logged out | `ApiService.callSessionTimeOutComponent` — something returned `status: 403` |
| A route 404s to `/error` | `views.routing.ts` — which of the three tables is active? |
| An API call 404s | `ConstantService` — check the exact constant, including `v1`/`v2` and trailing slashes |
| Data from the wrong tenant | `companyMasterID` in the request body; `childcompany` in `localStorage` |
| A list loses its filters | `FormValueStorageService` and the `protectedRoutes` array in that list component |
| Sidebar renders oddly | `SidebarService.containerClassnames` and the breakpoints in `environment` |
| The build fails on hashing | Missing `--openssl-legacy-provider` |
| The build runs out of memory | Missing `--max_old_space_size=8096` |
