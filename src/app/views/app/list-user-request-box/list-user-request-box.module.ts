import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListUserRequestBoxRoutingModule } from './list-user-request-box-routing.module';
import { ListUserRequestBoxComponent } from './list-user-request-box.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ListUserRequestBoxComponent],
  imports: [
    CommonModule,
    ListUserRequestBoxRoutingModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    NgxUiLoaderModule, 
    TranslateModule,
    PaginationModule,
  ]
})
export class ListUserRequestBoxModule { }
