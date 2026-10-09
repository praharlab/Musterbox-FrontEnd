import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListProductComponent } from './list-product/list-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ImportProductComponent } from './import-product/import-product.component';


const routes: Routes = [
  { path: '', component: ListProductComponent },
  { path: 'add_product', component: AddProductComponent },
  { path: 'edit_product', component: EditProductComponent },
  { path: 'import_product', component: ImportProductComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMasterRoutingModule { }
