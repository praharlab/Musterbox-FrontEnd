import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignBiometricUserListRoutingModule } from './assign-biometric-user-list-routing.module';
import { AssignBiometricUserListComponent } from './assign-biometric-user-list.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AssignBiometricUserListComponent],
  imports: [
    CommonModule,
    AssignBiometricUserListRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    PagesContainersModule,
    TranslateModule
  ]
})
export class AssignBiometricUserListModule { }
