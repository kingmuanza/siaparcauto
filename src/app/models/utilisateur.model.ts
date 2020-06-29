import { Site } from './site.model';

export class Utilisateur {
    id: string;
    user: firebase.User;
    uid: string;
    noms: string;
    prenoms?: string;
    email: string;
    site: Site;
    type: string;

    constructor(id, uid, email, noms, prenoms) {
        this.id = id ? id : undefined;
        this.uid = uid ? uid : undefined;
        this.email = email ? email : undefined;
        this.noms = noms ? noms : undefined;
        this.prenoms = prenoms ? prenoms : undefined;
    }
}

