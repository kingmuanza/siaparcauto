import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Conducteur } from 'src/app/models/conducteur.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-conducteur-edit',
  templateUrl: './conducteur-edit.component.html',
  styleUrls: ['./conducteur-edit.component.scss']
})
export class ConducteurEditComponent implements OnInit {

  conducteurForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  conducteur: Conducteur;

  CARBURANTS = ['DIESEL', 'GASOIL'];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initConducteurForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getConducteur(id).then(() => {
          this.initConducteurForm();
        });
      }
    });
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
  }


  getConducteur(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('conducteurs').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.conducteur = resultat.data() as Conducteur;
        resolve();
      });

    });
  }

  initConducteurForm() {
    this.conducteurForm = this.formBuilder.group({
      cni: [this.conducteur ? this.conducteur.cni : '0123456789', [Validators.required]],
      matricule: [this.conducteur ? this.conducteur.matricule : 'AA012345ZZ', [Validators.required]],
      noms: [this.conducteur ? this.conducteur.noms : 'PONDI', []],
      prenoms: [this.conducteur ? this.conducteur.prenoms : 'Florent-Olivier', []],
      numeroPermis: [this.conducteur ? this.conducteur.numeroPermis : '987654321', []],
      poste: [this.conducteur ? this.conducteur.poste : 'Directeur', []],
      tel: [this.conducteur ? this.conducteur.tel : '', []]
    });
  }

  onConducteurFormSubmit() {
    const valueForm = this.conducteurForm.value;
    const email = valueForm.login;
    const passe = valueForm.passe;
    console.log(valueForm);
    let conducteur = new Conducteur();
    if (this.conducteur) {
      conducteur = this.conducteur;
    }
    conducteur.cni = valueForm.cni;
    conducteur.matricule = valueForm.matricule;
    conducteur.noms = valueForm.noms;
    conducteur.numeroPermis = valueForm.numeroPermis;
    conducteur.poste = valueForm.poste;
    conducteur.prenoms = valueForm.prenoms;
    conducteur.tel = valueForm.tel;

    console.log(conducteur);
    const parse = JSON.parse(JSON.stringify(conducteur));

    const db = firebase.firestore();
    db.collection('conducteurs').doc(conducteur.id).set(parse).then(() => {
      console.log('Enregistré');
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.router.navigate(['conducteur']);
    });


  }

}
