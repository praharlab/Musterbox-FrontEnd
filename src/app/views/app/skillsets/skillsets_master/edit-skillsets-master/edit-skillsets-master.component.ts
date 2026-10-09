import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-skillsets-master',
    templateUrl: './edit-skillsets-master.component.html',
    styleUrls: ['./edit-skillsets-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditSkillsetsMasterComponent implements OnInit {
  @ViewChild('editskillset') editskillset: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  ipAddress: any;
  company: any;
  skillsetData: any;
  countryid: any;
  stateid: any;
  cityid: any;
  usertype: any;
  company_id: any;
  allcomp: any;
  childcompany: any;
  buttonDisabled = false;
  buttonState = '';
  skillset: any;
  editcompanyID: number;
  adminRoot = environment.adminRoot;
  formValue: any;
  
  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.editdata();
    this.getcompany();
  }

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  editdata() {
    let id = this.formValue.ListSkillsetsMasterComponent.id;
    this.spinner.start();
    this.api.callApi(this.constant.GETSKILLSETBYID + id, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.skillsetData = res.data;
        this.editcompanyID = Number(this.skillsetData.companyMasterId);
        this.spinner.stop();
      },
      (err) => {
        console.log('error', err);
        this.spinner.stop();
      },
    );
  }

  onSubmit() {
    if (!this.editskillset.valid) {
      return;
    }
    let body = {};

    // if (this.childcompany == 'true') {
    //   body = {
    //     skillSetID: this.formValue.ListSkillsetsMasterComponent.id,
    //     companyMasterId: Number(localStorage.getItem('company_id')),
    //     skillSet: this.editskillset.value.Skillset,
    //     updateBy: localStorage.getItem('id'),
    //     updateByIp: this.ipAddress,
    //   }
    // } else {
    body = {
      companyMasterID: this.editskillset.value.company,
      skillSetID: this.formValue.ListSkillsetsMasterComponent.id,
      skillSet: this.editskillset.value.Skillset,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    // }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start();
    this.api.callApi(this.constant.SKILLSETUPDATEBYID, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/skillsets/skillset']);

            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Message', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.router.navigate([this.adminRoot + '/skillsets/skillset']);
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
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
