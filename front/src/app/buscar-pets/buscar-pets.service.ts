import { Injectable } from '@angular/core';
import { ApiService } from '../core/api/api.service';

@Injectable()
export class BuscarPetsService {

  constructor(
    private api: ApiService
  ) {}
  
  /**
   * Busca os pets do usuário da api do Back-end
   */
  listar(): Promise<any>{
    return new Promise((res, rej) => {
      this.api.get(`pets`)
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
      sexo: 2,
      especie: 1,
      distancia: 1
    });
    listaPets.lista.push({
      img: arrMockImagens[1],
      nome: 'Pitoco',
      porte: 2,
      nascimento: '2021-10-22',
      raca: 'SRD',
      sexo: 1,
      especie: 1,
      distancia: 3
    });
    listaPets.lista.push({
      img: arrMockImagens[2],
      nome: 'Estrela',
      porte: 1,
      nascimento: '2015-01-25',
      raca: 'SRD',
      sexo: 2,
      especie: 1,
      distancia: 4
    });
    listaPets.lista.push({
      img: arrMockImagens[3],
      nome: 'Sebastião',
      porte: 2,
      nascimento: '2022-01-01',
      raca: 'SRD',
      sexo: 1,
      especie: 1,
      distancia: 7
    });
    listaPets.lista.push({
      img: arrMockImagens[4],
      nome: 'Amendoin',
      porte: 2,
      nascimento: '2018-11-12',
      raca: 'SRD',
      sexo: 1,
      especie: 1,
      distancia: 13
    });
    
    const dataAtual = new Date();

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
      
      const diffMeses = DataDiff.meses(dataAtual, petApi.nascimento);
      if (diffMeses < 2) {
        novoPet.nascimento_descricao = '1 mês';
      } else if (diffMeses < 12) {
        novoPet.nascimento_descricao = `${diffMeses} meses`;
      } else {
        const anos = Math.floor(diffMeses / 12);
        novoPet.nascimento_descricao = `${anos} anos`;
      }

      return novoPet;
    });
    return listaPets;
  }
}

class DataDiff {
  static getData(data: Date | string): Date {
    if (typeof data == 'string') {
      return new Date(data);
    } else {
      return data;
    }
  }

  static meses(dt1: Date | string, dt2: Date | string): number {
    let meses = 0;

    // Converto para date
    dt1 = this.getData(dt1);
    dt2 = this.getData(dt2);

    const diffMills = Math.abs(dt1.getTime() - dt2.getTime());
    // Milisegundos * segundos * minutos * horas * dias do ano
    const anos = diffMills / (1000 * 60 * 60 * 24 * 365.25);
    meses = Math.floor(anos * 12);

    return meses;
  }
}