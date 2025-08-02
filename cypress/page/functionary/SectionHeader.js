export class SectionHeader{
    constructor() {}

    
    hambuerguerMenu() {}

    imgAppLogo() {}

    notificationIcon() {
        cy.get('nav-item dropleft').filter('') // TODO - Implementar lógica para obtener el icono de notificaciones
        return cy.get('div.navbar-nav a[aria-label="Notificaciones"]');
    }


}