import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-skillsetform',
    templateUrl: './list-skillsetform.component.html',
    styleUrls: ['./list-skillsetform.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListSkillsetformComponent implements OnInit {
  @ViewChild('filterform') filterform: NgForm;
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: any = [];
  myInputVariable: ElementRef;
  file: any;
  apiURL = environment.apiUrl;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  adminRoot = environment.adminRoot;
  filterData = {
    companyMasterID: Number(localStorage.getItem('company_id')),
    designationID: null,
    page: 1,
    limit: 10,
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  alldepartment: any = [];
  alldesignation: any;
  excel: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  events: any;
  excelevents: any;
  comp: any;
  format: string;
  url: string | ArrayBuffer;
  childcompany: string;
  rows2: any = [];

  imgshow1: boolean;
  checkdata: any;
  columns = [
    { name: 'Company Name', prop: 'companyMaster.companyName' },
    { name: 'Designation Name', prop: ['designation.designationName'] },
    { name: 'Create By', prop: 'createBy' },
    { name: 'Created Date', prop: 'createdAt' },
    { name: 'Status', prop: 'status' },
    { name: 'Action' },
    { name: 'Update By', prop: 'updateBy' },
    { name: 'Updated Date', prop: 'updatedAt' },
  ];

  currentPage: number;
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
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/skillsets/skillsetform',
          this.adminRoot + '/skillsets/skillsetform/edit_skillsetform',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListSkillsetformComponent', false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListSkillsetformComponent')) {
      this.filterData = {
        companyMasterID: Number(localStorage.getItem('company_id')),
        designationID: '',
        page: 1,
        limit: 10,
      };
    } else {
      this.filterData = this.formValue.ListSkillsetformComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.alldata();
    this.getcompany();
    this.checkpermission();
    this.getIPAddress();
    this.SelectedCompany(this.filterData.companyMasterID)
  }

  SelectedCompany(id) {
    if (!id) return;

    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  alldata() {
    this.spinner.start('alldata');
    this.api
      .callApi(
        this.constant.GETSKILLSETSFORMBYCOMPANYID,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('alldata');
          } else {
            this.handleError(res.message);
            this.spinner.stop('alldata');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('alldata');
        },
      );
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.alldata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.alldata();
    } else {
      this.handleError('Something Went Wrong!');
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SkillSetsForm' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SkillSetsForm' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SkillSetsForm' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SkillSetsForm' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
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
          skillsetsFormID: id,
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.SKILLSETSFORMDELETEBYID, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.alldata();
                this.spinner.stop('confirm');
              } else {
                this.handleError(res.message);
                this.spinner.stop('confirm');
              }
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
          skillsetsFormID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.GETSKILLSETSFORMSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.alldata();
                this.spinner.stop('deactive');
              } else {
                this.handleError(res.message);
                this.spinner.stop('deactive');
              }
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
          skillsetsFormID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.GETSKILLSETSFORMSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.alldata();
                this.spinner.stop('active');
              } else {
                this.handleError(res.message);
                this.spinner.stop();
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('active');
            },
          );
      }
    });
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/skillsets/skillsetform/add_skillsetform']);
  }

  onSubmit() {
    if (!this.filterform.valid) {
      return;
    }

    this.filterData.companyMasterID = this.filterform.value.company;

    if (this.filterform.value.designation) {
      this.filterData.designationID = this.filterform.value.designation;
    }

    this.alldata();
  }

  clear() {
    this.filterform.resetForm();

    this.formValueStorageService.removeData('ListSkillsetformComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  downloadFile() {
    this.filterData.companyMasterID = this.filterform.value.company;

    if (this.filterform.value.designation) {
      this.filterData.designationID = this.filterform.value.designation;
    }

    let data = [];
    this.spinner.start();
    this.api
      .callApi(this.constant.GETSKILLSETSFORMBYCOMPANYID, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.excel = res.data;

          if (this.excel.length == 0) {
            this.notifications.create('No data to Export', '', NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          } else {
            for (var i = 0; i < this.excel.length; i++) {
              let map = [];

              let data2 = this.excel[i].skillSetsID;
              map = data2.map((item, index) => {
                return item.skillSet;
              });

              const data1 = {
                SkillsetsFormID: this.excel[i].skillsetsFormID,
                SkillSets: map ? map.join(', ') : '',
                CompanyName: this.excel[i].companyMaster.companyName,
                DesignationName: this.excel[i].designation.designationName,
                Status: this.excel[i].status,
                CreateBy: this.excel[i].createBy,
                CreateByIp: this.excel[i].createByIp,
                CreatedAt: this.excel[i].createdAt,
                updateBy: this.excel[i].updateBy,
                UpdateByIp: this.excel[i].updateByIp,
                UpdatedAt: this.excel[i].updatedAt,
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
            saveAs(blob, 'Skillsets Form.csv');
          }
        }
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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
      'ListSkillsetformComponent',
      this.filterData,
      '/skillsets/skillsetform/edit_skillsetform',
      rowData.skillsetsFormID,
    );
  }
}
