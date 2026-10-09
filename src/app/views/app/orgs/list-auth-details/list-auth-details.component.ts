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
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-auth-details',
    templateUrl: './list-auth-details.component.html',
    styleUrls: ['./list-auth-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAuthDetailsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Cancel];

  adminRoot = environment.adminRoot;

  itemOptionsPerPage = ItemOptionsPerPageArray;

  rows: any = [];
  filterData = {
    userMasterID: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  apiURL = environment.apiUrl;

  ipAddress: any;
  permissionview: any = [];

  permissioncreate: any = [];
  permissionedit: any = [];

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
    this.getIPAddress();
    this.checkpermission();
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
  
  onSubmit(val?: any) {
    this.filterData.userMasterID = val.user;
    this.spinner.start('getAll');
    this.api
      .callApi(this.constant.GETALLAUTHDETAILS, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = this.rows.length;
        } else {
        }
        this.spinner.stop('getAll');
      });
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/orgs/replaceAuthDetails']);
  }

  clear(){
    this.rows = [];
    this.filterData.userMasterID = null;
  }
}
