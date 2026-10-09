import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormMasterRoutingModule } from './form-master-routing.module';
import { ListFormMasterComponent } from './list-form-master/list-form-master.component';
import { AddFormMasterComponent } from './add-form-master/add-form-master.component';
import { EditFormMasterComponent } from './edit-form-master/edit-form-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListFormMasterComponent, AddFormMasterComponent, EditFormMasterComponent],
  imports: [
    CommonModule,
    FormMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class FormMasterModule { }
