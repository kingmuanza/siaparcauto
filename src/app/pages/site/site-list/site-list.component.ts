import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/options/datatable.options';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent implements OnInit, OnDestroy {

  dtTrigger = new Subject();
  dtOptions: DataTables.Settings = {
    language: DATATABLES_OPTIONS_LANGUAGE
  };
  enSynchronisation = false;

  sites = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.getSites();
  }

  getSites() {

    this.enSynchronisation = true;
    this.sites = [];
    const db = firebase.firestore();
    db.collection('sites').get().then((resultats) => {
      resultats.forEach(resultat => {
        console.log(resultat.data());
        this.sites.push(resultat.data());
      });
      this.dtTrigger.next();
      this.enSynchronisation = false;
    });
  }

  refresh() {
    this.dtTrigger = new Subject();
    this.getSites();
  }

  edit(site) {
    this.router.navigate(['site', 'edit', site.id]);
  }
  add() {
    this.router.navigate(['site', 'edit']);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
