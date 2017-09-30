import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'

import {ContactUpdated, ContactViewed} from './messages'
import {WebAPI} from './web-api'
import {areEqual} from './utility';

@inject(WebAPI, EventAggregator)
export class ContactDetail {

    constructor(api, eventAggregator) {
        this.api = api;
        this.event = eventAggregator;
    }

    activate(params, routeConfig) {
        this.routeConfig = routeConfig;
    
        return this.api.getContactDetails(params.id).then(contact => {
          this.activeContact = contact;
          this.routeConfig.navModel.setTitle(contact.firstName);
          this.originalContact = JSON.parse(JSON.stringify(contact));
          this.event.publish(new ContactViewed(this.activeContact));
        });
      }

    getContact() {
        this.api.getContactDetails(this.id).then(res => this.activeContact = res);
    }

    get canSave() {
        return this.activeContact.firstName && this.activeContact.lastName && !this.api.isRequesting;
    }
    
    save() {
        this.api.saveContact(this.activeContact).then(contact => {
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