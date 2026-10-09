import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-user-checklist',
    templateUrl: './edit-user-checklist.component.html',
    styleUrls: ['./edit-user-checklist.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditUserChecklistComponent implements OnInit {
  @ViewChild('addchecklist') addchecklist: NgForm;
  ipAddress: any;
  checklist1: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  allChecklist: any = [];
  checkedCheckedList: any = [];
  editData: any;
  adminRoot = environment.adminRoot;
  currPosition: null;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.editdata();
    this.getIPAddress();
    this.getcheckList();
  }

  editdata() {
    let id = this.formValue.ListUserChecklistComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETUSERCHECKLISTBYID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editData = res.data;
          this.getAllChecklist(this.editData.checkListID);

          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }
  getcheckList() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETALLCHECKISTBYUSER + localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.checklist1 = res.data;
          this.spinner.stop();
        }
      });
  }

  getAllChecklist(id: any) {
    this.allChecklist = [];
    if (id) {
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCHECKISTQBYUSER + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allChecklist = res.data;
            this.checkedCheckedList = this.editData.filledChecklistQID;
            for (var i = 0; i < this.allChecklist.length; i++) {
              if (
                this.editData.filledChecklistQID.includes(this.allChecklist[i].checkListQuestionID)
              ) {
                this.allChecklist[i].status = true;
                let index = this.editData.filledChecklistQID.indexOf(this.allChecklist[i].checkListQuestionID);
                this.allChecklist[i].createdAt = this.editData.filledChecklistQDate[index]
              } else {
                this.allChecklist[i].status = false;
                this.allChecklist[i].createdAt = ''
              }
            }
            this.spinner.stop();
          }
        });
    }
  }

  onSubmit() {
    if (!this.addchecklist.valid) {
      return;
    }
    let body = {
      userChecklistID: this.formValue.ListUserChecklistComponent.id,
      checkListID: this.addchecklist.value.checklist,
      userMasterID: localStorage.getItem('id'),
      date: this.addchecklist.value.date,
      filledChecklistQID: this.checkedCheckedList,
      currPosition: this.currPosition,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.spinner.start('add11');
    this.api.callApi(this.constant.UPDATEUSERCHECKLIST, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          // this.notifications.create('Done', res.message, NotificationType.Bare, {
          //   theClass: 'outline primary',
          //   timeOut: 3000,
          //   showProgressBar: true,
          // });
          // setTimeout(() => {
          //   this.router.navigate([this.adminRoot + '/checklists/userCheckList']);

          //   this.buttonDisabled = false;
          //   this.buttonState = '';
          this.spinner.stop('add11');
          this.editdata()
          // }, 3000);
        } else {
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('add11');
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop('add11');
      },
    );
  }

  changeQuestion(event: any, i: any) {
    if (event) {
      this.checkedCheckedList.push(this.allChecklist[i].checkListQuestionID);
      this.currPosition = null
    } else {
      let index = this.checkedCheckedList.indexOf(this.allChecklist[i].checkListQuestionID);
      this.checkedCheckedList.splice(index, 1);
      this.currPosition = index
    }
    this.onSubmit();
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
