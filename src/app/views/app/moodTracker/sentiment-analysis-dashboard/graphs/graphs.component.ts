import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartService } from 'src/app/components/charts/chart.service';
import { doughnutChartData } from 'src/app/data/charts';
import { Colors } from 'src/app/constants/colors.service';

@Component({
    selector: 'app-graphs',
    templateUrl: './graphs.component.html',
    styleUrls: ['./graphs.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GraphsComponent implements OnInit {
  @Input() class = 'chart-container';

  @Input()
  set totalSentiments(totalSentiments: any) {
    this.rows = totalSentiments;
  }

  @ViewChild('chart', { static: true }) chartRef: ElementRef;

  chartDataConfig: ChartService;
  doughnutChartData = doughnutChartData;
  chart: Chart;
  showloader: any = 'true';
  shadow = true;
  display = false;
  rows: any;

  constructor(private chartService: ChartService) {
    this.chartDataConfig = this.chartService;
  }

  ngOnInit(): void {
    this.onInitData();
  }

  onInitData() {
    this.rows.forEach((element) => {
      if (element.mood == 'sad') {
        element['color'] = Colors.getColors().NotPunch;
      } else if (element.mood == 'happy') {
        element['color'] = Colors.getColors().Present;
      } else if (element.mood == 'stressed') {
        element['color'] = Colors.getColors().MissPunch;
      } else if (element.mood == 'angry') {
        element['color'] = Colors.getColors().Absent;
      } else if (element.mood == 'notSure') {
        element['color'] = Colors.getColors().Holiday;
      } else if (element.mood == 'ok') {
        element['color'] = Colors.getColors().weekoff;
      }
    });
    this.showloader = 'true';
    this.doughnutChartData = {
      labels: [
        `${this.rows[0].mood.toUpperCase()} ${this.rows[0].count}`,
        `${this.rows[1].mood.toUpperCase()} ${this.rows[1].count}`,
        `${this.rows[2].mood.toUpperCase()} ${this.rows[2].count}`,
        `${this.rows[3].mood.toUpperCase()} ${this.rows[3].count}`,
        `${this.rows[4].mood.toUpperCase()} ${this.rows[4].count}`,
        `${this.rows[5].mood.toUpperCase()} ${this.rows[5].count}`,
      ],
      datasets: [
        {
          label: '',
          borderColor: [
            this.rows[0].color,
            this.rows[1].color,
            this.rows[2].color,
            this.rows[3].color,
            this.rows[4].color,
            this.rows[5].color,
          ],
          backgroundColor: [
            this.rows[0].color,
            this.rows[1].color,
            this.rows[2].color,
            this.rows[3].color,
            this.rows[4].color,
            this.rows[5].color,
          ],
          borderWidth: 2,
          data: [
            this.rows[0].count,
            this.rows[1].count,
            this.rows[2].count,
            this.rows[3].count,
            this.rows[4].count,
            this.rows[5].count,
          ],
        },
      ],
    };
    this.initiateChart();
    this.display = true;
    this.showloader = 'false';
  }

  initiateChart() {
    if (this.shadow) {
      Chart.defaults.doughnutWithShadow = Chart.defaults.doughnut;
      Chart.controllers.doughnutWithShadow = Chart.controllers.doughnut.extend({
        draw(ease) {
          Chart.controllers.doughnut.prototype.draw.call(this, ease);
          const chartCtx = this.chart.chart.ctx;
          chartCtx.save();
          chartCtx.shadowColor = 'rgba(0,0,0,0.15)';
          chartCtx.shadowBlur = 10;
          chartCtx.shadowOffsetX = 0;
          chartCtx.shadowOffsetY = 10;
          chartCtx.responsive = true;
          Chart.controllers.doughnut.prototype.draw.apply(this, arguments);
          chartCtx.restore();
        },
      });
    }
    const chartRefEl = this.chartRef.nativeElement;
    const ctx = chartRefEl.getContext('2d');
    this.chart = new Chart(ctx, {
      type: this.shadow ? 'doughnutWithShadow' : 'doughnut',
      data: this.doughnutChartData,
      options: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 30,
            usePointStyle: true,
            fontSize: 12,
          },
        },
        plugins: {
          position: 'top',
          data: {
            display: true,
            fontSize: 12,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
        },
        cutoutPercentage: 80,
        layout: {
          padding: {
            bottom: 0,
          },
        },
        tooltips: {
          backgroundColor: Colors.getColors().foregroundColor,
          titleFontColor: Colors.getColors().primaryColor,
          borderColor: Colors.getColors().separatorColor,
          borderWidth: 0.5,
          bodyFontColor: Colors.getColors().primaryColor,
          bodySpacing: 10,
          xPadding: 15,
          yPadding: 15,
          cornerRadius: 0.15,
        },
      },
      plugins: [this.chartService.centerTextPlugin],
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
