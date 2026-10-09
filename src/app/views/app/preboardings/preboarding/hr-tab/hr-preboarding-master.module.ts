import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrPreboardingMasterRoutingModule } from './hr-preboarding-master-routing.module';
import { HrTabComponent } from './hr-tab.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { QuillModule } from 'ngx-quill';
import { PreboardInfoModule } from '../preboard-info/preboard-info.module';


@NgModule({
  declarations: [HrTabComponent],
  imports: [
    CommonModule,
    HrPreboardingMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    TabsModule,
    SimpleNotificationsModule.forRoot(),
    QuillModule.forRoot(),
    PreboardInfoModule
  ]
})
export class HrPreboardingMasterModule { }
