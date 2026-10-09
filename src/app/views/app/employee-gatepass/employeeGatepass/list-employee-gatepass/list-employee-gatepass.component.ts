import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { Lightbox } from 'ngx-lightbox';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-gatepass',
    templateUrl: './list-employee-gatepass.component.html',
    styleUrls: ['./list-employee-gatepass.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeGatepassComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;
  @ViewChild('checkOutForm') checkOutForm: NgForm;
  @ViewChild('checkInForm') checkInForm: NgForm;
  @ViewChild('finalCheckInForm') finalCheckInForm: NgForm;
  @ViewChild('closeCheckoutModal') closeCheckoutModal: ElementRef;
  @ViewChild('closeCheckinModal') closeCheckinModal: ElementRef;
  @ViewChild('closeFinalCheckinModal') closeFinalCheckinModal: ElementRef;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  commonFilterData: any

  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  myInputVariable: ElementRef;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  Order = { label: 'Description', value: 'description' };
  changeOrderBy = [
    { label: 'Description', value: 'description' },
    { label: 'Date', value: 'date' },
  ];

  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    company_id: Number(localStorage.getItem('company_id')),
    branch_id: '',
    userMasterId: '',
    sortByField: '',
    sortByValue: 'ASC',
    startdate: '',
    enddate: '',
    gatepassStatus: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissioncreate: any = [1];
  permissionedit: any = [1];
  permissionview: any = [1];
  permissiondelete: any = [1];
  limit = 10;
  company_id: any;
  file: any;
  comp: any;
  selectedValue: string;
  query: string;
  employeeGatepassId: any;
  image: any;
  referencedata: any;

  allbranch: any;
  empList: any;
  enddate1: Date;
  minDate: any;
  selectedUser: any[];

  currentTime: string;
  maxTime: string;

  currentPage: number;
  formValue: any;

  statusValue: any;

  openLightbox(src: string): void {
    this.lightbox.open([{ src, thumb: '' }], 0, {
      centerVertically: true,
      positionFromTop: 0,
      disableScrolling: true,
      wrapAround: true,
    });
  }

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private lightbox: Lightbox,
    private formValueStorageService: FormValueStorageService,
  ) {
    // Get the current time
    const now = new Date();

    // Format the current time as hh:mm
    this.currentTime = this.formatTime(now);

    // Set the max time for the input field
    this.maxTime = this.currentTime;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/employeegatepasses/list_empgatepass',
          this.adminRoot + '/employeegatepasses/list_empgatepass/edit_emp_gatepass',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListEmployeeGatepassComponent', false);
          formValueStorageService.removeData('commonFilterData', true);
        }
      }
    });
  }

  formatTime(date: Date): string {
    return (
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0')
    );
  }

  ngOnInit() {
    this.company_id = +localStorage.getItem('company_id');

    this.limit = 10;
    this.image = [];
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    // this.getEmployeeGatepassData();
    // this.getcompany();
    this.checkpermission();
  }

  selectfrom() {
    this.enddate1 = new Date();
    this.minDate = this.companyfilter.value.startdate;
  }

  getEmployeeGatepassData() {
    this.spinner.start('start');
    let queryString = `?page=${this.body.page}&pageSize=${this.body.limit}`;
    if (this.body.company_id) {
      queryString += `&companyMasterID=${this.body.company_id}`;
    }
    if (this.body.userMasterId) {
      queryString += `&userMasterID=${this.body.userMasterId}`;
    }
    if (this.body.searchQuery) {
      queryString += `&search=${this.body.searchQuery}`;
    }
    if (this.body.sortByField) {
      queryString += `&sortByField=${this.body.sortByField}&sortByValue=${this.body.sortByValue}`;
    }
    if (this.body.gatepassStatus) {
      queryString += `&status=${this.body.gatepassStatus}`;
    }

    if (this.body.startdate && this.body.enddate) {
      queryString += `&startDate=${this.body.startdate}&endDate=${this.body.enddate}`;
    }

    this.query = queryString;
    this.api
      .callApi(this.constant.GETALLEMPLOYEEGATEPASS + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body.page;
            this.itemsPerPage = this.body.limit;
          }, 100);
          this.spinner.stop('start');
        },
        (err) => {
          if (err.error.message == 'endDate must be larger than or equal to "ref:startDate"') {
            err.error.message = 'toDate must be larger than or equal to fromDate';
          }

          this.handleError(err.error.message);
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AllEmployeeGatepass' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AllEmployeeGatepass' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AllEmployeeGatepass' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AllEmployeeGatepass' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onChangeOrderBy(event): void {
    this.body.sortByField = event.value;
    this.getEmployeeGatepassData();
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.body.searchQuery = '';
      setTimeout(() => {
        this.getEmployeeGatepassData();
      }, 100);
    } else {
      this.body.searchQuery = inputValue;
      this.getEmployeeGatepassData();
    }
  }

  onSubmit(val: any) {
    this.commonFilterData = val

    if (
      (val.startdate && !val.enddate) ||
      (!val.startdate && val.enddate)
    ) {
      this.notifications.create('Error', 'from & to dates are required!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }

    if (val.gatepassStatus == 'Pending') {
      this.statusValue = [0, 1, 2];
    } else if (val.gatepassStatus == 'Approved') {
      this.statusValue = [3];
    } else {
      this.statusValue = [4];
    }

    this.body.company_id = val.company;
    this.body.userMasterId = val.user;

    this.body.startdate = val.startdate;
    this.body.enddate = val.enddate;
    this.body.gatepassStatus = this.statusValue;

    this.getEmployeeGatepassData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getEmployeeGatepassData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getEmployeeGatepassData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/employeegatepasses/list_empgatepass/add_emp_gatepass']);
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
        const body = {};
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEMPLOYEEGATEPASS + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              this.getEmployeeGatepassData();
              this.notifications.create('Done', res.message, NotificationType.Success, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop();
            },
          );
      }
    });
  }

  clear() {
    this.formValue = this.formValueStorageService.getData();
    this.rows = []
    this.commonFilterData = null;
    this.body = {
      page: this.formValue.ListEmployeeincentiveComponent?.body?.page ? this.formValue.ListEmployeeincentiveComponent?.body?.page : 1,
      limit: this.formValue.ListEmployeeincentiveComponent?.body?.limit ? this.formValue.ListEmployeeincentiveComponent?.body?.limit : 10,
      searchQuery: '',
      company_id: null,
      branch_id: '',
      userMasterId: '',
      sortByField: '',
      sortByValue: 'ASC',
      startdate: '',
      enddate: '',
      gatepassStatus: '',
    };
    // setTimeout(() => {
    //   this.ngOnInit();
    // }, 100);
    this.formValueStorageService.removeData('ListEmployeeGatepassComponent', false);
  }

  // getcompany() {
  //   const body = {
  //     companyMasterID: localStorage.getItem('company_id'),
  //   };
  //   this.spinner.start('company');
  //   this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
  //     (res: any) => {
  //       if (res.status == 200) {
  //         this.comp = res.data;
  //         setTimeout(() => {
  //           this.selectcompany(this.company_id);
  //         }, 100);
  //         this.spinner.stop('company');
  //       } else {
  //         this.handleError('Something Went Wrong!');
  //         this.spinner.stop('company');
  //       }
  //     },
  //     (err) => {
  //       this.handleError(err.error.message);
  //       this.spinner.stop('company');
  //     },
  //   );
  // }

  onOptionSelect() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }

    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETALLEMPLOYEEGATEPASS +
        this.query +
        `&exportFileType=${this.selectedValue}&exportData=true`,
        {},
        'GET',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (this.selectedValue == 'csv') {
            var blob = new Blob([res], { type: 'text/csv' });
            saveAs(blob, 'EmployeeGatepass.csv');
            this.selectedValue = null;
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'EmployeeGatepass.xlsx');
            this.selectedValue = null;
            this.spinner.stop('a');
          }
        },
        (err) => {
          this.selectedValue = null;
          this.handleError(err.error.message);

          this.spinner.stop('a');
        },
      );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  employeeGatepassData(data: any) {
    this.employeeGatepassId = data.id;
  }

  checkOutSubmit() {
    if (!this.checkOutForm.valid) {
      return;
    }

    this.spinner.start('checkout');
    const formData = new FormData();

    formData.append('employeeGatepassId', this.employeeGatepassId);
    formData.append('time', this.checkOutForm.value.outTime);
    formData.append('type', 'Checkout');
    if (this.image.length != 0) formData.append('attachment', this.image);

    this.api
      .callApi(this.constant.UPDATECHECKINOUTGATEPASS, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.closeCheckoutModal.nativeElement.click();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.checkOutForm.resetForm();
            this.getEmployeeGatepassData();
            this.spinner.stop('checkout');
          }, 3000);
        },
        (err) => {
          this.closeCheckoutModal.nativeElement.click();
          this.checkOutForm.resetForm();
          this.getEmployeeGatepassData();
          this.handleError(err.error.message);
          this.spinner.stop('checkout');
        },
      );
  }

  checkInSubmit() {
    if (!this.checkInForm.valid) {
      return;
    }

    this.spinner.start('checkIn');
    const formData = new FormData();

    formData.append('employeeGatepassId', this.employeeGatepassId);
    formData.append('time', this.checkInForm.value.inTime);
    formData.append('type', 'Checkin');

    if (this.image.length != 0) formData.append('attachment', this.image);

    this.api
      .callApi(this.constant.UPDATECHECKINOUTGATEPASS, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.closeCheckinModal.nativeElement.click();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.checkInForm.resetForm();
            this.getEmployeeGatepassData();
            this.spinner.stop('checkIn');
          }, 3000);
        },
        (err) => {
          this.closeCheckinModal.nativeElement.click();
          this.checkInForm.resetForm();
          this.getEmployeeGatepassData();
          this.handleError(err.error.message);
          this.spinner.stop('checkIn');
        },
      );
  }

  finalCheckInSubmit() {
    if (!this.finalCheckInForm.valid) {
      return;
    }

    this.spinner.start('final');

    const formData = new FormData();
    formData.append('employeeGatepassId', this.employeeGatepassId);
    formData.append('time', this.finalCheckInForm.value.finalinTime);
    formData.append('type', 'FinalCheckin');
    if (this.image.length != 0) formData.append('attachment', this.image);

    this.api
      .callApi(this.constant.UPDATECHECKINOUTGATEPASS, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.closeFinalCheckinModal.nativeElement.click();

          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.finalCheckInForm.resetForm();
            this.getEmployeeGatepassData();
            this.spinner.stop('final');
          }, 3000);
        },
        (err) => {
          this.closeFinalCheckinModal.nativeElement.click();
          this.finalCheckInForm.resetForm();
          this.getEmployeeGatepassData();
          this.handleError(err.error.message);
          this.spinner.stop('final');
        },
      );
  }

  onSelectFile(event: any) {
    this.image = [];
    if (event.target.files && event.target.files.length > 0) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileMimeType = file.type;

        if (allowedMimeTypes.includes(fileMimeType)) {
          this.image = file;
        } else {
          this.handleError(
            `File '${file.name}' has invalid type. Only jpeg, jpg, png are allowed.`,
          );
        }
      }
    }
  }

  view(item: any) {
    window.open(this.apiURL + item, '_blank');
  }

  showdata(row) {
    if (!row) return;
    this.referencedata = row;
  }

  resetForm(formName) {
    this.image = [];
    if (formName == 'checkoutModal') {
      this.checkOutForm.resetForm();
    } else if (formName == 'checkinModal') {
      this.checkInForm.resetForm();
    } else if (formName == 'finalCheckinModal') {
      this.finalCheckInForm.resetForm();
    }
  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  convertTo12HourFormat(time24: string): string {
    if (!time24) return '';

    let [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListEmployeeGatepassComponent',
      this.body,
      '/employeegatepasses/list_empgatepass/edit_emp_gatepass',
      rowData.id,
    );
  }

  getCompany(companyMasterID: number) {
    if (this.formValueStorageService.isEmptyObject('ListEmployeeGatepassComponent')) {
      this.body = {
        page: 1,
        limit: 10,
        searchQuery: '',
        company_id: companyMasterID,
        branch_id: '',
        userMasterId: '',
        sortByField: '',
        sortByValue: 'ASC',
        startdate: '',
        enddate: '',
        gatepassStatus: '',
      };
    } else {
      this.body = this.formValue.ListEmployeeGatepassComponent.body;
      this.body.sortByField = '';
      this.body.sortByValue = 'ASC';
    }

    this.getEmployeeGatepassData();
  }
  getBranchName(row: any): string {
    return row.employeeBranches?.[0]?.branchMaster?.branchName || '';
  }
  getEmployeeCode(row: any): string {
    return row.employeeJoiningDetails[0]?.employeeCode || '';
  }

  getDepartmentName(row: any): string {
    return row.employeeDepartments?.[0]?.department?.departmentName || '';
  }

  getDesignationName(row: any): string {
    return row.employeeDesignations?.[0]?.designation?.designationName || '';
  }

  getDivisionName(row: any): string {
    return row.employeeDivisions?.[0]?.division?.divisionName || null;
  }
  getWorkingAreaName(row: any): string {
    return row.employeeWorkingAreas?.[0]?.workingArea?.workingAreaName || null;
  }
}
