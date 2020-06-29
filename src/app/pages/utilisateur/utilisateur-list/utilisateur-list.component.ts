import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/options/datatable.options';
import { Site } from 'src/app/models/site.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';


@Component({
  selector: 'app-utilisateur-list',
  templateUrl: './utilisateur-list.component.html',
  styleUrls: ['./utilisateur-list.component.scss']
})
export class UtilisateurListComponent implements OnInit {

  dtTrigger = new Subject();
  dtOptions = {
    dom: 'Bfrtip',
    buttons: [
      {
        text: 'Nouveau',
        action: (e, dt, node, config) => {
          this.add();
        },
        className: 'button muanza'
      },
      {
        text: 'Actualiser',
        action: (e, dt, node, config) => {
          this.refresh();
        },
        className: 'button muanza'
      },
      { extend: 'print', text: 'Imprimer', className: 'button muanza' },
      { extend: 'excel', text: 'Export vers Excel', className: 'button muanza' },
    ],
    language: DATATABLES_OPTIONS_LANGUAGE
  };
  enSynchronisation = false;

  utilisateurs = [];
  sites = new Array<Site>();
  responsables = new Array<Utilisateur>();
  constructor(private router: Router) { }

  ngOnInit() {
    this.getUtilisateurs();
    this.getResponsables();
    this.getSites();
  }

  refresh() {
    this.dtTrigger = new Subject();
    this.getUtilisateurs();
  }

  getUtilisateurs() {
    this.enSynchronisation = true;
    this.utilisateurs = [];
    const db = firebase.firestore();
    db.collection('utilisateurs').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.utilisateurs.push(resultat.data());
      });
      this.dtTrigger.next();
      this.enSynchronisation = false;
    }).catch((e) => {
      this.enSynchronisation = false;
    });
  }

  getSites() {
    this.sites = [];
    const db = firebase.firestore();
    db.collection('sites').get().then((resultats) => {
      resultats.forEach(resultat => {
        const site = resultat.data() as Site;
        this.sites.push(site);
      });
    }).catch((e) => {

    });
  }

  getResponsables() {
    this.responsables = new Array<Utilisateur>();
    const db = firebase.firestore();
    db.collection('utilisateurs').where('type', '==', 'Responsable').get().then((resultats) => {
      resultats.forEach(resultat => {
        const utilisateur = resultat.data() as Utilisateur;
        this.responsables.push(utilisateur);
      });
    }).catch((e) => {

    });
  }

  getResponsablesOfSite(site: Site) {
    const responsables = new Array<Utilisateur>();
    this.responsables.forEach(responsable => {
      if (responsable.site) {
        if (responsable.site.id === site.id) {
          responsables.push(responsable);
        }
      }
    });
    return responsables;
  }

  edit(utilisateur) {
    this.router.navigate(['utilisateur', 'edit', utilisateur.id]);
  }
  add() {
    this.router.navigate(['utilisateur', 'edit']);
  }

}
