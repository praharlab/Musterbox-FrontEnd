import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-overtime-master',
    templateUrl: './overtime-master.component.html',
    styleUrls: ['./overtime-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OvertimeMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  OvertimeArray: any = [];
  OvertimeReportArray: any = [];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.spinner.start('oninit');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.formdata = res.master;
          this.visible = true;
          this.spinner.stop('oninit');
        }
      });

    this.OvertimeArray = [
      {
        icon: 'iconsminds-over-time-2',
        label: 'My Overtime',
        menu: 'MyOvertime',
        to: `${this.adminRoot}/overtimes/overtime`,
      },
      {
        icon: 'iconsminds-over-time-2',
        label: 'Overtime Request',
        menu: 'OvertimeRequest',
        to: `${this.adminRoot}/overtimes/overtime_request/2`,
      },
    ];

    this.OvertimeReportArray = [
      {
        icon: 'iconsminds-over-time-2',
        label: 'Overtime Calculation',
        menu: 'OvertimeCalculation',
        to: `${this.adminRoot}/overtimes/overtime_calculation`,
      },
      {
        icon: 'iconsminds-over-time-2',
        label: 'Overtime Report',
        menu: 'OvertimeReport',
        to: `${this.adminRoot}/overtimes/overtime-report`,
      },
      {
        icon: 'iconsminds-over-time-2',
        label: 'Userwise Overtime',
        menu: 'OvertimeReport',
        to: `${this.adminRoot}/overtimes/overtime_report_userwise`,
      },
      {
        icon: 'iconsminds-over-time-2',
        label: 'Consolidate Overtime Report',
        menu: 'ConsolidateOverTimeReport',
        to: `${this.adminRoot}/overtimes/consolidate_overtime_report`,
      },
      {
        icon: 'iconsminds-over-time-2',
        label: 'Daily Overtime Report',
        menu: 'DailyOvertimeReport',
        to: `${this.adminRoot}/overtimes/daily_ot_report`,
      },
    ];
  }
}
