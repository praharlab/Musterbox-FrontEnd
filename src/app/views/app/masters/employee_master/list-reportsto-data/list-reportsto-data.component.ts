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
    selector: 'app-list-reportsto-data',
    templateUrl: './list-reportsto-data.component.html',
    styleUrls: ['./list-reportsto-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListReportstoDataComponent implements OnInit {
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
    limit: 10,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  userReportToData: any = [];
  selected_company: any = [];
  getAllUser: any = [];
  comp: any;
  buttonDisabled = false;
  buttonState = '';
  allbranch: any = [];
  selectedBranch: null;
  filterData = {
    // page: 1,
    // limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    userMasterID: null,
    branchMasterID: null,
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
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.usertype = localStorage.getItem('usertype');
    this.filterData.userMasterID = this.formValue.ListEmployeeMasterComponent.id;
    this.userId = this.formValue.ListEmployeeMasterComponent.id;
    this.checkpermission();
    this.getcompany();
    this.userReportTo();
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

  userReportTo() {
    const currentDate = new Date();
    let queryString = `?userMasterID=${this.userId}&date=${currentDate}&page=${this.body.page}&limit=${this.body.limit}`;

    this.api
      .callApi(this.constant.REPORTSTOIMMEDIATECHILD + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.userReportToData = res.data;
            this.page.totalCount = res.childCount;
            const reportsToCount = res.childCount
            this.childEvent.emit(reportsToCount);
            this.spinner.stop();
          } else {
            this.handleError(res.message);
          }
        },
        (err) => {
          this.handleError(err.error.message);
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
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    const replaceReportData = {
      oldReportToID: this.userId,
      newReportToID: this.addcomp.value.userMasterID,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.REPLACEANDDELETEREPORTTO, replaceReportData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.lgModal1.hide();
            this.addcomp.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {

              this.userReportTo();
              this.spinner.stop();
            }, 3000);
          } else {
            this.handleError(res.message);
          }
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );
  }
  // delete report to

  alertConfirmation() {
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
          oldReportToID: this.userId,
          status: '0',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.REPLACEANDDELETEREPORTTO, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              setTimeout(() => {
                this.userReportTo();
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
    this.body.page = event.page;
    this.userReportTo();
  }

  selectcompany(event) {
    this.selectedBranch = null;
    this.filterData.userMasterID = null;
    this.allbranch = [];
    this.getAllUser = [];

    if (event) {
      this.filterData.companyMasterID = event;
      this.spinner.start('getalluser');
      this.api
        .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.getAllUser = res.data.filter((user) => user.userMasterID !== this.userId);
            this.spinner.stop('getalluser');
          }
        });

      this.spinner.start('allbranch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop('allbranch');
        });
    }
  }

  selectbranch(event) {
    this.filterData.userMasterID = null;
    this.getAllUser = [];

    if (event) {
      this.filterData.branchMasterID = event;
      this.spinner.start('getallcontact');
      this.api
        .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.getAllUser = res.data.filter((user) => user.userMasterID !== this.userId);
            this.spinner.stop('getallcontact');
          }
        });
    } else {
      this.filterData.companyMasterID = this.addcomp.value.company;
      this.spinner.start('getallcontact');
      this.api
        .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.getAllUser = res.data.filter((user) => user.userMasterID !== this.userId);
            this.spinner.stop('getallcontact');
          }
        });
    }
  }
}
