import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { CategoryManagerComponent } from './category-manager/category-manager.component';

const routes: Routes = [
  {
    path: 'categories',
    component: CategoryManagerComponent
  },
  {
    path: 'create',
    component: ExpenseFormComponent
  },
  {
    path: 'edit/:id',
    component: ExpenseFormComponent
  },
  {
    path: 'all',
    component: ExpenseListComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
