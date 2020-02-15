import { Vehicule } from './vehicule.model';
import { Conducteur } from './conducteur.model';
import * as uuid from 'uuid';

export class Affectation {

    id: string;
    vehicule: Vehicule;
    conducteur: Conducteur;
    date: Date;
    motif: string;
    dureeAutorisee?: number;
    decision?: string;

    constructor() {

        this.id = uuid();
        console.log('this.id');
        console.log(this.id);

    }
}
