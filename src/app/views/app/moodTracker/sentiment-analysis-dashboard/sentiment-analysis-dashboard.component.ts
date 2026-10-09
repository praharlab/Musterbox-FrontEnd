import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { MonthYearGraphComponent } from './month-year-graph/month-year-graph.component';

@Component({
    selector: 'app-sentiment-analysis-dashboard',
    templateUrl: './sentiment-analysis-dashboard.component.html',
    styleUrls: ['./sentiment-analysis-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SentimentAnalysisDashboardComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;

  @ViewChild(MonthYearGraphComponent) monthYearGraphComponent: MonthYearGraphComponent;

  cardsData: any = [];
  body = {
    company_id: '',
    mood: '',
    startdate: '',
    enddate: '',
    userMasterId: '',
  };
  comp: any;
  selectedValue: string;
  query: string;

  allbranch: any = [];
  employee: any;
  selectedCompany: any;
  enddate1: Date;
  statusCounts: any[] = [];
  sentimentsData: any = [];
  flag: boolean = false;
  company_id: string;
  permissionview: any = [];

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private spinner: NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    this.body = {
      company_id: '',
      mood: '',
      startdate: '',
      enddate: '',
      userMasterId: '',
    };
    this.company_id = localStorage.getItem('company_id');
    this.getData();
    this.getcompany();
    this.checkpermission();
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SentimentDashboard' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.companyfilter.valid) {
      return;
    }

    if (
      (!this.companyfilter.value.startdate && this.companyfilter.value.enddate) ||
      (this.companyfilter.value.startdate && !this.companyfilter.value.enddate)
    ) {
      return;
    }
    this.body.mood = this.companyfilter.value.mood;
    this.body.startdate = this.companyfilter.value.startdate;
    this.body.enddate = this.companyfilter.value.enddate;
    this.body.company_id = this.companyfilter.value.companyMasterID;
    this.body.userMasterId = this.companyfilter.value.userMasterId;

    this.monthYearGraphComponent.company_id = this.body.company_id;
    this.monthYearGraphComponent.user_id = this.body.userMasterId;
    this.monthYearGraphComponent.ngOnDestroy();
    this.monthYearGraphComponent.getMonthlyAttendaceData();
    this.getData();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    if (!id) return;
    this.companyfilter.resetForm();
    this.selectedCompany = id;
    this.allbranch = [];
    this.employee = [];
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
        }
      });

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop();
      });
  }

  selectbranch(id) {
    this.employee = [];
    if (!id) return;
    let bb = {
      branchMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.spinner.stop();
        }
      });
  }

  clear() {
    this.companyfilter.resetForm();
    this.ngOnInit();
    this.monthYearGraphComponent.ngOnDestroy();
    this.monthYearGraphComponent.ngOnInit();
  }

  selectfrom() {
    this.enddate1 = new Date();
  }

  getData() {
    this.statusCounts = [
      {
        mood: 'happy',
        count: 0,
      },
      {
        mood: 'sad',
        count: 0,
      },
      {
        mood: 'stressed',
        count: 0,
      },
      {
        mood: 'angry',
        count: 0,
      },
      {
        mood: 'notSure',
        count: 0,
      },
      {
        mood: 'ok',
        count: 0,
      },
    ];
    this.spinner.start();
    this.flag = false;
    let queryString = '';

    if (this.body.company_id && !this.body.userMasterId) {
      queryString += `?companyMasterID=${this.body.company_id}`;
    }

    if (this.body.company_id && this.body.userMasterId) {
      queryString += `?userMasterID=${this.body.userMasterId}`;
    }

    if (this.body.mood) {
      queryString += `&mood=${this.body.mood}`;
    }

    if (this.body.startdate && this.body.enddate) {
      queryString += `&startDate=${this.body.startdate}&endDate=${this.body.enddate}`;
    }

    this.query = queryString;

    this.api
      .callApi(this.constant.SENTIMENTANALYSIS + queryString, {}, 'GET', false, false, true)
      .subscribe(
        (res: any) => {
          let sentimentsData = res.sentimentPunchIns;

          sentimentsData.forEach((element) => {
            this.statusCounts.forEach((item) => {
              if (element.mood == item.mood) {
                item.count = +element.total;
              }
            });
          });

          this.flag = true;
        },
        (err) => {
          console.log(err);
          return;
        },
      );
  }
}
