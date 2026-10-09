import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonNotificationService } from 'src/app/services/common-notification.service';


@Component({
    selector: 'app-fnf-salary-calculation',
    templateUrl: './fnf-salary-calculation.component.html',
    styleUrls: ['./fnf-salary-calculation.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FnfSalaryCalculationComponent implements OnInit {

  rows: any[] = [];
  All_sandwhichData: any[] = [];
  apiURL = environment.apiUrl;

  showloader: boolean = false

  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    branchMasterID: '',
    userMasterID: [],
    month: '',
    status: '',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  data: any;
  attendance: any[];
  attendance1: any[];
  salarydata: any;
  formValue: any;
  body = {
    companyId: '',
    userId: '',
    month: '',
  }

  salarybuttonState = '';
  salarybuttonDisabled = false;
  salarybuttonDisabledFNF = false;

  @Output('reloadSalaryCalculation') reloadSalaryCalculation = new EventEmitter<any>();
  @Output('isSalaryCalculated') isSalaryCalculated = new EventEmitter<any>();


  constructor(private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,

  ) { }

  ngOnInit(): void {
    this.data = undefined;
    this.formValue = this.formValueStorageService.getData();
    this.getIPAddress();
    this.body = this.formValue.salaryCalculationComponent?.body || this.formValue.listFNFComponent?.body || this.body;
  }


  convertMinutesToHoursMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60); // Calculate the hours
    const minutes = totalMinutes % 60;          // Calculate the remaining minutes
    return `${hours}:${minutes.toString().padStart(2, '0')}`; // Format as HH:MM
  }


  getData() {

    if (Object.values(this.body).some(value => !value)) return
    this.showloader = true;

    this.filterData.companyMasterID = this.body.companyId;
    this.filterData.userMasterID = [this.body.userId];
    this.filterData.month = this.body.month;

    this.api
      .callApi(this.constant.GETATTENDANCEBALANCE, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = [];
          this.All_sandwhichData = [];
          this.rows = res.data;

          for (let i = 0; i < this.rows.length; i++) {
            this.isSalaryCalculated.emit(this.rows[i].SalaryDone == 'Y' ? true : false)
            let photo = this.rows[i].userPhoto;

            if (photo != '' && photo != null) {
              let img = new Image();
              img.src = this.apiURL + 'uploads/user/photo/' + photo;
              if (img.complete) {
                this.rows[i].imgshow1 = true;
                // this.rows[i].show = !this.show;
                // this.htmlelement.style.visibility = 'visible';
              } else {
                img.onload = () => {
                  this.rows[i].imgshow1 = true;
                  // this.show = !this.show;
                  // this.htmlelement.style.visibility = 'visible';
                };
                img.onerror = () => {
                  this.rows[i].imgshow1 = false;
                };
              }
            } else {
              this.rows[i].imgshow1 = false;
              // this.show = !this.show;
              // this.htmlelement.style.visibility = 'visible';
            }

            if (this.rows[i].user_leave.length > 0) {
              // Logic for sandwhich Data
              const All_sandwhichData = this.rows[i].user_leave.filter(e => [28, 29, 30, 31].includes(e.leaveID));
              // For Attendnace Bonus
              const attnBonus = this.rows[i].user_leave.filter(e => [32].includes(e.leaveID));
              let attendnaceBonusData = (this.rows[i].verified == 1 && attnBonus && attnBonus.length > 0 && +attnBonus[0].values > 0) ? attnBonus : [];

              if (this.rows[i].calculateon == 'hourly' && attendnaceBonusData.length > 0) {
                attendnaceBonusData = attendnaceBonusData.map(e => {
                  return {
                    leave_name: `${e.leave_name} (Hours)`,
                    values: this.convertMinutesToHoursMinutes(e.values)
                  }
                })
              }

              let sandwhichData_TO_Show = [];
              if (All_sandwhichData.length > 0 && ((All_sandwhichData.find(e => e.leaveID == 28) && +All_sandwhichData.find(e => e.leaveID == 28).values > 0) || (All_sandwhichData.find(e => e.leaveID == 29) && +All_sandwhichData.find(e => e.leaveID == 29).values > 0))) {
                this.rows[i].toShowSandwhichData = true;
                sandwhichData_TO_Show = All_sandwhichData.filter(e => e.leaveID != 28);
              }

              this.rows[i].sandwhichData = [...sandwhichData_TO_Show, ...attendnaceBonusData];

              if (this.rows[i].toShowSandwhichData) this.rows[i].user_leave = this.rows[i].user_leave.filter(e => ![29, 30, 31, 32].includes(e.leaveID));
              else this.rows[i].user_leave = this.rows[i].user_leave.filter(e => ![28, 29, 30, 31, 32].includes(e.leaveID));
              // for daily overtime
              if (this.rows[i].overtimeAdded == 'daily') {
                this.rows[i].user_leave = this.rows[i].user_leave.filter((e) => {
                  return e.leaveID != 21;
                });
              }

              let find_hourly = this.rows[i].user_leave.filter((e) => {
                return e.leaveID == 20;
              });



              if (find_hourly.length > 0) {
                let find_hourly1 = this.rows[i].user_leave.filter((e) => {
                  return e.leaveID == 20 || e.leaveID == 21 || e.leaveID == 22;
                });

                let penaltyArray = this.rows[i].user_leave.filter((e) => {
                  return e.leaveID == 22;
                });

                if (penaltyArray.length > 0) {
                  if (Number(penaltyArray[0].values) > 0) {
                  } else {
                    find_hourly1 = find_hourly1.filter((e) => {
                      return e.leaveID != 22;
                    });
                  }
                }

                let sum = find_hourly1.reduce((acc, obj) => {
                  return acc + obj.values;
                }, 0);

                find_hourly1.push({
                  leave_name: 'Total Hours',
                  values: sum,
                });

                find_hourly1.push({
                  leave_name: 'Monthly Shift Hours',
                  values: Math.round(+this.rows[i].Workinghours),
                });

                const ot = find_hourly1.filter((e) => {
                  return e.leaveID == 21;
                });

                const finaldata = find_hourly1.filter((e) => {
                  return e.leaveID != 20 && e.leaveID != 21 && e.leaveID != 22;
                });

                find_hourly1 = [...finaldata, ...penaltyArray, ...find_hourly, ...ot];

                find_hourly1.forEach((ele) => {
                  let hours = ele.values / 60;
                  let minutes: any = ele.values % 60;

                  minutes = Math.trunc(minutes)

                  if (Number(minutes) < 10) {
                    minutes = '0' + minutes;
                  }

                  ele.values = Math.trunc(hours) + '.' + minutes;
                });

                this.rows[i].user_leave = this.rows[i].user_leave.filter((e) => {
                  return e.leaveID != 20 && e.leaveID != 21 && e.leaveID != 22;
                });

                this.rows[i].user_leave = [...this.rows[i].user_leave, ...find_hourly1];
              } else {
                this.rows[i].user_leave = this.rows[i].user_leave;
              }

            }

          }
          this.showloader = false;

          this.page.totalCount = res.totalcount;
          this.spinner.stop('submit');
        } else {
          this.showloader = false;
          this.commonNotificationService.handleError(res.message);
        }
      }, (err) => {
        this.showloader = false;
      });
  }


  changeCoff(data: any) {

    const coffValue = +data.coffValue || 0;

    if (coffValue < 0 || +coffValue % 0.5 != 0) {
      const message = coffValue < 0 ? 'Days cannot be negative.' : 'Only half-day increments are allowed for days.';

      this.commonNotificationService.handleWarning(message);
      // set present days 0

      data.coffValue = 0;
    }
  }

  setValue(data: any = [], id: any, value: number) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].leaveID == +id) {
        data[i].values = +value;
        break;
      }
    }
  }


  changeAttnVal(data1) {

    this.data = [];

    this.data = data1.user_leave;

    const present = this.data.find(e => e.leaveID == 1)?.values || 0;

    if (present < 0 || +present % 0.5 != 0) {
      const message = present < 0 ? 'Present days cannot be negative.' : 'Only half-day increments are allowed for Present.';

      this.commonNotificationService.handleWarning(message);
      // set present days 0
      this.setValue(this.data, 1, 0);

      // set Absent Days

      const absentDays = this.data.filter((s) => s.leaveID != 5).reduce((acc, obj) => acc + +obj.values, 0);

      // set Absent Days
      this.setValue(this.data, 5, +absentDays);

      return;
    }

    // Calculate WeekOff if policy is based on Paid Days
    if (data1.weekoffPolicyType == 'onPresentDay' && +data1.weekoffValue) {
      const PaidDays = this.data.filter(e => ![5, 7, 18, 22, 28, 29, 30, 31, 32].includes(e.leaveID)).reduce((acc, obj) => acc + +obj.values, 0);
      const weekoff = Math.floor(+PaidDays / +data1.weekoffValue);

      // set Weekoff Days
      this.setValue(this.data, 7, +weekoff);

    }

    const absent = data1.TotalDays - this.data.filter((s) => s.leaveID != 5).reduce((acc, obj) => acc + +obj.values, 0);
    if (absent < 0) {
      this.commonNotificationService.handleWarning(
        `Values exceed the total available days (${data1.TotalDays}).`,
      );
      // set present days 0
      this.setValue(this.data, 1, 0);

      if (data1.weekoffPolicyType === 'onPresentDay' && +data1.Weekoffvalue) {
        // set Weekoff Days
        this.setValue(this.data, 7, 0);
      }

      // find Absent Days
      const absentDays = this.data.filter((s) => s.leaveID != 5).reduce((acc, obj) => acc + +obj.values, 0);

      // set Absent Days
      this.setValue(this.data, 5, +absentDays);
      return;
    }

    // set Absent Days
    this.setValue(this.data, 5, +absent);
  }

  changehourvalue(data1) {
    this.data = [];

    this.data = data1.user_leave;


    // if (data1.overtimeAdded == 'daily') {

    // }

    let totalhourdata = this.data.filter((e) => {
      return e.leave_name == 'Total Hours';
    });


    let penaltyhourdata = this.data.filter((e) => {
      return e.leave_name == 'Attendance Penalty';
    });

    let totalhourAmount = parseFloat(totalhourdata[0].values).toFixed(2);

    let numarray = totalhourAmount.toString().split('.');
    var a = new Array();
    a = numarray;

    let hour = a[0];
    let minute = a[1];

    if (minute == undefined) {
      minute = 0;
    }



    let totalpenaltyAmount;
    if (penaltyhourdata.length > 0) {
      totalpenaltyAmount = parseFloat(penaltyhourdata[0].values).toFixed(2);
    } else {
      totalpenaltyAmount = 0.0;
    }

    let numarray1 = totalpenaltyAmount.toString().split('.');
    var a1 = new Array();
    a1 = numarray1;

    let phour = a1[0];
    let pminute = a1[1];

    if (pminute == undefined) {
      pminute = 0;
    }


    if (Number(minute) > 59) {
      this.commonNotificationService.handleError('Minutes value should be less than 60!!');
    } else {
      let totalworkingminutes = Number(hour) * 60 + Number(minute);
      let totalpenaltyminutes = Number(phour) * 60 + Number(pminute);

      let actualtotalmin = Number(totalworkingminutes) - Number(totalpenaltyminutes);

      let actualhour = Number(actualtotalmin) / 60;
      let actualmin: any = Number(actualtotalmin) % 60;

      if (Number(actualmin) < 10) {
        actualmin = '0' + actualmin;
      }

      let finalAmounthour = Math.trunc(actualhour) + '.' + actualmin;


      let workinghour = Number(data1.Workinghours) / 60;

      let workingmin: any = Number(data1.Workinghours) % 60;

      if (Number(workingmin) < 10) {
        workingmin = '0' + workingmin;
      }

      workingmin = Math.trunc(workingmin);
      // For daily overtime

      if (data1.overtimeAdded == 'daily') {
        this.data = data1.user_leave.filter((e) => {
          return e.leave_name != 'Overtime Hours';
        });

        let workingdays: any;

        if (+totalworkingminutes > +data1.Workinghours) {
          workingdays = +data1.Workinghours - +totalpenaltyminutes;
        } else {
          workingdays = actualtotalmin;
        }

        const workinghour = +workingdays / 60;
        let workingmin: any = +workingdays % 60;

        if (+workingmin < 10) {
          workingmin = '0' + workingmin;
        }

        const finalWorkingMinute = Math.trunc(workinghour) + '.' + workingmin;

        this.data.forEach((element) => {
          if (element.leave_name == 'Working Hours') {
            element.values = finalWorkingMinute;
          } else if (element.leave_name == 'Total Hours') {
            element.values = Number(totalhourAmount);
          } else {
          }
        });
      } else {

        if (Number(totalworkingminutes) > Number(data1.Workinghours)) {

          const workingminutes = +data1.Workinghours - +totalpenaltyminutes

          const w_hour = Number(workingminutes) / 60;
          let w_min: any = Number(workingminutes) % 60;

          if (Number(w_min) < 10) {
            w_min = '0' + w_min;
          }

          const otminutes = +totalworkingminutes - +data1.Workinghours;

          const othour = Number(otminutes) / 60;
          let otmin: any = Number(otminutes) % 60;

          if (Number(otmin) < 10) {
            otmin = '0' + otmin;
          }


          this.data.forEach((element) => {
            if (element.leave_name == 'Working Hours') {
              element.values = Math.trunc(+w_hour) + '.' + w_min;
            } else if (element.leave_name == 'Overtime Hours') {
              let othours = Math.trunc(othour) + '.' + +otmin;
              element.values = othours;
            } else if (element.leave_name == 'Total Hours') {
              element.values = Number(totalhourAmount);
            } else {
            }
          });
        } else {
          this.data.forEach((element) => {
            if (element.leave_name == 'Working Hours') {
              element.values = Number(finalAmounthour).toFixed(2);
            } else if (element.leave_name == 'Overtime Hours') {
              element.values = 0;
            } else if (element.leave_name == 'Total Hours') {
              element.values = Number(totalhourAmount);
            } else {
            }
          });
        }

      }
    }
  }

  alertVerify(row) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to verify this?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, verify it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.data == undefined) {
          const bodyAll = {
            companyMasterID: this.body.companyId,
            userMasterID: this.body.userId,
            yearMonth: this.body.month,
            branchMasterID: '',
            verify: '0',
            updateBy: localStorage.getItem('id'),
            updateByIp: this.ipAddress,
            coffType: ['onPresentDay', 'monthlyFix'].includes(row.weekoffPolicyType) && row.calculateon != 'hourly' ? row.coff : null,
            coffValue: ['onPresentDay', 'monthlyFix'].includes(row.weekoffPolicyType) && row.calculateon != 'hourly' ? row.coffValue : 0

          };

          this.showloader = true;
          this.api
            .callApi(
              this.constant.ATTENDANCEVERIFYSINGLE_MULTIPLE,
              bodyAll,
              'POST',
              true,
              false,
              true,
            )
            .subscribe(
              (res: any) => {
                if (res.status == 200) {
                  this.reloadSalaryCalculation.emit()
                  this.commonNotificationService.handleSuccess('Attendance Verified Successfully');
                  this.showloader = false;
                } else {
                  this.commonNotificationService.handleError(res.message);
                  this.showloader = false;
                }
              },
              (err) => {
                this.commonNotificationService.handleError(err);
                this.showloader = false;
              },
            );
        } else {

          let f_data = this.data.filter((e) => {
            return e.leave_name != 'Total Hours' && e.leave_name != 'Monthly Shift Hours';
          });

          const hourlydata = f_data.filter((e) => {
            return e.leave_name == 'Working Hours';
          });

          const body = {
            ArrayData: [],
            weekoffPolicyType: row.weekoffPolicyType,
            weekoffValue: 0,
            coffType: null,
            coffValue: 0
          };

          if (hourlydata.length > 0) {
            let hourlydata1 = f_data.filter((e) => {
              return e.leaveID == 20 || e.leaveID == 21 || e.leaveID == 22;
            });

            hourlydata1.forEach((element) => {
              if (element.values > 0) {
                let numarray = element.values.toString().split('.');
                var a = new Array();
                a = numarray;

                let hour = a[0];
                let minute = a[1];

                let minutes = Number(hour) * 60;
                let finalminutes = Number(minutes) + Number(minute);
                element.values = Math.round(finalminutes);
              } else {
                element.values = 0;
              }
            });

            f_data = f_data.filter((e) => {
              return e.leaveID != 20 && e.leaveID != 21 && e.leaveID != 22;
            });

            f_data = [...f_data, ...hourlydata1];
          } else {
            body.coffType = ['onPresentDay', 'monthlyFix'].includes(row.weekoffPolicyType) ? row.coff : null;
            body.coffValue = ['onPresentDay', 'monthlyFix'].includes(row.weekoffPolicyType) ? row.coffValue : 0
          }


          f_data.forEach((element) => {
            if (element.leaveID == 7 && row.weekoffPolicyType == 'onPresentDay' && !hourlydata.length) body.weekoffValue = +element.values;

            body.ArrayData.push({
              userMasterID: element.userMasterID,
              LeaveTranId: element.leavetranid,
              AttnYearMon: element.AttnYearMon,
              MonDays: element.MonDays,
              MonWorkDays: element.workingdays,
              AttnVal: element.values,
              createBy: localStorage.getItem('id'),
              createByIp: this.ipAddress,
            });
          });

          this.showloader = true;

          this.api
            .callApi(this.constant.UPDATELEAVETRANS, body, 'POST', true, false, true)
            .subscribe(
              (res: any) => {
                if (res.status == 200) {
                  this.data = undefined;
                  this.reloadSalaryCalculation.emit()

                  this.commonNotificationService.handleSuccess('Attendance Verified Successfully');
                  this.showloader = false;
                } else {
                  this.commonNotificationService.handleError(res.message);
                  this.showloader = false;
                }
              },
              (err) => {
                this.commonNotificationService.handleError(err);
                this.showloader = false;
              },
            );
        }
      }
    });
  }

  alertUnVerify(row) {
    // this.unverifyArr.push(row)
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to unverified?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, unverified it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body1 = {
          userMasterID: this.body.userId,
          yearMonth: this.body.month,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };

        this.showloader = true;
        this.api
          .callApi(this.constant.ATTENDANCEUNVERIFY, body1, 'POST', true, false, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.reloadSalaryCalculation.emit()
                this.commonNotificationService.handleSuccess(res.message);
                this.showloader = false;
              } else {
                this.commonNotificationService.handleError(res.message);
                this.showloader = false;
              }
            },
            (err) => {
              this.commonNotificationService.handleError(err);
              this.showloader = false;
            },
          );
      }
    });
  }

  // Calaculate Salary

  calculateSalary(userMasterID) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to calculate Salary?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, calculate it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const filterData = {
          yearmonth: this.body.month,
          from: 'FNF',
          userMasterID: [userMasterID],
          createBy: localStorage.getItem('id'),
          createByIp: this.ipAddress,
        };

        this.salarybuttonState = 'show-spinner';
        this.salarybuttonDisabled = true;
        this.showloader = true;
        this.api
          .callApi(this.constant.GETSALARYCAL, filterData, 'POST', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.reloadSalaryCalculation.emit()
              this.commonNotificationService.handleSuccess('Salary Calculate Successfully');
              this.showloader = false;
            } else {
              this.commonNotificationService.handleError(res.message);
              this.showloader = false;
            }
            this.salarybuttonState = '';
            this.salarybuttonDisabled = false;

          }, (err) => {
            this.commonNotificationService.handleError(err);

            this.showloader = false;
            this.salarybuttonState = '';
            this.salarybuttonDisabled = false;

          });
      }
    });
  }

  // Delete Salary

  deleteSalary(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userMasterID: [data.userMasterID],
          from: 'FNF',
          yearmonth: data.yearMonth,
          createBy: localStorage.getItem('id'),
          createByIp: this.ipAddress,
        };
        this.showloader = true;
        this.api.callApi(this.constant.DELETEALLSALARY, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.reloadSalaryCalculation.emit()
              this.commonNotificationService.handleSuccess(res.message);
              this.showloader = false;
            } else {
              this.commonNotificationService.handleError(res.message);
              this.showloader = false;
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err)
            this.showloader = false;
          },
        );
      }
    });
  }


  //  Show Salary-Slip

  salaryslip(data) {
    const body = {
      yyyymm: data.yearMonth,
      userMasterID: data.userMasterID,
      status: '01',
    };
    this.showloader = true;
    this.api.callApi(this.constant.SALARYDATAUSER, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.salarydata = res.data;
        this.salarydata.path = 'data:application/pdf;base64,' + this.salarydata.path;
        this.showloader = false;
      },
      (err) => {
        console.log('error', err);
        this.showloader = false;
      },
    );
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }

  onClickDownloadPdf() {
    let base64String = this.salarydata.path;
    this.downloadPdf(base64String, 'Salary Slip');
  }

  // Release Salary-Slip

  issueSalarySlip(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Release it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {

        const body = {
          salaryYYYYMM: data.yearMonth,
          userMasterID: [data.userMasterID],
          salarySlipIssue: 1,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.showloader = true;
        this.api.callApi(this.constant.ISSUESALARYSLIP, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              data.salarySlip = false;
              data.unRelease = true;
              this.commonNotificationService.handleSuccess('Salary Slip Released Successfully');
              this.showloader = false;
            } else {
              this.commonNotificationService.handleError(res.message);
              this.showloader = false;
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err);
            this.showloader = false;
          },
        );
      }
    });
  }

  // Un-Release Salary-Slip

  unReleaseSalarySlip(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Un-Release it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {

        const body = {
          salaryYYYYMM: data.yearMonth,
          userMasterID: [data.userMasterID],
          salarySlipIssue: 0,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.showloader = true;
        this.api.callApi(this.constant.ISSUESALARYSLIP, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              data.unRelease = false;
              data.salarySlip = true;
              this.commonNotificationService.handleSuccess('Salary Slip Un-release Successfully');
              this.showloader = false;
            } else {
              this.commonNotificationService.handleError(res.message);
              this.showloader = false;
            }
            this.showloader = false;
          },
          (err) => {
            this.commonNotificationService.handleError(err);
            this.showloader = false;
          },
        );
      }
    });
  }


  checkColor(item) {
    if (item == 'WeekOff') {
      return 'weekly-off';
    } else if (item == 'Holiday') {
      return 'holiday';
    } else if (item == 'Present') {
      return 'present';
    } else if (item == 'Absent') {
      return 'absent';
    } else if (item == 'Half Day') {
      return 'missing-punch';
    } else if (item == 'WeekOff') {
      return 'weekly-off';
    } else if (item == 'Holiday') {
      return 'holiday';
    } else if (item.includes('Present')) {
      return 'present';
    } else if (item.includes('Absent')) {
      return 'absent';
    } else if (item.includes('Absent(S)')) {
      return 'absent';
    }
    else {
      return 'missing-punch';
    }
  }

  // get Attendance data

  getCalenderData(data: any) {
    let body = {
      userMasterID: data.userMasterID,
      calendarstartdate: data.start_date,
      calendarenddate: data.end_date,
    };
    this.showloader = true;
    this.api
      .callApi(this.constant.GETDATACALENDERMONTHWISE, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.attendance = res.data;
          this.attendance = this.attendance.filter((e) => !e.isShift);
          this.attendance1 = this.attendance;

          let data2 = {};
          let result = [];

          for (const entry of this.attendance) {
            const date = entry.date;
            if (!data2[date]) {
              data2[date] = { ...entry };
            } else {
              data2[date].title += `, ${entry.title}`;
            }
          }

          for (const key in data2) {
            result.push(data2[key]);
          }

          this.attendance = result;
        }
        this.showloader = false;
      }, (err) => {
        this.showloader = false;
      });
  }


  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }




}
