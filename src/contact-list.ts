
import {ContactViewed, ContactUpdated} from './messages'

import {EventAggregator} from 'aurelia-event-aggregator'
import {inject} from 'aurelia-framework'
import {HttpClient} from "aurelia-http-client";

@inject(EventAggregator)
export class ContactList {
    
    constructor(ea){
        this.ea = ea;
        this.contacts = [];
        this.client = new HttpClient()
                            .configure(x => {
                                x.withBaseUrl('http://10.3.201.252:2403/')
                            });

        ea.subscribe(ContactViewed, msg => this.select(msg.contact));
        ea.subscribe(ContactUpdated, msg => {
            let id = msg.contact.id;
            let found = this.contacts.find(x => x.id === id);
            Object.assign(found, msg.contact);
        });
    }

    created(){
        this.client
            .get('contacts')
            .then(response => {
                this.contacts = JSON.parse(response.response);
            });
    }

    select(contact) {
        this.selectedId = contact.id;
        return true;
    }
}

