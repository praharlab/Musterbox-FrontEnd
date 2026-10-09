import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { Component, Input, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Chart } from 'chart.js';
import { barChartData3 } from 'src/app/data/charts';
import { ChartService } from 'src/app/components/charts/chart.service';
import { Colors } from 'src/app/constants/colors.service';

@Component({
    selector: 'app-month-year-graph',
    templateUrl: './month-year-graph.component.html',
    styleUrls: ['./month-year-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MonthYearGraphComponent implements OnInit {
  @Input() chartClass = 'dashboard-bar-chart';
  @Input() class = 'chart-container';
  @ViewChild('chart', { static: true }) chartRef: ElementRef;
  @ViewChild('monthYearFilter') monthYearFilter: NgForm;
  chartDataConfig: ChartService;
  rows: any;
  display = false;
  showloader: any = 'false';
  rows2: any;
  chart: Chart;
  shadow = true;
  _pieChartOptions: ChartService;

  barChartData = barChartData3;

  currentMonthYear: string;
  maxYearMonth: string | '';
  monthName: string | '';
  moodData: any = [];
  year: number;

  company_id: any;
  user_id: any;
  queryString: string;

  // @Input()
  // set totalSentiments(totalSentiments: any) {
  //   this.rows = totalSentiments;
  // }

  constructor(
    private chartService: ChartService,
    private api: ApiService,
    private constant: ConstantService,
  ) {
    this.chartDataConfig = this.chartService;
  }

  ngOnInit(): void {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    this.maxYearMonth = `${currentYear}-${currentMonth}`;
    this.year = currentYear;
    this.queryString = '';
    this.user_id = '';
    this.company_id = '';
    this.onInitData();
  }

  onInitData() {
    this.showloader = 'true';

    this.monthName = null;
    this.getMonthlyAttendaceData();
  }

  initiateChart() {
    if (this.shadow) {
      Chart.defaults.global.datasets.barWithShadow = Chart.defaults.global.datasets.bar;
      Chart.defaults.barWithShadow = Chart.defaults.bar;
      Chart.controllers.barWithShadow = Chart.controllers.bar.extend({
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
      options: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 10,
            usePointStyle: true,
            fontSize: 12,
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
    const date = new Date(eventData.target.value);
    this.monthName = date.toLocaleString('default', { month: 'long' });
    if (eventData.target.value) {
      this.queryString = `?month=${eventData.target.value.slice(5, 7)}&year=${eventData.target.value.slice(0, 4)}`;
    }

    this.ngOnDestroy();
    this.getMonthlyAttendaceData();
  }

  getMonthlyAttendaceData() {
    this.rows = [
      {
        mood: 'sad',
        count: 0,
      },
      {
        mood: 'happy',
        count: 0,
      },
      {
        mood: 'stressed',
        count: 0,
      },
      {
        mood: 'angry',
        count: 0,
      },
      {
        mood: 'notSure',
        count: 0,
      },
      {
        mood: 'ok',
        count: 0,
      },
    ];

    this.showloader = 'true';

    if (!this.monthName) {
      this.queryString = `?year=${this.year}`;
    }

    if (this.company_id && !this.user_id) {
      this.queryString += `&companyMasterID=${this.company_id}`;
    }

    if (this.user_id && this.company_id) {
      this.queryString += `&userMasterID=${this.user_id}`;
    }

    this.api
      .callApi(this.constant.SENTIMENTANALYSIS + this.queryString, {}, 'GET', false, false, true)
      .subscribe(
        (res: any) => {
          let sentimentsData = res.sentimentPunchIns;
          sentimentsData.forEach((element) => {
            this.rows.forEach((item) => {
              if (element.mood == item.mood) {
                item.count = +element.total;
              }
            });
          });

          this.barChartData = {
            labels: [`${this.monthName ? this.monthName : ''} ${this.year}`],
            datasets: [
              {
                data: [this.rows[0].count],
                label: this.rows[0].mood.toUpperCase(),
                backgroundColor: Colors.getColors().NotPunch, //sad
                borderWidth: 1,
                borderColor: Colors.getColors().NotPunch, //
              },
              {
                data: [this.rows[1].count],
                label: this.rows[1].mood.toUpperCase(),
                backgroundColor: Colors.getColors().Present, //happy
                borderWidth: 1,
                borderColor: Colors.getColors().Present,
              },
              {
                data: [this.rows[2].count],
                label: this.rows[2].mood.toUpperCase(),
                backgroundColor: Colors.getColors().MissPunch, //stressed
                borderWidth: 1,
                borderColor: Colors.getColors().MissPunch,
              },
              {
                data: [this.rows[3].count],
                label: this.rows[3].mood.toUpperCase(),
                backgroundColor: Colors.getColors().Absent, //angry
                borderWidth: 1,
                borderColor: Colors.getColors().Absent, //
              },
              {
                data: [this.rows[4].count],
                label: this.rows[4].mood.toUpperCase(),
                backgroundColor: Colors.getColors().Holiday, //Not sure
                borderWidth: 1,
                borderColor: Colors.getColors().Holiday,
              },
              {
                data: [this.rows[5].count],
                label: this.rows[5].mood.toUpperCase(),
                backgroundColor: Colors.getColors().weekoff, //ok
                borderWidth: 1,
                borderColor: Colors.getColors().weekoff,
              },
            ],
          };
          this.initiateChart();
          this.display = true;
          this.showloader = 'false';
        },
        (err) => {
          console.log(err);
          return;
        },
      );
  }
}
