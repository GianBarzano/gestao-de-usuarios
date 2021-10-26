import { test, describe, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { mocked } from 'ts-jest/utils'
import firebaseModel from '../../../../src/models/firebasemodel';
import { autenticacaoMiddleware } from '../../../../src/middlewares/autenticacaomiddleware';

// Realizo mock do modulo de firebase
jest.mock('../../../../src/models/firebasemodel');

const response = {
    status: jest.fn<any, any>(),
    send: jest.fn<any, any>()
}
const next = jest.fn<any, any>();

const firebaseModelVerificarToken = <any>mocked(firebaseModel.verificaToken);
const firebaseModelTokenDecoded = {
    user_id: 'token_id',
    name: 'token_nome',
    email: 'token_email'
}

beforeAll(() => {
    // Response
    response.status.mockImplementation((codigo) => response);
    response.send.mockImplementation((dados) => response);
    next.mockImplementation((dados) => Promise.resolve(() => {}));
    // Model do firebase
    firebaseModelVerificarToken.mockImplementation(
        (token: string) => Promise.resolve(firebaseModelTokenDecoded)
    );
})

test('Retornar 401: Token não informado', () => {
    const request = {
        headers: {}
    };
    autenticacaoMiddleware(<any>request, <any>response, next);
    // Retorno 401
    expect(response.status).toHaveBeenCalledTimes(1);
    const statusArgs = response.status.mock.calls[0];
    expect(statusArgs.length).toBe(1);
    expect(statusArgs[0]).toBe(401);
    // Dados de retorno
    expect(response.send).toHaveBeenCalledTimes(1);
    const responseArgs = response.send.mock.calls[0];
    expect(responseArgs.length).toBe(1);
    expect(responseArgs[0]).toBeDefined();
    expect(responseArgs[0].error).toBe('Token não informado');
})

test('Retornar 401: Token com formatação incorreta', () => {
    const request = {
        headers: {
            authorization: 'BEARER'
        }
    };
    autenticacaoMiddleware(<any>request, <any>response, next);
    // Retorno 401
    expect(response.status).toHaveBeenCalledTimes(1);
    const statusArgs = response.status.mock.calls[0];
    expect(statusArgs.length).toBe(1);
    expect(statusArgs[0]).toBe(401);
    // Dados de retorno
    expect(response.send).toHaveBeenCalledTimes(1);
    const responseArgs = response.send.mock.calls[0];
    expect(responseArgs.length).toBe(1);
    expect(responseArgs[0]).toBeDefined();
    expect(responseArgs[0].error).toBe('Token com formatação incorreta');
})

test('Retornar 401: Token possui duas partes, mas coms formatação incorreta', () => {
    const request = {
        headers: {
            authorization: 'MEU TOKEN'
        }
    };
    autenticacaoMiddleware(<any>request, <any>response, next);
    // Retorno 401
    expect(response.status).toHaveBeenCalledTimes(1);
    const statusArgs = response.status.mock.calls[0];
    expect(statusArgs.length).toBe(1);
    expect(statusArgs[0]).toBe(401);
    // Dados de retorno
    expect(response.send).toHaveBeenCalledTimes(1);
    const responseArgs = response.send.mock.calls[0];
    expect(responseArgs.length).toBe(1);
    expect(responseArgs[0]).toBeDefined();
    expect(responseArgs[0].error).toBe('Token com formatação incorreta');
})

test('Retornar 401: Não decodifica token', () => {
    const request = {
        headers: {
            authorization: 'BEARER TOKEN'
        }
    };

    // Defino que a função vai dar erro na proxima execução
    firebaseModelVerificarToken.mockImplementationOnce(
        (token: string) => Promise.reject()
    );

    return autenticacaoMiddleware(<any>request, <any>response, next).then((algo) => {
        // Retorno 401
        expect(response.status).toHaveBeenCalledTimes(1);
        const statusArgs = response.status.mock.calls[0];
        expect(statusArgs.length).toBe(1);
        expect(statusArgs[0]).toBe(401);
        // // Dados de retorno
        expect(response.send).toHaveBeenCalledTimes(1);
        const responseArgs = response.send.mock.calls[0];
        expect(responseArgs.length).toBe(1);
        expect(responseArgs[0]).toBeDefined();
        expect(responseArgs[0].error).toBe('Token inválido');
    }).catch((err) => {});
})

test('Chama next: Token decodificado com sucesso', () => {
    const request = {
        headers: {
            authorization: 'BEARER TOKEN'
        }
    };

    return autenticacaoMiddleware(<any>request, <any>response, next).then((algo) => {
        expect((<any>request).usuario).toBeDefined();
        expect((<any>request).usuario.id).toBe(firebaseModelTokenDecoded.user_id);
        expect((<any>request).usuario.nome).toBe(firebaseModelTokenDecoded.name);
        expect((<any>request).usuario.email).toBe(firebaseModelTokenDecoded.email);
        expect(next).toHaveBeenCalledTimes(1);
    });
})

afterEach(() => {
    // Response
    response.status.mockClear();
    response.send.mockClear();
    next.mockClear();
    // Model do firebase
    firebaseModelVerificarToken.mockClear();
})