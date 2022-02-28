import { Injectable } from '@angular/core';
import { Loader } from "@googlemaps/js-api-loader";
import { environment } from 'src/environments/environment';


@Injectable()
export class MapasService {
    private mapsLoader = new Loader ({
        apiKey: environment.mapsKey,
        libraries: [
          'places'
        ]
    });

    init(): Promise<void>{
        return new Promise((res, rej) => {
            this.mapsLoader.load()
                .then(() => {
                    res();
                })
                .catch(err => rej(err));
        })
    }
}