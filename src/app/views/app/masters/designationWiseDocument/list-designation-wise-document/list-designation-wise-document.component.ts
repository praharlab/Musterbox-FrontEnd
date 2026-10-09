import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as xlsx from 'xlsx';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-designation-wise-document',
    templateUrl: './list-designation-wise-document.component.html',
    styleUrls: ['./list-designation-wise-document.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListDesignationWiseDocumentComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('lgModal') modal: any;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;

  rows: any = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'Company Name', prop: 'companyName' },
    { name: 'Company City', prop: 'subCompanyRequired' },
    { name: 'Company Email', prop: 'companyEmail' },
    { name: 'Status', prop: 'status' },
    { name: 'Company ID', prop: 'companyMaster.companyName' },
  ];
  ColumnMode = ColumnMode;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    searchQuery: '',
    exportData: false,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  rows1: any = [];
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  company: any;
  addcomp: any;
  comp: any;
  countryName1: any;
  stateName1: any;
  filter: string;
  adminRoot = environment.adminRoot;

  limit = 10;
  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/designationWiseDocument',
          this.adminRoot + '/masters/designationWiseDocument/edit_designationWiseDocument',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListDesignationWiseDocumentComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListDesignationWiseDocumentComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: +localStorage.getItem('company_id'),
        searchQuery: '',
        exportData: false,
      };
    } else {
      this.filterData = this.formValue.ListDesignationWiseDocumentComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getIPAddress();
    this.checkpermission();
    this.getcompany();
    this.getDocumentData();
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
              permissionval.formName == 'DesignationWiseDocument' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DesignationWiseDocument' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DesignationWiseDocument' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DesignationWiseDocument' && permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getDocumentData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getDocumentData();
    }
  }

  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.rows.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getDocumentData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getDocumentData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/designationWiseDocument/add_designationWiseDocument']);
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
          designationId: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEDESIGNATIONWISEDOCUMENT, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getDocumentData();
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

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.companyName;
    this.getDocumentData();
  }

  getDocumentData() {
    let queryString = `?companyMasterID=${this.filterData.companyMasterID}&page=${this.filterData.page}&pageSize=${this.filterData.limit}`;
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETALLDESIGNATIONWISEDOCUMENT + queryString, {}, 'GET', true, false, true)
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
            this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
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


  downloadFilteredData() {
    this.spinner.start('start');
    this.filterData.exportData = true
    this.api
      .callApi(
        this.constant.GETALLDESIGNATIONWISEDOCUMENT,
        this.filterData,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Joining Document Master.xlsx');
    this.filterData.exportData = false
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
      'ListDesignationWiseDocumentComponent',
      this.filterData,
      '/masters/designationWiseDocument/edit_designationWiseDocument',
      rowData.designationId,
    );
  }

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListDesignationWiseDocumentComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
  importExcel() {
    this.router.navigate([this.adminRoot + '/masters/designationWiseDocument/import_designationWiseDocument']);
  }
}
