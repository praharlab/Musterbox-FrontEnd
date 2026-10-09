# 05 · UI Walkthrough

The app has a small number of screen **archetypes**. Learn these five and you can
predict how any of the ~600 screens behaves.

> The wireframes below are drawn from the actual templates. The richer,
> colour-coded versions of the same diagrams are in the shared HTML edition of
> this pack.

---

## 1 · Login — `/#/user/login`

A split-screen: a branded gradient panel on the left, the form on the right.
Source: [`views/user/login/login.component.html`](../src/app/views/user/login/login.component.html)

```
┌──────────────────────────────────┬──────────────────────────────────────┐
│                                  │                                      │
│    ╭────────────────────────╮    │                                      │
│    │   login-hero.svg       │    │        Welcome back                  │
│    │   (floating animation) │    │        Sign in to your account       │
│    ╰────────────────────────╯    │        to continue                   │
│                                  │                                      │
│       Smart Payroll              │   Email / Mobile ─────────────────   │
│       Management                 │   ┌────────────────────────────┐     │
│                                  │   │ Enter Email                │     │
│       <subline copy>             │   └────────────────────────────┘     │
│                                  │                                      │
│   (teal gradient + mesh          │   Password ──────────────────────    │
│    pattern, radial glow)         │   ┌───────────────────────┬────┐     │
│                                  │   │ Enter password        │ 👁  │     │
│                                  │   └───────────────────────┴────┘     │
│                                  │                     Forgot password? │
│                                  │   ┌────────────────────────────┐     │
│                                  │   │          LOGIN             │     │
│                                  │   └────────────────────────────┘     │
└──────────────────────────────────┴──────────────────────────────────────┘
        .login-left-panel (46%)              .login-right-panel
```

Behaviour worth knowing:

* The username label is dynamic — `LoginPageLabel` comes from `constants/labelUtils.ts`,
  so the field can read *Email*, *Mobile* or *Employee Code* per deployment.
* The submit button is `<app-state-button>`, which renders its own spinner from
  `buttonState`. The component adds a body class `login-fullbleed` on init and
  removes it on destroy, so only this page escapes the shared `.container`.
* `ngOnInit` also calls `chatNotificationCountService.logout()` and `sessionStorage.clear()`.
* On success → `localStorage` written → redirect by user type (see [02](02-getting-started.md)).
* `LoginGuard` on this route bounces an already-authenticated user straight to their dashboard.

**Sibling public pages** (same `views/user/` module, no app shell):
`register`, `forgot-password`, `reset-password`, `resetpassword`, `otp`,
`preboardingform`, `submit-form`, `job-posting-data`, `apply-job`, `network`.

---

## 2 · The application shell — everything under `/#/app/…`

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ▤  [company logo]     🔍 search…        🔔  💬  📥  🌐  👤 Name ▾       │ ← app-topnav
├──────────┬──────────────────────────────────────────────────────────────┤
│          │                                                              │
│ 🏠 Home  │   Company                                     [ + ADD NEW ]  │ ← app-list-page-header
│ 👤 Me    │   Home › Master › Company                                    │ ← app-breadcrumb
│ ✅ Task  │  ──────────────────────────────────────────────────────────  │
│ ⚙ Master │                                                              │
│ 📍 Visit │        <router-outlet>  — the feature screen                 │
│ 👥 Team  │                                                              │
│ 💰 Fin.  │                                                              │
│ 🏢 Org   │                                                              │
│ 🕐 Att.  │                                                     ┌──────┐ │
│ 📦 Asset │                                                     │ 💬   │ │ ← app-chat-notification
│ 💵 Pay   │                                                     └──────┘ │
│   ⋮      │                                                              │
├──────────┴──────────────────────────────────────────────────────────────┤
│  © Musterbox                                                            │ ← app-footer
└─────────────────────────────────────────────────────────────────────────┘
   app-sidebar
```

* The sidebar is a **two-level fly-out**: clicking a top-level icon swaps the
  second panel to that module's sub-items. Both levels are permission-filtered.
* `SidebarService.containerClassnames` on `#app-container` encodes the whole
  responsive state (`menu-default`, `menu-sub-hidden`, `main-hidden`, …).
  Breakpoints come from `environment.subHiddenBreakpoint` (1440) and
  `menuHiddenBreakpoint` (768).
* Top-nav carries: tenant logo (`CompanyLogoService`), global search
  (`auth/v1/user-pages`), notification bell, chat, the **Request Inbox** badge
  (`leaveauthorizationRequest/v1/countpending`), language switcher, and a profile
  menu with *Profile · Change Password · Logout* (logout = `localStorage.clear()`).

### What each role sees in the sidebar

```
 Super Admin (2)        Sub Admin (3)         Dealer (4)        Employee / HR (0,1)
 ┌──────────────┐       ┌──────────────┐      ┌──────────┐      ┌──────────────────┐
 │ Dashboard    │       │ Dashboard    │      │ Company  │      │ Home             │
 │ Admin Menu ▸ │       │ Company      │      └──────────┘      │ Me               │
 │   Company    │       └──────────────┘                        │ Task             │
 │   Comp. Type │                                               │ Master           │
 │   Subscript. │       (menu is hard-coded                     │ Visit            │
 │   Bank / PT  │        in menu.ts —                           │ My Team          │
 │   Templates  │        no permission                          │ My Finances      │
 │   Form / Op  │        filtering for                          │ Org              │
 │   Super/Sub  │        types 2, 3, 4)                         │ Attendance       │
 │   Admin      │                                               │ Asset            │
 │   Tax slabs  │                                               │ Payroll          │
 │   Modules    │                                               │ Overtime         │
 │      ⋮       │                                               │ Pre/Off-boarding │
 └──────────────┘                                               │ Reports          │
                                                                │ Govt. Report     │
                                                                │ Gate Pass        │
                                                                │ Skillsets        │
                                                                │ Help Desk        │
                                                                │ CheckList        │
                                                                │ PMS              │
                                                                │ Utility          │
                                                                │ MoodTracker      │
                                                                │ Income Tax       │
                                                                │ Emp. Gate Pass   │
                                                                └──────────────────┘
                                                                  ▲ filtered by
                                                                    finalcheckpermission
```

---

## 3 · The LIST screen — the archetype you will meet most

Every master follows this shape. Reference implementation:
[`masters/company_master/list-company-master`](../src/app/views/app/masters/company_master/list-company-master/)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Company                                                 [ + ADD NEW ]  │  app-list-page-header
│  Home › Master › Company                                                │  (ADD renders only if
│                                                                         │   permissioncreate.length)
├─────────────────────────────────────────────────────────────────────────┤
│ ╭─ card ───────────────────────────────────────────────────────────────╮│
│ │ Select fields to show      From date      To date                    ││
│ │ ┌──────────────────────┐  ┌──────────┐  ┌──────────┐                 ││
│ │ │ ▾ CompanyName ×  …   │  │ dd/mm/yy │  │ dd/mm/yy │                 ││  filter card
│ │ └──────────────────────┘  └──────────┘  └──────────┘                 ││
│ │   [ Submit ]  [ Clear ]        [ Export ]                            ││
│ ╰──────────────────────────────────────────────────────────────────────╯│
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────┬────────────┬───────────────┬──────────┬────────┬──────────────┐ │
│ │Logo │Company Name│Company Email  │City      │Status  │Actions       │ │
│ ├─────┼────────────┼───────────────┼──────────┼────────┼──────────────┤ │
│ │ 🏢  │ ACME Ltd   │ hr@acme.com   │ Pune     │[Active]│ 👁 ✏ 🗑 👥    │ │  ngx-datatable
│ │ 🏢  │ Globex     │ hr@globex.in  │ Mumbai   │[Active]│ 👁 ✏ 🗑 👥    │ │
│ │ 🏢  │ Initech    │ hr@initech.co │ Nashik   │[ Inact]│ 👁 ✏ 🗑 👥    │ │
│ └─────┴────────────┴───────────────┴──────────┴────────┴──────────────┘ │
│                                                                         │
│   Show [ 10 ▾ ] per page                       ◀  1  2  3  4  5  ▶      │
└─────────────────────────────────────────────────────────────────────────┘
```

The moving parts, all of which repeat verbatim across modules:

| Element | Implementation |
|---------|----------------|
| Header + Add button | `<app-list-page-header [showadd]="permissioncreate">` |
| Breadcrumb | `<app-breadcrumb>` inside the header component |
| **Column chooser** | `tabledata` = every available column; `selected` = visible ones; each `<ngx-datatable-column>` carries `*ngIf="selected.includes('X')"` |
| Date range + search | `body = { page, limit, startdate, enddate, searchQuery, companyMasterID }` |
| Grid | `<ngx-datatable [rows]="rows" [externalPaging]="true">` |
| Page size | `ItemOptionsPerPageArray` = `[5, 10, 20, 50, 100, 200]` from `constants/CommonFilterFields.ts` |
| Paging | **Server-side.** `page` / `limit` go to the API; `page.totalCount` comes back |
| Status toggle | Green *Active* / red *Inactive* pill → `…/statuschange` |
| Delete | `sweetalert2` confirm → `…/deletebyid` |
| Export | Excel / CSV / PDF via `exceljs`, `ngx-csv`, `jspdf`, `file-saver` |
| Filter persistence | `FormValueStorageService` keeps filters when you drill into a row; a `NavigationStart` subscription with a `protectedRoutes` allow-list clears them otherwise |
| Permission gating | `checkpermission()` populates `permissioncreate/edit/view/delete`; templates use `*ngIf="permissionX.length"` |

For the bigger reports there is a shared **`<app-common-filter>`**
([`views/app/common-filter/`](../src/app/views/app/common-filter/)) driven by the
enums in `constants/CommonFilterFields.ts`:

```
┌──────────────────────────────────────────────────────────────────────┐
│ Company ▾  Branch ▾  Department ▾  Designation ▾  Division ▾         │
│ Working Area ▾  User ▾  Status ▾  Project ▾  Skill Category ▾        │
│ Salary Type ▾  Employment Type ▾                                     │
│  [ Submit ] [ Clear ] [ Excel ] [ CSV ] [ PDF ] [ Import ] [ Mail ]  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 4 · The ADD / EDIT screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Add Company                                                            │
│  Home › Master › Company › Add                                          │
├─────────────────────────────────────────────────────────────────────────┤
│ ╭─ card ───────────────────────────────────────────────────────────────╮│
│ │  Company Name *            Company Email *                           ││
│ │  ┌────────────────────┐    ┌────────────────────┐                    ││
│ │  └────────────────────┘    └────────────────────┘                    ││
│ │  Country ▾                 State ▾              City ▾               ││   cascading ng-selects
│ │  ┌──────────┐              ┌──────────┐         ┌──────────┐         ││
│ │  └──────────┘              └──────────┘         └──────────┘         ││
│ │                                                                      ││
│ │  Company Logo         ┌────────────┐                                 ││
│ │  [ Choose file ]      │  preview   │                                 ││
│ │                       └────────────┘                                 ││
│ │  ── fields visible only to usertype 2 / 3 / 4 ─────────────────────  ││
│ │  Parent Company ▾     Subscription Plan ▾                             ││
│ ╰──────────────────────────────────────────────────────────────────────╯│
│                                            [ Cancel ]   [ Submit ]      │
└─────────────────────────────────────────────────────────────────────────┘
```

* **Template-driven forms** throughout — `<form #addform="ngForm">` + `ngModel`,
  with `@ViewChild('addform') addform: NgForm`. Reactive forms are *not* used.
* Validation is `required` attributes plus a `if (!this.addform.valid) return;` guard.
  Some screens add manual checks before submit.
* Cascading dropdowns are wired by hand: country → `statemaster/v1/getbycountryid/:id`
  → `citymaster/v1/getbgetCityBystateIdyid/:id`.
* File uploads switch the payload to `FormData` (see `add-company-contact`).
* Every create/update payload carries audit fields: `createBy` / `updateBy`
  (= `localStorage.getItem('id')`) and `createByIp` / `updateByIp` (from `IpAddressService`).
* Role-conditional fields are plain `*ngIf="usertype == 2"` in the template.
* Success → toast via `angular2-notifications` → `router.navigate([adminRoot + '/…'])`.

**Bulk variants.** Many masters have a sibling `bulk-add-*` screen and an Excel
import pipeline: `generateDemoExcel` → user fills it → `validateExcel` →
`revalidate*` → `addValidate*` → `uploadexcel`. Demo templates live in `src/assets/*.xlsx`.

---

## 5 · Dashboards

**Analytics dashboard** (`/app/dashboards/analytics`) — the landing page for
employees and company admins:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Good morning, Priya                            📅 22 Sep 2026          │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│ │ ⏱ Punch In    │ │ 🌴 Leave Bal. │ │ ✅ My Tasks   │ │ 📥 Pending    │ │
│ │   09:14 AM    │ │   12.5 days   │ │   6 open      │ │   4 approvals │ │
│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ │
│ ┌──────────────────────────────────┐ ┌──────────────────────────────┐   │
│ │  Attendance trend  (line chart)  │ │  Birthdays & anniversaries   │   │
│ │      ╱╲    ╱╲                    │ │  🎂 Rahul — today            │   │
│ │  ╱╲ ╱  ╲  ╱  ╲                   │ │  🎉 Sneha — 3 yrs            │   │
│ └──────────────────────────────────┘ └──────────────────────────────┘   │
│ ┌──────────────────────────────────┐ ┌──────────────────────────────┐   │
│ │  Leave split (doughnut)          │ │  Announcements               │   │
│ └──────────────────────────────────┘ └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

Fed by `auth/v1/dashboard1`, `auth/v1/birthday`, `auth/v1/anniversary`,
`auth/v1/work-anniversary/:id`, `auth/v1/dashboardcheck`.

**Default dashboard** (`/app/dashboards/default`) is the platform view for
Super Admin and Sub Admin — company counts, subscription analytics, punch-ins
across all companies. Note the template split:

```html
<div *ngIf="usertype == 2 || usertype == 3">  …platform widgets… </div>
<div *ngIf="usertype != 2 && usertype != 3"> …empty state…      </div>
```

Sources: `companymaster/v1/superadmin_dashboard`, `getCompanyAnalyticsData`,
`getCompanySubscriptionPlanAnalyticsData`, plus *Total Punch-in All Company*.

Other dashboards: **HR Dashboard** (payrolls), **Task Dashboard**,
**Ticket Dashboard**, **Gatepass Dashboard**, **Tracking Dashboard**,
**Sentiment Analysis Dashboard**.

---

## 6 · Approval / request screens

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Leave Authorization Request                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌────────────┬──────────┬────────────┬───────┬─────────┬──────────────┐ │
│ │ Employee   │ Type     │ From – To  │ Days  │ Status  │ Action       │ │
│ ├────────────┼──────────┼────────────┼───────┼─────────┼──────────────┤ │
│ │ Rahul S.   │ Casual   │ 24–25 Sep  │  2    │ Pending │ [✓] [✗] [👁] │ │
│ │ Sneha P.   │ Sick     │ 26 Sep     │  1    │ Pending │ [✓] [✗] [👁] │ │
│ └────────────┴──────────┴────────────┴───────┴─────────┴──────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼  click ✓ or ✗
        ┌────────────────────────────────────────────────┐
        │  Approve leave — Rahul S.                   ✕  │
        │                                                │
        │  Leave balance after approval:  10.5 days      │
        │  Remark ┌────────────────────────────────┐     │
        │         └────────────────────────────────┘     │
        │                      [ Cancel ]  [ Approve ]   │
        └────────────────────────────────────────────────┘
          attendance-common/leave-accept-reject-modal
```

The accept/reject modals are shared components so the same dialog appears in the
Request Inbox, the module screen and the dashboard widget:

* [`attendance-common/`](../src/app/views/app/attendance-common/) — leave, comp-off
* [`finance-common/`](../src/app/views/app/finance-common/) — expense, advance, loan
* [`request-common/`](../src/app/views/app/request-common/) — generic request views

---

## 7 · Specialised screens

| Screen | What makes it different |
|--------|-------------------------|
| **Employee Master** | ~50 sub-screens (address, education, family, documents, salary, policies, reports-to, letters…) behind a tabbed profile |
| **Company Structure / Org chart** | `@dabeng/ng-orgchart` tree render |
| **Attendance Calendar** | `@fullcalendar/angular` month grid with per-day status colouring |
| **PMS goals** | Syncfusion Kanban board |
| **Letter / Mail templates** | `ngx-quill` rich-text editor with insertable merge fields from *Letter Fields* / *Mail Fields* |
| **Employee tracking / Visits** | `@agm/core` Google Map with route playback (`travel-marker`) |
| **Pre-boarding form** | Public, dynamically generated from *Customize Field* config; supports signature pad, image and PDF field types |
| **Payslip / Form 16** | PDF generation (`pdfmake`, `jspdf`) plus `ng2-pdf-viewer` preview and bulk e-mail |
| **ID card** | `html2canvas` / `dom-to-image` snapshot plus QR code (`@techiediaries/ngx-qrcode`) |
| **Help Desk** | socket.io ticket chat |

---

## Screenshot checklist

If you later want real screenshots dropped into this pack, capture these in order
and save them as `docs/images/NN-name.png`:

```
01-login.png                   06-dashboard-analytics.png
02-shell-sidebar.png           07-dashboard-superadmin.png
03-list-company.png            08-request-inbox.png
04-add-company.png             09-roles-matrix.png
05-common-filter.png           10-employee-master-tabs.png
```
