import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

var Size = Quill.import('attributors/style/size');
import Quill from 'node_modules/quill';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

Size.whitelist = [
  '8px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px',
  '34px',
  '36px',
  '38px',
  '40px',
  '42px',
  '44px',
  '46px',
  '48px',
  '50px',
];
Quill.register(Size, true);

let Font = Quill.import('formats/font');
Font.whitelist = ['inconsolata', 'roboto', 'mirza', 'arial', 'calibri'];
Quill.register(Font, true);

@Component({
    selector: 'app-employee-resignation',
    templateUrl: './employee-resignation.component.html',
    styleUrls: ['./employee-resignation.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeResignationComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editResignation') editResignation: NgForm;
  @ViewChild('updateRelData') updateRelData: NgForm;
  @ViewChild('lgModal1') lgModal1: any;
  @ViewChild('lgModal4') lgModal4: any;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    id: localStorage.getItem('company_id'),
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    id: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;
  usertype: any;
  company_id: any;
  comp: any;
  users: any;
  visible: boolean = false;

  Asset_Data: any = [];
  Resign_Task: any = [];
  Loan_Data: any;
  Advance_Data: any;
  Deposit_Data: any;
  Expense_Data: any;
  Authorization_Data: any;

  defaultVal: any = 'unsettle';
  finalData: any = [];
  companydata: any;
  idcount: number = 0;
  contentDataURL1: any;
  Loan_Total: number = 0;
  Advance_Total: number = 0;
  Deposit_Total: number = 0;
  Expense_Total: number = 0;
  expenseimage: any;
  AuthDetails: any = [];
  emptyData: boolean = false;
  resignation: boolean = false;
  emptyresignation: boolean = false;
  allbranch: any;
  finalbranch: any;
  finaluser: any;
  employeeJoining: any;
  imgshow1: any;
  file: any;
  format: string;
  url: string | ArrayBuffer;
  lwddate: any;
  ipAddress: any;
  permissioncreate: any = [];
  userId: any;

  formValue: any;
  referenceData: any = [];

  resignationApplications: any = [];
  userResignation: any = [];
  resignationTaskData: any = [];

  buttonDisabled = false;
  buttonState = '';

  relievingDate: any;

  resignationID: any;
  allReasonData: any = [];

  employeeComment: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.userId = localStorage.getItem('id');
    this.checkpermission();
    this.getUserDetails();
    this.ResignationApplications();
    this.getAllReason();
  }

  getAllReason() {
    this.spinner.start('data');
    this.api.callApi(this.constant.LISTRESIGNATIONREASON, {}, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allReasonData = res.data;
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

  ResignationApplications() {
    this.spinner.start('resign');
    this.api
      .callApi(
        this.constant.GETRESIGNATIONBYUSERID + this.formValue.ListEmployeeMasterComponent.id,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.resignationApplications = res.data;
          this.spinner.stop('resign');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('resign');
        },
      );
  }

  showData(id: any) {
    this.api
      .callApi(this.constant.GETRESIGNATIONBYREFERENCEID + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.referenceData = res.data;
            this.employeeComment = this.referenceData.employeeComment;

            var s = this.referenceData.employeeComment ? this.referenceData.employeeComment : '';
            var htmlObject = document.getElementById('employeeComment');
            htmlObject.innerHTML = s;

            this.spinner.stop();
          } else {
            this.handleError(res.message);
            this.spinner.stop();
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  radio(row: any, value: any) {
    row.settle = value;
  }

  auth_redirect() {
    this.router.navigate([this.adminRoot + '/masters/authchange']);
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
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AddEmployeeResignation' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getUserDetails() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPJOININGDATA + '/' + this.formValue.ListEmployeeMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.employeeJoining = res.data;

            if (this.employeeJoining) {
              this.visible = true;
            }

            if (this.employeeJoining.userMaster.photo) {
              this.imgshow1 = true;
            } else {
              this.imgshow1 = false;
            }

            if (this.employeeJoining.noticePeriod) {
              this.lwdfunc(Number(this.employeeJoining.noticePeriod));
            } else {
              this.lwdfunc(0);
              this.employeeJoining.noticePeriod = 0;
            }

            this.spinner.stop();
          } else {
            this.handleError(res.message);
            this.spinner.stop();
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  lwdfunc(event: any) {
    let today = new Date();
    today.setDate(today.getDate() + Number(event));

    this.lwddate = new Date(today).toISOString().slice(0, 10);
  }

  onSubmit1() {
    if (!this.addcomp.valid) {
      return;
    }

    const formData = new FormData();
    formData.append('attachment', this.file);
    formData.append('userMasterID', this.formValue.ListEmployeeMasterComponent.id);
    formData.append('employeeComment', this.addcomp.value.employeeComment);
    formData.append('appliedDate', new Date().toISOString().slice(0, 10));
    formData.append('lastworkingdate', this.lwddate);
    formData.append('preferredLWDate', this.addcomp.value.prelwd);
    formData.append('noticeperiod', this.employeeJoining.noticePeriod);
    formData.append('resigantionReasonID', this.addcomp.value.resigantionReasonID);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);

    this.spinner.start();
    this.api.callApi(this.constant.CREATERESIGNATION, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.ngOnInit();
            this.addcomp.reset();
            this.spinner.stop();
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png' && ext.toLowerCase() == 'jpg' && ext.toLowerCase() == 'jpeg') {
    } else {
      this.file = event.target.files && event.target.files[0];
      if (this.file) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        if (this.file.type.indexOf('image') > -1) {
          this.format = 'image';
        } else if (this.file.type.indexOf('video') > -1) {
          this.format = 'video';
        }
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      }
    }
  }

  clear() {
    //this.visible=true
    window.location.reload();
  }

  onEdit(data: any) {
    this.relievingDate = data.relievingDate;
  }

  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'No, Keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          resignationID: id,
          authorizationstatus: 5,
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.POSTCANCELRESIGNATION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.ResignationApplications();
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  viewDocument(attachment) {
    window.open(`${this.apiURL}uploads/resignation/${attachment}`, '_blank');
  }

  // update
  editData(id: any) {
    this.api
      .callApi(this.constant.GETRESIGNATIONBYREFERENCEID + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.userResignation = res.data;
            this.resignationID = this.userResignation.resignationID;
            this.spinner.stop();
          } else {
            this.handleError(res.message);
            this.spinner.stop();
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  updateResignation() {
    if (!this.editResignation.valid) {
      return;
    }

    const formData = new FormData();
    formData.append('attachment', this.file);
    formData.append('employeeComment', this.editResignation.value.employeeComment);
    formData.append('preferredLWDate', this.editResignation.value.prelwd);
    formData.append('resigantionReasonID', this.editResignation.value.resigantionReasonID);
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);

    this.spinner.start();
    this.api
      .callApi(
        this.constant.UPDATERESIGNATION + this.resignationID,
        formData,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.editResignation.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.lgModal1.hide();
              this.ngOnInit();
              this.spinner.stop();
            }, 3000);
          } else {
            this.handleError(res.message);
            this.spinner.stop();
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  updateRelievingDate() {
    if (!this.editResignation.valid) {
      return;
    }

    const body = {
      relievingDate: this.updateRelData.value.relievingDate1,
    };
    this.spinner.start();
    this.api
      .callApi(
        this.constant.UPDATERELIEVINGDATE + this.resignationID,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.editResignation.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.lgModal4.hide();
              this.ngOnInit();
              this.spinner.stop();
            }, 3000);
          } else {
            this.handleError(res.message);
            this.spinner.stop();
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  showResignationTask(id: any) {
    this.api
      .callApi(this.constant.GETRESIGNATIONTASKBYID + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.resignationTaskData = res.data;
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

  showEditBtn(authorizations: any[]): boolean {
    return authorizations.every((auth) => auth.authstatus === 2);
  }

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}