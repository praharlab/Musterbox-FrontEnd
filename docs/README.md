# Musterbox HRMS — Knowledge Transfer Pack

Everything a new engineer needs to become productive on this codebase, from
"what is this product" down to "how do I add a screen".

Read the numbered documents in order the first time. After that, use them as reference.

| # | Document | What it answers |
|---|----------|-----------------|
| 01 | [Product overview](01-product-overview.md) | What the product does, who uses it, how the tenancy model works |
| 02 | [Getting started](02-getting-started.md) | Clone → run → log in. Node version, build scripts, environments |
| 03 | [Architecture](03-architecture.md) | Module graph, routing, the API layer, session handling, layout shell |
| 04 | [Roles & permissions](04-roles-and-permissions.md) | Super Admin / Sub Admin / Dealer / Company Admin / Employee, and the three separate access layers |
| 05 | [UI walkthrough](05-ui-walkthrough.md) | Annotated wireframes of every screen archetype |
| 06 | [Module catalogue](06-module-catalogue.md) | All 30 feature modules, what lives in each |
| 07 | [Backend API](07-backend-api.md) | URL conventions, auth, response envelope, resource inventory |
| 08 | [Adding a screen](08-adding-a-screen.md) | The exact recipe, copy-paste ready |
| 09 | [Gotchas & glossary](09-gotchas-and-glossary.md) | The traps that cost a new dev a day each |
| 10 | [Angular upgrade plan](10-angular-migration-plan.md) | Phased plan for moving from Angular 10 to 22 |

## The 60-second version

**Musterbox** is a multi-tenant HRMS + payroll SaaS for Indian businesses. One
deployment serves many companies; companies can have child companies.

* **Frontend** (this repo) — Angular 10 SPA, hash routing, ~30 lazy-loaded feature modules.
* **Backend** — separate Node/REST service. The frontend talks to it through one
  service ([`ApiService`](../src/app/services/api.service.ts)) and one endpoint
  catalogue ([`ConstantService`](../src/app/services/constant.service.ts), ~2,000 endpoints).
* **Auth** — backend-issued JWT in `localStorage`. Everything else (menu, buttons,
  data scope) is derived from a numeric *user type* plus a form × operation permission matrix.

```
┌──────────────────────────────────────────────────────────────┐
│  Browser (Angular 10 SPA)                                    │
│                                                              │
│   views/user/*   ──login──►  auth/v1/login                   │
│        │                          │                          │
│        │                     JWT + admin(usertype)           │
│        ▼                          ▼                          │
│   views/app/*  ◄── menu ── auth/v1/finalcheckpermission      │
│        │                                                     │
│        └── ApiService ──Bearer token──► REST backend         │
│                                          │                   │
│                       socket.io ─────────┤  chat             │
│                       biometricApiUrl ───┘  device sync      │
└──────────────────────────────────────────────────────────────┘
```

> These documents describe the code as it stands on branch `local`.
> Where the code does something surprising, the doc says so rather than
> describing the intent — see [09-gotchas](09-gotchas-and-glossary.md).
