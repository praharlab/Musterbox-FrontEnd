# Firebase: what's pending

> Status: Firebase is **kept** during the Angular upgrade · Decided 2026-09-24
> Related: [10-angular-migration-plan.md §4.4](10-angular-migration-plan.md#44-firebase-is-leftover-template-code-️)

The app is still wired to Firebase (`@angular/fire` 6.1.5 + `firebase` 8.10.1, upgraded from 6.0.2 / 7.15.5 at the Angular 12 step), but no Firebase project is configured yet: every field in `environment.firebase` is empty except `apiKey`. The plan is to create real Firebase credentials later and fill them in here.

## 1. When you have Firebase credentials

Fill in the `firebase` block in **both** files:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

```ts
firebase: {
  apiKey: '...',
  authDomain: '<project>.firebaseapp.com',
  databaseURL: '',
  projectId: '<project>',
  storageBucket: '<project>.appspot.com',
  messagingSenderId: '...',
  appId: '...',
  measurementId: '...',
},
```

⚠️ **Don't simply overwrite `apiKey`.** The current value is also used as an **encryption key** for data in `sessionStorage`:

- `src/app/services/form-value-storage.service.ts` → `private encryptionKey = environment.firebase.apiKey;`
- `src/app/services/user-form-value-storage.service.ts` → same line

Before you change `apiKey`, move the current value to its own setting and point both services at it:

```ts
// environment.ts and environment.prod.ts
storageEncryptionKey: '<current firebase.apiKey value, unchanged>',
```

```ts
// both storage services
private encryptionKey = environment.storageEncryptionKey;
```

Also add `storageEncryptionKey: string;` to the interface at the top of `environment.prod.ts`. Because the key comes from `sessionStorage`, a change only logs out or resets saved form state for open tabs, but keeping it separate stops a Firebase key rotation from silently breaking encryption.

## 2. Deadline: this must be settled before the Angular 16 step

`@angular/fire` 6 is published in the old View Engine format. It compiles today only through `ngcc`, which **Angular 16 removes**. So by **Phase 4** of the migration plan, one of these must be done:

| Option | Work |
|---|---|
| **A. Upgrade** `@angular/fire` → current (20.x) + `firebase` → current | Full API rewrite: `AngularFireModule.initializeApp()` becomes `provideFirebaseApp(() => initializeApp(...))` + `provideAuth(() => getAuth())`; `AngularFireAuth` becomes the modular `Auth` + `signInWithEmailAndPassword(auth, ...)` functions |
| **B. Remove** Firebase | Delete the modules and `AuthService` (see §3), keep `storageEncryptionKey` |

Decide which by the end of Phase 3. Upgrading `@angular/fire` has to happen in steps alongside Angular (fire 7 needs Angular 12+ and `firebase` 9; later majors track Angular), so option A is easier if it starts early.

## 3. Where Firebase is used today

| File | Usage |
|---|---|
| `src/app/app.module.ts` | `AngularFireModule.initializeApp(environment.firebase)` |
| `src/app/views/views.module.ts` | `AngularFireAuthModule`, `AngularFireAuthGuardModule` |
| `src/app/shared/auth.service.ts` | Wraps `AngularFireAuth` (`signIn`, `signOut`, `register`, password reset). Injected into sidebar, topnav, pop-up-menu, register, forgot-password, `auth.guard.ts` |
| `views/app/masters/profilephotolockunlock/…component.ts` | `import { loggedIn } from '@angular/fire/auth-guard'` |
| `form-value-storage.service.ts`, `user-form-value-storage.service.ts` | `apiKey` used as the encryption key (see §1) |

**Known console error until this is done:** opening `#/user/register` logs `Uncaught Error: Your API key is invalid` from Firebase Auth, because `AuthService` creates `AngularFireAuth` with the placeholder `apiKey`. The page still renders and works. Real credentials (option A) or removing Firebase (option B) makes it go away.

Login currently goes through the backend API, not Firebase. Confirm this with the backend team before choosing option B.

_Done 2026-09-24:_ the unused `import { analytics } from 'firebase'` lines in `add-tds-slab`, `add-tax-challan`, `add-quater-tax-challan` and `add-form16` were deleted (they broke the build with `firebase` 8).
