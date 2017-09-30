import { HttpClient } from "aurelia-http-client";
import { inject } from "aurelia-framework";

import api from '../config/api';

@inject(HttpClient)
export class ContactService {
    private http:HttpClient;
    contacts = [];

    constructor(http:HttpClient) {
        http.configure(x => x.withBaseUrl(api.dev + '/contacts/'));
        this.http = http;
    }

    getContacts() {
        let promise = new Promise((resolve, reject) => {
            this.http
                .get()
                .then(data => {
                    this.contacts = JSON.parse(data.response);
                    resolve(this.contacts)
                }).catch(err => reject(err));
        });
        return promise;
    }

    createContact(contact) {
        let promise = new Promise((resolve, reject) => {
            this.http
                .post(contact)
                .then(data => {
                    let newContact = JSON.parse(data.response);
                    resolve(newContact);
                }).catch(err => reject(err));
        });
        return promise;
    }

    getContact(id) {
        let promise = new Promise((resolve, reject) => {
            this.http
                .get(id)
                .then(response => {
                    let contact = JSON.parse(response.response);
                    resolve(contact);
                }).catch(err => reject(err))
        });
        return promise;
    }

    deleteContact(id) {
        let promise = new Promise((resolve, reject) => {
            this.http
                .delete(id)
                .then(response => {
                    let response = JSON.parse(response.response);
                    resolve(response);
                })
                .catch(err => reject(err));
        });
        return promise;
    }

    updateClient(id, contact) {
        let promise = new Promise((resolve, reject) => {
            this.http
                .put(id, contact)
                .then(response => {
                    let contact = JSON.parse(response.response);
                    resolve(contact);
                }).catch(err => reject(err));
        });
        return promise;
    }
}