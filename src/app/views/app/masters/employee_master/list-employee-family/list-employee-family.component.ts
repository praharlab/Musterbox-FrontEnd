import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl, NgForm, Validators } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { EmployeeFamilyRejectComponent } from '../../../request-common/employee-family-reject/employee-family-reject.component'
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-list-employee-family',
    templateUrl: './list-employee-family.component.html',
    styleUrls: ['./list-employee-family.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeFamilyComponent implements OnInit {

  @ViewChild(EmployeeFamilyRejectComponent)
  employeeFamilyRejectComponent: EmployeeFamilyRejectComponent;


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
  PercentCheck: any;
  PercentCheckEdit: any;
  EditPercentCheck: any;
  PercentArr: any = [];
  PercentTotal = 0;
  PercentChange: any;
  MIN: any;
  MAX: any;
  PercentControl: UntypedFormControl;
  EditPercentValue: any = [];
  PercentTotalFinal: number;
  verifyBy: any;
  myid: any = null;

  // rejectBody = {
  //   userFamilyID: '',
  //   verifyStatus: '2', // Reject status
  //   verifyBy: localStorage.getItem('id'),
  //   rejectionRemarks: null,
  // };

  formValue: any;



  constructor(
    private spinner: NgxUiLoaderService,
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
  alldata() {
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.GETUSERFAMILY + this.formValue.ListEmployeeMasterComponent.id,
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          for (var i = 0; i < this.rows.length; i++) {
            if (this.rows[i].nominee == 1) {
              this.rows[i].nomineecheck = 'YES';
            } else {
              this.rows[i].nomineecheck = 'NO';
            }

            this.PercentArr.push(this.rows[i].percentForNominee);
          }
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('start');
          this.PercentTotal = this.PercentArr.reduce((acc, obj) => {
            return acc + obj;
          }, 0);
          this.MAX = Number(100 - this.PercentTotal);
          this.MIN = 0;
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

  openVerifyModelSubmit(item:any){
    this.employeeFamilyRejectComponent.button(item.userFamilyID);
    this.employeeFamilyRejectComponent.alertVerifyConfirmation(item.userFamilyID);
  }


  openRejectModelSubmit(item: any) {
    this.employeeFamilyRejectComponent.button(item.userFamilyID);
    this.employeeFamilyRejectComponent.lgModal2.show();
  }

  
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  selectPercent(event) {
    this.PercentCheck = event.target.value;
  }

  selectPercentEdit(event) {
    this.PercentCheckEdit = event.target.value;
  }

  close() {
    this.editcomp.resetForm();
    this.ngOnInit();
  }

  onSubmit() {
    if (this.addcomp.value.Percentage < 0) {
      this.notifications.create(
        'Error',
        'Percent for Gratuity should be greater than zero',
        NotificationType.Error,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      setTimeout(() => {
        this.spinner.stop();
      }, 3000);
      return;
    }

    if (!this.addcomp.valid) {
      return;
    }

    if (this.addcomp.value.Percentage + this.PercentTotal > 100) {
      this.notifications.create(
        'Error',
        'The total percentage for gratuity should be less than 100',
        NotificationType.Error,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      setTimeout(() => {
        this.spinner.stop();
      }, 3000);
    } else {
      let body = {
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        memberName: this.addcomp.value.memberName,
        dob: this.addcomp.value.dob,
        gender: this.addcomp.value.gender,
        relation: this.addcomp.value.relation,
        contact: this.addcomp.value.contact,
        nominee: this.addcomp.value.nominee,
        percentForNominee: this.addcomp.value.Percentage,
        verifyStatus: 1,
        verifyBy: localStorage.getItem('id'),
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
      this.spinner.start();
      this.api.callApi(this.constant.CREATEUSERFAMILY, body, 'POST', true, true, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal.nativeElement.click();
            this.PercentArr.splice(0);
            this.addcomp.resetForm();
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
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
    }
  }

  updateRejectionStatus(row: any) {
    const updatedRow = {
      ...row,
      verifyStatus: '2', // Update to Rejected status
      verifyBy: this.verifyBy,
    };

    const body = {
      userFamilyID: row.userFamilyID,
      verifyStatus: '2', // Rejected status
      verifyBy: this.verifyBy,
    };

    this.spinner.start();
    this.api.callApi(this.constant.POSTVERIFYREQ, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.rows = this.rows.map((r) => (r.userFamilyID === row.userFamilyID ? updatedRow : r));
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
  //   this.rejectBody.userFamilyID = id.userFamilyID;
  // }




  edit(item) {
    this.editbyid = null;

    this.spinner.start();
    this.api
      .callApi(this.constant.GETUSERFAMILYBYID + item.userFamilyID, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editbyid = res.data;
          this.myid = res.data.dob;
          if (this.editbyid.nominee == 0) {
            this.editbyid.nominee = '0';
            this.EditPercentCheck = 0;
            this.PercentCheckEdit = 0;
            this.PercentCheck = 0;
            this.EditPercentValue = 0;
          } else {
            this.editbyid.nominee = '1';
            this.EditPercentCheck = 1;
            this.PercentCheckEdit = 1;
            this.PercentCheck = 1;
            this.EditPercentValue = this.editbyid.percentForNominee;
          }
        }
      });
  }
  onSubmit1() {
    if (!this.editcomp.valid) {
      return;
    }

    if (this.PercentCheckEdit == 0) {
      let body = {
        userFamilyID: this.editbyid.userFamilyID,
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        memberName: this.editcomp.value.memberName,
        dob: this.editcomp.value.dob,
        gender: this.editcomp.value.gender,
        relation: this.editcomp.value.relation,
        contact: this.editcomp.value.contact,
        nominee: this.editcomp.value.nominee,
        percentForNominee: this.editcomp.value.Percentage,
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
        verifyStatus: '1', // Verify status
      };
      this.spinner.start('start');
      this.api.callApi(this.constant.UPDATEUSERFAMILY, body, 'POST', true, true, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal1.nativeElement.click();
            this.PercentArr.splice(0);

            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop('start');
            }, 1000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('start');
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('start');
        },
      );
    } else {
      if (this.editcomp.value.Percentage) {
        if (this.editcomp.value.Percentage < 0) {
          this.notifications.create(
            'Error',
            'Percent for Gratuity should be greater than zero',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          setTimeout(() => {
            this.spinner.stop();
          }, 3000);
          return;
        }
      }

      if (this.editcomp.value.Percentage + this.PercentTotal - this.EditPercentValue > 100) {
        this.notifications.create(
          'Error',
          'The total percentage for gratuity should be less than 100',
          NotificationType.Error,
          { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
        );
        setTimeout(() => {
          this.spinner.stop('start');
        }, 3000);
      } else {
        let body = {
          userFamilyID: this.editbyid.userFamilyID,
          userMasterID: this.formValue.ListEmployeeMasterComponent.id,
          memberName: this.editcomp.value.memberName,
          dob: this.editcomp.value.dob,
          gender: this.editcomp.value.gender,
          relation: this.editcomp.value.relation,
          contact: this.editcomp.value.contact,
          nominee: this.editcomp.value.nominee,
          percentForNominee: this.editcomp.value.Percentage,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
          verifyStatus: '1', // Verify status
        };
        this.spinner.start('start');
        this.api.callApi(this.constant.UPDATEUSERFAMILY, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.closeModal1.nativeElement.click();
              this.PercentArr.splice(0);

              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              setTimeout(() => {
                this.ngOnInit();
                this.spinner.stop('start');
              }, 3000);
            } else {
              this.notifications.create('Error', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('start');
            }
          },
          (err) => {
            this.notifications.create('Error', err, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('start');
          },
        );
      }
    }
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
          userFamilyID: id,
        };
        this.spinner.start();
        this.api.callApi(this.constant.DELETEUSERFAMILY, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.PercentArr.splice(0);
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
          userFamilyID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.FAMILYSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.PercentArr.splice(0);
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
          userFamilyID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.FAMILYSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.PercentArr.splice(0);
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
  setzero() {
    this.PercentCheck = 0;
  }
}
