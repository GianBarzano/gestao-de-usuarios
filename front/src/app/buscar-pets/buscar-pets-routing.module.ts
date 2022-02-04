import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarPetsComponent } from './buscar-pets.component';

const routes: Routes = [
  { path: '', component: BuscarPetsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscarPetsRoutingModule {}
