import { SectionCover } from './electronic-expedient/SectionCover'
import { SectionActionButtons } from './electronic-expedient/SectionActionButtons';
import { SectionDocumentFinder } from './electronic-expedient/SectionDocumentFinder';
import { SectionDocuments } from './electronic-expedient/SectionDocuments';
import { SectionTemplates } from './electronic-expedient/SectionTemplates';

export class PageElectronicExpedient{
    
    constructor(){
        this.coverSection = new SectionCover();
        this.actionButtons = new SectionActionButtons();
        this.DocumentFinder = new SectionDocumentFinder();
        this.templates = new SectionTemplates();
        this.documents = new SectionDocuments();
    }

}



