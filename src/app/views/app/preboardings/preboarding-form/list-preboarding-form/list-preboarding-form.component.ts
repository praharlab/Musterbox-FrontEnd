import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ViewPreboardingCommonComponent } from '../../preboarding/view-preboarding-common/view-preboarding-common.component';

@Component({
    selector: 'app-list-preboarding-form',
    templateUrl: './list-preboarding-form.component.html',
    styleUrls: ['./list-preboarding-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListPreboardingFormComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('lgModal') modal: any;

  @ViewChild(ViewPreboardingCommonComponent) viewPreboardingCommonComponent: ViewPreboardingCommonComponent;

  @ViewChild('closeModal') closeModal: ElementRef;

  rows = [];
  adminRoot = environment.adminRoot;
  employeeType1: string = 'national';
  selectedNationality: string = 'Indian'

  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  myInputVariable: ElementRef;
  temp: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['DepartmentName', 'Company', 'Status'];
  SelectionType = SelectionType;
  tabledata = [
    'DepartmentID',
    'DepartmentName',
    'Company',
    'Status',
    'CreateBy',
    'CreateByIp',
    'CreatedAt',
    'updateBy',
    'UpdateByIp',
    'UpdatedAt',
  ];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    searchQuery: '',
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
  comp: any;
  field: any;
  fields1: any = [];
  alldesignation: any;
  company1: any;
  temp1: any;
  currentPage: number;
  formValue: any;
  numberTypeLabel: string = 'number'
  imageTypeLabel: string = 'image'
  pdfTypeLabel: string = 'pdf'
  textTypeLabel: string = 'text'
  radioTypeLabel: string = 'radio'
  dropDownLabel: string = 'dropdown'
  signatureLabel: string = 'signature'
  textareaLabel: string = 'textarea'
  dateTypeLabel: string = 'date'
  monthTypeLabel: string = 'month'
  titleTypeLabel: string = 'title'

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/preboardings/preboarding_form',
          this.adminRoot + '/preboardings/preboarding_form/edit_preboarding_form',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListPreboardingFormComponent', false);
        }

        // clone add
        const protectedRoutesClone = [
          this.adminRoot + '/preboardings/preboarding_form',
          this.adminRoot + '/preboardings/preboarding_form/add_preboarding_form',
        ];

        const isProtectedRouteClone = protectedRoutesClone.some((route) =>
          event.url.includes(route),
        );
        if (!isProtectedRouteClone) {
          formValueStorageService.removeData('preboardingform_cloneData', true);
        }
      }
    });
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = [+localStorage.getItem('company_id')];

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListPreboardingFormComponent')) {

    } else {
      this.filterData = this.formValue.ListPreboardingFormComponent.body;
    }

    if (this.formValueStorageService.isEmptyObject('ListPreboardingFormComponent') && this.formValueStorageService.isEmptyObject('preboardingform_cloneData')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue?.ListPreboardingFormComponent ?this.formValue.ListPreboardingFormComponent.body : this.formValue.preboardingform_cloneData.body;
    }
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.checkpermission();
    this.getcompany();
    this.getPreboardingData();

  }

  getinputType(type, i) {
    if (type == this.numberTypeLabel) {
      return this.numberTypeLabel
    } else if (type == this.imageTypeLabel || type == this.pdfTypeLabel) {
      return 'file'
    } else if (this.textTypeLabel) {
      return this.textTypeLabel
    } else if (type == this.radioTypeLabel) {
      return this.radioTypeLabel
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
              permissionval.formName == 'PreBoardingCustomize' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PreBoardingCustomize' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PreBoardingCustomize' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PreBoardingCustomize' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
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
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  getPreboardingData() {
    this.spinner.start('main');

    this.api
      .callApi(this.constant.GETPREBOARDINGMASTER, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop('main');
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('main');
        }
      },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('main');
        },
      );
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getPreboardingData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getPreboardingData();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getPreboardingData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getPreboardingData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.formValueStorageService.removeData('ListPreboardingFormComponent', true);
    this.formValueStorageService.removeData('preboardingform_cloneData', true);

    this.router.navigate([this.adminRoot + '/preboardings/preboarding_form/add_preboarding_form/']);
  }
  onSubmit() {
    if (!this.datefilter.valid) return;

    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getPreboardingData();
  }
  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListPreboardingFormComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
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
          preboardingMasterID: id,
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEPREBOARDINGMASTER, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.commonNotificationService.handleSuccess(res.message)

                this.getPreboardingData();
                this.spinner.stop('confirm');
              } else {
                this.commonNotificationService.handleError(res.message);
                this.spinner.stop('confirm');
              }
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message);
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListPreboardingFormComponent',
      this.filterData,
      '/preboardings/preboarding_form/edit_preboarding_form',
      rowData.preboardingMasterID,
    );
  }

  navigateToClonePage(rowData: any) {
    this.formValueStorageService.navigate(
      'preboardingform_cloneData',
      this.filterData,
      '/preboardings/preboarding_form/add_preboarding_form',
      rowData.preboardingMasterID,
    );
  }

  openViewModal(id: any): void {
    this.viewPreboardingCommonComponent?.getcustomizefield(id).then(() => {
      this.viewPreboardingCommonComponent.openModal();
    }).catch(() => {
      this.commonNotificationService.handleError('Something went wrong!')
    });
  }

}
