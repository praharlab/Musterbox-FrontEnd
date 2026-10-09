import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-manage-coff',
    templateUrl: './manage-coff.component.html',
    styleUrls: ['./manage-coff.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ManageCoffComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('addcoff') addcoff: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    id: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  body1 = {
    userMasterID: [],
    fromdate: '',
    searchQuery: '',
    todate: '',
    page: 1,
    limit: 10,
    companyMasterID: null,
    exportData: '',
  };
  limit = 10;
  usertype: any;
  company_id: any;
  comp: any;
  users: any;
  show: any = 'true';
  visible: boolean = false;
  selected3: any = [];
  attendanceTrans: any;
  ipAddress: any;
  finalbranch: string;
  selected: any[];
  finalholidaypolicy: string;
  allbranch: any[];
  ownerList: any[];
  alldepartment: any[];
  allcomp: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  filter: any;
  referencedata: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private http: HttpClient,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.body1 = {
      userMasterID: [],
      fromdate: '',
      searchQuery: '',
      todate: '',
      page: 1,
      limit: 10,
      companyMasterID: +localStorage.getItem('company_id'),
      exportData: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.getIPAddress();
    this.checkpermission();
  }

  getCoffData() {
    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.GETALLCOFF, this.body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if(this.rows.length > 0){
            this.showButtons.push(CommonFilterButtonFields.Excel);
          }else{
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.page.totalCount = res.totalcount;
          this.visible = true;
        }
        this.spinner.stop('getdata');
      });
  }

  showdata(row) {
    let coffMasterID = row.coffMasterID;
    this.api
      .callApi(
        this.constant.GETCOMPENSATORYOFFDATABYREFERENCEID + coffMasterID,
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

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  getuser(id1: any) {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: id1,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.users = res.data;
          this.selectAllForDropdownItems(this.users);
          let data1 = [];
          this.users.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.users.map((el) => {
            el.name = el.displayName + ' (' + el.userNumber + ')';
          });
          this.selected3 = data1;
          this.spinner.stop();
        }
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
  onSubmit(val: any) {
    this.visible = false;
    this.body1.page = 1;
    this.body1.userMasterID = val?.user;
    this.body1.fromdate = val?.startdate;
    this.body1.todate = val?.enddate;

      this.getCoffData();
  }

  onSubmit1() {
    if (!this.addcoff.valid) {
      return;
    }
    // document.getElementById('lgModal').hidden = true;

    let result = this.addcoff.value.applicableDate.substring(0, 7);
    result = result.replace('-', '');

    let body = {
      companyMasterID: this.addcoff.value.company1,
      userMasterID: this.addcoff.value.userMasterID,
      LeaveCreatedDate: this.addcoff.value.applicableDate,
      YearMM: result,
      LeaveAddNew: this.addcoff.value.balance,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.ADDCOFFMASTERWITHAUTHORIZATION, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.getCoffData();
              this.spinner.stop();
            }, 3000);
            this.addcoff.resetForm();
            this.closeModal.nativeElement.click();
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.addcoff.resetForm();
            this.closeModal.nativeElement.click();
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.addcoff.resetForm();
          this.closeModal.nativeElement.click();
          this.spinner.stop();
        },
      );
  }
  onChange(e: any) {
    this.body1.page = e.offset + 1;
    this.getCoffData();
  }

  onLimitChange(ev: any) {
    this.body1.limit = ev;
    this.getCoffData();
  }
  updateFilter(event): void {
    const val = event.target.value.toLowerCase().trim();

    let temp = {
      searchQuery: val,
      userid: this.selected3,
      page: this.body1.page,
      limit: this.body1.limit,
    };

    this.body1.searchQuery = val;

    this.visible = false;

    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOFF, this.body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });

    this.visible = true;
  }

  Approve(id: any) {
    id.updateBy = localStorage.getItem('id');
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are going to Approve these C-off',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.start();
        this.api.callApi(this.constant.ADDCOFF, id, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.getCoffData()
            this.spinner.stop();
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop();
          },
        );
      }
    });
  }
  Reject(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are going to Reject these C-off',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          coffMasterID: id,
          updateby: localStorage.getItem('id'),
        };
        this.spinner.start();
        this.api.callApi(this.constant.DELETECOFF, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.getCoffData()
            this.spinner.stop();
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop();
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

  clear() {
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.body1 = {
      userMasterID: [],
      fromdate: '',
      searchQuery: '',
      todate: '',
      page: 1,
      limit: 10,
      companyMasterID: null,
      exportData: '',
    };
    this.rows = [];
  }

  selectcompany(event) {
    this.finalbranch = '';
    this.selected = [];
    this.finalholidaypolicy = '';
    this.allbranch = [];
    this.ownerList = [];
    this.alldepartment = [];

    if (event) {
      this.company_id = event;
      const filterData = {
        companyMasterID: event,
      };
      this.spinner.start('user');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.displayName + ' (' + el.userNumber + ')';
            });
            let data1 = [];
            this.ownerList.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected3 = data1;

            this.spinner.stop('user');
          }
        });

      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop('branch');
        });

        this.getCoffData();
    }
  }

  selectbranch(event) {
    this.selected = [];
    this.finalholidaypolicy = '';

    if (event) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: event,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.displayName + ' (' + el.userNumber + ')';
            });
            let data1 = [];
            this.ownerList.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected3 = data1;
            this.spinner.stop();
          }
        });
    } else {
      const filterData = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
            });
            this.spinner.stop();
          }
        });
    }
  }

  downloadExcel() {
    this.spinner.start('download');

    this.body1.exportData = 'true';
    this.api
      .callApi(this.constant.GETALLCOFF, this.body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Compensatory Off.xlsx');
    this.spinner.stop('download');
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
              permissionval.formName == 'CompensatoryOff' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CompensatoryOff' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CompensatoryOff' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CompensatoryOff' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
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

  clearLgmodalForm() {
    this.addcoff.resetForm();
  }

  getCompany(companyMasterID: number){
    this.body1.companyMasterID = companyMasterID;
    this.getCoffData()
  }
}
