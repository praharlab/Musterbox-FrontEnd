import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdaCategoryMasterRoutingModule } from './nda-category-master-routing.module';
import { ListNdaCategoryComponent } from './list-nda-category/list-nda-category.component';
import { AddNdaCategoryComponent } from './add-nda-category/add-nda-category.component';
import { EditNdaCategoryComponent } from './edit-nda-category/edit-nda-category.component';
import { ImportNdaCategoryComponent } from './import-nda-category/import-nda-category.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListNdaCategoryComponent, AddNdaCategoryComponent, EditNdaCategoryComponent, ImportNdaCategoryComponent],
  imports: [
    CommonModule,
    NdaCategoryMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class NdaCategoryMasterModule { }
