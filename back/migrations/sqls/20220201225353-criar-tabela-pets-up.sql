-- porte: 1- Pequeno; 2- Médio; 3- Grande
-- sexo: 1- Macho; 2- Fêmea
-- especie: 1- Canina; 2- Felina
CREATE TABLE pets (
  id uuid not null,
  nome varchar(50) not null,
  nascimento timestamp without time zone not null,
  porte int not null default 1,
  sexo int not null default 1,
  especie int not null default 1,
  id_usuario uuid not null,

  CONSTRAINT "PK.pets.id" PRIMARY KEY (id),
  CONSTRAINT "FK.pets.id_usuario" 
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id)
);