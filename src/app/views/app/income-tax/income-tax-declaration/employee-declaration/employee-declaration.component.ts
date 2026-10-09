import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-employee-declaration',
    templateUrl: './employee-declaration.component.html',
    styleUrls: ['./employee-declaration.component.scss', '../loader/loader.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeDeclarationComponent implements OnInit {
  @Input() data: any;

  fiscalYear: string;
  scrollBarHorizontal: boolean;
  userId: string;
  myDeclationData: any = [];
  loaderstatus: boolean = false;
  taxdataloader: boolean = false;
  myTaxData: any = [];
  @Input()
  set selectedFiscalYear(selectedFiscalYear: string) {
    this.fiscalYear = selectedFiscalYear;
  }

  texDeductionDetails = {
    title: 'Monthly Tax Deduction Details',
    titleDesc:
      'Below deductions are based on your declared amount. Tax amount may change based on the amount approved.',
  };



  myDeclationHeaderNames: string[] = [
    'DECLARATIONS',
    'NO OF DECLARATIONS',
    'AMOUNT DECLARED',
    'PROOF SUBMITTED',
    'AMOUNT REJECTED',
    'AMOUNT ACCEPTED',
    'ACTUAL DEDUCTION'
  ];



  taxAmount: any[] = [];
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
    setTimeout(() => {
      this.employeeDeclarationData();
      this.employeeTaxData()
    }, 100);


  }

  employeeDeclarationData() {

    let query = `?userMasterID=${this.userId}&financialYear=${this.fiscalYear}`

    this.loaderstatus = !this.loaderstatus
    this.api
      .callApi(this.constant.GETEMPLOYEEDECLARATIONDATAILS + query, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.myDeclationData = res.data;
          }
          this.loaderstatus = !this.loaderstatus
        },
        (err) => {
          this.loaderstatus = !this.loaderstatus
          this.handleError(err.error.message || 'Something Went Wrong!');
        },
      );
  }


  employeeTaxData() {
    this.taxAmount = []
    this.taxdataloader = !this.taxdataloader
    this.api
      .callApi(this.constant.GETYEARLYEMPLOYEEINCOMETAX + `?userMasterID=${this.userId}&financialYear=${this.fiscalYear}`, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.myTaxData = res.data;
            this.taxAmount.push(
              { name: 'Total Tax Payable', value: res.payableAmount ? res.payableAmount : 0 },
              { name: 'Tax Paid Till Now', value: res.paidAmount ? res.paidAmount : 0 },
              { name: 'Remaining Tax Amount', value: res.remainingAmount ? res.remainingAmount : 0 },
            )
          }
          this.taxdataloader = !this.taxdataloader
        },
        (err) => {
          this.taxdataloader = !this.taxdataloader
          this.handleError(err.error.message || 'Something Went Wrong!');
        },
      );
  }


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
