
export class SectionDocuments{
    constructor(){}

    table(){
        return cy.contains('th', 'Documentos').closest('table')
    }

    getTableRow(content){
        return this.table().contains('td', content).closest('tr')
    }

    getDotIndicator(rowObject){
        return cy.wrap(rowObject.find(':not(.dot-white)[class^="dot"]'))
    }
}