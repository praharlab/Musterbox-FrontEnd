import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-replace-auth-details',
    templateUrl: './replace-auth-details.component.html',
    styleUrls: ['./replace-auth-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ReplaceAuthDetailsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  @ViewChild('addcomp2') addcomp2: NgForm;
  temp = [];
  adminRoot = environment.adminRoot;
  selected: any;

  itemsPerPage = 10;
  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  treeCompanyOwnerList: any;

  selectAllState = '';
  displayOptionsCollapsed = false;
  todoItems: any;
  rows: any = [];
  filterData = {
    findID: '',
    replaceID: '',
    companyMasterID: '',
    criteria: [],
  };
  bb = {
    companyID: localStorage.getItem('company_id'),
    assetCategoryID: 0,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  apiURL = environment.apiUrl;
  alldata1: any;
  ipAddress: any;
  current_date = new Date().toISOString().slice(0, 10);
  allbranch: any = [];
  ownerList: any;

  images: any;
  editbyid: any = [];
  permissionview: any = [];
  allcomp: any;
  allcompanytree: any;

  editTaskDATA: any;
  company_id: any;
  usertype: any;
  file: any;
  format: string;
  url: string | ArrayBuffer;
  tempIMG: any;
  today: any;
  finalholidaypolicy: string;
  finalbranch: any;
  permissioncreate: any = [1];
  authdata: any;
  selected1: string;
  permissionedit: any;

  selectTreeCompany: any;
  companyTreeOwnerList: any;
  selectTreeCompany1: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.today = new Date().toISOString().slice(0, 10);
    this.getIPAddress();
    this.checkpermission();
    this.getcompany();
    this.getcompanytree();
    this.spinner.start('getAuth');
    let body = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETAUTHMASTER, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.authdata = res.data;

          this.spinner.stop('getAuth');
        }
      });
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AuthorizationReplace' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AuthorizationReplace' &&
              permissionval.operationName.includes('Edit')
            );
          });

          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {}
  onChange(e: any) {}

  onLimitChange(ev: any) {}

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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

  getcompanytree() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETCOMPANYTREE, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcompanytree = res.data;
          this.spinner.stop();
        }
      });
  }
  onSubmit2() {
    if (!this.addcomp2.valid) {
      return;
    }

    if (Number(this.addcomp2.value.userMasterID1) == Number(this.addcomp2.value.userMasterID)) {
      this.notifications.create(
        'Error',
        'Find Employee & Replace Employee cannot be same!',
        NotificationType.Bare,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
      return;
    }

    this.filterData.findID = this.addcomp2.value.userMasterID;
    this.filterData.replaceID = this.addcomp2.value.userMasterID1;
    this.filterData.criteria = this.addcomp2.value.authorizationMasterID;

    this.spinner.start('getAll');
    this.api
      .callApi(this.constant.REPLACEAUTHDETAILS, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = this.rows.length;

          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
        } else {
        }
        this.spinner.stop('getAll');
      });
  }

  selectcompany(event) {
    this.selected = '';
    this.selected1 = '';
    this.ownerList = [];

    if (event) {
      this.company_id = event;
      const filterData = {
        companyMasterID: event,
      };
      this.spinner.start('alluser');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            // this.ownerList.map(el => {
            //   el.name = el.firstName + " " + el.lastName + " (" + el.userNumber + ")"
            // })
          }
          this.spinner.stop('alluser');
        });
    }
  }
  selectcompanyTree(event) {
    this.selectTreeCompany = '';
    this.selectTreeCompany1 = '';
    this.companyTreeOwnerList = [];
    if (event) {
      this.company_id = event;
      const filterData = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('alluser');
      this.api
        .callApi(this.constant.GETUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.companyTreeOwnerList = res.data;
            // this.ownerList.map(el => {
            //   el.name = el.firstName + " " + el.lastName + " (" + el.userNumber + ")"
            // })
          }
          this.spinner.stop('alluser');
        });
    }
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/orgs/replaceAuthDetails']);
  }
}
