export function validarEmail(email) {
  const validador = /\S+@\S+\.\S+/;
  return validador.test(email);
}