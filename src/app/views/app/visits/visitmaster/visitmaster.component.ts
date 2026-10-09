import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-visitmaster',
    templateUrl: './visitmaster.component.html',
    styleUrls: ['./visitmaster.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class VisitmasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  VisitArray: any = [];
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

    this.VisitArray = [
      {
        icon: 'iconsminds-building',
        label: 'Team Visit',
        menu: 'TeamVisit',
        to: `${this.adminRoot}/visits/myteamvisit`,
      },
      {
        icon: 'iconsminds-building',
        label: 'Visit',
        menu: 'Visit',
        to: `${this.adminRoot}/visits/visit`,
      },
      {
        icon: 'iconsminds-idea',
        label: 'Tour',
        menu: 'Tour',
        to: `${this.adminRoot}/visits/tour`,
      },
      {
        icon: 'iconsminds-idea',
        label: 'Tour Report',
        menu: 'AdminTour',
        to: `${this.adminRoot}/visits/admin-tour`,
      },
      {
        icon: 'iconsminds-gaugage',
        label: 'Vehicle Meter Details',
        menu: 'VehicleMeterDetails',
        to: `${this.adminRoot}/visits/vehicle_meter_details`,
      },
      {
        icon: 'iconsminds-business-man',
        label: 'Call FollowUp',
        menu: 'CallFollowUp',
        to: `${this.adminRoot}/visits/callfollowup`,
      },
    ];
  }
}
