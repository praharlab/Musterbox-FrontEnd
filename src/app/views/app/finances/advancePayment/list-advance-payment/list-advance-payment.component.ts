import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { AdvanceRejectModalComponent } from '../../../finance-common/advance-reject-modal/advance-reject-modal.component';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import {
  CommonFilterButtonFields,
  CommonFilterFields,
  ItemOptionsPerPageArray,
} from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-list-advance-payment',
    templateUrl: './list-advance-payment.component.html',
    styleUrls: ['./list-advance-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAdvancePaymentComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('lgModal') lgModal: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('reject') reject: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('addimportadvance') addimportadvance: NgForm;
  @ViewChild('closeModal2') closeModal2: any;

  @ViewChild(AdvanceRejectModalComponent)
  advanceRejectModalComponent: AdvanceRejectModalComponent;

  rows = [];
  temp = []
  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    searchQuery: '',
    companyMasterID: localStorage.getItem('company_id'),
    branchMasterID: '',
    userMasterID: [],
    AdvanceStatus: null,
  };
  limit = 10;

  page = {
    totalCount: 0,
    offset: 0,
  };

  adminRoot = environment.adminRoot;
  events: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  remarks: any;
  bsModalRef: BsModalRef;
  selectedRow: any;
  rejectionRemark: string = '';
  setAdvancePK: any;
  company: any = [];
  company_id: any;
  companyID: any;



  companydata: any = [];

  currentPage: number;
  formValue: any;

  finalbranch: string;
  allbranch: any = [];
  employee: any = [];
  selected3: any[];
  branchfilter: boolean;
  employeedata: any = [];
  BranchID: any;
  branch_id: any;
  currentSelectedCompany: any;
  selectedBranch: null;
  selectedUser: any[];

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
    CommonFilterButtonFields.Import,
  ];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/finances/advancePayment',
          this.adminRoot + '/finances/advancePayment/edit_advancePayment',
          this.adminRoot + '/finances/approve_req_advancePayment',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListAdvancePaymentComponent', false);
        }
      }
    });
  }

  openRejectionModal(row: any) {
    this.selectedRow = row;
  }

  updateRejectionStatus(row: any) {
    const updatedRow = {
      ...row,
      AdvanceStatus: '2', // Update to Rejected status
      RejectionRemark: this.rejectionRemark,
    };

    const body = {
      advancePaymentID: row.advancePaymentID,
      AdvanceStatus: '2', // Rejected status
      RejectionRemark: this.rejectionRemark,
    };

    this.spinner.start();
    this.api.callApi(this.constant.POSTSTATUSREQUEST, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.rows = this.rows.map((r) =>
          r.advancePaymentID === row.advancePaymentID ? updatedRow : r,
        );
        this.lgModal.hide(); // Hide the modal after submitting
        this.spinner.stop();
      },
      (err) => {
        this.spinner.stop();
      },
    );
  }

  onSubmit1() {
    const body = {
      advancePaymentID: this.selectedRow.advancePaymentID,
      AdvanceStatus: '2', // Rejected status
      RejectionRemark: this.reject.value.remarks,
    };

    this.spinner.start();
    this.api.callApi(this.constant.POSTSTATUSREQUEST, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.closeModal.nativeElement.click();
        this.reject.resetForm();
        this.ngOnInit();
        this.spinner.stop();
      },
      (err) => {
        this.spinner.stop();
      },
    );
  }

  ngOnInit() {
    this.checkpermission();
    this.company_id = +localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListAdvancePaymentComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        startdate: '',
        enddate: '',
        searchQuery: '',
        companyMasterID: localStorage.getItem('company_id'),
        branchMasterID: '',
        userMasterID: [],
        AdvanceStatus: null,
      };
    } else {
      this.filterData = this.formValue.ListAdvancePaymentComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    if (this.company_id) {
      this.companyID = this.company_id;
    }
  }

  clear() {
    this.formValueStorageService.removeData('ListAdvancePaymentComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  getgrade() {
    this.spinner.start('MAIN');
    this.api
      .callApi(this.constant.GETADVANCEBYCOMPANYID, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            if (this.rows.length > 0) {
              this.showButtons.push(CommonFilterButtonFields.Excel);
            } else {
              this.showButtons = [
                CommonFilterButtonFields.Submit,
                CommonFilterButtonFields.Clear,
                CommonFilterButtonFields.Import,
              ];
            }
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.spinner.stop('MAIN');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('MAIN');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('MAIN');
        },
      );
  }

  close() {
    this.addimportadvance.resetForm();
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
              permissionval.formName == 'AdvancePayment' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AdvancePayment' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AdvancePayment' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AdvancePayment' &&
              permissionval.operationName.includes('Create')
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
        this.getgrade();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getgrade();
    }
  }

  onSubmit(val?: any) {
    this.filterData.page = 1;
    this.filterData.startdate = val.startdate;
    this.filterData.enddate = val.enddate;
    this.filterData.companyMasterID = val?.company;
    this.filterData.branchMasterID = val.branch;
    this.filterData.userMasterID = val.user ? val.user : [];
    this.filterData.AdvanceStatus = val.AdvanceStatus ? val.AdvanceStatus : null;
    this.getgrade();
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getgrade();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getgrade();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/finances/advancePayment/add_advancePayment']);
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
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEADVANCE + '/' + id, {}, 'GET', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.commonNotificationService.handleSuccess(res.message);

                this.getgrade();
                this.spinner.stop('confirm');
              } else {
                this.commonNotificationService.handleError(res.message);
                this.spinner.stop('confirm');
              }
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message);
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'AdvancePayment will be Deleted!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          advancePaymentID: id,
          status: '0',
        };

        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.ADVANCESTATECHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.commonNotificationService.handleSuccess(res.message);
              this.getgrade();
              this.spinner.stop('deactive');
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message);
              this.spinner.stop('deactive');
            },
          );
      }
    });
  }

  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'AdvancePayment will be Added!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          advancePaymentID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.ADVANCESTATECHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.commonNotificationService.handleSuccess(res.message);
              this.getgrade();
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

  openRejectModelSubmit(row: any) {
    this.advanceRejectModalComponent.button(row.advancePaymentID);
    this.advanceRejectModalComponent.lgModal.show();
  }

  downloadFile() {
    this.spinner.start('download');
    const body = {
      ...this.filterData,
      page: '',
      limit: '',
      exportData: true,
    };
    this.api
      .callApi(this.constant.GETADVANCEBYCOMPANYID, body, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, 'Advance Payment.xlsx', 'text/xlsx');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListAdvancePaymentComponent',
      this.filterData,
      '/finances/advancePayment/edit_advancePayment',
      rowData.advancePaymentID,
    );
  }

  navigateToApproveReqAdvancePaymentPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListAdvancePaymentComponent',
      this.filterData,
      '/finances/approve_req_advancePayment',
      rowData.advancePaymentID,
    );
  }
  importExcel() {
    this.router.navigate([this.adminRoot + '/finances/advancePayment/import_advancePayment']);
  }

  init(val: any) {
    this.filterData.userMasterID = val.map((x) => x.userMasterID);
    this.getgrade();
  }

  getBranchName(row: any): string {
    return row['userMaster.employeeBranches.branchMaster.branchName'] || '';
  }
  getEmployeeCode(row: any): string {
    return row['userMaster.employeeJoiningDetails.employeeCode'] || '';
  }

  getDepartmentName(row: any): string {
    return row['userMaster.employeeDepartments.department.departmentName'] || '';
  }

  getDesignationName(row: any): string {
    return row['userMaster.employeeDesignations.designation.designationName'] || '';
  }

  getDivisionName(row: any): string {
    return row['userMaster.employeeDivisions.division.divisionName'] || null;
  }
  getWorkingAreaName(row: any): string {
    return row['userMaster.employeeWorkingAreasworkingArea.workingAreaName'] || null;
  }
}
