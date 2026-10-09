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
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-gatepass-authorization',
    templateUrl: './gatepass-authorization.component.html',
    styleUrls: ['./gatepass-authorization.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GatepassAuthorizationComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('accept') accept: NgForm;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('reject') reject: NgForm;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  rows = [];
  apiURL = environment.apiUrl;
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
    status: null,
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
  referencedata: any = null;
  authdata: any;
  values: any = [];

  employee: any;
  alluser: any;
  ipAddress: any;
  allbranch: any;
  childcompany: string;
  company_id: string;

  usertype: any;
  company: any;
  company1: any;
  body: any;
  userName: any;

  authData: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
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

    this.getauthrequestdata();
    this.checkpermission();

    this.getIPAddress();
    this.childcompany = localStorage.getItem('childcompany');
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
        .callApi(this.constant.GETGATEPASSAUTORIZEDUSER, body, 'POST', true, false, true)
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
        .callApi(this.constant.GETGATEPASSAUTORIZEDUSER, filterData, 'POST', true, false, true)
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
        .callApi(this.constant.GETGATEPASSAUTORIZEDUSER, body, 'POST', true, false, true)
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
    this.api
      .callApi(
        this.constant.GATEPASSAUTHORIZATIONREQUEST,
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
              permissionval.formName == 'EmployeeGatepassRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeGatepassRequest' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }



  acceptGatePass() {
    const body = {
      AuthorizationRequestId: this.authData.AuthorizationRequestId,
      authstatus: 1,
      remarks: this.accept.value.remarks,
      ReferenceID: this.authData.ReferenceID,
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
    };
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTGATEPASS, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create(
              'Done',
              'GatePass approved successfully.',
              NotificationType.Bare,
              {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              },
            );
            setTimeout(() => {
              this.closeModal.nativeElement.click();
              this.accept.resetForm();
              this.getauthrequestdata();
              this.spinner.stop('submit');
            }, 200);
          } else {
            this.handleError(res.message);
            this.spinner.stop('submit');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('submit');
        },
      );
  }

  rejectGatePass() {
    const body = {
      AuthorizationRequestId: this.authData.AuthorizationRequestId,
      authstatus: 0,
      remarks: this.reject.value.remarks,
      ReferenceID: this.authData.ReferenceID,
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
    };

    this.spinner.start('submit1');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTGATEPASS, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create(
              'Done',
              'GatePass rejected successfully.',
              NotificationType.Bare,
              {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              },
            );

            setTimeout(() => {
              this.closeModal1.nativeElement.click();
              this.reject.resetForm();
              this.getauthrequestdata();
              this.spinner.stop('submit1');
            }, 200);

            this.spinner.stop('submit1');
          } else {
            this.handleError(res.message);
            this.spinner.stop('submit1');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('submit1');
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
    this.filterData.status = null;
    this.getauthrequestdata();
  }

  showdata(row) {
    this.authData = null
    this.referencedata = null
    this.authData = row;
    this.api
      .callApi(
        this.constant.GETGATEPASSDATABYREFERENCEID + row.ReferenceID,
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

  convertTo12HourFormat(time24: string): string {
    if (!time24) return '';
    let [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
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
    return row.employeeBranches?.[0]?.branchMaster?.branchName || '';
  }
  getEmployeeCode(row: any): string {
    return row.employeeJoiningDetails[0]?.employeeCode || '';
  }

  getDepartmentName(row: any): string {
    return row.employeeDepartments?.[0]?.department?.departmentName || '';
  }

  getDesignationName(row: any): string {
    return row.employeeDesignations?.[0]?.designation?.designationName || '';
  }

  getDivisionName(row: any): string {
    return row.employeeDivisions?.[0]?.division?.divisionName || null;
  }
  getWorkingAreaName(row: any): string {
    return row.employeeWorkingAreas?.[0]?.workingArea?.workingAreaName || null;
  }
}
