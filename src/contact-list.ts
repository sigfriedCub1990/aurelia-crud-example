import {EventAggregator} from 'aurelia-event-aggregator'

import {ContactViewed, ContactUpdated} from './messages'
import {WebAPI} from './web-api'
import {inject} from 'aurelia-framework'

@inject(WebAPI, EventAggregator)
export class ContactList {
    
    constructor(api, ea){
        this.api = api;
        this.ea = ea;
        this.contacts = [];

        ea.subscribe(ContactViewed, msg => this.select(msg.contact));
        ea.subscribe(ContactUpdated, msg => {
            let id = msg.contact.id;
            let found = this.contacts.find(x => x.id === id);
            Object.assign(found, msg.contact);
        });
    }

    created(){
        this.api.getContactList().then(contacts => this.contacts = contacts);
    }

    select(contact) {
        this.selectedId = contact.id;
        return true;
    }
}

