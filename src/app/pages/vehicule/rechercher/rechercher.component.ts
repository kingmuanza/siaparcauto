import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { IdentificationService } from 'src/app/services/identification.service';
import { Vehicule } from 'src/app/models/vehicule.model';

@Component({
  selector: 'app-rechercher',
  templateUrl: './rechercher.component.html',
  styleUrls: ['./rechercher.component.scss']
})
export class RechercherComponent implements OnInit {

  vehicules = new Array<Vehicule>();
  vehiculesResultats = new Array<Vehicule>();
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  constructor(
    private idService: IdentificationService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const mot = paramMap.get('mot');
      if (mot) {
        this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
          this.utilisateur = utilisateur;
          this.getVehicules(mot);
        });
        this.idService.emit();
      }
    });
  }

  getVehicules(mot: string) {
    this.vehicules = new Array<Vehicule>();
    this.vehiculesResultats = new Array<Vehicule>();
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
        const vehicule = resultat.data();
        if (mot) {
          if (vehicule.immatriculation.toLocaleLowerCase().indexOf(mot) !== -1) {
            this.vehicules.push(resultat.data());
            this.vehiculesResultats.push(resultat.data());
          }
        } else {
          this.vehicules.push(resultat.data());
          this.vehiculesResultats.push(resultat.data());
        }
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
