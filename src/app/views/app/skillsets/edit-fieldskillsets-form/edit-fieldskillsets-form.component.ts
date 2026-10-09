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
    selector: 'app-edit-fieldskillsets-form',
    templateUrl: './edit-fieldskillsets-form.component.html',
    styleUrls: ['./edit-fieldskillsets-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditFieldskillsetsFormComponent implements OnInit {
  company: any;
  company_id: any;
  assign: any;
  alldata: any;
  permissionedit: any = [];
  adminRoot = environment.adminRoot;

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

          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SkillSetsFormAuthorization' &&
              permissionval.operationName.includes('Edit')
            );
          });

          this.spinner.stop();
        }
      });
  }

  questionsdata() {
    let id = this.formValue.FieldSkillsetsFormComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETBYMONTHLYSKILLSETSID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.alldata = res.data;

          this.values = this.alldata[0].skillSetsID.map((skill, index) => {
            return {
              skillSet: skill.skillSet,
              skillSetID: skill.skillSetID,
              answers: this.alldata[0].answerSkillsets[index]
                ? Number(this.alldata[0].answerSkillsets[index])
                : null,
            };
          });

          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Error, {
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

    this.spinner.start('edit');
    let body1 = {
      answerArray: asnwers,
      monthlySkillsetsFormID: this.formValue.FieldSkillsetsFormComponent.id,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
      verifiedby: localStorage.getItem('id'),
    };

    this.api
      .callApi(this.constant.UPDATESKILLSETSANSWERS, body1, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/skillsets/field-skillsets-form']);

              this.spinner.stop('edit');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.spinner.stop('edit');
            }, 3000);
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('edit');
        },
      );

    let body = {
      verified: 1,
      monthlySkillsetsFormID: this.formValue.FieldSkillsetsFormComponent.id,
    };

    this.api
      .callApi(this.constant.VERIFYSKILLSETSANSWERS, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Error, {
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
}
