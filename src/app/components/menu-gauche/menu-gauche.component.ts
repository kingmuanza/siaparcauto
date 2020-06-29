import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { IdentificationService } from 'src/app/services/identification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-gauche',
  templateUrl: './menu-gauche.component.html',
  styleUrls: ['./menu-gauche.component.scss']
})
export class MenuGaucheComponent implements OnInit {

  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;

  voirParametres = false;
  voirSuivi = false;

  constructor(private idService: IdentificationService, private router: Router) { }

  deconnexion() {
    const oui = confirm('Etes vous sur de vouloir vous deconnecter ?');
    if (oui) {
      this.idService.deconnexion().then(() => {
        this.router.navigate(['connexion']);
      });
    }
  }

  ngOnInit() {
    this.utilisateurSubscription = this.idService.utilisateurSubject.subscribe((utilisateur) => {
      this.utilisateur = utilisateur;
      if (this.utilisateur.type) {
        if (this.utilisateur.type === 'Administrateur') {
          this.voirParametres = true;
          this.voirSuivi = true;
        }
        if (this.utilisateur.type === 'Responsable') {
          this.voirParametres = false;
          this.voirSuivi = true;
        }
      } else {
        this.voirParametres = true;
        this.voirSuivi = true;
      }
    });
    this.idService.emit();
  }

}
