import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayheadMasterRoutingModule } from './payhead-master-routing.module';
import { ListpayheadmasterComponent } from './listpayheadmaster/listpayheadmaster.component';
import { AddpayheadmasterComponent } from './addpayheadmaster/addpayheadmaster.component';
import { EditpayheadmasterComponent } from './editpayheadmaster/editpayheadmaster.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ListpayheadmasterComponent, AddpayheadmasterComponent, EditpayheadmasterComponent],
  imports: [
    CommonModule,
    PayheadMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
       NgSelectModule,
  ]
})
export class PayheadMasterModule { }
