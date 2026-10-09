import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { Colors } from 'src/app/constants/colors.service';
import { ChartService } from 'src/app/components/charts/chart.service';
import { barChartData } from 'src/app/data/charts';

@Component({
    selector: 'app-ticket-dashboard-status',
    templateUrl: './ticket-dashboard-status.component.html',
    styleUrls: ['./ticket-dashboard-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TicketDashboardStatusComponent implements OnInit {
  @Input() class = 'chart-container';
  @ViewChild('chart', { static: true }) chartRef: ElementRef;

  chartDataConfig: ChartService;
  barChartData = barChartData;
  chart: Chart;
  showloader: any = 'true';
  shadow = true;
  display = false;
  data: any = [];

  @Input()
  set employeeStatusData(employeeStatusData) {
    this.data = employeeStatusData;
  }

  rows: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    private chartService: ChartService,
  ) {
    this.chartDataConfig = this.chartService;
  }

  ngOnInit(): void {
    this.onInitData();
  }

  onInitData() {
    this.showloader = 'true';

    const statusCounts = {
      Created: 0,
      'In Progress': 0,
      'On Hold': 0,
      Closed: 0,
    };

    for (let i = 0; i < this.data.length; i++) {
      const status = this.data[i].status;
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status] += this.data[i].count;
      }
    }

    this.barChartData = {
      labels: ['Created', 'In Progress', 'On Hold', 'Closed'],
      datasets: [
        {
          label: '',
          borderColor: [
            Colors.getColors().Gross,
            Colors.getColors().Deduction,
            Colors.getColors().Net,
            Colors.getColors().CTC,
          ],
          backgroundColor: [
            Colors.getColors().Gross,
            Colors.getColors().Deduction,
            Colors.getColors().Net,
            Colors.getColors().CTC,
          ],
          data: [
            statusCounts['Created'],
            statusCounts['In Progress'],
            statusCounts['On Hold'],
            statusCounts['Closed'],
          ],
          borderWidth: 1,
        },
      ],
    };
    this.initiateChart();
    this.display = true;
    this.showloader = 'false';
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
}
