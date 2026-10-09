import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-datewise-attendance-policy',
    templateUrl: './edit-datewise-attendance-policy.component.html',
    styleUrls: ['./edit-datewise-attendance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditDatewiseAttendancePolicyComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  parentformdata: any = ['a', 'b', 'c', 'd'];
  employee: any;
  assetMaster: any;
  assetcategory: any;
  comp: any;
  usertype: any;
  company_id: any;
  users: any;
  getattendacepolicy: any;
  attendancepolicy1: any;
  datewiseAttendancePolicy: any = {
    companyMasterID: null
  };
  previous_attpol: any;
  adminRoot = environment.adminRoot;

  previous_user: boolean = true;
  previous_cat: boolean = true;

  childcompany: string;
  formValue: any;

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
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('id1');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.childcompany = localStorage.getItem('childcompany');
          this.getattendancepolicy(this.company_id);
          this.editdata();
          this.spinner.stop('id1');
        }
      });
  }

  getattendancepolicy(id1: any) {
    let body = {
      companyMasterID: id1,
      page: '',
      limit: '',
    };
    this.spinner.start('id1');
    this.api
      .callApi(this.constant.GETATTENDENCEDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.attendancepolicy1 = res.data;

          this.spinner.stop('id1');
        }
      });
  }
  fromDateChange(){
    this.datewiseAttendancePolicy.ToDate = ''
  }

  getuser(id1: any) {
    return new Promise<void>((resolve, reject) => {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: id1,
    };
    this.spinner.start('user');
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.users = res.data;
            this.spinner.stop('user');
            resolve()
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('user');
            reject()
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('user');
          reject()
        },
      );
    })
  }


  editdata() {
    let attendpol = this.formValue.ListDatewiseAttendancePolicyComponent.id;
    this.spinner.start('id1');
    this.api
      .callApi(this.constant.GETDATEWISEADDATABYID + attendpol, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.getattendancepolicy(res?.data?.companyMasterID);
          this.getuser(res?.data?.companyMasterID).then(() => {
            this.datewiseAttendancePolicy = res.data;
  
            this.datewiseAttendancePolicy.companyMasterID = Number(
              this.datewiseAttendancePolicy?.companyMasterID,
            );
            this.datewiseAttendancePolicy.userMasterID = Number(
              this.datewiseAttendancePolicy.userMasterID,
            );
            this.datewiseAttendancePolicy.attendancePolicyID = Number(
              this.datewiseAttendancePolicy.attendancePolicyID,
            );
            this.spinner.stop('id1');
          });

        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('id1');
        },
      );
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    this.spinner.start('id1');

    let body = {
      datewiseAttendancepolicyID: this.formValue.ListDatewiseAttendancePolicyComponent.id,
      // companyMasterID: this.addcomp.value.company,
      // userMasterID: this.addcomp.value.user,
      attendancePolicyID: this.addcomp.value.attendancePolicyID,
      fromDate: this.addcomp.value.fromDate,
      ToDate: this.addcomp.value.ToDate,
    };

    this.api
      .callApi(this.constant.UPDATEDATEEWISEATTENDANCEPOLICY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/payrolls/datewiseAttendancePolicy']);
              this.spinner.stop('id1');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('id1');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('id1');
        },
      );
  }

  // onSubmit1() {
  //   if (!this.addcomp1.valid) {
  //     return
  //   }
  //   let body

  //   if (this.childcompany == 'false') {
  //     body = {
  //       assetCategory: this.addcomp1.value.assetcategory,
  //       companyMasterID: this.addcomp1.value.company,
  //       createBy: localStorage.getItem('id'),
  //       createByIp: this.ipAddress,
  //     }
  //   } else {
  //     body = {
  //       assetCategory: this.addcomp1.value.assetcategory,
  //       companyMasterID: localStorage.getItem('company_id'),
  //       createBy: localStorage.getItem('id'),
  //       createByIp: this.ipAddress,
  //     }
  //   }

  //   this.spinner.start()
  //   this.api
  //     .callApi(
  //       this.constant.CREATEASSETCATEGORYDATA,
  //       body,
  //       'POST',
  //       true,
  //       true,
  //       true,
  //     )
  //     .subscribe(
  //       (res: any) => {
  //         if (res.status == 200) {
  //           this.notifications.create(
  //             'Done',
  //             res.message,
  //             NotificationType.Bare,
  //             {
  //               theClass: 'outline primary',
  //               timeOut: 3000,
  //               showProgressBar: true,
  //             },
  //           )
  //           setTimeout(() => {
  //             this.getassetcategory(body.companyMasterID)
  //             this.spinner.stop()
  //           }, 3000)
  //         } else {
  //           this.notifications.create(
  //             'Error',
  //             res.message,
  //             NotificationType.Bare,
  //             {
  //               theClass: 'outline primary',
  //               timeOut: 3000,
  //               showProgressBar: false,
  //             },
  //           )
  //           this.spinner.stop()
  //         }
  //       },
  //       (err) => {
  //         this.notifications.create('Error', err, NotificationType.Bare, {
  //           theClass: 'outline primary',
  //           timeOut: 3000,
  //           showProgressBar: false,
  //         })
  //         this.spinner.stop()
  //       },
  //     )
  // }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
