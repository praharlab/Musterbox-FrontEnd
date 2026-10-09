import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-workinglocation',
    templateUrl: './list-employee-workinglocation.component.html',
    styleUrls: ['./list-employee-workinglocation.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeWorkinglocationComponent implements OnInit {
  @Output() workinglocationVerify = new EventEmitter<object>();

  @ViewChild('addworkinglocation') addworkinglocation: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  mediumDateFormat = environment.mediumDateFormat;
  rows: any = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  file: any;
  format: any;
  url: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  editbyid: any;
  company_id: any;
  allWL: any = [];
  workinglocation: any;
  current_date = new Date().toISOString().slice(0, 10);
  usertype: any;
  applidate = new Date().toISOString().split('T')[0];

  company: any;
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  starttime: any;
  totalhours: any;
  totalhourshalfday: any;
  endtime: any;
  secondhalfstarttime: any;
  firsthalfstarttime: any;
  deduction: any;

  sandwichleave: any;
  selectedcompany: any;
  table: any;
  alldepartment: any;
  alldesignation: any;
  // allbranch: any;
  referncedata: any;
  allowpanelty: boolean = false;
  allowearlyby: boolean = false;
  showearlyby: any;
  show: any;
  // by_Branch: boolean = false;
  predefined1: any = '0';
  selectedEarlyPenalty: any = '0';
  reference_ID: any;
  values: any = [];

  EarlyGovalues: any = [];
  allowearlybypenalty: boolean = false;
  selectedEarlyGoPenalty: any = 'slotminute';
  EarlyGodeduction: any;
  workinglocationdata: any;
  countryid: any;
  stateid: any;
  cityid: any;
  city: any;
  finalcityid: any;
  state: any;
  country: any;
  company1: any;
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
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.alldata();
    this.getIPAddress();
    this.getworkinglocationdata();
    this.usertype = localStorage.getItem('usertype');
  }
  getworkinglocationdata() {
    let userid = this.formValue.ListEmployeeMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop();
          this.workinglocation = res.data;
          let filterData = {
            status: 1,
            companyMasterID: this.workinglocation.companyMasterId,
          };
          this.api
            .callApi(this.constant.GETWORKINGLOCATION, filterData, 'POST', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.allWL = res.data;

                this.spinner.stop();
              }
            });
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
  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETWORKINGLOCATIONBYUSERID + this.formValue.ListEmployeeMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          let display = true;

          for (let item of this.rows) {
            if (item.endDate === null && item.workinglocationstatus === 'active') {
              display = false;
              break;
            }
          }

          this.workinglocationVerify.emit({
            tabname: 'WORKINGLOCATION',
            display: display,
          });


          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  onSubmit() {

    if (!this.addworkinglocation.valid) {
      return;
    }

    let body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      workingLocationIDs: this.addworkinglocation.value.wID,
      startDate: this.addworkinglocation.value.startDate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.ADDEMPLOYEEWORKINGLOCATION, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal.nativeElement.click();
            this.ngOnInit();
            this.addworkinglocation.resetForm();
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
          employeeWorkingLocationID: id,
          userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEMPLOYEEWORKINGLOCATION, body, 'POST', true, true, true)
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

  getWorkingLocation(item: any) {


    this.editdata(item);
    this.getcompany();
    this.getallcountry();
  }

  editdata(item: any) {
    let id = item;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWWORKINGLOCATION + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.workinglocationdata = res.data;
          this.countryid = this.workinglocationdata['cityMaster.stateMaster.countryMasterID'];
          this.selectcountry(this.countryid);

          this.selectstate(this.workinglocationdata['cityMaster.stateMasterID']);
          this.stateid = this.workinglocationdata['cityMaster.stateMasterID'];
          this.cityid = this.workinglocationdata['cityMaster.cityMasterID'];
          this.company = this.workinglocationdata.companyTypeid;

          // let temp = this.workinglocationdata.branchMasterID;
          // this.selectcompany(this.workinglocationdata.companyMasterID, 0);
          // this.workinglocationdata.branchMasterID = temp;

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

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop();
        }
      });
  }

  selectcountry(country: any) {
    this.city = [];
    this.state = [];
    this.stateid = '';
    this.cityid = '';

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
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        },
      );
  }
  selectstate(state: any) {
    this.city = [];
    this.cityid = '';

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
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        },
      );
  }
  selectcity(city: any) {
    this.finalcityid = city;
  }
  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.country = res.data;
        }
      });
  }
  // selectcompany(id: any, flag: any) {
  //   this.allbranch = [];
  //   this.workinglocationdata.branchMasterID = '';
  //   if (!id) {
  //   } else {
  //     this.spinner.start('wl');
  //     this.api
  //       .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
  //       .subscribe((res: any) => {


  //         this.allbranch = res;
  //         this.spinner.stop('wl');
  //       });
  //   }
  // }
}
