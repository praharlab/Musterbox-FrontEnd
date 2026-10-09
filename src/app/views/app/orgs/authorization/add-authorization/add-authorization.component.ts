import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/services/modal.service';

@Component({
    selector: 'app-add-authorization',
    templateUrl: './add-authorization.component.html',
    styleUrls: ['./add-authorization.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddAuthorizationComponent implements OnInit {
  @ViewChild('addauthperson') addauthperson: NgForm;
  adminRoot = environment.adminRoot;

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
  ownerList: any;
  selected: [];
  usertype: any;
  company_id: any;
  allcomp: any;
  allbranch: any;
  selectedBranch: any;
  selectedCompany: any;
  allCompany: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private modalService: ModalService,

  ) { }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = +localStorage.getItem('company_id');
    this.getcompany();
    this.getauthorizationcriteria();
    this.getAuthData();
    this.getuserdata();
    this.getIPAddress();
    this.selectcompany(this.company_id);
    this.get_Company();

    // this.values.push({
    //   SequenceNo: 0,
    //   AuthorizedByUserMasterId: '',
    //   FromAmount: 0,
    //   ToAmount: 0,
    //   RequiredAuthorizationMessage: '1',
    // });
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
          this.addvalue()
          this.spinner.stop('tree');
        }
      });
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
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.user = res.data;
          this.spinner.stop();
        }
      });
  }
  onSubmit() {
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
        AuthorizationMasterID: this.addauthperson.value.AuthorizationMasterID,
        AuthorizedByUserMasterId: userid,
        AuthorizationCriteriaID: this.addauthperson.value.AuthorizationCriteriaID,
        companyMasterID: this.addauthperson.value.company,
        FromAmount: fromamount,
        userMasterID: this.addauthperson.value.userMasterID,
        ToAmount: toamount,
        SequenceNo: sequence,
        RequiredAuthorizationMessage: requiredmessage,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        AuthorizationMasterID: this.addauthperson.value.AuthorizationMasterID,
        AuthorizedByUserMasterId: userid,
        AuthorizationCriteriaID: this.addauthperson.value.AuthorizationCriteriaID,
        FromAmount: fromamount,
        ToAmount: toamount,
        userMasterID: this.addauthperson.value.userMasterID,
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
    this.api.callApi(this.constant.CREATEAUTHORIZATION, body, 'POST', true, true, true).subscribe(
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
        this.notifications.create('Error', err, NotificationType.Bare, {
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
  selectedauthcritera(event) {
    this.selectedauth = event;
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

    if (!event) {
      this.selected = [];
      this.ownerList = [];
      this.allbranch = [];
      this.selectedBranch = null;
      return;
    }
    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('branch');
      });

    if (this.addauthperson && this.addauthperson.value && this.addauthperson.value.AuthorizationMasterID) {

      const filterData = {
        companyMasterID: event,
        authorizationMasterID: this.addauthperson.value.AuthorizationMasterID,
        branchMasterID: '',
      };
      this.spinner.start('emp');
      this.api
        .callApi(this.constant.GETNONAUTHORIZEDUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.displayName + ' (' + el.userNumber + ')';
            });
          }
          this.spinner.stop('emp');
        });
    }


  }

  selectbranch(event) {

    this.selected = []

    if (
      event != '' &&
      event != null &&
      this.addauthperson.value.AuthorizationMasterID != '' &&
      this.addauthperson.value.AuthorizationMasterID != null
    ) {
      const filterData = {
        companyMasterID: '',
        authorizationMasterID: this.addauthperson.value.AuthorizationMasterID,
        branchMasterID: event,
      };

      this.spinner.start();
      this.api
        .callApi(this.constant.GETNONAUTHORIZEDUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.displayName + ' (' + el.userNumber + ')';
            });
            this.spinner.stop();
          }
        });
    } else if (
      (event == '' || event == null) &&
      this.addauthperson.value.AuthorizationMasterID != '' &&
      this.addauthperson.value.AuthorizationMasterID != null &&
      this.addauthperson.value.AuthorizationMasterID != '' &&
      this.addauthperson.value.AuthorizationMasterID != null
    ) {
      const filterData = {
        companyMasterID: this.addauthperson.value.company,
        authorizationMasterID: this.addauthperson.value.AuthorizationMasterID,
        branchMasterID: '',
      };

      this.spinner.start();
      this.api
        .callApi(this.constant.GETNONAUTHORIZEDUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.displayName + ' (' + el.userNumber + ')';
            });
            this.spinner.stop();
          }
        });
    }
  }

  selectAuthmaster(event) {
    this.selectedBranch = null;
    this.ownerList = [];
    this.selected = [];
    if (!event) {


      return;
    }
    if (
      event != '' &&
      event != null &&
      this.addauthperson.value.company != '' &&
      this.addauthperson.value.company != null &&
      (this.addauthperson.value.branch == '' || this.addauthperson.value.branch == null)
    ) {
      const filterData = {
        companyMasterID: this.addauthperson.value.company,
        authorizationMasterID: event,
        branchMasterID: '',
      };

      // if (this.addauthperson.value.branch == '' || this.addauthperson.value.branch == null) {
      //   filterData.branchid = ''
      // } else {
      //   filterData.branchid = this.addauthperson.value.branch
      // }

      this.spinner.start();
      this.api
        .callApi(this.constant.GETNONAUTHORIZEDUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.displayName + ' (' + el.userNumber + ')';
            });
            this.spinner.stop();
          }
        });
    } else if (
      event != '' &&
      event != null &&
      this.addauthperson.value.company != '' &&
      this.addauthperson.value.company != null &&
      (this.addauthperson.value.branch != '' || this.addauthperson.value.branch != null)
    ) {
      const filterData = {
        companyMasterID: this.addauthperson.value.company,
        authorizationMasterID: event,
        branchMasterID: this.addauthperson.value.branch,
      };

      this.spinner.start();
      this.api
        .callApi(this.constant.GETNONAUTHORIZEDUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.displayName + ' (' + el.userNumber + ')';
            });
            this.spinner.stop();
          }
        });
    }
  }

  removevalue(i) {
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

}
