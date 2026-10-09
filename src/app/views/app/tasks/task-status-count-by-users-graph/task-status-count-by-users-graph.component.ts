import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { Component, Input, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Chart } from 'chart.js';
import { barChartData2, pieChartData, doughnutChartData } from 'src/app/data/charts';
import { ChartService } from 'src/app/components/charts/chart.service';
import { Colors } from 'src/app/constants/colors.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-task-status-count-by-users-graph',
    templateUrl: './task-status-count-by-users-graph.component.html',
    styleUrls: ['./task-status-count-by-users-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TaskStatusCountByUsersGraphComponent implements OnInit {
  @Input() chartClass = 'dashboard-bar-chart';
  @Input() class = 'chart-container';
  @ViewChild('chart', { static: true }) chartRef: ElementRef;
  @ViewChild('monthYearFilter') monthYearFilter: NgForm;
  chartDataConfig: ChartService;
  rows: any;
  display = false;
  showloader: any = 'false';
  company: any;
  allbranch: any;
  company_id: string;
  defaultValue2: {
    cName: any;
  };
  rows2: any;
  chart: Chart;
  shadow = true;
  _pieChartOptions: ChartService;

  barChartData = barChartData2;

  defaultValue: {
    companyid: any | '';
    fromDate: any | '';
    toDate: any | '';
    listBy: any | '';
    branchMasterID: [];
    userMasterID: [];
  };
  currentDate: any;
  dateBeforeFifteenDays: any | '';
  listData: any;
  selectedBranch: any[];
  alluser: any;
  // users_Body = {
  //   companyMasterID: '',
  //   branchMasterID: [],
  //   departmentID: [],
  //   designationID: [],
  //   divisionId: [],
  //   workingAreaId: [],
  // };
  selectedUser: any[];
  isResetForm: boolean = false;

  constructor(
    private chartService: ChartService,
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
  ) {
    this.chartDataConfig = this.chartService;
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    let currentDate = new Date();
    let dateBeforeFifteenDays = new Date(currentDate);
    dateBeforeFifteenDays.setDate(currentDate.getDate() - 15);
    this.listData = 'CreatedDate';
    // Format the dates to match the desired format
    this.currentDate = currentDate.toISOString().split('T')[0];
    this.dateBeforeFifteenDays = dateBeforeFifteenDays.toISOString().split('T')[0];
    this.onInitData();
  }

  onInitData() {
    this.showloader = 'true';
    this.defaultValue = {
      companyid: Number(localStorage.getItem('company_id')),
      fromDate: this.dateBeforeFifteenDays,
      toDate: this.currentDate,
      listBy: this.listData,
      branchMasterID: [],
      userMasterID: [],
    };
    const date = new Date(this.currentDate);
    this.selectcompany();
    this.getTaskDashboardData();
  }

  initiateChart() {
    if (this.shadow) {
      Chart.defaults.global.datasets.barWithShadow = Chart.defaults.global.datasets.bar;
      Chart.defaults.barWithShadow = Chart.defaults.bar;
      Chart.controllers.barWithShadow = Chart.controllers.bar.extend({
        // eslint-disable-next-line
        draw(ease) {
          Chart.controllers.bar.prototype.draw.call(this, ease);
          const chartCtx = this.chart.ctx;
          chartCtx.save();
          chartCtx.shadowColor = 'rgba(0,0,0,0.2)';
          chartCtx.shadowBlur = 7;
          chartCtx.shadowOffsetX = 5;
          chartCtx.shadowOffsetY = 7;
          chartCtx.responsive = true;
          Chart.controllers.bar.prototype.draw.apply(this, arguments);
          chartCtx.restore();
        },
      });
    }

    const chartRefEl = this.chartRef.nativeElement;
    const ctx = chartRefEl.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: this.barChartData,
      options: {},
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
  onFromDateChange(eventData) {
    if (!this.monthYearFilter.valid) {
      return;
    }
    this.defaultValue.fromDate = eventData.target.value;
    this.ngOnDestroy();
    this.getTaskDashboardData();
  }
  onToDateChange(eventData) {
    if (!this.monthYearFilter.valid) {
      return;
    }
    this.defaultValue.toDate = eventData.target.value;
    this.ngOnDestroy();
    this.getTaskDashboardData();
  }

  onListByChange(eventData) {
    if (!this.monthYearFilter.valid) {
      return;
    }
    this.defaultValue.listBy = eventData;
    this.ngOnDestroy();
    this.getTaskDashboardData();
  }

  onUserChange(eventData) {
    if (!this.monthYearFilter.valid) {
      return;
    }
    this.defaultValue.userMasterID = this.monthYearFilter.value.user;
    this.ngOnDestroy();
    this.getTaskDashboardData();
  }
  getTaskDashboardData() {
    this.showloader = 'true';
    this.api
      .callApi(this.constant.TASKSTATUSCOUNTBYUSER, this.defaultValue, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.barChartData = {
            labels: res.label,
            datasets: [
              {
                data: this.rows[0].data,
                label: 'completed',
                stack: 'a',
                backgroundColor: Colors.getColors().Completed,
                borderWidth: 1,
                borderColor: Colors.getColors().Completed,
              },
              {
                data: this.rows[1].data,
                label: 'accepted',
                stack: 'a',
                backgroundColor: Colors.getColors().Accepted,
                borderWidth: 1,
                borderColor: Colors.getColors().Accepted,
              },
              {
                data: this.rows[2].data,
                label: 'pending',
                stack: 'a',
                backgroundColor: Colors.getColors().Pending,
                borderWidth: 1,
                borderColor: Colors.getColors().Pending,
              },
              {
                data: this.rows[3].data,
                label: 'rejected',
                stack: 'a',
                backgroundColor: Colors.getColors().Rejected,
                borderWidth: 1,
                borderColor: Colors.getColors().Rejected,
              },
            ],
          };
          this.initiateChart();
          this.display = true;
          this.showloader = 'false';
        } else {
          this.showloader = 'false';
          this.notifications.create('Warning!', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        }
      });
  }

  selectcompany() {
    this.alluser = [];
    this.allbranch = [];

    this.selectedBranch = [];
    this.selectedUser = [];

    if (!this.defaultValue.companyid) return;
    this.isResetForm = false;

    this.spinner.startLoader('master3');
    this.api
      .callApi(
        this.constant.BRANCHBYCOMPANYDATA1 + this.defaultValue.companyid,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        this.allbranch = res;
        this.selectAllForDropdownItems(this.allbranch);
        this.spinner.stopLoader('master3');
      });
    this.getUsers();
  }

  selectbranch() {
    this.alluser = [];
    this.selectedUser = [];
    this.defaultValue.branchMasterID = this.monthYearFilter.value.branch;
    this.defaultValue.userMasterID = [];
    this.getUsers();
    this.ngOnDestroy();
    this.getTaskDashboardData();
  }

  getUsers() {
    if (this.isResetForm) return;
    this.defaultValue.branchMasterID =
      this.defaultValue.branchMasterID && this.defaultValue.branchMasterID.length > 0
        ? this.defaultValue.branchMasterID
        : null;
    const body = {
      companyMasterID: this.defaultValue.companyid,
      branchMasterID: this.defaultValue.branchMasterID,
    };
    this.spinner.startLoader('master3');
    this.api.callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
          this.spinner.stopLoader('master3');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stopLoader('master3');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stopLoader('master3');
      },
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  download() {
    if (!this.monthYearFilter.valid) {
      return;
    }
    const body = {
      companyid: this.defaultValue.companyid,
      fromDate: this.defaultValue.fromDate,
      toDate: this.defaultValue.toDate,
      listBy: this.defaultValue.listBy,
      branchMasterID: this.defaultValue.branchMasterID,
      userMasterID: this.defaultValue.userMasterID,
      exportData: true,
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.TASKSTATUSCOUNTBYUSER, body, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'Task-DashBoard.xlsx');
          this.spinner.stop('download');
        },
        (err) => {
          this.spinner.stop('download');
        },
      );
  }
}
