import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDadosCadastro } from '../core/auth/usuario/classes/idadoscadastro.interface';
import { UsuarioService } from '../core/auth/usuario/usuario.service';
import { MyCustomLoadingService } from '../shared/my-custom-loading/my-custom-loading.service';
import { MyCustomToasterService } from '../shared/my-custom-toaster/my-custom-toaster.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  /**
   * Dados de cadastro
   */
  dadosCadastro: IDadosCadastro = {
    nome: '',
    email: '',
    senha: ''
  }

  constructor(
    public usuario: UsuarioService,
    private router: Router,
    private toaster: MyCustomToasterService,
    private loading: MyCustomLoadingService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Disparado ao mudar o valor do input
   * @param campo 
   * @param evento 
   */
  onInputChange(campo: InputChangeCampo, evento: string){
    this.dadosCadastro[campo] = evento;
  }

  /**
   * Realiza o cadastro
   */
  onCadastrarClick(){
    // Validações
    this.dadosCadastro.email = this.dadosCadastro.email.trim();
    this.dadosCadastro.nome = this.dadosCadastro.nome.trim();
    this.dadosCadastro.senha = this.dadosCadastro.senha.trim();

    if (this.dadosCadastro.nome.length == 0) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Nome não preenchido!'
      });

      return;
    }

    if (this.dadosCadastro.nome.length < 2) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Nome deve ter no mínimo 2 caracteres!'
      });
      
      return;
    }

    if (this.dadosCadastro.nome.length > 50) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Nome deve ter no máximo 50 caracteres!'
      });
      
      return;
    }

    if (this.dadosCadastro.email.length == 0) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'E-mail não preenchido!'
      });

      return;
    }

    if (this.dadosCadastro.email.length > 50) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'E-mail deve ter no máximo 50 caracteres!'
      });
      
      return;
    }

    if (this.dadosCadastro.senha.length == 0) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Senha não preenchida!'
      });

      return;
    }

    if (this.dadosCadastro.senha.length < 6) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Senha deve ter no mínimo 6 caracteres!'
      });
      
      return;
    }

    if (this.dadosCadastro.senha.length > 12) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Senha deve ter no máximo 12 caracteres!'
      });
      
      return;
    }

    // Ativo o loading
    this.loading.mostrar({mensagem: 'Cadastrando usuário...'});

    this.usuario.cadastrar(this.dadosCadastro)
      .then((retorno) => {
        this.toaster.mostrar({
          tipo: 'sucesso',
          mensagem: 'Usuario cadastrado com sucesso!'
        });
        
        // Se usuário foi cadastrado, mas deu erro ao logar,
        //  Redireciono para página de login
        if (retorno == 'falha-login') {
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 500);
        } else {
          this.router.navigate(['']);
        }
      }).catch((err) => {
        let msgErro = 'Não foi possível cadastrar usuário';
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
}

type InputChangeCampo = 'nome' | 'email' | 'senha';