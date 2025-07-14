

export function seccionPlantillas(){
    cy.get('div[class^="Tabs_tabs"]')
}


export function tabPlantilla(tab) {
    return cy.get('div[class^="Tabs_tabs"] li').filter(`:contains("${tab}")`).first()
}


export function tabPanelContent(){
    return cy.get('div[class*="tabPanelContent"]')
}

export function botonesPlantillas() {
    return cy.get('button[class^="BadgeWithOptions_badgeWiOptions"]')
}

export function agregarPlantilla() {
    return cy.get('button[aria-label^="Agregar plantilla"]')
}




export function modalNuevaPlantilla(){
    return cy.get('[class^="ModalComponentPortal_modal_content"]')
}

export function modalPlantillasDisponibles() {
    return modalNuevaPlantilla().find('iframe')
}

export function modalPlantilla(header = 'Documento de correo'){
    return cy.contains('header', header).parent()
}

export function modalPlantillaGuardar() {
    return modalPlantilla().find('button').contains('Guardar')
}


export function plantillasCargadas(){
    return tabPanelContent().should('be.visible').then($contenedor => {
        return Cypress.$($contenedor).find('article');
    });
}

