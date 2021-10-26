[Inicio](../README.md) > Ambiente de desenvolvimento
# Ambiente de desenvolvimento
O ambiente de desenvolvimento foi configurado com **Docker**, utilizando o arquivo docker-compose.yml para levantar os containers de Front-end, Back-end e Banco de dados.

## Levantar aplicação
  - Para subir o projeto é necessário possuir docker e docker-compose no seu computador.
  - [Link de instalação do docker](https://docs.docker.com/get-docker/)
  - [Link de instalação do docker-compose](https://docs.docker.com/compose/install/)

  - ### Servidor back-end
    - Subir aplicação back-end e banco de dados, que está listado como uma dependencia. 
    - Crie o arquivo **common.env** na pasta "./back", copiando o arquivo de exemplo **common.env.dist**. As variáveis de banco de dados já estão configuradas para o banco levantado pelo container definido no docker-compose.
    - Ainda no arquivo **common.env** criado, preencha as variáveis referentes ao seu projeto no **Firebase**.
    - Instale as dependências:
    - Rode:
    ``` $ docker-compose run back yarn ```    
    - Rode: 
  ``` $ docker-compose up -d back ```
    - Esse comando levanta o serviço "back" definido no docker-compose, sem prender o terminal.
    - Para verificar os logs rode:
  ``` $ docker-compose logs -f ```

  - ### Estrutura do Banco de dados
    - Após subir o servidor back-end e o banco de dados, é necessário criar a estrutura de tabelas da aplicação, o que será feito através de **migrations**.
    - Rode: 
  ``` $ docker-compose run back yarn run migrate:up-prod ```
    - Esse comando executa, dentro do serviço "back" definido no docker-compose, o comando "yarn run migrate:up-prod".
    - Isso vai rodar o script "migrate:up-prod" definido no arquivo "package.json" do projeto back.
    - Esse script executa todas as migrações de banco **que ainda não foram executadas no banco levantado**

  - ### Aplicação front-end
    - Com o servidor do back-end configurado e levantado, agora podemos configurar o front-end do projeto.
    - Instale as dependências:
    - Rode:
    ``` $ docker-compose run front yarn ```    
    - Crie o arquivo **env-config.json** na pasta "./front/src/environments", copiando o arquivo de exemplo **env-config.dist.json**. A propriedade "host_api" indica o endereço do servidor. Neste caso, o endereço do servidor local que você levantou, disponível em "http://localhost:3333/".
    - Ainda no arquivo **env-config.json** criado, preencha as variáveis referentes ao seu projeto no **Firebase**.
    - Rode: 
  ``` $ docker-compose up -d front ```
    - Esse comando levanta o serviço "front" definido no docker-compose, sem prender o terminal.
    - Para subir e manter a aplicação front-end presa ao seu terminal, o que facilita na hora de derrubar:
    - Rode
  ``` $ docker-compose up front ```

## Serviços docker-compose.yml
  - ### back: 
    - Imagem utilizada: "node:12.18-alpine".
    - Volume: Indica a pasta do aplicativo no container com a pasta "./back" do projeto.
    - Variáveis de ambiente: Indica o arquivo "common.env" da pasta "./back".
    - Portas:
      - 3333: Utilizada para subir o servidor Back-end.
      - 9229: Utilizada para debugar o servidor Back-end.
    - Depende do serviços de banco de dados "db".
    - Roda o comando "yarn run dev" ao ser levantado.
  - ### db: 
    - Imagem utilizada: "postgres".
    - Volume: Indica a pasta do aplicativo no container com a pasta "./banco/pgdata" do projeto, em que os arquivos do banco serão salvos.
    - Credenciais: Na seção "environment" define as credencias do banco de dados pelas variáveis:
      - POSTGRES_DB: Nome do banco de dados.
      - POSTGRES_USER: Usuário do banco de dados.
      - POSTGRES_PASSWORD: Senha do banco de dados.
    - Portas:
      - 5432: Porta de conexão com o banco de dados.
  - ### front: 
    - Imagem utilizada: "node:12.18-alpine".
    - Volume: Indica a pasta do aplicativo no container com a pasta "./front" do projeto.
    - Portas:
      - 4200: Utilizada para subir o servidor Front-end.
      - 9876: Utilizada para testes o servidor Front-end.