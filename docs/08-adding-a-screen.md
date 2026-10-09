# 08 · Adding a Screen — the recipe

Worked end-to-end for a fictional **Vendor Master** under the *Master* menu.
Follow the same eight steps for any new CRUD screen.

---

## Step 0 · Register the form in the backend catalogue

Before writing any code, a Super Admin must create the screen in
**Super Admin → Form (Form Master)** with `formName = "VendorMaster"` and the
operations Create / Edit / View / Delete.

**This is not optional.** The sidebar filter and every `checkpermission()` call
match on `formName`. Skip it and your menu item will never render for a normal
user, and the buttons never appear.

---

## Step 1 · Endpoints in `ConstantService`

`src/app/services/constant.service.ts` — append under a new comment header:

```ts
  // vendormaster
  LISTVENDOR        = 'vendormaster/v1/getalldata';
  CREATEVENDOR      = 'vendormaster/v1/add';
  VIEWVENDOR        = 'vendormaster/v1/getbyid/';
  UPDATEVENDOR      = 'vendormaster/v1/updatebyid';
  DELETEVENDOR      = 'vendormaster/v1/deletebyid';
  VENDORSTATUSCHANGE = 'vendormaster/v1/statuschange';
```

---

## Step 2 · Folder layout

Mirror the existing masters exactly:

```
src/app/views/app/masters/vendor_master/
├── vendor-master.module.ts
├── vendor-master-routing.module.ts
├── list-vendor-master/
│   ├── list-vendor-master.component.ts | .html | .scss
├── add-vendor-master/
│   ├── add-vendor-master.component.ts  | .html | .scss
└── edit-vendor-master/
    └── edit-vendor-master.component.ts | .html | .scss
```

Generate with the local CLI:

```bash
npx ng g module views/app/masters/vendor_master/vendor-master --routing --flat
npx ng g component views/app/masters/vendor_master/list-vendor-master
npx ng g component views/app/masters/vendor_master/add-vendor-master
npx ng g component views/app/masters/vendor_master/edit-vendor-master
```

---

## Step 3 · Feature routing module

`vendor-master-routing.module.ts`:

```ts
const routes: Routes = [
  { path: '',             component: ListVendorMasterComponent },
  { path: 'add_vendor',   component: AddVendorMasterComponent  },
  { path: 'edit_vendor',  component: EditVendorMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorMasterRoutingModule {}
```

---

## Step 4 · Feature module

Copy the import list from a neighbouring master — these are the ones a list +
form screen actually needs:

```ts
@NgModule({
  declarations: [ListVendorMasterComponent, AddVendorMasterComponent, EditVendorMasterComponent],
  imports: [
    CommonModule,
    FormsModule,
    VendorMasterRoutingModule,
    NgxDatatableModule,               // the grid
    NgSelectModule,                   // dropdowns
    PagesContainersModule,            // app-list-page-header, app-heading, app-breadcrumb
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule,        // toasts
    NgxUiLoaderModule,                // spinner
    TranslateModule,
    CommonFilterModule,               // only if you use the shared filter bar
  ],
})
export class VendorMasterModule {}
```

---

## Step 5 · Hang it off the parent route

`src/app/views/app/masters/masters.routing.ts`:

```ts
{
  path: 'vendor_master',
  loadChildren: () =>
    import('./vendor_master/vendor-master.module').then(m => m.VendorMasterModule),
},
```

---

## Step 6 · Menu entries

**Sidebar** — `src/app/constants/menu.ts`, inside the `data2 != 2 && data2 != 3` array
(or as a `subs` entry under an existing item):

```ts
{
  icon:  'assets/menuIcons/masterIcon.svg',
  label: 'Vendor',
  menu:  'VendorMaster',              // ⚠️ MUST equal the backend formName
  to:    `${adminRoot}/masters/vendor_master`,
}
```

**Top menu** — add the matching entry to `src/app/constants/headerItems.ts`.
The two files are maintained in parallel; forgetting one leaves the item missing
in that layout mode.

---

## Step 7 · The list component

```ts
export class ListVendorMasterComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  ColumnMode = ColumnMode;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;      // [5,10,20,50,100,200]
  adminRoot = environment.adminRoot;
  usertype: any;

  tabledata = ['VendorName', 'Email', 'Phone', 'CreateBy', 'CreatedAt'];
  selected  = ['VendorName', 'Email', 'Phone'];

  body = {
    page: 1, limit: 10,
    startdate: '', enddate: '', searchQuery: '',
    companyMasterID: localStorage.getItem('company_id'),
  };
  page = { totalCount: 0, offset: 0 };

  permissioncreate: any = [];
  permissionedit:   any = [];
  permissionview:   any = [];
  permissiondelete: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: NotificationsService,
  ) {}

  ngOnInit(): void {
    this.usertype = +localStorage.getItem('usertype');
    this.checkpermission();
    this.getData();
  }

  checkpermission(): void {
    if (this.usertype != 2 && this.usertype != 3 && this.usertype != 4) {
      const body = { userMasterID: localStorage.getItem('id') };
      this.api.callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            const p = res.data;
            const forForm = (op: string) =>
              p.filter(v => v.formName == 'VendorMaster' && v.operationName.includes(op));
            this.permissioncreate = forForm('Create');
            this.permissionedit   = forForm('Edit');
            this.permissionview   = forForm('View');
            this.permissiondelete = forForm('Delete');
          }
        });
    } else {
      this.permissioncreate = this.permissionedit =
      this.permissionview   = this.permissiondelete = [1];
    }
  }

  getData(): void {
    this.api.callApi(this.constant.LISTVENDOR, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalCount;
        }
      });
  }

  setPage(pageInfo): void {
    this.body.page = pageInfo.offset + 1;
    this.getData();
  }

  alertConfirmation(id): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This record will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
    }).then(result => {
      if (result.value) {
        this.api.callApi(this.constant.DELETEVENDOR, { vendorMasterID: id }, 'POST', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare,
                { theClass: 'outline primary', timeOut: 3000 });
              this.getData();
            }
          });
      }
    });
  }
}
```

Template skeleton:

```html
<app-list-page-header name="Vendor" [showadd]="permissioncreate"
                      [showOrderBy]="false" [showDisplayMode]="false">
</app-list-page-header>

<div class="card mb-4">
  <div class="card-body">
    <!-- column chooser + date range + Submit/Clear/Export -->
  </div>
</div>

<ngx-datatable [rows]="rows" [externalPaging]="true" [count]="page.totalCount"
               [limit]="itemsPerPage" (page)="setPage($event)"
               [columnMode]="ColumnMode.force" [scrollbarH]="true"
               [rowHeight]="50" [footerHeight]="100" [headerHeight]="50">

  <ngx-datatable-column name="Vendor Name" prop="vendorName"
                        *ngIf="selected.includes('VendorName')"></ngx-datatable-column>

  <ngx-datatable-column name="Action">
    <ng-template let-row="row" ngx-datatable-cell-template>
      <a *ngIf="permissionedit.length"   (click)="edit(row)">✏</a>
      <a *ngIf="permissiondelete.length" (click)="alertConfirmation(row.vendorMasterID)">🗑</a>
    </ng-template>
  </ngx-datatable-column>
</ngx-datatable>
```

---

## Step 8 · The add / edit component

```ts
@ViewChild('addform') addform: NgForm;

onSubmit(): void {
  if (!this.addform.valid) { return; }

  const body = {
    ...this.addform.value,
    companyMasterID: localStorage.getItem('company_id'),
    status:     '1',
    createBy:   localStorage.getItem('id'),
    createByIp: this.ipAddress,            // from IpAddressService
  };

  this.api.callApi(this.constant.CREATEVENDOR, body, 'POST', true, true, true)
    .subscribe((res: any) => {
      if (res.status == 200) {
        this.notifications.create('Done', res.message, NotificationType.Bare,
          { theClass: 'outline primary', timeOut: 3000 });
        this.router.navigate([this.adminRoot + '/masters/vendor_master']);
      } else {
        this.notifications.create('Error', res.message, NotificationType.Error,
          { theClass: 'outline primary', timeOut: 3000 });
      }
    });
}
```

Template-driven forms only:

```html
<form #addform="ngForm" (ngSubmit)="onSubmit()" novalidate>
  <label class="form-group has-float-label">
    <input class="form-control" name="vendorName" ngModel required />
    <span>Vendor Name</span>
  </label>
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
```

---

## Checklist before you raise the PR

- [ ] Form registered in **Form Master** with the operations you gate on
- [ ] `menu:` in `menu.ts` **exactly equals** the backend `formName`
- [ ] Entry added to **both** `menu.ts` and `headerItems.ts`
- [ ] Endpoints in `ConstantService`, none inlined in the component
- [ ] Route lazy-loaded from the parent feature routing module
- [ ] `checkpermission()` present, with the 2/3/4 short-circuit
- [ ] Buttons gated with `*ngIf="permissionX.length"`
- [ ] `companyMasterID` included in every list/create payload
- [ ] Audit fields (`createBy`, `createByIp`) on create; `updateBy`/`updateByIp` on update
- [ ] `res.status == 200` checked (not the HTTP status)
- [ ] Delete goes through a `Swal.fire` confirm
- [ ] Spinner started and stopped on every branch, including errors
- [ ] Tested as usertype 0/1 **with restricted permissions**, not just as an admin

---

## Common mistakes

| Symptom | Cause |
|---------|-------|
| Menu item missing for normal users, visible for admins | `menu:` ≠ backend `formName` |
| Buttons never appear | Form or operations not created in Form Master |
| Item appears in the sidebar but not the top menu | Added to `menu.ts` only, not `headerItems.ts` |
| Data from other tenants leaks in | `companyMasterID` omitted from the request body |
| Spinner never stops | `spinner.stop()` missing from the error branch |
| "Works for me" but not for the customer | Tested only as usertype 2 |
| Paging always shows page 1 | `[externalPaging]="true"` set but `(page)` not wired to `setPage` |
