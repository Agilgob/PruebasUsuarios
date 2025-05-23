import http from 'k6/http';
import { check } from 'k6';

export const testLogin = (baseUrl, headersBase, user) => {
    const loginPayload = JSON.stringify(user);

    const loginRes = http.post(`${baseUrl}/api/v1/auth/sign_in`, loginPayload, {
        headers: headersBase,
    });

    check(loginRes, {
        'login 200': (r) => r.status === 200,
        'jwt presente': (r) => r.json('data.jwt') !== undefined,
    });
    const jwt = loginRes.json('data.jwt');
    return jwt;
}


export const testExpedients = (baseUrl, headersBase, jwt) => {

    const expedientsHeaders = {
        ...headersBase,
        Authorization: jwt,
    };

    const expedientsRes = http.get(
        `${baseUrl}/api/v1/electronic_expedients/find_by_court/10?page=1`,
        { headers: expedientsHeaders }
    );

    check(expedientsRes, {
        'expedientes 200': (r) => r.status === 200,
        'hay data': (r) => r.json('data') !== undefined,
    });

}


export const testPushNotifications = (baseUrl, headersBase, jwt) => {

    const pushNotificationsHeaders = {
        ...headersBase,
        Authorization: jwt,
    };

    const pushNotificationsRes = http.get(
        `${baseUrl}/api/v1/push_notifications/20?page=1`,
        { headers: pushNotificationsHeaders }
    );

    check(pushNotificationsRes, {
        'notificaciones push 200': (r) => r.status === 200,
        'contiene objeto notificaciones': (r) => r.json('data.notifications') !== undefined,
    });

}

export const testPendingSignatures = (baseUrl, headersBase, jwt) => {
   
    const pendingSignaturesHeaders = {
        ...headersBase,
        Authorization: jwt,
    };

    const pendingSignaturesRes = http.get(
        `${baseUrl}/api/v1/signature_documents/get_documents_pending_signature_by_user/10`,
        { headers: pendingSignaturesHeaders }
    );

    check(pendingSignaturesRes, {
    'pendientes de firma 200': (r) => r.status === 200,
    });

}