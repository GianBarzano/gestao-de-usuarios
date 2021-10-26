import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MyCustomToasterService {
  private myObservable: Subject<IMyCustomToasterConfig>;

  constructor() {
    this.myObservable = new Subject<IMyCustomToasterConfig>();
  }

  /**
   * Apresenta o toaster de mensagem
   * @param config 
   */
  mostrar(config: IMyCustomToasterMostrarConfig){
    let configToaster: IMyCustomToasterConfig = {
      ...config,
      id: (new Date()).getTime().toString()
    }
    this.myObservable.next(configToaster);
  }

  /**
   * Retorna observable de toaster
   */
  escutar(){
    return this.myObservable.asObservable();
  }
}

export interface IMyCustomToasterMostrarConfig {
  tipo: 'sucesso' | 'erro',
  mensagem: string
}

export interface IMyCustomToasterConfig extends IMyCustomToasterMostrarConfig {
  id: string
}