import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-nextvisitschedule',
    templateUrl: './nextvisitschedule.component.html',
    styleUrls: ['./nextvisitschedule.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NextvisitscheduleComponent implements OnInit {
  company: any;
  adminRoot = environment.adminRoot;


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
  formValue: any;
  redirectUrl: any;

  ngOnInit(): void {
    // this.formValue = this.formValueStorageService.getData();

    // if (!this.formValue.ListMyteamvisitComponent && !this.formValue.ListVisitComponent) {
    //   this.router.navigate([this.adminRoot + '/visits/visit_master']);
    // }

    this.api.getRouteSubject$.subscribe((data) => {
      this.redirectUrl = data;
    })
    this.editdata();
    this.getcustomizefield();
    this.getallcustomer();
    this.getallemployee();
    this.getvisitpurposedata();
    this.getproductdata();
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
    let visitid = this.activatedRoute.snapshot.params.id;
    this.spinner.start();
    this.api.callApi(this.constant.VIEWVISIT + visitid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.editvisitdata = res.data;
        for (var i = 0; i < this.editvisitdata.coPersonID.length; i++) {
          this.selected.push(this.editvisitdata.coPersonID[i].userMasterID);
        }
        this.spinner.stop();
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
      },
    );

    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWVISITFIELDCUSTOMIZE + visitid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editvisitdatavalue = res.data;
          this.spinner.start();
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }
  getcustomizefield() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: localStorage.getItem('company_id'),
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
      companyMasterID: localStorage.getItem('company_id'),
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
      companyMasterID: localStorage.getItem('company_id'),
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
      companyMasterID: localStorage.getItem('company_id'),
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
      companyMasterID: localStorage.getItem('company_id'),
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
      customerID: this.editvisit.value.customerID,
      assignID: this.editvisit.value.assignID,
      coPersonID: this.editvisit.value.coPersonID,
      visitPurposeID: this.editvisit.value.visitPurposeID,
      productID: this.editvisit.value.productID,
      visitDate: this.editvisit.value.visitDate,
      companyMasterID: this.editvisit.value.companyMasterID,
      visitTime: this.editvisit.value.visitTime,
      visitStatus: 'Created',
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.api.callApi(this.constant.CREATEVISIT, body, 'POST', true, true, true).subscribe(
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
                    visitID: this.activatedRoute.snapshot.params.id,
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
          for (var k = 0; k < customfieldvalue.length; k++) {
            let body1 = {
              visitFormCustomizeValueID: customfieldvalue[k].visitFormCustomizeValueID,
              value: customfieldvalue[k].value,
              updateBy: localStorage.getItem('company_id'),
              updateByIp: this.ipAddress,
            };
            this.api
              .callApi(
                this.constant.UPDATEVISITCUSTOMIZEFIELDVALUE,
                body1,
                'POST',
                true,
                true,
                true,
              )
              .subscribe((res1: any) => { });
          }
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + this.redirectUrl]);
            this.api.addRoute('');
            this.spinner.stop();
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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
