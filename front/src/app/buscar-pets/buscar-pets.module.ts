import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuscarPetsRoutingModule } from './buscar-pets-routing.module';
import { BuscarPetsComponent } from './buscar-pets.component';
import { SharedModule } from '../shared/shared.module';
import { BuscarPetsService } from './buscar-pets.service';

@NgModule({
  declarations: [
    BuscarPetsComponent,
  ],
  imports: [
    CommonModule,
    BuscarPetsRoutingModule,
    SharedModule
  ],
  providers: [
    BuscarPetsService
  ]
})
export class BuscarPetsModule {}
