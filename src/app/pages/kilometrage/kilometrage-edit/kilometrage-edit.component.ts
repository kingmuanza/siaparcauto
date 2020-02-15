import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import { ReleveKilometrique } from 'src/app/models/releve.kilometrique.model';

@Component({
  selector: 'app-kilometrage-edit',
  templateUrl: './kilometrage-edit.component.html',
  styleUrls: ['./kilometrage-edit.component.scss']
})
export class KilometrageEditComponent implements OnInit {

  kilometrageForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  kilometrage: ReleveKilometrique;

  CARBURANTS = ['DIESEL', 'GASOIL'];
  conducteurs = [];
  vehicules = [];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.initKilometrageForm();
    this.getVehicules().then(() => {
      console.log('Vehiles OK');
      this.getConducteurs().then(() => {
        console.log('Conducteurs OK');
        this.route.paramMap.subscribe((paramMap) => {
          const id = paramMap.get('id');
          if (id) {
            this.getKilometrage(id).then(() => {
              this.initKilometrageForm();
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


  getKilometrage(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('kilometrages').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.kilometrage = resultat.data() as ReleveKilometrique;
        resolve();
      });

    });
  }

  initKilometrageForm() {
    this.kilometrageForm = this.formBuilder.group({
      date: [this.kilometrage ? this.currentDate(this.kilometrage.date) : this.currentDate(), []],
      vehicule: [this.kilometrage ? this.kilometrage.vehicule : '', [Validators.required]],
      quantite: [this.kilometrage ? this.kilometrage.quantite : 0, []]
    });
  }

  currentDate(dateImmatriculation?: Date) {
    if (dateImmatriculation) {
      return new Date(dateImmatriculation).toISOString().substring(0, 10);
    }
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }

  onKilometrageFormSubmit() {
    const valueForm = this.kilometrageForm.value;
    console.log(valueForm);
    let kilometrage = new ReleveKilometrique();
    if (this.kilometrage) {
      kilometrage = this.kilometrage;
    }
    kilometrage.date = new Date(valueForm.date);
    kilometrage.vehicule = valueForm.vehicule;
    kilometrage.quantite = valueForm.quantite;
    if (kilometrage.vehicule.conducteur) {
      kilometrage.conducteur = kilometrage.vehicule.conducteur;
    }

    console.log(kilometrage);
    const parse = JSON.parse(JSON.stringify(kilometrage));

    const db = firebase.firestore();
    db.collection('kilometrages').doc(kilometrage.id).set(parse).then(() => {
      console.log('Enregistré');
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.router.navigate(['kilometrage']);
    });
  }


}
