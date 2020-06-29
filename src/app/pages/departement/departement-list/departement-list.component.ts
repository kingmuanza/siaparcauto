import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Departement } from 'src/app/models/departement.model';

@Component({
  selector: 'app-departement-list',
  templateUrl: './departement-list.component.html',
  styleUrls: ['./departement-list.component.scss']
})
export class DepartementListComponent implements OnInit {


  departements = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getDepartements();
  }

  getDepartements() {
    const db = firebase.firestore();
    db.collection('departements').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.departements.push(resultat.data());
      });
      this.departements = this.organiserArbre(this.departements);
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

  edit(departement) {
    this.router.navigate(['departement', 'edit', departement.id]);
  }
  addDepartement() {
    this.router.navigate(['departement', 'edit']);
  }

}
