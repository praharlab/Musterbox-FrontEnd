import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as converter from 'number-to-words';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-esic-challan',
    templateUrl: './esic-challan.component.html',
    styleUrls: ['./esic-challan.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EsicChallanComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    id: localStorage.getItem('company_id'),
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    id: localStorage.getItem('company_id'),
  };
  body1 = {
    page: 1,
    limit: 10,
    fromdate: '2021-01-11',
    todate: '2022-11-11',
    department: '28',
    company: '4',
    user: '13',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  alldepartment: any;
  company1: any;
  employee: number = 0;
  image: any;
  enddate: Date;
  comp: any;
  alldesignation: any;
  finaldata: boolean = false;

  //
  companyname: any = '';
  companyid: any;
  companyaddress: any = '';
  totalWord: any;

  pfAmount: any; //main
  admnac2: any;
  empac10: any;
  empac1: any;
  empactotal: any;
  empshareac1: any;

  ac1total: any;
  NoEmp: any; //Static
  monthName: any;
  pfno: any; //Static
  total: any;
  codeNo: void;
  employers: number = 0;
  totalRupees: number = 0;
  amount: number = 0;
  NoEmployee: number;
  rupeesINWord: string;
  MonthName: string;
  finalData: any;
  esicChallanData: string;
  allbranch: any[] =[];
selectedBranch: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission()
    this.getcompany();
  }

  checkpermission() {
    this.spinner.start('permission');
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
              permissionval.formName == 'ESICChallan' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  public SavePDF(): void {
    var data = document.getElementById('content');
    html2canvas(data, { scale: 2 }).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 90;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var height = 225;
      var width = 360;

      const contentDataURL = canvas.toDataURL('image/jpeg', 1.0);
      let pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'A3',
      });
      pdf.addImage(contentDataURL, 'PNG', 30, 30, width, height, '', 'SLOW');
      pdf.save('ESICChallan' + this.datefilter.value.fromdate + '.pdf'); // Generated PDF
    });
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.companyaddress = this.spinner.stop();
        }
      });
  }

  selectcompany(id:any){
    this.selectedBranch= '';
    this.allbranch = [];

    if(!id) return

    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('branch');
      });
  }

  onSubmit() {
    if (this.datefilter.valid) {
      this.companyid = this.datefilter.value.company;
      this.codeNo = this.datefilter.value.codeno;

      const date = new Date();
      date.setMonth(this.datefilter.value.fromdate.slice(5, 7) - 1);

      this.MonthName =
        date.toLocaleString('en-US', {
          month: 'short',
        }) +
        ' ' +
        this.datefilter.value.fromdate.slice(5, 7);

      this.spinner.start();

      let body2 = {
        companyMasterID: this.companyid,
        branchMasterID:this.selectedBranch,
        YYYYMM: this.datefilter.value.fromdate.replace('-', ''),
        page: '',
        limit: '',
        exportChallan: true,
      };

      this.api
        .callApi(this.constant.GETESIC1, body2, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.esicChallanData = 'data:application/pdf;base64,' + res.data;
            this.spinner.stop();
          } else {
            this.handleError(res.message);
            this.spinner.stop();
          }
        }, (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        });

      this.finaldata = true;
    }
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  clear() {
    window.location.reload();
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }
  onClickDownloadPdf() {
    let base64String = this.esicChallanData;
    this.downloadPdf(base64String, 'ESIC-Challan');
  }
}
