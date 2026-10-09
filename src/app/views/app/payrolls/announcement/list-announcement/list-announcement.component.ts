import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-list-announcement',
    templateUrl: './list-announcement.component.html',
    styleUrls: ['./list-announcement.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAnnouncementComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [
    'Announcement',
    'AnnouncementDate',
    'Attachment',
    'Company',
    'Status',
  ];
  SelectionType = SelectionType;
  tabledata = [
    'Announcement',
    'AnnouncementDate',
    'Company',
    'Attachment',
    'Status',
    'CreateBy',
    'CreatedAt',
    'updateBy',
    'UpdatedAt',
  ];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    searchQuery: '',
    companyMasterID: localStorage.getItem('company_id'),
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  events: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,

  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/payrolls/announcement',
          this.adminRoot + '/payrolls/announcement/edit_announcement',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListAnnouncementComponent', false);
        }
      }
    });
  }

  ngOnInit() {

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListAnnouncementComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        startdate: '',
        enddate: '',
        searchQuery: '',
        companyMasterID: localStorage.getItem('company_id'),
      };
    } else {
      this.filterData = this.formValue.ListAnnouncementComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };


    this.getAnnouncemntData();
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Announcement' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Announcement' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Announcement' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Announcement' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }
  getAnnouncemntData() {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.GETANNOUNCEMENTBYCOMPID, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          for (let i = 0; i < this.rows.length; i++) {
            const yyyymmdd = this.rows[i].announcementDate.slice(0, 10);
            this.rows[i].announcementDate = `${yyyymmdd.slice(8, 10)}-${yyyymmdd.slice(
              5,
              7,
            )}-${yyyymmdd.slice(0, 4)}`;
          }
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop('oninit2');
        } else {
          this.handleError(res.message);
          this.spinner.stop('oninit2');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('oninit2');
      },
    );
  }

  view(att: any) {
    window.open(this.apiURL + 'uploads/announcement/' + att, '_blank');
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getAnnouncemntData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAnnouncemntData();
    }
  }

  onSubmit() {
    if(!this.datefilter.valid) return;

    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;
    
    this.getAnnouncemntData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAnnouncemntData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAnnouncemntData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/payrolls/announcement/add_announcement']);
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
          announcementID: id,
        };

        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEANNOUNCEMENT, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getAnnouncemntData();
              this.spinner.stop('confirm');
            },
            (err) => {
              this.handleError(err.error.message);
            this.spinner.stop('confirm');
            },
          );
      }
    });
  }

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          announcementID: id,
          status: '0',
        };
         this.spinner.start('deactive');
        this.api
          .callApi(this.constant.ANNOUNCEMENTSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getAnnouncemntData();
              this.spinner.stop('deactive');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('deactive');
            },
          );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          announcementID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.ANNOUNCEMENTSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getAnnouncemntData();
              this.spinner.stop('active');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('active');
            },
          );
      }
    });
  }

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListAnnouncementComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  changeshowfields() {
    this.ngOnInit();
  }
  downloadFile() {
    let data = [];
    this.export = [];
      let mainbody = {
        page: '',
        limit: '',
        startdate: this.filterData.startdate,
        enddate: this.filterData.enddate,
        companyMasterID: this.filterData.companyMasterID,
      };
      this.api
        .callApi(this.constant.GETANNOUNCEMENTBYCOMPID, mainbody, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.export = res.data;
            for (var i = 0; i < this.export.length; i++) {
              const data1 = {
                AnnouncementID: this.export[i].announcementID,
                Announcement: this.export[i].announcement,
                AnnouncementDate: this.export[i].announcementDate,
                Company: this.export[i].companyMaster.companyName,
                Status: this.export[i].status,
                CreateBy: this.export[i].createBy,
                CreateByIp: this.export[i].createByIp,
                CreatedAt: this.export[i].createdAt,
                updateBy: this.export[i].updateBy,
                UpdateByIp: this.export[i].updateByIp,
                UpdatedAt: this.export[i].updatedAt,
              };
              if (data1.Status == 1) {
                data1.Status = 'Active';
              } else {
                data1.Status = 'Deactive';
              }
              data.push(data1);
            }

            const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
            const header = Object.keys(data[0]);
            let csv = data.map((row) =>
              header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
            );
            csv.unshift(header.join(','));
            let csvArray = csv.join('\r\n');

            var blob = new Blob([csvArray], { type: 'text/csv' });
            saveAs(blob, 'Announcement.csv');
          }
        });
    
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListAnnouncementComponent',
      this.filterData,
      '/payrolls/announcement/edit_announcement',
      rowData.announcementID,
    );
  }

}
