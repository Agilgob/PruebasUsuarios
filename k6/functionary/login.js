import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import { testLogin, testExpedients, testPushNotifications, testPendingSignatures } from './services/functionary.js';


export const options = {
    stages: [
        { duration: '30s', target: 3},
        { duration: '30s', target: 5},
        { duration: '2m', target: 5},
        { duration: '30s', target: 0 },
    ]
};

const data = new SharedArray('datos', () => [JSON.parse(open('./users.sandbox.json'))])[0]; 
export const AUTH_HEADER = data.authorization;
export const users = data.users;

const headersBase = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "Authorization": AUTH_HEADER,
};


export default function () {

    const user = users[__VU - 1];
    // const user = users[__VU % users.length];
    const baseUrl = 'https://sandbox.nilo.cjj.gob.mx';

    const jwt = testLogin(baseUrl, headersBase, user);

    if(!jwt) {
        // console.error('LOGIN NOK: ' + user.email);
        return;
    }else {
        // console.log('LOGIN OK: ' + user.email);
        testExpedients(baseUrl, headersBase, jwt);
        testPushNotifications(baseUrl, headersBase, jwt);
        testPendingSignatures(baseUrl, headersBase, jwt);
    }
}



