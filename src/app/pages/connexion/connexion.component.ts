import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { IdentificationService } from 'src/app/services/identification.service';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  connexionForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;

  constructor(private router: Router, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initConnexionForm();
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
    this.idService.signIn('muanza@gmail.com', '123456').then(() => {
      console.log('Authentification réussie');
      this.router.navigate(['dashboard']);
    });
  }

  initConnexionForm() {
    this.connexionForm = this.formBuilder.group({
      login: ['', [Validators.required]],
      passe: ['', [Validators.required]]
    });
  }

  onConnexionFormSubmit() {
    const valueForm = this.connexionForm.value;
    const email = valueForm.login;
    const passe = valueForm.passe;
    this.idService.signIn(email, passe).then(() => {
      console.log('Authentification réussie');
      this.router.navigate(['dashboard']);
    });
  }

}
