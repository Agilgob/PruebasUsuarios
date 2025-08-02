export class TableExpedients {
    constructor() {}

    table() {
        return cy.get('table.table.table-bordered');
    }
    
    tableRows() {
        return this.table().find('tbody tr');
    }

}