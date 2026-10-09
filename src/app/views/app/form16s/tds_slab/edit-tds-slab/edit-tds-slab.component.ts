import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-tds-slab',
    templateUrl: './edit-tds-slab.component.html',
    styleUrls: ['./edit-tds-slab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTdsSlabComponent implements OnInit {
  @ViewChild('editform') editform: NgForm;
  formdata: any = [];
  selected: any = [];
  selecteddata: any = [];
  ipAddress: any;
  parentformdata: any;
  editformdata: any;
  pathVal: string = 'app/';
  empList: any;
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
    companyMasterID: 4,
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
    this.api.callApi(this.constant.GETBYIDTDSSLAB + formid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.editformdata = res.data;
          //this.editformdata.YearMonth = this.editformdata.YearMonth.toString();
          this.editformdata.YearMonth =
            JSON.stringify(this.editformdata.YearMonth).slice(0, 4) +
            '-' +
            JSON.stringify(this.editformdata.YearMonth).slice(4);
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
      TdsSlabMasterID: this.activatedRoute.snapshot.params.id,
      YearMonth: this.editform.value.YearMonth.replace('-', ''),
      FromAmount: this.editform.value.FromAmount,
      ToAmount: this.editform.value.ToAmount,
      TdsRate: this.editform.value.TdsRate,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.spinner.start();
    this.api.callApi(this.constant.UPDATETDSSLAB, body, 'POST', true, true, true).subscribe(
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
