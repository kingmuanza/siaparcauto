import * as uuid from 'uuid';

export class Site {

    id: string;
    code: string;
    nom: string;

    constructor(code: string, nom: string) {
        this.id = uuid();
        if (code) {
            this.code = code;
        }
        if (nom) {
            this.nom = nom;
        }
    }

}
