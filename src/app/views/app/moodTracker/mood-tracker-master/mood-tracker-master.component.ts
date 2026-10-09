import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-mood-tracker-master',
    templateUrl: './mood-tracker-master.component.html',
    styleUrls: ['./mood-tracker-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MoodTrackerMasterComponent implements OnInit {
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
        label: 'Sentiments Analysis Dashboard',
        menu: 'SentimentDashboard',
        to: `${this.adminRoot}/moodTrackers/sentimentsAnalysisDashboard`,
      },
      {
        icon: 'iconsminds-conference',
        label: 'Sentiment Report',
        menu: 'SentimentReport',
        to: `${this.adminRoot}/moodTrackers/sentimentsReport`,
      },

      {
        icon: 'iconsminds-conference',
        label: 'My Sentiments',
        menu: 'MySentiment',
        to: `${this.adminRoot}/moodTrackers/mysentiments`,
      },
    ];
  }
}
