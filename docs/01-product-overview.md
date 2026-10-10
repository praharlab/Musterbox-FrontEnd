# 01 · Product Overview

## What the product is

**Musterbox** is a multi-tenant **HRMS + Payroll + Workforce-management** SaaS
aimed at Indian businesses — factories, service companies and their contractors.

It is broad rather than deep: a single login covers the whole employee lifecycle.

> ### Other names you will see in the code
>
> Musterbox is the product name going forward. The codebase predates it and still
> carries earlier and per-customer names. None of these are different products:
>
> | Name | Where it appears | What it is |
> |------|------------------|------------|
> | **MusterBox** | The `MusterBoxNameLabel` variable, upload paths like `uploads/SalaryFace/`, backend routes like `MusterBoxDatabaseList/` | The product's previous name (*Salary* = wages, *patra* = document). Still baked into API paths, so it cannot be renamed from the frontend alone |
> | **MusterBox** | `environment.prod.ts` — `chatUrl`, `biometricApiUrl`, `appUrl`–`appUrl3`, `appLoginUrl` | **Live infrastructure.** A deployed domain, not branding. Do not rename it in code without a DNS and backend change |
> | **vien-angular** | `environment.ts` / `environment.prod.ts` — the `firebase` block (`vien-angular-login`) | The Vien admin template this project was scaffolded from. The project name is now `musterbox`; the Firebase ids still point at the template author's demo project |
> | **SN**, *Pacific International Hospital*, *Mars Consultancy*, *Harsha Engineering* | [`constants/labelUtils.ts`](../src/app/constants/labelUtils.ts) | **White-label customer brands.** `MusterBoxNameLabel` is the brand slot swapped per deployment |
>
> The product is white-labelled, so the customer-facing name is data, not a
> constant. Musterbox is the house brand that sits behind those labels.

```
        Hire ─────► Onboard ─────► Work ─────► Pay ─────► Exit
          │            │             │           │          │
     Pre-boarding  Employee      Attendance   Payroll   Off-boarding
     Job posting   master        Leave        Salary    Resignation
     Applications  Documents     Overtime     Bonus     F&F settlement
     Offer letter  ID card       Tasks        Incentive Exit letters
                   Assets        Visits       Expenses
                   Policies      Gate pass    Income tax / Form 16
                                 PMS / goals  Govt. reports
```

## Who uses it

| Persona | Typical job | Where they live in the app |
|---------|-------------|----------------------------|
| **Super Admin** | The product owner / Musterbox staff. Creates companies, subscription plans, global masters (banks, PT slabs, letter templates, tax slabs). | `/app/superadminmenus/*` |
| **Sub Admin** | Musterbox staff assigned a subset of companies (support / account management). | `/app/masters/company_master` |
| **Dealer** | Reseller / channel partner who onboards their own client companies. | `/app/masters/company_master` |
| **Company Admin (HR)** | HR or admin inside a customer company. Runs payroll, approves, configures company masters. | Full menu, filtered by permissions |
| **Employee** | Everyday staff. Punches in, applies for leave, files expenses, sees payslips. | Same menu, heavily filtered |

The last two share one UI. What separates them is not a different app but a
**permission matrix** — see [04-roles-and-permissions](04-roles-and-permissions.md).

## Tenancy model

```
                    ┌─────────────────┐
                    │   Super Admin   │   usertype 2
                    └────────┬────────┘
             ┌───────────────┼───────────────┐
             ▼               ▼               ▼
      ┌────────────┐  ┌────────────┐  ┌────────────┐
      │  Sub Admin │  │   Dealer   │  │  (direct)  │   usertype 3 / 4
      └──────┬─────┘  └──────┬─────┘  └──────┬─────┘
             └───────────────┼───────────────┘
                             ▼
                   ┌──────────────────┐
                   │  Company (tenant)│  companyMasterID
                   └────────┬─────────┘
                            │ parentCompanyID
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
      ┌───────────┐  ┌───────────┐  ┌───────────┐
      │ Child co. │  │ Child co. │  │ Child co. │
      └─────┬─────┘  └───────────┘  └───────────┘
            │
      ┌─────┴─────┬──────────┬──────────┐
      ▼           ▼          ▼          ▼
   Branch     Department  Division   Working area
      │
      ▼
  Employees (userMasterID, admin = 0 or 1)
```

* Every tenant is a row in **Company Master**, keyed by `companyMasterID`.
* A company may have **child companies** (`parentCompanyID`). The logged-in user's
  `childcompany` flag in `localStorage` controls whether child-company data is in scope.
* Nearly every list API takes `companyMasterID` in the request body — that is the
  tenant boundary. It comes from `localStorage.getItem('company_id')`.
* Relevant endpoints: `companymaster/v1/getCompanyByParentCompany`,
  `companymaster/v1/getCompanyTree`, `companymaster/v1/getCompanyDataSubAdmin`.

## The organisational spine

Most features hang off this set of master records. Learn these and the rest of
the product reads easily:

| Master | Meaning |
|--------|---------|
| **Company** | The tenant |
| **Branch** | A physical location of the company |
| **Department / Division / Designation / Grade** | Organisational classification of an employee |
| **Working Area / Working Location / Project / Site** | Where the employee is deployed |
| **Shift / Week-off policy / Holiday policy** | When the employee is expected to work |
| **Attendance policy / Late-early policy / Short-leave policy** | How presence is judged |
| **Salary policy / Pay heads / Grade structure** | How the employee is paid |
| **Leave types / Leave policy** | What the employee can take off |
| **Reports-to** | The approval hierarchy (who is whose manager) |
| **Role** | Which screens and buttons the employee can use |
| **Authorization** | Who signs off on the employee's requests |

> **Role ≠ Authorization.** A *role* controls what you can *see and click*.
> An *authorization* controls whose requests you *approve*. They are separate
> systems with separate screens and separate APIs. This trips up most newcomers.

## Integrations

| Integration | Where |
|-------------|-------|
| **Biometric devices** (punch data) | Separate base URL `environment.biometricApiUrl`; screens under Attendance → Biometric |
| **Chat / notifications** | socket.io against `environment.chatUrl`; `ChatService`, `ChatNotificationComponent` |
| **ERP sync** | Finance → ERP Integration / ERP Sync / ERP Account Master |
| **Google Maps** | `@agm/core` — employee tracking, visits, geo-fenced attendance |
| **Firebase** | Configured in `environment.firebase` but only used by the leftover template `AuthService`. Real auth is the backend JWT. |
