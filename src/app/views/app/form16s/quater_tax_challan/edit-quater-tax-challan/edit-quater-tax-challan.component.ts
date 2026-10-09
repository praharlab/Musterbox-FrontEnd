import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-quater-tax-challan',
    templateUrl: './edit-quater-tax-challan.component.html',
    styleUrls: ['./edit-quater-tax-challan.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditQuaterTaxChallanComponent implements OnInit {
  @ViewChild('editform') editform: NgForm;
  formdata: any = [];
  selected: any = [];
  selecteddata: any = [];
  ipAddress: any;
  parentformdata: any;
  editformdata: any;
  pathVal: string = 'app/';
  empList: any;
  assessmentYear: any = [
    '2015-16',
    '2016-17',
    '2017-18',
    '2018-19',
    '2019-20',
    '2020-21',
    '2021-22',
    '2022-23',
    '2023-24',
    '2024-25',
  ];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    public datepipe: DatePipe,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) {}
  filterData = {
    page: '',
    limit: '',
    companyMasterID: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  ngOnInit(): void {
    this.editdata();
    this.getIPAddress();
    this.getallemployee();
  }
  editdata() {
    let formid = this.activatedRoute.snapshot.params.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETBYIDQUATERTAXCHALLAN + formid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.editformdata = res.data;
            this.selecteddata = Number(this.editformdata.userMasterID);

            this.spinner.stop();
          }
        },
        (err) => {
          console.log('error', err);
        },
      );
  }
  getallemployee() {
    this.api
      .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.empList = res.data;

          this.empList.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
        }
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  onSubmit() {
    if (!this.editform.valid) {
      return;
    }
    let body;

    body = {
      QuarterTaxChallanID: this.activatedRoute.snapshot.params.id,
      userMasterID: this.editform.value.userid,
      AssessmentYear: this.editform.value.assessmentyear,
      Quarters: this.editform.value.Quarters,
      TDSReceipt: this.editform.value.TDSReceipt,
      EmpAmtCredited: this.editform.value.EmpAmtCredited,
      EmpAmtTaxDeducted: this.editform.value.EmpAmtTaxDeducted,
      EmpTaxDeposited: this.editform.value.EmpTaxDeposited,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEQUATERTAXCHALLAN, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/form16s/quater_tax_challan']);

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
}
