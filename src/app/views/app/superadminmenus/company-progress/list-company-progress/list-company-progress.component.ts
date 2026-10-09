import { Component, ViewChild, OnInit, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';


import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
@Component({
    selector: 'app-list-company-progress',
    templateUrl: './list-company-progress.component.html',
    styleUrls: ['./list-company-progress.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class ListCompanyProgressComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  ColumnMode = ColumnMode;
  temp = [];

  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  filterData = {
    companyMasterID: '',
  };
  // page = {
  //   totalCount: 0,
  //   offset: 0,
  // };
  // dynamicItems = ['1', '2', '3', '4', '5'];
  limit = 10;
  currentPage: number;
  formValue: any;
  companyServiceStatus: any[] = []; // Initialize to an empty array
  companyProgress: any;
  companyporgressHistory: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          '/app/superadminmenus/company_progress',
          '/app/superadminmenus/edit_company_progress',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListCompanyProgressComponent', false);
        }
      }
    });

  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    this.filterData.companyMasterID = this.formValue.ListCompanyMasterComponent.id;

    if (this.formValueStorageService.isEmptyObject('ListCompanyProgressComponent')) {
      this.filterData = {
        companyMasterID: '',
      };
    } else {
      this.filterData = this.formValue.ListCompanyProgressComponent.body;
    }

    this.limit = 10;
    // this.page = {
    //   totalCount: 0,
    //   offset: 0,
    // };

    this.getCompanyServiceStatusData();
  
    this.getCompanyProgressHistroyData();
  }



  getCompanyServiceStatusData() {
    const body = {
      page: 1,
      limit: 10,
      searchQuery: '',
    };
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETCOMPANYSERVICESSTATUS, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.companyServiceStatus = res.data.map(status => ({
              ...status,
              items: status.items || [] // Ensure items is an array
            }));
            this.getCompanyProgressData();

            this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        }
      );
  }


  getCompanyProgressData() {
    this.filterData.companyMasterID = this.formValue.ListCompanyMasterComponent.id;    

    this.spinner.start('data');
    this.api.callApi(this.constant.GETCOMPANYPROGRESS, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            // Check if res.data is an object and not an array
            if (res.data && typeof res.data === 'object') {
              this.rows = [res.data]; // Wrap it in an array              
              
              // Ensure companyServiceStatus is defined
              if (this.companyServiceStatus.length > 0) {
                // Create a mapping of companyServiceStatus with an empty items array
                this.companyServiceStatus.forEach(status => {
                  status.items = []; // Initialize items for each status
                });

                // Populate items based on the fetched data
                this.rows.forEach(row => {
                  const status = this.companyServiceStatus.find(status => status.CompanyServiceStatusID === row.CompanyServiceStatusID);
                  if (status) {
                    const item = row.companyMaster.companyName;
                    status.items.push(item); // Add the company name to the corresponding status
                  }
                });
              } else {
                console.error('companyServiceStatus is not initialized or empty.');
              }
            }
            this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        }
      );
  }


  drop(event: CdkDragDrop<string[]>) {
    const currentContainer = event.container;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    let body = {
      companyMasterID: this.formValue.ListCompanyMasterComponent.id,
      CompanyServiceStatusID: currentContainer.id,
      // remarks: this.addPayment.value.remarks,
    }


  }


  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListCompanyProgressComponent',
      this.filterData,
      '/superadminmenus/edit_company_progress',
      rowData.companyProgressID,
    );
  }

  downloadFile() {

    let companyMasterID = this.formValue.ListCompanyMasterComponent.id;

    let string = `?companyMasterID=${companyMasterID}`;


    this.spinner.start('download');
    this.api
      .callApi(this.constant.COMPANYPROGRESSHISTORY + string + `&Exports=true`, {}, 'GET', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }


  private handleFileDownload(res: any) {

    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, `${this.rows[0].companyMaster.companyName}.xlsx`);

    this.spinner.stop('download');
  }


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }


  getCompanyProgressHistroyData() {

    let companyMasterID = this.formValue.ListCompanyMasterComponent.id;

    let string = `?companyMasterID=${companyMasterID}`;

    this.spinner.start('data');
    this.api
      .callApi(this.constant.COMPANYPROGRESSHISTORY + string, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.companyporgressHistory = res.data;
            this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        }
      );
  }



}