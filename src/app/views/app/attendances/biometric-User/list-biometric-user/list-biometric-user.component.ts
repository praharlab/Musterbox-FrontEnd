import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-list-biometric-user',
    templateUrl: './list-biometric-user.component.html',
    styleUrls: ['./list-biometric-user.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListBiometricUserComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('transferForm') transferForm: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal') lgModal: any;

  rows: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    searchQuery: '',
    biometricUserSerialNo: '',
    serverIp: '',
  };
  getAllUsers = {
    biometricUserSerialNo: '',
    serverIp: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissioncreate: any = [];
  permissiondelete: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  subject: any;
  limit: number = 10;
  currentPage: number;
  formValue: any;
  comp: any;
  biometricUserSerialNo: any;
  bioNo: any;
  serialIp: any;
  onlineStatus: string = '';
  selectedEnrollId: string;
  image: null;
  company_id: any;
  biometriclist: any;
  allUsers: any;
  userEnroll: number = null;
  errorMessages: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,

  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/attendances/biometric_list',
          this.adminRoot + '/attendances/edit-biometricUser',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListBiometricUserComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    this.company_id = [+localStorage.getItem('company_id')];

    this.serialIp = this.formValue.BiometricListComponent?.body?.serverIp;

    this.bioNo = this.formValue?.BiometricListComponent?.id
    if (this.formValueStorageService.isEmptyObject('ListBiometricUserComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
        biometricUserSerialNo: this.formValue?.BiometricListComponent?.id,
        serverIp: '',

      };
    } else {
      this.filterData = this.formValue?.ListBiometricUserComponent?.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.limit = 10;
    this.getData();
    this.checkstatus();
    this.getAllSerialNumber();
    this.checkpermission();
  }

  getAllSerialNumber() {
    let body = {
      companyMasterID: this.company_id,
    };

    this.spinner.start('biometricList');
    this.api
      .callApi(this.constant.GETBIOMETRICLIST, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.biometriclist = res.data;
          this.biometriclist = res.data.filter(item => item.serialno !== this.formValue.BiometricListComponent?.id);

        }
        this.spinner.stop('biometricList');
      });
  }
  openModal(enrollId: string): void {
    window.open(this.apiURL + enrollId, '_blank');
  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }
  checkstatus() {
    this.spinner.start('data');
    let body = {
      biometricSerialNo: this.bioNo,
      serverIp: this.serialIp
    };

    this.api
      .callApi(this.constant.CHECKBIOMETRICSTATUS, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop('data');
          if (res.status === 200) {
            this.onlineStatus = res.message === 'offline' ? 'offline' : 'online';
          } else {
            this.onlineStatus = 'offline';
            this.handleCatchError(res.message || "Something went wrong!");
          }
          this.checkpermission();
        },
        (err) => {
          this.onlineStatus = 'offline';
          this.spinner.stop('data');
          this.handleCatchError(err.error.message);
        },
      );
  }

  getData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETBIOMETRICUSER, this.filterData, 'POST', true, false, true)
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
            this.spinner.stop('data');
            this.handleCatchError('something went wrong!');
          }
        },
        (err) => {
          this.spinner.stop('data');
          this.handleCatchError(err.error.message);
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
              permissionval.formName == 'Biometric' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Biometric' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Biometric' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Biometric' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.permissioncreate = this.onlineStatus == 'online' ? this.permissioncreate : [];
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getData();
    }
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getData();
    } else {
      this.handleCatchError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getData();
    } else {
      this.handleCatchError('Something Went Wrong!');
    }
  }


  handleCatchError(message: string) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  clear() {
    this.datefilter.resetForm();
    this.formValueStorageService.removeData('ListBiometricUserComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }


  downloadFile() {
    let body = {
      page: 1,
      limit: 10,
      searchQuery: '',
      exportData: true,
      biometricUserSerialNo: this.formValue.BiometricListComponent.id,
    }
    this.spinner.start('download');

    this.api
      .callApi(this.constant.GETBIOMETRICUSER, body, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.message);
          this.spinner.stop('download');
        },
      );
  }


  syncBiometricUser() {
    const body = {
      biometricUserSerialNo: this.formValue.BiometricListComponent.id,
      serverIp: this.formValue.BiometricListComponent.body.serverIp,
    }


    this.spinner.start('data');
    this.api
      .callApi(this.constant.SYNCBIOMETRICUSER, body, 'POST', true, false, true,)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = [...this.rows];
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.getData();
            setTimeout(() => {
              this.spinner.stop('data');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.notifications.create('Error', err.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('data');
        },
      );
  }



  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Biometric User.xlsx');
    this.spinner.stop('download');
  }


  openAttachment(item: any) {

    window.open(this.apiURL + 'uploads/biometricUser/' + item, '_blank');
  }


  alertConfirmation(enrollid: any) {
    const body = {
      biometricUserSerialNo: this.formValue.BiometricListComponent.id,
      serverIp: this.formValue.BiometricListComponent.body.serverIp,
      enrollid: enrollid,
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEBIOMETRICUSER, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });

                this.getData();

              } else {
                this.handleError(res.message);
              }
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


  onFileChange(event: any) {

    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0]
    else this.image = null
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListBiometricUserComponent',
      this.filterData,
      '/attendances/edit-biometricUser',
      rowData.biometricUserID,
    );
  }



  onSubmit() {
    if (!this.transferForm.valid) return;
    this.errorMessages = [];
    let body = {
      fromSerialNumber: this.formValue.BiometricListComponent.id,
      toSerialNumber: this.transferForm.value.snNumber,
      createBy: +localStorage.getItem('id'),
      serverIp: this.formValue.BiometricListComponent.body.serverIp,
      enrollid: this.userEnroll ? [this.userEnroll] : this.transferForm.value.enrollid
    }

    this.spinner.start('transfer');

    this.api
      .callApi(this.constant.TRANSFERBIOMETRICUSER, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          // this.handleFileDownload(res)

          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.closeModal.nativeElement.click();
            this.getData();
            this.userEnroll = null;
            this.errorMessages = [];
            this.transferForm.resetForm();
          } else {
            if (res.message && Array.isArray(res.message)) {
              for (let item of res.message) this.errorMessages.push(item);
            } else this.errorMessages.push(res.message);
            this.handleError("Please refer below list for transfer Errors!");
          }

          this.spinner.stop('transfer');
        },
        (err) => {
          this.handleError(err.message);
          this.spinner.stop('transfer');
        },
      );
  }
  getAllUser() {
    this.getAllUsers.biometricUserSerialNo = this.formValue.BiometricListComponent.id;

    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETBIOMETRICUSER, this.getAllUsers, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.allUsers = res.data;
            this.selectAllForDropdownItems(this.allUsers);
            this.spinner.stop('data');
          } else {
            this.spinner.stop('data');
            this.handleCatchError('something went wrong!');
          }
        },
        (err) => {
          this.spinner.stop('data');
          this.handleCatchError(err.error.message);
        },
      );
  }

  setUser(enrollId: number) {
    this.userEnroll = enrollId;
    this.errorMessages = [];
  }
  close_Modal() {
    this.userEnroll = null;
    this.errorMessages = [];
    this.transferForm.resetForm();
  }
}

