import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-employeeincentive',
    templateUrl: './add-employeeincentive.component.html',
    styleUrls: ['./add-employeeincentive.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddEmployeeincentiveComponent implements OnInit {
  @ViewChild('addincentive') addincentive: NgForm;
  @ViewChild('filterform') filterform: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  ipAddress: any;
  buttonDisabled = false;
  buttonState = '';
  usertype: any;
  selected: any = [];
  company: any;
  company_id: any;
  days: any[];
  empList: any;
  list: any = [];
  selected3: any = [];
  allbranch: any;
  event: any;
  finalholidaypolicy: any;
  ownerList: any;
  finalbranch: any;
  selectedowner: any = [];
  selectedlist: any;
  selectedtype: string;
  selectedYearMonth: string;
  selectedAmount: string;
  datashow: boolean;
  permissioncreate: any = [];
  showdepart: boolean = false;
  selectedCompany: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getIPAddress();
    this.getcompany();
    this.usertype = localStorage.getItem('usertype');
    this.company_id = +localStorage.getItem('company_id');
    this.companydata(this.company_id)
    this.checkpermission();
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
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Incentive' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop();
        }
      });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  getallemployee() {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ownerList = res.data;
          this.ownerList.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.addincentive.valid) {
      return;
    }
    this.addincentive.value.yearmonth = this.addincentive.value.yearmonth.replace('-', '');
    let body = {
      amount: this.addincentive.value.amount,
      yearmonth: this.addincentive.value.yearmonth,
      incentivetypename: '',
      IncentivetypeID: this.addincentive.value.incentivetypename,
      incentiveDate: this.addincentive.value.incentiveDate,
      status: this.addincentive.value.status,
      userMasterID: this.addincentive.value.employee,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      companyMasterID: this.addincentive.value.companyMasterID,
      description: this.addincentive.value.description,
    };

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.ADDEMPLOYEEINCENTIVE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/payrolls/list-employeeincentive']);

            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }

  companydata(event: any) {
    this.ownerList = [];
    this.allbranch = [];
    this.selectedowner = [];
    this.selectedlist = '';
    this.selectedtype = '';
    this.selectedYearMonth = '';
    this.selectedAmount = '';
    if (event) {
      this.company_id = event;
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;

          this.selectAllForDropdownItems(this.allbranch);
          let data1 = [];
          this.allbranch.forEach(async (rating) => {
            data1.push(rating.branchMasterID);
          });
          this.selected3 = data1;
          this.spinner.stop('branch');
        });

      const filterData = {
        page: '',
        limit: '',
        companyMasterID: event,
      };
      this.spinner.start('emp');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.displayName;
            });

            let data1 = [];
            this.ownerList.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
          }
          this.spinner.stop('emp');
        });

      const body1 = {
        companyMasterID: event,
      };
      this.spinner.start('name');
      this.api
        .callApi(this.constant.INCENTIVETYPESWITHOUTATTNBONUS, body1, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.list = res.data;

            this.spinner.stop('name');
          }
        });
    } else {
    }
  }

  clear() {
    this.addincentive.resetForm();
    this.ownerList = [];
    this.allbranch = [];
    this.selectedowner = [];
    this.selectedlist = '';
    this.selectedtype = '';
    this.selectedYearMonth = '';
    this.selectedAmount = '';
  }

  selectbranch(event) {
    this.selected = [];
    this.finalholidaypolicy = '';
    this.selectedtype = '';
    this.selectedYearMonth = '';
    this.selectedAmount = '';

    this.ownerList = [];
    this.selectedowner = [];

    if (event) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: event.branchMasterID,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            // this.ownerList.map((el) => {
            //   el.name =
            //     el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')'
            // })
            this.ownerList.map((el) => {
              el.name = el.displayName;
            });
            this.spinner.stop();
          }
        });
    } else {
      const filterData = {
        page: '',
        limit: '',
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            // this.ownerList.map(el => {
            //   el.name = el.firstName + " " + el.lastName + " (" + el.userNumber + ")"
            // })
            this.ownerList.map((el) => {
              el.name = el.displayName;
            });
            this.spinner.stop();
          }
        });
    }
  }

  onSubmit1() {
    if (!this.filterform.valid) {
      return;
    }
    if (!this.filterform.value.show) {
      this.filterform.value.show = null;
      this.filterform.value.showinsalaryslip = false;
    }

    let body = {
      incentivetypename: this.filterform.value.incentivetypename,
      createBy: localStorage.getItem('id'),
      createByIp: this.filterform.value.createByIp,
      showinsalaryslip: this.filterform.value.showinsalaryslip,
      consider: this.filterform.value.show,
      status: this.filterform.value.status,
      companyMasterID: this.addincentive.value.companyMasterID,
      createByIP: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.INCENTIVETYPEADD, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.closeModal.nativeElement.click();

        this.filterform.resetForm();

        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  calltoshow(event) {

    if (event.target.checked == true) {
      this.datashow = true;
    } else {
      this.datashow = false;
    }
  }
}
