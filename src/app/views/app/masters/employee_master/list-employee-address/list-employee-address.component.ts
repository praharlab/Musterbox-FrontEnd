import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { labelUtils } from 'src/app/constants/labelUtils';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-address',
    templateUrl: './list-employee-address.component.html',
    styleUrls: ['./list-employee-address.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeAddressComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild('closelgModal2') closelgModal2: ElementRef;

  @ViewChild('reject') reject: NgForm;

  rows: any = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  file: any;
  format: any;
  url: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  modalRef: BsModalRef;
  country: any;
  state: any;
  city: any;
  district: any;
  finalcityid: any;
  editbyid: any;
  usertype: any;
  verifyBy: any;
  selectedstate: any;
  selectedcity: any;
  selectedDistrict: any;
  
  countryID: any;
  stateID: any;
  cityID: any;
  rejectBody = {
    userAddressID: '',
    verifyStatus: '2', // Reject status
    verifyBy: localStorage.getItem('id'),
    rejectionRemarks: null,
  };
  formValue: any;
  houseNumberLabel: any = labelUtils.houseNumberLabel
  houseNameLabel: any = labelUtils.houseNameLabel
  landMarkLabel: any = labelUtils.landMarkLabel
  zipCodeLabel: any = labelUtils.zipCodeLabel
  areaLabel: any = labelUtils.areaLabel
  stateLabel: any = labelUtils.stateLabel
  districtLabel: any = labelUtils.districtLabel
  showDistrict: boolean = labelUtils.showDistrict

  constructor(
    private modalService: BsModalService,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.alldata();
    this.getallcountry();
    this.getIPAddress();
    this.usertype = localStorage.getItem('usertype');
    this.profileStatusService.refreshProfileStatus();
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
  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETUSERADDRESS + this.formValue.ListEmployeeMasterComponent.id,
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      addressType: this.addcomp.value.addressType,
      houseNumber: this.addcomp.value.houseNumber,
      houseName: this.addcomp.value.houseName,
      landmark: this.addcomp.value.landmark,
      area: this.addcomp.value.area,
      cityMasterID: this.addcomp.value.city1,
      districtID: this.showDistrict ? this.addcomp.value.districtID : null,
      zipcode: this.addcomp.value.zipcode,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      verifyStatus: 1,
      verifyBy: localStorage.getItem('id'),
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEUSERADDRESSDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();
          this.ngOnInit();
          this.addcomp.resetForm();
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
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }
  selectcountry(country: any) {
    this.selectedstate = '';
    this.selectedcity = '';
    this.selectedDistrict = '';
    this.city = [];
    this.state = [];
    if (!country) {
      return;
    }
    if (country) {
      this.api
        .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
        .subscribe(
          (res: any) => {
            this.state = res.data;
          },
          (err) => {
            this.notifications.create('Error', err.error.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          },
        );
    }
  }
  selectstate(state: any) {
    this.selectedcity = '';
    this.selectedDistrict = '';
    this.city = [];
    this.district = [];

    if (state) {
      this.api
        .callApi(this.constant.GETCITYBYSTATE + state, {}, 'GET', false, false, false)
        .subscribe(
          (res: any) => {
            this.city = res.data;
          },
          (err) => {
            this.notifications.create('Error', err.error.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
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
  }
  selectcity(city: any) {
    this.finalcityid = city;
  }

  updateRejectionStatus(row: any) {
    const updatedRow = {
      ...row,
      verifyStatus: '2', // Update to Rejected status
      verifyBy: row.verifyBy,
    };

    const body = {
      userAddressID: row.userAddressID,
      verifyStatus: '2', // Rejected status
      verifyBy: row.verifyBy,
    };

    this.spinner.start();
    this.api.callApi(this.constant.USERADDRESSVERIFYREQ, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.rows = this.rows.map((r) => (r.userAddressID === row.userAddressID ? updatedRow : r));
        this.spinner.stop();
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

  alertVerifyConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to verify this user Address details?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Verify',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userAddressID: id.userAddressID,
          verifyStatus: '1', // Verify status
          verifyBy: localStorage.getItem('id'),
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.USERADDRESSVERIFYREQ, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              setTimeout(() => {
                this.ngOnInit();
                this.spinner.stop();
              }, 1000);
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
    });
  }

  alertRejectConfirmation(id: any) {
    this.rejectBody.userAddressID = id.userAddressID;
  }

  rejectSubmit() {
    if (!this.reject.valid) {
      return;
    }

    this.rejectBody.rejectionRemarks = this.reject.value.remarks;
    this.spinner.start();
    this.api
      .callApi(this.constant.USERADDRESSVERIFYREQ, this.rejectBody, 'POST', true, true, true)
      .subscribe(
        (res: any) => {

          this.closelgModal2.nativeElement.click();
          this.reject.resetForm();
          setTimeout(() => {
            this.ngOnInit();
            this.spinner.stop();
          }, 1000);
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

  edit(item: any) {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETUSERADDRESSBYID + item.userAddressID, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editbyid = res.data;

          if (this.editbyid.cityMasterID) {
            this.selectcountry(this.editbyid.cityMaster.stateMaster.countryMasterID);
            this.selectstate(this.editbyid.cityMaster.stateMasterID);
            this.countryID = this.editbyid.cityMaster.stateMaster.countryMasterID;
            this.selectedstate = this.editbyid.cityMaster.stateMasterID;
            this.selectedcity = this.editbyid.cityMasterID;
            this.selectedDistrict =  this.showDistrict ? this.editbyid.districtID : null;;
          } else {
            this.countryID = '';
            this.selectedstate = '';
            this.selectedcity = '';
          }
        }
      });
  }
  onSubmit1() {
    if (!this.editcomp.valid) {
      return;
    }
    let body = {
      userAddressID: this.editbyid.userAddressID,
      addressType: this.editcomp.value.addressType,
      houseNumber: this.editcomp.value.houseNumber,
      houseName: this.editcomp.value.houseName,
      landmark: this.editcomp.value.landmark,
      area: this.editcomp.value.area,
      cityMasterID: this.editcomp.value.city1,
      districtID: this.showDistrict ? this.editcomp.value.districtID : null,
      zipcode: this.editcomp.value.zipcode,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
      verifyStatus: '1', // Verify status
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEUSERADDRESSDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal1.nativeElement.click();
          this.editcomp.resetForm();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.ngOnInit();
            this.spinner.stop();
          }, 1000);
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
              this.ngOnInit();
              this.spinner.stop();
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
    });
  }
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userAddressID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.USERADDRESSDATASTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
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
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userAddressID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.USERADDRESSDATASTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
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
    });
  }
}
