import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListNdaCategoryComponent } from './list-nda-category/list-nda-category.component';
import { AddNdaCategoryComponent } from './add-nda-category/add-nda-category.component';
import { EditNdaCategoryComponent } from './edit-nda-category/edit-nda-category.component';
import { ImportNdaCategoryComponent } from './import-nda-category/import-nda-category.component';


const routes: Routes = [
  { path: '', component: ListNdaCategoryComponent },
  { path: 'add_nda_category', component: AddNdaCategoryComponent },
  { path: 'edit_nda_category', component: EditNdaCategoryComponent },
  { path: 'import_nda_category', component: ImportNdaCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdaCategoryMasterRoutingModule { }
