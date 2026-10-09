import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields } from 'src/app/constants/CommonFilterFields';
import { CommonFilterComponent } from '../../common-filter/common-filter.component';

@Component({
    selector: 'app-monthly-attendance-report',
    templateUrl: './monthly-attendance-report.component.html',
    styleUrls: ['./monthly-attendance-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MonthlyAttendanceReportComponent implements OnInit {
  @ViewChild('commonFilter') commonFilter!: CommonFilterComponent;
  @ViewChild('datefilter') datefilter: NgForm;
  scrollBarHorizontal: boolean;
  permissionview: any = [];
  company_id: string;
  company: any;

  filterData: any = {
    userMasterID: '',
  };

  startDate: string;
  endDate: string;
  startmonth: any;
  endmonth: any;
  currmonth: any;
  month: any;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.SUBMIT_EXPORT];
  showRequiredFields: any = [CommonRequiredFields.Company]


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

  ngOnInit() {
    this.company_id = localStorage.getItem('company_id');
    this.currmonth = new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2);

    this.checkpermission();
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  checkpermission() {
    this.spinner.start('permission');
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
              permissionval.formName == 'MonthlyAttendanceReport' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop('permission');
        }
      });
  }

  selectdate() {
    if (this.commonFilter.filterForm.value.month) {
      this.month = this.commonFilter.filterForm.value.month.replace('-', '');

      this.startDate =
        this.month.toString().slice(0, 4) + '-' + this.month.toString().slice(4, 6) + '-' + '01';
      this.endDate =
        this.month.toString().slice(0, 4) +
        '-' +
        this.month.toString().slice(4, 6) +
        '-' +
        this.daysInMonth(this.month.slice(4, 6), this.month.slice(0, 4));
    }
  }

  Export(val: any) {

    const body = {
      companyMasterID: val.company,
      userMasterID: val?.user ? val.user : this.filterData.userMasterID,
      month: this.month
    }

    this.spinner.start('a');

    this.api
      .callApi(
        this.constant.MONTHLYATTENDANCEREPORT,
        body,
        'POST',
        true,
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `Monthly Attendance Report - ${this.month}.xlsx`);

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
        },
      );
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
