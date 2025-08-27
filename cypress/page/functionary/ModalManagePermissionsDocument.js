export class ModalManagePermissionsDocument {
    constructor() {}

    modal() {
        return cy.getModal('Gestionar usuarios con acceso al documento');
    }

    btnSave() {
        return this.modal().find('.modal-footer').contains('button', 'Guardar');
    }

    btnClose() {
        return this.modal().find('.modal-footer').contains('button', 'Cerrar');
    }

    getModalWarning(){
        return new ModalAttention();
    }
}


class ModalAttention {
    constructor() {}

    modal() {
        return cy.getModal('Atencion!');
    }

    btnClose() {
        return this.modal().find('.modal-footer').contains('button', 'Cerrar');
    }

    btnAccept() {
        return this.modal().find('.modal-footer').contains('button', 'Aceptar');
    }
}