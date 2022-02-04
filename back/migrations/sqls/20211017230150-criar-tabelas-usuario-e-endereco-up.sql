CREATE TABLE enderecos (
  id uuid not null,
  pais varchar(50),
  estado char(2),
  municipio varchar(50),
  cep varchar(8),
  rua varchar(50),
  numero varchar(20),
  complemento varchar(50),

  CONSTRAINT "PK.enderecos.id" PRIMARY KEY (id)
);

CREATE TABLE usuarios (
  id uuid not null,
  nome varchar(50) not null,
  email varchar(50) not null,
  senha varchar(100) not null,
  cpf varchar(11),
  pis varchar(11),
  id_endereco uuid,

  CONSTRAINT "PK.usuarios.id" PRIMARY KEY (id),
  CONSTRAINT "FK.usuarios.id_endereco" FOREIGN KEY (id_endereco) REFERENCES enderecos(id)
);