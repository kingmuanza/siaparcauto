import * as uuid from 'uuid';
import { Conducteur } from './conducteur.model';
import { Site } from './site.model';
import { Departement } from './departement.model';
import { Leasing } from './leasing.model';

export class Vehicule {
    id: string;
    immatriculation: string;
    dateFinCarteGrise?: Date;
    modele: string;
    chevaux: string;
    dateAcquisition: Date;
    siteActuel: Site;
    direction: Departement;
    type: string;
    etat: string;
    departementActuel: Departement;
    proprietaire: boolean;
    leasing: Leasing;



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
