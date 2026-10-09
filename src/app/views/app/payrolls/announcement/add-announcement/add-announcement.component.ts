import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
var Size = Quill.import('attributors/style/size');
import Quill from 'node_modules/quill';


Size.whitelist = [
  '8px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px',
  '34px',
  '36px',
  '38px',
  '40px',
  '42px',
  '44px',
  '46px',
  '48px',
  '50px',
];
Quill.register(Size, true);

let Font = Quill.import('formats/font');
Font.whitelist = ['inconsolata', 'roboto', 'mirza', 'arial', 'calibri'];
Quill.register(Font, true);
@Component({
    selector: 'app-add-announcement',
    templateUrl: './add-announcement.component.html',
    styleUrls: ['./add-announcement.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddAnnouncementComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  isdisabled = false;
  ipAddress: any;
  company: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getIPAddress();
    this.getcompany();
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
          this.company = res.data;
          this.spinner.stop();
        }
      });
  }

  file: any;
  format: any;
  url: any;
  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (
      ext.toLowerCase() !== 'png' &&
      ext.toLowerCase() !== 'jpg' &&
      ext.toLowerCase() !== 'jpeg' &&
      ext.toLowerCase() !== 'pdf' &&
      ext.toLowerCase() !== 'xlsx' &&
      ext.toLowerCase() !== 'csv'
    ) {
      // this.toastr.error('Selected file format is not supported!', 'Error', { timeOut: 3000 });
      // return;
    } else {
      this.file = event.target.files && event.target.files[0];
      if (this.file) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        if (this.file.type.indexOf('image') > -1) {
          this.format = 'image';
        } else if (this.file.type.indexOf('video') > -1) {
          this.format = 'video';
        } else if (this.file.type.indexOf('pdf') > -1) {
          this.format = 'pdf';
        }
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      }
    }
  }

  companyMasterId: any = null;
  branchMasterId: any = null;
  departmentId: any = null;
  designationId: any = null;

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    const formData = new FormData();
    formData.append('announcement', this.addcomp.value.announcement);
    formData.append('announcementDate', this.addcomp.value.announcementDate);
    formData.append('file', this.file);
    formData.append('companyMasterID', this.addcomp.value.companyMasterID);
    formData.append('branchMasterID', this.addcomp.value.branchMasterID);
    formData.append('departmentId', this.addcomp.value.departmentID);
    formData.append('designationId', this.addcomp.value.designationID);
    formData.append('gender', this.addcomp.value.gender);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);

    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEANNOUNCEMENT, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.isdisabled = true;
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/payrolls/announcement']);

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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  alldesignation: any = [];
  alldepartment: any = [];
  allbranch: any = [];
  selectCompany(event) {
    if (event) {

      // branch
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA2 + event, {}, 'GET', true, true, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allbranch = res.data;

            this.spinner.stop();
          }
        });

      // designation
      this.api
        .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + event, {}, 'GET', true, true, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldesignation = res.data;

            this.spinner.stop();
          }
        });

      // department
      this.api
        .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + event, {}, 'GET', true, true, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldepartment = res.data;

            this.spinner.stop();
          }
        });
    } else {
      this.alldesignation = [];
      this.alldepartment = [];
      this.allbranch = [];
      this.branchMasterId = null;
      this.departmentId = null;
      this.designationId = null;
    }
  }

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }

}
