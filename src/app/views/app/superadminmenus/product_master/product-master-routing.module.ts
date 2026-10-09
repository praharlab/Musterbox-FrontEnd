import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListProductMasterComponent } from './list-product-master/list-product-master.component';
import { AddProductMasterComponent } from './add-product-master/add-product-master.component';
import { EditProductMasterComponent } from './edit-product-master/edit-product-master.component';


const routes: Routes = [
  { path: '', component: ListProductMasterComponent },
  { path: 'add_product_master', component: AddProductMasterComponent },
  { path: 'edit_product_master', component: EditProductMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMasterRoutingModule { }
