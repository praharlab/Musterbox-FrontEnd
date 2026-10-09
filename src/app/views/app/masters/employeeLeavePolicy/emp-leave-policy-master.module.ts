import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpLeavePolicyMasterRoutingModule } from './emp-leave-policy-master-routing.module';
import { ListEmployeeLeavePolicyComponent } from './list-employee-leave-policy/list-employee-leave-policy.component';
import { AddEmployeeLeavePolicyComponent } from './add-employee-leave-policy/add-employee-leave-policy.component';
import { EditEmployeeLeavePolicyComponent } from './edit-employee-leave-policy/edit-employee-leave-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListEmployeeLeavePolicyComponent, AddEmployeeLeavePolicyComponent, EditEmployeeLeavePolicyComponent ],
  imports: [
    CommonModule,
    EmpLeavePolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    
  ]
})
export class EmpLeavePolicyMasterModule { }
