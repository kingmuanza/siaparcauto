import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import { Vehicule } from 'src/app/models/vehicule.model';
import * as firebase from 'firebase';
import * as Metro from 'metro4-dist';

@Component({
  selector: 'app-vehicule-edit',
  templateUrl: './vehicule-edit.component.html',
  styleUrls: ['./vehicule-edit.component.scss']
})
export class VehiculeEditComponent implements OnInit {

  vehiculeForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  vehicule: Vehicule;

  CARBURANTS = ['DIESEL', 'GASOIL'];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initVehiculeForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getVehicule(id).then(() => {
          this.initVehiculeForm();
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
        console.log(resultat.data());
        this.vehicule = resultat.data() as Vehicule;
        resolve();
      });

    });
  }

  initVehiculeForm() {
    this.vehiculeForm = this.formBuilder.group({
      modele: [this.vehicule ? this.vehicule.modele : 'TOYOTA YARIS', [Validators.required]],
      immatriculation: [this.vehicule ? this.vehicule.immatriculation : 'CE 000 AA', [Validators.required]],
      dateImmatriculation: [this.vehicule ? this.currentDate(this.vehicule.dateImmatriculation) : this.currentDate(), []],
      chassis: [this.vehicule ? this.vehicule.numeroChassis : '0123456789', []],
      etiquettes: [this.vehicule ? this.vehicule.etiquettes : '', []],
      catalogue: [this.vehicule ? this.vehicule.valeurCatalogue : 0, []],
      achat: [this.vehicule ? this.vehicule.valeurAchat : 0, []],
      residuelle: [this.vehicule ? this.vehicule.valeurResiduelle : 0, []],
      carburant: [this.vehicule ? this.vehicule.typeCarburant : 'GASOIL', []]
    });
  }

  currentDate(dateImmatriculation?: Date) {
    if (dateImmatriculation) {
      return new Date(dateImmatriculation).toISOString().substring(0, 10);
    }
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }

  onVehiculeFormSubmit() {
    const valueForm = this.vehiculeForm.value;
    const email = valueForm.login;
    const passe = valueForm.passe;
    console.log(valueForm);
    let vehicule = new Vehicule();
    if (this.vehicule) {
      vehicule = this.vehicule;
    }
    vehicule.dateImmatriculation = new Date(valueForm.dateImmatriculation);
    vehicule.etiquettes = valueForm.etiquettes;
    vehicule.immatriculation = valueForm.immatriculation;
    vehicule.modele = valueForm.modele;
    vehicule.numeroChassis = valueForm.chassis;
    vehicule.valeurAchat = valueForm.achat;
    vehicule.valeurCatalogue = valueForm.catalogue;
    vehicule.valeurResiduelle = valueForm.residuelle;
    vehicule.typeCarburant = valueForm.carburant;

    console.log(vehicule);
    const parse = JSON.parse(JSON.stringify(vehicule));

    const db = firebase.firestore();
    db.collection('vehicules').doc(vehicule.id).set(parse).then(() => {
      console.log('Enregistré');
      console.log(Metro);
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.router.navigate(['vehicule']);
    });


  }

}
