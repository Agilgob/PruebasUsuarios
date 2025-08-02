
export class ModalPartsList{
    
    constructor() {}

    modal() {
        return cy.getModal('Listado de partes');
    }

    btnAddPart(){
        return this.modal().contains('button', 'Partes').parent().find('button');
    }

    btnClose(){
        return this.modal().find('button').contains('Cerrar');
    }
    
}