import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { ChartService } from 'src/app/components/charts/chart.service';
import { pieChartData } from 'src/app/data/charts';
import { Colors } from 'src/app/constants/colors.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-punch-in-out-graph',
    templateUrl: './punch-in-out-graph.component.html',
    styleUrls: ['./punch-in-out-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PunchInOutGraphComponent implements OnInit {
  // @Input() chartClass = "dashboard-bar-chart";
  @Input() class = 'chart-container';
  @ViewChild('chart', { static: true }) chartRef: ElementRef;
  @ViewChild('dateFilter') dateFilter: NgForm;

  chartDataConfig: ChartService;
  pieChartData = pieChartData;
  chart: Chart;
  showloader: any = 'true';
  shadow = true;
  display = false;
  company_id: string;
  rows: any;
  currentDate: string;
  maxDate: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private chartService: ChartService,
    private formValueStorageService: FormValueStorageService,

  ) {
    this.chartDataConfig = this.chartService;
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.maxDate = new Date().toISOString().slice(0, 10);
    this.onInitData();
  }

  onInitData() {
    this.showloader = 'true';
    this.getDashboardPunchInOutData();
  }

  onDateSelect(eventData) {
    if (!this.dateFilter.valid) {
      return;
    }
    this.showloader = 'true';
    this.ngOnDestroy();
    this.currentDate = eventData.target.value;
    this.getDashboardPunchInOutData();
  }

  initiateChart() {
    if (this.shadow) {
      Chart.defaults.pieWithShadow = Chart.defaults.pie;
      Chart.controllers.pieWithShadow = Chart.controllers.pie.extend({
        draw(ease) {
          Chart.controllers.pie.prototype.draw.call(this, ease);
          const chartCtx = this.chart.chart.ctx;
          chartCtx.save();
          chartCtx.shadowColor = 'rgba(0,0,0,0.15)';
          chartCtx.shadowBlur = 10;
          chartCtx.shadowOffsetX = 0;
          chartCtx.shadowOffsetY = 10;
          chartCtx.responsive = true;
          Chart.controllers.pie.prototype.draw.apply(this, arguments);
          chartCtx.restore();
        },
      });
    }
    const chartRefEl = this.chartRef.nativeElement;
    const ctx = chartRefEl.getContext('2d');
    this.chart = new Chart(ctx, {
      type: this.shadow ? 'pieWithShadow' : 'pie',
      data: this.pieChartData,
      options: this.chartDataConfig._pieChartOptions,
      // plugins: [this.chartService.centerTextPlugin],
    });
  }

  getDashboardPunchInOutData() {
    let query = '?companyMasterID=' + this.company_id + '&date=' + this.currentDate;
    this.api
      .callApi(this.constant.DASHBOARDPUNCHINOUTGRAPH + query, {}, 'GET', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.showloader = 'false';
          this.rows = res.data;
          this.pieChartData = {
            labels: [
              `Punch In ${this.rows[0].total_punchin}`,
              `Punch Out ${this.rows[0].total_punchout}`,
              `Not Punch In ${this.rows[0].total_notpunchin}`,
              `On Leave ${this.rows[0].total_onLeave}`,
              `Week Off ${this.rows[0].total_weekoff}`,
            ],
            datasets: [
              {
                label: '',
                borderColor: [
                  Colors.getColors().Punchin,
                  Colors.getColors().Punchout,
                  Colors.getColors().NotPunch,
                  Colors.getColors().Leave,
                  Colors.getColors().weekoff,
                ],
                backgroundColor: [
                  Colors.getColors().Punchin,
                  Colors.getColors().Punchout,
                  Colors.getColors().NotPunch,
                  Colors.getColors().Leave,
                  Colors.getColors().weekoff,
                ],
                borderWidth: 2,
                data: [
                  this.rows[0].total_punchin,
                  this.rows[0].total_punchout,
                  this.rows[0].total_notpunchin,
                  this.rows[0].total_onLeave,
                  this.rows[0].total_weekoff,
                ],
              },
            ],
          };
          this.initiateChart();
          this.display = true;
          this.showloader = 'false';
        }
      });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  navigateToEmployeeData(): void {
    this.formValueStorageService.navigate(
      'PunchInOutGraphComponent',
      this.currentDate,
      '/payrolls/employee_punch_in_out',
      this.company_id,
    );
  }
}
