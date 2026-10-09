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
export interface EMIMonth {
  month: number;
  paid: number;
  interest: number;
  principal: number;
  balance: number;
}
@Component({
    selector: 'app-edit-loan-master',
    templateUrl: './edit-loan-master.component.html',
    styleUrls: ['./edit-loan-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditLoanMasterComponent implements OnInit {
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
  loandata: any;
  editable: boolean = true;
  LoanAdvance: any;
  advances: any = [];
  type: any;
  pastType:string = '';
  i: any;
  selected: boolean = false;
  formValue: any;
  allDataArray: any = [];
  customPaymentObject: { [month: number]: number } = {};
  lastPaidIndex:any;
  minMonth: any;

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
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.getIPAddress();
    this.editdata();
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

        this.selectGivenDate(false)

        this.datearr = res.childData;
        this.LoanAdvance = res.LoanAdvance;
        this.datearr.forEach((element) => {
          element.EMIMonth = element.EMIMonth.slice(0, 4) + '-' + element.EMIMonth.slice(4);
          element.iseditable = true;
          element.EMIAmount1 = element.EMIAmount;
          if (element.RefrenceId != null) {
            this.editable = true;
          }
        });
        const lastRefItem = [...this.datearr].reverse().find(item => item.RefrenceId !== null);
        const lastRefId = lastRefItem?.RefrenceId;
        this.lastPaidIndex = lastRefItem ? this.datearr.indexOf(lastRefItem) : -1;

        this.allDataArray = JSON.parse(JSON.stringify(this.datearr));

        if (this.LoanAdvance.length != 0) {
          this.editable = false;
        }
        let bb = {
          companyMasterID: this.loandata.companyMasterID,
        };
        this.spinner.start('emp');
        this.api
          .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.employee = res.data;
            }
            this.spinner.stop('emp');
          });

        this.spinner.start('emp1');
        this.api
          .callApi(
            this.constant.LoanAdvanceBYID + '/' + this.formValue.ListLoanMasterComponent.id,
            {},
            'GET',
            true,
            false,
            true,
          )
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.advances = res.data;
              this.spinner.stop('emp1');
            }
          });

        this.spinner.stop('edit');
      });
  }

  changeMonth(i: any) {
    if (!this.datearr[i].EMIMonth) {
      this.datearr[i].EMIMonth = this.allDataArray[i].EMIMonth;

      return this.notifications.create('Error', 'Month can not be empty.', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }

    let datee: any;
    this.isdisabled = false;
    var remainingAmount = 0
    var changeEMIBeforDateMonth = '';
    this.datearr.map((element, index) => {
      if(index < i){
        remainingAmount = remainingAmount + element.monthlyPrinciple;
        changeEMIBeforDateMonth = element.EMIMonth;
      }

      if (i == index) {
        var monthyear = element.EMIMonth.split('-');
        datee = new Date();
        datee.setDate(1); 
        datee.setMonth(parseInt(monthyear[1]) - 1);
        datee.setFullYear(parseInt(monthyear[0]));

        
        const principal =  this.loandata.LoanAmount  - remainingAmount;          
        const juneInterest = principal * (Number(this.loandata.interest) / 12 / 100);  
        const skippedMonthsCount = this.getMonthDifference(changeEMIBeforDateMonth, element.EMIMonth);  
        const annualRate = Number(this.loandata.interest);
      
        const result = this.calculateTotalInterestWithSkippedMonths(
          principal,
          juneInterest,
          skippedMonthsCount,
          annualRate
        );

        this.loandata.LoanAmount = this.loandata.LoanAmount + result.skippedInterest;
        this.addloanMaster.value.loanAmount = this.loandata.LoanAmount;
        let lastMonthInterest = result.totalInterest - result.skippedInterest
        element.EMIAmount1 = element.monthlyPrinciple + result.skippedInterest + lastMonthInterest;
        element.EMIAmount = element.monthlyPrinciple + result.skippedInterest + lastMonthInterest;
        element.monthlyPrinciple = element.monthlyPrinciple + result.skippedInterest;
        element.monthlyInterest = lastMonthInterest;
      }

      if (i < index) {
        datee.setMonth(datee.getMonth() + 1);
        let monthdata = datee.getMonth() + 1;
        if (monthdata.toString().length === 1) {
          monthdata = '0' + monthdata;
        }
        let yearmonth = datee.getFullYear() + '-' + monthdata.toString();

        element.EMIMonth = yearmonth;
      }
    });
    
    this.allDataArray = JSON.parse(JSON.stringify(this.datearr));
  }

  changeAmount(i: any) {
    this.addcomp.resetForm();
    this.type = '';
    this.i = i;
    this.datearr.forEach((element) => {
      element.iseditable = true;
    });
    this.isdisabled = true;
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
    this.isdisabled = false;
    i = this.i;
    event = this.datearr[i].EMIAmount1;
    this.addcomp.resetForm();

    if (!this.selected) {
      return;
    }

    let remaining_amount = 0;

    for (var index = i; index < this.datearr.length; index++) {
      remaining_amount = remaining_amount + this.datearr[index].monthlyPrinciple;
    }

    if (remaining_amount < Number(event)) {
      this.datearr[i].EMIAmount1 = this.datearr[i].EMIAmount;
      this.notifications.create('Error', 'Amount not Valid', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }
    

    if (this.type == '1') {
      if(this.loandata.interest != 0)
      {
        let temp_obj = this.datearr[i];
        const sameEMIArray = this.calculateLoanTenureFromEMI(remaining_amount,this.loandata.interest, Number(event));
        if(sameEMIArray == undefined)
        {
          return; 
        }
        var monthyear = this.datearr[i].EMIMonth.split('-');
        let datee = new Date();
        datee.setDate(1); 
        datee.setMonth(parseInt(monthyear[1]) - 1);
        datee.setFullYear(parseInt(monthyear[0]));
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
            BalAmount: null,
            EMIAmount: sameEMIArray.schedule[q].emi,
            EMIAmount1: sameEMIArray.schedule[q].emi,
            monthlyPrinciple: sameEMIArray.schedule[q].principal,
            monthlyInterest: sameEMIArray.schedule[q].interest,
            EMIMonth: yearmonth,
            LoanID: temp_obj.LoanID,
            LoanTrasactionId: temp_obj.LoanTrasactionId,
            RefrenceId: null,
            TableName: null,
            createBy: temp_obj.createBy,
            createByIp: temp_obj.createByIp,
            createdAt: temp_obj.createdAt,
            iseditable: true,
            status: 1,
            updateBy: temp_obj.updateBy,
            updateByIp: temp_obj.updateByIp,
            updatedAt: temp_obj.updatedAt,
          }); 
        }
      } else 
      {
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

        var monthyear = this.datearr[i].EMIMonth.split('-');

        let datee = new Date();
        datee.setDate(1); 
        datee.setMonth(parseInt(monthyear[1]) - 1);
        datee.setFullYear(parseInt(monthyear[0]));

        this.datearr.splice(i, this.datearr.length - i);
        for (let j = 0; j < temp_datearr.length; j++) {
          let newmonth = new Date(datee);
          newmonth.setDate(1); 
          newmonth.setMonth(datee.getMonth() + j);
          newmonth.setFullYear(newmonth.getFullYear());
          let monthdata: any;
          monthdata = newmonth.getMonth() + 1;
          if (monthdata.toString().length === 1) {
            monthdata = '0' + monthdata;
          }
          let yearmonth = newmonth.getFullYear() + '-' + monthdata.toString();

          var temp = {
            BalAmount: null,
            EMIAmount: temp_datearr[j],
            EMIAmount1: temp_datearr[j],
            monthlyPrinciple: temp_datearr[j],
            monthlyInterest: 0,
            EMIMonth: yearmonth,
            LoanID: temp_obj.LoanID,
            LoanTrasactionId: temp_obj.LoanTrasactionId,
            RefrenceId: null,
            TableName: null,
            createBy: temp_obj.createBy,
            createByIp: temp_obj.createByIp,
            createdAt: temp_obj.createdAt,
            iseditable: true,
            status: 1,
            updateBy: temp_obj.updateBy,
            updateByIp: temp_obj.updateByIp,
            updatedAt: temp_obj.updatedAt,
          };
          this.datearr.push(temp);
        }
      }
    } else if (this.type == '2') {
      let totalEMI = 0;
     
      // let totalPrincipleAmount = 0

      for (var j = i; j < this.datearr.length; j++) {
        totalEMI =  totalEMI +  this.datearr[i].monthlyPrinciple;
        // totalPrincipleAmount = (this.addloanMaster.value.interest == 0) ?  totalEMI + this.datearr[i].EMIAmount : totalEMI + this.datearr[i].monthlyPrinciple;
      }

      event = Number(event);

      if (event > totalEMI || event == 0) {
        this.datearr[i].EMIAmount1 = this.datearr[i].EMIAmount;
        this.notifications.create('Error', 'Amount not Valid', NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        return;
      }

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
        this.datearr[i].EMIAmount1 = this.datearr[i].EMIAmount;
        return;
      }

      if (event > this.datearr[i].EMIAmount) {
        if(this.loandata.interest != 0)
        {
          const paidAmount = this.datearr.reduce((acc, data) => {
            if (data.RefrenceId != null) {
              return acc + Math.round(data.monthlyPrinciple || 0);
            }
            return acc;
          }, 0);
         
          let noofemi = this.datearr.filter((d1) => d1.RefrenceId == null);
  
          const totalAdvancePayment = this.advances.reduce((sum:number, item:any) => sum + (item.Amount || 0), 0);

          const remainingAmount = Number(this.loandata.LoanAmount) - paidAmount - totalAdvancePayment;

          const changeValueMonth: number = i + 1;
          Object.keys(this.customPaymentObject).forEach(key => +key > changeValueMonth && delete this.customPaymentObject[key]);
          this.customPaymentObject[changeValueMonth] = Number(event);  
         
          const calculateNewEMIS = this.calculateFlexibleEMI(Number(remainingAmount), this.loandata.interest, this.loandata.EMIMonths,this.customPaymentObject, this.loandata.EMIMonths - noofemi.length)
      
       
          var newEMICalculateIndex = 0
          for(let b = 0;b <= this.datearr.length - 1;b++ )
          {
            if(b > this.lastPaidIndex)
            {
              const paidInstAmount = (calculateNewEMIS[b] == undefined) ? 0 : (this.datearr[b].RefrenceId != null) ? this.datearr[b].EMIAmount : calculateNewEMIS[b].paid;
              const principleAmount = (calculateNewEMIS[b] == undefined) ? 0 : (this.datearr[b].RefrenceId != null) ?  this.datearr[b].monthlyPrinciple : calculateNewEMIS[b].principal;
              const interestAmount = (calculateNewEMIS[b] == undefined) ? 0 : (this.datearr[b].RefrenceId != null) ? this.datearr[b].monthlyInterest :  calculateNewEMIS[b].interest;
    
              this.datearr[b].EMIAmount = paidInstAmount;
              this.datearr[b].EMIAmount1 = paidInstAmount;
              this.datearr[b].monthlyPrinciple = principleAmount;
              this.datearr[b].monthlyInterest = interestAmount;
              (this.datearr[b].RefrenceId == null) ? newEMICalculateIndex++ : null; 
            }
          }
        } else 
        {
          var difference = event - this.datearr[i].EMIAmount;
          const Months_Changed = this.datearr.length - 1 - i;
          var difference_Amount = difference / Months_Changed; //-
          var difference_decimal = 0;

          this.datearr[i].EMIAmount = event;
          this.datearr[i].EMIAmount1 = event;
          this.datearr[i].monthlyPrinciple = event;
          this.datearr[i].monthlyInterest = 0;
     
        for (var index = i + 1; index < this.datearr.length; index++) {
          
          difference_decimal =
            difference_decimal + (difference_Amount - Math.round(difference_Amount));

          this.datearr[index].EMIAmount =
            this.datearr[index].EMIAmount - Math.round(difference_Amount);
          this.datearr[index].EMIAmount1 =
            this.datearr[index].EMIAmount1 - Math.round(difference_Amount);

          if (index == this.datearr.length - 1) {
            this.datearr[index].EMIAmount =
              this.datearr[index].EMIAmount - Math.round(difference_decimal);
            this.datearr[index].EMIAmount1 =
              this.datearr[index].EMIAmount1 - Math.round(difference_decimal);
          }
        }
      }
      } else if (event < this.datearr[i].EMIAmount) {
        
        if(this.loandata.interest != 0)
        {
          const paidAmount = this.datearr.reduce((acc, data) => {
            if (data.RefrenceId != null) {
              return acc + Math.round(data.monthlyPrinciple || 0);
            }
            return acc;
          }, 0);
          let noofemi = this.datearr.filter((d1) => d1.RefrenceId == null);          
          const totalAdvancePayment = this.advances.reduce((sum:number, item:any) => sum + (item.Amount || 0), 0);
          const remainingAmount = Number(this.loandata.LoanAmount) - paidAmount - totalAdvancePayment;

          const changeValueMonth: number = i + 1;
          Object.keys(this.customPaymentObject).forEach(key => +key > changeValueMonth && delete this.customPaymentObject[key]);
          this.customPaymentObject[changeValueMonth] = Number(event);  
      
          const calculateNewEMIS = this.calculateFlexibleEMI(Number(remainingAmount), this.loandata.interest, this.loandata.EMIMonths, this.customPaymentObject, this.loandata.EMIMonths - noofemi.length)
          var newEMICalculateIndex = 0;
          for(let b = 0;b <= this.datearr.length - 1;b++ )
          {
            const paidInstAmount = (calculateNewEMIS[b] == undefined) ? 0 : (this.datearr[b].RefrenceId != null) ? this.datearr[b].EMIAmount : calculateNewEMIS[b].paid;
            const principleAmount = (calculateNewEMIS[b] == undefined) ? 0 : (this.datearr[b].RefrenceId != null) ?  this.datearr[b].monthlyPrinciple : calculateNewEMIS[b].principal;
            const interestAmount = (calculateNewEMIS[b] == undefined) ? 0 : (this.datearr[b].RefrenceId != null) ? this.datearr[b].monthlyInterest :  calculateNewEMIS[b].interest;
            
            this.datearr[b].EMIAmount = paidInstAmount;
            this.datearr[b].EMIAmount1 = paidInstAmount;
            this.datearr[b].monthlyPrinciple = principleAmount;
            this.datearr[b].monthlyInterest = interestAmount;
            (this.datearr[b].RefrenceId == null) ? newEMICalculateIndex++ : null;
          }
        } else 
        {
          const difference = this.datearr[i].EMIAmount - event;
          const Months_Changed = this.datearr.length - 1 - i;
          const difference_Amount = difference / Months_Changed; 
          let difference_decimal = 0;

          this.datearr[i].EMIAmount = event;
          this.datearr[i].EMIAmount1 = event;

          for (var index = i + 1; index < this.datearr.length; index++) {
            difference_decimal =
              difference_decimal + (difference_Amount - Math.round(difference_Amount));

            this.datearr[index].EMIAmount =
              this.datearr[index].EMIAmount + Math.round(difference_Amount);
            this.datearr[index].EMIAmount1 =
              this.datearr[index].EMIAmount1 + Math.round(difference_Amount);

            if (index == this.datearr.length - 1) {
              this.datearr[index].EMIAmount =
                this.datearr[index].EMIAmount + Math.round(difference_decimal);
              this.datearr[index].EMIAmount1 =
                this.datearr[index].EMIAmount1 + Math.round(difference_decimal);
            }
          }
        }
      }
    } else {
    }

    this.loandata.EMIMonths = this.datearr.length;
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

  selectcompany(event: any) {
    if (event) {
      this.company = event;

      this.company_id = event;
      const filterData = {
        companyMasterID: event,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.employee = res.data;
            this.userMaster = '';
            this.spinner.stop();
          }
        });
    }
  }

  calcloaninst() {
    if(this.addloanMaster.value.loanAmount == 0)
    {
      this.datearr = [];
      return;
    }
    if ((this.addloanMaster.value.loanAmount != '' && this.addloanMaster.value.loanAmount != null) && this.addloanMaster.value.emiMonth != '') {
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
      (this.addloanMaster.value.loanAmount != '' &&  this.addloanMaster.value.loanAmount != null) &&
      (this.addloanMaster.value.emiMonth != ''  && this.addloanMaster.value.emiMonth != null)&&
      (this.addloanMaster.value.startMonth != '' && this.addloanMaster.value.startMonth != null)
    ) {
      this.datearr = [];
      var monthyear = this.addloanMaster.value.startMonth.split('-');
      let datee = new Date();
      datee.setDate(1); 
      difference = difference + (loaninst - Math.round(loaninst));

      datee.setMonth(parseInt(monthyear[1]) - 1);
      datee.setFullYear(parseInt(monthyear[0]));
      this.datearr.push({
        EMIMonth: this.addloanMaster.value.startMonth,
        EMIAmount: (schedule == undefined) ?  Math.round(loaninst) : Math.round(schedule[0].principal - Math.round(difference)) + Math.round(schedule[0].interest),
        EMIAmount1: (schedule == undefined) ?  Math.round(loaninst) : Math.round(schedule[0].principal - Math.round(difference)) + Math.round(schedule[0].interest),
        Status: 'Pending',
        iseditable: true,
        monthlyInterest: (schedule == undefined) ? 0 : Math.round(schedule[0].interest),
        monthlyPrinciple: (schedule == undefined) ? Math.round(loaninst):  Math.round(schedule[0].principal - Math.round(difference))
      });
      for (var i = 1; i < this.addloanMaster.value.emiMonth; i++) {
        let newmonth = new Date(datee);
        newmonth.setDate(1); 
        newmonth.setMonth(datee.getMonth() + i);
        let monthdata: any;
        monthdata = newmonth.getMonth() + 1;
        if (monthdata.toString().length === 1) {
          monthdata = '0' + monthdata;
        }
        let yearmonth = newmonth.getFullYear() + '-' + monthdata.toString();
        difference = difference + (loaninst - Math.round(loaninst));

        if (i == this.addloanMaster.value.emiMonth - 1) {
          this.datearr.push({
            EMIMonth: yearmonth,
            EMIAmount: (schedule == undefined) ? Math.round(loaninst) + Math.round(difference) :  Math.round(schedule[i].principal) + Math.round(schedule[i].interest),
            EMIAmount1: (schedule == undefined) ? Math.round(loaninst) + Math.round(difference) :  Math.round(schedule[i].principal) + Math.round(schedule[i].interest),
            Status: 'Pending',
            iseditable: true,
            monthlyInterest: (schedule == undefined) ? 0 : Math.round(schedule[i].interest),
            monthlyPrinciple: (schedule == undefined) ? Math.round(loaninst) + Math.round(difference) : Math.round(schedule[i].principal +  Math.round(difference))
          });
        } else {
          this.datearr.push({
            EMIMonth: yearmonth,
            EMIAmount: (schedule == undefined) ? Math.round(loaninst) : Math.round(schedule[i].principal) + Math.round(schedule[i].interest),
            EMIAmount1: (schedule == undefined) ? Math.round(loaninst) : Math.round(schedule[i].principal) + Math.round(schedule[i].interest),
            Status: 'Pending',
            iseditable: true,
            monthlyInterest: (schedule == undefined) ? 0 : Math.round(schedule[i].interest),
            monthlyPrinciple: (schedule == undefined) ? Math.round(loaninst) : Math.round(schedule[i].principal)
          });
        }
      }
    }
  }

  onSubmit() {
    if (!this.addloanMaster.valid) {
      return;
    }
    let totalAmount = 0;
    this.datearr.forEach((element) => {
      element.instamount = element.EMIAmount1;
      element.yearmonth = element.EMIMonth.replace('-', '');
      totalAmount = totalAmount + element.EMIAmount1;
    });

    const advance_Amount = this.advances.reduce((acc, obj) => acc + +obj.Amount, 0);


    if ((+totalAmount + +advance_Amount) != Number(this.loandata.LoanAmount) && this.loandata.interest === 0) {
      this.notifications.create('Error', 'Amount Does not Match', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }
    if (this.editable == true) {
      let body = {};

      if (this.childcompany == 'true') {
        body = {
          LoanID: this.formValue.ListLoanMasterComponent.id,
          userMasterID: this.addloanMaster.value.userMasterId,
          companyMasterID: this.addloanMaster.value.company,
          LoanAmount: this.addloanMaster.value.loanAmount,
          LoanRemark: this.addloanMaster.value.loanRemark,
          EMIMonths: this.loandata.EMIMonths,
          givenDate: this.addloanMaster.value.givenDate,
          startMonth: this.addloanMaster.value.startMonth.replace('-', ''),
          paymentmode: this.addloanMaster.value.paymentmode,
          referenceNO: this.addloanMaster.value.referenceNo,
          referenceDate: this.addloanMaster.value.referencedate,
          loanTransaction: this.datearr,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
      } else {
        body = {
          LoanID: this.formValue.ListLoanMasterComponent.id,
          userMasterID: this.addloanMaster.value.userMasterId,
          companyMasterID: this.addloanMaster.value.company,
          LoanAmount: this.addloanMaster.value.loanAmount,
          LoanRemark: this.addloanMaster.value.loanRemark,
          EMIMonths: this.loandata.EMIMonths,
          givenDate: this.addloanMaster.value.givenDate,
          startMonth: this.addloanMaster.value.startMonth.replace('-', ''),
          paymentmode: this.addloanMaster.value.paymentmode,
          referenceNO: this.addloanMaster.value.referenceNo,
          referenceDate: this.addloanMaster.value.referencedate,
          loanTransaction: this.datearr,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
      }

      this.api.callApi(this.constant.UPDATELOANMASTER, body, 'POST', true, true, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/finances/loanMaster']);
              this.isdisabled = true;
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
          this.isdisabled = true;
          this.spinner.stop();
        },
      );
    } else {
      let body = {};

      if (this.childcompany == 'true') {
        body = {
          LoanID: this.formValue.ListLoanMasterComponent.id,
          userMasterID: this.addloanMaster.value.userMasterId,
          companyMasterID: this.company_id,
          LoanAmount: this.addloanMaster.value.loanAmount,
          LoanRemark: this.addloanMaster.value.loanRemark,
          EMIMonths: this.loandata.EMIMonths,
          interest: this.loandata.interest,
          givenDate: this.addloanMaster.value.givenDate,
          startMonth: this.loandata.startMonth.replace('-', ''),
          paymentmode: this.addloanMaster.value.paymentmode,
          referenceNO: this.addloanMaster.value.referenceNo,
          referenceDate: this.addloanMaster.value.referencedate,
          loanTransaction: this.datearr,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
      } else {
        body = {
          LoanID: this.formValue.ListLoanMasterComponent.id,
          userMasterID: this.addloanMaster.value.userMasterId,
          companyMasterID: this.company,
          LoanAmount: this.addloanMaster.value.loanAmount,
          LoanRemark: this.addloanMaster.value.loanRemark,
          EMIMonths: this.loandata.EMIMonths,
          interest: this.loandata.interest,
          givenDate: this.addloanMaster.value.givenDate,
          startMonth: this.loandata.startMonth.replace('-', ''),
          paymentmode: this.addloanMaster.value.paymentmode,
          referenceNO: this.addloanMaster.value.referenceNo,
          referenceDate: this.addloanMaster.value.referencedate,
          loanTransaction: this.datearr,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
      }
      this.api.callApi(this.constant.UPDATELOANMASTER, body, 'POST', true, true, true).subscribe(
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

  principleAmountCalculte(month:Number)
  {
    let emi : number = 0;
    for(var i = 0; i <= this.datearr.length-1;i++ )
    {
      if(month == i)
        break;

      emi = emi + this.datearr[i].monthlyPrinciple;
    }

    return emi;
  }

  calculateFlexibleEMIWithExtension(
    principal: number,
    annualInterest: number,
    emiOverrides: Record<number, number> 
  ): EMIMonth[] {
    const monthlyRate = annualInterest / (12 * 100);
    let balance = principal;
    const schedule: EMIMonth[] = [];
    let month = 1;


    const initialEMI = Math.round(
      (balance * monthlyRate * Math.pow(1 + monthlyRate, 4)) /
      (Math.pow(1 + monthlyRate, 4) - 1)
    );


    const overrideMonths = Object.keys(emiOverrides)
      .map(Number)
      .sort((a, b) => a - b);

    let currentEMI = initialEMI;
    let nextOverrideIndex = 0;

    while (balance > 0) {
      if (
        nextOverrideIndex < overrideMonths.length &&
        month >= overrideMonths[nextOverrideIndex]
      ) {
        currentEMI = emiOverrides[overrideMonths[nextOverrideIndex]];
        nextOverrideIndex++;
      }

      const interest = Math.round(balance * monthlyRate);
      let payment = currentEMI;

      if (payment <= interest) {
        this.notifications.create('Error', `EMI too small at month ${month}. Interest is ${interest}, but EMI is ${payment}`, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
        return;
      }

      if (payment - interest > balance) {
        payment = Math.round(balance + interest); 
      }

      const principalPart = payment - interest;
      balance = Math.round(balance - principalPart);

      schedule.push({
        month,
        paid: payment,
        interest,
        principal: principalPart,
        balance: balance < 0 ? 0 : balance,
      });

      if (balance <= 0) {
        break; 
      }

      month++;
    }

    return schedule;
  }


   calculateFlexibleEMI(
      principal: number,
      annualInterest: number,
      months: number,
      customPayments: { [month: number]: number } = {},
      paidMonths:number = 0
    ): EMIMonth[] {
      const monthlyRate = annualInterest / (12 * 100);
      let balance = principal;

      const schedule: EMIMonth[] = [];

      for (let i = 1; i <= paidMonths; i++) {
        schedule.push({
          month: i,
          paid: null,
          interest: null,
          principal: null,
          balance: null
        });
      }
  
      for (let i =  paidMonths + 1; i <= months; i++) {
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

    getMonthDifference(date1: string, date2: string): number {
      const [year1, month1] = date1.split('-').map(Number);
      const [year2, month2] = date2.split('-').map(Number);

      const totalMonths1 = year1 * 12 + (month1 - 1);
      const totalMonths2 = year2 * 12 + (month2 - 1);

      const diff = Math.abs(totalMonths2 - totalMonths1);

      return Math.max(0, diff - 1);
    }

  calculateTotalInterestWithSkippedMonths(
    currentPrincipal: number,     
    nextMonthInterest: number,    
    skippedMonthsCount: number,   
    annualInterestRate: number    
  ): { skippedInterest: number, totalInterest: number } {
    const monthlyRate = annualInterestRate / 12 / 100;

    let skippedInterest = 0;
    let tempPrincipal = currentPrincipal;

    for (let i = 0; i < skippedMonthsCount; i++) {
      const interest = Math.round(tempPrincipal * monthlyRate);
      skippedInterest += interest;
      tempPrincipal += interest;
    }

    const interestForNextMonth = Math.round(tempPrincipal * monthlyRate); 

    const totalInterest = skippedInterest + interestForNextMonth;

    return {
      skippedInterest,
      totalInterest
    };
  }
  
  disableEnter(event: KeyboardEvent): void {
    event.preventDefault();
  }

  closeEMImodel()
  {
    this.isdisabled = false;
  }

  validateEMIMonth(event: any) {
    let value = +event.target.value;

    if (value < 0) {
      this.loandata.EMIMonths = 0;
    } else if (value > 360) {
      this.loandata.EMIMonths = 360;
    }

    if (event.target.value.length > 3) {
      event.target.value = event.target.value.slice(0, 3);
      this.loandata.EMIMonth = +event.target.value;
    }
  }

  validateInterest(event: any) {
    let value = +event.target.value;

    if (value < 0) {
      this.loandata.interest = 0;
    } else if (value > 30) {
      this.loandata.interest = 30;
    }

    if (event.target.value.length > 2) {
      event.target.value = event.target.value.slice(0, 2);
      this.loandata.interest = +event.target.value;
    }
  }

  validateLoanAmount(event: any)
  {
    let value = +event.target.value;

    if (value < 0) {
      this.loandata.LoanAmount = 0;
    } 

    if (event.target.value < 0) {
      value = 0;
      event.target.value = value;
      this.loandata.LoanAmount = value;
    }
  }

  selectGivenDate(resetValue:boolean = true) {
    if(resetValue)
    this.loandata.startMonth = '';
    const selectedDate = new Date(this.loandata?.givenDate);

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
