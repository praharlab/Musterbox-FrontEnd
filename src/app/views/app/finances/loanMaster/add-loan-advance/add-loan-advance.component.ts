import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-add-loan-advance',
    templateUrl: './add-loan-advance.component.html',
    styleUrls: ['./add-loan-advance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddLoanAdvanceComponent implements OnInit {
  @ViewChild('addloanMaster') addloanMaster: NgForm;
  adminRoot = environment.adminRoot;

  isdisabled = false;
  ipAddress: any;
  usertype: any;
  company_id: any;
  allcomp: any;
  childcompany: any;
  company: any;
  yearmonth: any;
  employee: any;
  userMaster: any;
  datearr: any[];
  loandata: any;
  editable: boolean = true;
  paidInst: any = 0;
  pendingInst: any = 0;
  AdvanceData: any = 0;
  LoanAdvance: any;
  loandata1: any;
  formValue: any;
  minDate: string;
  maxDate: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private datepipe: DatePipe,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.getIPAddress();
    this.editdata();
    
    const { startDate, endDate } = this.getMonthStartAndEndDates();

    this.minDate = startDate;
    this.maxDate = endDate;
  }

  getMonthStartAndEndDates() {
    const today = new Date();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formatDate = (date:any) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      startDate: formatDate(startOfMonth),
      endDate: formatDate(endOfMonth),
    };
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  editdata() {
    let LoanId = this.formValue.ListLoanMasterComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETLOANBYID + LoanId, {}, 'GET', false, true, true)
      .subscribe((res: any) => {
        this.loandata = res.data;
        this.loandata.startMonth =
          JSON.stringify(this.loandata.startMonth).slice(0, 4) +
          '-' +
          JSON.stringify(this.loandata.startMonth).slice(4);
        this.loandata.userMasterID = parseInt(this.loandata.userMasterID);
        this.loandata.companyMasterID = parseInt(this.loandata.companyMasterID);
        this.loandata.givenDate = this.datepipe.transform(this.loandata.givenDate, 'yyyy-MM-dd');
        this.datearr = res.childData;
        this.LoanAdvance = res.LoanAdvance;
        this.datearr.forEach((element) => {
          element.EMIMonth = element.EMIMonth.slice(0, 4) + '-' + element.EMIMonth.slice(4);
          element.EMIAmount1 = element.EMIAmount;
          if (element.RefrenceId != null) {
            this.paidInst = this.paidInst + Math.round(element.monthlyPrinciple);
            this.editable = false;
          }
        });
        if (this.LoanAdvance.length != 0) {
          this.LoanAdvance.forEach((element) => {
            this.AdvanceData = this.AdvanceData + parseFloat(element.Amount);
          });
        }
        let bb = {
          page: '',
          limit: '',
          companyMasterID: this.loandata.companyMasterID,
        };
        // this.spinner.start()
        this.api
          .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.employee = res.data;
            }
          });
        this.spinner.stop('edit');
      });
  }

  changeMonth(i: any) {
    var datee,
      ind = 0;
    this.isdisabled = false;
    this.datearr.map((element, index) => {
      if (i == index) {
        var monthyear = element.EMIMonth.split('-');
        datee = new Date();
        datee.setMonth(parseInt(monthyear[1]) - 1);
        datee.setFullYear(parseInt(monthyear[0]));
        ind = 1;
      }
      // if(i > index){
      //     if(i == index){
      //       alert("Previous Month");
      //     }
      // }
      if (i < index) {
        let newmonth = new Date();
        newmonth.setMonth(datee.getMonth() + ind);
        let monthdata;
        monthdata = newmonth.getMonth() + 1;
        if (monthdata.toString().length === 1) {
          monthdata = '0' + monthdata;
        }
        let yearmonth = newmonth.getFullYear() + '-' + monthdata.toString();
        element.EMIMonth = yearmonth;
        ind++;
      }
    });
  }

  changepayment() {
    var loanbal = this.loandata.LoanAmount - this.paidInst - this.AdvanceData;
    if (loanbal < this.addloanMaster.value.cashpayment) {
      this.isdisabled = true;
      this.notifications.create(
        'Error',
        'CashPayment is morethan LoanBalance!!',
        NotificationType.Bare,
        { 
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
    } else {
      if(this.loandata.interest == 0)
      {
        this.isdisabled = false;
        let finalbal = loanbal - this.addloanMaster.value.cashpayment;
        let noofemi = this.datearr.filter((d1) => d1.RefrenceId == null);
        let emiAmount = Number((finalbal / noofemi.length).toFixed(2));
        let finalAmount = Number(this.addloanMaster.value.cashpayment) / Number(noofemi.length);

        let difference = 0;
        this.datearr.forEach((data) => {
          difference = difference + (finalAmount - Math.floor(finalAmount));
          if (data.RefrenceId == null) {
            data.EMIAmount1 = Number(data.EMIAmount) - Math.floor(finalAmount);
            data.monthlyPrinciple = Number(data.EMIAmount) - Math.floor(finalAmount);
          } else {
            data.EMIAmount1 = data.EMIAmount;
            data.monthlyPrinciple = data.EMIAmount;
          }
        });
        this.datearr[this.datearr.length - 1].EMIAmount1 =
          this.datearr[this.datearr.length - 1].EMIAmount1 - Math.round(difference);
      } else 
      {
        this.isdisabled = false;
        let finalbal = loanbal - this.addloanMaster.value.cashpayment;
        
        let noofemi = this.datearr.filter((d1) => d1.RefrenceId == null);
        const remianingEMI = this.calculateEMIDetails(finalbal, noofemi.length,this.loandata.interest);        // let emiAmount = Number((finalbal / noofemi.length).toFixed(2));
        let o = 0;
        this.datearr.forEach((data) => {
          if (data.RefrenceId == null) {
            data.EMIAmount1 = remianingEMI.schedule[o].emi
            data.monthlyPrinciple = remianingEMI.schedule[o].principal;
            data.monthlyInterest =  remianingEMI.schedule[o].interest;
            o++;
          } 
        });
      } 
    }
  }

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  selectcompany(ev: any) {
    this.company = ev;
    let bb = {
      page: '',
      limit: '',
      companyMasterID: this.company,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.userMaster = '';
          this.spinner.stop();
        }
      });
  }

  calcloaninst() {
    if (this.addloanMaster.value.loanAmount != '' && this.addloanMaster.value.emiMonth != '') {
      var loaninst =
        parseFloat(this.addloanMaster.value.loanAmount) /
        parseFloat(this.addloanMaster.value.emiMonth);
    }
    let difference = 0;

    if (
      this.addloanMaster.value.loanAmount != '' &&
      this.addloanMaster.value.emiMonth != '' &&
      this.addloanMaster.value.startMonth != ''
    ) {
      this.datearr = [];
      var monthyear = this.addloanMaster.value.startMonth.split('-');
      let datee = new Date();
      difference = difference + (loaninst - Math.floor(loaninst));

      datee.setMonth(parseInt(monthyear[1]) - 1);
      datee.setFullYear(parseInt(monthyear[0]));
      this.datearr.push({
        instDate: datee,
        yearmonth: this.addloanMaster.value.startMonth.replace('-', ''),
        instamount: Math.floor(loaninst),
        Status: 'Pending',
      });
      for (var i = 1; i < this.addloanMaster.value.emiMonth; i++) {
        let newmonth = new Date();
        newmonth.setMonth(datee.getMonth() + i);
        let monthdata : any;
        monthdata = newmonth.getMonth() + 1;
        if (monthdata.toString().length === 1) {
          monthdata = '0' + monthdata;
        }
        let yearmonth = newmonth.getFullYear() + '' + monthdata.toString();
        difference = difference + (loaninst - Math.floor(loaninst));

        if (i == this.addloanMaster.value.emiMonth - 1) {
          this.datearr.push({
            instDate: newmonth,
            yearmonth: parseInt(yearmonth),
            instamount: Math.floor(loaninst) + Math.round(difference),
            Status: 'Pending',
            iseditable: true,
          });
        } else {
          this.datearr.push({
            instDate: newmonth,
            yearmonth: parseInt(yearmonth),
            instamount: Math.floor(loaninst),
            Status: 'Pending',
            iseditable: true,
          });
        }
      }
    }
  }

  onSubmit() {
    if (!this.addloanMaster.valid) {
      return;
    }



    var duplictedata;
    this.datearr.forEach((e, index) => {
      this.datearr.forEach((e1, index1) => {
        if (e.EMIMonth == e1.EMIMonth && index != index1) {
          duplictedata = 'true';
        }
      });
    });
    if (duplictedata != 'true') {
      this.datearr.forEach((element) => {
        element.EMIMonth = element.EMIMonth.replace('-', '');
        (element.updateBy = localStorage.getItem('id')), (element.EMIAmount = element.EMIAmount1);
        element.updateByIp = this.ipAddress;
      });

      let body = {
        LoanID: this.formValue.ListLoanMasterComponent.id,
        Amount: this.addloanMaster.value.cashpayment,
        remarks: this.addloanMaster.value.advanceRemark,
        givenDate: this.addloanMaster.value.givenDate,
        paymentmode: this.addloanMaster.value.paymentmode,
        refrenceNo: this.addloanMaster.value.refrenceNo ? this.addloanMaster.value.refrenceNo : 0,
        referenceDate: this.addloanMaster.value.referenceDate
          ? this.addloanMaster.value.referenceDate
          : '0000-00-00',
        loanTransaction: this.datearr,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };

      this.api.callApi(this.constant.ADDLOANADVANCE, body, 'POST', true, true, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/finances/loanMaster']);
              this.isdisabled = false;
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.isdisabled = false;
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.isdisabled = false;
          this.spinner.stop();
        },
      );
    } else {
      this.isdisabled = true;
      this.notifications.create(
        'Error',
        'Duplicate EMIMonth Found !! Please Change and Try Again!!',
        NotificationType.Error,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  navigateToLoanAdvancePage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListLoanMasterComponent',
      this.formValue.ListLoanMasterComponent.body,
      '/finances/loanAdvance',
      rowData.LoanID,
    );
  }

  calculateEMIDetails(principal: number, months: number, annualInterestRate: number) {
    const monthlyRate = annualInterestRate / 12 / 100;

    const rawEmi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                   (Math.pow(1 + monthlyRate, months) - 1);

    const emi = Math.round(rawEmi);

    const breakdown = [];
    let remainingPrincipal = Math.round(principal);

    for (let i = 1; i <= months; i++) {
      const interest = Math.round(remainingPrincipal * monthlyRate);
      let principalPayment = emi - interest;

      if (i === months) {
        principalPayment = remainingPrincipal;
      }

      const actualEmi = interest + principalPayment;
      remainingPrincipal = remainingPrincipal - principalPayment;

      breakdown.push({
        month: i,
        emi: Math.round(actualEmi),
        interest: interest,
        principal: principalPayment,
        balance: Math.max(0, Math.round(remainingPrincipal)) 
      });
    }

    const totalPayable = breakdown.reduce((sum, row) => sum + row.emi, 0);
    const totalInterest = totalPayable - principal;

    return {
      emi: emi,
      totalPayable: Math.round(totalPayable),
      totalInterest: Math.round(totalInterest),
      schedule: breakdown
    };
  }

  validateLoanAmount(event: any)
  {
    let value = +event.target.value;

    if (value < 0) {
      this.addloanMaster.value.cashpayment = 0;
    } 

    if (event.target.value < 0) {
      value = 0;
      event.target.value = value;
      this.addloanMaster.value.cashpayment = value;
    }
  }
}
