import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-income-tax-computation',
    templateUrl: './income-tax-computation.component.html',
    styleUrls: ['./income-tax-computation.component.scss', '../loader/loader.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class IncomeTaxComputationComponent implements OnInit {
  @Input() data: any;
  fiscalYear: string;
  myTaxData: any = []
  taxAmount: any;
  scrollBarHorizontal: boolean;
  taxdataloader: boolean = false;
  userId: string;
  salaryData: any = [];
  totalDeduction: any;
  deductionData: any = [];
  finalNetPayReceived: number = 0;
  declarationData: any = [];
  totalDeclaredAmount: number = 0;
  taxableAmount: number = 0;
  flag: boolean = false;
  flag1: boolean = false;
  slabsData: any;
  slabs: any;
  cess: any;
  rebate: any;
  netIncomeTaxPayable: any;
  grossIncomeTaxAmount: any;
  remainingAmount: any;
  paidAmount: any;
  rebateUpto: any;
  standardDeduction: any;

  @Input()
  set selectedFiscalYear(selectedFiscalYear: string) {
    this.fiscalYear = selectedFiscalYear;
  }
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('id');
    Promise.all([this.employeeTaxData(), this.declarationDetails()])
      .catch((error) => {
        this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 5000,
          showProgressBar: false,
        });
      });
  }


  employeeTaxData(): Promise<void> {
    this.taxAmount = []
    this.taxdataloader = !this.taxdataloader
    return new Promise<void>((resolve, reject) => {
      this.api
        .callApi(this.constant.GETINCOMETAXCOMPUTATION + `?userMasterID=${this.userId}&financialYear=${this.fiscalYear}`, {}, 'GET', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.myTaxData = res.data;
              this.salaryData = res.finalData;
              this.totalDeduction = res.totalDeductionAmount;
              this.deductionData = res.deductionData;
              this.totalDeclaredAmount = res.declarationAmount;
              this.finalNetPayReceived = res.finalNetPayReceived
              this.taxableAmount = res.taxableAmount
              this.slabs = res.slabs
              this.cess = res.cess
              this.rebate = res.rebate
              this.netIncomeTaxPayable = res.netIncomeTaxPayable
              this.grossIncomeTaxAmount = res.grossIncomeTaxAmount
              this.remainingAmount = res.remainingAmount ? res.remainingAmount : 0
              this.paidAmount = res.paidAmount ? res.paidAmount : 0
              this.rebateUpto = res.rebateUpto;
              this.standardDeduction = res.standardDeduction;
              this.taxAmount.push(
                { name: 'Total Tax Payable', value: res.payableAmount ? res.payableAmount : 0 },
                { name: 'Tax Paid Till Now', value: res.paidAmount ? res.paidAmount : 0 },
                { name: 'Remaining Tax Amount', value: res.remainingAmount ? res.remainingAmount : 0 },
              );



            }
            resolve();
            this.taxdataloader = !this.taxdataloader
          },
          (err) => {
            this.taxdataloader = !this.taxdataloader
            reject(err);
            // this.handleError(err.error.message || 'Something Went Wrong!');
          },
        );
    });
  }

  declarationDetails(): Promise<void> {
    let query = `?userMasterID=${this.userId}&financialYear=${this.fiscalYear}`

    this.taxdataloader = !this.taxdataloader
    return new Promise<void>((resolve, reject) => {
      this.api
        .callApi(this.constant.GETEMPLOYEEDECLARATIONDATAILS + query, {}, 'GET', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.declarationData = res.data;
            }
            resolve();
            this.taxdataloader = !this.taxdataloader
          },
          (err) => {
            this.taxdataloader = !this.taxdataloader
            reject(err);
            // this.handleError(err.error.message || 'Something Went Wrong!');
          },
        );
    });
  }


  // private handleError(message: any) {
  //   this.notifications.create('Error', message, NotificationType.Error, {
  //     theClass: 'outline primary',
  //     timeOut: 3000,
  //     showProgressBar: false,
  //   });
  // }

}
