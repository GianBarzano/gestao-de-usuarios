import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MyCustomLoadingService {
  private myObservable: Subject<IMyCustomLoadingConfig>;

  constructor() {
    this.myObservable = new Subject<IMyCustomLoadingConfig>();
  }

  /**
   * Apresenta o toaster de mensagem
   * @param config 
   */
  mostrar(config: IMyCustomLoadingMostrarConfig){
    let configLoading: IMyCustomLoadingConfig = {
      ...config,
      ativo: true
    }
    this.myObservable.next(configLoading);
  }

  /**
   * Fecha o loading, caso esteja aberto
   */
  fechar(){
    this.myObservable.next({
      ativo: false
    });
  }

  /**
   * Retorna observable de toaster
   */
  escutar(){
    return this.myObservable.asObservable();
  }
}

export interface IMyCustomLoadingMostrarConfig {
  mensagem?: string;
}
export interface IMyCustomLoadingConfig extends IMyCustomLoadingMostrarConfig {
  ativo: boolean;
}