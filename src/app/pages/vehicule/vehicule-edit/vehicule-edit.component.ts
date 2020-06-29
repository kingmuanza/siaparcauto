import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import { Vehicule } from 'src/app/models/vehicule.model';
import * as firebase from 'firebase';
import * as Metro from 'metro4-dist';
import { Site } from 'src/app/models/site.model';
import { Departement } from 'src/app/models/departement.model';

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
  leasing = false;
  sites = new Array<Site>();
  departements = [];

  CARBURANTS = ['DIESEL', 'GASOIL'];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initVehiculeForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getVehicule(id).then(() => {
          this.getSites();
          this.getDepartements();
          this.initVehiculeForm();
        });
      } else {
        this.getSites();
        this.getDepartements();
        this.initVehiculeForm();
      }
    });
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
  }

  getSites() {
    const db = firebase.firestore();
    db.collection('sites').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        const site = resultat.data() as Site;
        this.sites.push(site);
      });
      this.initVehiculeForm();
    });
  }

  getDepartements() {
    console.log('getDepartements');
    this.departements = new Array<Departement>();
    const db = firebase.firestore();
    db.collection('departements').get().then((resultats) => {
      resultats.forEach(resultat => {
        const d = resultat.data() as Departement;
        this.departements.push(d);
        console.log('this.departements');
        console.log(this.departements);
      });
      this.departements = this.organiserArbre(this.departements);
      this.initVehiculeForm();
    });
  }

  generateArray(i: number) {
    if (i) {
      return Array(i).fill(0);
    } else {
      return [];
    }
  }

  organiserArbre(departements: Array<Departement>) {
    // On veut classer les départements par ordre;
    console.log('On veut classer les départements par ordre');
    const peres = departements.filter(d => {
      if (!d.parent) {
        return true;
      }
      return false;
    });
    console.log('On récupère les pères');
    let resultats = new Array<Departement>();
    console.log(peres);
    peres.forEach((pere) => {
      resultats.push(pere);
      resultats = resultats.concat(this.getFils(pere, departements));
    });
    return resultats;
  }

  getFilsDirect(departement: Departement, departements: Array<Departement>) {
    const fils = new Array<Departement>();
    departements.forEach(d => {
      if (d.parent && d.parent.id === departement.id) {
        fils.push(d);
      }
    });
    return fils;
  }
  getFils(departement: Departement, departements: Array<Departement>) {
    console.log('Execution de get fils');
    let fils = new Array<Departement>();
    departements.forEach(d => {
      if (d.parent && d.parent.id === departement.id) {
        console.log('on ajoute le fils');
        console.log(d);
        fils.push(d);
        const directs = this.getFilsDirect(d, departements);
        console.log('Le fils a til des fils ?');
        console.log(directs.length);
        if (directs.length > 0) {
          console.log('Oui il a des fils');
          directs.forEach((direct) => {
            console.log('On récupère les fils du fils');
            console.log(direct);
            fils.push(direct);
            fils = fils.concat(this.getFils(direct, departements));
          });
        }
        console.log('Il na pas de fils');
        console.log('SUIVANT');
      }
    });
    return fils;
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
      immatriculation: [this.vehicule ? this.vehicule.immatriculation : '', [Validators.required]],
      modele: [this.vehicule ? this.vehicule.modele : '', [Validators.required]],
      chevaux: [this.vehicule ? this.vehicule.chevaux : 0, []],
      dateImmatriculation: [this.vehicule ? this.currentDate(this.vehicule.dateImmatriculation) : this.currentDate(), []],
      // tslint:disable-next-line:max-line-length
      dateAcquisition: [this.vehicule && this.vehicule.dateAcquisition ? this.currentDate(this.vehicule.dateAcquisition) : this.currentDate(), []],
      // tslint:disable-next-line:max-line-length
      dateFinCarteGrise: [this.vehicule && this.vehicule.dateFinCarteGrise ? this.currentDate(this.vehicule.dateFinCarteGrise) : this.currentDate(), []],
      chassis: [this.vehicule ? this.vehicule.numeroChassis : '', []],
      siteActuel: [this.vehicule ? this.vehicule.siteActuel : '', []],
      direction: [this.vehicule ? this.vehicule.direction : '', []],
      type: [this.vehicule ? this.vehicule.type : '', []],
      etat: [this.vehicule ? this.vehicule.etat : '', []],
      departementActuel: [this.vehicule ? this.vehicule.departementActuel : '', []],
      proprietaire: [this.vehicule ? this.vehicule.proprietaire : true, []],
      leasing: [this.vehicule ? this.vehicule.leasing : '', []],

      etiquettes: [this.vehicule ? this.vehicule.etiquettes : '', []],
      catalogue: [this.vehicule ? this.vehicule.valeurCatalogue : 0, []],
      achat: [this.vehicule ? this.vehicule.valeurAchat : 0, []],
      residuelle: [this.vehicule ? this.vehicule.valeurResiduelle : 0, []],
      carburant: [this.vehicule ? this.vehicule.typeCarburant : '', []]
    });
    if (this.vehiculeForm.controls.proprietaire) {
      this.leasing = false;
    }
    this.vehiculeForm.get('proprietaire').valueChanges.subscribe(val => {
      console.log('La valeur a dhcjdndl');
      this.leasing = !val;
    });
    if (this.vehicule) {
      this.sites.forEach((s) => {
        if (this.vehicule && this.vehicule.siteActuel && this.vehicule.siteActuel.id === s.id) {
          this.vehiculeForm.controls.siteActuel.setValue(s);
        }
      });
      this.departements.forEach((d) => {
        if (this.vehicule && this.vehicule.direction && this.vehicule.direction.id === d.id) {
          this.vehiculeForm.controls.direction.setValue(d);
        }
      });
    }

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
    vehicule.dateAcquisition = new Date(valueForm.dateAcquisition);
    vehicule.dateFinCarteGrise = new Date(valueForm.dateFinCarteGrise);
    vehicule.etiquettes = valueForm.etiquettes;
    vehicule.immatriculation = valueForm.immatriculation;
    vehicule.modele = valueForm.modele;
    vehicule.numeroChassis = valueForm.chassis;
    vehicule.valeurAchat = valueForm.achat;
    vehicule.valeurCatalogue = valueForm.catalogue;
    vehicule.valeurResiduelle = valueForm.residuelle;
    vehicule.typeCarburant = valueForm.carburant;
    vehicule.siteActuel = valueForm.siteActuel;
    vehicule.proprietaire = valueForm.proprietaire;
    vehicule.leasing = valueForm.leasing;
    vehicule.chevaux = valueForm.chevaux;
    vehicule.direction = valueForm.direction;
    vehicule.etat = valueForm.etat;
    vehicule.type = valueForm.type;

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
