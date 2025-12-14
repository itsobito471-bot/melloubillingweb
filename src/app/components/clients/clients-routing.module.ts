import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ClientListComponent
  },
  {
    path: 'create',
    component: ClientFormComponent
  },
  {
    path: 'edit/:id',
    component: ClientFormComponent
  },
  {
    path: 'view/:id',
    component: ClientDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
