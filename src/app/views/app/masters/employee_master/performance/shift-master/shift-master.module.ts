import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftMasterRoutingModule } from './shift-master-routing.module';
import { ShiftComponent } from './shift/shift.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [ShiftComponent],
  imports: [
    CommonModule,
    ShiftMasterRoutingModule,
    TranslateModule,
    FormsModule,
    ModalModule,
    NgSelectModule,
    NgxMaterialTimepickerModule
  ]
})
export class ShiftMasterModule { }
