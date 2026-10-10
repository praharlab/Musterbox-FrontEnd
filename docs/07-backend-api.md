# 07 · Backend API

> The backend lives in a **separate repository**. This chapter documents the API
> contract exactly as this frontend consumes it — derived from
> [`ConstantService`](../src/app/services/constant.service.ts) (2,645 lines) and
> [`ApiService`](../src/app/services/api.service.ts). Where it says "the backend
> does X", read it as "the frontend depends on X".

## Services the frontend talks to

| Service | Base URL (env key) | Protocol |
|---------|--------------------|----------|
| **Main REST API** | `environment.apiUrl` — dev `http://localhost:3210/`, prod `http://13.204.149.192:3210/` | HTTPS/JSON |
| **Biometric service** | `environment.biometricApiUrl` — dev `http://localhost:3510/`, prod `https://www.MusterBox/` | HTTPS/JSON |
| **Chat / notifications** | `environment.chatUrl` | socket.io (WebSocket) |
| **Static uploads** | `environment.apiUrl + 'uploads/…'` | HTTP GET |

## URL convention

```
<baseUrl><resource>/v<n>/<action>[/<id>]
```

Examples:

```
POST   companymaster/v1/add
GET    companymaster/v1/getalldata
GET    companymaster/v1/getbyid/42
POST   companymaster/v1/updatebyid
POST   companymaster/v1/deletebyid
POST   companymaster/v1/statuschange
GET    companymaster/v2/getalldata          ← v2 exists for a few resources
```

Two things surprise newcomers:

1. **`POST` is used for reads.** Most list endpoints are POST because the filter
   payload (paging, dates, company scope) goes in the body.
2. **`v1`/`v2`/`v3` coexist per resource.** `authorizationRequest` has `v1` and `v3`;
   `companymaster` has `v1` and `v2`. The newer one is not always the one in use —
   check `ConstantService` for which constant a screen actually references.

### The standard CRUD verb set

| Action | Method | Notes |
|--------|--------|-------|
| `add` / `post<Add><Entity>` | POST | Create |
| `getalldata` / `list<Entity>` | POST or GET | List, usually paged |
| `getbyid/:id` / `get<Entity>ById/:id` | GET | Single record. Note the trailing slash in the constant — the id is concatenated. |
| `updatebyid` / `postUpdate<Entity>` | POST or PUT | Update; carries the id in the body |
| `deletebyid` | POST or DELETE | Delete |
| `statuschange` / `statuschanges` | POST | Active ⇄ Inactive toggle. **Both spellings exist** — copy the one in `ConstantService`. |

Naming is inconsistent across the codebase (older resources use lowercase
`getalldata`, newer ones use camelCase `listRoleMaster`). Always read the constant
rather than guessing the URL.

### The bulk-import pipeline

Masters that accept Excel upload expose a five-step family:

```
generateDemoExcel  →  (user fills the template)  →  validateExcel
                                                        │
                                                   revalidate<Entity>
                                                        │
                                                   addValidate<Entity>
                                                        │
                                                    uploadexcel
```

Example (`branchmaster`): `generateDemoExcel`, `validateExcel`,
`revalidateBranch`, `addValidateBranch`, `uploadexcel`.
Demo templates are also checked into `src/assets/*.xlsx`.

## Authentication

### Login

```http
POST {apiUrl}auth/v1/login
Content-Type: application/json

{ "phone": "9876543210", "password": "……" }
```

Response:

```jsonc
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token":           "<JWT>",
    "usermasterid":    123,
    "companyMasterID": 7,
    "admin":           "1",      // user type — see doc 04
    "childcompany":    "1",
    "resetpassword":   0,        // 1 ⇒ force password reset before entry
    "permission":      [ … ]
  }
}
```

The JWT payload is nested — `jwtDecode<CustomJwtPayload>(token).token.userType`
(see [`constants/loginGuardModel.ts`](../src/app/constants/loginGuardModel.ts)).

### Every subsequent request

```http
Authorization: Bearer <token from localStorage>
Content-Type: application/json
```

Attached automatically by `ApiService.headerInit()`. The `passHeaderToken`
parameter on `callApi` is vestigial — the token goes on either way.

### Auth resource (`auth/v1/…`)

| Endpoint | Purpose |
|----------|---------|
| `login` | Sign in |
| `forgot` / `reset` / `resetpassword` | Password recovery |
| `changepassword` / `changepasswordMultipleEmp` | Password change (self / bulk) |
| `forgotpasswordOtpMARS` / `checkPasswordTokenMARS` | OTP-based recovery variant |
| **`finalcheckpermission`** | The permission matrix for a user — drives the whole menu and every button |
| `profile/:id` | Profile info |
| `dashboard1` / `dashboardcheck` | Dashboard payloads |
| `birthday` / `anniversary` / `work-anniversary/:id` | Dashboard widgets |
| `user-pages` | Global search index for the top-nav search |

## Response envelope

```jsonc
{ "status": 200, "message": "…", "data": … }
```

**The HTTP status is almost always 200. The meaningful status is in the body.**
Components therefore branch on `res.status == 200`, never on HTTP codes.

| Body `status` | Meaning | Frontend behaviour |
|:---:|---|---|
| 200 | Success | `res.data` consumed |
| 400 | Validation / business error | `res.message` shown as an error toast |
| **403** | Token invalid or expired | **Session-timeout modal** → `localStorage.clear()` → `appLoginUrl` |
| 500 | Server error | Generic error toast |

The 403 handling is centralised in `ApiService` — every request path and the
`catchError` handler call `callSessionTimeOutComponent()`.

## Request-body conventions

Most list endpoints take:

```jsonc
{
  "page": 1,
  "limit": 10,
  "startdate": "2026-04-01",
  "enddate":   "2026-09-22",
  "searchQuery": "",
  "companyMasterID": "7"        // ← the tenant boundary, from localStorage
}
```

and return `{ status, message, data: [ … ], totalCount }`.

Create/update payloads always carry audit fields:

```jsonc
{
  "…entity fields…",
  "status":     "1",
  "createBy":   "123",           // localStorage 'id'
  "createByIp": "203.0.113.4",   // IpAddressService
  "updateBy":   "123",
  "updateByIp": "203.0.113.4"
}
```

File uploads switch to `multipart/form-data` via `FormData`.

## Downloads

`ApiService.callApi(url, body, 'GET'|'POST', …, isFile = true)` sets
`responseType: 'blob'`; the component then hands the blob to `file-saver`'s
`saveAs()`. Used for Excel exports, payslip PDFs, Form 16 and demo templates.

## Resource inventory

~245 distinct resource groups are referenced. Grouped by domain:

**Identity & access**
`auth` · `roleMaster` · `formmaster` · `operation` · `authorizationmaster` ·
`authorizationRequest` · `leaveauthorizationRequest` · `AuthorizationDetails` ·
`formAuthorizationDetails` · `authorizationCriteriaMasterRoutes` ·
`organizationAuthorization` · `orgAuthorizationType` · `userIp` · `menuClick` · `auditLogs`

**Tenancy & commerce**
`companymaster` · `companycontact` · `companytype` · `companyregister` ·
`companyProgress` · `companyTraining` · `companyServiceStatus` ·
`companyNotificationSetup` · `companywiseReport` · `productmaster` ·
`subscription` · `dealerPlan` · `leadMaster` · `moduleList` · `moduleDetails` ·
`appversion` · `corporation` · `MusterBoxDatabaseList`

**Org structure**
`branchmaster` · `department` · `division` · `designation` · `gradestructure` ·
`gradesalarystructure` · `project` · `site` · `workingArea` · `workingLocation` ·
`jobRoleClassification` · `reportTo` / `reportto` · `contractor` · `customer` ·
`countrymaster` · `statemaster` · `citymaster` · `district`

**Employee record**
`empJoining` · `empbranch` · `empdepartment` · `empdesignation` · `empshift` ·
`empweekoff` · `empholidaypolicy` · `empLeavePolicy` · `empShortLeavePolicy` ·
`empEmployeement` · `empdigitalsign` · `employeeDivision` · `employeeProject` ·
`employeeWorkingArea` · `employeeWorkingLocation` · `employeeSkillCategory` ·
`employeeRentedResidence` · `useraddress` · `usereducation` · `userexperience` ·
`userfamily` · `userskills` · `userdocument` · `uniform` · `customizeProfile` ·
`personalInformationForm` · `EmployeeNda` · `Ndacategory` · `employeeAccident`

**Time & attendance**
`attendanceTransaction` · `attendancepolicy` · `datewiseattendancepolicy` ·
`employeeattendancepolicy` · `attendanceCorrection` · `attendanceCorrectionRequest` ·
`attendanceCorrectionReason` · `mannualAttendance` · `LastFiveAttendance` ·
`shift` · `shiftRoster` · `weekoffpolicy` · `weekoffShuffle` · `holidayspolicy` ·
`LateEarlyPolicy` · `EmployeeLateEarlyPolicyRoutes` · `shortLeave` ·
`shortLeaveAuthorization` · `coffMaster` · `extraDays` · `extraDaysAuthorization` ·
`biometric` · `biometricUser` · `biometricintegration` · `aibiometric`

**Leave**
`userleave` · `userLeaveTransaction` · `userLapseLeave` · `hrleavetypes` ·
`hrLeaveBal` · `hrleavesmonthlytrans` · `leaveMaster` · `leaveEncashment`

**Payroll**
`salaryTrans` · `salarypolicy` · `employeesalarypolicy` · `salaryIncrement` ·
`previousSalary` · `payhead` · `hrSalaryMaster` · `hrsalaryfields` ·
`hrsalaryfieldchild` · `paySlipGenerator` · `minWagesMaster` · `serviceCharge` ·
`employeeBonus` · `employeeBonusPolicy` · `bonusPolicy` · `attendanceBonusPolicy` ·
`employeeattendancebonuspolicy` · `foodAllowancePolicy` ·
`employeeFoodAllowancePolicy` · `incentive` · `employeeincentive` ·
`overTime` · `overTimePolicy` · `userOverTimePolicyAssign` · `penalty` ·
`emppenalty` · `employeePayment` · `otherPayment` · `fnfProcess`

**Statutory & tax**
`pfsetup` · `esicsetup` · `professionaltaxsetup` · `professionataxmaster` ·
`form16` · `tdsslabmaster` · `tdsSection` · `tdsSubSection` ·
`tdsSubSectionCategory` · `tdsSubSectionLimit` · `incomeTaxSlabMaster` ·
`incomeTaxSlabs` · `taxRebate` · `taxStandardDeduction` · `taxchallanmaster` ·
`quartertaxchallan` · `employeeDeclaration` · `employeeTaxRegime` · `investmentdetails`

**Finance**
`userExpense` · `userExpenseTransaction` · `expensecategory` · `expensehead` ·
`expenseprice` · `expensePayment` · `OfficeExpense` · `officeExpenseCategory` ·
`officeExpenseHead` · `officeExpenseAdvance` · `officeExpenseAuthRequest` ·
`allocateOfficeExpense` · `advancePayment` · `loanmaster` · `deposit` ·
`depositCategory` · `bankmaster` · `bankBranch` · `bankStatementFormat` ·
`erpAccountMaster` · `erpIngegration` · `SN_Code`

**Work management**
`user_tasks` · `dailyTask` · `Tasks_Stages` · `taskRemark` · `visit` ·
`visitpurpose` · `visitors` · `visitReportMaster` · `visitReportCustomize` ·
`visitReportCustomizevalue` · `visitformcustomize` · `visitformcustomizevalue` ·
`meetingPlace` · `callfollowup` · `toursMaster` · `vehicleUsage` ·
`usertracking` · `Tracking` · `TrackingOutage` · `TrackingCategoryDetails` ·
`gatePass` · `employeeGatepass` · `assetMaster` · `assetcategory` · `assignasset`

**Talent**
`jobPosting` · `jobApplication` · `preboarding` · `preboardingrequest` ·
`preboardingDocument` · `preboardingformcustomize` · `preboardingformcustomizevalue` ·
`employeeJoiningRequest` · `joiningDocument` · `joiningDocumentType` ·
`designationWiseDocument` · `resignation` · `resignProcess` · `resignTaskAssign` ·
`resigantionReason` · `goal` · `goalSetting` · `employeeGoal` · `employeeGoalReview` ·
`kra` · `kpi` · `performanceReview` · `employeePerformanceReview` · `reviewForm` ·
`reviewFormAnswer` · `pmsPolicy` · `skillsets` · `skillSetsForm` · `monthlySkillsetsform`

**Communication & documents**
`announcement` · `userchats` · `userInbox` · `ticket` · `ticketCategory` ·
`ticketSubCategory` · `checkList` · `checkListQuestion` · `usercheckList` ·
`anonymousFeedback` · `sentimentPunchIn` · `mailconfig` · `mailTemplateType` ·
`mailTemplateEditor` · `mailFields` · `autoMailSetup` · `notificationPolicy` ·
`letterTemplateType` · `letterTamplateEditor` · `letterFields` · `letterhead` ·
`userLetters` · `offerLetter` · `appointmentLetter` · `joiningLetter` ·
`incrementLetter` · `userIncrementLetter` · `experienceLetter` ·
`terminationLetter` · `discrepancyLetter` · `employeeDiscrepancyLetter` ·
`policyDocument` · `documentlist` · `compdoc` · `compdoctype` · `hrToolKit`

**Reporting**
`report` (65+ actions) · `AdvanceReport` · `AssetReport` · `NdaReport` ·
`PenaltyReport` · `companywiseReport` · `common` · `product` · `updateBranchJob`

## Working with the API in this codebase

```ts
// 1. Add the endpoint to ConstantService, under the right // comment header
//    services/constant.service.ts
MYFEATURE_LIST = 'myFeature/v1/listMyFeature';

// 2. Call it — never inline the URL
this.api.callApi(this.constant.MYFEATURE_LIST, body, 'POST', true, false, true)
  .subscribe((res: any) => {
    if (res.status == 200) {
      this.rows = res.data;
      this.page.totalCount = res.totalCount;
    }
  });
```

Grep patterns that pay off:

```bash
# Which screens call this endpoint?
grep -rn "MYFEATURE_LIST" src/app

# What endpoints exist for a resource?
grep -n "myFeature/v1" src/app/services/constant.service.ts
```
