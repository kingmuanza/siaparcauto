import { Vehicule } from './vehicule.model';
import * as uuid from 'uuid';
import { Conducteur } from './conducteur.model';

export class ReleveKilometrique {

    id: string;
    date: Date;
    quantite: number;
    unite: string;
    vehicule: Vehicule;
    conducteur?: Conducteur;

    constructor() {
        this.id = uuid();
        console.log('this.id');
        console.log(this.id);
    }

}
