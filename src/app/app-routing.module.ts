/** Angular core */
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CanLoad } from '@angular/router'

/** App imports */
import { AuthGuard } from '@core/index'

const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch: 'full'},
  {path: '', redirectTo:'layout', pathMatch: 'full'},
  { 
    path: '', 
    loadChildren: () => import('@modules/authentication/authentication.module').then(m => m.AuthenticationModule) 
  },
  {
    path: 'layout',
    canLoad: [AuthGuard],
    loadChildren: () => import('@layout/layout.module').then(m => m.LayoutModule) 
  },
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
