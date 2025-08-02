
export class PageMyExpedients {
    constructor() {}

    btnAddExpedient() {
        return cy.get('button').contains('Agregar Expediente');
    }

    inputSearch() {
        return cy.get('input[placeholder="Escribe el número de expediente"]');
    }

    btnSearch() {
        return cy.get('button').contains('Buscar');
    }

    btnClearSearch() {
        return cy.get('button').contains('Limpiar');
    }

    btnTurnExpedient() {
        return cy.get('button').contains('Turnar expedientes seleccionados');
    }

    
}