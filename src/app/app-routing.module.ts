import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'billing',
    loadChildren: () => import('./components/billing/billing.module').then(m => m.BillingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    loadChildren: () => import('./components/clients/clients.module').then(m => m.ClientsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'areas',
    loadChildren: () => import('./components/areas/areas.module').then(m => m.AreasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses',
    loadChildren: () => import('./components/expenses/expenses.module').then(m => m.ExpensesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./components/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
