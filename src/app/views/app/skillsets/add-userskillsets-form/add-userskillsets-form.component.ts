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
    selector: 'app-add-userskillsets-form',
    templateUrl: './add-userskillsets-form.component.html',
    styleUrls: ['./add-userskillsets-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddUserskillsetsFormComponent implements OnInit {
  company: any;
  company_id: any;
  assign: any;
  alldata: any;
  reportsTo: any;
  adminRoot = environment.adminRoot;

  permissioncreate: any = [];

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

  @ViewChild('addreport') addreport: NgForm;
  @ViewChild('addcomp') addcomp: NgForm;
  values: any = [];
  mytime: Date = new Date();
  valueshow: boolean;
  ipAddress: any;
  isdisabled = false;
  field: any = [];
  allcustomer: any;
  empList: any;
  selected: any = [];
  getallvisitpurpose: any;
  product: any;
  editvisitdatavalue: any = [];
  allkey: string[];
  allvalue: unknown[];
  questions: any;

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.questionsdata();
    this.getIPAddress();
    this.reportto();
    this.checkpermission();
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;

          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MySkillSetsForm' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  reportto() {
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWREPORT + localStorage.getItem('id'), {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.reportsTo = res.data;
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }

  questionsdata() {
    let id = this.formValue.UserSkillsetsFormComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETBYMONTHLYSKILLSETSID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.alldata = res.data;

          this.values = this.alldata[0].skillSetsID.map((skill) => {
            return {
              skillSet: skill.skillSet,
              skillSetID: skill.skillSetID,
              answers: null,
            };
          });

          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        },
      );
  }

  onSkillSetChange(index: number, value: number) {
    this.values[index].answers = value;
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    let asnwers = [];

    asnwers = this.values.map((item, index) => {
      return item.answers;
    });

    for (let i = 0; i < asnwers.length; i++) {
      if (asnwers[i] == null) {
        this.notifications.create(
          '',
          'Please Select Answer For All The Questions.',
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 1000,
            showProgressBar: false,
          },
        );
        return;
      }
    }

    this.spinner.start('start');
    let body = {
      reportsTo: this.addcomp.value.reportsToID,
      filledby: localStorage.getItem('id'),
      answerArray: asnwers,
      monthlySkillsetsFormID: this.formValue.UserSkillsetsFormComponent.id,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.api.callApi(this.constant.ADDSKILLSETSANSWERS, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/skillsets/user-skillsets-form']);

            this.spinner.stop('start');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop('start');
          }, 3000);
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('start');
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
