import {
  Component,
  ViewChild,
  OnInit,
  ViewContainerRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
    selector: 'app-delete-employee-master',
    templateUrl: './delete-employee-master.component.html',
    styleUrls: ['./delete-employee-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DeleteEmployeeMasterComponent implements OnInit {
  isadmins: any;
  @ViewChild('addcomp') addcomp: NgForm;
  companydata: any = [];
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  usertype: any;
  companyName: any;
  imgshow1: boolean;
  gendershow: boolean = false;
  marishow: boolean = false;
  userId: any = null;
  finalArray: any = [];
  employeecodetype: any;
  authorizationPermissionView: any = [];
  incrementPermissionView: any = [];
  salaryStructurePermissionView: any = [];
  employeeResignationPermissionView: any = [];
  assignLetterPermissionView: any = [];
  assignSalaryPolicyPermissionView: any = [];
  removeFace: string = 'true';
  formValue: any;
  lockProfilePictureRequired: boolean = false;
  userData: any;
  authorizationDataCount: any;
  reportToDataCount: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,

    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    // this.usertype = localStorage.getItem('usertype');
    this.userId = this.formValue.ListEmployeeMasterComponent.id;
    // this.getUsers();
    // this.checkpermission();
  }
  receiveAuthorizationData(data: string) {
    this.authorizationDataCount = data;
  }

  receiveReportToData(data: string) {
    this.reportToDataCount = data;
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
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
          userMasterID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEOMPANYCONTACTDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              setTimeout(() => {
                this.router.navigate([this.adminRoot + '/masters/employee']);
                this.spinner.stop();
              }, 3000);
            },
            (err) => {
              this.spinner.stop();
            },
          );
      }
    });
  }
}
