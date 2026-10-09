import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyassetMasterRoutingModule } from './myasset-master-routing.module';
import { MyassetComponent } from './myasset.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [MyassetComponent],
  imports: [
    CommonModule,
    MyassetMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule
  ]
})
export class MyassetMasterModule { }
