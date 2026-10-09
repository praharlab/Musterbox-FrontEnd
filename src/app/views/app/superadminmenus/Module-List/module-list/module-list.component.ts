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
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-module-list',
    templateUrl: './module-list.component.html',
    styleUrls: ['./module-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ModuleListComponent implements OnInit {
  [x: string]: any;

  @ViewChild('addimportmodule') addimportmodule: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal') modal: any;
  adminRoot = environment.adminRoot;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'moduleId', prop: 'moduleId' },
    { name: 'moduleName', prop: 'moduleName' },
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
    // company_id:localStorage.getItem('company_id')
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
  // filter: string;
  body: any;
  events: any;
  file: any;
  ipAddress: any;

  limit = 10;
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
          '/app/superadminmenus/Module_list',
          '/app/superadminmenus/Module_list/edit_Module_list',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ModuleListComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ModuleListComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ModuleListComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getAllModule();
  }

  getAllModule() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETALLMODULE, this.filterData, 'POST', true, false, true)
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

  // checkpermission() {
  //   let permission = JSON.parse(localStorage.getItem('permission'));


  //   this.permissioncreate = permission.filter((permissionval) => {
  //     return (
  //       permissionval.formMaster.formName == 'Module-List' &&
  //       permissionval.operation.operationName == "Create"
  //     )
  //   });


  //   this.permissionedit = permission.filter((permissionval) => {
  //     return (
  //       permissionval.formMaster.formName == 'Module-List' &&
  //       permissionval.operation.operationName == 'Edit'
  //     )
  //   })
  //   this.permissionview = permission.filter((permissionval) => {
  //     return (
  //       permissionval.formMaster.formName == 'Module-List' &&
  //       permissionval.operation.operationName == 'View'
  //     )
  //   })
  //   this.permissiondelete = permission.filter((permissionval) => {
  //     return (
  //       permissionval.formMaster.formName == 'Module-List' &&
  //       permissionval.operation.operationName == 'Delete'
  //     )
  //   })
  // }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ModuleListComponent', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAllModule();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllModule();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAllModule();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/Module_list/add_Module_list']);
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
          moduleId: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEMODULE, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.getAllModule();
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
          moduleId: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api.callApi(this.constant.MODULESTATUS, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.getAllModule();
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
          moduleId: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.MODULESTATUS, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.getAllModule();
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

  //Export Csv
  downloadFile() {
    let data = [];
    const data2 = {
      page: '',
      limit: '',
    };

    this.api
      .callApi(this.constant.GETALLMODULE, data2, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows1 = res.data;
          this.temp = [...this.rows1];
          for (var i = 0; i < this.rows1.length; i++) {
            const data1 = {
              moduleName: this.rows1[i].moduleName,
              status: this.rows1[i].status,
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
          saveAs(blob, 'module.csv');
        }
      });
  }
  // import Expense
  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
  }

  submit() {
    if (this.file && this.addimportmodule) {
      const formData = new FormData();
      formData.append('file', this.file);
      if (
        this.addimportmodule.controls['moduleId'] &&
        this.addimportmodule.controls['moduleId'].value
      ) {
        formData.append('moduleId', this.addimportmodule.controls['moduleId'].value);
      }

      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);

      this.spinner.start();

      this.api
        .callApi(this.constant.UPLOADMODULEEXCELDATA, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.file = {};
              this.addimportmodule.resetForm();
              this.closeModal.nativeElement.click();

              setTimeout(() => {
                this.modal.hide();
                this.ngOnInit();
                this.spinner.stop();
              }, 3000);
            } else {
              this.handleError(res.message);

              this.file = {};
              this.addimportmodule.resetForm();
              this.closeModal.nativeElement.click();

              this.myInputVariable.nativeElement.value = '';
              this.spinner.stop();
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.file = {};
            this.addimportmodule.resetForm();
            this.closeModal.nativeElement.click();

            this.myInputVariable.nativeElement.value = '';
            this.spinner.stop();
          },
        );
    }
  }

  demo() {
    window.open('/assets/Module.xlsx', '_blank');
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ModuleListComponent',
      this.filterData,
      '/superadminmenus/Module_list/edit_Module_list',
      rowData.moduleId,
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
