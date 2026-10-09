import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-manage-panelty',
    templateUrl: './manage-panelty.component.html',
    styleUrls: ['./manage-panelty.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ManagePaneltyComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode.force;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  page = {
    totalCount: 0,
    offset: 0,
  };
  body1 = {
    companyMasterID: '',
    userMasterID: '',
    fromdate: '',
    todate: '',
    showonlypanelty: '',
    page: 1,
    limit: 10,
    searchQuery: '',
  };
  show: any = true;
  ipAddress: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  start_date: any;
  end_date: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.getIPAddress();
    this.checkpermission();
  }

  onSubmit(val?: any) {
    this.body1.companyMasterID = val?.company;
    this.body1.userMasterID = val?.user;
    this.body1.fromdate = this.formatDate(new Date(val?.startdate));
    this.body1.todate = this.formatDate(new Date(val?.enddate));
    this.body1.showonlypanelty = String(val?.showonlypanelty);

    this.getAttendanceData();
  }

  getAttendanceData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETATTENDANCETRANS, this.body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  onChange(e: any) {
    this.body1.page = e.offset + 1;
    this.getAttendanceData();
  }

  Delete_Penalty(transID: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are going to remove Penalty',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        let body = {
          AttendanceTransID: transID,
          upateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };

        this.spinner.start();
        this.api
          .callApi(this.constant.REMOVEPENALTY, body, 'POST', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.getAttendanceData();
              this.spinner.stop();
            }
          });
      }
    });
  }

  onLimitChange(ev: any) {
    this.body1.limit = ev;
    this.getAttendanceData();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PenaltyManagement' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PenaltyManagement' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PenaltyManagement' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PenaltyManagement' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  clear() {
    this.rows = []
    this.body1 = {
      companyMasterID: '',
      userMasterID: '',
      fromdate: '',
      todate: '',
      showonlypanelty: '',
      page: 1,
      limit: 10,
      searchQuery: '',
    };

    this.start_date = '';
    this.end_date = '';
  }

  getCompany(companyMasterID: string) {
    setTimeout(() => {
      this.show = true
      this.end_date = new Date();
      this.start_date = this.formatDate(new Date(this.end_date.getFullYear(), this.end_date.getMonth(), 2));
      this.end_date = this.formatDate(this.end_date);
      this.body1.companyMasterID = companyMasterID;
      this.body1.fromdate = this.start_date;
      this.body1.todate = this.end_date;
      // this.getAttendanceData();
    });
  }

  formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  init(val: any) {
    this.body1.userMasterID = val.map((x) => x.userMasterID)
    this.getAttendanceData();
  }
}
