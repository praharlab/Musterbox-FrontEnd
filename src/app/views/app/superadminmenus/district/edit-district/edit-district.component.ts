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
    selector: 'app-edit-district',
    templateUrl: './edit-district.component.html',
    styleUrls: ['./edit-district.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditDistrictComponent implements OnInit {

  @ViewChild('adddesignation') adddesignation: NgForm;
  ipAddress: any;
  company: any = [];
  jobRoleData: any;
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  formValue: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.editdata();
  }
  editdata() {
    let queryString = `?districtID=${this.formValue.ListDistrictComponent.id}`;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETDISTRICTBYID + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.jobRoleData = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }

  onSubmit() {
    if (!this.adddesignation.valid) {
      return;
    }
    let body;
    body = {
      stateMasterID: this.jobRoleData.stateMasterID,
      districtName: this.adddesignation.value.districtName,
      districtID: this.formValue.ListDistrictComponent.id,
    };
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start('submit');
    this.api.callApi(this.constant.EDITDISTRICT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/district']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.handleError(res.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop('submit');
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
