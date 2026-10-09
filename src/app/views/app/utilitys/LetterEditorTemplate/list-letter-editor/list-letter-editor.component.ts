import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-letter-editor',
    templateUrl: './list-letter-editor.component.html',
    styleUrls: ['./list-letter-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListLetterEditorComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
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
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissioncreate = [1];
  permissiondelete: any;
  permissionedit: any;
  permissionview: any;
  subject: any;
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
          this.adminRoot + '/utilitys/List-Letter-Template',
          this.adminRoot + '/utilitys/Edit-Letter-Template',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListLetterEditorComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListLetterEditorComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: localStorage.getItem('company_id'),
      };
    } else {
      this.filterData = this.formValue.ListLetterEditorComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getAllLetterData();
    this.checkpermission();
    this.spinner.start();
  }

  getAllLetterData() {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.GETALLLETTERDATA, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
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
              permissionval.formName == 'LetterTemplate' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LetterTemplate' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LetterTemplate' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LetterTemplate' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }



  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
  }

  view(att: any) {
    window.open(this.apiURL + 'uploads/lettertemplate/' + att, '_blank');
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllLetterData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAllLetterData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/utilitys/Add-Letter-Template']);
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
          letterTemplateID: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETELETTERBYID, body, 'POST', true, true, true).subscribe(
          (res: any) => {
             this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getAllLetterData();
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
          letterTemplateID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api.callApi(this.constant.LETTERTEMPSTATUS, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.getAllLetterData();
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
  subjectdata(row) {
    this.subject = row.letter;

    var s = this.subject;
    var htmlObject = document.getElementById('subject');
    htmlObject.innerHTML = s;
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
          letterTemplateID: id,
          status: '1',
        };
        this.spinner.start();
        this.api.callApi(this.constant.LETTERTEMPSTATUS, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.ngOnInit();
            this.spinner.stop();
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop();
          },
        );
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
      'ListLetterEditorComponent',
      this.filterData,
      '/utilitys/Edit-Letter-Template',
      rowData.letterTemplateID,
    );
  }


}
