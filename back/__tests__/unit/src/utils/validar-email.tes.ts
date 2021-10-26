import { test, expect} from '@jest/globals';
import { validarEmail } from '../../../../src/utils';

test('E-mail vazio', () => {
  const valido = validarEmail('');
  expect(valido).toBeFalsy();
})

test('E-mail sem @', () => {
  const valido = validarEmail('usuario');
  expect(valido).toBeFalsy();
})

test('E-mail sem dominio', () => {
  const valido = validarEmail('usuario@');
  expect(valido).toBeFalsy();
})

test('E-mail com dominio incorreto', () => {
  const valido = validarEmail('usuario@gmail');
  expect(valido).toBeFalsy();
})

test('E-mail com dominio incorreto 2', () => {
  const valido = validarEmail('usuario@gmail.');
  expect(valido).toBeFalsy();
})

test('E-mail valido', () => {
  const valido = validarEmail('usuario@gmail.com');
  expect(valido).toBeTruthy();
})

test('E-mail valido 2', () => {
  const valido = validarEmail('usuario@gmail.com.br');
  expect(valido).toBeTruthy();
})