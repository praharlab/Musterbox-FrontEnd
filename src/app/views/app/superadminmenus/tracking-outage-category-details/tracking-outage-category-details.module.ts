import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackingOutageCategoryDetailsRoutingModule } from './tracking-outage-category-details-routing.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ListTrackingOutageCategoryDetailsComponent } from './list-tracking-outage-category-details/list-tracking-outage-category-details.component';
import { AddTrackingOutageCategoryDetailsComponent } from './add-tracking-outage-category-details/add-tracking-outage-category-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditTrackingOutageCategoryDetailsComponent } from './edit-tracking-outage-category-details/edit-tracking-outage-category-details.component';


@NgModule({
  declarations: [ListTrackingOutageCategoryDetailsComponent, AddTrackingOutageCategoryDetailsComponent, EditTrackingOutageCategoryDetailsComponent],
  imports: [
    CommonModule,
    TrackingOutageCategoryDetailsRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    NgSelectModule
  ]
})
export class TrackingOutageCategoryDetailsModule { }
