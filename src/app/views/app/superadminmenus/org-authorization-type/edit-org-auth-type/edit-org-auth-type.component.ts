import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-org-auth-type',
    templateUrl: './edit-org-auth-type.component.html',
    styleUrls: ['./edit-org-auth-type.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditOrgAuthTypeComponent implements OnInit {
@ViewChild('editOrgAuthType') editOrgAuthType: NgForm;
  ipAddress: any;
  authdata: any = {};
  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getIPAddress();
    this.editdata();
  }
  editdata() {
    let id = this.formValue.ListOrgAuthTypeComponent.id;
    this.spinner.start();
    this.api.callApi(this.constant.GETORGAUTHORIZATIONTYPEBYID + id, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.authdata = res.data;
        this.spinner.stop();
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
        this.spinner.stop();
      },
    );
  }
  onSubmit() {
    if (!this.editOrgAuthType.valid) {
      return;
    }
    let body = {
      orgAuthorizationTypeID: this.formValue.ListOrgAuthTypeComponent.id,
      orgAuthorizationType: this.editOrgAuthType.value.orgAuthorizationType,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEORGAUTHORIZATIONTYPEBYID, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/orgAuthorizationType']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message)
          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
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
