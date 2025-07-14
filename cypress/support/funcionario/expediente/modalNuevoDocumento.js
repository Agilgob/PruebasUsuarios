export function modalNuevoDocumento() {
    return cy.get('.modal-dialog .modal-content').filter(`:contains("Nuevo documento")`).first()
}

export function multifirmaButton() {
    return modalNuevoDocumento().find('#isMultipleSignatureToggleButton')
}

export function agregarFirmaButton() {
    return cy.get('.modal-dialog', {'timeout':2000}).filter(':contains("Nuevo documento")').first().contains('button', 'Agregar Firma')
}

export function cargarDocumento(documento){
    return cy.contains('div', 'Selecciona un documento').find('input[type=file]')
            .selectFile(documento, { force: true });
}     

export function tipoNofiticacionRadio(option){
    cy.contains('label', 'Tipo de Notificación')
        .parent()
        .contains('label', option)
        .siblings('input[type="radio"]')
        .check({ force: true });
}

export function deseaHacerNotifElectronica(val=true){
    cy.get('#electronicNotification-check').then($checkbox => {
        if ($checkbox.prop('checked') !== val) {
            cy.wrap($checkbox).click({force: true});
        }
    })    
}

export function firmarButton() {
    return modalNuevoDocumento().contains('button', 'Firmar')
}