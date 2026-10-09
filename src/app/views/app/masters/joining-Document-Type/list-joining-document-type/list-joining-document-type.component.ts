import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import {  NavigationStart, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
@Component({
    selector: 'app-list-joining-document-type',
    templateUrl: './list-joining-document-type.component.html',
    styleUrls: ['./list-joining-document-type.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListJoiningDocumentTypeComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;

  rows: any = [];
  apiURL = environment.apiUrl;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    status: null,
    searchQuery: '',
    exportData: false,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  comp: any;
  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/joiningDocumentType',
          this.adminRoot + '/masters/joiningDocumentType/edit_joiningDocumentType',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListJoiningDocumentTypeComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListJoiningDocumentTypeComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: +localStorage.getItem('company_id'),
        searchQuery: '',
        exportData: false,
        status: null
      };
    } else {
      this.filterData = this.formValue.ListJoiningDocumentTypeComponent.body;
    }
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.checkpermission();
    this.getcompany();
    this.getDocumentData();
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
              permissionval.formName == 'JoiningDocumentType' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JoiningDocumentType' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JoiningDocumentType' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JoiningDocumentType' && permissionval.operationName.includes('Create')
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
        this.getDocumentData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getDocumentData();
    }
  }


  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getDocumentData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getDocumentData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/joiningDocumentType/add_joiningDocument']);
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
          joiningDocumentMasterID: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEJOININGDOCUMENTTYPE, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getDocumentData();
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
          joiningDocumentMasterID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.STATUSCHANGEJOININGDOCUMENTTYPE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.getDocumentData();
                this.spinner.stop('deactive');
              } else {
                this.commonNotificationService.handleError(res.message);
                this.spinner.stop('deactive');
              }
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message);
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
          joiningDocumentMasterID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.STATUSCHANGEJOININGDOCUMENTTYPE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getDocumentData();
              this.spinner.stop('active');
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message);
              this.spinner.stop('active');
            },
          );
      }
    });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.companyName;
    this.filterData.status = this.datefilter.value.status ? this.datefilter.value.status : null;
    this.getDocumentData();
  }

  getDocumentData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETALLJOININGDOCUMENTTYPE, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.spinner.stop('data');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('data');
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


  downloadFilteredData() {
    this.spinner.start('start');
    this.filterData.exportData = true
    this.api
      .callApi(
        this.constant.GETALLJOININGDOCUMENTTYPE,
        this.filterData,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, 'Joining Document Master.xlsx', 'text/xlsx');
          this.spinner.stop('start');
          this,this.filterData.exportData = false
                  },
        (err) => {
          this.commonNotificationService.handleError(err);
          this.spinner.stop('start');
        },
      );
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListJoiningDocumentTypeComponent',
      this.filterData,
      '/masters/joiningDocumentType/edit_joiningDocumentType',
      rowData.joiningDocumentMasterID,
    );
  }

  clear() {
    this.datefilter.resetForm();
    this.formValueStorageService.removeData('ListJoiningDocumentTypeComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
}
