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
    selector: 'app-add-tds-slab',
    templateUrl: './add-tds-slab.component.html',
    styleUrls: ['./add-tds-slab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTdsSlabComponent implements OnInit {
  selectVal: any = 'true';
  show: boolean = false;
  topics = ['Mehta', 'Google', 'Urban', 'Tesla', 'Facebook', 'Jio', 'Tata'];
  @ViewChild('addform') addform: NgForm;
  empList: any;
  selecteddata: any = [];
  form16list: any;
  selectedform16: any = [];

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
    page: 1,
    limit: 10,
    id: 4,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ngOnInit(): void {
    this.getIPAddress();
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
      YearMonth: this.addform.value.YearMonth.replace('-', ''),
      FromAmount: this.addform.value.FromAmount,
      ToAmount: this.addform.value.ToAmount,
      TdsRate: this.addform.value.TdsRate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    console.warn(body);

    this.spinner.start();
    this.api.callApi(this.constant.ADDTDSSLAB, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {

          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/form16s/tds_slab']);

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
