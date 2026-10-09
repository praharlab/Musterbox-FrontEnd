import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkShiftMasterRoutingModule } from './bulk-shift-master-routing.module';
import { BulkAddShiftComponent } from './bulk-add-shift.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [BulkAddShiftComponent],
  imports: [
    CommonModule,
    BulkShiftMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    LayoutContainersModule,
    TranslateModule,
    PaginationModule,
    ModalModule,
    NgSelectModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class BulkShiftMasterModule { }
