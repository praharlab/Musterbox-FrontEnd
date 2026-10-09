import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDepositCategoryComponent } from './list-deposit-category/list-deposit-category.component';
import { AddDepositCategoryComponent } from './add-deposit-category/add-deposit-category.component';
import { EditDepositCategoryComponent } from './edit-deposit-category/edit-deposit-category.component';
import { ImportDepositCategoryComponent } from './import-deposit-category/import-deposit-category.component';


const routes: Routes = [
  { path: '', component: ListDepositCategoryComponent },
  { path: 'add_depositCategory', component: AddDepositCategoryComponent },
  { path: 'edit_depositCategory', component: EditDepositCategoryComponent },
  { path: 'import_depositCategory', component: ImportDepositCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositCategoryMasterRoutingModule { }
