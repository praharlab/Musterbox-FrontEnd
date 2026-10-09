import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileStatusTabRoutingModule } from './profile-status-tab-routing.module';
import { ProfileStatusTabComponent } from './profile-status-tab.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ProfileStatusTabComponent],
  imports: [
    CommonModule,
    ProfileStatusTabRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class ProfileStatusTabModule { }
