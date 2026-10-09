import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LateEarlyPolicyMasterRoutingModule } from './late-early-policy-master-routing.module';
import { ListLateEarlyPolicyComponent } from './list-late-early-policy/list-late-early-policy.component';
import { AddLateEarlyPolicyComponent } from './add-late-early-policy/add-late-early-policy.component';
import { EditLateEarlyPolicyComponent } from './edit-late-early-policy/edit-late-early-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListLateEarlyPolicyComponent, AddLateEarlyPolicyComponent, EditLateEarlyPolicyComponent],
  imports: [
    CommonModule,
    LateEarlyPolicyMasterRoutingModule,
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
export class LateEarlyPolicyMasterModule { }
