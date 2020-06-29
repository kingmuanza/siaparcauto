import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Departement } from 'src/app/models/departement.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-departement-edit',
  templateUrl: './departement-edit.component.html',
  styleUrls: ['./departement-edit.component.scss']
})
export class DepartementEditComponent implements OnInit {

  departementForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  departement: Departement;
  departements: Array<Departement>;
  fils: Array<Departement>;
  nonfils = new Array<Departement>();


  CARBURANTS = ['DIESEL', 'GASOIL'];
  conducteurs = [];
  vehicules = [];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.initDepartementForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getDepartement(id).then(() => {
          this.initDepartementForm();
          this.getDepartements();

        });
      } else {
        this.initDepartementForm();
        this.getDepartements();
      }
    });
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
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
        this.initDepartementForm();
        this.fils = this.getFils(this.departement, this.departements);
        this.nonfils = new Array<Departement>();
        this.departements.forEach((depar) => {
          if (!this.estUnFils(depar)) {
            this.nonfils.push(depar);
          }
        });
      });
    });
  }

  estUnFils(departement: Departement) {
    for (let i = 0; i < this.fils.length; i++) {
      const d = this.fils[i];
      if (d.id === departement.id) {
        return true;
      }
    }
    return false;
  }

  generateArray(i: number) {
    if (i) {
      if (this.departement) {
        if (this.departement.niveau) {
          return Array(i - this.departement.niveau - 1).fill(0);
        } else {
          return Array(i - 1).fill(0);
        }
      }
    } else {
    }
    return [];
  }

  getDepartement(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('departements').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.departement = resultat.data() as Departement;
        resolve();
      });

    });
  }

  initDepartementForm() {
    this.departementForm = this.formBuilder.group({
      code: [this.departement ? this.departement.code : '', [Validators.required]],
      nom: [this.departement ? this.departement.nom : '', [Validators.required]],
      parent: [this.departement ? this.departement.parent : '', []]
    });
    if (this.departement && this.departements) {
      this.departements.forEach((d) => {
        if (this.departement && this.departement.parent && this.departement.parent.id === d.id) {
          this.departementForm.controls.parent.setValue(d);
        }
      });
    }
  }


  onDepartementFormSubmit() {
    const valueForm = this.departementForm.value;
    console.log(valueForm);
    let departement = new Departement(valueForm.code, valueForm.nom, valueForm.parent);
    if (this.departement) {
      departement = this.departement;
      departement.code = valueForm.code;
      departement.nom = valueForm.nom;
      departement.parent = valueForm.parent;
    }

    console.log(departement);
    const parse = JSON.parse(JSON.stringify(departement));
    const db = firebase.firestore();
    db.collection('departements').doc(departement.id).set(parse).then(() => {
      console.log('Enregistré');
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.router.navigate(['departement']);
    });
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



}
