import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioService } from './usuario/usuario.service';
import { AuthService } from './auth.service';
import { LogadoGuard } from './logado.guard';
import { DeslogadoGuard } from './deslogado.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    LogadoGuard,
    DeslogadoGuard,
    UsuarioService
  ]
})
export class AuthModule { }
