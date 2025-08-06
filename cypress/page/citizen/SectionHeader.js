export class Header{
    constructor() {}

    navHeader() {
        return cy.get('div nav.navbar');
    }

    imgLogo() {
        return this.navHeader().find('a.navbar-brand img');
    }

    btnUserData(){
        return this.navHeader().find('aria-label="Toggle navigation"');
    }

    divUserData(){
        return this.navHeader().find('#responsive-navbar-nav');
    }

    userData(){
        // Returns the user data object that is visible, changes with the screen size
        if( Cypress.$('#responsive-navbar-nav').is(':visible')) {
            return this.divUserData();
        }else {
            return this.btnUserData();
        }
    }
    
}