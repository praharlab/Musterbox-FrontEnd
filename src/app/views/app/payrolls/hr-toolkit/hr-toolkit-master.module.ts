import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrToolkitMasterRoutingModule } from './hr-toolkit-master-routing.module';
import { HrToolkitComponent } from './hr-toolkit.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [HrToolkitComponent],
  imports: [
    CommonModule,
    HrToolkitMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    ModalModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class HrToolkitMasterModule { }
