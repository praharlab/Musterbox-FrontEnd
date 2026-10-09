import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-goal',
    templateUrl: './edit-goal.component.html',
    styleUrls: ['./edit-goal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditGoalComponent implements OnInit {
  form: UntypedFormGroup;
  bsValue = new Date();
  selectedDateRange: Date[] = [];
  maxDate = new Date();

  @ViewChild('addcomp') addcomp: NgForm;
  file: any;
  format: any;
  editData: any;
  url: any;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  goal: any = [];
  adminRoot = environment.adminRoot;

  values: any = [];
  valuesCopy: any = [];
  value: any;
  kraArray: any[] = [];
  setting: any;
  // durationStatus: boolean = false;
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
    this.addKra();
    this.getcompany();
    this.editdata();
    this.getIPAddress();
    this.form = new UntypedFormGroup({
      basicDate: new UntypedFormControl(new Date()),
    });
  }

  editdata() {
    let id = this.formValue.ListGoalComponent.id;
    this.spinner.start('start');
    this.api.callApi(this.constant.GETONEGOAL + id, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        if (res.data) {
          this.editData = res.data;
          this.selectedDateRange = [new Date(res.data.fromDate), new Date(res.data.toDate)];
          // this.values = res.data.kraMasters;
          this.values = res.data.kraMasters.map((item) => {
            return {
              id: +item.id,
              title: item.title,
              description: item.description,
              weightage: +item.weightage,
              kpi: item.kpiMasters.map((kpi) => {
                return {
                  id: +kpi.id,
                  title: kpi.title,
                  description: kpi.description,
                  weightage: +kpi.weightage,
                  targetGiven: +kpi.targetGiven,
                };
              }),
            };
          });
        }

        this.spinner.stop('start');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );
  }

  addKra() {
    let obj = {
      title: '',
      description: '',
      weightage: '',
      kpi: [{ title: '', description: '', weightage: '', targetGiven: '' }],
    };
    this.values.push(obj);
    // this.valuesCopy.push(obj);
  }

  addKpi(i) {
    let kpiobj = { title: '', description: '', weightage: '', targetGiven: '' };
    this.values[i].kpi.push(kpiobj);
    // this.valuesCopy[i].kpiMasters.push(kpiobj);
  }

  removeKpi(i, j) {
    if (this.values[i].kpi.length > 1) {
      if (this.values[i].kpi[j].hasOwnProperty('id')) {
        this.values[i].kpi[j]['delete'] = true;
        // this.valuesCopy[i].kpiMasters[j]['delete'] = true;
      } else {
        this.values[i].kpi.splice(j, 1);
        // this.valuesCopy[i].kpiMasters.splice(j, 1);
      }
    }
  }

  removeKra(i) {
    if (this.values.length > 1) {
      if (this.values[i].hasOwnProperty('id')) {
        this.values[i]['delete'] = true;

        this.values[i].kpi.map((e) => {
          e['delete'] = true;
        });

        // this.valuesCopy[i]['delete'] = true;
      } else {
        this.values.splice(i, 1);
        // this.valuesCopy.splice(i, 1);
      }
    }
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
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );

    this.spinner.start('goal');
    this.api
      .callApi(
        this.constant.GETALLGOALSETTING + '?companyMasterID=' + this.company_id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.setting = res.data;
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

    // if (!this.selectedDateRange) {
    //   this.durationStatus = true;
    //   return;
    // } else {
    //   this.durationStatus = false;
    // }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

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
    this.api
      .callApi(
        this.constant.UPDATEGOAL + this.formValue.ListGoalComponent.id,
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
            this.router.navigate([this.adminRoot + '/pms/goal']);

            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('start');
          }, 3000);
        },
        (err) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          this.handleError(err.error.message);
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
