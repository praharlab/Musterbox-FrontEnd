import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyIncentiveMasterRoutingModule } from './my-incentive-master-routing.module';
import { MyIncentiveComponent } from './my-incentive.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [MyIncentiveComponent],
  imports: [
    CommonModule,
    MyIncentiveMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class MyIncentiveMasterModule { }
