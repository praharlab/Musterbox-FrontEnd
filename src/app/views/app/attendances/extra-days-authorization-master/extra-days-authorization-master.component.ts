import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ModalService } from 'src/app/services/modal.service';
import { environment } from 'src/environments/environment';
import { ExtraDaysAcceptRejectModalComponent } from './extra-days-accept-reject-modal/extra-days-accept-reject-modal.component';

@Component({
    selector: 'app-extra-days-authorization-master',
    templateUrl: './extra-days-authorization-master.component.html',
    styleUrls: ['./extra-days-authorization-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExtraDaysAUthorizationMasterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(ExtraDaysAcceptRejectModalComponent)
  ExtraDaysAcceptRejectModalComponent: ExtraDaysAcceptRejectModalComponent;

  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    user: [],
    status: null,
    userMasterID: localStorage.getItem('id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;
  selectedCompany: any;
  permissionview: any = [];
  referencedata: any = null;
  company1: any;
  ipAddress: any;
  childcompany: string;
  company_id: string;
  usertype: any;
  selected = [];
  alluser: any;
  allbranch: any;
  scrollBarHorizontal = window.innerWidth < 1201;
  rows = [];
  apiURL = environment.apiUrl;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
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

    this.checkpermission();

    this.getIPAddress();
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');

    this.usertype = localStorage.getItem('usertype');
    this.getcompany();
    this.selectedCompany = +localStorage.getItem('company_id');
    this.selectcompany(this.company_id);
    this.getauthrequestdata();
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
    this.spinner.start('getauthrequestdata');
    this.api
      .callApi(
        this.constant.VIEWEXTRADAYAUTHORIZATIONBYUSERID,
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
            this.spinner.stop('getauthrequestdata');
          } else {
            this.handleError(res.message);
            this.spinner.stop('getauthrequestdata');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('getauthrequestdata');
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
        .callApi(this.constant.GETCOMPENSATORYOFFAUTORIZEDUSER, body, 'POST', true, false, true)
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
        .callApi(
          this.constant.GETCOMPENSATORYOFFAUTORIZEDUSER,
          filterData,
          'POST',
          true,
          false,
          true,
        )
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
        .callApi(this.constant.GETCOMPENSATORYOFFAUTORIZEDUSER, body, 'POST', true, false, true)
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

  clear() {
    this.datefilter.resetForm();

    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getauthrequestdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
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
              permissionval.formName == 'ExtraDaysAuthorization' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  showdata(row) {
    let extraDaysID = row.extraDaysID;
    this.referencedata = null;
    this.api
      .callApi(
        this.constant.GETEXTRADAYSAUTHORIZATIONBYID + extraDaysID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.referencedata = res.data;
          this.spinner.stop();
        }
      });
  }

  openAcceptModalAndSubmit(extraDaysAuthorizationID: any, extraDaysID: any) {
    this.ExtraDaysAcceptRejectModalComponent.alertAcceptConfirmation(
      extraDaysAuthorizationID,
      extraDaysID,
    );
  }
  openRejectModalAndSubmit(extraDaysAuthorizationID: any, extraDaysID: any) {
    this.ExtraDaysAcceptRejectModalComponent.alertRejectConfirmation(
      extraDaysAuthorizationID,
      extraDaysID,
    );
  }

  onPageChange(data) {
    this.filterData.page = data.page;
    this.filterData.limit = data.itemsPerPage;
    this.getauthrequestdata();
  }
  getBranchName(row: any): string {
    return row?.extraDay?.userMaster?.employeeBranches?.[0]?.branchMaster?.branchName || '';
  }
  getEmployeeCode(row: any): string {
    return row?.extraDay?.userMaster?.employeeJoiningDetails?.[0]?.employeeCode || '';
  }

  getDepartmentName(row: any): string {
    return row?.extraDay?.userMaster?.employeeDepartments?.[0]?.department?.departmentName || '';
  }

  getDesignationName(row: any): string {
    return row?.extraDay?.userMaster?.employeeDesignations?.[0]?.designation?.designationName || '';
  }

  getDivisionName(row: any): string {
    return row?.extraDay?.userMaster?.employeeDivisions?.[0]?.division?.divisionName || null;
  }
  getWorkingAreaName(row: any): string {
    return (
      row?.extraDay?.userMaster?.employeeWorkingAreas?.[0]?.workingArea?.workingAreaName || null
    );
  }
}
