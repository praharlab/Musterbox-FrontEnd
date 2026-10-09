import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitCustomizeFieldComponent } from './visit-customize-field.component';


const routes: Routes = [
  { path: '', component: VisitCustomizeFieldComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitCustomizeFieldMasterRoutingModule { }
