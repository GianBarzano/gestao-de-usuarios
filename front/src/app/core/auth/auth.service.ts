import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged } from "firebase/auth";
import { environment } from 'src/environments/environment';

const firebaseConfig = {
  apiKey: environment.firebaseApiKey,
  authDomain: environment.firebaseAuthDomain,
  projectId: environment.firebaseProjectId,
  storageBucket: environment.firebaseStorageBucket,
  messagingSenderId: environment.firebaseMessagingSenderId,
  appId: environment.firebaseAppId,
  measurementId: environment.firebaseMeasurementId
};

@Injectable()
export class AuthService {
  private _iniciado: boolean = false;
  private _logado: boolean = false;
  /**
   * Dados de acesso do usuário
   */
  dadosUsuario: IDadosUsuario | null = null;

  constructor(
    private router: Router
  ) {}
  
  /**
   * Retorna se o usuário está logado
   */
  get logado(): boolean {
    return this._logado;
  }

  /**
   * Retorna se a autenticação já foi iniciada
   */
  get iniciado(): boolean {
    return this._iniciado;
  }

  /**
   * Adiciona Header Authentication ao Header passado.
   * @param header 
   */
  addAuthHeader(header: any = {}): Promise<any> {
    return new Promise(async (res, rej) => {
      if (!header) {
        header = {};
      }
      
      const auth = getAuth();
      if (auth.currentUser != null) {
        const access_token = await auth.currentUser.getIdToken();
        header['Authorization'] = `Bearer ${access_token}`;
      }

      res(header);
    })
  }

  /**
   * Salva dados do usuario
   * @param dados 
   */
  private salvarDadosUsuario(dados: IDadosUsuario){
    this._logado = true;
    this.dadosUsuario = dados;
    this.dadosUsuario.primeironome = dados.nome.split(' ')[0];
  }

  /**
   * Atualiza nome nos dados de acesso
   */
  set dadosAcessoUsuarioNome(nome: any){
    this.dadosUsuario!.nome = nome;
  }
  /**
   * Atualiza email nos dados de acesso
   */
  set dadosAcessoUsuarioEmail(email: any){
    this.dadosUsuario!.email = email;
  }

  /**
   * Inicia estado de autenticação
   */
  iniciar(): Promise<void>{
    return new Promise((resolve, rej) => {
      if (this.iniciado) {
        resolve();
      }

      // Inicializo firebase
      const app = initializeApp(firebaseConfig);
      const auth = getAuth();
      const fnAuth = (usuario: any) => {
        if (usuario) {
          this.salvarDadosUsuario({
            email: <string>usuario.email,
            nome: <string>usuario.displayName,
            userid: usuario.uid
          });
        }

        this._iniciado = true;
        resolve();
      }
      onAuthStateChanged(auth, fnAuth);
    })
  }

  /**
   * Desloga o usuário do sistema
   */
  deslogar(redirecionar = true): Promise<void>{
    return new Promise(async (res, rej) => {
      try {
        const auth = getAuth();

        if (auth.currentUser != null) {
          await signOut(auth);
        }

        this._logado = false;
        
        if (redirecionar) {
          // Redireciono para tela inicial
          this.router.navigate(['login']);
        }

        res();
      } catch (error) {
        rej(error);
      }
    })
  }

  /**
   * Realiza login via token de autenticação gerado pelo back-end
   * @param authToken 
   */
  logarViaAuthToken(authToken: string): Promise<void>{
    return new Promise((resolve, reject) => {
      // Realiza login no firebase utilizando token de autenticação
      const auth = getAuth();
      signInWithCustomToken(auth, authToken)
        .then((userCredential: any) => {
          // Signed in
          const user = userCredential.user;
          
          // Salvo dados do usuario
          this.salvarDadosUsuario({
            nome: user.displayName,
            email: user.email,
            userid: user.uid
          });
          
          // Retorno sucesso
          resolve();
        })
        .catch((error: any) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          reject(error)
        });
    })
  }

  /**
   * Realiza login via e-mail e senha
   * @param email 
   * @param senha 
   */
  logarViaEmailESenha(email: string, senha: string): Promise<void>{
    return new Promise((resolve, reject) => {

      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential:  any) => {
          const user = userCredential.user;
          
          // Salvo dados do usuario
          this.salvarDadosUsuario({
            nome: user.displayName,
            email: user.email,
            userid: user.uid
          });
          
          // Retorno sucesso
          resolve();
        })
        .catch((error: any) => {
          const errorCode = error.code;
          if (errorCode == 'auth/wrong-password') {
            error.message = 'Senha incorreta!';
          } else if (errorCode == 'auth/invalid-email') {
            error.message = 'E-mail inválido!';
          } else if (errorCode == 'auth/user-not-found') {
            error.message = 'Usuário não encontrado!';
          } else {
            error.message = '';
          }
          reject(error)
        });
    })
  }
}

export interface IDadosUsuario {
  userid: string;
  nome: string;
  email: string;
  primeironome?: string;
}