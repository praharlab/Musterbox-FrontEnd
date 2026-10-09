import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { paymentMode, employeeRepaymentType } from 'src/app/constants/commonVariables';
import { NgForm } from '@angular/forms';
import { CommonUtils } from 'src/app/utils/common.utils';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-fnf-advance',
    templateUrl: './fnf-advance.component.html',
    styleUrls: ['./fnf-advance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FnfAdvanceComponent implements OnInit {

  @ViewChild('paymentForm') paymentForm: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('payModal', { static: false }) payModal: ModalDirective;
  showloader: boolean = false
  apiURL = environment.apiUrl;
  applicationData: any = []
  paymentMode: string = null;
  body = {
    fnfYearMonth: '',
    userMasterID: null
  };
  public paymentModes = paymentMode;
  paymentRefrenceID: any = null;
  payAdvanceData: any

  @Output('isAdvanceCompleted') isAdvanceCompleted = new EventEmitter<boolean>();
  @Output('reloadAdvance') reloadAdvance = new EventEmitter<any>();

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void { }

  getUserAdvance() {
    this.showloader = true;
    this.api
      .callApi(
        this.constant.GETPENDINGADVANCE + this.body.userMasterID,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.applicationData = res.data;
          this.applicationData = this.applicationData.map((item) => ({
            ...item,
            formattedpaymentYearMonth: CommonUtils.getFormattedMonth(item.paymentYearMonth), // Convert once
          }));
          this.showloader = false;
          const filterData = this.applicationData.filter((e) => e.paymentYearMonth != this.body.fnfYearMonth).length
          if (filterData > 0) {
            this.isAdvanceCompleted.emit(false)
          } else {
            this.isAdvanceCompleted.emit(true)
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.showloader = false;
        },
      );
  }

  viewDocument(attachment) {
    window.open(`${this.apiURL}uploads/resignation/${attachment}`, '_blank');
  }

  alertDeductFromSalary(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Deduct advance From Salary!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          advancePaymentID: row.advancePaymentID,
          userMasterID: +row.userMasterID,
          companyMasterID: +row.companyMasterID,
          description: row.description,
          amount: row.amount,
          advanceDate: row.advanceDate,
          paymentYearMonth: this.body.fnfYearMonth,
          paymentmode: row.paymentmode,
          referenceNO: row.referenceNO,
          referenceDate: row.referenceDate
        };
        this.api.callApi(this.constant.UPDATEADVANCEPAYMENT, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.reloadAdvance.emit()
            this.commonNotificationService.handleSuccess(res.message)
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
          },
        );
      }
    });
  }

  onPaymentModeChange() {
    this.paymentRefrenceID = null
  }

  onPaymentFormSubmit() {
    if (!this.paymentForm.valid) {
      return;
    }
    const body = {
      type: employeeRepaymentType.ADVANCE,
      date: this.paymentForm.value.paymentDate,
      salaryMonth: this.body.fnfYearMonth,
      amount: this.payAdvanceData.amount,
      paymentMode: this.paymentForm.value.payment,
      referenceNO: this.paymentForm.value.referenceId ? this.paymentForm.value.referenceId : null,
      advancePaymentID: +this.payAdvanceData.advancePaymentID
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
    this.payAdvanceData = row
    this.payModal.show()
  }

  closeModalFunction() {
    this.paymentForm.resetForm();
    this.payAdvanceData = null
    this.payModal.hide();
    this.reloadAdvance.emit()
  }
}
