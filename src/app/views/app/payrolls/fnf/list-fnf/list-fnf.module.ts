import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListFnfRoutingModule } from './list-fnf-routing.module';
import { ListFnfComponent } from './list-fnf.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ViewFnfComponent } from '../view-fnf/view-fnf.component';
import { FnfResignationModule } from '../fnf-resignation/fnf-resignation.module';
import { FnfAssetsModule } from '../fnf-assets/fnf-assets.module';
import { FnfAdvanceModule } from '../fnf-advance/fnf-advance.module';
import { FnfLoanModule } from '../fnf-loan/fnf-loan.module';
import { FnfPenaltyModule } from '../fnf-penalty/fnf-penalty.module';
import { FnfSalaryCalculationModule } from '../fnf-salary-calculation/fnf-salary-calculation.module';
import { FnfUserDetailsModule } from '../fnf-user-details/fnf-user-details.module';
import { FnfGenerateExperienceLetterModule } from '../fnf-generate-experience-letter/fnf-generate-experience-letter.module';
import { FnfLeaveModule } from '../fnf-leave/fnf-leave.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CommonFilterModule } from '../../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListFnfComponent, ViewFnfComponent],
  imports: [
    CommonModule,
    ListFnfRoutingModule,
    CommonFilterModule,
    NgxUiLoaderModule,
    FormsModule,
    PagesContainersModule,
    NgxDatatableModule,
    FnfResignationModule,
    FnfAssetsModule,
    FnfAdvanceModule,
    FnfLoanModule,
    FnfPenaltyModule,
    FnfSalaryCalculationModule,
    FnfUserDetailsModule,
    FnfGenerateExperienceLetterModule,
    FnfLeaveModule,
    AccordionModule
  ]
})
export class ListFnfModule { }
