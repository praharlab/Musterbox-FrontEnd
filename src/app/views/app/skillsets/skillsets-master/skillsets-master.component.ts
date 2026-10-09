import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-skillsets-master',
    templateUrl: './skillsets-master.component.html',
    styleUrls: ['./skillsets-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SkillsetsMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  SkillsetsArray: any = [];
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

    this.SkillsetsArray = [
      {
        icon: 'iconsminds-notepad',
        label: 'Skillsets',
        menu: 'SkillSetsQuestions',
        to: `${this.adminRoot}/skillsets/skillset`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Skillsets Form',
        menu: 'SkillSetsForm',
        to: `${this.adminRoot}/skillsets/skillsetform`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Generate Monthly Skillsets Form',
        menu: 'GenerateMonthlySkillSetsForm',
        to: `${this.adminRoot}/skillsets/monthlySkillsetform`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'My Skillsets Form',
        menu: 'MySkillSetsForm',
        to: `${this.adminRoot}/skillsets/user-skillsets-form`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Skillsets Authorization Form',
        menu: 'SkillSetsFormAuthorization',
        to: `${this.adminRoot}/skillsets/field-skillsets-form`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Skillsets Report',
        menu: 'SkillSetsReport',
        to: `${this.adminRoot}/skillsets/skillsetsReport`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'User Skillsets Report',
        menu: 'UserSkillsetFormReport',
        to: `${this.adminRoot}/skillsets/userSkillsetsReport`,
      },
    ];
  }
}
