import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OvertimeMasterRoutingModule } from './overtime-master-routing.module';
import { OvertimeComponent } from './overtime.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [OvertimeComponent],
  imports: [
    CommonModule,
    OvertimeMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule
  ]
})
export class OvertimeMasterModule { }
