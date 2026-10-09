import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { authorizationCriteriaType } from 'src/app/constants/commonVariables';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-org-authorization',
    templateUrl: './edit-org-authorization.component.html',
    styleUrls: ['./edit-org-authorization.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditOrgAuthorizationComponent implements OnInit {
  
  @ViewChild('editOrgAuth') editOrgAuth: NgForm;
  
  adminRoot = environment.adminRoot;
  orgAuthtypes: any = []
  values: any = []
  allcomp: any = []
  allCompany: any = []
  allbranch: any = []
  allSites: any = []
  authcritera: any = []
  usertype: any
  company_id: any
  selectedauth: any
  formValue: any
  editData: any
  authorizationCriteriaType = authorizationCriteriaType

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.usertype = localStorage.getItem('usertype');
    this.company_id = +localStorage.getItem('company_id')
    this.getOrgAuthorizationTypeData()
    this.getcompany();
    this.get_Company();
    this.selectcompany(this.company_id);
    this.getauthorizationcriteria()
    this.editdata();
  }

  editdata() {
    let id = this.formValue?.ListOrgAuthorizationComponent?.id;
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETORGANIZATIONAUTHORIZATIONBYID + id, {}, 'GET', false, true, true)
      .subscribe(
        async (res: any) => {
          if (res.data) {
            this.editData = res.data;
            this.editData.companyMasterID = +this.editData?.companyMasterID;
            this.editData.branchMasterID = +this.editData?.branchMasterID;
            this.getAllSites(this.editData?.companyMasterID, this.editData?.branchMasterID);
            this.editData.orgAuthorizationTypeID = +this.editData?.orgAuthorizationTypeID;
            for (let i = 0; i < this.editData.SequenceNo.length; i++) {
              await this.addValuesAndSort(i);
            }
          }
          this.spinner.stop('start');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
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

  selectcompany(event) {
    if (!event) {
      this.allbranch = [];
      return;
    }
    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('branch');
      });
  }

  getOrgAuthorizationTypeData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETORGAUTHORIZATIONTYPE, {}, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.orgAuthtypes = res.data;
            this.spinner.stop('data');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('data');
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
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.authcritera = res.data;

          this.spinner.stop();
        }
      });
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
          // this.addvalue()
          this.spinner.stop('tree');
        }
      });
  }

  addvalue() {
    let count = 1;
    for (var item of this.values) {
      if (!item.deleted) count++;
    }

    this.values.push({
      SequenceNo: count,
      AuthorizedByUserMasterId: '',
      companyMasterID: null,
      allCompany: this.allCompany,
      allUsers: [],
      deleted: false
    });
  }

  removevalue(i) {
    this.values[i].deleted = true;
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

  onSubmit() {
    if (!this.editOrgAuth.valid) return;

    const valuesLength = this.values?.filter((x) => !x.deleted).length;

    if(this.editData.AuthorizationCriteriaID == authorizationCriteriaType.ANYTWO && valuesLength < 2){
      this.commonNotificationService.handleWarning('Please select atleast 2 Authorizers!');
      return;
    }
    if(this.editData.AuthorizationCriteriaID == authorizationCriteriaType.ANYTHREE && valuesLength < 3){
      this.commonNotificationService.handleWarning('Please select atleast 3 Authorizers!');
      return;  
    }

    const body: any = {
      companyMasterID: this.editData.companyMasterID,
      branchMasterID: this.editData.branchMasterID,
      orgAuthorizationTypeID: this.editOrgAuth.value.orgAuthorizationTypeID,
      AuthorizationCriteriaID: this.editOrgAuth.value.AuthorizationCriteriaID,
      organizationAuthorizationID: this.editData.organizationAuthorizationID
    }

    let sequence = [];
    let userid = [];
    if (this.values.length == 0) {
      this.commonNotificationService.handleError('Please add authorization person.');
      return;
    }
    let tempID = [];

    if (this.editData.AuthorizationCriteriaID == '5') {
      for (var i = 0; i < this.values.length; i++) {
        if (this.values[i].deleted) continue;

        if (tempID.includes(this.values[i].AuthorizedByUserMasterId)) {
          this.commonNotificationService.handleWarning('Repeated user found!');
          return;
        }

        sequence.push(this.values[i].SequenceNo);
        userid.push(this.values[i].AuthorizedByUserMasterId);
        tempID.push(this.values[i].AuthorizedByUserMasterId);

      }
    } else {
      for (var i = 0; i < this.values.length; i++) {
        if (this.values[i].deleted) continue;

        if (tempID.includes(this.values[i].AuthorizedByUserMasterId)) {
          this.commonNotificationService.handleWarning('Repeated user found!');
          return;
        }
        sequence.push(0);
        userid.push(this.values[i].AuthorizedByUserMasterId);
        tempID.push(this.values[i].AuthorizedByUserMasterId);

      }
    }
    if (userid.length == 0) {
      this.commonNotificationService.handleError('Please add authorization person.');
      return;
    }

    body.SequenceNo = sequence;
    body.AuthorizedByUserMasterId = userid;

    this.spinner.start('UPDATEORGANIZATIONAUTHORIZATIONYID');
    this.api.callApi(this.constant.UPDATEORGANIZATIONAUTHORIZATIONYID, body, 'PUT', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/orgs/orgAuthorization']);
            this.spinner.stop('UPDATEORGANIZATIONAUTHORIZATIONYID');
          }, 3000);
        } else {
          this.commonNotificationService.handleWarning(res.message)
          this.spinner.stop('UPDATEORGANIZATIONAUTHORIZATIONYID');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err)
        this.spinner.stop('UPDATEORGANIZATIONAUTHORIZATIONYID');
      },
    );
  }

  async addValuesAndSort(i: number) {
    const filterData = {
      companyMasterID: this.editData.authorizedCompany[i],
    };

    this.spinner.start(`useredit${i}`);
    try {
      const res1: any = await this.api.callApi(this.constant.GETUSER, filterData, 'POST', true, false, true).toPromise();

      if (res1.status === 200) {
        this.values.push({
          SequenceNo: this.editData.SequenceNo[i],
          AuthorizedByUserMasterId: this.editData.AuthorizedByUserMasterId[i],
          companyMasterID: this.editData.authorizedCompany[i],
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

  getAllSites(companyMasterID: number, branchMasterID: number) {
    this.spinner.start('getAllSites');
    this.api
      .callApi(this.constant.LISTSITE, { companyMasterID: companyMasterID, branchMasterID: branchMasterID }, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.allSites = res.data;
        this.spinner.stop('getAllSites');
      });
  }

  selectAuthCriteria(AuthorizationCriteriaID: any){
    if(AuthorizationCriteriaID == authorizationCriteriaType.SEQUENCENO && this.editData.SequenceNo.includes(0)){
      this.values = this.values?.map((val: any, index: number) => ({...val, SequenceNo: index + 1}));
    }
  }

}
