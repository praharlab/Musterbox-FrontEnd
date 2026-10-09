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
    selector: 'app-edit-visit',
    templateUrl: './edit-visit.component.html',
    styleUrls: ['./edit-visit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditVisitComponent implements OnInit {
  company: any;
  company_id: any;
  assign: any;
  adminRoot = environment.adminRoot;
  selectedCustomer: string;
  selectedassign: string;
  selectedVisitpurpose: string;
  selectedProduct: string;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }
  @ViewChild('editvisit') editvisit: NgForm;
  values: any = [];
  mytime: Date = new Date();
  valueshow: boolean;
  ipAddress: any;
  isdisabled = false;
  field: any = [];
  allcustomer: any;
  empList: any;
  selected: any = [];
  getallvisitpurpose: any;
  product: any;
  editvisitdatavalue: any = [];
  allkey: string[];
  allvalue: unknown[];
  editvisitdata: any;

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.editdata();
    this.getIPAddress();
    this.getcompany();
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
  editdata() {
    let visitid = this.formValue.ListVisitComponent.id;
    this.spinner.start('editdata');
    this.api.callApi(this.constant.VIEWVISIT + visitid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.editvisitdata = res.data;
        this.assign = Number(this.editvisitdata.assignID);
        this.getcustomizefield();
        this.getallcustomer();
        this.getallemployee();
        this.getvisitpurposedata();
        this.getproductdata();
        if (this.editvisitdata.coPersonID.length > 0) {
          for (var i = 0; i < this.editvisitdata.coPersonID.length; i++) {
            this.selected.push(this.editvisitdata.coPersonID[i].userMasterID);
          }
        }
        this.spinner.stop('editdata');
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('editdata');
      },
    );
    this.spinner.start('field');
    this.api
      .callApi(this.constant.VIEWVISITFIELDCUSTOMIZE + visitid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editvisitdatavalue = res.data;
          this.spinner.stop('field');
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('field');
        },
      );
  }
  getcustomizefield() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.editvisitdata.companyMasterID,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETVISITCUSTOMIZEBYCOMPANYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.field = res.data;
          for (var s = 0; s < this.field.length; s++) {
            this.field[s].fieldvalue = '';
            this.field[s].fieldvalueid = '';
          }

          if (this.editvisitdatavalue) {
            for (var i = 0; i < this.field.length; i++) {
              for (var j = 0; j < this.editvisitdatavalue.length; j++) {
                if (
                  this.field[i].visitFormCustomizeID ==
                  this.editvisitdatavalue[j].visitFormCustomizeID
                ) {
                  this.field[i].fieldvalue = this.editvisitdatavalue[j].value;
                  this.field[i].fieldvalueid = this.editvisitdatavalue[j].visitFormCustomizeValueID;
                }
              }
            }
          }
          this.spinner.stop();
        }
      });
  }
  getallcustomer() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.editvisitdata.companyMasterID,
      userMasterID: +localStorage.getItem('id')
    };

    this.api
      .callApi(this.constant.GETCUSTOMERBYCOMPANY, body, 'POST', true, false, true)
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
      companyMasterID: this.editvisitdata.companyMasterID,
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
      companyMasterID: this.editvisitdata.companyMasterID,
    };
    this.api
      .callApi(this.constant.GETVISITPURPOSEDATA, body, 'POST', true, false, true)
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
      companyMasterID: this.editvisitdata.companyMasterID,
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
  onSubmit() {
    if (!this.editvisit.valid) {
      var finderro = [];
      for (var i = 0; i < this.field.length; i++) {
        const names = Object.keys(this.editvisit.form.controls)
          .filter((key) => key.includes(this.field[i].fieldLabel))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              name: key,
              error: this.editvisit.form.controls[key].errors,
            });
          }, {});
        finderro.push(names);
      }
      for (var j = 0; j < finderro.length; j++) {
        if (finderro[j].error != null) {
          this.notifications.create(
            'Error',
            finderro[j].name + ' is required.',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
        }
      }

      return;
    }

    let body = {
      visitID: this.formValue.ListVisitComponent.id,
      customerID: this.editvisit.value.customerID,
      assignID: this.editvisit.value.assignID,
      coPersonID: this.editvisit.value.coPersonID,
      visitPurposeID: this.editvisit.value.visitPurposeID,
      productID: this.editvisit.value.productID ? this.editvisit.value.productID : null,
      visitDate: this.editvisit.value.visitDate,
      companyMasterID: this.editvisit.value.companyMasterID,
      visitTime: this.editvisit.value.visitTime,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.api.callApi(this.constant.UPDATEVISIT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          let customfieldvalue = [];
          this.allkey = Object.keys(this.editvisit.value);
          this.allvalue = Object.values(this.editvisit.value);
          var alllength = this.allkey.length;

          for (var i = 0; i < this.field.length; i++) {
            for (var j = 0; j < alllength; j++) {
              if (this.field[i].fieldLabel == this.allkey[j]) {
                if (this.field[i].fieldvalueid != '') {
                  let storecustomfield = {
                    visitFormCustomizeID: this.field[i].visitFormCustomizeID,
                    visitFormCustomizeValueID: this.field[i].fieldvalueid,
                    value: this.allvalue[j],
                  };
                  customfieldvalue.push(storecustomfield);
                } else {
                  let body1 = {
                    visitFormCustomizeID: this.field[i].visitFormCustomizeID,
                    visitID: this.formValue.ListVisitComponent.id,
                    value: this.allvalue[j],
                    createBy: localStorage.getItem('id'),
                    createByIp: this.ipAddress,
                  };
                  this.api
                    .callApi(
                      this.constant.CREATEVISITCUSTOMIZEFIELDVALUE,
                      body1,
                      'POST',
                      true,
                      true,
                      true,
                    )
                    .subscribe((res1: any) => { });
                }
              }
            }
          }

          let body1 = {
            customfieldvalue: customfieldvalue,
            updateBy: localStorage.getItem('id'),
            updateByIp: this.ipAddress,
          };
          this.api
            .callApi(
              this.constant.UPDATEVISITCUSTOMIZEFIELDVALUEWEB,
              body1,
              'POST',
              true,
              true,
              true,
            )
            .subscribe((res1: any) => { });
          // }
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/visits/visit']);
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
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
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

  getcustomizefield1() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
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
  getallcustomer1() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
      userMasterID: +localStorage.getItem('id')
    };
    this.api
      .callApi(this.constant.GETCUSTOMERBYCOMPANY, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcustomer = res.data;
        }
      });
  }
  getallemployee1() {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
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

  getvisitpurposedata1() {
    let body = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
    };
    this.api
      .callApi(this.constant.GETVISITPURPOSEDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.getallvisitpurpose = res.data;
        }
      });
  }
  getproductdata1() {
    const data = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
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

  companydata(event) {
    this.field = [];
    this.allcustomer = [];
    this.empList = [];
    this.getallvisitpurpose = [];
    this.product = [];

    this.editvisitdata.customerID = '';
    this.assign = '';
    this.selected = [];
    this.editvisitdata.visitPurposeID = '';
    this.editvisitdata.productID = null;

    if (!event) {
      return;
    }

    this.company_id = event;

    this.getcustomizefield1();
    this.getallcustomer1();
    this.getallemployee1();
    this.getvisitpurposedata1();
    this.getproductdata1();
  }
}
