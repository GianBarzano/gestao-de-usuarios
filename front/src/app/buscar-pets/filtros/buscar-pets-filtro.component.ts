import { Component, Input, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { IFiltrosBuscaPet } from './filtros';

@Component({
  selector: 'app-buscar-pets-filtro',
  templateUrl: './buscar-pets-filtro.component.html',
  styleUrls: ['./buscar-pets-filtro.component.scss']
})
export class BuscarPetsFiltroComponent implements OnInit {
  @Input() filtros: IFiltrosBuscaPet = {};

  constructor() { }

  ngOnInit(): void {
    const filtros: IFiltrosBuscaPet = {
      pos: {
        lat: environment.buscaPetsLocalizacaoDefault.lat, 
        lng: environment.buscaPetsLocalizacaoDefault.lng
      },
      perdido: false,
      ...this.filtros
    }
    if (filtros.pos != null) {
      filtros.pos = {...filtros.pos};
    }
    this.filtros = {...filtros};
  }
}