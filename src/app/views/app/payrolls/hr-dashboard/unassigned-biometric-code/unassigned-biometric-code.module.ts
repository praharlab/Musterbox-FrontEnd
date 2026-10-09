import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnassignedBiometricCodeRoutingModule } from './unassigned-biometric-code-routing.module';
import { UnassignedBiometricCodeComponent } from './unassigned-biometric-code.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [UnassignedBiometricCodeComponent],
  imports: [
    CommonModule,
    UnassignedBiometricCodeRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class UnassignedBiometricCodeModule { }
