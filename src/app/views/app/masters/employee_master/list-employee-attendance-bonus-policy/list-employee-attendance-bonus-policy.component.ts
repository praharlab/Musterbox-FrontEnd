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
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ViewAttendanceBonusPolicyComponent } from './view-attendance-bonus-policy/view-attendance-bonus-policy.component';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-attendance-bonus-policy',
    templateUrl: './list-employee-attendance-bonus-policy.component.html',
    styleUrls: ['./list-employee-attendance-bonus-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeAttendanceBonusPolicyComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild(ViewAttendanceBonusPolicyComponent)
  ViewAttendanceBonusPolicyComponent: ViewAttendanceBonusPolicyComponent;

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
  @ViewChild('myInput') myInputVariable: ElementRef;
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
  editbyid: any;
  company_id: any;
  alldepartment: any = [];
  allweekoff: any = [];
  designation: any;
  usertype: any;
  activesalarydate: any;
  dateNG: any = '';
  visibledate: any;
  department: any;
  getWeekOffPolicyID: any;
  attendanceBonusPolicyName: string;
  formValue: any;
  attendanceBonusPolicyID: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
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
    this.getattendanceBonusoffData();
    this.company_id = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.profileStatusService.refreshProfileStatus();
  }

  getattendanceBonusoffData() {
    let userid = this.formValue.ListEmployeeMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop();
          this.department = res.data;

          this.api
            .callApi(this.constant.ATTENDANCEBONUSPOLICYGETALLDATA + `?companyMasterID=${this.department.companyMasterId}`, {}, 'GET', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.allweekoff = res.data;
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
        this.constant.EMPLOYEEATTENDANCEDATA + this.formValue.ListEmployeeMasterComponent.id,
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
      userMasterID: [this.formValue.ListEmployeeMasterComponent.id],
      attendanceBonusPolicyId: this.addcomp.value.attendanceBonusPolicyId,
      startDate: this.addcomp.value.startDate,
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.ADDBULKDATA, body, 'POST', true, true, true).subscribe(
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
            this.alldata();
            this.closeModal.nativeElement.click();
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

  // edit(item) {
  //   this.editbyid = item;
  // }

  // alertConfirmation(id: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You will not be able to recover!',
  //     icon: 'error',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, keep it',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const body = {
  //         employeeAttendanceBonusID: id,
  //         userMasterID: this.formValue.ListEmployeeMasterComponent.id,
  //       };
  //       this.spinner.start();
  //       this.api
  //         .callApi(this.constant.DELETEBONUSDATA, body, 'POST', true, true, true)
  //         .subscribe(
  //           (res: any) => {
  //             if (res.status == 200) {
  //               this.ngOnInit();
  //             } else {
  //               this.notifications.create('Error', res.message, NotificationType.Bare, {
  //                 theClass: 'outline primary',
  //                 timeOut: 3000,
  //                 showProgressBar: false,
  //               });
  //             }
  //             this.spinner.stop();
  //           },
  //           (err) => {
  //             this.notifications.create('Error', err.error.message, NotificationType.Bare, {
  //               theClass: 'outline primary',
  //               timeOut: 3000,
  //               showProgressBar: false,
  //             });
  //             this.spinner.stop();
  //           },
  //         );
  //     }
  //   });
  // }


  // checksalaryDate(date: any) {
  //   let Fdate = date.substring(8, 10);
  //   let month = date.substring(5, 7);

  //   if (Number(Fdate) != Number(this.activesalarydate)) {
  //     this.dateNG = '';
  //     alert('Weekoff policy can only be assigned on ' + Number(this.activesalarydate) + ' of the month');
  //   }
  // }

  // getSalaryDate() {
  //   const body = {
  //     userMasterID: this.formValue.ListEmployeeMasterComponent.id,
  //   };
  //   this.api
  //     .callApi(this.constant.GETACTIVESALARYPOLIY, body, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       this.visibledate = res.date;

  //       if (res.status == 400) {
  //         this.activesalarydate = '01';
  //         this.spinner.stop();
  //       } else if (res.status == 200) {
  //         if (Number(res.data['salaryPolicy.salaryCalculationDays']) < 10) {
  //           this.activesalarydate = '0' + res.data['salaryPolicy.salaryCalculationDays'].toString();
  //         } else {
  //           this.activesalarydate = res.data['salaryPolicy.salaryCalculationDays'].toString();
  //         }
  //         this.spinner.stop();
  //       }
  //     });
  // }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }


  getAttendanceBonusDataModal(item: any) {

    this.attendanceBonusPolicyID = item.attendanceBonusPolicyId;
    this.ViewAttendanceBonusPolicyComponent.attendanceBonusPolicyId = item.attendanceBonusPolicyId;
    this.ViewAttendanceBonusPolicyComponent.ngOnInit();
    this.attendanceBonusPolicyName = item.attendanceBonusPolicy.attendanceBonusPolicyName;

  }


}