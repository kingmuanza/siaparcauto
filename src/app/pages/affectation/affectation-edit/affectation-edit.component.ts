import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Affectation } from 'src/app/models/affectation.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import * as firebase from 'firebase';
import { muanza } from '../../../../assets/js/muanza';

@Component({
  selector: 'app-affectation-edit',
  templateUrl: './affectation-edit.component.html',
  styleUrls: ['./affectation-edit.component.scss']
})
export class AffectationEditComponent implements OnInit {

  affectationForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  affectation: Affectation;

  CARBURANTS = ['DIESEL', 'GASOIL'];
  conducteurs = [];
  vehicules = [];
  enSynchronisation = false;

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.enSynchronisation = true;
    this.initAffectationForm();
    this.getVehicules().then(() => {
      console.log('Vehiles OK');
      this.getConducteurs().then(() => {
        console.log('Conducteurs OK');
        this.route.paramMap.subscribe((paramMap) => {
          const id = paramMap.get('id');
          if (id) {
            this.getAffectation(id).then(() => {
              this.enSynchronisation = false;
              this.initAffectationForm();
            });
          }
        });
      });
    });

    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
  }

  getConducteurs() {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('conducteurs').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log(resultat.data());
          this.conducteurs.push(resultat.data());
        });
        resolve();
      });
    });
  }

  getVehicules() {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('vehicules').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log(resultat.data());
          this.vehicules.push(resultat.data());
        });
        resolve();
      });
    });
  }


  getAffectation(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('affectations').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.affectation = resultat.data() as Affectation;
        resolve();
      });
    });
  }

  initAffectationForm() {
    this.affectationForm = this.formBuilder.group({
      conducteur: [this.affectation ? this.affectation.conducteur : '', [Validators.required]],
      date: [this.affectation ? this.currentDate(this.affectation.date) : this.currentDate(), []],
      vehicule: [this.affectation ? this.affectation.vehicule : '', [Validators.required]],
      decision: [this.affectation ? this.affectation.decision : '', []],
      motif: [this.affectation ? this.affectation.motif : '', []]
    });
  }

  currentDate(dateImmatriculation?: Date) {
    if (dateImmatriculation) {
      return new Date(dateImmatriculation).toISOString().substring(0, 10);
    }
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }

  onAffectationFormSubmit() {
    const valueForm = this.affectationForm.value;
    const email = valueForm.login;
    const passe = valueForm.passe;
    console.log(valueForm);
    let affectation = new Affectation();
    if (this.affectation) {
      affectation = this.affectation;
    }
    affectation.date = new Date(valueForm.date);
    affectation.conducteur = valueForm.conducteur;
    affectation.vehicule = valueForm.vehicule;
    affectation.motif = valueForm.motif;
    affectation.decision = valueForm.decision;

    console.log(affectation);
    const parse = JSON.parse(JSON.stringify(affectation));

    const db = firebase.firestore();
    db.collection('affectations').doc(affectation.id).set(parse).then(() => {
      this.updateVehicule(affectation).then(() => {
        muanza().notify.create('Enregistré avec succès', null, {
          cls: 'success'
        });
        this.router.navigate(['affectation']);
      });
    }).catch((e) => {
      muanza().notify.create('Echec d\'enregistrement', null, {
        cls: 'alert'
      });
    });
  }

  updateVehicule(affectation: Affectation) {
    return new Promise((resolve, reject) => {
      affectation.vehicule.conducteur = affectation.conducteur;
      const vehicule = JSON.parse(JSON.stringify(affectation.vehicule));
      const db = firebase.firestore();
      db.collection('vehicules').doc(vehicule.id).set(vehicule).then(() => {
        console.log('Enregistré');
        // Metro.notify.create('Enregistré', '', { cls: 'success' });
        resolve();
      }).catch((e) => {
        reject(e);
      });
    });
  }

}
