import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';


@Component({
    selector: 'app-lwf-report',
    templateUrl: './lwf-report.component.html',
    styleUrls: ['./lwf-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LwfReportComponent implements OnInit {
  finaldata: boolean = false;
  @ViewChild('datefilter') datefilter: NgForm;
  permissioncreate: any;
  apiURL = environment.apiUrl;
  permissionedit: any;
  permissionview: any = [];

  permissiondelete: any;
  company_id: any;
  company1: any;
  companyData: any;
  branch: any;
  currentTime: any;
  company: any;
  companydata: any;
  Branch: any;
  employee: any;
  allbranch: any;
  employeedata: any;
  branchPTnumberIDs: any;
  totalemployeedataUserside: any;
  Address: any;
  totalemployeedataCompanyside: any;
  totalNoOfEmployeeUserside: any;
  totalNoOfEmployeeCompanyside: any;
  branchAddress: any;
  companyAddress: any;
  isBranch: boolean = false;
  total: any;
  lastDate: any;
  selectedcompany: any;
  lwfData: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,

  ) { }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
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
              permissionval.formName == 'LWFReport' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectfromyearmonth($event) {
    this.finaldata = false;
  }

  clear() {
    this.datefilter.resetForm();
    this.finaldata = false;
    this.allbranch = [];
  }

  selectcompany(id) {
    this.finaldata = false;

    if (!id) {
      return;
    }
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop();
      });
  }

  selectbranch(id) {
    this.finaldata = false;

    if (!id) {
      return;
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    let startyear = this.datefilter.value.fromyearmonth.slice(0, 4);
    let startmonth = this.datefilter.value.fromyearmonth.slice(5, 7);
    let startyearmonth = startyear.concat(startmonth);

    let lastDate1 = new Date(startyear, startmonth, 0);

    let startyear1 = lastDate1.getFullYear();
    let startmonth1 = lastDate1.getMonth() + 1;
    let startday1 = lastDate1.getDate();

    this.lastDate = `${startday1}-${startmonth1}-${startyear1}`;

    const body = {
      companyMasterID: this.datefilter.value.company,
      yearmonth: Number(startyearmonth),
      branchMasterID: this.datefilter.value.branch,
    };

    if (this.datefilter.value.branch != '') {
      this.isBranch = true;
    } else {
      this.isBranch = false;
    }

    this.spinner.start();
    this.api
      .callApi(this.constant.LWFREPORT, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.lwfData = 'data:application/pdf;base64,' + res.data;
        this.finaldata = true;
      }, (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
      });
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}${this.datefilter.value.fromyearmonth}.pdf`;
    link.click();
  }
  onClickDownloadPdf() {
    let base64String = this.lwfData;
    this.downloadPdf(base64String, 'LWF-REPORT-');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }


}
