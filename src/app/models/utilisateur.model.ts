export class Utilisateur {
    id: string;
    uid: string;
    noms: string;
    prenoms?: string;
    email: string;

    constructor(id, uid, email, noms, prenoms) {
        this.id = id ? id : undefined;
        this.uid = uid ? uid : undefined;
        this.email = email ? email : undefined;
        this.noms = noms ? noms : undefined;
        this.prenoms = prenoms ? prenoms : undefined;
    }
}

