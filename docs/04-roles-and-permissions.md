# 04 · Roles, Permissions & Authorization

This is the part of the system newcomers most often get wrong. There are
**three independent access-control layers**. They have different data, different
screens and different APIs.

```
┌───────────────────────────────────────────────────────────────────────┐
│ LAYER 1 — USER TYPE          localStorage 'usertype'  (0…4)           │
│ Which application am I in? Which menu tree is built? Where do I land?  │
├───────────────────────────────────────────────────────────────────────┤
│ LAYER 2 — ROLE / PERMISSION  form × operation matrix                  │
│ Which menu items and which Add/Edit/View/Delete buttons do I get?      │
├───────────────────────────────────────────────────────────────────────┤
│ LAYER 3 — AUTHORIZATION      approval chains                          │
│ Whose leave / expense / overtime / gate-pass requests do I approve?    │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Layer 1 — User type

One numeric field. The backend calls it `admin` in the login response; the
frontend stores it as `usertype` in `localStorage`.

| Value | Persona | Created from | Lands on | Menu |
|:-----:|---------|--------------|----------|------|
| **0** | **Employee / User** | Masters → Company Contact (*Is Admin* unchecked) → `admin: '0'` | `/app/dashboards/analytics` | Full tree, **filtered by permissions** |
| **1** | **Company Admin (HR)** | Masters → Company Contact (*Is Admin* checked) → `admin: '1'` | `/app/dashboards/analytics` | Full tree, **filtered by permissions** |
| **2** | **Super Admin** | Super Admin menu → Super Admin → Add → `admin: '2'` | `/app/dashboards/default` | Dashboard + **Admin Menu** (`/superadminmenus`) |
| **3** | **Sub Admin** | Super Admin menu → Sub Admin → Add → `admin: '3'` | `/app/dashboards/default` | Dashboard + **Company** (`/masters/company_master`) |
| **4** | **Dealer** | Super Admin menu → Dealer → Add → `admin: 4` | `/app/masters/company_master` | **Company** only |

All five are created through the same endpoint, `companycontact/v1/…` — the
`admin` field is what differentiates them.

### Where each value is read

| File | What it does with `usertype` |
|------|------------------------------|
| [`shared/login.guard.ts`](../src/app/shared/login.guard.ts) | Decodes the JWT (`jwtDecode(token).token.userType`) and bounces an already-logged-in user away from `/user/*` to their landing page |
| [`views/user/login/login.component.ts`](../src/app/views/user/login/login.component.ts) | Writes `localStorage` and routes by `res.data.admin` |
| [`constants/menu.ts`](../src/app/constants/menu.ts) | Returns a different menu array for `2`, for `3`, and for everything else |
| [`constants/headerItems.ts`](../src/app/constants/headerItems.ts) | Same, for the horizontal/top menu variant (2,321 lines — the full `/superadminmenus` sub-tree lives here) |
| [`containers/layout/sidebar/sidebar.component.ts`](../src/app/containers/layout/sidebar/sidebar.component.ts) | Builds the sidebar; **only types 0 and 1 go through permission filtering** |
| Individual list components | `checkpermission()` — types 2/3/4 short-circuit to "allow everything" |

### The recurring code shape

You will see this guard everywhere. It reads as "if this is a platform-level
admin, skip permission checks entirely":

```ts
if (this.usertype != 2 && this.usertype != 3 && this.usertype != 4) {
  // real permission lookup
} else {
  this.permissioncreate = [1];
  this.permissionedit   = [1];
  this.permissionview   = [1];
  this.permissiondelete = [1];
}
```

> **Note for types 2/3/4:** because the UI grants everything, the *backend* is the
> only thing scoping a Sub Admin (3) to their assigned companies
> (`companymaster/v1/getCompanyDataSubAdmin`) and a Dealer (4) to theirs.

---

## Layer 2 — Roles and permissions (types 0 and 1)

### The data model

```
   Form Master                  Operation Master
   (one row per screen)         (Create · Edit · View · Delete)
        │                              │
        └──────────────┬───────────────┘
                       ▼
                 Role Master            ← Org → Roles
              (a set of form×operation
               checkboxes, per company)
                       │
                  Assign Role           ← Org → Assign Role
                       │
                       ▼
                    User                → roleMasterID on the user record
```

* **Form Master** (`formmaster/v1/…`, Super Admin → Form) is the catalogue of
  screens. Each row has a `formName` and a `parentFormMasterID` list (parent → child menu).
* **Operation Master** (`operation/v1/…`, Super Admin → Operation) holds the verbs.
* **Role Master** (`roleMaster/v1/…`) is a company-scoped named bundle of
  form × operation pairs. Built in **Org → Roles → Add**, which renders the form
  tree with a checkbox per operation, plus **Clone Role** to copy an existing one.
* **Assign Role** (`roleMaster/v1/AssignRoleMaster`) attaches a role to users.
* **Permission View** (`orgs/permission-view`) renders the effective matrix for review.

### How permissions reach the UI

One endpoint does it all:

```
POST auth/v1/finalcheckpermission
Body:     { "userMasterID": "<localStorage 'id'>" }
Response: { "status": 200, "data": [
              { "formName": "Company", "formMasterID": 12, "operationName": "View"   },
              { "formName": "Company", "formMasterID": 12, "operationName": "Create" },
              { "formName": "Payroll", "formMasterID": 31, "operationName": "View"   }
           ] }
```

It is called **twice over**, and by different consumers:

**(a) Sidebar — decides which menu items exist.**
In `SidebarComponent.ngOnInit()` the static menu from `getMenu()` is filtered so
that only items whose `menu` property matches a returned `formName` survive. Child
`subs` are filtered the same way, and the matching `formMasterID` is copied onto
the menu item.

```ts
let menu = this.menuItems.filter(menu => {
  if (menu.subs) {
    menu.subs = menu.subs.filter(m1 => formdata.some(x => x.formName === m1.menu));
  }
  const matched = formdata.find(x => x.formName === menu.menu);
  if (matched) { menu.formMasterID = matched.formMasterID; }
  return !!matched;
});
```

> ⚠️ **The `menu:` key in `menu.ts` must exactly equal the backend's `formName`.**
> A mismatch makes the menu item silently vanish. This is the single most common
> "my new screen doesn't show up" cause.

**(b) Each screen — decides which buttons render.**
Every list component has its own `checkpermission()` that calls the same endpoint
and filters by its own form name:

```ts
this.permissioncreate = permission.filter(p =>
  p.formName == 'Company' && p.operationName.includes('Create'));
```

Templates then gate on array length:

```html
<button *ngIf="permissioncreate.length" (click)="add()">Add</button>
<a      *ngIf="permissionedit.length"   (click)="edit(row)">Edit</a>
<a      *ngIf="permissiondelete.length" (click)="alertConfirmation(row.id)">Delete</a>
```

### Failure behaviour

If the permission call errors, the sidebar **keeps the unfiltered menu** rather
than leaving the user with no navigation:

```ts
() => {
  // Permission lookup failed. Keep the unfiltered menu rather than
  // leaving the user with no navigation at all …
  this.spinner.stopLoader('loader-02');
}
```

So a menu that shows everything can mean "permission API is down", not "this user
is an admin".

---

## Layer 3 — Authorization (approval chains)

Completely separate from Layer 2. This is workflow, not UI gating.

**Where:** Org → **Authorization** (`/app/orgs/authorization`), with
*Import Authorization*, *List Auth Details*, *Replace Auth Details* and
*Organization Authorization* alongside it.

**What it defines:** for a given request type and a given employee (or
branch/department/designation slice), who the approver is — and in what order,
for multi-level sign-off.

```
Employee applies for leave
        │
        ▼
 leaveauthorizationRequest/v1/…  creates a request
        │
        ▼
 Level 1 approver  ──approve──►  Level 2 approver  ──approve──►  Approved
        │                              │
      reject                         reject
        ▼                              ▼
     Rejected                       Rejected
```

**Request types with their own authorization endpoints:**

| Request | Endpoint family |
|---------|-----------------|
| Leave | `leaveauthorizationRequest/v1/*` — `getbyuserid`, `authorizationacceptreject`, `leavecancellist`, `leavecancel`, `countpending` |
| Expense / Advance / Loan | `authorizationRequest/v1/*` — `expenseauthorizationrequestbyuserid1`, `authorizationacceptrejectexpenseall` |
| Overtime | `authorizationRequest/v1/*` — `viewauthorizationrequestbyuseridforovertime`, `authorizationacceptrejectovertime` |
| Compensatory off / Extra days | `attendances/compensatory-off-authorization-request`, `extra-days-authorization-master` |
| Attendance correction | `attendances/attendance-correction-authorization` |
| Gate pass | `employeegatepasses/gatepass-authorization` |
| Goal / performance review | `pms/goal-review-request`, `pms/review-request` |
| Income-tax declaration | `incometax/income-tax-declaration-request` |
| Form-level authorization | `formAuthorizationDetails/v1/*` |

**Where approvals surface in the UI:**

* **Request Inbox** — `/app/reuqestInbox` (`list-user-request-box`) — the consolidated queue.
* The `user-request-box` widget in the top nav, with a pending badge from
  `leaveauthorizationRequest/v1/countpending`.
* Per-module screens: *Leave Authorization Request*, *Overtime Request*,
  *Expense Request*, *Gatepass Authorization*, and shared accept/reject modals in
  `attendance-common/` and `finance-common/`.

> **Reports-to vs Authorization.** *Reports-to* (Employee Master → Reports To) is
> the org hierarchy used for team views and dashboards. *Authorization* is the
> approval routing. They often match, but they are configured separately and one
> does not imply the other.

---

## Putting it together — a worked example

*Priya is an HR executive at ACME Ltd. She should manage employees and approve leave,
but must not delete companies.*

| Layer | Setting |
|-------|---------|
| 1 · User type | Created in **Masters → Company Contact** with *Is Admin* **checked** → `usertype = 1`. `company_id = ACME`. |
| 2 · Role | **Org → Roles → Add** — create "HR Executive": `EmployeeMaster` = Create/Edit/View, `Company` = View only (no Delete), `Payroll` = View. Then **Org → Assign Role** → Priya. |
| 3 · Authorization | **Org → Authorization → Add** — for Department = Operations, Leave, Level 1 approver = Priya. |

Result at runtime:

* `menu.ts` returns the full employee menu (she is not 2/3/4).
* Sidebar calls `finalcheckpermission`, keeps only items whose `menu` matches a
  granted `formName` → she sees Home, Me, Master, Payroll, Attendance…
* On **Company Master** her `permissiondelete` array is empty → the Delete icon
  never renders.
* Operations-team leave requests land in her **Request Inbox** with the pending badge.

---

## Quick reference

| I want to… | Go to |
|------------|-------|
| Create a platform admin | Super Admin → Super Admin / Sub Admin / Dealer |
| Create a company user or HR | Masters → Company Contact (*Is Admin* = company admin) |
| Define what a job function can see | Org → Roles |
| Give a user that job function | Org → Assign Role |
| Check what a user actually has | Org → Permission View |
| Register a new screen for permissioning | Super Admin → Form (Form Master) |
| Define who approves what | Org → Authorization |
| See pending approvals | Request Inbox (`/app/reuqestInbox`) |
