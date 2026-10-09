import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-subscription-plan',
    templateUrl: './list-subscription-plan.component.html',
    styleUrls: ['./list-subscription-plan.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListSubscriptionPlanComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  mediumDateFormat = environment.mediumDateFormat;
  rows1: any = [];
  permissioncreate = [1];
  rows2: any;

  editData: any;
  userrights: any = [];
  editrights: any = [];
  formdata: any;
  showMyContainer: boolean = false;
  companydata: any;
  filter: string;
  formValue: any;
  currentPage: number;
  limit = 10;
  searchValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,

    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          '/app/superadminmenus/company_subscription/add_company_subscription',
          '/app/superadminmenus/company_subscription/edit_company_subscription',
          '/app/superadminmenus/company_subscription',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListSubscriptionPlanComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListSubscriptionPlanComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: this.formValue.ListCompanyMasterComponent.id,
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListSubscriptionPlanComponent.body;
    }

    this.getCompanyName();
    this.getAllData();
  }

  getCompanyName() {
    this.api
      .callApi(
        this.constant.VIEWCOMPANYDATA + this.formValue.ListCompanyMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows2 = res.data;
        }
      });
  }

  getAllData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETSUBSCRIPTIONDATA, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;


          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.ngOnInit();
      this.filterData.searchQuery = '';
    } else {
      this.filterData.searchQuery = inputValue;
      this.filterData.companyMasterID = this.formValue.ListCompanyMasterComponent.id;
      this.getAllData();
    }
  }

  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.rows.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAllData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          companyPlanMasterID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETESUBSCRIPTION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          companyPlanMasterID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.SUBSCRIPTIONTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          companyPlanMasterID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.SUBSCRIPTIONTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }

  downloadFile() {
    let data = [];
    const data2 = {
      page: '',
      limit: '',
      companyMasterID: this.formValue.ListCompanyMasterComponent.id,
    };

    this.api
      .callApi(this.constant.GETSUBSCRIPTIONDATA, data2, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows1 = res.data;

          this.temp = [...this.rows1];

          for (var i = 0; i < this.rows1.length; i++) {
            const data1 = {
              productId: this.rows1[i].productMasterID,
              productName: this.rows1[i]['productMaster.productName'],
              startDate: this.rows1[i].startDate,
              endDate: this.rows1[i].endDate,
              TrackingUser: this.rows1[i].totalTracking,
              totalUser: this.rows1[i].totalUser,
              status: this.rows1[i].status,
              createdAt: this.rows1[i].createdAt,
              updatedAt: this.rows1[i].updatedAt,
            };
            if (data1.status == 1) {
              data1.status = 'Active';
            } else {
              data1.status = 'Deactive';
            }
            data.push(data1);
          }

          const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
          const header = Object.keys(data[0]);
          let csv = data.map((row) =>
            header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
          );
          csv.unshift(header.join(','));
          let csvArray = csv.join('\r\n');

          var blob = new Blob([csvArray], { type: 'text/csv' });
          saveAs(blob, 'subscription.csv');
        }
      });
  } //Subscription file

  view(id1: any) {
    this.formdata = [];

    this.spinner.start('loader-1');
    this.api.callApi(this.constant.VIEWFORMDATA, {}, 'GET', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.formdata = res.data;
          for (var i = 0; i < this.formdata.length; i++) {
            for (var j = 0; j < this.formdata[i].parentFormMasterID.length; j++) {
              this.formdata[i].parentFormMasterID[j].parentid = '';
              this.formdata[i].parentFormMasterID[j].disable = '';
            }
            this.formdata[i].parentid = '';
            this.formdata[i].disable = false;
          }

          for (var i = 0; i < this.formdata.length; i++) {
            this.formdata[i].status = false;
            for (var j = 0; j < this.formdata[i].parentFormMasterID.length; j++) {
              this.formdata[i].parentFormMasterID[j].status = false;
              for (var a = 0; a < this.formdata[i].parentFormMasterID[j].operation.length; a++) {
                this.formdata[i].parentFormMasterID[j].operation[a].status = true;
              }
            }
          }

          let id = id1;
          this.spinner.start('start');
          this.api
            .callApi(this.constant.VIEWPRODUCTDATA + id, {}, 'GET', true, true, true)
            .subscribe(
              (res: any) => {
                this.companydata = res.data;

                this.editrights = res.productPermission;
                this.userrights = this.editrights;

                if (this.editrights.length != 0) {
                  for (var i = 0; i < this.formdata.length; i++) {
                    for (var k = 0; k < this.editrights.length; k++) {

                      if (this.formdata[i].formMasterID == this.editrights[k].formMasterID) {
                        this.formdata[i].status = true;
                        this.formdata[i].parentid = this.editrights[k].formMasterID;
                      } else {
                      }
                    }
                  }
                  for (var i = 0; i < this.formdata.length; i++) {
                    for (var j = 0; j < this.formdata[i].parentFormMasterID.length; j++) {
                      for (
                        var a = 0;
                        a < this.formdata[i].parentFormMasterID[j].operation.length;
                        a++
                      ) {
                        for (var k = 0; k < this.editrights.length; k++) {
                          if (
                            this.formdata[i].parentFormMasterID[j].formMasterID ==
                            this.editrights[k].formMasterID &&
                            this.formdata[i].parentFormMasterID[j].operation[a].operationID ==
                            this.editrights[k].operationID
                          ) {
                            this.formdata[i].parentFormMasterID[j].parentid =
                              this.editrights[k].formMasterID;
                            this.formdata[i].parentFormMasterID[j].status = true;
                            this.formdata[i].parentFormMasterID[j].operation[a].operationselected =
                              this.editrights[k].operationID;
                            this.formdata[i].parentFormMasterID[j].operation[a].status = true;
                          }
                        }
                      }
                    }
                  }
                }

                this.showMyContainer = true;
                this.spinner.stop('start');
              },
              (err) => {
                console.log('error', err);
                this.spinner.stop('start');
              },
            );
        }
        this.spinner.stop('loader-1');
      },
      (err) => {
        console.log('error', err);
        this.spinner.stop('loader-1');
      },
    );
  }

  navigateToAddPage(): void {
    this.formValueStorageService.navigate(
      'ListSubscriptionPlanComponent',
      this.filterData,
      '/superadminmenus/company_subscription/add_company_subscription',
      this.formValue.ListCompanyMasterComponent.id,
    );
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListSubscriptionPlanComponent',
      this.filterData,
      '/superadminmenus/company_subscription/edit_company_subscription',
      rowData.companyPlanMasterID,
    );
  }
}
