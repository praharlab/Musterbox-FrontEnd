import { Injectable } from '@angular/core';
import { Colors } from '../../constants/colors.service';

@Injectable({ providedIn: 'root' })
export class ChartService {
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  private _chartTooltip = {
    backgroundColor: Colors.getColors().foregroundColor,
    titleFontColor: Colors.getColors().primaryColor,
    borderColor: Colors.getColors().separatorColor,
    borderWidth: 0.5,
    bodyFontColor: Colors.getColors().primaryColor,
    bodySpacing: 10,
    xPadding: 15,
    yPadding: 15,
    cornerRadius: 0.15,
  };

  // eslint-disable-next-line 
  public get chartTooltip() {
    return this._chartTooltip;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  private _centerTextPlugin = {
    // eslint-disable-next-line 
    beforeDraw(chart) {
      const width = chart.chartArea.right;
      const height = chart.chartArea.bottom;
      const ctx = chart.chart.ctx;
      ctx.restore();

      let activeLabel = chart.data.labels[0];
      let activeValue = chart.data.datasets[0].data[0];
      let dataset = chart.data.datasets[0];
      let meta = dataset._meta[Object.keys(dataset._meta)[0]];
      let total = meta.total;

      let activePercentage = parseFloat(((activeValue / total) * 100).toFixed(1));
      activePercentage = chart.legend.legendItems[0].hidden ? 0 : activePercentage;

      if (chart.pointAvailable) {
        activeLabel = chart.data.labels[chart.pointIndex];
        activeValue = chart.data.datasets[chart.pointDataIndex].data[chart.pointIndex];

        dataset = chart.data.datasets[chart.pointDataIndex];
        meta = dataset._meta[Object.keys(dataset._meta)[0]];
        total = meta.total;
        activePercentage = parseFloat(((activeValue / total) * 100).toFixed(1));
        activePercentage = chart.legend.legendItems[chart.pointIndex].hidden ? 0 : activePercentage;
      }

      ctx.font = '36px Nunito, sans-serif';
      ctx.fillStyle = Colors.getColors().primaryColor;
      ctx.textBaseline = 'middle';

      const text = activeValue;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
      ctx.fillText(text, textX, textY);

      ctx.font = '14px Nunito, sans-serif';
      ctx.textBaseline = 'middle';

      // const text2 = activeLabel.slice(0, 6);

      const text2 = activeLabel;
      const textX2 = Math.round((width - ctx.measureText(text2).width) / 2);
      const textY2 = height / 2 - 30;
      ctx.fillText(text2, textX2, textY2);

      ctx.save();
    },
    // eslint-disable-next-line 
    beforeEvent(chart, event, options) {
      const firstPoint = chart.getElementAtEvent(event)[0];

      if (firstPoint) {
        chart.pointIndex = firstPoint._index;
        chart.pointDataIndex = firstPoint._datasetIndex;
        chart.pointAvailable = true;
      }
    },
  };

  // eslint-disable-next-line 
  public get centerTextPlugin() {
    return this._centerTextPlugin;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  private _polarAreaChartOptions = {
    legend: {
      position: 'bottom',
      labels: {
        padding: 30,
        usePointStyle: true,
        fontSize: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scale: {
      ticks: {
        display: false,
        maxTicksLimit: 6,
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
    tooltips: this.chartTooltip,
  };

  // eslint-disable-next-line 
  public get polarAreaChartOptions() {
    return this._polarAreaChartOptions;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  public _lineChartOptions = {
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: this.chartTooltip,
    plugins: {
      datalabels: {
        display: false,
      },
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            display: true,
            lineWidth: 1,
            color: 'rgba(0,0,0,0.1)',
            drawBorder: false,
          },
          ticks: {
            beginAtZero: true,
            stepSize: 5,
            min: 50,
            max: 70,
            padding: 20,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
  };

  // eslint-disable-next-line 
  public get lineChartOptions() {
    return this._lineChartOptions;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  private _areaChartOptions = {
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: this.chartTooltip,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: true,
            lineWidth: 1,
            color: 'rgba(0,0,0,0.1)',
            drawBorder: false,
          },
          ticks: {
            beginAtZero: true,
            stepSize: 5,
            min: 50,
            max: 70,
            padding: 20,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
  };

  // eslint-disable-next-line 
  public get areaChartOptions() {
    return this._areaChartOptions;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  private _scatterChartOptions = {
    legend: {
      position: 'bottom',
      labels: {
        padding: 30,
        usePointStyle: true,
        fontSize: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: true,
            lineWidth: 1,
            color: 'rgba(0,0,0,0.1)',
            drawBorder: false,
          },
          ticks: {
            beginAtZero: true,
            stepSize: 20,
            min: -80,
            max: 80,
            padding: 20,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: true,
            lineWidth: 1,
            color: 'rgba(0,0,0,0.1)',
          },
        },
      ],
    },
    tooltips: this.chartTooltip,
  };

  // eslint-disable-next-line 
  public get scatterChartOptions() {
    return this._scatterChartOptions;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  public _barChartOptions = {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        usePointStyle: true,
        fontSize: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: true,
            lineWidth: 1,
            color: 'rgba(0,0,0,0.1)',
            drawBorder: false,
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          stacked: false,
          gridLines: {
            display: false,
          },
        },
      ],
    },
    tooltips: this.chartTooltip,
  };

  // eslint-disable-next-line 
  public get barChartOptions() {
    return this._barChartOptions;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  private _radarChartOptions = {
    legend: {
      position: 'bottom',
      labels: {
        padding: 30,
        usePointStyle: true,
        fontSize: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scale: {
      ticks: {
        display: false,
      },
    },
    tooltips: this.chartTooltip,
  };

  // eslint-disable-next-line 
  public get radarChartOptions() {
    return this._radarChartOptions;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  public _pieChartOptions = {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        usePointStyle: true,
        fontSize: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: false,
    },
    layout: {
      padding: {
        bottom: 20,
      },
    },
    // scales: {
    //   yAxes: [
    //     {
    //       gridLines: {
    //         display: false,
    //         lineWidth: 1,
    //         color: 'rgba(0,0,0,0.1)',
    //         drawBorder: false
    //       },
    //       ticks: {
    //         beginAtZero: true,
    //         stepSize: 5,
    //         min: 10,
    //         max: 50,
    //         padding: 20
    //       }
    //     }
    //   ],
    //   xAxes: [
    //     {
    //       gridLines: {
    //         display: false
    //       }
    //     }
    //   ]
    // },
    tooltips: this.chartTooltip,
  };

  // eslint-disable-next-line 
  public get pieChartOptions() {
    return this._pieChartOptions;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  public _doughnutChartOptions = {
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
        bottom: 20,
      },
    },
    tooltips: this.chartTooltip,
  };

  // eslint-disable-next-line 
  public get doughnutChartOptions() {
    return this._doughnutChartOptions;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  private _smallLineChartOptions = {
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 10,
        bottom: 10,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          display: false,
        },
      ],
      xAxes: [
        {
          display: false,
        },
      ],
    },
  };

  // eslint-disable-next-line
  public get smallLineChartOptions() {
    return this._smallLineChartOptions;
  }

  private _options = {
    zoom: {
      pan: {
        enabled: true,
        mode: 'x', // 'x', 'y', or 'xy' for both axes
      },
      zoom: {
        enabled: true,
        mode: 'x', // 'x', 'y', or 'xy' for both axes
      },
    },
    legend: {
      position: 'top',
      labels: {
        padding: 15,
        usePointStyle: false,
        fontSize: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: [
        {
          beginAtZero: true,
        },
      ],
      x: [
        {
          stacked: false,
        },
      ],

      yAxes: [
        {
          gridLines: {
            display: true,
            lineWidth: 1,
            color: 'rgba(0,0,0,0.1)',
            drawBorder: true,
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    tooltips: this.chartTooltip,
  };

  public get options() {
    return this._options;
  }
}
