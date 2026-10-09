import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PenaltyUserwiseMasterRoutingModule } from './penalty-userwise-master-routing.module';
import { PenaltyUserwiseComponent } from './penalty-userwise.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [PenaltyUserwiseComponent],
  imports: [
    CommonModule,
    PenaltyUserwiseMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class PenaltyUserwiseMasterModule { }
