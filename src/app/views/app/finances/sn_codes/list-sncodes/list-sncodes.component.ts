import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { labelUtils } from 'src/app/constants/labelUtils';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-sncodes',
    templateUrl: './list-sncodes.component.html',
    styleUrls: ['./list-sncodes.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListSncodesComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('importSNUser') importSNUser: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('lgModal') modal: any;

  @ViewChild('closeModal') closeModal: ElementRef;

  rows = [];
  adminRoot = environment.adminRoot;

  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  myInputVariable: ElementRef;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['DepartmentName', 'Company', 'Status'];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    searchQuery: '',
    startdate: '',
    enddate: '',
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
  file: any;
  childcompany: string;
  ipAddress: any;
  comp: any;

  currentPage: number;
  formValue: any;
  tankhwaPatraNameLabel: string = labelUtils.tankhwaPatraNameLabel;
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
          this.adminRoot + '/finances/sn_codes',
          this.adminRoot + '/finances/sn_codes/edit_sn_codes',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListSncodesComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = [+localStorage.getItem('company_id')];

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListSncodesComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        searchQuery: '',
        startdate: '',
        enddate: '',
      };
    } else {
      this.filterData = this.formValue.ListSncodesComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getIPAddress();
    this.getSN_CodesData();
    this.checkpermission();
    this.getcompany();
  }

  getSN_CodesData() {
    this.spinner.start('main11');

    this.api
      .callApi(this.constant.GETALLSNCODES, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop('main11');
          } else {
            this.spinner.stop('main11');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main11');
        },
      );
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
              permissionval.formName == 'SNCode' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SNCode' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SNCode' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SNCode' && permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event: any): void {
    if (event.target) {
      const val = event.target.value.toLowerCase().trim();
      this.filterData.searchQuery = val;
      this.events = val;
    } else {
      this.filterData.searchQuery = this.events;
    }
    this.getSN_CodesData();
  }

  onSubmit() {
    if (!this.datefilter.valid) return;

    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getSN_CodesData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getSN_CodesData();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.limit = this.filterData.limit;
    this.getSN_CodesData();
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/finances/sn_codes/add_sn_codes/']);
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
          status: 2,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.STATUSCHANGESNCODES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.getSN_CodesData();
                this.spinner.stop();
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
              this.notifications.create('Error', err.error.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            },
          );
      }
    });
  }

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListSncodesComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  changeshowfields() {
    this.ngOnInit();
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('comp11');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('comp11');
        } else {
          this.handleError(res.message);
          this.spinner.stop('comp11');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('comp11');
      },
    );
  }

  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  demo() {
    window.open('/assets/Demo SNCode.xlsx', '_blank');
  }

  downloadFile() {
    this.spinner.start('start');

    let mainbody: any = {
      companyMasterID: this.filterData.companyMasterID,
      searchQuery: this.filterData.searchQuery,
      exportData: true,
      exportFileType: 'xlsx',
    };

    this.api
      .callApi(this.constant.GETALLSNCODES, mainbody, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'SN Codes.xlsx');
    this.spinner.stop('start');
  }

  submit() {
    if (this.file) {
      const formData = new FormData();

      formData.append('file', this.file);
      formData.append('companyMasterID', this.importSNUser.value.company);
      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);

      this.spinner.start('submit');
      this.api.callApi(this.constant.UPLOADSNCODES, formData, 'POST', true, true, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            this.file = {};
            this.importSNUser.resetForm();
            this.closeModal.nativeElement.click();

            setTimeout(() => {
              this.modal.hide();
              this.ngOnInit();
              this.spinner.stop('submit');
            }, 3000);
          } else {
            this.notifications.create('Validation Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });

            this.file = {};
            this.importSNUser.resetForm();
            this.closeModal.nativeElement.click();

            setTimeout(() => {
              this.modal.hide();
              this.ngOnInit();
              this.spinner.stop('submit');
            }, 2000);
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.file = {};
          this.importSNUser.resetForm();
          this.closeModal.nativeElement.click();

          this.myInputVariable.nativeElement.value = '';
          this.spinner.stop('submit');
        },
      );
    }
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
      'ListSncodesComponent',
      this.filterData,
      '/finances/sn_codes/edit_sn_codes',
      rowData.sn_codeID,
    );
  }
}
