import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ETipoLogin, IDadosLogin } from '../core/auth/usuario/classes/etipologin.enum';
import { UsuarioService } from '../core/auth/usuario/usuario.service';
import { MyCustomLoadingService } from '../shared/my-custom-loading/my-custom-loading.service';
import { MyCustomToasterService } from '../shared/my-custom-toaster/my-custom-toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /**
   * Dados de login
   */
  dadosLogin: IDadosLogin = {
    email: '',
    cpf: '',
    pis: '',
    senha: ''
  }

  /**
   * Enum de tipo de login
   */
  ETipoLogin = ETipoLogin;
  /**
   * Tipo de login da tela
   */
  tipoLogin = ETipoLogin.tlPorEmail;

  constructor(
    public usuario: UsuarioService,
    private router: Router,
    private toaster: MyCustomToasterService,
    private loading: MyCustomLoadingService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Define o tipo de login da tela
   * @param tipoLogin 
   */
  onTituloTipoLoginClick(tipoLogin: ETipoLogin) {
    this.tipoLogin = tipoLogin;
  }

  /**
   * Disparado ao clicar no botão de login
   */
  onLogarClick(){
    // Validações
    switch (this.tipoLogin) {
      // Login por e-mail
      case ETipoLogin.tlPorEmail: {
        break;
      }
      // Login por CPF
      case ETipoLogin.tlPorCpf: {
        break;
      }

      // Login por PIS
      case ETipoLogin.tlPorPis: {
        break;
      }

      default:
        return;
    }

    // Ativo o loading
    this.loading.mostrar({mensagem: 'Logando no sistema...'});

    this.usuario.logar(this.tipoLogin, this.dadosLogin)
      .then(() => {
        this.router.navigate(['']);
      })
      .catch((err) => {
        let msgErro = 'Não foi possível logar usuário';
        if (err && err.message) {
          msgErro = err.message;
        }

        this.toaster.mostrar({
          tipo: 'erro',
          mensagem: msgErro
        });
      }).finally(() => {
        // Desativo loading
        this.loading.fechar();
      })
  }

  /**
   * Disparado ao mudar o valor do input
   * @param campo 
   * @param evento 
   */
  onInputChange(campo: InputChangeCampo, evento: string){
    this.dadosLogin[campo] = evento;
  }
}


type InputChangeCampo = 'email' | 'cpf' | 'pis' | 'senha';