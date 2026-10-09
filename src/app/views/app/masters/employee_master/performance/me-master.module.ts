import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeMasterRoutingModule } from './me-master-routing.module';
import { PerformanceComponent } from './performance.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [PerformanceComponent],
  imports: [
    CommonModule,
    MeMasterRoutingModule,
    ModalModule,
    FormsModule,
    NgSelectModule,
    PagesContainersModule,
    LayoutContainersModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule,
    NgxDatatableModule,
    PaginationModule,
    NgxUiLoaderModule,
    TabsModule,
    TranslateModule
  ]
})
export class MeMasterModule { }
