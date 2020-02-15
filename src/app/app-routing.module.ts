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


const routes: Routes = [
  { path: 'connexion', component: ConnexionComponent },
  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },

  { path: 'vehicule', component: VehiculeListComponent },
  { path: 'vehicule/edit', canActivate: [AuthGuard], component: VehiculeEditComponent },
  { path: 'vehicule/edit/:id', canActivate: [AuthGuard], component: VehiculeEditComponent },

  { path: 'vehicules', canActivate: [AuthGuard], component: VehiculeSuiviComponent },
  { path: 'vehicules/:id', canActivate: [AuthGuard], component: VehiculeViewComponent },

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

  { path: 'assurance', component: AssuranceListComponent },
  { path: 'assurance/edit', canActivate: [AuthGuard], component: AssuranceEditComponent },
  { path: 'assurance/edit/:id', canActivate: [AuthGuard], component: AssuranceEditComponent },

  { path: '**', redirectTo: 'connexion' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
