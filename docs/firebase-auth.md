[Inicio](../README.md) > Firebase Authentication
# Firebase Authentication
O controle de autenticação do usuário foi realizado pelo Firebase Authentication em conjunto com o servidor back-end nos seguintes fluxos:

  - ### Cadastro do usuário
    1. Aplicação front-end envia informações de cadastro para o servidor back-end.
    2. Servidor Back-end verifica com Firebase se e-mail já está em uso.
    3. Servidor Back-end cadastra o usuário no banco de dados com identificador único.
    4. Servidor Back-end cadastra o usuário no Firebase, enviando identificador único do usuário.
    5. Servidor Back-end retorna sucesso à aplicação front-end, informando token customizado.
    6. Aplicação front-end envia token customizado ao Firebase para realizar login.
    7. Usuário está autenticado.
  - ### Login do usuário:
    - #### Por e-mail:
      1. Aplicação front-end envia informações de login ao Firebase.
      2. Firebase retorna sucesso.
      3. Usuário está autenticado.
    - #### Por CPF ou PIS/PASEP:
      1. Aplicação front-end envia informações de login para o servidor back-end.
      2. Servidor back-end busca o usuário por CPF ou PIS/PASEP.
      3. Servidor back-end solicita ao Firebase um token customizado, gerado a partir do identificador único do usuário.
      4. Servidor back-end retorna sucesso à aplicação front-end, informando token customizado.
      5. Aplicação front-end envia token customizado ao Firebase para realizar login.
      6. Usuário está autenticado.
  - ### Validação de usuário autenticado no Servidor back-end:
    1. Sempre que a aplicação front-end realiza login, o firebase retorna um ID_TOKEN.
    2. Aplicação front-end envia requisições ao servidor back-end, informando ID_TOKEN no cabeçalho Authorization.
    3. Servidor back-end solicita ao Firebase a decodificação do ID_TOKEN informado, onde está presente o identificador único do usuário.
    4. Servidor back-end realiza processamento da api e envia retorno à aplicação front-end.
  - ### Atualização do usuário
    1. Aplicação front-end envia requisição ao servidor back-end.
      - Em caso de alteração de e-mail, servidor back-end consulta o Firebase se e-mail já está em uso, retornando falha caso esteja.
    2. Servidor back-end atualiza usuário do banco de dados.
    3. Servidor back-end solicita ao Firebase atualização do usuário.
    4. Servidor back-end retorna sucesso à aplicação front-end.
  - ### Exclusão de conta
    1. Aplicação front-end envia requisição ao servidor back-end.
    2. Servidor back-end exclui usuário do banco de dados.
    3. Servidor back-end solicita ao Firebase exclusão do usuário.
    4. Servidor back-end retorna sucesso à aplicação front-end.
    5. Aplicação front-end envia para página de login.