import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SentimentAnalysisDashboardMasterRoutingModule } from './sentiment-analysis-dashboard-master-routing.module';
import { SentimentAnalysisDashboardComponent } from './sentiment-analysis-dashboard.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { CardsComponent } from './cards/cards.component';
import { GraphsComponent } from './graphs/graphs.component';
import { MonthYearGraphComponent } from './month-year-graph/month-year-graph.component';


@NgModule({
  declarations: [SentimentAnalysisDashboardComponent, CardsComponent, GraphsComponent, MonthYearGraphComponent,],
  imports: [
    CommonModule,
    SentimentAnalysisDashboardMasterRoutingModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class SentimentAnalysisDashboardMasterModule { }
