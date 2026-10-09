import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-holiday-policy',
    templateUrl: './edit-holiday-policy.component.html',
    styleUrls: ['./edit-holiday-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditHolidayPolicyComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  product: any = [];
  usertype: any;
  company_id: any;
  values = [];
  companydata: any;
  editbyid: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  min: string;
  max: string;


  constructor(
    public datepipe: DatePipe,
    public activatedRoute: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getproduct();
    this.values.push({ name: '', date: '', optionalHoliday: "0" });
    this.getIPAddress();
    this.editdata();
  }
  add() {
    this.values = [];
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }

  addvalue() {
    if (this.addcomp.value.holidayYear) {
      this.values.push({ name: '', date: '', optionalHoliday: "0" });
      return;
    }


    this.notifications.create('Error', "Please select Holiday Year", NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  changeYear(event: any) {
    this.values = [];


    this.min = event.toString() + "-01-01";
    this.max = event.toString() + "-12-31";

  }

  getproduct() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.product = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: localStorage.getItem('company_id'),
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.product = res.data;

            this.spinner.stop();
          }
        });
    }
  }
  editdata() {
    let companyid = this.formValue.ListHolidayPolicyComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWHOLIDAYPOLICY + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editbyid = res.data;
          var respo: any = [];

          this.min = this.editbyid.holidayYear.toString() + "-01-01";
          this.max = this.editbyid.holidayYear.toString() + "-12-31";

          for (
            var i = 0, j = 0;
            i < this.editbyid.holidayList[0].holidayListName.length,
            j < this.editbyid.holidayList[0].holidayDate.length;
            i++, j++
          ) {
            this.editbyid.holidayList[0].holidayDate[j] = this.datepipe.transform(
              this.editbyid.holidayList[0].holidayDate[j],
              'yyyy-MM-dd',
            );
            respo.push({
              name: this.editbyid.holidayList[0].holidayListName[i],
              date: this.editbyid.holidayList[0].holidayDate[j],
              optionalHoliday: this.editbyid.holidayList[0].optionalHoliday && this.editbyid.holidayList[0].optionalHoliday.length != 0 ? this.editbyid.holidayList[0].optionalHoliday[j] ? "1" : "0" : "0"
            });
          }

          this.values = respo;
          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();

        },
      );
  }
  onSubmit() {

    if (!this.addcomp.valid) {
      return;
    }
    if (this.values && this.values.length == 0) {
      this.notifications.create('Error', "Please add atleast 1 Holiday!", NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }


    const name = [];
    const date = [];
    const optionalHoliday = [];

    for (var i = 0; i < this.values.length; i++) {
      if (new Date(this.values[i].date) < new Date(this.min) || new Date(this.values[i].date) > new Date(this.max)) {
        this.notifications.create('Error', "Please select date within the Year!", NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        return;
      }

      name.push(this.values[i].name);
      date.push(this.values[i].date);
      optionalHoliday.push(+this.values[i].optionalHoliday)

    }
    let body = {
      holidayPolicyID: this.editbyid.holidayPolicyID,
      holidayPolicyName: this.addcomp.value.holidayPolicyName,
      holidayYear: this.addcomp.value.holidayYear,
      companyMasterID: this.addcomp.value.companyMasterID,
      holidayListName: name,
      holidayDate: date,
      optionalHoliday: optionalHoliday,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEHOLIDAYPOLICY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop();
            this.router.navigate([this.adminRoot + '/masters/holidayPolicy']).then(() => {
              this.spinner.stop();
            });
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
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
