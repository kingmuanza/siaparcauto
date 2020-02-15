import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Ravitaillement } from 'src/app/models/ravitaillement.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-ravitaillement-edit',
  templateUrl: './ravitaillement-edit.component.html',
  styleUrls: ['./ravitaillement-edit.component.scss']
})
export class RavitaillementEditComponent implements OnInit {

  ravitaillementForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  ravitaillement: Ravitaillement;

  CARBURANTS = ['DIESEL', 'GASOIL'];
  conducteurs = [];
  vehicules = [];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.initRavitaillementForm();
    this.getVehicules().then(() => {
      console.log('Vehiles OK');
      this.getConducteurs().then(() => {
        console.log('Conducteurs OK');
        this.route.paramMap.subscribe((paramMap) => {
          const id = paramMap.get('id');
          if (id) {
            this.getRavitaillement(id).then(() => {
              this.initRavitaillementForm();
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


  getRavitaillement(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('ravitaillements').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.ravitaillement = resultat.data() as Ravitaillement;
        resolve();
      });

    });
  }

  initRavitaillementForm() {
    this.ravitaillementForm = this.formBuilder.group({
      date: [this.ravitaillement ? this.currentDate(this.ravitaillement.date) : this.currentDate(), []],
      vehicule: [this.ravitaillement ? this.ravitaillement.vehicule : '', [Validators.required]],
      prixTotal: [this.ravitaillement ? this.ravitaillement.prixTotal : 0, []]
    });
  }

  currentDate(dateImmatriculation?: Date) {
    if (dateImmatriculation) {
      return new Date(dateImmatriculation).toISOString().substring(0, 10);
    }
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }

  onRavitaillementFormSubmit() {
    const valueForm = this.ravitaillementForm.value;
    console.log(valueForm);
    let ravitaillement = new Ravitaillement();
    if (this.ravitaillement) {
      ravitaillement = this.ravitaillement;
    }
    ravitaillement.date = new Date(valueForm.date);
    ravitaillement.vehicule = valueForm.vehicule;
    ravitaillement.prixTotal = valueForm.prixTotal;
    if (ravitaillement.vehicule.conducteur) {
      ravitaillement.conducteur = ravitaillement.vehicule.conducteur;
    }

    console.log(ravitaillement);
    const parse = JSON.parse(JSON.stringify(ravitaillement));

    const db = firebase.firestore();
    db.collection('ravitaillements').doc(ravitaillement.id).set(parse).then(() => {
      console.log('Enregistré');
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.router.navigate(['ravitaillement']);
    });
  }



}
