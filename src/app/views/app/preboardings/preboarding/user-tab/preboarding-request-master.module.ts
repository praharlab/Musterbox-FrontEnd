import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreboardingRequestMasterRoutingModule } from './preboarding-request-master-routing.module';
import { UserTabComponent } from './user-tab.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PreboardInfoModule } from '../preboard-info/preboard-info.module';


@NgModule({
  declarations: [UserTabComponent],
  imports: [
    CommonModule,
    PreboardingRequestMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    TabsModule,
    SimpleNotificationsModule.forRoot(),
    PreboardInfoModule
  ]
})
export class PreboardingRequestMasterModule { }
