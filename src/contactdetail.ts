import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import {HttpClient} from "aurelia-http-client";

import {ContactUpdated, ContactViewed} from './messages'
import {areEqual} from './utility';

@inject(EventAggregator)
export class ContactDetail {

    constructor(eventAggregator) {
        this.event = eventAggregator;
        this.client = new HttpClient().configure(x => {
            x.withBaseUrl('http://10.3.201.252:2403/contacts/')
        });
    }

    activate(params, routeConfig) {
        this.routeConfig = routeConfig;
        return this.client.get(params.id).then(contact => {
          this.activeContact = JSON.parse(contact.response);
          this.routeConfig.navModel.setTitle(this.activeContact.firstName);
          this.originalContact = JSON.parse(contact.response);
          this.event.publish(new ContactViewed(this.activeContact));
        });
      }

    get canSave() {
        return this.activeContact.firstName && this.activeContact.lastName;
    }
    
    save() {
        this.client.put(this.activeContact.id, this.activeContact).then(response => {
            console.log();
            this.activeContact = JSON.parse(response.response);
            this.routeConfig.navModel.setTitle(this.activeContact.firstName);
            this.originalContact = JSON.stringify(this.activeContact);
            this.event.publish(new ContactUpdated(this.activeContact));
        });
    }

    canDeactivate() {
        if(!areEqual(this.originalContact, this.activeContact)){
            let result = confirm('You have unsaved changes. Are you sure you wish to leave?');
            if(!result) {
                this.event.publish(new ContactViewed(this.activeContact));
            }
            return result;
        }
        return true;
    }

}