import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { IdentificationService } from '../services/identification.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private idservice: IdentificationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.idservice.utilisateur) {
            return true;
        } else {
            const user = localStorage.getItem('SIAPARCAUTOUtilisateur');
            if (user) {
                this.idservice.utilisateur = JSON.parse(user);
                this.idservice.emit();
                return true;
            } else {
                this.router.navigate(['connexion']);
            }
        }
    }

}
