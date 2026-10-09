import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { PreboardInfoComponent } from '../preboard-info/preboard-info.component';
import { preboardingStatusTypes } from 'src/app/constants/commonVariables';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
    selector: 'app-user-tab',
    templateUrl: './user-tab.component.html',
    styleUrls: ['./user-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserTabComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addrequestform') addrequestform: NgForm;
  @ViewChild('requestformModal', { static: false }) requestformModal: ModalDirective;

  adminRoot = environment.adminRoot;
  @ViewChild(PreboardInfoComponent)
  preboardInfoComponent: PreboardInfoComponent;
  rows = [];
  apiURL = environment.apiUrl;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows1: any = [];

  permissionedit: any = [];
  permissionview: any = [];
  ownerList: any;
  selectInterViewData: any;
  selectInterVireButtonPreboaringStatus: any;
  editpreboardingdatavalue: any;
  body = {
    page: 1,
    limit: 10,
    userMasterID: localStorage.getItem('id'),
    searchQuery: '',
  };
  preboardingStatusTypesData: any = preboardingStatusTypes

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.checkpermission();
    this.getpreboardingdata();
  }

  getpreboardingdata() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.PREBOARDINGBYUSER, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          this.spinner.stop('main');
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

          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'UserPre-BoardingRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'UserPre-BoardingRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event: any): void {
    if (event.target) {
      const val = event.target.value.toLowerCase().trim();
      this.body.searchQuery = val;
    }
    this.getpreboardingdata();
  }

  onChange(e: any) {
    this.body.page = e.offset + 1;
    this.getpreboardingdata();
  }

  onLimitChange(ev: any) {
    this.body.limit = ev;
    this.getpreboardingdata();
  }

  onSelectInterViewButton(item) {
    this.selectInterViewData = item;
    this.requestformModal.show()
  }

  onSubmit() {
    if (!this.addrequestform.valid) {
      return;
    }
    if (this.selectInterVireButtonPreboaringStatus == this.preboardingStatusTypesData.INTERVIEW) {
      let body = {
        userMasterID: this.addrequestform.value.userMasterID,
        preboardingID: this.selectInterViewData.preboardingID,
        remarks: this.addrequestform.value.remarks,
        requeststatus: this.addrequestform.value.preboardingstatus,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.ADDPREBOARDINGREQUEST, body, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.preboardingstatuschange();
              this.commonNotificationService.handleSuccess(res.message)

              setTimeout(() => {
                this.spinner.stop();
                this.router
                  .navigate([this.adminRoot + '/preboardings/user_preboarding'])
                  .then(() => {
                    this.getpreboardingdata();
                    this.addModalClear()
                    this.spinner.stop();
                  });
              }, 3000);
            } else {
              this.commonNotificationService.handleError(res.message)
              this.spinner.stop();
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message)
            this.spinner.stop();
          },
        );
    } else {
      let body = {
        preboardingID: this.selectInterViewData.preboardingID,
        remarks: this.addrequestform.value.remarks,
        requeststatus: this.addrequestform.value.preboardingstatus,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.ADDPREBOARDINGREQUEST, body, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.preboardingstatuschange();
              this.commonNotificationService.handleSuccess(res.message)
              setTimeout(() => {
                this.spinner.stop();
                this.router
                  .navigate([this.adminRoot + '/preboardings/user_preboarding'])
                  .then(() => {
                    this.getpreboardingdata();
                    this.addModalClear()
                    this.spinner.stop();
                  });
              }, 3000);
            } else {
              this.commonNotificationService.handleError(res.message)
              this.spinner.stop();
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message)
            this.spinner.stop();
          },
        );
    }
  }

  status(event: any) {
    this.selectInterVireButtonPreboaringStatus = event;
    if (this.selectInterVireButtonPreboaringStatus == this.preboardingStatusTypesData.INTERVIEW) {
      const filterData = {
        page: '',
        limit: '',
        companyMasterID: this.selectInterViewData.preboarding?.companyMasterID,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.spinner.stop();
          }
        });
    } else {
      this.ownerList = null;
    }
  }
  preboardingstatuschange() {
    let body = {
      preboardingID: this.selectInterViewData.preboardingID,
      preboardingstatus: this.addrequestform.value.preboardingstatus,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEPREBOARDING, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          let body1 = {
            preboardingRequestID: this.selectInterViewData.preboardingRequestID,
            requeststatus: 'Interview Completed',
          };
          this.api
            .callApi(this.constant.UPDATEPREBOARDINGREQUEST, body1, 'POST', true, true, true)
            .subscribe((res: any) => { });
        } else {
          this.commonNotificationService.handleError(res.message)
          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
        this.spinner.stop();
      },
    );
  }

  openViewMoreModal(row: any) {
    setTimeout(() => {
      const viewDataObj = {
        preboardingID: row.preboardingID,
        preboardingMasterID: row?.preboarding?.preboardingMasterID,
        companyMasterID: row?.preboarding?.companyMasterID,
        firstName: row?.preboarding?.firstName,
        middleName: row?.preboarding?.middleName,
        lastName: row?.preboarding?.lastName,
        userNumberCountryMasterID: +row?.preboarding?.userNumberCountryMasterID,
        userNumber: row?.preboarding?.userNumber,
        dob: row?.preboarding?.dob,
        email: row?.preboarding?.email,
        address: row?.preboarding?.address,
        branchMasterID: row?.preboarding?.branchMasterID,
        designationID: row?.preboarding?.designationID,
        employeeType: row?.preboarding?.employeeType,
        nationality: row?.preboarding?.nationality,
        jobApplicationID: row?.preboarding?.jobApplicationID ? row?.preboarding?.jobApplicationID : null,
        docUploadStatus: row?.preboarding?.docUploadStatus ? row?.preboarding?.docUploadStatus : null,
      }

      this.preboardInfoComponent.preboardingdata = viewDataObj
      this.preboardInfoComponent.moreinfoModal();
    });
  }

  addModalClear() {
    this.selectInterViewData = null
    this.ownerList = null
    this.selectInterVireButtonPreboaringStatus = null
    this.addrequestform.resetForm();
    this.requestformModal.hide()
  }
}
