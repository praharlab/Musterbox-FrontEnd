import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPtmasterComponent } from './list-ptmaster/list-ptmaster.component';
import { AddPtmasterComponent } from './add-ptmaster/add-ptmaster.component';
import { EdiitPtmasterComponent } from './ediit-ptmaster/ediit-ptmaster.component';


const routes: Routes = [
  { path: '', component: ListPtmasterComponent },
  { path: 'add_ptmaster', component: AddPtmasterComponent },
  { path: 'edit_ptmaster', component: EdiitPtmasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PtmMasterRoutingModule { }
