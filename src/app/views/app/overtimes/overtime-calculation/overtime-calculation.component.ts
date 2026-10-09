import { Component, ViewChild, OnInit, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-overtime-calculation',
    templateUrl: './overtime-calculation.component.html',
    styleUrls: ['./overtime-calculation.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OvertimeCalculationComponent implements OnInit {
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('editovertime') editovertime: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];

  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  limit = 50;
  page = {
    totalCount: 0,
    offset: 0,
  };
  filterData = {
    page: 1,
    limit: 50,
    companyMasterID: '',
    branchMasterID: '',
    yearmonth: '',
  };

  events: any;
  childcompany: any;
  company_id: any;
  cid: any;
  company: any;
  usertype: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  resultColumns: any = [];
  overtimedata: any;
  allbranch: any;
  alluser: any;
  selected: any[];
  ipAddress: any;

  showovertimeData: any;
  pendingData: any = [];

  filterData1 = {
    companyMasterID: '',
    branchMasterID: '',
    yearmonth: '',
    ratio: '',
    createBy: localStorage.getItem('id'),
    createByIp: '',
  };
  editedData: any;

  selectedItems: any[] = [];
  allSelected: boolean = false;

  showData = false;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission();
    this.getcompany();
    this.getIPAddress();
  }

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start('company');
      this.api.callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.company = res.data;
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
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('company');
      this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.company = res.data;
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
  }

  selectcompany(id) {
    if (id == undefined) {
    } else {
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
        });
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OvertimeCalculation' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OvertimeCalculation' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OvertimeCalculation' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OvertimeCalculation' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData1.companyMasterID = this.datefilter.value.cid;
    this.filterData1.branchMasterID = this.datefilter.value.branch;
    this.filterData1.yearmonth = this.datefilter.value.yyyymm.replace('-', '');
    this.filterData1.ratio = this.datefilter.value.ratio;
    this.filterData1.createByIp = this.ipAddress;

    this.spinner.start('submit');

    this.api
      .callApi(this.constant.CALCULATEOVERTIME, this.filterData1, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.getCalculatedOvertime();
            this.allSelected = false;
            this.selectedItems = [];
            this.spinner.stop('submit');
          } else {
            this.allSelected = false;
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

  getCalculatedOvertime() {
    this.filterData.companyMasterID = this.filterData1.companyMasterID;
    this.filterData.branchMasterID = this.filterData1.branchMasterID;
    this.filterData.yearmonth = this.filterData1.yearmonth;
    this.spinner.start('getdata');

    this.api
      .callApi(this.constant.GETOVERTIMECAL, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.allSelected = false;
            this.selectedItems = [];
            this.showData = this.rows.some((item) => item.paidinsalary === 'No');
            this.spinner.stop('getdata');
          } else {
            this.handleError(res.message);
            this.spinner.stop('getdata');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('getdata');
        },
      );
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getCalculatedOvertime();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getCalculatedOvertime();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showdata(row) {
    this.showovertimeData = row.overtimeData;
  }

  getpendingdata(row) {
    this.pendingData = [];

    const filterData = {
      userMasterID: row.userMasterID,
      startDate: row.startDate,
      endDate: row.endDate,
    };

    this.spinner.start('pendingdata');
    this.api
      .callApi(this.constant.GETPENDINGOVERTIME, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.pendingData = res.data;

          this.pendingData.map((e) => {
            e.punchin = e['attendanceTransaction.InDatetime']
              ? e['attendanceTransaction.InDatetime']
              : '';
            e.punchout = e['attendanceTransaction.OutDateTime']
              ? e['attendanceTransaction.OutDateTime']
              : '';
          });
          this.spinner.stop('pendingdata');
        }
      });
  }

  overtime(row) {
    this.overtimedata = row;
  }

  calculateovertime() {
    this.overtimedata.totalAmount = Math.round(
      Number(this.overtimedata.perminute_gross) *
      Number(this.overtimedata.overtime_minutes) *
      Number(this.editovertime.value.ratio),
    );
  }

  onSubmit12() {
    setTimeout(() => {
      this.updateOvertime();
    }, 100);
  }

  updateOvertime() {
    let body = {
      yyyymm: this.overtimedata.yearmonth,
      userMasterID: this.overtimedata.userMasterID,
      ratio: this.editovertime.value.ratio,
    };
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.EDITOVERTIMECALCULATION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editedData = res.data;
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });

          this.closeModal1.nativeElement.click();

          this.rows = this.rows.map((e) => {
            if (e.userMasterID == this.overtimedata.userMasterID) {
              e.ratio = this.editovertime.value.ratio;
              e.totalAmount = this.editedData.TotalAmount;
            }
            return e;
          });

          this.spinner.stop('edit');
        }
      });
  }

  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          yyyymm: id.yearmonth,
          userMasterID: [id.userMasterID],
        };
        this.spinner.start('delete');
        this.api.callApi(this.constant.DELETEOVERTIME, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getCalculatedOvertime();
              this.allSelected = false;
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });

              this.spinner.stop('delete');
            }
          },
          (err) => {
            this.spinner.stop('delete');
          },
        );
      }
    });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
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

  deleteRequest() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const overtimeCalculationBulkDelete = this.selectedItems
          .filter((item) => item.paidinsalary === 'No')
          .map((item) => parseInt(item.userMasterID, 10));

        const body = {
          userMasterID: overtimeCalculationBulkDelete,
          yyyymm: this.filterData1.yearmonth,
        };

        this.spinner.start('delete');
        this.api.callApi(this.constant.DELETEOVERTIME, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getCalculatedOvertime();
              this.allSelected = false;
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });

              this.spinner.stop('delete');
            }
          },
          (err) => {
            this.spinner.stop('delete');
          },
        );
      }
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
