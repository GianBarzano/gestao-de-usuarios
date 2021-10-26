import { test, expect} from '@jest/globals';
import { validarCPF } from '../../../../src/utils';

test('CPF vazio', () => {
  const valido = validarCPF('');
  expect(valido).toBeFalsy();
})

test('CPF menor que 11 caracteres', () => {
  const CPFValido = validarCPF('0123456789');
  expect(CPFValido).toBeFalsy();
})

test('CPF com letras', () => {
  const CPFValido = validarCPF('1122CC12312');
  expect(CPFValido).toBeFalsy();
})

test('CPF valido 1', () => {
  const CPFValido = validarCPF('22427156078');
  expect(CPFValido).toBeTruthy();
})

test('CPF valido 2', () => {
  const CPFValido = validarCPF('92850106011');
  expect(CPFValido).toBeTruthy();
})

test('CPF valido 3', () => {
  const CPFValido = validarCPF('49967453044');
  expect(CPFValido).toBeTruthy();
})