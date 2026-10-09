import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-tour',
    templateUrl: './edit-tour.component.html',
    styleUrls: ['./edit-tour.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTourComponent implements OnInit {
  @ViewChild('edittour') edittour: NgForm;
  adminRoot = environment.adminRoot;
  ipAddress: any;
  buttonDisabled = false;
  buttonState = '';
  empList: any;
  selected: any = [];
  tourdata: any;
  company_id: any;
  company: any;
  assign: any;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getIPAddress();
    // this.getallemployee();
    this.getcompany();
    this.editdata();
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

  editdata() {
    let tourid = this.formValue.ListTourComponent.id;
    this.spinner.start('get');
    this.api.callApi(this.constant.VIEWTOURDATA + tourid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.tourdata = res.data;
        this.tourdata.UserMasterID = +this.tourdata.UserMasterID;
        this.company_id = +this.tourdata.assign.companyMasterId;
        this.getallemployee();
        if (this.tourdata.CoPersonId.length > 0) {
          for (var i = 0; i < this.tourdata.CoPersonId.length; i++) {
            this.selected.push(Number(this.tourdata.CoPersonId[i].UserMasterID));
          }
        }

        this.spinner.stop('get');
      },
      (err) => {
        this.spinner.stop('get');
      },
    );
  }

  onSubmit() {
    if (!this.edittour.valid) {
      return;
    }
    let body = {
      ToursMasterID: this.formValue.ListTourComponent.id,
      ToursName: this.edittour.value.ToursName,
      FromDate: this.edittour.value.FromDate,
      ToDate: this.edittour.value.ToDate,
      TotalDays: this.edittour.value.TotalDays,
      CoPersonId: this.edittour.value.coPersonID,
      Description: this.edittour.value.Description,
      UserMasterID: this.edittour.value.userMasterID,
    };

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.UPDATETOUR, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([
              this.adminRoot + this.formValue?.ListTourComponent?.body?.navigatedFrom,
            ]);
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
    this.spinner.start('employee');
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.empList = res.data;
          this.empList.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
          this.spinner.stop('employee');
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

  getallemployee1() {
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

  companydata(event) {
    this.company_id = event;
    this.getallemployee1();
  }
}
