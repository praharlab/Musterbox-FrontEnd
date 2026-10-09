import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-income-tax-declaration-request',
    templateUrl: './income-tax-declaration-request.component.html',
    styleUrls: ['./income-tax-declaration-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class IncomeTaxDeclarationRequestComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('acceptreject') acceptreject: NgForm;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('acceptrejecthra') acceptrejecthra: NgForm;
  @ViewChild('closeModal3') closeModal3: ElementRef;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  scrollBarHorizontal: boolean;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  adminRoot = environment.adminRoot;
  limit = 10;
  permissionview: any = [];
  permissioncreate: any = []
  permissionedit: any = []
  permissiondelete: any = []

  filterData = {
    companyMasterID: '',
    branchMasterID: '',
    userMasterID: [],
    financialYear: '',
    authStatus: "0",
    Export: '',
    searchQuery: '',
    page: 1,
    limit: 10,
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  rows: any = [];

  financialYears: any = [];

  rowdata: any;
  modelType: any;
  employeeDeclarationID: any;
  apiURL = environment.apiUrl;
  remarksdata: string;
  hra: any = [];
  Curr_component: string;
  hraData: any;
  hraDeclarationId: any;
  modelTypeHRA: string;
  remarksdatahra: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.limit = 10
    this.remarksdata = ''
    this.remarksdatahra = ''

    this.filterData = {
      companyMasterID: null,
      branchMasterID: '',
      userMasterID: [],
      financialYear: '',
      authStatus: "0",
      Export: '',
      searchQuery: '',
      page: 1,
      limit: 10,
    };

    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getFinancialYears();
    this.checkpermission();
  }

  loadComponent(component) {
    if (component) this.Curr_component = component;

    if (component == 'Other') this.getlistdata();

    if (component == 'HRA') this.getHRAdata();

  }


  getFinancialYears() {

    this.spinner.start('financialyear');
    this.api.callApi(this.constant.GETFINANCIALYEARS, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.financialYears = res.data

        } else {
          this.handleError('Something Went Wrong!');

        }
        this.spinner.stop('financialyear');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('financialyear');
      },
    );

  }


  getlistdata() {

    this.spinner.start('start')

    this.api
      .callApi(this.constant.GETEMPLOYEEDECLARATIONLIST, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
          }

          this.spinner.stop('start');
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('start');
        },
      );

  }

  getHRAdata() {
    this.spinner.start('start')

    this.api
      .callApi(this.constant.GETLISTEMPLOYEEDATAOFRENTEDRESIDENCE, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.hra = res.data;
            this.page.totalCount = res.totalcount;
          }

          this.spinner.stop('start');
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('start');
        },
      );
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
              permissionval.formName == 'IncometaxDeclarationRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit1(val?: any) {
    this.filterData.page = 1
    this.filterData.companyMasterID = val?.company
    this.filterData.branchMasterID = val?.branch
    this.filterData.userMasterID = val?.user
    this.filterData.financialYear = val?.financialYear
    this.filterData.authStatus = ''

    if (this.Curr_component == 'Other') this.getlistdata();
    if (this.Curr_component == 'HRA') this.getHRAdata();

  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    if (this.Curr_component == 'Other') this.getlistdata();
    if (this.Curr_component == 'HRA') this.getHRAdata();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.limit = this.filterData.limit
    if (this.Curr_component == 'Other') this.getlistdata();
    if (this.Curr_component == 'HRA') this.getHRAdata();
  }


  updateFilter(event) {
    this.filterData.searchQuery = event.target.value.toLowerCase().trim();
    if (this.Curr_component == 'Other') this.getlistdata();
    if (this.Curr_component == 'HRA') this.getHRAdata();
  }


  clear() {
    this.hra = [];
    this.rows = [];
    this.filterData = {
      companyMasterID: '',
      branchMasterID: '',
      userMasterID: [],
      financialYear: '',
      authStatus: "0",
      Export: '',
      searchQuery: '',
      page: 1,
      limit: 10,
    };
  }

  showdata(row) {
    this.rowdata = row
  }

  showdataHRA(row) {
    this.hraData = row
  }

  acceptReject(row: any, type: string) {
    this.employeeDeclarationID = row.employeeDeclarationID
    this.modelType = type

  }

  acceptRejectHRA(row: any, type: string) {
    this.hraDeclarationId = row.id
    this.modelTypeHRA = type
  }

  submitHRA() {
    const body = {
      id: this.hraDeclarationId,
      acceptRejectRemark: this.acceptrejecthra.value.remarks,
      authStatus: this.modelTypeHRA == 'Accept' ? 1 : 2
    }
    this.spinner.start('acceptreject')

    this.api
      .callApi(this.constant.ACCEPTREJECTEMPLOYEEDATAOFRENTEDRESIDENCE, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.showNotification(res.message);
            this.acceptrejecthra.value.remarks = null
            this.closeModal3.nativeElement.click();
            this.remarksdatahra = ''
            this.getHRAdata();
          } else {
            this.handleError(res.message);
          }

          this.spinner.stop('acceptreject');
        },
        (err) => {
          this.handleError(err.error.message || 'Someting Went Wrong!');
          this.spinner.stop('acceptreject');
        },
      );
  }

  onSubmit() {

    const body = {
      employeeDeclarationID: this.employeeDeclarationID,
      acceptRejectRemark: this.acceptreject.value.remarks,
      authStatus: this.modelType == 'Accept' ? 1 : 2
    }
    this.spinner.start('acceptreject')

    this.api
      .callApi(this.constant.ACCEPTREJECTEMPLOYEEDECLARATION, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.showNotification(res.message);
            this.acceptreject.value.remarks = null
            this.closeModal1.nativeElement.click();
            this.remarksdata = ''
            this.getlistdata();
          } else {
            this.handleError(res.message);
          }

          this.spinner.stop('acceptreject');
        },
        (err) => {
          this.handleError(err.error.message || 'Someting Went Wrong!');
          this.spinner.stop('acceptreject');
        },
      );
  }

  // download() {

  //   this.spinner.start('a');
  //   this.api
  //     .callApi(
  //       this.constant.GETEMPLOYEETAXREGIMELIST + this.query + `&Export=true`,
  //       {},
  //       'GET',
  //       true,
  //       true,
  //       true,
  //       true,
  //     )
  //     .subscribe(
  //       (res: any) => {
  //         if (res.type == 'application/json') {
  //           this.notifications.create('No data found to export!', '', NotificationType.Error, {
  //             theClass: 'outline primary',
  //             timeOut: 3000,
  //             showProgressBar: false,
  //           });
  //           this.spinner.stop('a');
  //         } else {
  //           var blob = new Blob([res], { type: 'text/xlsx' });
  //           // saveAs(blob, `Employee Tax Regime.xlsx`);

  //           this.spinner.stop('a');
  //         }
  //       },
  //       (err) => {
  //         this.notifications.create(
  //           '',
  //           err.error.message || 'Someting Went Wrong!',
  //           NotificationType.Bare,
  //           {
  //             theClass: 'outline primary',
  //             timeOut: 3000,
  //             showProgressBar: false,
  //           },
  //         );
  //         this.spinner.stop('a');
  //       },
  //     );

  // }

  view(item: any) {
    window.open(this.apiURL + 'uploads/employee-declaration-attachments/' + item, '_blank');
  }

  view1(item: any) {
    window.open(this.apiURL + 'uploads/hra-proof/' + item, '_blank');
  }

  private showNotification(message: string) {
    this.notifications.create('Done', message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  getCompany(companyMasterID: string){
    setTimeout(() => {
      this.filterData.companyMasterID = companyMasterID;
      this.loadComponent('Other')
    });
  }

}
