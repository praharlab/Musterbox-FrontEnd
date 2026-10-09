import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { add } from 'ngx-bootstrap/chronos';

@Component({
    selector: 'app-add-user-checklist',
    templateUrl: './add-user-checklist.component.html',
    styleUrls: ['./add-user-checklist.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddUserChecklistComponent implements OnInit {
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
  checklistDate: any;
  adminRoot = environment.adminRoot;
  added: boolean = false;
  date11: any = new Date().toISOString().slice(0, 10);
  presentDate: any = new Date().toISOString().slice(0, 10);
  currentID: any;
  editData: any;
  currPosition: any = null
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getcheckList();
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
    // this.allChecklist = [];
    // this.checklistDate = '';
    // if (this.editData) this.editData.date = ''
    this.date11 = new Date().toISOString().slice(0, 10);
    this.presentDate = new Date().toISOString().slice(0, 10);
    if (id) {
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCHECKISTQBYUSER + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allChecklist = res.data;
            this.date11 = res.date;
            this.presentDate = res.presentDate;
            for (var i = 0; i < this.allChecklist.length; i++) {
              if (this.editData.createBy) {
                if (this.editData && this.editData.filledChecklistQID.includes(this.allChecklist[i].checkListQuestionID)) {
                  this.allChecklist[i].status = true;
                  let index = this.editData.filledChecklistQID.indexOf(this.allChecklist[i].checkListQuestionID);
                  this.allChecklist[i].createdAt = this.editData.filledChecklistQDate[index]
                } else {
                  this.allChecklist[i].status = false;
                  this.allChecklist[i].createdAt = ''
                }
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

    if (
      new Date(this.addchecklist.value.date) < new Date(this.date11) ||
      new Date(this.addchecklist.value.date) > new Date(this.presentDate)
    ) {
      this.notifications.create('Error', 'Please select date in range', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }

    let body = {
      checkListID: this.addchecklist.value.checklist,
      userMasterID: localStorage.getItem('id'),
      date: this.addchecklist.value.date,
      filledChecklistQID: this.checkedCheckedList,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    this.spinner.start('add');
    this.api.callApi(this.constant.ADDUSERCHECKLIST, body, 'POST', true, true, true).subscribe(
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
          this.spinner.stop('add');
          // }, 3000);
          this.added = true
          this.currentID = res.id
          this.editdata()

        } else {
          this.getAllChecklist(this.addchecklist.value.checklist)
          this.checkedCheckedList = []
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('add');
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
        this.spinner.stop('add');
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

    if (this.added == false) {
      this.onSubmit();
    } else {
      this.onSubmit1();
    }
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  editdata() {
    let id = this.currentID;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETUSERCHECKLISTBYID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editData = res.data;
          this.getAllChecklist(this.editData.checkListID);

          this.spinner.stop('edit');
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop('edit');
        },
      );
  }

  onSubmit1() {
    if (!this.addchecklist.valid) {
      return;
    }
    let body = {
      userChecklistID: this.currentID,
      checkListID: this.addchecklist.value.checklist,
      userMasterID: localStorage.getItem('id'),
      date: this.addchecklist.value.date,
      filledChecklistQID: this.checkedCheckedList,
      currPosition: this.currPosition,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.spinner.start('edit1');
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
          this.spinner.stop('edit1');
          // }, 3000);
          this.editdata()

        } else {
          this.getAllChecklist(this.addchecklist.value.checklist)
          this.checkedCheckedList = []
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('edit1');
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
        this.spinner.stop('edit1');
      },
    );
  }

  getbyUserAndDate() {

    if (this.addchecklist.value.checklist && this.addchecklist.value.date) {
      this.checkedCheckedList = []
      let body = {
        checkListID: this.addchecklist.value.checklist,
        userMasterID: localStorage.getItem('id'),
        date: this.addchecklist.value.date,
      }
      this.spinner.start('edit');
      this.api
        .callApi(this.constant.GETCHECKLISTBYUSERDATE, body, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.data) {
              this.editData = res.data;
              this.getAllChecklist(this.editData.checkListID);
              for (let item of this.editData.filledChecklistQID) {
                this.checkedCheckedList.push(item);
              }
              this.added = true
              this.currentID = this.editData.userChecklistID
            } else {
              this.editData = null
              let temp = {
                checkListID: this.addchecklist.value.checklist,
                date: this.addchecklist.value.date,
                createBy: null
              }
              this.editData = temp
              this.added = false
              this.getAllChecklist(this.editData.checkListID);
            }
            this.spinner.stop('edit');
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop('edit');
          },
        );
    }
  }
}
