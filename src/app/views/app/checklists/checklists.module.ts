import { NgModule } from '@angular/core';

import { ChecklistsRoutingModule } from './checklists.routing';

import { ChecklistsComponent } from './checklists.component';
import { ChecklistMasterComponent } from './checklist-master/checklist-master.component';

import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BnNgTreeModule } from 'src/app/components/bn-ng-tree/bn-ng-tree.module';

@NgModule({
  declarations: [
    ChecklistsComponent,
    ChecklistMasterComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    ChecklistsRoutingModule,
    SharedModule,
    LayoutContainersModule,
    PagesContainersModule,
    NgxUiLoaderModule,
    BnNgTreeModule,
  ],
})
export class ChecklistsModule {}
