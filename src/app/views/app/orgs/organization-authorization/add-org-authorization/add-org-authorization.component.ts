import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { authorizationCriteriaType, officeExpenseTypeArray, officeExpenseTypes } from 'src/app/constants/commonVariables';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-org-authorization',
    templateUrl: './add-org-authorization.component.html',
    styleUrls: ['./add-org-authorization.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddOrgAuthorizationComponent implements OnInit {
  @ViewChild('addOrgAuth') addOrgAuth: NgForm;
  orgAuthtypes: any = []
  values: any = []
  adminRoot = environment.adminRoot
  allcomp: any = []
  allCompany: any = []
  allbranch: any = []
  allSites: any = []
  authcritera: any = []
  usertype: any
  company_id: any
  selectedauth: any
  officeExpenseTypeArrayData = officeExpenseTypeArray;
  officeExpenseTypes = officeExpenseTypes;
  selectedSite: any
  selectedBranch: any

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = +localStorage.getItem('company_id')

    this.getOrgAuthorizationTypeData()
    this.getcompany();
    this.get_Company();
    this.getauthorizationcriteria()
  }

  onSubmit() {
    if (!this.addOrgAuth.valid) return;

    if(this.selectedauth == authorizationCriteriaType.ANYTWO && this.values.length < 2){
      this.commonNotificationService.handleWarning('Please select atleast 2 Authorizers!');
      return;
    }
    if(this.selectedauth == authorizationCriteriaType.ANYTHREE && this.values.length < 3){
      this.commonNotificationService.handleWarning('Please select atleast 3 Authorizers!');
      return;  
    }

    const body: any = {
      companyMasterID: this.addOrgAuth.value.company,
      branchMasterID: this.addOrgAuth.value.branch,
      siteID: this.addOrgAuth.value.site,
      orgAuthorizationTypeID: this.addOrgAuth.value.orgAuthorizationTypeID,
      AuthorizationCriteriaID: this.addOrgAuth.value.AuthorizationCriteriaID
    }

    let sequence = [];
    let userid = [];
    if (this.values.length == 0) {
      this.commonNotificationService.handleError('Please add authorization person.');
      return;
    }
    let tempID = [];

    if (this.selectedauth == '5') {
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

    this.spinner.start('ADDORGANIZATIONAUTHORIZATION');
    this.api.callApi(this.constant.ADDORGANIZATIONAUTHORIZATION, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/orgs/orgAuthorization']);
            this.spinner.stop('ADDORGANIZATIONAUTHORIZATION');
          }, 3000);
        } else {
          this.commonNotificationService.handleWarning(res.message)
          this.spinner.stop('ADDORGANIZATIONAUTHORIZATION');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err)
        this.spinner.stop('ADDORGANIZATIONAUTHORIZATION');
      },
    );
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

  selectcompany(event) {
    if (!event) {
      return;
    }
    this.allbranch = [];
    this.selectedBranch = null;
    this.selectedSite = null;
    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.selectAllForDropdownItems(this.allbranch);
        this.spinner.stop('branch');
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
            this.selectcompany(this.company_id);
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
            this.selectcompany(this.company_id);
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

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  getAllSites(branchMasterID: number) {
    this.spinner.start('getAllSites');
    this.api
      .callApi(this.constant.LISTSITE, { companyMasterID: this.addOrgAuth.value.company, branchMasterID: branchMasterID }, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.allSites = res.data;
        this.spinner.stop('getAllSites');
      });
  }

  selectBranch(branchMasterID){
    this.getAllSites(branchMasterID);
  }

}
