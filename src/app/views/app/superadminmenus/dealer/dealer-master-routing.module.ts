import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDealerComponent } from './list-dealer/list-dealer.component';
import { AddDealerComponent } from './add-dealer/add-dealer.component';
import { EditDealerComponent } from './edit-dealer/edit-dealer.component';


const routes: Routes = [
  { path: '', component: ListDealerComponent },
  { path: 'add_dealer', component: AddDealerComponent },
  { path: 'edit_dealer', component: EditDealerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealerMasterRoutingModule { }
