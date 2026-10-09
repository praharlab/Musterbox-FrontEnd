import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import * as xlsx from 'xlsx';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-expense-head',
    templateUrl: './list-expense-head.component.html',
    styleUrls: ['./list-expense-head.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListExpenseHeadComponent implements OnInit {
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal') modal: any;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  myInputVariable: ElementRef;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'departmentId' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['expenseHeadId', 'expenseHead', 'expenseCategory', 'Company', 'Status'];
  SelectionType = SelectionType;
  tabledata = ['expenseHeadId', 'expenseHead', 'expenseCategory', 'Company', 'Status'];
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
  product: any = [];
  usertype: any;
  company_id: any;
  expese_id: any;
  rows1: any = [];
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  file: any;
  comp: any;
  exp: any;
  childcompany: string;
  ipAddress: any;
  selectedCompany: number = null;
  expenseCategories: any;
  state: any;
  events: any;

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
          this.adminRoot + '/masters/expense_head',
          this.adminRoot + '/masters/expense_head/edit_expense_head',
          this.adminRoot + '/masters/expense_head/expense_price',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListExpenseHeadComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.expese_id = localStorage.getItem('expnse_id');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListExpenseHeadComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListExpenseHeadComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.checkpermission();
    this.getproduct();
    this.getcompany();
    this.getExpenseHead();
  }

  getExpenseHead() {
    this.spinner.start('oninit2');

    this.api
      .callApi(this.constant.EXPENSEHEADBYCOMPANYDATA, this.filterData, 'POST', true, false, true)
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
              permissionval.formName == 'ExpenseHead' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpenseHead' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpenseHead' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpenseHead' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getproduct() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start('product');
      this.api.callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.product = res.data;
            this.spinner.stop();
            this.spinner.stop('product');
          } else {
            this.handleError(res.message);
            this.spinner.stop('product');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('product');
        },
      );
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('product1');
      this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.product = res.data;
            this.spinner.stop();
            this.spinner.stop('product1');
          } else {
            this.handleError(res.message);
            this.spinner.stop('product1');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('product1');
        },
      );
    }
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getExpenseHead();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getExpenseHead();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getExpenseHead();
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
      this.getExpenseHead();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getExpenseHead();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/expense_head/add_expense_head']);
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
          expenseHeadId: id,
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEEXPENSEHEADDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getExpenseHead();
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
          expenseHeadId: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.EXPENSEHEADSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getExpenseHead();
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
          expenseHeadId: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.EXPENSEHEADSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getExpenseHead();
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

  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
  }
  // Get all Expense Category
  // getExpenseCategory() {
  //   const body = {
  //     //  id1: localStorage.getItem('expense_id'),
  //   };
  //   this.spinner.start();
  //   this.api
  //     .callApi(this.constant.EXPENSECATEGORYBYCOMPANYDATA, body, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.exp = res.data;
  //         this.spinner.stop();
  //       }
  //     });
  // }

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

  //Import File Code

  submit() {
    if (this.file) {
      const formData = new FormData();
      let companyId = '';

      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.company);
      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);
      companyId = this.addimportuser.value.company;
      // ...

      // else {
      //   formData.append('file', this.file);
      //   formData.append('company_id', this.addimportuser.value.company);
      //   formData.append('createBy',localStorage.getItem('id'))
      //   formData.append('createByIp',this.ipAddress)

      //   // ...
      // }

      // Use the `companyId` in the API call for uploading the Excel file

      this.spinner.start();
      this.api
        .callApi(this.constant.UPLOADEXPENSEHEADEXCEL, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });

              this.file = {};
              this.addimportuser.resetForm();
              this.closeModal.nativeElement.click();

              setTimeout(() => {
                this.modal.hide();
                this.ngOnInit();
                this.spinner.stop();
              }, 3000);
            } else {
              this.handleError(res.message);
              this.file = {};
              this.addimportuser.resetForm();
              this.closeModal.nativeElement.click();

              this.myInputVariable.nativeElement.value = '';
              this.spinner.stop();
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.file = {};
            this.addimportuser.resetForm();
            this.closeModal.nativeElement.click();

            this.myInputVariable.nativeElement.value = '';
            this.spinner.stop();
          },
        );
    }
  }

  demo() {
    const data = {
      companyMasterID: this.addimportuser.value.company, // Set the company ID here
      page: '',
      limit: '',
    };

    // Fetch expense categories based on the company ID
    this.api
      .callApi(
        this.constant.GETEXPENSECATEGORIES, // Replace with your API endpoint
        data,
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status === 200) {
          const expenseCategories = res.data.map((category) => category.expenseCategory);

          // Create workbook
          const workbook = xlsx.utils.book_new();
          const expenseFieldsWorksheet = xlsx.utils.aoa_to_sheet([
            ['ExpenseHead', 'ExpenseCategory'],
          ]);
          xlsx.utils.book_append_sheet(workbook, expenseFieldsWorksheet, 'Expense Fields');

          // Create a new worksheet for expense categories
          const categoryWorksheet = xlsx.utils.aoa_to_sheet([
            ['ExpenseCategory'],
            ...expenseCategories.map((category) => [category]),
          ]);
          xlsx.utils.book_append_sheet(workbook, categoryWorksheet, 'Expense Categories');

          // Create a new worksheet for expense head and expense category fields

          // Generate Excel file
          const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          const excelBlob = new Blob([excelBuffer], {
            type: 'application/octet-stream',
          });
          saveAs(excelBlob, 'expenseData.xlsx');
        }
      });
  }

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
      .callApi(this.constant.EXPENSEHEADBYCOMPANYDATA, mainbody, 'POST', true, false, true, true)
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
    saveAs(blob, 'ExpenseHead.xlsx');
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
      'ListExpenseHeadComponent',
      this.filterData,
      '/masters/expense_head/edit_expense_head',
      rowData.expenseHeadId,
    );
  }

  navigateToAddPriceRulePage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListExpenseHeadComponent',
      this.filterData,
      '/masters/expense_head/expense_price',
      rowData.expenseHeadId,
    );
  }



  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListExpenseHeadComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
  importExcel() {
    this.router.navigate([this.adminRoot + '/masters/expense_head/import_expense_head/']);
  }
}
