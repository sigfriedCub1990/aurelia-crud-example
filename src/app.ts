import {Router, RouterConfiguration} from 'aurelia-router';
import { inject } from "aurelia-framework";

import { WebAPI } from "./web-api";

@inject(WebAPI)
export class App {
  router: Router;

  constructor(api: WebAPI){}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Contacts';
    config.map([
      {route: '', moduleId: 'noselection', title: 'Selection'},
      {route: '/contacts/:id', moduleId: 'contactdetail', name: 'contacts'},
    ]);
    this.router = router;
  }
}

