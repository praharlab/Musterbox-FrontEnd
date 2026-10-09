import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResignationProcessMasterRoutingModule } from './resignation-process-master-routing.module';
import { ListResignationProcessComponent } from './list-resignation-process/list-resignation-process.component';
import { AddResignationProcessComponent } from './add-resignation-process/add-resignation-process.component';
import { EditResignationProcessComponent } from './edit-resignation-process/edit-resignation-process.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ListResignationProcessComponent, AddResignationProcessComponent, EditResignationProcessComponent],
  imports: [
    CommonModule,
    ResignationProcessMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    NgSelectModule,
    TranslateModule,
    
  ]
})
export class ResignationProcessMasterModule { }
