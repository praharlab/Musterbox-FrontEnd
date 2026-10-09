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
    selector: 'app-add-myteamvisit',
    templateUrl: './add-myteamvisit.component.html',
    styleUrls: ['./add-myteamvisit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddMyteamvisitComponent implements OnInit {
  allkey: string[];
  allvalue: unknown[];
  company: any;
  company_id: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }
  @ViewChild('addvisit') addvisit: NgForm;
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
  copersonlist: any = [];
  ngOnInit(): void {
    this.getIPAddress();
    // this.getcompany();
    this.company_id = localStorage.getItem('company_id');
    this.getcustomizefield();
    this.getallcustomer();
    this.getallemployee();
    this.getvisitpurposedata();
    let id = localStorage.getItem('id');

    this.spinner.start();
    this.api
      .callApi(this.constant.REPORTTO2 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.copersonlist = res.data;
          this.spinner.stop();
        }
      });

    this.getproductdata();
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
  getcustomizefield() {
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
  getallcustomer() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
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
  getproductdata() {
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
  changecoperson(id: any) {
    // this.copersonlist = ''
    // this.spinner.start()
    // this.api
    //   .callApi(
    //     this.constant.REPORTTO2+id,
    //     {},
    //     'GET',
    //     true,
    //     false,
    //     true,
    //   )
    //   .subscribe((res: any) => {
    //     if (res.status == 200) {
    //       this.copersonlist = res.data
    //     }
    //   })
  }
  onSubmit() {
    if (!this.addvisit.valid) {
      var finderro = [];
      for (var i = 0; i < this.field.length; i++) {
        const names = Object.keys(this.addvisit.form.controls)
          .filter((key) => key.includes(this.field[i].fieldLabel))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              name: key,
              error: this.addvisit.form.controls[key].errors,
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
      customerID: this.addvisit.value.customerID,
      assignID: this.addvisit.value.assignID,
      coPersonID: this.addvisit.value.coPersonID,
      visitPurposeID: this.addvisit.value.visitPurposeID,
      productID: this.addvisit.value.productID ? this.addvisit.value.productID : null,
      visitDate: this.addvisit.value.visitDate,
      visitTime: this.addvisit.value.visitTime,
      companyMasterID: this.addvisit.value.companyMasterID,
      visitStatus: 'Created',
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.api.callApi(this.constant.CREATEVISIT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          let visitid = res.data.visitID;
          let customfieldvalue = [];
          this.allkey = Object.keys(this.addvisit.value);
          this.allvalue = Object.values(this.addvisit.value);
          var alllength = this.allkey.length;
          for (var i = 0; i < this.field.length; i++) {
            for (var j = 0; j < alllength; j++) {
              if (this.field[i].fieldLabel == this.allkey[j]) {
                let storecustomfield = {
                  visitFormCustomizeID: this.field[i].visitFormCustomizeID,
                  value: this.allvalue[j],
                };
                customfieldvalue.push(storecustomfield);
              }
            }
          }
          // for (var k = 0; k < customfieldvalue.length; k++) {
          let body1 = {
            customfieldvalue: customfieldvalue,
            // visitFormCustomizeID: customfieldvalue[k].visitFormCustomizeID,
            visitID: visitid,
            // value: customfieldvalue[k].value,
            createBy: localStorage.getItem('id'),
            createByIp: this.ipAddress,
          };
          this.api
            .callApi(
              this.constant.CREATEVISITCUSTOMIZEFIELDVALUEWEB,
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
            this.router.navigate([this.adminRoot + '/visits/myteamvisit']);
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
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  companydata(event) { }
}
