export enum ETipoLogin {
  tlPorEmail,
  tlPorCpf,
  tlPorPis
}

export interface IDadosLoginEmail {
  email: string;
  senha: string;
}

export interface IDadosLoginCpf {
  cpf: string;
  senha: string;
}

export interface IDadosLoginPis {
  pis: string;
  senha: string;
}

export interface IDadosLogin extends IDadosLoginEmail, IDadosLoginCpf, IDadosLoginPis {}

export interface IDadosLoginApi {
  tipo: 'cpf' | 'pis',
  cpf?: string;
  pis?: string;
  senha: string;
}