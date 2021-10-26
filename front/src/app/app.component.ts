import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AuthService } from './core/auth/auth.service';
import { IMyCustomLoadingConfig, MyCustomLoadingService } from './shared/my-custom-loading/my-custom-loading.service';
import { IMyCustomToasterConfig, MyCustomToasterService } from './shared/my-custom-toaster/my-custom-toaster.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tituloTela = 'Gestão usuários';
  iniciado: boolean = false;
  arrToasters: IMyCustomToasterConfig[] = [];
  loadingConfig: IMyCustomLoadingConfig = {
    ativo: false
  }
  constructor(
    updates: SwUpdate,
    private auth: AuthService,
    private toaster: MyCustomToasterService,
    private loading: MyCustomLoadingService
  ){
    updates.available.subscribe(() => {
      updates.activateUpdate()
        .then(() => {
          document.location.reload();
        })
        .catch(() => {});
    });

    this.auth.iniciar()
      .then(() => {
        this.iniciado = true;
      }).catch(() => {});
    
    this.configurarToaster();
    this.configurarLoading();
  }

  /**
   * Configura ativação do toaster
   */
  configurarToaster(){
    this.toaster.escutar().subscribe(
      (config: IMyCustomToasterConfig) => {
        this.arrToasters.push(config);
        setTimeout(() => {
          const indexToaster = this.arrToasters.findIndex((toaster) => {
            return toaster.id == config.id;
          });

          if (indexToaster > -1) {
            this.arrToasters.splice(indexToaster, 1);
          }
        }, 2500);
      }
    )
  }

  /**
   * Configura ativação do loading
   */
  configurarLoading(){
    this.loading.escutar().subscribe(
      (config: IMyCustomLoadingConfig) => {
        setTimeout(() => {
          this.loadingConfig = config;
        });
      }
    )
  }

  usuarioLogado(): boolean {
    return this.iniciado && this.auth.logado;
  }
  /**
   * Desloga do sistema
   */
  async onDeslogarClick(){
    await this.auth.deslogar();
  }
}
