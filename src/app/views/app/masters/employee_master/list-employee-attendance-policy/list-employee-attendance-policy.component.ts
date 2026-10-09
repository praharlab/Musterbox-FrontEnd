import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { ViewAttedancePolicyComponent } from './view-attedance-policy/view-attedance-policy.component';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-attendance-policy',
    templateUrl: './list-employee-attendance-policy.component.html',
    styleUrls: ['./list-employee-attendance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeAttendancePolicyComponent implements OnInit {
  @ViewChild('addattendancepolicy') addattendancepolicy: NgForm;
  @ViewChild('editattendancepolicy') editattendancepolicy: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild(ViewAttedancePolicyComponent)
  viewAttedancePolicyComponent: ViewAttedancePolicyComponent;

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
  allattendancepolicy: any = [];
  attendancepolicy: any;
  current_date = new Date().toISOString().slice(0, 10);
  usertype: any;
  applidate = new Date().toISOString().split('T')[0];
  getAttendancePolicyID: any;
  selectedAttedancePolicyName: any;
  formValue: any;

  constructor(
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
    this.getIPAddress();
    this.getAttendancePolicyData();
    this.usertype = localStorage.getItem('usertype');
    this.profileStatusService.refreshProfileStatus();
  }
  getAttendancePolicyData() {
    let userid = this.formValue.ListEmployeeMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop();
          this.attendancepolicy = res.data;
          let filterData = {
            page: '',
            limit: '',
            companyMasterID: this.attendancepolicy.companyMasterId,
          };
          this.api
            .callApi(this.constant.GETATTENDENCEDATA, filterData, 'POST', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.allattendancepolicy = res.data;

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
        },
      );
  }
  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEEATTENDANCE + this.formValue.ListEmployeeMasterComponent.id,
        {},
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
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  onSubmit() {
    if (!this.addattendancepolicy.valid) {
      return;
    }
    let body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      attendancePolicyID: this.addattendancepolicy.value.attendancePolicyID,
      startDate: this.addattendancepolicy.value.startDate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEEMPLOYEEATTENDANCE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal.nativeElement.click();
            this.ngOnInit();
            this.addattendancepolicy.reset();
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
              timeOut: 3000000,
              autoclose: false,
              showProgressBar: false,
            });
            setTimeout(() => {
              this.spinner.stop();
            }, 3000);
            //alert(res.message);
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
  edit(item) {
    this.editbyid = item;
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
          employeeAttendancePolicyID: id,
          userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEMPLOYEEATTENDANCE, body, 'POST', true, true, true)
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

  getAttedancePolicyDataModal(item: any) {
    this.getAttendancePolicyID = item.attendancePolicyID;
    this.viewAttedancePolicyComponent.attendancePolicyID = item.attendancePolicyID;
    this.viewAttedancePolicyComponent.ngOnInit();
    this.selectedAttedancePolicyName = item.attendancePolicy.attendancePolicyName;
  }
}
