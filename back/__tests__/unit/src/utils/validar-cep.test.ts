import { test, expect} from '@jest/globals';
import { validarCEP } from '../../../../src/utils';

test('CEP vazio', () => {
  const valido = validarCEP('');
  expect(valido).toBeFalsy();
})

test('CEP menor que 8 numeros', () => {
  const valido = validarCEP('1234567');
  expect(valido).toBeFalsy();
})

test('CEP maior que 8 numeros', () => {
  const valido = validarCEP('123456789');
  expect(valido).toBeFalsy();
})

test('CEP com 7 numeros e uma letra', () => {
  const valido = validarCEP('1234567A');
  expect(valido).toBeFalsy();
})

test('CEP válido', () => {
  const valido = validarCEP('12345678');
  expect(valido).toBeTruthy();
})