import { test, expect, beforeAll, afterEach, jest } from '@jest/globals';
import { mocked } from 'ts-jest/utils';
import bancoDados from '../../../../src/database';
import model, { IModelAlterarConfig, IModelBuscarConfig, IModelCriarConfig, IModelExcluirConfig } from '../../../../src/models/model';

// Realizo mock do modulo de banco de dados
jest.mock('../../../../src/database');

const bancoDadosGetClient = <any>mocked(bancoDados.getClient);
const bancoDadosClient: any = {
  query: jest.fn<any, any>()
};

beforeAll(() => {
  bancoDadosGetClient.mockImplementation(() => Promise.resolve(bancoDadosClient));
  bancoDadosClient.query.mockImplementation((sql, params) => Promise.resolve({
    rowCount: 0,
    rows: []
  }));
})

afterEach(() => {
  bancoDadosGetClient.mockClear();
  bancoDadosClient.query.mockClear();
})

test('Criar', () => {
  const dados = {
    id: '0001',
    nome: 'Registro de mock'
  }
  const config: IModelCriarConfig = {
    tabela: 'tb_mocks',
    params: []
  };
  config.params.push({ coluna: 'id', valor: dados.id });
  config.params.push({ coluna: 'nome', valor: dados.nome });

  const sqlEsperado = 'insert into tb_mocks(id, nome) values($1, $2)';

  return model.criar(config).then(() => {
    expect(bancoDadosGetClient).toHaveBeenCalledTimes(1);
    expect(bancoDadosClient.query).toHaveBeenCalledTimes(1);
    const bancoDadosClientArgs = bancoDadosClient.query.mock.calls[0];
    expect(bancoDadosClientArgs.length).toBe(2);
    // SQL
    expect(bancoDadosClientArgs[0]).toBe(sqlEsperado);
    // Parametros
    expect(bancoDadosClientArgs[1].length).toBe(2);
    expect(bancoDadosClientArgs[1][0]).toBe(dados.id);
    expect(bancoDadosClientArgs[1][1]).toBe(dados.nome);
  });
})

test('Alterar', () => {
  const dados = {
    id: '0001',
    nome: 'Registro de mock'
  }
  const config: IModelAlterarConfig = {
    tabela: 'tb_mocks',
    set: [],
    where: []
  };
  config.set.push({coluna: 'nome', valor: dados.nome});
  config.where.push({ coluna: 'id', valor: dados.id });

  const sqlEsperado = 'update tb_mocks set nome = $2 where id = $1;';

  return model.alterar(config).then(() => {
    expect(bancoDadosGetClient).toHaveBeenCalledTimes(1);
    expect(bancoDadosClient.query).toHaveBeenCalledTimes(1);
    const bancoDadosClientArgs = bancoDadosClient.query.mock.calls[0];
    expect(bancoDadosClientArgs.length).toBe(2);
    // SQL
    expect(bancoDadosClientArgs[0]).toBe(sqlEsperado);
    // Parametros
    expect(bancoDadosClientArgs[1].length).toBe(2);
    expect(bancoDadosClientArgs[1][0]).toBe(dados.id);
    expect(bancoDadosClientArgs[1][1]).toBe(dados.nome);
  });
})

test('Excluir', () => {
  const dados = {
    id: '0001'
  }
  const config: IModelExcluirConfig = {
    tabela: 'tb_mocks',
    where: []
  };
  config.where.push({ coluna: 'id', valor: dados.id });

  const sqlEsperado = 'delete from tb_mocks where id = $1;';

  return model.excluir(config).then(() => {
    expect(bancoDadosGetClient).toHaveBeenCalledTimes(1);
    expect(bancoDadosClient.query).toHaveBeenCalledTimes(1);
    const bancoDadosClientArgs = bancoDadosClient.query.mock.calls[0];
    expect(bancoDadosClientArgs.length).toBe(2);
    // SQL
    expect(bancoDadosClientArgs[0]).toBe(sqlEsperado);
    // Parametros
    expect(bancoDadosClientArgs[1].length).toBe(1);
    expect(bancoDadosClientArgs[1][0]).toBe(dados.id);
  });
})

test('Buscar', () => {
  const dados = {
    id: '0001'
  }
  const config: IModelBuscarConfig = {
    tabela: 'tb_mocks',
    colunas: ['id', 'nome'],
    where: []
  };
  config.where.push({ coluna: 'id', valor: dados.id });

  const sqlEsperado = 'select id,nome from tb_mocks where id = $1 limit 1;';

  return model.buscar(config).then(() => {
    expect(bancoDadosGetClient).toHaveBeenCalledTimes(1);
    expect(bancoDadosClient.query).toHaveBeenCalledTimes(1);
    const bancoDadosClientArgs = bancoDadosClient.query.mock.calls[0];
    expect(bancoDadosClientArgs.length).toBe(2);
    // SQL
    expect(bancoDadosClientArgs[0]).toBe(sqlEsperado);
    // Parametros
    expect(bancoDadosClientArgs[1].length).toBe(1);
    expect(bancoDadosClientArgs[1][0]).toBe(dados.id);
  });
})