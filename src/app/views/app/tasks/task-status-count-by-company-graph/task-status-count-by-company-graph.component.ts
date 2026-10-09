import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { ChartService } from 'src/app/components/charts/chart.service';
import { barChartData } from 'src/app/data/charts';
import { Colors } from 'src/app/constants/colors.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-task-status-count-by-company-graph',
    templateUrl: './task-status-count-by-company-graph.component.html',
    styleUrls: ['./task-status-count-by-company-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TaskStatusCountByCompanyGraphComponent implements OnInit {
  @Input() class = 'chart-container';
  @ViewChild('chart', { static: true }) chartRef: ElementRef;
  @ViewChild('monthYearFilter') monthYearFilter: NgForm;

  chartDataConfig: ChartService;
  barChartData = barChartData;
  chart: Chart;
  showloader: any = 'true';
  shadow = true;
  display = false;
  rows: any;
  defaultValue: {
    companyid: any | '';
    fromDate: any | '';
    toDate: any | '';
    listBy: any | '';
  };
  currentDate: any;
  dateBeforeFifteenDays: any | '';
  listData: any;
  company_id: string;

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private chartService: ChartService,
    private spinner: NgxUiLoaderService,

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
    };
    this.getTaskStatusCountData();
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
      type: this.shadow ? 'barWithShadow' : 'bar',
      data: this.barChartData,
      options: this.chartDataConfig._barChartOptions,
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
    this.getTaskStatusCountData();
  }
  onToDateChange(eventData) {
    if (!this.monthYearFilter.valid) {
      return;
    }
    this.defaultValue.toDate = eventData.target.value;
    this.ngOnDestroy();
    this.getTaskStatusCountData();
  }

  onListByChange(eventData) {
    if (!this.monthYearFilter.valid) {
      return;
    }
    this.defaultValue.listBy = eventData;
    this.ngOnDestroy();
    this.getTaskStatusCountData();
  }

  getTaskStatusCountData() {
    let query =
      '?companyMasterID=' +
      this.defaultValue.companyid +
      '&fromDate=' +
      this.defaultValue.fromDate +
      '&toDate=' +
      this.defaultValue.toDate +
      '&listBy=' +
      this.defaultValue.listBy;
    this.api
      .callApi(this.constant.TASKSTATUSCOUNTBYCOMPANY + query, {}, 'GET', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.barChartData = {
            labels: ['Task Status'],
            datasets: [
              {
                label: `Completed ${this.rows.completed}`,
                borderColor: Colors.getColors().Completed,
                backgroundColor: Colors.getColors().Completed,
                data: [this.rows.completed],
                borderWidth: 1,
              },
              {
                label: `Accepted ${this.rows.accepted}`,
                borderColor: Colors.getColors().Accepted,
                backgroundColor: Colors.getColors().Accepted,
                data: [this.rows.accepted],
                borderWidth: 1,
              },
              {
                label: `Pending ${this.rows.pending}`,
                borderColor: Colors.getColors().Pending,
                backgroundColor: Colors.getColors().Pending,
                data: [this.rows.pending],
                borderWidth: 1,
              },
              {
                label: `Rejected ${this.rows.rejected}`,
                borderColor: Colors.getColors().Rejected,
                backgroundColor: Colors.getColors().Rejected,
                data: [this.rows.rejected],
                borderWidth: 1,
              },
            ],
          };
          this.initiateChart();
          this.display = true;
          this.showloader = 'false';
        }
      });
  }


  download() {
    if (!this.monthYearFilter.valid) {
      return;
    }
    let query =
      '?companyMasterID=' +
      this.defaultValue.companyid +
      '&fromDate=' +
      this.defaultValue.fromDate +
      '&toDate=' +
      this.defaultValue.toDate +
      '&listBy=' +
      this.defaultValue.listBy +
      '&exportData=' +
      true;

    this.spinner.start('download');
    this.api
      .callApi(this.constant.TASKSTATUSCOUNTBYCOMPANY + query, {}, 'GET', true, false, true, true)
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
