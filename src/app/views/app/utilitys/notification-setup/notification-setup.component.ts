import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgForm } from '@angular/forms';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-notification-setup',
    templateUrl: './notification-setup.component.html',
    styleUrls: ['./notification-setup.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NotificationSetupComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('lgModal') lgModal: any;
  @ViewChild('lgModal1') lgModal1: any;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  rows = [];
  apiURL = environment.apiUrl;

  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  notificationTypeArray = [
    'punchIn',
    'punchOut',
    'holiday',
  ];


  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    companyMasterID: [+localStorage.getItem('company_id')],
    notificationType: '',
    page: 1,
    limit: 10,
    search: ''
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  adminRoot = environment.adminRoot;
  rows1: any = [];
  queryString: string;
  comp: any;
  companyId: number;
  editData: any;
  toEditData: any;
  notificationType: any;
  notificationTypedata: any;
  timeFormatdata: string;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.filterData = {
      companyMasterID: [+localStorage.getItem('company_id')],
      notificationType: '',
      page: 1,
      limit: 10,
      search: ''
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.companyId = +localStorage.getItem('company_id')

    this.checkpermission();
    this.getcompany();
    this.getData();

  }

  showAddNewModal() {
    this.lgModal.show();
  }

  onAdd() {

    if (!this.addcomp.valid) return

    const body = {
      companyMasterID: this.addcomp.value.cid,
      notificationType: this.addcomp.value.notificationType,
      time: this.addcomp.value.time,
      timeType: this.addcomp.value.timeType,
      timeFormat: this.addcomp.value.timeFormat,
    }

    this.spinner.start('add');
    this.api.callApi(this.constant.ADDCOMPANYNOTIFICATIONSETUP, body, 'POST', true, true, true).subscribe(
      (res: any) => {

        if (res.status == 200) {
          this.addcomp.resetForm();
          this.showNotification('Done', res.message);
          this.lgModal.hide();
          this.closeModal.nativeElement.click();
          this.getData();

        } else {
          this.showNotification('Error', res.message || 'Something went wrong!');

        }
        this.spinner.stop('add');
      },
      (err) => {
        this.showNotification('Error', err || 'Something went wrong!');
        this.spinner.stop('add');
      },
    );
  }

  private showNotification(type: String, message: String) {
    this.notifications.create(`${type}`, message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: type == 'Done' ? true : false,
    });
  }

  onUpdate() {
    if (!this.editcomp.valid) return
    const body = {
      time: this.editcomp.value.time,
      timeType: this.editcomp.value.timeType,
      timeFormat: this.editcomp.value.timeFormat,
    }

    this.spinner.start('add');
    this.api.callApi(this.constant.UPDATECOMPANYNOTIFICATIONSETUP + this.toEditData.id, body, 'PUT', true, true, true).subscribe(
      (res: any) => {

        if (res.status == 200) {
          this.editcomp.resetForm();
          this.showNotification('Done', res.message);
          this.lgModal1.hide();
          this.closeModal1.nativeElement.click();
          this.getData();
          this.spinner.stop('add');

        } else {
          this.showNotification('Error', res.message || 'Something went wrong!');
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.showNotification('Error', err || 'Something went wrong!');
        this.spinner.stop('add');
      },
    );
  }

  edit(row: any) {

    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.GETCOMPANYNOTIFICATIONSETUPBYID + row.id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.toEditData = res.data;
          this.spinner.stop('getdata');
        },
        (err) => {
          this.showNotification('Error', err || 'Something went wrong!');
          this.spinner.stop('getdata');
        },
      );
    this.toEditData = row;

  }

  selectNotificationtype(event: any) {
    this.notificationTypedata = event
  }

  resetdata() {
    this.addcomp.resetForm();

    setTimeout(() => {
      this.companyId = +localStorage.getItem('company_id')
    }, 100);
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

  getData() {

    let string = `?page=${this.filterData.page}&limit=${this.filterData.limit}`

    this.filterData.companyMasterID.map(e => {
      string += `&companyMasterID=${e}`
    });

    if (this.filterData.notificationType) string += `&notificationType=${this.filterData.notificationType}`

    if (this.filterData.search) string += `&search=${this.filterData.search}`

    this.queryString = string

    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETCOMPANYNOTIFICATIONSETUPLIST + string, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          this.spinner.stop('data');
        },
        (err) => {
          this.showNotification('Error', err || 'Something went wrong!');
          this.spinner.stop('data');
        },
      );
  }

  checkpermission() {
    this.spinner.start('permission');
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
              permissionval.formName == 'NotificationSetup' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'NotificationSetup' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'NotificationSetup' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'NotificationSetup' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) return
    this.filterData.companyMasterID = this.datefilter.value.companyMasterID
    this.filterData.notificationType = this.datefilter.value.notificationType
    this.getData();
  }


  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.search = '';
      setTimeout(() => {
        this.getData();
      }, 100);
    } else {
      this.filterData.search = inputValue;
      this.getData();
    }
  }




  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }


  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
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
        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETECOMPANYNOTIFICATIONSETUPBYID + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {

              this.notifications.create(
                'Done',
                res.message,
                NotificationType.Bare,
                {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                },
              );
              this.getData();
              this.spinner.stop('delete');

            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('delete');
            },
          );
      }
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

}
