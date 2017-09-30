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
          this.routeConfig.navModel.setTitle(contact.firstName);
          this.originalContact = JSON.parse(contact.response);
          this.event.publish(new ContactViewed(this.activeContact));
        });
      }

    getContact() {
        this.client.get(this.id).then(res => this.activeContact = res);
    }

    get canSave() {
        return this.activeContact.firstName && this.activeContact.lastName;
    }
    
    save() {
        this.client.post(this.activeContact).then(contact => {
            this.activeContact = contact;
            this.routeConfig.navModel.setTitle(contact.firstName);
            this.originalContact = JSON.parse(JSON.stringify(contact));
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