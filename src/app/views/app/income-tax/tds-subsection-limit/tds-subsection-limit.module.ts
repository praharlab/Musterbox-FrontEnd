import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdsSubsectionLimitRoutingModule } from './tds-subsection-limit-routing.module';

import { ListTdsSubsectionLimitComponent } from './list-tds-subsection-limit/list-tds-subsection-limit.component';
import { AddTdsSubsectionLimitComponent } from './add-tds-subsection-limit/add-tds-subsection-limit.component';
import { EditTdsSubsectionLimitComponent } from './edit-tds-subsection-limit/edit-tds-subsection-limit.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  declarations: [ListTdsSubsectionLimitComponent, AddTdsSubsectionLimitComponent, EditTdsSubsectionLimitComponent],
  imports: [
    CommonModule,
    TdsSubsectionLimitRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
  ]
})
export class TdsSubsectionLimitModule { }
