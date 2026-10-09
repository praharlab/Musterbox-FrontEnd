import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

export interface EMIMonth {
  month: number;
  paid: number;
  interest: number;
  principal: number;
  balance: number;
}

@Component({
    selector: 'app-add-loan-master',
    templateUrl: './add-loan-master.component.html',
    styleUrls: ['./add-loan-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddLoanMasterComponent implements OnInit {
  @ViewChild('addloanMaster') addloanMaster: NgForm;
  @ViewChild('addcomp') addcomp: NgForm;
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
  type: any;
  pastType:string = '';
  i: any;
  selected: boolean = false;
  EMI_Month: number;
  interest: number | null = 0;
  allbranch: any;
  user_Body: {
    companyMasterID: '',
    branchMasterID: ''
  }
  selectedBranch: any[];
  customPaymentObject: { [month: number]: number } = {};
  formValue:any;
  loanId: number | null = null;
  isReadOnly:boolean = false;
  selectedGivenDate: string = '';
  minMonth: any;
  selectedYearMonth: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.getIPAddress();
    if(this.formValue.ListLoanMasterComponent != undefined)
    {
      this.loanId = this.formValue.ListLoanMasterComponent.id;
      this.editdata();
      this.isReadOnly = true;
    }
    this.user_Body = {
      companyMasterID: '',
      branchMasterID: ''
    }
  }

   editdata() {
    let LoanId = this.formValue.ListLoanMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETLOANBYID + LoanId, {}, 'GET', false, true, true)
      .subscribe((res: any) => {
        this.addloanMaster.form.patchValue({
          company: Number(res.data.companyMasterID),
          loanAmount: res.data.LoanAmount,
          loanRemark:res.data.LoanRemark,
        });
        this.selectcompany(Number(res.data.companyMasterID), Number(res.data.userMasterID) );
         this.spinner.stop();
      });
    this.spinner.stop();
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

  getAllUserData(userId:Number = 0) {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, this.user_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.userMaster = '';
          this.spinner.stop();

          if(userId != 0)
          {
            this.addloanMaster.form.patchValue({
              userMasterID: userId 
            });
          }
        }
      });
  }

  selectcompany(event: any, userId:Number = 0) {
    this.employee = [], this.allbranch = [];
    this.userMaster = null, this.selectedBranch = null;
    this.user_Body = {
      companyMasterID: '',
      branchMasterID: ''
    }

    this.company_id = event;

    if (!event) return;

    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('branch');
      });

    this.user_Body.companyMasterID = event;
    this.getAllUserData(userId);  
  }

  selectbranch(id:any) {
    this.employee = [];
    this.userMaster = '';
    this.user_Body.branchMasterID = id;
    this.getAllUserData();
  }

  calcloaninst() {
    if(this.addloanMaster.value.loanAmount == 0)
    {
      this.datearr = [];
      return;
    }
    if (this.addloanMaster.value.loanAmount != '' && this.addloanMaster.value.emiMonth != '') {
      if(this.addloanMaster.value.interest === null || this.addloanMaster.value.interest === '' || this.addloanMaster.value.interest === 0)
      {
        var loaninst =
                Math.round(this.addloanMaster.value.loanAmount) /
                Math.round(this.addloanMaster.value.emiMonth);
      } else 
      {
        const calculateobject = this.calculateEMI(this.addloanMaster.value.loanAmount, this.addloanMaster.value.interest, this.addloanMaster.value.emiMonth)
 
        var loaninst = calculateobject.emi;
        var schedule = calculateobject.schedule;
      }
    }
    let difference = 0;
    if (
      this.addloanMaster.value.loanAmount != '' &&
      this.addloanMaster.value.emiMonth != '' &&
      this.addloanMaster.value.startMonth != ''
    ) {
      this.datearr = [];
      var monthyear = this.addloanMaster.value.startMonth.split('-');
      difference = difference + (loaninst - Math.round(loaninst));
      let datee = new Date();
      datee.setDate(1); 
      datee.setMonth(parseInt(monthyear[1]) - 1);
      datee.setFullYear(parseInt(monthyear[0]));
      this.datearr.push({
        instDate: datee,
        yearmonth: this.addloanMaster.value.startMonth.replace('-', ''),
        instamount: (schedule == undefined) ?  Math.round(loaninst) : Math.round(schedule[0].principal - Math.round(difference)) + Math.round(schedule[0].interest),
        instamount1: Math.round(loaninst),
        Status: 'Pending',
        iseditable: true,
        monthlyInterest: (schedule == undefined) ? 0 : Math.round(schedule[0].interest),
        monthlyPrinciple: (schedule == undefined) ? Math.round(loaninst):  Math.round(schedule[0].principal - Math.round(difference))
      });
      for (var i = 1; i < this.addloanMaster.value.emiMonth; i++) {
        let newmonth = new Date(datee);
        newmonth.setDate(1); 
        newmonth.setMonth(datee.getMonth() + i);
        let monthdata : any;
        monthdata = newmonth.getMonth() + 1;
        if (monthdata.toString().length === 1) {
          monthdata = '0' + monthdata;
        }
        let yearmonth = newmonth.getFullYear() + '' + monthdata.toString();
        difference = difference + (loaninst - Math.round(loaninst));

        if (i == this.addloanMaster.value.emiMonth - 1) {
          this.datearr.push({
            instDate: newmonth,
            yearmonth: parseInt(yearmonth),
            instamount:(schedule == undefined) ? Math.round(loaninst) + Math.round(difference) :  Math.round(schedule[i].principal) + Math.round(schedule[i].interest),
            instamount1: (schedule == undefined) ? Math.round(loaninst) + Math.round(difference) :  Math.round(schedule[i].principal) + Math.round(schedule[i].interest),
            Status: 'Pending',
            iseditable: true,
            monthlyInterest: (schedule == undefined) ? 0 : Math.round(schedule[i].interest),
            monthlyPrinciple: (schedule == undefined) ? Math.round(loaninst) + Math.round(difference) : Math.round(schedule[i].principal +  Math.round(difference))
          });
        } else {
          this.datearr.push({
            instDate: newmonth,
            yearmonth: parseInt(yearmonth),
            instamount: (schedule == undefined) ? Math.round(loaninst) : Math.round(schedule[i].principal) + Math.round(schedule[i].interest),
            instamount1: (schedule == undefined) ? Math.round(loaninst) : Math.round(schedule[i].principal) + Math.round(schedule[i].interest),
            Status: 'Pending',
            iseditable: true,
            monthlyInterest: (schedule == undefined) ? 0 : Math.round(schedule[i].interest),
            monthlyPrinciple: (schedule == undefined) ? Math.round(loaninst) : Math.round(schedule[i].principal)
          });
        }
      }
    }
  }
  selectType(type: any) {
    this.type = type.toString();
    if (this.pastType !== this.type) {
      this.customPaymentObject = {};
      this.pastType = this.type;
    }
    this.selected = true;
    this.datearr[this.i].iseditable = false;

  }

  bifurcate(i: any, event: any) {
    i = this.i;
    event = this.datearr[i].instamount1;
    this.addcomp.resetForm();

    if (!this.selected) {
      return;
    }

    if (this.type == '1') {
      let remaining_amount = 0;

      for (var index = i; index < this.datearr.length; index++) {
        remaining_amount = remaining_amount + this.datearr[index].monthlyPrinciple;
      }

      if (remaining_amount < Number(event)) {
        this.datearr[i].instamount1 = this.datearr[i].instamount;
        this.notifications.create('Error', 'Amount not Valid', NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        return;
      }


      var monthyear = [];
      this.datearr[i].yearmonth = this.datearr[i].yearmonth.toString();
      monthyear.push(this.datearr[i].yearmonth.substring(0, 4));
      monthyear.push(this.datearr[i].yearmonth.substring(4, 6));
      // this.datearr[i].yearmonth.split("-");

      let datee = new Date();
      datee.setDate(1);
      datee.setMonth(parseInt(monthyear[1]) - 1);
      datee.setFullYear(parseInt(monthyear[0]));

     if(this.addloanMaster.value.interest != 0)
      {
        const sameEMIArray = this.calculateLoanTenureFromEMI(remaining_amount, this.addloanMaster.value.interest, Number(event))
        if(sameEMIArray == undefined)
          return;

        this.datearr.splice(i, this.datearr.length - i);

        for (let q = 0; q < sameEMIArray.schedule.length; q++) {
          let newmonth = new Date(datee);
          newmonth.setDate(1); 
          newmonth.setMonth(datee.getMonth() + q);
          newmonth.setFullYear(newmonth.getFullYear());
          let monthdata : any;
          monthdata = newmonth.getMonth() + 1;
          if (monthdata.toString().length === 1) {
            monthdata = '0' + monthdata;
          }
          let yearmonth = newmonth.getFullYear() + '-' + monthdata.toString();
          this.datearr.push({
            'iseditable': true,
            'Status': 'Pending',
            'instDate': new Date(newmonth),
            'instamount': sameEMIArray.schedule[q].emi,
            'instamount1': sameEMIArray.schedule[q].emi,
            'monthlyPrinciple': sameEMIArray.schedule[q].principal,
            'monthlyInterest': sameEMIArray.schedule[q].interest,
            'yearmonth': yearmonth.replace('-', ''),
          });
        }

      } else {
        let temp_datearr = [];

        while (remaining_amount > 0) {
          if (remaining_amount > Number(event)) {
            // let temp = this.datearr[i]
            // temp.EMIAmount1 = Number(event)
            temp_datearr.push(Number(event));
          } else {
            // let temp = this.datearr[i]
            // temp.EMIAmount1 = remaining_amount
            temp_datearr.push(remaining_amount);
          }
          remaining_amount = remaining_amount - Number(event);
        }
        let temp_obj = this.datearr[i];
        // for(var j=i; j<=this.datearr.length; j++){
        //   this.datearr.pop();
        // }
        this.datearr.splice(i, this.datearr.length - i);
        for (let j = 0; j < temp_datearr.length; j++) {
          let newmonth = new Date(datee);
          newmonth.setMonth(datee.getMonth() + j);
          newmonth.setFullYear(newmonth.getFullYear());
          let monthdata : any;
          monthdata = newmonth.getMonth() + 1;
          if (monthdata.toString().length === 1) {
            monthdata = '0' + monthdata;
          }
          let yearmonth = newmonth.getFullYear() + '-' + monthdata.toString();

          var temp = {
            iseditable: true,
            Status: 'Pending',
            instDate: new Date(newmonth),
            instamount: temp_datearr[j],
            instamount1: temp_datearr[j],
            monthlyPrinciple: temp_datearr[j],
            monthlyInterest: 0,
            yearmonth: yearmonth.replace('-', ''),
          };
          this.datearr.push(temp);
        }
      }
    } else if (this.type == '2') {

      let totalEMI = 0;

      for (var j = i; j < this.datearr.length; j++) {
        totalEMI = totalEMI + this.datearr[i].monthlyPrinciple;
      }

      event = Number(event);

      // if (event > totalEMI || event == 0) {
      //   this.datearr[i].instamount1 = this.datearr[i].instamount;
      //   this.notifications.create('Error', 'Amount not Valid', NotificationType.Bare, {
      //     theClass: 'outline primary',
      //     timeOut: 3000,
      //     showProgressBar: false,
      //   });
      //   return;
      // }  

      if (i == this.datearr.length - 1) {
        this.notifications.create(
          'Error',
          'You cannot update these transaction',
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
        this.datearr[i].instamount1 = this.datearr[i].instamount;
        return;
      }

      if (event > this.datearr[i].instamount) {
        if(this.addloanMaster.value.interest != 0)
        { 
          const changeValueMonth: number = i + 1;
          Object.keys(this.customPaymentObject).forEach(key => +key > changeValueMonth && delete this.customPaymentObject[key]);
   
          this.customPaymentObject[changeValueMonth] = Number(event);       
          const calculateNewEMIS = this.calculateFlexibleEMI(Number(this.addloanMaster.value.loanAmount), this.addloanMaster.value.interest,this.addloanMaster.value.emiMonth,this.customPaymentObject);
          const sumPrincipal = Object.values(calculateNewEMIS).reduce((sum, item) => sum + (item.principal || 0), 0);
          if (Number(this.addloanMaster.value.loanAmount) != sumPrincipal) {
            this.datearr[i].instamount1 = this.datearr[i].instamount;
            this.notifications.create('Error', 'Amount not Valid', NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            return;
          }

          for(let b = 0;b <= this.datearr.length - 1;b++ )
          {
            const paidInstAmount = (calculateNewEMIS[b] == undefined) ? 0 : calculateNewEMIS[b].paid;
            const principleAmount = (calculateNewEMIS[b] == undefined) ? 0 : calculateNewEMIS[b].principal;
            const interestAmount = (calculateNewEMIS[b] == undefined) ? 0 : calculateNewEMIS[b].interest;
                      
            this.datearr[b].instamount = paidInstAmount;
            this.datearr[b].instamount1 = paidInstAmount;
            this.datearr[b].monthlyPrinciple = principleAmount;
            this.datearr[b].monthlyInterest = interestAmount;
          }
        } else {
          const difference = event - this.datearr[i].instamount;
          const Months_Changed = this.datearr.length - 1 - i;
          const difference_Amount = difference / Months_Changed; //-
          let difference_decimal = 0;

          this.datearr[i].instamount = event;
          this.datearr[i].instamount1 = event;
          this.datearr[i].monthlyPrinciple = event;

          for (var index = i + 1; index < this.datearr.length; index++) {
            difference_decimal =
              difference_decimal + (difference_Amount - Math.floor(difference_Amount));

            this.datearr[index].instamount =
              this.datearr[index].instamount - Math.floor(difference_Amount);
            this.datearr[index].instamount1 =
              this.datearr[index].instamount1 - Math.floor(difference_Amount);
            this.datearr[i].monthlyPrinciple =   this.datearr[index].instamount1 - Math.floor(difference_Amount);

            if (index == this.datearr.length - 1) {
              this.datearr[index].instamount =
                this.datearr[index].instamount - Math.round(difference_decimal);
              this.datearr[index].instamount1 =
                this.datearr[index].instamount1 - Math.round(difference_decimal);
              this.datearr[i].monthlyPrinciple =  this.datearr[index].instamount1 - Math.round(difference_decimal);
            }
          }
        }
      } else if (event < this.datearr[i].instamount) {
         if(this.addloanMaster.value.interest != 0)
        { 
          const changeValueMonth: number = i + 1;
          Object.keys(this.customPaymentObject).forEach(key => +key > changeValueMonth && delete this.customPaymentObject[key]);
          this.customPaymentObject[changeValueMonth] = Number(event);  
          const calculateNewEMIS = this.calculateFlexibleEMI(Number(this.addloanMaster.value.loanAmount), this.addloanMaster.value.interest,this.addloanMaster.value.emiMonth,this.customPaymentObject);
          
          for(let b = 0;b <= this.datearr.length - 1;b++ )
          {
            const paidInstAmount = (calculateNewEMIS[b] == undefined) ? 0 : calculateNewEMIS[b].paid;
            const principleAmount = (calculateNewEMIS[b] == undefined) ? 0 : calculateNewEMIS[b].principal;
            const interestAmount = (calculateNewEMIS[b] == undefined) ? 0 : calculateNewEMIS[b].interest;
                      
            this.datearr[b].instamount = paidInstAmount;
            this.datearr[b].instamount1 = paidInstAmount;
            this.datearr[b].monthlyPrinciple = principleAmount;
            this.datearr[b].monthlyInterest = interestAmount;
          }
        } else 
        {
          const difference = this.datearr[i].instamount - event;
          const Months_Changed = this.datearr.length - 1 - i;
          const difference_Amount = difference / Months_Changed; //-
          let difference_decimal = 0;

          this.datearr[i].instamount = event;
          this.datearr[i].instamount1 = event;
          this.datearr[i].monthlyPrinciple = event;
          this.datearr[i].monthlyInterest = 0;

          for (var index = i + 1; index < this.datearr.length; index++) {
            difference_decimal =
              difference_decimal + (difference_Amount - Math.floor(difference_Amount));

            this.datearr[index].instamount =
              this.datearr[index].instamount + Math.floor(difference_Amount);
            this.datearr[index].instamount1 =
              this.datearr[index].instamount1 + Math.floor(difference_Amount);
            this.datearr[index].monthlyPrinciple =
              this.datearr[index].monthlyPrinciple + Math.floor(difference_Amount);
            this.datearr[i].monthlyInterest = 0;

            if (index == this.datearr.length - 1) {

              this.datearr[index].instamount =
                this.datearr[index].instamount + Math.round(difference_decimal);
              this.datearr[index].instamount1 =
                this.datearr[index].instamount1 + Math.round(difference_decimal);
              this.datearr[index].monthlyPrinciple =
                this.datearr[index].monthlyPrinciple + Math.round(difference_decimal);
            }
          }
        }
      }
    }

    this.EMI_Month = this.datearr.length;
  }

  changeAmount(i: any) {
    this.addcomp.resetForm();
    this.type = '';
    this.i = i;
    this.datearr.forEach((element) => {
      element.iseditable = true;
    });
  }
  
  onSubmit() {
    if (!this.addloanMaster.valid) {
      return;
    }

    if(Number(this.addloanMaster.value.emiMonth) < 1 || Number(this.addloanMaster.value.emiMonth) > 360)
    {
      this.notifications.create('Error', '  Please enter EMI duration between 1 and 360 months.', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }

    let totalAmount = 0;
    this.datearr.forEach((element) => {
      totalAmount = totalAmount + element.instamount;
    });
    if (totalAmount != Number(this.addloanMaster.value.loanAmount) && this.addloanMaster.value.interest === 0 ) {
      this.notifications.create('Error', 'Amount Does not Match', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }

    let body = {};

    if (this.childcompany == 'true') {
      body = {
        userMasterID: this.addloanMaster.value.userMasterID,
        companyMasterID: this.addloanMaster.value.company,
        LoanAmount: this.addloanMaster.value.loanAmount,
        LoanRemark: this.addloanMaster.value.loanRemark,
        EMIMonths: this.EMI_Month,
        interest: this.interest,
        givenDate: this.addloanMaster.value.givenDate,
        startMonth: this.addloanMaster.value.startMonth.replace('-', ''),
        paymentmode: this.addloanMaster.value.paymentmode,
        referenceNO: this.addloanMaster.value.referenceNo,
        referenceDate: this.addloanMaster.value.referencedate,
        loanTransaction: this.datearr,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        userMasterID: this.addloanMaster.value.userMasterID,
        companyMasterID: this.addloanMaster.value.company,
        LoanAmount: this.addloanMaster.value.loanAmount,
        LoanRemark: this.addloanMaster.value.loanRemark,
        EMIMonths: this.EMI_Month,
        interest: this.interest,
        givenDate: this.addloanMaster.value.givenDate,
        startMonth: this.addloanMaster.value.startMonth.replace('-', ''),
        paymentmode: this.addloanMaster.value.paymentmode,
        referenceNO: this.addloanMaster.value.referenceNo,
        referenceDate: this.addloanMaster.value.referencedate,
        loanTransaction: this.datearr,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }
      
    if (this.loanId != null) {
      (body as any).LoanID = this.loanId;  
      (body as any).updateBy = localStorage.getItem('id');
      (body as any).updateByIp =  this.ipAddress;
    }

    this.api.callApi(this.constant.CREATELOANMASTER, body, 'POST', true, true, true).subscribe(
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
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.isdisabled = false;
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.isdisabled = false;
        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  calculateEMI(
    principal: number,
    annualInterestRate: number,
    months: number
  ): {
    emi: number;
    totalInterest: number;
    totalPrincipal: number;
    schedule: Array<{
      month: number;
      interest: number;
      principal: number;
      balance: number;
    }>; 
  } {
    const monthlyRate = annualInterestRate / (12 * 100);
    const emi =
      Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1));

    let balance = principal;
    let totalInterest = 0;
    let totalPrincipalPaid = 0;
    const schedule = [];

    for (let i = 1; i <= months; i++) {
      const interestForMonth =  Math.round(balance * monthlyRate);
      let principalForMonth = Math.round(emi - interestForMonth);

      const interestRounded = Math.round(interestForMonth * 100) / 100;
      let principalRounded = Math.round(principalForMonth * 100) / 100;

      if (i === months) {
        principalRounded = Math.round((principal - totalPrincipalPaid) * 100) / 100;
      }

      balance -= principalRounded;
      totalPrincipalPaid += principalRounded;
      totalInterest += interestRounded;

      schedule.push({
        month: i,
        interest: interestRounded,
        principal: principalRounded,
        balance: Math.round(balance * 100) / 100,
      });
    }

    return {
      emi: Math.round(emi * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPrincipal: Math.round(totalPrincipalPaid * 100) / 100,
      schedule,
    };
  }


  calculateFlexibleEMI(
    principal: number,
    annualInterest: number,
    months: number,
    customPayments: { [month: number]: number } = {}
  ): EMIMonth[] {
    const monthlyRate = annualInterest / (12 * 100);
    let balance = principal;
    const schedule: EMIMonth[] = [];

    for (let i = 1; i <= months; i++) {
      const interest = Math.round((balance * monthlyRate));

      let payment = customPayments[i];
      if (!payment) {
        const remainingMonths = months - i + 1;
        payment = Math.round(
          (
            (balance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
            (Math.pow(1 + monthlyRate, remainingMonths) - 1)
          )
        );
      }

      const principalPart = Math.round((payment - interest));
      balance = Math.round((balance - principalPart));

      schedule.push({
        month: i,
        paid: payment,
        interest: interest,
        principal: principalPart,
        balance: balance < 0 ? 0 : balance,
      });

      if (balance <= 0) break;
    }

    return schedule;
  }

  calculateLoanTenureFromEMI(
      principal: number,
      annualInterestRate: number,
      fixedEMI: number
    ): {
      months: number;
      totalInterest: number;
      totalPrincipal: number;
      schedule: Array<{
        month: number;
        interest: number;
        principal: number;
        emi: number;
        balance: number;
      }>;
    } {
      const monthlyRate = annualInterestRate / (12 * 100);
      let balance = principal;
      let totalInterest = 0;
      const schedule = [];
      let months = 0;

      const round = (value: number) => Math.round(value);

      while (round(balance) > 0) {
        const interestForMonth = balance * monthlyRate;
        let principalForMonth = fixedEMI - interestForMonth;

        if (principalForMonth <= 0) {
           this.notifications.create('Error', 'EMI too low to cover interest. Increase EMI amount.', NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          return;
        }

        if (principalForMonth > balance) {
          principalForMonth = balance;
        }

        const roundedInterest = round(interestForMonth);
        const roundedPrincipal = round(principalForMonth);
        const roundedEMI = round(roundedInterest + roundedPrincipal);

        balance -= roundedPrincipal;
        balance = round(balance);
        totalInterest += roundedInterest;

        schedule.push({
          month: ++months,
          interest: roundedInterest,
          principal: roundedPrincipal,
          emi: roundedEMI,
          balance: balance < 0 ? 0 : balance
        });
      }

      return {
        months,
        totalInterest: round(totalInterest),
        totalPrincipal: round(principal),
        schedule
      };
    }

    validateEMIMonth(event: any) {
      let value = +event.target.value;

      if (value < 0) {
        this.EMI_Month = 0;
        this.addloanMaster.form.patchValue({
          emiMonth: this.EMI_Month
        });
      } else if (value > 360) {
        this.EMI_Month = 360;
        this.addloanMaster.form.patchValue({
          emiMonth: this.EMI_Month
        });
      }
    }

    validateInterest(event: any) {
      let value = +event.target.value;

      if (value < 0) {
        this.interest = 0;
        this.addloanMaster.form.patchValue({
          interest:this.interest
        });
      } else if (value > 30) {
        this.interest = 30;
        this.addloanMaster.form.patchValue({
          interest:this.interest
        });
      }
    }

    validateLoanAmount(event: any)
    {
      let value = +event.target.value;

      if (value < 0) {
        this.addloanMaster.value.loanAmount = 0;
      } 

      if (event.target.value < 0) {
        value = 0;
        event.target.value = value;
        this.addloanMaster.value.loanAmount = value;
      }
    }

    selectAdvanceDate(event: any) {
    this.selectedYearMonth = '';
    this.selectedGivenDate = event.target.value;
    const selectedDate = new Date(this.selectedGivenDate);

    // Set minMonth to next month (or same month if you prefer)
    const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

    // Format to yyyy-MM (which is what <input type="month"> expects)
    const year = nextMonth.getFullYear();
    const month = (nextMonth.getMonth() + 1).toString().padStart(2, '0');
    this.minMonth = `${year}-${month}`;
  }

  preventBackMonth(event: KeyboardEvent) {
    event.preventDefault();
    return;
  }
}
