import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-add-quater-tax-challan',
    templateUrl: './add-quater-tax-challan.component.html',
    styleUrls: ['./add-quater-tax-challan.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddQuaterTaxChallanComponent implements OnInit {
  selectVal: any = 'true';
  show: boolean = false;
  topics = ['Mehta', 'Google', 'Urban', 'Tesla', 'Facebook', 'Jio', 'Tata'];
  @ViewChild('addform') addform: NgForm;
  empList: any;
  selecteddata: any = [];
  form16list: any;
  selectedform16: any = [];
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
  operationdata: any = [];
  ipAddress: any;
  parentformdata: any = [];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
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
    this.getIPAddress();
    this.getallemployee();
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
    if (!this.addform.valid) {
      return;
    }

    let body;
    body = {
      userMasterID: this.addform.value.userid,
      AssessmentYear: this.addform.value.assessmentyear,
      Quarters: this.addform.value.Quarters,
      TDSReceipt: this.addform.value.TDSReceipt,
      EmpAmtCredited: this.addform.value.EmpAmtCredited,
      EmpAmtTaxDeducted: this.addform.value.EmpAmtTaxDeducted,
      EmpTaxDeposited: this.addform.value.EmpTaxDeposited,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    console.warn(body);

    this.spinner.start();
    this.api.callApi(this.constant.ADDQUATERTAXCHALLAN, body, 'POST', true, true, true).subscribe(
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
