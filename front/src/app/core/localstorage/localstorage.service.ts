import { Injectable } from '@angular/core';


@Injectable()
export class LocalStorageService {
  private storage: Storage = window.localStorage
  
  constructor() {}

  set(chave: string, valor: any): boolean{
    if (this.storage) {
      this.storage.setItem(chave, JSON.stringify(valor));
      return true;
    }
    
    return false;
  }

  get(chave: string): any {
    if (this.storage) {
      const dados = this.storage.getItem(chave);
      if (dados != null) {
        return JSON.parse(dados);
      }
    }

    return null;
  }

  remove(chave: string): boolean{
    if (this.storage) {
      this.storage.removeItem(chave);
      return true;
    }
    
    return false;
  }

  clear(): boolean{
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    
    return false;
  }
}
