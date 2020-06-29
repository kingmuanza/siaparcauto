import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Visite } from 'src/app/models/visite.technique.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';

@Component({
  selector: 'app-visite-edit',
  templateUrl: './visite-edit.component.html',
  styleUrls: ['./visite-edit.component.scss']
})
export class VisiteEditComponent implements OnInit {

  visiteForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  visite: Visite;

  CARBURANTS = ['DIESEL', 'GASOIL'];
  conducteurs = [];
  vehicules = [];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.initVisiteForm();
    this.getVehicules().then(() => {
      console.log('Vehiles OK');
      this.getConducteurs().then(() => {
        console.log('Conducteurs OK');
        this.route.paramMap.subscribe((paramMap) => {
          const id = paramMap.get('id');
          if (id) {
            this.getVisite(id).then(() => {
              this.initVisiteForm();
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


  getVisite(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('visites').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.visite = resultat.data() as Visite;
        resolve();
      });

    });
  }

  initVisiteForm() {
    this.visiteForm = this.formBuilder.group({
      date: [this.visite ? this.currentDate(this.visite.date) : this.currentDate(new Date('2019-01-01')), []],
      dateLimite: [this.visite ? this.currentDate(this.visite.dateLimite) : this.currentDate(new Date('2020-01-01')), []],
      vehicule: [this.visite ? this.visite.vehicule : '', [Validators.required]],
      prestataire: [this.visite ? this.visite.prestataire : '', []],
      prixTotal: [this.visite ? this.visite.prixTotal : 0, []]
    });
  }

  currentDate(dateImmatriculation?: Date) {
    if (dateImmatriculation) {
      return new Date(dateImmatriculation).toISOString().substring(0, 10);
    }
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }

  onVisiteFormSubmit() {
    const valueForm = this.visiteForm.value;
    console.log(valueForm);
    let visite = new Visite();
    if (this.visite) {
      visite = this.visite;
    }
    visite.date = new Date(valueForm.date);
    visite.dateLimite = new Date(valueForm.dateLimite);
    visite.vehicule = valueForm.vehicule;
    visite.prestataire = valueForm.prestataire;
    visite.prixTotal = valueForm.prixTotal;
    if (visite.vehicule.conducteur) {
      visite.conducteur = visite.vehicule.conducteur;
    }

    console.log(visite);
    const parse = JSON.parse(JSON.stringify(visite));

    const db = firebase.firestore();
    db.collection('visites').doc(visite.id).set(parse).then(() => {
      console.log('Enregistré');
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.router.navigate(['visite']);
    });
  }

}
