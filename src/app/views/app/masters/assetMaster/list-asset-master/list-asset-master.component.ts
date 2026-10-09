import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-asset-master',
    templateUrl: './list-asset-master.component.html',
    styleUrls: ['./list-asset-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAssetMasterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'Asset Master ID', prop: 'assetMasterID' },
    { name: 'Asset Serial No', prop: 'assetSerialNo' },
    { name: 'Asset Name', prop: 'assetName' },
    { name: 'Asset Category', prop: 'assetCategoryID' },
    { name: 'Company ID', prop: 'companyMaster.companyName' },
    { name: 'Description', prop: 'description' },
    { name: 'Asset Document', prop: 'assetDocument' },
    { name: 'Purchase Date', prop: 'purchaseDate' },
    { name: 'Status', prop: 'status' },
  ];
  selected = [
    'Asset Master ID',
    'Asset Serial No',
    'Asset Name',
    'Asset Category',
    'Company Name',
    'Purchase Date',
    'Attachment',
    'Status',
    'Quantity'
  ];
  tabledata = [
    'Asset Master ID',
    'Asset Serial No',
    'Asset Name',
    'Quantity',
    'Asset Category',
    'Company Name',
    'PDF Download',
    'Description',
    'Purchase Date',
    'Attachment',
    'Status',
    'CreateBy',
    'CreateByIp',
    'CreatedAt',
    'updateBy',
    'UpdateByIp',
    'UpdatedAt',
  ];
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
    companyMasterID: [+localStorage.getItem('company_id')],
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  rows1: any = [];
  permissioncreate = [];
  http: any;
  usertype: any;
  company_id: any;
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  events: any;
  excelevents: any;
  limit: any;
  file: any;
  comp: any;
  adminRoot = environment.adminRoot;
  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/assetMaster',
          this.adminRoot + '/masters/assetMaster/edit_assetMaster',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListAssetMasterComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListAssetMasterComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListAssetMasterComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getcompany();
    this.getAssetMaster();
    this.checkpermission();
  }

  getAssetMaster() {
    this.spinner.start('oninit2');
    this.api
      .callApi(
        this.constant.GETASSETMASTERDATABYCOMPANY,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('oninit2');
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('oninit2');
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssetMaster' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssetMaster' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssetMaster' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssetMaster' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ListAssetMasterComponent', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAssetMaster();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAssetMaster();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAssetMaster();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  changeshowfields() {
    this.ngOnInit();
  }

  // view(att: any) {
  //   const fileURL = `${this.apiURL}uploads/asset/${att}`;

  //   // Open the file in a new browser tab/window
  //   window.open(fileURL, '_blank');
  // }

  view(att: any) {
    if (att) {
      const fileURL = `${this.apiURL}uploads/user/assets/${att}`;

      // Open the file in a new browser tab/window
      window.open(fileURL, '_blank');
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getAssetMaster();
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/assetMaster/add_assetMaster']);
  }

  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          assetMasterID: id,
        };

        this.spinner.start('confirm');

        this.api
          .callApi(this.constant.DELETEASSETMASTERDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.getAssetMaster();
                this.spinner.stop('confirm');
              } else {
                this.handleError(res.message);
                this.spinner.stop('confirm');
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          assetMasterID: id,
          status: 0,
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.VISITASSETMASTERTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.getAssetMaster();
                this.spinner.stop('deactive');
              } else {
                this.handleError(res.message);
                this.spinner.stop('deactive');
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('deactive');
            },
          );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          assetMasterID: id,
          status: 1,
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.VISITASSETMASTERTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getAssetMaster();
              this.spinner.stop('active');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('active');
            },
          );
      }
    });
  }

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListAssetMasterComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  downloadpdf(pdf: any) {
    const pdfUrl = this.apiURL + 'uploads/asset/' + pdf;
    const pdfName = 'Asset';
    saveAs(pdfUrl, pdfName);
  }

  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  //Export Csv
  downloadFile() {
    this.spinner.start('start');

    let mainbody: any = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      searchQuery: this.filterData.searchQuery,
      exportData: true,
    };
    this.api
      .callApi(this.constant.GETASSETMASTERDATABYCOMPANY, mainbody, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Asset.xlsx');
    this.spinner.stop('start');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListAssetMasterComponent',
      this.filterData,
      '/masters/assetMaster/edit_assetMaster',
      rowData.assetMasterID,
    );
  }
    importExcel() {
    this.router.navigate([this.adminRoot + '/masters/assetMaster/import_assetMaster/']);
  }
}
