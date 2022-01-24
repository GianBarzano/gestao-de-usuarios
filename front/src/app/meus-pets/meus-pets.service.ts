import { Injectable } from '@angular/core';
import { ApiService } from '../core/api/api.service';

@Injectable()
export class MeusPetsService {

  constructor(
    private api: ApiService
  ) {}
  
  /**
   * Busca os pets do usuário da api do Back-end
   */
  listar(): Promise<any>{
    return new Promise((res, rej) => {
      this.api.get(`meus-pets`)
        .then((retorno) => {
          res(retorno)
        })
        .catch((error) => {
          res(this.getMockLista());
          // rej(error.error)
        });
    });
  }

  private getMockLista(){
    const arrMockImagens = [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAJtSSphoO1_udb2dMcfRksIILD1yAaBprkw&usqp=CAU',
      'https://www.dogchoni.com.br/assets/uploads/blog/desvende-qual-o-porte-do-seu-cao-srd.png',
      'https://img.clasf.com.br/2020/04/21/doao-de-cachorro-srd-vacinado-e-vermifugado-20200421080653.0987530015.jpg',
      'https://www.petlove.com.br/images/breeds/192401/profile/original/srd-p.jpg?1532539578',
      'https://www.amoviralata.com/wp-content/uploads/2021/01/vira-lata-sem-raca-definida.jpg'
    ];
    // 1 - porte pequeno, 2 - porte medio, 3 - porte grande
    // 1 - Macho, 2 - Fêmea
    // 1 - Canina, 2 - Felina
    let listaPets: any = {
      page: 1,
      pages: 10,
      lista: []
    };
    listaPets.lista.push({
      img: arrMockImagens[0],
      nome: 'Gamora',
      porte: 2,
      nascimento: '2018-11-12',
      raca: 'SRD',
      genero: 2,
      especie: 1,
      distancia: 1
    });
    listaPets.lista.push({
      img: arrMockImagens[1],
      nome: 'Pitoco',
      porte: 2,
      nascimento: '2018-11-12',
      raca: 'SRD',
      genero: 1,
      especie: 1,
      distancia: 3
    });
    listaPets.lista.push({
      img: arrMockImagens[2],
      nome: 'Pipoca',
      porte: 2,
      nascimento: '2018-11-12',
      raca: 'SRD',
      genero: 1,
      especie: 1,
      distancia: 4
    });
    listaPets.lista.push({
      img: arrMockImagens[3],
      nome: 'Sebastião',
      porte: 2,
      nascimento: '2018-11-12',
      raca: 'SRD',
      genero: 1,
      especie: 1,
      distancia: 7
    });
    listaPets.lista.push({
      img: arrMockImagens[4],
      nome: 'Amendoin',
      porte: 2,
      nascimento: '2018-11-12',
      raca: 'SRD',
      genero: 1,
      especie: 1,
      distancia: 13
    });
    
    listaPets.lista = listaPets.lista.map((petApi: any, index: number) => {
      let novoPet = petApi;
      
      // Seto id
      novoPet.id = index + 1;
      // Definição do porte
      switch (petApi.porte) {
        case 1: {
          novoPet.porteDescricao = 'Pequeno';
          break;
        }
        case 2: {
          novoPet.porteDescricao = 'Médio';
          break;
        }
        case 3: {
          novoPet.porteDescricao = 'Grande';
          break;
        }
      }
      // Definição do genero
      switch (petApi.genero) {
        case 1: {
          novoPet.generoDescricao = 'Macho';
          break;
        }
        case 2: {
          novoPet.generoDescricao = 'Fêmea';
          break;
        }
      }
      // Definição do especie
      switch (petApi.especie) {
        case 1: {
          novoPet.especieDescricao = 'Canina';
          break;
        }
        case 2: {
          novoPet.especieDescricao = 'Felina';
          break;
        }
      }

      return novoPet;
    });
    return listaPets;
  }
}
