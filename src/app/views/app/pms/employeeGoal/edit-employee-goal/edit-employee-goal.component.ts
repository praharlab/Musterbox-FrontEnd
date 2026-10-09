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
    selector: 'app-edit-employee-goal',
    templateUrl: './edit-employee-goal.component.html',
    styleUrls: ['./edit-employee-goal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditEmployeeGoalComponent implements OnInit {
  @ViewChild('editEmpGoal') editEmpGoal: NgForm;
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
  goal: any = [];
  adminRoot = environment.adminRoot;
  companyDisplayName: string;
  employee: any;
  goalId: number;
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
    let bb = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
    };
    let id = this.formValue.ListEmployeeGoalComponent.id;
    this.spinner.start('start');
    this.api.callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.spinner.stop('start');
        } else {
          this.spinner.stop('start');
          this.handleError('Something Went Wrong!');
        }
      },
      () => {
        this.handleError('Something Went Wrong!');
        this.spinner.stop('start');
      },
    );
    this.spinner.start('start');
    this.api.callApi(this.constant.GETONEEMPLOYEEGOAL + id, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        if (res.data) {
          this.editData = res.data;
          this.getEmployeeGoal(this.editData.goalMaster.companyMasterId);
        }
        this.spinner.stop('start');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );
  }

  getEmployeeGoal(id) {
    if (!id) {
      return;
    }
    this.spinner.start('goal');
    this.api
      .callApi(this.constant.GETALLGOAL + '?companyMasterID=' + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.goal = res.data;
          this.spinner.stop('goal');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('goal');
        },
      );
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  onSubmit() {
    if (!this.editEmpGoal.valid) {
      return;
    }

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    const body = {
      remarks: this.editEmpGoal.value.remarks,
      targetGiven: this.editEmpGoal.value.targetGiven,
      status: this.editEmpGoal.value.status,
      goalMasterId: Number(this.editEmpGoal.value.goalMasterId),
    };
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.UPDATEEMPLOYEEGOAL + this.formValue.ListEmployeeGoalComponent.id,
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
            this.router.navigate([this.adminRoot + '/pms/empgoal']);

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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
