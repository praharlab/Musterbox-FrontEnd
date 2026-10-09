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

@Component({
    selector: 'app-month-attendance-graph',
    templateUrl: './month-attendance-graph.component.html',
    styleUrls: ['./month-attendance-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MonthAttendanceGraphComponent implements OnInit {
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
    YYYYMM: any | '';
  };
  currentMonthYear: string;
  maxYearMonth: string | '';
  monthName: string | '';

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
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    this.currentMonthYear = `${currentYear}-${currentMonth}`;
    this.maxYearMonth = `${currentYear}-${currentMonth}`;

    this.onInitData();
  }

  onInitData() {
    this.showloader = 'true';
    this.defaultValue = {
      companyid: Number(localStorage.getItem('company_id')),
      YYYYMM: `${new Date().getFullYear()}${new Date().getMonth() + 1}`,
    };
    const date = new Date(this.currentMonthYear);
    this.monthName = date.toLocaleString('default', { month: 'long' });
    this.getMonthlyAttendaceData();
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

  onMonthYearSelect(eventData) {
    if (!this.monthYearFilter.valid) {
      return;
    }
    this.defaultValue.YYYYMM = eventData.target.value.slice(0, 7).replace(/-/g, '');
    const date = new Date(eventData.target.value);
    this.monthName = date.toLocaleString('default', { month: 'long' });

    this.ngOnDestroy();
    this.getMonthlyAttendaceData();
  }

  getMonthlyAttendaceData() {
    this.showloader = 'true';
    let query = '?companyMasterID=' + this.defaultValue.companyid + '&YYYYMM=' + this.defaultValue.YYYYMM;
    this.api
      .callApi(this.constant.DASHBOARDMONTHLYATTENDACE + query, {}, 'GET', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.barChartData = {
            labels: res.label,
            datasets: [
              {
                data: this.rows[0].data,
                label: 'Present',
                stack: 'a',
                backgroundColor: Colors.getColors().Present,
                borderWidth: 1,
                borderColor: Colors.getColors().Present,
              },
              {
                data: this.rows[6].data,
                label: 'Absent',
                stack: 'a',
                backgroundColor: Colors.getColors().Absent,
                borderWidth: 1,
                borderColor: Colors.getColors().Absent,
              },
              {
                data: this.rows[2].data,
                label: 'Missing Punch',
                stack: 'a',
                backgroundColor: Colors.getColors().MissPunch,
                borderWidth: 1,
                borderColor: Colors.getColors().MissPunch,
              },
              {
                data: this.rows[5].data,
                label: 'Leave',
                stack: 'a',
                backgroundColor: Colors.getColors().Leave,
                borderWidth: 1,
                borderColor: Colors.getColors().Leave,
              },
              {
                data: this.rows[3].data,
                label: 'Holiday',
                stack: 'a',
                backgroundColor: Colors.getColors().Holiday,
                borderWidth: 1,
                borderColor: Colors.getColors().Holiday,
              },
              {
                data: this.rows[4].data,
                label: 'Weekly Off',
                stack: 'a',
                backgroundColor: Colors.getColors().weekoff,
                borderWidth: 1,
                borderColor: Colors.getColors().weekoff,
              },
              {
                data: this.rows[1].data,
                label: 'Halfday',
                stack: 'a',
                backgroundColor: Colors.getColors().HalfDay,
                borderWidth: 1,
                borderColor: Colors.getColors().HalfDay,
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
}
