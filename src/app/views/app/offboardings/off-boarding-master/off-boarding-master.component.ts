import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-off-boarding-master',
    templateUrl: './off-boarding-master.component.html',
    styleUrls: ['./off-boarding-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OffBoardingMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  OffBoardingArray: any = [];
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

    this.OffBoardingArray = [
      {
        icon: 'iconsminds-remove-file',
        label: 'Apply Resignation',
        menu: 'Resignation',
        to: `${this.adminRoot}/offboardings/apply-resignation`,
      },
      {
        icon: 'iconsminds-remove-file',
        label: 'Resignation Approval',
        menu: 'ResignationRequest',
        to: `${this.adminRoot}/offboardings/resignation-approval`,
      },
      {
        icon: 'iconsminds-remove-file',
        label: 'Resignation Administration',
        menu: 'ResignationTask',
        to: `${this.adminRoot}/offboardings/resignation-administration`,
      },
    ];
  }
}
