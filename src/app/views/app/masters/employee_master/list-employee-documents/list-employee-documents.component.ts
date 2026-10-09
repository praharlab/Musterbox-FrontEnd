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
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-documents',
    templateUrl: './list-employee-documents.component.html',
    styleUrls: ['./list-employee-documents.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeDocumentsComponent implements OnInit {

  
  @ViewChild(EmployeeDocumentRejectComponent)
  employeeDocumentRejectComponent: EmployeeDocumentRejectComponent;

  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild('closelgModal2') closelgModal2: ElementRef;

  @ViewChild('reject') reject: NgForm;

  rows: any = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  file: any;
  format: any;
  url: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };
  filterData1 = {
    page: '',
    limit: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  modalRef: BsModalRef;
  country: any;
  state: any;
  city: any;
  finalcityid: any;
  editbyid: any;
  alldocumenttypedata: any;
  usertype: any;
  verifyBy: any;

  rejectBody = {
    userDocumentID: '',
    verifyStatus: '2', // Reject status
    verifyBy: localStorage.getItem('id'),
    rejectionRemarks: null,
  };


  formValue: any;
  showExpiryDate: boolean = false;
  expiryDate: string;

  companydata1 = {
    showdate1: 'no', // Initialize with appropriate default value if needed
  };

  editShowExpiryDate = false;
  editDocumentValid = true; // Assuming default validity state
  editAddcomp4Submitted = false;


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
    this.alldata();
    this.getIPAddress();
    this.alldocumenttype();
    this.usertype = localStorage.getItem('usertype');
    this.profileStatusService.refreshProfileStatus();
  }
  alldocumenttype() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETDOCUMENTDATA, this.filterData1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldocumenttypedata = res.data;

          this.spinner.stop();
        }
      }, (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      });
  }
  onSelectFile(event: any) {
    let filename = event.target.files[0].name;
    this.file = null
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
  alldata() {
    this.spinner.start('main');
    this.api
      .callApi(
        this.constant.GETUSERDOCUMENT + this.formValue.ListEmployeeMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          this.temp = [...this.rows];
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
  onSubmit() {
    if (!this.addcomp.valid || this.adharNumberError || this.panCardError) {
      return;
    }
    const formData = new FormData();
    formData.append('userMasterID', this.formValue.ListEmployeeMasterComponent.id);
    formData.append('documentListID', this.addcomp.value.documentListID);
    formData.append('adharPhoto', this.file);
    formData.append('documentNumber', this.addcomp.value.documentNumber ? this.addcomp.value.documentNumber : '');
    formData.append('nameOnDocument', this.addcomp.value.nameOnDocument ? this.addcomp.value.nameOnDocument : '');
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    formData.append('verifyBy', localStorage.getItem('id'));
    formData.append('verifyStatus', '1');
    formData.append('expiryDate', this.addcomp.value.expiryDate ? this.addcomp.value.expiryDate : null);


    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEUSERDOCUMENT, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal.nativeElement.click();
            this.addcomp.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.ngOnInit();
              this.addcomp.resetForm();
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

  toggleExpiryDateField(show: boolean) {
    this.showExpiryDate = show;
    if (!show) {
      this.expiryDate = ''; // Reset expiryDate when hiding the field
    }
  }


  toggleExpiryDateFieldEdit(value: boolean) {
    this.showExpiryDate = value;
  }




  updateRejectionStatus(row: any) {
    const updatedRow = {
      ...row,
      verifyStatus: '2', // Update to Rejected status
      verifyBy: this.verifyBy,
    };

    const body = {
      userDocumentID: row.userDocumentID,
      verifyStatus: '2', // Rejected status
      verifyBy: this.verifyBy,
    };

    this.spinner.start();
    this.api.callApi(this.constant.DOCVERIFYREQ, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.rows = this.rows.map((r) =>
          r.userDocumentID === row.userDocumentID ? updatedRow : r,
        );
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

  // alertVerifyConfirmation(id: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Do you want to verify this user Document details?',
  //     icon: 'success',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, Verify',
  //     cancelButtonText: 'Cancel',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const body = {
  //         userDocumentID: id.userDocumentID,
  //         verifyStatus: '1', // Verify status
  //         verifyBy: localStorage.getItem('id'),
  //       };
  //       this.spinner.start();
  //       this.api.callApi(this.constant.DOCVERIFYREQ, body, 'POST', true, true, true).subscribe(
  //         (res: any) => {
  //           setTimeout(() => {
  //             this.ngOnInit();
  //             this.spinner.stop();
  //           }, 3000);
  //         },
  //         (err) => {
  //           this.notifications.create('Error', err.error.message, NotificationType.Bare, {
  //             theClass: 'outline primary',
  //             timeOut: 3000,
  //             showProgressBar: false,
  //           });
  //           this.spinner.stop();
  //         },
  //       );
  //     }
  //   });
  // }

  // alertRejectConfirmation(id: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Do you want to Reject this user Document details?',
  //     icon: 'error',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, Reject',
  //     cancelButtonText: 'Cancel',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const body = {
  //         userDocumentID: id.userDocumentID,
  //         verifyStatus: '2', // Reject status
  //         verifyBy: localStorage.getItem('id'),
  //       };
  //       this.spinner.start();
  //       this.api.callApi(this.constant.DOCVERIFYREQ, body, 'POST', true, true, true).subscribe(
  //         (res: any) => {
  //           this.ngOnInit();
  //           this.spinner.stop();
  //         },
  //         (err) => {
  //           this.spinner.stop();
  //         },
  //       );
  //     }
  //   });
  // }

  alertRejectConfirmation(id: any) {
    this.rejectBody.userDocumentID = id.userDocumentID;
  }

  
  openVerifyModelSubmit(item:any){
    this.employeeDocumentRejectComponent.button(item.userDocumentID);
    this.employeeDocumentRejectComponent.alertVerifyConfirmation(item.userDocumentID);
  }

  openRejectModelSubmit(item: any) {
    this.employeeDocumentRejectComponent.button(item.userDocumentID);
    this.employeeDocumentRejectComponent.lgModal2.show();
  }

  rejectSubmit() {
    if (!this.reject.valid) {
      return;
    }

    this.rejectBody.rejectionRemarks = this.reject.value.remarks;
    this.spinner.start();
    this.api
      .callApi(this.constant.DOCVERIFYREQ, this.rejectBody, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          setTimeout(() => {
            this.ngOnInit();
            this.closelgModal2.nativeElement.click();
            this.reject.resetForm();
            this.spinner.stop();
          }, 1000);
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  edit(item) {
    this.adharNumberError = false
    this.panCardError = false
    this.spinner.start();
    this.api
      .callApi(this.constant.GETUSERDOCUMENTBYID + item.userDocumentID, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editbyid = res.data;
          if (+this.editbyid.documentListID == 1) {
            this.validateadharNumber(this.editbyid.documentNumber);
          }
          if (+this.editbyid.documentListID == 2) {
            this.validatePanCardNumber(this.editbyid.documentNumber);
          }

          this.showExpiryDate = false;

          if (this.editbyid.expiryDate) {
            this.editbyid.expiryDate = new Date(this.editbyid.expiryDate).toISOString().slice(0, 10);
            this.showExpiryDate = true;
          }




        }
      });
  }
  onSubmit1() {
    if (!this.editcomp.valid || this.adharNumberError || this.panCardError) {
      return;
    }
    const formData = new FormData();
    formData.append('userDocumentID', this.editbyid.userDocumentID);
    formData.append('documentListID', this.editbyid.documentListID);
    if (this.file) {
      formData.append('adharPhoto', this.file);
    }
    formData.append('documentNumber', this.editcomp.value.documentNumber ? this.editcomp.value.documentNumber : '');
    formData.append('nameOnDocument', this.editcomp.value.nameOnDocument ? this.editcomp.value.nameOnDocument : '');

    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);
    formData.append('verifyStatus', '1');
    formData.append('expiryDate', this.editcomp.value.expiryDate ? this.editcomp.value.expiryDate : null);

    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEUSERDOCUMENT, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal1.nativeElement.click();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.ngOnInit();
              this.editcomp.resetForm();
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
        const body = {
          userDocumentID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEUSERDocument, body, 'POST', true, true, true)
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
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userDocumentID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DocumentTATUSCHANGE, body, 'POST', true, true, true)
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
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userDocumentID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DocumentTATUSCHANGE, body, 'POST', true, true, true)
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
  view(degree: any) {
    window.open(this.apiURL + 'uploads/user/document/' + degree, '_blank');
  }

  adharNumberError: boolean = false;

  validateadharNumber(adharcard: string): void {
    const pattern = /^\d{12}$/;
    if (adharcard != null && adharcard != '') {
      if (!pattern.test(adharcard)) {
        this.adharNumberError = true;
      } else {
        this.adharNumberError = false;
      }
    } else {
      this.adharNumberError = false;
    }
  }

  panCardError: boolean = false;

  validatePanCardNumber(pancard: string): void {
    const pattern = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
    if (pancard != null && pancard != '') {
      if (!pattern.test(pancard)) {
        this.panCardError = true;
      } else {
        this.panCardError = false;
      }
    } else {
      this.panCardError = false;
    }
  }
}
