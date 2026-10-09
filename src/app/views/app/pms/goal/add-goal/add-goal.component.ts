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
    selector: 'app-add-goal',
    templateUrl: './add-goal.component.html',
    styleUrls: ['./add-goal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddGoalComponent implements OnInit {
  bsValue = new Date();
  selectedDateRange: Date[] = [];
  maxDate = new Date();
  showKRASection: boolean = false;

  @ViewChild('addcomp') addcomp: NgForm;
  ipAddress: any;
  company: any = [];
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  employee: any;
  values = [];
  value: any;
  kraArray: any[] = [];
  setting: any;
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
    this.addKra();
    this.addKpi(0);
  }

  addKra() {
    let obj = { title: '', description: '', weightage: '', kpi: [] };
    this.values.push(obj);
  }

  addKpi(i) {
    let kpiobj = { title: '', description: '', weightage: '', targetGiven: '' };

    this.values[i].kpi.push(kpiobj);
  }

  removeKpi(i, j) {
    this.values[i].kpi.splice(j, 1);
  }

  removeKra(i) {
    this.values.splice(i, 1);
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('a');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop('a');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('a');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('a');
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
    this.spinner.start('a');
    this.api.callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.spinner.stop('a');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('a');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('a');
      },
    );
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETALLGOALSETTING + '?companyMasterID=' + id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.setting = res.data;
          this.spinner.stop('a');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('a');
        },
      );
  }

  addKRA() {
    this.kraArray.push({
      title: '',
      description: '',
      weightage: null,
      kpi: [],
    });
  }

  removeKRA(index: number) {
    this.kraArray.splice(index, 1);
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    let body = {
      title: this.addcomp.value.title,
      description: this.addcomp.value.description,
      companyMasterID: this.addcomp.value.companyMasterID,
      type: this.addcomp.value.type,
      fromDate: this.formatDateArray(this.selectedDateRange[0]),
      toDate: this.formatDateArray(this.selectedDateRange[1]),
      goalSettingId: Number(this.addcomp.value.goalSettingId),
      kra: this.values,
    };
    this.spinner.start('start');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEGOAL, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.notifications.create('Done', res.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: true,
        });
        setTimeout(() => {
          this.router.navigate([this.adminRoot + '/pms/goal']);

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

  private formatDateArray(item: any) {
    const date = new Date(item);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
