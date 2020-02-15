import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Reparation } from 'src/app/models/reparation.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';

@Component({
  selector: 'app-reparation-edit',
  templateUrl: './reparation-edit.component.html',
  styleUrls: ['./reparation-edit.component.scss']
})
export class ReparationEditComponent implements OnInit {


  reparationForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  reparation: Reparation;

  CARBURANTS = ['DIESEL', 'GASOIL'];
  conducteurs = [];
  vehicules = [];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.initReparationForm();
    this.getVehicules().then(() => {
      console.log('Vehiles OK');
      this.getConducteurs().then(() => {
        console.log('Conducteurs OK');
        this.route.paramMap.subscribe((paramMap) => {
          const id = paramMap.get('id');
          if (id) {
            this.getReparation(id).then(() => {
              this.initReparationForm();
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


  getReparation(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('reparations').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.reparation = resultat.data() as Reparation;
        resolve();
      });

    });
  }

  initReparationForm() {
    this.reparationForm = this.formBuilder.group({
      date: [this.reparation ? this.currentDate(this.reparation.date) : this.currentDate(), []],
      vehicule: [this.reparation ? this.reparation.vehicule : '', [Validators.required]],
      effectuePar: [this.reparation ? this.reparation.effectuePar : '', []],
      description: [this.reparation ? this.reparation.description : 'Aucune description', []],
      coutTotal: [this.reparation ? this.reparation.coutTotal : 0, []]
    });
  }

  currentDate(dateImmatriculation?: Date) {
    if (dateImmatriculation) {
      return new Date(dateImmatriculation).toISOString().substring(0, 10);
    }
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }

  onReparationFormSubmit() {
    const valueForm = this.reparationForm.value;
    console.log(valueForm);
    let reparation = new Reparation();
    if (this.reparation) {
      reparation = this.reparation;
    }
    reparation.date = new Date(valueForm.date);
    reparation.vehicule = valueForm.vehicule;
    reparation.coutTotal = valueForm.coutTotal;
    reparation.effectuePar = valueForm.effectuePar;
    reparation.description = valueForm.description;
    if (reparation.vehicule.conducteur) {
      reparation.conducteur = reparation.vehicule.conducteur;
    }

    console.log(reparation);
    const parse = JSON.parse(JSON.stringify(reparation));

    const db = firebase.firestore();
    db.collection('reparations').doc(reparation.id).set(parse).then(() => {
      console.log('Enregistré');
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.router.navigate(['reparation']);
    });
  }
}
