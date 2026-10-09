import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-add-bulk-short-leave-application',
    templateUrl: './add-bulk-short-leave-application.component.html',
    styleUrls: ['./add-bulk-short-leave-application.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddBulkShortLeaveApplicationComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;

  company_id: string;
  body = {
    userMasterIDs: '',
    date: '',
    type: 'bulk',
    remarks: '',
  };

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: '',
    branchStartDate: '',
    branchEndDate: ''
  }

  rows: any = [];
  scrollBarHorizontal: boolean;

  permissionview: any = [];
  maxDate: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.rows = [];

    this.users_Body = {
      companyMasterID: localStorage.getItem('company_id'),
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: '',
      branchStartDate: '',
      branchEndDate: ''
    }

    this.company_id = localStorage.getItem('company_id');

    this.maxDate = new Date().toISOString().split('T')[0];
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
              permissionval.formName == 'BulkShortLeaveApplication' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    this.rows = [];
    this.body.userMasterIDs = val.user;
    this.body.date = val.date;
    this.body.remarks = val.remarks;

    this.spinner.start();
    this.api
      .callApi(this.constant.CREATESHORTLEAVEAPPLICATION, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          this.datefilter.resetForm();
          this.ngOnInit()
        } else if (res.status == 401) {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        }
        this.spinner.stop();
      },
        (err: any) => {
          this.notifications.create('Error', err, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        });
  }

  clear() {
    this.rows = [];
  }
}
