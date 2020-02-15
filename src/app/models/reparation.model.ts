import { Panne } from './panne.model';
import { Vehicule } from './vehicule.model';
import { Conducteur } from './conducteur.model';
import * as uuid from 'uuid';

export class Reparation {

    id: string;
    date: Date;
    panne?: Panne;
    vehicule: Vehicule;
    conducteur?: Conducteur;
    coutTotal: number;
    effectuePar: string;
    description: string;

    constructor() {

        this.id = uuid();
        console.log('this.id');
        console.log(this.id);


    }

}
