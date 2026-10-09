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
    selector: 'app-add-form16',
    templateUrl: './add-form16.component.html',
    styleUrls: ['./add-form16.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddForm16Component implements OnInit {
  selectVal: any = 'true';
  show: boolean = false;
  topics = ['Mehta', 'Google', 'Urban', 'Tesla', 'Facebook', 'Jio', 'Tata'];
  @ViewChild('addform') addform: NgForm;
  adminRoot = environment.adminRoot;

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

  ngOnInit(): void {
    this.getIPAddress();
    this.allparentform();
  }

  allparentform() {
    const filterData = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETPARENTFORM16, filterData, 'POST', true, false, true)
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
  toggle() {
    this.show = !this.show;
  }
  onSubmit() {

    if (!this.addform.valid) {
      return;
    }
    if (this.addform.value.parentFormMasterID == '') {
      this.addform.value.parentFormMasterID = null;
    }
    let body;
    if (this.addform.value.parentFormMasterID == null) {
      body = {
        //Form16ID:11,
        SalaryDetails: this.addform.value.detailsofSalary,
        Series: this.addform.value.series,
        ParentForm16ID: 0, // this.addform.value.parentFormMasterID,
        status: 1,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        form16child: {},
        //form16child: {"GrossAmount": this.addform.value.grossAmount, "QualifyingAmount": this.addform.value.qualifyingAmount, "StartDate": this.addform.value.startdate, "EndDate": this.addform.value.enddate}
      };
    } else {
      body = {
        //Form16ID:11,
        SalaryDetails: this.addform.value.detailsofSalary,
        Series: this.addform.value.series,
        ParentForm16ID: this.addform.value.parentFormMasterID, // this.addform.value.parentFormMasterID,
        status: 1,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        form16child: {
          GrossAmount: this.addform.value.grossAmount,
          QualifyingAmount: this.addform.value.qualifyingAmount,
          StartDate: this.addform.value.startdate,
          EndDate: this.addform.value.enddate,
        },
        //form16child: {}
      };
    }

    console.warn(body);

    this.spinner.start();
    this.api.callApi(this.constant.ADDFORM16, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {

          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/form16']);
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
