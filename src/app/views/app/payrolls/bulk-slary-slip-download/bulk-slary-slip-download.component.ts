import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

import { NgxUiLoaderService } from 'ngx-ui-loader';

import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';


@Component({
    selector: 'app-bulk-slary-slip-download',
    templateUrl: './bulk-slary-slip-download.component.html',
    styleUrls: ['./bulk-slary-slip-download.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BulkSlarySlipDownloadComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  permissionview: any = []
  company_id: number;
  company: any;
  scrollBarHorizontal: boolean;
  allbranch: any;
  allsalarySlip: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.company_id = +localStorage.getItem('company_id');
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
          this.company = res.data
          this.spinner.stop();
        }
      });

  }


  selectcompany(id) {
    if (!id) {
      this.datefilter.resetForm();
      return
    }
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
      });


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
              permissionval.formName == 'DownloadSalarySlipInBulk' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop('permission');
        }
      });
  }
  onSubmit() {
    if (!this.datefilter.valid) return

    let string = `?companyMasterID=${this.datefilter.value.cid}`

    if (this.datefilter.value.branch) string += `&branchMasterID=${this.datefilter.value.branch}`
    if (this.datefilter.value.YearMM) string += `&yearMonth=${this.datefilter.value.YearMM.replace('-', '')}`


    this.spinner.start('id');
    this.api
      .callApi(this.constant.GETALLSALARYSLIP + string, {}, 'GET', true, false, true, true)
      .subscribe((res: any) => {
        if (res.type == 'application/json') {
          this.notifications.create('No data found to export!', '', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('id');
        } else {
          var blob = new Blob([res], { type: 'text/zip' });
          saveAs(blob, `Salary Slip - ${this.datefilter.value.YearMM.replace('-', '')}.zip`);

          this.spinner.stop('id');
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
          this.spinner.stop('id');
        },);

  }
  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
  }

}
