import { Component, ViewChild, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-viwe-employee-holiday-policy',
    templateUrl: './viwe-employee-holiday-policy.component.html',
    styleUrls: ['./viwe-employee-holiday-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViweEmployeeHolidayPolicyComponent implements OnInit {
  holidayPolicyID: any;

  @Input()
  set getHolidayPolicyID(getHolidayPolicyID: any) {
    this.holidayPolicyID = getHolidayPolicyID;
  }

  @ViewChild('addcomp') addcomp: NgForm;
 
  format: any;
  url: any;
 
  product: any = [];

  company_id: any;
  values = [];
  companydata: any;
  editbyid: any;
  adminRoot = environment.adminRoot;

  constructor(
    public datepipe: DatePipe,
    public activatedRoute: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.holidayPolicyID) {
      this.getproduct();
      this.values.push({ name: '', date: '' });
      this.editdata(this.holidayPolicyID);
    }
  }
  

  getproduct() {
 
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

  editdata(holidayPolicyID: any) {
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWHOLIDAYPOLICY + holidayPolicyID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editbyid = res.data;
          var respo: any = [];
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
          console.log('error', err);
        },
      );
  }


}
