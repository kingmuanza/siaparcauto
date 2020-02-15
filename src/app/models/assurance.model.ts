import { Vehicule } from './vehicule.model';
import * as uuid from 'uuid';
import { Conducteur } from './conducteur.model';

export class Assurance {
    id: string;
    vehicule: Vehicule;
    date: Date;
    prixTotal: number;
    prestataire: string;
    dateLimite: Date;
    conducteur?: Conducteur;

    constructor() {

        this.id = uuid();
        console.log('this.id');
        console.log(this.id);

    }
}
