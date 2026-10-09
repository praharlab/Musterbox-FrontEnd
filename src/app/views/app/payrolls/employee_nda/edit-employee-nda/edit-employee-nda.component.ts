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
    selector: 'app-edit-employee-nda',
    templateUrl: './edit-employee-nda.component.html',
    styleUrls: ['./edit-employee-nda.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditEmployeeNdaComponent implements OnInit {
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
  employeenda: any;
  ndacategory1: any;
  comp: any;
  usertype: any;
  company_id: any;
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

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');

    this.getIPAddress();
    this.editdata();
    this.getcompany();
    this.getndacategory(this.company_id);
    this.getuser(this.company_id);
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
  getcompid(id: any) {
    this.previous_cat = false;
    this.previous_user = false;
    this.getndacategory(id);
    this.getuser(id);
  }

  getndacategory(id1: any) {
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id1,
      status: 1,
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
  editdata() {
    let nda = this.formValue.ListEmployeeNdaComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETBYIDEMPLOYEENDA + nda, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.employeenda = res.data;
          this.employeenda.givendate = this.employeenda.givendate.slice(0, 10);

          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();

        },
      );
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    this.spinner.start();
    const formData = new FormData();
    if (this.file) {
      formData.append('pdf', this.file);
    }
    formData.append('employeeNdaid', this.formValue.ListEmployeeNdaComponent.id);
    formData.append('Ndacategoryid', this.addcomp.value.ndacat);
    formData.append('userMasterID', this.addcomp.value.user);
    formData.append('description', this.addcomp.value.description);
    formData.append('Ndaname', this.addcomp.value.ndamane);
    formData.append('givendate', this.addcomp.value.date);
    formData.append('showtoemployee', this.addcomp.value.defaultRight);
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);

    if (this.childcompany == 'false') {
      formData.append('companyMasterID', this.addcomp.value.company);
    } else {
      formData.append('companyMasterID', localStorage.getItem('company_id'));
    }

    this.api.callApi(this.constant.UPDATEEMPLOYEENDA, formData, 'POST', true, true, true).subscribe(
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
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
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
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }
}
