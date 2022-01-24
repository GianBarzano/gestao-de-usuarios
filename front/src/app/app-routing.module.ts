import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { DeslogadoGuard } from './core/auth/deslogado.guard';
import { LogadoGuard } from './core/auth/logado.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MinhaContaComponent } from './minha-conta/minha-conta.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [LogadoGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [DeslogadoGuard]
  },
  {
    path: 'cadastro',
    component: CadastroComponent,
    canActivate: [DeslogadoGuard]
  },
  {
    path: 'minha-conta',
    component: MinhaContaComponent,
    canActivate: [LogadoGuard]
  },
  {
    path: 'meus-pets',
    loadChildren: () =>
      import('./meus-pets/meus-pets.module').then((m) => m.MeusPetsModule),
  },
  { 
    path: '**', 
    redirectTo: 'minha-conta',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
