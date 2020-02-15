import { Vehicule } from './vehicule.model';
import { Conducteur } from './conducteur.model';
import * as uuid from 'uuid';

export class Panne {
    id: string;
    date: Date;
    vehicule: Vehicule;
    conducteur: Conducteur;
    description: string;

    constructor() {

        this.id = uuid();
        console.log('this.id');
        console.log(this.id);
    }
}
