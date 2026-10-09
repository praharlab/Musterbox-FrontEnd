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
// import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
    selector: 'app-list-employee-project',
    templateUrl: './list-employee-project.component.html',
    styleUrls: ['./list-employee-project.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeProjectComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal', { static: true }) lgModal: ModalDirective;

  rows: any = [];
  apiURL = environment.apiUrl;
  ipAddress: any;
  applidate = new Date().toISOString().split('T')[0];
  scrollBarHorizontal = window.innerWidth < 1201;
  formValue: any;
  company_id: any;
  usertype: any;
  userMasterID: any;
  filterData = {
    companyMasterID: +localStorage.getItem('company_id'),
  };
  temp = [];
  page = {
    totalCount: 0,
    offset: 0,
  };
  allProject: any = [];
  employeeProjectData: any = []
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    // private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.company_id = +localStorage.getItem('company_id');
    this.usertype = +localStorage.getItem('usertype');
    this.userMasterID = this.formValue.ListEmployeeMasterComponent.id;
    this.filterData.companyMasterID = this.formValue.ListEmployeeMasterComponent.body.companyMasterID
    this.getEmployeeProjectData()
    this.getIPAddress();
    // this.profileStatusService.refreshProfileStatus();
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
      projectID: this.addcomp.value.projectID,
      startDate: this.addcomp.value.startDate,
      releaseDate: this.addcomp.value.releaseDate ? this.addcomp.value.releaseDate : null,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEEMPLOYEEPROJECT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();
          this.ngOnInit();
          this.addcomp.reset();
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
            autoclose: true,
            showProgressBar: true,
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
          showProgressBar: true,
        });
        this.spinner.stop();
      },
    );
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  getProjectData() {
    this.spinner.start('users');
    this.api
      .callApi(this.constant.LISTPROJECT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {

        if (res.status == 200) {
          this.allProject = res.data;
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('users');
      }, (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('start');
      });
  }

  openModal() {
    this.getProjectData()
    this.lgModal.show()
  }

  getEmployeeProjectData() {
    let queryString = `?userMasterID=${this.formValue.ListEmployeeMasterComponent.id}`;

    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEEPROJECTBYUSERMASTER + queryString,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employeeProjectData = res.data;
          this.temp = [...this.employeeProjectData];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  alertConfirmation(employeeProjectID: any) {
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
          employeeProjectID: employeeProjectID,
          userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEMPLOYEEPROJECT, body, 'POST', true, true, true)
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
