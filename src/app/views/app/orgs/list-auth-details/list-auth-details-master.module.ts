import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListAuthDetailsMasterRoutingModule } from './list-auth-details-master-routing.module';
import { ListAuthDetailsComponent } from './list-auth-details.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListAuthDetailsComponent],
  imports: [
    CommonModule,
    ListAuthDetailsMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class ListAuthDetailsMasterModule { }
