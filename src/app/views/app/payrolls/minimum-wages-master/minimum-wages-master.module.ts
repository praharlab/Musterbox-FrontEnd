import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinimumWagesMasterRoutingModule } from './minimum-wages-master-routing.module';
import { AddMinimumWagesMasterComponent } from './add-minimum-wages-master/add-minimum-wages-master.component';
import { EditMinimumWagesMasterComponent } from './edit-minimum-wages-master/edit-minimum-wages-master.component';
import { ListMinimumWagesMasterComponent } from './list-minimum-wages-master/list-minimum-wages-master.component';

import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [AddMinimumWagesMasterComponent, EditMinimumWagesMasterComponent, ListMinimumWagesMasterComponent],
  imports: [
    CommonModule,
    MinimumWagesMasterRoutingModule,
     NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class MinimumWagesMasterModule { }
