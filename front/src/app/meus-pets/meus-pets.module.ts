import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeusPetsRoutingModule } from './meus-pets-routing.module';
import { MeusPetsComponent } from './meus-pets.component';
import { SharedModule } from '../shared/shared.module';
import { MeusPetsService } from './meus-pets.service';
import { MeusPetsEditComponent } from './edit/meus-pets-edit.component';

@NgModule({
  declarations: [
    MeusPetsComponent,
    MeusPetsEditComponent
  ],
  imports: [
    CommonModule,
    MeusPetsRoutingModule,
    SharedModule
  ],
  providers: [
    MeusPetsService
  ]
})
export class MeusPetsModule {}
