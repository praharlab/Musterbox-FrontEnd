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

@Component({
    selector: 'app-payroll-graph',
    templateUrl: './payroll-graph.component.html',
    styleUrls: ['./payroll-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PayrollGraphComponent implements OnInit {
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
    companyMasterID: any | '';
    yearMonth: any | '';
  };
  currentMonthYear: string;
  monthName: string | '';
  maxYearMonth: string | '';

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private chartService: ChartService,
  ) {
    this.chartDataConfig = this.chartService;
  }

  onMonthYearSelect(eventData) {
    if (!this.monthYearFilter.valid) {
      return;
    }
    this.defaultValue.yearMonth = eventData.target.value.slice(0, 7).replace(/-/g, '');
    const date = new Date(eventData.target.value);
    this.monthName = date.toLocaleString('default', { month: 'long' });
    this.showloader = 'true';
    this.ngOnDestroy();
    this.getDashboardSalaryData();
  }

  ngOnInit(): void {

    let previousMonthData = this.getPreviousMonthYearFromDate(new Date())
    this.currentMonthYear = `${previousMonthData.year}-${previousMonthData.month}`;
    this.maxYearMonth = `${previousMonthData.year}-${previousMonthData.month}`;
    this.onInitData();
  }

  getPreviousMonthYearFromDate(date) {
    let lastMonth = new Date(date);
    lastMonth.setMonth(date.getMonth());
    lastMonth.setDate(1);
    lastMonth.setDate(lastMonth.getDate() - 1);

    let previousMonth = lastMonth.getMonth() + 1;
    let previousYear = lastMonth.getFullYear();

    return {
      month: previousMonth,
      year: previousYear
    };

  }

  onInitData() {

    let monthYear = this.getPreviousMonthYearFromDate(new Date())
    this.showloader = 'true';
    this.defaultValue = {
      companyMasterID: Number(localStorage.getItem('company_id')),
      yearMonth: `${monthYear.year}${monthYear.month}`,
    };
    const date = new Date(this.currentMonthYear);
    this.monthName = date.toLocaleString('default', { month: 'long' });
    this.getDashboardSalaryData();
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

  getDashboardSalaryData() {
    this.api
      .callApi(this.constant.DASHBOARDSALARY, this.defaultValue, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.barChartData = {
            labels: [this.monthName],
            datasets: [
              {
                label: `Gross ${this.rows.gross}`,
                borderColor: Colors.getColors().Gross,
                backgroundColor: Colors.getColors().Gross,
                data: [this.rows.gross],
                borderWidth: 2,
              },
              {
                label: `Deduction ${this.rows.employeeSideDeduction}`,
                borderColor: Colors.getColors().Deduction,
                backgroundColor: Colors.getColors().Deduction,
                data: [this.rows.employeeSideDeduction],
                borderWidth: 2,
              },
              {
                label: `Net ${this.rows.netpay}`,
                borderColor: Colors.getColors().Net,
                backgroundColor: Colors.getColors().Net,
                data: [this.rows.netpay],
                borderWidth: 2,
              },
              {
                label: `CTC ${this.rows.ctc}`,
                borderColor: Colors.getColors().CTC,
                backgroundColor: Colors.getColors().CTC,
                data: [this.rows.ctc],
                borderWidth: 2,
              },
            ],
          };
          this.initiateChart();
          this.display = true;
          this.showloader = 'false';
        }
      });
  }
}
