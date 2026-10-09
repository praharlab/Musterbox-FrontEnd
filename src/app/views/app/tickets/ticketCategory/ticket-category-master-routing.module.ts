import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTicketCategoryComponent } from './list-ticket-category/list-ticket-category.component';
import { AddTicketCategoryComponent } from './add-ticket-category/add-ticket-category.component';
import { EditTicketCategoryComponent } from './edit-ticket-category/edit-ticket-category.component';


const routes: Routes = [
  { path: '', component: ListTicketCategoryComponent },
  { path: 'addTicketCategory', component: AddTicketCategoryComponent },
  { path: 'editTicketCategory', component: EditTicketCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketCategoryMasterRoutingModule { }
