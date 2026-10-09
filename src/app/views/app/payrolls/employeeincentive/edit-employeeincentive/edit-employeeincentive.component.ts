import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-employeeincentive',
    templateUrl: './edit-employeeincentive.component.html',
    styleUrls: ['./edit-employeeincentive.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditEmployeeincentiveComponent implements OnInit {
  @ViewChild('editincentive') editincentive: NgForm;
  ipAddress: any;
  buttonDisabled = false;
  buttonState = '';
  empList: any;
  selected: any = [];
  company_id: any;
  company: any;
  name: any;
  employeedata: any;
  usertype: any;
  allbranch: any;
  selected3: any = [];
  event: any;
  list: any = [];
  ownerList: any;
  finalbranch: any;
  finalholidaypolicy: any;
  selectedowner: any;
  selectedlist: any;
  visible: Boolean = false;
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();


    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    let employeeincentiveID = this.formValue.ListEmployeeincentiveComponent.id;
    this.spinner.start('editdata');
    this.api
      .callApi(this.constant.GETBYID + employeeincentiveID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.start('edit1');
          this.employeedata = res.data;
          this.employeedata.userMaster.companyMasterId = Number(
            this.employeedata.userMaster.companyMasterId,
          );
          this.getallemployee(this.employeedata.userMaster.companyMasterId);
          this.spinner.stop('edit1');

          this.employeedata.userMasterID = Number(this.employeedata.userMasterID);
          let yearmonth = this.employeedata.yearmonth.toString();
          let result1 = yearmonth.slice(0, 4);
          let result2 = yearmonth.slice(4, 6);
          let result = result1 + '-' + result2;
          this.employeedata.yearmonth = result;
          this.visible = true;
        },
        (err) => {
          console.log('error', err);
        },
      );
    this.spinner.stop('editdata');
    this.getIPAddress();
    this.getcompany();
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
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop('company');
        }
      });
  }

  editdata() {
    let employeeincentiveID = this.formValue.ListEmployeeincentiveComponent.id;
    this.spinner.start('editdata');
    this.api
      .callApi(this.constant.GETBYID + employeeincentiveID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.employeedata = res.data;
          this.employeedata.userMaster.companyMasterId = Number(
            this.employeedata.userMaster.companyMasterId,
          );
          const filterData = {
            page: '',
            limit: '',
            companyMasterID: this.employeedata.userMaster.companyMasterId,
          };
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
            });

          this.employeedata.userMasterID = Number(this.employeedata.userMasterID);
          let yearmonth = this.employeedata.yearmonth.toString();
          let result1 = yearmonth.slice(0, 4);
          let result2 = yearmonth.slice(4, 6);
          let result = result1 + '-' + result2;
          this.employeedata.yearmonth = result;
        },
        (err) => {
          console.log('error', err);
        },
      );
    this.spinner.stop('editdata');
  }

  getallemployee(id: any) {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('getEMP');
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ownerList = res.data;
          this.ownerList.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
          this.spinner.stop('getEMP');
        }
      });

    let filterData1 = {
      companyMasterID: id,
    };
    this.spinner.start('name');
    this.api
      .callApi(this.constant.INCENTIVETYPESWITHOUTATTNBONUS, filterData1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.list = res.data;

          this.spinner.stop('name');
        }
        this.spinner.stop('name');
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

  getallemployee1() {
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

  companydata(event: any) {
    if (event) {
      this.employeedata.userMasterID = '';

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
        });
      this.spinner.stop('emp');

      let filterData1 = {
        companyMasterID: event,
      };
      this.spinner.start('name');
      this.api
        .callApi(this.constant.INCENTIVETYPESWITHOUTATTNBONUS, filterData1, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.list = res.data;

            this.spinner.stop('name');
          }
          this.spinner.stop('name');
        });
    } else {
      this.ownerList = [];
      this.allbranch = [];
      this.selectedowner = '';
      this.selectedlist = '';
    }

    const filterData = {
      companyMasterID: event,
    };
    this.spinner.start('name');
    this.api
      .callApi(this.constant.INCENTIVETYPESWITHOUTATTNBONUS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.list = res.data;

          this.spinner.start('name');
        }
        this.spinner.stop('name');
      });
  }
  onSubmit() {
    if (!this.editincentive.valid) {
      return;
    }
    this.editincentive.value.yearmonth = this.editincentive.value.yearmonth.replace('-', '');

    let body = {
      employeeincentiveID: this.formValue.ListEmployeeincentiveComponent.id,
      userMasterID: this.editincentive.value.userMasterID,
      yearmonth: this.editincentive.value.yearmonth,
      ToDate: this.editincentive.value.ToDate,
      amount: this.editincentive.value.amount,
      status: this.editincentive.value.status,
      IncentivetypeID: this.editincentive.value.incentivetypename,
      incentiveDate: this.editincentive.value.incentiveDate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      companyMasterID: this.editincentive.value.companyMasterID,
      UserMasterID: this.editincentive.value.displayName,
      description: this.editincentive.value.description,
      incentivetypename: '',
    };

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api
      .callApi(this.constant.UPDATEEMPLOYEEINCENTIVE, body, 'POST', true, true, true)
      .subscribe(
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
            this.notifications.create('Error', res.message, NotificationType.Error, {
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
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
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
  selectbranch(event) {
    this.selected = [];
    this.finalholidaypolicy = '';

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
            this.spinner.stop();
          }
        });
    }
  }
}
