import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-tds-subsection',
    templateUrl: './list-tds-subsection.component.html',
    styleUrls: ['./list-tds-subsection.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListTdsSubsectionComponent implements OnInit {
  @ViewChild('sectionfilter') sectionfilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('lgModal') modal: any;

  @ViewChild('closeModal') closeModal: ElementRef;

  rows = [];
  apiURL = environment.apiUrl;
  myInputVariable: ElementRef;
  adminRoot = environment.adminRoot;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  Order = { label: 'Title', value: 'title' };
  changeOrderBy = [
    { label: 'title', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Created By', value: 'createdBy' },
  ];
  selectAllState = '';

  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    secttionId: '',
    sortByField: '',
    sortByValue: 'ASC',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [1];
  permissionedit: any = [1];
  permissionview: any = [1];
  permissiondelete: any = [1];
  limit = 10;
  company_id: any;
  ipAddress: any;
  comp: any;
  selectedValue: string;
  query: string;
  file: any;
  tdsSectionData: any = [];
  currentPage: number;
  formValue: any;

  selectedSectionID : any

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          '/app/superadminmenus/list_tds_sub_section',
          '/app/superadminmenus/list_tds_sub_section/edit_tds_sub_section',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListTdsSubsectionComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.limit = 10;

    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.company_id = localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListTdsSubsectionComponent')) {
      this.body = {
        page: 1,
        limit: 10,
        searchQuery: '',
        secttionId: '',
        sortByField: '',
        sortByValue: 'ASC',
      };
    } else {
      this.body = this.formValue.ListTdsSubsectionComponent.body;
      this.selectedSectionID = this.body.secttionId;

    }

    this.getTDSSectionData();
    this.getcompany();
    this.getTDSSection();
  }
  getTDSSectionData() {
    this.spinner.start('start');
    let queryString = `?page=${this.body.page}&limit=${this.body.limit}`;

    if (this.body.searchQuery) {
      queryString += `&searchQuery=${this.body.searchQuery}`;
    }

    if (this.body.secttionId) {
      queryString += `&tdsSectionID=${this.body.secttionId}`;
    }

    this.query = queryString;
    this.api
      .callApi(this.constant.GETALLDATATDSSUBSECTION + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body.page;
            this.itemsPerPage = this.body.limit;
          }, 100);
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }
  navigate(row) {
    this.router.navigate([
      this.adminRoot + '/superadminmenus/list_tds_sub_section/edit_tds_sub_section/' + row.tdsSubSectionID,
    ]);
  }

  onChangeOrderBy(event): void {
    this.body.sortByField = event.value;
    this.getTDSSectionData();
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ListTdsSubsectionComponent', false);
      this.body.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    }

    if (inputValue.length >= 1) {
      this.body.searchQuery = inputValue;
      this.getTDSSectionData();
    }
  }

  onSubmit() {
    if (!this.sectionfilter.valid) {
      return;
    }
    this.body.secttionId = this.sectionfilter.value.tdsSectionID;
    this.getTDSSectionData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  getTDSSection() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLDATATDSSECTION, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.tdsSectionData = res.data;
          this.spinner.stop();
        }
      });
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getTDSSectionData();
    } else {
      this.handleError('Something Went Wrong!');
    }
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
          status: 2,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.UPDATESTATUSTDSSUBSECTION + id, body, 'PUT', true, true, true)
          .subscribe(
            (res: any) => {

              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.ngOnInit();
                this.spinner.stop();
              } else {
                this.handleError('Something Went Wrong!');
                this.spinner.stop();
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop();
            },
          );
      }
    });
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getTDSSectionData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/list_tds_sub_section/add_tds_sub_section']);
  }

  clear() {
    this.sectionfilter.resetForm();
    this.formValueStorageService.removeData('ListTdsSubsectionComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
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
          this.handleError('Something Went Wrong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  onOptionSelect() {
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETALLDATATDSSUBSECTION + this.query + `&exportFileType=xlsx&exportData=true`,
        {},
        'GET',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'TdsSubsection.xlsx');
          this.spinner.stop('a');
        },
        (err) => {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('a');
        },
      );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  demo() {
    window.open('/assets/Demo Subsection.xlsx', '_blank');
  }

  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
  }

  submit() {
    if (this.file) {
      const formData = new FormData();

      formData.append('file', this.file);
      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);

      this.spinner.start();
      this.api
        .callApi(this.constant.UPLOADSUBSECTIONEXCEL, formData, 'POST', true, true, true)
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
              this.handleError(res.message);

              this.file = {};
              this.addimportuser.resetForm();
              this.closeModal.nativeElement.click();

              this.myInputVariable.nativeElement.value = '';
              this.spinner.stop();
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.file = {};
            this.addimportuser.resetForm();
            this.closeModal.nativeElement.click();

            this.myInputVariable.nativeElement.value = '';
            this.spinner.stop();
          },
        );
    }
  }

  modalClear() {
    this.file = {};
    this.addimportuser.resetForm();
    this.closeModal.nativeElement.click();
    this.myInputVariable.nativeElement.value = '';
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListTdsSubsectionComponent',
      this.body,
      '/superadminmenus/list_tds_sub_section/edit_tds_sub_section',
      rowData.tdsSubSectionID,
    );
  }
}
