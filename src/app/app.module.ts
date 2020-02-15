import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { MenuGaucheComponent } from './components/menu-gauche/menu-gauche.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { MenuHautComponent } from './components/menu-haut/menu-haut.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VehiculeEditComponent } from './pages/vehicule/vehicule-edit/vehicule-edit.component';
import { VehiculeListComponent } from './pages/vehicule/vehicule-list/vehicule-list.component';
import { ConducteurListComponent } from './pages/conducteur/conducteur-list/conducteur-list.component';
import { ConducteurEditComponent } from './pages/conducteur/conducteur-edit/conducteur-edit.component';
import { AffectationEditComponent } from './pages/affectation/affectation-edit/affectation-edit.component';
import { AffectationListComponent } from './pages/affectation/affectation-list/affectation-list.component';
import { KilometrageListComponent } from './pages/kilometrage/kilometrage-list/kilometrage-list.component';
import { KilometrageEditComponent } from './pages/kilometrage/kilometrage-edit/kilometrage-edit.component';
import { RavitaillementEditComponent } from './pages/ravitaillement/ravitaillement-edit/ravitaillement-edit.component';
import { RavitaillementListComponent } from './pages/ravitaillement/ravitaillement-list/ravitaillement-list.component';
import { PanneEditComponent } from './pages/panne/panne-edit/panne-edit.component';
import { PanneListComponent } from './pages/panne/panne-list/panne-list.component';
import { ReparationListComponent } from './pages/reparation/reparation-list/reparation-list.component';
import { ReparationEditComponent } from './pages/reparation/reparation-edit/reparation-edit.component';
import { VisiteEditComponent } from './pages/visite/visite-edit/visite-edit.component';
import { VisiteListComponent } from './pages/visite/visite-list/visite-list.component';
import { AssuranceListComponent } from './pages/assurance/assurance-list/assurance-list.component';
import { AssuranceEditComponent } from './pages/assurance/assurance-edit/assurance-edit.component';
import { VehiculeSuiviComponent } from './pages/vehicule/vehicule-suivi/vehicule-suivi.component';
import { VehiculeViewComponent } from './pages/vehicule/vehicule-view/vehicule-view.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuGaucheComponent,
    ConnexionComponent,
    MenuHautComponent,
    DashboardComponent,
    VehiculeEditComponent,
    VehiculeListComponent,
    ConducteurListComponent,
    ConducteurEditComponent,
    AffectationEditComponent,
    AffectationListComponent,
    KilometrageListComponent,
    KilometrageEditComponent,
    RavitaillementEditComponent,
    RavitaillementListComponent,
    PanneEditComponent,
    PanneListComponent,
    ReparationListComponent,
    ReparationEditComponent,
    VisiteEditComponent,
    VisiteListComponent,
    AssuranceListComponent,
    AssuranceEditComponent,
    VehiculeSuiviComponent,
    VehiculeViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
