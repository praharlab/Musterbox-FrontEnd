import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';


@Component({
    selector: 'app-add-company-training',
    templateUrl: './add-company-training.component.html',
    styleUrls: ['./add-company-training.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddCompanyTrainingComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  adminRoot = environment.adminRoot;
  company_id: any;
  company1: any;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.company_id = this.formValue.ListCompanyMasterComponent.id;


    this.getIPAddress();
    this.getcompany();
  }

  getcompany() {
    // const body = {
    //   companyMasterID: this.company_id,
    // };
    let companyid = this.company_id;

    this.spinner.start('company');
    this.api
    .callApi(this.constant.VIEWCOMPANYDATA + companyid, {}, 'GET', false, true, true)
    .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('company');
        }
      });
  }



  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }


    let body = {
      companyMasterID: this.company_id,
      title: this.addcomp.value.title,
      description: this.addcomp.value.description,
      trainingDate: this.addcomp.value.tdate,
      startTrainingTiming: this.addcomp.value.starttime+':00',
      endTrainingTiming: this.addcomp.value.endtime+':00',
      trainingTakenBy: this.addcomp.value.ttkaneby,
    };
    this.spinner.start();
    this.api.callApi(this.constant.ADDCOMPANYTRAINING, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/company_training']);
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

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }




}
