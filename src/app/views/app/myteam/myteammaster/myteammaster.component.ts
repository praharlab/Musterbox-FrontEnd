import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-myteammaster',
    templateUrl: './myteammaster.component.html',
    styleUrls: ['./myteammaster.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyteammasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  MyTeamArray: any = [];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

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

    this.MyTeamArray = [
      {
        icon: 'iconsminds-network',
        label: 'Structure',
        menu: 'Structure',
        to: `${this.adminRoot}/myteam/structure`,
      },
      {
        icon: 'iconsminds-location-2',
        label: 'Location Tracking',
        menu: 'LocationTracking',
        to: `${this.adminRoot}/myteam/user_tracking`,
      },
    ];
  }
}
