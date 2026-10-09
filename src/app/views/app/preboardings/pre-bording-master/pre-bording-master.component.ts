import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-pre-bording-master',
    templateUrl: './pre-bording-master.component.html',
    styleUrls: ['./pre-bording-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PreBordingMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  PreBoardingArray: any = [];
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

    this.PreBoardingArray = [
      {
        icon: 'iconsminds-conference',
        label: 'Pre-Boarding Form',
        menu: 'PreBoardingForm',
        to: `${this.adminRoot}/preboardings/add_preboarding`,
      },
      {
        icon: 'iconsminds-conference',
        label: 'HR Pre-Boarding Request',
        menu: 'HRPre-BoardingRequest',
        to: `${this.adminRoot}/preboardings/hr_preboarding`,
      },
      {
        icon: 'iconsminds-conference',
        label: 'Pre-Boarding Request',
        menu: 'UserPre-BoardingRequest',
        to: `${this.adminRoot}/preboardings/user_preboarding`,
      },

      {
        icon: 'iconsminds-conference',
        label: 'Pre-Boarding Customize',
        menu: 'PreBoardingCustomize',
        to: `${this.adminRoot}/preboardings/preboarding_form`,
      },
      {
        icon: 'iconsminds-conference',
        label: 'Job Posting',
        menu: 'JobPosting',
        to: `${this.adminRoot}/preboardings/jobPosting`,
      },

      {
        icon: 'iconsminds-conference',
        label: 'Job Application',
        menu: 'JobApplication',
        to: `${this.adminRoot}/preboardings/jobApplication`,
      },
    ];
  }
}
