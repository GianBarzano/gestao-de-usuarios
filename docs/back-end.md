[Inicio](../README.md) > Servidor Back-end
# Servidor Back-end
O back-end está feito em NodeJs, utilizando a biblioteca Express.

## Testes unitários
  - O projeto conta com testes unitários utilizando a biblioteca Jest.
  - Para executar os testes
  - Rode
``` $ docker-compose run back yarn run test ```
  - Para executar um caminho de teste especifico, digite total ou parcialmente o nome dele após o comando "test".
  - Por exemplo, para o arquivo usuariocontroller
``` $ docker-compose run back yarn run test /usuariocontroller.test```
  - Para executar um teste ou grupo de testes(describe) específico dentro do arquivo, utilize o parametro "-t"
  - Por exemplo, para o arquivo usuariocontroller, grupo de testes "Logar".
  - Rode
``` $ docker-compose run back yarn run test /usuariocontroller.test -t Logar```
  - Note que os demais testes do arquivo que não derem "match", serão ignorados.