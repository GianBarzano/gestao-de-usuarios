import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { IUsuarioApi } from '../core/auth/usuario/classes/iusuarioapi.interface';
import { IUsuarioAtualizarDocIdApi, IUsuarioAtualizarEmailApi, IUsuarioAtualizarEnderecoApi, IUsuarioAtualizarNomeApi, IUsuarioAtualizarSenhaApi } from '../core/auth/usuario/classes/iusuarioatualizarapi.interface';
import { UsuarioService } from '../core/auth/usuario/usuario.service';
import { MyCustomLoadingService } from '../shared/my-custom-loading/my-custom-loading.service';
import { MyCustomToasterService } from '../shared/my-custom-toaster/my-custom-toaster.service';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.scss']
})
export class MinhaContaComponent implements OnInit {
  
  usuario: IUsuarioApi = {
    id: '',
    email: '',
    nome: '',
    cpf: '',
    pis: '',
    objs: {
      endereco: {}
    }
  }
  /**
   * Controla visibilidade das seções de informação
   */
  secaoConta: ISecaoTelaConta = {
    emEdicao: false,
    novoValor: {}
  };
  secaoNome: ISecaoTelaNome = {
    emEdicao: false,
    novoValor: {
      nome: ''
    }
  };
  secaoEmail: ISecaoTelaEmail = {
    emEdicao: false,
    novoValor: {
      email: ''
    }
  };
  secaoSenha: ISecaoTelaSenha = {
    emEdicao: false,
    novoValor: {
      senha: '',
      senhaatual: ''
    }
  };
  secaoDocIdenticacao: ISecaoTelaDocIdentificacao = {
    emEdicao: false,
    novoValor: {
      cpf: '',
      pis: ''
    }
  };
  secaoEndereco: ISecaoTelaEndereco = {
    emEdicao: false,
    novoValor: {
      pais: '',
      estado: '',
      municipio: '',
      cep: '',
      rua: '',
      numero: '',
      complemento: ''
    }
  };

  ESecaoDados = ESecaoDados;
  
  constructor(
    private usuarioService: UsuarioService,
    private auth: AuthService,
    private toaster: MyCustomToasterService,
    private loading: MyCustomLoadingService
  ) { }

  ngOnInit(): void {
    // Defino dados básicos do usuário
    this.usuario.id = <string>this.auth.dadosUsuario?.userid;
    this.usuario.nome = this.auth.dadosUsuario?.nome;
    this.usuario.email = this.auth.dadosUsuario?.email;
    
    this.loading.mostrar({mensagem: 'Carregando suas informações...'});
    // Busco usuário da api
    this.usuarioService
      .buscar(this.usuario.id)
      .then((usuarioApi) => {
        this.usuario = usuarioApi;
      })
      .catch((err) => {
        this.toaster.mostrar({
          tipo: 'erro',
          mensagem: 'Não foi possível buscar todas as inforações do seu perfil!'
        })
      })
      .finally(() => {
        // Desativo loading
        this.loading.fechar();
      })
  }

  /**
   * Disparado ao mudar o valor do input na seção Nome
   * @param campo 
   * @param evento 
   */
  onSecaoInputChange(secao: ESecaoDados, campo: TSecaoInputCampos, evento: string){
    let secaoObj: ISecaoTela<TSecaoInputCampos> | null = null;

    // Defino objeto da seção
    switch (secao) {
      case ESecaoDados.sdNome: {
        secaoObj = this.secaoNome;
        break;
      }
      case ESecaoDados.sdEmail: {
        secaoObj = this.secaoEmail;
        break;
      }
      case ESecaoDados.sdSenha: {
        secaoObj = this.secaoSenha;
        break;
      }
      case ESecaoDados.sdDocId: {
        secaoObj = this.secaoDocIdenticacao;
        break;
      }
      case ESecaoDados.sdEndereco: {
        secaoObj = this.secaoEndereco;
        break;
      }
      default:
        break;
    }

    // Atualizo valor do input
    if (secaoObj != null) {
      secaoObj.novoValor[campo] = evento;
    }
  }

  /**
   * Disparado ao clicar no botão de excluir conta
   */
  onExcluirContaClick(){
    if (!confirm('Tem certeza que deseja excluir sua conta?')) {
      return;
    }

    this.loading.mostrar({mensagem: 'Excluindo conta...'});
    this.usuarioService.excluir(<string>this.usuario.id)
      .then(() => {
        // Apresento mensagem de sucesos
        this.toaster.mostrar({
          tipo: 'sucesso',
          mensagem: 'Conta excluída com sucesso!'
        })
        // Deslogo usuário
        this.auth.deslogar();
      })
      .catch((err) => {
        let msgErro = 'Não foi excluir conta.';

        if (err && err.message) {
          msgErro = err.message;
        }

        this.toaster.mostrar({
          tipo: 'erro',
          mensagem: msgErro
        })
      })
      .finally(() => {
        // Desativo loading
        this.loading.fechar();
      })
  }

  /**
   * Disparado ao clicar no botão de editar de alguma seção
   * @param secao 
   */
  onSecaoEditarClick(secao: ESecaoDados){
    let id = '';
    switch (secao) {
      case ESecaoDados.sdNome: {
        this.secaoNome.emEdicao = true;
        this.secaoNome.novoValor.nome = <string>this.usuario.nome;
        // Defino id
        id = 'secao-nome';
        break;
      }
      case ESecaoDados.sdEmail: {
        this.secaoEmail.emEdicao = true;
        this.secaoEmail.novoValor.email = <string>this.usuario.email;
        // Defino id
        id = 'secao-email';
        break;
      }
      case ESecaoDados.sdSenha: {
        this.secaoSenha.emEdicao = true;
        this.secaoSenha.novoValor.senha = '';
        this.secaoSenha.novoValor.senhaatual = '';
        // Defino id
        id = 'secao-senha';
        break;
      }
      case ESecaoDados.sdDocId: {
        this.secaoDocIdenticacao.emEdicao = true;
        this.secaoDocIdenticacao.novoValor.cpf = this.usuario.cpf || '';
        this.secaoDocIdenticacao.novoValor.pis = this.usuario.pis || '';
        // Defino id
        id = 'secao-doc-id';
        break;
      }
      case ESecaoDados.sdEndereco: {
        this.secaoEndereco.emEdicao = true;
        this.secaoEndereco.novoValor = {
          pais: this.usuario.objs?.endereco?.pais || '',
          municipio: this.usuario.objs?.endereco?.municipio || '',
          estado: this.usuario.objs?.endereco?.estado || '',
          cep: this.usuario.objs?.endereco?.cep || '',
          rua: this.usuario.objs?.endereco?.rua || '',
          numero: this.usuario.objs?.endereco?.numero || '',
          complemento: this.usuario.objs?.endereco?.complemento || ''
        }
        // Defino id
        id = 'secao-endereco';
        break;
      }
      default:
        break;
    }

    location.hash = id;
  }

  /**
   * Disparado ao clicar no botão de cancelar de alguma seção
   * @param secao 
   */
  onSecaoCancelarClick(secao: ESecaoDados){
    switch (secao) {
      case ESecaoDados.sdDocId: {
        this.secaoDocIdenticacao.emEdicao = false;
        break;
      }
      case ESecaoDados.sdNome: {
        this.secaoNome.emEdicao = false;
        break;
      }
      case ESecaoDados.sdEmail: {
        this.secaoEmail.emEdicao = false;
        break;
      }
      case ESecaoDados.sdSenha: {
        this.secaoSenha.emEdicao = false;
        break;
      }
      case ESecaoDados.sdEndereco: {
        this.secaoEndereco.emEdicao = false;
        break;
      }
      default:
        break;
    }

    location.hash = '';
  }

  /**
   * Disparado ao clicar no botão de salvar da seção de nome
   */
  onSecaoNomeSalvarClick(){
    // Validações de valor incorreto, ou não preenchimento

    // Monto objeto para chamar service atualização
    const dadosReq: IUsuarioAtualizarNomeApi = {}
    const nomeNovo = this.secaoNome.novoValor.nome.trim();
    const nomeAtual = this.usuario.nome;
    
    // Só adiciono registro a ser alterado caso seja diferente do original
    if (nomeNovo != nomeAtual) {
      dadosReq.nome = nomeNovo;
    }

    if (nomeNovo.length < 2) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Nome deve ter no mínimo 2 caracteres!'
      });
      
      return;
    }

    if (nomeNovo.length > 50) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Nome deve ter no máximo 50 caracteres!'
      });
      
      return;
    }

    // Se não existem dados a modificar, fecho modo de edição
    if (Object.keys(<any>dadosReq).length == 0) {
      this.secaoNome.emEdicao = false;
    } else {
      // Ativo loading
      this.loading.mostrar({mensagem: 'Atualizando nome...'});
      this.usuarioService.atualizar(<string>this.usuario.id, dadosReq)
        .then(() => {
          this.usuario.nome = nomeNovo;
          this.auth.dadosAcessoUsuarioNome = nomeNovo;

          // Apresento mensagem de sucesso
          this.toaster.mostrar({
            tipo: 'sucesso',
            mensagem: 'Nome salvo com sucesso!'
          });

          // Fecho edição
          this.secaoNome.emEdicao = false;
        })
        .catch((err) => {
          let msgErro = 'Não foi possível atualizar nome.';

          if (err && err.message) {
            msgErro = err.message;
          }

          this.toaster.mostrar({
            tipo: 'erro',
            mensagem: msgErro
          });
        })
        .finally(() => {
          // Desativo loading
          this.loading.fechar();
        })
    }
  }

  /**
   * Disparado ao clicar no botão de salvar da seção de email
   */
  onSecaoEmailSalvarClick(){
    // Validações de valor incorreto, ou não preenchimento

    // Monto objeto para chamar service atualização
    const dadosReq: IUsuarioAtualizarEmailApi = {}
    const emailNovo = this.secaoEmail.novoValor.email.trim();
    const emailAtual = this.usuario.email;
    
    // Só adiciono registro a ser alterado caso seja diferente do original
    if (emailNovo != emailAtual) {
      dadosReq.email = emailNovo;
    }

    if (emailNovo.length == 0) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'E-mail não preenchido!'
      });

      return;
    }

    if (emailNovo.length > 50) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'E-mail deve ter no máximo 50 caracteres!'
      });

      return;
    }

    // Se não existem dados a modificar, fecho modo de edição
    if (Object.keys(<any>dadosReq).length == 0) {
      this.secaoEmail.emEdicao = false;
    } else {
      this.loading.mostrar({mensagem: 'Atualizando e-mail...'});
      this.usuarioService.atualizar(<string>this.usuario.id, dadosReq)
        .then(() => {
          this.usuario.email = emailNovo;
          this.auth.dadosAcessoUsuarioEmail = emailNovo;

          // Apresento mensagem de sucesso
          this.toaster.mostrar({
            tipo: 'sucesso',
            mensagem: 'E-mail salvo com sucesso!'
          });

          // Fecho edição
          this.secaoEmail.emEdicao = false;
        })
        .catch((err) => {
          let msgErro = 'Não foi possível atualizar e-mail.';

          if (err && err.message) {
            msgErro = err.message;
          }

          this.toaster.mostrar({
            tipo: 'erro',
            mensagem: msgErro
          });
        })
        .finally(() => {
          // Desativo loading
          this.loading.fechar();
        })
    }
  }

  /**
   * Disparado ao clicar no botão de salvar da seção de senha
   */
  onSecaoSenhaSalvarClick(){
    // Monto objeto para chamar service atualização
    const dadosReq: IUsuarioAtualizarSenhaApi = {}

    let secaoDados = this.secaoSenha.novoValor;
    secaoDados.senha = secaoDados.senha.trim();
    secaoDados.senhaatual = secaoDados.senhaatual.trim();

    const senhaNova = secaoDados.senha;
    const senhaAtual = secaoDados.senhaatual;
    
    // Só adiciono registro a ser alterado caso seja diferente do original
    if (senhaNova != senhaAtual) {
      dadosReq.senha = senhaNova;
      dadosReq.senhaatual = senhaAtual;
    } else {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Senha nova e atual devem ser diferentes!'
      });
      return;
    }

    if (senhaNova.length == 0) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Senha não preenchida!'
      });

      return;
    }

    if (senhaNova.length < 6) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Senha deve ter no mínimo 6 caracteres!'
      });
      
      return;
    }

    if (senhaNova.length > 12) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Senha deve ter no máximo 12 caracteres!'
      });
      
      return;
    }

    // Se não existem dados a modificar, fecho modo de edição
    if (Object.keys(<any>dadosReq).length == 0) {
      this.secaoSenha.emEdicao = false;
    } else {
      this.loading.mostrar({mensagem: 'Atualizando senha...'});
      this.usuarioService.atualizar(<string>this.usuario.id, dadosReq)
        .then(() => {
          // Apresento mensagem de sucesos
          this.toaster.mostrar({
            tipo: 'sucesso',
            mensagem: 'Senha salva com sucesso!'
          });

          // Fecho edição
          this.secaoSenha.emEdicao = false;
        })
        .catch((err) => {
          let msgErro = 'Não foi possível atualizar senha.';

          if (err && err.message) {
            msgErro = err.message;
          }

          this.toaster.mostrar({
            tipo: 'erro',
            mensagem: msgErro
          });
        })
        .finally(() => {
          // Desativo loading
          this.loading.fechar();
        })
    }
  }

  /**
   * Disparado ao clicar no botão de salvar da seção de documentos de identificação
   */
  onSecaoDocIdSalvarClick(){
    // Monto objeto para chamar service atualização
    const dadosReq: IUsuarioAtualizarDocIdApi = {}

    let secaoDados = this.secaoDocIdenticacao.novoValor;
    secaoDados.cpf = secaoDados.cpf.trim();
    secaoDados.pis = secaoDados.pis.trim();

    const cpfNovo = secaoDados.cpf;
    const pisNovo = secaoDados.pis;
    
    // Só adiciono registro a ser alterado caso seja diferente do original
    if (cpfNovo != (this.usuario.cpf || '')) {
      dadosReq.cpf = cpfNovo;
    }

    if (pisNovo != (this.usuario.pis || '')) {
      dadosReq.pis = pisNovo;
    }

    // Se não existem dados a modificar, fecho modo de edição
    if (Object.keys(<any>dadosReq).length == 0) {
      this.secaoDocIdenticacao.emEdicao = false;
    } else {
      this.loading.mostrar({mensagem: 'Atualizando documentos de identificação...'});
      this.usuarioService.atualizar(<string>this.usuario.id, dadosReq)
        .then(() => {
          // Atualizo dados do usuário
          if (dadosReq.cpf != null) {
            this.usuario.cpf = dadosReq.cpf;
          }
          if (dadosReq.pis != null) {
            this.usuario.pis = dadosReq.pis;
          }

          // Apresento mensagem de sucesso
          this.toaster.mostrar({
            tipo: 'sucesso',
            mensagem: 'Documentos de identificação salvos com sucesso!'
          });

          // Fecho edição
          this.secaoDocIdenticacao.emEdicao = false;
        })
        .catch((err) => {
          let msgErro = 'Não foi possível atualizar documentos de identificação.';

          if (err && err.message) {
            msgErro = err.message;
          }

          this.toaster.mostrar({
            tipo: 'erro',
            mensagem: msgErro
          });
        })
        .finally(() => {
          // Desativo loading
          this.loading.fechar();
        })
    }
  }

  /**
   * Disparado ao clicar no botão de salvar da seção de endereço
   */
  onSecaoEnderecoSalvarClick(){
    // Monto objeto de endereço para chamar service atualização
    const dadosReq: IUsuarioAtualizarEnderecoApi = {
      endereco: {}
    }
    const enderecoNovo = this.secaoEndereco.novoValor;
    enderecoNovo.pais = enderecoNovo.pais.trim();
    enderecoNovo.estado = enderecoNovo.estado.trim();
    enderecoNovo.municipio = enderecoNovo.municipio.trim();
    enderecoNovo.cep = enderecoNovo.cep.trim();
    enderecoNovo.rua = enderecoNovo.rua.trim();
    enderecoNovo.numero = enderecoNovo.numero.trim();
    enderecoNovo.complemento = enderecoNovo.complemento.trim();

    // Validações de valor incorreto, ou não preenchimento
    if (enderecoNovo.pais.length == 0) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Campo país é obrigatório!'
      });
      return;
    }
    if (enderecoNovo.municipio.length == 0) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Campo município é obrigatório!'
      });
      return;
    }
    if (enderecoNovo.estado.length == 0) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Campo uf é obrigatório!'
      });
      return;
    }
    if (enderecoNovo.cep.length == 0) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Campo cep é obrigatório!'
      });
      return;
    }
    if (enderecoNovo.rua.length == 0) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Campo rua é obrigatório!'
      });
      return;
    }
    if (enderecoNovo.numero.length == 0) {
      this.toaster.mostrar({
        tipo: 'erro',
        mensagem: 'Campo número é obrigatório!'
      });
      return;
    }

    const enderecoAtual = this.usuario.objs?.endereco;
    
    // Só adiciono registro a ser alterado caso seja diferente do original
    if (enderecoNovo.pais != enderecoAtual?.pais) {
      dadosReq.endereco!.pais = enderecoNovo.pais;
    }
    if (enderecoNovo.estado != enderecoAtual?.estado) {
      dadosReq.endereco!.estado = enderecoNovo.estado;
    }
    if (enderecoNovo.municipio != enderecoAtual?.municipio) {
      dadosReq.endereco!.municipio = enderecoNovo.municipio;
    }
    if (enderecoNovo.cep != enderecoAtual?.cep) {
      dadosReq.endereco!.cep = enderecoNovo.cep;
    }
    if (enderecoNovo.rua != enderecoAtual?.rua) {
      dadosReq.endereco!.rua = enderecoNovo.rua;
    }
    if (enderecoNovo.numero != enderecoAtual?.numero) {
      dadosReq.endereco!.numero = enderecoNovo.numero;
    }
    if (enderecoNovo.complemento != enderecoAtual?.complemento) {
      dadosReq.endereco!.complemento = enderecoNovo.complemento;
    }

    // Se não existem dados a modificar, fecho modo de edição
    if (Object.keys(<any>dadosReq.endereco).length == 0) {
      this.secaoEndereco.emEdicao = false;
    } else {
      this.loading.mostrar({mensagem: 'Atualizando endereço...'});
      this.usuarioService.atualizar(<string>this.usuario.id, dadosReq)
        .then((res) => {
          if (!this.usuario.objs) {
            this.usuario.objs = {
              endereco: {}
            }
          };
          if (!this.usuario.objs.endereco) {
            this.usuario.objs.endereco = {};
          }

          if (this.usuario.id_endereco == null) {
            this.usuario.id_endereco = res.id_endereco
          }

          this.usuario.objs!.endereco!.pais = enderecoNovo.pais;
          this.usuario.objs!.endereco!.estado = enderecoNovo.estado;
          this.usuario.objs!.endereco!.municipio = enderecoNovo.municipio;
          this.usuario.objs!.endereco!.cep = enderecoNovo.cep;
          this.usuario.objs!.endereco!.rua = enderecoNovo.rua;
          this.usuario.objs!.endereco!.numero = enderecoNovo.numero;
          this.usuario.objs!.endereco!.complemento = enderecoNovo.complemento;

          // Apresento mensagem de sucesso
          this.toaster.mostrar({
            tipo: 'sucesso',
            mensagem: 'Endereço salvo com sucesso!'
          });

          // Fecho edição do endereço
          this.secaoEndereco.emEdicao = false;
        })
        .catch((err) => {
          let msgErro = 'Não foi possível atualizar endereço.';

          if (err && err.message) {
            msgErro = err.message;
          }

          this.toaster.mostrar({
            tipo: 'erro',
            mensagem: msgErro
          });
        })
        .finally(() => {
          // Desativo loading
          this.loading.fechar();
        })
    }
  }

  /**
   * Formata o endereço do usuario.
   * No caso de não possuir endereço, retorna 'Não informado'
   */
  getEnderecoFormatado(): string {
    if (!this.usuario.id_endereco || !this.usuario.objs?.endereco) {
      return 'Não informado';
    }

    // Formato endereço para: NOME_RUA, NUMERO - COMPLEMENTO - CEP - MUNICIPIO, ESTADO - PAIS
    const endereco = this.usuario.objs.endereco;
    let enderecoStr = `${ endereco.rua || '' }, ${ endereco.numero || '' }`
      + (endereco.complemento ? ` - ${ endereco.complemento }` : '')
      + ` - ${ this.formataCEP(endereco.cep) } - ${ endereco.municipio || '' }, ${ endereco.estado?.toUpperCase() || '' } - ${ endereco.pais?.toUpperCase() || '' }`;

    return enderecoStr;
  }

  formataCPF(cpf: string = ''): string{
    if (!cpf || cpf == '') {
      return 'Não informado';
    }
    //retira os caracteres indesejados...
    cpf = cpf.replace(/[^\d]/g, "");
  
    //realizar a formatação...
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  formataCEP(cep: string = ''): string {
    if (!cep) {
      return '';
    }
    //retira os caracteres indesejados...
    cep = cep.replace(/[^\d]/g, "");
  
    //realizar a formatação...
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  formataPIS(pis: string = ''): string {
    if (!pis || pis == '') {
      return 'Não informado';
    }
    //retira os caracteres indesejados...
    pis = pis.replace(/[^\d]/g, "");
  
    //realizar a formatação...
    return pis.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, "$1.$2.$3-$4");
  }
}

enum ESecaoDados {
  sdConta,
  sdNome,
  sdEmail,
  sdSenha,
  sdDocId,
  sdEndereco
}

interface ISecaoTela<Campos extends TSecaoInputCampos> {
  emEdicao: boolean;
  novoValor: {
    [key in Campos]?: any
  };
}

interface ISecaoTelaConta extends ISecaoTela<any>{};
interface ISecaoTelaNome extends ISecaoTela<TSecaoNomeInputCampos> {}
interface ISecaoTelaEmail extends ISecaoTela<TSecaoEmailInputCampos> {}
interface ISecaoTelaSenha extends ISecaoTela<TSecaoSenhaInputCampos> {}
interface ISecaoTelaDocIdentificacao extends ISecaoTela<TSecaoDocIdInputCampos> {}
interface ISecaoTelaEndereco extends ISecaoTela<TSecaoEnderecoInputCampos> {}

type TSecaoNomeInputCampos = 'nome';
type TSecaoEmailInputCampos = 'email';
type TSecaoSenhaInputCampos = 'senha' | 'senhaatual';
type TSecaoDocIdInputCampos = 'cpf' | 'pis';
type TSecaoEnderecoInputCampos = 'pais' | 'municipio' | 'estado' | 'cep'
  | 'rua' | 'numero' | 'complemento';
type TSecaoInputCampos = TSecaoNomeInputCampos
  | TSecaoEmailInputCampos
  | TSecaoSenhaInputCampos
  | TSecaoDocIdInputCampos
  | TSecaoEnderecoInputCampos;