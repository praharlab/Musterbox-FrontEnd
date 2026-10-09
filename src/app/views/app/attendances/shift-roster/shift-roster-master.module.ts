import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftRosterMasterRoutingModule } from './shift-roster-master-routing.module';
import { ShiftRosterComponent } from './shift-roster.component';
import { ImportShiftRosterComponent } from '../import-shift-roster/import-shift-roster.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ShowShiftRosterDataComponent } from '../show-shift-roster-data/show-shift-roster-data.component';
import { ImportShowShiftRosterDataComponent } from '../import-show-shift-roster-data/import-show-shift-roster-data.component';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ShiftRosterComponent, ImportShiftRosterComponent, ShowShiftRosterDataComponent, ImportShowShiftRosterDataComponent],
  imports: [
    CommonModule,
    ShiftRosterMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule
  ],
  exports: [ImportShowShiftRosterDataComponent, ShowShiftRosterDataComponent]
})
export class ShiftRosterMasterModule { }
