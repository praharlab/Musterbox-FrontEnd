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
    selector: 'app-pending-task-percentage-wise-graph',
    templateUrl: './pending-task-percentage-wise-graph.component.html',
    styleUrls: ['./pending-task-percentage-wise-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PendingTaskPercentageWiseGraphComponent implements OnInit {
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
  };
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
    this.onInitData();
  }

  onInitData() {
    this.showloader = 'true';
    this.defaultValue = {
      companyid: Number(localStorage.getItem('company_id')),
    };
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

  getTaskDashboardData() {
    this.showloader = 'true';
    let query = '?companyMasterID=' + this.defaultValue.companyid;
    this.api
      .callApi(this.constant.PENDINGTASKDASHBOARD + query, {}, 'GET', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.barChartData = {
            labels: res.label,
            datasets: [
              {
                data: this.rows[0].data,
                label: 'Pending',
                stack: 'a',
                backgroundColor: Colors.getColors().Pending,
                borderWidth: 1,
                borderColor: Colors.getColors().Pending,
              },
              {
                data: this.rows[1].data,
                label: 'Completed',
                stack: 'a',
                backgroundColor: Colors.getColors().Completed,
                borderWidth: 1,
                borderColor: Colors.getColors().Completed,
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

  download() {
    if (!this.monthYearFilter.valid) {
      return;
    }
    let query = '?companyMasterID=' + this.defaultValue.companyid + '&exportData=' + true;

    this.spinner.start('download');
    this.api
      .callApi(this.constant.PENDINGTASKDASHBOARD + query, {}, 'GET', true, false, true, true)
      .subscribe(
        (res: any) => {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'Pending-Task-DashBoard.xlsx');
          this.spinner.stop('download');
        },
        (err) => {
          this.spinner.stop('download');
        },
      );
  }
}
