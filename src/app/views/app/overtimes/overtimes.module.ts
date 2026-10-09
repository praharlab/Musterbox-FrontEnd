import { NgModule } from '@angular/core';

import { OvertimesRoutingModule } from './overtimes.routing';
import { OvertimesComponent } from './overtimes.component';
import { OvertimeMasterComponent } from './overtime-master/overtime-master.component';

import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { CompanyOvertimeDataComponent } from './company-overtime-data/company-overtime-data.component';

@NgModule({
  declarations: [
    OvertimesComponent,
    OvertimeMasterComponent,
    CompanyOvertimeDataComponent,
  ],

  providers: [DatePipe],
  imports: [
    CommonModule,
    AngularDualListBoxModule,
    NgMultiSelectDropDownModule.forRoot(),
    OvertimesRoutingModule,
    ModalModule,
    FormsModule,
    SharedModule,
    LayoutContainersModule,
    NgxDatatableModule,
    PagesContainersModule,
    CollapseModule,
    PaginationModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    NgxUiLoaderModule,
    ComponentsStateButtonModule,
  ],
})
export class OvertimesModule { }
