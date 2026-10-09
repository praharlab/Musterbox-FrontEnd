import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
// import { LeaveAcceptRejectModalComponent } from './leave-accept-reject-modal/leave-accept-reject-modal.component';
import { ModalService } from 'src/app/services/modal.service';
import { OutdoorDutyAcceptRejectModalComponent } from './outdoor-duty-accept-reject-modal/outdoor-duty-accept-reject-modal.component';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-outdoor-duty-authorization',
    templateUrl: './outdoor-duty-authorization.component.html',
    styleUrls: ['./outdoor-duty-authorization.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OutdoorDutyAuthorizationComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('accept') accept: NgForm;
  @ViewChild('datefilter') datefilter: NgForm;

  @ViewChild(OutdoorDutyAcceptRejectModalComponent)
  outdoorDutyAcceptRejectModalComponent: OutdoorDutyAcceptRejectModalComponent;

  rows = [];
  rows1 = [];
  apiURL = environment.apiUrl;
  columns = [];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    user: [],
    status: 2,
    userMasterID: localStorage.getItem('id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  referencedata: any;
  authdata: any;
  alldates: any = [];
  LeaveType: any = [];
  values: any = [];
  leavedata: any = [];
  alluser: any;
  allbranch: any;
  company_id: string;
  usertype: any;
  company: any;
  company1: any;
  body: any;
  userName: any;
  auth_Criteria: any;

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

  ngOnInit() {
    this.filterData = {
      page: 1,
      limit: 10,
      startdate: '',
      enddate: '',
      user: [],
      status: 2,
      userMasterID: localStorage.getItem('id'),
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.limit = 10;

    this.modalService.userRequestRefresh$.subscribe(() => {
      this.getauthrequestdata();
    });

    this.getauthrequestdata();
    this.checkpermission();
    this.company_id = localStorage.getItem('company_id');

    this.usertype = localStorage.getItem('usertype');
    this.getcompany();
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

  getauthrequestdata() {
    this.spinner.start('main1');
    // this.filterData.status = this.activatedRoute.snapshot.params.id;
    this.api
      .callApi(this.constant.LISTOURDOORDUTYAUTHREQUEST, this.filterData, 'POST', true, false, true)
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
              permissionval.formName == 'OutdoorDutyAuthorization' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getauthrequestdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
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

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  showdata(row) {
    this.referencedata = row;

    this.auth_Criteria = row.userLeave.userMaster.authorizationDetails && row.userLeave.userMaster.authorizationDetails.length > 0 ? row.userLeave.userMaster.authorizationDetails[0].AuthorizationCriteriaMaster.AuthorizationCriteria : null;
    this.spinner.start('show')
    this.api
      .callApi(
        this.constant.LEAVEAUTHREQUESTDATABYREFERANCE + row.ReferenceID,
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

  onSubmit1() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.user = this.datefilter.value.name && this.datefilter.value.name.length > 0 ? this.datefilter.value.name : this.selected;
    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;

    this.getauthrequestdata();

  }


  clear() {
    this.datefilter.resetForm();

    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  openAcceptModalAndSubmit(row: any) {
    this.outdoorDutyAcceptRejectModalComponent.alertAcceptConfirmation(row.AuthorizationRequestId);
  }

  openRejectModalAndSubmit(row: any) {
    this.outdoorDutyAcceptRejectModalComponent.alertRejectConfirmation(row.AuthorizationRequestId);
  }
  getBranchName(row: any): string {
    return row?.userLeave?.userMaster?.employeeBranches?.[0]?.branchMaster?.branchName || '';
  }
  getEmployeeCode(row: any): string {
    return row?.userLeave?.userMaster?.employeeJoiningDetails?.[0]?.employeeCode || '';
  }

  getDepartmentName(row: any): string {
    return row?.userLeave?.userMaster?.employeeDepartments?.[0]?.department?.departmentName || '';
  }

  getDesignationName(row: any): string {
    return (
      row?.userLeave?.userMaster?.employeeDesignations?.[0]?.designation?.designationName || ''
    );
  }

  getDivisionName(row: any): string {
    return row?.userLeave?.userMaster?.employeeDivisions?.[0]?.division?.divisionName || null;
  }
  getWorkingAreaName(row: any): string {
    return (
      row?.userLeave?.userMaster?.employeeWorkingAreas?.[0]?.workingArea?.workingAreaName || null
    );
  }
}
