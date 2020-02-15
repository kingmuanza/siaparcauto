import * as uuid from 'uuid';

export class Conducteur {

    id: string;
    noms: string;
    prenoms: string;
    matricule: string;
    cni: string;
    tel: string;
    poste: string;
    numeroPermis: string;

    constructor() {
        this.id = uuid();
        console.log('this.id');
        console.log(this.id);
    }

}
