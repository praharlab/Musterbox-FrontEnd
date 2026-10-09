import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { labelUtils } from 'src/app/constants/labelUtils';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddressComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('closeModaledit') closeModaledit: ElementRef;

  editUserAddress: any;
  rows: any;
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };
  ipAddress: any;

  country: any;
  state: any;
  city: any;
  stateid: string;
  cityid: string;
  stateID: any;
  cityID: any;
  countryID: any;
  finalcityid: any;
  district: any;
  districtId: any;

  houseNumberLabel: any = labelUtils.houseNumberLabel
  houseNameLabel: any = labelUtils.houseNameLabel
  landMarkLabel: any = labelUtils.landMarkLabel
  zipCodeLabel: any = labelUtils.zipCodeLabel
  areaLabel: any = labelUtils.areaLabel
  stateLabel: any = labelUtils.stateLabel
  districtLabel: any = labelUtils.districtLabel
  showDistrict: boolean = labelUtils.showDistrict

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,


  ) { }


  ngOnInit(): void {
    this.addressdata()
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
          userAddressID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEUSERADDRESSDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.addressdata();
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

  addressdata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSERADDRESS + localStorage.getItem('id'),
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      userMasterID: localStorage.getItem('id'),
      addressType: this.addcomp.value.addressType,
      houseNumber: this.addcomp.value.houseNumber,
      houseName: this.addcomp.value.houseName,
      landmark: this.addcomp.value.landmark,
      area: this.addcomp.value.area,
      cityMasterID: this.addcomp.value.city1,
      zipcode: this.addcomp.value.zipcode,
      districtID: this.showDistrict ? this.addcomp.value.districtID : null,
      verifyStatus: 0,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEUSERADDRESSDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();

          this.addcomp.resetForm();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.addressdata();
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

  selectcountry(country: any) {
    if (country) {
      this.spinner.start();
      this.api
        .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
        .subscribe(
          (res: any) => {
            this.state = res.data;
            this.spinner.stop();
          },
          (err) => {
            this.spinner.stop();
            console.log('error', err);
          },
        );
    }
    this.state = [];
    this.city = [];
    this.stateid = '';
    this.cityid = '';
    this.stateID = '';
    this.cityID = '';
  }

  selectstate(state: any) {
    if (state) {
      this.spinner.start();
      this.api
      .callApi(this.constant.GETCITYBYSTATE + state, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
            this.spinner.stop();
            this.city = res.data;
          },
          (err) => {
            this.spinner.stop();
            console.log('error', err);
          },
        );
      if (this.showDistrict) {
        let queryString = `?stateMasterID=${state}`;
        this.api
          .callApi(this.constant.GETDISTRICTBYSTATEID + queryString, {}, 'GET', false, false, false)
          .subscribe(
            (res: any) => {
              this.district = res.data;
            },
            (err) => {
              console.log('error', err);
            },
          );
      }
    }
    this.district = [];
    this.districtId = ''
    this.city = [];
    this.cityID = '';
  }

  selectcity(city: any) {
    if (!city) {
      return;
    }
    this.finalcityid = city;
  }

  edit(item) {
    this.spinner.start();
    this.getallcountry()
    this.api
      .callApi(this.constant.GETUSERADDRESSBYID + item.userAddressID, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editUserAddress = res.data;

          if (this.editUserAddress.cityMasterID) {
            this.selectcountry(this.editUserAddress.cityMaster.stateMaster.countryMasterID);
            this.selectstate(this.editUserAddress.cityMaster.stateMasterID);
            this.countryID = this.editUserAddress.cityMaster.stateMaster.countryMasterID;
            this.stateID = this.editUserAddress.cityMaster.stateMasterID;
            this.cityID = this.editUserAddress.cityMasterID;
            this.districtId = this.showDistrict ? this.editUserAddress.districtID : null;
          }
        }
      });
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

  addData(){
    this.getallcountry();
  }

  onSubmitedit() {
    if (!this.editcomp.valid) {
      return;
    }
    let body = {
      userAddressID: this.editUserAddress.userAddressID,
      addressType: this.editcomp.value.addressType,
      houseNumber: this.editcomp.value.houseNumber,
      houseName: this.editcomp.value.houseName,
      landmark: this.editcomp.value.landmark,
      area: this.editcomp.value.area,
      cityMasterID: this.editcomp.value.city1,
      zipcode: this.editcomp.value.zipcode,
      districtID: this.showDistrict ? this.addcomp.value.districtID : null,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
      verifyStatus: '0', // Verify status

    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEUSERADDRESSDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModaledit.nativeElement.click();

          this.editcomp.resetForm();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.addressdata();
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
}
