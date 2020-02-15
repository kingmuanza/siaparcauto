import { Vehicule } from './vehicule.model';
import { Fournisseur } from './fournisseur.model';

export class Intervention {

    id: string;
    vehicule: Vehicule;
    typeService: string;
    cout: number;
    kilometrageAvantIntervention: number;
    date: Date;
    acheteur: any;
    fournisseur: Fournisseur;
    reference: string;

    constructor() {

    }


}
