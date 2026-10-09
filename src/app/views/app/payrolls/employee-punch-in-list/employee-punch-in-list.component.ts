import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-employee-punch-in-list',
    templateUrl: './employee-punch-in-list.component.html',
    styleUrls: ['./employee-punch-in-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeePunchInListComponent implements OnInit {

  @ViewChild('lgModal') lgModal: ModalDirective;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Output('close') close = new EventEmitter<any>();

  @Input('branchId') branchId: any
  @Input('divisionId') divisionId: any
  @Input('departmentID') departmentID: any
  @Input('designationID') designationID: any
  @Input('workingAreaId') workingAreaId: any
  @Input('companyId') companyId: any
  @Input('type') type: any
  @Input('date') date: any
  @Input('reportHeading') reportHeading: any

  filterData = {
    page: 1,
    limit: 10,
    companyId: null,
    branchId: null,
    type: '',
    date: '',
    Export: false,
    departmentID: null,
    designationID: null,
    divisionId: null,
    workingAreaId: null,
  }

  page = {
    totalCount : null,
    offset: null
  }

  rows: any = []
  currentPage: number

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) { }

  ngOnInit(): void {
    this.getAllData().then(() => {
      if(!this.filterData.Export)
      this.lgModal.show();
    });
  }

  getAllData() {
    if(!this.filterData.Export)
    this.rows = []
    this.filterData.branchId = this.branchId;
    this.filterData.companyId = this.companyId;
    this.filterData.type = this.type;
    this.filterData.date = this.date;
    this.filterData.divisionId = this.divisionId;
    this.filterData.departmentID = this.departmentID;
    this.filterData.designationID = this.designationID;
    this.filterData.workingAreaId = this.workingAreaId;
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('getAll');
      this.api
      .callApi(this.constant.ATTENDANCEDASHBOARD, this.filterData, 'POST', true, true, true, this.filterData.Export)
      .subscribe((res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.downloadFileService.handleFileDownload(res, 'PunchInOutReport.xlsx', 'text/xlsx')
          this.filterData.Export = false;
          this.spinner.stop('getAll');
        } else {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            });
            resolve()
            this.spinner.stop('getAll');
          }
        }
      }, (error) => {
        this.commonNotificationService.handleError(error.error.message);
        reject()
        this.spinner.stop('getAll');
      });
    })
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  exportData(){
    this.filterData.Export = true;
    this.getAllData();
  }

  closeModal(){
    this.lgModal.hide();
    this.close.emit();
  }

}
