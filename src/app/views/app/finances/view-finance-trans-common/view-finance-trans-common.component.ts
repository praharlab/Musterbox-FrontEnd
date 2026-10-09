import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-view-finance-trans-common',
    templateUrl: './view-finance-trans-common.component.html',
    styleUrls: ['./view-finance-trans-common.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewFinanceTransCommonComponent implements OnInit {
  @ViewChild('financeModal') financeModal: ModalDirective;
  @Output('close') close = new EventEmitter<any>();
  @Input('row') row: any;
  @Input('showVersion') showVersion: boolean = false;

  tabHeading: string = '';
  visitData: any = {};
  tourData: any = {};
  projectData: any = {};
  userData: any = {};
  expenseData: any = {};
  expenseResponseData: any = {};
  versionData: any = [];

  authdata: any = [];
  visitreportcustomizefield: any = [];
  apiURL = environment.apiUrl;
  showData: boolean = false;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) {}

  ngAfterViewInit(): void {
    this.financeModal.show();
    this.financeModal.onHide.subscribe(() => {
      this.close.emit();
    });
    this.financeModal.onShown.subscribe(() => {
      this.getExpenseData();
      this.getExpenseDataByVersion();
    });
  }

  ngOnInit(): void {}

  closeModal() {
    this.financeModal.hide();
  }

  getExpenseData() {
    this.spinner.start('expenseData');
    this.api
      .callApi(
        this.constant.GETEXPENSEDATABYID,
        {
          userExpenseTransactionID: this.row.userExpenseTransaction
            ? this.row?.userExpenseTransaction?.userExpenseTransactionID
            : this.row?.userExpenseTransactionID,
        },
        'POST',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.expenseData = {
              expenseHead: res.data.expenseHead.expenseHead,
              expenseAmount: res.data.expenseAmount,
              description: res.data.description,
              expense_date: res.data.userExpense.expense_date,
              attachFile: res.data.attachFile,
              attachFile2: res.data.attachFile2,
              auth_creteria: res.data.AuthorizationCriteriaMaster?.AuthorizationCriteria,
            };

            this.authdata = res.data.expenseAuthorizations;
            this.expenseResponseData = res.data

            this.showData = true;

            if (this.expenseResponseData?.userExpense?.visitID) {
              this.tabHeading = 'Visit Data';
            }
            if (this.expenseResponseData?.userExpense?.ToursMasterID) {
              this.tabHeading = 'Tour Data';
            }
            if (this.expenseResponseData?.userExpense?.projectID) {
              this.tabHeading = 'Project Data';
            }

            this.userData = res.data?.userExpense?.userMaster;
            this.spinner.stop('expenseData');
          }
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

  getExpenseDataByVersion() {
    if (this.row.attachfile == '' || this.row.attachfile === null) {
      this.row.attachfile = this.row.attachfile;
    } else {
      this.row.attachfile = this.row?.attachfile?.split(',').pop();
    }
    const body = {
      id: this.row.userExpenseTransaction
        ? this.row?.userExpenseTransaction?.userExpenseTransactionID
        : this.row?.userExpenseTransactionID,
    };
    this.spinner.start('expenseDataByVersion');
    this.api
      .callApi(this.constant.GETEXPENSETRANSDATABYVERSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.versionData = res.data;

          for (var i = 0; i < this.versionData.length; i++) {
            if (
              this.versionData[i].attachFile != '' ||
              this.versionData[i].attachFile != null
            ) {
              this.versionData[i].attachFile = this.versionData[
                i
              ].attachFile
                ?.split(',')
                .pop();
            }
          }
          this.spinner.stop('expenseDataByVersion');
        }
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

  selectTab() {
    if (this.expenseResponseData?.userExpense?.visitID) {
      this.getVisitData(this.expenseResponseData?.userExpense?.visitID);
      this.getVisitReportData(this.expenseResponseData?.userExpense?.visitID);
    }
    if (this.expenseResponseData?.userExpense?.ToursMasterID) {
      this.getTourData(this.expenseResponseData?.userExpense.ToursMasterID);
    }
    if (this.expenseResponseData?.userExpense?.projectID) {
      this.getProjectData(this.expenseResponseData?.userExpense.projectID);
    }
  }
}
