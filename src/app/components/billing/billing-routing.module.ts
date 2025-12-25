import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillListComponent } from './bill-list/bill-list.component';
import { BillCreateComponent } from './bill-create/bill-create.component';

const routes: Routes = [
  {
    path: '',
    component: BillListComponent
  },
  {
    path: 'create',
    component: BillCreateComponent
  },
  {
    path: 'edit/:id',
    component: BillCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
