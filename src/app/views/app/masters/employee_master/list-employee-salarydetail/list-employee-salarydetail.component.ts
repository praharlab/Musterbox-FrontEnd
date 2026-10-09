import { Component, ViewChild, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-list-employee-salarydetail',
    templateUrl: './list-employee-salarydetail.component.html',
    styleUrls: ['./list-employee-salarydetail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeSalarydetailComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;

  ipAddress: any;
  grade: any = [];
  usermasterid: any;
  salaryData: any;
  gradeSalaryArry: any = [];
  gradeData: any;
  grades: any;
  company_id: any;
  isdisebled: boolean = true;
  totgross: number = 0;
  employeerCont: number = 0;
  employeeCont: number = 0;
  ctc1: any = 0;
  ctcamount: number = 0;
  gsid: any;
  netctc: any = 0;
  txtcolor: any = false;
  finaldata: any = [];
  ptxinctc: any = '0';
  empjoining1: any;
  showjoining: boolean = false;
  yearmonth: string;
  userdata: any;
  companydata: any;
  companydata1: any;
  state: any;
  stateid: number;
  amountType: any;
  gradeDatabyid: any;
  stateShow: boolean = false;
  gradeSalaryArry1: any;
  grossamount: number = 0;
  amount: any;
  netpay: number = 0;
  yearly_grossamount: number = 0;
  yearly_netpay: number = 0;
  yearly_ctcamount: number = 0;
  removeButton: any;
  storedata: boolean = false;
  disebled1: boolean = false;
  ctcamount1: any = 0;
  grossamount1: any = 0;
  manualgradeSalaryArry: any;
  grossroundoff: any;
  ctcroundoff: any;
  salarymasteridarray = [];
  allStructure: any = [];
  query: any;
  salaryStructurePermissionCreate: any = [];
  formValue: any;
  extraNetPay: number = 0;
  yearly_extraNetPay: number = 0;
  selectedMonth: any;
  A_Salary: any[] = [];
  B_Salary: any[] = [];
  extra_A_Salary: any[] = [];
  C_Salary: any[] = [];
  grossData: any;
  netPayData: any;
  ctcData: any;
  default_PayheadMsterIds = [1, 50, 92, 16, 17, 24, 34, 9, 43, 78, 83, 96, 97, 99, 67, 101];
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
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.salarymasteridarray = [];
    this.formValue = this.formValueStorageService.getData();
    this.checkpermission();
    this.getIPAddress(); ``
    this.profileStatusService.refreshProfileStatus();

    this.usermasterid = this.formValue.ListEmployeeMasterComponent.id;
    this.company_id = localStorage.getItem('company_id');

    this.selectcountry(103);
    this.getAllStructure();

    this.empjoining()
      // If it returns a Promise, chain it
      .then(() => {
        this.getdatabyid();
      });
  }

  selectstate(state: any, setNullFlag: boolean) {
    this.corporation = [];
    if (setNullFlag) this.selectedCorporation = null;

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
          this.salaryStructurePermissionCreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignSalaryStructure' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.spinner.stop();
        }
      });
  }

  getAllStructure() {
    this.query = `?userMasterID=${this.usermasterid}`;

    this.spinner.start('salary');
    this.api
      .callApi(
        this.constant.GETALLSALARYSTRUCTUREBYUSERID + this.query,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allStructure = res.data;
          this.spinner.stop('salary');
        } else {
          this.spinner.stop('salary');
        }
      });
  }

  export() {
    this.spinner.start('export');
    this.api
      .callApi(
        this.constant.GETALLSALARYSTRUCTUREBYUSERID + this.query + `&exportData=true`,
        {},
        'GET',
        true,
        true,
        true,
        true,
      )
      .subscribe((res: any) => {
        var blob = new Blob([res], { type: 'text/xlsx' });
        saveAs(blob, 'SalaryStructures.xlsx');

        this.spinner.stop('export');
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

  empjoining() {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start();
      this.api
        .callApi(
          this.constant.GETEMPJOININGDATA + '/' + this.usermasterid,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe(
          (res: any) => {
            this.empjoining1 = res.data;
            if (this.empjoining1 != undefined) {
              let year = new Date(this.empjoining1.joiningDate).getFullYear();
              let month = String(new Date(this.empjoining1.joiningDate).getMonth() + 1);
              if (month.length > 1) {
              } else {
                month = 0 + month;
              }
              this.selectedMonth = year + '-' + month;

              this.spinner.stop();
            } else {
              this.showjoining = true;
            }
            resolve();
          },
          (err) => {
            reject();
          },
        );
    });
  }

  getdatabyid() {
    this.yearly_grossamount = 0;
    this.yearly_netpay = 0;
    this.yearly_ctcamount = 0;
    this.A_Salary = [];
    this.B_Salary = [];
    this.extra_A_Salary = [];
    this.C_Salary = [];
    this.selectedCorporation  = null;
    this.corporation = [];

    return new Promise<void>((resolve, reject) => {
      this.spinner.start();
      this.api
        .callApi(
          this.constant.GETBYIDALARYSTRUCTURE + this.usermasterid,
          {},
          'GET',
          true,
          true,
          true,
        )
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.gradeSalaryArry = res.data;

              this.finaldata = [];

              if (this.gradeSalaryArry.length > 0) {
                this.selectedMonth =
                  String(this.gradeSalaryArry[0].salaryFromYYYYMM).slice(0, 4) +
                  '-' +
                  String(this.gradeSalaryArry[0].salaryFromYYYYMM).slice(4, 6);

                this.gradeSalaryArry.map((e) => {
                  this.salarymasteridarray.push(e.salaryMasterID);
                });
                this.isdisebled = true;
                this.storedata = true;
                this.disebled1 = true;

                this.gsid = Number(this.gradeSalaryArry[0].gradeStructureID);
                this.amountType = (this.gradeSalaryArry[0].AmountIn).toString();

                this.stateShow = +this.gradeSalaryArry[0].stateid ? true : false;
                this.stateid = Number(this.gradeSalaryArry[0].stateid) || null;

                this.selectedCorporation = this.gradeSalaryArry[0].corporationId;

                if (this.selectedCorporation) {
                  this.selectstate(this.stateid, false);
                }

                this.gradeSalaryArry.forEach((element) => {
                  this.finaldata.push({
                    userMasterID: this.usermasterid,
                    gradeSalaryStructureID: element.gradeSalaryStructureID,
                    EmployeeSalaryAmount: element.EmployeeSalaryAmount,
                    salaryFromYYYYMM: element.salaryFromYYYYMM,
                    stateid: Number(element.stateid) || null,
                    AmountIn: this.amountType,
                    createBy: localStorage.getItem('id'),
                    createByIp: this.ipAddress,
                    ActualEmployeeSalaryAmount: element.ActualEmployeeSalaryAmount,
                    skillCategory: element.skillCategory,
                    corporationId: element.corporationId,
                  });

                  element.fieldFixAmount = null;

                  if (!this.default_PayheadMsterIds.includes(element.payheadMasterId)) {
                    if (element.salaryFieldSrNo == 'A' && element.considerIn != 'net')
                      this.A_Salary.push(element);
                    if (element.salaryFieldSrNo == 'A' && element.considerIn == 'net')
                      this.extra_A_Salary.push(element);

                    if (element.salaryFieldSrNo == 'B') this.B_Salary.push(element);

                    if (element.salaryFieldSrNo == 'C') this.C_Salary.push(element);
                  }

                  // CTC

                  if (element.payheadMasterId == 1) {
                    this.ctcData = element;
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
                (this.amountType = ''), (this.ctcamount = 0);
                this.grossamount = 0;
                this.stateid = null;
                this.gsid = '';

                this.removeButton = '';
                this.stateShow = false;
                this.storedata = false;
                this.disebled1 = false;
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
                      isAssignStructure: this.gradeSalaryArry.length ? true : false,
                      amount: this.amountType == '0' ? this.ctcamount : this.grossamount,
                      companyMasterID: this.companydata1?.companyMasterId || null,
                      userMasterID: this.usermasterid,
                      YYYYMM: +this.selectedMonth.replace('-', ''),
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
          },
          (err) => {
            reject();
          },
        );
    });
  }

  getSalary() {
    this.finaldata = [];
    this.yearly_grossamount = 0;
    this.yearly_netpay = 0;
    this.yearly_ctcamount = 0;
    (this.A_Salary = []), (this.B_Salary = []), (this.extra_A_Salary = []), (this.C_Salary = []);

    if (!this.addcomp.valid) {
      return;
    }

    this.amountType = this.addcomp.value.amountType1;

    if (this.amountType == '0') {
      this.amount = this.addcomp.value.ctc;
      this.ctcamount1 = this.addcomp.value.ctc;
    } else {
      this.amount = this.addcomp.value.gross;
      this.grossamount = this.addcomp.value.gross;
    }
    if (
      this.addcomp.value.state1 == '' ||
      this.addcomp.value.state1 == null ||
      this.addcomp.value.state1 == undefined
    ) {
      this.addcomp.value.state1 = 0;
    }

    const body = {
      gradeid: this.addcomp.value.gradeStructureID,
      ctc: this.amount,
      userMasterID: this.usermasterid,
      stateid: this.addcomp.value.state1 || null,
      AmountIn: this.amountType,
      yearMonth: this.selectedMonth.replace('-', ''),
      corporationId: this.selectedCorporation,
    };

    this.spinner.start('getsalary');
    this.api
      .callApi(this.constant.GETSALARYBYGRADE, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.gradeSalaryArry = res.data;
          this.selectedSkillCategory = res.skillCategory;
          this.minWagesMasterId = res.minWagesMasterId;

          this.isdisebled = false;

          this.manualgradeSalaryArry = this.gradeSalaryArry;

          this.gradeSalaryArry.forEach((element) => {
            this.finaldata.push({
              userMasterID: this.usermasterid,
              gradeSalaryStructureID: element.gradeSalaryStructureID,
              EmployeeSalaryAmount: element.finalvalue,
              salaryFromYYYYMM: +this.selectedMonth.replace('-', ''),
              stateid: this.addcomp.value.state1 || null,
              AmountIn: this.amountType,
              createBy: localStorage.getItem('id'),
              createByIp: this.ipAddress,
              ActualEmployeeSalaryAmount: element.actualvalue,
              skillCategory: this.selectedSkillCategory || null,
              corporationId: this.selectedCorporation || null,
              minWagesMasterId: this.minWagesMasterId || null
            });

            if (!this.default_PayheadMsterIds.includes(element.payheadMasterId)) {
              if (element.salaryFieldSrNo == 'A' && element.considerIn != 'net')
                this.A_Salary.push(element);
              if (element.salaryFieldSrNo == 'A' && element.considerIn == 'net')
                this.extra_A_Salary.push(element);

              if (element.salaryFieldSrNo == 'B') this.B_Salary.push(element);

              if (element.salaryFieldSrNo == 'C') this.C_Salary.push(element);
            }

            // CTC

            if (element.payheadMasterId == 1) {
              this.ctcData = element;
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
          this.manualgradeSalaryArry = [];
            this.minWagesMasterId = null;
          this.isdisebled = true;
          this.commonNotificationService.handleWarning(res.message);
        }
         this.spinner.stop('getsalary');
      },(err)=>{
         this.spinner.stop('getsalary');
      });
  }

  getGrade() {
    this.gsid = '';
    this.gradeSalaryArry = [];
    this.grades = [];

    this.spinner.stop();

    if (this.addcomp.value.ctc != '' || this.addcomp.value.gross != '') {
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
            isAssignStructure: this.gradeSalaryArry.length ? true : false,
            amount: this.amountType == '0' ? this.addcomp.value.ctc : this.addcomp.value.gross,
            companyMasterID: +this.userdata?.companyMasterId || null,
            userMasterID: this.formValue.ListEmployeeMasterComponent.id,
            YYYYMM: +this.selectedMonth.replace('-', ''),
          };

          // let body;
          // if (this.amountType == '0') {
          //   body = {
          //     parameters: [+this.userdata.companyMasterId, this.addcomp.value.ctc],
          //   };
          // } else {
          //   body = {
          //     parameters: [+this.userdata.companyMasterId, this.addcomp.value.gross],
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onSubmit() {
    if (!this.addcomp.valid) {
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
            this.ngOnInit();
            this.spinner.stop();
            // this.isdisebled = false
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
            // this.isdisebled = false
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
          // this.isdisebled = false
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

    if (!this.addcomp.valid) {
      return;
    }


    this.amountType = this.addcomp.value.amountType1;

    if (this.amountType == '0') {
      this.amount = this.addcomp.value.ctc;
    } else {
      this.amount = this.addcomp.value.gross;
    }

    if (
      this.addcomp.value.state1 == '' ||
      this.addcomp.value.state1 == null ||
      this.addcomp.value.state1 == undefined
    ) {
      this.addcomp.value.state1 = 0;
    }

    const arrayData =
      type == 'A'
        ? this.A_Salary
        : type == 'B'
          ? this.B_Salary
          : type == 'EA'
            ? this.extra_A_Salary
            : type == 'C'
              ? this.C_Salary
              : [];

    let body = {
      gradeid: this.addcomp.value.gradeStructureID,
      ctc: this.amount,
      userMasterID: this.usermasterid,
      stateid: this.addcomp.value.state1 || null,
      AmountIn: this.amountType,
      grade_salary_structure: this.manualgradeSalaryArry,
      payheadMasterId: arrayData[item].payheadMasterId,
      payheadAmount: arrayData[item].finalvalue,
      yearMonth: +this.selectedMonth.replace('-', ''),
      corporationId: this.selectedCorporation,
    };

    this.spinner.start('manual');
    this.api
      .callApi(this.constant.CHANGESALARYBYGRADE, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.gradeSalaryArry = res.data;
          this.selectedSkillCategory = res.skillCategory;
            this.minWagesMasterId = res.minWagesMasterId;

          this.manualgradeSalaryArry = this.gradeSalaryArry;

          // this.gradeSalaryArry = this.gradeSalaryArry.filter((s) => {
          //   return s.sort != 1;
          // });

          (this.A_Salary = []),
            (this.B_Salary = []),
            (this.extra_A_Salary = []),
            (this.C_Salary = []);

          this.gradeSalaryArry.forEach((element) => {
            this.finaldata.push({
              userMasterID: this.usermasterid,
              gradeSalaryStructureID: element.gradeSalaryStructureID,
              EmployeeSalaryAmount: element.finalvalue,
              salaryFromYYYYMM: +this.selectedMonth.replace('-', ''),
              stateid: this.addcomp.value.state1 || null,
              AmountIn: this.amountType,
              createBy: localStorage.getItem('id'),
              createByIp: this.ipAddress,
              ActualEmployeeSalaryAmount: element.actualvalue,
              skillCategory: this.selectedSkillCategory || null,
              corporationId: this.selectedCorporation || null,
              minWagesMasterId:this.minWagesMasterId || null
            });

            if (!this.default_PayheadMsterIds.includes(element.payheadMasterId)) {
              if (element.salaryFieldSrNo == 'A' && element.considerIn != 'net')
                this.A_Salary.push(element);
              if (element.salaryFieldSrNo == 'A' && element.considerIn == 'net')
                this.extra_A_Salary.push(element);

              if (element.salaryFieldSrNo == 'B') this.B_Salary.push(element);

              if (element.salaryFieldSrNo == 'C') this.C_Salary.push(element);
            }

            // CTC

            if (element.payheadMasterId == 1) {
              this.ctcData = element;
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
          this.manualgradeSalaryArry = [];
          this.minWagesMasterId = null;
          this.isdisebled = true;
          this.commonNotificationService.handleWarning(res.message);
        }
        this.spinner.stop('manual');
      }, (err) => {
        this.spinner.stop('manual');

      });
  }

  remove(salaryMasterIds: number) {
    const body = {
      userMasterID: this.usermasterid,
      salaryMasterIDs: [salaryMasterIds],
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete it?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.start();

        this.api
          .callApi(this.constant.DELETESALARYMASTER, body, 'POST', true, false, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.isdisebled = true;
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.ngOnInit();

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
    });
  }
}
