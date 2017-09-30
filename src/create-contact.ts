import {inject} from 'aurelia-framework';
import {EventAggregator} from "aurelia-event-aggregator";

import {ContactCreated} from './messages'
import {ContactService} from './services/services';

@inject(EventAggregator, ContactService)
export class CreateContact {
    private _contactService;
    private _ea;
    contact = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    };

    constructor(ea: EventAggregator, contactService: ContactService) {
        this._contactService = contactService;
        this._ea = ea;
    }

    create() {
        let contact = JSON.parse(JSON.stringify(this.contact));
        this._contactService.createContact(contact)
            .then(contact => {
                this._ea.publish(new ContactCreated(contact));
            }).catch(err => console.log(err));
    }
}