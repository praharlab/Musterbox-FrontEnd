import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-deposit',
    templateUrl: './list-deposit.component.html',
    styleUrls: ['./list-deposit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListDepositComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('addrefund') addrefund: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode.force;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected: string[] = ['DepositCategoryName', 'UserName', 'Amount', 'DateOfDeposit', 'DepositReceiveAS'];
  tabledata = [
    'DepositCategoryName',
    'UserName',
    'Amount',
    'DateOfDeposit',
    'DepositReceiveAS',
    'Description',
    // 'RefundDate',
    // 'RefundRemarks',
    // 'RefundMode',
    'salaryMonth',
    // 'depositPayAs',
    // 'salaryMonthToPay',
    // 'Status',
    'CreateBy',
    'CreatedAt',
    'updateBy',
    'UpdatedAt',
  ];
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    searchQuery: '',
    companyMasterID: +localStorage.getItem('company_id'),
    userMasterID: null,
    branchMasterID: null,
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  ipAddress: any;
  depositid: any;
  currentPage: number;
  formValue: any;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]
  commonFilterData: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/finances/deposit',
          this.adminRoot + '/finances/deposit/edit_deposit',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListDepositComponent', false);
          formValueStorageService.removeData('commonFilterData', true);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListDepositComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        startdate: '',
        enddate: '',
        searchQuery: '',
        companyMasterID: +localStorage.getItem('company_id'),
        userMasterID: null,
        branchMasterID: null,
      };
    } else {
      this.filterData = this.formValue.ListDepositComponent.body;
    }

    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.filterData.companyMasterID = +localStorage.getItem('company_id');

    this.checkpermission();

    this.selected = ['DepositCategoryName', 'UserName', 'Amount', 'DateOfDeposit', 'DepositReceiveAS'];

  }

  getdepositcategory() {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.DEPOSITBYCOMPANYDATA, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.spinner.stop('oninit2');
            this.rows = res.data.rows;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('oninit2');
        },
      );
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Deposit' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Deposit' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Deposit' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Deposit' && permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getdepositcategory();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getdepositcategory();
    }
  }

  onSubmit(val?: any) {
    this.commonFilterData = val;
    this.filterData.companyMasterID = val?.company;
    this.filterData.branchMasterID = val.branch;

    this.filterData.startdate = val.startdate;
    this.filterData.enddate = val.enddate;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;

    this.getdepositcategory();
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getdepositcategory();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getdepositcategory();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/finances/deposit/add_deposit']);
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
          depositId: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEDEPOSITDATA, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.getdepositcategory();
            this.spinner.stop('confirm');
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('confirm');
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
          depositId: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.DEPOSITSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getdepositcategory();
              this.spinner.stop('deactive');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('deactive');
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
          depositId: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.DEPOSITSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getdepositcategory();
              this.spinner.stop('active');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('active');
            },
          );
      }
    });
  }

  clear() {
    this.formValue = this.formValueStorageService.getData();
    this.commonFilterData = null;
    this.rows = []
    this.selected = ['DepositCategoryName', 'UserName', 'Amount', 'DateOfDeposit', 'DepositReceiveAS'];
    this.filterData = {
      page: this.formValue.ListDepositComponent?.body?.page ? this.formValue.ListDepositComponent?.body?.page : 1,
      limit: this.formValue.ListDepositComponent?.body?.limit ? this.formValue.ListDepositComponent?.body?.limit : 10,
      startdate: '',
      enddate: '',
      searchQuery: '',
      companyMasterID: +localStorage.getItem('company_id'),
      userMasterID: null,
      branchMasterID: null,
    };

    this.formValueStorageService.removeData('ListDepositComponent', false);
  }

  changeshowfields() {
    this.getdepositcategory();
  }
  depositdata(data: any) {
    this.depositid = data.depositId;
  }

  refundSubmit() {
    let body = {
      depositId: this.depositid,
      refundRemarks: this.addrefund.value.refundRemarks,
      refundDate: this.addrefund.value.refundDate,
      refundMode: this.addrefund.value.refundMode,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.api.callApi(this.constant.UPDATEDEPOSITDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();
          this.ngOnInit();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/finances/deposit']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });

          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });

        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListDepositComponent',
      this.filterData,
      '/finances/deposit/edit_deposit',
      rowData.depositId,
    );
  }

  getCompany(val: any){
    this.filterData.companyMasterID = val
    this.getdepositcategory()
  }
  
  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
