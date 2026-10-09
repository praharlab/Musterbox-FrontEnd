import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { LeaveAcceptRejectModalComponent } from '../../attendance-common/leave-accept-reject-modal/leave-accept-reject-modal.component';
import { ModalService } from 'src/app/services/modal.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-leave-authrequest',
    templateUrl: './leave-authrequest.component.html',
    styleUrls: ['./leave-authrequest.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LeaveAuthrequestComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('accept') accept: NgForm;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('lgModal') lgModal;

  @ViewChild(LeaveAcceptRejectModalComponent)
  leaveAcceptRejectModalComponent: LeaveAcceptRejectModalComponent;

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
    status: '',
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
  sandwichvalues: any = [];
  sandwichleavedata: any = [];
  leavebalance: any = [];
  leaveappli: any;
  leavebutton = true;
  companyid: any;
  employee: any;
  alluser: any;
  ipAddress: any;
  allbranch: any;
  childcompany: string;
  company_id: string;

  usertype: any;
  company: any;
  attcomp: string;
  attyear: string;
  company1: any;
  // filter: any;
  body: any;
  userName: any;
  auth_Criteria: any;
  leaveTypes: any;
  LeaveType1: any;
  leavedata1: any = [];
  sandwichleavedata1: any = [];
  receivedData: any = '';
  flag: boolean = true;
  optionalholiday: any = [];
  optonalHolidayDates: any = [];
  alldepartment: any = [];
  alldesignation: any;
  authBody = {
    companyMasterID: localStorage.getItem('company_id'),
    branchMasterID: '',
    authPersonid: localStorage.getItem('id'),
  };
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

  async ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');

    this.filterData = {
      page: 1,
      limit: 10,
      startdate: '',
      enddate: '',
      user: [],
      status: '',
      userMasterID: localStorage.getItem('id'),
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.limit = 10;

    this.filterData.status = this.activatedRoute.snapshot.params.id;
    this.modalService.userRequestRefresh$.subscribe(() => {
      this.getauthrequestdata();
    });
    this.getIPAddress();
    this.getcompany();

    this.activatedRoute.queryParams.subscribe(async (queryParams) => {
      const queryData = queryParams['data'];
      if (queryData) {
        await this.checkpermission();
        let data: any = await this.decodeSecureFix(queryData);

        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { data: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
        if (data?.type === 'approve') {
          this.openAcceptModalAndSubmit({ AuthorizationRequestId: data.AuthorizationRequestId });
        } else if (data?.type === 'reject') {
          this.openRejectModalAndSubmit({ AuthorizationRequestId: data.AuthorizationRequestId });
        }
      } else {
        await this.checkpermission();
      }
    });
  }

  private async decodeSecureFix(brokenBase64: string) {
    const secretKey = environment.secretKeyForEncoding;

    // Convert to hex manually, since Buffer doesn't exist in Angular
    const marker = Array.from(secretKey).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');

    if (!brokenBase64.includes(marker)) {
      throw new Error("Invalid or tampered string.");
    }

    const repaired = brokenBase64.replace(marker, '');

    // Decode base64 to UTF-8 string
    const json = decodeURIComponent(escape(window.atob(repaired))); // atob returns binary string
    return JSON.parse(json);
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

  async checkpermission(): Promise<void> {
    this.spinner.start('permission');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };

    return new Promise<void>((resolve, reject) => {
      this.api
        .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
        .subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              let permission = res.data;
              this.permissiondelete = permission.filter((permissionval) => {
                return (
                  permissionval.formName === 'LeaveAuthRequest' &&
                  permissionval.operationName.includes('Delete')
                );
              });
              this.permissionedit = permission.filter((permissionval) => {
                return (
                  permissionval.formName === 'LeaveAuthRequest' &&
                  permissionval.operationName.includes('Edit')
                );
              });
              this.permissionview = permission.filter((permissionval) => {
                return (
                  permissionval.formName === 'LeaveAuthRequest' &&
                  permissionval.operationName.includes('View')
                );
              });
            }
            this.spinner.stop('permission');
            resolve();
          },
          error: (err) => {
            this.spinner.stop('permission');
            reject(err);
          }
        });
    });
  }

  view(attachment) {
    window.open(this.apiURL + 'uploads/employee-leave-attachment/' + attachment, '_blank');
  }

  openAcceptModalAndSubmit(row: any) {
    if (this.permissionview.length != 0)
      this.leaveAcceptRejectModalComponent.alertAcceptConfirmation(row.AuthorizationRequestId);
  }

  openRejectModalAndSubmit(row: any) {
    if (this.permissionview.length != 0)
      this.leaveAcceptRejectModalComponent.alertRejectConfirmation(row.AuthorizationRequestId);
  }

  selectcompany(id) {
    this.alluser = [];
    this.allbranch = [];
    if (!this.datefilter.valid) {
      return;
    }
    if (!id) return;
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
      });
    this.authBody.branchMasterID = '';
    this.authBody.companyMasterID = id;
    this.getauthUsers();
  }

  selectbranch(id) {
    this.alluser = [];
    if (id != '' && id != null) {
      this.authBody.branchMasterID = id;
      this.getauthUsers();
    } else {
      this.authBody.companyMasterID = this.datefilter.value.company;
      this.authBody.branchMasterID = '';
      this.getauthUsers();
    }
  }

  getauthUsers() {
    this.api
      .callApi(this.constant.GETLEAVEAUTORIZEDUSER, this.authBody, 'POST', true, false, true)
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

  getauthrequestdata() {
    this.spinner.start('main1');
    this.api
      .callApi(this.constant.LISTLEAVEAUTHREQUESTNEW, this.filterData, 'POST', true, false, true)
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

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
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
    this.referencedata = null;
    this.authdata = [];
    this.values = [];
    this.leavedata = [];
    this.sandwichvalues = [];
    this.sandwichleavedata = [];
    this.leavebalance = [];
    this.referencedata = row;
    // this.userName = row['userLeave.userMaster.displayName'];
    // // this.leaveTypes = row.leave;
    this.auth_Criteria =
      row.userLeave.userMaster.authorizationDetails &&
        row.userLeave.userMaster.authorizationDetails.length > 0
        ? row.userLeave.userMaster.authorizationDetails[0].AuthorizationCriteriaMaster
          .AuthorizationCriteria
        : null;

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
          this.lgModal.show();
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.user =
      this.datefilter.value.name && this.datefilter.value.name.length > 0
        ? this.datefilter.value.name
        : this.selected;
    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;
    this.filterData.status = this.datefilter.value.status;
    this.filterData.page = 1;
    this.filterData.limit = 10;
    this.rows = [];
    if (this.filterData.user.length == 0) return;

    this.getauthrequestdata();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
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
