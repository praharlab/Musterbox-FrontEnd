import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionPlanMasterRoutingModule } from './subscription-plan-master-routing.module';
import { ListSubscriptionPlanComponent } from './list-subscription-plan/list-subscription-plan.component';
import { AddSubscriptionPlanComponent } from './add-subscription-plan/add-subscription-plan.component';
import { EditSubscriptionPlanComponent } from './edit-subscription-plan/edit-subscription-plan.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListSubscriptionPlanComponent, AddSubscriptionPlanComponent, EditSubscriptionPlanComponent],
  imports: [
    CommonModule,
    SubscriptionPlanMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    ModalModule,
    NgSelectModule,
    FormsModule,
    // RouterLink,
    SimpleNotificationsModule.forRoot()
  ]
})
export class SubscriptionPlanMasterModule { }
