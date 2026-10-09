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
    selector: 'app-add-employee-investment',
    templateUrl: './add-employee-investment.component.html',
    styleUrls: ['./add-employee-investment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddEmployeeInvestmentComponent implements OnInit {
  selectVal: any = 'true';
  show: boolean = false;
  topics = ['Mehta', 'Google', 'Urban', 'Tesla', 'Facebook', 'Jio', 'Tata'];
  @ViewChild('addform') addform: NgForm;
  empList: any;
  selecteddata: any = [];
  form16list: any;
  selectedform16: any = [];
  adminRoot = environment.adminRoot;

  demo: any = '2022-05';
  demo1: any = this.demo.replace('-', '');

  operationdata: any = [];
  ipAddress: any;
  parentformdata: any = [];
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
  filterDataForm16 = {
    limit: '',
    page: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ngOnInit(): void {
    this.getIPAddress();
    this.allparentform();
    this.getallemployee();
    this.getallform16();
  }

  getallform16() {
    this.api
      .callApi(this.constant.GETFORM16, this.filterDataForm16, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.form16list = res.data;

          this.form16list.map((el) => {
            el.name = el.SalaryDetails;
          });
        }
      });
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

  allparentform() {
    const filterData1 = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETPARENTFORM16, filterData1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {

          this.parentformdata = res.data;
          this.spinner.stop();
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
      Form16ChildID: this.addform.value.form16,
      InvestmentName: this.addform.value.InvestmentName,
      InvestmentAmount: this.addform.value.InvestmentAmount,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      YearMonth: this.addform.value.YearMonth.replace('-', ''),
    };

    console.warn(this.demo, this.demo1);

    this.spinner.start();
    this.api.callApi(this.constant.ADDEMPLOYEEINVESTMENT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {

          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/form16s/employee_investment']);
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
