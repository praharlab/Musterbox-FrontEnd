import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
@Component({
    selector: 'app-list-employee-increment',
    templateUrl: './list-employee-increment.component.html',
    styleUrls: ['./list-employee-increment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeIncrementComponent implements OnInit {
  @ViewChild('incrementdata') incrementdata: NgForm;
  percentage: boolean = false;
  amount: boolean = false;
  new: boolean = false;
  gsid: any;
  gradeSalaryArry: any = [];
  grades: any[];
  userdata: any;
  grossamount: any;
  amountType: string;
  gradeDatabyid: any;
  stateShow: boolean = false;
  state: any;
  finaldata: any[];
  totgross: number;
  extraNetPay: number = 0;
  yearly_extraNetPay: number = 0;
  employeeCont: number;
  employeerCont: number;
  ctc1: number;
  netctc: number;
  total: number;
  yearly_grossamount: number;
  yearly_netpay: number;
  yearly_ctcamount: number;
  ctcamount1: number;
  isdisebled: boolean = true;
  manualgradeSalaryArry: any[];
  gradeSalaryArry_D: any[];
  usermasterid: any;
  total1: number;
  netpay: number;
  ctcamount: number;
  otherAmount: number;
  ipAddress: any;
  yearmonth: any;
  companydata1: any;
  grossamount1: number;
  currentctcamount: number;
  currentgross: number;
  currentctc: number;
  structureOn: boolean;
  gradeSalaryArry12: any;
  cgsid: any;
  amountType1: any;
  sid: any;
  stateid: any;
  grossroundoff: number;
  ctcroundoff: number;
  incrementPermissionView: any = [];
  formValue: any;
  A_Salary: any[] = [];
  B_Salary: any[] = [];
  extra_A_Salary: any[] = [];
  C_Salary: any[] = [];
  grossData: any;
  netPayData: any;
  ctcData: any;
  default_PayheadMsterIds = [1, 50, 92, 16, 17, 24, 34, 9, 43, 78, 83, 96, 97, 99, 67, 101]
  gradeSalaryArryData: any;
  target = 'Minimum Wages';
  corporation: any[] = [];
  selectedSkillCategory: any;
  selectedCorporation: any;
  minWagesMasterId: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.usermasterid = this.formValue.ListEmployeeMasterComponent.id;
    this.checkpermission();
    this.selectcountry(103);
    this.getIPAddress();
    this.getdatabyid();
  }

  selectstate(state: any) {
    this.corporation = [];
    this.selectedCorporation = null
    if (!state) return;
    this.spinner.start('corporation');
    this.api
      .callApi(this.constant.GETCORPORATIONBYSTATEID + state, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.corporation = res.data;
          this.spinner.stop('corporation');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('corporation');
        },
      );
  }

  getdatabyid() {
    this.yearly_grossamount = 0;
    this.yearly_netpay = 0;
    this.yearly_ctcamount = 0;
    this.A_Salary = [];
    this.B_Salary = [];
    this.extra_A_Salary = [];
    this.C_Salary = [];

    return new Promise<void>((resolve, reject) => {

      this.spinner.start();
      this.api
        .callApi(this.constant.GETBYIDALARYSTRUCTURE + this.usermasterid, {}, 'GET', true, true, true)
        .subscribe((res: any) => {
          if (res.status == 200) {

            this.gradeSalaryArryData = res.data;

            this.finaldata = [];

            if (this.gradeSalaryArryData.length > 0) {

              this.cgsid = Number(this.gradeSalaryArryData[0].gradeStructureID);
              this.amountType = this.gradeSalaryArryData[0].AmountIn.toString();
              this.amountType1 = this.amountType;
              this.sid = +this.gradeSalaryArryData[0].stateid || null;

              this.selectedCorporation = this.gradeSalaryArryData[0].corporationId;

              if (this.selectedCorporation) {
                this.selectstate(this.sid);
              }


              this.currentctc = +[...this.gradeSalaryArryData].find(e => e.payheadMasterId == 1)?.finalvalue || 0;
              this.currentgross = +[...this.gradeSalaryArryData].find(e => e.payheadMasterId == 50)?.finalvalue || 0;

            }
            resolve();
            this.api
              .callApi(
                this.constant.VIEWCOMPANYCONTACTDATA + this.usermasterid,
                {},
                'GET',
                false,
                true,
                true,
              )
              .subscribe(
                (res: any) => {
                  this.spinner.stop();
                  this.companydata1 = res.data;
                  const body = {
                    isAssignStructure: this.gradeSalaryArryData.length ? true : false,
                    amount: this.amountType == '0' ? this.ctcamount : this.grossamount,
                    companyMasterID: this.companydata1?.companyMasterId || null,
                    userMasterID: this.usermasterid,
                    YYYYMM: '',
                  };
                  this.api
                    .callApi(
                      this.constant.GETGRADEFORASSIGNSTRUCTURE,
                      body,
                      'POST',
                      true,
                      false,
                      true,
                    )
                    .subscribe((res: any) => {
                      if (res.status == 200) {
                        this.grades = res.data;
                      }
                    });
                },
                (err) => {
                  this.notifications.create('Error', err.error.message, NotificationType.Bare, {
                    theClass: 'outline primary',
                    timeOut: 3000,
                    showProgressBar: false,
                  });
                },
              );

            this.spinner.stop();
          }
        }, (err) => {
          reject();
        });

    })
  }


  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.incrementPermissionView = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignIncrement' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.spinner.stop();
        }
      });
  }

  selectcountry(country: any) {
    if (!country) {
      return;
    }
    this.spinner.start();
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.state = res.data;
          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }


  getGrade() {
    this.gsid = '';
    this.gradeSalaryArry = [];
    this.grades = [];

    this.spinner.start();

    if (this.incrementdata.value.ctc != '' || this.incrementdata.value.gross != '') {
      this.api
        .callApi(
          this.constant.VIEWCOMPANYCONTACTDATA + this.formValue.ListEmployeeMasterComponent.id,
          {},
          'GET',
          false,
          true,
          true,
        )
        .subscribe((res: any) => {
          this.spinner.stop();
          this.userdata = res.data;

          const body = {
            isAssignStructure: false,
            amount:
              this.amountType == '0'
                ? this.incrementdata.value.ctc
                : this.incrementdata.value.gross,
            companyMasterID: +this.userdata?.companyMasterId || null,
            userMasterID: this.formValue.ListEmployeeMasterComponent.id,
            YYYYMM: this.incrementdata.value.month.replace('-', ''),
          };

          // let body;
          // if (this.amountType == '0') {
          //   body = {
          //     parameters: [+this.userdata.companyMasterId, this.incrementdata.value.ctc],
          //   };
          // } else {
          //   body = {
          //     parameters: [+this.userdata.companyMasterId, this.incrementdata.value.gross],
          //   };
          // }

          this.api
            .callApi(this.constant.GETGRADEFORASSIGNSTRUCTURE, body, 'POST', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.grades = res.data;
                this.grades = this.grades.filter((e) => {
                  return e.gstatus != 0;
                });
                this.spinner.stop();
              }
            });
        });
    }
  }

  getgradeData(event) {

    this.selectedCorporation = null;
    this.corporation = [];

    const body = {
      gradeStructureID: event,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.GETGRADESALARYSTRUCTUREBYGRADEID, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.gradeDatabyid = res.data;

          let findpt = this.gradeDatabyid.find((x) => {
            return x.hrSalaryField.payheadMasterId == 15;
          });

          // check min wages is present or not

          const hasMinimumWages: boolean = this.gradeDatabyid.some(
            (item: { formula?: string; formula1?: string }) =>
              (item.formula?.includes('Minimum Wages') ?? false) ||
              (item.formula1?.includes('Minimum Wages') ?? false),
          );

          this.stateShow = findpt || hasMinimumWages ? true : false;

          this.spinner.stop();
        }
      });
  }

  incrementamount(ev) {
    if (ev.target.value == 'Percentage') {
      this.percentage = true;
      this.amount = false;
      this.new = false;
    } else if (ev.target.value == 'Amount') {
      this.percentage = false;
      this.amount = true;
      this.new = false;
    } else if (ev.target.value == 'new') {
      this.percentage = false;
      this.amount = false;
      this.new = true;
    }
  }

  onSubmit1() {
    this.finaldata = [];
    this.yearly_grossamount = 0;
    this.yearly_netpay = 0;
    this.yearly_ctcamount = 0;
    this.A_Salary = [], this.B_Salary = [], this.extra_A_Salary = [], this.C_Salary = [];

    if (!this.incrementdata.valid) {
      return;
    }

    let body;

    if (this.incrementdata.value.increment_amount == 'new') {
      this.amountType = this.incrementdata.value.amountType1;

      if (this.amountType == '0') {
        this.amount = this.incrementdata.value.ctc;
        this.ctcamount1 = this.incrementdata.value.ctc;
      } else {
        this.amount = this.incrementdata.value.gross;
        this.grossamount = this.incrementdata.value.gross;
      }

      this.stateid = +this.incrementdata.value.state1 || null;


      body = {
        gradeid: this.incrementdata.value.gradeStructureID,
        ctc: this.amount,
        userMasterID: this.usermasterid,
        stateid: this.stateid,
        AmountIn: this.amountType,
      };
    } else if (this.incrementdata.value.increment_amount == 'Amount') {
      let finalamount =
        Number(this.incrementdata.value.incamount) + Number(this.incrementdata.value.currentamount);

      this.stateid = this.sid;
      this.amountType = this.amountType1;

      body = {
        gradeid: this.cgsid,
        ctc: finalamount,
        userMasterID: this.usermasterid,
        stateid: this.sid || null,
        AmountIn: this.amountType1,
      };
    } else if (this.incrementdata.value.increment_amount == 'Percentage') {
      let perAmount =
        (Number(this.incrementdata.value.currentamount) *
          Number(this.incrementdata.value.percentage)) /
        100;

      let finalamount = Number(this.incrementdata.value.currentamount) + Number(perAmount);

      this.stateid = this.sid;
      this.amountType = this.amountType1;

      body = {
        gradeid: this.cgsid,
        ctc: finalamount,
        userMasterID: this.usermasterid,
        stateid: this.sid || null,
        AmountIn: this.amountType1,
      };
    }

    this.yearmonth = this.incrementdata.value.month.replace('-', '');

    body['yearMonth'] = this.yearmonth;
    body['corporationId'] = this.selectedCorporation;


    this.spinner.start('submit1');
    this.api
      .callApi(this.constant.GETSALARYBYGRADE, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.gradeSalaryArry = res.data;
          this.selectedSkillCategory = res.skillCategory;
          this.minWagesMasterId = res.minWagesMasterId;

          this.isdisebled = false;

          this.manualgradeSalaryArry = this.gradeSalaryArry;


          this.yearmonth = this.incrementdata.value.month.replace('-', '');

          this.gradeSalaryArry.forEach((element) => {
            this.finaldata.push({
              userMasterID: this.usermasterid,
              gradeSalaryStructureID: element.gradeSalaryStructureID,
              EmployeeSalaryAmount: element.finalvalue,
              salaryFromYYYYMM: this.yearmonth,
              stateid: this.stateid || null,
              AmountIn: this.amountType,
              createBy: localStorage.getItem('id'),
              createByIp: this.ipAddress,
              ActualEmployeeSalaryAmount: element.actualvalue,
              skillCategory: this.selectedSkillCategory || null,
              corporationId: this.selectedCorporation || null,
              minWagesMasterId: this.minWagesMasterId || null
            });

            if (!this.default_PayheadMsterIds.includes(element.payheadMasterId)) {
              if (element.salaryFieldSrNo == 'A' && element.considerIn != 'net') this.A_Salary.push(element);
              if (element.salaryFieldSrNo == 'A' && element.considerIn == 'net') this.extra_A_Salary.push(element);

              if (element.salaryFieldSrNo == 'B') this.B_Salary.push(element);

              if (element.salaryFieldSrNo == 'C') this.C_Salary.push(element);

            }

            // CTC

            if (element.payheadMasterId == 1) {
              this.ctcData = element
              this.ctcamount = +element.finalvalue;
              this.yearly_ctcamount = +element.yearly_finalvalue;
            }

            // GROSS

            if (element.payheadMasterId == 50) {
              this.grossData = element;
              this.grossamount = +element.finalvalue;
              this.yearly_grossamount = +element.yearly_finalvalue;
            }

            //NET PAY
            if (element.payheadMasterId == 92) {
              this.netPayData = element;
              this.netpay = +element.finalvalue;
              this.yearly_netpay = +element.yearly_finalvalue;
            }

          });
        } else {
          this.gradeSalaryArry = [];
          this.selectedSkillCategory = null;
          this.minWagesMasterId = null;
          this.isdisebled = true;

          this.manualgradeSalaryArry = [];
        }
        this.spinner.stop('submit1');
      }, (err) => {
        this.spinner.stop('submit1');
      });
  }

  onSubmit() {
    if (!this.incrementdata.valid) {
      return;
    }

    this.spinner.start();
    this.isdisebled = true;
    this.api
      .callApi(this.constant.ADDSALARYSTRUCTURE, this.finaldata, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.spinner.stop();
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }

  manual(item: any, type: any) {
    this.finaldata = [];
    this.yearly_grossamount = 0;
    this.yearly_netpay = 0;
    this.yearly_ctcamount = 0;
    this.selectedSkillCategory = null;
    this.minWagesMasterId = null;

    if (!this.incrementdata.valid) {
      return;
    }
    this.spinner.start();

    let body;

    if (this.incrementdata.value.increment_amount == 'new') {
      this.amountType = this.incrementdata.value.amountType1;

      if (this.amountType == '0') {
        this.amount = this.incrementdata.value.ctc;
        this.ctcamount1 = this.incrementdata.value.ctc;
      } else {
        this.amount = this.incrementdata.value.gross;
        this.grossamount = this.incrementdata.value.gross;
      }

      this.stateid = +this.incrementdata.value.state1 || null;


      const arrayData = type == 'A' ? this.A_Salary : type == 'B' ? this.B_Salary : type == 'EA' ? this.extra_A_Salary : type == 'C' ? this.C_Salary : [];


      body = {
        gradeid: this.incrementdata.value.gradeStructureID,
        ctc: this.amount,
        userMasterID: this.usermasterid,
        stateid: this.stateid || null,
        AmountIn: this.amountType,
        grade_salary_structure: this.manualgradeSalaryArry,
        payheadMasterId: arrayData[item].payheadMasterId,
        payheadAmount: arrayData[item].finalvalue,
      };
    } else if (this.incrementdata.value.increment_amount == 'Amount') {
      let finalamount =
        Number(this.incrementdata.value.incamount) + Number(this.incrementdata.value.currentamount);

      this.stateid = this.sid;
      this.amountType = this.amountType1;

      body = {
        gradeid: this.cgsid,
        ctc: finalamount,
        userMasterID: this.usermasterid,
        stateid: this.sid || null,
        AmountIn: this.amountType1,
        grade_salary_structure: this.manualgradeSalaryArry,
        payheadMasterId: this.gradeSalaryArry[item].payheadMasterId,
        payheadAmount: this.gradeSalaryArry[item].finalvalue,
      };
    } else if (this.incrementdata.value.increment_amount == 'Percentage') {
      let perAmount =
        (Number(this.incrementdata.value.currentamount) *
          Number(this.incrementdata.value.percentage)) /
        100;

      let finalamount = Number(this.incrementdata.value.currentamount) + Number(perAmount);

      this.stateid = this.sid;

      this.amountType = this.amountType1;

      body = {
        gradeid: this.cgsid,
        ctc: finalamount,
        userMasterID: this.usermasterid,
        stateid: this.sid || null,
        AmountIn: this.amountType1,
        grade_salary_structure: this.manualgradeSalaryArry,
        payheadMasterId: this.gradeSalaryArry[item].payheadMasterId,
        payheadAmount: this.gradeSalaryArry[item].finalvalue,
      };
    }

    body['yearMonth'] = this.yearmonth;
    body['corporationId'] = this.selectedCorporation;

    this.spinner.start('manual');
    this.api
      .callApi(this.constant.CHANGESALARYBYGRADE, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.gradeSalaryArry = res.data;
          this.selectedSkillCategory = res.skillCategory;
          this.minWagesMasterId = res.minWagesMasterId;
          this.manualgradeSalaryArry = this.gradeSalaryArry;

          this.A_Salary = [], this.B_Salary = [], this.extra_A_Salary = [], this.C_Salary = [];


          this.gradeSalaryArry.forEach((element) => {
            this.finaldata.push({
              userMasterID: this.usermasterid,
              gradeSalaryStructureID: element.gradeSalaryStructureID,
              EmployeeSalaryAmount: element.finalvalue,
              salaryFromYYYYMM: this.yearmonth,
              stateid: this.stateid || null,
              AmountIn: this.amountType,
              createBy: localStorage.getItem('id'),
              createByIp: this.ipAddress,
              ActualEmployeeSalaryAmount: element.actualvalue,
              skillCategory: this.selectedSkillCategory || null,
              corporationId: this.selectedCorporation || null,
              minWagesMasterId:this.minWagesMasterId || null
            });

            if (!this.default_PayheadMsterIds.includes(element.payheadMasterId)) {
              if (element.salaryFieldSrNo == 'A' && element.considerIn != 'net') this.A_Salary.push(element);
              if (element.salaryFieldSrNo == 'A' && element.considerIn == 'net') this.extra_A_Salary.push(element);

              if (element.salaryFieldSrNo == 'B') this.B_Salary.push(element);

              if (element.salaryFieldSrNo == 'C') this.C_Salary.push(element);

            }

            // CTC

            if (element.payheadMasterId == 1) {
              this.ctcData = element
              this.ctcamount = +element.finalvalue;
              this.yearly_ctcamount = +element.yearly_finalvalue;
            }

            // GROSS

            if (element.payheadMasterId == 50) {
              this.grossData = element;
              this.grossamount = +element.finalvalue;
              this.yearly_grossamount = +element.yearly_finalvalue;
            }

            //NET PAY
            if (element.payheadMasterId == 92) {
              this.netPayData = element;
              this.netpay = +element.finalvalue;
              this.yearly_netpay = +element.yearly_finalvalue;
            }

          });
          this.spinner.stop();
        } else {
          this.gradeSalaryArry = [];
          this.isdisebled = true;
          this.minWagesMasterId = null;
          this.manualgradeSalaryArry = [];
        }
        this.spinner.stop('manual');

      }, (err) => {
        this.spinner.stop('manual');

      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
