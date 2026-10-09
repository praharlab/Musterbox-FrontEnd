import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ModalService } from 'src/app/services/modal.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-short-leave-authorization',
    templateUrl: './list-short-leave-authorization.component.html',
    styleUrls: ['./list-short-leave-authorization.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListShortLeaveAuthorizationComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal') lgModal;
  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    user: [],
    status: 2,
    userMasterID: localStorage.getItem('id'),
  };

  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows = [];
  itemOptionsPerPage = ItemOptionsPerPageArray;

  company1: any;
  alluser: any;
  allbranch: any;
  selected = [];
  referencedata: any;
  auth_Criteria: any;
  remarks: any;

  authdata: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  modal: string = 'showData';
  scrollBarHorizontal = window.innerWidth < 1201;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private modalService: ModalService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.modalService.userRequestRefresh$.subscribe(() => {
      this.getauthrequestdata();
    });

    this.getauthrequestdata();
    this.checkpermission();
    this.getcompany();
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getauthrequestdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  getauthrequestdata() {
    this.spinner.start('main1');
    this.api
      .callApi(
        this.constant.GETSHORTLEAVEAUTHORIZATIONDATA,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.spinner.stop('main1');
          } else {
            this.handleError(res.message);
            this.spinner.stop('main1');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main1');
        },
      );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  onSubmit1() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.user =
      this.datefilter.value.name && this.datefilter.value.name.length > 0
        ? this.datefilter.value.name
        : this.selected;
    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;

    this.getauthrequestdata();
  }

  selectcompany(id) {
    if (id == undefined) {
      window.location.reload();
    } else {
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
        });
      const body = {
        companyMasterID: id,
        branchMasterID: '',
        authPersonid: localStorage.getItem('id'),
      };
      this.api
        .callApi(this.constant.GETLEAVEAUTORIZEDUSER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.alluser.map((el) => {
              el.name = el.userName;
            });

            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
            this.spinner.stop();
          }
        });
    }
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  selectbranch(id) {
    if (id != '' && id != null) {
      const filterData = {
        companyMasterID: '',
        branchMasterID: id,
        authPersonid: localStorage.getItem('id'),
      };

      this.spinner.start();
      this.api
        .callApi(this.constant.GETLEAVEAUTORIZEDUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.alluser.map((el) => {
              el.name = el.userName;
            });

            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.datefilter.value.company,
        branchMasterID: '',
        authPersonid: localStorage.getItem('id'),
      };
      this.api
        .callApi(this.constant.GETLEAVEAUTORIZEDUSER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);

            this.alluser.map((el) => {
              el.name = el.userName;
            });
            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
            this.spinner.stop();
          }
        });
    }
  }

  checkpermission() {
    this.spinner.start('permission');
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
              permissionval.formName == 'ShortLeaveAuthorization' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  showdata(row) {
    this.lgModal.show()
    this.referencedata = row;

    this.auth_Criteria =
      row.userShortLeave.userMaster.authorizationDetails &&
      row.userShortLeave.userMaster.authorizationDetails.length > 0
        ? row.userShortLeave.userMaster.authorizationDetails[0].AuthorizationCriteriaMaster
            .AuthorizationCriteria
        : null;
    this.spinner.start('show');
    this.api
      .callApi(
        this.constant.GETSHORTLEAVEAUTHORIZATIONBYID + row.referenceId,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.authdata = res.data;
          this.spinner.stop('show');
        }
      });
  }

  onSubmit() {
    const body = {
      remarks: this.remarks,
      authstatus: this.modal == 'Approve' ? 1 : 0,
      id: this.referencedata.id,
    };

    this.spinner.start('loader');
    this.api
      .callApi(this.constant.SHORTLEAVEACCEPTREJECT, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
              this.lgModal.hide()
            setTimeout(() => {
              this.modalService.refreshUserRequestStatus();
            
            }, 1000);
            this.spinner.stop('loader');
            this.modal = 'showData';
            this.remarks = '';
          } else {
            this.notifications.create('Attention!', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.spinner.stop('loader');
          }
        },
        (err) => {
          this.spinner.stop('loader');
        },
      );
  }
  openShowDataModal(row) {
    this.modal = 'showData';
    this.showdata(row);
  }
  openAcceptModalAndSubmit(row) {
    this.modal = 'Approve';
    this.showdata(row);
  }

  openRejectModalAndSubmit(row) {
    this.modal = 'Reject';
    this.showdata(row);
  }
  getBranchName(row: any): string {
    return row?.userShortLeave?.userMaster?.employeeBranches?.[0]?.branchMaster?.branchName || '';
  }
  getEmployeeCode(row: any): string {
    return row?.userShortLeave?.userMaster?.employeeJoiningDetails?.[0]?.employeeCode || '';
  }

  getDepartmentName(row: any): string {
    return (
      row?.userShortLeave?.userMaster?.employeeDepartments?.[0]?.department?.departmentName || ''
    );
  }

  getDesignationName(row: any): string {
    return (
      row?.userShortLeave?.userMaster?.employeeDesignations?.[0]?.designation?.designationName || ''
    );
  }

  getDivisionName(row: any): string {
    return row?.userShortLeave?.userMaster?.employeeDivisions?.[0]?.division?.divisionName || null;
  }
  getWorkingAreaName(row: any): string {
    return (
      row?.userShortLeave?.userMaster?.employeeWorkingAreas?.[0]?.workingArea?.workingAreaName || null
    );
  }
}
