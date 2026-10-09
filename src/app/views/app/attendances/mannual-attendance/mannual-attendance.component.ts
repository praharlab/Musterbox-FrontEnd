import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-mannual-attendance',
    templateUrl: './mannual-attendance.component.html',
    styleUrls: ['./mannual-attendance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MannualAttendanceComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  minFromDate = new Date();
  maxToDate = new Date();
  minFromDate1 = new Date();
  maxToDate1 = new Date();

  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal: boolean;
  usertype: string;
  company_id: string;
  permissioncreate: any;
  permissionedit: any;
  permissionview: any;
  permissiondelete: any;
  company1: any;
  allbranch: any;
  empList: any;

  filterData = {
    page: 1,
    limit: 10,
  };

  body = {
    companyMasterID: '',
    branchMasterID: '',
    userMasterID: '',
    date: '',
    attendancetype: '',
    shift: '',
    page: 1,
    limit: 10,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  temp: any[];
  rows: any = [];
  filter: string;
  limit: Number;
  rows1: any;
  branch1: any;
  finaldata: any = [];
  validdate1: string;
  validdate2: string;
  companyData: any;
  todaydate: any;
  allshift: any;
  Attnvalue: any;
  selected: any[];
  ipAddress: any;
  // date1 = new Date().toISOString();
  alldesignation: any[];
  allDivision: any[];
  allWorkingArea: any[];
  selectedbranch: any;
  selecteddept: any;
  selecteddesig: any;
  selectedDivision: any;
  selectedWorkingArea: any;

  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: '',
    branchStartDate: '',
    branchEndDate: ''
  }
  alldepartment: any[];
  employee: any[];
  selectedEmployees: any[];
  employees: any[];

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
    this.rows = [];
    this.finaldata = [];
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: '',
      branchStartDate: '',
      branchEndDate: ''
    }

    this.alldepartment = []
    this.alldesignation = []
    this.allbranch = []
    this.allDivision = []
    this.allWorkingArea = []
    this.employees = [];

    this.selectedbranch = null;
    this.selecteddept = null;
    this.selecteddesig = null;
    this.selectedDivision = null;
    this.selectedWorkingArea = null;

    this.getcompany();
    this.companydata();
    this.selectcompany(this.company_id);
    this.checkpermission();
    this.todayDate();
    this.getIPAddress();
  }

  todayDate() {
    this.todaydate = new Date().toISOString().slice(0, 10);
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
              permissionval.formName == 'ManualAttendance' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ManualAttendance' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ManualAttendance' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ManualAttendance' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop();
        }
      });
  }

  companydata() {
    let companyid = localStorage.getItem('company_id');
    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + companyid, {}, 'GET', false, true, true)
      .subscribe((res: any) => {
        this.companyData = res.data;
      });
  }

  // selectcompany1() {
  //   this.api
  //     .callApi(this.constant.BRANCHBYCOMPANYDATA1 + this.company_id, {}, 'GET', true, false, true)
  //     .subscribe((res: any) => {
  //       this.allbranch = res;
  //     });
  // }

  // selectcompany(id) {
  //   this.api
  //     .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
  //     .subscribe((res: any) => {
  //       this.allbranch = res;
  //     });
  // }

  // selectbranch(id) {
  //   const filterData = {
  //     branchMasterID: id,
  //     branchStartDate: this.datefilter.value.date,
  //     branchEndDate: this.datefilter.value.date,

  //   };
  //   if (
  //     id != '' &&
  //     id != null &&
  //     this.datefilter.value.date != '' &&
  //     this.datefilter.value.date != null
  //   ) {
  //     this.api
  //       .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
  //       .subscribe((res: any) => {
  //         if (res.status == 200) {
  //           this.empList = res.data;
  //           this.selectAllForDropdownItems(this.empList);
  //           this.empList.map((el) => {
  //             el.name = el.displayName;
  //           });

  //           let data1 = [];
  //           this.empList.forEach(async (rating) => {
  //             data1.push(rating.userMasterID);
  //           });
  //           this.selected = data1;
  //           this.spinner.stop();
  //         }
  //       });
  //   } else if (this.datefilter.value.date == '') {
  //     this.notifications.create('Error', 'Please Select Attendance Date ', NotificationType.Bare, {
  //       theClass: 'outline primary',
  //       timeOut: 3000,
  //       showProgressBar: false,
  //     });
  //     this.spinner.stop();
  //   } else {
  //   }
  // }

  getUsers() {

    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employees = res.data;
          this.selectAllForDropdownItems(this.employees);
        }
        this.spinner.stop('users');
      });
  }

  selectcompany(id) {


    this.alldepartment = []
    this.alldesignation = []
    this.allbranch = []
    this.allDivision = []
    this.allWorkingArea = []
    this.employees = [];

    this.selectedbranch = null;
    this.selecteddept = null;
    this.selecteddesig = null;
    this.selectedDivision = null;
    this.selectedWorkingArea = null;

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: '',
      branchStartDate: '',
      branchEndDate: ''
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
    // this.getUsers();

  }


  selectbranch(id) {
    this.employees = [];
    this.selectedEmployees = [];
    this.users_Body.branchMasterID = id;

    if (this.datefilter.value.date == '') {
      return this.notifications.create('Error', 'Please Select Attendance Date ', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }

    this.getUsers();
  }

  selectdepart(id) {
    this.employees = [];
    this.selectedEmployees = [];
    this.users_Body.departmentID = id;
    this.getUsers();
  }


  selectdesig(id) {
    this.employees = [];
    this.selectedEmployees = [];
    this.users_Body.designationID = id;
    this.getUsers();
  }


  selectdivision(id) {
    this.employees = [];
    this.selectedEmployees = [];
    this.users_Body.divisionId = id;
    this.getUsers();
  }

  selectWorkingArea(id) {
    this.employees = [];
    this.selectedEmployees = [];
    this.users_Body.workingAreaId = id;
    this.getUsers();
  }

  selectdate(date) {

    this.users_Body.branchStartDate = this.datefilter.value.date;
    this.users_Body.branchEndDate = this.datefilter.value.date;
    if (
      this.datefilter.value.branch != '' &&
      this.datefilter.value.branch != null &&
      this.datefilter.value.date != '' &&
      this.datefilter.value.date != null
    ) {
      this.getUsers();
    } else if (this.datefilter.value.date == '') {
      return this.notifications.create('Error', 'Please Select Branch ', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      // this.spinner.stop();
    } else {
    }
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  selectAttn(event) {
    this.Attnvalue = event;

    // if (event == '1') {
    //   let filterData = {
    //     page: '',
    //     limit: '',
    //     companyMasterID: this.datefilter.value.company,
    //   };

    //   this.spinner.start();
    //   this.api
    //     .callApi(this.constant.GETSHIFTDATA, filterData, 'POST', true, false, true)
    //     .subscribe((res: any) => {
    //       if (res.status == 200) {
    //         this.allshift = res.data;

    //         this.spinner.stop();
    //       }
    //     });
    // }
  }

  onChange(e: any) {
    // if (this.filter == 'main') {
    //   this.filterData.page = e.offset + 1
    //   this.ngOnInit()

    if (this.filter == 'filter') {
      this.body.page = e.offset + 1;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    // if (this.filter == 'main') {
    //   this.filterData.limit = ev
    //   this.limit = this.filterData.limit
    //   this.ngOnInit()

    if (this.filter == 'filter') {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }

  getFormatDateTime(datetime) {
    var today = new Date(datetime);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    let h = (today.getHours() < 10 ? '0' : '') + today.getHours();
    let m = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();

    return yyyy + '-' + mm + '-' + dd + 'T' + h + ':' + m;

  }

  onSubmit() {
    this.rows = [];
    this.finaldata = [];
    this.body.companyMasterID = this.datefilter.value.company;
    // this.body.branchMasterID = this.datefilter.value.branch;
    // if (this.datefilter.value.employee == null || this.datefilter.value.employee == '') {
    //   this.body.userMasterID = '';
    // } else {
    //   this.body.userMasterID = this.datefilter.value.employee;
    // }

    this.body.userMasterID = this.datefilter.value.employee;

    this.body.attendancetype = this.datefilter.value.AttendanceType;
    this.body.date = this.datefilter.value.date;
    // this.body.shift = this.datefilter.value.shiftID;

    if (!this.datefilter.valid) {
      return;
    }

    this.spinner.start();
    this.api
      .callApi(this.constant.GETMANNUALATTENDANCEDATA_V2, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          // this.filter = 'filter';
          this.rows = res.data;

          for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].punchInTime) {
              this.rows[i].punchin = this.getFormatDateTime(this.rows[i].punchInTime);
            } else {
              this.rows[i].punchin = '';
            }
            if (this.rows[i].punchOutTime) {
              this.rows[i].punchout = this.getFormatDateTime(this.rows[i].punchOutTime);
            } else {
              this.rows[i].punchout = '';
            }
            // if (this.rows[i].present == '1') {
            //   this.rows[i].attendanceType = 'P';
            // } else if (this.rows[i].present == '0.5') {
            //   this.rows[i].attendanceType = 'HD';
            // } else {
            //   this.rows[i].attendanceType = 'A';
            // }

            this.rows[i].minpunchinvalid = this.rows[i].attendance_date + 'T' + '01:00';
            this.rows[i].maxpunchinvalid = this.rows[i].attendance_date + 'T' + '12:59';

            var date1 = new Date(this.rows[i].attendance_date);

            date1.setDate(date1.getDate() + 1);

            let final_date =
              date1.getFullYear() +
              '-' +
              String(date1.getMonth() + 1).padStart(2, '0') +
              '-' +
              String(date1.getDate()).padStart(2, '0');

            this.rows[i].maxpunchinvalid1 = final_date + 'T' + '12:59';
          }
          // this.selectBranch();
        } else if (res.status == 400) {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        }
        this.spinner.stop();
      });
  }

  selectBranch() {
    this.api
      .callApi(
        this.constant.VIEWBRANCH + this.datefilter.value.branch,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.branch1 = res.data;
        }
      });
  }

  manual(maindata, type: any) {

    if (type == 'in') maindata.IN_Change = true;
    if (type == 'out') maindata.OUT_Change = true;

    if (this.body.attendancetype == '1') {
      if (maindata.attendanceType == '1') {
        maindata.punchin = 'fullday';
        maindata.punchout = 'fullday';
      } else if (maindata.attendanceType == '0.5') {
        maindata.punchin = 'halfday';
        maindata.punchout = 'halfday';
      } else if (maindata.attendanceType == '0') {
        maindata.punchin = '';
        maindata.punchout = '';
      }
    }


    const result = this.finaldata.filter(
      (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
    );

    if (result.length > 0) {
      this.finaldata.splice(
        this.finaldata.findIndex(
          (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
        ),
        1,
      );

      if (maindata.punchin || maindata.punchout) this.finaldata.push(maindata);

      if (
        !maindata.punchin &&
        !maindata.punchout &&
        (maindata.punchInTime || maindata.punchOutTime)
      ) {
        this.finaldata.push(maindata);
      }

    } else {

      if (maindata.punchin || maindata.punchout || type) this.finaldata.push(maindata);

      if (maindata.attendanceType == '0' && this.body.attendancetype == '1') this.finaldata.push(maindata);


      if ((maindata.attendanceType == '1' || maindata.attendanceType == '0.5') && this.body.attendancetype == '1' && !maindata.punchin && !maindata.punchout) this.finaldata.push(maindata);

    }



    // if (maindata.attendanceType == '1') {
    //   maindata.punchin = 'fullday';

    //   if (
    //     new Date(maindata.attendance_date + ' ' + maindata.ShiftIntime) >
    //     new Date(maindata.attendance_date + ' ' + maindata.ShiftoutTime)
    //   ) {
    //     let outdate = new Date(maindata.attendance_date);

    //     outdate.setDate(outdate.getDate() + 1);

    //     let end_date =
    //       outdate.getFullYear() +
    //       '-' +
    //       String(outdate.getMonth() + 1).padStart(2, '0') +
    //       '-' +
    //       String(outdate.getDate()).padStart(2, '0');

    //     maindata.punchout = end_date + ' ' + maindata.ShiftoutTime;
    //   } else {
    //     maindata.punchout = maindata.attendance_date + ' ' + maindata.ShiftoutTime;
    //   }
    // } else if (maindata.attendanceType == '0.5') {
    //   maindata.punchin = maindata.attendance_date + ' ' + maindata.ShiftIntime;

    //   if (
    //     new Date(maindata.attendance_date + ' ' + maindata.ShiftIntime) >
    //     new Date(maindata.attendance_date + ' ' + maindata.halfday)
    //   ) {
    //     let outdate = new Date(maindata.attendance_date);

    //     outdate.setDate(outdate.getDate() + 1);

    //     let end_date =
    //       outdate.getFullYear() +
    //       '-' +
    //       String(outdate.getMonth() + 1).padStart(2, '0') +
    //       '-' +
    //       String(outdate.getDate()).padStart(2, '0');

    //     maindata.punchout = end_date + ' ' + maindata.halfday;
    //   } else {
    //     maindata.punchout = maindata.attendance_date + ' ' + maindata.halfday;
    //   }
    // } else if (maindata.attendanceType == '0') {
    //   maindata.punchin = '';
    //   maindata.punchout = '';
    // }

    // const result = this.finaldata.filter(
    //   (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
    // );
    // if (result.length > 0) {
    //   this.finaldata.splice(
    //     this.finaldata.findIndex(
    //       (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
    //     ),
    //     1,
    //   );
    //   if (maindata.punchin != '' || maindata.punchout != '') {
    //     this.finaldata.push(maindata);
    //   }

    //   if (
    //     maindata.punchin == '' &&
    //     maindata.punchout == '' &&
    //     (maindata.punchInTime != '' || maindata.punchOutTime != '')
    //   ) {
    //     this.finaldata.push(maindata);
    //   }
    // } else {
    //   if (maindata.punchin != '' || maindata.punchout != '') {
    //     this.finaldata.push(maindata);
    //   }
    //   // if (maindata.punchin == '' && maindata.punchout == '') {
    //   //   this.finaldata.push(maindata)

    //   // }
    //   if (maindata.attendanceType == '0') {
    //     this.finaldata.push(maindata);
    //   }
    // }

    // for (var i = 0; i < this.finaldata.length; i++) {
    //   this.finaldata[i].createBy = localStorage.getItem('id');
    //   this.finaldata[i].updateBy = localStorage.getItem('id');
    //   this.finaldata[i].createByIp = this.ipAddress;
    // }
  }

  extractDateTime(dateTimeStr) {
    return {
      date: dateTimeStr.slice(0, 10),
      time: dateTimeStr.slice(11, 19),
    };
  }

  combineDateTime({ date, time }) {
    return `${date} ${time}`;
  }

  onSubmit1() {
    let userName = [];
    if (this.body.attendancetype == '2') {
      for (let i = 0; i < this.finaldata.length; i++) {
        let data = this.finaldata[i];

        if (data.punchin && data.punchout) {
          let final_in = this.combineDateTime(this.extractDateTime(data.punchin));
          let final_out = this.combineDateTime(this.extractDateTime(data.punchout));

          if (new Date(final_in) > new Date(final_out)) {
            userName.push(data.Name);
          }
        } else if (!data.punchin && data.punchout) {
          userName.push(data.Name);

        } else if (data.punchin && !data.punchout && data.punchOutTime) {
          let final_in = this.combineDateTime(this.extractDateTime(data.punchin));

          if (new Date(final_in) > new Date(data.punchOutTime)) {
            userName.push(data.Name);
          }
        }
      }

      if (userName.length > 0) {
        return this.notifications.create(
          'Error',
          'user' + ' ' + userName.join(', ') + ' ' + 'punchout must be greater than punchin',
          NotificationType.Error,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      }
    }

    if (this.body.attendancetype == '1') {
      for (let i = 0; i < this.finaldata.length; i++) {

        if (!this.finaldata[i].Shift && this.finaldata[i].attendanceType != '0') userName.push(this.finaldata[i].Name);

      }

      const userList = userName.join(', ');
      const message = `Shift is required for the following employees: ${userList}. Please assign shifts to proceed.`;

      if (userName.length > 0) {
        return this.notifications.create(
          'Error',
          message,
          NotificationType.Error,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      }
    }

    const body = {
      attendanceType: this.body.attendancetype,
      finaldataarray: this.finaldata,
      companyMasterID: this.datefilter.value.company,
    };


    this.spinner.start('submit');
    this.api
      .callApi(this.constant.ADDMANUALATTENDANCE_V2, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });

          this.datefilter.resetForm();
          this.ngOnInit();
          this.spinner.stop('submit');
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  clear() {
    window.location.reload();
  }
}
