import { test, expect} from '@jest/globals';
import { validarPIS } from '../../../../src/utils';

test('PIS vazio', () => {
  const pisValido = validarPIS('');
  expect(pisValido).toBeFalsy();
})

test('PIS menor que 11 caracteres', () => {
  const pisValido = validarPIS('0123456789');
  expect(pisValido).toBeFalsy();
})

test('PIS com 11 caracteres', () => {
  const pisValido = validarPIS('01234567890');
  expect(pisValido).toBeFalsy();
})

test('PIS valido 1', () => {
  const pisValido = validarPIS('71583885372');
  expect(pisValido).toBeTruthy();
})

test('PIS valido 2', () => {
  const pisValido = validarPIS('65919240709');
  expect(pisValido).toBeTruthy();
})

test('PIS valido 3', () => {
  const pisValido = validarPIS('12684935280');
  expect(pisValido).toBeTruthy();
})