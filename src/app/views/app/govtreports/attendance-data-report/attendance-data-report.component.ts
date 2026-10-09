import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-attendance-data-report',
    templateUrl: './attendance-data-report.component.html',
    styleUrls: ['./attendance-data-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AttendanceDataReportComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  // @ViewChild('content', { static: false }) content: ElementRef;
  childcompany: any;
  company_id: any;
  cid: any;
  usertype: any;
  company: any;
  allbranch: any;
  alluser: any;
  selected: any[];
  companyData: any;

  body = {
    companyMasterID: '',
    branchMasterID: '',
    userMasterID: [],
    yearmonth: '',
    Export: '',
    formName: 'AttendanceSheet'

  };
  rows = [];
  branch1: any;
  pdf: any;
  sumArray: any = [];
  permissionview: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission()
    this.getcompany();
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceSheetReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }


  print(event: Event) {
    event.preventDefault();
    // Your print logic here
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
          this.company = res.data;

          this.spinner.stop();
        }
      });

  }

  selectcompany(id) {
    if (id == undefined) {
    } else {
      this.spinner.start();

      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {

          this.allbranch = res;

        });

      const body = {
        page: '',
        limit: '',
        companyMasterID: id,
      };
      this.api
        .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
            this.spinner.stop();
          }
        });

      this.api
        .callApi(this.constant.VIEWCOMPANYDATA + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.companyData = res.data;
          }
        });
    }
  }

  selectbranch(id) {

    const filterData = {
      branchMasterID: id,
    };
    if (id != '' && id != null) {
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.alluser.map((el) => {
              el.name = el.displayName;
            });

            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
            this.spinner.stop();
          }
        });

      this.api
        .callApi(this.constant.VIEWBRANCH + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.branch1 = res.data;
          }
        });
    } else {
      this.branch1 = '';

      const body = {
        page: '',
        limit: '',
        companyMasterID: this.datefilter.value.cid,
      };
      this.api
        .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
            this.spinner.stop();
          }
        });
    }
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.body.companyMasterID = this.datefilter.value.cid;
    this.body.branchMasterID = this.datefilter.value.branch;

    if (this.datefilter.value.user != null && this.datefilter.value.user != '') {
      this.body.userMasterID = this.datefilter.value.user;
    } else {
      this.body.userMasterID = this.selected;
    }

    this.body.yearmonth = this.datefilter.value.YearMM.replace('-', '');
    this.body.Export = 'false'
    this.spinner.start();
    this.api
      .callApi(this.constant.PAMUSTERROLLREGISTER, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.sumArray = res.dateWiseSum;

          this.rows.map(e => {
            e.attendance.map(a => {
              const leaveArray = a.value.split(',');
              a.value = leaveArray

            })

          })
          this.spinner.stop();
        }
      });
  }

  export() {

    this.body.Export = 'true'

    this.spinner.start('a');
    this.api
      .callApi(this.constant.PAMUSTERROLLREGISTER, this.body, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (res.type == 'application/json') {
          this.notifications.create('No data found to export!', '', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('a');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `Attendance Data - ${this.body.yearmonth}.xlsx`);

          this.spinner.stop('a');
        }
      },
        (err) => {
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
        },);



  }

  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
    this.rows = [];
    this.sumArray = [];
  }

}
