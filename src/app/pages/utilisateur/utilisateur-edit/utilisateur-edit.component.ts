import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-utilisateur-edit',
  templateUrl: './utilisateur-edit.component.html',
  styleUrls: ['./utilisateur-edit.component.scss']
})
export class UtilisateurEditComponent implements OnInit {

  utilisateurForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  compte: Utilisateur;

  CARBURANTS = ['DIESEL', 'GASOIL'];
  conducteurs = [];
  sites = [];
  vehicules = [];
  isResponsable = false;
  inactif = false;

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initUtilisateurForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getUtilisateur(id).then(() => {
          this.initUtilisateurForm();
        });
      }
    });
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
    this.getSites();
  }

  getSites() {
    const db = firebase.firestore();
    db.collection('sites').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.sites.push(resultat.data());
      });
      this.initUtilisateurForm();
    });
    console.log('this.sites');
    console.log(this.sites);
  }


  getUtilisateur(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('utilisateurs').doc(id).get().then((resultat) => {
        console.log('Compte');
        console.log(resultat.data());
        this.compte = resultat.data() as Utilisateur;
        if (this.compte.type === 'Responsable') {
          this.isResponsable = true;
        }
        resolve();
      });
    });
  }

  initUtilisateurForm() {
    this.utilisateurForm = this.formBuilder.group({
      email: [this.compte ? this.compte.email : '', [Validators.required]],
      passe: ['', this.compte ? [] : [Validators.required]],
      noms: [this.compte ? this.compte.noms : '', [Validators.required]],
      prenoms: [this.compte ? this.compte.prenoms : '', [Validators.required]],
      type: [this.compte ? this.compte.type : '', [Validators.required]],
      site: [this.compte ? this.compte.site : '', []]
    });
    this.utilisateurForm.controls.type.valueChanges.subscribe((val) => {
      console.log('val');
      console.log(val);
      if (val === 'Responsable') {
        this.isResponsable = true;
      } else {
        this.isResponsable = false;
      }
    });
    if (this.compte) {
      this.sites.forEach((s) => {
        if (this.compte && this.compte.site.id && this.compte.site.id === s.id) {
          this.utilisateurForm.controls.site.setValue(s);
        }
      });
    }
  }

  // enregistrement de l'authentification
  authentification(login: string, passe: string): Promise<firebase.User> {
    let user: firebase.User;
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(login, passe).then((resultat) => {
        user = resultat.user;
        resolve(user);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  onUtilisateurFormSubmit() {
    this.inactif = true;
    const valueForm = this.utilisateurForm.value;
    const login = valueForm.email;
    const passe = valueForm.passe;
    const noms = valueForm.noms;
    const prenoms = valueForm.prenoms;
    const site = valueForm.site;
    const type = valueForm.type;
    let user: firebase.User;

    if (this.compte) {
      this.compte.noms = noms;
      this.compte.prenoms = prenoms;
      this.compte.site = site;
      this.compte.type = type;
      this.saveToDatabase(this.compte);

    } else {
      this.authentification(login, passe).then((u) => {
        user = u;
        console.log(valueForm);
        const utilisateur = new Utilisateur(u.uid, u.uid, login, noms, prenoms);
        utilisateur.user = user;
        utilisateur.site = site;
        utilisateur.type = type;
        this.saveToDatabase(utilisateur);
      }).catch((e) => {
        alert(e);
      });
    }

  }

  saveToDatabase(utilisateur: Utilisateur) {
    console.log(utilisateur);
    const parse = JSON.parse(JSON.stringify(utilisateur));
    const db = firebase.firestore();
    db.collection('utilisateurs').doc(utilisateur.id).set(parse).then(() => {
      console.log('Enregistré');
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.inactif = false;
      this.router.navigate(['utilisateur']);
    });
  }



}
