import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FoodAllowancePolicyMasterRoutingModule } from './food-allowance-policy-master-routing.module';
import { ListFoodAllowancePolicyComponent } from './list-food-allowance-policy/list-food-allowance-policy.component';
import { AddFoodAllowancePolicyComponent } from './add-food-allowance-policy/add-food-allowance-policy.component';
import { EditFoodAllowancePolicyComponent } from './edit-food-allowance-policy/edit-food-allowance-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ListFoodAllowancePolicyComponent, AddFoodAllowancePolicyComponent, EditFoodAllowancePolicyComponent],
  imports: [
    CommonModule,
    FoodAllowancePolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    NgxMaterialTimepickerModule,
    ComponentsStateButtonModule
  ]
})
export class FoodAllowancePolicyMasterModule { }
