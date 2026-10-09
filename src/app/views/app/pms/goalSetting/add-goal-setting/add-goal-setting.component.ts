import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-goal-setting',
    templateUrl: './add-goal-setting.component.html',
    styleUrls: ['./add-goal-setting.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddGoalSettingComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  ipAddress: any;
  company: any = [];
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  employee: any;
  values: any[] = [{ gradeName: '', gradeRange: '' }];
  adminRoot = environment.adminRoot;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company1');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('company1');
        } else {
         this.handleError('Something Went Wrong!')
          this.spinner.stop('company1');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company1');
      },
    );
  }
  selectcompany(id) {
    if (!id) {
      return;
    }
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.spinner.stop('company');
        } else {
         this.handleError('Something Went Wrong!')
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }

  addvalue() {
    this.values.push({ gradeName: '', gradeRange: '' });
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    const grades = {};
    this.values.forEach((value, index) => {
      grades[this.addcomp.value['gradeName' + index]] = this.addcomp.value['gradeRange' + index];
    });

    const body = {
      title: this.addcomp.value.title,
      description: this.addcomp.value.description,
      companyMasterID: this.addcomp.value.companyMasterID,
      grade: grades,
    };

    this.spinner.start('start');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.api.callApi(this.constant.CREATEGOALSETTING, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.notifications.create('Done', res.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: true,
        });
        setTimeout(() => {
          this.router.navigate([this.adminRoot + '/pms/goalsetting']);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('start');
        }, 3000);
      },
      (err) => {
        this.handleError(err.error.message);
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop('start');
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message : any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
