import * as uuid from 'uuid';

export class Departement {
    id: string;
    code: string;
    nom: string;
    parent: Departement;
    niveau: number;

    constructor(code: string, nom: string, parent?: Departement) {
        this.id = uuid();
        if (code) {
            this.code = code;
        }
        if (nom) {
            this.nom = nom;
        }
        if (parent) {
            this.parent = parent;
            if (this.parent.niveau) {
                this.niveau = this.parent.niveau + 1;
            } else {
                this.niveau = 1;
            }
        } else {
            this.niveau = 0;
        }
    }
}
