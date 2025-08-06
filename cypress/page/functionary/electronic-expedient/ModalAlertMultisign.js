
export class ModalAlertMultisign{

    constructor() {}

    modal() {
        return cy.getModal('Atención');
    }

    btnAccept() {
        return this.modal().find('button').contains('Continuar');
    }

    btnCancel() {
        return this.modal().find('button').contains('Cancelar');
    }

    alertMessage() {
        return this.modal().find('h4');
    }
}