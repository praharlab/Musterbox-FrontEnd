import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonusPolicyRoutingModule } from './bonus-policy-routing.module';
import { AddBonusPolicyComponent } from './add-bonus-policy/add-bonus-policy.component';
import { EditBonusPolicyComponent } from './edit-bonus-policy/edit-bonus-policy.component';
import { ListBonusPolicyComponent } from './list-bonus-policy/list-bonus-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [AddBonusPolicyComponent, EditBonusPolicyComponent, ListBonusPolicyComponent],
  imports: [
    CommonModule,
    BonusPolicyRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class BonusPolicyModule { }
