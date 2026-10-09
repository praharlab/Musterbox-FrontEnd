import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListContractorComponent } from './list-contractor/list-contractor.component';
import { AddContractorComponent } from './add-contractor/add-contractor.component';
import { EditContractorComponent } from './edit-contractor/edit-contractor.component';
import { ImportContractorComponent } from './import-contractor/import-contractor.component';


const routes: Routes = [
  { path: '', component: ListContractorComponent },
  { path: 'add_cotractor', component: AddContractorComponent },
  { path: 'edit_cotractor', component: EditContractorComponent },
  { path: 'import_contractor', component: ImportContractorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractorMasterRoutingModule { }
