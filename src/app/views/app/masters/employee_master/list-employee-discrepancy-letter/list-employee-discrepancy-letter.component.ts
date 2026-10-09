import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { EmployeeDocumentRejectComponent } from '../../../request-common/employee-document-reject/employee-document-reject.component'
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-list-employee-discrepancy-letter',
    templateUrl: './list-employee-discrepancy-letter.component.html',
    styleUrls: ['./list-employee-discrepancy-letter.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeDiscrepancyLetterComponent implements OnInit {
  // @ViewChild(EmployeeDocumentRejectComponent)
  // employeeDocumentRejectComponent: EmployeeDocumentRejectComponent;

  @ViewChild('addDocument') addDocument: NgForm;
  @ViewChild('editDocument') editDocument: NgForm;
  @ViewChild('renewDocument') renewDocument: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('closeModal2') closeModal2: ElementRef;
  @ViewChild('lgModal', { static: false }) lgModal: ModalDirective;

  scrollBarHorizontal = window.innerWidth < 1201;
  reduireData: any = [];
  editData: any;
  formValue: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  apiURL = environment.apiUrl;
  rows: any = [];
  discrepancyLettersData: any = [];

  page = {
    totalCount: 0,
    offset: 0,
  };
  permissioncreate: any = [];
  permissiondelete: any = [];
  permissionedit: any = [];
  permissionView: any = [];
  constructor(
    private modalService: BsModalService,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.checkpermission()
    this.formValue = this.formValueStorageService.getData();
    this.getEmployeeDiscrepancyLetter();
    this.getIPAddress();
    this.profileStatusService.refreshProfileStatus();
  }
  getEmployeeDiscrepancyLetter() {
    this.spinner.start('main');
    const body = { userMasterID: this.formValue.ListEmployeeMasterComponent.id }
    this.api
      .callApi(
        this.constant.GETEMPLOYEEDISCREPANCYLETTER,
        body,
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('main');
      }, (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('main');
      });
  }

  discrepancyLetterData() {
    const body = { companyMasterID: this.formValue.ListEmployeeMasterComponent.body.companyMasterID }
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETDISCREPANCYLETTER, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.discrepancyLettersData = res.data;
            this.lgModal.show()
            this.page.totalCount = res.totalcount;
            this.spinner.stop('data');
          } else {
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.spinner.stop('data');
        },
      );
    // this.getcompany();
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
              permissionval.formName == 'AssignDiscrepancyLetter' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignDiscrepancyLetter' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignDiscrepancyLetter' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionView = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignDiscrepancyLetter' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.spinner.stop();
        }
      });

  }
  onAddSubmit() {
    if (!this.addDocument.valid) {
      return;
    }

    const body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      discrepancyLetterID: this.addDocument.value.discrepancyLetterID,
    }

    this.spinner.start();
    this.api
      .callApi(this.constant.ADDEMPLOYEEDISCREPANCYLETTER, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal.nativeElement.click();
            this.addDocument.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }


  alertConfirmation(employeeDiscrepancyLetterID: any) {
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
          employeeDiscrepancyLetterID: employeeDiscrepancyLetterID,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEMPLOYEEDISCREPANCYLETTER, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            },
          );
      }
    });
  }
  sendmail(employeeDiscrepancyLetterID) {
    let body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      employeeDiscrepancyLetterID: employeeDiscrepancyLetterID,
      companyMasterID: this.formValue.ListEmployeeMasterComponent.body.companyMasterID,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.SENDEMAILDISCREPANCYLETTER, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          this.spinner.stop();
        } else {
          this.notifications.create('', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
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


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }


  view(path: any) {
    window.open(this.apiURL + path, '_blank');
  }

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }
  html_Content: any;

  editLetter(item: any) {
    this.editData = item
    this.html_Content = item.htmlContent;
  }


  onEditSubmit() {
    const body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      employeeDiscrepancyLetterID: this.editData.employeeDiscrepancyLetterID,
      discrepancyLetterID: this.editData['discrepancyLetter.discrepancyLetterID'],
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      discrepancyLetterHTML: this.html_Content
    }
    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEEMPLOYEEDISCREPANCYLETTER, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.closeModal1.nativeElement.click();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          this.ngOnInit();

          this.spinner.stop();
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      });
  }
}
