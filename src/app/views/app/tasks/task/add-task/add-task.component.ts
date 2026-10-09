import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTaskComponent implements OnInit {
  @ViewChild('addtask') addtask: NgForm;
  @ViewChild('addtSubTask') addtSubTask: NgForm;
  @ViewChild('addtSubTask1') addtSubTask1: NgForm;
  @ViewChild('subTaskEditSubmitFrom') subTaskEditSubmitFrom: NgForm;
  @ViewChild('accept') accept: NgForm;
  @ViewChild('lgModal', { static: false }) lgModal: ModalDirective;
  @ViewChild('lgModal3', { static: false }) lgModal3: ModalDirective;
  @ViewChild('lgModal2', { static: false }) lgModal2: ModalDirective;

  images: any = [];
  values: any = [];
  file: any = [];
  file1: any = [];
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
  // priority: any;
  taskauth: any;
  getStatus: any;
  getDefaultStatus: any;
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
  ownerList1: any;
  allusers: any;
  allusersData: any;
  finalbranch: string;
  finalUser: string;
  allbranch: any[];
  adminRoot = environment.adminRoot;
  finalbranch1: string;
  // finalUser1: string;
  index: any = 0;
  addSubTask: any = 'false';
  samAsMainTask: any = 'false';
  maintaskRequired: any = 'true';
  TaskINFO: any;
  editTaskINFO: any;
  editIndex: any;
  taskNameModel: any;
  // sameTaskName: any;
  priorityModel: any;
  // samePriority: any;
  startdateModel: any;
  // sameStartdate: any;
  starttimeModel: any;
  // sameStarttime: any;
  enddateModel: any;
  // sameEnddate: any;
  descriptionModel: any;
  // sameDescription: any;
  taskStatusModel: any;
  sameDataObject = {
    sameTaskName: '',
    samePriority: '',
    sameStartdate: '',
    sameStarttime: '',
    sameEnddate: '',
    sameDescription: '',
    sameFileName: null,
  };
  mainTaskAttachment: any = [];
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
    this.company_id = +localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');
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
      this.selectcompany(this.company_id);
    }
  }

  async selectcompany(event: any) {
    this.finalbranch = null;
    this.finalUser = null;
    this.finalholidaypolicy = '';
    this.allbranch = [];
    this.ownerList = [];
    this.ownerList1 = [];
    this.allusers = [];
    this.allusersData = [];
    this.values = [];

    if (event) {
      this.company_id = event;
      const filterData = { companyMasterID: event };

      try {
        this.spinner.start('users');
        const userRes = await this.api.callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true).toPromise();
        if (userRes.status === 200) {
          this.ownerList = userRes.data;
          this.ownerList1 = userRes.data;
          this.allusers = userRes.data;
          this.allusersData = userRes.data;
        }
        this.spinner.stop('users');

        this.spinner.start('branch');
        const branchRes = await this.api.callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true).toPromise();
        this.allbranch = branchRes;
        this.spinner.stop('branch');

        this.spinner.start('getallstages');
        const stagesRes = await this.api.callApi(this.constant.GETALLTASKSTAGES, filterData, 'POST', true, false, true).toPromise();
        if (stagesRes.status === 200) {
          this.getStatus = stagesRes.data.filter((item) => item.TaskStage !== 'Assigned' && item.TaskStage !== 'Finished');
          this.getDefaultStatus = stagesRes.data.filter((item) => item.TaskStage === 'Assigned' && item.TaskStage === 'Finished');
        }
        this.spinner.stop('getallstages');
      } catch (error) {
        console.error('Error in API call:', error);
        this.spinner.stopAll();
      }
    }

    if (this.addSubTask === 'true') {
      this.addValuesWithSame();
      this.values[0].ownerList = this.ownerList;
    }
  }


  selectbranch(event) {
    this.selected = [];
    this.finalUser = null;
    this.finalholidaypolicy = '';

    if (event) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: event,
      };
      this.spinner.start('users');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.spinner.stop('users');
          }
        });
    } else {
      const filterData = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('userss');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.spinner.stop('userss');
          }
        });
    }
  }
  selectbranch1(event, i) {
    this.selected = [];
    // this.finalUser1 = null;
    this.finalholidaypolicy = '';

    if (event) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: event,
      };
      this.spinner.start('users');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList1 = res.data;
            this.values[i].ownerList = res.data;
            this.spinner.stop('users');
          }
        });
    } else {
      const filterData = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('userss');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList1 = res.data;
            this.values[i].ownerList = res.data;
            this.spinner.stop('userss');
          }
        });
    }
  }
  getLastIndex() {
    return this.values.length;
  }

  onSubmit() {
    if (!this.addtask.valid) {
      return;
    }
    if (!this.addtask.value.starttime) {
      this.addtask.value.starttime = '';
    }
    if (!this.addtask.value.day) {
      this.addtask.value.day = '';
    }
    const subTaskCount = this.values.filter((item) => item.taskDataType === 'subTask').length;
    if (this.addSubTask == 'true' && subTaskCount == 0) {
      return this.notifications.create(
        'Error',
        'Please Add atleast one Sub Task',
        NotificationType.Bare,
        {
          theClass: 'outline primary',
          timeOut: 3000,
        },
      );
    }
    const totalSubTaskWeightage = this.values
      .filter((item) => item.taskDataType === 'subTask')
      .reduce((total, item) => total + item.taskWeightage, 0);
    if (totalSubTaskWeightage != 100 && this.addSubTask == 'true') {
      return this.notifications.create(
        'Error',
        'Sub-Task WeightAge Total Value is Equal To 100',
        NotificationType.Bare,
        {
          theClass: 'outline primary',
          timeOut: 3000,
        },
      );
    }
    let zero = '0';
    let body = {
      userMasterID: this.addtask.value.userMasterID,
      TaskName: this.addtask.value.taskname,
      TaskDesc: this.addtask.value.description ? this.addtask.value.description : '',
      priority: this.addtask.value.priority,
      tasktype: zero,
      startDate: this.addtask.value.startdate,
      startTime: this.addtask.value.starttime ? this.addtask.value.starttime : '',
      endDate: this.addtask.value.enddate ? this.addtask.value.enddate : '',
      tasks_stagesID:
        this.addtask.value.taskStatus && this.addtask.value.taskStatus.length > 0
          ? this.addtask.value.taskStatus[0]
          : '',
      allTaskStage: this.addtask.value.taskStatus,
      taskStatus: zero,
      attachment: this.mainTaskAttachment ? this.mainTaskAttachment : '',
      taskDataType: 'mainTask',
      taskWeightage: subTaskCount > 0 ? totalSubTaskWeightage : 100,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      recurringtimeline: this.addtask.value.recurringtimeline
        ? this.addtask.value.recurringtimeline
        : '',
      companyMasterID: this.company_id,
      hasSubTask: subTaskCount > 0 ? 'YES' : 'NO',
    };
    this.values.push(body);

    const formData = new FormData();
    this.values.forEach((element, index) => {
      if ((this.samAsMainTask == 'true')) {
        formData.append(`TaskName${index}`, this.addtask.value.taskname);
        formData.append(`TaskDesc${index}`, element.TaskDesc);
        formData.append(`priority${index}`, this.addtask.value.priority);
        formData.append(`startDate${index}`, this.addtask.value.startdate);
        formData.append(
          `startTime${index}`,
          this.addtask.value.starttime ? this.addtask.value.starttime : '',
        );
        formData.append(
          `endDate${index}`,
          this.addtask.value.enddate ? this.addtask.value.enddate : '',
        );
        formData.append(`attachment`, this.mainTaskAttachment ? this.mainTaskAttachment : '');
      } else {
        formData.append(`TaskName${index}`, element.TaskName);
        formData.append(`TaskDesc${index}`, element.TaskDesc);
        formData.append(`priority${index}`, element.priority);
        formData.append(`startDate${index}`, element.startDate);
        formData.append(`startTime${index}`, element.startTime ? element.startTime : '');
        formData.append(`endDate${index}`, element.endDate);
        formData.append(`attachment`, element.attachment);
      }

      formData.append(`userMasterID${index}`, element.userMasterID);
      formData.append(
        `tasks_stagesID${index}`,
        element.allTaskStage && element.allTaskStage.length > 0 ? element.allTaskStage[0] : null,
      );
      formData.append(`allTaskStage${index}`, element.allTaskStage);
      formData.append(`taskStatus${index}`, zero);
      formData.append(`createBy${index}`, element.createBy);
      formData.append(`createByIp${index}`, element.createByIp);
      formData.append(`taskWeightage${index}`, element.taskWeightage);
      formData.append(`taskDataType${index}`, element.taskDataType);
      formData.append(
        `isattachment${index}`,
        element.attachment && element.attachment != '' && element.attachment != null ? 'yes' : 'no',
      );
      formData.append(`hasSubTask${index}`, element.hasSubTask);
      formData.append(`companyMasterID${index}`, element.companyMasterID);
    });

    this.spinner.start('add');
    this.api
      .callApi(this.constant.ADDTASK2, formData, 'POST', true, false, true)
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
  changeDay(value: any) {
    this.day;
  }

  changeDate(value: any) {
    this.date;
  }

  addStatus() { }

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
          this.alluser.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
        }
      });
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

  onFileChange(event: any, i) {
    // debugger;
    this.file = null;
    if (event.target.files && event.target.files.length > 0) this.file = event.target.files[0];
    else this.file = null;
    this.values[i].attachment = this.file;
    this.index++;
    this.file = null;
  }

  onFileChangeForMain(event: any, i) {
    // debugger;
    this.file = null;
    if (event.target.files && event.target.files.length > 0) this.file = event.target.files[0];
    else this.file = null;
    this.mainTaskAttachment = this.file;
    // this.values[i].attachment = this.file;
    this.index++;
  }
  onSelectFile(event: any, i: any) {
    this.values[i].attachment = null;

    if (event.target.files && event.target.files.length > 0)
      this.values[i].attachment = event.target.files[0];
    else this.values[i].attachment = null;
  }
  getUrl() {
    return 'url(' + this.imageUrl + ')';
  }

  onaddSubTaskChange(event) {
    this.addSubTask = event.target.value;
    if(this.addSubTask == 'true'){
      this.addValuesWithSame();
    }else{
      this.values = this.values.filter((item) => item.taskDataType !== 'subTask');
    }
  }

  onaddsamAsMainTaskChange(event) {
    this.values = [];
    this.samAsMainTask = event.target.value;
    this.addValuesWithSame();
  }

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  convertTo24HourFormat(time12h: string) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }

    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  addRow() {
    this.addValuesWithSame();
  }

  addValuesWithSame() {
    let zero1 = '0';
    if (this.samAsMainTask == 'true') {
      this.values.push({
        userMasterID: null,
        TaskName: this.taskNameModel || '',
        TaskDesc: this.descriptionModel || '',
        priority: this.priorityModel || '',
        tasktype: zero1,
        startDate: this.startdateModel || '',
        startTime: this.starttimeModel ? this.convertTo24HourFormat(this.starttimeModel) : '',
        endDate: this.enddateModel || '',
        allTaskStage: this.addtask.value.taskStatus1 || '',
        attachment: this.mainTaskAttachment ? this.mainTaskAttachment : null,
        taskDataType: 'subTask',
        taskWeightage: null,
        companyMasterID: this.company_id,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        hasSubTask: 'NO',
        finalbranch: null,
        ownerList: this.allusers,
      });
    } else {
      this.values.push({
        userMasterID: null,
        TaskName: '',
        TaskDesc: '',
        priority: '',
        tasktype: zero1,
        startDate: '',
        endDate: '',
        allTaskStage: '',
        attachment: null,
        taskStatus: zero1,
        descriptionModel1: '',
        taskDataType: 'subTask',
        companyMasterID: this.company_id,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        hasSubTask: 'NO',
        taskWeightage: null,
        finalbranch: null,
        ownerList: this.allusers,
      });
    }
  }
  removeRow(index: number) {
    this.values.splice(index, 1);
  }
}
