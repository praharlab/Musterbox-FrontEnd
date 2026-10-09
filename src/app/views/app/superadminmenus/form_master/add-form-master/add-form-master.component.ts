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
    selector: 'app-add-form-master',
    templateUrl: './add-form-master.component.html',
    styleUrls: ['./add-form-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddFormMasterComponent implements OnInit {
  @ViewChild('addform') addform: NgForm;
  operationdata: any = [];
  ipAddress: any;
  parentformdata: any;
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

  ngOnInit(): void {
    this.alloperation();
    this.getIPAddress();
    this.allparentform();
  }
  allparentform() {
    this.api.callApi(this.constant.GETPARENTFORM, '', 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.parentformdata = res.data;
          this.spinner.stop();
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
  alloperation() {
    const filterData = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api.callApi(this.constant.GETOPERATION, filterData, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.operationdata = res.data;
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
    if (!this.addform.valid) {
      return;
    }
    if (this.addform.value.parentFormMasterID == '') {
      this.addform.value.parentFormMasterID = null;
    }
    let body = {
      formName: this.addform.value.formName,
      description: this.addform.value.description,
      parentFormMasterID: this.addform.value.parentFormMasterID,
      operation: this.addform.value.operation,
      defaultRight: this.addform.value.defaultRight,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      icon: this.addform.value.icon,
      path: this.addform.value.path,
      menuName: this.addform.value.menuName,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEFORM, body, 'POST', true, true, true).subscribe(
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
