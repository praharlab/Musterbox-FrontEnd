import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import * as exp from 'constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

export interface IPaySlip {
  id: string
  userMasterID: string
  yearMonth: number
  payrollFrequency: string
  startDate: string | null
  endDate: string | null
  path: string
  createBy: number
  updateBy: number | null
  createByIp: string | null
  updateByIp: string | null
  createdAt: string
  updatedAt: string
}

export interface IPage {
  totalCount: number,
  offset: number
}


@Component({
    selector: 'app-my-pay-slip',
    templateUrl: './my-pay-slip.component.html',
    styleUrls: ['./my-pay-slip.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyPaySlipComponent implements OnInit {

  rows: IPaySlip[] = []
  page: IPage = {
    totalCount: 0,
    offset: 0,
  };
  limit: number = 10;
  salarySlipPath: string = ''
  apiUrl = environment.apiUrl
  permissionview: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getMyPaySlip()
    this.checkpermission();
  }



  getMyPaySlip() {
    this.spinner.start('main1');
    this.api
      .callApi(this.constant.GETMYPAYSLIP, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.spinner.stop('main1');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('main1');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('main1');
        },
      );
  }


  showSalarySlip(data: IPaySlip) {
    // this.salarySlipPath = `https://apiMusterBox.MusterBox.co.in/${data.path}`
    this.salarySlipPath = this.apiUrl + data.path
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
              permissionval.formName == 'MypaySlipPIH' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop('permission');
        }
      });
  }

  download() {
    const fileUrl = this.salarySlipPath;
    const fileName = 'Pay Slip';

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  }
}
