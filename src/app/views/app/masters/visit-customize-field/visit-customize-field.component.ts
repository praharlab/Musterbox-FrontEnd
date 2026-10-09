import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-visit-customize-field',
    templateUrl: './visit-customize-field.component.html',
    styleUrls: ['./visit-customize-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class VisitCustomizeFieldComponent implements OnInit {
  @ViewChild('addvisitcustom') addvisitcustom: NgForm;
  @ViewChild('editvisitcustom') editvisitcustom: NgForm;
  values: any = [];
  valueshow: boolean;
  ipAddress: any;
  isdisabled = false;
  field: any = [];
  allcustomer: any;
  empList: any;
  selected: any = [];
  getallvisitpurpose: any;
  product: any;
  company: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  selectedcompany: any;
  customizedata: any;
  adminRoot = environment.adminRoot;
  viewCustomers: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.selectedcompany = +localStorage.getItem('company_id');
    this.getIPAddress();
    this.getcustomizefield();

    this.valueshow = false;
    this.getcompany();
    this.checkpermission();
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
              permissionval.formName == 'VisitCustomizeField' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VisitCustomizeField' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VisitCustomizeField' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VisitCustomizeField' &&
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
  addvalue() {
    this.values.push({ value: '' });
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }
  selectinput(event) {
    if (event == 'radio') {
      this.valueshow = true;
    } else if (event == 'dropdown') {
      this.valueshow = true;
    } else {
      this.valueshow = false;
    }
  }
  onSubmit() {
    if (!this.addvisitcustom.valid) {
      return;
    }
    const value = [];
    for (var i = 0; i < this.values.length; i++) {
      value.push(this.values[i].value);
    }
    let body = {
      fieldLabel: this.addvisitcustom.value.fieldLabel,
      inputType: this.addvisitcustom.value.inputType,
      value: value,
      isRequired: this.addvisitcustom.value.isRequired,
      companyMasterID: this.selectedcompany,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEVISITCUSTOMIZE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.isdisabled = true;

          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/visit_field_customize']).then(() => {
              window.location.reload();
              this.spinner.stop();
            });
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
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  getcustomizefield() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.selectedcompany,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETVISITCUSTOMIZEBYCOMPANYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.field = res.data;
          this.spinner.stop();
        }
      });
  }
  removefields(id: any) {
    const body = {
      visitFormCustomizeID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.DELETEVISITCUSTOMIZEBYID, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.ngOnInit();
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
  getallcustomer() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.selectedcompany,
    };
    this.api
      .callApi(this.constant.getAllCUSTOMERDataByCompanyId, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcustomer = res.data;
        }
      });
  }
  getallemployee() {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: this.selectedcompany,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.empList = res.data;
          this.empList.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
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
  getvisitpurposedata() {
    let body = {
      page: '',
      limit: '',
      companyMasterID: this.selectedcompany,
    };
    this.api
      .callApi(this.constant.VISITPURPOSEBYCOMPANYDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.getallvisitpurpose = res.data;
        }
      });
  }
  getproductdata() {
    const data = {
      page: '',
      limit: '',
      companyMasterID: this.selectedcompany,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETSIMPLEPRODUCTDATABYCOMPANY, data, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.product = res.data;
        }
      });
  }
  selectcompany(event: any) {
    this.selectedcompany = event;

    if (!event) return;

    if (event) {
      for (var item of this.company) {
        if (+item.companyMasterID == +event) {
          this.viewCustomers = item.customerListPreference ? item.customerListPreference : "all";
        }
      }
    }


    this.getcustomizefield();
    this.getallcustomer();
    this.getallemployee();
    this.getvisitpurposedata();
    this.getproductdata();
  }
  editfields(data, data1) {
    this.api
      .callApi(this.constant.VIEWVISITFORMCUSTOMIZEDATA + data1, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.customizedata = res.data;
          this.selectinput(this.customizedata.inputType);
          var respo: any = [];

          for (var i = 0; i < this.customizedata.value.length; i++) {
            respo.push({ value: this.customizedata.value[i] });
          }

          this.values = respo;
          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop();
        },
      );
  }
  onSubmit1() {
    if (!this.editvisitcustom.valid) {
      return;
    }
    const value = [];
    for (var i = 0; i < this.values.length; i++) {
      value.push(this.values[i].value);
    }
    let body = {
      visitFormCustomizeID: this.customizedata.visitFormCustomizeID,
      fieldLabel: this.editvisitcustom.value.fieldLabel,
      inputType: this.editvisitcustom.value.inputType,
      value: value,
      isRequired: this.editvisitcustom.value.isRequired,
      companyMasterID: this.selectedcompany,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEVISITCUSTOMIZE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.isdisabled = true;

          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/visit_field_customize']).then(() => {
              window.location.reload();
              this.spinner.stop();
            });
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
  changeCustomerPreference(event: any) {

    const body = {
      companyMasterID: this.selectedcompany,
      customerListPreference: event
    };
    this.spinner.start('customerPreference');
    this.api.callApi(this.constant.UPDATECUSTOMERPREFERENCE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          for (var item of this.company) {
            if (+item.companyMasterID == +this.selectedcompany) {
              item.customerListPreference = event;
              break;
            }
          }
        }
        this.spinner.stop('customerPreference');
      },
      (err) => {
        this.spinner.stop('customerPreference');
      },
    );

  }
}
