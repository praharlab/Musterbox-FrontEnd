import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyDocumentsMasterRoutingModule } from './policy-documents-master-routing.module';
import { ListPolicyDocumentsComponent } from './list-policy-documents/list-policy-documents.component';
import { AddPolicyDocumentsComponent } from './add-policy-documents/add-policy-documents.component';
import { EditPolicyDocumentsComponent } from './edit-policy-documents/edit-policy-documents.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ListPolicyDocumentsComponent, AddPolicyDocumentsComponent, EditPolicyDocumentsComponent],
  imports: [
    CommonModule,
    PolicyDocumentsMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class PolicyDocumentsMasterModule { }
