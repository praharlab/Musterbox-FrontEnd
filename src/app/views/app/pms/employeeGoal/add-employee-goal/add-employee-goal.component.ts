import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-employee-goal',
    templateUrl: './add-employee-goal.component.html',
    styleUrls: ['./add-employee-goal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddEmployeeGoalComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  allcomp: any = [];
  selected: any = [];
  user: any = [];
  usertype: any;
  company_id: any;
  employee: any;
  goal: any = [];
  percentage: any = [];
  buttonDisabled = false;
  buttonState = '';
  adminRoot = environment.adminRoot;
  selectedUsers: any = [];
  values = [];
  i: any;
  value: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.addMoreUsers();
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }
  addMoreUsers() {
    this.values.push({
      user: '',
      evaluationPeriod: '',
      remarks: '',
      targetGiven: '',
    });
    const selectedIds = this.values.reduce((ids, value) => {
      return ids.concat(value.selectedUsers || []);
    }, []);

    this.employee = this.employee?.filter((e) => !selectedIds.includes(e.userMasterID));
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;
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

  selectcompany(id) {
    this.employee = [];
    this.selectedUsers = [];
    if (!id) {
      return;
    }
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('user');
    this.api.callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.spinner.stop('user');
        } else {
          this.handleError('Something Went Wrong!')
          this.spinner.stop('user');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('user');
      },
    );

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

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }



    const bulkData = this.values.map((value) => {
      return {
        userMasterID: value.selectedUsers, // Ensure user is a valid number
        remarks: value.remarks,
        targetGiven: value.targetGiven,
        evaluationPeriod: value.evaluationPeriod,
      };
    });

    const body = {
      goalMasterId: Number(this.addcomp.value.goalMasterId),
      bulkData,
    };

    this.spinner.start('start');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.api
      .callApi(this.constant.BULKCREATEEMPLOYEEGOAL, body, 'POST', true, true, true)
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
