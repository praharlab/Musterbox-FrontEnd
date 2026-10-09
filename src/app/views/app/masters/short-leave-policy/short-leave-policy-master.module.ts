import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShortLeavePolicyMasterRoutingModule } from './short-leave-policy-master-routing.module';
import { ListShortLeavePolicyComponent } from './list-short-leave-policy/list-short-leave-policy.component';
import { AddShortLeavePolicyComponent } from './add-short-leave-policy/add-short-leave-policy.component';
import { EditShortLeavePolicyComponent } from './edit-short-leave-policy/edit-short-leave-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListShortLeavePolicyComponent, AddShortLeavePolicyComponent, EditShortLeavePolicyComponent],
  imports: [
    CommonModule,
    ShortLeavePolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class ShortLeavePolicyMasterModule { }
