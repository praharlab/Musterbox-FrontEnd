# 02 · Getting Started

## Prerequisites

| Tool | Version | Why |
|------|---------|-----|
| **Node.js** | 14.x – 16.x | Angular 10 + `node-sass`-era tooling. Newer Node needs the legacy OpenSSL flag, which the npm scripts already pass. |
| **npm** | 6.x | `package-lock.json` is lockfileVersion 1. A `yarn.lock` also exists — pick one and stay with it. |
| **Angular CLI** | 10.0.x (local, via `node_modules`) | Do **not** run a globally installed newer CLI. |

`.browserslistrc` and `install_nvm.sh` are in the repo root if you need to match the original setup.

## Install and run

```bash
npm install          # or: yarn install
npm start            # dev server on http://localhost:4200, bound to 0.0.0.0
```

`npm start` expands to:

```
node --openssl-legacy-provider --max_old_space_size=8096 \
     node_modules/@angular/cli/bin/ng serve --host 0.0.0.0
```

Both flags matter:

* `--openssl-legacy-provider` — webpack 4 uses an MD4 hash that OpenSSL 3 rejects. Without it the build dies with `ERR_OSSL_EVP_UNSUPPORTED`.
* `--max_old_space_size=8096` — the app is large enough that the default heap runs out.

## Scripts

| Script | Command | Notes |
|--------|---------|-------|
| `npm start` | `ng serve --host 0.0.0.0` | Dev server, uses `environment.ts` |
| `npm run build` | `ng build` | Dev build → `dist/musterbox` |
| `npm run build:prod` | `ng build --configuration=production` | Swaps in `environment.prod.ts` |
| `npm run build:stage` | `ng build --configuration=staging` | ⚠️ **Broken** — no `staging` configuration exists in `angular.json` and there is no `environment.staging.ts`. See [09-gotchas](09-gotchas-and-glossary.md). |
| `npm test` | `ng test` | Karma + Jasmine. Spec files exist but are mostly the CLI's generated stubs. |
| `npm run lint` | `ng lint` | TSLint (deprecated, still configured via `tslint.json`) |
| `npm run format` | `npx prettier --write .` | Config in `.prettierrc` |

## Environments

Two files, swapped by the `production` file-replacement in `angular.json`:

`src/environments/environment.ts` (development)

```ts
production:        false
apiUrl:            'http://localhost:3210/'
biometricApiUrl:   'http://localhost:3510/'
chatUrl:           'http://localhost:3210'
appLoginUrl:       'http://localhost:4200/'
adminRoot:         '/app'
isAuthGuardActive: true
```

`src/environments/environment.prod.ts` (production)

```ts
production:        true
apiUrl:            'http://13.204.149.192:3210/'
biometricApiUrl:   'https://www.MusterBox/'
chatUrl:           'https://www.MusterBox'
appLoginUrl:       'http://www.MusterBox/'
adminRoot:         '/app'
isAuthGuardActive: false        // ← note: guards are effectively off in prod
```

### Every environment key, explained

| Key | Purpose |
|-----|---------|
| `apiUrl` | Base URL for **all** REST calls and for serving uploaded files (`apiUrl + 'uploads/company/logo/…'`) |
| `biometricApiUrl` | Separate service for biometric device integration |
| `chatUrl` | socket.io endpoint for chat and live notifications |
| `appUrl`, `appUrl1`, `appUrl2`, `appUrl3` | Public deep links generated and emailed out: pre-boarding form, submit-form, job posting, apply-job |
| `appLoginUrl` | Where the session-timeout modal sends the user |
| `adminRoot` | `/app` — the prefix for every authenticated route |
| `isAuthGuardActive` | Selects which of the three route tables in `views.routing.ts` is used. See [03-architecture](03-architecture.md). |
| `secretKeyForEncoding` | Shared secret used for client-side encoding of some payloads |
| `firebase` | AngularFire config — only the leftover template auth uses it |
| `defaultRole`, `defaultMenuType`, `defaultColor`, `themeColorStorageKey`, `subHiddenBreakpoint`, `menuHiddenBreakpoint`, `isDarkSwitchActive`, `isMultiColorActive`, `defaultDirection`, `themeRadiusStorageKey`, `buyUrl`, `SCARF_ANALYTICS` | Inherited from the **Vien** admin template. Theme/layout only; `defaultRole` is not the real role model. |

> **Pointing dev at a remote API:** edit `apiUrl` in `environment.ts`. There is no
> proxy config and no `.env` support — the URL is compiled into the bundle.

## First login

1. Start the backend (or point `apiUrl` at a running one).
2. Open `http://localhost:4200` → you land on `/#/user/login`.
3. The app posts to `auth/v1/login`. On success it writes to `localStorage` and redirects by user type:

| `admin` value in response | Redirect |
|---|---|
| `0`, `1` | `/app/dashboards/analytics` |
| `2`, `3` | `/app/dashboards/default` |
| `4` | `/app/masters/company_master` |
| any, with `resetpassword == 1` | `/user/resetpassword` (forced password change) |

### localStorage keys written at login

| Key | Value |
|-----|-------|
| `token` | JWT — attached as `Authorization: Bearer …` on every request |
| `user` | The whole login response object, JSON-stringified |
| `id` | `usermasterid` — the logged-in user's primary key |
| `company_id` | `companyMasterID` — the tenant |
| `usertype` | `admin` — 0/1/2/3/4 |
| `childcompany` | Whether child-company data is in scope |
| `resetID` | Only on the forced-password-reset path |

**Debugging tip:** to inspect the app as a different persona, change `usertype`
in `localStorage` and reload. The menu is rebuilt from it. (Data still comes from
the backend scoped by the real token, so this is for UI inspection only.)

## Routing is hash-based

`RouterModule.forRoot(routes, { useHash: true })` — all URLs carry a `#`:

```
http://localhost:4200/#/app/masters/employee
http://localhost:4200/#/user/login
```

This means no server rewrite rules are needed for deployment; `dist/musterbox`
can be served as plain static files.
