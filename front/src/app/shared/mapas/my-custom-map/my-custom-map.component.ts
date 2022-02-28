import { Component, OnInit } from '@angular/core';
import { MapasService } from '../mapas.service';

declare var google: any;

@Component({
  selector: 'my-custom-map',
  templateUrl: './my-custom-map.component.html',
  styleUrls: ['./my-custom-map.component.scss']
})
export class MyCustomMapComponent implements OnInit {
  public mapa: any;
  public marcador: any;
  public autocomplete: any;

  constructor(
    public mapas: MapasService
  ) { }

  ngOnInit(): void {
    this.carregarMapa();
  }

  private carregarMapa(){
    this.mapas.init().then(() => {
      this.mapa = new google.maps.Map(document.getElementById('mapa') as HTMLElement, {
        zoom: 15,
        center: {lat: 30, lng: -110},
        mapTypeControl: false
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          let position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
  
          // Adiciono marcador ao local
          this.setMarcadorPrincipal(position);
        
          this.mapa.addListener('click', (ev: any) => {
            this.setMarcadorPrincipal(ev.latLng, false);
          });
        }, (err) => {
          console.log("Não foi possível buscar localização atual");
        },{
          maximumAge:10000, 
          timeout:5000, 
          enableHighAccuracy: true
        })
      }
      
      this.initAutoComplete();
    }).catch((err) => {
      console.log("Não foi possível carregar o mapa", err);
    });
  }

  private initAutoComplete(){
    const input = document.getElementById("autocomplete") as HTMLInputElement;
    const options = {
      // types: ["geocode"],
      fields: ['geometry'],
      componentRestrictions: {
        country: 'br'
      }
    }
    this.autocomplete = new google.maps.places.Autocomplete(
      input, options
    );

    // Adiciono evento chamado ao se escolher um endereço, e seto o marcador principal com a localização.
    this.autocomplete.addListener("place_changed", () => {
      const place = this.autocomplete.getPlace();
      this.setMarcadorPrincipal(place.geometry.location);
    });
  }

  private setMarcadorPrincipal(position: any, centraliza = true){
    if (this.marcador) {
      this.marcador.setPosition(position);
    } else {
      this.marcador = new google.maps.Marker({
        position: position,
        map: this.mapa
      });
    }

    console.log("OnPositionChange", position);

    if (centraliza) {
      this.mapa.setCenter(position);
      this.mapa.setZoom(15);
    }
  }
}