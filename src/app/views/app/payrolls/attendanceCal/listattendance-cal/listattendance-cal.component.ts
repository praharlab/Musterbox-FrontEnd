import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { retry } from 'rxjs/operators';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ViewFNFCountComponent } from '../../view-fnf-count/view-fnf-count.component';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { relativeTimeRounding } from 'moment';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-listattendance-cal',
    templateUrl: './listattendance-cal.component.html',
    styleUrls: ['./listattendance-cal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListattendanceCalComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('penaltyForm') penaltyForm: NgForm;
  @ViewChild('addPaidSalary') addPaidSalary: NgForm;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('penaltyModal') penaltyModal: ModalDirective;

  @ViewChild('addattendance') addattendance: NgForm;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('closeModalPaidSalary') closeModalPaidSalary: ElementRef;

  @ViewChild('ViewFNFCountComponent') viewFNFCountComponent: ViewFNFCountComponent;

  penaltyDeductData: any
  penaltyDeductType: string = ''
  selectedPenaltyDeductionType: any = '';
  rows = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    branchMasterID: '',
    userMasterID: [],
    month: '',
    attendanceStatus: '',
    salaryStatus: '',
    salarySlipStatus: '',
    createBy: localStorage.getItem('id'),
    createByIp: '',
    leftdate: '',
  };
  adminRoot = environment.adminRoot;

  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: '',
    YearMM: '',
  };
  events: any;
  filter: any;
  childcompany: any;
  company_id: any;
  cid: any;
  company: any;
  usertype: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  resultColumns: any = [];
  attyear: any;
  attcomp: any;
  allbranch: any;
  alluser: any;

  ipAddress: any;
  selected: any[];
  formdata: { name: string; value: number }[];
  data: any[];
  unverifyArr = [];
  disbutton: any;
  attendancedata: any[];
  rows1: any[];
  salarydata: any;
  salarySlip: any;
  attendance: any = [];
  attendance1: any = [];
  previousMonth: string;
  currentCompany: any;
  photo: any;
  imgshow1: boolean;
  show: boolean;
  htmlelement: any;
  apiURL = environment.apiUrl;
  permissionSalaryEdit: any = [];

  permissionSalaryDelete: any = [];
  file: any;
  format: string;
  url: string | ArrayBuffer;
  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: ''
  }
  alldepartment: any = [];
  alldesignation: any = [];
  allDivision: any = [];
  allWorkingArea: any = [];
  selectedbranch: any;
  selecteddept: any;
  selecteddesig: any;
  selectedDivision: any;
  selectedWorkingArea: any;
  selectedEmployees: any = [];
  // sandwhichData: any = [];
  // toShowSandwhichData = false;
  All_sandwhichData: any = [];
  bodyData = {
    userMasterID: [],
    month: ''
  }
  fnfCountFlag = false;
  permissionFNF: any = [];
  AttendanceBodyData: any;
  permissionAddLCEGPenalty: any = [];
  permissionDeleteLCEGPenalty: any = [];
  AttendanceDate: string = '';
  attendanceStatus: any;
  salaryStatus: any;
  salarySlipStatus: any;
  allUnverifiedFlag: boolean = true;
  allVerifiedFlag: boolean = true;
  allCalulateFlag: boolean = true;
  allDeleteFlag: boolean = true;
  allReleaseFlag: boolean = true;
  allUnreleaseflag: boolean = true;
  employeeName: string = '';
  PaidUserIds: any = [];
  PaidDate: any;
  currentData: any;
  allPaidSalary: boolean = true;
  currentMonth: string;



  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private datePipe: DatePipe
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  async ngOnInit() {
    this.data = undefined;

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: ''
    }

    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = +localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission();
    this.selectcompany(this.company_id, 0);

    this.getcompany();
    this.getIPAddress();

    let date1 = new Date();

    date1.setDate(0);

    this.previousMonth = date1.getFullYear() + '-' + String(date1.getMonth() + 1).padStart(2, '0');
    this.currentMonth = `${date1.getFullYear()}-${(date1.getMonth() + 2)
      .toString()
      .padStart(2, '0')}`;


    // this.todaydate = new Date().toISOString().slice(0, 10);
  }

  preventFutureMonth(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value; // 'YYYY-MM'

    // Only act if a value is selected
    if (!currentValue || !this.currentMonth) return;

    if (event.key === 'ArrowDown') {
      if (+currentValue.substring(5) <= 1) {
        event.preventDefault();
      }
    }

    if (event.key === 'ArrowUp') {
      if (this.currentMonth && currentValue >= this.currentMonth) {
        event.preventDefault();
      }
    }
  }








  changeStatus(type: any) {
    if (type == 'attendance') {
      this.salaryStatus = null;
      this.salarySlipStatus = null;
    }

    if (type == 'salary') {
      this.salarySlipStatus = null;
    }

  }


  getUsers(flag: any) {

    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          // this.showForm = true;
          this.selectAllForDropdownItems(this.alluser);
          let data1 = [];
          this.alluser.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected = data1;
          if (flag == 0) {
            this.getData();
          }
        }
        this.spinner.stop('users');
      });
  }


  selectcompany(id: any, flag: any) {

    this.alldepartment = []
    this.alldesignation = []
    this.allbranch = []
    this.allDivision = []
    this.allWorkingArea = []
    this.alluser = []

    this.selectedbranch = null;
    this.selecteddept = null;
    this.selecteddesig = null;
    this.selectedDivision = null;
    this.selectedWorkingArea = null;
    this.selectedEmployees = []

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: ''
    }


    if (!id) return;
    this.spinner.start('depart')
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;
          // this.filter = 'filt'

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('depart');
        }
      });

    // getDesignationData() {}
    this.spinner.start('desig')
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('desig');
        }
      });

    this.spinner.start('branch')

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('branch');
      });

    this.spinner.start('workingArea');
    this.api
      .callApi(this.constant.LISTWORKINGAREA + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allWorkingArea = res.data;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('workingArea');
      });

    this.spinner.start('Division');
    this.api
      .callApi(this.constant.LISTDIVISION + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allDivision = res.data;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('Division');
      });

    this.users_Body.companyMasterID = id;
    this.getUsers(flag);



  }

  selectbranch(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.branchMasterID = id;
    this.getUsers(1);
  }

  selectdepart(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.departmentID = id;
    this.getUsers(1);
  }


  selectdesig(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.designationID = id;
    this.getUsers(1);
  }


  selectdivision(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.divisionId = id;
    this.getUsers(1);
  }

  selectWorkingArea(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.workingAreaId = id;
    this.getUsers(1);
  }

  convertMinutesToHoursMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60); // Calculate the hours
    const minutes = totalMinutes % 60;          // Calculate the remaining minutes
    return `${hours}:${minutes.toString().padStart(2, '0')}`; // Format as HH:MM
  }


  getData() {

    this.filterData.userMasterID = this.selected;
    this.filterData.month = this.previousMonth.replace('-', '');
    this.filterData.attendanceStatus = '01';
    this.attendanceStatus = '01';

    this.fnfCountFlag = true;

    this.bodyData.userMasterID = this.filterData.userMasterID;
    this.bodyData.month = this.filterData.month;
    this.filterData.companyMasterID = this.company_id;
    this.filterData.branchMasterID = this.selectedbranch

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.GETATTENDANCEBALANCE, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'main';
          this.rows = [];
          this.All_sandwhichData = [];
          this.rows = res.data;

          for (let i = 0; i < this.rows.length; i++) {
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

          this.page.totalCount = res.totalcount;

          this.spinner.stop('submit');
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        }
      }, (err) => {
        this.spinner.stop('submit');
      });
  }


  Export() {

    const body = {
      companyMasterID: this.filterData.companyMasterID,
      branchMasterID: this.filterData.branchMasterID,
      userMasterID: this.filterData.userMasterID,
      month: this.filterData.month,
    }



    this.spinner.start('a');

    this.api
      .callApi(
        this.constant.GETCOUNTWISEATTENDANCEDATA,
        body,
        'POST',
        true,
        true,
        true,
        true,
      )
      .subscribe((res: any) => {



        if (res.type == 'application/json') {

          this.notifications.create(
            'No data found to export!',
            '',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('a');


        } else {

          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'CountWiseAttendance.xlsx');

          this.spinner.stop('a');

        }

      }, (err) => {
        this.notifications.create(
          '',
          err.error.message || 'Someting Went Wrong!',
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
        this.spinner.stop('a');
      },

      );






  }

  uploadAttendance() {
    if (!this.addattendance.valid) {
      return
    }

    const formData = new FormData()

    formData.append('file', this.file)
    formData.append('companyMasterID', this.filterData.companyMasterID)
    formData.append('month', this.filterData.month)

    formData.append('createBy', localStorage.getItem('id'))
    formData.append('createByIp', this.ipAddress)


    this.spinner.start()
    this.api
      .callApi(
        this.constant.UPLOADCOUNTWISEATTENDANCE,
        formData,
        'POST',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create(
              'Done',
              res.message,
              NotificationType.Bare,
              {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              },
            )
            this.closeModal1.nativeElement.click();
            this.addattendance.resetForm();

            if (this.filter == 'filter') {
              this.onSubmit()
            } else if (this.filter == 'main') {
              this.getData();
            } else {

            }


          }
          else {
            this.notifications.create(
              'Error',
              res.message,
              NotificationType.Error,
              {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              },
            ),
              this.addattendance.resetForm();

            this.spinner.stop()
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          })
          this.spinner.stop()
        },
      )
  }


  onSelectFiles(event: any) {
    let filename = event.target.files[0].name

    let ext = filename.substring(filename.lastIndexOf('.') + 1)

    this.file = event.target.files && event.target.files[0]
    if (this.file) {
      var reader = new FileReader()
      reader.readAsDataURL(this.file)
      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image'
      } else if (this.file.type.indexOf('video') > -1) {
        this.format = 'video'
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result
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
            this.company = res.data;

            this.attcomp = localStorage.getItem('attcomp');
            this.attyear = localStorage.getItem('attyear');
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
            this.company = res.data;

            // this.currentCompany = this.company.filter((e) => {

            //   return e.companyMasterID == this.company_id

            // })

            this.spinner.stop();
          }
        });
    }
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCalculation' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCalculation' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCalculation' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCalculation' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.permissionSalaryEdit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SalaryCalculation' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionSalaryDelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SalaryCalculation' &&
              permissionval.operationName.includes('Delete')
            );
          });

          this.permissionFNF = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'FullandFinalSettlement' &&
              permissionval.operationName.includes('View')
            );
          });

          this.permissionAddLCEGPenalty = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PenaltyManagement' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.permissionDeleteLCEGPenalty = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PenaltyManagement' &&
              permissionval.operationName.includes('Delete')
            );
          });



          this.spinner.stop();
        }
      });
  }

  onSubmit() {

    this.data = undefined;

    if (!this.datefilter.valid) {
      return;
    }
    if (this.childcompany == 'true') {
      this.filterData.companyMasterID = this.company_id;
    } else {
      this.cid = this.datefilter.value.cid;
      this.filterData.companyMasterID = this.datefilter.value.cid;
    }

    this.filterData.month = this.datefilter.value.YearMM.replace('-', '');

    if (+this.filterData.month > +this.currentMonth.replace('-', '')) {
      return this.commonNotificationService.handleWarning(`You can't select future month.`)
    }

    if (this.datefilter.value.branch == '' || this.datefilter.value.branch == null) {
      this.filterData.branchMasterID = '';
    } else {
      this.filterData.branchMasterID = this.datefilter.value.branch;
    }

    if (this.datefilter.value.user == '' || this.datefilter.value.user == null) {
      this.filterData.userMasterID = this.selected;
    } else {
      this.filterData.userMasterID = this.datefilter.value.user;
    }

    this.filterData.attendanceStatus = this.attendanceStatus || '01';
    this.filterData.salaryStatus = this.salaryStatus || '';
    this.filterData.salarySlipStatus = this.salarySlipStatus || '';

    this.attendanceStatus = this.attendanceStatus || '01';

    this.filterData.createByIp = this.ipAddress;

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.GETATTENDANCEBALANCE, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.rows = [];
          this.All_sandwhichData = [];
          this.rows = res.data;

          this.bodyData.userMasterID = this.filterData.userMasterID;
          this.bodyData.month = this.filterData.month;

          this.viewFNFCountComponent?.getCount();

          //----------- set all calculation buttons flag--------------------

          const { attendanceStatus, salaryStatus, salarySlipStatus } = this.filterData;
          const isVerified = ['0', '01'].includes(attendanceStatus);
          const isOnlyUnverified = attendanceStatus == '1' && salaryStatus != '1';
          const isFinalized = salaryStatus == '1';
          const isSlipUnreleased = salarySlipStatus == '0' || !salarySlipStatus;
          const isSlipReleased = salarySlipStatus == '1' || !salarySlipStatus;
          const isPaidSalary = salaryStatus == '2';


          this.allVerifiedFlag = isVerified && !isPaidSalary;
          this.allUnverifiedFlag = (attendanceStatus == '01' || isOnlyUnverified) && !isPaidSalary;
          this.allCalulateFlag = (attendanceStatus == '01' || isOnlyUnverified) && !isPaidSalary;
          this.allDeleteFlag = attendanceStatus == '01' || (isFinalized && !salarySlipStatus && !isPaidSalary);
          this.allReleaseFlag = attendanceStatus == '01' || (isFinalized && isSlipUnreleased && !isPaidSalary);
          this.allUnreleaseflag = attendanceStatus == '01' || (isFinalized && isSlipReleased && !isPaidSalary);
          this.allPaidSalary = (attendanceStatus == '01' || isFinalized) && !isPaidSalary;

          for (let i = 0; i < this.rows.length; i++) {
            let photo = this.rows[i].userPhoto;

            if (photo != '' && photo != null) {
              let img = new Image();
              img.src = this.apiURL + 'uploads/user/photo/' + photo;
              if (img.complete) {
                this.rows[i].imgshow1 = true;
              } else {
                img.onload = () => {
                  this.rows[i].imgshow1 = true;
                };
                img.onerror = () => {
                  this.rows[i].imgshow1 = false;
                };
              }
            } else {
              this.rows[i].imgshow1 = false;
            }

            if (this.rows[i].user_leave.length > 0) {

              // Logic for sandwhich Data
              const All_sandwhichData = this.rows[i].user_leave.filter(e => [28, 29, 30, 31].includes(e.leaveID));
              // For Attendnace Bonus
              const attnBonus = this.rows[i].user_leave.filter(e => e.leaveID == 32);
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
                  values: this.rows[i].Workinghours,
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

                  minutes = Math.trunc(minutes);

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

          this.page.totalCount = res.totalcount;

          this.spinner.stop('submit');
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        }
      }, (err) => {
        this.spinner.stop('submit');
      });
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (this.filter == 'filter') {
      this.filterData.page = e.page;
      this.onSubmit();
    } else if (this.filter == 'main') {
      this.filterData.page = e.page;
      this.getData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (this.filter == 'filter') {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.onSubmit();
    } else if (this.filter == 'main') {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getData();
    } else {
      console.log('error');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/payrolls/attendancecal/addattendancecal']);
  }

  clear() {
    window.location.reload();
  }


  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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
    if (absent < 0 && +localStorage.getItem('company_id') != 384) {
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
      this.notifications.create(
        'Error',
        'Minutes value should be less than 60!!',
        NotificationType.Error,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      this.spinner.stop();
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

  alertVerify(row: any) {
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
            companyMasterID: this.datefilter.value.cid,
            userMasterID: row.user_leave[0].userMasterID,
            yearMonth: row.user_leave[0].AttnYearMon,
            branchMasterID: this.datefilter.value.branch,
            verify: '0',
            updateBy: localStorage.getItem('id'),
            updateByIp: this.ipAddress,
            coffType: ['onPresentDay', 'monthlyFix'].includes(row.weekoffPolicyType) && row.calculateon != 'hourly' ? row.coff : null,
            coffValue: ['onPresentDay', 'monthlyFix'].includes(row.weekoffPolicyType) && row.calculateon != 'hourly' ? row.coffValue : 0
          };

          this.spinner.start('verify');
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
                  this.onSubmit();
                  this.notifications.create(
                    'Done',
                    'Attendance Verified Successfully',
                    NotificationType.Bare,
                    { theClass: 'outline primary', timeOut: 3000, showProgressBar: true },
                  );

                  this.spinner.stop('verify');
                } else {
                  this.notifications.create('Error', res.message, NotificationType.Bare, {
                    theClass: 'outline primary',
                    timeOut: 3000,
                    showProgressBar: false,
                  });
                  this.spinner.stop('verify');
                }
              },
              (err) => {
                this.notifications.create('Error', err, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop('verify');
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

          this.spinner.start('verify');

          this.api
            .callApi(this.constant.UPDATELEAVETRANS, body, 'POST', true, false, true)
            .subscribe(
              (res: any) => {
                if (res.status == 200) {
                  this.data = undefined;

                  this.onSubmit();
                  this.notifications.create(
                    'Done',
                    'Attendance Verified Successfully',
                    NotificationType.Bare,
                    { theClass: 'outline primary', timeOut: 3000, showProgressBar: true },
                  );

                  this.spinner.stop('verify');
                } else {
                  this.notifications.create('Error', res.message, NotificationType.Bare, {
                    theClass: 'outline primary',
                    timeOut: 3000,
                    showProgressBar: false,
                  });
                  this.spinner.stop('verify');
                }
              },
              (err) => {
                this.notifications.create('Error', err, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop('verify');
              },
            );
        }
      }
    });
  }

  alertVerifyAll() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to verify All?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, verify it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const bodyAll = {
          companyMasterID: this.datefilter.value.cid,
          userMasterID: this.filterData.userMasterID,
          yearMonth: this.datefilter.value.YearMM.replace('-', ''),
          branchMasterID: this.datefilter.value.branch,
          verify: '1',
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
          leftdate: '',
        };
        this.spinner.start();

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
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                // this.ngOnInit();
                setTimeout(() => {
                  // this.router.navigate(['app/attendancecal'])
                  this.spinner.stop();
                }, 3000);
                this.onSubmit();
                // this.spinner.stop()
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
          userMasterID: row.userMasterID,
          yearMonth: row.yearMonth,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };

        this.spinner.start('unverify');

        this.api
          .callApi(this.constant.ATTENDANCEUNVERIFY, body1, 'POST', true, false, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.onSubmit();
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });

                this.spinner.stop('unverify');
              } else {
                this.notifications.create('Error', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop('unverify');
              }
            },
            (err) => {
              this.notifications.create('Error', err, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('unverify');
            },
          );
      }
    });
  }

  alertUnVerifyAll() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to UnVerified All?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, UnVerified it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body1 = {
          companyMasterID: this.datefilter.value.cid,
          userMasterID: this.filterData.userMasterID,
          yearMonth: this.datefilter.value.YearMM.replace('-', ''),
          branchMasterID: this.datefilter.value.branch,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
          leftdate: '',
        };

        this.spinner.start('unverifyall');

        this.api
          .callApi(this.constant.ATTENDANCEUNVERIFYALL, body1, 'POST', true, false, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.onSubmit();

                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });

                this.spinner.stop('unverifyall');
              } else {
                this.notifications.create('Error', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop('unverifyall');
              }
            },
            (err) => {
              this.notifications.create('Error', err, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('unverifyall');
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
          yearmonth: this.datefilter.value.YearMM.replace('-', ''),
          from: 'salary',
          userMasterID: [userMasterID],
          createBy: localStorage.getItem('id'),
          createByIp: this.ipAddress,
        };

        this.spinner.start('calculate');
        this.api
          .callApi(this.constant.GETSALARYCAL, filterData, 'POST', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.onSubmit();
              this.notifications.create(
                'Done',
                'Salary Calculate Successfully',
                NotificationType.Bare,
                { theClass: 'outline primary', timeOut: 3000, showProgressBar: true },
              );

              this.spinner.stop('calculate');
            } else {
              this.notifications.create('Warning', res.message, NotificationType.Warn, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('calculate');
            }
          }, (err) => {
            this.spinner.stop('calculate');
          });
      }
    });
  }

  // Calculate All Salary

  calculateAllSalary() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to calculate All Salary?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, calculate it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        let filterData = {
          yearmonth: this.datefilter.value.YearMM.replace('-', ''),
          from: 'salary',
          userMasterID: [],
          createBy: localStorage.getItem('id'),
          createByIp: this.ipAddress,
        };

        if (this.datefilter.value.user == '' || this.datefilter.value.user == null) {
          filterData.userMasterID = this.selected;
        } else {
          filterData.userMasterID = this.datefilter.value.user;
        }

        this.spinner.start('calculate');
        this.api
          .callApi(this.constant.GETSALARYCAL, filterData, 'POST', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.onSubmit();
              this.notifications.create(
                'Done',
                'Salary Calculate successfully',
                NotificationType.Bare,
                { theClass: 'outline primary', timeOut: 3000, showProgressBar: true },
              );

              this.spinner.stop('calculate');
            } else {
              this.notifications.create('Warning', res.message, NotificationType.Warn, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('calculate');
            }
          }, (err) => {
            this.spinner.stop('calculate');
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
          yearmonth: data.yearMonth,
          from: 'salary',
          createBy: localStorage.getItem('id'),
          createByIp: this.ipAddress,
        };
        this.spinner.start('delete');
        this.api.callApi(this.constant.DELETEALLSALARY, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {

              this.onSubmit();

              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.spinner.stop('delete');
            } else {
              this.notifications.create('Error', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('delete');
            }
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop('delete');
          },
        );
      }
    });
  }

  // delete All Salary

  deleteAllSalary() {
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
          userMasterID: this.filterData.userMasterID,
          yearmonth: this.filterData.month,
          from: 'salary',
          createBy: localStorage.getItem('id'),
          createByIp: this.ipAddress,
        };
        this.spinner.start('deleteAll');
        this.api.callApi(this.constant.DELETEALLSALARY, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.onSubmit();
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });

              this.spinner.stop('deleteAll');
            } else {
              this.notifications.create('Error', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('deleteAll');
            }
          },
          (err) => {
            this.spinner.stop('deleteAll');
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
    this.spinner.start('salaryslip');
    this.api.callApi(this.constant.SALARYDATAUSER, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.salarydata = res.data;
        this.salarydata.path = 'data:application/pdf;base64,' + this.salarydata.path;


        this.spinner.stop('salaryslip');
      },
      (err) => {
        console.log('error', err);
        this.spinner.stop('salaryslip');
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
        this.spinner.start('issue');
        this.api.callApi(this.constant.ISSUESALARYSLIP, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              data.salarySlip = false;
              data.unRelease = true;
              this.onSubmit();
              this.notifications.create(
                'Done',
                'Salary Slip Released Successfully',
                NotificationType.Bare,
                { theClass: 'outline primary', timeOut: 3000, showProgressBar: true },
              );

              this.spinner.stop('issue');
            } else {
              this.notifications.create('Error', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('issue');
            }
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop('issue');
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
        this.spinner.start();
        this.api.callApi(this.constant.ISSUESALARYSLIP, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              data.unRelease = false;
              data.salarySlip = true;
              this.onSubmit();
              this.notifications.create(
                'Done',
                'Salary Slip Un-release Successfully',
                NotificationType.Bare,
                { theClass: 'outline primary', timeOut: 3000, showProgressBar: true },
              );
              // this.ngOnInit();

              // this.onSubmit();
              this.spinner.stop();
            } else {
              this.notifications.create('Error', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            }

            // this.rows = this.rows.filter(
            //   (obj) => obj.UserMasterID != id.UserMasterID,
            // )
            // this.onSubmit();

            // this.spinner.stop()
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop();
          },
        );
      }
    });
  }

  // Release All Salary-Slip

  releaseAll() {
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
          salaryYYYYMM: this.filterData.month,
          userMasterID: this.filterData.userMasterID,
          salarySlipIssue: 1,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.spinner.start();
        this.api.callApi(this.constant.ISSUESALARYSLIP, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.onSubmit();
              this.notifications.create(
                'Done',
                'Salary Slip Released Successfully',
                NotificationType.Bare,
                { theClass: 'outline primary', timeOut: 3000, showProgressBar: true },
              );
              // this.ngOnInit();

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
            console.log('error', err);
            this.spinner.stop();
          },
        );
      }
    });
  }

  // Un-Release All Salary-Slip

  unReleaseAll() {
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
          salaryYYYYMM: this.filterData.month,
          userMasterID: this.filterData.userMasterID,
          salarySlipIssue: 0,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.spinner.start();
        this.api.callApi(this.constant.ISSUESALARYSLIP, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.onSubmit();
              this.notifications.create(
                'Done',
                'Salary Slip Un-release Successfully',
                NotificationType.Bare,
                { theClass: 'outline primary', timeOut: 3000, showProgressBar: true },
              );
              // this.ngOnInit();

              this.spinner.stop();
            } else {
              this.notifications.create('Error', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            }

            // this.rows = this.rows.filter(
            //   (obj) => obj.UserMasterID != id.UserMasterID,
            // )
            // this.onSubmit();

            // this.spinner.stop()
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop();
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
    this.AttendanceBodyData = data;
    let body = {
      userMasterID: data.userMasterID,
      calendarstartdate: data.start_date,
      calendarenddate: data.end_date,
    };
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETDATACALENDERMONTHWISE, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.penaltyForm.resetForm();
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
              data2[date].addPenaltyFlag = data2[date].addPenaltyFlag == false ? false : entry.addPenaltyFlag
            }
          }

          for (const key in data2) {
            result.push(data2[key]);
          }

          this.attendance = result;
        }
        this.spinner.stop('data');
      }, (err) => {
        this.spinner.stop('data');
      });
  }

  navigateToFNFProcess(data: any): void {
    const body = {
      companyId: this.company_id,
      userId: data.userMasterID,
      month: data.yearMonth,
    }
    this.formValueStorageService.navigate(
      'salaryCalculationComponent',
      body,
      '/payrolls/fnf/view',
      data.userMasterID,
    );
  }

  submitPenaltyDeduction() {

    if (!this.penaltyForm.valid) return;

    let body = {
      userMasterID: this.penaltyDeductData?.userMasterId,
      AttendanceDate: this.penaltyDeductData?.date,
      penaltyType: this.penaltyDeductType,
      penaltyDeductionType: this.penaltyForm.value.penaltyDeductionType,
      value: this.penaltyForm.value.penaltyValue,
    }

    this.spinner.start('penultyDeductionSubmit');
    this.api
      .callApi(this.constant.ADDLCEGMANUALLYPENALTY, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {

          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });

          this.penaltyModal.hide();
          this.penaltyForm.resetForm();
          this.getCalenderData(this.AttendanceBodyData);
          this.getDataByUpdatedUser()
        } else {
          this.notifications.create('Warning', res.message, NotificationType.Warn, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });

        }
        this.spinner.stop('penultyDeductionSubmit');
      }, (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('penultyDeductionSubmit');
      })
  }

  alertConfirmation(data: any, type: any) {

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
          userMasterID: data.userMasterId,
          AttendanceDate: data.date,
          penaltyType: type
        }


        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELTELCEGMANUALLYPENALTY, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getCalenderData(this.AttendanceBodyData);
                this.getDataByUpdatedUser()
                this.spinner.stop('confirm');
              } else {
                this.notifications.create('Error', res.message, NotificationType.Warn, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop('confirm');
              }
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Error, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }

  openModal(data: any, type: string) {
    this.penaltyDeductData = data;
    this.penaltyDeductType = type;
    this.AttendanceDate = this.datePipe.transform(this.penaltyDeductData.date, 'dd-MM-yyyy') + ' ' + `(${type})`;
    this.penaltyModal.show()
  }

  getDataByUpdatedUser() {
    const body = {
      userMasterID: [this.AttendanceBodyData.userMasterID],
      month: this.filterData.month,
      attendanceStatus: this.filterData.attendanceStatus || '01',
      companyMasterID: this.company_id,
      branchMasterID: this.selectedbranch
    }

    this.fnfCountFlag = true;
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.GETATTENDANCEBALANCE, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.spinner.start('submit');
          let updatedRow: any = {}
          if (res.data.length == 1) {
            updatedRow = res.data[0];
          }
          let photo = updatedRow.userPhoto;
          if (photo != '' && photo != null) {
            let img = new Image();
            img.src = this.apiURL + 'uploads/user/photo/' + photo;
            if (img.complete) {
              updatedRow.imgshow1 = true;
              // updatedRow.show = !this.show;
              // this.htmlelement.style.visibility = 'visible';
            } else {
              img.onload = () => {
                updatedRow.imgshow1 = true;
                // this.show = !this.show;
                // this.htmlelement.style.visibility = 'visible';
              };
              img.onerror = () => {
                updatedRow.imgshow1 = false;
              };
            }
          } else {
            updatedRow.imgshow1 = false;
            // this.show = !this.show;
            // this.htmlelement.style.visibility = 'visible';
          }

          if (updatedRow?.user_leave?.length > 0) {
            // Logic for sandwhich Data
            const All_sandwhichData = updatedRow.user_leave?.filter(e => [28, 29, 30, 31].includes(e.leaveID));
            // For Attendnace Bonus
            const attnBonus = updatedRow.user_leave?.filter(e => [32].includes(e.leaveID));
            let attendnaceBonusData = (updatedRow.verified == 1 && attnBonus && attnBonus.length > 0 && +attnBonus[0].values > 0) ? attnBonus : [];

            if (updatedRow.calculateon == 'hourly' && attendnaceBonusData.length > 0) {
              attendnaceBonusData = attendnaceBonusData.map(e => {
                return {
                  leave_name: `${e.leave_name} (Hours)`,
                  values: this.convertMinutesToHoursMinutes(e.values)
                }
              })
            }

            let sandwhichData_TO_Show = [];
            if (All_sandwhichData.length > 0 && ((All_sandwhichData.find(e => e.leaveID == 28) && +All_sandwhichData.find(e => e.leaveID == 28).values > 0) || (All_sandwhichData.find(e => e.leaveID == 29) && +All_sandwhichData.find(e => e.leaveID == 29).values > 0))) {
              updatedRow.toShowSandwhichData = true;
              sandwhichData_TO_Show = All_sandwhichData.filter(e => e.leaveID != 28);
            }

            updatedRow.sandwhichData = [...sandwhichData_TO_Show, ...attendnaceBonusData];

            if (updatedRow.toShowSandwhichData) updatedRow.user_leave = updatedRow.user_leave.filter(e => ![29, 30, 31, 32].includes(e.leaveID));
            else updatedRow.user_leave = updatedRow.user_leave.filter(e => ![28, 29, 30, 31, 32].includes(e.leaveID));
            // for daily overtime
            if (updatedRow.overtimeAdded == 'daily') {
              updatedRow.user_leave = updatedRow.user_leave.filter((e) => {
                return e.leaveID != 21;
              });
            }

            let find_hourly = updatedRow.user_leave.filter((e) => {
              return e.leaveID == 20;
            });



            if (find_hourly.length > 0) {
              let find_hourly1 = updatedRow.user_leave.filter((e) => {
                return e.leaveID == 20 || e.leaveID == 21 || e.leaveID == 22;
              });

              let penaltyArray = updatedRow.user_leave.filter((e) => {
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
                values: Math.round(+updatedRow.Workinghours),
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

              updatedRow.user_leave = updatedRow.user_leave.filter((e) => {
                return e.leaveID != 20 && e.leaveID != 21 && e.leaveID != 22;
              });

              updatedRow.user_leave = [...updatedRow.user_leave, ...find_hourly1];
            } else {
              updatedRow.user_leave = updatedRow.user_leave;
            }

          }

          const index = this.rows.findIndex(x => x.userMasterID == updatedRow.userMasterID);
          if (index != -1) {
            this.rows[index] = updatedRow;
          }

          this.spinner.stop('submit');
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        }
      }, (err) => {
        this.spinner.stop('submit');
      });
  }

  paidSalary(type: string, data: any) {
    this.PaidDate = null;
    this.AttendanceBodyData = null;
    this.employeeName = null
    this.AttendanceBodyData = data && type == 'single' ? data : null;

    this.AttendanceBodyData.type = type;

    this.employeeName = data && type == 'single' ? data.userName : '';
    this.PaidUserIds = data ? [data.userMasterID] : this.filterData.userMasterID

  }

  submitPaidSalary() {
    if (!this.addPaidSalary.valid) return;

    const body = {
      userMasterID: this.PaidUserIds,
      paidDate: this.PaidDate,
      salaryYYYYMM: this.filterData.month
    }

    this.spinner.start('paid');
    this.api
      .callApi(this.constant.PAIDSALARY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            this.AttendanceBodyData?.type == 'single' ? this.getDataByUpdatedUser() : this.onSubmit();
            this.closeModalPaidSalary.nativeElement.click();
            this.addPaidSalary.resetForm();

            this.spinner.stop('paid');
          } else {
            this.notifications.create('Error', res.message, NotificationType.Warn, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('paid');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('confirm');
        },
      );
  }


}
