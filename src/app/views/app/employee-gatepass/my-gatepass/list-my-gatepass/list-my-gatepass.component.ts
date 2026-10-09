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
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-my-gatepass',
    templateUrl: './list-my-gatepass.component.html',
    styleUrls: ['./list-my-gatepass.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListMyGatepassComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;
  @ViewChild('checkOutForm') checkOutForm: NgForm;
  @ViewChild('checkInForm') checkInForm: NgForm;
  @ViewChild('finalCheckInForm') finalCheckInForm: NgForm;
  @ViewChild('closeCheckoutModal') closeCheckoutModal: ElementRef;
  @ViewChild('closeCheckinModal') closeCheckinModal: ElementRef;
  @ViewChild('closeFinalCheckinModal') closeFinalCheckinModal: ElementRef;

  @ViewChild(DatatableComponent) table: DatatableComponent;

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
    company_id: Number(localStorage.getItem('company_id')),
    userMasterId: Number(localStorage.getItem('id')),
    sortByField: '',
    sortByValue: 'ASC',
    startdate: '',
    enddate: '',
    status: '',
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
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/employeegatepasses/list_mygatepass',
          this.adminRoot + '/employeegatepasses/list_mygatepass/edit_mygatepass',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListMyGatepassComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListMyGatepassComponent')) {
      this.body = {
        page: 1,
        limit: 10,
        company_id: Number(localStorage.getItem('company_id')),
        userMasterId: Number(localStorage.getItem('id')),
        sortByField: '',
        sortByValue: 'ASC',
        startdate: '',
        enddate: '',
        status: '',
      };
    } else {
      this.body = this.formValue.ListMyGatepassComponent.body;
      this.body.sortByField = '';
      this.body.sortByValue = 'ASC';
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.image = [];
    this.company_id = +localStorage.getItem('company_id');
    this.getEmployeeGatepassData();
    this.checkpermission();
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
    if (this.body.sortByField) {
      queryString += `&sortByField=${this.body.sortByField}&sortByValue=${this.body.sortByValue}`;
    }
    if (this.body.status) {
      queryString += `&status=${this.body.status}`;
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
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  convertTo12HourFormat(time24: string): string {
    if (!time24) return '';

    let [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      id: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyEmployeeGatepass' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyEmployeeGatepass' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyEmployeeGatepass' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyEmployeeGatepass' &&
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

  onSubmit() {
    if (!this.companyfilter.valid) {
      return;
    }

    if (this.companyfilter.value.status === 'Pending') {
      this.statusValue = [0, 1, 2];
    } else if (this.companyfilter.value.status === 'Approved') {
      this.statusValue = [3];
    } else {
      this.statusValue = [4];
    }

    this.body.page = 1;
    this.body.startdate = this.companyfilter.value.startdate;
    this.body.enddate = this.companyfilter.value.enddate;
    this.body.status = this.statusValue;

    this.getEmployeeGatepassData();
  }

  showdataForm(row) {
    this.api
      .callApi(this.constant.GETGATEPASSDATABYREFERENCEID + row.id, {}, 'GET', false, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.referencedata = res.data;
          }
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );
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
    this.router.navigate([this.adminRoot + '/employeegatepasses/list_mygatepass/add_mygatepass']);
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
    this.companyfilter.resetForm();
    this.formValueStorageService.removeData('ListMyGatepassComponent', false);

    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  onOptionSelect() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }

    if (this.rows.length == 0) {
      this.handleError('No Data To Export Excel!');
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
            saveAs(blob, 'MyGatepass.csv');
            this.selectedValue = null;
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'MyGatepass.xlsx');
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

  checkTime() { }

  checkOutSubmit() {
    if (!this.checkOutForm.valid) {
      return;
    }

    this.spinner.start('checkout');
    const formData = new FormData();

    // if(checkTime(this.checkOutForm.value.outTime)) return

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

    this.spinner.start('checkin');
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
            this.spinner.stop('checkin');
          }, 3000);
        },
        (err) => {
          this.closeCheckinModal.nativeElement.click();
          this.checkInForm.resetForm();
          this.getEmployeeGatepassData();
          this.handleError(err.error.message);
          this.spinner.stop('checkin');
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

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListMyGatepassComponent',
      this.body,
      '/employeegatepasses/list_mygatepass/edit_mygatepass',
      rowData.id,
    );
  }
}
