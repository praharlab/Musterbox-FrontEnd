import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router, NavigationStart } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
var Size = Quill.import('attributors/style/size');
import Quill from 'node_modules/quill';

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
    selector: 'app-user-resignation',
    templateUrl: './user-resignation.component.html',
    styleUrls: ['./user-resignation.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserResignationComponent implements OnInit {
  @ViewChild('addvisitor') addvisitor: NgForm;
  @ViewChild('addresignation') addresignation: NgForm;

  @ViewChild('addmeetingPlace') addmeetingPlace: NgForm;
  @ViewChild('addgatepass') addgatepass: NgForm;
  @ViewChild('editResignation') editResignation: NgForm;
  @ViewChild('lgModal1') lgModal1: any;

  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  selected: any;
  childcompany: string;
  user: any;
  users: any;
  category: any;
  meetingplace: any;
  empList: any;
  comp: any;
  checkdate: any;
  dateF: any = new Date().toLocaleDateString();
  myDate: any;
  checktime: any;
  file: any;
  lwddate: any;
  format: any;
  url: any;
  joiningdata: any;
  rows: any = [];
  allReasonData: any = [];
  limit: any = 1;
  PWD: any;
  reason: any;
  referenceData: any = [];
  userResignation: any = [];
  resignationTaskData: any = [];

  resignationID: any;

  applidate = new Date().toISOString().split('T')[0];
  userComment: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private datePipe: DatePipe,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/offboardings/apply-resignation',
          this.adminRoot + '/offboardings/edit-userresignation',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('UserResignationComponent', false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getAllReason();
    let userid = localStorage.getItem('id');
    this.spinner.start('resignation');
    this.api
      .callApi(this.constant.GETEMPJOININGDATA + '/' + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.joiningdata = res.data;

          if (this.joiningdata.noticePeriod) {
            this.lwdfunc(Number(this.joiningdata.noticePeriod));
          } else {
            this.lwdfunc(0);
            this.joiningdata.noticePeriod = 0;
          }

          this.spinner.stop('resignation');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('resignation');
        },
      );

    this.spinner.start('already');
    this.api
      .callApi(this.constant.GETRESIGNATIONBYUSERID + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;

          this.spinner.stop('already');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('already');
        },
      );

    this.checkdate = new Date();
    this.checktime = new Date();
    this.checkdate = this.datePipe.transform(this.checkdate, 'yyyy-MM-dd');
    this.checktime = this.datePipe.transform(this.checktime, 'HH:mm');
  }

  lwdfunc(event: any) {
    let today = new Date();
    today.setDate(today.getDate() + Number(event));

    this.lwddate = new Date(today).toISOString().slice(0, 10);
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

  showData(row) {
    this.api
      .callApi(
        this.constant.GETRESIGNATIONBYREFERENCEID + row.resignationID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.referenceData = res.data;
            this.userComment = this.referenceData.employeeComment;
            var s = this.referenceData.employeeComment ? this.referenceData.employeeComment : '';
            var htmlObject = document.getElementById('employeeComment');
            htmlObject.innerHTML = s;

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

  onSubmit() {
    if (!this.addresignation.valid) {
      return;
    }

    const formData = new FormData();
    formData.append('attachment', this.file);
    formData.append('userMasterID', localStorage.getItem('id'));
    formData.append('employeeComment', this.addresignation.value.employeeComment);
    formData.append('appliedDate', new Date().toISOString().slice(0, 10));
    formData.append('lastworkingdate', this.lwddate);
    formData.append('preferredLWDate', this.addresignation.value.prelwd);
    formData.append('noticeperiod', this.joiningdata.noticePeriod);
    formData.append('resigantionReasonID', this.addresignation.value.resigantionReasonID);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);

    this.spinner.start();
    this.api.callApi(this.constant.CREATERESIGNATION, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.addresignation.resetForm();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/offboardings/apply-resignation']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.ngOnInit();
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  editData(id: any) {
    this.api
      .callApi(this.constant.GETRESIGNATIONBYREFERENCEID + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.userResignation = res.data;
          this.resignationID = this.userResignation.resignationID;
          this.spinner.stop();
        }
      });
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
              this.router.navigate([this.adminRoot + '/offboardings/apply-resignation']);
              this.buttonDisabled = false;
              this.buttonState = '';
              this.ngOnInit();
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }
        },
        (err) => {
          this.buttonDisabled = false;
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png' && ext.toLowerCase() == 'jpg' && ext.toLowerCase() == 'jpeg') {
      //this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
      this.notifications.create(
        'Error',
        'Selected file format is not supported',
        NotificationType.Bare,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
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

  viewDocument(attachment) {
    window.open(`${this.apiURL}uploads/resignation/${attachment}`, '_blank');
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'UserResignationComponent',
      '',
      '/offboardings/edit-userresignation',
      rowData.resignationID,
    );
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
              this.ngOnInit();
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
