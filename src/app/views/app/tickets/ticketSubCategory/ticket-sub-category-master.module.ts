import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketSubCategoryMasterRoutingModule } from './ticket-sub-category-master-routing.module';
import { ListTicketSubCategoryComponent } from './list-ticket-sub-category/list-ticket-sub-category.component';
import { AddTicketSubCategoryComponent } from './add-ticket-sub-category/add-ticket-sub-category.component';
import { EditTicketSubCategoryComponent } from './edit-ticket-sub-category/edit-ticket-sub-category.component';
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
  declarations: [ListTicketSubCategoryComponent, AddTicketSubCategoryComponent, EditTicketSubCategoryComponent],
  imports: [
    CommonModule,
    TicketSubCategoryMasterRoutingModule,
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
export class TicketSubCategoryMasterModule { }
