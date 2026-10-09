import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-ai-biometric',
    templateUrl: './ai-biometric.component.html',
    styleUrls: ['./ai-biometric.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AiBiometricComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'aiBiometricID' },
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
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows1: any = [];
  permissioncreate = [1];

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
          '/app/superadminmenus/ai_biometric',
          '/app/superadminmenus/ai_biometric/edit_ai_biometric',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('AiBiometricComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('AiBiometricComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.AiBiometricComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getBankData();
  }

  getBankData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETAIBIOMETRIC, this.filterData, 'POST', true, false, true)
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

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('AiBiometricComponent', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getBankData();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getBankData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getBankData();
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
    this.router.navigate([this.adminRoot + '/superadminmenus/ai_biometric/add_ai_biometric']);
  }

  // alertConfirmation(id: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You will not be able to recover!',
  //     icon: 'error',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, keep it',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const body = {
  //         bankMasterID: id,
  //       };
  //       this.spinner.start('confirm');
  //       this.api.callApi(this.constant.DELETEBANK, body, 'POST', true, true, true).subscribe(
  //         (res: any) => {
  //           if (res.status == 200) {
  //             this.getBankData();
  //             this.spinner.stop('confirm');
  //           } else {
  //             this.handleError(res.message);
  //             this.spinner.stop('confirm');
  //           }
  //         },
  //         (err) => {
  //           this.handleError(err.error.message);
  //           this.spinner.stop('confirm');
  //         },
  //       );
  //     }
  //   });
  // }
  // alertDeactiveConfirmation(id: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'User will deactive!',
  //     icon: 'error',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, deactive it!',
  //     cancelButtonText: 'No, keep it',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const body = {
  //         bankMasterID: id,
  //         status: '0',
  //       };
  //       this.spinner.start('deactive');
  //       this.api.callApi(this.constant.BANKSTATUSCHANGES, body, 'POST', true, true, true).subscribe(
  //         (res: any) => {
  //           if (res.status == 200) {
  //             this.getBankData();
  //             this.spinner.stop('deactive');
  //           } else {
  //             this.handleError(res.message);
  //             this.spinner.stop('deactive');
  //           }
  //         },
  //         (err) => {
  //           this.handleError(err.error.message);
  //           this.spinner.stop('deactive');
  //         },
  //       );
  //     }
  //   });
  // }

  // alertActiveConfirmation(id: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'User will active!',
  //     icon: 'success',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, active it!',
  //     cancelButtonText: 'No, keep it',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const body = {
  //         bankMasterID: id,
  //         status: '1',
  //       };
  //       this.spinner.start('active');
  //       this.api.callApi(this.constant.BANKSTATUSCHANGES, body, 'POST', true, true, true).subscribe(
  //         (res: any) => {
  //           this.getBankData();
  //           this.spinner.stop('active');
  //         },
  //         (err) => {
  //           this.handleError(err.error.message);
  //           this.spinner.stop('active');
  //         },
  //       );
  //     }
  //   });
  // }

  // downloadFile1() {
  //   let data = [];
  //   const data2 = {
  //     page: '',
  //     limit: '',
  //   };
  //   this.spinner.start('download');
  //   this.api.callApi(this.constant.GETBANKDATA, data2, 'POST', true, false, true).subscribe(
  //     (res: any) => {
  //       if (res.status == 200) {
  //         this.rows1 = res.data;

  //         this.temp = [...this.rows1];

  //         for (var i = 0; i < this.rows1.length; i++) {
  //           const data1 = {
  //             bnkId: this.rows1[i].aiBiometricID,
  //             bankName: this.rows1[i].bankName,
  //             status: this.rows1[i].status,
  //             createdAt: this.rows1[i].createdAt,
  //             updatedAt: this.rows1[i].updatedAt,
  //           };
  //           if (data1.status == 1) {
  //             data1.status = 'Active';
  //           } else {
  //             data1.status = 'Deactive';
  //           }
  //           data.push(data1);
  //         }

  //         const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
  //         const header = Object.keys(data[0]);
  //         let csv = data.map((row) =>
  //           header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
  //         );
  //         csv.unshift(header.join(','));
  //         let csvArray = csv.join('\r\n');

  //         var blob = new Blob([csvArray], { type: 'text/csv' });
  //         saveAs(blob, 'bank.csv');
  //         this.spinner.stop('download');
  //       } else {
  //         this.handleError(res.message);
  //         this.spinner.stop('download');
  //       }
  //     },
  //     (err) => {
  //       this.handleError(err.error.message);
  //       this.spinner.stop('download');
  //     },
  //   );
  // }




  downloadFile() {
   const filterData1 = {
      page: 1,
      limit: 10,
      searchQuery: '',
      Export:true,
    };
    this.spinner.start('download');

    this.api
      .callApi(this.constant.GETAIBIOMETRIC, filterData1, 'POST', true, false, true,true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }


  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Ai Biometric.xlsx');
    this.spinner.stop('download');
  }


  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'AiBiometricComponent',
      this.filterData,
      '/superadminmenus/ai_biometric/edit_ai_biometric',
      rowData.aiBiometricID,
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
