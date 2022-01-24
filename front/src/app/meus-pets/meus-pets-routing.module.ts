import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeusPetsEditComponent } from './edit/meus-pets-edit.component';
import { MeusPetsComponent } from './meus-pets.component';

const routes: Routes = [
  { path: '', component: MeusPetsComponent },
  { path: 'edit/:id', component: MeusPetsEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeusPetsRoutingModule {}
