import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { AuthService } from '../auth.service';
import { ETipoLogin, IDadosLogin, IDadosLoginApi, IDadosLoginCpf, IDadosLoginPis } from './classes/etipologin.enum';
import { IUsuarioApi } from './classes/iusuarioapi.interface';
import { IUsuarioAtualizarApi } from './classes/iusuarioatualizarapi.interface';

@Injectable()
export class UsuarioService {

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}
  
  /**
   * Realiza o login de um usuário
   */
  logar(tipoLogin: ETipoLogin, dados: IDadosLogin): Promise<void>{
    return new Promise((resolve, reject) => {
      // Login via api
      if ([ETipoLogin.tlPorCpf, ETipoLogin.tlPorPis].indexOf(tipoLogin) > -1) {
        const dadosLoginApi: IDadosLoginApi = {
          tipo: (tipoLogin == ETipoLogin.tlPorCpf) ? 'cpf' : 'pis',
          senha: dados.senha,
          cpf: (<IDadosLoginCpf>dados).cpf,
          pis: (<IDadosLoginPis>dados).pis
        };

        this.logarPorApi(dadosLoginApi).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        })
      } else {
        // Logo via e-mail
        this.auth.logarViaEmailESenha(dados.email, dados.senha).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        })
      }
    });
  }

  /**
   * Realiza o cadastro de um usuário
   */
  cadastrar(dados: any): Promise<any>{
    return new Promise((res, rej) => {
      this.api.post('usuarios', dados)
        .then((retorno: { authToken: string }) => {
          // Com o token de autenticação do backend, 
          //  logo no sistema de auth para receber token de acesso
          this.auth.logarViaAuthToken(retorno.authToken).then(() => {
            res(null);
          }).catch((err) => {
            res('falha-login');
          })
        })
        .catch((error) => {
          rej(error?.error)
        });
    });
  }

  /**
   * Realiza login via api do back-end
   * @param dados 
   */
  private logarPorApi(dados: IDadosLoginApi): Promise<void>{
    return new Promise((res, rej) => {
      this.api.post('logar', dados)
        .then((retorno: { authToken: string }) => {
          // Com o token de autenticação do backend, 
          //  logo no sistema de auth para receber token de acesso
          this.auth.logarViaAuthToken(retorno.authToken).then(() => {
            res();
          }).catch((err) => {
            rej(err);
          })
        })
        .catch((error) => {
          rej(error.error);
        });
    });
  }

  /**
   * Busca um usuário na api do Back-end
   */
  buscar(id: string): Promise<IUsuarioApi>{
    return new Promise((res, rej) => {
      this.api.get(`usuarios/${id}`)
        .then((retorno) => {
          res(retorno)
        })
        .catch((error) => {
          rej(error.error)
        });
    });
  }

  /**
   * Realiza requisição a api do back-end para atualizar dados do usuário de forma parcial
   * @param id 
   * @param dados 
   */
  atualizar(id: string, dados: IUsuarioAtualizarApi): Promise<any>{
    return new Promise((res, rej) => {
      this.api.patch(`usuarios/${id}`, dados)
        .then((retorno) => {
          res(retorno)
        })
        .catch((error) => {
          rej(error.error)
        });
    });
  }

  /**
   * Exclui um usuário na api do Back-end
   */
  excluir(id: string): Promise<void>{
    return new Promise((res, rej) => {
      this.api.delete(`usuarios/${id}`)
        .then(() => {
          res()
        })
        .catch((error) => {
          rej(error.error)
        });
    });
  }
}
