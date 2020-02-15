import * as uuid from 'uuid';
import { Conducteur } from './conducteur.model';

export class Vehicule {
    id: string;
    modele: string;
    immatriculation: string;
    etiquettes: Array<string>;
    dateImmatriculation: Date;
    numeroChassis: string;
    valeurCatalogue: number;
    valeurAchat: number;
    valeurResiduelle: number;
    typeCarburant?: string;
    conducteur?: Conducteur;

    constructor() {

        this.id = uuid();
        console.log('this.id');
        console.log(this.id);

    }

}
