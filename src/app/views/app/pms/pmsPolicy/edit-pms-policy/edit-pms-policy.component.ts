import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormControl, FormGroup } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-pms-policy',
    templateUrl: './edit-pms-policy.component.html',
    styleUrls: ['./edit-pms-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditPmsPolicyComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  file: any;
  format: any;
  editData: any;
  url: any;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  values: string;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');
    this.getIPAddress();
    this.getcompany();
    this.editdata();
  }
  editdata() {
    let id = this.formValue.ListPmsPolicyComponent.id;
    this.spinner.start('data');
    this.api.callApi(this.constant.GETONEPMSPOLICY + id, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        if (res.data) {
          this.editData = res.data;
          // this.getPmsPolicy(this.editData.goalMaster.companyMasterId);
        }
        this.spinner.stop('data');
      },
      () => {
        this.handleError('Something Went Wrong!');
        this.spinner.stop('data');
      },
    );
  }
  // getPmsPolicy(id) {
  //   if (!id) {
  //     return;
  //   }
  // }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('start');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('start');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('start');
        }
      },
      () => {
        this.handleError('Something Went Wrong!');
        this.spinner.stop('start');
      },
    );
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    let body = {
      goalType: this.addcomp.value.goalType,
      companyMasterID: this.addcomp.value.companyMasterID,
    };
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.UPDATEPMSPOLICY + this.formValue.ListPmsPolicyComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/pms/pmspolicy']);

            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('start');
          }, 3000);
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
