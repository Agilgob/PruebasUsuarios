import { ModalSignedDocument } from './ModalSignedDocument';

export class ModalPublishBulletin extends ModalSignedDocument{
    constructor(){}

    selectPublishDate(date = '2025-12-31') {
        this.inputPublishBulletinDate()
        .scrollIntoView()
        .should('be.visible')
        .click()
        .type(date, { force: true })
        .type('{enter}');
    }

    inputJudge(){
        return this.modal().contains('label', 'Nombre del Juez').siblings('input');
    }

    inputSecretary(){
        return this.modal().contains('label', 'Nombre del Secretario de Acuerdos').siblings('input');
    }

    textareaExcerptBulletin(){
        this.modal().find('textarea[aria-label="Extracto para boletín"]')
    }

    inputPublishBulletinDate(){
        return this.modal().find('input[placeholder="Da clic y elige la fecha correspondiente"]');
    }

}





