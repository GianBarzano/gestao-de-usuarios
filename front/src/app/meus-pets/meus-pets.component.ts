import { Component, OnInit } from '@angular/core';
import { MyCustomLoadingService } from '../shared/my-custom-loading/my-custom-loading.service';
import { MyCustomToasterService } from '../shared/my-custom-toaster/my-custom-toaster.service';
import { MeusPetsService } from './meus-pets.service';

@Component({
  selector: 'app-meus-pets',
  templateUrl: './meus-pets.component.html',
  styleUrls: ['./meus-pets.component.scss']
})
export class MeusPetsComponent implements OnInit {
  listaPets: any = {
    lista: [],
    page: 1,
    pages: 1
  }
  constructor(
    private service: MeusPetsService,
    private toaster: MyCustomToasterService,
    private loading: MyCustomLoadingService
  ) { }

  ngOnInit(): void {
    this.listarPets();
  }

  /**
   * Lista os pets do usuário
   */
  private listarPets(){
    this.loading.mostrar({mensagem: 'Buscando pets...'});
    // Busco usuário da api
    this.service
      .listar()
      .then((listaPetsRes) => {
        this.listaPets = listaPetsRes;
      })
      .catch((err) => {
        this.toaster.mostrar({
          tipo: 'erro',
          mensagem: 'Não foi possível buscar a listagem de pets!'
        })
      })
      .finally(() => {
        // Desativo loading
        this.loading.fechar();
      })
  }
}