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
import { EmployeeDocumentRejectComponent } from '../../../request-common/employee-document-reject/employee-document-reject.component';

@Component({
    selector: 'app-list-joining-document-data',
    templateUrl: './list-joining-document-data.component.html',
    styleUrls: ['./list-joining-document-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListJoiningDocumentDataComponent implements OnInit {
  // @ViewChild(EmployeeDocumentRejectComponent)
  // employeeDocumentRejectComponent: EmployeeDocumentRejectComponent;

  @ViewChild('addDocument') addDocument: NgForm;
  @ViewChild('editDocument') editDocument: NgForm;
  @ViewChild('renewDocument') renewDocument: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('closeModal2') closeModal2: ElementRef;
  scrollBarHorizontal = window.innerWidth < 1201;
  reduireData: any = [];
  editData: any = [];
  formValue: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  apiURL = environment.apiUrl;
  rows: any = [];

  page = {
    totalCount: 0,
    offset: 0,
  };
  currentDesignationWiseDocumentID: any;
  currentJoiningDocumentID: any;
  historyData: any = [];

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
    this.formValue = this.formValueStorageService.getData();
    this.getAllDocument();
    this.getIPAddress();
    this.profileStatusService.refreshProfileStatus();
  }
  getAllDocument() {
    this.spinner.start('main');
    let queryString = `?userMasterID=${this.formValue.ListEmployeeMasterComponent.id}`;
    this.api
      .callApi(this.constant.GETJOININGDOCUMENTBYUSERID + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
          }
          this.spinner.stop('main');
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('main');
        },
      );
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;
    this.file = null;
    let ext = filename.substring(filename.lastIndexOf('.') + 1);

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

  onSubmit() {
    if (!this.addDocument.valid) {
      return;
    }
    const formData = new FormData();
    formData.append('attachment', this.file);
    formData.append('userMasterID', this.formValue.ListEmployeeMasterComponent.id);
    if (this.reduireData.hasFromDate) {
      formData.append(
        'fromDate',
        this.reduireData.hasFromDate ? this.addDocument.value.fromDate : null,
      );
    }
    if (this.reduireData.hasIssueDate) {
      formData.append(
        'issueDate',
        this.reduireData.hasIssueDate ? this.addDocument.value.issueDate : null,
      );
    }
    if (this.reduireData.hasExpiryDate) {
      formData.append(
        'expiryDate',
        this.reduireData.hasExpiryDate ? this.addDocument.value.expiryDate : null,
      );
    }
    if (this.reduireData.hasIdentificationNumber) {
      formData.append(
        'identificationNumber',
        this.reduireData.hasIdentificationNumber
          ? this.addDocument.value.identificationNumber
          : null,
      );
    }
    formData.append('joiningDocumentMasterID', this.reduireData.joiningDocumentMasterID);
    formData.append('designationWiseDocumentID', this.currentDesignationWiseDocumentID);

    this.spinner.start();
    this.api
      .callApi(this.constant.ADDJOININGDOCUMENT, formData, 'POST', true, true, true)
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

  onEditSubmit() {
    if (!this.editDocument.valid) {
      return;
    }
    let formData;

    if (this.file) {
      formData = new FormData();

      // Handle attachment with conditional logic
      formData.append('attachment', this.file);

      // Append other form data
      formData.append('userMasterID', this.formValue.ListEmployeeMasterComponent.id);
      formData.append('joiningDocumentMasterID', this.reduireData.joiningDocumentMasterID);
      formData.append('designationWiseDocumentID', this.currentDesignationWiseDocumentID);
      formData.append('joiningDocumentID', this.editData.joiningDocumentID);

      // Append optional date fields using conditional logic and null handling
      if (this.reduireData.hasFromDate) {
        formData.append(
          'fromDate',
          this.reduireData.hasFromDate ? this.editDocument.value.fromDate : null,
        );
      }
      if (this.reduireData.hasIssueDate) {
        formData.append(
          'issueDate',
          this.reduireData.hasIssueDate ? this.editDocument.value.issueDate : null,
        );
      }
      if (this.reduireData.hasExpiryDate) {
        formData.append(
          'expiryDate',
          this.reduireData.hasExpiryDate ? this.editDocument.value.expiryDate : null,
        );
      }
      if (this.reduireData.hasIdentificationNumber) {
        formData.append(
          'identificationNumber',
          this.reduireData.hasIdentificationNumber
            ? this.editDocument.value.identificationNumber
            : null,
        );
      }
    } else {
      // Create an object if there's no file
      formData = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        joiningDocumentMasterID: this.reduireData.joiningDocumentMasterID,
        designationWiseDocumentID: this.currentDesignationWiseDocumentID,
        joiningDocumentID: this.editData.joiningDocumentID,
        // Optionally add conditional date fields here (avoid repetitive code)
        fromDate: this.reduireData.hasFromDate ? this.editDocument.value.fromDate : null,
        issueDate: this.reduireData.hasIssueDate ? this.editDocument.value.issueDate : null,
        expiryDate: this.reduireData.hasExpiryDate ? this.editDocument.value.expiryDate : null,
        identificationNumber: this.reduireData.hasIdentificationNumber
          ? this.editDocument.value.identificationNumber
          : null,
        attachment: this.editData.attachment[0],
      };
    }

    this.spinner.start();
    this.api
      .callApi(this.constant.EDITJOININGDOCUMENT, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal1.nativeElement.click();
            this.editDocument.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.file = '';
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

  onRenewSubmit() {
    if (!this.renewDocument.valid) {
      return;
    }
    const formData = new FormData();
    formData.append('attachment', this.file);
    formData.append('userMasterID', this.formValue.ListEmployeeMasterComponent.id);
    if (this.reduireData.hasFromDate) {
      formData.append(
        'fromDate',
        this.reduireData.hasFromDate ? this.renewDocument.value.fromDate : null,
      );
    }
    if (this.reduireData.hasIssueDate) {
      formData.append(
        'issueDate',
        this.reduireData.hasIssueDate ? this.renewDocument.value.issueDate : null,
      );
    }
    if (this.reduireData.hasExpiryDate) {
      formData.append(
        'expiryDate',
        this.reduireData.hasExpiryDate ? this.renewDocument.value.expiryDate : null,
      );
    }
    if (this.reduireData.hasIdentificationNumber) {
      formData.append(
        'identificationNumber',
        this.reduireData.hasIdentificationNumber
          ? this.renewDocument.value.identificationNumber
          : null,
      );
    }
    formData.append('joiningDocumentMasterID', this.reduireData.joiningDocumentMasterID);
    formData.append('designationWiseDocumentID', this.currentDesignationWiseDocumentID);
    formData.append('joiningDocumentID', this.currentJoiningDocumentID);

    this.spinner.start();
    this.api
      .callApi(this.constant.RENEWJOININGDOCUMENT, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal2.nativeElement.click();
            this.renewDocument.resetForm();
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

  alertConfirmation(joiningDocumentID: any) {
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
          joiningDocumentID: joiningDocumentID,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEJOININGDOCUMENT, body, 'POST', true, true, true)
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getRequireJoiningDocumentByID(row) {
    this.currentDesignationWiseDocumentID = row.designationWiseDocumentID;
    this.currentJoiningDocumentID = row.joiningDocumentID;
    let queryString = `?joiningDocumentMasterID=${row.joiningDocumentMasterID}`;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETJOININGDOCUMENTTYPEBYID + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.reduireData = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }

  getJoiningDocumentByID(joiningDocumentID) {
    let queryString = `?joiningDocumentID=${joiningDocumentID}`;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETJOININGDOCUMNETBYID + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editData = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }

  getJoiningDocumentHistroyByID(row) {
    let queryString = `?joiningDocumentMasterID=${row.joiningDocumentMasterID}&userMasterID=${this.formValue.ListEmployeeMasterComponent.id}`;
    this.spinner.start('edit');
    this.api
      .callApi(
        this.constant.GETJOININGDOCUMNETHISTORYBYID + queryString,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.historyData = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
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

  view(degree: any) {
    window.open(this.apiURL + degree, '_blank');
  }
}
