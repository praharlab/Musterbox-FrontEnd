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
    selector: 'app-add-visit',
    templateUrl: './add-visit.component.html',
    styleUrls: ['./add-visit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddVisitComponent implements OnInit {
  allkey: string[];
  allvalue: unknown[];
  company: any = [];
  company_id: any;
  adminRoot = environment.adminRoot;
  selectedCustomer: string;
  selectedassign: string;
  selectedVisitpurpose: string;
  selectedProduct: string;
  permissionCustomercreate: any = []
  country: any = [];
  finalcityid: any;
  city: any;
  state: any;
  stateid: any[];
  cityid: any[];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }
  @ViewChild('addvisit') addvisit: NgForm;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('closeModal2') closeModal2: ElementRef;
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
  ngOnInit(): void {
    // this.getallcustomer()
    // this.getallemployee()
    // this.getvisitpurposedata()
    // this.getproductdata()
    this.getIPAddress();
    this.getcompany();
    this.getallcountry();
  }


  onSubmit1() {
    if (!this.addcomp.valid) {
      return;
    }


    const body = {
      companyMasterID: this.addvisit.value.companyMasterID,
      customerName: this.addcomp.value.customerName,
      companyName: this.addcomp.value.companyName,
      currentLocation: this.addcomp.value.currentLocation,
      cityMasterID: this.finalcityid,
      latitude: this.addcomp.value.latitude ? this.addcomp.value.latitude : null,
      longitude: this.addcomp.value.longitude ? this.addcomp.value.longitude : null,
      mobileNumber1: this.addcomp.value.mobileNumber1,
      mobileNumber2: this.addcomp.value.mobileNumber2,
      email: this.addcomp.value.email,
      website: this.addcomp.value.website,
      address: this.addcomp.value.address,
      zipcode: this.addcomp.value.zipcode,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    // if (this.childcompany == 'false') {
    //   this.company_id = this.addcomp.value.company;
    // } else {
    //   this.company_id = localStorage.getItem('company_id');
    // }
    this.spinner.start('customer');
    this.api.callApi(this.constant.CREATECUSTOMER, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });

          this.closeModal2.nativeElement.click();
          this.addcomp.resetForm();
          this.getallcustomer();

          this.spinner.stop('customer');
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('customer');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('customer');
      },
    );
  }

  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.country = res.data;
          this.spinner.stop();
        }
      });
  }



  selectcountry(country: any) {
    this.state = null;
    this.city = null;
    this.stateid = [];
    this.cityid = [];
    if (!country) {
      return;
    }
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.state = res.data;
        },
        (err) => {
          console.log('error', err);
        },
      );
  }
  selectstate(state: any) {
    if (!state) {
      return;
    }
    this.api
      .callApi(this.constant.GETCITYBYSTATE + state, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.city = res.data;
        },
        (err) => {
          console.log('error', err);
        },
      );
    this.city = null;
  }
  selectcity(city: any) {
    if (!city) {
      return;
    }
    this.finalcityid = city;
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
  onSubmit() {
    if (!this.addvisit.valid) {
      let finderro = [];
      for (let i = 0; i < this.field.length; i++) {
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
      for (let j = 0; j < finderro.length; j++) {
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
          let alllength = this.allkey.length;
          for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < alllength; j++) {
              if (this.field[i].fieldLabel == this.allkey[j]) {
                let storecustomfield = {
                  visitFormCustomizeID: this.field[i].visitFormCustomizeID,
                  value: this.allvalue[j],
                };
                customfieldvalue.push(storecustomfield);
              }
            }
          }
          let body1 = {
            visitID: visitid,
            customfieldvalue: customfieldvalue,
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
  companydata(event) {
    this.field = [];
    this.allcustomer = [];
    this.empList = [];
    this.getallvisitpurpose = [];
    this.product = [];

    this.selectedCustomer = '';
    this.selectedassign = '';
    this.selected = [];
    this.selectedVisitpurpose = '';
    this.selectedProduct = '';

    if (!event) {
      return;
    }

    this.company_id = event;
    this.getcustomizefield();
    this.getallcustomer();
    this.getallemployee();
    this.getvisitpurposedata();

    this.getproductdata();
  }
}
