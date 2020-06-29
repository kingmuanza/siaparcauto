import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { IdentificationService } from 'src/app/services/identification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-haut',
  templateUrl: './menu-haut.component.html',
  styleUrls: ['./menu-haut.component.scss']
})
export class MenuHautComponent implements OnInit {

  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;

  constructor(private router: Router, private idService: IdentificationService) { }

  ngOnInit() {
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.idService.emit();
  }

  rechercher(ev) {
    console.log(ev);
    this.router.navigate(['rechercher', ev]);
  }

  emailSplit(email: string) {
    return email.split('@')[0];
  }

  addVehicule() {
    this.router.navigate(['vehicule', 'edit']);
  }
  addConducteur() {
    this.router.navigate(['conducteur', 'edit']);
  }

  deconnexion() {
    const oui = confirm('Etes vous sur de vouloir vous deconnecter ?');
    if (oui) {
      this.idService.deconnexion().then(() => {
        this.router.navigate(['connexion']);
      });
    }
  }

}
