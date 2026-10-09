import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-org-auth-type',
    templateUrl: './add-org-auth-type.component.html',
    styleUrls: ['./add-org-auth-type.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddOrgAuthTypeComponent implements OnInit {
@ViewChild('addOrgAuthTypemaster') addOrgAuthTypemaster: NgForm;

  ipAddress: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private commonNotificationService: CommonNotificationService,
  ) {}

  ngOnInit(): void {
    this.getIPAddress();
  }

  onSubmit() {
    if (!this.addOrgAuthTypemaster.valid) {
      return;
    }
    let body = {
      orgAuthorizationType: this.addOrgAuthTypemaster.value.orgAuthorizationType,
    };
    this.spinner.start();
    this.api.callApi(this.constant.ADDORGAUTHORIZATIONTYPE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
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
        this.commonNotificationService.handleError(err)
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
