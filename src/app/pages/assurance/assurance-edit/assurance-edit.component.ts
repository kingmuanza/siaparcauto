import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Assurance } from 'src/app/models/assurance.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';

@Component({
  selector: 'app-assurance-edit',
  templateUrl: './assurance-edit.component.html',
  styleUrls: ['./assurance-edit.component.scss']
})
export class AssuranceEditComponent implements OnInit {


  assuranceForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  assurance: Assurance;

  CARBURANTS = ['DIESEL', 'GASOIL'];
  conducteurs = [];
  vehicules = [];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.initAssuranceForm();
    this.getVehicules().then(() => {
      console.log('Vehiles OK');
      this.getConducteurs().then(() => {
        console.log('Conducteurs OK');
        this.route.paramMap.subscribe((paramMap) => {
          const id = paramMap.get('id');
          if (id) {
            this.getAssurance(id).then(() => {
              this.initAssuranceForm();
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


  getAssurance(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('assurances').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.assurance = resultat.data() as Assurance;
        resolve();
      });

    });
  }

  initAssuranceForm() {
    this.assuranceForm = this.formBuilder.group({
      date: [this.assurance ? this.currentDate(this.assurance.date) : this.currentDate(), []],
      dateLimite: [this.assurance ? this.currentDate(this.assurance.dateLimite) : this.currentDate(), []],
      vehicule: [this.assurance ? this.assurance.vehicule : '', [Validators.required]],
      prestataire: [this.assurance ? this.assurance.prestataire : '', []],
      prixTotal: [this.assurance ? this.assurance.prixTotal : '', []]
    });
  }

  currentDate(dateImmatriculation?: Date) {
    if (dateImmatriculation) {
      return new Date(dateImmatriculation).toISOString().substring(0, 10);
    }
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }

  onAssuranceFormSubmit() {
    const valueForm = this.assuranceForm.value;
    console.log(valueForm);
    let assurance = new Assurance();
    if (this.assurance) {
      assurance = this.assurance;
    }
    assurance.date = new Date(valueForm.date);
    assurance.dateLimite = new Date(valueForm.dateLimite);
    assurance.vehicule = valueForm.vehicule;
    assurance.prixTotal = valueForm.prixTotal;
    assurance.prestataire = valueForm.prestataire;
    if (assurance.vehicule.conducteur) {
      assurance.conducteur = assurance.vehicule.conducteur;
    }

    console.log(assurance);
    const parse = JSON.parse(JSON.stringify(assurance));

    const db = firebase.firestore();
    db.collection('assurances').doc(assurance.id).set(parse).then(() => {
      console.log('Enregistré');
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.router.navigate(['assurance']);
    });
  }




}
