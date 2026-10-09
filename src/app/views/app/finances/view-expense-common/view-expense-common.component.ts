import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ModalService } from 'src/app/services/modal.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-view-expense-common',
    templateUrl: './view-expense-common.component.html',
    styleUrls: ['./view-expense-common.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewExpenseCommonComponent implements OnInit {
  @ViewChild('financeCommonModal') financeCommonModal: ModalDirective;
  @Output('close') close = new EventEmitter<any>();
  @Input('row') row: any;
  @Input('showVersion') showVersion: boolean = false;
  @Output() reapplyEvent = new EventEmitter<any>();
  @Input('showReapply') showReapply: boolean = false;
  @Input('showCheckbox') showCheckbox: boolean = false;
  @Input('actionType') actionType: string = '';
  @ViewChild('acceptRejectForm') acceptRejectForm: NgForm;
  isAllChecked: boolean = false;

  expenseData: any = {};

  tabHeading: string = '';
  visitData: any = {};
  tourData: any = {};
  projectData: any = {};
  userData: any = {};
  versionData: any = [];

  showData: boolean = false;
  authdata: any = [];
  visitreportcustomizefield: any = [];
  apiURL = environment.apiUrl;

  selectedRequests: number[] = [];
  remarks: string = '';
  visitCustomizeValue: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private modalService: ModalService,
  ) {}

  ngAfterViewInit(): void {
    this.financeCommonModal.show();
    this.financeCommonModal.onHide.subscribe(() => {
      this.remarks = '';
      this.selectedRequests = [];
      this.close.emit();
    });
    this.financeCommonModal.onShown.subscribe(() => {
      this.remarks = '';
      this.selectedRequests = [];
      this.getExpenseData();
    });
  }

  ngOnInit(): void {}

  closeModal() {
    this.financeCommonModal.hide();
  }

  getExpenseData() {
    const body = {
      userExpenseID: +this.row.userExpenseID,
    };
    this.spinner.start('expenseData');
    this.api.callApi(this.constant.GETUSEREXPENSEBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.expenseData = res.data;
          this.expenseData.userExpenseTransactions = this.expenseData.userExpenseTransactions.map(
            (x) => ({ ...x, checked: false, isOpen: false }),
          );
          this.showData = true;

          if (res.data?.visitID) {
            this.tabHeading = 'Visit Data';
            this.getVisitData(res.data?.visitID);
            this.getVisitReportData(res.data?.visitID);
            this.getVisitCustomizeFieldValue(res.data?.visitID);
          }
          if (res.data?.ToursMasterID) {
            this.tabHeading = 'Tour Data';
            this.getTourData(res.data?.ToursMasterID);
          }
          if (res.data?.projectID) {
            this.tabHeading = 'Project Data';
            this.getProjectData(res.data?.projectID);
          }

          this.userData = res.data?.userMaster;
        }
        this.spinner.stop('expenseData');
      },
      (error: any) => {
        this.showData = false;
        this.spinner.stop('expenseData');
        this.commonNotificationService.handleError(error.error.message);
      },
    );
  }

  getVisitData(visitID: any) {
    this.spinner.start('visitData');
    this.api
      .callApi(this.constant.VIEWVISIT + visitID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.visitData = res.data;
          this.spinner.stop('visitData');
        }
      });
  }

  getVisitReportData(visitID: any) {
    this.spinner.start('visitReportData');
    this.api
      .callApi(this.constant.VIEWVISITREPORTFIELDCUSTOMIZE + visitID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.spinner.stop('visitReportData');
          this.visitreportcustomizefield = res.data;
        }
      });
  }

  getVisitCustomizeFieldValue(visitid: any) {
    this.spinner.start('field');
    this.api
      .callApi(this.constant.VIEWVISITFIELDCUSTOMIZE + visitid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.visitCustomizeValue = res.data;
          this.spinner.stop('field');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);

          this.spinner.stop('field');
        },
      );
  }

  getProjectData(projectID: any) {
    let queryString = `?projectID=${projectID}`;
    this.spinner.start('projectData');
    this.api
      .callApi(this.constant.GETPROJECTBYID + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.projectData = res.data;
          this.spinner.stop('projectData');
        },
        (err) => {
          this.spinner.stop('projectData');
          this.commonNotificationService.handleError(err.error.message);
        },
      );
  }

  getTourData(ToursMasterID: any) {
    this.spinner.start('tourData');
    this.api
      .callApi(this.constant.VIEWTOURDATA + ToursMasterID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.spinner.stop('tourData');
          this.tourData = res.data;
        }
      });
  }

  async getExpenseDataByVersion(index: number, userExpenseTransactionID: any) {
    return new Promise((resolve, reject) => {
      const body = {
        id: userExpenseTransactionID,
      };
      this.spinner.start('expenseDataByVersion');
      this.api
        .callApi(this.constant.GETEXPENSETRANSDATABYVERSION, body, 'POST', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.expenseData.userExpenseTransactions[index].versionData = res.data;
              this.spinner.stop('expenseDataByVersion');
              resolve(res.data);
            } else {
              reject();
            }
          },
          (error) => {
            reject(error);
          },
        );
    });
  }

  view(attachment: any) {
    window.open(this.apiURL + attachment, '_blank');
  }

  showImage(data: string) {
    if (data && data != null && data != 'null' && !data.endsWith('.pdf')) {
      return true;
    } else {
      return false;
    }
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

  navigateToReapplyPage(row: any) {
    this.reapplyEvent.emit(row.userExpenseTransactionID);
  }

  getCheckboxValues(ev, row: any) {
    if (ev.target.checked) {
      this.expenseData.userExpenseTransactions.map((transaction, i) => {
        if (transaction.userExpenseTransactionID == row.userExpenseTransactionID) {
          this.selectedRequests.push(row);
          transaction.checked = true;
          this.isAllChecked = this.isAllSelected() ? true : false;
        }
      });
    } else {
      this.expenseData.userExpenseTransactions.map((transaction, i) => {
        if (transaction.userExpenseTransactionID == row.userExpenseTransactionID) {
          transaction.checked = false;
          const index = this.selectedRequests.findIndex(
            (x: any) => x.userExpenseTransactionID == row.userExpenseTransactionID,
          );
          if (index !== -1) {
            this.selectedRequests.splice(index, 1);
            this.isAllChecked = false;
          }
        }
      });
    }
  }

  checkDisabled(row: any) {
    return row?.Auth[0]?.authstatus == 2 &&
      row?.authorizationStatus != 3 &&
      row?.authorizationStatus != 4
      ? false
      : true;
  }

  acceptRejectRequest(type: string) {
    if (type == 'reject')
      if (!this.remarks || this.remarks == '' || this.remarks == null) {
        this.commonNotificationService.handleWarning('Rejection Remarks is mandatory!');
        return;
      }
    if (!this.acceptRejectForm.valid) return;
    const selectedData = this.selectedRequests.map((x: any) => ({
      userexpensetransactionid: x.userExpenseTransactionID,
      authorizationrequestid: x.Auth[0].AuthorizationRequestId,
      remarks: this.remarks,
    }));

    const body = {
      newArray: selectedData,
      authstatus: type == 'approve' ? 1 : 0,
    };

    this.spinner.start('AcceptAll');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTEXPENSEALL, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(
            `Expense ${type == 'approve' ? 'Approved' : 'Rejected'} Successfully`,
          );
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
            this.spinner.stop('AcceptAll');
            this.isAllChecked = false;
            this.remarks = '';
            this.selectedRequests = [];
            this.getExpenseData();
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('AcceptAll');
        }
      });
  }

  checkDatePeriod(date: any) {
    const createdAt = new Date(date);
    const today = new Date();

    // Calculate the difference in milliseconds
    const diffInMs = today.getTime() - createdAt.getTime();

    // Convert milliseconds to days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays > 15 ? true : false;
  }

  openAccordion(index: number, userExpenseTransactionID: number) {
    this.getExpenseDataByVersion(index, userExpenseTransactionID).then(() => {
      this.expenseData.userExpenseTransactions[index].isOpen = true;
    });
  }

  closeAccordion(index: number) {
    this.expenseData.userExpenseTransactions[index].isOpen = false;
  }

  checkAll(ev: any) {
    this.isAllChecked = ev.target.checked;
    if (this.isAllChecked) {
      this.expenseData.userExpenseTransactions.map((row) => {
        if (
          row?.Auth[0]?.authstatus == 2 &&
          row?.authorizationStatus != 3 &&
          row?.authorizationStatus != 4
        ) {
          this.selectedRequests.push(row);
          row.checked = true;
        }
      });
    } else {
      this.expenseData.userExpenseTransactions.map((row) => {
        if (
          row?.Auth[0]?.authstatus == 2 &&
          row?.authorizationStatus != 3 &&
          row?.authorizationStatus != 4
        ) {
          row.checked = false;
          const index = this.selectedRequests.findIndex(
            (x: any) => x.userExpenseTransactionID == row.userExpenseTransactionID,
          );
          if (index !== -1) {
            this.selectedRequests.splice(index, 1);
          }
        }
      });
    }
  }

  checkAllDisabled() {
    return this.expenseData.userExpenseTransactions.filter(
      (row: any) =>
        row?.Auth[0]?.authstatus == 2 &&
        row?.authorizationStatus != 3 &&
        row?.authorizationStatus != 4,
    ).length == 0
      ? true
      : false;
  }

  isAllSelected() {
    const index = this.expenseData.userExpenseTransactions.findIndex(
      (row: any) =>
        row.checked == false &&
        row?.Auth[0]?.authstatus == 2 &&
        row?.authorizationStatus != 3 &&
        row?.authorizationStatus != 4,
    );
    return index == -1 ? true : false;
  }
}
