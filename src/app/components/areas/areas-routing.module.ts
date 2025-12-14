import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaListComponent } from './area-list/area-list.component';
import { SubareaListComponent } from './subarea-list/subarea-list.component';

const routes: Routes = [
  {
    path: '',
    component: AreaListComponent
  },
  {
    path: 'subareas',
    component: SubareaListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreasRoutingModule { }
