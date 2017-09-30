import {Router, RouterConfiguration} from 'aurelia-router';
import { inject } from "aurelia-framework";


export class App {
  router: Router;

  constructor(){}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Contacts';
    config.map([
      {route: '', moduleId: 'noselection', title: 'Selection'},
      {route: '/contacts/:id', moduleId: 'contactdetail', name: 'contacts'},
      {route: '/contacts/create', moduleId: 'create-contact', name: 'create_contact'}
    ]);
    this.router = router;
  }
}

