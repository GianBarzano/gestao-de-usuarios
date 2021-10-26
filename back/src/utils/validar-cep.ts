export function validarCEP(cep) {
  const validador = /^[0-9]{8}$/;
  return validador.test(cep);
}