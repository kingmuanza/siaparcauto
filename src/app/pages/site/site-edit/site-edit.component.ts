import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Site } from 'src/app/models/site.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentificationService } from 'src/app/services/identification.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-site-edit',
  templateUrl: './site-edit.component.html',
  styleUrls: ['./site-edit.component.scss']
})
export class SiteEditComponent implements OnInit {

  siteForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  site: Site;

  CARBURANTS = ['DIESEL', 'GASOIL'];
  conducteurs = [];
  vehicules = [];

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.initSiteForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getSite(id).then(() => {
          this.initSiteForm();
        });
      }
    });
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
  }

  getSite(id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('sites').doc(id).get().then((resultat) => {
        console.log(resultat.data());
        this.site = resultat.data() as Site;
        resolve();
      });

    });
  }

  initSiteForm() {
    this.siteForm = this.formBuilder.group({
      code: [this.site ? this.site.code : '', [Validators.required]],
      nom: [this.site ? this.site.nom : '', [Validators.required]]
    });
  }


  onSiteFormSubmit() {
    const valueForm = this.siteForm.value;
    console.log(valueForm);
    let site = new Site(valueForm.code, valueForm.nom);
    if (this.site) {
      site = this.site;
    }

    console.log(site);
    const parse = JSON.parse(JSON.stringify(site));
    const db = firebase.firestore();
    db.collection('sites').doc(site.id).set(parse).then(() => {
      console.log('Enregistré');
      // Metro.notify.create('Enregistré', '', { cls: 'success' });
      this.router.navigate(['site']);
    });
  }




}
