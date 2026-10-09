import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-shift',
    templateUrl: './shift.component.html',
    styleUrls: ['./shift.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ShiftComponent implements OnInit {

  rows7: any;
  reference_ID: any;
  shiftdata: any = [];
  deduction: any;
  allbranch: any;
  alldepartment: any;
  table: any;
  alldesignation: any;
  selectedcompany: any;
  predefined1: any = '0';
  by_Branch: boolean = false;
  company: any;
  allowearlybypenalty: boolean = false;

  allowpanelty: boolean = false;
  allowearlyby: boolean = false;
  showearlyby: any;
  show: any;

  EarlyGovalues: any = [];
  values: any = [];
  selectedEarlyPenalty: any = '0';
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

  constructor(
      private spinner: NgxUiLoaderService,
      private router: Router,
      public activatedRoute: ActivatedRoute,
      private notifications: AppNotificationService,
      private api: ApiService,
      private constant: ConstantService,
      private http: HttpClient,

  
    ) { }

  ngOnInit(): void {
    this.shiftdata1()
  }

  shiftdata1() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEESHIFT + localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows7 = res.data;
          this.spinner.stop();
        }
      });
  }

  getShift(item: any) {

    this.editdata(item);
    this.getcompany();
  }

  editdata(item: any) {
    // let companyid = this.activatedRoute.snapshot.params.id
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
        console.log('error', err);
      },
    );
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

}
