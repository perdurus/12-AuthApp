import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidadTokenGuard } from './guards/validad-token.guard';

const routes: Routes = [
  {
    path:'auth', 
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path:'dashboard', 
    loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule),
    canActivate: [ValidadTokenGuard],
    canLoad: [ValidadTokenGuard]
  },
  {
    path: '**',
    redirectTo: 'auth'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
