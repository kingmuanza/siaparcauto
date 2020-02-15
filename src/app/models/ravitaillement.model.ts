import { Fournisseur } from './fournisseur.model';
import { Vehicule } from './vehicule.model';
import * as uuid from 'uuid';
import { Conducteur } from './conducteur.model';

export class Ravitaillement {

    id: string;
    vehicule: Vehicule;
    nombreLitre: number;
    prixLitre: number;
    prixTotal: number;
    date: Date;
    carburant: string;
    acheteur: any;
    referenceFacture: string;
    fournisseur: Fournisseur;
    conducteur: Conducteur;

    constructor() {
        this.id = uuid();
        console.log('this.id');
        console.log(this.id);
    }

}
