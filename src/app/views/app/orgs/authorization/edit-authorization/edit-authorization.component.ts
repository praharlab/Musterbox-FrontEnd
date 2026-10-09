import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/services/modal.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { authorizationCriteriaType } from 'src/app/constants/commonVariables';

@Component({
    selector: 'app-edit-authorization',
    templateUrl: './edit-authorization.component.html',
    styleUrls: ['./edit-authorization.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAuthorizationComponent implements OnInit {
  @ViewChild('editauthperson') editauthperson: NgForm;
  Disabled: boolean = true;
  company: any = [];
  values = [];
  authcritera: any;
  authdata: any;
  user: any;
  selectedauth: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  ipAddress: any;
  formauthdata: any;
  ownerList: any;
  allcomp: any;
  usertype: any;
  company_id: any;
  flag: boolean = false;
  adminRoot = environment.adminRoot;
  formValue: any;
  allCompany: any;
  authorizationCriteriaType = authorizationCriteriaType


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private modalService: ModalService,
    private formValueStorageService: FormValueStorageService,


  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.get_Company();
    this.getcompany();
    this.getauthorizationcriteria();
    this.getAuthData();
    this.getuserdata();
    this.getIPAddress();
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
          this.editdata();
          this.spinner.stop('tree');
        }
      });
  }
  editdata() {
    let companyid = this.formValue.ListAuthorizationComponent.id;
    this.spinner.start('main');
    this.api
      .callApi(this.constant.AUTHORIZATIONGETBYID + companyid, {}, 'GET', false, true, true)
      .subscribe(
        async (res: any) => {
          if (res.status == 200) {
            this.formauthdata = res.data;
            this.selectcompany(this.formauthdata.companyMasterID);
            if (this.formauthdata.AuthorizationCriteriaID == 5) {
              this.selectedauth = 5;
            }
            for (let i = 0; i < this.formauthdata.SequenceNo.length; i++) {
              await this.addValuesAndSort(i);
            }

            // for (var i = 0; i < this.formauthdata.SequenceNo.length; i++) {

            //   this.addValuess(this.formauthdata, i);


            // }
            // this.values = respo;
            this.spinner.stop('main');
          }
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

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;

            this.spinner.stop();
          }
        });
    }
  }
  getauthorizationcriteria() {
    this.spinner.start();
    const body = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.AUTHORIAZATIONALLDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.authcritera = res.data;
          this.spinner.stop();
        }
      });
  }
  getAuthData() {
    this.spinner.start();
    let body = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETAUTHMASTER, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.authdata = res.data;
          this.spinner.stop();
        }
      });
  }
  getuserdata() {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('getEMP');
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.user = res.data;
          this.flag = true;
          this.spinner.stop('getEMP');
        }
      });
  }
  onSubmit() {
    if (!this.editauthperson.valid) {
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
      return;
    }
    let tempID = [];

    if (this.selectedauth == '5') {
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
    if (this.childcompany == 'false') {
      body = {
        AuthorizationDetailsId: this.formauthdata.AuthorizationDetailsId,
        //  AuthorizationMasterID: this.editauthperson.value.AuthorizationMasterID,
        AuthorizationMasterID: this.formauthdata.AuthorizationMasterID,
        AuthorizedByUserMasterId: userid,
        AuthorizationCriteriaID: this.editauthperson.value.AuthorizationCriteriaID,
        //  companyMasterID: this.editauthperson.value.companyMasterID,
        companyMasterID: this.formauthdata.companyMasterID,
        //  userMasterID:this.editauthperson.value.userMasterID,
        userMasterID: this.formauthdata.userMasterID,
        FromAmount: fromamount,
        ToAmount: toamount,
        SequenceNo: sequence,
        RequiredAuthorizationMessage: requiredmessage,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        AuthorizationDetailsId: this.formauthdata.AuthorizationDetailsId,
        //  AuthorizationMasterID: this.editauthperson.value.AuthorizationMasterID,
        AuthorizationMasterID: this.formauthdata.AuthorizationMasterID,
        AuthorizedByUserMasterId: userid,
        AuthorizationCriteriaID: this.editauthperson.value.AuthorizationCriteriaID,
        //  userMasterID:this.editauthperson.value.userMasterID,
        userMasterID: this.formauthdata.userMasterID,
        FromAmount: fromamount,
        ToAmount: toamount,
        SequenceNo: sequence,
        RequiredAuthorizationMessage: requiredmessage,
        companyMasterID: localStorage.getItem('company_id'),
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEAUTHORIZATION, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
            this.buttonDisabled = false;
            this.buttonState = '';
            this.router.navigate([this.adminRoot + '/orgs/authorization']);

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
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }
  selectedauthcritera(AuthorizationCriteriaID: any) {
    this.selectedauth = AuthorizationCriteriaID;
    if(AuthorizationCriteriaID == authorizationCriteriaType.SEQUENCENO && this.formauthdata.SequenceNo.includes(0)){
      this.values = this.values?.map((val: any, index: number) => ({...val, SequenceNo: index + 1}));
    }
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
  selectcompany(event) {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: event,
    };
    this.spinner.start('startt');
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ownerList = res.data;
          this.selectAllForDropdownItems(this.ownerList);
          this.ownerList.map((el) => {
            el.name = el.displayName + ' (' + el.userNumber + ')';
          });
          this.spinner.stop('startt');
        }
      });
  }
  removevalue(i: any) {
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

  addValuess(formauthdata: any, i: any) {
    const filterData = {
      companyMasterID: formauthdata.authorizedCompany[i],
    };
    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETUSER, filterData, 'POST', true, false, true)
      .subscribe((res1: any) => {
        if (res1.status == 200) {
          this.values.push({
            SequenceNo: this.formauthdata.SequenceNo[i],
            AuthorizedByUserMasterId: this.formauthdata.AuthorizedByUserMasterId[i],
            FromAmount: this.formauthdata.FromAmount[i],
            ToAmount: this.formauthdata.ToAmount[i],
            RequiredAuthorizationMessage:
              this.formauthdata.RequiredAuthorizationMessage[i],
            companyMasterID: this.formauthdata.authorizedCompany[i],
            allCompany: this.allCompany,
            allUsers: res1.data,
            deleted: false
          });

          this.spinner.stop('users');
        }
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
        this.values.push({
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

        this.values.sort((a, b) => a.SequenceNo - b.SequenceNo);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.spinner.stop(`useredit${i}`);
    }
  }
}
