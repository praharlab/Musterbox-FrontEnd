import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'app-add-datewise-attendance-policy',
    templateUrl: './add-datewise-attendance-policy.component.html',
    styleUrls: ['./add-datewise-attendance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddDatewiseAttendancePolicyComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
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
  attendancepolicy1: any;
  fileselected?: Blob;
  pdfUrl?: string;
  base64: string;
  comp: any;
  usertype: any;
  company_id: any;
  childcompany: string;
  users: any;
  selectedCompanyData: any;
  adminRoot = environment.adminRoot;
  allbranch: any;
  selectedBranch: any;
  selectedUser: any;
  selectedfromDate: any;
  selectedToDate: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private sant: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');

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
          this.selectedCompanyData = Number(this.company_id);
          this.selectcompany(this.selectedCompanyData);
          this.spinner.stop('id1');
        }
      });
  }
  selectcompany(id) {
    this.allbranch = [];
    this.users = [];
    this.selectedBranch = null;
    this.selectedUser = null;

    if (!id) return;
    this.spinner.start('id');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
      });
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: id,
    };

    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.users = res.data;
        }
      });
    this.spinner.stop('id');
  }

  getusers(id: any) {
    this.users = [];
    this.selectedUser = null;
    if (!id) {
      this.spinner.start('id');
      const filterData = {
        page: '',
        limit: '',
        companyMasterID: this.selectedCompanyData,
      };
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.users = res.data;
          }
        });
      this.spinner.stop('id');
    } else {
      const filterData = {
        page: '',
        limit: '',
        branchMasterID: id,
      };
      this.spinner.start('id1');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.users = res.data;
            this.spinner.stop('id1');
          }
        });
    }
  }


  fromDateChange() {
    this.selectedToDate = ''
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    this.spinner.start('id1');

    let body = {
      userMasterID: this.addcomp.value.user,
      attendancePolicyID: this.addcomp.value.attendancePolicyID,
      fromDate: this.addcomp.value.fromDate,
      ToDate: this.addcomp.value.ToDate,
    };

    let formData = new FormData();

    if (this.childcompany == 'false') {
      formData.append('companyMasterID', this.addcomp.value.company);
    } else {
      formData.append('companyMasterID', localStorage.getItem('company_id'));
    }
    formData.append('attendancePolicyID', this.addcomp.value.attendancePolicyID);
    formData.append('userMasterID', this.addcomp.value.user);
    formData.append('fromDate', this.addcomp.value.fromDate);
    formData.append('ToDate', this.addcomp.value.ToDate);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);



    this.api
      .callApi(this.constant.CREATEDATEEWISEATTENDANCEPOLICY, body, 'POST', true, true, true)
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
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('id1');
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
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
