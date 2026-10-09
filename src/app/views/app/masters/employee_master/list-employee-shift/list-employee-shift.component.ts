import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-shift',
    templateUrl: './list-employee-shift.component.html',
    styleUrls: ['./list-employee-shift.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeShiftComponent implements OnInit {
  @Output() shiftVerify = new EventEmitter<object>();

  @ViewChild('addshift') addshift: NgForm;
  @ViewChild('editshift') editshift: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  mediumDateFormat = environment.mediumDateFormat;
  rows: any = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  file: any;
  format: any;
  url: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  editbyid: any;
  company_id: any;
  allshift: any = [];
  shift: any;
  current_date = new Date().toISOString().slice(0, 10);
  usertype: any;
  applidate = new Date().toISOString().split('T')[0];
  AllShifts: any = '';

  shiftdata: any = [];
  company: any;
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  starttime: any;
  totalhours: any;
  totalhourshalfday: any;
  endtime: any;
  secondhalfstarttime: any;
  firsthalfstarttime: any;
  deduction: any;
  Mondaystarttime: any;
  Mondayfirsthalfend: any;
  Mondaysecondhalfstart: any;
  Mondayendtime: any;
  Mondaytotalhours: any;
  Mondaytotalhourshalfday: any;

  Tuesdaystarttime: any;
  Tuesdayfirsthalfend: any;
  Tuesdaysecondhalfstart: any;
  Tuesdayendtime: any;
  Tuesdaytotalhours: any;
  Tuesdaytotalhourshalfday: any;

  Wednesdaystarttime: any;
  Wednesdayfirsthalfend: any;
  Wednesdaysecondhalfstart: any;
  Wednesdayendtime: any;
  Wednesdaytotalhours: any;
  Wednesdaytotalhourshalfday: any;

  Thursdaystarttime: any;
  Thursdayfirsthalfend: any;
  Thursdaysecondhalfstart: any;
  Thursdayendtime: any;
  Thursdaytotalhours: any;
  Thursdaytotalhourshalfday: any;

  Fridaystarttime: any;
  Fridayfirsthalfend: any;
  Fridaysecondhalfstart: any;
  Fridayendtime: any;
  Fridaytotalhours: any;
  Fridaytotalhourshalfday: any;

  Saturdaystarttime: any;
  Saturdayfirsthalfend: any;
  Saturdaysecondhalfstart: any;
  Saturdayendtime: any;
  Saturdaytotalhours: any;
  Saturdaytotalhourshalfday: any;

  Sundaystarttime: any;
  Sundayfirsthalfend: any;
  Sundaysecondhalfstart: any;
  Sundayendtime: any;
  Sundaytotalhours: any;
  Sundaytotalhourshalfday: any;

  sandwichleave: any;
  selectedcompany: any;
  table: any;
  alldepartment: any;
  alldesignation: any;
  allbranch: any;
  referncedata: any;
  allowpanelty: boolean = false;
  allowearlyby: boolean = false;
  showearlyby: any;
  show: any;
  by_Branch: boolean = false;
  predefined1: any = '0';
  selectedEarlyPenalty: any = '0';
  reference_ID: any;
  values: any = [];

  EarlyGovalues: any = [];
  allowearlybypenalty: boolean = false;
  selectedEarlyGoPenalty: any = 'slotminute';
  EarlyGodeduction: any;

  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.alldata();
    this.getIPAddress();
    this.getShiftData();
    this.usertype = localStorage.getItem('usertype');
  }
  getShiftData() {
    let userid = this.formValue.ListEmployeeMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop();
          this.shift = res.data;
          let filterData = {
            page: '',
            limit: '',
            companyMasterID: this.shift.companyMasterId,
          };

          this.api
            .callApi(this.constant.GETSHIFTDATA, filterData, 'POST', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.allshift = res.data;


                this.spinner.stop();
              }
            });
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
  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEESHIFT + this.formValue.ListEmployeeMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          let display = true;

          for (let item of this.rows) {
            if (item.endDate === null && item.shiftstatus === 'active') {
              display = false;
              break;
            }
          }

          this.shiftVerify.emit({
            tabname: 'SHIFT',
            display: display,
          });


          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
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

    if (!this.addshift.valid) {
      return;
    }


    let body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      shiftID: null,
      shiftsID: this.addshift.value.shiftID,
      startDate: this.addshift.value.startDate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEEMPLOYEESHIFTV2, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();
          this.ngOnInit();
          this.addshift.reset();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop();
          }, 3000);
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
  edit(item) {

    this.editbyid = item;
  }
  onSubmit1() {

    if (!this.editshift.valid) {
      return;
    }
    let body = {
      employeeShiftID: this.editbyid.employeeShiftID,
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      shiftID: this.editshift.value.shiftID,
      startDate: this.editshift.value.startDate,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEEMPLOYEESHIFT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal1.nativeElement.click();
          this.ngOnInit();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop();
          }, 3000);
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

  alertConfirmation(id: any) {
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
          employeeShiftID: id,
          userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEMPLOYEESHIFT, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {

              this.ngOnInit();
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
    });
  }

  setShift(item: any) {
    this.AllShifts = item;
  }
  getShift(item: any) {

    this.editdata(item);
    this.getcompany();
  }

  editdata(item: any) {
    // let companyid = this.formValue.ListEmployeeMasterComponent.id
    this.spinner.start();
    this.api.callApi(this.constant.VIEWSHIFT + item, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.shiftdata = res.data;


        for (var i = 0; i < this.shiftdata.shiftTime.length; i++) {
          if (this.shiftdata.shiftTime[i].day == 'Monday') {
            this.Mondaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Mondayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Mondaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Mondayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Mondaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Mondaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Tuesday') {
            this.Tuesdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Tuesdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Tuesdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Tuesdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Tuesdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Tuesdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Wednesday') {
            this.Wednesdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Wednesdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Wednesdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Wednesdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Wednesdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Wednesdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Thursday') {
            this.Thursdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Thursdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Thursdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Thursdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Thursdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Thursdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Friday') {
            this.Fridaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Fridayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Fridaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Fridayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Fridaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Fridaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Saturday') {
            this.Saturdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Saturdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Saturdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Saturdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Saturdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Saturdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Sunday') {
            this.Sundaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Sundayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Sundaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Sundayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Sundaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Sundaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          }
        }

        if (
          !this.shiftdata.allowDays &&
          !this.shiftdata.paneltyMin &&
          !this.shiftdata.lateComing &&
          !this.shiftdata.paneltyDeduction &&
          !this.shiftdata.paneltyDays &&
          !this.shiftdata.paneltyMin &&
          !this.shiftdata.deductionOn
        ) {
          this.allowpanelty = false;
          this.show = '0';
        } else {
          this.allowpanelty = true;
          this.show = '1';
        }
        if (
          (!this.shiftdata.goEarly || this.shiftdata.goEarly == 0) &&
          !this.shiftdata.goEarlyallowdays
        ) {
          this.allowearlyby = false;
          this.showearlyby = '0';
        } else {
          this.allowearlyby = true;
          this.showearlyby = '1';
        }

        if (this.shiftdata.referenceId == 0) {
          this.shiftdata.referenceId = null;
        }
        if (this.shiftdata.branchID == 0) {
          this.shiftdata.branchID = null;
        }

        if (
          this.shiftdata.paneltyDeduction == 'slotminute' ||
          this.shiftdata.paneltyDeduction == 'slotamount'
        ) {
          for (var i = 0; i < this.shiftdata.slot.length; i++) {
            this.values.push({ slot: this.shiftdata.slot[i], value: this.shiftdata.value[i] });
          }
        }

        if (
          this.shiftdata.goEarlyPaneltyDeduction == 'slotminute' ||
          this.shiftdata.goEarlyPaneltyDeduction == 'slotamount'
        ) {
          for (var i = 0; i < this.shiftdata.goEarlyslot.length; i++) {
            this.EarlyGovalues.push({
              slot: this.shiftdata.goEarlyslot[i],
              value: this.shiftdata.goEarlyvalue[i],
            });
          }
          this.selectedEarlyPenalty = '1';
          this.allowearlybypenalty = true;
        }

        if (this.shiftdata.referenceId) {
          this.shiftdata.branchID = Number(this.shiftdata.branchID);
          this.by_Branch = true;
          this.predefined1 = '1';

          this.selectedcompany = this.shiftdata.companyMasterID;
          this.gettable(this.shiftdata.table);
          this.reference_ID = Number(this.shiftdata.referenceId);

          this.api
            .callApi(
              this.constant.BRANCHBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
              {},
              'GET',
              true,
              false,
              true,
            )
            .subscribe((res: any) => {
              this.allbranch = res;

            });
        } else {
          this.reference_ID = '';
        }
        // this.selectedcompany=this.shiftdata.companyMasterID;
        this.shiftdata.referenceId = Number(this.shiftdata.referenceId);
        //this.gettable(this.shiftdata.table)
        this.deduction = this.shiftdata.paneltyDeduction;
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

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop();
        }
      });
  }

  gettable(event) {
    this.table = event;

    this.reference_ID = '';

    if (this.table == 'departments') {
      this.alldesignation = [];
      this.api
        .callApi(
          this.constant.DEPARTMENTBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldepartment = res.data;
          }
        });
    } else if (this.table == 'designations') {
      this.alldepartment = [];
      this.api
        .callApi(
          this.constant.DESIGNATIONBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldesignation = res.data;
          }
        });
    } else {
      this.alldesignation = [];
      this.alldepartment = [];
    }
  }
}
