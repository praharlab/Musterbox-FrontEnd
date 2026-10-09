import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { EmployeeEducationRejectComponent } from '../../../request-common/employee-education-reject/employee-education-reject.component';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-education',
    templateUrl: './list-employee-education.component.html',
    styleUrls: ['./list-employee-education.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeEducationComponent implements OnInit {

  
  @ViewChild(EmployeeEducationRejectComponent)
  employeeEducationRejectComponent: EmployeeEducationRejectComponent;

  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild('closelgModal2') closelgModal2: ElementRef;
  @ViewChild('reject') reject: NgForm;



  mediumDateFormat = environment.mediumDateFormat;
  rows: any = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  @ViewChild('myInput')
  myInputVariable: ElementRef;
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
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  editbyid: any;
  usertype: any;
  verifyBy: any;
  certificate: null;

  rejectBody = {
    userEducationID: '',
    verifyStatus: '2', // Reject status
    verifyBy: localStorage.getItem('id'),
    rejectionRemarks: null,
  };

  formValue: any;

  constructor(
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
    this.usertype = localStorage.getItem('usertype');
    this.profileStatusService.refreshProfileStatus();
  }

  openVerifyModelSubmit(item:any){
    this.employeeEducationRejectComponent.button(item.userEducationID);
    this.employeeEducationRejectComponent.alertVerifyConfirmation(item.userEducationID);
  }

  openRejectModelSubmit(item: any) {
    this.employeeEducationRejectComponent.button(item.userEducationID);
    this.employeeEducationRejectComponent.lgModal2.show();
  }
  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSEREDUCATION + this.formValue.ListEmployeeMasterComponent.id,
        this.filterData,
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
          this.spinner.stop();
        }
      });
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    const formData = new FormData();
    formData.append('userMasterID', this.formValue.ListEmployeeMasterComponent.id);
    formData.append('qualification', this.addcomp.value.qualification);
    formData.append('yearOfPassing', this.addcomp.value.yearOfPassing);
    formData.append('grade', this.addcomp.value.grade);
    formData.append('percentageObtained', this.addcomp.value.percentageObtained);
    formData.append('institute', this.addcomp.value.institute);
    formData.append('university', this.addcomp.value.university);

    formData.append('degree', this.certificate);
    formData.append('verifyBy', localStorage.getItem('id'));
    formData.append('verifyStatus', '1');
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);

    // let body = {
    //   userMasterID: this.formValue.ListEmployeeMasterComponent.id,
    //   qualification: this.addcomp.value.qualification,
    //   yearOfPassing: this.addcomp.value.yearOfPassing,
    //   grade: this.addcomp.value.grade,
    //   percentageObtained: this.addcomp.value.percentageObtained,
    //   institute: this.addcomp.value.institute,
    //   university: this.addcomp.value.university,
    //   verifyStatus: 0,
    //   verifyBy: localStorage.getItem('id'),
    //   createBy: localStorage.getItem('id'),
    //   createByIp: this.ipAddress
    // }
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEUSEREDUCATION, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal.nativeElement.click();
            this.ngOnInit();
            this.addcomp.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
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
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }

  updateRejectionStatus(row: any) {
    const updatedRow = {
      ...row,
      verifyStatus: '2', // Update to Rejected status
      verifyBy: this.verifyBy,
    };

    const body = {
      userEducationID: row.userEducationID,
      verifyStatus: '2', // Rejected status
      verifyBy: this.verifyBy,
    };

    this.spinner.start();
    this.api.callApi(this.constant.EDUCATIONVERIFYREQ, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.rows = this.rows.map((r) =>
          r.userEducationID === row.userEducationID ? updatedRow : r,
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


  // alertRejectConfirmation(id: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Do you want to Reject this user Education details?',
  //     icon: 'error',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, Reject',
  //     cancelButtonText: 'Cancel',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const body = {
  //         userEducationID: id.userEducationID,
  //         verifyStatus: '2', // Reject status
  //         verifyBy: localStorage.getItem('id'),
  //       };
  //       this.spinner.start();
  //       this.api
  //         .callApi(this.constant.EDUCATIONVERIFYREQ, body, 'POST', true, true, true)
  //         .subscribe(
  //           (res: any) => {
  //             this.ngOnInit();
  //             this.spinner.stop();
  //           },
  //           (err) => {
  //             this.spinner.stop();
  //           },
  //         );
  //     }
  //   });
  // }

  alertRejectConfirmation(id: any) {
    this.rejectBody.userEducationID = id.userEducationID;
  }

  rejectSubmit() {
    if (!this.reject.valid) {
      return;
    }

    this.rejectBody.rejectionRemarks = this.reject.value.remarks;

    this.api
      .callApi(this.constant.EDUCATIONVERIFYREQ, this.rejectBody, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.closelgModal2.nativeElement.click();
          this.reject.resetForm();
          setTimeout(() => {
            this.ngOnInit();
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

  edit(item) {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSEREDUCATIONBYID + item.userEducationID,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editbyid = res.data;
        }
      },(err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      });
  }
  onSubmit1() {
    if (!this.editcomp.valid) {
      return;
    }

    const formData = new FormData();
    formData.append('userEducationID', this.editbyid.userEducationID);
    formData.append('userMasterID', this.editbyid.userMasterID);
    formData.append('qualification', this.editcomp.value.qualification);
    formData.append('yearOfPassing', this.editcomp.value.yearOfPassing);
    formData.append('grade', this.editcomp.value.grade);
    formData.append('percentageObtained', this.editcomp.value.percentageObtained);
    formData.append('institute', this.editcomp.value.institute);
    formData.append('university', this.editcomp.value.university);

    formData.append('degree', this.certificate);
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);
    formData.append('verifyStatus', '1');


    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEUSEREDUCATION, formData, 'POST', true, true, true)
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
              this.spinner.stop();
            }, 1000);
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
          this.notifications.create('Error', err, NotificationType.Bare, {
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
          userEducationID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEUSEREDUCATION, body, 'POST', true, true, true)
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
          userEducationID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.EDUCATIONSTATUSCHANGE, body, 'POST', true, true, true)
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
          userEducationID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.EDUCATIONSTATUSCHANGE, body, 'POST', true, true, true)
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
    window.open(this.apiURL + 'uploads/user/degree/' + degree, '_blank');
  }

  onSelectCertificate(event: any) {
    this.certificate = null;
    this.certificate = event.target.files && event.target.files[0];
    if (this.certificate) {
      var reader = new FileReader();
      reader.readAsDataURL(this.certificate);

      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
  }
}
