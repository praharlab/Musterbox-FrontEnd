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
    selector: 'app-view-office-expense-common',
    templateUrl: './view-office-expense-common.component.html',
    styleUrls: ['./view-office-expense-common.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewOfficeExpenseCommonComponent implements OnInit {

  @Output() close = new EventEmitter<any>();
  @ViewChild('officeExpenseModal') officeExpenseModal: ModalDirective;
  @Input('row') row: any;
  @Input('showCheckbox') showCheckbox: boolean = false;

  isAllChecked: boolean = false;
  
  officeExpenseData: any
  apiURL = environment.apiUrl;
  selectedRequests: any = []

  remarks: string = ''
  @ViewChild('acceptRejectForm') acceptRejectForm: NgForm;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.officeExpenseModal.show();
    this.officeExpenseModal.onHide.subscribe(() => {
      this.remarks = '';
      this.selectedRequests = [];
      this.close.emit();
    });
    this.officeExpenseModal.onShown.subscribe(() => {
      this.remarks = '';
      this.selectedRequests = [];
      this.getOfficeExpenseData();
    });
  }

  closeModal(){
    this.close.emit();
  }

  getOfficeExpenseData() {
    const body = {
      officeExpenseID: +this.row.officeExpenseID,
    };
    this.spinner.start('officeExpenseData');
    this.api.callApi(this.constant.GETOFFICEEXPENSEBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.officeExpenseData = res.data;
          this.officeExpenseData.officeExpenseTransactions = this.officeExpenseData.officeExpenseTransactions.map(
            (x) => ({ ...x, checked: false, isOpen: false }),
          );
        }
        this.spinner.stop('officeExpenseData');
      },
      (error: any) => {
        this.spinner.stop('officeExpenseData');
        this.commonNotificationService.handleError(error.error.message);
      },
    );
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

  checkAll(ev: any) {
    this.isAllChecked = ev.target.checked;
    if (this.isAllChecked) {
      this.officeExpenseData.officeExpenseTransactions.map((row) => {
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
      this.officeExpenseData.officeExpenseTransactions.map((row) => {
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
    return this.officeExpenseData.officeExpenseTransactions.filter(
      (row: any) =>
        row?.Auth[0]?.authstatus == 2 &&
        row?.authorizationStatus != 3 &&
        row?.authorizationStatus != 4,
    ).length == 0
      ? true
      : false;
  }

  isAllSelected() {
    const index = this.officeExpenseData.officeExpenseTransactions.findIndex(
      (row: any) =>
        !row.checked &&
        row?.Auth[0]?.authstatus == 2 &&
        row?.authorizationStatus != 3 &&
        row?.authorizationStatus != 4,
    );
    return index == -1 ? true : false;
  }

  getCheckboxValues(ev, row: any) {
    if (ev.target.checked) {
      this.officeExpenseData.officeExpenseTransactions.map((transaction, i) => {
        if (transaction.officeExpenseTransactionID == row.officeExpenseTransactionID) {
          this.selectedRequests.push(row);
          transaction.checked = true;
          this.isAllChecked = this.isAllSelected() ? true : false;
        }
      });
    } else {
      this.officeExpenseData.officeExpenseTransactions.map((transaction, i) => {
        if (transaction.officeExpenseTransactionID == row.officeExpenseTransactionID) {
          transaction.checked = false;
          const index = this.selectedRequests.findIndex(
            (x: any) => x.officeExpenseTransactionID == row.officeExpenseTransactionID,
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
      officeExpenseTransactionID: x.officeExpenseTransactionID,
      officeExpenseAuthRequestId: x.Auth[0].officeExpenseAuthRequestId,
      remarks: this.remarks,
    }));

    const body = {
      acceptRejectData: selectedData,
      authstatus: type == 'approve' ? 1 : 0,
    };

    this.spinner.start('AcceptAll');
    this.api
      .callApi(this.constant.ACCEPTREJECTOFFICEEXPENSES, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(
            `Office Expense ${type == 'approve' ? 'Approved' : 'Rejected'} Successfully`,
          );
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
            this.spinner.stop('AcceptAll');
            this.isAllChecked = false;
            this.remarks = '';
            this.selectedRequests = [];
            this.getOfficeExpenseData();
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('AcceptAll');
        }
      });
  }

}
