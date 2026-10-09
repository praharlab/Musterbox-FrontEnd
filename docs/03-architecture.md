# 03 · Architecture

## Technology stack

| Concern | Library |
|---------|---------|
| Framework | Angular **10.0.2**, TypeScript 3.9, RxJS 6.6 |
| UI kit | Bootstrap 4 via **ngx-bootstrap 5.6** (modals, tabs, datepicker, timepicker, pagination, tooltip, collapse) |
| Styling | SCSS, the **Vien** admin template's theme system |
| Data grid | **@swimlane/ngx-datatable** — the grid on essentially every list screen |
| Selects | `@ng-select/ng-select`, `ng-multiselect-dropdown`, `angular-dual-listbox` |
| Charts | **chart.js 2.9** wrapped by `src/app/components/charts/*` |
| Loading | `ngx-ui-loader` (`NgxUiLoaderService.start()/stop()`) |
| Alerts | `angular2-notifications` (toasts) + **sweetalert2** (confirm dialogs) |
| Exports | `exceljs`, `ngx-csv`, `jspdf` + `jspdf-autotable`, `pdfmake`, `ngx-export-as`, `file-saver` |
| PDF view | `ng2-pdf-viewer`, `ngx-extended-pdf-viewer`, `pdf-lib` |
| Realtime | `socket.io-client` 4.1 |
| Maps | `@agm/core`, `agm-direction`, `travel-marker` |
| Calendar / board | `@fullcalendar/angular`, `@syncfusion/ej2-angular-kanban` |
| Rich text | `ngx-quill` (letter & mail templates) |
| Signatures | `@o.krucheniuk/ngx-signature-pad`, `angular2-signaturepad` |
| Org chart | `@dabeng/ng-orgchart`, `bn-ng-tree-lib` |
| i18n | `@ngx-translate/core` (wired up; most labels are hard-coded English) |

> The project started from the **Vien Angular** admin template. A fair amount of
> template scaffolding survives unused — see [09-gotchas](09-gotchas-and-glossary.md).

## Directory map

```
src/app/
├── app.module.ts            Root module. Imports ~40 third-party modules.
├── app.routing.ts           Root router → lazy-loads ViewsModule. useHash: true.
│
├── shared/                  auth.guard · login.guard · auth.service · auth.roles · lang.service
├── services/                ApiService · ConstantService (endpoint catalogue) · ~15 helpers
├── constants/               menu.ts · headerItems.ts · commonVariables.ts · CommonFilterFields.ts · labelUtils.ts
├── utils/                   CommonUtils — date/format/sort helpers
├── data/                    api.service.ts · service-response.ts · charts.ts  (template leftovers)
│
├── containers/
│   ├── layout/              topnav · sidebar · footer · breadcrumb · heading · pop-up-menu
│   │                        application-menu · chat-bot · profile-pic · search-bar
│   │                        user-modal · user-request-box
│   ├── pages/               Shared page-level presentational components
│   └── dashboards/          Dashboard widgets
│
├── components/              Reusable presentational components
│   ├── charts/              area · bar · line · pie · doughnut · polar · radial + chart.service
│   ├── cards/ carousel/ bootstrap/ state-button/ …
│
├── chat-notification/       Floating chat + notification widget (socket.io)
├── session-time-out/        The "session expired" modal, driven by ApiService
├── documents-upload/        Public (unauthenticated) document-upload page for pre-boarding
│
└── views/
    ├── views.module.ts
    ├── views.routing.ts     ⚠️ Builds three different route tables at import time
    ├── error/ · unauthorized/
    ├── user/                PUBLIC: login · register · forgot/reset password · otp
    │                        preboardingform · submit-form · job-posting · apply-job
    └── app/                 AUTHENTICATED: the product. 30 lazy feature modules.
```

## Routing: three layers, and one trap

### Layer 1 — root

`app.routing.ts` has exactly one route: `''` → lazy-load `ViewsModule`.
Hash routing is enabled here.

### Layer 2 — `views.routing.ts` (read this carefully)

This file does **not** export a single route table. It declares `let routes`,
then **reassigns it twice** based on conditions evaluated *when the module is
first imported*:

```ts
let routes: Routes = [ /* A: guarded, with AuthGuard */ ];

if (localStorage.getItem('token')) {
  routes = [ /* B: guarded, unknown paths → /error */ ];
}

if (!environment.isAuthGuardActive) {
  routes = [ /* C: NO AuthGuard at all, unknown paths → /user/login */ ];
}
```

Consequences you must know:

* In **production** `isAuthGuardActive` is `false`, so table **C** always wins and
  **`AuthGuard` is never attached**. Route protection in prod comes from
  `LoginGuard` on the public routes plus the backend returning 403.
* The tables are chosen at **module import time**, not per navigation. Logging in
  or out does not re-evaluate them — that is why several flows call
  `window.location.reload()`.

### Layer 3 — feature routes

```
/#/user/…            views/user/user.routing.ts        public
/#/app/…             views/app/app.routing.ts          30 lazy modules
/#/app/<feature>/…   views/app/<feature>/<f>.routing.ts nested lazy modules
/#/error  /#/unauthorized
/#/upload-preboard-docs/:query                          public, no shell
```

`views/app/app.routing.ts` mounts `AppComponent` (the layout shell) and lazy-loads
one module per menu item:

```
dashboards  tasks  orgs  utilitys  visits  myteam  preboardings  offboardings
finances    attendances  assets  overtimes  payrolls  reports  skillsets
govtreports gatepasses   masters superadminmenus  checklists  tickets  form16s
moodTrackers pms  incometax  employeegatepasses  userprofile
+ notification · changepassword · me · reuqestInbox   (note the spelling)
```

## The layout shell

`views/app/app.component.html`:

```html
<div id="app-container" [className]="sidebar.containerClassnames">
  <app-topnav></app-topnav>
  <app-sidebar></app-sidebar>
  <main>
    <div class="container-fluid">
      <router-outlet></router-outlet>
      <app-chat-notification></app-chat-notification>
    </div>
  </main>
  <app-footer></app-footer>
</div>
```

`SidebarService` owns `containerClassnames`, a space-separated string of CSS
classes that encodes the whole responsive menu state (collapsed / sub-hidden /
main-hidden). Every navigation re-computes it. If the sidebar behaves oddly, that
string is where to look.

`SidebarComponent` also builds the menu — see [04-roles-and-permissions](04-roles-and-permissions.md).

## The API layer

Two files do all the work.

### `ConstantService` — the endpoint catalogue

2,645 lines of `NAME = 'resource/v1/action'` string constants, grouped by
resource with `// comment` headers. **Never hard-code a URL in a component** —
add a constant here.

```ts
// companymaster
GETCOMPANYDATA    = 'companymaster/v1/getalldata';
CREATECOMPANYDATA = 'companymaster/v1/add';
VIEWCOMPANYDATA   = 'companymaster/v1/getbyid/';
UPDATEOMPANYDATA  = 'companymaster/v1/updatebyid';
DELETEOMPANYDATA  = 'companymaster/v1/deletebyid';
COMPANYSTATUSCHANGE = 'companymaster/v1/statuschange';
```

(Typos like `UPDATEOMPANYDATA` and `DELETEOMPANYDATA` are real. Don't "fix" them
without grepping for usages.)

### `ApiService` — the single HTTP entry point

```ts
callApi(
  requestUrl:    string,     // a ConstantService constant (+ any :id suffix)
  requestParams: any,        // body for POST/PUT, ignored for GET/DELETE
  requestType:   'GET' | 'POST' | 'PUT' | 'DELETE',
  showLoading:   boolean,    // start/stop the ngx-ui-loader spinner
  log:           boolean,    // legacy logging hook, currently a no-op
  passHeaderToken: boolean,  // ignored — the token is always attached
  isFile:        boolean = false   // true ⇒ responseType 'blob' (downloads)
): Observable<any>
```

Typical call:

```ts
this.api.callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
  .subscribe((res: any) => {
    if (res.status == 200) { this.rows = res.data; }
  });
```

There are also thin `POST_API` / `GET_API` / `PUT_API` / `DELETE_API` helpers used
in a few older components. Prefer `callApi`.

### Response envelope

The HTTP status is almost always 200. **The real status is inside the body:**

```jsonc
{ "status": 200, "message": "Data fetched successfully", "data": [ … ] }
```

So components branch on `res.status == 200`, not on HTTP codes. Errors arrive as
`{ status: 400|403|500, message: "…" }` with HTTP 200.

### Session expiry

Any response carrying `status == 403`, from any of the request paths or from the
`catchError` handler, calls `ApiService.callSessionTimeOutComponent()`. That pushes
onto a `Subject`, which `SessionTimeOutComponent` (declared in `AppModule`, always
in the DOM) is subscribed to. It opens a blocking modal; confirming clears
`localStorage` and sends the user to `environment.appLoginUrl`.

```
any API call ──► res.status == 403 ──► refreshSubject.next()
                                              │
                            SessionTimeOutComponent opens modal
                                              │
                            localStorage.clear() → appLoginUrl
```

### Cross-component messaging on `ApiService`

`ApiService` doubles as a small event bus — worth knowing because it is not obvious:

| Member | Purpose |
|--------|---------|
| `addRoute(v)` / `getRouteSubject$` | Breadcrumb/heading coordination |
| `addButtonValue(v)` / `getAddButtonValue$` | Show/hide the page-level **Add** button |
| `getRefreshSessionTimeOutObservable()` | Session-expiry signal |

## Supporting services

| Service | Responsibility |
|---------|----------------|
| `FormValueStorageService` / `UserFormValueStorageService` | Remembers list filters/paging so returning from a detail screen restores state. Cleared on navigation away — see the `protectedRoutes` array in each list component. |
| `LocalStorageService` | Typed wrapper over `localStorage` |
| `CompanyLogoService` | Resolves and caches the tenant logo |
| `ChatNotificationCountService` | Unread badge counts; also `logout()` / `chatBotHide()` |
| `CommonNotificationService` | In-app notification feed |
| `ExcelService`, `DownloadFileService`, `ChunkService` | Export and large-download handling |
| `ModalService` | Shared ngx-bootstrap modal helpers |
| `IpAddressService` | Client IP, stamped onto create/update payloads as `createByIp` / `updateByIp` |
| `ProfileStatusService`, `FilterStatusService` | Cross-component UI state |
| `CameraService` | Webcam capture for punch-in photos |
| `NationalityListService`, `ConstantService` | Static reference data |

## Realtime

`ChatService` opens socket.io connections to `environment.chatUrl`. The
`ChatNotificationComponent` is rendered inside every authenticated page and shows
chat plus live notification counts. Help Desk (`tickets/`) has its own chat views
layered on the same service.
