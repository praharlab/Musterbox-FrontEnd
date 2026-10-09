import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitMasterRoutingModule } from './visit-master-routing.module';
import { ListVisitComponent } from './list-visit/list-visit.component';
import { AddVisitComponent } from './add-visit/add-visit.component';
import { EditVisitComponent } from './edit-visit/edit-visit.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [ListVisitComponent, AddVisitComponent, EditVisitComponent],
  imports: [
    CommonModule,
    VisitMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    NgxMaterialTimepickerModule
  ]
})
export class VisitMasterModule { }
