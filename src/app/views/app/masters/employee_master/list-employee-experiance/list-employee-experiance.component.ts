import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
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
import { EmployeeExperianceRejectComponent } from '../../../request-common/employee-experiance-reject/employee-experiance-reject.component';
import { ModalService } from 'src/app/services/modal.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-experiance',
    templateUrl: './list-employee-experiance.component.html',
    styleUrls: ['./list-employee-experiance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeExperianceComponent implements OnInit {

  @ViewChild(EmployeeExperianceRejectComponent)
  employeeExperianceRejectComponent: EmployeeExperianceRejectComponent;

  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild('closelgModal2') closelgModal2: ElementRef;

  @ViewChild('reject') reject: NgForm;


  mediumDateFormat = environment.mediumDateFormat;
  rows: any = [];
  values = [];
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
  responsibilities: any;

  rejectBody = {
    userExperienceID: '',
    verifyStatus: '2', // Reject status
    verifyBy: localStorage.getItem('id'),
    rejectionRemarks: null,
  };
  formValue: any;
  selectedRow: any;

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
    private modalService: ModalService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.values.push({ value: '' });
    this.getIPAddress();
    this.usertype = localStorage.getItem('usertype');
    this.profileStatusService.refreshProfileStatus();

    this.modalService.userRequestRefresh$.subscribe(() => {
      this.alldata();
    });

    this.alldata();
  }
  add() {
    this.values = [];
  }
  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSEREXPRIANCE + this.formValue.ListEmployeeMasterComponent.id,
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
      }, (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      });
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }

  addvalue() {
    this.values.push({ value: '' });
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  onSubmit() {
    const resp = [];
    for (var i = 0; i < this.values.length; i++) {
      resp.push(this.values[i].value);
    }
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      designation: this.addcomp.value.designation,
      fromDate: this.addcomp.value.fromDate,
      toDate: this.addcomp.value.toDate,
      organization: this.addcomp.value.organization,
      roleRespo: resp,
      verifyStatus: 1,
      verifyBy: localStorage.getItem('id'),
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEUSEREXPERIENCE, body, 'POST', true, true, true).subscribe(
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
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
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
      userExperienceID: row.userExperienceID,
      verifyStatus: '2', // Rejected status
      verifyBy: this.verifyBy,
    };

    this.spinner.start();
    this.api.callApi(this.constant.EXPERIENCEVERIFYREQ, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.rows = this.rows.map((r) =>
          r.userExperienceID === row.userExperienceID ? updatedRow : r,
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
  //     text: 'Do you want to verify this user Experience details?',
  //     icon: 'success',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, Verify',
  //     cancelButtonText: 'Cancel',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const body = {
  //         userExperienceID: id.userExperienceID,
  //         verifyStatus: '1', // Verify status
  //         verifyBy: localStorage.getItem('id'),
  //       };
  //       this.spinner.start();
  //       this.api
  //         .callApi(this.constant.EXPERIENCEVERIFYREQ, body, 'POST', true, true, true)
  //         .subscribe(
  //           (res: any) => {
  //             setTimeout(() => {
  //               this.ngOnInit();
  //               this.spinner.stop();
  //             }, 1000);
  //           },
  //           (err) => {
  //             this.notifications.create('Error', err.error.message, NotificationType.Bare, {
  //               theClass: 'outline primary',
  //               timeOut: 3000,
  //               showProgressBar: false,
  //             });
  //             this.spinner.stop();
  //           },
  //         );
  //     }
  //   });
  // }


  alertRejectConfirmation(id: any) {
    this.rejectBody.userExperienceID = id.userExperienceID;
  }


  openRejectionModal(row: any) {
    this.selectedRow = row;
  }


  openVerifyModelSubmit(item:any){
    this.employeeExperianceRejectComponent.button(item.userExperienceID);
    this.employeeExperianceRejectComponent.alertVerifyConfirmation(item.userExperienceID);
  }

  openRejectModelSubmit(item: any) {
    this.employeeExperianceRejectComponent.button(item.userExperienceID);
    this.employeeExperianceRejectComponent.lgModal2.show();
  }

  // rejectSubmit() {
  //   if (!this.reject.valid) {
  //     return;
  //   }

  //   this.rejectBody.rejectionRemarks = this.reject.value.remarks;
  //   this.spinner.start();
  //   this.api
  //     .callApi(this.constant.EXPERIENCEVERIFYREQ, this.rejectBody, 'POST', true, true, true)
  //     .subscribe(
  //       (res: any) => {
  //         setTimeout(() => {
  //           this.ngOnInit();
  //           this.closelgModal2.nativeElement.click();
  //           this.reject.resetForm();
  //           this.spinner.stop();
  //         }, 3000);
  //       },
  //       (err) => {
  //         this.notifications.create('Error', err.error.message, NotificationType.Bare, {
  //           theClass: 'outline primary',
  //           timeOut: 3000,
  //           showProgressBar: false,
  //         });
  //         this.spinner.stop();
  //       },
  //     );
  // }

  edit(item: any) {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSEREXPERIENCEBYID + item.userExperienceID,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editbyid = res.data;

          var respo: any = [];

          for (var i = 0; i < this.editbyid.roleRespo.length; i++) {
            respo.push({ value: this.editbyid.roleRespo[i] });
          }

          this.values = respo;
        }
      });
  }
  onSubmit1() {
    if (!this.editcomp.valid) {
      return;
    }
    const resp = [];
    for (var i = 0; i < this.values.length; i++) {
      resp.push(this.values[i].value);
    }

    let body = {
      userExperienceID: this.editbyid.userExperienceID,
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      designation: this.editcomp.value.designation,
      fromDate: this.editcomp.value.fromDate,
      toDate: this.editcomp.value.toDate,
      organization: this.editcomp.value.organization,
      roleRespo: resp,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      verifyStatus: '1', // Verify status

    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEUSEREXPERIENC, body, 'POST', true, true, true).subscribe(
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
          userExperienceID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEUSEREXPERIENCE, body, 'POST', true, true, true)
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
          userExperienceID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.EXPERIENCESTATUSCHANGE, body, 'POST', true, true, true)
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
          userExperienceID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.EXPERIENCESTATUSCHANGE, body, 'POST', true, true, true)
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
  setrespo(item: any) {
    this.responsibilities = item;
  }
}
