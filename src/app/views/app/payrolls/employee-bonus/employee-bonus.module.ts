import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeBonusRoutingModule } from './employee-bonus-routing.module';
import { ListEmployeeBonusComponent } from './list-employee-bonus/list-employee-bonus.component';
import { AddEmployeeBonusComponent } from './add-employee-bonus/add-employee-bonus.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { ImportEmployeeBonusComponent } from './import-employee-bonus/import-employee-bonus.component';

@NgModule({
  declarations: [ListEmployeeBonusComponent, AddEmployeeBonusComponent, ImportEmployeeBonusComponent],
  imports: [
    CommonModule,
    EmployeeBonusRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    NgxMaterialTimepickerModule,
    CommonFilterModule
  ],
})
export class EmployeeBonusModule { }
