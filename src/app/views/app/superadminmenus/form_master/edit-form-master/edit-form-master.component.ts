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
    selector: 'app-edit-form-master',
    templateUrl: './edit-form-master.component.html',
    styleUrls: ['./edit-form-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditFormMasterComponent implements OnInit {
  @ViewChild('editform') editform: NgForm;
  formdata: any = [];
  selected: any = [];
  ipAddress: any;
  parentformdata: any;
  editformdata: any;
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
    this.alloperation();
    this.getIPAddress();
    this.allparentform();
  }
  editdata() {
    let formid = this.formValue.ListFormMasterComponent.id;
    this.spinner.start('edit');
    this.api.callApi(this.constant.VIEWFORM + formid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.editformdata = res.data;
        for (var i = 0; i < this.editformdata.operation.length; i++) {
          this.selected.push(Number(this.editformdata.operation[i]));
        }
        this.spinner.stop('edit');
      },
      (err) => {
        this.spinner.stop('edit');
        this.handleError(err.error.message);
      },
    );
  }
  allparentform() {
    this.spinner.start();
    this.api.callApi(this.constant.GETPARENTFORM, '', 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.parentformdata = res.data;
          this.spinner.stop();
        } else {
          this.spinner.stop();
          this.handleError(res.message);
        }
      },
      (err) => {
        this.spinner.stop();
        this.handleError(err.error.message);
      },
    );
  }
  alloperation() {
    const filterData = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api.callApi(this.constant.GETOPERATION, filterData, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.formdata = res.data;
          this.spinner.stop();
        } else {
          this.spinner.stop();
          this.handleError(res.message);
        }
      },
      (err) => {
        this.spinner.stop();
        this.handleError(err.error.message);
      },
    );
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
    let body = {
      formMasterID: this.editformdata.formMasterID,
      formName: this.editform.value.formName,
      description: this.editform.value.description,
      parentFormMasterID: this.editform.value.parentFormMasterID,
      operation: this.editform.value.operation,
      defaultRight: this.editform.value.defaultRight,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      icon: this.editform.value.icon,
      path: this.editform.value.path,
      menuName: this.editform.value.menuName,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEFORM, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/form']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
