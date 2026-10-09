# 06 · Module Catalogue

Every top-level entry under `src/app/views/app/`, what it is for, and who uses it.
Route prefix is `/#/app/`.

Legend for **Who**: `SA` Super Admin · `Sub` Sub Admin · `D` Dealer ·
`CA` Company Admin/HR · `E` Employee

---

## Platform administration

### `superadminmenus` — Admin Menu  ·  Who: SA (Sub/D see a trimmed version)
The product-owner console. 45+ global masters:

* **Tenancy** — Company, Company Type, Company Document, Company Progress, Company Training, Company Service Status
* **Commercial** — Subscription Plan (Product Master), Subscription Plan Analytics, Dealer, Dealer Plan, Lead
* **Platform users** — Super Admin, Sub Admin, Sub-admin Company mapping, Authorization Master, Org Authorization Type
* **Permission catalogue** — Form Master, Operation Master, Module List, Module Details
* **Templates** — Mail Template Type, Mail Fields, Letter Template, Letter Fields
* **Finance reference** — Bank, Bank Branch, PT Master, Pay Head Master, Leave Master
* **Tax reference** — Income Tax Slab Master, Income Tax Slabs, Tax Rebate, Tax Standard Deduction, Form 16
* **Ops** — Biometric Integration, AI Biometric, App Version, Document List, District, Resignation Reason, HR Toolkit, Tracking Outage Category, Total Punch-in All Company

### `masters` — Master  ·  Who: CA (permissioned)
~90 company-scoped configuration screens. The backbone of every other module.

| Group | Screens |
|-------|---------|
| Org structure | Company Master, Company Contact, Branch, Department, Division, Designation, Grade, Project, Site, Working Area, Working Location, Job Role Classification |
| People | Employee Master (+ ~50 sub-screens), Employee Joining, Employee Resignation, Employee ID Card, Profile Photo Lock/Unlock, Digital Signature |
| Time policies | Shift, Week-off Policy, Holiday Policy, Attendance Policy, Late/Early Policy, Short-leave Policy, Attendance Correction Reason, Leave Types |
| Pay policies | Salary Policy, HR Salary Fields, Bonus Policy, Attendance Bonus Policy, Food Allowance Policy, Incentive Type, Penalty, Service Charge, Minimum Wages |
| Finance masters | Expense Category, Expense Head, Office Expense Category/Head, Deposit Category, Bank Statement Format |
| Assets | Asset Master, Asset Category |
| External parties | Customer, Contractor, Visitor, Visit Purpose, Meeting Place, Product |
| Documents | Joining Document Type, Designation-wise Document, NDA Category |
| Bulk tools | `bulk-add-*` for shift, salary policy, holiday, week-off, leave policy, bonus, division, project, working area, skill category, attendance policy, opening leave balance, branch/job update |

---

## Employee-facing

| Module | Route | Purpose | Who |
|--------|-------|---------|-----|
| `dashboards` | `/dashboards` | `analytics` (employee/HR landing), `default` (platform landing), `punch-in-today` | all |
| `userprofile` | `/userprofile` | The signed-in user's own profile | E, CA |
| `me` (`masters/employee_master/performance`) | `/me` | Personal self-service hub | E, CA |
| `tasks` | `/tasks` | Task master, my tasks, daily task, task stages, team daily reporting, task dashboard and four analytics charts | E, CA |
| `checklists` | `/checklists` | Checklist master, questions, admin view, user checklist | E, CA |
| `moodTrackers` | `/moodTrackers` | Mood tracker master, my sentiments, sentiment dashboard, sentiment report | E, CA |
| `tickets` | `/tickets` | Help desk: ticket, categories, sub-categories, all tickets, live chat, dashboard | E, CA |
| `list-user-request-box` | `/reuqestInbox` | Consolidated approvals inbox *(note the route spelling)* | CA, managers |
| `notification` | `/notification` | Notification feed | all |
| `change-password` | `/changepassword` | Self-service password change | all |

---

## Time & attendance

### `attendances` — `/attendances` · CA, E
Attendance master, attendance list, my attendance summary, employee attendance
list and calendar, manual attendance, monthly attendance entry, attendance
correction + its authorization, outdoor duty (mine / team / admin), bulk and
import short-leave, leave application, leave balance, leave authorization
request, leave cancel, company leave data, compensatory-off (mine + authorization),
extra-days authorization, shift roster import (plain and reportee-wise),
biometric user, biometric list, biometric attendance sync.

### `overtimes` — `/overtimes` · CA, E
Overtime master, overtime entry and request, overtime calculation, company
overtime data, daily OT report, consolidated and user-wise OT reports.

### `gatepasses` / `employee-gatepass` — `/gatepasses`, `/employeegatepasses` · CA, E
Visitor gate pass (master, entry, dashboard) and employee gate pass
(my gate pass, request, authorization).

### `visits` — `/visits` · field staff
Visit master, visit entry, tour, admin tour, next visit schedule, call follow-up,
visit call follow-up, my team visit, daily vehicle usage report.

---

## Payroll & finance

### `payrolls` — `/payrolls` · CA
Payroll master, employee list, employee salary structure, previous salary,
attendance calculation, date-wise attendance policy, pay-slip generator,
salary slip, bulk salary-slip download, e-mail salary slip, my payslip,
my salary, employee bonus, bonus payment, pending/paid bonus, employee
incentive, leave encashment, add / manage leave balance, lapse leave, manage
comp-off, manage penalty, extra days, week-off shuffle, employee policy,
employee status, ID cards, employee NDA, employee accident, announcements,
joining requests, customize profile, HR dashboard, HR toolkit, F&F.

### `finances` — `/finances` · CA, E
Expense (request, claim, payment, paid list), advance payment (two generations)
and advance-expense payment, loan master and user-wise loans, deposits
(+ user-wise), penalty (+ user-wise), employee penalty, office expense
(+ advance, request, category rights), incentives, team advance requests,
ERP account master + ERP sync, SN codes, shared view components.

### `income-tax` — `/incometax` · CA, E
Income-tax master, declarations (employee + request flow), investments,
tax regime (mine + employee), monthly TDS deductions, declaration report,
TDS section / sub-section / category / limit, Form 16.

### `form16s` — `/form16s` · CA
Form 16 master, employee investment, tax challan, quarterly tax challan,
TDS slab, Form 16 report.

### `fnf` — Full & Final
Settlement list, reachable from Payroll.

---

## Talent lifecycle

| Module | Route | Contents |
|--------|-------|----------|
| `preboardings` | `/preboardings` | Job posting, job application, pre-boarding master, pre-boarding, pre-boarding form (public, customizable fields) |
| `offboardings` | `/offboardings` | Off-boarding master, user resignation, resignation list, resignation task |
| `pms` | `/pms` | KRA, KPI, goal, goal setting, employee goal, goal review (+ request, report), performance review (+ report, verify answers), review form, designation-wise goal review report, PMS policy |
| `skillsets` | `/skillsets` | Skillset master, skillset form, field skillset form, monthly skillset form, user skillset form, skillset reports |
| `myteam` | `/myteam` | My team master, company structure (org chart), user tracking |

---

## Organisation & governance

### `orgs` — `/orgs` · CA
Org master, **Roles** (add/edit/clone/list), **Assign Role**, **Permission View**,
**Authorization** (+ import, list auth details, replace auth details,
organization authorization), policy documents, anonymous feedback, change
password, team location tracking, location tracking summary, tracking dashboard.

### `assets` — `/assets` · CA, E
Asset master, assign asset to employee (add/edit), my assets.

### `utilitys` — `/utilitys` · CA
Letter generation — offer, appointment, joining, increment, experience,
termination, discrepancy — plus letter and mail editor templates, auto-mail
setup, notification setup, notification policy, ERP integration, audit logs.

---

## Reporting

### `reports` — `/reports` · CA
~65 operational reports. Main families:

* **Attendance** — daily (3 variants), monthly, register, timing, hourly, slot-wise, in-out, miss-punch, late/early, correction, five-minute-gap, daily counts by department / shift-department, weekoff-day work, tale attendance
* **Leave** — leave report, balance, balance summary, update, short-leave application, outdoor duty
* **Payroll** — salary register (3 variants), wages salary register, wages sheet, hourly salary register, monthly/employee month-wise salary, salary summary, monthly salary summary, increment, per-day cost, labour bill, service charges bill, bonus
* **Statutory** — PF report + data, ESIC report + challan, ESIC-with-OT, professional tax register, LWF challan
* **Finance** — expense, expense claim, expense-MARS, office expense, advance, loan, deposit, penalty
* **Other** — asset, NDA, consolidated, completed tenure, employee reports-to, user document expiry, visit (+ customer, summary), tracking (+ distinct locations), km

### `govtreports` — `/govtreports` · CA
Statutory registers and forms: Form 1, 4, 5, 7, 11, 14, 18, 21, 28, 29, A, B, C,
D, ER-01; adult workers register, identity card register, muster roll, in-out
attendance register, attendance data report, LWF report.

---

## Cross-cutting shared modules

| Folder | Role |
|--------|------|
| `common-filter` | The shared multi-dimension filter bar used by reports |
| `attendance-common` | Leave and comp-off accept/reject modals |
| `finance-common` | Expense, advance and loan reject/accept modals |
| `request-common` | Shared request list/detail views |
| `replace-pipe.ts`, `safe.pipe.ts` | String replace and `DomSanitizer` bypass pipes |
