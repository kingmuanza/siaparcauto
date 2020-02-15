import { Vehicule } from './vehicule.model';
import { Fournisseur } from './fournisseur.model';
import * as uuid from 'uuid';
import { Conducteur } from './conducteur.model';

export class Visite {

    id: string;
    vehicule: Vehicule;
    prixTotal: number;
    date: Date;
    dateLimite: Date;
    prestataire: string;
    reference?: string;
    conducteur: Conducteur;

    constructor() {

        this.id = uuid();
        console.log('this.id');
        console.log(this.id);

    }

}
