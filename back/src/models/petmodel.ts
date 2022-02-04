import { IEndereco } from './enderecomodel';
import model, { IModelBuscarConfig, IModelCriarConfig, IModelAlterarConfig, IModelExcluirConfig, IModelListarConfig } from './model';
import { IUsuario } from './usuariomodel';

export interface IPet {
    id?: string;
    nome?: string;
    nascimento?: Date;
    porte?: EPetPorte;
    sexo?: EPetSexo;
    raca?: string;
    especie?: EPetEspecie;
    id_usuario?: string;
    /**
     * Calculado no momento das consultas
     */
    distancia?: number;
    objs?: {
        usuario?: IUsuario
    }
}

export enum EPetPorte {
    PEQUENO = 1,
    MEDIO = 2,
    GRANDE = 3
}

export enum EPetSexo {
    MACHO = 1,
    FEMEA = 2
}

export enum EPetEspecie {
    CANINA = 1,
    FELINA = 2
}

class PetModel {
    private tabela = 'pets';

    /**
     * Cria um pet
     * @param pet 
    */
    criar(pet: IPet): Promise<IPet> {
        return new Promise((resolve, reject) => {
            // Defino parametros para criação do usuário
            const config: IModelCriarConfig = {
                tabela: this.tabela,
                params: []
            };
            config.params.push({coluna: 'id', valor: pet.id});
            config.params.push({coluna: 'nome', valor: pet.nome});
            config.params.push({coluna: 'nascimento', valor: pet.nascimento});
            config.params.push({coluna: 'porte', valor: pet.porte});
            config.params.push({coluna: 'sexo', valor: pet.sexo});
            config.params.push({coluna: 'especie', valor: pet.especie});
            config.params.push({coluna: 'raca', valor: pet.raca});
            config.params.push({coluna: 'id_usuario', valor: pet.id_usuario});

            model.criar(config).then(() => {
                resolve(pet);
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
     * Busca um pet por id
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
     * Busca pet por coluna identificadora
     * @param coluna 
     * @param valor 
     */
    private buscarUsuarioPorColuna(coluna: string, valor: any): Promise<IUsuario>{
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

    /**
     * Lista pets do usuário
     * @param coluna 
     * @param valor 
     */
    listarPorUsuario(id_usuario: string): Promise<IUsuario>{
        return new Promise((res, rej) => {
            const config: IModelListarConfig = {
                tabela: this.tabela,
                colunas: ['id', 'nome', 'nascimento', 'porte', 'sexo', 'especie', 'raca'],
                where: [
                    { coluna: 'id_usuario', valor: id_usuario }
                ],
                limite: 2
            }
            
            model.listar(config).then((listaBD: any) => {
                if (!listaBD) {
                    res(null);
                } else {
                    // const usuario: IUsuario = {
                    //     id: usuarioBD.id,
                    //     nome: usuarioBD.nome,
                    //     email: usuarioBD.email,
                    //     senha: usuarioBD.senha,
                    //     cpf: usuarioBD.cpf,
                    //     pis: usuarioBD.pis,
                    //     id_endereco: usuarioBD.id_endereco
                    // }
                    res(listaBD);
                }
            }).catch((err) => {
                rej(err);
            });
        });
    }
}

const petModel = new PetModel();
export { petModel };