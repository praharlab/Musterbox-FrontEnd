import { Component, ViewChild, OnInit, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-overtimerequest',
    templateUrl: './overtimerequest.component.html',
    styleUrls: ['./overtimerequest.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OvertimerequestComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('accept') accept: NgForm;
  @ViewChild('reject') reject: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('datefilter') datefilter: NgForm;
  rows = [];
  rows1: any = [];
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
    companyMasterID: '',
    branchMasterID: '',
    userMasterID: [],
    authuser: localStorage.getItem('id'),
    startdate: '',
    enddate: '',
    status: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  referencedata: any;
  authdata: any;
  rejecteddata: any;
  acceptedata: any;
  updatetimein: any;
  updatetimeout: any;
  updateovertimemin: any;
  company_id: string;
  company1: any;
  allbranch: any;
  empList: any;
  branch: any;
  // filter: string;
  limit = 10;
  auth_creteria: any;
  updateinovertimedatetime: any;
  updateoutovertimedatetime: any;

  selectedItems: any[] = [];
  allSelected: boolean = false;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private datePipe: DatePipe,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: '',
      branchMasterID: '',
      userMasterID: [],
      authuser: localStorage.getItem('id'),
      startdate: '',
      enddate: '',
      status: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.company_id = localStorage.getItem('company_id');

    this.getauthrequestdata();
    this.checkpermission();
    this.getcompany();
  }

  getauthrequestdata() {
    this.allSelected = false;
    this.selectedItems = [];
    this.filterData.status = this.activatedRoute.snapshot.params.id;
    this.spinner.start('main');

    this.api
      .callApi(
        this.constant.AUTHREQUESTDATABYUSEROVERTIME,
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

            for (let i = 0; i < this.rows.length; i++) {
              if (this.rows[i].overTimeCalculation.attendanceTransaction == null) {
                this.rows[i].indatetime = null;
                this.rows[i].outdatetime = null;
              } else {
                this.rows[i].indatetime =
                  this.rows[i].overTimeCalculation.attendanceTransaction.InDatetime;
                this.rows[i].outdatetime =
                  this.rows[i].overTimeCalculation.attendanceTransaction.OutDateTime;
              }
            }

            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop('main');
          } else {
            this.handleError(res.message);
            this.spinner.stop('main');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main');
        },
      );
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
          this.branch = res;
        });

      const body = {
        companyMasterID: id,
        branchMasterID: '',
        authPersonid: localStorage.getItem('id'),
      };
      this.api
        .callApi(this.constant.GETOVERTIMEAUTHORIZEDUSER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.empList = res.data;
            this.selectAllForDropdownItems(this.empList);

            this.empList.map((el) => {
              el.name = el.userName;
            });

            let data1 = [];
            this.empList.forEach(async (rating) => {
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
        .callApi(this.constant.GETOVERTIMEAUTHORIZEDUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.empList = res.data;
            this.selectAllForDropdownItems(this.empList);
            this.empList.map((el) => {
              el.name = el.userName;
            });

            let data1 = [];
            this.empList.forEach(async (rating) => {
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
        .callApi(this.constant.GETOVERTIMEAUTHORIZEDUSER, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.empList = res.data;
            this.selectAllForDropdownItems(this.empList);

            this.empList.map((el) => {
              el.name = el.userName;
            });
            let data1 = [];
            this.empList.forEach(async (rating) => {
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
              permissionval.formName == 'OvertimeRequest' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OvertimeRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OvertimeRequest' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  onSubmit2() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.companyMasterID = this.datefilter.value.company;
    this.filterData.branchMasterID = this.datefilter.value.branch;
    if (this.datefilter.value.employee == null || this.datefilter.value.employee == '') {
      this.filterData.userMasterID = this.selected;
    } else {
      this.filterData.userMasterID = this.datefilter.value.employee;
    }
    if (this.datefilter.value.startdate == null || this.datefilter.value.startdate == '') {
      this.filterData.startdate = '';
    } else {
      this.filterData.startdate = this.datefilter.value.startdate;
    }
    if (this.datefilter.value.enddate == null || this.datefilter.value.enddate == '') {
      this.filterData.enddate = '';
    } else {
      this.filterData.enddate = this.datefilter.value.enddate;
    }

    this.getauthrequestdata();
  }

  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.rows.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
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

  showdata(row) {
    this.referencedata = row.overTimeCalculation;
    this.auth_creteria = row.Auth_Criteria;

    this.spinner.start('show');
    this.api
      .callApi(
        this.constant.AUTHREQUESTDATABYREFERANCEOVERTIME + row.ReferenceID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.authdata = res.data;
            this.spinner.stop('show');
          } else {
            this.handleError(res.message);
            this.spinner.stop('show');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('show');
        },
      );
  }

  alertDeactiveConfirmation(row) {
    this.acceptedata = row;
    if (this.acceptedata.overTimeCalculation.UpdateTimeIn == null) {
      this.updatetimein = this.acceptedata.overTimeCalculation.OverTimeIn;
    } else {
      this.updatetimein = this.acceptedata.overTimeCalculation.UpdateTimeIn;
    }
    if (this.acceptedata.overTimeCalculation.UpdateTimeOut == null) {
      this.updatetimeout = this.acceptedata.overTimeCalculation.OverTimeOut;
    } else {
      this.updatetimeout = this.acceptedata.overTimeCalculation.UpdateTimeOut;
    }
    if (this.acceptedata.overTimeCalculation.UpdateOverTimeHourAndMin == null) {
      this.updateovertimemin = this.acceptedata.overTimeCalculation.OverTimeHourAndMin;
    } else {
      this.updateovertimemin = this.acceptedata.overTimeCalculation.UpdateOverTimeHourAndMin;
    }
    if (
      this.acceptedata.overTimeCalculation.OverTimeInDateTime == null ||
      this.acceptedata.overTimeCalculation.OverTimeInDateTime == ''
    ) {
      this.updateinovertimedatetime = null;
    } else {
      this.updateinovertimedatetime = this.acceptedata.overTimeCalculation.OverTimeInDateTime;
    }

    if (
      this.acceptedata.overTimeCalculation.OverTimeOutDateTime == null ||
      this.acceptedata.overTimeCalculation.OverTimeOutDateTime == ''
    ) {
      this.updateoutovertimedatetime = null;
    } else {
      this.updateoutovertimedatetime = this.acceptedata.overTimeCalculation.OverTimeOutDateTime;
    }
  }
  alertActiveConfirmation(id: any) {
    this.rejecteddata = id;
  }
  onSubmit() {
    const body = {
      AuthorizationRequestId: this.acceptedata.AuthorizationRequestId,
      authstatus: 1,
      remarks: this.accept.value.remarks,
      ReferenceID: this.acceptedata.ReferenceID,
      UpdateTimeIn: this.updatetimein,
      UpdateTimeOut: this.updatetimeout,
      UpdateTimeInDateTime: this.updateinovertimedatetime,
      UpdateTimeOutDateTime: this.updateoutovertimedatetime,
      UpdateOverTimeHourAndMin: this.accept.value.UpdateOverTimeHourAndMin,
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
    };
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTOVERTIME, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
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

  onSubmit1() {
    const body = {
      AuthorizationRequestId: this.rejecteddata.AuthorizationRequestId,
      authstatus: 0,
      remarks: this.reject.value.remarks,
      ReferenceID: this.rejecteddata.ReferenceID,
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
    };

    this.spinner.start('submit1');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTOVERTIME, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create(
              'Done',
              'Overtime rejected successfully.',
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
  minchange(ev: any) {
    let date = moment(this.updatetimein, 'HH:mm a').add(ev.target.value, 'minutes').format('LT');
    this.updatetimeout = date;
    if (this.updateoutovertimedatetime != null) {
      let updatedatetime = new Date(this.updateinovertimedatetime);
      this.updateoutovertimedatetime = updatedatetime.setMinutes(
        updatedatetime.getMinutes() + Number(this.accept.value.UpdateOverTimeHourAndMin),
      );
    }
  }

  selectAll(event: any) {
    this.allSelected = event.target.checked;
    this.rows.forEach((row) => (row.selected = this.allSelected));
    this.updateSelectedItems();
  }

  selectRow(row: any, event: any) {
    row.selected = event.target.checked;
    this.updateSelectedItems();
    this.cd.detectChanges();
  }

  private updateSelectedItems() {
    this.selectedItems = this.rows.filter((row) => row.selected);
  }

  approveRequest() {
    let authorizationDataForApprove = [];

    this.selectedItems.forEach((item) => {
      authorizationDataForApprove.push({
        AuthorizationRequestId: item.AuthorizationRequestId,
        ReferenceID: item.ReferenceID,
      });
    });

    const body = {
      authorizationData: authorizationDataForApprove,
      authstatus: 1,
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
    };

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTOVERTIME, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.allSelected = false;
              this.selectedItems = [];
              this.getauthrequestdata();
              this.spinner.stop('submit');
            }, 3000);
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

  rejectRequest() {
    const authorizationDataforReject = [];

    this.selectedItems.forEach((item) => {
      authorizationDataforReject.push({
        AuthorizationRequestId: item.AuthorizationRequestId,
        ReferenceID: item.ReferenceID,
      });
    });

    const body = {
      authorizationData: authorizationDataforReject,
      authstatus: 0,
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
    };

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTOVERTIME, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create(
              'Done',
              'Overtime rejected successfully.',
              NotificationType.Bare,
              {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              },
            );
            setTimeout(() => {
              this.allSelected = false;
              this.selectedItems = [];
              this.getauthrequestdata();
              this.spinner.stop('submit');
            }, 3000);
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
    const authorizationData = [];

    this.selectedItems.forEach((item) => {
      authorizationData.push({
        AuthorizationRequestId: item.AuthorizationRequestId,
        ReferenceID: item.ReferenceID,
      });
    });

    const rejectData = {
      authorizationData: authorizationData,
      authstatus: 0,
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
    };

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
}
