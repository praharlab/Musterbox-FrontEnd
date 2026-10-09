import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { error } from 'console';

@Component({
    selector: 'app-add-checklist-question',
    templateUrl: './add-checklist-question.component.html',
    styleUrls: ['./add-checklist-question.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddChecklistQuestionComponent implements OnInit {
  @ViewChild('addchecklist') addchecklist: NgForm;

  file: any;
  format: any;
  url: any;
  ipAddress: any;
  product: any = [];
  usertype: any;
  company_id: any;
  alldesignation: any = [];
  checkList: any;
  selectedcompany: any;
  selectedchecklist: any;
  selecteddesignation: any;
  designation: any;
  values = [];
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
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getproduct();
    this.addvalue(); // Initialize with one empty object
  }

  add() {
    this.values = [];
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }

  addvalue() {
    this.values.push({ checkListQuestion: '' });
  }

  getDesignation(id: any) {

    if (id) {
      this.spinner.start();

      this.api
        .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.designation = res.data;
            this.spinner.stop();
          }
        });
    }
    this.designation = [];
    this.selecteddesignation = '';
    this.checkList = [];
    this.selectedchecklist = '';
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
        companyMasterID: this.company_id,
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

  getchecklist(id1: any) {
    if (id1) {
      this.spinner.start();
      const body = {
        page: '',
        limit: '',
        designationId: id1,
      };

      this.api
        .callApi(this.constant.GETALLCHECKLISTDATA, body, 'POST', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.checkList = res.data;
              this.spinner.stop();
            } else {
              console.error('Error Fetching Check List Name:', res.message);
            }
          },
          (error) => {
            console.error('Error Fetching Checklist Name:', error);
          },
        );
    }

    this.checkList = [];
    this.selectedchecklist = '';
  }

  onSubmit() {
    if (!this.addchecklist.valid) {
      return;
    }

    const checkListQuestion = [];
    for (var i = 0; i < this.values.length; i++) {
      checkListQuestion.push(this.values[i].checkListQuestion);
    }
    if (!this.addchecklist.valid) {
      return;
    }

    if (!this.addchecklist.valid) {
      return;
    }

    let body = {
      checklistQuestion: checkListQuestion,
      checkListID: this.addchecklist.value.checkListID,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATECHECKLISTQUESTIONDATA, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/checklists/checklistQuestion']);

              this.spinner.stop();
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
