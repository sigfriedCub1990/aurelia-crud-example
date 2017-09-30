
import {ContactViewed, ContactUpdated, ContactDeleted, ContactCreated} from './messages'
import {ContactService} from "./services/services";

import {EventAggregator} from 'aurelia-event-aggregator'
import {inject} from 'aurelia-framework'

@inject(EventAggregator, ContactService)
export class ContactList {
    private _contactService: ContactService;

    constructor(ea, contactService: ContactService){
        this.ea = ea;
        this.contacts = [];
        this._contactService = contactService;

        ea.subscribe(ContactViewed, msg => this.select(msg.contact));
        ea.subscribe(ContactUpdated, msg => {
            let id = msg.contact.id;
            let found = this.contacts.find(x => x.id === id);
            Object.assign(found, msg.contact);
        });
        ea.subscribe(ContactDeleted, msg => {
            let deletedContact = msg.contact;
            this.contacts = this.contacts.filter(contact => contact !== deletedContact);
        });
        ea.subscribe(ContactCreated, msg => {
            let contact = msg.contact;
            this.contacts.push(contact);
        });
    }

    created() {
        this._contactService.getContacts()
            .then(data => this.contacts = data)
            .catch(err => console.log(err));
    }

    select(contact) {
        this.selectedId = contact.id;
        return true;
    }

    remove(contact) {
        if(confirm('Are you sure that you want to delete this contact?')) {
            this._contactService
                .deleteContact(contact.id)
                .then(reponse => {
                    this.ea.publish(new ContactDeleted(contact))
                })
                .catch(err => console.log(err));
        }
    }
}

