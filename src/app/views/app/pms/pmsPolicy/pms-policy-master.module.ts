import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmsPolicyMasterRoutingModule } from './pms-policy-master-routing.module';
import { ListPmsPolicyComponent } from './list-pms-policy/list-pms-policy.component';
import { AddPmsPolicyComponent } from './add-pms-policy/add-pms-policy.component';
import { EditPmsPolicyComponent } from './edit-pms-policy/edit-pms-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ListPmsPolicyComponent, AddPmsPolicyComponent, EditPmsPolicyComponent],
  imports: [
    CommonModule,
    PmsPolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class PmsPolicyMasterModule { }
