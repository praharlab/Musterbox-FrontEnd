import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTicketSubCategoryComponent } from './list-ticket-sub-category/list-ticket-sub-category.component';
import { AddTicketSubCategoryComponent } from './add-ticket-sub-category/add-ticket-sub-category.component';
import { EditTicketSubCategoryComponent } from './edit-ticket-sub-category/edit-ticket-sub-category.component';


const routes: Routes = [
  { path: '', component: ListTicketSubCategoryComponent },
  { path: 'addTicketSubCategory', component: AddTicketSubCategoryComponent },
  { path: 'editTicketSubCategory', component: EditTicketSubCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketSubCategoryMasterRoutingModule { }
