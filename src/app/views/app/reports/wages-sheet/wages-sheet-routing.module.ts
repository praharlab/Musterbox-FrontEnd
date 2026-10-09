import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WagesSheetComponent } from './wages-sheet.component';


const routes: Routes = [{path:'',component:WagesSheetComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WagesSheetRoutingModule { }
