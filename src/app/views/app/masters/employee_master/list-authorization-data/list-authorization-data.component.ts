import {
  Component,
  ViewChild,
  OnInit,
  ViewContainerRef,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-list-authorization-data',
    templateUrl: './list-authorization-data.component.html',
    styleUrls: ['./list-authorization-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAuthorizationDataComponent implements OnInit {
  @ViewChild('lgModal') lgModal: any;
  @ViewChild('lgModal1') lgModal1: any;
  @ViewChild('addcomp') addcomp: NgForm;
  @Output() childEvent = new EventEmitter<string>();
  authorizationPermissionView: any = [];
  formValue: any;
  usertype: any;
  userId: any = null;
  userData: any;
  ipAddress: any;
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  body = {
    page: 1,
    limit: 1,
  };

  limit: number = 2;
  page = {
    totalCount: 0,
    offset: 0,
  };

  userAuthorizationData: any = [];
  userAuthorizationCountData: any = [];

  selected_company: any = [];
  getAllUser: any = [];
  comp: any;
  buttonDisabled = false;
  buttonState = '';
  allbranch: any = [];
  selectedBranch: null;
  selectedUser: null;
  filterData = {
    page: null,
    limit: null,
    companyMasterID: +localStorage.getItem('company_id'),
    userMasterID: null,
    branchMasterID: null,
    AuthorizationMasterID: '',
  };

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,

    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.usertype = localStorage.getItem('usertype');
    // this.filterData.userMasterID = this.formValue.ListEmployeeMasterComponent.id;
    this.userId = this.formValue.ListEmployeeMasterComponent.id;
    this.checkpermission();
    this.getcompany();
    this.userAuthCount();
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.comp = res.data;
          this.selectcompany(+localStorage.getItem('company_id'));
          this.spinner.stop();
        }
      });
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

          this.authorizationPermissionView = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Authorization' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  userAuthCount() {
    this.filterData.userMasterID = this.userId;
    this.spinner.start('getAll');
    this.api
      .callApi(this.constant.GETALLAUTHDETAILS, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.userAuthorizationCountData = res.data;
          const authorizationDataCount = this.userAuthorizationCountData.reduce(
            (sum, item) => sum + item.count,
            0,
          );
          this.childEvent.emit(authorizationDataCount);
        } else {
        }
        this.spinner.stop('getAll');
      });
  }

  userAuthData() {
    this.spinner.start('getAll');
    this.api
      .callApi(this.constant.GETALLAUTHDATA, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.userAuthorizationData = res.data;
          this.page.totalCount = res.totalcount;
        } else {
        }
        this.spinner.stop('getAll');
      });
  }

  viewUserAuthData(AuthorizationMasterID) {
    this.filterData.userMasterID = this.userId;
    this.filterData.AuthorizationMasterID = AuthorizationMasterID;
    this.filterData.page = 1;
    this.filterData.limit = 10;
    this.spinner.start('getAll');
    this.api
      .callApi(this.constant.GETALLAUTHDATA, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.userAuthorizationData = res.data;
          this.page.totalCount = res.totalcount;
        } else {
        }
        this.spinner.stop('getAll');
      });
  }
  addAuthData(AuthorizationMasterID) {
    this.filterData.userMasterID = this.userId;
    this.filterData.AuthorizationMasterID = AuthorizationMasterID;
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    const body = {
      findID: this.userId,
      replaceID: this.addcomp.value.userMasterID,
      criteria: [this.filterData.AuthorizationMasterID],
    };
    this.spinner.start('getAll');
    this.api.callApi(this.constant.REPLACEAUTHDETAILS, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.lgModal1.hide();
          this.addcomp.resetForm();
          this.allbranch = [];
          this.getAllUser = [];
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.userAuthCount();
            this.spinner.start('getAll');
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop('getAll');
        }
      },
      (err) => {
        this.handleError(err.error.message);
      },
    );
  }
  // delete report to

  alertConfirmation(AuthorizationMasterID) {
    this.filterData.AuthorizationMasterID = AuthorizationMasterID;
    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, Keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          AuthorizedByUserMasterId: this.userId,
          AuthorizationMasterID: this.filterData.AuthorizationMasterID,
        };
        this.spinner.start('active');
        this.api
          .callApi(
            this.constant.DELETEAUTHORIZATIONBYUSERANDAUTHMASTER,
            body,
            'POST',
            true,
            true,
            true,
          )
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              setTimeout(() => {
                this.userAuthCount();
                this.spinner.stop('active');
              }, 3000);
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('active');
            },
          );
      }
    });
  }

  pageChanged(event: any): void {
    this.filterData.page = event.page;
    this.userAuthData();
  }

  selectcompany(event) {
    this.selectedBranch = null;
    this.selectedUser = null;
    this.filterData.userMasterID = null;
    this.filterData.branchMasterID = null;
    this.allbranch = [];
    this.getAllUser = [];
    if (event) {
      this.filterData.companyMasterID = event;
      this.spinner.start('selectcompany');
      this.api
        .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.getAllUser = res.data.filter((user) => user.userMasterID !== this.userId);
            this.spinner.stop('selectcompany');
          }
        });

      this.spinner.start('selectcompany');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop('selectcompany');
        });
    }
  }

  selectbranch(event) {
    this.selectedUser = null;
    this.filterData.userMasterID = null;
    this.filterData.branchMasterID = null;
    this.getAllUser = [];
    if (event) {
      this.filterData.branchMasterID = event;
      this.spinner.start('selectbranch');
      this.api
        .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.getAllUser = res.data.filter((user) => user.userMasterID !== this.userId);
            this.spinner.stop('selectbranch');
          }
        });
    } else {
      this.filterData.companyMasterID = this.addcomp.value.company;

      this.spinner.start('selectbranch');
      this.api
        .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.getAllUser = res.data.filter((user) => user.userMasterID !== this.userId);
            this.spinner.stop('selectbranch');
          }
        });
    }
  }
}
