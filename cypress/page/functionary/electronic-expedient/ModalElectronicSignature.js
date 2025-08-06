

export class ModalElectronicSignature {
    constructor() {}

    modal(){
        return cy.getModal('Firma Electronica');
    }


    btnAddFirelFile() {
        return this.modal().find('button').contains('Agregar Archivo');
    }

    inputPassword(){
        return this.modal().find('#formGroupPasswordFiel');
    }

    btnAdd(){
        return this.modal().find('button').contains('Agregar');
    }

    btnCancel(){
        return this.modal().find('button').contains('Cancelar');
    }

    labelSignatureDocumentLoaded(){
        return this.modal().find('.bg-success')
    }

    messageError() {
        return this.modal().find('.text-danger');
    }

    // Methods to interact with the modal

    selectFirelFile(filePath){
        this.modal().find('input[type=file]').selectFile(filePath, { force: true });
    }

}



