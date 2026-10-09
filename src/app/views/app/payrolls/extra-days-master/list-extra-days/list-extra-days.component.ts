import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-extra-days',
    templateUrl: './list-extra-days.component.html',
    styleUrls: ['./list-extra-days.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListExtraDaysComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('datefilter2') datefilter2: NgForm;
  @ViewChild('addcoff') addcoff: NgForm;
  @ViewChild('lgModal2') lgModal2: ModalDirective;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  ipAddress: any;
  referencedata: any;
  page = {
    totalCount: 0,
    offset: 0,
  };
  itemOptionsPerPage = ItemOptionsPerPageArray;
  allbranch: any[];
  cancelReqBody = {
    cancelRemarks: '',
    extraDaysID: null,
  };
  rows = [];
  finalbranch: string;
  selected: any[];
  daysOptions: any = [0.5, 1, 1.5, 2];
  selectedDays: number = 0.5;
  ownerList: any[];
  selected3: any = [];
  allcomp: any;
  usertype: any;
  company_id: any;

  limit = 10;
  body1 = {
    userMasterID: [],
    fromDate: '',
    searchQuery: '',
    toDate: '',
    page: 1,
    limit: 10,
    companyMasterID: null,
    exportData: false,
  };

  scrollBarHorizontal = window.innerWidth < 1201;

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

  ngOnInit(): void {
    this.body1 = {
      userMasterID: [],
      fromDate: '',
      searchQuery: '',
      toDate: '',
      page: 1,
      limit: 10,
      companyMasterID: +localStorage.getItem('company_id'),
      exportData: false,
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


  onLimitChange(ev: any) {
    this.body1.limit = ev;
    this.getExtraDays();
  }

  selectcompany(event) {
    this.finalbranch = '';
    this.selected = [];
    this.selectedDays = 0.5;
    this.allbranch = [];
    this.ownerList = [];

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

      this.getExtraDays();
    }
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

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  clearLgmodalForm() {
    this.addcoff.resetForm();
  }

  onSubmit1() {
    if (!this.addcoff.valid) {
      return;
    }

    let body = {
      userMasterID: this.addcoff.value.userMasterID,
      date: this.addcoff.value.date,
      days: this.addcoff.value.days,
      remarks: this.addcoff.value.remarks
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.ADDEXTRADAYS, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getExtraDays();
              setTimeout(() => {
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
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
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

  selectbranch(event) {
    this.selected = [];
    this.selectedDays = 0.5;

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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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
              permissionval.formName == 'ExtraDays' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExtraDays' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExtraDays' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    // if (!this.datefilter.valid && !this.body1.exportData) {
    //   return;
    // }
    this.body1.page = 1;
    // if (this.datefilter.value.user == '') {
    //   this.datefilter.value.user = this.selected3;
    // }
    this.body1.userMasterID = val?.user;
    this.body1.fromDate = val?.fromDate;
    this.body1.toDate = val?.toDate;
    this.getExtraDays();
  }

  getExtraDays() {
    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.GETALLEXTRADAYS, this.body1, 'POST', true, false, true,  this.body1.exportData)
      .subscribe((res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.body1.exportData = false;
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `Extra Days.xlsx`);
        }else{
          if (res.status == 200) {
            this.rows = res.data;
            if(this.rows.length > 0){
              this.showButtons.push(CommonFilterButtonFields.Excel);
            }else{
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            this.page.totalCount = res.totalCount;
          }
        }
        this.spinner.stop('getdata');
      });
  }

  showdata(row) {
    let extraDaysID = row.extraDaysID;
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

  onPageChange(data) {
    this.body1.page = data.page;
    this.body1.limit = data.itemsPerPage;
    this.getExtraDays();
  }

  cancel() {
    this.cancelReqBody.cancelRemarks = this.datefilter2.value.cancelRemarks;
    this.spinner.start('delete');
    this.api
      .callApi(
        this.constant.CANCELEXTRADAYAUTHORIZATIONREQUSER,
        this.cancelReqBody,
        'POST',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.getExtraDays();
          this.lgModal2.hide();
          this.notifications.create('Done', res.message, NotificationType.Success, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('delete');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('delete');
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

  downloadExcel(val: any) {
    this.body1.exportData = true;
    this.body1.userMasterID = val?.user;
    this.body1.fromDate = val?.fromDate;
    this.body1.toDate = val?.toDate;
    this.getExtraDays();
  }

  clearCancel(){
    this.datefilter2.resetForm()
  }

  clear(){
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.rows = []
    this.body1 = {
      userMasterID: [],
      fromDate: '',
      searchQuery: '',
      toDate: '',
      page: 1,
      limit: 10,
      companyMasterID: null,
      exportData: false,
    };
  }

  cancelPopup(val){
    this.cancelReqBody.extraDaysID = val.extraDaysID;
  }

  getCompany(companyMasterID: number){
    this.body1.companyMasterID = companyMasterID;
    this.getExtraDays();
  }
}
