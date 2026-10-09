import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
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
import { ViewSalaryPolicyComponent } from './view-salary-policy/view-salary-policy.component';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-salary-policy',
    templateUrl: './list-employee-salary-policy.component.html',
    styleUrls: ['./list-employee-salary-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeSalaryPolicyComponent implements OnInit {
  @ViewChild('addsalarypolicy') addsalarypolicy: NgForm;
  @ViewChild('editsalarypolicy') editsalarypolicy: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild(ViewSalaryPolicyComponent)
  viewSalaryPolicyComponent: ViewSalaryPolicyComponent;
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
  allsalarypolicy: any = [];
  salarypolicy: any;
  current_date = new Date().toISOString().slice(0, 10);
  usertype: any;
  applidate = new Date().toISOString().split('T')[0];
  getSalaryPolicyID: any;
  selectedSalaryPolicyName: any;

  permissioncreate: any = [];
  permissiondelete: any = [];
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
    this.getSalaryPolicyData();
    this.usertype = localStorage.getItem('usertype');
    this.profileStatusService.refreshProfileStatus();
    this.checkpermission();
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignSalaryPolicy' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignSalaryPolicy' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.spinner.stop();
        }
      });

  }

  getSalaryPolicyData() {
    let userid = this.formValue.ListEmployeeMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop();
          this.salarypolicy = res.data;
          let filterData = {
            page: '',
            limit: '',
            companyMasterID: this.salarypolicy.companyMasterId,
          };
          this.api
            .callApi(this.constant.GETSALARYDATA, filterData, 'POST', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.allsalarypolicy = res.data;

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
        this.constant.GETEMPLOYEESALARY + this.formValue.ListEmployeeMasterComponent.id,
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
    if (!this.addsalarypolicy.valid) {
      return;
    }
    let body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      salaryPolicyID: this.addsalarypolicy.value.salaryPolicyID,
      startDate: this.addsalarypolicy.value.startDate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEEMPLOYEESALARY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();
          this.ngOnInit();
          this.addsalarypolicy.resetForm();
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
  edit(item) {
    this.editbyid = item;
  }
  onSubmit1() {
    if (!this.editsalarypolicy.valid) {
      return;
    }
    let body = {
      employeeSalaryPolicyID: this.editbyid.employeeSalaryPolicyID,
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      salaryPolicyID: this.editsalarypolicy.value.salaryPolicyID,
      startDate: this.editsalarypolicy.value.startDate,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEEMPLOYEESALARY, body, 'POST', true, true, true).subscribe(
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
          employeeSalaryPolicyID: id,
          userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEMPLOYEESALARY, body, 'POST', true, true, true)
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

  getSalaryPolicyDataModal(item: any) {
    this.getSalaryPolicyID = item.salaryPolicyID;
    this.viewSalaryPolicyComponent.salaryPolicyID = item.salaryPolicyID;
    this.viewSalaryPolicyComponent.ngOnInit();
    this.selectedSalaryPolicyName = item.salaryPolicy.salaryPolicyName;
  }
}
