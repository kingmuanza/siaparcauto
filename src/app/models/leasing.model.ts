import * as uuid from 'uuid';
export class Leasing {
    id: string;
    code: string;
    nom: string;

    constructor(code, nom) {
        this.id = uuid();
        if (code) {
            this.code = code;
        }
        if (nom) {
            this.nom = nom;
        }
    }

}
