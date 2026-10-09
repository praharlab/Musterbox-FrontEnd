import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealerMasterRoutingModule } from './dealer-master-routing.module';
import { ListDealerComponent } from './list-dealer/list-dealer.component';
import { AddDealerComponent } from './add-dealer/add-dealer.component';
import { EditDealerComponent } from './edit-dealer/edit-dealer.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListDealerComponent, AddDealerComponent, EditDealerComponent],
  imports: [
    CommonModule,
    DealerMasterRoutingModule,
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
export class DealerMasterModule { }
