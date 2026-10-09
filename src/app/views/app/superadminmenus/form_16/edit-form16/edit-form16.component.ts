import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-form16',
    templateUrl: './edit-form16.component.html',
    styleUrls: ['./edit-form16.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditForm16Component implements OnInit {
  @ViewChild('editform') editform: NgForm;
  formdata: any = [];
  selected: any = [];
  ipAddress: any;
  parentformdata: any;
  editformdata: any;
  pathVal: string = 'app/';
  show: boolean;
  adminRoot = environment.adminRoot;
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
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.editdata();
    this.getIPAddress();
    this.allparentform();
  }
  editdata() {
    let formid = this.formValue.ListForm16Component.id;
    this.spinner.start();
    this.api.callApi(this.constant.GETFORM16BYID + formid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.editformdata = res.data;
        this.spinner.stop();
        if (this.editformdata.childdata != null) {
          this.show = true;
        } else {
          this.show = false;
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
  onSubmit() {
    if (!this.editform.valid) {
      return;
    }
    if (this.editform.value.parentFormMasterID == '') {
      this.editform.value.parentFormMasterID = null;
    }
    let body;
    if (this.editform.value.parentFormMasterID == null) {
      body = {
        Form16ID: this.formValue.ListForm16Component.id,
        SalaryDetails: this.editform.value.detailsofsalary,
        Series: this.editform.value.series,
        ParentForm16ID: 0, // this.addform.value.parentFormMasterID,
        status: 1,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        form16child: {},
        //form16child: {"GrossAmount": this.addform.value.grossAmount, "QualifyingAmount": this.addform.value.qualifyingAmount, "StartDate": this.addform.value.startdate, "EndDate": this.addform.value.enddate}
      };
    } else {
      body = {
        Form16ID: this.formValue.ListForm16Component.id,
        SalaryDetails: this.editform.value.detailsofsalary,
        Series: this.editform.value.series,
        ParentForm16ID: this.editform.value.parentFormMasterID, // this.addform.value.parentFormMasterID,
        status: 1,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        form16child: {
          GrossAmount: this.editform.value.grossAmount,
          QualifyingAmount: this.editform.value.qualifyingAmount,
          StartDate: this.editform.value.startdate,
          EndDate: this.editform.value.enddate,
        },
        //form16child: {}
      };
    }

    this.spinner.start();
    this.api.callApi(this.constant.UPDATEFORM16, body, 'POST', true, true, true).subscribe(
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
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }
}
