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
import { UserFormValueStorageService } from 'src/app/services/user-form-value-storage.service';

@Component({
    selector: 'app-edit-task',
    templateUrl: './edit-task.component.html',
    styleUrls: ['./edit-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTaskComponent implements OnInit {
  @ViewChild('addtask') addtask: NgForm;
  @ViewChild('accept') accept: NgForm;
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  images: any = [];
  values: any = [];
  file: any = [];
  taskName: any;
  company_id: any;
  empList: any;
  taskdata: any;
  taskdata1: any;
  fileToUpload: any;
  imageUrl: any;
  taskSummary: any;
  taskStatus: any;
  selected1: any = [];
  alluser: any;
  selected: any = [];
  ipAddress: any;
  rowshow: any;
  priority: any;
  taskauth: any;
  getStatus: any;
  date: any;
  url: any;
  datashow: any;
  leaveshow: any;
  day: any;
  format: any;
  allcomp: any;
  usertype: any;
  childcompany: any;
  finalholidaypolicy: string;
  ownerList: any;
  finalbranch: string;
  allbranch: any[];
  edit_Data: any;
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
    private userFormValueStorageService: UserFormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.editData();
    this.getcompany();
    this.getallemployee();
    this.getUrl();
    this.getIPAddress();
  }

  getcompany() {
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
            this.allcomp = res.data;
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
            this.allcomp = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  editData() {
    this.spinner.start('editData');
    this.api
      .callApi(this.constant.GETTASKBYID1 + this.formValue.ListTaskComponent.id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.edit_Data = res.data;

          this.getAllStatus(res.data.allTaskStage);
          this.edit_Data['userMaster.companyMaster.companyMasterID'] = Number(
            this.edit_Data['userMaster.companyMaster.companyMasterID'],
          );
          const boddy = {
            companyMasterID: this.edit_Data['userMaster.companyMaster.companyMasterID'],
          };
          this.spinner.start('getuser');
          this.api
            .callApi(this.constant.GETALLUSERS, boddy, 'POST', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.ownerList = res.data;
                this.spinner.stop('getuser');
              }
            });
          if (this.edit_Data.startDate) {
            this.edit_Data.startDate = this.edit_Data.startDate.slice(0, 10);
          }
          if (this.edit_Data.endDate) {
            this.edit_Data.endDate = this.edit_Data.endDate.slice(0, 10);
          }

          this.spinner.stop('editData');
        }
      });
  }

  selectcompany(event) {
    this.finalbranch = '';
    this.finalholidaypolicy = '';
    this.allbranch = [];
    this.ownerList = [];

    if (event) {
      this.company_id = event;
    }
  }

  selectbranch(event) {
    this.selected = [];
    this.finalholidaypolicy = '';

    if (event) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: event,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            // this.ownerList.map((el) => {
            //   el.name =
            //     el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')'
            // })
            this.spinner.stop();
          }
        });
    } else {
      const filterData = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            // this.ownerList.map(el => {
            //   el.name = el.firstName + " " + el.lastName + " (" + el.userNumber + ")"
            // })
            this.spinner.stop();
          }
        });
    }
  }

  getAllStatus(ids: any) {
    let notIncluded = [],
      allIDS = [];
    let body = {
      page: '',
      limit: '',
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.api
      .callApi(this.constant.GETALLTASKSTAGES, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.getStatus = res.data;

          for (var i = 0; i < this.getStatus.length; i++) {
            allIDS.push(this.getStatus[i].tasks_stagesID);
          }

          for (var i = 0; i < ids.length; i++) {
            if (!allIDS.includes(ids[i])) {
              notIncluded.push(ids[i]);
            }
          }

          if (notIncluded.length > 0) {
            let body = {
              id: notIncluded,
            };
            let final;
            this.spinner.start();
            this.api
              .callApi(this.constant.GETALLSTAGESBYID, body, 'POST', true, false, true)
              .subscribe((res: any) => {
                if (res.status == 200) {
                  final = res.data;
                  for (var i = 0; i < final.length; i++) {
                    this.getStatus.push(final[i]);
                  }
                  this.spinner.stop();
                }
              });
          }
        }
      });
  }

  onSubmit() {
    if (!this.addtask.valid) {
      return;
    }
    const formData = new FormData();

    if (!this.addtask.value.starttime) {
      this.addtask.value.starttime = '';
    }
    if (!this.addtask.value.day) {
      this.addtask.value.day = '';
    }
    let zero = '0';
    formData.append('userMasterID', this.addtask.value.userMasterID);
    formData.append('TaskName', this.addtask.value.taskname);
    formData.append('TaskDesc', this.addtask.value.description);
    formData.append('priority', this.addtask.value.priority);
    formData.append('user_TasksID', this.formValue.ListTaskComponent.id);

    formData.append('tasktype', zero);
    formData.append('startDate', this.addtask.value.startdate);
    if(this.addtask.value.startTime)
    formData.append('startTime', this.addtask.value.startTime);
    formData.append('endDate', this.addtask.value.enddate);
    formData.append('tasks_stagesID', this.edit_Data.allTaskStage[0]);
    formData.append('allTaskStage', this.edit_Data.allTaskStage);
    formData.append('taskStatus', zero);
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);
    formData.append(
      'attachment',
      this.file && this.file.length > 0 ? this.file : this.edit_Data.attachment,
    );
    formData.append('taskWeightage', this.edit_Data.taskWeightage);
    formData.append('parentuserTasksID', this.edit_Data.parentuserTasksID);
    formData.append('hasSubTask', this.edit_Data.hasSubTask);
    this.spinner.start('add');
    this.api
      .callApi(this.constant.UPDATETASK2, formData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/tasks/task']);
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        }
      });
  }

  changePriority(value: any) {
    this.priority;
  }

  changeDay(value: any) {
    this.day;
  }

  changeDate(value: any) {
    this.date;
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getallemployee() {
    this.alluser = [];
    let bb1 = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, bb1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;

          this.selectAllForDropdownItems(this.alluser);
          this.alluser.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
        }
      });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
    this.getUrl();
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.file.push(event.target.files[i]);
        reader.readAsDataURL(event.target.files[i]);
      }
      this.file = this.file[0];
    }
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);

    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
  }

  changecoperson(id) { }

  getUrl() {
    return 'url(' + this.imageUrl + ')';
  }

  calltoshow(event) {
    if (event.target.value == '0') {
      this.datashow = true;
    } else {
      this.datashow = false;
    }
  }

  toShow(event) {
    if (event == 'Daily') {
      this.rowshow = 'Daily';
    } else if (event == 'Weekly') {
      this.rowshow = 'Weekly';
    } else if (!event) {
      this.rowshow = 'Daily';
    } else {
      this.rowshow = 'Monthly';
    }
  }

  addvalue() {
    this.values.push({ taskStage: '' });
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }
}
