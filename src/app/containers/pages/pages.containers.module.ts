import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LightboxModule } from 'ngx-lightbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListPageHeaderComponent } from './list-page-header/list-page-header.component';
import { ComponentsCardsModule } from '../../components/cards/components.cards.module';
import { LayoutContainersModule } from '../layout/layout.containers.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { RatingModule } from 'ngx-bootstrap/rating';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    ListPageHeaderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CollapseModule,
    FormsModule,
    LayoutContainersModule,
    NgSelectModule,
    LightboxModule,
    ComponentsCardsModule,
    RatingModule,
    TabsModule,
    AccordionModule,
    BsDropdownModule,
  ],
  exports: [
    ListPageHeaderComponent,
  ],
})
export class PagesContainersModule {}
