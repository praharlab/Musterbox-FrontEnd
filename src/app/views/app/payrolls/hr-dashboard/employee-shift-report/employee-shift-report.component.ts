import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { saveAs } from 'file-saver';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CommonFilterComponent } from '../../../common-filter/common-filter.component';
import moment from 'moment';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-employee-shift-report',
    templateUrl: './employee-shift-report.component.html',
    styleUrls: ['./employee-shift-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeShiftReportComponent implements OnInit {

  
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  filterConfig = {
    page: 1,
    limit: 10,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  rows = [];
  dateArray = [];
  defaultFromDate = moment().startOf('month').format('YYYY-MM-DD');
  defaultEndDate = moment().endOf('month').format('YYYY-MM-DD');

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('commonFilter') commonFilter: CommonFilterComponent;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit(): void {
  }


  private getEmployeeShitReport(exportData: boolean = false) {
    const requestBody = {
      ...this.commonFilter.filterForm.value,
      exportData,
      ...this.filterConfig
    }
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.GETEMPLOYEESHIFTREPORT, requestBody, 'POST', false, false, true, exportData)
      .subscribe(
        (res: any) => {
          if (exportData) {
            this.handleFileDownload(res);
          } else {
            this.rows = res.data?.rows || [];
            if (this.rows.length) {
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Excel];
            } else {
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            this.page.totalCount = res.data?.count || 0;
            this.dateArray = res.data?.datesArray || [];
          }
          this.spinner.stop('submit');
        },
        (err) => {
          this.handleError(err);
        });
  }

  onSubmit(formValue: any) {
    this.filterConfig.page = 1;
  
    this.getEmployeeShitReport();
  }

  onClear() {
    setTimeout(() => {
      this.rows = [];
      this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
      this.filterConfig = {
        page: 1,
        limit: 10
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }

  onExport() {
    if(this.commonFilter.filterForm.valid) {
      this.getEmployeeShitReport(true);
    }
  }

  onPageChange(e: any) {
    if (e) {
      this.filterConfig.page = e.offset + 1;
      this.getEmployeeShitReport();
    } else {
      this.filterConfig.page = 1;
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterConfig.limit = ev;
      this.getEmployeeShitReport();
    } else {
      this.filterConfig.page = 1;
    }
  }


  private handleFileDownload(res: any) {
    const blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Employee Shift Report.xlsx');
    this.spinner.stop('main');
  }

  private handleError(err: any) {
    this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
    this.spinner.stop('submit');
  }
}
