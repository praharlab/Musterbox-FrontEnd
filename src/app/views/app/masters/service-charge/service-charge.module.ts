import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceChargeRoutingModule } from './service-charge-routing.module';
import { AddServiceChargeComponent } from './add-service-charge/add-service-charge.component';
import { EditServiceChargeComponent } from './edit-service-charge/edit-service-charge.component';
import { ListServiceChargeComponent } from './list-service-charge/list-service-charge.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [AddServiceChargeComponent, EditServiceChargeComponent, ListServiceChargeComponent],
  imports: [
    CommonModule,
    ServiceChargeRoutingModule,
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
export class ServiceChargeModule { }
