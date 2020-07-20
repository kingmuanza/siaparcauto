import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IdentificationService } from 'src/app/services/identification.service';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { notifierErreur } from '../../../assets/js/muanza';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  connexionForm: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  enSynchronisation = false;

  constructor(private router: Router, private idService: IdentificationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initConnexionForm();
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
  }

  initConnexionForm() {
    this.connexionForm = this.formBuilder.group({
      login: ['', [Validators.required]],
      passe: ['', [Validators.required]]
    });
  }

  onConnexionFormSubmit() {

    const connexion = setTimeout(() => {
      notifierErreur('Temps de réponse du serveur trop long. Veuillez recharger la page !');
      this.initConnexionForm();
      this.enSynchronisation = false;
    }, 5000);

    this.enSynchronisation = true;
    console.log('Connexion');
    const valueForm = this.connexionForm.value;
    const email = valueForm.login;
    const passe = valueForm.passe;
    this.idService.signIn(email, passe).then((utilisateur) => {
      localStorage.setItem('SIAPARCAUTOUtilisateur', JSON.stringify(utilisateur));
      console.log('Authentification réussie');
      this.router.navigate(['dashboard']);
      console.log(utilisateur);
      clearTimeout(connexion);
      this.enSynchronisation = false;
    }).catch((e) => {
      console.log('Erreurururue');
      notifierErreur('Login ou mot de passe incorrect !');
      clearTimeout(connexion);
      this.initConnexionForm();
      this.enSynchronisation = false;
    });
  }

}
