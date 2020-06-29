import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Panne } from 'src/app/models/panne.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import * as firebase from 'firebase';
import { Vehicule } from 'src/app/models/vehicule.model';

@Component({
  selector: 'app-panne-edit',
  templateUrl: './panne-edit.component.html',
  styleUrls: ['./panne-edit.component.scss']
})
export class PanneEditComponent implements OnInit {


  panneForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  panne: Panne;

  CARBURANTS = ['DIESEL', 'GASOIL'];
  conducteurs = [];
  vehicules = [];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.initPanneForm();
    this.getVehicules().then(() => {
      console.log('Vehiles OK');
      this.getConducteurs().then(() => {
        console.log('Conducteurs OK');
        this.route.paramMap.subscribe((paramMap) => {
          const id = paramMap.get('id');
          if (id) {
            this.getPanne(id).then(() => {
              this.initPanneForm();
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


  getPanne(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('pannes').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.panne = resultat.data() as Panne;
        resolve();
      });

    });
  }

  initPanneForm() {
    this.panneForm = this.formBuilder.group({
      date: [this.panne ? this.currentDate(this.panne.date) : this.currentDate(), []],
      vehicule: [this.panne ? this.panne.vehicule : '', [Validators.required]],
      description: [this.panne ? this.panne.description : '', []]
    });
  }

  currentDate(dateImmatriculation?: Date) {
    if (dateImmatriculation) {
      return new Date(dateImmatriculation).toISOString().substring(0, 10);
    }
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }

  updateVehicule(vehicule: Vehicule) {
    console.log('Update begin');
    const db = firebase.firestore();
    db.collection('vehicules').doc(vehicule.id).get().then((v) => {
      const voiture = v.data();
      voiture.etat = 'En panne';
      console.log('Updating');
      db.collection('vehicules').doc(vehicule.id).set(voiture).then(() => {
        console.log('Update complete');
      });
    });
  }

  onPanneFormSubmit() {
    const valueForm = this.panneForm.value;
    console.log(valueForm);
    let panne = new Panne();
    if (this.panne) {
      panne = this.panne;
    }
    panne.date = new Date(valueForm.date);
    panne.vehicule = valueForm.vehicule;
    panne.description = valueForm.description;

    if (panne.vehicule.conducteur) {
      panne.conducteur = panne.vehicule.conducteur;
    }

    console.log(panne);
    const parse = JSON.parse(JSON.stringify(panne));

    const db = firebase.firestore();
    db.collection('pannes').doc(panne.id).set(parse).then(() => {
      console.log('Enregistré');
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.router.navigate(['panne']);
    });
    this.updateVehicule(panne.vehicule);
  }




}
