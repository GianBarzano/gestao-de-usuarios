-- especie: 1- Canina; 2- Felina
CREATE TABLE pets_racas (
  id uuid not null,
  nome varchar(50) not null,
  especie int not null default 1,

  CONSTRAINT "PK.pets_racas.id" PRIMARY KEY (id)
);

alter table pets add column raca uuid;
alter table pets 
    add constraint "FK.pets.raca" 
    foreign key (raca) 
    references pets_racas(id);