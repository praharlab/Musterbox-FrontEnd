import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-tour',
    templateUrl: './add-tour.component.html',
    styleUrls: ['./add-tour.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTourComponent implements OnInit {
  @ViewChild('addtour') addtour: NgForm;
  adminRoot = environment.adminRoot;
  ipAddress: any;
  buttonDisabled = false;
  buttonState = '';
  empList: any;
  selected: any = [];
  company: any;
  company_id: any;
  days: any[];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getIPAddress();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop();
        }
      });
  }
  calcdays() {
    if (this.addtour.value.FromDate != '' && this.addtour.value.ToDate != '') {
      this.days = [];
      let startDate = this.addtour.value.FromDate;
      let date1 = new Date(this.addtour.value.ToDate);
      let date2 = new Date(startDate);
      let timeInMilisec = date1.getTime() - date2.getTime();
      let daysBetweenDates = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
      this.days.push(Number(daysBetweenDates));
    }
  }

  onSubmit() {
    if (!this.addtour.valid) {
      return;
    }
    let body = {
      ToursName: this.addtour.value.ToursName,
      FromDate: this.addtour.value.FromDate,
      ToDate: this.addtour.value.ToDate,
      TotalDays: this.addtour.value.TotalDays,
      CoPersonId: this.addtour.value.coPersonID,
      Description: this.addtour.value.Description,
      userMasterID: this.addtour.value.userMasterID,
    };

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATETOUR, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/visits/tour']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  getallemployee() {
    if (!this.company_id) return;
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.empList = res.data;
          this.empList.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
          this.spinner.stop();
        }
      });
  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
  companydata(event) {
    this.company_id = event;
    this.getallemployee();
  }
}
