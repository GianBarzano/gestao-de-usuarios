import model, { IModelAlterarConfig, IModelBuscarConfig, IModelCriarConfig, IModelExcluirConfig } from "./model";

export interface IEndereco{
    id?: string;
    pais?: string;
    estado?: string;
    municipio?: string;
    cep?: string;
    rua?: string;
    numero?: string;
    complemento?: string;
}

class EnderecoModel {
    private tabela = 'enderecos';

    /**
     * Cria um endereço
     * @param endereco 
    */
    async criar(endereco: IEndereco): Promise<IEndereco> {
        return new Promise((resolve, reject) => {
            // Defino parametros para criação do usuário
            const config: IModelCriarConfig = {
                tabela: this.tabela,
                params: []
            };
            
            config.params.push({coluna: 'id', valor: endereco.id});
            config.params.push({coluna: 'pais', valor: endereco.pais});
            config.params.push({coluna: 'estado', valor: endereco.estado});
            config.params.push({coluna: 'municipio', valor: endereco.municipio});
            config.params.push({coluna: 'cep', valor: endereco.cep});
            config.params.push({coluna: 'rua', valor: endereco.rua});
            config.params.push({coluna: 'numero', valor: endereco.numero});
            config.params.push({coluna: 'complemento', valor: endereco.complemento});

            model.criar(config).then(() => {
                resolve(endereco);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * Altera um endereço
     * @param endereco 
    */
    alterar(endereco: IEndereco): Promise<IEndereco> {
        return new Promise((resolve, reject) => {
            // Defino parametros para criação do usuário
            const config: IModelAlterarConfig = {
                tabela: this.tabela,
                set: [],
                where: []
            };

            // Configuro set
            if (endereco.pais){
                config.set.push({coluna: 'pais', valor: endereco.pais});
            }
            if (endereco.estado){
                config.set.push({coluna: 'estado', valor: endereco.estado});
            }
            if (endereco.municipio){
                config.set.push({coluna: 'municipio', valor: endereco.municipio});
            }
            if (endereco.cep){
                config.set.push({coluna: 'cep', valor: endereco.cep});
            }
            if (endereco.rua){
                config.set.push({coluna: 'rua', valor: endereco.rua});
            }
            if (endereco.numero){
                config.set.push({coluna: 'numero', valor: endereco.numero});
            }
            if (endereco.complemento){
                config.set.push({coluna: 'complemento', valor: endereco.complemento});
            }
            
            // Configuro where
            config.where.push({coluna: 'id', valor: endereco.id});

            model.alterar(config).then(() => {
                resolve(endereco);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * Exclui um endereço
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
     * Busca um endereço
     * @param id 
     */
    buscar(id: string): Promise<IEndereco>{
        return new Promise((res, rej) => {
            const config: IModelBuscarConfig = {
                tabela: this.tabela,
                colunas: [
                    'id', 'pais', 'estado', 'municipio', 'cep', 
                    'rua', 'numero', 'complemento'
                ],
                where: [
                    { coluna: 'id', valor: id }
                ]
            }
            
            model.buscar(config).then((enderecoBD: any) => {
                if (!enderecoBD) {
                    res(null);
                } else {
                    const endereco: IEndereco = {
                        id: enderecoBD.id,
                        pais: enderecoBD.pais,
                        estado: enderecoBD.estado,
                        municipio: enderecoBD.municipio,
                        cep: enderecoBD.cep,
                        rua: enderecoBD.rua,
                        numero: enderecoBD.numero,
                        complemento: enderecoBD.complemento
                    }
                    
                    res(endereco);
                }
            }).catch((err) => {
                rej(err);
            });
        });
    }
}

const enderecoModel = new EnderecoModel();
export { enderecoModel };