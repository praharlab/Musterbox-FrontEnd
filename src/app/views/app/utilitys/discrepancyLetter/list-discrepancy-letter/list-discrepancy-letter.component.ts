import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { NgForm } from '@angular/forms';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-discrepancy-letter',
    templateUrl: './list-discrepancy-letter.component.html',
    styleUrls: ['./list-discrepancy-letter.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListDiscrepancyLetterComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;

  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  columns = [
    { name: 'Letter Template ID', prop: 'letterTemplateID' },
    { name: 'Company Master ID', prop: 'companyMasterID' },
    { name: 'Letter type ID', prop: 'letterTypeID' },
    { name: 'Letter', prop: 'letter' },
    { name: 'Path', prop: 'path' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  companyData: any;
  company_id: any;
  company1: any;
  permissioncreate = [1];
  permissiondelete: any;
  permissionedit: any;
  permissionview: any = [];
  subject: any;
  limit: number = 10;
  currentPage: number;
  formValue: any;
  comp: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,

  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/utilitys/List-Discrepancy-Letter',
          this.adminRoot + '/utilitys/Edit-Discrepancy-Letter',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListDiscrepancyLetterComponent', false);
        }
      }
    });
  }


  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    this.company_id = +localStorage.getItem('company_id');
    if (this.formValueStorageService.isEmptyObject('ListDiscrepancyLetterComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: localStorage.getItem('company_id'),
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListDiscrepancyLetterComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.limit = 10;

    this.checkpermission();
    this.getcompany();
    this.discrepancyLetterData();
  }

  discrepancyLetterData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETDISCREPANCYLETTER, this.filterData, 'POST', true, false, true)
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
            this.spinner.stop('data');
          } else {
            this.spinner.stop('data');
            this.handleCatchError('something went wrong!');
          }
        },
        (err) => {
          this.spinner.stop('data');
          this.handleCatchError(err.error.message);
        },
      );
    // this.getcompany();
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.companyMasterID = this.datefilter.value.company;

    this.discrepancyLetterData();
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
              permissionval.formName == 'DiscrepancyLetter' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DiscrepancyLetter' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DiscrepancyLetter' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DiscrepancyLetter' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.discrepancyLetterData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.discrepancyLetterData();
    }
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.discrepancyLetterData();
    } else {
      this.handleCatchError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.discrepancyLetterData();
    } else {
      this.handleCatchError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/utilitys/Add-Discrepancy-Letter']);
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
          discrepancyLetterID: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEDISCREPANCYLETTER, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.discrepancyLetterData();
            this.spinner.stop('confirm');
          },
          (err) => {
            this.spinner.stop('confirm');
            this.handleCatchError(err.error.message);
          },
        );
      }
    });
  }

  handleCatchError(message: string) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }

  subjectdata(row) {
    this.subject = row.letterTemplate;

    var s = this.subject;
    var htmlObject = document.getElementById('subject');
    htmlObject.innerHTML = s;
  }


  navigateToEditPage(rowData: any): void {


    this.formValueStorageService.navigate(
      'ListDiscrepancyLetterComponent',
      this.filterData,
      '/utilitys/Edit-Discrepancy-Letter',
      rowData.discrepancyLetterID,
    );
  }


  clear() {
    this.datefilter.resetForm();
    this.formValueStorageService.removeData('ListDiscrepancyLetterComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}