export interface IFiltrosBuscaPet {
    pos?: IPosition;
    perdido?: boolean;
}

export interface IPosition {
    lat: number;
    lng: number;
}