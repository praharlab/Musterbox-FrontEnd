import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignationWiseDocMasterRoutingModule } from './designation-wise-doc-master-routing.module';
import { ListDesignationWiseDocumentComponent } from './list-designation-wise-document/list-designation-wise-document.component';
import { AddDesignationWiseDocumentComponent } from './add-designation-wise-document/add-designation-wise-document.component';
import { EditDesignationWiseDocumentComponent } from './edit-designation-wise-document/edit-designation-wise-document.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ImportDesignationWiseDocumentComponent } from './import-designation-wise-document/import-designation-wise-document.component';


@NgModule({
  declarations: [ListDesignationWiseDocumentComponent, AddDesignationWiseDocumentComponent, EditDesignationWiseDocumentComponent, ImportDesignationWiseDocumentComponent],
  imports: [
    CommonModule,
    DesignationWiseDocMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
  ]
})
export class DesignationWiseDocMasterModule { }
