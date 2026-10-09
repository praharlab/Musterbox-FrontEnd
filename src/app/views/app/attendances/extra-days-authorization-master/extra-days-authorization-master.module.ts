import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtraDaysAUthorizationMasterRoutingModule } from './extra-days-authorization-master-routing.module';
import { ExtraDaysAUthorizationMasterComponent } from './extra-days-authorization-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ExtraDaysAcceptRejectModalComponent } from './extra-days-accept-reject-modal/extra-days-accept-reject-modal.component';


@NgModule({
  declarations: [ExtraDaysAUthorizationMasterComponent, ExtraDaysAcceptRejectModalComponent],
  imports: [
    CommonModule,
    ExtraDaysAUthorizationMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class ExtraDaysAUthorizationMasterModule { }
