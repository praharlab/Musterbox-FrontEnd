
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-salary-summary',
    templateUrl: './salary-summary.component.html',
    styleUrls: ['./salary-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SalarySummaryComponent implements OnInit {

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  @ViewChild(DatatableComponent) table: DatatableComponent;

  itemOptionsPerPage = ItemOptionsPerPageArray;

  permissionview: any = []
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: null,
    fromMonth: '',
    toMonth: '',
    Export: false
  };

  rows: any = []
  page = {
    totalCount: 0,
    offset: 0,
  };
  resultColumns: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private downloadFileService: DownloadFileService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SalarySummary' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  onSubmit(val: any) {
    this.resultColumns = [];
    if (!val) return;
    this.filterData.page = 1;

    this.filterData.fromMonth = val.frommonth.replace('-', '');
    this.filterData.toMonth = val.tomonth.replace('-', '');
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.Export = false
    this.getSalarySummaryData();
  }

  getSalarySummaryData() {
    this.spinner.start('get');
    this.api
      .callApi(this.constant.SALARYSUMMARYREPORT, this.filterData, 'POST', true, false, true, this.filterData.Export)
      .subscribe((res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.filterData.Export = false;
          this.downloadFileService.handleFileDownload(res, 'Salary Summary Report.xlsx', 'text/xlsx');
         
        } else {
          if (res.status == 200) {
            this.rows = res.data;
            if (this.rows.length > 0) {

              for (var key in this.rows[0]) {
                this.resultColumns.push({
                  name: key,
                  prop: key,
                  flexGrow: 1.2,
                  minWidth: 200,
                });
              }


              this.showButtons.push(CommonFilterButtonFields.Excel)
            } else {
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            this.page.totalCount = res.totalcount;
           
          }
        }
        this.spinner.stop('get');

      });
  }

  export() {
    this.filterData.Export = true
    this.getSalarySummaryData();
  }

  clear() {
    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: null,
      fromMonth: '',
      toMonth: '',
      Export: false
    };

    this.rows = [];
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getSalarySummaryData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getSalarySummaryData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
