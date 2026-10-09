import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LoanRejectModalComponent } from '../../../finance-common/loan-reject-modal/loan-reject-modal.component';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import {
  CommonFilterButtonFields,
  CommonFilterFields,
  ItemOptionsPerPageArray,
} from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-list-loan-master',
    templateUrl: './list-loan-master.component.html',
    styleUrls: ['./list-loan-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListLoanMasterComponent implements OnInit {
  rejectionRemark: string;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('reject') reject: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild(LoanRejectModalComponent)
  loanRejectModalComponent: LoanRejectModalComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
  ];

  rows = [];
  temp = [];
  adminRoot = environment.adminRoot;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    searchQuery: '',
    companyMasterID: +localStorage.getItem('company_id'),
    userMasterID: [],
    branchMasterID: null,
  };
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  company: any;
  usertype: any;
  company_id: string;
  allbranch: any;
  alluser: any;
  selected1: any;
  nguser: any;
  ngbranch: any;
  loanid: any;

  selectedRow: any;
  setLoanPK: any;

  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/finances/loanMaster',
          this.adminRoot + '/finances/loanMaster/edit_loanMaster',
          this.adminRoot + '/finances/aprrove_add',
          this.adminRoot + '/finances/add_loanAdvance',
          this.adminRoot + '/finances/loanAdvance',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListLoanMasterComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    if (this.formValueStorageService.isEmptyObject('ListLoanMasterComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        startdate: '',
        enddate: '',
        searchQuery: '',
        companyMasterID: +localStorage.getItem('company_id'),
        userMasterID: [],
        branchMasterID: null,
      };
    } else {
      this.filterData = this.formValue.ListLoanMasterComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.checkpermission();

    if (this.filterData.companyMasterID) this.getSelectedCompany(this.filterData.companyMasterID);
    if (this.filterData.branchMasterID) this.getSelectedBranch(this.filterData.branchMasterID);
  }

  getSelectedBranch(branch: any) {
    const filterData = {
      branchMasterID: branch,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
          this.alluser.map((el) => {
            el.name = el.displayName;
          });

          let data1 = [];
          this.alluser.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected1 = data1;
          this.spinner.stop();
        }
      });
  }

  getSelectedCompany(id: number) {
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
      });

    const body = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
          let data1 = [];
          this.alluser.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected1 = data1;
          this.spinner.stop();
        }
      });
  }

  getLoanData() {
    this.spinner.start('loan');
    this.api
      .callApi(this.constant.GETLOANBYCOMPANYID, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.spinner.stop('loan');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('loan');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('loan');
        },
      );
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
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
              permissionval.formName == 'LoanMaster' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LoanMaster' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LoanMaster' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LoanMaster' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  changeLoanAdvance(id: any) {
    this.formValueStorageService.navigate(
      'ListLoanMasterComponent',
      this.filterData,
      '/finances/add_loanAdvance',
      id,
    );
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getLoanData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getLoanData();
    }
  }

  onSubmit(val?: any) {
    this.filterData.companyMasterID = val.company;
    this.filterData.branchMasterID = val.branch;

    this.filterData.startdate = val.startdate;
    this.filterData.enddate = val.enddate;

    this.filterData.userMasterID = val.user;

    this.getLoanData();
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getLoanData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getLoanData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.rows = [];
    this.formValueStorageService.removeData('ListLoanMasterComponent', true);
    this.router.navigate([this.adminRoot + '/finances/loanMaster/add_loanMaster']);
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
          LoanID: id,
        };
        this.spinner.start();
        this.api.callApi(this.constant.DELETELOAN, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.commonNotificationService.handleSuccess(res.message);
              setTimeout(() => {
                this.getLoanData();
                this.spinner.stop();
              }, 3000);
            } else {
              this.commonNotificationService.handleError(res.message);
              this.spinner.stop();
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop();
          },
        );
      }
    });
  }

  loanaccepted(id: any) {
    Swal.fire({}).then((result) => {
      if (result.isConfirmed) {
        const body = {
          LoanID: id,
        };
        this.spinner.start();
        this.api.callApi(this.constant.DELETELOAN, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.commonNotificationService.handleSuccess(res.message);
              setTimeout(() => {
                this.getLoanData();
                this.spinner.stop();
              }, 3000);
            } else {
              this.commonNotificationService.handleError(res.message);

              this.spinner.stop();
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop();
          },
        );
      }
    });
  }

  loanrequest(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: ' User Loan Approve!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          LoanID: id,
          loanstatus: '1',
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.LOANSTATUSREQUEST, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.commonNotificationService.handleSuccess(res.message);
            this.getLoanData();
            this.spinner.stop('active');
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop('active');
          },
        );
      }
    });
  }

  loanrejected(id: any) {
    this.loanid = id.LoanID;
  }

  onSubmit1() {
    const body = {
      LoanID: this.loanid,
      loanstatus: '2',
      LoanRemark: this.reject.value.remarks,
    };
    this.spinner.start();
    this.api.callApi(this.constant.LOANSTATUSREQUEST, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.closeModal.nativeElement.click();
        this.reject.resetForm();
        this.ngOnInit();
        this.spinner.stop();
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }
  showRemark(row: any) {
    if (row && row.LoanRemark) {
      this.rejectionRemark = row.LoanRemark;
    }
  }

  openRejectionModal(row: any) {
    this.selectedRow = row;
  }

  openRejectModelSubmit(row: any) {
    this.loanRejectModalComponent.button(row.LoanID);
    this.loanRejectModalComponent.lgModal.show();
  }

  statuschange() {}

  approveAdd() {}

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListLoanMasterComponent',
      this.filterData,
      '/finances/loanMaster/edit_loanMaster',
      rowData.LoanID,
    );
  }

  navigateToApproveAddPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListLoanMasterComponent',
      this.filterData,
      '/finances/loanMaster/add_loanMaster',
      rowData.LoanID,
    );
  }

  clear() {
    this.rows = [];

    this.formValueStorageService.removeData('ListLoanMasterComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  init(val: any) {
    this.filterData.userMasterID = val.map((x) => x.userMasterID);
    this.getLoanData();
  }

  getBranchName(row: any): string {
    return row?.userMaster?.employeeBranches?.[0]?.branchMaster?.branchName || '';
  }
  getEmployeeCode(row: any): string {
    return row?.userMaster?.employeeJoiningDetails?.[0]?.employeeCode || '';
  }

  getDepartmentName(row: any): string {
    return row?.userMaster?.employeeDepartments?.[0]?.department?.departmentName || '';
  }

  getDesignationName(row: any): string {
    return row?.userMaster?.employeeDesignations?.[0]?.designation?.designationName || '';
  }

  getDivisionName(row: any): string {
    return row?.userMaster?.employeeDivisions?.[0]?.division?.divisionName || null;
  }
  getWorkingAreaName(row: any): string {
    return row?.userMaster?.employeeWorkingAreas?.[0]?.workingArea?.workingAreaName || null;
  }

  refreshComponent() {
    this.ngOnInit();
    this.getLoanData();
  }
}
