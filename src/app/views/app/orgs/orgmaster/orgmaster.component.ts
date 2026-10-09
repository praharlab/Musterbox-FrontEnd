import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-orgmaster',
    templateUrl: './orgmaster.component.html',
    styleUrls: ['./orgmaster.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OrgmasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  OrgArray: any = [];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.spinner.start('oninit');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.formdata = res.master;
          this.visible = true;
          this.spinner.stop('oninit');
        }
      });

    this.OrgArray = [
      {
        icon: 'iconsminds-add-user',
        label: 'Set Authorization',
        menu: 'Authorization',
        to: `${this.adminRoot}/orgs/authorization`,
      },
      {
        icon: 'iconsminds-add-user',
        label: 'Set Organization Authorization',
        menu: 'OrganizationAuthorization',
        to: `${this.adminRoot}/orgs/orgAuthorization`,
      },
      {
        icon: 'iconsminds-assistant',
        label: 'Roles',
        menu: 'RoleMaster',
        to: `${this.adminRoot}/orgs/roles`,
      },

      {
        icon: 'iconsminds-assistant',
        label: 'User Permission',
        menu: 'UserPermission',
        to: `${this.adminRoot}/orgs/assignrole`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Organization Documents',
        menu: 'OrganizationDocument',
        to: `${this.adminRoot}/orgs/listPolicyDocuments`,
      },
      {
        icon: 'iconsminds-location-2',
        label: 'Admin Location Tracking',
        menu: 'AdminLocationTracking',
        to: `${this.adminRoot}/orgs/team_location_tracking`,
      },
      {
        icon: 'iconsminds-password-field',
        label: 'Change Password',
        menu: 'changepassword',
        to: `${this.adminRoot}/orgs/change_password`,
      },
      {
        icon: 'iconsminds-remove',
        label: 'Replace Authorization',
        menu: 'AuthorizationReplace',
        to: `${this.adminRoot}/orgs/listAuthDetails`,
      },
      {
        icon: 'iconsminds-speach-bubble-3',
        label: 'Anonymous Feedback',
        menu: 'AnonymousFeedback',
        to: `${this.adminRoot}/orgs/anonymousfeedback`,
      },
      {
        icon: 'iconsminds-optimization',
        label: 'Tracking Dashboard',
        menu: 'TrackingDashboard',
        to: `${this.adminRoot}/orgs/trackingDashboard`,
      },
    ];
  }
}
