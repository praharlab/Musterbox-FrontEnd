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
import { ViewHolidayPolicyComponent } from './view-holiday-policy/view-holiday-policy.component';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-holidaypolicy',
    templateUrl: './list-employee-holidaypolicy.component.html',
    styleUrls: ['./list-employee-holidaypolicy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeHolidaypolicyComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild(ViewHolidayPolicyComponent)
  viewHolidayPolicyComponent: ViewHolidayPolicyComponent;

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
  // company_id: any;
  alldepartment: any = [];
  allweekoff: any = [];
  designation: any;
  usertype: any;
  activesalarydate: any;
  dateNG: any = '';
  visibledate: any;
  getHolidayPolicyID: any;
  selectedHolidayPolicyName: string;
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
    this.getWeekoffData();
    // this.company_id = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.profileStatusService.refreshProfileStatus();
  }
  getWeekoffData() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.formValue.ListEmployeeMasterComponent.body.companyMasterID,
    };
    this.api
      .callApi(this.constant.GETHOLIDAYBYCOMPANY, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allweekoff = res.data;

          this.spinner.stop();
        }
      });
  }
  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.HOLDAYBYCOMPANYDATA + this.formValue.ListEmployeeMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;

            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
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
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      holidayPolicyID: this.addcomp.value.holidayPolicyID,
      applicableDate: this.addcomp.value.applicableDate,
      monthYear: this.addcomp.value.monthYear,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEEMPLOYEEHOLIDAY, body, 'POST', true, true, true).subscribe(
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
  edit(item) {
    this.editbyid = item;
  }
  onSubmit1() {
    if (!this.editcomp.valid) {
      return;
    }
    let body = {
      employeeholidayPolicyID: this.editbyid.employeeholidayPolicyID,
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      holidayPolicyID: this.editcomp.value.holidayPolicyID,
      applicableDate: this.editcomp.value.applicableDate,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEEMPLOYEHOLIDAY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal1.nativeElement.click();
          this.ngOnInit();
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
          employeeholidayPolicyID: id,
          userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEMPLOYEEHOLIDAY, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.ngOnInit();
              } else {
                this.notifications.create('Error', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
              }
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

  checksalaryDate(date: any) {
    let Fdate = date.substring(8, 10);
    let month = date.substring(5, 7);

    if (Number(Fdate) != Number(this.activesalarydate)) {
      this.dateNG = '';
      alert('Weekoff policy can only be assigned ' + Number(this.activesalarydate) + ' of month');
    }
  }
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

  getHolidayPolicyDataModal(item: any) {
    this.getHolidayPolicyID = item.holidayPolicyID;
    this.viewHolidayPolicyComponent.holidayPolicyID = item.holidayPolicyID;
    this.viewHolidayPolicyComponent.ngOnInit();
    this.selectedHolidayPolicyName = item.HolidayPolicy.holidayPolicyName;
  }
}
