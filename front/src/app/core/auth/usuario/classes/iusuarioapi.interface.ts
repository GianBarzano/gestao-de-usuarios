import { IEnderecoApi } from "./ienderecoapi.interface";

export interface IUsuarioApi{
  id?: string;
  nome?: string;
  email?: string;
  cpf?: string;
  pis?: string;
  id_endereco?: string;
  objs?: {
      endereco?: IEnderecoApi
  }
}