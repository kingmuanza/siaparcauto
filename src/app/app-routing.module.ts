import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth';
import { VehiculeEditComponent } from './pages/vehicule/vehicule-edit/vehicule-edit.component';
import { VehiculeListComponent } from './pages/vehicule/vehicule-list/vehicule-list.component';
import { ConducteurListComponent } from './pages/conducteur/conducteur-list/conducteur-list.component';
import { ConducteurEditComponent } from './pages/conducteur/conducteur-edit/conducteur-edit.component';
import { AffectationEditComponent } from './pages/affectation/affectation-edit/affectation-edit.component';
import { AffectationListComponent } from './pages/affectation/affectation-list/affectation-list.component';
import { KilometrageListComponent } from './pages/kilometrage/kilometrage-list/kilometrage-list.component';
import { KilometrageEditComponent } from './pages/kilometrage/kilometrage-edit/kilometrage-edit.component';
import { RavitaillementListComponent } from './pages/ravitaillement/ravitaillement-list/ravitaillement-list.component';
import { RavitaillementEditComponent } from './pages/ravitaillement/ravitaillement-edit/ravitaillement-edit.component';
import { PanneListComponent } from './pages/panne/panne-list/panne-list.component';
import { PanneEditComponent } from './pages/panne/panne-edit/panne-edit.component';
import { ReparationListComponent } from './pages/reparation/reparation-list/reparation-list.component';
import { ReparationEditComponent } from './pages/reparation/reparation-edit/reparation-edit.component';
import { VisiteListComponent } from './pages/visite/visite-list/visite-list.component';
import { VisiteEditComponent } from './pages/visite/visite-edit/visite-edit.component';
import { AssuranceListComponent } from './pages/assurance/assurance-list/assurance-list.component';
import { AssuranceEditComponent } from './pages/assurance/assurance-edit/assurance-edit.component';
import { VehiculeSuiviComponent } from './pages/vehicule/vehicule-suivi/vehicule-suivi.component';
import { VehiculeViewComponent } from './pages/vehicule/vehicule-view/vehicule-view.component';
import { SiteListComponent } from './pages/site/site-list/site-list.component';
import { SiteEditComponent } from './pages/site/site-edit/site-edit.component';
import { LeasingListComponent } from './pages/leasing/leasing-list/leasing-list.component';
import { LeasingEditComponent } from './pages/leasing/leasing-edit/leasing-edit.component';
import { DepartementListComponent } from './pages/departement/departement-list/departement-list.component';
import { DepartementEditComponent } from './pages/departement/departement-edit/departement-edit.component';
import { UtilisateurListComponent } from './pages/utilisateur/utilisateur-list/utilisateur-list.component';
import { UtilisateurEditComponent } from './pages/utilisateur/utilisateur-edit/utilisateur-edit.component';
import { VisiteSuiviComponent } from './pages/visite/visite-suivi/visite-suivi.component';
import { RechercherComponent } from './pages/vehicule/rechercher/rechercher.component';
import { CarteGriseSuiviComponent } from './pages/carte-grise/carte-grise-suivi/carte-grise-suivi.component';
import { CarteGriseEditComponent } from './pages/carte-grise/carte-grise-edit/carte-grise-edit.component';


const routes: Routes = [
  { path: 'connexion', component: ConnexionComponent },
  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },

  { path: 'vehicule', component: VehiculeListComponent },
  { path: 'vehicule/edit', canActivate: [AuthGuard], component: VehiculeEditComponent },
  { path: 'vehicule/edit/:id', canActivate: [AuthGuard], component: VehiculeEditComponent },

  { path: 'vehicules', canActivate: [AuthGuard], component: VehiculeSuiviComponent },
  { path: 'vehicules/:id', canActivate: [AuthGuard], component: VehiculeViewComponent },
  { path: 'rechercher', canActivate: [AuthGuard], component: RechercherComponent },
  { path: 'rechercher/:mot', canActivate: [AuthGuard], component: RechercherComponent },
  { path: 'cartesgrises', canActivate: [AuthGuard], component: CarteGriseSuiviComponent },
  { path: 'cartesgrises/:id', canActivate: [AuthGuard], component: CarteGriseEditComponent },

  { path: 'conducteur', component: ConducteurListComponent },
  { path: 'conducteur/edit', canActivate: [AuthGuard], component: ConducteurEditComponent },
  { path: 'conducteur/edit/:id', canActivate: [AuthGuard], component: ConducteurEditComponent },

  { path: 'affectation', component: AffectationListComponent },
  { path: 'affectation/edit', canActivate: [AuthGuard], component: AffectationEditComponent },
  { path: 'affectation/edit/:id', canActivate: [AuthGuard], component: AffectationEditComponent },

  { path: 'kilometrage', component: KilometrageListComponent },
  { path: 'kilometrage/edit', canActivate: [AuthGuard], component: KilometrageEditComponent },
  { path: 'kilometrage/edit/:id', canActivate: [AuthGuard], component: KilometrageEditComponent },

  { path: 'ravitaillement', component: RavitaillementListComponent },
  { path: 'ravitaillement/edit', canActivate: [AuthGuard], component: RavitaillementEditComponent },
  { path: 'ravitaillement/edit/:id', canActivate: [AuthGuard], component: RavitaillementEditComponent },

  { path: 'panne', component: PanneListComponent },
  { path: 'panne/edit', canActivate: [AuthGuard], component: PanneEditComponent },
  { path: 'panne/edit/:id', canActivate: [AuthGuard], component: PanneEditComponent },

  { path: 'reparation', component: ReparationListComponent },
  { path: 'reparation/edit', canActivate: [AuthGuard], component: ReparationEditComponent },
  { path: 'reparation/edit/:id', canActivate: [AuthGuard], component: ReparationEditComponent },

  { path: 'visite', component: VisiteListComponent },
  { path: 'visite/edit', canActivate: [AuthGuard], component: VisiteEditComponent },
  { path: 'visite/edit/:id', canActivate: [AuthGuard], component: VisiteEditComponent },
  { path: 'visites', component: VisiteSuiviComponent },

  { path: 'assurance', component: AssuranceListComponent },
  { path: 'assurance/edit', canActivate: [AuthGuard], component: AssuranceEditComponent },
  { path: 'assurance/edit/:id', canActivate: [AuthGuard], component: AssuranceEditComponent },

  { path: 'site', component: SiteListComponent },
  { path: 'site/edit', canActivate: [AuthGuard], component: SiteEditComponent },
  { path: 'site/edit/:id', canActivate: [AuthGuard], component: SiteEditComponent },

  { path: 'leasing', component: LeasingListComponent },
  { path: 'leasing/edit', canActivate: [AuthGuard], component: LeasingEditComponent },
  { path: 'leasing/edit/:id', canActivate: [AuthGuard], component: LeasingEditComponent },

  { path: 'departement', component: DepartementListComponent },
  { path: 'departement/edit', canActivate: [AuthGuard], component: DepartementEditComponent },
  { path: 'departement/edit/:id', canActivate: [AuthGuard], component: DepartementEditComponent },

  { path: 'utilisateur', component: UtilisateurListComponent },
  { path: 'utilisateur/edit', canActivate: [AuthGuard], component: UtilisateurEditComponent },
  { path: 'utilisateur/edit/:id', canActivate: [AuthGuard], component: UtilisateurEditComponent },

  { path: '**', redirectTo: 'connexion' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
