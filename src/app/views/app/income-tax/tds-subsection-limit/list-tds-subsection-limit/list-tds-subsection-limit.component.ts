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
    selector: 'app-list-tds-subsection-limit',
    templateUrl: './list-tds-subsection-limit.component.html',
    styleUrls: ['./list-tds-subsection-limit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListTdsSubsectionLimitComponent implements OnInit {

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
    tdsSubSectionID: null,
    tdsSectionID: null,
    tdsSubSectionCategoryID: null,
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

  currentPage: number;
  formValue: any;

  selectedSectionID: any
  tdsSubSectionID: string;
  tdsSubSectionData: any = [];
  selectedSubSectionID: any;
  subsectionQuery: string = '';
  tdsSubSectionCategory: any;
  tdsSectionData: any;
  selectedSection: any;
  selectedCategory: any;

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
          '/app/superadminmenus/list_tds_sub_section_limit',
          '/app/superadminmenus/list_tds_sub_section_limit/edit_tds_sub_section_limit',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListTdsSubsectionLimitComponent', false);
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
    if (this.formValueStorageService.isEmptyObject('ListTdsSubsectionLimitComponent')) {
      this.body = {
        page: 1,
        limit: 10,
        searchQuery: '',
        tdsSubSectionID: '',
        tdsSectionID: '',
        tdsSubSectionCategoryID: '',
      };
    } else {
      this.body = this.formValue.ListTdsSubsectionLimitComponent.body;
      this.selectedSubSectionID = this.body.tdsSubSectionID;
      this.selectedSection = this.body.tdsSectionID;
      this.selectedCategory = this.body.tdsSubSectionCategoryID;

    }

    this.getTDSSubSection(false);
    this.getTdsSubSectionLimitData();
    this.getTDSSubSectioCategory();
    this.getTDSSection()
  }

  getTdsSubSectionLimitData() {
    this.spinner.start('start');
    let queryString = `?page=${this.body.page}&limit=${this.body.limit}`;

    if (this.body.searchQuery) {
      queryString += `&searchQuery=${this.body.searchQuery}`;
    }

    if (this.body.tdsSubSectionID) {
      queryString += `&tdsSubSectionID=${this.body.tdsSubSectionID}`;
    }

    if (this.body.tdsSectionID) {
      queryString += `&tdsSectionID=${this.body.tdsSectionID}`;
    }

    if (this.body.tdsSubSectionCategoryID) {
      queryString += `&tdsSubSectionCategoryID=${this.body.tdsSubSectionCategoryID}`;
    }

    this.query = queryString;
    this.api
      .callApi(this.constant.GETALLDATATDSSUBSECTIONLIMIT + this.query, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
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
      this.adminRoot + '/superadminmenus/list_tds_sub_section_limit/edit_tds_sub_section_limit/' + row.id,
    ]);
  }


  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ListTdsSubsectionLimitComponent', false);
      this.body.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    }

    if (inputValue.length >= 1) {
      this.body.searchQuery = inputValue;
      this.getTdsSubSectionLimitData();
    }
  }

  onSubmit() {
    if (!this.selectedSection && !this.selectedCategory) {
      return this.handleError('Please select at least one: TDS Section or TDS Sub-Section Category.');
    }
    this.body.tdsSubSectionID = this.selectedSubSectionID;
    this.body.tdsSectionID = this.selectedSection;
    this.body.tdsSubSectionCategoryID = this.selectedCategory;
    this.getTdsSubSectionLimitData();
  }

  getTDSSubSectioCategory() {
    this.spinner.start('category')
    this.api
      .callApi(this.constant.GETTDSSUBSECTIONCATEGORYLIST, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.tdsSubSectionCategory = res.data;
          }

          this.spinner.stop('category');
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('category');
        },
      );
  }

  getTDSSection() {
    this.spinner.start('section');
    this.api
      .callApi(this.constant.GETALLDATATDSSECTION, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.tdsSectionData = res.data;
          this.spinner.stop('section');
        }
      });
  }


  getTDSSubSection(flag: boolean) {

    this.tdsSubSectionData = [];
    if (flag) {
      this.selectedSubSectionID = null;
    }

    this.subsectionQuery = '';

    if (this.selectedSection || this.selectedCategory) {

      if (this.selectedSection) this.subsectionQuery += `?tdsSectionID=${this.selectedSection}`;
      if (this.selectedCategory) this.subsectionQuery += (this.selectedSection ? '&' : '?') + `tdsSubSectionCategoryID=${this.selectedCategory}`;

      this.spinner.start('b');
      this.api
        .callApi(this.constant.GETALLDATATDSSUBSECTION + this.subsectionQuery, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.tdsSubSectionData = res.data;

          }
          this.spinner.stop('b');
        }, (e) => {
          this.spinner.stop('b');
        });
    }

  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getTdsSubSectionLimitData();
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

        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETETDSSUBSECTIONLIMIT + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {

              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getTdsSubSectionLimitData()
                this.spinner.stop('delete');
              } else {
                this.handleError('Something Went Wrong!');
                this.spinner.stop('delete');
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('delete');
            },
          );
      }
    });
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getTdsSubSectionLimitData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/list_tds_sub_section_limit/add_tds_sub_section_limit']);
  }

  clear() {
    this.sectionfilter.resetForm();
    this.formValueStorageService.removeData('ListTdsSubsectionLimitComponent', false);
    this.body = {
      page: 1,
      limit: 10,
      searchQuery: '',
      tdsSubSectionID: '',
      tdsSectionID: '',
      tdsSubSectionCategoryID: '',
    };
    this.subsectionQuery = '';
    this.selectedSection = null;
    this.selectedCategory = null;
    this.tdsSubSectionData = [];

    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }


  Export() {
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETALLDATATDSSUBSECTIONLIMIT + this.query + `&Export=true`,
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
          saveAs(blob, 'TdsSubsectionLimit.xlsx');
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

  // demo() {
  //   window.open('/assets/Demo Subsection.xlsx', '_blank');
  // }

  // onSelectFile(event: any) {
  //   this.file = event.target.files && event.target.files[0];
  // }

  // submit() {
  //   if (this.file) {
  //     const formData = new FormData();

  //     formData.append('file', this.file);
  //     formData.append('createBy', localStorage.getItem('id'));
  //     formData.append('createByIp', this.ipAddress);

  //     this.spinner.start();
  //     this.api
  //       .callApi(this.constant.UPLOADSUBSECTIONEXCEL, formData, 'POST', true, true, true)
  //       .subscribe(
  //         (res: any) => {
  //           if (res.status == 200) {
  //             this.notifications.create('Done', res.message, NotificationType.Bare, {
  //               theClass: 'outline primary',
  //               timeOut: 3000,
  //               showProgressBar: true,
  //             });

  //             this.file = {};
  //             this.addimportuser.resetForm();
  //             this.closeModal.nativeElement.click();

  //             setTimeout(() => {
  //               this.modal.hide();
  //               this.ngOnInit();
  //               this.spinner.stop();
  //             }, 3000);
  //           } else {
  //             this.handleError(res.message);

  //             this.file = {};
  //             this.addimportuser.resetForm();
  //             this.closeModal.nativeElement.click();

  //             this.myInputVariable.nativeElement.value = '';
  //             this.spinner.stop();
  //           }
  //         },
  //         (err) => {
  //           this.handleError(err.error.message);
  //           this.file = {};
  //           this.addimportuser.resetForm();
  //           this.closeModal.nativeElement.click();

  //           this.myInputVariable.nativeElement.value = '';
  //           this.spinner.stop();
  //         },
  //       );
  //   }
  // }

  // modalClear() {
  //   this.file = {};
  //   this.addimportuser.resetForm();
  //   this.closeModal.nativeElement.click();
  //   this.myInputVariable.nativeElement.value = '';
  // }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListTdsSubsectionLimitComponent',
      this.body,
      '/superadminmenus/list_tds_sub_section_limit/edit_tds_sub_section_limit',
      rowData.id,
    );
  }

}
