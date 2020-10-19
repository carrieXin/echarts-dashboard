import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// guards
import { AuthGuard } from './core/guards/auth.guard';

// components
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: 'panel',
    // canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      // 默认展示的菜单页
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      // 团队管理
      {
        path: 'dashboard',
        loadChildren: './modules/dashboard/dashboard.module#DashboardModule'
      },
    ]
  },
  {
    path: 'login',
    loadChildren: './modules/auth/auth.module#AuthModule'
  },
  {
    path: '',
    redirectTo: 'panel',
    pathMatch: 'full'
  },
  {
    path: 'index',
    redirectTo: 'panel',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
