import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaryPolicyMasterRoutingModule } from './salary-policy-master-routing.module';
import { ListSalarypolicyComponent } from './list-salarypolicy/list-salarypolicy.component';
import { AddSalarypolicyComponent } from './add-salarypolicy/add-salarypolicy.component';
import { EditSalarypolicyComponent } from './edit-salarypolicy/edit-salarypolicy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListSalarypolicyComponent, AddSalarypolicyComponent, EditSalarypolicyComponent],
  imports: [
    CommonModule,
    SalaryPolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class SalaryPolicyMasterModule { }
