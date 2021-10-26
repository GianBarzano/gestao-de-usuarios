import { Component, OnInit } from '@angular/core';
import { AuthService, IDadosUsuario } from '../core/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dadosUsuarioLogado: IDadosUsuario | null = null;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.dadosUsuarioLogado = this.auth.dadosUsuario;
  }

  /**
   * Desloga do sistema
   */
  onDeslogarClick(){
    this.auth.deslogar();
  }
}
