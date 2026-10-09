import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncentiveTypeMasterRoutingModule } from './incentive-type-master-routing.module';
import { ListIncentivetypeComponent } from './list-incentivetype/list-incentivetype.component';
import { AddIncentivetypeComponent } from './add-incentivetype/add-incentivetype.component';
import { EditIncentivetypeComponent } from './edit-incentivetype/edit-incentivetype.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListIncentivetypeComponent, AddIncentivetypeComponent, EditIncentivetypeComponent],
  imports: [
    CommonModule,
    IncentiveTypeMasterRoutingModule,
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
export class IncentiveTypeMasterModule { }
