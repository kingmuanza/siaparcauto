import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { IdentificationService } from 'src/app/services/identification.service';
import { Vehicule } from 'src/app/models/vehicule.model';

@Component({
  selector: 'app-vehicule-suivi',
  templateUrl: './vehicule-suivi.component.html',
  styleUrls: ['./vehicule-suivi.component.scss']
})
export class VehiculeSuiviComponent implements OnInit {

  vehicules = new Array<Vehicule>();
  vehiculesResultats = new Array<Vehicule>();
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  constructor(private idService: IdentificationService, private router: Router) { }

  ngOnInit() {
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
      this.getVehicules();
    });
    this.idService.emit();
  }

  manqueInfos(vehicule: Vehicule) {
    if (!vehicule.siteActuel) {
      return true;
    }
    if (!vehicule.direction) {
      return true;
    }
    if (!vehicule.type) {
      return true;
    }
    if (!vehicule.etat) {
      return true;
    }
    return false;
  }

  getVehicules() {
    const db = firebase.firestore();
    const collection = db.collection('vehicules');
    let query;
    if (this.utilisateur.type === 'Responsable') {
      query = collection.where('siteActuel.id', '==', this.utilisateur.site.id);
    } else {
      query = collection;
    }
    query.get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.vehicules.push(resultat.data());
        this.vehiculesResultats.push(resultat.data());
      });
    });
  }

  view(vehicule) {
    this.router.navigate(['vehicules', vehicule.id]);
  }

  rechercher(ev) {
    console.log(ev);
    this.vehiculesResultats = this.vehicules.filter((v) => {
      if (v.immatriculation.toLocaleLowerCase().indexOf(ev) !== -1) {
        return true;
      }
      return false;
    });
  }

}
