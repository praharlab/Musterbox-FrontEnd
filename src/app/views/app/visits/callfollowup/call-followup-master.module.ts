import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallFollowupMasterRoutingModule } from './call-followup-master-routing.module';
import { ListCallFollowupComponent } from './list-call-followup/list-call-followup.component';
import { AddCallFollowupComponent } from './add-call-followup/add-call-followup.component';
import { EditCallFollowupComponent } from './edit-call-followup/edit-call-followup.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListCallFollowupComponent, AddCallFollowupComponent, EditCallFollowupComponent],
  imports: [
    CommonModule,
    CallFollowupMasterRoutingModule,
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
export class CallFollowupMasterModule { }
