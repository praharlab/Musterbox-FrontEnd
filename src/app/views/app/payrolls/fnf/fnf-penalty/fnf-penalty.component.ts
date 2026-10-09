import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { paymentMode, employeeRepaymentType } from 'src/app/constants/commonVariables';
@Component({
    selector: 'app-fnf-penalty',
    templateUrl: './fnf-penalty.component.html',
    styleUrls: ['./fnf-penalty.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FnfPenaltyComponent implements OnInit {
  @ViewChild('paymentForm') paymentForm: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('payModal', { static: false }) payModal: ModalDirective;
  apiURL = environment.apiUrl;
  formValue: any;
  applicationData: any = []
  referenceData: any = [];
  employeeComment: any;
  resignationTaskData: any = [];
  showloader: boolean = false;
  body = {
    FNFMonth: '',
    userMasterID: null
  };
  public paymentModes = paymentMode;
  paymentRefrenceID: any = null;
  payPaneltyData: any
  paymentMode: string = null;
  @Output('isPanaltyCompleted') isPanaltyCompleted = new EventEmitter<boolean>();
  @Output('reloadPenalty') reloadPenalty = new EventEmitter<any>();

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void { }

  getUserPanelty() {
    this.showloader = true;
    const queryString = `?userMasterID=${this.body.userMasterID}&FNFMonth=${this.body.FNFMonth}`;

    this.api
      .callApi(
        this.constant.GETPENDINGPENALTY + queryString,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.applicationData = res.data;
          this.isPanaltyCompleted.emit(true)
          this.showloader = false;
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.showloader = false;
        },
      );
  }

  openAttachment(item: any) {
    window.open(this.apiURL + 'uploads/employee-penalty-attachments/' + item, '_blank');
  }
  
  onPaymentModeChange() {
    this.paymentRefrenceID = null
  }

  onPaymentFormSubmit() {
    if (!this.paymentForm.valid) {
      return;
    }
    const body = {
      type: employeeRepaymentType.PENALTY,
      date: this.paymentForm.value.paymentDate,
      salaryMonth: this.body.FNFMonth,
      amount: this.payPaneltyData.penaltyAmount,
      paymentMode: this.paymentForm.value.payment,
      referenceNO: this.paymentForm.value.referenceId ? this.paymentForm.value.referenceId : null,
      employeePenaltyID: +this.payPaneltyData.employeePenaltyID
    };
    this.api.callApi(this.constant.ADDEMPREPAYMENT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
          this.closeModalFunction()
        } else {
          this.commonNotificationService.handleWarning(res.message)
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
      },
    );
  }


  onPayButtonClick(row) {
    this.payPaneltyData = row
    this.payModal.show()
  }

  closeModalFunction() {
    this.paymentForm.resetForm();
    this.payPaneltyData = null
    this.payModal.hide();
    this.reloadPenalty.emit()
  }
}
