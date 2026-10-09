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
    selector: 'app-edit-goal-setting',
    templateUrl: './edit-goal-setting.component.html',
    styleUrls: ['./edit-goal-setting.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditGoalSettingComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  file: any;
  format: any;
  editData: any;
  url: any;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  // values: string;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  goal: any = [];
  editbyid: any;
  values: any[] = [{ gradeName: '', gradeRange: '' }];
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

  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.editdata();
    this.getIPAddress();
  }

  editdata() {
    let id = this.formValue.ListGoalSettingComponent.id;
    this.spinner.start('edit');
    this.api.callApi(this.constant.GETONEGOALSETTING + id, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        if (res.data) {
          this.editData = res.data;
        }

        let gradeArray = [];

        for (let key in this.editData.grade) {
          if (this.editData.grade.hasOwnProperty(key)) {
            let range = this.editData.grade[key];
            let [min, max] = range.split('-').map(Number);
            gradeArray.push({ grade: key, range: `${min}-${max}` });
          }
        }

        this.values = gradeArray;
        this.spinner.stop('edit');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('edit');
      },
    );
  }

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
         this.handleError('Something Went Wrong!')
          this.spinner.stop('start');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );
  }

  removeGrade(index: number) {
    this.values.splice(index, 1);
  }
  addGrade() {
    this.values.push({ grade: '', range: '' });
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    const grades = {};
    this.values.forEach((value, index) => {
      grades[value.grade] = value.range;
    });

    let body = {
      title: this.addcomp.value.title,
      description: this.addcomp.value.description,
      companyMasterID: this.addcomp.value.companyMasterID,
      grade: grades,
    };

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.UPDATEGOALSETTING + this.formValue.ListGoalSettingComponent.id,
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
