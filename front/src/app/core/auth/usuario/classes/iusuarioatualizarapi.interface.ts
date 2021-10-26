export interface IUsuarioAtualizarEnderecoApi {
  endereco?: {
    pais?: string;
    estado?: string;
    municipio?: string;
    cep?: string;
    rua?: string;
    numero?: string;
    complemento?: string;
  }
}

export interface IUsuarioAtualizarNomeApi {
  nome?: string;
}

export interface IUsuarioAtualizarEmailApi {
  email?: string;
}

export interface IUsuarioAtualizarSenhaApi {
  senha?: string;
  senhaatual?: string;
}

export interface IUsuarioAtualizarDocIdApi {
  cpf?: string;
  pis?: string;
}

export interface IUsuarioAtualizarTudoApi extends 
  IUsuarioAtualizarNomeApi,
  IUsuarioAtualizarEmailApi,
  IUsuarioAtualizarSenhaApi,
  IUsuarioAtualizarDocIdApi,
  IUsuarioAtualizarEnderecoApi {};

export type IUsuarioAtualizarApi = IUsuarioAtualizarTudoApi 
  | IUsuarioAtualizarNomeApi
  | IUsuarioAtualizarEmailApi
  | IUsuarioAtualizarSenhaApi
  | IUsuarioAtualizarDocIdApi
  | IUsuarioAtualizarEnderecoApi;