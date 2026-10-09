import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDesignationWiseDocumentComponent } from './list-designation-wise-document/list-designation-wise-document.component';
import { AddDesignationWiseDocumentComponent } from './add-designation-wise-document/add-designation-wise-document.component';
import { EditDesignationWiseDocumentComponent } from './edit-designation-wise-document/edit-designation-wise-document.component';
import { ImportDesignationWiseDocumentComponent } from './import-designation-wise-document/import-designation-wise-document.component';


const routes: Routes = [
  { path: '', component: ListDesignationWiseDocumentComponent },
  { path: 'add_designationWiseDocument', component: AddDesignationWiseDocumentComponent },
  { path: 'edit_designationWiseDocument', component: EditDesignationWiseDocumentComponent },
  { path: 'import_designationWiseDocument', component: ImportDesignationWiseDocumentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignationWiseDocMasterRoutingModule { }
