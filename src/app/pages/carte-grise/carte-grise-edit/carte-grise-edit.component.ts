import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import * as firebase from 'firebase';
import { Vehicule } from 'src/app/models/vehicule.model';

@Component({
  selector: 'app-carte-grise-edit',
  templateUrl: './carte-grise-edit.component.html',
  styleUrls: ['./carte-grise-edit.component.scss']
})
export class CarteGriseEditComponent implements OnInit {

  carteForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  vehicule: Vehicule;
  vehicules = [];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.initCarteForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getVehicule(id).then(() => {
          this.initCarteForm();
        });
      }
    });
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
  }

  getVehicule(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('vehicules').doc(id).get().then((resultat) => {
        this.vehicule = resultat.data() as Vehicule;
      });

    });
  }

  initCarteForm() {
    this.carteForm = this.formBuilder.group({
      // tslint:disable-next-line:max-line-length
      dateFinCarteGrise: [this.vehicule && this.vehicule.dateFinCarteGrise ? this.currentDate(this.vehicule.dateFinCarteGrise) : this.currentDate(), []],
    });
  }

  currentDate(dateImmatriculation?: Date) {
    if (dateImmatriculation) {
      return new Date(dateImmatriculation).toISOString().substring(0, 10);
    }
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }


  onCarteFormSubmit() {
    const valueForm = this.carteForm.value;
    console.log(valueForm);
    if (this.vehicule) {

      this.vehicule.dateFinCarteGrise = valueForm.dateFinCarteGrise;

      console.log(this.vehicule);
      const parse = JSON.parse(JSON.stringify(this.vehicule));
      const db = firebase.firestore();
      db.collection('vehicules').doc(this.vehicule.id).set(parse).then(() => {
        console.log('Enregistré');
        // Metro.notify.create('Enregistré', '', { cls: 'success' });
        this.router.navigate(['cartesgrises']);
      });
    }
  }



}
