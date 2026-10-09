import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductMasterRoutingModule } from './product-master-routing.module';
import { ListProductMasterComponent } from './list-product-master/list-product-master.component';
import { AddProductMasterComponent } from './add-product-master/add-product-master.component';
import { EditProductMasterComponent } from './edit-product-master/edit-product-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListProductMasterComponent, AddProductMasterComponent, EditProductMasterComponent],
  imports: [
    CommonModule,
    ProductMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class ProductMasterModule { }
