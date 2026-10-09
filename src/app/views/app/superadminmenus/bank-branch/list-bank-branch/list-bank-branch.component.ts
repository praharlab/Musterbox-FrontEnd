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
import { NgForm } from '@angular/forms';
import * as xlsx from 'xlsx';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-list-bank-branch',
    templateUrl: './list-bank-branch.component.html',
    styleUrls: ['./list-bank-branch.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListBankBranchComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;

  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'bankMasterID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
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
    searchQuery: '',
    bankMasterID: null,
    status: null,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows1: any = [];
  permissioncreate = [1];
  allBank: any = [];

  limit = 10;
  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          '/app/superadminmenus/bankBranch',
          '/app/superadminmenus/bankBranch/edit_bankBranch',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListBankBranchComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListBankBranchComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
        bankMasterID: null,
        status: null
      };
    } else {
      this.filterData = this.formValue.ListBankBranchComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getBankData();
    this.getBankBranchData()
  }

  onSubmit() {
    this.filterData.page = 1;
    this.filterData.limit = 10;
    this.filterData.searchQuery = '';
    this.filterData.status = this.datefilter.value.status
    this.filterData.bankMasterID = this.datefilter.value.bankMasterID
    this.getBankBranchData();
  }

  getBankBranchData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.LISTBANKBRANCH, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop();
        }
      });
  }

  getBankData() {
    const filterData = {
      page: '',
      limit: '',
      searchQuery: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETBANKDATA, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allBank = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop();
        }
      });
  }

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.rows = [];
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ListBankBranchComponent', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getBankBranchData();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getBankBranchData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getBankBranchData();
    } else {
      this.handleError('Something Went Wrong!');
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

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/bankBranch/add_bankBranch']);
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
          bankBranchID: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEBANKBRANCH, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getBankBranchData();
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
          bankBranchID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api.callApi(this.constant.STATUSCHNAGEBANKBRANCH, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getBankBranchData();
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
          bankBranchID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.STATUSCHNAGEBANKBRANCH, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.getBankBranchData();
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

 
  download() {
    const body = {
      page: '',
      limit: '',
      exportData: true,
      bankMasterID: this.datefilter.value.bankMasterID,
      status: this.datefilter.value.status,
    };

    this.spinner.start('start');
    this.api
      .callApi(this.constant.LISTBANKBRANCH, body, 'POST', true, false, true, true)
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
    saveAs(blob, 'Bank-Branch.xlsx');
    this.spinner.stop('start');
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListBankBranchComponent',
      this.filterData,
      '/superadminmenus/bankBranch/edit_bankBranch',
      rowData.bankBranchID,
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
