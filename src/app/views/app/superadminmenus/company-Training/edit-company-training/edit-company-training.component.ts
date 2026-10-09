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
    selector: 'app-edit-company-training',
    templateUrl: './edit-company-training.component.html',
    styleUrls: ['./edit-company-training.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditCompanyTrainingComponent implements OnInit {
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
  trainingdata: any;

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
    // this.company_id = this.formValue.ListCompanyMasterComponent.id;


    this.getIPAddress();
    this.editdata();

  }


  editdata() {
    let id = this.formValue.ListCompanyTrainingComponent.id;
    this.spinner.start('edit');

    this.api
      .callApi(this.constant.GETCOMPANYTRAININGBYID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.trainingdata = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      companyMasterID: this.addcomp.value.company,
      title: this.addcomp.value.title,
      description: this.addcomp.value.description,
      trainingDate: this.addcomp.value.tdate,
      startTrainingTiming: this.trainingdata.startTrainingTiming,
      endTrainingTiming: this.trainingdata.endTrainingTiming,
      trainingTakenBy: this.addcomp.value.ttkaneby,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATECOMPANYTRAINING + this.formValue.ListCompanyTrainingComponent.id, body, 'PUT', true, true, true).subscribe(
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
          this.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
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

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }

  // isEndTimeValid(startTime: string, endTime: string): boolean {

  //   const start = new Date(`1970-01-01T${startTime}:00`);
  //   const end = new Date(`1970-01-01T${endTime}:00`);

  //   return end > start;
  // }
}
