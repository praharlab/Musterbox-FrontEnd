import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-module-details',
    templateUrl: './module-details.component.html',
    styleUrls: ['./module-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ModuleDetailsComponent implements OnInit {
  @ViewChild('addimportmoduleDetails') addimportmoduleDetails: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal') modal: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'moduleDetailsID', prop: 'moduleDetailsID' },
    { name: 'moduleName', prop: 'moduleName' },
    { name: 'FAQs', prop: 'FAQs' },
    { name: 'Description', prop: 'Description' },
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
  permissioncreate: any = [1];
  permissionedit: any = [1];
  permissionview: any = [1];
  permissiondelete: any = [1];
  events: any;
  excelevents: any;
  body: any;
  usertype: number;
  // filter: string;
  // limit: number;
  ipAddress: any;
  myInputVariable: any;
  file: any;
  moduleId: any;
  allmodulename: any;
  limit = 10;
  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          '/app/superadminmenus/Module_details',
          '/app/superadminmenus/Module_details/edit_Module_details',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ModuleDetailsComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ModuleDetailsComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ModuleDetailsComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getModuleDetailsData();
    this.getIPAddress();
    this.getmodule();
  }

  getModuleDetailsData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETALLMODULEDETALS, this.filterData, 'POST', true, false, true)
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

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ModuleDetailsComponent', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getModuleDetailsData();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getModuleDetailsData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getModuleDetailsData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/Module_details/add_Module_details']);
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
          moduleDetailsID: id,
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEMODULEDETALS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getModuleDetailsData();
              this.spinner.stop('confirm');
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
          moduleDetailsID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.MODULEDETAILSSTATUS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getModuleDetailsData();
              this.spinner.stop('deactive');
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
          moduleDetailsID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.MODULEDETAILSSTATUS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getModuleDetailsData();
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

  downloadFile() {
    let data = [];
    const data2 = {
      page: '',
      limit: '',
    };

    this.api.callApi(this.constant.GETALLMODULEDETALS, data2, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.rows1 = res.data;
          this.temp = [...this.rows1];
          for (var i = 0; i < this.rows1.length; i++) {
            const data1 = {
              moduleName: this.rows1[i]['ModuleList.moduleName'],
              FAQs: this.rows1[i].FAQs,
              Description: this.rows1[i].Description,
              status: this.rows1[i].status,
              // moduleId: this.rows1[i].moduleId ? this.rows1[i].moduleId : null,
            };
            if (data1.status == 1) {
              data1.status = 'Active';
            } else {
              data1.status = 'Deactive';
            }
            data.push(data1);
          }

          const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
          const header = Object.keys(data[0]);
          let csv = data.map((row) =>
            header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
          );
          csv.unshift(header.join(','));
          let csvArray = csv.join('\r\n');

          var blob = new Blob([csvArray], { type: 'text/csv' });
          saveAs(blob, 'moduledetails.csv');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('active');
      },
    );
  }

  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
  }

  selectmodule(ev: any) {
    this.moduleId = ev;
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getmodule() {
    const body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLMODULE, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allmodulename = res.data;
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('active');
      },);
  }

  submit() {
    if (this.file && this.addimportmoduleDetails) {
      const formData = new FormData();
      formData.append('file', this.file);
      if (
        this.addimportmoduleDetails.controls['moduleDetailsID'] &&
        this.addimportmoduleDetails.controls['moduleDetailsID'].value
      ) {
        formData.append(
          'moduleDetailsID',
          this.addimportmoduleDetails.controls['moduleDetailsID'].value,
        );
      }

      formData.append('moduleId', this.addimportmoduleDetails.value.moduleId);
      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);

      this.spinner.start();

      this.api
        .callApi(this.constant.UPLOADMODULEDETAILSEXCEL, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.file = {};
              this.addimportmoduleDetails.resetForm();
              this.closeModal.nativeElement.click();

              setTimeout(() => {
                this.modal.hide();
                this.ngOnInit();
                this.spinner.stop();
              }, 3000);
            } else {
              this.handleError(res.message);

              this.file = {};
              this.addimportmoduleDetails.resetForm();
              this.closeModal.nativeElement.click();

              this.myInputVariable.nativeElement.value = '';
              this.spinner.stop();
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.file = {};
            this.addimportmoduleDetails.resetForm();
            this.closeModal.nativeElement.click();

            this.myInputVariable.nativeElement.value = '';
            this.spinner.stop();
          },
        );
    }
  }

  demo() {
    window.open('/assets/moduledetails.xlsx', '_blank');
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ModuleDetailsComponent',
      this.filterData,
      '/superadminmenus/Module_details/edit_Module_details',
      rowData.moduleDetailsID,
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
