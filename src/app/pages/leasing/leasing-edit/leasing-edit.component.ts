import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Leasing } from 'src/app/models/leasing.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-leasing-edit',
  templateUrl: './leasing-edit.component.html',
  styleUrls: ['./leasing-edit.component.scss']
})
export class LeasingEditComponent implements OnInit {

  leasingForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  leasing: Leasing;

  CARBURANTS = ['DIESEL', 'GASOIL'];
  conducteurs = [];
  vehicules = [];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.initLeasingForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getLeasing(id).then(() => {
          this.initLeasingForm();
        });
      }
    });
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
  }

  getLeasing(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('leasings').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.leasing = resultat.data() as Leasing;
        resolve();
      });

    });
  }

  initLeasingForm() {
    this.leasingForm = this.formBuilder.group({
      code: [this.leasing ? this.leasing.code : '', [Validators.required]],
      nom: [this.leasing ? this.leasing.nom : '', [Validators.required]]
    });
  }


  onLeasingFormSubmit() {
    const valueForm = this.leasingForm.value;
    console.log(valueForm);
    let leasing = new Leasing(valueForm.code, valueForm.nom);
    if (this.leasing) {
      leasing = this.leasing;
    }

    console.log(leasing);
    const parse = JSON.parse(JSON.stringify(leasing));
    const db = firebase.firestore();
    db.collection('leasings').doc(leasing.id).set(parse).then(() => {
      console.log('Enregistré');
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.router.navigate(['leasing']);
    });
  }

}
