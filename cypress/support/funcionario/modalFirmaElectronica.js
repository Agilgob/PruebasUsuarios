
export function modalFirmaElectronica(){
    return cy.getModal('Firma Electronica');
};

export function agregarArchivoButton() {
    return modalFirmaElectronica().contains('button', 'Agregar Archivo');
}

export function agregarArchivoFirmaFirel(archivoFirel){
    agregarArchivoButton().siblings('input').selectFile( archivoFirel, { force: true });
}


export function agregarFirmaButton() {
    cy.get('.modal-dialog', {'timeout':2000}).filter(':contains("Nuevo documento")').first().as('modalAgregarDocumento');
    return cy.get('@modalAgregarDocumento').contains('button', 'Agregar Firma')
}

export function contrasenaInput() {
    return modalFirmaElectronica().find('input[placeholder="Password"]')
}

export function agregarButton(){
    return modalFirmaElectronica().contains('button', 'Agregar')
}


export function firmarButton() {
    return modalFirmaElectronica().contains('button', 'Firmar')
}
// cy.get('div .modal-dialog').filter(':contains("Firma Electronica")').first().as('modalFirmaElectronica');
// cy.get('@modalFirmaElectronica').should('be.visible');

// cy.get('@modalFirmaElectronica').get('input[placeholder="Password"]').type(funcionario.passwordFirel);
// cy.get('@modalFirmaElectronica').contains('button', 'Agregar').click(); 