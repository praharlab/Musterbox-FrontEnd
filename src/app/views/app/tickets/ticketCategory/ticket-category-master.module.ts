import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketCategoryMasterRoutingModule } from './ticket-category-master-routing.module';
import { ListTicketCategoryComponent } from './list-ticket-category/list-ticket-category.component';
import { AddTicketCategoryComponent } from './add-ticket-category/add-ticket-category.component';
import { EditTicketCategoryComponent } from './edit-ticket-category/edit-ticket-category.component';
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
  declarations: [ListTicketCategoryComponent, AddTicketCategoryComponent, EditTicketCategoryComponent],
  imports: [
    CommonModule,
    TicketCategoryMasterRoutingModule,
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
export class TicketCategoryMasterModule { }
