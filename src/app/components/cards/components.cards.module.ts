import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { RadialProcessCardComponent } from './radial-process-card/radial-process-card.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    RadialProcessCardComponent,
  ],
  imports: [CommonModule, RoundProgressModule, SharedModule],
  providers: [],
  exports: [
    RadialProcessCardComponent,
  ],
})
export class ComponentsCardsModule {}
