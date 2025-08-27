export class ModalElectronicSignature{
    constructor(){
       
    }

    modal(){
        return cy.getModal('Firma Electronica')
    }
    
    tabFirelSignature(){
        return this.modal().contains('a', 'Firel').closests('.nav-tabs')
    }

    btnAddFirelFile(){
        return this.modal().contains('Agregar Archivo')
    }

    inputPassword(){
        return this.modal().find('input[placeholder="Password"]')
    }

    btnAdd(){
        return this.modal().contains('button', 'Agregar')
    }

    btnCancel(){
        return this.modal().contains('button', 'Cancelar')
    }

    // This section is for interacting with the Firel Signature Modal

    // Load Firel File
    loadFirelFile(filePath){
        return this.modal().find('input[type=file]')
            .selectFile(filePath, { force: true });
    }

}