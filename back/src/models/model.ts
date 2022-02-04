import bancoDados from "../database";

export interface IModelConfig {
    tabela: string;
}

export interface IModelColunaValor {
    coluna: string;
    valor: any;
}

export interface IModelCriarConfig extends IModelConfig {
    params: IModelColunaValor[];
}

export interface IModelListarConfig extends IModelConfig {
    limite: number;
    colunas: string[];
    where: IModelColunaValor[];
}

export interface IModelBuscarConfig extends IModelConfig {
    colunas: string[];
    where: IModelColunaValor[];
}

export interface IModelAlterarConfig extends IModelConfig {
    set: IModelColunaValor[];
    where: IModelColunaValor[];
}

export interface IModelExcluirConfig extends IModelConfig {
    where: IModelColunaValor[];
}

class Model {
    /**
     * Cria um registro no banco de dados
     * @param tabela 
     */
    criar(config: IModelCriarConfig = null): Promise<any>{
        return new Promise(async (res, rej) => {
            try {
                // Crio conexão
                const client = await bancoDados.getClient();

                try {
                    let colunas_nomes = '';
                    let colunas_params = '';
                    let params_values: any[] = [];

                    config.params.forEach((param, index) => {
                        if (index > 0) {
                            colunas_nomes += ', ';
                            colunas_params += ', ';
                        }

                        colunas_nomes += param.coluna;
                        colunas_params += `$${index + 1}`;

                        params_values.push(param.valor);
                    })

                    // Monto sql
                    let sql = '';
                    sql += `insert into ${config.tabela}(${colunas_nomes}) `;
                    sql += `values(${colunas_params})`;

                    const retorno = await client.query(sql, params_values);

                    res(retorno);
                } catch (error) {
                    rej(error);
                } finally {
                    bancoDados.releaseClient();
                }
            } catch (error) {
                rej(error);
            }
        });
    }
    /**
     * Altera um registro no banco de dados
     * @param config 
     */
    alterar(config: IModelAlterarConfig): Promise<any>{
        return new Promise(async (res, rej) => {
            try {
                // Crio conexão
                const client = await bancoDados.getClient();

                try {
                    let where_string = '';
                    let set_string = '';
                    let params_values: any[] = [];
                    let paramNum = 1;

                    // Configuro Where
                    config.where.forEach((param, index) => {
                        if (index > 0) {
                            where_string += ', ';
                        }

                        where_string += `${param.coluna} = $${paramNum}`;
                        params_values.push(param.valor);
                        // Incremento numero do parametro atual
                        paramNum++;
                    });

                    // Configuro Set
                    config.set.forEach((param, index) => {
                        if (index > 0) {
                            set_string += ', ';
                        }

                        set_string += `${param.coluna} = $${paramNum}`;
                        params_values.push(param.valor);
                        // Incremento numero do parametro atual
                        paramNum++;
                    })

                    // Monto sql
                    let sql = '';
                    sql += `update ${config.tabela} `;
                    sql += `set ${set_string} `;
                    sql += `where ${where_string};`;

                    await client.query(sql, params_values);
                    res(null);
                } catch (error) {
                    rej(error);
                } finally {
                    bancoDados.releaseClient();
                }
            } catch (error) {
                rej(error);
            }
        });
    }
    /**
     * Exclui um registro no banco de dados
     * @param tabela 
     */
    excluir(config: IModelExcluirConfig): Promise<void>{
        return new Promise(async (res, rej) => {
            try {
                // Crio conexão
                const client = await bancoDados.getClient();

                try {
                    let where_string = '';
                    let params_values: any[] = [];

                    config.where.forEach((param, index) => {
                        if (index > 0) {
                            where_string += ', ';
                        }

                        where_string += `${param.coluna} = $${index + 1}`;
                        params_values.push(param.valor);
                    })

                    // Monto sql
                    let sql = '';
                    sql += `delete from ${config.tabela} `;
                    sql += `where ${where_string};`;

                    const retorno = await client.query(sql, params_values);
                    res();
                } catch (error) {
                    rej(error);
                } finally {
                    bancoDados.releaseClient();
                }
            } catch (error) {
                rej(error);
            }
        });
    }
    /**
     * Busca um registro do banco de dados
     * @param config 
     */
    buscar(config: IModelBuscarConfig): Promise<any>{
        return new Promise(async (res, rej) => {
            try {
                // Crio conexão
                const client = await bancoDados.getClient();

                try {
                    let where_string = '';
                    let params_values: any[] = [];

                    config.where.forEach((param, index) => {
                        if (index > 0) {
                            where_string += ', ';
                        }

                        where_string += `${param.coluna} = $${index + 1}`;
                        params_values.push(param.valor);
                    })

                    // Monto sql
                    let sql = '';
                    sql += `select ${config.colunas.toString()} `;
                    sql += `from ${config.tabela} `;
                    sql += `where ${where_string} `;
                    sql += `limit 1;`;

                    const retorno = await client.query(sql, params_values);
                    if (retorno.rowCount == 0) {
                        res(null);
                    } else {
                        res(retorno.rows[0]);
                    }
                } catch (error) {
                    rej(error);
                } finally {
                    bancoDados.releaseClient();
                }
            } catch (error) {
                rej(error);
            }
        });
    }
    /**
     * Busca um registro do banco de dados
     * @param config 
     */
    listar(config: IModelListarConfig): Promise<any>{
        return new Promise(async (res, rej) => {
            try {
                // Crio conexão
                const client = await bancoDados.getClient();

                try {
                    let where_string = '';
                    let params_values: any[] = [];

                    config.where.forEach((param, index) => {
                        if (index > 0) {
                            where_string += ', ';
                        }

                        where_string += `${param.coluna} = $${index + 1}`;
                        params_values.push(param.valor);
                    })

                    // Monto sql
                    let sql = '';
                    sql += `select ${config.colunas.toString()} `;
                    sql += `from ${config.tabela} `;
                    sql += `where ${where_string} `;
                    if (config.limite > 0) {
                        sql += `limit ${config.limite}`;
                    }
                    sql += ';'

                    const retorno = await client.query(sql, params_values);
                    console.log("Retorno", retorno);
                    if (retorno.rowCount == 0) {
                        res([]);
                    } else {
                        res(retorno.rows);
                    }
                } catch (error) {
                    rej(error);
                } finally {
                    bancoDados.releaseClient();
                }
            } catch (error) {
                rej(error);
            }
        });
    }
}

const model = new Model();
export default model;