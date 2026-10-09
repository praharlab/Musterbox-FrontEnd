import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-gov-report-master',
    templateUrl: './gov-report-master.component.html',
    styleUrls: ['./gov-report-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GovReportMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  GovReportArray: any = [];
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

    this.GovReportArray = [
      {
        icon: 'iconsminds-notepad',
        label: 'Adult Worker Register',
        menu: 'AdultWorkerRegistery',
        to: `${this.adminRoot}/govtreports/adultworkersregister`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Form D Attedance Register',
        menu: 'Form-D-Attedance-Register',
        to: `${this.adminRoot}/govtreports/inout-attendance-register`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Form-XVI Muster Roll',
        menu: 'Form-XVI',
        to: `${this.adminRoot}/govtreports/pa-muster-roll`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Attendance Sheet Report',
        menu: 'AttendanceSheetReport',
        to: `${this.adminRoot}/govtreports/attendanceData_report`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Form 1',
        menu: 'Form-1',
        to: `${this.adminRoot}/govtreports/form1`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form 5',
        menu: 'Form-5',
        to: `${this.adminRoot}/govtreports/form5`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form 11',
        menu: 'Form-11',
        to: `${this.adminRoot}/govtreports/form11`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form 14',
        menu: 'Form-14',
        to: `${this.adminRoot}/govtreports/form14`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form 18',
        menu: 'Form-18',
        to: `${this.adminRoot}/govtreports/form18`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form 21',
        menu: 'Form-21',
        to: `${this.adminRoot}/govtreports/form21`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form 28',
        menu: 'Form-28',
        to: `${this.adminRoot}/govtreports/form28`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form 29',
        menu: 'Form-29',
        to: `${this.adminRoot}/govtreports/form29`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form 4',
        menu: 'Form-4',
        to: `${this.adminRoot}/govtreports/form4`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form 7',
        menu: 'Form-7',
        to: `${this.adminRoot}/govtreports/form7`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form A',
        menu: 'Form-A',
        to: `${this.adminRoot}/govtreports/formA`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form B',
        menu: 'Form-B',
        to: `${this.adminRoot}/govtreports/formB`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form C',
        menu: 'Form-C',
        to: `${this.adminRoot}/govtreports/formC`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form ER-01',
        menu: 'Form-ER-01',
        to: `${this.adminRoot}/govtreports/form-er01`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'LWF Report',
        menu: 'LWFReport',
        to: `${this.adminRoot}/govtreports/lwf_report`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Id Card Register',
        menu: 'IdCardRegistery',
        to: `${this.adminRoot}/govtreports/identitycardregister`,
      },
    ];
  }
}
