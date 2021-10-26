import { test, describe, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { mocked } from 'ts-jest/utils';
import { usuarioCtrl } from '../../../../src/controllers/usuariocontroller';
import { enderecoModel, IEndereco } from '../../../../src/models/enderecomodel';
import firebaseModel from '../../../../src/models/firebasemodel';
import { IUsuario, usuarioModel } from '../../../../src/models/usuariomodel';
import bancoDados from '../../../../src/database';
import { validarCEP, validarCPF, validarEmail, validarPIS } from '../../../../src/utils';

// Realizo mock do modulo de model do usuário
jest.mock('../../../../src/models/usuariomodel');
// Realizo mock do modulo de model do endereço
jest.mock('../../../../src/models/enderecomodel');
// Realizo mock do modulo de firebase
jest.mock('../../../../src/models/firebasemodel');
// Realizo mock do modulo de banco de dados
jest.mock('../../../../src/database');
// Realizo mock do modulo de utilidades
jest.mock('../../../../src/utils');

const response = {
  status: jest.fn<any, any>(),
  send: jest.fn<any, any>()
}

const bancoDadosGetClient = <any>mocked(bancoDados.getClient);
const bancoDadosInitTransaction = <any>mocked(bancoDados.initTransaction);
const bancoDadosCommitTransaction = <any>mocked(bancoDados.commitTransaction);
const bancoDadosRollbackTransaction = <any>mocked(bancoDados.rollbackTransaction);
const bancoDadosClient: any = {};
const bancoDadosTransactionId = 'transaction1234';

const utilsValidarCPF = <any>mocked(validarCPF);
const utilsValidarPIS = <any>mocked(validarPIS);
const utilsValidarEmail = <any>mocked(validarEmail);
const utilsValidarCEP = <any>mocked(validarCEP);

const usuarioModelCriar = <any>mocked(usuarioModel.criar);
const usuarioModelAlterar = <any>mocked(usuarioModel.alterar);
const usuarioModelExcluir = <any>mocked(usuarioModel.excluir);
const usuarioModelBuscar = <any>mocked(usuarioModel.buscar);
const usuarioModelBuscarCpf = <any>mocked(usuarioModel.buscarPorCpf);
const usuarioModelBuscarPis = <any>mocked(usuarioModel.buscarPorPis);
const usuarioRetornoModel: IUsuario = {
  id: 'idusuario',
  nome: 'Jane Doe',
  email: 'jane.doe@gmail.com',
  cpf: '97762224041',
  pis: '30393346228',
  senha: '$2a$10$pBgLzULsnQ/NU2qWZjzKFu0diDDhJqWLQR4h8Us8qAo6ZxiPwJQwa'
}
/**
 * Senha antes da encriptação, 
 * equivalente a senha encriptada no usuarioRetornoModel
 */
const usuarioRetornoModelSenhaPreHash = '112233';

const enderecoModelCriar = <any>mocked(enderecoModel.criar);
const enderecoModelAlterar = <any>mocked(enderecoModel.alterar);
const enderecoModelExcluir = <any>mocked(enderecoModel.excluir);
const enderecoModelBuscar = <any>mocked(enderecoModel.buscar);
const enderecoRetornoModel: IEndereco = {
  id: 'idendereco',
  cep: '12345678',
  complemento: 'BL 4 APT 510',
  estado: 'SP',
  municipio: 'São Paulo',
  numero: '4',
  pais: 'BRASIL',
  rua: 'Av. Paulista'
}

const firebaseModelBuscarPorEmail = <any>mocked(firebaseModel.buscarUsuarioPorEmail);
const firebaseModelCriarCustomToken = <any>mocked(firebaseModel.criarCustomToken);
const firebaseModelCustomToken = 'customtoken';

beforeAll(() => {
  // Antes de todos os testes, crio mock das funções
  // Response
  response.status.mockImplementation((codigo) => response);
  response.send.mockImplementation((dados) => response);
  // Banco de dados
  bancoDadosGetClient.mockImplementation(() => Promise.resolve(bancoDadosClient));
  bancoDadosInitTransaction.mockImplementation((cpf) => Promise.resolve([
    bancoDadosTransactionId, bancoDadosClient
  ]));
  bancoDadosCommitTransaction.mockImplementation((cpf) => Promise.resolve());
  bancoDadosRollbackTransaction.mockImplementation((cpf) => Promise.resolve());
  // Útils
  utilsValidarCPF.mockImplementation((cpf) => true);
  utilsValidarPIS.mockImplementation((pis) => true);
  utilsValidarEmail.mockImplementation((email) => true);
  utilsValidarCEP.mockImplementation((email) => true);
  // Model de usuário
  usuarioModelCriar.mockImplementation((usuario: IUsuario) => Promise.resolve(usuario));
  usuarioModelAlterar.mockImplementation((usuario: IUsuario) => Promise.resolve(usuario));
  usuarioModelExcluir.mockImplementation((id: string) => Promise.resolve());
  usuarioModelBuscar.mockImplementation((id: string) => Promise.resolve(usuarioRetornoModel));
  usuarioModelBuscarCpf.mockImplementation((cpf: string) => Promise.resolve(usuarioRetornoModel));
  usuarioModelBuscarPis.mockImplementation((pis: string) => Promise.resolve(usuarioRetornoModel));
  // Model de endereço
  enderecoModelCriar.mockImplementation((endereco: IEndereco) => Promise.resolve(endereco)); 
  enderecoModelAlterar.mockImplementation((endereco: IEndereco) => Promise.resolve(endereco));
  enderecoModelExcluir.mockImplementation((id: string) => Promise.resolve());
  enderecoModelBuscar.mockImplementation((id: string) => Promise.resolve(enderecoRetornoModel));
  // Model do firebase
  firebaseModelBuscarPorEmail.mockImplementation((email: string) => Promise.reject());
  firebaseModelCriarCustomToken.mockImplementation((usuarioId: string) => Promise.resolve(firebaseModelCustomToken));
});

afterEach(() => {
  // Response
  response.status.mockClear();
  response.send.mockClear();
  // Banco de dados
  bancoDadosGetClient.mockClear();
  bancoDadosInitTransaction.mockClear();
  bancoDadosCommitTransaction.mockClear();
  bancoDadosRollbackTransaction.mockClear();
  // Útils
  utilsValidarCPF.mockClear();
  utilsValidarPIS.mockClear();
  utilsValidarEmail.mockClear();
  utilsValidarCEP.mockClear();
  // Model de usuário
  usuarioModelCriar.mockClear();
  usuarioModelAlterar.mockClear();
  usuarioModelExcluir.mockClear();
  usuarioModelBuscar.mockClear();
  usuarioModelBuscarCpf.mockClear();
  usuarioModelBuscarPis.mockClear();
  // Model de endereço
  enderecoModelCriar.mockClear();
  enderecoModelAlterar.mockClear();
  enderecoModelExcluir.mockClear();
  enderecoModelBuscar.mockClear();
  // Model do firebase
  firebaseModelBuscarPorEmail.mockClear();
  firebaseModelCriarCustomToken.mockClear();
})

describe('Criar', () => {
  const firebaseModelCriar = <any>mocked(firebaseModel.criarUsuario);

  beforeAll(() => {
    // Antes de todos os testes, crio mock das funções utilizadas dentro da função de excluir
    firebaseModelCriar.mockImplementation((dados: any) => Promise.resolve({...dados}));
  });

  test('Retornar 400: Nome não preenchido', () => {
    // Realizo chamada a função
    let request: any = {
      body: {}
    };
    
    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Nome não preenchido.');
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).not.toHaveBeenCalled();
      // Model do firebase de buscar  usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).not.toHaveBeenCalled();
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar custom token não deve ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400: Nome com menos de 2 caracteres', () => {
    // Realizo chamada a função
    let request: any = {
      body: {
        nome: 'A'
      }
    };
    
    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Nome deve ter pelo menos 2 caracteres.');
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).not.toHaveBeenCalled();
      // Model do firebase de buscar  usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).not.toHaveBeenCalled();
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar custom token não deve ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400: Nome com mais de 50 caracteres', () => {
    // Realizo chamada a função
    let request: any = {
      body: {
        nome: 'A123456789B123456789C123456789D123456789E123456789F'
      }
    };
    
    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Nome deve até 50 caracteres.');
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).not.toHaveBeenCalled();
      // Model do firebase de buscar  usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).not.toHaveBeenCalled();
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar custom token não deve ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400: Senha não preenchida', () => {
    // Realizo chamada a função
    let request: any = {
      body: {
        nome: 'AB'
      }
    };
    
    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Senha não preenchida.');
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).not.toHaveBeenCalled();
      // Model do firebase de buscar  usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).not.toHaveBeenCalled();
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar custom token não deve ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400: Senha com menos de 6 caracteres', () => {
    // Realizo chamada a função
    let request: any = {
      body: {
        nome: 'AB',
        senha: '12345'
      }
    };
    
    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Senha deve ter pelo menos 6 caracteres.');
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).not.toHaveBeenCalled();
      // Model do firebase de buscar  usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).not.toHaveBeenCalled();
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar custom token não deve ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400: Senha com mais de 12 caracteres', () => {
    // Realizo chamada a função
    let request: any = {
      body: {
        nome: 'AB',
        senha: '0123456789123'
      }
    };
    
    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Senha deve até 12 caracteres.');
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).not.toHaveBeenCalled();
      // Model do firebase de buscar  usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).not.toHaveBeenCalled();
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar custom token não deve ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400: E-mail não preenchido', () => {
    // Realizo chamada a função
    let request: any = {
      body: {
        nome: 'AB',
        senha: '123456'
      }
    };
    
    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('E-mail não preenchido.');
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).not.toHaveBeenCalled();
      // Model do firebase de buscar  usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).not.toHaveBeenCalled();
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar custom token não deve ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400: E-mail com mais de 50 caracteres', () => {
    // Realizo chamada a função
    let request: any = {
      body: {
        nome: 'AB',
        senha: '123456',
        email: 'A123456789B123456789C123456789D123456789E123456789F'
      }
    };
    
    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('E-mail deve até 50 caracteres.');
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).not.toHaveBeenCalled();
      // Model do firebase de buscar  usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).not.toHaveBeenCalled();
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar custom token não deve ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400: E-mail inválido', () => {
    // Realizo chamada a função
    let request: any = {
      body: {
        nome: 'AB',
        senha: '123456',
        email: 'ABCDEF'
      }
    };
    
    // Defino que função de validação de e-mail retorne false
    utilsValidarEmail.mockImplementationOnce((email: string) => false);

    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('E-mail inválido.');
      // Mock Validacao por E-mail
      expect(utilsValidarEmail).toHaveBeenCalledTimes(1);
      const utilsValidarEmailArgs = utilsValidarEmail.mock.calls[0];
      expect(utilsValidarEmailArgs.length).toBe(1);
      expect(utilsValidarEmailArgs[0]).toBe(request.body.email);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).not.toHaveBeenCalled();
      // Model do firebase de buscar  usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).not.toHaveBeenCalled();
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar custom token não deve ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400: E-mail já utilizado', () => {
    // Realizo chamada a função
    let request: any = {
      body: {
        nome: 'AB',
        senha: '123456',
        email: 'ABCDEF'
      }
    };

    // Defino que existe usuario no firebase com esse e-mail
    firebaseModelBuscarPorEmail.mockImplementationOnce((email: string) => Promise.resolve({
      uid: usuarioRetornoModel.id,
      displayName: usuarioRetornoModel.nome,
      email: usuarioRetornoModel.email
    }));

    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Já existe uma conta com esse endereço de e-mail');
      // Mock Validacao por E-mail
      expect(utilsValidarEmail).toHaveBeenCalledTimes(1);
      const utilsValidarEmailArgs = utilsValidarEmail.mock.calls[0];
      expect(utilsValidarEmailArgs.length).toBe(1);
      expect(utilsValidarEmailArgs[0]).toBe(request.body.email);
      // Model do firebase de buscar  usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).toHaveBeenCalledTimes(1);
      const firebaseModelBuscarPorEmailArgs = firebaseModelBuscarPorEmail.mock.calls[0];
      expect(firebaseModelBuscarPorEmailArgs.length).toBe(1);
      expect(firebaseModelBuscarPorEmailArgs[0]).toBe(request.body.email);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar custom token não deve ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 201: Criar conta', () => {
    // Realizo chamada a função
    const body = {
      nome: 'AB',
      senha: '123456',
      email: 'ABCDEF'
    };
    let request: any = {
      body: { ...body }
    };

    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 201
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(201);
      // Mock Validacao por E-mail
      expect(utilsValidarEmail).toHaveBeenCalledTimes(1);
      const utilsValidarEmailArgs = utilsValidarEmail.mock.calls[0];
      expect(utilsValidarEmailArgs.length).toBe(1);
      expect(utilsValidarEmailArgs[0]).toBe(body.email);
      // Model do firebase de buscar  usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).toHaveBeenCalledTimes(1);
      const firebaseModelBuscarPorEmailArgs = firebaseModelBuscarPorEmail.mock.calls[0];
      expect(firebaseModelBuscarPorEmailArgs.length).toBe(1);
      expect(firebaseModelBuscarPorEmailArgs[0]).toBe(body.email);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).toHaveBeenCalledTimes(1);
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).toHaveBeenCalledTimes(1);
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).toHaveBeenCalledTimes(1);
      const usuarioModelCriarArgs = usuarioModelCriar.mock.calls[0];
      expect(usuarioModelCriarArgs.length).toBe(1);
      expect(usuarioModelCriarArgs[0]).toBeDefined();
      expect(usuarioModelCriarArgs[0].id).toBeDefined();
      expect(usuarioModelCriarArgs[0].nome).toBe(body.nome);
      expect(usuarioModelCriarArgs[0].email).toBe(body.email);
      expect(usuarioModelCriarArgs[0].senha).toBeDefined();
      const novoIdUsuario = usuarioModelCriarArgs[0].id;
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).toHaveBeenCalledTimes(1);
      const firebaseModelCriarArgs = firebaseModelCriar.mock.calls[0];
      expect(firebaseModelCriarArgs.length).toBe(1);
      expect(firebaseModelCriarArgs[0]).toBeDefined();
      expect(firebaseModelCriarArgs[0].uid).toBe(novoIdUsuario);
      expect(firebaseModelCriarArgs[0].displayName).toBe(body.nome);
      expect(firebaseModelCriarArgs[0].email).toBe(body.email);
      expect(firebaseModelCriarArgs[0].password).toBe(body.senha);
      // Model do firebase de criar custom token deve ter sido chamado
      expect(firebaseModelCriarCustomToken).toHaveBeenCalledTimes(1);
      const firebaseModelCriarCustomTokenArgs = firebaseModelCriarCustomToken.mock.calls[0];
      expect(firebaseModelCriarCustomTokenArgs.length).toBe(1);
      expect(firebaseModelCriarCustomTokenArgs[0]).toBe(novoIdUsuario);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].authToken).toBe(firebaseModelCustomToken);
    });
  });

  test('Retornar 500: Erro Criar conta com transação aberta', () => {
    // Realizo chamada a função
    const body = {
      nome: 'AB',
      senha: '123456',
      email: 'ABCDEF'
    };
    let request: any = {
      body: { ...body }
    };

    // Defino para retornar erro ao criar usuário
    usuarioModelCriar.mockImplementation((usuario: IUsuario) => Promise.reject());

    return usuarioCtrl.criar(request, <any>response).then(() => {
      // Retorno 500
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(500);
      // Mock Validacao por E-mail
      expect(utilsValidarEmail).toHaveBeenCalledTimes(1);
      const utilsValidarEmailArgs = utilsValidarEmail.mock.calls[0];
      expect(utilsValidarEmailArgs.length).toBe(1);
      expect(utilsValidarEmailArgs[0]).toBe(body.email);
      // Model do firebase de buscar usuário por e-maill não pode ter sido chamado
      expect(firebaseModelBuscarPorEmail).toHaveBeenCalledTimes(1);
      const firebaseModelBuscarPorEmailArgs = firebaseModelBuscarPorEmail.mock.calls[0];
      expect(firebaseModelBuscarPorEmailArgs.length).toBe(1);
      expect(firebaseModelBuscarPorEmailArgs[0]).toBe(body.email);  
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).toHaveBeenCalledTimes(1);
      // Não pode ter fechado transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).toHaveBeenCalledTimes(1);
      // Model de criar usuario não pode ter sido chamado
      expect(usuarioModelCriar).toHaveBeenCalledTimes(1);
      // Model do firebase de criar usuário não pode ter sido chamado
      expect(firebaseModelCriar).not.toHaveBeenCalled();
      // Model do firebase de criar custom token não deve ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Ocorreu um erro ao cadastrar usuário');
    });
  });

  afterEach(() => {
    firebaseModelCriar.mockClear();
  })
});

describe('Logar', () => {
  test('Retornar 400 ao nao informar dados', () => {
    // Realizo chamada a função
    let request: any = {
      body: {}
    };
    
    return usuarioCtrl.logar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      // Model de usuario não pode ter sido chamado
      expect(usuarioModelBuscarCpf).not.toHaveBeenCalled();
      expect(usuarioModelBuscarPis).not.toHaveBeenCalled();
      // Model do firebase não pode ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400 ao informar tipo de login incorreto', () => {
    // Realizo chamada a função
    let request: any = {
      body: {
        tipo: 'matricula',
        senha: '123'
      }
    };
    
    return usuarioCtrl.logar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Tipo de login inválido.');
      // Model de usuario não pode ter sido chamado
      expect(usuarioModelBuscarCpf).not.toHaveBeenCalled();
      expect(usuarioModelBuscarPis).not.toHaveBeenCalled();
      // Model do firebase não pode ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400 ao tentar logar com CPF e não informar o CPF', () => {
    let request: any = {
      body: {
        tipo: 'cpf',
        senha: '123'
      }
    };

    // Realizo chamada a função
    return usuarioCtrl.logar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('CPF não preenchido.');
      // Mock Validacao por CPF
      expect(utilsValidarCPF).not.toHaveBeenCalled();
      // Model de usuario não pode ter sido chamado
      expect(usuarioModelBuscarCpf).not.toHaveBeenCalled();
      expect(usuarioModelBuscarPis).not.toHaveBeenCalled();
      // Model do firebase não pode ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400 ao tentar logar com CPF inválido', () => {
    const cpf = '12345678912';
    let request: any = {
      body: {
        tipo: 'cpf',
        cpf: cpf,
        senha: '123'
      }
    };

    // Faço o mock de validar cpf retornar false
    utilsValidarCPF.mockImplementationOnce((cpf) => false);

    // Realizo chamada a função
    return usuarioCtrl.logar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('CPF inválido.');
      // Mock Validacao por CPF
      expect(utilsValidarCPF).toHaveBeenCalledTimes(1);
      const validarCpfArgs = utilsValidarCPF.mock.calls[0];
      expect(validarCpfArgs.length).toBe(1);
      expect(validarCpfArgs[0]).toBe(cpf);
      // Model de usuario não pode ter sido chamado
      expect(usuarioModelBuscarCpf).not.toHaveBeenCalled();
      expect(usuarioModelBuscarPis).not.toHaveBeenCalled();
      // Model do firebase não pode ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400 ao tentar logar com CPF que não existe', () => {
    const cpf = '12345678912';
    let request: any = {
      body: {
        tipo: 'cpf',
        cpf: cpf,
        senha: '123'
      }
    };

    // Faço o mock de buscar usuário por cpf para retornar null
    usuarioModelBuscarCpf.mockImplementationOnce((cpf: string) => Promise.resolve(null));

    // Realizo chamada a função
    return usuarioCtrl.logar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('CPF não encontrado.');
      // Model de usuário: buscar por CPF
      expect(usuarioModelBuscarCpf).toHaveBeenCalledTimes(1);
      const usuarioModelBuscarCpfArgs = usuarioModelBuscarCpf.mock.calls[0];
      expect(usuarioModelBuscarCpfArgs.length).toBe(1);
      expect(usuarioModelBuscarCpfArgs[0]).toBe(cpf);
      // Model de usuario não pode ter sido chamado
      expect(usuarioModelBuscarPis).not.toHaveBeenCalled();
      // Model do firebase não pode ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400 ao tentar logar com PIS e não informar o PIS', () => {
    let request: any = {
      body: {
        tipo: 'pis',
        senha: '123'
      }
    };

    // Realizo chamada a função
    return usuarioCtrl.logar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('PIS não preenchido.');
      // Mock Validacao por PIS
      expect(utilsValidarPIS).not.toHaveBeenCalled();
      // Model de usuario não pode ter sido chamado
      expect(usuarioModelBuscarCpf).not.toHaveBeenCalled();
      expect(usuarioModelBuscarPis).not.toHaveBeenCalled();
      // Model do firebase não pode ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400 ao tentar logar com PIS inválido', () => {
    const pis = '12345678912';
    let request: any = {
      body: {
        tipo: 'pis',
        pis: pis,
        senha: '123'
      }
    };

    // Faço o mock de validar pis retornar false
    utilsValidarPIS.mockImplementationOnce((pis) => false);

    // Realizo chamada a função
    return usuarioCtrl.logar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('PIS inválido.');
      // Mock Validacao por PIS
      expect(utilsValidarPIS).toHaveBeenCalledTimes(1);
      const validarPISArgs = utilsValidarPIS.mock.calls[0];
      expect(validarPISArgs.length).toBe(1);
      expect(validarPISArgs[0]).toBe(pis);
      // Model de usuario não pode ter sido chamado
      expect(usuarioModelBuscarCpf).not.toHaveBeenCalled();
      expect(usuarioModelBuscarPis).not.toHaveBeenCalled();
      // Model do firebase não pode ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400 ao tentar logar com PIS que não existe', () => {
    const pis = '12345678912';
    let request: any = {
      body: {
        tipo: 'pis',
        pis: pis,
        senha: '123'
      }
    };

    // Faço o mock de buscar usuário por pis para retornar null
    usuarioModelBuscarPis.mockImplementationOnce((pis: string) => Promise.resolve(null));

    // Realizo chamada a função
    return usuarioCtrl.logar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('PIS não encontrado.');
      // Model de usuário: buscar por Pis
      expect(usuarioModelBuscarPis).toHaveBeenCalledTimes(1);
      const usuarioModelBuscarPisArgs = usuarioModelBuscarPis.mock.calls[0];
      expect(usuarioModelBuscarPisArgs.length).toBe(1);
      expect(usuarioModelBuscarPisArgs[0]).toBe(pis);
      // Model de usuario não pode ter sido chamado
      expect(usuarioModelBuscarCpf).not.toHaveBeenCalled();
      // Model do firebase não pode ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400 ao não informar senha', () => {
    const pis = '12345678912';
    let request: any = {
      body: {
        tipo: 'pis',
        pis: pis
      }
    };

    // Realizo chamada a função
    return usuarioCtrl.logar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Senha não preenchida.');
      // Model de usuario não pode ter sido chamado
      expect(usuarioModelBuscarCpf).not.toHaveBeenCalled();
      expect(usuarioModelBuscarPis).not.toHaveBeenCalled();
      // Model do firebase não pode ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Retornar 400 ao tentar logar com senha incorreta', () => {
    const pis = '12345678912';
    let request: any = {
      body: {
        tipo: 'pis',
        pis: pis,
        senha: '123'
      }
    };

    // Realizo chamada a função
    return usuarioCtrl.logar(request, <any>response).then(() => {
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Senha incorreta.');
      // Model de usuario não pode ter sido chamado
      expect(usuarioModelBuscarCpf).not.toHaveBeenCalled();
      // Model do firebase não pode ter sido chamado
      expect(firebaseModelCriarCustomToken).not.toHaveBeenCalled();
    });
  });

  test('Realizar login e retornar custom token', () => {
    const pis = '12345678912';
    let request: any = {
      body: {
        tipo: 'pis',
        pis: pis,
        senha: usuarioRetornoModelSenhaPreHash
      }
    };

    // Realizo chamada a função
    return usuarioCtrl.logar(request, <any>response).then(() => {
      // Retorno 200
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(200);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].authToken).toBe(firebaseModelCustomToken);
      // Model de usuario por cpf não pode ter sido chamado
      expect(usuarioModelBuscarCpf).not.toHaveBeenCalled();
      // Model do firebase deve ter sido chamado
      expect(firebaseModelCriarCustomToken).toHaveBeenCalledTimes(1);
      const firebaseModelCriarCustomTokenArgs = firebaseModelCriarCustomToken.mock.calls[0];
      expect(firebaseModelCriarCustomTokenArgs.length).toBe(1);
      expect(firebaseModelCriarCustomTokenArgs[0]).toBe(usuarioRetornoModel.id);
    });
  });
});

describe('Alterar', () => {
  const firebaseModelAlterar = <any>mocked(firebaseModel.alterarUsuario);

  beforeAll(() => {
    // Antes de todos os testes, crio mock das funções utilizadas dentro da função de excluir
    firebaseModelAlterar.mockImplementation((dados: any) => Promise.resolve({}));
  });

  test('Retornar 403 ao tentar alterar usuário diferente do usuário logado', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: 'xpto'
      },
      body: {}
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Retorno 403
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(403);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Você não tem permissão para alterar este registro.');
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).not.toHaveBeenCalled();
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
    });
  });

  test('Retornar 204: Atualizar o nome e informar o mesmo nome cadastrado', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        nome: usuarioRetornoModel.nome
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 204
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(204);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(0);
    });
  });

  test('Retornar 204: Atualizar o email e informar o mesmo email cadastrado', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        email: usuarioRetornoModel.email
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 204
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(204);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(0);
    });
  });

  test('Retornar 204: Atualizar o cpf e informar o mesmo cpf cadastrado', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        cpf: usuarioRetornoModel.cpf
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 204
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(204);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(0);
    });
  });

  test('Retornar 204: Atualizar o pis e informar o mesmo pis cadastrado', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        pis: usuarioRetornoModel.pis
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 204
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(204);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(0);
    });
  });

  test('Retornar 400: Atualizar a senha e não informar senha atual', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        senha: 'abcdef'
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('Senha atual deve ser informada.');
    });
  });

  test('Retornar 400: Atualizar a senha igual a senha atual do formulario', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        senha: 'abcdef',
        senhaatual: 'abcdef'
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('Nova senha deve ser diferente da atual');
    });
  });

  test('Retornar 400: Atualizar a senha maior que 12 caracteres', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        senha: '0123456789111',
        senhaatual: 'abcdefe'
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('Senha deve até 12 caracteres.');
    });
  });

  test('Retornar 400: Atualizar a senha menor que 6 caracteres', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        senha: '00000',
        senhaatual: 'abcdefe'
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('Senha deve ter pelo menos 6 caracteres.');
    });
  });

  test('Retornar 400: Atualizar a senha igual a senha atual no banco', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        senha: usuarioRetornoModelSenhaPreHash,
        senhaatual: 'abcdefg'
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('Nova senha deve ser diferente da atual.');
    });
  });

  test('Retornar 400: Atualizar a senha e senha atual está incorreta.', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        senha: 'abcdef',
        senhaatual: 'abcdefg'
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('Senha atual incorreta.');
    });
  });

  test('Retornar 400: CPF já existe para outro usuário', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        cpf: 'NOVO_CPF'
      }
    };

    // Defino que função de validação de e-mail retorne false
    usuarioModelBuscarCpf.mockImplementationOnce((cpf: string) => Promise.resolve({
      ...usuarioRetornoModel,
      id: 'ID_OUTRO_USUARIO'
    }));

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('Já existe uma conta utilizando esse CPF.');
    });
  });

  test('Retornar 400: PIS já existe para outro usuário', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        pis: 'NOVO_PIS'
      }
    };

    // Defino que função de validação de e-mail retorne false
    usuarioModelBuscarPis.mockImplementationOnce((pis: string) => Promise.resolve({
      ...usuarioRetornoModel,
      id: 'ID_OUTRO_USUARIO'
    }));

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('Já existe uma conta utilizando esse PIS.');
    });
  });

  test('Retornar 400: Atualizar nome menor que 2 caracteres', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        nome: 'A'
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('Nome deve ter pelo menos 2 caracteres.');
    });
  });

  test('Retornar 400: Atualizar nome maior que 50 caracteres', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        nome: 'A123456789B123456789C123456789D123456789E123456789F'
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('Nome deve até 50 caracteres.');
    });
  });

  test('Retornar 400: Atualizar email maior que 50 caracteres', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        email: 'A123456789B123456789C123456789D123456789E123456789F'
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('E-mail deve até 50 caracteres.');
    });
  });

  test('Retornar 400: E-mail inválido', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        email: 'MEU_NOVO_EMAIL'
      }
    };

    // Defino que função de validação de e-mail retorne false
    utilsValidarEmail.mockImplementationOnce((email: string) => false);

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('E-mail inválido.');
    });
  });

  test('Retornar 400: E-mail já utilizado', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        email: 'MEU_NOVO_EMAIL'
      }
    };

    // Defino que função de validação de e-mail retorne false
    firebaseModelBuscarPorEmail.mockImplementationOnce((email: string) => Promise.resolve({
      uid: usuarioRetornoModel.id,
      displayName: usuarioRetornoModel.nome,
      email: usuarioRetornoModel.email
    }));
    
    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
      // Model de alterar usuario não pode ter sido chamado
      expect(usuarioModelAlterar).not.toHaveBeenCalled();
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço não pode ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).not.toHaveBeenCalled();
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 400
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(400);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0].message).toBe('Já existe uma conta com esse endereço de e-mail');
    });
  });

  test('Retornar 204: Atualizar o usuario', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id,
      },
      body: {
        nome: 'UM_NOME_ALEATORIO',
        email: 'UM_EMAIL_ALEATORIO',
        senha: '123456125',
        senhaatual: usuarioRetornoModelSenhaPreHash,
        pis: 'UM_PIS_ALEATORIO',
        cpf: 'UM_CPF_ALEATORIO'
      }
    };

    return usuarioCtrl.alterar(request, <any>response).then(() => {
      // Model de buscar usuario deve pode ter sido chamado
      expect(usuarioModelBuscar).toHaveBeenCalled();
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Model de buscar endereço não deve ter sido chamado
      expect(enderecoModelBuscar).not.toHaveBeenCalled();
      // Não pode ter iniciado transação
      expect(bancoDadosInitTransaction).toHaveBeenCalledTimes(1);
      // Model de alterar usuario deve ter sido chamado
      expect(usuarioModelAlterar).toHaveBeenCalledTimes(1);
      const usuarioModelAlterarArgs = usuarioModelAlterar.mock.calls[0];
      expect(usuarioModelAlterarArgs.length).toBe(1);
      expect(usuarioModelAlterarArgs[0]).toBeDefined();
      expect(Object.keys(usuarioModelAlterarArgs[0])).toBeDefined();
      expect(Object.keys(usuarioModelAlterarArgs[0]).length).toBe(6);
      expect(usuarioModelAlterarArgs[0].id).toBe(usuarioRetornoModel.id);
      expect(usuarioModelAlterarArgs[0].nome).toBe(request.body.nome);
      expect(usuarioModelAlterarArgs[0].email).toBe(request.body.email);
      expect(usuarioModelAlterarArgs[0].senha).toBeDefined();
      expect(usuarioModelAlterarArgs[0].cpf).toBe(request.body.cpf);
      expect(usuarioModelAlterarArgs[0].pis).toBe(request.body.pis);
      // Model de criar endereço não pode ter sido chamado
      expect(enderecoModelCriar).not.toHaveBeenCalled();
      // Model de alterar endereço deve ter sido chamado
      expect(enderecoModelAlterar).not.toHaveBeenCalled();
      // Model de alterar usuário no firebase não pode ter sido chamado
      expect(firebaseModelAlterar).toHaveBeenCalledTimes(1);
      const firebaseModelAlterarArgs = firebaseModelAlterar.mock.calls[0];
      expect(firebaseModelAlterarArgs.length).toBe(2);
      expect(firebaseModelAlterarArgs[0]).toBe(usuarioRetornoModel.id);
      expect(firebaseModelAlterarArgs[1]).toBeDefined();
      expect(firebaseModelAlterarArgs[1].displayName).toBe(request.body.nome);
      expect(firebaseModelAlterarArgs[1].email).toBe(request.body.email);
      expect(firebaseModelAlterarArgs[1].password).toBe(request.body.senha);
      // Não pode ter salvo transação
      expect(bancoDadosCommitTransaction).toHaveBeenCalledTimes(1);
      // Não pode ter cancelado transação
      expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
      // Retorno 204
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(204);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(0);
    });
  });

  describe('Usuario sem endereço cadastrado', () => {
    test('Retornar 400: Não informar o país', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {}
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('País deve ser informado.');
      });
    });
  
    test('Retornar 400: Não informar o estado', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'UM_PAIS'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('UF deve ser informado.');
      });
    });
  
    test('Retornar 400: Não informar o município', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'UM_PAIS',
            estado: 'RJ'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Município deve ser informado.');
      });
    });
  
    test('Retornar 400: Não informar o cep', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'UM_PAIS',
            estado: 'RJ',
            municipio: 'Rio de Janeiro'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('CEP deve ser informado.');
      });
    });
  
    test('Retornar 400: Não informar a rua', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'UM_PAIS',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Rua deve ser informada.');
      });
    });
  
    test('Retornar 400: Não informar o numero', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'UM_PAIS',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua das Laranjeiras'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Numero deve ser informado.');
      });
    });
  
    test('Retornar 400: País com menos de 3 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BA',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('País deve ter pelo menos 3 caracteres.');
      });
    });
  
    test('Retornar 400: País com mais de 50 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'A123456789B123456789C123456789D123456789E123456789F',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('País deve ter no máximo 50 caracteres.');
      });
    });
  
    test('Retornar 400: Estado não possui 2 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ5',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('UF deve ter 2 caracteres.');
      });
    });
  
    test('Retornar 400: Município com menos de 3 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Ri',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Municipio deve ter pelo menos 3 caracteres.');
      });
    });
  
    test('Retornar 400: Município com mais de 50 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'A123456789B123456789C123456789D123456789E123456789F',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Municipio deve ter no máximo 50 caracteres.');
      });
    });
  
    test('Retornar 400: Cep inválido.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      // Faço o mock de validar cep retornar false
      utilsValidarCEP.mockImplementationOnce((cep) => false);
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('CEP inválido.');
      });
    });
  
    test('Retornar 400: Rua com menos de 3 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'RU',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Rua deve ter pelo menos 3 caracteres.');
      });
    });
  
    test('Retornar 400: Rua com mais de 50 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'A123456789B123456789C123456789D123456789E123456789F',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Rua deve ter no máximo 50 caracteres.');
      });
    });
  
    test('Retornar 400: Numero com mais de 20 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua X',
            numero: 'A123456789B123456789C',
            complemento: 'Lote 6'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Número deve ter no máximo 20 caracteres.');
      });
    });
  
    test('Retornar 400: Complemento com menos de 3 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua X',
            numero: '10',
            complemento: 'AB'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Complemento deve ter pelo menos 3 caracteres.');
      });
    });
  
    test('Retornar 400: Complemento com mais de 50 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua X',
            numero: '10',
            complemento: 'A123456789B123456789C123456789D123456789E123456789F'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Complemento deve ter no máximo 50 caracteres.');
      });
    });

    test('Retornar 201: Criar o endereço do usuário', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'UM_PAIS',
            estado: 'ES',
            municipio: 'UM_MUNICIPIO',
            cep: 'UM_CEP',
            rua: 'UMA_RUA',
            numero: 'UM_NUMERO',
            complemento: 'UM_COMPLEMENTO',
          }
        }
      };
      
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario deve pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Model de buscar endereço deve pode ter sido chamado
        expect(enderecoModelBuscar).not.toHaveBeenCalled();
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).toHaveBeenCalledTimes(1);
        // Model de alterar endereço deve ter sido chamado
        expect(enderecoModelCriar).toHaveBeenCalledTimes(1);
        const enderecoModelCriarArgs = enderecoModelCriar.mock.calls[0];
        expect(enderecoModelCriarArgs.length).toBe(1);
        expect(enderecoModelCriarArgs[0]).toBeDefined();
        expect(Object.keys(enderecoModelCriarArgs[0])).toBeDefined();
        expect(Object.keys(enderecoModelCriarArgs[0]).length).toBe(8);
        expect(enderecoModelCriarArgs[0].id).toBeDefined();
        const idNovoEndereco = enderecoModelCriarArgs[0].id;
        expect(enderecoModelCriarArgs[0].pais).toBe(request.body.endereco.pais);
        expect(enderecoModelCriarArgs[0].estado).toBe(request.body.endereco.estado);
        expect(enderecoModelCriarArgs[0].municipio).toBe(request.body.endereco.municipio);
        expect(enderecoModelCriarArgs[0].cep).toBe(request.body.endereco.cep);
        expect(enderecoModelCriarArgs[0].rua).toBe(request.body.endereco.rua);
        expect(enderecoModelCriarArgs[0].numero).toBe(request.body.endereco.numero);
        expect(enderecoModelCriarArgs[0].complemento).toBe(request.body.endereco.complemento);
        // Model de alterar usuario deve ter sido chamado
        expect(usuarioModelAlterar).toHaveBeenCalledTimes(1);
        const usuarioModelAlterarArgs = usuarioModelAlterar.mock.calls[0];
        expect(usuarioModelAlterarArgs.length).toBe(1);
        expect(usuarioModelAlterarArgs[0]).toBeDefined();
        expect(usuarioModelAlterarArgs[0].id).toBe(usuarioRetornoModel.id);
        expect(usuarioModelAlterarArgs[0].id_endereco).toBe(idNovoEndereco);
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).toHaveBeenCalledTimes(1);
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 201
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(201);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0].id_endereco).toBe(idNovoEndereco);
      });
    });
  })

  describe('Usuario com endereço cadastrado', () => {
    beforeEach(() => {
      // Faço o mock de buscar usuário para retornar usuário com endereço
      const usuarioRetorno: IUsuario = {...usuarioRetornoModel, id_endereco: 'idendereco'};
      usuarioModelBuscar.mockImplementationOnce((id: string) => Promise.resolve(usuarioRetorno));
    });

    test('Retornar 400: País com menos de 3 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BA',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Model de buscar endereço deve pode ter sido chamado
        expect(enderecoModelBuscar).toHaveBeenCalled();
        const enderecoModelBuscarArgs = enderecoModelBuscar.mock.calls[0];
        expect(enderecoModelBuscarArgs.length).toBe(1);
        expect(enderecoModelBuscarArgs[0]).toBe(enderecoRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('País deve ter pelo menos 3 caracteres.');
      });
    });
  
    test('Retornar 400: País com mais de 50 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'A123456789B123456789C123456789D123456789E123456789F',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('País deve ter no máximo 50 caracteres.');
      });
    });
  
    test('Retornar 400: Estado não possui 2 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ5',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Model de buscar endereço deve pode ter sido chamado
        expect(enderecoModelBuscar).toHaveBeenCalled();
        const enderecoModelBuscarArgs = enderecoModelBuscar.mock.calls[0];
        expect(enderecoModelBuscarArgs.length).toBe(1);
        expect(enderecoModelBuscarArgs[0]).toBe(enderecoRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('UF deve ter 2 caracteres.');
      });
    });
  
    test('Retornar 400: Município com menos de 3 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Ri',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Model de buscar endereço deve pode ter sido chamado
        expect(enderecoModelBuscar).toHaveBeenCalled();
        const enderecoModelBuscarArgs = enderecoModelBuscar.mock.calls[0];
        expect(enderecoModelBuscarArgs.length).toBe(1);
        expect(enderecoModelBuscarArgs[0]).toBe(enderecoRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Municipio deve ter pelo menos 3 caracteres.');
      });
    });
  
    test('Retornar 400: Município com mais de 50 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'A123456789B123456789C123456789D123456789E123456789F',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Municipio deve ter no máximo 50 caracteres.');
      });
    });
  
    test('Retornar 400: Cep inválido.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua das Laranjeiras',
            numero: '7'
          }
        }
      };
  
      // Faço o mock de validar cep retornar false
      utilsValidarCEP.mockImplementationOnce((cep) => false);
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Model de buscar endereço deve pode ter sido chamado
        expect(enderecoModelBuscar).toHaveBeenCalled();
        const enderecoModelBuscarArgs = enderecoModelBuscar.mock.calls[0];
        expect(enderecoModelBuscarArgs.length).toBe(1);
        expect(enderecoModelBuscarArgs[0]).toBe(enderecoRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('CEP inválido.');
      });
    });
  
    test('Retornar 400: Rua com menos de 3 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'RU',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Model de buscar endereço deve pode ter sido chamado
        expect(enderecoModelBuscar).toHaveBeenCalled();
        const enderecoModelBuscarArgs = enderecoModelBuscar.mock.calls[0];
        expect(enderecoModelBuscarArgs.length).toBe(1);
        expect(enderecoModelBuscarArgs[0]).toBe(enderecoRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Rua deve ter pelo menos 3 caracteres.');
      });
    });
  
    test('Retornar 400: Rua com mais de 50 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'A123456789B123456789C123456789D123456789E123456789F',
            numero: '7'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Rua deve ter no máximo 50 caracteres.');
      });
    });
  
    test('Retornar 400: Numero com mais de 20 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua X',
            numero: 'A123456789B123456789C',
            complemento: 'Lote 6'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Número deve ter no máximo 20 caracteres.');
      });
    });
  
    test('Retornar 400: Complemento com menos de 3 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua X',
            numero: '10',
            complemento: 'AB'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Model de buscar endereço deve pode ter sido chamado
        expect(enderecoModelBuscar).toHaveBeenCalled();
        const enderecoModelBuscarArgs = enderecoModelBuscar.mock.calls[0];
        expect(enderecoModelBuscarArgs.length).toBe(1);
        expect(enderecoModelBuscarArgs[0]).toBe(enderecoRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Complemento deve ter pelo menos 3 caracteres.');
      });
    });
  
    test('Retornar 400: Complemento com mais de 50 caracteres.', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'BRASIL',
            estado: 'RJ',
            municipio: 'Rio de Janeiro',
            cep: '12345123',
            rua: 'Rua X',
            numero: '10',
            complemento: 'A123456789B123456789C123456789D123456789E123456789F'
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario não pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 400
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(400);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].message).toBe('Complemento deve ter no máximo 50 caracteres.');
      });
    });

    test('Retornar 204(Sem atualizaçao no banco): Atualizar o endereço e informar o mesmo endereço cadastrado', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: enderecoRetornoModel.pais,
            estado: enderecoRetornoModel.estado,
            municipio: enderecoRetornoModel.municipio,
            cep: enderecoRetornoModel.cep,
            rua: enderecoRetornoModel.rua,
            numero: enderecoRetornoModel.numero,
            complemento: enderecoRetornoModel.complemento
          }
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario deve pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Model de buscar endereço deve pode ter sido chamado
        expect(enderecoModelBuscar).toHaveBeenCalled();
        const enderecoModelBuscarArgs = enderecoModelBuscar.mock.calls[0];
        expect(enderecoModelBuscarArgs.length).toBe(1);
        expect(enderecoModelBuscarArgs[0]).toBe(enderecoRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 204
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(204);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(0);
      });
    });

    test('Retornar 204(Sem atualizaçao no banco): Atualizar o endereço e não informar o endereço', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {}
        }
      };
  
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario deve pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Model de buscar endereço deve pode ter sido chamado
        expect(enderecoModelBuscar).toHaveBeenCalled();
        const enderecoModelBuscarArgs = enderecoModelBuscar.mock.calls[0];
        expect(enderecoModelBuscarArgs.length).toBe(1);
        expect(enderecoModelBuscarArgs[0]).toBe(enderecoRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).not.toHaveBeenCalled();
        // Model de alterar usuario não pode ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço não pode ter sido chamado
        expect(enderecoModelAlterar).not.toHaveBeenCalled();
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).not.toHaveBeenCalled();
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 204
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(204);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(0);
      });
    });

    test('Retornar 204: Atualizar o endereço parcialmente', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            municipio: 'Ubatuba',
          }
        }
      };
      
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario deve pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Model de buscar endereço deve pode ter sido chamado
        expect(enderecoModelBuscar).toHaveBeenCalled();
        const enderecoModelBuscarArgs = enderecoModelBuscar.mock.calls[0];
        expect(enderecoModelBuscarArgs.length).toBe(1);
        expect(enderecoModelBuscarArgs[0]).toBe(enderecoRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).toHaveBeenCalledTimes(1);
        // Model de alterar usuario deve ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço deve ter sido chamado
        expect(enderecoModelAlterar).toHaveBeenCalledTimes(1);
        const enderecoModelAlterarArgs = enderecoModelAlterar.mock.calls[0];
        expect(enderecoModelAlterarArgs.length).toBe(1);
        expect(enderecoModelAlterarArgs[0]).toBeDefined();
        expect(Object.keys(enderecoModelAlterarArgs[0])).toBeDefined();
        expect(Object.keys(enderecoModelAlterarArgs[0]).length).toBe(2);
        expect(enderecoModelAlterarArgs[0].id).toBe(enderecoRetornoModel.id);
        expect(enderecoModelAlterarArgs[0].municipio).toBe(request.body.endereco.municipio);
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).toHaveBeenCalledTimes(1);
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 204
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(204);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(0);
      });
    });

    test('Retornar 204: Atualizar o endereço completo', () => {
      // Realizo chamada a função
      let request: any = {
        usuario: {
          id: usuarioRetornoModel.id,
          nome: usuarioRetornoModel.nome,
          email: usuarioRetornoModel.email
        },
        params: {
          id: usuarioRetornoModel.id,
        },
        body: {
          endereco: {
            pais: 'UM_PAIS',
            estado: 'ES',
            municipio: 'UM_MUNICIPIO',
            cep: 'UM_CEP',
            rua: 'UMA_RUA',
            numero: 'UM_NUMERO',
            complemento: 'UM_COMPLEMENTO',
          }
        }
      };
      
      return usuarioCtrl.alterar(request, <any>response).then(() => {
        // Model de buscar usuario deve pode ter sido chamado
        expect(usuarioModelBuscar).toHaveBeenCalled();
        const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
        expect(usuarioModelBuscarArgs.length).toBe(1);
        expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
        // Model de buscar endereço deve pode ter sido chamado
        expect(enderecoModelBuscar).toHaveBeenCalled();
        const enderecoModelBuscarArgs = enderecoModelBuscar.mock.calls[0];
        expect(enderecoModelBuscarArgs.length).toBe(1);
        expect(enderecoModelBuscarArgs[0]).toBe(enderecoRetornoModel.id);
        // Não pode ter iniciado transação
        expect(bancoDadosInitTransaction).toHaveBeenCalledTimes(1);
        // Model de alterar usuario deve ter sido chamado
        expect(usuarioModelAlterar).not.toHaveBeenCalled();
        // Model de criar endereço não pode ter sido chamado
        expect(enderecoModelCriar).not.toHaveBeenCalled();
        // Model de alterar endereço deve ter sido chamado
        expect(enderecoModelAlterar).toHaveBeenCalledTimes(1);
        const enderecoModelAlterarArgs = enderecoModelAlterar.mock.calls[0];
        expect(enderecoModelAlterarArgs.length).toBe(1);
        expect(enderecoModelAlterarArgs[0]).toBeDefined();
        expect(Object.keys(enderecoModelAlterarArgs[0])).toBeDefined();
        expect(Object.keys(enderecoModelAlterarArgs[0]).length).toBe(8);
        expect(enderecoModelAlterarArgs[0].id).toBe(enderecoRetornoModel.id);
        expect(enderecoModelAlterarArgs[0].pais).toBe(request.body.endereco.pais);
        expect(enderecoModelAlterarArgs[0].estado).toBe(request.body.endereco.estado);
        expect(enderecoModelAlterarArgs[0].municipio).toBe(request.body.endereco.municipio);
        expect(enderecoModelAlterarArgs[0].cep).toBe(request.body.endereco.cep);
        expect(enderecoModelAlterarArgs[0].rua).toBe(request.body.endereco.rua);
        expect(enderecoModelAlterarArgs[0].numero).toBe(request.body.endereco.numero);
        expect(enderecoModelAlterarArgs[0].complemento).toBe(request.body.endereco.complemento);
        // Model de alterar usuário no firebase não pode ter sido chamado
        expect(firebaseModelAlterar).not.toHaveBeenCalled();
        // Não pode ter salvo transação
        expect(bancoDadosCommitTransaction).toHaveBeenCalledTimes(1);
        // Não pode ter cancelado transação
        expect(bancoDadosRollbackTransaction).not.toHaveBeenCalled();
        // Retorno 204
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(204);
        // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(0);
      });
    });
  })

  afterEach(() => {
    firebaseModelAlterar.mockClear();
  })
});

describe('Buscar', () => {
  test('Retornar 403: Buscar usuário diferente do usuário logado', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: 'xpto'
      }
    };

    return usuarioCtrl.buscar(request, <any>response).then(() => {
      // Retorno 403
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(403);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Você não tem permissão para buscar este registro.');
      // Model de usuario não pode ter sido chamado
      expect(usuarioModelBuscar).not.toHaveBeenCalled();
      // Model de endereço não pode ter sido chamado
      expect(enderecoModelBuscar).not.toHaveBeenCalled();
    });
  });

  test('Retornar 404: Usuário não existe', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id
      }
    };

    // Faço o mock de buscar usuário para retornar null
    usuarioModelBuscar.mockImplementationOnce((id: string) => Promise.resolve(null));

    return usuarioCtrl.buscar(request, <any>response).then(() => {
      // Retorno 404
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(404);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Usuário não encontrado.');
      // Model de usuario
      expect(usuarioModelBuscar).toHaveBeenCalledTimes(1);
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Model de endereço não pode ter sido chamado
      expect(enderecoModelBuscar).not.toHaveBeenCalled();
    });
  });

  test('Retornar 200: Usuario sem endereço', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id
      }
    };

    return usuarioCtrl.buscar(request, <any>response).then(() => {
      // Retorno 200
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(200);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      const usuarioRetornado = responseArgs[0];
      expect(usuarioRetornado.id).toBe(usuarioRetornoModel.id);
      expect(usuarioRetornado.nome).toBe(usuarioRetornoModel.nome);
      expect(usuarioRetornado.email).toBe(usuarioRetornoModel.email);
      expect(usuarioRetornado.cpf).toBe(usuarioRetornoModel.cpf);
      expect(usuarioRetornado.pis).toBe(usuarioRetornoModel.pis);
      expect(usuarioRetornado.senha).toBeUndefined();
      // Model de usuario
      expect(usuarioModelBuscar).toHaveBeenCalledTimes(1);
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Model de endereço não pode ter sido chamado
      expect(enderecoModelBuscar).not.toHaveBeenCalled();
    });
  });

  test('Retornar 200: Usuario com endereço', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id
      }
    };

    // Faço o mock de buscar usuário para retornar usuário com endereço
    const usuarioRetorno: IUsuario = {...usuarioRetornoModel, id_endereco: 'idendereco'};
    usuarioModelBuscar.mockImplementationOnce((id: string) => Promise.resolve(usuarioRetorno));

    return usuarioCtrl.buscar(request, <any>response).then(() => {
      // Retorno 200
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(200);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      // Validando dados do usuário
      const usuarioRetornado = responseArgs[0];
      expect(usuarioRetornado.id).toBe(usuarioRetorno.id);
      expect(usuarioRetornado.nome).toBe(usuarioRetorno.nome);
      expect(usuarioRetornado.email).toBe(usuarioRetorno.email);
      expect(usuarioRetornado.cpf).toBe(usuarioRetorno.cpf);
      expect(usuarioRetornado.pis).toBe(usuarioRetorno.pis);
      expect(usuarioRetornado.id_endereco).toBe(usuarioRetorno.id_endereco);
      expect(usuarioRetornado.senha).toBeUndefined();
      // Validando endereço do usuário
      expect(usuarioRetornado.objs).toBeDefined();
      const usuarioEndereco = usuarioRetornado.objs.endereco;
      expect(usuarioEndereco).toBeDefined();
      expect(usuarioEndereco.id).toBe(enderecoRetornoModel.id);
      expect(usuarioEndereco.cep).toBe(enderecoRetornoModel.cep);
      expect(usuarioEndereco.complemento).toBe(enderecoRetornoModel.complemento);
      expect(usuarioEndereco.estado).toBe(enderecoRetornoModel.estado);
      expect(usuarioEndereco.municipio).toBe(enderecoRetornoModel.municipio);
      expect(usuarioEndereco.numero).toBe(enderecoRetornoModel.numero);
      expect(usuarioEndereco.pais).toBe(enderecoRetornoModel.pais);
      expect(usuarioEndereco.rua).toBe(enderecoRetornoModel.rua);
      // Model de usuario
      expect(usuarioModelBuscar).toHaveBeenCalledTimes(1);
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetorno.id);
      // Model de endereço
      expect(enderecoModelBuscar).toHaveBeenCalled();
      const enderecoModelBuscarArgs = enderecoModelBuscar.mock.calls[0];
      expect(enderecoModelBuscarArgs.length).toBe(1);
      expect(enderecoModelBuscarArgs[0]).toBe(usuarioRetorno.id_endereco);
    });
  });
});

describe('Excluir', () => {
  const firebaseModelExcluir = <any>mocked(firebaseModel.excluirUsuario);

  beforeAll(() => {
    // Antes de todos os testes, crio mock das funções utilizadas dentro da função de excluir
    firebaseModelExcluir.mockImplementation((usuarioId: string) => Promise.resolve());
  });

  test('Retornar 403: Tentar excluir usuário diferente do usuário logado', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: 'xpto'
      }
    };

    return usuarioCtrl.excluir(request, <any>response).then(() => {
      // Retorno 403
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(403);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Você não tem permissão para excluir este registro.');
      // Model de buscar usuario não pode ter sido chamado
      expect(usuarioModelBuscar).not.toHaveBeenCalled();
      // Model de excluir endereço não pode ter sido chamado
      expect(enderecoModelExcluir).not.toHaveBeenCalled();
      // Model de excluir usuário não pode ter sido chamado
      expect(usuarioModelExcluir).not.toHaveBeenCalled();
      // Model de excluir usuário no firebase não pode ter sido chamado
      expect(firebaseModelExcluir).not.toHaveBeenCalled();
    });
  });

  test('Retornar 404: Usuário não existe', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id
      }
    };

    // Faço o mock de buscar usuário para retornar null
    usuarioModelBuscar.mockImplementationOnce((id: string) => Promise.resolve(null));

    return usuarioCtrl.buscar(request, <any>response).then(() => {
      // Retorno 404
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(404);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(1);
      expect(responseArgs[0]).toBeDefined();
      expect(responseArgs[0].message).toBe('Usuário não encontrado.');
      // Model de usuario
      expect(usuarioModelBuscar).toHaveBeenCalledTimes(1);
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Model de excluir endereço não pode ter sido chamado
      expect(enderecoModelExcluir).not.toHaveBeenCalled();
      // Model de excluir usuário não pode ter sido chamado
      expect(usuarioModelExcluir).not.toHaveBeenCalled();
      // Model de excluir usuário no firebase não pode ter sido chamado
      expect(firebaseModelExcluir).not.toHaveBeenCalled();
    });
  });

  test('Retornar 200: Excluir usuario sem endereço', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id
      }
    };

    return usuarioCtrl.excluir(request, <any>response).then(() => {
      // Retorno 204
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(204);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(0);
      // Model de usuario
      expect(usuarioModelBuscar).toHaveBeenCalledTimes(1);
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetornoModel.id);
      // Model de excluir endereço deve ter sido chamado
      expect(usuarioModelExcluir).toHaveBeenCalledTimes(1);
      const usuarioModelExcluirArgs = usuarioModelExcluir.mock.calls[0];
      expect(usuarioModelExcluirArgs.length).toBe(1);
      expect(usuarioModelExcluirArgs[0]).toBe(usuarioRetornoModel.id);
      // Model de excluir usuário no firebase deve ter sido chamado
      expect(firebaseModelExcluir).toHaveBeenCalledTimes(1);
      const firebaseModelExcluirArgs = firebaseModelExcluir.mock.calls[0];
      expect(firebaseModelExcluirArgs.length).toBe(1);
      expect(firebaseModelExcluirArgs[0]).toBe(usuarioRetornoModel.id);
      // Model de excluir endereço não pode ter sido chamado
      expect(enderecoModelExcluir).not.toHaveBeenCalled();
    });
  });

  test('Retornar 200: Excluir usuario com endereço', () => {
    // Realizo chamada a função
    let request: any = {
      usuario: {
        id: usuarioRetornoModel.id,
        nome: usuarioRetornoModel.nome,
        email: usuarioRetornoModel.email
      },
      params: {
        id: usuarioRetornoModel.id
      }
    };

    // Faço o mock de buscar usuário para retornar usuário com endereço
    const usuarioRetorno: IUsuario = {...usuarioRetornoModel, id_endereco: 'idendereco'};
    usuarioModelBuscar.mockImplementationOnce((id: string) => Promise.resolve(usuarioRetorno));

    return usuarioCtrl.excluir(request, <any>response).then(() => {
      // Retorno 204
      expect(response.status).toHaveBeenCalledTimes(1);
      const statusArgs = response.status.mock.calls[0];
      expect(statusArgs.length).toBe(1);
      expect(statusArgs[0]).toBe(204);
      // Dados de retorno
      expect(response.send).toHaveBeenCalledTimes(1);
      const responseArgs = response.send.mock.calls[0];
      expect(responseArgs.length).toBe(0);
      // Model de buscar usuario
      expect(usuarioModelBuscar).toHaveBeenCalledTimes(1);
      const usuarioModelBuscarArgs = usuarioModelBuscar.mock.calls[0];
      expect(usuarioModelBuscarArgs.length).toBe(1);
      expect(usuarioModelBuscarArgs[0]).toBe(usuarioRetorno.id);
      // Model de excluir endereço deve ter sido chamado
      expect(enderecoModelExcluir).toHaveBeenCalledTimes(1);
      const enderecoModelExcluirArgs = enderecoModelExcluir.mock.calls[0];
      expect(enderecoModelExcluirArgs.length).toBe(1);
      expect(enderecoModelExcluirArgs[0]).toBe(usuarioRetorno.id_endereco);
      // Model de excluir usuário deve ter sido chamado
      expect(usuarioModelExcluir).toHaveBeenCalledTimes(1);
      const usuarioModelExcluirArgs = usuarioModelExcluir.mock.calls[0];
      expect(usuarioModelExcluirArgs.length).toBe(1);
      expect(usuarioModelExcluirArgs[0]).toBe(usuarioRetorno.id);
      // Model de excluir usuário no firebase deve ter sido chamado
      expect(firebaseModelExcluir).toHaveBeenCalledTimes(1);
      const firebaseModelExcluirArgs = firebaseModelExcluir.mock.calls[0];
      expect(firebaseModelExcluirArgs.length).toBe(1);
      expect(firebaseModelExcluirArgs[0]).toBe(usuarioRetorno.id);
    });
  });

  afterEach(() => {
    firebaseModelExcluir.mockClear();
  })
});