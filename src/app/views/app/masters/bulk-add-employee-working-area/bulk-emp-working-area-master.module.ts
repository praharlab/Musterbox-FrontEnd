import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkEmpWorkingAreaMasterRoutingModule } from './bulk-emp-working-area-master-routing.module';
import { BulkAddEmployeeWorkingAreaComponent } from './bulk-add-employee-working-area.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [BulkAddEmployeeWorkingAreaComponent],
  imports: [
    CommonModule,
    BulkEmpWorkingAreaMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    LayoutContainersModule,
    TranslateModule,
    PaginationModule,
    FormsModule,
    NgSelectModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class BulkEmpWorkingAreaMasterModule { }
