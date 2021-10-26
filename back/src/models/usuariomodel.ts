import { IEndereco } from './enderecomodel';
import model, { IModelBuscarConfig, IModelCriarConfig, IModelAlterarConfig, IModelExcluirConfig } from './model';

export interface IUsuario{
    id?: string;
    nome?: string;
    email?: string;
    senha?: string;
    cpf?: string;
    pis?: string;
    id_endereco?: string;
    objs?: {
        endereco?: IEndereco
    }
}

class UsuarioModel {
    private tabela = 'usuarios';

    /**
     * Cria um usuario
     * @param usuario 
    */
    criar(usuario: IUsuario): Promise<IUsuario> {
        return new Promise((resolve, reject) => {
            // Defino parametros para criação do usuário
            const config: IModelCriarConfig = {
                tabela: this.tabela,
                params: []
            };
            config.params.push({coluna: 'id', valor: usuario.id});
            config.params.push({coluna: 'nome', valor: usuario.nome});
            config.params.push({coluna: 'email', valor: usuario.email});
            config.params.push({coluna: 'senha', valor: usuario.senha});
            config.params.push({coluna: 'cpf', valor: usuario.cpf});
            config.params.push({coluna: 'pis', valor: usuario.pis});
            config.params.push({coluna: 'id_endereco', valor: usuario.id_endereco});

            model.criar(config).then(() => {
                resolve(usuario);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * Altera um usuario
     * @param usuario 
    */
    alterar(usuario: IUsuario): Promise<IUsuario> {
        return new Promise((resolve, reject) => {
            // Defino parametros para criação do usuário
            const config: IModelAlterarConfig = {
                tabela: this.tabela,
                set: [],
                where: []
            };

            // Configuro set
            if (usuario.nome){
                config.set.push({coluna: 'nome', valor: usuario.nome});
            }
            if (usuario.email){
                config.set.push({coluna: 'email', valor: usuario.email});
            }
            if (usuario.senha){
                config.set.push({coluna: 'senha', valor: usuario.senha});
            }
            if (usuario.cpf != null){
                config.set.push({coluna: 'cpf', valor: usuario.cpf});
            }
            if (usuario.pis != null){
                config.set.push({coluna: 'pis', valor: usuario.pis});
            }
            if (usuario.id_endereco){
                config.set.push({coluna: 'id_endereco', valor: usuario.id_endereco});
            }
            
            // Configuro where
            config.where.push({coluna: 'id', valor: usuario.id});

            model.alterar(config).then(() => {
                resolve(usuario);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * Exclui um usuario
    */
    excluir(id: string): Promise<void>{
        return new Promise((resolve, reject) => {
            // Defino parametros para criação do usuário
            const config: IModelExcluirConfig = {
                tabela: this.tabela,
                where: []
            };
            // Configuro where
            config.where.push({coluna: 'id', valor: id});

            model.excluir(config).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * Busca um usuario por id
     * @param tabela 
    */
    buscar(id: string): Promise<IUsuario>{
        return new Promise((res, rej) => {
            this.buscarUsuarioPorColuna('id', id).then((retorno) => {
                res(retorno);
            }).catch((error) => {
                rej(error);
            });
        });
    }

    /**
     * Busca um usuario por cpf
     * @param tabela 
    */
    buscarPorCpf(cpf: string): Promise<IUsuario>{
        return new Promise((res, rej) => {
            this.buscarUsuarioPorColuna('cpf', cpf).then((retorno) => {
                res(retorno);
            }).catch((error) => {
                rej(error);
            });
        });
    }
    /**
     * Busca um usuario por Pis
     * @param tabela 
    */
    buscarPorPis(pis: string): Promise<IUsuario>{
        return new Promise((res, rej) => {
            this.buscarUsuarioPorColuna('pis', pis).then((retorno) => {
                res(retorno);
            }).catch((error) => {
                rej(error);
            });
        });
    }

    /**
     * Busca usuário por coluna identificadora
     * @param coluna 
     * @param valor 
     */
    private buscarUsuarioPorColuna(coluna: 'id' | 'cpf' | 'pis', valor: any): Promise<IUsuario>{
        return new Promise((res, rej) => {
            const config: IModelBuscarConfig = {
                tabela: this.tabela,
                colunas: ['id', 'nome', 'email', 'senha', 'cpf', 'pis', 'id_endereco'],
                where: [
                    { coluna: coluna, valor: valor }
                ]
            }
            
            model.buscar(config).then((usuarioBD: any) => {
                if (!usuarioBD) {
                    res(null);
                } else {
                    const usuario: IUsuario = {
                        id: usuarioBD.id,
                        nome: usuarioBD.nome,
                        email: usuarioBD.email,
                        senha: usuarioBD.senha,
                        cpf: usuarioBD.cpf,
                        pis: usuarioBD.pis,
                        id_endereco: usuarioBD.id_endereco
                    }
                    res(usuario);
                }
            }).catch((err) => {
                rej(err);
            });
        });
    }
}

const usuarioModel = new UsuarioModel();
export { usuarioModel };