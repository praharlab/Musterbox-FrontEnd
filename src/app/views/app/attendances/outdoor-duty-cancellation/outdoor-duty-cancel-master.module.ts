import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutdoorDutyCancelMasterRoutingModule } from './outdoor-duty-cancel-master-routing.module';
import { OutdoorDutyCancellationComponent } from './outdoor-duty-cancellation.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [OutdoorDutyCancellationComponent],
  imports: [
    CommonModule,
    OutdoorDutyCancelMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class OutdoorDutyCancelMasterModule { }
