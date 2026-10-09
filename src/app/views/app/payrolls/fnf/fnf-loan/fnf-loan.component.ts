import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { CommonUtils } from 'src/app/utils/common.utils';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { paymentMode } from 'src/app/constants/commonVariables';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IpAddressService } from 'src/app/services/ip-address.service';

@Component({
    selector: 'app-fnf-loan',
    templateUrl: './fnf-loan.component.html',
    styleUrls: ['./fnf-loan.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FnfLoanComponent implements OnInit {
  @ViewChild('paymentForm') paymentForm: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('payModal', { static: false }) payModal: ModalDirective;
  applicationData: any
  loanTransactions: any = [];
  loanAdvances: any = [];
  showloader: boolean = false
  paymentMode: string = null;
  body = {
    fnfYearMonth: '',
    userMasterID: null
  };
  public paymentModes = paymentMode;
  paymentRefrenceID: any = null;
  payloanAdvanceData: any
  datearr: any = [];
  paidInst: any = 0;
  totalAdvanceAmount: number = 0;
  payloanData: any
  ipAddress: any;
  @Output('isLoanCompleted') isLoanCompleted = new EventEmitter<boolean>();
  @Output('reloadLoan') reloadLoan = new EventEmitter<any>();

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private ipAddressService: IpAddressService,

  ) { }

  ngOnInit(): void {
    this.ipAddressService.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getLoanData() {
    this.showloader = true;
    const queryString = `?userMasterID=${this.body.userMasterID}&FNFMonth=${this.body.fnfYearMonth}`;
    this.api
      .callApi(
        this.constant.GETPENDINGLOAN + queryString,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.applicationData = res.data;
          const filterData = this.applicationData.filter((e) => e.deduct_from_salary_button).length
          if (filterData == 0) {
            this.isLoanCompleted.emit(true)
          } else {
            this.isLoanCompleted.emit(false)
          }
          this.showloader = false;
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.showloader = false;
        },
      );
  }

  showData(row) {
    this.loanTransactions = row.loanTransactions
    this.loanTransactions = this.loanTransactions.map((item) => ({
      ...item,
      formattedEMIMonth: CommonUtils.getFormattedMonth(item.EMIMonth), // Convert once
    }));
    this.loanAdvances = row.loanAdvances
  }

  alertDeductFromSalary(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Deduct Loan From Salary!',
      cancelButtonText: 'No, keep it',
    }).then((result:any) => {
      if (result.isConfirmed) {
        const filterData = {
          LoanID: row.LoanID,
          month: this.body.fnfYearMonth
        };

        this.api.callApi(this.constant.ADDEMPREPAYMENTLOAN, filterData, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.reloadLoan.emit()
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



    this.datearr.forEach((element) => {
      element.EMIMonth = element.EMIMonth.replace('-', '');
      element.updateBy = +localStorage.getItem('id');
      element.EMIAmount = element.EMIAmount1;
      element.updateByIp = this.ipAddress;
    });
    let body = {
      LoanID: this.payloanData.LoanID,
      Amount: this.paymentForm.value.cashpayment,
      remarks: this.paymentForm.value.advanceRemark,
      givenDate: this.payloanData.givenDate,
      paymentmode: this.paymentForm.value.payment,
      refrenceNo: this.paymentForm.value.referenceId ? this.paymentForm.value.referenceId : null,
      referenceDate: this.paymentForm.value.paymentDate,
      loanTransaction: this.datearr,
      createBy: +localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.api.callApi(this.constant.ADDLOANADVANCE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.showloader = true

        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
          this.closeModalFunction()
          this
        } else {
          this.commonNotificationService.handleError(res.message)
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    );
    this.showloader = false
  }

  getLoanTransactions(data: any) {
    this.showloader = true
    this.api
      .callApi(this.constant.GETLOANBYID + data.LoanID, {}, 'GET', false, true, true)
      .subscribe((res: any) => {
        this.paymentForm.resetForm();
        this.payloanData = null
        this.payloanAdvanceData = null
        this.totalAdvanceAmount = 0;
        this.paidInst = 0
        this.payloanData = res.data;
        this.datearr = res.childData;
        this.payloanAdvanceData = res.LoanAdvance;
        this.datearr.forEach((element) => {
          element.EMIMonth = element.EMIMonth.slice(0, 4) + '-' + element.EMIMonth.slice(4);
          element.EMIAmount1 = element.EMIAmount;
          if (element.RefrenceId != null) {
            this.paidInst = this.paidInst + parseFloat(element.EMIAmount);
          }
        });
        if (this.payloanAdvanceData.length != 0) {
          this.payloanAdvanceData.forEach((element) => {
            this.totalAdvanceAmount = this.totalAdvanceAmount + parseFloat(element.Amount);
          });
        }
        this.showloader = false

      });
  }

  onPayButtonClick(row) {
    this.getLoanTransactions(row)
    this.payModal.show()
  }

  closeModalFunction() {
    this.reloadLoan.emit()
    this.paymentForm.resetForm();
    this.payloanData = null
    this.payloanAdvanceData = null
    this.totalAdvanceAmount = 0;
    this.paidInst = 0
    this.payModal.hide();
  }

  changepayment() {
    const loanbal = this.payloanData.LoanAmount - this.paidInst - this.totalAdvanceAmount;
    if (loanbal < this.paymentForm.value.cashpayment) {
      this.commonNotificationService.handleWarning('Advance Payment is morethan Remaining Loan Balance!!')
    } else {
      let noofemi = this.datearr.filter((d1) => d1.RefrenceId == null);
      let finalAmount = Number(this.paymentForm.value.cashpayment) / Number(noofemi.length);

      let difference = 0;
      this.datearr.forEach((data) => {
        difference = difference + (finalAmount - Math.floor(finalAmount));
        if (data.RefrenceId == null) {
          data.EMIAmount1 = Number(data.EMIAmount) - Math.floor(finalAmount);
        } else {
          data.EMIAmount1 = data.EMIAmount;
        }
      });
      this.datearr[this.datearr.length - 1].EMIAmount1 =
        this.datearr[this.datearr.length - 1].EMIAmount1 - Math.round(difference);
    }
  }


}
