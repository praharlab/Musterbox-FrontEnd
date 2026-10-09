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
    selector: 'app-add-employee-nda',
    templateUrl: './add-employee-nda.component.html',
    styleUrls: ['./add-employee-nda.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddEmployeeNdaComponent implements OnInit {
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
  ndacategory1: any;
  fileselected?: Blob;
  pdfUrl?: string;
  base64: string;
  comp: any;
  usertype: any;
  company_id: any;
  childcompany: string;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private sant: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');

    this.getIPAddress();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop();
        }
      });
  }
  getndacategory(id1: any) {
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id1,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLNDACATEGORY, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ndacategory1 = res.data;
          this.spinner.stop();
        }
      });
  }
  getuser(id: any) {
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.spinner.stop();
        }
      });
  }

  setcompid(id: any) {
    this.getuser(id);
    this.getndacategory(id);
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() != 'pdf') {
      this.notifications.create(
        'Error',
        'Selected file format is not supported!!',
        NotificationType.Bare,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
    } else {
      this.file = event.target.files && event.target.files[0];
      if (this.file) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        if (this.file.type.indexOf('image') > -1) {
          this.format = 'image';
        } else if (this.file.type.indexOf('video') > -1) {
          this.format = 'video';
        }
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      }
    }
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    this.spinner.start();
    const formData = new FormData();
    formData.append('pdf', this.file);
    formData.append('Ndacategoryid', this.addcomp.value.ndacat);
    formData.append('userMasterID', this.addcomp.value.user);
    formData.append('description', this.addcomp.value.description);
    formData.append('Ndaname', this.addcomp.value.ndamane);
    formData.append('givendate', this.addcomp.value.date.slice(0, 10));
    formData.append('showtoemployee', this.addcomp.value.defaultRight);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);

    if (this.childcompany == 'false') {
      formData.append('companyMasterID', this.addcomp.value.company);
    } else {
      formData.append('companyMasterID', localStorage.getItem('company_id'));
    }


    this.api.callApi(this.constant.ADDEMPLOYEENDA, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/payrolls/employee_nda']);

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

  onSubmit1() {
    if (!this.addcomp1.valid) {
      return;
    }
    let body;

    if (this.childcompany == 'false') {
      body = {
        nda_category: this.addcomp1.value.category,
        companyMasterID: this.addcomp1.value.company,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        nda_category: this.addcomp1.value.category,
        companyMasterID: localStorage.getItem('company_id'),
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }


    this.spinner.start();
    this.api.callApi(this.constant.ADDNDACATEGORY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.ngOnInit();
          this.getndacategory(body.companyMasterID);
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate(['app/employee_nda/add_employee_nda']);
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
}
