import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-scatter-chart',
    templateUrl: './scatter-chart.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ScatterChartComponent implements AfterViewInit, OnDestroy {
  @Input() shadow = false;
  @Input() options;
  @Input() data;
  @Input() class = 'chart-container';
  @ViewChild('chart', { static: true }) chartRef: ElementRef;

  chart: Chart;

  public constructor() {}

  ngAfterViewInit(): void {
    if (this.shadow) {
      Chart.defaults.scatterWithShadow = Chart.defaults.scatter;
      Chart.controllers.scatterWithShadow = Chart.controllers.scatter.extend({
        // eslint-disable-next-line
        draw(ease) {
          Chart.controllers.scatter.prototype.draw.call(this, ease);
          const chartCtx = this.chart.chart.ctx;
          chartCtx.save();
          chartCtx.shadowColor = 'rgba(0,0,0,0.2)';
          chartCtx.shadowBlur = 7;
          chartCtx.shadowOffsetX = 0;
          chartCtx.shadowOffsetY = 7;
          chartCtx.responsive = true;
          Chart.controllers.scatter.prototype.draw.apply(this, arguments);
          chartCtx.restore();
        },
      });
    }

    const chartRefEl = this.chartRef.nativeElement;
    const ctx = chartRefEl.getContext('2d');
    this.chart = new Chart(ctx, {
      type: this.shadow ? 'scatterWithShadow' : 'scatter',
      data: this.data,
      options: this.options,
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
