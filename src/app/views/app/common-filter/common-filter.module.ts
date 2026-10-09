import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFilterComponent } from './common-filter.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [CommonFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgSelectModule
  ],
  exports: [CommonFilterComponent]
})
export class CommonFilterModule { }
