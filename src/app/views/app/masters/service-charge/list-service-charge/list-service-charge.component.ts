import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-service-charge',
    templateUrl: './list-service-charge.component.html',
    styleUrls: ['./list-service-charge.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListServiceChargeComponent implements OnInit {

   @ViewChild('datefilter') datefilter: NgForm;
 
   @ViewChild(DatatableComponent) table: DatatableComponent;
   rows = [];
   apiURL = environment.apiUrl;
   columns = [
     { name: 'salaryPolicyID', prop: 'salaryPolicyID' },
     { name: 'salaryPolicyName', prop: 'salaryPolicyName' },
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
     companyMasterID: +localStorage.getItem('company_id'),
     contractorId:[],
     searchQuery: '',
   };
   page = {
     totalCount: 0,
     offset: 0,
   };
   rows1: any = [];
   permissioncreate: any = [];
   permissionedit: any = [];
   permissionview: any = [];
   permissiondelete: any = [];
   adminRoot = environment.adminRoot;
   events: string;
   comp: any;
 
   limit = 10;
   currentPage: number;
   formValue: any;
  allContractor: any;
  selectedContractor: any[] = [];
 
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
           this.adminRoot + '/masters/service_charge',
           this.adminRoot + '/masters/service_charge/edit_salary_policy',
         ];
 
         const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
         if (!isProtectedRoute) {
           formValueStorageService.removeData('ListServiceChargeComponent', false);
         }
       }
     });
   }
 
   ngOnInit() {
     this.formValue = this.formValueStorageService.getData();
     
     if (this.formValueStorageService.isEmptyObject('ListServiceChargeComponent')) {
 
       this.filterData = {
         page: 1,
         limit: 10,
         companyMasterID: +localStorage.getItem('company_id'),
         contractorId:[],
         searchQuery: '',
       };
     } else {
       this.filterData = this.formValue.ListServiceChargeComponent.body ? this.formValue.ListServiceChargeComponent.body  : {
         page: 1,
         limit: 10,
         companyMasterID: +localStorage.getItem('company_id'),
         contractorId:[],
         searchQuery: '',
       };
     }

     this.selectcompany(this.filterData.companyMasterID);

     this.selectedContractor = this.filterData.contractorId;
 
     this.limit = 10;
     this.page = {
       totalCount: 0,
       offset: 0,
     };
 
     this.getServiceCharge();
     this.checkpermission();
     this.getcompany();
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

   selectcompany(id:any){
    this.allContractor = [];
    this.selectedContractor = [];

    if(!id) return
    this.spinner.start('contractor');
    this.api
      .callApi(this.constant.GETALLDATA + `?companyMasterID=${id}`, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allContractor = res.data;
        this.spinner.stop('contractor');
      });
   }
 
   getServiceCharge() {
     this.spinner.start('main');
     this.api
       .callApi(this.constant.LISTSERVICECHRGES, this.filterData, 'POST', true, false, true)
       .subscribe(
         (res: any) => {
           if (res.status == 200) {
             this.rows = res.data;
             this.page.totalCount = res.totalcount;
             setTimeout(() => {
               this.currentPage = this.filterData.page;
               this.itemsPerPage = this.filterData.limit;
             }, 100);
             this.spinner.stop('main');
           } else {
             this.handleError(res.message);
             this.spinner.stop('main');
           }
         },
         (err) => {
           this.handleError(err.error.message);
           this.spinner.stop('main');
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
               permissionval.formName == 'ContractorServiceCharge' &&
               permissionval.operationName.includes('Delete')
             );
           });
           this.permissionedit = permission.filter((permissionval) => {
             return (
               permissionval.formName == 'ContractorServiceCharge' &&
               permissionval.operationName.includes('Edit')
             );
           });
           this.permissionview = permission.filter((permissionval) => {
             return (
               permissionval.formName == 'ContractorServiceCharge' &&
               permissionval.operationName.includes('View')
             );
           });
           this.permissioncreate = permission.filter((permissionval) => {
             return (
               permissionval.formName == 'ContractorServiceCharge' &&
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
         this.getServiceCharge();
       }, 100);
     } else {
       this.filterData.searchQuery = inputValue;
       this.getServiceCharge();
     }
   }
 
   onSubmit() {
     if (!this.datefilter.valid) {
       return;
     }
     this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
     this.filterData.contractorId = this.selectedContractor
     this.getServiceCharge();
   }
 
   onChange(e: any) {
     if (e) {
       this.filterData.page = e.offset + 1;
       this.getServiceCharge();
     } else {
       this.handleError('Something Went Wrong!');
     }
   }
 
   onLimitChange(ev: any) {
     if (ev) {
       this.filterData.limit = ev;
       this.limit = this.filterData.limit;
       this.getServiceCharge();
     } else {
       this.handleError('Something Went Wrong!');
     }
   }
 
   showAddNewModal() {
     this.router.navigate([this.adminRoot + '/masters/service_charge/add_service_charge']);
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
         this.spinner.start('confirm');
         this.api.callApi(this.constant.DELETESERVICECHRGES + id, {}, 'DELETE', true, true, true).subscribe(
           (res: any) => {
             if (res.status == 200) {
               this.notifications.create('Done', res.message, NotificationType.Bare, {
                 theClass: 'outline primary',
                 timeOut: 3000,
                 showProgressBar: true,
               });
               this.getServiceCharge();
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

   
   clear() {
     this.datefilter.resetForm();
     this.formValueStorageService.removeData('ListServiceChargeComponent', false);
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
 
   navigateToEditPage(rowData: any): void {
     this.formValueStorageService.navigate(
       'ListServiceChargeComponent',
       this.filterData,
       '/masters/service_charge/edit_service_charge',
       rowData.id,
     );
   }
 

}
