export function validarPIS(pis: string) {
  if (pis == null) {
    return false;
  }
  
  if (typeof(pis) == 'number') {
    pis = (<number>pis).toString();
  } else if (typeof(pis) != 'string') {
    return false;
  }
  
  pis = pis.replace(/[^\d]/g,'');
  
  if (pis.length != 11) {
    return false;
  }
  
  const pesos = [3,2,9,8,7,6,5,4,3,2];
  
  let totalSoma = 0;
  pesos.forEach((peso, index) => {
    totalSoma += peso * parseInt(pis[index]);    
  });
  
  const resto = totalSoma % 11;
  
  const resultado = 11 - resto;
  const digitoResultado = (resultado < 10) ? resultado : 0;
  
  const digitoTeste = parseInt(pis[10]);
  
  return digitoTeste == digitoResultado;
}