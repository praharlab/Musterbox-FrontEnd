import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { ChartService } from 'src/app/components/charts/chart.service';
import { doughnutChartData } from 'src/app/data/charts';
import { Colors } from 'src/app/constants/colors.service';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-employee-status-graph',
    templateUrl: './employee-status-graph.component.html',
    styleUrls: ['./employee-status-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeStatusGraphComponent implements OnInit {
  @Input() chartClass = 'dashboard-bar-chart';
  @Input() class = 'chart-container';
  @ViewChild('chart', { static: true }) chartRef: ElementRef;
  @ViewChild('companyFilter') companyFilter: NgForm;

  adminRoot = environment.adminRoot;
  chartDataConfig: ChartService;
  doughnutChartData = doughnutChartData;
  chart: Chart;
  showloader: any = 'true';
  shadow = true;
  display = false;
  company_id: string;
  company: any;
  employeeStatusData: any;
  rows: any;
  defaultValue: {
    cName: any;
  };
  getid: any;

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
    this.defaultValue = {
      cName: Number(this.company_id),
    };
    
    // this.getcompany();
    this.onInitData(this.company_id);
  }

  onInitData(id) {
    this.getid = id    
    this.showloader = 'true';
    this.api
      .callApi(this.constant.DASHBOARDEMPSTATUS + id, {}, 'GET', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          // this.showloader = 'false'
          this.rows = res.data;
          this.doughnutChartData = {
            labels: [
              `Active ${this.rows[0].total_active}`,
              `Deactive ${this.rows[0].total_deactive}`,
              `Left ${this.rows[0].total_left_employee}`,
            ],
            datasets: [
              {
                label: '',
                borderColor: [
                  Colors.getColors().Active,
                  Colors.getColors().DeActive,
                  Colors.getColors().Left,
                ],
                backgroundColor: [
                  Colors.getColors().Active,
                  Colors.getColors().DeActive,
                  Colors.getColors().Left,
                ],
                borderWidth: 2,
                data: [
                  this.rows[0].total_active,
                  this.rows[0].total_deactive,
                  this.rows[0].total_left_employee,
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
      options: this.chartDataConfig._doughnutChartOptions,
      plugins: [this.chartService.centerTextPlugin],
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  
  navigateToEmployeeData(): void {
    this.formValueStorageService.navigate(
      'EmployeeStatusComponent',
      this.getid,
      '/payrolls/employee_status',
      this.getid,
    );
  }
}
