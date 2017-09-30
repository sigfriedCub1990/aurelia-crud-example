
import {ContactViewed, ContactUpdated, ContactDeleted} from './messages'

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
                                x.withBaseUrl('http://10.3.201.252:2403/contacts/')
                            });

        ea.subscribe(ContactViewed, msg => this.select(msg.contact));
        ea.subscribe(ContactUpdated, msg => {
            let id = msg.contact.id;
            let found = this.contacts.find(x => x.id === id);
            Object.assign(found, msg.contact);
        });
        ea.subscribe(ContactDeleted, msg => {
            let deletedContact = msg.contact;
            this.contacts = this.contacts.filter(contact => contact !== deletedContact);
        })
    }

    created(){
        this.client
            .get()
            .then(response => {
                this.contacts = JSON.parse(response.response);
            });
    }

    select(contact) {
        this.selectedId = contact.id;
        return true;
    }

    remove(contact) {
        if(confirm('Are you sure that you want to delete this contact?')) {
            this.client
                .delete(contact.id)
                .then(reponse => {
                    this.ea.publish(new ContactDeleted(contact))
                });
        }
    }
}

