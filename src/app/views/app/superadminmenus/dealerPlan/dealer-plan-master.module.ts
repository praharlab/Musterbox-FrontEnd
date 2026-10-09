import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealerPlanMasterRoutingModule } from './dealer-plan-master-routing.module';
import { ListDealerPlanComponent } from './list-dealer-plan/list-dealer-plan.component';
import { AddDealerPlanComponent } from './add-dealer-plan/add-dealer-plan.component';
import { EditDealerPlanComponent } from './edit-dealer-plan/edit-dealer-plan.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListDealerPlanComponent, AddDealerPlanComponent, EditDealerPlanComponent],
  imports: [
    CommonModule,
    DealerPlanMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class DealerPlanMasterModule { }
