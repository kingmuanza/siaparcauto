import { Injectable } from '@angular/core';
import { Utilisateur } from '../models/utilisateur.model';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class IdentificationService {

  utilisateur: Utilisateur;
  utilisateurSubject: Subject<Utilisateur>;

  constructor() {
    this.utilisateurSubject = new Subject();
  }


  emit() {
    this.utilisateurSubject.next(this.utilisateur);
  }

  signIn(email, passe) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, passe).then((credentials) => {
        console.log('Connexion effectuée');
        console.log(credentials.user.uid);
        const uid = credentials.user.uid;
        this.getUtilisateur(uid, email).then((utilisateur) => {
          this.utilisateur = utilisateur;
          this.emit();
          resolve(this.utilisateur);
        }).catch(() => {
          console.log('Edition du profil');
        });

      }).catch((e) => {
        console.log('Erreur de connexion');
        console.log(e);
      });
    });
  }

  getUtilisateur(id, email): Promise<Utilisateur> {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('utilisateurs').doc(id).get().then((documentSnap) => {
        const utilisateur = documentSnap.data() as Utilisateur;
        if (utilisateur) {
          resolve(utilisateur);
        } else {
          console.log('Les données de l\'utilisateur ont été supprimées');
          const utilisateurParDefaut = new Utilisateur(id, id, email, '', '');
          resolve(utilisateurParDefaut);
        }
      });
    });


  }
}
