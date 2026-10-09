import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackingOutageCategoryRoutingModule } from './tracking-outage-category-routing.module';
import { ListTrackingOutageCategoryComponent } from './list-tracking-outage-category/list-tracking-outage-category.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AddTrackingOutageCategoryComponent } from './add-tracking-outage-category/add-tracking-outage-category.component';
import { FormsModule } from '@angular/forms';
import { EditTrackingOutageCategoryComponent } from './edit-tracking-outage-category/edit-tracking-outage-category.component';


@NgModule({
  declarations: [ListTrackingOutageCategoryComponent, AddTrackingOutageCategoryComponent, EditTrackingOutageCategoryComponent],
  imports: [
    CommonModule,
    TrackingOutageCategoryRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
  ]
})
export class TrackingOutageCategoryModule { }
