export enum ETipoLogin {
  tlPorEmail
}

export interface IDadosLoginEmail {
  email: string;
  senha: string;
}

export interface IDadosLogin extends IDadosLoginEmail{}