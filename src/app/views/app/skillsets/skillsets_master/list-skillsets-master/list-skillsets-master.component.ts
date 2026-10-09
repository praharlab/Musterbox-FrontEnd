import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-skillsets-master',
    templateUrl: './list-skillsets-master.component.html',
    styleUrls: ['./list-skillsets-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListSkillsetsMasterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('lgModal') modal: any;
  @ViewChild('closeModal') closeModal: ElementRef;
  rows = [];

  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  scrollBarHorizontal = window.innerWidth < 1201;

  filterData = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: Number(localStorage.getItem('company_id')),
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
  usertype: any;
  company_id: any;
  comp: any;
  file: any;
  childcompany: string;
  ipAddress: any;
  company: any;
  allcomp: any;
  // startbody = { limit: 10, page: 1, company_id: '' };

  columns = [
    { name: 'SkillSet Name', prop: 'skillSet' },
    { name: 'Company Name', prop: 'companyMaster.companyName' },
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
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/skillsets/skillset',
          this.adminRoot + '/skillsets/skillset/edit_skillset',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListSkillsetsMasterComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListSkillsetsMasterComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
        companyMasterID: Number(localStorage.getItem('company_id')),
      };
    } else {
      this.filterData = this.formValue.ListSkillsetsMasterComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getallSkillSet();
    this.checkpermission();
    this.getcompany();
    this.getIPAddress();
  }

  // SkillSetsQuestions
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
              permissionval.formName == 'SkillSetsQuestions' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SkillSetsQuestions' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SkillSetsQuestions' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SkillSetsQuestions' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getallSkillSet() {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.GETALLSKILLSET, this.filterData, 'POST', true, false, true)
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

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getallSkillSet();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getallSkillSet();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.company;
    this.filterData.limit = this.limit;

    this.getallSkillSet();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getallSkillSet();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getallSkillSet();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/skillsets/skillset/add_skillset']);
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
          skillSetID: id,
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.SKILLSETDELETEBYID, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.getallSkillSet();
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
      text: 'Branch will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          skillSetID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.SKILLSETSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.getallSkillSet();
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
      text: 'Branch will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          skillSetID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.SKILLSETSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.getallSkillSet();
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

  formatDate(inputDate) {
    const dateObj = new Date(inputDate);
    dateObj.setUTCHours(dateObj.getUTCHours() + 5);
    dateObj.setUTCMinutes(dateObj.getUTCMinutes() + 30);

    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');

    return `${day}-${month}-${year}  ${hours}:${minutes}:${seconds}`;
  }

  ExportCSV() {
    let data = [];

    let mainbody = {
      page: '',
      limit: '',
      searchQuery: this.filterData.searchQuery,
      companyMasterID: this.filterData.companyMasterID,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLSKILLSET, mainbody, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.export = res.data;

          if (this.export.length == 0) {
            this.notifications.create('No data to Export', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          } else {
            for (var i = 0; i < this.export.length; i++) {
              const data1 = {
                SkillSetID: this.export[i].skillSetID,
                SkillSet: this.export[i].skillSet,
                CompanyName: this.export[i]['companyMaster.companyName'],
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
            saveAs(blob, 'Skillset.csv');
            this.spinner.stop();
          }
        }
      });
  }

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListSkillsetsMasterComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
  }

  modalSubmit() {
    if (this.file) {
      const formData = new FormData();

      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.company);
      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);

      this.spinner.start();
      this.api
        .callApi(this.constant.UPLOADEXCELSKILLSET, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });

              this.file = {};
              this.addimportuser.resetForm();
              this.closeModal.nativeElement.click();

              setTimeout(() => {
                this.modal.hide();
                this.ngOnInit();
                this.spinner.stop();
              }, 3000);
            } else {
              this.notifications.create('Error', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });

              this.file = {};
              this.addimportuser.resetForm();
              this.closeModal.nativeElement.click();

              this.spinner.stop();
            }
          },
          (err) => {
            this.notifications.create('Error', err, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });

            this.file = {};
            this.addimportuser.resetForm();
            this.closeModal.nativeElement.click();

            this.spinner.stop();
          },
        );
    }
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  demo() {
    window.open('/assets/Demo skillset.xlsx', '_blank');
  }

  selectcompany(ev: any) {
    this.company = ev;
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
      'ListSkillsetsMasterComponent',
      this.filterData,
      '/skillsets/skillset/edit_skillset',
      rowData.skillSetID,
    );
  }
}
