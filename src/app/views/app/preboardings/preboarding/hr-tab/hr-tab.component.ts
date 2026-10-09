import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
var Size = Quill.import('attributors/style/size');
import Quill from 'node_modules/quill';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { PreboardInfoComponent } from '../preboard-info/preboard-info.component';
import { preboardingStatusTypes } from 'src/app/constants/commonVariables';
import { ModalDirective } from 'ngx-bootstrap/modal';
Size.whitelist = [
  '8px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px',
  '34px',
  '36px',
  '38px',
  '40px',
  '42px',
  '44px',
  '46px',
  '48px',
  '50px',
];
Quill.register(Size, true);

let Font = Quill.import('formats/font');
Font.whitelist = ['inconsolata', 'roboto', 'mirza', 'arial', 'calibri'];
Quill.register(Font, true);
@Component({
    selector: 'app-hr-tab',
    templateUrl: './hr-tab.component.html',
    styleUrls: ['./hr-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HrTabComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addrequestform') addrequestform: NgForm;
  @ViewChild('addofferletter') addofferletter: NgForm;
  @ViewChild('filter') filter: NgForm;
  @ViewChild('requestformModal', { static: false }) requestformModal: ModalDirective;
  adminRoot = environment.adminRoot;
  @ViewChild(PreboardInfoComponent)
  preboardInfoComponent: PreboardInfoComponent;
  rows = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  body = {
    page: 1,
    limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    preboardingMasterID: null,
    searchQuery: '',
    startdate: '',
    enddate: '',
    designationID: null,
    preboardingstatus: '',
    branchMasterID: null,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  apiURL = environment.apiUrl;

  permissionedit: any = [];
  permissionview: any = [];
  ownerList: any;
  selectInterViewData: any;
  selectInterVireButtonPreboaringStatus: any;
  allDesignationData: any = [];
  allBranchData: any;
  allCompanyData: any = [];
  preboardingStatusTypesData: any = preboardingStatusTypes;

  allPreboaringFormData: any[];
  selectedCompany: any;
  allOfferLetter: any;
  preboarding: any;
  selectedBranch: string;
  selectedofferLetter: any;
  preboardingID: any;
  comapnyID: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {}

  ngOnInit() {
    this.selectedCompany = +localStorage.getItem('company_id');

    this.body = {
      page: 1,
      limit: 10,
      companyMasterID: +localStorage.getItem('company_id'),
      preboardingMasterID: null,
      searchQuery: '',
      startdate: '',
      enddate: '',
      designationID: null,
      preboardingstatus: '',
      branchMasterID: null,
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.checkpermission();
    this.getpreboardingdata();
    this.getcompany();
    this.selectcompany(+this.body.companyMasterID);
  }

  getcompany() {
    const body = {
      companyMasterID: this.body.companyMasterID,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allCompanyData = res.data;

          this.spinner.stop();
        }
      });
  }

  selectcompany(event) {
    this.body.designationID = null;
    this.allDesignationData = [];
    this.allBranchData = [];
    this.body.branchMasterID = '';
    this.body.preboardingMasterID = '';
    this.allPreboaringFormData = [];

    if (event) {
      this.body.companyMasterID = event;
      this.spinner.start('main');
      this.api
        .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allDesignationData = res.data;
          }
          this.spinner.stop('main');
        });

      const body = { companyMasterID: event };
      this.spinner.start('main1');
      this.api
        .callApi(this.constant.GETPREBOARDINGMASTER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allPreboaringFormData = res.data;
            this.spinner.stop('main1');
          } else {
            this.spinner.stop('main1');
          }
        });

      this.spinner.start('main1');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allBranchData = res;
          this.spinner.stop('main1');
        });
    }
  }

  getpreboardingdata() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.PREBOARDINGBYCOMPANYDATA, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          console.log(res.data);
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('main');
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
              permissionval.formName == 'HRPre-BoardingRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'HRPre-BoardingRequest' &&
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
    this.requestformModal.show();
  }
  onSubmit() {
    if (!this.addrequestform.valid) {
      return;
    }

    if (this.selectInterVireButtonPreboaringStatus == this.preboardingStatusTypesData.ACCEPT) {
      let body = {
        joiningDate: this.addrequestform.value.joiningdate,
        ctc: this.addrequestform.value.ctc,
        preboardingID: this.selectInterViewData.preboardingID,
      };

      this.spinner.start('add');
      this.api.callApi(this.constant.UPDATEPREBOARDING, body, 'POST', true, true, true).subscribe(
        (res: any) => {
          this.spinner.stop('add');
        },
        (err) => {
          this.spinner.stop('add');
        },
      );
    }
    let body = {
      userMasterID:
        this.selectInterVireButtonPreboaringStatus == 'Interview'
          ? this.addrequestform.value.userMasterID
          : null,
      preboardingID: this.selectInterViewData.preboardingID,
      remarks: this.addrequestform.value.remarks,
      requeststatus: this.addrequestform.value.preboardingstatus,
    };
    this.spinner.start();
    this.api.callApi(this.constant.ADDPREBOARDINGREQUEST, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.preboardingstatuschange();
          this.commonNotificationService.handleSuccess('Pre-Boarding Updated SuccessFully');
          setTimeout(() => {
            this.spinner.stop();
            this.router.navigate([this.adminRoot + '/preboardings/hr_preboarding']).then(() => {
              this.getpreboardingdata();
              this.addModalClear();
              this.spinner.stop();
            });
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }
  onSubmit1() {
    if (!this.filter.valid) {
      return;
    }

    this.body.companyMasterID = this.filter.value.company;
    this.body.designationID = this.filter.value.designationID;
    this.body.startdate = this.filter.value.startdate;
    this.body.enddate = this.filter.value.enddate;
    this.body.preboardingMasterID = this.filter.value.preboardingform;
    this.body.preboardingstatus = this.filter.value.preboardingstatus;
    this.body.branchMasterID = this.filter.value.branchID;
    this.getpreboardingdata();
  }
  status(event: any) {
    this.selectInterVireButtonPreboaringStatus = event;
    if (this.selectInterVireButtonPreboaringStatus == this.preboardingStatusTypesData.INTERVIEW) {
      const filterData = {
        page: '',
        limit: '',
        companyMasterID: this.selectInterViewData.companyMasterID,
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
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }
  onboard(id: any) {
    this.formValueStorageService.navigate('HrTabComponent', {}, '/preboardings/user_onboard', id);
  }

  getOfferLetter(row: any) {
    this.addofferletter.resetForm();
    this.spinner.start('preb');
    this.preboardingID = row.preboardingID;
    this.comapnyID = row.companyMasterID;
    this.api
      .callApi(this.constant.PREBOARDINGGETBYID + row.preboardingID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.preboarding = res.data;
          this.spinner.stop('preb');
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop('preb');
        },
      );

    const body = { companyMasterID: row.companyMasterID };
    this.spinner.start('get');
    this.api.callApi(this.constant.GETOFFERLETTER, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.allOfferLetter = res.data;
        this.spinner.stop('get');
      },
      (err) => {
        console.log('error', err);
        this.spinner.stop('get');
      },
    );
  }

  generateOfferLetter() {
    if (!this.addofferletter.valid) return;

    const body = {
      preboardingID: this.preboarding.preboardingID,
      offerLetterID: this.addofferletter.value.offerLetterList,
    };

    this.spinner.start('generate');
    this.api.callApi(this.constant.GENERATEOFFERLETTER, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.addofferletter.resetForm();
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          this.getOfferLetter(this.preboarding);
        } else {
          this.commonNotificationService.handleError(res.message);
        }

        this.spinner.stop('generate');
      },
      (err) => {
        console.log('error', err);
        this.spinner.stop('generate');
      },
    );
  }

  downloadFile() {
    this.spinner.start('start');

    let mainbody: any = {
      companyMasterID: this.body.companyMasterID,
      preboardingMasterID: this.body.preboardingMasterID,
      searchQuery: this.body.searchQuery,
      startdate: this.body.startdate,
      enddate: this.body.enddate,
      designationID: this.body.designationID,
      preboardingstatus: this.body.preboardingstatus,
      exportData: true,
    };

    this.api
      .callApi(this.constant.PREBOARDINGBYCOMPANYDATA, mainbody, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, 'Preboarding.xlsx', 'text/xlsx'),
            this.spinner.stop('start');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  saveOfferLetter() {
    const body = {
      preboardingID: this.preboarding.preboardingID,
      offerLetterID: this.preboarding.offerLetterID,
      offerLetterHTML: this.preboarding.offerLetterHTML,
    };

    this.spinner.start('generate');
    this.api
      .callApi(this.constant.UPDATEPREBOARDINGOFFERLETTER, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          this.addofferletter.resetForm();
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            this.getOfferLetter(this.preboarding);
          } else {
            this.commonNotificationService.handleError(res.message);
          }

          this.spinner.stop('generate');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('generate');
        },
      );
  }

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }

  openViewMoreModal(row: any) {
    setTimeout(() => {
      const viewDataObj = {
        preboardingID: row.preboardingID,
        preboardingMasterID: row.preboardingMasterID,
        companyMasterID: row.companyMasterID,
        firstName: row.firstName,
        middleName: row.middleName,
        lastName: row.lastName,
        userNumberCountryMasterID: +row.userNumberCountryMasterID,
        userNumber: row.userNumber,
        dob: row.dob,
        email: row.email,
        address: row.address,
        branchMasterID: row.branchMasterID,
        designationID: row.designationID,
        employeeType: row.employeeType,
        nationality: row.nationality,
        jobApplicationID: row.jobApplicationID ? row.jobApplicationID : null,
        docUploadStatus: row.docUploadStatus ? row.docUploadStatus : null,
      };
      this.preboardInfoComponent.preboardingdata = viewDataObj;

      this.preboardInfoComponent.moreinfoModal();
    });
  }

  clear() {
    setTimeout(() => {
      this.body = {
        page: 1,
        limit: 10,
        companyMasterID: +localStorage.getItem('company_id'),
        preboardingMasterID: null,
        searchQuery: '',
        startdate: '',
        enddate: '',
        designationID: null,
        preboardingstatus: '',
        branchMasterID: null,
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }

  addModalClear() {
    this.selectInterViewData = null;
    this.ownerList = null;
    this.selectInterVireButtonPreboaringStatus = null;
    this.addrequestform.resetForm();
    this.requestformModal.hide();
  }

  sendMailForAcceptance() {
    const body = {
      preboardingID: this.preboardingID,
      comapnyID: this.comapnyID,
    };
    this.api
      .callApi(this.constant.SENDEMAILFORACCEPTANCE, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          this.addofferletter.resetForm();
          if (res.status == 200) {
            this.preboardingID = null;
            this.commonNotificationService.handleSuccess(res.message);
            this.getpreboardingdata();
          } else {
            this.commonNotificationService.handleError(res.message);
          }

          this.spinner.stop('generate');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('generate');
        },
      );
  }

  sendMailForPreBordingDocs(data: any) {
    const body = {
      preboardingID: data.preboardingID,
      designationID: data.designationID || 0,
      comapnyID: data.companyMasterID,
      requiredUserType:
        data.employeeType == 'national' ? '1' : data.employeeType == 'expart' ? '2' : '3',
    };
    this.api
      .callApi(this.constant.SENDEMAILFORPREBORDINGDOCS, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          this.addofferletter.resetForm();
          if (res.status == 200) {
            this.preboardingID = null;
            this.commonNotificationService.handleSuccess(res.message);
            this.getpreboardingdata();
          } else {
            this.commonNotificationService.handleError(res.message);
          }
          this.spinner.stop('generate');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('generate');
        },
      );
  }

  downLoadOffterLetter(attachment) {
    window.open(this.apiURL + 'uploads/letter/' + attachment, '_blank');
  }
}
