import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-skillsetform',
    templateUrl: './edit-skillsetform.component.html',
    styleUrls: ['./edit-skillsetform.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditSkillsetformComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  product: any = [];
  usertype: any;
  company_id: any;
  values = [];
  companydata: any;
  editbyid: any;
  alldesignation: any;
  designationid: number;
  companyid: number;
  flattenedArray: any;
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    public datepipe: DatePipe,
    public activatedRoute: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getproduct();
    this.values.push({ skillsetsForm: '' });
    this.getIPAddress();
    this.editdata();
  }
  add() {
    this.values = [];
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }

  addvalue() {
    this.values.push({ skillsetsForm: '' });
  }
  getproduct() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.product = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: localStorage.getItem('company_id'),
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.product = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  SelectedDesignation(company_id) {
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + company_id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          this.spinner.stop();
        }
      });
  }

  SelectedSkillSets(id) {
    let body = {
      companyMasterID: id,
    };
    this.api
      .callApi(this.constant.GETALLSKILLSETSUSINGCOMPANYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.flattenedArray = res.data;
          this.spinner.stop();
        }
      });
  }

  editdata() {
    let id = this.formValue.ListSkillsetformComponent.id;

    this.spinner.start();
    this.api
      .callApi(this.constant.GETSKILLSETSFORMBYID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editbyid = res.data;
          this.companyid = Number(this.editbyid[0].companyMasterId);
          this.designationid = this.editbyid[0].designationID;
          this.SelectedDesignation(this.companyid);
          this.SelectedSkillSets(this.companyid);

          let formattedData = res.data.map((item) => {
            return item.skillSetsID.map((skill) => {
              return {
                skillSetID: skill.skillSetID,
                skillSet: skill.skillSet,
              };
            });
          });

          let respo = formattedData[0];
          this.values = respo;
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
  onSubmit() {
    const commaSeparatedString = this.values.map((item) => item.skillSetID).join(',');

    const numbersArray = commaSeparatedString.split(',').map(Number);
    const convertedString = `{${numbersArray.join(',')}}`;
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      skillsetsFormID: this.formValue.ListSkillsetformComponent.id,
      skillSetsID: numbersArray,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };


    this.spinner.start();
    this.api
      .callApi(this.constant.SKILLSETSFORMUPDATEBYID, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.spinner.stop();
              this.router.navigate([this.adminRoot + '/skillsets/skillsetform']).then(() => {
                this.spinner.stop();
              });
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
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
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
