import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-esic-report',
    templateUrl: './esic-report.component.html',
    styleUrls: ['./esic-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EsicReportComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  selected: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    YYYYMM: '',
    companyMasterID: '',
    page: 1,
    limit: 10,
    branchMasterID: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissionview: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  alldepartment: any;
  company1: any;
  designation1: any;
  image: any;
  target: any;
  resultColumns: any[];
  childcompany: string;
  cid: string;
  selected1: any = [];
  companydata: any;
  users: any = [];
  data1: any = [];
  allbranch: any;
  MonthName: string;
  currentPage: number;
  pdfData: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
  }
  getBranch(id) {
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA2 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allbranch = res.data;

          this.spinner.stop();
        }
      });
  }
  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop();
        }
      });
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
              permissionval.formName == 'ESICReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.MonthName = '';
    const date = new Date();
    date.setMonth(Number(this.datefilter.value.YearMM.slice(5, 7)) - 1);

    this.MonthName =
      date.toLocaleString('en-US', {
        month: 'short',
      }) +
      ' ' +
      this.datefilter.value.YearMM.slice(0, 4);

    this.filterData.YYYYMM = this.datefilter.value.YearMM.replace('-', '');
    this.filterData.companyMasterID = this.datefilter.value.company;
    this.filterData.branchMasterID = this.datefilter.value.branch;

    this.spinner.start();
    this.api
      .callApi(this.constant.GETESIC1, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.resultColumns = [];

          for (var key in this.rows[0]) {
            this.resultColumns.push({
              name: key,
              prop: key,
              flexGrow: 1.2,
              minWidth: 200,
            });
          }
          this.spinner.stop();
        }
      });
  }

  onSubmitClick() {
    setTimeout(() => {
      this.filterData.page = 1;
    }, 100);
    this.onSubmit();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.onSubmit();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    // this.limit = this.filterData.limit
    this.onSubmit();
  }
  selectcompany(id1: any) {
    let companyId = id1;
    this.getBranch(companyId);

    const filterData = {
      page: '',
      limit: '',
      companyMasterID: id1,
    };
    // this.spinner.start()
    // this.api.callApi(
    //   this.constant.GETALLUSERS,
    //   filterData,
    //   "POST",
    //   true,
    //   false,
    //   true
    // ).subscribe((res: any) => {

    //   if (res.status == 200) {
    //     this.users=res.data;
    //     this.selectAllForDropdownItems(this.users)
    //       this.users.forEach(async (rating) => {
    //         this.data1.push(rating.userMasterID)
    //       });
    //     this.spinner.stop()
    //   }
    // } )
  }

  clear() {
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.resultColumns = [];
      this.filterData = {
        YYYYMM: '',
        companyMasterID: '',
        page: 1,
        limit: 10,
        branchMasterID: '',
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }

  download() {
    let body = {
      companyMasterID: this.datefilter.value.company,
      YYYYMM: this.datefilter.value.YearMM.replace('-', ''),
      branchMasterID: this.datefilter.value.branch,
      page: '',
      limit: '',
      exportData: true,
    };

    this.spinner.start('start');
    this.api.callApi(this.constant.GETESIC1, body, 'POST', true, false, true, true).subscribe(
      (res: any) => this.handleFileDownload(res),
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'ESIC Report.xlsx');
    this.spinner.stop('start');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }


  exportPdf() {
    let body = {
      companyMasterID: this.datefilter.value.company,
      YYYYMM: this.datefilter.value.YearMM.replace('-', ''),
      branchMasterID: this.datefilter.value.branch,
      page: '',
      limit: '',
      exportPdf: true,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.GETESIC1, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.pdfData = 'data:application/pdf;base64,' + res.data;
        this.onClickDownloadPdf();
      });
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}${this.datefilter.value.YearMM}.pdf`;
    link.click();
  }
  onClickDownloadPdf() {
    let base64String = this.pdfData;
    this.downloadPdf(base64String, 'ESIC-REPORT-');
  }
}
