import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-user-daily-task',
    templateUrl: './user-daily-task.component.html',
    styleUrls: ['./user-daily-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserDailyTaskComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  @ViewChild('addcomp2') addcomp2: NgForm;
  temp = [];
  itemsPerPage = 10;
  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected: any = [];
  selectAllState = '';
  itemOrder = 'Title';
  itemOptionsOrders = ['Title', 'Category', 'Status', 'Label'];
  displayOptionsCollapsed = false;
  todoItems: any;
  rows: any;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: localStorage.getItem('id'),
    todate: '',
    fromdate: '',
    searchQuery: '',

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
  ownerList1: any;
  asset: any;
  images: any;
  editbyid: any = [];
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  assetN: any;
  allcomp: any;
  editTaskDATA: any;
  product: any = [];
  company_id: any;
  usertype: any;
  tempcomp: any;
  asset1: any;
  assetN1: any;
  file: any;
  format: string;
  url: string | ArrayBuffer;
  tempIMG: any;
  today: any = new Date().toISOString().slice(0, 10);
  attachment: any = []
  oldAttachments: any = []
  EditOldAttachments: any = [];
  addFilesArray: any = [];
  editFilesArray: any = [];
  image: null;

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
    this.addFilesArray = [];
    this.editFilesArray = [];
    this.addFile('add');
    this.company_id = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.getItems();
    this.checkpermission();



  }

  addFile(type: string) {
    const obj = {
      file: null,
      deleted: false
    }

    if (type == 'add') this.addFilesArray.push(obj);
    if (type == 'edit') this.editFilesArray.push(obj);
  }

  removeFile(i, type: string) {
    if (type == 'add') this.addFilesArray[i].deleted = true;
    if (type == 'edit') this.editFilesArray[i].deleted = true;

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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DailyUserReporting' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DailyUserReporting' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DailyUserReporting' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DailyUserReporting' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getItems(): void {
    this.spinner.start('getitem');
    this.api
      .callApi(this.constant.GETALLDAILYTASK, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.spinner.stop('getitem');
          this.page.totalCount = res.totalcount;
        } else {
          this.spinner.stop('getitem');
        }
      });
  }


  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.ngOnInit();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.ngOnInit();
  }


  onFileChange(event: any, i, type: string) {

    this.image = null

    if (event.target.files && event.target.files.length > 0) {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ];
      const file = event.target.files[0];
      const fileMimeType = file.type;

      this.image = file

      if (!allowedMimeTypes.includes(fileMimeType)) {
        return this.handleError(`File '${file.name}' has invalid type. Only jpeg, jpg, png, doc, pdf, xlsx, and csv are allowed.`);
      }
    }

    if (type == 'add') this.addFilesArray[i].file = this.image;
    if (type == 'edit') this.editFilesArray[i].file = this.image;

    // this.image = null

    // if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0]
    // else this.image = null

    // this.addFilesArray[i].file = this.image


  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  edit(item) {
    this.spinner.start('edit');

    this.editFilesArray = []
    this.addFile('edit');

    this.api
      .callApi(this.constant.GETTASKBYID + item, [], 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editTaskDATA = res.data;
          this.attachment = []
          this.EditOldAttachments = this.editTaskDATA.attachments ?
            this.editTaskDATA.attachments : []



          this.spinner.stop('edit');
        }
      });
  }


  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    // remove Deleted Files

    const filteredFiles = this.addFilesArray.filter(e => !e.deleted && e.file);

    const formData = new FormData();
    formData.append('userMasterID', localStorage.getItem('id'));
    formData.append('taskDesc', this.addcomp.value.description);
    if (filteredFiles.length > 0) {
      for (let i = 0; i < filteredFiles.length; i++) {
        formData.append('attachment', filteredFiles[i].file);
      }
    }

    formData.append('oldAttachments', this.oldAttachments);

    this.spinner.start('submit');
    this.api.callApi(this.constant.ADDTASK_V2, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop('submit');
            window.location.reload();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('submit');
      },
    );
  }


  onSubmit1() {
    if (!this.addcomp1.valid) {
      return;
    }

    // remove Deleted Files

    const filteredFiles = this.editFilesArray.filter(e => !e.deleted && e.file);

    const formData = new FormData();
    formData.append('dailyTaskID', this.editTaskDATA.dailyTaskID);
    formData.append('userMasterID', localStorage.getItem('id'));
    formData.append('taskDesc', this.addcomp1.value.description);

    if (filteredFiles.length > 0) {
      for (let i = 0; i < filteredFiles.length; i++) {
        formData.append('attachment', filteredFiles[i].file);
      }
    }

    if (this.EditOldAttachments.length > 0) {
      formData.append('oldAttachments', this.EditOldAttachments);
    }

    this.spinner.start('submit1');
    this.api.callApi(this.constant.UPDATETASK_V2, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop('submit1');
            window.location.reload();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit1');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('submit1');
      },
    );
  }
  onSubmit2() {
    if (!this.addcomp2.valid) {
      return;
    }
    this.filterData.fromdate = this.addcomp2.value.startdate;
    this.filterData.todate = this.addcomp2.value.enddate;
    this.spinner.start('submit2');
    this.api
      .callApi(this.constant.GETALLDAILYTASK, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.spinner.stop('submit2');
          this.page.totalCount = res.totalcount;
        } else {
        }
      });
  }
  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          id: id,
        };
        this.spinner.start('delete');
        this.api.callApi(this.constant.DELETETASK, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.ngOnInit();
            this.spinner.stop('delete');
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop('delete');
          },
        );
      }
    });
  }



  view(attachment: any) {
    window.open(this.apiURL + 'uploads/dailyTask/' + attachment, '_blank');
  }

  changeRemoveItem(attachment: any) {


    this.EditOldAttachments = this.EditOldAttachments.filter(e => e != attachment);
  }




}
