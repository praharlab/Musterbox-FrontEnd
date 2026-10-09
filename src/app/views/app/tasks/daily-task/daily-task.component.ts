import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-daily-task',
    templateUrl: './daily-task.component.html',
    styleUrls: ['./daily-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DailyTaskComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  @ViewChild('addcomp2') addcomp2: NgForm;
  temp = [];

  itemsPerPage = 10;
  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected: any;
  selectAllState = '';
  displayOptionsCollapsed = false;
  todoItems: any;
  fromdate: any;
  todate: any;
  rows: any = [];
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: [],
    todate: '',
    fromdate: '',
    exportData: ''
  };
  bb = {
    companyID: localStorage.getItem('company_id'),
    assetCategoryID: 0,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  apiURL = environment.apiUrl;
  alldata1: any;
  ipAddress: any;
  current_date = new Date().toISOString().slice(0, 10);
  allbranch: any = [];
  ownerList: any;
  images: any;
  editbyid: any = [];
  permissionview: any = [];
  allcomp: any;
  editTaskDATA: any;
  company_id: any;
  usertype: any;
  file: any;
  format: string;
  url: string | ArrayBuffer;
  tempIMG: any;
  today: any;
  finalholidaypolicy: string;
  finalbranch: any;
  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: ''
  }
  employee: any[];
  UserID: null;
  alldepartment: any[];
  selectedbranch: any;
  selecteddept: any;
  selecteddesig: any;
  allWorkingArea: any[];
  alldesignation: any[];
  allDivision: any[];
  selectedDivision: null;
  selectedWorkingArea: null;
  selectedEmployees: any = [];
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.today = new Date().toISOString().slice(0, 10);
    this.checkpermission();

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: ''
    }
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ViewDailyReporting' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  view(attachment: any) {
    window.open(this.apiURL + 'uploads/dailyTask/' + attachment, '_blank');
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getAllData();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getAllData();
  }

  getAllData() {
    this.spinner.start('getAll');
    this.filterData.exportData = ''
    this.api
      .callApi(this.constant.GETALLDAILYTASK_V2, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if(this.rows.length > 0){
            this.showButtons.push(CommonFilterButtonFields.Excel);
          }else{
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('getAll');
      });
  }


  onSubmit2() {
    if (!this.addcomp2.valid) {
      return;
    }

    this.filterData.fromdate = this.addcomp2.value.startdate;
    this.filterData.todate = this.addcomp2.value.enddate;
    this.filterData.userMasterID = this.addcomp2.value.user ? this.addcomp2.value.user : [];
    this.filterData.exportData = ''

    this.getAllData();

  }



  export() {
    this.filterData.exportData = 'true'

    this.spinner.start('a');
    this.api
      .callApi(this.constant.GETALLDAILYTASK_V2, this.filterData, 'POST', true, true, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `DailyTask.xlsx`);

            this.spinner.stop('a');
          }
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('a');
        },
      );
  }


  clear() {

    this.fromdate = '';
    this.todate = '';

    setTimeout(() => {
      this.ngOnInit();
    }, 0);

    this.rows = [];
    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: [],
      todate: '',
      fromdate: '',
      exportData: ''
    };
  }


  // onFileChange(event) {
  //   let filename = event.target.files[0].name;

  //   let ext = filename.substring(filename.lastIndexOf('.') + 1);
  //   if (ext.toLowerCase() == 'png' && ext.toLowerCase() == 'jpg' && ext.toLowerCase() == 'jpeg') {
  //     //this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
  //     this.notifications.create(
  //       'Error',
  //       'Selected file format is not supported',
  //       NotificationType.Bare,
  //       {
  //         theClass: 'outline primary',
  //         timeOut: 3000,
  //         showProgressBar: false,
  //       },
  //     );
  //   } else {
  //     this.file = event.target.files && event.target.files[0];
  //     if (this.file) {
  //       var reader = new FileReader();
  //       reader.readAsDataURL(this.file);
  //       if (this.file.type.indexOf('image') > -1) {
  //         this.format = 'image';
  //       } else if (this.file.type.indexOf('video') > -1) {
  //         this.format = 'video';
  //       }
  //       reader.onload = (event) => {
  //         this.url = (<FileReader>event.target).result;
  //       };
  //     }
  //   }
  // }

  // edit(item) {
  //   this.spinner.start();

  //   this.api
  //     .callApi(this.constant.GETTASKBYID + item, [], 'GET', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.editTaskDATA = res.data;

  //         this.spinner.stop();
  //       }
  //     });
  // }

  // onSubmit() {
  //   if (!this.addcomp.valid) {
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('userMasterID', localStorage.getItem('id'));
  //   formData.append('taskDate', new Date().toISOString().slice(0, 10));
  //   formData.append('taskDesc', this.addcomp.value.description);
  //   formData.append('attachment', this.file);
  //   formData.append('createBy', localStorage.getItem('id'));
  //   formData.append('createByIp', this.ipAddress);

  //   this.spinner.start();
  //   this.api.callApi(this.constant.ADDTASK, formData, 'POST', true, true, true).subscribe(
  //     (res: any) => {
  //       if (res.status == 200) {
  //         this.notifications.create('Done', res.message, NotificationType.Bare, {
  //           theClass: 'outline primary',
  //           timeOut: 3000,
  //           showProgressBar: true,
  //         });
  //         setTimeout(() => {
  //           this.spinner.stop();
  //           window.location.reload();
  //         }, 3000);
  //       } else {
  //         this.notifications.create('Error', res.message, NotificationType.Bare, {
  //           theClass: 'outline primary',
  //           timeOut: 3000,
  //           showProgressBar: false,
  //         });
  //         this.spinner.stop();
  //       }
  //     },
  //     (err) => {
  //       this.notifications.create('Error', err, NotificationType.Bare, {
  //         theClass: 'outline primary',
  //         timeOut: 3000,
  //         showProgressBar: false,
  //       });
  //       this.spinner.stop();
  //     },
  //   );
  // }




  // onSubmit1() {
  //   if (!this.addcomp1.valid) {
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('dailyTaskID', this.editTaskDATA.dailyTaskID);
  //   formData.append('userMasterID', localStorage.getItem('id'));
  //   formData.append('taskDate', new Date().toISOString().slice(0, 10));
  //   formData.append('taskDesc', this.addcomp1.value.description);
  //   formData.append('attachment', this.file);
  //   formData.append('updateBy', localStorage.getItem('id'));
  //   formData.append('updateByIp', this.ipAddress);

  //   this.spinner.start();
  //   this.api.callApi(this.constant.UPDATETASK, formData, 'POST', true, true, true).subscribe(
  //     (res: any) => {
  //       if (res.status == 200) {
  //         this.notifications.create('Done', res.message, NotificationType.Bare, {
  //           theClass: 'outline primary',
  //           timeOut: 3000,
  //           showProgressBar: true,
  //         });
  //         setTimeout(() => {
  //           this.spinner.stop();
  //           window.location.reload();
  //         }, 3000);
  //       } else {
  //         this.notifications.create('Error', res.message, NotificationType.Bare, {
  //           theClass: 'outline primary',
  //           timeOut: 3000,
  //           showProgressBar: false,
  //         });
  //         this.spinner.stop();
  //       }
  //     },
  //     (err) => {
  //       this.notifications.create('Error', err, NotificationType.Bare, {
  //         theClass: 'outline primary',
  //         timeOut: 3000,
  //         showProgressBar: false,
  //       });
  //       this.spinner.stop();
  //     },
  //   );
  // }

  onSubmit(val: any){
    this.filterData.fromdate = val.fromdate;
    this.filterData.todate = val.todate;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.exportData = ''
    this.getAllData();
  }

  clearData(){
    this.rows = []
  }

  init(val: any){
    this.filterData.userMasterID = val.map((x) => x.userMasterID)
    this.getAllData();
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

}
