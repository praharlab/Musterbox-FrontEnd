import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as converter from 'number-to-words';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-pf-report',
    templateUrl: './pf-report.component.html',
    styleUrls: ['./pf-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PfReportComponent implements OnInit {
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
    companyMasterID: localStorage.getItem('company_id'),
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: localStorage.getItem('company_id'),
    exportPdf: false,
  };
  // body1 = {
  //   page: 1,
  //   limit: 10,
  //   fromdate: '2021-01-11',
  //   todate: '2022-11-11',
  //   department: '28',
  //   company: '4',
  //   user: '13',
  // };

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
  employee: any;
  image: any;
  enddate: Date;
  comp: any;
  alldesignation: any;
  finaldata: boolean = false;
  finalPFDATA: any;
  //
  companyname: any = '';
  companyid: any;
  companyaddress: any = '';
  totalWord: any;

  pfAmount: any; //main
  admnac2: number = 0;
  empac10: number = 0;
  empac1: number = 0;
  empactotal: number = 0;
  empshareac1: number = 0;

  ac1total: number = 0;
  NoEmp: any; //Static
  monthName: any;
  pfno: any; //Static
  total: number = 0;
  codeNo: void;
  totalwagesdue: Number = 0;
  pfReoprtData: string;
  allbranch: any[] =[];
selectedBranch: any;

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
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
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
              permissionval.formName == 'PFChallan' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('permission');
        }
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
      let body2 = {
        companyMasterID: this.companyid,
        branchMasterID:this.selectedBranch,
        YYYYMM: this.datefilter.value.fromdate.replace('-', ''),
        exportPdf: true,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.PfReport, body2, 'POST', true, false, true)
        .subscribe((res: any) => {
          this.pfReoprtData = 'data:application/pdf;base64,' + res.data;
          this.spinner.stop();
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
    link.download = `${fileName}-${this.datefilter.value.fromdate}.pdf`;
    link.click();
  }
  onClickDownloadPdf() {
    let base64String = this.pfReoprtData;
    this.downloadPdf(base64String, 'PF-CHALLAN');
  }
}
