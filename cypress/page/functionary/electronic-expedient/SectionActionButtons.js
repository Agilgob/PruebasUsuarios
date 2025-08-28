export class SectionActionButtons{
    constructor(){
       
    }

    section(){
        return  cy.get('section[class^="ExpedientActions_actions"]')
    }

    findButton(btnText){
        return this.section().contains('span', btnText ).closest('button')
    }

    btnPrintCover() {
        return this.findButton('Imprimir carátula')
    }

    btnTurnExpedient(){
        return this.findButton('Turnar expediente')
    }

    btnIndicators(){
        return this.findButton('Indicadores')
    }

    btnExpedientPermissions(){
        return this.findButton('Permisos de expediente')
    }

    btnAddDocument() {
        return this.findButton('Agregar documento')
    }

    btnViewFullExpedient() {
        return this.findButton('Ver expediente completo')
    }

    btnDownloadExpedient() {
        return this.findButton('Descarga expediente')
    }

    btnGenerateQRCode() {
        return this.findButton('Generar código QR')
    }

    btnListParts() {
        return this.findButton('Listar Partes')
    }
}
