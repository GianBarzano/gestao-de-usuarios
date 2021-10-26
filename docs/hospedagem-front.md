[Inicio](../README.md) > Hospedagem da aplicação Front-end
# Hospedagem da aplicação Front-end
A hospedagem do Front-end foi realizada no **Firebase Hosting**. Para isso, no diretório da aplicação front-end("./front"), existem dois arquivos de configuração que serão utilizados no momento do deploy:
  - ### .firebaserc
    - Neste arquivo especifico meu projeto no firebase e dou o apelido de "prod".
  - ### firebase.json
    - Neste arquivo especifico as configurações do hosting do firebase para subir meu projeto, na propriedade "hosting". O campo "public" especifica minha pasta no projeto que será realizado o upload.