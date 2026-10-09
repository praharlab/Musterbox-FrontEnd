import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-list-employee-authorization',
    templateUrl: './list-employee-authorization.component.html',
    styleUrls: ['./list-employee-authorization.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeAuthorizationComponent implements OnInit {
  @ViewChild('addauthperson') addauthperson: NgForm;
  @ViewChild('editauthperson') editauthperson: NgForm;
  @ViewChild('closeAddAuthorizationModal') closeAddAuthorizationModal: ElementRef;
  @ViewChild('closeEditAuthorizationModal') closeEditAuthorizationModal: ElementRef;

  authorizationUserData: any = [];
  ipAddress: any;
  logInUserId: string;
  selectedauth: any;
  editSelectedauth: any;
  authcritera: any;
  values = [];
  editValues = [];
  authdata: any;
  user: any;
  loadAddModal: boolean;
  loadEditModal: boolean;
  logInUserCompanyId: string;
  formauthdata: any;
  authMasters: any = [];

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  formValue: any;
  allCompany: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.checkpermission();
    this.get_Company();

    this.setVariables()
      .then(() => this.getdata())
      .then(() => this.getAuthorizationUserData())
      .catch((error) => {
        this.handleCatchError();
      });

    this.profileStatusService.refreshProfileStatus();
  }

  get_Company() {

    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('tree');
    this.api
      .callApi(this.constant.GETCOMPANYTREE, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allCompany = res.data;
          this.spinner.stop('tree');
        }
      });
  }
  checkpermission() {
    this.spinner.start('permission');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Authorization' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Authorization' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Authorization' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Authorization' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  private setVariables() {
    return new Promise((resolve, reject) => {
      try {
        this.values = [];
        this.logInUserId = this.formValue.ListEmployeeMasterComponent.id;
        this.loadAddModal = false;
        this.loadEditModal = false;
        // this.values.push({
        //   SequenceNo: 0,
        //   AuthorizedByUserMasterId: '',
        //   FromAmount: 0,
        //   ToAmount: 0,
        //   RequiredAuthorizationMessage: '1',
        // });

        // this.editValues.push({
        //   SequenceNo: 0,
        //   AuthorizedByUserMasterId: '',
        //   FromAmount: 0,
        //   ToAmount: 0,
        //   RequiredAuthorizationMessage: '1',
        // });

        resolve('Variables set successfully');
      } catch (error) {
        this.handleCatchError();
        reject(error);
      }
    });
  }

  private getdata(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.spinner.stop();
      this.api
        .callApi(
          this.constant.VIEWCOMPANYCONTACTDATA + this.formValue.ListEmployeeMasterComponent.id,
          {},
          'GET',
          true,
          true,
          true,
        )
        .subscribe(
          (res: any) => {
            this.spinner.stop();
            this.logInUserCompanyId = res.data['companyMaster.companyMasterID'];
            resolve();
          },
          (err) => {
            this.spinner.stop();
            this.handleCatchError();
            reject(err);
          },
        );
    });
  }

  getAuthorizationUserData() {
    this.spinner.start();
    this.authorizationUserData = [];
    let body = {
      page: '',
      limit: '',
      companyMasterID: this.logInUserCompanyId,
      startdate: '',
      enddate: '',
      userMasterID: this.logInUserId,
      AuthorizationMasterID: '',
    };
    this.api.callApi(this.constant.GETAUTHORIZATION, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          const responseData = res.data;
          this.authorizationUserData = responseData.map((item) => ({
            criteria: item.AuthorizationCriteriaMaster.AuthorizationCriteria,
            authName: item.authorizationMaster.authorizationMasterName,
            authorizePersonName: item.AuthorizedPersonName,
            authorizationMasterID: item.AuthorizationMasterID,
            authorizationDetailsId: item.AuthorizationDetailsId,
            companyMasterID: item.companyMaster.companyMasterID,
            createdByUserName: item.createdByUserDetails != null ? item.createdByUserDetails.displayName : null,
            updatedByUserName: item.updatedByUserDetails != null ? item.updatedByUserDetails.displayName : null,
            createdAt:  item.createdAt != null ? item.createdAt : null,
            updatedAt: item.updatedAt != null ? item.updatedAt : null,
          }));
          
          this.spinner.stop();
        }
      },
      (err) => {
        this.spinner.stop();
        this.handleCatchError();
      },
    );
  }

  getAuthorizationTypes() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETAUTHMASTER,
        {
          page: '',
          limit: '',
        },
        'POST',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.authMasters = res.data;
            const userAuthorizationIDs = this.authorizationUserData.map((user) =>
              Number(user.authorizationMasterID),
            );
            this.authdata = this.authMasters.filter(
              (type) => !userAuthorizationIDs.includes(type.authorizationMasterID),
            );
            this.spinner.stop();
          }
        },
        (err) => {
          this.spinner.stop();
          this.handleCatchError();
        },
      );
  }

  getauthorizationcriteria() {
    this.spinner.start();
    const body = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.AUTHORIAZATIONALLDATA, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.authcritera = res.data;
            this.spinner.stop();
          }
        },
        (err) => {
          this.spinner.stop();
          this.handleCatchError();
        },
      );
  }

  getuserdata() {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: this.logInUserCompanyId,
    };
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.user = res.data;
            this.spinner.stop('start');
          }
        },
        (err) => {
          this.spinner.stop('start');
          this.handleCatchError();
        },
      );
  }

  addAuthorization() {
    this.values = [];
    Promise.all([
      this.getAuthorizationTypes(),
      this.getauthorizationcriteria(),
      this.addvalue(),
      // this.getuserdata(),
      this.getIPAddress(),
    ])
      .then(() => {
        this.loadAddModal = true;
      })
      .catch((error) => {
        this.handleCatchError();
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  selectedauthcritera(event) {
    this.selectedauth = event;
  }

  removevalue(i) {
    // this.values.splice(i, 1);
    this.values[i].deleted = true;
  }

  addvalue() {
    let count = 1;
    for (var item of this.values) {
      if (!item.deleted) count++;
    }

    this.values.push({
      SequenceNo: count,
      AuthorizedByUserMasterId: '',
      FromAmount: 0,
      ToAmount: 0,
      RequiredAuthorizationMessage: '1',
      companyMasterID: null,
      allCompany: this.allCompany,
      allUsers: [],
      deleted: false
    });
  }
  selectCompany(event: any, i: any) {

    this.values[i].AuthorizedByUserMasterId = null;
    this.values[i].allUsers = [];

    if (event) {
      const filterData = {
        companyMasterID: event,
      };
      this.spinner.start('users');
      this.api
        .callApi(this.constant.GETUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.values[i].allUsers = res.data;
            this.spinner.stop('users');
          }
        });
    } else {
      this.values[i].companyMasterID = null;
    }
  }
  selectEditCompany(event: any, i: any) {

    this.editValues[i].AuthorizedByUserMasterId = null;
    this.editValues[i].allUsers = [];

    if (event) {
      const filterData = {
        companyMasterID: event,
      };
      this.spinner.start('users1');
      this.api
        .callApi(this.constant.GETUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.editValues[i].allUsers = res.data;
            this.spinner.stop('users1');
          }
        });
    } else {
      this.editValues[i].companyMasterID = null;
    }
  }

  addAuthorizationOnSubmit() {
    if (!this.addauthperson.valid) {
      return;
    }
    let sequence = [];
    let userid = [];
    let fromamount = [];
    let toamount = [];
    let requiredmessage = [];
    if (this.values.length == 0) {
      this.notifications.create(
        'Error',
        'Please add authorization person.',
        NotificationType.Bare,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
    }
    let tempID = [];

    if (this.selectedauth == 5) {
      for (var i = 0; i < this.values.length; i++) {
        if (this.values[i].deleted) continue;

        if (tempID.includes(this.values[i].AuthorizedByUserMasterId)) {
          this.notifications.create('Oops!', 'Repeated user found!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          return;
        }
        // this.values[i].SequenceNo = i + 1;
        sequence.push(this.values[i].SequenceNo);
        userid.push(this.values[i].AuthorizedByUserMasterId);
        fromamount.push(this.values[i].FromAmount);
        toamount.push(this.values[i].ToAmount);
        requiredmessage.push(this.values[i].RequiredAuthorizationMessage);

        tempID.push(this.values[i].AuthorizedByUserMasterId);
      }
    } else {
      for (var i = 0; i < this.values.length; i++) {
        if (this.values[i].deleted) continue;

        if (tempID.includes(this.values[i].AuthorizedByUserMasterId)) {
          this.notifications.create('Oops!', 'Repeated user found!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          return;
        }
        sequence.push(0);
        userid.push(this.values[i].AuthorizedByUserMasterId);
        fromamount.push(this.values[i].FromAmount);
        toamount.push(this.values[i].ToAmount);
        requiredmessage.push(this.values[i].RequiredAuthorizationMessage);
        tempID.push(this.values[i].AuthorizedByUserMasterId);

      }
    }

    if (userid.length == 0) {
      this.notifications.create(
        'Error',
        'Please add authorization person.',
        NotificationType.Bare,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      return;
    }

    let body;
    body = {
      AuthorizationMasterID: this.addauthperson.value.AuthorizationMasterID,
      AuthorizedByUserMasterId: userid,
      AuthorizationCriteriaID: this.addauthperson.value.AuthorizationCriteriaID,
      companyMasterID: this.logInUserCompanyId,
      FromAmount: fromamount,
      userMasterID: [+this.logInUserId],
      ToAmount: toamount,
      SequenceNo: sequence,
      RequiredAuthorizationMessage: requiredmessage,
      createBy: this.logInUserId,
      createByIp: this.ipAddress,
    };

    this.spinner.start();
    this.api.callApi(this.constant.CREATEAUTHORIZATION, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.values = [];

          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.onSubmitHandleFunction();
          }, 3000);
        } else {
          this.handleCatchError();
          this.onSubmitHandleFunction();
        }
      },
      (err) => {
        this.handleCatchError();
        this.onSubmitHandleFunction();
      },
    );
  }

  onSubmitHandleFunction() {
    this.closeAddAuthorizationModal.nativeElement.click();
    this.ngOnInit();
    this.spinner.stop();
  }

  // edit authorizationCode

  editAuthorization(item) {
    this.editValues = [];
    Promise.all([
      this.getAuthorizationTypes(),
      this.getauthorizationcriteria(),
      // this.getuserdata(),
      this.getIPAddress(),
    ])
      .then(() => this.editdata(item.authorizationDetailsId))
      .catch((error) => {
        this.handleCatchError();
      });
  }

  editAddvalue() {
    let count = 1;
    for (var item of this.values) {
      if (!item.deleted) count++;
    }

    this.editValues.push({
      SequenceNo: count,
      AuthorizedByUserMasterId: '',
      FromAmount: 0,
      ToAmount: 0,
      RequiredAuthorizationMessage: '1',
      companyMasterID: null,
      allCompany: this.allCompany,
      allUsers: [],
      deleted: false
    });
  }

  editSelectedauthcritera(event) {
    this.editSelectedauth = event;
  }

  editRemovevalue(i) {
    this.editValues[i].deleted = true;
    // this.editValues.splice(i, 1);
  }

  editdata(AuthorizationDetailsId) {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.AUTHORIZATIONGETBYID + Number(AuthorizationDetailsId),
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe(
        async (res: any) => {
          if (res.status == 200) {
            this.formauthdata = res.data;
            if (this.formauthdata.AuthorizationCriteriaID == 5) {
              this.editSelectedauth = 5;
            } else {
              this.editSelectedauth = null;
            }
            for (let i = 0; i < this.formauthdata.SequenceNo.length; i++) {
              await this.addValuesAndSort(i);
            }
            // for (var i = 0; i < this.formauthdata.SequenceNo.length; i++) {


            //   const filterData = {
            //     companyMasterID: this.formauthdata.authorizedCompany[i],
            //   };
            //   this.spinner.start(`useredit${i}`);
            //   this.api
            //     .callApi(this.constant.GETUSER, filterData, 'POST', true, false, true)
            //     .subscribe((res1: any) => {
            //       if (res1.status == 200) {

            //         this.editValues.push({

            //           SequenceNo: this.formauthdata.SequenceNo[i],
            //           AuthorizedByUserMasterId: this.formauthdata.AuthorizedByUserMasterId[i],
            //           FromAmount: this.formauthdata.FromAmount[i],
            //           ToAmount: this.formauthdata.ToAmount[i],
            //           RequiredAuthorizationMessage:
            //             this.formauthdata.RequiredAuthorizationMessage[i],
            //           companyMasterID: this.formauthdata.authorizedCompany[i],
            //           allCompany: this.allCompany,
            //           allUsers: res1.data,
            //           deleted: false
            //         });
            //         this.editValues.sort((a, b) => a.SequenceNo - b.SequenceNo);

            //         this.spinner.stop(`useredit${i}`);
            //       }
            //     });

            //   // this.addValuess(this.formauthdata, i);

            // }

            this.loadEditModal = true;
            this.spinner.stop();
          }
        },
        (err) => {
          this.handleCatchError();
          this.spinner.stop();
        },
      );
  }

  editAuthorizationOnSubmit() {
    if (!this.editauthperson.valid) {
      return;
    }
    let sequence = [];
    let userid = [];
    let fromamount = [];
    let toamount = [];
    let requiredmessage = [];
    if (this.editValues.length == 0) {
      this.notifications.create(
        'Error',
        'Please add authorization person.',
        NotificationType.Bare,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      return;
    }
    let tempID = [];

    if (this.editSelectedauth == 5) {
      for (var i = 0; i < this.editValues.length; i++) {
        if (this.editValues[i].deleted) continue;

        if (tempID.includes(this.editValues[i].AuthorizedByUserMasterId)) {
          this.notifications.create('Oops!', 'Repeated user found!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          return;
        }

        // this.editValues[i].SequenceNo = i + 1;
        sequence.push(this.editValues[i].SequenceNo);
        userid.push(this.editValues[i].AuthorizedByUserMasterId);
        fromamount.push(this.editValues[i].FromAmount);
        toamount.push(this.editValues[i].ToAmount);
        requiredmessage.push(this.editValues[i].RequiredAuthorizationMessage);

        tempID.push(this.editValues[i].AuthorizedByUserMasterId);

      }
    } else {
      for (var i = 0; i < this.editValues.length; i++) {
        if (this.editValues[i].deleted) continue;
        if (tempID.includes(this.editValues[i].AuthorizedByUserMasterId)) {
          this.notifications.create('Oops!', 'Repeated user found!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          return;
        }
        sequence.push(0);
        userid.push(this.editValues[i].AuthorizedByUserMasterId);
        fromamount.push(this.editValues[i].FromAmount);
        toamount.push(this.editValues[i].ToAmount);
        requiredmessage.push(this.editValues[i].RequiredAuthorizationMessage);
        tempID.push(this.editValues[i].AuthorizedByUserMasterId);

      }
    }
    if (userid.length == 0) {
      this.notifications.create(
        'Error',
        'Please add authorization person.',
        NotificationType.Bare,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      return;
    }
    let body;

    body = {
      AuthorizationDetailsId: this.formauthdata.AuthorizationDetailsId,
      AuthorizationMasterID: this.formauthdata.AuthorizationMasterID,
      AuthorizedByUserMasterId: userid,
      AuthorizationCriteriaID: this.editauthperson.value.AuthorizationCriteriaID,
      userMasterID: [+this.logInUserId],
      FromAmount: fromamount,
      ToAmount: toamount,
      SequenceNo: sequence,
      RequiredAuthorizationMessage: requiredmessage,
      companyMasterID: this.logInUserCompanyId,
      createBy: this.logInUserId,
      createByIp: this.ipAddress,
    };

    this.spinner.start();
    this.api.callApi(this.constant.UPDATEAUTHORIZATION, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.editValues = []
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.onEditSubmitHandleFunction();
          }, 3000);
        } else {
          this.handleCatchError();
          this.onEditSubmitHandleFunction();
        }
      },
      (err) => {
        this.handleCatchError();
        this.onEditSubmitHandleFunction();
      },
    );
  }

  onEditSubmitHandleFunction() {
    this.closeEditAuthorizationModal.nativeElement.click();
    this.ngOnInit();
    this.spinner.stop();
  }

  //delete authorizationCode
  deleteConfirmation(id: any, authmasterid: any) {
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
          AuthorizationDetailsId: id,
          AuthMasterID: authmasterid,
          updateBy: this.logInUserId,
          updateByIp: this.ipAddress,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEAUTHORIZATION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
              this.notifications.create('Done', res.message, NotificationType.Success, {
                theClass: 'outline primary',
                timeOut: 5000,
                showProgressBar: false,
              });
            },
            (err) => {
              this.handleCatchError();
              this.spinner.stop();
            },
          );
      }
    });
  }

  handleCatchError() {
    this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }

  async addValuesAndSort(i: number) {
    const filterData = {
      companyMasterID: this.formauthdata.authorizedCompany[i],
    };

    this.spinner.start(`useredit${i}`);
    try {
      const res1: any = await this.api.callApi(this.constant.GETUSER, filterData, 'POST', true, false, true).toPromise();

      if (res1.status === 200) {
        this.editValues.push({
          SequenceNo: this.formauthdata.SequenceNo[i],
          AuthorizedByUserMasterId: this.formauthdata.AuthorizedByUserMasterId[i],
          FromAmount: this.formauthdata.FromAmount[i],
          ToAmount: this.formauthdata.ToAmount[i],
          RequiredAuthorizationMessage: this.formauthdata.RequiredAuthorizationMessage[i],
          companyMasterID: this.formauthdata.authorizedCompany[i],
          allCompany: this.allCompany,
          allUsers: res1.data,
          deleted: false
        });

        this.editValues.sort((a, b) => a.SequenceNo - b.SequenceNo);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.spinner.stop(`useredit${i}`);
    }
  }
}
