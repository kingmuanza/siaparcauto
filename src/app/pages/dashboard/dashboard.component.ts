import { Component, OnInit, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Affectation } from 'src/app/models/affectation.model';
import { ReleveKilometrique } from 'src/app/models/releve.kilometrique.model';
import { Ravitaillement } from 'src/app/models/ravitaillement.model';
import { Panne } from 'src/app/models/panne.model';
import { Reparation } from 'src/app/models/reparation.model';
import { Visite } from 'src/app/models/visite.technique.model';
import { Assurance } from 'src/app/models/assurance.model';
import * as firebase from 'firebase';
import { Vehicule } from 'src/app/models/vehicule.model';
import Chart from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('donut', { static: false }) donut: ElementRef;

  vehicules = new Array<Vehicule>();
  vehiculesResultats = new Array<Vehicule>();
  affectations = new Array<Affectation>();
  kilometrages = new Array<ReleveKilometrique>();
  ravitaillements = new Array<Ravitaillement>();
  pannes = new Array<Panne>();
  reparations = new Array<Reparation>();
  visites = new Array<Visite>();
  assurances = new Array<Assurance>();

  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;

  voirParametres = false;
  voirSuivi = false;

  constructor(
    private idService: IdentificationService,
    private router: Router,
    private renderer: Renderer2,
    private route: ActivatedRoute) { }

  ngAfterViewInit() {
    // Graphiques
    const donutCtx = this.donut.nativeElement.getContext('2d');

    this.getVehicules().then(() => {
      const EnCirculations = new Array<Vehicule>();
      const Vetustes = new Array<Vehicule>();
      const EnPannes = new Array<Vehicule>();
      const Epaves = new Array<Vehicule>();
      const reste = new Array<Vehicule>();

      console.log('this.vehicules.length');
      console.log(this.vehicules);
      this.vehicules.forEach((vehicule) => {
        if (vehicule.etat) {
          if (vehicule.etat === 'En circulation') {
            EnCirculations.push(vehicule);
          }
          if (vehicule.etat === 'Vétuste') {
            Vetustes.push(vehicule);
          }
          if (vehicule.etat === 'En panne') {
            EnPannes.push(vehicule);
          }
          if (vehicule.etat === 'Epave') {
            Epaves.push(vehicule);
          }
        } else {
          reste.push(vehicule);
        }
      });

      const datas = {
        labels: [
          'En circulation',
          'Vétuste',
          'En panne',
          'Epave',
          'Indéfinis',
        ],
        datasets: [
          {
            data: [
              EnCirculations.length,
              Vetustes.length,
              EnPannes.length,
              Epaves.length,
              reste.length
            ],   // Example data
            backgroundColor: [
              '#0072ff',
              '#76a346',
              '#fa6800',
              '#e52d27',
              '#f1f1f1'
            ]
          }]
      };

      const chart = new Chart(
        donutCtx,
        {
          type: 'pie',
          data: datas,
          options: {
            cutoutPercentage: 0,
            responsive: true,
            animation: {
              animateScale: true,
              animateRotate: false
            },
            legend: {
              display: true,
              position: 'bottom'
            },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }
            }
          }
        }
      );
    });
  }

  ngOnInit() {
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
      this.getVehicules();
      if (this.utilisateur.type) {
        if (this.utilisateur.type === 'Administrateur') {
          this.voirParametres = true;
          this.voirSuivi = true;
        }
        if (this.utilisateur.type === 'Responsable') {
          this.voirParametres = false;
          this.voirSuivi = true;
        }
      } else {
        this.voirParametres = true;
      }
    });
    this.idService.emit();
    {
      this.getAffectations().then(() => {
        console.log('Affectations !');
      });
      this.getKilometrages().then(() => {
        console.log('Affectations !');
      });
      this.getRavitaillements().then(() => {
        console.log('Ravitaillements !');
      });
      this.getPannes().then(() => {
        console.log('Pannes !');
      });
      this.getReparattions().then(() => {
        console.log('Reoaraions !');
      });
      this.getVisites().then(() => {
        console.log('Visites !');
      });
      this.getAssurances().then(() => {
        console.log('Visites !');
      });
    }
  }

  getVehicules() {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      const collection = db.collection('vehicules');
      let query;
      if (this.utilisateur.type === 'Responsable') {
        query = collection.where('siteActuel.id', '==', this.utilisateur.site.id);
      } else {
        query = collection;
      }
      query.get().then((resultats) => {
        this.vehicules = new Array<Vehicule>();
        this.vehiculesResultats = new Array<Vehicule>();
        resultats.forEach(resultat => {
          console.log(resultat.data());
          this.vehicules.push(resultat.data());
          this.vehiculesResultats.push(resultat.data());
        });
        resolve();
      });
    });
  }


  getTotalCarburants(ravitaillements: Array<Ravitaillement>) {
    let total = 0;
    ravitaillements.forEach(r => {
      total += Number(r.prixTotal);
    });
    return total;
  }
  getTotalReparations(ravitaillements: Array<Reparation>) {
    let total = 0;
    ravitaillements.forEach(r => {
      total += Number(r.coutTotal);
    });
    return total;
  }
  getTotalVisites(visites: Array<Visite>) {
    let total = 0;
    visites.forEach(r => {
      total += Number(r.prixTotal);
    });
    return total;
  }
  getTotalAssurances(assurances: Array<Assurance>) {
    let total = 0;
    assurances.forEach(r => {
      total += Number(r.prixTotal);
    });
    return total;
  }

  getAffectations() {
    this.kilometrages = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('kilometrages').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const kilometrage = resultat.data() as ReleveKilometrique;
          this.kilometrages.push(kilometrage);
        });
        resolve();
      });
    });
  }

  getKilometrages() {
    this.affectations = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('affectations').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const affectation = resultat.data() as Affectation;
          this.affectations.push(affectation);
        });
        resolve();
      });
    });
  }

  getPannes() {
    this.pannes = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('pannes').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const panne = resultat.data() as Panne;
          this.pannes.push(panne);
        });
        resolve();
      });
    });
  }

  getRavitaillements() {
    this.ravitaillements = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('ravitaillements').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const ravitaillement = resultat.data() as Ravitaillement;
          this.ravitaillements.push(ravitaillement);
        });
        resolve();
      });
    });
  }

  getReparattions() {
    this.reparations = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('reparations').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const reparation = resultat.data() as Reparation;
          this.reparations.push(reparation);
        });
        resolve();
      });
    });
  }
  getVisites() {
    this.reparations = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('visites').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const visite = resultat.data() as Visite;
          this.visites.push(visite);
        });
        resolve();
      });
    });
  }
  getAssurances() {
    this.assurances = [];
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('assurances').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach(resultat => {
          console.log('resultat.data()');
          console.log(resultat.data());
          const assurance = resultat.data() as Assurance;
          this.assurances.push(assurance);
        });
        resolve();
      });
    });
  }

  goTo(menu) {
    this.router.navigate([menu]);
  }



}
